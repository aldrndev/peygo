/**
 * Public health check endpoint (Edge Runtime)
 * URL: /api/health
 */
export const runtime = "edge";

export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    }
  );
}
