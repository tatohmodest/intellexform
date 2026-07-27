import Link from 'next/link';

/** InTelleX wordmark image — use instead of plain text "Intellex" branding. */
export default function BrandLogo({
  href = '/',
  height = 32,
  className = '',
  priority = false,
}: {
  href?: string | null;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="InTelleX"
      className={`w-auto ${className}`}
      style={{ height }}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
    />
  );

  if (!href) return img;
  return (
    <Link href={href} className="inline-flex shrink-0 items-center" aria-label="InTelleX home">
      {img}
    </Link>
  );
}
