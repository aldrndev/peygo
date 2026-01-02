"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  DollarSign, 
  Receipt, 
  Users,
  Calendar,
  Download,
  FileText,
  Filter,
  ChevronDown,
  ReceiptText,  CalendarDays
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ReportFilters, buildFilterSearchParams } from "@/lib/api/admin-reports-schema";
import { 
  type ReportSummary,
  type PaginatedResult,
  type InvoiceRow,
  type UserActivityRow,
  type MonthlyRow,
} from "@/lib/api/admin-reports-filtered";
import {
  downloadCSV,
  exportSummaryToCSV,
  exportInvoicesToCSV,
  exportUserActivityToCSV,
  exportMonthlyToCSV,
} from "@/lib/api/admin-reports-export";
import { generateAdminReportPDF } from "@/lib/api/admin-reports-pdf";
import { 
  StatCard, 
  BreakdownBar, 
  getStatusLabel, 
  getStatusColor 
} from "./reports/ReportComponents";
import { 
  InvoiceTable, 
  UserTable, 
  MonthlyTable 
} from "./reports/ReportTables";
import {
  RevenueTrendChart,
  InvoiceVolumeChart,
  StatusDistributionChart,
  TypeDistributionChart,
} from "./reports/ReportCharts";
import DrillDownSheet from "./reports/DrillDownSheet";

interface Props {
  filters: ReportFilters;
  summary: ReportSummary;
  invoices: PaginatedResult<InvoiceRow>;
  users: PaginatedResult<UserActivityRow>;
  monthly: MonthlyRow[];
}

const periodOptions = [
  { value: "today", label: "Hari Ini" },
  { value: "this_week", label: "Minggu Ini" },
  { value: "this_month", label: "Bulan Ini" },
  { value: "last_month", label: "Bulan Lalu" },
  { value: "this_quarter", label: "Kuartal Ini" },
  { value: "last_quarter", label: "Kuartal Lalu" },
  { value: "this_year", label: "Tahun Ini" },
];

const typeOptions = [
  { value: "all", label: "Semua Tipe" },
  { value: "BILLING", label: "Billing" },
  { value: "PAYMENT_REQUEST", label: "Payment Request" },
];

const statusOptions = [
  { value: "all", label: "Semua Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Terkirim" },
  { value: "PAID", label: "Lunas" },
  { value: "DISBURSED", label: "Dicairkan" },
  { value: "FAILED", label: "Gagal" },
  { value: "EXPIRED", label: "Kedaluwarsa" },
];

