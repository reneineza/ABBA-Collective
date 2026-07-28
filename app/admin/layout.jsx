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
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(true); // Allow demo access

  const titles = {
    '/admin': 'Executive Business Analytics',
    '/admin/products': 'Garments & Fashion Inventory Management',
    '/admin/collections': 'Collection & Chapter Management',
    '/admin/categories': 'Product Taxonomies & Categories',
    '/admin/orders': 'Customer Order Fulfillment & Shipping',
    '/admin/customers': 'Client Directory & Lifetime Value Metrics',
    '/admin/blog': 'ABBA Journal & Devotional CMS',
    '/admin/newsletter': 'Newsletter Roster & Subscriber Export',
  };

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
