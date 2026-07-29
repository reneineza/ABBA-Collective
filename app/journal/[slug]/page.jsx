'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStoredBlogPosts } from '@/lib/utils/blogStore';
import { ArrowLeft, Calendar, Clock, Share2, BookOpen } from 'lucide-react';

export default function JournalDetailPage({ params }) {
  const resolvedParams = params && typeof params.then === 'function' ? React.use(params) : params;
  const rawSlug = resolvedParams?.slug || '';
  const slug = decodeURIComponent(rawSlug).toLowerCase();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(getStoredBlogPosts());

    const handleUpdate = () => setPosts(getStoredBlogPosts());
    window.addEventListener('abba_blog_posts_updated', handleUpdate);
    return () => window.removeEventListener('abba_blog_posts_updated', handleUpdate);
  }, []);

  // Find blog post by slug or matching title
  const post = posts.find(
    (p) => p.slug.toLowerCase() === slug || slug.includes(p.slug.toLowerCase()) || p.id.toLowerCase() === slug
  ) || posts[0];

  const relatedPosts = posts.filter((p) => p && post && p.id !== post.id);

  if (!post) {
    return (
      <div className="bg-ivory text-charcoal min-h-screen py-20 text-center space-y-4">
        <h1 className="font-serif-luxury text-3xl font-bold">Article Not Found</h1>
        <Link href="/journal" className="text-gold uppercase tracking-widest text-xs font-semibold">
          Return to Journal
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-ivory text-charcoal min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation back button */}
        <div>
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-charcoal/70 hover:text-gold transition-colors"
          >
            <ArrowLeft size={16} /> Back to ABBA Journal
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center space-x-2 text-[11px] uppercase tracking-luxurious text-gold font-semibold bg-ivory-light px-3 py-1 border border-charcoal/10 rounded-full">
            <span>{post.category}</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-charcoal leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-charcoal/60 font-light border-y border-charcoal/10 py-4">
            <span className="flex items-center gap-1.5 font-medium text-charcoal">
              {post.author || 'ABBA Collective Editorial'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gold" /> {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-gold" /> {post.readTime}
            </span>
          </div>
        </header>

        {/* Hero Featured Image */}
        <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden border border-charcoal/15 shadow-card">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        {/* Excerpt Lead Paragraph */}
        {post.excerpt && (
          <div className="text-lg sm:text-xl font-serif-luxury italic text-charcoal/90 leading-relaxed border-l-2 border-gold pl-6 py-1">
            "{post.excerpt}"
          </div>
        )}

        {/* Scripture Callout Block */}
        {post.scripture && (
          <div className="bg-forest/5 border border-forest/20 p-6 rounded-sm space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-forest">
              <BookOpen size={16} /> Scripture Reflection
            </div>
            <p className="font-serif-luxury text-base sm:text-lg text-charcoal font-medium italic">
              {post.scripture}
            </p>
          </div>
        )}

        {/* Main Content Body */}
        <div className="space-y-6 text-sm sm:text-base text-charcoal/85 leading-relaxed font-light font-sans">
          {Array.isArray(post.content) && post.content.length > 0 ? (
            post.content.map((paragraph, idx) => (
              <p key={idx} className="first-letter:text-3xl first-letter:font-serif-luxury first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:text-forest">
                {paragraph}
              </p>
            ))
          ) : typeof post.content === 'string' ? (
            <p>{post.content}</p>
          ) : (
            <p>{post.excerpt}</p>
          )}
        </div>

        {/* Share & Article Footer */}
        <div className="border-t border-charcoal/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-charcoal/60 font-light">
            Published under <span className="font-semibold text-charcoal">{post.category}</span>
          </div>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: post.title, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Article link copied to clipboard!');
              }
            }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-charcoal hover:text-gold border border-charcoal/20 px-4 py-2 rounded-sm transition-colors"
          >
            <Share2 size={14} /> Share Essay
          </button>
        </div>

        {/* Related Essays */}
        {relatedPosts.length > 0 && (
          <section className="pt-12 border-t border-charcoal/10 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-gold text-xs uppercase tracking-widest font-semibold">
                ✦ Further Reading ✦
              </span>
              <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">
                More From The ABBA Journal
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((relPost) => (
                <Link
                  key={relPost.id}
                  href={`/journal/${relPost.slug}`}
                  className="group bg-ivory-light border border-charcoal/10 p-5 rounded-sm hover:shadow-card transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">
                      {relPost.category}
                    </span>
                    <h3 className="font-serif-luxury text-lg font-bold text-charcoal group-hover:text-forest transition-colors">
                      {relPost.title}
                    </h3>
                  </div>
                  <span className="text-xs text-charcoal/60 font-light flex items-center gap-1 group-hover:text-gold transition-colors">
                    Read Article &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </article>
  );
}
