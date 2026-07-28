'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { getRelatedProducts } from '@/lib/recommendations/recommendationEngine';

export default function ProductRecommendations({ currentProduct }) {
  const relatedProducts = getRelatedProducts(currentProduct, 4);

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="space-y-8 pt-8 border-t border-charcoal/10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
          ✦ Complete The Look ✦
        </span>
        <h3 className="font-serif-luxury text-3xl font-bold text-charcoal">
          You May Also Like
        </h3>
        <p className="text-xs text-charcoal/60 font-light">
          Garments crafted from matching collection weight textiles and spiritual anchors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
}
