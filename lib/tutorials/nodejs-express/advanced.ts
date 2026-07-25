import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'express-architecture',
    title: 'Structuring Larger Express Apps',
    description:
      'Organize Express applications into predictable modules that can grow without becoming a single giant server file.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 49,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Small Express apps often start in one file: create the app, add middleware, define routes, connect to a database, and start listening. That is fine for learning, but larger apps need clear boundaries so teams can change one feature without breaking every other feature.',
      },
      {
        type: 'p',
        text: 'Good architecture is not about making Express look complicated. It is about putting code where a future developer would expect to find it: routes describe HTTP, controllers handle request and response, services hold business rules, and data modules talk to databases or external APIs.',
      },
      { type: 'h2', text: 'A practical folder structure' },
      {
        type: 'code',
        language: 'text',
        title: 'Feature-focused Express layout',
        code: `src/
  app.ts                 # creates and configures the Express app
  server.ts              # starts the HTTP server
  config/
    env.ts               # reads and validates environment variables
  middleware/
    error-handler.ts
    not-found.ts
    request-id.ts
  modules/
    users/
      users.routes.ts
      users.controller.ts
      users.service.ts
      users.repository.ts
      users.schema.ts
    products/
      products.routes.ts
      products.controller.ts
      products.service.ts
      products.repository.ts
      products.schema.ts
  db/
    client.ts
  utils/
    async-handler.ts`,
      },
      {
        type: 'note',
        text: 'This is a starting point, not a law. Some teams call modules features, repositories data access, and controllers handlers. The names matter less than the separation of responsibilities.',
      },
      { type: 'h2', text: 'Separate app creation from server startup' },
      {
        type: 'p',
        text: 'The app file should build the Express application. The server file should bind it to a port. This makes tests easier because you can import the app without opening a network port.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/app.ts',
        code: `import express from 'express';
import { usersRouter } from './modules/users/users.routes';
import { notFound } from './middleware/not-found';
import { errorHandler } from './middleware/error-handler';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));
  app.use('/api/users', usersRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/server.ts',
        code: `import { createServer } from 'node:http';
import { createApp } from './app';
import { env } from './config/env';

const app = createApp();
const server = createServer(app);

server.listen(env.PORT, () => {
  console.log('API listening on port ' + env.PORT);
});`,
      },
      { type: 'h2', text: 'Organize by feature, not by file type only' },
      {
        type: 'p',
        text: 'A folder called controllers with 40 files and a folder called services with 40 files can still be hard to navigate. Feature folders keep related code close together. When you work on users, you open the users module.',
      },
      {
        type: 'table',
        headers: ['Layer', 'Owns', 'Avoid putting here'],
        rows: [
          ['Route', 'URL paths, HTTP verbs, route-level middleware', 'Business rules'],
          ['Controller', 'Reading request data and sending responses', 'SQL queries or external API details'],
          ['Service', 'Use cases, permissions, transactions, decisions', 'Express req/res objects'],
          ['Repository', 'Database access and persistence shape', 'HTTP status codes'],
          ['Middleware', 'Cross-cutting HTTP behavior', 'Feature-specific workflow'],
        ],
      },
      { type: 'h2', text: 'Version and mount APIs intentionally' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Mount routers in one predictable place',
        code: `import { Router } from 'express';
import { usersRouter } from './modules/users/users.routes';
import { productsRouter } from './modules/products/products.routes';

export const apiRouter = Router();

apiRouter.use('/users', usersRouter);
apiRouter.use('/products', productsRouter);

// app.ts
// app.use('/api/v1', apiRouter);`,
      },
      {
        type: 'tip',
        text: 'Use versioned prefixes when clients outside your control depend on the API. Versioning gives you a safe place to introduce breaking changes later.',
      },
      { type: 'h2', text: 'Architecture checklist' },
      {
        type: 'ul',
        items: [
          'Can tests import the app without starting a port?',
          'Can a service function run without Express req and res?',
          'Is database access hidden behind a small module or repository?',
          'Are environment variables read in one place?',
          'Do all errors pass through one error handler?',
          'Can a new developer find a feature by folder name?',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Large Express apps stay manageable when HTTP, business logic, and data access have separate responsibilities.',
          'Feature folders scale better than one huge routes file.',
          'Keep app creation separate from server startup for testing and reuse.',
        ],
      },
    ],
  },
  {
    slug: 'express-clean-patterns',
    title: 'Clean Request → Controller → Service → Data',
    description:
      'Build a clean Express flow where validation, controllers, services, repositories, and errors each have one job.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 50,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'A clean Express request flow keeps framework code at the edge. The controller translates HTTP into a use case, the service performs the use case, and the repository handles data storage. This reduces duplicated logic and makes behavior easier to test.',
      },
      { type: 'h2', text: 'The request flow' },
      {
        type: 'code',
        language: 'text',
        title: 'Clean backend flow',
        code: `HTTP request
  -> route middleware
  -> validation
  -> controller
  -> service
  -> repository or external client
  -> service returns result
  -> controller sends HTTP response
  -> error middleware handles failures`,
      },
      { type: 'h2', text: 'Route: choose the endpoint and middleware' },
      {
        type: 'code',
        language: 'typescript',
        title: 'users.routes.ts',
        code: `import { Router } from 'express';
import { createUser } from './users.controller';
import { validateBody } from '../../middleware/validate-body';
import { createUserSchema } from './users.schema';

export const usersRouter = Router();

usersRouter.post('/', validateBody(createUserSchema), createUser);`,
      },
      { type: 'h2', text: 'Controller: translate HTTP' },
      {
        type: 'p',
        text: 'Controllers should be thin. They read validated request values, call a service, choose an HTTP status, and return a response body. Avoid placing database queries, password rules, pricing rules, or email logic inside controllers.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'users.controller.ts',
        code: `import type { Request, Response } from 'express';
import { usersService } from './users.service';

export async function createUser(req: Request, res: Response) {
  const user = await usersService.createUser(req.body);

  res.status(201).json({
    data: user,
  });
}`,
      },
      { type: 'h2', text: 'Service: own the use case' },
      {
        type: 'code',
        language: 'typescript',
        title: 'users.service.ts',
        code: `import { usersRepository } from './users.repository';
import { ConflictError } from '../../utils/errors';

type CreateUserInput = {
  email: string;
  name: string;
};

export const usersService = {
  async createUser(input: CreateUserInput) {
    const existingUser = await usersRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ConflictError('Email is already registered');
    }

    return usersRepository.create({
      email: input.email.toLowerCase(),
      name: input.name.trim(),
    });
  },
};`,
      },
      { type: 'h2', text: 'Repository: own persistence details' },
      {
        type: 'code',
        language: 'typescript',
        title: 'users.repository.ts',
        code: `import { db } from '../../db/client';

export const usersRepository = {
  findByEmail(email: string) {
    return db.user.findUnique({
      where: { email },
    });
  },

  create(data: { email: string; name: string }) {
    return db.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  },
};`,
      },
      { type: 'h2', text: 'Use a small async wrapper' },
      {
        type: 'p',
        text: 'Express 4 does not automatically catch rejected promises from async route handlers. A wrapper keeps controllers clean and sends failures to the central error handler.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'async-handler.ts',
        code: `import type { NextFunction, Request, Response } from 'express';

type AsyncRoute = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function asyncHandler(route: AsyncRoute) {
  return function wrappedRoute(req: Request, res: Response, next: NextFunction) {
    Promise.resolve(route(req, res, next)).catch(next);
  };
}`,
      },
      { type: 'h2', text: 'Centralize error responses' },
      {
        type: 'code',
        language: 'typescript',
        title: 'error-handler.ts',
        code: `import type { ErrorRequestHandler } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code = 'APP_ERROR',
  ) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    },
  });
};`,
      },
      {
        type: 'warning',
        text: 'Do not return raw database errors to clients. They may expose table names, query structure, internal IDs, or security-sensitive implementation details.',
      },
      {
        type: 'try',
        text: 'Pick one existing route in your app. Mark each line as route, controller, service, or data access. If one file contains all four, split only the most obvious boundary first.',
      },
      {
        type: 'keypoints',
        items: [
          'Controllers should know HTTP; services should know business rules.',
          'Repositories hide database details from the rest of the app.',
          'Central error handling keeps responses consistent and prevents leaked internals.',
        ],
      },
    ],
  },
  {
    slug: 'node-performance',
    title: 'Node/Express Performance Mindset',
    description:
      'Understand event loop health, slow routes, payload size, streaming, clustering, and the habits that make Node services reliable under load.',
    level: 'advanced',
    section: 'Scale & Reliability',
    order: 51,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Node.js can handle many concurrent connections because it uses an event loop and non-blocking I/O. That does not mean every Node app is automatically fast. Slow database queries, CPU-heavy work, huge JSON payloads, and unbounded concurrency can still make an Express API feel stuck.',
      },
      { type: 'h2', text: 'Protect the event loop' },
      {
        type: 'p',
        text: 'The event loop runs JavaScript callbacks. If one request spends 900ms compressing an image, parsing a massive file, or calculating a report synchronously, every other request waits behind it. Move CPU-heavy work to queues, worker threads, or separate services.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Blocking code to avoid in request handlers',
        code: `app.get('/report', (req, res) => {
  const report = buildHugeReportSynchronously(); // blocks the event loop
  res.json(report);
});`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Queue long work and return quickly',
        code: `app.post('/reports', async (req, res) => {
  const job = await reportQueue.add('build-report', {
    userId: req.user.id,
    filters: req.body.filters,
  });

  res.status(202).json({
    jobId: job.id,
    statusUrl: '/api/reports/jobs/' + job.id,
  });
});`,
      },
      { type: 'h2', text: 'Measure route latency' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Simple response time middleware',
        code: `app.use((req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const endedAt = process.hrtime.bigint();
    const durationMs = Number(endedAt - startedAt) / 1_000_000;
    console.log(req.method, req.originalUrl, res.statusCode, durationMs.toFixed(1) + 'ms');
  });

  next();
});`,
      },
      { type: 'h2', text: 'Reduce payload work' },
      {
        type: 'ul',
        items: [
          'Return only fields the client needs.',
          'Paginate lists instead of returning thousands of rows.',
          'Use compression for text responses, but do not compress already-compressed images.',
          'Set JSON body limits so clients cannot send unlimited data.',
          'Stream large downloads instead of loading full files into memory.',
        ],
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Limit request body size',
        code: `app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));`,
      },
      { type: 'h2', text: 'Use streaming for large files' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Stream a file instead of buffering it',
        code: `import { createReadStream } from 'node:fs';

app.get('/exports/:fileName', (req, res, next) => {
  const stream = createReadStream('/safe/exports/' + req.params.fileName);

  stream.on('error', next);
  res.setHeader('Content-Type', 'text/csv');
  stream.pipe(res);
});`,
      },
      { type: 'h2', text: 'Scale processes carefully' },
      {
        type: 'p',
        text: 'One Node process uses one main JavaScript thread. In production, run multiple processes across CPU cores using a process manager, containers, Kubernetes replicas, or platform scaling. Keep sessions, caches, and uploaded files outside process memory when you scale horizontally.',
      },
      {
        type: 'table',
        headers: ['Problem', 'Common fix', 'Watch out'],
        rows: [
          ['Slow database queries', 'Indexes, query plans, pagination', 'Adding app servers will not fix a missing index'],
          ['CPU-heavy work', 'Queue, worker thread, external service', 'Do not run it in the request path'],
          ['Too many requests', 'Rate limits, caching, autoscaling', 'Autoscaling needs metrics and health checks'],
          ['Memory growth', 'Heap snapshots, streaming, bounded caches', 'Global arrays can become accidental memory leaks'],
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Node performance starts with event loop health.',
          'Measure before guessing: latency, throughput, error rate, memory, and database time.',
          'Move long-running CPU work away from request handlers.',
        ],
      },
    ],
  },
  {
    slug: 'express-caching',
    title: 'Caching with Redis Patterns',
    description:
      'Use Redis with Express for cache-aside reads, invalidation, TTLs, rate limiting, and safe production caching decisions.',
    level: 'advanced',
    section: 'Scale & Reliability',
    order: 52,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Caching stores expensive results so later requests can be served faster. Redis is popular with Express because it is fast, network-accessible, supports expiration, and works across many app instances.',
      },
      {
        type: 'warning',
        text: 'Caching is not a replacement for correct data modeling or database indexes. A cache can hide a slow query for a while, but the query still matters when the cache misses or expires.',
      },
      { type: 'h2', text: 'Cache-aside pattern' },
      {
        type: 'p',
        text: 'In cache-aside, the app checks Redis first. If the key exists, return it. If not, load from the database, store the value in Redis with a TTL, then return it.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Redis client',
        code: `import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', (err) => {
  console.error('Redis error', err);
});

await redis.connect();`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Cache-aside product lookup',
        code: `app.get('/api/products/:id', async (req, res, next) => {
  try {
    const cacheKey = 'product:' + req.params.id;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json({
        data: JSON.parse(cached),
        cache: 'hit',
      });
    }

    const product = await productsRepository.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await redis.set(cacheKey, JSON.stringify(product), {
      EX: 60,
    });

    return res.json({
      data: product,
      cache: 'miss',
    });
  } catch (err) {
    next(err);
  }
});`,
      },
      { type: 'h2', text: 'Choose keys deliberately' },
      {
        type: 'table',
        headers: ['Data', 'Example key', 'TTL idea'],
        rows: [
          ['Product detail', 'product:42', '30 seconds to 10 minutes'],
          ['User permissions', 'user:42:permissions', 'Short TTL or invalidate on role change'],
          ['Search result page', 'search:shoes:page:2', 'Short TTL because combinations grow quickly'],
          ['Feature flags', 'flags:tenant:acme', 'Small TTL with fallback defaults'],
        ],
      },
      { type: 'h2', text: 'Invalidate on writes' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Delete stale cache after update',
        code: `app.patch('/api/products/:id', async (req, res, next) => {
  try {
    const product = await productsRepository.update(req.params.id, req.body);

    await redis.del('product:' + req.params.id);

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
});`,
      },
      {
        type: 'note',
        text: 'Invalidation is often the hardest part of caching. Prefer simple keys and short TTLs until you know the data has high read traffic and clear update rules.',
      },
      { type: 'h2', text: 'Prevent cache stampedes' },
      {
        type: 'p',
        text: 'A stampede happens when many requests miss the same key at the same time and all hit the database. Common fixes include short locks, request coalescing, stale-while-revalidate, and adding random jitter to TTLs.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Add TTL jitter',
        code: `const baseTtlSeconds = 60;
const jitterSeconds = Math.floor(Math.random() * 20);

await redis.set(cacheKey, JSON.stringify(value), {
  EX: baseTtlSeconds + jitterSeconds,
});`,
      },
      { type: 'h2', text: 'Redis for rate limiting' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Simple fixed-window rate limiter',
        code: `async function rateLimit(req, res, next) {
  const key = 'rate:' + req.ip;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60);
  }

  if (count > 100) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  next();
}`,
      },
      {
        type: 'keypoints',
        items: [
          'Cache-aside is the most common Express plus Redis read pattern.',
          'Every cache key needs an invalidation or expiration strategy.',
          'Keep cached data safe: never cache private data under a shared key.',
        ],
      },
    ],
  },
  {
    slug: 'express-queues',
    title: 'Background Jobs & Queues',
    description:
      'Move slow work out of Express requests with queue-based workers, retries, idempotency, and safe job status APIs.',
    level: 'advanced',
    section: 'Scale & Reliability',
    order: 53,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'A queue lets your API accept work now and process it later. This keeps HTTP responses fast when the real work is slow, unreliable, or CPU-heavy: sending email, generating PDFs, resizing images, importing CSVs, syncing webhooks, and calling third-party services.',
      },
      { type: 'h2', text: 'When to use a background job' },
      {
        type: 'ul',
        items: [
          'The user does not need the final result immediately.',
          'The work may take longer than a normal request timeout.',
          'The work should retry if a provider is temporarily down.',
          'The work uses a lot of CPU or memory.',
          'You need controlled concurrency instead of unlimited request spikes.',
        ],
      },
      { type: 'h2', text: 'API and worker are separate processes' },
      {
        type: 'code',
        language: 'text',
        title: 'Queue architecture',
        code: `Client
  -> Express API
      -> creates job in Redis-backed queue
          -> Worker process picks up job
              -> database, email provider, file storage
  <- API returns 202 Accepted with job id`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Create a BullMQ queue',
        code: `import { Queue } from 'bullmq';

export const emailQueue = new Queue('emails', {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
  },
});`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Add a job from Express',
        code: `app.post('/api/password-resets', async (req, res, next) => {
  try {
    const job = await emailQueue.add(
      'send-password-reset',
      {
        email: req.body.email,
        requestedAt: new Date().toISOString(),
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    );

    res.status(202).json({
      jobId: job.id,
      message: 'If the email exists, a reset link will be sent.',
    });
  } catch (err) {
    next(err);
  }
});`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Worker process',
        code: `import { Worker } from 'bullmq';
import { sendPasswordResetEmail } from './email-service';

const worker = new Worker(
  'emails',
  async (job) => {
    if (job.name === 'send-password-reset') {
      await sendPasswordResetEmail(job.data.email);
    }
  },
  {
    concurrency: 5,
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT || 6379),
    },
  },
);

worker.on('failed', (job, err) => {
  console.error('Job failed', job?.id, err);
});`,
      },
      { type: 'h2', text: 'Design jobs to be idempotent' },
      {
        type: 'p',
        text: 'A job may run more than once because of retries, worker crashes, or deployment restarts. Idempotent jobs are safe to repeat. For example, use a unique email message ID, check whether a report already exists, or store webhook event IDs before processing.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Skip duplicate webhook events',
        code: `async function processPaymentWebhook(event) {
  const alreadyProcessed = await webhookEventsRepository.exists(event.id);

  if (alreadyProcessed) {
    return;
  }

  await webhookEventsRepository.create({ id: event.id });
  await paymentsService.applyEvent(event);
}`,
      },
      { type: 'h2', text: 'Expose job status when useful' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Job status endpoint',
        code: `app.get('/api/jobs/:id', async (req, res) => {
  const job = await emailQueue.getJob(req.params.id);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const state = await job.getState();

  return res.json({
    id: job.id,
    state,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason,
  });
});`,
      },
      {
        type: 'warning',
        text: 'Never put secrets, raw passwords, or huge payloads into queue jobs. Store sensitive or large data in a database or object storage, then put only an ID in the job.',
      },
      {
        type: 'keypoints',
        items: [
          'Queues keep Express request handlers fast and reliable.',
          'Workers need retries, error logging, concurrency limits, and idempotent job logic.',
          'Return 202 Accepted when work has started but is not complete.',
        ],
      },
    ],
  },
  {
    slug: 'express-websockets',
    title: 'WebSockets / realtime with Express',
    description:
      'Add realtime behavior to an Express application using an HTTP server, Socket.IO-style events, rooms, authentication, and scaling rules.',
    level: 'advanced',
    section: 'Scale & Reliability',
    order: 54,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'HTTP is request-response: the client asks and the server answers. Realtime apps also need server-initiated messages: chat, notifications, live dashboards, collaborative cursors, delivery status, support queues, and multiplayer state.',
      },
      { type: 'h2', text: 'Realtime choices' },
      {
        type: 'table',
        headers: ['Tool', 'Best for', 'Tradeoff'],
        rows: [
          ['WebSocket', 'Two-way, low-latency communication', 'You manage connections and reconnection'],
          ['Socket.IO', 'Rooms, reconnection, fallbacks, events', 'Adds its own protocol above WebSocket'],
          ['Server-Sent Events', 'One-way server to browser updates', 'No client-to-server channel beyond normal HTTP'],
          ['Polling', 'Simple status checks', 'More latency and repeated HTTP overhead'],
        ],
      },
      { type: 'h2', text: 'Attach realtime to the same HTTP server' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Express with Socket.IO',
        code: `import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
  },
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

io.on('connection', (socket) => {
  console.log('connected', socket.id);

  socket.on('disconnect', () => {
    console.log('disconnected', socket.id);
  });
});

httpServer.listen(3000);`,
      },
      { type: 'h2', text: 'Use rooms for targeted messages' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Join a room and broadcast to it',
        code: `io.on('connection', (socket) => {
  socket.on('chat:join', (roomId) => {
    socket.join('room:' + roomId);
  });

  socket.on('chat:message', async (payload) => {
    const message = await messagesRepository.create({
      roomId: payload.roomId,
      userId: socket.data.user.id,
      text: payload.text,
    });

    io.to('room:' + payload.roomId).emit('chat:message', message);
  });
});`,
      },
      { type: 'h2', text: 'Authenticate sockets' },
      {
        type: 'p',
        text: 'A socket connection is long-lived, so authenticate at connection time and store safe user data on the socket. Also authorize every room join or action. A connected user should not be able to join any room ID they can guess.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Socket authentication middleware',
        code: `io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const user = await authService.verifyAccessToken(token);

    socket.data.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (err) {
    next(new Error('Unauthorized'));
  }
});`,
      },
      { type: 'h2', text: 'Scaling realtime' },
      {
        type: 'p',
        text: 'When you run multiple app instances, one socket may be connected to instance A while another is connected to instance B. Use a shared adapter such as Redis pub/sub so broadcasts can reach sockets across instances.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Socket.IO Redis adapter',
        code: `import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));`,
      },
      {
        type: 'warning',
        text: 'Realtime events are not a database. Persist important messages or notifications before emitting them so disconnected clients can catch up later.',
      },
      {
        type: 'keypoints',
        items: [
          'Use realtime when the server must push updates without waiting for another HTTP request.',
          'Authenticate connections and authorize room membership.',
          'Use shared adapters and external state when scaling across multiple processes.',
        ],
      },
    ],
  },
  {
    slug: 'express-security-advanced',
    title: 'Advanced API Security',
    description:
      'Harden production Express APIs with secure headers, CORS, rate limits, input limits, tokens, authorization, and dependency hygiene.',
    level: 'advanced',
    section: 'Production',
    order: 55,
    minutes: 19,
    content: [
      {
        type: 'p',
        text: 'Advanced security is a collection of boring habits applied consistently. Most Express incidents are not movie-style hacks. They are missing authorization checks, leaked secrets, unlimited request bodies, unsafe CORS, vulnerable dependencies, weak token handling, or forgotten admin routes.',
      },
      { type: 'h2', text: 'Start with secure defaults' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Common security middleware',
        code: `import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.disable('x-powered-by');

app.use(helmet());
app.use(express.json({ limit: '1mb' }));

app.use(
  cors({
    origin: ['https://app.example.com'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  }),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);`,
      },
      { type: 'h2', text: 'Authentication is identity; authorization is permission' },
      {
        type: 'p',
        text: 'Authentication answers, who are you? Authorization answers, are you allowed to do this? A valid token is not enough. Every sensitive route must check ownership, role, tenant, or permission.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Ownership authorization',
        code: `app.delete('/api/projects/:projectId', requireAuth, async (req, res, next) => {
  try {
    const project = await projectsRepository.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await projectsRepository.remove(project.id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});`,
      },
      { type: 'h2', text: 'Validate everything at the edge' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Validate body and params',
        code: `import { z } from 'zod';

const updateProjectSchema = z.object({
  name: z.string().trim().min(1).max(80),
  visibility: z.enum(['private', 'team', 'public']),
});

const paramsSchema = z.object({
  projectId: z.string().uuid(),
});

app.patch('/api/projects/:projectId', requireAuth, async (req, res) => {
  const params = paramsSchema.parse(req.params);
  const body = updateProjectSchema.parse(req.body);

  const project = await projectsService.updateProject(req.user.id, params.projectId, body);

  res.json({ data: project });
});`,
      },
      { type: 'h2', text: 'Token safety checklist' },
      {
        type: 'ul',
        items: [
          'Use HTTPS in production.',
          'Keep access tokens short-lived.',
          'Store refresh tokens carefully and rotate them.',
          'Hash refresh tokens before storing them in a database.',
          'Use httpOnly, secure cookies when browser storage risk is high.',
          'Never log tokens, passwords, API keys, or reset links.',
        ],
      },
      { type: 'h2', text: 'Defend against common API risks' },
      {
        type: 'table',
        headers: ['Risk', 'Example', 'Mitigation'],
        rows: [
          ['Broken object authorization', 'User changes /users/12 to /users/13', 'Check ownership or permission in the service'],
          ['Mass assignment', 'Client sends role: admin', 'Whitelist allowed fields'],
          ['Injection', 'Raw SQL with user input', 'Parameterized queries and schema validation'],
          ['Secret exposure', 'Stack traces in production', 'Central error handler with safe messages'],
          ['DoS by payload', '50MB JSON body', 'Body limits and rate limits'],
        ],
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Whitelist fields instead of trusting req.body',
        code: `function pickProfileFields(body) {
  return {
    displayName: body.displayName,
    bio: body.bio,
    avatarUrl: body.avatarUrl,
  };
}`,
      },
      {
        type: 'tip',
        text: 'Run dependency audits in CI, but also review packages before adding them. A small dependency can still execute code during install or bring many transitive packages.',
      },
      {
        type: 'keypoints',
        items: [
          'Security requires both authentication and authorization.',
          'Validate inputs, limit payloads, and avoid exposing internal errors.',
          'CORS is not access control for non-browser clients; server-side authorization still matters.',
        ],
      },
    ],
  },
  {
    slug: 'express-observability',
    title: 'Logging, Metrics & Health Checks',
    description:
      'Make Express production-ready with structured logs, request IDs, metrics, readiness checks, and useful error context.',
    level: 'advanced',
    section: 'Production',
    order: 56,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Observability means you can understand what your app is doing from the outside. In production, you cannot rely on refreshing the browser and guessing. You need logs, metrics, traces or request IDs, and health checks that describe whether the service can do useful work.',
      },
      { type: 'h2', text: 'Structured logs beat random strings' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Request ID and structured logging',
        code: `import crypto from 'node:crypto';

app.use((req, res, next) => {
  req.id = req.get('x-request-id') || crypto.randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
});

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    console.log(
      JSON.stringify({
        level: 'info',
        requestId: req.id,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt,
      }),
    );
  });

  next();
});`,
      },
      {
        type: 'note',
        text: 'In TypeScript you can extend the Express Request type to include id and user. Keep that declaration in one types file so middleware and controllers agree.',
      },
      { type: 'h2', text: 'Log errors with context' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Error logging middleware',
        code: `app.use((err, req, res, next) => {
  console.error(
    JSON.stringify({
      level: 'error',
      requestId: req.id,
      method: req.method,
      path: req.originalUrl,
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    }),
  );

  res.status(err.statusCode || 500).json({
    error: {
      message: err.publicMessage || 'Internal server error',
      requestId: req.id,
    },
  });
});`,
      },
      { type: 'h2', text: 'Health, readiness, and liveness' },
      {
        type: 'table',
        headers: ['Endpoint', 'Question it answers', 'Typical checks'],
        rows: [
          ['/health/live', 'Is the process alive?', 'Return 200 if event loop can respond'],
          ['/health/ready', 'Can this instance receive traffic?', 'Database, cache, required config'],
          ['/metrics', 'How is the service behaving?', 'Counters, histograms, gauges'],
        ],
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Readiness check',
        code: `app.get('/health/ready', async (req, res) => {
  try {
    await db.$queryRaw('SELECT 1');
    await redis.ping();

    res.json({
      status: 'ready',
      checks: {
        database: 'ok',
        redis: 'ok',
      },
    });
  } catch (err) {
    res.status(503).json({
      status: 'not_ready',
    });
  }
});`,
      },
      { type: 'h2', text: 'Metrics to start with' },
      {
        type: 'ul',
        items: [
          'Request count by method, route, and status code.',
          'Request duration histogram by route.',
          'Error count by route and error code.',
          'Process memory usage and CPU usage.',
          'Database query latency and connection pool usage.',
          'Queue depth, failed jobs, and job duration.',
        ],
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Prometheus-style metric names',
        code: `http_requests_total{method="GET",route="/api/users",status="200"} 1520
http_request_duration_seconds_bucket{route="/api/users",le="0.1"} 1400
nodejs_heap_used_bytes 73400320
queue_jobs_waiting{name="emails"} 42`,
      },
      {
        type: 'warning',
        text: 'A health endpoint that always returns 200 is not a readiness check. It only proves the route exists. Readiness should fail when a required dependency is unavailable.',
      },
      {
        type: 'keypoints',
        items: [
          'Use structured logs with request IDs so one request can be traced across services.',
          'Expose liveness and readiness separately.',
          'Track metrics that explain user pain: latency, errors, traffic, saturation, and dependency health.',
        ],
      },
    ],
  },
  {
    slug: 'express-docker',
    title: 'Dockerizing Node/Express',
    description:
      'Package an Express app in Docker with small images, environment variables, health checks, compose files, and production-friendly commands.',
    level: 'advanced',
    section: 'Production',
    order: 57,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Docker packages your app with its runtime so it runs consistently on laptops, CI, and production hosts. For Express, a good Docker setup keeps images small, avoids copying secrets, runs as a non-root user, and starts the app with production dependencies.',
      },
      { type: 'h2', text: 'Basic Dockerfile' },
      {
        type: 'code',
        language: 'dockerfile',
        title: 'Dockerfile',
        code: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nodeapp && adduser -S nodeapp -G nodeapp

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

USER nodeapp
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
      },
      { type: 'h2', text: 'Use .dockerignore' },
      {
        type: 'code',
        language: 'text',
        title: '.dockerignore',
        code: `node_modules
npm-debug.log
.env
.env.*
.git
coverage
dist
Dockerfile
docker-compose.yml`,
      },
      {
        type: 'warning',
        text: 'Never bake production secrets into an image. Pass secrets through the runtime platform, a secret manager, or environment variables managed outside the repository.',
      },
      { type: 'h2', text: 'Compose for local development' },
      {
        type: 'code',
        language: 'yaml',
        title: 'docker-compose.yml',
        code: `services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgres://postgres:postgres@db:5432/app
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  db-data:`,
      },
      { type: 'h2', text: 'Health check inside Docker' },
      {
        type: 'code',
        language: 'dockerfile',
        title: 'Dockerfile healthcheck',
        code: `HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \\
  CMD node -e "fetch('http://127.0.0.1:3000/health/live').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"`,
      },
      { type: 'h2', text: 'Build and run' },
      {
        type: 'code',
        language: 'bash',
        title: 'Docker commands',
        code: `docker build -t express-api .
docker run --rm -p 3000:3000 --env-file .env express-api
docker compose up --build`,
      },
      { type: 'h2', text: 'Production Docker checklist' },
      {
        type: 'ul',
        items: [
          'Use npm ci for reproducible installs.',
          'Copy package files before source files for better layer caching.',
          'Run as a non-root user.',
          'Keep secrets out of the image and git history.',
          'Expose a health endpoint that the platform can call.',
          'Send logs to stdout and stderr so the platform can collect them.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Docker makes Express deployment repeatable.',
          'Multi-stage builds separate dependencies, build output, and runtime.',
          'A production image should be small, non-root, and configured by environment.',
        ],
      },
    ],
  },
  {
    slug: 'express-project-api',
    title: 'Mini Project: Full REST API',
    description:
      'Build a complete Express REST API with folder structure, validation, controllers, services, in-memory data, errors, and pagination.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 58,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project builds a small task management REST API. It is intentionally simple enough to follow, but structured like a real service: routes, controllers, services, validation, and centralized errors.',
      },
      { type: 'h2', text: 'What you will build' },
      {
        type: 'ul',
        items: [
          'GET /api/tasks with pagination.',
          'GET /api/tasks/:id for one task.',
          'POST /api/tasks to create a task.',
          'PATCH /api/tasks/:id to update a task.',
          'DELETE /api/tasks/:id to remove a task.',
          'Consistent JSON responses and error handling.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the project' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install dependencies',
        code: `mkdir task-api
cd task-api
npm init -y
npm install express zod
npm install -D typescript tsx @types/express @types/node
npx tsc --init --rootDir src --outDir dist --esModuleInterop true`,
      },
      { type: 'h2', text: 'Step 2: Create the folder structure' },
      {
        type: 'code',
        language: 'text',
        title: 'Project files',
        code: `src/
  app.ts
  server.ts
  middleware/
    error-handler.ts
    validate.ts
  modules/
    tasks/
      tasks.routes.ts
      tasks.controller.ts
      tasks.service.ts
      tasks.store.ts
      tasks.schema.ts
  utils/
    async-handler.ts
    http-errors.ts`,
      },
      { type: 'h2', text: 'Step 3: Add the app and server' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/app.ts',
        code: `import express from 'express';
import { tasksRouter } from './modules/tasks/tasks.routes';
import { errorHandler } from './middleware/error-handler';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/tasks', tasksRouter);

  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    });
  });

  app.use(errorHandler);

  return app;
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/server.ts',
        code: `import { createApp } from './app';

const port = Number(process.env.PORT || 3000);
const app = createApp();

app.listen(port, () => {
  console.log('Task API listening on http://localhost:' + port);
});`,
      },
      { type: 'h2', text: 'Step 4: Add error helpers' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/utils/http-errors.ts',
        code: `export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export function notFound(message: string) {
  return new HttpError(404, 'NOT_FOUND', message);
}

export function badRequest(message: string) {
  return new HttpError(400, 'BAD_REQUEST', message);
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/middleware/error-handler.ts',
        code: `import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/http-errors';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.flatten(),
      },
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    },
  });
};`,
      },
      { type: 'h2', text: 'Step 5: Validate requests' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/middleware/validate.ts',
        code: `import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.query = schema.parse(req.query) as Request['query'];
    next();
  };
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/tasks/tasks.schema.ts',
        code: `import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const listTasksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});`,
      },
      { type: 'h2', text: 'Step 6: Add the data store and service' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/tasks/tasks.store.ts',
        code: `export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export const tasks = new Map<string, Task>();`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/tasks/tasks.service.ts',
        code: `import crypto from 'node:crypto';
import { notFound } from '../../utils/http-errors';
import { tasks, type Task } from './tasks.store';

type CreateTaskInput = {
  title: string;
  description?: string;
};

type UpdateTaskInput = Partial<CreateTaskInput> & {
  completed?: boolean;
};

export const tasksService = {
  list(page: number, limit: number) {
    const allTasks = Array.from(tasks.values());
    const start = (page - 1) * limit;

    return {
      data: allTasks.slice(start, start + limit),
      meta: {
        page,
        limit,
        total: allTasks.length,
      },
    };
  },

  getById(id: string) {
    const task = tasks.get(id);

    if (!task) {
      throw notFound('Task not found');
    }

    return task;
  },

  create(input: CreateTaskInput): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    tasks.set(task.id, task);
    return task;
  },

  update(id: string, input: UpdateTaskInput) {
    const task = this.getById(id);
    const updatedTask = {
      ...task,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    tasks.set(id, updatedTask);
    return updatedTask;
  },

  remove(id: string) {
    this.getById(id);
    tasks.delete(id);
  },
};`,
      },
      { type: 'h2', text: 'Step 7: Add controllers and routes' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/utils/async-handler.ts',
        code: `import type { NextFunction, Request, Response } from 'express';

export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void> | void,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/tasks/tasks.controller.ts',
        code: `import type { Request, Response } from 'express';
import { tasksService } from './tasks.service';

export function listTasks(req: Request, res: Response) {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  res.json(tasksService.list(page, limit));
}

export function getTask(req: Request, res: Response) {
  res.json({ data: tasksService.getById(req.params.id) });
}

export function createTask(req: Request, res: Response) {
  const task = tasksService.create(req.body);
  res.status(201).json({ data: task });
}

export function updateTask(req: Request, res: Response) {
  const task = tasksService.update(req.params.id, req.body);
  res.json({ data: task });
}

export function deleteTask(req: Request, res: Response) {
  tasksService.remove(req.params.id);
  res.status(204).send();
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/tasks/tasks.routes.ts',
        code: `import { Router } from 'express';
import { validateBody, validateQuery } from '../../middleware/validate';
import { asyncHandler } from '../../utils/async-handler';
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from './tasks.controller';
import { createTaskSchema, listTasksQuerySchema, updateTaskSchema } from './tasks.schema';

export const tasksRouter = Router();

tasksRouter.get('/', validateQuery(listTasksQuerySchema), asyncHandler(listTasks));
tasksRouter.get('/:id', asyncHandler(getTask));
tasksRouter.post('/', validateBody(createTaskSchema), asyncHandler(createTask));
tasksRouter.patch('/:id', validateBody(updateTaskSchema), asyncHandler(updateTask));
tasksRouter.delete('/:id', asyncHandler(deleteTask));`,
      },
      { type: 'h2', text: 'Step 8: Run and test it' },
      {
        type: 'code',
        language: 'json',
        title: 'Add scripts to package.json',
        code: `{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Try the API',
        code: `npm run dev

curl -X POST http://localhost:3000/api/tasks \\
  -H "content-type: application/json" \\
  -d '{"title":"Learn Express architecture","description":"Build clean APIs"}'

curl "http://localhost:3000/api/tasks?page=1&limit=10"`,
      },
      {
        type: 'keypoints',
        items: [
          'A full REST API needs validation, consistent errors, and clear resource routes.',
          'Even with in-memory data, structure the app like production code.',
          'Replacing the store with a database later should mostly affect the service or repository layer.',
        ],
      },
    ],
  },
  {
    slug: 'express-project-auth',
    title: 'Mini Project: Auth API (register/login/protected routes)',
    description:
      'Build an Express authentication API with registration, login, password hashing, JWT access tokens, protected routes, and safe responses.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 59,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project creates a small authentication API. It uses an in-memory user store so the flow is easy to see. In a real app, replace the store with a database and keep the service boundaries.',
      },
      { type: 'h2', text: 'What you will build' },
      {
        type: 'ul',
        items: [
          'POST /api/auth/register creates a user.',
          'POST /api/auth/login returns an access token.',
          'GET /api/me returns the current user when a token is valid.',
          'Passwords are hashed before storage.',
          'Protected routes use Authorization: Bearer token.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the project' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install auth dependencies',
        code: `mkdir auth-api
cd auth-api
npm init -y
npm install express zod bcryptjs jsonwebtoken
npm install -D typescript tsx @types/express @types/node @types/bcryptjs @types/jsonwebtoken
npx tsc --init --rootDir src --outDir dist --esModuleInterop true`,
      },
      { type: 'h2', text: 'Step 2: Folder structure' },
      {
        type: 'code',
        language: 'text',
        title: 'Auth API files',
        code: `src/
  app.ts
  server.ts
  config/
    env.ts
  middleware/
    require-auth.ts
    error-handler.ts
  modules/
    auth/
      auth.routes.ts
      auth.controller.ts
      auth.service.ts
      auth.schema.ts
      users.store.ts
  types/
    express.d.ts`,
      },
      { type: 'h2', text: 'Step 3: Read configuration in one place' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/config/env.ts',
        code: `export const env = {
  PORT: Number(process.env.PORT || 3000),
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  JWT_EXPIRES_IN: '15m',
};`,
      },
      {
        type: 'warning',
        text: 'The fallback secret is only for local learning. In production, require JWT_SECRET to be set and fail startup if it is missing.',
      },
      { type: 'h2', text: 'Step 4: Define schemas and user storage' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/auth.schema.ts',
        code: `import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
  name: z.string().trim().min(1).max(80),
});

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(100),
});`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/users.store.ts',
        code: `export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
};

export const usersById = new Map<string, User>();
export const userIdsByEmail = new Map<string, string>();

export function publicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}`,
      },
      { type: 'h2', text: 'Step 5: Build the auth service' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/auth.service.ts',
        code: `import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { publicUser, userIdsByEmail, usersById } from './users.store';

type RegisterInput = {
  email: string;
  password: string;
  name: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const authService = {
  async register(input: RegisterInput) {
    const email = input.email.toLowerCase();

    if (userIdsByEmail.has(email)) {
      const err = new Error('Email is already registered');
      Object.assign(err, { statusCode: 409 });
      throw err;
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = {
      id: crypto.randomUUID(),
      email,
      name: input.name,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    usersById.set(user.id, user);
    userIdsByEmail.set(user.email, user.id);

    return publicUser(user);
  },

  async login(input: LoginInput) {
    const email = input.email.toLowerCase();
    const userId = userIdsByEmail.get(email);
    const user = userId ? usersById.get(userId) : undefined;

    if (!user) {
      const err = new Error('Invalid email or password');
      Object.assign(err, { statusCode: 401 });
      throw err;
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      const err = new Error('Invalid email or password');
      Object.assign(err, { statusCode: 401 });
      throw err;
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN },
    );

    return {
      token,
      user: publicUser(user),
    };
  },
};`,
      },
      { type: 'h2', text: 'Step 6: Add protected-route typing and middleware' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/types/express.d.ts',
        code: `declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
    };
  }
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/middleware/require-auth.ts',
        code: `import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

type TokenPayload = {
  sub: string;
  email: string;
};

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}`,
      },
      { type: 'h2', text: 'Step 7: Controllers and routes' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/auth.controller.ts',
        code: `import type { Request, Response } from 'express';
import { usersById, publicUser } from './users.store';
import { authService } from './auth.service';

export async function register(req: Request, res: Response) {
  const user = await authService.register(req.body);
  res.status(201).json({ data: user });
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body);
  res.json({ data: result });
}

