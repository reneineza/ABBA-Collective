'use client';

import React from 'react';
import Link from 'next/link';
import CartItem from './CartItem';
import Button from './Button';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/lib/utils/formatCurrency';
import { usePathname } from 'next/navigation';
import { X, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartDrawer() {
  const pathname = usePathname();
  const { cart, isOpen, closeCart, cartTotal, totalItems, clearCart } = useCart();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 200000; // in RWF
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const progressPercent = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory text-charcoal shadow-2xl flex flex-col justify-between border-l border-gold/30">
          
          {/* Header */}
          <div className="p-6 border-b border-charcoal/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBag size={20} className="text-gold" />
              <h2 className="font-serif-luxury text-xl font-bold tracking-wider text-charcoal">
                Your Shopping Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-charcoal/60 hover:text-charcoal transition-colors rounded-full"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Threshold Bar */}
          <div className="bg-ivory-light px-6 py-3 border-b border-charcoal/10 space-y-1.5">
            <div className="flex justify-between text-xs text-charcoal/80">
              {progressPercent >= 100 ? (
                <span className="font-semibold text-forest">✦ You unlocked Complimentary Shipping!</span>
              ) : (
                <span>Add <strong>{formatPrice(remainingForFreeShipping)}</strong> for free shipping</span>
              )}
              <span className="font-bold text-gold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-charcoal/10">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-ivory-light border border-charcoal/10 flex items-center justify-center text-gold">
                  <ShoppingBag size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif-luxury text-lg font-bold text-charcoal">Your Bag is Empty</h3>
                  <p className="text-xs text-charcoal/60 max-w-xs font-light">
                    Explore our curated collections crafted around biblical identity and sonship.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="mt-4 px-6 py-2.5 bg-charcoal text-ivory text-xs uppercase tracking-widest font-semibold hover:bg-forest transition-colors"
                >
                  Explore Garments
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <CartItem key={item.itemKey} item={item} />
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-charcoal/10 bg-ivory-light space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-charcoal/70">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal text-sm">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>Insured Shipping</span>
                  <span>{cartTotal >= FREE_SHIPPING_THRESHOLD ? 'Complimentary' : formatPrice(15000)}</span>
                </div>
                <div className="flex justify-between border-t border-charcoal/10 pt-2 text-sm font-bold text-charcoal">
                  <span>Estimated Total</span>
                  <span className="text-forest">{formatPrice(cartTotal + (cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15000))}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button 
                  href="/checkout" 
                  variant="primary" 
                  size="lg" 
                  fullWidth 
                  onClick={closeCart}
                >
                  Proceed to Checkout <ArrowRight size={16} className="ml-2" />
                </Button>
                
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center text-xs uppercase tracking-widest font-semibold text-charcoal/70 hover:text-gold transition-colors py-1"
                >
                  View Full Shopping Bag
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-charcoal/50 uppercase tracking-widest pt-1 border-t border-charcoal/10">
                <ShieldCheck size={14} className="text-gold" />
                <span>Encrypted & Insured Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
