import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { requireStaff } from '@/lib/staff/store';
import { createDataset, listDatasets } from '@/lib/staff/dataWorkspace';
import { DATASET_TEMPLATES } from '@/lib/staff/dataTypes';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const actor = await requireStaff('data.read');
    const datasets = await listDatasets(actor);
    return NextResponse.json({ datasets, templates: DATASET_TEMPLATES });
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
      visibility: body.visibility,
      submitAccess: body.submitAccess,
      accessDesks: body.accessDesks,
      statuses: body.statuses,
    });
    return NextResponse.json({ ok: true, dataset: created });
  } catch (err) {
    return staffFail(err);
  }
}
