"use client";

import { useState, startTransition } from "react";
import { Button, Input, Chip } from "@heroui/react";
import { User, Mail, Phone, Building, Save, CheckCircle2, AlertCircle, MapPin, BadgeCheck, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProfile } from "@/app/(dashboard)/dashboard/profil/actions";
import { profileSchema } from "@/app/(dashboard)/dashboard/profil/schema";
import { motion, AnimatePresence } from "framer-motion";
import LogoUpload from "@/components/ui/LogoUpload";
import { createClient } from "@/lib/supabase/client";

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
        // Hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else if (result?.error) {
        setServerError(result.error);
        setIsPending(false);
      }
    });
  };

  return (
    <motion.div 
      className="max-w-5xl mx-auto space-y-8 pb-20"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Profil & Bisnis</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola identitas dan informasi operasional</p>
        </div>
        <Chip 
          variant="flat" 
          color="success" 
          size="sm"
          startContent={<ShieldCheck size={12} />}
          className="text-xs"
        >
          Terverifikasi
        </Chip>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* User Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col items-center text-center">
                  <LogoUpload 
                    currentLogoUrl={profile?.logo_url}
                    onLogoChange={setLogoFile}
                  />
                  <h3 className="mt-4 font-semibold text-slate-900 text-base">{profile?.name || "Member Peygo"}</h3>
                  <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                </div>

                <div className="p-4 space-y-4">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-500 flex items-center justify-center">
                        <User size={12} />
                      </div>
                      <span className="text-xs font-medium text-slate-500">Informasi Dasar</span>
                   </div>

                   <div className="space-y-3">
                     <Input 
                        {...register("name")}
                        label="Nama Lengkap" 
                        placeholder="Nama asli"
                        variant="flat"
                        size="sm"
                        classNames={{
                          label: "font-medium text-slate-500 text-xs",
                          inputWrapper: "bg-white border-slate-100 border rounded-lg h-10",
                          input: "text-sm",
                        }}
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message}
                      />
                      <Input 
                        {...register("phone")}
                        label="Telepon" 
                        type="tel"
                        placeholder="0812..."
                        variant="flat"
                        size="sm"
                        classNames={{
                          label: "font-medium text-slate-500 text-xs",
                          inputWrapper: "bg-white border-slate-100 border rounded-lg h-10",
                          input: "text-sm",
                        }}
                        isInvalid={!!errors.phone}
                        errorMessage={errors.phone?.message}
                        startContent={<Phone size={14} className="text-slate-400" />}
                      />
                   </div>
                </div>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl">
               <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                    <Mail size={16} />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-0.5">Email Utama</p>
                    <p className="text-sm font-medium">{user.email}</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column: Business Identity */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
               <div className="p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                      <Building size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">Identitas Bisnis</h3>
                      <p className="text-slate-500 text-xs mt-0.5">Informasi penagihan perusahaan</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                       <Input 
                        {...register("company_name")}
                        label="Nama Bisnis" 
                        placeholder="PT. Nama Perusahaan"
                        variant="flat"
                        size="sm"
                        classNames={{
                          label: "font-medium text-slate-500 text-xs",
                          inputWrapper: "bg-white border-slate-100 border rounded-lg h-11",
                          input: "text-sm font-medium",
                        }}
                        isInvalid={!!errors.company_name}
                        errorMessage={errors.company_name?.message}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                       <Input 
                        {...register("company_address")}
                        label="Alamat" 
                        placeholder="Jalan, Gedung, Lantai..."
                        variant="flat"
                        size="sm"
                        startContent={<MapPin size={14} className="text-slate-400" />}
                        classNames={{
                          label: "font-medium text-slate-500 text-xs",
                          inputWrapper: "bg-white border-slate-100 border rounded-lg h-11",
                          input: "text-sm",
                        }}
                        isInvalid={!!errors.company_address}
                        errorMessage={errors.company_address?.message}
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 max-w-sm">
                      Pastikan data perusahaan sesuai dengan identitas resmi untuk invoice.
                    </p>
                    <Button 
                      type="submit"
                      color="primary"
                      size="sm"
                      className="font-medium text-xs px-4 h-10 rounded-lg"
                      startContent={!isPending && <Save size={14} />}
                      isLoading={isPending}
                    >
                      {isPending ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </div>
               </div>
            </div>

            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {serverError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 flex items-center gap-3"
                >
                  <AlertCircle size={16} />
                  <p className="text-xs">{serverError}</p>
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-3"
                >
                  <CheckCircle2 size={16} />
                  <p className="text-xs">Profil berhasil disimpan!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
