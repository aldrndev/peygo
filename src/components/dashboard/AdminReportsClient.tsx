"use client";

import { Card, CardBody, Select, SelectItem, Progress, Button } from "@heroui/react";
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
  Filter
} from "lucide-react";

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
    <div className="relative space-y-8 pb-10">
      {/* Decorative Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] -z-10 pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-1">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest mb-4">
             <Activity size={12} />
             <span>Real-time Analytics</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Laporan Analitik
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Pantau pertumbuhan, performa finansial, dan keterlibatan pengguna.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="flat" isIconOnly className="h-12 w-12 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50">
            <Filter size={18} />
          </Button>
          <div className="flex-1 md:w-64">
            <Select 
                placeholder="6 Bulan Terakhir" 
                variant="bordered"
                startContent={<Calendar className="w-4 h-4 text-slate-400" />}
                classNames={{
                trigger: "bg-white/60 backdrop-blur-xl border-white/50 shadow-sm rounded-2xl h-12",
                }}
            >
                <SelectItem key="1month" className="font-semibold">1 Bulan Terakhir</SelectItem>
                <SelectItem key="3months" className="font-semibold">3 Bulan Terakhir</SelectItem>
                <SelectItem key="6months" className="font-semibold">6 Bulan Terakhir</SelectItem>
                <SelectItem key="1year" className="font-semibold">1 Tahun Terakhir</SelectItem>
            </Select>
          </div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative">
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
          icon={<Receipt className="w-5 h-5" />}
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
        <Card className="lg:col-span-8 shadow-lg shadow-slate-200/20 border border-white/50 bg-white/60 backdrop-blur-xl overflow-hidden rounded-[32px]">
          <CardBody className="p-0">
            <div className="p-8 border-b border-slate-100/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Tren Kinerja Bulanan</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Laporan Semester Berjalan</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs uppercase tracking-widest border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Insights</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-slate-400 font-semibold uppercase text-xs tracking-widest border-b border-slate-100/50">
                    <th className="py-6 px-10">Periode</th>
                    <th className="py-6 px-10 text-right">Volume</th>
                    <th className="py-6 px-10 text-right">Platform Fee</th>
                    <th className="py-6 px-10 text-center">Invoices</th>
                    <th className="py-6 px-10 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/50 font-medium">
                  {monthlyData.map((data, index) => (
                    <tr key={index} className="hover:bg-slate-50/40 transition-colors group">
                      <td className="py-6 px-10 font-semibold text-slate-900 capitalize">
                        {data.month} {data.year}
                      </td>
                      <td className="py-6 px-10 text-right font-semibold text-slate-700">
                        {formatCurrency(data.revenue)}
                      </td>
                      <td className="py-6 px-10 text-right font-bold text-emerald-600">
                        {formatCurrency(data.fees)}
                      </td>
                      <td className="py-6 px-10 text-center text-slate-400 font-bold">
                        {data.invoices}
                      </td>
                      <td className="py-6 px-10 text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-indigo-600 px-2 py-1 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                          <Users size={12} />
                          +{data.users}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-900/95 backdrop-blur-xl text-white">
                  <tr className="font-semibold italic">
                    <td className="py-6 px-10 uppercase text-xs font-bold tracking-[0.2em] opacity-60">Cumulative Total</td>
                    <td className="py-6 px-10 text-right text-lg tracking-tight">
                      {formatCurrency(monthlyData.reduce((acc, d) => acc + d.revenue, 0))}
                    </td>
                    <td className="py-6 px-10 text-right text-emerald-400 text-lg tracking-tight">
                      {formatCurrency(monthlyData.reduce((acc, d) => acc + d.fees, 0))}
                    </td>
                    <td className="py-6 px-10 text-center font-bold">
                      {monthlyData.reduce((acc, d) => acc + d.invoices, 0).toLocaleString()}
                    </td>
                    <td className="py-6 px-10 text-right">
                       <span className="text-white/60 font-bold">+{monthlyData.reduce((acc, d) => acc + d.users, 0)}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Breakdown Analysis Sidebars */}
        <div className="lg:col-span-4 space-y-6">
          {/* Invoice Type Breakdown */}
          <Card className="shadow-lg shadow-slate-200/20 border border-white/50 bg-white/60 backdrop-blur-xl rounded-[32px]">
            <CardBody className="p-8">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                  <PieChartIcon size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 leading-tight">Proporsi Transaksi</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Berdasarkan Tipe Dokumen</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <BreakdownItem 
                  label="Penagihan (Billing)"
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
            </CardBody>
          </Card>

          {/* Status Breakdown */}
          <Card className="shadow-2xl shadow-slate-200/40 border border-white/50 bg-white/60 backdrop-blur-xl rounded-[32px]">
            <CardBody className="p-8">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 border border-slate-100 flex items-center justify-center shadow-sm">
                  <Activity size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 leading-tight">Status Dokumen</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Distribusi Status Saat Ini</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { status: "PAID", label: "Lunas", color: "bg-emerald-500", text: "text-emerald-600" },
                  { status: "DISBURSED", label: "Dicairkan", color: "bg-emerald-400", text: "text-emerald-500" },
                  { status: "SENT", label: "Terkirim", color: "bg-orange-400", text: "text-orange-500" },
                  { status: "DRAFT", label: "Draft", color: "bg-slate-300", text: "text-slate-400" },
                  { status: "FAILED", label: "Gagal", color: "bg-rose-500", text: "text-rose-600" },
                ].map(({ status, label, color, text }) => (
                  <div key={status} className="flex items-center justify-between text-sm p-3 rounded-2xl hover:bg-slate-50/50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${color} shadow-sm shadow-slate-200`} />
                      <span className="text-slate-600 font-semibold">{label}</span>
                    </div>
                    <span className={`font-bold text-base ${text}`}>
                      {statusCounts[status] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
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
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white",
    orange: "bg-orange-500/10 text-orange-600 border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white",
    indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white",
  };

  return (
    <Card shadow="none" className="group h-full shadow-lg shadow-slate-200/20 border border-white/50 bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden hover:-translate-y-1 transition-all duration-500">
      <CardBody className="p-6">
        <div className="flex items-start justify-between mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${bgClasses[color]}`}>
            {icon}
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${change >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
              {change >= 0 ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">{label}</p>
          <p className="text-2xl font-semibold text-slate-900 tracking-tight">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}

function BreakdownItem({ label, value, total, icon, color }: { label: string, value: number, total: number, icon: React.ReactNode, color: "blue" | "orange" }) {
  const percentage = (value / (total || 1)) * 100;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-semibold">
        <div className="flex items-center gap-3 text-slate-700">
          <div className={`p-2 rounded-xl border ${color === "blue" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}>
            {icon}
          </div>
          <span className="tracking-tight">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-base text-slate-900">{value}</span>
          <span className="text-xs text-slate-400 ml-2 italic tracking-widest">({percentage.toFixed(0)}%)</span>
        </div>
      </div>
      <Progress 
        aria-label={label}
        size="sm"
        value={percentage}
        radius="full"
        classNames={{
          track: "bg-slate-100/50 backdrop-blur-sm",
          indicator: color === "blue" ? "bg-blue-600 shadow-lg shadow-blue-200" : "bg-orange-500 shadow-lg shadow-orange-200",
        }}
      />
    </div>
  );
}
