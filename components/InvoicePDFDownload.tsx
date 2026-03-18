'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { InvoiceDocument } from './InvoicePDF';
import { RegistrationFormData } from '@/lib/types';

export default function InvoicePDFDownload({ formData }: { formData: RegistrationFormData }) {
  const renderChildren = ({ loading }: { loading: boolean }) => (
    <button
      disabled={loading}
      className={`w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${
        loading
          ? 'bg-gold-500/30 text-gold-400/60 cursor-wait'
          : 'bg-gold-500 text-navy-900 hover:bg-gold-300 hover:scale-[1.02] active:scale-[0.99]'
      }`}
    >
      {loading ? (
        <><Loader2 size={18} className="animate-spin" /> Generating invoice…</>
      ) : (
        <><Download size={18} /> Download Invoice PDF</>
      )}
    </button>
  );

  return (
    <PDFDownloadLink
      document={<InvoiceDocument data={formData} />}
      fileName={`Intellex-Invoice-${formData.fullName.replace(/\s+/g, '-')}.pdf`}
    >
      {renderChildren as unknown as React.ReactNode}
    </PDFDownloadLink>
  );
}
