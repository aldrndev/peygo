"use client";

import { startTransition, useEffect, useState } from "react";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Input,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createSupplier, updateSupplier } from "@/app/(dashboard)/dashboard/supplier/actions";
import { supplierSchema } from "@/app/(dashboard)/dashboard/supplier/schema";
import { Supplier } from "@/types/database";
import { User, Mail, Phone, MapPin, Building2, CreditCard, Landmark, Save, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SupplierFormProps {
  isOpen: boolean;
  onOpenChange: () => void;
  supplier?: Supplier | null;
}

type SupplierSchema = z.infer<typeof supplierSchema>;

export default function SupplierForm({ isOpen, onOpenChange, supplier }: SupplierFormProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
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

  // Reset form when supplier changes or modal opens
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
      // Use a small timeout or just don't reset here if it's already null
      // Actually, setting to null is only needed if there was a previous error
      // Use a timeout to avoid synchronous setState warning
      const timer = setTimeout(() => setServerError(null), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, supplier, reset]);

  const onSubmit = async (data: SupplierSchema) => {
    setIsPending(true);
    setServerError(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    startTransition(async () => {
      const action = supplier 
        ? updateSupplier.bind(null, supplier.id) 
        : createSupplier;
      
      const result = await action(null, formData);
      
      if (result?.success) {
        onOpenChange();
        setIsPending(false);
      } else if (result?.error) {
        setServerError(result.error);
        setIsPending(false);
      }
    });
  };

  const formContent = (
    <form id="supplier-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Contact Group */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
           <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
              <User size={16} />
           </div>
           <h4 className="text-xs font-medium text-slate-500">Informasi Kontak</h4>
        </div>
        
        <Input
          {...register("name")}
          autoFocus
          label="Nama Supplier"
          placeholder="PT. Maju Bersama"
          variant="flat"
          classNames={{
            inputWrapper: "bg-white/40 backdrop-blur-xl border-white/60 border shadow-none hover:bg-white focus-within:bg-white transition-all rounded-2xl h-14",
            label: "font-bold text-slate-400 uppercase tracking-widest text-xs",
            input: "font-medium text-slate-900",
            errorMessage: "font-bold text-xs uppercase tracking-wider",
          }}
          startContent={<Building2 size={20} className="text-slate-400" />}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register("email")}
            type="email"
            label="Alamat Email"
            placeholder="hi@supplier.com"
            variant="flat"
            classNames={{
              inputWrapper: "bg-white border-slate-100 border rounded-lg h-11",
              label: "font-medium text-slate-500 text-xs",
              input: "text-sm text-slate-900",
              errorMessage: "text-xs",
            }}
            startContent={<Mail size={20} className="text-slate-400" />}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
          <Input
            {...register("phone")}
            type="tel"
            label="Nomor Telepon"
            placeholder="0812..."
            variant="flat"
            classNames={{
              inputWrapper: "bg-white border-slate-100 border rounded-lg h-11",
              label: "font-medium text-slate-500 text-xs",
              input: "text-sm text-slate-900",
              errorMessage: "text-xs",
            }}
            startContent={<Phone size={20} className="text-slate-400" />}
            isInvalid={!!errors.phone}
            errorMessage={errors.phone?.message}
          />
        </div>
        
        <Input
          {...register("address")}
          label="Alamat Lengkap"
          placeholder="Jl. Raya Utama No. 12..."
          variant="flat"
          classNames={{
            inputWrapper: "bg-white/40 backdrop-blur-xl border-white/60 border shadow-none hover:bg-white focus-within:bg-white transition-all rounded-2xl h-14",
            label: "font-bold text-slate-400 uppercase tracking-widest text-xs",
            input: "font-medium text-slate-900",
            errorMessage: "font-bold text-xs uppercase tracking-wider",
          }}
          startContent={<MapPin size={20} className="text-slate-400" />}
          isInvalid={!!errors.address}
          errorMessage={errors.address?.message}
        />
      </div>

      {/* Bank Group */}
      <div className="pt-8 border-t border-slate-100 space-y-6">
        <div className="flex items-center gap-2 mb-2">
           <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Landmark size={16} />
           </div>
           <h4 className="text-xs font-medium text-slate-500">Informasi Bank</h4>
        </div>

        <Input
          {...register("bank_name")}
          label="Lembaga Perbankan"
          placeholder="BCA / Mandiri / BRI"
          variant="flat"
          classNames={{
            inputWrapper: "bg-white/40 backdrop-blur-xl border-white/60 border shadow-none hover:bg-white focus-within:bg-white transition-all rounded-2xl h-14",
            label: "font-bold text-slate-400 uppercase tracking-widest text-xs",
            input: "font-medium text-slate-900",
            errorMessage: "font-bold text-xs uppercase tracking-wider",
          }}
          isInvalid={!!errors.bank_name}
          errorMessage={errors.bank_name?.message}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register("bank_account_number")}
            label="Nomor Rekening"
            placeholder="1234567890"
            variant="flat"
            classNames={{
              inputWrapper: "bg-white border-slate-100 border rounded-lg h-11",
              label: "font-medium text-slate-500 text-xs",
              input: "text-sm text-slate-900",
              errorMessage: "text-xs",
            }}
            startContent={<CreditCard size={20} className="text-slate-400" />}
            isInvalid={!!errors.bank_account_number}
            errorMessage={errors.bank_account_number?.message}
          />
          <Input
            {...register("bank_account_name")}
            label="Nama Pemilik Rekening"
            placeholder="Joko Susilo"
            variant="flat"
            classNames={{
              inputWrapper: "bg-white border-slate-100 border rounded-lg h-11",
              label: "font-medium text-slate-500 text-xs",
              input: "text-sm text-slate-900",
              errorMessage: "text-xs",
            }}
            isInvalid={!!errors.bank_account_name}
            errorMessage={errors.bank_account_name?.message}
          />
        </div>
      </div>
      
      <AnimatePresence>
        {serverError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            role="alert"
            className="p-4 bg-rose-50 text-rose-600 text-xs rounded-lg border border-rose-100 flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
              <AlertCircle size={16} aria-hidden="true" />
            </div>
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );

  const title = supplier ? "Edit Supplier" : "Supplier Baru";
  const labelSuffix = supplier ? "Perbarui informasi detail rekan bisnis Anda" : "Tambahkan rekan bisnis baru ke dalam daftar";

  if (isMobile) {
    return (
      <Drawer 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        placement="bottom"
        scrollBehavior="inside"
        classNames={{
          base: "bg-white rounded-t-2xl border-t border-slate-100 max-h-[90%]",
          header: "pt-6 px-4 border-none",
          body: "px-4 pb-4",
          footer: "p-4 border-t border-slate-100",
          closeButton: "top-4 right-4 text-xl"
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 items-start">
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                <p className="text-xs text-slate-500 mt-1">{labelSuffix}</p>
              </DrawerHeader>
              <DrawerBody>
                {formContent}
              </DrawerBody>
              <DrawerFooter className="flex gap-2">
                <Button variant="light" size="sm" className="font-medium text-xs flex-1 h-10 rounded-lg" onPress={onClose}>Batal</Button>
                <Button 
                  color="primary" 
                  size="sm"
                  className="font-medium text-xs flex-[2] h-10 rounded-lg" 
                  isLoading={isPending}
                  startContent={!isPending && <Save size={14} />}
                  onPress={() => handleSubmit(onSubmit)()}
                >
                  {supplier ? "Simpan" : "Tambah"}
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange} 
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-white border border-slate-100 rounded-2xl",
        header: "p-6 border-none",
        body: "px-6 pb-4",
        footer: "p-6 bg-slate-50 border-t border-slate-100",
        closeButton: "top-6 right-6 text-xl"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 mt-1">{labelSuffix}</p>
            </ModalHeader>
            <ModalBody>
              {formContent}
            </ModalBody>
            <ModalFooter className="flex gap-3">
              <Button variant="light" size="sm" className="font-medium text-xs px-4 h-10 rounded-lg" onPress={onClose}>
                Batal
              </Button>
              <Button 
                color="primary" 
                size="sm"
                className="font-medium text-xs px-6 h-10 rounded-lg" 
                isLoading={isPending}
                startContent={!isPending && <Save size={14} />}
                onPress={() => handleSubmit(onSubmit)()}
              >
                {supplier ? "Simpan" : "Simpan"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
