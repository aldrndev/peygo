import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import {
  type ReportSummary,
  type InvoiceRow,
  type UserActivityRow,
} from '@/lib/api/admin-reports-filtered';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#0F172A',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#F97316',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  statCard: {
    width: '47%',
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statLabel: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  statGrowth: {
    fontSize: 10,
    color: '#22C55E', // green for positive
  },
  statGrowthNegative: {
    fontSize: 10,
    color: '#EF4444', // red for negative
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: '#0F172A',
    paddingBottom: 8,
    marginBottom: 8,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cellText: {
    fontSize: 9,
    color: '#0F172A',
  },
  col25: { width: '25%' },
  col30: { width: '30%' },
  col40: { width: '40%' },
  col50: { width: '50%' },
  col20: { width: '20%' },
  col15: { width: '15%' },
  textRight: { textAlign: 'right' },
  textLeft: { textAlign: 'left' },
  textCenter: { textAlign: 'center' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94A3B8',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});

interface AdminReportPDFProps {
  summary: ReportSummary;
  topInvoices?: InvoiceRow[];
  topUsers?: UserActivityRow[];
}

export default function AdminReportPDF({
  summary,
  topInvoices = [],
  topUsers = [],
}: AdminReportPDFProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateStr: string | Date) =>
    new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>LAPORAN ADMIN PEYGO</Text>
          <Text style={styles.subtitle}>Periode: {summary.dateRange.label}</Text>
          <Text style={styles.subtitle}>
            {formatDate(summary.dateRange.startDate)} -{' '}
            {formatDate(summary.dateRange.endDate)}
          </Text>
          <Text style={styles.subtitle}>
            Digenerate: {new Date().toLocaleString('id-ID')}
          </Text>
        </View>

        {/* Summary Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringkasan Metrik</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Revenue</Text>
              <Text style={styles.statValue}>
                {formatCurrency(summary.totalRevenue)}
              </Text>
              <Text
                style={
                  summary.revenueGrowth >= 0
                    ? styles.statGrowth
                    : styles.statGrowthNegative
                }
              >
                {summary.revenueGrowth >= 0 ? '▲' : '▼'}{' '}
                {Math.abs(summary.revenueGrowth).toFixed(1)}%
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Invoice</Text>
              <Text style={styles.statValue}>{summary.totalInvoices}</Text>
              <Text
                style={
                  summary.invoiceGrowth >= 0
                    ? styles.statGrowth
                    : styles.statGrowthNegative
                }
              >
                {summary.invoiceGrowth >= 0 ? '▲' : '▼'}{' '}
                {Math.abs(summary.invoiceGrowth).toFixed(1)}%
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Users</Text>
              <Text style={styles.statValue}>{summary.totalUsers}</Text>
              <Text
                style={
                  summary.userGrowth >= 0
                    ? styles.statGrowth
                    : styles.statGrowthNegative
                }
              >
                {summary.userGrowth >= 0 ? '▲' : '▼'}{' '}
                {Math.abs(summary.userGrowth).toFixed(1)}%
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Platform Fee</Text>
              <Text style={styles.statValue}>
                {formatCurrency(summary.totalFees)}
              </Text>
            </View>
          </View>
        </View>

        {/* Invoice Type Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Breakdown Tipe Invoice</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.col50]}>Tipe</Text>
              <Text style={[styles.headerText, styles.col50, styles.textRight]}>
                Jumlah
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.cellText, styles.col50]}>Billing</Text>
              <Text style={[styles.cellText, styles.col50, styles.textRight]}>
                {summary.billingCount}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.cellText, styles.col50]}>Payment Request</Text>
              <Text style={[styles.cellText, styles.col50, styles.textRight]}>
                {summary.paymentCount}
              </Text>
            </View>
          </View>
        </View>

        {/* Status Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Breakdown Status</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.col50]}>Status</Text>
              <Text style={[styles.headerText, styles.col50, styles.textRight]}>
                Jumlah
              </Text>
            </View>
            {Object.entries(summary.statusCounts).map(([status, count]) => (
              <View key={status} style={styles.tableRow}>
                <Text style={[styles.cellText, styles.col50]}>{status}</Text>
                <Text style={[styles.cellText, styles.col50, styles.textRight]}>
                  {count}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>PeyGo - Sistem Manajemen Invoice</Text>
        </View>
      </Page>

      {/* Page 2: Top Invoices (if available) */}
      {topInvoices.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Top Invoice</Text>
            <Text style={styles.subtitle}>Berdasarkan Total Amount</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.col25]}>Invoice #</Text>
              <Text style={[styles.headerText, styles.col20]}>Tipe</Text>
              <Text style={[styles.headerText, styles.col20]}>Status</Text>
              <Text style={[styles.headerText, styles.col20, styles.textRight]}>
                Amount
              </Text>
              <Text style={[styles.headerText, styles.col15, styles.textRight]}>
                Fee
              </Text>
            </View>
            {topInvoices.slice(0, 15).map((invoice) => (
              <View key={invoice.id} style={styles.tableRow}>
                <Text style={[styles.cellText, styles.col25]}>
                  {invoice.invoice_number || '-'}
                </Text>
                <Text style={[styles.cellText, styles.col20]}>
                  {invoice.type === 'BILLING' ? 'Billing' : 'Payment'}
                </Text>
                <Text style={[styles.cellText, styles.col20]}>
                  {invoice.status}
                </Text>
                <Text style={[styles.cellText, styles.col20, styles.textRight]}>
                  {formatCurrency(invoice.total_amount)}
                </Text>
                <Text style={[styles.cellText, styles.col15, styles.textRight]}>
                  {formatCurrency(invoice.platform_fee)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Text>Halaman 2 - PeyGo</Text>
          </View>
        </Page>
      )}

      {/* Page 3: Top Users (if available) */}
      {topUsers.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Top User</Text>
            <Text style={styles.subtitle}>Berdasarkan Total Revenue</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.col30]}>Nama</Text>
              <Text style={[styles.headerText, styles.col15, styles.textCenter]}>
                Invoices
              </Text>
              <Text style={[styles.headerText, styles.col25, styles.textRight]}>
                Revenue
              </Text>
              <Text style={[styles.headerText, styles.col15, styles.textRight]}>
                Fees
              </Text>
              <Text style={[styles.headerText, styles.col15, styles.textRight]}>
                Last Active
              </Text>
            </View>
            {topUsers.slice(0, 15).map((user) => (
              <View key={user.id} style={styles.tableRow}>
                <Text style={[styles.cellText, styles.col30]}>
                  {user.name || '-'}
                </Text>
                <Text style={[styles.cellText, styles.col15, styles.textCenter]}>
                  {user.invoiceCount}
                </Text>
                <Text style={[styles.cellText, styles.col25, styles.textRight]}>
                  {formatCurrency(user.totalRevenue)}
                </Text>
                <Text style={[styles.cellText, styles.col15, styles.textRight]}>
                  {formatCurrency(user.totalFees)}
                </Text>
                <Text style={[styles.cellText, styles.col15, styles.textRight]}>
                  {user.lastActivity
                    ? formatDate(user.lastActivity)
                    : '-'}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Text>Halaman 3 - PeyGo</Text>
          </View>
        </Page>
      )}
    </Document>
  );
}
