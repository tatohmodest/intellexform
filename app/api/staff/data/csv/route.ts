import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { requireStaff } from '@/lib/staff/store';
import { previewCsv, type DatasetDoc } from '@/lib/staff/dataWorkspace';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await requireStaff('data.write');
    const body = await req.json().catch(() => ({}));
    const dummy = { fields: [] } as DatasetDoc;
    return NextResponse.json(previewCsv(dummy, String(body.csv || '')));
  } catch (err) {
    return staffFail(err);
  }
}
