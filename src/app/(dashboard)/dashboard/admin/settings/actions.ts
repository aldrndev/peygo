"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { invalidateSettingsCache, getRawSettings as getCachedRawSettings } from "@/lib/settings";
import type { Setting } from "@/types/database";
import { z } from "zod";

// Validation schema for settings update
const settingUpdateSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

const settingsUpdateSchema = z.array(settingUpdateSchema);

/**
 * Get all raw settings for admin page
 */
export async function getSettingsForAdmin(): Promise<Setting[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return [];
  }

  return getCachedRawSettings();
}

/**
 * Update multiple settings at once
 */
export async function updateSettings(
  updates: Array<{ key: string; value: string }>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tidak terautentikasi" };
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false, error: "Akses ditolak" };
  }

  // Validate input
  const validated = settingsUpdateSchema.safeParse(updates);
  if (!validated.success) {
    return { success: false, error: "Data tidak valid" };
  }

  // Update each setting
  for (const { key, value } of validated.data) {
    const { error } = await supabase
      .from("settings")
      .update({ 
        value, 
        updated_at: new Date().toISOString(),
        updated_by: user.id 
      })
      .eq("key", key);

    if (error) {
      return { success: false, error: `Gagal update ${key}: ${error.message}` };
    }
  }

  // Invalidate cache so all users get new settings
  invalidateSettingsCache();
  
  // Also revalidate admin settings page
  revalidatePath("/dashboard/admin/settings");

  return { success: true };
}

/**
 * Get a single setting by key (for admin)
 */
export async function getSettingByKey(key: string): Promise<Setting | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // SECURITY: Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return null;
  }
  
  const { data } = await supabase
    .from("settings")
    .select("*")
    .eq("key", key)
    .single();

  return data;
}
