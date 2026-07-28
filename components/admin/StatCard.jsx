'use client';

import React from 'react';

export default function StatCard({ title, value, change, icon: Icon, color = 'gold' }) {
  return (
    <div className="bg-charcoal border border-gold/20 p-6 rounded-sm space-y-3 hover:border-gold transition-colors shadow-card">
      <div className="flex justify-between items-start">
        <span className="text-[10px] uppercase tracking-luxurious text-ivory/60 font-semibold block">
          {title}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-full bg-gold/10 text-gold flex items-center justify-center border border-gold/30">
            <Icon size={18} />
          </div>
        )}
      </div>

      <h3 className="font-serif-luxury text-3xl font-bold text-ivory">
        {value}
      </h3>

      {change && (
        <p className="text-[11px] text-gold font-light flex items-center gap-1">
          <span>✦</span> {change}
        </p>
      )}
    </div>
  );
}
