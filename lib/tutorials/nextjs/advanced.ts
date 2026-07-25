import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'nextjs-rsc-patterns',
    title: 'Advanced Server Component Patterns',
    description:
      'Use React Server Components as the default design tool in a production App Router application.',
    level: 'advanced',
    section: 'Deep Next.js',
    order: 49,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Advanced Next.js starts with one principle: render as much as possible on the server, then add client behavior only where the user actually interacts. React knowledge is not separate from this path; you learn the React skills by choosing the correct Next.js boundary.',
      },
      {
        type: 'p',
        text: 'Server Components can read files, call databases, use private environment variables, and return JSX without shipping that component code to the browser. They are ideal for product pages, dashboards, feeds, settings screens, and most route-level UI.',
      },
      { type: 'h2', text: 'Pattern 1: Fetch near the route' },
      {
        type: 'p',
        text: 'In the App Router, a page, layout, or nested Server Component can be async. Keep data requirements close to the segment that owns the UI so loading, errors, caching, and revalidation stay understandable.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Server page with route-owned data',
        code: `// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import { ProductDetails } from './product-details';
import { getProduct } from '@/lib/products';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}`,
      },
      {
        type: 'note',
        text: 'This looks like React, but the important Next.js skill is boundary choice. The page can be async because it runs on the server. No loading state is needed inside this component unless the route intentionally streams part of the UI.',
      },
      { type: 'h2', text: 'Pattern 2: Pass serializable props into client islands' },
      {
        type: 'p',
        text: 'Client Components can receive data from Server Components, but props must be serializable. Pass plain objects, strings, numbers, arrays, booleans, and null. Do not pass database clients, class instances, functions, or secrets.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Server data feeding a small client island',
        code: `// app/products/[id]/product-details.tsx
import { AddToCartButton } from './add-to-cart-button';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export function ProductDetails({ product }: { product: Product }) {
  return (
    <article>
      <p className="text-sm text-slate-500">Product</p>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>\${product.price}</p>
      <AddToCartButton productId={product.id} />
    </article>
  );
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Client island for interaction only',
        code: `// app/products/[id]/add-to-cart-button.tsx
'use client';

import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: string }) {
  const [isAdding, setIsAdding] = useState(false);

  async function handleClick() {
    setIsAdding(true);
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
    setIsAdding(false);
  }

  return (
    <button onClick={handleClick} disabled={isAdding}>
      {isAdding ? 'Adding...' : 'Add to cart'}
    </button>
  );
}`,
      },
      { type: 'h2', text: 'Pattern 3: Compose server-only helpers behind Server Components' },
      {
        type: 'p',
        text: 'Use server-only modules for database queries, CMS adapters, auth lookups, and private configuration. Import those helpers only from Server Components, Route Handlers, Server Actions, or other server-only files.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Server-only data module',
        code: `// lib/products.ts
import 'server-only';

const API_URL = process.env.PRIVATE_CATALOG_API_URL;

