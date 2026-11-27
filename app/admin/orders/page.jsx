'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { getBrowserClient } from '@/lib/supabase';
import { orderNumber } from '@/lib/utils/orders';
import { sendShippingUpdate } from '@/lib/email/emailService';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { ShoppingBag, Eye, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');

  const [loadError, setLoadError] = useState('');

  // Admins can read every order (database policy "Admins manage orders")
  useEffect(() => {
    getBrowserClient()
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setLoadError('Could not load orders: ' + error.message);
        setOrders(data || []);
      });
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const previous = orders;
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

    const { error } = await getBrowserClient().from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) {
      setOrders(previous);
      setLoadError('Could not update the order status: ' + error.message);
      return;
    }

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder?.customer_email) {
      await sendShippingUpdate({ order: targetOrder, status: newStatus, customerEmail: targetOrder.customer_email });
    }
  };

  const query = search.toLowerCase();
  const filteredOrders = orders.filter((o) =>
    orderNumber(o.id).toLowerCase().includes(query) ||
    (o.customer_name || '').toLowerCase().includes(query) ||
    (o.customer_phone || '').replace(/\s/g, '').includes(query.replace(/\s/g, '')) ||
    (o.shipping_address?.first_name || '').toLowerCase().includes(query) ||
    (o.shipping_address?.last_name || '').toLowerCase().includes(query)
  );

  const columns = [
    {
      header: 'Order Reference',
      accessor: (row) => (
        <span className="font-bold text-ivory flex items-center gap-1.5">
          <ShoppingBag size={14} className="text-gold" /> #{orderNumber(row.id)}
        </span>
      ),
    },
    {
      header: 'Client',
      accessor: (row) => (
        <div>
          <p className="font-semibold text-ivory">{row.shipping_address?.first_name} {row.shipping_address?.last_name}</p>
          <p className="text-[10px] text-ivory/50">
            {row.shipping_address?.district || row.shipping_address?.city} · {row.customer_phone || row.shipping_address?.phone}
          </p>
        </div>
      ),
    },
    {
      header: 'Items',
      accessor: (row) => (
        <span className="text-ivory/70">
          {row.items ? row.items.map(i => `${i.name} (x${i.quantity})`).join(', ') : 'Garment'}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: (row) => <span className="font-bold text-gold">{formatCurrency(row.total_amount)}</span>,
    },
    {
      header: 'Fulfillment Status',
      accessor: (row) => (
        <OrderStatusBadge
          status={row.status}
          onChange={(newStatus) => handleStatusChange(row.id, newStatus)}
        />
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Link
          href={`/orders/${row.id}`}
          className="p-1.5 bg-ivory/10 hover:bg-gold hover:text-charcoal transition-colors rounded-sm inline-block text-gold"
          title="View Receipt"
        >
          <Eye size={15} />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-luxurious text-gold font-semibold block">
            ✦ Client Logistics ✦
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold text-ivory">
            Order Fulfillment & Tracking
          </h1>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID or client..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-charcoal-light border border-gold/20 text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none rounded-sm"
          />
        </div>
      </div>

      {loadError && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{loadError}</div>
      )}
      <DataTable columns={columns} data={filteredOrders} />
    </div>
  );
}
