'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import CartItem from '@/components/CartItem';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/lib/utils/formatCurrency';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Lock } from 'lucide-react';

export default function CartPage() {
  const { cart, cartTotal, totalItems, clearCart } = useCart();
  const shippingCost = cartTotal >= 200000 ? 0 : 15000;
  const grandTotal = cartTotal + shippingCost;

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Client Shopping Bag ✦
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-charcoal">
            Your Selected Garments
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 font-light">
            Review your order before proceeding to secure checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-ivory-light border border-charcoal/10 p-12 text-center space-y-4 max-w-md mx-auto rounded-sm">
            <ShoppingBag size={32} className="mx-auto text-gold" />
            <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">Your Bag is Empty</h3>
            <p className="text-xs text-charcoal/60">Discover garments crafted with eternal purpose and quiet luxury.</p>
            <Button href="/shop" variant="primary" size="md">Explore Shop</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Items List (Col 1-7) */}
            <div className="lg:col-span-7 bg-ivory-light border border-charcoal/10 p-6 sm:p-8 rounded-sm divide-y divide-charcoal/10">
              <div className="flex justify-between items-center pb-4">
                <h3 className="font-serif-luxury text-xl font-bold text-charcoal">
                  Items ({totalItems})
                </h3>
                <button
                  onClick={clearCart}
                  className="text-xs uppercase tracking-widest text-charcoal/50 hover:text-red-700 font-semibold"
                >
                  Clear Bag
                </button>
              </div>

              {cart.map((item) => (
                <CartItem key={item.itemKey} item={item} />
              ))}
            </div>

            {/* Summary Sidebar (Col 8-12) */}
            <div className="lg:col-span-5 bg-charcoal text-ivory p-6 sm:p-8 rounded-sm space-y-6 shadow-xl border border-gold/30">
              <div className="border-b border-ivory/10 pb-4">
                <span className="text-gold text-[10px] uppercase tracking-luxurious block font-semibold">
                  Summary
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-ivory">
                  Order Breakdown
                </h3>
              </div>

              <div className="space-y-3 text-xs border-b border-ivory/10 pb-4">
                <div className="flex justify-between text-ivory/80">
                  <span>Bag Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-ivory/80">
                  <span>Insured Shipping</span>
                  <span>{shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gold pt-2 border-t border-ivory/10">
                  <span>Estimated Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Button href="/checkout" variant="primary" size="lg" fullWidth>
                Proceed to Checkout <ArrowRight size={16} className="ml-2" />
              </Button>

              <div className="text-[10px] text-center text-ivory/50 uppercase tracking-widest flex items-center justify-center gap-2 pt-2">
                <Lock size={13} className="text-gold" /> Encrypted & Insured Payment Architecture
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
