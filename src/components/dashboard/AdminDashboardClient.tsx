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
    <div className="relative space-y-8 pb-10">
      {/* Decorative Blur Elements (Minimal) */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-400/5 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-400/5 blur-[120px] -z-10 pointer-events-none" />

      {/* Header */}
      <div className="relative px-1">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
          Ringkasan Platform
        </h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base font-medium">
          Pantau performa dan aktivitas platform secara real-time.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 relative">
        {/* Status Breakdown */}
      <Card className="border border-slate-100 bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardBody className="p-8">
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
      <Card className="border border-slate-100 bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardBody className="p-8">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">Tipe Transaksi</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 rounded-3xl bg-orange-50/50 border border-orange-100/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500 text-white">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Penagihan</span>
                </div>
                <span className="text-xl font-semibold text-slate-900">{stats.billingCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-5 rounded-3xl bg-blue-50/50 border border-blue-100/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500 text-white">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Pembayaran</span>
                </div>
                <span className="text-xl font-semibold text-slate-900">{stats.paymentCount.toLocaleString()}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* User Breakdown */}
      <Card className="border border-slate-100 bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
          <CardBody className="p-8">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">Populasi Pengguna</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">Regular Users</span>
                <span className="text-xl font-semibold text-slate-900">{stats.userCount.toLocaleString()}</span>
              </div>
              <Divider className="bg-slate-200/50" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">Administrators</span>
                <span className="text-xl font-semibold text-indigo-600">{stats.adminCount.toLocaleString()}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-xl shadow-slate-200/30 border border-white/50 bg-white/60 backdrop-blur-xl rounded-[40px] overflow-hidden relative">
        <CardBody className="p-0">
          <div className="p-8 md:p-10 border-b border-slate-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-900 rounded-3xl flex items-center justify-center text-white">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">Aktivitas Terbaru</h3>
                <p className="text-slate-500 text-sm font-medium">10 transaksi terakhir di platform</p>
              </div>
            </div>
            <Link href="/dashboard/admin/invoices">
              <Button 
                variant="flat" 
                endContent={<ChevronRight size={16} />} 
                className="font-semibold text-sm px-6 h-12 rounded-2xl bg-slate-100/80 backdrop-blur-md border border-slate-200/50"
              >
                Lihat Semua
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 font-semibold uppercase text-xs tracking-widest border-b border-slate-100/50">
                  <th className="py-6 px-10">Transaksi</th>
                  <th className="py-6 px-10 text-right">Nominal</th>
                  <th className="py-6 px-10 text-center">Status</th>
                  <th className="py-6 px-10 text-right">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/50 font-medium">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/40 transition-colors group">
                    <td className="py-8 px-10">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${invoice.type === "BILLING" ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                          {invoice.type === "BILLING" ? <Receipt size={18} /> : <CreditCard size={18} />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {invoice.type === "BILLING" ? "Penagihan" : "Pay-out"}
                          </p>
                          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-0.5">#{invoice.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-10 text-right">
                      <span className="font-semibold text-lg text-slate-900">
                        {formatCurrency(invoice.total_amount || 0)}
                      </span>
                    </td>
                    <td className="py-8 px-10 text-center">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="py-8 px-10 text-right text-xs text-slate-500 font-semibold uppercase tracking-wider">
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
    orange: "bg-orange-500/10 text-orange-600 border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white",
    indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white",
  };

  const cardContent = (
    <Card shadow="none" className="group h-full shadow-xl shadow-slate-200/30 border border-white/50 bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden hover:-translate-y-1 hover:bg-white/80 transition-all duration-500">
      <CardBody className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${bgClasses[color]}`}>
            {icon}
          </div>
          {change && (
            <div className={`flex items-center gap-1 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full ${positive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
              {positive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
              {change.split(' ')[0]}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">{label}</p>
          <p className="text-3xl font-semibold text-slate-900 tracking-tight">{value}</p>
          {change && (
            <p className="text-xs text-slate-400 mt-2.5 font-bold uppercase tracking-widest opacity-60">
              {change.includes('bulan ini') ? 'Vs bulan lalu' : change}
            </p>
          )}
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
