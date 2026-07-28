import React from 'react';

export const metadata = {
  title: 'Shipping Policy | ABBA Collective',
  description: 'Understand shipping options, delivery times, and complimentary shipping thresholds.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-charcoal/10 pb-6 space-y-2">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Client Logistics ✦
          </span>
          <h1 className="font-serif-luxury text-4xl font-bold text-charcoal">
            Shipping & Logistics Policy
          </h1>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-charcoal/80 font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">1. Delivery Scope & Coverage</h2>
            <p>
              ABBA Collective exclusively delivers within <strong>Rwanda</strong> (covering Kigali City and all provincial regions). International delivery services will be launched in future collection releases.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">2. Complimentary Delivery Threshold</h2>
            <p>
              We provide complimentary insured doorstep delivery across Rwanda on all garment orders over <strong>200,000 RWF</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">3. Delivery Options & Timelines</h2>
            <p>
              • <strong>Kigali City Doorstep Delivery:</strong> 24 – 48 Hours (15,000 RWF or Complimentary over 200,000 RWF)<br />
              • <strong>Rwanda Provinces Express Delivery:</strong> 1 – 3 Business Days (15,000 RWF or Complimentary over 200,000 RWF)
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
