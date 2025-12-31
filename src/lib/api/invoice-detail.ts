import { createClient } from "@/lib/supabase/client";
import type { Invoice, InvoiceItem } from "@/types/database";

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
}

/**
 * Fetch invoice by ID with items
 */
export async function fetchInvoiceById(id: string): Promise<InvoiceWithItems | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!invoice) return null;

  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id);

  return {
    ...invoice,
    items: items || [],
  };
}
