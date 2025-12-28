"use client";

import Link from "next/link";
import { ArrowLeft, Send, CreditCard, Printer, FileText, Calendar, ReceiptText, Check, Clock, AlertCircle, Share2, MoreVertical, Trash, Building2, Wallet2, type LucideIcon } from "lucide-react";
import { sendInvoice, archiveInvoice } from "@/app/(dashboard)/dashboard/invoice/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Invoice, InvoiceItem, Profile, Supplier } from "@/types/database";
import ClientQRCode from "@/components/invoice/ClientQRCode";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
  profile?: Profile | null;
  supplier?: Supplier | null;
}

const statusConfig: Record<string, { color: string; bg: string; label: string; icon: LucideIcon; iconColor: string }> = {
  PAID: { color: "text-success", bg: "bg-success/10", label: "Terbayar", icon: Check, iconColor: "text-success" },
  DISBURSED: { color: "text-blue-600", bg: "bg-blue-50", label: "Dicairkan", icon: CreditCard, iconColor: "text-blue-600" },
  SENT: { color: "text-warning", bg: "bg-warning/10", label: "Terkirim", icon: Clock, iconColor: "text-warning" },
  DRAFT: { color: "text-muted-foreground", bg: "bg-muted", label: "Draft", icon: FileText, iconColor: "text-muted-foreground" },
  FAILED: { color: "text-destructive", bg: "bg-destructive/10", label: "Gagal", icon: AlertCircle, iconColor: "text-destructive" },
  EXPIRED: { color: "text-muted-foreground", bg: "bg-muted", label: "Kedaluwarsa", icon: AlertCircle, iconColor: "text-muted-foreground" },
};

export default function InvoiceDetail({ invoice }: { invoice: InvoiceWithItems }) {
  const router = useRouter();
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const profile = invoice.profile;
  const isBilling = invoice.type === 'BILLING';

  const handleSendEmail = async () => {
    if (!confirm("Kirim invoice ke email penerima?")) return;
    
    setIsLoadingEmail(true);
    try {
      const res = await sendInvoice(invoice.id);
      if (res?.error) {
        alert("Gagal mengirim email: " + res.error);
      } else {
        alert("Email berhasil dikirim!");
        router.refresh();
      }
    } catch {
      alert("Terjadi kesalahan saat mengirim email");
    } finally {
      setIsLoadingEmail(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm("Yakin ingin mengarsipkan invoice ini?")) return;
    const res = await archiveInvoice(invoice.id);
    if (res.success) {
      router.push("/dashboard/invoice");
    } else {
      alert("Gagal mengarsipkan: " + res.error);
    }
  };

  const statusStyle = statusConfig[invoice.status || "DRAFT"] || statusConfig.DRAFT;
  const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);
  const formatDate = (date: string) => new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  
  const discountAmount = invoice.discount_type === 'percentage' 
    ? ((invoice.subtotal || invoice.amount) * (invoice.discount_value || 0)) / 100 
    : (invoice.discount_value || 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild className="h-9 w-9">
            <Link href={isBilling ? "/dashboard/penjualan" : "/dashboard/pembayaran"}>
              <ArrowLeft size={16} />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Detail {isBilling ? "Penjualan" : "Pembayaran"}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">#{invoice.invoice_number}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {invoice.status === 'SENT' && isBilling && (
            <Button 
              size="sm"
              onClick={() => window.open(`https://wa.me/${invoice.recipient_phone}?text=Halo, berikut adalah tagihan Anda: ${window.location.origin}/pay/${invoice.id}`, '_blank')}
            >
              <Send size={14} className="mr-2" />
              Kirim WA
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                <MoreVertical size={14} className="mr-2" />
                Lainnya
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.print()}>
                <Printer size={14} className="mr-2" />
                Cetak PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 size={14} className="mr-2" />
                Bagikan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchive}>
                <FileText size={14} className="mr-2" />
                Arsipkan
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash size={14} className="mr-2" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Document Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-start">
        {/* Left Column: Document Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4 md:p-8">
              <InvoiceHeader invoice={invoice} statusStyle={statusStyle} isBilling={isBilling} formatDate={formatDate} />
              <InvoiceItemsTable items={invoice.items} formatCurrency={formatCurrency} />
              <InvoiceSummary 
                invoice={invoice} 
                profile={profile} 
                isBilling={isBilling} 
                discountAmount={discountAmount} 
                formatCurrency={formatCurrency} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Mini Info Cards */}
        <div className="space-y-4 print:hidden">
          <Card className="bg-foreground text-background">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center text-primary">
                  <Wallet2 size={20} />
                </div>
                <div>
                  <p className="text-xs text-background/50 mb-1">Total</p>
                  <h3 className="text-xl font-semibold tabular-nums">{formatCurrency(invoice.amount)}</h3>
                </div>
                <Button 
                  size="sm"
                  className="w-full"
                  onClick={handleSendEmail}
                  isLoading={isLoadingEmail}
                >
                  <Send size={14} className="mr-2" />
                  Kirim Email
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success mb-4">
                <Share2 size={18} />
              </div>
              <p className="text-sm font-medium text-foreground mb-4">Scan untuk Bayar</p>
              <div className="bg-muted/50 p-4 rounded-xl border border-border">
                <ClientQRCode 
                  invoiceId={invoice.id}
                  size={140}
                  level="H"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-4 max-w-[200px]">QR Code mengarahkan ke halaman pembayaran.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Sub-components for better organization
