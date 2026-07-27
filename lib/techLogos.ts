/**
 * Official / brand tech logos for catalog tracks.
 * Stored under /public/tech — no emoji icons in the product UI.
 */
export const TRACK_LOGOS: Record<string, string> = {
  html: '/tech/html.png',
  css: '/tech/css.png',
  javascript: '/tech/javascript.png',
  nextjs: '/tech/nextjs.png',
  'nodejs-express': '/tech/nodejs.gif',
  nestjs: '/tech/nestjs.svg',
  python: '/tech/python.png',
  django: '/tech/django.jpg',
  flask: '/tech/flask.png',
  golang: '/tech/golang.png',
  postgresql: '/tech/postgresql.png',
  mongodb: '/tech/mongodb.svg',
  docker: '/tech/docker.png',
  flutter: '/tech/flutter.png',
  'data-analysis': '/tech/data-analysis.jpg',
  pygame: '/tech/pygame.png',
  'computer-architecture': '/tech/cpu.svg',
  'digital-marketing': '/tech/marketing.svg',
};

export function getTrackLogo(slug: string): string | null {
  return TRACK_LOGOS[slug] ?? null;
}
