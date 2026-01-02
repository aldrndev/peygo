"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { type InvoiceRow, type UserActivityRow } from "@/lib/api/admin-reports-filtered";

interface DrillDownSheetProps {
  open: boolean;
  onClose: () => void;
  type: "revenue" | "invoices" | "users" | "fees" | null;
  invoices?: InvoiceRow[];
  users?: UserActivityRow[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateStr: string) => string;
}

export default function DrillDownSheet({
  open,
  onClose,
  type,
  invoices = [],
  users = [],
  formatCurrency,
  formatDate,
}: DrillDownSheetProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!type) return null;

  const getTitleAndDescription = () => {
    switch (type) {
      case "revenue":
        return {
          title: "Detail Revenue",
          description: "Invoice yang sudah dibayar (PAID & DISBURSED)",
        };
      case "invoices":
        return {
          title: "Detail Invoice",
          description: "Semua invoice sesuai filter yang aktif",
        };
      case "users":
        return {
          title: "Detail User",
          description: "User dengan aktivitas invoice di periode ini",
        };
      case "fees":
        return {
          title: "Detail Platform Fee",
          description: "Invoice dengan platform fee",
        };
      default:
        return { title: "", description: "" };
    }
  };

  const { title, description } = getTitleAndDescription();

  // Pagination logic
  const paginateData = <T,>(data: T[]): T[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(
    (type === "users" ? users.length : invoices.length) / itemsPerPage
  );

  const handleRowClick = (id: string, type: "invoice" | "user") => {
    if (type === "invoice") {
      router.push(`/dashboard/invoice/${id}`);
    } else {
      router.push(`/dashboard/admin/users/${id}`);
    }
    onClose();
  };

  const renderInvoiceTable = (data: InvoiceRow[]) => {const paginatedData = paginateData(data);

    if (paginatedData.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p>Tidak ada data</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-slate-50 dark:bg-slate-900">
              <th className="text-left p-3 text-xs font-semibold uppercase">Invoice #</th>
              <th className="text-left p-3 text-xs font-semibold uppercase">Type</th>
              <th className="text-left p-3 text-xs font-semibold uppercase">Status</th>
              <th className="text-right p-3 text-xs font-semibold uppercase">Amount</th>
              <th className="text-right p-3 text-xs font-semibold uppercase">Fee</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((invoice) => (
              <tr
                key={invoice.id}
                onClick={() => handleRowClick(invoice.id, "invoice")}
                className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
              >
                <td className="p-3 text-sm">
                  <div className="flex items-center gap-2">
                    {invoice.invoice_number || "-"}
                    <ExternalLink size={12} className="text-muted-foreground" />
                  </div>
                </td>
                <td className="p-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      invoice.type === "BILLING"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {invoice.type === "BILLING" ? "Billing" : "Payment"}
                  </span>
                </td>
                <td className="p-3 text-sm">{invoice.status}</td>
                <td className="p-3 text-sm text-right font-semibold">
                  {formatCurrency(invoice.total_amount)}
                </td>
                <td className="p-3 text-sm text-right text-orange-600">
                  {formatCurrency(invoice.platform_fee)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderUserTable = (data: UserActivityRow[]) => {
    const paginatedData = paginateData(data);

    if (paginatedData.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p>Tidak ada data</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-slate-50 dark:bg-slate-900">
              <th className="text-left p-3 text-xs font-semibold uppercase">Name</th>
              <th className="text-center p-3 text-xs font-semibold uppercase">Invoices</th>
              <th className="text-right p-3 text-xs font-semibold uppercase">Revenue</th>
              <th className="text-right p-3 text-xs font-semibold uppercase">Fees</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((user) => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user.id, "user")}
                className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
              >
                <td className="p-3 text-sm">
                  <div className="flex items-center gap-2">
                    {user.name || "-"}
                    <ExternalLink size={12} className="text-muted-foreground" />
                  </div>
                </td>
                <td className="p-3 text-sm text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                    {user.invoiceCount}
                  </span>
                </td>
                <td className="p-3 text-sm text-right font-semibold text-emerald-600">
                  {formatCurrency(user.totalRevenue)}
                </td>
                <td className="p-3 text-sm text-right text-orange-600">
                  {formatCurrency(user.totalFees)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader className="mb-6">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {/* Table */}
          {type === "users"
            ? renderUserTable(users)
            : renderInvoiceTable(invoices)}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-border rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-border rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
