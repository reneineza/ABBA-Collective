'use client';

import React from 'react';
import Button from '@/components/Button';
import { AlertCircle, RefreshCw, Mail } from 'lucide-react';

export default function CheckoutFailedPage() {
  return (
    <div className="bg-ivory text-charcoal py-20 sm:py-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-3">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Payment Notice ✦
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-charcoal">
            Payment Transaction Unsuccessful
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed max-w-md mx-auto">
            We were unable to process your payment transaction. Your bag items remain safely preserved.
          </p>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <Button href="/checkout" variant="primary" size="lg">
            <RefreshCw size={15} className="mr-2" /> Retry Checkout
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            <Mail size={15} className="mr-2" /> Contact Client Concierge
          </Button>
        </div>

      </div>
    </div>
  );
}
