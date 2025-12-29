"use client";

import { useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, FileText, ChevronRight, CreditCard, Clock, Check, AlertCircle, FileStack, type LucideIcon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { Invoice } from "@/types/database";
import EmptyState from "@/components/ui/EmptyState";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import StatCard from "@/components/ui/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimplePagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

interface InvoiceListProps {
  invoices: Invoice[];
  type: "BILLING" | "PAYMENT_REQUEST";
  pagination?: PaginationInfo;
}

type FilterStatus = "all" | "DRAFT" | "SENT" | "PAID" | "FAILED";

const statusConfig: Record<string, { color: string; bg: string; label: string; icon: LucideIcon; iconColor: string }> = {
  PAID: { color: "text-success", bg: "bg-success/10", label: "Terbayar", icon: Check, iconColor: "text-success" },
  DISBURSED: { color: "text-blue-600", bg: "bg-blue-50", label: "Dicairkan", icon: CreditCard, iconColor: "text-blue-600" },
  SENT: { color: "text-warning", bg: "bg-warning/10", label: "Terkirim", icon: Clock, iconColor: "text-warning" },
  DRAFT: { color: "text-muted-foreground", bg: "bg-muted", label: "Draft", icon: FileText, iconColor: "text-muted-foreground" },
  FAILED: { color: "text-destructive", bg: "bg-destructive/10", label: "Gagal", icon: AlertCircle, iconColor: "text-destructive" },
  EXPIRED: { color: "text-muted-foreground", bg: "bg-muted", label: "Kedaluwarsa", icon: AlertCircle, iconColor: "text-muted-foreground" },
};

export default function InvoiceList({ invoices, type, pagination }: InvoiceListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const { register, control, setValue } = useForm({
    defaultValues: {
      search: initialSearch,
      filter: "all" as FilterStatus,
    }
  });

  const search = useWatch({ control, name: "search", defaultValue: initialSearch });
  const filter = useWatch({ control, name: "filter", defaultValue: "all" as FilterStatus });
  
  useEffect(() => {
    if (initialSearch) {
      setValue("search", initialSearch);
    }
  }, [initialSearch, setValue]);
  
  const isBilling = type === "BILLING";
  const title = isBilling ? "Penjualan" : "Pembayaran";
  const createLink = isBilling ? "/dashboard/penjualan/buat" : "/dashboard/pembayaran/buat";
  const baseUrl = isBilling ? "/dashboard/penjualan" : "/dashboard/pembayaran";
  
  const filters: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "DRAFT", label: "Draft" },
    { key: "SENT", label: "Terkirim" },
    { key: "PAID", label: "Lunas" },
  ];

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = 
        inv.recipient_name?.toLowerCase().includes(search.toLowerCase()) ||
        inv.invoice_number?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || inv.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [invoices, search, filter]);

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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${baseUrl}?${params.toString()}`);
  };

  return (
    <div className="relative space-y-6 md:space-y-8 pb-20">
      {/* Header - Desktop only */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isBilling ? "Kelola daftar tagihan bisnis Anda." : "Kelola catatan pembayaran supplier."}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href={createLink}>
            <Plus size={16} className="mr-2" />
            Buat {title}
          </Link>
        </Button>
      </div>

      {/* Mobile Title */}
      <div className="md:hidden">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <StatCard title={`Total ${title}`} value={formatCurrencyShort(totalAmount)} icon={FileStack} variant="primary" />
        <StatCard title="Menunggu Tindakan" value={formatCurrencyShort(pendingAmount)} icon={Clock} variant="warning" />
        <StatCard title="Selesai Dibayar" value={formatCurrencyShort(paidAmount)} icon={Check} variant="success" />
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Filter & Pencarian</h2>
        
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("search")}
              placeholder={`Cari ${title.toLowerCase()}...`}
              className="pl-10"
              aria-label={`Cari ${title}`}
            />
          </div>
          
          <div className="flex gap-1.5 p-1 bg-muted rounded-lg self-stretch md:self-auto">
            {filters.map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setValue("filter", f.key)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring outline-none",
                  filter === f.key 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
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
        <div className="bg-card border border-border rounded-xl p-8">
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

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <SimplePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Pagination Info */}
      {pagination && pagination.totalCount > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          Menampilkan {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)} dari {pagination.totalCount} data
        </p>
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
    <Link 
      href={`/dashboard/invoice/${invoice.id}`} 
      aria-label={`Detail ${invoice.recipient_name || "Tanpa Nama"}, Total ${formatCurrency(invoice.total_amount)}`} 
      className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <div className="bg-card border border-border rounded-xl p-4 hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0", statusStyle.bg)}>
            <StatusIcon size={20} className={statusStyle.iconColor} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-foreground truncate text-sm">
                {invoice.recipient_name || "Tanpa Nama"}
              </p>
              <p className="font-semibold text-foreground text-sm md:text-base shrink-0 tabular-nums">
                {formatCurrency(invoice.total_amount)}
              </p>
            </div>
            
            <div className="flex items-center justify-between gap-2 mt-1.5">
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded", statusStyle.bg, statusStyle.color)}>
                  {statusStyle.label}
                </span>
                <span className="text-xs text-muted-foreground hidden md:inline">#{invoice.invoice_number}</span>
              </div>
              <span className="text-xs text-muted-foreground hidden md:inline">{formatDate(invoice.created_at)}</span>
            </div>
          </div>

          <ChevronRight size={16} className="text-muted-foreground/50 shrink-0 hidden md:block" />
        </div>
      </div>
    </Link>
  );
}
