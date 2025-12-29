-- Migration: Fix Settings RLS - Block non-admin updates
-- Run this in Supabase SQL Editor IMMEDIATELY

-- Drop existing policies and recreate with proper restrictions
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;
DROP POLICY IF EXISTS "Public can read public settings" ON public.settings;

-- Policy 1: Admins can SELECT all settings
CREATE POLICY "admins_can_read_all_settings" ON public.settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy 2: Admins can INSERT settings
CREATE POLICY "admins_can_insert_settings" ON public.settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy 3: Admins can UPDATE settings
CREATE POLICY "admins_can_update_settings" ON public.settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy 4: Admins can DELETE settings
CREATE POLICY "admins_can_delete_settings" ON public.settings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy 5: Public can read non-secret settings ONLY (no write)
CREATE POLICY "public_can_read_non_secret_settings" ON public.settings
  FOR SELECT USING (
    is_secret = FALSE
  );

-- Verify policies
SELECT tablename, policyname, cmd, permissive
FROM pg_policies 
WHERE tablename = 'settings'
ORDER BY policyname;
