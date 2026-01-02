import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import { getQueryClient } from "@/lib/query-client";
import { notFound } from "next/navigation";
import { createAuditLog, AuditAction } from "@/lib/audit";
import AdminReportsHydrated from "./admin-reports-hydrated";
import { parseReportFilters, type ReportFilters } from "@/lib/api/admin-reports-schema";
import { 
  fetchReportSummary, 
  fetchInvoiceList, 
  fetchUserActivity,
  fetchMonthlyBreakdown 
} from "@/lib/api/admin-reports-filtered";

// Query keys for React Query
export const REPORTS_SUMMARY_KEY = ["admin", "reports", "summary"];
export const REPORTS_INVOICES_KEY = ["admin", "reports", "invoices"];
export const REPORTS_USERS_KEY = ["admin", "reports", "users"];
export const REPORTS_MONTHLY_KEY = ["admin", "reports", "monthly"];

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminReportsPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const queryClient = getQueryClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  // Check admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") notFound();

  // Parse and validate filters from URL
  const rawParams = await searchParams;
  const filters = parseReportFilters(rawParams);

  // Audit: Admin viewed reports
  await createAuditLog({
    action: AuditAction.ADMIN_VIEW_REPORTS,
    userId: user.id,
    metadata: {
      filters: {
        period: filters.period,
        invoiceType: filters.invoiceType,
        status: filters.status,
        tab: filters.tab,
      },
    },
  });

  // Fetch all data in parallel (server-side filtered)
  const [summary, invoiceList, userActivity, monthlyData] = await Promise.all([
    fetchReportSummary(filters),
    fetchInvoiceList(filters),
    fetchUserActivity(filters),
    fetchMonthlyBreakdown(filters, 12),
  ]);

  // Prefetch queries for hydration
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [...REPORTS_SUMMARY_KEY, filters],
      queryFn: async () => summary,
    }),
    queryClient.prefetchQuery({
      queryKey: [...REPORTS_INVOICES_KEY, filters],
      queryFn: async () => invoiceList,
    }),
    queryClient.prefetchQuery({
      queryKey: [...REPORTS_USERS_KEY, filters],
      queryFn: async () => userActivity,
    }),
    queryClient.prefetchQuery({
      queryKey: [...REPORTS_MONTHLY_KEY, filters],
      queryFn: async () => monthlyData,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminReportsHydrated 
        initialFilters={filters}
        initialSummary={summary}
        initialInvoices={invoiceList}
        initialUsers={userActivity}
        initialMonthly={monthlyData}
      />
    </HydrationBoundary>
  );
}
