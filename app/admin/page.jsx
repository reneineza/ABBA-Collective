'use client';

import React, { useState, useEffect } from 'react';
import StatCard from '@/components/admin/StatCard';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { getBrowserClient } from '@/lib/supabase';
import { useCatalog } from '@/lib/context/CatalogContext';
import { orderNumber } from '@/lib/utils/orders';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight, AlertTriangle, Truck } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { hasPermission } from '@/lib/roles';
import Link from 'next/link';

const LOW_STOCK = 5;

export default function AdminDashboardPage() {
  const { profile } = useAuth();
  const showFinance = hasPermission(profile, 'reports.view');
  const showClients = hasPermission(profile, 'customers.view');
  const showSubscribers = hasPermission(profile, 'newsletter.manage');
  const [orders, setOrders] = useState([]);

  // Staff can read every order (database policies "Admins manage orders" / "Staff view orders")
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
    if (!showClients) return; // the customer directory needs its own permission
    const supabase = getBrowserClient();
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
      showSubscribers ? supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }) : null,
    ]).then(([customersRes, subscribersRes]) => {
      setCounts({ customers: customersRes.count ?? 0, subscribers: subscribersRes ? subscribersRes.count ?? 0 : null });
    });
  }, [showClients, showSubscribers]);

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
  const { allProducts, collections } = useCatalog();
  const collectionCount = collections.length;
  const totalSales = countedOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const avgOrderValue = countedOrders.length > 0 ? totalSales / countedOrders.length : 0;
  const toFulfil = orders.filter((o) => o.status === 'Confirmed' || o.status === 'Processing' || o.status === 'Pending');
  const inTransit = orders.filter((o) => o.status === 'Shipped');

  // Variants running low or sold out (visible products only)
  const lowStock = allProducts
    .filter((p) => p.active)
    .flatMap((p) => p.variants.map((v) => ({ ...v, name: p.name })))
    .filter((v) => v.stock_quantity <= LOW_STOCK)
    .sort((a, b) => a.stock_quantity - b.stock_quantity);

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {showFinance ? (
          <>
            <StatCard
              title="Total Gross Revenue"
              value={totalSales > 0 ? formatCurrency(totalSales) : '—'}
              change={totalSales > 0 ? 'Website orders' : 'No orders yet'}
              icon={DollarSign}
            />
            <StatCard
              title="Total Orders Executed"
              value={`${countedOrders.length} Orders`}
              change={countedOrders.length > 0 ? `Avg. Value: ${formatCurrency(avgOrderValue)}` : 'No orders yet'}
              icon={ShoppingBag}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Orders to Pack"
              value={`${toFulfil.length} Orders`}
              change="Confirmed, not yet shipped"
              icon={ShoppingBag}
            />
            <StatCard
              title="Out for Delivery"
              value={`${inTransit.length} Orders`}
              change="Shipped, awaiting delivery"
              icon={Truck}
            />
          </>
        )}
        <StatCard
          title="Catalogue"
          value={`${allProducts.filter((p) => p.active).length} Products`}
          change={`${collectionCount} Collections`}
          icon={Package}
        />
        {showClients ? (
          <StatCard
            title="Total Client Directory"
            value={counts.customers === null ? '…' : `${counts.customers} Clients`}
            change={counts.subscribers === null ? '' : `${counts.subscribers} Newsletter Subscribers`}
            icon={Users}
          />
        ) : (
          <StatCard
            title="Low Stock Alerts"
            value={`${lowStock.length} Variants`}
            change={`${lowStock.filter((v) => v.stock_quantity <= 0).length} sold out, ${LOW_STOCK} or fewer left`}
            icon={AlertTriangle}
          />
        )}
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
                  {showFinance && <p className="text-[10px] text-gold">{formatCurrency(product.revenue)}</p>}
                </div>
                <span className="font-semibold text-ivory">{product.units} Units Sold</span>
              </div>
            ))}
          </div>

          {lowStock.length > 0 && (
            <div className="pt-2 space-y-2">
              <span className="text-[10px] uppercase tracking-luxurious text-gold font-semibold block">
                ✦ Restock Soon ✦
              </span>
              {lowStock.slice(0, 6).map((v) => (
                <div key={v.id} className="flex justify-between text-xs">
                  <span className="text-ivory/80">
                    {v.name} · {v.color} {v.size}
                  </span>
                  <span className={v.stock_quantity <= 0 ? 'text-red-300 font-semibold' : 'text-yellow-300'}>
                    {v.stock_quantity <= 0 ? 'Sold out' : `${v.stock_quantity} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
