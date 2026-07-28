import type { Metadata, Viewport } from 'next';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import PwaRegister from '@/components/PwaRegister';
import JsonLd from '@/components/seo/JsonLd';
import { BRAND_LOGO_MARK } from '@/lib/brand';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/schema';
import { absoluteUrl, cameroonGeoMeta, getSiteUrl } from '@/lib/seo/share';
import { SITE_KEYWORDS } from '@/lib/seo/keywords';

const SITE = getSiteUrl();
const TITLE = 'InTelleX - Learn at your pace | Tech education Cameroon';
const DESCRIPTION =
  'InTelleX is Cameroon\'s learning OS: self-paced courses, live mentors, and an AI tutor. Built in Douala by Looping Binary - serving Yaounde, Bamenda, Buea, Bafoussam and every region.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE,
    template: '%s | InTelleX Cameroon',
  },
  description: DESCRIPTION,
  applicationName: 'InTelleX',
  authors: [
    { name: 'Tatoh Modest Wilton', url: `${SITE}/about` },
    { name: 'Looping Binary', url: 'https://loopingbinary.com' },
  ],
  creator: 'Tatoh Modest Wilton · Looping Binary',
  publisher: 'Looping Binary',
  category: 'education',
  classification: 'EdTech / Online Learning / Cameroon',
  keywords: SITE_KEYWORDS,
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: SITE,
    languages: {
      'en-CM': SITE,
      'fr-CM': SITE,
      'x-default': SITE,
    },
  },
  icons: {
    icon: [
      { url: BRAND_LOGO_MARK, type: 'image/svg+xml' },
      { url: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/pwa/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/pwa/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: 'InTelleX',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    siteName: 'InTelleX',
    locale: 'en_CM',
    url: SITE,
    images: [
      {
        url: absoluteUrl('/way_selfpaced.webp'),
        width: 1200,
        height: 630,
        alt: 'InTelleX courses - tech education in Douala, Cameroon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [absoluteUrl('/way_selfpaced.webp')],
  },
  other: cameroonGeoMeta(),
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-paper text-ink font-body antialiased">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {children}
        <CookieConsent />
        <PwaRegister />
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
