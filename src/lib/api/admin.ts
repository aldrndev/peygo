import { createClient } from "@/lib/supabase/client";

export interface AdminStats {
  totalUsers: number;
  newUsersThisMonth: number;
  totalInvoices: number;
  invoicesThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  platformFees: number;
  feesThisMonth: number;
  paidInvoices: number;
  pendingInvoices: number;
  billingCount: number;
  paymentCount: number;
  userCount: number;
  adminCount: number;
}

export interface AdminUser {
  id: string;
  name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
}

export interface AdminInvoice {
  id: string;
  invoice_number: string | null;
  type: string;
  status: string;
  total_amount: number;
  created_at: string;
  user_id: string;
  userName?: string;
}

/**
 * Fetch admin dashboard data
 */
export async function fetchAdminDashboard() {
  const supabase = createClient();
  
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

  const stats: AdminStats = {
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
}

/**
 * Fetch all users for admin
 */
export async function fetchAdminUsers(): Promise<{ users: AdminUser[]; userInvoiceCounts: Record<string, number> }> {
  const supabase = createClient();
  
  const [usersResult, invoiceCountsResult] = await Promise.all([
    supabase.from("profiles").select("id, name, phone, role, created_at").order("created_at", { ascending: false }),
    supabase.from("invoices").select("user_id"),
  ]);

  const users = usersResult.data || [];
  const invoiceCounts = invoiceCountsResult.data || [];

  const userInvoiceCounts: Record<string, number> = {};
  invoiceCounts.forEach(inv => {
    userInvoiceCounts[inv.user_id] = (userInvoiceCounts[inv.user_id] || 0) + 1;
  });

  return { users, userInvoiceCounts };
}

/**
 * Fetch all invoices for admin
 */
export async function fetchAdminInvoices(): Promise<AdminInvoice[]> {
  const supabase = createClient();
  
  const [invoicesResult, profilesResult] = await Promise.all([
    supabase.from("invoices").select("id, invoice_number, type, status, total_amount, created_at, user_id").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, name"),
  ]);

  const rawInvoices = invoicesResult.data || [];
  const profiles = profilesResult.data || [];

  const userNames: Record<string, string> = {};
  profiles.forEach(p => {
    userNames[p.id] = p.name || "-";
  });

  return rawInvoices.map(inv => ({
    ...inv,
    userName: userNames[inv.user_id] || "-"
  }));
}
