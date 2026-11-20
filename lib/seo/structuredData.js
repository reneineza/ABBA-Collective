// ABBA JSON-LD Structured Data Schema Generator for Google Search SEO

import { SITE_URL } from '@/lib/config/site';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ABBA',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/abba-logo.png`,
    description: 'A premium faith-driven lifestyle apparel house creating meaningful garments inspired by biblical identity.',
    slogan: 'Identity Received. Grace Revealed.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kigali',
      addressCountry: 'RW',
    },
    areaServed: { '@type': 'Country', name: 'Rwanda' },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+250789284564',
      email: 'info@abbacollective.com',
      contactType: 'customer service',
      areaServed: 'RW',
      availableLanguage: ['English', 'Kinyarwanda', 'French'],
    },
    sameAs: [
      'https://instagram.com/abbacollective',
      'https://pinterest.com/abbacollective',
    ],
  };
}

export function getProductSchema(product) {
  if (!product) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images ? product.images.map((i) => i.image_url) : [product.image_url],
    sku: product.variants ? product.variants[0]?.sku : product.id,
    brand: {
      '@type': 'Brand',
      name: 'ABBA',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'RWF',
      availability: 'https://schema.org/InStock',
      eligibleRegion: { '@type': 'Country', name: 'Rwanda' },
      url: `${SITE_URL}/product/${product.slug}`,
    },
  };
}

export function getBreadcrumbSchema(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function getArticleSchema(post) {
  if (!post) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image_url,
    publisher: {
      '@type': 'Organization',
      name: 'ABBA',
    },
    datePublished: post.date,
  };
}
