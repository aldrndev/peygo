"use client";

import { useState, startTransition, useMemo, useEffect } from "react";
import { 
  Button, 
  Card, 
  CardBody, 
  Input, 
  Textarea,
  Switch,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip
} from "@heroui/react";
import { 
  Plus, 
  Trash, 
  ArrowLeft, 
  AlertCircle, 
  Eye, 
  ChevronRight, 
  User, 
  ShoppingBag, 
  FileCheck,
  Calendar,
  Wallet2,
  ReceiptText,
  Save
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray, useWatch, type Path, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createInvoice } from "@/app/(dashboard)/dashboard/invoice/actions";
import { invoiceSchema } from "@/app/(dashboard)/dashboard/invoice/schema";

type InvoiceSchema = z.infer<typeof invoiceSchema>;

type Step = 1 | 2 | 3;

export default function CreatePenagihanPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(1);

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
      type: "BILLING",
      items: [{ description: "", quantity: 1, unit_price: 0 }],
      tax_enabled: false,
      tax_rate: 11,
      discount_type: "",
      discount_value: 0,
      recipient_name: "",
      recipient_email: "",
      recipient_phone: "",
      recipient_address: "",
      description: "",
      due_date: "",
      amount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch values for calculations using useWatch for React Compiler compatibility
  const watchedItems = useWatch({ control, name: "items", defaultValue: [{ description: "", quantity: 1, unit_price: 0 }] });
  const taxEnabled = useWatch({ control, name: "tax_enabled", defaultValue: false });
  const taxRate = useWatch({ control, name: "tax_rate", defaultValue: 11 }) || 11;
  const discountType = useWatch({ control, name: "discount_type", defaultValue: "" });
  const discountValue = useWatch({ control, name: "discount_value", defaultValue: 0 }) || 0;
  const recipientName = useWatch({ control, name: "recipient_name", defaultValue: "" });
  const description = useWatch({ control, name: "description", defaultValue: "" });
  const dueDate = useWatch({ control, name: "due_date", defaultValue: "" });

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

  // Update hidden amount field whenever total changes
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
      ? ["recipient_name", "recipient_email", "recipient_phone", "due_date", "description"] 
      : ["items"];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((s) => (s + 1) as Step);
    }
  };

  const prevStep = () => currentStep > 1 && setCurrentStep((s) => (s - 1) as Step);

  const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  return (
    <div className="relative max-w-4xl mx-auto pb-44 md:pb-20 px-4 md:px-0">
      {/* Decorative Blur Elements (Admin Style) */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-400/5 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-blue-400/5 blur-[150px] -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative">
        <div className="flex items-center gap-6">
          <Button 
            as={Link} 
            href="/dashboard/penagihan" 
            variant="light" 
            isIconOnly 
            className="bg-white/60 backdrop-blur-xl border border-white/50 hover:bg-white rounded-2xl w-12 h-12 shrink-0"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tighter leading-none">Buat Penagihan</h1>
            <p className="text-slate-500 text-lg font-medium mt-2">Lengkapi detail tagihan bisnis Anda.</p>
          </div>
        </div>
        <Button 
          variant="flat" 
          color="secondary" 
          className="hidden sm:flex font-bold rounded-2xl px-8 h-12 uppercase tracking-widest text-xs" 
          startContent={<Eye size={20} />} 
          onPress={onOpen}
        >
          Pratinjau Invoice
        </Button>
      </div>

      {/* Visual Stepper */}
      <div className="relative flex justify-between items-center mb-16 px-4 md:px-8">
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-500 to-orange-400 -translate-y-1/2 z-10 transition-all duration-700 ease-in-out rounded-full" 
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
        />
        
        {[
          { icon: User, label: "Detail" },
          { icon: ShoppingBag, label: "Item" },
          { icon: FileCheck, label: "Review" }
        ].map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep >= stepNum;
          const isCurrent = currentStep === stepNum;
          const Icon = step.icon;

          return (
            <div key={idx} className="relative z-20 flex flex-col items-center gap-4 group">
              <div 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  isCurrent ? "bg-slate-900 text-white scale-110 ring-4 ring-white/60" : 
                  isActive ? "bg-orange-500 text-white border border-white/20" : "bg-white/60 backdrop-blur-xl border-2 border-white/50 text-slate-400"
                }`}
              >
                <Icon size={isCurrent ? 24 : 20} className="transition-all duration-500" />
              </div>
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? "text-slate-900" : "text-slate-400"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative overflow-hidden">
        <input type="hidden" {...register("type")} />
        <input type="hidden" {...register("amount")} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* STEP 1: Details */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <Card className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm overflow-hidden rounded-[40px]">
                  <CardBody className="gap-8 p-10 md:p-16">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                        <ReceiptText size={20} />
                      </div>
                      <h3 className="font-semibold text-xl text-slate-900 tracking-tight">Informasi Dasar</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Input 
                        {...register("due_date")}
                        type="date" 
                        label="Jatuh Tempo" 
                        variant="bordered"
                        className="font-medium"
                        isRequired 
                        min={new Date().toISOString().split('T')[0]}
                        startContent={<Calendar size={18} className="text-slate-400" />}
                        classNames={{
                          inputWrapper: "rounded-2xl border-white/40 bg-white/40 focus-within:border-orange-500 transition-colors h-14",
                          label: "font-bold text-xs uppercase tracking-widest text-slate-400",
                          errorMessage: "font-bold text-xs uppercase tracking-wider",
                        }}
                        isInvalid={!!errors.due_date}
                        errorMessage={errors.due_date?.message}
                      />
                      <Input 
                        {...register("recipient_name")}
                        label="Nama Penerima" 
                        placeholder="Contoh: PT. Abadi Jaya"
                        variant="bordered"
                        isRequired
                        startContent={<User size={18} className="text-slate-400" />}
                        classNames={{
                          inputWrapper: "rounded-2xl border-white/40 bg-white/40 focus-within:border-orange-500 transition-colors h-14",
                          label: "font-bold text-xs uppercase tracking-widest text-slate-400",
                          errorMessage: "font-bold text-xs uppercase tracking-wider",
                        }}
                        isInvalid={!!errors.recipient_name}
                        errorMessage={errors.recipient_name?.message}
                      />
                    </div>
                    <Textarea 
                      {...register("description")}
                      label="Deskripsi Utama" 
                      placeholder="Apa inti dari tagihan ini?" 
                      variant="bordered"
                      minRows={2} 
                      isRequired
                      classNames={{
                        inputWrapper: "rounded-2xl border-white/40 bg-white/40 focus-within:border-orange-500 transition-colors p-4",
                        label: "font-bold text-xs uppercase tracking-widest text-slate-400",
                        errorMessage: "font-bold text-xs uppercase tracking-wider",
                      }}
                      isInvalid={!!errors.description}
                      errorMessage={errors.description?.message}
                    />
                  </CardBody>
                </Card>

                <Card className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm overflow-hidden rounded-[40px]">
                  <CardBody className="gap-8 p-10 md:p-16">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 border border-white/60">
                        <Plus size={20} className="text-blue-500" />
                      </div>
                      <h3 className="font-semibold text-xl text-slate-900 tracking-tight">Detail Kontak Penerima</h3>
                    </div>
                    <Textarea
                      {...register("recipient_address")}
                      label="Alamat Lengkap"
                      placeholder="Tuliskan alamat pengiriman tagihan"
                      variant="bordered"
                      minRows={2}
                      isRequired
                      classNames={{
                        inputWrapper: "rounded-2xl border-white/40 bg-white/40 focus-within:border-blue-500 transition-colors p-4",
                        label: "font-bold text-xs uppercase tracking-widest text-slate-400",
                        errorMessage: "font-bold text-xs uppercase tracking-wider",
                      }}
                      isInvalid={!!errors.recipient_address}
                      errorMessage={errors.recipient_address?.message}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Input 
                        {...register("recipient_email")}
                        label="Email" 
                        type="email" 
                        placeholder="email@penerima.com" 
                        variant="bordered"
                        isRequired
                        classNames={{
                          inputWrapper: "rounded-2xl border-white/40 bg-white/40 focus-within:border-blue-500 transition-colors h-14",
                          label: "font-bold text-xs uppercase tracking-widest text-slate-400",
                          errorMessage: "font-bold text-xs uppercase tracking-wider",
                        }}
                        isInvalid={!!errors.recipient_email}
                        errorMessage={errors.recipient_email?.message}
                      />
                      <Input 
                        {...register("recipient_phone")}
                        label="No. WhatsApp" 
                        type="tel" 
                        placeholder="081234..." 
                        variant="bordered"
                        isRequired
                        classNames={{
                          inputWrapper: "rounded-2xl border-white/40 bg-white/40 focus-within:border-blue-500 transition-colors h-14",
                          label: "font-bold text-xs uppercase tracking-widest text-slate-400",
                          errorMessage: "font-bold text-xs uppercase tracking-wider",
                        }}
                        isInvalid={!!errors.recipient_phone}
                        errorMessage={errors.recipient_phone?.message}
                      />
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* STEP 2: Items & Calculation */}
            {currentStep === 2 && (
              <div className="space-y-8">
                 <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                     <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Daftar Item Tagihan</h2>
                     <div className="h-px w-20 bg-slate-200/50" />
                  </div>
                  <Button size="sm" variant="flat" color="primary" onPress={() => append({ description: "", quantity: 1, unit_price: 0 })} startContent={<Plus size={16} />} className="font-bold rounded-xl">TAMBAH ITEM</Button>
                </div>
                
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <motion.div 
                      key={field.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 md:p-10 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] shadow-sm hover:border-orange-200 transition-all flex flex-col gap-8"
                    >
                      <div className="flex justify-between items-start gap-4">
                          <Input 
                            {...register(`items.${index}.description`)}
                            placeholder="Nama item atau jasa..." 
                            variant="flat"
                            className="flex-1"
                            classNames={{ 
                              inputWrapper: "bg-white/50 border border-white/40 rounded-2xl h-14 px-6 focus-within:border-orange-500",
                              input: "font-semibold text-slate-900",
                              errorMessage: "font-bold text-xs uppercase tracking-wider",
                            }}
                            isInvalid={!!errors.items?.[index]?.description}
                            errorMessage={errors.items?.[index]?.description?.message}
                          />
                        <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => remove(index)} className="rounded-xl w-14 h-14 shrink-0">
                          <Trash size={20} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input 
                          {...register(`items.${index}.quantity`)}
                          type="number" 
                          label="Jumlah (Qty)" 
                          variant="bordered"
                          classNames={{
                            inputWrapper: "rounded-2xl border-white/40 bg-white/40 h-14 focus-within:border-orange-500",
                            label: "font-bold text-xs uppercase tracking-widest text-slate-400",
                            errorMessage: "font-bold text-xs uppercase tracking-wider",
                          }}
                          isInvalid={!!errors.items?.[index]?.quantity}
                          errorMessage={errors.items?.[index]?.quantity?.message}
                        />
                        <Input 
                          {...register(`items.${index}.unit_price`)}
                          type="number" 
                          label="Harga Satuan" 
                          variant="bordered"
                          className="md:col-span-2"
                          startContent={<span className="text-slate-400 font-bold text-sm">Rp</span>}
                          classNames={{
                            inputWrapper: "rounded-2xl border-white/40 bg-white/40 h-14 focus-within:border-orange-500",
                            label: "font-bold text-xs uppercase tracking-widest text-slate-400",
                            errorMessage: "font-bold text-xs uppercase tracking-wider",
                          }}
                          isInvalid={!!errors.items?.[index]?.unit_price}
                          errorMessage={errors.items?.[index]?.unit_price?.message}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Card className="bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden mt-12 rounded-[40px]">
                  <CardBody className="p-10 md:p-12 gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full -mr-20 -mt-20" />
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400">
                          <Wallet2 size={20} />
                        </div>
                        <h3 className="font-semibold text-xl text-white tracking-tight">Ringkasan Biaya</h3>
                      </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-center text-slate-400 font-medium">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Subtotal</span>
                        <span className="font-semibold text-lg text-white">{formatCurrency(subtotal)}</span>
                      </div>

                      {/* Professional Discount/Tax Controls */}
                      <div className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-800">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">DISKON</span>
                          <div className="flex gap-2">
                             <Select 
                              size="sm" className="w-20"
                              placeholder="-"
                              selectedKeys={discountType ? [discountType] : []}
                              onChange={(e) => {
                                setValue("discount_type", e.target.value as "fixed" | "percentage" | "");
                                if (!e.target.value) setValue("discount_value", 0);
                              }}
                              classNames={{ trigger: "bg-slate-800 border-none text-white font-bold rounded-xl h-10" }}
                            >
                              <SelectItem key="fixed">IDR</SelectItem>
                              <SelectItem key="percentage">%</SelectItem>
                            </Select>
                            {discountType && (
                              <Input 
                                {...register("discount_value")}
                                type="number" size="sm" className="w-32"
                                classNames={{ inputWrapper: "bg-slate-800 border-none text-white font-bold h-10 rounded-xl" }}
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 ml-auto">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">PPN {taxEnabled && `(${taxRate}%)`}</span>
                          <div className="flex items-center gap-4">
                             {taxEnabled && (
                              <Input 
                                {...register("tax_rate")}
                                type="number" size="sm" className="w-20"
                                classNames={{ inputWrapper: "bg-slate-800 border-none text-white font-bold h-10 rounded-xl" }}
                              />
                            )}
                            <Switch 
                              size="sm" 
                              isSelected={taxEnabled} 
                              onValueChange={(val) => setValue("tax_enabled", val)} 
                              color="warning" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end pt-4">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-[0.3em]">Total Akhir Tagihan</span>
                          <div className="mt-1">
                             <p className="text-4xl md:text-5xl font-semibold text-orange-500 tracking-tighter leading-none">{formatCurrency(totalAmount)}</p>
                             {taxEnabled && <p className="text-xs text-slate-500 font-semibold mt-2 uppercase tracking-widest">*Sudah termasuk PPN {taxRate}%</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* STEP 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <Card className="bg-emerald-500/10 border border-emerald-500/20 p-8 md:p-12 text-center rounded-[40px] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30 scale-110">
                    <FileCheck size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">Konfirmasi Tagihan</h3>
                  <p className="text-slate-500 text-lg font-medium max-w-sm mx-auto mt-3">Silakan tinjau kembali data tagihan Anda sebelum dikirim.</p>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full -mr-16 -mt-16 group-hover:bg-slate-200 transition-colors" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 relative z-10">Penerima Tagihan</p>
                    <p className="font-bold text-2xl text-slate-900 tracking-tight relative z-10">{recipientName || "-"}</p>
                    <p className="text-slate-500 font-medium mt-2 line-clamp-2 relative z-10">{description}</p>
                  </div>
                  <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 relative z-10">Total Pembayaran</p>
                    <p className="text-3xl font-bold text-orange-500 tracking-tighter relative z-10">{formatCurrency(totalAmount)}</p>
                    <div className="flex items-center gap-2 mt-3 text-slate-400 relative z-10">
                       <Calendar size={14} />
                       <p className="text-xs font-bold uppercase tracking-widest leading-none">Jatuh Tempo: {dueDate || "-"}</p>
                    </div>
                  </div>
                </div>

                 <div className="p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Rincian Item</h4>
                      <div className="h-px flex-1 bg-slate-200/50 ml-4" />
                   </div>
                   <div className="space-y-4">
                      {watchedItems.map((item, i) => (
                        <div key={i} className="flex justify-between items-center group">
                           <div className="flex flex-col">
                              <span className="text-slate-900 font-semibold tracking-tight">{item.description || `Item ${i+1}`}</span>
                              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{item.quantity} x {formatCurrency(item.unit_price)}</span>
                           </div>
                           <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency((item.quantity || 0) * (item.unit_price || 0))}</span>
                        </div>
                      ))}
                      
                      <div className="pt-6 mt-6 border-t border-slate-200/50 space-y-3">
                        {taxEnabled && (
                          <div className="flex justify-between items-center text-slate-500">
                             <span className="text-xs font-bold uppercase tracking-widest">PPN ({taxRate}%)</span>
                             <span className="font-bold tabular-nums">{formatCurrency(taxAmount)}</span>
                          </div>
                        )}
                        {discountAmount > 0 && (
                          <div className="flex justify-between items-center text-rose-500">
                             <span className="text-xs font-bold uppercase tracking-widest">DISKON</span>
                             <span className="font-bold tabular-nums">-{formatCurrency(discountAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2">
                           <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">TOTAL AKHIR</span>
                           <span className="text-2xl font-bold text-slate-900 tabular-nums tracking-tighter">{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                   </div>
                </div>

                {serverError && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-rose-50 text-rose-700 rounded-3xl flex items-center gap-4 border border-rose-100"
                  >
                    <div className="bg-rose-100 p-2 rounded-xl">
                      <AlertCircle size={20} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wide">{serverError}</span>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Controls - Desktop & Tablet */}
        <div className="hidden md:flex justify-between items-center mt-16 pb-12 gap-6 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-slate-200/50 -mt-8" />
          <Button 
            variant="light" 
            onPress={prevStep} 
            isDisabled={currentStep === 1}
            className="font-bold px-10 rounded-2xl h-14 text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest text-xs"
          >
            KEMBALI
          </Button>
          
          <div className="flex gap-4">
             {currentStep < 3 ? (
               <Button 
                 color="primary" 
                 onPress={nextStep} 
                 className="font-bold px-12 rounded-2xl h-14 uppercase tracking-widest text-xs shadow-xl shadow-orange-500/20"
                 endContent={<ChevronRight size={20} />}
               >
                 LANJUTKAN
               </Button>
             ) : (
                <Button 
                  type="submit"
                  color="primary" 
                  className="font-bold px-12 rounded-2xl h-14 shadow-xl shadow-orange-500/20 uppercase tracking-widest text-xs"
                  isLoading={isPending}
                  startContent={!isPending && <Save size={18} />}
                >
                  SIMPAN PENAGIHAN
                </Button>
             )}
          </div>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="md:hidden fixed bottom-[72px] inset-x-0 z-40 bg-white/60 backdrop-blur-2xl border-t border-white/40 p-6 flex items-center justify-between gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
           <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Tagihan</span>
              <span className="text-xl font-bold text-orange-600 leading-none tracking-tighter mt-1">{formatCurrency(totalAmount)}</span>
           </div>
           
           <div className="flex gap-3">
             <Button 
               isIconOnly 
               variant="flat" 
               onPress={prevStep} 
               isDisabled={currentStep === 1}
               className="rounded-2xl h-14 w-14 bg-white/40 border border-white/60 flex items-center justify-center shrink-0"
             >
               <ArrowLeft size={20} className="text-slate-600" />
             </Button>
             
             {currentStep < 3 ? (
               <Button 
                 color="primary" 
                 onPress={nextStep} 
                 className="font-bold px-10 rounded-2xl h-14 shadow-lg shadow-orange-500/20 uppercase tracking-widest text-xs"
                 endContent={<ChevronRight size={18} />}
               >
                 LANJUT
               </Button>
             ) : (
                <Button 
                  type="submit"
                  color="primary" 
                  className="font-bold px-10 rounded-2xl h-14 shadow-lg shadow-orange-500/20 uppercase tracking-widest text-xs"
                  isLoading={isPending}
                >
                  SIMPAN
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
            base: "bg-slate-50 rounded-[40px]",
            header: "border-b border-slate-200/50 p-8",
            body: "p-0",
            footer: "border-t border-slate-200/50 p-8 bg-white/50 backdrop-blur-xl"
          }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-2">
                           <h3 className="text-2xl font-semibold text-slate-900 tracking-tighter">Pratinjau Dokumen</h3>
                           <p className="text-slate-500 text-sm font-medium">Tampilan invoice yang akan diterima oleh pelanggan.</p>
                        </ModalHeader>
                        <ModalBody>
                            <div className="p-8 md:p-12">
                              <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-2xl shadow-slate-200/50 border border-white relative overflow-hidden">
                                  {/* Decorative Element */}
                                  <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32" />
                                  
                                  <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10 mb-20">
                                      <div className="space-y-4">
                                          <div className="inline-flex items-center gap-3 bg-orange-500 text-white px-4 py-1.5 rounded-full ring-4 ring-orange-50">
                                             <ReceiptText size={18} />
                                             <span className="text-xs font-bold uppercase tracking-[0.2em]">INVOICE</span>
                                          </div>
                                          <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-3">
                                              <span className="text-4xl font-bold text-slate-900 tracking-tighter">#DRAFT</span>
                                              <Chip size="sm" variant="flat" color="warning" className="font-bold text-xs uppercase tracking-widest px-3">Belum Disimpan</Chip>
                                            </div>
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">PENYEDIA JASA: ANDA</p>
                                          </div>
                                      </div>
                                      <div className="md:text-right space-y-2">
                                          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Tertuju Kepada</p>
                                          <h3 className="font-bold text-3xl text-slate-900 tracking-tight leading-none">{recipientName || "Nama Penerima"}</h3>
                                          <div className="flex md:justify-end items-center gap-2 text-slate-500 mt-4">
                                             <Calendar size={14} />
                                             <p className="text-xs font-bold uppercase tracking-widest">Tempo: {dueDate || "--/--/----"}</p>
                                          </div>
                                      </div>
                                  </div>
                                  
                                  <div className="overflow-x-auto relative z-10">
                                      <table className="w-full">
                                          <thead>
                                              <tr className="border-b-2 border-slate-100">
                                                  <th className="py-6 text-left font-bold text-slate-400 uppercase text-xs tracking-[0.3em] pb-4">Deskripsi Layanan/Item</th>
                                                  <th className="py-6 text-center font-bold text-slate-400 uppercase text-xs tracking-[0.3em] pb-4 w-24">Qty</th>
                                                  <th className="py-6 text-right font-bold text-slate-400 uppercase text-xs tracking-[0.3em] pb-4 w-40">Harga</th>
                                                  <th className="py-6 text-right font-bold text-slate-400 uppercase text-xs tracking-[0.3em] pb-4 w-48">Total</th>
                                              </tr>
                                          </thead>
                                           <tbody className="divide-y divide-slate-50">
                                               {watchedItems.map((item, i) => (
                                                   <tr key={i} className="group">
                                                       <td className="py-8 font-bold text-slate-900 text-lg tracking-tight">{item.description || "Item Baru..."}</td>
                                                       <td className="py-8 text-center font-bold text-slate-500 uppercase tracking-widest">{item.quantity}</td>
                                                       <td className="py-8 text-right font-bold text-slate-500 tabular-nums">{formatCurrency(item.unit_price)}</td>
                                                       <td className="py-8 text-right font-bold text-slate-900 tabular-nums text-lg">
                                                           {formatCurrency((item.quantity || 0) * (item.unit_price || 0))}
                                                       </td>
                                                   </tr>
                                               ))}
                                           </tbody>
                                      </table>
                                  </div>
  
                                  <div className="mt-16 pt-16 border-t font-bold relative z-10">
                                      <div className="flex flex-col md:flex-row md:justify-between gap-12">
                                          <div className="hidden md:block">
                                             <p className="text-xs text-slate-400 uppercase tracking-[0.3em] mb-4">Catatan Resmi</p>
                                             <p className="text-slate-500 text-sm max-w-xs leading-relaxed font-medium italic">&quot;Terima kasih atas kepercayaan Anda. Pembayaran dapat dilakukan via transfer bank atau metode lain yang tersedia.&quot;</p>
                                          </div>
                                          <div className="space-y-5 flex-grow max-w-sm">
                                              <div className="flex justify-between items-center text-slate-400">
                                                  <span className="uppercase tracking-[0.2em] text-xs">Subtotal Keseluruhan</span>
                                                  <span className="text-slate-900 font-bold tabular-nums">{formatCurrency(subtotal)}</span>
                                              </div>
                                              {discountAmount > 0 && (
                                                  <div className="flex justify-between items-center text-rose-500">
                                                      <span className="uppercase tracking-[0.2em] text-xs">Potongan Diskon</span>
                                                      <span className="font-bold tabular-nums">- {formatCurrency(discountAmount)}</span>
                                                  </div>
                                              )}
                                              {taxEnabled && (
                                                  <div className="flex justify-between items-center text-slate-400">
                                                      <span className="uppercase tracking-[0.2em] text-xs">Pajak PPN ({taxRate}%)</span>
                                                      <span className="text-slate-900 font-bold tabular-nums">{formatCurrency(taxAmount)}</span>
                                                  </div>
                                              )}
                                              <div className="flex justify-between items-end pt-6 border-t-2 border-slate-900">
                                                  <span className="text-slate-900 uppercase tracking-tighter text-xl leading-none mb-1">Total Akhir</span>
                                                  <span className="text-5xl font-bold text-orange-500 tracking-tighter tabular-nums leading-none">
                                                      {formatCurrency(totalAmount)}
                                                  </span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                            </div>
                        </ModalBody>
                        <ModalFooter className="gap-4">
                            <Button color="danger" variant="light" className="font-bold uppercase tracking-widest text-xs" onPress={onClose}>
                                TUTUP
                            </Button>
                             <Button 
                              type="submit"
                              color="primary" 
                              className="font-bold px-10 rounded-2xl h-14 shadow-xl shadow-orange-500/20 uppercase tracking-widest text-xs" 
                              onPress={() => {
                                onClose();
                                handleSubmit(onSubmit)();
                              }}
                              isLoading={isPending}
                            >
                                Simpan Tagihan Sekarang
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
      </form>
    </div>
  );
}


