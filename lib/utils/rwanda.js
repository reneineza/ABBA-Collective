// Rwanda-specific reference data and helpers: administrative divisions,
// mobile number validation, and business contact details.

// The 5 provinces and their 30 districts.
export const RWANDA_PROVINCES = [
  { name: 'Kigali City', districts: ['Gasabo', 'Kicukiro', 'Nyarugenge'] },
  { name: 'Northern Province', districts: ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'] },
  { name: 'Southern Province', districts: ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'] },
  { name: 'Eastern Province', districts: ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'] },
  { name: 'Western Province', districts: ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'] },
];

export function getProvinceForDistrict(district) {
  return RWANDA_PROVINCES.find((p) => p.districts.includes(district))?.name || '';
}

export function isKigaliDistrict(district) {
  return getProvinceForDistrict(district) === 'Kigali City';
}

// Mobile prefixes: MTN 078/079, Airtel 072/073.
const NETWORK_PREFIXES = {
  'MTN MoMo': ['78', '79'],
  'Airtel Money': ['72', '73'],
};

// Returns the 9-digit national number (7XXXXXXXX) or null if not a valid Rwandan mobile.
function toNationalNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  const national = digits.replace(/^(250|0)/, '');
  return /^7[2389]\d{7}$/.test(national) ? national : null;
}

export function isValidRwandaPhone(phone) {
  return toNationalNumber(phone) !== null;
}

// Formats as "+250 788 123 456"; returns the input unchanged if it isn't a Rwandan mobile.
export function formatRwandaPhone(phone) {
  const n = toNationalNumber(phone);
  return n ? `+250 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}` : phone;
}

export function isPhoneOnNetwork(phone, provider) {
  const n = toNationalNumber(phone);
  const prefixes = NETWORK_PREFIXES[provider];
  return Boolean(n && prefixes && prefixes.includes(n.slice(0, 2)));
}

export const BUSINESS_CONTACT = {
  phone: '+250 789 284 564',
  phoneHref: 'tel:+250789284564',
  whatsappHref: 'https://wa.me/250789284564',
  email: 'info@abbacollective.com',
  city: 'Kigali',
  country: 'Rwanda',
};
