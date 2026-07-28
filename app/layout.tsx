import type { Metadata, Viewport } from 'next';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import PwaRegister from '@/components/PwaRegister';
import { BRAND_LOGO_MARK } from '@/lib/brand';
import { absoluteUrl, getSiteUrl } from '@/lib/seo/share';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Intellex - Learn at your pace, on your terms',
  description:
    'Intellex is where you actually finish what you start - self-paced courses, live mentors, and an AI tutor that studies a book so it can teach it to you, one level at a time. Built in Cameroon.',
  applicationName: 'InTelleX',
  keywords: [
    'Intellex',
    'tech education',
    'Cameroon',
    'coding courses',
    'web development',
    'data science',
    'cybersecurity',
    'AI tutor',
    'live tutoring',
    'Digital marketing',
    'Digital skills',
    'Vocational training',
  ],
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
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Intellex - Learn at your pace, on your terms',
    description:
      'Self-paced courses, live mentors, and an AI tutor. Skills to income, one level at a time.',
    type: 'website',
    siteName: 'InTelleX',
    images: [
      {
        url: absoluteUrl('/way_selfpaced.webp'),
        width: 1200,
        height: 630,
        alt: 'InTelleX courses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intellex - Learn at your pace, on your terms',
    description:
      'Self-paced courses, live mentors, and an AI tutor. Skills to income, one level at a time.',
    images: [absoluteUrl('/way_selfpaced.webp')],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00b369' },
    { media: '(prefers-color-scheme: dark)', color: '#0C1116' },
  ],
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
        {children}
        <CookieConsent />
        <PwaRegister />
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
