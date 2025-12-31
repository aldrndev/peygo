import { createClient } from "@/lib/supabase/client";

export interface AdminReportsData {
  totalRevenue: number;
  totalFees: number;
  totalInvoices: number;
  totalUsers: number;
  revenueGrowth: number;
  invoiceGrowth: number;
  userGrowth: number;
  monthlyData: {
    month: string;
    year: number;
    invoices: number;
    revenue: number;
    fees: number;
    users: number;
  }[];
  billingCount: number;
  paymentCount: number;
  statusCounts: Record<string, number>;
}

/**
 * Fetch admin reports data
 */
export async function fetchAdminReports(): Promise<AdminReportsData | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Check admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;

  const [invoicesResult, usersResult] = await Promise.all([
    supabase.from("invoices").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, created_at"),
  ]);

  const invoices = invoicesResult.data || [];
  const users = usersResult.data || [];

  const now = new Date();
  
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const monthInvoices = invoices.filter(inv => {
      const date = new Date(inv.created_at);
      return date >= monthStart && date <= monthEnd;
    });

    const monthUsers = users.filter(u => {
      const date = new Date(u.created_at);
      return date >= monthStart && date <= monthEnd;
    });

    monthlyData.push({
      month: monthStart.toLocaleDateString("id-ID", { month: "short" }),
      year: monthStart.getFullYear(),
      invoices: monthInvoices.length,
      revenue: monthInvoices.reduce((acc, i) => acc + (i.total_amount || 0), 0),
      fees: monthInvoices.reduce((acc, i) => acc + (i.platform_fee || 0), 0),
      users: monthUsers.length,
    });
  }

  const currentMonth = monthlyData[monthlyData.length - 1];
  const lastMonth = monthlyData[monthlyData.length - 2];

  const revenueGrowth = lastMonth?.revenue 
    ? ((currentMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100 
    : 0;
  const invoiceGrowth = lastMonth?.invoices 
    ? ((currentMonth.invoices - lastMonth.invoices) / lastMonth.invoices) * 100 
    : 0;
  const userGrowth = lastMonth?.users 
    ? ((currentMonth.users - lastMonth.users) / lastMonth.users) * 100 
    : 0;

  const totalRevenue = invoices.reduce((acc, i) => acc + (i.total_amount || 0), 0);
  const totalFees = invoices.reduce((acc, i) => acc + (i.platform_fee || 0), 0);

  const statusCounts: Record<string, number> = {};
  invoices.forEach(inv => {
    statusCounts[inv.status] = (statusCounts[inv.status] || 0) + 1;
  });

  return {
    totalRevenue,
    totalFees,
    totalInvoices: invoices.length,
    totalUsers: users.length,
    revenueGrowth,
    invoiceGrowth,
    userGrowth,
    monthlyData,
    billingCount: invoices.filter(i => i.type === "BILLING").length,
    paymentCount: invoices.filter(i => i.type === "PAYMENT_REQUEST").length,
    statusCounts,
  };
}
