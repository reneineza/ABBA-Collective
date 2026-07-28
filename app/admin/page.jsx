'use client';

import React, { useState, useEffect } from 'react';
import StatCard from '@/components/admin/StatCard';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { safeJsonParse } from '@/lib/utils/json';
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const savedOrders = safeJsonParse(localStorage.getItem('abba_orders_history'), []);
      setOrders(Array.isArray(savedOrders) && savedOrders.length > 0 ? savedOrders : [
        {
          id: 'ord_9x28v',
          created_at: new Date().toISOString(),
          status: 'Confirmed',
          total_amount: 270.00,
          shipping_address: { first_name: 'Grace', last_name: 'Heirs', city: 'New York' },
          items: [{ name: 'Adoption Hoodie', quantity: 1, price: 185 }, { name: 'ABBA Signature Tee', quantity: 1, price: 85 }]
        },
        {
          id: 'ord_3k71p',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'Shipped',
          total_amount: 420.00,
          shipping_address: { first_name: 'David', last_name: 'Covenant', city: 'Dallas' },
          items: [{ name: 'Covenant Tailored Overcoat', quantity: 1, price: 420 }]
        }
      ]);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const totalSales = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 2845.00);
  const avgOrderValue = orders.length > 0 ? totalSales / (orders.length + 8) : 237.08;

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Gross Revenue"
          value={`$${totalSales.toFixed(2)}`}
          change="+18.4% vs previous month"
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders Executed"
          value={`${orders.length + 8} Orders`}
          change={`Average Order Value: $${avgOrderValue.toFixed(2)}`}
          icon={ShoppingBag}
        />
        <StatCard
          title="Active Garment SKUs"
          value="16 Active SKUs"
          change="3 Featured Collections"
          icon={Package}
        />
        <StatCard
          title="Total Client Directory"
          value="28 Clients"
          change="100% Opt-in Email Roster"
          icon={Users}
        />
      </div>

      {/* Analytics Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Overview (Col 1-8) */}
        <div className="lg:col-span-8 bg-charcoal border border-gold/20 p-6 rounded-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gold/20 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-luxurious text-gold font-semibold block">
                ✦ Order Fulfillment ✦
              </span>
              <h3 className="font-serif-luxury text-xl font-bold text-ivory">
                Recent Customer Orders
              </h3>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs uppercase tracking-widest text-gold hover:text-ivory font-semibold flex items-center gap-1"
            >
              View All Orders <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-gold/10">
            {orders.map((ord) => (
              <div key={ord.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-ivory">#{ord.id}</span>
                    <span className="text-ivory/60">• {ord.shipping_address?.first_name} {ord.shipping_address?.last_name} ({ord.shipping_address?.city})</span>
                  </div>
                  <p className="text-[10px] text-ivory/50">
                    {ord.items ? ord.items.map(i => `${i.name} (${i.quantity})`).join(', ') : 'Garment Order'}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-gold">${Number(ord.total_amount).toFixed(2)}</span>
                  <OrderStatusBadge status={ord.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products (Col 9-12) */}
        <div className="lg:col-span-4 bg-charcoal border border-gold/20 p-6 rounded-sm space-y-4">
          <div className="border-b border-gold/20 pb-4">
            <span className="text-[10px] uppercase tracking-luxurious text-gold font-semibold block">
              ✦ Top Performers ✦
            </span>
            <h3 className="font-serif-luxury text-xl font-bold text-ivory">
              Signature Garments
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-gold/10 pb-2">
              <div>
                <p className="font-bold text-ivory">Abba Heir Hoodie</p>
                <p className="text-[10px] text-gold font-mono">480 GSM French Terry</p>
              </div>
              <span className="font-semibold text-ivory">24 Units Sold</span>
            </div>

            <div className="flex justify-between items-center border-b border-gold/10 pb-2">
              <div>
                <p className="font-bold text-ivory">ABBA Signature Tee</p>
                <p className="text-[10px] text-gold font-mono">280 GSM Supima Cotton</p>
              </div>
              <span className="font-semibold text-ivory">18 Units Sold</span>
            </div>

            <div className="flex justify-between items-center border-b border-gold/10 pb-2">
              <div>
                <p className="font-bold text-ivory">Grace Crewneck</p>
                <p className="text-[10px] text-gold font-mono">400 GSM Fleece</p>
              </div>
              <span className="font-semibold text-ivory">14 Units Sold</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
