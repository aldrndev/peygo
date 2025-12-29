import { createClient } from "@/lib/supabase/server";
import ProfilePage from "@/components/dashboard/ProfilePage";

export default async function ProfilPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // Middleware handles auth - return null as safety fallback
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <ProfilePage user={user} profile={profile} />;
}
