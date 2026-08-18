import { NextResponse } from 'next/server';
import { StaffAuthError } from '@/lib/staff/store';

export function staffFail(err: unknown) {
  if (err instanceof StaffAuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error('staff api:', err);
  return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
}