interface StatusStyle {
  color: string;
  bg: string;
  label: string;
  icon: LucideIcon;
  iconColor: string;
}

function InvoiceHeader({ invoice, statusStyle, isBilling, formatDate }: { 
  invoice: Invoice; 
  statusStyle: StatusStyle; 
  isBilling: boolean;
  formatDate: (date: string) => string;
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-foreground text-background px-3 py-1.5 rounded-lg">
          <ReceiptText size={14} />
          <span className="text-xs font-medium">{isBilling ? "Penjualan" : "Pembayaran"}</span>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">#{invoice.invoice_number}</h2>
          <div className="flex items-center gap-3">
            <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg", statusStyle.bg, statusStyle.color)}>
              <statusStyle.icon size={12} className={statusStyle.iconColor} />
              <span className="text-xs font-medium">{statusStyle.label}</span>
            </div>
            <span className="text-muted-foreground text-xs">{formatDate(invoice.created_at)}</span>
          </div>
        </div>
      </div>
      <div className="text-left md:text-right space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Penerima</p>
          <h3 className="font-semibold text-lg text-foreground">{invoice.recipient_name}</h3>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Jatuh Tempo</p>
          <div className="flex items-center gap-1 text-destructive">
            <Calendar size={14} />
            <p className="text-base font-medium">{invoice.due_date ? formatDate(invoice.due_date) : "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvoiceItemsTable({ items, formatCurrency }: { items: InvoiceItem[]; formatCurrency: (val: number) => string }) {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="py-3 text-left font-medium text-muted-foreground text-xs">Deskripsi</th>
            <th className="py-3 text-center font-medium text-muted-foreground text-xs w-20">Qty</th>
            <th className="py-3 text-right font-medium text-muted-foreground text-xs w-32">Harga</th>
            <th className="py-3 text-right font-medium text-muted-foreground text-xs w-36">Jumlah</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item, i) => (
            <tr key={i}>
              <td className="py-3"><p className="font-medium text-foreground">{item.description}</p></td>
              <td className="py-3 text-center text-muted-foreground">{item.quantity}</td>
              <td className="py-3 text-right text-muted-foreground tabular-nums">{formatCurrency(item.unit_price)}</td>
              <td className="py-3 text-right font-medium text-foreground tabular-nums">{formatCurrency(item.quantity * item.unit_price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InvoiceSummary({ invoice, profile, isBilling, discountAmount, formatCurrency }: {
  invoice: Invoice;
  profile?: Profile | null;
  isBilling: boolean;
  discountAmount: number;
  formatCurrency: (val: number) => string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-6 pt-6 border-t border-border">
      <div className="space-y-4 max-w-xs">
        {isBilling ? (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Instruksi Pembayaran</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center text-background">
                <Building2 size={18} />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{profile?.bank_name || "BCA"}</p>
                <p className="text-primary text-xs font-medium">{profile?.bank_account_number || "-"}</p>
                <p className="text-muted-foreground text-xs">{profile?.name || "-"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Penerima Dana</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                <Building2 size={18} />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{invoice.recipient_bank_name || "-"}</p>
                <p className="text-foreground text-xs font-medium">{invoice.recipient_bank_account_number || "-"}</p>
                <p className="text-muted-foreground text-xs">{invoice.recipient_bank_account_name || "-"}</p>
              </div>
            </div>
          </div>
        )}
        <div className="bg-muted p-3 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Catatan</span>
          </div>
          <p className="text-foreground text-xs">{invoice.description || "Tidak ada catatan."}</p>
        </div>
      </div>
      <div className="md:w-72 space-y-3">
        <div className="flex justify-between items-center text-muted-foreground">
          <span className="text-xs">Subtotal</span>
          <span className="font-medium text-foreground text-sm tabular-nums">{formatCurrency(invoice.subtotal || invoice.amount)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-destructive">
            <span className="text-xs">Diskon</span>
            <span className="font-medium text-sm tabular-nums">-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        {invoice.tax_enabled && (
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs">PPN {invoice.tax_rate}%</span>
            <span className="font-medium text-foreground text-sm tabular-nums">+{formatCurrency((invoice.tax_rate || 11) * (invoice.subtotal || invoice.amount) / 100)}</span>
          </div>
        )}
        <div className="pt-3 border-t border-foreground flex justify-between items-center">
          <span className="text-xs font-medium text-foreground">Total</span>
          <span className="text-2xl font-semibold text-primary tabular-nums">{formatCurrency(invoice.amount)}</span>
        </div>
      </div>
    </div>
  );
}
