import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PROFILE_COMPLETE_COOKIE = "peygo_profile_complete";
const USER_ROLE_COOKIE = "peygo_user_role";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          } catch {
            // Server Component context
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Skip redirect checks for static assets and API routes to improve performance
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return supabaseResponse;
  }

  // Public routes (no auth required)
  const publicRoutes = ["/", "/masuk", "/daftar", "/auth", "/blog", "/pay"];
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );

  // Auth pages that authenticated users should be redirected away from
  const authPages = ["/masuk", "/daftar"];
  const isAuthPage = authPages.some(page => 
    pathname === page || pathname.startsWith(page + "/")
  );

  // Redirect unauthenticated users trying to access protected routes
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/masuk";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages to dashboard
  // Only redirect from auth pages, not if user is already going elsewhere
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Check profile completion and role for dashboard
  if (user && pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/onboarding")) {
    // Check cookie cache
    const profileCompleteCookie = request.cookies.get(PROFILE_COMPLETE_COOKIE)?.value;
    const userRoleCookie = request.cookies.get(USER_ROLE_COOKIE)?.value;
    
    let isProfileComplete = profileCompleteCookie === "true";
    let userRole = userRoleCookie || "user";

    // If no profile cookie or no role cookie, query DB
    if (!profileCompleteCookie || !userRoleCookie) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, phone, role")
        .eq("id", user.id)
        .single();

      isProfileComplete = !!(profile?.name && profile?.phone);
      userRole = profile?.role || "user";
      
      if (isProfileComplete) {
        supabaseResponse.cookies.set(PROFILE_COMPLETE_COOKIE, "true", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }
      
      supabaseResponse.cookies.set(USER_ROLE_COOKIE, userRole, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    // Redirect to onboarding if profile incomplete
    if (!isProfileComplete) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/onboarding";
      return NextResponse.redirect(url);
    }

    // Protect admin routes - ALWAYS verify role from DB for admin routes (bypass cookie cache)
    if (pathname.startsWith("/dashboard/admin")) {
      // Fresh check from DB for admin routes security
      const { data: freshProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      const actualRole = freshProfile?.role || "user";
      
      if (actualRole !== "admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }

    // User-only routes - admin should not access these
    const userOnlyRoutes = [
      "/dashboard/penjualan",
      "/dashboard/pembayaran", 
      "/dashboard/supplier",
      "/dashboard/invoice",
    ];
    
    const isUserOnlyRoute = userOnlyRoutes.some(route => 
      pathname === route || pathname.startsWith(route + "/")
    );
    
    if (isUserOnlyRoute && userRole === "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/admin";
      return NextResponse.redirect(url);
    }

    // Redirect admin users to admin dashboard when they visit regular /dashboard
    if (pathname === "/dashboard" && userRole === "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/admin";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

// Export function to invalidate profile cache (call after profile update)
export function invalidateProfileCache() {
  // This would be called from server action after profile update
  // to clear the cookie
}
