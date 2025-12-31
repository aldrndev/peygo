import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";
import { getCurrentUser, getUserInvoices } from "@/lib/data/user";
import { INVOICES_QUERY_KEY } from "@/hooks/queries/use-invoices";
import DashboardClient from "./dashboard-client";

export default async function UserDashboardPage() {
  // Middleware handles all auth redirects. This page only renders for authenticated users.
  const user = await getCurrentUser();

  // Safety fallback - if somehow user is null, middleware should have redirected
  if (!user) {
    return null;
  }

  // Create QueryClient for SSR
  const queryClient = createQueryClient();

  // Prefetch invoices into QueryClient cache
  await queryClient.prefetchQuery({
    queryKey: INVOICES_QUERY_KEY,
    queryFn: () => getUserInvoices(user.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient 
        userName={user.name}
        companyName={user.companyName}
      />
    </HydrationBoundary>
  );
}
