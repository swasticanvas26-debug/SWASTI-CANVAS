-- ============================================================
-- SWASTI CANVAS – Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'customer', 'seller');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE artwork_status AS ENUM ('pending_approval', 'listed', 'rejected', 'sold');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM ('open', 'resolved');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'declined');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- TABLES
-- ============================================================

-- Users (single table for all roles)
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL UNIQUE,
  role         user_role NOT NULL DEFAULT 'customer',
  avatar_url   TEXT,
  address      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Artworks
CREATE TABLE IF NOT EXISTS artworks (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                   TEXT NOT NULL,
  description             TEXT,
  category                TEXT NOT NULL DEFAULT 'Abstract',
  image_url               TEXT NOT NULL,
  seller_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_requested_price  NUMERIC(12,2) NOT NULL,
  listing_price           NUMERIC(12,2),
  quantity                INTEGER NOT NULL DEFAULT 1,
  status                  artwork_status NOT NULL DEFAULT 'pending_approval',
  artist_name             TEXT,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Offers (time-limited discounts on listed artworks)
CREATE TABLE IF NOT EXISTS offers (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id          UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE UNIQUE,
  discount_percentage NUMERIC(5,2) NOT NULL CHECK (discount_percentage > 0 AND discount_percentage < 100),
  valid_until         TIMESTAMPTZ NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Cart (also serves as 15-min inventory lock)
CREATE TABLE IF NOT EXISTS cart (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, artwork_id)  -- limits user to 1 instance of an artwork in their cart
);

-- Orders (purchases awaiting / completed payment)
CREATE TABLE IF NOT EXISTS orders (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES users(id),
  artwork_id         UUID NOT NULL REFERENCES artworks(id),
  amount_paid        NUMERIC(12,2) NOT NULL,
  payment_method     TEXT,                     -- 'upi' | 'bank_transfer'
  transaction_id     TEXT,                     -- UTR / Transaction ID submitted by customer
  transaction_amount NUMERIC(12,2),            -- Amount customer claims to have paid
  payment_status     payment_status NOT NULL DEFAULT 'pending',
  payment_ref        TEXT,
  shipping_address   TEXT,
  purchased_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject      TEXT NOT NULL,
  message      TEXT NOT NULL,
  admin_reply  TEXT,
  status       ticket_status NOT NULL DEFAULT 'open',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_artworks_seller_id ON artworks(seller_id);
CREATE INDEX IF NOT EXISTS idx_artworks_status ON artworks(status);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_artwork_id ON cart(artwork_id);
CREATE INDEX IF NOT EXISTS idx_offers_artwork_id ON offers(artwork_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_artworks_updated_at ON artworks;
CREATE TRIGGER set_artworks_updated_at
  BEFORE UPDATE ON artworks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_tickets_updated_at ON support_tickets;
CREATE TRIGGER set_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_orders_updated_at ON orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- CART EXPIRY FUNCTION (called by cron or API route)
-- ============================================================
CREATE OR REPLACE FUNCTION expire_cart_locks()
RETURNS void AS $$
BEGIN
  DELETE FROM cart WHERE added_at < NOW() - INTERVAL '15 minutes';
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PAYMENT CONFIRMATION FUNCTION (Admin confirms payment)
-- ============================================================
CREATE OR REPLACE FUNCTION confirm_order_payment(p_order_id UUID)
RETURNS void AS $$
DECLARE
  v_artwork_id UUID;
BEGIN
  -- Get artwork id from order
  SELECT artwork_id INTO v_artwork_id FROM orders WHERE id = p_order_id;

  -- Mark order as confirmed
  UPDATE orders SET payment_status = 'confirmed' WHERE id = p_order_id;

  -- Decrement quantity
  UPDATE artworks SET quantity = quantity - 1
  WHERE id = v_artwork_id AND quantity > 0;

  -- Mark artwork as sold if quantity hits 0
  UPDATE artworks SET status = 'sold'
  WHERE id = v_artwork_id AND quantity <= 0;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PAYMENT DECLINE FUNCTION (Admin declines payment)
-- ============================================================
CREATE OR REPLACE FUNCTION decline_order_payment(p_order_id UUID)
RETURNS void AS $$
DECLARE
  v_artwork_id UUID;
BEGIN
  SELECT artwork_id INTO v_artwork_id FROM orders WHERE id = p_order_id;

  -- Mark order as declined
  UPDATE orders SET payment_status = 'declined' WHERE id = p_order_id;

  -- Re-list artwork if it was sold (in case of declined after confirm, or if artwork was sold)
  UPDATE artworks SET status = 'listed'
  WHERE id = v_artwork_id AND status = 'sold';

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Helper function: get role of current user
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- USERS policies
CREATE POLICY "Users can read their own profile" ON users
  FOR SELECT USING (id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Service role can insert users" ON users
  FOR INSERT WITH CHECK (true);

-- ARTWORKS policies
CREATE POLICY "Anyone can view listed artworks" ON artworks
  FOR SELECT USING (
    status = 'listed' OR
    status = 'sold' OR
    seller_id = auth.uid() OR
    get_user_role() = 'admin'
  );

CREATE POLICY "Sellers and admins can insert artworks" ON artworks
  FOR INSERT WITH CHECK (
    get_user_role() IN ('seller', 'admin')
  );

CREATE POLICY "Sellers can update own artworks; admins can update any" ON artworks
  FOR UPDATE USING (
    seller_id = auth.uid() OR get_user_role() = 'admin'
  );

CREATE POLICY "Admins can delete artworks" ON artworks
  FOR DELETE USING (get_user_role() = 'admin');

-- OFFERS policies
CREATE POLICY "Anyone can view active offers" ON offers
  FOR SELECT USING (valid_until > NOW());

CREATE POLICY "Admins can manage offers" ON offers
  FOR ALL USING (get_user_role() = 'admin');

-- CART policies
CREATE POLICY "Users can manage their own cart" ON cart
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all carts" ON cart
  FOR SELECT USING (get_user_role() = 'admin');

-- ORDERS policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (user_id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "Service role inserts orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own pending orders; admins update any" ON orders
  FOR UPDATE USING (user_id = auth.uid() OR get_user_role() = 'admin');

-- SUPPORT TICKETS policies
CREATE POLICY "Users can view own tickets; admins view all" ON support_tickets
  FOR SELECT USING (
    user_id = auth.uid() OR get_user_role() = 'admin'
  );

CREATE POLICY "Authenticated users can submit tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update own tickets; admins update any" ON support_tickets
  FOR UPDATE USING (
    user_id = auth.uid() OR get_user_role() = 'admin'
  );

-- ============================================================
-- STORAGE BUCKET (run this or create via dashboard)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('artwork-images', 'artwork-images', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ORDER REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id      UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  website_rating  INTEGER CHECK (website_rating BETWEEN 1 AND 5),
  website_comment TEXT,
  artwork_rating  INTEGER CHECK (artwork_rating BETWEEN 1 AND 5),
  artwork_comment TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_reviews_artwork_id ON order_reviews(artwork_id);
CREATE INDEX IF NOT EXISTS idx_order_reviews_user_id ON order_reviews(user_id);

DROP TRIGGER IF EXISTS set_reviews_updated_at ON order_reviews;
CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON order_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE order_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON order_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON order_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON order_reviews
  FOR UPDATE USING (auth.uid() = user_id);
