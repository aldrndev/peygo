import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import { getQueryClient } from "@/lib/query-client";
import { notFound } from "next/navigation";
import InvoiceDetailHydrated from "./invoice-detail-hydrated";
import { INVOICE_DETAIL_KEY } from "@/hooks/queries/use-invoice-detail";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const queryClient = getQueryClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch invoice
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!invoice) {
    notFound();
  }

  // Fetch items
  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id);

  const invoiceWithItems = {
    ...invoice,
    items: items || [],
  };

  // Prefetch query
  await queryClient.prefetchQuery({
    queryKey: [...INVOICE_DETAIL_KEY, id],
    queryFn: async () => invoiceWithItems,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InvoiceDetailHydrated invoiceId={id} />
    </HydrationBoundary>
  );
}
