'use client';

import React, { useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { SAMPLE_BLOG_POSTS } from '@/lib/data/sampleData';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState(SAMPLE_BLOG_POSTS);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Theological Identity');
  const [excerpt, setExcerpt] = useState('');

  const openCreate = () => {
    setEditingPost(null);
    setTitle('');
    setCategory('Theological Identity');
    setExcerpt('');
    setShowModal(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category || 'Theological Identity');
    setExcerpt(post.excerpt || '');
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingPost) {
      setPosts(posts.map((p) =>
        p.id === editingPost.id ? { ...p, title, category, excerpt, slug: title.toLowerCase().replace(/ /g, '-') } : p
      ));
    } else {
      const newPost = {
        id: 'blog_' + Date.now(),
        title,
        slug: title.toLowerCase().replace(/ /g, '-'),
        category,
        readTime: '5 min read',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        excerpt,
        image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800',
      };
      setPosts([newPost, ...posts]);
    }
    setShowModal(false);
    setEditingPost(null);
  };

  const columns = [
    {
      header: 'Article Title',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-10 bg-charcoal-dark border border-gold/20 rounded-sm overflow-hidden flex-shrink-0">
            <img src={row.image_url} alt={row.title} className="object-cover w-full h-full" />
          </div>
          <div>
            <p className="font-bold text-ivory">{row.title}</p>
            <p className="text-[10px] text-gold font-mono">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category / Read Time',
      cell: (row) => (
        <div>
          <p className="font-semibold text-ivory">{row.category}</p>
          <p className="text-[10px] text-ivory/60">{row.readTime}</p>
        </div>
      ),
    },
    {
      header: 'Published Date',
      cell: (row) => <span className="text-xs text-ivory/70">{row.date}</span>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button onClick={() => openEdit(row)} className="p-1.5 text-ivory/60 hover:text-gold">
            <Edit size={15} />
          </button>
          <button onClick={() => { if (confirm('Delete this article?')) setPosts(posts.filter(p => p.id !== row.id)); }} className="p-1.5 text-red-400 hover:text-red-300">
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
            The ABBA Journal CMS
          </h2>
          <p className="text-xs text-ivory/60 font-light">
            Publish articles on sonship, theology of craft, and identity.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-gold text-charcoal hover:bg-gold-light transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
        >
          <Plus size={16} /> New Article
        </button>
      </div>

      {showModal && (
        <form onSubmit={handleSave} className="bg-charcoal border border-gold/30 p-6 rounded-sm space-y-4 max-w-xl">
          <h3 className="font-serif-luxury text-xl font-bold text-ivory">{editingPost ? 'Edit Article' : 'Publish New Journal Entry'}</h3>
          <div>
            <label className="text-[10px] uppercase text-gold font-semibold block mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Architecture of Grace"
              className="w-full p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-gold font-semibold block mb-1">Excerpt</label>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full p-2.5 text-xs bg-charcoal-dark border border-gold/30 text-ivory focus:outline-none resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="text-xs uppercase text-ivory/60">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-gold text-charcoal text-xs font-bold uppercase">Publish Article</button>
          </div>
        </form>
      )}

      <DataTable columns={columns} data={posts} searchPlaceholder="Search articles..." />
    </div>
  );
}
