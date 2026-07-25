import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'express-rest',
    title: 'REST API Design Basics',
    description:
      'Design predictable Express APIs with resources, HTTP methods, status codes, JSON responses, and consistent error shapes.',
    level: 'intermediate',
    section: 'APIs',
    order: 26,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'REST is a practical style for exposing application data through URLs, HTTP methods, and standard response codes. Express does not force a REST design, so you must choose clear resource names, predictable payloads, and consistent behavior.',
      },
      {
        type: 'p',
        text: 'A good REST API feels boring in the best way: clients know where to send requests, what shape to expect back, and how to interpret success or failure without reading server code.',
      },
      { type: 'h2', text: 'Model routes as resources' },
      {
        type: 'table',
        headers: ['Action', 'Method', 'Path', 'Common status'],
        rows: [
          ['List books', 'GET', '/api/books', '200 OK'],
          ['Get one book', 'GET', '/api/books/:id', '200 OK or 404 Not Found'],
          ['Create a book', 'POST', '/api/books', '201 Created'],
          ['Replace or update a book', 'PUT or PATCH', '/api/books/:id', '200 OK'],
          ['Delete a book', 'DELETE', '/api/books/:id', '204 No Content'],
        ],
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Basic REST routes',
        code: `import express from 'express';

const app = express();
app.use(express.json());

const books = [
  { id: '1', title: 'Node Patterns', author: 'A. Dev' },
  { id: '2', title: 'Express APIs', author: 'B. Builder' },
];

app.get('/api/books', (req, res) => {
  res.json({ data: books });
});

app.get('/api/books/:id', (req, res) => {
  const book = books.find((item) => item.id === req.params.id);

  if (!book) {
    return res.status(404).json({
      error: { code: 'BOOK_NOT_FOUND', message: 'Book was not found' },
    });
  }

  res.json({ data: book });
});

app.post('/api/books', (req, res) => {
  const book = {
    id: String(Date.now()),
    title: req.body.title,
    author: req.body.author,
  };

  books.push(book);
  res.status(201).json({ data: book });
});`,
      },
      { type: 'h2', text: 'Use status codes intentionally' },
      {
        type: 'ul',
        items: [
          '200 OK: a normal successful response with a body.',
          '201 Created: a new resource was created.',
          '204 No Content: success with no response body, often after delete.',
          '400 Bad Request: the request is malformed or invalid.',
          '401 Unauthorized: authentication is missing or invalid.',
          '403 Forbidden: the user is authenticated but not allowed.',
          '404 Not Found: the requested resource does not exist.',
          '409 Conflict: the request conflicts with existing state, such as a duplicate email.',
        ],
      },
      {
        type: 'code',
        language: 'json',
        title: 'Consistent response shapes',
        code: `{
  "data": {
    "id": "1",
    "title": "Node Patterns"
  },
  "meta": {
    "requestId": "req_123"
  }
}`,
      },
      {
        type: 'note',
        text: 'REST is not only about URLs. Method semantics, status codes, idempotency, caching behavior, and error formats are part of the contract clients depend on.',
      },
      {
        type: 'tip',
        text: 'Prefer plural resource names such as /users, /orders, and /products. Use verbs sparingly for actions that are not simple resource CRUD, such as /orders/:id/cancel.',
      },
      {
        type: 'try',
        text: 'Design routes for a notes API with list, create, read, update, delete, and archive actions. Write the method, path, expected status code, and example JSON body for each one.',
      },
      {
        type: 'keypoints',
        items: [
          'REST APIs expose resources through predictable URLs and HTTP methods.',
          'Status codes are part of the API contract, not decoration.',
          'Consistent success and error response shapes make clients simpler.',
          'Express provides routing primitives; you provide the API design discipline.',
        ],
      },
    ],
  },
  {
    slug: 'express-controllers',
    title: 'Controllers & Route Organization',
    description:
      'Split Express routes into routers and controllers so APIs stay readable as features grow.',
    level: 'intermediate',
    section: 'APIs',
    order: 27,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Small Express apps often keep every route in app.js. That works for demos, but real APIs quickly collect many routes, middleware calls, validations, and response branches.',
      },
      {
        type: 'p',
        text: 'Route organization gives each file a job. Routers define paths and middleware order. Controllers translate HTTP requests into application actions and HTTP responses.',
      },
      { type: 'h2', text: 'A practical folder shape' },
      {
        type: 'code',
        language: 'text',
        title: 'Feature-oriented API files',
        code: `src/
  app.js
  routes/
    book.routes.js
  controllers/
    book.controller.js
  services/
    book.service.js
  middleware/
    error.middleware.js`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'routes/book.routes.js',
        code: `import { Router } from 'express';
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
} from '../controllers/book.controller.js';

const router = Router();

router.get('/', listBooks);
router.post('/', createBook);
router.get('/:id', getBook);
router.patch('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'controllers/book.controller.js',
        code: `const books = [];

export function listBooks(req, res) {
  res.json({ data: books });
}

export function getBook(req, res) {
  const book = books.find((item) => item.id === req.params.id);

  if (!book) {
    return res.status(404).json({
      error: { code: 'BOOK_NOT_FOUND', message: 'Book was not found' },
    });
  }

  res.json({ data: book });
}

export function createBook(req, res) {
  const book = { id: crypto.randomUUID(), ...req.body };
  books.push(book);
  res.status(201).json({ data: book });
}

export function updateBook(req, res) {
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED' } });
}

export function deleteBook(req, res) {
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED' } });
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'src/app.js',
        code: `import express from 'express';
import bookRoutes from './routes/book.routes.js';

export const app = express();

app.use(express.json());
app.use('/api/books', bookRoutes);`,
      },
      {
        type: 'note',
        text: 'Controllers should not become a dumping ground for all business rules. Keep them focused on request input, response output, and calling the next layer.',
      },
      {
        type: 'tip',
        text: 'Name router files after the resource or feature they expose. A route file should be easy to scan and should rarely contain large business logic blocks.',
      },
      {
        type: 'try',
        text: 'Move a single-file Express todo API into routes/todo.routes.js and controllers/todo.controller.js. Keep the public URLs unchanged and verify each endpoint still responds.',
      },
      {
        type: 'keypoints',
        items: [
          'Routers group URL paths and route-specific middleware.',
          'Controllers handle HTTP concerns and return responses.',
          'Feature-oriented files make large APIs easier to navigate.',
          'Organization should clarify flow without hiding simple behavior behind too many layers.',
        ],
      },
    ],
  },
  {
    slug: 'express-services',
    title: 'Service Layer Pattern',
    description:
      'Move business logic out of controllers and into services that can be reused and tested without HTTP.',
    level: 'intermediate',
    section: 'APIs',
    order: 28,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Controllers are tied to Express. They read req, write res, and decide HTTP status codes. A service layer holds application behavior that should not care whether it was called from an API route, a background job, or a test.',
      },
      {
        type: 'p',
        text: 'The goal is not ceremony. The goal is to keep important business decisions in plain functions with clear inputs and outputs.',
      },
      { type: 'h2', text: 'Controller calls a service' },
      {
        type: 'code',
        language: 'javascript',
        title: 'services/book.service.js',
        code: `const books = [];

export class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function listBooks() {
  return books;
}

export function createBook(input) {
  const title = input.title?.trim();

  if (!title) {
    throw new AppError('Title is required', 400, 'TITLE_REQUIRED');
  }

  const book = {
    id: crypto.randomUUID(),
    title,
    author: input.author?.trim() || 'Unknown',
    createdAt: new Date().toISOString(),
  };

  books.push(book);
  return book;
}

export function findBookById(id) {
  const book = books.find((item) => item.id === id);

  if (!book) {
    throw new AppError('Book was not found', 404, 'BOOK_NOT_FOUND');
  }

  return book;
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'controllers/book.controller.js',
        code: `import * as bookService from '../services/book.service.js';

export function listBooks(req, res) {
  res.json({ data: bookService.listBooks() });
}

export function createBook(req, res) {
  const book = bookService.createBook(req.body);
  res.status(201).json({ data: book });
}

export function getBook(req, res) {
  const book = bookService.findBookById(req.params.id);
  res.json({ data: book });
}`,
      },
      { type: 'h2', text: 'Services become easier to test' },
      {
        type: 'code',
        language: 'javascript',
        title: 'book.service.test.js',
        code: `import { createBook } from './book.service.js';

test('creates a book with a generated id', () => {
  const book = createBook({ title: 'Clean APIs', author: 'Sam' });

  expect(book.id).toBeDefined();
  expect(book.title).toBe('Clean APIs');
  expect(book.author).toBe('Sam');
});

test('rejects missing titles', () => {
  expect(() => createBook({ title: '' })).toThrow('Title is required');
});`,
      },
      {
        type: 'note',
        text: 'A service can call repositories, database clients, email utilities, queues, or other services. It should return domain results or throw application errors, not Express responses.',
      },
      {
        type: 'tip',
        text: 'If a controller is more than request parsing, calling one or two functions, and sending a response, look for logic that belongs in a service.',
      },
      {
        type: 'try',
        text: 'Take a route that creates an order, calculates totals, and sends JSON. Move the total calculation and order creation into a service function, then call it from the controller.',
      },
      {
        type: 'keypoints',
        items: [
          'Services hold business logic that should not depend on Express.',
          'Controllers translate between HTTP and services.',
          'Service functions are easier to unit test than full routes.',
          'Use layers to clarify important boundaries, not to add needless files.',
        ],
      },
    ],
  },
  {
    slug: 'express-validation',
    title: 'Validation (manual + zod/joi style)',
    description:
      'Validate request bodies, params, and query strings manually or with schema-style libraries before data reaches your services.',
    level: 'intermediate',
    section: 'APIs',
    order: 29,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Every API accepts input from outside your application. Validation turns unknown JSON, path params, and query strings into known shapes before your code trusts them.',
      },
      {
        type: 'p',
        text: 'Validation belongs near the edge of the app. Controllers or route middleware should reject bad requests early with helpful 400 responses.',
      },
      { type: 'h2', text: 'Manual validation' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Simple manual checks',
        code: `function validateCreateUser(body) {
  const errors = [];

  if (typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  if (typeof body.email !== 'string' || !body.email.includes('@')) {
    errors.push({ field: 'email', message: 'Email must be valid' });
  }

  if (typeof body.password !== 'string' || body.password.length < 12) {
    errors.push({ field: 'password', message: 'Password must be at least 12 characters' });
  }

  return {
    ok: errors.length === 0,
    errors,
    value: {
      name: body.name?.trim(),
      email: body.email?.trim().toLowerCase(),
      password: body.password,
    },
  };
}

app.post('/api/users', (req, res) => {
  const result = validateCreateUser(req.body);

  if (!result.ok) {
    return res.status(400).json({
      error: { code: 'VALIDATION_FAILED', details: result.errors },
    });
  }

  res.status(201).json({ data: { email: result.value.email } });
});`,
      },
      { type: 'h2', text: 'Schema-style validation' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Zod-style route middleware',
        code: `import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(12),
});

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_FAILED',
          details: result.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
      });
    }

    req.body = result.data;
    next();
  };
}

