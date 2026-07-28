'use client';

import React, { useState } from 'react';
import { MapPin, Check } from 'lucide-react';

export default function AddressForm({ initialAddress, onSave }) {
  const [firstName, setFirstName] = useState(initialAddress?.first_name || '');
  const [lastName, setLastName] = useState(initialAddress?.last_name || '');
  const [phone, setPhone] = useState(initialAddress?.phone || '');
  const [country, setCountry] = useState(initialAddress?.country || 'United States');
  const [city, setCity] = useState(initialAddress?.city || '');
  const [addressLine, setAddressLine] = useState(initialAddress?.address_line || '');
  const [postalCode, setPostalCode] = useState(initialAddress?.postal_code || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const addressData = {
      id: initialAddress?.id || 'addr_' + Date.now(),
      first_name: firstName,
      last_name: lastName,
      phone,
      country,
      city,
      address_line: addressLine,
      postal_code: postalCode,
    };
    if (onSave) onSave(addressData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-ivory-light border border-charcoal/10 p-6 rounded-sm">
      <div className="flex items-center gap-2 border-b border-charcoal/10 pb-3">
        <MapPin size={18} className="text-gold" />
        <h4 className="font-serif-luxury text-lg font-bold text-charcoal">
          Shipping Address
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
            First Name
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
            Last Name
          </label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 019-2831"
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
            Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Rwanda">Rwanda</option>
            <option value="South Africa">South Africa</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
          Street Address
        </label>
        <input
          type="text"
          required
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          placeholder="742 Evergreen Terrace, Suite 400"
          className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
            City
          </label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="New York"
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
            Postal Code / ZIP
          </label>
          <input
            type="text"
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="10001"
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-charcoal text-ivory hover:bg-forest transition-colors text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
        >
          <Check size={14} /> Save Address
        </button>
      </div>
    </form>
  );
}
