import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import CurriculumPdf from '@/lib/pdf/CurriculumPdf';
import { buildProgrammeCurriculum } from '@/lib/pdf/curriculumBuild';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

/** Public: anyone browsing /programmes can download a programme's curriculum. */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const doc = buildProgrammeCurriculum(params.id);
  if (!doc) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  try {
    const buffer = await renderToBuffer(CurriculumPdf({ doc }));
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${params.id.replace(/[^a-z0-9-]/gi, '')}-curriculum.pdf"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('programme curriculum pdf:', err);
    return NextResponse.json({ error: 'pdf_failed' }, { status: 500 });
  }
}
