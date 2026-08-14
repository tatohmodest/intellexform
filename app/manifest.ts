import type { MetadataRoute } from 'next';
import { CANONICAL_SITE_URL } from '@/lib/platformHosts';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'InTelleX',
    short_name: 'InTelleX',
    description:
      'Learn at your pace - self-paced courses, live mentors, and an AI tutor. Built in Cameroon.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#FFFFFF',
    theme_color: '#FFFFFF',
    lang: 'en',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/pwa/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/pwa/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    id: CANONICAL_SITE_URL,
  };
}
