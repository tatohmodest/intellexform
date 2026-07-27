import type { Metadata } from 'next';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';
import { BRAND_LOGO_MARK } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Intellex - Learn at your pace, on your terms',
  description:
    'Intellex is where you actually finish what you start — self-paced courses, live mentors, and an AI tutor that studies a book so it can teach it to you, one level at a time. Built in Cameroon.',
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
    'Vocational training'
  ],
  icons: {
    icon: [{ url: BRAND_LOGO_MARK, type: 'image/svg+xml' }],
    apple: [{ url: BRAND_LOGO_MARK }],
  },
  openGraph: {
    title: 'Intellex — Learn at your pace, on your terms',
    description:
      'Self-paced courses, live mentors, and an AI tutor. Skills to income, one level at a time.',
    type: 'website',
  },
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
      </body>
    </html>
  );
}
