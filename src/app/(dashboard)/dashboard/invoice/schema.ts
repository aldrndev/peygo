import { z } from "zod";

export const invoiceSchema = z.object({
  type: z.enum(["BILLING", "PAYMENT_REQUEST"], { 
    message: "Tipe invoice tidak valid"
  }),
  recipient_name: z.string().min(1, "Nama penerima wajib diisi"),
  recipient_email: z.email({ message: "Format email tidak valid" }),
  recipient_phone: z.string().min(1, "Nomor telepon wajib diisi"),
  recipient_address: z.string().optional().or(z.literal("")),
  
  // Payment Request specific
  recipient_bank_name: z.string().optional().or(z.literal("")),
  recipient_bank_account_number: z.string().optional().or(z.literal("")),
  recipient_bank_account_name: z.string().optional().or(z.literal("")),
  supplier_id: z.string().optional().nullable(),

  description: z.string().min(1, "Deskripsi wajib diisi"),
  
  // Financials
  amount: z.coerce.number(),
  items: z.array(z.object({
    description: z.string().min(1, "Deskripsi item wajib diisi"),
    quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
    unit_price: z.coerce.number().min(1, "Harga minimal Rp 1"),
  })).min(1, "Minimal satu item diperlukan"),

  // Tax & Discount
  discount_type: z.enum(["percentage", "fixed", ""]).optional().nullable(),
  discount_value: z.coerce.number().optional(),
  tax_enabled: z.coerce.boolean().optional(),
  tax_rate: z.coerce.number().optional(),
  due_date: z.string().min(1, "Tanggal jatuh tempo wajib diisi"),
});
