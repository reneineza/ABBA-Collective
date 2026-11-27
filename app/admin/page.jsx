'use client';

import React, { useState, useEffect } from 'react';
import StatCard from '@/components/admin/StatCard';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { getBrowserClient } from '@/lib/supabase';
import { orderNumber } from '@/lib/utils/orders';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);

  // Admins can read every order (database policy "Admins manage orders")
  useEffect(() => {
    getBrowserClient()
      .from('orders')
      .select('id, status, total_amount, items, customer_name, shipping_address, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Could not load orders:', error.message);
        setOrders(data || []);
      });
  }, []);

  const countedOrders = orders.filter((o) => o.status !== 'Cancelled');
  const totalSales = countedOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const avgOrderValue = countedOrders.length > 0 ? totalSales / countedOrders.length : 0;

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Gross Revenue"
          value={totalSales > 0 ? formatCurrency(totalSales) : '—'}
          change={totalSales > 0 ? 'Based on all tracked orders' : 'No orders yet'}
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders Executed"
          value={`${countedOrders.length} Orders`}
          change={countedOrders.length > 0 ? `Avg. Value: ${formatCurrency(avgOrderValue)}` : 'No orders yet'}
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
            {orders.slice(0, 5).map((ord) => (
              <div key={ord.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-ivory">#{orderNumber(ord.id)}</span>
                    <span className="text-ivory/60">• {ord.shipping_address?.first_name} {ord.shipping_address?.last_name} ({ord.shipping_address?.district || ord.shipping_address?.city})</span>
                  </div>
                  <p className="text-[10px] text-ivory/50">
                    {ord.items ? ord.items.map(i => `${i.name} (${i.quantity})`).join(', ') : 'Garment Order'}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-gold">{formatCurrency(ord.total_amount)}</span>
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
