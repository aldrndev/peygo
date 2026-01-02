"use client";

import { User, Mail, Phone, Calendar, MapPin, FileText } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface RecipientFormData {
  recipient_name: string;
  recipient_email: string;
  recipient_phone: string;
  recipient_address?: string;
  due_date: string;
  description: string;
}

interface RecipientFormSectionProps {
  register: UseFormRegister<RecipientFormData>;
  errors: FieldErrors<RecipientFormData>;
}

export function RecipientFormSection({ register, errors }: RecipientFormSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Informasi Penerima</h3>
              <p className="text-sm text-muted-foreground">Data pelanggan yang akan menerima tagihan</p>
            </div>
          </div>
          
          <div className="grid gap-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="recipient_name">Nama Penerima *</Label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    {...register("recipient_name")}
                    id="recipient_name"
                    placeholder="Nama lengkap atau perusahaan"
                    className={cn("pl-10", errors.recipient_name && "border-destructive")}
                  />
                </div>
                {errors.recipient_name && <p className="text-xs text-destructive">{errors.recipient_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipient_email">Email *</Label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    {...register("recipient_email")}
                    id="recipient_email"
                    type="email"
                    placeholder="email@perusahaan.com"
                    className={cn("pl-10", errors.recipient_email && "border-destructive")}
                  />
                </div>
                {errors.recipient_email && <p className="text-xs text-destructive">{errors.recipient_email.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="recipient_phone">No. WhatsApp *</Label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    {...register("recipient_phone")}
                    id="recipient_phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="08123456789"
                    className={cn("pl-10", errors.recipient_phone && "border-destructive")}
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                {errors.recipient_phone && <p className="text-xs text-destructive">{errors.recipient_phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Jatuh Tempo *</Label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    {...register("due_date")}
                    id="due_date"
                    type="date" 
                    min={new Date().toISOString().split("T")[0]}
                    className={cn("pl-10", errors.due_date && "border-destructive")}
                  />
                </div>
                {errors.due_date && <p className="text-xs text-destructive">{errors.due_date.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient_address">Alamat</Label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-muted-foreground" />
                <Textarea 
                  {...register("recipient_address")}
                  id="recipient_address"
                  placeholder="Alamat lengkap penerima (opsional)"
                  rows={2}
                  className="pl-10 resize-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Detail Tagihan</h3>
              <p className="text-sm text-muted-foreground">Deskripsi umum tentang tagihan ini</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Tagihan *</Label>
            <Textarea 
              {...register("description")}
              id="description"
              placeholder="Contoh: Pembayaran jasa desain website dan maintenance bulanan"
              rows={3}
              className={cn("resize-none", errors.description && "border-destructive")}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
