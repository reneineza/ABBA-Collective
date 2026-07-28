'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { safeJsonParse } from '@/lib/utils/json';

export default function WishlistButton({ productId, className = '' }) {
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    try {
      const savedWishlist = safeJsonParse(localStorage.getItem('abba_wishlist'), []);
      setIsWishlisted(Array.isArray(savedWishlist) && savedWishlist.includes(productId));
    } catch (e) {
      // ignore
    }
  }, [productId]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      let savedWishlist = safeJsonParse(localStorage.getItem('abba_wishlist'), []);
      if (!Array.isArray(savedWishlist)) savedWishlist = [];

      if (savedWishlist.includes(productId)) {
        savedWishlist = savedWishlist.filter((id) => id !== productId);
        setIsWishlisted(false);
      } else {
        savedWishlist.push(productId);
        setIsWishlisted(true);
      }
      localStorage.setItem('abba_wishlist', JSON.stringify(savedWishlist));
    } catch (err) {
      console.error(err);
    }
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
