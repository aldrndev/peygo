import { getCurrentUser } from "@/lib/data/user";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <DashboardLayout 
      userRole={user?.role || "user"} 
      userName={user?.name || "User"}
    >
      {children}
    </DashboardLayout>
  );
}
