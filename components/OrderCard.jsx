'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils/formatCurrency';
import { Package, ArrowRight, CheckCircle2, Clock, Truck } from 'lucide-react';

export default function OrderCard({ order }) {
  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
    Processing: 'bg-purple-100 text-purple-800 border-purple-300',
    Shipped: 'bg-forest/10 text-forest border-forest/30',
    Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="bg-ivory-light border border-charcoal/10 rounded-sm p-6 space-y-4 shadow-sm hover:shadow-card transition-shadow">
      {/* Header info */}
      <div className="flex justify-between items-start border-b border-charcoal/10 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-gold block">
            Order Reference
          </span>
          <h4 className="font-serif-luxury text-lg font-bold text-charcoal">
            #{order.id}
          </h4>
          <p className="text-[10px] text-charcoal/50">
            Placed on {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <span className={`px-3 py-1 rounded-sm text-[10px] uppercase tracking-wider font-semibold border ${statusColors[order.status] || statusColors.Confirmed}`}>
          {order.status}
        </span>
      </div>

      {/* Items Preview */}
      <div className="space-y-2">
        {order.items && order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs">
            <span className="text-charcoal/80 font-light">
              {item.name} <span className="text-gold font-semibold">(x{item.quantity})</span>
            </span>
            <span className="font-semibold text-charcoal">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Footer Details & Link */}
      <div className="pt-3 border-t border-charcoal/10 flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-charcoal/50 block">Total Amount</span>
          <span className="text-base font-bold text-forest">{formatPrice(order.total_amount)}</span>
        </div>

        <Link
          href={`/orders/${order.id}`}
          className="text-xs uppercase tracking-widest font-bold text-gold hover:text-charcoal transition-colors flex items-center gap-1"
        >
          View Receipt <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
