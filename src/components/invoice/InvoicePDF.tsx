/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Invoice, InvoiceItem, Profile, Supplier } from "@/types/database";

// Register fonts if needed - using standard Helvetica for now which is built-in
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff'
// });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#0F172A', // slate-900
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  companyInfo: {
    flexDirection: 'column',
    gap: 4,
    maxWidth: '50%',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyText: {
    fontSize: 10,
    color: '#475569', // slate-600
    marginBottom: 2,
  },
  invoiceInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#0F172A',
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#F97316', // primary orange
    marginBottom: 8,
    fontFamily: 'Helvetica-Bold',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9', // slate-100
    fontSize: 10,
    fontWeight: 'bold',
  },
  metadataGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  metadataColumn: {
    flexDirection: 'column',
    width: '30%',
  },
  label: {
    fontSize: 8,
    color: '#64748B', // slate-500
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 10,
    marginBottom: 3,
    color: '#0F172A',
  },
  qrContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  qrCode: {
    width: 80,
    height: 80,
  },
  table: {
    width: '100%',
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: '#0F172A',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
  },
  colDesc: { width: '50%', textAlign: 'left' },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '17.5%', textAlign: 'right' },
  colTotal: { width: '17.5%', textAlign: 'right' },
  
  headerText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  paymentInfo: {
    width: '50%',
  },
  bankBox: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  bankIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#0F172A',
    borderRadius: 8,
  },
  bankDetails: {
    justifyContent: 'center',
  },
  totalsInfo: {
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalLabel: {
    color: '#64748B',
    fontSize: 10,
  },
  totalValue: {
    color: '#0F172A',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F97316',
  },
  terbilang: {
    fontSize: 8,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'right',
  },
  notes: {
    marginTop: 20,
  },
});

interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
  profile?: Profile | null;
  supplier?: Supplier | null;
}

interface InvoicePDFProps {
  invoice: InvoiceWithItems;
  qrCodeDataUrl: string | null;
  logoDataUrl?: string | null;
  isBilling: boolean;
}

const formatCurrency = (val: number) => 
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

const formatDate = (date: string) => 
  new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

// Helper to convert number to words (terbilang simple version)
const terbilang = (angka: number): string => {
  const bil = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  let kalimat = "";
  if (angka < 12) {
    kalimat = " " + bil[angka];
  } else if (angka < 20) {
    kalimat = terbilang(angka - 10) + " Belas";
  } else if (angka < 100) {
    kalimat = terbilang(Math.floor(angka / 10)) + " Puluh" + terbilang(angka % 10);
  } else if (angka < 200) {
    kalimat = " Seratus" + terbilang(angka - 100);
  } else if (angka < 1000) {
    kalimat = terbilang(Math.floor(angka / 100)) + " Ratus" + terbilang(angka % 100);
  } else if (angka < 2000) {
    kalimat = " Seribu" + terbilang(angka - 1000);
  } else if (angka < 1000000) {
    kalimat = terbilang(Math.floor(angka / 1000)) + " Ribu" + terbilang(angka % 1000);
  } else if (angka < 1000000000) {
    kalimat = terbilang(Math.floor(angka / 1000000)) + " Juta" + terbilang(angka % 1000000);
  } else if (angka < 1000000000000) {
    kalimat = terbilang(Math.floor(angka / 1000000000)) + " Milyar" + terbilang(angka % 1000000000);
  }
  return kalimat;
}

