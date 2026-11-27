'use client';

import React, { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { getBrowserClient } from '@/lib/supabase';
import { useAuth } from '@/lib/context/AuthContext';
import { ROLE_LABELS } from '@/lib/roles';
import { formatDate } from '@/lib/utils/formatDate';
import { UserPlus, UserMinus } from 'lucide-react';

const ASSIGNABLE = [
  { value: 'sales', label: 'Sales: products, stock, in-store sales, order fulfilment' },
  { value: 'accountant', label: 'Accountant: everything Sales does, plus expenses, costs and financial reports' },
  { value: 'admin', label: 'Owner: full access, including staff and website content' },
];

export default function AdminStaffPage() {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('sales');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // The owner can read all profiles (database policy); staff are everyone who isn't a customer
  const load = () =>
    getBrowserClient()
      .from('profiles')
      .select('id, full_name, email, phone, role, created_at')
      .neq('role', 'customer')
      .order('role')
      .then(({ data, error }) => {
        if (error) setMessage({ type: 'error', text: 'Could not load staff: ' + error.message });
        setStaff(data || []);
      });

  useEffect(() => {
    load();
  }, []);

  const setRoleFor = async (profileId, newRole) => {
    const { error } = await getBrowserClient().from('profiles').update({ role: newRole }).eq('id', profileId);
    if (error) throw error;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const { data: account, error } = await getBrowserClient()
        .from('profiles')
        .select('id, role, full_name')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();
      if (error) throw error;
      if (!account) {
        setMessage({
          type: 'error',
          text: 'No account uses this email yet. Ask them to create an account on the website (and confirm their email), then add them here.',
        });
        return;
      }
      if (account.id === user?.id) {
        setMessage({ type: 'error', text: 'You cannot change your own role.' });
        return;
      }
      await setRoleFor(account.id, role);
      setMessage({ type: 'success', text: `${account.full_name || email} is now ${ROLE_LABELS[role]}. They can sign in at /admin/login.` });
      setEmail('');
      await load();
    } catch (err) {
      setMessage({ type: 'error', text: 'Could not update the role: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleChangeRole = async (member, newRole) => {
    setMessage({ type: '', text: '' });
    try {
      await setRoleFor(member.id, newRole);
      await load();
    } catch (err) {
      setMessage({ type: 'error', text: 'Could not update the role: ' + err.message });
    }
  };

  const handleRemove = async (member) => {
    if (!confirm(`Remove staff access for ${member.full_name || member.email}? Their customer account stays.`)) return;
    await handleChangeRole(member, 'customer');
  };

  const columns = [
    {
      header: 'Staff Member',
      cell: (row) => (
        <div>
          <p className="font-bold text-ivory">
            {row.full_name || '(no name)'} {row.id === user?.id && <span className="text-[10px] text-gold">(you)</span>}
          </p>
          <p className="text-[10px] text-ivory/60">{row.email}</p>
          <p className="text-[10px] text-ivory/40">Account since {formatDate(row.created_at, 'short')}</p>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (row) =>
        row.id === user?.id ? (
          <span className="text-xs font-semibold text-gold uppercase">{ROLE_LABELS[row.role]}</span>
        ) : (
          <select
            value={row.role}
            onChange={(e) => handleChangeRole(row, e.target.value)}
            className="p-2 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none"
          >
            {ASSIGNABLE.map((r) => (
              <option key={r.value} value={r.value}>
                {ROLE_LABELS[r.value]}
              </option>
            ))}
          </select>
        ),
    },
    {
      header: 'Actions',
      cell: (row) =>
        row.id === user?.id ? null : (
          <button
            onClick={() => handleRemove(row)}
            className="text-[10px] uppercase tracking-widest font-semibold text-red-300 hover:text-red-200 flex items-center gap-1"
          >
            <UserMinus size={12} /> Remove access
          </button>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gold/20 pb-4">
        <h2 className="font-serif-luxury text-2xl font-bold text-ivory">Staff Accounts & Roles</h2>
        <p className="text-xs text-ivory/60 font-light">
          Staff first create a normal account on the website, then you give them a role here. Each role only sees its own
          pages.
        </p>
      </div>

      <form onSubmit={handleAdd} className="bg-charcoal border border-gold/30 p-5 rounded-sm space-y-3 max-w-2xl">
        <h3 className="text-xs uppercase tracking-widest text-gold font-semibold">Add a staff member</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Their account email"
            className="flex-1 p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none"
          >
            {ASSIGNABLE.map((r) => (
              <option key={r.value} value={r.value}>
                {ROLE_LABELS[r.value]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-gold text-charcoal text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <UserPlus size={14} /> Give Access
          </button>
        </div>
        <p className="text-[11px] text-ivory/50">{ASSIGNABLE.find((r) => r.value === role)?.label}</p>
      </form>

      {message.text && (
        <div
          className={`p-3 text-xs rounded-sm border ${
            message.type === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-olive/30 border-gold/30 text-gold'
          }`}
        >
          {message.text}
        </div>
      )}

      <DataTable columns={columns} data={staff} searchPlaceholder="Search staff..." />
    </div>
  );
}
