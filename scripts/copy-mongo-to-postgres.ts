/**
 * Copy every MongoDB collection into the PostgreSQL `app_documents` table that
 * `lib/db/documentStore.ts` reads.
 *
 *   npx tsx scripts/copy-mongo-to-postgres.ts --dry-run     # read both sides, write nothing
 *   npx tsx scripts/copy-mongo-to-postgres.ts               # copy documents that are missing
 *   npx tsx scripts/copy-mongo-to-postgres.ts --verify      # compare counts per collection
 *
 * Options:
 *   --only=learners,auth_credentials   limit to these collections
 *   --overwrite                        also replace documents already in Postgres with the
 *                                      Mongo version (default: leave them alone, so anything
 *                                      written to Postgres after the switch is kept)
 *
 * Reads MONGODB_URL (or MONGODB_URI) and MONGODB_DB (default "intellex") for the
 * source, and DATABASE_URL for the target. MongoDB is only ever read, never written.
 * Safe to run any number of times: documents keep their Mongo `_id` as their id.
 */

import { MongoClient, type Document } from 'mongodb';
import { PrismaClient, Prisma } from '@prisma/client';

const args = new Set(process.argv.slice(2).filter((a) => !a.includes('=')));
const opts = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.includes('='))
    .map((a) => a.replace(/^--/, '').split('=') as [string, string]),
);
const DRY_RUN = args.has('--dry-run');
const VERIFY = args.has('--verify');
const OVERWRITE = args.has('--overwrite');
const ONLY = opts.only ? new Set(opts.only.split(',').map((s) => s.trim()).filter(Boolean)) : null;

function requireEnv(...names: string[]): string {
  for (const name of names) {
    const value = (process.env[name] || '').trim();
    if (value && !/^\[.*\]$/.test(value)) return value;
  }
  throw new Error(
    `${names.join(' or ')} is not set (or is a placeholder like "[SENSITIVE]"). Put the real value in .env.`,
  );
}

/** Same shape documentStore writes: plain JSON, ObjectIds as hex strings, dates as ISO strings. */
function toPayload(doc: Document): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify({ ...doc, _id: String(doc._id) }));
}

function createdAtOf(doc: Document): Date {
  const raw = doc.createdAt;
  const date = raw instanceof Date ? raw : raw ? new Date(String(raw)) : null;
  if (date && !Number.isNaN(date.getTime())) return date;
  // ObjectIds carry their creation time.
  const fromId = typeof doc._id?.getTimestamp === 'function' ? doc._id.getTimestamp() : null;
  return fromId instanceof Date ? fromId : new Date();
}

async function main() {
  const mongoUrl = requireEnv('MONGODB_URL', 'MONGODB_URI');
  requireEnv('DATABASE_URL');
  const dbName = (process.env.MONGODB_DB || 'intellex').trim();

  const mongo = new MongoClient(mongoUrl, { serverSelectionTimeoutMS: 15_000, readPreference: 'secondaryPreferred' });
  const prisma = new PrismaClient();
  await mongo.connect();
  const source = mongo.db(dbName);

  const names = (await source.listCollections({}, { nameOnly: true }).toArray())
    .map((c) => c.name)
    .filter((n) => !n.startsWith('system.'))
    .filter((n) => !ONLY || ONLY.has(n))
    .sort();

  const mode = VERIFY ? 'verify' : DRY_RUN ? 'dry run (nothing is written)' : OVERWRITE ? 'copy + overwrite' : 'copy missing';
  console.log(`MongoDB "${dbName}" → PostgreSQL app_documents · ${names.length} collections · ${mode}\n`);

  let totals = { mongo: 0, present: 0, inserted: 0, updated: 0, failed: 0 };
  const failures: string[] = [];

  for (const name of names) {
    const col = source.collection(name);
    const mongoCount = await col.countDocuments();
    const existingIds = new Set(
      (
        await prisma.appDocument.findMany({ where: { collection: name }, select: { id: true } })
      ).map((r) => r.id),
    );

    if (VERIFY) {
      const ids = await col.find({}, { projection: { _id: 1 } }).toArray();
      const missing = ids.filter((d) => !existingIds.has(String(d._id))).length;
      console.log(
        `${missing ? '✗' : '✓'} ${name.padEnd(28)} mongo ${String(mongoCount).padStart(6)}  postgres ${String(existingIds.size).padStart(6)}  missing ${missing}`,
      );
      totals.mongo += mongoCount;
      totals.failed += missing;
      continue;
    }

    let present = 0;
    let inserted = 0;
    let updated = 0;
    let failed = 0;
    for await (const doc of col.find({})) {
      const id = String(doc._id);
      const exists = existingIds.has(id);
      if (exists && !OVERWRITE) {
        present += 1;
        continue;
      }
      if (DRY_RUN) {
        if (exists) updated += 1;
        else inserted += 1;
        continue;
      }
      try {
        const payload = toPayload(doc);
        await prisma.appDocument.upsert({
          where: { collection_id: { collection: name, id } },
          create: { collection: name, id, payload, createdAt: createdAtOf(doc) },
          update: { payload },
        });
        if (exists) updated += 1;
        else inserted += 1;
      } catch (err) {
        failed += 1;
        // Usually a unique index clash, e.g. the same email already signed up again on Postgres.
        failures.push(`${name}/${id}: ${err instanceof Error ? err.message.split('\n').pop() : String(err)}`);
      }
    }
    const verb = DRY_RUN ? 'would insert' : 'inserted';
    console.log(
      `${name.padEnd(28)} mongo ${String(mongoCount).padStart(6)}  already in postgres ${String(present).padStart(6)}  ${verb} ${String(inserted).padStart(6)}${OVERWRITE ? `  ${DRY_RUN ? 'would update' : 'updated'} ${updated}` : ''}${failed ? `  FAILED ${failed}` : ''}`,
    );
    totals = {
      mongo: totals.mongo + mongoCount,
      present: totals.present + present,
      inserted: totals.inserted + inserted,
      updated: totals.updated + updated,
      failed: totals.failed + failed,
    };
  }

  console.log('');
  if (VERIFY) {
    console.log(totals.failed ? `${totals.failed} Mongo documents are not in Postgres yet.` : `All ${totals.mongo} Mongo documents are in Postgres.`);
  } else {
    console.log(
      `Total: ${totals.mongo} in Mongo, ${totals.present} already in Postgres, ${DRY_RUN ? 'would insert' : 'inserted'} ${totals.inserted}` +
        (OVERWRITE ? `, ${DRY_RUN ? 'would update' : 'updated'} ${totals.updated}` : '') +
        (totals.failed ? `, ${totals.failed} failed` : ''),
    );
    for (const f of failures.slice(0, 50)) console.log(`  ✗ ${f}`);
    if (failures.length > 50) console.log(`  … and ${failures.length - 50} more`);
  }

  await mongo.close();
  await prisma.$disconnect();
  process.exit(totals.failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
