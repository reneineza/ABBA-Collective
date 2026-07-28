'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import { CheckCircle2, ArrowRight, ShieldCheck, Mail, Package } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-ivory text-charcoal py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Checkmark Badge */}
        <div className="w-20 h-20 rounded-full bg-forest/10 text-forest border border-forest/30 flex items-center justify-center mx-auto shadow-gold">
          <CheckCircle2 size={40} className="text-gold" />
        </div>

        <div className="space-y-3">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Order Confirmed ✦
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-charcoal">
            Thank You for Your Order
          </h1>
          <p className="text-sm sm:text-base text-charcoal/80 font-light max-w-xl mx-auto leading-relaxed">
            Your purchase has been received. A digital order receipt and confirmation has been dispatched to your email address.
          </p>
        </div>

        {/* Callout Box */}
        <div className="bg-ivory-light border border-charcoal/10 p-8 rounded-sm space-y-4 max-w-lg mx-auto text-left shadow-subtle">
          <div className="flex items-center space-x-3 text-forest border-b border-charcoal/10 pb-3">
            <ShieldCheck size={18} className="text-gold" />
            <h4 className="font-serif-luxury text-lg font-bold text-charcoal">What Happens Next?</h4>
          </div>
          <ul className="space-y-2 text-xs text-charcoal/80 font-light">
            <li className="flex items-center gap-2">
              <span className="text-gold font-bold">1.</span> Atelier garment inspection & precision packaging.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gold font-bold">2.</span> Insured dispatch with live tracking updates.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gold font-bold">3.</span> Delivered in signature ABBA Collective gift box.
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="pt-4 flex justify-center gap-4">
          <Button href="/orders" variant="primary" size="lg">
            View Order Receipt <ArrowRight size={15} className="ml-2" />
          </Button>
          <Button href="/shop" variant="secondary" size="lg">
            Continue Browsing
          </Button>
        </div>

        <p className="text-xs italic font-serif text-charcoal/60 pt-4">
          "Identity Received. Grace Revealed."
        </p>

      </div>
    </div>
  );
}
