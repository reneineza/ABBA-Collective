// ABBA Collective Product Recommendation Engine

import { SAMPLE_PRODUCTS } from '@/lib/data/sampleData';

export function getRelatedProducts(currentProduct, limit = 4) {
  if (!currentProduct) return SAMPLE_PRODUCTS.slice(0, limit);

  // 1. Same collection garments
  const sameCollection = SAMPLE_PRODUCTS.filter(
    (p) => p.id !== currentProduct.id && (p.collection_id === currentProduct.collection_id || p.collection === currentProduct.collection)
  );

  // 2. Same category garments
  const sameCategory = SAMPLE_PRODUCTS.filter(
    (p) => p.id !== currentProduct.id && p.category_id === currentProduct.category_id && !sameCollection.find(sc => sc.id === p.id)
  );

  // 3. Fallback remaining garments
  const fallback = SAMPLE_PRODUCTS.filter(
    (p) => p.id !== currentProduct.id && !sameCollection.find(sc => sc.id === p.id) && !sameCategory.find(sc => sc.id === p.id)
  );

  const combined = [...sameCollection, ...sameCategory, ...fallback];
  return combined.slice(0, limit);
}
