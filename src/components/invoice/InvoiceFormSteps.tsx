"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface InvoiceFormStepsProps {
  steps: Step[];
  currentStep: number;
}

export function InvoiceFormSteps({ steps, currentStep }: InvoiceFormStepsProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, idx) => {
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div 
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted ? "bg-success text-success-foreground" :
                    isCurrent ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                    "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                </div>
                <div className="text-center hidden sm:block">
                  <p className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 -mt-6 sm:-mt-12">
                  <div className={cn("h-full transition-all duration-500", isCompleted ? "bg-success" : "bg-border")} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
