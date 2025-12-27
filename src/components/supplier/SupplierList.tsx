"use client";

import { useState, useMemo } from "react";
import { Supplier } from "@/types/database";
import { useForm, useWatch } from "react-hook-form";
import { 
  Button,
  Input,
  Avatar,
  useDisclosure
} from "@heroui/react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Plus, Search, Phone, Mail, Building2, User } from "lucide-react";
import SupplierForm from "./SupplierForm";
import { deleteSupplier } from "@/app/(dashboard)/dashboard/supplier/actions";
import EmptyState from "@/components/ui/EmptyState";
import FloatingActionButton from "@/components/ui/FloatingActionButton";

export default function SupplierList({ suppliers }: { suppliers: Supplier[] }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  const { register, control } = useForm({
    defaultValues: {
      search: "",
    }
  });

  // Watch values using useWatch for React Compiler compatibility
  const search = useWatch({ control, name: "search", defaultValue: "" });

  const handleCreate = () => {
    setSelectedSupplier(null);
    onOpen();
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    onOpen();
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
      <div className="space-y-10 pb-20">
        {/* Header - Desktop & Tablet */}
        <div className="hidden md:flex justify-between items-center relative">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 flex items-center justify-center text-orange-500">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tighter leading-none">Supplier</h1>
              <p className="text-slate-500 text-lg font-medium mt-2">Kelola rekan bisnis dan informasi pembayaran</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 px-5 py-2.5 rounded-2xl shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Kapasitas Supplier</p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${suppliers.length >= 5 ? 'bg-orange-500' : 'bg-slate-900'}`}
                    style={{ width: `${(suppliers.length / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-900">{suppliers.length}/5</span>
              </div>
            </div>
            <Button 
              color="primary" 
              className="font-bold px-8 h-12 rounded-2xl uppercase tracking-widest text-xs outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              startContent={<Plus size={20} />}
              onPress={handleCreate}
              isDisabled={suppliers.length >= 5}
            >
              TAMBAH SUPPLIER
            </Button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tighter">Supplier</h1>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-[0.2em] mt-1">{suppliers.length}/5 SLOT TERPAKAI</p>
          </div>
          <Button 
            isIconOnly 
            color="primary" 
            className="rounded-2xl h-12 w-12 outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            onPress={handleCreate}
            isDisabled={suppliers.length >= 5}
          >
            <Plus size={24} />
          </Button>
        </div>

        {/* Search Bar & Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
             <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Cari Supplier</h2>
             <div className="h-px flex-1 bg-slate-200/50" />
          </div>
          
          <Input
            {...register("search")}
            placeholder="Ketik nama supplier atau nama bank..."
            startContent={<Search size={22} className="text-slate-400" />}
            className="w-full"
            classNames={{
              inputWrapper: "bg-white/40 backdrop-blur-xl border-white/60 border hover:bg-white focus-within:bg-white transition-all rounded-2xl h-14 px-4",
              input: "font-medium text-slate-900 placeholder:text-slate-400 text-lg",
            }}
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
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredSuppliers.map((supplier, index) => (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <SupplierCard 
                  supplier={supplier} 
                  onEdit={() => handleEdit(supplier)}
                  onDelete={() => handleDelete(supplier.id, supplier.name)}
                />
              </motion.div>
            ))}
          </motion.div>
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

      {/* Unified Form (Drawer/Modal handled inside) */}
      <SupplierForm 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
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
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 transition-all group relative overflow-hidden h-full flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
      {/* Decorative background element */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl" />
      
      <div className="flex items-start gap-5 flex-1 mb-8 relative z-10">
        <div className="relative">
          <Avatar 
            name={supplier.name} 
            size="lg"
            className="w-16 h-16 text-2xl font-bold bg-slate-900 text-white rounded-2xl"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">
             <User size={12} className="text-slate-400" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 truncate text-xl tracking-tighter leading-none mb-2">{supplier.name}</h3>
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/80 w-fit shadow-sm">
            <Building2 size={14} className="text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              {supplier.bank_name}
            </span>
          </div>
        </div>
      </div>

      {/* Bank Account Section */}
      <div className="bg-white/60 backdrop-blur-md rounded-[24px] p-5 border border-white/80 mb-8 shadow-sm relative z-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-3">Instruksi Pembayaran</p>
        <div className="space-y-1">
          <p className="font-bold text-slate-900 tracking-widest text-xl leading-none">{supplier.bank_account_number}</p>
          <p className="text-xs font-bold text-orange-500 uppercase tracking-tight">A/N: {supplier.bank_account_name}</p>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="space-y-3 mb-8 relative z-10">
        {supplier.email && (
          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 shadow-sm border border-white">
               <Mail size={14} />
            </div>
            <span className="truncate">{supplier.email}</span>
          </div>
        )}
        {supplier.phone && (
          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 shadow-sm border border-white">
               <Phone size={14} />
            </div>
            <span>{supplier.phone}</span>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-3 mt-auto pt-6 border-t border-slate-100/50 relative z-10">
        <Button
          fullWidth
          variant="flat"
          className="font-bold text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 rounded-2xl h-12 transition-all outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          startContent={<Edit2 size={16} />}
          onPress={onEdit}
        >
          EDIT DETAIL
        </Button>
        <Button
          isIconOnly
          variant="light"
          className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl w-12 h-12 transition-all"
          onPress={onDelete}
        >
          <Trash2 size={20} />
        </Button>
      </div>
    </div>
  );
}
