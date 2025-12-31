"use client";

import Link from "next/link";
import { Building2, Calendar, CreditCard, FileText } from "lucide-react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Supplier } from "@/types/database";

interface SupplierFormData {
  supplier_id: string;
  recipient_name: string;
  recipient_email: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_bank_name: string;
  recipient_bank_account_number: string;
  recipient_bank_account_name: string;
  due_date: string;
  description: string;
}

interface SupplierFormSectionProps {
  register: UseFormRegister<SupplierFormData>;
  errors: FieldErrors<SupplierFormData>;
  setValue: UseFormSetValue<SupplierFormData>;
  suppliers: Supplier[];
  selectedSupplierId: string;
  selectedSupplier: Supplier | undefined;
  onSupplierChange: (supplierId: string) => void;
}

export function SupplierFormSection({ 
  register, 
  errors, 
  suppliers,
  selectedSupplierId,
  selectedSupplier,
  onSupplierChange
}: SupplierFormSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Pilih Supplier</h3>
              <p className="text-sm text-muted-foreground">Pilih supplier dari daftar atau isi manual</p>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Supplier Tersimpan</Label>
              <Select 
                value={selectedSupplierId || ""} 
                onValueChange={onSupplierChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih supplier..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      Belum ada supplier tersimpan
                    </div>
                  ) : (
                    suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-muted-foreground" />
                          {supplier.name}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                <Link href="/dashboard/supplier" className="text-primary hover:underline">+ Tambah supplier baru</Link>
              </p>
            </div>

            {selectedSupplier && (
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <p className="font-semibold text-foreground mb-2">{selectedSupplier.name}</p>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {selectedSupplier.email && <p>📧 {selectedSupplier.email}</p>}
                  {selectedSupplier.phone && <p>📱 {selectedSupplier.phone}</p>}
                  {selectedSupplier.bank_name && (
                    <p>🏦 {selectedSupplier.bank_name} - {selectedSupplier.bank_account_number}</p>
                  )}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="due_date">Tanggal Pembayaran *</Label>
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
        </CardContent>
      </Card>

      {selectedSupplier && (
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Rekening Tujuan</h3>
                <p className="text-sm text-muted-foreground">Rekening dari supplier yang dipilih</p>
              </div>
            </div>
            
            {selectedSupplier.bank_name ? (
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bank</p>
                    <p className="font-medium text-foreground">{selectedSupplier.bank_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nomor Rekening</p>
                    <p className="font-mono font-semibold text-primary">{selectedSupplier.bank_account_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Atas Nama</p>
                    <p className="font-medium text-foreground">{selectedSupplier.bank_account_name}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 text-warning text-sm">
                ⚠️ Supplier ini belum memiliki data rekening. <Link href={`/dashboard/supplier`} className="underline">Lengkapi data supplier</Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Keterangan</h3>
              <p className="text-sm text-muted-foreground">Deskripsi pembayaran ini</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Pembayaran *</Label>
            <Textarea 
              {...register("description")}
              id="description"
              placeholder="Contoh: Pembayaran invoice vendor untuk proyek X"
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
