import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Intellex - Early Access Registration',
  description:
    'Join Intellex, the future of tech education in Cameroon. Get early access to our web development and full stack mobile development programs, live tutoring, mentorship, and AI-assisted learning.',
  keywords: ['Intellex', 'tech education', 'Cameroon', 'coding', 'web development', 'full stack mobile development', 'nextjs', 'early access'],
  openGraph: {
    title: 'Intellex - Early Access',
    description: 'The future of tech education in Cameroon is here. Register for early access.',
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
      <body className="bg-navy-900 text-intellex-text font-body antialiased">
        {children}
      </body>
    </html>
  );
}
