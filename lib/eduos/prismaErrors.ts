/**
 * Detect Prisma "column does not exist" (P2022) so we can soft-fail
 * until the federation SQL migration has been applied.
 */

export function isMissingPrismaColumn(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { code?: string; message?: string; meta?: { column?: string } };
  if (e.code === 'P2022') return true;
  const msg = String(e.message || '');
  return (
    msg.includes('does not exist in the current database') ||
    msg.includes('column') && msg.includes('does not exist')
  );
}
