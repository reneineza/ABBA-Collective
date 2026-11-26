'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Star, Loader2, AlertCircle } from 'lucide-react';
import AddressForm from './AddressForm';
import { useAuth } from '@/lib/context/AuthContext';
import { listAddresses, saveAddress, deleteAddress, setDefaultAddress } from '@/lib/addresses';

export default function AddressBook() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null); // null, 'new', or an address row
  const [errorMsg, setErrorMsg] = useState('');

  const refresh = async () => {
    try {
      setAddresses(await listAddresses());
    } catch (err) {
      setErrorMsg('Could not load your addresses. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) refresh();
  }, [user?.id]);

  const run = async (action) => {
    setErrorMsg('');
    try {
      await action();
      await refresh();
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  const handleSave = async (address) => {
    setSaving(true);
    await run(async () => {
      await saveAddress(user.id, address, editing === 'new' ? null : editing.id);
      setEditing(null);
    });
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-gold" />
      </div>
    );
  }

  if (editing) {
    return (
      <AddressForm
        key={editing === 'new' ? 'new' : editing.id}
        initialAddress={editing === 'new' ? { first_name: '', last_name: '' } : editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
        saving={saving}
      />
    );
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {addresses.length === 0 && (
        <div className="bg-ivory-light border border-charcoal/10 p-10 text-center space-y-2 rounded-sm">
          <MapPin size={28} className="mx-auto text-gold" />
          <p className="font-serif-luxury text-xl font-bold text-charcoal">No saved addresses yet</p>
          <p className="text-xs text-charcoal/60">Save an address to check out faster next time.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`bg-ivory-light border p-5 rounded-sm space-y-3 ${address.is_default ? 'border-gold' : 'border-charcoal/10'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-sm text-charcoal">
                {address.first_name} {address.last_name}
              </p>
              {address.is_default && (
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Default</span>
              )}
            </div>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              {address.address_line}
              <br />
              {[address.district || address.city, address.province].filter(Boolean).join(', ')}
              {address.landmark && (
                <>
                  <br />
                  <span className="text-charcoal/50">{address.landmark}</span>
                </>
              )}
              <br />
              {address.phone}
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-[11px] uppercase tracking-widest font-semibold">
              <button onClick={() => setEditing(address)} className="text-charcoal/70 hover:text-gold flex items-center gap-1">
                <Pencil size={12} /> Edit
              </button>
              {!address.is_default && (
                <button
                  onClick={() => run(() => setDefaultAddress(user.id, address.id))}
                  className="text-charcoal/70 hover:text-gold flex items-center gap-1"
                >
                  <Star size={12} /> Make Default
                </button>
              )}
              <button
                onClick={() => {
                  if (window.confirm('Delete this address?')) run(() => deleteAddress(address.id));
                }}
                className="text-red-600/80 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setEditing('new')}
        className="px-6 py-3 bg-charcoal text-ivory hover:bg-olive transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2 rounded-sm"
      >
        <Plus size={16} /> Add New Address
      </button>
    </div>
  );
}
