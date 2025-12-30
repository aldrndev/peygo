import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - Root landing page (/) - public, skip for faster TTFB
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - _next/data (client-side navigation data)
     * - favicon.ico
     * - public assets (images, fonts, etc.)
     * - api routes (handled separately)
     * - public pages (kebijakan-privasi, syarat-ketentuan, blog)
     */
    "/((?!_next/static|_next/image|_next/data|api|favicon.ico|robots.txt|sitemap.xml|kebijakan-privasi|syarat-ketentuan|blog|pay|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$)(?!$).*)",
  ],
};
