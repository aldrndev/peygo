-- Migration: Fix Upsert Attack Vulnerability
-- Run this in Supabase SQL Editor

-- The issue: Supabase upsert on conflict will UPDATE even if user doesn't own the row
-- Fix: Add WITH CHECK clause to INSERT policy to ensure user_id matches auth.uid()

-- ============================================================
-- 1. Fix Invoice INSERT policy to block forged upserts
-- ============================================================

DROP POLICY IF EXISTS "Users can insert own invoices" ON invoices;

CREATE POLICY "Users can insert own invoices"
ON invoices FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 2. Fix Supplier INSERT policy
-- ============================================================

DROP POLICY IF EXISTS "Users can insert own suppliers" ON suppliers;

CREATE POLICY "Users can insert own suppliers"
ON suppliers FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 3. Fix Profile INSERT policy
-- ============================================================

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================================
-- Verify policies
-- ============================================================
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'invoices', 'suppliers')
ORDER BY tablename, policyname;
