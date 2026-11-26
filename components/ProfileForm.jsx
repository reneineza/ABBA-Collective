'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { isValidRwandaPhone, formatRwandaPhone } from '@/lib/utils/rwanda';
import { User, Mail, Phone, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function ProfileForm() {
  const { user, profile, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // The profile may finish loading after this form first renders
  useEffect(() => {
    setFullName(profile?.full_name || '');
    setPhone(profile?.phone || '');
  }, [profile?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    setErrorMsg('');

    if (phone && !isValidRwandaPhone(phone)) {
      setErrorMsg('Enter a Rwandan mobile number, e.g. 078 812 3456');
      return;
    }

    setLoading(true);
    const res = await updateProfile({
      full_name: fullName,
      phone: phone ? formatRwandaPhone(phone) : null,
    });
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-ivory-light border border-charcoal/10 rounded-sm p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
        <div>
          <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">
            Personal Information
          </h3>
          <p className="text-xs text-charcoal/60 font-light">
            Update your account details and contact preferences.
          </p>
        </div>
        {saved && (
          <span className="text-xs uppercase tracking-widest text-olive font-semibold flex items-center gap-1.5 bg-olive/10 px-3 py-1 rounded-sm">
            <CheckCircle2 size={14} /> Saved
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] uppercase tracking-widest text-charcoal font-semibold block">
            Full Name
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-3 pl-10 pr-4 text-xs bg-ivory border border-charcoal/20 focus:border-olive focus:outline-none"
            />
            <User size={16} className="absolute left-3 text-charcoal/40" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] uppercase tracking-widest text-charcoal font-semibold block">
            Email Address
          </label>
          <div className="relative flex items-center">
            <input
              type="email"
              value={profile?.email || user?.email || ''}
              readOnly
              className="w-full py-3 pl-10 pr-4 text-xs bg-ivory-dark/50 border border-charcoal/10 text-charcoal/60 cursor-not-allowed focus:outline-none"
            />
            <Mail size={16} className="absolute left-3 text-charcoal/40" />
          </div>
          <p className="text-[10px] text-charcoal/50">Your sign-in email. Contact us to change it.</p>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label className="text-[11px] uppercase tracking-widest text-charcoal font-semibold block">
            Phone Number
          </label>
          <div className="relative flex items-center">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="078 812 3456"
              className="w-full py-3 pl-10 pr-4 text-xs bg-ivory border border-charcoal/20 focus:border-olive focus:outline-none"
            />
            <Phone size={16} className="absolute left-3 text-charcoal/40" />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading || !user}
          className="px-8 py-3 bg-charcoal text-ivory hover:bg-olive transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
