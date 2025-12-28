"use client";

import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Receipt, 
  CreditCard,
  Users,
  Calendar,
  Activity,
  PieChart as PieChartIcon,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MonthlyData {
  month: string;
  year: number;
  invoices: number;
  revenue: number;
  fees: number;
  users: number;
}

interface AdminReportsClientProps {
  totalRevenue: number;
  totalFees: number;
  totalInvoices: number;
  totalUsers: number;
  revenueGrowth: number;
  invoiceGrowth: number;
  userGrowth: number;
  monthlyData: MonthlyData[];
  billingCount: number;
  paymentCount: number;
  statusCounts: Record<string, number>;
}

export default function AdminReportsClient({
  totalRevenue,
  totalFees,
  totalInvoices,
  totalUsers,
  revenueGrowth,
  invoiceGrowth,
  userGrowth,
  monthlyData,
  billingCount,
  paymentCount,
  statusCounts
}: AdminReportsClientProps) {

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}M`;
    }
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}Jt`;
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative space-y-6 md:space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Laporan Analitik
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Pantau pertumbuhan dan performa finansial.
          </p>
        </div>
        <div className="w-full md:w-48">
          <Select defaultValue="6months">
            <SelectTrigger>
              <Calendar className="w-3 h-3 text-muted-foreground mr-2" />
              <SelectValue placeholder="6 Bulan Terakhir" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Bulan</SelectItem>
              <SelectItem value="3months">3 Bulan</SelectItem>
              <SelectItem value="6months">6 Bulan</SelectItem>
              <SelectItem value="1year">1 Tahun</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <ReportCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Volume Transaksi"
          value={formatCurrency(totalRevenue)}
          change={revenueGrowth}
          color="emerald"
        />
        <ReportCard
          icon={<Activity className="w-5 h-5" />}
          label="Platform Fee"
          value={formatCurrency(totalFees)}
          color="blue"
        />
        <ReportCard
          icon={<FileText className="w-5 h-5" />}
          label="Total Invoice"
          value={totalInvoices.toLocaleString("id-ID")}
          change={invoiceGrowth}
          color="orange"
        />
        <ReportCard
          icon={<Users className="w-5 h-5" />}
          label="Basis Pengguna"
          value={totalUsers.toLocaleString("id-ID")}
          change={userGrowth}
          color="indigo"
        />
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* Monthly Trend Table */}
        <Card className="lg:col-span-8">
          <CardContent className="p-0">
            <div className="p-8 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Tren Kinerja Bulanan</h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-1">Laporan Semester Berjalan</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success font-medium text-xs uppercase tracking-wide border border-success/20">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>Live Insights</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-muted-foreground font-semibold uppercase text-xs tracking-wide border-b border-border">
                    <th className="py-6 px-10">Periode</th>
                    <th className="py-6 px-10 text-right">Volume</th>
                    <th className="py-6 px-10 text-right">Platform Fee</th>
                    <th className="py-6 px-10 text-center">Invoices</th>
                    <th className="py-6 px-10 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {monthlyData.map((data, index) => (
                    <tr key={index} className="hover:bg-accent/50 transition-colors group">
                      <td className="py-6 px-10 font-semibold text-foreground capitalize">
                        {data.month} {data.year}
                      </td>
                      <td className="py-6 px-10 text-right font-semibold text-muted-foreground tabular-nums">
                        {formatCurrency(data.revenue)}
                      </td>
                      <td className="py-6 px-10 text-right font-bold text-success tabular-nums">
                        {formatCurrency(data.fees)}
                      </td>
                      <td className="py-6 px-10 text-center text-muted-foreground font-bold tabular-nums">
                        {data.invoices}
                      </td>
                      <td className="py-6 px-10 text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-primary px-2 py-1 bg-primary/10 rounded-lg border border-primary/20">
                          <Users size={12} />
                          +{data.users}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-foreground text-background">
                  <tr className="font-semibold">
                    <td className="py-6 px-10 uppercase text-xs font-bold tracking-wide opacity-60">Cumulative Total</td>
                    <td className="py-6 px-10 text-right text-lg tracking-tight tabular-nums">
                      {formatCurrency(monthlyData.reduce((acc, d) => acc + d.revenue, 0))}
                    </td>
                    <td className="py-6 px-10 text-right text-success text-lg tracking-tight tabular-nums">
                      {formatCurrency(monthlyData.reduce((acc, d) => acc + d.fees, 0))}
                    </td>
                    <td className="py-6 px-10 text-center font-bold tabular-nums">
                      {monthlyData.reduce((acc, d) => acc + d.invoices, 0).toLocaleString()}
                    </td>
                    <td className="py-6 px-10 text-right">
                       <span className="opacity-60 font-bold">+{monthlyData.reduce((acc, d) => acc + d.users, 0)}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Analysis Sidebars */}
        <div className="lg:col-span-4 space-y-6">
          {/* Invoice Type Breakdown */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center">
                  <PieChartIcon size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground leading-tight">Proporsi Transaksi</h3>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">Berdasarkan Tipe Dokumen</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <BreakdownItem 
                  label="Penjualan (Billing)"
                  value={billingCount}
                  total={totalInvoices}
                  icon={<Receipt className="w-4 h-4" />}
                  color="blue"
                />
                <BreakdownItem 
                  label="Pembayaran (Pay-out)"
                  value={paymentCount}
                  total={totalInvoices}
                  icon={<CreditCard className="w-4 h-4" />}
                  color="orange"
                />
              </div>
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-card text-foreground border border-border flex items-center justify-center">
                  <Activity size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground leading-tight">Status Dokumen</h3>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">Distribusi Status Saat Ini</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { status: "PAID", label: "Lunas", color: "bg-success", text: "text-success" },
                  { status: "DISBURSED", label: "Dicairkan", color: "bg-success", text: "text-success" },
                  { status: "SENT", label: "Terkirim", color: "bg-warning", text: "text-warning" },
                  { status: "DRAFT", label: "Draft", color: "bg-muted-foreground", text: "text-muted-foreground" },
                  { status: "FAILED", label: "Gagal", color: "bg-destructive", text: "text-destructive" },
                ].map(({ status, label, color, text }) => (
                  <div key={status} className="flex items-center justify-between text-sm p-3 rounded-2xl hover:bg-accent/50 transition-colors border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", color)} />
                      <span className="text-muted-foreground font-semibold">{label}</span>
                    </div>
                    <span className={cn("font-bold text-base tabular-nums", text)}>
                      {statusCounts[status] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ 
  icon, 
  label, 
  value, 
  change,
  color
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  change?: number;
  color: string;
}) {
  const bgClasses: Record<string, string> = {
    emerald: "bg-success/10 text-success border-success/20",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    orange: "bg-primary/10 text-primary border-primary/20",
    indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  };

  return (
    <Card className="h-full hover:-translate-y-1 transition-transform duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-8">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300", bgClasses[color])}>
            {icon}
          </div>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide",
              change >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            )}>
              {change >= 0 ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{label}</p>
          <p className="text-2xl font-semibold text-foreground tracking-tight tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function BreakdownItem({ label, value, total, icon, color }: { label: string, value: number, total: number, icon: React.ReactNode, color: "blue" | "orange" }) {
  const percentage = (value / (total || 1)) * 100;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-semibold">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className={cn(
            "p-2 rounded-xl border",
            color === "blue" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-primary/10 text-primary border-primary/20"
          )}>
            {icon}
          </div>
          <span className="tracking-tight">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-base text-foreground tabular-nums">{value}</span>
          <span className="text-xs text-muted-foreground ml-2">({percentage.toFixed(0)}%)</span>
        </div>
      </div>
      <Progress 
        aria-label={label}
        value={percentage}
        className="h-2"
      />
    </div>
  );
}
