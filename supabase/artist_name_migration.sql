-- Add artist_name column to artworks table
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS artist_name TEXT;
