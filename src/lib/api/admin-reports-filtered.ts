import { createClient } from "@/lib/supabase/server";
import { 
  type ReportFilters, 
  getDateRangeFromPeriod 
} from "./admin-reports-schema";

/**
 * Admin Reports Data - Filtered & Aggregated
 * CRITICAL: All filtering done server-side for security & performance
 */

export interface ReportSummary {
  totalRevenue: number;
  totalFees: number;
  totalInvoices: number;
  totalUsers: number;
  revenueGrowth: number;
  invoiceGrowth: number;
  userGrowth: number;
  feeGrowth: number;
  billingCount: number;
  paymentCount: number;
  statusCounts: Record<string, number>;
  dateRange: {
    startDate: string;
    endDate: string;
    label: string;
  };
}

export interface InvoiceRow {
  id: string;
  invoice_number: string | null;
  type: string;
  status: string;
  total_amount: number;
  platform_fee: number;
  created_at: string;
  paid_at: string | null;
  user_id: string;
  userName: string;
}

export interface UserActivityRow {
  id: string;
  name: string | null;
  invoiceCount: number;
  totalRevenue: number;
  totalFees: number;
  lastActivity: string | null;
  joinedAt: string;
}

export interface MonthlyRow {
  month: string;
  year: number;
  invoices: number;
  revenue: number;
  fees: number;
  newUsers: number;
  growth: number | null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetch report summary with server-side filtering
 * Aggregated data only - no raw rows sent
 */
export async function fetchReportSummary(
  filters: ReportFilters
): Promise<ReportSummary | null> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Verify admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;

  // Get date range from filter
  const { startDate, endDate, label } = getDateRangeFromPeriod(
    filters.period,
    filters.startDate,
    filters.endDate
  );

  // Build base query with date filter
  let invoiceQuery = supabase
    .from("invoices")
    .select("id, type, status, total_amount, platform_fee, created_at")
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString());

  // Apply optional filters
  if (filters.userId) {
    invoiceQuery = invoiceQuery.eq("user_id", filters.userId);
  }
  if (filters.invoiceType !== "all") {
    invoiceQuery = invoiceQuery.eq("type", filters.invoiceType);
  }
  if (filters.status !== "all") {
    invoiceQuery = invoiceQuery.eq("status", filters.status);
  }

  const { data: invoices } = await invoiceQuery;
  const invoiceList = invoices || [];

  // Get user count for period
  const { count: userCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString());

  // Calculate previous period for growth comparison
  const periodDuration = endDate.getTime() - startDate.getTime();
  const prevStartDate = new Date(startDate.getTime() - periodDuration);
  const prevEndDate = new Date(startDate.getTime() - 1);

  let prevInvoiceQuery = supabase
    .from("invoices")
    .select("total_amount, platform_fee")
    .gte("created_at", prevStartDate.toISOString())
    .lte("created_at", prevEndDate.toISOString());

  if (filters.userId) {
    prevInvoiceQuery = prevInvoiceQuery.eq("user_id", filters.userId);
  }
  if (filters.invoiceType !== "all") {
    prevInvoiceQuery = prevInvoiceQuery.eq("type", filters.invoiceType);
  }
  if (filters.status !== "all") {
    prevInvoiceQuery = prevInvoiceQuery.eq("status", filters.status);
  }

  const { data: prevInvoices } = await prevInvoiceQuery;
  const prevInvoiceList = prevInvoices || [];

  const { count: prevUserCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", prevStartDate.toISOString())
    .lte("created_at", prevEndDate.toISOString());

  // Calculate metrics
  const totalRevenue = invoiceList.reduce((acc, i) => acc + (i.total_amount || 0), 0);
  const totalFees = invoiceList.reduce((acc, i) => acc + (i.platform_fee || 0), 0);
  const prevRevenue = prevInvoiceList.reduce((acc, i) => acc + (i.total_amount || 0), 0);
  const prevFees = prevInvoiceList.reduce((acc, i) => acc + (i.platform_fee || 0), 0);

  const revenueGrowth = prevRevenue > 0 
    ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 
    : 0;
  const feeGrowth = prevFees > 0
    ? ((totalFees - prevFees) / prevFees) * 100
    : 0;
  const invoiceGrowth = prevInvoiceList.length > 0
    ? ((invoiceList.length - prevInvoiceList.length) / prevInvoiceList.length) * 100
    : 0;
  const userGrowth = (prevUserCount || 0) > 0
    ? (((userCount || 0) - (prevUserCount || 0)) / (prevUserCount || 1)) * 100
    : 0;

  // Status counts
  const statusCounts: Record<string, number> = {};
  invoiceList.forEach(inv => {
    statusCounts[inv.status] = (statusCounts[inv.status] || 0) + 1;
  });

  return {
    totalRevenue,
    totalFees,
    totalInvoices: invoiceList.length,
    totalUsers: userCount || 0,
    revenueGrowth,
    invoiceGrowth,
    userGrowth,
    feeGrowth,
    billingCount: invoiceList.filter(i => i.type === "BILLING").length,
    paymentCount: invoiceList.filter(i => i.type === "PAYMENT_REQUEST").length,
    statusCounts,
    dateRange: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      label,
    },
  };
}

/**
 * Fetch paginated invoice list with server-side filtering
 * Whitelist sort columns only
 */
