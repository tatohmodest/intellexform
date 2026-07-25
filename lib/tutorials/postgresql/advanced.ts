import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'postgres-security',
    title: 'PostgreSQL Security Essentials',
    description:
      'Secure a PostgreSQL database with roles, least privilege, safe connections, secrets, row-level security, and audit-friendly habits.',
    level: 'advanced',
    section: 'Production Ready',
    order: 49,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'PostgreSQL security starts with a simple idea: every connection should have only the power it needs. A production database is not protected by one setting. It is protected by roles, network rules, encrypted connections, safe application code, backups, logging, and regular review.',
      },
      {
        type: 'p',
        text: 'In a real app, the database usually has several identities: a migration role that can change schema, an application role that can read and write normal data, a read-only analytics role, and an admin role used rarely. This keeps one leaked password from becoming a full system takeover.',
      },
      { type: 'h2', text: 'Use least privilege roles' },
      {
        type: 'code',
        title: 'Create separate roles for app and migrations',
        language: 'sql',
        code: `-- Run as a database owner or admin role.
CREATE ROLE app_user LOGIN PASSWORD 'change-me-in-a-secret-manager';
CREATE ROLE migrator LOGIN PASSWORD 'change-me-too';

CREATE SCHEMA app AUTHORIZATION migrator;

GRANT USAGE ON SCHEMA app TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO app_user;

ALTER DEFAULT PRIVILEGES FOR ROLE migrator IN SCHEMA app
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;

ALTER DEFAULT PRIVILEGES FOR ROLE migrator IN SCHEMA app
GRANT USAGE, SELECT ON SEQUENCES TO app_user;`,
      },
      {
        type: 'tip',
        text: 'Let migrations create and alter tables. Let the web app use the tables. Do not let the web app run CREATE TABLE, DROP TABLE, or ALTER TABLE in production.',
      },
      { type: 'h2', text: 'Know the important GRANT targets' },
      {
        type: 'table',
        headers: ['Target', 'Example permission', 'Why it matters'],
        rows: [
          ['DATABASE', 'CONNECT', 'Controls whether a role can connect to the database.'],
          ['SCHEMA', 'USAGE', 'Allows objects inside a schema to be referenced.'],
          ['TABLE', 'SELECT, INSERT, UPDATE, DELETE', 'Controls data access.'],
          ['SEQUENCE', 'USAGE, SELECT', 'Allows serial or identity values to be generated.'],
          ['FUNCTION', 'EXECUTE', 'Controls stored procedure and function calls.'],
        ],
      },
      { type: 'h2', text: 'Protect application queries' },
      {
        type: 'p',
        text: 'Most data leaks do not begin with a database bug. They begin with unsafe application code. Always use parameterized queries, validate user input, and avoid building SQL with string concatenation.',
      },
      {
        type: 'code',
        title: 'Parameterized query in an Express route',
        language: 'javascript',
        code: `import express from 'express';
import pg from 'pg';

const app = express();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/users/:id', async (req, res) => {
  const result = await pool.query(
    'SELECT id, email, display_name FROM app.users WHERE id = $1',
    [req.params.id],
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(result.rows[0]);
});`,
      },
      {
        type: 'warning',
        text: 'Never place raw user input directly into SQL text. Prepared statements and parameter arrays let PostgreSQL treat values as values, not executable SQL.',
      },
      { type: 'h2', text: 'Use row-level security for tenant or owner checks' },
      {
        type: 'p',
        text: 'Row-level security, often called RLS, lets PostgreSQL decide which rows a role can see or change. It is useful when every query should be filtered by tenant, organization, account, or owner.',
      },
      {
        type: 'code',
        title: 'Owner-based row-level security',
        language: 'sql',
        code: `CREATE TABLE app.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  title text NOT NULL,
  body text NOT NULL
);

ALTER TABLE app.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY documents_by_owner ON app.documents
USING (owner_id = current_setting('app.current_user_id')::uuid)
WITH CHECK (owner_id = current_setting('app.current_user_id')::uuid);`,
      },
      {
        type: 'code',
        title: 'Set the current user id inside a transaction',
        language: 'sql',
        code: `BEGIN;

SELECT set_config('app.current_user_id', '8f8b5c2d-8c2b-4e7b-9b0d-111111111111', true);

SELECT id, title
FROM app.documents;

COMMIT;`,
      },
      {
        type: 'note',
        text: 'RLS is powerful, but it is not a replacement for application authorization. Use both: the app decides what action is allowed, and the database prevents accidental broad reads or writes.',
      },
      { type: 'h2', text: 'Production security checklist' },
      {
        type: 'ul',
        items: [
          'Store database passwords in a secret manager or environment variables, never in Git.',
          'Require TLS for remote connections when traffic leaves a trusted private network.',
          'Use separate roles for app runtime, migrations, analytics, and administration.',
          'Rotate credentials when a developer leaves or a deployment system changes.',
          'Log failed connections and unusual permission errors.',
          'Back up before major permission changes, then test with a non-admin role.',
        ],
      },
      {
        type: 'try',
        text: 'Create a read-only role for reporting. Grant it SELECT on a safe view, then prove it cannot insert, update, delete, or read tables outside that view.',
      },
      {
        type: 'keypoints',
        items: [
          'Least privilege is the foundation of PostgreSQL security.',
          'Parameterized queries protect app code from SQL injection.',
          'Row-level security can enforce row ownership or tenant isolation inside the database.',
          'Production security is a habit: roles, secrets, TLS, logs, backups, and review.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-performance',
    title: 'Performance Tuning Mindset',
    description:
      'Learn a practical PostgreSQL performance workflow: measure first, read query plans, index carefully, and tune with production safety.',
    level: 'advanced',
    section: 'Production Ready',
    order: 50,
    minutes: 19,
    content: [
      {
        type: 'p',
        text: 'PostgreSQL performance is not guesswork. The advanced mindset is: measure the slow thing, understand the plan, change one variable, verify the result, and keep the schema readable. A clever index that nobody understands can become tomorrow morning outage.',
      },
      {
        type: 'h2',
        text: 'Start with the user-visible symptom',
      },
      {
        type: 'ol',
        items: [
          'Find the slow page, API route, background job, or report.',
          'Identify the exact SQL query and parameters.',
          'Run EXPLAIN or EXPLAIN ANALYZE in a safe environment.',
          'Check row estimates, scans, joins, sorts, and memory use.',
          'Add or adjust an index only when the plan proves it is useful.',
          'Compare before and after with realistic data volume.',
        ],
      },
      {
        type: 'code',
        title: 'Read a query plan',
        language: 'sql',
        code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, customer_id, status, total_cents
FROM orders
WHERE customer_id = '7c98ab31-2d8b-4f3d-9999-111111111111'
  AND status = 'paid'
ORDER BY created_at DESC
LIMIT 20;`,
      },
      {
        type: 'table',
        headers: ['Plan clue', 'What it can mean', 'Common response'],
        rows: [
          ['Seq Scan on a huge table', 'PostgreSQL is reading many rows', 'Add a selective index or rewrite the filter.'],
          ['Rows Removed by Filter is high', 'The condition is filtering too late', 'Index the filtering columns or improve the predicate.'],
          ['Sort Method uses disk', 'Sort exceeded memory', 'Add an index for the order or tune work_mem carefully.'],
          ['Bad estimated rows', 'Statistics are stale or data is skewed', 'Run ANALYZE or use extended statistics.'],
          ['Nested Loop with many rows', 'A join strategy may be expensive', 'Check indexes on join keys and row estimates.'],
        ],
      },
      { type: 'h2', text: 'Indexes are tools, not decorations' },
      {
        type: 'p',
        text: 'Indexes speed up reads by keeping searchable data in a separate structure. They also slow down writes because every insert, update, and delete may need to maintain each index. Production schemas should have indexes that serve known access patterns.',
      },
      {
        type: 'code',
        title: 'Composite index for filtering and ordering',
        language: 'sql',
        code: `CREATE INDEX CONCURRENTLY orders_customer_status_created_idx
ON orders (customer_id, status, created_at DESC);`,
      },
      {
        type: 'note',
        text: 'Use CREATE INDEX CONCURRENTLY on large production tables so normal reads and writes can continue. It takes longer and cannot run inside a transaction block, but it avoids a long write lock.',
      },
      { type: 'h2', text: 'Make statistics work for you' },
      {
        type: 'code',
        title: 'Refresh statistics and create extended stats',
        language: 'sql',
        code: `ANALYZE orders;

CREATE STATISTICS orders_status_country_stats
ON status, shipping_country
FROM orders;

ANALYZE orders;`,
      },
      {
        type: 'p',
        text: 'The planner chooses a plan based on table statistics. When estimates are wrong, PostgreSQL can pick a plan that looks cheap but runs slowly. This is common after bulk imports, major deletes, or when two columns are highly related.',
      },
      { type: 'h2', text: 'Connection count is part of performance' },
      {
        type: 'p',
        text: 'Every PostgreSQL connection uses memory. A web app with many serverless instances or many Node processes can overwhelm the database even when each request is simple. Use a connection pool and set realistic limits.',
      },
      {
        type: 'code',
        title: 'Small Node pool with a timeout',
        language: 'javascript',
        code: `import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});`,
      },
      {
        type: 'warning',
        text: 'Do not solve every slow query by raising database memory settings. Query shape, missing indexes, poor batching, and excessive connections are often the real cause.',
      },
      { type: 'h2', text: 'A safe performance workflow' },
      {
        type: 'ul',
        items: [
          'Keep slow query logs or pg_stat_statements enabled in production.',
          'Reproduce with similar row counts before declaring a fix.',
          'Prefer one targeted index over many broad indexes.',
          'Use LIMIT with stable ORDER BY for pages and feeds.',
          'Avoid N+1 queries by batching or joining deliberately.',
          'Measure write performance after adding indexes.',
        ],
      },
      {
        type: 'try',
        text: 'Pick one endpoint in an app. Log its SQL, run EXPLAIN ANALYZE, add one index that matches the WHERE and ORDER BY pattern, then compare the plan again.',
      },
      {
        type: 'keypoints',
        items: [
          'Tune from evidence, not guesses.',
          'EXPLAIN ANALYZE shows the actual work done by PostgreSQL.',
          'Indexes must match real filters, joins, and ordering patterns.',
          'Connections, statistics, and data volume all affect performance.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-extensions',
    title: 'Useful Extensions (uuid, pgcrypto, etc.)',
    description:
      'Use PostgreSQL extensions such as pgcrypto, citext, pg_trgm, unaccent, and btree_gin to add production-ready features safely.',
    level: 'advanced',
    section: 'Production Ready',
    order: 51,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Extensions add features to PostgreSQL without turning your app into a different database. They can provide UUID generation, hashing, case-insensitive text, fuzzy search, geospatial types, job queues, and more. In production, treat extensions like dependencies: install only what you use and document why it exists.',
      },
      { type: 'h2', text: 'Enable extensions intentionally' },
      {
        type: 'code',
        title: 'Common extension setup',
        language: 'sql',
        code: `CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;`,
      },
      {
        type: 'warning',
        text: 'Some managed hosting providers restrict extensions. Check provider support before designing a feature around an extension.',
      },
      { type: 'h2', text: 'UUIDs with pgcrypto' },
      {
        type: 'p',
        text: 'The pgcrypto extension includes gen_random_uuid, which is a common default for public identifiers. UUIDs are useful when IDs are created across services or when exposing sequential IDs would leak business volume.',
      },
      {
        type: 'code',
        title: 'UUID primary key default',
        language: 'sql',
        code: `CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);`,
      },
      { type: 'h2', text: 'Case-insensitive email with citext' },
      {
        type: 'code',
        title: 'citext prevents duplicate email casing',
        language: 'sql',
        code: `CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext NOT NULL UNIQUE,
  password_hash text NOT NULL
);

