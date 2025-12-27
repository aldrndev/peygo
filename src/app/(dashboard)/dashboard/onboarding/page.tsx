"use client";

import { useActionState, useState, startTransition } from "react";
import { useFormStatus } from "react-dom";
import { Button, Card, CardBody, Input, Progress } from "@heroui/react";
import { User, Phone, Building, ArrowRight } from "lucide-react";
import { completeOnboarding } from "@/app/(dashboard)/dashboard/profil/actions";
import { motion } from "framer-motion";
import LogoUpload from "@/components/ui/LogoUpload";
import { createClient } from "@/lib/supabase/client";

const initialState = {
  error: "",
};

function SubmitButton({ isUploading }: { isUploading: boolean }) {
  const { pending } = useFormStatus();
  const loading = pending || isUploading;
  
  return (
    <Button 
      type="submit" 
      color="primary" 
      size="lg"
      fullWidth
      className="font-medium"
      endContent={!loading && <ArrowRight size={18} />}
      isLoading={loading}
    >
      {loading ? "Menyimpan..." : "Lanjutkan ke Dashboard"}
    </Button>
  );
}

export default function OnboardingPage() {
  const [state, formAction] = useActionState(completeOnboarding, initialState);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsUploading(true);
    
    // Upload logo if provided
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <span className="text-2xl font-bold text-foreground">PeyGo</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Lengkapi Profil Anda</h1>
          <p className="text-sm text-default-500 mt-1">
            Informasi ini diperlukan untuk membuat invoice
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress 
            value={50} 
            color="primary" 
            size="sm"
            className="mb-2"
          />
          <p className="text-xs text-default-400 text-center">Langkah 1 dari 1</p>
        </div>

        {/* Form */}
        <Card className="shadow-lg border border-default-100">
          <CardBody className="p-6">
            <form action={handleSubmit} className="space-y-4">
              {/* Logo Upload */}
              <LogoUpload 
                onLogoChange={setLogoFile}
              />

              {/* Name */}
              <Input 
                name="name"
                label="Nama Lengkap"
                placeholder="Masukkan nama Anda"
                size="lg"
                startContent={<User size={18} className="text-default-400" />}
                isRequired
              />

              {/* Phone */}
              <Input 
                name="phone"
                type="tel"
                label="No. Telepon / WhatsApp"
                placeholder="08123456789"
                size="lg"
                startContent={<Phone size={18} className="text-default-400" />}
                isRequired
              />

              {/* Company (Optional) */}
              <Input 
                name="company_name"
                label="Nama Perusahaan (Opsional)"
                placeholder="PT Contoh Indonesia"
                size="lg"
                startContent={<Building size={18} className="text-default-400" />}
              />

              <Input 
                name="company_address"
                label="Alamat Bisnis (Opsional)"
                placeholder="Jl. Contoh No. 123, Jakarta"
                size="lg"
              />

              {/* Error */}
              {state?.error && (
                <div className="p-3 bg-danger-50 text-danger text-sm rounded-lg text-center">
                  {state.error}
                </div>
              )}

              {/* Submit */}
              <SubmitButton isUploading={isUploading} />
            </form>
          </CardBody>
        </Card>

        <p className="text-xs text-default-400 text-center mt-4">
          Data Anda aman dan hanya digunakan untuk keperluan invoice
        </p>
      </motion.div>
    </div>
  );
}
