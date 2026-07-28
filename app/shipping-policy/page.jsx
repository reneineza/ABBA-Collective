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
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">1. Complimentary Shipping</h2>
            <p>
              We provide complimentary insured global shipping on all garment orders over <strong>270,000 RWF</strong> ($200 USD equivalent).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">2. Delivery Options & Processing</h2>
            <p>
              • <strong>Rwanda / East Africa Express:</strong> 1 – 2 business days (13,500 RWF)<br />
              • <strong>Standard International Shipping:</strong> 4 – 7 business days (20,250 RWF)
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
