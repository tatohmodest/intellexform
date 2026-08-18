import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import {
  chargeFee,
  createFeeStructure,
  listFeeStructures,
  listOutstandingFees,
  recordFeePayment,
  requireStaff,
} from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireStaff('fees.read');
    const [structures, outstanding] = await Promise.all([listFeeStructures(), listOutstandingFees()]);
    return NextResponse.json({ structures, outstanding });
  } catch (err) {
    return staffFail(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body.action || '');

    if (action === 'create') {
      const actor = await requireStaff('fees.write');
      const created = await createFeeStructure(actor, {
        title: String(body.title || ''),
        amountXAF: Number(body.amountXAF),
        program: body.program,
      });
      return NextResponse.json({ ok: true, created });
    }

    if (action === 'charge') {
      const actor = await requireStaff('fees.write');
      const result = await chargeFee(actor, {
        structureId: body.structureId,
        studentUserId: body.studentUserId,
        title: body.title,
        amountXAF: body.amountXAF,
        allActive: Boolean(body.allActive),
      });
      return NextResponse.json({ ok: true, ...result });
    }

    if (action === 'pay') {
      const actor = await requireStaff('fees.record_payment');
      const result = await recordFeePayment(actor, {
        studentUserId: String(body.studentUserId || ''),
        chargeId: String(body.chargeId || ''),
        amountXAF: Number(body.amountXAF),
        method: String(body.method || 'other'),
        reference: body.reference,
        note: body.note,
      });
      return NextResponse.json({ ok: true, payment: result });
    }

    return NextResponse.json({ error: 'Unknown fee action.' }, { status: 400 });
  } catch (err) {
    return staffFail(err);
  }
}
