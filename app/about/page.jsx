import React from 'react';
import Image from 'next/image';
import Button from '@/components/Button';
import { Sparkles, HeartHandshake, ShieldCheck, Gem } from 'lucide-react';

export const metadata = {
  title: 'Our Story & Ethos | ABBA Collective',
  description: 'Learn about ABBA Collective—a luxury faith-driven lifestyle apparel brand created around biblical identity, sonship, and quiet craftsmanship.',
};

export default function AboutPage() {
  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24 space-y-24">
      {/* 1. HERO HEADER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
          ✦ The Origin & Meaning ✦
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold text-charcoal leading-tight">
          Identity Received. <br />
          <span className="italic font-normal text-forest">Grace Revealed.</span>
        </h1>
        <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed max-w-2xl mx-auto">
          ABBA Collective exists to bridge luxury fashion craftsmanship with eternal spiritual truth—reminding believers of who they are in Christ before they ever perform or strive.
        </p>
      </section>

      {/* 2. EDITORIAL HERO IMAGE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] w-full rounded-sm overflow-hidden border border-charcoal/15 shadow-card">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop"
            alt="ABBA Atelier Craftsmanship"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-charcoal/30" />
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 text-ivory max-w-xl">
            <span className="text-gold text-[10px] tracking-luxurious uppercase block mb-1 font-semibold">
              Our Vision
            </span>
            <p className="font-serif-luxury text-xl sm:text-2xl italic">
              "We do not wear our faith as noise; we embody our identity in quiet distinction and unyielding excellence."
            </p>
          </div>
        </div>
      </section>

      {/* 3. BRAND MEANING BREAKDOWN */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          
          {/* ABBA Meaning */}
          <div className="bg-ivory-light p-8 sm:p-10 border border-charcoal/10 rounded-sm space-y-4 flex flex-col justify-between hover:border-gold/40 transition-colors">
            <div className="space-y-3">
              <span className="text-gold text-xs uppercase tracking-widest font-semibold block">
                01 / The Name
              </span>
              <h2 className="font-serif-luxury text-3xl font-bold text-charcoal">
                ABBA
              </h2>
              <p className="text-xs uppercase tracking-widest text-forest font-semibold">
                The Fatherhood of God
              </p>
              <p className="text-sm text-charcoal/80 font-light leading-relaxed">
                In Aramaic, <em>Abba</em> is the intimate, reverent word for Father. It represents the radical truth that believers are no longer orphans or spiritual slaves, but beloved sons and daughters adopted into the royal family of God.
              </p>
            </div>
            <div className="pt-4 border-t border-charcoal/10 text-xs font-serif italic text-charcoal/60">
              Reference: Romans 8:15 & Galatians 4:6
            </div>
          </div>

          {/* COLLECTIVE Meaning */}
          <div className="bg-ivory-light p-8 sm:p-10 border border-charcoal/10 rounded-sm space-y-4 flex flex-col justify-between hover:border-gold/40 transition-colors">
            <div className="space-y-3">
              <span className="text-gold text-xs uppercase tracking-widest font-semibold block">
                02 / The Community
              </span>
              <h2 className="font-serif-luxury text-3xl font-bold text-charcoal">
                COLLECTIVE
              </h2>
              <p className="text-xs uppercase tracking-widest text-forest font-semibold">
                Gathered in Shared Mission
              </p>
              <p className="text-sm text-charcoal/80 font-light leading-relaxed">
                <em>Collective</em> represents a global body of believers unified around a common identity, royal priesthood, and Kingdom assignment. We are a people called out to reveal the grace and beauty of God to our generation.
              </p>
            </div>
            <div className="pt-4 border-t border-charcoal/10 text-xs font-serif italic text-charcoal/60">
              Reference: 1 Peter 2:9
            </div>
          </div>

        </div>
      </section>

      {/* 4. THREE PILLARS OF EXCELLENCE */}
      <section className="bg-charcoal text-ivory py-20 border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
              ✦ Foundational Pillars ✦
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-ivory">
              How We Design
            </h2>
            <p className="text-xs sm:text-sm text-ivory/70 font-light">
              We reject cheap merchandise and loud slogans. Instead, we create luxury wardrobe staples that stand the test of time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-ivory/10 space-y-4 hover:border-gold/40 transition-colors bg-charcoal-dark/50">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                <Gem size={20} />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-ivory">
                1. Custom Milling
              </h3>
              <p className="text-xs text-ivory/70 font-light leading-relaxed">
                We custom-mill our heavy 480 GSM french terry cotton and Supima jersey in ethical mills, ensuring unmatched comfort, durability, and hand-feel.
              </p>
            </div>

            <div className="p-6 border border-ivory/10 space-y-4 hover:border-gold/40 transition-colors bg-charcoal-dark/50">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-ivory">
                2. Subtle Detail & Story
              </h3>
              <p className="text-xs text-ivory/70 font-light leading-relaxed">
                Every piece features discreet scripture coordinates embroidered on cuff undersides, inner neck bands, or pocket linings as personal reminders.
              </p>
            </div>

            <div className="p-6 border border-ivory/10 space-y-4 hover:border-gold/40 transition-colors bg-charcoal-dark/50">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                <HeartHandshake size={20} />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-ivory">
                3. Ethical Stewardship
              </h3>
              <p className="text-xs text-ivory/70 font-light leading-relaxed">
                Fair wages, sustainable dye houses, and transparent production chains. Our craftsmanship honors both God and the artisans who construct our garments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA BUTTONS */}
      <section className="max-w-3xl mx-auto px-4 text-center space-y-6 pt-6">
        <h2 className="font-serif-luxury text-3xl font-bold text-charcoal">
          Explore The Collection
        </h2>
        <p className="text-xs text-charcoal/70 font-light">
          Step into garments crafted with eternal purpose and modern aesthetic mastery.
        </p>
        <div className="flex justify-center gap-4">
          <Button href="/shop" variant="primary" size="lg">
            Explore Shop
          </Button>
          <Button href="/faith" variant="secondary" size="lg">
            Statement of Faith
          </Button>
        </div>
      </section>
    </div>
  );
}
