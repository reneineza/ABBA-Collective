'use client';

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check, Twitter } from 'lucide-react';

export default function SocialShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url || 'https://abbacollective.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`"Identity Received. Grace Revealed." — ${title} by @abbacollective`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="flex items-center space-x-3 text-xs">
      <span className="text-[10px] uppercase tracking-widest text-charcoal/50 font-semibold flex items-center gap-1">
        <Share2 size={13} /> Share Garment:
      </span>

      <button
        onClick={handleCopy}
        className="px-3 py-1.5 bg-ivory-light border border-charcoal/20 hover:border-gold rounded-sm text-charcoal/80 transition-colors flex items-center gap-1.5"
        title="Copy link to clipboard"
      >
        {copied ? (
          <>
            <Check size={13} className="text-forest" />
            <span className="text-forest font-semibold">Link Copied!</span>
          </>
        ) : (
          <>
            <LinkIcon size={13} />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <button
        onClick={handleTwitterShare}
        className="p-1.5 bg-ivory-light border border-charcoal/20 hover:border-gold rounded-sm text-charcoal/80 transition-colors"
        title="Share on X / Twitter"
      >
        <Twitter size={14} />
      </button>
    </div>
  );
}
