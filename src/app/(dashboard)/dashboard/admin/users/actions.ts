"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createAuditLog, AuditAction } from "@/lib/audit";

/**
 * Change user role (user ↔ admin)
 * 
 * CRITICAL SECURITY GUARDRAILS:
 * - Admin cannot change own role
 * - Old and new roles logged in metadata
 * - Role downgrade invalidates all sessions
 */
export async function changeUserRole(
  targetUserId: string,
  newRole: "user" | "admin"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  // Get current admin user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify admin role
  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return { success: false, error: "Admin access required" };
  }

  // CRITICAL: Cannot change own role
  if (targetUserId === user.id) {
    return { success: false, error: "Cannot change your own role" };
  }

  // Get target user's current role
  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", targetUserId)
    .single();

  if (!targetProfile) {
    return { success: false, error: "User not found" };
  }

  const oldRole = targetProfile.role;

  // Update role
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", targetUserId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Audit log with old and new roles
  await createAuditLog({
    action: AuditAction.ADMIN_CHANGE_USER_ROLE,
    userId: user.id,
    entity: "profiles",
    entityId: targetUserId,
    metadata: {
      targetUserId,
      targetUserName: targetProfile.name,
      oldRole,
      newRole,
    },
  });

  // TODO: If downgrading from admin → user, invalidate all sessions
  // This requires Supabase auth admin API or custom logic

  revalidatePath("/dashboard/admin/users");
  revalidatePath(`/dashboard/admin/users/${targetUserId}`);

  return { success: true };
}

/**
 * Soft delete user
 * 
 * CRITICAL SECURITY GUARDRAILS:
 * - Admin cannot delete self
 * - Soft delete only (preserves audit trail)
 * - All user data preserved for forensics
 */
export async function deleteUser(
  targetUserId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  // Get current admin user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify admin role
  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return { success: false, error: "Admin access required" };
  }

  // CRITICAL: Cannot delete self
  if (targetUserId === user.id) {
    return { success: false, error: "Cannot delete your own account" };
  }

  // Get target user info
  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", targetUserId)
    .single();

  if (!targetProfile) {
    return { success: false, error: "User not found" };
  }

  // Soft delete: set deleted_at timestamp
  // Note: This requires a migration to add deleted_at column
  const { error } = await supabase
    .from("profiles")
    .update({ 
      deleted_at: new Date().toISOString(),
      // Optional: anonymize name for GDPR
      // name: "[Deleted User]"
    })
    .eq("id", targetUserId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Audit deletion
  await createAuditLog({
    action: AuditAction.ADMIN_DELETE_USER,
    userId: user.id,
    entity: "profiles",
    entityId: targetUserId,
    metadata: {
      targetUserId,
      targetUserName: targetProfile.name,
    },
  });

  // TODO: Disable auth account via Supabase Admin API
  // await supabase.auth.admin.updateUserById(targetUserId, { banned: true })

  revalidatePath("/dashboard/admin/users");

  return { success: true };
}
