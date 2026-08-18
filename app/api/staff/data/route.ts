import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { requireStaff } from '@/lib/staff/store';
import { createDataset, listDatasets, listTemplates } from '@/lib/staff/dataWorkspace';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const actor = await requireStaff('data.read');
    const [datasets, templates] = await Promise.all([listDatasets(actor), listTemplates(actor)]);
    return NextResponse.json({ datasets, templates });
  } catch (err) {
    return staffFail(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireStaff('data.write');
    const body = await req.json().catch(() => ({}));
    const created = await createDataset(actor, {
      name: String(body.name || ''),
      description: body.description,
      category: body.category,
      templateId: body.templateId,
      fields: body.fields,
      visibility: body.visibility,
      submitAccess: body.submitAccess,
      accessDesks: body.accessDesks,
      statuses: body.statuses,
    });
    if (body.csv) {
      const { importCsv } = await import('@/lib/staff/dataWorkspace');
      const imported = await importCsv(
        actor,
        created.id,
        String(body.csv),
        undefined,
        Array.isArray(body.columns) ? body.columns : undefined,
      );
      return NextResponse.json({ ok: true, dataset: imported.dataset || created, imported: imported.imported, errors: imported.errors });
    }
    return NextResponse.json({ ok: true, dataset: created });
  } catch (err) {
    return staffFail(err);
  }
}
