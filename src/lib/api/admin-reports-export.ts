import { 
  type ReportFilters,
  getDateRangeFromPeriod 
} from "./admin-reports-schema";
import {
  type ReportSummary,
  type InvoiceRow,
  type UserActivityRow,
  type MonthlyRow,
} from "./admin-reports-filtered";

/**
 * Export Utilities for Admin Reports
 * CRITICAL: PDF = snapshot presentation only, not data source
 * CRITICAL: Don't embed raw large datasets
 */

/**
 * Export invoice list to CSV format
 * Returns CSV string ready for download
 */
export function exportInvoicesToCSV(
  invoices: InvoiceRow[],
  dateRange: { label: string }
): string {
  const headers = [
    "Invoice Number",
    "Type",
    "Status", 
    "Amount",
    "Platform Fee",
    "User",
    "Created At",
    "Paid At"
  ];
  
  const rows = invoices.map(inv => [
    inv.invoice_number || "-",
    inv.type,
    inv.status,
    inv.total_amount.toString(),
    inv.platform_fee.toString(),
    inv.userName,
    new Date(inv.created_at).toLocaleDateString("id-ID"),
    inv.paid_at ? new Date(inv.paid_at).toLocaleDateString("id-ID") : "-"
  ]);

  const csvContent = [
    `# Laporan Invoice - ${dateRange.label}`,
    `# Diekspor pada: ${new Date().toLocaleString("id-ID")}`,
    "",
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n");

  return csvContent;
}

/**
 * Export user activity to CSV format
 */
export function exportUserActivityToCSV(
  users: UserActivityRow[],
  dateRange: { label: string }
): string {
  const headers = [
    "Name",
    "Invoice Count",
    "Total Revenue",
    "Total Fees",
    "Last Activity",
    "Joined"
  ];
  
  const rows = users.map(user => [
    user.name || "-",
    user.invoiceCount.toString(),
    user.totalRevenue.toString(),
    user.totalFees.toString(),
    user.lastActivity ? new Date(user.lastActivity).toLocaleDateString("id-ID") : "-",
    new Date(user.joinedAt).toLocaleDateString("id-ID")
  ]);

  const csvContent = [
    `# Laporan Aktivitas User - ${dateRange.label}`,
    `# Diekspor pada: ${new Date().toLocaleString("id-ID")}`,
    "",
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n");

  return csvContent;
}

/**
 * Export monthly breakdown to CSV format
 */
export function exportMonthlyToCSV(
  monthly: MonthlyRow[]
): string {
  const headers = [
    "Month",
    "Year",
    "Invoices",
    "Revenue",
    "Fees",
    "New Users",
    "Growth %"
  ];
  
  const rows = monthly.map(m => [
    m.month,
    m.year.toString(),
    m.invoices.toString(),
    m.revenue.toString(),
    m.fees.toString(),
    m.newUsers.toString(),
    m.growth !== null ? m.growth.toFixed(1) : "-"
  ]);

  const csvContent = [
    `# Laporan Bulanan`,
    `# Diekspor pada: ${new Date().toLocaleString("id-ID")}`,
    "",
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n");

  return csvContent;
}

/**
 * Export full summary to CSV
 */
export function exportSummaryToCSV(
  summary: ReportSummary
): string {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);

  const csvContent = [
    `# Ringkasan Laporan - ${summary.dateRange.label}`,
    `# Periode: ${new Date(summary.dateRange.startDate).toLocaleDateString("id-ID")} - ${new Date(summary.dateRange.endDate).toLocaleDateString("id-ID")}`,
    `# Diekspor pada: ${new Date().toLocaleString("id-ID")}`,
    "",
    "Metrik,Nilai,Pertumbuhan",
    `"Total Revenue","${formatCurrency(summary.totalRevenue)}","${summary.revenueGrowth.toFixed(1)}%"`,
    `"Total Invoice","${summary.totalInvoices}","${summary.invoiceGrowth.toFixed(1)}%"`,
    `"Total Users","${summary.totalUsers}","${summary.userGrowth.toFixed(1)}%"`,
    `"Platform Fee","${formatCurrency(summary.totalFees)}","-"`,
    "",
    "Tipe Invoice,Jumlah",
    `"Billing","${summary.billingCount}"`,
    `"Payment Request","${summary.paymentCount}"`,
    "",
    "Status Invoice,Jumlah",
    ...Object.entries(summary.statusCounts).map(([status, count]) => `"${status}","${count}"`),
  ].join("\n");

  return csvContent;
}

/**
 * Trigger CSV download in browser
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate PDF report data structure
 * NOTE: Returns data for PDF generation, actual PDF is rendered by component
 * PDF = snapshot presentation only, includes summary + limited top items
 */
export interface PDFReportData {
  title: string;
  dateRange: string;
  generatedAt: string;
  summary: {
    label: string;
    value: string;
    change?: string;
  }[];
  invoiceBreakdown: {
    type: string;
    count: number;
  }[];
  statusBreakdown: {
    status: string;
    count: number;
  }[];
  topInvoices: InvoiceRow[]; // Limited to top N
  topUsers: UserActivityRow[]; // Limited to top N
}

export function preparePDFData(
  summary: ReportSummary,
  topInvoices: InvoiceRow[],
  topUsers: UserActivityRow[],
  maxItems: number = 10
): PDFReportData {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  return {
    title: "Laporan Admin PeyGo",
    dateRange: summary.dateRange.label,
    generatedAt: new Date().toLocaleString("id-ID"),
    summary: [
      { 
        label: "Total Revenue", 
        value: formatCurrency(summary.totalRevenue),
        change: `${summary.revenueGrowth >= 0 ? "+" : ""}${summary.revenueGrowth.toFixed(1)}%`
      },
      { 
        label: "Total Invoice", 
        value: summary.totalInvoices.toString(),
        change: `${summary.invoiceGrowth >= 0 ? "+" : ""}${summary.invoiceGrowth.toFixed(1)}%`
      },
      { 
        label: "Total Users", 
        value: summary.totalUsers.toString(),
        change: `${summary.userGrowth >= 0 ? "+" : ""}${summary.userGrowth.toFixed(1)}%`
      },
      { 
        label: "Platform Fee", 
        value: formatCurrency(summary.totalFees)
      },
    ],
    invoiceBreakdown: [
      { type: "Billing", count: summary.billingCount },
      { type: "Payment Request", count: summary.paymentCount },
    ],
    statusBreakdown: Object.entries(summary.statusCounts).map(([status, count]) => ({
      status,
      count,
    })),
    topInvoices: topInvoices.slice(0, maxItems),
    topUsers: topUsers.slice(0, maxItems),
  };
}
