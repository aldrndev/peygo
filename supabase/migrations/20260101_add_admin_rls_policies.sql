-- RLS Policies for Admin Audit Logs & User Management
-- Migration: Add security policies for admin features (Retry)

-- ============================================================
-- AUDIT LOGS POLICIES
-- ============================================================

-- Policy: Admin can view all audit logs
CREATE POLICY "admin_view_audit_logs" ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
      AND profiles.deleted_at IS NULL
    )
  );

-- ============================================================
-- PROFILES POLICIES (Admin User Management)
-- ============================================================

-- Policy: Admin can update user roles
CREATE POLICY "admin_update_user_roles" ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles AS admin_profile
      WHERE admin_profile.id = auth.uid() 
      AND admin_profile.role = 'admin'
      AND admin_profile.deleted_at IS NULL
      -- Prevent admin from updating their own role
      AND profiles.id != auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles AS admin_profile
      WHERE admin_profile.id = auth.uid() 
      AND admin_profile.role = 'admin'
      AND admin_profile.deleted_at IS NULL
      AND profiles.id != auth.uid()
    )
  );

-- Policy: Admin can soft delete users (update deleted_at)
-- Simplified to avoid OLD reference issue
CREATE POLICY "admin_soft_delete_users" ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles AS admin_profile
      WHERE admin_profile.id = auth.uid() 
      AND admin_profile.role = 'admin'
      AND admin_profile.deleted_at IS NULL
      -- Prevent self-deletion
      AND profiles.id != auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles AS admin_profile
      WHERE admin_profile.id = auth.uid() 
      AND admin_profile.role = 'admin'
      AND admin_profile.deleted_at IS NULL
      AND profiles.id != auth.uid()
    )
  );

-- Policy: Admin can view all users (including deleted)
CREATE POLICY "admin_view_all_users" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles AS admin_profile
      WHERE admin_profile.id = auth.uid() 
      AND admin_profile.role = 'admin'
      AND admin_profile.deleted_at IS NULL
    )
  );