app.post('/api/users', validateBody(createUserSchema), createUser);`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Joi-style idea',
        code: `const schema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().lowercase().required(),
  password: Joi.string().min(12).required(),
});

const { error, value } = schema.validate(req.body, { abortEarly: false });`,
      },
      {
        type: 'note',
        text: 'Validate params and query strings too. req.params.id and req.query.page are strings, even when they look like numbers.',
      },
      {
        type: 'tip',
        text: 'Return validation errors in a stable format. Frontend forms can map field paths to messages only if the API response is predictable.',
      },
      {
        type: 'try',
        text: 'Add validation to a POST /api/products route. Require a name, price greater than zero, and optional tags array. Return all validation issues at once.',
      },
      {
        type: 'keypoints',
        items: [
          'Never trust request bodies, params, or query strings without validation.',
          'Manual validation is fine for simple cases, but schemas scale better.',
          'Validated data should be normalized before it reaches services.',
          'Consistent validation errors improve client and test code.',
        ],
      },
    ],
  },
  {
    slug: 'express-async',
    title: 'Async Routes & Error Propagation',
    description:
      'Handle rejected promises in Express routes and centralize API errors with async wrappers and error middleware.',
    level: 'intermediate',
    section: 'APIs',
    order: 30,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Most real routes are asynchronous because they call databases, external APIs, queues, or file storage. If an async route rejects and the error is not forwarded, the request may hang or become an unhelpful 500.',
      },
      {
        type: 'p',
        text: 'Modern Express versions can handle promise rejections better than older apps, but an explicit async wrapper and error middleware still make the flow obvious and consistent.',
      },
      { type: 'h2', text: 'Wrap async route handlers' },
      {
        type: 'code',
        language: 'javascript',
        title: 'asyncHandler helper',
        code: `export function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

app.get(
  '/api/books/:id',
  asyncHandler(async (req, res) => {
    const book = await db.books.findById(req.params.id);

    if (!book) {
      const error = new Error('Book was not found');
      error.statusCode = 404;
      error.code = 'BOOK_NOT_FOUND';
      throw error;
    }

    res.json({ data: book });
  }),
);`,
      },
      { type: 'h2', text: 'Use one error middleware' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Centralized error response',
        code: `app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error({
      message: err.message,
      stack: err.stack,
      path: req.originalUrl,
    });
  }

  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: statusCode >= 500 ? 'Something went wrong' : err.message,
    },
  });
});`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'AppError class',
        code: `export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

