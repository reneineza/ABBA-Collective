'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Star, CheckCircle2, Trash2 } from 'lucide-react';
import { listAllReviews, setReviewApproved, deleteReview } from '@/lib/reviews';
import { formatDate } from '@/lib/utils/formatDate';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const load = () =>
    listAllReviews()
      .then((rows) =>
        setReviews(rows.map((r) => ({ ...r, product_name: r.product?.name || 'Deleted product', product_slug: r.product?.slug })))
      )
      .catch((err) => setErrorMsg('Could not load reviews: ' + err.message));

  useEffect(() => {
    load();
  }, []);

  const run = async (action, failure) => {
    setErrorMsg('');
    try {
      await action();
      await load();
    } catch (err) {
      setErrorMsg(`${failure}: ${err.message}`);
    }
  };

  const handleApprove = (id) => run(() => setReviewApproved(id, true), 'Could not approve the review');
  const handleUnapprove = (id) => run(() => setReviewApproved(id, false), 'Could not hide the review');
  const handleDelete = (id) => {
    if (!confirm('Delete this review permanently?')) return;
    run(() => deleteReview(id), 'Could not delete the review');
  };

  const columns = [
    {
      header: 'Garment & Author',
      accessor: (row) => (
        <div>
          <p className="font-bold text-ivory">{row.product_name}</p>
          <p className="text-[10px] text-gold">
            {row.reviewer_name}
            {row.verified_purchase && <span className="ml-1.5 text-emerald-400">· Verified purchase</span>}
          </p>
          <p className="text-[10px] text-ivory/40">{formatDate(row.created_at, 'short')}</p>
        </div>
      ),
    },
    {
      header: 'Rating & Title',
      accessor: (row) => (
        <div>
          <div className="flex text-gold text-xs">
            {[...Array(row.rating)].map((_, i) => (
              <Star key={i} size={12} className="fill-gold" />
            ))}
          </div>
          <p className="font-semibold text-ivory text-xs">{row.title}</p>
        </div>
      ),
    },
    {
      header: 'Review Comment',
      accessor: (row) => <span className="text-ivory/70 text-xs line-clamp-2">{row.comment}</span>,
    },
    {
      header: 'Moderation Status',
      accessor: (row) => (
        <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-sm border ${
          row.approved ? 'bg-olive/20 text-olive border-olive/30' : 'bg-yellow-950/40 text-yellow-300 border-yellow-800/40'
        }`}>
          {row.approved ? 'Approved' : 'Pending Approval'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          {!row.approved ? (
            <button
              onClick={() => handleApprove(row.id)}
              className="px-2.5 py-1 bg-gold text-charcoal font-bold text-[10px] uppercase rounded-sm hover:bg-ivory transition-colors flex items-center gap-1"
            >
              <CheckCircle2 size={12} /> Approve
            </button>
          ) : (
            <button
              onClick={() => handleUnapprove(row.id)}
              className="px-2.5 py-1 border border-ivory/30 text-ivory/70 font-bold text-[10px] uppercase rounded-sm hover:text-ivory transition-colors"
            >
              Hide
            </button>
          )}
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
            title="Delete Review"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gold/20 pb-4">
        <span className="text-[10px] uppercase tracking-luxurious text-gold font-semibold block">
          ✦ Brand Community ✦
        </span>
        <h1 className="font-serif-luxury text-3xl font-bold text-ivory">
          Product Review Moderation
        </h1>
      </div>

      <p className="text-xs text-ivory/60">
        New reviews stay hidden until approved. Approving a verified purchaser's review gives them 100 loyalty points (once).
      </p>

      {errorMsg && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{errorMsg}</div>
      )}

      <DataTable columns={columns} data={reviews} searchPlaceholder="Search reviews..." />
    </div>
  );
}
