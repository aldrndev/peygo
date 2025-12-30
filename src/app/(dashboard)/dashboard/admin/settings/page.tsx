import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AdminSettingsClient from "@/components/dashboard/AdminSettingsClient";
import { getSettingsForAdmin } from "./actions";

export default async function AdminSettingsPage() {
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

  // Fetch settings for admin page
  const settings = await getSettingsForAdmin();

  return <AdminSettingsClient settings={settings} />;
}
