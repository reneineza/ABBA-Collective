# ABBA — Luxury Faith-Driven Lifestyle Apparel House

> *"Identity Received. Grace Revealed."*

ABBA is a production-ready luxury faith-driven lifestyle e-commerce platform built with Next.js App Router, JavaScript, Tailwind CSS, Framer Motion, and Supabase.

---

## Brand Context & Identity

- **Brand Name**: ABBA
- **Meaning**: *ABBA* represents the Fatherhood of God and the identity believers receive through adoption in Christ (Galatians 4:6, Romans 8:15).
- **Brand Palette**:
  - Charcoal: `#1C1C1C`
  - Olive: `#3B3418`
  - Ivory / Cream: `#F4EEE6`
  - Gold: `#BFA355`
- **Brand Assets**: logo, icon and pattern tiles in `public/brand/`; use `components/BrandLogo.jsx` for the logo
- **Typography**: Cormorant Garamond (headings), Inter (body)

---

## Market: Rwanda

- **Currency**: Rwandan Francs (RWF)
- **Delivery**: Rwanda only, priced by zone (Kigali City vs. other provinces) in `lib/utils/delivery.js`
- **Addresses**: Province → District (all 30 districts) plus rider directions, in `lib/utils/rwanda.js`
- **Payments**: MTN MoMo, Airtel Money, Visa / Mastercard (`lib/payments/paymentService.js` holds demo stubs to connect to a live gateway)
- **Phone numbers**: validated as Rwandan mobiles (MTN 078/079, Airtel 072/073)
- **Dates**: day-month-year in Kigali time (`lib/utils/formatDate.js`)

---

## Tech Stack

- **Frontend**: Next.js App Router (JavaScript), Tailwind CSS, Framer Motion, Lucide React
- **Backend & Auth**: Supabase PostgreSQL, Supabase Auth, Supabase Storage
- **Architecture**: Service abstraction for Payments (MTN MoMo, Airtel Money, Cards), Transactional Email Notifications, Google Search JSON-LD Structured Data, and Product Recommendation Engine.

---

## Key Features

- **Shop & Garment Filters**: Filter by Category, Collection, Price sorting, and Real-time Search.
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

Created for ABBA. All rights reserved.
