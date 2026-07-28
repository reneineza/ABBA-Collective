'use client';

import React from 'react';
import Link from 'next/link';

export default function Button({
  children,
  href,
  variant = 'primary', // 'primary', 'secondary', 'gold-outline', 'ghost', 'dark'
  size = 'md', // 'sm', 'md', 'lg'
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 tracking-widest uppercase text-xs focus:outline-none';

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-7 py-3.5 text-xs',
    lg: 'px-10 py-4 text-xs tracking-luxurious',
  };

  const variants = {
    primary: 'bg-charcoal text-ivory hover:bg-forest hover:shadow-lg border border-charcoal hover:border-forest',
    secondary: 'bg-ivory text-charcoal border border-charcoal/20 hover:border-charcoal hover:bg-ivory-light',
    'gold-outline': 'bg-transparent text-gold border border-gold hover:bg-gold hover:text-charcoal shadow-subtle',
    dark: 'bg-forest text-ivory hover:bg-forest-dark border border-forest',
    ghost: 'bg-transparent text-charcoal hover:text-gold hover:bg-charcoal/5',
  };

  const combinedClasses = `${baseStyles} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
}
