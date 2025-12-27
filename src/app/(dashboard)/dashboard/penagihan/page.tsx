import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InvoiceList from "@/components/invoice/InvoiceList";

export default async function PenagihanPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/masuk");
  }

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", "BILLING")
    .order("created_at", { ascending: false });

  return <InvoiceList invoices={invoices || []} type="BILLING" />;
}
