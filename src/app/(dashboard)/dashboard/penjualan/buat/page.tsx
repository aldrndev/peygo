"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Package, Send } from "lucide-react";
import Link from "next/link";
import { useForm, useFieldArray, useWatch, type Path, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateInvoice } from "@/hooks/mutations/use-invoice-mutations";
import { invoiceSchema } from "@/app/(dashboard)/dashboard/invoice/schema";
import { Button } from "@/components/ui/button";
import { InvoiceFormSteps } from "@/components/invoice/InvoiceFormSteps";
import { RecipientFormSection } from "@/components/invoice/RecipientFormSection";
import { ItemsFormSection } from "@/components/invoice/ItemsFormSection";
import { PricingFormSection } from "@/components/invoice/PricingFormSection";
import { InvoiceSummaryCard } from "@/components/invoice/InvoiceSummaryCard";
import { InvoiceConfirmation } from "@/components/invoice/InvoiceConfirmation";
import { InvoiceFormActionsDesktop, MobileActionBar } from "@/components/invoice/InvoiceFormActions";

type InvoiceSchema = z.infer<typeof invoiceSchema>;
type Step = 1 | 2 | 3;

const STEPS = [
  { id: 1, title: "Penerima", description: "Data pelanggan", icon: User },
  { id: 2, title: "Item & Biaya", description: "Rincian tagihan", icon: Package },
  { id: 3, title: "Konfirmasi", description: "Tinjau & kirim", icon: Send },
];

export default function CreatePenjualanPage() {
  const router = useRouter();
  const createInvoiceMutation = useCreateInvoice();
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
      items: [{ description: "", quantity: undefined as unknown as number, unit_price: undefined as unknown as number }],
      tax_enabled: false,
      tax_rate: 11,
      discount_type: "",
      discount_value: undefined as unknown as number,
      recipient_name: "",
      recipient_email: "",
      recipient_phone: "",
      recipient_address: "",
      description: "",
      due_date: "",
      amount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const watchedItems = useWatch({ control, name: "items", defaultValue: [] });
  const taxEnabled = useWatch({ control, name: "tax_enabled", defaultValue: false });
  const taxRate = useWatch({ control, name: "tax_rate", defaultValue: 11 }) || 11;
  const discountType = useWatch({ control, name: "discount_type", defaultValue: "" });
  const discountValue = useWatch({ control, name: "discount_value", defaultValue: 0 }) || 0;
  const recipientName = useWatch({ control, name: "recipient_name", defaultValue: "" });
  const recipientEmail = useWatch({ control, name: "recipient_email", defaultValue: "" });
  const description = useWatch({ control, name: "description", defaultValue: "" });
  const dueDate = useWatch({ control, name: "due_date", defaultValue: "" });

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
    setServerError(null);

    // Prepare data for mutation (numbers need to be actual numbers, not strings)
    const mutationData = {
      type: data.type as "BILLING" | "PAYMENT_REQUEST",
      recipient_name: data.recipient_name,
      recipient_email: data.recipient_email || "",
      recipient_phone: data.recipient_phone,
      recipient_address: data.recipient_address || "",
      description: data.description,
      amount: totalAmount,
      items: data.items.map(item => ({
        description: item.description,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
      })),
      discount_type: data.discount_type || "",
      discount_value: Number(data.discount_value) || 0,
      tax_enabled: data.tax_enabled || false,
      tax_rate: Number(data.tax_rate) || 11,
      due_date: data.due_date,
    };

    createInvoiceMutation.mutate(mutationData, {
      onSuccess: (result) => {
        if (result.success && result.data) {
          // Redirect to invoice detail
          router.push(`/dashboard/invoice/${result.data.id}`);
        } else {
          setServerError(result.error || "Gagal membuat invoice");
        }
      },
      onError: () => {
        setServerError("Terjadi kesalahan. Silakan coba lagi.");
      },
    });
  };

  const nextStep = async () => {
    alert("NEXT STEP CALLED - currentStep: " + currentStep);
    setServerError(null);
    
    if (currentStep === 1) {
      // Step 1: Validate recipient & basic info
      const fieldsToValidate: Path<InvoiceSchema>[] = ["recipient_name", "recipient_phone", "due_date", "description"];
      const isValid = await trigger(fieldsToValidate);
      console.log("Step 1 validation:", isValid);
      if (isValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      // Step 2: Validate items with stricter rules
      const itemsValid = await trigger("items");
      console.log("Step 2 items validation:", itemsValid);
      
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
          setServerError("Total tagihan minimal Rp 10.000");
          return;
        }
        
        console.log("Moving to step 3 (preview only, no submit)");
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

  // Type-safe register wrapper for components
  const formRegister = register as unknown as Parameters<typeof RecipientFormSection>[0]["register"];
  const formErrors = errors as unknown as Parameters<typeof RecipientFormSection>[0]["errors"];
  const itemErrors = (errors.items || []) as Parameters<typeof ItemsFormSection>[0]["itemErrors"];
  const pricingRegister = register as unknown as Parameters<typeof PricingFormSection>[0]["register"];
  const pricingSetValue = setValue as unknown as Parameters<typeof PricingFormSection>[0]["setValue"];

  return (
    <div className="min-h-screen pb-32 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/penjualan">
            <ArrowLeft size={20} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">Buat Invoice Penjualan</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Buat tagihan profesional untuk pelanggan Anda</p>
        </div>
      </div>

      <InvoiceFormSteps steps={STEPS} currentStep={currentStep} />

      <form 
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          // Prevent Enter key from submitting the form
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" {...register("type")} />
        <input type="hidden" {...register("amount")} />
        <input type="hidden" {...register("tax_rate")} />
        <input type="hidden" {...register("tax_enabled")} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <RecipientFormSection register={formRegister} errors={formErrors} />
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
                recipientEmail={recipientEmail}
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
                type="penjualan"
              />
            )}

            <InvoiceFormActionsDesktop
              currentStep={currentStep}
              maxSteps={3}
              isPending={createInvoiceMutation.isPending}
              onPrevStep={prevStep}
              onNextStep={nextStep}
              onSubmit={handleSubmit(onSubmit)}
              submitLabel="Simpan Invoice"
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
              type="penjualan"
            />
          </div>
        </div>

        <MobileActionBar
          currentStep={currentStep}
          maxSteps={3}
          isPending={createInvoiceMutation.isPending}
          totalAmount={totalAmount}
          formatCurrency={formatCurrency}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onSubmit={handleSubmit(onSubmit)}
          label="Total Tagihan"
        />
      </form>
    </div>
  );
}