export function me(req: Request, res: Response) {
  const user = req.user ? usersById.get(req.user.id) : undefined;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.json({ data: publicUser(user) });
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/auth.routes.ts',
        code: `import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middleware/require-auth';
import { login, me, register } from './auth.controller';
import { loginSchema, registerSchema } from './auth.schema';

export const authRouter = Router();

function validateBody(schema: z.ZodSchema) {
  return (req, res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

authRouter.post('/register', validateBody(registerSchema), asyncRoute(register));
authRouter.post('/login', validateBody(loginSchema), asyncRoute(login));
authRouter.get('/me', requireAuth, me);`,
      },
      { type: 'h2', text: 'Step 8: Wire the app' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/app.ts',
        code: `import express from 'express';
import { ZodError } from 'zod';
import { authRouter } from './modules/auth/auth.routes';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));
  app.use('/api/auth', authRouter);

  app.use((err, req, res, next) => {
    if (err instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: err.flatten(),
      });
    }

    return res.status(err.statusCode || 500).json({
      error: err.message || 'Something went wrong',
    });
  });

  return app;
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/server.ts',
        code: `import { env } from './config/env';
import { createApp } from './app';

createApp().listen(env.PORT, () => {
  console.log('Auth API listening on http://localhost:' + env.PORT);
});`,
      },
      { type: 'h2', text: 'Step 9: Test the auth flow' },
      {
        type: 'code',
        language: 'bash',
        title: 'Register, login, and call a protected route',
        code: `npm run dev

curl -X POST http://localhost:3000/api/auth/register \\
  -H "content-type: application/json" \\
  -d '{"email":"sam@example.com","password":"supersecret","name":"Sam"}'

curl -X POST http://localhost:3000/api/auth/login \\
  -H "content-type: application/json" \\
  -d '{"email":"sam@example.com","password":"supersecret"}'

curl http://localhost:3000/api/auth/me \\
  -H "authorization: Bearer YOUR_TOKEN_HERE"`,
      },
      {
        type: 'keypoints',
        items: [
          'Hash passwords with a slow password hashing algorithm before storage.',
          'JWT access tokens identify the caller, but routes still need authorization rules.',
          'Never return password hashes in API responses.',
        ],
      },
    ],
  },
  {
    slug: 'express-project-realtime',
    title: 'Mini Project: Realtime Chat/Notifications Shell',
    description:
      'Build a followable Express and Socket.IO shell for rooms, chat messages, notifications, and a tiny browser client.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 60,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project creates a realtime shell you can extend into chat, notifications, live dashboards, or support inboxes. It keeps data in memory so you can focus on connection flow, events, rooms, and client behavior.',
      },
      { type: 'h2', text: 'What you will build' },
      {
        type: 'ul',
        items: [
          'An Express server with a Socket.IO realtime layer.',
          'Rooms for channel-based chat.',
          'A notification event for one connected user.',
          'A browser client that joins a room and sends messages.',
          'A clear place to add persistence and authentication later.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the project' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install realtime dependencies',
        code: `mkdir realtime-shell
cd realtime-shell
npm init -y
npm install express socket.io
npm install -D typescript tsx @types/express @types/node
npx tsc --init --rootDir src --outDir dist --esModuleInterop true
mkdir -p src public`,
      },
      { type: 'h2', text: 'Step 2: Folder structure' },
      {
        type: 'code',
        language: 'text',
        title: 'Realtime project files',
        code: `src/
  app.ts
  server.ts
  realtime/
    socket.ts
    rooms.store.ts
public/
  index.html`,
      },
      { type: 'h2', text: 'Step 3: Create the Express app' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/app.ts',
        code: `import path from 'node:path';
import express from 'express';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(process.cwd(), 'public')));

  app.get('/health', (req, res) => {
    res.json({ ok: true });
  });

  return app;
}`,
      },
      { type: 'h2', text: 'Step 4: Add an in-memory room store' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/realtime/rooms.store.ts',
        code: `export type ChatMessage = {
  id: string;
  roomId: string;
  userName: string;
  text: string;
  createdAt: string;
};

