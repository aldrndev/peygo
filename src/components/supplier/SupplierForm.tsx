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
import { createSupplier, updateSupplier, supplierSchema } from "@/app/(dashboard)/dashboard/supplier/actions";
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
        <div className="flex items-center gap-3 mb-2">
           <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <User size={20} />
           </div>
           <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Informasi Kontak</h4>
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
              inputWrapper: "bg-white/40 backdrop-blur-xl border-white/60 border shadow-none hover:bg-white focus-within:bg-white transition-all rounded-2xl h-14",
              label: "font-bold text-slate-400 uppercase tracking-widest text-xs",
              input: "font-medium text-slate-900",
              errorMessage: "font-bold text-xs uppercase tracking-wider",
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
              inputWrapper: "bg-white/40 backdrop-blur-xl border-white/60 border shadow-none hover:bg-white focus-within:bg-white transition-all rounded-2xl h-14",
              label: "font-bold text-slate-400 uppercase tracking-widest text-xs",
              input: "font-medium text-slate-900",
              errorMessage: "font-bold text-xs uppercase tracking-wider",
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
        <div className="flex items-center gap-3 mb-2">
           <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
              <Landmark size={20} />
           </div>
           <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Informasi Bank</h4>
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
              inputWrapper: "bg-white/40 backdrop-blur-xl border-white/60 border shadow-none hover:bg-white focus-within:bg-white transition-all rounded-2xl h-14",
              label: "font-bold text-slate-400 uppercase tracking-widest text-xs",
              input: "font-medium text-slate-900",
              errorMessage: "font-bold text-xs uppercase tracking-wider",
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
              inputWrapper: "bg-white/40 backdrop-blur-xl border-white/60 border shadow-none hover:bg-white focus-within:bg-white transition-all rounded-2xl h-14",
              label: "font-bold text-slate-400 uppercase tracking-widest text-xs",
              input: "font-medium text-slate-900",
              errorMessage: "font-bold text-xs uppercase tracking-wider",
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
            className="p-5 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest rounded-2xl border border-rose-100 flex items-center gap-3 shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
              <AlertCircle size={16} />
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
          base: "bg-white/90 backdrop-blur-2xl rounded-t-[40px] border-t border-white/60 max-h-[90%]",
          header: "pt-8 px-8 border-none",
          body: "px-8 pb-4",
          footer: "p-8 border-t border-slate-100",
          closeButton: "top-8 right-8 text-2xl hover:bg-slate-100 transition-all rounded-full p-2"
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 items-start">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tighter leading-none">{title}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{labelSuffix}</p>
              </DrawerHeader>
              <DrawerBody>
                {formContent}
              </DrawerBody>
              <DrawerFooter className="flex gap-3">
                <Button variant="light" className="font-bold text-xs uppercase tracking-widest flex-1 h-14 rounded-2xl" onPress={onClose}>BATAL</Button>
                <Button 
                  color="primary" 
                  className="font-bold text-xs uppercase tracking-widest flex-[2] h-14 rounded-2xl shadow-xl shadow-orange-500/20" 
                  isLoading={isPending}
                  startContent={!isPending && <Save size={18} />}
                  onPress={() => handleSubmit(onSubmit)()}
                >
                  {supplier ? "SIMPAN PERUBAHAN" : "TAMBAH SUPPLIER"}
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
        base: "bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[48px] shadow-2xl",
        header: "p-10 border-none",
        body: "px-10 pb-4",
        footer: "p-10 bg-slate-50/50 border-t border-slate-100",
        closeButton: "top-10 right-10 text-3xl hover:bg-slate-100 transition-all rounded-full p-3"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-3xl font-bold text-slate-900 tracking-tighter leading-none">{title}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{labelSuffix}</p>
            </ModalHeader>
            <ModalBody>
              {formContent}
            </ModalBody>
            <ModalFooter className="flex gap-4">
              <Button variant="light" className="font-bold text-xs uppercase tracking-widest px-8 h-14 rounded-2xl" onPress={onClose}>
                BATAL
              </Button>
              <Button 
                color="primary" 
                className="font-bold text-xs uppercase tracking-widest px-12 h-14 rounded-2xl shadow-2xl shadow-orange-500/20" 
                isLoading={isPending}
                startContent={!isPending && <Save size={18} />}
                onPress={() => handleSubmit(onSubmit)()}
              >
                {supplier ? "SIMPAN PERUBAHAN" : "SIMPAN SUPPLIER"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
