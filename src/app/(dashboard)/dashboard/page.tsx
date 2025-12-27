import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UserDashboardClient from "@/components/dashboard/UserDashboardClient";

export default async function UserDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, company_name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    return redirect("/dashboard/admin");
  }

  // Get invoice stats
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, type, status, total_amount, created_at")
    .eq("user_id", user.id)
    .eq("is_archived", false);

  const stats = {
    totalPenagihan: invoices?.filter(i => i.type === "BILLING").length || 0,
    totalPembayaran: invoices?.filter(i => i.type === "PAYMENT_REQUEST").length || 0,
    pendingAmount: invoices?.filter(i => i.status === "SENT" || i.status === "DRAFT")
      .reduce((acc, i) => acc + (i.total_amount || 0), 0) || 0,
    paidAmount: invoices?.filter(i => i.status === "PAID" || i.status === "DISBURSED")
      .reduce((acc, i) => acc + (i.total_amount || 0), 0) || 0,
  };

  // Recent invoices
  const recentInvoices = invoices
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5) || [];

  return (
    <UserDashboardClient
      userName={profile?.name || "User"}
      companyName={profile?.company_name || null}
      stats={stats}
      recentInvoices={recentInvoices}
    />
  );
}
