"use client";

import { startTransition, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updatePassword } from "../actions";
import { Lock, ArrowLeft, AlertCircle, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/core/form-field";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi password wajib diisi"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Compute isExpired from searchParams (no effect needed)
  const isExpired = useMemo(() => {
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    return !!(error || errorDescription?.includes("expired"));
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    setIsPending(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("password", data.password);

    startTransition(async () => {
      const result = await updatePassword(null, formData);
      if (result?.error) {
        setServerError(result.error);
        setIsPending(false);
      } else if (result?.success) {
        // Redirect to dashboard after password update
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push("/dashboard");
      }
    });
  };

  // Show expired link message
  if (isExpired) {
    return (
      <div className="space-y-8">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
            Link Kadaluarsa
          </h1>
          <p className="text-muted-foreground text-lg">
            Link reset password sudah tidak valid atau kadaluarsa.
          </p>
        </div>

        <Card className="border border-border bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg">
          <CardContent className="p-8 md:p-10 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-muted-foreground mb-6">
              Silakan request link baru untuk reset password.
            </p>
            <Link href="/lupa-password">
              <Button className="w-full">
                Request Link Baru
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <Link
          href="/masuk"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Kembali ke Login</span>
        </Link>
        <div className="inline-flex items-center gap-2 bg-primary/20 text-foreground px-4 py-2 rounded-2xl text-xs font-medium uppercase tracking-wide mb-4 ml-4">
          <ShieldCheck className="w-3 h-3" />
          <span>Aman & Terenkripsi</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
          Buat Password Baru
        </h1>
        <p className="text-muted-foreground text-lg">
          Masukkan password baru untuk akun Anda.
        </p>
      </div>

      {/* Form Card */}
      <Card className="border border-border bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg">
        <CardContent className="p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FormField
              {...register("password")}
              type="password"
              label="Password Baru"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              error={errors.password?.message}
            />
            
            <FormField
              {...register("confirmPassword")}
              type="password"
              label="Konfirmasi Password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              error={errors.confirmPassword?.message}
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
              {isPending ? "Memproses..." : "Simpan Password Baru"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