export async function getProduct(id: string) {
  const response = await fetch(API_URL + '/products/' + id, {
    next: { revalidate: 300 },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Unable to load product');
  }

  return response.json();
}`,
      },
      {
        type: 'warning',
        text: 'Never import a server-only module from a file with "use client". The build should protect you, but the design habit matters more: secrets and privileged data access belong behind server boundaries.',
      },
      { type: 'h2', text: 'Pattern 4: Split slow sections for streaming' },
      {
        type: 'p',
        text: 'A Server Component tree can stream with Suspense. Put slow, non-critical data behind a boundary so the primary shell can reach the browser quickly.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Streaming an expensive section',
        code: `// app/account/page.tsx
import { Suspense } from 'react';
import { AccountSummary } from './account-summary';
import { RecentInvoices } from './recent-invoices';
import { RecentInvoicesSkeleton } from './recent-invoices-skeleton';

export default function AccountPage() {
  return (
    <main>
      <AccountSummary />
      <Suspense fallback={<RecentInvoicesSkeleton />}>
        <RecentInvoices />
      </Suspense>
    </main>
  );
}`,
      },
      {
        type: 'table',
        headers: ['Decision', 'Choose this when', 'Watch for'],
        rows: [
          ['Server Component', 'The UI reads data and renders markup', 'Do not add useState or browser APIs'],
          ['Client Component', 'The UI needs event handlers, effects, or browser state', 'Keep the island small'],
          ['Route Handler', 'A browser, webhook, or third party needs an HTTP endpoint', 'Validate inputs and methods'],
          ['Server Action', 'A form or mutation belongs to the app UI', 'Revalidate affected routes'],
        ],
      },
      {
        type: 'try',
        text: 'Take an existing page and mark each component as server or client. Move one data fetch from a Client Component into the nearest Server Component and pass only serializable props down.',
      },
      {
        type: 'keypoints',
        items: [
          'Server Components are the default building block in the App Router.',
          'Client Components are islands for interaction, not the default place to fetch private data.',
          'Serializable props are the contract between server and client boundaries.',
          'Suspense lets slow server-rendered sections stream without blocking the whole route.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-composition',
    title: 'Client Islands & Composition Patterns',
    description:
      'Design interactive islands that fit cleanly inside a mostly server-rendered Next.js interface.',
    level: 'advanced',
    section: 'Deep Next.js',
    order: 50,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'A client island is a small Client Component embedded in a Server Component page. This pattern gives you a fast server-rendered shell while still using React interactivity where it matters.',
      },
      {
        type: 'p',
        text: 'The best islands have narrow props, clear ownership, and no accidental imports from server-only code. When a file starts with "use client", every component and module it imports joins the client bundle unless the import is type-only or otherwise removed at build time.',
      },
      { type: 'h2', text: 'The island boundary rule' },
      {
        type: 'ul',
        items: [
          'Put "use client" at the smallest file that needs browser behavior.',
          'Pass data down from Server Components as plain props.',
          'Keep layout, headings, lists, and database reads on the server.',
          'Move event handlers, controlled inputs, focus management, and animation state into client islands.',
        ],
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Server shell with a focused client filter',
        code: `// app/courses/page.tsx
import { CourseFilter } from './course-filter';
import { CourseGrid } from './course-grid';
import { getCourses } from '@/lib/courses';

type PageProps = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function CoursesPage({ searchParams }: PageProps) {
  const { topic = 'all' } = await searchParams;
  const courses = await getCourses({ topic });

  return (
    <main>
      <h1>Courses</h1>
      <CourseFilter selectedTopic={topic} />
      <CourseGrid courses={courses} />
    </main>
  );
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Client island updates URL state',
        code: `// app/courses/course-filter.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const topics = ['all', 'nextjs', 'javascript', 'css'];

export function CourseFilter({ selectedTopic }: { selectedTopic: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function selectTopic(topic: string) {
    const params = new URLSearchParams(searchParams);
    params.set('topic', topic);
    router.push('/courses?' + params.toString());
  }

  return (
    <div aria-label="Course topics">
      {topics.map((topic) => (
        <button
          key={topic}
          aria-pressed={topic === selectedTopic}
          onClick={() => selectTopic(topic)}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}`,
      },
      { type: 'h2', text: 'Composition with children' },
      {
        type: 'p',
        text: 'A Client Component can receive Server Component output through children. This is useful for shells, drawers, tabs, and providers where the interactive wrapper is small but the content remains server-rendered.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Client wrapper, server-rendered children',
        code: `// app/settings/settings-panel.tsx
'use client';

import { useState } from 'react';

export function SettingsPanel({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <section>
      <button onClick={() => setOpen((value) => !value)}>
        {open ? 'Hide settings' : 'Show settings'}
      </button>
      {open ? <div>{children}</div> : null}
    </section>
  );
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Server page passes server content as children',
        code: `// app/settings/page.tsx
import { SettingsPanel } from './settings-panel';
import { BillingSettings } from './billing-settings';
import { ProfileSettings } from './profile-settings';

export default function SettingsPage() {
  return (
    <main>
      <h1>Settings</h1>
      <SettingsPanel>
        <ProfileSettings />
        <BillingSettings />
      </SettingsPanel>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Provider placement' },
      {
        type: 'p',
        text: 'Providers are often Client Components because they use context. Place them as deep as possible. A theme provider may wrap the whole body. A cart provider should probably wrap only the commerce area. An editor provider should wrap only the editor route.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'A narrow provider boundary',
        code: `// app/dashboard/layout.tsx
import { DashboardShell } from './dashboard-shell';
import { DashboardPreferencesProvider } from './dashboard-preferences-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardPreferencesProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardPreferencesProvider>
  );
}`,
      },
      {
        type: 'tip',
        text: 'If a provider does not need to wrap marketing pages, public docs, or the root layout, do not put it there. Provider depth affects how much of the tree becomes client-rendered.',
      },
      {
        type: 'table',
        headers: ['Composition need', 'Pattern', 'Example'],
        rows: [
          ['Interactive control for server data', 'URL-backed client island', 'Search filters, sort order, pagination'],
          ['Temporary local UI', 'Local useState island', 'Accordion, menu, preview toggle'],
          ['Shared browser preference', 'Narrow client provider', 'Theme, dashboard density, command palette'],
          ['Server content inside interactive shell', 'children composition', 'Modal shell, settings panel, tabs'],
        ],
      },
      {
        type: 'try',
        text: 'Find a component marked "use client" and ask whether the whole file needs it. Extract one interactive button or form control into a smaller island.',
      },
      {
        type: 'keypoints',
        items: [
          'Client islands keep browser JavaScript focused on real interaction.',
          'Children composition lets server-rendered content live inside client wrappers.',
          'Providers should be placed at the narrowest useful boundary.',
          'URL state is often better than local state for filters that should be shareable or reload-safe.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-performance',
    title: 'Performance, Bundles & Streaming',
    description:
      'Improve real-world Next.js performance by reducing client JavaScript, streaming routes, and measuring the right signals.',
    level: 'advanced',
    section: 'Deep Next.js',
    order: 51,
    minutes: 19,
    content: [
      {
        type: 'p',
        text: 'Next.js performance is not one trick. It is a chain of decisions: what runs on the server, what ships to the browser, when data is cached, when UI streams, and how media is delivered.',
      },
      {
        type: 'p',
        text: 'The most reliable optimization is architectural: keep non-interactive UI as Server Components. Smaller client bundles usually improve loading, hydration, parsing, and interaction readiness.',
      },
      { type: 'h2', text: 'Measure before changing code' },
      {
        type: 'code',
        language: 'bash',
        title: 'Build and inspect the production output',
        code: `npm run build
npm run start`,
      },
      {
        type: 'ul',
        items: [
          'Check the route sizes printed by the build.',
          'Use browser Performance and Network panels on a production build.',
          'Watch Core Web Vitals: LCP, INP, CLS, and TTFB.',
          'Compare cold loads, cached loads, and slow-network behavior.',
        ],
      },
      { type: 'h2', text: 'Reduce accidental client bundles' },
      {
        type: 'p',
        text: 'A common performance bug is placing "use client" too high. That can pull large UI trees, utility modules, date libraries, charting packages, and markdown renderers into the browser.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Keep expensive formatting on the server',
        code: `// app/reports/report-table.tsx
import { formatCurrency, formatDate } from '@/lib/formatters';

type Row = {
  id: string;
  customer: string;
  total: number;
  createdAt: string;
};

export function ReportTable({ rows }: { rows: Row[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Customer</th>
          <th>Total</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.customer}</td>
            <td>{formatCurrency(row.total)}</td>
            <td>{formatDate(row.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
      },
      { type: 'h2', text: 'Stream slow areas' },
      {
        type: 'p',
        text: 'Use route-level loading files for whole segment loading states. Use Suspense inside a route when one part of the page is slower than the rest.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Route loading file',
        code: `// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <main aria-busy="true">
      <div className="h-8 w-48 rounded bg-slate-200" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="h-32 rounded bg-slate-200" />
        <div className="h-32 rounded bg-slate-200" />
        <div className="h-32 rounded bg-slate-200" />
      </div>
    </main>
  );
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Fine-grained Suspense streaming',
        code: `// app/dashboard/page.tsx
import { Suspense } from 'react';
import { RevenueChart } from './revenue-chart';
import { RevenueChartSkeleton } from './revenue-chart-skeleton';
import { MetricsCards } from './metrics-cards';

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
      <MetricsCards />
      <Suspense fallback={<RevenueChartSkeleton />}>
        <RevenueChart />
      </Suspense>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Use dynamic imports for rare client features' },
      {
        type: 'p',
        text: 'If a client-only feature is large and not needed immediately, dynamically import it. This is useful for rich editors, charts, maps, command palettes, and admin-only tools.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Lazy-load a heavy client widget',
        code: `// app/admin/editor/page.tsx
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('./rich-text-editor'), {
  loading: () => <p>Loading editor...</p>,
});

export default function EditorPage() {
  return (
    <main>
      <h1>Editor</h1>
      <RichTextEditor />
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Optimize images and fonts' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Image and font defaults',
        code: `// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Intellex',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}`,
      },
      {
        type: 'table',
        headers: ['Problem', 'Next.js tool', 'Production habit'],
        rows: [
          ['Large JS', 'Server Components and smaller islands', 'Move non-interactive work out of client files'],
          ['Slow data section', 'Suspense and loading.tsx', 'Stream independent areas'],
          ['Huge optional widget', 'dynamic import', 'Load only when the route needs it'],
          ['Poor LCP image', 'next/image', 'Set sizes, priority only for the true hero image'],
          ['Font layout shift', 'next/font', 'Use display swap and stable font loading'],
        ],
      },
      {
        type: 'try',
        text: 'Run a production build, choose one route, and list every Client Component on it. Identify one component or dependency that can move back to the server.',
      },
      {
        type: 'keypoints',
        items: [
          'Server Components are the biggest bundle optimization in App Router apps.',
          'Streaming improves perceived speed when slow sections are separated by Suspense.',
          'Dynamic imports are best for large, optional client features.',
          'Performance work should be measured in production builds, not only in dev mode.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-security',
    title: 'Security Essentials for Next.js Apps',
    description:
      'Protect production Next.js applications with server boundaries, validation, auth checks, safe redirects, and secure headers.',
    level: 'advanced',
    section: 'Deep Next.js',
    order: 52,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'Security in Next.js is mostly about boundaries. Keep secrets on the server, validate untrusted input, authorize every sensitive action, and be careful with redirects, cookies, and rendered HTML.',
      },
      {
        type: 'p',
        text: 'The App Router gives you strong tools: Server Components, Route Handlers, middleware, Server Actions, and Metadata. None of them replace careful ownership of data and permissions.',
      },
      { type: 'h2', text: 'Keep secrets server-only' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Private data access belongs on the server',
        code: `// lib/account.ts
import 'server-only';

export async function getBillingAccount(userId: string) {
  const response = await fetch(process.env.BILLING_API_URL + '/accounts/' + userId, {
    headers: {
      Authorization: 'Bearer ' + process.env.BILLING_API_TOKEN,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Unable to load billing account');
  }

  return response.json();
}`,
      },
      {
        type: 'warning',
        text: 'Only variables prefixed with NEXT_PUBLIC_ should be expected in browser code. Never put private API keys, signing secrets, database URLs, or admin tokens in client-accessible modules.',
      },
      { type: 'h2', text: 'Validate Route Handler input' },
      {
        type: 'p',
        text: 'Route Handlers are public HTTP endpoints unless you explicitly protect them. Validate method, body shape, authentication, authorization, and rate-sensitive behavior.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'A defensive Route Handler',
        code: `// app/api/contact/route.ts
import { NextResponse } from 'next/server';

function isContactPayload(value: unknown): value is { email: string; message: string } {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as { email?: unknown; message?: unknown };

  return (
    typeof payload.email === 'string' &&
    payload.email.includes('@') &&
    typeof payload.message === 'string' &&
    payload.message.trim().length >= 10
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!isContactPayload(body)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  await saveContactMessage({
    email: body.email.toLowerCase(),
    message: body.message.trim(),
  });

  return NextResponse.json({ ok: true });
}

async function saveContactMessage(payload: { email: string; message: string }) {
  console.log('Save contact message', payload.email);
}`,
      },
      { type: 'h2', text: 'Authorize server-rendered routes' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Protect a dashboard page',
        code: `// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { DashboardHome } from './dashboard-home';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'admin') {
    redirect('/account');
  }

  return <DashboardHome user={user} />;
}`,
      },
      {
        type: 'note',
        text: 'Middleware can be useful for coarse redirects, but sensitive authorization should still happen where the protected data is read or mutated.',
      },
      { type: 'h2', text: 'Use safe redirects' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Avoid open redirects',
        code: `// lib/safe-redirect.ts
export function safeRedirectPath(value: string | null, fallback = '/') {
  if (!value) {
    return fallback;
  }

  if (!value.startsWith('/') || value.startsWith('//')) {
    return fallback;
  }

  return value;
}`,
      },
      { type: 'h2', text: 'Add security headers' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Baseline security headers',
        code: `// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;`,
      },
      {
        type: 'table',
        headers: ['Risk', 'Fix', 'Where'],
        rows: [
          ['Secret leaked to browser', 'Use server-only modules and no NEXT_PUBLIC_ prefix', 'lib/server modules'],
          ['Unauthorized data access', 'Check user and role before reading or mutating', 'Pages, actions, route handlers'],
          ['Bad request body', 'Validate unknown input before trusting it', 'Route handlers and actions'],
          ['Open redirect', 'Allow only same-origin relative paths', 'Login and checkout flows'],
          ['Unsafe HTML', 'Avoid dangerouslySetInnerHTML unless sanitized', 'Content rendering'],
        ],
      },
      {
        type: 'try',
        text: 'Review one form submission path. Identify where the input is validated, where the user is authorized, and which route or cache is revalidated after success.',
      },
      {
        type: 'keypoints',
        items: [
          'Server boundaries protect secrets only when imports are kept clean.',
          'Every HTTP endpoint and mutation receives untrusted input.',
          'Authorization belongs close to protected data access.',
          'Security headers help, but they do not replace validation and authorization.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-architecture',
    title: 'Structuring a Production Next.js App',
    description:
      'Organize App Router projects by routes, features, shared UI, server modules, and production ownership boundaries.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 53,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'A production Next.js structure should make ownership obvious. Routes describe screens and URL segments. Feature folders describe product behavior. Shared modules hold reusable UI, utilities, and server adapters.',
      },
      {
        type: 'p',
        text: 'There is no universal folder structure, but good structures minimize guessing: where routes live, where data access lives, where mutations live, and what can be imported by client code.',
      },
      { type: 'h2', text: 'A practical production structure' },
      {
        type: 'code',
        language: 'bash',
        title: 'App Router architecture map',
        code: `app/
  (marketing)/
    page.tsx
    pricing/page.tsx
  (app)/
    dashboard/page.tsx
    settings/page.tsx
  api/
    webhooks/stripe/route.ts
  layout.tsx
  globals.css
components/
  ui/
    button.tsx
    card.tsx
features/
  billing/
    actions.ts
    components/
    queries.ts
  courses/
    components/
    queries.ts
lib/
  auth.ts
  env.ts
  format.ts
  db.ts`,
      },
      {
        type: 'ul',
        items: [
          'Use app/ for routes, layouts, route handlers, loading states, and error states.',
          'Use route groups like (marketing) and (app) to organize without changing URLs.',
          'Use features/ for product-specific components, queries, and actions.',
          'Use components/ui/ for reusable visual primitives that do not know product data.',
          'Use lib/ for cross-cutting utilities, server adapters, auth, environment parsing, and formatting.',
        ],
      },
      { type: 'h2', text: 'Separate route UI from feature logic' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Thin route, feature-owned behavior',
        code: `// app/(app)/billing/page.tsx
import { BillingOverview } from '@/features/billing/components/billing-overview';
import { getBillingOverview } from '@/features/billing/queries';

export default async function BillingPage() {
  const overview = await getBillingOverview();

  return <BillingOverview overview={overview} />;
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Feature query stays server-only',
        code: `// features/billing/queries.ts
import 'server-only';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

export async function getBillingOverview() {
  const user = await requireUser();

  return db.billingAccount.findUniqueOrThrow({
    where: { userId: user.id },
  });
}`,
      },
      { type: 'h2', text: 'Use route groups for different shells' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Marketing layout',
        code: `// app/(marketing)/layout.tsx
import { MarketingHeader } from '@/components/marketing-header';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingHeader />
      {children}
    </>
  );
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Authenticated app layout',
        code: `// app/(app)/layout.tsx
import { redirect } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { getCurrentUser } from '@/lib/auth';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="grid min-h-screen grid-cols-[16rem_1fr]">
      <AppSidebar user={user} />
      <main>{children}</main>
    </div>
  );
}`,
      },
      { type: 'h2', text: 'Name files by responsibility' },
      {
        type: 'table',
        headers: ['File kind', 'Typical contents', 'Import rule'],
        rows: [
          ['page.tsx', 'Route entry and data orchestration', 'Can import server and shared modules'],
          ['layout.tsx', 'Persistent shell for a segment', 'Keep auth checks close to protected shells'],
          ['queries.ts', 'Server reads', 'Add server-only and avoid client imports'],
          ['actions.ts', 'Server mutations', 'Validate input and revalidate routes'],
          ['components/ui', 'Reusable visual primitives', 'No product-specific data fetching'],
        ],
      },
      {
        type: 'tip',
        text: 'Architectures fail when folders hide responsibility. A boring, predictable structure is easier to onboard into than a clever one.',
      },
      {
        type: 'try',
        text: 'Sketch a folder map for a learning platform with marketing pages, course lessons, billing, and admin tools. Mark which folders are route-owned and which are feature-owned.',
      },
      {
        type: 'keypoints',
        items: [
          'Use app/ for URL structure and route lifecycle files.',
          'Use feature folders for product behavior that spans multiple routes.',
          'Keep reusable UI separate from domain-specific components.',
          'Server-only query modules make import boundaries easier to enforce.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-state-strategy',
    title: 'State Strategy: Server, URL, Context, Local',
    description:
      'Choose the right state location in a Next.js app and see how practical React mastery emerges from App Router decisions.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 54,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This is where the Next.js-first path pays off. You did not need a separate React course before building real apps; you learned the practical React skills Next.js needs by deciding where state belongs.',
      },
      {
        type: 'p',
        text: 'The advanced question is not "How do I put this in React state?" The better question is "Which layer should own this truth: the server, the URL, context, or local component state?"',
      },
      { type: 'h2', text: 'The state decision ladder' },
      {
        type: 'ol',
        items: [
          'If the value comes from a database, CMS, session, or API, start with server state.',
          'If the value should survive refresh, be shareable, or affect the current route, use URL state.',
          'If many client islands need the same browser-only preference, use context.',
          'If the value is temporary and belongs to one interaction, use local useState.',
        ],
      },
      { type: 'h2', text: 'Server state: authoritative data' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Server state rendered by the page',
        code: `// app/courses/[slug]/page.tsx
import { getCourse } from '@/features/courses/queries';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourse(slug);

  return (
    <main>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'URL state: shareable view choices' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Search params drive server-rendered filtering',
        code: `// app/library/page.tsx
import { LibraryFilters } from './library-filters';
import { getLessons } from '@/features/library/queries';

type PageProps = {
  searchParams: Promise<{ q?: string; level?: string }>;
};

export default async function LibraryPage({ searchParams }: PageProps) {
  const filters = await searchParams;
  const lessons = await getLessons({
    query: filters.q ?? '',
    level: filters.level ?? 'all',
  });

  return (
    <main>
      <LibraryFilters defaultQuery={filters.q ?? ''} defaultLevel={filters.level ?? 'all'} />
      <LessonList lessons={lessons} />
    </main>
  );
}

function LessonList({ lessons }: { lessons: Array<{ id: string; title: string }> }) {
  return (
    <ul>
      {lessons.map((lesson) => (
        <li key={lesson.id}>{lesson.title}</li>
      ))}
    </ul>
  );
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Client island writes URL state',
        code: `// app/library/library-filters.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LibraryFilters({
  defaultQuery,
  defaultLevel,
}: {
  defaultQuery: string;
  defaultLevel: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [level, setLevel] = useState(defaultLevel);

  function applyFilters() {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (level !== 'all') params.set('level', level);
    router.push('/library?' + params.toString());
  }

  return (
    <form action={applyFilters}>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <select value={level} onChange={(event) => setLevel(event.target.value)}>
        <option value="all">All levels</option>
        <option value="beginner">Beginner</option>
        <option value="advanced">Advanced</option>
      </select>
      <button type="submit">Apply</button>
    </form>
  );
}`,
      },
      { type: 'h2', text: 'Context: shared browser preferences' },
      {
        type: 'code',
        language: 'tsx',
        title: 'A small context provider',
        code: `// app/(app)/dashboard-density-provider.tsx
'use client';

import { createContext, useContext, useMemo, useState } from 'react';

type Density = 'comfortable' | 'compact';

const DensityContext = createContext<{
  density: Density;
  setDensity: (density: Density) => void;
} | null>(null);

export function DashboardDensityProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensity] = useState<Density>('comfortable');
  const value = useMemo(() => ({ density, setDensity }), [density]);

  return <DensityContext.Provider value={value}>{children}</DensityContext.Provider>;
}

export function useDashboardDensity() {
  const context = useContext(DensityContext);

  if (!context) {
    throw new Error('useDashboardDensity must be used inside DashboardDensityProvider');
  }

  return context;
}`,
      },
      { type: 'h2', text: 'Local state: temporary interaction' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Local state for a focused UI detail',
        code: `// components/disclosure.tsx
'use client';

import { useState } from 'react';

export function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {title}
      </button>
      {open ? <div>{children}</div> : null}
    </section>
  );
}`,
      },
      {
        type: 'table',
        headers: ['State type', 'Use when', 'Example'],
        rows: [
          ['Server data', 'The source of truth is external or protected', 'User, invoices, lessons, permissions'],
          ['URL state', 'The state should be shareable or reload-safe', 'Search, filters, page, selected tab'],
          ['Context', 'Multiple client islands share browser-only state', 'Theme, density, command palette'],
          ['Local useState', 'Temporary state belongs to one component', 'Menu open, input draft, hover preview'],
        ],
      },
      {
        type: 'note',
        text: 'This is practical React mastery: useState, context, props, forms, and effects make sense because you know when the browser should own state and when Next.js should keep the server or URL in charge.',
      },
      {
        type: 'try',
        text: 'For a dashboard with search, a sidebar toggle, account data, and a theme switcher, classify each piece as server, URL, context, or local state. Explain why.',
      },
      {
        type: 'keypoints',
        items: [
          'Next.js-first learning embeds the React concepts you actually need.',
          'Server data is the default for authoritative application truth.',
          'URL state is ideal for shareable route-level choices.',
          'Context is for shared client preferences, not a replacement for server data.',
          'Local state is best for temporary, component-owned interaction.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-testing-mindset',
    title: 'Debugging & Testing Mindset',
    description:
      'Develop a production debugging workflow and choose targeted tests for App Router behavior.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 55,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Testing a Next.js app is not about covering every line. It is about protecting the behaviors that would hurt users or the business if they broke: auth, routing, forms, data fetching, rendering states, and critical UI flows.',
      },
      {
        type: 'p',
        text: 'A strong debugging mindset starts with reproduction. Identify the route, environment, data shape, user permissions, network state, and whether the issue happens in development, production build, or both.',
      },
      { type: 'h2', text: 'Debug by boundary' },
      {
        type: 'table',
        headers: ['Symptom', 'Check first', 'Likely boundary'],
        rows: [
          ['Works in dev, fails in build', 'Static rendering, env vars, server-only imports', 'Build and runtime config'],
          ['Button does nothing', 'Missing "use client" or event handler location', 'Client island'],
          ['Private data visible', 'Authorization and cache configuration', 'Server data boundary'],
          ['Stale UI after mutation', 'Revalidation path or tag', 'Cache invalidation'],
          ['Hydration warning', 'Different server/client render output', 'Client rendering'],
        ],
      },
      { type: 'h2', text: 'Use production builds for truth' },
      {
        type: 'code',
        language: 'bash',
        title: 'Local production check',
        code: `npm run lint
npm run build
npm run start`,
      },
      {
        type: 'p',
        text: 'Development mode is optimized for feedback. Production mode reveals static generation, caching, minification, route output, and bundling behavior more accurately.',
      },
      { type: 'h2', text: 'Test the contract, not the framework' },
      {
        type: 'p',
        text: 'Do not test that Next.js calls your page function. Test your app contract: unauthenticated users redirect, valid users see data, invalid forms show errors, and successful mutations update the visible route.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Extract logic for simple unit tests',
        code: `// lib/safe-redirect.ts
export function safeRedirectPath(value: string | null, fallback = '/') {
  if (!value) return fallback;
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
}

// lib/safe-redirect.test.ts
import { safeRedirectPath } from './safe-redirect';

test('keeps same-site redirects', () => {
  expect(safeRedirectPath('/dashboard')).toBe('/dashboard');
});

test('rejects external redirects', () => {
  expect(safeRedirectPath('https://evil.test')).toBe('/');
});`,
      },
      { type: 'h2', text: 'Add integration tests around routes and forms' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Testing a form component contract',
        code: `// components/newsletter-form.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewsletterForm } from './newsletter-form';

test('requires an email address', async () => {
  const user = userEvent.setup();
  render(<NewsletterForm />);

  await user.click(screen.getByRole('button', { name: /subscribe/i }));

  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});`,
      },
      { type: 'h2', text: 'Manual QA checklist' },
      {
        type: 'ul',
        items: [
          'Load the route directly and by client navigation.',
          'Refresh after changing filters or tabs.',
          'Try slow network and disabled JavaScript when possible.',
          'Test logged-out, logged-in, and unauthorized users.',
          'Submit invalid, valid, duplicate, and expired form states.',
          'Check loading, empty, error, and success UI.',
        ],
      },
      {
        type: 'tip',
        text: 'The best test is often a small extracted function plus one end-to-end flow. Use broad tests for flows and narrow tests for tricky logic.',
      },
      {
        type: 'try',
        text: 'Pick one critical route and write a debugging checklist for it. Include data source, auth requirement, loading state, empty state, error state, and mutation behavior.',
      },
      {
        type: 'keypoints',
        items: [
          'Reproduce issues by route, user, data, and environment.',
          'Production builds reveal behavior that dev mode can hide.',
          'Test user-visible contracts more than framework internals.',
          'Protect high-risk flows with integration or end-to-end tests.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-project-portfolio',
    title: 'Mini Project: Personal Portfolio',
    description:
      'Build a polished App Router portfolio with metadata, reusable sections, project cards, and responsive styling.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 56,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This capstone builds a production-style personal portfolio. The goal is not a giant app; it is a focused route that demonstrates App Router structure, Server Components, metadata, responsive layout, and reusable sections.',
      },
      { type: 'h2', text: 'Step 1: Create the file structure' },
      {
        type: 'code',
        language: 'bash',
        title: 'Portfolio files',
        code: `app/
  page.tsx
  layout.tsx
  globals.css
components/
  portfolio/
    hero.tsx
    project-card.tsx
    skills.tsx
lib/
  portfolio.ts`,
      },
      { type: 'h2', text: 'Step 2: Add portfolio data' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Project and skill data',
        code: `// lib/portfolio.ts
export const profile = {
  name: 'Ada Moreno',
  role: 'Next.js Developer',
  summary:
    'I build fast, accessible web apps with the App Router, clean UI systems, and production-minded architecture.',
  location: 'Remote',
};

export const projects = [
  {
    title: 'Intellex Learning Hub',
    description: 'A tutorial platform with structured lessons, progress-friendly content, and polished route design.',
    href: 'https://example.com/intellex',
    tags: ['Next.js', 'Content', 'Accessibility'],
  },
  {
    title: 'Commerce Metrics',
    description: 'A dashboard shell for revenue, subscriptions, and customer health metrics.',
    href: 'https://example.com/metrics',
    tags: ['Dashboard', 'Server Components', 'Charts'],
  },
  {
    title: 'Launch Pages',
    description: 'Reusable marketing sections for SaaS launches and product experiments.',
    href: 'https://example.com/launch',
    tags: ['SEO', 'Design Systems', 'Performance'],
  },
];

export const skills = ['App Router', 'Server Components', 'TypeScript', 'Accessibility', 'SEO'];`,
      },
      { type: 'h2', text: 'Step 3: Build the hero section' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Hero component',
        code: `// components/portfolio/hero.tsx
import { profile } from '@/lib/portfolio';

export function Hero() {
  return (
    <section className="rounded-3xl bg-slate-950 px-6 py-16 text-white md:px-12">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
        {profile.location}
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
        {profile.name} builds production-ready learning experiences.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-slate-300">{profile.summary}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a className="rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950" href="#projects">
          View projects
        </a>
        <a className="rounded-full border border-white/30 px-5 py-3 font-semibold" href="mailto:ada@example.com">
          Contact
        </a>
      </div>
    </section>
  );
}`,
      },
      { type: 'h2', text: 'Step 4: Build reusable project cards' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Project card component',
        code: `// components/portfolio/project-card.tsx
type ProjectCardProps = {
  title: string;
  description: string;
  href: string;
  tags: string[];
};

export function ProjectCard({ title, description, href, tags }: ProjectCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 text-slate-600">{description}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            {tag}
          </li>
        ))}
      </ul>
      <a className="mt-6 inline-block font-semibold text-cyan-700" href={href}>
        Read case study
      </a>
    </article>
  );
}`,
      },
      { type: 'h2', text: 'Step 5: Add skills' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Skills component',
        code: `// components/portfolio/skills.tsx
import { skills } from '@/lib/portfolio';

export function Skills() {
  return (
    <section className="rounded-3xl bg-slate-100 p-6 md:p-10">
      <h2 className="text-2xl font-bold text-slate-950">Core skills</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span key={skill} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}`,
      },
      { type: 'h2', text: 'Step 6: Assemble the page and metadata' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Portfolio page',
        code: `// app/page.tsx
import type { Metadata } from 'next';
import { Hero } from '@/components/portfolio/hero';
import { ProjectCard } from '@/components/portfolio/project-card';
import { Skills } from '@/components/portfolio/skills';
import { profile, projects } from '@/lib/portfolio';

export const metadata: Metadata = {
  title: profile.name + ' | ' + profile.role,
  description: profile.summary,
};

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-10">
      <Hero />
      <section id="projects">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Selected work</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">Projects</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>
      <Skills />
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Step 7: Add global polish' },
      {
        type: 'code',
        language: 'css',
        title: 'Global CSS baseline',
        code: `/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: #f8fafc;
  color: #0f172a;
}`,
      },
      {
        type: 'try',
        text: 'Extend the portfolio with a /resume route. Reuse the same data file, add route metadata, and include a downloadable resume link.',
      },
      {
        type: 'keypoints',
        items: [
          'A portfolio is a great place to practice Server Components because most content is static or server-rendered.',
          'Metadata should be owned by the route it describes.',
          'Reusable cards and sections keep the page easy to expand.',
          'Polish includes spacing, responsive layout, accessible links, and meaningful copy.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-project-blog',
    title: 'Mini Project: Blog with Markdown/MDX-style Content',
    description:
      'Build a file-backed blog pattern with dynamic routes, generated metadata, static params, and content rendering.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 57,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This mini project creates a Markdown/MDX-style blog without requiring a full MDX pipeline. You will model posts as structured files, generate routes, render content, and add metadata.',
      },
      { type: 'h2', text: 'Step 1: Create the file structure' },
      {
        type: 'code',
        language: 'bash',
        title: 'Blog files',
        code: `app/
  blog/
    page.tsx
    [slug]/
      page.tsx
components/
  blog/
    post-card.tsx
    prose.tsx
content/
  posts.ts
lib/
  blog.ts`,
      },
      { type: 'h2', text: 'Step 2: Store MDX-style content as structured data' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Post content',
        code: `// content/posts.ts
export const posts = [
  {
    slug: 'server-components-first',
    title: 'Server Components First',
    description: 'How to think about default server rendering in the App Router.',
    date: '2026-01-15',
    sections: [
      {
        heading: 'Start with the route',
        body: 'A route can fetch data, render markup, and stream slow sections before a Client Component is needed.',
      },
      {
        heading: 'Add islands later',
        body: 'Use Client Components for event handlers, browser APIs, and temporary interaction state.',
      },
    ],
  },
  {
    slug: 'url-state-for-filters',
    title: 'URL State for Filters',
    description: 'Make search and filter state refresh-safe and shareable.',
    date: '2026-02-02',
    sections: [
      {
        heading: 'URLs are product state',
        body: 'If a filtered view should be shareable, the URL is usually the right home for that state.',
      },
    ],
  },
];`,
      },
      { type: 'h2', text: 'Step 3: Add blog helper functions' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Blog helpers',
        code: `// lib/blog.ts
import { posts } from '@/content/posts';

export type BlogPost = (typeof posts)[number];

export function getAllPosts() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getPostSlugs() {
  return posts.map((post) => post.slug);
}`,
      },
      { type: 'h2', text: 'Step 4: Build post cards' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Post card component',
        code: `// components/blog/post-card.tsx
import Link from 'next/link';
import type { BlogPost } from '@/lib/blog';

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="rounded-2xl border border-slate-200 p-6">
      <p className="text-sm text-slate-500">{post.date}</p>
      <h2 className="mt-2 text-2xl font-bold">
        <Link href={'/blog/' + post.slug}>{post.title}</Link>
      </h2>
      <p className="mt-3 text-slate-600">{post.description}</p>
    </article>
  );
}`,
      },
      { type: 'h2', text: 'Step 5: Build the blog index' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Blog index page',
        code: `// app/blog/page.tsx
import type { Metadata } from 'next';
import { PostCard } from '@/components/blog/post-card';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog | Intellex Notes',
  description: 'Practical notes about building production Next.js apps.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-bold">Blog</h1>
      <p className="mt-3 text-slate-600">Notes on App Router architecture, performance, and product polish.</p>
      <div className="mt-8 grid gap-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Step 6: Render the post route' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Dynamic post page',
        code: `// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPostSlugs } from '@/lib/blog';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post not found' };
  }

  return {
    title: post.title + ' | Intellex Notes',
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-slate-500">{post.date}</p>
      <h1 className="mt-3 text-4xl font-bold">{post.title}</h1>
      <p className="mt-4 text-xl text-slate-600">{post.description}</p>
      <article className="mt-10 space-y-8">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-semibold">{section.heading}</h2>
            <p className="mt-3 leading-7 text-slate-700">{section.body}</p>
          </section>
        ))}
      </article>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Step 7: Upgrade path to real MDX' },
      {
        type: 'p',
        text: 'When you need author-friendly Markdown files, replace content/posts.ts with a real MDX pipeline. Keep the same route shape: get all posts, get one post by slug, generate static params, and generate metadata.',
      },
      {
        type: 'try',
        text: 'Add a tag field to each post. Then add /blog?tag=nextjs filtering using searchParams on the blog index page.',
      },
      {
        type: 'keypoints',
        items: [
          'A blog is mostly server-rendered content, so it fits the App Router well.',
          'Dynamic routes pair naturally with generateStaticParams for known content.',
          'generateMetadata keeps sharing text aligned with each post.',
          'Structured content can be a stepping stone toward a full MDX setup.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-project-dashboard',
    title: 'Mini Project: Admin Dashboard Shell',
    description:
      'Build an authenticated dashboard shell with route groups, summary cards, table UI, loading states, and URL filters.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 58,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project builds a dashboard shell: the kind of structure you can later connect to a database, auth provider, and charting library. The focus is App Router layout composition and production-friendly state choices.',
      },
      { type: 'h2', text: 'Step 1: Create the file structure' },
      {
        type: 'code',
        language: 'bash',
        title: 'Dashboard files',
        code: `app/
  (admin)/
    layout.tsx
    dashboard/
      loading.tsx
      page.tsx
      users-table.tsx
      status-filter.tsx
components/
  admin/
    sidebar.tsx
    stat-card.tsx
lib/
  admin-data.ts`,
      },
      { type: 'h2', text: 'Step 2: Add mock server data' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Admin data helpers',
        code: `// lib/admin-data.ts
import 'server-only';

const users = [
  { id: '1', name: 'Maya Chen', email: 'maya@example.com', status: 'active', plan: 'Pro' },
  { id: '2', name: 'Noah Patel', email: 'noah@example.com', status: 'trial', plan: 'Starter' },
  { id: '3', name: 'Lena Ortiz', email: 'lena@example.com', status: 'active', plan: 'Team' },
  { id: '4', name: 'Sam Reed', email: 'sam@example.com', status: 'paused', plan: 'Pro' },
];

export async function getDashboardStats() {
  return {
    revenue: '$42,800',
    users: users.length,
    churn: '2.1%',
  };
}

export async function getUsers(status: string) {
  if (status === 'all') {
    return users;
  }

  return users.filter((user) => user.status === status);
}`,
      },
      { type: 'h2', text: 'Step 3: Create the dashboard shell layout' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Admin layout',
        code: `// app/(admin)/layout.tsx
import { Sidebar } from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-slate-100 md:grid-cols-[16rem_1fr]">
      <Sidebar />
      <main className="p-6 md:p-10">{children}</main>
    </div>
  );
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Sidebar component',
        code: `// components/admin/sidebar.tsx
import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="border-r border-slate-200 bg-white p-6">
      <p className="text-lg font-bold">Admin</p>
      <nav className="mt-8 grid gap-3">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard?status=active">Active users</Link>
        <Link href="/dashboard?status=trial">Trials</Link>
      </nav>
    </aside>
  );
}`,
      },
      { type: 'h2', text: 'Step 4: Add cards and a loading state' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Stat card component',
        code: `// components/admin/stat-card.tsx
export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
    </article>
  );
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Dashboard loading UI',
        code: `// app/(admin)/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div aria-busy="true" className="space-y-6">
      <div className="h-10 w-48 rounded bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 rounded-2xl bg-slate-200" />
        <div className="h-32 rounded-2xl bg-slate-200" />
        <div className="h-32 rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}`,
      },
      { type: 'h2', text: 'Step 5: Use URL state for filtering' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Status filter client island',
        code: `// app/(admin)/dashboard/status-filter.tsx
'use client';

import { useRouter } from 'next/navigation';

const statuses = ['all', 'active', 'trial', 'paused'];

export function StatusFilter({ selected }: { selected: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <button
          key={status}
          aria-pressed={selected === status}
          className="rounded-full border px-4 py-2"
          onClick={() => router.push('/dashboard?status=' + status)}
        >
          {status}
        </button>
      ))}
    </div>
  );
}`,
      },
      { type: 'h2', text: 'Step 6: Render the table' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Users table',
        code: `// app/(admin)/dashboard/users-table.tsx
type User = {
  id: string;
  name: string;
  email: string;
  status: string;
  plan: string;
};

export function UsersTable({ users }: { users: User[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Status</th>
            <th className="p-4">Plan</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-100">
              <td className="p-4 font-medium">{user.name}</td>
              <td className="p-4 text-slate-600">{user.email}</td>
              <td className="p-4">{user.status}</td>
              <td className="p-4">{user.plan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      },
      { type: 'h2', text: 'Step 7: Assemble the dashboard page' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Dashboard page',
        code: `// app/(admin)/dashboard/page.tsx
import { StatCard } from '@/components/admin/stat-card';
import { getDashboardStats, getUsers } from '@/lib/admin-data';
import { StatusFilter } from './status-filter';
import { UsersTable } from './users-table';

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const { status = 'all' } = await searchParams;
  const [stats, users] = await Promise.all([getDashboardStats(), getUsers(status)]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Overview</p>
        <h1 className="mt-2 text-4xl font-bold">Dashboard</h1>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Revenue" value={stats.revenue} />
        <StatCard label="Users" value={stats.users} />
        <StatCard label="Churn" value={stats.churn} />
      </section>
      <section className="space-y-4">
        <StatusFilter selected={status} />
        <UsersTable users={users} />
      </section>
    </div>
  );
}`,
      },
      {
        type: 'try',
        text: 'Add an empty state when no users match the selected status. Then add a role check to the admin layout before rendering the shell.',
      },
      {
        type: 'keypoints',
        items: [
          'Dashboard shells are a strong use case for route groups and nested layouts.',
          'Summary cards and tables can stay server-rendered when they are not interactive.',
          'Filters belong in the URL when the view should survive refresh and be shareable.',
          'loading.tsx gives route segments immediate feedback while data loads.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-project-saas',
    title: 'Mini Project: SaaS Landing + Auth Shell',
    description:
      'Build a SaaS marketing page, pricing section, login shell, and authenticated app layout foundation.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 59,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project combines a public SaaS landing page with the shell of an authenticated product. It is a realistic architecture starter: marketing routes are public, auth routes are separate, and app routes use a protected layout.',
      },
      { type: 'h2', text: 'Step 1: Create route groups' },
      {
        type: 'code',
        language: 'bash',
        title: 'SaaS app files',
        code: `app/
  (marketing)/
    page.tsx
    pricing/page.tsx
  (auth)/
    login/page.tsx
  (app)/
    layout.tsx
    app/page.tsx
components/
  marketing/
    hero.tsx
    pricing-card.tsx
  product/
    app-nav.tsx
lib/
  plans.ts
  session.ts`,
      },
      { type: 'h2', text: 'Step 2: Define plans' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Pricing data',
        code: `// lib/plans.ts
export const plans = [
  {
    name: 'Starter',
    price: '$19',
    description: 'For solo builders validating a product.',
    features: ['One workspace', 'Basic analytics', 'Email support'],
  },
  {
    name: 'Growth',
    price: '$49',
    description: 'For teams building a repeatable acquisition engine.',
    features: ['Five workspaces', 'Advanced analytics', 'Priority support'],
  },
  {
    name: 'Scale',
    price: 'Custom',
    description: 'For companies with security and onboarding needs.',
    features: ['Unlimited workspaces', 'SSO options', 'Dedicated success'],
  },
];`,
      },
      { type: 'h2', text: 'Step 3: Build the marketing hero' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Hero section',
        code: `// components/marketing/hero.tsx
import Link from 'next/link';

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">
        SaaS starter
      </p>
      <h1 className="mt-5 text-5xl font-bold tracking-tight text-slate-950 md:text-7xl">
        Launch your product dashboard faster.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
        A production-minded Next.js shell for marketing, pricing, login, and authenticated product routes.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white" href="/login">
          Start free
        </Link>
        <Link className="rounded-full border border-slate-300 px-6 py-3 font-semibold" href="/pricing">
          View pricing
        </Link>
      </div>
    </section>
  );
}`,
      },
      { type: 'h2', text: 'Step 4: Build pricing cards' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Pricing card component',
        code: `// components/marketing/pricing-card.tsx
type PricingCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
};

export function PricingCard({ name, price, description, features }: PricingCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="mt-3 text-slate-600">{description}</p>
      <p className="mt-6 text-4xl font-bold">{price}</p>
      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="text-slate-700">
            {feature}
          </li>
        ))}
      </ul>
      <a className="mt-8 inline-block rounded-full bg-cyan-600 px-5 py-3 font-semibold text-white" href="/login">
        Choose {name}
      </a>
    </article>
  );
}`,
      },
      { type: 'h2', text: 'Step 5: Assemble marketing and pricing routes' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Landing page',
        code: `// app/(marketing)/page.tsx
import type { Metadata } from 'next';
import { Hero } from '@/components/marketing/hero';

export const metadata: Metadata = {
  title: 'SaaS Starter | Launch faster',
  description: 'A clean SaaS landing page and app shell built with Next.js.',
};

export default function MarketingHomePage() {
  return (
    <main>
      <Hero />
    </main>
  );
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Pricing page',
        code: `// app/(marketing)/pricing/page.tsx
import { PricingCard } from '@/components/marketing/pricing-card';
import { plans } from '@/lib/plans';

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-center text-4xl font-bold">Pricing that grows with you</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.name} {...plan} />
        ))}
      </div>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Step 6: Add an auth shell' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Login page shell',
        code: `// app/(auth)/login/page.tsx
export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-6">
      <form className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Log in</h1>
        <label className="mt-6 block">
          <span className="text-sm font-medium">Email</span>
          <input className="mt-2 w-full rounded border p-3" name="email" type="email" />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium">Password</span>
          <input className="mt-2 w-full rounded border p-3" name="password" type="password" />
        </label>
        <button className="mt-6 w-full rounded bg-slate-950 p-3 font-semibold text-white" type="submit">
          Continue
        </button>
      </form>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Step 7: Protect the product shell' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Session helper placeholder',
        code: `// lib/session.ts
import 'server-only';

export async function getSession() {
  return {
    user: {
      name: 'Demo User',
      email: 'demo@example.com',
    },
  };
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Authenticated layout',
        code: `// app/(app)/layout.tsx
import { redirect } from 'next/navigation';
import { AppNav } from '@/components/product/app-nav';
import { getSession } from '@/lib/session';

export default async function ProductLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav user={session.user} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Product nav',
        code: `// components/product/app-nav.tsx
import Link from 'next/link';

export function AppNav({ user }: { user: { name: string; email: string } }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="font-bold" href="/app">
          Product
        </Link>
        <p className="text-sm text-slate-600">{user.email}</p>
      </nav>
    </header>
  );
}`,
      },
      {
        type: 'try',
        text: 'Replace the demo session helper with your auth provider. Keep the same layout contract: if there is no session, redirect before rendering product routes.',
      },
      {
        type: 'keypoints',
        items: [
          'Route groups let public, auth, and product experiences use different layouts.',
          'Marketing pages should be mostly server-rendered and metadata-rich.',
          'Authenticated shells should check the session before showing product UI.',
          'A placeholder auth shell can be upgraded later without changing route architecture.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-accessibility',
    title: 'Accessibility in Next.js Apps',
    description:
      'Build accessible App Router interfaces with semantic HTML, focus management, forms, navigation, and metadata.',
    level: 'advanced',
    section: 'Polish & Quality',
    order: 60,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Accessibility is production quality. A fast app that cannot be navigated by keyboard, read by assistive technology, or understood by users with different needs is not finished.',
      },
      {
        type: 'p',
        text: 'Next.js does not change the fundamentals: semantic HTML, correct labels, predictable navigation, visible focus, and meaningful document structure. The App Router adds layout persistence, streaming, and route transitions that you should test with these basics in mind.',
      },
      { type: 'h2', text: 'Start with semantic structure' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Semantic page layout',
        code: `// app/docs/page.tsx
export default function DocsPage() {
  return (
    <>
      <header>
        <nav aria-label="Main navigation">...</nav>
      </header>
      <main>
        <h1>Documentation</h1>
        <section aria-labelledby="getting-started">
          <h2 id="getting-started">Getting started</h2>
          <p>Install the package and create your first project.</p>
        </section>
      </main>
    </>
  );
}`,
      },
      { type: 'h2', text: 'Use links for navigation and buttons for actions' },
      {
        type: 'table',
        headers: ['User intent', 'Element', 'Example'],
        rows: [
          ['Go to another URL', 'Link or a tag', 'Pricing, docs, account page'],
          ['Submit a form', 'button type="submit"', 'Sign up, save settings'],
          ['Change local UI', 'button type="button"', 'Open menu, expand accordion'],
          ['Select an option', 'native select or radio group', 'Plan, language, sort order'],
        ],
      },
      { type: 'h2', text: 'Label forms clearly' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Accessible form fields',
        code: `// components/signup-form.tsx
export function SignupForm() {
  return (
    <form>
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" autoComplete="email" required />

      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="new-password" required />

      <button type="submit">Create account</button>
    </form>
  );
}`,
      },
      { type: 'h2', text: 'Manage focus in client islands' },
      {
        type: 'p',
        text: 'When a Client Component opens a dialog, drawer, or menu, keyboard users need focus to move predictably. Use established accessible primitives when possible. If you build your own, test tab order, escape behavior, and focus return.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Simple disclosure with aria-expanded',
        code: `// components/faq-item.tsx
'use client';

import { useState } from 'react';

export function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const contentId = question.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <section>
      <h3>
        <button aria-controls={contentId} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {question}
        </button>
      </h3>
      <div id={contentId} hidden={!open}>
        <p>{answer}</p>
      </div>
    </section>
  );
}`,
      },
      { type: 'h2', text: 'Make loading and errors understandable' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Accessible loading state',
        code: `// app/account/loading.tsx
export default function AccountLoading() {
  return (
    <main aria-busy="true" aria-live="polite">
      <h1>Loading account</h1>
      <p>Please wait while your account details load.</p>
    </main>
  );
}`,
      },
      {
        type: 'ul',
        items: [
          'Use one clear h1 per page.',
          'Keep focus styles visible.',
          'Use alt text for meaningful images and empty alt text for decorative images.',
          'Avoid using color alone to communicate status.',
          'Test keyboard navigation before shipping.',
        ],
      },
      {
        type: 'try',
        text: 'Navigate one page using only Tab, Shift+Tab, Enter, and Escape. Write down every place where focus is lost, hidden, or confusing.',
      },
      {
        type: 'keypoints',
        items: [
          'Accessibility is part of production readiness.',
          'Semantic HTML solves many problems before ARIA is needed.',
          'Client islands that manage overlays must manage keyboard behavior too.',
          'Loading, error, and empty states should be understandable to assistive technology.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-seo-advanced',
    title: 'Advanced SEO & Sharing Metadata',
    description:
      'Use the App Router Metadata API, Open Graph images, canonical URLs, robots rules, and structured data responsibly.',
    level: 'advanced',
    section: 'Polish & Quality',
    order: 61,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'SEO in a Next.js app is not just titles. It includes crawlable server-rendered content, good metadata, canonical URLs, Open Graph sharing, sitemap coverage, robots rules, performance, and accessible structure.',
      },
      { type: 'h2', text: 'Set strong defaults in the root layout' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Root metadata defaults',
        code: `// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.example.com'),
  title: {
    default: 'Intellex',
    template: '%s | Intellex',
  },
  description: 'Advanced tutorials for building production-ready web apps.',
  openGraph: {
    siteName: 'Intellex',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
      },
      { type: 'h2', text: 'Generate metadata for dynamic routes' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Dynamic lesson metadata',
        code: `// app/tutorials/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLesson } from '@/lib/lessons';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLesson(slug);

  if (!lesson) {
    return { title: 'Lesson not found' };
  }

  return {
    title: lesson.title,
    description: lesson.description,
    alternates: {
      canonical: '/tutorials/' + lesson.slug,
    },
    openGraph: {
      title: lesson.title,
      description: lesson.description,
      url: '/tutorials/' + lesson.slug,
    },
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = await getLesson(slug);
  if (!lesson) notFound();
  return <main>{lesson.title}</main>;
}`,
      },
      { type: 'h2', text: 'Add structured data carefully' },
      {
        type: 'code',
        language: 'tsx',
        title: 'JSON-LD for an article',
        code: `// components/article-json-ld.tsx
type ArticleJsonLdProps = {
  title: string;
  description: string;
  url: string;
  datePublished: string;
};

export function ArticleJsonLd({ title, description, url, datePublished }: ArticleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}`,
      },
      {
        type: 'warning',
        text: 'Only render structured data that accurately describes the visible page. Misleading schema can hurt trust and may violate search engine guidelines.',
      },
      { type: 'h2', text: 'Create sitemap and robots files' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Sitemap route',
        code: `// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllLessons } from '@/lib/lessons';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lessons = await getAllLessons();

  return [
    {
      url: 'https://www.example.com',
      lastModified: new Date(),
    },
    ...lessons.map((lesson) => ({
      url: 'https://www.example.com/tutorials/' + lesson.slug,
      lastModified: new Date(),
    })),
  ];
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Robots route',
        code: `// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/account'],
    },
    sitemap: 'https://www.example.com/sitemap.xml',
  };
}`,
      },
      {
        type: 'table',
        headers: ['SEO area', 'Next.js tool', 'Production check'],
        rows: [
          ['Titles and descriptions', 'Metadata API', 'Unique per important route'],
          ['Social cards', 'Open Graph metadata', 'Preview in sharing debuggers'],
          ['Crawl discovery', 'sitemap.ts', 'Includes canonical public URLs'],
          ['Crawl control', 'robots.ts', 'Blocks private or duplicate areas'],
          ['Rich results', 'JSON-LD', 'Matches visible content'],
        ],
      },
      {
        type: 'try',
        text: 'Choose one dynamic route and write its title template, description source, canonical URL, Open Graph title, and sitemap entry.',
      },
      {
        type: 'keypoints',
        items: [
          'Metadata should be route-specific and truthful.',
          'metadataBase helps relative Open Graph and canonical URLs resolve correctly.',
          'Sitemaps and robots rules should reflect public production routes.',
          'Structured data is powerful only when it accurately matches the page.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-i18n',
    title: 'Internationalization Basics',
    description:
      'Plan a locale-aware Next.js app with route segments, dictionaries, metadata, and localized navigation.',
    level: 'advanced',
    section: 'Polish & Quality',
    order: 62,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Internationalization means more than translating strings. A production app must think about locale-aware routes, formatting, metadata, direction, dates, currencies, validation messages, and fallback behavior.',
      },
      { type: 'h2', text: 'Use a locale route segment' },
      {
        type: 'code',
        language: 'bash',
        title: 'Locale-aware route structure',
        code: `app/
  [locale]/
    layout.tsx
    page.tsx
    pricing/page.tsx
dictionaries/
  en.json
  es.json
lib/
  dictionaries.ts
  locales.ts`,
      },
      { type: 'h2', text: 'Define supported locales' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Locale helpers',
        code: `// lib/locales.ts
export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}`,
      },
      { type: 'h2', text: 'Create dictionaries' },
      {
        type: 'code',
        language: 'json',
        title: 'English dictionary',
        code: `{
  "home": {
    "title": "Build production-ready apps",
    "description": "Learn Next.js through practical projects."
  },
  "nav": {
    "pricing": "Pricing",
    "login": "Log in"
  }
}`,
      },
      {
        type: 'code',
        language: 'json',
        title: 'Spanish dictionary',
        code: `{
  "home": {
    "title": "Crea apps listas para produccion",
    "description": "Aprende Next.js con proyectos practicos."
  },
  "nav": {
    "pricing": "Precios",
    "login": "Iniciar sesion"
  }
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Load dictionaries on the server',
        code: `// lib/dictionaries.ts
import 'server-only';
import type { Locale } from './locales';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}`,
      },
      { type: 'h2', text: 'Use the locale in layout and pages' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Locale layout',
        code: `// app/[locale]/layout.tsx
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/locales';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Localized page',
        code: `// app/[locale]/page.tsx
import { getDictionary } from '@/lib/dictionaries';
import { isLocale } from '@/lib/locales';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <main>
      <h1>{dictionary.home.title}</h1>
      <p>{dictionary.home.description}</p>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Format numbers and dates by locale' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Locale-aware formatting',
        code: `// lib/format-locale.ts
import type { Locale } from './locales';

export function formatPrice(amount: number, locale: Locale, currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(new Date(date));
}`,
      },
      {
        type: 'tip',
        text: 'Start with route segments and dictionaries before adding a full i18n library. Once the app needs plural rules, nested namespaces, extraction workflows, or translator tooling, introduce a library deliberately.',
      },
      {
        type: 'try',
        text: 'Add a localized pricing page that reads the locale, loads the dictionary, and formats plan prices with Intl.NumberFormat.',
      },
      {
        type: 'keypoints',
        items: [
          'Locale-aware routes make language visible and shareable.',
          'Dictionaries are server data and can be loaded in Server Components.',
          'Metadata, dates, currencies, and validation messages also need localization.',
          'Start simple, then adopt dedicated i18n tooling when product needs justify it.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-migrations',
    title: 'Migrating Ideas from CRA/Vite React to Next.js',
    description:
      'Translate familiar client-rendered React patterns into App Router patterns without carrying old assumptions forward.',
    level: 'advanced',
    section: 'Polish & Quality',
    order: 63,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'If you come from Create React App or Vite, Next.js may feel like React plus routing. In production App Router projects, it is more accurate to think of Next.js as the application architecture and React as the UI model inside it.',
      },
      {
        type: 'p',
        text: 'The migration goal is not to copy every client-side habit. It is to preserve product behavior while moving data access, routing, metadata, and rendering responsibilities to the right App Router layer.',
      },
      { type: 'h2', text: 'Mapping old ideas to Next.js' },
      {
        type: 'table',
        headers: ['CRA/Vite habit', 'App Router equivalent', 'Why it changes'],
        rows: [
          ['React Router routes', 'app/ folders and page.tsx files', 'File system routes own layouts, loading, errors, and metadata'],
          ['Global client fetch in useEffect', 'Server Component data fetching', 'Data can be ready before HTML reaches the browser'],
          ['Document head library', 'Metadata API', 'Metadata is route-aware and server-rendered'],
          ['Client-only env variables', 'Server env plus NEXT_PUBLIC_ public env', 'Secrets must stay on the server'],
          ['One root App component', 'Nested layouts', 'Different route groups can have different shells'],
        ],
      },
      { type: 'h2', text: 'Before: client fetch after render' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Typical SPA data fetching',
        code: `// Old SPA pattern
import { useEffect, useState } from 'react';

export function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((response) => response.json())
      .then(setProducts);
  }, []);

  return products.map((product: { id: string; name: string }) => (
    <p key={product.id}>{product.name}</p>
  ));
}`,
      },
      { type: 'h2', text: 'After: server fetch before render' },
      {
        type: 'code',
        language: 'tsx',
        title: 'App Router data fetching',
        code: `// app/products/page.tsx
import { getProducts } from '@/lib/products';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main>
      <h1>Products</h1>
      {products.map((product) => (
        <p key={product.id}>{product.name}</p>
      ))}
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Move browser-only code into islands' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Client-only behavior stays explicit',
        code: `// components/theme-toggle.tsx
'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}`,
      },
      { type: 'h2', text: 'Migration checklist' },
      {
        type: 'ol',
        items: [
          'Create route folders in app/ for the current SPA routes.',
          'Move shared shells into layout.tsx files.',
          'Move route metadata into metadata exports or generateMetadata.',
          'Move server data reads out of useEffect and into Server Components.',
          'Keep browser APIs inside focused Client Components.',
          'Replace client-only redirects with server redirects when auth is required.',
          'Review environment variables and remove secrets from client bundles.',
        ],
      },
      {
        type: 'warning',
        text: 'Do not mark the whole migrated app as "use client" just to make old components work. That gives up many of the App Router benefits and can hide security and performance problems.',
      },
      {
        type: 'try',
        text: 'Take one SPA route with useEffect data fetching and design its App Router version: page.tsx, loading.tsx, metadata, and any client islands.',
      },
      {
        type: 'keypoints',
        items: [
          'Migrating to Next.js is an architecture shift, not just a router swap.',
          'Server Components replace many useEffect data-fetching patterns.',
          'Browser APIs still work, but they belong inside explicit Client Components.',
          'Nested layouts are the App Router replacement for many SPA shell patterns.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-common-mistakes',
    title: 'Common Next.js Mistakes (and Fixes)',
    description:
      'Recognize and fix production App Router mistakes around client boundaries, caching, params, metadata, auth, and loading states.',
    level: 'advanced',
    section: 'Polish & Quality',
    order: 64,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Most Next.js mistakes come from using the right feature at the wrong boundary. The fixes are usually simple once you identify whether the problem belongs to server rendering, client interactivity, routing, caching, or deployment configuration.',
      },
      { type: 'h2', text: 'Mistake 1: Adding "use client" too high' },
      {
        type: 'p',
        text: 'If a layout or page becomes a Client Component just because one button needs state, the browser may receive far more JavaScript than necessary.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Fix by extracting the interactive part',
        code: `// app/pricing/page.tsx
import { BillingToggle } from './billing-toggle';
import { PricingTable } from './pricing-table';

export default function PricingPage() {
  return (
    <main>
      <h1>Pricing</h1>
      <BillingToggle />
      <PricingTable />
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Mistake 2: Reading params synchronously in modern App Router code' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Use async params and searchParams',
        code: `// app/products/[id]/page.tsx
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { tab = 'overview' } = await searchParams;

  return <main>Product {id}: {tab}</main>;
}`,
      },
      { type: 'h2', text: 'Mistake 3: Caching private data accidentally' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Use no-store for request-specific private data',
        code: `// lib/account.ts
import 'server-only';

export async function getAccount(userId: string) {
  const response = await fetch('https://api.example.com/accounts/' + userId, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Unable to load account');
  }

  return response.json();
}`,
      },
      { type: 'h2', text: 'Mistake 4: Mutating data without revalidation' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Revalidate after a server mutation',
        code: `// app/settings/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { saveProfile } from '@/lib/profile';

export async function updateProfile(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();

  if (name.length < 2) {
    return { error: 'Name is too short' };
  }

  await saveProfile({ name });
  revalidatePath('/settings');
  return { ok: true };
}`,
      },
      { type: 'h2', text: 'Mistake 5: Metadata is generic everywhere' },
      {
        type: 'p',
        text: 'Every important public route should have a meaningful title and description. Dynamic content should use generateMetadata so previews and search snippets match the page.',
      },
      { type: 'h2', text: 'Mistake 6: Loading states are missing or misleading' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Add segment loading UI',
        code: `// app/reports/loading.tsx
export default function ReportsLoading() {
  return (
    <main aria-busy="true">
      <h1>Loading reports</h1>
      <p>Preparing your latest report data.</p>
    </main>
  );
}`,
      },
      {
        type: 'table',
        headers: ['Mistake', 'Fix', 'Why it matters'],
        rows: [
          ['Huge client boundary', 'Extract small islands', 'Improves bundle and hydration cost'],
          ['Private data cached', 'Use no-store or user-scoped caching', 'Protects user data correctness'],
          ['Missing revalidation', 'Call revalidatePath or revalidateTag', 'Prevents stale UI after mutations'],
          ['Generic metadata', 'Use route metadata', 'Improves search and sharing'],
          ['No loading or error UI', 'Add loading.tsx and error.tsx', 'Improves perceived quality'],
        ],
      },
      {
        type: 'try',
        text: 'Audit one route for these mistakes: client boundary size, cache mode, metadata, loading state, and mutation revalidation.',
      },
      {
        type: 'keypoints',
        items: [
          'Most App Router bugs become clearer when you identify the wrong boundary.',
          'Small Client Components preserve performance and server-rendering benefits.',
          'Caching must match the privacy and freshness requirements of the data.',
          'Production polish includes metadata, loading states, and revalidation paths.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-next-steps',
    title: 'What to Learn After This Path',
    description:
      'Choose the next advanced topics after completing the Next.js-first Intellex path.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 65,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'You now have the core mental model for building with Next.js first: routes and layouts shape the app, Server Components render most UI, client islands add interaction, and React skills are learned in context.',
      },
      {
        type: 'p',
        text: 'The next step is specialization. Choose topics based on the kind of product you want to build, not because every tool is mandatory.',
      },
      { type: 'h2', text: 'Path 1: Full-stack product development' },
      {
        type: 'ul',
        items: [
          'Database modeling with PostgreSQL or another relational database.',
          'ORM workflows with migrations, seed data, and query performance.',
          'Authentication, sessions, role-based access, and account lifecycle.',
          'Payments, subscriptions, invoices, and webhook reliability.',
        ],
      },
      { type: 'h2', text: 'Path 2: Content and learning platforms' },
      {
        type: 'ul',
        items: [
          'MDX pipelines, syntax highlighting, and content collections.',
          'Search indexing, tagging, recommendations, and progress tracking.',
          'Editorial workflows with previews and draft content.',
          'Accessibility and SEO audits for long-form content.',
        ],
      },
      { type: 'h2', text: 'Path 3: Performance and platform engineering' },
      {
        type: 'ul',
        items: [
          'Caching strategy, revalidation tags, and edge/runtime tradeoffs.',
          'Bundle analysis, Core Web Vitals, and production monitoring.',
          'Observability with logs, traces, metrics, and error reporting.',
          'Deployment pipelines, environment management, and release safety.',
        ],
      },
      { type: 'h2', text: 'Path 4: UI systems and advanced React patterns' },
      {
        type: 'p',
        text: 'Now that you know where React belongs inside a Next.js app, advanced React topics become more useful: accessible component primitives, compound components, controlled and uncontrolled forms, virtualization, optimistic UI, and animation.',
      },
      {
        type: 'code',
        language: 'json',
        title: 'A focused next-learning plan',
        code: `{
  "month1": "Build a full-stack CRUD app with auth and database persistence",
  "month2": "Add payments, webhooks, email, and account settings",
  "month3": "Add monitoring, tests, accessibility audit, and SEO polish",
  "ongoing": "Refactor client islands, measure performance, and document architecture decisions"
}`,
      },
      { type: 'h2', text: 'Portfolio capstone challenge' },
      {
        type: 'ol',
        items: [
          'Choose one project from lessons 56-59.',
          'Add authentication or a realistic data source.',
          'Add route metadata, loading states, error states, and empty states.',
          'Write a short architecture note explaining server state, URL state, context, and local state decisions.',
          'Run a production build and fix the issues it reveals.',
        ],
      },
      {
        type: 'tip',
        text: 'The strongest proof of mastery is a deployed app with clear tradeoffs: what is server-rendered, what is interactive, what is cached, what is protected, and what is intentionally simple.',
      },
      {
        type: 'try',
        text: 'Write a one-page roadmap for your next Next.js project. Include routes, data sources, client islands, metadata requirements, testing strategy, and deployment target.',
      },
      {
        type: 'keypoints',
        items: [
          'After this path, choose specialization based on product goals.',
          'Full-stack skills, content systems, performance, and UI systems are all natural next steps.',
          'Advanced React is more valuable once you can place it correctly inside Next.js.',
          'A deployed capstone with documented decisions is better evidence than a pile of disconnected tutorials.',
        ],
      },
    ],
  },
];
