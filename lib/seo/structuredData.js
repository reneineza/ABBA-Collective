// ABBA Collective JSON-LD Structured Data Schema Generator for Google Search SEO

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ABBA Collective',
    url: 'https://abbacollective.com',
    logo: 'https://abbacollective.com/logo.png',
    description: 'A premium faith-driven lifestyle apparel house creating meaningful garments inspired by biblical identity.',
    slogan: 'Identity Received. Grace Revealed.',
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
      name: 'ABBA Collective',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://abbacollective.com/product/${product.slug}`,
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
      item: `https://abbacollective.com${item.url}`,
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
      name: 'ABBA Collective',
    },
    datePublished: post.date,
  };
}
