'use client';

import React, { useEffect } from 'react';
import Button from '@/components/Button';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled App Error:', error);
  }, [error]);

  return (
    <div className="bg-ivory text-charcoal min-h-[70vh] flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md space-y-6">
        <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
          ✦ System Notice ✦
        </span>
        <h1 className="font-serif-luxury text-4xl font-bold text-charcoal">
          An Unexpected Error Occurred
        </h1>
        <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
          We apologize for the inconvenience. Our engineering team has been notified.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-charcoal text-ivory text-xs uppercase tracking-widest font-bold hover:bg-forest transition-colors"
          >
            Try Again
          </button>
          <Button href="/" variant="secondary" size="md">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