throw new AppError('Only admins can update this resource', 403, 'FORBIDDEN');`,
      },
      {
        type: 'note',
        text: 'Error middleware must have four parameters: err, req, res, and next. Express recognizes it by that signature.',
      },
      {
        type: 'tip',
        text: 'Do not leak stack traces, SQL messages, or dependency errors to clients in production. Log detailed errors server-side and return safe messages.',
      },
      {
        type: 'try',
        text: 'Create an async route that throws after awaiting a fake promise. Confirm the request returns your JSON error shape instead of crashing or timing out.',
      },
      {
        type: 'keypoints',
        items: [
          'Async routes must propagate rejected promises to Express error handling.',
          'Centralized error middleware keeps response formats consistent.',
          'Application errors should carry status codes and stable error codes.',
          'Production clients should receive safe error messages.',
        ],
      },
    ],
  },
  {
    slug: 'express-auth-jwt',
    title: 'JWT Authentication',
    description:
      'Use signed JSON Web Tokens to authenticate API requests while keeping secrets in environment variables.',
    level: 'intermediate',
    section: 'Auth & Security',
    order: 31,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'A JSON Web Token is a signed string that can carry claims such as a user id and role. APIs commonly return an access token after login, and clients send it on later requests in the Authorization header.',
      },
      {
        type: 'p',
        text: 'JWTs are convenient, but they are not magic sessions. Anyone who has a valid token can use it until it expires, so secrets, expiration times, HTTPS, and storage choices matter.',
      },
      { type: 'h2', text: 'Create a token after login' },
      {
        type: 'code',
        language: 'bash',
        title: 'Generate a strong secret for local development',
        code: `JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET" >> .env`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Sign and verify JWTs',
        code: `import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is required');
}

export function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: '15m',
      issuer: 'books-api',
      audience: 'books-api-clients',
    },
  );
}

export function requireAuth(req, res, next) {
  const header = req.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: { code: 'AUTH_REQUIRED' } });
  }

  try {
    const payload = jwt.verify(token, jwtSecret, {
      issuer: 'books-api',
      audience: 'books-api-clients',
    });

    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: { code: 'INVALID_TOKEN' } });
  }
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Protect a route',
        code: `app.get('/api/me', requireAuth, async (req, res) => {
  const user = await users.findById(req.user.id);
  res.json({ data: { id: user.id, email: user.email, role: user.role } });
});`,
      },
      {
        type: 'note',
        text: 'Never hardcode JWT secrets in source code. Read secrets from environment variables or a secret manager, and use different secrets per environment.',
      },
      {
        type: 'tip',
        text: 'Keep access tokens short-lived. If you need long-lived login, pair short access tokens with refresh tokens or server-side sessions.',
      },
      {
        type: 'try',
        text: 'Add requireAuth to a GET /api/profile route. Test requests with no token, an invalid token, and a valid token created with your local JWT_SECRET.',
      },
      {
        type: 'keypoints',
        items: [
          'JWTs prove claims by signature, not by secrecy of the payload.',
          'Secrets must come from environment variables or managed secrets, never hardcoded strings.',
          'Use expiration, issuer, and audience checks to reduce token misuse.',
          'Protected routes should attach the authenticated user identity to the request.',
        ],
      },
    ],
  },
  {
    slug: 'express-auth-refresh',
    title: 'Refresh Tokens & Sessions Overview',
    description:
      'Understand refresh-token and session tradeoffs for keeping users logged in safely.',
    level: 'intermediate',
    section: 'Auth & Security',
    order: 32,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Short-lived access tokens reduce risk, but users do not want to log in every 15 minutes. Refresh tokens and sessions are two common ways to issue new access without asking for a password every time.',
      },
      {
        type: 'p',
        text: 'A refresh token is a high-value credential. Treat it like a password: store it securely, rotate it, revoke it when needed, and never hardcode related secrets.',
      },
      { type: 'h2', text: 'Access token plus refresh token flow' },
      {
        type: 'ol',
        items: [
          'User logs in with email and password over HTTPS.',
          'Server returns a short-lived access token and sets a secure httpOnly refresh cookie.',
          'Client calls APIs with the access token.',
          'When the access token expires, client calls /auth/refresh.',
          'Server verifies the refresh token, rotates it, and returns a new access token.',
          'Logout revokes the refresh token server-side and clears the cookie.',
        ],
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Refresh cookie settings',
        code: `app.post('/auth/login', async (req, res) => {
  const user = await authService.verifyPassword(req.body.email, req.body.password);
  const refreshToken = await authService.createRefreshToken(user.id);
  const accessToken = authService.createAccessToken(user);

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ data: { accessToken } });
});`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Rotate refresh tokens',
        code: `app.post('/auth/refresh', async (req, res) => {
  const oldToken = req.cookies.refresh_token;

  if (!oldToken) {
    return res.status(401).json({ error: { code: 'REFRESH_REQUIRED' } });
  }

  const result = await authService.rotateRefreshToken(oldToken);

  res.cookie('refresh_token', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ data: { accessToken: result.accessToken } });
});`,
      },
      {
        type: 'note',
        text: 'Server-side sessions store login state on the server and send only a session id cookie to the browser. Refresh-token systems are more token-centered but still often need server-side storage for revocation and rotation.',
      },
      {
        type: 'tip',
        text: 'Hash refresh tokens before storing them, just like passwords. If the database leaks, raw refresh tokens should not immediately become active login credentials.',
      },
      {
        type: 'try',
        text: 'Sketch a table for refresh_tokens with id, user_id, token_hash, expires_at, revoked_at, created_at, and replaced_by_token_id. Explain how logout changes a row.',
      },
      {
        type: 'keypoints',
        items: [
          'Short access tokens pair well with refresh tokens or sessions.',
          'Refresh tokens are sensitive credentials and should be stored securely.',
          'httpOnly secure cookies reduce exposure to browser JavaScript.',
          'Rotation and revocation help limit damage from stolen refresh tokens.',
        ],
      },
    ],
  },
  {
    slug: 'express-password-hash',
    title: 'Password Hashing (bcrypt)',
    description:
      'Store passwords safely with bcrypt hashes, never plaintext or fast general-purpose hashes.',
    level: 'intermediate',
    section: 'Auth & Security',
    order: 33,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Passwords must never be stored in plaintext. If an attacker gets your user table, plaintext passwords immediately expose every account and often accounts on other sites.',
      },
      {
        type: 'p',
        text: 'bcrypt is designed for password hashing. It is intentionally slow and includes a salt, making large-scale guessing attacks more expensive than fast hashes such as SHA-256.',
      },
      { type: 'h2', text: 'Hash on signup' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Create a password hash',
        code: `import bcrypt from 'bcrypt';

const BCRYPT_COST = Number(process.env.BCRYPT_COST || 12);

