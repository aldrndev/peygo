"use client";

import Link from "next/link";
import {
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Receipt,
  CreditCard,
  Activity,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AdminStats {
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

interface RecentInvoice {
  id: string;
  type: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface AdminDashboardClientProps {
  stats: AdminStats;
  recentInvoices: RecentInvoice[];
  revenueGrowth: number;
}

export default function AdminDashboardClient({
  stats,
  recentInvoices,
  revenueGrowth
}: AdminDashboardClientProps) {

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
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          Ringkasan Platform
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Pantau performa dan aktivitas platform.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Total Pengguna"
          value={stats.totalUsers.toLocaleString()}
          change={`+${stats.newUsersThisMonth} bulan ini`}
          href="/dashboard/admin/users"
          color="orange"
        />
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          label="Total Invoice"
          value={stats.totalInvoices.toLocaleString()}
          change={`+${stats.invoicesThisMonth} bulan ini`}
          href="/dashboard/admin/invoices"
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Total Transaksi"
          value={formatCurrency(stats.totalRevenue)}
          change={revenueGrowth >= 0 ? `+${revenueGrowth.toFixed(1)}%` : `${revenueGrowth.toFixed(1)}%`}
          positive={revenueGrowth >= 0}
          href="/dashboard/admin/reports"
          color="emerald"
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Platform Fee"
          value={formatCurrency(stats.platformFees)}
          change={formatCurrency(stats.feesThisMonth) + " bulan ini"}
          color="indigo"
        />
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Status Breakdown */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-8">Status Invoice</h3>
            <div className="space-y-6">
              {[
                { label: "Lunas", value: stats.paidInvoices, color: "bg-success", text: "text-success" },
                { label: "Menunggu", value: stats.pendingInvoices, color: "bg-warning", text: "text-warning" },
                { label: "Gagal / Lainnya", value: stats.totalInvoices - stats.paidInvoices - stats.pendingInvoices, color: "bg-muted-foreground", text: "text-muted-foreground" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", item.color)} />
                    <span className="font-medium text-muted-foreground">{item.label}</span>
                  </div>
                  <span className={cn("font-semibold text-lg", item.text)}>{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Type Breakdown */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Tipe Transaksi</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Penjualan</span>
                </div>
                <span className="text-base font-semibold text-foreground">{stats.billingCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500 text-white">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Pembayaran</span>
                </div>
                <span className="text-base font-semibold text-foreground">{stats.paymentCount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Breakdown */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Populasi Pengguna</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Regular Users</span>
                <span className="text-base font-semibold text-foreground">{stats.userCount.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Administrators</span>
                <span className="text-base font-semibold text-primary">{stats.adminCount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 md:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center text-background">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Aktivitas Terbaru</h3>
                <p className="text-muted-foreground text-xs">10 transaksi terakhir</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/dashboard/admin/invoices">
                Lihat Semua
                <ChevronRight size={14} className="ml-2" />
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-muted-foreground font-medium text-xs border-b border-border">
                  <th className="py-3 px-4 md:px-5">Transaksi</th>
                  <th className="py-3 px-4 md:px-5 text-right">Nominal</th>
                  <th className="py-3 px-4 md:px-5 text-center hidden md:table-cell">Status</th>
                  <th className="py-3 px-4 md:px-5 text-right hidden md:table-cell">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-accent/50 transition-colors">
                    <td className="py-3 px-4 md:px-5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          invoice.type === "BILLING" ? "bg-primary/10 text-primary" : "bg-blue-50 text-blue-600"
                        )}>
                          {invoice.type === "BILLING" ? <Receipt size={16} /> : <CreditCard size={16} />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {invoice.type === "BILLING" ? "Penjualan" : "Pay-out"}
                          </p>
                          <p className="text-xs text-muted-foreground">#{invoice.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 md:px-5 text-right">
                      <span className="font-semibold text-sm text-foreground tabular-nums">
                        {formatCurrency(invoice.total_amount || 0)}
                      </span>
                    </td>
                    <td className="py-3 px-4 md:px-5 text-center hidden md:table-cell">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="py-3 px-4 md:px-5 text-right text-xs text-muted-foreground hidden md:table-cell">
                      {new Date(invoice.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  change,
  positive = true,
  href,
  color
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  change?: string;
  positive?: boolean;
  href?: string;
  color: "orange" | "blue" | "emerald" | "indigo";
}) {
  const bgClasses: Record<string, string> = {
    orange: "bg-primary/10 text-primary",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-success/10 text-success",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  const cardContent = (
    <Card className="h-full">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bgClasses[color])}>
            {icon}
          </div>
          {change && (
            <div className={cn(
              "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
              positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            )}>
              {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {change.split(' ')[0]}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-xl md:text-2xl font-semibold text-foreground tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  return href ? <Link href={href} className="block h-full">{cardContent}</Link> : cardContent;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string; dot: string }> = {
    DRAFT: { bg: "bg-muted", text: "text-muted-foreground", label: "Draft", dot: "bg-muted-foreground" },
    SENT: { bg: "bg-warning/10", text: "text-warning", label: "Terkirim", dot: "bg-warning" },
    PAID: { bg: "bg-success/10", text: "text-success", label: "Lunas", dot: "bg-success" },
    DISBURSED: { bg: "bg-blue-50", text: "text-blue-600", label: "Dicairkan", dot: "bg-blue-500" },
    FAILED: { bg: "bg-destructive/10", text: "text-destructive", label: "Gagal", dot: "bg-destructive" },
    EXPIRED: { bg: "bg-destructive/10", text: "text-destructive", label: "Expired", dot: "bg-destructive" },
  };

  const { bg, text, label, dot } = config[status] || config.DRAFT;

  return (
    <span className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium", bg, text)}>
      <div className={cn("w-1.5 h-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}
