// Safe JSON Parser helper to prevent runtime localStorage syntax errors

export function safeJsonParse(jsonString, fallback = null) {
  if (!jsonString || typeof jsonString !== 'string' || jsonString === 'undefined' || jsonString === 'null') {
    return fallback;
  }
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.warn('[safeJsonParse] Invalid JSON encountered, returning fallback:', err.message);
    return fallback;
  }
}
