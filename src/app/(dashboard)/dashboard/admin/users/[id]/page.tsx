import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import AdminUserDetailClient from "@/components/dashboard/AdminUserDetailClient";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/masuk");

  // Check if admin
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentProfile?.role !== "admin") {
    return redirect("/dashboard");
  }

  const { id } = await params;

  // Get targeted user profile
  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!targetProfile) return notFound();

  // Get all invoices for this user
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  return (
    <AdminUserDetailClient 
      profile={targetProfile} 
      invoices={invoices || []} 
    />
  );
}
