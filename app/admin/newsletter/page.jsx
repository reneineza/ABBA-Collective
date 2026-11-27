'use client';

import React, { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { getBrowserClient } from '@/lib/supabase';
import { formatDate } from '@/lib/utils/formatDate';
import { Download, Mail, Trash2 } from 'lucide-react';

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // The site's newsletter form saves here; only admins can read the list
  useEffect(() => {
    getBrowserClient()
      .from('newsletter_subscribers')
      .select('id, email, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setErrorMsg('Could not load subscribers: ' + error.message);
        setSubscribers(data || []);
        setLoading(false);
      });
  }, []);

  const handleRemove = async (subscriber) => {
    if (!window.confirm(`Remove ${subscriber.email} from the newsletter?`)) return;
    const { error } = await getBrowserClient().from('newsletter_subscribers').delete().eq('id', subscriber.id);
    if (error) {
      setErrorMsg('Could not remove subscriber: ' + error.message);
      return;
    }
    setSubscribers((current) => current.filter((s) => s.id !== subscriber.id));
  };

  const handleExportCSV = () => {
    const rows = ['Email,Subscribed Date', ...subscribers.map((s) => `${s.email},${s.created_at.slice(0, 10)}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'abba_newsletter_subscribers.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      cell: (row) => <span className="text-xs text-ivory/70">{formatDate(row.created_at, 'short')}</span>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => handleRemove(row)}
          className="text-[10px] uppercase tracking-widest font-semibold text-red-300 hover:text-red-200 flex items-center gap-1"
        >
          <Trash2 size={12} /> Remove
        </button>
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
            {loading ? 'Loading…' : `${subscribers.length} people subscribed through the website.`}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="px-5 py-2.5 bg-gold text-charcoal hover:bg-gold-light transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 disabled:opacity-50"
        >
          <Download size={16} /> Export CSV Roster
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{errorMsg}</div>
      )}

      <DataTable columns={columns} data={subscribers} searchPlaceholder="Search subscriber emails..." />
    </div>
  );
}
