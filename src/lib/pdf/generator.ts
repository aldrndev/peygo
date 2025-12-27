import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Invoice, InvoiceItem } from "@/types/database";

interface JsPDFWithAutoTable extends jsPDF {
  lastAutoTable: { finalY: number };
}

export function generatePDF(invoice: Invoice & { items: InvoiceItem[] }) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(0, 111, 238); // Primary Blue
  doc.text("INVOICE", 20, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(invoice.invoice_number, 20, 26);

  // Sender Info (Right aligned)
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("PeyGo", 190, 20, { align: "right" });
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Platform Invoice & Billing", 190, 25, { align: "right" });

  // Recipient info
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Ditagihkan Kepada:", 20, 40);
  
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(invoice.recipient_name, 20, 46);
  if (invoice.recipient_email) doc.text(invoice.recipient_email, 20, 51);
  if (invoice.recipient_phone) doc.text(invoice.recipient_phone, 20, 56);

  // Invoice Details (Right aligned dates/totals)
  doc.text(`Total Tagihan: Rp ${invoice.total_amount.toLocaleString("id-ID")}`, 190, 46, { align: "right" });
  if (invoice.due_date) {
      doc.text(`Jatuh Tempo: ${invoice.due_date}`, 190, 51, { align: "right" });
  }

  // Items Table
  const tableColumn = ["Deskripsi", "Qty", "Harga Satuan", "Total"];
  const tableRows = invoice.items.map(item => [
    item.description,
    item.quantity.toString(),
    `Rp ${item.unit_price.toLocaleString("id-ID")}`,
    `Rp ${item.total_price.toLocaleString("id-ID")}`,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 65,
    theme: 'striped',
    headStyles: { fillColor: [0, 111, 238] },
  });

  // Footer Disclaimer
  const finalY = (doc as unknown as JsPDFWithAutoTable).lastAutoTable.finalY || 150;
  
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    "PeyGo adalah platform invoice dan billing. Semua pemrosesan pembayaran dan pencairan dana ditangani oleh mitra pembayaran berlisensi.",
    20,
    finalY + 10,
    { maxWidth: 170 }
  );

  doc.save(`${invoice.invoice_number}.pdf`);
}
