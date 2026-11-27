'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCatalog } from '@/lib/context/CatalogContext';
import { useAuth } from '@/lib/context/AuthContext';
import { hasPermission } from '@/lib/roles';
import { recordDelivery, PAYMENT_METHODS } from '@/lib/stock';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const todayInKigali = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Kigali' });
const emptyLine = () => ({ key: Math.random().toString(36).slice(2), productId: '', variantId: '', quantity: 1, unitCost: '' });

export default function ReceiveDeliveryPage() {
  const { allProducts, reload } = useCatalog();
  const { profile } = useAuth();
  const withCosts = hasPermission(profile, 'costs.edit');

  const [supplier, setSupplier] = useState('');
  const [purchasedOn, setPurchasedOn] = useState(todayInKigali());
  const [reference, setReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState([emptyLine()]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [done, setDone] = useState(null);

  const updateLine = (key, field, value) =>
    setLines((current) =>
      current.map((l) => (l.key === key ? { ...l, [field]: value, ...(field === 'productId' ? { variantId: '' } : {}) } : l))
    );

  const total = lines.reduce((sum, l) => sum + (l.unitCost !== '' ? Number(l.unitCost) * Number(l.quantity || 0) : 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (lines.some((l) => !l.variantId)) {
      setErrorMsg('Choose the product and colour/size for every line.');
      return;
    }
    const variantIds = lines.map((l) => l.variantId);
    if (new Set(variantIds).size !== variantIds.length) {
      setErrorMsg('The same colour/size appears twice. Combine them into one line.');
      return;
    }
    setSaving(true);
    try {
      await recordDelivery({
        supplier,
        purchasedOn,
        reference,
        paymentMethod: withCosts ? paymentMethod : null,
        notes,
        items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity, unitCost: withCosts ? l.unitCost : null })),
      });
      await reload();
      setDone({ units: lines.reduce((sum, l) => sum + Number(l.quantity), 0), lines: lines.length });
      setLines([emptyLine()]);
      setSupplier('');
      setReference('');
      setNotes('');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none focus:border-gold';

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/admin/stock" className="text-xs uppercase tracking-widest text-ivory/60 hover:text-gold flex items-center gap-1.5 w-fit">
        <ArrowLeft size={14} /> Back to Stock
      </Link>

      <div className="border-b border-gold/20 pb-4">
        <h2 className="font-serif-luxury text-2xl font-bold text-ivory">Receive a Delivery</h2>
        <p className="text-xs text-ivory/60 font-light">
          Record goods received from a supplier. Stock goes up as soon as you save.
          {!withCosts && ' Costs are entered by someone allowed to enter costs.'}
        </p>
      </div>

      {done && (
        <div className="p-3 bg-olive/30 border border-gold/30 text-gold text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 size={16} /> Delivery saved: {done.units} units across {done.lines} item(s) added to stock.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-charcoal border border-gold/30 p-6 rounded-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Supplier</label>
            <input required value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="e.g. Kigali Textile Mills" className={inputClass} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Date Received</label>
            <input type="date" required value={purchasedOn} onChange={(e) => setPurchasedOn(e.target.value)} className={`${inputClass} [color-scheme:dark]`} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Invoice / Reference (optional)</label>
            <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="INV-0042" className={inputClass} />
          </div>
          {withCosts && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Paid With</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={inputClass}>
                <option value="">Not paid yet / unknown</option>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          )}
          <div className={withCosts ? '' : 'md:col-span-2'}>
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Notes (optional)</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">Items Received</span>
            <button
              type="button"
              onClick={() => setLines((current) => [...current, emptyLine()])}
              className="px-3 py-1.5 bg-gold/20 text-gold border border-gold/40 text-xs font-semibold uppercase tracking-widest flex items-center gap-1"
            >
              <Plus size={14} /> Add Line
            </button>
          </div>

          {lines.map((line) => {
            const product = allProducts.find((p) => p.id === line.productId);
            return (
              <div key={line.key} className="grid grid-cols-12 gap-2 items-center bg-charcoal-dark p-3 border border-gold/20">
                <select
                  required
                  value={line.productId}
                  onChange={(e) => updateLine(line.key, 'productId', e.target.value)}
                  className={`${inputClass} ${withCosts ? 'col-span-4' : 'col-span-6'}`}
                >
                  <option value="">Product…</option>
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <select
                  required
                  value={line.variantId}
                  onChange={(e) => updateLine(line.key, 'variantId', e.target.value)}
                  disabled={!product}
                  className={`${inputClass} col-span-3 disabled:opacity-50`}
                >
                  <option value="">Colour / size…</option>
                  {product?.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.color} · {v.size} (now {v.stock_quantity})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  required
                  value={line.quantity}
                  onChange={(e) => updateLine(line.key, 'quantity', e.target.value)}
                  title="Quantity received"
                  className={`${inputClass} col-span-2`}
                />
                {withCosts && (
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={line.unitCost}
                    onChange={(e) => updateLine(line.key, 'unitCost', e.target.value)}
                    placeholder="Cost / unit (RWF)"
                    title="Cost per unit in RWF (leave empty if unknown)"
                    className={`${inputClass} col-span-2`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => setLines((current) => (current.length > 1 ? current.filter((l) => l.key !== line.key) : current))}
                  className="col-span-1 text-red-400 hover:text-red-300 justify-self-end"
                  title="Remove line"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
          <p className="text-[11px] text-ivory/50">
            A colour or size that doesn't exist yet? Add it to the product first (Products → Edit → Add Variant).
          </p>
        </div>

        {errorMsg && <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{errorMsg}</div>}

        <div className="flex justify-between items-center pt-4 border-t border-gold/20">
          <span className="text-xs text-ivory/70">
            {withCosts && total > 0 && <>Delivery cost: <strong className="text-gold">{formatCurrency(total)}</strong></>}
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gold text-charcoal text-xs uppercase tracking-widest font-bold disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Delivery'}
          </button>
        </div>
      </form>
    </div>
  );
}
