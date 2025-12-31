import { createClient } from "@/lib/supabase/client";

export interface PaginatedInvoices {
  invoices: Invoice[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface Invoice {
  id: string;
  type: string;
  status: string;
  total_amount: number;
  created_at: string;
  recipient_name: string | null;
  invoice_number: string | null;
}

const PAGE_SIZE = 20;

/**
 * Fetch paginated invoices by type (BILLING or PAYMENT_REQUEST)
 */
export async function fetchInvoicesByType(
  type: "BILLING" | "PAYMENT_REQUEST",
  page = 1
): Promise<PaginatedInvoices> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { invoices: [], totalCount: 0, totalPages: 0, currentPage: 1, pageSize: PAGE_SIZE };
  }

  const offset = (page - 1) * PAGE_SIZE;

  // Get total count
  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("type", type);

  // Get paginated data
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, type, status, total_amount, created_at, recipient_name, invoice_number")
    .eq("user_id", user.id)
    .eq("type", type)
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  const totalCount = count || 0;

  return {
    invoices: invoices || [],
    totalCount,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    currentPage: page,
    pageSize: PAGE_SIZE,
  };
}

/**
 * Fetch all invoices for the current user (client-side)
 */
export async function fetchUserInvoices(): Promise<Invoice[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, type, status, total_amount, created_at, recipient_name, invoice_number")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });
  
  return invoices || [];
}

export interface InvoiceStats {
  totalPenagihan: number;
  totalPembayaran: number;
  pendingAmount: number;
  paidAmount: number;
}

/**
 * Calculate invoice stats from invoices array
 */
export function calculateInvoiceStats(invoices: Invoice[]): InvoiceStats {
  return {
    totalPenagihan: invoices.filter(i => i.type === "BILLING").length,
    totalPembayaran: invoices.filter(i => i.type === "PAYMENT_REQUEST").length,
    pendingAmount: invoices
      .filter(i => i.status === "SENT" || i.status === "DRAFT")
      .reduce((acc, i) => acc + (i.total_amount || 0), 0),
    paidAmount: invoices
      .filter(i => i.status === "PAID" || i.status === "DISBURSED")
      .reduce((acc, i) => acc + (i.total_amount || 0), 0),
  };
}
