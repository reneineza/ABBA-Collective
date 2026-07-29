'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import ArticleForm from '@/components/admin/ArticleForm';
import { getStoredBlogPosts, saveStoredBlogPosts } from '@/lib/utils/blogStore';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    setPosts(getStoredBlogPosts());
  }, []);

  const openCreate = () => {
    setEditingPost(null);
    setShowModal(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setShowModal(true);
  };

  const handleSave = (articleData) => {
    let updated;
    if (editingPost) {
      updated = posts.map((p) => (p.id === editingPost.id ? articleData : p));
    } else {
      updated = [articleData, ...posts];
    }
    setPosts(updated);
    saveStoredBlogPosts(updated);
    setShowModal(false);
    setEditingPost(null);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this journal article?')) {
      const updated = posts.filter((p) => p.id !== id);
      setPosts(updated);
      saveStoredBlogPosts(updated);
    }
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
            <p className="font-bold text-ivory flex items-center gap-1.5">
              {row.title}
              <Link
                href={`/journal/${row.slug}`}
                target="_blank"
                className="text-gold/60 hover:text-gold transition-colors inline-block"
                title="View published article"
              >
                <ExternalLink size={12} />
              </Link>
            </p>
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
      header: 'Author / Date',
      cell: (row) => (
        <div>
          <p className="text-xs text-ivory/90 font-medium">{row.author || 'ABBA Editorial'}</p>
          <p className="text-[10px] text-ivory/60">{row.date}</p>
        </div>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 text-ivory/60 hover:text-gold transition-colors"
            title="Edit Full Article"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-red-400/70 hover:text-red-400 transition-colors"
            title="Delete Article"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gold/20 pb-4">
        <div>
          <span className="text-gold text-[10px] uppercase tracking-luxurious font-semibold block">
            ✦ Content Management System ✦
          </span>
          <h2 className="font-serif-luxury text-2xl font-bold text-ivory">
            The ABBA Journal CMS
          </h2>
          <p className="text-xs text-ivory/60 font-light">
            Publish and edit essays on sonship, theology of craft, identity, and devotionals.
          </p>
        </div>
        {!showModal && (
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-gold text-charcoal hover:bg-gold-light transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
          >
            <Plus size={16} /> New Article
          </button>
        )}
      </div>

      {showModal && (
        <div className="py-2">
          <ArticleForm
            initialArticle={editingPost}
            onSave={handleSave}
            onCancel={() => {
              setShowModal(false);
              setEditingPost(null);
            }}
          />
        </div>
      )}

      <DataTable columns={columns} data={posts} searchPlaceholder="Search journal articles..." />
    </div>
  );
}
