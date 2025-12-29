import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Cron job to keep Supabase database alive
 * Runs every 2 days to prevent free tier from pausing
 * 
 * Note: This is a read-only operation, no auth required
 * Vercel Cron will call this endpoint automatically
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Simple query to keep database active
    const { error } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Keep-alive query failed:", error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database pinged successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Keep-alive error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal error" 
    }, { status: 500 });
  }
}
