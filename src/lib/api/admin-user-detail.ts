import { createClient } from "@/lib/supabase/client";
import type { Profile, Invoice } from "@/types/database";

export interface AdminUserDetail {
  profile: Profile;
  invoices: Invoice[];
}

/**
 * Fetch user detail for admin
 */
export async function fetchAdminUserDetail(userId: string): Promise<AdminUserDetail | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Check admin
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentProfile?.role !== "admin") return null;

  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!targetProfile) return null;

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return {
    profile: targetProfile,
    invoices: invoices || [],
  };
}
