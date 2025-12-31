import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ADMIN_INVOICES_KEY } from "@/hooks/queries/use-admin";
import AdminInvoicesHydrated from "./admin-invoices-hydrated";

export default async function AdminInvoicesPage() {
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

  // Prefetch admin invoices data
  await queryClient.prefetchQuery({
    queryKey: ADMIN_INVOICES_KEY,
    queryFn: async () => {
      const [invoicesResult, profilesResult] = await Promise.all([
        supabase.from("invoices").select("id, invoice_number, type, status, total_amount, created_at, user_id").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, name"),
      ]);

      const rawInvoices = invoicesResult.data || [];
      const profiles = profilesResult.data || [];

      const userNames: Record<string, string> = {};
      profiles.forEach(p => {
        userNames[p.id] = p.name || "-";
      });

      return rawInvoices.map(inv => ({
        ...inv,
        userName: userNames[inv.user_id] || "-"
      }));
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminInvoicesHydrated />
    </HydrationBoundary>
  );
}
