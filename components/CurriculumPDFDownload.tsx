'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { CurriculumDocument } from './CurriculumPDF';

interface Props {
  variant?: 'primary' | 'secondary';
}

export default function CurriculumPDFDownload({ variant = 'secondary' }: Props) {
  const renderChildren = ({ loading }: { loading: boolean }) =>
    variant === 'primary' ? (
      <button
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl border border-gold-500/25 text-intellex-text font-semibold text-sm hover:border-gold-500/50 hover:bg-gold-500/5 transition-all duration-200"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        Download Program Guide
      </button>
    ) : (
      <button
        type="button"
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 border border-gold-500/30 text-gold-400 rounded-xl text-xs font-semibold hover:border-gold-500/60 hover:bg-gold-500/5 transition-all shrink-0"
      >
        <Download size={13} />
        {loading ? 'Preparing…' : 'Program Guide'}
      </button>
    );

  return (
    <PDFDownloadLink
      document={<CurriculumDocument />}
      fileName="Intellex-Program-Guide-2026.pdf"
    >
      {renderChildren as unknown as React.ReactNode}
    </PDFDownloadLink>
  );
}
