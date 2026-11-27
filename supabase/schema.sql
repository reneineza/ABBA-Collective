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
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'accountant', 'sales')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff roles: admin (owner), accountant, sales
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('customer', 'admin', 'accountant', 'sales'));

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

-- Catalogue fields shown on the website, and stock options per product
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS details TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reflection TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE NOT NULL;
ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0 NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS product_variants_option_key ON public.product_variants (product_id, color, size);

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

-- Order contents and contact details, written by the server when an order is placed.
-- receipt_token lets guests (no account) open their own receipt via a private link.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]' NOT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12, 2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS receipt_token TEXT;

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

-- Review details shown on product pages
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS reviewer_name TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS verified_purchase BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS points_awarded BOOLEAN DEFAULT FALSE NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS reviews_one_per_customer ON public.reviews (product_id, user_id);

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

-- 17. WISHLIST ITEMS TABLE
-- product_id is text because the catalogue currently lives in the app (e.g. 'prod-1'),
-- not in the products table.
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- 18. JOURNAL POSTS TABLE (Journal CMS)
CREATE TABLE IF NOT EXISTS public.journal_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  author TEXT,
  published_on DATE DEFAULT CURRENT_DATE NOT NULL,
  read_time TEXT,
  image_url TEXT,
  excerpt TEXT,
  scripture TEXT,
  content TEXT[] DEFAULT '{}' NOT NULL,
  published BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. SITE SETTINGS TABLE (Marketing CMS: announcement bar, featured collection)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. STOCK LEDGER & COSTS (back office)
