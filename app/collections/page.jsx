import React from 'react';
import CollectionCard from '@/components/CollectionCard';
import { MOCK_COLLECTIONS } from '@/lib/data/mockData';

export const metadata = {
  title: 'Collections | ABBA Collective',
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
            Each collection explores a distinct spiritual pillar—from adoption and sonship to the unmerited covering of grace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_COLLECTIONS.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </div>
    </div>
  );
}
