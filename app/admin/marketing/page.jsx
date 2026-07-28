'use client';

import React, { useState } from 'react';
import { Megaphone, Save, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function AdminMarketingPage() {
  const [announcementText, setAnnouncementText] = useState('✦ Identity Received. Grace Revealed. ✦ Complimentary Shipping on all Rwandan Orders');
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [featuredCollection, setFeaturedCollection] = useState('adoption');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-gold/20 pb-4">
        <span className="text-[10px] uppercase tracking-luxurious text-gold font-semibold block">
          ✦ Campaign Operations ✦
        </span>
        <h1 className="font-serif-luxury text-3xl font-bold text-ivory">
          Marketing & Brand CMS
        </h1>
      </div>

      <form onSubmit={handleSave} className="bg-charcoal border border-gold/20 p-8 rounded-sm space-y-6">
        
        {/* Announcement Bar Section */}
        <div className="space-y-4 border-b border-gold/10 pb-6">
          <div className="flex items-center space-x-2 text-gold font-bold text-sm">
            <Megaphone size={18} />
            <h3 className="font-serif-luxury text-xl text-ivory">Top Announcement Banner Bar</h3>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="annActive"
              checked={announcementActive}
              onChange={(e) => setAnnouncementActive(e.target.checked)}
              className="accent-gold w-4 h-4"
            />
            <label htmlFor="annActive" className="text-xs uppercase tracking-wider text-ivory/80 font-semibold cursor-pointer">
              Enable Top Announcement Banner
            </label>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">
              Banner Announcement Copy
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full p-3 text-xs bg-charcoal-light border border-gold/20 text-ivory focus:border-gold focus:outline-none rounded-sm"
            />
          </div>
        </div>

        {/* Featured Collection Highlight */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gold font-bold text-sm">
            <Sparkles size={18} />
            <h3 className="font-serif-luxury text-xl text-ivory">Homepage Featured Collection</h3>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">
              Select Primary Spotlight Collection
            </label>
            <select
              value={featuredCollection}
              onChange={(e) => setFeaturedCollection(e.target.value)}
              className="w-full p-3 text-xs bg-charcoal-light border border-gold/20 text-ivory focus:border-gold focus:outline-none rounded-sm"
            >
              <option value="adoption">Collection 001: ADOPTION</option>
              <option value="grace-revealed">Collection 002: GRACE REVEALED</option>
              <option value="sovereign-essentials">Collection 003: SOVEREIGN ESSENTIALS</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center border-t border-gold/10">
          {saved ? (
            <span className="text-xs text-gold font-semibold flex items-center gap-1.5">
              <Check size={16} /> Campaign preferences saved successfully!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="px-6 py-3 bg-gold text-charcoal hover:bg-ivory transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2 rounded-sm"
          >
            <Save size={15} /> Save Campaign Settings
          </button>
        </div>

      </form>
    </div>
  );
}