const messagesByRoom = new Map<string, ChatMessage[]>();

export function addMessage(message: ChatMessage) {
  const messages = messagesByRoom.get(message.roomId) || [];
  messages.push(message);
  messagesByRoom.set(message.roomId, messages.slice(-50));
}

export function getRecentMessages(roomId: string) {
  return messagesByRoom.get(roomId) || [];
}`,
      },
      { type: 'h2', text: 'Step 5: Configure Socket.IO events' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/realtime/socket.ts',
        code: `import crypto from 'node:crypto';
import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { addMessage, getRecentMessages } from './rooms.store';

type JoinPayload = {
  roomId: string;
  userName: string;
};

type MessagePayload = {
  roomId: string;
  text: string;
};

export function createRealtimeServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    socket.data.userName = 'Guest';

    socket.on('room:join', (payload: JoinPayload) => {
      const roomId = String(payload.roomId || 'general');
      const userName = String(payload.userName || 'Guest').slice(0, 40);

      socket.data.roomId = roomId;
      socket.data.userName = userName;
      socket.join('room:' + roomId);

      socket.emit('room:history', getRecentMessages(roomId));
      socket.to('room:' + roomId).emit('notification', {
        text: userName + ' joined the room',
      });
    });

    socket.on('chat:message', (payload: MessagePayload) => {
      const roomId = String(payload.roomId || socket.data.roomId || 'general');
      const text = String(payload.text || '').trim();

      if (!text) {
        return;
      }

      const message = {
        id: crypto.randomUUID(),
        roomId,
        userName: socket.data.userName,
        text: text.slice(0, 500),
        createdAt: new Date().toISOString(),
      };

      addMessage(message);
      io.to('room:' + roomId).emit('chat:message', message);
    });

    socket.on('disconnect', () => {
      if (socket.data.roomId) {
        socket.to('room:' + socket.data.roomId).emit('notification', {
          text: socket.data.userName + ' left the room',
        });
      }
    });
  });

  return io;
}`,
      },
      { type: 'h2', text: 'Step 6: Start HTTP and realtime together' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/server.ts',
        code: `import { createServer } from 'node:http';
