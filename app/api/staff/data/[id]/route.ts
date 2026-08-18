import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { requireStaff } from '@/lib/staff/store';
import {
  askDataset,
  bulkRecords,
  datasetAnalytics,
  exportCsv,
  formLookups,
  getDataset,
  importCsv,
  listAudit,
  listRecords,
  previewCsv,
  deleteDataset,
  updateDataset,
  upsertRecord,
} from '@/lib/staff/dataWorkspace';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const actor = await requireStaff('data.read');
    const url = new URL(req.url);
    const view = url.searchParams.get('view') || 'records';
    if (view === 'meta') {
      const dataset = await getDataset(actor, params.id);
      return NextResponse.json({ dataset });
    }
    if (view === 'analytics') {
      const analytics = await datasetAnalytics(actor, params.id);
      return NextResponse.json({ analytics });
    }
    if (view === 'audit') {
      const audit = await listAudit(actor, params.id, url.searchParams.get('recordId') || undefined);
      return NextResponse.json({ audit });
    }
    if (view === 'export') {
      const file = await exportCsv(actor, params.id);
      return new NextResponse(file.csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${file.filename}"`,
        },
      });
    }
    let filters: Array<{ fieldId: string; op: string; value: string }> | undefined;
    const rawFilters = url.searchParams.get('filters');
    if (rawFilters) {
      try {
        const parsed = JSON.parse(rawFilters);
        if (Array.isArray(parsed)) filters = parsed;
      } catch {
        filters = undefined;
      }
    }
    const data = await listRecords(actor, params.id, {
      q: url.searchParams.get('q') || undefined,
      status: url.searchParams.get('status') || undefined,
      tag: url.searchParams.get('tag') || undefined,
      sort: url.searchParams.get('sort') || undefined,
      dir: url.searchParams.get('dir') === 'asc' ? 'asc' : 'desc',
      page: Number(url.searchParams.get('page') || '1'),
      trash: url.searchParams.get('trash') === '1',
      filters,
    });
    const lookups = await formLookups();
    return NextResponse.json({ ...data, lookups });
  } catch (err) {
    return staffFail(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const actor = await requireStaff('data.write');
    const body = await req.json().catch(() => ({}));
    const dataset = await updateDataset(actor, params.id, body);
    return NextResponse.json({ ok: true, dataset });
  } catch (err) {
    return staffFail(err);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body.action || 'save');
    if (action === 'ask') {
      const actor = await requireStaff('data.read');
      const result = await askDataset(actor, params.id, String(body.question || ''));
      return NextResponse.json(result);
    }
    const actor = await requireStaff('data.write');
    if (action === 'save') {
      const record = await upsertRecord(actor, params.id, {
        id: body.id,
        values: body.values || {},
        status: body.status,
        tags: body.tags,
        source: body.source,
      });
      return NextResponse.json({ ok: true, record });
    }
    if (action === 'bulk') {
      const result = await bulkRecords(actor, params.id, {
        ids: Array.isArray(body.ids) ? body.ids.map(String) : [],
        action: body.bulkAction,
        value: body.value,
      });
      return NextResponse.json(result);
    }
    if (action === 'importPreview') {
      const dataset = await getDataset(actor, params.id);
      return NextResponse.json(previewCsv(dataset, String(body.csv || '')));
    }
    if (action === 'import') {
      const result = await importCsv(actor, params.id, String(body.csv || ''), body.mapping);
      return NextResponse.json(result);
    }
    if (action === 'delete_dataset') {
      const result = await deleteDataset(actor, params.id);
      return NextResponse.json(result);
    }
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (err) {
    return staffFail(err);
  }
}
