// Centralized Currency Utility for ABBA Collective
// Primary Currency: Rwandan Francs (RWF)

export const CURRENCY_CODE = 'RWF';
export const EXCHANGE_RATE = 1350; // 1 USD = 1,350 RWF conversion rate

export function formatCurrency(amount, isAlreadyRwf = false) {
  const numeric = Number(amount || 0);
  const rwfValue = isAlreadyRwf ? Math.round(numeric) : Math.round(numeric * EXCHANGE_RATE);
  return `${rwfValue.toLocaleString('en-US')} RWF`;
}

export function formatPrice(amount, isAlreadyRwf = false) {
  return formatCurrency(amount, isAlreadyRwf);
}
