'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import { useCatalog } from '@/lib/context/CatalogContext';
import { useAuth } from '@/lib/context/AuthContext';
import { canSeeFinance } from '@/lib/roles';
import { adjustStock, listMovements, listVariantCosts, STOCK_REASONS } from '@/lib/stock';
import { setVariantCost } from '@/lib/storeSales';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { orderNumber } from '@/lib/utils/orders';
import { PackagePlus, SlidersHorizontal, X } from 'lucide-react';

const LOW_STOCK = 5;

function formatDateTime(value) {
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Kigali',
  });
}

export default function AdminStockPage() {
  const { allProducts, reload } = useCatalog();
  const { profile } = useAuth();
  const showCosts = canSeeFinance(profile?.role);
  const [tab, setTab] = useState('levels');
  const [costs, setCosts] = useState({});
  const [movements, setMovements] = useState([]);
  const [adjusting, setAdjusting] = useState(null); // variant row being adjusted
  const [costing, setCosting] = useState(null); // variant row whose cost is being set
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (showCosts) listVariantCosts().then(setCosts).catch((err) => setErrorMsg(err.message));
  }, [showCosts]);

  useEffect(() => {
    if (tab === 'history') listMovements().then(setMovements).catch((err) => setErrorMsg(err.message));
  }, [tab]);

  // One row per colour/size
  const rows = allProducts.flatMap((p) =>
    p.variants.map((v) => ({
      ...v,
      product: p.name,
      product_active: p.active,
      avg_cost: costs[v.id] ?? null,
    }))
  );
  const totalUnits = rows.reduce((sum, r) => sum + Math.max(r.stock_quantity, 0), 0);
  const stockValue = rows.reduce((sum, r) => sum + (r.avg_cost != null ? r.avg_cost * Math.max(r.stock_quantity, 0) : 0), 0);
  const uncosted = rows.filter((r) => r.avg_cost == null && r.stock_quantity > 0).length;

  const levelColumns = [
    {
      header: 'Product',
      cell: (row) => (
        <div>
          <p className="font-bold text-ivory">
            {row.product}
            {!row.product_active && <span className="ml-2 text-[9px] uppercase text-ivory/50 border border-ivory/20 px-1">Hidden</span>}
          </p>
          <p className="text-[10px] text-ivory/60">
            {row.color} · {row.size} · <span className="font-mono">{row.sku}</span>
          </p>
        </div>
      ),
    },
    {
      header: 'In Stock',
      cell: (row) => (
        <span
          className={`font-bold ${row.stock_quantity <= 0 ? 'text-red-300' : row.stock_quantity <= LOW_STOCK ? 'text-yellow-300' : 'text-emerald-400'}`}
        >
          {row.stock_quantity <= 0 ? 'Sold out' : row.stock_quantity}
        </span>
      ),
    },
    ...(showCosts
      ? [
          {
            header: 'Avg. Cost / Stock Value',
            cell: (row) =>
              row.avg_cost == null ? (
                <button onClick={() => setCosting(row)} className="text-[10px] text-yellow-300 hover:text-gold underline">
                  No cost yet · Set cost
                </button>
              ) : (
                <div className="text-xs">
                  <p className="text-ivory/80">
                    {formatCurrency(row.avg_cost)}
                    {profile?.role === 'admin' && (
                      <button onClick={() => setCosting(row)} className="ml-2 text-[10px] text-ivory/40 hover:text-gold underline">
                        change
                      </button>
                    )}
                  </p>
                  <p className="text-[10px] text-gold">{formatCurrency(row.avg_cost * Math.max(row.stock_quantity, 0))}</p>
                </div>
              ),
          },
        ]
      : []),
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => setAdjusting(row)}
          className="text-[10px] uppercase tracking-widest font-semibold text-gold hover:text-ivory flex items-center gap-1"
        >
          <SlidersHorizontal size={12} /> Adjust
        </button>
      ),
    },
  ];

  const historyColumns = [
    { header: 'When', cell: (row) => <span className="text-[11px] text-ivory/70 whitespace-nowrap">{formatDateTime(row.created_at)}</span> },
    {
      header: 'Item',
      cell: (row) => (
        <div>
          <p className="font-semibold text-ivory text-xs">{row.product_name || 'Deleted product'}</p>
          <p className="text-[10px] text-ivory/60">{row.color} · {row.size}</p>
        </div>
      ),
    },
    {
      header: 'Change',
      cell: (row) => (
        <div>
          <span className={`font-bold ${row.change > 0 ? 'text-emerald-400' : 'text-red-300'}`}>
            {row.change > 0 ? `+${row.change}` : row.change}
          </span>
          <p className="text-[10px] text-ivory/50">now {row.stock_after}</p>
        </div>
      ),
    },
    {
      header: 'Reason',
      cell: (row) => (
        <div className="text-xs">
          <p className="text-ivory/80">{STOCK_REASONS[row.reason] || row.reason}</p>
          {row.note && <p className="text-[10px] text-ivory/50 italic">{row.note}</p>}
          {row.reference_id && row.reason === 'store_sale' && (
            <Link href={`/admin/sales/${row.reference_id}`} className="text-[10px] text-gold hover:underline">
              Receipt #{orderNumber(row.reference_id)}
            </Link>
          )}
          {row.reference_id && ['online_order', 'order_cancelled'].includes(row.reason) && (
            <Link href={`/orders/${row.reference_id}`} target="_blank" className="text-[10px] text-gold hover:underline">
              Order #{orderNumber(row.reference_id)}
            </Link>
          )}
        </div>
      ),
    },
    {
      header: 'By',
      cell: (row) => <span className="text-[11px] text-ivory/70">{row.created_by?.full_name || row.created_by?.email || 'Website'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gold/20 pb-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-ivory">Stock</h2>
          <p className="text-xs text-ivory/60 font-light">
            {totalUnits} units in stock
            {showCosts && <> · stock value {formatCurrency(stockValue)}{uncosted > 0 && ` (${uncosted} items without a cost)`}</>}
          </p>
        </div>
        <Link
          href="/admin/stock/receive"
          className="px-5 py-2.5 bg-gold text-charcoal hover:bg-gold-light transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 w-fit"
        >
          <PackagePlus size={16} /> Receive Delivery
        </Link>
      </div>

      <div className="flex gap-6 border-b border-gold/20 text-xs uppercase tracking-widest font-semibold">
        {[
          ['levels', 'Stock Levels'],
          ['history', 'History'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-3 border-b-2 ${tab === key ? 'border-gold text-gold' : 'border-transparent text-ivory/50 hover:text-ivory'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {errorMsg && <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{errorMsg}</div>}

      {tab === 'levels' ? (
        <DataTable columns={levelColumns} data={rows} searchPlaceholder="Search by product, colour, size or SKU..." />
      ) : (
        <DataTable columns={historyColumns} data={movements} searchPlaceholder="Search stock history..." />
      )}

      {costing && (
        <CostDialog
          variant={costing}
          onClose={() => setCosting(null)}
          onDone={async () => {
            setCosting(null);
            setCosts(await listVariantCosts());
          }}
        />
      )}

      {adjusting && (
        <AdjustDialog
          variant={adjusting}
          onClose={() => setAdjusting(null)}
          onDone={async () => {
            setAdjusting(null);
            await reload();
            if (tab === 'history') setMovements(await listMovements());
          }}
        />
      )}
    </div>
  );
}

function AdjustDialog({ variant, onClose, onDone }) {
  const [direction, setDirection] = useState('remove');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const amount = Math.abs(Number(quantity));
      await adjustStock(variant.id, direction === 'remove' ? -amount : amount, note);
      await onDone();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-charcoal border border-gold/30 p-6 rounded-sm space-y-4 w-full max-w-md">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-ivory">Adjust Stock</h3>
            <p className="text-xs text-ivory/60">
              {variant.product} · {variant.color} {variant.size} · currently {variant.stock_quantity}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-ivory/60 hover:text-gold">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2">
          {[
            ['remove', 'Remove'],
            ['add', 'Add'],
          ].map(([key, label]) => (
            <button
              type="button"
              key={key}
              onClick={() => setDirection(key)}
              className={`flex-1 py-2 text-xs uppercase tracking-widest font-semibold border ${
                direction === key ? 'border-gold bg-gold/20 text-gold' : 'border-ivory/20 text-ivory/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          type="number"
          min="1"
          required
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none"
        />
        <input
          type="text"
          required
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Reason (e.g. 2 damaged in storage, stock count correction)"
          className="w-full p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none"
        />
        <p className="text-[11px] text-ivory/50">For new deliveries from a supplier, use Receive Delivery instead.</p>

        {errorMsg && <p className="text-xs text-red-300">{errorMsg}</p>}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="text-xs uppercase text-ivory/60">Cancel</button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-gold text-charcoal text-xs font-bold uppercase disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Adjustment'}
          </button>
        </div>
      </form>
    </div>
  );
}

function CostDialog({ variant, onClose, onDone }) {
  const [cost, setCost] = useState(variant.avg_cost ?? '');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      await setVariantCost(variant.id, cost);
      await onDone();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-charcoal border border-gold/30 p-6 rounded-sm space-y-4 w-full max-w-md">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-ivory">Cost per Unit</h3>
            <p className="text-xs text-ivory/60">
              {variant.product} · {variant.color} {variant.size}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-ivory/60 hover:text-gold">
            <X size={18} />
          </button>
        </div>
        <p className="text-[11px] text-ivory/50">
          What one unit cost the business (buying or making it). Used to calculate profit on every sale from now on.
          New deliveries with a cost update this automatically.
        </p>
        <input
          type="number"
          min="0"
          required
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="RWF"
          className="w-full p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none"
        />
        {errorMsg && <p className="text-xs text-red-300">{errorMsg}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="text-xs uppercase text-ivory/60">Cancel</button>
          <button type="submit" disabled={saving} className="px-5 py-2 bg-gold text-charcoal text-xs font-bold uppercase disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Cost'}
          </button>
        </div>
      </form>
    </div>
  );
}
