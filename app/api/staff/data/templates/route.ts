import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { requireStaff } from '@/lib/staff/store';
import { deleteSavedTemplate, listTemplates, saveDatasetTemplate } from '@/lib/staff/dataWorkspace';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const actor = await requireStaff('data.read');
    const templates = await listTemplates(actor);
    return NextResponse.json({ templates });
  } catch (err) {
    return staffFail(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireStaff('data.write');
    const body = await req.json().catch(() => ({}));
    const template = await saveDatasetTemplate(actor, {
      name: String(body.name || ''),
      description: body.description,
      category: body.category,
      statuses: body.statuses,
      fields: body.fields || [],
      datasetId: body.datasetId,
    });
    return NextResponse.json({ ok: true, template });
  } catch (err) {
    return staffFail(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const actor = await requireStaff('data.write');
    const id = new URL(req.url).searchParams.get('id') || '';
    const result = await deleteSavedTemplate(actor, id);
    return NextResponse.json(result);
  } catch (err) {
    return staffFail(err);
  }
}
