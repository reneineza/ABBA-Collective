import React from 'react';

export const metadata = {
  title: 'Returns Policy | ABBA Collective',
  description: 'Garment returns and exchange guidelines for ABBA Collective clients.',
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
              To request a return shipping label, contact our Atelier Client Concierge at <strong>concierge@abbacollective.com</strong> with your order reference number.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
