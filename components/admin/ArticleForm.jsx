'use client';

import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, BookOpen, User, Calendar, Clock, FileText } from 'lucide-react';

export default function ArticleForm({ initialArticle, onSave, onCancel }) {
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [category, setCategory] = useState(initialArticle?.category || 'Theological Identity');
  const [author, setAuthor] = useState(initialArticle?.author || 'ABBA Collective Editorial Team');
  const [date, setDate] = useState(
    initialArticle?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  );
  const [readTime, setReadTime] = useState(initialArticle?.readTime || '5 min read');
  const [imageUrl, setImageUrl] = useState(
    initialArticle?.image_url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop'
  );
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [scripture, setScripture] = useState(initialArticle?.scripture || '');
  
  // Format content array into newline separated string for editing
  const initialContentText = Array.isArray(initialArticle?.content)
    ? initialArticle.content.join('\n\n')
    : typeof initialArticle?.content === 'string'
    ? initialArticle.content
    : initialArticle?.excerpt || '';
    
  const [contentText, setContentText] = useState(initialContentText);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert newline separated text into paragraphs array
    const contentArray = contentText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const generatedSlug = slug
      ? slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      : title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const articleData = {
      id: initialArticle?.id || 'blog_' + Date.now(),
      title,
      slug: generatedSlug,
      category,
      author,
      date,
      readTime,
      image_url: imageUrl,
      excerpt,
      scripture,
      content: contentArray.length > 0 ? contentArray : [excerpt],
    };

    onSave(articleData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-charcoal border border-gold/30 p-6 sm:p-8 rounded-sm space-y-6 text-ivory max-w-4xl mx-auto shadow-2xl">
      {/* Form Header */}
      <div className="flex justify-between items-center border-b border-gold/20 pb-4">
        <div>
          <span className="text-gold text-[10px] uppercase tracking-luxurious font-semibold block">
            ✦ Content Management ✦
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-ivory">
            {initialArticle ? 'Edit Journal Article' : 'Publish New Journal Entry'}
          </h3>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-2 text-ivory/60 hover:text-gold transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">
            Article Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!initialArticle) {
                setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
              }
            }}
            placeholder="Understanding Sonship: Beyond Performance and Approval"
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:border-gold focus:outline-none"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">
            URL Slug
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="understanding-sonship-beyond-performance"
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:border-gold focus:outline-none font-mono"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:border-gold focus:outline-none"
          >
            <option value="Theological Identity">Theological Identity</option>
            <option value="Design Journal">Design Journal</option>
            <option value="Kingdom Stewardship">Kingdom Stewardship</option>
            <option value="Devotionals">Devotionals</option>
            <option value="Heritage & Craft">Heritage & Craft</option>
          </select>
        </div>

        {/* Author */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-1 flex items-center gap-1">
            <User size={12} className="text-gold" /> Author Name
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="ABBA Collective Editorial Team"
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:border-gold focus:outline-none"
          />
        </div>

        {/* Date & Read Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-1 flex items-center gap-1">
              <Calendar size={12} className="text-gold" /> Published Date
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="July 24, 2026"
              className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-1 flex items-center gap-1">
              <Clock size={12} className="text-gold" /> Read Time
            </label>
            <input
              type="text"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="6 min read"
              className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Cover Image URL */}
        <div className="md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-1 flex items-center gap-1">
            <ImageIcon size={12} className="text-gold" /> Cover Image URL
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 p-3 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:border-gold focus:outline-none"
            />
            {imageUrl && (
              <div className="w-12 h-10 border border-gold/30 bg-charcoal-dark overflow-hidden rounded-sm flex-shrink-0">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div className="md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">
            Short Excerpt / Subtitle
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="True identity is never earned; it is received..."
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:border-gold focus:outline-none resize-none"
          />
        </div>

        {/* Scripture Reflection Quote */}
        <div className="md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-1 flex items-center gap-1">
            <BookOpen size={12} className="text-gold" /> Scripture Reflection (Optional)
          </label>
          <input
            type="text"
            value={scripture}
            onChange={(e) => setScripture(e.target.value)}
            placeholder="Galatians 4:6 — 'And because you are sons, God has sent the Spirit of his Son into our hearts, crying, ABBA! Father!'"
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:border-gold focus:outline-none italic"
          />
        </div>

        {/* Full Article Content */}
        <div className="md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-1 flex items-center gap-1">
            <FileText size={12} className="text-gold" /> Full Article Body (Paragraphs separated by line breaks) *
          </label>
          <textarea
            rows={8}
            required
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder="Write your article paragraphs here. Separate each paragraph with a blank line..."
            className="w-full p-3 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:border-gold focus:outline-none font-sans leading-relaxed"
          />
          <p className="text-[10px] text-ivory/50 mt-1">
            Tip: Press Enter twice between paragraphs to create distinct sections in the reading view.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold/20">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-ivory/60 hover:text-gold transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 bg-gold text-charcoal hover:bg-gold-light transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
        >
          <Sparkles size={14} /> {initialArticle ? 'Save Article Changes' : 'Publish Journal Entry'}
        </button>
      </div>
    </form>
  );
}
