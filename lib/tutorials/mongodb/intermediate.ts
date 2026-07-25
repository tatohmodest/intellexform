import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'mongodb-aggregation-intro',
    title: 'Aggregation Pipeline Intro',
    description:
      'Learn how MongoDB aggregation pipelines transform documents step by step for reports, summaries, and API-ready results.',
    level: 'intermediate',
    section: 'Aggregation',
    order: 26,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Aggregation is MongoDB\'s framework for processing many documents and returning computed results. If find() is for fetching documents, aggregate() is for shaping, grouping, joining, and summarizing them.',
      },
      {
        type: 'p',
        text: 'A pipeline is an array of stages. Each stage receives documents from the previous stage, performs one focused operation, and passes the result forward.',
      },
      { type: 'h2', text: 'Start with a small pipeline' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Filter, reshape, and sort orders',
        code: `db.orders.aggregate([
  { $match: { status: "paid" } },
  {
    $project: {
      customerId: 1,
      total: 1,
      month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
    }
  },
  { $sort: { month: 1, total: -1 } }
]);`,
      },
      {
        type: 'p',
        text: 'This pipeline keeps only paid orders, creates a month field, and sorts the results. The output does not have to look like the original documents.',
      },
      { type: 'h2', text: 'Think in stages' },
      {
        type: 'table',
        headers: ['Stage', 'Common purpose'],
        rows: [
          ['$match', 'Filter documents early'],
          ['$project', 'Choose or compute fields'],
          ['$group', 'Summarize documents'],
          ['$sort', 'Order the result'],
          ['$lookup', 'Join another collection'],
        ],
      },
      {
        type: 'note',
        text: 'Pipeline order matters. Put selective $match stages early when possible so later stages process fewer documents.',
      },
      {
        type: 'try',
        text: 'Create a pipeline for a products collection that keeps only active products, returns name and price, adds a priceWithTax field, and sorts from most expensive to least expensive.',
      },
      {
        type: 'keypoints',
        items: [
          'Aggregation pipelines are arrays of stages.',
          'Each stage transforms the stream of documents before the next stage runs.',
          '$match, $project, $group, $sort, and $lookup are core stages.',
          'Place filters early to reduce the amount of work done by later stages.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-match-group',
    title: '$match & $group',
    description:
      'Use $match to filter pipeline input and $group to calculate totals, averages, counts, and category summaries.',
    level: 'intermediate',
    section: 'Aggregation',
    order: 27,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: '$match and $group are the stages you will use in almost every reporting pipeline. $match narrows the documents, and $group combines matching documents into summary rows.',
      },
      {
        type: 'p',
        text: 'A $group stage needs an _id expression. Documents with the same _id value are grouped together, and accumulator operators calculate values for each group.',
      },
      { type: 'h2', text: 'Count orders by status' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Basic grouping',
        code: `db.orders.aggregate([
  { $match: { createdAt: { $gte: ISODate("2026-01-01") } } },
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 },
      revenue: { $sum: "$total" },
      averageOrder: { $avg: "$total" }
    }
  },
  { $sort: { revenue: -1 } }
]);`,
      },
      {
        type: 'p',
        text: 'The _id value is the grouping key. Here, every order with the same status contributes to the same output document.',
      },
      { type: 'h2', text: 'Group by more than one value' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Revenue by customer and month',
        code: `db.orders.aggregate([
  { $match: { status: "paid" } },
  {
    $group: {
      _id: {
        customerId: "$customerId",
        month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
      },
      orders: { $sum: 1 },
      revenue: { $sum: "$total" }
    }
  }
]);`,
      },
      {
        type: 'tip',
        text: 'Use a compound _id object when your report needs multiple dimensions, such as customer plus month or category plus region.',
      },
      {
        type: 'try',
        text: 'Write a pipeline that groups support tickets by priority and calculates the number of open tickets plus the average age in hours.',
      },
      {
        type: 'keypoints',
        items: [
          '$match filters documents inside a pipeline.',
          '$group combines documents that share the same _id expression.',
          '$sum, $avg, $min, $max, and $push are common accumulators.',
          'Use compound group keys for multi-dimensional reports.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-project-lookup',
    title: '$project & $lookup',
    description:
      'Shape aggregation output with $project and join related collections with $lookup for richer API responses.',
    level: 'intermediate',
    section: 'Aggregation',
    order: 28,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: '$project controls the fields that leave a pipeline stage. $lookup brings in related documents from another collection, similar to a left outer join.',
      },
      {
        type: 'p',
        text: 'Together, these stages help produce clean response shapes without forcing application code to loop through raw database documents.',
      },
      { type: 'h2', text: 'Project only what the API needs' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Computed fields with $project',
        code: `db.products.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      price: 1,
      inStock: { $gt: ["$stock", 0] },
      displayName: { $concat: ["$brand", " ", "$name"] }
    }
  }
]);`,
      },
      {
        type: 'p',
        text: 'Projection can include existing fields, remove fields, and create computed values. Use _id: 0 if the API should not return MongoDB object ids.',
      },
      { type: 'h2', text: 'Join customers onto orders' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Simple $lookup',
        code: `db.orders.aggregate([
  { $match: { status: "paid" } },
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  },
  {
    $project: {
      total: 1,
      status: 1,
      customerEmail: { $first: "$customer.email" }
    }
  }
]);`,
      },
      {
        type: 'note',
        text: '$lookup returns an array because one local document could match multiple foreign documents. If your relationship is one-to-one, use $first or $unwind depending on the output shape you want.',
      },
      {
        type: 'try',
        text: 'Build a pipeline that returns blog posts with the author name from a users collection, then projects title, publishedAt, and authorName only.',
      },
      {
        type: 'keypoints',
        items: [
          '$project shapes documents and computes new fields.',
          '$lookup joins documents from another collection into an array field.',
          'Use projection after a lookup to return a cleaner response shape.',
          'Be mindful of relationship cardinality when reading joined arrays.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-unwind-sort',
    title: '$unwind, $sort & $limit',
    description:
      'Flatten arrays, order results, and keep top records with common aggregation stages used in feeds and reports.',
    level: 'intermediate',
    section: 'Aggregation',
    order: 29,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: '$unwind turns each element of an array into its own pipeline document. $sort orders documents, and $limit caps how many documents continue.',
      },
      {
        type: 'p',
        text: 'These stages are especially useful when documents contain arrays such as tags, line items, comments, or event histories.',
      },
      { type: 'h2', text: 'Find top-selling items' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Unwind order items',
        code: `db.orders.aggregate([
  { $match: { status: "paid" } },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.sku",
      quantitySold: { $sum: "$items.quantity" },
      revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
    }
  },
  { $sort: { revenue: -1 } },
  { $limit: 5 }
]);`,
      },
      {
        type: 'p',
        text: 'After $unwind, each order item can be grouped independently. This makes product-level reporting possible even though items are embedded inside order documents.',
      },
      { type: 'h2', text: 'Keep documents with empty arrays' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Preserve missing values',
        code: `db.posts.aggregate([
  {
    $unwind: {
      path: "$tags",
      preserveNullAndEmptyArrays: true
    }
  },
  { $sort: { createdAt: -1 } },
  { $limit: 20 }
]);`,
      },
      {
        type: 'tip',
        text: 'Sort before limit when you want the top N records. Limit before sort only sorts the limited subset, which is usually not the same result.',
      },
      {
        type: 'try',
        text: 'Given invoices with an array of payments, unwind payments and return the 10 largest individual payments with invoiceId, payment method, and amount.',
      },
      {
        type: 'keypoints',
        items: [
          '$unwind creates one pipeline document per array element.',
          'preserveNullAndEmptyArrays keeps documents that have no array values.',
          '$sort plus $limit is the usual top-N pattern.',
          'Unwind before grouping when the report is about items inside arrays.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-indexes-advanced',
    title: 'Compound & Multikey Indexes',
    description:
      'Design compound and multikey indexes that match real query filters, sorts, and array fields.',
    level: 'intermediate',
    section: 'Performance',
    order: 30,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Indexes help MongoDB find documents without scanning an entire collection. Intermediate index design is about matching indexes to the shape of your actual queries.',
      },
      {
        type: 'p',
        text: 'Compound indexes include more than one field. Multikey indexes are created automatically when an indexed field contains an array.',
      },
      { type: 'h2', text: 'Create a compound index' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Filter by status and sort by createdAt',
        code: `db.orders.createIndex({ status: 1, createdAt: -1 });

db.orders.find({ status: "paid" })
  .sort({ createdAt: -1 })
  .limit(20);`,
      },
      {
        type: 'p',
        text: 'The index starts with status because the query filters by status. The second field supports sorting newest paid orders first.',
      },
      { type: 'h2', text: 'Index array values' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Multikey index on tags',
        code: `db.posts.createIndex({ tags: 1 });

db.posts.find({ tags: "mongodb" });`,
      },
      {
        type: 'note',
        text: 'When you index an array field, MongoDB indexes each value in the array. This is powerful, but very large arrays can make indexes large and writes more expensive.',
      },
      {
        type: 'try',
        text: 'For a products page that filters by category and active status and sorts by rating, propose a compound index and explain the field order.',
      },
      {
        type: 'keypoints',
        items: [
          'Compound indexes should reflect common filters and sorts.',
          'Field order matters in compound indexes.',
          'Array indexes become multikey indexes automatically.',
          'Indexes speed reads but add storage cost and write overhead.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-explain',
    title: 'explain() & Query Plans',
    description:
      'Use explain() to inspect whether MongoDB is scanning indexes or scanning full collections.',
    level: 'intermediate',
    section: 'Performance',
    order: 31,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'explain() shows how MongoDB plans and executes a query. It is the practical way to confirm whether an index is actually helping.',
      },
      {
        type: 'p',
        text: 'The two terms to watch first are IXSCAN and COLLSCAN. IXSCAN means an index scan; COLLSCAN means MongoDB scanned collection documents.',
      },
      { type: 'h2', text: 'Explain a query' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Read execution statistics',
        code: `db.orders.find({ status: "paid" })
  .sort({ createdAt: -1 })
  .explain("executionStats");`,
      },
      {
        type: 'p',
        text: 'executionStats includes useful numbers such as totalKeysExamined, totalDocsExamined, and nReturned. A query that returns 20 documents but examines 500,000 documents needs attention.',
      },
      { type: 'h2', text: 'Compare before and after an index' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Add an index and explain again',
        code: `db.orders.createIndex({ status: 1, createdAt: -1 });

db.orders.find({ status: "paid" })
  .sort({ createdAt: -1 })
  .limit(20)
  .explain("executionStats");`,
      },
      {
        type: 'tip',
        text: 'Do not guess at performance. Capture the query shape, run explain(), add or adjust an index, then explain the same query again.',
      },
      {
        type: 'try',
        text: 'Run explain("executionStats") on a query that filters by email. Add an index on email, run it again, and compare totalDocsExamined.',
      },
      {
        type: 'keypoints',
        items: [
          'explain() reveals how MongoDB executes a query.',
          'IXSCAN usually indicates index usage; COLLSCAN means a full collection scan.',
          'Compare totalDocsExamined to nReturned to spot inefficient queries.',
          'Use explain() before and after index changes.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-text-search',
    title: 'Text Search',
    description:
      'Create text indexes and run simple relevance-based searches across string fields.',
    level: 'intermediate',
    section: 'Query Power',
    order: 32,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'MongoDB text search lets you search words in string fields using a text index. It is useful for basic search boxes, admin tools, and content filtering.',
      },
      {
        type: 'p',
        text: 'Text search is not a full replacement for dedicated search products, but it is often enough for simple keyword search inside an application database.',
      },
      { type: 'h2', text: 'Create a text index' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Search titles and body text',
        code: `db.articles.createIndex({
  title: "text",
  body: "text"
});

db.articles.find({
  $text: { $search: "mongodb indexes" }
});`,
      },
      {
        type: 'p',
        text: 'A collection can have one text index, but that index can include multiple fields. MongoDB tokenizes and indexes words from those fields.',
      },
      { type: 'h2', text: 'Sort by text score' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Return relevant articles first',
        code: `db.articles.find(
  { $text: { $search: "schema design" } },
  { score: { $meta: "textScore" }, title: 1 }
).sort({
  score: { $meta: "textScore" }
});`,
      },
      {
        type: 'note',
        text: 'For advanced language analysis, typo tolerance, autocomplete, and highlighting, consider MongoDB Atlas Search. Basic $text search is simpler and built into MongoDB collections.',
      },
      {
        type: 'try',
        text: 'Add a text index to a recipes collection using name and ingredients, then search for "tomato basil" and sort by textScore.',
      },
      {
        type: 'keypoints',
        items: [
          'A text index enables $text queries.',
          'One text index can cover multiple string fields in a collection.',
          'textScore helps sort keyword results by relevance.',
          'Use Atlas Search when you need advanced search features.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-geo',
    title: 'Geospatial Basics',
    description:
      'Store GeoJSON points, create 2dsphere indexes, and query locations near a user.',
    level: 'intermediate',
    section: 'Query Power',
    order: 33,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'MongoDB supports geospatial data such as store locations, delivery zones, and user check-ins. The most common format is a GeoJSON Point.',
      },
      {
        type: 'p',
        text: 'GeoJSON coordinates use longitude first, then latitude. This order is easy to reverse by mistake.',
      },
      { type: 'h2', text: 'Store a location' },
      {
        type: 'code',
        language: 'json',
        title: 'GeoJSON point document',
        code: `{
  "name": "Downtown Pickup",
  "location": {
    "type": "Point",
    "coordinates": [-73.9857, 40.7484]
  }
}`,
      },
      { type: 'h2', text: 'Create a geospatial index' },
      {
        type: 'code',
        language: 'javascript',
        title: '2dsphere index and nearby query',
        code: `db.stores.createIndex({ location: "2dsphere" });

db.stores.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-73.9857, 40.7484]
      },
      $maxDistance: 2000
    }
  }
});`,
      },
      {
        type: 'p',
        text: '$maxDistance is measured in meters when using GeoJSON with a 2dsphere index. The example searches within 2 kilometers.',
      },
      {
        type: 'tip',
        text: 'Name helper variables longitude and latitude instead of lat and lng when building coordinates. The explicit names reduce accidental reversal.',
      },
      {
        type: 'try',
        text: 'Create a cafes collection with GeoJSON points, add a 2dsphere index, and query cafes within 1000 meters of a chosen coordinate.',
      },
      {
        type: 'keypoints',
        items: [
          'GeoJSON Points store coordinates as [longitude, latitude].',
          'Use a 2dsphere index for modern geospatial queries.',
          '$near finds documents closest to a point.',
          '$maxDistance with GeoJSON is measured in meters.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-transactions',
    title: 'Multi-Document Transactions',
    description:
      'Use sessions and transactions when several writes must commit or roll back together.',
    level: 'intermediate',
    section: 'Data Integrity',
    order: 34,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'MongoDB writes to a single document are atomic. Transactions are for cases where multiple documents or collections must change together.',
      },
      {
        type: 'p',
        text: 'Typical examples include moving money between accounts, creating an order plus inventory reservations, or updating related records that must stay consistent.',
      },
      { type: 'h2', text: 'Use a transaction from Node.js' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Commit or roll back related writes',
        code: `import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

const session = client.startSession();

try {
  await session.withTransaction(async () => {
    const db = client.db("shop");

    await db.collection("orders").insertOne(
      { customerId, items, status: "created" },
      { session }
    );

    await db.collection("inventory").updateOne(
      { sku, available: { $gte: quantity } },
      { $inc: { available: -quantity } },
      { session }
    );
  });
} finally {
  await session.endSession();
  await client.close();
}`,
      },
      {
        type: 'p',
        text: 'Every operation that belongs to the transaction receives the same session. If the callback throws, the transaction is aborted.',
      },
      {
        type: 'note',
        text: 'Transactions require a replica set or sharded cluster. MongoDB Atlas clusters support this; a standalone local mongod does not provide the same transaction behavior.',
      },
      {
        type: 'try',
        text: 'Design a transaction for transferring 25 credits from one user account to another. Include a guard that prevents the sender balance from going negative.',
      },
      {
        type: 'keypoints',
        items: [
          'Single-document writes are already atomic in MongoDB.',
          'Use transactions when multiple documents must commit together.',
          'Pass the same session to each operation in the transaction.',
          'Keep transactions short to reduce locks, retries, and contention.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-change-streams',
    title: 'Change Streams Intro',
    description:
      'Listen to insert, update, replace, and delete events from MongoDB collections for real-time app workflows.',
    level: 'intermediate',
    section: 'Data Integrity',
    order: 35,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Change streams let applications react to database changes without polling. They are useful for notifications, search indexing, cache invalidation, and real-time dashboards.',
      },
      {
        type: 'p',
        text: 'A change stream watches a collection, database, or cluster and emits events as writes happen.',
      },
      { type: 'h2', text: 'Watch a collection' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Node.js change stream',
        code: `import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

const products = client.db("shop").collection("products");
const stream = products.watch([
  { $match: { operationType: { $in: ["insert", "update", "delete"] } } }
]);

for await (const change of stream) {
  console.log(change.operationType, change.documentKey);
}`,
      },
      {
        type: 'p',
        text: 'The optional pipeline filters events before your application receives them. The example listens only for inserts, updates, and deletes.',
      },
      {
        type: 'note',
        text: 'Change streams require a replica set or sharded cluster. In production, store resume tokens if your worker must continue from the last processed event after a restart.',
      },
      {
        type: 'try',
        text: 'Create a watcher that listens for new orders and logs a message only when operationType is insert.',
      },
      {
        type: 'keypoints',
        items: [
          'Change streams push database changes to your application.',
          'They are useful for event-driven workflows and cache updates.',
          'A pipeline can filter change events.',
          'Resume tokens help long-running workers recover safely.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-schema-patterns',
    title: 'Schema Design Patterns',
    description:
      'Choose embedding, referencing, bucketing, and computed fields based on how your app reads and writes data.',
    level: 'intermediate',
    section: 'Modeling',
    order: 36,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'MongoDB schema design starts with application access patterns. Instead of normalizing by default, ask what screens, API routes, and background jobs need to read together.',
      },
      {
        type: 'p',
        text: 'Intermediate modeling is about choosing a pattern intentionally: embed data that is read together, reference data that changes independently, and precompute values that would be expensive to calculate repeatedly.',
      },
      { type: 'h2', text: 'Embed data read together' },
      {
        type: 'code',
        language: 'json',
        title: 'Order with embedded line items',
        code: `{
  "_id": "order_1001",
  "customerId": "customer_42",
  "status": "paid",
  "items": [
    { "sku": "book-1", "name": "MongoDB Guide", "quantity": 2, "price": 29 }
  ],
  "total": 58
}`,
      },
      {
        type: 'p',
        text: 'Embedding line items in an order works because an order page needs the items, and the item snapshot should not change when the product catalog changes later.',
      },
      { type: 'h2', text: 'Reference independent data' },
      {
        type: 'code',
        language: 'json',
        title: 'Post references an author',
        code: `{
  "_id": "post_77",
  "authorId": "user_9",
  "title": "Indexing for Product Pages",
  "publishedAt": "2026-07-25T10:00:00.000Z"
}`,
      },
      {
        type: 'tip',
        text: 'If a nested array can grow forever, avoid embedding it directly. Use references, buckets, or a separate collection so documents do not grow without bound.',
      },
      {
        type: 'try',
        text: 'Model a chat application with rooms and messages. Decide which fields belong on the room document and which belong in a messages collection.',
      },
      {
        type: 'keypoints',
        items: [
          'Design MongoDB documents around access patterns.',
          'Embed data that is read together and bounded in size.',
          'Reference data that changes independently or grows without limit.',
          'Computed fields can trade extra write work for faster reads.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-migrations-mindset',
    title: 'Evolving Documents Over Time',
    description:
      'Handle schema changes in a document database with versions, backfills, and application-safe migrations.',
    level: 'intermediate',
    section: 'Modeling',
    order: 37,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'MongoDB does not require every document in a collection to have the same shape. That flexibility is useful, but production applications still need a plan for changing document structure safely.',
      },
      {
        type: 'p',
        text: 'A migration mindset means application code can read old and new shapes during a rollout, while a backfill updates existing documents in controlled batches.',
      },
      { type: 'h2', text: 'Add a schema version' },
      {
        type: 'code',
        language: 'json',
        title: 'Versioned profile document',
        code: `{
  "_id": "user_42",
  "schemaVersion": 2,
  "name": {
    "first": "Amina",
    "last": "Khan"
  },
  "email": "amina@example.com"
}`,
      },
      { type: 'h2', text: 'Backfill in batches' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Update old profile documents',
        code: `const cursor = db.users.find({ schemaVersion: { $ne: 2 } }).limit(500);

while (await cursor.hasNext()) {
  const user = await cursor.next();
  const parts = String(user.fullName || "").split(" ");

  await db.users.updateOne(
    { _id: user._id },
    {
      $set: {
        schemaVersion: 2,
        name: {
          first: parts[0] || "",
          last: parts.slice(1).join(" ")
        }
      },
      $unset: { fullName: "" }
    }
  );
}`,
      },
      {
        type: 'note',
        text: 'For large collections, avoid one giant migration that runs for hours. Batch changes, monitor progress, and make the app tolerant of mixed document versions during deployment.',
      },
      {
        type: 'try',
        text: 'Plan a migration from address as a string to address as an object with street, city, and country. Write the read strategy and the backfill query.',
      },
      {
        type: 'keypoints',
        items: [
          'Flexible schemas still need disciplined change management.',
          'schemaVersion fields make document shape explicit.',
          'Applications should often read old and new shapes during rollout.',
          'Backfill large collections in batches with monitoring.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-connect-node',
    title: 'Connect from Node.js (mongodb driver)',
    description:
      'Connect a plain Node.js app to MongoDB using the official mongodb driver and an environment-based connection string.',
    level: 'intermediate',
    section: 'App Integration',
    order: 38,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'The official mongodb package is the lowest-level Node.js driver most frameworks build on. It gives direct access to MongoClient, databases, collections, and driver options.',
      },
      {
        type: 'p',
        text: 'Install the driver with npm, store your connection string in MONGODB_URI, and never hardcode real usernames, passwords, or Atlas URLs in source code.',
      },
      { type: 'h2', text: 'Install and configure' },
      {
        type: 'code',
        language: 'bash',
        title: 'Package and environment variable',
        code: `npm install mongodb

# .env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority`,
      },
      { type: 'h2', text: 'Create a reusable client' },
      {
        type: 'code',
        language: 'javascript',
        title: 'db.js',
        code: `import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const client = new MongoClient(uri);

export async function getDb() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }

  return client.db("app");
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Use the helper',
        code: `import { getDb } from "./db.js";

const db = await getDb();
const products = await db.collection("products")
  .find({ active: true })
  .sort({ createdAt: -1 })
  .limit(10)
  .toArray();

console.log(products);`,
      },
      {
        type: 'tip',
        text: 'In a long-running Node.js process, create one MongoClient and reuse it. Opening a new connection for every query is slower and can exhaust connection limits.',
      },
      {
        type: 'try',
        text: 'Create a small Node script that reads MONGODB_URI, connects with mongodb, inserts one document into a healthChecks collection, reads it back, and closes the client.',
      },
      {
        type: 'keypoints',
        items: [
          'Use the official mongodb package for direct Node.js access.',
          'Read credentials from process.env.MONGODB_URI.',
          'Never commit real connection strings or passwords.',
          'Reuse MongoClient in server processes instead of reconnecting per query.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-connect-express',
    title: 'Connect from Express',
    description:
      'Use MongoDB safely in Express routes with a shared client, env vars, and small route handlers.',
    level: 'intermediate',
    section: 'App Integration',
    order: 39,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Express applications should connect to MongoDB on the server, keep credentials in environment variables, and share database access helpers across routes.',
      },
      {
        type: 'p',
        text: 'The example uses express, mongodb, and dotenv for local development. Production platforms usually provide environment variables through their dashboard or deployment configuration.',
      },
      { type: 'h2', text: 'Install packages' },
      {
        type: 'code',
        language: 'bash',
        title: 'Express and MongoDB driver',
        code: `npm install express mongodb dotenv`,
      },
      { type: 'h2', text: 'Create the app' },
      {
        type: 'code',
        language: 'javascript',
        title: 'server.js',
        code: `import "dotenv/config";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(express.json());

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Missing MONGODB_URI");
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db("shop");

app.get("/products", async (req, res, next) => {
  try {
    const products = await db.collection("products")
      .find({ active: true })
      .limit(20)
      .toArray();

    res.json(products);
  } catch (error) {
    next(error);
  }
});

app.get("/products/:id", async (req, res, next) => {
  try {
    const product = await db.collection("products").findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

app.listen(3000, () => {
  console.log("API listening on http://localhost:3000");
});`,
      },
      {
        type: 'note',
        text: 'Validate route params before creating ObjectId values in production. Invalid ids should return 400 instead of turning into noisy server errors.',
      },
      {
        type: 'try',
        text: 'Add a POST /products route that inserts name, price, active, and createdAt. Read MONGODB_URI from the environment and do not hardcode credentials.',
      },
      {
        type: 'keypoints',
        items: [
          'Express connects to MongoDB on the server side only.',
          'Use dotenv locally and platform env vars in production.',
          'Create the MongoClient once during app startup.',
          'Wrap async route code so database errors reach Express error handling.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-connect-mongoose',
    title: 'Mongoose ODM Basics',
    description:
      'Use Mongoose schemas, models, validation, and env-based connections when an ODM fits your Node.js app.',
    level: 'intermediate',
    section: 'App Integration',
    order: 40,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Mongoose is an ODM for MongoDB and Node.js. It adds schemas, models, validation, middleware, and convenience methods on top of the MongoDB driver.',
      },
      {
        type: 'p',
        text: 'Use Mongoose when your team wants model definitions and validation in application code. Use the native driver when you prefer direct control and less abstraction.',
      },
      { type: 'h2', text: 'Install and connect' },
      {
        type: 'code',
        language: 'bash',
        title: 'Package and .env',
        code: `npm install mongoose dotenv

# .env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/shop?retryWrites=true&w=majority`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'mongoose connection and model',
        code: `import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Missing MONGODB_URI");
}

await mongoose.connect(uri);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

const product = await Product.create({
  name: "Notebook",
  price: 9.99,
  tags: ["stationery"]
});

console.log(product.id);`,
      },
      {
        type: 'p',
        text: 'Mongoose validates documents before saving and maps collection documents to model instances with methods and virtual properties.',
      },
      {
        type: 'tip',
        text: 'Be careful not to define the same model repeatedly in hot-reload environments. Next.js examples often reuse mongoose.models.Product before calling mongoose.model.',
      },
      {
        type: 'try',
        text: 'Define a User model with email, displayName, roles, and timestamps. Add required validation for email and a default role of "member".',
      },
      {
        type: 'keypoints',
        items: [
          'Mongoose is an ODM that adds schemas and validation.',
          'Install mongoose and read the MongoDB URI from the environment.',
          'Schemas describe document shape and validation rules.',
          'Choose Mongoose intentionally; the native driver is also valid.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-connect-flask',
    title: 'Connect from Flask (PyMongo)',
    description:
      'Connect a Flask application to MongoDB with PyMongo, environment variables, and simple JSON routes.',
    level: 'intermediate',
    section: 'App Integration',
    order: 41,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Flask works well with MongoDB through PyMongo, the official Python driver. Keep the MongoClient in application setup and use it from route handlers.',
      },
      {
        type: 'p',
        text: 'For local development, python-dotenv can load MONGODB_URI from a .env file. In production, configure the variable in the hosting environment.',
      },
      { type: 'h2', text: 'Install packages' },
      {
        type: 'code',
        language: 'bash',
        title: 'Flask and PyMongo',
        code: `python -m pip install flask pymongo python-dotenv`,
      },
      { type: 'h2', text: 'Create a small API' },
      {
        type: 'code',
        language: 'python',
        title: 'app.py',
        code: `import os
from bson import ObjectId
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from pymongo import MongoClient

load_dotenv()

app = Flask(__name__)

uri = os.environ.get("MONGODB_URI")
if not uri:
    raise RuntimeError("Missing MONGODB_URI")

client = MongoClient(uri)
db = client["shop"]


def serialize_product(product):
    product["_id"] = str(product["_id"])
    return product


@app.get("/products")
def list_products():
    products = db.products.find({"active": True}).limit(20)
    return jsonify([serialize_product(product) for product in products])


@app.post("/products")
def create_product():
    payload = request.get_json()
    result = db.products.insert_one({
        "name": payload["name"],
        "price": payload["price"],
        "active": True,
    })
    return jsonify({"id": str(result.inserted_id)}), 201`,
      },
      {
        type: 'note',
        text: 'ObjectId is not JSON serializable by default. Convert it to a string before returning MongoDB documents from Flask routes.',
      },
      {
        type: 'try',
        text: 'Add GET /products/<id> to the Flask app. Convert the path id to ObjectId, return 404 when no document exists, and keep MONGODB_URI in the environment.',
      },
      {
        type: 'keypoints',
        items: [
          'Use pymongo to connect Flask to MongoDB.',
          'Load MONGODB_URI from the environment, not source code.',
          'Create MongoClient once and reuse it for routes.',
          'Convert ObjectId values before returning JSON.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-connect-django',
    title: 'Connect from Django (Mongo patterns)',
    description:
      'Use MongoDB from Django honestly: Django ORM is SQL-first, so practical MongoDB apps use PyMongo or an ODM-style layer alongside Django.',
    level: 'intermediate',
    section: 'App Integration',
    order: 42,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Django\'s built-in ORM is designed for relational SQL databases. MongoDB is not a native drop-in backend for normal Django models, migrations, admin, and QuerySets.',
      },
      {
        type: 'p',
        text: 'Practical Django plus MongoDB projects usually use PyMongo directly for selected collections, or an ODM-style library such as mongoengine for document models. Keep that boundary explicit.',
      },
      { type: 'h2', text: 'Install PyMongo' },
      {
        type: 'code',
        language: 'bash',
        title: 'Django project dependencies',
        code: `python -m pip install django pymongo python-dotenv`,
      },
      { type: 'h2', text: 'Configure a Mongo helper' },
      {
        type: 'code',
        language: 'python',
        title: 'mongo.py',
        code: `import os
from functools import lru_cache

from pymongo import MongoClient


@lru_cache(maxsize=1)
def get_mongo_client():
    uri = os.environ.get("MONGODB_URI")
    if not uri:
        raise RuntimeError("Missing MONGODB_URI")
    return MongoClient(uri)


def get_mongo_db():
    return get_mongo_client()["content_app"]`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from bson import ObjectId
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .mongo import get_mongo_db


@require_GET
def article_detail(request, article_id):
    db = get_mongo_db()
    article = db.articles.find_one({"_id": ObjectId(article_id)})

    if article is None:
        return JsonResponse({"message": "Article not found"}, status=404)

    article["_id"] = str(article["_id"])
    return JsonResponse(article)`,
      },
      {
        type: 'note',
        text: 'This pattern does not make MongoDB part of the Django ORM. Use Django models for SQL-backed data, and use a separate MongoDB access layer for document collections.',
      },
      {
        type: 'tip',
        text: 'If you choose mongoengine, treat it as a separate ODM and document its limitations for your team, especially around Django admin, migrations, and QuerySet expectations.',
      },
      {
        type: 'try',
        text: 'Add a Django view that lists the 10 newest activity documents from MongoDB. Keep the helper separate from Django SQL models.',
      },
      {
        type: 'keypoints',
        items: [
          'Django ORM is SQL-first and not native MongoDB ORM.',
          'Use PyMongo directly or an ODM-style layer for MongoDB collections.',
          'Keep MongoDB access in a clear helper or repository module.',
          'Do not pretend MongoDB documents are normal Django ORM models.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-connect-nextjs',
    title: 'Connect from Next.js',
    description:
      'Connect MongoDB to Next.js through Server Components and route handlers while keeping credentials off the client.',
    level: 'intermediate',
    section: 'App Integration',
    order: 43,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Next.js can query MongoDB from server-only code: Server Components, route handlers, server actions, or API routes. Never expose database credentials to browser JavaScript.',
      },
      {
        type: 'p',
        text: 'Use the mongodb package, put MONGODB_URI in .env.local for development, and avoid NEXT_PUBLIC_ prefixes for secrets. NEXT_PUBLIC variables are bundled for the browser.',
      },
      { type: 'h2', text: 'Install and configure' },
      {
        type: 'code',
        language: 'bash',
        title: 'Next.js dependency and .env.local',
        code: `npm install mongodb

# .env.local
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/shop?retryWrites=true&w=majority`,
      },
      { type: 'h2', text: 'Create a server-only Mongo helper' },
      {
        type: 'code',
        language: 'typescript',
        title: 'lib/mongodb.ts',
        code: `import "server-only";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

export const clientPromise =
  globalForMongo.mongoClientPromise ?? new MongoClient(uri).connect();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClientPromise = clientPromise;
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Server Component page',
        code: `import { clientPromise } from "@/lib/mongodb";

export default async function ProductsPage() {
  const client = await clientPromise;
  const products = await client
    .db("shop")
    .collection("products")
    .find({ active: true })
    .limit(20)
    .toArray();

  return (
    <main>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={String(product._id)}>{product.name}</li>
        ))}
      </ul>
    </main>
  );
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Route handler',
        code: `import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const products = await client
    .db("shop")
    .collection("products")
    .find({ active: true })
    .limit(20)
    .toArray();

  return NextResponse.json(products);
}`,
      },
      {
        type: 'warning',
        text: 'Do not connect to MongoDB from Client Components. Browser code cannot safely hold database credentials, and MongoDB drivers are meant for server runtimes.',
      },
      {
        type: 'try',
        text: 'Create a Next.js route handler at /api/products that reads products from MongoDB using MONGODB_URI, then call it from a client component without exposing the URI.',
      },
      {
        type: 'keypoints',
        items: [
          'Use MongoDB only from Next.js server-side code.',
          'Keep MONGODB_URI in .env.local or deployment secrets without NEXT_PUBLIC_.',
          'Cache the MongoClient promise in development to survive hot reloads.',
          'Server Components and route handlers are good places to query MongoDB.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-env-secrets',
    title: 'Connection Strings, Env Vars & Secrets',
    description:
      'Store MongoDB connection details safely with environment variables, placeholders, and deployment secrets.',
    level: 'intermediate',
    section: 'App Integration',
    order: 44,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'A MongoDB connection string contains the host, database options, and often a username and password. Treat it like a secret.',
      },
      {
        type: 'p',
        text: 'Use environment variables locally and deployment secret managers in production. Commit only safe examples such as .env.example with placeholders.',
      },
      { type: 'h2', text: 'Use safe placeholders' },
      {
        type: 'code',
        language: 'text',
        title: '.env.example',
        code: `MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Fail fast when missing',
        code: `const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI. Set it in your environment.");
}`,
      },
      {
        type: 'table',
        headers: ['Do', 'Avoid'],
        rows: [
          ['Use .env locally and ignore it in git', 'Committing real .env files'],
          ['Use deployment secrets for production', 'Pasting credentials into source code'],
          ['Rotate leaked credentials immediately', 'Assuming a private repo is enough'],
        ],
      },
      {
        type: 'warning',
        text: 'Never prefix MongoDB credentials with NEXT_PUBLIC_, VITE_, or another client-exposed environment prefix. Those values can be shipped to browser code.',
      },
      {
        type: 'try',
        text: 'Create a .env.example for a MongoDB app and list the real .env file in .gitignore. Use placeholders only.',
      },
      {
        type: 'keypoints',
        items: [
          'Connection strings often contain secrets.',
          'Use MONGODB_URI from environment variables.',
          'Commit placeholder examples, not real credentials.',
          'Client-exposed env prefixes must never contain database secrets.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-pooling',
    title: 'Connection Pooling Basics',
    description:
      'Understand how MongoDB drivers reuse sockets and why apps should share clients instead of reconnecting repeatedly.',
    level: 'intermediate',
    section: 'App Integration',
    order: 45,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'MongoDB drivers maintain connection pools behind MongoClient. A pool lets many operations reuse a limited set of network connections.',
      },
      {
        type: 'p',
        text: 'The most important practical rule is simple: create one client per process or runtime context and reuse it. Do not connect and disconnect around every request.',
      },
      { type: 'h2', text: 'Configure pool options when needed' },
      {
        type: 'code',
        language: 'javascript',
        title: 'MongoClient with pool settings',
        code: `import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  maxPoolSize: 20,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 5000
});

await client.connect();`,
      },
      {
        type: 'p',
        text: 'Defaults are good for many apps. Tune pool sizes only after measuring traffic, database limits, request latency, and concurrent operations.',
      },
      { type: 'h2', text: 'Reuse the same helper' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Shared database access',
        code: `let clientPromise;

export function getClient() {
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    clientPromise = client.connect();
  }

  return clientPromise;
}`,
      },
      {
        type: 'tip',
        text: 'Serverless platforms may create multiple warm instances. Reusing a client still helps inside each instance, but total connections can scale with concurrency.',
      },
      {
        type: 'try',
        text: 'Refactor an API route that calls new MongoClient inside every request so it imports and reuses a shared clientPromise instead.',
      },
      {
        type: 'keypoints',
        items: [
          'MongoClient manages a connection pool internally.',
          'Reuse clients to avoid slow reconnects and connection storms.',
          'Tune maxPoolSize only with real traffic data.',
          'Serverless apps still benefit from per-instance client caching.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-seed-data',
    title: 'Seeding Data',
    description:
      'Create repeatable seed scripts for local development, demos, tests, and tutorials.',
    level: 'intermediate',
    section: 'App Integration',
    order: 46,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Seed data gives developers and tests a known starting point. A good seed script is repeatable, safe for local databases, and easy to run from package scripts.',
      },
      {
        type: 'p',
        text: 'Avoid running destructive seed scripts against production. Use explicit database names and environment checks to prevent mistakes.',
      },
      { type: 'h2', text: 'Write a seed script' },
      {
        type: 'code',
        language: 'javascript',
        title: 'scripts/seed.js',
        code: `import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Missing MONGODB_URI");
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db("shop_dev");

  await db.collection("products").deleteMany({});
  await db.collection("products").insertMany([
    { name: "Notebook", price: 9.99, active: true },
    { name: "Backpack", price: 49.99, active: true },
    { name: "Pen Set", price: 5.99, active: true }
  ]);

  console.log("Seeded products");
} finally {
  await client.close();
}`,
      },
      {
        type: 'code',
        language: 'json',
        title: 'package.json script',
        code: `{
  "scripts": {
    "seed": "node scripts/seed.js"
  }
}`,
      },
      {
        type: 'note',
        text: 'Use a development or test database name in seed scripts. If a script deletes data, add a guard that refuses to run when NODE_ENV is production.',
      },
      {
        type: 'try',
        text: 'Create a seed script for users and posts. Make it idempotent by clearing only the demo collections before inserting known documents.',
      },
      {
        type: 'keypoints',
        items: [
          'Seed scripts create predictable local or test data.',
          'Use environment variables for the URI but safe database names for seeds.',
          'Make seeds repeatable by clearing or upserting known records.',
          'Guard destructive scripts so they cannot run against production.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-testing-db',
    title: 'Testing Against MongoDB',
    description:
      'Test MongoDB code with isolated databases, cleanup hooks, and realistic driver behavior.',
    level: 'intermediate',
    section: 'App Integration',
    order: 47,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Database tests are most useful when they exercise real queries, indexes, validation, and serialization. Mocks can help unit tests, but integration tests catch different bugs.',
      },
      {
        type: 'p',
        text: 'Use a separate test database, clean collections between tests, and keep test credentials separate from development or production.',
      },
      { type: 'h2', text: 'Example test setup' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Node test lifecycle',
        code: `import { MongoClient } from "mongodb";
import { after, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";

let client;
let db;

before(async () => {
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db("shop_test");
});

beforeEach(async () => {
  await db.collection("products").deleteMany({});
});

after(async () => {
  await client.close();
});

test("creates a product", async () => {
  const result = await db.collection("products").insertOne({
    name: "Notebook",
    price: 9.99
  });

  const product = await db.collection("products").findOne({
    _id: result.insertedId
  });

  assert.equal(product.name, "Notebook");
});`,
      },
      {
        type: 'p',
        text: 'Some teams use a local MongoDB service in Docker, while others use mongodb-memory-server for Node.js tests. The right choice depends on speed, fidelity, and CI constraints.',
      },
      {
        type: 'tip',
        text: 'Name test databases clearly, such as app_test, and drop or clean only that database. This makes accidental destructive operations easier to spot.',
      },
      {
        type: 'try',
        text: 'Write a test that inserts three orders, runs an aggregation for total revenue, and asserts the computed sum.',
      },
      {
        type: 'keypoints',
        items: [
          'Integration tests should use an isolated test database.',
          'Clean data between tests to avoid order-dependent failures.',
          'Use real MongoDB behavior for query and aggregation tests.',
          'Keep test credentials separate from production credentials.',
        ],
      },
    ],
  },
  {
    slug: 'mongodb-error-handling',
    title: 'Driver Errors & Retries',
    description:
      'Handle common MongoDB driver errors, duplicate keys, timeouts, and safe retries in application code.',
    level: 'intermediate',
    section: 'App Integration',
    order: 48,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Production apps need clear behavior when MongoDB returns an error. Some errors are user-facing validation issues, some are temporary infrastructure issues, and some should fail loudly.',
      },
      {
        type: 'p',
        text: 'Handle known driver errors close to the operation, translate them into application responses, and keep logs detailed enough for debugging without leaking secrets.',
      },
      { type: 'h2', text: 'Handle duplicate keys' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Unique email insert',
        code: `import { MongoServerError } from "mongodb";

async function createUser(db, email) {
  try {
    const result = await db.collection("users").insertOne({ email });
    return { ok: true, id: result.insertedId };
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return { ok: false, status: 409, message: "Email already exists" };
    }

    throw error;
  }
}`,
      },
      { type: 'h2', text: 'Retry only safe operations' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Simple retry wrapper for reads',
        code: `async function retryRead(operation, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === attempts) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 100));
    }
  }

  throw lastError;
}

const products = await retryRead(() =>
  db.collection("products").find({ active: true }).toArray()
);`,
      },
      {
        type: 'note',
        text: 'Retry reads and idempotent writes more readily than non-idempotent writes. Retrying an insert without a stable unique key can create duplicates if the first write actually succeeded.',
      },
      {
        type: 'try',
        text: 'Add error handling to a signup route: return 409 for duplicate email, 400 for invalid input, and let unknown database errors reach centralized logging.',
      },
      {
        type: 'keypoints',
        items: [
          'Translate known database errors into useful application responses.',
          'Duplicate key errors use code 11000.',
          'Retry temporary failures only when the operation is safe to retry.',
          'Log enough context to debug without exposing connection strings or secrets.',
        ],
      },
    ],
  },
];
