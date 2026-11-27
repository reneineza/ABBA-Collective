'use client';

import React, { useState, useEffect } from 'react';
import StatCard from '@/components/admin/StatCard';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { getBrowserClient } from '@/lib/supabase';
import { SAMPLE_PRODUCTS, SAMPLE_COLLECTIONS } from '@/lib/data/sampleData';
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

  const [counts, setCounts] = useState({ customers: null, subscribers: null });

  useEffect(() => {
    const supabase = getBrowserClient();
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
      supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
    ]).then(([customersRes, subscribersRes]) => {
      setCounts({ customers: customersRes.count ?? 0, subscribers: subscribersRes.count ?? 0 });
    });
  }, []);

  const countedOrders = orders.filter((o) => o.status !== 'Cancelled');

  // Best sellers by units across all non-cancelled orders
  const unitsByProduct = {};
  for (const order of countedOrders) {
    for (const item of order.items || []) {
      const key = item.product_id || item.name;
      const entry = (unitsByProduct[key] ||= { name: item.name, units: 0, revenue: 0 });
      entry.units += Number(item.quantity || 0);
      entry.revenue += Number(item.price || 0) * Number(item.quantity || 0);
    }
  }
  const topProducts = Object.values(unitsByProduct).sort((a, b) => b.units - a.units).slice(0, 3);
  const collectionCount = SAMPLE_COLLECTIONS.length;
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
          title="Catalogue"
          value={`${SAMPLE_PRODUCTS.length} Products`}
          change={`${collectionCount} Collections`}
          icon={Package}
        />
        <StatCard
          title="Total Client Directory"
          value={counts.customers === null ? '…' : `${counts.customers} Clients`}
          change={counts.subscribers === null ? '' : `${counts.subscribers} Newsletter Subscribers`}
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
            {topProducts.length === 0 && <p className="text-ivory/50 italic">No sales yet.</p>}
            {topProducts.map((product) => (
              <div key={product.name} className="flex justify-between items-center border-b border-gold/10 pb-2">
                <div>
                  <p className="font-bold text-ivory">{product.name}</p>
                  <p className="text-[10px] text-gold">{formatCurrency(product.revenue)}</p>
                </div>
                <span className="font-semibold text-ivory">{product.units} Units Sold</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
