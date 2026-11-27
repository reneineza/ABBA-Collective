'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import BrandLogo from '@/components/BrandLogo';
import { orderNumber } from '@/lib/utils/orders';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import { Package, CheckCircle2, ArrowLeft, Printer, Loader2 } from 'lucide-react';

const STATUS_STEPS = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
const STEP_LABELS = ['Order Placed', 'Processing', 'In Transit', 'Delivered'];

export default function OrderDetailPage({ params }) {
  const resolvedParams = params && typeof params.then === 'function' ? React.use(params) : params;
  const id = resolvedParams?.id || '';

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | missing
  const [isGuestLink, setIsGuestLink] = useState(false);

  // Signed-in customers see their own orders; guests use the private ?token= receipt link
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    setIsGuestLink(Boolean(token));
    fetch(`/api/orders/${id}${token ? `?token=${encodeURIComponent(token)}` : ''}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.order) {
          setOrder(data.order);
          setStatus('ready');
        } else {
          setStatus('missing');
        }
      })
      .catch(() => setStatus('missing'));
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="bg-ivory py-32 flex justify-center">
        <Loader2 size={28} className="animate-spin text-gold" />
      </div>
    );
  }

  if (status === 'missing') {
    return (
      <div className="bg-ivory text-charcoal py-24">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <Package size={32} className="mx-auto text-gold" />
          <h1 className="font-serif-luxury text-3xl font-bold">Order not found</h1>
          <p className="text-xs text-charcoal/70">
            This order doesn't exist, or you don't have access to it. If you placed it with an account, please sign in.
            If you checked out as a guest, use the receipt link from your confirmation page.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button href={`/login?next=/orders/${id}`} variant="primary" size="md">Sign In</Button>
            <Button href="/contact" variant="secondary" size="md">Contact Us</Button>
          </div>
        </div>
      </div>
    );
  }

  const progress = STATUS_STEPS.indexOf(order.status === 'Pending' ? 'Confirmed' : order.status);

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation back */}
        <div className="flex justify-between items-center border-b border-charcoal/10 pb-4 no-print">
          <Link
            href={isGuestLink ? '/shop' : '/orders'}
            className="text-xs uppercase tracking-widest font-semibold text-charcoal hover:text-gold flex items-center gap-1.5"
          >
            <ArrowLeft size={16} /> {isGuestLink ? 'Continue Shopping' : 'Back to Orders'}
          </Link>
          <button
            onClick={() => window.print()}
            className="text-xs uppercase tracking-widest font-semibold text-charcoal/70 hover:text-gold flex items-center gap-1.5 px-4 py-2 border border-charcoal/20 hover:border-gold rounded-sm transition-colors"
          >
            <Printer size={15} /> Print Digital Receipt
          </button>
        </div>

        {/* Order Receipt Card */}
        <div id="printable-receipt" className="printable-receipt bg-ivory-light border border-charcoal/10 rounded-sm p-8 sm:p-12 space-y-8 shadow-card">
          
          {/* Printable Brand Letterhead (Visible in print/PDF) */}
          <div className="hidden print:block text-center border-b border-black/20 pb-4 mb-4">
            <BrandLogo title="ABBA" className="h-12 w-auto mx-auto mb-2 text-black" />
            <p className="text-[10px] uppercase tracking-widest text-black/70">
              Identity Received. Grace Revealed. • Kigali, Rwanda
            </p>
          </div>

          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-charcoal/10 pb-6 gap-4">
            <div className="space-y-1">
              <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
                ✦ Confirmed Order Receipt ✦
              </span>
              <h1 className="font-serif-luxury text-3xl font-bold text-charcoal">
                Order #{orderNumber(order.id)}
              </h1>
              <p className="text-xs text-charcoal/60">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-olive/10 text-olive px-4 py-2 rounded-sm border border-olive/30 self-start sm:self-auto">
              <CheckCircle2 size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">{order.status}</span>
            </div>
          </div>

          {/* Delivery Tracker Steps */}
          <div className="bg-ivory p-6 border border-charcoal/10 rounded-sm space-y-4 no-print">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-charcoal">
              Order Status & Shipment Tracking
            </h4>
            {order.status === 'Cancelled' ? (
              <p className="text-xs text-red-700 font-semibold">This order was cancelled.</p>
            ) : (
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] uppercase tracking-wider font-semibold">
                {STEP_LABELS.map((label, idx) => (
                  <div
                    key={label}
                    className={`p-2 rounded-sm border ${
                      idx <= progress ? 'bg-gold/20 text-gold-dark border-gold/30' : 'bg-ivory text-charcoal/40 border-charcoal/10'
                    }`}
                  >
                    {idx + 1}. {label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-gold border-b border-charcoal/10 pb-2">
              Garments Purchased
            </h4>
            <div className="space-y-3">
              {order.items && order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-charcoal/10 text-xs">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-16 bg-ivory border border-charcoal/10 rounded-sm overflow-hidden flex-shrink-0 no-print">
                      {item.image && <Image src={item.image} alt={item.name} fill sizes="50px" className="object-cover" />}
                    </div>
                    <div>
                      <p className="font-serif-luxury text-base font-bold text-charcoal">{item.name}</p>
                      <p className="text-[11px] text-charcoal/60">
                        Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-charcoal text-sm">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-charcoal/10">
            <div className="space-y-2 text-xs">
              <span className="text-gold font-semibold uppercase tracking-wider block">Delivery Address</span>
              <p className="text-charcoal/80 font-light leading-relaxed">
                {order.shipping_address?.first_name} {order.shipping_address?.last_name}<br />
                {order.shipping_address?.phone && <>Phone: {order.shipping_address.phone}<br /></>}
                {order.shipping_address?.address_line}<br />
                {[order.shipping_address?.district || order.shipping_address?.city, order.shipping_address?.province]
                  .filter(Boolean)
                  .join(', ')}
                <br />
                {order.shipping_address?.landmark && <>{order.shipping_address.landmark}<br /></>}
                {order.shipping_address?.country}
              </p>
            </div>

            <div className="space-y-2 text-xs text-right">
              <span className="text-gold font-semibold uppercase tracking-wider block">Payment Summary</span>
              <p className="text-charcoal/80">Method: <strong>{order.payment_provider || 'Mobile Money / Card'}</strong></p>
              {order.subtotal != null && <p className="text-charcoal/80">Subtotal: {formatCurrency(order.subtotal)}</p>}
              <p className="text-charcoal/80">
                Delivery: {Number(order.shipping_fee) === 0 ? 'Complimentary' : formatCurrency(order.shipping_fee)}
              </p>
              <p className="text-lg font-bold text-olive">Total Paid: {formatCurrency(order.total_amount)}</p>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-charcoal/10 font-serif italic text-xs text-charcoal/60">
            "Identity Received. Grace Revealed." — Thank you for honoring us with your order.
          </div>

        </div>

      </div>
    </div>
  );
}
