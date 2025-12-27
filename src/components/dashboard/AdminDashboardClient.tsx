"use client";

import { Card, CardBody, Divider, Button } from "@heroui/react";
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
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
          Ringkasan Platform
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
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
      <Card className="border border-slate-100 bg-white rounded-2xl overflow-hidden">
          <CardBody className="p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">Status Invoice</h3>
            <div className="space-y-6">
              {[
                { label: "Lunas", value: stats.paidInvoices, color: "bg-emerald-500", text: "text-emerald-500" },
                { label: "Menunggu", value: stats.pendingInvoices, color: "bg-orange-500", text: "text-orange-500" },
                { label: "Gagal / Lainnya", value: stats.totalInvoices - stats.paidInvoices - stats.pendingInvoices, color: "bg-slate-300", text: "text-slate-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="font-semibold text-slate-600">{item.label}</span>
                  </div>
                  <span className={`font-semibold text-lg ${item.text}`}>{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Type Breakdown */}
      <Card className="border border-slate-100 bg-white rounded-2xl overflow-hidden">
          <CardBody className="p-5">
            <h3 className="text-sm font-medium text-slate-500 mb-4">Tipe Transaksi</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-500 text-white">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Penagihan</span>
                </div>
                <span className="text-base font-semibold text-slate-900">{stats.billingCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500 text-white">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Pembayaran</span>
                </div>
                <span className="text-base font-semibold text-slate-900">{stats.paymentCount.toLocaleString()}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* User Breakdown */}
      <Card className="border border-slate-100 bg-white rounded-2xl overflow-hidden">
          <CardBody className="p-5">
            <h3 className="text-sm font-medium text-slate-500 mb-4">Populasi Pengguna</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Regular Users</span>
                <span className="text-base font-semibold text-slate-900">{stats.userCount.toLocaleString()}</span>
              </div>
              <Divider className="bg-slate-100" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Administrators</span>
                <span className="text-base font-semibold text-indigo-600">{stats.adminCount.toLocaleString()}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border border-slate-100 bg-white rounded-2xl overflow-hidden">
        <CardBody className="p-0">
          <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Aktivitas Terbaru</h3>
                <p className="text-slate-500 text-xs">10 transaksi terakhir</p>
              </div>
            </div>
            <Link href="/dashboard/admin/invoices">
              <Button 
                variant="flat" 
                size="sm"
                endContent={<ChevronRight size={14} />} 
                className="font-medium text-xs px-3 h-9 rounded-lg bg-slate-100"
              >
                Lihat Semua
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-500 font-medium text-xs border-b border-slate-100">
                  <th className="py-3 px-4 md:px-5">Transaksi</th>
                  <th className="py-3 px-4 md:px-5 text-right">Nominal</th>
                  <th className="py-3 px-4 md:px-5 text-center hidden md:table-cell">Status</th>
                  <th className="py-3 px-4 md:px-5 text-right hidden md:table-cell">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 md:px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${invoice.type === "BILLING" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"}`}>
                          {invoice.type === "BILLING" ? <Receipt size={16} /> : <CreditCard size={16} />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">
                            {invoice.type === "BILLING" ? "Penagihan" : "Pay-out"}
                          </p>
                          <p className="text-xs text-slate-400">#{invoice.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 md:px-5 text-right">
                      <span className="font-semibold text-sm text-slate-900">
                        {formatCurrency(invoice.total_amount || 0)}
                      </span>
                    </td>
                    <td className="py-3 px-4 md:px-5 text-center hidden md:table-cell">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="py-3 px-4 md:px-5 text-right text-xs text-slate-500 hidden md:table-cell">
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
        </CardBody>
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
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  const cardContent = (
    <Card shadow="none" className="h-full border border-slate-100 bg-white rounded-2xl overflow-hidden">
      <CardBody className="p-4 md:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgClasses[color]}`}>
            {icon}
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {change.split(' ')[0]}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-xl md:text-2xl font-semibold text-slate-900">{value}</p>
        </div>
      </CardBody>
    </Card>
  );

  return href ? <Link href={href} className="block h-full">{cardContent}</Link> : cardContent;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string; dot: string }> = {
    DRAFT: { bg: "bg-slate-500/10", text: "text-slate-600", label: "Draft", dot: "bg-slate-400" },
    SENT: { bg: "bg-orange-500/10", text: "text-orange-600", label: "Terkirim", dot: "bg-orange-400" },
    PAID: { bg: "bg-emerald-500/10", text: "text-emerald-700", label: "Lunas", dot: "bg-emerald-500" },
    DISBURSED: { bg: "bg-blue-500/10", text: "text-blue-700", label: "Dicairkan", dot: "bg-blue-500" },
    FAILED: { bg: "bg-rose-500/10", text: "text-rose-600", label: "Gagal", dot: "bg-rose-500" },
    EXPIRED: { bg: "bg-rose-500/10", text: "text-rose-600", label: "Expired", dot: "bg-rose-500" },
  };

  const { bg, text, label, dot } = config[status] || config.DRAFT;

  return (
    <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${bg} ${text} border border-white/50 backdrop-blur-sm`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
