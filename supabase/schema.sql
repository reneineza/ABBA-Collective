-- ABBA Supabase Database Schema Migration
-- Designed for 100% clean execution in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT DEFAULT 'Rwanda' NOT NULL,
  province TEXT,
  district TEXT,
  city TEXT NOT NULL, -- district name, kept for compatibility
  address_line TEXT NOT NULL,
  landmark TEXT, -- directions for the delivery rider (Rwanda has no postal codes)
  postal_code TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration for databases created before Rwanda address fields were added
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS province TEXT;
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS landmark TEXT;
ALTER TABLE public.addresses ALTER COLUMN postal_code DROP NOT NULL;

-- 3. SHIPPING METHODS TABLE
CREATE TABLE IF NOT EXISTS public.shipping_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  estimated_days TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- 5. COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  story TEXT,
  price NUMERIC(12, 2) NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  stock_quantity INTEGER DEFAULT 0 NOT NULL
);

-- 8. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT
);

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  total_amount NUMERIC(12, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  shipping_method_id UUID REFERENCES public.shipping_methods(id) ON DELETE SET NULL,
  shipping_fee NUMERIC(12, 2) DEFAULT 0 NOT NULL,
  payment_provider TEXT CHECK (payment_provider IN ('MTN MoMo', 'Airtel Money', 'Card')),
  transaction_id TEXT,
  currency TEXT DEFAULT 'RWF' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration for databases created before Rwanda payment fields were added
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(12, 2) DEFAULT 0 NOT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_provider TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS transaction_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'RWF' NOT NULL;

-- 10. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. LOYALTY POINTS TABLE
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  points INTEGER DEFAULT 0 NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('Purchase', 'Referral', 'Review', 'Redemption')) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CART SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.cart_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  cart_data JSONB NOT NULL,
  last_activity TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AMBASSADORS TABLE
