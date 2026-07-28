# ABBA Collective — Luxury Faith-Driven Lifestyle Apparel House

> *"Identity Received. Grace Revealed."*

ABBA Collective is a production-ready luxury faith-driven lifestyle e-commerce platform built with Next.js App Router, JavaScript, Tailwind CSS, Framer Motion, and Supabase.

---

## Brand Context & Identity

- **Brand Name**: ABBA Collective
- **Meaning**: *ABBA* represents the Fatherhood of God and the identity believers receive through adoption in Christ (Galatians 4:6, Romans 8:15). *Collective* represents a community gathered around a shared identity, purpose, and mission.
- **Brand Palette**:
  - Charcoal: `#1C1C1C`
  - Ivory / Cream: `#F5F2EB`
  - Forest Green: `#1E3F20`
  - Antique Gold: `#C4A661`
- **Primary Currency**: Rwandan Francs (RWF)

---

## Tech Stack

- **Frontend**: Next.js App Router (JavaScript), Tailwind CSS, Framer Motion, Lucide React
- **Backend & Auth**: Supabase PostgreSQL, Supabase Auth, Supabase Storage
- **Architecture**: Service abstraction for Payments (Stripe, Mobile Money, Cards), Transactional Email Notifications, Google Search JSON-LD Structured Data, and Product Recommendation Engine.

---

## Key Features

- **Shop Catalog & Garment Filters**: Filter by Category, Collection, Price sorting, and Real-time Search.
- **Product Storytelling Accordions**: Story, Details & Fit, and Biblical Scripture Anchor tabs.
- **Client Bag & Cart Drawer**: Slide-out cart drawer with local storage persistence and free shipping progress tracker.
- **Customer Auth & Portal**: Signup, Sign-in, Password Reset, Address Book, Order History, and Rewards Ledger.
- **Customer Reviews & Star Ratings**: Verified purchaser badges, star rating breakdowns, and submission forms.
- **Loyalty Rewards & Ambassador Program**: Kingdom points ledger (`/account/rewards`) and referral links (`/community/ambassadors`).
- **Internal Admin Operations Portal (`/admin/*`)**:
  - Executive Analytics Dashboard
  - Products & Variant Inventory Manager (Colors, Sizes, SKUs, Stock counts)
  - Collections & Category Taxonomies
  - Live Order Fulfillment & Tracking
  - Review Moderation Portal (`/admin/reviews`)
  - Campaign Marketing CMS (`/admin/marketing`)
  - Newsletter Roster CSV Exporter (`/admin/newsletter`)

---

## Getting Started

1. **Clone repository**:
   ```bash
   git clone https://github.com/reneineza/ABBA-Collective.git
   cd ABBA-Collective
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## License

Created for ABBA Collective. All rights reserved.
