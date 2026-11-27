'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCatalog } from '@/lib/context/CatalogContext';
import { recordStoreSale } from '@/lib/storeSales';
import { PAYMENT_METHODS } from '@/lib/stock';
import { isValidRwandaPhone, formatRwandaPhone } from '@/lib/utils/rwanda';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const emptyLine = () => ({ key: Math.random().toString(36).slice(2), productId: '', variantId: '', quantity: 1 });

export default function NewStoreSalePage() {
  const router = useRouter();
  const { allProducts, reload } = useCatalog();
  const [lines, setLines] = useState([emptyLine()]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discount, setDiscount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Only products with something in stock can be sold
  const sellable = allProducts.filter((p) => p.variants.some((v) => v.stock_quantity > 0));

  const updateLine = (key, field, value) =>
    setLines((current) =>
      current.map((l) => (l.key === key ? { ...l, [field]: value, ...(field === 'productId' ? { variantId: '' } : {}) } : l))
    );

  const priced = lines.map((l) => {
    const product = allProducts.find((p) => p.id === l.productId);
    const variant = product?.variants.find((v) => v.id === l.variantId);
    return { ...l, product, variant, amount: product ? product.price * Number(l.quantity || 0) : 0 };
  });
  const subtotal = priced.reduce((sum, l) => sum + l.amount, 0);
  const total = Math.max(subtotal - (Number(discount) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (priced.some((l) => !l.variant)) {
      setErrorMsg('Choose the product and colour/size for every line.');
      return;
    }
    const over = priced.find((l) => Number(l.quantity) > l.variant.stock_quantity);
    if (over) {
      setErrorMsg(`${over.product.name} (${over.variant.color}, ${over.variant.size}) has only ${over.variant.stock_quantity} in stock.`);
      return;
    }
    const ids = priced.map((l) => l.variantId);
    if (new Set(ids).size !== ids.length) {
      setErrorMsg('The same colour/size appears twice. Increase the quantity on one line instead.');
      return;
    }
    if ((Number(discount) || 0) > subtotal) {
      setErrorMsg('The discount cannot be more than the sale total.');
      return;
    }
    if (customerPhone && !isValidRwandaPhone(customerPhone)) {
      setErrorMsg('Enter a Rwandan phone number (e.g. 078 812 3456) or leave it empty.');
      return;
    }

    setSaving(true);
    try {
      const saleId = await recordStoreSale({
        paymentMethod,
        customerName,
        customerPhone: customerPhone ? formatRwandaPhone(customerPhone) : '',
        discount,
        notes,
        items: priced.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
      });
      await reload();
      router.push(`/admin/sales/${saleId}`);
    } catch (err) {
      setErrorMsg(err.message);
      setSaving(false);
    }
  };

  const inputClass = 'w-full p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none focus:border-gold';

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/admin/sales" className="text-xs uppercase tracking-widest text-ivory/60 hover:text-gold flex items-center gap-1.5 w-fit">
        <ArrowLeft size={14} /> Back to In-Store Sales
      </Link>

      <div className="border-b border-gold/20 pb-4">
        <h2 className="font-serif-luxury text-2xl font-bold text-ivory">New In-Store Sale</h2>
        <p className="text-xs text-ivory/60 font-light">Prices come from the catalogue. Stock is updated as soon as you save.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-charcoal border border-gold/30 p-6 rounded-sm space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">Items</span>
            <button
              type="button"
              onClick={() => setLines((current) => [...current, emptyLine()])}
              className="px-3 py-1.5 bg-gold/20 text-gold border border-gold/40 text-xs font-semibold uppercase tracking-widest flex items-center gap-1"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          {priced.map((line) => (
            <div key={line.key} className="grid grid-cols-12 gap-2 items-center bg-charcoal-dark p-3 border border-gold/20">
              <select
                required
                value={line.productId}
                onChange={(e) => updateLine(line.key, 'productId', e.target.value)}
                className={`${inputClass} col-span-4`}
              >
                <option value="">Product…</option>
                {sellable.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                required
                value={line.variantId}
                onChange={(e) => updateLine(line.key, 'variantId', e.target.value)}
                disabled={!line.product}
                className={`${inputClass} col-span-3 disabled:opacity-50`}
              >
                <option value="">Colour / size…</option>
                {line.product?.variants
                  .filter((v) => v.stock_quantity > 0)
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.color} · {v.size} ({v.stock_quantity} left)
                    </option>
                  ))}
              </select>
              <input
                type="number"
                min="1"
                max={line.variant?.stock_quantity || undefined}
                required
                value={line.quantity}
                onChange={(e) => updateLine(line.key, 'quantity', e.target.value)}
                className={`${inputClass} col-span-2`}
                title="Quantity"
              />
              <span className="col-span-2 text-right text-xs text-gold font-semibold">{line.product ? formatCurrency(line.amount) : '—'}</span>
              <button
                type="button"
                onClick={() => setLines((current) => (current.length > 1 ? current.filter((l) => l.key !== line.key) : current))}
                className="col-span-1 text-red-400 hover:text-red-300 justify-self-end"
                title="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={inputClass}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Discount (RWF, optional)</label>
            <input type="number" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Note (optional)</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. reason for discount" className={inputClass} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Customer Name (optional)</label>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Customer Phone (optional)</label>
            <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="078 812 3456" className={inputClass} />
          </div>
        </div>

        {errorMsg && <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{errorMsg}</div>}

        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-4 border-t border-gold/20">
          <div className="text-xs text-ivory/70 space-y-0.5">
            <p>Subtotal: {formatCurrency(subtotal)}</p>
            {Number(discount) > 0 && <p>Discount: −{formatCurrency(Number(discount))}</p>}
            <p className="text-base font-bold text-gold">Total: {formatCurrency(total)}</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gold text-charcoal text-xs uppercase tracking-widest font-bold disabled:opacity-50"
          >
            {saving ? 'Saving…' : `Record Sale · ${formatCurrency(total)}`}
          </button>
        </div>
      </form>
    </div>
  );
}
