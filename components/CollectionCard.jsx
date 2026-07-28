'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function CollectionCard({ collection }) {
  if (!collection) return null;

  return (
    <Link 
      href={`/collections/${collection.slug}`}
      className="group relative h-[420px] rounded-sm overflow-hidden block shadow-subtle hover:shadow-card transition-all duration-500 border border-charcoal/10"
    >
      {/* Background Image */}
      <Image
        src={collection.image_url}
        alt={collection.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

      {/* Content Overlay */}
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
          <span className="text-[10px] uppercase tracking-luxurious text-gold font-semibold bg-charcoal/80 px-3 py-1 border border-gold/30">
            {collection.itemCount || "Curated Drop"}
          </span>
          <div className="w-9 h-9 rounded-full bg-ivory/90 text-charcoal flex items-center justify-center group-hover:bg-gold group-hover:text-charcoal transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1">
            <ArrowUpRight size={18} />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold font-medium block">
            {collection.tagline}
          </span>
          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-ivory group-hover:text-gold transition-colors">
            {collection.name}
          </h3>
          <p className="text-xs text-ivory/80 font-light line-clamp-2 leading-relaxed">
            {collection.description}
          </p>
          <div className="pt-2">
            <span className="text-[10px] uppercase tracking-luxurious text-ivory/90 font-semibold border-b border-gold/50 group-hover:border-gold pb-0.5 transition-colors">
              Explore Collection
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
