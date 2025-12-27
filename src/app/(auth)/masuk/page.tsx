"use client";

import { startTransition, useState } from "react";
import { Button, Card, CardBody, Input, Link, Divider } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "../actions";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginSchema = z.infer<typeof loginSchema>;

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

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsPending(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    startTransition(async () => {
      const result = await login(null, formData);
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
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <span>Access Portal</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tighter">
          Selamat Datang
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Masuk untuk akses kontrol dashboard Anda.
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/40 bg-white/40 backdrop-blur-2xl rounded-[32px] overflow-hidden">
          <CardBody className="p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <Input 
                {...register("email")}
                type="email" 
                label={<span className="font-bold text-xs uppercase tracking-widest text-slate-500">Alamat Email</span>}
                placeholder="nama@bisnis.com" 
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
              <div className="space-y-2">
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
                <div className="flex justify-end">
                  <Link href="#" size="sm" className="text-orange-600 font-bold text-xs uppercase tracking-widest hover:text-orange-700 transition-colors">
                    Lupa Password?
                  </Link>
                </div>
              </div>
              
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
                {isPending ? "Memproses..." : "Masuk Sekarang"}
              </Button>
            </form>

            <div className="relative my-10">
              <Divider className="bg-slate-200" />
            </div>

            <div className="text-center">
              <p className="text-slate-500 font-medium">
                Belum punya akun?{" "}
                <Link href="/daftar" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                  Daftar Gratis
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Trust indicators (mobile) */}
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
