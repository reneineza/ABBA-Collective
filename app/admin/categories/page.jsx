'use client';

import React, { useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { useCatalog } from '@/lib/context/CatalogContext';
import { saveCategory, deleteCategory, slugify } from '@/lib/adminCatalog';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { categories, allProducts, reload } = useCatalog();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const productCount = (categoryId) => allProducts.filter((p) => p.category_id === categoryId).length;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setErrorMsg('');
    try {
      await saveCategory({ name: name.trim(), slug: slugify(name) });
      await reload();
      setName('');
    } catch (err) {
      setErrorMsg('Could not add the category: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const count = productCount(category.id);
    const warning = count
      ? `Delete "${category.name}"? Its ${count} product(s) will stay in the shop without a category.`
      : `Delete "${category.name}"?`;
    if (!confirm(warning)) return;
    setErrorMsg('');
    try {
      await deleteCategory(category.id);
      await reload();
    } catch (err) {
      setErrorMsg('Could not delete the category: ' + err.message);
    }
  };

  const columns = [
    { header: 'Category Name', cell: (row) => <span className="font-bold text-ivory">{row.name}</span> },
    { header: 'URL Slug', cell: (row) => <span className="text-gold font-mono">{row.slug}</span> },
    { header: 'Products', cell: (row) => <span className="text-ivory/80">{productCount(row.id)}</span> },
    {
      header: 'Actions',
      cell: (row) => (
        <button onClick={() => handleDelete(row)} className="text-red-400 hover:text-red-300" title="Delete category">
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gold/20 pb-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-ivory">
            Categories & Taxonomies
          </h2>
          <p className="text-xs text-ivory/60 font-light">
            Manage garment types and shop structure.
          </p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="bg-charcoal border border-gold/30 p-4 rounded-sm flex gap-3 max-w-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Category Name (e.g. Accessories)"
          className="flex-1 p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none"
        />
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-gold text-charcoal text-xs font-bold uppercase tracking-widest flex items-center gap-1 disabled:opacity-50"
        >
          <Plus size={15} /> Add
        </button>
      </form>

      {errorMsg && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{errorMsg}</div>
      )}

      <DataTable columns={columns} data={categories} searchPlaceholder="Search categories..." />
    </div>
  );
}
