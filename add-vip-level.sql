-- Add vip_level column to vip_users table
-- Run this in Supabase SQL Editor

ALTER TABLE vip_users
ADD COLUMN IF NOT EXISTS vip_level VARCHAR(20) DEFAULT 'vip';

-- Update existing users to 'vip' level (basic)
UPDATE vip_users SET vip_level = 'vip' WHERE vip_level IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN vip_users.vip_level IS 'VIP tier: vip (basic) or vip_pro (commission + white label)';

-- Example: Upgrade a user to VIP Pro
-- UPDATE vip_users SET vip_level = 'vip_pro' WHERE username = 'agent_name';
