import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import { getQueryClient } from "@/lib/query-client";
import { notFound } from "next/navigation";
import AdminInvoiceDetailHydrated from "./admin-invoice-detail-hydrated";
import { INVOICE_DETAIL_KEY } from "@/hooks/queries/use-invoice-detail";

export default async function AdminInvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const queryClient = getQueryClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") notFound();

  // Fetch invoice (admin can view any)
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (!invoice) notFound();

  // Fetch items
  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id);

  // Fetch invoice owner profile
  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", invoice.user_id)
    .single();

  // Fetch supplier if exists
  let supplier = null;
  if (invoice.supplier_id) {
    const { data: supplierData } = await supabase
      .from("suppliers")
      .select("*")
      .eq("id", invoice.supplier_id)
      .single();
    supplier = supplierData;
  }

  const invoiceWithItems = {
    ...invoice,
    items: items || [],
    profile: ownerProfile,
    supplier,
  };

  // Prefetch query
  await queryClient.prefetchQuery({
    queryKey: [...INVOICE_DETAIL_KEY, id],
    queryFn: async () => invoiceWithItems,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminInvoiceDetailHydrated invoiceId={id} />
    </HydrationBoundary>
  );
}
