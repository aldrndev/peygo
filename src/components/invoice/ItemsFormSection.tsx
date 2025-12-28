"use client";

import { Plus, Trash2, Package } from "lucide-react";
import { FieldArrayWithId, FieldError } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface WatchedItem {
  description: string;
  quantity: number;
  unit_price: number;
}

interface ItemError {
  description?: FieldError;
  quantity?: FieldError;
  unit_price?: FieldError;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ItemsFormSectionProps {
  register: any;
  itemErrors: ItemError[];
  fields: FieldArrayWithId<any, "items", "id">[];
  append: (value: { description: string; quantity: number; unit_price: number }) => void;
  remove: (index: number) => void;
  watchedItems: WatchedItem[];
  formatCurrency: (val: number) => string;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function ItemsFormSection({ 
  register, 
  itemErrors, 
  fields, 
  append, 
  remove, 
  watchedItems,
  formatCurrency 
}: ItemsFormSectionProps) {
  return (
    <Card>
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Package size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Daftar Item</h3>
              <p className="text-sm text-muted-foreground">Tambahkan produk atau jasa yang ditagihkan</p>
            </div>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => append({ description: "", quantity: 1, unit_price: 0 })}
          >
            <Plus size={16} className="mr-2" />
            Tambah
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => {
            const err = itemErrors[index];
            return (
              <div key={field.id} className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Deskripsi Item</Label>
                      <Input 
                        {...register(`items.${index}.description`)}
                        placeholder="Nama produk atau jasa"
                        className={cn(err?.description && "border-destructive")}
                      />
                      {err?.description && (
                        <p className="text-xs text-destructive">{err.description.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Jumlah</Label>
                        <Input 
                          {...register(`items.${index}.quantity`)}
                          type="number" 
                          min="1"
                          placeholder="1"
                          className={cn(err?.quantity && "border-destructive")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Harga Satuan</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                          <Input 
                            {...register(`items.${index}.unit_price`)}
                            type="number"
                            min="0"
                            placeholder="0"
                            className={cn("pl-10", err?.unit_price && "border-destructive")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {fields.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:text-destructive shrink-0 mt-6"
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Subtotal Item</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {formatCurrency((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unit_price || 0))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
