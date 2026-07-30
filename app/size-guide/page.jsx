'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Ruler, Sparkles, Check, ArrowRight, HelpCircle, RefreshCw, Info, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const SIZE_TABLES = {
  tops: {
    name: 'T-Shirts & Shirts',
    tagline: '280 GSM Supima Organic Cotton — Relaxed Drop-Shoulder Silhouette',
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
    name: 'Hoodies & Fleece',
    tagline: '450 GSM Heavyweight French Terry — Structural Oversized Fit',
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
    name: 'Outerwear & Coats',
    tagline: 'Tailored Milled Wool & Double-Faced Textiles — Structured Luxury Profile',
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
    name: 'Trousers & Pants',
    tagline: 'Pleated Wool & Milled Twill — Tailored Tapered & Straight Legs',
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

const INTERNATIONAL_CONVERSIONS = [
  { abba: 'S', us: '36 - 38', uk: '36 - 38', eu: '46 - 48', jp: 'S / 1', it: '46', fr: '44' },
  { abba: 'M', us: '38 - 40', uk: '38 - 40', eu: '48 - 50', jp: 'M / 2', it: '48', fr: '46' },
  { abba: 'L', us: '40 - 42', uk: '40 - 42', eu: '50 - 52', jp: 'L / 3', it: '50', fr: '48' },
  { abba: 'XL', us: '42 - 44', uk: '42 - 44', eu: '52 - 54', jp: 'XL / 4', it: '52', fr: '50' },
  { abba: 'XXL', us: '44 - 46', uk: '44 - 46', eu: '54 - 56', jp: 'XXL / 5', it: '54', fr: '52' },
];

export default function SizeGuidePage() {
  const [unit, setUnit] = useState('in'); // 'in' or 'cm'
  const [activeTab, setActiveTab] = useState('tops');

  // Interactive Size Estimator State
  const [calcHeight, setCalcHeight] = useState(175); // in cm
  const [calcWeight, setCalcWeight] = useState(70); // in kg
  const [calcCategory, setCalcCategory] = useState('tops');
  const [calcFitPreference, setCalcFitPreference] = useState('relaxed'); // 'tailored', 'relaxed', 'oversized'

  // Recommendation Engine Formula
  const recommendation = useMemo(() => {
    // Base BMI calculation or height/weight matrix
    let basePoints = (calcHeight - 150) * 0.4 + (calcWeight - 50) * 0.8;

    if (calcFitPreference === 'tailored') {
      basePoints -= 4;
    } else if (calcFitPreference === 'oversized') {
      basePoints += 6;
    }

    let recommendedSize = 'M';
    let fitDescription = 'Standard relaxed fit with natural drop-shoulder aesthetic.';

    if (basePoints < 18) {
      recommendedSize = 'S';
      fitDescription = 'Ideal fit providing a modern relaxed contour without excessive fabric length.';
    } else if (basePoints < 28) {
      recommendedSize = 'M';
      fitDescription = 'Signature ABBA silhouette with comfortable chest ease and slight arm drop.';
    } else if (basePoints < 38) {
      recommendedSize = 'L';
      fitDescription = 'Generous chest room and extended drop-shoulder proportion.';
    } else if (basePoints < 48) {
      recommendedSize = 'XL';
      fitDescription = 'Spacious structural drape crafted for effortless comfort and volume.';
    } else {
      recommendedSize = 'XXL';
      fitDescription = 'Full statement oversized silhouette with maximum drape and chest width.';
    }

    return { size: recommendedSize, description: fitDescription };
  }, [calcHeight, calcWeight, calcCategory, calcFitPreference]);

  const currentCategoryData = SIZE_TABLES[activeTab] || SIZE_TABLES.tops;

  return (
    <div className="bg-ivory text-charcoal py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto border-b border-charcoal/10 pb-12">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ ABBA Atelier Proportions ✦
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-charcoal tracking-wide">
            Garment Fit & Size Guide
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
            Every ABBA garment is designed with intentional structural volume, custom milled organic textiles, and relaxed drop-shoulder tailoring. Use our interactive fit calculator and precise measurements below to determine your ideal size.
          </p>
        </div>

        {/* SECTION 1: Interactive Size Calculator & Fit Recommender */}
        <div className="bg-charcoal text-ivory p-6 sm:p-10 rounded-sm shadow-xl border border-gold/30 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/20 pb-6">
            <div>
              <span className="text-gold text-xs uppercase tracking-luxurious font-semibold flex items-center gap-2">
                <Sparkles size={14} /> Bespoke Silhouette Estimator
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-ivory mt-1">
                Find Your Personal ABBA Size
              </h2>
            </div>
            <div className="text-xs text-gold/80 italic font-light bg-gold/10 px-3 py-1.5 rounded-xs border border-gold/30">
              Personalized based on garment measurements & preferred drape
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Controls (Col 1-7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gold font-medium block">
                  1. Garment Roster
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.keys(SIZE_TABLES).map((key) => (
                    <button
                      key={key}
                      onClick={() => setCalcCategory(key)}
                      className={`py-2 px-3 text-xs uppercase tracking-wider rounded-sm transition-all border ${
                        calcCategory === key
                          ? 'bg-gold text-charcoal font-semibold border-gold'
                          : 'bg-charcoal-light text-ivory/80 border-ivory/20 hover:border-gold'
                      }`}
                    >
                      {key === 'tops' ? 'Tees' : key === 'hoodies' ? 'Hoodies' : key === 'outerwear' ? 'Coats' : 'Trousers'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs tracking-wider">
                  <label className="uppercase text-ivory/80 font-medium">
                    2. Height: <span className="text-gold font-bold">{calcHeight} cm</span> ({Math.floor(calcHeight / 30.48)}' {Math.round((calcHeight % 30.48) / 2.54)}")
                  </label>
                </div>
                <input
                  type="range"
                  min="150"
                  max="205"
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Number(e.target.value))}
                  className="w-full accent-gold bg-charcoal-muted h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Weight Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs tracking-wider">
                  <label className="uppercase text-ivory/80 font-medium">
                    3. Weight: <span className="text-gold font-bold">{calcWeight} kg</span> ({Math.round(calcWeight * 2.20462)} lbs)
                  </label>
                </div>
                <input
                  type="range"
                  min="45"
                  max="125"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value))}
                  className="w-full accent-gold bg-charcoal-muted h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Preferred Fit Style */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gold font-medium block">
                  4. Preferred Silhouette Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'tailored', label: 'Tailored', desc: 'Trim & Structured' },
                    { id: 'relaxed', label: 'Signature', desc: 'Relaxed Drop Shoulder' },
                    { id: 'oversized', label: 'Oversized', desc: 'Full Boxy Volume' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setCalcFitPreference(style.id)}
                      className={`p-2.5 text-left rounded-sm border transition-all ${
                        calcFitPreference === style.id
                          ? 'bg-gold/15 border-gold text-gold'
                          : 'bg-charcoal-light border-ivory/15 text-ivory/70 hover:border-gold/50'
                      }`}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider block">
                        {style.label}
                      </span>
                      <span className="text-[10px] opacity-75 font-light block">
                        {style.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Output Result (Col 8-12) */}
            <div className="lg:col-span-5 bg-charcoal-dark border border-gold/30 p-6 sm:p-8 rounded-sm text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
              <span className="text-gold text-[11px] uppercase tracking-luxurious font-semibold block">
                ✦ Recommended ABBA Size ✦
              </span>
              
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold text-charcoal font-serif-luxury font-bold text-4xl shadow-gold border-2 border-gold-light my-2">
                {recommendation.size}
              </div>

              <div className="space-y-2">
                <span className="text-xs text-ivory uppercase tracking-widest font-semibold block">
                  {calcCategory === 'tops' ? 'Relaxed Tee Fit' : calcCategory === 'hoodies' ? 'Heavyweight Hoodie Drape' : calcCategory === 'outerwear' ? 'Coat Fit' : 'Trouser Size'}
                </span>
                <p className="text-xs text-ivory/80 font-light leading-relaxed max-w-xs mx-auto">
                  {recommendation.description}
                </p>
              </div>

              <div className="pt-2 border-t border-ivory/10 flex items-center justify-center gap-2 text-[11px] text-gold/90 font-light">
                <Check size={14} /> Guaranteed 30-Day Complimentary Exchanges
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Detailed Garment Measurement Tables */}
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal/10 pb-4">
            <div>
              <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
                ✦ Exact Flat Garment Dimensions ✦
              </span>
              <h2 className="font-serif-luxury text-3xl font-bold text-charcoal">
                Garment Measurement Matrix
              </h2>
            </div>

            {/* Inches / Centimeters Unit Toggle */}
            <div className="flex items-center bg-ivory-dark p-1 rounded-sm border border-charcoal/20">
              <button
                onClick={() => setUnit('in')}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-all ${
                  unit === 'in' ? 'bg-gold text-charcoal shadow-sm' : 'text-charcoal/70 hover:text-charcoal'
                }`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-all ${
                  unit === 'cm' ? 'bg-gold text-charcoal shadow-sm' : 'text-charcoal/70 hover:text-charcoal'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3">
            {Object.keys(SIZE_TABLES).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-2.5 text-xs uppercase tracking-widest rounded-sm transition-all border ${
                  activeTab === key
                    ? 'bg-charcoal text-ivory border-charcoal font-bold shadow-md'
                    : 'bg-ivory-light text-charcoal/80 border-charcoal/20 hover:border-gold hover:text-charcoal'
                }`}
              >
                {SIZE_TABLES[key].name}
              </button>
            ))}
          </div>

          {/* Category Description Banner */}
          <div className="bg-ivory-light border border-gold/30 p-5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-charcoal">
                {currentCategoryData.name}
              </h3>
              <p className="text-xs text-charcoal/70 font-light mt-0.5">
                {currentCategoryData.tagline}
              </p>
            </div>
            <span className="text-[11px] text-forest font-semibold uppercase tracking-widest bg-forest/10 px-3 py-1.5 rounded-sm self-start sm:self-center">
              ✦ Pre-shrunk Organic Textiles
            </span>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto border border-charcoal/15 rounded-sm shadow-subtle bg-ivory-light">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-charcoal text-ivory uppercase tracking-widest text-[11px] font-semibold">
                <tr>
                  {currentCategoryData.columns.map((col, idx) => (
                    <th key={idx} className="py-4 px-6 border-b border-gold/20">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/10 font-light">
                {currentCategoryData.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gold/10 transition-colors">
                    <td className="py-4 px-6 font-bold text-charcoal bg-ivory/60 font-serif-luxury text-base">
                      {row.size}
                    </td>
                    <td className="py-4 px-6 text-charcoal">
                      {unit === 'in' ? row.chestIn : row.chestCm}
                    </td>
                    <td className="py-4 px-6 text-charcoal">
                      {unit === 'in' ? row.lengthIn : row.lengthCm}
                    </td>
                    <td className="py-4 px-6 text-charcoal">
                      {unit === 'in' ? row.shoulderIn : row.shoulderCm}
                    </td>
                    <td className="py-4 px-6 text-charcoal">
                      {unit === 'in' ? row.sleeveIn : row.sleeveCm}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: International Size Conversion Table */}
        <div className="space-y-6 pt-6">
          <div className="border-b border-charcoal/10 pb-4">
            <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
              ✦ Global Sizing System ✦
            </span>
            <h2 className="font-serif-luxury text-3xl font-bold text-charcoal">
              International Conversion Roster
            </h2>
            <p className="text-xs text-charcoal/70 font-light mt-1">
              Cross-reference ABBA unisex standard sizes with US, UK, European, Italian, French, and Japanese standards.
            </p>
          </div>

          <div className="overflow-x-auto border border-charcoal/15 rounded-sm bg-ivory-light">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal text-ivory uppercase tracking-widest text-[10px] font-semibold">
                <tr>
                  <th className="py-3.5 px-5">ABBA Size</th>
                  <th className="py-3.5 px-5">United States (US)</th>
                  <th className="py-3.5 px-5">United Kingdom (UK)</th>
                  <th className="py-3.5 px-5">Europe (EU)</th>
                  <th className="py-3.5 px-5">Italy (IT)</th>
                  <th className="py-3.5 px-5">France (FR)</th>
                  <th className="py-3.5 px-5">Japan (JP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/10 font-light">
                {INTERNATIONAL_CONVERSIONS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gold/10 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-charcoal bg-ivory/80 font-serif-luxury text-base">
                      {row.abba}
                    </td>
                    <td className="py-3.5 px-5 text-charcoal/90">{row.us}</td>
                    <td className="py-3.5 px-5 text-charcoal/90">{row.uk}</td>
                    <td className="py-3.5 px-5 text-charcoal/90">{row.eu}</td>
                    <td className="py-3.5 px-5 text-charcoal/90">{row.it}</td>
                    <td className="py-3.5 px-5 text-charcoal/90">{row.fr}</td>
                    <td className="py-3.5 px-5 text-charcoal/90">{row.jp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 4: Visual How-To-Measure Step-by-Step Guide */}
        <div className="space-y-8 pt-6">
          <div className="border-b border-charcoal/10 pb-4">
            <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
              ✦ Precision Protocol ✦
            </span>
            <h2 className="font-serif-luxury text-3xl font-bold text-charcoal">
              How to Measure Your Garment
            </h2>
            <p className="text-xs text-charcoal/70 font-light mt-1">
              For best accuracy, take a favorite well-fitting garment from your wardrobe, lay it completely flat on a table, and measure as follows:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Chest Width',
                desc: 'Measure flat across the chest from armpit seam to armpit seam at the fullest point.',
              },
              {
                step: '02',
                title: 'Garment Length',
                desc: 'Measure vertically from the highest point of the shoulder seam down to the bottom hem.',
              },
              {
                step: '03',
                title: 'Shoulder Width',
                desc: 'Measure horizontally straight across the back from shoulder seam tip to shoulder seam tip.',
              },
              {
                step: '04',
                title: 'Sleeve Length',
                desc: 'Measure from the top shoulder seam down along the outer edge to the end of the cuff.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-ivory-light border border-charcoal/10 p-6 rounded-sm space-y-3 relative hover:border-gold transition-all group"
              >
                <span className="text-gold font-serif-luxury text-3xl font-bold block">
                  {item.step}
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-charcoal group-hover:text-forest transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: Garment Silhouette Profiles */}
        <div className="bg-ivory-light border border-gold/30 p-8 sm:p-12 rounded-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
              ✦ Signature Aesthetics ✦
            </span>
            <h2 className="font-serif-luxury text-3xl font-bold text-charcoal">
              ABBA Silhouette Breakdown
            </h2>
            <p className="text-xs text-charcoal/70 font-light">
              Understand our three primary garment cuts to select the drape that aligns with your style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-ivory p-6 border border-charcoal/10 rounded-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold font-serif-luxury text-lg">
                01
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-charcoal">
                Relaxed Drop Shoulder
              </h3>
              <p className="text-xs text-charcoal/75 font-light leading-relaxed">
                Found on our signature tees. Features extended shoulder seams, wider chest room, and a clean structured hem that falls cleanly without bunching.
              </p>
            </div>

            <div className="bg-ivory p-6 border border-charcoal/10 rounded-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold font-serif-luxury text-lg">
                02
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-charcoal">
                Heavyweight Structural Oversized
              </h3>
              <p className="text-xs text-charcoal/75 font-light leading-relaxed">
                Featured in our 450 GSM hoodies and fleece. Offers boxy body volume, heavy organic ribbing, and substantial architectured weight.
              </p>
            </div>

            <div className="bg-ivory p-6 border border-charcoal/10 rounded-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold font-serif-luxury text-lg">
                03
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-charcoal">
                Tailored Classic Roster
              </h3>
              <p className="text-xs text-charcoal/75 font-light leading-relaxed">
                Used in our outerwear and pleated trousers. Designed with traditional shoulder placement, structured chest tapering, and clean fluid lines.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 6: Client Care Concierge CTA */}
        <div className="bg-charcoal text-ivory p-8 sm:p-12 rounded-sm text-center space-y-6 border-t-2 border-gold">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
              ✦ Personal Concierge Assistance ✦
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-ivory">
              Still Unsure About Your Fit?
            </h2>
            <p className="text-xs sm:text-sm text-ivory/80 font-light leading-relaxed">
              Our Client Advisory team provides personalized sizing guidance for your unique measurements and fit preferences. Reach out anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-gold text-charcoal hover:bg-gold-light transition-colors text-xs uppercase tracking-widest font-bold rounded-sm shadow-gold flex items-center gap-2"
            >
              Contact Client Care
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-transparent text-ivory border border-ivory/30 hover:border-gold hover:text-gold transition-colors text-xs uppercase tracking-widest font-semibold rounded-sm"
            >
              Explore Collection
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
