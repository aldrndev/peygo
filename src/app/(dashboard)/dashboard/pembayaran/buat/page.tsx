"use client";

import { useState, startTransition, useMemo, useEffect } from "react";
import { ArrowLeft, Building2, Package, Send } from "lucide-react";
import Link from "next/link";
import { useForm, useFieldArray, useWatch, type Path, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createInvoice } from "@/app/(dashboard)/dashboard/invoice/actions";
import { invoiceSchema } from "@/app/(dashboard)/dashboard/invoice/schema";
import { getSuppliers } from "@/app/(dashboard)/dashboard/supplier/actions";
import { Supplier } from "@/types/database";
import { Button } from "@/components/ui/button";
import { InvoiceFormSteps } from "@/components/invoice/InvoiceFormSteps";
import { SupplierFormSection } from "@/components/invoice/SupplierFormSection";
import { ItemsFormSection } from "@/components/invoice/ItemsFormSection";
import { PricingFormSection } from "@/components/invoice/PricingFormSection";
import { InvoiceSummaryCard } from "@/components/invoice/InvoiceSummaryCard";
import { InvoiceConfirmation } from "@/components/invoice/InvoiceConfirmation";
import { InvoiceFormActionsDesktop, MobileActionBar } from "@/components/invoice/InvoiceFormActions";

type InvoiceSchema = z.infer<typeof invoiceSchema>;
type Step = 1 | 2 | 3;

const STEPS = [
  { id: 1, title: "Supplier", description: "Pilih penerima", icon: Building2 },
  { id: 2, title: "Item & Biaya", description: "Rincian pembayaran", icon: Package },
  { id: 3, title: "Konfirmasi", description: "Tinjau & simpan", icon: Send },
];

