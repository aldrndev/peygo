-- Migration: Add business info columns to profiles
-- Run this in Supabase SQL Editor

-- Add company_name column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- Add company_address column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS company_address TEXT;

-- Add logo_url column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('company_name', 'company_address', 'logo_url');
