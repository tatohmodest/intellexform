/** Card accent colour per tutorial track. Kept separate so client components can use it without the catalogue. */
export const TRACK_META: Record<string, { color: string }> = {
  'computer-architecture': { color: '#0f766e' },
  html: { color: '#e44d26' },
  css: { color: '#2965f1' },
  javascript: { color: '#f0db4f' },
  react: { color: '#61dafb' },
  nextjs: { color: '#0C1116' },
  'nodejs-express': { color: '#68a063' },
  nestjs: { color: '#e0234e' },
  python: { color: '#3572A5' },
  django: { color: '#092e20' },
  flask: { color: '#37474f' },
  golang: { color: '#00ADD8' },
  postgresql: { color: '#336791' },
  mongodb: { color: '#13aa52' },
  docker: { color: '#2496ed' },
  flutter: { color: '#02569B' },
  'data-analysis': { color: '#7c3aed' },
  'digital-marketing': { color: '#f59e0b' },
  pygame: { color: '#0d7377' },
  cpp: { color: '#00599C' },
  java: { color: '#EA2D2E' },
  arduino: { color: '#00878F' },
  kubernetes: { color: '#326CE5' },
  rust: { color: '#DEA584' },
  'ruby-on-rails': { color: '#CC0000' },
  'linux-administration': { color: '#FCC624' },
  'bash-scripting': { color: '#4EAA25' },
};

export function getTrackColor(slug: string): string {
  return TRACK_META[slug]?.color ?? '#00b369';
}
