'use client';

import React, { useState, useMemo, use } from 'react';
import ProductCard from '@/components/ProductCard';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleData';
import { Search, RotateCcw } from 'lucide-react';

export default function AdvancedSearchPage({ searchParams }) {
  const resolvedSearchParams = searchParams && typeof searchParams.then === 'function' ? React.use(searchParams) : searchParams;
  const initialQuery = resolvedSearchParams?.q || '';

  const [query, setQuery] = useState(initialQuery);

  const searchResults = useMemo(() => {
    if (!query || query.trim() === '') return SAMPLE_PRODUCTS;
    const lower = query.toLowerCase();
    return SAMPLE_PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      (p.tagline && p.tagline.toLowerCase().includes(lower)) ||
      (p.category && p.category.toLowerCase().includes(lower)) ||
      (p.collection && p.collection.toLowerCase().includes(lower)) ||
      (p.story && p.story.toLowerCase().includes(lower))
    );
  }, [query]);

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Search Header & Bar */}
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
              ✦ Search Shop ✦
            </span>
            <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-charcoal">
              Find Garments & Stories
            </h1>
          </div>

          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by garment name, textile, collection, or scripture..."
              className="w-full py-4 pl-12 pr-4 text-sm bg-ivory-light border border-charcoal/20 focus:border-forest focus:outline-none rounded-sm shadow-sm"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center border-b border-charcoal/10 pb-4">
          <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">
            {query ? `Search Results for "${query}"` : 'All Garments'} ({searchResults.length})
          </h2>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs uppercase tracking-widest font-semibold text-charcoal/60 hover:text-gold flex items-center gap-1"
            >
              <RotateCcw size={14} /> Clear Search
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {searchResults.length === 0 ? (
          <div className="bg-ivory-light border border-charcoal/10 p-12 text-center space-y-4 max-w-md mx-auto rounded-sm">
            <Search size={32} className="mx-auto text-gold" />
            <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">No Garments Found</h3>
            <p className="text-xs text-charcoal/60">Try searching for terms like "hoodie", "tee", "adoption", "covenant", or "grace".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResults.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
