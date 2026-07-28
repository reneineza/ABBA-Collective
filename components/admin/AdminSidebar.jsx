'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Layers, Tag, ShoppingBag, Users, FileText, Mail, Star, Megaphone, ExternalLink, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const handleSignOut = async (e) => {
    if (e) e.preventDefault();
    signOut().catch(console.error);
    window.location.href = '/admin/login';
  };

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Collections', href: '/admin/collections', icon: Layers },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Marketing', href: '/admin/marketing', icon: Megaphone },
    { name: 'Journal CMS', href: '/admin/blog', icon: FileText },
    { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  ];

  return (
    <aside className="w-64 bg-charcoal-dark border-r border-gold/20 flex flex-col justify-between min-h-screen text-ivory flex-shrink-0">
      <div>
        {/* Admin Brand Header */}
        <div className="p-6 border-b border-gold/20">
          <Link href="/admin" className="block">
            <h2 className="font-serif-luxury text-2xl font-bold tracking-widest text-ivory">
              ABBA
            </h2>
            <span className="text-[9px] tracking-[0.35em] text-gold uppercase block -mt-1 font-semibold">
              ATELIER ADMIN
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all ${
                  isActive
                    ? 'bg-gold text-charcoal shadow-sm'
                    : 'text-ivory/70 hover:text-ivory hover:bg-ivory/10'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-charcoal' : 'text-gold'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to Client Store Link & Logout */}
      <div className="p-4 border-t border-gold/20 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-3 text-xs uppercase tracking-widest font-semibold text-gold hover:text-ivory transition-colors bg-gold/10 border border-gold/30 rounded-sm"
        >
          <span>View Public Store</span>
          <ExternalLink size={14} />
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-widest font-semibold text-red-300 hover:text-ivory hover:bg-red-900 transition-colors bg-red-950/40 border border-red-800/40 rounded-sm"
        >
          <span>Sign Out</span>
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
