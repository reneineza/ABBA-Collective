'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, CheckCircle2, Send, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatDate';
import { useAuth } from '@/lib/context/AuthContext';
import { listProductReviews, submitReview } from '@/lib/reviews';

export default function ProductReviews({ productId, productName, productSlug }) {
  const { user } = useAuth();
  const [allReviews, setAllReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const load = () =>
    listProductReviews(productId)
      .then(setAllReviews)
      .catch((err) => console.error('Could not load reviews:', err.message));

  useEffect(() => {
    if (productId) load();
  }, [productId, user?.id]);

  // Only approved reviews are public; the author also sees their own pending review
  const reviews = allReviews.filter((r) => r.approved);
  const myReview = user ? allReviews.find((r) => r.user_id === user.id) : null;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      await submitReview({ productId, userId: user.id, rating, title, comment, reviewerName: authorName });
      setTitle('');
      setComment('');
      setAuthorName('');
      setSubmittedSuccess(true);
      await load();
    } catch (err) {
      setErrorMsg(err.message || 'Could not submit your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory-light border border-charcoal/10 rounded-sm p-8 sm:p-12 space-y-10">
      
      {/* Header & Rating Breakdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-charcoal/10 pb-8 gap-6">
        <div className="space-y-1">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Client Testimonials ✦
          </span>
          <h3 className="font-serif-luxury text-3xl font-bold text-charcoal">
            Customer Reviews & Reflections
          </h3>
          <p className="text-xs text-charcoal/60 font-light">
            Feedback from the ABBA community. Reviews appear after approval.
          </p>
        </div>

        {/* Rating Score Card */}
        <div className="flex items-center space-x-4 bg-ivory p-4 border border-charcoal/10 rounded-sm self-start md:self-auto">
          <div className="text-center">
            <span className="text-4xl font-serif-luxury font-bold text-charcoal">{avgRating || '–'}</span>
            <span className="text-[10px] text-charcoal/50 block font-sans uppercase">out of 5.0</span>
          </div>
          <div className="space-y-1 border-l border-charcoal/10 pl-4">
            <div className="flex text-gold">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} className={avgRating && Math.round(avgRating) >= star ? 'fill-gold' : 'text-charcoal/20'} />
              ))}
            </div>
            <span className="text-xs font-semibold text-charcoal/70 block">
              {reviews.length === 0 ? 'No reviews yet' : `Based on ${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`}
            </span>
          </div>
        </div>
      </div>

      {/* Review Submission */}
      {!user ? (
        <div className="bg-ivory p-6 border border-charcoal/10 rounded-sm text-xs text-charcoal/70">
          <Link href={`/login?next=/product/${productSlug}`} className="text-gold font-semibold uppercase tracking-wider hover:underline">
            Sign in
          </Link>{' '}
          to write a review for {productName}.
        </div>
      ) : myReview ? (
        <div className="bg-ivory p-6 border border-charcoal/10 rounded-sm text-xs text-charcoal/70 flex items-center gap-2">
          {myReview.approved ? (
            <><CheckCircle2 size={16} className="text-olive" /> Thank you, your review is published below.</>
          ) : (
            <><Clock size={16} className="text-gold" /> Thank you! Your review is awaiting approval and will appear here once approved.</>
          )}
        </div>
      ) : (
      <form onSubmit={handleSubmitReview} className="bg-ivory p-6 sm:p-8 border border-charcoal/10 rounded-sm space-y-4">
        <h4 className="font-serif-luxury text-xl font-bold text-charcoal">
          Write a Review for {productName}
        </h4>

        {/* Star Rating Picker */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-semibold block text-charcoal/70">
            Overall Rating
          </label>
          <div className="flex gap-1 text-gold">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={20}
                  className={(hoverRating || rating) >= star ? 'fill-gold text-gold' : 'text-charcoal/20'}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1 text-charcoal/70">
              Display Name (optional)
            </label>
            <input
              type="text"
              maxLength={40}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Defaults to your first name"
              className="w-full p-3 text-xs bg-ivory-light border border-charcoal/20 focus:border-olive focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1 text-charcoal/70">
              Review Title
            </label>
            <input
              type="text"
              maxLength={80}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exceptional French Terry density"
              className="w-full p-3 text-xs bg-ivory-light border border-charcoal/20 focus:border-olive focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1 text-charcoal/70">
            Review Details & Fit Experience
          </label>
          <textarea
            required
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details on garment weight, sizing fit, craftsmanship, and daily wear experience..."
            className="w-full p-3 text-xs bg-ivory-light border border-charcoal/20 focus:border-olive focus:outline-none"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          {errorMsg ? (
            <span className="text-xs text-red-600">{errorMsg}</span>
          ) : submittedSuccess ? (
            <span className="text-xs text-olive font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Thank you! Your review has been submitted.
            </span>
          ) : <span />}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-charcoal text-ivory hover:bg-olive transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2 disabled:opacity-50"
          >
            <Send size={14} /> {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </div>
      </form>
      )}

      {/* Review List */}
      <div className="space-y-6 divide-y divide-charcoal/10">
        {reviews.map((rev) => (
          <div key={rev.id} className="pt-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-charcoal">{rev.reviewer_name}</span>
                {rev.verified_purchase && (
                  <span className="text-[10px] uppercase tracking-widest text-olive font-semibold flex items-center gap-1 bg-olive/10 px-2 py-0.5 rounded-sm">
                    <CheckCircle2 size={12} /> Verified Purchaser
                  </span>
                )}
              </div>
              <span className="text-[10px] text-charcoal/50">
                {formatDate(rev.created_at, 'short')}
              </span>
            </div>

            <div className="flex text-gold">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} size={14} className="fill-gold" />
              ))}
            </div>

            {rev.title && <h5 className="font-serif-luxury font-bold text-lg text-charcoal">{rev.title}</h5>}
            <p className="text-xs sm:text-sm text-charcoal/80 font-light leading-relaxed">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
