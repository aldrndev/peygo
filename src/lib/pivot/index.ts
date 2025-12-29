/* eslint-disable no-console */
// Types
export interface PivotPaymentRequest {
  external_id: string;
  amount: number;
  payer_email: string;
  description: string;
  payer_name: string;
  payment_method?: string; // Optional, strict mapping can be added later
}

export interface PivotPaymentResponse {
  id: string;
  external_id: string;
  amount: number;
  status: string;
  payment_url: string;
}

// Config
const PIVOT_API_URL = process.env.PIVOT_API_URL || "https://api-stg.pivot-payment.com";
const PIVOT_API_KEY = process.env.PIVOT_API_KEY;

export async function createPaymentRequest(data: PivotPaymentRequest): Promise<PivotPaymentResponse | { error: string }> {
  if (!PIVOT_API_KEY) {
    console.error("Pivot API Key is missing");
    return { error: "Payment service configuration error" };
  }

  try {
    const response = await fetch(`${PIVOT_API_URL}/payment-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PIVOT_API_KEY}`,
      },
      body: JSON.stringify({
        external_id: data.external_id,
        amount: data.amount,
        payer_email: data.payer_email,
        payer_name: data.payer_name,
        description: data.description,
        payment_method: data.payment_method,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Pivot API Error:", responseData);
      return { error: responseData.message || "Failed to create payment request" };
    }

    return {
      id: responseData.id,
      external_id: responseData.external_id,
      amount: responseData.amount,
      status: responseData.status,
      payment_url: responseData.payment_url,
    };
  } catch (error) {
    console.error("Pivot Fetch Error:", error);
    return { error: "Failed to connect to payment service" };
  }
}

import crypto from "crypto";

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secret = process.env.PIVOT_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "development") return true; // Dev bypass
    return false; // Fail secure in prod
  }
  
  // Pivot usually sends HMAC-SHA256 hex digest
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  
  // Constant time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature), 
    Buffer.from(digest)
  );
}
