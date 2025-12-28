"use client";

import Link from "next/link";
import { Plus, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardHomeProps {
  user: { email?: string; id: string } | null;
  profile: { name: string } | null;
}

export default function DashboardHome({ user, profile }: DashboardHomeProps) {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base mt-2">
            Halo, {profile?.name || user?.email?.split('@')[0]}! 👋
          </p>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/dashboard/invoice/buat">
            <Plus size={20} className="mr-2" />
            Buat Invoice Baru
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard 
          title="Total Pendapatan" 
          value="Rp 0" 
          icon={<TrendingUp className="text-success" size={20} />}
          subtitle="+0% dari bulan lalu"
        />
        <SummaryCard 
          title="Menunggu Pembayaran" 
          value="Rp 0" 
          icon={<Clock className="text-warning" size={20} />}
          subtitle="0 invoice pending"
        />
        <SummaryCard 
          title="Invoice Terkirim" 
          value="0" 
          icon={<CheckCircle className="text-primary" size={20} />}
          subtitle="Total semua waktu"
        />
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base md:text-lg">Riwayat Invoice Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="text-center py-12 md:py-16 text-muted-foreground">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={28} className="opacity-50" />
            </div>
            <p className="max-w-xs mx-auto text-sm px-4">
              Belum ada invoice. Mulai tagih klien Anda sekarang!
            </p>
            <Button asChild variant="secondary" className="mt-4">
              <Link href="/dashboard/invoice/buat">
                Buat Invoice
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ 
  title, 
  value, 
  icon, 
  subtitle 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  subtitle: string 
}) {
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-muted shrink-0">
            {icon}
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight tabular-nums">{value}</h3>
          <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}
