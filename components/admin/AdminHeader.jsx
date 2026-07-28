'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { ShieldCheck, User, Search, Bell } from 'lucide-react';

export default function AdminHeader({ title = 'Dashboard Overview' }) {
  const { profile, user } = useAuth();

  return (
    <header className="bg-charcoal border-b border-gold/20 py-4 px-6 sm:px-8 flex items-center justify-between text-ivory">
      <div>
        <span className="text-[10px] uppercase tracking-luxurious text-gold font-semibold block">
          ✦ Administrative Control ✦
        </span>
        <h1 className="font-serif-luxury text-2xl font-bold text-ivory">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-6">
        {/* Role Badge */}
        <div className="hidden sm:flex items-center space-x-2 bg-forest/20 text-forest border border-forest/40 px-3 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold">
          <ShieldCheck size={14} className="text-gold" />
          <span className="text-gold">ADMIN ROLE</span>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 border-l border-gold/20 pl-6">
          <div className="w-8 h-8 rounded-full bg-gold text-charcoal font-bold flex items-center justify-center text-xs">
            {profile?.full_name ? profile.full_name.charAt(0) : 'A'}
          </div>
          <div className="hidden md:block text-left text-xs">
            <p className="font-semibold text-ivory leading-snug">{profile?.full_name || 'Admin User'}</p>
            <p className="text-[10px] text-gold/80">{profile?.email || 'admin@abbacollective.com'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
