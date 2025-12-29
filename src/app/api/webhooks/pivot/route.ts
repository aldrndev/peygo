import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { verifyWebhookSignature } from "@/lib/pivot";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("x-pivot-signature") || "";

  // 1. Verify Signature
  if (!verifyWebhookSignature(payload, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(payload);
  const { event_type, data } = event;

  // Supabase Service Role Client (for admin access/bypassing RLS if needed, though RLS policies usually allow update if logic is right. 
  // For webhooks, we usually need service role to update arbitrary records without user session)
  // BUT we don't have service role exposed in helper easily without env var usage directly here.
  // Ideally we should use a service role client. For now, let's use standard client but we might hit RLS issues if we don't have a user session.
  // FIX: We need a service role client factory.
  
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use Service Role Key for webhooks
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {} // No need to set cookies in webhook
      }
    }
  );

  try {
    // 2. Log Webhook
    await supabase.from("webhook_logs").insert({
      provider: "pivot",
      event_type: event_type,
      payload: event,
      status: "PROCESSING"
    });

    let invoiceStatus = "";
    let additionalUpdates = {};

    // 3. Process Event
    // Event types are hypothetical based on standard payment gateways (e.g. Xendit/Midtrans/Pivot)
    // Adjust based on actual Pivot docs if available. Assuming standard:
    // - payment.succeeded
    // - payout.completed
    
    // Check if event linked to an invoice (external_id usually holds invoice ID)
    const invoiceId = data.external_id;

    if (!invoiceId) {
        return NextResponse.json({ message: "No external_id found, ignored" });
    }

    /* 
      HANDLE INVOICE STATUS UPDATES 
    */
    if (event_type === "payment.succeeded" || event_type === "invoice.paid") {
       invoiceStatus = "PAID";
       additionalUpdates = { paid_at: new Date().toISOString() };
    } else if (event_type === "payout.completed" || event_type === "disbursement.succeeded") {
       invoiceStatus = "DISBURSED";
       additionalUpdates = { disbursed_at: new Date().toISOString() };
    } else if (event_type === "payment.failed" || event_type === "invoice.expired") {
       invoiceStatus = "FAILED"; // or EXPIRED
    }

    if (invoiceStatus) {
        // Update Invoice
        const { error: updateError } = await supabase
            .from("invoices")
            .update({ status: invoiceStatus, ...additionalUpdates })
            .eq("id", invoiceId);
        
        if (updateError) {
          // eslint-disable-next-line no-console
          console.error("Webhook invoice update failed:", updateError);
          throw updateError;
        }

        // Audit Log
        await supabase.from("audit_logs").insert({
            action: "WEBHOOK_UPDATE",
            entity: "invoices",
            entity_id: invoiceId,
            metadata: { 
                event: event_type,
                new_status: invoiceStatus 
            }
        });
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
