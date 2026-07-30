'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, User, Heart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/context/CartContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { toggleCart, totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }


  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'Our Story', href: '/about' },
    { name: 'Statement of Faith', href: '/faith' },
    { name: 'Journal', href: '/journal' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-charcoal text-ivory text-[10px] sm:text-xs py-2 tracking-[0.25em] text-center uppercase border-b border-gold/30 font-medium">
        <span className="text-gold font-semibold tracking-widest mr-2">✦</span>
        Identity Received. Grace Revealed.
        <span className="text-gold font-semibold tracking-widest ml-2">✦</span>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          isScrolled ? 'glass-header py-3.5 shadow-subtle' : 'bg-ivory py-5 border-b border-charcoal/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-charcoal hover:text-gold transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>

            {/* Desktop Navigation Left */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.slice(0, 3).map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs tracking-widest uppercase transition-colors relative py-1 ${
                      isActive ? 'text-forest font-semibold' : 'text-charcoal/80 hover:text-gold'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Brand Logo Centered */}
            <Link href="/" className="group flex flex-col items-center text-center">
              <span className="font-serif-luxury text-2xl sm:text-3xl tracking-widest text-charcoal font-bold group-hover:text-forest transition-colors">
                ABBA
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-gold uppercase font-medium mt-[1px]">
                COLLECTIVE
              </span>
            </Link>

            {/* Desktop Navigation Right & Action Icons */}
            <div className="flex items-center space-x-6">
              <nav className="hidden lg:flex items-center space-x-8 mr-4">
                {navLinks.slice(3).map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-xs tracking-widest uppercase transition-colors relative py-1 ${
                        isActive ? 'text-forest font-semibold' : 'text-charcoal/80 hover:text-gold'
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavIndicator"
                          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Action Icons */}
              <div className="flex items-center space-x-4">
                <Link
                  href="/shop"
                  className="p-1.5 text-charcoal hover:text-gold transition-colors hidden sm:block"
                  title="Search Shop"
                >
                  <Search size={19} />
                </Link>

                <Link
                  href="/account"
                  className="p-1.5 text-charcoal hover:text-gold transition-colors"
                  title="Customer Account"
                >
                  <User size={19} />
                </Link>

                <button
                  onClick={toggleCart}
                  className="p-1.5 text-charcoal hover:text-gold transition-colors relative"
                  title="Shopping Bag"
                  aria-label="Toggle Shopping Bag"
                >
                  <ShoppingBag size={19} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold text-charcoal text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-ivory z-50 p-6 flex flex-col justify-between shadow-2xl lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between border-b border-charcoal/10 pb-4 mb-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl font-bold tracking-wider text-charcoal">
                      ABBA
                    </h2>
                    <p className="text-[9px] tracking-widest text-gold uppercase">COLLECTIVE</p>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-charcoal hover:text-gold"
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="flex flex-col space-y-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-sm tracking-widest uppercase transition-colors ${
                        pathname === link.href ? 'text-forest font-semibold' : 'text-charcoal/80 hover:text-gold'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-charcoal/10 flex flex-col space-y-4">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        toggleCart();
                      }}
                      className="text-xs tracking-widest uppercase text-charcoal hover:text-gold font-semibold flex items-center justify-between"
                    >
                      <span>Shopping Bag</span>
                      <span className="bg-gold text-charcoal text-[9px] px-2 py-0.5 font-bold rounded-full">
                        {totalItems}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-charcoal/10 text-center">
                <p className="text-[11px] font-serif italic text-charcoal/70 mb-2">
                  "Identity Received. Grace Revealed."
                </p>
                <p className="text-[10px] text-charcoal/50 uppercase tracking-widest">
                  Crafted for Kingdom Purpose
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
