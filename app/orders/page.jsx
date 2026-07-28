'use client';

import React, { useState, useEffect } from 'react';
import OrderCard from '@/components/OrderCard';
import Button from '@/components/Button';
import { safeJsonParse } from '@/lib/utils/json';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const savedOrders = safeJsonParse(localStorage.getItem('abba_orders_history'), []);
      setOrders(Array.isArray(savedOrders) ? savedOrders : []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Client Records ✦
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-charcoal">
            Order History
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 font-light">
            Review your past purchases, shipment statuses, and digital receipts.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-ivory-light border border-charcoal/10 p-12 text-center space-y-4 max-w-md mx-auto">
            <Package size={32} className="mx-auto text-gold" />
            <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">No Orders Placed Yet</h3>
            <p className="text-xs text-charcoal/60">Your order history will appear here once you place a garment order.</p>
            <Button href="/shop" variant="primary" size="md">Explore Shop</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((ord) => (
              <OrderCard key={ord.id} order={ord} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
