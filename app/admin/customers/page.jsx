'use client';

import React, { useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Users, Mail, Phone } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers] = useState([
    {
      id: 'usr_1',
      full_name: 'Grace Heirs',
      email: 'grace@abbacollective.com',
      phone: '+1 (555) 019-2831',
      orders_count: 3,
      total_spending: 690.00,
      joined: 'July 2026',
    },
    {
      id: 'usr_2',
      full_name: 'David Covenant',
      email: 'david@covenant.org',
      phone: '+1 (555) 234-8901',
      orders_count: 2,
      total_spending: 565.00,
      joined: 'July 2026',
    },
    {
      id: 'usr_3',
      full_name: 'Solomon Wise',
      email: 'solomon@wisdom.com',
      phone: '+1 (555) 345-6789',
      orders_count: 1,
      total_spending: 185.00,
      joined: 'July 2026',
    },
  ]);

  const columns = [
    {
      header: 'Client Name',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-xs border border-gold/30">
            {row.full_name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-ivory">{row.full_name}</p>
            <p className="text-[10px] text-ivory/50">Member since {row.joined}</p>
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
            <Phone size={12} className="text-gold" /> {row.phone}
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
      cell: (row) => <span className="font-bold text-emerald-400 text-sm">${row.total_spending.toFixed(2)}</span>,
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
            Manage customer accounts, purchase history, and spending volume.
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={customers} searchPlaceholder="Search clients by name, email, or phone..." />
    </div>
  );
}
