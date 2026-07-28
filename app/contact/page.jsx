import React from 'react';
import Button from '@/components/Button';
import { Mail, MapPin, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | ABBA Collective',
  description: 'Connect with the ABBA Collective client care team for inquiries regarding sizing, order status, or partnerships.',
};

export default function ContactPage() {
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
                <span>concierge@abbacollective.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock size={16} className="text-gold" />
                <span>Mon – Fri: 9am – 6pm EST</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-gold mt-0.5" />
                <span>ABBA Collective Atelier & Studios<br />New York, NY</span>
              </div>
            </div>
          </div>

          <form className="md:col-span-7 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Subject / Order ID"
              className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
            />
            <textarea
              rows={4}
              placeholder="Your inquiry or message..."
              className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none resize-none"
            />
            <Button variant="primary" size="md">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
