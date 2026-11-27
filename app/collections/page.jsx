import React from 'react';
import CollectionsGrid from '@/components/CollectionsGrid';

export const metadata = {
  title: 'Collections | ABBA',
  description: 'Explore thematic product collections inspired by biblical identity and Kingdom purpose.',
};

export default function CollectionsPage() {
  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Curated Chapters ✦
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-charcoal">
            Collections
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 font-light">
            Garments organized into spiritual narrative chapters.
          </p>
        </div>

        <CollectionsGrid />
      </div>
    </div>
  );
}
