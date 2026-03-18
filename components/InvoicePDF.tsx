'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';
import { RegistrationFormData } from '@/lib/types';
import { getProgramById } from '@/lib/programs';

// ── Helpers ────────────────────────────────────────────────────────────
const pad2 = (n: number) => String(n).padStart(2, '0');

const formatDate = (d: Date) => {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${pad2(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const addDays = (d: Date, days: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
};

const fmtXAF = (n: number) =>
  'XAF ' + new Intl.NumberFormat('fr-CM').format(n);

const genInvoiceNumber = () => {
  const now = new Date();
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `INV-INTLX-${now.getFullYear()}-${rand}`;
};

// ── Styles ─────────────────────────────────────────────────────────────
const c = {
  navy: '#0F1F3D',
  navyDark: '#0A1628',
  navyMid: '#162B52',
  gold: '#0dbc66',
  goldLight: '#2bdb84',
  text: '#1A2236',
  muted: '#6B7A94',
  border: '#E2E6ED',
  bg: '#FFFFFF',
  bgAlt: '#F7F9FC',
  red: '#E24B4A',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: c.bg,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: c.text,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: c.navyDark,
    padding: '24 44 20 44',
  },
  brandName: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: c.white,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  brandSub: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  invoiceRight: {
    alignItems: 'flex-end',
  },
  invoiceLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: c.white,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: c.red,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  badgeText: {
    color: c.white,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },

  // Green accent strip
  strip: {
    height: 3,
    backgroundColor: c.gold,
  },

  invoiceLogo: { width: 32, height: 32, marginRight: 10, borderRadius: 4 },
  payLogo: { width: 28, height: 28, marginBottom: 6 },

  // Dates row
  datesRow: {
    flexDirection: 'row',
    paddingHorizontal: 44,
    paddingVertical: 14,
    backgroundColor: c.bgAlt,
    borderBottomWidth: 0.5,
    borderBottomColor: c.border,
  },
  dateBlock: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 8,
    color: c.muted,
    letterSpacing: 1,
    marginBottom: 3,
  },
  dateValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: c.text,
  },
  dateValueRed: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: c.red,
  },

  // Parties
  parties: {
    flexDirection: 'row',
    paddingHorizontal: 44,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: c.border,
  },
  party: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 8,
    color: c.muted,
    letterSpacing: 1,
    marginBottom: 6,
  },
  partyName: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: c.text,
    marginBottom: 3,
  },
  partyDetail: {
    fontSize: 10,
    color: c.muted,
    marginBottom: 2,
  },

  // Line items table
  tableSection: {
    paddingHorizontal: 44,
    paddingTop: 16,
    paddingBottom: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: c.border,
    paddingBottom: 8,
    marginBottom: 0,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: c.border,
  },
  colDesc: { flex: 3 },
  colType: { flex: 1, alignItems: 'center' },
  colQty: { flex: 0.5, alignItems: 'center' },
  colAmt: { flex: 1.2, alignItems: 'flex-end' },
  thText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: c.muted,
    letterSpacing: 0.8,
  },
  itemTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: c.text,
    marginBottom: 3,
  },
  itemSub: {
    fontSize: 9,
    color: c.muted,
    lineHeight: 1.5,
  },
  tdText: {
    fontSize: 10,
    color: c.muted,
  },
  tdAmount: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: c.text,
  },

  // Totals
  totalsSection: {
    paddingHorizontal: 44,
    paddingTop: 0,
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  totalsBox: {
    width: 220,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  totalsLabel: {
    fontSize: 10,
    color: c.muted,
  },
  totalsValue: {
    fontSize: 10,
    color: c.muted,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: c.border,
  },
  totalLabel: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: c.text,
  },
  totalValue: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: c.text,
  },

  // Payment section
  paySection: {
    marginHorizontal: 44,
    marginBottom: 14,
    backgroundColor: c.bgAlt,
    borderRadius: 8,
    padding: 14,
    borderWidth: 0.5,
    borderColor: c.border,
  },
  payLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: c.muted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  payMethods: {
    flexDirection: 'row',
    gap: 10,
  },
  payMethod: {
    flex: 1,
    backgroundColor: c.white,
    borderRadius: 6,
    padding: 10,
    borderWidth: 0.5,
    borderColor: c.border,
  },
  payMethodName: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: c.muted,
    marginBottom: 4,
  },
  payMethodNumber: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: c.text,
    marginBottom: 2,
  },
  payMethodHolder: {
    fontSize: 9,
    color: c.muted,
  },
  mtnDot: {
    display: 'flex',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFCC00',
    marginRight: 4,
  },

  // Notes
  notesSection: {
    marginHorizontal: 44,
    marginBottom: 14,
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: c.muted,
    letterSpacing: 1,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9.5,
    color: c.muted,
    lineHeight: 1.6,
  },

  // Footer
  footer: {
    marginTop: 'auto',
    borderTopWidth: 0.5,
    borderTopColor: c.border,
    paddingHorizontal: 44,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    color: c.muted,
  },
  footerBrand: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: c.navyDark,
  },
});

