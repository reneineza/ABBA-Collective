import React from 'react';
import AuthForm from '@/components/AuthForm';

export const metadata = {
  title: 'Client Sign In | ABBA Collective',
  description: 'Sign in to your ABBA Collective account to access order history, profile settings, and saved wishlist items.',
};

export default function LoginPage() {
  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
