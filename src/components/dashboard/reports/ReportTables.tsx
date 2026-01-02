"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, ExternalLink, User, FileText, Calendar } from "lucide-react";
import { SimplePagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { 
  type PaginatedResult,
  type InvoiceRow,
  type UserActivityRow,
  type MonthlyRow,
} from "@/lib/api/admin-reports-filtered";
import { StatusBadge } from "./ReportComponents";

// Empty state component
function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/20">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon size={28} className="text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

interface InvoiceTableProps {
  invoices: PaginatedResult<InvoiceRow>;
  onPageChange: (page: number) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateStr: string) => string;
}

export function InvoiceTable({ 
  invoices, 
  onPageChange, 
  formatCurrency, 
  formatDate 
}: InvoiceTableProps) {
  if (invoices.data.length === 0) {
    return <EmptyState icon={FileText} message="Tidak ada invoice dalam periode ini" />;
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Tipe
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Nominal
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                Fee
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                Tanggal
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
            {invoices.data.map((inv) => (
              <tr 
                key={inv.id} 
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-4 py-4">
                  <Link 
                    href={`/dashboard/admin/invoices/${inv.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline"
                  >
                    {inv.invoice_number || "Draft"}
                  </Link>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{inv.userName}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded text-xs font-medium",
                    inv.type === "BILLING" 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {inv.type === "BILLING" ? "Billing" : "Payment"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={inv.status} />
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {formatCurrency(inv.total_amount)}
                  </span>
                </td>
                <td className="px-4 py-4 text-right hidden md:table-cell">
                  <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                    {formatCurrency(inv.platform_fee)}
                  </span>
                </td>
                <td className="px-4 py-4 text-right hidden lg:table-cell">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(inv.created_at)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {invoices.totalPages > 1 && (
        <div className="space-y-2">
          <div className="flex justify-center">
            <SimplePagination 
              currentPage={invoices.page}
              totalPages={invoices.totalPages}
              onPageChange={onPageChange}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Total {invoices.total} invoice
          </p>
        </div>
      )}
    </div>
  );
}

interface UserTableProps {
  users: PaginatedResult<UserActivityRow>;
  onPageChange: (page: number) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateStr: string) => string;
}

export function UserTable({ 
  users, 
  onPageChange, 
  formatCurrency, 
  formatDate 
}: UserTableProps) {
  if (users.data.length === 0) {
    return <EmptyState icon={User} message="Tidak ada user terdaftar" />;
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                Fee
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                Bergabung
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
            {users.data.map((user) => (
              <tr 
                key={user.id} 
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-4 py-4">
                  <Link 
                    href={`/dashboard/admin/users/${user.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline"
                  >
                    {user.name || "Unnamed"}
                  </Link>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {user.invoiceCount}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatCurrency(user.totalRevenue)}
                  </span>
                </td>
                <td className="px-4 py-4 text-right hidden md:table-cell">
                  <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                    {formatCurrency(user.totalFees)}
                  </span>
                </td>
                <td className="px-4 py-4 text-right hidden lg:table-cell">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(user.joinedAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {users.totalPages > 1 && (
        <div className="space-y-2">
          <div className="flex justify-center">
            <SimplePagination 
              currentPage={users.page}
              totalPages={users.totalPages}
              onPageChange={onPageChange}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Total {users.total} user
          </p>
        </div>
      )}
    </div>
  );
}

interface MonthlyTableProps {
  monthly: MonthlyRow[];
  formatCurrency: (amount: number) => string;
}

export function MonthlyTable({ monthly, formatCurrency }: MonthlyTableProps) {
  if (monthly.length === 0) {
    return <EmptyState icon={Calendar} message="Tidak ada data bulanan" />;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Bulan
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Invoice
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Revenue
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
              Fee
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
              User Baru
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Pertumbuhan
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
          {monthly.map((m) => (
            <tr 
              key={`${m.month}-${m.year}`} 
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td className="px-4 py-4">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {m.month} {m.year}
                </span>
              </td>
              <td className="px-4 py-4 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm font-semibold text-blue-700 dark:text-blue-400">
                  {m.invoices}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {formatCurrency(m.revenue)}
                </span>
              </td>
              <td className="px-4 py-4 text-right hidden md:table-cell">
                <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                  {formatCurrency(m.fees)}
                </span>
              </td>
              <td className="px-4 py-4 text-center hidden md:table-cell">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 text-sm font-semibold text-violet-700 dark:text-violet-400">
                  {m.newUsers}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                {m.growth !== null ? (
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold",
                    m.growth >= 0 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {m.growth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(m.growth).toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-sm text-slate-400">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
