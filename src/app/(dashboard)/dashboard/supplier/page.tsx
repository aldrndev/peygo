import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";
import { getSuppliersPaginated } from "./actions";
import { SUPPLIERS_QUERY_KEY } from "@/hooks/queries/use-suppliers";
import SupplierClient from "./supplier-client";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function SupplierPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1"));
  
  // Create QueryClient for SSR
  const queryClient = createQueryClient();

  // Prefetch suppliers into cache
  await queryClient.prefetchQuery({
    queryKey: [...SUPPLIERS_QUERY_KEY, "paginated", currentPage],
    queryFn: () => getSuppliersPaginated(currentPage),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <SupplierClient currentPage={currentPage} />
      </div>
    </HydrationBoundary>
  );
}
