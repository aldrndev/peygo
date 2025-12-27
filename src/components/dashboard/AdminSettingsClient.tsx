"use client";

import { Card, CardBody, Input, Switch, Button, Divider } from "@heroui/react";
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
  Settings as SettingsIcon
} from "lucide-react";

export default function AdminSettingsClient() {
  return (
    <div className="relative space-y-8 pb-10">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/5 blur-[120px] -z-10 pointer-events-none" />

      {/* Header Section */}
      <div className="px-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest mb-4">
             <SettingsIcon size={12} />
             <span>System Preferences</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
          Pengaturan Sistem
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Kelola parameter operasional, kebijakan biaya, dan keamanan platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* Left Column: Core Settings */}
        <div className="lg:col-span-7 space-y-6">
          {/* General Settings */}
          <SettingsSection 
            icon={<Globe className="w-5 h-5" />}
            title="Pengaturan Dasar"
            description="Identitas dan kontak publik platform"
            color="blue"
          >
            <div className="grid grid-cols-1 gap-8">
              <StandardInput 
                label="Nama Platform" 
                defaultValue="PeyGo" 
                placeholder="Identitas sistem" 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StandardInput 
                  label="Email Support" 
                  defaultValue="support@peygo.id" 
                  startContent={<Mail className="w-4 h-4 text-slate-400" />}
                />
                <StandardInput 
                  label="WhatsApp Center" 
                  defaultValue="+6281234567890" 
                  startContent={<Smartphone className="w-4 h-4 text-slate-400" />}
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
                endContent={<span className="text-slate-400 font-bold text-xs uppercase">%</span>}
                type="number"
              />
              <StandardInput 
                label="Biaya MDR" 
                defaultValue="1.5" 
                endContent={<span className="text-slate-400 font-bold text-xs uppercase">%</span>}
                type="number"
              />
              <StandardInput 
                label="PPN Standar" 
                defaultValue="11" 
                endContent={<span className="text-slate-400 font-bold text-xs uppercase">%</span>}
                type="number"
              />
            </div>
            <div className="mt-8 p-5 rounded-2xl bg-blue-50/50 border border-blue-100/50 backdrop-blur-md flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                <Info size={18} />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
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
            <div className="grid grid-cols-1 gap-8">
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
                defaultSelected
              />
              <Divider className="opacity-40" />
              <StandardSwitch 
                title="Alert Pendaftaran" 
                description="Notifikasi instan untuk verifikasi pengguna"
                defaultSelected
              />
              <Divider className="opacity-40" />
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
              <Divider className="opacity-40" />
              <StandardSwitch 
                title="Auto-Logout Inactivity" 
                description="Sesi berakhir setelah 30 menit"
                defaultSelected
              />
              <div className="mt-8">
                <Button 
                  variant="flat" 
                  fullWidth
                  className="font-bold text-xs uppercase tracking-widest rounded-2xl h-12 bg-slate-900 text-white shadow-xl shadow-slate-200"
                  startContent={<Lock className="w-4 h-4" />}
                >
                  Lihat Audit Log Keamanan
                </Button>
              </div>
            </div>
          </SettingsSection>

          {/* Save Action Glass */}
          <Card className="shadow-lg shadow-blue-200/20 border border-blue-100/50 bg-blue-600 rounded-[32px] overflow-hidden">
            <CardBody className="p-8 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -z-0" />
              <h3 className="text-xl font-semibold mb-2 relative z-10">Simpan Konfigurasi</h3>
              <p className="text-white/70 text-sm mb-8 font-medium relative z-10">Pastikan seluruh parameter sudah sesuai sebelum memperbarui sistem inti PeyGo.</p>
              <Button 
                variant="solid"
                size="lg" 
                fullWidth 
                className="rounded-2xl h-14 bg-white text-blue-600 font-bold text-sm tracking-tight shadow-md relative z-10"
                startContent={<Save className="w-5 h-5 shadow-sm" />}
              >
                Terapkan Perubahan
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ icon, title, description, children, color }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode, color: string }) {
  const bgClasses: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white",
    indigo: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white",
    orange: "bg-orange-500/10 text-orange-600 border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white",
    rose: "bg-rose-500/10 text-rose-600 border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white",
  };

  return (
    <Card className="shadow-lg shadow-slate-200/10 border border-white/50 bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden group">
      <CardBody className="p-8">
        <div className="flex items-center gap-4 mb-10">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${bgClasses[color]}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 leading-tight mb-1">{title}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{description}</p>
          </div>
        </div>
        {children}
      </CardBody>
    </Card>
  );
}

function StandardInput({ label, ...props }: { label: string } & React.ComponentProps<typeof Input>) {
  return (
    <Input
      label={label}
      labelPlacement="outside"
      variant="bordered"
      classNames={{
        label: "text-slate-700 font-bold text-xs uppercase tracking-widest mb-3",
        inputWrapper: "bg-white/80 border-slate-200 shadow-sm rounded-2xl h-12 hover:border-blue-400 transition-colors",
        input: "text-sm font-semibold",
      }}
      {...props}
    />
  );
}

function StandardSwitch({ title, description, ...props }: { title: string, description: string } & React.ComponentProps<typeof Switch>) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="pr-6">
        <h4 className="text-sm font-semibold text-slate-800 leading-tight mb-1">{title}</h4>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{description}</p>
      </div>
      <Switch 
        size="md"
        color="primary"
        classNames={{
            wrapper: "group-data-[selected=true]:bg-blue-600",
        }}
        {...props}
      />
    </div>
  );
}
