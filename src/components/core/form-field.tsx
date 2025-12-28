import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
    
    return (
      <div className="space-y-2">
        <Label 
          htmlFor={fieldId}
          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          {label}
        </Label>
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true">
              {icon}
            </div>
          )}
          <Input
            ref={ref}
            id={fieldId}
            className={cn(
              "h-14 rounded-xl bg-background border border-input",
              "focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10",
              icon && "pl-12",
              error && "border-destructive focus-visible:ring-destructive/10",
              className
            )}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p 
            id={`${fieldId}-error`} 
            className="text-xs font-semibold text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export { FormField };
