"use client";

import { useActionState, useState, startTransition, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { User, Phone, Building, ArrowRight } from "lucide-react";
import { completeOnboarding } from "@/app/(dashboard)/dashboard/profil/actions";
import LogoUpload from "@/components/ui/LogoUpload";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const initialState = {
  error: "",
  success: false,
};

function SubmitButton({ isUploading }: { isUploading: boolean }) {
  const { pending } = useFormStatus();
  const loading = pending || isUploading;
  
  return (
    <Button type="submit" size="lg" className="w-full" isLoading={loading}>
      {loading ? "Menyimpan..." : "Lanjutkan ke Dashboard"}
      {!loading && <ArrowRight size={18} className="ml-2" />}
    </Button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(completeOnboarding, initialState);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Client-side redirect after successful onboarding
  useEffect(() => {
    if (state?.success) {
      // Small delay for cookie propagation
      const timer = setTimeout(() => {
        router.push("/dashboard/penjualan");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  const handleSubmit = async (formData: FormData) => {
    setIsUploading(true);
    
    if (logoFile) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
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
        }
      }
    }
    
    setIsUploading(false);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl">
              P
            </div>
            <span className="text-2xl font-bold text-foreground">PeyGo</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Lengkapi Profil Anda</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Informasi ini diperlukan untuk membuat invoice
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={50} className="mb-2" />
          <p className="text-xs text-muted-foreground text-center">Langkah 1 dari 1</p>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-6">
            <form action={handleSubmit} className="space-y-4">
              {/* Logo Upload */}
              <LogoUpload onLogoChange={setLogoFile} />

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    id="name"
                    name="name"
                    placeholder="Masukkan nama Anda"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">No. Telepon / WhatsApp *</Label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="08123456789"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Company (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="company_name">Nama Perusahaan (Opsional)</Label>
                <div className="relative">
                  <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    id="company_name"
                    name="company_name"
                    placeholder="PT Contoh Indonesia"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_address">Alamat Bisnis (Opsional)</Label>
                <Input 
                  id="company_address"
                  name="company_address"
                  placeholder="Jl. Contoh No. 123, Jakarta"
                />
              </div>

              {/* Error */}
              {state?.error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg text-center">
                  {state.error}
                </div>
              )}

              {/* Submit */}
              <SubmitButton isUploading={isUploading} />
            </form>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Data Anda aman dan hanya digunakan untuk keperluan invoice
        </p>
      </div>
    </div>
  );
}
