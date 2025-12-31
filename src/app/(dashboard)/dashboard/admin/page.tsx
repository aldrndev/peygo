import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ADMIN_DASHBOARD_KEY } from "@/hooks/queries/use-admin";
import AdminDashboardHydrated from "./admin-dashboard-hydrated";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) notFound();

  // Check if admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") notFound();

  // Create QueryClient for SSR
  const queryClient = createQueryClient();

  // Prefetch admin dashboard data
  await queryClient.prefetchQuery({
    queryKey: ADMIN_DASHBOARD_KEY,
    queryFn: async () => {
      const [usersResult, invoicesResult] = await Promise.all([
        supabase.from("profiles").select("id, name, role, created_at"),
        supabase.from("invoices").select("id, type, status, total_amount, platform_fee, created_at, user_id"),
      ]);

      const allUsers = usersResult.data || [];
      const allInvoices = invoicesResult.data || [];

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const thisMonthInvoices = allInvoices.filter(i => new Date(i.created_at) >= thisMonth);
      const lastMonthInvoices = allInvoices.filter(i => 
        new Date(i.created_at) >= lastMonth && new Date(i.created_at) < thisMonth
      );

      const stats = {
        totalUsers: allUsers.length,
        newUsersThisMonth: allUsers.filter(u => new Date(u.created_at) >= thisMonth).length,
        totalInvoices: allInvoices.length,
        invoicesThisMonth: thisMonthInvoices.length,
        totalRevenue: allInvoices.reduce((acc, i) => acc + (i.total_amount || 0), 0),
        revenueThisMonth: thisMonthInvoices.reduce((acc, i) => acc + (i.total_amount || 0), 0),
        revenueLastMonth: lastMonthInvoices.reduce((acc, i) => acc + (i.total_amount || 0), 0),
        platformFees: allInvoices.reduce((acc, i) => acc + (i.platform_fee || 0), 0),
        feesThisMonth: thisMonthInvoices.reduce((acc, i) => acc + (i.platform_fee || 0), 0),
        paidInvoices: allInvoices.filter(i => i.status === "PAID" || i.status === "DISBURSED").length,
        pendingInvoices: allInvoices.filter(i => i.status === "SENT" || i.status === "DRAFT").length,
        billingCount: allInvoices.filter(i => i.type === "BILLING").length,
        paymentCount: allInvoices.filter(i => i.type === "PAYMENT_REQUEST").length,
        userCount: allUsers.filter(u => u.role === "user").length,
        adminCount: allUsers.filter(u => u.role === "admin").length,
      };

      const revenueGrowth = stats.revenueLastMonth > 0 
        ? ((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth) * 100 
        : 0;

      const recentInvoices = allInvoices
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      return { stats, recentInvoices, revenueGrowth };
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardHydrated />
    </HydrationBoundary>
  );
}
