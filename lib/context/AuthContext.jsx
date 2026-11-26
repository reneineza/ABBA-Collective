'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getBrowserClient } from '@/lib/supabase';

const AuthContext = createContext(null);

// Supabase error messages mapped to wording for customers.
function friendlyAuthError(error) {
  const message = error?.message || '';
  if (/invalid login credentials/i.test(message)) return 'Incorrect email or password.';
  if (/email not confirmed/i.test(message)) return 'Please confirm your email first. Check your inbox for the confirmation link.';
  if (/already registered|already exists/i.test(message)) return 'An account with this email already exists. Please sign in instead.';
  if (/password should be|weak password/i.test(message)) return 'Please choose a stronger password (at least 6 characters).';
  if (/rate limit|too many/i.test(message)) return 'Too many attempts. Please wait a few minutes and try again.';
  if (/failed to fetch|network/i.test(message)) return 'Could not reach the server. Please check your connection and try again.';
  return message || 'Something went wrong. Please try again.';
}

// Email links (confirmation, password reset) land on /auth/callback, which signs
// the user in and forwards them to `next`.
function callbackUrl(next) {
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const profileUserId = useRef(null);

  const fetchProfile = async (userId) => {
    const supabase = getBrowserClient();
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) {
      console.error('Could not load profile:', error.message);
      return null;
    }
    return data;
  };

  // Session: INITIAL_SESSION on load, then sign-in/out, token refresh and changes made
  // in other tabs. Loading stays true until the profile for the current user is known.
  useEffect(() => {
    const supabase = getBrowserClient();

    // Remove sessions saved by the old demo login
    try {
      localStorage.removeItem('abba_demo_user');
    } catch {}

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        profileUserId.current = null;
        setProfile(null);
        setLoading(false);
        return;
      }
      if (profileUserId.current === nextUser.id) {
        setLoading(false);
        return;
      }

      // Supabase calls must not be awaited inside this callback, so defer the fetch
      setLoading(true);
      setTimeout(async () => {
        const data = await fetchProfile(nextUser.id);
        profileUserId.current = nextUser.id;
        setProfile(data);
        setLoading(false);
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, fullName) => {
    const supabase = getBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: callbackUrl('/account'),
      },
    });

    if (error) return { success: false, error: friendlyAuthError(error) };

    // With email confirmation on, Supabase hides existing accounts by returning a user with no identities
    if (data.user && data.user.identities?.length === 0) {
      return { success: false, error: friendlyAuthError({ message: 'already registered' }) };
    }

    return { success: true, needsConfirmation: !data.session };
  };

  const signIn = async (email, password) => {
    const supabase = getBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return {
        success: false,
        error: friendlyAuthError(error),
        needsConfirmation: /email not confirmed/i.test(error.message || ''),
      };
    }

    const signedInProfile = await fetchProfile(data.user.id);
    profileUserId.current = data.user.id;
    setUser(data.user);
    setProfile(signedInProfile);
    return { success: true, role: signedInProfile?.role || 'customer' };
  };

  const signOut = async () => {
    const supabase = getBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Sign out error:', error.message);
    profileUserId.current = null;
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email) => {
    const supabase = getBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: callbackUrl('/reset-password'),
    });
    if (error) return { success: false, error: friendlyAuthError(error) };
    return { success: true };
  };

  const resendConfirmation = async (email) => {
    const supabase = getBrowserClient();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: callbackUrl('/account') },
    });
    if (error) return { success: false, error: friendlyAuthError(error) };
    return { success: true };
  };

  const updatePassword = async (newPassword) => {
    const supabase = getBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: friendlyAuthError(error) };
    return { success: true };
  };

  // Saves the editable profile fields (name and phone) to the database.
  const updateProfile = async ({ full_name, phone }) => {
    if (!user) return { success: false, error: 'Please sign in again.' };
    const supabase = getBrowserClient();
    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name, phone })
      .eq('id', user.id)
      .select()
      .single();
    if (error) return { success: false, error: friendlyAuthError(error) };
    setProfile(data);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        resendConfirmation,
        updatePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
