import React from 'react';
import { formatPrice } from '@/lib/utils/formatCurrency';
import { DELIVERY_ZONES, FREE_DELIVERY_THRESHOLD } from '@/lib/utils/delivery';

export const metadata = {
  title: 'Delivery Policy | ABBA',
  description: 'Delivery fees, timelines and coverage for ABBA orders across Rwanda.',
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
            Delivery Policy
          </h1>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-charcoal/80 font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">1. Delivery Coverage</h2>
            <p>
              ABBA delivers within <strong>Rwanda</strong>, covering Kigali City and all 30 districts across the Northern, Southern, Eastern and Western Provinces. International delivery will be introduced in a future collection release.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">2. Delivery Fees & Timelines</h2>
            <p>
              • <strong>{DELIVERY_ZONES.kigali.label} (Gasabo, Kicukiro, Nyarugenge):</strong> {DELIVERY_ZONES.kigali.timeline} — {formatPrice(DELIVERY_ZONES.kigali.fee)}<br />
              • <strong>{DELIVERY_ZONES.provinces.label}:</strong> {DELIVERY_ZONES.provinces.timeline} — {formatPrice(DELIVERY_ZONES.provinces.fee)}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">3. Complimentary Delivery</h2>
            <p>
              Delivery is complimentary anywhere in Rwanda on orders of <strong>{formatPrice(FREE_DELIVERY_THRESHOLD)}</strong> or more.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">4. How Delivery Works</h2>
            <p>
              Our rider will call the phone number on your order before arriving. Please make sure it is reachable and include clear directions or a nearby landmark with your address. Orders to other provinces may be sent with a trusted courier, in which case we share the tracking details with you by SMS or WhatsApp.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
