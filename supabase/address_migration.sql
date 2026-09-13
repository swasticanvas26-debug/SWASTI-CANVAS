-- Run this in your Supabase SQL Editor to apply address fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
