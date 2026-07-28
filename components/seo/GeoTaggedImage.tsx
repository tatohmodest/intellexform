'use client';

import { useState } from 'react';
import { geoImageAlt, SITE_GEO } from '@/lib/seo/keywords';

type Props = {
  src: string;
  name: string;
  className?: string;
  /** Aspect wrapper styles handled by parent when false */
  fill?: boolean;
};

/**
 * Course / marketing image with HTML + microdata geo signals.
 * Search engines and knowledge graphs can associate the asset with Cameroon / Douala
 * even when the binary file itself has no EXIF GPS (common for CDN uploads).
 */
export default function GeoTaggedImage({ src, name, className, fill = true }: Props) {
  const [ok, setOk] = useState(Boolean(src));
  const alt = geoImageAlt(name);

  if (!ok) {
    return (
      <span
        className="px-4 text-center font-display text-[13px] sm:text-base"
        style={{ color: 'var(--green-deep)' }}
      >
        {name}
      </span>
    );
  }

  return (
    <span
      itemScope
      itemType="https://schema.org/ImageObject"
      className={fill ? 'absolute inset-0 block h-full w-full' : 'contents'}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        title={`${name} · ${SITE_GEO.placename}`}
        itemProp="contentUrl"
        className={
          className ||
          (fill
            ? 'absolute inset-0 h-full w-full object-cover'
            : 'h-auto w-full object-cover')
        }
        loading="lazy"
        decoding="async"
        onError={() => setOk(false)}
        data-geo-country={SITE_GEO.countryCode}
        data-geo-region={SITE_GEO.regionCode}
        data-geo-city={SITE_GEO.city}
        data-geo-position={SITE_GEO.geoPosition}
      />
      <meta itemProp="name" content={name} />
      <meta itemProp="description" content={alt} />
      <meta itemProp="caption" content={`${name} - InTelleX, ${SITE_GEO.placename}`} />
      <span itemProp="contentLocation" itemScope itemType="https://schema.org/Place" className="hidden">
        <meta itemProp="name" content={SITE_GEO.placename} />
        <span itemProp="geo" itemScope itemType="https://schema.org/GeoCoordinates">
          <meta itemProp="latitude" content={String(SITE_GEO.latitude)} />
          <meta itemProp="longitude" content={String(SITE_GEO.longitude)} />
        </span>
        <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <meta itemProp="addressLocality" content={SITE_GEO.city} />
          <meta itemProp="addressRegion" content={SITE_GEO.region} />
          <meta itemProp="addressCountry" content={SITE_GEO.countryCode} />
        </span>
      </span>
    </span>
  );
}
