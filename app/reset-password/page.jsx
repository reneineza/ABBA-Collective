import React from 'react';
import AuthForm from '@/components/AuthForm';

export const metadata = {
  title: 'Choose a New Password | ABBA',
  description: 'Set a new password for your ABBA account.',
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AuthForm mode="reset-password" />
      </div>
    </div>
  );
}
