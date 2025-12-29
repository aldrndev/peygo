import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types/database";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName: string | null;
}

/**
 * Cached function to get current user profile.
 * Uses React cache() to deduplicate requests within a single render.
 * This prevents multiple DB queries when both layout and page need user data.
 */
export const getCurrentUser = cache(async (): Promise<UserProfile | null> => {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role, company_name")
    .eq("id", user.id)
    .single();
  
  if (!profile) return null;
  
  return {
    id: profile.id,
    name: profile.name || "User",
    email: user.email || "",
    role: (profile.role as UserRole) || "user",
    companyName: profile.company_name || null,
  };
});

/**
 * Cached function to get user invoices with stats.
 * Deduplicates invoice queries within a render.
 */
export const getUserInvoices = cache(async (userId: string) => {
  const supabase = await createClient();
  
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, type, status, total_amount, created_at, recipient_name")
    .eq("user_id", userId)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });
  
  return invoices || [];
});

/**
 * Calculate invoice stats from invoices array.
 */
export function calculateInvoiceStats(invoices: Array<{
  type: string;
  status: string;
  total_amount: number | null;
}>) {
  return {
    totalPenagihan: invoices.filter(i => i.type === "BILLING").length,
    totalPembayaran: invoices.filter(i => i.type === "PAYMENT_REQUEST").length,
    pendingAmount: invoices
      .filter(i => i.status === "SENT" || i.status === "DRAFT")
      .reduce((acc, i) => acc + (i.total_amount || 0), 0),
    paidAmount: invoices
      .filter(i => i.status === "PAID" || i.status === "DISBURSED")
      .reduce((acc, i) => acc + (i.total_amount || 0), 0),
  };
}
