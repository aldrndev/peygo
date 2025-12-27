"use client";

import { useState } from "react";
import { 
  Card, 
  CardBody, 
  Input, 
  Select, 
  SelectItem, 
  Button, 
  Pagination
} from "@heroui/react";
import { 
  Search, 
  Clock, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2,
  FileText,
  DollarSign,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="relative space-y-8 pb-10">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-400/5 blur-[120px] -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-1">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 shadow-md text-white text-xs font-bold uppercase tracking-widest mb-4">
             <FileText size={12} />
             <span>Document Management</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Semua Invoice
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Kelola dan pantau seluruh transaksi di ekosistem PeyGo.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <Button 
                variant="flat" 
                startContent={<RotateCcw size={16} />}
                onPress={() => { setFilterStatus("ALL"); setSearchQuery(""); }}
                className="font-semibold text-sm bg-white/60 backdrop-blur-xl border border-white/50 h-12 rounded-2xl"
            >
                Reset
            </Button>
            <Button 
                color="primary" 
                startContent={<Filter size={16} />}
                className="font-semibold text-sm h-12 rounded-2xl shadow-lg"
            >
                Filter Lanjut
            </Button>
        </div>
      </div>

      {/* Filters Hub */}
      <Card className="shadow-lg shadow-slate-200/20 border border-white/50 bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
        <CardBody className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Cari Transaksi"
                placeholder="Nomor invoice atau nama pengguna..."
                labelPlacement="outside"
                startContent={<Search className="text-slate-400" size={18} />}
                value={searchQuery}
                onValueChange={setQuery => { setSearchQuery(setQuery); setPage(1); }}
                variant="bordered"
                classNames={{
                  label: "text-slate-700 font-semibold text-xs uppercase tracking-wider mb-2",
                  inputWrapper: "bg-white/80 border-slate-200 shadow-sm rounded-2xl h-12 hover:border-blue-400 transition-colors",
                }}
              />
            </div>
            <div>
              <Select
                label="Status Pembayaran"
                labelPlacement="outside"
                selectedKeys={[filterStatus]}
                onSelectionChange={(keys) => { setFilterStatus(Array.from(keys)[0] as string); setPage(1); }}
                variant="bordered"
                classNames={{
                   label: "text-slate-700 font-semibold text-xs uppercase tracking-wider mb-2",
                   trigger: "bg-white/80 border-slate-200 shadow-sm rounded-2xl h-12",
                }}
              >
                <SelectItem key="ALL">Semua Status</SelectItem>
                <SelectItem key="PAID">Lunas</SelectItem>
                <SelectItem key="SENT">Terkirim</SelectItem>
                <SelectItem key="DISBURSED">Dicairkan</SelectItem>
                <SelectItem key="DRAFT">Draft</SelectItem>
                <SelectItem key="FAILED">Gagal</SelectItem>
              </Select>
            </div>
            <div className="flex items-end">
                <div className="w-full p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Sesuai Filter</p>
                        <p className="text-lg font-semibold tracking-tight">{filteredInvoices.length} Dokumen</p>
                    </div>
                    <FileText className="text-slate-700" size={24} />
                </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table Section */}
      <Card className="shadow-lg shadow-slate-200/20 border border-white/50 bg-white/60 backdrop-blur-xl rounded-[40px] overflow-hidden">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 font-semibold uppercase text-xs tracking-widest border-b border-slate-100/50">
                  <th className="py-6 px-10">Informasi Invoice</th>
                  <th className="py-6 px-10">Pemilik</th>
                  <th className="py-6 px-10 text-right">Nominal</th>
                  <th className="py-6 px-10 text-center">Status</th>
                  <th className="py-6 px-10 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/50 font-medium">
                <AnimatePresence mode="popLayout">
                  {items.map((inv) => (
                    <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={inv.id} 
                        className="hover:bg-slate-50/40 transition-colors group"
                    >
                      <td className="py-8 px-10">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm">
                             <FileText size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 italic tracking-tight group-hover:text-blue-600 transition-colors">
                                {inv.invoice_number}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5 opacity-60">
                                <span className="text-xs font-bold uppercase tracking-widest">{inv.type.toLowerCase()}</span>
                                <span className="text-xs">•</span>
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    {new Date(inv.created_at).toLocaleDateString("id-ID")}
                                </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-white flex items-center justify-center text-slate-400">
                                <Clock size={12} />
                            </div>
                            <span className="font-semibold text-slate-700">{inv.userName}</span>
                        </div>
                      </td>
                      <td className="py-8 px-10 text-right">
                        <div className="inline-flex flex-col items-end">
                            <span className="font-semibold text-lg text-slate-900 tracking-tight">{formatCurrency(inv.total_amount)}</span>
                            <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                <DollarSign size={10} />
                                <span>Gross Amount</span>
                            </div>
                        </div>
                      </td>
                      <td className="py-8 px-10 text-center">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="py-8 px-10 text-right">
                        <Button 
                            variant="light" 
                            isIconOnly 
                            className="bg-white/60 hover:bg-slate-900 hover:text-white border border-white/50 backdrop-blur-md rounded-2xl transition-all shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination Glass Footer */}
          <div className="p-8 border-t border-slate-100/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              Menampilkan {items.length} dari {filteredInvoices.length} hasil
            </p>
            <Pagination
              total={pages}
              page={page}
              onChange={setPage}
              variant="flat"
              classNames={{
                wrapper: "gap-2",
                item: "bg-white/60 backdrop-blur-md border border-white/50 rounded-xl font-bold text-xs hover:bg-slate-900 hover:text-white transition-all",
                cursor: "bg-slate-900 text-white shadow-md",
              }}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string; dot: string; icon: React.ReactNode }> = {
    DRAFT: { bg: "bg-slate-500/10", text: "text-slate-600", label: "Draft", dot: "bg-slate-400", icon: <Clock size={10} /> },
    SENT: { bg: "bg-orange-500/10", text: "text-orange-600", label: "Terkirim", dot: "bg-orange-400", icon: <RotateCcw size={10} /> },
    PAID: { bg: "bg-emerald-500/10", text: "text-emerald-700", label: "Lunas", dot: "bg-emerald-500", icon: <CheckCircle2 size={10} /> },
    DISBURSED: { bg: "bg-blue-500/10", text: "text-blue-700", label: "Dicairkan", dot: "bg-blue-500", icon: <CheckCircle2 size={10} /> },
    FAILED: { bg: "bg-rose-500/10", text: "text-rose-600", label: "Gagal", dot: "bg-rose-500", icon: <RotateCcw size={10} /> },
  };

  const { bg, text, label, icon } = config[status] || config.DRAFT;

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${bg} ${text} border border-white/40 backdrop-blur-md`}>
      {icon}
      {label}
    </span>
  );
}
