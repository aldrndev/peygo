import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Public health check endpoint
 * URL: /api/health
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Simple query to check database connection
    const { error } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    if (error) {
      return NextResponse.json({ 
        status: "error", 
        database: "disconnected",
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    return NextResponse.json({ 
      status: "ok", 
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch {
    return NextResponse.json({ 
      status: "error", 
      database: "error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
