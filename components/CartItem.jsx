'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/lib/utils/formatCurrency';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="py-4 flex gap-4 items-start text-charcoal">
      {/* Thumbnail */}
      <Link 
        href={`/product/${item.slug}`} 
        className="relative w-20 h-24 bg-ivory border border-charcoal/10 rounded-sm overflow-hidden flex-shrink-0 group"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Details & Controls */}
      <div className="flex-1 space-y-1.5 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-gold font-semibold block">
              {item.collection}
            </span>
            <Link 
              href={`/product/${item.slug}`}
              className="font-serif-luxury text-base font-bold text-charcoal hover:text-gold transition-colors block leading-tight"
            >
              {item.name}
            </Link>
            <p className="text-[11px] text-charcoal/60 font-light">
              Size: <span className="font-semibold text-charcoal">{item.size}</span> | Color: <span className="font-semibold text-charcoal">{item.color}</span>
            </p>
          </div>

          <button
            onClick={() => removeItem(item.itemKey)}
            className="text-charcoal/40 hover:text-red-700 transition-colors p-1"
            title="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Quantity Controls & Line Item Subtotal */}
        <div className="flex items-center justify-between pt-2 border-t border-charcoal/10">
          <div className="flex items-center border border-charcoal/20 rounded-sm bg-ivory-light">
            <button
              onClick={() => updateQuantity(item.itemKey, item.quantity - 1)}
              className="p-1 text-charcoal/70 hover:text-gold transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={13} />
            </button>
            <span className="px-2.5 text-xs font-bold text-charcoal">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.itemKey, item.quantity + 1)}
              className="p-1 text-charcoal/70 hover:text-gold transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="text-right">
            <span className="font-bold text-charcoal text-sm block">
              {formatPrice(item.price * item.quantity)}
            </span>
            {item.quantity > 1 && (
              <span className="text-[10px] text-charcoal/50 block">
                {formatPrice(item.price)} ea
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
