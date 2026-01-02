import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

// Invoice schema for client-side validation
export const invoiceSchema = z.object({
  type: z.enum(["BILLING", "PAYMENT_REQUEST"]),
  recipient_name: z.string().min(1, "Nama penerima wajib diisi"),
  recipient_email: z.email({ message: "Format email tidak valid" }),
  recipient_phone: z.string().min(1, "Nomor telepon wajib diisi"),
  recipient_address: z.string().optional().or(z.literal("")),
  recipient_bank_name: z.string().optional().nullable(),
  recipient_bank_account_number: z.string().optional().nullable(),
  recipient_bank_account_name: z.string().optional().nullable(),
  supplier_id: z.string().optional().nullable(),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  amount: z.number().min(0),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().min(1),
    unit_price: z.number().min(1),
  })).min(1),
  discount_type: z.string().optional().nullable().or(z.literal("")),
  discount_value: z.number().min(0).optional().default(0),
  tax_enabled: z.boolean().optional().default(false),
  tax_rate: z.number().min(0).max(100).optional().default(11),
  due_date: z.string().min(1, "Tanggal jatuh tempo wajib diisi"),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

export interface MutationResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface CreatedInvoice {
  id: string;
  invoice_number: string;
}

/**
 * Create a new invoice (BILLING or PAYMENT_REQUEST)
 */
export async function createInvoiceMutation(input: InvoiceInput): Promise<MutationResult<CreatedInvoice>> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tidak terautentikasi" };
  }

  const validated = invoiceSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || "Data tidak valid" };
  }

  const data = validated.data;

  // Calculate financials
  const subtotal = data.items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);

  let discountAmount = 0;
  if (data.discount_type === "percentage" && data.discount_value) {
    discountAmount = (subtotal * data.discount_value) / 100;
  } else if (data.discount_type === "fixed" && data.discount_value) {
    discountAmount = data.discount_value;
  }

  const taxRate = data.tax_rate || 11;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = data.tax_enabled ? (taxableAmount * taxRate) / 100 : 0;
  const finalAmount = Math.max(0, taxableAmount + taxAmount);

  if (finalAmount < 10000) {
    return { success: false, error: "Total tagihan minimal Rp 10.000" };
  }

  const platformFee = 0;

  // Create invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      invoice_number: `INV-${Date.now()}`,
      type: data.type,
      status: "DRAFT",
      recipient_name: data.recipient_name,
      recipient_email: data.recipient_email || null,
      recipient_phone: data.recipient_phone || null,
      recipient_address: data.recipient_address || null,
      recipient_bank_name: data.recipient_bank_name || null,
      recipient_bank_account_number: data.recipient_bank_account_number || null,
      recipient_bank_account_name: data.recipient_bank_account_name || null,
      supplier_id: data.supplier_id || null,
      description: data.description || null,
      subtotal,
      discount_type: data.discount_type || null,
      discount_value: data.discount_value || 0,
      tax_enabled: data.tax_enabled || false,
      tax_rate: data.tax_enabled ? taxRate : 0,
      tax_amount: taxAmount,
      amount: finalAmount,
      platform_fee: platformFee,
      total_amount: finalAmount + platformFee,
      due_date: data.due_date || null,
    })
    .select("id, invoice_number")
    .single();

  if (invoiceError) {
    return { success: false, error: invoiceError.message };
  }

  // Create invoice items
  const invoiceItems = data.items.map(item => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.quantity * item.unit_price,
  }));

  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(invoiceItems);

  if (itemsError) {
    await supabase.from("invoices").delete().eq("id", invoice.id);
    return { success: false, error: itemsError.message };
  }

  // Note: Audit logging handled by server action version in dashboard/invoice/actions.ts

  return { 
    success: true, 
    data: { id: invoice.id, invoice_number: invoice.invoice_number } 
  };
}

/**
 * Send an invoice (change status to SENT and generate payment link)
 */
export async function sendInvoiceMutation(id: string): Promise<MutationResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tidak terautentikasi" };
  }

  // Check ownership
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!invoice) {
    return { success: false, error: "Invoice tidak ditemukan" };
  }

  if (invoice.is_archived) {
    return { success: false, error: "Invoice sudah diarsipkan" };
  }

  // Update status
  const { error } = await supabase
    .from("invoices")
    .update({ 
      status: "SENT", 
      sent_at: new Date().toISOString() 
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Delete an invoice
 */
export async function deleteInvoiceMutation(id: string): Promise<MutationResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tidak terautentikasi" };
  }

  // Check ownership
  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, status")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!invoice) {
    return { success: false, error: "Invoice tidak ditemukan" };
  }

  if (invoice.status !== "DRAFT") {
    return { success: false, error: "Hanya invoice DRAFT yang dapat dihapus" };
  }

  // Delete items first
  await supabase.from("invoice_items").delete().eq("invoice_id", id);

  // Delete invoice
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
