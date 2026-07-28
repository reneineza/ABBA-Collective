'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { createPayment } from '@/lib/payments/paymentService';
import { sendOrderConfirmation } from '@/lib/email/emailService';
import { trackCheckoutStarted, trackPurchase } from '@/lib/analytics/analyticsService';
import { safeJsonParse } from '@/lib/utils/json';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Lock, ArrowRight, ArrowLeft, CreditCard, Smartphone, Wallet, Loader2 } from 'lucide-react';
import AddressForm from './AddressForm';

export default function CheckoutForm() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState(user?.email || profile?.email || '');
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');

  const [shippingAddress, setShippingAddress] = useState({
    first_name: profile?.full_name ? profile.full_name.split(' ')[0] : '',
    last_name: profile?.full_name ? profile.full_name.split(' ')[1] || '' : '',
    phone: profile?.phone || '',
    country: 'Rwanda',
    city: 'Kigali',
    address_line: '',
    postal_code: '',
  });

  const [paymentProvider, setPaymentProvider] = useState('Card');

  const shippingCost = cartTotal >= 200000 ? 0 : 15000;
  const grandTotal = cartTotal + shippingCost;

  const handleProceedToPayment = () => {
    trackCheckoutStarted(cartTotal, cart.length);
    setStep(4);
  };

  const handleCompleteOrder = async () => {
    setLoading(true);

    try {
      const newOrderId = 'ord_' + Math.random().toString(36).substr(2, 9);
      
      const paymentRes = await createPayment({
        orderId: newOrderId,
        provider: paymentProvider,
        amount: grandTotal,
        customerEmail: email,
      });

      const newOrder = {
        id: newOrderId,
        user_id: user?.id || 'usr_guest',
        status: 'Confirmed',
        total_amount: grandTotal,
        shipping_address: shippingAddress,
        payment_provider: paymentProvider,
        transaction_id: paymentRes.transactionId,
        created_at: new Date().toISOString(),
        items: cart.map((item) => ({
          name: item.name,
          slug: item.slug,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })),
      };

      await sendOrderConfirmation({ order: newOrder, customerEmail: email });
      trackPurchase(newOrderId, grandTotal);

      const existingOrders = safeJsonParse(localStorage.getItem('abba_orders_history'), []);
      const validOrders = Array.isArray(existingOrders) ? existingOrders : [];
      localStorage.setItem('abba_orders_history', JSON.stringify([newOrder, ...validOrders]));

      clearCart();
      router.push('/checkout/success');
    } catch (err) {
      console.error('Order creation error:', err);
      router.push('/checkout/failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      
      {/* LEFT: Checkout Wizard Steps (Col 1-7) */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-charcoal/10 pb-4 text-xs font-semibold uppercase tracking-widest">
          <span className={`pb-2 border-b-2 transition-all ${step >= 1 ? 'border-gold text-forest' : 'border-transparent text-charcoal/40'}`}>
            1. Info
          </span>
          <span className={`pb-2 border-b-2 transition-all ${step >= 2 ? 'border-gold text-forest' : 'border-transparent text-charcoal/40'}`}>
            2. Address
          </span>
          <span className={`pb-2 border-b-2 transition-all ${step >= 3 ? 'border-gold text-forest' : 'border-transparent text-charcoal/40'}`}>
            3. Review
          </span>
          <span className={`pb-2 border-b-2 transition-all ${step >= 4 ? 'border-gold text-forest' : 'border-transparent text-charcoal/40'}`}>
            4. Payment
          </span>
        </div>

        {/* STEP 1: CUSTOMER INFORMATION */}
        {step === 1 && (
          <div className="bg-ivory-light border border-charcoal/10 p-6 sm:p-8 space-y-6 rounded-sm">
            <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">
              Step 1: Client Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1 text-charcoal">
                  Email Address for Order Confirmation
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@abbacollective.com"
                  className="w-full p-3.5 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1 text-charcoal">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Grace Heirs"
                    className="w-full p-3.5 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1 text-charcoal">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 788 123 456"
                    className="w-full p-3.5 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep(2)}
                disabled={!email}
                className="px-8 py-3.5 bg-charcoal text-ivory hover:bg-forest transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2"
              >
                Continue to Shipping <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SHIPPING ADDRESS */}
        {step === 2 && (
          <div className="space-y-6">
            <AddressForm
              initialAddress={shippingAddress}
              onSave={(updatedAddress) => {
                setShippingAddress(updatedAddress);
                setStep(3);
              }}
            />
            <button
              onClick={() => setStep(1)}
              className="text-xs uppercase tracking-widest font-semibold text-charcoal/60 hover:text-gold flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Back to Information
            </button>
          </div>
        )}

        {/* STEP 3: ORDER REVIEW */}
        {step === 3 && (
          <div className="bg-ivory-light border border-charcoal/10 p-6 sm:p-8 space-y-6 rounded-sm">
            <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">
              Step 3: Review Order & Delivery
            </h3>
            
            <div className="bg-ivory p-4 border border-charcoal/10 rounded-sm space-y-2 text-xs">
              <div className="flex justify-between border-b border-charcoal/10 pb-2">
                <span className="font-semibold text-gold uppercase tracking-wider">Recipient</span>
                <span>{fullName} ({email})</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-semibold text-gold uppercase tracking-wider">Destination</span>
                <span className="text-right">{shippingAddress.address_line}, {shippingAddress.city}, {shippingAddress.country}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(2)}
                className="text-xs uppercase tracking-widest font-semibold text-charcoal/60 hover:text-gold flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Edit Address
              </button>
              <button
                onClick={handleProceedToPayment}
                className="px-8 py-3.5 bg-charcoal text-ivory hover:bg-forest transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2"
              >
                Proceed to Payment <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT PREPARATION & SUBMISSION */}
        {step === 4 && (
          <div className="bg-ivory-light border border-charcoal/10 p-6 sm:p-8 space-y-6 rounded-sm">
            <div className="space-y-1">
              <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">
                Step 4: Select Payment Method
              </h3>
              <p className="text-xs text-charcoal/60 font-light">
                Encrypted & secure checkout architecture ready for Stripe, Mobile Money & Card providers.
              </p>
            </div>

            {/* Provider Selection Cards */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentProvider('Card')}
                className={`p-4 border text-center rounded-sm space-y-2 transition-all ${
                  paymentProvider === 'Card'
                    ? 'border-gold bg-gold/10 text-charcoal font-semibold shadow-sm'
                    : 'border-charcoal/20 bg-ivory text-charcoal/70 hover:border-gold'
                }`}
              >
                <CreditCard size={20} className="mx-auto text-gold" />
                <span className="text-xs tracking-wider uppercase block">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentProvider('Stripe')}
                className={`p-4 border text-center rounded-sm space-y-2 transition-all ${
                  paymentProvider === 'Stripe'
                    ? 'border-gold bg-gold/10 text-charcoal font-semibold shadow-sm'
                    : 'border-charcoal/20 bg-ivory text-charcoal/70 hover:border-gold'
                }`}
              >
                <Wallet size={20} className="mx-auto text-gold" />
                <span className="text-xs tracking-wider uppercase block">Stripe Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentProvider('Mobile Money')}
                className={`p-4 border text-center rounded-sm space-y-2 transition-all ${
                  paymentProvider === 'Mobile Money'
                    ? 'border-gold bg-gold/10 text-charcoal font-semibold shadow-sm'
                    : 'border-charcoal/20 bg-ivory text-charcoal/70 hover:border-gold'
                }`}
              >
                <Smartphone size={20} className="mx-auto text-gold" />
                <span className="text-xs tracking-wider uppercase block">Mobile Money</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-charcoal/10 flex justify-between items-center">
              <button
                onClick={() => setStep(3)}
                className="text-xs uppercase tracking-widest font-semibold text-charcoal/60 hover:text-gold flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back to Review
              </button>

              <button
                onClick={handleCompleteOrder}
                disabled={loading}
                className="px-10 py-4 bg-forest text-ivory hover:bg-forest-dark transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2 shadow-xl"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Lock size={15} /> Complete & Place Order ({formatCurrency(grandTotal)})
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* RIGHT: Order Summary Sidebar (Col 8-12) */}
      <div className="lg:col-span-5 bg-charcoal text-ivory p-6 sm:p-8 rounded-sm space-y-6 shadow-xl border border-gold/30">
        <div className="border-b border-ivory/10 pb-4">
          <span className="text-gold text-[10px] uppercase tracking-luxurious block font-semibold">
            Order Breakdown
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-ivory">
            Summary ({cart.length} Items)
          </h3>
        </div>

        {/* Item Rows */}
        <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
          {cart.map((item) => (
            <div key={item.itemKey} className="flex gap-3 items-center justify-between text-xs border-b border-ivory/10 pb-3">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-14 bg-ivory rounded-sm overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                </div>
                <div>
                  <p className="font-semibold text-ivory">{item.name}</p>
                  <p className="text-[10px] text-ivory/60">
                    Qty: {item.quantity} | {item.color} / {item.size}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-gold">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        {/* Pricing Subtotal */}
        <div className="space-y-2 text-xs border-t border-ivory/10 pt-4">
          <div className="flex justify-between text-ivory/80">
            <span>Subtotal</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
          <div className="flex justify-between text-ivory/80">
            <span>Insured Shipping</span>
            <span>{shippingCost === 0 ? 'Complimentary' : formatCurrency(shippingCost)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-gold border-t border-ivory/10 pt-3">
            <span>Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-center text-ivory/60 italic font-serif border-t border-ivory/10">
          "Identity Received. Grace Revealed."
        </div>
      </div>

    </div>
  );
}
