import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-mongodb',
    title: 'What is MongoDB?',
    description: 'Learn what MongoDB is, how it stores data as documents, and why developers use it for modern applications.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 9,
    content: [
      { type: 'p', text: 'MongoDB is a document database. Instead of storing data only in rows and columns, MongoDB stores records as flexible documents that look a lot like JavaScript objects.' },
      { type: 'p', text: 'A document can represent one real thing in your application, such as a user, course, product, order, or blog post. Related details can often live inside the same document, which makes many reads feel natural.' },
      { type: 'h2', text: 'Documents are the main idea' },
      { type: 'p', text: 'MongoDB documents are written in a format similar to JSON, but stored internally as BSON. BSON lets MongoDB support useful data types such as ObjectId, Date, and Decimal128.' },
      {
        type: 'code',
        title: 'A user document',
        language: 'javascript',
        code: `{
  _id: ObjectId("66a100000000000000000001"),
  name: "Maya Chen",
  email: "maya@example.com",
  enrolledCourses: ["mongodb-basics", "javascript-intro"],
  profile: {
    city: "Austin",
    learningGoal: "Build database-backed apps"
  },
  createdAt: ISODate("2026-07-25T10:00:00Z")
}`
      },
      { type: 'h2', text: 'Collections group documents' },
      { type: 'p', text: 'A collection is a group of documents. For example, an online learning app might have users, courses, lessons, and enrollments collections.' },
      {
        type: 'code',
        title: 'Common collection names',
        language: 'text',
        code: `Database: intellex

Collections:
- users
- courses
- posts
- products`
      },
      { type: 'h2', text: 'Why teams choose MongoDB' },
      { type: 'ul', items: ['Documents can match the shape of objects used in code.', 'Fields can vary when an application is still changing.', 'Nested data and arrays are built in.', 'Queries can read documents, filter by fields, and update specific values.', 'Indexes help MongoDB find data quickly as collections grow.'] },
      { type: 'note', text: 'MongoDB is not only for prototypes. It is used in small projects and large production systems, but beginners should first understand the document model clearly.' },
      { type: 'try', text: 'Think about a course website. Write one example document for a course with a title, level, tags array, and instructor object.' },
      { type: 'keypoints', items: ['MongoDB is a document database.', 'Records are stored as documents inside collections.', 'Documents look like JSON but are stored as BSON.', 'MongoDB is useful when your data naturally fits object-like structures.'] }
    ]
  },
  {
    slug: 'mongodb-vs-sql',
    title: 'MongoDB vs SQL Databases',
    description: 'Compare MongoDB with SQL databases so you understand documents, tables, joins, and flexible schemas.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 10,
    content: [
      { type: 'p', text: 'MongoDB and SQL databases can both store important application data. The biggest beginner difference is how they organize records.' },
      { type: 'p', text: 'SQL databases usually store data in tables with rows and columns. MongoDB stores data in collections of documents, where each document can contain nested objects and arrays.' },
      { type: 'h2', text: 'The simple comparison' },
      {
        type: 'table',
        headers: ['Idea', 'MongoDB', 'SQL database'],
        rows: [
          ['Record', 'Document', 'Row'],
          ['Group of records', 'Collection', 'Table'],
          ['Data shape', 'Flexible document structure', 'Defined columns'],
          ['Related data', 'Often embedded or referenced', 'Often joined with foreign keys'],
          ['Query language', 'MongoDB query syntax', 'SQL']
        ]
      },
      { type: 'h2', text: 'Same idea, different shape' },
      { type: 'p', text: 'A SQL table splits fields into columns. A MongoDB document can keep nested details together when that makes the application easier to read and update.' },
      {
        type: 'code',
        title: 'MongoDB course document',
        language: 'javascript',
        code: `{
  title: "MongoDB for Beginners",
  level: "beginner",
  instructor: {
    name: "Ari Patel",
    email: "ari@example.com"
  },
  tags: ["database", "nosql", "backend"]
}`
      },
      {
        type: 'code',
        title: 'SQL-style table view',
        language: 'text',
        code: `courses
----------------------------------------------------
id | title                  | level    | instructor_id
1  | MongoDB for Beginners  | beginner | 12

instructors
-------------------------------
id | name       | email
12 | Ari Patel  | ari@example.com`
      },
      { type: 'h2', text: 'When MongoDB feels natural' },
      { type: 'p', text: 'MongoDB can be a good fit when your data is document-shaped, changes over time, or is commonly read as a whole. Product catalogs, course records, user profiles, content documents, and event logs are common examples.' },
      { type: 'tip', text: 'MongoDB is not automatically better than SQL, and SQL is not automatically more serious than MongoDB. Good database choice depends on data shape, query needs, team experience, and operational requirements.' },
      { type: 'try', text: 'Choose one example app, such as a blog or shop. List two pieces of data that might be embedded in a MongoDB document and one relationship that might still be referenced separately.' },
      { type: 'keypoints', items: ['MongoDB stores documents in collections.', 'SQL databases store rows in tables.', 'MongoDB documents can contain nested objects and arrays.', 'Both database styles are useful; they organize data differently.'] }
    ]
  },
  {
    slug: 'mongodb-install',
    title: 'Install MongoDB & mongosh',
    description: 'Install MongoDB tools, understand the server and shell, and run your first local mongosh commands.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 12,
    content: [
      { type: 'p', text: 'To practice MongoDB locally, you usually need two pieces: the MongoDB server and mongosh. The server stores and manages data. mongosh is the interactive command-line shell used to run commands.' },
      { type: 'p', text: 'Install steps vary by operating system, so always check the official MongoDB documentation for your exact version. The commands below show the general shape of a beginner setup.' },
      { type: 'h2', text: 'Check whether mongosh is installed' },
      {
        type: 'code',
        title: 'Version check',
        language: 'bash',
        code: `mongosh --version`
      },
      { type: 'h2', text: 'Start a local shell session' },
      { type: 'p', text: 'If MongoDB is running on your computer with the default port, you can usually open mongosh with no extra arguments.' },
      {
        type: 'code',
        title: 'Open mongosh',
        language: 'bash',
        code: `mongosh`
      },
      {
        type: 'code',
        title: 'A first mongosh command',
        language: 'javascript',
        code: `db.runCommand({ ping: 1 })`
      },
      { type: 'h2', text: 'Create a practice database' },
      { type: 'p', text: 'MongoDB creates a database when you first store data in it. The use command switches the current database in mongosh.' },
      {
        type: 'code',
        title: 'Switch databases and insert a test document',
        language: 'javascript',
        code: `use intellex_practice

db.notes.insertOne({
  message: "MongoDB is ready",
  createdAt: new Date()
})`
      },
      { type: 'note', text: 'If mongosh opens but cannot connect, the MongoDB server may not be running. If you use Atlas, you will connect with an Atlas connection string instead of a local default connection.' },
      { type: 'try', text: 'Install mongosh, open it, run db.runCommand({ ping: 1 }), switch to intellex_practice, and insert one note document.' },
      { type: 'keypoints', items: ['mongosh is the MongoDB command-line shell.', 'The MongoDB server stores and manages databases.', 'use databaseName switches the current database.', 'A database is created when data is first written to it.'] }
    ]
  },
  {
    slug: 'mongodb-atlas-intro',
    title: 'MongoDB Atlas Intro (Optional Cloud)',
    description: 'Understand MongoDB Atlas, clusters, connection strings, and when a beginner might use the cloud option.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 10,
    content: [
      { type: 'p', text: 'MongoDB Atlas is MongoDB hosted in the cloud. Instead of installing and managing a server yourself, you create a cluster and connect to it over the internet.' },
      { type: 'p', text: 'Atlas is optional for this beginner path. You can learn the same MongoDB commands locally, but Atlas is useful when you want a managed database, backups, monitoring, and an easy path to deployment.' },
      { type: 'h2', text: 'Atlas vocabulary' },
      {
        type: 'table',
        headers: ['Term', 'Meaning'],
        rows: [
          ['Project', 'A workspace for MongoDB resources'],
          ['Cluster', 'The group of servers that stores your data'],
          ['Database user', 'A username and password allowed to connect'],
          ['Network access', 'Rules for which IP addresses may connect'],
          ['Connection string', 'The URL-like value used by tools and apps']
        ]
      },
      { type: 'h2', text: 'A connection string shape' },
      {
        type: 'code',
        title: 'Atlas URI example',
        language: 'text',
        code: `mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority`
      },
      { type: 'p', text: 'The connection string contains the host and options. You provide the username and password for a database user created in Atlas.' },
      {
        type: 'code',
        title: 'Connect with mongosh',
        language: 'bash',
        code: `mongosh "mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/"`
      },
      { type: 'h2', text: 'Atlas is still MongoDB' },
      { type: 'p', text: 'Once connected, the commands are the same beginner MongoDB commands: use, insertOne, find, updateOne, deleteOne, createIndex, and more.' },
      {
        type: 'code',
        title: 'Same commands after connecting',
        language: 'javascript',
        code: `use intellex_practice

db.users.insertOne({
  name: "Nora",
  email: "nora@example.com"
})`
      },
      { type: 'warning', text: 'Never paste real database passwords into public code, screenshots, or tutorials. Treat connection strings with credentials like secrets.' },
      { type: 'try', text: 'If you use Atlas, identify the project, cluster, database user, network access rule, and connection string. If you use local MongoDB, write a sentence explaining what Atlas would manage for you.' },
      { type: 'keypoints', items: ['Atlas is MongoDB hosted and managed in the cloud.', 'A cluster stores your MongoDB data.', 'mongosh can connect to Atlas with a connection string.', 'After connecting, beginner MongoDB commands work the same way.'] }
    ]
  },
  {
    slug: 'mongodb-databases-collections',
    title: 'Databases & Collections',
    description: 'Learn how MongoDB organizes data into databases and collections, and practice creating them by inserting documents.',
    level: 'beginner',
    section: 'Core Concepts',
    order: 5,
    minutes: 10,
    content: [
      { type: 'p', text: 'MongoDB organizes data in a simple hierarchy: a server has databases, each database has collections, and each collection has documents.' },
      { type: 'p', text: 'A database usually represents an application or a major area of work. Collections group similar documents, such as users, courses, products, or posts.' },
      { type: 'h2', text: 'Switch databases with use' },
      {
        type: 'code',
        title: 'Choose a database',
        language: 'javascript',
        code: `use intellex_school`
      },
      { type: 'p', text: 'The use command does not immediately create a database on disk. MongoDB creates it when you insert the first document.' },
      {
        type: 'code',
        title: 'Create a collection by inserting',
        language: 'javascript',
        code: `db.courses.insertOne({
  title: "MongoDB Basics",
  level: "beginner",
  published: true
})`
      },
      { type: 'h2', text: 'List what exists' },
      {
        type: 'code',
        title: 'Show databases and collections',
        language: 'javascript',
        code: `show dbs

use intellex_school

show collections`
      },
      { type: 'h2', text: 'Collection naming tips' },
      { type: 'ul', items: ['Use clear plural names like users, courses, posts, and products.', 'Keep one main kind of document per collection.', 'Avoid names that only make sense to one developer.', 'Prefer names that match the words your application already uses.'] },
      { type: 'tip', text: 'Beginners often create too many collections too early. Start with the main things your app stores, then split or redesign when query patterns become clearer.' },
      { type: 'try', text: 'Create a database named intellex_store. Insert one product into a products collection, then run show dbs and show collections.' },
      { type: 'keypoints', items: ['A MongoDB server contains databases.', 'A database contains collections.', 'A collection contains documents.', 'Databases and collections commonly appear after the first insert.'] }
    ]
  },
  {
    slug: 'mongodb-documents',
    title: 'Documents & BSON',
    description: 'Understand MongoDB documents, common BSON data types, ObjectId values, nested objects, and arrays.',
    level: 'beginner',
    section: 'Core Concepts',
    order: 6,
    minutes: 11,
    content: [
      { type: 'p', text: 'A MongoDB document is a set of field-value pairs. It is similar to a JSON object, but MongoDB stores it as BSON so it can support more data types and efficient storage.' },
      { type: 'p', text: 'Every document has an _id field. If you do not provide one, MongoDB creates an ObjectId automatically.' },
      { type: 'h2', text: 'A document can hold different kinds of values' },
      {
        type: 'code',
        title: 'BSON-friendly values in mongosh',
        language: 'javascript',
        code: `db.products.insertOne({
  name: "Mechanical Keyboard",
  price: 89.99,
  inStock: true,
  tags: ["electronics", "office"],
  dimensions: {
    widthCm: 36,
    depthCm: 14
  },
  addedAt: new Date()
})`
      },
      { type: 'h2', text: 'ObjectId values' },
      { type: 'p', text: 'ObjectId is a common MongoDB identifier type. It is compact, unique enough for distributed systems, and includes timestamp information.' },
      {
        type: 'code',
        title: 'Find the generated _id',
        language: 'javascript',
        code: `db.products.findOne(
  { name: "Mechanical Keyboard" },
  { _id: 1, name: 1 }
)`
      },
      { type: 'h2', text: 'JSON vs BSON' },
      {
        type: 'table',
        headers: ['Feature', 'JSON', 'BSON in MongoDB'],
        rows: [
          ['Main use', 'Text data format', 'Binary storage format'],
          ['Dates', 'Usually strings', 'Date type supported'],
          ['ObjectId', 'Not built in', 'Built in'],
          ['Used by beginners', 'For examples and APIs', 'Inside MongoDB storage and commands']
        ]
      },
      { type: 'note', text: 'When you write commands in mongosh, you can use JavaScript-like values such as new Date() and ObjectId(). MongoDB stores those values as BSON types.' },
      { type: 'try', text: 'Insert a product with a name, price, tags array, nested dimensions object, and addedAt date. Then query only its _id and name.' },
      { type: 'keypoints', items: ['MongoDB documents contain field-value pairs.', 'BSON is MongoDBs binary document format.', 'MongoDB creates _id automatically when needed.', 'Documents can include nested objects, arrays, dates, numbers, booleans, and strings.'] }
    ]
  },
  {
    slug: 'mongodb-insert',
    title: 'Insert Documents',
    description: 'Practice inserting one document, inserting many documents, and reading insert result objects in mongosh.',
    level: 'beginner',
    section: 'CRUD',
    order: 7,
    minutes: 10,
    content: [
      { type: 'p', text: 'CRUD means Create, Read, Update, and Delete. In MongoDB, inserting documents is the Create part of CRUD.' },
      { type: 'p', text: 'You can insert one document with insertOne or many documents with insertMany. MongoDB adds an _id value to each document if you do not provide one.' },
      { type: 'h2', text: 'Insert one document' },
      {
        type: 'code',
        title: 'Add one user',
        language: 'javascript',
        code: `use intellex_app

db.users.insertOne({
  name: "Maya Chen",
  email: "maya@example.com",
  role: "student",
  joinedAt: new Date()
})`
      },
      { type: 'p', text: 'The result includes acknowledged and insertedId. The insertedId is the _id MongoDB assigned or accepted.' },
      {
        type: 'code',
        title: 'Typical insertOne result',
        language: 'javascript',
        code: `{
  acknowledged: true,
  insertedId: ObjectId("66a100000000000000000010")
}`
      },
      { type: 'h2', text: 'Insert many documents' },
      {
        type: 'code',
        title: 'Add several courses',
        language: 'javascript',
        code: `db.courses.insertMany([
  {
    title: "MongoDB Basics",
    level: "beginner",
    lessons: 25
  },
  {
    title: "JavaScript Foundations",
    level: "beginner",
    lessons: 32
  },
  {
    title: "APIs with Node",
    level: "intermediate",
    lessons: 18
  }
])`
      },
      { type: 'h2', text: 'Insert clean documents' },
      { type: 'ul', items: ['Use clear field names.', 'Keep related data together when it is commonly read together.', 'Use consistent types for important fields.', 'Add dates such as createdAt when they help future queries.'] },
      { type: 'tip', text: 'insertMany is convenient for practice data. In real systems, a failed document can affect the insert depending on options, so learn result objects carefully as you advance.' },
      { type: 'try', text: 'Insert one user and three products into a practice database. Include a createdAt or addedAt date on each document.' },
      { type: 'keypoints', items: ['insertOne adds one document.', 'insertMany adds an array of documents.', 'MongoDB creates _id when the document does not include one.', 'Insert results confirm whether MongoDB acknowledged the write.'] }
    ]
  },
  {
    slug: 'mongodb-find',
    title: 'Find / Query Documents',
    description: 'Use find and findOne to read MongoDB documents with filters, pretty output, and basic query patterns.',
    level: 'beginner',
    section: 'CRUD',
    order: 8,
    minutes: 11,
    content: [
      { type: 'p', text: 'Reading data is the Read part of CRUD. In MongoDB, the most common beginner methods are find and findOne.' },
      { type: 'p', text: 'A query filter is a document that describes which documents should match. An empty filter matches everything in the collection.' },
      { type: 'h2', text: 'Find all documents' },
      {
        type: 'code',
        title: 'Read every course',
        language: 'javascript',
        code: `db.courses.find()`
      },
      { type: 'h2', text: 'Find matching documents' },
      {
        type: 'code',
        title: 'Find beginner courses',
        language: 'javascript',
        code: `db.courses.find({
  level: "beginner"
})`
      },
      {
        type: 'code',
        title: 'Find one user by email',
        language: 'javascript',
        code: `db.users.findOne({
  email: "maya@example.com"
})`
      },
      { type: 'h2', text: 'Pretty and focused output' },
      { type: 'p', text: 'mongosh usually formats documents nicely, but you may still see examples that use pretty. You can also combine find with filters and projections in later lessons.' },
      {
        type: 'code',
        title: 'Readable output',
        language: 'javascript',
        code: `db.products.find({
  inStock: true
}).pretty()`
      },
      { type: 'note', text: 'find returns a cursor, which is a way to iterate over matching documents. mongosh automatically displays a batch of results for beginner-friendly exploration.' },
      { type: 'try', text: 'Query your practice products collection. Find all products, find only products in stock, and find one product by exact name.' },
      { type: 'keypoints', items: ['find reads many matching documents.', 'findOne reads the first matching document.', 'An empty filter matches all documents.', 'A query filter is itself a MongoDB document.'] }
    ]
  },
  {
    slug: 'mongodb-query-operators',
    title: 'Query Operators',
    description: 'Learn common MongoDB query operators such as $gt, $in, $exists, and $regex with practical examples.',
    level: 'beginner',
    section: 'CRUD',
    order: 9,
    minutes: 12,
    content: [
      { type: 'p', text: 'Query operators make filters more powerful. Instead of matching only exact values, operators let you express comparisons, lists, patterns, and field checks.' },
      { type: 'p', text: 'MongoDB operators usually start with a dollar sign, such as $gt for greater than and $in for matching one value from a list.' },
      { type: 'h2', text: 'Comparison operators' },
      {
        type: 'code',
        title: 'Find products over a price',
        language: 'javascript',
        code: `db.products.find({
  price: { $gt: 50 }
})`
      },
      {
        type: 'code',
        title: 'Find courses with a lesson range',
        language: 'javascript',
        code: `db.courses.find({
  lessons: { $gte: 10, $lte: 30 }
})`
      },
      { type: 'h2', text: 'List and field operators' },
      {
        type: 'code',
        title: 'Match one of several levels',
        language: 'javascript',
        code: `db.courses.find({
  level: { $in: ["beginner", "intermediate"] }
})`
      },
      {
        type: 'code',
        title: 'Find documents with a field',
        language: 'javascript',
        code: `db.users.find({
  phoneNumber: { $exists: true }
})`
      },
      { type: 'h2', text: 'Text-like pattern matching' },
      {
        type: 'code',
        title: 'Find titles that start with MongoDB',
        language: 'javascript',
        code: `db.courses.find({
  title: { $regex: /^MongoDB/ }
})`
      },
      { type: 'tip', text: 'Use exact matches when you can. Pattern searches can be useful, but they need careful indexing and design when collections become large.' },
      { type: 'try', text: 'Write three queries: products under 100, courses with level in beginner or advanced, and users that have a profile field.' },
      { type: 'keypoints', items: ['$gt, $gte, $lt, and $lte compare values.', '$in checks whether a field equals one value from a list.', '$exists checks whether a field is present.', '$regex can match string patterns.'] }
    ]
  },
  {
    slug: 'mongodb-update',
    title: 'Update Documents',
    description: 'Use updateOne, updateMany, $set, $inc, and upsert to safely change MongoDB documents.',
    level: 'beginner',
    section: 'CRUD',
    order: 10,
    minutes: 12,
    content: [
      { type: 'p', text: 'Updating documents is the Update part of CRUD. In MongoDB, updates usually have two parts: a filter that chooses documents and an update document that describes the change.' },
      { type: 'p', text: 'The safest beginner pattern is to use update operators such as $set and $inc. These change specific fields without replacing the whole document.' },
      { type: 'h2', text: 'Update one document' },
      {
        type: 'code',
        title: 'Change a user role',
        language: 'javascript',
        code: `db.users.updateOne(
  { email: "maya@example.com" },
  {
    $set: {
      role: "mentor",
      updatedAt: new Date()
    }
  }
)`
      },
      { type: 'h2', text: 'Update many documents' },
      {
        type: 'code',
        title: 'Mark beginner courses as searchable',
        language: 'javascript',
        code: `db.courses.updateMany(
  { level: "beginner" },
  {
    $set: {
      searchable: true
    }
  }
)`
      },
      { type: 'h2', text: 'Increment numbers' },
      {
        type: 'code',
        title: 'Increase product stock',
        language: 'javascript',
        code: `db.products.updateOne(
  { name: "Mechanical Keyboard" },
  {
    $inc: {
      stock: 5
    }
  }
)`
      },
      { type: 'h2', text: 'Upsert when needed' },
      { type: 'p', text: 'An upsert updates a matching document or inserts a new document if no match exists. It is useful, but beginners should use it intentionally.' },
      {
        type: 'code',
        title: 'Update or insert a settings document',
        language: 'javascript',
        code: `db.settings.updateOne(
  { key: "siteTheme" },
  {
    $set: {
      value: "light",
      updatedAt: new Date()
    }
  },
  { upsert: true }
)`
      },
      { type: 'warning', text: 'Do not pass a replacement document by accident when you meant to use $set. Without update operators, MongoDB may replace the matched document shape.' },
      { type: 'try', text: 'Update one product price with $set, increase its stock with $inc, and update all beginner courses with a searchable field.' },
      { type: 'keypoints', items: ['updateOne changes the first matching document.', 'updateMany changes all matching documents.', '$set changes specific fields.', '$inc increases or decreases numeric fields.', 'upsert can create a document when no match exists.'] }
    ]
  },
  {
    slug: 'mongodb-delete',
    title: 'Delete Documents',
    description: 'Use deleteOne and deleteMany carefully, preview matches, and understand safe deletion habits.',
    level: 'beginner',
    section: 'CRUD',
    order: 11,
    minutes: 9,
    content: [
      { type: 'p', text: 'Deleting documents is the Delete part of CRUD. MongoDB provides deleteOne for one matching document and deleteMany for all matching documents.' },
      { type: 'p', text: 'Deletes are powerful and often permanent unless you have backups or a soft-delete design. Beginners should learn to preview before deleting.' },
      { type: 'h2', text: 'Preview the documents first' },
      {
        type: 'code',
        title: 'Check what will match',
        language: 'javascript',
        code: `db.products.find({
  discontinued: true
})`
      },
      { type: 'h2', text: 'Delete one document' },
      {
        type: 'code',
        title: 'Delete one product by name',
        language: 'javascript',
        code: `db.products.deleteOne({
  name: "Old USB Cable"
})`
      },
      { type: 'h2', text: 'Delete many documents' },
      {
        type: 'code',
        title: 'Delete discontinued products',
        language: 'javascript',
        code: `db.products.deleteMany({
  discontinued: true
})`
      },
      { type: 'h2', text: 'Soft delete option' },
      { type: 'p', text: 'Some applications do not physically remove records right away. Instead, they set a deletedAt date or active flag so data can be recovered or audited.' },
      {
        type: 'code',
        title: 'Mark a post as deleted',
        language: 'javascript',
        code: `db.posts.updateOne(
  { slug: "old-announcement" },
  {
    $set: {
      deletedAt: new Date()
    }
  }
)`
      },
      { type: 'tip', text: 'Before running deleteMany, run the same filter with find or countDocuments. This simple habit prevents many painful mistakes.' },
      { type: 'try', text: 'Insert three test products. Preview one by name, delete it with deleteOne, then use countDocuments to confirm the remaining count.' },
      { type: 'keypoints', items: ['deleteOne removes one matching document.', 'deleteMany removes all matching documents.', 'Always preview delete filters.', 'Soft deletes use fields such as deletedAt instead of immediate removal.'] }
    ]
  },
  {
    slug: 'mongodb-projection',
    title: 'Projection',
    description: 'Use projection to return only the fields you need and hide fields that should not be displayed.',
    level: 'beginner',
    section: 'Query Skills',
    order: 12,
    minutes: 9,
    content: [
      { type: 'p', text: 'Projection controls which fields MongoDB returns from a query. This keeps output focused and avoids reading fields you do not need.' },
      { type: 'p', text: 'In beginner examples, projection is often the second argument to find or findOne. A value of 1 includes a field, and a value of 0 excludes a field.' },
      { type: 'h2', text: 'Include selected fields' },
      {
        type: 'code',
        title: 'Show course titles and levels',
        language: 'javascript',
        code: `db.courses.find(
  { published: true },
  {
    title: 1,
    level: 1
  }
)`
      },
      { type: 'p', text: 'By default, MongoDB includes _id even when you include other fields. You can hide _id explicitly.' },
      {
        type: 'code',
        title: 'Hide _id',
        language: 'javascript',
        code: `db.courses.find(
  { published: true },
  {
    _id: 0,
    title: 1,
    level: 1
  }
)`
      },
      { type: 'h2', text: 'Exclude sensitive or noisy fields' },
      {
        type: 'code',
        title: 'Hide internal fields',
        language: 'javascript',
        code: `db.users.find(
  { role: "student" },
  {
    passwordHash: 0,
    internalNotes: 0
  }
)`
      },
      { type: 'h2', text: 'Use dot notation for nested fields' },
      {
        type: 'code',
        title: 'Show only city from profile',
        language: 'javascript',
        code: `db.users.find(
  {},
  {
    _id: 0,
    name: 1,
    "profile.city": 1
  }
)`
      },
      { type: 'note', text: 'Except for _id, avoid mixing include and exclude styles in the same projection. Choose the fields to include or the fields to exclude.' },
      { type: 'try', text: 'Query users and return only name, email, and profile.city. Then query products while hiding internalCost.' },
      { type: 'keypoints', items: ['Projection controls returned fields.', '1 includes a field and 0 excludes a field.', '_id is included by default unless hidden.', 'Dot notation can project nested fields.'] }
    ]
  },
  {
    slug: 'mongodb-sort-limit',
    title: 'Sort, Limit & Skip',
    description: 'Order query results, limit result size, and understand basic pagination with sort, limit, and skip.',
    level: 'beginner',
    section: 'Query Skills',
    order: 13,
    minutes: 10,
    content: [
      { type: 'p', text: 'MongoDB queries can be shaped after matching documents. sort changes the order, limit caps how many documents are returned, and skip moves past a number of results.' },
      { type: 'p', text: 'These tools are useful for recent posts, product listings, course catalogs, and simple admin screens.' },
      { type: 'h2', text: 'Sort results' },
      {
        type: 'code',
        title: 'Newest posts first',
        language: 'javascript',
        code: `db.posts.find({
  published: true
}).sort({
  publishedAt: -1
})`
      },
      { type: 'p', text: 'Use 1 for ascending order and -1 for descending order.' },
      {
        type: 'code',
        title: 'Products from lowest to highest price',
        language: 'javascript',
        code: `db.products.find({
  inStock: true
}).sort({
  price: 1
})`
      },
      { type: 'h2', text: 'Limit the number of results' },
      {
        type: 'code',
        title: 'Top five newest posts',
        language: 'javascript',
        code: `db.posts.find({
  published: true
})
  .sort({ publishedAt: -1 })
  .limit(5)`
      },
      { type: 'h2', text: 'Skip for simple pages' },
      {
        type: 'code',
        title: 'Second page with 10 items per page',
        language: 'javascript',
        code: `db.products.find({})
  .sort({ name: 1 })
  .skip(10)
  .limit(10)`
      },
      { type: 'tip', text: 'skip is fine for learning and small pages. For very large datasets, production apps often use range-based pagination with indexed fields.' },
      { type: 'try', text: 'Find the three cheapest in-stock products. Then find the five most recent published posts.' },
      { type: 'keypoints', items: ['sort orders query results.', '1 means ascending and -1 means descending.', 'limit controls how many documents are returned.', 'skip moves past documents, often for simple pagination.'] }
    ]
  },
  {
    slug: 'mongodb-comparison-logic',
    title: 'Comparison & Logical Operators',
    description: 'Combine comparison operators with $and, $or, $nor, and $not to build more expressive MongoDB queries.',
    level: 'beginner',
    section: 'Query Skills',
    order: 14,
    minutes: 12,
    content: [
      { type: 'p', text: 'Many real queries need more than one condition. MongoDB lets you combine comparisons and logical operators to describe exactly what should match.' },
      { type: 'p', text: 'When multiple fields appear in the same filter document, MongoDB treats them like an AND condition by default.' },
      { type: 'h2', text: 'Implicit AND' },
      {
        type: 'code',
        title: 'Beginner courses with enough lessons',
        language: 'javascript',
        code: `db.courses.find({
  level: "beginner",
  lessons: { $gte: 10 },
  published: true
})`
      },
      { type: 'h2', text: 'Use $or for alternatives' },
      {
        type: 'code',
        title: 'Products on sale or low cost',
        language: 'javascript',
        code: `db.products.find({
  $or: [
    { onSale: true },
    { price: { $lt: 25 } }
  ]
})`
      },
      { type: 'h2', text: 'Use $and when you need explicit grouping' },
      {
        type: 'code',
        title: 'Published courses in selected levels',
        language: 'javascript',
        code: `db.courses.find({
  $and: [
    { published: true },
    { level: { $in: ["beginner", "intermediate"] } },
    { lessons: { $lte: 40 } }
  ]
})`
      },
      { type: 'h2', text: 'Negation operators' },
      {
        type: 'code',
        title: 'Users who are not guests',
        language: 'javascript',
        code: `db.users.find({
  role: { $ne: "guest" }
})`
      },
      {
        type: 'code',
        title: 'Products not matching a condition',
        language: 'javascript',
        code: `db.products.find({
  price: { $not: { $gt: 100 } }
})`
      },
      { type: 'note', text: 'A clear query is better than a clever query. If a filter becomes hard to read, format it over multiple lines and test each condition separately.' },
      { type: 'try', text: 'Write a query for published beginner or intermediate courses with at least 12 lessons. Then write one for products that are in stock and either on sale or under 50.' },
      { type: 'keypoints', items: ['Multiple field conditions are an implicit AND.', '$or matches when at least one condition is true.', '$and is useful for explicit grouping.', '$ne and $not express negative conditions.'] }
    ]
  },
  {
    slug: 'mongodb-arrays',
    title: 'Working with Arrays',
    description: 'Store arrays in documents, query array values, and update arrays with $push, $addToSet, and $pull.',
    level: 'beginner',
    section: 'Document Shapes',
    order: 15,
    minutes: 12,
    content: [
      { type: 'p', text: 'Arrays are one of MongoDBs most useful document features. A field can hold a list of values, such as tags, enrolled course slugs, product colors, or post comments.' },
      { type: 'p', text: 'MongoDB can query array fields directly and can update arrays without rewriting the whole document.' },
      { type: 'h2', text: 'Store arrays in documents' },
      {
        type: 'code',
        title: 'Course with tags',
        language: 'javascript',
        code: `db.courses.insertOne({
  title: "MongoDB Basics",
  tags: ["database", "nosql", "beginner"],
  prerequisites: []
})`
      },
      { type: 'h2', text: 'Query array values' },
      {
        type: 'code',
        title: 'Find courses tagged database',
        language: 'javascript',
        code: `db.courses.find({
  tags: "database"
})`
      },
      {
        type: 'code',
        title: 'Require multiple tags',
        language: 'javascript',
        code: `db.courses.find({
  tags: { $all: ["database", "beginner"] }
})`
      },
      { type: 'h2', text: 'Update arrays' },
      {
        type: 'code',
        title: 'Add one tag',
        language: 'javascript',
        code: `db.courses.updateOne(
  { title: "MongoDB Basics" },
  { $push: { tags: "backend" } }
)`
      },
      {
        type: 'code',
        title: 'Add only if missing and remove a value',
        language: 'javascript',
        code: `db.courses.updateOne(
  { title: "MongoDB Basics" },
  { $addToSet: { tags: "database" } }
)

db.courses.updateOne(
  { title: "MongoDB Basics" },
  { $pull: { tags: "nosql" } }
)`
      },
      { type: 'tip', text: 'Use $addToSet when duplicates would be confusing. Use $push when repeated values or ordered entries are acceptable.' },
      { type: 'try', text: 'Create a post with tags. Query by one tag, add a new tag with $addToSet, and remove an old tag with $pull.' },
      { type: 'keypoints', items: ['MongoDB documents can store arrays.', 'Querying { tags: "value" } matches documents whose tags array contains that value.', '$all requires multiple array values.', '$push, $addToSet, and $pull update arrays.'] }
    ]
  },
  {
    slug: 'mongodb-embedded-docs',
    title: 'Embedded Documents',
    description: 'Use nested objects inside MongoDB documents and query embedded fields with dot notation.',
    level: 'beginner',
    section: 'Document Shapes',
    order: 16,
    minutes: 11,
    content: [
      { type: 'p', text: 'An embedded document is an object stored inside another document. This is useful when data belongs closely to its parent and is often read with it.' },
      { type: 'p', text: 'User profiles, product dimensions, course instructor snapshots, shipping addresses, and post metadata are common beginner examples.' },
      { type: 'h2', text: 'Embed related details' },
      {
        type: 'code',
        title: 'Product with embedded details',
        language: 'javascript',
        code: `db.products.insertOne({
  name: "Travel Backpack",
  price: 64.99,
  dimensions: {
    heightCm: 48,
    widthCm: 32,
    depthCm: 18
  },
  supplier: {
    name: "Northwind Gear",
    country: "Canada"
  }
})`
      },
      { type: 'h2', text: 'Query nested fields with dot notation' },
      {
        type: 'code',
        title: 'Find products from a supplier country',
        language: 'javascript',
        code: `db.products.find({
  "supplier.country": "Canada"
})`
      },
      {
        type: 'code',
        title: 'Find products by nested size',
        language: 'javascript',
        code: `db.products.find({
  "dimensions.heightCm": { $lte: 50 }
})`
      },
      { type: 'h2', text: 'Update nested fields' },
      {
        type: 'code',
        title: 'Change one embedded field',
        language: 'javascript',
        code: `db.products.updateOne(
  { name: "Travel Backpack" },
  {
    $set: {
      "supplier.country": "United States"
    }
  }
)`
      },
      { type: 'h2', text: 'When embedding works well' },
      { type: 'ul', items: ['The embedded data is usually read with the parent document.', 'The embedded data does not grow without limit.', 'The embedded data is owned by the parent document.', 'You do not need to query the embedded data as a major independent resource.'] },
      { type: 'note', text: 'MongoDB has a maximum document size, so avoid embedding arrays or objects that could grow forever, such as unlimited activity logs on a user document.' },
      { type: 'try', text: 'Create a user with an embedded profile object containing city and learningGoal. Query users by profile.city and update profile.learningGoal.' },
      { type: 'keypoints', items: ['Embedded documents are nested objects.', 'Dot notation queries nested fields.', 'Dot notation can update nested fields with $set.', 'Embedding works best for bounded data that belongs to the parent.'] }
    ]
  },
  {
    slug: 'mongodb-schema-flexibility',
    title: 'Flexible Schema Reality',
    description: 'Understand MongoDB flexible schemas, why consistency still matters, and how to evolve documents safely.',
    level: 'beginner',
    section: 'Document Shapes',
    order: 17,
    minutes: 11,
    content: [
      { type: 'p', text: 'MongoDB has a flexible schema. Documents in the same collection do not have to contain exactly the same fields.' },
      { type: 'p', text: 'This flexibility is helpful, especially while an application is changing. But flexible does not mean random. Real applications still need consistent field names, types, and expectations.' },
      { type: 'h2', text: 'Documents may differ' },
      {
        type: 'code',
        title: 'Two users with different optional fields',
        language: 'javascript',
        code: `db.users.insertMany([
  {
    name: "Maya",
    email: "maya@example.com",
    role: "student"
  },
  {
    name: "Ari",
    email: "ari@example.com",
    role: "mentor",
    profile: {
      city: "Denver",
      specialties: ["databases", "backend"]
    }
  }
])`
      },
      { type: 'h2', text: 'Consistency still matters' },
      { type: 'p', text: 'If one document uses email, another uses emailAddress, and another uses contact.email, queries become harder. Indexes and validation also become less clear.' },
      {
        type: 'code',
        title: 'A consistent shape is easier to query',
        language: 'javascript',
        code: `db.users.find({
  email: "maya@example.com"
})`
      },
      { type: 'h2', text: 'Evolve documents intentionally' },
      { type: 'p', text: 'When you add a new field, decide whether old documents need a default value. Sometimes your queries can handle missing fields. Sometimes you update existing documents.' },
      {
        type: 'code',
        title: 'Add a default field to older users',
        language: 'javascript',
        code: `db.users.updateMany(
  { emailVerified: { $exists: false } },
  {
    $set: {
      emailVerified: false
    }
  }
)`
      },
      { type: 'tip', text: 'A good MongoDB schema is flexible at the edges and consistent at the core. Keep important fields predictable.' },
      { type: 'try', text: 'Design a user document with three required fields and two optional fields. Then write a query that finds documents missing one optional field.' },
      { type: 'keypoints', items: ['MongoDB collections can contain documents with different fields.', 'Flexible schemas still need thoughtful consistency.', 'Important fields should use predictable names and types.', '$exists helps find documents with missing or present fields.'] }
    ]
  },
  {
    slug: 'mongodb-indexes-intro',
    title: 'Indexes Intro',
    description: 'Learn what indexes are, why they improve query performance, and how to create a basic MongoDB index.',
    level: 'beginner',
    section: 'Performance Basics',
    order: 18,
    minutes: 12,
    content: [
      { type: 'p', text: 'An index helps MongoDB find documents faster. Without a useful index, MongoDB may need to scan many documents to answer a query.' },
      { type: 'p', text: 'A helpful beginner analogy is a book index. Instead of reading every page to find a topic, you use the index to jump to the right pages.' },
      { type: 'h2', text: 'Create a simple index' },
      {
        type: 'code',
        title: 'Index user email',
        language: 'javascript',
        code: `db.users.createIndex({
  email: 1
})`
      },
      { type: 'p', text: 'The 1 means ascending index order. For many equality queries, the most important part is that the field is indexed.' },
      {
        type: 'code',
        title: 'Query that can use the email index',
        language: 'javascript',
        code: `db.users.find({
  email: "maya@example.com"
})`
      },
      { type: 'h2', text: 'Compound indexes' },
      { type: 'p', text: 'A compound index includes more than one field. It can help queries that filter or sort by those fields in a compatible order.' },
      {
        type: 'code',
        title: 'Index published posts by date',
        language: 'javascript',
        code: `db.posts.createIndex({
  published: 1,
  publishedAt: -1
})`
      },
      { type: 'h2', text: 'View indexes' },
      {
        type: 'code',
        title: 'List collection indexes',
        language: 'javascript',
        code: `db.users.getIndexes()`
      },
      { type: 'note', text: 'Indexes speed up reads but add work to writes because MongoDB must update the index when indexed fields change. Create indexes for real query patterns, not every field.' },
      { type: 'try', text: 'Create an index on products.name, then query for one product by name. List the indexes on the products collection.' },
      { type: 'keypoints', items: ['Indexes help MongoDB find matching documents faster.', 'createIndex creates an index on one or more fields.', 'getIndexes lists indexes on a collection.', 'Indexes improve reads but have storage and write costs.'] }
    ]
  },
  {
    slug: 'mongodb-unique-indexes',
    title: 'Unique Indexes',
    description: 'Use unique indexes to prevent duplicate values such as duplicate emails, usernames, or course slugs.',
    level: 'beginner',
    section: 'Performance Basics',
    order: 19,
    minutes: 10,
    content: [
      { type: 'p', text: 'A unique index prevents two documents from having the same indexed value. This is one way MongoDB can enforce important data rules.' },
      { type: 'p', text: 'Unique indexes are common for user emails, usernames, product SKUs, course slugs, and other values that identify one record.' },
      { type: 'h2', text: 'Create a unique index' },
      {
        type: 'code',
        title: 'Unique user email',
        language: 'javascript',
        code: `db.users.createIndex(
  { email: 1 },
  { unique: true }
)`
      },
      { type: 'h2', text: 'Duplicate inserts fail' },
      {
        type: 'code',
        title: 'This second insert would fail if email already exists',
        language: 'javascript',
        code: `db.users.insertOne({
  name: "Another Maya",
  email: "maya@example.com",
  role: "student"
})`
      },
      { type: 'h2', text: 'Unique slugs' },
      { type: 'p', text: 'A slug is a URL-friendly identifier such as mongodb-basics. It is often useful for courses, posts, and product categories.' },
      {
        type: 'code',
        title: 'Unique course slug',
        language: 'javascript',
        code: `db.courses.createIndex(
  { slug: 1 },
  { unique: true }
)`
      },
      { type: 'h2', text: 'Check existing data first' },
      { type: 'p', text: 'MongoDB cannot create a unique index if existing documents already contain duplicates for that indexed key.' },
      {
        type: 'code',
        title: 'Find duplicate-looking emails with aggregation',
        language: 'javascript',
        code: `db.users.aggregate([
  {
    $group: {
      _id: "$email",
      count: { $sum: 1 }
    }
  },
  {
    $match: {
      count: { $gt: 1 }
    }
  }
])`
      },
      { type: 'tip', text: 'Create unique indexes early for fields that must be unique. It is easier to prevent duplicates than to clean them later.' },
      { type: 'try', text: 'Create a unique index on courses.slug. Insert one course with a slug, then try inserting another course with the same slug in a safe practice collection.' },
      { type: 'keypoints', items: ['Unique indexes prevent duplicate indexed values.', 'Emails, usernames, SKUs, and slugs are common unique fields.', 'Existing duplicates must be fixed before creating a unique index.', 'Unique indexes support data correctness as well as lookup speed.'] }
    ]
  },
  {
    slug: 'mongodb-data-modeling-intro',
    title: 'Data Modeling Intro',
    description: 'Learn the beginner mindset for modeling MongoDB data around documents, queries, and application access patterns.',
    level: 'beginner',
    section: 'Design Basics',
    order: 20,
    minutes: 12,
    content: [
      { type: 'p', text: 'Data modeling means deciding how your application data should be shaped and connected. In MongoDB, good modeling starts with documents and how the application reads and writes them.' },
      { type: 'p', text: 'Instead of first drawing many tables, ask what each screen, API route, or report needs to read. MongoDB models are often designed around access patterns.' },
      { type: 'h2', text: 'Start with the main nouns' },
      { type: 'p', text: 'For a learning platform, the main nouns might be users, courses, lessons, enrollments, and progress records.' },
      {
        type: 'code',
        title: 'Possible collections',
        language: 'text',
        code: `intellex_learning

collections:
- users
- courses
- enrollments
- progress`
      },
      { type: 'h2', text: 'Design around reads' },
      { type: 'p', text: 'If a course page always displays title, level, tags, instructor name, and lesson summaries, those fields might live together in a course document.' },
      {
        type: 'code',
        title: 'Course document designed for a course page',
        language: 'javascript',
        code: `{
  slug: "mongodb-basics",
  title: "MongoDB Basics",
  level: "beginner",
  tags: ["database", "backend"],
  instructor: {
    name: "Ari Patel"
  },
  lessons: [
    { number: 1, title: "What is MongoDB?", minutes: 9 },
    { number: 2, title: "Documents & BSON", minutes: 11 }
  ]
}`
      },
      { type: 'h2', text: 'Ask modeling questions' },
      { type: 'ul', items: ['What data is read together?', 'What data changes together?', 'Could any array grow too large?', 'Do I need to query this item independently?', 'What fields need indexes or uniqueness?'] },
      {
        type: 'code',
        title: 'Index suggested by an access pattern',
        language: 'javascript',
        code: `db.courses.createIndex({
  level: 1,
  published: 1
})`
      },
      { type: 'note', text: 'MongoDB data modeling is practical. The best design depends on the questions your application asks most often.' },
      { type: 'try', text: 'Choose a blog, store, or course app. List its main collections and write one sentence describing the most common query for each collection.' },
      { type: 'keypoints', items: ['Data modeling decides document shapes and relationships.', 'MongoDB models are often based on access patterns.', 'Data read together may be stored together.', 'Good models consider growth, updates, indexes, and uniqueness.'] }
    ]
  },
  {
    slug: 'mongodb-references',
    title: 'References vs Embedding',
    description: 'Learn when to embed related data in one document and when to reference documents across collections.',
    level: 'beginner',
    section: 'Design Basics',
    order: 21,
    minutes: 13,
    content: [
      { type: 'p', text: 'MongoDB gives you two common ways to represent relationships: embed data inside a document or store a reference to another document.' },
      { type: 'p', text: 'Embedding can make reads simple when related data is used together. References can be better when related data is large, shared, or changes independently.' },
      { type: 'h2', text: 'Embedding example' },
      {
        type: 'code',
        title: 'Post with embedded comments',
        language: 'javascript',
        code: `db.posts.insertOne({
  slug: "learning-mongodb",
  title: "Learning MongoDB",
  body: "Documents make data feel natural.",
  comments: [
    {
      authorName: "Maya",
      text: "This helped!",
      createdAt: new Date()
    }
  ]
})`
      },
      { type: 'p', text: 'This can work when comments are limited or when the app usually displays the post with recent comments.' },
      { type: 'h2', text: 'Reference example' },
      {
        type: 'code',
        title: 'Enrollment references user and course',
        language: 'javascript',
        code: `db.enrollments.insertOne({
  userId: ObjectId("66a100000000000000000101"),
  courseId: ObjectId("66a100000000000000000202"),
  enrolledAt: new Date(),
  status: "active"
})`
      },
      { type: 'p', text: 'This keeps users and courses independent. The enrollment connects them without copying the full user and full course into one document.' },
      { type: 'h2', text: 'A practical decision guide' },
      {
        type: 'table',
        headers: ['Choose embedding when', 'Choose references when'],
        rows: [
          ['Data is read together often', 'Data is queried independently often'],
          ['Child data is bounded in size', 'Child data can grow very large'],
          ['Child data belongs to one parent', 'Data is shared by many parents'],
          ['Small duplication is acceptable', 'Duplication would become hard to update']
        ]
      },
      {
        type: 'code',
        title: 'Query references by id',
        language: 'javascript',
        code: `db.enrollments.find({
  userId: ObjectId("66a100000000000000000101")
})`
      },
      { type: 'tip', text: 'Do not make every relationship a reference just because SQL would use a foreign key. In MongoDB, model for the way documents are actually used.' },
      { type: 'try', text: 'For a course app, decide whether lesson summaries should be embedded in courses or referenced from a lessons collection. Explain your choice.' },
      { type: 'keypoints', items: ['Embedding stores related data inside one document.', 'References store ids that point to other documents.', 'Embedding is good for bounded data read with the parent.', 'References are good for large, shared, or independently queried data.'] }
    ]
  },
  {
    slug: 'mongodb-validation-intro',
    title: 'Schema Validation Intro',
    description: 'Add beginner-friendly MongoDB schema validation rules with $jsonSchema to protect important document shapes.',
    level: 'beginner',
    section: 'Design Basics',
    order: 22,
    minutes: 12,
    content: [
      { type: 'p', text: 'MongoDB has a flexible schema, but you can still add validation rules. Schema validation helps reject documents that are missing required fields or use wrong data types.' },
      { type: 'p', text: 'Validation is useful for important collections where the application depends on predictable fields, such as users, courses, products, and orders.' },
      { type: 'h2', text: 'Create a collection with validation' },
      {
        type: 'code',
        title: 'Validate course documents',
        language: 'javascript',
        code: `db.createCollection("validatedCourses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "slug", "level"],
      properties: {
        title: {
          bsonType: "string"
        },
        slug: {
          bsonType: "string"
        },
        level: {
          enum: ["beginner", "intermediate", "advanced"]
        },
        lessons: {
          bsonType: "number",
          minimum: 1
        }
      }
    }
  }
})`
      },
      { type: 'h2', text: 'A valid insert' },
      {
        type: 'code',
        title: 'Valid course',
        language: 'javascript',
        code: `db.validatedCourses.insertOne({
  title: "MongoDB Basics",
  slug: "mongodb-basics",
  level: "beginner",
  lessons: 25
})`
      },
      { type: 'h2', text: 'An invalid insert' },
      {
        type: 'code',
        title: 'Missing required level',
        language: 'javascript',
        code: `db.validatedCourses.insertOne({
  title: "Broken Course",
  slug: "broken-course"
})`
      },
      { type: 'p', text: 'The invalid insert fails because level is required. Validation catches the problem at the database boundary.' },
      { type: 'h2', text: 'Validation as JSON shape' },
      {
        type: 'code',
        title: 'Core validator idea',
        language: 'json',
        code: `{
  "$jsonSchema": {
    "bsonType": "object",
    "required": ["title", "slug", "level"]
  }
}`
      },
      { type: 'note', text: 'Validation does not replace thoughtful application code, but it adds an important safety net for data that must follow rules.' },
      { type: 'try', text: 'Create a validatedProducts collection that requires name, sku, and price. Allow price to be a number and inStock to be a boolean.' },
      { type: 'keypoints', items: ['MongoDB supports schema validation.', '$jsonSchema can require fields and types.', 'Validation helps keep important collections consistent.', 'Invalid inserts or updates can be rejected by MongoDB.'] }
    ]
  },
  {
    slug: 'mongodb-backup-basics',
    title: 'Backup & Restore Basics',
    description: 'Learn beginner backup and restore ideas with mongodump, mongorestore, mongoexport, and mongoimport.',
    level: 'beginner',
    section: 'Ops Basics',
    order: 23,
    minutes: 11,
    content: [
      { type: 'p', text: 'Backups protect your data from mistakes, hardware problems, accidental deletes, and failed deployments. Every real database needs a backup plan.' },
      { type: 'p', text: 'MongoDB has command-line tools for backup and restore. Atlas also provides managed backup options depending on the cluster tier and settings.' },
      { type: 'h2', text: 'Binary backup with mongodump' },
      {
        type: 'code',
        title: 'Back up one database',
        language: 'bash',
        code: `mongodump --db intellex_app --out ./mongo-backups`
      },
      { type: 'p', text: 'mongodump creates a binary backup that mongorestore can use. This is different from exporting plain JSON for spreadsheet-style inspection.' },
      {
        type: 'code',
        title: 'Restore one database',
        language: 'bash',
        code: `mongorestore --db intellex_app_restored ./mongo-backups/intellex_app`
      },
      { type: 'h2', text: 'Export and import JSON' },
      {
        type: 'code',
        title: 'Export products as JSON lines',
        language: 'bash',
        code: `mongoexport --db intellex_app --collection products --out products.json`
      },
      {
        type: 'code',
        title: 'Import products into a practice collection',
        language: 'bash',
        code: `mongoimport --db intellex_app --collection products_imported --file products.json`
      },
      { type: 'h2', text: 'Beginner backup habits' },
      { type: 'ul', items: ['Know where backups are stored.', 'Test restores before you need them.', 'Protect backups because they may contain private data.', 'Automate backups for production systems.', 'Do not rely on export files as your only backup strategy.'] },
      { type: 'warning', text: 'Practice restore commands on a separate database name first. Restoring into the wrong place can overwrite or mix data.' },
      { type: 'try', text: 'In a local practice database, run mongodump for one database and restore it into a new database name. Then compare collection counts.' },
      { type: 'keypoints', items: ['Backups are essential for real databases.', 'mongodump and mongorestore handle binary backups.', 'mongoexport and mongoimport move JSON or CSV-style data.', 'A backup plan is only trustworthy if restores are tested.'] }
    ]
  },
  {
    slug: 'mongodb-compass',
    title: 'MongoDB Compass Basics',
    description: 'Use MongoDB Compass to browse databases, inspect documents, filter results, and create simple indexes visually.',
    level: 'beginner',
    section: 'Ops Basics',
    order: 24,
    minutes: 10,
    content: [
      { type: 'p', text: 'MongoDB Compass is the official graphical interface for MongoDB. It lets you browse databases and collections without typing every command.' },
      { type: 'p', text: 'Compass is helpful for beginners because it makes documents, fields, indexes, and query filters visible. You should still learn mongosh because commands are precise and repeatable.' },
      { type: 'h2', text: 'Connect to MongoDB' },
      {
        type: 'code',
        title: 'Local connection string',
        language: 'text',
        code: `mongodb://localhost:27017`
      },
      {
        type: 'code',
        title: 'Atlas connection string shape',
        language: 'text',
        code: `mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/`
      },
      { type: 'h2', text: 'Filter documents in Compass' },
      { type: 'p', text: 'Compass filter boxes use MongoDB query documents. The same filters you practice in mongosh can be pasted into Compass.' },
      {
        type: 'code',
        title: 'Filter beginner courses',
        language: 'javascript',
        code: `{
  level: "beginner",
  published: true
}`
      },
      {
        type: 'code',
        title: 'Sort newest posts first',
        language: 'javascript',
        code: `{
  publishedAt: -1
}`
      },
      { type: 'h2', text: 'Common Compass tasks' },
      { type: 'ul', items: ['Browse documents in a collection.', 'Add, edit, or delete practice documents.', 'Run filters and projections.', 'View field types and sample values.', 'Create and inspect indexes.'] },
      { type: 'tip', text: 'Use Compass to explore and mongosh to keep a repeatable history of important commands. Visual tools and command-line tools work well together.' },
      { type: 'try', text: 'Open a practice database in Compass. Filter products by inStock: true, project only name and price, and inspect the Indexes tab.' },
      { type: 'keypoints', items: ['Compass is MongoDBs graphical interface.', 'Compass can connect locally or to Atlas.', 'Compass filters use MongoDB query syntax.', 'Compass is useful for browsing documents and inspecting indexes.'] }
    ]
  },
  {
    slug: 'mongodb-sample-model',
    title: 'Design a Sample Model (Blog/Courses)',
    description: 'Put beginner MongoDB ideas together by designing collections, documents, indexes, and validation for a blog or course platform.',
    level: 'beginner',
    section: 'Putting It Together',
    order: 25,
    minutes: 14,
    content: [
      { type: 'p', text: 'Now you can combine the beginner ideas: documents, collections, CRUD, arrays, embedded documents, references, indexes, validation, and backups.' },
      { type: 'p', text: 'This sample model is for a small learning site with blog posts and courses. The goal is not to create the only correct design, but to practice clear MongoDB thinking.' },
      { type: 'h2', text: 'Collections' },
      {
        type: 'code',
        title: 'Learning site collections',
        language: 'text',
        code: `intellex_learning

collections:
- users
- courses
- posts
- enrollments`
      },
      { type: 'h2', text: 'Course document' },
      {
        type: 'code',
        title: 'Course model',
        language: 'javascript',
        code: `db.courses.insertOne({
  slug: "mongodb-basics",
  title: "MongoDB Basics",
  level: "beginner",
  published: true,
  tags: ["mongodb", "database", "backend"],
  instructor: {
    name: "Ari Patel",
    bio: "Database educator"
  },
  lessons: [
    { order: 1, title: "What is MongoDB?", minutes: 9 },
    { order: 2, title: "Documents & BSON", minutes: 11 }
  ],
  createdAt: new Date()
})`
      },
      { type: 'h2', text: 'Post document' },
      {
        type: 'code',
        title: 'Blog post model',
        language: 'javascript',
        code: `db.posts.insertOne({
  slug: "how-documents-work",
  title: "How MongoDB Documents Work",
  authorId: ObjectId("66a100000000000000000101"),
  status: "published",
  tags: ["mongodb", "documents"],
  summary: "A beginner-friendly guide to document-shaped data.",
  body: "Full post content goes here.",
  publishedAt: new Date()
})`
      },
      { type: 'h2', text: 'Enrollment as a reference document' },
      {
        type: 'code',
        title: 'Enrollment model',
        language: 'javascript',
        code: `db.enrollments.insertOne({
  userId: ObjectId("66a100000000000000000101"),
  courseId: ObjectId("66a100000000000000000202"),
  status: "active",
  progressPercent: 20,
  enrolledAt: new Date()
})`
      },
      { type: 'h2', text: 'Indexes for common queries' },
      {
        type: 'code',
        title: 'Useful beginner indexes',
        language: 'javascript',
        code: `db.users.createIndex({ email: 1 }, { unique: true })
db.courses.createIndex({ slug: 1 }, { unique: true })
db.courses.createIndex({ level: 1, published: 1 })
db.posts.createIndex({ slug: 1 }, { unique: true })
db.posts.createIndex({ status: 1, publishedAt: -1 })
db.enrollments.createIndex({ userId: 1, courseId: 1 }, { unique: true })`
      },
      { type: 'h2', text: 'Validation for the course shape' },
      {
        type: 'code',
        title: 'Simple course validation',
        language: 'javascript',
        code: `db.runCommand({
  collMod: "courses",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["slug", "title", "level", "published"],
      properties: {
        slug: { bsonType: "string" },
        title: { bsonType: "string" },
        level: { enum: ["beginner", "intermediate", "advanced"] },
        published: { bsonType: "bool" }
      }
    }
  }
})`
      },
      { type: 'note', text: 'This design embeds lesson summaries in a course because a course page commonly displays them together. If lessons become large or independently edited, a separate lessons collection may be better.' },
      { type: 'try', text: 'Extend the sample model with a products collection or comments feature. Decide what to embed, what to reference, and which fields need indexes.' },
      { type: 'keypoints', items: ['A practical MongoDB model starts with application queries.', 'Courses can embed bounded lesson summaries.', 'Enrollments are useful reference documents between users and courses.', 'Indexes and validation turn a document design into a safer database design.', 'Beginner MongoDB skills connect directly to real application modeling.'] }
    ]
  }
];
