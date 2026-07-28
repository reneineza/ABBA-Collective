'use client';

import React, { useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { SAMPLE_CATEGORIES } from '@/lib/data/sampleData';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(SAMPLE_CATEGORIES);
  const [name, setName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name) return;
    const newCat = {
      id: 'cat_' + Date.now(),
      name,
      slug: name.toLowerCase().replace(/ /g, '-'),
    };
    setCategories([...categories, newCat]);
    setName('');
  };

  const columns = [
    { header: 'Category Name', cell: (row) => <span className="font-bold text-ivory">{row.name}</span> },
    { header: 'URL Slug', cell: (row) => <span className="text-gold font-mono">{row.slug}</span> },
    {
      header: 'Actions',
      cell: (row) => (
        <button onClick={() => { if (confirm('Delete this category?')) setCategories(categories.filter(c => c.id !== row.id)); }} className="text-red-400 hover:text-red-300">
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
        <button type="submit" className="px-5 py-2.5 bg-gold text-charcoal text-xs font-bold uppercase tracking-widest flex items-center gap-1">
          <Plus size={15} /> Add
        </button>
      </form>

      <DataTable columns={columns} data={categories} searchPlaceholder="Search categories..." />
    </div>
  );
}
