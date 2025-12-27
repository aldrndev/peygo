"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface InvoiceCardProps {
  id: string;
  recipientName: string;
  amount: number;
  status: string;
  date: string;
  invoiceNumber?: string;
  href: string;
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  PAID: { color: "text-green-700", bg: "bg-green-100", label: "Lunas" },
  DISBURSED: { color: "text-blue-700", bg: "bg-blue-100", label: "Dicairkan" },
  SENT: { color: "text-amber-700", bg: "bg-amber-100", label: "Terkirim" },
  DRAFT: { color: "text-gray-600", bg: "bg-gray-100", label: "Draft" },
  FAILED: { color: "text-red-700", bg: "bg-red-100", label: "Gagal" },
  EXPIRED: { color: "text-red-700", bg: "bg-red-100", label: "Kedaluwarsa" },
};

export default function InvoiceCard({
  recipientName,
  amount,
  status,
  date,
  invoiceNumber,
  href,
}: InvoiceCardProps) {
  const statusStyle = statusConfig[status] || statusConfig.DRAFT;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { 
      day: "numeric", 
      month: "short",
      year: "numeric"
    });
  };

  return (
    <Link href={href}>
      <motion.div
        className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-orange-200 hover:shadow-sm transition-all"
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {recipientName || "Tanpa Nama"}
            </p>
            {invoiceNumber && (
              <p className="text-xs text-gray-400 mt-0.5">#{invoiceNumber}</p>
            )}
            <p className="text-lg font-bold text-gray-900 mt-2">
              {formatCurrency(amount)}
            </p>
          </div>

          {/* Right Content */}
          <div className="flex flex-col items-end gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${statusStyle.bg} ${statusStyle.color}`}>
              {statusStyle.label}
            </span>
            <span className="text-xs text-gray-400">{formatDate(date)}</span>
          </div>
        </div>

        {/* Mobile hint arrow */}
        <div className="flex justify-end mt-2 md:hidden">
          <ChevronRight size={16} className="text-gray-300" />
        </div>
      </motion.div>
    </Link>
  );
}
