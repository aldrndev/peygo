-- Migration: Fix RLS Policies for Security
-- Run this in Supabase SQL Editor

-- ============================================================
-- 1. PROFILES: Block role escalation
-- ============================================================

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile_no_role" ON profiles;

-- Create new policy that blocks role updates
CREATE POLICY "users_can_update_own_profile_safe"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  -- Role must remain unchanged
  role IS NOT DISTINCT FROM (SELECT p.role FROM profiles p WHERE p.id = auth.uid())
);

-- ============================================================
-- 2. INVOICES: Block amount tampering
-- ============================================================

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update own invoices" ON invoices;
DROP POLICY IF EXISTS "users_can_update_own_invoice" ON invoices;
DROP POLICY IF EXISTS "users_can_update_own_invoice_no_amount" ON invoices;

-- Create new policy that blocks amount/financial field updates
-- Users can update description, due_date, recipient info, but NOT amount/status
CREATE POLICY "users_can_update_own_invoice_safe"
ON invoices FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  -- Amount fields must remain unchanged
  amount IS NOT DISTINCT FROM (SELECT i.amount FROM invoices i WHERE i.id = invoices.id)
  AND subtotal IS NOT DISTINCT FROM (SELECT i.subtotal FROM invoices i WHERE i.id = invoices.id)
  AND total_amount IS NOT DISTINCT FROM (SELECT i.total_amount FROM invoices i WHERE i.id = invoices.id)
  -- Status can only be changed through proper channels (RPC)
  AND status IS NOT DISTINCT FROM (SELECT i.status FROM invoices i WHERE i.id = invoices.id)
);

-- ============================================================
-- 3. Add CHECK constraints for extra safety
-- ============================================================

-- Ensure amount is always positive
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_positive_amount;
ALTER TABLE invoices ADD CONSTRAINT invoices_positive_amount CHECK (amount > 0);

-- Ensure total_amount is always positive  
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_positive_total;
ALTER TABLE invoices ADD CONSTRAINT invoices_positive_total CHECK (total_amount > 0);

-- ============================================================
-- Verify policies
-- ============================================================
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'invoices')
ORDER BY tablename, policyname;