export async function fetchInvoiceList(
  filters: ReportFilters
): Promise<PaginatedResult<InvoiceRow>> {
  const supabase = await createClient();
  
  const { startDate, endDate } = getDateRangeFromPeriod(
    filters.period,
    filters.startDate,
    filters.endDate
  );

  // Build query with filters
  let query = supabase
    .from("invoices")
    .select("id, invoice_number, type, status, total_amount, platform_fee, created_at, paid_at, user_id", { count: "exact" })
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString());

  if (filters.userId) {
    query = query.eq("user_id", filters.userId);
  }
  if (filters.invoiceType !== "all") {
    query = query.eq("type", filters.invoiceType);
  }
  if (filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  // Sort - whitelist only
  const sortColumn = filters.sortBy;
  query = query.order(sortColumn, { ascending: filters.sortOrder === "asc" });

  // Pagination
  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    return { data: [], total: 0, page: filters.page, pageSize: filters.pageSize, totalPages: 0 };
  }

  // Fetch user names
  const invoices = data || [];
  const userIds = [...new Set(invoices.map(i => i.user_id))];
  
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name")
    .in("id", userIds);

  const userNames: Record<string, string> = {};
  profiles?.forEach(p => {
    userNames[p.id] = p.name || "Unknown";
  });

  const enrichedData: InvoiceRow[] = invoices.map(inv => ({
    ...inv,
    userName: userNames[inv.user_id] || "Unknown",
  }));

  return {
    data: enrichedData,
    total: count || 0,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: Math.ceil((count || 0) / filters.pageSize),
  };
}

/**
 * Fetch user activity summary with pagination
 */
export async function fetchUserActivity(
  filters: ReportFilters
): Promise<PaginatedResult<UserActivityRow>> {
  const supabase = await createClient();
  
  const { startDate, endDate } = getDateRangeFromPeriod(
    filters.period,
    filters.startDate,
    filters.endDate
  );

  // Get users with pagination
  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;

  const { data: profiles, count } = await supabase
    .from("profiles")
    .select("id, name, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (!profiles) {
    return { data: [], total: 0, page: filters.page, pageSize: filters.pageSize, totalPages: 0 };
  }

  // For each user, get their invoice stats in the period
  const userIds = profiles.map(p => p.id);
  
  const { data: invoices } = await supabase
    .from("invoices")
    .select("user_id, total_amount, platform_fee, created_at")
    .in("user_id", userIds)
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString());

  // Aggregate by user
  const userStats: Record<string, { count: number; revenue: number; fees: number; lastActivity: string | null }> = {};
  invoices?.forEach(inv => {
    if (!userStats[inv.user_id]) {
      userStats[inv.user_id] = { count: 0, revenue: 0, fees: 0, lastActivity: null };
    }
    userStats[inv.user_id].count++;
    userStats[inv.user_id].revenue += inv.total_amount || 0;
    userStats[inv.user_id].fees += inv.platform_fee || 0;
    if (!userStats[inv.user_id].lastActivity || inv.created_at > userStats[inv.user_id].lastActivity!) {
      userStats[inv.user_id].lastActivity = inv.created_at;
    }
  });

  const data: UserActivityRow[] = profiles.map(p => ({
    id: p.id,
    name: p.name,
    invoiceCount: userStats[p.id]?.count || 0,
    totalRevenue: userStats[p.id]?.revenue || 0,
    totalFees: userStats[p.id]?.fees || 0,
    lastActivity: userStats[p.id]?.lastActivity || null,
    joinedAt: p.created_at,
  }));

  return {
    data,
    total: count || 0,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: Math.ceil((count || 0) / filters.pageSize),
  };
}

/**
 * Fetch monthly breakdown for charts
 * Aggregated data only - suitable for charts
 */
export async function fetchMonthlyBreakdown(
  filters: ReportFilters,
  months: number = 12
): Promise<MonthlyRow[]> {
  const supabase = await createClient();
  
  const now = new Date();
  const monthlyData: MonthlyRow[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

    // Get invoices for month
    let query = supabase
      .from("invoices")
      .select("total_amount, platform_fee", { count: "exact" })
      .gte("created_at", monthStart.toISOString())
      .lte("created_at", monthEnd.toISOString());

    if (filters.invoiceType !== "all") {
      query = query.eq("type", filters.invoiceType);
    }
    if (filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    const { data: invoices, count: invoiceCount } = await query;

    // Get new users for month
    const { count: userCount } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStart.toISOString())
      .lte("created_at", monthEnd.toISOString());

    const monthRevenue = (invoices || []).reduce((acc, i) => acc + (i.total_amount || 0), 0);
    const monthFees = (invoices || []).reduce((acc, i) => acc + (i.platform_fee || 0), 0);

    // Calculate growth vs previous entry
    const prevMonth = monthlyData[monthlyData.length - 1];
    const growth = prevMonth && prevMonth.revenue > 0
      ? ((monthRevenue - prevMonth.revenue) / prevMonth.revenue) * 100
      : null;

    monthlyData.push({
      month: monthStart.toLocaleDateString("id-ID", { month: "short" }),
      year: monthStart.getFullYear(),
      invoices: invoiceCount || 0,
      revenue: monthRevenue,
      fees: monthFees,
      newUsers: userCount || 0,
      growth,
    });
  }

  return monthlyData;
}
