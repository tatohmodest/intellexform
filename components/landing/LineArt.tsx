/**
 * Hand-drawn style line art for the public site: ink strokes, InTelleX green accents.
 * Pairs with the Open Doodles people in /public/doodles (CC0).
 */

const INK = '#0C1116';
const GREEN = '#00b369';

/** A cog outline centred on (cx, cy). */
export function Gear({ cx, cy, r, teeth = 9, fill = 'none' }: { cx: number; cy: number; r: number; teeth?: number; fill?: string }) {
  const outer = r;
  const inner = r * 0.78;
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const corners = [
      [inner, a - step * 0.32],
      [outer, a - step * 0.18],
      [outer, a + step * 0.18],
      [inner, a + step * 0.32],
    ];
    for (const [rad, ang] of corners) pts.push(`${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`);
  }
  return (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round" fill={fill}>
      <polygon points={pts.join(' ')} />
      <circle cx={cx} cy={cy} r={r * 0.36} fill="#fff" />
    </g>
  );
}

/** Hero scene: a laptop full of code, with a lens checking one line. */
export function LaptopReview({ className = '' }: { className?: string }) {
  const lines = [
    [70, 60], [88, 120], [88, 90], [70, 140], [106, 70], [106, 110], [88, 60], [70, 100], [88, 130], [70, 80],
  ];
  return (
    <svg viewBox="0 0 560 420" fill="none" className={className} role="img" aria-label="A laptop showing code, with one line being checked under a magnifying lens">
      {/* orbit lines */}
      <path d="M40 220 C 40 110, 130 40, 250 30" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <path d="M62 236 C 66 140, 140 76, 236 62" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeDasharray="2 10" />
      <path d="M244 22 l 14 8 -14 8" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="470" cy="40" r="7" stroke={INK} strokeWidth={2.5} />
      <path d="M506 70 v18 M497 79 h18" stroke={INK} strokeWidth={2} strokeLinecap="round" />

      {/* gears */}
      <Gear cx={430} cy={92} r={30} />
      <Gear cx={486} cy={118} r={22} teeth={8} />
      <Gear cx={104} cy={300} r={24} teeth={8} />

      {/* screen */}
      <rect x="150" y="96" width="290" height="200" rx="14" fill="#fff" stroke={INK} strokeWidth={4} />
      <rect x="166" y="112" width="258" height="168" rx="6" stroke={INK} strokeWidth={2} />
      {lines.map(([x, w], i) => (
        <g key={i}>
          <rect x={x + 112} y={124 + i * 15} width={10} height={6} rx={2} fill={i % 3 === 0 ? GREEN : INK} />
          <rect x={x + 128} y={124 + i * 15} width={w} height={6} rx={3} stroke={INK} strokeWidth={1.5} />
        </g>
      ))}
      {/* base */}
      <path d="M150 296 L 112 344 H 478 L 440 296" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M104 344 H 486 V 356 Q 486 362 480 362 H 110 Q 104 362 104 356 Z" fill={INK} />
      <path d="M262 318 H 330" stroke={INK} strokeWidth={3} strokeLinecap="round" />

      {/* lens */}
      <g>
        <line x1="420" y1="250" x2="466" y2="300" stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <circle cx="384" cy="212" r="52" fill="#fff" stroke={INK} strokeWidth={5} />
        <circle cx="384" cy="212" r="40" fill={GREEN} fillOpacity={0.14} stroke={INK} strokeWidth={2} />
        <path d="M364 212 l 13 13 25 -27" stroke={GREEN} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* review bubble */}
      <g transform="translate(36 120)">
        <rect width="118" height="44" rx="12" fill="#fff" stroke={INK} strokeWidth={2.5} />
        <circle cx="22" cy="22" r="9" fill={GREEN} />
        <path d="M17.5 22 l3 3 6-6.5" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="40" y="15" width="60" height="5" rx="2.5" fill={INK} />
        <rect x="40" y="25" width="40" height="5" rx="2.5" fill={INK} fillOpacity={0.25} />
      </g>
    </svg>
  );
}

/** Lines converging on a green node: every piece of work ends in a review. */
export function ReviewNode({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={className} aria-hidden>
      <path d="M20 40 C 80 40, 70 110, 132 112" stroke={INK} strokeWidth={2} />
      <path d="M20 200 C 80 200, 70 130, 132 128" stroke={INK} strokeWidth={2} />
      <path d="M160 0 V 88" stroke={GREEN} strokeWidth={5} strokeLinecap="round" />
      <path d="M188 120 H 250 C 290 120, 280 60, 320 60" stroke={GREEN} strokeWidth={5} strokeLinecap="round" />
      <path d="M160 152 V 240" stroke={GREEN} strokeWidth={5} strokeLinecap="round" />
      <path d="M220 200 C 260 200, 270 170, 320 170" stroke={INK} strokeWidth={2} />
      <rect x="124" y="84" width="72" height="72" rx="14" fill={GREEN} stroke={INK} strokeWidth={3} />
      <path d="M144 121 l 11 11 22 -24" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
