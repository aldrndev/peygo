import React from 'react';
import { pdf, Document } from '@react-pdf/renderer';
import AdminReportPDF from '@/components/dashboard/reports/AdminReportPDF';
import {
  type ReportSummary,
  type InvoiceRow,
  type UserActivityRow,
} from './admin-reports-filtered';

/**
 * Generate and download PDF report
 * Uses @react-pdf/renderer to create professional multi-page report
 */
export async function generateAdminReportPDF(
  summary: ReportSummary,
  topInvoices: InvoiceRow[] = [],
  topUsers: UserActivityRow[] = []
): Promise<void> {
  try {
    // Create PDF blob by generating the component's Document
    const pdfComponent = (
      <AdminReportPDF
        summary={summary}
        topInvoices={topInvoices}
        topUsers={topUsers}
      />
    );
    
    const blob = await pdf(pdfComponent).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan-admin-${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Gagal membuat PDF report');
  }
}
