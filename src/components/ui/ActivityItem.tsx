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
    <Link href={href}>
      <motion.div
        className="flex items-center gap-4 p-5 bg-white/60 backdrop-blur-xl rounded-[24px] border border-white/50 transition-all duration-500 group outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm ${
          isBilling ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
        }`}>
          {isBilling ? <Receipt size={24} /> : <CreditCard size={24} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold text-slate-900 truncate text-[13px] tracking-tight uppercase leading-none">
              {recipientName || "Tanpa Nama"}
            </p>
            <p className="font-semibold text-slate-900 text-base tracking-tighter leading-none">
              {formatCurrency(amount)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 mt-2.5">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg uppercase tracking-widest ${statusStyle.bg} ${statusStyle.color}`}>
              {statusStyle.label}
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{formatDate(date)}</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
          <ChevronRight size={18} className="text-white" />
        </div>
      </motion.div>
    </Link>
  );
}
