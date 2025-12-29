"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signup } from "../actions";
import { Mail, Lock, User, ArrowRight, Sparkles, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/core/form-field";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type RegisterSchema = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
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
      } else if (result?.success) {
        // Small delay to ensure cookies are set before navigation
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push("/dashboard");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
          <Sparkles className="w-3 h-3" aria-hidden="true" />
          <span>Gratis Selamanya</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
          Bergabung Sekarang
        </h1>
        <p className="text-muted-foreground text-lg">
          Buat akun dan mulai kelola invoice Anda.
        </p>
      </div>

      {/* Form Card */}
      <Card className="border border-border bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg">
        <CardContent className="p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FormField
              {...register("name")}
              type="text"
              label="Nama Lengkap"
              placeholder="Nama Lengkap Anda"
              icon={<User className="w-5 h-5" />}
              error={errors.name?.message}
            />
            
            <FormField
              {...register("email")}
              type="email"
              label="Email Bisnis"
              placeholder="nama@perusahaan.com"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
            />
            
            <FormField
              {...register("password")}
              type="password"
              label="Kata Sandi"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              error={errors.password?.message}
            />
            
            {serverError && (
              <div 
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center flex items-center justify-center gap-2"
                role="alert"
              >
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                {serverError}
              </div>
            )}

            <Button 
              type="submit" 
              size="xl"
              className="w-full h-14 rounded-xl font-semibold text-base shadow-lg shadow-primary/20"
              isLoading={isPending}
            >
              {isPending ? "Memproses..." : (
                <>
                  Buat Akun Gratis
                  <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </>
              )}
            </Button>

            <p className="text-xs font-medium text-muted-foreground text-center leading-relaxed">
              Dengan mendaftar, Anda menyetujui<br/>
              <Link href="#" className="text-primary hover:text-primary/80">Syarat &amp; Ketentuan</Link> Kami.
            </p>
          </form>

          <div className="relative my-8">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Atau
            </span>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">
              Sudah punya akun?{" "}
              <Link 
                href="/masuk" 
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trust indicators (mobile only) */}
      <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:hidden">
        <span className="flex items-center gap-2">✓ Setup 2 Menit</span>
        <span className="flex items-center gap-2">✓ Mitra Berizin</span>
      </div>
    </div>
  );
}
