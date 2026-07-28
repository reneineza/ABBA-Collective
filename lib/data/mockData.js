// ABBA Collective Mock Data for Shop, Collections & Devotionals

export const MOCK_COLLECTIONS = [
  {
    id: "col-1",
    name: "The Adoption Era",
    slug: "adoption-era",
    tagline: "Sonship & Daughterhood",
    description: "Tailored heavy-weight organic cotton pieces crafted around the profound truth of Galatians 4:6.",
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    itemCount: "8 Items"
  },
  {
    id: "col-2",
    name: "Grace Revealed",
    slug: "grace-revealed",
    tagline: "Unmerited Distinction",
    description: "Minimalist outerwear and unstructured tailoring with subtle embroidered scripture references.",
    image_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
    itemCount: "6 Items"
  },
  {
    id: "col-3",
    name: "Sovereign Essentials",
    slug: "sovereign-essentials",
    tagline: "Daily Identity",
    description: "Elevated foundational basics built for endurance, mindfulness, and everyday quiet elegance.",
    image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop",
    itemCount: "12 Items"
  }
];

export const MOCK_PRODUCTS = [
  {
    id: "prod-1",
    name: "Abba Heir Heavyweight Hoodie",
    slug: "abba-heir-heavyweight-hoodie",
    category: "Outerwear",
    collection: "The Adoption Era",
    price: 185.00,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    hover_image_url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop",
    description: "480 GSM organic french terry hoodie featuring blind-stitched hems, custom gold aglets, and discreetly embroidered 'Romans 8:15' on the inner left cuff.",
    story: "Conceived as a armor of remembrance. When you put on the Abba Heir Hoodie, you are reminded that you do not bear a spirit of slavery to fall back into fear, but the Spirit of adoption by whom we cry, 'Abba! Father!'",
    badge: "Bestseller",
    colors: ["Charcoal", "Ivory", "Forest Green"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "prod-2",
    name: "Covenant Tailored Overcoat",
    slug: "covenant-tailored-overcoat",
    category: "Coats",
    collection: "Grace Revealed",
    price: 420.00,
    rating: 5.0,
    image_url: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop",
    hover_image_url: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800&auto=format&fit=crop",
    description: "Structured double-breasted virgin wool blend coat with horn buttons and silk lining debossed with covenant cross motifs.",
    story: "Designed for moments of presence and dignity. The Covenant Overcoat embodies the covering of grace that shelters and upholds.",
    badge: "Limited Edition",
    colors: ["Deep Charcoal", "Warm Ivory"],
    sizes: ["38R", "40R", "42R", "44R"]
  },
  {
    id: "prod-3",
    name: "Sacred Identity Crewneck Tee",
    slug: "sacred-identity-crewneck-tee",
    category: "Essentials",
    collection: "Sovereign Essentials",
    price: 85.00,
    rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    hover_image_url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
    description: "280 GSM Supima cotton t-shirt with drop-shoulder fit, tonal chest embroidery, and hand-finished neckline.",
    story: "Simple, effortless perfection. Created to be worn close to your chest—a tactile reminder of who you are before performance or striving.",
    badge: "Core Collection",
    colors: ["Ivory", "Charcoal", "Sage Green"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "prod-4",
    name: "Redeemed Pleated Trousers",
    slug: "redeemed-pleated-trousers",
    category: "Trousers",
    collection: "Grace Revealed",
    price: 245.00,
    rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop",
    hover_image_url: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=800&auto=format&fit=crop",
    description: "High-waisted relaxed trousers cut from Italian wool-linen drape with double front pleats and antique brass side adjusters.",
    story: "Graceful movement meets sharp architectural lines. Crafted for posture, poise, and purpose.",
    badge: "New Arrival",
    colors: ["Charcoal", "Khaki Ivory"],
    sizes: ["30", "32", "34", "36"]
  }
];

export const MOCK_BLOG_POSTS = [
  {
    id: "blog-1",
    title: "Understanding Sonship: Beyond Performance and Approval",
    slug: "understanding-sonship-beyond-performance",
    category: "Theological Identity",
    readTime: "6 min read",
    date: "July 24, 2026",
    excerpt: "True identity is never earned; it is received. Exploring the spiritual revolution of Galatians 4:6 and how sonship transforms our creative calling.",
    image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "blog-2",
    title: "The Architecture of Grace: Why Craftsmanship Matters",
    slug: "architecture-of-grace-craftsmanship-matters",
    category: "Design Journal",
    readTime: "4 min read",
    date: "July 12, 2026",
    excerpt: "Excellence is not vanity; it is an echo of divine creation. Behind the scenes of our 480 GSM custom milling process in Portugal.",
    image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
  }
];
