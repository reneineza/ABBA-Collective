'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Plus, Image as ImageIcon, Star } from 'lucide-react';

export default function ImageUploader({ images = [], onChange }) {
  const [urlInput, setUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const addImageToList = (imageUrl, alt = 'Product Garment Image') => {
    const newImage = {
      id: 'img_' + Date.now() + Math.random().toString(36).substring(2, 6),
      image_url: imageUrl,
      alt_text: alt,
    };
    const updated = [...images, newImage];
    if (onChange) onChange(updated);
    setErrorMsg('');
  };

  const handleAddUrl = (e) => {
    if (e) e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter an image URL or upload a file from your computer.');
      return;
    }

    let finalUrl = trimmed;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) {
      finalUrl = 'https://' + trimmed;
    }

    addImageToList(finalUrl);
    setUrlInput('');
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        addImageToList(event.target.result, file.name);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemove = (idToRemove) => {
    const updated = images.filter((img, idx) => (img.id ? img.id !== idToRemove : idx !== idToRemove));
    if (onChange) onChange(updated);
  };

  const handleMakeMain = (indexToMakeMain) => {
    if (indexToMakeMain === 0 || indexToMakeMain >= images.length) return;
    const item = images[indexToMakeMain];
    const remaining = images.filter((_, idx) => idx !== indexToMakeMain);
    const updated = [item, ...remaining];
    if (onChange) onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-[11px] uppercase tracking-widest text-gold font-semibold flex items-center gap-1.5">
          <ImageIcon size={14} /> Product Images ({images.length})
        </label>
        <span className="text-[10px] text-ivory/50">First image will be the primary main photo</span>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Dual Inputs: URL + Upload File Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl(e);
              }
            }}
            placeholder="Paste Image URL or Supabase Storage Link"
            className="flex-1 p-3 text-xs bg-charcoal text-ivory placeholder:text-ivory/40 border border-gold/30 focus:border-gold focus:outline-none rounded-sm"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-3 bg-gold text-charcoal hover:bg-gold-light transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 rounded-sm whitespace-nowrap shadow-sm"
          >
            <Plus size={16} /> Add Image
          </button>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-3 bg-charcoal-light text-ivory border border-gold/30 hover:border-gold hover:text-gold transition-colors text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-sm whitespace-nowrap"
        >
          <Upload size={14} /> Upload Local File
        </button>
      </div>

      {errorMsg && (
        <p className="text-[11px] text-amber-400 font-medium">{errorMsg}</p>
      )}

      {/* Thumbnail Previews */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {images.map((img, idx) => (
            <div
              key={img.id || idx}
              className={`relative aspect-square bg-charcoal border rounded-sm overflow-hidden group shadow-md transition-all ${
                idx === 0 ? 'border-gold ring-1 ring-gold/40' : 'border-gold/20 hover:border-gold/50'
              }`}
            >
              <img
                src={img.image_url}
                alt={img.alt_text || 'Garment photo'}
                className="object-cover w-full h-full"
              />

              {idx === 0 ? (
                <span className="absolute top-2 left-2 bg-gold text-charcoal text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-sm">
                  Main Photo
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleMakeMain(idx)}
                  className="absolute top-2 left-2 p-1 bg-charcoal/80 text-gold hover:bg-gold hover:text-charcoal rounded-sm text-[9px] uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                  title="Make Primary Photo"
                >
                  <Star size={10} /> Make Main
                </button>
              )}

              <button
                type="button"
                onClick={() => handleRemove(img.id || idx)}
                className="absolute top-2 right-2 p-1.5 bg-red-950/80 text-red-200 hover:bg-red-700 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove Image"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 border border-dashed border-gold/20 text-center space-y-2 rounded-sm bg-charcoal-dark/50">
          <ImageIcon size={24} className="mx-auto text-gold/40" />
          <p className="text-xs text-ivory/60">No images added yet. Paste a URL or upload a file above.</p>
        </div>
      )}
    </div>
  );
}

