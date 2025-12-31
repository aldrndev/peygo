import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/server";
import { getQueryClient } from "@/lib/query-client";
import ProfileClientHydrated from "./profile-client-hydrated";
import { PROFILE_QUERY_KEY } from "@/hooks/queries/use-profile";

export default async function ProfilPage() {
  const supabase = await createClient();
  const queryClient = getQueryClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Prefetch profile data
  await queryClient.prefetchQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => ({
      profile,
      email: user.email || "",
    }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileClientHydrated />
    </HydrationBoundary>
  );
}
