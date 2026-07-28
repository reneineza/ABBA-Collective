import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/lib/context/CartContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import { getOrganizationSchema } from '@/lib/seo/structuredData';

export const metadata = {
  title: 'ABBA Collective | Identity Received. Grace Revealed.',
  description: 'A premium faith-driven lifestyle apparel house creating meaningful garments inspired by biblical identity, designed with uncompromising excellence and craftsmanship.',
  keywords: 'ABBA Collective, luxury Christian clothing, faith-driven fashion, premium Christian apparel, biblical identity, luxury streetwear',
  openGraph: {
    title: 'ABBA Collective | Identity Received. Grace Revealed.',
    description: 'Luxury faith-driven lifestyle apparel inspired by biblical identity and sonship.',
    url: 'https://abbacollective.com',
    siteName: 'ABBA Collective',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  const orgSchema = getOrganizationSchema();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="bg-ivory text-charcoal font-sans flex flex-col min-h-screen antialiased selection:bg-gold selection:text-charcoal">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
