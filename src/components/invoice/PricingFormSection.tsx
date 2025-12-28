"use client";

import { Calculator } from "lucide-react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PricingFormData {
  discount_type: string;
  discount_value: number;
  tax_enabled: boolean;
  tax_rate: number;
}

interface PricingFormSectionProps {
  register: UseFormRegister<PricingFormData>;
  setValue: UseFormSetValue<PricingFormData>;
  discountType: string;
  taxEnabled: boolean;
}

export function PricingFormSection({ 
  register, 
  setValue, 
  discountType, 
  taxEnabled 
}: PricingFormSectionProps) {
  return (
    <Card>
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground">
            <Calculator size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Pengaturan Harga</h3>
            <p className="text-sm text-muted-foreground">Diskon dan pajak (opsional)</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Diskon Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Diskon</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select 
                value={discountType || "none"} 
                onValueChange={(val) => { 
                  setValue("discount_type", val === "none" ? "" : val); 
                  if (val === "none") setValue("discount_value", 0); 
                }}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada</SelectItem>
                  <SelectItem value="fixed">Nominal (Rp)</SelectItem>
                  <SelectItem value="percentage">Persen (%)</SelectItem>
                </SelectContent>
              </Select>
              {discountType && discountType !== "none" && (
                <div className="relative flex-1">
                  {discountType === "fixed" && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                  )}
                  <Input 
                    {...register("discount_value")}
                    type="number"
                    min="0"
                    placeholder="Masukkan nilai"
                    className={discountType === "fixed" ? "pl-10" : "pr-10"}
                  />
                  {discountType === "percentage" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* PPN Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">PPN (Pajak)</Label>
                <p className="text-xs text-muted-foreground">Aktifkan untuk menambahkan pajak</p>
              </div>
              <Switch 
                checked={taxEnabled} 
                onCheckedChange={(val) => setValue("tax_enabled", val)} 
              />
            </div>
            {taxEnabled && (
              <div className="relative w-full sm:w-32">
                <Input 
                  {...register("tax_rate")}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="11"
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