CREATE TABLE IF NOT EXISTS public.ambassadors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Pending', 'Active', 'Suspended')),
  referral_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. REFERRALS TABLE
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ambassador_id UUID REFERENCES public.ambassadors(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  reward_status TEXT DEFAULT 'Pending' CHECK (reward_status IN ('Pending', 'Rewarded', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email_updates BOOLEAN DEFAULT TRUE,
  order_updates BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACCOUNT HELPERS & TRIGGERS

-- True when the signed-in user has the admin role. SECURITY DEFINER so policies on
-- profiles can call it without recursing into their own RLS checks.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- Create a profile row for every new auth user.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Keep profiles.email in sync when a user changes their login email.
CREATE OR REPLACE FUNCTION public.handle_user_email_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_email_changed ON auth.users;
CREATE TRIGGER on_auth_user_email_changed
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.handle_user_email_change();

-- Customers may edit their own name, phone and avatar, but never their role or email.
-- Changes made from the SQL editor or with the service role key are not restricted.
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated') AND NOT public.is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Not allowed to change role';
    END IF;
    IF NEW.email IS DISTINCT FROM OLD.email THEN
      RAISE EXCEPTION 'Change your email through account settings';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_fields ON public.profiles;
CREATE TRIGGER protect_profile_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();

-- Backfill profiles for users who signed up before the trigger existed
INSERT INTO public.profiles (id, email, full_name)
SELECT id, email, raw_user_meta_data ->> 'full_name' FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ROW LEVEL SECURITY (RLS) FOR ALL PUBLIC TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambassadors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policies from earlier versions of this schema
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public users can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON public.newsletter_subscribers;

-- Profiles: private to their owner; created only by the signup trigger
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin()) WITH CHECK (auth.uid() = id OR public.is_admin());

-- Addresses: owner only
DROP POLICY IF EXISTS "Users manage own addresses" ON public.addresses;
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins view all addresses" ON public.addresses;
CREATE POLICY "Admins view all addresses" ON public.addresses FOR SELECT USING (public.is_admin());

-- Catalogue: public read, admin write
DROP POLICY IF EXISTS "Catalogue is public" ON public.shipping_methods;
CREATE POLICY "Catalogue is public" ON public.shipping_methods FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage catalogue" ON public.shipping_methods;
CREATE POLICY "Admins manage catalogue" ON public.shipping_methods FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Catalogue is public" ON public.categories;
CREATE POLICY "Catalogue is public" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage catalogue" ON public.categories;
CREATE POLICY "Admins manage catalogue" ON public.categories FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Catalogue is public" ON public.collections;
CREATE POLICY "Catalogue is public" ON public.collections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage catalogue" ON public.collections;
CREATE POLICY "Admins manage catalogue" ON public.collections FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Catalogue is public" ON public.products;
CREATE POLICY "Catalogue is public" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage catalogue" ON public.products;
CREATE POLICY "Admins manage catalogue" ON public.products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Catalogue is public" ON public.product_variants;
CREATE POLICY "Catalogue is public" ON public.product_variants FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage catalogue" ON public.product_variants;
CREATE POLICY "Admins manage catalogue" ON public.product_variants FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Catalogue is public" ON public.product_images;
CREATE POLICY "Catalogue is public" ON public.product_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage catalogue" ON public.product_images;
CREATE POLICY "Admins manage catalogue" ON public.product_images FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Orders: customers read their own; orders are created server-side (service role),
-- never directly from the browser, so totals and status can't be forged.
DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins manage orders" ON public.orders;
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Reviews: approved reviews are public; customers submit unapproved reviews only
DROP POLICY IF EXISTS "Approved reviews are public" ON public.reviews;
CREATE POLICY "Approved reviews are public" ON public.reviews FOR SELECT USING (approved = true OR auth.uid() = user_id);
DROP POLICY IF EXISTS "Users submit own reviews" ON public.reviews;
CREATE POLICY "Users submit own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id AND approved = false);
DROP POLICY IF EXISTS "Admins manage reviews" ON public.reviews;
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Loyalty points: customers read their own ledger; only admins / server award points
DROP POLICY IF EXISTS "Users view own points" ON public.loyalty_points;
CREATE POLICY "Users view own points" ON public.loyalty_points FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins manage points" ON public.loyalty_points;
CREATE POLICY "Admins manage points" ON public.loyalty_points FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Saved carts: owner only
DROP POLICY IF EXISTS "Users manage own cart" ON public.cart_sessions;
CREATE POLICY "Users manage own cart" ON public.cart_sessions FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Ambassadors & referrals: ambassadors see their own record and referrals; admins manage
DROP POLICY IF EXISTS "Ambassadors view own record" ON public.ambassadors;
CREATE POLICY "Ambassadors view own record" ON public.ambassadors FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins manage ambassadors" ON public.ambassadors;
CREATE POLICY "Admins manage ambassadors" ON public.ambassadors FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Ambassadors view own referrals" ON public.referrals;
CREATE POLICY "Ambassadors view own referrals" ON public.referrals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.ambassadors a WHERE a.id = ambassador_id AND a.user_id = auth.uid())
);
DROP POLICY IF EXISTS "Admins manage referrals" ON public.referrals;
CREATE POLICY "Admins manage referrals" ON public.referrals FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Notification preferences: owner only
DROP POLICY IF EXISTS "Users manage own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users manage own notification preferences" ON public.notification_preferences FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Newsletter: anyone can subscribe; only admins can read or manage the list
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins manage subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins manage subscribers" ON public.newsletter_subscribers FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- STORAGE BUCKET CREATION
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

-- Storage: buckets are public to read; only admins upload product and blog images,
-- and each user manages files in their own avatars/<user id>/ folder.
DROP POLICY IF EXISTS "Admins manage site images" ON storage.objects;
CREATE POLICY "Admins manage site images" ON storage.objects FOR ALL
  USING (bucket_id IN ('product-images', 'blog-images') AND public.is_admin())
  WITH CHECK (bucket_id IN ('product-images', 'blog-images') AND public.is_admin());
DROP POLICY IF EXISTS "Users manage own avatar" ON storage.objects;
CREATE POLICY "Users manage own avatar" ON storage.objects FOR ALL
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- To make your own account an admin, run once in the SQL editor (after signing up):
--   UPDATE public.profiles SET role = 'admin' WHERE email = 'you@example.com';
