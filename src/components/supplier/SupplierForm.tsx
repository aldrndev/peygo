"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateSupplier, useUpdateSupplier } from "@/hooks/mutations/use-supplier-mutations";
import { supplierSchema } from "@/app/(dashboard)/dashboard/supplier/schema";
import { Supplier } from "@/types/database";
import { User, Mail, Phone, MapPin, Building2, CreditCard, Landmark, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BankCombobox } from "@/components/ui/BankCombobox";

interface SupplierFormProps {
  isOpen: boolean;
  onOpenChange: () => void;
  supplier?: Supplier | null;
}

type SupplierSchema = z.infer<typeof supplierSchema>;

export default function SupplierForm({ isOpen, onOpenChange, supplier }: SupplierFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  // Use React Query mutations with auto cache invalidation
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SupplierSchema>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: supplier?.name || "",
      email: supplier?.email || "",
      phone: supplier?.phone || "",
      address: supplier?.address || "",
      bank_name: supplier?.bank_name || "",
      bank_account_number: supplier?.bank_account_number || "",
      bank_account_name: supplier?.bank_account_name || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: supplier?.name || "",
        email: supplier?.email || "",
        phone: supplier?.phone || "",
        address: supplier?.address || "",
        bank_name: supplier?.bank_name || "",
        bank_account_number: supplier?.bank_account_number || "",
        bank_account_name: supplier?.bank_account_name || "",
      });
      const timer = setTimeout(() => setServerError(null), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, supplier, reset]);

  const onSubmit = async (data: SupplierSchema) => {
    setServerError(null);

    if (supplier) {
      // Update existing supplier
      updateMutation.mutate(
        { id: supplier.id, data },
        {
          onSuccess: (result) => {
            if (result.success) {
              onOpenChange();
            } else {
              setServerError(result.error || "Gagal mengupdate supplier");
            }
          },
        }
      );
    } else {
      // Create new supplier
      createMutation.mutate(data, {
        onSuccess: (result) => {
          if (result.success) {
            onOpenChange();
          } else {
            setServerError(result.error || "Gagal menyimpan supplier");
          }
        },
      });
    }
  };

  const title = supplier ? "Edit Supplier" : "Supplier Baru";
  const labelSuffix = supplier ? "Perbarui informasi detail rekan bisnis Anda" : "Tambahkan rekan bisnis baru ke dalam daftar";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full h-full max-h-full md:max-w-2xl md:max-h-[90vh] md:h-auto overflow-y-auto p-4 md:p-6 gap-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{labelSuffix}</DialogDescription>
        </DialogHeader>

        <form id="supplier-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Contact Group */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <User size={16} />
              </div>
              <h4 className="text-sm font-medium text-muted-foreground">Informasi Kontak</h4>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nama Supplier *</Label>
              <div className="relative">
                <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  {...register("name")}
                  id="name"
                  autoFocus
                  placeholder="PT. Maju Bersama"
                  className={cn("pl-10", errors.name && "border-destructive")}
                />
              </div>
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Alamat Email *</Label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="hi@supplier.com"
                    className={cn("pl-10", errors.email && "border-destructive")}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...register("phone")}
                    id="phone"
                    type="tel"
                    placeholder="0812..."
                    className={cn("pl-10", errors.phone && "border-destructive")}
                  />
                </div>
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  {...register("address")}
                  id="address"
                  placeholder="Jl. Raya Utama No. 12..."
                  className={cn("pl-10", errors.address && "border-destructive")}
                />
              </div>
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
            </div>
          </div>

          {/* Bank Group */}
          <div className="pt-6 border-t border-border space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center text-background">
                <Landmark size={16} />
              </div>
              <h4 className="text-sm font-medium text-muted-foreground">Informasi Bank</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_name">Lembaga Perbankan *</Label>
              <BankCombobox
                value={watch("bank_name") || ""}
                onValueChange={(value) => setValue("bank_name", value, { shouldValidate: true })}
                placeholder="Pilih Bank..."
              />
              {errors.bank_name && <p className="text-xs text-destructive">{errors.bank_name.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank_account_number">Nomor Rekening *</Label>
                <div className="relative">
                  <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...register("bank_account_number")}
                    id="bank_account_number"
                    placeholder="1234567890"
                    className={cn("pl-10", errors.bank_account_number && "border-destructive")}
                  />
                </div>
                {errors.bank_account_number && <p className="text-xs text-destructive">{errors.bank_account_number.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank_account_name">Nama Pemilik Rekening *</Label>
                <Input
                  {...register("bank_account_name")}
                  id="bank_account_name"
                  placeholder="Joko Susilo"
                  className={cn(errors.bank_account_name && "border-destructive")}
                />
                {errors.bank_account_name && <p className="text-xs text-destructive">{errors.bank_account_name.message}</p>}
              </div>
            </div>
          </div>
          
          {serverError && (
            <div 
              role="alert"
              className="p-4 bg-destructive/10 text-destructive text-xs rounded-lg border border-destructive/20 flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-destructive text-destructive-foreground flex items-center justify-center shrink-0">
                <AlertCircle size={16} aria-hidden="true" />
              </div>
              {serverError}
            </div>
          )}
        </form>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onOpenChange}>Batal</Button>
          <Button 
            isLoading={isPending}
            onClick={() => handleSubmit(onSubmit)()}
          >
            {!isPending && <Save size={14} className="mr-2" />}
            {supplier ? "Simpan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
