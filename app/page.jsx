import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import CollectionCard from '@/components/CollectionCard';
import StorySection from '@/components/StorySection';
import Button from '@/components/Button';
import { MOCK_COLLECTIONS, MOCK_PRODUCTS, MOCK_BLOG_POSTS } from '@/lib/data/mockData';
import { ArrowRight, ShieldCheck, Sparkles, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. BRAND PILLARS STRIP */}
      <section className="bg-charcoal text-ivory py-10 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-ivory/10">
            <div className="px-4 py-2 space-y-1">
              <span className="text-gold text-[10px] tracking-luxurious uppercase font-semibold block">
                ✦ Adoption & Sonship ✦
              </span>
              <h3 className="font-serif-luxury text-lg text-ivory font-bold">Identity Received</h3>
              <p className="text-xs text-ivory/70 font-light">Rooted in the eternal truth of Galatians 4:6</p>
            </div>
            <div className="px-4 py-2 space-y-1">
              <span className="text-gold text-[10px] tracking-luxurious uppercase font-semibold block">
                ✦ Uncompromising Quality ✦
              </span>
              <h3 className="font-serif-luxury text-lg text-ivory font-bold">Master Craftsmanship</h3>
              <p className="text-xs text-ivory/70 font-light">480 GSM custom organic milled textiles</p>
            </div>
            <div className="px-4 py-2 space-y-1">
              <span className="text-gold text-[10px] tracking-luxurious uppercase font-semibold block">
                ✦ Kingdom Purpose ✦
              </span>
              <h3 className="font-serif-luxury text-lg text-ivory font-bold">Grace Revealed</h3>
              <p className="text-xs text-ivory/70 font-light">Garments crafted to spark gospel conversations</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-charcoal/10 pb-6">
            <div>
              <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block mb-1">
                Curated Chapters
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-charcoal">
                Featured Collections
              </h2>
            </div>
            <Link
              href="/collections"
              className="text-xs uppercase tracking-widest text-charcoal hover:text-gold transition-colors font-semibold flex items-center gap-2 group"
            >
              View All Collections <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_COLLECTIONS.map((col) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. CURATED PRODUCTS PREVIEW */}
      <section className="py-20 bg-ivory-light border-y border-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
              ✦ Signature Garments ✦
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-charcoal">
              Crafted for Purpose
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 font-light">
              Every seam, weight, and silhouette designed as a tangible declaration of grace and identity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>

          <div className="text-center pt-6">
            <Button href="/shop" variant="primary" size="lg">
              Explore Full Shop
            </Button>
          </div>
        </div>
      </section>

      {/* 5. STORY SECTION */}
      <StorySection />

      {/* 6. STATEMENT OF FAITH CALLOUT */}
      <section className="py-24 bg-forest text-ivory relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Core Convictions ✦
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-ivory leading-tight">
            "Because you are sons, God has sent the Spirit of his Son into our hearts, crying, 'Abba! Father!'"
          </h2>
          <p className="text-xs uppercase tracking-widest text-gold font-medium">
            — Galatians 4:6
          </p>
          <div className="pt-4">
            <Button href="/faith" variant="gold-outline" size="md">
              Read Statement of Faith
            </Button>
          </div>
        </div>
      </section>

      {/* 7. JOURNAL & DEVOTIONALS */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-charcoal/10 pb-6">
            <div>
              <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block mb-1">
                Reflections & Theology
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-charcoal">
                The ABBA Journal
              </h2>
            </div>
            <Link
              href="/journal"
              className="text-xs uppercase tracking-widest text-charcoal hover:text-gold transition-colors font-semibold flex items-center gap-2 group"
            >
              Read All Articles <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MOCK_BLOG_POSTS.map((post) => (
              <div key={post.id} className="group bg-ivory-light border border-charcoal/10 rounded-sm overflow-hidden flex flex-col md:flex-row hover:shadow-card transition-all duration-500">
                <div className="relative aspect-[4/3] md:w-1/2 overflow-hidden">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-gold font-semibold">
                      <span>{post.category}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Link href={`/journal/${post.slug}`}>
                      <h3 className="font-serif-luxury text-xl font-bold text-charcoal group-hover:text-forest transition-colors leading-snug">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-charcoal/70 font-light line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/journal/${post.slug}`}
                    className="text-[10px] uppercase tracking-widest text-forest font-semibold border-b border-forest/30 self-start pb-0.5 hover:text-gold transition-colors"
                  >
                    Read Journal Entry
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