app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 12) {
    return res.status(400).json({ error: { code: 'INVALID_SIGNUP' } });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  const user = await users.create({
    email: email.toLowerCase(),
    passwordHash,
  });

  res.status(201).json({ data: { id: user.id, email: user.email } });
});`,
      },
      { type: 'h2', text: 'Compare on login' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Verify a password',
        code: `app.post('/auth/login', async (req, res) => {
  const user = await users.findByEmail(req.body.email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS' } });
  }

  const matches = await bcrypt.compare(req.body.password, user.passwordHash);

  if (!matches) {
    return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS' } });
  }

  const accessToken = authService.createAccessToken(user);
  res.json({ data: { accessToken } });
});`,
      },
      {
        type: 'note',
        text: 'The bcrypt cost controls how expensive hashing is. Choose a value that is slow enough to resist guessing but fast enough for your login traffic and infrastructure.',
      },
      {
        type: 'tip',
        text: 'Return the same INVALID_CREDENTIALS error for unknown emails and wrong passwords. Different messages can help attackers discover registered accounts.',
      },
      {
        type: 'try',
        text: 'Measure bcrypt.hash timing for cost values 10, 12, and 14 on your machine. Pick a development default and explain what you would benchmark before production.',
      },
      {
        type: 'keypoints',
        items: [
          'Never store plaintext passwords.',
          'bcrypt is slow by design and includes salts automatically.',
          'Hash passwords on signup and compare hashes on login.',
          'Authentication errors should avoid leaking whether an email exists.',
        ],
      },
    ],
  },
  {
    slug: 'express-helmet-cors',
    title: 'Helmet, CORS & Secure Headers',
    description:
      'Use secure HTTP headers and deliberate CORS rules so browsers interact with your API safely.',
    level: 'intermediate',
    section: 'Auth & Security',
    order: 34,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Browsers enforce many security rules through HTTP headers. Express can send these headers, but you need to configure them intentionally for your API and frontend domains.',
      },
      {
        type: 'p',
        text: 'Helmet adds a useful baseline of security headers. CORS controls which browser origins are allowed to read responses from your API.',
      },
      { type: 'h2', text: 'Add Helmet and CORS' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Security middleware setup',
        code: `import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://app.example.com',
];

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());`,
      },
      { type: 'h2', text: 'Common CORS mistakes' },
      {
        type: 'ul',
        items: [
          'Using origin: * together with credentials. Browsers will reject it.',
          'Allowing every origin in production because local development was confusing.',
          'Forgetting that CORS protects browser reads, not server-to-server requests.',
          'Confusing CORS with authentication. An allowed origin is not a logged-in user.',
        ],
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Environment-driven origins',
        code: `const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000'];`,
      },
      {
        type: 'note',
        text: 'CORS is a browser security feature. Tools such as curl and backend services can still call your API, so authentication and authorization are still required.',
      },
      {
        type: 'tip',
        text: 'Keep production origins explicit. If your frontend has preview URLs, create a careful pattern or separate environment instead of allowing every domain.',
      },
      {
        type: 'try',
        text: 'Configure CORS for localhost and one production frontend. Test from an allowed origin, a blocked origin, and curl so you can see what CORS does and does not block.',
      },
      {
        type: 'keypoints',
        items: [
          'Helmet provides a strong default set of security headers.',
          'CORS controls which browser origins may read API responses.',
          'Allowed origins should come from configuration, not scattered code.',
          'CORS is not a replacement for authentication or authorization.',
        ],
      },
    ],
  },
  {
    slug: 'express-rate-limit',
    title: 'Rate Limiting',
    description:
      'Protect login, signup, and public API endpoints from abuse with rate limiting strategies.',
    level: 'intermediate',
    section: 'Auth & Security',
    order: 35,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Rate limiting restricts how many requests a client can make in a time window. It helps reduce brute-force login attempts, scraping, noisy clients, and accidental traffic spikes.',
      },
      {
        type: 'p',
        text: 'A rate limit is not a complete security system, but it is an essential guardrail on internet-facing APIs.',
      },
      { type: 'h2', text: 'Apply different limits to different routes' },
      {
        type: 'code',
        language: 'javascript',
        title: 'express-rate-limit setup',
        code: `import rateLimit from 'express-rate-limit';

app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: { code: 'RATE_LIMITED', message: 'Too many requests' },
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: { code: 'LOGIN_RATE_LIMITED', message: 'Try again later' },
  },
});

app.use('/api', apiLimiter);
app.post('/auth/login', loginLimiter, loginController.login);`,
      },
      { type: 'h2', text: 'Choose identifiers carefully' },
      {
        type: 'p',
        text: 'Basic rate limits use IP addresses. That can work for public APIs, but users behind shared networks may share an IP. Authenticated APIs can often combine IP, user id, and route sensitivity.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Custom key generator idea',
        code: `const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  keyGenerator(req) {
    return req.user ? 'user:' + req.user.id : 'ip:' + req.ip;
  },
});`,
      },
      {
        type: 'note',
        text: 'In production with multiple server instances, use a shared store such as Redis. An in-memory limiter only sees requests handled by the current process.',
      },
      {
        type: 'tip',
        text: 'Limit authentication endpoints more aggressively than normal reads. Login, signup, password reset, and token refresh deserve special attention.',
      },
      {
        type: 'try',
        text: 'Add a strict limiter to POST /auth/login and a looser limiter to /api. Send repeated requests and observe the 429 response and rate limit headers.',
      },
      {
        type: 'keypoints',
        items: [
          'Rate limiting reduces abuse and accidental overload.',
          'Sensitive endpoints need stricter limits than normal API reads.',
          'Production clusters need a shared rate limit store.',
          'Set trust proxy correctly when your app runs behind a load balancer.',
        ],
      },
    ],
  },
  {
    slug: 'express-mongodb',
    title: 'MongoDB with the Node Driver',
    description:
      'Connect Express to MongoDB using the official Node driver, ObjectId, indexes, and shared clients.',
    level: 'intermediate',
    section: 'Data',
    order: 36,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'The official MongoDB Node driver gives you direct access to collections and documents. It is flexible, fast, and close to how MongoDB actually works.',
      },
      {
        type: 'p',
        text: 'The most important Express habit is to create one MongoClient for the process and reuse it. Opening a new connection for every request is slow and can exhaust database resources.',
      },
      { type: 'h2', text: 'Create and reuse a client' },
      {
        type: 'code',
        language: 'javascript',
        title: 'db/mongodb.js',
        code: `import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is required');
}

const client = new MongoClient(uri);
let db;

export async function connectMongo() {
  if (!db) {
    await client.connect();
    db = client.db(process.env.MONGODB_DB || 'books_api');
    await db.collection('books').createIndex({ title: 1 });
  }

  return db;
}

export function toObjectId(id) {
  if (!ObjectId.isValid(id)) {
    const error = new Error('Invalid id');
    error.statusCode = 400;
    error.code = 'INVALID_ID';
    throw error;
  }

  return new ObjectId(id);
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Book routes with the driver',
        code: `app.get('/api/books/:id', asyncHandler(async (req, res) => {
  const db = await connectMongo();
  const book = await db.collection('books').findOne({ _id: toObjectId(req.params.id) });

  if (!book) {
    return res.status(404).json({ error: { code: 'BOOK_NOT_FOUND' } });
  }

  res.json({ data: book });
}));

app.post('/api/books', asyncHandler(async (req, res) => {
  const db = await connectMongo();
  const result = await db.collection('books').insertOne({
    title: req.body.title,
    author: req.body.author,
    createdAt: new Date(),
  });

  const book = await db.collection('books').findOne({ _id: result.insertedId });
  res.status(201).json({ data: book });
}));`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Paginated find query',
        code: `const page = Math.max(Number(req.query.page || 1), 1);
const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);

const books = await db
  .collection('books')
  .find({ author: req.query.author })
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit)
  .toArray();`,
      },
      {
        type: 'note',
        text: 'ObjectId values are not strings in MongoDB queries. Convert and validate incoming ids before using them in _id filters.',
      },
      {
        type: 'tip',
        text: 'Create indexes for fields used in frequent filters or sorts. Without indexes, MongoDB may scan large collections as your data grows.',
      },
      {
        type: 'try',
        text: 'Build GET /api/books/:id and POST /api/books with the MongoDB driver. Add invalid ObjectId handling and create an index on createdAt.',
      },
      {
        type: 'keypoints',
        items: [
          'Reuse one MongoClient instead of connecting per request.',
          'Validate and convert ObjectId strings before querying _id.',
          'Indexes are required for fast filters and sorts at scale.',
          'The Node driver is direct and flexible, but you manage schemas in application code.',
        ],
      },
    ],
  },
  {
    slug: 'express-mongoose',
    title: 'Mongoose ODM',
    description:
      'Use Mongoose schemas, models, validation, and queries when you want a structured MongoDB object model.',
    level: 'intermediate',
    section: 'Data',
    order: 37,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Mongoose is an ODM: an object document mapper for MongoDB. It adds schemas, models, casting, hooks, validation, and a higher-level query API on top of the MongoDB driver.',
      },
      {
        type: 'p',
        text: 'Mongoose is helpful when your team wants document structure in code. It is still MongoDB underneath, so indexing, document design, and query patterns still matter.',
      },
      { type: 'h2', text: 'Connect once at startup' },
      {
        type: 'code',
        language: 'javascript',
        title: 'db/mongoose.js',
        code: `import mongoose from 'mongoose';

