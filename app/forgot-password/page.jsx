import React from 'react';
import AuthForm from '@/components/AuthForm';

export const metadata = {
  title: 'Reset Password | ABBA Collective',
  description: 'Request a password reset link for your ABBA Collective account.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AuthForm mode="forgot-password" />
      </div>
    </div>
  );
}
