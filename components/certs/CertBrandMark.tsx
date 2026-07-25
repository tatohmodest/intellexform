/** Professional credential marks — brand-accurate colors, no AI stock photos. */

type MarkProps = {
  className?: string;
  title?: string;
};

export function AzureMark({ className = 'h-12 w-12', title = 'Microsoft Azure' }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label={title}>
      <title>{title}</title>
      <rect width="64" height="64" rx="16" fill="#F3F9FF" />
      <path d="M28.2 14 12 50h14.1l4.6-10.2L41.8 50H54L34.6 14H28.2Z" fill="#0078D4" />
      <path d="M34.8 22.5 25.6 42.8h18.1L34.8 22.5Z" fill="#50E6FF" />
      <path d="M22.4 50 31 31.2 39.8 50H22.4Z" fill="#1490DF" opacity="0.9" />
    </svg>
  );
}

export function CehMark({ className = 'h-12 w-12', title = 'EC-Council CEH' }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label={title}>
      <title>{title}</title>
      <rect width="64" height="64" rx="16" fill="#FFF5F4" />
      <path
        d="M32 8c8.5 4.2 14.8 5.4 20 5.8v16.4c0 12.8-8.2 24.2-20 27.8C20.2 54.4 12 43 12 30.2V13.8C17.2 13.4 23.5 12.2 32 8Z"
        fill="#B42318"
      />
      <path
        d="M32 12.8c7.2 3.5 12.5 4.6 16.8 5v13.4c0 10.4-6.6 19.8-16.8 22.8-10.2-3-16.8-12.4-16.8-22.8V17.8c4.3-.4 9.6-1.5 16.8-5Z"
        fill="#8F1A14"
      />
      <text
        x="32"
        y="36"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="12"
        fontWeight="700"
        letterSpacing="1.5"
      >
        CEH
      </text>
    </svg>
  );
}

export function IntellexCertMark({ className = 'h-12 w-12', title = 'Intellex Certificate' }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label={title}>
      <title>{title}</title>
      <rect width="64" height="64" rx="16" fill="#F0FBF5" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#00b369" strokeOpacity="0.22" strokeWidth="2" />
      <circle cx="32" cy="32" r="18" fill="#009a5a" />
      <path
        d="M24.5 32.8 29.2 37.4 40.2 25.8"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DataMark({ className = 'h-12 w-12', title = 'Data Analysis' }: MarkProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label={title}>
      <title>{title}</title>
      <rect width="64" height="64" rx="16" fill="#F3F8FE" />
      <rect x="14" y="34" width="8" height="16" rx="2" fill="#4A90E2" opacity="0.7" />
      <rect x="28" y="24" width="8" height="26" rx="2" fill="#1F5FA8" opacity="0.85" />
      <rect x="42" y="16" width="8" height="34" rx="2" fill="#1F5FA8" />
      <path
        d="M15 38.5 28.5 27 41 31.5 50 18"
        fill="none"
        stroke="#0C1116"
        strokeOpacity="0.55"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="18" r="2.6" fill="#00b369" />
    </svg>
  );
}

export function CertBrandMark({
  mark,
  className,
}: {
  mark: 'azure' | 'ceh' | 'intellex' | 'data';
  className?: string;
}) {
  switch (mark) {
    case 'azure':
      return <AzureMark className={className} />;
    case 'ceh':
      return <CehMark className={className} />;
    case 'intellex':
      return <IntellexCertMark className={className} />;
    case 'data':
      return <DataMark className={className} />;
    default:
      return null;
  }
}
