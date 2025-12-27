"use client";

import Link from "next/link";
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
  PAID: { color: "text-green-700", bg: "bg-green-50", label: "Lunas" },
  DISBURSED: { color: "text-blue-700", bg: "bg-blue-50", label: "Dicairkan" },
  SENT: { color: "text-amber-700", bg: "bg-amber-50", label: "Terkirim" },
  DRAFT: { color: "text-gray-600", bg: "bg-gray-100", label: "Draft" },
  FAILED: { color: "text-red-700", bg: "bg-red-50", label: "Gagal" },
  EXPIRED: { color: "text-red-700", bg: "bg-red-50", label: "Kedaluwarsa" },
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
    <Link href={href} aria-label={`Invoice ${recipientName}: ${formatCurrency(amount)}, status ${statusStyle.label}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-xl">
      <div className="bg-white rounded-xl border border-slate-100 p-4 active:bg-slate-50 transition-colors">
        <div className="flex items-center justify-between gap-3">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 text-sm truncate">
              {recipientName || "Tanpa Nama"}
            </p>
            {invoiceNumber && (
              <p className="text-xs text-slate-400 mt-0.5">#{invoiceNumber}</p>
            )}
          </div>

          {/* Right Content */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-semibold text-slate-900 text-sm md:text-base">
                {formatCurrency(amount)}
              </p>
              <div className="flex items-center gap-2 mt-1 justify-end">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusStyle.bg} ${statusStyle.color}`}>
                  {statusStyle.label}
                </span>
                <span className="text-xs text-slate-400 hidden md:inline">{formatDate(date)}</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300 shrink-0 hidden md:block" aria-hidden="true" />
          </div>
        </div>
      </div>
    </Link>
  );
}
