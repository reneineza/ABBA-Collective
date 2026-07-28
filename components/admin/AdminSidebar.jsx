'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Layers, Tag, ShoppingBag, Users, FileText, Mail, Star, Megaphone, ExternalLink } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

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

      {/* Return to Client Store Link */}
      <div className="p-4 border-t border-gold/20">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-3 text-xs uppercase tracking-widest font-semibold text-gold hover:text-ivory transition-colors bg-gold/10 border border-gold/30 rounded-sm"
        >
          <span>View Public Store</span>
          <ExternalLink size={14} />
        </Link>
      </div>
    </aside>
  );
}
