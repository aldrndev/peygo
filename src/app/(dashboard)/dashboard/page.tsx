import { redirect } from "next/navigation";
import { getCurrentUser, getUserInvoices, calculateInvoiceStats } from "@/lib/data/user";
import UserDashboardClient from "@/components/dashboard/UserDashboardClient";
import { createClient } from "@/lib/supabase/server";

export default async function UserDashboardPage() {
  // 1. Check Auth first (strictly for valid session)
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/masuk");
  }

  // 2. Get User Profile (Abstraction)
  const user = await getCurrentUser();

  // 3. If Auth exists but Profile missing/null (e.g. slow trigger, or partial signup)
  // Redirect to onboarding instead of login to prevent loop
  if (!user) {
    redirect("/dashboard/onboarding");
  }

  // Admin users go to admin dashboard
  if (user.role === "admin") {
    redirect("/dashboard/admin");
  }

  // Get invoices (cached)
  const invoices = await getUserInvoices(user.id);
  
  // Calculate stats
  const stats = calculateInvoiceStats(invoices);

  // Recent invoices (first 5)
  const recentInvoices = invoices.slice(0, 5);

  return (
    <UserDashboardClient
      userName={user.name}
      companyName={user.companyName}
      stats={stats}
      recentInvoices={recentInvoices}
    />
  );
}
