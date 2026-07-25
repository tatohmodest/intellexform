import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-postgresql',
    title: 'What is PostgreSQL?',
    description: 'Learn what PostgreSQL is, what it stores, and why it is a trusted database for real applications.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 9,
    content: [
      { type: 'p', text: 'PostgreSQL, often called Postgres, is a relational database management system. It stores data in tables, lets you query that data with SQL, and protects the data with rules, permissions, backups, and transactions.' },
      { type: 'p', text: 'A database is useful when information needs to be organized, searched, updated, and shared safely. User accounts, blog posts, course enrollments, product orders, and payments are common examples.' },
      { type: 'h2', text: 'PostgreSQL stores related data' },
      { type: 'p', text: 'Relational databases organize data into tables. Each table represents one kind of thing, such as users or courses. Rows are individual records, and columns describe the fields on each record.' },
      {
        type: 'table',
        headers: ['Database idea', 'Example'],
        rows: [
          ['Table', 'users'],
          ['Row', 'One user named Maya'],
          ['Column', 'email or created_at'],
          ['Relationship', 'A user can enroll in many courses']
        ]
      },
      { type: 'h2', text: 'SQL is the language you use' },
      { type: 'p', text: 'SQL stands for Structured Query Language. You use SQL to create tables, insert data, read rows, update values, delete records, and describe how tables relate to each other.' },
      {
        type: 'code',
        title: 'A first SQL query',
        language: 'sql',
        code: `SELECT 'Hello, PostgreSQL!' AS message;`
      },
      {
        type: 'code',
        title: 'A table-shaped result',
        language: 'sql',
        code: `SELECT
  1 AS user_id,
  'maya@example.com' AS email,
  true AS is_active;`
      },
      { type: 'h2', text: 'Why developers choose PostgreSQL' },
      { type: 'ul', items: ['It is open source and widely used.', 'It follows SQL standards closely while adding powerful features.', 'It supports strong data integrity with constraints and transactions.', 'It works well for small projects and large production systems.', 'It can store normal table data and flexible JSON data when needed.'] },
      { type: 'note', text: 'Applications often connect to PostgreSQL from frameworks like Django, Flask, Express, or Next.js. In this beginner path, we focus on PostgreSQL and SQL first.' },
      { type: 'try', text: 'Think of an app you use often. List three kinds of data it might store in PostgreSQL, such as users, messages, products, or orders.' },
      { type: 'keypoints', items: ['PostgreSQL is a relational database system.', 'Data is stored in tables with rows and columns.', 'SQL is used to work with the data.', 'PostgreSQL is popular because it is reliable, open source, and feature rich.'] }
    ]
  },
  {
    slug: 'postgres-vs-others',
    title: 'PostgreSQL vs MySQL & SQLite',
    description: 'Compare PostgreSQL with MySQL and SQLite so you know when each database is commonly used.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 10,
    content: [
      { type: 'p', text: 'PostgreSQL, MySQL, and SQLite are all relational databases, but they are often chosen for different reasons. Beginners do not need to memorize every difference, but it helps to understand the basic tradeoffs.' },
      { type: 'h2', text: 'The short version' },
      {
        type: 'table',
        headers: ['Database', 'Common use', 'Beginner-friendly idea'],
        rows: [
          ['PostgreSQL', 'Full applications, analytics, complex data rules', 'Powerful and production-ready'],
          ['MySQL', 'Web apps, hosting platforms, content systems', 'Popular and widely supported'],
          ['SQLite', 'Local apps, small tools, prototypes, mobile apps', 'A database stored in one file']
        ]
      },
      { type: 'h2', text: 'PostgreSQL strength: correctness and features' },
      { type: 'p', text: 'PostgreSQL is known for strong data rules, good SQL support, advanced indexes, JSONB, full-text search, and reliable transactions. It is a strong default choice when your data matters and your project may grow.' },
      {
        type: 'code',
        title: 'PostgreSQL style: explicit data rules',
        language: 'sql',
        code: `CREATE TABLE course_enrollments (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_email text NOT NULL,
  course_title text NOT NULL,
  enrolled_at timestamp NOT NULL DEFAULT now(),
  UNIQUE (student_email, course_title)
);`
      },
      { type: 'h2', text: 'SQLite strength: simplicity' },
      { type: 'p', text: 'SQLite does not run as a separate server. The database is a file on disk. That makes it excellent for learning, local tools, tests, and small apps, but it is not usually the same choice as PostgreSQL for multi-user server applications.' },
      {
        type: 'code',
        title: 'Same SQL idea, smaller local database',
        language: 'sql',
        code: `CREATE TABLE notes (
  id integer PRIMARY KEY,
  body text NOT NULL
);`
      },
      { type: 'h2', text: 'MySQL strength: web hosting history' },
      { type: 'p', text: 'MySQL has powered many websites for many years. You will see it in hosting panels, WordPress sites, and older web stacks. PostgreSQL is often preferred when teams want richer SQL features and stricter behavior by default.' },
      { type: 'tip', text: 'Do not worry about picking the perfect database while learning SQL. The core ideas of tables, SELECT, WHERE, joins, keys, and indexes transfer across relational databases.' },
      { type: 'try', text: 'For each project, choose a likely database: a mobile note app, a large course platform, and a small local script that tracks expenses. Explain your choices in one sentence each.' },
      { type: 'keypoints', items: ['PostgreSQL, MySQL, and SQLite are relational databases.', 'PostgreSQL is a strong choice for full applications and data integrity.', 'SQLite is simple because it stores data in a file.', 'MySQL is common in many web hosting environments.'] }
    ]
  },
  {
    slug: 'postgres-install',
    title: 'Install PostgreSQL',
    description: 'Install PostgreSQL, check that it is running, and learn the basic tools that come with it.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 11,
    content: [
      { type: 'p', text: 'To practice PostgreSQL on your computer, you need the PostgreSQL server and command-line tools. The server stores and manages databases. The command-line tools let you create databases, connect, and run SQL.' },
      { type: 'h2', text: 'Install options' },
      { type: 'p', text: 'The exact install steps depend on your operating system. On macOS, many developers use the official installer or Homebrew. On Windows, the official installer is common. On Linux, use your package manager.' },
      {
        type: 'code',
        title: 'macOS with Homebrew',
        language: 'bash',
        code: `brew install postgresql@16
brew services start postgresql@16`
      },
      {
        type: 'code',
        title: 'Ubuntu or Debian',
        language: 'bash',
        code: `sudo apt update
sudo apt install postgresql postgresql-client`
      },
      { type: 'h2', text: 'Check your installation' },
      { type: 'p', text: 'After installation, check the version of psql. psql is the terminal program used to connect to PostgreSQL and run SQL commands.' },
      {
        type: 'code',
        title: 'Check psql',
        language: 'bash',
        code: `psql --version`
      },
      {
        type: 'code',
        title: 'Check whether the server accepts connections',
        language: 'bash',
        code: `pg_isready`
      },
      { type: 'h2', text: 'Create a practice database' },
      { type: 'p', text: 'Many PostgreSQL installs create a default database user for you. If your setup is different, your command may need a username, such as psql -U postgres.' },
      {
        type: 'code',
        title: 'Create and open a practice database',
        language: 'bash',
        code: `createdb intellex_practice
psql intellex_practice`
      },
      { type: 'note', text: 'PostgreSQL version numbers change over time. This tutorial uses beginner-friendly SQL that works on modern PostgreSQL versions.' },
      { type: 'tip', text: 'If a command says connection refused, the PostgreSQL server is probably not running yet. Start the service, then try again.' },
      { type: 'try', text: 'Install PostgreSQL, run psql --version, and create a database named intellex_practice. Keep it for the next lessons.' },
      { type: 'keypoints', items: ['PostgreSQL has a server and command-line tools.', 'psql connects to PostgreSQL from the terminal.', 'createdb creates a new database from the command line.', 'pg_isready checks whether PostgreSQL is accepting connections.'] }
    ]
  },
  {
    slug: 'postgres-psql',
    title: 'Using psql',
    description: 'Use psql to connect to a database, run SQL, view tables, and exit safely.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 10,
    content: [
      { type: 'p', text: 'psql is PostgreSQLs interactive terminal. It is one of the best tools for learning because you can type SQL, run it immediately, and see the result as a table.' },
      { type: 'h2', text: 'Connect to a database' },
      { type: 'p', text: 'If your current operating-system user has a matching PostgreSQL role, you can often connect by typing psql followed by the database name.' },
      {
        type: 'code',
        title: 'Open a database',
        language: 'bash',
        code: `psql intellex_practice`
      },
      {
        type: 'code',
        title: 'Connect with an explicit user',
        language: 'bash',
        code: `psql -U postgres -d intellex_practice`
      },
      { type: 'h2', text: 'Run SQL statements' },
      { type: 'p', text: 'SQL statements usually end with a semicolon. If you forget the semicolon, psql waits because it thinks your statement is not finished.' },
      {
        type: 'code',
        title: 'A simple psql session',
        language: 'sql',
        code: `SELECT current_database();

SELECT 2 + 3 AS answer;`
      },
      { type: 'h2', text: 'Helpful psql commands' },
      { type: 'p', text: 'psql also has meta-commands that begin with a backslash. These are not SQL; they are shortcuts for working inside psql.' },
      {
        type: 'code',
        title: 'Common psql commands',
        language: 'text',
        code: `\\l      list databases
\\c name  connect to another database
\\dt     list tables
\\d name describe a table
\\q      quit psql`
      },
      {
        type: 'code',
        title: 'Create and inspect a tiny table',
        language: 'sql',
        code: `CREATE TABLE psql_demo (
  id integer,
  message text
);

INSERT INTO psql_demo (id, message)
VALUES (1, 'psql is working');

SELECT * FROM psql_demo;`
      },
      { type: 'tip', text: 'Use the Up arrow in psql to bring back earlier commands. This is very helpful while practicing.' },
      { type: 'try', text: 'Open your practice database in psql, run SELECT current_database();, create the psql_demo table, inspect it with \\d psql_demo, then quit with \\q.' },
      { type: 'keypoints', items: ['psql is the interactive PostgreSQL terminal.', 'SQL statements normally end with semicolons.', 'Backslash commands are psql shortcuts, not SQL.', '\\dt lists tables and \\d describes one table.'] }
    ]
  },
  {
    slug: 'postgres-databases',
    title: 'Create & Manage Databases',
    description: 'Create databases, list them, connect to them, and understand when to use separate databases.',
    level: 'beginner',
    section: 'Getting Started',
    order: 5,
    minutes: 10,
    content: [
      { type: 'p', text: 'A PostgreSQL server can contain many databases. Each database is a separate container for tables, data, functions, views, and other objects. A project often has its own database.' },
      { type: 'h2', text: 'Create and drop databases from the shell' },
      { type: 'p', text: 'createdb and dropdb are convenient command-line tools. Use dropdb carefully because it removes the whole database and all data inside it.' },
      {
        type: 'code',
        title: 'Create a database',
        language: 'bash',
        code: `createdb course_app_dev
psql course_app_dev`
      },
      {
        type: 'code',
        title: 'Drop a practice database',
        language: 'bash',
        code: `dropdb old_practice_database`
      },
      { type: 'h2', text: 'Create databases with SQL' },
      { type: 'p', text: 'You can also create databases from inside psql. Connect to an existing database first, then run CREATE DATABASE.' },
      {
        type: 'code',
        title: 'Database SQL commands',
        language: 'sql',
        code: `CREATE DATABASE blog_dev;

-- You cannot switch databases with SQL.
-- In psql, use:
-- \\c blog_dev`
      },
      { type: 'h2', text: 'List and connect' },
      {
        type: 'code',
        title: 'Useful psql database commands',
        language: 'text',
        code: `\\l             list databases
\\c blog_dev    connect to blog_dev
SELECT current_database();`
      },
      { type: 'h2', text: 'One database or many?' },
      { type: 'p', text: 'For beginner projects, use one database per app environment. For example, course_app_dev for local development and course_app_test for automated tests. Production usually has its own protected database.' },
      { type: 'warning', text: 'Do not practice DROP DATABASE on a database that contains important data. Once dropped, the data is gone unless you have a backup.' },
      { type: 'try', text: 'Create a database named blog_practice, connect to it, check current_database(), then create another database named course_practice.' },
      { type: 'keypoints', items: ['A PostgreSQL server can hold multiple databases.', 'Use createdb or CREATE DATABASE to make a database.', 'Use psql \\l to list databases and \\c to connect.', 'Dropping a database removes everything inside it.'] }
    ]
  },
  {
    slug: 'postgres-tables',
    title: 'Creating Tables',
    description: 'Create tables with columns, choose clear names, and inspect the table structure.',
    level: 'beginner',
    section: 'Tables & Data',
    order: 6,
    minutes: 11,
    content: [
      { type: 'p', text: 'Tables are where relational data lives. A table has a name, a set of columns, and rows of data. Good table design starts with one clear purpose per table.' },
      { type: 'h2', text: 'Create a simple table' },
      { type: 'p', text: 'The CREATE TABLE statement names the table and defines each column. Each column has a data type, such as integer, text, boolean, or timestamp.' },
      {
        type: 'code',
        title: 'Users table',
        language: 'sql',
        code: `CREATE TABLE users (
  id integer GENERATED ALWAYS AS IDENTITY,
  name text,
  email text,
  is_active boolean,
  created_at timestamp
);`
      },
      { type: 'h2', text: 'Add a table for courses' },
      { type: 'p', text: 'A course table might store a title, a short description, a price, and whether the course is published.' },
      {
        type: 'code',
        title: 'Courses table',
        language: 'sql',
        code: `CREATE TABLE courses (
  id integer GENERATED ALWAYS AS IDENTITY,
  title text,
  description text,
  price numeric(8, 2),
  published boolean,
  created_at timestamp
);`
      },
      { type: 'h2', text: 'Inspect a table' },
      {
        type: 'code',
        title: 'psql table inspection',
        language: 'text',
        code: `\\dt
\\d users
\\d courses`
      },
      { type: 'h2', text: 'Naming tips' },
      { type: 'ul', items: ['Use lowercase table and column names.', 'Use underscores for multi-word names, such as created_at.', 'Be consistent with singular or plural table names. This tutorial uses plural names.', 'Choose names that describe the data, not the page or screen where it appears.'] },
      { type: 'note', text: 'This first table example is intentionally loose. Later lessons add constraints, primary keys, and foreign keys to protect the data.' },
      { type: 'try', text: 'Create a table named blog_posts with columns id, title, body, published, and created_at. Then inspect it with \\d blog_posts.' },
      { type: 'keypoints', items: ['CREATE TABLE defines a table and its columns.', 'Each column needs a data type.', 'Use clear lowercase names with underscores.', 'Use psql commands like \\dt and \\d to inspect tables.'] }
    ]
  },
  {
    slug: 'postgres-data-types',
    title: 'Data Types',
    description: 'Choose common PostgreSQL data types for text, numbers, dates, booleans, and JSON.',
    level: 'beginner',
    section: 'Tables & Data',
    order: 7,
    minutes: 12,
    content: [
      { type: 'p', text: 'A data type tells PostgreSQL what kind of value a column can store. Choosing good types helps PostgreSQL validate data, store it efficiently, and compare it correctly.' },
      { type: 'h2', text: 'Common beginner data types' },
      {
        type: 'table',
        headers: ['Type', 'Stores', 'Example'],
        rows: [
          ['text', 'Flexible text', 'Course title'],
          ['integer', 'Whole numbers', 'Number of seats'],
          ['numeric(8, 2)', 'Exact decimal numbers', 'Price'],
          ['boolean', 'true or false', 'Published status'],
          ['date', 'Calendar date', 'Birth date'],
          ['timestamp', 'Date and time', 'Created time'],
          ['jsonb', 'Structured JSON data', 'User preferences']
        ]
      },
      { type: 'h2', text: 'Use exact numbers for money-like values' },
      { type: 'p', text: 'For prices, use numeric with a precision and scale. numeric(8, 2) means up to 8 total digits, with 2 digits after the decimal point.' },
      {
        type: 'code',
        title: 'Products with useful types',
        language: 'sql',
        code: `CREATE TABLE products (
  id integer GENERATED ALWAYS AS IDENTITY,
  name text,
  price numeric(8, 2),
  stock_count integer,
  active boolean,
  created_at timestamp
);`
      },
      { type: 'h2', text: 'Dates and timestamps' },
      { type: 'p', text: 'Use date when you only need a calendar date. Use timestamp when the time of day matters, such as when an order was placed.' },
      {
        type: 'code',
        title: 'Orders with dates',
        language: 'sql',
        code: `CREATE TABLE orders (
  id integer GENERATED ALWAYS AS IDENTITY,
  customer_email text,
  total numeric(10, 2),
  ordered_at timestamp,
  expected_ship_date date
);`
      },
      { type: 'h2', text: 'JSONB for flexible details' },
      { type: 'p', text: 'PostgreSQL can store JSON data in a jsonb column. Use it for flexible attributes, but do not use JSONB as a replacement for every normal column.' },
      {
        type: 'code',
        title: 'Example JSON value',
        language: 'json',
        code: `{
  "theme": "dark",
  "email_notifications": true,
  "weekly_goal": 5
}`
      },
      {
        type: 'code',
        title: 'A table with JSONB preferences',
        language: 'sql',
        code: `CREATE TABLE user_settings (
  user_email text,
  preferences jsonb
);`
      },
      { type: 'tip', text: 'Start with normal columns for important values you filter, sort, or join on often. Add JSONB only when the shape of the data really needs flexibility.' },
      { type: 'try', text: 'Design a table named events with columns for title, starts_at, price, seats_available, and is_public. Pick a data type for each column.' },
      { type: 'keypoints', items: ['Data types describe what values a column can store.', 'text, integer, numeric, boolean, date, and timestamp are common beginner types.', 'Use numeric for exact decimal values like prices.', 'jsonb stores flexible JSON data, but normal columns are usually better for core fields.'] }
    ]
  },
  {
    slug: 'postgres-insert',
    title: 'INSERT Data',
    description: 'Add rows to PostgreSQL tables with INSERT, multiple values, and RETURNING.',
    level: 'beginner',
    section: 'Tables & Data',
    order: 8,
    minutes: 10,
    content: [
      { type: 'p', text: 'INSERT adds new rows to a table. You name the table, list the columns you want to fill, and provide values in the same order.' },
      { type: 'h2', text: 'Insert one row' },
      {
        type: 'code',
        title: 'Create a users table for practice',
        language: 'sql',
        code: `CREATE TABLE users (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT now()
);`
      },
      {
        type: 'code',
        title: 'Insert one user',
        language: 'sql',
        code: `INSERT INTO users (name, email)
VALUES ('Maya Chen', 'maya@example.com');`
      },
      { type: 'h2', text: 'Insert several rows' },
      { type: 'p', text: 'A single INSERT can add multiple rows. This is cleaner than repeating the same statement many times.' },
      {
        type: 'code',
        title: 'Insert multiple users',
        language: 'sql',
        code: `INSERT INTO users (name, email, is_active)
VALUES
  ('Omar Ali', 'omar@example.com', true),
  ('Ava Patel', 'ava@example.com', true),
  ('Noah Kim', 'noah@example.com', false);`
      },
      { type: 'h2', text: 'Return inserted data' },
      { type: 'p', text: 'PostgreSQL supports RETURNING, which shows values from the rows that were just inserted. This is especially useful for generated ids.' },
      {
        type: 'code',
        title: 'Use RETURNING',
        language: 'sql',
        code: `INSERT INTO users (name, email)
VALUES ('Lina Park', 'lina@example.com')
RETURNING id, name, email, created_at;`
      },
      { type: 'note', text: 'When a column has a DEFAULT value, you can leave it out of the INSERT column list and PostgreSQL will fill it automatically.' },
      { type: 'try', text: 'Create a courses table with title, price, and published. Insert three courses, then use RETURNING to display the generated id and title.' },
      { type: 'keypoints', items: ['INSERT adds rows to a table.', 'The column list and values must match in order.', 'One INSERT can add multiple rows.', 'RETURNING displays values from inserted rows.'] }
    ]
  },
  {
    slug: 'postgres-select',
    title: 'SELECT Queries',
    description: 'Read data from tables with SELECT, choose columns, and calculate simple values.',
    level: 'beginner',
    section: 'Tables & Data',
    order: 9,
    minutes: 10,
    content: [
      { type: 'p', text: 'SELECT reads data. It is the SQL command you will use most often because applications constantly need to display, search, and report on stored data.' },
      { type: 'h2', text: 'Select all columns' },
      { type: 'p', text: 'The star means every column. It is convenient while learning, but real applications often select only the columns they need.' },
      {
        type: 'code',
        title: 'Read all users',
        language: 'sql',
        code: `SELECT *
FROM users;`
      },
      { type: 'h2', text: 'Select specific columns' },
      {
        type: 'code',
        title: 'Choose columns',
        language: 'sql',
        code: `SELECT name, email
FROM users;`
      },
      { type: 'h2', text: 'Use expressions in SELECT' },
      { type: 'p', text: 'SELECT can return stored columns and calculated values. Calculations are useful for totals, labels, and formatted output.' },
      {
        type: 'code',
        title: 'Calculate order totals',
        language: 'sql',
        code: `CREATE TABLE order_items (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_name text NOT NULL,
  unit_price numeric(8, 2) NOT NULL,
  quantity integer NOT NULL
);

INSERT INTO order_items (product_name, unit_price, quantity)
VALUES
  ('Notebook', 8.50, 2),
  ('Pen pack', 4.25, 3);

SELECT
  product_name,
  unit_price,
  quantity,
  unit_price * quantity AS line_total
FROM order_items;`
      },
      { type: 'h2', text: 'SELECT without a table' },
      {
        type: 'code',
        title: 'Quick calculations',
        language: 'sql',
        code: `SELECT 10 * 3 AS subtotal;

SELECT now() AS current_time;`
      },
      { type: 'tip', text: 'Use clear column aliases with AS when a result is calculated or renamed for display.' },
      { type: 'try', text: 'Write a SELECT query that reads product_name, quantity, and a calculated line_total from order_items.' },
      { type: 'keypoints', items: ['SELECT reads data from tables.', 'SELECT * returns all columns.', 'Selecting specific columns keeps results focused.', 'SELECT can calculate values and name them with aliases.'] }
    ]
  },
  {
    slug: 'postgres-where',
    title: 'WHERE Filters',
    description: 'Use WHERE to return only rows that match a condition.',
    level: 'beginner',
    section: 'Querying',
    order: 10,
    minutes: 10,
    content: [
      { type: 'p', text: 'WHERE filters rows. Without WHERE, a SELECT query reads every row in the table. With WHERE, PostgreSQL returns only rows that match your condition.' },
      { type: 'h2', text: 'Basic comparisons' },
      {
        type: 'code',
        title: 'Filter courses',
        language: 'sql',
        code: `SELECT title, price
FROM courses
WHERE published = true;

SELECT title, price
FROM courses
WHERE price < 50.00;`
      },
      { type: 'h2', text: 'Text matching with LIKE and ILIKE' },
      { type: 'p', text: 'LIKE searches text patterns. ILIKE is PostgreSQLs case-insensitive version. The percent sign matches any number of characters.' },
      {
        type: 'code',
        title: 'Search course titles',
        language: 'sql',
        code: `SELECT title
FROM courses
WHERE title ILIKE '%sql%';`
      },
      { type: 'h2', text: 'Combine conditions' },
      { type: 'p', text: 'Use AND when both conditions must be true. Use OR when either condition can be true. Parentheses make complex filters easier to read.' },
      {
        type: 'code',
        title: 'AND and OR',
        language: 'sql',
        code: `SELECT title, price, published
FROM courses
WHERE published = true
  AND price <= 100.00;

SELECT name, email
FROM users
WHERE is_active = false
   OR email ILIKE '%example.org';`
      },
      { type: 'h2', text: 'Use IN for a list' },
      {
        type: 'code',
        title: 'Match several values',
        language: 'sql',
        code: `SELECT name, email
FROM users
WHERE email IN ('maya@example.com', 'omar@example.com');`
      },
      { type: 'warning', text: 'Be careful with UPDATE and DELETE statements. A missing WHERE clause can change or delete every row in a table.' },
      { type: 'try', text: 'Write a query that returns published courses with a price between 20 and 80. Then write another query that searches for users whose email contains example.' },
      { type: 'keypoints', items: ['WHERE filters rows by conditions.', 'Comparison operators include =, <, >, <=, and >=.', 'ILIKE is useful for case-insensitive text search in PostgreSQL.', 'AND, OR, and IN help build more useful filters.'] }
    ]
  },
  {
    slug: 'postgres-order-limit',
    title: 'ORDER BY, LIMIT & OFFSET',
    description: 'Sort query results and return smaller pages of data with ORDER BY, LIMIT, and OFFSET.',
    level: 'beginner',
    section: 'Querying',
    order: 11,
    minutes: 9,
    content: [
      { type: 'p', text: 'Database tables do not promise a natural row order. If you want results in a specific order, use ORDER BY. If you only want part of the result, use LIMIT and OFFSET.' },
      { type: 'h2', text: 'Sort with ORDER BY' },
      {
        type: 'code',
        title: 'Newest blog posts first',
        language: 'sql',
        code: `SELECT title, published_at
FROM blog_posts
WHERE published = true
ORDER BY published_at DESC;`
      },
      { type: 'p', text: 'ASC means ascending order, from low to high or old to new. DESC means descending order, from high to low or new to old.' },
      {
        type: 'code',
        title: 'Cheapest courses first',
        language: 'sql',
        code: `SELECT title, price
FROM courses
ORDER BY price ASC, title ASC;`
      },
      { type: 'h2', text: 'Limit the number of rows' },
      { type: 'p', text: 'LIMIT is useful for dashboards, previews, and safety while exploring a large table.' },
      {
        type: 'code',
        title: 'Top 5 orders',
        language: 'sql',
        code: `SELECT id, customer_email, total, ordered_at
FROM orders
ORDER BY ordered_at DESC
LIMIT 5;`
      },
      { type: 'h2', text: 'Skip rows with OFFSET' },
      { type: 'p', text: 'OFFSET skips a number of rows before returning results. It is commonly used for simple pagination examples.' },
      {
        type: 'code',
        title: 'Second page of results',
        language: 'sql',
        code: `SELECT title, price
FROM courses
ORDER BY title ASC
LIMIT 10 OFFSET 10;`
      },
      { type: 'tip', text: 'Always pair LIMIT with ORDER BY when order matters. Without ORDER BY, the first 10 rows are not guaranteed to be the same every time.' },
      { type: 'try', text: 'Write a query that returns the three most expensive courses. Then write a query that returns users 11 through 20 ordered by name.' },
      { type: 'keypoints', items: ['ORDER BY sorts query results.', 'ASC sorts low to high; DESC sorts high to low.', 'LIMIT controls how many rows are returned.', 'OFFSET skips rows and is useful for simple pagination.'] }
    ]
  },
  {
    slug: 'postgres-update-delete',
    title: 'UPDATE & DELETE',
    description: 'Change existing rows with UPDATE and remove rows with DELETE safely.',
    level: 'beginner',
    section: 'Querying',
    order: 12,
    minutes: 11,
    content: [
      { type: 'p', text: 'INSERT creates rows, SELECT reads rows, UPDATE changes rows, and DELETE removes rows. UPDATE and DELETE are powerful, so beginners should always think about the WHERE clause first.' },
      { type: 'h2', text: 'Update one or more rows' },
      {
        type: 'code',
        title: 'Change a user email',
        language: 'sql',
        code: `UPDATE users
SET email = 'maya.chen@example.com'
WHERE id = 1
RETURNING id, name, email;`
      },
      { type: 'p', text: 'RETURNING lets you see which rows were changed. This gives quick feedback and helps catch mistakes.' },
      {
        type: 'code',
        title: 'Mark old courses unpublished',
        language: 'sql',
        code: `UPDATE courses
SET published = false
WHERE price = 0
RETURNING id, title, published;`
      },
      { type: 'h2', text: 'Delete rows' },
      { type: 'p', text: 'DELETE removes rows that match the WHERE condition. It does not remove the table itself.' },
      {
        type: 'code',
        title: 'Delete inactive test users',
        language: 'sql',
        code: `DELETE FROM users
WHERE is_active = false
  AND email ILIKE '%test%'
RETURNING id, email;`
      },
      { type: 'h2', text: 'Preview before changing data' },
      { type: 'p', text: 'A safe habit is to write a SELECT with the same WHERE clause first. If SELECT shows the rows you expect, then run UPDATE or DELETE.' },
      {
        type: 'code',
        title: 'Preview first',
        language: 'sql',
        code: `SELECT id, email, is_active
FROM users
WHERE is_active = false
  AND email ILIKE '%test%';`
      },
      { type: 'warning', text: 'UPDATE users SET is_active = false; changes every user because there is no WHERE clause. DELETE FROM users; removes every user row.' },
      { type: 'try', text: 'Write a SELECT that finds one course by title. Then write an UPDATE that changes its price and returns the changed row.' },
      { type: 'keypoints', items: ['UPDATE changes existing rows.', 'DELETE removes rows from a table.', 'WHERE controls which rows are affected.', 'Preview with SELECT and use RETURNING when practicing.'] }
    ]
  },
  {
    slug: 'postgres-nulls',
    title: 'NULL Values',
    description: 'Understand what NULL means and how to query missing or unknown values correctly.',
    level: 'beginner',
    section: 'Querying',
    order: 13,
    minutes: 9,
    content: [
      { type: 'p', text: 'NULL means a value is missing, unknown, or not applicable. It is not the same as an empty string, zero, or false.' },
      { type: 'h2', text: 'Insert NULL values' },
      {
        type: 'code',
        title: 'Optional profile fields',
        language: 'sql',
        code: `CREATE TABLE profiles (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  display_name text NOT NULL,
  bio text,
  birthday date
);

INSERT INTO profiles (display_name, bio, birthday)
VALUES
  ('Maya', 'Learning SQL', '2001-05-14'),
  ('Omar', NULL, NULL);`
      },
      { type: 'h2', text: 'Use IS NULL' },
      { type: 'p', text: 'You cannot correctly compare NULL with =. Use IS NULL or IS NOT NULL instead.' },
      {
        type: 'code',
        title: 'Find missing values',
        language: 'sql',
        code: `SELECT display_name
FROM profiles
WHERE bio IS NULL;

SELECT display_name
FROM profiles
WHERE birthday IS NOT NULL;`
      },
      { type: 'h2', text: 'Replace NULL in results' },
      { type: 'p', text: 'COALESCE returns the first non-NULL value. It is useful for display values in reports.' },
      {
        type: 'code',
        title: 'Use COALESCE',
        language: 'sql',
        code: `SELECT
  display_name,
  COALESCE(bio, 'No bio yet') AS bio_text
FROM profiles;`
      },
      { type: 'h2', text: 'NULL in conditions' },
      { type: 'p', text: 'NULL represents unknown, so many comparisons involving NULL are also unknown. That is why WHERE birthday = NULL does not work as beginners expect.' },
      {
        type: 'code',
        title: 'Incorrect and correct NULL checks',
        language: 'sql',
        code: `-- Incorrect:
SELECT * FROM profiles WHERE birthday = NULL;

-- Correct:
SELECT * FROM profiles WHERE birthday IS NULL;`
      },
      { type: 'note', text: 'Use NOT NULL constraints for values your application must always have, such as a users email or a courses title.' },
      { type: 'try', text: 'Create a contacts table with an optional phone column. Insert one contact with a phone number and one with NULL, then query both groups.' },
      { type: 'keypoints', items: ['NULL means missing, unknown, or not applicable.', 'Use IS NULL and IS NOT NULL to check NULL values.', 'COALESCE can replace NULL for display.', 'NULL is not the same as zero, false, or an empty string.'] }
    ]
  },
  {
    slug: 'postgres-constraints',
    title: 'Constraints (NOT NULL, UNIQUE, CHECK)',
    description: 'Use constraints to protect table data from invalid or duplicate values.',
    level: 'beginner',
    section: 'Schema Rules',
    order: 14,
    minutes: 12,
    content: [
      { type: 'p', text: 'Constraints are rules stored in the database. They help keep data correct even if a user, script, or application makes a mistake.' },
      { type: 'h2', text: 'NOT NULL requires a value' },
      {
        type: 'code',
        title: 'Required columns',
        language: 'sql',
        code: `CREATE TABLE newsletter_subscribers (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL,
  subscribed_at timestamp NOT NULL DEFAULT now()
);`
      },
      { type: 'h2', text: 'UNIQUE prevents duplicates' },
      { type: 'p', text: 'A UNIQUE constraint makes sure no two rows have the same value in a column or group of columns.' },
      {
        type: 'code',
        title: 'Unique email addresses',
        language: 'sql',
        code: `CREATE TABLE accounts (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  username text NOT NULL UNIQUE
);`
      },
      { type: 'h2', text: 'CHECK validates a condition' },
      { type: 'p', text: 'A CHECK constraint allows only rows where the condition is true. Use it for simple rules such as positive prices or valid ratings.' },
      {
        type: 'code',
        title: 'Product rules',
        language: 'sql',
        code: `CREATE TABLE store_products (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  price numeric(8, 2) NOT NULL CHECK (price >= 0),
  rating integer CHECK (rating BETWEEN 1 AND 5)
);`
      },
      { type: 'h2', text: 'Table-level constraints' },
      {
        type: 'code',
        title: 'Unique pair of values',
        language: 'sql',
        code: `CREATE TABLE course_reviews (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id integer NOT NULL,
  reviewer_email text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  UNIQUE (course_id, reviewer_email)
);`
      },
      { type: 'tip', text: 'Put important rules in the database, not only in app code. Database constraints protect the data no matter where changes come from.' },
      { type: 'try', text: 'Create a coupons table with a unique code, a discount_percent that must be between 1 and 100, and an active boolean with a default of true.' },
      { type: 'keypoints', items: ['Constraints are database rules.', 'NOT NULL requires a value.', 'UNIQUE prevents duplicate values.', 'CHECK enforces simple conditions such as ranges and positive numbers.'] }
    ]
  },
  {
    slug: 'postgres-keys',
    title: 'Primary Keys & Foreign Keys',
    description: 'Connect tables safely with primary keys and foreign keys.',
    level: 'beginner',
    section: 'Schema Rules',
    order: 15,
    minutes: 13,
    content: [
      { type: 'p', text: 'Keys are how relational databases identify rows and connect tables. A primary key identifies one row in its own table. A foreign key points to a row in another table.' },
      { type: 'h2', text: 'Primary keys identify rows' },
      { type: 'p', text: 'Most beginner tables use an id column as the primary key. PostgreSQL can generate the id automatically.' },
      {
        type: 'code',
        title: 'Users with a primary key',
        language: 'sql',
        code: `CREATE TABLE app_users (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE
);`
      },
      { type: 'h2', text: 'Foreign keys connect tables' },
      { type: 'p', text: 'A foreign key makes sure a referenced row exists. For example, an enrollment should not point to a course that is not in the courses table.' },
      {
        type: 'code',
        title: 'Courses and enrollments',
        language: 'sql',
        code: `CREATE TABLE app_courses (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL
);

CREATE TABLE enrollments (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id integer NOT NULL REFERENCES app_users(id),
  course_id integer NOT NULL REFERENCES app_courses(id),
  enrolled_at timestamp NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);`
      },
      { type: 'h2', text: 'Insert related data' },
      {
        type: 'code',
        title: 'Insert parent rows before child rows',
        language: 'sql',
        code: `INSERT INTO app_users (name, email)
VALUES ('Maya Chen', 'maya@example.com')
RETURNING id;

INSERT INTO app_courses (title)
VALUES ('PostgreSQL Basics')
RETURNING id;

INSERT INTO enrollments (user_id, course_id)
VALUES (1, 1);`
      },
      { type: 'h2', text: 'Why keys matter' },
      { type: 'ul', items: ['They prevent duplicate or unclear row identity.', 'They keep relationships valid.', 'They make joins possible and reliable.', 'They help PostgreSQL enforce data integrity.'] },
      { type: 'note', text: 'The exact generated id values depend on your database. In real work, use the ids returned by INSERT ... RETURNING instead of assuming they start at 1.' },
      { type: 'try', text: 'Create authors and posts tables. Give authors a primary key and make posts.author_id reference authors(id).' },
      { type: 'keypoints', items: ['A primary key uniquely identifies a row.', 'A foreign key references a primary key in another table.', 'Insert referenced parent rows before child rows.', 'Keys are central to relational database design.'] }
    ]
  },
  {
    slug: 'postgres-joins',
    title: 'JOINs (INNER, LEFT, RIGHT)',
    description: 'Combine rows from related tables with INNER JOIN, LEFT JOIN, and RIGHT JOIN.',
    level: 'beginner',
    section: 'Relating Data',
    order: 16,
    minutes: 13,
    content: [
      { type: 'p', text: 'JOINs let you read data from more than one table in a single query. They are one of the most important SQL skills because normalized databases split related information into separate tables.' },
      { type: 'h2', text: 'INNER JOIN returns matching rows' },
      { type: 'p', text: 'INNER JOIN returns rows where both tables have a match. For enrollments, that means only rows with a matching user and matching course.' },
      {
        type: 'code',
        title: 'Users enrolled in courses',
        language: 'sql',
        code: `SELECT
  app_users.name,
  app_courses.title,
  enrollments.enrolled_at
FROM enrollments
INNER JOIN app_users
  ON enrollments.user_id = app_users.id
INNER JOIN app_courses
  ON enrollments.course_id = app_courses.id;`
      },
      { type: 'h2', text: 'LEFT JOIN keeps all rows from the left table' },
      { type: 'p', text: 'LEFT JOIN returns every row from the first table and matching rows from the second table. If there is no match, columns from the second table are NULL.' },
      {
        type: 'code',
        title: 'All users, even without enrollments',
        language: 'sql',
        code: `SELECT
  app_users.name,
  app_courses.title
FROM app_users
LEFT JOIN enrollments
  ON app_users.id = enrollments.user_id
LEFT JOIN app_courses
  ON enrollments.course_id = app_courses.id
ORDER BY app_users.name;`
      },
      { type: 'h2', text: 'RIGHT JOIN keeps all rows from the right table' },
      { type: 'p', text: 'RIGHT JOIN is like LEFT JOIN with the table order reversed. It is less common because many developers rewrite it as a LEFT JOIN for readability.' },
      {
        type: 'code',
        title: 'All courses, even without enrollments',
        language: 'sql',
        code: `SELECT
  app_users.name,
  app_courses.title
FROM enrollments
RIGHT JOIN app_courses
  ON enrollments.course_id = app_courses.id
LEFT JOIN app_users
  ON enrollments.user_id = app_users.id;`
      },
      { type: 'h2', text: 'Join condition matters' },
      { type: 'p', text: 'The ON clause tells PostgreSQL how rows are related. Most beginner joins compare a foreign key column to a primary key column.' },
      { type: 'tip', text: 'Start by writing the FROM table, then one JOIN at a time. Run the query after each join while learning.' },
      { type: 'try', text: 'Write a query that lists every blog post title with its author name. Then write a LEFT JOIN that lists every author, even authors with no posts.' },
      { type: 'keypoints', items: ['JOIN combines rows from related tables.', 'INNER JOIN returns matching rows only.', 'LEFT JOIN keeps all rows from the left table.', 'RIGHT JOIN keeps all rows from the right table, but LEFT JOIN is usually easier to read.'] }
    ]
  },
  {
    slug: 'postgres-aggregates',
    title: 'Aggregate Functions',
    description: 'Use COUNT, SUM, AVG, MIN, and MAX to summarize rows.',
    level: 'beginner',
    section: 'Relating Data',
    order: 17,
    minutes: 10,
    content: [
      { type: 'p', text: 'Aggregate functions summarize many rows into one result. They answer questions like how many orders exist, what the total revenue is, or what the average course price is.' },
      { type: 'h2', text: 'COUNT rows' },
      {
        type: 'code',
        title: 'Count users and active users',
        language: 'sql',
        code: `SELECT COUNT(*) AS total_users
FROM users;

SELECT COUNT(*) AS active_users
FROM users
WHERE is_active = true;`
      },
      { type: 'h2', text: 'SUM and AVG' },
      {
        type: 'code',
        title: 'Order revenue',
        language: 'sql',
        code: `SELECT
  SUM(total) AS total_revenue,
  AVG(total) AS average_order_total
FROM orders;`
      },
      { type: 'h2', text: 'MIN and MAX' },
      {
        type: 'code',
        title: 'Course price range',
        language: 'sql',
        code: `SELECT
  MIN(price) AS cheapest_course,
  MAX(price) AS most_expensive_course
FROM courses
WHERE published = true;`
      },
      { type: 'h2', text: 'Aggregates ignore NULL differently' },
      { type: 'p', text: 'COUNT(*) counts rows. COUNT(column) counts rows where that column is not NULL. SUM, AVG, MIN, and MAX ignore NULL values.' },
      {
        type: 'code',
        title: 'Count all rows versus known birthdays',
        language: 'sql',
        code: `SELECT
  COUNT(*) AS total_profiles,
  COUNT(birthday) AS profiles_with_birthday
FROM profiles;`
      },
      { type: 'note', text: 'Aggregate queries often become more useful when combined with GROUP BY, which is covered in the next lesson.' },
      { type: 'try', text: 'Write a query that counts all courses, counts published courses, and finds the average price of published courses.' },
      { type: 'keypoints', items: ['Aggregate functions summarize rows.', 'COUNT(*) counts rows.', 'SUM and AVG work with numeric values.', 'MIN and MAX find the smallest and largest values.'] }
    ]
  },
  {
    slug: 'postgres-group-by',
    title: 'GROUP BY & HAVING',
    description: 'Group rows into summary results and filter those groups with HAVING.',
    level: 'beginner',
    section: 'Relating Data',
    order: 18,
    minutes: 12,
    content: [
      { type: 'p', text: 'GROUP BY creates one summary row for each group. Instead of counting all orders together, you can count orders per customer or revenue per day.' },
      { type: 'h2', text: 'Group by one column' },
      {
        type: 'code',
        title: 'Orders per customer',
        language: 'sql',
        code: `SELECT
  customer_email,
  COUNT(*) AS order_count,
  SUM(total) AS total_spent
FROM orders
GROUP BY customer_email
ORDER BY total_spent DESC;`
      },
      { type: 'h2', text: 'Group joined data' },
      { type: 'p', text: 'GROUP BY is often used with joins. For example, you can count how many students are enrolled in each course.' },
      {
        type: 'code',
        title: 'Enrollments per course',
        language: 'sql',
        code: `SELECT
  app_courses.title,
  COUNT(enrollments.id) AS enrollment_count
FROM app_courses
LEFT JOIN enrollments
  ON app_courses.id = enrollments.course_id
GROUP BY app_courses.id, app_courses.title
ORDER BY enrollment_count DESC;`
      },
      { type: 'h2', text: 'HAVING filters groups' },
      { type: 'p', text: 'WHERE filters rows before grouping. HAVING filters groups after aggregates are calculated.' },
      {
        type: 'code',
        title: 'Customers with at least two orders',
        language: 'sql',
        code: `SELECT
  customer_email,
  COUNT(*) AS order_count
FROM orders
GROUP BY customer_email
HAVING COUNT(*) >= 2
ORDER BY order_count DESC;`
      },
      { type: 'h2', text: 'A common GROUP BY rule' },
      { type: 'p', text: 'In PostgreSQL, selected columns usually must be either grouped or aggregated. If you SELECT customer_email and COUNT(*), customer_email belongs in GROUP BY.' },
      {
        type: 'code',
        title: 'Grouped columns and aggregate columns',
        language: 'sql',
        code: `SELECT
  published,
  COUNT(*) AS course_count,
  AVG(price) AS average_price
FROM courses
GROUP BY published;`
      },
      { type: 'tip', text: 'Read a GROUP BY query as: choose rows, group them, calculate summaries, optionally filter groups with HAVING, then sort.' },
      { type: 'try', text: 'Write a query that groups blog posts by author_id and returns only authors with three or more posts.' },
      { type: 'keypoints', items: ['GROUP BY creates summary rows per group.', 'Aggregate functions calculate values inside each group.', 'WHERE filters rows before grouping.', 'HAVING filters groups after grouping.'] }
    ]
  },
  {
    slug: 'postgres-aliases',
    title: 'Column & Table Aliases',
    description: 'Use aliases to make query output and joins easier to read.',
    level: 'beginner',
    section: 'Relating Data',
    order: 19,
    minutes: 8,
    content: [
      { type: 'p', text: 'An alias is a temporary name used in one query. Column aliases make result headings clearer. Table aliases make joins shorter and easier to read.' },
      { type: 'h2', text: 'Column aliases' },
      {
        type: 'code',
        title: 'Rename output columns',
        language: 'sql',
        code: `SELECT
  title AS course_title,
  price AS course_price,
  price * 0.9 AS sale_price
FROM courses;`
      },
      { type: 'h2', text: 'Table aliases' },
      { type: 'p', text: 'A table alias is written after the table name. Once you create an alias, use the alias in the rest of that query.' },
      {
        type: 'code',
        title: 'Shorter join with aliases',
        language: 'sql',
        code: `SELECT
  u.name,
  c.title,
  e.enrolled_at
FROM enrollments AS e
INNER JOIN app_users AS u
  ON e.user_id = u.id
INNER JOIN app_courses AS c
  ON e.course_id = c.id;`
      },
      { type: 'h2', text: 'Aliases without AS' },
      { type: 'p', text: 'PostgreSQL allows aliases without AS in many places, but AS can make beginner queries easier to understand.' },
      {
        type: 'code',
        title: 'Both styles work',
        language: 'sql',
        code: `SELECT title AS name_from_as
FROM courses AS c;

SELECT title name_without_as
FROM courses c;`
      },
      { type: 'h2', text: 'When aliases help most' },
      { type: 'ul', items: ['When two tables have columns with the same name, such as id or created_at.', 'When a calculated column needs a readable heading.', 'When a query joins several tables.', 'When long table names make SQL hard to scan.'] },
      { type: 'note', text: 'Aliases do not rename the real table or column. They only affect the current query result.' },
      { type: 'try', text: 'Rewrite a join between users and enrollments using table aliases u and e. Give the selected date column the alias enrolled_date.' },
      { type: 'keypoints', items: ['Aliases are temporary names in a query.', 'Column aliases improve result headings.', 'Table aliases shorten joins.', 'AS is optional in some alias syntax, but it is clear for beginners.'] }
    ]
  },
  {
    slug: 'postgres-indexes-intro',
    title: 'Indexes Intro',
    description: 'Understand what indexes are, when they help, and how to create a simple PostgreSQL index.',
    level: 'beginner',
    section: 'Performance Basics',
    order: 20,
    minutes: 11,
    content: [
      { type: 'p', text: 'An index is a data structure PostgreSQL can use to find rows faster. A useful comparison is a book index: instead of reading every page, you look up a term and jump to the right pages.' },
      { type: 'h2', text: 'Why indexes help' },
      { type: 'p', text: 'Without an index, PostgreSQL may scan many rows to find matches. With a good index, PostgreSQL can often jump directly to matching values.' },
      {
        type: 'code',
        title: 'A query that may benefit from an index',
        language: 'sql',
        code: `SELECT id, name, email
FROM users
WHERE email = 'maya@example.com';`
      },
      {
        type: 'code',
        title: 'Create an index on email',
        language: 'sql',
        code: `CREATE INDEX users_email_idx
ON users (email);`
      },
      { type: 'h2', text: 'Unique constraints create indexes' },
      { type: 'p', text: 'When you create a primary key or unique constraint, PostgreSQL creates an index to enforce that rule.' },
      {
        type: 'code',
        title: 'Unique email also helps lookups',
        language: 'sql',
        code: `CREATE TABLE login_accounts (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL
);`
      },
      { type: 'h2', text: 'Indexes are not free' },
      { type: 'p', text: 'Indexes take storage space and must be updated when rows are inserted, updated, or deleted. A few well-chosen indexes are better than indexing every column.' },
      {
        type: 'code',
        title: 'Index a common foreign key',
        language: 'sql',
        code: `CREATE INDEX enrollments_user_id_idx
ON enrollments (user_id);`
      },
      { type: 'tip', text: 'Begin by indexing columns used often in WHERE filters, joins, and ORDER BY clauses. Measure later as your data grows.' },
      { type: 'try', text: 'Look at three queries you have written. Which columns appear in WHERE or JOIN conditions most often? Pick one candidate for an index.' },
      { type: 'keypoints', items: ['Indexes help PostgreSQL find rows faster.', 'Primary keys and unique constraints create indexes automatically.', 'Indexes cost storage and write performance.', 'Good beginner index candidates appear in frequent filters and joins.'] }
    ]
  },
  {
    slug: 'postgres-views',
    title: 'Views',
    description: 'Create views to save useful SELECT queries as reusable database objects.',
    level: 'beginner',
    section: 'Useful Structures',
    order: 21,
    minutes: 10,
    content: [
      { type: 'p', text: 'A view is a saved SELECT query that you can read like a table. Views are useful when a query is repeated often or when you want to present cleaner data to users or reports.' },
      { type: 'h2', text: 'Create a simple view' },
      {
        type: 'code',
        title: 'Published courses view',
        language: 'sql',
        code: `CREATE VIEW published_courses AS
SELECT
  id,
  title,
  price
FROM courses
WHERE published = true;`
      },
      {
        type: 'code',
        title: 'Query the view',
        language: 'sql',
        code: `SELECT *
FROM published_courses
ORDER BY title;`
      },
      { type: 'h2', text: 'Views can include joins' },
      { type: 'p', text: 'A view can hide join details behind a friendly name. This is helpful for reports and beginner-friendly query layers.' },
      {
        type: 'code',
        title: 'Enrollment summary view',
        language: 'sql',
        code: `CREATE VIEW enrollment_summary AS
SELECT
  u.name AS student_name,
  u.email AS student_email,
  c.title AS course_title,
  e.enrolled_at
FROM enrollments AS e
INNER JOIN app_users AS u
  ON e.user_id = u.id
INNER JOIN app_courses AS c
  ON e.course_id = c.id;`
      },
      { type: 'h2', text: 'Replace or drop a view' },
      {
        type: 'code',
        title: 'Manage views',
        language: 'sql',
        code: `CREATE OR REPLACE VIEW published_courses AS
SELECT id, title, price
FROM courses
WHERE published = true
  AND price >= 0;

DROP VIEW published_courses;`
      },
      { type: 'note', text: 'A normal view does not store a separate copy of the result. PostgreSQL runs the underlying query when you query the view.' },
      { type: 'try', text: 'Create a view named active_users that selects id, name, and email from users where is_active is true. Query it ordered by name.' },
      { type: 'keypoints', items: ['A view is a saved SELECT query.', 'You can query a view like a table.', 'Views can simplify repeated joins and filters.', 'CREATE OR REPLACE VIEW updates a view definition.'] }
    ]
  },
  {
    slug: 'postgres-schemas',
    title: 'Schemas',
    description: 'Use schemas to organize database objects inside a PostgreSQL database.',
    level: 'beginner',
    section: 'Useful Structures',
    order: 22,
    minutes: 10,
    content: [
      { type: 'p', text: 'In PostgreSQL, a schema is a namespace inside a database. It helps organize tables, views, and other objects. The default schema is named public.' },
      { type: 'h2', text: 'Why schemas exist' },
      { type: 'p', text: 'Schemas are useful when one database contains several groups of objects. For example, an app might keep application tables in app and reporting views in reporting.' },
      {
        type: 'code',
        title: 'Create schemas',
        language: 'sql',
        code: `CREATE SCHEMA app;
CREATE SCHEMA reporting;`
      },
      { type: 'h2', text: 'Create tables inside a schema' },
      {
        type: 'code',
        title: 'Schema-qualified table names',
        language: 'sql',
        code: `CREATE TABLE app.users (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text NOT NULL
);

CREATE TABLE app.posts (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author_id integer NOT NULL REFERENCES app.users(id),
  title text NOT NULL
);`
      },
      { type: 'h2', text: 'Refer to objects clearly' },
      { type: 'p', text: 'A schema-qualified name includes the schema and object name, such as app.users. This avoids confusion when two schemas contain objects with the same name.' },
      {
        type: 'code',
        title: 'Query a schema table',
        language: 'sql',
        code: `SELECT id, email, name
FROM app.users
ORDER BY name;`
      },
      { type: 'h2', text: 'The search path' },
      { type: 'p', text: 'PostgreSQL uses the search_path setting to decide where to look when you write an unqualified table name. Beginners can avoid surprises by using schema-qualified names when schemas matter.' },
      {
        type: 'code',
        title: 'View the search path',
        language: 'sql',
        code: `SHOW search_path;`
      },
      { type: 'tip', text: 'For small beginner projects, using the default public schema is fine. Learn schemas so larger databases feel less mysterious later.' },
      { type: 'try', text: 'Create a schema named learning, then create learning.notes with id, title, and body columns. Query it using the full schema-qualified name.' },
      { type: 'keypoints', items: ['A schema is a namespace inside a database.', 'public is the default schema.', 'Use schema.object names to be explicit.', 'Schemas help organize larger databases.'] }
    ]
  },
  {
    slug: 'postgres-roles',
    title: 'Users & Roles Basics',
    description: 'Learn how PostgreSQL roles represent users, permissions, and login access.',
    level: 'beginner',
    section: 'Access Basics',
    order: 23,
    minutes: 12,
    content: [
      { type: 'p', text: 'PostgreSQL uses roles for access control. A role can be a login user, a group of permissions, or both. Roles decide who can connect and what they can do.' },
      { type: 'h2', text: 'Create a login role' },
      { type: 'p', text: 'A role with LOGIN can connect to PostgreSQL. Creating roles usually requires an admin or superuser role.' },
      {
        type: 'code',
        title: 'Create a basic app user',
        language: 'sql',
        code: `CREATE ROLE course_app_user
WITH LOGIN
PASSWORD 'change-this-password';`
      },
      { type: 'h2', text: 'Grant database access' },
      {
        type: 'code',
        title: 'Allow a role to connect',
        language: 'sql',
        code: `GRANT CONNECT ON DATABASE course_app_dev
TO course_app_user;`
      },
      { type: 'h2', text: 'Grant schema and table permissions' },
      { type: 'p', text: 'Database access alone is not enough. A role also needs permission to use schemas and read or change tables.' },
      {
        type: 'code',
        title: 'Grant table permissions',
        language: 'sql',
        code: `GRANT USAGE ON SCHEMA public
TO course_app_user;

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO course_app_user;`
      },
      { type: 'h2', text: 'Read-only roles' },
      { type: 'p', text: 'Some people or tools only need to read data. A read-only role is safer than sharing a powerful owner account.' },
      {
        type: 'code',
        title: 'Create a read-only role',
        language: 'sql',
        code: `CREATE ROLE reporting_reader
WITH LOGIN
PASSWORD 'change-this-password-too';

GRANT CONNECT ON DATABASE course_app_dev
TO reporting_reader;

GRANT USAGE ON SCHEMA public
TO reporting_reader;

GRANT SELECT ON ALL TABLES IN SCHEMA public
TO reporting_reader;`
      },
      { type: 'warning', text: 'Do not use example passwords in real systems. Store real passwords securely and give each app or person only the permissions they need.' },
      { type: 'try', text: 'Describe two roles for a course app: one app role that can read and write, and one reporting role that can only read. Which permissions should each have?' },
      { type: 'keypoints', items: ['PostgreSQL roles control access.', 'A role with LOGIN can connect as a user.', 'GRANT gives permissions on databases, schemas, and tables.', 'Read-only roles reduce risk for reports and dashboards.'] }
    ]
  },
  {
    slug: 'postgres-backup-basics',
    title: 'Backup & Restore Basics',
    description: 'Learn beginner backup and restore commands with pg_dump, pg_restore, and psql.',
    level: 'beginner',
    section: 'Access Basics',
    order: 24,
    minutes: 11,
    content: [
      { type: 'p', text: 'Backups are copies of your database that can be restored if data is deleted, corrupted, or moved to another environment. Even beginner projects should learn the habit of backing up before risky changes.' },
      { type: 'h2', text: 'Create a plain SQL backup' },
      { type: 'p', text: 'pg_dump can export a database as SQL statements. A plain SQL file is easy to inspect and restore with psql.' },
      {
        type: 'code',
        title: 'Dump to a SQL file',
        language: 'bash',
        code: `pg_dump course_app_dev > course_app_dev.sql`
      },
      {
        type: 'code',
        title: 'Restore a plain SQL file',
        language: 'bash',
        code: `createdb course_app_restored
psql course_app_restored < course_app_dev.sql`
      },
      { type: 'h2', text: 'Create a custom-format backup' },
      { type: 'p', text: 'The custom format is PostgreSQL-specific and works with pg_restore. It is flexible for larger or more controlled restores.' },
      {
        type: 'code',
        title: 'Dump and restore custom format',
        language: 'bash',
        code: `pg_dump -Fc course_app_dev > course_app_dev.dump

createdb course_app_restored_custom
pg_restore -d course_app_restored_custom course_app_dev.dump`
      },
      { type: 'h2', text: 'Backup one table' },
      {
        type: 'code',
        title: 'Dump a single table',
        language: 'bash',
        code: `pg_dump -t users course_app_dev > users.sql`
      },
      { type: 'h2', text: 'Check before you trust a backup' },
      { type: 'p', text: 'A backup is only useful if it can be restored. Practice restoring to a new database and checking important tables.' },
      {
        type: 'code',
        title: 'Check restored data',
        language: 'sql',
        code: `SELECT COUNT(*) AS user_count
FROM users;`
      },
      { type: 'tip', text: 'Before running a dangerous UPDATE, DELETE, DROP TABLE, or migration on important data, make a backup and know where it was saved.' },
      { type: 'try', text: 'Create a backup of your practice database, restore it into a new database, connect to the restored database, and count one table.' },
      { type: 'keypoints', items: ['Backups protect you from data loss.', 'pg_dump creates PostgreSQL backups.', 'Plain SQL backups restore with psql.', 'Custom-format backups restore with pg_restore.'] }
    ]
  },
  {
    slug: 'postgres-sample-schema',
    title: 'Design a Sample Schema (Blog/Courses)',
    description: 'Put beginner PostgreSQL ideas together by designing a small schema for blog posts and courses.',
    level: 'beginner',
    section: 'Putting It Together',
    order: 25,
    minutes: 14,
    content: [
      { type: 'p', text: 'A schema design turns app ideas into tables, columns, constraints, and relationships. In this final beginner lesson, you will combine tables, data types, keys, constraints, joins, and indexes.' },
      { type: 'h2', text: 'Step 1: Identify the main nouns' },
      { type: 'p', text: 'For a learning site with articles and courses, useful nouns include users, blog posts, courses, lessons, and enrollments. Each major noun often becomes a table.' },
      {
        type: 'table',
        headers: ['Table', 'Purpose'],
        rows: [
          ['users', 'People who write posts or enroll in courses'],
          ['blog_posts', 'Articles published on the site'],
          ['courses', 'Paid or free learning products'],
          ['course_lessons', 'Lessons inside a course'],
          ['enrollments', 'Which users joined which courses']
        ]
      },
      { type: 'h2', text: 'Step 2: Create core tables' },
      {
        type: 'code',
        title: 'Users, blog posts, and courses',
        language: 'sql',
        code: `CREATE TABLE users (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE blog_posts (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author_id integer NOT NULL REFERENCES users(id),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  body text NOT NULL,
  published boolean NOT NULL DEFAULT false,
  published_at timestamp
);

CREATE TABLE courses (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  price numeric(8, 2) NOT NULL CHECK (price >= 0),
  published boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now()
);`
      },
      { type: 'h2', text: 'Step 3: Add related tables' },
      {
        type: 'code',
        title: 'Lessons and enrollments',
        language: 'sql',
        code: `CREATE TABLE course_lessons (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id integer NOT NULL REFERENCES courses(id),
  title text NOT NULL,
  lesson_order integer NOT NULL CHECK (lesson_order > 0),
  free_preview boolean NOT NULL DEFAULT false,
  UNIQUE (course_id, lesson_order)
);

CREATE TABLE enrollments (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id),
  course_id integer NOT NULL REFERENCES courses(id),
  enrolled_at timestamp NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);`
      },
      { type: 'h2', text: 'Step 4: Add helpful indexes' },
      {
        type: 'code',
        title: 'Indexes for common lookups',
        language: 'sql',
        code: `CREATE INDEX blog_posts_author_id_idx
ON blog_posts (author_id);

CREATE INDEX course_lessons_course_id_idx
ON course_lessons (course_id);

CREATE INDEX enrollments_user_id_idx
ON enrollments (user_id);

CREATE INDEX enrollments_course_id_idx
ON enrollments (course_id);`
      },
      { type: 'h2', text: 'Step 5: Query the design' },
      {
        type: 'code',
        title: 'Useful joins and summaries',
        language: 'sql',
        code: `SELECT
  blog_posts.title,
  users.name AS author_name,
  blog_posts.published_at
FROM blog_posts
INNER JOIN users
  ON blog_posts.author_id = users.id
WHERE blog_posts.published = true
ORDER BY blog_posts.published_at DESC;

SELECT
  courses.title,
  COUNT(enrollments.id) AS enrollment_count
FROM courses
LEFT JOIN enrollments
  ON courses.id = enrollments.course_id
GROUP BY courses.id, courses.title
ORDER BY enrollment_count DESC;`
      },
      { type: 'h2', text: 'Design checklist' },
      { type: 'ul', items: ['Does each table represent one clear thing?', 'Does every table have a primary key?', 'Are required fields marked NOT NULL?', 'Are duplicate-sensitive fields marked UNIQUE?', 'Do foreign keys protect relationships?', 'Are common lookup columns indexed?'] },
      { type: 'note', text: 'Schema design improves with practice. Start simple, protect important rules with constraints, and adjust when real queries show what the app needs.' },
      { type: 'try', text: 'Extend this schema with course_reviews. Include a rating from 1 to 5, a review body, user_id, course_id, and a rule that each user can review a course only once.' },
      { type: 'keypoints', items: ['Schema design maps app ideas to tables and relationships.', 'Primary keys, foreign keys, constraints, and indexes work together.', 'JOIN and GROUP BY queries test whether the design supports real questions.', 'A good beginner schema is clear, consistent, and protected by database rules.'] }
    ]
  }
];
