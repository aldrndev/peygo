import { createClient } from "@/lib/supabase/server";
import AdminUsersClient from "@/components/dashboard/AdminUsersClient";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Check if admin
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentProfile?.role !== "admin") return null;

  // Parallel data fetching
  const [usersResult, invoiceCountsResult] = await Promise.all([
    supabase.from("profiles").select("id, name, phone, role, created_at").order("created_at", { ascending: false }),
    supabase.from("invoices").select("user_id"),
  ]);

  const users = usersResult.data;
  const invoiceCounts = invoiceCountsResult.data;

  const userInvoiceCounts: Record<string, number> = {};
  invoiceCounts?.forEach(inv => {
    userInvoiceCounts[inv.user_id] = (userInvoiceCounts[inv.user_id] || 0) + 1;
  });

  return (
    <AdminUsersClient 
      users={users || []} 
      userInvoiceCounts={userInvoiceCounts} 
    />
  );
}
