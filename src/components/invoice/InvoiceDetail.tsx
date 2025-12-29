"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Send, 
  Printer, 
  FileText, 
  Check, 
  Clock, 
  AlertCircle, 
  Share2, 
  MoreVertical, 
  Trash, 
  Building2,
  Phone, 
  Mail, 
  MapPin,
  type LucideIcon 
} from "lucide-react";
import { sendInvoice, archiveInvoice } from "@/app/(dashboard)/dashboard/invoice/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Invoice, InvoiceItem, Profile, Supplier } from "@/types/database";
import ClientQRCode from "@/components/invoice/ClientQRCode";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSetting } from "@/contexts/SettingsContext";

interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
  profile?: Profile | null;
  supplier?: Supplier | null;
}

const statusConfig: Record<string, { color: string; bg: string; label: string; icon: LucideIcon }> = {
  PAID: { color: "text-success", bg: "bg-success/10", label: "Lunas", icon: Check },
  DISBURSED: { color: "text-blue-600", bg: "bg-blue-50", label: "Dicairkan", icon: Check },
  SENT: { color: "text-warning", bg: "bg-warning/10", label: "Menunggu Pembayaran", icon: Clock },
  DRAFT: { color: "text-muted-foreground", bg: "bg-muted", label: "Draft", icon: FileText },
  FAILED: { color: "text-destructive", bg: "bg-destructive/10", label: "Gagal", icon: AlertCircle },
  EXPIRED: { color: "text-muted-foreground", bg: "bg-muted", label: "Kedaluwarsa", icon: AlertCircle },
};

