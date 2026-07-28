import { NextRequest, NextResponse } from 'next/server';
import {
  isPlatformHost,
  normalizeHostname,
  resolveInstitutionByHost,
} from '@/lib/learn/institutionDomains';

export const dynamic = 'force-dynamic';

/** Public resolver used by the campus gateway (and diagnostics). */
export async function GET(req: NextRequest) {
  const host =
    req.nextUrl.searchParams.get('host') ||
    req.headers.get('x-forwarded-host') ||
    req.headers.get('host');

  const normalized = normalizeHostname(host);
  if (!normalized) {
    return NextResponse.json({ host: null, institution: null, platform: true });
  }
  if (isPlatformHost(normalized)) {
    return NextResponse.json({ host: normalized, institution: null, platform: true });
  }

  const institution = await resolveInstitutionByHost(normalized);
  return NextResponse.json({
    host: normalized,
    platform: false,
    institution,
  });
}
