'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/lib/context/AuthContext';
import { useCatalog } from '@/lib/context/CatalogContext';
import { getStoreSale, deleteStoreSale } from '@/lib/storeSales';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { orderNumber } from '@/lib/utils/orders';
import { BUSINESS_CONTACT } from '@/lib/utils/rwanda';
import { ArrowLeft, Printer, Plus, Trash2 } from 'lucide-react';

export default function StoreSaleReceiptPage({ params }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { profile } = useAuth();
  const { reload } = useCatalog();
  const [sale, setSale] = useState(undefined);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getStoreSale(id).then(setSale).catch((err) => {
      setErrorMsg(err.message);
      setSale(null);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this sale? Its items go back into stock. Use this only for sales recorded by mistake.')) return;
    try {
      await deleteStoreSale(id);
      await reload();
      router.push('/admin/sales');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  if (sale === undefined) return <p className="text-xs text-ivory/50">Loading…</p>;
  if (!sale) return <p className="text-xs text-red-300">{errorMsg || 'Sale not found.'}</p>;

  const soldAt = new Date(sale.sold_at).toLocaleString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Kigali',
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-wrap justify-between items-center gap-3 no-print">
        <Link href="/admin/sales" className="text-xs uppercase tracking-widest text-ivory/60 hover:text-gold flex items-center gap-1.5">
          <ArrowLeft size={14} /> In-Store Sales
        </Link>
        <div className="flex gap-2">
          <Link
            href="/admin/sales/new"
            className="px-4 py-2 border border-gold/40 text-gold text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
          >
            <Plus size={14} /> New Sale
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gold text-charcoal text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
          >
            <Printer size={14} /> Print Receipt
          </button>
        </div>
      </div>

      {/* Receipt (also what gets printed) */}
      <div className="printable-receipt bg-ivory text-charcoal p-8 rounded-sm space-y-5">
        <div className="text-center space-y-1 border-b border-charcoal/15 pb-4">
          <BrandLogo className="h-10 w-auto mx-auto text-charcoal" />
          <p className="text-[10px] uppercase tracking-widest text-charcoal/60">
            {BUSINESS_CONTACT.city}, {BUSINESS_CONTACT.country} · {BUSINESS_CONTACT.phone}
          </p>
        </div>

        <div className="flex justify-between text-xs">
          <div>
            <p className="font-bold">Receipt #{orderNumber(sale.id)}</p>
            <p className="text-charcoal/60">{soldAt}</p>
          </div>
          <div className="text-right">
            {sale.customer_name && <p>{sale.customer_name}</p>}
            {sale.customer_phone && <p className="text-charcoal/60">{sale.customer_phone}</p>}
          </div>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-charcoal/15 text-left text-[10px] uppercase tracking-widest text-charcoal/60">
              <th className="py-2">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.id} className="border-b border-charcoal/10">
                <td className="py-2">
                  {item.product_name}
                  <span className="block text-[10px] text-charcoal/60">{item.color} · {item.size}</span>
                </td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">{formatCurrency(item.unit_price)}</td>
                <td className="py-2 text-right">{formatCurrency(item.unit_price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-xs space-y-1 text-right">
          <p>Subtotal: {formatCurrency(sale.subtotal)}</p>
          {Number(sale.discount) > 0 && <p>Discount: −{formatCurrency(sale.discount)}</p>}
          <p className="text-base font-bold">Total: {formatCurrency(sale.total)}</p>
          <p className="text-charcoal/60">Paid with {sale.payment_method}</p>
        </div>

        {sale.notes && <p className="text-[11px] text-charcoal/60 italic">Note: {sale.notes}</p>}

        <p className="text-center text-[10px] text-charcoal/50 border-t border-charcoal/15 pt-3">
          Served by {sale.created_by?.full_name || sale.created_by?.email || 'ABBA staff'} · Thank you!
        </p>
      </div>

      {errorMsg && <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm no-print">{errorMsg}</div>}

      {profile?.role === 'admin' && (
        <button
          onClick={handleDelete}
          className="no-print text-[10px] uppercase tracking-widest font-semibold text-red-300 hover:text-red-200 flex items-center gap-1"
        >
          <Trash2 size={12} /> Delete sale (recorded by mistake)
        </button>
      )}
    </div>
  );
}
