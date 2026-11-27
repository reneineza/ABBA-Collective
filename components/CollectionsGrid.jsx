'use client';

import React from 'react';
import CollectionCard from './CollectionCard';
import { useCatalog } from '@/lib/context/CatalogContext';

export default function CollectionsGrid() {
  const { collections } = useCatalog();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {collections.map((col) => (
        <CollectionCard key={col.id} collection={col} />
      ))}
    </div>
  );
}
