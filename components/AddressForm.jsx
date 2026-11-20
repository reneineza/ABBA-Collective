'use client';

import React, { useState } from 'react';
import { MapPin, Check, Navigation, Loader2 } from 'lucide-react';
import {
  RWANDA_PROVINCES,
  getProvinceForDistrict,
  isValidRwandaPhone,
  formatRwandaPhone,
} from '@/lib/utils/rwanda';

const FAMOUS_LANDMARKS = [
  { name: 'Kigali Heights (KG 7 Ave, Kimihurura)', district: 'Gasabo' },
  { name: 'Kigali Convention Centre / Radisson (Kimihurura)', district: 'Gasabo' },
  { name: 'Kiyovu / Downtown UTC Shopping Mall', district: 'Nyarugenge' },
  { name: 'Nyarutarama (Near Kigali Golf Club)', district: 'Gasabo' },
  { name: 'Kacyiru (Near US Embassy & Ministries)', district: 'Gasabo' },
  { name: 'Remera (Giporoso / Prince House Roundabout)', district: 'Gasabo' },
  { name: 'Kimironko (Near Kimironko Market & Bus Park)', district: 'Gasabo' },
  { name: 'Gisozi (Near ULK & Kigali Genocide Memorial)', district: 'Gasabo' },
  { name: 'Kicukiro Centre & Sonatubes Junction', district: 'Kicukiro' },
  { name: 'Vision City Estate (Gacuriro)', district: 'Gasabo' },
  { name: 'Kagugu (Near Green Hills Academy)', district: 'Gasabo' },
  { name: 'Kanombe (Near Kigali International Airport)', district: 'Kicukiro' },
  { name: 'Gikondo (Expo Ground Area)', district: 'Kicukiro' },
  { name: 'Nyamirambo (Biryogo Car Free Zone)', district: 'Nyarugenge' },
  { name: 'Rebero (Near Canal Olympia / Cultural Village)', district: 'Kicukiro' },
  { name: 'Musanze Town Centre', district: 'Musanze' },
  { name: 'Rubavu / Gisenyi Beach Area', district: 'Rubavu' },
  { name: 'Huye / Butare University Area', district: 'Huye' },
];

// Older saved addresses stored the district (or "Kigali") in `city`.
function initialDistrict(address) {
  if (address?.district) return address.district;
  return getProvinceForDistrict(address?.city) ? address.city : '';
}

export default function AddressForm({ initialAddress, onSave }) {
  const startDistrict = initialDistrict(initialAddress);
  const [firstName, setFirstName] = useState(initialAddress?.first_name || '');
  const [lastName, setLastName] = useState(initialAddress?.last_name || '');
  const [phone, setPhone] = useState(initialAddress?.phone || '');
  const [province, setProvince] = useState(getProvinceForDistrict(startDistrict) || 'Kigali City');
  const [district, setDistrict] = useState(startDistrict);
  const [addressLine, setAddressLine] = useState(initialAddress?.address_line || '');
  const [landmark, setLandmark] = useState(initialAddress?.landmark || initialAddress?.postal_code || '');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const provinceDistricts = RWANDA_PROVINCES.find((p) => p.name === province)?.districts || [];

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
        setIsLocating(false);
        setLocationStatus('✓ Current GPS location detected! Please confirm your district below.');
        setTimeout(() => setLocationStatus(''), 6000);
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
    const landmarkEntry = FAMOUS_LANDMARKS.find((loc) => loc.name === e.target.value);
    if (landmarkEntry) {
      setAddressLine(landmarkEntry.name);
      setProvince(getProvinceForDistrict(landmarkEntry.district));
      setDistrict(landmarkEntry.district);
    }
  };

  const handleProvinceChange = (e) => {
    setProvince(e.target.value);
    setDistrict('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidRwandaPhone(phone)) {
      setPhoneError('Enter a Rwandan mobile number, e.g. 078 812 3456');
      return;
    }
    const addressData = {
      id: initialAddress?.id || 'addr_' + Date.now(),
      first_name: firstName,
      last_name: lastName,
      phone: formatRwandaPhone(phone),
      country: 'Rwanda',
      province,
      district,
      city: district,
      address_line: addressLine,
      landmark,
    };
    if (onSave) onSave(addressData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-ivory-light border border-charcoal/10 p-6 sm:p-8 rounded-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-charcoal/10 pb-4 gap-3">
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-gold" />
          <h4 className="font-serif-luxury text-xl font-bold text-charcoal">
            Delivery Address
          </h4>
        </div>

        {/* GPS Current Location Button */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="px-3.5 py-2 bg-gold/10 text-olive border border-gold/40 hover:bg-gold hover:text-charcoal transition-all text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 self-start sm:self-auto"
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
        <p className={`text-xs font-medium ${locationStatus.startsWith('✓') ? 'text-olive' : 'text-amber-700'}`}>
          {locationStatus}
        </p>
      )}

      {/* Preset Famous Landmarks Dropdown */}
      <div className="bg-ivory p-3.5 border border-gold/30 rounded-sm space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-gold font-bold block">
          ✦ Quick Pick: Famous Landmark or Area
        </label>
        <select
          onChange={handleSelectLandmark}
          defaultValue=""
          className="w-full p-2.5 text-xs bg-ivory-light border border-charcoal/20 focus:border-olive focus:outline-none text-charcoal font-medium"
        >
          <option value="" disabled>-- Select a famous landmark or neighbourhood --</option>
          {FAMOUS_LANDMARKS.map((loc) => (
            <option key={loc.name} value={loc.name}>
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
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-olive focus:outline-none"
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
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-olive focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
          Phone Number (for the delivery rider)
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setPhoneError('');
          }}
          placeholder="078 812 3456"
          className={`w-full p-3 text-xs bg-ivory border focus:outline-none ${phoneError ? 'border-red-500' : 'border-charcoal/20 focus:border-olive'}`}
        />
        {phoneError && <p className="text-[11px] text-red-600 mt-1">{phoneError}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
            Province
          </label>
          <select
            value={province}
            onChange={handleProvinceChange}
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-olive focus:outline-none font-medium text-charcoal"
          >
            {RWANDA_PROVINCES.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
            District
          </label>
          <select
            required
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-olive focus:outline-none font-medium text-charcoal"
          >
            <option value="" disabled>-- Select district --</option>
            {provinceDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
          Street Address, Sector & Neighbourhood
        </label>
        <input
          type="text"
          required
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          placeholder="e.g., KG 7 Ave, House #12, Kimihurura"
          className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-olive focus:outline-none"
        />
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-charcoal font-semibold block mb-1">
          Directions for the Rider (Optional)
        </label>
        <input
          type="text"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          placeholder="e.g., Blue gate opposite Simba Supermarket"
          className="w-full p-3 text-xs bg-ivory border border-charcoal/20 focus:border-olive focus:outline-none"
        />
      </div>

      <p className="text-[11px] text-charcoal/60">
        We currently deliver within Rwanda only.
      </p>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-charcoal text-ivory hover:bg-olive transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2 rounded-sm shadow-sm"
        >
          <Check size={16} /> Save Address
        </button>
      </div>
    </form>
  );
}
