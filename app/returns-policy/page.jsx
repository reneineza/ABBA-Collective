import React from 'react';

export const metadata = {
  title: 'Returns Policy | ABBA',
  description: 'Garment returns and exchange guidelines for ABBA clients.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-charcoal/10 pb-6 space-y-2">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Client Concierge ✦
          </span>
          <h1 className="font-serif-luxury text-4xl font-bold text-charcoal">
            Returns & Exchanges Policy
          </h1>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-charcoal/80 font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">1. 30-Day Return Guarantee</h2>
            <p>
              Garments in unworn, unwashed condition with original security tags attached may be returned within 30 days of delivery for a full refund or size exchange.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">2. Initiating a Return</h2>
            <p>
              Contact our Client Concierge on WhatsApp or by phone at <strong>+250 789 284 564</strong>, or by email at <strong>info@abbacollective.com</strong>, with your order reference number. We will confirm your return and arrange with you how the garment gets back to our Kigali studio.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">3. Refunds</h2>
            <p>
              Once we receive and inspect the returned garment, refunds are issued in Rwandan Francs (RWF) to your original payment method: the same MTN MoMo or Airtel Money number used at checkout, or the Visa / Mastercard used for the order.
            </p>
            <p>
              Size exchanges are dispatched once the original garment has been received, subject to stock availability.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
