"use client";

import { useState } from "react";
import Link from "next/link";
import { X, DollarSign, Receipt, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimplePagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { 
  type PaginatedResult,
  type InvoiceRow,
  type UserActivityRow,
} from "@/lib/api/admin-reports-filtered";
import { StatusBadge } from "./ReportComponents";

// Sheet/Drawer component (simplified)
interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function DrilldownSheet({ open, onClose, title, icon, children }: SheetProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className={cn(
        "fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] bg-background border-l shadow-xl",
        "transform transition-transform duration-300",
        open ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              {icon}
            </div>
            <h2 className="font-semibold text-lg">{title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-73px)]">
          {children}
        </div>
      </div>
    </>
  );
}

// Revenue Drilldown
interface RevenueDrilldownProps {
  open: boolean;
  onClose: () => void;
  invoices: PaginatedResult<InvoiceRow>;
  onPageChange: (page: number) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateStr: string) => string;
}

export function RevenueDrilldown({ 
  open, 
  onClose, 
  invoices, 
  onPageChange,
  formatCurrency,
  formatDate 
}: RevenueDrilldownProps) {
  // Filter to only paid invoices for revenue calculation
  const paidInvoices = invoices.data.filter(inv => inv.status === "PAID" || inv.status === "DISBURSED");
  
  return (
    <DrilldownSheet 
      open={open} 
      onClose={onClose} 
      title="Detail Revenue"
      icon={<DollarSign size={18} className="text-emerald-600" />}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Invoice yang berkontribusi ke revenue (status Lunas/Dicairkan)
        </p>
        
        <div className="space-y-2">
          {paidInvoices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Tidak ada invoice lunas dalam periode ini</p>
          ) : (
            paidInvoices.map(inv => (
              <Link 
                key={inv.id}
                href={`/dashboard/admin/invoices/${inv.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
              >
                <div>
                  <p className="font-medium">{inv.invoice_number || "-"}</p>
                  <p className="text-xs text-muted-foreground">{inv.userName} • {formatDate(inv.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-600 tabular-nums">
                    {formatCurrency(inv.total_amount)}
                  </span>
                  <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))
          )}
        </div>

        {invoices.totalPages > 1 && (
          <div className="pt-4 flex justify-center">
            <SimplePagination 
              currentPage={invoices.page}
              totalPages={invoices.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </DrilldownSheet>
  );
}

// Invoice Drilldown
interface InvoiceDrilldownProps {
  open: boolean;
  onClose: () => void;
  invoices: PaginatedResult<InvoiceRow>;
  onPageChange: (page: number) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateStr: string) => string;
}

export function InvoiceDrilldown({ 
  open, 
  onClose, 
  invoices, 
  onPageChange,
  formatCurrency,
  formatDate 
}: InvoiceDrilldownProps) {
  return (
    <DrilldownSheet 
      open={open} 
      onClose={onClose} 
      title="Semua Invoice"
      icon={<Receipt size={18} className="text-blue-600" />}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {invoices.total} invoice dalam periode ini
        </p>
        
        <div className="space-y-2">
          {invoices.data.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Tidak ada invoice dalam periode ini</p>
          ) : (
            invoices.data.map(inv => (
              <Link 
                key={inv.id}
                href={`/dashboard/admin/invoices/${inv.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={inv.status} />
                  <div>
                    <p className="font-medium">{inv.invoice_number || "-"}</p>
                    <p className="text-xs text-muted-foreground">{inv.userName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="font-semibold tabular-nums">{formatCurrency(inv.total_amount)}</span>
                    <p className="text-xs text-muted-foreground">{formatDate(inv.created_at)}</p>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))
          )}
        </div>

        {invoices.totalPages > 1 && (
          <div className="pt-4 flex justify-center">
            <SimplePagination 
              currentPage={invoices.page}
              totalPages={invoices.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </DrilldownSheet>
  );
}

// User Drilldown
interface UserDrilldownProps {
  open: boolean;
  onClose: () => void;
  users: PaginatedResult<UserActivityRow>;
  onPageChange: (page: number) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateStr: string) => string;
}

export function UserDrilldown({ 
  open, 
  onClose, 
  users, 
  onPageChange,
  formatCurrency,
  formatDate 
}: UserDrilldownProps) {
  return (
    <DrilldownSheet 
      open={open} 
      onClose={onClose} 
      title="Semua User"
      icon={<Users size={18} className="text-violet-600" />}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {users.total} user terdaftar
        </p>
        
        <div className="space-y-2">
          {users.data.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Tidak ada user</p>
          ) : (
            users.data.map(user => (
              <Link 
                key={user.id}
                href={`/dashboard/admin/users/${user.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
              >
                <div>
                  <p className="font-medium">{user.name || "Unnamed"}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.invoiceCount} invoice • Bergabung {formatDate(user.joinedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="font-semibold tabular-nums">{formatCurrency(user.totalRevenue)}</span>
                    <p className="text-xs text-muted-foreground">Total revenue</p>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))
          )}
        </div>

        {users.totalPages > 1 && (
          <div className="pt-4 flex justify-center">
            <SimplePagination 
              currentPage={users.page}
              totalPages={users.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </DrilldownSheet>
  );
}

// Fee Drilldown
interface FeeDrilldownProps {
  open: boolean;
  onClose: () => void;
  invoices: PaginatedResult<InvoiceRow>;
  onPageChange: (page: number) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateStr: string) => string;
}

export function FeeDrilldown({ 
  open, 
  onClose, 
  invoices, 
  onPageChange,
  formatCurrency,
  formatDate 
}: FeeDrilldownProps) {
  // Filter to invoices with fees
  const invoicesWithFees = invoices.data.filter(inv => (inv.platform_fee || 0) > 0);
  
  return (
    <DrilldownSheet 
      open={open} 
      onClose={onClose} 
      title="Detail Platform Fee"
      icon={<DollarSign size={18} className="text-orange-600" />}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Breakdown platform fee dari setiap invoice
        </p>
        
        <div className="space-y-2">
          {invoicesWithFees.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Tidak ada fee dalam periode ini</p>
          ) : (
            invoicesWithFees.map(inv => (
              <Link 
                key={inv.id}
                href={`/dashboard/admin/invoices/${inv.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
              >
                <div>
                  <p className="font-medium">{inv.invoice_number || "-"}</p>
                  <p className="text-xs text-muted-foreground">{inv.userName} • {formatDate(inv.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="font-semibold text-orange-600 tabular-nums">
                      {formatCurrency(inv.platform_fee)}
                    </span>
                    <p className="text-xs text-muted-foreground">dari {formatCurrency(inv.total_amount)}</p>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))
          )}
        </div>

        {invoices.totalPages > 1 && (
          <div className="pt-4 flex justify-center">
            <SimplePagination 
              currentPage={invoices.page}
              totalPages={invoices.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </DrilldownSheet>
  );
}

// Export drilldown type for state management
export type DrilldownType = "revenue" | "invoice" | "user" | "fee" | null;
