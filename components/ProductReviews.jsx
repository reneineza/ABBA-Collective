'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { safeJsonParse } from '@/lib/utils/json';

export default function ProductReviews({ productId, productName }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    try {
      const savedReviews = safeJsonParse(localStorage.getItem(`abba_reviews_${productId}`), []);
      if (Array.isArray(savedReviews) && savedReviews.length > 0) {
        setReviews(savedReviews);
      } else {
        // Initial sample reviews for luxury fashion experience
        setReviews([
          {
            id: 'rev_1',
            author_name: 'Grace H.',
            rating: 5,
            title: 'Uncompromising Textile Weight & Sonship Anchor',
            comment: 'The 480 GSM French Terry is dense, structured, and luxurious. Wearing this piece provides a quiet confidence throughout the day.',
            created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
            verified: true,
          },
          {
            id: 'rev_2',
            author_name: 'David C.',
            rating: 5,
            title: 'Excellence in Tailoring & Details',
            comment: 'The antique gold aglets and discreet Galatians scripture inner tape reflect pure craftsmanship.',
            created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
            verified: true,
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  }, [productId]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!title || !comment || !authorName) return;

    const newReview = {
      id: 'rev_' + Date.now(),
      author_name: authorName,
      rating,
      title,
      comment,
      created_at: new Date().toISOString(),
      verified: true,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`abba_reviews_${productId}`, JSON.stringify(updated));

    setTitle('');
    setComment('');
    setAuthorName('');
    setSubmittedSuccess(true);

    setTimeout(() => setSubmittedSuccess(false), 5000);
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
            Verified feedback from the ABBA Collective community.
          </p>
        </div>

        {/* Rating Score Card */}
        <div className="flex items-center space-x-4 bg-ivory p-4 border border-charcoal/10 rounded-sm self-start md:self-auto">
          <div className="text-center">
            <span className="text-4xl font-serif-luxury font-bold text-charcoal">{avgRating}</span>
            <span className="text-[10px] text-charcoal/50 block font-sans uppercase">out of 5.0</span>
          </div>
          <div className="space-y-1 border-l border-charcoal/10 pl-4">
            <div className="flex text-gold">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} className="fill-gold" />
              ))}
            </div>
            <span className="text-xs font-semibold text-charcoal/70 block">
              Based on {reviews.length} Verified Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
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
              Your Name / Alias
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Grace H."
              className="w-full p-3 text-xs bg-ivory-light border border-charcoal/20 focus:border-forest focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1 text-charcoal/70">
              Review Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exceptional French Terry density"
              className="w-full p-3 text-xs bg-ivory-light border border-charcoal/20 focus:border-forest focus:outline-none"
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
            className="w-full p-3 text-xs bg-ivory-light border border-charcoal/20 focus:border-forest focus:outline-none"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          {submittedSuccess ? (
            <span className="text-xs text-forest font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Thank you! Your review has been submitted.
            </span>
          ) : <span />}

          <button
            type="submit"
            className="px-6 py-3 bg-charcoal text-ivory hover:bg-forest transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2"
          >
            <Send size={14} /> Submit Review
          </button>
        </div>
      </form>

      {/* Review List */}
      <div className="space-y-6 divide-y divide-charcoal/10">
        {reviews.map((rev) => (
          <div key={rev.id} className="pt-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-charcoal">{rev.author_name}</span>
                {rev.verified && (
                  <span className="text-[10px] uppercase tracking-widest text-forest font-semibold flex items-center gap-1 bg-forest/10 px-2 py-0.5 rounded-sm">
                    <CheckCircle2 size={12} /> Verified Purchaser
                  </span>
                )}
              </div>
              <span className="text-[10px] text-charcoal/50">
                {new Date(rev.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="flex text-gold">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} size={14} className="fill-gold" />
              ))}
            </div>

            <h5 className="font-serif-luxury font-bold text-lg text-charcoal">{rev.title}</h5>
            <p className="text-xs sm:text-sm text-charcoal/80 font-light leading-relaxed">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
