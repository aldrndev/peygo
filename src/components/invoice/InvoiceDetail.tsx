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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative print:hidden">
                <div className="flex items-center gap-6">
                    <Button 
                        as={Link} 
                        href={isBilling ? "/dashboard/penagihan" : "/dashboard/pembayaran"} 
                        variant="light" 
                        isIconOnly 
                        className="bg-white/40 backdrop-blur-xl border border-white/60 hover:bg-white rounded-2xl w-12 h-12 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-none">Detail {isBilling ? "Penagihan" : "Pembayaran"}</h1>
                        <p className="text-slate-500 text-lg font-medium mt-2">#{invoice.invoice_number}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {invoice.status === 'SENT' && isBilling && (
                        <Button 
                            color="primary" 
                            className="font-bold px-8 rounded-2xl h-12 uppercase tracking-widest text-xs outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                            startContent={<Send size={18} />}
                            onPress={() => window.open(`https://wa.me/${invoice.recipient_phone}?text=Halo, berikut adalah tagihan Anda: ${window.location.origin}/pay/${invoice.id}`, '_blank')}
                        >
                            KIRIM WA
                        </Button>
                    )}
                    <Dropdown>
                        <DropdownTrigger>
                            <Button 
                                variant="flat" 
                                color="secondary" 
                                className="font-bold px-8 rounded-2xl h-12 uppercase tracking-widest text-xs"
                                startContent={<MoreVertical size={18} />}
                            >
                                OPSIONAL
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu 
                            aria-label="Invoice actions"
                            itemClasses={{
                                base: "rounded-xl font-bold text-xs uppercase tracking-widest p-3",
                            }}
                        >
                            <DropdownItem key="print" startContent={<Printer size={16} />} onPress={() => window.print()}>Cetak PDF</DropdownItem>
                            <DropdownItem key="share" startContent={<Share2 size={16} />}>Bagikan Link</DropdownItem>
                            <DropdownItem key="archive" startContent={<FileText size={16} />} onPress={handleArchive}>Arsipkan</DropdownItem>
                            <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash size={16} />}>Hapus</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            {/* Main Document Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Document Card */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-white rounded-[48px] border border-slate-100 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-50 rounded-full -mr-48 -mt-48" />
                        <CardBody className="p-10 md:p-16 relative z-10">
                            <div className="flex justify-between items-start mb-20">
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-5 py-2 rounded-2xl">
                                        <ReceiptText size={20} />
                                        <span className="text-xs font-bold uppercase tracking-[0.2em]">{isBilling ? "PENAGIHAN" : "PEMBAYARAN"}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter leading-none mb-4">#{invoice.invoice_number}</h2>
                                        <div className="flex items-center gap-4">
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${statusStyle.bg} ${statusStyle.color} border border-slate-100`}>
                                                <statusStyle.icon size={16} className={statusStyle.iconColor} />
                                                <span className="text-xs font-bold uppercase tracking-widest">{statusStyle.label}</span>
                                            </div>
                                            <span className="text-slate-400 font-bold text-sm tracking-tight">{formatDate(invoice.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right space-y-8">
                                    <div className="space-y-2">
                                         <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Penerima Dana</p>
                                         <h3 className="font-bold text-3xl md:text-4xl text-slate-900 tracking-tight leading-none">{invoice.recipient_name}</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Batas Waktu</p>
                                        <div className="flex justify-end items-center gap-2 text-rose-500">
                                            <Calendar size={20} />
                                            <p className="text-2xl font-bold tracking-tighter">{invoice.due_date ? formatDate(invoice.due_date) : "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto mb-20">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-slate-100">
                                            <th className="py-8 text-left font-bold text-slate-400 uppercase text-xs tracking-[0.3em] pb-6">Deskripsi Layanan / Barang</th>
                                            <th className="py-8 text-center font-bold text-slate-400 uppercase text-xs tracking-[0.3em] pb-6 w-32">QTY</th>
                                            <th className="py-8 text-right font-bold text-slate-400 uppercase text-xs tracking-[0.3em] pb-6 w-48">HARGA SATUAN</th>
                                            <th className="py-8 text-right font-bold text-slate-400 uppercase text-xs tracking-[0.3em] pb-6 w-56">JUMLAH</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                         {invoice.items.map((item, i) => (
                                             <tr key={i} className="group transition-colors hover:bg-slate-50/50">
                                                 <td className="py-8">
                                                     <p className="font-bold text-slate-900 text-xl tracking-tight">{item.description}</p>
                                                 </td>
                                                 <td className="py-8 text-center font-bold text-slate-500 uppercase tracking-widest">{item.quantity}</td>
                                                 <td className="py-8 text-right font-bold text-slate-500 tabular-nums">{formatCurrency(item.unit_price)}</td>
                                                 <td className="py-8 text-right font-bold text-slate-900 tabular-nums text-xl">
                                                     {formatCurrency(item.quantity * item.unit_price)}
                                                 </td>
                                             </tr>
                                         ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col md:flex-row md:justify-between gap-16 pt-16 border-t border-slate-100">
                                <div className="space-y-10 max-w-sm">
                                    {isBilling ? (
                                        <div className="space-y-6">
                                            <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.3em]">Instruksi Pembayaran</p>
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                                                    <Building2 size={28} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 tracking-tight uppercase text-lg">{profile?.bank_name || "BCA"}</p>
                                                    <p className="text-orange-500 text-sm font-bold tracking-widest">{profile?.bank_account_number || "-"}</p>
                                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{profile?.name || "-"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.3em]">Penerima Dana (Supplier)</p>
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-white">
                                                    <Building2 size={28} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 tracking-tight uppercase text-lg">{invoice.recipient_bank_name || "-"}</p>
                                                    <p className="text-slate-900 text-sm font-bold tracking-widest">{invoice.recipient_bank_account_number || "-"}</p>
                                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{invoice.recipient_bank_account_name || "-"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <AlertCircle size={16} className="text-slate-400" />
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Catatan</span>
                                        </div>
                                        <p className="text-slate-600 text-sm font-medium leading-relaxed italic">{invoice.description || "Tidak ada catatan tambahan."}</p>
                                    </div>
                                </div>
                                <div className="md:w-96 space-y-6">
                                    <div className="flex justify-between items-center text-slate-400">
                                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Subtotal</span>
                                        <span className="font-bold text-slate-900 text-xl tabular-nums">{formatCurrency(invoice.subtotal || invoice.amount)}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between items-center text-rose-500">
                                            <span className="text-xs font-bold uppercase tracking-[0.2em]">Potongan Diskon</span>
                                            <span className="font-bold text-xl tabular-nums">-{formatCurrency(discountAmount)}</span>
                                        </div>
                                    )}
                                    {invoice.tax_enabled && (
                                        <div className="flex justify-between items-center text-slate-400">
                                            <span className="text-xs font-bold uppercase tracking-[0.2em]">Pajak (PPN {invoice.tax_rate}%)</span>
                                            <span className="font-bold text-slate-900 text-xl tabular-nums">+{formatCurrency((invoice.tax_rate || 11) * (invoice.subtotal || invoice.amount) / 100)}</span>
                                        </div>
                                    )}
                                    <div className="pt-8 border-t-2 border-slate-900 flex justify-between items-center">
                                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-900">Total Akhir</span>
                                        <span className="text-4xl md:text-5xl font-bold text-orange-500 tabular-nums tracking-tighter">{formatCurrency(invoice.amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Mini Info Cards */}
                <div className="space-y-6 print:hidden">
                    <Card className="bg-slate-900 border-none rounded-[40px] overflow-hidden group">
                        <CardBody className="p-8 relative">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-all duration-700" />
                           <div className="relative z-10 flex flex-col items-center text-center gap-6">
                              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-orange-400 border border-white/10">
                                 <Wallet2 size={32} />
                              </div>
                              <div>
                                 <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Total Tagihan</p>
                                 <h3 className="text-3xl font-bold text-white tracking-widest tabular-nums leading-none">{formatCurrency(invoice.amount)}</h3>
                              </div>
                              <Button 
                                  color="primary" 
                                  className="w-full font-bold rounded-2xl h-14 uppercase tracking-widest text-xs outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                                  startContent={<Send size={18} />}
                                  onPress={handleSendEmail}
                                  isLoading={isLoadingEmail}
                              >
                                  KIRIM EMAIL
                              </Button>
                           </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden">
                        <CardBody className="p-8 gap-6 flex flex-col items-center text-center">
                           <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                              <Share2 size={32} />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Scan untuk Bayar</p>
                              <div className="bg-white p-6 rounded-[32px] shadow-inner mb-4">
                                  <QRCode 
                                    value={`${window.location.origin}/pay/${invoice.id}`} 
                                    size={160}
                                    level="H"
                                  />
                              </div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 italic leading-relaxed">QR Code akan mengarahkan pelanggan langsung ke halaman pembayaran aman.</p>
                           </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
