import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

interface UdemyCourseImport {
  title: string;
  slug?: string;
  url: string;
  instructor?: string;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  category?: string;
  duration?: string;
  language?: string;
  whatYouWillLearn?: string[];
}

/**
 * Script to bulk-import 1,000+ Udemy courses into Intellex MongoDB database.
 * Usage:
 *   npx tsx scripts/import-udemy-courses.ts [path-to-json-or-csv]
 *
 * Example JSON structure:
 * [
 *   {
 *     "title": "Complete Python Developer",
 *     "url": "https://www.udemy.com/course/complete-python-developer/",
 *     "instructor": "Andrei Neagoie",
 *     "category": "Development",
 *     "thumbnail": "https://img-c.udemycdn.com/course/480x270/2498794_5c21_6.jpg",
 *     "duration": "30.5 hours",
 *     "description": "Master Python programming with hands-on projects."
 *   }
 * ]
 */
async function main() {
  const fileArg = process.argv[2] || 'udemy_courses.json';
  const filePath = path.resolve(process.cwd(), fileArg);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    console.log(`\n💡 How to use:`);
    console.log(`1. Create a JSON file (e.g. udemy_courses.json) in your project root.`);
    console.log(`2. Format your courses as an array of objects:`);
    console.log(
      JSON.stringify(
        [
          {
            title: 'Sample Udemy Course',
            url: 'https://www.udemy.com/course/sample-course-slug/',
            instructor: 'John Doe',
            category: 'Development',
            thumbnail: 'https://img-c.udemycdn.com/course/480x270/123456_sample.jpg',
            duration: '15.5 hours',
            description: 'Learn modern development skills.',
          },
        ],
        null,
        2,
      ),
    );
    console.log(`3. Run: npx tsx scripts/import-udemy-courses.ts ${fileArg}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  let coursesInput: UdemyCourseImport[] = [];

  try {
    coursesInput = JSON.parse(rawData);
  } catch (err) {
    console.error('❌ Failed to parse JSON file:', err);
    process.exit(1);
  }

  if (!Array.isArray(coursesInput) || coursesInput.length === 0) {
    console.error('❌ Input JSON must be a non-empty array of course objects.');
    process.exit(1);
  }

  const mongoUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017';
  console.log(`🔌 Connecting to MongoDB at ${mongoUrl}...`);

  const client = new MongoClient(mongoUrl);
  await client.connect();
  const db = client.db('intellex');
  const collection = db.collection('courses');

  let insertedCount = 0;
  let updatedCount = 0;

  for (const item of coursesInput) {
    if (!item.title || !item.url) {
      console.warn(`⚠️ Skipping item missing title or url:`, item);
      continue;
    }

    // Clean up slug
    let slug = item.slug;
    if (!slug) {
      const match = item.url.match(/\/course\/([^/]+)/);
      if (match && match[1]) {
        slug = match[1];
      } else {
        slug = item.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }
    }

    const doc = {
      slug,
      name: item.title,
      instructor: item.instructor || 'Udemy Instructor',
      courseDetails: item.description || item.shortDescription || item.title,
      prerequisites: 'Basic knowledge of the course domain.',
      whatYouWillLearn: item.whatYouWillLearn || ['Master key concepts & practical applications'],
      type: item.category || 'Development',
      originalPrice: 0,
      currentPrice: 0,
      aboutInstructor: `Expert instructor on Udemy.`,
      courseRating: 4.7,
      courseNumberOfVotes: 100,
      courseOrigin: 'Udemy',
      courseDuration: item.duration || 'Self-paced',
      language: item.language || 'English',
      bestSeller: false,
      shortDescription: item.shortDescription || item.description || item.title,
      courseImage: item.thumbnail || '/images/default-course.jpg',
      certificateOfCompletion: true,
      accessOnMobileAndTV: true,
      downloadable: true,
      articleType: 'Video',
      instructorRating: 4.8,
      courseLink: item.url,
      featured: false,
      selfPaced: true,
      updatedAt: new Date().toISOString(),
    };

    const res = await collection.updateOne(
      { slug: doc.slug },
      {
        $set: doc,
        $setOnInsert: { createdAt: new Date().toISOString() },
      },
      { upsert: true },
    );

    if (res.upsertedCount > 0) {
      insertedCount++;
    } else {
      updatedCount++;
    }
  }

  console.log(`\n✅ Import completed successfully!`);
  console.log(`   - New courses inserted: ${insertedCount}`);
  console.log(`   - Existing courses updated: ${updatedCount}`);
  console.log(`   - Total processed: ${coursesInput.length}`);

  await client.close();
}

main().catch((err) => {
  console.error('Fatal error during import:', err);
  process.exit(1);
});
