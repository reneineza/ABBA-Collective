'use client';

import React from 'react';

export default function OrderStatusBadge({ status = 'Pending', onChange }) {
  const statusStyles = {
    Pending: 'bg-gold/20 text-gold border-gold/40',
    Confirmed: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    Processing: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    Shipped: 'bg-forest/30 text-emerald-300 border-emerald-400/40',
    Delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    Cancelled: 'bg-red-500/20 text-red-400 border-red-400/40',
  };

  if (!onChange) {
    return (
      <span className={`text-[10px] uppercase tracking-widest px-3 py-1 font-bold rounded-sm border ${statusStyles[status] || statusStyles.Pending}`}>
        {status}
      </span>
    );
  }

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className={`text-[10px] uppercase tracking-widest px-2.5 py-1 font-bold rounded-sm border focus:outline-none bg-charcoal cursor-pointer ${statusStyles[status] || statusStyles.Pending}`}
    >
      <option value="Pending">Pending</option>
      <option value="Confirmed">Confirmed</option>
      <option value="Processing">Processing</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  );
}
