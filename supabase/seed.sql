-- ============================================================
-- SWASTI CANVAS – Seed Data (Development)
-- Note: Supabase Auth users must be created via the dashboard or
-- the auth.users table must be seeded by your auth flow.
-- These are placeholder UUIDs — replace with real auth.users IDs.
-- ============================================================

-- Demo users (insert AFTER creating auth users with same UUIDs)
INSERT INTO users (id, name, email, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Admin SC',    'admin@swasticanvas.art',    'admin'),
  ('00000000-0000-0000-0000-000000000002', 'Priya Sharma', 'priya@swasticanvas.art',   'seller'),
  ('00000000-0000-0000-0000-000000000003', 'Rahul K.',     'rahul@swasticanvas.art',   'seller'),
  ('00000000-0000-0000-0000-000000000004', 'Anjali Sharma','anjali@swasticanvas.art',  'customer'),
  ('00000000-0000-0000-0000-000000000005', 'Rohan M.',     'rohan@swasticanvas.art',   'customer')
ON CONFLICT DO NOTHING;

-- Demo artworks
INSERT INTO artworks (id, title, description, category, image_url, seller_id, seller_requested_price, listing_price, quantity, status) VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'Ember Glow',
    'A vibrant abstract piece capturing the essence of a fiery sunset with bold strokes of orange and red.',
    'Abstract',
    'https://images.unsplash.com/photo-1578926078693-4e2d32a5e2ea?w=600',
    '00000000-0000-0000-0000-000000000005',
    16000,
    18000,
    5,
    'listed'
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'Misty Morning',
    'A serene landscape painting of a foggy lake at dawn, rendered in soft blues and greens.',
    'Landscape',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    '00000000-0000-0000-0000-000000000002',
    16000,
    18000,
    3,
    'listed'
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'Urban Fabric',
    'Bold geometric shapes and contrasting colors tell the story of a modern city in motion.',
    'Abstract',
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600',
    '00000000-0000-0000-0000-000000000002',
    16000,
    18000,
    1,
    'listed'
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'Sunset Bloom',
    'Floral composition bathed in the warm light of a setting sun — oil on canvas.',
    'Portrait',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600',
    '00000000-0000-0000-0000-000000000003',
    13000,
    15000,
    1,
    'listed'
  ),
  (
    'a0000000-0000-0000-0000-000000000005',
    'Misty Peaks',
    'Mountain peaks shrouded in mist, evoking a sense of peaceful solitude.',
    'Landscape',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    '00000000-0000-0000-0000-000000000002',
    8000,
    NULL,
    2,
    'pending_approval'
  ),
  (
    'a0000000-0000-0000-0000-000000000006',
    'Serenity',
    'A minimalist watercolor that captures the calm of early morning meditation.',
    'Abstract',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
    '00000000-0000-0000-0000-000000000003',
    10000,
    NULL,
    4,
    'pending_approval'
  )
ON CONFLICT DO NOTHING;

-- Demo offers (20% off on Ember Glow and Misty Morning)
INSERT INTO offers (artwork_id, discount_percentage, valid_until) VALUES
  ('a0000000-0000-0000-0000-000000000001', 20, NOW() + INTERVAL '75 days'),
  ('a0000000-0000-0000-0000-000000000002', 20, NOW() + INTERVAL '75 days'),
  ('a0000000-0000-0000-0000-000000000003', 20, NOW() + INTERVAL '75 days'),
  ('a0000000-0000-0000-0000-000000000004', 20, '2024-10-31')
ON CONFLICT DO NOTHING;
