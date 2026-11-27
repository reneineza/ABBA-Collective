'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useCatalog } from '@/lib/context/CatalogContext';
import { listDeliveries, setItemCost, deleteDelivery } from '@/lib/stock';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import { PackagePlus, Trash2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export default function DeliveriesPage() {
  const { profile } = useAuth();
  const { reload } = useCatalog();
  const isOwner = profile?.role === 'admin';
  const [deliveries, setDeliveries] = useState([]);
  const [open, setOpen] = useState(null);
  const [costInputs, setCostInputs] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [filter, setFilter] = useState('all');

  const load = () => listDeliveries().then(setDeliveries).catch((err) => setErrorMsg(err.message));
  useEffect(() => {
    load();
  }, []);

  const totalOf = (d) => d.items.reduce((sum, i) => sum + (i.unit_cost != null ? Number(i.unit_cost) * i.quantity : 0), 0);
  const pendingOf = (d) => d.items.filter((i) => i.unit_cost == null).length;
  const pendingCount = deliveries.filter((d) => pendingOf(d) > 0).length;
  const shown = filter === 'pending' ? deliveries.filter((d) => pendingOf(d) > 0) : deliveries;

  const handleSetCost = async (item) => {
    setErrorMsg('');
    const value = costInputs[item.id];
    if (value === undefined || value === '') return;
    try {
      await setItemCost(item.id, Number(value));
      await load();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleDelete = async (d) => {
    if (!confirm(`Delete the delivery from ${d.supplier} (${formatDate(d.purchased_on, 'short')})? Its items will be taken back out of stock.`)) return;
    setErrorMsg('');
    try {
      await deleteDelivery(d.id);
      await Promise.all([load(), reload()]);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gold/20 pb-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-ivory">Deliveries & Costs</h2>
          <p className="text-xs text-ivory/60 font-light">
            Stock bought from suppliers. Costs feed the average cost of each item and the profit reports.
          </p>
        </div>
        <Link
          href="/admin/stock/receive"
          className="px-5 py-2.5 bg-gold text-charcoal text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 w-fit"
        >
          <PackagePlus size={16} /> Receive Delivery
        </Link>
      </div>

      {pendingCount > 0 && (
        <div className="p-3 bg-yellow-950/40 border border-yellow-800/40 text-yellow-200 text-xs rounded-sm flex items-center gap-2">
          <AlertCircle size={16} /> {pendingCount} deliver{pendingCount === 1 ? 'y has' : 'ies have'} items without a cost. Open them to enter the cost per unit.
          <button onClick={() => setFilter(filter === 'pending' ? 'all' : 'pending')} className="ml-auto underline">
            {filter === 'pending' ? 'Show all' : 'Show only these'}
          </button>
        </div>
      )}

      {errorMsg && <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{errorMsg}</div>}

      <div className="bg-charcoal border border-gold/20 rounded-sm divide-y divide-gold/10">
        {shown.length === 0 && <p className="p-8 text-center text-ivory/50 italic text-xs">No deliveries recorded yet.</p>}
        {shown.map((d) => {
          const pending = pendingOf(d);
          const units = d.items.reduce((sum, i) => sum + i.quantity, 0);
          return (
            <div key={d.id}>
              <button
                onClick={() => setOpen(open === d.id ? null : d.id)}
                className="w-full p-4 grid grid-cols-12 gap-3 items-center text-left hover:bg-ivory/5 text-xs"
              >
                <div className="col-span-4">
                  <p className="font-bold text-ivory">{d.supplier}</p>
                  <p className="text-[10px] text-ivory/50">
                    {formatDate(d.purchased_on, 'short')}
                    {d.reference && ` · ${d.reference}`}
                  </p>
                </div>
                <div className="col-span-2 text-ivory/80">{units} units</div>
                <div className="col-span-3">
                  <p className="font-bold text-gold">{formatCurrency(totalOf(d))}</p>
                  {pending > 0 && <p className="text-[10px] text-yellow-300">{pending} item(s) cost pending</p>}
                </div>
                <div className="col-span-2 text-[10px] text-ivory/60">
                  {d.payment_method || 'Payment not recorded'}
                  <br />
                  by {d.created_by?.full_name || d.created_by?.email || '—'}
                </div>
                <div className="col-span-1 text-right text-ivory/50">{open === d.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
              </button>

              {open === d.id && (
                <div className="px-4 pb-4 space-y-2">
                  {d.items.map((i) => (
                    <div key={i.id} className="grid grid-cols-12 gap-2 items-center text-xs bg-charcoal-dark p-2 border border-gold/10">
                      <span className="col-span-5 text-ivory">
                        {i.product_name} · {i.color} {i.size}
                      </span>
                      <span className="col-span-2 text-ivory/70">× {i.quantity}</span>
                      {i.unit_cost != null ? (
                        <span className="col-span-5 text-right text-ivory/80">
                          {formatCurrency(i.unit_cost)} each = <strong className="text-gold">{formatCurrency(i.unit_cost * i.quantity)}</strong>
                        </span>
                      ) : (
                        <div className="col-span-5 flex gap-2 justify-end">
                          <input
                            type="number"
                            min="0"
                            placeholder="Cost / unit"
                            value={costInputs[i.id] ?? ''}
                            onChange={(e) => setCostInputs((c) => ({ ...c, [i.id]: e.target.value }))}
                            className="w-32 p-1.5 bg-charcoal border border-gold/30 text-ivory text-xs focus:outline-none"
                          />
                          <button onClick={() => handleSetCost(i)} className="px-3 py-1 bg-gold text-charcoal font-bold text-[10px] uppercase">
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {d.notes && <p className="text-[11px] text-ivory/50 italic">Notes: {d.notes}</p>}
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(d)}
                      className="text-[10px] uppercase tracking-widest font-semibold text-red-300 hover:text-red-200 flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete delivery (recorded by mistake)
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
