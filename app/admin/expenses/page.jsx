'use client';

import React, { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { useAuth } from '@/lib/context/AuthContext';
import { listExpenses, addExpense, updateExpense, deleteExpense, EXPENSE_CATEGORIES, kigaliDate } from '@/lib/finance';
import { PAYMENT_METHODS } from '@/lib/stock';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const monthStart = () => kigaliDate().slice(0, 8) + '01';

const emptyForm = () => ({
  spent_on: kigaliDate(),
  category: 'Rent',
  description: '',
  amount: '',
  payment_method: 'Cash',
  payee: '',
});

export default function ExpensesPage() {
  const { user, profile } = useAuth();
  const isOwner = profile?.role === 'admin';
  const [from, setFrom] = useState(monthStart());
  const [to, setTo] = useState(kigaliDate());
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(null); // null = closed; otherwise the form values (+ id when editing)
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const load = () => listExpenses(from, to).then(setExpenses).catch((err) => setErrorMsg(err.message));
  useEffect(() => {
    load();
  }, [from, to]);

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    const values = {
      spent_on: form.spent_on,
      category: form.category,
      description: form.description.trim(),
      amount: Number(form.amount),
      payment_method: form.payment_method || null,
      payee: form.payee.trim() || null,
    };
    try {
      if (form.id) await updateExpense(form.id, values);
      else await addExpense(user.id, values);
      setForm(null);
      await load();
    } catch (err) {
      setErrorMsg('Could not save the expense: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (expense) => {
    if (!confirm(`Delete "${expense.description}" (${formatCurrency(expense.amount)})?`)) return;
    try {
      await deleteExpense(expense.id);
      await load();
    } catch (err) {
      setErrorMsg('Could not delete the expense: ' + err.message);
    }
  };

  const columns = [
    { header: 'Date', cell: (row) => <span className="text-xs text-ivory/80 whitespace-nowrap">{formatDate(row.spent_on, 'short')}</span> },
    {
      header: 'Expense',
      cell: (row) => (
        <div>
          <p className="font-semibold text-ivory">{row.description}</p>
          <p className="text-[10px] text-gold">{row.category}{row.payee && ` · ${row.payee}`}</p>
        </div>
      ),
    },
    {
      header: 'Amount',
      cell: (row) => (
        <div>
          <p className="font-bold text-ivory">{formatCurrency(row.amount)}</p>
          <p className="text-[10px] text-ivory/50">{row.payment_method || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Recorded by',
      cell: (row) => (
        <div className="text-[11px] text-ivory/60">
          <p>{row.created_by?.full_name || row.created_by?.email || '—'}</p>
          {row.updated_at && <p className="text-[10px] text-yellow-300/80">edited by {row.updated_by?.full_name || 'owner'}</p>}
        </div>
      ),
    },
    ...(isOwner
      ? [
          {
            header: 'Actions',
            cell: (row) => (
              <div className="flex gap-2">
                <button
                  onClick={() => setForm({ ...row, amount: String(row.amount), payee: row.payee || '', payment_method: row.payment_method || '' })}
                  className="p-1.5 text-ivory/60 hover:text-gold"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(row)} className="p-1.5 text-red-400 hover:text-red-300" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  const inputClass = 'w-full p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none focus:border-gold';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gold/20 pb-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-ivory">Expenses</h2>
          <p className="text-xs text-ivory/60 font-light">
            Operating costs. Stock bought from suppliers is recorded under Deliveries, not here.
            {!isOwner && ' Only the owner can change or delete a saved expense.'}
          </p>
        </div>
        <button
          onClick={() => setForm(emptyForm())}
          className="px-5 py-2.5 bg-gold text-charcoal text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 w-fit"
        >
          <Plus size={16} /> Record Expense
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3 text-xs">
        <label className="text-ivory/60">
          From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={`${inputClass} [color-scheme:dark] mt-1`} />
        </label>
        <label className="text-ivory/60">
          To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={`${inputClass} [color-scheme:dark] mt-1`} />
        </label>
        <p className="ml-auto text-ivory/70">
          {expenses.length} expenses · <strong className="text-gold text-sm">{formatCurrency(total)}</strong>
        </p>
      </div>

      {errorMsg && <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{errorMsg}</div>}

      <DataTable columns={columns} data={expenses} searchPlaceholder="Search expenses..." />

      {form && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-charcoal border border-gold/30 p-6 rounded-sm space-y-4 w-full max-w-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-serif-luxury text-xl font-bold text-ivory">{form.id ? 'Edit Expense' : 'Record Expense'}</h3>
              <button type="button" onClick={() => setForm(null)} className="text-ivory/60 hover:text-gold">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                Date
                <input type="date" required value={form.spent_on} onChange={(e) => setForm({ ...form, spent_on: e.target.value })} className={`${inputClass} [color-scheme:dark] mt-1`} />
              </label>
              <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                Category
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`${inputClass} mt-1`}>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="col-span-2 text-[10px] uppercase tracking-widest text-gold font-semibold">
                Description
                <input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. November shop rent" className={`${inputClass} mt-1`} />
              </label>
              <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                Amount (RWF)
                <input type="number" min="1" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={`${inputClass} mt-1`} />
              </label>
              <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                Paid With
                <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className={`${inputClass} mt-1`}>
                  <option value="">Not recorded</option>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>
              <label className="col-span-2 text-[10px] uppercase tracking-widest text-gold font-semibold">
                Paid To (optional)
                <input value={form.payee} onChange={(e) => setForm({ ...form, payee: e.target.value })} placeholder="e.g. landlord, rider, supplier" className={`${inputClass} mt-1`} />
              </label>
            </div>
            {errorMsg && <p className="text-xs text-red-300">{errorMsg}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setForm(null)} className="text-xs uppercase text-ivory/60">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 bg-gold text-charcoal text-xs font-bold uppercase disabled:opacity-50">
                {saving ? 'Saving…' : 'Save Expense'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
