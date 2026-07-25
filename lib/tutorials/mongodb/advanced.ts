import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'mongodb-security',
    title: 'MongoDB Security Essentials',
    description:
      'Secure MongoDB applications with least privilege users, network controls, TLS, safe queries, validation, auditing, and secret handling.',
    level: 'advanced',
    section: 'Production Ready',
    order: 49,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'MongoDB security is not one switch. A production system is protected by identity, network rules, encrypted traffic, careful authorization, safe application code, backups, and review. The goal is simple: if one credential leaks or one route has a bug, the damage should be limited.',
      },
      {
        type: 'p',
        text: 'For real applications, use separate database users for runtime code, migrations, analytics, and emergency administration. The web app should not be able to create users, drop databases, or run cluster-wide operations.',
      },
      { type: 'h2', text: 'Use least privilege roles' },
      {
        type: 'code',
        title: 'Create app and migration users',
        language: 'javascript',
        code: `use admin

db.createUser({
  user: 'marketplace_app',
  pwd: passwordPrompt(),
  roles: [
    { role: 'readWrite', db: 'marketplace' },
  ],
})

db.createUser({
  user: 'marketplace_migrator',
  pwd: passwordPrompt(),
  roles: [
    { role: 'dbAdmin', db: 'marketplace' },
    { role: 'readWrite', db: 'marketplace' },
  ],
})`,
      },
      {
        type: 'tip',
        text: 'In Atlas, create database users from the Database Access screen and avoid giving normal application credentials Project Owner or Atlas Admin privileges.',
      },
      { type: 'h2', text: 'Protect the network first' },
      {
        type: 'ul',
        items: [
          'Use Atlas IP access lists, VPC peering, Private Endpoint, or a trusted private network.',
          'Never expose a self-managed mongod directly to the public internet.',
          'Require TLS for remote connections.',
          'Keep admin tools behind VPN, SSO, or a bastion workflow.',
          'Rotate access when a developer, CI system, or hosting provider changes.',
        ],
      },
      { type: 'h2', text: 'Avoid query injection' },
      {
        type: 'p',
        text: 'MongoDB queries are objects, which makes injection look different from SQL injection. The danger appears when a request body is accepted as a filter without validation. A user could send operators such as $ne or $gt and change the meaning of a login or lookup query.',
      },
      {
        type: 'code',
        title: 'Unsafe filter from request body',
        language: 'javascript',
        code: `app.post('/login', async (req, res) => {
  // Do not use request bodies directly as database filters.
  const user = await db.collection('users').findOne(req.body);
  res.json({ ok: Boolean(user) });
});`,
      },
      {
        type: 'code',
        title: 'Safe filter with explicit fields',
        language: 'javascript',
        code: `app.post('/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const user = await db.collection('users').findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordOk = await verifyPassword(password, user.passwordHash);
  if (!passwordOk) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ ok: true });
});`,
      },
      {
        type: 'warning',
        text: 'Never store plain text passwords. Hash passwords with a slow password hashing algorithm such as bcrypt, argon2, or a managed identity provider.',
      },
      { type: 'h2', text: 'Use schema validation for important collections' },
      {
        type: 'code',
        title: 'Collection validator for orders',
        language: 'javascript',
        code: `db.createCollection('orders', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['buyerId', 'status', 'totalCents', 'createdAt'],
      properties: {
        buyerId: { bsonType: 'objectId' },
        status: { enum: ['pending', 'paid', 'shipped', 'cancelled'] },
        totalCents: { bsonType: 'int', minimum: 0 },
        createdAt: { bsonType: 'date' },
      },
    },
  },
});`,
      },
      {
        type: 'table',
        headers: ['Layer', 'Security job'],
        rows: [
          ['Application validation', 'Friendly errors, business rules, authorization, and input normalization.'],
          ['MongoDB validation', 'Last line of defense against malformed critical documents.'],
          ['Indexes', 'Unique email, tenant scoped uniqueness, and predictable query plans.'],
          ['Audit logs', 'Evidence for sensitive reads, permission changes, and incident response.'],
        ],
      },
      { type: 'h2', text: 'Production checklist' },
      {
        type: 'ul',
        items: [
          'Store connection strings in a secret manager or encrypted environment settings.',
          'Give each service its own MongoDB user.',
          'Use SCRAM or X.509 authentication for self-managed deployments.',
          'Enable Atlas audit logging when compliance or investigation needs require it.',
          'Use client-side field level encryption for the most sensitive fields when needed.',
          'Test restore procedures, not only backup creation.',
        ],
      },
      {
        type: 'try',
        text: 'Create a read-only reporting user and prove it can read products but cannot insert an order, create an index, or list users.',
      },
      {
        type: 'keypoints',
        items: [
          'Least privilege limits the blast radius of leaked credentials.',
          'Validate filters instead of accepting raw request objects.',
          'Network controls and TLS are production basics, not extras.',
          'Use MongoDB validators for critical invariants and application validation for user-friendly rules.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-atlas-production',
    title: 'Atlas in Production',
    description:
      'Prepare MongoDB Atlas for production with cluster sizing, connection safety, backups, private networking, alerts, and operational habits.',
    level: 'advanced',
    section: 'Production Ready',
    order: 50,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'MongoDB Atlas removes a large amount of database operations work, but it does not remove production responsibility. You still choose regions, cluster tiers, backup policy, network access, database users, indexes, and alert thresholds.',
      },
      {
        type: 'p',
        text: 'The best Atlas setup starts with the application shape: where users are located, how much data is written, which queries are critical, how quickly the business must recover, and what security rules apply.',
      },
      { type: 'h2', text: 'Choose the right cluster shape' },
      {
        type: 'table',
        headers: ['Decision', 'Production guidance'],
        rows: [
          ['Region', 'Place the primary region near the application servers and most users.'],
          ['Tier', 'Use metrics and load tests to choose CPU, RAM, and storage headroom.'],
          ['Replica set', 'Use a multi-node replica set for availability.'],
          ['Backups', 'Enable continuous cloud backups before launch.'],
          ['Upgrade path', 'Know how to scale up without changing application code.'],
        ],
      },
      { type: 'h2', text: 'Use safe connection strings' },
      {
        type: 'code',
        title: 'Atlas URI stored in an environment variable',
        language: 'bash',
        code: `MONGODB_URI="mongodb+srv://marketplace_app:YOUR_PASSWORD@cluster0.example.mongodb.net/marketplace?retryWrites=true&w=majority&appName=marketplace-api"`,
      },
      {
        type: 'code',
        title: 'Create one MongoClient per process',
        language: 'javascript',
        code: `import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is required');
}

export const client = new MongoClient(uri, {
  maxPoolSize: 20,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
});

export async function getDb() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }

  return client.db('marketplace');
}`,
      },
      {
        type: 'note',
        text: 'Connection pools are per process. A small serverless function, a Node server, and a worker all create separate pools. Watch total connections in Atlas.',
      },
      { type: 'h2', text: 'Production Atlas checklist' },
      {
        type: 'ol',
        items: [
          'Create separate projects or clusters for development, staging, and production.',
          'Create database users with limited roles.',
          'Restrict network access with IP access lists, VPC peering, or private endpoints.',
          'Enable backups and test point-in-time restore.',
          'Define alerts for connections, disk, CPU, memory pressure, replication lag, and query targeting.',
          'Review indexes with real query patterns before launch.',
          'Document who can access Atlas and how emergency access works.',
        ],
      },
      { type: 'h2', text: 'Understand read and write concerns' },
      {
        type: 'p',
        text: 'Write concern controls when MongoDB reports a write as successful. Read preference controls where reads are sent. Most apps should use the default primary reads and majority writes until there is a measured reason to change.',
      },
      {
        type: 'code',
        title: 'Explicit majority write example',
        language: 'javascript',
        code: `await db.collection('payments').insertOne(
  {
    orderId,
    amountCents,
    provider: 'stripe',
    createdAt: new Date(),
  },
  { writeConcern: { w: 'majority' } },
);`,
      },
      {
        type: 'warning',
        text: 'Do not send normal user reads to secondaries just to reduce primary load. Secondary reads can be stale and can hide indexing or query design problems.',
      },
      { type: 'h2', text: 'Make scaling boring' },
      {
        type: 'ul',
        items: [
          'Keep indexes aligned with actual filters and sorts.',
          'Archive old data before collections become operationally painful.',
          'Use schema patterns that avoid unbounded arrays and giant hot documents.',
          'Prefer predictable workloads over surprise reports that scan millions of documents.',
          'Load test the top user flows before marketing launches or migrations.',
        ],
      },
      {
        type: 'try',
        text: 'Open Atlas Metrics for a test cluster, run a small load test, and identify which chart changes first: connections, CPU, read IOPS, write IOPS, or query targeting.',
      },
      {
        type: 'keypoints',
        items: [
          'Atlas handles infrastructure, but production design choices remain yours.',
          'Keep connection pools controlled and create one MongoClient per process.',
          'Backups, alerts, network controls, and limited users should be ready before launch.',
          'Default read and write settings are usually safer than clever early tuning.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-performance',
    title: 'Performance Tuning Mindset',
    description:
      'Tune MongoDB performance by measuring first, reading explain plans, designing indexes, controlling document growth, and protecting writes.',
    level: 'advanced',
    section: 'Production Ready',
    order: 51,
    minutes: 19,
    content: [
      {
        type: 'p',
        text: 'MongoDB performance work starts with a question: which user-visible operation is slow? A query that feels slow in a dashboard, checkout, feed, or background job needs measurement before tuning. Guessing creates unused indexes and confusing schemas.',
      },
      {
        type: 'p',
        text: 'A practical workflow is: capture the exact operation, inspect its query shape, run explain, compare indexes, test with realistic data, and monitor the result after deployment.',
      },
      { type: 'h2', text: 'Read explain output' },
      {
        type: 'code',
        title: 'Explain a common marketplace query',
        language: 'javascript',
        code: `db.products.find({
  tenantId: ObjectId('64f111111111111111111111'),
  status: 'active',
  category: 'shoes',
}).sort({ createdAt: -1 }).limit(24).explain('executionStats')`,
      },
      {
        type: 'table',
        headers: ['Explain clue', 'What it means', 'Common fix'],
        rows: [
          ['COLLSCAN', 'MongoDB scanned the collection', 'Create or adjust an index for the filter.'],
          ['IXSCAN', 'MongoDB used an index', 'Check whether keys examined are reasonable.'],
          ['SORT stage', 'MongoDB sorted in memory', 'Add sort fields to the index in the right order.'],
          ['High docsExamined', 'Many documents were checked', 'Improve selectivity or change the query shape.'],
          ['High nReturned ratio', 'Too much work for few results', 'Use a more selective index or precomputed field.'],
        ],
      },
      { type: 'h2', text: 'Design indexes from access patterns' },
      {
        type: 'p',
        text: 'Indexes should match the way the application reads data. Start with equality filters, then range filters, then sort fields. This is often remembered as ESR: Equality, Sort, Range. The exact order depends on the query, but the idea keeps index design practical.',
      },
      {
        type: 'code',
        title: 'Compound index for a category page',
        language: 'javascript',
        code: `db.products.createIndex({
  tenantId: 1,
  status: 1,
  category: 1,
  createdAt: -1,
})`,
      },
      {
        type: 'code',
        title: 'Unique index scoped to a tenant',
        language: 'javascript',
        code: `db.users.createIndex(
  { tenantId: 1, email: 1 },
  { unique: true },
)`,
      },
      {
        type: 'warning',
        text: 'Every index speeds up some reads but adds write cost and storage. Remove unused indexes after observing real traffic.',
      },
      { type: 'h2', text: 'Keep documents healthy' },
      {
        type: 'ul',
        items: [
          'Avoid unbounded arrays such as a product document that stores every view forever.',
          'Avoid giant frequently updated documents because they can become hot spots.',
          'Embed data that is read together and bounded in size.',
          'Reference data that grows independently or is shared by many documents.',
          'Use pagination based on indexed fields instead of large skip values.',
        ],
      },
      {
        type: 'code',
        title: 'Cursor pagination instead of deep skip',
        language: 'javascript',
        code: `const page = await db.collection('orders')
  .find({
    customerId,
    createdAt: { $lt: lastSeenCreatedAt },
  })
  .sort({ createdAt: -1 })
  .limit(25)
  .toArray();`,
      },
      { type: 'h2', text: 'Measure the full request' },
      {
        type: 'p',
        text: 'A slow page might be database time, network time, JSON serialization, too many round trips, missing caching, or a frontend waterfall. Measure database operations and application traces together.',
      },
      {
        type: 'code',
        title: 'Simple route timing',
        language: 'javascript',
        code: `app.get('/api/products', async (req, res) => {
  const startedAt = performance.now();

  const products = await db.collection('products')
    .find({ status: 'active' })
    .sort({ createdAt: -1 })
    .limit(24)
    .toArray();

  const durationMs = Math.round(performance.now() - startedAt);
  req.log.info({ durationMs, count: products.length }, 'loaded products');

  res.json({ products });
});`,
      },
      {
        type: 'try',
        text: 'Pick one query, run explain before adding an index, add a compound index, run explain again, and compare docsExamined, keysExamined, and executionTimeMillis.',
      },
      {
        type: 'keypoints',
        items: [
          'Tune from measured slow operations, not guesses.',
          'Use explain to see scans, sorts, examined keys, and examined documents.',
          'Indexes are based on access patterns and have write costs.',
          'Document growth, pagination, and round trips affect performance as much as index syntax.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-sharding-intro',
    title: 'Sharding Concepts',
    description:
      'Understand MongoDB sharding concepts, shard keys, routing, chunks, balancing, and the production trade-offs before adopting a cluster.',
    level: 'advanced',
    section: 'Production Ready',
    order: 52,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Sharding is MongoDB horizontal scaling. Instead of keeping all data on one replica set, data is split across multiple shards. Each shard stores a portion of the data, and mongos routers send operations to the correct place.',
      },
      {
        type: 'p',
        text: 'Sharding is powerful, but it adds operational complexity. A single replica set with good indexes, healthy schemas, and enough hardware is simpler. Use sharding when data size, write volume, or workload isolation truly requires horizontal scale.',
      },
      { type: 'h2', text: 'The moving parts' },
      {
        type: 'table',
        headers: ['Part', 'Purpose'],
        rows: [
          ['Shard', 'Stores a subset of sharded collection data. Usually each shard is a replica set.'],
          ['mongos', 'Query router used by applications. It hides shard locations from app code.'],
          ['Config servers', 'Store cluster metadata such as chunk ranges and shard placement.'],
          ['Shard key', 'Field or fields that decide how documents are distributed.'],
          ['Chunks', 'Ranges of shard key values that can move between shards.'],
        ],
      },
      { type: 'h2', text: 'Shard key quality matters' },
      {
        type: 'p',
        text: 'The shard key is the most important sharding decision. A good shard key distributes writes, supports important queries, and avoids placing all hot activity on one shard. A bad shard key can make a large cluster feel like a small overloaded database.',
      },
      {
        type: 'table',
        headers: ['Shard key choice', 'Risk'],
        rows: [
          ['createdAt', 'New writes may all target the same chunk or shard.'],
          ['tenantId only', 'Large tenants can become jumbo or hot.'],
          ['random id only', 'Writes distribute well, but common tenant queries may scatter.'],
          ['tenantId + hashed id', 'Often balances tenant routing with distribution, but must match query needs.'],
        ],
      },
      {
        type: 'code',
        title: 'Example sharding command',
        language: 'javascript',
        code: `sh.enableSharding('marketplace')

sh.shardCollection(
  'marketplace.orders',
  { tenantId: 1, orderNumber: 'hashed' },
)`,
      },
      {
        type: 'note',
        text: 'Do not copy shard key examples blindly. The right key depends on the collection, query patterns, write patterns, and tenant size distribution.',
      },
      { type: 'h2', text: 'Targeted query vs scatter-gather' },
      {
        type: 'p',
        text: 'A targeted query includes the shard key or enough of its prefix for mongos to route the operation to a small number of shards. A scatter-gather query must ask many shards and merge results. Some scatter-gather queries are acceptable, but your hottest paths should be targeted.',
      },
      {
        type: 'code',
        title: 'Targeted tenant query',
        language: 'javascript',
        code: `db.orders.find({
  tenantId: ObjectId('64f111111111111111111111'),
  status: 'paid',
}).limit(20)`,
      },
      {
        type: 'code',
        title: 'Likely scatter-gather query',
        language: 'javascript',
        code: `db.orders.find({
  status: 'paid',
}).limit(20)`,
      },
      { type: 'h2', text: 'Before you shard' },
      {
        type: 'ol',
        items: [
          'Confirm the bottleneck cannot be solved by indexes, schema design, vertical scaling, or archiving.',
          'List the top queries and write paths for the target collection.',
          'Estimate cardinality, write distribution, and tenant skew for candidate shard keys.',
          'Test with production-like data and traffic.',
          'Plan backups, monitoring, and incident response for a distributed cluster.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Sharding splits data across shards and routes through mongos.',
          'The shard key controls distribution and query targeting.',
          'A sharded cluster is more complex than a replica set.',
          'Shard after measurement, not because a project sounds large someday.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-replication-intro',
    title: 'Replica Sets (Conceptual)',
    description:
      'Learn how MongoDB replica sets provide availability through primary elections, secondaries, oplog replication, write concern, and failover.',
    level: 'advanced',
    section: 'Production Ready',
    order: 53,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'A MongoDB replica set is a group of mongod processes that maintain the same data. One member is primary and accepts writes. Other members are secondaries that replicate changes from the oplog and can become primary during failover.',
      },
      {
        type: 'p',
        text: 'Replica sets are the normal production foundation for MongoDB. They improve availability and allow maintenance without every database operation becoming an outage.',
      },
      { type: 'h2', text: 'Core concepts' },
      {
        type: 'table',
        headers: ['Concept', 'Meaning'],
        rows: [
          ['Primary', 'The member that accepts writes.'],
          ['Secondary', 'A member that copies changes and can be elected primary.'],
          ['Oplog', 'A capped log of operations used for replication.'],
          ['Election', 'The process of choosing a new primary after failure or stepdown.'],
          ['Majority', 'More than half of voting members, used for safe writes and elections.'],
        ],
      },
      { type: 'h2', text: 'What happens during failover' },
      {
        type: 'ol',
        items: [
          'The current primary becomes unavailable or steps down.',
          'Voting members detect the change.',
          'An election selects a new primary.',
          'Drivers discover the new topology.',
          'Writes resume against the new primary.',
        ],
      },
      {
        type: 'p',
        text: 'During failover, applications may see brief errors or retries. Production code should handle transient database errors around writes and idempotent operations carefully.',
      },
      {
        type: 'code',
        title: 'Retry a safe idempotent update',
        language: 'javascript',
        code: `async function markEmailVerified(users, userId) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await users.updateOne(
        { _id: userId },
        { $set: { emailVerified: true } },
      );
    } catch (error) {
      if (attempt === 3) {
        throw error;
      }
    }
  }
}`,
      },
      { type: 'h2', text: 'Read preference and stale data' },
      {
        type: 'p',
        text: 'Secondaries can serve reads when read preference allows it, but secondary data may lag behind the primary. For most web applications, primary reads are the safest default. Use secondary reads only when stale data is acceptable and the reason is measured.',
      },
      {
        type: 'code',
        title: 'Default primary read with majority write',
        language: 'javascript',
        code: `await db.collection('orders').insertOne(
  {
    customerId,
    status: 'paid',
    createdAt: new Date(),
  },
  { writeConcern: { w: 'majority' } },
);`,
      },
      {
        type: 'warning',
        text: 'Never build a workflow that writes to primary and immediately requires a secondary read to reflect the write unless you understand causal consistency and session behavior.',
      },
      { type: 'h2', text: 'Operational habits' },
      {
        type: 'ul',
        items: [
          'Monitor replication lag.',
          'Keep an odd number of voting members or use supported Atlas defaults.',
          'Avoid putting all members in one failure domain.',
          'Test driver retry behavior before production incidents.',
          'Understand maintenance windows and election impact.',
        ],
      },
      {
        type: 'try',
        text: 'In a local replica set or Atlas test cluster, watch what your application logs when the primary is restarted. Confirm errors are short-lived and handled clearly.',
      },
      {
        type: 'keypoints',
        items: [
          'Replica sets provide availability through primary elections and replicated secondaries.',
          'Majority write concern confirms writes on enough members for safer failover behavior.',
          'Secondary reads can be stale and should be used deliberately.',
          'Applications should handle brief failover errors gracefully.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-backups-ops',
    title: 'Backups & Ops Checklist',
    description:
      'Build a practical MongoDB operations checklist for backups, restores, migrations, maintenance windows, runbooks, and incident readiness.',
    level: 'advanced',
    section: 'Ops Basics',
    order: 54,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'A backup that has never been restored is only a hope. MongoDB operations work should define what is backed up, how often, how long it is retained, who can restore it, and how quickly the business needs data back after a problem.',
      },
      {
        type: 'p',
        text: 'Atlas cloud backups are the easiest production path for many teams. Self-managed deployments need a more explicit plan using filesystem snapshots, mongodump for smaller cases, or enterprise backup tooling.',
      },
      { type: 'h2', text: 'Know RPO and RTO' },
      {
        type: 'table',
        headers: ['Term', 'Plain meaning', 'Example'],
        rows: [
          ['RPO', 'How much data loss is acceptable', 'We can lose at most 5 minutes of writes.'],
          ['RTO', 'How long restore may take', 'Checkout must be restored within 30 minutes.'],
          ['Retention', 'How long backups are kept', 'Hourly for 2 days, daily for 30 days.'],
          ['Restore test', 'Proof that recovery works', 'Restore staging from production backup monthly.'],
        ],
      },
      { type: 'h2', text: 'Backup commands for small non-Atlas cases' },
      {
        type: 'code',
        title: 'Create a compressed dump',
        language: 'bash',
        code: `mongodump \
  --uri="$MONGODB_URI" \
  --archive=marketplace.archive.gz \
  --gzip`,
      },
      {
        type: 'code',
        title: 'Restore into a staging database',
        language: 'bash',
        code: `mongorestore \
  --uri="$STAGING_MONGODB_URI" \
  --archive=marketplace.archive.gz \
  --gzip \
  --nsFrom="marketplace.*" \
  --nsTo="marketplace_restore.*"`,
      },
      {
        type: 'warning',
        text: 'Do not use production restores casually. Restored data may include real user information. Restrict access, mask sensitive fields when possible, and follow company policy.',
      },
      { type: 'h2', text: 'Migration safety checklist' },
      {
        type: 'ol',
        items: [
          'Back up before destructive changes.',
          'Run migrations against a staging restore first.',
          'Make long migrations resumable by using checkpoints.',
          'Prefer additive changes before removing old fields.',
          'Deploy application code that can tolerate both old and new document shapes during a rolling migration.',
          'Measure write load and replication lag during the migration.',
        ],
      },
      {
        type: 'code',
        title: 'Resumable batch migration pattern',
        language: 'javascript',
        code: `const cursor = db.collection('users').find({
  fullName: { $exists: false },
}).project({ firstName: 1, lastName: 1 }).batchSize(500);

for await (const user of cursor) {
  await db.collection('users').updateOne(
    { _id: user._id, fullName: { $exists: false } },
    {
      $set: {
        fullName: [user.firstName, user.lastName].filter(Boolean).join(' '),
      },
    },
  );
}`,
      },
      { type: 'h2', text: 'Ops runbook basics' },
      {
        type: 'ul',
        items: [
          'Where are dashboards and alerts?',
          'Who can access Atlas or the servers?',
          'How do we rotate a leaked database password?',
          'How do we restore one collection or a full cluster?',
          'What are the top five critical queries and indexes?',
          'How do we pause risky background jobs during an incident?',
        ],
      },
      {
        type: 'try',
        text: 'Write a one-page restore runbook for a demo database. Include commands, owners, expected duration, and how to verify restored data.',
      },
      {
        type: 'keypoints',
        items: [
          'Backups matter only when restores are tested.',
          'Define RPO, RTO, retention, and ownership before an incident.',
          'Migrations should be tested, resumable, and observable.',
          'Runbooks reduce panic during database emergencies.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-observability',
    title: 'Monitoring Slow Operations',
    description:
      'Monitor MongoDB slow operations with Atlas metrics, profiler data, application logs, explain plans, and practical alert thresholds.',
    level: 'advanced',
    section: 'Ops Basics',
    order: 55,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Observability means you can answer what is slow, why it is slow, how often it happens, and which users are affected. MongoDB monitoring should connect database metrics with application logs and request traces.',
      },
      {
        type: 'p',
        text: 'A single slow query is not always a crisis. A slow query on every checkout request is. Focus on frequency, user impact, and whether the workload is getting worse over time.',
      },
      { type: 'h2', text: 'Start with Atlas metrics' },
      {
        type: 'table',
        headers: ['Metric area', 'What to watch'],
        rows: [
          ['Connections', 'Connection storms, leaked clients, serverless over-pooling.'],
          ['Query targeting', 'High scanned objects per returned document.'],
          ['CPU', 'Sustained saturation during normal traffic.'],
          ['Disk IOPS', 'Storage bottlenecks and index pressure.'],
          ['Replication lag', 'Secondaries falling behind the primary.'],
          ['Opcounters', 'Unexpected read or write spikes.'],
        ],
      },
      { type: 'h2', text: 'Use the profiler carefully' },
      {
        type: 'p',
        text: 'The database profiler records operations based on a profiling level and slow operation threshold. It is useful for investigations, but it can add overhead and create sensitive logs. Use it deliberately.',
      },
      {
        type: 'code',
        title: 'Profile operations slower than 100 ms',
        language: 'javascript',
        code: `db.setProfilingLevel(1, { slowms: 100 })

db.system.profile.find({
  millis: { $gte: 100 },
}).sort({ ts: -1 }).limit(10).pretty()`,
      },
      {
        type: 'code',
        title: 'Turn profiling off after investigation',
        language: 'javascript',
        code: `db.setProfilingLevel(0)`,
      },
      {
        type: 'warning',
        text: 'Profiler output may contain query values. Treat it as sensitive operational data.',
      },
      { type: 'h2', text: 'Add application-side timing' },
      {
        type: 'code',
        title: 'Log MongoDB operation duration in Express',
        language: 'javascript',
        code: `async function timedQuery(name, fn, logger) {
  const startedAt = performance.now();

  try {
    return await fn();
  } finally {
    const durationMs = Math.round(performance.now() - startedAt);
    logger.info({ name, durationMs }, 'mongodb operation finished');
  }
}

app.get('/api/orders', async (req, res) => {
  const orders = await timedQuery(
    'orders.list',
    () => db.collection('orders').find({ customerId: req.user.id }).limit(20).toArray(),
    req.log,
  );

  res.json({ orders });
});`,
      },
      { type: 'h2', text: 'Turn slow logs into work items' },
      {
        type: 'ol',
        items: [
          'Group slow operations by query shape, not by individual values.',
          'Find the route, job, or feature that runs each shape.',
          'Run explain with representative values.',
          'Check whether an index exists and is being used.',
          'Decide whether to index, rewrite, cache, paginate, archive, or redesign the document shape.',
          'Verify the fix after deployment.',
        ],
      },
      {
        type: 'code',
        title: 'Attach comments to important queries',
        language: 'javascript',
        code: `await db.collection('products')
  .find({ tenantId, status: 'active' })
  .comment('catalog.active-products')
  .sort({ createdAt: -1 })
  .limit(24)
  .toArray();`,
      },
      {
        type: 'tip',
        text: 'Query comments make it easier to connect profiler entries and logs back to application features.',
      },
      {
        type: 'keypoints',
        items: [
          'Monitor database metrics and application timings together.',
          'Use profiler data carefully because it may contain sensitive values.',
          'Group slow operations by query shape before creating fixes.',
          'Good observability turns vague slowness into specific engineering work.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-architecture',
    title: 'Document Architecture for Real Apps',
    description:
      'Design MongoDB documents around access patterns, ownership boundaries, consistency needs, embedding, references, and lifecycle changes.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 56,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'MongoDB architecture is not about making documents look like tables. It is about storing data in shapes that match how the application reads and writes. The same business concept can have different document designs depending on the product workflow.',
      },
      {
        type: 'p',
        text: 'The advanced question is not embed or reference. The question is: what changes together, what is read together, what grows without limit, and what needs independent permissions or lifecycle?',
      },
      { type: 'h2', text: 'Use access patterns as the starting point' },
      {
        type: 'ol',
        items: [
          'List the main screens, API routes, and jobs.',
          'Write the exact filters and sorts each one needs.',
          'Mark which fields are updated often.',
          'Identify data that grows forever.',
          'Choose document boundaries that keep common reads simple and writes safe.',
        ],
      },
      { type: 'h2', text: 'Embed when data is bounded and read together' },
      {
        type: 'code',
        title: 'Product with bounded embedded variants',
        language: 'json',
        code: `{
  "_id": "product_123",
  "tenantId": "tenant_1",
  "name": "Canvas Sneaker",
  "status": "active",
  "variants": [
    { "sku": "SNEAKER-BLACK-8", "color": "black", "size": "8", "stock": 12 },
    { "sku": "SNEAKER-BLACK-9", "color": "black", "size": "9", "stock": 5 }
  ],
  "createdAt": "2026-07-25T00:00:00.000Z"
}`,
      },
      {
        type: 'p',
        text: 'Variants are often shown with a product and have a known upper bound. Embedding can make the product detail page simple. If variants become thousands of independently updated documents, references may be healthier.',
      },
      { type: 'h2', text: 'Reference when data grows or has its own lifecycle' },
      {
        type: 'code',
        title: 'Order references buyer and product snapshots',
        language: 'json',
        code: `{
  "_id": "order_9001",
  "tenantId": "tenant_1",
  "buyerId": "user_44",
  "status": "paid",
  "items": [
    {
      "productId": "product_123",
      "name": "Canvas Sneaker",
      "sku": "SNEAKER-BLACK-9",
      "unitPriceCents": 6900,
      "quantity": 1
    }
  ],
  "totalCents": 6900
}`,
      },
      {
        type: 'note',
        text: 'Orders often store snapshots of product name and price because receipts should not change when the product catalog changes later.',
      },
      { type: 'h2', text: 'Design for consistency needs' },
      {
        type: 'table',
        headers: ['Need', 'Pattern'],
        rows: [
          ['Read one page quickly', 'Embed fields or maintain a read model.'],
          ['Independent updates', 'Reference separate documents.'],
          ['Historical truth', 'Copy immutable snapshots into the event or order.'],
          ['Cross-document invariants', 'Use transactions only where the invariant truly requires it.'],
          ['Search experience', 'Use Atlas Search or a search-specific read model.'],
        ],
      },
      {
        type: 'code',
        title: 'Transaction for a payment-sensitive invariant',
        language: 'javascript',
        code: `await client.withSession(async (session) => {
  await session.withTransaction(async () => {
    await db.collection('orders').updateOne(
      { _id: orderId, status: 'pending' },
      { $set: { status: 'paid', paidAt: new Date() } },
      { session },
    );

    await db.collection('payments').insertOne(
      { orderId, providerId, amountCents, createdAt: new Date() },
      { session },
    );
  });
});`,
      },
      {
        type: 'warning',
        text: 'Transactions are useful, but a design that needs a transaction for every normal read or write may be fighting the document model.',
      },
      {
        type: 'keypoints',
        items: [
          'Design documents from access patterns, not table habits.',
          'Embed bounded data that is read with the parent.',
          'Reference data that grows, changes independently, or needs its own permissions.',
          'Copy historical snapshots when future changes should not rewrite the past.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-multi-tenant',
    title: 'Multi-tenant Document Patterns',
    description:
      'Design MongoDB multi-tenant applications with tenant isolation, tenant-scoped indexes, database-per-tenant trade-offs, and safe authorization.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 57,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'A multi-tenant application serves many organizations or customers from one product. MongoDB can support several tenant models: shared collections with tenantId, database per tenant, cluster per tenant, or a hybrid for very large customers.',
      },
      {
        type: 'p',
        text: 'The right design depends on isolation requirements, tenant size differences, operational cost, compliance, and how often tenants need custom restore or export.',
      },
      { type: 'h2', text: 'Common tenant models' },
      {
        type: 'table',
        headers: ['Model', 'Good for', 'Trade-off'],
        rows: [
          ['Shared collections', 'Most SaaS apps with many small tenants', 'Every query must filter by tenantId.'],
          ['Database per tenant', 'Stronger operational separation', 'More databases, migrations, and connection management.'],
          ['Cluster per tenant', 'Enterprise isolation or compliance', 'Highest cost and operational overhead.'],
          ['Hybrid', 'Small tenants shared, large tenants isolated', 'More routing and operational complexity.'],
        ],
      },
      { type: 'h2', text: 'Shared collection pattern' },
      {
        type: 'code',
        title: 'Tenant-scoped product document',
        language: 'json',
        code: `{
  "_id": "product_123",
  "tenantId": "tenant_acme",
  "name": "Canvas Sneaker",
  "slug": "canvas-sneaker",
  "status": "active",
  "createdAt": "2026-07-25T00:00:00.000Z"
}`,
      },
      {
        type: 'code',
        title: 'Tenant-scoped indexes',
        language: 'javascript',
        code: `db.products.createIndex({ tenantId: 1, slug: 1 }, { unique: true })
db.products.createIndex({ tenantId: 1, status: 1, createdAt: -1 })`,
      },
      {
        type: 'warning',
        text: 'A unique index on email alone makes email global. A unique index on tenantId plus email makes email unique inside each tenant.',
      },
      { type: 'h2', text: 'Make tenant filtering hard to forget' },
      {
        type: 'code',
        title: 'Repository helper that always includes tenantId',
        language: 'typescript',
        code: `import type { Collection, Filter, ObjectId } from 'mongodb';

type Product = {
  _id: ObjectId;
  tenantId: ObjectId;
  name: string;
  status: 'draft' | 'active' | 'archived';
};

export function productsForTenant(
  collection: Collection<Product>,
  tenantId: ObjectId,
) {
  return {
    find(filter: Omit<Filter<Product>, 'tenantId'> = {}) {
      return collection.find({ ...filter, tenantId });
    },
    updateOne(filter: Omit<Filter<Product>, 'tenantId'>, update: object) {
      return collection.updateOne({ ...filter, tenantId }, update);
    },
  };
}`,
      },
      {
        type: 'tip',
        text: 'Centralize tenant scoping in repositories, services, or middleware. Do not rely on every route remembering to add tenantId manually.',
      },
      { type: 'h2', text: 'Authorization still matters' },
      {
        type: 'p',
        text: 'TenantId filters prevent accidental cross-tenant data access only when the application has already proven the user belongs to that tenant. Authentication answers who the user is. Authorization answers which tenant and action they can use.',
      },
      {
        type: 'ol',
        items: [
          'Authenticate the user.',
          'Load memberships or roles.',
          'Select the active tenant from a trusted membership.',
          'Attach tenantId and permissions to the request context.',
          'Use tenant-scoped data helpers for every query.',
        ],
      },
      { type: 'h2', text: 'Large tenant concerns' },
      {
        type: 'ul',
        items: [
          'One tenant may dominate storage and query load.',
          'Tenant-specific exports and restores can be difficult in shared collections.',
          'Sharding by tenant can isolate routing but may create hot tenants.',
          'Enterprise customers may require separate encryption keys or clusters.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Shared collections with tenantId are common and efficient for many SaaS apps.',
          'Use tenant-scoped compound indexes for uniqueness and query speed.',
          'Centralize tenant filters so routes cannot forget isolation.',
          'Choose database or cluster per tenant only when the isolation value justifies the cost.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-event-driven',
    title: 'Event-friendly Data Patterns',
    description:
      'Use MongoDB effectively in event-driven systems with outbox records, change streams, idempotent consumers, snapshots, and read models.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 58,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Modern applications often react to events: an order is paid, inventory changes, a user signs up, or a shipment is delayed. MongoDB can be part of event-driven systems when data changes are recorded predictably and consumers are idempotent.',
      },
      {
        type: 'p',
        text: 'The important design idea is to separate the business write from the side effects. Sending email, updating search, publishing analytics, and notifying other services should not make the main checkout request fragile.',
      },
      { type: 'h2', text: 'Use the outbox pattern' },
      {
        type: 'p',
        text: 'The outbox pattern writes the business document and an event document in the same transaction. A background worker publishes or processes outbox events later. This avoids losing events when the app crashes after saving the order but before publishing a message.',
      },
      {
        type: 'code',
        title: 'Create order and outbox event together',
        language: 'javascript',
        code: `await client.withSession(async (session) => {
  await session.withTransaction(async () => {
    await db.collection('orders').insertOne(
      {
        _id: orderId,
        customerId,
        status: 'paid',
        totalCents,
        createdAt: new Date(),
      },
      { session },
    );

    await db.collection('outbox').insertOne(
      {
        type: 'order.paid',
        aggregateId: orderId,
        payload: { orderId, customerId, totalCents },
        status: 'pending',
        createdAt: new Date(),
      },
      { session },
    );
  });
});`,
      },
      {
        type: 'code',
        title: 'Process outbox events safely',
        language: 'javascript',
        code: `const event = await db.collection('outbox').findOneAndUpdate(
  { status: 'pending' },
  {
    $set: {
      status: 'processing',
      lockedAt: new Date(),
    },
  },
  { sort: { createdAt: 1 }, returnDocument: 'after' },
);

if (event.value) {
  await publishEvent(event.value);
  await db.collection('outbox').updateOne(
    { _id: event.value._id },
    { $set: { status: 'published', publishedAt: new Date() } },
  );
}`,
      },
      {
        type: 'warning',
        text: 'Event consumers must be idempotent. The same event can be delivered twice during retries, worker crashes, or message broker redelivery.',
      },
      { type: 'h2', text: 'Idempotent consumer pattern' },
      {
        type: 'code',
        title: 'Ignore duplicate event ids',
        language: 'javascript',
        code: `await db.collection('processedEvents').createIndex(
  { consumer: 1, eventId: 1 },
  { unique: true },
);

async function handleOrderPaid(event) {
  try {
    await db.collection('processedEvents').insertOne({
      consumer: 'email-service',
      eventId: event._id,
      processedAt: new Date(),
    });
  } catch (error) {
    return;
  }

  await sendReceiptEmail(event.payload.orderId);
}`,
      },
      { type: 'h2', text: 'Change streams' },
      {
        type: 'p',
        text: 'MongoDB change streams let applications watch changes from a replica set or sharded cluster. They are useful for cache invalidation, search indexing, and reactive features. They are not a substitute for clear business events when event meaning matters.',
      },
      {
        type: 'code',
        title: 'Watch product changes',
        language: 'javascript',
        code: `const stream = db.collection('products').watch([
  { $match: { 'operationType': { $in: ['insert', 'update', 'replace'] } } },
]);

for await (const change of stream) {
  await updateSearchIndex(change.documentKey._id);
}`,
      },
      { type: 'h2', text: 'Read models and snapshots' },
      {
        type: 'ul',
        items: [
          'Keep write documents clean for business invariants.',
          'Build read models for feeds, dashboards, search pages, and reports.',
          'Store snapshots when event history must remain understandable later.',
          'Use background rebuild jobs so read models can be recreated after bugs.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'The outbox pattern keeps business writes and event publishing reliable.',
          'Consumers should be idempotent because retries happen.',
          'Change streams observe database changes, while domain events explain business meaning.',
          'Read models help MongoDB serve user-facing screens efficiently.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-project-model',
    title: 'Mini Project: Design a Marketplace Data Model',
    description:
      'Design a production-minded MongoDB marketplace model with tenants, users, products, carts, orders, indexes, validation, and access patterns.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 59,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'In this mini project, you will design the data model for a small multi-tenant marketplace. The goal is not to create every possible collection. The goal is to practice turning product requirements into MongoDB document shapes, indexes, and operational rules.',
      },
      { type: 'h2', text: 'Step 1: Define requirements' },
      {
        type: 'ol',
        items: [
          'A tenant owns products and receives orders.',
          'Users can belong to one or more tenants.',
          'Products have variants with stock counts.',
          'Buyers add items to carts and place orders.',
          'Orders should preserve product name and price at purchase time.',
          'Admins need pages for active products and recent orders.',
        ],
      },
      { type: 'h2', text: 'Step 2: Sketch collections' },
      {
        type: 'code',
        title: 'Collections for the marketplace',
        language: 'text',
        code: `tenants
users
memberships
products
carts
orders
payments
outbox`,
      },
      {
        type: 'p',
        text: 'This model uses shared collections with tenantId. That keeps the project simple and realistic for many SaaS applications.',
      },
      { type: 'h2', text: 'Step 3: Model products with bounded variants' },
      {
        type: 'code',
        title: 'Product document',
        language: 'json',
        code: `{
  "_id": "product_123",
  "tenantId": "tenant_acme",
  "name": "Canvas Sneaker",
  "slug": "canvas-sneaker",
  "status": "active",
  "description": "Everyday canvas sneaker.",
  "variants": [
    {
      "sku": "SNEAKER-BLACK-9",
      "color": "black",
      "size": "9",
      "priceCents": 6900,
      "stock": 12
    }
  ],
  "createdAt": "2026-07-25T00:00:00.000Z",
  "updatedAt": "2026-07-25T00:00:00.000Z"
}`,
      },
      {
        type: 'tip',
        text: 'Embedding variants works when the number of variants is bounded and product pages usually need them together.',
      },
      { type: 'h2', text: 'Step 4: Model carts separately' },
      {
        type: 'code',
        title: 'Cart document',
        language: 'json',
        code: `{
  "_id": "cart_1",
  "tenantId": "tenant_acme",
  "buyerId": "user_44",
  "items": [
    {
      "productId": "product_123",
      "sku": "SNEAKER-BLACK-9",
      "quantity": 1,
      "addedAt": "2026-07-25T00:00:00.000Z"
    }
  ],
  "updatedAt": "2026-07-25T00:00:00.000Z"
}`,
      },
      {
        type: 'p',
        text: 'The cart is a working document. Prices should be recalculated at checkout because catalog price or availability can change before purchase.',
      },
      { type: 'h2', text: 'Step 5: Model orders as historical records' },
      {
        type: 'code',
        title: 'Order document with snapshots',
        language: 'json',
        code: `{
  "_id": "order_9001",
  "tenantId": "tenant_acme",
  "buyerId": "user_44",
  "status": "paid",
  "items": [
    {
      "productId": "product_123",
      "sku": "SNEAKER-BLACK-9",
      "name": "Canvas Sneaker",
      "unitPriceCents": 6900,
      "quantity": 1
    }
  ],
  "subtotalCents": 6900,
  "totalCents": 6900,
  "placedAt": "2026-07-25T00:00:00.000Z"
}`,
      },
      {
        type: 'note',
        text: 'The order stores product snapshots so invoices and order history remain accurate even if the catalog changes later.',
      },
      { type: 'h2', text: 'Step 6: Add indexes' },
      {
        type: 'code',
        title: 'Marketplace indexes',
        language: 'javascript',
        code: `db.users.createIndex({ email: 1 }, { unique: true })
db.memberships.createIndex({ userId: 1, tenantId: 1 }, { unique: true })
db.products.createIndex({ tenantId: 1, slug: 1 }, { unique: true })
db.products.createIndex({ tenantId: 1, status: 1, createdAt: -1 })
db.carts.createIndex({ tenantId: 1, buyerId: 1 }, { unique: true })
db.orders.createIndex({ tenantId: 1, placedAt: -1 })
db.orders.createIndex({ buyerId: 1, placedAt: -1 })
db.outbox.createIndex({ status: 1, createdAt: 1 })`,
      },
      { type: 'h2', text: 'Step 7: Add validation for critical collections' },
      {
        type: 'code',
        title: 'Order validator',
        language: 'javascript',
        code: `db.runCommand({
  collMod: 'orders',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['tenantId', 'buyerId', 'status', 'items', 'totalCents', 'placedAt'],
      properties: {
        status: { enum: ['pending', 'paid', 'shipped', 'cancelled'] },
        items: { bsonType: 'array', minItems: 1 },
        totalCents: { bsonType: 'int', minimum: 0 },
      },
    },
  },
})`,
      },
      { type: 'h2', text: 'Step 8: Review access patterns' },
      {
        type: 'table',
        headers: ['Screen or job', 'Query shape', 'Index'],
        rows: [
          ['Catalog page', 'tenantId + status sorted by createdAt', 'products tenantId/status/createdAt'],
          ['Product detail', 'tenantId + slug', 'products unique tenantId/slug'],
          ['Buyer cart', 'tenantId + buyerId', 'carts unique tenantId/buyerId'],
          ['Admin orders', 'tenantId sorted by placedAt', 'orders tenantId/placedAt'],
          ['Buyer orders', 'buyerId sorted by placedAt', 'orders buyerId/placedAt'],
        ],
      },
      {
        type: 'try',
        text: 'Extend the model with refunds. Decide whether refunds belong inside orders, in a separate refunds collection, or both as a snapshot plus event record.',
      },
      {
        type: 'keypoints',
        items: [
          'Start a data model from product requirements and access patterns.',
          'Embed bounded data and reference independent data.',
          'Use snapshots for historical facts such as order prices.',
          'Create indexes that map directly to screens and jobs.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-project-express',
    title: 'Mini Project: Express + MongoDB API',
    description:
      'Build a small production-minded Express API with MongoDB connection reuse, validation, indexes, CRUD routes, pagination, and error handling.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 60,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'In this project, you will build an Express API for marketplace products. MongoDB is the star: the project focuses on connection reuse, collection setup, validation, indexes, safe filters, and pagination.',
      },
      { type: 'h2', text: 'Step 1: Create the project' },
      {
        type: 'code',
        title: 'Install dependencies',
        language: 'bash',
        code: `mkdir express-mongodb-api
cd express-mongodb-api
npm init -y
npm install express mongodb zod dotenv
npm install --save-dev nodemon`,
      },
      {
        type: 'code',
        title: 'Add scripts to package.json',
        language: 'json',
        code: `{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}`,
      },
      { type: 'h2', text: 'Step 2: Configure environment' },
      {
        type: 'code',
        title: '.env',
        language: 'bash',
        code: `MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=marketplace
PORT=3000`,
      },
      { type: 'h2', text: 'Step 3: Create one MongoDB client' },
      {
        type: 'code',
        title: 'src/db.js',
        language: 'javascript',
        code: `import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'marketplace';

if (!uri) {
  throw new Error('MONGODB_URI is required');
}

const client = new MongoClient(uri, {
  maxPoolSize: 20,
  serverSelectionTimeoutMS: 5000,
});

export async function connectDb() {
  await client.connect();
  return client.db(dbName);
}

export function getDb() {
  return client.db(dbName);
}`,
      },
      { type: 'h2', text: 'Step 4: Create indexes at startup' },
      {
        type: 'code',
        title: 'src/setup.js',
        language: 'javascript',
        code: `export async function ensureIndexes(db) {
  await db.collection('products').createIndexes([
    {
      key: { tenantId: 1, slug: 1 },
      unique: true,
      name: 'tenant_slug_unique',
    },
    {
      key: { tenantId: 1, status: 1, createdAt: -1 },
      name: 'tenant_status_created',
    },
  ]);
}`,
      },
      { type: 'h2', text: 'Step 5: Validate input with Zod' },
      {
        type: 'code',
        title: 'src/products.validation.js',
        language: 'javascript',
        code: `import { z } from 'zod';

export const createProductSchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  status: z.enum(['draft', 'active']).default('draft'),
  priceCents: z.number().int().nonnegative(),
});

export const listProductsSchema = z.object({
  tenantId: z.string().min(1),
  status: z.enum(['draft', 'active']).optional(),
  before: z.string().datetime().optional(),
});`,
      },
      { type: 'h2', text: 'Step 6: Build routes with safe filters' },
      {
        type: 'code',
        title: 'src/products.routes.js',
        language: 'javascript',
        code: `import express from 'express';
import { getDb } from './db.js';
import { createProductSchema, listProductsSchema } from './products.validation.js';

export const productsRouter = express.Router();

productsRouter.get('/', async (req, res, next) => {
  try {
    const query = listProductsSchema.parse(req.query);
    const filter = { tenantId: query.tenantId };

    if (query.status) {
      filter.status = query.status;
    }

    if (query.before) {
      filter.createdAt = { $lt: new Date(query.before) };
    }

    const products = await getDb().collection('products')
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(25)
      .toArray();

    res.json({ products });
  } catch (error) {
    next(error);
  }
});

productsRouter.post('/', async (req, res, next) => {
  try {
    const input = createProductSchema.parse(req.body);
    const now = new Date();

    const result = await getDb().collection('products').insertOne({
      ...input,
      createdAt: now,
      updatedAt: now,
    });

    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    next(error);
  }
});`,
      },
      { type: 'h2', text: 'Step 7: Add the server and error handler' },
      {
        type: 'code',
        title: 'src/server.js',
        language: 'javascript',
        code: `import 'dotenv/config';
import express from 'express';
import { connectDb } from './db.js';
import { ensureIndexes } from './setup.js';
import { productsRouter } from './products.routes.js';

const app = express();
app.use(express.json());
app.use('/products', productsRouter);

app.use((error, req, res, next) => {
  if (error?.name === 'ZodError') {
    return res.status(400).json({ error: 'Invalid request', details: error.errors });
  }

  if (error?.code === 11000) {
    return res.status(409).json({ error: 'Duplicate product slug for tenant' });
  }

  console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
});

const db = await connectDb();
await ensureIndexes(db);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log('API listening on port ' + port);
});`,
      },
      { type: 'h2', text: 'Step 8: Try the API' },
      {
        type: 'code',
        title: 'Create and list products',
        language: 'bash',
        code: `curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"tenantId":"tenant_acme","name":"Canvas Sneaker","slug":"canvas-sneaker","status":"active","priceCents":6900}'

curl "http://localhost:3000/products?tenantId=tenant_acme&status=active"`,
      },
      {
        type: 'try',
        text: 'Add an update route that only allows changing name, status, and priceCents. Keep tenantId and slug protected from accidental changes.',
      },
      {
        type: 'keypoints',
        items: [
          'Create one MongoClient and reuse it.',
          'Validate request input before creating MongoDB filters.',
          'Create indexes that support routes before real traffic arrives.',
          'Use cursor pagination and structured error handling in APIs.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-project-python',
    title: 'Mini Project: Flask + MongoDB App (Django notes)',
    description:
      'Build a Flask app with PyMongo, MongoDB connection setup, validation, product routes, templates, and short Django integration notes.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 61,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'In this mini project, you will build a small Flask product admin backed by MongoDB. Flask stays thin: PyMongo handles database access, routes validate input, and MongoDB indexes protect important query patterns.',
      },
      { type: 'h2', text: 'Step 1: Create the project' },
      {
        type: 'code',
        title: 'Install Flask and PyMongo',
        language: 'bash',
        code: `mkdir flask-mongodb-app
cd flask-mongodb-app
python -m venv .venv
source .venv/bin/activate
pip install Flask pymongo python-dotenv`,
      },
      {
        type: 'code',
        title: '.env',
        language: 'bash',
        code: `MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=marketplace
FLASK_APP=app.py
FLASK_DEBUG=1`,
      },
      { type: 'h2', text: 'Step 2: Create a MongoDB helper' },
      {
        type: 'code',
        title: 'db.py',
        language: 'python',
        code: `import os
from pymongo import MongoClient

client = MongoClient(
    os.environ["MONGODB_URI"],
    serverSelectionTimeoutMS=5000,
    maxPoolSize=20,
)


def get_db():
    return client[os.environ.get("MONGODB_DB", "marketplace")]


def ensure_indexes():
    db = get_db()
    db.products.create_index(
        [("tenantId", 1), ("slug", 1)],
        unique=True,
        name="tenant_slug_unique",
    )
    db.products.create_index(
        [("tenantId", 1), ("status", 1), ("createdAt", -1)],
        name="tenant_status_created",
    )`,
      },
      { type: 'h2', text: 'Step 3: Build the Flask app' },
      {
        type: 'code',
        title: 'app.py',
        language: 'python',
        code: `from datetime import datetime, timezone
from flask import Flask, redirect, render_template, request, url_for
from pymongo.errors import DuplicateKeyError
from dotenv import load_dotenv

from db import ensure_indexes, get_db

load_dotenv()

app = Flask(__name__)
ensure_indexes()


def clean_product_form(form):
    name = form.get("name", "").strip()
    slug = form.get("slug", "").strip().lower()
    tenant_id = form.get("tenantId", "").strip()
    status = form.get("status", "draft")
    price_cents = int(form.get("priceCents", "0"))

    errors = []
    if len(name) < 2:
        errors.append("Name must be at least 2 characters.")
    if not tenant_id:
        errors.append("Tenant is required.")
    if status not in ["draft", "active"]:
        errors.append("Status is invalid.")
    if price_cents < 0:
        errors.append("Price must be positive.")

    return {
        "product": {
            "tenantId": tenant_id,
            "name": name,
            "slug": slug,
            "status": status,
            "priceCents": price_cents,
        },
        "errors": errors,
    }


@app.get("/")
def index():
    tenant_id = request.args.get("tenantId", "tenant_acme")
    products = list(
        get_db().products.find({"tenantId": tenant_id})
        .sort("createdAt", -1)
        .limit(25)
    )
    return render_template("index.html", products=products, tenant_id=tenant_id)


@app.post("/products")
def create_product():
    result = clean_product_form(request.form)
    if result["errors"]:
        return render_template("new.html", errors=result["errors"], product=result["product"]), 400

    now = datetime.now(timezone.utc)
    product = {
        **result["product"],
        "createdAt": now,
        "updatedAt": now,
    }

    try:
        get_db().products.insert_one(product)
    except DuplicateKeyError:
        return render_template(
            "new.html",
            errors=["Slug already exists for this tenant."],
            product=result["product"],
        ), 409

    return redirect(url_for("index", tenantId=product["tenantId"]))


@app.get("/products/new")
def new_product():
    return render_template("new.html", errors=[], product={})`,
      },
      { type: 'h2', text: 'Step 4: Add templates' },
      {
        type: 'code',
        title: 'templates/index.html',
        language: 'text',
        code: `<h1>Products</h1>

<a href="/products/new">New product</a>

<ul>
  {% for product in products %}
    <li>
      <strong>{{ product.name }}</strong>
      {{ product.status }}
      \${{ "%.2f"|format(product.priceCents / 100) }}
    </li>
  {% else %}
    <li>No products yet.</li>
  {% endfor %}
</ul>`,
      },
      {
        type: 'code',
        title: 'templates/new.html',
        language: 'text',
        code: `<h1>New product</h1>

{% for error in errors %}
  <p style="color: red">{{ error }}</p>
{% endfor %}

<form method="post" action="/products">
  <label>Tenant <input name="tenantId" value="{{ product.tenantId or 'tenant_acme' }}"></label>
  <label>Name <input name="name" value="{{ product.name or '' }}"></label>
  <label>Slug <input name="slug" value="{{ product.slug or '' }}"></label>
  <label>Status
    <select name="status">
      <option value="draft">draft</option>
      <option value="active">active</option>
    </select>
  </label>
  <label>Price cents <input name="priceCents" type="number" value="{{ product.priceCents or 0 }}"></label>
  <button type="submit">Create</button>
</form>`,
      },
      { type: 'h2', text: 'Step 5: Run and test' },
      {
        type: 'code',
        title: 'Start Flask',
        language: 'bash',
        code: `flask run`,
      },
      {
        type: 'p',
        text: 'Open http://127.0.0.1:5000, create a product, then try creating another product with the same tenantId and slug. The unique MongoDB index should reject the duplicate.',
      },
      { type: 'h2', text: 'Django notes' },
      {
        type: 'ul',
        items: [
          'Django ORM is built for relational databases, so direct MongoDB use normally goes through PyMongo, MongoEngine, or a separate service layer.',
          'Keep MongoDB access in repository modules instead of mixing raw collection calls into every view.',
          'Use Django forms or serializers for validation, then pass clean data to MongoDB.',
          'If most of the app is relational, consider PostgreSQL for core Django models and MongoDB for document-heavy features.',
        ],
      },
      {
        type: 'try',
        text: 'Add a product detail page that loads by tenantId and slug. Create the query first, then confirm the tenant_slug_unique index supports it.',
      },
      {
        type: 'keypoints',
        items: [
          'Flask and PyMongo pair well when MongoDB access is kept explicit and small.',
          'Create indexes in startup or migration code, not manually forever.',
          'Validate form data before inserting documents.',
          'For Django, keep MongoDB behind a clear service layer and choose tools deliberately.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-project-nextjs',
    title: 'Mini Project: Next.js App Router + MongoDB',
    description:
      'Build a Next.js App Router product page using server-side MongoDB access, server-only helpers, route handlers, and safe serialization.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 62,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'In this mini project, you will build a Next.js App Router page that reads MongoDB on the server. The important skill is boundary design: database clients stay in server-only modules, pages fetch data server-side, and client components receive plain serializable props.',
      },
      { type: 'h2', text: 'Step 1: Install MongoDB driver' },
      {
        type: 'code',
        title: 'Install dependency',
        language: 'bash',
        code: `npm install mongodb`,
      },
      {
        type: 'code',
        title: '.env.local',
        language: 'bash',
        code: `MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=marketplace`,
      },
      { type: 'h2', text: 'Step 2: Create a server-only MongoDB client' },
      {
        type: 'code',
        title: 'lib/mongodb.ts',
        language: 'typescript',
        code: `import 'server-only';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is required');
}

const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

export function getMongoClient() {
  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
    });
    globalForMongo.mongoClientPromise = client.connect();
  }

  return globalForMongo.mongoClientPromise;
}

export async function getDb() {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB || 'marketplace');
}`,
      },
      {
        type: 'note',
        text: 'The global promise avoids creating a new client on every hot reload in development. In production, the module is still server-only and connection pooling remains controlled by the driver.',
      },
      { type: 'h2', text: 'Step 3: Create a data function' },
      {
        type: 'code',
        title: 'lib/products.ts',
        language: 'typescript',
        code: `import 'server-only';
import { getDb } from './mongodb';

export type ProductCard = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
};

export async function getActiveProducts(tenantId: string): Promise<ProductCard[]> {
  const db = await getDb();

  const products = await db.collection('products')
    .find({ tenantId, status: 'active' })
    .sort({ createdAt: -1 })
    .limit(24)
    .project({ name: 1, slug: 1, priceCents: 1 })
    .toArray();

  return products.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    priceCents: product.priceCents,
  }));
}`,
      },
      { type: 'h2', text: 'Step 4: Read data in a Server Component page' },
      {
        type: 'code',
        title: 'app/products/page.tsx',
        language: 'tsx',
        code: `import { getActiveProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getActiveProducts('tenant_acme');

  return (
    <main>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <a href={'/products/' + product.slug}>
              {product.name} - \${(product.priceCents / 100).toFixed(2)}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}`,
      },
      {
        type: 'warning',
        text: 'MongoDB ObjectId values are not plain JSON. Convert them to strings before passing data into Client Components or returning JSON responses.',
      },
      { type: 'h2', text: 'Step 5: Add a Route Handler for writes' },
      {
        type: 'code',
        title: 'app/api/products/route.ts',
        language: 'typescript',
        code: `import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/mongodb';

const createProductSchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  priceCents: z.number().int().nonnegative(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const input = createProductSchema.parse(body);
  const now = new Date();
  const db = await getDb();

  try {
    const result = await db.collection('products').insertOne({
      ...input,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Duplicate slug' }, { status: 409 });
    }

    throw error;
  }
}`,
      },
      { type: 'h2', text: 'Step 6: Seed test data' },
      {
        type: 'code',
        title: 'scripts/seed-products.mjs',
        language: 'javascript',
        code: `import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

const db = client.db(process.env.MONGODB_DB || 'marketplace');

await db.collection('products').createIndex(
  { tenantId: 1, slug: 1 },
  { unique: true },
);

await db.collection('products').insertOne({
  tenantId: 'tenant_acme',
  name: 'Canvas Sneaker',
  slug: 'canvas-sneaker',
  status: 'active',
  priceCents: 6900,
  createdAt: new Date(),
  updatedAt: new Date(),
});

await client.close();`,
      },
      { type: 'h2', text: 'Step 7: Production notes' },
      {
        type: 'ul',
        items: [
          'Keep MongoDB helpers in server-only modules.',
          'Use Server Components for server-side reads by default.',
          'Use Route Handlers or Server Actions for writes after authorization.',
          'Convert ObjectId and Date values before crossing client or JSON boundaries.',
          'Control caching deliberately with dynamic, revalidate, or no-store based on freshness needs.',
        ],
      },
      {
        type: 'try',
        text: 'Add a product detail page at app/products/[slug]/page.tsx that loads by tenantId and slug, returns notFound for missing products, and serializes the MongoDB document safely.',
      },
      {
        type: 'keypoints',
        items: [
          'App Router pages can access MongoDB on the server.',
          'Database clients should stay out of Client Components.',
          'Serialize ObjectId and Date values before sending data to the browser.',
          'Route Handlers are a good boundary for validated writes.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-common-mistakes',
    title: 'Common MongoDB Mistakes (and Fixes)',
    description:
      'Recognize and fix common MongoDB mistakes involving schema design, indexes, arrays, pagination, connections, validation, and production operations.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 63,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'MongoDB gives developers flexibility, but flexibility can hide mistakes until traffic grows. Advanced MongoDB work is often about preventing common problems early and noticing them quickly when they appear.',
      },
      { type: 'h2', text: 'Mistake 1: No access-pattern design' },
      {
        type: 'p',
        text: 'A collection designed only from nouns can fail real screens. Start with queries: product listing, order history, admin search, checkout, reports, and background jobs.',
      },
      {
        type: 'tip',
        text: 'Fix it by writing a small access-pattern table before creating indexes or embedding decisions.',
      },
      { type: 'h2', text: 'Mistake 2: Indexing everything' },
      {
        type: 'p',
        text: 'Too many indexes slow writes and increase storage. Indexes should exist because important query shapes need them, not because a field might be searched someday.',
      },
      {
        type: 'code',
        title: 'Check index usage',
        language: 'javascript',
        code: `db.products.aggregate([{ $indexStats: {} }])`,
      },
      { type: 'h2', text: 'Mistake 3: Accepting raw filters from users' },
      {
        type: 'code',
        title: 'Bad: raw request query',
        language: 'javascript',
        code: `const products = await db.collection('products')
  .find(req.query)
  .toArray();`,
      },
      {
        type: 'code',
        title: 'Better: explicit allowlist',
        language: 'javascript',
        code: `const filter = { tenantId: req.user.tenantId };

if (req.query.status === 'active' || req.query.status === 'draft') {
  filter.status = req.query.status;
}

const products = await db.collection('products').find(filter).toArray();`,
      },
      { type: 'h2', text: 'Mistake 4: Unbounded arrays' },
      {
        type: 'p',
        text: 'A product document can store a few variants. It should not store every click, view, or review forever. Unbounded arrays create giant documents and expensive updates.',
      },
      {
        type: 'table',
        headers: ['Bad fit for embedding', 'Better pattern'],
        rows: [
          ['Millions of product views', 'Separate events collection or analytics pipeline.'],
          ['Unbounded comments', 'Separate comments collection paginated by productId.'],
          ['Every order for a user', 'Orders collection indexed by buyerId and placedAt.'],
          ['Long audit history', 'Append-only audit collection with retention policy.'],
        ],
      },
      { type: 'h2', text: 'Mistake 5: Deep skip pagination' },
      {
        type: 'code',
        title: 'Bad: expensive deep skip',
        language: 'javascript',
        code: `db.orders.find({ buyerId }).sort({ placedAt: -1 }).skip(50000).limit(25)`,
      },
      {
        type: 'code',
        title: 'Better: cursor pagination',
        language: 'javascript',
        code: `db.orders.find({
  buyerId,
  placedAt: { $lt: lastSeenPlacedAt },
}).sort({ placedAt: -1 }).limit(25)`,
      },
      { type: 'h2', text: 'Mistake 6: New client per request' },
      {
        type: 'p',
        text: 'Creating a new MongoClient for every request can exhaust connections and slow the app. Reuse one client per process and let the driver manage pooling.',
      },
      {
        type: 'warning',
        text: 'Serverless platforms still need careful connection reuse. Watch Atlas connection metrics after deployment.',
      },
      {
        type: 'keypoints',
        items: [
          'Design collections from access patterns.',
          'Index important queries, not every field.',
          'Allowlist user filters to avoid injection and accidental scans.',
          'Avoid unbounded arrays and deep skip pagination.',
          'Reuse MongoDB clients and monitor connection counts.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-ecosystem',
    title: 'Ecosystem: Drivers, ODMs, Hosting, Tools',
    description:
      'Understand the MongoDB ecosystem: official drivers, Mongoose, MongoEngine, Prisma notes, Atlas, Compass, mongosh, backups, and developer tooling.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 64,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'MongoDB is more than the database server. The ecosystem includes official drivers, ODMs, Atlas services, command line tools, GUI tools, search, charts, connectors, and backup utilities. Advanced developers know which tool solves which problem.',
      },
      { type: 'h2', text: 'Drivers and ODMs' },
      {
        type: 'table',
        headers: ['Tool', 'Use it when'],
        rows: [
          ['Official MongoDB Node.js driver', 'You want direct control, modern JavaScript, and minimal abstraction.'],
          ['Mongoose', 'You want schemas, middleware, validation, and model methods in Node.'],
          ['PyMongo', 'You want direct MongoDB access from Python.'],
          ['MongoEngine', 'You want a Python ODM with document classes.'],
          ['Prisma MongoDB connector', 'You already use Prisma and accept MongoDB connector limitations.'],
        ],
      },
      {
        type: 'p',
        text: 'ODMs can be helpful, but they do not remove the need to understand indexes, document growth, query shape, or operational behavior.',
      },
      { type: 'h2', text: 'Hosting choices' },
      {
        type: 'table',
        headers: ['Option', 'Strength', 'Watch out'],
        rows: [
          ['MongoDB Atlas', 'Managed clusters, backups, monitoring, Search, scaling options', 'Cost and configuration still need review.'],
          ['Self-managed VM', 'Full control for learning or special environments', 'You own security, backups, upgrades, and monitoring.'],
          ['Local Docker', 'Fast development and tests', 'Not a production operations model by itself.'],
        ],
      },
      { type: 'h2', text: 'Everyday tools' },
      {
        type: 'ul',
        items: [
          'mongosh for direct shell exploration and admin commands.',
          'MongoDB Compass for browsing documents, building queries, and inspecting indexes.',
          'Atlas Performance Advisor for index suggestions based on observed workload.',
          'Atlas Search for relevance-ranked search powered by Lucene.',
          'mongodump and mongorestore for small backup, restore, and migration tasks.',
          'Change streams for reactive integrations on replica sets or sharded clusters.',
        ],
      },
      {
        type: 'code',
        title: 'Local MongoDB with Docker for development',
        language: 'bash',
        code: `docker run --name mongo-dev \
  -p 27017:27017 \
  -v mongo-dev-data:/data/db \
  -d mongo:latest`,
      },
      { type: 'h2', text: 'Choosing direct driver vs ODM' },
      {
        type: 'table',
        headers: ['Question', 'Direct driver', 'ODM'],
        rows: [
          ['Do you need model middleware?', 'Usually no', 'Often yes'],
          ['Do you want minimal magic?', 'Yes', 'Less so'],
          ['Do you need schema helpers?', 'Manual or validator library', 'Built in'],
          ['Do you need maximum driver feature access?', 'Best fit', 'May lag or wrap features'],
        ],
      },
      {
        type: 'try',
        text: 'Build the same simple products route once with the official driver and once with Mongoose. Compare validation, query syntax, testing, and error handling.',
      },
      {
        type: 'keypoints',
        items: [
          'The official drivers expose MongoDB directly and are always worth learning.',
          'ODMs help with app structure but do not replace database understanding.',
          'Atlas is the common production hosting path, but configuration still matters.',
          'Compass, mongosh, profiler data, and Atlas metrics are daily MongoDB tools.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-next-steps',
    title: 'What to Learn After MongoDB',
    description:
      'Plan your next learning path after MongoDB: data modeling, distributed systems, search, analytics, security, testing, and production architecture.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 65,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'After learning MongoDB, the next step is not memorizing more commands. It is learning how databases fit into complete systems: product requirements, application code, security, operations, analytics, search, and incident response.',
      },
      { type: 'h2', text: 'Deepen MongoDB skills' },
      {
        type: 'ul',
        items: [
          'Aggregation pipelines for reporting and transformations.',
          'Advanced indexes including partial, TTL, text, wildcard, and geospatial indexes.',
          'Transactions and sessions for critical multi-document workflows.',
          'Change streams and outbox patterns for event-driven systems.',
          'Atlas Search for real search experiences.',
          'Sharding design with production-like data.',
        ],
      },
      { type: 'h2', text: 'Learn adjacent production skills' },
      {
        type: 'table',
        headers: ['Skill', 'Why it helps MongoDB apps'],
        rows: [
          ['API design', 'Good route boundaries make query patterns clearer.'],
          ['Authentication and authorization', 'Tenant isolation and data safety depend on it.'],
          ['Observability', 'Metrics and traces make performance work measurable.'],
          ['Background jobs', 'Migrations, outbox processing, and search indexing often run async.'],
          ['Testing', 'Integration tests catch query and index assumptions.'],
          ['Cloud networking', 'Private endpoints, firewalls, and secrets affect database safety.'],
        ],
      },
      { type: 'h2', text: 'Practice projects' },
      {
        type: 'ol',
        items: [
          'Build a multi-tenant notes app with tenant-scoped indexes.',
          'Build a marketplace checkout with orders, payments, and an outbox collection.',
          'Build a search page using Atlas Search or a search read model.',
          'Build a dashboard using aggregation pipelines and cached summaries.',
          'Write a migration that updates one million documents in safe batches.',
          'Create a restore drill using a staging database.',
        ],
      },
      { type: 'h2', text: 'A simple advanced roadmap' },
      {
        type: 'code',
        title: 'Four-week practice plan',
        language: 'text',
        code: `Week 1: Explain plans, indexes, and query performance
Week 2: Schema design, embedding, references, and migrations
Week 3: Security, backups, observability, and Atlas production settings
Week 4: Capstone app with API, background worker, tests, and deployment notes`,
      },
      {
        type: 'p',
        text: 'The strongest MongoDB developers can explain trade-offs clearly. They know when to embed, when to reference, when to index, when to archive, when to use transactions, and when a relational database or search engine is the better tool.',
      },
      {
        type: 'try',
        text: 'Choose one capstone idea and write a one-page design note: collections, example documents, indexes, risks, backup plan, and the first five queries you will optimize.',
      },
      {
        type: 'keypoints',
        items: [
          'Move from commands to system design and production judgment.',
          'Practice with real projects that include indexes, auth, monitoring, and backups.',
          'Learn adjacent skills such as API design, observability, jobs, and cloud networking.',
          'MongoDB mastery means knowing trade-offs, not always choosing MongoDB for every problem.',
        ],
      },
    ],
  },
];
