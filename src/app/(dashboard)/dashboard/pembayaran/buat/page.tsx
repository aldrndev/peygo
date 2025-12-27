"use client";

import { useState, startTransition, useMemo, useEffect } from "react";
import { 
  Button, 
  Card, 
  CardBody, 
  Input, 
  Textarea,
  Select,
  SelectItem,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/react";
import { 
  Plus, 
  Trash, 
  ArrowLeft, 
  AlertCircle, 
  Eye, 
  ShoppingBag, 
  FileCheck,
  Calendar,
  Building2,
  ChevronRight,
  Save,
  Wallet2,
  ReceiptText,
  User
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray, useWatch, type Path, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createInvoice } from "@/app/(dashboard)/dashboard/invoice/actions";
import { invoiceSchema } from "@/app/(dashboard)/dashboard/invoice/schema";
import { getSuppliers } from "@/app/(dashboard)/dashboard/supplier/actions";
import { Supplier } from "@/types/database";

type InvoiceSchema = z.infer<typeof invoiceSchema>;

type Step = 1 | 2 | 3;

export default function CreatePembayaranPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    getSuppliers().then(setSuppliers);
  }, []);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<InvoiceSchema>({
    resolver: zodResolver(invoiceSchema) as unknown as Resolver<InvoiceSchema>,
    defaultValues: {
      type: "PAYMENT_REQUEST",
      items: [{ description: "", quantity: 1, unit_price: 0 }],
      tax_enabled: false,
      tax_rate: 11,
      discount_type: "",
      discount_value: 0,
      recipient_name: "",
      recipient_email: "",
      recipient_phone: "",
      recipient_address: "",
      recipient_bank_name: "",
      recipient_bank_account_number: "",
      recipient_bank_account_name: "",
      description: "",
      due_date: "",
      amount: 0,
      supplier_id: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch values using useWatch for React Compiler compatibility
  const watchedItems = useWatch({ control, name: "items", defaultValue: [{ description: "", quantity: 1, unit_price: 0 }] });
  const taxEnabled = useWatch({ control, name: "tax_enabled", defaultValue: false });
  const taxRate = useWatch({ control, name: "tax_rate", defaultValue: 11 }) || 11;
  const discountType = useWatch({ control, name: "discount_type", defaultValue: "" });
  const discountValue = useWatch({ control, name: "discount_value", defaultValue: 0 }) || 0;
  const recipientName = useWatch({ control, name: "recipient_name", defaultValue: "" });
  const dueDate = useWatch({ control, name: "due_date", defaultValue: "" });
  const selectedSupplierId = useWatch({ control, name: "supplier_id", defaultValue: null });
  const bankName = useWatch({ control, name: "recipient_bank_name", defaultValue: "" });
  const accountNumber = useWatch({ control, name: "recipient_bank_account_number", defaultValue: "" });
  const accountName = useWatch({ control, name: "recipient_bank_account_name", defaultValue: "" });

  const handleSupplierChange = (supplierId: string) => {
    setValue("supplier_id", supplierId);
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      setValue("recipient_name", supplier.name);
      setValue("recipient_bank_name", supplier.bank_name || "");
      setValue("recipient_bank_account_number", supplier.bank_account_number || "");
      setValue("recipient_bank_account_name", supplier.bank_account_name || "");
      setValue("recipient_address", supplier.address || "");
      setValue("recipient_email", supplier.email || "");
      setValue("recipient_phone", supplier.phone || "");
    }
  };

  // Calculations
  const subtotal = useMemo(() => 
    watchedItems.reduce((acc, item) => acc + ((item.quantity || 0) * (item.unit_price || 0)), 0), 
    [watchedItems]
  );
  
  const discountAmount = useMemo(() => {
    if (discountType === "percentage") return Math.round((subtotal * discountValue) / 100);
    if (discountType === "fixed") return discountValue;
    return 0;
  }, [subtotal, discountType, discountValue]);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxEnabled ? Math.round((taxableAmount * taxRate) / 100) : 0;
  const totalAmount = taxableAmount + taxAmount;

  // Update hidden amount field
  useEffect(() => {
    setValue("amount", totalAmount);
  }, [totalAmount, setValue]);

  const onSubmit = async (data: InvoiceSchema) => {
    setIsPending(true);
    setServerError(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "items") {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    startTransition(async () => {
      const result = await createInvoice(null, formData);
      if (result?.error) {
        setServerError(result.error);
        setIsPending(false);
      }
    });
  };

  const nextStep = async () => {
    const fieldsToValidate: Path<InvoiceSchema>[] = currentStep === 1 
      ? ["supplier_id", "due_date", "description"] 
      : ["items"];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((s) => (s + 1) as Step);
    }
  };

  const prevStep = () => currentStep > 1 && setCurrentStep((s) => (s - 1) as Step);

  const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-4xl mx-auto pb-44 md:pb-8 px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="flex items-center gap-6">
          <Button 
            as={Link} 
            href="/dashboard/pembayaran" 
            variant="light" 
            isIconOnly 
            className="bg-white/40 backdrop-blur-xl border border-white/60 hover:bg-white rounded-2xl w-12 h-12 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-none">Buat Pembayaran</h1>
            <p className="text-slate-500 text-lg font-medium mt-2">Lengkapi detail permintaan pembayaran</p>
          </div>
        </div>
        <Button 
            variant="flat" 
            color="secondary" 
            className="hidden sm:flex font-bold px-8 rounded-2xl h-12 uppercase tracking-widest text-xs" 
            startContent={<Eye size={18} />} 
            onPress={onOpen}
        >
            PRATINJAU
        </Button>
      </div>

      {/* Visual Stepper */}
      <div className="relative flex justify-between items-center mb-16 px-4 md:px-0">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-700 rounded-full" 
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
        />
        
        {[
          { icon: Building2, label: "Supplier" },
          { icon: ShoppingBag, label: "Item" },
          { icon: FileCheck, label: "Review" }
        ].map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep >= stepNum;
          const isCurrent = currentStep === stepNum;
          const Icon = step.icon;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-4 group">
              <div 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  isActive ? "bg-orange-500 text-white" : "bg-white text-slate-300 border-2 border-slate-100 group-hover:border-slate-200"
                }`}
              >
                <Icon size={24} className={isCurrent ? "animate-pulse" : ""} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? "text-slate-900" : "text-slate-400 opacity-50"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative overflow-hidden">
        <input type="hidden" {...register("type")} />
        <input type="hidden" {...register("recipient_name")} />
        <input type="hidden" {...register("amount")} />
        <input type="hidden" {...register("recipient_bank_name")} />
        <input type="hidden" {...register("recipient_bank_account_number")} />
        <input type="hidden" {...register("recipient_bank_account_name")} />
        <input type="hidden" {...register("recipient_address")} />
        <input type="hidden" {...register("recipient_email")} />
        <input type="hidden" {...register("recipient_phone")} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="space-y-8"
          >
            {/* STEP 1: Supplier & Details */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <Card className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl shadow-slate-200/50 rounded-[32px] overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <CardBody className="gap-8 p-8 md:p-12 relative z-10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                           <Building2 size={24} />
                        </div>
                        <div>
                           <h3 className="font-bold text-xl text-slate-900 tracking-tight">Detail Supplier</h3>
                           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Pilih pihak yang akan dibayar</p>
                        </div>
                      </div>
                      <Button as={Link} href="/dashboard/supplier" size="sm" variant="light" color="primary" className="font-bold uppercase tracking-widest text-xs">Kelola Supplier</Button>
                    </div>

                    <Select 
                      label="Cari Supplier" 
                      placeholder={suppliers.length === 0 ? "Belum ada supplier" : "Pilih supplier dari daftar..."}
                      variant="flat"
                      className="font-bold"
                      classNames={{
                        trigger: "bg-white/50 border border-slate-100 h-16 rounded-[20px] px-6",
                        label: "font-bold text-slate-400 uppercase tracking-widest text-xs",
                      }}
                      selectedKeys={selectedSupplierId ? [selectedSupplierId] : []}
                      onSelectionChange={(keys) => {
                        const val = Array.from(keys)[0] as string;
                        handleSupplierChange(val);
                      }}
                      isRequired
                      isDisabled={suppliers.length === 0}
                      startContent={<User size={20} className="text-slate-400" />}
                    >
                      {suppliers.map((s) => (
                        <SelectItem key={s.id} textValue={s.name} className="font-bold text-xs uppercase tracking-widest py-3">
                          {s.name}
                        </SelectItem>
                      ))}
                    </Select>

                    {selectedSupplierId && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 text-white p-8 rounded-[28px] relative overflow-hidden"
                      >
                         <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                         <div className="relative z-10">
                             <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-3">Bank Tujuan</p>
                             <p className="font-bold text-lg tracking-tight">{bankName || "-"}</p>
                         </div>
                         <div className="relative z-10 md:border-x md:border-slate-800 md:px-6">
                             <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-3">Nomor Rekening</p>
                             <p className="font-bold text-2xl tracking-tighter text-orange-400">{accountNumber || "-"}</p>
                         </div>
                         <div className="relative z-10">
                             <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-3">Atas Nama</p>
                             <p className="font-bold text-lg tracking-tight uppercase">{accountName || "-"}</p>
                         </div>
                      </motion.div>
                    )}
                  </CardBody>
                </Card>

                <Card className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
                  <CardBody className="gap-8 p-8 md:p-12">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                         <ReceiptText size={24} />
                      </div>
                      <div>
                         <h3 className="font-bold text-xl text-slate-900 tracking-tight">Informasi Tambahan</h3>
                         <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Detail pembayaran dan catatan</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Input 
                        {...register("due_date")}
                        type="date" 
                        label="Tanggal Jatuh Tempo" 
                        variant="flat"
                        className="font-bold"
                        isRequired 
                        min={new Date().toISOString().split('T')[0]}
                        startContent={<Calendar size={20} className="text-slate-400" />}
                        classNames={{
                          inputWrapper: "bg-white/50 border border-slate-100 h-16 rounded-[20px] px-6",
                          label: "font-bold text-slate-400 uppercase tracking-widest text-xs",
                          errorMessage: "font-bold text-xs uppercase tracking-wider",
                        }}
                        isInvalid={!!errors.due_date}
                        errorMessage={errors.due_date?.message}
                      />
                    </div>
                    <Textarea 
                      {...register("description")}
                      label="Deskripsi Transaksi" 
                      placeholder="Contoh: Pelunasan Invoice #8829 atau Pembelian Stok..." 
                      variant="flat"
                      className="font-bold"
                      classNames={{
                        inputWrapper: "bg-white/50 border border-slate-100 rounded-[20px] p-6",
                        label: "font-bold text-slate-400 uppercase tracking-widest text-xs",
                        errorMessage: "font-bold text-xs uppercase tracking-wider",
                      }}
                      isInvalid={!!errors.description}
                      errorMessage={errors.description?.message}
                      minRows={3} 
                      isRequired
                    />
                  </CardBody>
                </Card>
              </div>
            )}

            {/* STEP 2: Items & Calculation */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-2xl text-slate-900 tracking-tighter">Daftar Item</h3>
                    <p className="text-slate-500 text-sm font-medium">Rincian layanan atau produk yang dibayar</p>
                  </div>
                  <Button 
                    size="md" 
                    variant="flat" 
                    color="primary" 
                    onPress={() => append({ description: "", quantity: 1, unit_price: 0 })} 
                    className="font-bold rounded-2xl h-12 uppercase tracking-widest text-xs px-6"
                    startContent={<Plus size={18} />}
                  >
                    Tambah Item
                  </Button>
                </div>
                
                 <div className="space-y-4">
                  <AnimatePresence>
                    {fields.map((field, index) => (
                      <motion.div 
                        key={field.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="p-8 bg-white/60 backdrop-blur-md border border-white rounded-[32px] group relative"
                      >
                        <div className="flex justify-between items-start gap-6 mb-6">
                          <Input 
                            {...register(`items.${index}.description`)}
                            placeholder="Deskripsi item atau layanan..." 
                            variant="flat"
                            className="flex-1 font-bold"
                            classNames={{
                              inputWrapper: "bg-slate-50 group-hover:bg-white border-transparent group-hover:border-slate-100 h-14 rounded-2xl px-6 transition-all",
                              errorMessage: "font-bold text-xs uppercase tracking-wider",
                            }}
                            isInvalid={!!errors.items?.[index]?.description}
                            errorMessage={errors.items?.[index]?.description?.message}
                          />
                          {fields.length > 1 && (
                            <Button 
                                isIconOnly 
                                size="md" 
                                color="danger" 
                                variant="light" 
                                onPress={() => remove(index)} 
                                className="rounded-xl hover:bg-rose-50"
                            >
                              <Trash size={20} />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                          <Input 
                            {...register(`items.${index}.quantity`)}
                            type="number" 
                            label="QTY" 
                            variant="flat"
                            className="font-bold"
                            classNames={{
                              inputWrapper: "bg-slate-50 border-transparent h-14 rounded-2xl px-6",
                              label: "font-bold text-slate-400 uppercase tracking-widest text-xs",
                              errorMessage: "font-bold text-xs uppercase tracking-wider",
                            }}
                            isInvalid={!!errors.items?.[index]?.quantity}
                            errorMessage={errors.items?.[index]?.quantity?.message}
                          />
                          <Input 
                            {...register(`items.${index}.unit_price`)}
                            type="number" 
                            label="HARGA SATUAN" 
                            variant="flat"
                            className="col-span-2 font-bold"
                            classNames={{
                              inputWrapper: "bg-slate-50 border-transparent h-14 rounded-2xl px-6",
                              label: "font-bold text-slate-400 uppercase tracking-widest text-xs",
                              errorMessage: "font-bold text-xs uppercase tracking-wider",
                            }}
                            isInvalid={!!errors.items?.[index]?.unit_price}
                            errorMessage={errors.items?.[index]?.unit_price?.message}
                            startContent={<span className="text-slate-400 text-xs font-bold mr-1">Rp</span>}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <Card className="bg-slate-900 border-none shadow-2xl rounded-[40px] overflow-hidden mt-12 relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-orange-500/20 transition-all duration-700" />
                  <CardBody className="p-10 md:p-14 gap-8 relative z-10">
                    <div className="flex justify-between items-center pb-8 border-b border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-orange-500">
                           <Wallet2 size={24} />
                        </div>
                        <h3 className="font-bold text-xl text-white tracking-tight uppercase">Ringkasan Biaya</h3>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Subtotal</span>
                        <span className="font-bold text-white text-lg tabular-nums">{formatCurrency(subtotal)}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-8 py-8 border-y border-slate-800">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Diskon</span>
                          <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl">
                            <button 
                                type="button"
                                onClick={() => setValue("discount_type", "fixed")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${discountType === "fixed" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"}`}
                            >RP</button>
                            <button 
                                type="button"
                                onClick={() => setValue("discount_type", "percentage")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${discountType === "percentage" ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"}`}
                            >%</button>
                            {discountType && (
                                <button 
                                    type="button"
                                    onClick={() => { setValue("discount_type", ""); setValue("discount_value", 0); }}
                                    className="px-3 text-rose-500 hover:scale-110 transition-transform"
                                ><Trash size={14} /></button>
                            )}
                          </div>
                           {discountType && (
                             <Input 
                               {...register("discount_value")}
                               type="number" 
                               size="sm" 
                               className="w-24 font-bold"
                               variant="flat"
                               classNames={{ inputWrapper: "bg-slate-800 border-none rounded-xl" }}
                             />
                           )}
                        </div>
                        <div className="flex items-center gap-4 ml-auto">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pajak (PPN)</span>
                          <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-2xl">
                             {taxEnabled && (
                                 <Input 
                                     {...register("tax_rate")}
                                     type="number" 
                                     size="sm" 
                                     className="w-16 font-bold"
                                     variant="flat"
                                     classNames={{ inputWrapper: "bg-transparent border-none p-0 h-auto min-h-0" }}
                                     endContent={<span className="text-xs text-slate-500">%</span>}
                                 />
                             )}
                            <Switch size="sm" isSelected={taxEnabled} onValueChange={(val) => setValue("tax_enabled", val)} color="primary" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end pt-4">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-orange-500 uppercase tracking-[0.3em]">Total Akhir</span>
                          <p className="text-4xl md:text-6xl font-bold text-white tracking-tighter tabular-nums leading-none">{formatCurrency(totalAmount)}</p>
                        </div>
                        {taxEnabled && <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">*Termasuk PPN {taxRate}%</p>}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* STEP 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <Card className="bg-emerald-500/10 border border-emerald-500/20 shadow-none p-10 md:p-14 text-center rounded-[40px] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-all duration-700" />
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30 rotate-3">
                    <FileCheck size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">Konfirmasi Permintaan</h3>
                  <p className="text-slate-500 text-lg font-medium max-w-sm mx-auto mt-4">Pastikan rincian supplier, bank, dan rincian item sudah sesuai.</p>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px]">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Penerima Dana</p>
                     <p className="font-bold text-2xl text-slate-900 tracking-tight">{recipientName || "-"}</p>
                     <div className="flex items-center gap-2 mt-2">
                         <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{bankName}</span>
                         <div className="w-1 h-1 rounded-full bg-slate-300" />
                         <span className="text-xs font-bold text-slate-900 tracking-widest">{accountNumber}</span>
                     </div>
                  </div>
                  <div className="p-8 bg-slate-900 text-white rounded-[32px] shadow-2xl shadow-slate-900/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-4 relative z-10">Total Bayar</p>
                    <p className="text-4xl font-bold text-orange-400 tracking-tighter relative z-10 tabular-nums">{formatCurrency(totalAmount)}</p>
                    <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-widest relative z-10">Jatuh Tempo: {dueDate}</p>
                  </div>
                </div>

                <div className="p-10 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] space-y-6">
                   <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Rincian Layanan</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Subtotal</span>
                   </div>
                   <div className="space-y-4">
                     {watchedItems.map((item, index: number) => (
                       <div key={index} className="flex justify-between items-center">
                          <span className="text-slate-900 font-bold text-lg tracking-tight truncate flex-1">{item.description || `Item ${index + 1}`}</span>
                          <span className="font-bold text-slate-500 tabular-nums ml-4">{formatCurrency((item.quantity || 0) * (item.unit_price || 0))}</span>
                       </div>
                     ))}
                   </div>
                </div>

                 {serverError && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="p-6 bg-rose-50 text-rose-600 rounded-[24px] flex items-center gap-4 border border-rose-100"
                   >
                     <AlertCircle size={24} />
                     <span className="text-sm font-bold uppercase tracking-widest">{serverError}</span>
                   </motion.div>
                 )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Controls - Desktop & Tablet */}
        <div className="hidden md:flex justify-between items-center mt-16 gap-6 relative">
          <div className="absolute inset-x-0 -top-8 h-px bg-slate-100" />
          <Button 
            variant="light" 
            onPress={prevStep} 
            isDisabled={currentStep === 1}
            className="font-bold px-10 rounded-2xl h-14 uppercase tracking-widest text-xs"
          >
            Kembali
          </Button>
          
          <div className="flex gap-4">
             {currentStep < 3 ? (
               <Button 
                 color="primary" 
                 onPress={nextStep} 
                 className="font-bold px-14 rounded-2xl h-14 uppercase tracking-widest text-xs shadow-2xl shadow-orange-500/20"
                 endContent={<ChevronRight size={18} />}
               >
                 Lanjut
               </Button>
             ) : (
                <Button 
                  type="submit"
                  color="primary" 
                  className="font-bold px-12 rounded-2xl h-14 uppercase tracking-widest text-xs"
                  isLoading={isPending}
                  startContent={!isPending && <Save size={18} />}
                >
                  SIMPAN PEMBAYARAN
                </Button>
             )}
          </div>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="md:hidden fixed bottom-16 inset-x-0 z-40 bg-white/80 backdrop-blur-2xl border-t border-slate-100 p-6 flex items-center justify-between gap-6 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
           <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Total</span>
              <span className="text-2xl font-bold text-orange-500 tracking-tighter tabular-nums leading-none">{formatCurrency(totalAmount)}</span>
           </div>
           
           <div className="flex gap-3">
             <Button 
               isIconOnly 
               variant="flat" 
               onPress={prevStep} 
               isDisabled={currentStep === 1}
               className="rounded-2xl h-14 w-14 bg-slate-50"
             >
               <ArrowLeft size={20} />
             </Button>
             
             {currentStep < 3 ? (
               <Button 
                 color="primary" 
                 onPress={nextStep} 
                 className="font-bold px-10 rounded-2xl h-14 uppercase tracking-widest text-xs shadow-2xl shadow-orange-500/20"
                 endContent={<ChevronRight size={18} />}
               >
                 Lanjut
               </Button>
             ) : (
                <Button 
                  type="submit"
                  color="primary" 
                  className="font-bold px-10 rounded-2xl h-14 uppercase tracking-widest text-xs"
                  isLoading={isPending}
                >
                  Simpan
                </Button>
             )}
           </div>
        </div>

        {/* Preview Modal */}
        <Modal 
          isOpen={isOpen} 
          onOpenChange={onOpenChange} 
          size="4xl" 
          scrollBehavior="inside"
          classNames={{
            base: "rounded-[40px] bg-white/90 backdrop-blur-2xl border border-white/60",
            header: "p-10 border-b border-slate-100",
            body: "p-0", // Remove padding for the interior document feel
            footer: "p-8 border-t border-slate-100 bg-slate-50/50 rounded-b-[40px]",
            closeButton: "top-8 right-8 text-2xl hover:bg-slate-100 transition-all rounded-2xl p-3 z-50"
          }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-2">
                           <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">Pratinjau Permintaan</h3>
                           <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Dokumen Pembayaran (Draft)</p>
                        </ModalHeader>
                        <ModalBody>
                            <div className="p-8 md:p-12">
                                <Card className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 border-none overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32" />
                                    <CardBody className="p-10 md:p-16 relative z-10">
                                        <div className="flex justify-between items-start mb-16">
                                            <div className="space-y-6">
                                                <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-5 py-2 rounded-2xl shadow-xl shadow-slate-900/20">
                                                    <ReceiptText size={20} />
                                                    <span className="text-xs font-bold uppercase tracking-[0.2em]">PAYMENT REQUEST</span>
                                                </div>
                                                <div>
                                                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-none mb-3">#DRAFT</h2>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest bg-amber-500/10 text-amber-600">
                                                            MENUNGGU DATA
                                                        </span>
                                                        <span className="text-slate-400 font-bold text-sm">Belum Disimpan</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-6">
                                                <div className="space-y-1">
                                                     <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Penerima Dana</p>
                                                     <h3 className="font-bold text-3xl text-slate-900 tracking-tight leading-none">{recipientName || "Pilih Supplier..."}</h3>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Jatuh Tempo</p>
                                                    <div className="flex justify-end items-center gap-2 text-rose-500">
                                                        <Calendar size={18} />
                                                        <p className="text-xl font-bold tracking-tighter">{dueDate || "-"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="overflow-x-auto mb-16">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b-2 border-slate-100">
                                                        <th className="py-6 text-left font-bold text-slate-400 uppercase text-xs tracking-[0.3em] pb-4">Deskripsi Layanan</th>
                                                        <th className="py-6 text-center font-bold text-slate-400 uppercase text-xs tracking-[0.3em] pb-4 w-24">QTY</th>
                                                        <th className="py-6 text-right font-bold text-slate-400 uppercase text-xs tracking-[0.3em] pb-4 w-40">HARGA</th>
                                                        <th className="py-6 text-right font-bold text-slate-400 uppercase text-xs tracking-[0.3em] pb-4 w-48">TOTAL</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                     {watchedItems.map((item, i) => (
                                                         <tr key={i}>
                                                             <td className="py-6">
                                                                 <p className="font-bold text-slate-900 text-lg tracking-tight">{item.description || "Item Baru..."}</p>
                                                             </td>
                                                             <td className="py-6 text-center font-bold text-slate-500 uppercase tracking-widest">{item.quantity}</td>
                                                             <td className="py-6 text-right font-bold text-slate-500 tabular-nums">{formatCurrency(item.unit_price)}</td>
                                                             <td className="py-6 text-right font-bold text-slate-900 tabular-nums text-lg">
                                                                 {formatCurrency((item.quantity || 0) * (item.unit_price || 0))}
                                                             </td>
                                                         </tr>
                                                     ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:justify-between gap-12 pt-12 border-t border-slate-100">
                                            <div className="space-y-6 max-w-sm">
                                                <div className="space-y-4">
                                                    <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.3em]">Instruksi Pembayaran</p>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                                                            <Building2 size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 tracking-tight uppercase">{bankName || "Nama Bank"}</p>
                                                            <p className="text-orange-500 text-xs font-bold tracking-widest">{accountNumber || "Nomor Rekening"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="md:w-80 space-y-4">
                                                <div className="flex justify-between items-center text-slate-400">
                                                    <span className="text-xs font-bold uppercase tracking-widest">Subtotal</span>
                                                    <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(subtotal)}</span>
                                                </div>
                                                {discountAmount > 0 && (
                                                    <div className="flex justify-between items-center text-rose-500">
                                                        <span className="text-xs font-bold uppercase tracking-widest">Diskon</span>
                                                        <span className="font-bold tabular-nums">-{formatCurrency(discountAmount)}</span>
                                                    </div>
                                                )}
                                                {taxEnabled && (
                                                    <div className="flex justify-between items-center text-slate-400">
                                                        <span className="text-xs font-bold uppercase tracking-widest">Pajak (PPN {taxRate}%)</span>
                                                        <span className="font-bold text-slate-900 tabular-nums">+{formatCurrency(taxAmount)}</span>
                                                    </div>
                                                )}
                                                <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center">
                                                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-900">Total Pembayaran</span>
                                                    <span className="text-3xl font-bold text-orange-500 tabular-nums tracking-tighter">{formatCurrency(totalAmount)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose} className="font-bold uppercase tracking-widest text-xs">Tutup Pratinjau</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
      </form>
    </div>
  );
}
