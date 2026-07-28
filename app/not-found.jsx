import React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';

export default function NotFound() {
  return (
    <div className="bg-ivory text-charcoal min-h-[70vh] flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md space-y-6">
        <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
          ✦ Page Not Found ✦
        </span>
        <h1 className="font-serif-luxury text-6xl font-bold text-charcoal">
          404
        </h1>
        <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">
          This Path Does Not Exist
        </h2>
        <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
          The garment or page you are looking for has been relocated or is no longer available.
        </p>
        <div className="pt-2">
          <Button href="/" variant="primary" size="lg">
            Return to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
