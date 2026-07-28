'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function BrandDropdown({ options, value, onChange, placeholder = 'Select Option' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left w-full sm:w-auto" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto py-2.5 px-4 text-xs bg-ivory border border-charcoal/20 hover:border-gold focus:border-forest focus:outline-none uppercase tracking-widest text-charcoal font-semibold rounded-sm flex items-center justify-between gap-3 shadow-sm transition-all"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={14} className={`text-gold transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-full sm:w-64 bg-charcoal text-ivory border border-gold/30 rounded-sm shadow-card z-50 overflow-hidden divide-y divide-gold/10">
          <div className="py-1">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-forest text-gold border-l-2 border-gold'
                      : 'text-ivory/80 hover:bg-forest/50 hover:text-gold'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span className="text-gold text-[10px]">✦</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
