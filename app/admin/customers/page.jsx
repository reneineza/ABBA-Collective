'use client';

import React, { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { getBrowserClient } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import { Mail, Phone } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Registered accounts with their order count and lifetime spend (admins can read all rows)
  useEffect(() => {
    const supabase = getBrowserClient();
    Promise.all([
      supabase.from('profiles').select('id, full_name, email, phone, role, created_at').order('created_at', { ascending: false }),
      supabase.from('orders').select('user_id, total_amount, status').not('user_id', 'is', null),
    ]).then(([profilesRes, ordersRes]) => {
      if (profilesRes.error || ordersRes.error) {
        setErrorMsg('Could not load customers: ' + (profilesRes.error || ordersRes.error).message);
      }
      const totals = {};
      for (const order of ordersRes.data || []) {
        if (order.status === 'Cancelled') continue;
        const entry = (totals[order.user_id] ||= { orders_count: 0, total_spending: 0 });
        entry.orders_count += 1;
        entry.total_spending += Number(order.total_amount);
      }
      setCustomers(
        (profilesRes.data || []).map((profile) => ({
          ...profile,
          full_name: profile.full_name || '(no name)',
          orders_count: totals[profile.id]?.orders_count || 0,
          total_spending: totals[profile.id]?.total_spending || 0,
        }))
      );
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      header: 'Client Name',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-xs border border-gold/30">
            {row.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-ivory">
              {row.full_name}
              {row.role === 'admin' && (
                <span className="ml-2 text-[9px] uppercase tracking-widest text-gold border border-gold/40 px-1.5 py-0.5 rounded-sm">
                  Admin
                </span>
              )}
            </p>
            <p className="text-[10px] text-ivory/50">Member since {formatDate(row.created_at, 'short')}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Information',
      cell: (row) => (
        <div className="space-y-0.5 text-xs">
          <p className="text-ivory/80 flex items-center gap-1.5">
            <Mail size={12} className="text-gold" /> {row.email}
          </p>
          <p className="text-ivory/60 flex items-center gap-1.5 text-[11px]">
            <Phone size={12} className="text-gold" /> {row.phone || 'No phone yet'}
          </p>
        </div>
      ),
    },
    {
      header: 'Total Orders',
      cell: (row) => <span className="font-bold text-ivory">{row.orders_count} Orders</span>,
    },
    {
      header: 'Lifetime Value (LTV)',
      cell: (row) => <span className="font-bold text-emerald-400 text-sm">{formatCurrency(row.total_spending)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gold/20 pb-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-ivory">
            Client Directory & Lifetime Value Metrics
          </h2>
          <p className="text-xs text-ivory/60 font-light">
            {loading
              ? 'Loading…'
              : `${customers.length} registered accounts. Guest checkouts appear under Orders.`}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{errorMsg}</div>
      )}

      <DataTable columns={columns} data={customers} searchPlaceholder="Search clients by name, email, or phone..." />
    </div>
  );
}
