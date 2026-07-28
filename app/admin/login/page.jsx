'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signIn } = useAuth();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn(email, password);
      
      if (result?.role === 'admin') {
        // Use hard redirect to force full page reload with new auth state
        window.location.href = '/admin';
      } else {
        setError('Access denied. Admin credentials required. Use admin@abbacollective.com to demo admin access.');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-dark relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-forest via-gold to-charcoal-muted"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-forest/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md p-8 sm:p-12 bg-charcoal border border-charcoal-light shadow-2xl rounded-sm">
        <div className="text-center space-y-4 mb-10">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="font-serif-luxury text-3xl font-bold text-ivory tracking-wider uppercase">
              ABBA
            </h1>
          </Link>
          <div className="h-px w-12 bg-gold/50 mx-auto"></div>
          <p className="text-xs uppercase tracking-luxurious text-gold font-medium">
            Atelier Control Console
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 text-xs rounded-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={16} className="text-charcoal-muted" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email Address"
                className="w-full py-4 pl-12 pr-4 text-sm bg-charcoal-light border border-charcoal-muted/30 focus:border-gold text-ivory placeholder:text-charcoal-muted focus:outline-none transition-colors rounded-sm"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={16} className="text-charcoal-muted" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secure Password"
                className="w-full py-4 pl-12 pr-4 text-sm bg-charcoal-light border border-charcoal-muted/30 focus:border-gold text-ivory placeholder:text-charcoal-muted focus:outline-none transition-colors rounded-sm"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gold hover:bg-gold-light text-charcoal-dark text-xs uppercase tracking-widest font-bold transition-colors flex items-center justify-center space-x-2 rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>Authenticate</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-charcoal-muted hover:text-ivory transition-colors">
            &larr; Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