INSERT INTO users (email, password_hash)
VALUES ('Amina@example.com', 'hash-1');

-- This fails because citext compares case-insensitively.
INSERT INTO users (email, password_hash)
VALUES ('amina@example.com', 'hash-2');`,
      },
      { type: 'h2', text: 'Hashes and random bytes with pgcrypto' },
      {
        type: 'code',
        title: 'Hash a value inside PostgreSQL',
        language: 'sql',
        code: `SELECT encode(digest('hello', 'sha256'), 'hex') AS sha256_hash;

SELECT encode(gen_random_bytes(16), 'hex') AS random_token;`,
      },
      {
        type: 'note',
        text: 'Application libraries such as bcrypt, argon2, or scrypt are usually better for password hashing. pgcrypto is still useful for tokens, checksums, encryption experiments, and database-side utilities.',
      },
      { type: 'h2', text: 'Fast fuzzy search with pg_trgm' },
      {
        type: 'code',
        title: 'Trigram index for search-as-you-type',
        language: 'sql',
        code: `CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL
);

CREATE INDEX products_name_trgm_idx
ON products USING gin (name gin_trgm_ops);

SELECT id, name
FROM products
WHERE name ILIKE '%keybord%'
ORDER BY similarity(name, 'keybord') DESC
LIMIT 10;`,
      },
      {
        type: 'table',
        headers: ['Extension', 'Use it for', 'Production note'],
        rows: [
          ['pgcrypto', 'UUIDs, hashing, random bytes', 'Commonly available and useful in migrations.'],
          ['citext', 'Case-insensitive text', 'Great for emails and usernames.'],
          ['pg_trgm', 'Fuzzy text search', 'Needs GIN or GiST indexes for speed.'],
          ['unaccent', 'Accent-insensitive search', 'Often paired with search functions.'],
          ['postgis', 'Geospatial queries', 'Very powerful, but plan schema and indexes carefully.'],
        ],
      },
      { type: 'h2', text: 'Document extension dependencies' },
      {
        type: 'p',
        text: 'A migration that uses gen_random_uuid should also create pgcrypto. A column that uses citext should have citext enabled first. This makes fresh test databases, CI databases, and disaster recovery restores predictable.',
      },
      {
        type: 'try',
        text: 'Create a products table with pg_trgm search on name. Insert misspelled sample searches and compare ILIKE behavior before and after adding the trigram index.',
      },
      {
        type: 'keypoints',
        items: [
          'Extensions are production dependencies and should be managed in migrations.',
          'pgcrypto is a common way to generate UUIDs with gen_random_uuid.',
          'citext is useful for email and username uniqueness.',
          'pg_trgm can make fuzzy search practical when indexed correctly.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-partitioning',
    title: 'Partitioning Intro',
    description:
      'Understand PostgreSQL table partitioning for large time-based or tenant-based datasets, including safe design rules and practical SQL.',
    level: 'advanced',
    section: 'Production Ready',
    order: 52,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Partitioning splits one logical table into smaller physical tables. Your application can query the parent table, while PostgreSQL stores rows in child partitions. This is useful when a table grows so large that retention, maintenance, indexes, or queries become difficult.',
      },
      {
        type: 'p',
        text: 'Good partitioning is boring and predictable. The best partition key is usually a column already present in most queries, such as created_at for events or tenant_id for very large tenant data.',
      },
      { type: 'h2', text: 'When partitioning helps' },
      {
        type: 'ul',
        items: [
          'You store time-series data such as logs, analytics events, audit records, or metrics.',
          'You frequently delete or archive old data by month or week.',
          'Indexes on a giant table are expensive to maintain.',
          'Queries usually target a small time range or one large tenant.',
          'Vacuum and maintenance on one huge table have become painful.',
        ],
      },
      {
        type: 'warning',
        text: 'Partitioning is not a magic speed button. If queries do not filter by the partition key, PostgreSQL may still inspect many partitions.',
      },
      { type: 'h2', text: 'Range partitioning by month' },
      {
        type: 'code',
        title: 'Create a partitioned events table',
        language: 'sql',
        code: `CREATE TABLE events (
  id bigserial,
  account_id uuid NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL,
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2026_01 PARTITION OF events
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE events_2026_02 PARTITION OF events
FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');`,
      },
      {
        type: 'note',
        text: 'A primary key or unique constraint on a partitioned table must include the partition key. That is why the example uses PRIMARY KEY (id, created_at).',
      },
      {
        type: 'code',
        title: 'Query with partition pruning',
        language: 'sql',
        code: `EXPLAIN
SELECT event_type, count(*)
FROM events
WHERE created_at >= '2026-02-01'
  AND created_at < '2026-03-01'
GROUP BY event_type;`,
      },
      {
        type: 'p',
        text: 'Partition pruning means PostgreSQL can skip partitions that cannot contain matching rows. In the example, January data does not need to be read for a February query.',
      },
      { type: 'h2', text: 'Index each partition through the parent' },
      {
        type: 'code',
        title: 'Create an index on the partitioned table',
        language: 'sql',
        code: `CREATE INDEX events_account_created_idx
ON events (account_id, created_at DESC);`,
      },
      {
        type: 'p',
        text: 'PostgreSQL creates matching indexes for partitions. This keeps the parent table as the main schema object while still giving every partition the access paths it needs.',
      },
      { type: 'h2', text: 'Retention becomes simple' },
      {
        type: 'code',
        title: 'Detach and drop an old partition',
        language: 'sql',
        code: `ALTER TABLE events DETACH PARTITION events_2026_01;

-- Archive first if needed, then drop.
DROP TABLE events_2026_01;`,
      },
      {
        type: 'table',
        headers: ['Pattern', 'Good for', 'Watch out for'],
        rows: [
          ['Range by date', 'Logs, events, invoices, time-series data', 'Create future partitions before writes arrive.'],
          ['List by tenant', 'A few very large tenants', 'Too many partitions can hurt planning time.'],
          ['Hash by id', 'Evenly spreading large tables', 'Less helpful for date-based retention.'],
        ],
      },
      {
        type: 'try',
        text: 'Create three monthly partitions for an events table, insert sample rows, and run EXPLAIN on a query that includes and omits created_at. Notice how the plan changes.',
      },
      {
        type: 'keypoints',
        items: [
          'Partitioning is mainly for very large tables with predictable access patterns.',
          'Queries should include the partition key to benefit from pruning.',
          'Time-based partitions make retention and archival much easier.',
          'Partitioning adds operational responsibility, especially creating future partitions.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-replication-intro',
    title: 'Replication & Backups (Conceptual)',
    description:
      'Understand PostgreSQL backups, WAL, read replicas, point-in-time recovery, and recovery planning at a practical production level.',
    level: 'advanced',
    section: 'Production Ready',
    order: 53,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Production PostgreSQL needs a recovery story before something goes wrong. Backups answer "Can we restore data?" Replication answers "Can another server keep a near-current copy?" They are related, but they are not the same.',
      },
      { type: 'h2', text: 'Backups are for recovery' },
      {
        type: 'p',
        text: 'A backup is a restorable copy of data. For small databases, a logical dump can be enough. For larger production systems, physical backups plus WAL archiving are commonly used for point-in-time recovery.',
      },
      {
        type: 'code',
        title: 'Logical backup with pg_dump',
        language: 'bash',
        code: `pg_dump "$DATABASE_URL" \
  --format=custom \
  --file=backup.dump`,
      },
      {
        type: 'code',
        title: 'Restore a custom-format dump',
        language: 'bash',
        code: `createdb restored_app

pg_restore \
  --dbname=restored_app \
  --clean \
  --if-exists \
  backup.dump`,
      },
      {
        type: 'note',
        text: 'A backup has not succeeded until you have restored it somewhere and verified the application can use the restored data.',
      },
      { type: 'h2', text: 'WAL is PostgreSQL history' },
      {
        type: 'p',
        text: 'PostgreSQL writes changes to the write-ahead log, usually called WAL. WAL helps crash recovery and powers replication. With base backups and archived WAL files, PostgreSQL can replay changes to a specific time.',
      },
      {
        type: 'table',
        headers: ['Term', 'Meaning', 'Why it matters'],
        rows: [
          ['RPO', 'Recovery Point Objective', 'How much data loss is acceptable.'],
          ['RTO', 'Recovery Time Objective', 'How long the system may be down.'],
          ['WAL', 'Write-ahead log', 'Records changes for recovery and replicas.'],
          ['PITR', 'Point-in-time recovery', 'Restore to before a bad migration or accidental delete.'],
          ['Replica lag', 'How far behind a replica is', 'Affects read freshness and failover safety.'],
        ],
      },
      { type: 'h2', text: 'Replication is not a backup' },
      {
        type: 'p',
        text: 'A replica copies changes from the primary database. If someone deletes important rows on the primary, the delete usually replicates too. Replicas help with high availability and read scaling, but backups help you recover from human error, bad deploys, and data corruption.',
      },
      {
        type: 'code',
        title: 'Read from primary and replica in app code',
        language: 'javascript',
        code: `import pg from 'pg';

export const primaryPool = new pg.Pool({
  connectionString: process.env.PRIMARY_DATABASE_URL,
});

export const replicaPool = new pg.Pool({
  connectionString: process.env.REPLICA_DATABASE_URL,
});

export async function getDashboardStats() {
  // Analytics can often tolerate slight replica lag.
  return replicaPool.query('SELECT count(*)::int AS total_users FROM users');
}

export async function createOrder(values) {
  // Writes must go to the primary.
  return primaryPool.query(
    'INSERT INTO orders (customer_id, total_cents) VALUES ($1, $2) RETURNING id',
    [values.customerId, values.totalCents],
  );
}`,
      },
      { type: 'h2', text: 'What to ask before production launch' },
      {
        type: 'ul',
        items: [
          'How often are backups created?',
          'Where are backups stored, and who can delete them?',
          'How often is restore testing performed?',
          'What is the expected RPO and RTO?',
          'Do replicas exist, and how is lag monitored?',
          'What is the manual failover or provider failover process?',
          'How are backups encrypted and access-controlled?',
        ],
      },
      {
        type: 'warning',
        text: 'Do not rely only on your hosting provider dashboard. Write down the restore steps and test them with a real restore target.',
      },
      {
        type: 'try',
        text: 'Take a pg_dump of a local database, restore it into a new local database, and point a copy of your app at the restored database. This is the smallest useful recovery drill.',
      },
      {
        type: 'keypoints',
        items: [
          'Backups and replicas solve different problems.',
          'WAL makes crash recovery, replication, and point-in-time recovery possible.',
          'RPO and RTO turn vague recovery hopes into measurable goals.',
          'A backup is only trustworthy after a successful restore test.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-docker',
    title: 'PostgreSQL with Docker',
    description:
      'Run PostgreSQL locally with Docker Compose, persistent volumes, environment variables, health checks, and app connection strings.',
    level: 'advanced',
    section: 'Ops Basics',
    order: 54,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Docker is a convenient way to run PostgreSQL for local development and testing. The important idea is persistence: the database data must live in a volume, not only inside a temporary container filesystem.',
      },
      { type: 'h2', text: 'A practical docker-compose.yml' },
      {
        type: 'code',
        title: 'PostgreSQL service with health check',
        language: 'text',
        code: `services:
  db:
    image: postgres:16
    container_name: intellex-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: intellex_dev
      POSTGRES_USER: intellex
      POSTGRES_PASSWORD: intellex_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U intellex -d intellex_dev"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_data:`,
      },
      {
        type: 'note',
        text: 'The init directory runs only when the database volume is empty. If you change init SQL after the first run, use migrations or recreate the volume intentionally.',
      },
      {
        type: 'code',
        title: 'Start and inspect the container',
        language: 'bash',
        code: `docker compose up -d
docker compose ps
docker compose logs db`,
      },
      { type: 'h2', text: 'Connect from psql or an app' },
      {
        type: 'code',
        title: 'Local connection string',
        language: 'text',
        code: `postgresql://intellex:intellex_password@localhost:5432/intellex_dev`,
      },
      {
        type: 'code',
        title: 'Connect with psql',
        language: 'bash',
        code: `psql "postgresql://intellex:intellex_password@localhost:5432/intellex_dev"`,
      },
      {
        type: 'code',
        title: 'Use the same URL in Node',
        language: 'javascript',
        code: `import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const result = await pool.query('SELECT now() AS connected_at');
console.log(result.rows[0]);`,
      },
      { type: 'h2', text: 'Add an initialization script' },
      {
        type: 'code',
        title: 'db/init/001-create-schema.sql',
        language: 'sql',
        code: `CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS health_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO health_checks (message)
VALUES ('PostgreSQL is ready');`,
      },
      {
        type: 'warning',
        text: 'Do not use the sample password in shared environments. Local Docker defaults are for developer convenience, not production secrets.',
      },
      { type: 'h2', text: 'Reset local data safely' },
      {
        type: 'code',
        title: 'Stop and remove the local volume',
        language: 'bash',
        code: `docker compose down
docker volume ls
docker compose down --volumes`,
      },
      {
        type: 'p',
        text: 'Removing the volume deletes local data. This is useful for clean test runs, but it is destructive. In a team, put reset commands in documentation so developers know what will be deleted.',
      },
      {
        type: 'try',
        text: 'Create the Compose file, start PostgreSQL, connect with psql, insert one row, restart the container, and confirm the row still exists because the volume persisted it.',
      },
      {
        type: 'keypoints',
        items: [
          'Docker Compose makes local PostgreSQL repeatable.',
          'Use volumes for persistent database data.',
          'Health checks help apps wait until PostgreSQL accepts connections.',
          'Initialization scripts are for first boot; migrations handle ongoing schema changes.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-production-checklist',
    title: 'Production Checklist',
    description:
      'Use a practical PostgreSQL launch checklist covering schema, migrations, pooling, backups, monitoring, security, and operational drills.',
    level: 'advanced',
    section: 'Ops Basics',
    order: 55,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'A production checklist turns database reliability into repeatable behavior. The goal is not perfection. The goal is to avoid obvious risks before launch and to know what to do when something breaks.',
      },
      { type: 'h2', text: 'Schema and migration readiness' },
      {
        type: 'ul',
        items: [
          'All schema changes are tracked in migrations.',
          'Migrations are tested against a copy of realistic data.',
          'Large indexes use CREATE INDEX CONCURRENTLY when possible.',
          'Dangerous operations such as DROP COLUMN are planned with backups and deploy timing.',
          'Constraints exist for important business rules, not only app validation.',
          'Foreign keys and indexes match the main join and lookup patterns.',
        ],
      },
      {
        type: 'code',
        title: 'Safer pattern for adding a required column',
        language: 'sql',
        code: `ALTER TABLE customers ADD COLUMN billing_email citext;

UPDATE customers
SET billing_email = email
WHERE billing_email IS NULL;

ALTER TABLE customers
ALTER COLUMN billing_email SET NOT NULL;`,
      },
      { type: 'h2', text: 'Runtime readiness' },
      {
        type: 'table',
        headers: ['Area', 'Question', 'Good sign'],
        rows: [
          ['Connections', 'Can the app exceed max_connections?', 'Pool size is set and load-tested.'],
          ['Timeouts', 'Can one query run forever?', 'statement_timeout is configured for app roles.'],
          ['Secrets', 'Can credentials leak from Git or logs?', 'Secrets live outside source control.'],
          ['Backups', 'Can you restore today?', 'Recent restore test passed.'],
          ['Monitoring', 'Can you see slow queries?', 'Logs or pg_stat_statements are enabled.'],
          ['Migrations', 'Can you roll forward safely?', 'Deploy process is documented and rehearsed.'],
        ],
      },
      {
        type: 'code',
        title: 'Role-level safety timeouts',
        language: 'sql',
        code: `ALTER ROLE app_user SET statement_timeout = '15s';
ALTER ROLE app_user SET idle_in_transaction_session_timeout = '30s';
ALTER ROLE app_user SET lock_timeout = '5s';`,
      },
      {
        type: 'note',
        text: 'Timeouts should match the application. A reporting role may need longer queries than an API role. Start conservative, watch errors, then adjust intentionally.',
      },
      { type: 'h2', text: 'Operational readiness' },
      {
        type: 'ol',
        items: [
          'Write down how to connect to production safely.',
          'Write down how to restore a backup into a new environment.',
          'Write down how to pause background jobs during an incident.',
          'Confirm who can rotate credentials.',
          'Confirm who receives database alerts.',
          'Run a small incident drill before launch.',
        ],
      },
      {
        type: 'warning',
        text: 'Do not give every developer permanent superuser access. Prefer audited break-glass access for rare emergency tasks.',
      },
      {
        type: 'code',
        title: 'Minimum useful environment variables',
        language: 'text',
        code: `DATABASE_URL=postgresql://app_user:secret@db.example.com:5432/app
DATABASE_POOL_MAX=10
DATABASE_STATEMENT_TIMEOUT_MS=15000
DATABASE_SSL_MODE=require`,
      },
      {
        type: 'try',
        text: 'Take one existing app and fill out the checklist honestly. Mark each item as ready, risky, or unknown. Unknown is useful because it tells you what to investigate before launch.',
      },
      {
        type: 'keypoints',
        items: [
          'Production readiness is mostly process plus a few important database settings.',
          'Migrations, backups, timeouts, pooling, monitoring, and roles should be ready before traffic.',
          'A restore test is more valuable than a vague backup promise.',
          'Write operational steps down before an incident happens.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-architecture',
    title: 'Schema Design for Real Apps',
    description:
      'Design PostgreSQL schemas for real applications using constraints, normalized tables, domain boundaries, event tables, and practical naming.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 56,
    minutes: 19,
    content: [
      {
        type: 'p',
        text: 'Schema design is application architecture in database form. Tables describe the important nouns in your product. Foreign keys describe relationships. Constraints describe promises the app must keep. A strong schema makes bad data hard to create.',
      },
      { type: 'h2', text: 'Design from workflows, not screens' },
      {
        type: 'p',
        text: 'Screens change often. Core workflows change more slowly. For an ecommerce app, workflows include browsing products, placing orders, paying invoices, shipping items, and refunding payments. Each workflow reveals entities and state transitions.',
      },
      {
        type: 'table',
        headers: ['Workflow', 'Likely tables', 'Important rule'],
        rows: [
          ['Account signup', 'users, accounts, memberships', 'A user can belong to many accounts.'],
          ['Checkout', 'carts, cart_items, orders, order_items', 'An order keeps price history at purchase time.'],
          ['Payments', 'payments, refunds', 'Payment state must be auditable.'],
          ['Inventory', 'products, stock_movements', 'Stock changes should be traceable.'],
        ],
      },
      { type: 'h2', text: 'Use constraints for truth' },
      {
        type: 'code',
        title: 'Constraints that protect business rules',
        language: 'sql',
        code: `CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  product_name text NOT NULL,
  unit_price_cents integer NOT NULL CHECK (unit_price_cents >= 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  UNIQUE (order_id, product_id)
);`,
      },
      {
        type: 'p',
        text: 'The app should validate quantity before sending SQL, but the database should also reject impossible quantities. Constraints are the last line of defense against bugs, scripts, and future services.',
      },
      { type: 'h2', text: 'Snapshot facts that must not change' },
      {
        type: 'p',
        text: 'A product name or price may change after an order is placed. The order item should keep the name and price used at checkout. This is deliberate duplication because the historical record matters.',
      },
      {
        type: 'code',
        title: 'Order item stores purchase-time facts',
        language: 'sql',
        code: `INSERT INTO order_items (
  order_id,
  product_id,
  product_name,
  unit_price_cents,
  quantity
)
SELECT
  $1,
  id,
  name,
  price_cents,
  $2
FROM products
WHERE id = $3;`,
      },
      { type: 'h2', text: 'Prefer explicit states' },
      {
        type: 'code',
        title: 'Status with a check constraint',
        language: 'sql',
        code: `CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'placed', 'paid', 'shipped', 'cancelled')),
  total_cents integer NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);`,
      },
      {
        type: 'tip',
        text: 'PostgreSQL enum types can work well for stable values. Check constraints are easier to change in many app teams, especially early in a product.',
      },
      { type: 'h2', text: 'Keep audit fields boring' },
      {
        type: 'code',
        title: 'Common timestamps',
        language: 'sql',
        code: `created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now(),
deleted_at timestamptz`,
      },
      {
        type: 'p',
        text: 'Soft deletes can be useful for user recovery and audit flows, but they complicate uniqueness and queries. Use them for tables that need recovery, not automatically everywhere.',
      },
      {
        type: 'try',
        text: 'Pick a product you use and model three workflows as tables. Add primary keys, foreign keys, checks, and at least one historical snapshot column.',
      },
      {
        type: 'keypoints',
        items: [
          'A schema should represent stable workflows and business rules.',
          'Constraints protect data when application code changes or fails.',
          'Historical facts such as order prices should often be copied intentionally.',
          'Simple, explicit states are easier to operate than hidden app-only rules.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-multi-tenant',
    title: 'Multi-tenant Data Patterns',
    description:
      'Compare shared-table, schema-per-tenant, and database-per-tenant PostgreSQL designs for SaaS apps, with RLS and indexing patterns.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 57,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'A multi-tenant app serves many customers from one product. The database question is: how separate should each tenant data be? PostgreSQL can support shared tables, separate schemas, or separate databases. Each choice affects security, cost, migrations, analytics, and operations.',
      },
      {
        type: 'table',
        headers: ['Pattern', 'Best fit', 'Tradeoff'],
        rows: [
          ['Shared tables', 'Most SaaS apps with many small tenants', 'Requires tenant_id on tenant-owned tables.'],
          ['Schema per tenant', 'Moderate tenant count with stronger isolation needs', 'Migrations must run across schemas.'],
          ['Database per tenant', 'Enterprise isolation or custom compliance', 'Operational cost and automation complexity increase.'],
        ],
      },
      { type: 'h2', text: 'Shared-table design' },
      {
        type: 'code',
        title: 'Tenant-owned tables',
        language: 'sql',
        code: `CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

CREATE INDEX projects_tenant_created_idx
ON projects (tenant_id, created_at DESC);`,
      },
      {
        type: 'p',
        text: 'In shared tables, tenant_id should appear in nearly every query and in most indexes. A unique project name should usually be unique per tenant, not globally.',
      },
      { type: 'h2', text: 'Add row-level security' },
      {
        type: 'code',
        title: 'Tenant isolation policy',
        language: 'sql',
        code: `ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY projects_tenant_isolation ON projects
USING (tenant_id = current_setting('app.tenant_id')::uuid)
WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);`,
      },
      {
        type: 'code',
        title: 'Set tenant context per request',
        language: 'javascript',
        code: `export async function withTenant(client, tenantId, work) {
  await client.query('BEGIN');

  try {
    await client.query("SELECT set_config('app.tenant_id', $1, true)", [tenantId]);
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}`,
      },
      {
        type: 'warning',
        text: 'Tenant context must be set inside the same transaction as the queries that depend on it. Connection pools reuse connections, so never rely on session state leaking safely between requests.',
      },
      { type: 'h2', text: 'Schema per tenant' },
      {
        type: 'code',
        title: 'Create a tenant schema',
        language: 'sql',
        code: `CREATE SCHEMA tenant_acme;

CREATE TABLE tenant_acme.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);`,
      },
      {
        type: 'p',
        text: 'Schema-per-tenant can make exports and some permission models easier. The cost is migration automation. Every schema must receive the same schema changes reliably, and cross-tenant analytics becomes harder.',
      },
      { type: 'h2', text: 'Choose with a decision checklist' },
      {
        type: 'ul',
        items: [
          'How many tenants do you expect in two years?',
          'Do tenants need custom schema changes?',
          'Do enterprise contracts require hard isolation?',
          'Will support staff need cross-tenant search?',
          'How often will you run migrations?',
          'Do analytics queries need data across all tenants?',
        ],
      },
      {
        type: 'try',
        text: 'Model a simple project management SaaS with tenants, users, memberships, projects, and tasks. Add tenant_id to the right tables and write one query that lists tasks for a tenant.',
      },
      {
        type: 'keypoints',
        items: [
          'Shared tables are the common default for SaaS apps.',
          'tenant_id must be part of constraints, indexes, and query filters.',
          'RLS can enforce tenant isolation inside PostgreSQL.',
          'Stronger isolation patterns bring more operational complexity.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-observability',
    title: 'Monitoring Slow Queries',
    description:
      'Observe PostgreSQL with slow query logs, pg_stat_statements, EXPLAIN, lock checks, and app-level request correlation.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 58,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Observability means you can answer what the database is doing and why. For PostgreSQL, the first useful signals are slow queries, query frequency, lock waits, connection count, replication lag, disk growth, and error rates.',
      },
      { type: 'h2', text: 'Enable slow query logging' },
      {
        type: 'code',
        title: 'PostgreSQL settings to discuss with ops',
        language: 'text',
        code: `log_min_duration_statement = 500ms
log_lock_waits = on
deadlock_timeout = 1s
log_connections = on
log_disconnections = on`,
      },
      {
        type: 'note',
        text: 'Managed hosts expose these settings differently. Some use a dashboard, some use parameter groups, and some allow ALTER SYSTEM. Follow your provider process.',
      },
      { type: 'h2', text: 'Use pg_stat_statements' },
      {
        type: 'p',
        text: 'pg_stat_statements groups similar queries and records timing, calls, rows, and buffer usage. It helps you find queries that are individually slow and queries that are fast but called too often.',
      },
      {
        type: 'code',
        title: 'Find costly normalized queries',
        language: 'sql',
        code: `CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

SELECT
  calls,
  round(total_exec_time::numeric, 2) AS total_ms,
  round(mean_exec_time::numeric, 2) AS mean_ms,
  rows,
  query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;`,
      },
      { type: 'h2', text: 'Check active work and locks' },
      {
        type: 'code',
        title: 'Current active queries',
        language: 'sql',
        code: `SELECT
  pid,
  usename,
  state,
  wait_event_type,
  wait_event,
  now() - query_start AS running_for,
  query
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY query_start;`,
      },
      {
        type: 'code',
        title: 'Blocked queries',
        language: 'sql',
        code: `SELECT
  blocked.pid AS blocked_pid,
  blocked.query AS blocked_query,
  blocking.pid AS blocking_pid,
  blocking.query AS blocking_query
FROM pg_stat_activity blocked
JOIN pg_locks blocked_locks
  ON blocked_locks.pid = blocked.pid
JOIN pg_locks blocking_locks
  ON blocking_locks.locktype = blocked_locks.locktype
 AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
 AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
 AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
 AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
 AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
 AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
 AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
 AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
 AND blocking_locks.pid <> blocked_locks.pid
JOIN pg_stat_activity blocking
  ON blocking.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted
  AND blocking_locks.granted;`,
      },
      { type: 'h2', text: 'Add request context from the app' },
      {
        type: 'code',
        title: 'Set application_name in a Node pool',
        language: 'javascript',
        code: `import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  application_name: 'intellex-api',
});`,
      },
      {
        type: 'p',
        text: 'When application_name appears in pg_stat_activity and logs, database events are easier to connect to services and deployments. Some teams also include route names in comments or tracing spans, but never include secrets or personal data in SQL comments.',
      },
      {
        type: 'table',
        headers: ['Signal', 'Question it answers', 'Possible action'],
        rows: [
          ['Slow query log', 'Which exact SQL was slow?', 'Run EXPLAIN ANALYZE and tune.'],
          ['pg_stat_statements', 'Which queries cost the most overall?', 'Batch, cache, index, or rewrite.'],
          ['pg_stat_activity', 'What is running right now?', 'Investigate long transactions and waits.'],
          ['Locks', 'Who is blocking whom?', 'Fix transaction scope or migration strategy.'],
          ['Connection count', 'Are pools too large?', 'Reduce pool sizes or add a pooler.'],
        ],
      },
      {
        type: 'try',
        text: 'Enable pg_stat_statements locally, run a slow query several times, and then find it by total_exec_time. Practice reading both total cost and average cost.',
      },
      {
        type: 'keypoints',
        items: [
          'Slow query logs show individual painful queries.',
          'pg_stat_statements shows aggregate database workload.',
          'pg_stat_activity helps during incidents.',
          'App context makes database signals easier to connect to real user requests.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-project-schema',
    title: 'Mini Project: Design an Ecommerce Schema',
    description:
      'Build a production-minded ecommerce PostgreSQL schema with customers, products, orders, payments, inventory, constraints, and useful indexes.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 59,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'In this mini project, you will design the database core for a small ecommerce system. The goal is not to build every feature. The goal is to practice turning real workflows into tables, constraints, indexes, and queries.',
      },
      { type: 'h2', text: 'Project goal' },
      {
        type: 'ul',
        items: [
          'Customers can place orders.',
          'Products have current prices and inventory.',
          'Orders preserve the product name and price at checkout time.',
          'Payments are tracked separately from orders.',
          'Inventory changes are auditable.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create extensions and core tables' },
      {
        type: 'code',
        title: 'Extensions and customers',
        language: 'sql',
        code: `CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext NOT NULL UNIQUE,
  full_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);`,
      },
      { type: 'h2', text: 'Step 2: Model orders and order items' },
      {
        type: 'code',
        title: 'Orders preserve checkout facts',
        language: 'sql',
        code: `CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'placed', 'paid', 'shipped', 'cancelled', 'refunded')),
  total_cents integer NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
  placed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  product_sku text NOT NULL,
  product_name text NOT NULL,
  unit_price_cents integer NOT NULL CHECK (unit_price_cents >= 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  UNIQUE (order_id, product_id)
);`,
      },
      {
        type: 'note',
        text: 'Order items copy sku, name, and price. This protects old orders when a product is renamed or repriced later.',
      },
      { type: 'h2', text: 'Step 3: Add payments and inventory movement' },
      {
        type: 'code',
        title: 'Payment and stock tables',
        language: 'sql',
        code: `CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  provider text NOT NULL,
  provider_reference text NOT NULL,
  status text NOT NULL
    CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_reference)
);

CREATE TABLE inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id),
  reason text NOT NULL CHECK (reason IN ('received', 'reserved', 'released', 'sold', 'adjusted')),
  quantity_delta integer NOT NULL CHECK (quantity_delta <> 0),
  order_id uuid REFERENCES orders(id),
  created_at timestamptz NOT NULL DEFAULT now()
);`,
      },
      { type: 'h2', text: 'Step 4: Add indexes for real screens' },
      {
        type: 'code',
        title: 'Indexes for customer history and product lookup',
        language: 'sql',
        code: `CREATE INDEX orders_customer_created_idx
ON orders (customer_id, created_at DESC);

CREATE INDEX order_items_order_idx
ON order_items (order_id);

CREATE INDEX payments_order_idx
ON payments (order_id);

CREATE INDEX inventory_product_created_idx
ON inventory_movements (product_id, created_at DESC);

CREATE INDEX products_active_name_idx
ON products (name)
WHERE active = true;`,
      },
      { type: 'h2', text: 'Step 5: Insert sample data' },
      {
        type: 'code',
        title: 'Seed customers and products',
        language: 'sql',
        code: `INSERT INTO customers (email, full_name)
VALUES ('amina@example.com', 'Amina Khan');

INSERT INTO products (sku, name, description, price_cents)
VALUES
  ('KEY-001', 'Mechanical Keyboard', 'Compact keyboard', 12900),
  ('MOU-001', 'Wireless Mouse', 'Ergonomic mouse', 4900);`,
      },
      {
        type: 'code',
        title: 'Create an order from product data',
        language: 'sql',
        code: `WITH new_order AS (
  INSERT INTO orders (customer_id, status, placed_at)
  SELECT id, 'placed', now()
  FROM customers
  WHERE email = 'amina@example.com'
  RETURNING id
),
inserted_items AS (
  INSERT INTO order_items (
    order_id,
    product_id,
    product_sku,
    product_name,
    unit_price_cents,
    quantity
  )
  SELECT
    new_order.id,
    products.id,
    products.sku,
    products.name,
    products.price_cents,
    2
  FROM new_order
  JOIN products ON products.sku = 'KEY-001'
  RETURNING order_id, unit_price_cents, quantity
)
UPDATE orders
SET total_cents = (
  SELECT sum(unit_price_cents * quantity)
  FROM inserted_items
)
WHERE id = (SELECT order_id FROM inserted_items);`,
      },
      { type: 'h2', text: 'Step 6: Query customer order history' },
      {
        type: 'code',
        title: 'Order summary query',
        language: 'sql',
        code: `SELECT
  orders.id,
  orders.status,
  orders.total_cents,
  orders.created_at,
  count(order_items.id)::int AS item_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
JOIN order_items ON order_items.order_id = orders.id
WHERE customers.email = 'amina@example.com'
GROUP BY orders.id
ORDER BY orders.created_at DESC;`,
      },
      {
        type: 'try',
        text: 'Extend the schema with shipping_addresses. Decide whether addresses should be linked to customers, copied onto orders, or both. Explain what should happen when a customer edits an address after placing an order.',
      },
      {
        type: 'keypoints',
        items: [
          'Real ecommerce schemas preserve historical checkout facts.',
          'Payments, orders, and inventory are related but separate concerns.',
          'Constraints protect money, quantity, status, and uniqueness rules.',
          'Indexes should match real screens such as order history and product lookup.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-project-node-api',
    title: 'Mini Project: Express + PostgreSQL API',
    description:
      'Build a small Express API backed by PostgreSQL with migrations, a connection pool, parameterized queries, transactions, and error handling.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 60,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project builds a small tasks API with Express and PostgreSQL. PostgreSQL remains the star: Express receives HTTP requests, but the database owns tables, constraints, transactions, and query correctness.',
      },
      { type: 'h2', text: 'Step 1: Create the project' },
      {
        type: 'code',
        title: 'Install dependencies',
        language: 'bash',
        code: `mkdir tasks-api
cd tasks-api
npm init -y
npm install express pg dotenv
npm install --save-dev nodemon`,
      },
      {
        type: 'code',
        title: 'package.json scripts',
        language: 'json',
        code: `{
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}`,
      },
      { type: 'h2', text: 'Step 2: Create the database table' },
      {
        type: 'code',
        title: 'db/001-create-tasks.sql',
        language: 'sql',
        code: `CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(title) <= 160),
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX tasks_completed_created_idx
ON tasks (completed, created_at DESC);`,
      },
      {
        type: 'code',
        title: 'Run the migration',
        language: 'bash',
        code: `createdb tasks_api_dev
psql tasks_api_dev -f db/001-create-tasks.sql`,
      },
      { type: 'h2', text: 'Step 3: Configure the pool' },
      {
        type: 'code',
        title: '.env',
        language: 'text',
        code: `DATABASE_URL=postgresql://localhost:5432/tasks_api_dev
PORT=3000`,
      },
      {
        type: 'code',
        title: 'src/db.js',
        language: 'javascript',
        code: `import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});`,
      },
      { type: 'h2', text: 'Step 4: Build read and create routes' },
      {
        type: 'code',
        title: 'src/server.js',
        language: 'javascript',
        code: `import 'dotenv/config';
import express from 'express';
import { pool } from './db.js';

const app = express();
app.use(express.json());

app.get('/health', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT now() AS checked_at');
    res.json({ ok: true, checkedAt: result.rows[0].checked_at });
  } catch (error) {
    next(error);
  }
});

app.get('/tasks', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, title, completed, created_at FROM tasks ORDER BY created_at DESC LIMIT 100',
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.post('/tasks', async (req, res, next) => {
  try {
    const { title } = req.body;

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, completed, created_at',
      [title.trim()],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});`,
      },
      { type: 'h2', text: 'Step 5: Use a transaction for multi-step work' },
      {
        type: 'p',
        text: 'A transaction makes several SQL statements succeed or fail together. In this example, completing a task also writes an audit event. If either statement fails, both are rolled back.',
      },
      {
        type: 'code',
        title: 'Add audit table',
        language: 'sql',
        code: `CREATE TABLE task_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('created', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);`,
      },
      {
        type: 'code',
        title: 'Transaction route',
        language: 'javascript',
        code: `app.post('/tasks/:id/complete', async (req, res, next) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const taskResult = await client.query(
      'UPDATE tasks SET completed = true, updated_at = now() WHERE id = $1 RETURNING id, title, completed',
      [req.params.id],
    );

    if (taskResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Task not found' });
    }

    await client.query(
      'INSERT INTO task_events (task_id, event_type) VALUES ($1, $2)',
      [req.params.id, 'completed'],
    );

    await client.query('COMMIT');
    res.json(taskResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});`,
      },
      { type: 'h2', text: 'Step 6: Add error handling and start the server' },
      {
        type: 'code',
        title: 'Finish src/server.js',
        language: 'javascript',
        code: `app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log('Tasks API listening on port ' + port);
});`,
      },
      {
        type: 'code',
        title: 'Try the API',
        language: 'bash',
        code: `npm run dev

curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn PostgreSQL transactions"}'

curl http://localhost:3000/tasks`,
      },
      {
        type: 'warning',
        text: 'Always release clients checked out from a pool. A missing release can exhaust the pool and make the API appear frozen under load.',
      },
      {
        type: 'keypoints',
        items: [
          'Express routes should use parameterized queries.',
          'PostgreSQL constraints still protect data even when API validation misses something.',
          'Use transactions for multi-step writes.',
          'Connection pools must be sized and released carefully.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-project-python-web',
    title: 'Mini Project: Flask or Django + PostgreSQL App',
    description:
      'Build a small Flask PostgreSQL app and learn the matching Django patterns for models, migrations, database settings, and safe queries.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 61,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'Python web apps pair naturally with PostgreSQL. This lesson uses Flask as the primary project because the database access is visible, then shows the Django equivalents so you can recognize the same ideas in a batteries-included framework.',
      },
      { type: 'h2', text: 'Flask project: bookmarks app' },
      {
        type: 'p',
        text: 'The app stores bookmarks with a title, URL, and optional tag. PostgreSQL handles identity, timestamps, uniqueness, and constraints. Flask handles request and response flow.',
      },
      { type: 'h2', text: 'Step 1: Install dependencies' },
      {
        type: 'code',
        title: 'Create a Flask environment',
        language: 'bash',
        code: `mkdir flask-bookmarks
cd flask-bookmarks
python -m venv .venv
source .venv/bin/activate
pip install Flask "psycopg[binary,pool]" python-dotenv`,
      },
      { type: 'h2', text: 'Step 2: Create the PostgreSQL table' },
      {
        type: 'code',
        title: 'schema.sql',
        language: 'sql',
        code: `CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(title) <= 160),
  url text NOT NULL UNIQUE,
  tag text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX bookmarks_tag_created_idx
ON bookmarks (tag, created_at DESC);`,
      },
      {
        type: 'code',
        title: 'Initialize the database',
        language: 'bash',
        code: `createdb flask_bookmarks_dev
psql flask_bookmarks_dev -f schema.sql`,
      },
      { type: 'h2', text: 'Step 3: Connect Flask to PostgreSQL' },
      {
        type: 'code',
        title: '.env',
        language: 'text',
        code: `DATABASE_URL=postgresql://localhost:5432/flask_bookmarks_dev`,
      },
      {
        type: 'code',
        title: 'app.py',
        language: 'python',
        code: `import os
from flask import Flask, jsonify, request
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

app = Flask(__name__)

pool = ConnectionPool(
    conninfo=os.environ["DATABASE_URL"],
    min_size=1,
    max_size=5,
)


@app.get("/health")
def health():
    with pool.connection() as conn:
        row = conn.execute("SELECT now() AS checked_at").fetchone()
    return jsonify({"ok": True, "checked_at": row[0].isoformat()})`,
      },
      {
        type: 'warning',
        text: 'Keep the pool size small for simple apps. A web process with max_size 5 can use five PostgreSQL connections, and multiple web processes multiply that number.',
      },
      { type: 'h2', text: 'Step 4: Add list and create routes' },
      {
        type: 'code',
        title: 'Flask routes with parameterized SQL',
        language: 'python',
        code: `@app.get("/bookmarks")
def list_bookmarks():
    tag = request.args.get("tag")

    with pool.connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            if tag:
                cur.execute(
                    """
                    SELECT id::text AS id, title, url, tag, created_at::text AS created_at
                    FROM bookmarks
                    WHERE tag = %s
                    ORDER BY created_at DESC
                    LIMIT 100
                    """,
                    (tag,),
                )
            else:
                cur.execute(
                    """
                    SELECT id::text AS id, title, url, tag, created_at::text AS created_at
                    FROM bookmarks
                    ORDER BY created_at DESC
                    LIMIT 100
                    """
                )

            return jsonify(cur.fetchall())


@app.post("/bookmarks")
def create_bookmark():
    data = request.get_json(force=True)
    title = data.get("title", "").strip()
    url = data.get("url", "").strip()
    tag = data.get("tag")

    if not title or not url:
        return jsonify({"error": "title and url are required"}), 400

    with pool.connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                INSERT INTO bookmarks (title, url, tag)
                VALUES (%s, %s, %s)
                RETURNING id::text AS id, title, url, tag, created_at::text AS created_at
                """,
                (title, url, tag),
            )
            return jsonify(cur.fetchone()), 201`,
      },
      {
        type: 'note',
        text: 'psycopg uses %s placeholders even when the value is a string or UUID. Pass parameters separately as a tuple, not by formatting SQL text.',
      },
      { type: 'h2', text: 'Step 5: Run and test Flask' },
      {
        type: 'code',
        title: 'Start Flask and create a bookmark',
        language: 'bash',
        code: `flask --app app run --debug

curl -X POST http://127.0.0.1:5000/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"title":"PostgreSQL Docs","url":"https://www.postgresql.org/docs/","tag":"database"}'

curl "http://127.0.0.1:5000/bookmarks?tag=database"`,
      },
      { type: 'h2', text: 'Django notes: same database ideas, more framework help' },
      {
        type: 'p',
        text: 'Django usually accesses PostgreSQL through models and migrations instead of hand-written SQL for every route. The database still enforces constraints and indexes, while Django generates much of the SQL.',
      },
      {
        type: 'code',
        title: 'Django DATABASES setting',
        language: 'python',
        code: `import os

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["POSTGRES_DB"],
        "USER": os.environ["POSTGRES_USER"],
        "PASSWORD": os.environ["POSTGRES_PASSWORD"],
        "HOST": os.environ.get("POSTGRES_HOST", "localhost"),
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
    }
}`,
      },
      {
        type: 'code',
        title: 'Django model with constraints and indexes',
        language: 'python',
        code: `from django.db import models


class Bookmark(models.Model):
    title = models.CharField(max_length=160)
    url = models.URLField(unique=True)
    tag = models.CharField(max_length=80, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["tag", "-created_at"]),
        ]`,
      },
      {
        type: 'code',
        title: 'Django migration and shell test',
        language: 'bash',
        code: `python manage.py makemigrations
python manage.py migrate
python manage.py shell`,
      },
      {
        type: 'try',
        text: 'Add a notes column to the Flask schema and the Django model. Write the migration steps for both. Notice that Django automates more, but PostgreSQL still stores the final truth.',
      },
      {
        type: 'keypoints',
        items: [
          'Flask makes SQL and pooling choices explicit.',
          'Django models map Python classes to PostgreSQL tables and migrations.',
          'Both frameworks need safe parameter handling and production connection settings.',
          'PostgreSQL constraints and indexes remain important even with an ORM.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-project-nextjs',
    title: 'Mini Project: Next.js App Router + PostgreSQL',
    description:
      'Build a Next.js App Router page that reads from PostgreSQL on the server, uses route handlers for writes, and keeps database code server-only.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 62,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'In the App Router, PostgreSQL access belongs on the server: Server Components, Server Actions, Route Handlers, or server-only modules. The browser should never receive database credentials or a PostgreSQL client.',
      },
      { type: 'h2', text: 'Project goal' },
      {
        type: 'p',
        text: 'Build a small reading list. The page loads books from PostgreSQL in a Server Component. A Route Handler creates new books. A tiny Client Component submits the form.',
      },
      { type: 'h2', text: 'Step 1: Install pg and create a table' },
      {
        type: 'code',
        title: 'Install dependency',
        language: 'bash',
        code: `npm install pg
npm install --save-dev @types/pg`,
      },
      {
        type: 'code',
        title: 'Database schema',
        language: 'sql',
        code: `CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE reading_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(title) <= 200),
  author text NOT NULL CHECK (length(author) <= 120),
  finished boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX reading_list_created_idx
ON reading_list (created_at DESC);`,
      },
      { type: 'h2', text: 'Step 2: Create a server-only database helper' },
      {
        type: 'code',
        title: 'lib/db.ts',
        language: 'typescript',
        code: `import 'server-only';
import { Pool } from 'pg';

const globalForPg = globalThis as unknown as {
  pgPool?: Pool;
};

export const pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool;
}`,
      },
      {
        type: 'note',
        text: 'The global cache prevents creating many pools during local hot reload. In production, size the pool for your deployment model and hosting provider.',
      },
      { type: 'h2', text: 'Step 3: Read from PostgreSQL in a Server Component' },
      {
        type: 'code',
        title: 'app/reading-list/page.tsx',
        language: 'tsx',
        code: `import { pool } from '@/lib/db';
import { NewBookForm } from './new-book-form';

type Book = {
  id: string;
  title: string;
  author: string;
  finished: boolean;
  created_at: Date;
};

async function getBooks(): Promise<Book[]> {
  const result = await pool.query<Book>(
    'SELECT id, title, author, finished, created_at FROM reading_list ORDER BY created_at DESC LIMIT 50',
  );

  return result.rows;
}

export default async function ReadingListPage() {
  const books = await getBooks();

  return (
    <main>
      <h1>Reading list</h1>
      <NewBookForm />

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author}
            {book.finished ? ' (finished)' : ''}
          </li>
        ))}
      </ul>
    </main>
  );
}`,
      },
      {
        type: 'p',
        text: 'This page runs on the server, so it can import the database helper directly. The rendered HTML is sent to the browser; the PostgreSQL connection is not.',
      },
      { type: 'h2', text: 'Step 4: Create a Route Handler for writes' },
      {
        type: 'code',
        title: 'app/api/books/route.ts',
        language: 'typescript',
        code: `import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const author = typeof body.author === 'string' ? body.author.trim() : '';

  if (!title || !author) {
    return NextResponse.json(
      { error: 'title and author are required' },
      { status: 400 },
    );
  }

  const result = await pool.query(
    'INSERT INTO reading_list (title, author) VALUES ($1, $2) RETURNING id, title, author, finished, created_at',
    [title, author],
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}`,
      },
      { type: 'h2', text: 'Step 5: Submit from a Client Component' },
      {
        type: 'code',
        title: 'app/reading-list/new-book-form.tsx',
        language: 'tsx',
        code: `'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export function NewBookForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    const response = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author }),
    });

    setIsSaving(false);

    if (response.ok) {
      setTitle('');
      setAuthor('');
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" />
      <input value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Author" />
      <button disabled={isSaving}>{isSaving ? 'Saving...' : 'Add book'}</button>
    </form>
  );
}`,
      },
      { type: 'h2', text: 'Step 6: Consider Server Actions' },
      {
        type: 'p',
        text: 'Server Actions can also write to PostgreSQL from the server. Route Handlers are easy to call from client fetch, mobile clients, and tests. Server Actions are convenient when the write belongs closely to one form. In both patterns, the database query stays server-side.',
      },
      {
        type: 'warning',
        text: 'Do not import pg from a Client Component. If a file has use client, it must not import database helpers, secrets, or server-only modules.',
      },
      {
        type: 'try',
        text: 'Add a PATCH route that toggles finished. Use a parameterized UPDATE with RETURNING, then call router.refresh after the client action completes.',
      },
      {
        type: 'keypoints',
        items: [
          'App Router Server Components can read PostgreSQL directly on the server.',
          'Route Handlers and Server Actions are good places for writes.',
          'Use server-only modules to protect database credentials.',
          'Client Components can submit forms without receiving direct database access.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-common-mistakes',
    title: 'Common PostgreSQL Mistakes (and Fixes)',
    description:
      'Recognize and fix common PostgreSQL mistakes involving NULL, indexes, transactions, time zones, migrations, and application queries.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 63,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Advanced developers still make database mistakes. The difference is that they learn to recognize patterns early: missing constraints, weak indexes, open transactions, wrong time types, and app code that quietly makes too many queries.',
      },
      { type: 'h2', text: 'Mistake 1: Treating NULL like an empty string' },
      {
        type: 'code',
        title: 'Use IS NULL, not = NULL',
        language: 'sql',
        code: `-- Wrong: this never matches.
SELECT * FROM customers WHERE deleted_at = NULL;

-- Correct.
SELECT * FROM customers WHERE deleted_at IS NULL;`,
      },
      {
        type: 'p',
        text: 'NULL means unknown or missing. It is not equal to anything, even another NULL. Design columns as NOT NULL when a value is truly required.',
      },
      { type: 'h2', text: 'Mistake 2: Indexing every column' },
      {
        type: 'p',
        text: 'Indexes cost storage and write performance. Index columns used in WHERE, JOIN, ORDER BY, and uniqueness rules. Avoid adding indexes because a column feels important.',
      },
      {
        type: 'code',
        title: 'Better than separate random indexes',
        language: 'sql',
        code: `-- Query pattern:
-- WHERE customer_id = $1 AND status = $2 ORDER BY created_at DESC

CREATE INDEX orders_customer_status_created_idx
ON orders (customer_id, status, created_at DESC);`,
      },
      { type: 'h2', text: 'Mistake 3: Forgetting transactions for multi-step writes' },
      {
        type: 'code',
        title: 'Keep related writes together',
        language: 'sql',
        code: `BEGIN;

INSERT INTO orders (customer_id, status)
VALUES ($1, 'placed')
RETURNING id;

INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
VALUES ($2, $3, $4, $5);

COMMIT;`,
      },
      {
        type: 'warning',
        text: 'In app code, rollback in catch or error paths. A failed transaction left open can hold locks and block other work.',
      },
      { type: 'h2', text: 'Mistake 4: Using timestamp without time zone for events' },
      {
        type: 'p',
        text: 'For created_at, updated_at, payment timestamps, logs, and user activity, use timestamptz. PostgreSQL stores an absolute moment and displays it according to timezone settings.',
      },
      {
        type: 'code',
        title: 'Prefer timestamptz for event time',
        language: 'sql',
        code: `created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now()`,
      },
      { type: 'h2', text: 'Mistake 5: Building SQL strings with user input' },
      {
        type: 'code',
        title: 'Fix with parameters',
        language: 'javascript',
        code: `// Unsafe idea:
// 'SELECT * FROM users WHERE email = ' + email

const result = await pool.query(
  'SELECT id, email FROM users WHERE email = $1',
  [email],
);`,
      },
      { type: 'h2', text: 'Mistake 6: Ignoring N+1 queries' },
      {
        type: 'p',
        text: 'N+1 happens when the app fetches a list, then makes one query per row. The page works in development but gets slower with real data. Use joins, batching, or a second query with WHERE id = ANY($1).',
      },
      {
        type: 'code',
        title: 'Batch related data',
        language: 'sql',
        code: `SELECT
  orders.id,
  orders.created_at,
  json_agg(order_items.* ORDER BY order_items.id) AS items
FROM orders
JOIN order_items ON order_items.order_id = orders.id
WHERE orders.customer_id = $1
GROUP BY orders.id
ORDER BY orders.created_at DESC
LIMIT 20;`,
      },
      {
        type: 'table',
        headers: ['Mistake', 'Symptom', 'Fix'],
        rows: [
          ['No constraints', 'Bad data appears months later', 'Add NOT NULL, CHECK, UNIQUE, and foreign keys.'],
          ['Huge open transaction', 'Vacuum and locks get worse', 'Keep transactions short.'],
          ['No backups tested', 'Restore is uncertain during incident', 'Run restore drills.'],
          ['Too many connections', 'Database rejects clients', 'Use small pools or a pooler.'],
          ['Missing WHERE tenant_id', 'Cross-tenant data leak risk', 'Use RLS and tenant-scoped queries.'],
        ],
      },
      {
        type: 'try',
        text: 'Review one old project and find two mistakes from this lesson. Write the SQL or app change that would prevent them in the future.',
      },
      {
        type: 'keypoints',
        items: [
          'Most PostgreSQL mistakes are preventable with constraints, parameters, transactions, and measurement.',
          'Indexes should match query patterns, not column importance.',
          'Use timestamptz for moments in time.',
          'Short transactions and tested backups matter in production.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-ecosystem',
    title: 'Ecosystem: ORMs, Hosting, Tools',
    description:
      'Explore the PostgreSQL ecosystem: ORMs, migration tools, hosting providers, poolers, admin tools, and when to use each one.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 64,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'PostgreSQL is the database, but real teams use an ecosystem around it. ORMs shape queries, migration tools evolve schema, hosting providers operate servers, poolers manage connections, and admin tools help inspect data.',
      },
      { type: 'h2', text: 'ORMs and query builders' },
      {
        type: 'table',
        headers: ['Tool', 'Language or stack', 'Good for'],
        rows: [
          ['Prisma', 'Node and TypeScript', 'Product teams that want generated types and migrations.'],
          ['Drizzle', 'Node and TypeScript', 'SQL-like TypeScript schemas and lightweight query building.'],
          ['Kysely', 'Node and TypeScript', 'Typed query builder with strong SQL control.'],
          ['SQLAlchemy', 'Python', 'Powerful ORM and Core query layer.'],
          ['Django ORM', 'Python and Django', 'Fast app development with migrations and admin.'],
          ['Active Record', 'Ruby on Rails', 'Convention-driven Rails applications.'],
        ],
      },
      {
        type: 'p',
        text: 'An ORM is not a replacement for PostgreSQL knowledge. You still need to understand indexes, transactions, joins, constraints, and query plans when production traffic arrives.',
      },
      { type: 'h2', text: 'Migration tools' },
      {
        type: 'ul',
        items: [
          'Prisma Migrate, Drizzle Kit, Django migrations, Alembic, Flyway, Liquibase, Knex migrations, and Rails migrations are common choices.',
          'Choose a tool your team will run consistently in local development, CI, staging, and production.',
          'Review generated SQL for dangerous operations on large tables.',
          'Keep migrations small enough to understand and recover from.',
        ],
      },
      {
        type: 'code',
        title: 'Migration review habit',
        language: 'text',
        code: `Before production:
1. What SQL will run?
2. What locks can it take?
3. How long can it run on real data?
4. Can it be rolled forward if interrupted?
5. Was a backup or restore plan checked?`,
      },
      { type: 'h2', text: 'Hosting and operations' },
      {
        type: 'table',
        headers: ['Category', 'Examples', 'What to compare'],
        rows: [
          ['Managed PostgreSQL', 'RDS, Cloud SQL, Azure Database, Crunchy Bridge', 'Backups, replicas, extensions, maintenance windows.'],
          ['Developer-friendly hosting', 'Neon, Supabase, Railway, Render, Fly Postgres', 'Branching, pooling, pricing, region support.'],
          ['Self-managed', 'VMs, Kubernetes operators', 'Team experience, patching, monitoring, backups.'],
        ],
      },
      { type: 'h2', text: 'Poolers and admin tools' },
      {
        type: 'p',
        text: 'PgBouncer is commonly used to reduce connection pressure. Admin tools such as psql, DBeaver, TablePlus, DataGrip, pgAdmin, and Beekeeper Studio help inspect data. Observability tools can include provider dashboards, OpenTelemetry, pganalyze, pgBadger, and custom SQL checks.',
      },
      {
        type: 'warning',
        text: 'GUI tools are powerful. Use read-only credentials for inspection when possible, especially in production.',
      },
      {
        type: 'try',
        text: 'Choose one ORM and one migration tool for a sample app. Write down how you would inspect the generated SQL before applying it to production.',
      },
      {
        type: 'keypoints',
        items: [
          'The PostgreSQL ecosystem helps teams move faster, but database fundamentals still matter.',
          'Migration tools should make schema changes repeatable and reviewable.',
          'Hosting choices affect backups, replicas, extensions, pooling, and cost.',
          'Use read-only access for production inspection whenever possible.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-next-steps',
    title: 'What to Learn After PostgreSQL',
    description:
      'Plan your next steps after advanced PostgreSQL: deeper SQL, query planning, distributed systems, app architecture, analytics, and operations.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 65,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'PostgreSQL can take you a long way. After this tutorial, your next step depends on the work you want to do: backend engineering, data engineering, platform operations, analytics, or full-stack product development.',
      },
      { type: 'h2', text: 'Path 1: Become stronger at SQL' },
      {
        type: 'ul',
        items: [
          'Practice window functions, grouping sets, recursive CTEs, and lateral joins.',
          'Learn how NULL, isolation levels, and locks behave in edge cases.',
          'Read EXPLAIN plans until scans, joins, sorts, and estimates feel familiar.',
          'Use realistic datasets, not only tiny examples.',
        ],
      },
      { type: 'h2', text: 'Path 2: Become production-ready' },
      {
        type: 'ul',
        items: [
          'Study backup and restore workflows deeply.',
          'Learn PgBouncer, connection limits, and app pool sizing.',
          'Practice zero-downtime migration patterns.',
          'Monitor slow queries, locks, replica lag, disk growth, and vacuum behavior.',
        ],
      },
      { type: 'h2', text: 'Path 3: Build better apps with PostgreSQL' },
      {
        type: 'table',
        headers: ['Stack', 'Focus next', 'Database skill to practice'],
        rows: [
          ['Express', 'API boundaries and validation', 'Transactions and parameterized queries.'],
          ['Flask', 'Service structure and pooling', 'Explicit SQL and connection lifecycle.'],
          ['Django', 'Models and migrations', 'Indexes, constraints, and query inspection.'],
          ['Next.js', 'Server Components and server actions', 'Server-only data access and pool sizing.'],
        ],
      },
      { type: 'h2', text: 'Path 4: Explore specialized PostgreSQL features' },
      {
        type: 'ul',
        items: [
          'Full-text search for search pages and content apps.',
          'PostGIS for maps and geospatial products.',
          'Logical replication and change data capture for event-driven systems.',
          'Materialized views for expensive reporting queries.',
          'JSONB patterns for flexible metadata without giving up relational design.',
        ],
      },
      {
        type: 'code',
        title: 'A final practice query',
        language: 'sql',
        code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT
  customers.email,
  count(orders.id) AS order_count,
  sum(orders.total_cents) AS lifetime_value_cents
FROM customers
LEFT JOIN orders ON orders.customer_id = customers.id
GROUP BY customers.id
ORDER BY lifetime_value_cents DESC NULLS LAST
LIMIT 20;`,
      },
      {
        type: 'p',
        text: 'This query combines joins, grouping, sorting, NULL behavior, and performance analysis. It is a good reminder that advanced PostgreSQL is not one trick. It is many fundamentals used together.',
      },
      {
        type: 'try',
        text: 'Pick one path and create a two-week practice plan. Include one schema design task, one performance task, one backup or migration task, and one app integration task.',
      },
      {
        type: 'keypoints',
        items: [
          'PostgreSQL mastery grows through schema design, SQL practice, operations, and app integration.',
          'The best next topic depends on the kind of engineer you want to become.',
          'Keep practicing with real data volume and real application workflows.',
          'PostgreSQL is the star, but production skill includes the app and operations around it.',
        ],
      },
    ],
  },
];
