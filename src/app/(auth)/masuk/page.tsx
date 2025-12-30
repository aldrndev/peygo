"use client";

import { startTransition, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "../actions";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/core/form-field";

const loginSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  useEffect(() => {
    // Prefetch dashboard for faster transition
    router.prefetch("/dashboard");
  }, [router]);

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
        <div className="inline-flex items-center gap-2 bg-primary/20 text-foreground px-4 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-4 shadow-sm">
          <span>Selamat Datang Kembali</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
          Selamat Datang
        </h1>
        <p className="text-muted-foreground text-lg">
          Masuk ke dashboard untuk kelola bisnis Anda.
        </p>
      </div>

      {/* Form Card */}
      <Card className="border border-border bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg">
        <CardContent className="p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FormField
              {...register("email")}
              type="email"
              label="Alamat Email"
              placeholder="nama@bisnis.com"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
            />
            
            <div className="space-y-2">
              <FormField
                {...register("password")}
                type="password"
                label="Kata Sandi"
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                error={errors.password?.message}
              />
              <div className="flex justify-end">
                <Link 
                  href="#" 
                  className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                >
                  Lupa Password?
                </Link>
              </div>
            </div>
            
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
                  Masuk Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <Separator />
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">
              Belum punya akun?{" "}
              <Link 
                href="/daftar" 
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Daftar Gratis
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trust indicators (mobile) */}
      <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:hidden">
        <span className="flex items-center gap-2">✓ Setup 2 Menit</span>
        <span className="flex items-center gap-2">✓ Mitra Berizin</span>
      </div>
    </div>
  );
}