import { createApp } from './app';
import { createRealtimeServer } from './realtime/socket';

const port = Number(process.env.PORT || 3000);
const app = createApp();
const httpServer = createServer(app);

createRealtimeServer(httpServer);

httpServer.listen(port, () => {
  console.log('Realtime shell listening on http://localhost:' + port);
});`,
      },
      { type: 'h2', text: 'Step 7: Build a tiny browser client' },
      {
        type: 'code',
        language: 'text',
        title: 'public/index.html',
        code: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Realtime Shell</title>
    <style>
      body { font-family: sans-serif; max-width: 720px; margin: 40px auto; }
      form { display: flex; gap: 8px; margin-bottom: 16px; }
      input { flex: 1; padding: 8px; }
      button { padding: 8px 12px; }
      li { margin: 6px 0; }
      .note { color: #666; font-style: italic; }
    </style>
  </head>
  <body>
    <h1>Realtime Shell</h1>
    <form id="join-form">
      <input id="name" placeholder="Your name" value="Sam" />
      <input id="room" placeholder="Room" value="general" />
      <button>Join</button>
    </form>

    <form id="message-form">
      <input id="message" placeholder="Message" />
      <button>Send</button>
    </form>

    <ul id="messages"></ul>

    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();
      const messages = document.querySelector('#messages');
      let currentRoom = 'general';

      function addLine(text, className) {
        const item = document.createElement('li');
        item.textContent = text;
        if (className) item.className = className;
        messages.appendChild(item);
      }

      document.querySelector('#join-form').addEventListener('submit', (event) => {
        event.preventDefault();
        currentRoom = document.querySelector('#room').value || 'general';
        messages.innerHTML = '';
        socket.emit('room:join', {
          roomId: currentRoom,
          userName: document.querySelector('#name').value || 'Guest',
        });
      });

      document.querySelector('#message-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.querySelector('#message');
        socket.emit('chat:message', {
          roomId: currentRoom,
          text: input.value,
        });
        input.value = '';
      });

      socket.on('room:history', (history) => {
        history.forEach((message) => {
          addLine(message.userName + ': ' + message.text);
        });
      });

      socket.on('chat:message', (message) => {
        addLine(message.userName + ': ' + message.text);
      });

      socket.on('notification', (event) => {
        addLine(event.text, 'note');
      });
    </script>
  </body>
</html>`,
      },
      { type: 'h2', text: 'Step 8: Run it' },
      {
        type: 'code',
        language: 'json',
        title: 'package.json scripts',
        code: `{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Open two browser windows',
        code: `npm run dev
# Visit http://localhost:3000 in two browser windows.
# Join the same room in both windows and send messages.`,
      },
      { type: 'h2', text: 'Step 9: Production upgrades' },
      {
        type: 'ul',
        items: [
          'Authenticate socket connections with the same user system as your API.',
          'Authorize room membership before calling socket.join.',
          'Persist important messages in a database.',
          'Use a Redis adapter when running multiple server instances.',
          'Add message validation and rate limits to prevent spam.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Realtime servers still need normal backend architecture: validation, auth, persistence, and observability.',
          'Rooms make it easy to send events to a targeted group of sockets.',
          'Persist before emit when clients must not miss important data.',
        ],
      },
    ],
  },
  {
    slug: 'node-express-mistakes',
    title: 'Common Node/Express Mistakes (and Fixes)',
    description:
      'Recognize the mistakes that make Express apps fragile, slow, insecure, or hard to maintain, and learn practical fixes.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 61,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Most Express apps fail in predictable ways. Learning these mistakes gives you a checklist for reviewing your own code and for spotting production risks before they become incidents.',
      },
      {
        type: 'table',
        headers: ['Mistake', 'Why it hurts', 'Fix'],
        rows: [
          ['One huge server file', 'Hard to test and navigate', 'Split app, routes, controllers, services, data access'],
          ['Business logic in controllers', 'Rules get duplicated across routes', 'Move use cases into services'],
          ['No async error handling', 'Rejected promises skip the error handler', 'Use Express 5 behavior or an async wrapper'],
          ['Trusting req.body', 'Mass assignment and invalid data', 'Validate and whitelist fields'],
          ['No pagination', 'Large responses and slow queries', 'Require page, limit, and ordering'],
          ['Logging secrets', 'Tokens and passwords leak', 'Redact sensitive fields and avoid logging headers blindly'],
        ],
      },
      { type: 'h2', text: 'Mistake: not returning after sending a response' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Buggy handler',
        code: `app.get('/api/users/:id', async (req, res) => {
  const user = await users.findById(req.params.id);

  if (!user) {
    res.status(404).json({ error: 'Not found' });
  }

  res.json({ data: user }); // may run after the 404 response
});`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Return after the response',
        code: `app.get('/api/users/:id', async (req, res) => {
  const user = await users.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'Not found' });
  }

  return res.json({ data: user });
});`,
      },
      { type: 'h2', text: 'Mistake: storing state in one process' },
      {
        type: 'p',
        text: 'Global arrays, in-memory sessions, and local uploads work on one server until you scale to multiple instances or restart the process. Use a database, Redis, or object storage for data that must survive restarts or be shared across instances.',
      },
      { type: 'h2', text: 'Mistake: missing graceful shutdown' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Handle shutdown signals',
        code: `const server = app.listen(port);

async function shutdown() {
  console.log('Shutting down');

  server.close(async () => {
    await db.disconnect();
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);`,
      },
      {
        type: 'warning',
        text: 'Do not catch errors just to ignore them. If an error is safe to continue from, log useful context. If it is not safe, fail clearly and let the platform restart the process.',
      },
      {
        type: 'keypoints',
        items: [
          'Most Express bugs come from unclear boundaries, missing validation, and weak error handling.',
          'Production apps need pagination, shutdown handling, external state, and safe logs.',
          'Small habits prevent large outages.',
        ],
      },
    ],
  },
  {
    slug: 'node-express-ecosystem',
    title: 'Ecosystem: Nest, Fastify, tRPC & When to Switch',
    description:
      'Compare Express with NestJS, Fastify, tRPC, and other backend tools so you can choose the right framework for the project.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 62,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Express is minimal and flexible. That is a strength when you want control, but it also means you choose your own architecture, validation, testing style, dependency injection, and conventions. Other tools make different tradeoffs.',
      },
      {
        type: 'table',
        headers: ['Tool', 'Good fit', 'Why teams choose it'],
        rows: [
          ['Express', 'Custom APIs, learning, small to large services', 'Huge ecosystem and simple mental model'],
          ['Fastify', 'High-performance JSON APIs', 'Schema-driven validation and faster routing'],
          ['NestJS', 'Large teams and enterprise-style apps', 'Modules, decorators, DI, testing conventions'],
          ['tRPC', 'TypeScript apps with shared client and server types', 'End-to-end type safety without REST boilerplate'],
          ['Hono', 'Edge and lightweight APIs', 'Small API, modern runtime support'],
        ],
      },
      { type: 'h2', text: 'When Express is still a great choice' },
      {
        type: 'ul',
        items: [
          'You want a straightforward REST API.',
          'Your team already knows Express well.',
          'You need access to the largest Node middleware ecosystem.',
          'You prefer explicit architecture over framework-enforced architecture.',
          'The app is not limited by Express routing performance.',
        ],
      },
      { type: 'h2', text: 'When to consider Fastify' },
      {
        type: 'p',
        text: 'Fastify is a good next step when you want stronger route schemas, fast JSON serialization, plugin encapsulation, and performance-focused defaults. It can be easier to standardize input and output contracts in a high-throughput service.',
      },
      { type: 'h2', text: 'When to consider NestJS' },
      {
        type: 'p',
        text: 'NestJS provides a larger application framework: modules, controllers, providers, decorators, dependency injection, guards, pipes, interceptors, and testing utilities. This helps large teams, but it adds concepts and ceremony.',
      },
      { type: 'h2', text: 'When to consider tRPC' },
      {
        type: 'p',
        text: 'tRPC works well when your frontend and backend are both TypeScript and controlled by the same team. Instead of manually documenting REST endpoints, client calls can infer input and output types from server procedures.',
      },
      {
        type: 'warning',
        text: 'Do not switch frameworks because an app has messy architecture. A new framework can provide conventions, but it will not automatically fix unclear business rules, missing tests, or poor data modeling.',
      },
      {
        type: 'keypoints',
        items: [
          'Express gives flexibility; other tools provide more built-in conventions.',
          'Switch when the new tool solves a real team or product problem.',
          'Architecture habits transfer across frameworks.',
        ],
      },
    ],
  },
  {
    slug: 'node-express-portfolio',
    title: 'Building a Backend Portfolio',
    description:
      'Turn Node and Express skills into portfolio projects that show architecture, production thinking, tests, and deployment ability.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 63,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'A backend portfolio should prove more than hello world routing. It should show that you can design APIs, model data, protect routes, handle errors, write tests, document behavior, and deploy a service someone else can run.',
      },
      { type: 'h2', text: 'Strong project ideas' },
      {
        type: 'ul',
        items: [
          'Issue tracker API with teams, projects, comments, roles, and audit logs.',
          'E-commerce API with products, carts, orders, payments mock, and inventory rules.',
          'Learning platform API with courses, lessons, progress, quizzes, and admin routes.',
          'Realtime support inbox with chat rooms, presence, and agent assignment.',
          'Job queue demo that generates reports and exposes job status.',
        ],
      },
      { type: 'h2', text: 'What every portfolio backend should include' },
      {
        type: 'table',
        headers: ['Feature', 'What it proves'],
        rows: [
          ['README with setup steps', 'Other developers can run your project'],
          ['OpenAPI or route docs', 'You can communicate API contracts'],
          ['Authentication and authorization', 'You understand protected workflows'],
          ['Validation and error format', 'Clients get predictable responses'],
          ['Database schema and seed data', 'You can model real data'],
          ['Tests', 'You can protect behavior during change'],
          ['Deployment link or Docker setup', 'You can ship beyond localhost'],
        ],
      },
      {
        type: 'code',
        language: 'text',
        title: 'README outline',
        code: `# Project Name

## What it does
Short product description and main features.

## Tech stack
Node.js, Express, PostgreSQL, Redis, Docker, Jest.

## Run locally
Step-by-step commands.

## Environment variables
Document names, never real secrets.

## API examples
Show curl requests or link to OpenAPI docs.

## Architecture notes
Explain modules, auth, background jobs, and tradeoffs.

## Tests and deployment
How to run tests and where the app is deployed.`,
      },
      { type: 'h2', text: 'Make tradeoffs visible' },
      {
        type: 'p',
        text: 'Employers and collaborators value judgment. Add a short architecture notes section that explains why you chose REST, how authorization works, where validation happens, and what you would improve with more time.',
      },
      {
        type: 'tip',
        text: 'One polished backend with docs, tests, and deployment is stronger than five unfinished repos with only route handlers.',
      },
      {
        type: 'keypoints',
        items: [
          'Portfolio projects should demonstrate production habits, not only syntax.',
          'Documentation is part of backend engineering.',
          'Show clear tradeoffs and next improvements.',
        ],
      },
    ],
  },
  {
    slug: 'node-express-nextjs',
    title: 'Node/Express with Next.js Frontends',
    description:
      'Connect Express APIs to Next.js frontends with environment variables, cookies, CORS, server-side fetching, and deployment boundaries.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 64,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Next.js can include its own API routes, but many teams still use a separate Express backend for complex APIs, background workers, realtime, shared services, or existing backend infrastructure. The key is choosing a clear boundary between frontend and backend responsibilities.',
      },
      { type: 'h2', text: 'Common architecture' },
      {
        type: 'code',
        language: 'text',
        title: 'Separate frontend and backend',
        code: `Browser
  -> Next.js app for pages and UI
      -> Express API for business data
          -> Database, Redis, queues, third-party services`,
      },
      { type: 'h2', text: 'Use environment variables for API URLs' },
      {
        type: 'code',
        language: 'text',
        title: '.env.local for Next.js',
        code: `NEXT_PUBLIC_APP_URL=http://localhost:3000
EXPRESS_API_URL=http://localhost:4000`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Server-side fetch in Next.js',
        code: `export async function getProjects() {
  const response = await fetch(process.env.EXPRESS_API_URL + '/api/projects', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load projects');
  }

  return response.json();
}`,
      },
      { type: 'h2', text: 'Browser calls need CORS' },
      {
        type: 'p',
        text: 'If browser JavaScript calls Express directly from a different origin, Express must allow that origin with CORS. If Next.js server components or route handlers call Express server-side, browser CORS is not involved for that hop.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Express CORS for a Next.js frontend',
        code: `import cors from 'cors';

app.use(
  cors({
    origin: process.env.NEXT_APP_ORIGIN,
    credentials: true,
  }),
);`,
      },
      { type: 'h2', text: 'Cookie auth across apps' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Set a secure API cookie',
        code: `res.cookie('access_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000,
});`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Forward cookies from a Next.js route handler',
        code: `import { cookies } from 'next/headers';

export async function GET() {
  const cookieHeader = cookies().toString();

  const response = await fetch(process.env.EXPRESS_API_URL + '/api/me', {
    headers: {
      cookie: cookieHeader,
    },
  });

  return Response.json(await response.json(), {
    status: response.status,
  });
}`,
      },
      { type: 'h2', text: 'Deployment patterns' },
      {
        type: 'table',
        headers: ['Pattern', 'Use it when', 'Consideration'],
        rows: [
          ['Same domain reverse proxy', 'You want /api to route to Express', 'Simpler cookies and fewer CORS issues'],
          ['Separate domains', 'Frontend and API deploy independently', 'Configure CORS and cookie domain carefully'],
          ['Next.js BFF route handlers', 'You want browser to call only Next.js', 'Adds an extra server hop'],
          ['Direct browser to API', 'Simple public API calls', 'Expose only safe endpoints and handle CORS'],
        ],
      },
      {
        type: 'warning',
        text: 'Never expose private backend URLs, service tokens, database URLs, or admin credentials through NEXT_PUBLIC variables. NEXT_PUBLIC values are bundled for the browser.',
      },
      {
        type: 'keypoints',
        items: [
          'Next.js owns UI and rendering; Express can own complex backend workflows.',
          'Server-side calls do not need CORS, but browser calls do.',
          'Cookie auth requires careful sameSite, secure, domain, and proxy configuration.',
        ],
      },
    ],
  },
  {
    slug: 'node-express-next-steps',
    title: 'What to Learn After Node/Express',
    description:
      'Choose the next backend skills after Express: databases, TypeScript depth, testing, cloud, architecture, security, and distributed systems.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 65,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Finishing Node and Express is not the end of backend learning. It gives you a strong base for APIs, services, realtime apps, and full-stack products. The next step is choosing skills that make your apps more correct, scalable, secure, and useful.',
      },
      { type: 'h2', text: 'Recommended learning path' },
      {
        type: 'ol',
        items: [
          'Go deeper with TypeScript: generics, discriminated unions, module boundaries, and typed errors.',
          'Master one relational database: PostgreSQL schema design, indexes, transactions, and query plans.',
          'Learn testing layers: unit tests, integration tests, contract tests, and end-to-end API tests.',
          'Study authentication deeply: sessions, JWTs, OAuth, refresh token rotation, and authorization models.',
          'Practice production operations: Docker, CI, logging, metrics, alerts, and incident review.',
          'Learn background processing: queues, retries, idempotency, and scheduled jobs.',
          'Explore distributed systems basics: timeouts, retries, consistency, rate limits, and backpressure.',
        ],
      },
      { type: 'h2', text: 'Skills by goal' },
      {
        type: 'table',
        headers: ['Goal', 'Learn next', 'Project idea'],
        rows: [
          ['Backend job readiness', 'PostgreSQL, tests, Docker, CI', 'Issue tracker API with roles'],
          ['Full-stack SaaS', 'Next.js, billing, auth, emails', 'Subscription dashboard'],
          ['Realtime products', 'Socket.IO, Redis adapter, presence', 'Team chat or live support'],
          ['Data-heavy APIs', 'Indexes, pagination, caching', 'Analytics events API'],
          ['Platform engineering', 'Kubernetes, observability, queues', 'Job processing system'],
        ],
      },
      { type: 'h2', text: 'Practice like a production engineer' },
      {
        type: 'ul',
        items: [
          'Write a design note before building a large feature.',
          'Add tests for business rules, not only happy-path routes.',
          'Instrument latency and errors before optimizing.',
          'Document how to run, deploy, and troubleshoot the service.',
          'Review your own code for authorization, validation, and failure cases.',
        ],
      },
      {
        type: 'try',
        text: 'Choose one capstone project from this course and add three production upgrades: a database, tests, and Docker. Then write a README that explains the architecture.',
      },
      {
        type: 'keypoints',
        items: [
          'Express is a foundation for production backend engineering.',
          'The highest-value next skills are databases, testing, security, deployment, and observability.',
          'Keep building projects that force real tradeoffs.',
        ],
      },
    ],
  },
];
