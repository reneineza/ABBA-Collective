'use client';

import React, { useState } from 'react';
import { MapPin, Check, Navigation, Loader2 } from 'lucide-react';

const FAMOUS_KIGALI_LOCATIONS = [
  { name: 'Kigali Heights (KG 7 Ave, Kimihurura)', city: 'Kigali' },
  { name: 'Kigali Convention Centre / Radisson (Kimihurura)', city: 'Kigali' },
  { name: 'Kiyovu / Downtown UTC Shopping Mall', city: 'Kigali' },
  { name: 'Nyarutarama (Near Kigali Golf Club)', city: 'Kigali' },
  { name: 'Kacyiru (Near US Embassy & Ministries)', city: 'Kigali' },
  { name: 'Remera (Giporoso / Prince House Roundabout)', city: 'Kigali' },
  { name: 'Kimironko (Near Kimironko Market & Bus Park)', city: 'Kigali' },
  { name: 'Gisozi (Near ULK & Kigali Genocide Memorial)', city: 'Kigali' },
  { name: 'Kicukiro Centre & Sonatubes Junction', city: 'Kigali' },
  { name: 'Vision City Estate (Gacuriro)', city: 'Kigali' },
  { name: 'Kagugu (Near Green Hills Academy)', city: 'Kigali' },
  { name: 'Kanombe (Near Kigali International Airport)', city: 'Kigali' },
  { name: 'Gikondo (Expo Ground Area)', city: 'Kigali' },
  { name: 'Nyamirambo (Biryogo Car Free Zone)', city: 'Kigali' },
  { name: 'Rebero (Near Canal Olympia / Cultural Village)', city: 'Kigali' },
  { name: 'Musanze Town Centre (Northern Province)', city: 'Musanze' },
  { name: 'Rubavu / Gisenyi Beach Area (Western Province)', city: 'Rubavu' },
  { name: 'Huye / Butare University Area (Southern Province)', city: 'Huye' },
];

export default function AddressForm({ initialAddress, onSave }) {
  const [firstName, setFirstName] = useState(initialAddress?.first_name || '');
  const [lastName, setLastName] = useState(initialAddress?.last_name || '');
  const [phone, setPhone] = useState(initialAddress?.phone || '');
  const [country, setCountry] = useState(initialAddress?.country || 'Rwanda');
  const [city, setCity] = useState(initialAddress?.city || 'Kigali');
  const [addressLine, setAddressLine] = useState(initialAddress?.address_line || '');
  const [postalCode, setPostalCode] = useState(initialAddress?.postal_code || '');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Detecting your GPS location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setAddressLine(`GPS Location: Lat ${latitude.toFixed(4)}, Long ${longitude.toFixed(4)}`);
        setCity('Kigali');
        setCountry('Rwanda');
        setIsLocating(false);
        setLocationStatus('✓ Current GPS location detected!');
        setTimeout(() => setLocationStatus(''), 4000);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('Location access denied. Please type your street address or choose a landmark.');
        } else {
          setLocationStatus('Could not retrieve location. Please choose a landmark below.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectLandmark = (e) => {
    const selectedName = e.target.value;
    if (!selectedName) return;
    const landmark = FAMOUS_KIGALI_LOCATIONS.find((loc) => loc.name === selectedName);
    if (landmark) {
      setAddressLine(landmark.name);
      setCity(landmark.city);
    }
  };

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
    <form onSubmit={handleSubmit} className="space-y-5 bg-ivory-light border border-charcoal/10 p-6 sm:p-8 rounded-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-charcoal/10 pb-4 gap-3">
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-gold" />
          <h4 className="font-serif-luxury text-xl font-bold text-charcoal">
            Shipping Address
          </h4>
        </div>

        {/* GPS Current Location Button */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="px-3.5 py-2 bg-gold/10 text-forest border border-gold/40 hover:bg-gold hover:text-charcoal transition-all text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          {isLocating ? (
            <>
              <Loader2 size={14} className="animate-spin text-gold" /> Detecting GPS...
            </>
          ) : (
            <>
              <Navigation size={14} /> Use My Current Location
            </>
          )}
        </button>
      </div>

      {locationStatus && (
        <p className={`text-xs font-medium ${locationStatus.startsWith('✓') ? 'text-forest' : 'text-amber-700'}`}>
          {locationStatus}
        </p>
      )}

      {/* Preset Famous Kigali Locations Dropdown */}
      <div className="bg-ivory p-3.5 border border-gold/30 rounded-sm space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-gold font-bold block">
          ✦ Quick Pick: Famous Kigali Landmark or Area
        </label>
        <select
          onChange={handleSelectLandmark}
          defaultValue=""
          className="w-full p-2.5 text-xs bg-ivory-light border border-charcoal/20 focus:border-forest focus:outline-none text-charcoal font-medium"
        >
          <option value="" disabled>-- Select a famous Kigali landmark or neighborhood --</option>
          {FAMOUS_KIGALI_LOCATIONS.map((loc, idx) => (
            <option key={idx} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
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
            placeholder="Jean"
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
            placeholder="Mugisha"
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
            placeholder="+250 788 123 456"
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
            Country / Region
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none font-medium text-charcoal"
          >
            <option value="Rwanda">Rwanda</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Kenya">Kenya</option>
            <option value="Uganda">Uganda</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
          Street Address / Landmark
        </label>
        <input
          type="text"
          required
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          placeholder="e.g., KG 7 Ave, Kigali Heights or House #12"
          className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
            City / Neighborhood
          </label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Kigali"
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
            Postal Code / Landmark Note
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Optional (e.g. Near Kimironko Market)"
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-forest focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-charcoal text-ivory hover:bg-forest transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2 rounded-sm shadow-sm"
        >
          <Check size={16} /> Save Address
        </button>
      </div>
    </form>
  );
}

