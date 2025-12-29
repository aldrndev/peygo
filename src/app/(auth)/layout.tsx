import AuthLayoutClient from "./AuthLayoutClient";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware handles redirection of authenticated users to dashboard
  // No server-side redirect here to avoid Next.js 15+ client-side error caching
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}
