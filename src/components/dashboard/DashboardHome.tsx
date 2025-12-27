"use client";

import { Button, Card, CardBody, CardHeader, Link } from "@heroui/react";
import { Plus, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHomeProps {
  user: { email?: string; id: string } | null;
  profile: { name: string } | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function DashboardHome({ user, profile }: DashboardHomeProps) {
  return (
    <motion.div 
      className="space-y-6 md:space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-default-500 text-sm md:text-base mt-2 font-medium">
            Halo, {profile?.name || user?.email?.split('@')[0]}! 👋
          </p>
        </div>
        <Button 
          as={Link} 
          href="/dashboard/invoice/buat" 
          color="primary"
          size="lg"
          className="w-full sm:w-auto font-medium"
          startContent={<Plus size={20} />}
        >
          Buat Invoice Baru
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={itemVariants}
      >
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
      </motion.div>

      {/* Recent Invoices */}
      <motion.div variants={itemVariants}>
        <Card className="border border-white/40 bg-white/60 backdrop-blur-xl shadow-sm rounded-[32px]">
          <CardHeader className="px-4 md:px-6 py-4 border-b border-white/20">
            <h3 className="text-base md:text-lg font-semibold text-default-900">Riwayat Invoice Terbaru</h3>
          </CardHeader>
          <CardBody className="p-0">
            <div className="text-center py-12 md:py-16 text-default-400">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-default-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="opacity-50" />
              </div>
              <p className="max-w-xs mx-auto text-sm px-4 font-medium">
                Belum ada invoice. Mulai tagih klien Anda sekarang!
              </p>
              <Button 
                as={Link}
                href="/dashboard/invoice/buat"
                color="primary"
                variant="flat"
                className="mt-4 font-semibold rounded-xl"
              >
                Buat Invoice
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
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
    <Card className="border border-white/40 bg-white/60 backdrop-blur-xl shadow-sm rounded-[32px]">
      <CardBody className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-white border border-slate-100 shrink-0 shadow-sm">
            {icon}
          </div>
          <p className="text-sm font-semibold text-default-500 uppercase tracking-widest">{title}</p>
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold text-default-900 tracking-tighter">{value}</h3>
          <p className="text-[10px] text-default-400 font-semibold uppercase tracking-widest mt-2">{subtitle}</p>
        </div>
      </CardBody>
    </Card>
  );
}
