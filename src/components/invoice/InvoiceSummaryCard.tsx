"use client";

import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface InvoiceSummaryCardProps {
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  taxEnabled: boolean;
  taxRate: number;
  taxAmount: number;
  recipientName: string;
  dueDate: string;
  formatCurrency: (val: number) => string;
  formatDate: (dateStr: string) => string;
  type: "penjualan" | "pembayaran";
}

export function InvoiceSummaryCard({
  totalAmount,
  subtotal,
  discountAmount,
  taxEnabled,
  taxRate,
  taxAmount,
  recipientName,
  dueDate,
  formatCurrency,
  formatDate,
  type
}: InvoiceSummaryCardProps) {
  const label = type === "penjualan" ? "Total Tagihan" : "Total Pembayaran";
  const dueDateLabel = type === "penjualan" ? "Jatuh tempo" : "Bayar";

  return (
    <div className="sticky top-24">
      <Card className="bg-foreground text-background overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <div className="relative z-10">
            <p className="text-xs font-medium opacity-60 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-4xl font-bold text-primary tracking-tight tabular-nums mb-6">
              {formatCurrency(totalAmount)}
            </p>

            <Separator className="bg-background/20 mb-6" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="opacity-60">Subtotal</span>
                <span className="tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>Diskon</span>
                  <span className="tabular-nums">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              {taxEnabled && (
                <div className="flex justify-between">
                  <span className="opacity-60">PPN ({taxRate}%)</span>
                  <span className="tabular-nums">{formatCurrency(taxAmount)}</span>
                </div>
              )}
            </div>

            {recipientName && (
              <>
                <Separator className="bg-background/20 my-6" />
                <div>
                  <p className="text-xs font-medium opacity-60 uppercase tracking-wide mb-2">Penerima</p>
                  <p className="font-medium">{recipientName}</p>
                  {dueDate && (
                    <p className="text-xs opacity-60 mt-1">{dueDateLabel}: {formatDate(dueDate)}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check size={16} className="text-success" />
          <span>
            {type === "penjualan" 
              ? "Invoice akan dikirim via email" 
              : "Pembayaran akan dicatat ke sistem"
            }
          </span>
        </div>
      </div>
    </div>
  );
}
