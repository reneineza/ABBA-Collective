'use client';

import React, { useState } from 'react';
import Button from '@/components/Button';
import { useAuth } from '@/lib/context/AuthContext';
import { Users, Award, Copy, Check, Share2, ArrowRight } from 'lucide-react';

export default function AmbassadorPage() {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [applicantName, setApplicantName] = useState(profile?.full_name || '');
  const [applicantEmail, setApplicantEmail] = useState(profile?.email || '');
  const [socialHandle, setSocialHandle] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const referralCode = profile?.full_name 
    ? `ABBA-${profile.full_name.split(' ')[0].toUpperCase()}-2026` 
    : 'ABBA-AMBASSADOR-2026';

  const referralLink = `https://abbacollective.com/register?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleApply = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Community & Ambassador Program ✦
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-charcoal">
            ABBA Collective Ambassador Roster
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
            Gather around a shared identity and mission. Represent divine sonship, quiet luxury tailoring, and kingdom purpose.
          </p>
        </div>

        {/* Unique Referral Card */}
        <div className="bg-charcoal text-ivory p-8 sm:p-12 rounded-sm border border-gold/30 space-y-6 shadow-xl">
          <div className="space-y-1 border-b border-ivory/10 pb-4">
            <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
              Your Personal Referral Link
            </span>
            <h3 className="font-serif-luxury text-2xl font-bold text-ivory">
              Ambassador Referral Code
            </h3>
            <p className="text-xs text-ivory/70 font-light">
              Share your link with fellow believers. When they register and order, both of you earn 150 Loyalty Points.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-ivory/10 p-4 border border-gold/30 rounded-sm">
            <div className="flex-1 text-xs font-mono text-gold truncate">
              {referralLink}
            </div>
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto px-6 py-3 bg-gold text-charcoal hover:bg-ivory transition-colors text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check size={15} className="text-forest" /> Copied!
                </>
              ) : (
                <>
                  <Copy size={15} /> Copy Referral Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Ambassador Application Form */}
        <div className="bg-ivory-light border border-charcoal/10 p-8 sm:p-12 rounded-sm space-y-6">
          <div className="space-y-1 border-b border-charcoal/10 pb-4">
            <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">
              Apply to Become an Official Brand Ambassador
            </h3>
            <p className="text-xs text-charcoal/60">
              Official ambassadors receive early access to collection drops and bespoke gift packages.
            </p>
          </div>

          {submitted ? (
            <div className="bg-forest/10 border border-forest/30 p-6 rounded-sm text-forest space-y-2 text-center">
              <Check size={32} className="mx-auto text-gold" />
              <h4 className="font-serif-luxury text-xl font-bold text-charcoal">Application Received</h4>
              <p className="text-xs font-light">Our brand committee will review your application within 2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1 text-charcoal">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Grace Heirs"
                    className="w-full p-3.5 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1 text-charcoal">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="info@abbacollective.com"
                    className="w-full p-3.5 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1 text-charcoal">
                  Social Media Handle / Ministry Profile
                </label>
                <input
                  type="text"
                  required
                  value={socialHandle}
                  onChange={(e) => setSocialHandle(e.target.value)}
                  placeholder="@graceheirs or instagram.com/grace"
                  className="w-full p-3.5 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-4 bg-charcoal text-ivory hover:bg-forest transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2"
              >
                Submit Ambassador Application <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
