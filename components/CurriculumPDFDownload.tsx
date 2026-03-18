'use client';

import { useMemo } from 'react';
import { usePDF } from '@react-pdf/renderer';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { CurriculumDocument } from './CurriculumPDF';

interface Props {
  variant?: 'primary' | 'secondary';
}

export default function CurriculumPDFDownload({ variant = 'secondary' }: Props) {
  // Memoize the document element so usePDF doesn't re-generate on every render
  const doc = useMemo(() => <CurriculumDocument />, []);
  const [instance] = usePDF({ document: doc });

  const handleClick = () => {
    if (!instance.url) return;
    const a = document.createElement('a');
    a.href = instance.url;
    a.download = 'Intellex-Program-Guide-2026.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (instance.error) {
    return (
      <button disabled className="flex items-center gap-2 px-4 py-2.5 border border-red-500/40 text-red-400 rounded-xl text-xs font-semibold opacity-70 cursor-not-allowed shrink-0">
        <AlertCircle size={13} />
        PDF Error
      </button>
    );
  }

  if (variant === 'primary') {
    return (
      <button
        onClick={handleClick}
        disabled={instance.loading || !instance.url}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl border border-gold-500/25 text-intellex-text font-semibold text-sm hover:border-gold-500/50 hover:bg-gold-500/5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {instance.loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {instance.loading ? 'Preparing…' : 'Download Program Guide'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={instance.loading || !instance.url}
      className="flex items-center gap-2 px-4 py-2.5 border border-gold-500/30 text-gold-400 rounded-xl text-xs font-semibold hover:border-gold-500/60 hover:bg-gold-500/5 transition-all shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {instance.loading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
      {instance.loading ? 'Preparing…' : 'Program Guide'}
    </button>
  );
}
