'use client';

import React from 'react';
import Image from 'next/image';
import Button from './Button';
import { motion } from 'framer-motion';

export default function StorySection() {
  return (
    <section className="py-24 bg-ivory border-y border-charcoal/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Editorial Image Composition (Left 6 Cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden border border-charcoal/15 shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop"
                alt="ABBA Collective Craftsmanship"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-charcoal/10" />
            </div>

            {/* Floating Gold Quote Card Overlay */}
            <div className="absolute -bottom-6 -right-4 sm:bottom-8 sm:-right-6 bg-charcoal text-ivory p-6 max-w-xs border border-gold/40 shadow-2xl rounded-sm">
              <span className="text-gold text-[10px] uppercase tracking-luxurious block mb-1 font-semibold">
                ✦ Sacred Identity ✦
              </span>
              <p className="font-serif-luxury text-base italic leading-snug text-ivory/90">
                "Identity is never earned through performance; it is received through adoption."
              </p>
            </div>
          </div>

          {/* Editorial Narrative Content (Right 6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
                The ABBA Narrative
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal leading-tight">
                Identity Received. <br />
                <span className="italic font-normal text-forest">Grace Revealed.</span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed">
              <strong>ABBA</strong> represents the profound Fatherhood of God and the intimate identity believers receive through adoption in Christ. 
            </p>

            <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed">
              <strong>COLLECTIVE</strong> represents a unified community gathered around a shared identity, purpose, and Kingdom mission. We create garments not as simple merchandise, but as tactile monuments of grace.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-charcoal/10">
              <div className="space-y-1">
                <h4 className="font-serif-luxury text-lg font-bold text-charcoal">Sonship & Adoption</h4>
                <p className="text-xs text-charcoal/70 font-light">Rooted in Romans 8:15 and Galatians 4:6.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-serif-luxury text-lg font-bold text-charcoal">Master Craftsmanship</h4>
                <p className="text-xs text-charcoal/70 font-light">Ethical sourcing & custom milled textiles.</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Button href="/about" variant="primary" size="md">
                Read Full Story
              </Button>
              <Button href="/faith" variant="secondary" size="md">
                Statement of Faith
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
