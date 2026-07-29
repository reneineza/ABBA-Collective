'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStoredBlogPosts } from '@/lib/utils/blogStore';

export default function JournalPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(getStoredBlogPosts());

    const handleUpdate = () => setPosts(getStoredBlogPosts());
    window.addEventListener('abba_blog_posts_updated', handleUpdate);
    return () => window.removeEventListener('abba_blog_posts_updated', handleUpdate);
  }, []);

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Editorial Essays & Devotionals ✦
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-charcoal">
            The ABBA Journal
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 font-light">
            Thoughtful articles on adoption, grace, creative stewardship, and modern faith.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/journal/${post.slug}`}
              className="group bg-ivory-light border border-charcoal/10 rounded-sm overflow-hidden flex flex-col hover:shadow-card transition-all duration-500"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 space-y-4 flex flex-col justify-between flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-gold font-semibold">
                    <span>{post.category}</span>
                    <span>{post.date} • {post.readTime}</span>
                  </div>
                  <h2 className="font-serif-luxury text-2xl font-bold text-charcoal group-hover:text-forest transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-xs uppercase tracking-widest text-forest font-semibold border-b border-forest/30 pb-0.5 group-hover:text-gold group-hover:border-gold transition-colors">
                    Read Journal Entry &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
