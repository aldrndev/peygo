"use client";

import { 
  Globe, 
  Bell, 
  Shield, 
  CreditCard, 
  Mail, 
  Save,
  Lock,
  Smartphone,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function AdminSettingsClient() {
  return (
    <div className="relative space-y-6 md:space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          Pengaturan Sistem
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Kelola parameter operasional dan keamanan platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Left Column: Core Settings */}
        <div className="lg:col-span-7 space-y-6">
          {/* General Settings */}
          <SettingsSection 
            icon={<Globe className="w-5 h-5" />}
            title="Pengaturan Dasar"
            description="Identitas dan kontak publik platform"
            color="blue"
          >
            <div className="grid grid-cols-1 gap-6">
              <StandardInput 
                label="Nama Platform" 
                defaultValue="PeyGo" 
                placeholder="Identitas sistem" 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StandardInput 
                  label="Email Support" 
                  defaultValue="support@peygo.id" 
                  icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                />
                <StandardInput 
                  label="WhatsApp Center" 
                  defaultValue="+6281234567890" 
                  icon={<Smartphone className="w-4 h-4 text-muted-foreground" />}
                />
              </div>
            </div>
          </SettingsSection>

          {/* Payment Settings */}
          <SettingsSection 
            icon={<CreditCard className="w-5 h-5" />}
            title="Kebijakan Finansial"
            description="Konfigurasi biaya layanan dan pajak"
            color="emerald"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StandardInput 
                label="Biaya Platform" 
                defaultValue="2.5" 
                suffix="%"
                type="number"
              />
              <StandardInput 
                label="Biaya MDR" 
                defaultValue="1.5" 
                suffix="%"
                type="number"
              />
              <StandardInput 
                label="PPN Standar" 
                defaultValue="11" 
                suffix="%"
                type="number"
              />
            </div>
            <div className="mt-8 p-5 rounded-2xl bg-blue-50 border border-blue-100 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
                <Info size={18} />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Perubahan pada parameter biaya akan berdampak langsung pada seluruh kalkulasi invoice baru. Pastikan telah melalui sinkronisasi dengan tim finansial sebelum menyimpan.
              </p>
            </div>
          </SettingsSection>

          {/* SMTP Settings */}
          <SettingsSection 
            icon={<Mail className="w-5 h-5" />}
            title="Gateway Email (SMTP)"
            description="Konfigurasi pengiriman notifikasi sistem"
            color="indigo"
          >
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StandardInput label="SMTP Host" defaultValue="smtp.gmail.com" />
                <StandardInput label="SMTP Port" defaultValue="587" />
              </div>
              <StandardInput label="User Notifikasi" defaultValue="noreply@peygo.id" />
              <StandardInput label="Secret Key / Password" type="password" defaultValue="********" />
            </div>
          </SettingsSection>
        </div>

        {/* Right Column: Preferences & Security */}
        <div className="lg:col-span-5 space-y-6">
          {/* Notification Preferences */}
          <SettingsSection 
            icon={<Bell className="w-5 h-5" />}
            title="Notifikasi"
            description="Kontrol alur informasi otomatis"
            color="orange"
          >
            <div className="space-y-6">
              <StandardSwitch 
                title="Email Transaksi" 
                description="Kirim detail ke admin saat ada pembayaran"
                defaultChecked
              />
              <Separator />
              <StandardSwitch 
                title="Alert Pendaftaran" 
                description="Notifikasi instan untuk verifikasi pengguna"
                defaultChecked
              />
              <Separator />
              <StandardSwitch 
                title="Reminder WhatsApp" 
                description="Kirim pengingat otomatis H-1 jatuh tempo"
              />
            </div>
          </SettingsSection>

          {/* Security & Access */}
          <SettingsSection 
            icon={<Shield className="w-5 h-5" />}
            title="Keamanan"
            description="Proteksi integritas data platform"
            color="rose"
          >
            <div className="space-y-6">
              <StandardSwitch 
                title="Wajibkan 2FA Admin" 
                description="Meningkatkan keamanan akses administratif"
              />
              <Separator />
              <StandardSwitch 
                title="Auto-Logout Inactivity" 
                description="Sesi berakhir setelah 30 menit"
                defaultChecked
              />
              <div className="mt-8">
                <Button className="w-full">
                  <Lock className="w-4 h-4 mr-2" />
                  Lihat Audit Log Keamanan
                </Button>
              </div>
            </div>
          </SettingsSection>

          {/* Save Action */}
          <Card className="bg-primary">
            <CardContent className="p-8 text-primary-foreground relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -z-0" />
              <h3 className="text-xl font-semibold mb-2 relative z-10">Simpan Konfigurasi</h3>
              <p className="text-primary-foreground/70 text-sm mb-8 font-medium relative z-10">Pastikan seluruh parameter sudah sesuai sebelum memperbarui sistem inti PeyGo.</p>
              <Button 
                variant="secondary"
                size="lg" 
                className="w-full relative z-10"
              >
                <Save className="w-5 h-5 mr-2" />
                Terapkan Perubahan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ icon, title, description, children, color }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode, color: string }) {
  const bgClasses: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    emerald: "bg-success/10 text-success border-success/20",
    indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    orange: "bg-primary/10 text-primary border-primary/20",
    rose: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-10">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300", bgClasses[color])}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground leading-tight mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{description}</p>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function StandardInput({ label, icon, suffix, ...props }: { label: string, icon?: React.ReactNode, suffix?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium uppercase tracking-wide">{label}</Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
        <Input
          className={cn(icon && "pl-10", suffix && "pr-10")}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-xs">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function StandardSwitch({ title, description, defaultChecked }: { title: string, description: string, defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="pr-6">
        <h4 className="text-sm font-semibold text-foreground leading-tight mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground font-medium">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
