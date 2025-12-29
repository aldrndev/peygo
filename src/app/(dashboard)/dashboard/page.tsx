import { getCurrentUser, getUserInvoices, calculateInvoiceStats } from "@/lib/data/user";
import UserDashboardClient from "@/components/dashboard/UserDashboardClient";

export default async function UserDashboardPage() {
  // Middleware handles all auth redirects. This page only renders for authenticated users.
  const user = await getCurrentUser();

  // Safety fallback - if somehow user is null, middleware should have redirected
  // Return null instead of redirect to avoid Next.js 15+ client-side error caching
  if (!user) {
    return null;
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

