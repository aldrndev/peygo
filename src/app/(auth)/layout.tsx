import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthLayoutClient from "./AuthLayoutClient";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side session check - Best Practice
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is already authenticated, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  // If not authenticated, render the auth layout
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}
