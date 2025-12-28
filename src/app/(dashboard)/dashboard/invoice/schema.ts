import { z } from "zod";

// Phone regex: only digits, 8-15 chars
const phoneRegex = /^[0-9]{8,15}$/;

export const invoiceSchema = z.object({
  type: z.enum(["BILLING", "PAYMENT_REQUEST"], { 
    message: "Tipe invoice tidak valid"
  }),
  recipient_name: z.string().min(1, "Nama penerima wajib diisi"),
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  recipient_email: z.string().email({ message: "Format email tidak valid" }).optional().or(z.literal("")),
  recipient_phone: z.string()
    .min(1, "Nomor telepon wajib diisi")
    .regex(phoneRegex, "Nomor telepon harus 8-15 digit angka"),
  recipient_address: z.string().optional().or(z.literal("")),
  
  // Payment Request specific
  recipient_bank_name: z.string().optional().or(z.literal("")),
  recipient_bank_account_number: z.string().optional().or(z.literal("")),
  recipient_bank_account_name: z.string().optional().or(z.literal("")),
  supplier_id: z.string().optional().nullable().or(z.literal("")),

  description: z.string().min(1, "Deskripsi wajib diisi"),
  
  // Financials - Stricter validation
  amount: z.coerce.number().min(0),
  items: z.array(z.object({
    description: z.string().min(1, "Deskripsi item wajib diisi"),
    quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
    unit_price: z.coerce.number().min(1, "Harga satuan minimal Rp 1"),
  })).min(1, "Minimal satu item diperlukan"),

  // Tax & Discount
  discount_type: z.string().optional().nullable().or(z.literal("")),
  discount_value: z.coerce.number().min(0, "Diskon tidak boleh negatif").optional().default(0),
  tax_enabled: z.preprocess((val) => val === true || val === "true", z.boolean().optional().default(false)),
  tax_rate: z.coerce.number().min(0).max(100, "Rate pajak maksimal 100%").optional().default(11),
  due_date: z.string().min(1, "Tanggal jatuh tempo wajib diisi"),
});

// Schema for step-by-step validation - Step 1 Penjualan (Sales)
export const step1SchemaSales = z.object({
  recipient_name: z.string().min(1, "Nama penerima wajib diisi"),
  recipient_phone: z.string()
    .min(1, "Nomor telepon wajib diisi")
    .regex(phoneRegex, "Nomor telepon harus 8-15 digit angka"),
  due_date: z.string().min(1, "Tanggal jatuh tempo wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
});

// Schema for step-by-step validation - Step 1 Pembayaran (Payment)
export const step1SchemaPayment = z.object({
  recipient_name: z.string().min(1, "Nama penerima wajib diisi"),
  due_date: z.string().min(1, "Tanggal pembayaran wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
});

// Schema for step 2 validation - Items
export const step2Schema = z.object({
  items: z.array(z.object({
    description: z.string().min(1, "Deskripsi item wajib diisi"),
    quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
    unit_price: z.coerce.number().min(1, "Harga satuan harus lebih dari Rp 0"),
  })).min(1, "Minimal satu item diperlukan"),
});
