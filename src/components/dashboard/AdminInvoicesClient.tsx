"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Clock, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2,
  FileText,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimplePagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface Invoice {
  id: string;
  invoice_number: string;
  type: string;
  status: string;
  total_amount: number;
  created_at: string;
  userName: string;
}

interface AdminInvoicesClientProps {
  invoices: Invoice[];
}

export default function AdminInvoicesClient({ invoices }: AdminInvoicesClientProps) {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = filterStatus === "ALL" || inv.status === filterStatus;
    const matchesSearch = inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pages = Math.ceil(filteredInvoices.length / rowsPerPage);
  const items = filteredInvoices.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative space-y-6 md:space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Semua Invoice
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola dan pantau seluruh transaksi.</p>
        </div>
        
        <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                size="sm"
                onClick={() => { setFilterStatus("ALL"); setSearchQuery(""); }}
            >
                <RotateCcw size={14} className="mr-2" />
                Reset
            </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Cari invoice..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={filterStatus} onValueChange={(val) => { setFilterStatus(val); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua</SelectItem>
                  <SelectItem value="PAID">Lunas</SelectItem>
                  <SelectItem value="SENT">Terkirim</SelectItem>
                  <SelectItem value="DISBURSED">Dicairkan</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="FAILED">Gagal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-center p-3 rounded-lg bg-foreground text-background">
              <p className="text-sm font-medium">{filteredInvoices.length} Dokumen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-muted-foreground font-medium text-xs border-b border-border">
                  <th className="py-3 px-4 md:px-5">Invoice</th>
                  <th className="py-3 px-4 md:px-5 hidden md:table-cell">Pemilik</th>
                  <th className="py-3 px-4 md:px-5 text-right">Nominal</th>
                  <th className="py-3 px-4 md:px-5 text-center hidden md:table-cell">Status</th>
                  <th className="py-3 px-4 md:px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((inv) => (
                  <tr 
                    key={inv.id} 
                    className="hover:bg-accent/50 transition-colors group"
                  >
                    <td className="py-6 px-4 md:px-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-foreground flex items-center justify-center text-background shrink-0">
                           <FileText size={18} />
                        </div>
                        <div>
                          <Link 
                            href={`/dashboard/admin/invoices/${inv.id}`}
                            className="font-semibold text-foreground tracking-tight hover:text-primary transition-colors"
                          >
                              {inv.invoice_number}
                          </Link>
                          <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground">
                              <span className="text-xs font-medium uppercase tracking-wide">{inv.type.toLowerCase()}</span>
                              <span className="text-xs">•</span>
                              <span className="text-xs font-medium uppercase tracking-wide">
                                  {new Date(inv.created_at).toLocaleDateString("id-ID")}
                              </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4 md:px-5 hidden md:table-cell">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                              <Clock size={12} />
                          </div>
                          <span className="font-semibold text-muted-foreground">{inv.userName}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4 md:px-5 text-right">
                      <div className="inline-flex flex-col items-end">
                          <span className="font-semibold text-lg text-foreground tracking-tight tabular-nums">{formatCurrency(inv.total_amount)}</span>
                          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wide mt-0.5">
                              <DollarSign size={10} />
                              <span>Gross Amount</span>
                          </div>
                      </div>
                    </td>
                    <td className="py-6 px-4 md:px-5 text-center hidden md:table-cell">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-6 px-4 md:px-5 text-right">
                      <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:bg-foreground hover:text-background"
                          asChild
                      >
                        <Link href={`/dashboard/admin/invoices/${inv.id}`}>
                          <ChevronRight size={18} />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Menampilkan {items.length} dari {filteredInvoices.length} hasil
            </p>
            <SimplePagination 
              currentPage={page}
              totalPages={pages}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
    DRAFT: { bg: "bg-muted", text: "text-muted-foreground", label: "Draft", icon: <Clock size={10} /> },
    SENT: { bg: "bg-warning/10", text: "text-warning", label: "Terkirim", icon: <RotateCcw size={10} /> },
    PAID: { bg: "bg-success/10", text: "text-success", label: "Lunas", icon: <CheckCircle2 size={10} /> },
    DISBURSED: { bg: "bg-blue-50", text: "text-blue-600", label: "Dicairkan", icon: <CheckCircle2 size={10} /> },
    FAILED: { bg: "bg-destructive/10", text: "text-destructive", label: "Gagal", icon: <RotateCcw size={10} /> },
  };

  const { bg, text, label, icon } = config[status] || config.DRAFT;

  return (
    <span className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wide", bg, text)}>
      {icon}
      {label}
    </span>
  );
}
