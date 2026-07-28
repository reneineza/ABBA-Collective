'use client';

import React from 'react';

export default function OrderStatusBadge({ status = 'Pending', onChange }) {
  const statusStyles = {
    Pending: 'bg-gold/20 text-gold border-gold/40',
    Confirmed: 'bg-gold/30 text-gold-light border-gold/50',
    Processing: 'bg-charcoal-muted/30 text-ivory border-charcoal-muted/50',
    Shipped: 'bg-forest/30 text-forest-light border-forest/40',
    Delivered: 'bg-forest/50 text-ivory border-forest/50',
    Cancelled: 'bg-charcoal-light/30 text-charcoal-muted border-charcoal-light/50',
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
