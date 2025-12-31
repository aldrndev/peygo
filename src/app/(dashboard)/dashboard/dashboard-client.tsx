"use client";

import Link from "next/link";
import { 
  CreditCard, 
  Clock,
  CheckCircle2,
  Plus,
  Send,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/ui/StatCard";
import QuickActionCard from "@/components/ui/QuickActionCard";
import ActivityItem from "@/components/ui/ActivityItem";
import EmptyState from "@/components/ui/EmptyState";
import { useInvoiceStats, useRecentInvoices } from "@/hooks/queries/use-invoices";

interface DashboardClientProps {
  userName: string;
  companyName: string | null;
}

export default function DashboardClient({
  userName,
  companyName,
}: DashboardClientProps) {
  // Use React Query hooks - data is already in cache from SSR hydration
  const { data: stats } = useInvoiceStats();
  const { data: recentInvoices } = useRecentInvoices(5);

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

  // Stats with fallback defaults
  const displayStats = stats ?? {
    totalPenagihan: 0,
    totalPembayaran: 0,
    pendingAmount: 0,
    paidAmount: 0,
  };

  return (
    <div className="relative space-y-8 md:space-y-12 pb-20">
      {/* Greeting Section */}
      <section>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          Halo, {userName}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {companyName ? `Selamat datang kembali di ${companyName}.` : "Selamat datang kembali."}
        </p>
      </section>

      {/* Stats Section */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-4">Ikhtisar Keuangan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <StatCard
            title="Total Penagihan"
            value={formatCompact(displayStats.totalPembayaran)}
            icon={CreditCard}
            variant="primary"
          />
          <StatCard
            title="Selesai Dibayar"
            value={formatCompact(displayStats.paidAmount)}
            icon={CheckCircle2}
            variant="success"
          />
          <StatCard
            title="Menunggu Tindakan"
            value={formatCompact(displayStats.pendingAmount)}
            icon={Clock}
            variant="warning"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Left: Recent Activity */}
        <section className="lg:col-span-7 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">Aktivitas Terbaru</h2>
            <Link 
              href="/dashboard/pembayaran" 
              className="group flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring p-1 rounded-lg"
              aria-label="Lihat semua aktivitas pembayaran"
            >
              <span className="text-xs font-semibold text-foreground uppercase tracking-wide group-hover:text-primary transition-colors">Lihat Semua</span>
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <ArrowRight size={12} />
              </div>
            </Link>
          </div>

          <div className="flex-1">
            {recentInvoices && recentInvoices.length > 0 ? (
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <ActivityItem
                    key={invoice.id}
                    id={invoice.id}
                    type={invoice.type as "BILLING" | "PAYMENT"}
                    recipientName={invoice.recipient_name || "Tanpa Nama"}
                    amount={invoice.total_amount ?? 0}
                    status={invoice.status}
                    date={invoice.created_at}
                    href={`/dashboard/pembayaran`}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-12">
                <EmptyState 
                  variant="payment"
                  title="Sangat sepi di sini..."
                  description="Belum ada aktivitas pembayaran. Mulai dengan mencatat pembayaran pertama Anda."
                />
              </div>
            )}
          </div>
        </section>

        {/* Right: Quick Actions */}
        <section className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-8">
             <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Menu Akses Cepat</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <QuickActionCard
              href="/dashboard/penjualan/buat"
              icon={Plus}
              label="Buat Penjualan"
              description="Tagih invoice ke pelanggan"
              color="blue"
            />
            <QuickActionCard
              href="/dashboard/pembayaran/buat"
              icon={Plus}
              label="Buat Pembayaran"
              description="Catat pembayaran ke supplier"
              color="orange"
            />
            <QuickActionCard
              href="/dashboard/supplier"
              icon={Send}
              label="Kelola Supplier"
              description="Input atau edit data supplier"
              color="purple"
            />
          </div>

          {/* Tips Card */}
          <div className="mt-12 p-8 bg-foreground rounded-xl text-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full" />
            <div className="relative z-10">
              <h3 className="text-xl font-semibold tracking-tight mb-2">Tips Pro ✨</h3>
                  <p className="text-background/50 font-medium line-clamp-2 mt-1 italic">&quot;Aktivitas terbaru akan muncul di sini seiring penggunaan aplikasi.&quot;</p>
                  <p className="text-background/70 text-sm font-medium leading-relaxed mt-2">
                    Gunakan fitur &quot;Kelola Supplier&quot; untuk menyimpan data rekening agar proses pembayaran lebih cepat di masa mendatang.
                  </p>
              <Button size="sm" variant="secondary" className="mt-6">
                PELAJARI LEBIH LANJUT
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
