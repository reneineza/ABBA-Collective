'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import { useAuth } from '@/lib/context/AuthContext';
import { getBrowserClient } from '@/lib/supabase';
import { formatDate } from '@/lib/utils/formatDate';
import { Award, Gift, ArrowLeft, Star, ShoppingBag, Users, CheckCircle2 } from 'lucide-react';

export default function LoyaltyRewardsPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(true);
  const points = history.reduce((total, item) => total + item.points, 0);

  // Points are awarded by the store (admins / server); customers can only read their ledger
  useEffect(() => {
    if (!user) return;
    getBrowserClient()
      .from('loyalty_points')
      .select('id, points, transaction_type, description, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Could not load points:', error.message);
        setHistory(data || []);
        setLoadingLedger(false);
      });
  }, [user?.id]);

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation back */}
        <Link
          href="/account"
          className="text-xs uppercase tracking-widest font-semibold text-charcoal/70 hover:text-gold flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Back to Client Account
        </Link>

        {/* Header Hero Banner */}
        <div className="bg-charcoal text-ivory p-8 sm:p-12 rounded-sm border border-gold/30 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2">
            <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
              ✦ ABBA Royal Circle ✦
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-ivory">
              Loyalty Rewards & Privilege
            </h1>
            <p className="text-xs sm:text-sm text-ivory/70 font-light max-w-lg">
              Earn points with every garment order, review submission, and community referral.
            </p>
          </div>

          {/* Points Counter Badge */}
          <div className="bg-ivory/10 border border-gold/40 p-6 rounded-sm text-center min-w-[200px]">
            <Award size={32} className="mx-auto text-gold mb-1" />
            <span className="text-3xl font-serif-luxury font-bold text-gold block">{points}</span>
            <span className="text-[10px] uppercase tracking-widest text-ivory/70 font-medium">
              Available Kingdom Points
            </span>
          </div>
        </div>

        {/* Ways to Earn Points */}
        <div className="space-y-4">
          <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">
            Ways to Earn Loyalty Rewards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-ivory-light border border-charcoal/10 p-6 rounded-sm space-y-2">
              <ShoppingBag size={24} className="text-gold" />
              <h4 className="font-serif-luxury text-lg font-bold text-charcoal">Garment Purchases</h4>
              <p className="text-xs text-charcoal/70 font-light">Earn 10 points for every 10,000 RWF spent on signature garments.</p>
            </div>
            <div className="bg-ivory-light border border-charcoal/10 p-6 rounded-sm space-y-2">
              <Star size={24} className="text-gold" />
              <h4 className="font-serif-luxury text-lg font-bold text-charcoal">Product Reviews</h4>
              <p className="text-xs text-charcoal/70 font-light">Earn 100 points for submitting verified purchaser testimonials.</p>
            </div>
            <div className="bg-ivory-light border border-charcoal/10 p-6 rounded-sm space-y-2">
              <Users size={24} className="text-gold" />
              <h4 className="font-serif-luxury text-lg font-bold text-charcoal">Ambassador Referrals</h4>
              <p className="text-xs text-charcoal/70 font-light">Earn 150 points for every friend who places their first order.</p>
            </div>
          </div>
        </div>

        {/* History Ledger */}
        <div className="bg-ivory-light border border-charcoal/10 p-6 sm:p-8 rounded-sm space-y-4">
          <h3 className="font-serif-luxury text-xl font-bold text-charcoal border-b border-charcoal/10 pb-3">
            Points Ledger & Activity History
          </h3>
          <div className="divide-y divide-charcoal/10 text-xs">
            {!loadingLedger && history.length === 0 && (
              <p className="py-6 text-center text-charcoal/60">
                No points yet. Your first order will start your Royal Circle balance.
              </p>
            )}
            {history.map((item) => (
              <div key={item.id} className="py-3 flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="font-bold text-charcoal">{item.description}</p>
                  <p className="text-[10px] text-charcoal/50">
                    {formatDate(item.created_at, 'short')} • {item.transaction_type}
                  </p>
                </div>
                <span className={`font-bold text-sm ${item.points < 0 ? 'text-red-700' : 'text-olive'}`}>
                  {item.points > 0 ? '+' : ''}
                  {item.points} Points
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
