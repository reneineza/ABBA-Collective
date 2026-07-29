'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/lib/context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading } = useAuth();
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (pathname?.startsWith('/admin/login')) {
      setCheckingAuth(false);
      return;
    }

    if (!loading) {
      if (!user || profile?.role !== 'admin') {
        window.location.href = '/admin/login';
      } else {
        setIsAdminAuthorized(true);
        setCheckingAuth(false);
      }
    }

    // Safety fallback timeout (1.2s max) to prevent hanging on loading
    const timeout = setTimeout(() => {
      const parsed = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('abba_demo_user') || 'null') : null;
      const currentUser = user || parsed;
      const currentRole = profile?.role || parsed?.profile?.role;

      if (!currentUser || currentRole !== 'admin') {
        window.location.href = '/admin/login';
      } else {
        setIsAdminAuthorized(true);
      }
      setCheckingAuth(false);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [user, profile, loading, pathname]);

  const titles = {
    '/admin': 'Executive Business Analytics',
    '/admin/products': 'Garments & Fashion Inventory Management',
    '/admin/collections': 'Collection & Chapter Management',
    '/admin/categories': 'Product Taxonomies & Categories',
    '/admin/orders': 'Customer Order Fulfillment & Shipping',
    '/admin/customers': 'Client Directory & Lifetime Value Metrics',
    '/admin/blog': 'ABBA Journal & Devotional CMS',
    '/admin/newsletter': 'Newsletter Roster & Subscriber Export',
    '/admin/reviews': 'Product Review Moderation',
    '/admin/marketing': 'Marketing & Brand Campaign Tools',
  };

  // If the user is on the admin login page, don't show the sidebar or header
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-charcoal-dark font-sans selection:bg-gold selection:text-charcoal text-ivory">
        {children}
      </div>
    );
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-dark text-ivory">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 size={32} className="animate-spin text-gold" />
          <p className="text-xs uppercase tracking-luxurious text-gold">Verifying Access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-dark flex font-sans selection:bg-gold selection:text-charcoal text-ivory">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title={titles[pathname] || 'Atelier Control Console'} />
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto bg-charcoal-dark">
          {children}
        </main>
      </div>
    </div>
  );
}
