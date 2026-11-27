'use client';

import React, { useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import ImageUploader from '@/components/admin/ImageUploader';
import { useCatalog } from '@/lib/context/CatalogContext';
import { saveCollection, deleteCollection, slugify } from '@/lib/adminCatalog';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminCollectionsPage() {
  const { collections, allProducts, reload } = useCatalog();
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const productCount = (collectionId) => allProducts.filter((p) => p.collection_id === collectionId).length;

  const openCreate = () => {
    setEditingCollection(null);
    setName('');
    setSlug('');
    setDescription('');
    setImages([]);
    setErrorMsg('');
    setShowModal(true);
  };

  const openEdit = (col) => {
    setEditingCollection(col);
    setName(col.name);
    setSlug(col.slug);
    setDescription(col.description || '');
    setImages(col.image_url ? [{ id: 'cover', image_url: col.image_url, alt_text: col.name }] : []);
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      await saveCollection(
        { name, slug: slugify(slug || name), description, image_url: images[0]?.image_url || null },
        editingCollection?.id
      );
      await reload();
      setShowModal(false);
      setEditingCollection(null);
    } catch (err) {
      setErrorMsg('Could not save the collection: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (collection) => {
    const count = productCount(collection.id);
    const warning = count
      ? `Delete "${collection.name}"? Its ${count} product(s) will stay in the shop without a collection.`
      : `Delete "${collection.name}"?`;
    if (!confirm(warning)) return;
    setErrorMsg('');
    try {
      await deleteCollection(collection.id);
      await reload();
    } catch (err) {
      setErrorMsg('Could not delete the collection: ' + err.message);
    }
  };

  const columns = [
    {
      header: 'Collection Title',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-10 bg-charcoal-dark border border-gold/20 rounded-sm overflow-hidden flex-shrink-0">
            {row.image_url && <img src={row.image_url} alt={row.name} className="object-cover w-full h-full" />}
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
    { header: 'Products', cell: (row) => <span className="text-ivory/80">{productCount(row.id)}</span> },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button onClick={() => openEdit(row)} className="p-1.5 text-ivory/60 hover:text-gold" title="Edit collection">
            <Edit size={15} />
          </button>
          <button onClick={() => handleDelete(row)} className="p-1.5 text-red-400 hover:text-red-300" title="Delete collection">
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
          onClick={openCreate}
          className="px-5 py-2.5 bg-gold text-charcoal hover:bg-gold-light transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
        >
          <Plus size={16} /> Create Collection
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{errorMsg}</div>
      )}

      {showModal && (
        <form onSubmit={handleSave} className="bg-charcoal border border-gold/30 p-6 rounded-sm space-y-4 max-w-xl">
          <h3 className="font-serif-luxury text-xl font-bold text-ivory">{editingCollection ? 'Edit Collection' : 'New Collection'}</h3>
          <div>
            <label className="text-[10px] uppercase text-gold font-semibold block mb-1">Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingCollection) setSlug(slugify(e.target.value));
              }}
              placeholder="Collection 004: REDEMPTION"
              className="w-full p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-gold font-semibold block mb-1">URL Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="redemption"
              className="w-full p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory font-mono focus:outline-none"
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
          <div>
            {/* Only the first image is used as the collection cover */}
            <ImageUploader images={images.slice(0, 1)} onChange={(list) => setImages(list.slice(-1))} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="text-xs uppercase text-ivory/60">Cancel</button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-gold text-charcoal text-xs font-bold uppercase disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Collection'}
            </button>
          </div>
        </form>
      )}

      <DataTable columns={columns} data={collections} searchPlaceholder="Search collections..." />
    </div>
  );
}
