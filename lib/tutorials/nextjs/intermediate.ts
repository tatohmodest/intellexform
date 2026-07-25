import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'nextjs-loading-ui',
    title: 'loading.js & Suspense',
    description:
      'Use loading.js and Suspense to show instant loading states while Server Components fetch data.',
    level: 'intermediate',
    section: 'Data & Async UI',
    order: 26,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Next.js apps often wait for data before a page is ready. The App Router gives you loading.js for route-level loading UI and React Suspense for smaller loading areas inside a page.',
      },
      {
        type: 'p',
        text: 'This is a React concept used in a Next.js way: you are not learning Suspense as a separate theory topic. You are using it so a real Next.js route can stay responsive while async Server Components load.',
      },
      { type: 'h2', text: 'Route loading with loading.js' },
      {
        type: 'p',
        text: 'Place a loading.tsx file next to a page.tsx file. Next.js automatically shows it while that route segment is loading.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/dashboard/loading.tsx',
        code: `export default function Loading() {
  return (
    <main className="space-y-4 p-6">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      <div className="h-32 animate-pulse rounded bg-gray-100" />
      <p className="text-sm text-gray-500">Loading dashboard...</p>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Component loading with Suspense' },
      {
        type: 'p',
        text: 'Use Suspense when one part of the page can load independently. The page shell renders first, and the slow component fills in later.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/dashboard/page.tsx',
        code: `import { Suspense } from 'react';

async function RevenueChart() {
  const res = await fetch('https://api.example.com/revenue');
  const data = await res.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

function ChartSkeleton() {
  return <div className="h-48 animate-pulse rounded bg-gray-100" />;
}

export default function DashboardPage() {
  return (
    <main className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>
    </main>
  );
}`,
      },
      {
        type: 'note',
        text: 'loading.tsx is automatic for a route segment. Suspense is explicit and useful when only part of the screen waits for async work.',
      },
      {
        type: 'tip',
        text: 'Keep loading UI visually similar to the final layout. Skeletons usually feel smoother than a centered spinner because the page does not jump as much.',
      },
      {
        type: 'try',
        text: 'Create a /reports route with loading.tsx. Then add a Suspense boundary around a slow Server Component inside reports/page.tsx.',
      },
      {
        type: 'keypoints',
        items: [
          'loading.tsx creates an automatic loading state for a route segment.',
          'Suspense lets a smaller part of a page show its own fallback.',
          'Async Server Components can be wrapped in Suspense.',
          'Good loading UI keeps the page structure stable while data loads.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-data-fetching',
    title: 'Fetching Data in Server Components',
    description:
      'Fetch data directly inside App Router Server Components and render pages without a separate client-side loading step.',
    level: 'intermediate',
    section: 'Data & Async UI',
    order: 27,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'In the App Router, components are Server Components by default. That means a page can be async, fetch data on the server, and return JSX that already contains the result.',
      },
      {
        type: 'p',
        text: 'This changes how you use React in Next.js. For data needed at page load, you usually do not start with useEffect. You fetch on the server first, then add Client Components only where interaction is needed.',
      },
      { type: 'h2', text: 'Fetch inside an async page' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/products/page.tsx',
        code: `type Product = {
  id: string;
  name: string;
  price: number;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://api.example.com/products');

  if (!res.ok) {
    throw new Error('Failed to load products');
  }

  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Products</h1>
      <ul className="mt-4 space-y-2">
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - \${product.price}
          </li>
        ))}
      </ul>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Fetch independent data in parallel' },
      {
        type: 'p',
        text: 'If two requests do not depend on each other, start them together with Promise.all. This avoids waiting for request one before starting request two.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Parallel fetching',
        code: `async function getDashboardData() {
  const [usersRes, ordersRes] = await Promise.all([
    fetch('https://api.example.com/users'),
    fetch('https://api.example.com/orders'),
  ]);

  if (!usersRes.ok || !ordersRes.ok) {
    throw new Error('Dashboard data failed to load');
  }

  return {
    users: await usersRes.json(),
    orders: await ordersRes.json(),
  };
}`,
      },
      {
        type: 'note',
        text: 'Server Components cannot use browser-only hooks such as useState or useEffect. If a part of the page needs clicks, input state, or browser APIs, move that part into a Client Component.',
      },
      {
        type: 'tip',
        text: 'Keep data fetching close to the route that needs it. Move shared fetch helpers into a lib folder when multiple routes need the same data.',
      },
      {
        type: 'try',
        text: 'Build an async /users page that fetches a user list on the server and renders names in a table. Add an error throw when the response is not ok.',
      },
      {
        type: 'keypoints',
        items: [
          'App Router pages are Server Components by default.',
          'Async Server Components can await fetch before returning JSX.',
          'Use Promise.all for independent requests.',
          'Use Client Components only for browser interactivity and client state.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-caching',
    title: 'Caching Defaults in Next.js',
    description:
      'Understand the caching defaults that affect fetch, routes, and when your pages update.',
    level: 'intermediate',
    section: 'Data & Async UI',
    order: 28,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Next.js caching is powerful because it can make pages fast by default. It can also surprise you if you expect every request to run again on every refresh.',
      },
      {
        type: 'p',
        text: 'The main idea is simple: static data can be reused, dynamic data should be requested fresh, and you should choose intentionally when the default does not match your page.',
      },
      { type: 'h2', text: 'Common caching choices' },
      {
        type: 'table',
        headers: ['Need', 'Option', 'Use when'],
        rows: [
          ['Reuse data', "cache: 'force-cache'", 'Marketing pages, docs, stable catalogs'],
          ['Always fetch fresh', "cache: 'no-store'", 'Dashboards, private data, rapidly changing data'],
          ['Refresh on a timer', 'next.revalidate', 'Content that can be slightly stale'],
          ['Refresh by event', 'revalidatePath or revalidateTag', 'Data changes after a form or admin action'],
        ],
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Choosing a fetch cache behavior',
        code: `async function getPublicPosts() {
  return fetch('https://api.example.com/posts', {
    cache: 'force-cache',
  });
}

async function getLiveOrders() {
  return fetch('https://api.example.com/orders', {
    cache: 'no-store',
  });
}

async function getNews() {
  return fetch('https://api.example.com/news', {
    next: { revalidate: 300 },
  });
}`,
      },
      { type: 'h2', text: 'Route segment settings' },
      {
        type: 'p',
        text: 'A route segment can also declare behavior. Use this when the whole route should be dynamic or should revalidate on a schedule.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/admin/page.tsx',
        code: `export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const res = await fetch('https://api.example.com/admin-stats', {
    cache: 'no-store',
  });
  const stats = await res.json();

  return <pre>{JSON.stringify(stats, null, 2)}</pre>;
}`,
      },
      {
        type: 'note',
        text: 'Reading cookies, headers, or search params can make a route dynamic because the result may be different for each request.',
      },
      {
        type: 'tip',
        text: 'For learning projects, write a short comment near unusual cache settings. Future you will want to know why the route is dynamic or revalidated.',
      },
      {
        type: 'try',
        text: 'Create two fetch helpers: one for public posts that revalidates every hour, and one for private notifications that uses no-store.',
      },
      {
        type: 'keypoints',
        items: [
          'Next.js can cache fetch results and route output for speed.',
          'Use no-store when the data must be fresh for every request.',
          'Use revalidate when slightly stale data is acceptable.',
          'Dynamic APIs such as cookies and headers affect caching behavior.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-revalidation',
    title: 'Revalidation Strategies',
    description:
      'Refresh cached pages and data with time-based, path-based, and tag-based revalidation.',
    level: 'intermediate',
    section: 'Data & Async UI',
    order: 29,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Revalidation means updating cached data after it becomes old or after something changes. It gives you the speed of cached pages with a plan for keeping content accurate.',
      },
      { type: 'h2', text: 'Time-based revalidation' },
      {
        type: 'p',
        text: 'Use next.revalidate when data can be reused for a fixed number of seconds. This works well for blogs, product catalogs, and public content.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Refresh content every 10 minutes',
        code: `async function getArticles() {
  const res = await fetch('https://api.example.com/articles', {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    throw new Error('Failed to load articles');
  }

  return res.json();
}`,
      },
      { type: 'h2', text: 'Path revalidation after a change' },
      {
        type: 'p',
        text: 'Use revalidatePath when an action changes data for a known route. A common example is refreshing an admin list after creating a post.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/actions.ts',
        code: `'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = String(formData.get('title') || '');

  await fetch('https://api.example.com/posts', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });

  revalidatePath('/posts');
}`,
      },
      { type: 'h2', text: 'Tag revalidation for shared data' },
      {
        type: 'p',
        text: 'Use tags when the same data appears on several pages. Instead of naming every route, tag the fetch and revalidate the tag.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Tag a fetch result',
        code: `const res = await fetch('https://api.example.com/products', {
  next: { tags: ['products'] },
});`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'Revalidate a tag',
        code: `'use server';

import { revalidateTag } from 'next/cache';

export async function updateProduct() {
  await fetch('https://api.example.com/products/123', {
    method: 'PATCH',
    body: JSON.stringify({ featured: true }),
  });

  revalidateTag('products');
}`,
      },
      {
        type: 'note',
        text: 'Revalidation does not mean every user gets a slow page. Next.js updates cached data according to the strategy, then serves the refreshed result.',
      },
      {
        type: 'tip',
        text: 'Choose paths for route-specific updates and tags for shared resources that appear in many places.',
      },
      {
        type: 'try',
        text: 'Add a products fetch with the tag products. Then write a Server Action that updates one product and calls revalidateTag("products").',
      },
      {
        type: 'keypoints',
        items: [
          'Time-based revalidation refreshes cached data after a number of seconds.',
          'revalidatePath refreshes a known route.',
          'revalidateTag refreshes shared tagged data.',
          'Server Actions are a practical place to revalidate after a mutation.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-route-handlers',
    title: 'Route Handlers (API Routes)',
    description:
      'Create backend endpoints in the App Router with route.ts files and standard Web Request and Response APIs.',
    level: 'intermediate',
    section: 'Backend in Next.js',
    order: 30,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Route Handlers let your Next.js app respond to HTTP requests. They replace the old pages/api pattern when you are using the App Router.',
      },
      {
        type: 'p',
        text: 'Use Route Handlers for webhooks, custom JSON endpoints, small backend tasks, and places where another client needs to call your app.',
      },
      { type: 'h2', text: 'A GET endpoint' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/api/health/route.ts',
        code: `export async function GET() {
  return Response.json({
    ok: true,
    service: 'intellex-demo',
  });
}`,
      },
      { type: 'h2', text: 'Reading a POST body' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/api/contact/route.ts',
        code: `import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || '');
  const message = String(body.message || '');

  if (!email.includes('@') || message.length < 10) {
    return NextResponse.json(
      { error: 'Enter a valid email and message.' },
      { status: 400 },
    );
  }

  return NextResponse.json({ saved: true });
}`,
      },
      { type: 'h2', text: 'Dynamic route handlers' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/api/products/[id]/route.ts',
        code: `type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, context: RouteContext) {
  const productId = context.params.id;

  return Response.json({
    id: productId,
    name: 'Example product',
  });
}`,
      },
      {
        type: 'note',
        text: 'Route Handlers run on the server. Do not import them into Client Components. Call them with fetch when the browser or another service needs an HTTP endpoint.',
      },
      {
        type: 'tip',
        text: 'Prefer Server Actions for mutations triggered by your own forms. Prefer Route Handlers when you need a public HTTP API, webhook, or non-form client request.',
      },
      {
        type: 'try',
        text: 'Create app/api/newsletter/route.ts with a POST function. Validate an email string and return a 400 response when it is missing.',
      },
      {
        type: 'keypoints',
        items: [
          'Route Handlers live in route.ts files inside the app directory.',
          'Export functions named for HTTP methods such as GET and POST.',
          'Use Request, Response, and NextResponse to read input and return output.',
          'Route Handlers are useful for APIs, webhooks, and backend endpoints.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-server-actions',
    title: 'Server Actions',
    description:
      'Run server-side mutations from Next.js components without building a separate API endpoint first.',
    level: 'intermediate',
    section: 'Backend in Next.js',
    order: 31,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Server Actions are async functions that run on the server. They are useful for mutations such as creating, updating, and deleting data.',
      },
      {
        type: 'p',
        text: 'This is where React and Next.js work together: the UI can call a server function, but the database write and secret logic stay out of the browser bundle.',
      },
      { type: 'h2', text: 'Create a server action' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/actions.ts',
        code: `'use server';

import { revalidatePath } from 'next/cache';

export async function deletePost(id: string) {
  if (!id) {
    throw new Error('A post id is required');
  }

  await fetch('https://api.example.com/posts/' + id, {
    method: 'DELETE',
  });

  revalidatePath('/posts');
}`,
      },
      { type: 'h2', text: 'Call an action from a Client Component' },
      {
        type: 'p',
        text: 'A button click is client interactivity, so the button component needs use client. The action still runs on the server.',
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/posts/delete-button.tsx',
        code: `'use client';

import { useTransition } from 'react';
import { deletePost } from '../actions';

type DeleteButtonProps = {
  id: string;
};

export function DeleteButton({ id }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deletePost(id);
        });
      }}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}`,
      },
      {
        type: 'note',
        text: 'Server Actions should validate input on the server. Never trust values just because they came from your own UI.',
      },
      {
        type: 'tip',
        text: 'Keep action files small and task-focused. If an action grows large, move database or service logic into a server-only helper and call it from the action.',
      },
      {
        type: 'try',
        text: 'Write a markComplete(id) Server Action for a todo app. Call revalidatePath("/todos") after the update.',
      },
      {
        type: 'keypoints',
        items: [
          'Server Actions run on the server and can perform mutations.',
          'Use the use server directive for action modules or functions.',
          'Client Components can call actions for interactive events.',
          'Validate action input and revalidate affected pages after changes.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-forms-actions',
    title: 'Forms with Server Actions',
    description:
      'Build practical App Router forms that submit directly to Server Actions with validation and pending UI.',
    level: 'intermediate',
    section: 'Backend in Next.js',
    order: 32,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Forms are one of the most practical places to use Server Actions. A form can submit FormData directly to a server function without you writing a separate fetch call.',
      },
      {
        type: 'p',
        text: 'The React part is still important, but it stays in service of the Next.js workflow: use a Server Component for the form, then add a small Client Component when you need pending UI.',
      },
      { type: 'h2', text: 'A form that posts to an action' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/messages/actions.ts',
        code: `'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createMessage(formData: FormData) {
  const title = String(formData.get('title') || '').trim();
  const body = String(formData.get('body') || '').trim();

  if (title.length < 3 || body.length < 10) {
    throw new Error('Title and message are too short.');
  }

  await fetch('https://api.example.com/messages', {
    method: 'POST',
    body: JSON.stringify({ title, body }),
  });

  revalidatePath('/messages');
  redirect('/messages');
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/messages/new/page.tsx',
        code: `import { createMessage } from '../actions';
import { SubmitButton } from './submit-button';

export default function NewMessagePage() {
  return (
    <form action={createMessage} className="space-y-4 p-6">
      <label className="block">
        <span>Title</span>
        <input name="title" className="mt-1 block rounded border p-2" />
      </label>

      <label className="block">
        <span>Message</span>
        <textarea name="body" className="mt-1 block rounded border p-2" />
      </label>

      <SubmitButton />
    </form>
  );
}`,
      },
      { type: 'h2', text: 'Add pending UI with useFormStatus' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/messages/new/submit-button.tsx',
        code: `'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} className="rounded bg-black px-4 py-2 text-white">
      {pending ? 'Saving...' : 'Save message'}
    </button>
  );
}`,
      },
      {
        type: 'note',
        text: 'HTML form fields must have name attributes. FormData reads values by those names on the server.',
      },
      {
        type: 'tip',
        text: 'For friendlier validation, return structured state with useActionState. For a first practical form, throwing an error and handling it with error.tsx is enough to understand the flow.',
      },
      {
        type: 'try',
        text: 'Create a feedback form with name, rating, and comment fields. Submit it to a Server Action and show a pending label on the button.',
      },
      {
        type: 'keypoints',
        items: [
          'Server Actions can be used directly as a form action.',
          'FormData reads submitted values by input name.',
          'useFormStatus adds pending UI inside a Client Component.',
          'After a successful mutation, revalidate data and redirect when appropriate.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-use-router',
    title: 'useRouter, usePathname, useParams',
    description:
      'Use Next.js client navigation hooks for buttons, active links, and dynamic route values.',
    level: 'intermediate',
    section: 'Client Navigation Tools',
    order: 33,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Most navigation in Next.js should use the Link component. Client navigation hooks are for interactive cases: a button that redirects after saving, an active sidebar item, or a component that reads a route parameter.',
      },
      {
        type: 'p',
        text: 'These are React hooks, but you use them only in Client Components because they read browser navigation state.',
      },
      { type: 'h2', text: 'Programmatic navigation with useRouter' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/checkout/checkout-button.tsx',
        code: `'use client';

import { useRouter } from 'next/navigation';

export function CheckoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push('/checkout');
      }}
    >
      Continue to checkout
    </button>
  );
}`,
      },
      { type: 'h2', text: 'Active UI with usePathname' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/components/sidebar-link.tsx',
        code: `'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarLinkProps = {
  href: string;
  label: string;
};

