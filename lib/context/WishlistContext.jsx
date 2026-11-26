'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getBrowserClient } from '@/lib/supabase';
import { useAuth } from '@/lib/context/AuthContext';
import { safeJsonParse } from '@/lib/utils/json';

const WishlistContext = createContext(null);
const LOCAL_KEY = 'abba_wishlist';

function readLocal() {
  try {
    const ids = safeJsonParse(localStorage.getItem(LOCAL_KEY), []);
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

function writeLocal(ids) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(ids));
  } catch {}
}

// Signed-in customers' wishlists are stored in Supabase; signed-out visitors use
// this browser. Items saved while signed out are moved into the account on sign-in.
export function WishlistProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [ids, setIds] = useState([]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIds(readLocal());
      return;
    }

    let cancelled = false;
    (async () => {
      const supabase = getBrowserClient();
      const localIds = readLocal();
      if (localIds.length > 0) {
        const { error } = await supabase
          .from('wishlist_items')
          .upsert(localIds.map((product_id) => ({ user_id: user.id, product_id })), { ignoreDuplicates: true });
        if (!error) writeLocal([]);
      }
      const { data, error } = await supabase.from('wishlist_items').select('product_id').order('created_at');
      if (error) console.error('Could not load wishlist:', error.message);
      if (!cancelled) setIds((data || []).map((row) => row.product_id));
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  const toggle = useCallback(
    async (productId) => {
      const adding = !ids.includes(productId);
      const next = adding ? [...ids, productId] : ids.filter((id) => id !== productId);
      setIds(next);

      if (!user) {
        writeLocal(next);
        return;
      }

      const supabase = getBrowserClient();
      const { error } = adding
        ? await supabase.from('wishlist_items').insert({ user_id: user.id, product_id: productId })
        : await supabase.from('wishlist_items').delete().eq('user_id', user.id).eq('product_id', productId);
      if (error) {
        console.error('Could not update wishlist:', error.message);
        setIds(ids); // roll back
      }
    },
    [ids, user]
  );

  return (
    <WishlistContext.Provider value={{ ids, has: (id) => ids.includes(id), toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
