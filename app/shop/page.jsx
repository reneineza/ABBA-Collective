'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import BrandDropdown from '@/components/BrandDropdown';
import { SAMPLE_PRODUCTS, SAMPLE_COLLECTIONS, SAMPLE_CATEGORIES } from '@/lib/data/sampleData';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    ...SAMPLE_CATEGORIES.map((cat) => ({ label: cat.name, value: cat.id })),
  ];

  const collectionOptions = [
    { label: 'All Collections', value: 'all' },
    ...SAMPLE_COLLECTIONS.map((col) => ({ label: col.name, value: col.id })),
  ];

  const sortOptions = [
    { label: 'Featured First', value: 'featured' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
  ];

  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((product) => {
      // Category Filter
      const matchCategory =
        selectedCategory === 'all' ||
        product.category_id === selectedCategory ||
        product.category.toLowerCase().includes(selectedCategory.toLowerCase());

      // Collection Filter
      const matchCollection =
        selectedCollection === 'all' ||
        product.collection_id === selectedCollection ||
        product.collection.toLowerCase().includes(selectedCollection.toLowerCase());

      // Search Query
      const matchSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tagline && product.tagline.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchCollection && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return 0;
    });
  }, [selectedCategory, selectedCollection, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Complete Catalog ✦
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-charcoal">
            The ABBA Collection
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 font-light">
            Garments crafted around biblical identity, heavyweight textiles, and quiet luxury tailoring.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-ivory-light p-6 border border-charcoal/10 rounded-sm space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search garments..."
                className="w-full py-2.5 pl-9 pr-4 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none rounded-sm"
              />
              <Search size={15} className="absolute left-3 top-3 text-charcoal/40" />
            </div>

            {/* Custom Brand Dropdowns Group */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
              {/* Category Dropdown */}
              <BrandDropdown
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="All Categories"
              />

              {/* Collection Dropdown */}
              <BrandDropdown
                options={collectionOptions}
                value={selectedCollection}
                onChange={setSelectedCollection}
                placeholder="All Collections"
              />

              {/* Sort Dropdown */}
              <BrandDropdown
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Featured First"
              />

              {/* Reset Button */}
              {(selectedCategory !== 'all' || selectedCollection !== 'all' || searchQuery || sortBy !== 'featured') && (
                <button
                  onClick={handleResetFilters}
                  className="p-2.5 text-xs text-charcoal/60 hover:text-gold transition-colors flex items-center gap-1 border border-charcoal/20 rounded-sm"
                  title="Reset Filters"
                >
                  <RotateCcw size={14} />
                  <span className="hidden sm:inline uppercase text-[10px] tracking-widest font-semibold">Reset</span>
                </button>
              )}
            </div>

          </div>

          {/* Results Count & Active Filters Indicator */}
          <div className="pt-2 border-t border-charcoal/10 flex items-center justify-between text-xs text-charcoal/60 font-light">
            <span>
              Showing <strong className="font-semibold text-charcoal">{filteredProducts.length}</strong> garments
            </span>

            {(selectedCategory !== 'all' || selectedCollection !== 'all' || searchQuery) && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">Active Filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="bg-forest/10 text-forest px-2 py-0.5 rounded-sm text-[10px] font-semibold">
                    Category: {SAMPLE_CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                  </span>
                )}
                {selectedCollection !== 'all' && (
                  <span className="bg-forest/10 text-forest px-2 py-0.5 rounded-sm text-[10px] font-semibold">
                    Collection: {SAMPLE_COLLECTIONS.find((c) => c.id === selectedCollection)?.name || selectedCollection}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-ivory-light border border-charcoal/10 p-12 text-center space-y-4 rounded-sm">
            <Filter size={32} className="mx-auto text-gold" />
            <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">No Garments Match Your Filter</h3>
            <p className="text-xs text-charcoal/60">Try selecting a different category or resetting your search criteria.</p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-charcoal text-ivory text-xs uppercase tracking-widest font-semibold hover:bg-forest transition-colors rounded-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
