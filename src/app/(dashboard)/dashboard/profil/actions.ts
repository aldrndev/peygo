"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const PROFILE_COMPLETE_COOKIE = "peygo_profile_complete";

import { profileSchema } from "./schema";
import { createAuditLog, AuditAction } from "@/lib/audit";

export async function updateProfile(
  prevState: { error: string; success?: boolean } | null, 
  formData: FormData,
  onboardingComplete: boolean = false
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    company_name: formData.get("company_name") || null,
    company_address: formData.get("company_address") || null,
    logo_url: formData.get("logo_url") || null,
    bank_name: formData.get("bank_name") || null,
    bank_account_number: formData.get("bank_account_number") || null,
    bank_account_name: formData.get("bank_account_name") || null,
  };

  const parsed = profileSchema.safeParse(rawData);
  
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const upsertData: Record<string, string | boolean | null> = {
    id: user.id,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  };

  if (onboardingComplete) {
    upsertData.is_onboarding_complete = true;
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(upsertData);

  if (error) {
    return { error: "Gagal menyimpan profil. Silakan periksa koneksi Anda dan coba lagi." };
  }

  // Set profile complete cookie for middleware caching
  if (onboardingComplete) {
    const cookieStore = await cookies();
    cookieStore.set(PROFILE_COMPLETE_COOKIE, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  // Audit profile update
  await createAuditLog({
    action: AuditAction.UPDATE_PROFILE,
    userId: user.id,
    entity: "profiles",
    entityId: user.id,
  });

  revalidatePath("/dashboard");
  return { error: "", success: true };
}

export async function completeOnboarding(
  prevState: { error: string; success?: boolean } | null, 
  formData: FormData
) {
  // Pass true to mark onboarding as complete
  const result = await updateProfile(prevState, formData, true);
  return result;
}

/**
 * Change password for authenticated user
 * SECURITY:
 * - Requires old password verification (prevents session hijacking attacks)
 * - Uses getUser() which verifies JWT server-side (not client-trusted)
 * - User can only change their own password (enforced by Supabase Auth)
 */
export async function changePassword(
  _prevState: { error: string; success?: boolean } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: "Unauthorized" };
  }

  const oldPassword = formData.get("old_password") as string;
  const newPassword = formData.get("new_password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  // Validate inputs
  if (!oldPassword) {
    return { error: "Password lama wajib diisi" };
  }

  if (!newPassword || newPassword.length < 6) {
    return { error: "Password baru minimal 6 karakter" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok" };
  }

  // SECURITY: Verify old password by attempting sign in
  // This prevents password change if session was hijacked
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: oldPassword,
  });

  if (signInError) {
    // Generic error to prevent password enumeration/brute force info
    return { error: "Password lama salah" };
  }

  // Update to new password
  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

  if (updateError) {
    if (updateError.message.includes("same as")) {
      return { error: "Password baru tidak boleh sama dengan password lama" };
    }
    return { error: "Gagal mengubah password. Silakan coba lagi." };
  }

  // Audit password change
  await createAuditLog({
    action: AuditAction.CHANGE_PASSWORD,
    userId: user.id,
  });

  revalidatePath("/dashboard/profil");
  return { error: "", success: true };
}
