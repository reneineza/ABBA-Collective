'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import ProductForm from '@/components/admin/ProductForm';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleData';
import { safeJsonParse } from '@/lib/utils/json';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    try {
      const saved = safeJsonParse(localStorage.getItem('abba_products'), []);
      setProducts(Array.isArray(saved) && saved.length > 0 ? saved : SAMPLE_PRODUCTS);
    } catch (e) {
      setProducts(SAMPLE_PRODUCTS);
    }
  }, []);

  const handleSaveProduct = (productData) => {
    let updated;
    if (editingProduct) {
      updated = products.map((p) => (p.id === productData.id ? productData : p));
    } else {
      updated = [productData, ...products];
    }
    setProducts(updated);
    localStorage.setItem('abba_products', JSON.stringify(updated));
    setEditingProduct(null);
    setIsCreating(false);
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      localStorage.setItem('abba_products', JSON.stringify(updated));
    }
  };

  const columns = [
    {
      header: 'Garment Name',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-12 bg-charcoal-dark border border-gold/20 rounded-sm overflow-hidden flex-shrink-0">
            <img
              src={row.images && row.images.length > 0 ? row.images[0].image_url : (row.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400')}
              alt={row.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <p className="font-bold text-ivory">{row.name}</p>
            <p className="text-[10px] text-gold font-mono">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category / Collection',
      cell: (row) => (
        <div>
          <p className="font-semibold text-ivory">{row.category}</p>
          <p className="text-[10px] text-ivory/60">{row.collection}</p>
        </div>
      ),
    },
    {
      header: 'Price',
      cell: (row) => <span className="font-bold text-gold">{formatCurrency(row.price)}</span>,
    },
    {
      header: 'Variants & Stock',
      cell: (row) => {
        const totalStock = row.variants ? row.variants.reduce((sum, v) => sum + v.stock_quantity, 0) : 48;
        const variantCount = row.variants ? row.variants.length : 4;
        return (
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/30">
              {totalStock} in stock
            </span>
            <p className="text-[10px] text-ivory/50 mt-1">{variantCount} Size/Color variants</p>
          </div>
        );
      },
    },
    {
      header: 'Featured',
      cell: (row) => (
        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-semibold border ${
          row.featured ? 'bg-gold/20 text-gold border-gold/40' : 'bg-charcoal text-ivory/40 border-ivory/20'
        }`}>
          {row.featured ? 'Featured' : 'Standard'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <Link href={`/product/${row.slug}`} target="_blank" className="p-1.5 text-ivory/60 hover:text-gold" title="View Store">
            <Eye size={15} />
          </Link>
          <button onClick={() => setEditingProduct(row)} className="p-1.5 text-ivory/60 hover:text-gold" title="Edit Product">
            <Edit size={15} />
          </button>
          <button onClick={() => handleDeleteProduct(row.id)} className="p-1.5 text-red-400 hover:text-red-300" title="Delete Product">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex justify-between items-center border-b border-gold/20 pb-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-ivory">
            Products & Inventory Management
          </h2>
          <p className="text-xs text-ivory/60 font-light">
            Manage garment details, fashion size/color variants, pricing, and stock quantities.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsCreating(true);
          }}
          className="px-5 py-2.5 bg-gold text-charcoal hover:bg-gold-light transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
        >
          <Plus size={16} /> Create Product
        </button>
      </div>

      {/* Form Modal or View */}
      {(isCreating || editingProduct) ? (
        <ProductForm
          initialProduct={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setIsCreating(false);
            setEditingProduct(null);
          }}
        />
      ) : (
        <DataTable columns={columns} data={products} searchPlaceholder="Search garments by name, SKU, or category..." />
      )}
    </div>
  );
}
