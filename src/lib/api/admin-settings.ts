import { createClient } from "@/lib/supabase/client";
import type { Setting } from "@/types/database";

/**
 * Fetch admin settings
 */
export async function fetchAdminSettings(): Promise<Setting[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Check admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return [];

  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .order("key");

  return settings || [];
}

/**
 * Update a setting
 */
export async function updateSettingMutation(
  key: string, 
  value: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tidak terautentikasi" };
  }

  // Check admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false, error: "Tidak diizinkan" };
  }

  const { error } = await supabase
    .from("settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", key);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
