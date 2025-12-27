"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Clock,
  CheckCircle2,
  Plus,
  Send,
  ArrowRight
} from "lucide-react";
import { Button } from "@heroui/react";
import StatCard from "@/components/ui/StatCard";
import QuickActionCard from "@/components/ui/QuickActionCard";
import ActivityItem from "@/components/ui/ActivityItem";
import EmptyState from "@/components/ui/EmptyState";

interface DashboardStats {
  totalPenagihan: number;
  totalPembayaran: number;
  pendingAmount: number;
  paidAmount: number;
}

interface RecentInvoice {
  id: string;
  type: string;
  status: string;
  total_amount: number;
  created_at: string;
  recipient_name?: string;
}

interface UserDashboardClientProps {
  userName: string;
  companyName: string | null;
  stats: DashboardStats;
  recentInvoices: RecentInvoice[];
}

export default function UserDashboardClient({
  userName,
  companyName,
  stats,
  recentInvoices
}: UserDashboardClientProps) {

  const formatCompact = (amount: number) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}M`;
    }
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}Jt`;
    }
    if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(0)}Rb`;
    }
    return `Rp ${amount}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="relative space-y-8 md:space-y-12 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Greeting Section */}
      <motion.section variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
          Halo, {userName}
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          {companyName ? `Selamat datang kembali di ${companyName}.` : "Selamat datang kembali."}
        </p>
      </motion.section>

      {/* Stats Section */}
      <motion.section variants={itemVariants}>
        <h2 className="text-sm font-medium text-slate-500 mb-4">Ikhtisar Keuangan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <StatCard
            title="Total Penagihan"
            value={formatCompact(stats.totalPembayaran)}
            icon={CreditCard}
            variant="primary"
          />
          <StatCard
            title="Selesai Dibayar"
            value={formatCompact(stats.paidAmount)}
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            title="Menunggu Tindakan"
            value={formatCompact(stats.pendingAmount)}
            icon={Clock}
            variant="warning"
          />
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Left: Recent Activity */}
        <motion.section variants={itemVariants} className="lg:col-span-7 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-slate-500">Aktivitas Terbaru</h2>
            <Link 
              href="/dashboard/pembayaran" 
              className="group flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-orange-500 p-1 rounded-lg"
              aria-label="Lihat semua aktivitas pembayaran"
            >
              <span className="text-xs font-semibold text-slate-900 uppercase tracking-widest group-hover:text-orange-600 transition-colors">Lihat Semua</span>
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                <ArrowRight size={12} />
              </div>
            </Link>
          </div>

          <div className="flex-1">
            {recentInvoices.length > 0 ? (
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <ActivityItem
                    key={invoice.id}
                    id={invoice.id}
                    type={invoice.type as "BILLING" | "PAYMENT"}
                    recipientName={invoice.recipient_name || "Tanpa Nama"}
                    amount={invoice.total_amount}
                    status={invoice.status}
                    date={invoice.created_at}
                    href={`/dashboard/pembayaran`}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[32px] p-12">
                <EmptyState 
                  variant="payment"
                  title="Sangat sepi di sini..."
                  description="Belum ada aktivitas pembayaran. Mulai dengan membuat permintaan pembayaran pertama Anda."
                />
              </div>
            )}
          </div>
        </motion.section>

        {/* Right: Quick Actions */}
        <motion.section variants={itemVariants} className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-8">
             <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.3em]">Menu Akses Cepat</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <QuickActionCard
              href="/dashboard/pembayaran/buat"
              icon={Plus}
              label="Buat Pembayaran"
              description="Kirim permintaan dana ke supplier"
              color="orange"
            />
            <QuickActionCard
              href="/dashboard/supplier"
              icon={Send}
              label="Kelola Supplier"
              description="Input atau edit data supplier"
              color="blue"
            />
          </div>

          {/* Tips Card */}
          <motion.div 
            className="mt-12 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] text-white relative overflow-hidden shadow-2xl shadow-slate-900/20"
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full" />
            <div className="relative z-10">
              <h3 className="text-xl font-semibold tracking-tight mb-2">Tips Pro ✨</h3>
                  <p className="text-slate-500 font-medium line-clamp-2 mt-1 italic">&quot;Aktivitas terbaru akan muncul di sini seiring penggunaan aplikasi.&quot;</p>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed mt-2">
                    Gunakan fitur &quot;Kelola Supplier&quot; untuk menyimpan data rekening agar proses pembayaran lebih cepat di masa mendatang.
                  </p>
              <Button size="sm" className="mt-6 bg-white text-slate-900 font-semibold rounded-xl hover:bg-orange-500 hover:text-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
                PELAJARI LEBIH LANJUT
              </Button>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </motion.div>
  );
}