-- Average unit cost per variant. Kept out of product_variants so costs are never
-- visible to website visitors or sales staff.
CREATE TABLE IF NOT EXISTS public.variant_costs (
  variant_id UUID PRIMARY KEY REFERENCES public.product_variants(id) ON DELETE CASCADE,
  avg_cost NUMERIC(12, 2) NOT NULL CHECK (avg_cost >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplier deliveries ("receive stock")
CREATE TABLE IF NOT EXISTS public.stock_purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  supplier TEXT NOT NULL,
  purchased_on DATE DEFAULT CURRENT_DATE NOT NULL,
  reference TEXT,
  payment_method TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.stock_purchase_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  purchase_id UUID REFERENCES public.stock_purchases(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_cost NUMERIC(12, 2) CHECK (unit_cost >= 0) -- NULL = cost not entered yet
);

-- Every change to stock, written automatically by a trigger on product_variants
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name TEXT,
  color TEXT,
  size TEXT,
  change INTEGER NOT NULL,
  stock_after INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id UUID,
  note TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS stock_movements_created_idx ON public.stock_movements (created_at DESC);

-- What each sold item cost the business (cost of goods sold), per order or store sale
CREATE TABLE IF NOT EXISTS public.sale_costs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('online', 'store')),
  reference_id UUID NOT NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name TEXT,
  quantity INTEGER NOT NULL,
  unit_cost NUMERIC(12, 2), -- NULL = cost unknown at the time of sale
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS sale_costs_reference_idx ON public.sale_costs (reference_id);

-- 21. IN-STORE SALES (sales made outside the website)
CREATE TABLE IF NOT EXISTS public.store_sales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sold_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash', 'MTN MoMo', 'Airtel Money', 'Card', 'Bank Transfer')),
  subtotal NUMERIC(12, 2) NOT NULL,
  discount NUMERIC(12, 2) DEFAULT 0 NOT NULL CHECK (discount >= 0),
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS store_sales_sold_at_idx ON public.store_sales (sold_at DESC);

CREATE TABLE IF NOT EXISTS public.store_sale_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sale_id UUID REFERENCES public.store_sales(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0)
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

-- True when the signed-in user has one of the given roles, e.g. public.has_role('admin', 'sales')
CREATE OR REPLACE FUNCTION public.has_role(VARIADIC roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = ANY (roles));
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

-- STOCK: every stock change is logged in stock_movements by a trigger. Functions that
-- change stock first describe why (reason, reference, note) for that transaction;
-- any other change (e.g. editing stock on the product form) is logged as 'manual_edit'.
CREATE OR REPLACE FUNCTION public.set_stock_context(reason TEXT, ref UUID DEFAULT NULL, note TEXT DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  PERFORM set_config('abba.stock_reason', COALESCE(reason, ''), true);
  PERFORM set_config('abba.stock_ref', COALESCE(ref::TEXT, ''), true);
  PERFORM set_config('abba.stock_note', COALESCE(note, ''), true);
END;
$$;

CREATE OR REPLACE FUNCTION public.log_stock_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  product_title TEXT;
  previous INTEGER := CASE WHEN TG_OP = 'INSERT' THEN 0 ELSE OLD.stock_quantity END;
BEGIN
  IF NEW.stock_quantity = previous THEN
    RETURN NEW;
  END IF;
  SELECT name INTO product_title FROM public.products WHERE id = NEW.product_id;
  INSERT INTO public.stock_movements (variant_id, product_name, color, size, change, stock_after, reason, reference_id, note, created_by)
  VALUES (
    NEW.id, product_title, NEW.color, NEW.size,
    NEW.stock_quantity - previous,
    NEW.stock_quantity,
    COALESCE(NULLIF(current_setting('abba.stock_reason', true), ''), CASE WHEN TG_OP = 'INSERT' THEN 'opening_stock' ELSE 'manual_edit' END),
    NULLIF(current_setting('abba.stock_ref', true), '')::UUID,
    NULLIF(current_setting('abba.stock_note', true), ''),
    auth.uid()
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS product_variants_log_stock ON public.product_variants;
CREATE TRIGGER product_variants_log_stock
  AFTER INSERT OR UPDATE OF stock_quantity ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.log_stock_change();

-- Weighted average cost: (existing units x old cost + new units x new cost) / total units
CREATE OR REPLACE FUNCTION public.apply_unit_cost(target UUID, existing_qty INTEGER, added_qty INTEGER, unit_cost NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.variant_costs (variant_id, avg_cost) VALUES (target, unit_cost)
  ON CONFLICT (variant_id) DO UPDATE
    SET avg_cost = ROUND((public.variant_costs.avg_cost * existing_qty + unit_cost * added_qty) / (existing_qty + added_qty), 2),
        updated_at = NOW();
END;
$$;

-- Website orders: reserve stock (all items or none) and record the cost of each item sold.
-- items: [{product_id, color, size, quantity, name}, ...]; ref: the order id
DROP FUNCTION IF EXISTS public.reserve_stock(JSONB);
CREATE OR REPLACE FUNCTION public.reserve_stock(items JSONB, ref UUID DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  item JSONB;
  reserved UUID;
BEGIN
  PERFORM public.set_stock_context('online_order', ref, NULL);
  FOR item IN SELECT * FROM jsonb_array_elements(items) LOOP
    reserved := NULL;
    UPDATE public.product_variants
       SET stock_quantity = stock_quantity - (item ->> 'quantity')::INTEGER
     WHERE product_id = (item ->> 'product_id')::UUID
       AND color = item ->> 'color'
       AND size = item ->> 'size'
       AND stock_quantity >= (item ->> 'quantity')::INTEGER
    RETURNING id INTO reserved;
    IF reserved IS NULL THEN
      -- Aborts the whole call, so no stock is taken for any item
      RAISE EXCEPTION 'OUT_OF_STOCK:%', COALESCE(item ->> 'name', 'item') || ' (' || (item ->> 'color') || ', ' || (item ->> 'size') || ')';
    END IF;
    IF ref IS NOT NULL THEN
      INSERT INTO public.sale_costs (source, reference_id, variant_id, product_name, quantity, unit_cost)
      VALUES ('online', ref, reserved, item ->> 'name', (item ->> 'quantity')::INTEGER,
              (SELECT avg_cost FROM public.variant_costs WHERE variant_id = reserved));
    END IF;
  END LOOP;
END;
$$;

-- Returns an order's items to stock (cancellation or failed payment) and drops their cost records
DROP FUNCTION IF EXISTS public.release_stock(JSONB);
CREATE OR REPLACE FUNCTION public.release_stock(items JSONB, ref UUID DEFAULT NULL, reason TEXT DEFAULT 'order_cancelled')
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  item JSONB;
BEGIN
  PERFORM public.set_stock_context(reason, ref, NULL);
  FOR item IN SELECT * FROM jsonb_array_elements(items) LOOP
    IF (item ->> 'product_id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
      UPDATE public.product_variants
         SET stock_quantity = stock_quantity + (item ->> 'quantity')::INTEGER
       WHERE product_id = (item ->> 'product_id')::UUID
         AND color = item ->> 'color'
         AND size = item ->> 'size';
    END IF;
  END LOOP;
  IF ref IS NOT NULL THEN
    DELETE FROM public.sale_costs WHERE reference_id = ref AND source = 'online';
  END IF;
END;
$$;

-- Receive a supplier delivery. Sales staff record quantities only; the owner and the
-- accountant also record the cost per unit, which updates each item's average cost.
-- items: [{variant_id, quantity, unit_cost}, ...]
CREATE OR REPLACE FUNCTION public.record_stock_purchase(
  supplier TEXT, purchased_on DATE, reference TEXT, payment_method TEXT, notes TEXT, items JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_purchase UUID;
  item JSONB;
  qty INTEGER;
  cost NUMERIC;
  can_cost BOOLEAN := public.has_role('admin', 'accountant');
  v_id UUID;
  v_color TEXT;
  v_size TEXT;
  v_stock INTEGER;
  v_name TEXT;
BEGIN
  IF NOT public.has_role('admin', 'accountant', 'sales') THEN
    RAISE EXCEPTION 'Not allowed to receive stock';
  END IF;
  IF NULLIF(TRIM(supplier), '') IS NULL THEN
    RAISE EXCEPTION 'Please enter the supplier';
  END IF;
  IF items IS NULL OR jsonb_array_length(items) = 0 THEN
    RAISE EXCEPTION 'Add at least one item';
  END IF;

  INSERT INTO public.stock_purchases (supplier, purchased_on, reference, payment_method, notes, created_by)
  VALUES (TRIM(supplier), COALESCE(purchased_on, CURRENT_DATE), NULLIF(TRIM(reference), ''),
          CASE WHEN can_cost THEN NULLIF(payment_method, '') END, NULLIF(TRIM(notes), ''), auth.uid())
  RETURNING id INTO new_purchase;

  PERFORM public.set_stock_context('purchase', new_purchase, NULL);
  FOR item IN SELECT * FROM jsonb_array_elements(items) LOOP
    qty := (item ->> 'quantity')::INTEGER;
    cost := CASE WHEN can_cost THEN NULLIF(item ->> 'unit_cost', '')::NUMERIC END;
    IF qty IS NULL OR qty <= 0 THEN
      RAISE EXCEPTION 'Quantities must be at least 1';
    END IF;
    IF cost IS NOT NULL AND cost < 0 THEN
      RAISE EXCEPTION 'Costs cannot be negative';
    END IF;

    SELECT pv.id, pv.color, pv.size, pv.stock_quantity, p.name
      INTO v_id, v_color, v_size, v_stock, v_name
      FROM public.product_variants pv JOIN public.products p ON p.id = pv.product_id
     WHERE pv.id = (item ->> 'variant_id')::UUID
       FOR UPDATE OF pv;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Unknown product variant';
    END IF;

    INSERT INTO public.stock_purchase_items (purchase_id, variant_id, product_name, color, size, quantity, unit_cost)
    VALUES (new_purchase, v_id, v_name, v_color, v_size, qty, cost);
    IF cost IS NOT NULL THEN
      PERFORM public.apply_unit_cost(v_id, GREATEST(v_stock, 0), qty, cost);
    END IF;
    UPDATE public.product_variants SET stock_quantity = stock_quantity + qty WHERE id = v_id;
  END LOOP;

  RETURN new_purchase;
END;
$$;

-- Fill in the cost of a delivery line recorded without one ("cost pending")
CREATE OR REPLACE FUNCTION public.set_purchase_item_cost(item_id UUID, unit_cost NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_id UUID;
  qty INTEGER;
  current_stock INTEGER;
BEGIN
  IF NOT public.has_role('admin', 'accountant') THEN
    RAISE EXCEPTION 'Not allowed to enter costs';
  END IF;
  IF unit_cost IS NULL OR unit_cost < 0 THEN
    RAISE EXCEPTION 'Enter a cost of 0 or more';
  END IF;
  UPDATE public.stock_purchase_items i SET unit_cost = set_purchase_item_cost.unit_cost
   WHERE i.id = item_id AND i.unit_cost IS NULL
  RETURNING i.variant_id, i.quantity INTO v_id, qty;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'This item already has a cost. Ask the owner to correct it.';
  END IF;
  IF v_id IS NOT NULL THEN
    SELECT stock_quantity INTO current_stock FROM public.product_variants WHERE id = v_id;
    PERFORM public.apply_unit_cost(v_id, GREATEST(current_stock - qty, 0), qty, set_purchase_item_cost.unit_cost);
  END IF;
END;
$$;

-- Manual correction (damaged, lost, found, returned...), always with a reason
CREATE OR REPLACE FUNCTION public.adjust_stock(variant UUID, change INTEGER, note TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  IF NOT public.has_role('admin', 'accountant', 'sales') THEN
    RAISE EXCEPTION 'Not allowed to adjust stock';
  END IF;
  IF change IS NULL OR change = 0 THEN
    RAISE EXCEPTION 'Enter how many items to add or remove';
  END IF;
  IF NULLIF(TRIM(note), '') IS NULL THEN
    RAISE EXCEPTION 'Please give a reason for the adjustment';
  END IF;
  SELECT stock_quantity INTO current_stock FROM public.product_variants WHERE id = variant FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Unknown product variant';
  END IF;
  IF current_stock + change < 0 THEN
    RAISE EXCEPTION 'Only % in stock, cannot remove %', current_stock, -change;
  END IF;
  PERFORM public.set_stock_context('adjustment', NULL, TRIM(note));
  UPDATE public.product_variants SET stock_quantity = stock_quantity + change WHERE id = variant;
END;
$$;

-- Owner only: delete a delivery recorded by mistake, taking its stock back out
CREATE OR REPLACE FUNCTION public.delete_stock_purchase(purchase UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  line RECORD;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only the owner can delete a delivery';
  END IF;
  PERFORM public.set_stock_context('purchase_deleted', purchase, NULL);
  FOR line IN SELECT i.variant_id, i.quantity, i.product_name, pv.stock_quantity
                FROM public.stock_purchase_items i
                LEFT JOIN public.product_variants pv ON pv.id = i.variant_id
               WHERE i.purchase_id = purchase LOOP
    IF line.variant_id IS NOT NULL THEN
      IF line.stock_quantity < line.quantity THEN
        RAISE EXCEPTION 'Some of this delivery (%) has already been sold. Use a stock adjustment instead.', line.product_name;
      END IF;
      UPDATE public.product_variants SET stock_quantity = stock_quantity - line.quantity WHERE id = line.variant_id;
    END IF;
  END LOOP;
  DELETE FROM public.stock_purchases WHERE id = purchase;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Delivery not found';
  END IF;
END;
$$;

-- Internal helpers: not callable directly
REVOKE EXECUTE ON FUNCTION public.set_stock_context(TEXT, UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.apply_unit_cost(UUID, INTEGER, INTEGER, NUMERIC) FROM PUBLIC, anon, authenticated;
-- Website order stock: the server (secret key) only
REVOKE EXECUTE ON FUNCTION public.reserve_stock(JSONB, UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.release_stock(JSONB, UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_stock(JSONB, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_stock(JSONB, UUID, TEXT) TO service_role;
-- Staff functions check the caller's role themselves; visitors may not call them
REVOKE EXECUTE ON FUNCTION public.record_stock_purchase(TEXT, DATE, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.set_purchase_item_cost(UUID, NUMERIC) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.adjust_stock(UUID, INTEGER, TEXT) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.delete_stock_purchase(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_stock_purchase(TEXT, DATE, TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_purchase_item_cost(UUID, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_stock(UUID, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_stock_purchase(UUID) TO authenticated;

-- IN-STORE SALES: prices come from the catalogue (staff can only give a recorded discount
-- on the whole sale); stock is taken and the cost of each item recorded in one step.
-- items: [{variant_id, quantity}, ...]
CREATE OR REPLACE FUNCTION public.record_store_sale(
  payment_method TEXT, customer_name TEXT, customer_phone TEXT, discount NUMERIC, notes TEXT, items JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_sale UUID := gen_random_uuid();
  item JSONB;
  qty INTEGER;
  running_total NUMERIC := 0;
  sale_discount NUMERIC := COALESCE(discount, 0);
  v_id UUID;
  v_product UUID;
  v_color TEXT;
  v_size TEXT;
  v_stock INTEGER;
  v_name TEXT;
  v_price NUMERIC;
BEGIN
  IF NOT public.has_role('admin', 'accountant', 'sales') THEN
    RAISE EXCEPTION 'Not allowed to record sales';
  END IF;
  IF items IS NULL OR jsonb_array_length(items) = 0 THEN
    RAISE EXCEPTION 'Add at least one item';
  END IF;
  IF sale_discount < 0 THEN
    RAISE EXCEPTION 'Discount cannot be negative';
  END IF;

  -- Insert the sale first (totals filled in below) so items can reference it
  INSERT INTO public.store_sales (id, customer_name, customer_phone, payment_method, subtotal, discount, total, notes, created_by)
  VALUES (new_sale, NULLIF(TRIM(customer_name), ''), NULLIF(TRIM(customer_phone), ''), payment_method, 0, 0, 0,
          NULLIF(TRIM(notes), ''), auth.uid());

  PERFORM public.set_stock_context('store_sale', new_sale, NULL);
  FOR item IN SELECT * FROM jsonb_array_elements(items) LOOP
    qty := (item ->> 'quantity')::INTEGER;
    IF qty IS NULL OR qty <= 0 THEN
      RAISE EXCEPTION 'Quantities must be at least 1';
    END IF;
    SELECT pv.id, pv.product_id, pv.color, pv.size, pv.stock_quantity, p.name, p.price
      INTO v_id, v_product, v_color, v_size, v_stock, v_name, v_price
      FROM public.product_variants pv JOIN public.products p ON p.id = pv.product_id
     WHERE pv.id = (item ->> 'variant_id')::UUID
       FOR UPDATE OF pv;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Unknown product variant';
    END IF;
    IF v_stock < qty THEN
      RAISE EXCEPTION 'OUT_OF_STOCK:% (%, %) has only % left', v_name, v_color, v_size, GREATEST(v_stock, 0);
    END IF;

    INSERT INTO public.store_sale_items (sale_id, variant_id, product_id, product_name, color, size, quantity, unit_price)
    VALUES (new_sale, v_id, v_product, v_name, v_color, v_size, qty, v_price);
    INSERT INTO public.sale_costs (source, reference_id, variant_id, product_name, quantity, unit_cost)
    VALUES ('store', new_sale, v_id, v_name, qty, (SELECT avg_cost FROM public.variant_costs WHERE variant_id = v_id));
    UPDATE public.product_variants SET stock_quantity = stock_quantity - qty WHERE id = v_id;
    running_total := running_total + v_price * qty;
  END LOOP;

  IF sale_discount > running_total THEN
    RAISE EXCEPTION 'Discount cannot be more than the sale total';
  END IF;
  UPDATE public.store_sales
     SET subtotal = running_total, discount = sale_discount, total = running_total - sale_discount
   WHERE id = new_sale;
  RETURN new_sale;
END;
$$;

-- Owner only: delete an in-store sale recorded by mistake; its items go back into stock
CREATE OR REPLACE FUNCTION public.delete_store_sale(sale UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  line RECORD;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only the owner can delete a sale';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.store_sales WHERE id = sale) THEN
    RAISE EXCEPTION 'Sale not found';
  END IF;
  PERFORM public.set_stock_context('store_sale_deleted', sale, NULL);
  FOR line IN SELECT variant_id, quantity FROM public.store_sale_items WHERE sale_id = sale AND variant_id IS NOT NULL LOOP
    UPDATE public.product_variants SET stock_quantity = stock_quantity + line.quantity WHERE id = line.variant_id;
  END LOOP;
  DELETE FROM public.sale_costs WHERE reference_id = sale AND source = 'store';
  DELETE FROM public.store_sales WHERE id = sale;
END;
$$;

-- Set the average cost of an item directly (e.g. stock that existed before costs were
-- tracked). The accountant can only fill in a missing cost; the owner can change any cost.
CREATE OR REPLACE FUNCTION public.set_variant_cost(variant UUID, cost NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.has_role('admin', 'accountant') THEN
    RAISE EXCEPTION 'Not allowed to enter costs';
  END IF;
  IF cost IS NULL OR cost < 0 THEN
    RAISE EXCEPTION 'Enter a cost of 0 or more';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE id = variant) THEN
    RAISE EXCEPTION 'Unknown product variant';
  END IF;
  IF EXISTS (SELECT 1 FROM public.variant_costs WHERE variant_id = variant) AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'This item already has a cost. Ask the owner to change it.';
  END IF;
  INSERT INTO public.variant_costs (variant_id, avg_cost) VALUES (variant, cost)
  ON CONFLICT (variant_id) DO UPDATE SET avg_cost = EXCLUDED.avg_cost, updated_at = NOW();
END;
$$;

REVOKE EXECUTE ON FUNCTION public.record_store_sale(TEXT, TEXT, TEXT, NUMERIC, TEXT, JSONB) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.delete_store_sale(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.set_variant_cost(UUID, NUMERIC) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_store_sale(TEXT, TEXT, TEXT, NUMERIC, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_store_sale(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_variant_cost(UUID, NUMERIC) TO authenticated;

-- Cancelling an order returns its items to stock; a cancelled order can't be reopened
-- (its stock may already have been sold again).
CREATE OR REPLACE FUNCTION public.handle_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF OLD.status = 'Cancelled' AND NEW.status <> 'Cancelled' THEN
    RAISE EXCEPTION 'A cancelled order cannot be reopened. Please place a new order instead.';
  END IF;
  IF NEW.status = 'Cancelled' AND OLD.status <> 'Cancelled' THEN
    PERFORM public.release_stock(NEW.items, NEW.id, 'order_cancelled');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_status_change ON public.orders;
CREATE TRIGGER orders_status_change
  BEFORE UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_status_change();

-- REVIEWS: the database decides "verified purchase" (the reviewer has a non-cancelled
-- order containing the product) and fills a display name, so neither can be faked.
CREATE OR REPLACE FUNCTION public.prepare_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  profile_name TEXT;
BEGIN
  NEW.verified_purchase := EXISTS (
    SELECT 1 FROM public.orders o
     WHERE o.user_id = NEW.user_id
       AND o.status <> 'Cancelled'
       AND o.items @> jsonb_build_array(jsonb_build_object('product_id', NEW.product_id::TEXT))
  );
  NEW.points_awarded := FALSE;
  NEW.reviewer_name := NULLIF(LEFT(TRIM(COALESCE(NEW.reviewer_name, '')), 40), '');
  IF NEW.reviewer_name IS NULL THEN
    SELECT split_part(TRIM(full_name), ' ', 1) INTO profile_name FROM public.profiles WHERE id = NEW.user_id;
    NEW.reviewer_name := COALESCE(NULLIF(profile_name, ''), 'ABBA Customer');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reviews_prepare ON public.reviews;
CREATE TRIGGER reviews_prepare
  BEFORE INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.prepare_review();

-- 100 loyalty points the first time a verified purchaser's review is approved
CREATE OR REPLACE FUNCTION public.award_review_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.approved AND NOT OLD.approved AND NEW.verified_purchase AND NOT OLD.points_awarded THEN
    INSERT INTO public.loyalty_points (user_id, points, transaction_type, description)
    SELECT NEW.user_id, 100, 'Review', 'Review of ' || p.name || ' approved'
      FROM public.products p WHERE p.id = NEW.product_id;
    NEW.points_awarded := TRUE;
  ELSE
    NEW.points_awarded := OLD.points_awarded;
  END IF;
  NEW.verified_purchase := OLD.verified_purchase;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reviews_award_points ON public.reviews;
CREATE TRIGGER reviews_award_points
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.award_review_points();

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
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variant_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_sale_items ENABLE ROW LEVEL SECURITY;

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
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (
  auth.uid() = id OR public.is_admin() OR (role <> 'customer' AND public.has_role('admin', 'accountant', 'sales'))
);
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
CREATE POLICY "Admins manage catalogue" ON public.categories FOR ALL USING (public.has_role('admin', 'accountant', 'sales')) WITH CHECK (public.has_role('admin', 'accountant', 'sales'));

DROP POLICY IF EXISTS "Catalogue is public" ON public.collections;
CREATE POLICY "Catalogue is public" ON public.collections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage catalogue" ON public.collections;
CREATE POLICY "Admins manage catalogue" ON public.collections FOR ALL USING (public.has_role('admin', 'accountant', 'sales')) WITH CHECK (public.has_role('admin', 'accountant', 'sales'));

DROP POLICY IF EXISTS "Catalogue is public" ON public.products;
CREATE POLICY "Catalogue is public" ON public.products FOR SELECT USING (active = true OR public.has_role('admin', 'accountant', 'sales'));
DROP POLICY IF EXISTS "Admins manage catalogue" ON public.products;
CREATE POLICY "Admins manage catalogue" ON public.products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
-- Staff create and edit products (and can hide them); only the owner deletes
DROP POLICY IF EXISTS "Staff add products" ON public.products;
CREATE POLICY "Staff add products" ON public.products FOR INSERT WITH CHECK (public.has_role('admin', 'accountant', 'sales'));
DROP POLICY IF EXISTS "Staff edit products" ON public.products;
CREATE POLICY "Staff edit products" ON public.products FOR UPDATE
  USING (public.has_role('admin', 'accountant', 'sales')) WITH CHECK (public.has_role('admin', 'accountant', 'sales'));

DROP POLICY IF EXISTS "Catalogue is public" ON public.product_variants;
CREATE POLICY "Catalogue is public" ON public.product_variants FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage catalogue" ON public.product_variants;
CREATE POLICY "Admins manage catalogue" ON public.product_variants FOR ALL USING (public.has_role('admin', 'accountant', 'sales')) WITH CHECK (public.has_role('admin', 'accountant', 'sales'));

DROP POLICY IF EXISTS "Catalogue is public" ON public.product_images;
CREATE POLICY "Catalogue is public" ON public.product_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage catalogue" ON public.product_images;
CREATE POLICY "Admins manage catalogue" ON public.product_images FOR ALL USING (public.has_role('admin', 'accountant', 'sales')) WITH CHECK (public.has_role('admin', 'accountant', 'sales'));

-- Orders: customers read their own; orders are created server-side (service role),
-- never directly from the browser, so totals and status can't be forged.
DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins manage orders" ON public.orders;
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Staff view orders" ON public.orders;
CREATE POLICY "Staff view orders" ON public.orders FOR SELECT USING (public.has_role('admin', 'accountant', 'sales'));
DROP POLICY IF EXISTS "Staff update orders" ON public.orders;
CREATE POLICY "Staff update orders" ON public.orders FOR UPDATE USING (public.has_role('admin', 'accountant', 'sales')) WITH CHECK (public.has_role('admin', 'accountant', 'sales'));

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

-- Wishlist: owner only
DROP POLICY IF EXISTS "Users manage own wishlist" ON public.wishlist_items;
CREATE POLICY "Users manage own wishlist" ON public.wishlist_items FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Journal: published posts are public; admins see drafts and manage all posts
DROP POLICY IF EXISTS "Published posts are public" ON public.journal_posts;
CREATE POLICY "Published posts are public" ON public.journal_posts FOR SELECT USING (published = true OR public.is_admin());
DROP POLICY IF EXISTS "Admins manage journal" ON public.journal_posts;
CREATE POLICY "Admins manage journal" ON public.journal_posts FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Site settings: public read (the site shows them), admin write
DROP POLICY IF EXISTS "Site settings are public" ON public.site_settings;
CREATE POLICY "Site settings are public" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Stock & costs: all staff see stock history; only the owner and accountant see costs
-- and deliveries. Rows are written only by the stock functions above.
DROP POLICY IF EXISTS "Staff view stock history" ON public.stock_movements;
CREATE POLICY "Staff view stock history" ON public.stock_movements FOR SELECT USING (public.has_role('admin', 'accountant', 'sales'));
DROP POLICY IF EXISTS "Finance views costs" ON public.variant_costs;
CREATE POLICY "Finance views costs" ON public.variant_costs FOR SELECT USING (public.has_role('admin', 'accountant'));
DROP POLICY IF EXISTS "Finance views deliveries" ON public.stock_purchases;
CREATE POLICY "Finance views deliveries" ON public.stock_purchases FOR SELECT USING (public.has_role('admin', 'accountant'));
DROP POLICY IF EXISTS "Owner edits deliveries" ON public.stock_purchases;
CREATE POLICY "Owner edits deliveries" ON public.stock_purchases FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Finance views delivery items" ON public.stock_purchase_items;
CREATE POLICY "Finance views delivery items" ON public.stock_purchase_items FOR SELECT USING (public.has_role('admin', 'accountant'));
DROP POLICY IF EXISTS "Finance views cost of sales" ON public.sale_costs;
CREATE POLICY "Finance views cost of sales" ON public.sale_costs FOR SELECT USING (public.has_role('admin', 'accountant'));

-- In-store sales: all staff can see them (to issue receipts); written only by record_store_sale
DROP POLICY IF EXISTS "Staff view store sales" ON public.store_sales;
CREATE POLICY "Staff view store sales" ON public.store_sales FOR SELECT USING (public.has_role('admin', 'accountant', 'sales'));
DROP POLICY IF EXISTS "Staff view store sale items" ON public.store_sale_items;
CREATE POLICY "Staff view store sale items" ON public.store_sale_items FOR SELECT USING (public.has_role('admin', 'accountant', 'sales'));

-- Newsletter: anyone can subscribe; only admins can read or manage the list
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins manage subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins manage subscribers" ON public.newsletter_subscribers FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- STARTER CONTENT (only inserted if missing, so admin edits are never overwritten)
INSERT INTO public.journal_posts (slug, title, category, author, published_on, read_time, image_url, excerpt, scripture, content) VALUES
  ($q$understanding-sonship-beyond-performance$q$,
   $q$Understanding Sonship: Beyond Performance and Approval$q$,
   $q$Theological Identity$q$,
   $q$ABBA Editorial Team$q$,
   '2026-07-24',
   $q$6 min read$q$,
   $q$https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop$q$,
   $q$True identity is never earned; it is received. Exploring the spiritual revolution of Galatians 4:6 and how sonship transforms our creative calling.$q$,
   $q$Galatians 4:6 — 'And because you are sons, God has sent the Spirit of his Son into our hearts, crying, ABBA! Father!'$q$,
   ARRAY[$q$In a culture obsessed with performance, personal branding, and endless self-validation, the human soul is constantly enticed to measure worth by productivity. We build identities out of achievements, wardrobe aesthetics, and social approval, only to find that striving yields an anxious posture.$q$,
    $q$The gospel of divine adoption introduces an entirely opposite paradigm: identity is not achieved through human striving; it is sovereignly received. When Paul writes in Galatians 4:6 that God has sent the Spirit of His Son into our hearts crying 'ABBA! Father!', he highlights a structural shift in our spiritual reality. We move from the posture of an orphan performing for acceptance to a beloved child standing in secure inheritance.$q$,
    $q$At ABBA, this revelation is at the heart of everything we craft. Our apparel is designed not as a mask to impress the world, but as a subtle daily reminder of the security already secured for us in Christ. When your posture shifts from slave to son or daughter, rest replaces anxiety, and stewardship replaces striving.$q$]),
  ($q$architecture-of-grace-craftsmanship-matters$q$,
   $q$The Architecture of Grace: Why Craftsmanship Matters$q$,
   $q$Design Journal$q$,
   $q$ABBA Design Studio$q$,
   '2026-07-12',
   $q$4 min read$q$,
   $q$https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop$q$,
   $q$Excellence is not vanity; it is an echo of divine creation. Behind the scenes of our 480 GSM custom milling process in Portugal.$q$,
   $q$Colossians 3:23 — 'Whatever you do, work heartily, as for the Lord and not for men.'$q$,
   ARRAY[$q$Why invest in 480 GSM organic french terry, double-needle reinforced stitching, and custom brass aglets for streetwear? For ABBA, craftsmanship is not about luxury ostentation; it is an act of theological worship and creative stewardship.$q$,
    $q$When God called craftsmen in Exodus like Bezalel, He filled them with the Spirit of wisdom and artistic craftsmanship to build the Tabernacle. Divine order and beauty reflect the God who speaks light out of darkness and forms all things with infinite precision.$q$,
    $q$Every piece in our collections is milled custom in Portugal using 100% organic Supima and heavy jersey cottons. We believe that garments designed to honor God's word should endure both in material structure and timeless design.$q$])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug) VALUES
  ($q$Outerwear$q$, $q$outerwear$q$),
  ($q$Tops & Tees$q$, $q$tops-tees$q$),
  ($q$Knitwear & Hoodies$q$, $q$knitwear-hoodies$q$),
  ($q$Trousers$q$, $q$trousers$q$)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.collections (name, slug, description, image_url, sort_order) VALUES
  ($q$Collection 001: ADOPTION$q$, $q$adoption$q$, $q$Tailored heavy-weight organic cotton pieces crafted around the profound truth of Galatians 4:6 and Romans 8:15.$q$, $q$https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop$q$, 1),
  ($q$Collection 002: GRACE REVEALED$q$, $q$grace-revealed$q$, $q$Minimalist outerwear and unstructured tailoring with subtle embroidered scripture references.$q$, $q$https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop$q$, 2),
  ($q$Collection 003: SOVEREIGN ESSENTIALS$q$, $q$sovereign-essentials$q$, $q$Elevated foundational wardrobe staples built for endurance, mindfulness, and everyday quiet elegance.$q$, $q$https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop$q$, 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, tagline, description, story, details, reflection, price, featured, category_id, collection_id) VALUES
  ($q$ABBA Signature Tee$q$, $q$abba-signature-tee$q$, $q$Identity received, not achieved.$q$, $q$280 GSM Supima organic cotton t-shirt featuring a relaxed drop-shoulder silhouette, blind-stitched hem, and discreetly embroidered 'Galatians 4:6' on the inner neck tape.$q$, $q$Identity is never constructed through human performance, social status, or striving; it is received as a sovereign gift through divine adoption in Christ.$q$, $q$100% Organic Supima Cotton. 280 GSM heavy jersey weight. Custom milled in Portugal. Pre-shrunk with organic enzyme wash for ultra-soft hand-feel.$q$, $q$Galatians 4:6 — 'And because you are sons, God has sent the Spirit of his Son into our hearts, crying, ABBA! Father!'$q$, 45000, TRUE,
   (SELECT id FROM public.categories WHERE slug = $q$tops-tees$q$),
   (SELECT id FROM public.collections WHERE slug = $q$adoption$q$)),
  ($q$Adoption Hoodie$q$, $q$adoption-hoodie$q$, $q$A reminder of belonging to the Father's family.$q$, $q$480 GSM organic french terry hoodie featuring double-layered hood, custom gold aglets, and discreetly embroidered 'Romans 8:15' on the inner left cuff.$q$, $q$Conceived as a tactile armor of divine security. When you wear the Adoption Hoodie, you are enveloped in the warmth and posture of royal sonship.$q$, $q$100% Organic French Terry Cotton. 480 GSM heavyweight fleece. Double-needle stitch construction. Custom solid brass antique gold aglets.$q$, $q$Romans 8:15 — 'For you did not receive the spirit of slavery to fall back into fear, but you have received the Spirit of adoption by whom we cry, ABBA! Father!'$q$, 85000, TRUE,
   (SELECT id FROM public.categories WHERE slug = $q$knitwear-hoodies$q$),
   (SELECT id FROM public.collections WHERE slug = $q$adoption$q$)),
  ($q$Grace Crewneck$q$, $q$grace-crewneck$q$, $q$Salvation is received through grace.$q$, $q$400 GSM brushed fleece cotton crewneck sweatshirt with relaxed shoulders, custom tonal chest embroidery, and thick ribbed collar.$q$, $q$Crafted around the foundational gospel doctrine of unearned, unmerited favor. Grace is not just a concept; it is the atmosphere of the Kingdom.$q$, $q$100% Ring-spun Organic Cotton. 400 GSM brushed fleece interior. Ribbed cuffs, neckline, and waistband with shape-retention memory knit.$q$, $q$Ephesians 2:8 — 'For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works.'$q$, 65000, TRUE,
   (SELECT id FROM public.categories WHERE slug = $q$knitwear-hoodies$q$),
   (SELECT id FROM public.collections WHERE slug = $q$adoption$q$)),
  ($q$Covenant Tailored Overcoat$q$, $q$covenant-tailored-overcoat$q$, $q$Sheltered under the covering of the covenant.$q$, $q$Double-breasted virgin wool blend coat with genuine horn buttons, peaked lapels, and silk lining debossed with covenant cross motifs.$q$, $q$Designed for posture, presence, and quiet dignity. Represents the unyielding shelter of God's covenant love.$q$, $q$80% Virgin Wool, 20% Cashmere Blend. Fully lined in silk cupro. Double horn closure. Tailored fit in Italy.$q$, $q$Isaiah 54:10 — 'My steadfast love shall not depart from you, and my covenant of peace shall not be removed, says the Lord.'$q$, 180000, FALSE,
   (SELECT id FROM public.categories WHERE slug = $q$outerwear$q$),
   (SELECT id FROM public.collections WHERE slug = $q$grace-revealed$q$))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.product_variants (product_id, color, size, sku, stock_quantity)
SELECT p.id, v.color, v.size, v.sku, v.stock
FROM (VALUES
  ($q$abba-signature-tee$q$, $q$Charcoal$q$, $q$S$q$, $q$AST-CHR-S$q$, 15),
  ($q$abba-signature-tee$q$, $q$Charcoal$q$, $q$M$q$, $q$AST-CHR-M$q$, 24),
  ($q$abba-signature-tee$q$, $q$Charcoal$q$, $q$L$q$, $q$AST-CHR-L$q$, 18),
  ($q$abba-signature-tee$q$, $q$Charcoal$q$, $q$XL$q$, $q$AST-CHR-XL$q$, 10),
  ($q$abba-signature-tee$q$, $q$Ivory$q$, $q$S$q$, $q$AST-IVR-S$q$, 12),
  ($q$abba-signature-tee$q$, $q$Ivory$q$, $q$M$q$, $q$AST-IVR-M$q$, 20),
  ($q$abba-signature-tee$q$, $q$Ivory$q$, $q$L$q$, $q$AST-IVR-L$q$, 14),
  ($q$abba-signature-tee$q$, $q$Forest Green$q$, $q$M$q$, $q$AST-FST-M$q$, 8),
  ($q$adoption-hoodie$q$, $q$Charcoal$q$, $q$S$q$, $q$ADH-CHR-S$q$, 10),
  ($q$adoption-hoodie$q$, $q$Charcoal$q$, $q$M$q$, $q$ADH-CHR-M$q$, 20),
  ($q$adoption-hoodie$q$, $q$Charcoal$q$, $q$L$q$, $q$ADH-CHR-L$q$, 16),
  ($q$adoption-hoodie$q$, $q$Ivory$q$, $q$M$q$, $q$ADH-IVR-M$q$, 15),
  ($q$adoption-hoodie$q$, $q$Forest Green$q$, $q$L$q$, $q$ADH-FST-L$q$, 9),
  ($q$grace-crewneck$q$, $q$Ivory$q$, $q$S$q$, $q$GRC-IVR-S$q$, 14),
  ($q$grace-crewneck$q$, $q$Ivory$q$, $q$M$q$, $q$GRC-IVR-M$q$, 22),
  ($q$grace-crewneck$q$, $q$Charcoal$q$, $q$L$q$, $q$GRC-CHR-L$q$, 18),
  ($q$covenant-tailored-overcoat$q$, $q$Deep Charcoal$q$, $q$M$q$, $q$CTO-CHR-M$q$, 6),
  ($q$covenant-tailored-overcoat$q$, $q$Deep Charcoal$q$, $q$L$q$, $q$CTO-CHR-L$q$, 8)
) AS v(product_slug, color, size, sku, stock)
JOIN public.products p ON p.slug = v.product_slug
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order)
SELECT p.id, i.image_url, i.alt_text, i.sort_order
FROM (VALUES
  ($q$abba-signature-tee$q$, $q$https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop$q$, $q$ABBA Signature Tee - Front View$q$, 0),
  ($q$abba-signature-tee$q$, $q$https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop$q$, $q$ABBA Signature Tee - Back View$q$, 1),
  ($q$abba-signature-tee$q$, $q$https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop$q$, $q$ABBA Signature Tee - Detail View$q$, 2),
  ($q$adoption-hoodie$q$, $q$https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop$q$, $q$Adoption Hoodie - Front View$q$, 0),
  ($q$adoption-hoodie$q$, $q$https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop$q$, $q$Adoption Hoodie - Side View$q$, 1),
  ($q$adoption-hoodie$q$, $q$https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop$q$, $q$Adoption Hoodie - Detail View$q$, 2),
  ($q$grace-crewneck$q$, $q$https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop$q$, $q$Grace Crewneck - Front View$q$, 0),
  ($q$grace-crewneck$q$, $q$https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop$q$, $q$Grace Crewneck - Lifestyle$q$, 1),
  ($q$covenant-tailored-overcoat$q$, $q$https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000&auto=format&fit=crop$q$, $q$Covenant Tailored Overcoat - Front$q$, 0),
  ($q$covenant-tailored-overcoat$q$, $q$https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop$q$, $q$Covenant Tailored Overcoat - Back$q$, 1)
) AS i(product_slug, image_url, alt_text, sort_order)
JOIN public.products p ON p.slug = i.product_slug
WHERE NOT EXISTS (SELECT 1 FROM public.product_images x WHERE x.product_id = p.id AND x.image_url = i.image_url);

INSERT INTO public.site_settings (key, value) VALUES
  ('announcement', '{"active": true, "text": "Identity Received. Grace Revealed."}'),
  ('featured_collection', '"adoption"')
ON CONFLICT (key) DO NOTHING;

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
DROP POLICY IF EXISTS "Staff manage product images" ON storage.objects;
CREATE POLICY "Staff manage product images" ON storage.objects FOR ALL
  USING (bucket_id = 'product-images' AND public.has_role('admin', 'accountant', 'sales'))
  WITH CHECK (bucket_id = 'product-images' AND public.has_role('admin', 'accountant', 'sales'));
DROP POLICY IF EXISTS "Users manage own avatar" ON storage.objects;
CREATE POLICY "Users manage own avatar" ON storage.objects FOR ALL
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- To make your own account an admin, run once in the SQL editor (after signing up):
--   UPDATE public.profiles SET role = 'admin' WHERE email = 'you@example.com';
