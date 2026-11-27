import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleData';
import { getDeliveryFee } from '@/lib/utils/delivery';
import { getProvinceForDistrict, isValidRwandaPhone, isPhoneOnNetwork, formatRwandaPhone } from '@/lib/utils/rwanda';
import { createPayment } from '@/lib/payments/paymentService';
import { sendOrderConfirmation } from '@/lib/email/emailService';
import { orderNumber, pointsForPurchase } from '@/lib/utils/orders';

const PAYMENT_PROVIDERS = ['MTN MoMo', 'Airtel Money', 'Card'];
const MAX_QUANTITY = 20;

function fail(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// Places an order. Prices, delivery fee and totals are recalculated here from the
// catalogue; amounts sent by the browser are ignored so they can't be tampered with.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail('Invalid request.');
  }
  const { items, contact, shippingAddress, paymentProvider, momoNumber } = body || {};

  // Validate and price the items
  if (!Array.isArray(items) || items.length === 0) return fail('Your bag is empty.');
  const lineItems = [];
  for (const item of items) {
    const product = SAMPLE_PRODUCTS.find((p) => p.id === item.productId);
    const quantity = Number(item.quantity);
    if (!product) return fail('One of the items in your bag is no longer available. Please remove it and try again.');
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return fail('Invalid quantity in your bag.');
    if (product.sizes && !product.sizes.includes(item.size)) return fail(`Size ${item.size} is not available for ${product.name}.`);
    if (product.colors && !product.colors.includes(item.color)) return fail(`${item.color} is not available for ${product.name}.`);
    lineItems.push({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      quantity,
      size: item.size,
      color: item.color,
      image: product.images?.[0]?.image_url || product.image_url || null,
    });
  }

  // Validate contact and delivery details
  const email = String(contact?.email || '').trim();
  if (!email.includes('@')) return fail('Please enter a valid email address.');
  if (!isValidRwandaPhone(contact?.phone)) return fail('Please enter a valid Rwandan phone number.');
  const district = shippingAddress?.district;
  if (!getProvinceForDistrict(district)) return fail('Please choose your district for delivery.');
  if (!shippingAddress?.address_line) return fail('Please enter your street address.');
  if (!PAYMENT_PROVIDERS.includes(paymentProvider)) return fail('Please choose a payment method.');
  if (paymentProvider !== 'Card' && !isPhoneOnNetwork(momoNumber, paymentProvider)) {
    return fail(`Please enter a valid ${paymentProvider} number.`);
  }

  const subtotal = lineItems.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shippingFee = getDeliveryFee(subtotal, district);
  const total = subtotal + shippingFee;

  // Signed-in customer (optional: guests can check out too)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    console.error(err.message);
    return fail('Checkout is temporarily unavailable. Please try again shortly.', 503);
  }

  const orderId = randomUUID();
  const payment = await createPayment({
    orderId,
    provider: paymentProvider,
    amount: total,
    customerEmail: email,
    phoneNumber: paymentProvider !== 'Card' ? formatRwandaPhone(momoNumber) : undefined,
  });
  if (!payment.success) return fail(payment.message || 'Payment was not completed. Please try again.', 402);

  const receiptToken = randomUUID().replace(/-/g, '');
  const order = {
    id: orderId,
    user_id: user?.id ?? null,
    status: payment.status === 'Completed' ? 'Confirmed' : 'Pending',
    items: lineItems,
    subtotal,
    shipping_fee: shippingFee,
    total_amount: total,
    currency: 'RWF',
    shipping_address: {
      first_name: shippingAddress.first_name,
      last_name: shippingAddress.last_name,
      phone: formatRwandaPhone(shippingAddress.phone || contact.phone),
      country: 'Rwanda',
      province: getProvinceForDistrict(district),
      district,
      city: district,
      address_line: shippingAddress.address_line,
      landmark: shippingAddress.landmark || null,
    },
    customer_name: String(contact?.fullName || '').trim() || null,
    customer_email: email,
    customer_phone: formatRwandaPhone(contact.phone),
    payment_provider: paymentProvider,
    transaction_id: payment.transactionId,
    receipt_token: receiptToken,
  };

  const { error } = await admin.from('orders').insert(order);
  if (error) {
    console.error('Order insert failed:', error.message);
    return fail(
      `Your payment went through but we could not save your order. Please contact us with reference ${orderNumber(orderId)} and we will sort it out.`,
      500
    );
  }

  // Loyalty points for signed-in customers
  const points = pointsForPurchase(subtotal);
  if (user && points > 0) {
    const { error: pointsError } = await admin.from('loyalty_points').insert({
      user_id: user.id,
      points,
      transaction_type: 'Purchase',
      description: `Earned from order #${orderNumber(orderId)}`,
    });
    if (pointsError) console.error('Points insert failed:', pointsError.message);
  }

  await sendOrderConfirmation({ order, customerEmail: email });

  return NextResponse.json({ orderId, receiptToken, total });
}
