import { getInvoiceById } from "../actions";
import { notFound } from "next/navigation";
import InvoiceDetail from "@/components/invoice/InvoiceDetail";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  // Type assertion since database type might be partial/different than client expectation
  return <InvoiceDetail invoice={invoice} />;
}