export async function connectMongoose() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB || 'books_api',
  });
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'models/book.model.js',
        code: `import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 160,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publishedYear: {
      type: Number,
      min: 1450,
    },
  },
  { timestamps: true },
);

bookSchema.index({ title: 1 });
bookSchema.index({ createdAt: -1 });

export const Book = mongoose.model('Book', bookSchema);`,
      },
      { type: 'h2', text: 'Use models in controllers or services' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Book service with Mongoose',
        code: `import { Book } from '../models/book.model.js';

export async function createBook(input) {
  return Book.create({
    title: input.title,
    author: input.author,
    publishedYear: input.publishedYear,
  });
}

export async function listBooks({ page = 1, limit = 20 }) {
  return Book.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
}`,
      },
      {
        type: 'note',
        text: 'Mongoose validation is useful, but API validation is still needed. Schema errors are often database-focused, while route validation should produce client-friendly 400 responses.',
      },
      {
        type: 'tip',
        text: 'Use lean() for read-only list endpoints when you do not need full Mongoose document methods. It returns plain objects and can be faster.',
      },
      {
        type: 'try',
        text: 'Create a Book schema with title, author, and publishedYear. Add indexes, create one document, and build a list endpoint that uses lean().',
      },
      {
        type: 'keypoints',
        items: [
          'Mongoose adds schemas and models on top of MongoDB.',
          'Connect once during app startup.',
          'Schema validation complements but does not replace API validation.',
          'Use indexes and lean queries intentionally for production reads.',
        ],
      },
    ],
  },
  {
    slug: 'express-postgres',
    title: 'PostgreSQL with node-postgres/Prisma patterns',
    description:
      'Query PostgreSQL from Express with pg pools, parameterized queries, transactions, and a Prisma-style workflow overview.',
    level: 'intermediate',
    section: 'Data',
    order: 38,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'PostgreSQL is a relational database with strong consistency, SQL queries, joins, constraints, and transactions. Express apps often use it for products, orders, users, billing, and other structured data.',
      },
      {
        type: 'p',
        text: 'The node-postgres package, commonly imported as pg, gives you a low-level pool and query API. Prisma adds a generated client and migration workflow on top of a schema file. Both patterns are common.',
      },
      { type: 'h2', text: 'Use a pg connection pool' },
      {
        type: 'code',
        language: 'javascript',
        title: 'db/postgres.js',
        code: `import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }
    : false,
});`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Parameterized pg queries',
        code: `import { pool } from './db/postgres.js';

app.get('/api/books/:id', asyncHandler(async (req, res) => {
  const result = await pool.query(
    'select id, title, author, created_at from books where id = $1',
    [req.params.id],
  );

  const book = result.rows[0];

  if (!book) {
    return res.status(404).json({ error: { code: 'BOOK_NOT_FOUND' } });
  }

  res.json({ data: book });
}));

app.post('/api/books', asyncHandler(async (req, res) => {
  const result = await pool.query(
    'insert into books (title, author) values ($1, $2) returning id, title, author, created_at',
    [req.body.title, req.body.author],
  );

  res.status(201).json({ data: result.rows[0] });
}));`,
      },
      { type: 'h2', text: 'Transactions for multi-step writes' },
      {
        type: 'code',
        language: 'javascript',
        title: 'pg transaction pattern',
        code: `async function createOrder(userId, items) {
  const client = await pool.connect();

  try {
    await client.query('begin');

    const orderResult = await client.query(
      'insert into orders (user_id) values ($1) returning id',
      [userId],
    );

    for (const item of items) {
      await client.query(
        'insert into order_items (order_id, product_id, quantity) values ($1, $2, $3)',
        [orderResult.rows[0].id, item.productId, item.quantity],
      );
    }

    await client.query('commit');
    return orderResult.rows[0];
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Prisma-style service idea',
        code: `const book = await prisma.book.create({
  data: {
    title: input.title,
    author: input.author,
  },
  select: {
    id: true,
    title: true,
    author: true,
    createdAt: true,
  },
});`,
      },
      {
        type: 'note',
        text: 'Prisma-style projects usually define models in schema.prisma, run migrations, generate a typed client, then call prisma.model methods from services. You still need validation, transactions, and careful data modeling.',
      },
      {
        type: 'tip',
        text: 'Always use parameterized queries with pg. Never concatenate user input into SQL strings.',
      },
      {
        type: 'try',
        text: 'Build a GET /api/books/:id endpoint with pg using a parameterized query. Then write a transaction that creates an order and two order_items rows.',
      },
      {
        type: 'keypoints',
        items: [
          'Use a shared pg Pool for PostgreSQL connections.',
          'Parameterized queries protect against SQL injection.',
          'Transactions keep multi-step writes consistent.',
          'Prisma adds schema, migration, and generated-client workflows while still relying on database fundamentals.',
        ],
      },
    ],
  },
  {
    slug: 'express-migrations-seed',
    title: 'Migrations & Seeding Mindset',
    description:
      'Treat database schema changes and seed data as versioned application changes, not manual dashboard work.',
    level: 'intermediate',
    section: 'Data',
    order: 39,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'A database schema is part of your application. If tables, indexes, constraints, or seed records are created manually, environments drift and deployments become risky.',
      },
      {
        type: 'p',
        text: 'Migrations describe how the database changes over time. Seeds create predictable baseline data for local development, tests, demos, or required lookup tables.',
      },
      { type: 'h2', text: 'What belongs in migrations' },
      {
        type: 'ul',
        items: [
          'Create and alter tables or collections.',
          'Add indexes, unique constraints, and foreign keys.',
          'Backfill or transform existing data carefully.',
          'Record which changes have already been applied.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        title: 'SQL migration example',
        code: `-- 202607250001_create_books.sql
create table books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  created_at timestamptz not null default now()
);

create index books_created_at_idx on books (created_at desc);`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Seed script shape',
        code: `import { pool } from '../src/db/postgres.js';

const books = [
  { title: 'RESTful Node', author: 'Ada' },
  { title: 'Testing APIs', author: 'Grace' },
];

for (const book of books) {
  await pool.query(
    'insert into books (title, author) values ($1, $2) on conflict do nothing',
    [book.title, book.author],
  );
}

