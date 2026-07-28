import React from 'react';

export const metadata = {
  title: 'Terms of Service | ABBA Collective',
  description: 'Review the terms and conditions governing the use of ABBA Collective website and garment orders.',
};

export default function TermsPage() {
  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-charcoal/10 pb-6 space-y-2">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Legal Governance ✦
          </span>
          <h1 className="font-serif-luxury text-4xl font-bold text-charcoal">
            Terms of Service
          </h1>
          <p className="text-xs text-charcoal/60">Effective Date: July 28, 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-charcoal/80 font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">1. Brand Identity & Intellectual Property</h2>
            <p>
              All designs, photography, scripture reflections, logo marks, and narrative copy on ABBA Collective remain the sole intellectual property of ABBA Collective. Unauthorized replication is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">2. Garment Purchasing & Pricing</h2>
            <p>
              Prices listed are in US Dollars ($ USD). We reserve the right to update product pricing, variant stock levels, or collection drops at any time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
