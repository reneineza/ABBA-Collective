'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WishlistButton from './WishlistButton';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/lib/utils/formatCurrency';
import { ShoppingBag, Eye, Heart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0].image_url 
    : (product.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800');

  const hoverImage = product.images && product.images.length > 1 
    ? product.images[1].image_url 
    : mainImage;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes?.[0] || 'M', product.colors?.[0] || 'Charcoal', 1);
  };

  return (
    <div 
      className="group relative bg-ivory-light border border-charcoal/10 rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-card hover:border-gold/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory">
        
        {/* Main Product Image with Smooth Scale/Crossfade */}
        <Image
          src={isHovered ? hoverImage : mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Featured / Collection Badge */}
        {product.featured && (
          <span className="absolute top-3 left-3 bg-charcoal text-ivory text-[9px] uppercase tracking-luxurious px-2.5 py-1 font-medium rounded-sm border border-gold/30 shadow-sm">
            ✦ Signature
          </span>
        )}

        {/* Wishlist Floating Button */}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton productId={product.id} />
        </div>

        {/* Quick Add Overlay Drawer (Slide-up on hover) */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2.5 bg-gold text-charcoal text-[11px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 hover:bg-ivory transition-colors shadow-md"
          >
            <ShoppingBag size={14} /> Quick Add
          </button>
          
          <Link
            href={`/product/${product.slug}`}
            className="p-2.5 bg-ivory/90 text-charcoal hover:text-gold transition-colors rounded-sm shadow-md"
            title="View Product Story"
          >
            <Eye size={15} />
          </Link>
        </div>
      </div>

      {/* Product Info Content */}
      <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-gold font-semibold block">
            {product.category || 'Garment'}
          </span>
          
          <Link href={`/product/${product.slug}`} className="block group-hover:text-gold transition-colors">
            <h3 className="font-serif-luxury text-lg font-bold text-charcoal leading-tight">
              {product.name}
            </h3>
          </Link>

          {product.tagline && (
            <p className="text-[11px] text-charcoal/60 line-clamp-1 italic font-light">
              "{product.tagline}"
            </p>
          )}
        </div>

        {/* Price & Variant Stock Indicator */}
        <div className="pt-2 border-t border-charcoal/10 flex items-center justify-between">
          <span className="font-bold text-charcoal text-sm tracking-wide">
            {formatPrice(product.price)}
          </span>

          <span className="text-[10px] uppercase tracking-wider text-charcoal/50 font-medium">
            {product.colors ? `${product.colors.length} Colors` : 'In Stock'}
          </span>
        </div>
      </div>
    </div>
  );
}
