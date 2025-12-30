import { getCurrentUser } from "@/lib/data/user";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side fetch for initial render (optional - AuthGuard will handle auth)
  const user = await getCurrentUser();

  return (
    <AuthGuard>
      <DashboardLayout 
        userRole={user?.role || "user"} 
        userName={user?.name || "User"}
      >
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}

