'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleData';
import { useCart } from '@/lib/context/CartContext';
import { safeJsonParse } from '@/lib/utils/json';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { addItem } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState([]);

  useEffect(() => {
    try {
      const savedWishlistIds = safeJsonParse(localStorage.getItem('abba_wishlist'), []);
      if (Array.isArray(savedWishlistIds) && savedWishlistIds.length > 0) {
        const filtered = SAMPLE_PRODUCTS.filter((p) => savedWishlistIds.includes(p.id));
        setWishlistProducts(filtered.length > 0 ? filtered : SAMPLE_PRODUCTS.slice(0, 2));
      } else {
        setWishlistProducts(SAMPLE_PRODUCTS.slice(0, 2));
      }
    } catch (e) {
      setWishlistProducts(SAMPLE_PRODUCTS.slice(0, 2));
    }
  }, []);

  const handleMoveToCart = (product) => {
    addItem(product, product.sizes?.[0] || 'M', product.colors?.[0] || 'Charcoal', 1);
  };

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Saved Favorites ✦
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-charcoal">
            Your Saved Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 font-light">
            Keep track of garments you love for upcoming releases and collection orders.
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-ivory-light border border-charcoal/10 p-12 text-center space-y-4 max-w-md mx-auto">
            <Heart size={32} className="mx-auto text-gold" />
            <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">Your Wishlist is Empty</h3>
            <p className="text-xs text-charcoal/60">Explore our catalog and click the heart icon on any garment to save it.</p>
            <Button href="/shop" variant="primary" size="md">Explore Catalog</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((prod) => (
              <div key={prod.id} className="space-y-3">
                <ProductCard product={prod} />
                <button
                  onClick={() => handleMoveToCart(prod)}
                  className="w-full py-2.5 bg-forest text-ivory hover:bg-forest-dark transition-colors text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 rounded-sm shadow-sm"
                >
                  <ShoppingBag size={14} /> Move to Shopping Bag
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
