// In-store sales (sales made outside the website). Prices are set by the database from
// the catalogue; staff choose items, quantities, payment method and an optional discount.
import { getBrowserClient } from '@/lib/supabase';

function friendly(error) {
  const message = error?.message || 'Something went wrong';
  if (message.includes('OUT_OF_STOCK:')) return new Error('Not enough stock: ' + message.split('OUT_OF_STOCK:')[1]);
  return new Error(message);
}

export async function recordStoreSale({ paymentMethod, customerName, customerPhone, discount, notes, items }) {
  const { data, error } = await getBrowserClient().rpc('record_store_sale', {
    payment_method: paymentMethod,
    customer_name: customerName,
    customer_phone: customerPhone,
    discount: Number(discount) || 0,
    notes,
    items: items.map((i) => ({ variant_id: i.variantId, quantity: Number(i.quantity) })),
  });
  if (error) throw friendly(error);
  return data;
}

const SALE_SELECT = '*, created_by:profiles (full_name, email), items:store_sale_items (*)';

// Sales between two dates (inclusive), newest first
export async function listStoreSales(fromDate, toDate) {
  let query = getBrowserClient().from('store_sales').select(SALE_SELECT).order('sold_at', { ascending: false });
  if (fromDate) query = query.gte('sold_at', `${fromDate}T00:00:00+02:00`);
  if (toDate) query = query.lte('sold_at', `${toDate}T23:59:59+02:00`);
  const { data, error } = await query;
  if (error) throw friendly(error);
  return data;
}

export async function getStoreSale(id) {
  const { data, error } = await getBrowserClient().from('store_sales').select(SALE_SELECT).eq('id', id).maybeSingle();
  if (error) throw friendly(error);
  return data;
}

export async function deleteStoreSale(id) {
  const { error } = await getBrowserClient().rpc('delete_store_sale', { sale: id });
  if (error) throw friendly(error);
}

export async function setVariantCost(variantId, cost) {
  const { error } = await getBrowserClient().rpc('set_variant_cost', { variant: variantId, cost: Number(cost) });
  if (error) throw friendly(error);
}
