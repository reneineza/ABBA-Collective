// Delivery pricing for orders within Rwanda (amounts in RWF).
import { isKigaliDistrict } from './rwanda';

export const FREE_DELIVERY_THRESHOLD = 200000;

export const DELIVERY_ZONES = {
  kigali: { label: 'Kigali City', fee: 2000, timeline: 'Same or next day' },
  provinces: { label: 'Other provinces', fee: 5000, timeline: '1 – 3 business days' },
};

export function getDeliveryZone(district) {
  return isKigaliDistrict(district) ? DELIVERY_ZONES.kigali : DELIVERY_ZONES.provinces;
}

export function getDeliveryFee(subtotal, district) {
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return getDeliveryZone(district).fee;
}
