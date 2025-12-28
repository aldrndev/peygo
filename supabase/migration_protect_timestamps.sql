-- Migration: Protect timestamp columns from user modification
-- Run this in Supabase SQL Editor

-- ============================================================
-- 1. Create trigger to prevent created_at/updated_at tampering
-- ============================================================

-- Function to enforce immutable created_at and auto-update updated_at
CREATE OR REPLACE FUNCTION protect_timestamp_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent changing created_at
  IF OLD.created_at IS NOT NULL AND NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    NEW.created_at = OLD.created_at;
  END IF;
  
  -- Auto-set updated_at
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. Apply trigger to invoices table
-- ============================================================

DROP TRIGGER IF EXISTS protect_invoice_timestamps ON invoices;
CREATE TRIGGER protect_invoice_timestamps
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION protect_timestamp_columns();

-- ============================================================
-- 3. Apply trigger to suppliers table
-- ============================================================

DROP TRIGGER IF EXISTS protect_supplier_timestamps ON suppliers;
CREATE TRIGGER protect_supplier_timestamps
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION protect_timestamp_columns();

-- ============================================================
-- 4. Apply trigger to profiles table
-- ============================================================

DROP TRIGGER IF EXISTS protect_profile_timestamps ON profiles;
CREATE TRIGGER protect_profile_timestamps
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_timestamp_columns();

-- ============================================================
-- Verify triggers created
-- ============================================================
SELECT trigger_name, event_object_table, action_timing, event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
