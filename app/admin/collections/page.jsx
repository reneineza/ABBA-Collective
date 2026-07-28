'use client';

import React, { useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { SAMPLE_COLLECTIONS } from '@/lib/data/sampleData';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState(SAMPLE_COLLECTIONS);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    const newCol = {
      id: 'col_' + Date.now(),
      name,
      slug: slug || name.toLowerCase().replace(/ /g, '-'),
      description,
      image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200',
    };
    setCollections([...collections, newCol]);
    setShowModal(false);
    setName('');
    setSlug('');
    setDescription('');
  };

  const columns = [
    {
      header: 'Collection Title',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-10 bg-charcoal-dark border border-gold/20 rounded-sm overflow-hidden flex-shrink-0">
            <img src={row.image_url} alt={row.name} className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="font-bold text-ivory">{row.name}</p>
            <p className="text-[10px] text-gold font-mono">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Description Narrative',
      cell: (row) => <p className="text-xs text-ivory/70 line-clamp-2 max-w-md">{row.description}</p>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button onClick={() => alert('Edit feature active')} className="p-1.5 text-ivory/60 hover:text-gold">
            <Edit size={15} />
          </button>
          <button onClick={() => setCollections(collections.filter(c => c.id !== row.id))} className="p-1.5 text-red-400 hover:text-red-300">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gold/20 pb-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-ivory">
            Collections & Chapters Management
          </h2>
          <p className="text-xs text-ivory/60 font-light">
            Organize garments into thematic spiritual chapters.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-gold text-charcoal hover:bg-gold-light transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
        >
          <Plus size={16} /> Create Collection
        </button>
      </div>

      {showModal && (
        <form onSubmit={handleCreate} className="bg-charcoal border border-gold/30 p-6 rounded-sm space-y-4 max-w-xl">
          <h3 className="font-serif-luxury text-xl font-bold text-ivory">New Collection</h3>
          <div>
            <label className="text-[10px] uppercase text-gold font-semibold block mb-1">Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Collection 004: REDEMPTION"
              className="w-full p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-gold font-semibold block mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="text-xs uppercase text-ivory/60">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-gold text-charcoal text-xs font-bold uppercase">Save Collection</button>
          </div>
        </form>
      )}

      <DataTable columns={columns} data={collections} searchPlaceholder="Search collections..." />
    </div>
  );
}