await pool.end();`,
      },
      {
        type: 'note',
        text: 'Migration tools differ by stack: Prisma Migrate, Knex migrations, Drizzle migrations, Flyway, and custom SQL runners are all valid when used consistently.',
      },
      {
        type: 'tip',
        text: 'Make seeds safe to run more than once when possible. Idempotent seeds reduce local setup pain and test flakiness.',
      },
      {
        type: 'try',
        text: 'Write a migration for a categories table and a seed script that inserts three default categories without creating duplicates on repeated runs.',
      },
      {
        type: 'keypoints',
        items: [
          'Database changes should be versioned with the application.',
          'Migrations create repeatable schema history.',
          'Seeds provide predictable data for development and tests.',
          'Avoid manual production schema edits except for carefully controlled emergencies.',
        ],
      },
    ],
  },
  {
    slug: 'express-uploads',
    title: 'File Uploads',
    description:
      'Accept file uploads in Express while validating file type, size, storage location, and public access.',
    level: 'intermediate',
    section: 'App Features',
    order: 40,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'File uploads introduce more risk than normal JSON routes. Files can be too large, have unexpected types, contain malicious content, or fill up server disk.',
      },
      {
        type: 'p',
        text: 'Express does not parse multipart form data by itself. Libraries such as multer handle upload parsing, but your application still needs validation and storage decisions.',
      },
      { type: 'h2', text: 'Handle multipart uploads with multer' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Avatar upload route',
        code: `import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
  fileFilter(req, file, callback) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error('Only jpeg, png, and webp images are allowed'));
    }

    callback(null, true);
  },
});

app.post('/api/me/avatar', requireAuth, upload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { code: 'FILE_REQUIRED' } });
  }

  const storedFile = await fileStorage.save({
    buffer: req.file.buffer,
    contentType: req.file.mimetype,
    originalName: req.file.originalname,
    ownerId: req.user.id,
  });

  res.status(201).json({ data: { url: storedFile.url } });
}));`,
      },
      { type: 'h2', text: 'Storage choices' },
      {
        type: 'ul',
        items: [
          'Local disk is simple for development but fragile in many cloud deployments.',
          'Object storage such as S3-compatible services is common for production.',
          'Databases can store small metadata records while files live in object storage.',
          'Signed URLs can protect private files without streaming everything through Express.',
        ],
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Store metadata separately',
        code: `await db.files.insertOne({
  ownerId: req.user.id,
  key: storedFile.key,
  originalName: req.file.originalname,
  contentType: req.file.mimetype,
  size: req.file.size,
  createdAt: new Date(),
});`,
      },
      {
        type: 'note',
        text: 'MIME type checks are useful but not perfect. For high-risk uploads, inspect file signatures and consider virus scanning before making files public.',
      },
      {
        type: 'tip',
        text: 'Do not serve user uploads from the same origin and path space as your application code if you can avoid it. Separate storage domains reduce security surprises.',
      },
      {
        type: 'try',
        text: 'Create an avatar upload endpoint that accepts only one image under 2 MB. Return a clear 400 error when the file is missing or has the wrong type.',
      },
      {
        type: 'keypoints',
        items: [
          'Express needs multipart middleware such as multer for uploads.',
          'Always validate file size, count, and type.',
          'Production uploads usually belong in object storage, not local server disk.',
          'Store file metadata separately from the binary object.',
        ],
      },
    ],
  },
  {
    slug: 'express-email',
    title: 'Sending Email',
    description:
      'Send transactional email from Express through a provider while keeping SMTP credentials and API keys out of source code.',
    level: 'intermediate',
    section: 'App Features',
    order: 41,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'APIs often send email for signup verification, password reset, receipts, invites, and notifications. Email should be treated as an external integration that can fail.',
      },
      {
        type: 'p',
        text: 'Do not put SMTP passwords or provider API keys in code. Load credentials from environment variables or a secret manager and use separate credentials for development, staging, and production.',
      },
      { type: 'h2', text: 'Send with a transporter' },
      {
        type: 'code',
        language: 'javascript',
        title: 'email.js with nodemailer',
        code: `import nodemailer from 'nodemailer';

const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_FROM'];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(name + ' is required');
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail({ to, resetUrl }) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Reset your password',
    text: 'Reset your password: ' + resetUrl,
    html: '<p>Reset your password:</p><p><a href="' + resetUrl + '">Reset password</a></p>',
  });
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Call email from a service',
        code: `app.post('/auth/password-reset', asyncHandler(async (req, res) => {
  const user = await users.findByEmail(req.body.email.toLowerCase());

  if (user) {
    const token = await authService.createPasswordResetToken(user.id);
    const resetUrl = process.env.APP_URL + '/reset-password?token=' + token;
    await sendPasswordResetEmail({ to: user.email, resetUrl });
  }

  res.json({
    data: {
      message: 'If that email exists, reset instructions will be sent.',
    },
  });
}));`,
      },
      {
        type: 'note',
        text: 'Password reset responses should not reveal whether an email exists. The email itself can contain the private reset link for real users.',
      },
      {
        type: 'tip',
        text: 'For high-volume or slow email providers, send email from a background job. The API can return quickly after enqueueing the message.',
      },
      {
        type: 'try',
        text: 'Create a sendWelcomeEmail function that reads EMAIL_FROM and SMTP credentials from environment variables. Call it after signup without exposing secrets in logs.',
      },
      {
        type: 'keypoints',
        items: [
          'Email credentials are secrets and must not be hardcoded.',
          'Transactional email can fail, so handle provider errors thoughtfully.',
          'Password reset flows should avoid account enumeration.',
          'Background jobs are useful when email sending should not slow API responses.',
        ],
      },
    ],
  },
  {
    slug: 'express-pagination-filter',
    title: 'Pagination, Filtering & Sorting',
    description:
      'Build list endpoints that support predictable pagination, safe filters, and controlled sort options.',
    level: 'intermediate',
    section: 'App Features',
    order: 42,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'List endpoints can become expensive if they return every row or document. Pagination limits response size and makes UI loading predictable.',
      },
      {
        type: 'p',
        text: 'Filtering and sorting are also part of the API contract. The server should allow known fields and reject or ignore unsafe options.',
      },
      { type: 'h2', text: 'Validate list query params' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Pagination helpers',
        code: `function parseListQuery(query) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);

  const allowedSorts = {
    newest: { field: 'created_at', direction: 'desc' },
    oldest: { field: 'created_at', direction: 'asc' },
    title: { field: 'title', direction: 'asc' },
  };

  return {
    page,
    limit,
    offset: (page - 1) * limit,
    search: typeof query.search === 'string' ? query.search.trim() : '',
    sort: allowedSorts[query.sort] || allowedSorts.newest,
  };
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'PostgreSQL list endpoint',
        code: `app.get('/api/books', asyncHandler(async (req, res) => {
  const options = parseListQuery(req.query);
  const search = '%' + options.search + '%';

  const result = await pool.query(
    'select id, title, author, created_at from books where ($1 = '' or title ilike $2) order by created_at desc limit $3 offset $4',
    [options.search, search, options.limit, options.offset],
  );

  const countResult = await pool.query(
    'select count(*)::int as count from books where ($1 = '' or title ilike $2)',
    [options.search, search],
  );

  res.json({
    data: result.rows,
    meta: {
      page: options.page,
      limit: options.limit,
      total: countResult.rows[0].count,
    },
  });
}));`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'MongoDB list endpoint idea',
        code: `const filter = options.search
  ? { title: { $regex: options.search, $options: 'i' } }
  : {};

const books = await db
  .collection('books')
  .find(filter)
  .sort({ createdAt: options.sort.direction === 'desc' ? -1 : 1 })
  .skip(options.offset)
  .limit(options.limit)
  .toArray();`,
      },
      {
        type: 'note',
        text: 'Offset pagination is easy to understand, but very deep pages can become slow. Cursor pagination is often better for activity feeds or huge tables.',
      },
      {
        type: 'tip',
        text: 'Never pass a raw query string directly into an order by clause. Map client sort names to known database fields.',
      },
      {
        type: 'try',
        text: 'Add page, limit, search, and sort query params to a list endpoint. Clamp limit to 100 and return meta with page, limit, and total.',
      },
      {
        type: 'keypoints',
        items: [
          'Pagination keeps list responses bounded.',
          'Validate and clamp page and limit values.',
          'Filtering and sorting should allow known fields only.',
          'Return metadata so clients can build pagination UI.',
        ],
      },
    ],
  },
  {
    slug: 'express-logging',
    title: 'Logging for APIs',
    description:
      'Log useful request and application events without leaking secrets or overwhelming production systems.',
    level: 'intermediate',
    section: 'Quality',
    order: 43,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Logs help you understand what happened after an API is deployed. Good logs answer when a request happened, which route was hit, how long it took, and why failures occurred.',
      },
      {
        type: 'p',
        text: 'Console logging can work locally, but production APIs benefit from structured logs that machines can search, filter, and aggregate.',
      },
      { type: 'h2', text: 'Request logging middleware' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Request duration logs',
        code: `app.use((req, res, next) => {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    console.log(JSON.stringify({
      level: 'info',
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    }));
  });

  next();
});`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Log errors with context',
        code: `app.use((err, req, res, next) => {
  console.error(JSON.stringify({
    level: 'error',
    requestId: req.requestId,
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  }));

  res.status(err.statusCode || 500).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      requestId: req.requestId,
    },
  });
});`,
      },
      {
        type: 'note',
        text: 'Avoid logging passwords, raw tokens, API keys, session cookies, or full authorization headers. Logs often live longer and are viewed by more systems than application memory.',
      },
      {
        type: 'tip',
        text: 'Include a request id in logs and responses. It lets support teams connect a user-visible error with the exact server log entries.',
      },
      {
        type: 'try',
        text: 'Add request-id logging to an Express app. Make one successful request and one failing request, then find both log lines by request id.',
      },
      {
        type: 'keypoints',
        items: [
          'Structured logs are easier to search and aggregate.',
          'Request ids connect client errors to server logs.',
          'Never log secrets or sensitive credentials.',
          'Log enough context to debug without creating noisy or risky logs.',
        ],
      },
    ],
  },
  {
    slug: 'express-testing',
    title: 'Testing Express Apps',
    description:
      'Test Express routes, services, middleware, and error responses with focused unit and integration tests.',
    level: 'intermediate',
    section: 'Quality',
    order: 44,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Testing an Express app is easiest when the app can be imported without starting a network listener. Export the app from one file and call app.listen in a separate server file.',
      },
      {
        type: 'p',
        text: 'Use service tests for business logic and route tests for HTTP behavior. Route tests should check status codes, JSON shapes, auth requirements, and validation failures.',
      },
      { type: 'h2', text: 'Separate app from server' },
      {
        type: 'code',
        language: 'javascript',
        title: 'src/app.js',
        code: `import express from 'express';

