"use client";

import { useState, startTransition } from "react";
import { User, Mail, Phone, Building, Save, CheckCircle2, AlertCircle, MapPin, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProfile } from "@/app/(dashboard)/dashboard/profil/actions";
import { profileSchema } from "@/app/(dashboard)/dashboard/profil/schema";
import LogoUpload from "@/components/ui/LogoUpload";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfilePageProps {
  user: { email?: string; id: string };
  profile: { 
    name: string; 
    phone?: string;
    company_name?: string;
    company_address?: string;
    logo_url?: string;
  } | null;
}

type ProfileSchema = z.infer<typeof profileSchema>;

export default function ProfilePage({ user, profile }: ProfilePageProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      company_name: profile?.company_name || "",
      company_address: profile?.company_address || "",
      logo_url: profile?.logo_url || "",
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
        setTimeout(() => setSuccess(false), 5000);
      } else if (result?.error) {
        setServerError(result.error);
        setIsPending(false);
      }
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
        <Badge variant="secondary" className="gap-1">
          <ShieldCheck size={12} />
          Terverifikasi
        </Badge>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* User Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border flex flex-col items-center text-center">
                  <LogoUpload 
                    currentLogoUrl={profile?.logo_url}
                    onLogoChange={setLogoFile}
                  />
                  <h3 className="mt-4 font-semibold text-foreground text-base">{profile?.name || "Member Peygo"}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                </div>

                <div className="p-4 space-y-4">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                        <User size={12} />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">Informasi Dasar</span>
                   </div>

                   <div className="space-y-3">
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
                   </div>
                </div>
            </div>

            <div className="p-4 bg-foreground text-background rounded-xl">
               <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center">
                    <Mail size={16} />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs text-background/50 mb-0.5">Email Utama</p>
                    <p className="text-sm font-medium">{user.email}</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column: Business Identity */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
               <div className="p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center text-background">
                      <Building size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">Identitas Bisnis</h3>
                      <p className="text-muted-foreground text-xs mt-0.5">Informasi penagihan perusahaan</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="company_name" className="text-xs">Nama Bisnis</Label>
                      <Input 
                        {...register("company_name")}
                        id="company_name"
                        placeholder="PT. Nama Perusahaan"
                        className={cn(errors.company_name && "border-destructive")}
                      />
                      {errors.company_name && <p className="text-xs text-destructive">{errors.company_name.message}</p>}
                    </div>
                    
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="company_address" className="text-xs">Alamat</Label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          {...register("company_address")}
                          id="company_address"
                          placeholder="Jalan, Gedung, Lantai..."
                          className={cn("pl-10", errors.company_address && "border-destructive")}
                        />
                      </div>
                      {errors.company_address && <p className="text-xs text-destructive">{errors.company_address.message}</p>}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Pastikan data perusahaan sesuai dengan identitas resmi untuk invoice.
                    </p>
                    <Button type="submit" size="sm" isLoading={isPending}>
                      {!isPending && <Save size={14} className="mr-2" />}
                      {isPending ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </div>
               </div>
            </div>

            {/* Status Messages */}
            {serverError && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 flex items-center gap-3">
                <AlertCircle size={16} />
                <p className="text-xs">{serverError}</p>
              </div>
            )}
            {success && (
              <div className="p-4 bg-success/10 text-success rounded-xl border border-success/20 flex items-center gap-3">
                <CheckCircle2 size={16} />
                <p className="text-xs">Profil berhasil disimpan!</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
