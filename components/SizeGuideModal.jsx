'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Ruler, Sparkles, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SIZE_DATA = {
  tops: {
    title: 'T-Shirts & Tops',
    subtitle: 'Preshrunk Supima Organic Cotton — Relaxed Drop-Shoulder Fit',
    columns: ['Size', 'Chest Width', 'Body Length', 'Shoulder Width', 'Sleeve Length'],
    rows: [
      { size: 'S', chestIn: '21.5"', chestCm: '54.6 cm', lengthIn: '27.5"', lengthCm: '69.8 cm', shoulderIn: '20.0"', shoulderCm: '50.8 cm', sleeveIn: '8.5"', sleeveCm: '21.6 cm' },
      { size: 'M', chestIn: '22.5"', chestCm: '57.2 cm', lengthIn: '28.5"', lengthCm: '72.4 cm', shoulderIn: '21.0"', shoulderCm: '53.3 cm', sleeveIn: '9.0"', sleeveCm: '22.9 cm' },
      { size: 'L', chestIn: '23.5"', chestCm: '59.7 cm', lengthIn: '29.5"', lengthCm: '74.9 cm', shoulderIn: '22.0"', shoulderCm: '55.9 cm', sleeveIn: '9.5"', sleeveCm: '24.1 cm' },
      { size: 'XL', chestIn: '25.0"', chestCm: '63.5 cm', lengthIn: '30.5"', lengthCm: '77.5 cm', shoulderIn: '23.0"', shoulderCm: '58.4 cm', sleeveIn: '10.0"', sleeveCm: '25.4 cm' },
      { size: 'XXL', chestIn: '26.5"', chestCm: '67.3 cm', lengthIn: '31.5"', lengthCm: '80.0 cm', shoulderIn: '24.0"', shoulderCm: '61.0 cm', sleeveIn: '10.5"', sleeveCm: '26.7 cm' },
    ],
  },
  hoodies: {
    title: 'Hoodies & Fleece',
    subtitle: '450 GSM Heavyweight French Terry — Oversized Structural Fit',
    columns: ['Size', 'Chest Width', 'Body Length', 'Shoulder Width', 'Sleeve Length'],
    rows: [
      { size: 'S', chestIn: '22.5"', chestCm: '57.2 cm', lengthIn: '26.5"', lengthCm: '67.3 cm', shoulderIn: '21.5"', shoulderCm: '54.6 cm', sleeveIn: '24.5"', sleeveCm: '62.2 cm' },
      { size: 'M', chestIn: '23.5"', chestCm: '59.7 cm', lengthIn: '27.5"', lengthCm: '69.8 cm', shoulderIn: '22.5"', shoulderCm: '57.2 cm', sleeveIn: '25.0"', sleeveCm: '63.5 cm' },
      { size: 'L', chestIn: '24.5"', chestCm: '62.2 cm', lengthIn: '28.5"', lengthCm: '72.4 cm', shoulderIn: '23.5"', shoulderCm: '59.7 cm', sleeveIn: '25.5"', sleeveCm: '64.8 cm' },
      { size: 'XL', chestIn: '26.0"', chestCm: '66.0 cm', lengthIn: '29.5"', lengthCm: '74.9 cm', shoulderIn: '24.5"', shoulderCm: '62.2 cm', sleeveIn: '26.0"', sleeveCm: '66.0 cm' },
      { size: 'XXL', chestIn: '27.5"', chestCm: '69.8 cm', lengthIn: '30.5"', lengthCm: '77.5 cm', shoulderIn: '25.5"', shoulderCm: '64.8 cm', sleeveIn: '26.5"', sleeveCm: '67.3 cm' },
    ],
  },
  outerwear: {
    title: 'Outerwear & Coats',
    subtitle: 'Tailored Milled Wool & Double-Faced Cotton — Structured Silhouette',
    columns: ['Size', 'Chest Width', 'Coat Length', 'Shoulder Width', 'Sleeve Length'],
    rows: [
      { size: 'S', chestIn: '22.0"', chestCm: '55.9 cm', lengthIn: '38.0"', lengthCm: '96.5 cm', shoulderIn: '18.5"', shoulderCm: '47.0 cm', sleeveIn: '25.0"', sleeveCm: '63.5 cm' },
      { size: 'M', chestIn: '23.0"', chestCm: '58.4 cm', lengthIn: '39.0"', lengthCm: '99.0 cm', shoulderIn: '19.5"', shoulderCm: '49.5 cm', sleeveIn: '25.5"', sleeveCm: '64.8 cm' },
      { size: 'L', chestIn: '24.0"', chestCm: '61.0 cm', lengthIn: '40.0"', lengthCm: '101.6 cm', shoulderIn: '20.5"', shoulderCm: '52.1 cm', sleeveIn: '26.0"', sleeveCm: '66.0 cm' },
      { size: 'XL', chestIn: '25.5"', chestCm: '64.8 cm', lengthIn: '41.0"', lengthCm: '104.1 cm', shoulderIn: '21.5"', shoulderCm: '54.6 cm', sleeveIn: '26.5"', sleeveCm: '67.3 cm' },
      { size: 'XXL', chestIn: '27.0"', chestCm: '68.6 cm', lengthIn: '42.0"', lengthCm: '106.7 cm', shoulderIn: '22.5"', shoulderCm: '57.2 cm', sleeveIn: '27.0"', sleeveCm: '68.6 cm' },
    ],
  },
  trousers: {
    title: 'Trousers & Pants',
    subtitle: 'Pleated Wool & Milled Cotton — Tapered & Straight Legs',
    columns: ['Size', 'Waist Width', 'Hip Width', 'Outseam Length', 'Inseam Length'],
    rows: [
      { size: 'S (30)', chestIn: '30.0"', chestCm: '76.2 cm', lengthIn: '40.0"', lengthCm: '101.6 cm', shoulderIn: '42.0"', shoulderCm: '106.7 cm', sleeveIn: '30.0"', sleeveCm: '76.2 cm' },
      { size: 'M (32)', chestIn: '32.0"', chestCm: '81.3 cm', lengthIn: '42.0"', lengthCm: '106.7 cm', shoulderIn: '42.5"', shoulderCm: '108.0 cm', sleeveIn: '30.5"', sleeveCm: '77.5 cm' },
      { size: 'L (34)', chestIn: '34.0"', chestCm: '86.4 cm', lengthIn: '44.0"', lengthCm: '111.8 cm', shoulderIn: '43.0"', shoulderCm: '109.2 cm', sleeveIn: '31.0"', sleeveCm: '78.7 cm' },
      { size: 'XL (36)', chestIn: '36.0"', chestCm: '91.4 cm', lengthIn: '46.0"', lengthCm: '116.8 cm', shoulderIn: '43.5"', shoulderCm: '110.5 cm', sleeveIn: '31.5"', sleeveCm: '80.0 cm' },
      { size: 'XXL (38)', chestIn: '38.0"', chestCm: '96.5 cm', lengthIn: '48.0"', lengthCm: '121.9 cm', shoulderIn: '44.0"', shoulderCm: '111.8 cm', sleeveIn: '32.0"', sleeveCm: '81.3 cm' },
    ],
  },
};

