'use client';

import React from 'react';
import CheckoutForm from '@/components/CheckoutForm';
import { useCart } from '@/lib/context/CartContext';
import Button from '@/components/Button';
import { ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const { cart } = useCart();

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Client Checkout ✦
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-charcoal">
            Checkout Portal
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 font-light">
            Encrypted order creation & shipping verification.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-ivory-light border border-charcoal/10 p-12 text-center space-y-4 max-w-md mx-auto">
            <ShoppingBag size={32} className="mx-auto text-gold" />
            <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">Your Bag is Empty</h3>
            <p className="text-xs text-charcoal/60">Please add items to your shopping bag before proceeding to checkout.</p>
            <Button href="/shop" variant="primary" size="md">Explore Catalog</Button>
          </div>
        ) : (
          <CheckoutForm />
        )}
      </div>
    </div>
  );
}
