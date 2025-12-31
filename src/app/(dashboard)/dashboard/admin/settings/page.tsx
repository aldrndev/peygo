import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import { getQueryClient } from "@/lib/query-client";
import { notFound } from "next/navigation";
import AdminSettingsHydrated from "./admin-settings-hydrated";
import { ADMIN_SETTINGS_KEY } from "@/hooks/queries/use-admin-extended";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const queryClient = getQueryClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  // Check admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") notFound();

  // Fetch settings
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .order("key");

  // Prefetch query
  await queryClient.prefetchQuery({
    queryKey: ADMIN_SETTINGS_KEY,
    queryFn: async () => settings || [],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminSettingsHydrated />
    </HydrationBoundary>
  );
}
