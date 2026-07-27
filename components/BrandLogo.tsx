import Link from 'next/link';
import {
  BRAND_LOGO_FOOTER,
  BRAND_LOGO_FULL,
  BRAND_LOGO_MARK,
  BRAND_NAME,
} from '@/lib/brand';

type BrandLogoVariant = 'full' | 'mark' | 'footer';

/**
 * InTelleX brand mark.
 * - `full`: header wordmark (S3 InTelleX.svg)
 * - `footer`: legacy PNG mark for dark footer bars
 * - `mark`: compact icon when the wordmark cannot fit
 */
export default function BrandLogo({
  href = '/',
  height = 32,
  className = '',
  priority = false,
  variant = 'full',
  onClick,
}: {
  href?: string | null;
  height?: number;
  className?: string;
  priority?: boolean;
  variant?: BrandLogoVariant;
  onClick?: () => void;
}) {
  const src =
    variant === 'mark'
      ? BRAND_LOGO_MARK
      : variant === 'footer'
        ? BRAND_LOGO_FOOTER
        : BRAND_LOGO_FULL;

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={BRAND_NAME}
      className={`w-auto ${className}`}
      style={{ height, width: variant === 'mark' ? height : 'auto' }}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
    />
  );

  if (!href) return img;
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center"
      aria-label={`${BRAND_NAME} home`}
      onClick={onClick}
    >
      {img}
    </Link>
  );
}
