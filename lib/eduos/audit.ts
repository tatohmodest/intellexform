import type { AuditAction, Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

export type AuditInput = {
  action: AuditAction;
  actorId?: string | null;
  institutionId?: string | null;
  entityType?: string;
  entityId?: string;
  summary?: string;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Prisma.InputJsonValue;
};

/**
 * Every important action must be recorded.
 * Failures to write audit should be logged but never silently swallowed in prod ops UIs.
 */
export async function writeAuditLog(input: AuditInput) {
  try {
    return await prisma.auditLog.create({
      data: {
        action: input.action,
        actorId: input.actorId ?? undefined,
        institutionId: input.institutionId ?? undefined,
        entityType: input.entityType,
        entityId: input.entityId,
        summary: input.summary,
        ip: input.ip ?? undefined,
        userAgent: input.userAgent ?? undefined,
        metadata: input.metadata ?? {},
      },
    });
  } catch (err) {
    console.error('[eduos.audit] failed to write audit log', err, input);
    return null;
  }
}
