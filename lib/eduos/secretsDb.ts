/**
 * Resolve tenant database connection strings from secret references.
 *
 * Never store plaintext passwords in Prisma. credentialRef values map to:
 * - env:NAME          → process.env.NAME
 * - intellex-secret:X → process.env.INTELLEX_DB_SECRET_X or TENANT_DB_URLS JSON map
 *
 * Connection strings must never be logged or returned to the browser.
 */

const TENANT_CLIENT_CACHE = new Map<
  string,
  { client: import('@prisma/client').PrismaClient; urlHash: string; lastUsed: number }
>();

function hashUrl(url: string): string {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) | 0;
  return String(h);
}

/**
 * Resolve a credentialRef to a PostgreSQL connection URL.
 * Returns null if the secret cannot be resolved.
 */
export function resolveDatabaseSecret(
  credentialRef: string | null | undefined,
): string | null {
  if (!credentialRef) return null;
  const ref = credentialRef.trim();

  // Hard refuse anything that looks like a pasted connection string stored as the ref itself.
  if (/^postgres(ql)?:\/\//i.test(ref)) {
    throw new Error('credentialRef must be a vault/env reference, not a connection string');
  }

  if (ref.startsWith('env:')) {
    const key = ref.slice(4);
    const value = process.env[key];
    return value && value.startsWith('postgres') ? value : null;
  }

  if (ref.startsWith('intellex-secret:')) {
    const key = ref.slice('intellex-secret:'.length);
    const envKey = `INTELLEX_DB_SECRET_${key.replace(/[^a-zA-Z0-9_]/g, '_').toUpperCase()}`;
    if (process.env[envKey]?.startsWith('postgres')) return process.env[envKey]!;

    // JSON map: TENANT_DB_URLS={"abc":"postgresql://..."}
    try {
      const map = JSON.parse(process.env.TENANT_DB_URLS || '{}') as Record<string, string>;
      const url = map[key];
      if (url?.startsWith('postgres')) return url;
    } catch {
      /* ignore */
    }
  }

  // Direct env var name (legacy-friendly)
  if (process.env[ref]?.startsWith('postgres')) return process.env[ref]!;

  return null;
}

export async function getOrCreateTenantPrismaClient(
  institutionId: string,
  credentialRef: string,
): Promise<import('@prisma/client').PrismaClient | null> {
  const url = resolveDatabaseSecret(credentialRef);
  if (!url) return null;

  const urlHash = hashUrl(url);
  const cached = TENANT_CLIENT_CACHE.get(institutionId);
  if (cached && cached.urlHash === urlHash) {
    cached.lastUsed = Date.now();
    return cached.client;
  }

  if (cached) {
    await cached.client.$disconnect().catch(() => {});
    TENANT_CLIENT_CACHE.delete(institutionId);
  }

  const { PrismaClient } = await import('@prisma/client');
  const client = new PrismaClient({
    datasources: { db: { url } },
    log: ['error'],
  });

  TENANT_CLIENT_CACHE.set(institutionId, { client, urlHash, lastUsed: Date.now() });
  return client;
}

/** Best-effort prune of idle tenant clients (call from health jobs). */
export async function pruneIdleTenantClients(maxIdleMs = 15 * 60 * 1000) {
  const now = Date.now();
  for (const [id, entry] of Array.from(TENANT_CLIENT_CACHE.entries())) {
    if (now - entry.lastUsed > maxIdleMs) {
      await entry.client.$disconnect().catch(() => {});
      TENANT_CLIENT_CACHE.delete(id);
    }
  }
}