export default function SizeGuideModal({ isOpen, onClose, initialCategory = 'tops' }) {
  const [unit, setUnit] = useState('in');
  const [activeTab, setActiveTab] = useState(initialCategory in SIZE_DATA ? initialCategory : 'tops');

  if (!isOpen) return null;

  const currentCategory = SIZE_DATA[activeTab] || SIZE_DATA.tops;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-ivory border border-gold/30 rounded-sm shadow-2xl w-full max-w-3xl z-10 overflow-hidden text-charcoal my-8"
        >
          <div className="bg-charcoal text-ivory p-6 sm:p-8 flex items-start justify-between border-b border-gold/30">
            <div>
              <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-luxurious font-semibold mb-1">
                <Ruler size={14} />
                <span>ABBA Garment Specifications</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wide">
                Size & Fit Guide
              </h2>
              <p className="text-xs text-ivory/70 font-light mt-1">
                All measurements are taken flat with garments lying naturally.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-ivory/60 hover:text-gold hover:bg-ivory/10 rounded-full transition-colors"
              aria-label="Close size guide"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal/10 pb-4">
              <div className="flex flex-wrap gap-2">
                {Object.keys(SIZE_DATA).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-sm transition-all border ${
                      activeTab === key
                        ? 'bg-charcoal text-ivory border-charcoal font-semibold shadow-sm'
                        : 'bg-ivory-light text-charcoal/70 border-charcoal/15 hover:border-gold hover:text-charcoal'
                    }`}
                  >
                    {key === 'tops' ? 'Tees & Tops' : key === 'hoodies' ? 'Hoodies' : key === 'outerwear' ? 'Outerwear' : 'Trousers'}
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-ivory-dark/60 p-1 rounded-sm border border-charcoal/15">
                <button
                  onClick={() => setUnit('in')}
                  className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-all ${
                    unit === 'in' ? 'bg-gold text-charcoal shadow-sm' : 'text-charcoal/60 hover:text-charcoal'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-all ${
                    unit === 'cm' ? 'bg-gold text-charcoal shadow-sm' : 'text-charcoal/60 hover:text-charcoal'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>

            <div className="bg-ivory-light border border-gold/20 p-4 rounded-sm">
              <h3 className="font-serif-luxury text-lg font-bold text-charcoal">
                {currentCategory.title}
              </h3>
              <p className="text-xs text-charcoal/75 font-light mt-0.5">
                {currentCategory.subtitle}
              </p>
            </div>

            <div className="overflow-x-auto border border-charcoal/15 rounded-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-charcoal text-ivory uppercase tracking-widest text-[10px] font-semibold">
                  <tr>
                    {currentCategory.columns.map((col, idx) => (
                      <th key={idx} className="py-3 px-4 border-b border-gold/20">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/10 font-light">
                  {currentCategory.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gold/10 transition-colors">
                      <td className="py-3 px-4 font-bold text-charcoal bg-ivory-light/60">
                        {row.size}
                      </td>
                      <td className="py-3 px-4 text-charcoal/90">
                        {unit === 'in' ? row.chestIn : row.chestCm}
                      </td>
                      <td className="py-3 px-4 text-charcoal/90">
                        {unit === 'in' ? row.lengthIn : row.lengthCm}
                      </td>
                      <td className="py-3 px-4 text-charcoal/90">
                        {unit === 'in' ? row.shoulderIn : row.shoulderCm}
                      </td>
                      <td className="py-3 px-4 text-charcoal/90">
                        {unit === 'in' ? row.sleeveIn : row.sleeveCm}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light text-charcoal/80 bg-ivory-light p-4 border border-charcoal/10 rounded-sm">
              <div className="space-y-1">
                <span className="font-semibold text-charcoal block uppercase tracking-wider text-[11px]">
                  ✦ Standard vs Oversized
                </span>
                <p className="text-[11px] leading-relaxed">
                  For your standard intended fit, choose your true size. For a tailored fit, select one size down.
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-charcoal block uppercase tracking-wider text-[11px]">
                  ✦ Shrinkage & Care
                </span>
                <p className="text-[11px] leading-relaxed">
                  All Supima organic textiles are pre-shrunk. Wash cold inside out and lay flat to dry to preserve silhouette integrity.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-ivory-light p-4 sm:px-8 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-charcoal/60 italic font-light">
              Need personalized sizing advice?
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="text-xs text-charcoal/70 hover:text-charcoal uppercase tracking-widest font-semibold px-3 py-2"
              >
                Close
              </button>
              <Link
                href="/size-guide"
                onClick={onClose}
                className="px-4 py-2.5 bg-charcoal text-ivory hover:bg-forest transition-colors text-xs uppercase tracking-widest font-bold rounded-sm flex items-center gap-2 shadow-sm"
              >
                View Full Size Guide Page
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
