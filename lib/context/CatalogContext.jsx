'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getBrowserClient } from '@/lib/supabase';
import { fetchProducts, fetchCollections, fetchCategories } from '@/lib/catalog';

const CatalogContext = createContext(null);

// Loads the catalogue once per visit and shares it with every page.
// Visitors receive active products only; admins also receive hidden ones.
export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState({ products: [], collections: [], categories: [], loading: true, error: null });

  const load = useCallback(async () => {
    const supabase = getBrowserClient();
    try {
      const [products, collections, categories] = await Promise.all([
        fetchProducts(supabase),
        fetchCollections(supabase),
        fetchCategories(supabase),
      ]);
      setCatalog({ products, collections, categories, loading: false, error: null });
    } catch (err) {
      console.error('Could not load catalogue:', err.message);
      setCatalog((current) => ({ ...current, loading: false, error: err.message }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visibleProducts = catalog.products.filter((p) => p.active);

  return (
    <CatalogContext.Provider value={{ ...catalog, products: visibleProducts, allProducts: catalog.products, reload: load }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}
