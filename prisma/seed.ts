import { PrismaClient, MediaKind, Difficulty, BookStatus } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  "Programming",
  "AI",
  "Cybersecurity",
  "UI UX",
  "Graphics",
  "Video Editing",
  "Digital Marketing",
  "Cloud",
  "Linux",
  "Data Analysis",
  "Business",
  "Soft Skills",
  "Languages",
  "Mathematics",
  "Science",
  "School Courses",
  "University Courses",
] as const;

const BADGES = [
  { slug: "first-lesson", name: "First Steps", category: "COURSE" as const, xpReward: 50 },
  { slug: "streak-7", name: "Week Warrior", category: "STREAK" as const, xpReward: 100 },
  { slug: "streak-30", name: "Monthly Master", category: "STREAK" as const, xpReward: 500 },
  { slug: "course-complete", name: "Course Finisher", category: "COURSE" as const, xpReward: 200 },
  { slug: "certified", name: "Certified Pro", category: "CAREER" as const, xpReward: 300 },
  { slug: "mentor-first", name: "Guided Learner", category: "MENTORSHIP" as const, xpReward: 150 },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("🌱 Seeding InTelleX EduOS…");

  const intellex = await prisma.institution.upsert({
    where: { slug: "intellex" },
    update: {
      name: "InTelleX",
      isPlatformHome: true,
      primaryColor: "#00B369",
      visibility: "PUBLIC",
      description:
        "Africa's education operating system — courses, mentorship, certifications, and communities.",
      featuresEnabled: [
        "courses",
        "mentorship",
        "books",
        "communities",
        "certificates",
        "ai",
        "wallet",
        "affiliates",
      ],
    },
    create: {
      slug: "intellex",
      name: "InTelleX",
      isPlatformHome: true,
      primaryColor: "#00B369",
      visibility: "PUBLIC",
      customizationLevel: "BRANDED",
      deploymentModel: "SHARED_SAAS",
      description:
        "Africa's education operating system — courses, mentorship, certifications, and communities.",
      website: "https://www.intellex.study",
      email: "intellex@loopingbinary.com",
      country: "Cameroon",
      featuresEnabled: [
        "courses",
        "mentorship",
        "books",
        "communities",
        "certificates",
        "ai",
        "wallet",
        "affiliates",
      ],
    },
  });

  for (let index = 0; index < CATEGORIES.length; index++) {
    const name = CATEGORIES[index];
    const slug = slugify(name);
    await prisma.category.upsert({
      where: {
        institutionId_slug: { institutionId: intellex.id, slug },
      },
      update: { name, sortOrder: index },
      create: {
        institutionId: intellex.id,
        slug,
        name,
        sortOrder: index,
      },
    });
  }

  const programming = await prisma.category.findFirstOrThrow({
    where: { institutionId: intellex.id, slug: "programming" },
  });

  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {
        name: badge.name,
        category: badge.category,
        xpReward: badge.xpReward,
      },
      create: badge,
    });
  }

  await prisma.achievement.upsert({
    where: { slug: "welcome" },
    update: {},
    create: {
      slug: "welcome",
      name: "Welcome to InTelleX",
      description: "Joined the education operating system.",
      xpReward: 25,
    },
  });

  // Platform-curated YouTube recommendations by field (not tutor inventory)
  const youtubeRecs = [
    {
      title: "full stack web development — freeCodeCamp",
      url: "https://www.youtube.com/watch?v=nu_pCVPKzTk",
      fieldTags: ["programming", "web-development", "fullstack"],
      difficulty: Difficulty.BEGINNER,
      durationMin: 240,
    },
    {
      title: "Python for Everybody — freeCodeCamp",
      url: "https://www.youtube.com/watch?v=8DvywoWv6fI",
      fieldTags: ["programming", "python"],
      difficulty: Difficulty.BEGINNER,
      durationMin: 840,
    },
    {
      title: "SQL Tutorial — freeCodeCamp",
      url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
      fieldTags: ["programming", "databases", "data-analysis"],
      difficulty: Difficulty.BEGINNER,
      durationMin: 240,
    },
    {
      title: "Machine Learning for Everybody",
      url: "https://www.youtube.com/watch?v=i_LwzRVP7bg",
      fieldTags: ["ai", "machine-learning", "data-analysis"],
      difficulty: Difficulty.INTERMEDIATE,
      durationMin: 240,
    },
    {
      title: "Cybersecurity Full Course",
      url: "https://www.youtube.com/watch?v=U_P23SqJaDc",
      fieldTags: ["cybersecurity"],
      difficulty: Difficulty.BEGINNER,
      durationMin: 180,
    },
  ];

  for (let i = 0; i < youtubeRecs.length; i++) {
    const rec = youtubeRecs[i];
    const existing = await prisma.mediaRecommendation.findFirst({
      where: { url: rec.url, institutionId: intellex.id },
    });
    if (existing) {
      await prisma.mediaRecommendation.update({
        where: { id: existing.id },
        data: {
          title: rec.title,
          fieldTags: rec.fieldTags,
          difficulty: rec.difficulty,
          durationMin: rec.durationMin,
          sortOrder: i,
          isFeatured: true,
        },
      });
    } else {
      await prisma.mediaRecommendation.create({
        data: {
          institutionId: intellex.id,
          categoryId: programming.id,
          kind: MediaKind.YOUTUBE,
          title: rec.title,
          url: rec.url,
          provider: "youtube",
          fieldTags: rec.fieldTags,
          difficulty: rec.difficulty,
          durationMin: rec.durationMin,
          isFeatured: true,
          sortOrder: i,
        },
      });
    }
  }

  // Demo tutor account (books are tutor-uploaded + priced)
  const tutor = await prisma.user.upsert({
    where: { email: "tutor@intellex.study" },
    update: {
      name: "InTelleX Tutor",
      fieldOfInterest: "programming",
      globalRole: "USER",
    },
    create: {
      email: "tutor@intellex.study",
      name: "InTelleX Tutor",
      firstName: "InTelleX",
      lastName: "Tutor",
      fieldOfInterest: "programming",
      skills: ["javascript", "python", "teaching"],
      currentInstitutionId: intellex.id,
      profile: {
        create: {
          displayName: "InTelleX Tutor",
          country: "Cameroon",
          learningGoals: ["teach", "publish"],
        },
      },
      wallet: { create: {} },
      learningStreak: { create: {} },
    },
  });

  await prisma.institutionMembership.upsert({
    where: {
      institutionId_userId: { institutionId: intellex.id, userId: tutor.id },
    },
    update: { role: "INSTRUCTOR", isActive: true },
    create: {
      institutionId: intellex.id,
      userId: tutor.id,
      role: "INSTRUCTOR",
      title: "Lead Instructor",
    },
  });

  await prisma.book.upsert({
    where: {
      authorId_slug: { authorId: tutor.id, slug: "javascript-essentials" },
    },
    update: {
      title: "JavaScript Essentials",
      priceXaf: 2500,
      status: BookStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    create: {
      institutionId: intellex.id,
      authorId: tutor.id,
      categoryId: programming.id,
      slug: "javascript-essentials",
      title: "JavaScript Essentials",
      subtitle: "From variables to async — a tutor-authored handbook",
      description:
        "A practical JavaScript handbook written by InTelleX tutors. Preview chapter free; full book priced in XAF.",
      fieldTags: ["programming", "javascript"],
      priceXaf: 2500,
      status: BookStatus.PUBLISHED,
      publishedAt: new Date(),
      chapters: {
        create: [
          {
            title: "Getting Started",
            content: "# Welcome\n\nThis preview chapter is free for every learner.",
            sortOrder: 0,
            isPreview: true,
          },
          {
            title: "Functions & Scope",
            content: "# Functions\n\nFull chapter unlocked after purchase.",
            sortOrder: 1,
            isPreview: false,
          },
        ],
      },
    },
  });

  await prisma.community.upsert({
    where: {
      institutionId_slug: { institutionId: intellex.id, slug: "campus" },
    },
    update: {},
    create: {
      institutionId: intellex.id,
      slug: "campus",
      name: "InTelleX Campus",
      description: "The home community for every InTelleX learner.",
      channels: {
        create: [
          { name: "announcements", slug: "announcements", type: "ANNOUNCEMENT", sortOrder: 0 },
          { name: "general", slug: "general", type: "TEXT", sortOrder: 1 },
          { name: "study-hall", slug: "study-hall", type: "STUDY_GROUP", sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.learningPath.upsert({
    where: {
      institutionId_slug: { institutionId: intellex.id, slug: "full-stack" },
    },
    update: {},
    create: {
      institutionId: intellex.id,
      categoryId: programming.id,
      slug: "full-stack",
      title: "Full Stack Developer",
      description:
        "HTML → CSS → JavaScript → React → Next.js → Node → Databases → Deployment → Portfolio → Certificate",
      isPublished: true,
    },
  });

  const counts = {
    institutions: await prisma.institution.count(),
    categories: await prisma.category.count(),
    badges: await prisma.badge.count(),
    media: await prisma.mediaRecommendation.count(),
    books: await prisma.book.count(),
    users: await prisma.user.count(),
  };

  console.log("✅ Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
