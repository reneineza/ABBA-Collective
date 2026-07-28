import React from 'react';
import AuthForm from '@/components/AuthForm';

export const metadata = {
  title: 'Join The Collective | ABBA Collective',
  description: 'Create an account with ABBA Collective for a personalized identity-driven luxury fashion experience.',
};

export default function RegisterPage() {
  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
