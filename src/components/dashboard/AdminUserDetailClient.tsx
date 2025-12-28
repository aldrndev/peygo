"use client";

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
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
  const initials = (profile.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="relative space-y-6 md:space-y-8 pb-10">
      {/* Navigation */}
      <div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-3 h-3 mr-2" />
          Kembali
        </Button>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Avatar className={cn("w-14 h-14 text-xl font-semibold", profile.role === "admin" ? "bg-foreground text-background" : "bg-primary text-primary-foreground")}>
            <AvatarFallback className={profile.role === "admin" ? "bg-foreground text-background" : "bg-primary text-primary-foreground"}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                {profile.name || "User Detail"}
              </h1>
              <Badge variant={profile.role === "admin" ? "default" : "secondary"}>
                {profile.role}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
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
          <Card>
            <CardContent className="p-8 space-y-8">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50 border border-border transition-all hover:bg-card">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Telepon</p>
                    <p className="font-semibold text-foreground">{profile.phone || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50 border border-border transition-all hover:bg-card">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 border border-blue-500/20">
                    <Activity size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Aktivitas</p>
                    <p className="font-semibold text-foreground">{invoices.length} Transaksi</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-foreground rounded-2xl text-background relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-all duration-700" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 relative z-10">Total Transaction Value</p>
                <p className="text-2xl font-semibold tracking-tight relative z-10 tabular-nums">{formatCurrency(totalTransactionalValue)}</p>
                <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl border border-white/10 relative z-10">
                  <ShieldCheck size={14} className="text-success" />
                  <span className="text-xs font-medium uppercase tracking-wide text-white/80">Account Verified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Business & Transactions */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
                <div className="w-24 h-24 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center p-4 shrink-0 overflow-hidden">
                  {profile.logo_url ? (
                    <Image src={profile.logo_url} alt="Logo" width={80} height={80} className="w-full h-full object-contain" />
                  ) : (
                    <Building className="w-10 h-10 text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-2xl text-foreground tracking-tight">Identitas Bisnis</h3>
                  <p className="text-muted-foreground mt-2 font-medium text-lg">{profile.company_name || "Nama bisnis belum diatur"}</p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-6 bg-muted/50 rounded-2xl border border-border">
                <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Alamat Operasional</p>
                  <p className="text-sm text-foreground leading-relaxed font-medium">
                    {profile.company_address || "Informasi alamat belum dilengkapi oleh pengguna."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardContent className="p-0">
              <div className="p-8 border-b border-border flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-xl text-foreground tracking-tight">Riwayat Transaksi</h3>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">Audit Log Finansial</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted">
                    <Activity size={20} className="text-muted-foreground" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-muted-foreground font-medium uppercase text-xs tracking-wide border-b border-border">
                      <th className="py-4 px-6">Tipe Dokumen</th>
                      <th className="py-4 px-6 text-right">Nominal</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-accent/50 transition-colors group">
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-4">
                             <div className={cn(
                               "w-12 h-12 rounded-xl border flex items-center justify-center",
                               inv.type === "BILLING" ? "bg-primary/10 text-primary border-primary/20" : "bg-blue-50 text-blue-600 border-blue-100"
                             )}>
                                {inv.type === "BILLING" ? <Receipt size={14} /> : <CreditCard size={14} />}
                             </div>
                             <span className="font-semibold text-foreground tracking-tight">{inv.type === "BILLING" ? "Penagihan" : "Pay-out"}</span>
                          </div>
                        </td>
                        <td className="py-6 px-6 text-right">
                          <span className="font-semibold text-lg text-foreground tracking-tight tabular-nums">{formatCurrency(inv.total_amount)}</span>
                        </td>
                        <td className="py-6 px-6 text-center">
                           <StatusBadge status={inv.status} />
                        </td>
                        <td className="py-6 px-6 text-right text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          {new Date(inv.created_at).toLocaleDateString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {invoices.length === 0 && (
                <div className="text-center py-24 group">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground/30 border border-border">
                    <Clock className="w-10 h-10" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Belum ada aktivitas transaksi</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string; dot: string }> = {
    DRAFT: { bg: "bg-muted", text: "text-muted-foreground", label: "Draft", dot: "bg-muted-foreground" },
    SENT: { bg: "bg-warning/10", text: "text-warning", label: "Terkirim", dot: "bg-warning" },
    PAID: { bg: "bg-success/10", text: "text-success", label: "Lunas", dot: "bg-success" },
    DISBURSED: { bg: "bg-blue-50", text: "text-blue-600", label: "Dicairkan", dot: "bg-blue-500" },
    FAILED: { bg: "bg-destructive/10", text: "text-destructive", label: "Gagal", dot: "bg-destructive" },
    EXPIRED: { bg: "bg-destructive/10", text: "text-destructive", label: "Expired", dot: "bg-destructive" },
  };

  const { bg, text, label, dot } = config[status] || config.DRAFT;

  return (
    <span className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide", bg, text)}>
      <div className={cn("w-1.5 h-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}
