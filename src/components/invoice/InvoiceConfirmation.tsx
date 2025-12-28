"use client";

import { Sparkles, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface WatchedItem {
  description: string;
  quantity: number;
  unit_price: number;
}

interface InvoiceConfirmationProps {
  recipientName: string;
  recipientEmail?: string;
  description: string;
  dueDate: string;
  watchedItems: WatchedItem[];
  discountAmount: number;
  taxEnabled: boolean;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  serverError: string | null;
  formatCurrency: (val: number) => string;
  formatDate: (dateStr: string) => string;
  type: "penjualan" | "pembayaran";
  supplierBankInfo?: string;
}

export function InvoiceConfirmation({
  recipientName,
  recipientEmail,
  description,
  dueDate,
  watchedItems,
  discountAmount,
  taxEnabled,
  taxRate,
  taxAmount,
  totalAmount,
  serverError,
  formatCurrency,
  formatDate,
  type,
  supplierBankInfo
}: InvoiceConfirmationProps) {
  const dueDateLabel = type === "penjualan" ? "Jatuh Tempo" : "Tanggal Pembayaran";
  const successTitle = type === "penjualan" ? "Siap Dikirim!" : "Siap Dikirim!";
  const successDesc = type === "penjualan" 
    ? "Periksa kembali detail invoice sebelum mengirim" 
    : "Periksa kembali detail pembayaran";

  return (
    <div className="space-y-6">
      <Card className="border-success/30 bg-success/5">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-success text-success-foreground flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-foreground">{successTitle}</h3>
              <p className="text-muted-foreground">{successDesc}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 md:p-8">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
            Ringkasan {type === "penjualan" ? "Invoice" : "Pembayaran"}
          </h4>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Penerima</p>
                <p className="font-semibold text-foreground text-lg">{recipientName || "-"}</p>
                {recipientEmail && <p className="text-sm text-muted-foreground">{recipientEmail}</p>}
                {supplierBankInfo && <p className="text-sm text-muted-foreground mt-1">{supplierBankInfo}</p>}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{dueDateLabel}</p>
                <p className="font-semibold text-foreground text-lg">{formatDate(dueDate)}</p>
              </div>
            </div>

            <Separator />
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Deskripsi</p>
              <p className="text-foreground">{description || "-"}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Rincian Item</p>
              <div className="space-y-3">
                {watchedItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <div>
                      <p className="font-medium text-foreground">{item.description || `Item ${i + 1}`}</p>
                      <p className="text-sm text-muted-foreground">{item.quantity} x {formatCurrency(item.unit_price)}</p>
                    </div>
                    <span className="font-semibold text-foreground tabular-nums">
                      {formatCurrency((item.quantity || 0) * (item.unit_price || 0))}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-4 border-t border-border space-y-2">
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-destructive">
                    <span>Diskon</span>
                    <span className="tabular-nums">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                {taxEnabled && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>PPN ({taxRate}%)</span>
                    <span className="tabular-nums">{formatCurrency(taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary tabular-nums">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {serverError && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-3 border border-destructive/20">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{serverError}</span>
        </div>
      )}
    </div>
  );
}
