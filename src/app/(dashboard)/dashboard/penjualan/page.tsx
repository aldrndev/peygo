import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";
import { createClient } from "@/lib/supabase/server";
import { BILLING_INVOICES_KEY } from "@/hooks/queries/use-invoices";
import PenjualanClient from "./penjualan-client";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function PenjualanPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const params = await searchParams;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const currentPage = Math.max(1, parseInt(params.page || "1"));
  const offset = (currentPage - 1) * PAGE_SIZE;

  // Create QueryClient for SSR
  const queryClient = createQueryClient();

  // Prefetch invoices into cache
  await queryClient.prefetchQuery({
    queryKey: [...BILLING_INVOICES_KEY, currentPage],
    queryFn: async () => {
      const { count } = await supabase
        .from("invoices")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("type", "BILLING");

      const { data: invoices } = await supabase
        .from("invoices")
        .select("id, type, status, total_amount, created_at, recipient_name, invoice_number")
        .eq("user_id", user.id)
        .eq("type", "BILLING")
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      return {
        invoices: invoices || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / PAGE_SIZE),
        currentPage,
        pageSize: PAGE_SIZE,
      };
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PenjualanClient currentPage={currentPage} />
    </HydrationBoundary>
  );
}
