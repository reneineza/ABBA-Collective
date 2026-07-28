'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Plus, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ images = [], onChange }) {
  const [urlInput, setUrlInput] = useState('');

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput) return;
    const newImage = {
      id: 'img_' + Date.now(),
      image_url: urlInput,
      alt_text: 'Product Garment Image',
    };
    const updated = [...images, newImage];
    if (onChange) onChange(updated);
    setUrlInput('');
  };

  const handleRemove = (id) => {
    const updated = images.filter((img) => img.id !== id);
    if (onChange) onChange(updated);
  };

  return (
    <div className="space-y-4">
      <label className="text-[11px] uppercase tracking-widest text-gold font-semibold block">
        Product Images (Supabase Storage: product-images)
      </label>

      {/* Add URL Form */}
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Paste Image URL or Supabase Storage Link"
          className="flex-1 p-3 text-xs bg-charcoal text-ivory placeholder-ivory/40 border border-gold/30 focus:border-gold focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-4 py-3 bg-gold text-charcoal hover:bg-gold-light transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-1"
        >
          <Plus size={16} /> Add Image
        </button>
      </div>

      {/* Thumbnail Previews */}
      <div className="grid grid-cols-4 gap-4 pt-2">
        {images.map((img, idx) => (
          <div key={img.id || idx} className="relative aspect-square bg-charcoal border border-gold/30 rounded-sm overflow-hidden group">
            <Image
              src={img.image_url}
              alt={img.alt_text || 'Garment image'}
              fill
              sizes="100px"
              className="object-cover"
            />
            {idx === 0 && (
              <span className="absolute top-1 left-1 bg-gold text-charcoal text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                Main
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(img.id)}
              className="absolute top-1 right-1 p-1 bg-red-900/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete Image"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
