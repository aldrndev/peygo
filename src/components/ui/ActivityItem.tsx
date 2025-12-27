"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Receipt, CreditCard, ChevronRight } from "lucide-react";

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
  PAID: { color: "text-emerald-700", bg: "bg-emerald-50", label: "Terbayar" },
  DISBURSED: { color: "text-blue-700", bg: "bg-blue-50", label: "Dicairkan" },
  SENT: { color: "text-orange-700", bg: "bg-orange-50", label: "Terkirim" },
  DRAFT: { color: "text-slate-500", bg: "bg-slate-100", label: "Draft" },
  FAILED: { color: "text-rose-700", bg: "bg-rose-50", label: "Gagal" },
  EXPIRED: { color: "text-slate-400", bg: "bg-slate-100", label: "Kedaluwarsa" },
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
    <Link href={href} aria-label={`${isBilling ? "Penagihan" : "Pembayaran"} ${recipientName}: ${formatCurrency(amount)}, status ${statusStyle.label}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-xl">
      <div
        className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 active:bg-slate-50 transition-colors"
        tabIndex={-1}
      >
        {/* Icon */}
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${
          isBilling ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
        }`}>
          {isBilling ? <Receipt size={20} aria-hidden="true" /> : <CreditCard size={20} aria-hidden="true" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-slate-900 truncate text-sm">
              {recipientName || "Tanpa Nama"}
            </p>
            <p className="font-semibold text-slate-900 text-sm md:text-base whitespace-nowrap">
              {formatCurrency(amount)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 mt-1.5">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusStyle.bg} ${statusStyle.color}`}>
              {statusStyle.label}
            </span>
            <span className="text-xs text-slate-400">{formatDate(date)}</span>
          </div>
        </div>

        {/* Arrow - hidden on mobile */}
        <ChevronRight size={16} className="text-slate-300 hidden md:block shrink-0" aria-hidden="true" />
      </div>
    </Link>
  );
}
