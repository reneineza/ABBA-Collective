'use client';

import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { useCatalog } from '@/lib/context/CatalogContext';
import { slugify } from '@/lib/adminCatalog';
import { formatPrice } from '@/lib/utils/formatCurrency';
import { Plus, Trash2, Check, X } from 'lucide-react';

export default function ProductForm({ initialProduct, onSave, onCancel, saving = false }) {
  const { categories, collections } = useCatalog();
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [price, setPrice] = useState(initialProduct?.price || '');
  const [tagline, setTagline] = useState(initialProduct?.tagline || '');
  const [active, setActive] = useState(initialProduct?.active ?? true);
  const [formError, setFormError] = useState('');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [story, setStory] = useState(initialProduct?.story || '');
  const [details, setDetails] = useState(initialProduct?.details || '');
  const [reflection, setReflection] = useState(initialProduct?.reflection || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || '');
  const [collectionId, setCollectionId] = useState(initialProduct?.collection_id || '');
  const [featured, setFeatured] = useState(initialProduct?.featured || false);
  const [images, setImages] = useState(initialProduct?.images || []);

  // Variant State
  // Copies, so editing in the form doesn't change the shared catalogue before saving
  const [variants, setVariants] = useState(() => (initialProduct?.variants || []).map((v) => ({ ...v })));

  const handleAddVariant = () => {
    const newVariant = {
      id: 'v_' + Date.now(),
      color: 'Charcoal',
      size: 'L',
      sku: `ABBA-${name ? name.substring(0, 4).toUpperCase() : 'PROD'}-${Date.now().toString().slice(-4)}`,
      stock_quantity: 0,
    };
    setVariants([...variants, newVariant]);
  };

  const handleUpdateVariant = (index, field, value) => {
    setVariants(variants.map((v, idx) => (idx === index ? { ...v, [field]: value } : v)));
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (variants.length === 0) {
      setFormError('Add at least one stock variant (colour, size, SKU and quantity).');
      return;
    }
    if (variants.some((v) => !v.color.trim() || !v.sku.trim())) {
      setFormError('Every variant needs a colour and a SKU.');
      return;
    }
    const combos = variants.map((v) => `${v.color.trim().toLowerCase()}|${v.size}`);
    if (new Set(combos).size !== combos.length) {
      setFormError('Two variants have the same colour and size. Each combination should appear once.');
      return;
    }

    const productData = {
      name,
      slug: slugify(slug || name),
      tagline,
      price: Number(price),
      description,
      story,
      details,
      reflection,
      category_id: categoryId,
      collection_id: collectionId,
      featured,
      active,
      images,
      variants,
    };
    if (onSave) onSave(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-charcoal border border-gold/30 p-6 sm:p-8 rounded-sm space-y-6 text-ivory">
      <div className="flex justify-between items-center border-b border-gold/20 pb-4">
        <h3 className="font-serif-luxury text-2xl font-bold text-ivory">
          {initialProduct ? 'Edit Product' : 'Create New Garment'}
        </h3>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-2 text-ivory/60 hover:text-gold">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Garment Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!initialProduct) setSlug(slugify(e.target.value));
            }}
            placeholder="ABBA Heir Hoodie"
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">URL Slug</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="abba-heir-hoodie"
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">
            Price (RWF) — Preview: <span className="text-ivory font-bold">{formatPrice(price || 0)}</span>
          </label>
          <input
            type="number"
            step="1"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="120000"
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 focus:border-gold focus:outline-none"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 focus:border-gold focus:outline-none"
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Collection</label>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 focus:border-gold focus:outline-none"
            >
              <option value="">None</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Tagline</label>
        <input
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Identity received, not achieved."
          className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 focus:border-gold focus:outline-none"
        />
      </div>

      {/* Visibility */}
      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="active"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="w-4 h-4 accent-gold"
        />
        <label htmlFor="active" className="text-xs uppercase tracking-widest font-semibold text-ivory">
          Visible in the shop (untick to hide without deleting)
        </label>
      </div>

      {/* Checkbox Featured */}
      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-4 h-4 accent-gold"
        />
        <label htmlFor="featured" className="text-xs uppercase tracking-widest font-semibold text-ivory">
          Promote as Featured Garment on Homepage
        </label>
      </div>

      {/* Description & Story */}
      <div className="space-y-4 pt-4 border-t border-gold/20">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Garment Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 focus:border-gold focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">The Story Behind The Garment</label>
          <textarea
            rows={3}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 focus:border-gold focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Materials, Craftsmanship & Fit</label>
          <textarea
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 focus:border-gold focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">Scripture Reflection</label>
          <textarea
            rows={2}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 focus:border-gold focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Image Uploader */}
      <div className="pt-4 border-t border-gold/20">
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {/* Fashion Inventory Variants Management */}
      <div className="space-y-4 pt-4 border-t border-gold/20">
        <div className="flex justify-between items-center">
          <label className="text-[11px] uppercase tracking-widest text-gold font-semibold">
            Fashion Inventory Variants ({variants.length})
          </label>
          <button
            type="button"
            onClick={handleAddVariant}
            className="px-3 py-1.5 bg-gold/20 text-gold border border-gold/40 text-xs font-semibold uppercase tracking-widest flex items-center gap-1 hover:bg-gold hover:text-charcoal transition-colors"
          >
            <Plus size={14} /> Add Variant
          </button>
        </div>

        <div className="space-y-2">
          {variants.map((varItem, idx) => (
            <div key={varItem.id || idx} className="grid grid-cols-12 gap-2 items-center bg-charcoal-dark p-3 border border-gold/20 text-xs">
              <div className="col-span-3">
                <input
                  type="text"
                  value={varItem.color}
                  onChange={(e) => handleUpdateVariant(idx, 'color', e.target.value)}
                  placeholder="Color (e.g. Charcoal)"
                  className="w-full p-2 bg-charcoal border border-gold/20 text-xs text-ivory"
                />
              </div>
              <div className="col-span-2">
                <select
                  value={varItem.size}
                  onChange={(e) => handleUpdateVariant(idx, 'size', e.target.value)}
                  className="w-full p-2 bg-charcoal border border-gold/20 text-xs text-ivory"
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  value={varItem.sku}
                  onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value)}
                  placeholder="SKU"
                  className="w-full p-2 bg-charcoal border border-gold/20 text-xs text-ivory font-mono"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="0"
                  value={varItem.stock_quantity}
                  onChange={(e) => handleUpdateVariant(idx, 'stock_quantity', Number(e.target.value))}
                  placeholder="Stock"
                  className="w-full p-2 bg-charcoal border border-gold/20 text-xs text-ivory"
                />
              </div>
              <div className="col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {formError && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-sm">{formError}</div>
      )}

      {/* Action Buttons */}
      <div className="pt-6 border-t border-gold/20 flex justify-end gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-transparent text-ivory hover:text-gold transition-colors text-xs uppercase tracking-widest font-semibold"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-gold text-charcoal hover:bg-gold-light transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2 disabled:opacity-50"
        >
          <Check size={16} /> {saving ? 'Saving…' : 'Save Product & Inventory'}
        </button>
      </div>
    </form>
  );
}
