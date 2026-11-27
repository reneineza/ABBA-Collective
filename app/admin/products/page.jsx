'use client';

import React, { useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import ProductForm from '@/components/admin/ProductForm';
import { useCatalog } from '@/lib/context/CatalogContext';
import { useAuth } from '@/lib/context/AuthContext';
import { hasPermission } from '@/lib/roles';
import { saveProduct, deleteProduct, setProductActive } from '@/lib/adminCatalog';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function AdminProductsPage() {
  // allProducts includes hidden products (admins only)
  const { allProducts: products, reload } = useCatalog();
  const { profile } = useAuth();
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSaveProduct = async (productData) => {
    setSaving(true);
    setErrorMsg('');
    try {
      await saveProduct(productData, editingProduct?.id);
      await reload();
      setEditingProduct(null);
      setIsCreating(false);
    } catch (err) {
      setErrorMsg('Could not save the product: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!confirm(`Delete "${product.name}" permanently? To take it off the shop but keep it, edit it and untick "Visible in the shop" instead.`)) return;
    setErrorMsg('');
    try {
      await deleteProduct(product.id);
      await reload();
    } catch (err) {
      setErrorMsg('Could not delete the product: ' + err.message);
    }
  };

  const handleToggleActive = async (product) => {
    setErrorMsg('');
    try {
      await setProductActive(product.id, !product.active);
      await reload();
    } catch (err) {
      setErrorMsg('Could not update the product: ' + err.message);
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
        const totalStock = row.variants.reduce((sum, v) => sum + v.stock_quantity, 0);
        const soldOut = row.variants.filter((v) => v.stock_quantity <= 0).length;
        return (
          <div>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm border ${
                totalStock > 0
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                  : 'text-red-300 bg-red-500/10 border-red-500/30'
              }`}
            >
              {totalStock > 0 ? `${totalStock} in stock` : 'Sold out'}
            </span>
            <p className="text-[10px] text-ivory/50 mt-1">
              {row.variants.length} size/colour variants{soldOut > 0 && totalStock > 0 ? ` · ${soldOut} sold out` : ''}
            </p>
          </div>
        );
      },
    },
    {
      header: 'Status',
      cell: (row) => (
        <div className="space-y-1">
          <span className={`block w-fit text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-semibold border ${
            row.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-charcoal text-ivory/50 border-ivory/20'
          }`}>
            {row.active ? 'Visible' : 'Hidden'}
          </span>
          {row.featured && (
            <span className="block w-fit text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-semibold border bg-gold/20 text-gold border-gold/40">
              Featured
            </span>
          )}
        </div>
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
          <button
            onClick={() => handleToggleActive(row)}
            className="p-1.5 text-ivory/60 hover:text-gold"
            title={row.active ? 'Hide from shop' : 'Show in shop'}
          >
            {row.active ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
          {hasPermission(profile, 'catalog.delete') && (
            <button onClick={() => handleDeleteProduct(row)} className="p-1.5 text-red-400 hover:text-red-300" title="Delete Product">
              <Trash2 size={15} />
            </button>
          )}
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

      {errorMsg && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{errorMsg}</div>
      )}

      {/* Form Modal or View */}
      {(isCreating || editingProduct) ? (
        <ProductForm
          key={editingProduct?.id || 'new'}
          initialProduct={editingProduct}
          onSave={handleSaveProduct}
          saving={saving}
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
