import { prisma } from "../lib/db/prisma";

async function main() {
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `;

  const counts = {
    institutions: await prisma.institution.count(),
    users: await prisma.user.count(),
    categories: await prisma.category.count(),
    books: await prisma.book.count(),
    mediaRecommendations: await prisma.mediaRecommendation.count(),
    badges: await prisma.badge.count(),
    communities: await prisma.community.count(),
  };

  console.log(JSON.stringify({ tableCount: tables.length, tables, counts }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
