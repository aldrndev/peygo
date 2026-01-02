import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import { getQueryClient } from "@/lib/query-client";
import { notFound } from "next/navigation";
import { createAuditLog, AuditAction } from "@/lib/audit";
import AdminUserDetailHydrated from "./admin-user-detail-hydrated";
import { ADMIN_USER_DETAIL_KEY } from "@/hooks/queries/use-admin-user-detail";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const queryClient = getQueryClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  // Check admin
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentProfile?.role !== "admin") notFound();

  // Get target user
  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!targetProfile) notFound();

  // Audit: Admin viewed user detail
  await createAuditLog({
    action: AuditAction.ADMIN_VIEW_USER_DETAIL,
    userId: user.id,
    entity: "profiles",
    entityId: id,
  });

  // Get invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  // Prefetch query
  await queryClient.prefetchQuery({
    queryKey: [...ADMIN_USER_DETAIL_KEY, id],
    queryFn: async () => ({
      profile: targetProfile,
      invoices: invoices || [],
    }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminUserDetailHydrated userId={id} />
    </HydrationBoundary>
  );
}