// ── Component ──────────────────────────────────────────────────────────
interface InvoicePDFProps {
  data: RegistrationFormData;
}

export const InvoiceDocument = ({ data }: InvoicePDFProps) => {
  const today = new Date();
  const due = addDays(today, 7);
  const invoiceNumber = genInvoiceNumber();
  const program = getProgramById(data.program);
  const fee = program ? program.registrationFee : 5000;
  const programLabel = program ? program.title : data.program;
  const learningModeLabel = data.learningMode
    ? data.learningMode.charAt(0).toUpperCase() + data.learningMode.slice(1)
    : 'Standard';

  return (
    <Document
      title={`Intellex Invoice - ${data.fullName}`}
      author="Intellex"
      subject="Tutor/Student Registration Invoice"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image src="/logo.png" style={styles.invoiceLogo} />
            <View>
              <Text style={styles.brandName}>Intellex</Text>
              <Text style={styles.brandSub}>Digital Learning Platform · Cameroon</Text>
            </View>
          </View>
          <View style={styles.invoiceRight}>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>UNPAID</Text>
            </View>
          </View>
        </View>

        <View style={styles.strip} />

        {/* Dates */}
        <View style={styles.datesRow}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>ISSUE DATE</Text>
            <Text style={styles.dateValue}>{formatDate(today)}</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>PAYMENT DUE</Text>
            <Text style={styles.dateValueRed}>{formatDate(due)}</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>PROGRAM</Text>
            <Text style={styles.dateValue}>{program?.shortTitle ?? 'General'}</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>LEARNING MODE</Text>
            <Text style={styles.dateValue}>{learningModeLabel}</Text>
          </View>
        </View>

        {/* Parties */}
        <View style={styles.parties}>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>FROM</Text>
            <Text style={styles.partyName}>Intellex</Text>
            <Text style={styles.partyDetail}>intellexplatform@gmail.com</Text>
            <Text style={styles.partyDetail}>intellex.loopingbinary.com</Text>
            <Text style={styles.partyDetail}>Cameroon (Online)</Text>
          </View>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>BILLED TO</Text>
            <Text style={styles.partyName}>{data.fullName}</Text>
            <Text style={styles.partyDetail}>{data.email}</Text>
            <Text style={styles.partyDetail}>{data.phone}</Text>
            <Text style={styles.partyDetail}>{data.city}, Cameroon</Text>
          </View>
        </View>

        {/* Line items */}
        <View style={styles.tableSection}>
          <View style={styles.tableHeader}>
            <View style={styles.colDesc}>
              <Text style={styles.thText}>DESCRIPTION</Text>
            </View>
            <View style={styles.colType}>
              <Text style={styles.thText}>TYPE</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.thText}>QTY</Text>
            </View>
            <View style={styles.colAmt}>
              <Text style={styles.thText}>AMOUNT</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.colDesc}>
              <Text style={styles.itemTitle}>Early Access Registration Fee</Text>
              <Text style={styles.itemSub}>
                One-time registration fee for the {programLabel} program on Intellex.
                Grants access to your student dashboard, program materials, and the Intellex
                learner network. Registration is activated within 24 hours of confirmed
                payment.
              </Text>
            </View>
            <View style={styles.colType}>
              <Text style={styles.tdText}>One-time</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.tdText}>1</Text>
            </View>
            <View style={styles.colAmt}>
              <Text style={styles.tdAmount}>{fmtXAF(fee)}</Text>
            </View>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{fmtXAF(fee)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Tax (0%)</Text>
              <Text style={styles.totalsValue}>XAF 0</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Due</Text>
              <Text style={styles.totalValue}>{fmtXAF(fee)}</Text>
            </View>
          </View>
        </View>

        {/* Payment methods */}
        <View style={styles.paySection}>
          <Text style={styles.payLabel}>PAYMENT METHODS (MOBILE MONEY)</Text>
          <View style={styles.payMethods}>
            <View style={styles.payMethod}>
              <Image src="/mtn.png" style={styles.payLogo} />
              <Text style={styles.payMethodName}>MTN Mobile Money</Text>
              <Text style={styles.payMethodNumber}>674 435 138</Text>
              <Text style={styles.payMethodHolder}>MODESTE TATOH</Text>
            </View>
            <View style={styles.payMethod}>
              <Image src="/orange.png" style={styles.payLogo} />
              <Text style={styles.payMethodName}>Orange Money</Text>
              <Text style={styles.payMethodNumber}>686 705 607</Text>
              <Text style={styles.payMethodHolder}>MODESTE TATOH</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>IMPORTANT - PAYMENT INSTRUCTIONS</Text>
          <Text style={styles.notesText}>
            After completing your payment, please send a screenshot of your transaction
            confirmation to WhatsApp: +237 650 318 856. Use your full name as the payment
            reference. Your registration will be activated within 24 hours of confirmed
            payment. This registration fee is non-refundable once your account is activated.
            For questions, contact us on WhatsApp at the number above.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for choosing Intellex.</Text>
          <Text style={styles.footerBrand}>Intellex · intellex.loopingbinary.com</Text>
        </View>
      </Page>
    </Document>
  );
};
