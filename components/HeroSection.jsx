'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-charcoal text-ivory py-20 px-4 sm:px-6 lg:px-8">
      {/* Editorial Background Image with Dark Vignette */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity scale-105 transition-transform duration-10000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/40 z-10" />

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <span className="inline-block text-gold text-xs tracking-luxurious uppercase font-semibold border-b border-gold/40 pb-1">
            ✦ Luxury Faith-Driven Fashion ✦
          </span>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] text-ivory">
            Identity Received. <br className="hidden sm:block" />
            <span className="italic font-normal text-gold">Grace Revealed.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-ivory/80 font-light leading-relaxed tracking-wide pt-2">
            Garments crafted around biblical identity and sonship. Created with quiet elegance, heavy-weight organic textiles, and enduring purpose.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Button href="/shop" variant="gold-outline" size="lg">
            Explore Collection
          </Button>
          <Button href="/about" variant="secondary" size="lg">
            Our Story & Ethos
          </Button>
        </motion.div>

        {/* Scripture Footer Ribbon */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="pt-12 flex items-center justify-center space-x-6 text-[11px] uppercase tracking-widest text-ivory/60 font-light"
        >
          <span>Galatians 4:6</span>
          <span className="text-gold">•</span>
          <span>Romans 8:15</span>
          <span className="text-gold">•</span>
          <span>Ephesians 1:5</span>
        </motion.div>
      </div>
    </section>
  );
}
