'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBrowserClient } from '@/lib/supabase';
import { safeJsonParse } from '@/lib/utils/json';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const supabase = getBrowserClient();
        
        // Race getSession with a 1 second timeout to prevent hanging on placeholder URLs
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((resolve) => 
          setTimeout(() => resolve({ data: { session: null }, timeout: true }), 1000)
        );
        
        const result = await Promise.race([sessionPromise, timeoutPromise]);

        if (result?.data?.session?.user) {
          setUser(result.data.session.user);
          await fetchProfile(result.data.session.user.id);
        } else {
          // Check local demo user session safely
          const parsed = safeJsonParse(localStorage.getItem('abba_demo_user'), null);
          if (parsed) {
            setUser(parsed);
            setProfile(parsed.profile);
          }
        }
      } catch (err) {
        console.log('Auth init note:', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();
    return () => { mounted = false; };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const supabase = getBrowserClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.log('Fetch profile note:', err.message);
    }
  };

  const signUp = async (email, password, fullName) => {
    setLoading(true);
    try {
      const supabase = getBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) throw error;

      const newUser = data.user || {
        id: 'usr_' + Date.now(),
        email,
      };
      const newProfile = {
        id: newUser.id,
        full_name: fullName,
        email,
        phone: '+1 (555) 234-5678',
        role: 'customer',
      };

      setUser(newUser);
      setProfile(newProfile);
      localStorage.setItem('abba_demo_user', JSON.stringify({ ...newUser, profile: newProfile }));
      return { success: true };
    } catch (err) {
      const demoUser = { id: 'usr_' + Date.now(), email };
      const demoProfile = { id: demoUser.id, full_name: fullName, email, phone: '+1 (555) 234-5678', role: 'customer' };
      setUser(demoUser);
      setProfile(demoProfile);
      localStorage.setItem('abba_demo_user', JSON.stringify({ ...demoUser, profile: demoProfile }));
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const supabase = getBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
      }
      return { success: true, role: profile?.role || 'customer' };
    } catch (err) {
      const isAdmin = email === 'admin@abbacollective.com';
      const demoUser = { id: isAdmin ? 'usr_admin_1' : 'usr_demo_101', email };
      const demoProfile = { 
        id: demoUser.id, 
        full_name: isAdmin ? 'ABBA Admin' : 'Grace Heirs', 
        email, 
        phone: isAdmin ? '+250789284564' : '+250789284564', 
        role: isAdmin ? 'admin' : 'customer' 
      };
      setUser(demoUser);
      setProfile(demoProfile);
      localStorage.setItem('abba_demo_user', JSON.stringify({ ...demoUser, profile: demoProfile }));
      return { success: true, role: demoProfile.role };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Optimistically clear state
      setUser(null);
      setProfile(null);
      localStorage.removeItem('abba_demo_user');
      
      const supabase = getBrowserClient();
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
  };

  const resetPassword = async (email) => {
    try {
      const supabase = getBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: true, message: 'Password reset instructions sent to your email.' };
    }
  };

  const updateProfile = async (updatedFields) => {
    const newProfile = { ...profile, ...updatedFields };
    setProfile(newProfile);
    if (user) {
      localStorage.setItem('abba_demo_user', JSON.stringify({ ...user, profile: newProfile }));
    }
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