export default function CreatePembayaranPage() {
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
      items: [{ description: "", quantity: undefined as unknown as number, unit_price: undefined as unknown as number }],
      tax_enabled: false,
      tax_rate: 11,
      discount_type: "",
      discount_value: undefined as unknown as number,
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
      supplier_id: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const watchedItems = useWatch({ control, name: "items", defaultValue: [] });
  const taxEnabled = useWatch({ control, name: "tax_enabled", defaultValue: false });
  const taxRate = useWatch({ control, name: "tax_rate", defaultValue: 11 }) || 11;
  const discountType = useWatch({ control, name: "discount_type", defaultValue: "" });
  const discountValue = useWatch({ control, name: "discount_value", defaultValue: 0 }) || 0;
  const recipientName = useWatch({ control, name: "recipient_name", defaultValue: "" });
  const description = useWatch({ control, name: "description", defaultValue: "" });
  const dueDate = useWatch({ control, name: "due_date", defaultValue: "" });
  const selectedSupplierId = useWatch({ control, name: "supplier_id", defaultValue: "" });

  const selectedSupplier = useMemo(() => 
    suppliers.find(s => s.id === selectedSupplierId), 
    [suppliers, selectedSupplierId]
  );

  const handleSupplierChange = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      setValue("supplier_id", supplierId);
      setValue("recipient_name", supplier.name);
      setValue("recipient_email", supplier.email || "");
      setValue("recipient_phone", supplier.phone || "");
      setValue("recipient_address", supplier.address || "");
      setValue("recipient_bank_name", supplier.bank_name || "");
      setValue("recipient_bank_account_number", supplier.bank_account_number || "");
      setValue("recipient_bank_account_name", supplier.bank_account_name || "");
    }
  };

  const subtotal = useMemo(() => 
    watchedItems.reduce((acc, item) => acc + ((item?.quantity || 0) * (item?.unit_price || 0)), 0), 
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

  useEffect(() => {
    setValue("amount", totalAmount);
  }, [totalAmount, setValue]);

  const onSubmit = async (data: InvoiceSchema) => {
    // GUARD: Only submit if user is on step 3 (confirmation)
    if (currentStep !== 3) {
      return;
    }
    
    setIsPending(true);
    setServerError(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "items") {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null && value !== "") {
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
    setServerError(null);
    
    if (currentStep === 1) {
      // Step 1: Validate supplier & basic info
      const fieldsToValidate: Path<InvoiceSchema>[] = ["recipient_name", "due_date", "description"];
      const isValid = await trigger(fieldsToValidate);
      if (isValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      // Step 2: Validate items with stricter rules
      const itemsValid = await trigger("items");
      
      if (itemsValid) {
        // Additional validation: check each item has valid price
        const hasInvalidItems = watchedItems.some(
          item => !item.description || !item.quantity || item.quantity < 1 || !item.unit_price || item.unit_price < 1
        );
        
        if (hasInvalidItems) {
          setServerError("Pastikan semua item memiliki deskripsi, jumlah (min 1), dan harga satuan (min Rp 1)");
          return;
        }
        
        // Validate total amount
        if (totalAmount < 10000) {
          setServerError("Total pembayaran minimal Rp 10.000");
          return;
        }
        
        setCurrentStep(3);
      }
    }
  };

  const prevStep = () => currentStep > 1 && setCurrentStep((s) => (s - 1) as Step);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  // Type-safe wrappers
  const supplierRegister = register as unknown as Parameters<typeof SupplierFormSection>[0]["register"];
  const supplierErrors = errors as unknown as Parameters<typeof SupplierFormSection>[0]["errors"];
  const supplierSetValue = setValue as unknown as Parameters<typeof SupplierFormSection>[0]["setValue"];
  const itemErrors = (errors.items || []) as Parameters<typeof ItemsFormSection>[0]["itemErrors"];
  const pricingRegister = register as unknown as Parameters<typeof PricingFormSection>[0]["register"];
  const pricingSetValue = setValue as unknown as Parameters<typeof PricingFormSection>[0]["setValue"];

  const supplierBankInfo = selectedSupplier?.bank_name 
    ? `${selectedSupplier.bank_name} - ${selectedSupplier.bank_account_number}`
    : undefined;

  return (
    <div className="min-h-screen pb-32 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/pembayaran">
            <ArrowLeft size={20} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">Buat Pembayaran</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Catat pengeluaran atau pembayaran ke supplier Anda</p>
        </div>
      </div>

      <InvoiceFormSteps steps={STEPS} currentStep={currentStep} />

      <form 
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          // Prevent Enter key from submitting the form (except on submit button)
          if (e.key === "Enter" && e.target instanceof HTMLElement && e.target.tagName !== "BUTTON") {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" {...register("type")} />
        <input type="hidden" {...register("amount")} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <SupplierFormSection
                register={supplierRegister}
                errors={supplierErrors}
                setValue={supplierSetValue}
                suppliers={suppliers}
                selectedSupplierId={selectedSupplierId || ""}
                selectedSupplier={selectedSupplier}
                onSupplierChange={handleSupplierChange}
              />
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <ItemsFormSection
                  register={register}
                  itemErrors={itemErrors}
                  fields={fields}
                  append={append}
                  remove={remove}
                  watchedItems={watchedItems}
                  formatCurrency={formatCurrency}
                />
                <PricingFormSection
                  register={pricingRegister}
                  setValue={pricingSetValue}
                  discountType={discountType || ""}
                  taxEnabled={taxEnabled}
                />
                {serverError && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-3 border border-destructive/20">
                    <span className="text-sm font-medium">{serverError}</span>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <InvoiceConfirmation
                recipientName={recipientName}
                description={description}
                dueDate={dueDate}
                watchedItems={watchedItems}
                discountAmount={discountAmount}
                taxEnabled={taxEnabled}
                taxRate={taxRate}
                taxAmount={taxAmount}
                totalAmount={totalAmount}
                serverError={serverError}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                type="pembayaran"
                supplierBankInfo={supplierBankInfo}
              />
            )}

            <InvoiceFormActionsDesktop
              currentStep={currentStep}
              maxSteps={3}
              isPending={isPending}
              onPrevStep={prevStep}
              onNextStep={nextStep}
              submitLabel="Catat Pembayaran"
            />
          </div>

          <div className="hidden lg:block">
            <InvoiceSummaryCard
              totalAmount={totalAmount}
              subtotal={subtotal}
              discountAmount={discountAmount}
              taxEnabled={taxEnabled}
              taxRate={taxRate}
              taxAmount={taxAmount}
              recipientName={recipientName}
              dueDate={dueDate}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              type="pembayaran"
            />
          </div>
        </div>

        <MobileActionBar
          currentStep={currentStep}
          maxSteps={3}
          isPending={isPending}
          totalAmount={totalAmount}
          formatCurrency={formatCurrency}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          label="Total Pembayaran"
        />
      </form>
    </div>
  );
}
