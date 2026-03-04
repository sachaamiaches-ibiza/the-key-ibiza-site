-- Wishlists Table for The Key Ibiza
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_code VARCHAR(12) UNIQUE NOT NULL,
  villa_slugs TEXT[] NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  show_prices BOOLEAN DEFAULT true,
  created_by_name VARCHAR(255),
  notes TEXT,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup by share_code
CREATE INDEX IF NOT EXISTS idx_wishlists_share_code ON wishlists(share_code);

-- Enable Row Level Security (RLS)
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read wishlists (public sharing)
CREATE POLICY "Wishlists are publicly viewable" ON wishlists
  FOR SELECT USING (true);

-- Policy: Anyone can create wishlists (no auth required)
CREATE POLICY "Anyone can create wishlists" ON wishlists
  FOR INSERT WITH CHECK (true);

-- Policy: Allow incrementing views_count
CREATE POLICY "Allow updating views_count" ON wishlists
  FOR UPDATE USING (true) WITH CHECK (true);
