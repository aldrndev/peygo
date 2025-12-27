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
      <div className="space-y-6 md:space-y-8 pb-20">
        {/* Header - Desktop */}
        <div className="hidden md:flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Supplier</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola rekan bisnis dan informasi pembayaran</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
              {suppliers.length}/5 slot
            </div>
            <Button 
              color="primary" 
              size="sm"
              className="font-medium text-xs h-9 rounded-lg"
              startContent={<Plus size={16} />}
              onPress={handleCreate}
              isDisabled={suppliers.length >= 5}
            >
              Tambah
            </Button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Supplier</h1>
            <p className="text-xs text-slate-500 mt-0.5">{suppliers.length}/5 slot terpakai</p>
          </div>
        </div>

        {/* Search */}
        <div>
          <Input
            {...register("search")}
            placeholder="Cari supplier..."
            startContent={<Search size={16} className="text-slate-400" />}
            className="w-full"
            classNames={{
              inputWrapper: "bg-white border-slate-100 border rounded-lg h-10",
              input: "text-sm placeholder:text-slate-400",
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
    <div className="bg-white border border-slate-100 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-start gap-3 flex-1 mb-4">
        <Avatar 
          name={supplier.name} 
          size="md"
          className="w-10 h-10 text-base font-semibold bg-slate-900 text-white rounded-xl"
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate text-sm mb-1">{supplier.name}</h3>
          <span className="text-xs text-slate-500">{supplier.bank_name}</span>
        </div>
      </div>

      {/* Bank Account Section */}
      <div className="bg-slate-50 rounded-lg p-3 mb-3">
        <p className="text-xs text-slate-500 mb-1">Rekening</p>
        <p className="font-semibold text-slate-900 text-sm">{supplier.bank_account_number}</p>
        <p className="text-xs text-orange-500">A/N: {supplier.bank_account_name}</p>
      </div>
      
      {/* Contact Section */}
      <div className="space-y-2 mb-4 text-xs text-slate-500">
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
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-100">
        <Button
          fullWidth
          size="sm"
          variant="flat"
          className="font-medium text-xs bg-slate-900 text-white rounded-lg h-9"
          startContent={<Edit2 size={14} />}
          onPress={onEdit}
        >
          Edit
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg w-9 h-9"
          onPress={onDelete}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