export default function AdminReportsClientNew({ 
  filters: initialFilters,
  summary,
  invoices,
  users,
  monthly,
}: Props) {
  const router = useRouter();
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const [activeTab, setActiveTab] = useState(initialFilters.tab);
  const [drilldown, setDrilldown] = useState<{
    type: "revenue" | "invoices" | "users" | "fees" | null;
    open: boolean;
  }>({ type: null, open: false });

  // Formatters
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat("id-ID", { 
      style: "currency", 
      currency: "IDR",
      maximumFractionDigits: 0 
    }).format(amount);

  const formatDate = (dateStr: string) => 
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // Update URL with new filters (triggers server refetch)
  const updateFilters = useCallback((newFilters: Partial<ReportFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    const params = buildFilterSearchParams(updated);
    router.replace(`/dashboard/admin/reports?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  const handlePageChange = (page: number) => updateFilters({ page });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ReportFilters["tab"]);
    // Don't update URL for tab changes - just switch client-side
  };

  // Export handlers
  const handleExportSummary = () => {
    const csv = exportSummaryToCSV(summary);
    downloadCSV(csv, "laporan-ringkasan");
  };

  const handleExportInvoices = () => {
    const csv = exportInvoicesToCSV(invoices.data, summary.dateRange);
    downloadCSV(csv, "laporan-invoice");
  };

  const handleExportUsers = () => {
    const csv = exportUserActivityToCSV(users.data, summary.dateRange);
    downloadCSV(csv, "laporan-user");
  };

  const handleExportMonthly = () => {
    const csv = exportMonthlyToCSV(monthly);
    downloadCSV(csv, "laporan-bulanan");
  };

  const handleExportPDF = async () => {
    try {
      await generateAdminReportPDF(
        summary,
        invoices.data.slice(0, 15), // Top 15 invoices
        users.data.slice(0, 15)      // Top 15 users
      );
    } catch (error) {
      console.error('PDF export error:', error);
      // Could show toast notification here
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {summary.dateRange.label} • {formatDate(summary.dateRange.startDate)} - {formatDate(summary.dateRange.endDate)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select 
            value={filters.period} 
            onValueChange={(v) => updateFilters({ period: v as ReportFilters["period"], page: 1 })}
          >
            <SelectTrigger className="w-[140px]">
              <Calendar size={14} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filters.invoiceType} 
            onValueChange={(v) => updateFilters({ invoiceType: v as ReportFilters["invoiceType"], page: 1 })}
          >
            <SelectTrigger className="w-[150px]">
              <Filter size={14} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filters.status} 
            onValueChange={(v) => updateFilters({ status: v as ReportFilters["status"], page: 1 })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download size={14} className="mr-2" />
                Export
                <ChevronDown size={14} className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileText size={14} className="mr-2" />
                Export PDF Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportSummary}>
                <FileText size={14} className="mr-2" />
                Export Ringkasan (CSV)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportInvoices}>
                <Receipt size={14} className="mr-2" />
                Export Invoice (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportUsers}>
                <Users size={14} className="mr-2" />
                Export User (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportMonthly}>
                <Calendar size={14} className="mr-2" />
                Export Bulanan (CSV)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<DollarSign size={20} />}
          label="Total Revenue"
          value={formatCurrency(summary.totalRevenue)}
          change={summary.revenueGrowth}
          color="emerald"
          onClick={() => setDrilldown({ type: 'revenue', open: true })}
        />
        <StatCard 
          icon={<Receipt size={20} />}
          label="Total Invoice"
          value={summary.totalInvoices.toString()}
          change={summary.invoiceGrowth}
          color="blue"
          onClick={() => setDrilldown({ type: 'invoices', open: true })}
        />
        <StatCard 
          icon={<Users size={20} />}
          label="Total Users"
          value={summary.totalUsers.toString()}
          change={summary.userGrowth}
          color="violet"
          onClick={() => setDrilldown({ type: 'users', open: true })}
        />
        <StatCard 
          icon={<DollarSign size={20} />}
          label="Platform Fee"
          value={formatCurrency(summary.totalFees)}
          change={summary.feeGrowth}
          color="orange"
          onClick={() => setDrilldown({ type: 'fees', open: true })}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RevenueTrendChart data={monthly} />
        <InvoiceVolumeChart data={monthly} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatusDistributionChart statusCounts={summary.statusCounts} />
        <TypeDistributionChart 
          billingCount={summary.billingCount} 
          paymentCount={summary.paymentCount} 
        />
      </div>

      {/* Tabs with Data Tables */}
<Card>
  <Tabs value={activeTab} onValueChange={handleTabChange}>
    <CardHeader className="pb-4 border-b">
      <CardTitle className="text-lg font-semibold mb-4 text-center">
        Data Detail
      </CardTitle>

      <div className="flex justify-center">
        <TabsList className="w-full max-w-xl">
          <TabsTrigger value="invoices">
            <ReceiptText />
            <span>Invoice</span>
          </TabsTrigger>

          <TabsTrigger value="users">
            <Users />
            <span>User</span>
          </TabsTrigger>

          <TabsTrigger value="monthly">
            <CalendarDays />
            <span>Bulanan</span>
          </TabsTrigger>
        </TabsList>
      </div>
    </CardHeader>

    <CardContent className="pt-6">
      <TabsContent value="invoices">
        <InvoiceTable
          invoices={invoices}
          onPageChange={handlePageChange}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      </TabsContent>

      <TabsContent value="users">
        <UserTable
          users={users}
          onPageChange={handlePageChange}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      </TabsContent>

      <TabsContent value="monthly">
        <MonthlyTable
          monthly={monthly}
          formatCurrency={formatCurrency}
        />
      </TabsContent>
    </CardContent>
  </Tabs>
</Card>

      {/* Drilldown Sheet */}
      <DrillDownSheet
        open={drilldown.open}
        onClose={() => setDrilldown({ type: null, open: false })}
        type={drilldown.type}
        invoices={
          drilldown.type === 'revenue'
            ? invoices.data.filter(inv => inv.status === 'PAID' || inv.status === 'DISBURSED')
            : drilldown.type === 'fees'
            ? invoices.data.filter(inv => inv.platform_fee > 0)
            : invoices.data
        }
        users={users.data}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    </div>
  );
}
