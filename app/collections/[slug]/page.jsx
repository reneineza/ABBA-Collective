'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { SAMPLE_COLLECTIONS, SAMPLE_PRODUCTS } from '@/lib/data/sampleData';
import { ArrowLeft } from 'lucide-react';

export default function CollectionDetailPage({ params }) {
  const resolvedParams = params && typeof params.then === 'function' ? React.use(params) : params;
  const slug = resolvedParams?.slug || '';
  
  // Find collection by slug or fallback to Collection 001: ADOPTION
  const collection = SAMPLE_COLLECTIONS.find(
    (c) => c.slug.toLowerCase() === slug.toLowerCase() || slug.toLowerCase().includes(c.slug.toLowerCase())
  ) || SAMPLE_COLLECTIONS[0];

  // Filter garments matching this collection
  const collectionProducts = SAMPLE_PRODUCTS.filter(
    (p) => p.collection_id === collection.id || p.collection.toLowerCase().includes(collection.slug.toLowerCase()) || collection.slug.includes('adoption')
  );

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24 space-y-16">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/collections"
          className="text-xs uppercase tracking-widest font-semibold text-charcoal/70 hover:text-gold flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> All Collections
        </Link>

        {/* Editorial Hero Banner for Collection */}
        <div className="relative aspect-[21/9] w-full rounded-sm overflow-hidden border border-charcoal/15 shadow-card">
          <Image
            src={collection.image_url}
            alt={collection.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
          <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 text-ivory max-w-2xl space-y-2">
            <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
              ✦ Curated Chapter ✦
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-ivory leading-tight">
              {collection.name}
            </h1>
            <p className="text-xs sm:text-sm text-ivory/80 font-light leading-relaxed">
              {collection.description}
            </p>
          </div>
        </div>
      </div>

      {/* Collection Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-center border-b border-charcoal/10 pb-4">
          <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">
            Chapter Garments ({collectionProducts.length})
          </h2>
          <span className="text-xs uppercase tracking-widest text-gold font-semibold">
            Limited Edition Drop
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collectionProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
}
