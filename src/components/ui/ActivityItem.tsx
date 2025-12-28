"use client";

import Link from "next/link";
import { Receipt, CreditCard, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItemProps {
  id: string;
  type: "BILLING" | "PAYMENT";
  recipientName: string;
  amount: number;
  status: string;
  date: string;
  href: string;
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  PAID: { color: "text-success", bg: "bg-success/10", label: "Terbayar" },
  DISBURSED: { color: "text-blue-600", bg: "bg-blue-50", label: "Dicairkan" },
  SENT: { color: "text-warning", bg: "bg-warning/10", label: "Terkirim" },
  DRAFT: { color: "text-muted-foreground", bg: "bg-muted", label: "Draft" },
  FAILED: { color: "text-destructive", bg: "bg-destructive/10", label: "Gagal" },
  EXPIRED: { color: "text-muted-foreground", bg: "bg-muted", label: "Kedaluwarsa" },
};

export default function ActivityItem({
  type,
  recipientName,
  amount,
  status,
  date,
  href,
}: ActivityItemProps) {
  const statusStyle = statusConfig[status] || statusConfig.DRAFT;
  const isBilling = type === "BILLING";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  return (
    <Link href={href} aria-label={`${isBilling ? "Penagihan" : "Pembayaran"} ${recipientName}: ${formatCurrency(amount)}, status ${statusStyle.label}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl">
      <div
        className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:bg-accent/50 transition-colors"
        tabIndex={-1}
      >
        {/* Icon */}
        <div className={cn(
          "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0",
          isBilling ? "bg-primary/10 text-primary" : "bg-blue-50 text-blue-600"
        )}>
          {isBilling ? <Receipt size={20} aria-hidden="true" /> : <CreditCard size={20} aria-hidden="true" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-foreground truncate text-sm">
              {recipientName || "Tanpa Nama"}
            </p>
            <p className="font-semibold text-foreground text-sm md:text-base whitespace-nowrap tabular-nums">
              {formatCurrency(amount)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 mt-1.5">
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded", statusStyle.bg, statusStyle.color)}>
              {statusStyle.label}
            </span>
            <span className="text-xs text-muted-foreground">{formatDate(date)}</span>
          </div>
        </div>

        {/* Arrow - hidden on mobile */}
        <ChevronRight size={16} className="text-muted-foreground/50 hidden md:block shrink-0" aria-hidden="true" />
      </div>
    </Link>
  );
}
