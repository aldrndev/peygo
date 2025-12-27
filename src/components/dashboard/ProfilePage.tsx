"use client";

import { useState, startTransition } from "react";
import { Button, Input, Chip } from "@heroui/react";
import { User, Mail, Phone, Building, Save, CheckCircle2, AlertCircle, MapPin, BadgeCheck, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProfile, profileSchema } from "@/app/(dashboard)/dashboard/profil/actions";
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center relative">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 flex items-center justify-center text-orange-500">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-none">Profil & Bisnis</h1>
            <p className="text-slate-500 text-lg font-medium mt-2">Kelola identitas dan informasi operasional Anda</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Chip 
            variant="flat" 
            color="success" 
            startContent={<ShieldCheck size={16} />}
            className="font-bold border-none bg-green-500/10 text-green-600 px-6 h-10 uppercase tracking-widest text-xs"
          >
            AKUN TERVERIFIKASI
          </Chip>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Personal Info & Logo */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] overflow-hidden relative group">
                {/* Decorative glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="bg-white/40 p-8 border-b border-white/60 flex flex-col items-center text-center relative z-10">
                  <LogoUpload 
                    currentLogoUrl={profile?.logo_url}
                    onLogoChange={setLogoFile}
                  />
                  <h3 className="mt-6 font-bold text-slate-900 text-xl tracking-tighter leading-none">{profile?.name || "Member Peygo"}</h3>
                  <div className="mt-2 px-3 py-1 bg-slate-900/5 rounded-full">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
                  </div>
                </div>

                <div className="p-8 space-y-8 relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Informasi Dasar</span>
                   </div>

                   <div className="space-y-6">
                     <Input 
                        {...register("name")}
                        label="Nama Lengkap" 
                        placeholder="Nama asli sesuai identitas"
                        variant="flat"
                        classNames={{
                          label: "font-bold text-slate-400 uppercase text-xs tracking-widest",
                          inputWrapper: "bg-white/40 backdrop-blur-xl border-white/60 border hover:bg-white focus-within:bg-white h-14 rounded-2xl transition-all shadow-none",
                          errorMessage: "font-bold text-xs uppercase tracking-wider",
                        }}
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message}
                      />
                      <Input 
                        {...register("phone")}
                        label="Nomor Telepon" 
                        type="tel"
                        placeholder="0812..."
                        variant="flat"
                        classNames={{
                          label: "font-bold text-slate-400 uppercase text-xs tracking-widest",
                          inputWrapper: "bg-white/40 backdrop-blur-xl border-white/60 border hover:bg-white focus-within:bg-white h-14 rounded-2xl transition-all shadow-none",
                          errorMessage: "font-bold text-xs uppercase tracking-wider",
                        }}
                        isInvalid={!!errors.phone}
                        errorMessage={errors.phone?.message}
                        startContent={<Phone size={18} className="text-slate-400" />}
                      />
                   </div>
                </div>
            </div>

            <div className="p-8 bg-slate-900 text-white rounded-[40px] relative overflow-hidden group">
               {/* Aurora element */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
               
               <div className="flex items-start gap-5 relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                    <Mail size={24} />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Email Utama</p>
                    <p className="text-lg font-bold tracking-tight">{user.email}</p>
                    <div className="mt-4 flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                      <ShieldCheck size={14} className="text-orange-500 shadow-sm shadow-orange-500/20" />
                      <p className="text-xs text-slate-300 font-bold uppercase tracking-widest leading-none">Login & Keamanan Aktif</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column: Business Identity */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[48px] overflow-hidden relative group">
               <div className="p-8 md:p-12 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                        <Building size={32} />
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl md:text-3xl text-slate-900 tracking-tighter leading-none">Identitas Bisnis</h3>
                        <p className="text-slate-500 font-medium mt-2">Informasi penagihan resmi perusahaan Anda</p>
                      </div>
                    </div>
                    <BadgeCheck size={40} className="text-orange-500 opacity-20 hidden md:block" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="md:col-span-2">
                       <Input 
                        {...register("company_name")}
                        label="Nama Bisnis / Perusahaan" 
                        placeholder="PT. Nama Perusahaan Anda"
                        variant="flat"
                        classNames={{
                          label: "font-bold text-slate-400 uppercase text-xs tracking-widest mb-3",
                          inputWrapper: "bg-white/40 backdrop-blur-xl border-white/60 border hover:bg-white focus-within:bg-white h-16 rounded-2xl px-6 transition-all shadow-none",
                          input: "text-lg font-bold tracking-tight",
                          errorMessage: "font-bold text-xs uppercase tracking-wider",
                        }}
                        isInvalid={!!errors.company_name}
                        errorMessage={errors.company_name?.message}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                       <Input 
                        {...register("company_address")}
                        label="Alamat Perusahaan" 
                        placeholder="Jalan, No. Gedung, Lantai..."
                        variant="flat"
                        startContent={<MapPin size={22} className="text-slate-400" />}
                        classNames={{
                          label: "font-bold text-slate-400 uppercase text-xs tracking-widest mb-3",
                          inputWrapper: "bg-white/40 backdrop-blur-xl border-white/60 border hover:bg-white focus-within:bg-white h-16 rounded-2xl px-6 transition-all shadow-none",
                          input: "font-medium",
                          errorMessage: "font-bold text-xs uppercase tracking-wider",
                        }}
                        isInvalid={!!errors.company_address}
                        errorMessage={errors.company_address?.message}
                      />
                    </div>
                  </div>

                  <div className="mt-14 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-sm">
                       <AlertCircle size={18} className="text-slate-400 shrink-0" />
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-relaxed">
                         Pastikan data perusahaan sesuai dengan identitas resmi untuk keperluan legalitas invoice.
                       </p>
                    </div>
                    <Button 
                      type="submit"
                      color="primary"
                      className="font-bold px-12 h-16 rounded-2xl uppercase tracking-[0.2em] text-xs outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                      startContent={!isPending && <Save size={20} />}
                      isLoading={isPending}
                    >
                      {isPending ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
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
                  className="p-6 bg-rose-50 text-rose-600 rounded-[24px] border border-rose-100 shadow-xl shadow-rose-500/5 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <p className="font-bold text-xs uppercase tracking-widest">{serverError}</p>
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 bg-green-50 text-green-700 rounded-[24px] border border-green-100 shadow-xl shadow-green-500/5 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="font-bold text-xs uppercase tracking-widest">PERUBAHAN PROFIL BERHASIL DISIMPAN!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
