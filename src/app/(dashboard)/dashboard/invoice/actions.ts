"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js"; // Direct admin client
import { Invoice } from "@/types/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { invoiceSchema } from "./schema";

// Helper to get service role client
function getServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createAdminClient(supabaseUrl, supabaseServiceKey);
}

export async function createInvoice(prevState: { error: string } | null, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Parse items from form data (expecting JSON string for items)
  let items = [];
  try {
    items = JSON.parse(formData.get("items") as string || "[]");
  } catch {
    return { error: "Format data item tidak valid" };
  }

  const rawData = {
    type: formData.get("type"),
    recipient_name: formData.get("recipient_name"),
    recipient_email: formData.get("recipient_email"),
    recipient_phone: formData.get("recipient_phone"),
    recipient_address: formData.get("recipient_address"),
    
    recipient_bank_name: formData.get("recipient_bank_name"),
    recipient_bank_account_number: formData.get("recipient_bank_account_number"),
    recipient_bank_account_name: formData.get("recipient_bank_account_name"),
    supplier_id: formData.get("supplier_id") || null,
    
    description: formData.get("description"),
    amount: formData.get("amount"),
    items: items,
    
    discount_type: formData.get("discount_type") || null,
    discount_value: formData.get("discount_value") || 0,
    tax_enabled: formData.get("tax_enabled") === "true",
    due_date: formData.get("due_date"),
  };

  const validated = invoiceSchema.safeParse(rawData);

  if (!validated.success) {
    const errorMessage = validated.error.issues ? validated.error.issues[0].message : "Validation error";
    return { error: errorMessage };
  }

  const data = validated.data;
  
  // Calculate financials
  const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  
  // Calculate Discount
  let discountAmount = 0;
  if (data.discount_type === "percentage" && data.discount_value) {
    discountAmount = (subtotal * data.discount_value) / 100;
  } else if (data.discount_type === "fixed" && data.discount_value) {
    discountAmount = data.discount_value;
  }

  // Calculate Tax (custom rate from user)
  const taxRate = parseFloat(formData.get("tax_rate") as string) || 11;
  let taxAmount = 0;
  const taxableAmount = subtotal - discountAmount;
  
  if (data.tax_enabled) {
    taxAmount = (taxableAmount * taxRate) / 100;
  }

  const finalAmount = Math.max(0, taxableAmount + taxAmount);
  
  // Validate minimum amount
  if (finalAmount < 10000) {
    return { error: "Total tagihan minimal Rp 10.000" };
  }

  const platformFee = 0; // Hidden as per req

  // 1. Create Invoice
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
      
      // Financials
      subtotal: subtotal,
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
    .select()
    .single();

  if (invoiceError) {
    return { error: invoiceError.message };
  }

  // 2. Create Invoice Items
  const invoiceItems = data.items.map(item => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.quantity * item.unit_price
  }));

  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(invoiceItems);

  if (itemsError) {
    await supabase.from("invoices").delete().eq("id", invoice.id);
    return { error: itemsError.message };
  }
  
  // 3. Audit Log
  await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "CREATE_INVOICE",
      entity: "invoices",
      entity_id: invoice.id,
      metadata: { type: data.type, amount: finalAmount }
  });

  revalidatePath("/dashboard/invoice");
  redirect(`/dashboard/invoice/${invoice.id}`);
}

export async function sendInvoice(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // SECURITY: Ensure user owns this invoice
    const { data: invoice } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id) // Added ownership check
        .single();
    if (!invoice) return { error: "Invoice not found" };
    
    // Validate Archive
    if (invoice.is_archived) return { error: "Invoice is archived" };
    
    if (!invoice.recipient_email) return { error: "Recipient email missing" };

    const { sendInvoiceEmail } = await import("@/lib/email");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const invoiceUrl = `${baseUrl}/dashboard/invoice/${invoice.id}`; 

    await sendInvoiceEmail({
        to: invoice.recipient_email,
        recipientName: invoice.recipient_name,
        invoiceNumber: invoice.invoice_number,
        amount: invoice.total_amount,
        paymentUrl: invoiceUrl,
        type: invoice.type
    });

    // CRITICAL FIX: Use Service Role to bypass RLS for status update
    // RLS now blocks users from updating 'SENT' invoices, so DRAFT->SENT transition
    // must happen via privileged system action.
    const adminSupabase = getServiceRoleClient();
    const { error: updateError } = await adminSupabase
        .from("invoices")
        .update({ status: "SENT" })
        .eq("id", id);

    if (updateError) {
        return { error: "Failed to update invoice status" };
    }
    
    revalidatePath(`/dashboard/invoice/${id}`);
    return { success: true };
}

export async function archiveInvoice(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase
        .from("invoices")
        .update({ is_archived: true })
        .eq("id", id)
        .eq("user_id", user.id);
        
    if (error) return { error: error.message };
    
    revalidatePath("/dashboard/invoice");
    return { success: true };
}

export async function getInvoices() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_archived", false) // Exclude archived
        .order("created_at", { ascending: false });
        
    return data as Invoice[];
}

export async function getInvoiceById(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: invoice, error } = await supabase
        .from("invoices")
        .select("*, items:invoice_items(*), supplier:suppliers(*)")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
        
    if (error || !invoice) return null;

    // Fetch profile for logo display
    const { data: profile } = await supabase
        .from("profiles")
        .select("name, company_name, company_address, logo_url")
        .eq("id", user.id)
        .single();

    return { ...invoice, profile };
}
