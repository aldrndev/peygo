import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ADMIN_USERS_KEY } from "@/hooks/queries/use-admin";
import AdminUsersHydrated from "./admin-users-hydrated";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) notFound();

  // Check if admin
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentProfile?.role !== "admin") notFound();

  // Create QueryClient for SSR
  const queryClient = createQueryClient();

  // Prefetch admin users data
  await queryClient.prefetchQuery({
    queryKey: ADMIN_USERS_KEY,
    queryFn: async () => {
      const [usersResult, invoiceCountsResult] = await Promise.all([
        supabase.from("profiles").select("id, name, phone, role, created_at").order("created_at", { ascending: false }),
        supabase.from("invoices").select("user_id"),
      ]);

      const users = usersResult.data || [];
      const invoiceCounts = invoiceCountsResult.data || [];

      const userInvoiceCounts: Record<string, number> = {};
      invoiceCounts.forEach(inv => {
        userInvoiceCounts[inv.user_id] = (userInvoiceCounts[inv.user_id] || 0) + 1;
      });

      return { users, userInvoiceCounts };
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminUsersHydrated />
    </HydrationBoundary>
  );
}
