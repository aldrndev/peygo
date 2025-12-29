"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { updateSettings } from "@/app/(dashboard)/dashboard/admin/settings/actions";
import type { Setting } from "@/types/database";

interface AdminSettingsClientProps {
  settings: Setting[];
}

// Helper to get setting value by key
function getSettingValue(settings: Setting[], key: string, defaultValue: string = ""): string {
  const setting = settings.find(s => s.key === key);
  return setting?.value || defaultValue;
}

function getSettingBool(settings: Setting[], key: string, defaultValue: boolean = false): boolean {
  const setting = settings.find(s => s.key === key);
  return setting?.value === "true" || defaultValue;
}

export default function AdminSettingsClient({ settings }: AdminSettingsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: {
      // General
      platform_name: getSettingValue(settings, "platform_name", "PeyGo"),
      support_email: getSettingValue(settings, "support_email", "support@peygo.id"),
      whatsapp_center: getSettingValue(settings, "whatsapp_center", "+6281234567890"),
      // Financial
      platform_fee: getSettingValue(settings, "platform_fee", "2.5"),
      mdr_fee: getSettingValue(settings, "mdr_fee", "1.5"),
      ppn_rate: getSettingValue(settings, "ppn_rate", "11"),
      // SMTP
      smtp_host: getSettingValue(settings, "smtp_host", "smtp.gmail.com"),
      smtp_port: getSettingValue(settings, "smtp_port", "587"),
      smtp_user: getSettingValue(settings, "smtp_user", "noreply@peygo.id"),
      // Toggles
      email_transaction: getSettingBool(settings, "email_transaction", true),
      alert_registration: getSettingBool(settings, "alert_registration", true),
      wa_reminder: getSettingBool(settings, "wa_reminder", false),
      require_2fa: getSettingBool(settings, "require_2fa", false),
      auto_logout: getSettingBool(settings, "auto_logout_mins") ? true : true,
    },
  });
  
  // Use useWatch for reactive form values
  const watchedValues = useWatch({ control });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const updates = [
        { key: "platform_name", value: data.platform_name },
        { key: "support_email", value: data.support_email },
        { key: "whatsapp_center", value: data.whatsapp_center },
        { key: "platform_fee", value: data.platform_fee },
        { key: "mdr_fee", value: data.mdr_fee },
        { key: "ppn_rate", value: data.ppn_rate },
        { key: "smtp_host", value: data.smtp_host },
        { key: "smtp_port", value: data.smtp_port },
        { key: "smtp_user", value: data.smtp_user },
        { key: "email_transaction", value: String(data.email_transaction) },
        { key: "alert_registration", value: String(data.alert_registration) },
        { key: "wa_reminder", value: String(data.wa_reminder) },
        { key: "require_2fa", value: String(data.require_2fa) },
      ];

      const result = await updateSettings(updates);
      
      if (result.success) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="relative space-y-6 md:space-y-8 pb-10">
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
                {...register("platform_name")}
                placeholder="Identitas sistem" 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StandardInput 
                  label="Email Support" 
                  {...register("support_email")}
                  icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                />
                <StandardInput 
                  label="WhatsApp Center" 
                  {...register("whatsapp_center")}
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
                {...register("platform_fee")}
                suffix="%"
                type="number"
                step="0.1"
              />
              <StandardInput 
                label="Biaya MDR" 
                {...register("mdr_fee")}
                suffix="%"
                type="number"
                step="0.1"
              />
              <StandardInput 
                label="PPN Standar" 
                {...register("ppn_rate")}
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
                <StandardInput label="SMTP Host" {...register("smtp_host")} />
                <StandardInput label="SMTP Port" {...register("smtp_port")} />
              </div>
              <StandardInput label="User Notifikasi" {...register("smtp_user")} />
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground">
                  <Lock className="w-3 h-3 inline mr-1" />
                  SMTP Password dikelola via environment variable untuk keamanan.
                </p>
              </div>
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
                checked={watchedValues.email_transaction}
                onCheckedChange={(checked) => setValue("email_transaction", checked)}
              />
              <Separator />
              <StandardSwitch 
                title="Alert Pendaftaran" 
                description="Notifikasi instan untuk verifikasi pengguna"
                checked={watchedValues.alert_registration}
                onCheckedChange={(checked) => setValue("alert_registration", checked)}
              />
              <Separator />
              <StandardSwitch 
                title="Reminder WhatsApp" 
                description="Kirim pengingat otomatis H-1 jatuh tempo"
                checked={watchedValues.wa_reminder}
                onCheckedChange={(checked) => setValue("wa_reminder", checked)}
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
                checked={watchedValues.require_2fa}
                onCheckedChange={(checked) => setValue("require_2fa", checked)}
              />
              <Separator />
              <StandardSwitch 
                title="Auto-Logout Inactivity" 
                description="Sesi berakhir setelah 30 menit"
                checked={watchedValues.auto_logout}
                onCheckedChange={(checked) => setValue("auto_logout", checked)}
              />
              <div className="mt-8">
                <Button type="button" variant="outline" className="w-full">
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
              <p className="text-primary-foreground/70 text-sm mb-8 font-medium relative z-10">
                Pastikan seluruh parameter sudah sesuai sebelum memperbarui sistem.
              </p>
              <Button 
                type="submit"
                variant="secondary"
                size="lg" 
                className="w-full relative z-10"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : saveStatus === "success" ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Tersimpan!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Terapkan Perubahan
                  </>
                )}
              </Button>
              {saveStatus === "error" && (
                <p className="text-sm text-destructive-foreground mt-4 text-center">
                  Gagal menyimpan. Silakan coba lagi.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
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

interface StandardInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  suffix?: string;
}

function StandardInput({ label, icon, suffix, ...props }: StandardInputProps) {
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

function StandardSwitch({ title, description, checked, onCheckedChange }: { title: string, description: string, checked?: boolean, onCheckedChange?: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="pr-6">
        <h4 className="text-sm font-semibold text-foreground leading-tight mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground font-medium">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
