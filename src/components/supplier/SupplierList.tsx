"use client";

import { useState, useMemo } from "react";
import { Supplier } from "@/types/database";
import { useForm, useWatch } from "react-hook-form";
import { Edit2, Trash2, Plus, Search, Phone, Mail } from "lucide-react";
import SupplierForm from "./SupplierForm";
import { deleteSupplier } from "@/app/(dashboard)/dashboard/supplier/actions";
import EmptyState from "@/components/ui/EmptyState";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SupplierList({ suppliers }: { suppliers: Supplier[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  const { register, control } = useForm({
    defaultValues: {
      search: "",
    }
  });

  const search = useWatch({ control, name: "search", defaultValue: "" });

  const handleCreate = () => {
    setSelectedSupplier(null);
    setIsOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus supplier ${name}?`)) {
      await deleteSupplier(id);
    }
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.bank_name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [suppliers, search]);

  return (
    <>
      <div className="space-y-6 md:space-y-8 pb-20">
        {/* Header - Desktop */}
        <div className="hidden md:flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Supplier</h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola rekan bisnis dan informasi pembayaran</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground">
              {suppliers.length}/5 slot
            </div>
            <Button 
              size="sm"
              onClick={handleCreate}
              disabled={suppliers.length >= 5}
            >
              <Plus size={16} className="mr-2" />
              Tambah
            </Button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Supplier</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{suppliers.length}/5 slot terpakai</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            {...register("search")}
            placeholder="Cari supplier..."
            className="pl-10"
          />
        </div>

        {/* Supplier List */}
        {filteredSuppliers.length === 0 ? (
          <div className="py-12">
            <EmptyState
              variant="supplier"
              title={search ? "Tidak ditemukan" : "Belum ada supplier"}
              description={search ? "Coba kata kunci lain atau periksa ejaan Anda" : "Data supplier diperlukan untuk membuat permintaan pembayaran"}
              action={!search && suppliers.length < 5 ? { label: "Tambah Supplier", onClick: handleCreate } : undefined}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.map((supplier) => (
              <SupplierCard 
                key={supplier.id}
                supplier={supplier} 
                onEdit={() => handleEdit(supplier)}
                onDelete={() => handleDelete(supplier.id, supplier.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      {suppliers.length < 5 && (
        <div className="md:hidden">
          <FloatingActionButton 
            onPrimaryPress={handleCreate}
            primaryLabel="Tambah" 
          />
        </div>
      )}

      {/* Unified Form */}
      <SupplierForm 
        isOpen={isOpen} 
        onOpenChange={() => setIsOpen(false)} 
        supplier={selectedSupplier} 
      />
    </>
  );
}

function SupplierCard({ 
  supplier, 
  onEdit, 
  onDelete 
}: { 
  supplier: Supplier; 
  onEdit: () => void;
  onDelete: () => void;
}) {
  const initials = supplier.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  
  return (
    <div className="bg-card border border-border rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-start gap-3 flex-1 mb-4">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-foreground text-background font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate text-sm mb-1">{supplier.name}</h3>
          <span className="text-xs text-muted-foreground">{supplier.bank_name}</span>
        </div>
      </div>

      {/* Bank Account Section */}
      <div className="bg-muted rounded-lg p-3 mb-3">
        <p className="text-xs text-muted-foreground mb-1">Rekening</p>
        <p className="font-semibold text-foreground text-sm">{supplier.bank_account_number}</p>
        <p className="text-xs text-primary">A/N: {supplier.bank_account_name}</p>
      </div>
      
      {/* Contact Section */}
      <div className="space-y-2 mb-4 text-xs text-muted-foreground">
        {supplier.email && (
          <div className="flex items-center gap-2">
            <Mail size={12} />
            <span className="truncate">{supplier.email}</span>
          </div>
        )}
        {supplier.phone && (
          <div className="flex items-center gap-2">
            <Phone size={12} />
            <span>{supplier.phone}</span>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border">
        <Button
          size="sm"
          className="flex-1"
          onClick={onEdit}
        >
          <Edit2 size={14} className="mr-2" />
          Edit
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
