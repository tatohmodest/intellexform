import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { StaffAuthError } from '@/lib/staff/store';
import { formLookups, getDataset, submitForm } from '@/lib/staff/dataWorkspace';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const dataset = await getDataset(null, params.slug, { public: true });
    const lookups = await formLookups();
    return NextResponse.json({
      dataset: {
        name: dataset.name,
        description: dataset.description,
        slug: dataset.slug,
        fields: dataset.fields.filter((f) => !f.sensitive),
        statuses: dataset.statuses,
        submitAccess: dataset.submitAccess,
      },
      lookups,
    });
  } catch (err) {
    const status = err instanceof StaffAuthError ? err.status : 500;
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Not found' }, { status });
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = getSessionUser();
    const body = await req.json().catch(() => ({}));
    const result = await submitForm(params.slug, body.values || {}, {
      userId: session?.uid,
      name: session?.name,
      email: session?.email,
    });
    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof StaffAuthError ? err.status : 400;
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Could not submit' }, { status });
  }
}
