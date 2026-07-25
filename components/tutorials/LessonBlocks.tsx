import type { ReactNode } from 'react';
import CodeBlock from './CodeBlock';
import type { ContentBlock } from '@/lib/tutorials/types';
import { Lightbulb, AlertTriangle, StickyNote, FlaskConical, ListChecks } from 'lucide-react';

function Callout({
  icon,
  label,
  text,
  tone,
}: {
  icon: ReactNode;
  label: string;
  text: string;
  tone: 'note' | 'tip' | 'warning' | 'try';
}) {
  const styles = {
    note: { bg: 'var(--paper-dim)', border: 'var(--line)', accent: 'var(--blue-ink)' },
    tip: { bg: 'rgba(0,179,105,0.08)', border: 'rgba(0,179,105,0.22)', accent: 'var(--green-deep)' },
    warning: { bg: 'rgba(196, 98, 42, 0.08)', border: 'rgba(196, 98, 42, 0.25)', accent: '#a14d18' },
    try: { bg: 'var(--amber-soft)', border: 'rgba(74,144,226,0.28)', accent: 'var(--blue-ink)' },
  }[tone];

  return (
    <aside
      className="my-5 rounded-xl border px-4 py-3.5 sm:px-5 sm:py-4"
      style={{ background: styles.bg, borderColor: styles.border }}
    >
      <div className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: styles.accent }}>
        {icon}
        {label}
      </div>
      <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--ink)' }}>
        {text}
      </p>
    </aside>
  );
}

export default function LessonBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="tutorial-prose">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return (
              <p key={i} className="mb-4 text-[15.5px] leading-[1.75]" style={{ color: 'var(--ink-soft)' }}>
                {block.text}
              </p>
            );
          case 'h2':
            return (
              <h2
                key={i}
                className="mb-3 mt-9 border-b pb-2 font-display text-[24px] leading-tight first:mt-0"
                style={{ borderColor: 'var(--line)' }}
              >
                {block.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} className="mb-2 mt-6 font-display text-[18px] leading-snug">
                {block.text}
              </h3>
            );
          case 'ul':
            return (
              <ul key={i} className="mb-4 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="mb-4 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );
          case 'code':
            return <CodeBlock key={i} code={block.code} title={block.title} language={block.language || 'javascript'} />;
          case 'note':
            return <Callout key={i} tone="note" label="Note" text={block.text} icon={<StickyNote size={14} />} />;
          case 'tip':
            return <Callout key={i} tone="tip" label="Tip" text={block.text} icon={<Lightbulb size={14} />} />;
          case 'warning':
            return <Callout key={i} tone="warning" label="Watch out" text={block.text} icon={<AlertTriangle size={14} />} />;
          case 'try':
            return <Callout key={i} tone="try" label="Try it yourself" text={block.text} icon={<FlaskConical size={14} />} />;
          case 'table':
            return (
              <div key={i} className="my-5 overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--line)' }}>
                <table className="w-full min-w-[420px] border-collapse text-left text-[14px]">
                  <thead style={{ background: 'var(--paper-dim)' }}>
                    <tr>
                      {block.headers.map((h) => (
                        <th key={h} className="px-4 py-3 font-semibold" style={{ color: 'var(--ink)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} className="border-t" style={{ borderColor: 'var(--line)' }}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'keypoints':
            return (
              <div
                key={i}
                className="mt-8 rounded-xl border p-5"
                style={{ borderColor: 'rgba(0,179,105,0.25)', background: 'rgba(0,179,105,0.06)' }}
              >
                <div className="mb-3 flex items-center gap-2 font-display text-[18px]">
                  <ListChecks size={18} style={{ color: 'var(--green-deep)' }} />
                  Key points
                </div>
                <ul className="space-y-2 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink)' }}>
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--green)' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
