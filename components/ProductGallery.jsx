'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images = [], name = 'Garment' }) {
  const defaultImages = images.length > 0 ? images : [
    { id: '1', image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000', alt_text: name }
  ];

  const [selectedImage, setSelectedImage] = useState(defaultImages[0]);

  return (
    <div className="space-y-4">
      {/* Main Viewport Image */}
      <div className="relative aspect-[3/4] w-full bg-ivory-light border border-charcoal/10 rounded-sm overflow-hidden shadow-subtle">
        <Image
          src={selectedImage.image_url}
          alt={selectedImage.alt_text || name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-500"
        />
      </div>

      {/* Thumbnail Selection Strip */}
      {defaultImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {defaultImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedImage(img)}
              className={`relative aspect-square rounded-sm overflow-hidden border transition-all ${
                selectedImage.image_url === img.image_url
                  ? 'border-gold ring-2 ring-gold/30 opacity-100'
                  : 'border-charcoal/20 opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text || `${name} thumbnail ${idx + 1}`}
                fill
                sizes="100px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
