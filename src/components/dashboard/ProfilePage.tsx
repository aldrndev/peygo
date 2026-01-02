"use client";

import { useState, startTransition } from "react";
import Image from "next/image";
import { User, Mail, Phone, Building, Save, CheckCircle2, AlertCircle, MapPin, CreditCard, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProfile, changePassword } from "@/app/(dashboard)/dashboard/profil/actions";
import { profileSchema } from "@/app/(dashboard)/dashboard/profil/schema";
import LogoUpload from "@/components/ui/LogoUpload";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BankCombobox } from "@/components/ui/BankCombobox";
import { cn } from "@/lib/utils";

interface ProfilePageProps {
  user: { email?: string; id: string };
  profile: { 
    name: string; 
    phone?: string;
    company_name?: string;
    company_address?: string;
    logo_url?: string;
    bank_name?: string;
    bank_account_number?: string;
    bank_account_name?: string;
    role?: string;
  } | null;
}

type ProfileSchema = z.infer<typeof profileSchema>;

export default function ProfilePage({ user, profile: initialProfile }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>(initialProfile?.bank_name || "");
  const [profile, setLocalProfile] = useState(initialProfile);
  
  // Change password state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      company_name: profile?.company_name || "",
      company_address: profile?.company_address || "",
      logo_url: profile?.logo_url || "",
      bank_name: profile?.bank_name || "",
      bank_account_number: profile?.bank_account_number || "",
      bank_account_name: profile?.bank_account_name || "",
    },
  });

  const onSubmit = async (data: ProfileSchema) => {
    setIsPending(true);
    setServerError(null);
    setSuccess(false);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });
    
    formData.set("bank_name", selectedBank);

    if (logoFile) {
      const supabase = createClient();
      const fileExt = logoFile.name.split(".").pop();
      const fileName = `${user.id}/logo.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(fileName, logoFile, { upsert: true });
      
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from("logos")
          .getPublicUrl(fileName);
        formData.set("logo_url", publicUrl);
      } else {
        setServerError("Gagal mengunggah logo: " + uploadError.message);
        setIsPending(false);
        return;
      }
    }

    startTransition(async () => {
      const result = await updateProfile(null, formData);
      if (result?.success) {
        setSuccess(true);
        setIsPending(false);
        setIsEditing(false); // Back to view mode
        // Update local profile to reflect changes without page refresh
        const updatedData = {
          ...data,
          bank_name: selectedBank,
          logo_url: formData.get("logo_url") as string || profile?.logo_url
        };
        setLocalProfile(updatedData as ProfilePageProps["profile"]);
        setTimeout(() => setSuccess(false), 5000);
      } else if (result?.error) {
        setServerError(result.error);
        setIsPending(false);
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setServerError(null);
    reset(); // Reset form to default values (original data)
    setSelectedBank(profile?.bank_name || "");
  };

  const handlePasswordChange = async () => {
    setIsChangingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    const formData = new FormData();
    formData.append("old_password", oldPassword);
    formData.append("new_password", newPassword);
    formData.append("confirm_password", confirmPassword);

    startTransition(async () => {
      const result = await changePassword(null, formData);
      if (result?.success) {
        setPasswordSuccess(true);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordSection(false);
        setTimeout(() => setPasswordSuccess(false), 5000);
      } else if (result?.error) {
        setPasswordError(result.error);
      }
      setIsChangingPassword(false);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Profil & Bisnis</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola identitas dan informasi operasional</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} size="sm" className="rounded-lg px-6">
            Ubah Profil
          </Button>
        ) : (
          <div className="flex gap-2">
             <Button variant="ghost" onClick={handleCancel} size="sm" className="rounded-lg" disabled={isPending}>
               Batal
             </Button>
             <Button onClick={handleSubmit(onSubmit)} size="sm" className="rounded-lg px-6 shadow-lg shadow-primary/20" isLoading={isPending}>
               <Save size={14} className="mr-2" />
               Simpan Perubahan
             </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: User Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-card border border-border rounded-xl">
              <div className="p-6 border-b border-border flex flex-col items-center text-center">
                {isEditing ? (
                  <LogoUpload 
                    currentLogoUrl={profile?.logo_url}
                    onLogoChange={setLogoFile}
                  />
                ) : (
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-muted bg-muted flex items-center justify-center">
                    {profile?.logo_url ? (
                      <Image src={profile.logo_url} alt="Logo" fill className="object-contain p-2" />
                    ) : (
                      <Building className="w-10 h-10 text-muted-foreground/40" />
                    )}
                  </div>
                )}
                <h3 className="mt-4 font-semibold text-foreground text-lg">{profile?.name || "Member Peygo"}</h3>
                <Badge variant="secondary" className="mt-2 text-[10px] uppercase font-semibold tracking-wider">
                  {profile?.role === 'admin' ? 'Administrator' : 'Pengusaha'}
                </Badge>
              </div>

              <div className="p-6 space-y-6">
                 <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                        <User size={12} />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Informasi Dasar</span>
                    </div>

                    <div className="space-y-4">
                      {isEditing ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs">Nama Lengkap</Label>
                            <Input 
                              {...register("name")}
                              id="name"
                              placeholder="Nama asli"
                              className={cn(errors.name && "border-destructive")}
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs">Telepon</Label>
                            <div className="relative">
                              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <Input 
                                {...register("phone")}
                                id="phone"
                                type="tel"
                                placeholder="0812..."
                                className={cn("pl-10", errors.phone && "border-destructive")}
                              />
                            </div>
                            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                           <div className="flex flex-col">
                             <span className="text-[10px] uppercase font-semibold text-muted-foreground/40">Nama Lengkap</span>
                             <span className="text-sm  text-foreground">{profile?.name || "-"}</span>
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[10px] uppercase font-semibold text-muted-foreground/40">Nomor Telepon</span>
                             <span className="text-sm  text-foreground flex items-center gap-2">
                               <Phone size={12} className="text-muted-foreground" />
                               {profile?.phone || "-"}
                             </span>
                           </div>
                        </div>
                      )}
                    </div>
                 </div>
              </div>
          </div>

          <div className="p-4 bg-foreground text-background rounded-xl flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center shrink-0">
                <Mail size={16} />
             </div>
             <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold text-background/40">Email Utama</p>
                <p className="text-sm  truncate">{user.email}</p>
             </div>
          </div>
        </div>

        {/* Right Column: Business & Bank */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-xl">
             <div className="p-6 md:p-8">
                {/* Business Section */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center text-background shadow-lg shadow-foreground/10">
                    <Building size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-foreground">Identitas Bisnis</h3>
                    <p className="text-muted-foreground text-sm">Informasi penagihan resmi</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {isEditing ? (
                    <>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="company_name" className="text-xs">Nama Bisnis</Label>
                        <Input 
                          {...register("company_name")}
                          id="company_name"
                          placeholder="PT. Nama Perusahaan"
                          className={cn(errors.company_name && "border-destructive")}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="company_address" className="text-xs">Alamat Bisnis</Label>
                        <div className="relative">
                          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            {...register("company_address")}
                            id="company_address"
                            placeholder="Jalan, Gedung, Lantai..."
                            className={cn("pl-10", errors.company_address && "border-destructive")}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-semibold text-muted-foreground/40 mb-1">Nama Bisnis</span>
                         <span className="text-base font-semibold text-foreground">{profile?.company_name || "Belum diisi"}</span>
                      </div>
                      <div className="flex flex-col md:col-span-2">
                         <span className="text-[10px] uppercase font-semibold text-muted-foreground/40 mb-1">Alamat Penagihan</span>
                         <span className="text-sm text-foreground flex items-start gap-2 leading-relaxed">
                            <MapPin size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                            {profile?.company_address || "Belum diisi"}
                         </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Bank Section */}
                <div className="mt-10 pt-10 border-t border-border/60">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-foreground">Informasi Rekening</h4>
                      <p className="text-muted-foreground text-sm">Digunakan untuk pencairan dana</p>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="bank_name" className="text-xs">Nama Bank</Label>
                        <BankCombobox 
                          value={selectedBank} 
                          onValueChange={setSelectedBank}
                          placeholder="Cari dan pilih bank..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bank_account_number" className="text-xs">Nomor Rekening</Label>
                        <Input {...register("bank_account_number")} id="bank_account_number" placeholder="1234567890" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bank_account_name" className="text-xs">Nama Pemilik</Label>
                        <Input {...register("bank_account_name")} id="bank_account_name" placeholder="Nama sesuai buku" />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/30 p-4 rounded-xl border border-border/50">
                      <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-semibold text-muted-foreground/40">Bank</span>
                         <span className="text-sm ">{profile?.bank_name || "-"}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-semibold text-muted-foreground/40">No. Rekening</span>
                         <span className="text-sm  tracking-wider">{profile?.bank_account_number || "-"}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-semibold text-muted-foreground/40">Atas Nama</span>
                         <span className="text-sm ">{profile?.bank_account_name || "-"}</span>
                      </div>
                    </div>
                  )}
                </div>
             </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-card border border-border rounded-xl">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center shadow-inner">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-foreground">Ubah Password</h4>
                    <p className="text-muted-foreground text-sm">Perbarui password akun Anda</p>
                  </div>
                </div>
                {!showPasswordSection && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPasswordSection(true)}
                  >
                    Ubah Password
                  </Button>
                )}
              </div>

              {showPasswordSection && (
                <div className="space-y-4">
                  {/* Old Password - Full Width */}
                  <div className="space-y-2">
                    <Label htmlFor="old_password" className="text-xs">Password Lama</Label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        id="old_password"
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Masukkan password saat ini"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showOldPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password & Confirm - 2 Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new_password" className="text-xs">Password Baru</Label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          id="new_password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password" className="text-xs">Konfirmasi Password</Label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          id="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi password baru"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {passwordError && (
                    <div className="p-3 bg-destructive/5 text-destructive rounded-lg border border-destructive/20 flex items-center gap-2 text-sm">
                      <AlertCircle size={14} />
                      {passwordError}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword || !oldPassword || !newPassword || !confirmPassword}
                      size="sm"
                    >
                      {isChangingPassword ? "Menyimpan..." : "Simpan Password"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowPasswordSection(false);
                        setOldPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setPasswordError(null);
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-success/5 text-success rounded-lg border border-success/20 flex items-center gap-2 text-sm">
                  <CheckCircle2 size={14} />
                  Password berhasil diubah!
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          {serverError && (
            <div className="p-4 bg-destructive/5 text-destructive rounded-xl border border-destructive/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} />
              <p className="text-xs ">{serverError}</p>
            </div>
          )}
          {success && (
            <div className="p-4 bg-success/5 text-success rounded-xl border border-success/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={16} />
              <p className="text-xs  text-success-foreground">Perubahan profil berhasil disimpan!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

