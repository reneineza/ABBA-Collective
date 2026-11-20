// Public URL of the site, used for SEO metadata, structured data and share links.
// Set NEXT_PUBLIC_SITE_URL once a custom domain is live; until then Vercel's
// production URL is used (provided automatically on Vercel deployments).
const vercelUrl =
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000')
).replace(/\/$/, '');
