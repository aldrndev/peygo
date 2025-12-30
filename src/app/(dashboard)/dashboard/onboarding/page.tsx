"use client";

import { useState, useEffect } from "react";
import { Phone, Building, ArrowRight, AlertCircle, CreditCard, User, ArrowLeft, CheckCircle2 } from "lucide-react";
import { completeOnboarding, updateProfile } from "@/app/(dashboard)/dashboard/profil/actions";
import LogoUpload from "@/components/ui/LogoUpload";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { BankCombobox } from "@/components/ui/BankCombobox";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ 
    name: string; 
    phone: string | null;
    company_name?: string | null;
    company_address?: string | null;
    bank_name?: string | null;
    bank_account_number?: string | null;
    bank_account_name?: string | null;
    logo_url?: string | null;
  } | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>("");

  // Fetch existing profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(data);
          if (data.bank_name) setSelectedBank(data.bank_name);
        }
      }
    };
    
    fetchProfile();
  }, []);

  const handleNextStep = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Handle logo upload if exists in Step 1
    if (logoFile && step === 1) {
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

    if (step === 1) {
      // Save progress but don't complete onboarding
      const result = await updateProfile(null, formData, false);
      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else {
        // Update local profile state
        setProfile(prev => ({
          ...prev!,
          phone: formData.get("phone") as string,
          company_name: formData.get("company_name") as string,
          company_address: formData.get("company_address") as string,
          logo_url: formData.get("logo_url") as string || prev?.logo_url,
        }));
        setStep(2);
        setIsSubmitting(false);
      }
    } else {
      // Step 2: Final submission
      // Add selected bank to formData
      formData.set("bank_name", selectedBank);
      
      // Call server action to complete onboarding
      const result = await completeOnboarding(null, formData);
      
      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else if (result?.success) {
        // Hard navigation to dashboard
        window.location.href = "/dashboard";
      } else {
        setIsSubmitting(false);
      }
    }
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
          <h1 className="text-xl font-bold text-foreground">
            {step === 1 ? "Lengkapi Profil Anda" : "Informasi Rekening"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 1 
              ? "Informasi ini akan muncul di invoice Anda" 
              : "Digunakan untuk menerima pembayaran dari pelanggan"
            }
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={step === 1 ? 50 : 100} className="mb-2" />
          <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 px-1">
            <span className={step === 1 ? "text-primary" : ""}>Profil Bisnis</span>
            <span className={step === 2 ? "text-primary" : ""}>Informasi Bank</span>
          </div>
        </div>

        {/* Form */}
        <Card className="border-border/50 shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleNextStep} className="space-y-4">
              {step === 1 ? (
                <>
                  {/* Logo Upload */}
                  <LogoUpload onLogoChange={setLogoFile} currentLogoUrl={profile?.logo_url || undefined} />

                  {/* Hidden field for name */}
                  <input type="hidden" name="name" value={profile?.name || ""} />

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">No. Telepon / WhatsApp *</Label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                      <Input 
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="08123456789"
                        className="pl-10"
                        defaultValue={profile?.phone || ""}
                        key={`phone-${profile?.phone}`}
                        required
                      />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Nama Bisnis / Toko (Opsional)</Label>
                    <div className="relative">
                      <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                      <Input 
                        id="company_name"
                        name="company_name"
                        placeholder="Contoh: Toko Berkah"
                        className="pl-10"
                        defaultValue={profile?.company_name || ""}
                      />
                    </div>
                  </div>

                  {/* Business Address */}
                  <div className="space-y-2">
                    <Label htmlFor="company_address">Alamat Bisnis (Opsional)</Label>
                    <Input 
                      id="company_address"
                      name="company_address"
                      placeholder="Contoh: Jl. Merdeka No. 45, Jakarta"
                      defaultValue={profile?.company_address || ""}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Step 2: Bank Info */}
                  {/* Hidden fields from Step 1 required by schema */}
                  <input type="hidden" name="name" value={profile?.name || ""} />
                  <input type="hidden" name="phone" value={profile?.phone || ""} />
                  <input type="hidden" name="company_name" value={profile?.company_name || ""} />
                  <input type="hidden" name="company_address" value={profile?.company_address || ""} />
                  <input type="hidden" name="logo_url" value={profile?.logo_url || ""} />

                  {/* Bank Name */}
                  <div className="space-y-2">
                    <Label htmlFor="bank_name">Nama Bank *</Label>
                    <BankCombobox 
                      value={selectedBank} 
                      onValueChange={setSelectedBank}
                      placeholder="Pilih atau cari bank..."
                    />
                  </div>

                  {/* Account Number */}
                  <div className="space-y-2">
                    <Label htmlFor="bank_account_number">Nomor Rekening *</Label>
                    <div className="relative">
                      <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                      <Input 
                        id="bank_account_number"
                        name="bank_account_number"
                        placeholder="Contoh: 1234567890"
                        className="pl-10"
                        defaultValue={profile?.bank_account_number || ""}
                        required
                      />
                    </div>
                  </div>

                  {/* Account Name */}
                  <div className="space-y-2">
                    <Label htmlFor="bank_account_name">Nama Pemilik Rekening *</Label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                      <Input 
                        id="bank_account_name"
                        name="bank_account_name"
                        placeholder="Sesuai nama di buku tabungan"
                        className="pl-10"
                        defaultValue={profile?.bank_account_name || ""}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Error */}
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                {step === 2 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft size={18} className="mr-2" />
                    Kembali
                  </Button>
                )}
                <Button type="submit" className="flex-[2]" isLoading={isSubmitting}>
                  {step === 1 ? "Selanjutnya" : "Selesaikan"}
                  {!isSubmitting && (
                    step === 1 
                      ? <ArrowRight size={18} className="ml-2" /> 
                      : <CheckCircle2 size={18} className="ml-2" />
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-[10px] text-muted-foreground text-center mt-6 uppercase tracking-widest font-medium opacity-50">
          Langkah {step} dari 2 • PeyGo Secure Onboarding
        </p>
      </div>
    </div>
  );
}
