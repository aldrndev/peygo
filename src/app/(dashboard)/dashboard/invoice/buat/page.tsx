"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Plus, Trash, ArrowLeft, AlertCircle } from "lucide-react";
import { createInvoice } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const initialState = {
  error: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full sm:w-auto" isLoading={pending}>
      {pending ? "Menyimpan..." : "Simpan Invoice"}
    </Button>
  );
}

export default function CreateInvoicePage() {
  const [state, formAction] = useActionState(createInvoice, initialState);
  const [items, setItems] = useState([
    { description: "", quantity: 1, unit_price: 0 }
  ]);
  const [type, setType] = useState("BILLING");

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  type ItemField = keyof typeof items[0];

  const updateItem = (index: number, field: ItemField, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild className="h-9 w-9">
          <Link href="/dashboard/invoice">
            <ArrowLeft size={20} />
          </Link>
        </Button>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Buat Invoice Baru</h1>
      </div>

      <form action={formAction}>
        <div className="space-y-4 md:space-y-6">
          {/* Main Info */}
          <Card>
            <CardContent className="gap-4 p-4 md:p-6 space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-foreground">Informasi Dasar</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Invoice *</Label>
                  <Select name="type" defaultValue="BILLING" onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BILLING">Penagihan (Billing)</SelectItem>
                      <SelectItem value="PAYMENT_REQUEST">Permintaan Pembayaran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due_date">Jatuh Tempo</Label>
                  <Input type="date" id="due_date" name="due_date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Catatan / Deskripsi</Label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Contoh: Pembayaran Jasa Desain UI/UX"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recipient */}
          <Card>
            <CardContent className="gap-4 p-4 md:p-6 space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-foreground">Penerima Tagihan</h3>
              
              <div className="space-y-2">
                <Label htmlFor="recipient_name">Nama Penerima *</Label>
                <Input 
                  id="recipient_name"
                  name="recipient_name"
                  placeholder="Nama Perusahaan / Individu"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient_email">Email Penerima</Label>
                  <Input 
                    id="recipient_email"
                    name="recipient_email"
                    type="email"
                    placeholder="email@contoh.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient_phone">No. WhatsApp</Label>
                  <Input 
                    id="recipient_phone"
                    name="recipient_phone"
                    type="tel"
                    placeholder="08123456789"
                  />
                </div>
              </div>
              
              {type === "PAYMENT_REQUEST" && (
                <>
                  <Separator className="my-2" />
                  <p className="text-sm font-semibold text-primary">Rekening Tujuan Pencairan</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient_bank_name">Nama Bank</Label>
                      <Input id="recipient_bank_name" name="recipient_bank_name" placeholder="BCA / Mandiri" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipient_bank_account_number">No. Rekening</Label>
                      <Input id="recipient_bank_account_number" name="recipient_bank_account_number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipient_bank_account_name">Atas Nama</Label>
                      <Input id="recipient_bank_account_name" name="recipient_bank_account_name" />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardContent className="gap-4 p-4 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-base md:text-lg font-semibold text-foreground">Item Tagihan</h3>
                <Button type="button" size="sm" variant="secondary" onClick={addItem}>
                  <Plus size={16} className="mr-2" />
                  Tambah Item
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="p-4 bg-muted rounded-xl space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <Label>Deskripsi Item *</Label>
                        <Input 
                          placeholder="Deskripsi Item" 
                          value={item.description}
                          onChange={(e) => updateItem(index, "description", e.target.value)}
                          required
                        />
                      </div>
                      {items.length > 1 && (
                        <Button 
                          type="button"
                          size="icon" 
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10 shrink-0 mt-6"
                          onClick={() => removeItem(index)}
                        >
                          <Trash size={18} />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Qty</Label>
                        <Input 
                          type="number" 
                          value={item.quantity.toString()}
                          onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Harga (Rp)</Label>
                        <Input 
                          type="number" 
                          value={item.unit_price.toString()}
                          onChange={(e) => updateItem(index, "unit_price", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">Subtotal: </span>
                      <span className="font-bold text-primary tabular-nums">
                        Rp {(item.quantity * item.unit_price).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-2" />
              
              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-bold text-foreground">Total Tagihan</span>
                <span className="text-2xl md:text-3xl font-bold text-primary tabular-nums">
                    Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
              
              <input type="hidden" name="items" value={JSON.stringify(items)} />
              <input type="hidden" name="amount" value={totalAmount} />
            </CardContent>
          </Card>

          {/* Error Message */}
          {state?.error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0" />
              <span className="text-sm">{state.error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/dashboard/invoice">Batal</Link>
            </Button>
            <SubmitButton />
          </div>
        </div>
      </form>
    </div>
  );
}
