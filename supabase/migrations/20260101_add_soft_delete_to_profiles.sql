-- Add soft delete support to profiles table
-- Migration: Add deleted_at column for user soft deletion

-- Add deleted_at column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Add comment for documentation
COMMENT ON COLUMN profiles.deleted_at IS 'Timestamp when user was soft-deleted. NULL means active user.';

-- Create index for performance (partial index on deleted users)
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at 
ON profiles(deleted_at) 
WHERE deleted_at IS NOT NULL;

-- Create index for active users queries (most common)
CREATE INDEX IF NOT EXISTS idx_profiles_active 
ON profiles(id) 
WHERE deleted_at IS NULL;

-- Update existing RLS policies to exclude deleted users (optional, based on requirements)
-- Note: You may want to adjust existing policies to check deleted_at IS NULL
-- Example for profiles SELECT policy:
-- DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
-- CREATE POLICY "Users can view own profile" ON profiles
--   FOR SELECT
--   USING (auth.uid() = id AND deleted_at IS NULL);
