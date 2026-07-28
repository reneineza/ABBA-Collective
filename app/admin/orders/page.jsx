'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { safeJsonParse } from '@/lib/utils/json';
import { sendShippingUpdate } from '@/lib/email/emailService';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { ShoppingBag, Eye, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      const savedOrders = safeJsonParse(localStorage.getItem('abba_orders_history'), []);
      setOrders(Array.isArray(savedOrders) && savedOrders.length > 0 ? savedOrders : [
        {
          id: 'ord_9x28v',
          created_at: new Date().toISOString(),
          status: 'Confirmed',
          total_amount: 130000,
          payment_provider: 'Card',
          shipping_address: { first_name: 'Grace', last_name: 'Heirs', email: 'grace@example.com', city: 'Kigali' },
          items: [{ name: 'Adoption Hoodie', quantity: 1 }, { name: 'ABBA Signature Tee', quantity: 1 }]
        },
        {
          id: 'ord_3k71p',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'Shipped',
          total_amount: 180000,
          payment_provider: 'Mobile Money',
          shipping_address: { first_name: 'David', last_name: 'Covenant', email: 'david@example.com', city: 'Kigali' },
          items: [{ name: 'Covenant Tailored Overcoat', quantity: 1 }]
        }
      ]);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    localStorage.setItem('abba_orders_history', JSON.stringify(updated));

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      await sendShippingUpdate({
        order: targetOrder,
        status: newStatus,
        customerEmail: targetOrder.shipping_address?.email || 'customer@abbacollective.com',
      });
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    (o.shipping_address?.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.shipping_address?.last_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: 'Order Reference',
      accessor: (row) => (
        <span className="font-bold text-ivory flex items-center gap-1.5">
          <ShoppingBag size={14} className="text-gold" /> #{row.id}
        </span>
      ),
    },
    {
      header: 'Client',
      accessor: (row) => (
        <div>
          <p className="font-semibold text-ivory">{row.shipping_address?.first_name} {row.shipping_address?.last_name}</p>
          <p className="text-[10px] text-ivory/50">{row.shipping_address?.city}</p>
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

      <DataTable columns={columns} data={filteredOrders} />
    </div>
  );
}
