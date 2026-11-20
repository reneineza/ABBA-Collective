import React from 'react';

export const metadata = {
  title: 'Privacy Policy | ABBA Collective',
  description: 'Learn how ABBA Collective collects, uses, and safeguards client personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-charcoal/10 pb-6 space-y-2">
          <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
            ✦ Legal Governance ✦
          </span>
          <h1 className="font-serif-luxury text-4xl font-bold text-charcoal">
            Privacy Policy
          </h1>
          <p className="text-xs text-charcoal/60">Effective Date: 20 November 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-charcoal/80 font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">1. Information We Collect</h2>
            <p>
              When you visit or place an order with ABBA Collective, we collect information necessary to process your purchase, including your full name, delivery address, email address, and phone number. Mobile Money and card payments are processed directly by MTN, Airtel, and our card payment provider; we do not store your Mobile Money PIN or full card details.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">2. How We Use Your Information</h2>
            <p>
              Your data is exclusively used for order fulfillment, client communication, identity verification, and optional editorial newsletter notifications. We never sell, rent, or trade client information to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">3. Data Security & Storage</h2>
            <p>
              We implement Row Level Security (RLS), SSL transport encryption, and Supabase security infrastructure to protect your personal identity and transaction history. Some of our service providers (such as our hosting and database providers) may store data on servers located outside Rwanda.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl font-bold text-charcoal">4. Your Rights</h2>
            <p>
              We process personal data in accordance with Law Nº 058/2021 of 13/10/2021 relating to the protection of personal data and privacy in Rwanda. You have the right to access the personal data we hold about you, to request its correction or deletion, and to object to its use for marketing, including unsubscribing from our newsletter at any time.
            </p>
            <p>
              To exercise these rights, contact us at <strong>info@abbacollective.com</strong> or <strong>+250 789 284 564</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
