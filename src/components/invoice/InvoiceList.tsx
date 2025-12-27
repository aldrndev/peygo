"use client";

import { useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Input } from "@heroui/react";
import { Plus, Search, FileText, ChevronRight, CreditCard, Clock, Check, AlertCircle, FileStack, type LucideIcon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { Invoice } from "@/types/database";
import EmptyState from "@/components/ui/EmptyState";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import StatCard from "@/components/ui/StatCard";

interface InvoiceListProps {
  invoices: Invoice[];
  type: "BILLING" | "PAYMENT_REQUEST";
}

type FilterStatus = "all" | "DRAFT" | "SENT" | "PAID" | "FAILED";

const statusConfig: Record<string, { color: string; bg: string; label: string; icon: LucideIcon; iconColor: string }> = {
  PAID: { color: "text-emerald-700", bg: "bg-emerald-50", label: "Terbayar", icon: Check, iconColor: "text-emerald-600" },
  DISBURSED: { color: "text-blue-700", bg: "bg-blue-50", label: "Dicairkan", icon: CreditCard, iconColor: "text-blue-600" },
  SENT: { color: "text-orange-700", bg: "bg-orange-50", label: "Terkirim", icon: Clock, iconColor: "text-orange-600" },
  DRAFT: { color: "text-slate-500", bg: "bg-slate-100", label: "Draft", icon: FileText, iconColor: "text-slate-400" },
  FAILED: { color: "text-rose-700", bg: "bg-rose-50", label: "Gagal", icon: AlertCircle, iconColor: "text-rose-600" },
  EXPIRED: { color: "text-slate-400", bg: "bg-slate-100", label: "Kedaluwarsa", icon: AlertCircle, iconColor: "text-slate-400" },
};

export default function InvoiceList({ invoices, type }: InvoiceListProps) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const { register, control, setValue } = useForm({
    defaultValues: {
      search: initialSearch,
      filter: "all" as FilterStatus,
    }
  });

  // Watch values using useWatch for React Compiler compatibility
  const search = useWatch({ control, name: "search", defaultValue: initialSearch });
  const filter = useWatch({ control, name: "filter", defaultValue: "all" as FilterStatus });
  
  // Update search field if query param changes
  useEffect(() => {
    if (initialSearch) {
      setValue("search", initialSearch);
    }
  }, [initialSearch, setValue]);
  
  const isBilling = type === "BILLING";
  const title = isBilling ? "Penagihan" : "Pembayaran";
  const createLink = isBilling ? "/dashboard/penagihan/buat" : "/dashboard/pembayaran/buat";
  const filters: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "DRAFT", label: "Draft" },
    { key: "SENT", label: "Terkirim" },
    { key: "PAID", label: "Lunas" },
  ];

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = 
        inv.recipient_name?.toLowerCase().includes(search.toLowerCase()) ||
        inv.invoice_number?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || inv.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [invoices, search, filter]);

  // Calculate Stats
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
  const pendingAmount = invoices
    .filter(inv => inv.status === "SENT" || inv.status === "DRAFT")
    .reduce((sum, inv) => sum + inv.total_amount, 0);
  const paidAmount = invoices
    .filter(inv => inv.status === "PAID" || inv.status === "DISBURSED")
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const formatCurrencyShort = (value: number) => {
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}Jt`;
    if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}Rb`;
    return `Rp ${value}`;
  };

  return (
    <div className="relative space-y-10 pb-20">
      {/* Decorative Blur Elements (Admin Style) */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/5 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-orange-400/5 blur-[150px] -z-10 pointer-events-none" />

      {/* Header - Desktop only */}
      <div className="hidden md:flex justify-between items-center relative">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900 tracking-tighter leading-none">
            {title}
          </h1>
          <p className="text-slate-500 text-lg font-medium mt-2">
            {isBilling ? "Kelola daftar tagihan bisnis Anda." : "Kelola permintaan pembayaran supplier."}
          </p>
        </div>
        <Button 
          as={Link} 
          href={createLink}
          color="primary"
          startContent={<Plus size={20} />}
          className="font-semibold px-8 rounded-2xl h-12"
          aria-label={`Buat ${title} Baru`}
        >
          BUAT {title.toUpperCase()}
        </Button>
      </div>

      {/* Mobile Title */}
      <div className="md:hidden flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tighter">{title}</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title={`Total ${title}`} 
          value={formatCurrencyShort(totalAmount)} 
          icon={FileStack} 
          variant="primary"
        />
        <StatCard 
          title="Menunggu Tindakan" 
          value={formatCurrencyShort(pendingAmount)} 
          icon={Clock} 
          variant="warning"
        />
        <StatCard 
          title="Selesai Dibayar" 
          value={formatCurrencyShort(paidAmount)} 
          icon={Check} 
          variant="success"
        />
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
           <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap">Filter & Pencarian</h2>
           <div className="h-px flex-1 bg-slate-200/50" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            {...register("search")}
            placeholder={`Cari berdasarkan nama atau nomor ${title.toLowerCase()}...`}
            startContent={<Search size={20} className="text-slate-500" />}
            className="flex-1"
            aria-label={`Cari ${title}`}
            classNames={{
              inputWrapper: "bg-white/60 backdrop-blur-xl border-white/50 border hover:bg-white focus-within:bg-orange-50/50 focus-within:border-orange-500 transition-all rounded-2xl h-14 px-4",
              input: "font-medium text-slate-900 placeholder:text-slate-500",
            }}
          />
          
          <div className="flex gap-2 min-w-max p-1 bg-slate-100 rounded-[18px] self-stretch md:self-auto">
            {filters.map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setValue("filter", f.key)}
                className={`px-6 py-2.5 rounded-2xl text-xs uppercase font-semibold tracking-widest transition-all focus-visible:ring-2 focus-visible:ring-orange-500 outline-none ${
                  filter === f.key 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
                aria-pressed={filter === f.key}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[32px] p-12">
          <EmptyState
            variant="billing"
            title={search || filter !== "all" ? "Pencarian tidak ditemukan" : `Belum ada ${title.toLowerCase()}`}
            description={
              search || filter !== "all"
                ? "Coba gunakan kata kunci lain atau ubah filter status."
                : `Klik tombol 'Buat ${title}' untuk memulai record pertama Anda.`
            }
            action={
              !search && filter === "all"
                ? { label: `Buat ${title}`, href: createLink }
                : undefined
            }
          />
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <InvoiceItem invoice={invoice} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Mobile FAB */}
      <div className="md:hidden">
        <FloatingActionButton primaryHref={createLink} primaryLabel={`Buat ${title}`} />
      </div>
    </div>
  );
}

function InvoiceItem({ invoice }: { invoice: Invoice }) {
  const statusStyle = statusConfig[invoice.status] || statusConfig.DRAFT;
  const StatusIcon = statusStyle.icon;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <Link href={`/dashboard/invoice/${invoice.id}`} aria-label={`Detail ${invoice.recipient_name || "Tanpa Nama"}, Total ${formatCurrency(invoice.total_amount)}`}>
      <motion.div
        className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 transition-all duration-500 group relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-6 relative z-10">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl ${statusStyle.bg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500 shadow-sm`}>
            <StatusIcon size={26} className={statusStyle.iconColor} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-1">
              <p className="font-semibold text-slate-900 truncate text-[13px] tracking-tight uppercase leading-none">
                {invoice.recipient_name || "Tanpa Nama"}
              </p>
              <p className="font-semibold text-slate-900 text-lg tracking-tighter leading-none shrink-0">
                {formatCurrency(invoice.total_amount)}
              </p>
            </div>
            
            <div className="flex items-center justify-between gap-3 mt-3">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg uppercase tracking-widest ${statusStyle.bg} ${statusStyle.color}`}>
                  {statusStyle.label}
                </span>
                <span className="text-xs font-semibold text-slate-500 tracking-widest uppercase">#{invoice.invoice_number}</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-right">{formatDate(invoice.created_at)}</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 shrink-0">
            <ChevronRight size={18} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