export function createApp({ bookService }) {
  const app = express();

  app.use(express.json());

  app.get('/api/books', async (req, res) => {
    const books = await bookService.listBooks();
    res.json({ data: books });
  });

  app.post('/api/books', async (req, res) => {
    const book = await bookService.createBook(req.body);
    res.status(201).json({ data: book });
  });

  return app;
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'src/server.js',
        code: `import { createApp } from './app.js';
import { bookService } from './services/book.service.js';

const app = createApp({ bookService });
const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log('API listening on port ' + port);
});`,
      },
      { type: 'h2', text: 'Test routes with supertest' },
      {
        type: 'code',
        language: 'javascript',
        title: 'app.test.js',
        code: `import request from 'supertest';
import { createApp } from './app.js';

test('GET /api/books returns books', async () => {
  const app = createApp({
    bookService: {
      listBooks: async () => [{ id: '1', title: 'Testing APIs' }],
      createBook: async () => null,
    },
  });

  const response = await request(app).get('/api/books').expect(200);

  expect(response.body).toEqual({
    data: [{ id: '1', title: 'Testing APIs' }],
  });
});

test('POST /api/books creates a book', async () => {
  const app = createApp({
    bookService: {
      listBooks: async () => [],
      createBook: async (input) => ({ id: '2', title: input.title }),
    },
  });

  const response = await request(app)
    .post('/api/books')
    .send({ title: 'Express Tests' })
    .expect(201);

  expect(response.body.data.title).toBe('Express Tests');
});`,
      },
      {
        type: 'note',
        text: 'Mock dependencies at boundaries you own. If every test mocks everything, you may only test mocks. If no tests mock anything, they may become slow and fragile.',
      },
      {
        type: 'tip',
        text: 'Test the unhappy paths: invalid input, unauthenticated requests, missing records, duplicate conflicts, and service failures.',
      },
      {
        type: 'try',
        text: 'Write three tests for POST /api/users: success, missing email validation, and duplicate email conflict. Assert both status code and JSON error code.',
      },
      {
        type: 'keypoints',
        items: [
          'Export an app without listening so tests can import it.',
          'Use route tests for HTTP behavior and service tests for business logic.',
          'Supertest can call an Express app directly without a real port.',
          'Unhappy-path tests catch many production API bugs.',
        ],
      },
    ],
  },
  {
    slug: 'express-api-docs',
    title: 'API Docs Mindset (OpenAPI/Swagger)',
    description:
      'Document Express APIs as contracts using examples, schemas, response codes, and OpenAPI-style descriptions.',
    level: 'intermediate',
    section: 'Quality',
    order: 45,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'API documentation is not just a website. It is a contract between backend code and every client that depends on it.',
      },
      {
        type: 'p',
        text: 'OpenAPI, often viewed with Swagger UI, describes paths, methods, parameters, request bodies, responses, and schemas in a machine-readable format.',
      },
      { type: 'h2', text: 'Document a route as a contract' },
      {
        type: 'code',
        language: 'json',
        title: 'OpenAPI-style path snippet',
        code: `{
  "paths": {
    "/api/books/{id}": {
      "get": {
        "summary": "Get one book",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "Book found"
          },
          "404": {
            "description": "Book not found"
          }
        }
      }
    }
  }
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Serve Swagger UI in development',
        code: `import swaggerUi from 'swagger-ui-express';
import openApiDocument from '../openapi.json' assert { type: 'json' };

if (process.env.NODE_ENV !== 'production') {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
}`,
      },
      { type: 'h2', text: 'What good docs include' },
      {
        type: 'ul',
        items: [
          'Authentication requirements and example headers.',
          'Request body schemas and realistic examples.',
          'Every meaningful success and error response.',
          'Pagination, filtering, sorting, and rate limit behavior.',
          'Versioning and deprecation notes when contracts change.',
        ],
      },
      {
        type: 'note',
        text: 'Docs drift when they are maintained separately from code. Consider schema-driven validation, generated docs, or contract tests for important APIs.',
      },
      {
        type: 'tip',
        text: 'Document errors as carefully as successful responses. Client teams need to know which error codes they can handle.',
      },
      {
        type: 'try',
        text: 'Write an OpenAPI-style JSON snippet for POST /api/books with request body fields, 201 success response, 400 validation error, and 401 auth error.',
      },
      {
        type: 'keypoints',
        items: [
          'API docs describe the contract clients rely on.',
          'OpenAPI can document routes, schemas, auth, and responses.',
          'Examples make docs easier to use than schemas alone.',
          'Keep docs close to implementation or verify them with tests.',
        ],
      },
    ],
  },
  {
    slug: 'express-typescript',
    title: 'TypeScript with Express (Practical Intro)',
    description:
      'Add TypeScript to Express for typed requests, responses, services, and environment configuration.',
    level: 'intermediate',
    section: 'Quality',
    order: 46,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'TypeScript helps Express teams catch mistakes before runtime. It is especially useful for service inputs, response shapes, middleware-added request properties, and configuration.',
      },
      {
        type: 'p',
        text: 'The practical goal is not to type every tiny detail. Start with boundaries where mistakes are expensive: request bodies after validation, service return values, and custom auth properties.',
      },
      { type: 'h2', text: 'A typed controller' },
      {
        type: 'code',
        language: 'typescript',
        title: 'book.controller.ts',
        code: `import type { Request, Response } from 'express';

type CreateBookBody = {
  title: string;
  author: string;
};

type BookResponse = {
  data: {
    id: string;
    title: string;
    author: string;
  };
};

export async function createBook(
  req: Request<{}, BookResponse, CreateBookBody>,
  res: Response<BookResponse>,
) {
  const book = await bookService.createBook(req.body);

  res.status(201).json({
    data: {
      id: book.id,
      title: book.title,
      author: book.author,
    },
  });
}`,
      },
      { type: 'h2', text: 'Type middleware-added properties' },
      {
        type: 'code',
        language: 'typescript',
        title: 'types/express.d.ts',
        code: `declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'user' | 'admin';
      };
      requestId?: string;
    }
  }
}

