"use client";

import { ArrowLeft, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceFormActionsProps {
  currentStep: number;
  maxSteps: number;
  isPending: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  submitLabel?: string;
}

export function InvoiceFormActionsDesktop({
  currentStep,
  maxSteps,
  isPending,
  onPrevStep,
  onNextStep,
  submitLabel = "Kirim Invoice"
}: InvoiceFormActionsProps) {
  return (
    <div className="hidden md:flex justify-between items-center pt-6 border-t border-border">
      <Button 
        variant="ghost" 
        type="button"
        onClick={onPrevStep} 
        disabled={currentStep === 1}
      >
        <ArrowLeft size={16} className="mr-2" />
        Kembali
      </Button>
      
      {currentStep < maxSteps ? (
        <Button type="button" onClick={onNextStep}>
          Lanjutkan
          <ChevronRight size={16} className="ml-2" />
        </Button>
      ) : (
        <Button type="submit" isLoading={isPending}>
          <Send size={16} className="mr-2" />
          {submitLabel}
        </Button>
      )}
    </div>
  );
}

interface MobileActionBarProps {
  currentStep: number;
  maxSteps: number;
  isPending: boolean;
  totalAmount: number;
  formatCurrency: (val: number) => string;
  onPrevStep: () => void;
  onNextStep: () => void;
  label?: string;
}

export function MobileActionBar({
  currentStep,
  maxSteps,
  isPending,
  totalAmount,
  formatCurrency,
  onPrevStep,
  onNextStep,
  label = "Total Tagihan"
}: MobileActionBarProps) {
  return (
    <div className="md:hidden fixed bottom-20 inset-x-0 z-50 bg-card border-t border-border p-4 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold text-primary tabular-nums truncate">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {currentStep > 1 && (
            <Button variant="outline" size="icon" type="button" onClick={onPrevStep}>
              <ArrowLeft size={18} />
            </Button>
          )}
          {currentStep < maxSteps ? (
            <Button type="button" onClick={onNextStep} size="default">
              Lanjut
              <ChevronRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button type="submit" isLoading={isPending} size="default">
              Kirim
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
