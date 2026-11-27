import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/lib/context/CartContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import { WishlistProvider } from '@/lib/context/WishlistContext';
import { CatalogProvider } from '@/lib/context/CatalogContext';
import { getOrganizationSchema } from '@/lib/seo/structuredData';
import { SITE_URL } from '@/lib/config/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'ABBA | Identity Received. Grace Revealed.',
  description: 'A premium faith-driven lifestyle apparel house based in Kigali, Rwanda, creating meaningful garments inspired by biblical identity. Delivery across Rwanda; pay with MTN MoMo, Airtel Money or card.',
  keywords: 'ABBA, Christian clothing Rwanda, Kigali fashion brand, Rwanda clothing brand, faith-driven fashion, premium Christian apparel, biblical identity, made in Rwanda',
  openGraph: {
    title: 'ABBA | Identity Received. Grace Revealed.',
    description: 'Luxury faith-driven lifestyle apparel inspired by biblical identity and sonship.',
    url: SITE_URL,
    siteName: 'ABBA',
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#1C1C1C',
};

export default function RootLayout({ children }) {
  const orgSchema = getOrganizationSchema();

  return (
    // suppressHydrationWarning: browser extensions inject attributes on <html> (e.g. crxlauncher-bridged)
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="bg-ivory text-charcoal font-sans flex flex-col min-h-screen antialiased selection:bg-gold selection:text-charcoal">
        <AuthProvider>
          <CatalogProvider>
            <WishlistProvider>
              <CartProvider>
                <Navbar />
                <CartDrawer />
                <main className="flex-grow">{children}</main>
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </CatalogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
