-- Add commission_percent column to wishlists table
-- Run this in Supabase SQL Editor

ALTER TABLE wishlists
ADD COLUMN IF NOT EXISTS commission_percent INTEGER DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN wishlists.commission_percent IS 'Commission percentage added to prices (0-50). Only VIP users can set this.';
