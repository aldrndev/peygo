"use client";

import { type ReportFilters } from "@/lib/api/admin-reports-schema";
import { 
  type ReportSummary,
  type PaginatedResult,
  type InvoiceRow,
  type UserActivityRow,
  type MonthlyRow,
} from "@/lib/api/admin-reports-filtered";
import AdminReportsClientNew from "@/components/dashboard/AdminReportsClientNew";

interface Props {
  initialFilters: ReportFilters;
  initialSummary: ReportSummary | null;
  initialInvoices: PaginatedResult<InvoiceRow>;
  initialUsers: PaginatedResult<UserActivityRow>;
  initialMonthly: MonthlyRow[];
}

export default function AdminReportsHydrated({
  initialFilters,
  initialSummary,
  initialInvoices,
  initialUsers,
  initialMonthly,
}: Props) {
  if (!initialSummary) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground">Tidak dapat memuat data laporan</p>
      </div>
    );
  }

  return (
    <AdminReportsClientNew
      filters={initialFilters}
      summary={initialSummary}
      invoices={initialInvoices}
      users={initialUsers}
      monthly={initialMonthly}
    />
  );
}