export function SidebarLink({ href, label }: SidebarLinkProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link className={active ? 'font-bold text-blue-600' : 'text-gray-700'} href={href}>
      {label}
    </Link>
  );
}`,
      },
      { type: 'h2', text: 'Dynamic values with useParams' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/products/[id]/product-tools.tsx',
        code: `'use client';

import { useParams } from 'next/navigation';

export function ProductTools() {
  const params = useParams<{ id: string }>();

  return <p>Editing product {params.id}</p>;
}`,
      },
      {
        type: 'note',
        text: 'Do not use these hooks in Server Components. Server pages receive params and searchParams as props instead.',
      },
      {
        type: 'tip',
        text: 'Use router.replace instead of router.push when changing UI state that should not add a new browser history entry.',
      },
      {
        type: 'try',
        text: 'Build a client sidebar with three links. Use usePathname to highlight the current route.',
      },
      {
        type: 'keypoints',
        items: [
          'Use Link for normal navigation.',
          'useRouter is for navigation triggered by client events.',
          'usePathname helps build active navigation UI.',
          'useParams reads dynamic route values in Client Components.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-search-params',
    title: 'Search Params & Filters',
    description:
      'Read and update URL search params to build shareable filters, sorts, and pagination.',
    level: 'intermediate',
    section: 'Client Navigation Tools',
    order: 34,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Search params are the values after the question mark in a URL. In Next.js, they are perfect for filters because the result can be bookmarked, shared, and refreshed.',
      },
      {
        type: 'p',
        text: 'A common pattern is: read searchParams in a Server Component to fetch filtered data, and use a small Client Component to update the URL when the user clicks or types.',
      },
      { type: 'h2', text: 'Read search params on the server' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/products/page.tsx',
        code: `type ProductsPageProps = {
  searchParams: {
    category?: string;
    sort?: string;
  };
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams.category || 'all';
  const sort = searchParams.sort || 'newest';

  const res = await fetch(
    'https://api.example.com/products?category=' + category + '&sort=' + sort,
  );
  const products = await res.json();

  return (
    <main className="p-6">
      <h1>Products</h1>
      <p>
        Showing {category}, sorted by {sort}
      </p>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Update search params on the client' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/products/product-filter.tsx',
        code: `'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function ProductFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setCategory(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', category);
    params.set('page', '1');
    router.replace(pathname + '?' + params.toString());
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => setCategory('all')}>All</button>
      <button onClick={() => setCategory('books')}>Books</button>
      <button onClick={() => setCategory('courses')}>Courses</button>
    </div>
  );
}`,
      },
      {
        type: 'note',
        text: 'Search params are strings. Convert them before using them as numbers, booleans, or enum-like values.',
      },
      {
        type: 'tip',
        text: 'Use replace for filters that update the current view. Use push when each change should behave like a new navigation step.',
      },
      {
        type: 'try',
        text: 'Add a sort dropdown that writes sort=price or sort=newest to the URL and resets page to 1.',
      },
      {
        type: 'keypoints',
        items: [
          'Search params make filtered UI shareable.',
          'Server Components can read searchParams from page props.',
          'Client Components can update the URL with useRouter and URLSearchParams.',
          'Always validate and convert search param values before trusting them.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-use-context',
    title: 'React Context for Shared UI State',
    description:
      'Use React Context inside Next.js Client Components for shared interface state such as themes, drawers, and menus.',
    level: 'intermediate',
    section: 'React Power Tools in Next.js',
    order: 35,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'React Context lets several components read the same client-side state without passing props through every layer. In Next.js, use it for UI state, not as a replacement for server data fetching.',
      },
      {
        type: 'p',
        text: 'This belongs in the course because Next.js apps still need client interactivity. Context is useful when that interactivity is shared across a section of the app.',
      },
      { type: 'h2', text: 'Create a client provider' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/theme-provider.tsx',
        code: `'use client';

import { createContext, useContext, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return value;
}`,
      },
      { type: 'h2', text: 'Wrap a layout segment' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/dashboard/layout.tsx',
        code: `import { ThemeProvider } from '../theme-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/dashboard/theme-toggle.tsx',
        code: `'use client';

import { useTheme } from '../theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}`,
      },
      {
        type: 'note',
        text: 'Context values exist in the browser for Client Components. Server Components cannot read client context directly.',
      },
      {
        type: 'tip',
        text: 'Place providers as low in the tree as practical. Wrapping the entire app in many client providers can make more of your UI depend on client JavaScript.',
      },
      {
        type: 'try',
        text: 'Create a SidebarProvider that stores whether a dashboard sidebar is open. Use it from a header button and sidebar component.',
      },
      {
        type: 'keypoints',
        items: [
          'Context is useful for shared client UI state.',
          'Context providers that use hooks must be Client Components.',
          'Server data should usually be fetched on the server, not stored globally in context.',
          'Provider placement affects how much of the tree becomes interactive client UI.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-custom-hooks',
    title: 'Custom Hooks',
    description:
      'Extract reusable client-side behavior into custom hooks for focused Next.js Client Components.',
    level: 'intermediate',
    section: 'React Power Tools in Next.js',
    order: 36,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A custom hook is a function that uses React hooks and starts with use. In Next.js, custom hooks are most useful inside Client Components for browser behavior that repeats.',
      },
      {
        type: 'p',
        text: 'This is not a detour into React for its own sake. You need custom hooks when a Next.js app has repeated client interactivity such as online status, media queries, local storage, or debounced input.',
      },
      { type: 'h2', text: 'Extract browser behavior' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/hooks/use-online-status.ts',
        code: `'use client';

import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);

    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}`,
      },
      { type: 'h2', text: 'Use the hook in a Client Component' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/components/network-banner.tsx',
        code: `'use client';

import { useOnlineStatus } from '../hooks/use-online-status';

export function NetworkBanner() {
  const online = useOnlineStatus();

  if (online) {
    return null;
  }

  return (
    <div className="bg-yellow-100 p-3 text-sm">
      You are offline. Some actions may be unavailable.
    </div>
  );
}`,
      },
      {
        type: 'note',
        text: 'A hook that uses window, document, useState, or useEffect belongs on the client side. Keep it out of Server Components.',
      },
      {
        type: 'tip',
        text: 'Start by writing the behavior in one component. Extract a custom hook when a second component needs the same behavior or when the component becomes hard to read.',
      },
      {
        type: 'try',
        text: 'Create a useDebouncedValue hook and use it in a search box before updating the URL search params.',
      },
      {
        type: 'keypoints',
        items: [
          'Custom hooks reuse client-side behavior.',
          'Hook names must start with use.',
          'Browser APIs require Client Components.',
          'Extract hooks to reduce duplication and keep components focused.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-use-ref',
    title: 'useRef & DOM Access',
    description:
      'Use refs safely in Next.js Client Components when you need direct access to DOM elements or mutable values.',
    level: 'intermediate',
    section: 'React Power Tools in Next.js',
    order: 37,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Most Next.js UI should be controlled with props, state, and server data. Sometimes you still need direct DOM access, such as focusing an input, scrolling to a section, or storing a timer id.',
      },
      {
        type: 'p',
        text: 'useRef is a React tool you use in Next.js Client Components because refs depend on browser-rendered elements.',
      },
      { type: 'h2', text: 'Focus an input after a click' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/search/search-panel.tsx',
        code: `'use client';

import { useRef } from 'react';

export function SearchPanel() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="space-y-3">
      <button
        onClick={() => {
          inputRef.current?.focus();
        }}
      >
        Focus search
      </button>

      <input
        ref={inputRef}
        name="q"
        placeholder="Search courses"
        className="rounded border p-2"
      />
    </section>
  );
}`,
      },
      { type: 'h2', text: 'Store a mutable value without re-rendering' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/components/save-indicator.tsx',
        code: `'use client';

import { useRef, useState } from 'react';

export function SaveIndicator() {
  const timeoutRef = useRef<number | null>(null);
  const [message, setMessage] = useState('Not saved yet');

  function showSavedMessage() {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setMessage('Saved!');
    timeoutRef.current = window.setTimeout(() => {
      setMessage('All changes saved');
    }, 1500);
  }

  return <button onClick={showSavedMessage}>{message}</button>;
}`,
      },
      {
        type: 'note',
        text: 'Changing ref.current does not re-render the component. Use state when the screen should update, and use refs for DOM nodes or mutable values that do not need to trigger rendering.',
      },
      {
        type: 'tip',
        text: 'If you find yourself reading many DOM values with refs, consider whether normal form submission with Server Actions would be simpler.',
      },
      {
        type: 'try',
        text: 'Create a SkipToContent button that uses a ref to scroll a main content section into view.',
      },
      {
        type: 'keypoints',
        items: [
          'useRef works in Client Components.',
          'Refs can point to DOM elements such as inputs.',
          'Refs can store mutable values without causing re-renders.',
          'Use refs sparingly; state and form data are often clearer.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-middleware',
    title: 'Middleware',
    description:
      'Run lightweight logic before a request reaches a route, such as redirects, auth checks, and header updates.',
    level: 'intermediate',
    section: 'App Edge Features',
    order: 38,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Middleware runs before a request is completed. In Next.js, it is commonly used for redirects, simple authentication checks, locale routing, and request headers.',
      },
      {
        type: 'p',
        text: 'Middleware should be small and fast. It runs at the edge runtime by default, so it is not the place for heavy database queries or long business logic.',
      },
      { type: 'h2', text: 'Protect a dashboard prefix' },
      {
        type: 'code',
        language: 'tsx',
        title: 'middleware.ts',
        code: `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const loginUrl = new URL('/login', request.url);

  if (!session) {
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};`,
      },
      { type: 'h2', text: 'Add a request header' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Forward a header',
        code: `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}`,
      },
      {
        type: 'note',
        text: 'Middleware can read cookies from the request, but full session verification may belong in a server helper if it requires database access.',
      },
      {
        type: 'tip',
        text: 'Use matcher to limit where middleware runs. Running middleware on every asset and route can add unnecessary overhead.',
      },
      {
        type: 'try',
        text: 'Write middleware that redirects visitors from /admin to /login when a session cookie is missing.',
      },
      {
        type: 'keypoints',
        items: [
          'Middleware runs before matched routes.',
          'Use it for lightweight redirects, checks, and request changes.',
          'Limit middleware with matcher.',
          'Avoid heavy database or slow network work in middleware.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-env',
    title: 'Environment Variables',
    description:
      'Store configuration and secrets safely in Next.js using server-only and public environment variables.',
    level: 'intermediate',
    section: 'App Edge Features',
    order: 39,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Environment variables let your app use different values in development, preview, and production. Common examples include API URLs, database connection strings, and secret keys.',
      },
      {
        type: 'p',
        text: 'Next.js has an important rule: variables are server-only unless they start with NEXT_PUBLIC_. Public variables are bundled for the browser.',
      },
      { type: 'h2', text: 'Local environment file' },
      {
        type: 'code',
        language: 'bash',
        title: '.env.local',
        code: `DATABASE_URL="postgresql://user:password@localhost:5432/app"
SESSION_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"`,
      },
      { type: 'h2', text: 'Read server-only values' },
      {
        type: 'code',
        language: 'tsx',
        title: 'lib/env.ts',
        code: `export function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error('SESSION_SECRET is not configured');
  }

  return secret;
}`,
      },
      { type: 'h2', text: 'Read public values in client code' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/components/app-link.tsx',
        code: `'use client';

export function AppLink() {
  return (
    <a href={process.env.NEXT_PUBLIC_APP_URL}>
      Open app
    </a>
  );
}`,
      },
      {
        type: 'warning',
        text: 'Never put private keys, database URLs, or session secrets in NEXT_PUBLIC_ variables. Anything with that prefix can be seen by users in browser code.',
      },
      {
        type: 'tip',
        text: 'Validate required environment variables during startup or in a small helper. A clear error is better than a broken deploy with undefined values.',
      },
      {
        type: 'try',
        text: 'Add NEXT_PUBLIC_SUPPORT_EMAIL to .env.local and render it in a Client Component. Then add a server-only ADMIN_API_KEY and read it only from a Route Handler.',
      },
      {
        type: 'keypoints',
        items: [
          'Environment variables separate config from code.',
          'NEXT_PUBLIC_ variables are exposed to the browser.',
          'Server-only secrets should be read only in server code.',
          '.env.local is for local development and should not be committed with real secrets.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-typescript',
    title: 'TypeScript with Next.js',
    description:
      'Use TypeScript types for pages, route params, components, data, and safer Next.js app code.',
    level: 'intermediate',
    section: 'App Edge Features',
    order: 40,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'TypeScript helps catch mistakes before your Next.js app runs. It is especially useful for route params, component props, fetched data, and Server Action inputs.',
      },
      {
        type: 'p',
        text: 'You do not need to type every tiny detail at first. Start with the boundaries: props, API responses, params, and values that come from users.',
      },
      { type: 'h2', text: 'Type page params' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/products/[id]/page.tsx',
        code: `type ProductPageProps = {
  params: {
    id: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  return <h1>Product {params.id}</h1>;
}`,
      },
      { type: 'h2', text: 'Type fetched data' },
      {
        type: 'code',
        language: 'tsx',
        title: 'Typed data helper',
        code: `type Course = {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
};

async function getCourses(): Promise<Course[]> {
  const res = await fetch('https://api.example.com/courses');

  if (!res.ok) {
    throw new Error('Failed to load courses');
  }

  return res.json();
}`,
      },
      { type: 'h2', text: 'Type component props' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/components/course-card.tsx',
        code: `type CourseCardProps = {
  title: string;
  minutes: number;
  featured?: boolean;
};

export function CourseCard({ title, minutes, featured = false }: CourseCardProps) {
  return (
    <article className={featured ? 'border-blue-500' : 'border-gray-200'}>
      <h2>{title}</h2>
      <p>{minutes} minutes</p>
    </article>
  );
}`,
      },
      {
        type: 'note',
        text: 'TypeScript types are removed from the final JavaScript. They help developers and tools, but they do not validate untrusted runtime data by themselves.',
      },
      {
        type: 'tip',
        text: 'If data comes from a form, URL, cookie, or external API, combine TypeScript with runtime checks before trusting it.',
      },
      {
        type: 'try',
        text: 'Create a Lesson type with slug, title, and minutes. Use it to type a LessonCard component and a getLessons function.',
      },
      {
        type: 'keypoints',
        items: [
          'TypeScript catches many mistakes during development.',
          'Type route params, search params, props, and fetched data.',
          'Optional props can have default values.',
          'Types do not replace runtime validation for user-controlled data.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-tailwind',
    title: 'Tailwind CSS in Next.js',
    description:
      'Style Next.js pages and components with Tailwind utility classes while keeping layouts consistent.',
    level: 'intermediate',
    section: 'Styling at Scale',
    order: 41,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Tailwind CSS is commonly used with Next.js because it keeps styles close to the components they affect. Instead of inventing class names, you compose utility classes.',
      },
      {
        type: 'p',
        text: 'At intermediate level, focus on readable patterns: shared layout containers, consistent spacing, reusable components, and small custom CSS only when utilities are not enough.',
      },
      { type: 'h2', text: 'Configure content paths' },
      {
        type: 'code',
        language: 'tsx',
        title: 'tailwind.config.ts',
        code: `import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;`,
      },
      { type: 'h2', text: 'Use utilities in a component' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/components/pricing-card.tsx',
        code: `type PricingCardProps = {
  name: string;
  price: string;
  highlighted?: boolean;
};

export function PricingCard({ name, price, highlighted = false }: PricingCardProps) {
  return (
    <article
      className={
        'rounded-xl border p-6 shadow-sm ' +
        (highlighted ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white')
      }
    >
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="mt-2 text-3xl font-bold">{price}</p>
      <button className="mt-4 rounded bg-black px-4 py-2 text-white">
        Choose plan
      </button>
    </article>
  );
}`,
      },
      { type: 'h2', text: 'Keep global CSS small' },
      {
        type: 'code',
        language: 'css',
        title: 'app/globals.css',
        code: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  min-height: 100vh;
}`,
      },
      {
        type: 'note',
        text: 'Tailwind classes work in Server Components and Client Components because they are just className strings.',
      },
      {
        type: 'tip',
        text: 'When a class list becomes hard to read, extract a component or a small helper. Avoid hiding every Tailwind class behind custom CSS too early.',
      },
      {
        type: 'try',
        text: 'Create a reusable PageShell component with max width, horizontal padding, and vertical spacing utilities.',
      },
      {
        type: 'keypoints',
        items: [
          'Tailwind styles components with utility classes.',
          'Content paths tell Tailwind where to find class names.',
          'Use global CSS for base rules and rare custom styles.',
          'Extract reusable components for repeated layout and visual patterns.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-auth-patterns',
    title: 'Auth Patterns (Cookies, Sessions, Protected Routes)',
    description:
      'Learn vendor-neutral authentication patterns for cookies, sessions, protected pages, and redirects.',
    level: 'intermediate',
    section: 'Real App Skills',
    order: 42,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Authentication in Next.js is a pattern, not a single required vendor. Many apps use a library or hosted provider, but the ideas are the same: verify identity, store a session, protect routes, and read the current user on the server.',
      },
      {
        type: 'p',
        text: 'This lesson uses simplified examples to show the shape of the code. Production auth should include secure password handling, CSRF protection where needed, expiration, rotation, and careful auditing.',
      },
      { type: 'h2', text: 'Set a session cookie after login' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/api/login/route.ts',
        code: `import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || '');
  const password = String(body.password || '');

  // Pattern only: replace with real user lookup and password verification.
  if (email !== 'demo@example.com' || password !== 'correct-password') {
    return NextResponse.json({ error: 'Invalid login' }, { status: 401 });
  }

  cookies().set('session', 'signed-session-token', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return NextResponse.json({ ok: true });
}`,
      },
      { type: 'h2', text: 'Read the current session on the server' },
      {
        type: 'code',
        language: 'tsx',
        title: 'lib/auth.ts',
        code: `import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const session = cookies().get('session')?.value;

  if (!session) {
    return null;
  }

  // Pattern only: verify the signed token or load a session from your database.
  return {
    id: 'user_123',
    email: 'demo@example.com',
  };
}`,
      },
      { type: 'h2', text: 'Protect a Server Component page' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/dashboard/page.tsx',
        code: `import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../lib/auth';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return <h1>Welcome back, {user.email}</h1>;
}`,
      },
      {
        type: 'warning',
        text: 'These examples are conceptual. Do not store plain user ids or unsafely signed values as production sessions. Use a well-reviewed auth library or carefully implemented session system.',
      },
      {
        type: 'tip',
        text: 'Keep authorization checks close to the protected data. Hiding a link in the UI is not enough; the server must also verify access.',
      },
      {
        type: 'try',
        text: 'Create a protected /account page that calls getCurrentUser and redirects to /login when no user is found.',
      },
      {
        type: 'keypoints',
        items: [
          'Auth patterns include login, session storage, current-user lookup, and protected routes.',
          'Cookies used for sessions should be httpOnly, secure, and sameSite when possible.',
          'Server Components can redirect unauthenticated users.',
          'Production authentication should rely on strong verification and careful security practices.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-databases',
    title: 'Connecting a Database',
    description:
      'Connect database access to Server Components, Server Actions, and Route Handlers without locking into one vendor.',
    level: 'intermediate',
    section: 'Real App Skills',
    order: 43,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Most real Next.js apps need a database. The exact tool may be Prisma, Drizzle, a hosted SDK, a SQL client, MongoDB, or something else. The pattern is the same: keep database code on the server.',
      },
      {
        type: 'p',
        text: 'Do not import database clients into Client Components. Fetch data in Server Components, mutate data in Server Actions or Route Handlers, and pass only safe results to the browser.',
      },
      { type: 'h2', text: 'Create a server-only database helper' },
      {
        type: 'code',
        language: 'tsx',
        title: 'lib/db.ts',
        code: `type Course = {
  id: string;
  title: string;
  published: boolean;
};

export const db = {
  course: {
    async findMany(): Promise<Course[]> {
      // Pattern only: replace with Prisma, Drizzle, SQL, MongoDB, or a hosted SDK.
      return [
        { id: '1', title: 'Next.js Basics', published: true },
        { id: '2', title: 'Server Actions', published: true },
      ];
    },
  },
};`,
      },
      { type: 'h2', text: 'Query from a Server Component' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/courses/page.tsx',
        code: `import { db } from '../../lib/db';

export default async function CoursesPage() {
  const courses = await db.course.findMany();

  return (
    <main className="p-6">
      <h1>Courses</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>{course.title}</li>
        ))}
      </ul>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Write from a Server Action' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/courses/actions.ts',
        code: `'use server';

import { revalidatePath } from 'next/cache';

export async function createCourse(formData: FormData) {
  const title = String(formData.get('title') || '').trim();

  if (title.length < 3) {
    throw new Error('Course title is too short');
  }

  // Pattern only: db.course.create({ data: { title } })

  revalidatePath('/courses');
}`,
      },
      {
        type: 'note',
        text: 'Serverless deployments may open many database connections. Use connection pooling or a database provider designed for serverless environments when needed.',
      },
      {
        type: 'tip',
        text: 'Return only the fields your UI needs. Avoid sending private columns such as password hashes, tokens, or internal notes to components that render in the browser.',
      },
      {
        type: 'try',
        text: 'Create a lib/db.ts pattern for lessons with findMany and findBySlug methods. Use it from a Server Component page.',
      },
      {
        type: 'keypoints',
        items: [
          'Database code belongs on the server.',
          'Server Components are good places to read database data.',
          'Server Actions and Route Handlers are good places to write data.',
          'Connection pooling and safe field selection matter in production apps.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-uploads',
    title: 'File Uploads & Media',
    description:
      'Handle file uploads in Next.js with forms, Route Handlers, validation, and storage-provider patterns.',
    level: 'intermediate',
    section: 'Real App Skills',
    order: 44,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'File uploads need both UI and backend handling. The browser sends a file with multipart form data, and the server validates it before storing it.',
      },
      {
        type: 'p',
        text: 'For production, many apps upload to object storage such as S3-compatible storage, Cloudinary, UploadThing, or another media service. The examples here show the pattern without locking you into one provider.',
      },
      { type: 'h2', text: 'Create an upload form' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/profile/avatar-form.tsx',
        code: `export function AvatarForm() {
  return (
    <form action="/api/avatar" method="post" encType="multipart/form-data">
      <input type="file" name="avatar" accept="image/png,image/jpeg" />
      <button type="submit">Upload avatar</button>
    </form>
  );
}`,
      },
      { type: 'h2', text: 'Validate the file in a Route Handler' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/api/avatar/route.ts',
        code: `import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('avatar');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Avatar file is required' }, { status: 400 });
  }

  if (!['image/png', 'image/jpeg'].includes(file.type)) {
    return NextResponse.json({ error: 'Only PNG and JPEG files are allowed' }, { status: 400 });
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be smaller than 2MB' }, { status: 400 });
  }

  // Pattern only: stream or upload the file to your storage provider here.
  return NextResponse.json({
    uploaded: true,
    name: file.name,
    size: file.size,
  });
}`,
      },
      { type: 'h2', text: 'Store metadata, not just bytes' },
      {
        type: 'p',
        text: 'After a storage provider returns a URL or key, save metadata in your database: owner id, file name, content type, size, storage key, and created date.',
      },
      {
        type: 'note',
        text: 'Do not trust file extensions. Validate content type, file size, authentication, and ownership on the server.',
      },
      {
        type: 'tip',
        text: 'For large uploads, prefer direct-to-storage uploads with signed URLs so your Next.js server does not handle the full file body.',
      },
      {
        type: 'try',
        text: 'Create an upload endpoint for PDF resumes. Allow only application/pdf and reject files larger than 5MB.',
      },
      {
        type: 'keypoints',
        items: [
          'File forms need encType multipart/form-data.',
          'Route Handlers can read files with request.formData().',
          'Validate type, size, authentication, and ownership.',
          'Production apps often store files in object storage and metadata in a database.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-error-handling',
    title: 'Error Handling Patterns',
    description:
      'Handle expected and unexpected errors with error.tsx, not-found.tsx, route responses, and careful boundaries.',
    level: 'intermediate',
    section: 'Real App Skills',
    order: 45,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Errors are part of real applications. Next.js gives you route-level error boundaries, not-found pages, and normal HTTP responses in Route Handlers.',
      },
      {
        type: 'p',
        text: 'A helpful pattern is to separate expected states from unexpected failures. Not found, invalid input, and unauthorized access are expected states. A crashed API or broken database query is an unexpected failure.',
      },
      { type: 'h2', text: 'Catch route errors with error.tsx' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/dashboard/error.tsx',
        code: `'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="space-y-4 p-6">
      <h1>Something went wrong</h1>
      <p className="text-sm text-gray-600">{error.message}</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}`,
      },
      { type: 'h2', text: 'Use notFound for missing records' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/products/[id]/page.tsx',
        code: `import { notFound } from 'next/navigation';

async function getProduct(id: string) {
  const res = await fetch('https://api.example.com/products/' + id);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('Failed to load product');
  }

  return res.json();
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <h1>{product.name}</h1>;
}`,
      },
      { type: 'h2', text: 'Return clear API errors' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/api/messages/route.ts',
        code: `import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = String(body.message || '');

    if (message.length < 10) {
      return NextResponse.json({ error: 'Message is too short' }, { status: 400 });
    }

    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}`,
      },
      {
        type: 'note',
        text: 'error.tsx must be a Client Component because it receives reset, a function the user can trigger from the browser.',
      },
      {
        type: 'tip',
        text: 'Log detailed errors on the server, but show safe and helpful messages to users. Avoid leaking secrets, stack traces, or database details.',
      },
      {
        type: 'try',
        text: 'Add not-found.tsx to a products route and use notFound() when a product lookup returns null.',
      },
      {
        type: 'keypoints',
        items: [
          'Use error.tsx for route-level unexpected errors.',
          'Use notFound for missing resources.',
          'Route Handlers should return clear status codes for expected errors.',
          'User-facing messages should be safe and understandable.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-parallel-routes',
    title: 'Parallel & Intercepting Routes (Practical Intro)',
    description:
      'Use parallel and intercepting routes for practical UI such as modals that preserve page context.',
    level: 'intermediate',
    section: 'Advanced Routing',
    order: 46,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Parallel routes let one layout render multiple route slots at the same time. Intercepting routes let a route appear in a different context, such as opening a photo detail page inside a modal over a gallery.',
      },
      {
        type: 'p',
        text: 'These features are advanced, but the practical goal is easy to understand: keep the current page visible while showing another route as an overlay or secondary panel.',
      },
      { type: 'h2', text: 'A modal route structure' },
      {
        type: 'code',
        language: 'bash',
        title: 'Example file tree',
        code: `app/
  photos/
    page.tsx
    [id]/
      page.tsx
    @modal/
      default.tsx
      (.)[id]/
        page.tsx
    layout.tsx`,
      },
      { type: 'h2', text: 'Render the modal slot' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/photos/layout.tsx',
        code: `export default function PhotosLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/photos/@modal/default.tsx',
        code: `export default function DefaultModal() {
  return null;
}`,
      },
      { type: 'h2', text: 'Intercept a photo detail route' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/photos/@modal/(.)[id]/page.tsx',
        code: `import Link from 'next/link';

export default function PhotoModal({ params }: { params: { id: string } }) {
  return (
    <div className="fixed inset-0 bg-black/60 p-8">
      <div className="mx-auto max-w-lg rounded bg-white p-6">
        <Link href="/photos">Close</Link>
        <h1 className="mt-4 text-xl font-bold">Photo {params.id}</h1>
      </div>
    </div>
  );
}`,
      },
      {
        type: 'note',
        text: 'The same photo can still have a normal full page at app/photos/[id]/page.tsx. The intercepted route controls how it appears when opened from the photos context.',
      },
      {
        type: 'tip',
        text: 'Reach for this pattern when URL-based modals matter. If a modal is only local UI and does not need a shareable URL, simple client state may be enough.',
      },
      {
        type: 'try',
        text: 'Sketch a messages inbox where selecting a message opens it in a parallel detail panel while the inbox list remains visible.',
      },
      {
        type: 'keypoints',
        items: [
          'Parallel routes render named slots in a layout.',
          'Intercepting routes show a route inside another route context.',
          'This is useful for modals, drawers, and split-view interfaces.',
          'Use the pattern when URL behavior and preserved context are important.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-route-groups',
    title: 'Route Groups & Organizing Apps',
    description:
      'Organize App Router projects with route groups that do not affect the URL path.',
    level: 'intermediate',
    section: 'Advanced Routing',
    order: 47,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Route groups are folders wrapped in parentheses, such as (marketing) or (dashboard). They organize routes without adding that folder name to the URL.',
      },
      {
        type: 'p',
        text: 'Use route groups to separate layouts, ownership areas, and app sections while keeping clean URLs for users.',
      },
      { type: 'h2', text: 'Organize without changing URLs' },
      {
        type: 'code',
        language: 'bash',
        title: 'Route groups example',
        code: `app/
  (marketing)/
    layout.tsx
    page.tsx
    pricing/
      page.tsx
  (dashboard)/
    layout.tsx
    dashboard/
      page.tsx
    settings/
      page.tsx`,
      },
      {
        type: 'p',
        text: 'In this tree, users visit /, /pricing, /dashboard, and /settings. The group names do not appear in the browser address bar.',
      },
      { type: 'h2', text: 'Use different layouts per group' },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/(marketing)/layout.tsx',
        code: `export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <header className="border-b p-4">Public site</header>
      {children}
    </main>
  );
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        title: 'app/(dashboard)/layout.tsx',
        code: `export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid grid-cols-[240px_1fr]">
      <aside className="border-r p-4">Dashboard nav</aside>
      <section>{children}</section>
    </main>
  );
}`,
      },
      {
        type: 'note',
        text: 'Route groups are also useful when different teams own different parts of a large app.',
      },
      {
        type: 'tip',
        text: 'Avoid creating too many groups too early. Start with groups that match real layout or ownership boundaries.',
      },
      {
        type: 'try',
        text: 'Create a route group plan for an app with public pages, authenticated dashboard pages, and admin pages.',
      },
      {
        type: 'keypoints',
        items: [
          'Route group folder names use parentheses.',
          'Group names do not appear in the URL.',
          'Groups can have separate layouts.',
          'Use groups to organize large apps by layout, feature area, or ownership.',
        ],
      },
    ],
  },
  {
    slug: 'nextjs-deploy',
    title: 'Deploying to Vercel',
    description:
      'Prepare a Next.js App Router project for deployment on Vercel with build checks, environment variables, and production habits.',
    level: 'intermediate',
    section: 'Shipping',
    order: 48,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Vercel is the deployment platform made by the creators of Next.js, so it supports App Router features with minimal configuration. You connect a Git repository, set environment variables, and Vercel builds each push.',
      },
      {
        type: 'p',
        text: 'Deployment is not only clicking a button. A shippable app should build locally, have required environment variables, avoid leaking secrets, and handle dynamic behavior intentionally.',
      },
      { type: 'h2', text: 'Check the project before deploying' },
      {
        type: 'code',
        language: 'bash',
        title: 'Local checks',
        code: `npm run lint
npm run build`,
      },
      { type: 'h2', text: 'Common package scripts' },
      {
        type: 'code',
        language: 'json',
        title: 'package.json',
        code: `{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}`,
      },
      { type: 'h2', text: 'Optional Vercel configuration' },
      {
        type: 'code',
        language: 'json',
        title: 'vercel.json',
        code: `{
  "framework": "nextjs"
}`,
      },
      {
        type: 'p',
        text: 'Most Next.js projects do not need a vercel.json file. Add one only when you need project-specific Vercel settings.',
      },
      { type: 'h2', text: 'Deployment checklist' },
      {
        type: 'ul',
        items: [
          'Add production environment variables in the Vercel dashboard.',
          'Confirm NEXT_PUBLIC_ variables contain only public values.',
          'Run a local production build before pushing important changes.',
          'Check that database and storage providers allow production connections.',
          'Review dynamic routes, revalidation, and caching choices.',
        ],
      },
      {
        type: 'note',
        text: 'Preview deployments are useful for testing a branch before it reaches production. Treat them like real environments and configure safe preview secrets.',
      },
      {
        type: 'tip',
        text: 'After deploying, test the user journeys that cross server and client boundaries: login, forms, uploads, protected pages, and data refreshes.',
      },
      {
        type: 'try',
        text: 'Write a release checklist for your Next.js app with build, env vars, database, auth, and smoke-test steps.',
      },
      {
        type: 'keypoints',
        items: [
          'Vercel has first-class support for Next.js App Router projects.',
          'Run lint and build checks before deploying.',
          'Configure production and preview environment variables carefully.',
          'Smoke-test real workflows after deployment.',
        ],
      },
    ],
  },
];
