'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProfileForm from '@/components/ProfileForm';
import AddressForm from '@/components/AddressForm';
import OrderCard from '@/components/OrderCard';
import Button from '@/components/Button';
import { useAuth } from '@/lib/context/AuthContext';
import { safeJsonParse } from '@/lib/utils/json';
import { User, Package, Heart, LogOut, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AccountPage() {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const savedOrders = safeJsonParse(localStorage.getItem('abba_orders_history'), []);
      setOrders(Array.isArray(savedOrders) ? savedOrders : []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Banner */}
        <div className="bg-charcoal text-ivory p-8 rounded-sm border border-gold/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
              ✦ Royal Identity ✦
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-ivory">
              Welcome, {profile?.full_name || 'Valued Member'}
            </h1>
            <p className="text-xs text-ivory/70 font-light">
              {profile?.email || user?.email || 'concierge@abbacollective.com'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/wishlist"
              className="px-4 py-2.5 bg-ivory/10 hover:bg-gold hover:text-charcoal transition-colors text-xs uppercase tracking-widest text-gold font-semibold rounded-sm border border-gold/30 flex items-center gap-2"
            >
              <Heart size={15} /> Saved Wishlist
            </Link>
            <button
              onClick={signOut}
              className="px-4 py-2.5 bg-red-950/40 hover:bg-red-900 transition-colors text-xs uppercase tracking-widest text-red-200 font-semibold rounded-sm border border-red-800/40 flex items-center gap-2"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-charcoal/10 gap-8 uppercase tracking-widest text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition-all ${
              activeTab === 'profile'
                ? 'text-forest font-bold border-b-2 border-gold'
                : 'text-charcoal/60 hover:text-gold'
            }`}
          >
            ✦ Profile Details
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition-all ${
              activeTab === 'orders'
                ? 'text-forest font-bold border-b-2 border-gold'
                : 'text-charcoal/60 hover:text-gold'
            }`}
          >
            ✦ Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 transition-all ${
              activeTab === 'addresses'
                ? 'text-forest font-bold border-b-2 border-gold'
                : 'text-charcoal/60 hover:text-gold'
            }`}
          >
            ✦ Address Book
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === 'profile' && <ProfileForm />}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-ivory-light border border-charcoal/10 p-12 text-center space-y-4">
                <Package size={32} className="mx-auto text-gold" />
                <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">No Past Orders Found</h3>
                <p className="text-xs text-charcoal/60">Discover garments crafted with eternal purpose and quiet luxury.</p>
                <Button href="/shop" variant="primary" size="md">Explore Catalog</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.map((ord) => (
                  <OrderCard key={ord.id} order={ord} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <AddressForm />
          </div>
        )}

      </div>
    </div>
  );
}
