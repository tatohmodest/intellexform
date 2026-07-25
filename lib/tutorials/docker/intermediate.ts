import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'docker-multistage',
    title: 'Multi-stage Builds',
    description:
      'Use multiple FROM stages to build application artifacts in one image and copy only the runtime files into a smaller final image.',
    level: 'intermediate',
    section: 'Better Images',
    order: 26,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'A multi-stage build lets one Dockerfile contain separate environments for building, testing, and running an application. The build stage can include compilers, package managers, and source files. The final stage can contain only the compiled output and the minimum runtime needed to start the app.',
      },
      {
        type: 'p',
        text: 'This pattern keeps images smaller, reduces accidental file leakage, and makes builds easier to repeat. It is one of the most important Dockerfile techniques after you know basic COPY, RUN, and CMD instructions.',
      },
      { type: 'h2', text: 'Build in one stage, run in another' },
      {
        type: 'code',
        language: 'dockerfile',
        title: 'Multi-stage Dockerfile for a Node app',
        code: `# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
      },
      {
        type: 'p',
        text: 'The final image does not include your raw source tree, build tools, or dev dependencies. Docker builds all stages, but only the last stage becomes the image unless you choose a target.',
      },
      { type: 'h2', text: 'Build a specific stage while debugging' },
      {
        type: 'code',
        language: 'bash',
        title: 'Target a named stage',
        code: `docker build --target build -t myapp:build .
docker run --rm -it myapp:build sh`,
      },
      {
        type: 'note',
        text: 'Stage names such as deps, build, and runtime are optional, but they make COPY --from=... readable and safer than relying on numeric stage indexes.',
      },
      {
        type: 'tip',
        text: 'Put dependency installation before copying the full source tree. That lets Docker reuse the dependency layer when application code changes but package files do not.',
      },
      {
        type: 'try',
        text: 'Convert a one-stage Dockerfile into three stages named deps, build, and runtime. Build the runtime image, then build only the build stage with --target and inspect which files are present.',
      },
      {
        type: 'keypoints',
        items: [
          'Multi-stage builds separate build-time tools from runtime files.',
          'COPY --from copies artifacts from one stage into another.',
          'A smaller runtime image usually has fewer dependencies and a smaller attack surface.',
          'Named stages make Dockerfiles easier to maintain and debug.',
        ],
      },
    ],
  },
  {
    slug: 'docker-layers-cache',
    title: 'Layer Caching & Faster Builds',
    description:
      'Understand Docker layers, cache invalidation, and Dockerfile ordering so rebuilds stay fast during normal development.',
    level: 'intermediate',
    section: 'Better Images',
    order: 27,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Docker builds an image as a stack of layers. Instructions such as FROM, RUN, COPY, and ADD create layers. If Docker sees that an instruction and its inputs have not changed, it can reuse the existing cached layer instead of running the step again.',
      },
      {
        type: 'p',
        text: 'The cache is powerful, but it is also easy to break. Once a layer changes, every layer after it must be rebuilt. Good Dockerfiles place stable, expensive work early and frequently changing files later.',
      },
      { type: 'h2', text: 'A cache-friendly dependency install' },
      {
        type: 'code',
        language: 'dockerfile',
        title: 'Copy lock files before source code',
        code: `FROM node:22-bookworm-slim
WORKDIR /app

# Changes rarely, so npm ci can often be cached.
COPY package.json package-lock.json ./
RUN npm ci

# Changes often, so keep it after dependency installation.
COPY . .
RUN npm run build

CMD ["npm", "start"]`,
      },
      {
        type: 'p',
        text: 'If you copied the whole project before npm ci, every source code edit would invalidate the dependency install layer. With this layout, Docker reruns npm ci only when package.json or the lock file changes.',
      },
      { type: 'h2', text: 'Control cache behavior' },
      {
        type: 'code',
        language: 'bash',
        title: 'Useful build cache commands',
        code: `docker build -t web:dev .
docker build --no-cache -t web:clean .
docker builder prune
docker history web:dev`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'Example .dockerignore',
        code: `node_modules
.git
.env
.next
dist
coverage
npm-debug.log`,
      },
      {
        type: 'note',
        text: '.dockerignore affects what files are sent to the Docker build context. Smaller contexts are faster and reduce the risk of copying secrets into an image layer.',
      },
      {
        type: 'tip',
        text: 'When a build is unexpectedly slow, run docker history and check which Dockerfile line is being rebuilt. The problem is often one COPY instruction placed too early.',
      },
      {
        type: 'try',
        text: 'Create a Dockerfile that installs dependencies before copying source. Build it twice, edit only an app file, then build again and observe which steps use cache.',
      },
      {
        type: 'keypoints',
        items: [
          'Docker reuses cached layers when an instruction and its inputs match.',
          'Changing one layer invalidates all layers after it.',
          'Copy dependency manifests before the full source tree for faster rebuilds.',
          '.dockerignore keeps build contexts smaller and safer.',
        ],
      },
    ],
  },
  {
    slug: 'docker-slim-images',
    title: 'Slim & Distroless Image Mindset',
    description:
      'Choose base images intentionally and learn when slim, Alpine, scratch, or distroless images make sense.',
    level: 'intermediate',
    section: 'Better Images',
    order: 28,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A smaller image is not automatically better, but it is often easier to transfer, scan, and reason about. The goal is to include what your application needs and remove what it does not need.',
      },
      {
        type: 'p',
        text: 'Base image choice affects package availability, debugging tools, libc compatibility, security updates, and runtime behavior. Intermediate Docker users should know the tradeoffs before choosing an image only because it has the smallest size.',
      },
      { type: 'h2', text: 'Common base image choices' },
      {
        type: 'table',
        headers: ['Base style', 'Good for', 'Watch out for'],
        rows: [
          ['slim', 'Smaller Debian-based runtimes', 'May miss tools you used in full images'],
          ['alpine', 'Tiny Linux images and simple binaries', 'musl libc can surprise some native packages'],
          ['scratch', 'Static Go/Rust-style binaries', 'No shell, package manager, or CA certs unless copied'],
          ['distroless', 'Production runtimes with fewer OS tools', 'Harder interactive debugging'],
        ],
      },
      {
        type: 'code',
        language: 'dockerfile',
        title: 'Small Go runtime using scratch',
        code: `FROM golang:1.23-bookworm AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/server ./cmd/server

FROM scratch
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build /out/server /server
EXPOSE 8080
ENTRYPOINT ["/server"]`,
      },
      {
        type: 'code',
        language: 'dockerfile',
        title: 'Distroless-style Node runtime',
        code: `FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM gcr.io/distroless/nodejs22-debian12
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
CMD ["dist/server.js"]`,
      },
      {
        type: 'warning',
        text: 'Do not use tiny images to hide missing operational practices. You still need patching, image scanning, non-root users where possible, and a clear rebuild process.',
      },
      {
        type: 'tip',
        text: 'For many teams, a slim Debian image is the best default: smaller than full images but compatible with common native dependencies and easier to debug than distroless.',
      },
      {
        type: 'try',
        text: 'Build the same app with a full base image and a slim base image. Compare docker images output, startup behavior, and whether your app needs missing OS packages.',
      },
      {
        type: 'keypoints',
        items: [
          'Slim images reduce size while keeping familiar Linux behavior.',
          'Alpine is small but can have compatibility differences because it uses musl libc.',
          'scratch and distroless images are great for minimal runtimes but harder to debug.',
          'Choose images based on runtime needs, patching strategy, and team operations.',
        ],
      },
    ],
  },
  {
    slug: 'docker-healthchecks',
    title: 'HEALTHCHECK',
    description:
      'Add container health checks so Docker can report whether the process is actually ready and responsive.',
    level: 'intermediate',
    section: 'Better Images',
    order: 29,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'A running container is not always a healthy application. The process may be alive while the HTTP server is stuck, the database connection is broken, or a required background worker failed to initialize.',
      },
      {
        type: 'p',
        text: 'HEALTHCHECK defines a command Docker runs inside the container. Docker records the result as starting, healthy, or unhealthy. Compose and orchestration tools can use this signal for visibility and dependency checks.',
      },
      { type: 'h2', text: 'Add an HTTP health check' },
      {
        type: 'code',
        language: 'dockerfile',
        title: 'Dockerfile health check',
        code: `FROM node:22-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \\
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Inspect health status',
        code: `docker build -t api:health .
docker run -d --name api -p 3000:3000 api:health
docker ps
docker inspect --format '{{json .State.Health}}' api`,
      },
      { type: 'h2', text: 'Compose health check syntax' },
      {
        type: 'code',
        language: 'yaml',
        title: 'docker-compose.yml',
        code: `services:
  api:
    build: .
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:3000/health || exit 1"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s`,
      },
      {
        type: 'note',
        text: 'A health endpoint should check the minimum dependencies needed to serve traffic. Keep it fast, deterministic, and safe to call often.',
      },
      {
        type: 'tip',
        text: 'Use start_period for apps that need warm-up time. Without it, Docker may count early startup failures against the retry limit.',
      },
      {
        type: 'try',
        text: 'Add a /health endpoint to a small HTTP app, then create a failing version that returns 500. Watch docker ps change from healthy to unhealthy.',
      },
      {
        type: 'keypoints',
        items: [
          'HEALTHCHECK verifies application readiness, not just process existence.',
          'A health command exits 0 for healthy and non-zero for unhealthy.',
          'Health checks should be quick and safe to run repeatedly.',
          'Compose can define health checks even when the Dockerfile does not.',
        ],
      },
    ],
  },
  {
    slug: 'docker-compose-build',
    title: 'Build with Compose',
    description:
      'Use Compose build settings to build local images, pass build args, select Dockerfiles, and run multi-service development stacks.',
    level: 'intermediate',
    section: 'Compose Power',
    order: 30,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Compose is not only for running existing images. It can build images for your services, tag them, pass build arguments, and connect the result to other containers in the same application.',
      },
      {
        type: 'p',
        text: 'Compose V2 uses the docker compose command. It reads compose.yaml or docker-compose.yml, builds services with a build section, and then starts the stack with consistent names and networks.',
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'compose.yaml with build settings',
        code: `services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: runtime
      args:
        NODE_ENV: production
    image: ghcr.io/example/shop-api:dev
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production

  worker:
    build:
      context: .
      dockerfile: Dockerfile.worker
    image: shop-worker:dev`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Build and run with Compose V2',
        code: `docker compose build
docker compose up
docker compose up --build
docker compose build --no-cache api`,
      },
      {
        type: 'p',
        text: 'The image field is optional when build is present, but it is useful. It gives the built image a predictable name and makes docker compose push possible for registries that you can access.',
      },
      {
        type: 'note',
        text: 'Build args are available only at build time. They are not a safe place for secrets because they can appear in image history or build metadata.',
      },
      {
        type: 'tip',
        text: 'Use build.target with multi-stage Dockerfiles. Development can target a dev stage while production builds target a runtime stage from the same Dockerfile.',
      },
      {
        type: 'try',
        text: 'Create a compose.yaml with api and worker services that build from two Dockerfiles. Run docker compose build, then list the resulting images.',
      },
      {
        type: 'keypoints',
        items: [
          'Compose can build images and run containers from the same file.',
          'build.context chooses the directory sent to the Docker builder.',
          'build.dockerfile chooses which Dockerfile to use.',
          'image gives a built service a stable tag for reuse and pushing.',
        ],
      },
    ],
  },
  {
    slug: 'docker-compose-depends',
    title: 'depends_on & Startup Order',
    description:
      'Coordinate service startup in Compose and understand the difference between container start order and application readiness.',
    level: 'intermediate',
    section: 'Compose Power',
    order: 31,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Multi-container apps often have dependencies: an API needs a database, a worker needs a queue, and a proxy needs an upstream service. Compose depends_on tells Docker which services should be started before another service.',
      },
      {
        type: 'p',
        text: 'Startup order is not the same as readiness. A database container can be started while it is still accepting no connections. Use health checks when one service must wait for another to become usable.',
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'Wait for Postgres health before API startup',
        code: `services:
  db:
    image: postgres:17
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: local_password_only
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10

  api:
    build: .
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgres://app:local_password_only@db:5432/app

volumes:
  pgdata:`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Watch startup behavior',
        code: `docker compose up
docker compose ps
docker compose logs db
docker compose logs api`,
      },
      {
        type: 'warning',
        text: 'depends_on does not replace retry logic in your application. Real apps should still retry database, cache, and queue connections because dependencies can restart later.',
      },
      {
        type: 'tip',
        text: 'Use service names such as db, redis, and api as DNS hostnames inside a Compose network. Avoid localhost when one container connects to another.',
      },
      {
        type: 'try',
        text: 'Remove the healthcheck condition and start the stack several times. Compare failures with an app that waits for db:5432 and retries on connection errors.',
      },
      {
        type: 'keypoints',
        items: [
          'depends_on controls Compose service startup order.',
          'A started container may still be unready for traffic or connections.',
          'Health checks can express readiness for service_healthy dependencies.',
          'Applications should still retry connections after startup.',
        ],
      },
    ],
  },
  {
    slug: 'docker-compose-networks',
    title: 'Compose Networks',
    description:
      'Connect services with Compose networks, service-name DNS, network aliases, and frontend/backend isolation.',
    level: 'intermediate',
    section: 'Compose Power',
    order: 32,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Compose creates a default network for each project. Services on that network can reach each other by service name. For example, an api container can connect to http://web:3000 or postgres://db:5432 if services are named web and db.',
      },
      {
        type: 'p',
        text: 'Custom networks make architecture clearer. A reverse proxy may sit on a public-facing frontend network and a private backend network, while the database stays only on the backend network.',
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'Frontend and backend networks',
        code: `services:
  proxy:
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
    networks:
      - frontend
      - backend

  api:
    build: ./api
    networks:
      backend:
        aliases:
          - api.internal

  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: local_password_only
    networks:
      - backend

networks:
  frontend:
  backend:
    internal: true`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Inspect Compose networks',
        code: `docker compose up -d
docker network ls
docker network inspect "$(basename "$PWD")_backend"
docker compose exec proxy getent hosts api`,
      },
      {
        type: 'note',
        text: 'Ports are only needed when the host machine must access a service. Containers on the same Compose network can communicate without publishing ports.',
      },
      {
        type: 'tip',
        text: 'Keep databases off public networks and avoid publishing database ports unless a local developer tool really needs direct access.',
      },
      {
        type: 'try',
        text: 'Create three services named proxy, api, and db. Put db only on backend, then confirm proxy can resolve api but not db when proxy is removed from backend.',
      },
      {
        type: 'keypoints',
        items: [
          'Compose provides service-name DNS on shared networks.',
          'Custom networks document which services are allowed to communicate.',
          'Published ports expose services to the host, not to other containers.',
          'internal networks help keep backend-only services private to Docker.',
        ],
      },
    ],
  },
  {
    slug: 'docker-compose-volumes',
    title: 'Compose Volumes & Named Volumes',
    description:
      'Use bind mounts and named volumes in Compose for source code, database data, and persistent development state.',
    level: 'intermediate',
    section: 'Compose Power',
    order: 33,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Containers are disposable, but many applications need data to survive container recreation. Compose volumes let you persist database files, share generated files, or mount local source code for development.',
      },
      {
        type: 'p',
        text: 'The two common volume styles are bind mounts and named volumes. A bind mount maps a host path into a container. A named volume is managed by Docker and is usually better for database storage.',
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'Bind mount for code, named volume for Postgres',
        code: `services:
  api:
    build: .
    command: npm run dev
    volumes:
      - .:/app
      - node_modules:/app/node_modules
    ports:
      - "3000:3000"

  db:
    image: postgres:17
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: local_password_only
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  node_modules:
  pgdata:`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Manage volumes',
        code: `docker compose up -d
docker volume ls
docker volume inspect "$(basename "$PWD")_pgdata"
docker compose down
docker compose down --volumes`,
      },
      {
        type: 'warning',
        text: 'docker compose down removes containers and networks, but not named volumes unless you add --volumes. Be careful: deleting a database volume deletes local database data.',
      },
      {
        type: 'tip',
        text: 'Use a separate named volume for /app/node_modules when bind mounting Node source code. It prevents the host project folder from hiding installed container dependencies.',
      },
      {
        type: 'try',
        text: 'Start a Postgres service with a named volume, create a table, run docker compose down, then start it again. Confirm the table still exists before trying down --volumes.',
      },
      {
        type: 'keypoints',
        items: [
          'Named volumes are managed by Docker and are useful for persistent service data.',
          'Bind mounts are useful for live-editing source code in development.',
          'Container files disappear with the container unless stored in a volume.',
          'Removing volumes can permanently delete local database data.',
        ],
      },
    ],
  },
  {
    slug: 'docker-compose-profiles',
    title: 'Profiles & Overrides',
    description:
      'Use Compose profiles and override files to switch optional services and development settings on or off.',
    level: 'intermediate',
    section: 'Compose Power',
    order: 34,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Not every service belongs in every run. A developer may need Mailpit and Adminer locally, while CI needs only the API and database. Compose profiles let optional services stay in one file without always starting.',
      },
      {
        type: 'p',
        text: 'Compose also supports override files. By default, docker compose reads compose.yaml and compose.override.yaml if both exist. You can use -f to choose an explicit set of files.',
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'compose.yaml with profiles',
        code: `services:
  api:
    build: .
    ports:
      - "3000:3000"

  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: local_password_only

  adminer:
    image: adminer:4
    ports:
      - "8080:8080"
    profiles:
      - tools

  mailpit:
    image: axllent/mailpit:latest
    ports:
      - "8025:8025"
    profiles:
      - tools`,
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'compose.override.yaml for local development',
        code: `services:
  api:
    command: npm run dev
    volumes:
      - .:/app
      - node_modules:/app/node_modules
    environment:
      LOG_LEVEL: debug

volumes:
  node_modules:`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Run with profiles and files',
        code: `docker compose up
docker compose --profile tools up
docker compose -f compose.yaml -f compose.ci.yaml up --abort-on-container-exit`,
      },
      {
        type: 'note',
        text: 'Profiles are for optional services. Core dependencies such as the app database usually should not be hidden behind a profile if the app always needs them.',
      },
      {
        type: 'tip',
        text: 'Keep production Compose files explicit. Development overrides are convenient, but production settings should be easy to review without guessing which override files are active.',
      },
      {
        type: 'try',
        text: 'Add a tools profile with Adminer or Mailpit to an app stack. Start the stack with and without --profile tools and compare docker compose ps.',
      },
      {
        type: 'keypoints',
        items: [
          'Profiles let optional services stay disabled until requested.',
          'compose.override.yaml is automatically merged for local defaults.',
          'The -f flag lets you choose an explicit Compose file order.',
          'Use profiles for tools, not for required app dependencies.',
        ],
      },
    ],
  },
  {
    slug: 'docker-nodejs',
    title: 'Containerizing a Node/Express App',
    description:
      'Create a practical Dockerfile and Compose service for a Node or Express application with production dependencies and health checks.',
    level: 'intermediate',
    section: 'App Stacks',
    order: 35,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'A good Node image installs dependencies predictably, avoids copying unnecessary files, runs as a non-root user, and starts one process. Express apps are especially straightforward because the container can expose one HTTP port.',
      },
      {
        type: 'p',
        text: 'The main decision is whether the app needs a build step. TypeScript, bundlers, and frameworks usually need a build stage. A plain JavaScript Express app may only need dependency installation and source files.',
      },
      {
        type: 'code',
        language: 'dockerfile',
        title: 'Production Dockerfile for Express',
        code: `# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "dist/server.js"]`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'Minimal server shape',
        code: `import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/", (req, res) => res.send("Hello from Docker"));

app.listen(port, () => {
  console.log("listening on port", port);
});`,
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'Compose service with Postgres connection',
        code: `services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://app:local_password_only@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:17
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: local_password_only
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  pgdata:`,
      },
      {
        type: 'note',
        text: 'The container should listen on 0.0.0.0 or the default Express listen behavior. Binding only to 127.0.0.1 inside the container can make the service unreachable from outside.',
      },
      {
        type: 'tip',
        text: 'Use npm ci with a lock file for repeatable builds. Use npm install while developing locally, then commit the updated package-lock.json.',
      },
      {
        type: 'try',
        text: 'Dockerize a small Express app with a /health endpoint. Run it with docker compose up --build, then curl http://localhost:3000/health from the host.',
      },
      {
        type: 'keypoints',
        items: [
          'Use npm ci and package-lock.json for predictable Node image builds.',
          'Multi-stage builds keep TypeScript or bundler tooling out of runtime images.',
          'Run Node containers as the built-in node user when possible.',
          'Use service names, not localhost, when connecting to Compose dependencies.',
        ],
      },
    ],
  },
  {
    slug: 'docker-python',
    title: 'Containerizing a Flask/Django App',
    description:
      'Build Python web images with virtual environments, Gunicorn, environment variables, and database-backed Compose services.',
    level: 'intermediate',
    section: 'App Stacks',
    order: 36,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Python web containers should install dependencies into an isolated environment, avoid writing bytecode surprises, run a real production server, and keep application configuration in environment variables.',
      },
      {
        type: 'p',
        text: 'For Flask and Django, the image pattern is similar. Install requirements first for cache reuse, copy the app, expose the app port, and run Gunicorn rather than the development server.',
      },
      {
        type: 'code',
        language: 'dockerfile',
        title: 'Dockerfile for Flask or Django',
        code: `FROM python:3.13-slim AS runtime
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/venv/bin:$PATH"

RUN python -m venv /venv
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN adduser --disabled-password --gecos "" appuser
USER appuser

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'Example requirements.txt',
        code: `Flask
gunicorn
psycopg[binary]`,
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'Compose with Postgres',
        code: `services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      FLASK_ENV: production
      DATABASE_URL: postgres://app:local_password_only@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:17
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: local_password_only
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  pgdata:`,
      },
      {
        type: 'note',
        text: 'For Django, change the Gunicorn module from app:app to your project WSGI module, such as config.wsgi:application, and run migrations as a separate release step or one-off command.',
      },
      {
        type: 'tip',
        text: 'Set PYTHONUNBUFFERED=1 so logs appear immediately in docker logs instead of being delayed by Python output buffering.',
      },
      {
        type: 'try',
        text: 'Containerize a Flask app with /health and / routes. Add Postgres in Compose, store data in a named volume, and connect using the db hostname.',
      },
      {
        type: 'keypoints',
        items: [
          'Install Python dependencies before copying all source files for better cache use.',
          'Use Gunicorn or another production server instead of Flask or Django dev servers.',
          'Keep database files in named volumes, not inside disposable containers.',
          'Use environment variables for configuration, but do not store real secrets in tutorial files.',
        ],
      },
    ],
  },
  {
    slug: 'docker-go',
    title: 'Containerizing a Go App',
    description:
      'Build compact Go application images with multi-stage builds, static binaries, and simple Compose integration.',
    level: 'intermediate',
    section: 'App Stacks',
    order: 37,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Go is a strong fit for Docker because many Go services compile into a single binary. A build stage can include the Go toolchain, while the final image can be very small.',
      },
      {
        type: 'p',
        text: 'The safest default is a multi-stage build that downloads modules first, copies source later, compiles a Linux binary, and runs it as a non-root user in a minimal base image.',
      },
      {
        type: 'code',
        language: 'dockerfile',
        title: 'Go multi-stage Dockerfile',
        code: `# syntax=docker/dockerfile:1
FROM golang:1.23-bookworm AS build
WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/api ./cmd/api

FROM gcr.io/distroless/static-debian12
WORKDIR /
COPY --from=build /out/api /api
USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/api"]`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'Tiny HTTP server shape',
        code: `package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]bool{"ok": true})
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}`,
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'Compose service',
        code: `services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      LOG_LEVEL: info`,
      },
      {
        type: 'note',
        text: 'If your Go app uses CGO, SQLite drivers, or OS-level libraries, scratch or distroless/static may not work without extra files. Use a slim Debian runtime when compatibility matters.',
      },
      {
        type: 'tip',
        text: 'Copy go.mod and go.sum before copying the rest of the source so module downloads remain cached during ordinary code changes.',
      },
      {
        type: 'try',
        text: 'Build a Go HTTP server image, run it with docker compose up --build, and verify both /health and docker logs output.',
      },
      {
        type: 'keypoints',
        items: [
          'Go services often produce small images because the final image can contain only the binary.',
          'CGO_ENABLED=0 helps produce a static binary for minimal runtimes.',
          'Distroless images reduce shell and package-manager surface in production.',
          'Use a fuller runtime when native libraries or interactive debugging are required.',
        ],
      },
    ],
  },
  {
    slug: 'docker-nextjs',
    title: 'Containerizing a Next.js App',
    description:
      'Build Next.js images with standalone output, multi-stage installs, environment awareness, and Compose commands.',
    level: 'intermediate',
    section: 'App Stacks',
    order: 38,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Next.js apps need a slightly different Docker approach than a plain Node app. The build step creates server output, static assets, and metadata. The runtime image should contain only the files needed to run next start or standalone server output.',
      },
      {
        type: 'p',
        text: 'For production containers, standalone output is usually the cleanest option. It traces required files into .next/standalone so the final image does not need the full source tree.',
      },
      {
        type: 'code',
        language: 'text',
        title: 'next.config.js',
        code: `module.exports = {
  output: "standalone",
};`,
      },
      {
        type: 'code',
        language: 'dockerfile',
        title: 'Dockerfile for Next.js standalone output',
        code: `# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/.next/standalone ./

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]`,
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'Compose for local production-like run',
        code: `services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_BASE_URL: http://localhost:3000/api`,
      },
      {
        type: 'warning',
        text: 'Values used by NEXT_PUBLIC_ variables can be embedded into browser JavaScript at build time. Do not put secrets in NEXT_PUBLIC_ variables or client-side config.',
      },
      {
        type: 'tip',
        text: 'If you need different API URLs per environment, decide which values are build-time and which are runtime. Next.js does not treat every environment variable the same way.',
      },
      {
        type: 'try',
        text: 'Enable standalone output in a Next.js app, build the image, run it with Compose, and confirm the container starts with node server.js instead of npm run dev.',
      },
      {
        type: 'keypoints',
        items: [
          'Next.js production images usually need a build stage and a smaller runtime stage.',
          'output: standalone creates a traced server bundle for containers.',
          'NEXT_PUBLIC_ variables are visible to browser code and are not secrets.',
          'Use production commands in production images, not npm run dev.',
        ],
      },
    ],
  },
  {
    slug: 'docker-postgres',
    title: 'Postgres in Docker',
    description:
      'Run Postgres with Compose using named volumes, local-only credentials, health checks, init scripts, and safe persistence expectations.',
    level: 'intermediate',
    section: 'App Stacks',
    order: 39,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Postgres is commonly run in Docker for development and integration tests. The official image reads environment variables on first initialization and stores database files in /var/lib/postgresql/data.',
      },
      {
        type: 'p',
        text: 'Persistence is the essential detail. If database files live only inside a container, they disappear when the container is removed. Use a named volume for local data you want to keep.',
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'Postgres service with named volume',
        code: `services:
  db:
    image: postgres:17
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: local_password_only
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./db/init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  pgdata:`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'db/init/001-create-table.sql',
        code: `CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Connect and inspect',
        code: `docker compose up -d db
docker compose exec db psql -U app -d app
docker compose logs db
docker volume ls`,
      },
      {
        type: 'warning',
        text: 'POSTGRES_PASSWORD in a Compose tutorial is for local development only. Do not commit real production passwords to Compose files, images, or git history.',
      },
      {
        type: 'tip',
        text: 'Init scripts in /docker-entrypoint-initdb.d run only when the database directory is empty. If you keep the named volume, changing an init script will not rerun it automatically.',
      },
      {
        type: 'try',
        text: 'Start Postgres with a named volume and an init SQL file. Insert a row, restart the container, and confirm the data survives. Then document what down --volumes would do.',
      },
      {
        type: 'keypoints',
        items: [
          'The official Postgres image initializes from environment variables only on first data directory creation.',
          'Named volumes keep database data after containers are recreated.',
          'Init scripts are useful for local schemas and seed data but are not a migration system.',
          'Never place real secrets in committed Compose examples.',
        ],
      },
    ],
  },
  {
    slug: 'docker-mongodb',
    title: 'MongoDB in Docker',
    description:
      'Run MongoDB with Compose, named volumes, local credentials, initialization scripts, and connection strings for app containers.',
    level: 'intermediate',
    section: 'App Stacks',
    order: 40,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'MongoDB is also easy to run locally in Docker. Like databases in general, the important parts are persistent storage, predictable local credentials, and a connection string that uses the Compose service name from app containers.',
      },
      {
        type: 'p',
        text: 'The official image can create a root user from environment variables on first startup. Application-specific users and seed data can be created with scripts in /docker-entrypoint-initdb.d.',
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'MongoDB with named volume',
        code: `services:
  mongo:
    image: mongo:8
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: local_password_only
      MONGO_INITDB_DATABASE: app
    volumes:
      - mongodata:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "mongosh --quiet --eval 'db.adminCommand({ ping: 1 }).ok' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10

volumes:
  mongodata:`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'mongo-init/001-seed.js',
        code: `db = db.getSiblingDB("app");

db.products.insertOne({
  name: "Docker Mug",
  price: 12.5,
  createdAt: new Date()
});`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'Container-to-container connection string',
        code: `mongodb://root:local_password_only@mongo:27017/app?authSource=admin`,
      },
      {
        type: 'warning',
        text: 'Do not publish MongoDB to the host or use weak credentials in shared environments. The example password is intentionally fake and local-only.',
      },
      {
        type: 'tip',
        text: 'If an init script does not seem to run, check whether the named volume already contains a database. Initialization scripts run only when Mongo creates the data directory.',
      },
      {
        type: 'try',
        text: 'Start MongoDB with a named volume and seed script. Query the seeded document with docker compose exec mongo mongosh, then restart and confirm it persists.',
      },
      {
        type: 'keypoints',
        items: [
          'MongoDB stores persistent files in /data/db, which should use a named volume.',
          'MONGO_INITDB_* variables initialize users and databases on first startup.',
          'App containers should connect to the mongo service name, not localhost.',
          'Initialization scripts are not rerun when an existing volume is reused.',
        ],
      },
    ],
  },
  {
    slug: 'docker-nginx',
    title: 'Nginx Reverse Proxy Basics',
    description:
      'Place Nginx in front of app containers with Compose, upstream service names, static headers, and simple local routing.',
    level: 'intermediate',
    section: 'App Stacks',
    order: 41,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'A reverse proxy receives client requests and forwards them to one or more backend services. In Docker Compose, Nginx can route traffic to containers by service name on the shared network.',
      },
      {
        type: 'p',
        text: 'This is useful for local stacks that resemble production: one public port, multiple internal services, and clear routing rules. It also introduces concepts used later with TLS, load balancing, and ingress controllers.',
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'Compose with Nginx and API',
        code: `services:
  proxy:
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - api

  api:
    build: ./api
    expose:
      - "3000"`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'nginx.conf',
        code: `server {
  listen 80;

  location / {
    proxy_pass http://api:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /nginx-health {
    access_log off;
    return 200 "ok\\n";
  }
}`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Run and test the proxy',
        code: `docker compose up --build
curl http://localhost:8080/
curl http://localhost:8080/nginx-health
docker compose logs proxy`,
      },
      {
        type: 'note',
        text: 'The api service uses expose instead of ports because only Nginx needs to reach it. The host machine reaches the stack through the proxy port.',
      },
      {
        type: 'tip',
        text: 'When debugging Nginx routing, first exec into the proxy container and test whether the upstream service name resolves and responds from inside the network.',
      },
      {
        type: 'try',
        text: 'Add a second service named web and route /api to api while routing / to web. Keep only Nginx published to the host.',
      },
      {
        type: 'keypoints',
        items: [
          'Nginx can proxy to Compose services using service-name DNS.',
          'Only the reverse proxy needs a published host port in a basic local stack.',
          'expose documents internal ports without publishing them to the host.',
          'Proxy headers preserve useful request information for backend apps.',
        ],
      },
    ],
  },
  {
    slug: 'docker-registry',
    title: 'Registries & docker push/pull',
    description:
      'Understand image registries, repository names, authentication, pulling base images, and pushing your own tags.',
    level: 'intermediate',
    section: 'Delivery',
    order: 42,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A registry stores and distributes Docker images. Docker Hub, GitHub Container Registry, GitLab Container Registry, and cloud registries all serve the same basic purpose: push images from a build machine and pull them where they need to run.',
      },
      {
        type: 'p',
        text: 'An image name usually contains a registry host, namespace, repository, and tag. If no registry is written, Docker defaults to Docker Hub.',
      },
      {
        type: 'code',
        language: 'text',
        title: 'Image name anatomy',
        code: `ghcr.io/acme/shop-api:1.4.2
|------| |--| |------| |---|
registry namespace repo    tag`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Build, tag, push, and pull',
        code: `docker build -t shop-api:dev .
docker tag shop-api:dev ghcr.io/acme/shop-api:dev
docker login ghcr.io
docker push ghcr.io/acme/shop-api:dev
docker pull ghcr.io/acme/shop-api:dev`,
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'Compose using a registry image',
        code: `services:
  api:
    image: ghcr.io/acme/shop-api:1.4.2
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production`,
      },
      {
        type: 'note',
        text: 'docker push uploads layers that the registry does not already have. If two tags share layers, the second push is often much faster.',
      },
      {
        type: 'tip',
        text: 'Use a personal access token or registry-specific credential for docker login. Avoid typing real credentials into shared scripts or committed documentation.',
      },
      {
        type: 'try',
        text: 'Build a local image, tag it with a registry-style name, and inspect docker image ls. If you have a safe test registry, push and pull it back on the same machine.',
      },
      {
        type: 'keypoints',
        items: [
          'Registries store image repositories and tags.',
          'docker pull downloads image layers; docker push uploads image layers.',
          'A full image name can include registry host, namespace, repository, and tag.',
          'Authenticate with safe credentials before pushing to private registries.',
        ],
      },
    ],
  },
  {
    slug: 'docker-tags-versions',
    title: 'Tagging & Versioning Images',
    description:
      'Create image tags that support releases, rollbacks, CI builds, and human-friendly development workflows.',
    level: 'intermediate',
    section: 'Delivery',
    order: 43,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'A tag is a movable label that points to an image version. Tags such as latest, dev, 1.4.2, and sha-abc123 can all point to images in the same repository.',
      },
      {
        type: 'p',
        text: 'Good tagging makes deployments understandable. You want tags that humans can read and tags that machines can trace back to an exact source commit or build.',
      },
      {
        type: 'table',
        headers: ['Tag style', 'Example', 'Use'],
        rows: [
          ['Semantic version', '1.4.2', 'Product releases'],
          ['Major/minor alias', '1.4', 'Controlled update channel'],
          ['Git SHA', 'sha-a1b2c3d', 'Traceable CI builds'],
          ['Environment', 'staging', 'Mutable deployment target'],
        ],
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Apply multiple tags to the same image',
        code: `IMAGE=ghcr.io/acme/shop-api
VERSION=1.4.2
GIT_SHA=sha-a1b2c3d

docker build -t "$IMAGE:$VERSION" -t "$IMAGE:$GIT_SHA" .
docker push "$IMAGE:$VERSION"
docker push "$IMAGE:$GIT_SHA"`,
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'Compose with configurable tag',
        code: `services:
  api:
    image: ghcr.io/acme/shop-api:\${APP_TAG:-dev}
    ports:
      - "3000:3000"`,
      },
      {
        type: 'warning',
        text: 'Do not depend on latest for repeatable deployments. latest is only a tag name, not a guarantee that the newest or safest image will run.',
      },
      {
        type: 'tip',
        text: 'Push an immutable tag such as a Git SHA for every CI build, then optionally add friendly release tags that point to the same image digest.',
      },
      {
        type: 'try',
        text: 'Build one image with two tags: a version tag and a fake Git SHA tag. Use docker image inspect to compare their image IDs.',
      },
      {
        type: 'keypoints',
        items: [
          'Tags are labels that can move unless your registry enforces immutability.',
          'Use version tags for releases and commit tags for traceability.',
          'Avoid latest for production rollbacks and auditability.',
          'Compose can substitute image tags from environment variables.',
        ],
      },
    ],
  },
  {
    slug: 'docker-secrets-env',
    title: 'Secrets vs Env Files (Practical Safety)',
    description:
      'Handle configuration, env files, and local-only secrets responsibly without pretending Compose env files are a production secret manager.',
    level: 'intermediate',
    section: 'Delivery',
    order: 44,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Environment variables are convenient for configuration, but they are not automatically secret. Values can appear in shell history, process inspection, Compose output, crash logs, and copied example files.',
      },
      {
        type: 'p',
        text: 'For local development, .env and env_file are practical. For real production secrets, use your platform secret store, Docker secrets where supported, or a managed secret system from your orchestrator or cloud provider.',
      },
      {
        type: 'code',
        language: 'text',
        title: '.env.example',
        code: `POSTGRES_DB=app
POSTGRES_USER=app
POSTGRES_PASSWORD=replace_with_local_password
API_PORT=3000`,
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'Compose using env_file for local config',
        code: `services:
  api:
    build: .
    env_file:
      - .env
    ports:
      - "\${API_PORT:-3000}:3000"
    depends_on:
      - db

  db:
    image: postgres:17
    env_file:
      - .env
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`,
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'File-mounted secret pattern for local demos',
        code: `services:
  api:
    image: example/api:dev
    environment:
      API_KEY_FILE: /run/secrets/api_key
    volumes:
      - ./secrets/api_key.txt:/run/secrets/api_key:ro`,
      },
      {
        type: 'warning',
        text: 'Add .env and local secret files to .gitignore. Commit .env.example with fake placeholders so teammates know which variables are required.',
      },
      {
        type: 'tip',
        text: 'Prefer passing secret file paths over secret values when your application supports it. Files are still sensitive, but they are less likely to be printed by normal env inspection.',
      },
      {
        type: 'try',
        text: 'Create a .env.example, copy it to .env locally, and update Compose to use env_file. Confirm docker compose config expands expected values without committing .env.',
      },
      {
        type: 'keypoints',
        items: [
          'Environment variables are configuration, not a complete secret-management strategy.',
          '.env files are useful locally but should not contain real committed secrets.',
          'Commit .env.example with placeholder values and documentation.',
          'Use platform secret stores for production deployments.',
        ],
      },
    ],
  },
  {
    slug: 'docker-debug',
    title: 'Debugging Containers',
    description:
      'Use docker logs, exec, inspect, events, exit codes, and temporary debug containers to find container problems.',
    level: 'intermediate',
    section: 'Operations',
    order: 45,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Container debugging starts with evidence. Check whether the container is running, inspect the exit code, read logs, and verify the command the container actually started.',
      },
      {
        type: 'p',
        text: 'A common mistake is to jump into the container first. Interactive shells are useful, but many minimal images do not include a shell. Docker metadata and logs often explain the problem faster.',
      },
      {
        type: 'code',
        language: 'bash',
        title: 'First debugging commands',
        code: `docker ps -a
docker logs --tail=100 api
docker inspect api
docker inspect --format '{{.State.ExitCode}} {{.State.Error}}' api
docker events --since 10m`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Enter a running container',
        code: `docker exec -it api sh
docker exec api env
docker exec api ps aux
docker exec api ls -la /app`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Debug from the same network',
        code: `docker network ls
docker run --rm -it --network myproject_default alpine:3.20 sh
apk add --no-cache curl bind-tools
curl http://api:3000/health
nslookup db`,
      },
      {
        type: 'note',
        text: 'If a container exits immediately, docker exec will not work because there is no running process to enter. Use docker logs and docker inspect first.',
      },
      {
        type: 'tip',
        text: 'For distroless or scratch images, debug by running a separate toolbox container on the same network or by building a temporary debug target that includes a shell.',
      },
      {
        type: 'try',
        text: 'Break an app container by setting a bad command. Use docker ps -a, docker logs, and docker inspect to identify the exit code and command failure.',
      },
      {
        type: 'keypoints',
        items: [
          'Start debugging with ps, logs, inspect, and exit codes.',
          'docker exec only works when the container is running.',
          'Minimal production images may not include shells or package managers.',
          'A temporary toolbox container can test DNS and HTTP from the same network.',
        ],
      },
    ],
  },
  {
    slug: 'docker-logs-monitoring',
    title: 'Logs & Basic Monitoring',
    description:
      'Read container logs, follow Compose output, add useful application logs, and inspect basic runtime statistics.',
    level: 'intermediate',
    section: 'Operations',
    order: 46,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Containers work best when applications write logs to stdout and stderr. Docker captures those streams so you can read them with docker logs, Compose logs, or a platform logging system.',
      },
      {
        type: 'p',
        text: 'Basic monitoring starts with logs, health status, restart counts, CPU, memory, and network activity. These signals will not replace a production observability stack, but they are enough to diagnose many local and staging issues.',
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Read logs',
        code: `docker logs api
docker logs --follow --tail=50 api
docker compose logs
docker compose logs -f api db`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Check runtime stats and health',
        code: `docker stats
docker stats --no-stream
docker compose ps
docker inspect --format '{{.RestartCount}} {{.State.Health.Status}}' api`,
      },
      {
        type: 'code',
        language: 'json',
        title: 'Structured log example',
        code: `{
  "level": "info",
  "message": "request completed",
  "method": "GET",
  "path": "/api/products",
  "status": 200,
  "duration_ms": 18
}`,
      },
      {
        type: 'note',
        text: 'Docker logs are easiest to collect when each container runs one main process and that process writes directly to stdout and stderr.',
      },
      {
        type: 'tip',
        text: 'Prefer structured logs for services that will eventually run outside your laptop. They are easier to search, parse, and aggregate.',
      },
      {
        type: 'try',
        text: 'Run a Compose app, make a few HTTP requests, then use docker compose logs -f and docker stats --no-stream to connect requests with resource usage.',
      },
      {
        type: 'keypoints',
        items: [
          'Containers should write logs to stdout and stderr.',
          'docker logs and docker compose logs are the first places to inspect behavior.',
          'docker stats gives a quick view of CPU, memory, and network usage.',
          'Structured logs make later monitoring and troubleshooting easier.',
        ],
      },
    ],
  },
  {
    slug: 'docker-resources',
    title: 'CPU/Memory Limits',
    description:
      'Set container CPU and memory limits, understand reservations, and test how apps behave under resource pressure.',
    level: 'intermediate',
    section: 'Operations',
    order: 47,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Containers share the host kernel and host resources. Without limits, a busy or broken container can consume too much CPU or memory and affect other workloads on the same machine.',
      },
      {
        type: 'p',
        text: 'Resource settings help make local testing more realistic and protect shared hosts. They also reveal whether an app handles memory pressure, slow CPU, or restarts gracefully.',
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Run with resource limits',
        code: `docker run --rm --memory=256m --cpus=0.5 nginx:1.27-alpine
docker run --rm --memory=128m --memory-swap=128m alpine:3.20 sh -c "echo limited && sleep 30"`,
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'Compose resource settings',
        code: `services:
  api:
    image: example/api:dev
    ports:
      - "3000:3000"
    mem_limit: 512m
    cpus: 0.75
    restart: unless-stopped`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Observe limits and restarts',
        code: `docker compose up -d
docker stats --no-stream
docker inspect --format '{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}}' myproject-api-1
docker compose ps`,
      },
      {
        type: 'warning',
        text: 'If a container exceeds its memory limit, the kernel may kill the process. From Docker you may see exit code 137, which often indicates an out-of-memory kill.',
      },
      {
        type: 'tip',
        text: 'Set limits during performance testing, then watch logs and exit codes. A graceful app should fail visibly and recover cleanly instead of silently corrupting work.',
      },
      {
        type: 'try',
        text: 'Run a memory-hungry test container with a small memory limit. Observe docker stats, the exit code, and whether a Compose restart policy restarts it.',
      },
      {
        type: 'keypoints',
        items: [
          'CPU and memory limits protect hosts and make tests more realistic.',
          'Memory limit failures often appear as exit code 137.',
          'docker stats shows live resource usage for running containers.',
          'Restart policies should be paired with good logs and health checks.',
        ],
      },
    ],
  },
  {
    slug: 'docker-cleanup',
    title: 'Prune, Disk Use & Cleanup',
    description:
      'Clean Docker images, containers, volumes, and build cache safely while understanding what data each command can delete.',
    level: 'intermediate',
    section: 'Operations',
    order: 48,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Docker can use a lot of disk over time. Old images, stopped containers, unused networks, dangling layers, build cache, and forgotten volumes all take space.',
      },
      {
        type: 'p',
        text: 'Cleanup commands are useful, but they can delete important local data. The safest habit is to inspect disk usage first, prune narrowly, and treat volume deletion as a separate decision.',
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Inspect Docker disk usage',
        code: `docker system df
docker system df -v
docker image ls
docker container ls -a
docker volume ls`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Common cleanup commands',
        code: `docker container prune
docker image prune
docker builder prune
docker network prune
docker system prune`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'More aggressive cleanup',
        code: `docker image prune -a
docker system prune -a
docker volume prune
docker compose down --volumes`,
      },
      {
        type: 'warning',
        text: 'docker volume prune and docker compose down --volumes can delete database files and other persistent local state. Make backups or confirm the data is disposable before running them.',
      },
      {
        type: 'tip',
        text: 'Use labels for long-running projects if you need targeted cleanup later. For example, Compose automatically labels resources with the project name.',
      },
      {
        type: 'try',
        text: 'Run docker system df, remove one stopped container, prune build cache, then run docker system df again. Do not prune volumes unless you intentionally created disposable test data.',
      },
      {
        type: 'keypoints',
        items: [
          'Inspect Docker disk usage before deleting resources.',
          'Prune commands remove unused resources, but each command has a different scope.',
          'Build cache can be removed separately with docker builder prune.',
          'Volume cleanup is risky because volumes often contain database data.',
        ],
      },
    ],
  },
];
