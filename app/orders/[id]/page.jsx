'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import { safeJsonParse } from '@/lib/utils/json';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { Package, CheckCircle2, ArrowLeft, Printer, ShieldCheck, MapPin, Truck } from 'lucide-react';

export default function OrderDetailPage({ params }) {
  const resolvedParams = params && typeof params.then === 'function' ? React.use(params) : params;
  const id = resolvedParams?.id || '';

  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const savedOrders = safeJsonParse(localStorage.getItem('abba_orders_history'), []);
      const found = Array.isArray(savedOrders) ? savedOrders.find((o) => o.id === id) : null;
      if (found) {
        setOrder(found);
      } else {
        setOrder({
          id: id || 'ord_demo',
          created_at: new Date().toISOString(),
          status: 'Confirmed',
          total_amount: 130000,
          payment_provider: 'Card',
          shipping_address: {
            first_name: 'Grace',
            last_name: 'Heirs',
            phone: '+250789284564',
            country: 'Rwanda',
            city: 'Kigali',
            address_line: 'KG 7 Ave, Suite 400',
            postal_code: '10001',
          },
          items: [
            {
              name: 'Adoption Hoodie',
              slug: 'adoption-hoodie',
              price: 85000,
              quantity: 1,
              size: 'L',
              color: 'Charcoal',
              image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600',
            },
            {
              name: 'ABBA Signature Tee',
              slug: 'abba-signature-tee',
              price: 45000,
              quantity: 1,
              size: 'M',
              color: 'Ivory',
              image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
            },
          ],
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  if (!order) return null;

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation back */}
        <div className="flex justify-between items-center border-b border-charcoal/10 pb-4 no-print">
          <Link
            href="/orders"
            className="text-xs uppercase tracking-widest font-semibold text-charcoal hover:text-gold flex items-center gap-1.5"
          >
            <ArrowLeft size={16} /> Back to Orders
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
            <h2 className="font-serif-luxury text-3xl font-bold tracking-widest uppercase text-black">
              A B B A   C O L L E C T I V E
            </h2>
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
                Order #{order.id}
              </h1>
              <p className="text-xs text-charcoal/60">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-forest/10 text-forest px-4 py-2 rounded-sm border border-forest/30 self-start sm:self-auto">
              <CheckCircle2 size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">{order.status}</span>
            </div>
          </div>

          {/* Delivery Tracker Steps */}
          <div className="bg-ivory p-6 border border-charcoal/10 rounded-sm space-y-4 no-print">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-charcoal">
              Order Status & Shipment Tracking
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] uppercase tracking-wider font-semibold">
              <div className="p-2 bg-gold/20 text-gold-dark rounded-sm border border-gold/30">1. Order Placed</div>
              <div className="p-2 bg-gold/20 text-gold-dark rounded-sm border border-gold/30">2. Processing</div>
              <div className="p-2 bg-ivory text-charcoal/40 rounded-sm border border-charcoal/10">3. In Transit</div>
              <div className="p-2 bg-ivory text-charcoal/40 rounded-sm border border-charcoal/10">4. Delivered</div>
            </div>
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
                      <Image src={item.image} alt={item.name} fill sizes="50px" className="object-cover" />
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
              <span className="text-gold font-semibold uppercase tracking-wider block">Shipping Address</span>
              <p className="text-charcoal/80 font-light leading-relaxed">
                {order.shipping_address?.first_name} {order.shipping_address?.last_name}<br />
                {order.shipping_address?.phone && <>Phone: {order.shipping_address.phone}<br /></>}
                {order.shipping_address?.address_line}<br />
                {order.shipping_address?.city}{order.shipping_address?.postal_code ? `, ${order.shipping_address.postal_code}` : ''}<br />
                {order.shipping_address?.country}
              </p>
            </div>

            <div className="space-y-2 text-xs text-right">
              <span className="text-gold font-semibold uppercase tracking-wider block">Payment Summary</span>
              <p className="text-charcoal/80">Method: <strong>{order.payment_provider || 'Credit Card / Mobile Money'}</strong></p>
              <p className="text-lg font-bold text-forest">Total Paid: {formatCurrency(order.total_amount)}</p>
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