export const InvoicePDF = ({ invoice, qrCodeDataUrl, logoDataUrl, isBilling }: InvoicePDFProps) => {
  const profile = invoice.profile;
  const supplier = invoice.supplier;
  const statusFormatted = (invoice.status || "DRAFT").toUpperCase();
  
  // Calculations
  const discountAmount = invoice.discount_type === 'percentage' 
    ? ((invoice.subtotal || invoice.amount) * (invoice.discount_value || 0)) / 100 
    : (invoice.discount_value || 0);

  const taxAmount = invoice.tax_enabled 
    ? ((invoice.subtotal || invoice.amount) - discountAmount) * ((invoice.tax_rate || 11) / 100) 
    : 0;
    
  const totalAmount = (invoice.subtotal || invoice.amount) - discountAmount + taxAmount;
  const terbilangText = terbilang(Math.round(totalAmount)) + " Rupiah";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            {/* Logo Area */}
            <View style={{marginBottom: 8}}>
              {logoDataUrl ? (
                <Image 
                  src={logoDataUrl} 
                  style={{height: 40, objectFit: 'contain'}} 
                />
              ) : (
                <Text style={{fontSize: 24, fontWeight: 'bold', letterSpacing: -1}}>
                  <Text style={{color: '#F97316'}}>Pey</Text>
                  <Text style={{color: '#0F172A'}}>Go</Text>
                </Text>
              )}
            </View>
            
            <Text style={styles.companyName}>{profile?.company_name || profile?.name}</Text>
            {profile?.company_address && <Text style={styles.companyText}>{profile.company_address}</Text>}
            {profile?.phone && <Text style={styles.companyText}><Text style={{color: '#94A3B8'}}>Tel: </Text>{profile.phone}</Text>}
            {profile?.email && <Text style={styles.companyText}><Text style={{color: '#94A3B8'}}>Email: </Text>{profile.email}</Text>}
          </View>
          
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>{isBilling ? "INVOICE" : "BUKTI PEMBAYARAN"}</Text>
            <Text style={styles.invoiceNumber}>#{invoice.invoice_number}</Text>
            <View style={{
               ...styles.statusBadge, 
               backgroundColor: statusFormatted === 'LUNAS' || statusFormatted === 'PAID' ? '#DCFCE7' : '#F1F5F9',
               alignSelf: 'flex-end'
            }}>
              <Text style={{
                fontSize: 10, 
                fontWeight: 'bold',
                color: statusFormatted === 'LUNAS' || statusFormatted === 'PAID' ? '#166534' : '#64748B'
              }}>{statusFormatted}</Text>
            </View>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.metadataGrid}>
          {/* Bill To */}
          <View style={styles.metadataColumn}>
            <Text style={styles.label}>{isBilling ? "TAGIHAN KEPADA" : "DIBAYAR KEPADA"}</Text>
            <Text style={{...styles.value, fontWeight: 'bold', fontSize: 11}}>{invoice.recipient_name}</Text>
            {invoice.recipient_address && <Text style={styles.value}>{invoice.recipient_address}</Text>}
            {invoice.recipient_phone && <Text style={styles.value}>Tel: {invoice.recipient_phone}</Text>}
            {invoice.recipient_email && <Text style={styles.value}>{invoice.recipient_email}</Text>}
          </View>

          {/* Dates */}
          <View style={styles.metadataColumn}>
            <Text style={styles.label}>TANGGAL</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
              <Text style={{fontSize: 10, color: '#64748B'}}>Tanggal Invoice:</Text>
              <Text style={{...styles.value, marginLeft: 10}}>{formatDate(invoice.created_at)}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontSize: 10, color: '#64748B'}}>Jatuh Tempo:</Text>
              <Text style={{...styles.value, color: '#EF4444', marginLeft: 10}}>
                {invoice.due_date ? formatDate(invoice.due_date) : "-"}
              </Text>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.metadataColumn}>
            {isBilling && qrCodeDataUrl ? (
              <View style={styles.qrContainer}>
                <Image src={qrCodeDataUrl} style={styles.qrCode} />
                <Text style={{fontSize: 8, color: '#64748B', marginTop: 4}}>Scan untuk bayar</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colDesc]}>DESKRIPSI</Text>
            <Text style={[styles.headerText, styles.colQty]}>QTY</Text>
            <Text style={[styles.headerText, styles.colPrice]}>HARGA</Text>
            <Text style={[styles.headerText, styles.colTotal]}>JUMLAH</Text>
          </View>

          {invoice.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text style={styles.value}>{item.description}</Text>
                {item.notes && <Text style={{fontSize: 8, color: '#64748B', marginTop: 2}}>{item.notes}</Text>}
              </View>
              <Text style={[styles.value, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.value, styles.colPrice]}>{formatCurrency(item.unit_price)}</Text>
              <Text style={{...styles.value, ...styles.colTotal, fontFamily: 'Helvetica-Bold'}}>
                {formatCurrency(item.quantity * item.unit_price)}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Payment Details */}
          <View style={styles.paymentInfo}>
             <Text style={styles.label}>{isBilling ? "PEMBAYARAN KE" : "TRANSFER KE"}</Text>
             <View style={styles.bankBox}>
                <View style={styles.bankDetails}>
                  <Text style={{fontWeight: 'bold', fontSize: 10}}>
                    {isBilling 
                      ? (profile?.bank_name || "-") 
                      : (invoice.recipient_bank_name || supplier?.bank_name || "-")
                    }
                  </Text>
                  <Text style={{fontFamily: 'Helvetica-Bold', fontSize: 12, color: '#F97316', marginVertical: 2}}>
                    {isBilling 
                      ? (profile?.bank_account_number || "-")
                      : (invoice.recipient_bank_account_number || supplier?.bank_account_number || "-")
                    }
                  </Text>
                  <Text style={{fontSize: 10, color: '#475569'}}>
                    a.n. {isBilling 
                      ? (profile?.bank_account_name || profile?.name || "-")
                      : (invoice.recipient_bank_account_name || supplier?.bank_account_name || "-")
                    }
                  </Text>
                </View>
             </View>

             {invoice.description && (
               <View style={styles.notes}>
                 <Text style={styles.label}>CATATAN</Text>
                 <Text style={styles.value}>{invoice.description}</Text>
               </View>
             )}
          </View>

          {/* Totals */}
          <View style={styles.totalsInfo}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal || invoice.amount)}</Text>
            </View>
            
            {discountAmount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Diskon {invoice.discount_type === 'percentage' ? `(${invoice.discount_value}%)` : ''}
                </Text>
                <Text style={{...styles.totalValue, color: '#EF4444'}}>-{formatCurrency(discountAmount)}</Text>
              </View>
            )}

            {invoice.tax_enabled && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>PPN ({invoice.tax_rate || 11}%)</Text>
                <Text style={styles.totalValue}>{formatCurrency(taxAmount)}</Text>
              </View>
            )}

            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalLabel}>TOTAL</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(totalAmount)}</Text>
            </View>
            <Text style={styles.terbilang}>{terbilangText}</Text>
          </View>
        </View>

        {/* Footer Bottom */}
        <View style={{
          marginTop: 40,
          borderTopWidth: 1, 
          borderTopColor: '#E2E8F0', 
          paddingTop: 20,
          alignItems: 'center'
        }}>
          <Text style={{fontSize: 8, color: '#94A3B8', marginBottom: 4}}>
            Invoice ini dibuat secara digital dan sah tanpa tanda tangan.
          </Text>
          <Text style={{fontSize: 8, color: '#94A3B8'}}>
            Dibuat dengan <Text style={{color: '#F97316', fontWeight: 'bold'}}>PeyGo</Text> • peygo.id
          </Text>
        </View>

      </Page>
    </Document>
  );
};
