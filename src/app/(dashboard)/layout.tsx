import { createClient } from "@/lib/supabase/server";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { UserRole } from "@/types/database";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  let userRole: UserRole = "user";
  let userName = "User";
  
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", user.id)
      .single();
    
    if (profile) {
      userName = profile.name || "User";
      userRole = (profile.role as UserRole) || "user";
    }
  }

  return (
    <DashboardLayout userRole={userRole} userName={userName}>
      {children}
    </DashboardLayout>
  );
}
