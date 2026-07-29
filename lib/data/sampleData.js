// ABBA Collective Sample E-Commerce Dataset (Milestone 2)

export const SAMPLE_COLLECTIONS = [
  {
    id: "col-001",
    name: "Collection 001: ADOPTION",
    slug: "adoption",
    description: "Tailored heavy-weight organic cotton pieces crafted around the profound truth of Galatians 4:6 and Romans 8:15.",
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    created_at: "2026-07-28T00:00:00Z"
  },
  {
    id: "col-002",
    name: "Collection 002: GRACE REVEALED",
    slug: "grace-revealed",
    description: "Minimalist outerwear and unstructured tailoring with subtle embroidered scripture references.",
    image_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
    created_at: "2026-07-28T00:00:00Z"
  },
  {
    id: "col-003",
    name: "Collection 003: SOVEREIGN ESSENTIALS",
    slug: "sovereign-essentials",
    description: "Elevated foundational wardrobe staples built for endurance, mindfulness, and everyday quiet elegance.",
    image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop",
    created_at: "2026-07-28T00:00:00Z"
  }
];

export const SAMPLE_CATEGORIES = [
  { id: "cat-1", name: "Outerwear", slug: "outerwear" },
  { id: "cat-2", name: "Tops & Tees", slug: "tops-tees" },
  { id: "cat-3", name: "Knitwear & Hoodies", slug: "knitwear-hoodies" },
  { id: "cat-4", name: "Trousers", slug: "trousers" },
];

