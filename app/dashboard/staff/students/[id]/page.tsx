import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatXAF } from '@/lib/staff/permissions';
import { requireStaffPage } from '@/lib/staff/guard';
import { getStudentDetail, listFeeStructures, listCampuses } from '@/lib/staff/store';
import StudentEditor from '@/components/staff/StudentEditor';
import ChargeStudent from '@/components/staff/ChargeStudent';

export const dynamic = 'force-dynamic';

export default async function StaffStudentDetailPage({ params }: { params: { id: string } }) {
  const actor = await requireStaffPage('students.read');
  const student = await getStudentDetail(params.id, actor);
  if (!student) notFound();

  const canWrite = actor.permissions.includes('students.write');
  const canStatus = actor.permissions.includes('students.status');
  const canFees = actor.permissions.includes('fees.read');
  const canCharge = actor.permissions.includes('fees.write');
  const [structures, campuses] = await Promise.all([
    canCharge ? listFeeStructures() : Promise.resolve([] as Awaited<ReturnType<typeof listFeeStructures>>),
    listCampuses(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/staff/students" className="text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
          ← All students
        </Link>
        <h1 className="mt-2 font-display text-[30px] leading-tight">{student.name}</h1>
        <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          {student.email} · {student.record.studentCode} · {student.record.status.replace(/_/g, ' ')}
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ['Program', student.record.program || 'Not set'],
          ['Department', student.record.department || 'Not set'],
          ['Fees due', canFees ? formatXAF(student.outstandingXAF) : 'Hidden'],
        ].map(([label, value]) => (
          <div key={label} className="border p-4" style={{ borderColor: 'var(--line)' }}>
            <p className="font-display text-[20px]">{value}</p>
            <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
              {label}
            </p>
          </div>
        ))}
      </section>

      <StudentEditor
        userId={student.userId}
        canWrite={canWrite}
        canStatus={canStatus}
        record={student.record}
        campuses={campuses}
      />

      {canCharge ? <ChargeStudent userId={student.userId} structures={structures} /> : null}

      <section className="border p-4" style={{ borderColor: 'var(--line)' }}>
        <h2 className="mb-3 font-display text-[20px]">Courses</h2>
        {student.courses.length === 0 ? (
          <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            This student is not enrolled in any courses yet.
          </p>
        ) : (
          <ul className="space-y-1 text-[14px]">
            {student.courses.map((c) => (
              <li key={`${c.kind}-${c.id}`}>
                {c.title}{' '}
                <span style={{ color: 'var(--ink-soft)' }}>({c.kind})</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {canFees ? (
        <section className="border p-4" style={{ borderColor: 'var(--line)' }}>
          <h2 className="mb-3 font-display text-[20px]">Payments</h2>
          {student.payments.length === 0 ? (
            <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              No payments recorded.
            </p>
          ) : (
            <ul className="space-y-2 text-[14px]">
              {student.payments.map((p) => (
                <li key={p.id}>
                  {formatXAF(p.amountXAF)} · {p.method}
                  {p.receiptCode ? ` · ${p.receiptCode}` : ''}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
