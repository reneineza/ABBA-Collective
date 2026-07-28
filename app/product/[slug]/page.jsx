'use client';

import React, { useState, useEffect } from 'react';
import ProductGallery from '@/components/ProductGallery';
import ProductReviews from '@/components/ProductReviews';
import ProductRecommendations from '@/components/ProductRecommendations';
import SocialShareButtons from '@/components/SocialShareButtons';
import Button from '@/components/Button';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleData';
import { safeJsonParse } from '@/lib/utils/json';
import { useCart } from '@/lib/context/CartContext';
import { getProductSchema } from '@/lib/seo/structuredData';
import { trackProductView } from '@/lib/analytics/analyticsService';
import { formatPrice } from '@/lib/utils/formatCurrency';
import { ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, PackageX } from 'lucide-react';

export default function ProductDetailPage({ params }) {
  const resolvedParams = params && typeof params.then === 'function' ? React.use(params) : params;
  const slug = resolvedParams?.slug || '';

  const [product, setProduct] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = safeJsonParse(localStorage.getItem('abba_products'), []);
      const allProducts = Array.isArray(stored) && stored.length > 0 ? stored : SAMPLE_PRODUCTS;
      const found = allProducts.find((p) => p.slug === slug || p.id === slug);
      setProduct(found || null);
    } catch (e) {
      setProduct(SAMPLE_PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null);
    } finally {
      setIsLoaded(true);
    }
  }, [slug]);

  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState('Charcoal');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('story');
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) setSelectedColor(product.colors[0]);
      if (product.sizes && product.sizes.length > 0) setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  // Track Product View Analytics
  React.useEffect(() => {
    if (product) {
      trackProductView(product);
    }
  }, [product]);

  const productSchema = getProductSchema(product);

  const currentVariant = product?.variants ? product.variants.find(
    (v) => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size.toLowerCase() === selectedSize.toLowerCase()
  ) : null;

  const stockQuantity = currentVariant ? currentVariant.stock_quantity : 15;
  const isOutOfStock = stockQuantity <= 0;

  const handleAddToCart = () => {
    if (!isOutOfStock && product) {
      addItem(product, selectedSize, selectedColor, quantity);
    }
  };

  if (isLoaded && !product) {
    return (
      <div className="bg-ivory text-charcoal py-24 sm:py-32">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto border border-gold/30">
            <PackageX size={32} />
          </div>
          <div className="space-y-2">
            <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
              ✦ Garment Not Found ✦
            </span>
            <h1 className="font-serif-luxury text-3xl font-bold text-charcoal">
              Garment Unavailable
            </h1>
            <p className="text-xs text-charcoal/70 font-light leading-relaxed">
              The requested garment ("{slug}") could not be found in our active collection roster.
            </p>
          </div>
          <Button href="/shop" variant="primary" size="md">
            Explore Full Shop
          </Button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-ivory text-charcoal py-12 sm:py-20">
      {/* Product JSON-LD SEO Schema */}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Product Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Product Gallery (Col 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            <ProductGallery images={product.images || [{ image_url: product.image_url }]} name={product.name} />
            <SocialShareButtons title={product.name} />
          </div>

          {/* RIGHT: Product Information (Col 8-12) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header Info */}
            <div className="space-y-2 border-b border-charcoal/10 pb-6">
              <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
                {product.collection || product.category}
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
                {product.name}
              </h1>
              {product.tagline && (
                <p className="text-xs text-charcoal/60 italic font-light">
                  "{product.tagline}"
                </p>
              )}
              <div className="pt-2 flex items-center justify-between">
                <p className="text-2xl font-bold text-charcoal tracking-wide">
                  {formatPrice(product.price)}
                </p>
                <span className="text-xs uppercase tracking-widest text-forest font-semibold bg-forest/10 px-3 py-1 rounded-sm">
                  {isOutOfStock ? 'Out of Stock' : `In Stock (${stockQuantity} available)`}
                </span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-charcoal/80 font-light leading-relaxed">
              {product.description}
            </p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-xs uppercase tracking-widest text-charcoal font-semibold block">
                  Color: <span className="text-gold">{selectedColor}</span>
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs uppercase tracking-wider rounded-sm transition-all border ${
                        selectedColor === color
                          ? 'bg-charcoal text-ivory border-charcoal font-semibold shadow-sm'
                          : 'bg-ivory-light text-charcoal border-charcoal/20 hover:border-gold'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs uppercase tracking-widest">
                  <span className="text-charcoal font-semibold">
                    Size: <span className="text-gold">{selectedSize}</span>
                  </span>
                  <span className="text-charcoal/50 text-[10px] underline cursor-pointer hover:text-gold">
                    Size Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-11 text-xs uppercase font-semibold transition-all border rounded-sm ${
                        selectedSize === size
                          ? 'bg-gold text-charcoal border-gold shadow-sm'
                          : 'bg-ivory-light text-charcoal border-charcoal/20 hover:border-gold'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart Action */}
            <div className="space-y-4 pt-4 border-t border-charcoal/10">
              <div className="flex gap-4 items-center">
                {/* Quantity Controls */}
                <div className="flex items-center border border-charcoal/20 rounded-sm bg-ivory-light px-3 py-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-xs text-charcoal hover:text-gold px-2"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-charcoal">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-xs text-charcoal hover:text-gold px-2"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3.5 bg-charcoal text-ivory hover:bg-forest transition-colors text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <ShoppingBag size={16} />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Shopping Bag'}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-3.5 border border-charcoal/20 rounded-sm text-charcoal hover:text-gold transition-colors"
                  title="Add to Wishlist"
                >
                  <Heart size={18} className={isWishlisted ? "fill-gold text-gold" : ""} />
                </button>
              </div>

              {/* Client Guarantees */}
              <div className="grid grid-cols-2 gap-4 pt-4 text-[11px] text-charcoal/70 border-t border-charcoal/10 font-light">
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-gold" />
                  <span>Complimentary Rwanda Express Shipping over 200,000 RWF</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-gold" />
                  <span>Ethical Custom Milled Textiles</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM STORYTELLING ACCORDION / TABS */}
        <div className="bg-ivory-light border border-charcoal/10 rounded-sm p-8 sm:p-12 space-y-8">
          
          {/* Tab Controls */}
          <div className="flex border-b border-charcoal/10 gap-8 uppercase tracking-widest text-xs font-semibold">
            <button
              onClick={() => setActiveTab('story')}
              className={`pb-3 transition-all relative ${
                activeTab === 'story'
                  ? 'text-forest font-bold border-b-2 border-gold'
                  : 'text-charcoal/60 hover:text-gold'
              }`}
            >
              ✦ Story
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 transition-all relative ${
                activeTab === 'details'
                  ? 'text-forest font-bold border-b-2 border-gold'
                  : 'text-charcoal/60 hover:text-gold'
              }`}
            >
              ✦ Details & Fit
            </button>
            <button
              onClick={() => setActiveTab('reflection')}
              className={`pb-3 transition-all relative ${
                activeTab === 'reflection'
                  ? 'text-forest font-bold border-b-2 border-gold'
                  : 'text-charcoal/60 hover:text-gold'
              }`}
            >
              ✦ Biblical Reflection
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="space-y-4 max-w-4xl">
            {activeTab === 'story' && (
              <div className="space-y-4">
                <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">
                  Why This Garment Exists
                </h3>
                <p className="text-sm text-charcoal/80 font-light leading-relaxed">
                  {product.story}
                </p>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-4">
                <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">
                  Materials, Craftsmanship & Fit
                </h3>
                <p className="text-sm text-charcoal/80 font-light leading-relaxed">
                  {product.details}
                </p>
                <div className="pt-4 border-t border-charcoal/10 space-y-2 text-xs text-charcoal/70">
                  <p>• <strong>Care Instructions:</strong> Machine wash cold with like colors. Lay flat to dry to preserve cotton fiber density and structure.</p>
                  <p>• <strong>Sourcing:</strong> Ethically milled in Portugal with OEKO-TEX certified organic dyes.</p>
                </div>
              </div>
            )}

            {activeTab === 'reflection' && (
              <div className="space-y-4">
                <h3 className="font-serif-luxury text-2xl font-bold text-charcoal">
                  Spiritual Identity & Scripture Anchor
                </h3>
                <blockquote className="bg-charcoal text-ivory p-6 rounded-sm border-l-4 border-gold italic font-serif-luxury text-lg leading-relaxed font-light">
                  "{product.reflection}"
                </blockquote>
                <p className="text-xs text-charcoal/70 font-light leading-relaxed pt-2">
                  This garment was designed to be worn close to your chest as a tangible, tactile reminder of your sonship and identity in Christ.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* CUSTOMER REVIEWS & STAR RATINGS */}
        <ProductReviews productId={product.id} productName={product.name} />

        {/* RELATED GARMENT RECOMMENDATIONS */}
        <ProductRecommendations currentProduct={product} />

      </div>
    </div>
  );
}
