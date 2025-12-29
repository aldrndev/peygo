import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Cron job to keep Supabase database alive
 * Runs every 6 hours to prevent free tier from pausing
 */
export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();
    
    // Simple query to keep database active
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Keep-alive query failed:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database pinged successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Keep-alive error:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
