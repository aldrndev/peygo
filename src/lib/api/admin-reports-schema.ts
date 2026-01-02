import { z } from "zod";

/**
 * Report Filter Schema
 * CRITICAL: All searchParams MUST be validated via this schema
 * Unknown keys are stripped (not errored) per enterprise guardrails
 */
export const reportFilterSchema = z.object({
  // Date range - explicit defaults to "this_month"
  period: z.enum([
    "today",
    "this_week", 
    "this_month",
    "last_month",
    "this_quarter",
    "last_quarter",
    "this_year",
    "custom"
  ]).default("this_month"),
  
  // Custom date range (only used when period = "custom")
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  
  // Filter by user (optional)
  userId: z.string().uuid().optional(),
  
  // Filter by invoice type
  invoiceType: z.enum(["all", "BILLING", "PAYMENT_REQUEST"]).default("all"),
  
  // Filter by status
  status: z.enum([
    "all",
    "DRAFT",
    "SENT",
    "PAID",
    "DISBURSED",
    "FAILED",
    "EXPIRED"
  ]).default("all"),
  
  // Pagination for tables
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(10).max(100).default(20),
  
  // Sort (whitelist only - no dynamic SQL)
  sortBy: z.enum([
    "created_at",
    "total_amount",
    "invoice_number",
    "status"
  ]).default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  
  // Active tab
  tab: z.enum(["invoices", "users", "monthly"]).default("invoices"),
}).strict(); // Strip unknown keys

export type ReportFilters = z.infer<typeof reportFilterSchema>;

/**
 * Parse and validate searchParams
 * Returns validated filters with explicit defaults
 */
export function parseReportFilters(
  searchParams: Record<string, string | string[] | undefined>
): ReportFilters {
  // Flatten array values to first item
  const flatParams: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    flatParams[key] = Array.isArray(value) ? value[0] : value;
  }
  
  // Parse with Zod - unknown keys ignored, defaults applied
  const result = reportFilterSchema.safeParse(flatParams);
  
  if (!result.success) {
    // On validation error, return defaults
    return reportFilterSchema.parse({});
  }
  
  return result.data;
}

/**
 * Get date range from period preset
 * Returns explicit start/end dates
 */
export function getDateRangeFromPeriod(
  period: ReportFilters["period"],
  customStart?: string,
  customEnd?: string
): { startDate: Date; endDate: Date; label: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case "today":
      return {
        startDate: today,
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
        label: "Hari Ini"
      };
      
    case "this_week": {
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      return {
        startDate: startOfWeek,
        endDate: now,
        label: "Minggu Ini"
      };
    }
    
    case "this_month":
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: now,
        label: "Bulan Ini"
      };
      
    case "last_month": {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        startDate: lastMonth,
        endDate: lastMonthEnd,
        label: "Bulan Lalu"
      };
    }
    
    case "this_quarter": {
      const quarter = Math.floor(now.getMonth() / 3);
      return {
        startDate: new Date(now.getFullYear(), quarter * 3, 1),
        endDate: now,
        label: `Q${quarter + 1} ${now.getFullYear()}`
      };
    }
    
    case "last_quarter": {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
      const year = currentQuarter === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return {
        startDate: new Date(year, lastQuarter * 3, 1),
        endDate: new Date(year, lastQuarter * 3 + 3, 0),
        label: `Q${lastQuarter + 1} ${year}`
      };
    }
    
    case "this_year":
      return {
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: now,
        label: `Tahun ${now.getFullYear()}`
      };
      
    case "custom":
      if (customStart && customEnd) {
        return {
          startDate: new Date(customStart),
          endDate: new Date(customEnd),
          label: `${customStart} - ${customEnd}`
        };
      }
      // Fallback to this month if custom dates invalid
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: now,
        label: "Bulan Ini"
      };
      
    default:
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: now,
        label: "Bulan Ini"
      };
  }
}

/**
 * Build URL search params from filters
 * For shareable/bookmarkable URLs
 */
export function buildFilterSearchParams(filters: Partial<ReportFilters>): URLSearchParams {
  const params = new URLSearchParams();
  
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  
  return params;
}
