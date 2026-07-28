// Centralized Currency Utility for ABBA Collective
// Primary Currency: Rwandan Francs (RWF)

export const CURRENCY_CODE = 'RWF';

export function formatCurrency(amount) {
  const numeric = Math.round(Number(amount || 0));
  return `${numeric.toLocaleString('en-US')} RWF`;
}

export function formatPrice(amount) {
  return formatCurrency(amount);
}

