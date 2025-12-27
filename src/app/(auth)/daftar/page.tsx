"use client";

import { startTransition, useState } from "react";
import { Button, Card, CardBody, Input, Link, Divider } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signup } from "../actions";
import { Mail, Lock, User, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type RegisterSchema = z.infer<typeof registerSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setIsPending(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    startTransition(async () => {
      const result = await signup(null, formData);
      if (result?.error) {
        setServerError(result.error);
        setIsPending(false);
      }
    });
  };

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        className="text-center lg:text-left"
        variants={itemVariants}
      >
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-3 h-3" />
          <span>Gratis Selamanya</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tighter">
          Bergabung Sekarang
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Langkah pertama menuju efisiensi bisnis Anda.
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/40 bg-white/40 backdrop-blur-2xl rounded-[32px] overflow-hidden">
          <CardBody className="p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <Input 
                {...register("name")}
                type="text" 
                label={<span className="font-bold text-xs uppercase tracking-widest text-slate-500">Nama Lengkap</span>}
                placeholder="Nama Lengkap Anda" 
                variant="flat"
                size="lg"
                labelPlacement="outside"
                startContent={<User className="text-slate-400 w-5 h-5" />}
                classNames={{
                   input: "font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-medium",
                   inputWrapper: "h-16 bg-white border border-slate-200 shadow-sm rounded-2xl group-data-[hover=true]:border-slate-300 group-data-[focus=true]:border-orange-500 group-data-[focus=true]:ring-4 group-data-[focus=true]:ring-orange-500/10 transition-all",
                   errorMessage: "font-bold text-xs uppercase tracking-wider",
                }}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
              <Input 
                {...register("email")}
                type="email" 
                label={<span className="font-bold text-xs uppercase tracking-widest text-slate-500">Email Bisnis</span>}
                placeholder="nama@perusahaan.com" 
                variant="flat"
                size="lg"
                labelPlacement="outside"
                startContent={<Mail className="text-slate-400 w-5 h-5" />}
                classNames={{
                   input: "font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-medium",
                   inputWrapper: "h-16 bg-white border border-slate-200 shadow-sm rounded-2xl group-data-[hover=true]:border-slate-300 group-data-[focus=true]:border-orange-500 group-data-[focus=true]:ring-4 group-data-[focus=true]:ring-orange-500/10 transition-all",
                   errorMessage: "font-bold text-xs uppercase tracking-wider",
                }}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
              />
              <Input 
                {...register("password")}
                type="password" 
                label={<span className="font-bold text-xs uppercase tracking-widest text-slate-500">Kata Sandi</span>}
                placeholder="••••••••" 
                variant="flat"
                size="lg"
                labelPlacement="outside"
                startContent={<Lock className="text-slate-400 w-5 h-5" />}
                classNames={{
                   input: "font-semibold text-slate-900 placeholder:text-slate-400",
                   inputWrapper: "h-16 bg-white border border-slate-200 shadow-sm rounded-2xl group-data-[hover=true]:border-slate-300 group-data-[focus=true]:border-orange-500 group-data-[focus=true]:ring-4 group-data-[focus=true]:ring-orange-500/10 transition-all",
                   errorMessage: "font-bold text-xs uppercase tracking-wider",
                }}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
              />
              
              {serverError && (
                <motion.div 
                  className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold text-center flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <AlertCircle className="w-4 h-4" />
                  {serverError}
                </motion.div>
              )}

              <Button 
                type="submit" 
                color="primary" 
                fullWidth 
                size="lg"
                className="bg-orange-500 text-white font-bold text-sm uppercase tracking-widest h-16 rounded-2xl shadow-xl shadow-orange-500/30 hover:scale-[1.02] transition-all"
                isLoading={isPending}
                endContent={!isPending && <ArrowRight className="w-5 h-5" />}
              >
                {isPending ? "Memproses..." : "Buat Akun Gratis"}
              </Button>

              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 text-center leading-relaxed">
                Dengan mendaftar, Anda menyetujui<br/>
                <Link href="#" className="text-orange-600 hover:text-orange-700 font-medium">Syarat & Ketentuan</Link> Kami.
              </p>
            </form>

            <div className="relative my-10">
              <Divider className="bg-slate-200" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                 Atau
              </span>
            </div>

            <div className="text-center">
              <p className="text-slate-500 font-medium">
                Sudah punya akun?{" "}
                <Link href="/masuk" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Trust indicators (mobile only) */}
      <motion.div 
        className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-400 lg:hidden"
        variants={itemVariants}
      >
        <span className="flex items-center gap-2">✓ Setup 2 Menit</span>
        <span className="flex items-center gap-2">✓ Mitra Berizin</span>
      </motion.div>
    </motion.div>
  );
}