export {};`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'requireAuth.ts',
        code: `import type { NextFunction, Request, Response } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: { code: 'AUTH_REQUIRED' } });
  }

  next();
}`,
      },
      {
        type: 'code',
        language: 'json',
        title: 'Useful tsconfig options',
        code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist"
  }
}`,
      },
      {
        type: 'note',
        text: 'Runtime validation is still required. TypeScript checks your source code, but it does not prove that incoming JSON from a client has the right shape.',
      },
      {
        type: 'tip',
        text: 'Let validation libraries infer TypeScript types when possible. That keeps runtime schemas and compile-time types from drifting.',
      },
      {
        type: 'try',
        text: 'Convert one Express controller to TypeScript. Add a typed request body, typed response, and a custom req.user declaration.',
      },
      {
        type: 'keypoints',
        items: [
          'TypeScript improves Express boundaries and service contracts.',
          'Request body types are most useful after validation.',
          'Declaration merging can type req.user and req.requestId.',
          'TypeScript complements runtime validation; it does not replace it.',
        ],
      },
    ],
  },
  {
    slug: 'express-config',
    title: 'Config & 12-factor Basics',
    description:
      'Load configuration from the environment, validate it at startup, and keep deploy-specific values out of code.',
    level: 'intermediate',
    section: 'Delivery',
    order: 47,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'The 12-factor approach says configuration should live in the environment, not in source code. The same build should be deployable to development, staging, and production with different environment values.',
      },
      {
        type: 'p',
        text: 'Express apps commonly need config for ports, database URLs, JWT secrets, CORS origins, email credentials, log levels, and feature flags.',
      },
      { type: 'h2', text: 'Validate configuration once' },
      {
        type: 'code',
        language: 'javascript',
        title: 'config.js',
        code: `const required = ['DATABASE_URL', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(key + ' is required');
  }
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000'],
  logLevel: process.env.LOG_LEVEL || 'info',
};`,
      },
      {
        type: 'code',
        language: 'text',
        title: '.env.example',
        code: `NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/books_api
JWT_SECRET=replace-with-a-generated-secret
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=debug`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Use config instead of process.env everywhere',
        code: `import { config } from './config.js';

app.listen(config.port, () => {
  console.log('API listening on port ' + config.port);
});`,
      },
      {
        type: 'note',
        text: 'Do not commit real .env files. Commit .env.example with placeholder values so teammates know which variables are required.',
      },
      {
        type: 'tip',
        text: 'Fail fast when required config is missing. A server that starts with an undefined JWT secret or database URL is dangerous and hard to debug.',
      },
      {
        type: 'try',
        text: 'Create a config module for PORT, DATABASE_URL, JWT_SECRET, and CORS_ORIGINS. Make the app crash at startup if DATABASE_URL or JWT_SECRET is missing.',
      },
      {
        type: 'keypoints',
        items: [
          'Configuration should come from the environment, not hardcoded deploy-specific values.',
          'Secrets such as JWT_SECRET must never be committed.',
          'Validate config at startup so failures are immediate.',
          '.env.example documents required variables without exposing real secrets.',
        ],
      },
    ],
  },
  {
    slug: 'express-deploy',
    title: 'Deploying Express APIs',
    description:
      'Prepare Express APIs for production with start scripts, health checks, proxies, environment variables, and graceful shutdown.',
    level: 'intermediate',
    section: 'Delivery',
    order: 48,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Deploying an Express API means more than uploading code. Production needs a repeatable start command, environment variables, database access, logging, health checks, proxy awareness, and safe shutdown.',
      },
      {
        type: 'p',
        text: 'The exact platform can vary: containers, virtual machines, serverless functions, or managed Node hosts. The production habits are similar across platforms.',
      },
      { type: 'h2', text: 'Production server basics' },
      {
        type: 'code',
        language: 'javascript',
        title: 'server.js',
        code: `import { app } from './app.js';
import { closeDatabase } from './db/index.js';

const port = Number(process.env.PORT || 3000);

app.set('trust proxy', 1);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
  });
});

const server = app.listen(port, () => {
  console.log('API listening on port ' + port);
});

async function shutdown(signal) {
  console.log('Received ' + signal + ', shutting down');

  server.close(async () => {
    await closeDatabase();
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));`,
      },
      {
        type: 'code',
        language: 'json',
        title: 'package.json scripts',
        code: `{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "test": "node --test"
  }
}`,
      },
      { type: 'h2', text: 'Deployment checklist' },
      {
        type: 'ul',
        items: [
          'Set NODE_ENV=production.',
          'Provide real environment variables through the platform secret system.',
          'Run database migrations before or during deployment.',
          'Expose a health endpoint for load balancers and uptime checks.',
          'Enable structured logs and error monitoring.',
          'Set trust proxy when behind a reverse proxy or platform load balancer.',
          'Use HTTPS at the edge and secure cookies in production.',
        ],
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Typical production commands',
        code: `npm ci --omit=dev
npm run build
npm start`,
      },
      {
        type: 'note',
        text: 'Some platforms install dev dependencies during build and then prune them for runtime. Follow your platform model, but keep the production runtime as small and predictable as possible.',
      },
      {
        type: 'tip',
        text: 'Deploy a small health check early. It gives load balancers, monitoring tools, and humans a simple way to know whether the API process is alive.',
      },
      {
        type: 'try',
        text: 'Add /health, a production start script, and graceful shutdown to a sample Express API. Write down where DATABASE_URL and JWT_SECRET will be configured on your target platform.',
      },
      {
        type: 'keypoints',
        items: [
          'Production Express apps need repeatable build and start commands.',
          'Secrets must come from the deployment platform, not source code.',
          'Health checks, logs, and graceful shutdown improve operability.',
          'Reverse proxies affect IPs, HTTPS detection, and secure cookie behavior.',
        ],
      },
    ],
  },
];
