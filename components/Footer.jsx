'use client';

import React from 'react';
import Link from 'next/link';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory pt-16 pb-12 border-t border-gold/20">
      {/* Scripture Anchor Section */}
      <div className="max-w-4xl mx-auto text-center px-4 mb-16 border-b border-ivory/10 pb-12">
        <span className="text-gold text-xs tracking-luxurious uppercase block mb-3">
          ✦ Sacred Foundation ✦
        </span>
        <blockquote className="font-serif-luxury text-xl sm:text-2xl italic leading-relaxed text-ivory/90 font-light mb-4">
          "For you did not receive the spirit of slavery to fall back into fear, but you have received the Spirit of adoption by whom we cry, 'Abba! Father!'"
        </blockquote>
        <cite className="text-xs uppercase tracking-widest text-gold not-italic font-medium">
          — Romans 8:15
        </cite>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-16">
          {/* Brand Identity & Mission (Col 1-5) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="font-serif-luxury text-3xl font-bold tracking-widest text-ivory">
                ABBA
              </h2>
              <span className="text-[10px] tracking-[0.35em] text-gold uppercase block -mt-1">
                COLLECTIVE
              </span>
            </Link>
            <p className="text-sm text-ivory/70 leading-relaxed max-w-md font-light">
              ABBA Collective is a luxury faith-driven apparel house creating meaningful garments inspired by biblical identity. Designed with uncompromising craftsmanship and quiet elegance.
            </p>
            <div className="pt-2">
              <p className="text-xs tracking-widest uppercase text-gold font-medium">
                Motto: "Identity Received. Grace Revealed."
              </p>
            </div>
          </div>

          {/* Navigation Links (Col 6-7) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs tracking-luxurious uppercase font-semibold text-gold mb-4">
              Explore ABBA
            </h3>
            <ul className="space-y-2.5 text-xs tracking-widest uppercase text-ivory/75 font-light">
              <li>
                <Link href="/shop" className="hover:text-gold transition-colors">
                  Shop Collection
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-gold transition-colors">
                  Featured Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  Our Brand Story
                </Link>
              </li>
              <li>
                <Link href="/faith" className="hover:text-gold transition-colors">
                  Statement of Faith
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-gold transition-colors">
                  The Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription (Col 8-12) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs tracking-luxurious uppercase font-semibold text-gold mb-2">
              Join The Collective
            </h3>
            <p className="text-xs text-ivory/70 leading-relaxed font-light">
              Receive quiet reflections on identity, early access to limited collection releases, and exclusive editorial drops.
            </p>
            <NewsletterForm darkTheme={true} />
          </div>
        </div>

        {/* Legal Policies Strip */}
        <div className="pt-8 border-t border-ivory/10 flex flex-wrap items-center justify-between text-xs text-ivory/50 font-light gap-4">
          <p>© {new Date().getFullYear()} ABBA Collective. All rights reserved.</p>
          <div className="flex flex-wrap items-center space-x-6">
            <Link href="/privacy-policy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors">
              Terms
            </Link>
            <Link href="/shipping-policy" className="hover:text-gold transition-colors">
              Shipping
            </Link>
            <Link href="/returns-policy" className="hover:text-gold transition-colors">
              Returns
            </Link>
            <Link href="/admin" className="hover:text-gold transition-colors text-gold/80 font-medium">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
