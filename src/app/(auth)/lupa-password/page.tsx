"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPassword } from "../actions";
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/core/form-field";

const forgotPasswordSchema = z.object({
  email: z.email("Format email tidak valid"),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsPending(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("email", data.email);

    startTransition(async () => {
      const result = await forgotPassword(null, formData);
      if (result?.error) {
        setServerError(result.error);
        setIsPending(false);
      } else if (result?.emailSent) {
        setEmailSent(true);
        setIsPending(false);
      }
    });
  };

  // Show email sent success message
  if (emailSent) {
    return (
      <div className="space-y-8">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
            <Mail className="w-3 h-3" aria-hidden="true" />
            <span>Cek Email Anda</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
            Email Terkirim
          </h1>
          <p className="text-muted-foreground text-lg">
            Jika email terdaftar, Anda akan menerima link untuk reset password. Silakan cek inbox.
          </p>
        </div>

        <Card className="border border-border bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg">
          <CardContent className="p-8 md:p-10 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <p className="text-muted-foreground mb-6">
              Tidak menerima email? Cek folder spam atau pastikan email yang dimasukkan benar.
            </p>
            <Link href="/masuk">
              <Button variant="outline" className="w-full">
                Kembali ke Login
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
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
          Lupa Password
        </h1>
        <p className="text-muted-foreground text-lg">
          Masukkan email Anda untuk menerima link reset password.
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
              {isPending ? "Memproses..." : "Kirim Link Reset"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
