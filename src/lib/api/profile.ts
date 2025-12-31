import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export interface ProfileWithUser {
  profile: Profile;
  email: string;
}

/**
 * Fetch current user profile
 */
export async function fetchCurrentProfile(): Promise<ProfileWithUser | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    profile,
    email: user.email || "",
  };
}

export interface UpdateProfileInput {
  full_name?: string;
  business_name?: string;
  phone?: string;
  address?: string;
  logo_url?: string | null;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
}

/**
 * Update current user profile
 */
export async function updateProfileMutation(data: UpdateProfileInput): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tidak terautentikasi" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
