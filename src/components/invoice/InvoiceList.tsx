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
    <div className="relative space-y-6 md:space-y-8 pb-20">
      {/* Header - Desktop only */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            {title}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isBilling ? "Kelola daftar tagihan bisnis Anda." : "Kelola permintaan pembayaran supplier."}
          </p>
        </div>
        <Button 
          as={Link} 
          href={createLink}
          color="primary"
          size="sm"
          startContent={<Plus size={16} />}
          className="font-medium px-4 rounded-lg h-9"
          aria-label={`Buat ${title} Baru`}
        >
          Buat {title}
        </Button>
      </div>

      {/* Mobile Title */}
      <div className="md:hidden">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-slate-500">Filter & Pencarian</h2>
        
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <Input
            {...register("search")}
            placeholder={`Cari ${title.toLowerCase()}...`}
            startContent={<Search size={18} className="text-slate-400" />}
            className="flex-1"
            aria-label={`Cari ${title}`}
            classNames={{
              inputWrapper: "bg-white border-slate-100 border hover:border-slate-200 focus-within:border-orange-500 transition-all rounded-xl h-10 px-3",
              input: "text-sm text-slate-900 placeholder:text-slate-400",
            }}
          />
          
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg self-stretch md:self-auto">
            {filters.map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setValue("filter", f.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-orange-500 outline-none ${
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
        <div className="bg-white border border-slate-100 rounded-xl p-8">
          <EmptyState
            variant="billing"
            title={search || filter !== "all" ? "Tidak ditemukan" : `Belum ada ${title.toLowerCase()}`}
            description={
              search || filter !== "all"
                ? "Coba kata kunci lain atau ubah filter."
                : `Buat ${title.toLowerCase()} pertama Anda.`
            }
            action={
              !search && filter === "all"
                ? { label: `Buat ${title}`, href: createLink }
                : undefined
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map((invoice) => (
            <InvoiceItem key={invoice.id} invoice={invoice} />
          ))}
        </div>
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
    <Link href={`/dashboard/invoice/${invoice.id}`} aria-label={`Detail ${invoice.recipient_name || "Tanpa Nama"}, Total ${formatCurrency(invoice.total_amount)}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-xl">
      <div className="bg-white border border-slate-100 rounded-xl p-4 active:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${statusStyle.bg} flex items-center justify-center shrink-0`}>
            <StatusIcon size={20} className={statusStyle.iconColor} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-slate-900 truncate text-sm">
                {invoice.recipient_name || "Tanpa Nama"}
              </p>
              <p className="font-semibold text-slate-900 text-sm md:text-base shrink-0">
                {formatCurrency(invoice.total_amount)}
              </p>
            </div>
            
            <div className="flex items-center justify-between gap-2 mt-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusStyle.bg} ${statusStyle.color}`}>
                  {statusStyle.label}
                </span>
                <span className="text-xs text-slate-400 hidden md:inline">#{invoice.invoice_number}</span>
              </div>
              <span className="text-xs text-slate-400 hidden md:inline">{formatDate(invoice.created_at)}</span>
            </div>
          </div>

          {/* Arrow - hidden on mobile */}
          <ChevronRight size={16} className="text-slate-300 shrink-0 hidden md:block" />
        </div>
      </div>
    </Link>
  );
}
