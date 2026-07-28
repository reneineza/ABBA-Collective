'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Star, CheckCircle2, Trash2, ShieldCheck } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      id: 'rev_101',
      product_name: 'Adoption Hoodie',
      author_name: 'Grace Heirs',
      rating: 5,
      title: 'Uncompromising Textile Weight',
      comment: 'Dense 480 GSM French terry. Wearing this hoodie provides a quiet confidence throughout the day.',
      approved: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'rev_102',
      product_name: 'ABBA Signature Tee',
      author_name: 'David Covenant',
      rating: 5,
      title: 'Excellence in Tailoring',
      comment: 'Discreet Galatians 4:6 inner neck tape embroidered beautifully.',
      approved: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const handleApprove = (id) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved: true } : r)));
  };

  const handleDelete = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const columns = [
    {
      header: 'Garment & Author',
      accessor: (row) => (
        <div>
          <p className="font-bold text-ivory">{row.product_name}</p>
          <p className="text-[10px] text-gold">{row.author_name}</p>
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
          row.approved ? 'bg-forest/20 text-forest border-forest/30' : 'bg-yellow-950/40 text-yellow-300 border-yellow-800/40'
        }`}>
          {row.approved ? 'Approved' : 'Pending Approval'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          {!row.approved && (
            <button
              onClick={() => handleApprove(row.id)}
              className="px-2.5 py-1 bg-gold text-charcoal font-bold text-[10px] uppercase rounded-sm hover:bg-ivory transition-colors flex items-center gap-1"
            >
              <CheckCircle2 size={12} /> Approve
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

      <DataTable columns={columns} data={reviews} />
    </div>
  );
}
