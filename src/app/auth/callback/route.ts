import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      
      // Determine redirect destination based on flow type
      let redirectPath = next;
      if (type === "recovery") {
        // Password recovery flow - redirect to reset password page
        redirectPath = "/reset-password";
      }
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    } else {
      // Handle errors - include error info for expired links
      const errorParams = new URLSearchParams({
        error: "auth_error",
        error_description: error.message || "Authentication failed",
      });
      
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password?${errorParams}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