export const SAMPLE_PRODUCTS = [
  {
    id: "prod-1",
    name: "ABBA Signature Tee",
    slug: "abba-signature-tee",
    category_id: "cat-2",
    category: "Tops & Tees",
    collection_id: "col-001",
    collection: "Collection 001: ADOPTION",
    price: 45000,
    featured: true,
    tagline: "Identity received, not achieved.",
    description: "280 GSM Supima organic cotton t-shirt featuring a relaxed drop-shoulder silhouette, blind-stitched hem, and discreetly embroidered 'Galatians 4:6' on the inner neck tape.",
    story: "Identity is never constructed through human performance, social status, or striving; it is received as a sovereign gift through divine adoption in Christ.",
    details: "100% Organic Supima Cotton. 280 GSM heavy jersey weight. Custom milled in Portugal. Pre-shrunk with organic enzyme wash for ultra-soft hand-feel.",
    reflection: "Galatians 4:6 — 'And because you are sons, God has sent the Spirit of his Son into our hearts, crying, ABBA! Father!'",
    colors: ["Charcoal", "Ivory", "Forest Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      { id: "img-1", image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop", alt_text: "ABBA Signature Tee - Front View" },
      { id: "img-2", image_url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop", alt_text: "ABBA Signature Tee - Back View" },
      { id: "img-3", image_url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop", alt_text: "ABBA Signature Tee - Detail View" },
    ],
    variants: [
      { id: "v-1", color: "Charcoal", size: "S", sku: "AST-CHR-S", stock_quantity: 15 },
      { id: "v-2", color: "Charcoal", size: "M", sku: "AST-CHR-M", stock_quantity: 24 },
      { id: "v-3", color: "Charcoal", size: "L", sku: "AST-CHR-L", stock_quantity: 18 },
      { id: "v-4", color: "Charcoal", size: "XL", sku: "AST-CHR-XL", stock_quantity: 10 },
      { id: "v-5", color: "Ivory", size: "S", sku: "AST-IVR-S", stock_quantity: 12 },
      { id: "v-6", color: "Ivory", size: "M", sku: "AST-IVR-M", stock_quantity: 20 },
      { id: "v-7", color: "Ivory", size: "L", sku: "AST-IVR-L", stock_quantity: 14 },
      { id: "v-8", color: "Forest Green", size: "M", sku: "AST-FST-M", stock_quantity: 8 },
    ]
  },
  {
    id: "prod-2",
    name: "Adoption Hoodie",
    slug: "adoption-hoodie",
    category_id: "cat-3",
    category: "Knitwear & Hoodies",
    collection_id: "col-001",
    collection: "Collection 001: ADOPTION",
    price: 85000,
    featured: true,
    tagline: "A reminder of belonging to the Father's family.",
    description: "480 GSM organic french terry hoodie featuring double-layered hood, custom gold aglets, and discreetly embroidered 'Romans 8:15' on the inner left cuff.",
    story: "Conceived as a tactile armor of divine security. When you wear the Adoption Hoodie, you are enveloped in the warmth and posture of royal sonship.",
    details: "100% Organic French Terry Cotton. 480 GSM heavyweight fleece. Double-needle stitch construction. Custom solid brass antique gold aglets.",
    reflection: "Romans 8:15 — 'For you did not receive the spirit of slavery to fall back into fear, but you have received the Spirit of adoption by whom we cry, ABBA! Father!'",
    colors: ["Charcoal", "Ivory", "Forest Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      { id: "img-4", image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop", alt_text: "Adoption Hoodie - Front View" },
      { id: "img-5", image_url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop", alt_text: "Adoption Hoodie - Side View" },
      { id: "img-6", image_url: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop", alt_text: "Adoption Hoodie - Detail View" },
    ],
    variants: [
      { id: "v-9", color: "Charcoal", size: "S", sku: "ADH-CHR-S", stock_quantity: 10 },
      { id: "v-10", color: "Charcoal", size: "M", sku: "ADH-CHR-M", stock_quantity: 20 },
      { id: "v-11", color: "Charcoal", size: "L", sku: "ADH-CHR-L", stock_quantity: 16 },
      { id: "v-12", color: "Ivory", size: "M", sku: "ADH-IVR-M", stock_quantity: 15 },
      { id: "v-13", color: "Forest Green", size: "L", sku: "ADH-FST-L", stock_quantity: 9 },
    ]
  },
  {
    id: "prod-3",
    name: "Grace Crewneck",
    slug: "grace-crewneck",
    category_id: "cat-3",
    category: "Knitwear & Hoodies",
    collection_id: "col-001",
    collection: "Collection 001: ADOPTION",
    price: 65000,
    featured: true,
    tagline: "Salvation is received through grace.",
    description: "400 GSM brushed fleece cotton crewneck sweatshirt with relaxed shoulders, custom tonal chest embroidery, and thick ribbed collar.",
    story: "Crafted around the foundational gospel doctrine of unearned, unmerited favor. Grace is not just a concept; it is the atmosphere of the Kingdom.",
    details: "100% Ring-spun Organic Cotton. 400 GSM brushed fleece interior. Ribbed cuffs, neckline, and waistband with shape-retention memory knit.",
    reflection: "Ephesians 2:8 — 'For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works.'",
    colors: ["Ivory", "Charcoal", "Sage Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      { id: "img-7", image_url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop", alt_text: "Grace Crewneck - Front View" },
      { id: "img-8", image_url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop", alt_text: "Grace Crewneck - Lifestyle" },
    ],
    variants: [
      { id: "v-14", color: "Ivory", size: "S", sku: "GRC-IVR-S", stock_quantity: 14 },
      { id: "v-15", color: "Ivory", size: "M", sku: "GRC-IVR-M", stock_quantity: 22 },
      { id: "v-16", color: "Charcoal", size: "L", sku: "GRC-CHR-L", stock_quantity: 18 },
    ]
  },
  {
    id: "prod-4",
    name: "Covenant Tailored Overcoat",
    slug: "covenant-tailored-overcoat",
    category_id: "cat-1",
    category: "Outerwear",
    collection_id: "col-002",
    collection: "Collection 002: GRACE REVEALED",
    price: 180000,
    featured: false,
    tagline: "Sheltered under the covering of the covenant.",
    description: "Double-breasted virgin wool blend coat with genuine horn buttons, peaked lapels, and silk lining debossed with covenant cross motifs.",
    story: "Designed for posture, presence, and quiet dignity. Represents the unyielding shelter of God's covenant love.",
    details: "80% Virgin Wool, 20% Cashmere Blend. Fully lined in silk cupro. Double horn closure. Tailored fit in Italy.",
    reflection: "Isaiah 54:10 — 'My steadfast love shall not depart from you, and my covenant of peace shall not be removed, says the Lord.'",
    colors: ["Deep Charcoal", "Warm Ivory"],
    sizes: ["M", "L", "XL"],
    images: [
      { id: "img-9", image_url: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000&auto=format&fit=crop", alt_text: "Covenant Tailored Overcoat - Front" },
      { id: "img-10", image_url: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop", alt_text: "Covenant Tailored Overcoat - Back" },
    ],
    variants: [
      { id: "v-17", color: "Deep Charcoal", size: "M", sku: "CTO-CHR-M", stock_quantity: 6 },
      { id: "v-18", color: "Deep Charcoal", size: "L", sku: "CTO-CHR-L", stock_quantity: 8 },
    ]
  }
];

export const SAMPLE_BLOG_POSTS = [
  {
    id: "blog-1",
    title: "Understanding Sonship: Beyond Performance and Approval",
    slug: "understanding-sonship-beyond-performance",
    category: "Theological Identity",
    readTime: "6 min read",
    date: "July 24, 2026",
    author: "ABBA Collective Editorial Team",
    excerpt: "True identity is never earned; it is received. Exploring the spiritual revolution of Galatians 4:6 and how sonship transforms our creative calling.",
    image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    scripture: "Galatians 4:6 — 'And because you are sons, God has sent the Spirit of his Son into our hearts, crying, ABBA! Father!'",
    content: [
      "In a culture obsessed with performance, personal branding, and endless self-validation, the human soul is constantly enticed to measure worth by productivity. We build identities out of achievements, wardrobe aesthetics, and social approval, only to find that striving yields an anxious posture.",
      "The gospel of divine adoption introduces an entirely opposite paradigm: identity is not achieved through human striving; it is sovereignly received. When Paul writes in Galatians 4:6 that God has sent the Spirit of His Son into our hearts crying 'ABBA! Father!', he highlights a structural shift in our spiritual reality. We move from the posture of an orphan performing for acceptance to a beloved child standing in secure inheritance.",
      "At ABBA Collective, this revelation is at the heart of everything we craft. Our apparel is designed not as a mask to impress the world, but as a subtle daily reminder of the security already secured for us in Christ. When your posture shifts from slave to son or daughter, rest replaces anxiety, and stewardship replaces striving."
    ]
  },
  {
    id: "blog-2",
    title: "The Architecture of Grace: Why Craftsmanship Matters",
    slug: "architecture-of-grace-craftsmanship-matters",
    category: "Design Journal",
    readTime: "4 min read",
    date: "July 12, 2026",
    author: "ABBA Design Studio",
    excerpt: "Excellence is not vanity; it is an echo of divine creation. Behind the scenes of our 480 GSM custom milling process in Portugal.",
    image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
    scripture: "Colossians 3:23 — 'Whatever you do, work heartily, as for the Lord and not for men.'",
    content: [
      "Why invest in 480 GSM organic french terry, double-needle reinforced stitching, and custom brass aglets for streetwear? For ABBA Collective, craftsmanship is not about luxury ostentation; it is an act of theological worship and creative stewardship.",
      "When God called craftsmen in Exodus like Bezalel, He filled them with the Spirit of wisdom and artistic craftsmanship to build the Tabernacle. Divine order and beauty reflect the God who speaks light out of darkness and forms all things with infinite precision.",
      "Every piece in our collections is milled custom in Portugal using 100% organic Supima and heavy jersey cottons. We believe that garments designed to honor God's word should endure both in material structure and timeless design."
    ]
  }
];

