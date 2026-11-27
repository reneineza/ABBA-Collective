'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCatalog } from '@/lib/context/CatalogContext';
import { listVariantCosts } from '@/lib/stock';
import { loadReportData, buildReport, reportToCsv, kigaliDate } from '@/lib/finance';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import { Download, AlertTriangle } from 'lucide-react';

// Period presets in Kigali time
function presetRange(key) {
  const today = kigaliDate();
  const d = new Date(`${today}T12:00:00+02:00`);
  const iso = (date) => kigaliDate(date);
  if (key === 'today') return [today, today];
  if (key === 'week') {
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return [iso(monday), today];
  }
  if (key === 'month') return [today.slice(0, 8) + '01', today];
  if (key === 'last-month') {
    const first = new Date(d.getFullYear(), d.getMonth() - 1, 1, 12);
    const last = new Date(d.getFullYear(), d.getMonth(), 0, 12);
    return [iso(first), iso(last)];
  }
  return [today, today];
}

const PRESETS = [
  ['today', 'Today'],
  ['week', 'This week'],
  ['month', 'This month'],
  ['last-month', 'Last month'],
];

const pct = (v) => `${(v * 100).toFixed(1)}%`;

function Card({ title, value, note, tone = 'ivory' }) {
  const colour = { ivory: 'text-ivory', good: 'text-emerald-400', bad: 'text-red-300', gold: 'text-gold' }[tone];
  return (
    <div className="bg-charcoal border border-gold/20 p-5 rounded-sm">
      <p className="text-[10px] uppercase tracking-widest text-gold font-semibold">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${colour}`}>{value}</p>
      {note && <p className="text-[11px] text-ivory/50 mt-1">{note}</p>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-charcoal border border-gold/20 p-5 rounded-sm space-y-3">
      <h3 className="text-[11px] uppercase tracking-widest text-gold font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Line({ label, value, strong, muted }) {
  return (
    <div className={`flex justify-between text-xs ${muted ? 'text-ivory/50 pl-3' : 'text-ivory/80'} ${strong ? 'font-bold text-ivory border-t border-gold/10 pt-2' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function ReportsPage() {
  const { allProducts } = useCatalog();
  const [preset, setPreset] = useState('month');
  const [[from, to], setRange] = useState(presetRange('month'));
  const [data, setData] = useState(null);
  const [costs, setCosts] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setData(null);
    loadReportData(from, to).then(setData).catch((err) => setErrorMsg(err.message));
  }, [from, to]);

  useEffect(() => {
    listVariantCosts().then(setCosts).catch(() => {});
  }, []);

  const report = useMemo(() => (data ? buildReport(data) : null), [data]);

  // Current stock position (not tied to the period)
  const variants = allProducts.flatMap((p) => p.variants.map((v) => ({ ...v, product: p.name })));
  const stockValue = variants.reduce((sum, v) => sum + (costs[v.id] != null ? costs[v.id] * Math.max(v.stock_quantity, 0) : 0), 0);
  const uncostedStock = variants.filter((v) => costs[v.id] == null && v.stock_quantity > 0).length;
  const lowStock = variants.filter((v) => v.stock_quantity <= 5).length;

  const choosePreset = (key) => {
    setPreset(key);
    setRange(presetRange(key));
  };

  const exportCsv = () => {
    const blob = new Blob([reportToCsv(report, from, to)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `abba-report-${from}-to-${to}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const inputClass = 'p-2 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none [color-scheme:dark]';

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 border-b border-gold/20 pb-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-ivory">Financial Reports</h2>
          <p className="text-xs text-ivory/60 font-light">
            {formatDate(from)} – {formatDate(to)} · website and in-store
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => choosePreset(key)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-widest font-semibold border ${
                preset === key ? 'border-gold bg-gold/20 text-gold' : 'border-ivory/20 text-ivory/60 hover:text-ivory'
              }`}
            >
              {label}
            </button>
          ))}
          <input type="date" value={from} onChange={(e) => { setPreset('custom'); setRange([e.target.value, to]); }} className={inputClass} />
          <input type="date" value={to} onChange={(e) => { setPreset('custom'); setRange([from, e.target.value]); }} className={inputClass} />
          <button
            onClick={exportCsv}
            disabled={!report}
            className="px-3 py-2 bg-gold text-charcoal text-[11px] uppercase tracking-widest font-bold flex items-center gap-1 disabled:opacity-50"
          >
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {errorMsg && <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{errorMsg}</div>}
      {!report && !errorMsg && <p className="text-xs text-ivory/50">Loading…</p>}

      {report && (
        <>
          {report.uncostedUnits > 0 && (
            <div className="p-3 bg-yellow-950/40 border border-yellow-800/40 text-yellow-200 text-xs rounded-sm flex items-start gap-2">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              <span>
                {report.uncostedUnits} unit(s) sold in this period had no cost recorded ({report.uncostedProducts.join(', ')}), so
                profit is overstated. Enter costs on the{' '}
                <Link href="/admin/stock" className="underline">Stock page</Link> for future sales.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              title="Revenue"
              value={formatCurrency(report.revenue.totalRevenue)}
              note={`${report.revenue.onlineOrders} website orders · ${report.revenue.storeSales} in-store sales`}
            />
            <Card
              title="Gross Profit"
              value={formatCurrency(report.grossProfit)}
              note={`${pct(report.grossMargin)} margin on goods`}
              tone={report.grossProfit >= 0 ? 'good' : 'bad'}
            />
            <Card title="Expenses" value={formatCurrency(report.expensesTotal)} note="Operating costs" />
            <Card
              title="Net Profit"
              value={formatCurrency(report.netProfit)}
              note="Revenue − cost of goods − expenses"
              tone={report.netProfit >= 0 ? 'good' : 'bad'}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Section title="Revenue">
              <Line label="Website orders" value={formatCurrency(report.revenue.onlineTotal)} />
              <Line label="of which delivery fees" value={formatCurrency(report.revenue.deliveryFees)} muted />
              <Line label="In-store sales" value={formatCurrency(report.revenue.storeTotal)} />
              {report.revenue.storeDiscounts > 0 && (
                <Line label="after discounts of" value={formatCurrency(report.revenue.storeDiscounts)} muted />
              )}
              <Line label="Total revenue" value={formatCurrency(report.revenue.totalRevenue)} strong />
              <Line label="Cost of goods sold" value={`− ${formatCurrency(report.cogs)}`} />
              <Line label="Gross profit (goods)" value={formatCurrency(report.grossProfit)} strong />
            </Section>

            <Section title="By Payment Method">
              {Object.keys(report.byPaymentMethod).length === 0 && <p className="text-xs text-ivory/50 italic">No sales in this period.</p>}
              {Object.entries(report.byPaymentMethod)
                .sort((a, b) => b[1] - a[1])
                .map(([method, amount]) => (
                  <Line key={method} label={method} value={formatCurrency(amount)} />
                ))}
              <p className="text-[10px] text-ivory/40 pt-1">Use this to reconcile cash, MoMo and bank balances.</p>
            </Section>

            <Section title="Expenses by Category">
              {Object.keys(report.expensesByCategory).length === 0 && <p className="text-xs text-ivory/50 italic">No expenses recorded.</p>}
              {Object.entries(report.expensesByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => (
                  <Line key={category} label={category} value={formatCurrency(amount)} />
                ))}
              {report.expensesTotal > 0 && <Line label="Total" value={formatCurrency(report.expensesTotal)} strong />}
              <Link href="/admin/expenses" className="text-[10px] text-gold hover:underline">Record or view expenses →</Link>
            </Section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Section title="Cash In & Out">
              <Line label="Money in (sales)" value={formatCurrency(report.cash.in)} />
              <Line label="Supplier deliveries paid" value={`− ${formatCurrency(report.cash.deliveriesPaid)}`} />
              <Line label="Expenses paid" value={`− ${formatCurrency(report.cash.expenses)}`} />
              <Line label="Net cash" value={formatCurrency(report.cash.net)} strong />
              {report.deliveriesUnpaid.length > 0 && (
                <div className="pt-2 space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-yellow-300">Deliveries not marked as paid</p>
                  {report.deliveriesUnpaid.map((d) => (
                    <Line key={d.id} label={`${d.supplier} (${formatDate(d.purchased_on, 'short')})`} value={formatCurrency(d.cost)} muted />
                  ))}
                </div>
              )}
            </Section>

            <Section title="Stock Right Now">
              <Line label="Stock value at cost" value={formatCurrency(stockValue)} />
              <Line label="Items in stock without a cost" value={uncostedStock} />
              <Line label="Items with 5 or fewer left" value={lowStock} />
              <Link href="/admin/stock" className="text-[10px] text-gold hover:underline">Open stock →</Link>
            </Section>

            <Section title="Day by Day">
              {report.daily.length === 0 && <p className="text-xs text-ivory/50 italic">No activity in this period.</p>}
              <div className="max-h-56 overflow-y-auto space-y-1">
                {report.daily.map((d) => (
                  <div key={d.date} className="grid grid-cols-3 text-xs text-ivory/80">
                    <span>{formatDate(d.date, 'short')}</span>
                    <span className="text-right text-emerald-400">{formatCurrency(d.revenue)}</span>
                    <span className="text-right text-red-300">{d.expenses ? `− ${formatCurrency(d.expenses)}` : ''}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <Section title="Profit by Product">
            {report.productRows.length === 0 ? (
              <p className="text-xs text-ivory/50 italic">No products sold in this period.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[10px] uppercase tracking-widest text-gold">
                    <tr className="border-b border-gold/20">
                      <th className="py-2">Product</th>
                      <th className="py-2 text-right">Units</th>
                      <th className="py-2 text-right">Revenue</th>
                      <th className="py-2 text-right">Cost</th>
                      <th className="py-2 text-right">Profit</th>
                      <th className="py-2 text-right">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10 text-ivory/80">
                    {report.productRows.map((p) => (
                      <tr key={p.name}>
                        <td className="py-2">
                          {p.name}
                          {p.uncostedUnits > 0 && <span className="ml-2 text-[10px] text-yellow-300">{p.uncostedUnits} without cost</span>}
                        </td>
                        <td className="py-2 text-right">{p.units}</td>
                        <td className="py-2 text-right">{formatCurrency(p.revenue)}</td>
                        <td className="py-2 text-right">{formatCurrency(p.cost)}</td>
                        <td className={`py-2 text-right font-semibold ${p.profit >= 0 ? 'text-emerald-400' : 'text-red-300'}`}>{formatCurrency(p.profit)}</td>
                        <td className="py-2 text-right">{pct(p.margin)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[10px] text-ivory/40 pt-2">Product revenue is before in-store discounts.</p>
              </div>
            )}
          </Section>
        </>
      )}
    </div>
  );
}