export default function InvoiceDetail({ invoice }: { invoice: InvoiceWithItems }) {
  const router = useRouter();
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const profile = invoice.profile;
  const supplier = invoice.supplier;
  const isBilling = invoice.type === 'BILLING';
  const platformName = useSetting("platform_name");

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

  const taxAmount = invoice.tax_enabled 
    ? ((invoice.subtotal || invoice.amount) - discountAmount) * ((invoice.tax_rate || 11) / 100) 
    : 0;

  return (
    <div className="pb-20">
      {/* Action Bar - Hidden on print */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild className="h-9 w-9">
            <Link href={isBilling ? "/dashboard/penjualan" : "/dashboard/pembayaran"}>
              <ArrowLeft size={16} />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Detail {isBilling ? "Penjualan" : "Pembayaran"}</h1>
            <p className="text-muted-foreground text-sm">#{invoice.invoice_number}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSendEmail} isLoading={isLoadingEmail}>
            <Send size={14} className="mr-2" />
            Kirim Email
          </Button>
          {invoice.status === 'SENT' && isBilling && (
            <Button 
              variant="secondary"
              onClick={() => window.open(`https://wa.me/${invoice.recipient_phone}?text=Halo, berikut adalah tagihan Anda: ${window.location.origin}/pay/${invoice.id}`, '_blank')}
            >
              <Send size={14} className="mr-2" />
              Kirim WA
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.print()}>
                <Printer size={14} className="mr-2" />
                Cetak PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 size={14} className="mr-2" />
                Bagikan Link
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

      {/* Invoice Document */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden print:shadow-none print:border-none print:rounded-none">
        <div className="p-8 md:p-12 print:p-0">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
            {/* Company Info */}
            <div>
              {profile?.logo_url ? (
                <Image 
                  src={profile.logo_url} 
                  alt={profile?.company_name || "Logo"} 
                  width={140} 
                  height={50} 
                  className="h-10 w-auto object-contain mb-4"
                />
              ) : (
                <div className="text-2xl font-bold tracking-tighter mb-4">
                  <span className="text-primary">Pey</span>
                  <span className="text-foreground print:text-black">Go</span>
                </div>
              )}
              <div className="text-sm text-muted-foreground space-y-1 print:text-gray-600">
                <p className="font-semibold text-foreground print:text-black">{profile?.company_name || profile?.name}</p>
                {profile?.company_address && <p className="flex items-start gap-2"><MapPin size={12} className="mt-0.5 shrink-0" /> {profile.company_address}</p>}
                {profile?.phone && <p className="flex items-center gap-2"><Phone size={12} /> {profile.phone}</p>}
                {profile?.email && <p className="flex items-center gap-2"><Mail size={12} /> {profile.email}</p>}
              </div>
            </div>

            {/* Invoice Info */}
            <div className="md:text-right">
              <h2 className="text-3xl font-bold text-foreground mb-2 print:text-black">
                {isBilling ? "INVOICE" : "BUKTI PEMBAYARAN"}
              </h2>
              <p className="text-lg font-mono font-semibold text-primary mb-4">#{invoice.invoice_number}</p>
              <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium", statusStyle.bg, statusStyle.color)}>
                <statusStyle.icon size={14} />
                {statusStyle.label}
              </div>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Bill To / Pay To */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 print:text-gray-500">
                {isBilling ? "Tagihan Kepada" : "Dibayar Kepada"}
              </p>
              <p className="font-semibold text-foreground print:text-black">{invoice.recipient_name}</p>
              {invoice.recipient_address && <p className="text-sm text-muted-foreground mt-1 print:text-gray-600">{invoice.recipient_address}</p>}
              {invoice.recipient_phone && <p className="text-sm text-muted-foreground print:text-gray-600">Tel: {invoice.recipient_phone}</p>}
              {invoice.recipient_email && <p className="text-sm text-muted-foreground print:text-gray-600">{invoice.recipient_email}</p>}
            </div>

            {/* Dates */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 print:text-gray-500">Tanggal</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground print:text-gray-600">Tanggal Invoice:</span>
                  <span className="font-medium text-foreground print:text-black">{formatDate(invoice.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground print:text-gray-600">Jatuh Tempo:</span>
                  <span className="font-medium text-destructive">{invoice.due_date ? formatDate(invoice.due_date) : "-"}</span>
                </div>
                {invoice.paid_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground print:text-gray-600">Dibayar:</span>
                    <span className="font-medium text-success">{formatDate(invoice.paid_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code - Only for BILLING */}
            {isBilling ? (
              <div className="flex justify-center md:justify-end">
                <div className="text-center">
                  <div className="bg-white p-3 rounded-xl inline-block border border-border">
                    <ClientQRCode invoiceId={invoice.id} size={100} level="M" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Scan untuk bayar</p>
                </div>
              </div>
            ) : (
              <div /> /* Empty space for layout consistency */
            )}
          </div>

          {/* Items Table */}
          <div className="mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-foreground print:border-black">
                  <th className="py-3 text-left font-semibold text-foreground print:text-black uppercase text-xs tracking-wider">Deskripsi</th>
                  <th className="py-3 text-center font-semibold text-foreground print:text-black uppercase text-xs tracking-wider w-20">Qty</th>
                  <th className="py-3 text-right font-semibold text-foreground print:text-black uppercase text-xs tracking-wider w-32">Harga</th>
                  <th className="py-3 text-right font-semibold text-foreground print:text-black uppercase text-xs tracking-wider w-36">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i} className="border-b border-border print:border-gray-200">
                    <td className="py-4">
                      <p className="font-medium text-foreground print:text-black">{item.description}</p>
                      {item.notes && <p className="text-xs text-muted-foreground mt-1 print:text-gray-500">{item.notes}</p>}
                    </td>
                    <td className="py-4 text-center text-muted-foreground print:text-gray-600">{item.quantity}</td>
                    <td className="py-4 text-right text-muted-foreground print:text-gray-600 tabular-nums">{formatCurrency(item.unit_price)}</td>
                    <td className="py-4 text-right font-medium text-foreground print:text-black tabular-nums">{formatCurrency(item.quantity * item.unit_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Payment Instructions */}
            <div>
              {isBilling ? (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 print:text-gray-500">Pembayaran ke</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-foreground text-background flex items-center justify-center print:bg-black">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground print:text-black">{profile?.bank_name || "-"}</p>
                      <p className="text-primary font-mono font-semibold">{profile?.bank_account_number || "-"}</p>
                      <p className="text-sm text-muted-foreground print:text-gray-600">a.n. {profile?.bank_account_name || profile?.name || "-"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 print:text-gray-500">Transfer ke</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground print:text-black">{invoice.recipient_bank_name || supplier?.bank_name || "-"}</p>
                      <p className="text-primary font-mono font-semibold">{invoice.recipient_bank_account_number || supplier?.bank_account_number || "-"}</p>
                      <p className="text-sm text-muted-foreground print:text-gray-600">a.n. {invoice.recipient_bank_account_name || supplier?.bank_account_name || "-"}</p>
                    </div>
                  </div>
                </div>
              )}

              {invoice.description && (
                <div className="mt-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 print:text-gray-500">Catatan</p>
                  <p className="text-sm text-foreground print:text-black">{invoice.description}</p>
                </div>
              )}
            </div>

            {/* Amount Summary */}
            <div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground print:text-gray-600">Subtotal</span>
                  <span className="font-medium text-foreground print:text-black tabular-nums">{formatCurrency(invoice.subtotal || invoice.amount)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground print:text-gray-600">
                      Diskon {invoice.discount_type === 'percentage' ? `(${invoice.discount_value}%)` : ''}
                    </span>
                    <span className="font-medium text-destructive tabular-nums">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                {invoice.tax_enabled && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground print:text-gray-600">PPN ({invoice.tax_rate || 11}%)</span>
                    <span className="font-medium text-foreground print:text-black tabular-nums">+{formatCurrency(taxAmount)}</span>
                  </div>
                )}
                <div className="pt-4 border-t-2 border-foreground print:border-black">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground print:text-black uppercase text-sm">Total</span>
                    <span className="text-2xl font-bold text-primary tabular-nums">{formatCurrency(invoice.amount)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-right italic print:text-gray-500">
                    {numberToWords(invoice.amount)} Rupiah
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground print:border-gray-200 print:text-gray-500">
            <p>Invoice ini dibuat secara digital dan sah tanpa tanda tangan.</p>
            <p className="mt-1">Dibuat dengan <span className="font-semibold text-primary">{platformName}</span> • peygo.id</p>
          </div>
        </div>
      </div>

      {/* Status Timeline - Hidden on print */}
      <div className="mt-6 bg-card rounded-2xl border border-border p-6 no-print">
        <h3 className="text-sm font-semibold text-foreground mb-4">Riwayat Status</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <TimelineItem 
            label="Dibuat" 
            date={formatDate(invoice.created_at)} 
            isActive={true}
            icon={<FileText size={16} />}
          />
          <TimelineConnector isActive={!!invoice.sent_at} />
          <TimelineItem 
            label="Terkirim" 
            date={invoice.sent_at ? formatDate(invoice.sent_at) : "-"} 
            isActive={!!invoice.sent_at}
            icon={<Send size={16} />}
          />
          <TimelineConnector isActive={!!invoice.paid_at} />
          <TimelineItem 
            label="Dibayar" 
            date={invoice.paid_at ? formatDate(invoice.paid_at) : "-"} 
            isActive={!!invoice.paid_at}
            icon={<Check size={16} />}
          />
        </div>
      </div>
    </div>
  );
}

// Timeline Components
function TimelineItem({ 
  label, 
  date, 
  isActive, 
  icon 
}: { 
  label: string; 
  date: string; 
  isActive: boolean; 
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 flex-1">
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {icon}
      </div>
      <div>
        <p className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>{label}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}

function TimelineConnector({ isActive }: { isActive: boolean }) {
  return (
    <div className="hidden md:flex items-center px-2">
      <div className={cn(
        "h-0.5 w-12",
        isActive ? "bg-primary" : "bg-border"
      )} />
    </div>
  );
}

// Helper: Number to Words (Indonesian)
function numberToWords(num: number): string {
  const units = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'];
  const teens = ['Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'];
  const tens = ['', '', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh', 'Enam Puluh', 'Tujuh Puluh', 'Delapan Puluh', 'Sembilan Puluh'];
  
  if (num === 0) return 'Nol';
  if (num < 0) return 'Minus ' + numberToWords(Math.abs(num));
  
  let words = '';
  
  if (num >= 1000000000000) {
    words += numberToWords(Math.floor(num / 1000000000000)) + ' Triliun ';
    num %= 1000000000000;
  }
  if (num >= 1000000000) {
    words += numberToWords(Math.floor(num / 1000000000)) + ' Miliar ';
    num %= 1000000000;
  }
  if (num >= 1000000) {
    words += numberToWords(Math.floor(num / 1000000)) + ' Juta ';
    num %= 1000000;
  }
  if (num >= 1000) {
    if (Math.floor(num / 1000) === 1) {
      words += 'Seribu ';
    } else {
      words += numberToWords(Math.floor(num / 1000)) + ' Ribu ';
    }
    num %= 1000;
  }
  if (num >= 100) {
    if (Math.floor(num / 100) === 1) {
      words += 'Seratus ';
    } else {
      words += units[Math.floor(num / 100)] + ' Ratus ';
    }
    num %= 100;
  }
  if (num >= 20) {
    words += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  }
  if (num >= 10) {
    words += teens[num - 10] + ' ';
    num = 0;
  }
  if (num > 0) {
    words += units[num] + ' ';
  }
  
  return words.trim();
}
