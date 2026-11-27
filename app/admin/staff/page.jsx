'use client';

import React, { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { getBrowserClient } from '@/lib/supabase';
import { useAuth } from '@/lib/context/AuthContext';
import { OWNER_ROLE } from '@/lib/roles';
import { slugify } from '@/lib/adminCatalog';
import { formatDate } from '@/lib/utils/formatDate';
import { UserPlus, UserMinus, KeyRound, Copy, Check, Plus, Pencil, Trash2, X, ShieldCheck } from 'lucide-react';

const inputClass = 'w-full p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none focus:border-gold';

// Permissions a set of permissions brings with it (see "implies" in public.permissions)
function withImplied(keys, permissions) {
  const result = new Set(keys);
  let changed = true;
  while (changed) {
    changed = false;
    for (const p of permissions) {
      if (!result.has(p.key)) continue;
      for (const implied of p.implies || []) {
        if (!result.has(implied)) {
          result.add(implied);
          changed = true;
        }
      }
    }
  }
  return result;
}

async function staffApi(body) {
  const res = await fetch('/api/staff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

export default function AdminStaffPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('staff');
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = async () => {
    const supabase = getBrowserClient();
    const [staffRes, rolesRes, permsRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name, email, phone, role, created_at').neq('role', 'customer').order('role'),
      supabase.from('roles').select('*').order('created_at'),
      supabase.from('permissions').select('*').order('sort_order'),
    ]);
    const error = staffRes.error || rolesRes.error || permsRes.error;
    if (error) setMessage({ type: 'error', text: 'Could not load staff: ' + error.message });
    setStaff(staffRes.data || []);
    setRoles(rolesRes.data || []);
    setPermissions(permsRes.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const staffRoles = roles.filter((r) => r.is_staff);
  const roleName = (key) => roles.find((r) => r.key === key)?.name || key;

  return (
    <div className="space-y-6">
      <div className="border-b border-gold/20 pb-4">
        <h2 className="font-serif-luxury text-2xl font-bold text-ivory">Staff, Roles & Permissions</h2>
        <p className="text-xs text-ivory/60 font-light">
          Add staff, choose their role, and decide what each role is allowed to do. Every staff member only sees the pages
          and actions their role allows.
        </p>
      </div>

      <div className="flex gap-6 border-b border-gold/20 text-xs uppercase tracking-widest font-semibold">
        {[
          ['staff', 'Staff'],
          ['roles', 'Roles & Permissions'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              setMessage({ type: '', text: '' });
            }}
            className={`pb-3 border-b-2 ${tab === key ? 'border-gold text-gold' : 'border-transparent text-ivory/50 hover:text-ivory'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {message.text && (
        <div
          className={`p-3 text-xs rounded-sm border ${
            message.type === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-olive/30 border-gold/30 text-gold'
          }`}
        >
          {message.text}
        </div>
      )}

      {tab === 'staff' ? (
        <StaffTab staff={staff} staffRoles={staffRoles} roleName={roleName} userId={user?.id} reload={load} setMessage={setMessage} />
      ) : (
        <RolesTab roles={staffRoles} permissions={permissions} staff={staff} reload={load} setMessage={setMessage} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------- Staff tab

function StaffTab({ staff, staffRoles, roleName, userId, reload, setMessage }) {
  const [form, setForm] = useState({ fullName: '', email: '', role: '' });
  const [saving, setSaving] = useState(false);
  const [link, setLink] = useState(null); // { name, url } to pass on to a staff member

  const defaultRole = staffRoles.find((r) => r.key !== OWNER_ROLE)?.key || OWNER_ROLE;
  const chosenRole = form.role || defaultRole;
  const describe = (key) => staffRoles.find((r) => r.key === key)?.description;

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    setLink(null);
    try {
      const result = await staffApi({ action: 'add', email: form.email, fullName: form.fullName, role: chosenRole });
      if (result.link) {
        setLink({ name: result.name, url: result.link });
        setMessage({ type: 'success', text: `Account created for ${result.name} as ${result.roleName}. Send them the setup link below.` });
      } else {
        setMessage({
          type: 'success',
          text: `${result.name} already had an account and is now ${result.roleName}. They sign in at /admin/login with their usual password.`,
        });
      }
      setForm({ fullName: '', email: '', role: chosenRole });
      await reload();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleChangeRole = async (member, newRole) => {
    setMessage({ type: '', text: '' });
    const { error } = await getBrowserClient().from('profiles').update({ role: newRole }).eq('id', member.id);
    if (error) setMessage({ type: 'error', text: 'Could not update the role: ' + error.message });
    await reload();
  };

  const handleRemove = async (member) => {
    if (!confirm(`Remove staff access for ${member.full_name || member.email}? Their customer account stays.`)) return;
    await handleChangeRole(member, 'customer');
  };

  const handleSetupLink = async (member) => {
    setMessage({ type: '', text: '' });
    try {
      const result = await staffApi({ action: 'link', userId: member.id });
      setLink({ name: member.full_name || member.email, url: result.link });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const columns = [
    {
      header: 'Staff Member',
      cell: (row) => (
        <div>
          <p className="font-bold text-ivory">
            {row.full_name || '(no name)'} {row.id === userId && <span className="text-[10px] text-gold">(you)</span>}
          </p>
          <p className="text-[10px] text-ivory/60">{row.email}</p>
          <p className="text-[10px] text-ivory/40">Account since {formatDate(row.created_at, 'short')}</p>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (row) =>
        row.id === userId ? (
          <span className="text-xs font-semibold text-gold uppercase">{roleName(row.role)}</span>
        ) : (
          <select
            value={row.role}
            onChange={(e) => handleChangeRole(row, e.target.value)}
            className="p-2 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none"
          >
            {staffRoles.map((r) => (
              <option key={r.key} value={r.key}>
                {r.name}
              </option>
            ))}
          </select>
        ),
    },
    {
      header: 'Actions',
      cell: (row) =>
        row.id === userId ? null : (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleSetupLink(row)}
              className="text-[10px] uppercase tracking-widest font-semibold text-gold hover:text-ivory flex items-center gap-1"
              title="A link that lets them choose a new password, e.g. if they never set one or forgot it"
            >
              <KeyRound size={12} /> Password link
            </button>
            <button
              onClick={() => handleRemove(row)}
              className="text-[10px] uppercase tracking-widest font-semibold text-red-300 hover:text-red-200 flex items-center gap-1"
            >
              <UserMinus size={12} /> Remove access
            </button>
          </div>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-charcoal border border-gold/30 p-5 rounded-sm space-y-3 max-w-3xl">
        <h3 className="text-xs uppercase tracking-widest text-gold font-semibold">Add a staff member</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Full name"
            className={inputClass}
          />
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className={inputClass}
          />
          <select value={chosenRole} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass}>
            {staffRoles.map((r) => (
              <option key={r.key} value={r.key}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] text-ivory/50">
            {describe(chosenRole)}
            {chosenRole === OWNER_ROLE && ' Owners can do everything, including managing staff.'}
          </p>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-gold text-charcoal text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 disabled:opacity-50 shrink-0"
          >
            <UserPlus size={14} /> {saving ? 'Adding…' : 'Add Staff'}
          </button>
        </div>
        <p className="text-[10px] text-ivory/40">
          If they don't have an account yet, one is created and you get a link to send them to choose their password. If
          they already have one (e.g. as a customer), they simply get the role.
        </p>
      </form>

      {link && <SetupLink link={link} onClose={() => setLink(null)} />}

      <DataTable columns={columns} data={staff} searchPlaceholder="Search staff..." />
    </div>
  );
}

function SetupLink({ link, onClose }) {
  const [copied, setCopied] = useState(false);
  const text = `Hello ${link.name}, here is your link to set your ABBA staff password: ${link.url}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the link stays visible to copy by hand
    }
  };

  return (
    <div className="bg-olive/20 border border-gold/40 p-5 rounded-sm space-y-3 max-w-3xl">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gold font-semibold">Password setup link for {link.name}</h3>
          <p className="text-[11px] text-ivory/60 mt-1">
            Send this privately: anyone with the link can set the password. It works once and expires after about an hour;
            you can make a new one anytime with "Password link".
          </p>
        </div>
        <button onClick={onClose} className="text-ivory/60 hover:text-gold" title="Close">
          <X size={16} />
        </button>
      </div>
      <input readOnly value={link.url} onFocus={(e) => e.target.select()} className={`${inputClass} font-mono text-[10px]`} />
      <div className="flex flex-wrap gap-3">
        <button onClick={copy} className="px-4 py-2 bg-gold text-charcoal text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
          {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy link'}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-gold/50 text-gold text-[10px] font-bold uppercase tracking-widest"
        >
          Send by WhatsApp
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Roles tab

function RolesTab({ roles, permissions, staff, reload, setMessage }) {
  const [editing, setEditing] = useState(null); // null = closed; otherwise { key?, name, description, permissions: Set }
  const [saving, setSaving] = useState(false);

  const areas = [...new Set(permissions.map((p) => p.area))];
  const labelOf = (key) => permissions.find((p) => p.key === key)?.label || key;
  const membersOf = (key) => staff.filter((s) => s.role === key).length;

  const toggle = (key, checked) => {
    const next = new Set(editing.permissions);
    if (checked) {
      for (const k of withImplied([key], permissions)) next.add(k);
    } else {
      // Also drop anything that needs this permission
      for (const p of permissions) if (withImplied([p.key], permissions).has(key)) next.delete(p.key);
    }
    setEditing({ ...editing, permissions: next });
  };

  const requiredBy = (key) =>
    permissions.filter((p) => p.key !== key && editing.permissions.has(p.key) && withImplied([p.key], permissions).has(key));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    const values = {
      name: editing.name.trim(),
      description: editing.description.trim() || null,
      permissions: [...editing.permissions],
    };
    const supabase = getBrowserClient();
    let error;
    if (editing.key) {
      ({ error } = await supabase.from('roles').update(values).eq('key', editing.key));
    } else {
      const base = slugify(values.name) || 'role';
      const taken = new Set(roles.map((r) => r.key).concat(OWNER_ROLE, 'customer'));
      let key = base;
      for (let n = 2; taken.has(key); n++) key = `${base}-${n}`;
      ({ error } = await supabase.from('roles').insert({ key, ...values }));
    }
    setSaving(false);
    if (error) {
      setMessage({ type: 'error', text: 'Could not save the role: ' + error.message });
      return;
    }
    setMessage({ type: 'success', text: `Role "${values.name}" saved. Staff with this role get the change the next time they open the back office.` });
    setEditing(null);
    await reload();
  };

  const handleDelete = async (role) => {
    if (membersOf(role.key) > 0) {
      setMessage({ type: 'error', text: `Move the ${membersOf(role.key)} staff member(s) with the "${role.name}" role to another role first.` });
      return;
    }
    if (!confirm(`Delete the "${role.name}" role?`)) return;
    const { error } = await getBrowserClient().from('roles').delete().eq('key', role.key);
    if (error) setMessage({ type: 'error', text: 'Could not delete the role: ' + error.message });
    else setMessage({ type: 'success', text: `Role "${role.name}" deleted.` });
    await reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <p className="text-xs text-ivory/60 max-w-2xl">
          A role is a set of things staff may do. The database checks these permissions on every action, so a staff member
          can't do anything their role doesn't allow, even outside these pages.
        </p>
        <button
          onClick={() => setEditing({ name: '', description: '', permissions: new Set() })}
          className="px-5 py-2.5 bg-gold text-charcoal text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 w-fit shrink-0"
        >
          <Plus size={16} /> New Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {roles.map((role) => {
          const isOwnerRole = role.key === OWNER_ROLE;
          return (
            <div key={role.key} className="bg-charcoal border border-gold/20 p-5 rounded-sm space-y-3">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-ivory flex items-center gap-2">
                    {isOwnerRole && <ShieldCheck size={16} className="text-gold" />}
                    {role.name}
                  </h3>
                  <p className="text-[11px] text-ivory/60">{role.description}</p>
                  <p className="text-[10px] text-gold mt-1">
                    {membersOf(role.key)} staff member{membersOf(role.key) === 1 ? '' : 's'}
                  </p>
                </div>
                {!isOwnerRole && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEditing({ key: role.key, name: role.name, description: role.description || '', permissions: new Set(role.permissions) })
                      }
                      className="p-1.5 text-ivory/60 hover:text-gold"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(role)} className="p-1.5 text-red-400 hover:text-red-300" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              {isOwnerRole ? (
                <p className="text-[11px] text-ivory/70">Everything, including staff, roles and permissions. This role can't be changed.</p>
              ) : role.permissions.length === 0 ? (
                <p className="text-[11px] text-yellow-300/80">No permissions yet: staff with this role only see the overview.</p>
              ) : (
                <ul className="text-[11px] text-ivory/70 space-y-0.5">
                  {permissions
                    .filter((p) => role.permissions.includes(p.key))
                    .map((p) => (
                      <li key={p.key}>· {labelOf(p.key)}</li>
                    ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-charcoal border border-gold/30 p-6 rounded-sm space-y-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-serif-luxury text-xl font-bold text-ivory">{editing.key ? `Edit Role: ${editing.name}` : 'New Role'}</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-ivory/60 hover:text-gold">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                Role name
                <input
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Cashier"
                  className={`${inputClass} mt-1`}
                />
              </label>
              <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                Short description
                <input
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="e.g. Records sales at the shop"
                  className={`${inputClass} mt-1`}
                />
              </label>
            </div>

            <div className="space-y-4">
              {areas.map((area) => (
                <fieldset key={area} className="border border-gold/15 p-3 rounded-sm">
                  <legend className="px-1 text-[10px] uppercase tracking-widest text-gold font-semibold">{area}</legend>
                  <div className="space-y-1.5">
                    {permissions
                      .filter((p) => p.area === area)
                      .map((p) => {
                        const needers = editing.permissions.has(p.key) ? requiredBy(p.key) : [];
                        return (
                          <label key={p.key} className="flex items-start gap-2 text-xs text-ivory/80 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editing.permissions.has(p.key)}
                              onChange={(e) => toggle(p.key, e.target.checked)}
                              className="mt-0.5 accent-[#BFA355]"
                            />
                            <span>
                              {p.label}
                              {needers.length > 0 && (
                                <span className="block text-[10px] text-ivory/40">Needed for: {needers.map((n) => n.label).join('; ')}</span>
                              )}
                            </span>
                          </label>
                        );
                      })}
                  </div>
                </fieldset>
              ))}
            </div>
            <p className="text-[10px] text-ivory/40">Managing staff, roles and permissions always stays with the owner.</p>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="text-xs uppercase text-ivory/60">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-5 py-2 bg-gold text-charcoal text-xs font-bold uppercase disabled:opacity-50">
                {saving ? 'Saving…' : 'Save Role'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
