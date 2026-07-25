import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'postgres-advanced-joins',
    title: 'Advanced JOINs & Self Joins',
    description:
      'Use stronger JOIN patterns including multiple joins, self joins, anti joins, and lateral joins to answer real reporting questions.',
    level: 'intermediate',
    section: 'Stronger SQL',
    order: 26,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Beginner joins connect two tables. Intermediate joins help you describe richer relationships: employees with managers, customers without orders, each row with its newest related row, and reports that combine several tables at once.',
      },
      {
        type: 'p',
        text: 'The most important skill is choosing the join that matches the question. INNER JOIN keeps matching rows, LEFT JOIN keeps the left side even when no match exists, and a self join lets a table relate to itself.',
      },
      { type: 'h2', text: 'Join one table to itself' },
      {
        type: 'code',
        language: 'sql',
        title: 'Employees and managers',
        code: `SELECT
  employee.name AS employee_name,
  manager.name AS manager_name
FROM employees AS employee
LEFT JOIN employees AS manager
  ON employee.manager_id = manager.id
ORDER BY employee.name;`,
      },
      {
        type: 'p',
        text: 'Aliases are required when the same table appears twice. In this query, employee and manager are two roles played by the same employees table.',
      },
      { type: 'h2', text: 'Find rows with no match' },
      {
        type: 'code',
        language: 'sql',
        title: 'Customers without orders',
        code: `SELECT c.id, c.email
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
WHERE o.id IS NULL;`,
      },
      {
        type: 'note',
        text: 'This pattern is called an anti join. PostgreSQL may internally optimize it differently, but the intent is clear: keep left-side rows where no matching right-side row exists.',
      },
      { type: 'h2', text: 'Use LATERAL for per-row lookups' },
      {
        type: 'code',
        language: 'sql',
        title: 'Newest order per customer',
        code: `SELECT
  c.email,
  latest_order.id AS order_id,
  latest_order.created_at
FROM customers AS c
LEFT JOIN LATERAL (
  SELECT o.id, o.created_at
  FROM orders AS o
  WHERE o.customer_id = c.id
  ORDER BY o.created_at DESC
  LIMIT 1
) AS latest_order ON true;`,
      },
      {
        type: 'tip',
        text: 'When a join produces too many rows, check the relationship. Joining a customer to all orders is one-to-many; joining to the latest order needs an extra rule such as ORDER BY plus LIMIT inside a lateral subquery.',
      },
      {
        type: 'try',
        text: 'Write a query that lists every product and the most recent review for that product. Use a LEFT JOIN LATERAL so products with no reviews still appear.',
      },
      {
        type: 'keypoints',
        items: [
          'Self joins use aliases so one table can represent two roles.',
          'LEFT JOIN plus WHERE right_table.id IS NULL finds missing relationships.',
          'LATERAL joins are useful for per-row subqueries such as newest related records.',
          'Start every join by naming the relationship and desired row cardinality.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-subqueries',
    title: 'Subqueries',
    description:
      'Place queries inside other queries to filter, calculate, and compare values without creating temporary tables.',
    level: 'intermediate',
    section: 'Stronger SQL',
    order: 27,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'A subquery is a SELECT used inside another SQL statement. Subqueries can return one value, one column, or a small result set that the outer query can use.',
      },
      {
        type: 'p',
        text: 'They are common in filters, calculated columns, and reports where one question depends on the result of another question.',
      },
      { type: 'h2', text: 'Compare against an aggregate' },
      {
        type: 'code',
        language: 'sql',
        title: 'Products priced above average',
        code: `SELECT id, name, price
FROM products
WHERE price > (
  SELECT AVG(price)
  FROM products
)
ORDER BY price DESC;`,
      },
      {
        type: 'p',
        text: 'The inner SELECT returns one value: the average price. The outer query uses that value in its WHERE clause.',
      },
      { type: 'h2', text: 'Use EXISTS for relationship checks' },
      {
        type: 'code',
        language: 'sql',
        title: 'Customers who have ordered',
        code: `SELECT c.id, c.email
FROM customers AS c
WHERE EXISTS (
  SELECT 1
  FROM orders AS o
  WHERE o.customer_id = c.id
);`,
      },
      {
        type: 'note',
        text: 'EXISTS checks whether the subquery returns at least one row. It often expresses relationship questions more clearly than counting rows.',
      },
      { type: 'h2', text: 'Subquery in FROM' },
      {
        type: 'code',
        language: 'sql',
        title: 'Summarize order totals first',
        code: `SELECT totals.customer_id, totals.order_count, totals.total_spent
FROM (
  SELECT
    customer_id,
    COUNT(*) AS order_count,
    SUM(total) AS total_spent
  FROM orders
  GROUP BY customer_id
) AS totals
WHERE totals.total_spent >= 500;`,
      },
      {
        type: 'tip',
        text: 'If a subquery in FROM grows large or is reused, consider rewriting it as a CTE. The goal is readability first, then performance testing with EXPLAIN.',
      },
      {
        type: 'try',
        text: 'Find products whose price is greater than the average price within their own category. Use a correlated subquery that references the outer product row.',
      },
      {
        type: 'keypoints',
        items: [
          'Scalar subqueries return one value for comparison or calculation.',
          'EXISTS is ideal for checking whether a related row exists.',
          'Subqueries in FROM create derived tables that the outer query can filter.',
          'Correlated subqueries reference columns from the outer query.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-ctes',
    title: 'CTEs (WITH queries)',
    description:
      'Use Common Table Expressions to break complex SQL into named, readable steps.',
    level: 'intermediate',
    section: 'Stronger SQL',
    order: 28,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'A Common Table Expression, or CTE, is a named query defined with WITH. It lets you describe a larger query in steps instead of nesting everything in one dense SELECT.',
      },
      {
        type: 'p',
        text: 'CTEs are especially helpful for reports, data cleanup, and transformations where each step has a meaningful name.',
      },
      { type: 'h2', text: 'Write a query in steps' },
      {
        type: 'code',
        language: 'sql',
        title: 'High-value customers',
        code: `WITH customer_totals AS (
  SELECT
    customer_id,
    COUNT(*) AS order_count,
    SUM(total) AS total_spent
  FROM orders
  GROUP BY customer_id
),
high_value_customers AS (
  SELECT customer_id, order_count, total_spent
  FROM customer_totals
  WHERE total_spent >= 1000
)
SELECT c.email, h.order_count, h.total_spent
FROM high_value_customers AS h
JOIN customers AS c
  ON c.id = h.customer_id
ORDER BY h.total_spent DESC;`,
      },
      {
        type: 'note',
        text: 'Modern PostgreSQL can inline many CTEs during planning. Still, CTEs should be written for clarity; verify performance with EXPLAIN when the query matters.',
      },
      { type: 'h2', text: 'Use CTEs with data changes' },
      {
        type: 'code',
        language: 'sql',
        title: 'Update and return affected rows',
        code: `WITH updated_orders AS (
  UPDATE orders
  SET status = 'archived'
  WHERE status = 'delivered'
    AND created_at < now() - interval '90 days'
  RETURNING id, customer_id, status
)
SELECT customer_id, COUNT(*) AS archived_count
FROM updated_orders
GROUP BY customer_id;`,
      },
      {
        type: 'p',
        text: 'RETURNING lets an INSERT, UPDATE, or DELETE produce rows. Pairing it with a CTE is useful when your application needs to record or summarize what changed.',
      },
      {
        type: 'tip',
        text: 'Name CTEs after the data they represent, such as active_users or monthly_revenue, not after implementation details like temp1.',
      },
      {
        type: 'try',
        text: 'Create a CTE that calculates monthly order totals, then select only months where revenue is greater than the average monthly revenue.',
      },
      {
        type: 'keypoints',
        items: [
          'WITH defines named query steps before the main SELECT.',
          'CTEs make complex SQL easier to read and review.',
          'Data-changing CTEs can use RETURNING for follow-up queries.',
          'Readable CTE names make reports easier to maintain.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-window-functions',
    title: 'Window Functions',
    description:
      'Calculate ranks, running totals, moving averages, and per-group values without collapsing rows.',
    level: 'intermediate',
    section: 'Stronger SQL',
    order: 29,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Window functions perform calculations across related rows while keeping each original row in the result. They are perfect for rankings, running totals, percentages, and comparisons with neighboring rows.',
      },
      {
        type: 'p',
        text: 'The OVER clause defines the window. PARTITION BY creates groups, ORDER BY defines row order, and an optional frame controls which nearby rows are visible.',
      },
      { type: 'h2', text: 'Rank rows within a group' },
      {
        type: 'code',
        language: 'sql',
        title: 'Rank products by category',
        code: `SELECT
  category_id,
  name,
  price,
  RANK() OVER (
    PARTITION BY category_id
    ORDER BY price DESC
  ) AS price_rank
FROM products
ORDER BY category_id, price_rank;`,
      },
      {
        type: 'p',
        text: 'Unlike GROUP BY, this query keeps every product row. The rank is added beside each row.',
      },
      { type: 'h2', text: 'Calculate a running total' },
      {
        type: 'code',
        language: 'sql',
        title: 'Running revenue by date',
        code: `SELECT
  created_at::date AS order_date,
  total,
  SUM(total) OVER (
    ORDER BY created_at
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_revenue
FROM orders
ORDER BY created_at;`,
      },
      {
        type: 'note',
        text: 'Window ORDER BY controls calculation order. It is separate from the final ORDER BY that controls how the result is displayed.',
      },
      { type: 'h2', text: 'Compare with the previous row' },
      {
        type: 'code',
        language: 'sql',
        title: 'Order total change',
        code: `SELECT
  id,
  created_at,
  total,
  total - LAG(total) OVER (ORDER BY created_at) AS change_from_previous
FROM orders
ORDER BY created_at;`,
      },
      {
        type: 'tip',
        text: 'Reach for window functions when you need aggregate-like calculations but still need individual rows in the output.',
      },
      {
        type: 'try',
        text: 'Write a query that shows each customer order with the customer order number: 1 for their first order, 2 for their second, and so on.',
      },
      {
        type: 'keypoints',
        items: [
          'Window functions add calculations without collapsing rows.',
          'PARTITION BY groups rows for the window calculation.',
          'ORDER BY inside OVER defines calculation order.',
          'RANK, ROW_NUMBER, SUM, AVG, LAG, and LEAD are common window functions.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-transactions',
    title: 'Transactions & ACID',
    description:
      'Group database changes safely with BEGIN, COMMIT, ROLLBACK, and ACID thinking.',
    level: 'intermediate',
    section: 'Data Integrity',
    order: 30,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A transaction is a unit of work that succeeds or fails as a whole. If a checkout inserts an order but fails to reserve inventory, the database should not keep a half-finished checkout.',
      },
      {
        type: 'p',
        text: 'ACID means atomicity, consistency, isolation, and durability. PostgreSQL uses these guarantees to protect data even when many users and applications are working at the same time.',
      },
      { type: 'h2', text: 'A transfer inside one transaction' },
      {
        type: 'code',
        language: 'sql',
        title: 'BEGIN, COMMIT, and ROLLBACK',
        code: `BEGIN;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT;`,
      },
      {
        type: 'p',
        text: 'If anything goes wrong before COMMIT, you can ROLLBACK. After COMMIT, the changes are durable and visible according to normal isolation rules.',
      },
      { type: 'h2', text: 'Protect a business rule' },
      {
        type: 'code',
        language: 'sql',
        title: 'Lock the row you are changing',
        code: `BEGIN;

SELECT id, stock
FROM products
WHERE id = 42
FOR UPDATE;

UPDATE products
SET stock = stock - 1
WHERE id = 42
  AND stock > 0;

COMMIT;`,
      },
      {
        type: 'note',
        text: 'FOR UPDATE locks the selected rows until the transaction finishes. Use it when two transactions must not change the same important row at the same time.',
      },
      {
        type: 'tip',
        text: 'Keep transactions short. Do database work inside the transaction, but avoid waiting for slow network calls or user input while locks are held.',
      },
      {
        type: 'try',
        text: 'Design a transaction for creating an order and inserting its order_items. Decide which statements must all succeed together.',
      },
      {
        type: 'keypoints',
        items: [
          'Transactions make a group of statements succeed or fail together.',
          'COMMIT saves changes; ROLLBACK cancels uncommitted changes.',
          'ACID describes the safety properties expected from reliable database work.',
          'Row locks can protect critical updates, but transactions should stay short.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-jsonb',
    title: 'JSON & JSONB',
    description:
      'Store and query flexible JSONB data while keeping relational structure where it belongs.',
    level: 'intermediate',
    section: 'Flexible Data',
    order: 31,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'PostgreSQL supports json and jsonb columns. Most application tables use jsonb because it stores parsed binary JSON, supports indexing, and has powerful query operators.',
      },
      {
        type: 'p',
        text: 'JSONB is useful for flexible attributes, external API payloads, settings, event metadata, and data that changes shape often. It should not replace well-known relational columns such as email, status, or foreign keys.',
      },
      { type: 'h2', text: 'Create a JSONB column' },
      {
        type: 'code',
        language: 'sql',
        title: 'Products with attributes',
        code: `CREATE TABLE products (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb
);

INSERT INTO products (name, attributes)
VALUES
  ('Trail Backpack', '{"color": "green", "waterproof": true, "size": "30L"}'),
  ('City Backpack', '{"color": "black", "laptop": true, "size": "20L"}');`,
      },
      { type: 'h2', text: 'Query JSONB values' },
      {
        type: 'code',
        language: 'sql',
        title: 'Operators for JSONB',
        code: `SELECT name, attributes ->> 'color' AS color
FROM products
WHERE attributes @> '{"waterproof": true}';

SELECT name
FROM products
WHERE attributes ? 'laptop';`,
      },
      {
        type: 'note',
        text: 'The -> operator returns JSON. The ->> operator returns text. Use ->> when you want to compare, display, or cast a JSON value as a SQL value.',
      },
      { type: 'h2', text: 'Index JSONB containment' },
      {
        type: 'code',
        language: 'sql',
        title: 'GIN index for JSONB',
        code: `CREATE INDEX products_attributes_gin_idx
ON products
USING gin (attributes);`,
      },
      {
        type: 'tip',
        text: 'If your application filters by the same JSON key constantly, consider a normal column or an expression index. JSONB is flexible, but schemas are still valuable.',
      },
      {
        type: 'try',
        text: 'Add a settings jsonb column to a users table. Query users where settings contains {"email_notifications": true}.',
      },
      {
        type: 'keypoints',
        items: [
          'jsonb is usually preferred over json for querying and indexing.',
          'Use JSONB for flexible data, not as a replacement for core relational design.',
          '@> checks whether one JSONB value contains another.',
          'GIN indexes can speed up common JSONB containment queries.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-arrays',
    title: 'Arrays',
    description:
      'Store small lists in PostgreSQL arrays and know when a separate table is the better design.',
    level: 'intermediate',
    section: 'Flexible Data',
    order: 32,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'PostgreSQL arrays let one column hold multiple values of the same type. They are handy for compact lists such as tags, simple flags, or cached search terms.',
      },
      {
        type: 'p',
        text: 'Arrays are not a replacement for many-to-many relationships. If each item needs its own columns, constraints, permissions, or history, use a separate table.',
      },
      { type: 'h2', text: 'Create and insert arrays' },
      {
        type: 'code',
        language: 'sql',
        title: 'Article tags',
        code: `CREATE TABLE articles (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}'
);

INSERT INTO articles (title, tags)
VALUES
  ('PostgreSQL Arrays', ARRAY['postgres', 'sql', 'data']),
  ('Deploying Apps', ARRAY['web', 'deploy']);`,
      },
      { type: 'h2', text: 'Search arrays' },
      {
        type: 'code',
        language: 'sql',
        title: 'Containment and overlap',
        code: `SELECT title
FROM articles
WHERE tags @> ARRAY['postgres'];

SELECT title
FROM articles
WHERE tags && ARRAY['sql', 'database'];`,
      },
      {
        type: 'note',
        text: '@> means contains. && means overlaps. Both are useful when the list is small and the query is simple.',
      },
      { type: 'h2', text: 'Unnest an array' },
      {
        type: 'code',
        language: 'sql',
        title: 'One row per tag',
        code: `SELECT article.title, tag
FROM articles AS article
CROSS JOIN unnest(article.tags) AS tag
ORDER BY article.title, tag;`,
      },
      {
        type: 'tip',
        text: 'For heavily searched array columns, test a GIN index. For complex relationships, normalize into a join table instead.',
      },
      {
        type: 'try',
        text: 'Create a bookmarks table with a text[] labels column. Query bookmarks that contain the label work.',
      },
      {
        type: 'keypoints',
        items: [
          'Arrays store multiple same-type values in one column.',
          '@> checks whether an array contains another array.',
          'unnest expands array elements into rows.',
          'Use join tables when list items need relationships or extra data.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-full-text',
    title: 'Full-Text Search',
    description:
      'Search natural-language text with tsvector, tsquery, ranking, and indexes.',
    level: 'intermediate',
    section: 'Flexible Data',
    order: 33,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Full-text search is more than LIKE. PostgreSQL can parse text into searchable tokens, ignore common words, match word forms, and rank the best results.',
      },
      {
        type: 'p',
        text: 'This is useful for blog posts, product descriptions, help articles, and admin search screens where users type words instead of exact IDs.',
      },
      { type: 'h2', text: 'Search a document' },
      {
        type: 'code',
        language: 'sql',
        title: 'to_tsvector and plainto_tsquery',
        code: `SELECT id, title
FROM articles
WHERE to_tsvector('english', title || ' ' || body)
  @@ plainto_tsquery('english', 'postgres indexes');`,
      },
      {
        type: 'p',
        text: 'to_tsvector turns text into searchable tokens. plainto_tsquery turns user-friendly words into a safe search query.',
      },
      { type: 'h2', text: 'Rank results' },
      {
        type: 'code',
        language: 'sql',
        title: 'Order by relevance',
        code: `SELECT
  id,
  title,
  ts_rank(
    to_tsvector('english', title || ' ' || body),
    plainto_tsquery('english', 'postgres indexes')
  ) AS rank
FROM articles
WHERE to_tsvector('english', title || ' ' || body)
  @@ plainto_tsquery('english', 'postgres indexes')
ORDER BY rank DESC;`,
      },
      { type: 'h2', text: 'Add a generated search column' },
      {
        type: 'code',
        language: 'sql',
        title: 'Indexed search vector',
        code: `ALTER TABLE articles
ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, ''))
) STORED;

CREATE INDEX articles_search_vector_idx
ON articles
USING gin (search_vector);`,
      },
      {
        type: 'note',
        text: 'Use plainto_tsquery or websearch_to_tsquery for user input. They are friendlier and safer than manually building tsquery strings.',
      },
      {
        type: 'tip',
        text: 'Start with simple full-text search before adding external search services. PostgreSQL search is often enough for small and medium applications.',
      },
      {
        type: 'try',
        text: 'Create a search query for products that searches both name and description, ranks matches, and returns the best 10 results.',
      },
      {
        type: 'keypoints',
        items: [
          'Full-text search tokenizes and matches language-aware words.',
          '@@ checks whether a tsvector matches a tsquery.',
          'ts_rank helps order search results by relevance.',
          'GIN indexes make full-text search practical on larger tables.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-triggers',
    title: 'Triggers',
    description:
      'Run database logic automatically when rows are inserted, updated, or deleted.',
    level: 'intermediate',
    section: 'Database Logic',
    order: 34,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A trigger tells PostgreSQL to run a function when a table changes. Triggers are useful for audit timestamps, derived data, validation that must live in the database, and event-style logging.',
      },
      {
        type: 'p',
        text: 'Use triggers carefully. Logic hidden in the database can surprise application developers if it is not documented and tested.',
      },
      { type: 'h2', text: 'Update a timestamp automatically' },
      {
        type: 'code',
        language: 'sql',
        title: 'Trigger function',
        code: `CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`,
      },
      {
        type: 'code',
        language: 'sql',
        title: 'Attach the trigger',
        code: `CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();`,
      },
      {
        type: 'p',
        text: 'NEW represents the row being inserted or updated. In a BEFORE UPDATE trigger, changing NEW changes the row before it is stored.',
      },
      { type: 'h2', text: 'Record an audit row' },
      {
        type: 'code',
        language: 'sql',
        title: 'Simple audit trigger',
        code: `CREATE TABLE user_audit_log (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL,
  action text NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION log_user_update()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_audit_log (user_id, action)
  VALUES (NEW.id, 'updated');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`,
      },
      {
        type: 'note',
        text: 'Trigger functions for row-level triggers return NEW, OLD, or NULL. For most BEFORE or AFTER UPDATE triggers, returning NEW is the normal choice.',
      },
      {
        type: 'tip',
        text: 'Name triggers with the table and purpose, such as users_set_updated_at. Future maintainers should be able to guess what runs.',
      },
      {
        type: 'try',
        text: 'Create a trigger that writes to an order_status_log table whenever orders.status changes.',
      },
      {
        type: 'keypoints',
        items: [
          'Triggers run database functions in response to table changes.',
          'BEFORE triggers can modify NEW before a row is saved.',
          'AFTER triggers are commonly used for audit logs and side records.',
          'Use triggers for database-owned rules, and document them clearly.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-functions',
    title: 'SQL Functions',
    description:
      'Create reusable PostgreSQL functions for calculations, lookups, and safe database APIs.',
    level: 'intermediate',
    section: 'Database Logic',
    order: 35,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'PostgreSQL functions package logic inside the database. They can return scalar values, rows, tables, or trigger results depending on how you define them.',
      },
      {
        type: 'p',
        text: 'Small SQL functions can make repeated calculations consistent. PL/pgSQL functions are useful when logic needs variables, IF statements, loops, or error handling.',
      },
      { type: 'h2', text: 'Create a SQL function' },
      {
        type: 'code',
        language: 'sql',
        title: 'Format a full name',
        code: `CREATE OR REPLACE FUNCTION full_name(first_name text, last_name text)
RETURNS text AS $$
  SELECT trim(first_name || ' ' || last_name);
$$ LANGUAGE sql
IMMUTABLE;`,
      },
      {
        type: 'code',
        language: 'sql',
        title: 'Call the function',
        code: `SELECT full_name('Ada', 'Lovelace') AS display_name;`,
      },
      {
        type: 'note',
        text: 'IMMUTABLE tells PostgreSQL that the function returns the same output for the same inputs. Use volatility labels accurately; they affect planning and indexes.',
      },
      { type: 'h2', text: 'Return a table' },
      {
        type: 'code',
        language: 'sql',
        title: 'Function returning customer totals',
        code: `CREATE OR REPLACE FUNCTION customer_order_summary(min_total numeric)
RETURNS TABLE (
  customer_id bigint,
  order_count bigint,
  total_spent numeric
) AS $$
  SELECT
    customer_id,
    COUNT(*),
    SUM(total)
  FROM orders
  GROUP BY customer_id
  HAVING SUM(total) >= min_total;
$$ LANGUAGE sql
STABLE;`,
      },
      {
        type: 'tip',
        text: 'Prefer plain SQL functions when a single query is enough. Reach for PL/pgSQL only when procedural control flow genuinely helps.',
      },
      {
        type: 'try',
        text: 'Create a function named active_customer_count() that returns the number of customers with at least one order in the last 30 days.',
      },
      {
        type: 'keypoints',
        items: [
          'Functions make reusable database logic available to SQL and applications.',
          'SQL functions are concise for single-query behavior.',
          'Use RETURNS TABLE when a function should return rows and columns.',
          'Volatility labels such as IMMUTABLE and STABLE should match reality.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-explain',
    title: 'EXPLAIN & Query Plans',
    description:
      'Read PostgreSQL query plans to understand how the database executes SQL.',
    level: 'intermediate',
    section: 'Performance',
    order: 36,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'EXPLAIN shows the plan PostgreSQL expects to use for a query. EXPLAIN ANALYZE actually runs the query and includes real timing and row counts.',
      },
      {
        type: 'p',
        text: 'Plans help you answer performance questions with evidence: Did PostgreSQL use the index? How many rows did it read? Where did time go?',
      },
      { type: 'h2', text: 'Start with EXPLAIN' },
      {
        type: 'code',
        language: 'sql',
        title: 'Inspect a query plan',
        code: `EXPLAIN
SELECT id, email
FROM customers
WHERE email = 'maya@example.com';`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'Example output',
        code: `Index Scan using customers_email_key on customers
  Index Cond: (email = 'maya@example.com'::text)`,
      },
      {
        type: 'p',
        text: 'An Index Scan means PostgreSQL can use an index to find matching rows. A Seq Scan means it reads the table sequentially, which may be fine for small tables or broad queries.',
      },
      { type: 'h2', text: 'Use ANALYZE carefully' },
      {
        type: 'code',
        language: 'sql',
        title: 'Run and measure',
        code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT customer_id, SUM(total)
FROM orders
WHERE created_at >= date_trunc('month', now())
GROUP BY customer_id;`,
      },
      {
        type: 'warning',
        text: 'EXPLAIN ANALYZE executes the query. Do not run it on destructive UPDATE, DELETE, or INSERT statements unless you wrap them in a transaction and roll them back.',
      },
      {
        type: 'note',
        text: 'Estimated rows and actual rows are both important. Large differences can mean stale statistics, unusual data distribution, or a query that is hard for the planner to estimate.',
      },
      {
        type: 'tip',
        text: 'Use EXPLAIN to investigate a specific slow query. Do not add indexes blindly; confirm the query shape and row counts first.',
      },
      {
        type: 'try',
        text: 'Run EXPLAIN on a query that filters orders by customer_id. Then create an index on customer_id and compare the plan again.',
      },
      {
        type: 'keypoints',
        items: [
          'EXPLAIN shows the planned execution strategy.',
          'EXPLAIN ANALYZE runs the query and reports actual timing.',
          'Seq Scan is not always bad; context and row counts matter.',
          'Compare estimated and actual rows when diagnosing performance.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-indexes-advanced',
    title: 'Advanced Indexing',
    description:
      'Choose expression, partial, composite, GIN, and BRIN indexes for practical PostgreSQL workloads.',
    level: 'intermediate',
    section: 'Performance',
    order: 37,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Basic B-tree indexes are only the beginning. PostgreSQL supports specialized indexes that match different query patterns: multi-column filters, computed expressions, partial subsets, JSONB, arrays, full-text search, and huge time-ordered tables.',
      },
      {
        type: 'p',
        text: 'Every index has a cost. It uses disk space and makes writes a little slower. Good indexing starts from real queries, not guesses.',
      },
      { type: 'h2', text: 'Composite indexes' },
      {
        type: 'code',
        language: 'sql',
        title: 'Customer orders by date',
        code: `CREATE INDEX orders_customer_created_idx
ON orders (customer_id, created_at DESC);

SELECT *
FROM orders
WHERE customer_id = 12
ORDER BY created_at DESC
LIMIT 20;`,
      },
      {
        type: 'p',
        text: 'Column order matters. This index is built for queries that first filter by customer_id and then use created_at ordering.',
      },
      { type: 'h2', text: 'Partial and expression indexes' },
      {
        type: 'code',
        language: 'sql',
        title: 'Index only active rows',
        code: `CREATE INDEX users_active_email_idx
ON users (lower(email))
WHERE deleted_at IS NULL;`,
      },
      {
        type: 'p',
        text: 'This index only stores non-deleted users and supports case-insensitive email lookup when the query uses lower(email).',
      },
      { type: 'h2', text: 'GIN and BRIN indexes' },
      {
        type: 'code',
        language: 'sql',
        title: 'Specialized index types',
        code: `CREATE INDEX products_attributes_gin_idx
ON products
USING gin (attributes);

CREATE INDEX events_created_brin_idx
ON events
USING brin (created_at);`,
      },
      {
        type: 'note',
        text: 'GIN is common for JSONB, arrays, and full-text search. BRIN is useful for very large tables where values are naturally ordered, such as append-only event logs by created_at.',
      },
      {
        type: 'tip',
        text: 'After adding an index, test the exact query with EXPLAIN. If the query cannot use the index shape, the index may only add write overhead.',
      },
      {
        type: 'try',
        text: 'Create a partial index for orders where status = pending. Then write the query that would benefit from it.',
      },
      {
        type: 'keypoints',
        items: [
          'Composite indexes depend on column order and query shape.',
          'Expression indexes support queries that filter by computed values.',
          'Partial indexes keep only rows matching a WHERE condition.',
          'GIN and BRIN indexes solve specialized data access patterns.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-migrations-mindset',
    title: 'Migrations Mindset',
    description:
      'Treat schema changes as reviewed, repeatable application changes instead of manual database edits.',
    level: 'intermediate',
    section: 'App Integration',
    order: 38,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'A migration is a versioned change to your database schema or reference data. It might create a table, add a column, create an index, or backfill existing rows.',
      },
      {
        type: 'p',
        text: 'The migration mindset is simple: if production needs the change, it belongs in code review and version control. Avoid changing shared databases by hand and hoping teammates remember what happened.',
      },
      { type: 'h2', text: 'A small migration file' },
      {
        type: 'code',
        language: 'sql',
        title: '001_create_tasks.sql',
        code: `CREATE TABLE tasks (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);`,
      },
      { type: 'h2', text: 'A safe sequence for changes' },
      {
        type: 'ol',
        items: [
          'Add nullable columns or backward-compatible tables first.',
          'Deploy application code that writes both old and new shapes if needed.',
          'Backfill existing rows in controlled batches.',
          'Add NOT NULL constraints or remove old columns after the app no longer depends on them.',
        ],
      },
      {
        type: 'code',
        language: 'sql',
        title: 'Add then validate a constraint',
        code: `ALTER TABLE orders
ADD CONSTRAINT orders_total_non_negative
CHECK (total >= 0) NOT VALID;

ALTER TABLE orders
VALIDATE CONSTRAINT orders_total_non_negative;`,
      },
      {
        type: 'note',
        text: 'NOT VALID lets PostgreSQL add a constraint without checking every existing row immediately. VALIDATE CONSTRAINT can be run later to check existing data.',
      },
      {
        type: 'tip',
        text: 'Prefer many small migrations over one giant migration. Small changes are easier to review, deploy, and roll back logically.',
      },
      {
        type: 'try',
        text: 'Plan a migration that adds a required profile_name column to users that already has data. Include the add, backfill, and constraint steps.',
      },
      {
        type: 'keypoints',
        items: [
          'Migrations make schema changes repeatable and reviewable.',
          'Production-safe changes often happen in multiple steps.',
          'Backfills should be planned separately from schema creation when data is large.',
          'Avoid manual schema edits on shared environments.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-connect-node',
    title: 'Connect from Node.js (pg)',
    description:
      'Connect a plain Node.js application to PostgreSQL using pg, DATABASE_URL, and parameterized queries.',
    level: 'intermediate',
    section: 'App Integration',
    order: 39,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'The pg package is the standard low-level PostgreSQL client for Node.js. It gives you a Pool for reusable connections and a query method for sending SQL.',
      },
      {
        type: 'p',
        text: 'In real projects, connection details should come from environment variables. Never hardcode usernames, passwords, or production hostnames in source code.',
      },
      { type: 'h2', text: 'Install pg and dotenv' },
      {
        type: 'code',
        language: 'bash',
        title: 'Packages',
        code: `npm install pg dotenv`,
      },
      {
        type: 'code',
        language: 'text',
        title: '.env',
        code: `DATABASE_URL=postgres://app_user:replace_me@localhost:5432/app_db`,
      },
      { type: 'h2', text: 'Create a small database module' },
      {
        type: 'code',
        language: 'javascript',
        title: 'db.js',
        code: `import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function listUsers() {
  const result = await pool.query(
    'SELECT id, email FROM users ORDER BY created_at DESC LIMIT $1',
    [10],
  );

  return result.rows;
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'index.js',
        code: `import { listUsers, pool } from './db.js';

try {
  const users = await listUsers();
  console.table(users);
} finally {
  await pool.end();
}`,
      },
      {
        type: 'note',
        text: 'The $1 placeholder and values array create a parameterized query. Do not build SQL by concatenating user input.',
      },
      {
        type: 'tip',
        text: 'Use one shared Pool per server process. Creating a new pool for every query wastes connections and can overload PostgreSQL.',
      },
      {
        type: 'try',
        text: 'Write a findUserByEmail(email) function that uses WHERE email = $1 and passes the email as a parameter.',
      },
      {
        type: 'keypoints',
        items: [
          'Install pg to connect Node.js directly to PostgreSQL.',
          'Read DATABASE_URL from the environment instead of hardcoding secrets.',
          'Use parameterized queries with placeholders such as $1.',
          'Close the pool in scripts; keep it shared in long-running servers.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-connect-express',
    title: 'Connect from Express',
    description:
      'Use PostgreSQL from Express routes with a shared pg pool, safe parameters, and clean error handling.',
    level: 'intermediate',
    section: 'App Integration',
    order: 40,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Express apps usually keep database code in a small module and import it into route handlers. The route receives HTTP input, validates it, and calls SQL with parameters.',
      },
      {
        type: 'p',
        text: 'Use DATABASE_URL from the environment so local, staging, and production deployments can use different databases without changing code.',
      },
      { type: 'h2', text: 'Install packages' },
      {
        type: 'code',
        language: 'bash',
        title: 'Express and pg',
        code: `npm install express pg dotenv`,
      },
      {
        type: 'code',
        language: 'text',
        title: '.env',
        code: `DATABASE_URL=postgres://app_user:replace_me@localhost:5432/app_db
PORT=3000`,
      },
      { type: 'h2', text: 'Create a shared pool' },
      {
        type: 'code',
        language: 'javascript',
        title: 'db.js',
        code: `import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});`,
      },
      { type: 'h2', text: 'Query inside a route' },
      {
        type: 'code',
        language: 'javascript',
        title: 'server.js',
        code: `import express from 'express';
import { pool } from './db.js';

const app = express();
app.use(express.json());

app.get('/api/products', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, price FROM products ORDER BY name LIMIT $1',
      [20],
    );

    res.json({ products: result.rows });
  } catch (error) {
    next(error);
  }
});

app.get('/api/products/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, price FROM products WHERE id = $1',
      [req.params.id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ product: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(process.env.PORT ?? 3000);`,
      },
      {
        type: 'note',
        text: 'req.params.id is still external input. Passing it as a query parameter lets pg send it safely instead of mixing it into SQL text.',
      },
      {
        type: 'tip',
        text: 'Keep SQL in small functions once routes grow. A route should not become a long mix of validation, SQL, business rules, and response formatting.',
      },
      {
        type: 'try',
        text: 'Add a POST /api/products route that inserts name and price with INSERT ... RETURNING id, name, price. Use $1 and $2 parameters.',
      },
      {
        type: 'keypoints',
        items: [
          'Express routes can share one pg Pool from a database module.',
          'DATABASE_URL belongs in the environment, not in source code.',
          'Route input must be validated and passed as SQL parameters.',
          'Use next(error) or a central error handler for database failures.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-connect-flask',
    title: 'Connect from Flask (SQLAlchemy/psycopg)',
    description:
      'Connect Flask to PostgreSQL with environment configuration, SQLAlchemy, and the psycopg driver.',
    level: 'intermediate',
    section: 'App Integration',
    order: 41,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Flask does not require one database library. A common setup is SQLAlchemy for connection management and query building, plus psycopg as the PostgreSQL driver.',
      },
      {
        type: 'p',
        text: 'The application should read DATABASE_URL from the environment. Use a placeholder in examples and keep real passwords in local .env files or your hosting provider secret manager.',
      },
      { type: 'h2', text: 'Install packages' },
      {
        type: 'code',
        language: 'bash',
        title: 'Flask, SQLAlchemy, and psycopg',
        code: `pip install Flask Flask-SQLAlchemy psycopg[binary] python-dotenv`,
      },
      {
        type: 'code',
        language: 'text',
        title: '.env',
        code: `DATABASE_URL=postgresql+psycopg://app_user:replace_me@localhost:5432/app_db`,
      },
      { type: 'h2', text: 'Configure Flask-SQLAlchemy' },
      {
        type: 'code',
        language: 'python',
        title: 'app.py',
        code: `import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

db = SQLAlchemy()


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    price = db.Column(db.Numeric, nullable=False)


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

    @app.get("/api/products")
    def products():
        rows = Product.query.order_by(Product.name).limit(20).all()
        return jsonify([
            {"id": row.id, "name": row.name, "price": str(row.price)}
            for row in rows
        ])

    return app`,
      },
      { type: 'h2', text: 'Run a small raw SQL query' },
      {
        type: 'code',
        language: 'python',
        title: 'SQLAlchemy text query',
        code: `from sqlalchemy import text


@app.get("/api/health/db")
def database_health():
    value = db.session.execute(text("SELECT 1")).scalar_one()
    return {"database": "ok", "value": value}`,
      },
      {
        type: 'note',
        text: 'SQLAlchemy still uses a PostgreSQL driver underneath. With SQLAlchemy 2.x, postgresql+psycopg:// selects the modern psycopg driver.',
      },
      {
        type: 'tip',
        text: 'Use the Flask application factory pattern for larger apps. It keeps configuration, extensions, and tests easier to control.',
      },
      {
        type: 'try',
        text: 'Add a /api/products/<int:product_id> route that returns one product or a 404 response if it does not exist.',
      },
      {
        type: 'keypoints',
        items: [
          'Flask commonly uses SQLAlchemy plus psycopg for PostgreSQL.',
          'DATABASE_URL should come from the environment.',
          'Flask-SQLAlchemy manages sessions and connection usage for requests.',
          'Use SQLAlchemy text() when you need a small raw SQL query.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-connect-django',
    title: 'Connect from Django',
    description:
      'Configure Django to use PostgreSQL through environment variables and the built-in database settings.',
    level: 'intermediate',
    section: 'App Integration',
    order: 42,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Django has a built-in ORM and database layer. To use PostgreSQL, install a PostgreSQL driver and configure DATABASES in settings.py.',
      },
      {
        type: 'p',
        text: 'Many teams store connection details in DATABASE_URL. Django can parse it with a helper package, or you can map individual environment variables into DATABASES yourself.',
      },
      { type: 'h2', text: 'Install packages' },
      {
        type: 'code',
        language: 'bash',
        title: 'Django PostgreSQL dependencies',
        code: `pip install Django psycopg[binary] dj-database-url python-dotenv`,
      },
      {
        type: 'code',
        language: 'text',
        title: '.env',
        code: `DATABASE_URL=postgres://app_user:replace_me@localhost:5432/app_db`,
      },
      { type: 'h2', text: 'Configure DATABASES' },
      {
        type: 'code',
        language: 'python',
        title: 'settings.py',
        code: `import os
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

DATABASES = {
    "default": dj_database_url.config(
        default=os.environ.get("DATABASE_URL"),
        conn_max_age=60,
    )
}`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'Manual DATABASES example',
        code: `DATABASES = {
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
      { type: 'h2', text: 'Use the ORM' },
      {
        type: 'code',
        language: 'python',
        title: 'A model query in a view',
        code: `from django.http import JsonResponse

from .models import Product


def product_list(request):
    products = Product.objects.order_by("name").values("id", "name", "price")[:20]
    return JsonResponse({"products": list(products)})`,
      },
      {
        type: 'note',
        text: 'Django ENGINE must be django.db.backends.postgresql for PostgreSQL. The psycopg package provides the driver Django uses to talk to the database.',
      },
      {
        type: 'tip',
        text: 'Run python manage.py migrate after changing DATABASES so Django creates its own tables in the PostgreSQL database.',
      },
      {
        type: 'try',
        text: 'Create a Product model with name and price fields, run makemigrations and migrate, then query the first 10 products in a view.',
      },
      {
        type: 'keypoints',
        items: [
          'Django connects to PostgreSQL through DATABASES in settings.py.',
          'Use django.db.backends.postgresql as the ENGINE.',
          'Read credentials from environment variables or DATABASE_URL.',
          'The Django ORM sends SQL through the configured PostgreSQL driver.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-connect-nextjs',
    title: 'Connect from Next.js',
    description:
      'Query PostgreSQL from Next.js Server Components and route handlers without exposing credentials to the browser.',
    level: 'intermediate',
    section: 'App Integration',
    order: 43,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Next.js can query PostgreSQL on the server. In the App Router, Server Components and route handlers run on the server, so they can safely read DATABASE_URL.',
      },
      {
        type: 'p',
        text: 'Do not connect to PostgreSQL directly from Client Components or browser code. Browser bundles are visible to users, and database credentials must never be shipped to the client.',
      },
      { type: 'h2', text: 'Install pg' },
      {
        type: 'code',
        language: 'bash',
        title: 'Package',
        code: `npm install pg
npm install --save-dev @types/pg`,
      },
      {
        type: 'code',
        language: 'text',
        title: '.env.local',
        code: `DATABASE_URL=postgres://app_user:replace_me@localhost:5432/app_db`,
      },
      { type: 'h2', text: 'Create a server-only database module' },
      {
        type: 'code',
        language: 'typescript',
        title: 'lib/db.ts',
        code: `import 'server-only';
import { Pool } from 'pg';

const globalForPg = globalThis as unknown as {
  pgPool?: Pool;
};

export const pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool;
}`,
      },
      { type: 'h2', text: 'Query in a Server Component' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/products/page.tsx',
        code: `import { pool } from '@/lib/db';

type Product = {
  id: number;
  name: string;
  price: string;
};

export default async function ProductsPage() {
  const result = await pool.query<Product>(
    'SELECT id, name, price::text FROM products ORDER BY name LIMIT $1',
    [20],
  );

  return (
    <main>
      <h1>Products</h1>
      <ul>
        {result.rows.map((product) => (
          <li key={product.id}>
            {product.name}: {product.price}
          </li>
        ))}
      </ul>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Query in a route handler' },
      {
        type: 'code',
        language: 'typescript',
        title: 'app/api/products/route.ts',
        code: `import { NextResponse } from 'next/server';

import { pool } from '@/lib/db';

export async function GET() {
  const result = await pool.query(
    'SELECT id, name, price::text FROM products ORDER BY name LIMIT $1',
    [20],
  );

  return NextResponse.json({ products: result.rows });
}`,
      },
      {
        type: 'note',
        text: 'The server-only import helps prevent accidental use of the database module in Client Components.',
      },
      {
        type: 'tip',
        text: 'On serverless platforms, use a managed Postgres provider or pooler that supports many short-lived function invocations.',
      },
      {
        type: 'try',
        text: 'Create app/api/products/[id]/route.ts that reads params.id and queries WHERE id = $1. Return 404 JSON when no row exists.',
      },
      {
        type: 'keypoints',
        items: [
          'Next.js database queries belong in Server Components, Server Actions, or route handlers.',
          'Never expose DATABASE_URL to browser-side code.',
          'Use pg with a shared server-only Pool module.',
          'Parameterized queries work the same way in Next.js as in Node.js.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-env-secrets',
    title: 'DATABASE_URL, Env Vars & Secrets',
    description:
      'Manage PostgreSQL connection strings and secrets safely across local development and deployment.',
    level: 'intermediate',
    section: 'App Integration',
    order: 44,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Applications need database credentials, but source code should not contain them. Environment variables let each environment provide its own connection details.',
      },
      {
        type: 'p',
        text: 'DATABASE_URL is a common single-variable format for PostgreSQL. Many frameworks and hosting platforms understand it directly.',
      },
      { type: 'h2', text: 'Connection string shape' },
      {
        type: 'code',
        language: 'text',
        title: 'DATABASE_URL format',
        code: `postgres://username:password@host:5432/database_name`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'Local .env example with placeholders',
        code: `DATABASE_URL=postgres://app_user:replace_me@localhost:5432/app_db
NODE_ENV=development`,
      },
      {
        type: 'warning',
        text: 'Never commit real .env files containing passwords. Commit an example file such as .env.example with safe placeholders instead.',
      },
      { type: 'h2', text: 'Example file for teammates' },
      {
        type: 'code',
        language: 'text',
        title: '.env.example',
        code: `DATABASE_URL=postgres://app_user:change_me@localhost:5432/app_db`,
      },
      { type: 'h2', text: 'Read it in code' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Node.js',
        code: `const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}`,
      },
      {
        type: 'note',
        text: 'Some hosted PostgreSQL providers require SSL. Many clients let you configure SSL separately or include options in the connection string. Follow your provider documentation.',
      },
      {
        type: 'tip',
        text: 'Rotate credentials if a secret is exposed. Removing it from the repository later is not enough because Git history may still contain it.',
      },
      {
        type: 'try',
        text: 'Create a .env.example for a project that needs DATABASE_URL and PORT. Use placeholders only.',
      },
      {
        type: 'keypoints',
        items: [
          'DATABASE_URL stores PostgreSQL connection details in one environment variable.',
          'Real secrets belong in local ignored files or platform secret managers.',
          '.env.example documents required variables without exposing credentials.',
          'Validate required environment variables at application startup.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-pooling',
    title: 'Connection Pooling',
    description:
      'Use connection pools to reuse PostgreSQL connections and avoid exhausting database limits.',
    level: 'intermediate',
    section: 'App Integration',
    order: 45,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Opening a PostgreSQL connection has overhead, and the server can only handle a limited number of connections. A pool keeps a small set of connections open and reuses them for many queries.',
      },
      {
        type: 'p',
        text: 'Most web apps should create one pool per application process. The pool checks out a connection for a query or transaction and returns it when work finishes.',
      },
      { type: 'h2', text: 'Node.js pool example' },
      {
        type: 'code',
        language: 'javascript',
        title: 'pg Pool',
        code: `import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});`,
      },
      { type: 'h2', text: 'Use a client for transactions' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Checkout and release',
        code: `const client = await pool.connect();

try {
  await client.query('BEGIN');
  await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [100, 1]);
  await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [100, 2]);
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}`,
      },
      {
        type: 'note',
        text: 'A transaction must use the same checked-out client for every statement. Calling pool.query for each statement could use different connections.',
      },
      { type: 'h2', text: 'Pool sizing' },
      {
        type: 'ul',
        items: [
          'Start small, such as 5 to 10 connections per app process.',
          'Account for every running process, worker, and serverless instance.',
          'Leave room for migrations, admin tools, and maintenance connections.',
          'Use PgBouncer or a managed pooler when many short-lived processes connect.',
        ],
      },
      {
        type: 'tip',
        text: 'If your app has connection errors under load, count total possible app instances times pool size before increasing the database max_connections setting.',
      },
      {
        type: 'try',
        text: 'For an app with 4 web processes and a pool max of 10, calculate the maximum number of application connections it can open.',
      },
      {
        type: 'keypoints',
        items: [
          'Pools reuse database connections instead of opening one per query.',
          'Create one shared pool per application process.',
          'Transactions need a single checked-out client until COMMIT or ROLLBACK.',
          'Pool size must be planned across all app instances.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-orm-vs-sql',
    title: 'ORM vs Raw SQL',
    description:
      'Choose between an ORM, query builder, and raw SQL based on clarity, safety, and control.',
    level: 'intermediate',
    section: 'App Integration',
    order: 46,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'An ORM maps database tables to application objects. Raw SQL sends SQL directly. Both are useful, and experienced teams often use both in the same application.',
      },
      {
        type: 'p',
        text: 'The decision should be practical. CRUD screens and simple relationships are often pleasant in an ORM. Complex reports, performance tuning, and database-specific features are often clearer in SQL.',
      },
      { type: 'h2', text: 'The same lookup two ways' },
      {
        type: 'code',
        language: 'python',
        title: 'Django ORM',
        code: `products = Product.objects.filter(category_id=category_id).order_by("name")[:20]`,
      },
      {
        type: 'code',
        language: 'sql',
        title: 'Raw SQL',
        code: `SELECT id, name, price
FROM products
WHERE category_id = $1
ORDER BY name
LIMIT 20;`,
      },
      { type: 'h2', text: 'When raw SQL helps' },
      {
        type: 'ul',
        items: [
          'Window functions and detailed reports',
          'Special PostgreSQL features such as JSONB operators or full-text search',
          'Queries where you need to inspect and tune the exact plan',
          'Bulk updates or migrations where object-by-object ORM work would be slow',
        ],
      },
      {
        type: 'note',
        text: 'Raw SQL does not mean unsafe SQL. Use parameters, prepared statements, or your framework query APIs instead of string concatenation.',
      },
      {
        type: 'tip',
        text: 'Use the simplest tool that keeps intent visible. If the ORM query is harder to understand than SQL, write SQL and wrap it in a well-named function.',
      },
      {
        type: 'try',
        text: 'Pick one report query in an app idea. Decide whether you would write it with an ORM or raw SQL, and explain the reason.',
      },
      {
        type: 'keypoints',
        items: [
          'ORMs are productive for common application data access.',
          'Raw SQL is often clearer for advanced PostgreSQL features and reports.',
          'Parameterized raw SQL can be safe and maintainable.',
          'Mixing ORM and SQL is normal when the boundary is deliberate.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-seed-data',
    title: 'Seeding Data',
    description:
      'Create repeatable sample data for development, demos, and tests without polluting production.',
    level: 'intermediate',
    section: 'App Integration',
    order: 47,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Seed data fills a database with known records. It helps developers run the app locally, makes demos predictable, and gives tests a realistic starting point.',
      },
      {
        type: 'p',
        text: 'A good seed script is repeatable. Running it twice should not create confusing duplicates unless that is intentional.',
      },
      { type: 'h2', text: 'Use INSERT with conflict handling' },
      {
        type: 'code',
        language: 'sql',
        title: 'seed.sql',
        code: `INSERT INTO categories (slug, name)
VALUES
  ('books', 'Books'),
  ('games', 'Games')
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name;

INSERT INTO products (sku, name, price)
VALUES
  ('BOOK-001', 'PostgreSQL Pocket Guide', 19.99),
  ('GAME-001', 'SQL Strategy Cards', 14.99)
ON CONFLICT (sku) DO NOTHING;`,
      },
      { type: 'h2', text: 'Run a seed file' },
      {
        type: 'code',
        language: 'bash',
        title: 'psql',
        code: `psql "$DATABASE_URL" -f seed.sql`,
      },
      {
        type: 'note',
        text: 'ON CONFLICT needs a unique constraint or unique index, such as categories.slug or products.sku.',
      },
      { type: 'h2', text: 'Keep environments separate' },
      {
        type: 'ul',
        items: [
          'Use safe fake data for development.',
          'Avoid copying real customer data into local machines.',
          'Make destructive reset scripts impossible to run against production by accident.',
          'Document how to seed the database after migrations.',
        ],
      },
      {
        type: 'tip',
        text: 'Seed reference data such as roles or categories separately from large demo data. The first may be needed everywhere; the second is usually development-only.',
      },
      {
        type: 'try',
        text: 'Write a seed.sql file for three users with unique email addresses. Use ON CONFLICT (email) DO NOTHING.',
      },
      {
        type: 'keypoints',
        items: [
          'Seed data makes local development and demos predictable.',
          'Repeatable seeds avoid accidental duplicates.',
          'ON CONFLICT is useful for idempotent inserts.',
          'Never seed production with fake or destructive data by accident.',
        ],
      },
    ],
  },
  {
    slug: 'postgres-testing-db',
    title: 'Testing Against PostgreSQL',
    description:
      'Run tests against PostgreSQL with isolated data, transactions, and realistic database behavior.',
    level: 'intermediate',
    section: 'App Integration',
    order: 48,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Database-backed code should be tested against the same kind of database it uses in production. SQLite or mocks can miss PostgreSQL-specific behavior such as JSONB operators, constraints, transactions, and indexes.',
      },
      {
        type: 'p',
        text: 'The main challenge is isolation. Each test should start from known data and should not depend on records created by another test.',
      },
      { type: 'h2', text: 'Use a separate test database' },
      {
        type: 'code',
        language: 'text',
        title: '.env.test',
        code: `DATABASE_URL=postgres://app_user:replace_me@localhost:5432/app_test`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Create and migrate test database',
        code: `createdb app_test
npm run migrate:test`,
      },
      { type: 'h2', text: 'Wrap a test in a transaction' },
      {
        type: 'code',
        language: 'javascript',
        title: 'transaction pattern',
        code: `const client = await pool.connect();

beforeEach(async () => {
  await client.query('BEGIN');
});

afterEach(async () => {
  await client.query('ROLLBACK');
});

afterAll(async () => {
  client.release();
  await pool.end();
});`,
      },
      {
        type: 'note',
        text: 'Transaction-based cleanup is fast, but code under test must use the same connection or test framework support. Some integration tests are simpler with table truncation between tests.',
      },
      { type: 'h2', text: 'Test a real constraint' },
      {
        type: 'code',
        language: 'sql',
        title: 'Database behavior worth testing',
        code: `ALTER TABLE users
ADD CONSTRAINT users_email_unique UNIQUE (email);`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Example assertion idea',
        code: `await createUser({ email: 'maya@example.com' });
await expect(createUser({ email: 'maya@example.com' })).rejects.toThrow();`,
      },
      {
        type: 'tip',
        text: 'Keep a small number of focused database integration tests around important behavior. Unit tests are still useful for pure application logic.',
      },
      {
        type: 'try',
        text: 'Design a test for creating an order: insert a customer, insert an order, assert the order row exists, and clean up with a rollback.',
      },
      {
        type: 'keypoints',
        items: [
          'Use PostgreSQL for tests that depend on PostgreSQL behavior.',
          'Keep test databases separate from development and production databases.',
          'Transactions or truncation can isolate test data.',
          'Test important constraints and queries, not every line of SQL mechanically.',
        ],
      },
    ],
  },
];
