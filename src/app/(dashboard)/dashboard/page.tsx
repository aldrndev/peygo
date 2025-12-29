import { redirect } from "next/navigation";
import { getCurrentUser, getUserInvoices, calculateInvoiceStats } from "@/lib/data/user";
import UserDashboardClient from "@/components/dashboard/UserDashboardClient";

export default async function UserDashboardPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  if (user.role === "admin") {
    return redirect("/dashboard/admin");
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
