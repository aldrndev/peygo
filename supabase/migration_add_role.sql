-- Migration: Add role column to profiles
-- Run this in Supabase SQL Editor

-- Add role column with default 'user'
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user' 
CHECK (role IN ('user', 'admin'));

-- Create index for faster role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- To set yourself as admin, run:
-- UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
