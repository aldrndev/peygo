"use client";

import { Button, Card, CardBody, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { ArrowLeft, Send, CreditCard, Printer, FileText, Calendar, ReceiptText, Check, Clock, AlertCircle, Share2, MoreVertical, Trash, Building2, Wallet2, type LucideIcon } from "lucide-react";
import { sendInvoice, archiveInvoice } from "@/app/(dashboard)/dashboard/invoice/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Invoice, InvoiceItem, Profile, Supplier } from "@/types/database";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";

interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
  profile?: Profile | null;
  supplier?: Supplier | null;
}

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
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          alert("Terjadi kesalahan saat mengirim email");
        } finally {
            setIsLoadingEmail(false);
        }
    };

    const handleArchive = async () => {
        if (!confirm("Yakin ingin mengarsipkan invoice ini? Invoice yang diarsipkan tidak akan muncul di daftar utama.")) return;
        
        const res = await archiveInvoice(invoice.id);
        
        if (res.success) {
            router.push("/dashboard/invoice");
        } else {
            alert("Gagal mengarsipkan: " + res.error);
        }
    };

    const statusConfig: Record<string, { color: string; bg: string; label: string; icon: LucideIcon; iconColor: string }> = {
      PAID: { color: "text-emerald-700", bg: "bg-emerald-50", label: "Terbayar", icon: Check, iconColor: "text-emerald-600" },
      DISBURSED: { color: "text-blue-700", bg: "bg-blue-50", label: "Dicairkan", icon: CreditCard, iconColor: "text-blue-600" },
      SENT: { color: "text-orange-700", bg: "bg-orange-50", label: "Terkirim", icon: Clock, iconColor: "text-orange-600" },
      DRAFT: { color: "text-slate-500", bg: "bg-slate-100", label: "Draft", icon: FileText, iconColor: "text-slate-400" },
      FAILED: { color: "text-rose-700", bg: "bg-rose-50", label: "Gagal", icon: AlertCircle, iconColor: "text-rose-600" },
      EXPIRED: { color: "text-slate-400", bg: "bg-slate-100", label: "Kedaluwarsa", icon: AlertCircle, iconColor: "text-slate-400" },
    };

    const statusStyle = statusConfig[invoice.status || "DRAFT"] || statusConfig.DRAFT;

    const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

    const formatDate = (date: string) => new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    const discountAmount = invoice.discount_type === 'percentage' 
        ? ((invoice.subtotal || invoice.amount) * (invoice.discount_value || 0)) / 100 
        : (invoice.discount_value || 0);

    return (
        <motion.div 
            className="space-y-10 pb-20"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-3">
                    <Button 
                        as={Link} 
                        href={isBilling ? "/dashboard/penagihan" : "/dashboard/pembayaran"} 
                        variant="light" 
                        size="sm"
                        isIconOnly 
                        className="bg-white border border-slate-100 rounded-lg w-9 h-9"
                    >
                        <ArrowLeft size={16} />
                    </Button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Detail {isBilling ? "Penagihan" : "Pembayaran"}</h1>
                        <p className="text-slate-500 text-sm mt-0.5">#{invoice.invoice_number}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {invoice.status === 'SENT' && isBilling && (
                        <Button 
                            color="primary" 
                            size="sm"
                            className="font-medium text-xs rounded-lg h-9 px-4"
                            startContent={<Send size={14} />}
                            onPress={() => window.open(`https://wa.me/${invoice.recipient_phone}?text=Halo, berikut adalah tagihan Anda: ${window.location.origin}/pay/${invoice.id}`, '_blank')}
                        >
                            Kirim WA
                        </Button>
                    )}
                    <Dropdown>
                        <DropdownTrigger>
                            <Button 
                                variant="flat" 
                                size="sm"
                                className="font-medium text-xs rounded-lg h-9 px-3"
                                startContent={<MoreVertical size={14} />}
                            >
                                Lainnya
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu 
                            aria-label="Invoice actions"
                            itemClasses={{
                                base: "rounded-lg text-xs p-2",
                            }}
                        >
                            <DropdownItem key="print" startContent={<Printer size={14} />} onPress={() => window.print()}>Cetak PDF</DropdownItem>
                            <DropdownItem key="share" startContent={<Share2 size={14} />}>Bagikan</DropdownItem>
                            <DropdownItem key="archive" startContent={<FileText size={14} />} onPress={handleArchive}>Arsipkan</DropdownItem>
                            <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash size={14} />}>Hapus</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            {/* Main Document Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-start">
                {/* Left Column: Document Card */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                        <CardBody className="p-4 md:p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg">
                                        <ReceiptText size={14} />
                                        <span className="text-xs font-medium">{isBilling ? "Penagihan" : "Pembayaran"}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">#{invoice.invoice_number}</h2>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${statusStyle.bg} ${statusStyle.color}`}>
                                                <statusStyle.icon size={12} className={statusStyle.iconColor} />
                                                <span className="text-xs font-medium">{statusStyle.label}</span>
                                            </div>
                                            <span className="text-slate-400 text-xs">{formatDate(invoice.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left md:text-right space-y-3">
                                    <div>
                                         <p className="text-xs text-slate-400 mb-1">Penerima</p>
                                         <h3 className="font-semibold text-lg text-slate-900">{invoice.recipient_name}</h3>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Jatuh Tempo</p>
                                        <div className="flex items-center gap-1 text-rose-500">
                                            <Calendar size={14} />
                                            <p className="text-base font-medium">{invoice.due_date ? formatDate(invoice.due_date) : "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto mb-8">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="py-3 text-left font-medium text-slate-400 text-xs">Deskripsi</th>
                                            <th className="py-3 text-center font-medium text-slate-400 text-xs w-20">Qty</th>
                                            <th className="py-3 text-right font-medium text-slate-400 text-xs w-32">Harga</th>
                                            <th className="py-3 text-right font-medium text-slate-400 text-xs w-36">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                         {invoice.items.map((item, i) => (
                                             <tr key={i}>
                                                 <td className="py-3">
                                                     <p className="font-medium text-slate-900">{item.description}</p>
                                                 </td>
                                                 <td className="py-3 text-center text-slate-500">{item.quantity}</td>
                                                 <td className="py-3 text-right text-slate-500 tabular-nums">{formatCurrency(item.unit_price)}</td>
                                                 <td className="py-3 text-right font-medium text-slate-900 tabular-nums">
                                                     {formatCurrency(item.quantity * item.unit_price)}
                                                 </td>
                                             </tr>
                                         ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col md:flex-row md:justify-between gap-6 pt-6 border-t border-slate-100">
                                <div className="space-y-4 max-w-xs">
                                    {isBilling ? (
                                        <div className="space-y-3">
                                            <p className="text-xs text-slate-400">Instruksi Pembayaran</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                                                    <Building2 size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 text-sm">{profile?.bank_name || "BCA"}</p>
                                                    <p className="text-orange-500 text-xs font-medium">{profile?.bank_account_number || "-"}</p>
                                                    <p className="text-slate-400 text-xs">{profile?.name || "-"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-xs text-slate-400">Penerima Dana</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                                                    <Building2 size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 text-sm">{invoice.recipient_bank_name || "-"}</p>
                                                    <p className="text-slate-900 text-xs font-medium">{invoice.recipient_bank_account_number || "-"}</p>
                                                    <p className="text-slate-400 text-xs">{invoice.recipient_bank_account_name || "-"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <AlertCircle size={12} className="text-slate-400" />
                                            <span className="text-xs text-slate-400">Catatan</span>
                                        </div>
                                        <p className="text-slate-600 text-xs">{invoice.description || "Tidak ada catatan."}</p>
                                    </div>
                                </div>
                                <div className="md:w-72 space-y-3">
                                    <div className="flex justify-between items-center text-slate-400">
                                        <span className="text-xs">Subtotal</span>
                                        <span className="font-medium text-slate-900 text-sm tabular-nums">{formatCurrency(invoice.subtotal || invoice.amount)}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between items-center text-rose-500">
                                            <span className="text-xs">Diskon</span>
                                            <span className="font-medium text-sm tabular-nums">-{formatCurrency(discountAmount)}</span>
                                        </div>
                                    )}
                                    {invoice.tax_enabled && (
                                        <div className="flex justify-between items-center text-slate-400">
                                            <span className="text-xs">PPN {invoice.tax_rate}%</span>
                                            <span className="font-medium text-slate-900 text-sm tabular-nums">+{formatCurrency((invoice.tax_rate || 11) * (invoice.subtotal || invoice.amount) / 100)}</span>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-slate-900 flex justify-between items-center">
                                        <span className="text-xs font-medium text-slate-900">Total</span>
                                        <span className="text-2xl font-semibold text-orange-500 tabular-nums">{formatCurrency(invoice.amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Mini Info Cards */}
                <div className="space-y-4 print:hidden">
                    <Card className="bg-slate-900 border-none rounded-xl overflow-hidden">
                        <CardBody className="p-4">
                           <div className="flex flex-col items-center text-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-orange-400">
                                 <Wallet2 size={20} />
                              </div>
                              <div>
                                 <p className="text-xs text-slate-500 mb-1">Total</p>
                                 <h3 className="text-xl font-semibold text-white tabular-nums">{formatCurrency(invoice.amount)}</h3>
                              </div>
                              <Button 
                                  color="primary" 
                                  size="sm"
                                  className="w-full font-medium text-xs rounded-lg h-9"
                                  startContent={<Send size={14} />}
                                  onPress={handleSendEmail}
                                  isLoading={isLoadingEmail}
                              >
                                  Kirim Email
                              </Button>
                           </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                        <CardBody className="p-4 gap-4 flex flex-col items-center text-center">
                           <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                              <Share2 size={18} />
                           </div>
                           <div>
                              <p className="text-xs text-slate-400 mb-2">Scan untuk Bayar</p>
                              <div className="bg-white p-4 rounded-xl shadow-inner mb-3">
                                  <QRCode 
                                    value={`${window.location.origin}/pay/${invoice.id}`} 
                                    size={120}
                                    level="H"
                                  />
                              </div>
                              <p className="text-xs text-slate-400 max-w-[180px]">QR Code mengarahkan ke halaman pembayaran.</p>
                           </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
