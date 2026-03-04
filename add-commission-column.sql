-- Add commission_percent and white_label columns to wishlists table
-- Run this in Supabase SQL Editor

ALTER TABLE wishlists
ADD COLUMN IF NOT EXISTS commission_percent INTEGER DEFAULT 0;

ALTER TABLE wishlists
ADD COLUMN IF NOT EXISTS white_label BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN wishlists.commission_percent IS 'Commission percentage added to prices (0-50). Only VIP users can set this.';
COMMENT ON COLUMN wishlists.white_label IS 'If true, hide all The Key branding from shared page. Only VIP users can set this.';
