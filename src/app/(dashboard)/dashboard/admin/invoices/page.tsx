import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AdminInvoicesClient from "@/components/dashboard/AdminInvoicesClient";

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

  // Get all invoices
  const { data: rawInvoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, type, status, total_amount, created_at, user_id")
    .order("created_at", { ascending: false });

  // Get user names
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name");

  const userNames: Record<string, string> = {};
  profiles?.forEach(p => {
    userNames[p.id] = p.name || "-";
  });

  const invoices = (rawInvoices || []).map(inv => ({
    ...inv,
    userName: userNames[inv.user_id] || "-"
  }));

  return <AdminInvoicesClient invoices={invoices} />;
}
