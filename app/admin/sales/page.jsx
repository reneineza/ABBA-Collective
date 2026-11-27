'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import { useAuth } from '@/lib/context/AuthContext';
import { hasPermission } from '@/lib/roles';
import { listStoreSales } from '@/lib/storeSales';
import { PAYMENT_METHODS } from '@/lib/stock';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { orderNumber } from '@/lib/utils/orders';
import { Plus, Receipt } from 'lucide-react';

const kigaliDate = (offsetDays = 0) =>
  new Date(Date.now() - offsetDays * 86400000).toLocaleDateString('en-CA', { timeZone: 'Africa/Kigali' });

const RANGES = {
  today: { label: 'Today', from: () => kigaliDate(0) },
  week: { label: 'Last 7 days', from: () => kigaliDate(6) },
  month: { label: 'Last 30 days', from: () => kigaliDate(29) },
};

export default function StoreSalesPage() {
  const { profile } = useAuth();
  const showTotals = hasPermission(profile, 'reports.view');
  const [range, setRange] = useState('today');
  const [sales, setSales] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    listStoreSales(RANGES[range].from(), kigaliDate(0))
      .then(setSales)
      .catch((err) => setErrorMsg(err.message));
  }, [range]);

  const total = sales.reduce((sum, s) => sum + Number(s.total), 0);
  const byMethod = PAYMENT_METHODS.map((m) => ({
    method: m,
    amount: sales.filter((s) => s.payment_method === m).reduce((sum, s) => sum + Number(s.total), 0),
  })).filter((x) => x.amount > 0);

  const columns = [
    {
      header: 'Receipt',
      cell: (row) => (
        <Link href={`/admin/sales/${row.id}`} className="font-bold text-ivory hover:text-gold flex items-center gap-1.5">
          <Receipt size={13} className="text-gold" /> #{orderNumber(row.id)}
        </Link>
      ),
    },
    {
      header: 'When',
      cell: (row) => (
        <span className="text-[11px] text-ivory/70">
          {new Date(row.sold_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Kigali' })}
        </span>
      ),
    },
    {
      header: 'Items',
      cell: (row) => (
        <span className="text-xs text-ivory/70 line-clamp-2 max-w-xs">
          {row.items.map((i) => `${i.product_name} ${i.color} ${i.size} ×${i.quantity}`).join(', ')}
        </span>
      ),
    },
    {
      header: 'Total',
      cell: (row) => (
        <div>
          <p className="font-bold text-gold">{formatCurrency(row.total)}</p>
          <p className="text-[10px] text-ivory/50">{row.payment_method}</p>
        </div>
      ),
    },
    {
      header: 'Sold by',
      cell: (row) => <span className="text-[11px] text-ivory/70">{row.created_by?.full_name || row.created_by?.email || '—'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gold/20 pb-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-ivory">In-Store Sales</h2>
          <p className="text-xs text-ivory/60 font-light">Sales made in person, outside the website.</p>
        </div>
        {hasPermission(profile, 'sales.record') && (
        <Link
          href="/admin/sales/new"
          className="px-5 py-2.5 bg-gold text-charcoal text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 w-fit"
        >
          <Plus size={16} /> New Sale
        </Link>
        )}
      </div>

      <div className="flex gap-2">
        {Object.entries(RANGES).map(([key, r]) => (
          <button
            key={key}
            onClick={() => setRange(key)}
            className={`px-3 py-1.5 text-[11px] uppercase tracking-widest font-semibold border ${
              range === key ? 'border-gold bg-gold/20 text-gold' : 'border-ivory/20 text-ivory/60 hover:text-ivory'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {showTotals && sales.length > 0 && (
        <div className="bg-charcoal border border-gold/20 p-4 rounded-sm flex flex-wrap gap-6 text-xs">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold">{sales.length} sales</p>
            <p className="text-xl font-bold text-ivory">{formatCurrency(total)}</p>
          </div>
          {byMethod.map((m) => (
            <div key={m.method}>
              <p className="text-[10px] uppercase tracking-widest text-ivory/50">{m.method}</p>
              <p className="font-semibold text-ivory/90">{formatCurrency(m.amount)}</p>
            </div>
          ))}
        </div>
      )}

      {errorMsg && <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{errorMsg}</div>}

      <DataTable columns={columns} data={sales} searchPlaceholder="Search sales..." />
    </div>
  );
}
