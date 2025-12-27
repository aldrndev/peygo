import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/dashboard/AdminDashboardClient";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/masuk");

  // Check if admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return redirect("/dashboard");
  }

  // Get all stats
  const { data: allUsers } = await supabase
    .from("profiles")
    .select("id, name, role, created_at");

  const { data: allInvoices } = await supabase
    .from("invoices")
    .select("id, type, status, total_amount, platform_fee, created_at, user_id");

  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const thisMonthInvoices = allInvoices?.filter(i => new Date(i.created_at) >= thisMonth) || [];
  const lastMonthInvoices = allInvoices?.filter(i => 
    new Date(i.created_at) >= lastMonth && new Date(i.created_at) < thisMonth
  ) || [];

  const stats = {
    totalUsers: allUsers?.length || 0,
    newUsersThisMonth: allUsers?.filter(u => new Date(u.created_at) >= thisMonth).length || 0,
    totalInvoices: allInvoices?.length || 0,
    invoicesThisMonth: thisMonthInvoices.length,
    totalRevenue: allInvoices?.reduce((acc, i) => acc + (i.total_amount || 0), 0) || 0,
    revenueThisMonth: thisMonthInvoices.reduce((acc, i) => acc + (i.total_amount || 0), 0),
    revenueLastMonth: lastMonthInvoices.reduce((acc, i) => acc + (i.total_amount || 0), 0),
    platformFees: allInvoices?.reduce((acc, i) => acc + (i.platform_fee || 0), 0) || 0,
    feesThisMonth: thisMonthInvoices.reduce((acc, i) => acc + (i.platform_fee || 0), 0),
    paidInvoices: allInvoices?.filter(i => i.status === "PAID" || i.status === "DISBURSED").length || 0,
    pendingInvoices: allInvoices?.filter(i => i.status === "SENT" || i.status === "DRAFT").length || 0,
    billingCount: allInvoices?.filter(i => i.type === "BILLING").length || 0,
    paymentCount: allInvoices?.filter(i => i.type === "PAYMENT_REQUEST").length || 0,
    userCount: allUsers?.filter(u => u.role === "user").length || 0,
    adminCount: allUsers?.filter(u => u.role === "admin").length || 0,
  };

  const revenueGrowth = stats.revenueLastMonth > 0 
    ? ((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth) * 100 
    : 0;

  // Recent activity
  const recentInvoices = allInvoices
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10) || [];

  return (
    <AdminDashboardClient
      stats={stats}
      recentInvoices={recentInvoices}
      revenueGrowth={revenueGrowth}
    />
  );
}
