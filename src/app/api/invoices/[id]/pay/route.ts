import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPaymentRequest } from "@/lib/pivot";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  
  // 1. Check Auth & Ownership
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  
  // Note: Depending on flow, user might be paying THEIR OWN request (top up?) or paying a bill?
  // Our flow: 
  // BILLING: User A sends to User B. User B pays. (User B might not be logged in?)
  // PAYMENT_REQUEST: User A pays. (User A is logged in)
  
  // For MVP, if type is BILLING, we assume public access via special link (TODO) or logged in user?
  // Current requirement: "User B klik link -> Redirect ke Pivot".
  // Let's handle PAYMENT_REQUEST first where User A pays.
  
  if (invoice.status === "PAID") {
      return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });
  }

  // 2. Create Payment Request to Pivot
  const paymentResponse = await createPaymentRequest({
    external_id: invoice.id,
    amount: invoice.total_amount,
    payer_email: invoice.recipient_email || user.email || "guest@peygo.id",
    payer_name: invoice.recipient_name,
    description: invoice.description || `Invoice ${invoice.invoice_number}`,
  });

  if ("error" in paymentResponse) {
    return NextResponse.json({ error: paymentResponse.error }, { status: 500 });
  }

  // 3. Update Invoice with Payment Info
  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      pivot_payment_id: paymentResponse.id,
      pivot_payment_url: paymentResponse.payment_url,
      status: "SENT", // Mark as sent/pending payment
    })
    .eq("id", id);

  if (updateError) {
      // eslint-disable-next-line no-console
      console.error("Failed to update invoice:", updateError);
      return NextResponse.json({ error: "Failed to update invoice status" }, { status: 500 });
  }

  return NextResponse.json({ url: paymentResponse.payment_url });
}
