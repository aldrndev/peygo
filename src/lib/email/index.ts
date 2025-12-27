import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "PeyGo <onboarding@resend.dev>"; // Gunakan domain terverifikasi di Production

interface SendInvoiceEmailProps {
  to: string;
  recipientName: string;
  invoiceNumber: string;
  amount: number;
  paymentUrl: string;
  type: "BILLING" | "PAYMENT_REQUEST";
}

export async function sendInvoiceEmail({
  to,
  recipientName,
  invoiceNumber,
  amount,
  paymentUrl,
  type
}: SendInvoiceEmailProps) {
  if (!process.env.RESEND_API_KEY) {
      // eslint-disable-next-line no-console
      console.warn("RESEND_API_KEY missing, skipping email");
      return { success: false, error: "Missing API Key" };
  }

  const subject = type === "BILLING" 
    ? `Tagihan Baru dari PeyGo: ${invoiceNumber}`
    : `Permintaan Pembayaran: ${invoiceNumber}`;

  const label = type === "BILLING" ? "Tagihan" : "Permintaan Pembayaran";

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to], // Resend free tier only allows sending to verified email (usually your own)
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Halo, ${recipientName}</h2>
          <p>Anda telah menerima ${label} baru dengan detail sebagai berikut:</p>
          
          <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #555;">Nomor Invoice</p>
            <p style="margin: 5px 0 15px 0; font-weight: bold;">${invoiceNumber}</p>
            
            <p style="margin: 0; font-size: 14px; color: #555;">Total Jumlah</p>
            <p style="margin: 5px 0 0 0; font-weight: bold; font-size: 20px; color: #006fee;">
              Rp ${amount.toLocaleString("id-ID")}
            </p>
          </div>

          <p>Silakan klik tombol di bawah untuk melihat detail dan melakukan pembayaran:</p>
          
          <a href="${paymentUrl}" style="display: inline-block; background: #006fee; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Bayar Sekarang
          </a>
          
          <p style="margin-top: 30px; font-size: 12px; color: #71717a;">
            Jatuh tempo pembayaran mengikuti ketentuan yang berlaku.
            Jika tombol tidak berfungsi, salin link berikut: <br>
            ${paymentUrl}
          </p>
        </div>
      `,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Email send exception:", e);
    return { success: false, error: e };
  }
}
