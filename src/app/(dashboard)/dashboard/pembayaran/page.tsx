import { createClient } from "@/lib/supabase/server";
import InvoiceList from "@/components/invoice/InvoiceList";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function PembayaranPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const params = await searchParams;
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // Middleware handles auth - return null as safety fallback
  if (!user) return null;

  const currentPage = Math.max(1, parseInt(params.page || "1"));
  const offset = (currentPage - 1) * PAGE_SIZE;

  // Get total count
  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("type", "PAYMENT_REQUEST");

  // Get paginated data
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", "PAYMENT_REQUEST")
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

  return (
    <InvoiceList 
      invoices={invoices || []} 
      type="PAYMENT_REQUEST" 
      pagination={{
        currentPage,
        totalPages,
        totalCount: count || 0,
        pageSize: PAGE_SIZE,
      }}
    />
  );
}
