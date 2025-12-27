"use client";

import { Card, CardBody, Button, Chip, Image, Avatar } from "@heroui/react";
import { 
  ArrowLeft, 
  Phone, 
  Building, 
  MapPin, 
  Activity, 
  Receipt, 
  CreditCard,
  ShieldCheck,
  Calendar,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Invoice {
  id: string;
  type: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface UserProfile {
  id: string;
  name: string | null;
  phone: string | null;
  role: string;
  company_name: string | null;
  company_address: string | null;
  logo_url: string | null;
  created_at: string;
}

interface AdminUserDetailClientProps {
  profile: UserProfile;
  invoices: Invoice[];
}

export default function AdminUserDetailClient({ profile, invoices }: AdminUserDetailClientProps) {
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalTransactionalValue = invoices.reduce((acc, inv) => acc + (inv.total_amount || 0), 0);

  return (
    <div className="relative space-y-6 md:space-y-8 pb-10">
      {/* Navigation */}
      <div>
        <Button 
          variant="flat" 
          size="sm"
          onPress={() => router.back()}
          className="mb-4 font-medium text-xs bg-white border border-slate-100 h-9 px-3 rounded-lg"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Kembali
        </Button>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Avatar 
             name={profile.name?.charAt(0) || "U"} 
             className={`w-14 h-14 rounded-xl text-xl font-semibold ${
                profile.role === "admin" ? "bg-slate-900 text-white" : "bg-blue-500 text-white"
             }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                {profile.name || "User Detail"}
              </h1>
              <Chip 
                size="sm"
                variant="flat" 
                color={profile.role === "admin" ? "primary" : "default"}
                className="text-xs"
              >
                {profile.role}
              </Chip>
            </div>
            <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Member sejak {new Date(profile.created_at).toLocaleDateString("id-ID", {
                month: 'short', year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Left Column: Personal Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-2xl shadow-slate-200/40 border border-white/50 bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
            <CardBody className="p-8 space-y-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 border border-white/80 transition-all hover:bg-white">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-sm">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Telepon</p>
                    <p className="font-semibold text-slate-900">{profile.phone || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 border border-white/80 transition-all hover:bg-white">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-sm">
                    <Activity size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Aktivitas</p>
                    <p className="font-semibold text-slate-900">{invoices.length} Transaksi</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-[24px] text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-all duration-700" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Total Transaction Value</p>
                <p className="text-2xl font-semibold tracking-tight relative z-10">{formatCurrency(totalTransactionalValue)}</p>
                <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl border border-white/10 relative z-10 backdrop-blur-md">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">Account Verified</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Business & Transactions */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-2xl shadow-slate-200/40 border border-white/50 bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
            <CardBody className="p-8 md:p-10">
              <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
                <div className="w-24 h-24 rounded-[32px] bg-white border-4 border-white shadow-2xl shadow-slate-200 flex items-center justify-center p-4 shrink-0 overflow-hidden">
                  {profile.logo_url ? (
                    <Image src={profile.logo_url} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Building className="w-10 h-10 text-slate-200" />
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-2xl text-slate-900 tracking-tight">Identitas Bisnis</h3>
                  <p className="text-slate-500 mt-2 font-medium text-lg">{profile.company_name || "Nama bisnis belum diatur"}</p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-6 bg-white/50 rounded-3xl border border-white/80 backdrop-blur-md shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Alamat Operasional</p>
                  <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                    {profile.company_address || "Informasi alamat belum dilengkapi oleh pengguna."}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Transaction History Glass */}
          <Card className="shadow-lg shadow-slate-200/20 border border-white/50 bg-white/60 backdrop-blur-xl rounded-[40px] overflow-hidden mb-8">
            <CardBody className="p-0">
              <div className="p-8 border-b border-slate-100/50 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-xl text-slate-900 tracking-tight">Riwayat Transaksi</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Audit Log Finansial</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 opacity-50">
                    <Activity size={20} className="text-slate-400" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-400 font-bold uppercase text-xs tracking-widest border-b border-slate-100/50">
                      <th className="py-6 px-10">Tipe Dokumen</th>
                      <th className="py-6 px-10 text-right">Nominal</th>
                      <th className="py-6 px-10 text-center">Status</th>
                      <th className="py-6 px-10 text-right">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50/50 font-medium">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="py-8 px-10">
                          <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm ${inv.type === "BILLING" ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                                {inv.type === "BILLING" ? <Receipt size={14} /> : <CreditCard size={14} />}
                             </div>
                             <span className="font-semibold text-slate-900 italic tracking-tight">{inv.type === "BILLING" ? "Penagihan" : "Pay-out"}</span>
                          </div>
                        </td>
                        <td className="py-8 px-10 text-right">
                          <span className="font-semibold text-lg text-slate-900 tracking-tight">{formatCurrency(inv.total_amount)}</span>
                        </td>
                        <td className="py-8 px-10 text-center">
                           <StatusBadge status={inv.status} />
                        </td>
                        <td className="py-8 px-10 text-right text-xs text-slate-500 font-bold uppercase tracking-widest">
                          {new Date(inv.created_at).toLocaleDateString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {invoices.length === 0 && (
                <div className="text-center py-24 group">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-200 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                    <Clock className="w-10 h-10" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Belum ada aktivitas transaksi</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string; dot: string }> = {
    DRAFT: { bg: "bg-slate-500/10", text: "text-slate-600", label: "Draft", dot: "bg-slate-400" },
    SENT: { bg: "bg-orange-500/10", text: "text-orange-600", label: "Terkirim", dot: "bg-orange-400" },
    PAID: { bg: "bg-emerald-500/10", text: "text-emerald-700", label: "Lunas", dot: "bg-emerald-500" },
    DISBURSED: { bg: "bg-blue-500/10", text: "text-blue-700", label: "Dicairkan", dot: "bg-blue-500" },
    FAILED: { bg: "bg-rose-500/10", text: "text-rose-600", label: "Gagal", dot: "bg-rose-500" },
    EXPIRED: { bg: "bg-rose-500/10", text: "text-rose-600", label: "Expired", dot: "bg-rose-500" },
  };

  const { bg, text, label, dot } = config[status] || config.DRAFT;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${bg} ${text} border border-white/50 backdrop-blur-sm`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
