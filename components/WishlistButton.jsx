'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/lib/context/WishlistContext';

export default function WishlistButton({ productId, className = '' }) {
  const { has, toggle } = useWishlist();
  const isWishlisted = has(productId);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);
  };

  return (
    <button
      onClick={toggleWishlist}
      className={`p-2 rounded-full bg-ivory/80 backdrop-blur-md text-charcoal hover:text-gold transition-colors shadow-sm ${className}`}
      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      <Heart size={17} className={isWishlisted ? 'fill-gold text-gold' : ''} />
    </button>
  );
}
