'use client';

import React, { useState } from 'react';
import Button from '@/components/Button';
import { Mail, MapPin, Phone, CheckCircle2, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus('error');
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    // Simulate sending (replace with real email API call when deploying)
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus('success');
  };

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Concierge Client Care ✦
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-charcoal">
            Contact The Collective
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 font-light">
            We are here to assist with size consultation, garment care guidance, or order status inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-ivory-light p-8 sm:p-12 border border-charcoal/10 rounded-sm">
          <div className="md:col-span-5 space-y-6">
            <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">
              Atelier Inquiries
            </h3>
            <div className="space-y-4 text-xs text-charcoal/80">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-gold" />
                <a href="mailto:info@abbacollective.com" className="hover:text-forest transition-colors">
                  info@abbacollective.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-gold" />
                <a href="tel:+250789284564" className="hover:text-forest transition-colors">
                  +250 789 284 564
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-gold mt-0.5" />
                <span>ABBA Collective Atelier & Studios<br />Kigali, Rwanda</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-10 text-center">
                <CheckCircle2 size={40} className="text-forest" />
                <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">Message Received</h3>
                <p className="text-xs text-charcoal/70 font-light">
                  Thank you for reaching out. Our team will respond within 1–2 business days.
                </p>
                <button
                  onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="text-xs text-gold hover:underline uppercase tracking-widest font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                    {errorMsg}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    required
                    className="p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address *"
                    required
                    className="p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject / Order ID"
                  className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Your inquiry or message... *"
                  required
                  className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 bg-charcoal text-ivory hover:bg-forest transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2 disabled:opacity-70"
                >
                  {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : null}
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

