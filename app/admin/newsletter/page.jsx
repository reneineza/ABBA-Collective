'use client';

import React, { useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Download, Mail, CheckCircle2 } from 'lucide-react';

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([
    { id: 'sub_1', email: 'concierge@abbacollective.com', created_at: '2026-07-28' },
    { id: 'sub_2', email: 'grace@kingdomheirs.org', created_at: '2026-07-27' },
    { id: 'sub_3', email: 'david@covenantatelier.com', created_at: '2026-07-25' },
    { id: 'sub_4', email: 'elizabeth@royalidentity.com', created_at: '2026-07-20' },
  ]);

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + ['Email,Subscribed Date', ...subscribers.map(s => `${s.email},${s.created_at}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'abba_newsletter_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      header: 'Subscriber Email Address',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <Mail size={16} className="text-gold" />
          <span className="font-semibold text-ivory">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Subscription Date',
      cell: (row) => <span className="text-xs text-ivory/70">{row.created_at}</span>,
    },
    {
      header: 'Status',
      cell: () => (
        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/30">
          Subscribed
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gold/20 pb-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-ivory">
            Newsletter Subscribers Roster
          </h2>
          <p className="text-xs text-ivory/60 font-light">
            Manage opt-in email subscribers for editorial drops and collection releases.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 bg-gold text-charcoal hover:bg-gold-light transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
        >
          <Download size={16} /> Export CSV Roster
        </button>
      </div>

      <DataTable columns={columns} data={subscribers} searchPlaceholder="Search subscriber emails..." />
    </div>
  );
}
