'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from './Button';

export default function AuthForm({ mode = 'login' }) {
  const router = useRouter();
  const { signIn, signUp, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (mode !== 'forgot-password' && (!password || password.length < 6)) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'register' && !fullName) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await signIn(email, password);
        if (res.success) {
          router.push('/account');
        }
      } else if (mode === 'register') {
        const res = await signUp(email, password, fullName);
        if (res.success) {
          setSuccessMsg('Account created successfully. Welcome to ABBA Collective.');
          setTimeout(() => router.push('/account'), 1000);
        }
      } else if (mode === 'forgot-password') {
        const res = await resetPassword(email);
        setSuccessMsg(res.message || 'Password reset instructions sent to your email.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-ivory-light border border-charcoal/10 rounded-sm p-8 shadow-card space-y-6">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
          ✦ Client Access ✦
        </span>
        <h2 className="font-serif-luxury text-3xl font-bold text-charcoal">
          {mode === 'login' && 'Sign In to ABBA'}
          {mode === 'register' && 'Join The Collective'}
          {mode === 'forgot-password' && 'Reset Password'}
        </h2>
        <p className="text-xs text-charcoal/60 font-light">
          {mode === 'login' && 'Access your account, order history, and saved items.'}
          {mode === 'register' && 'Receive an identity-driven shopping experience.'}
          {mode === 'forgot-password' && 'Enter your email to receive recovery instructions.'}
        </p>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-forest/10 border border-forest/30 text-forest text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 size={16} className="flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-widest text-charcoal font-semibold block">
              Full Name
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full py-3 pl-10 pr-4 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
                disabled={loading}
              />
              <User size={16} className="absolute left-3 text-charcoal/40" />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[11px] uppercase tracking-widest text-charcoal font-semibold block">
            Email Address
          </label>
          <div className="relative flex items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="concierge@abbacollective.com"
              className="w-full py-3 pl-10 pr-4 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
              disabled={loading}
            />
            <Mail size={16} className="absolute left-3 text-charcoal/40" />
          </div>
        </div>

        {mode !== 'forgot-password' && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] uppercase tracking-widest text-charcoal font-semibold">
                Password
              </label>
              {mode === 'login' && (
                <Link href="/forgot-password" className="text-[10px] uppercase tracking-widest text-gold hover:text-charcoal font-medium">
                  Forgot?
                </Link>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-3 pl-10 pr-4 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
                disabled={loading}
              />
              <Lock size={16} className="absolute left-3 text-charcoal/40" />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-charcoal text-ivory hover:bg-forest transition-colors text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              {mode === 'login' && 'Sign In'}
              {mode === 'register' && 'Create Account'}
              {mode === 'forgot-password' && 'Send Reset Link'}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Footer Switch */}
      <div className="pt-4 border-t border-charcoal/10 text-center text-xs text-charcoal/70">
        {mode === 'login' && (
          <p>
            Don't have an account?{' '}
            <Link href="/register" className="text-gold font-semibold uppercase tracking-wider hover:underline">
              Create Account
            </Link>
          </p>
        )}

        {mode === 'register' && (
          <p>
            Already a member?{' '}
            <Link href="/login" className="text-gold font-semibold uppercase tracking-wider hover:underline">
              Sign In
            </Link>
          </p>
        )}

        {mode === 'forgot-password' && (
          <p>
            Remember your password?{' '}
            <Link href="/login" className="text-gold font-semibold uppercase tracking-wider hover:underline">
              Return to Login
            </Link>
          </p>
        )}
      </div>

    </div>
  );
}
