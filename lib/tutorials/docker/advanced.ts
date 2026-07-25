import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'docker-security',
    title: 'Docker Security Essentials',
    description:
      'Learn the production security habits that keep Docker images, containers, networks, and secrets safer.',
    level: 'advanced',
    section: 'Production Ready',
    order: 49,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Docker security is not one setting. It is a set of habits across your Dockerfile, image registry, runtime flags, host, network, secrets, CI pipeline, and production deployment process.',
      },
      {
        type: 'p',
        text: 'The goal is simple: if an attacker reaches your app, the container should limit what they can see, change, install, execute, or reach next.',
      },
      { type: 'h2', text: 'The container security model' },
      {
        type: 'ul',
        items: [
          'Images are templates. A vulnerable package in an image becomes a vulnerable package in every container made from it.',
          'Containers share the host kernel. Isolation is strong, but it is not the same as a full virtual machine boundary.',
          'Runtime privileges matter. A secure image can become risky when run as root with broad capabilities, writable mounts, or host networking.',
          'Supply chain matters. Base images, package downloads, build scripts, and CI credentials are all part of the trust chain.',
        ],
      },
      { type: 'h2', text: 'Start with a safer Dockerfile' },
      {
        type: 'code',
        title: 'Production-minded Dockerfile',
        language: 'dockerfile',
        code: `FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Create a dedicated user instead of running the app as root.
RUN groupadd --system app && useradd --system --gid app --home /app app

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=app:app . .

USER app
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        type: 'p',
        text: 'This example uses a slim official base image, installs production dependencies, creates an application user, copies files with the right owner, and starts with a direct command.',
      },
      { type: 'h2', text: 'Run with least privilege' },
      {
        type: 'code',
        title: 'Safer docker run defaults',
        language: 'bash',
        code: `docker run --rm \\
  --name web \\
  --read-only \\
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --cap-drop ALL \\
  --security-opt no-new-privileges:true \\
  --memory 512m \\
  --cpus 1 \\
  -p 8080:3000 \\
  my-web:1.0`,
      },
      {
        type: 'table',
        headers: ['Option', 'Why it matters'],
        rows: [
          ['--read-only', 'Stops the app from writing unexpected files into the container filesystem.'],
          ['--tmpfs /tmp', 'Allows temporary files without making the whole container writable.'],
          ['--cap-drop ALL', 'Removes Linux capabilities your app usually does not need.'],
          ['no-new-privileges', 'Prevents privilege escalation through setuid binaries.'],
          ['--memory and --cpus', 'Limits damage from runaway processes or accidental overload.'],
        ],
      },
      { type: 'h2', text: 'Keep secrets out of images' },
      {
        type: 'warning',
        text: 'Never bake API keys, database passwords, SSH keys, cloud credentials, or .env files into an image. Anyone with image access can inspect layers.',
      },
      {
        type: 'code',
        title: 'Bad: secret becomes part of image history',
        language: 'dockerfile',
        code: `FROM node:22-bookworm-slim
WORKDIR /app
COPY . .
ENV API_KEY=super-secret-value
CMD ["node", "server.js"]`,
      },
      {
        type: 'code',
        title: 'Better: pass secrets at runtime',
        language: 'bash',
        code: `docker run --rm \\
  --env-file .env.production \\
  my-api:1.0`,
      },
      {
        type: 'p',
        text: 'In real production environments, use your platform secret manager: GitHub Actions secrets, Docker Swarm secrets, Kubernetes Secrets with external secret stores, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, Vault, or another approved system.',
      },
      { type: 'h2', text: 'Use a .dockerignore file' },
      {
        type: 'code',
        title: '.dockerignore',
        language: 'text',
        code: `node_modules
.git
.env
.env.*
coverage
dist
*.log
Dockerfile*
compose*.yaml
README.md`,
      },
      {
        type: 'p',
        text: 'A good .dockerignore reduces build time and prevents accidental files from entering the build context. It is a security feature and a performance feature.',
      },
      { type: 'h2', text: 'Pin and update base images thoughtfully' },
      {
        type: 'ul',
        items: [
          'Avoid floating production tags like latest because rebuilds may change without review.',
          'Use specific major versions such as node:22-bookworm-slim, python:3.12-slim, or nginx:1.27-alpine when they fit your team policy.',
          'For highly controlled environments, pin by digest and automate digest updates.',
          'Rebuild images regularly so patched base layers are picked up.',
        ],
      },
      {
        type: 'code',
        title: 'Digest pinning example',
        language: 'dockerfile',
        code: `FROM nginx:1.27-alpine@sha256:exampledigestvalue`,
      },
      {
        type: 'note',
        text: 'Digest pinning improves reproducibility, but you must still update the digest when security patches are released.',
      },
      { type: 'h2', text: 'Network security basics' },
      {
        type: 'ul',
        items: [
          'Publish only the ports users or other systems must reach.',
          'Keep databases and queues on private Docker networks without host port publishing.',
          'Use reverse proxies or load balancers as the public entry point.',
          'Do not use --network host unless you understand the host-level exposure.',
        ],
      },
      {
        type: 'code',
        title: 'Private database in Compose',
        language: 'yaml',
        code: `services:
  api:
    image: my-api:1.0
    ports:
      - "8080:8080"
    networks:
      - frontend
      - backend

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: change-me
    networks:
      - backend

networks:
  frontend:
  backend:
    internal: true`,
      },
      { type: 'h2', text: 'Production security checklist' },
      {
        type: 'keypoints',
        items: [
          'Use minimal trusted base images and rebuild them regularly.',
          'Run application processes as non-root users.',
          'Drop unnecessary capabilities and avoid privileged containers.',
          'Keep secrets out of Dockerfiles, image layers, Git, and logs.',
          'Scan images and fail builds for unacceptable vulnerabilities.',
          'Publish only required ports and keep internal services private.',
          'Use read-only filesystems and explicit writable temp or data paths.',
          'Add resource limits so one container cannot consume the whole host.',
        ],
      },
      {
        type: 'try',
        text: 'Pick one Dockerfile you have written. Add a .dockerignore file, switch to a non-root user, and list which runtime flags you would use in production.',
      },
    ],
  },
  {
    slug: 'docker-nonroot',
    title: 'Non-root Users & Least Privilege',
    description:
      'Build images and run containers so applications have only the permissions they actually need.',
    level: 'advanced',
    section: 'Production Ready',
    order: 50,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Most official images start as root during build because package installation and file ownership changes need elevated privileges. Production containers should usually switch to a dedicated unprivileged user before the app starts.',
      },
      {
        type: 'p',
        text: 'Least privilege means every process gets the minimum file permissions, Linux capabilities, network access, and system access required to do its job.',
      },
      { type: 'h2', text: 'Why root in a container is still risky' },
      {
        type: 'ul',
        items: [
          'A root process can modify files in writable container layers and mounted volumes.',
          'If a dangerous host path is mounted, root inside the container may change host files.',
          'Some kernel or runtime vulnerabilities are more damaging when the process is privileged.',
          'A root process may install tools that help an attacker explore the environment.',
        ],
      },
      { type: 'h2', text: 'Create a user in Debian or Ubuntu based images' },
      {
        type: 'code',
        title: 'Node app with a system user',
        language: 'dockerfile',
        code: `FROM node:22-bookworm-slim
WORKDIR /app

RUN groupadd --system app && useradd --system --gid app --home /app app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --chown=app:app . .

USER app
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      { type: 'h2', text: 'Create a user in Alpine based images' },
      {
        type: 'code',
        title: 'Alpine app user',
        language: 'dockerfile',
        code: `FROM python:3.12-alpine
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=app:app . .

USER app
CMD ["python", "app.py"]`,
      },
      {
        type: 'note',
        text: 'Some official images already include a non-root user. For example, the Node image has a node user. You can use it when it fits your file ownership needs.',
      },
      { type: 'h2', text: 'Use numeric users when platforms require them' },
      {
        type: 'p',
        text: 'Some production platforms prefer or require numeric user IDs because names inside /etc/passwd may not exist or may be replaced at runtime.',
      },
      {
        type: 'code',
        title: 'Numeric UID and GID',
        language: 'dockerfile',
        code: `FROM node:22-bookworm-slim
WORKDIR /app

RUN groupadd --gid 10001 app && useradd --uid 10001 --gid 10001 --home /app app
COPY --chown=10001:10001 . .

USER 10001:10001
CMD ["node", "server.js"]`,
      },
      { type: 'h2', text: 'Fix file permission problems' },
      {
        type: 'p',
        text: 'The most common non-root error is a permission denied message when the app writes logs, uploads, caches, compiled assets, or temporary files.',
      },
      {
        type: 'code',
        title: 'Prepare writable directories',
        language: 'dockerfile',
        code: `FROM node:22-bookworm-slim
WORKDIR /app

RUN groupadd --system app && useradd --system --gid app --home /app app
RUN mkdir -p /app/tmp /app/uploads && chown -R app:app /app

COPY package*.json ./
RUN npm ci --omit=dev
COPY --chown=app:app . .

USER app
ENV TMPDIR=/app/tmp
CMD ["node", "server.js"]`,
      },
      {
        type: 'warning',
        text: 'Do not solve permission errors by switching back to root. First identify the exact path that must be writable, then grant ownership only to that path.',
      },
      { type: 'h2', text: 'Combine USER with runtime restrictions' },
      {
        type: 'code',
        title: 'Least privilege run command',
        language: 'bash',
        code: `docker run --rm \\
  --user 10001:10001 \\
  --read-only \\
  --tmpfs /tmp:rw,size=64m \\
  --cap-drop ALL \\
  --security-opt no-new-privileges:true \\
  my-app:secure`,
      },
      {
        type: 'p',
        text: 'The USER instruction sets the default user in the image. The --user flag can override it at runtime. In production, keep both the image and deployment manifest explicit.',
      },
      { type: 'h2', text: 'Capabilities: root is not the only permission' },
      {
        type: 'p',
        text: 'Linux capabilities split root powers into smaller permissions. Many web apps do not need extra capabilities. Dropping all capabilities is often a good starting point.',
      },
      {
        type: 'table',
        headers: ['Capability', 'Typical reason', 'Safer default'],
        rows: [
          ['NET_BIND_SERVICE', 'Bind to ports below 1024', 'Use port 8080 inside the container and map 80 outside.'],
          ['SYS_ADMIN', 'Very broad admin operations', 'Avoid for normal apps. This is often too powerful.'],
          ['NET_ADMIN', 'Change network settings', 'Avoid unless building networking tools.'],
          ['CHOWN', 'Change file owners', 'Usually needed during build, not runtime.'],
        ],
      },
      { type: 'h2', text: 'Least privilege checklist' },
      {
        type: 'keypoints',
        items: [
          'Create or use a dedicated non-root user for the application process.',
          'Copy files with --chown so the app can read what it needs.',
          'Create only the writable directories the app needs.',
          'Prefer high internal ports such as 3000, 5000, or 8080.',
          'Drop Linux capabilities and add back only what is justified.',
          'Avoid host path mounts for production unless they are carefully controlled.',
        ],
      },
      {
        type: 'try',
        text: 'Run your app image with --read-only and a non-root user. Every failure reveals a file path or assumption you should make explicit.',
      },
    ],
  },
  {
    slug: 'docker-scan',
    title: 'Image Scanning Mindset',
    description:
      'Understand vulnerability scanning, severity, false positives, and how to make scanning useful in real teams.',
    level: 'advanced',
    section: 'Production Ready',
    order: 51,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Image scanning compares the packages in your image with vulnerability databases. It helps you find known risks before images reach production.',
      },
      {
        type: 'p',
        text: 'A scanner is not a magic security button. It is a signal. Teams need policy, triage, ownership, and regular rebuilds for scanning to reduce risk.',
      },
      { type: 'h2', text: 'What scanners inspect' },
      {
        type: 'ul',
        items: [
          'Operating system packages such as openssl, curl, libc, and zlib.',
          'Language packages such as npm, PyPI, Maven, RubyGems, NuGet, and Go modules.',
          'Image metadata, exposed ports, default users, secrets, and sometimes Dockerfile patterns.',
          'Software bill of materials data, often called an SBOM.',
        ],
      },
      { type: 'h2', text: 'Common scanning tools' },
      {
        type: 'table',
        headers: ['Tool', 'Good for'],
        rows: [
          ['Docker Scout', 'Docker Desktop and Docker Hub workflows with base image recommendations.'],
          ['Trivy', 'Fast local and CI scanning for images, filesystems, repos, and SBOMs.'],
          ['Grype', 'Image and SBOM vulnerability scanning from Anchore.'],
          ['Snyk', 'Developer-friendly dependency and container scanning with policy features.'],
          ['GitHub Dependabot', 'Dependency alerts and pull requests for many ecosystems.'],
        ],
      },
      { type: 'h2', text: 'Run a local scan' },
      {
        type: 'code',
        title: 'Trivy image scan',
        language: 'bash',
        code: `docker build -t my-api:scan .
trivy image my-api:scan`,
      },
      {
        type: 'code',
        title: 'Fail on critical vulnerabilities',
        language: 'bash',
        code: `trivy image \\
  --severity CRITICAL \\
  --exit-code 1 \\
  my-api:scan`,
      },
      {
        type: 'note',
        text: 'Many scanners need internet access to update vulnerability databases. CI should cache scanner databases when possible to avoid slow or flaky builds.',
      },
      { type: 'h2', text: 'How to read scan results' },
      {
        type: 'ol',
        items: [
          'Find whether the vulnerable package is from the base image, OS package manager, or application dependencies.',
          'Check whether a fixed version exists. Some results are real but not yet fixable.',
          'Check whether the vulnerable code path is reachable in your app.',
          'Prioritize internet-facing services, authentication paths, parsers, crypto, and remote code execution risks.',
          'Create an owner and due date for accepted risk instead of ignoring it forever.',
        ],
      },
      { type: 'h2', text: 'Reduce scan noise with better images' },
      {
        type: 'code',
        title: 'Multi-stage build with fewer runtime packages',
        language: 'dockerfile',
        code: `FROM golang:1.23-bookworm AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/server ./cmd/server

FROM gcr.io/distroless/static-debian12
COPY --from=build /out/server /server
USER nonroot:nonroot
ENTRYPOINT ["/server"]`,
      },
      {
        type: 'p',
        text: 'Small runtime images usually contain fewer packages, which means fewer vulnerabilities, faster transfers, and a smaller attack surface.',
      },
      { type: 'h2', text: 'Create an SBOM' },
      {
        type: 'p',
        text: 'An SBOM lists the software inside your image. It helps security teams answer: What are we running? Where is a vulnerable package deployed?',
      },
      {
        type: 'code',
        title: 'Generate an SBOM with Syft',
        language: 'bash',
        code: `syft my-api:scan -o spdx-json > sbom.spdx.json`,
      },
      {
        type: 'code',
        title: 'Scan an SBOM with Grype',
        language: 'bash',
        code: `grype sbom:sbom.spdx.json`,
      },
      { type: 'h2', text: 'CI policy example' },
      {
        type: 'code',
        title: 'Simple scanning policy',
        language: 'text',
        code: `Pull requests:
- Fail on critical vulnerabilities with known fixes.
- Warn on high vulnerabilities.
- Upload scan report as an artifact.

Main branch:
- Fail on critical vulnerabilities.
- Publish SBOM with image.
- Create issues for accepted high vulnerabilities.

Production release:
- Require signed image, scan report, and rollback tag.`,
      },
      {
        type: 'warning',
        text: 'Do not hide scan failures by disabling the scanner. If a vulnerability must be accepted temporarily, document the reason, owner, expiration date, and compensating controls.',
      },
      {
        type: 'keypoints',
        items: [
          'Scanning is part of supply-chain security, not a replacement for secure coding.',
          'Small, frequently rebuilt images produce fewer and fresher findings.',
          'A useful policy separates critical fixable issues from noisy low-risk findings.',
          'SBOMs help teams understand what they ship and respond quickly to new CVEs.',
        ],
      },
    ],
  },
  {
    slug: 'docker-cicd',
    title: 'Docker in CI/CD Pipelines',
    description:
      'Build, test, scan, tag, and publish Docker images from automated pipelines with production-friendly habits.',
    level: 'advanced',
    section: 'Shipping',
    order: 52,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'CI/CD turns Docker from a local developer tool into a repeatable shipping system. A good pipeline builds the same artifact once, tests it, scans it, tags it, pushes it, and deploys that exact image.',
      },
      { type: 'h2', text: 'A practical Docker pipeline' },
      {
        type: 'ol',
        items: [
          'Checkout source code.',
          'Install dependencies needed by tests or build tooling.',
          'Run unit tests and lint checks.',
          'Build the Docker image.',
          'Run container-level smoke tests.',
          'Scan the image.',
          'Tag with commit SHA and a human-friendly release tag.',
          'Push to a registry.',
          'Deploy by image tag or digest.',
        ],
      },
      { type: 'h2', text: 'Use immutable tags' },
      {
        type: 'p',
        text: 'Tags such as latest are convenient for humans but dangerous as deployment identifiers. Prefer commit SHAs, semantic versions, or image digests for production deployments.',
      },
      {
        type: 'code',
        title: 'Tag with commit SHA',
        language: 'bash',
        code: `IMAGE=ghcr.io/acme/my-api
TAG=$(git rev-parse --short=12 HEAD)

docker build -t "$IMAGE:$TAG" .
docker push "$IMAGE:$TAG"`,
      },
      { type: 'h2', text: 'GitHub Actions example' },
      {
        type: 'code',
        title: '.github/workflows/docker.yml',
        language: 'yaml',
        code: `name: docker

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read
  packages: write
  security-events: write

env:
  IMAGE_NAME: ghcr.io/\${{ github.repository }}/api

jobs:
  build-test-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build test image
        uses: docker/build-push-action@v6
        with:
          context: .
          load: true
          tags: api:test
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Smoke test
        run: |
          docker run -d --rm --name api-test -p 8080:8080 api:test
          sleep 3
          curl -fsS http://localhost:8080/health
          docker stop api-test

      - name: Scan image
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: api:test
          severity: CRITICAL,HIGH
          exit-code: "1"

      - name: Login to GHCR
        if: github.event_name == 'push'
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Push image
        if: github.event_name == 'push'
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            \${{ env.IMAGE_NAME }}:\${{ github.sha }}
            \${{ env.IMAGE_NAME }}:main
          cache-from: type=gha
          cache-to: type=gha,mode=max`,
      },
      {
        type: 'warning',
        text: 'The example tags main for convenience, but production deployment should use the commit SHA tag or the image digest produced by the push step.',
      },
      { type: 'h2', text: 'Build once, promote later' },
      {
        type: 'p',
        text: 'A common mistake is rebuilding separately for staging and production. That creates two different artifacts. Instead, build once, push once, then promote the exact same image digest through environments.',
      },
      {
        type: 'code',
        title: 'Promotion idea',
        language: 'text',
        code: `commit abc123
  -> build image ghcr.io/acme/api:abc123
  -> scan image
  -> deploy digest to staging
  -> run smoke tests
  -> approve release
  -> deploy same digest to production`,
      },
      { type: 'h2', text: 'Use build secrets safely' },
      {
        type: 'p',
        text: 'Some builds need temporary credentials, such as a private package token. Use BuildKit secrets so the token is mounted during one build step and does not become an image layer.',
      },
      {
        type: 'code',
        title: 'BuildKit secret in Dockerfile',
        language: 'dockerfile',
        code: `# syntax=docker/dockerfile:1.7
FROM node:22-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=npm_token \\
    NPM_TOKEN="$(cat /run/secrets/npm_token)" npm ci
COPY . .
CMD ["node", "server.js"]`,
      },
      {
        type: 'code',
        title: 'Pass the secret during build',
        language: 'bash',
        code: `DOCKER_BUILDKIT=1 docker build \\
  --secret id=npm_token,env=NPM_TOKEN \\
  -t private-api:test .`,
      },
      { type: 'h2', text: 'Container smoke tests' },
      {
        type: 'code',
        title: 'Basic smoke test script',
        language: 'bash',
        code: `set -euo pipefail

docker build -t api:smoke .
container_id=$(docker run -d -p 8080:8080 api:smoke)

cleanup() {
  docker rm -f "$container_id" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for attempt in 1 2 3 4 5; do
  if curl -fsS http://localhost:8080/health; then
    echo "smoke test passed"
    exit 0
  fi
  sleep 2
done

echo "smoke test failed"
docker logs "$container_id"
exit 1`,
      },
      { type: 'h2', text: 'CI/CD checklist' },
      {
        type: 'keypoints',
        items: [
          'Use Docker Buildx and cache layers to keep builds fast.',
          'Do not store registry credentials in Dockerfiles or image layers.',
          'Test the container, not only the source code.',
          'Scan images before publishing or deployment.',
          'Tag images with immutable identifiers such as commit SHA or digest.',
          'Deploy the same image artifact through staging and production.',
        ],
      },
    ],
  },
  {
    slug: 'docker-prod-compose',
    title: 'Production-minded Compose',
    description:
      'Use Docker Compose responsibly for deployable environments, small production systems, and production-like staging.',
    level: 'advanced',
    section: 'Shipping',
    order: 53,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Docker Compose is excellent for local development and small deployments. Production-minded Compose means you stop treating compose.yaml as a quick demo and start treating it as infrastructure configuration.',
      },
      {
        type: 'note',
        text: 'For larger multi-host systems, Kubernetes, Nomad, ECS, or another orchestrator is usually a better fit. Compose can still be valuable for staging, internal tools, demos, and single-server deployments.',
      },
      { type: 'h2', text: 'Development Compose vs production Compose' },
      {
        type: 'table',
        headers: ['Area', 'Development', 'Production-minded'],
        rows: [
          ['Image', 'Build locally from source', 'Use versioned images from a registry'],
          ['Code', 'Bind mount source code', 'Run immutable image content'],
          ['Secrets', 'Simple .env file', 'Secret manager or protected files'],
          ['Ports', 'Expose many services', 'Expose only public entry points'],
          ['Restart', 'Often not needed', 'Use restart policy'],
          ['Data', 'Throwaway volumes', 'Named volumes with backup plan'],
        ],
      },
      { type: 'h2', text: 'A production-minded compose.yaml' },
      {
        type: 'code',
        title: 'compose.yaml',
        language: 'yaml',
        code: `services:
  web:
    image: ghcr.io/acme/web:2026.07.25
    restart: unless-stopped
    depends_on:
      api:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    networks:
      - public
      - private
    read_only: true
    tmpfs:
      - /var/cache/nginx
      - /var/run

  api:
    image: ghcr.io/acme/api:2026.07.25
    restart: unless-stopped
    env_file:
      - /opt/acme/api.env
    depends_on:
      db:
        condition: service_healthy
    networks:
      - private
    read_only: true
    tmpfs:
      - /tmp
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8080/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s

  db:
    image: postgres:16
    restart: unless-stopped
    env_file:
      - /opt/acme/db.env
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - private
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 30s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:

networks:
  public:
  private:
    internal: true`,
      },
      {
        type: 'warning',
        text: 'Inside a TypeScript template literal, Compose variables such as $$POSTGRES_USER are intentionally doubled for Compose. If you write shell-style variables in tutorial source code, escape template interpolation carefully.',
      },
      { type: 'h2', text: 'Use override files deliberately' },
      {
        type: 'code',
        title: 'compose.dev.yaml',
        language: 'yaml',
        code: `services:
  api:
    build: ./api
    volumes:
      - ./api:/app
    command: npm run dev
    ports:
      - "8080:8080"

  db:
    ports:
      - "5432:5432"`,
      },
      {
        type: 'code',
        title: 'Run development overrides',
        language: 'bash',
        code: `docker compose -f compose.yaml -f compose.dev.yaml up --build`,
      },
      { type: 'h2', text: 'Environment files and secrets' },
      {
        type: 'p',
        text: 'Compose automatically reads a project-level .env file for variable substitution. The env_file key passes variables into a container. These are different features and should not be confused.',
      },
      {
        type: 'code',
        title: 'Variable substitution',
        language: 'yaml',
        code: `services:
  api:
    image: ghcr.io/acme/api:\${APP_VERSION}
    env_file:
      - /opt/acme/api.env`,
      },
      {
        type: 'code',
        title: '.env used by Compose itself',
        language: 'text',
        code: `APP_VERSION=2026.07.25`,
      },
      {
        type: 'code',
        title: '/opt/acme/api.env passed into the container',
        language: 'text',
        code: `NODE_ENV=production
DATABASE_URL=postgres://app:change-me@db:5432/app`,
      },
      { type: 'h2', text: 'Deploy updates with Compose' },
      {
        type: 'code',
        title: 'Pull and restart',
        language: 'bash',
        code: `docker compose pull
docker compose up -d --remove-orphans
docker compose ps`,
      },
      {
        type: 'p',
        text: 'This workflow is simple, but it has limits. Compose does not automatically do rolling updates across many hosts. Plan maintenance windows or use an orchestrator when downtime matters.',
      },
      { type: 'h2', text: 'Production-minded Compose checklist' },
      {
        type: 'keypoints',
        items: [
          'Use registry images and version tags for deployed environments.',
          'Expose only a reverse proxy or public API to the host.',
          'Keep databases and queues on internal networks.',
          'Use healthchecks, restart policies, and named volumes.',
          'Separate development-only bind mounts and commands into override files.',
          'Create a backup and restore process before storing important data.',
        ],
      },
    ],
  },
  {
    slug: 'docker-backup',
    title: 'Backing Up Volumes & Data',
    description:
      'Protect Docker volumes, databases, uploads, and configuration with practical backup and restore workflows.',
    level: 'advanced',
    section: 'Shipping',
    order: 54,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Containers are replaceable. Data is not. If your database, uploads, message queue state, or configuration lives in Docker volumes, you need a backup and restore plan.',
      },
      {
        type: 'warning',
        text: 'A backup you have never restored is only a hope. Always test restore steps in a clean environment.',
      },
      { type: 'h2', text: 'What needs backup?' },
      {
        type: 'ul',
        items: [
          'Database data volumes such as Postgres, MySQL, MongoDB, and Redis when persistence is enabled.',
          'User uploads, generated reports, media files, and application storage directories.',
          'Configuration that is not already in Git or a secret manager.',
          'TLS certificates if they are not automatically reissued.',
          'Compose files, deployment notes, and the exact image tags used for a release.',
        ],
      },
      { type: 'h2', text: 'Find volumes' },
      {
        type: 'code',
        title: 'Inspect Docker volumes',
        language: 'bash',
        code: `docker volume ls
docker volume inspect myapp_postgres-data`,
      },
      {
        type: 'p',
        text: 'Named volumes are managed by Docker. Bind mounts are normal host paths. Both can contain important data, but the backup commands differ.',
      },
      { type: 'h2', text: 'Backup a generic named volume' },
      {
        type: 'code',
        title: 'Create a tar backup from a volume',
        language: 'bash',
        code: `docker run --rm \\
  -v myapp_uploads:/data:ro \\
  -v "$PWD/backups:/backup" \\
  alpine \\
  tar czf /backup/uploads-$(date +%Y%m%d-%H%M%S).tar.gz -C /data .`,
      },
      {
        type: 'code',
        title: 'Restore a volume from tar',
        language: 'bash',
        code: `docker volume create myapp_uploads_restored

docker run --rm \\
  -v myapp_uploads_restored:/data \\
  -v "$PWD/backups:/backup:ro" \\
  alpine \\
  sh -c "cd /data && tar xzf /backup/uploads-20260725-120000.tar.gz"`,
      },
      { type: 'h2', text: 'Database backups should use database tools' },
      {
        type: 'p',
        text: 'For databases, file-level volume copies can be inconsistent if the database is running. Prefer database-native dump tools unless you are using storage snapshots designed for your database.',
      },
      {
        type: 'code',
        title: 'Postgres logical backup',
        language: 'bash',
        code: `docker exec myapp-db \\
  pg_dump -U app -d app \\
  > backups/postgres-$(date +%Y%m%d-%H%M%S).sql`,
      },
      {
        type: 'code',
        title: 'Postgres restore',
        language: 'bash',
        code: `docker exec -i myapp-db-restored \\
  psql -U app -d app \\
  < backups/postgres-20260725-120000.sql`,
      },
      {
        type: 'code',
        title: 'MySQL logical backup',
        language: 'bash',
        code: `docker exec myapp-mysql \\
  mysqldump -u app -p app \\
  > backups/mysql-$(date +%Y%m%d-%H%M%S).sql`,
      },
      { type: 'h2', text: 'Automate backups from the host' },
      {
        type: 'code',
        title: 'backup-postgres.sh',
        language: 'bash',
        code: `#!/usr/bin/env bash
set -euo pipefail

backup_dir="/opt/backups/myapp"
timestamp="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"

docker exec myapp-db pg_dump -U app -d app \\
  | gzip > "$backup_dir/postgres-$timestamp.sql.gz"

find "$backup_dir" -name 'postgres-*.sql.gz' -mtime +14 -delete
echo "backup complete: $backup_dir/postgres-$timestamp.sql.gz"`,
      },
      {
        type: 'code',
        title: 'Cron example',
        language: 'text',
        code: `# Run every night at 02:15.
15 2 * * * /opt/myapp/backup-postgres.sh >> /var/log/myapp-backup.log 2>&1`,
      },
      { type: 'h2', text: 'Store backups somewhere else' },
      {
        type: 'ul',
        items: [
          'Local backups are useful for quick restores but do not protect against disk loss.',
          'Copy backups to object storage, another server, or a managed backup system.',
          'Encrypt backups that contain personal data, credentials, or customer records.',
          'Track retention: hourly, daily, weekly, and monthly backups have different purposes.',
        ],
      },
      { type: 'h2', text: 'Restore drill checklist' },
      {
        type: 'ol',
        items: [
          'Create a clean Docker volume or staging database.',
          'Restore the latest backup into it.',
          'Start the application against restored data.',
          'Verify login, core workflows, file downloads, and admin screens.',
          'Record how long restore took and what manual steps were needed.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Back up data, not containers.',
          'Use database-native tools for database consistency.',
          'Automate backups and retention.',
          'Store copies outside the Docker host.',
          'Practice restores before an emergency.',
        ],
      },
    ],
  },
  {
    slug: 'docker-swarm-intro',
    title: 'Swarm Intro (Conceptual)',
    description:
      'Understand Docker Swarm concepts so you can recognize where it fits in the orchestration path.',
    level: 'advanced',
    section: 'Orchestration Path',
    order: 55,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Docker Swarm is Docker’s built-in orchestration mode. It lets multiple Docker hosts act like one cluster for running services, scaling replicas, managing desired state, and routing traffic.',
      },
      {
        type: 'p',
        text: 'You do not need Swarm to learn Docker, but Swarm introduces orchestration ideas that also appear in Kubernetes and other platforms.',
      },
      { type: 'h2', text: 'Core Swarm concepts' },
      {
        type: 'table',
        headers: ['Concept', 'Meaning'],
        rows: [
          ['Node', 'A Docker host that participates in the Swarm cluster.'],
          ['Manager', 'A node that stores cluster state and schedules work.'],
          ['Worker', 'A node that runs assigned tasks.'],
          ['Service', 'The desired definition of a containerized app.'],
          ['Task', 'A running container instance created for a service.'],
          ['Replica', 'One copy of a service task.'],
          ['Stack', 'A group of services deployed together, often from a Compose-like file.'],
        ],
      },
      { type: 'h2', text: 'Initialize a local Swarm' },
      {
        type: 'code',
        title: 'Single-node Swarm for learning',
        language: 'bash',
        code: `docker swarm init
docker node ls`,
      },
      {
        type: 'warning',
        text: 'Do not run Swarm commands on a production host unless you are intentionally managing that host as part of a Swarm cluster.',
      },
      { type: 'h2', text: 'Run and scale a service' },
      {
        type: 'code',
        title: 'Create a replicated service',
        language: 'bash',
        code: `docker service create \\
  --name web \\
  --replicas 3 \\
  --publish 8080:80 \\
  nginx:1.27-alpine

docker service ls
docker service ps web`,
      },
      {
        type: 'code',
        title: 'Scale a service',
        language: 'bash',
        code: `docker service scale web=5
docker service ps web`,
      },
      { type: 'h2', text: 'Desired state' },
      {
        type: 'p',
        text: 'In normal Docker, you start a container. In orchestration, you declare desired state. If you request five replicas, the orchestrator tries to keep five running even when containers fail.',
      },
      { type: 'h2', text: 'Deploy a stack' },
      {
        type: 'code',
        title: 'compose.yaml for Swarm stack',
        language: 'yaml',
        code: `services:
  web:
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure`,
      },
      {
        type: 'code',
        title: 'Deploy and remove stack',
        language: 'bash',
        code: `docker stack deploy -c compose.yaml demo
docker stack services demo
docker stack rm demo`,
      },
      { type: 'h2', text: 'Swarm vs Compose' },
      {
        type: 'ul',
        items: [
          'Compose is usually for one Docker host and developer workflows.',
          'Swarm is for a cluster of Docker hosts and service desired state.',
          'Compose starts containers. Swarm creates services and tasks.',
          'Some Compose keys are ignored by Swarm, and some deploy keys are ignored by normal Compose.',
        ],
      },
      { type: 'h2', text: 'Where Swarm fits today' },
      {
        type: 'p',
        text: 'Swarm is simpler than Kubernetes and deeply integrated with Docker, but Kubernetes has a much larger ecosystem. Swarm can be a useful learning step and may fit small teams that want straightforward orchestration.',
      },
      {
        type: 'keypoints',
        items: [
          'Swarm introduces cluster nodes, services, tasks, replicas, and desired state.',
          'Orchestration means the platform keeps trying to match the declared state.',
          'Stacks are multi-service deployments for Swarm.',
          'The ideas transfer well to Kubernetes, ECS, Nomad, and other orchestrators.',
        ],
      },
    ],
  },
  {
    slug: 'docker-k8s-bridge',
    title: 'From Docker to Kubernetes (Bridge Lesson)',
    description:
      'Connect familiar Docker ideas to Kubernetes concepts without getting lost in the full Kubernetes ecosystem.',
    level: 'advanced',
    section: 'Orchestration Path',
    order: 56,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Kubernetes is an orchestrator. Docker helps you build and run containers; Kubernetes schedules containers across a cluster and keeps applications available through desired state.',
      },
      {
        type: 'p',
        text: 'This lesson is a bridge. You do not need to master Kubernetes here. The goal is to map Docker knowledge to Kubernetes vocabulary.',
      },
      { type: 'h2', text: 'Concept mapping' },
      {
        type: 'table',
        headers: ['Docker idea', 'Kubernetes idea', 'Notes'],
        rows: [
          ['Image', 'Image', 'Kubernetes pulls OCI images from registries.'],
          ['Container', 'Container inside a Pod', 'A Pod is the smallest deployable unit.'],
          ['docker run', 'Pod or Deployment manifest', 'You declare desired state in YAML.'],
          ['Compose service', 'Deployment', 'A Deployment manages replicated Pods.'],
          ['Compose network DNS', 'Service DNS', 'Services provide stable names and load balancing.'],
          ['Volume', 'PersistentVolumeClaim', 'Storage is requested through cluster storage classes.'],
          ['Environment variables', 'env, ConfigMap, Secret', 'Configuration is declared separately.'],
          ['Healthcheck', 'Readiness and liveness probes', 'Kubernetes uses probes for traffic and restarts.'],
        ],
      },
      { type: 'h2', text: 'A Docker command becomes a Deployment' },
      {
        type: 'code',
        title: 'Docker command',
        language: 'bash',
        code: `docker run -d \\
  --name api \\
  -p 8080:8080 \\
  -e NODE_ENV=production \\
  ghcr.io/acme/api:abc123`,
      },
      {
        type: 'code',
        title: 'Kubernetes Deployment',
        language: 'yaml',
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: ghcr.io/acme/api:abc123
          ports:
            - containerPort: 8080
          env:
            - name: NODE_ENV
              value: production
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10`,
      },
      {
        type: 'code',
        title: 'Kubernetes Service',
        language: 'yaml',
        code: `apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 8080`,
      },
      { type: 'h2', text: 'Pods are not just containers' },
      {
        type: 'p',
        text: 'A Pod can contain one or more containers that share network and storage. Most application Pods contain one main container. Sidecars are extra containers that support the main app, such as log shippers or proxies.',
      },
      { type: 'h2', text: 'ConfigMaps and Secrets' },
      {
        type: 'code',
        title: 'ConfigMap example',
        language: 'yaml',
        code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
data:
  LOG_LEVEL: info
  FEATURE_SIGNUPS: "true"`,
      },
      {
        type: 'code',
        title: 'Use ConfigMap values',
        language: 'yaml',
        code: `envFrom:
  - configMapRef:
      name: api-config`,
      },
      {
        type: 'warning',
        text: 'Kubernetes Secrets are base64-encoded by default, not automatically encrypted end-to-end for every cluster. Production teams usually integrate cloud KMS or external secret managers.',
      },
      { type: 'h2', text: 'The deployment mental shift' },
      {
        type: 'ul',
        items: [
          'You do not SSH into a node to start one container. You apply manifests to the cluster.',
          'You do not manually replace failed containers. Controllers reconcile desired state.',
          'You do not point users directly at Pod IPs. Services and Ingress objects route traffic.',
          'You do not assume local disk is permanent. Storage must be requested and managed.',
        ],
      },
      { type: 'h2', text: 'What to learn next in Kubernetes' },
      {
        type: 'ol',
        items: [
          'Pods, Deployments, Services, ConfigMaps, and Secrets.',
          'Readiness probes, liveness probes, resource requests, and limits.',
          'Ingress and TLS termination.',
          'PersistentVolumeClaims for stateful workloads.',
          'Helm or Kustomize for managing manifests.',
          'Cluster observability, RBAC, and network policies.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Your Docker image skills directly transfer to Kubernetes.',
          'Kubernetes adds scheduling, desired state, service discovery, and rollout control.',
          'Compose files are not Kubernetes manifests, but the architecture thinking is similar.',
          'Start with stateless apps before moving databases into Kubernetes.',
        ],
      },
    ],
  },
  {
    slug: 'docker-architecture-apps',
    title: 'Designing Containerized App Architecture',
    description:
      'Design containerized systems with clear service boundaries, configuration, networking, persistence, and deployment paths.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 57,
    minutes: 19,
    content: [
      {
        type: 'p',
        text: 'Good container architecture starts before the Dockerfile. You decide which processes become services, how they communicate, which data must persist, and how configuration moves through environments.',
      },
      { type: 'h2', text: 'Containerize by process responsibility' },
      {
        type: 'p',
        text: 'A useful rule is one primary process per container. That does not mean one container per whole project. It means separate responsibilities into services that can be built, restarted, scaled, and observed independently.',
      },
      {
        type: 'table',
        headers: ['Responsibility', 'Usually separate service?'],
        rows: [
          ['Web UI or reverse proxy', 'Yes'],
          ['API server', 'Yes'],
          ['Background worker', 'Yes'],
          ['Scheduled job runner', 'Often yes'],
          ['Database', 'Yes, or managed service'],
          ['Cache or queue', 'Yes, or managed service'],
          ['Log processing sidecar', 'Sometimes, depending on platform'],
        ],
      },
      { type: 'h2', text: 'Example architecture' },
      {
        type: 'code',
        title: 'Service map',
        language: 'text',
        code: `browser
  -> nginx reverse proxy
      -> web frontend
      -> api service
          -> postgres database
          -> redis cache
          -> worker queue

worker service
  -> redis queue
  -> postgres database
  -> object storage`,
      },
      { type: 'h2', text: 'Separate stateless and stateful services' },
      {
        type: 'ul',
        items: [
          'Stateless services can be replaced at any time because important data lives elsewhere.',
          'Stateful services need volumes, backups, restore testing, and careful upgrades.',
          'In production, managed databases and managed queues often reduce operational risk.',
          'For local development, containerized databases make onboarding easier.',
        ],
      },
      { type: 'h2', text: 'Design configuration flow' },
      {
        type: 'p',
        text: 'Images should be environment-neutral. The same image should run in development, staging, and production with different environment variables or secret values.',
      },
      {
        type: 'code',
        title: 'Environment-neutral image',
        language: 'dockerfile',
        code: `FROM node:22-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
CMD ["node", "server.js"]`,
      },
      {
        type: 'code',
        title: 'Runtime configuration',
        language: 'yaml',
        code: `services:
  api:
    image: ghcr.io/acme/api:abc123
    environment:
      NODE_ENV: production
      LOG_LEVEL: info
      REDIS_URL: redis://redis:6379
      DATABASE_URL: postgres://app:change-me@db:5432/app`,
      },
      { type: 'h2', text: 'Network boundaries' },
      {
        type: 'p',
        text: 'A clean architecture exposes only the edge service to the outside world. Internal services communicate on private networks by service name.',
      },
      {
        type: 'code',
        title: 'Public and private networks',
        language: 'yaml',
        code: `services:
  nginx:
    image: nginx:1.27-alpine
    ports:
      - "80:80"
    networks: [public, private]

  api:
    image: ghcr.io/acme/api:abc123
    networks: [private]

  db:
    image: postgres:16
    networks: [private]

networks:
  public:
  private:
    internal: true`,
      },
      { type: 'h2', text: 'Scaling design choices' },
      {
        type: 'ul',
        items: [
          'Scale stateless API replicas horizontally behind a load balancer.',
          'Scale workers based on queue depth and external service limits.',
          'Avoid writing user uploads to local container filesystems when replicas are involved.',
          'Use object storage for shared files and a database for shared state.',
          'Make background jobs idempotent so retries are safe.',
        ],
      },
      { type: 'h2', text: 'Production readiness questions' },
      {
        type: 'ol',
        items: [
          'Can every container be rebuilt from source and deployed from a registry?',
          'Where does each service store persistent data?',
          'How do services discover each other?',
          'Which ports are public, private, or not exposed at all?',
          'How are secrets injected and rotated?',
          'What happens if one replica crashes?',
          'How do logs, metrics, and traces leave the container?',
          'How do you restore data after a host failure?',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Design service boundaries before writing Dockerfiles.',
          'Keep images environment-neutral and inject config at runtime.',
          'Expose only the edge and keep databases private.',
          'Treat stateful services with backup, restore, and upgrade plans.',
          'Design for replacement: containers should be disposable.',
        ],
      },
    ],
  },
  {
    slug: 'docker-observability',
    title: 'Observability for Containers',
    description:
      'Collect useful logs, metrics, health checks, and traces from containerized applications.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 58,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Observability answers three production questions: Is the system working? If not, where is it failing? What changed before the failure?',
      },
      {
        type: 'p',
        text: 'Containers are disposable, so observability data must leave the container. Do not rely on SSH and local files as your primary debugging method.',
      },
      { type: 'h2', text: 'The four signals' },
      {
        type: 'table',
        headers: ['Signal', 'What it tells you'],
        rows: [
          ['Logs', 'Discrete events: errors, requests, jobs, startup messages.'],
          ['Metrics', 'Numbers over time: CPU, memory, latency, request count, queue depth.'],
          ['Traces', 'A request path across services and dependencies.'],
          ['Health checks', 'Whether a container is ready or should be restarted.'],
        ],
      },
      { type: 'h2', text: 'Log to stdout and stderr' },
      {
        type: 'p',
        text: 'The container runtime captures stdout and stderr. Your app should log structured events there, while the platform ships those logs to a logging system.',
      },
      {
        type: 'code',
        title: 'JSON log example',
        language: 'json',
        code: `{
  "level": "info",
  "message": "request completed",
  "method": "GET",
  "path": "/api/orders",
  "status": 200,
  "duration_ms": 42,
  "request_id": "req_123"
}`,
      },
      {
        type: 'code',
        title: 'Read container logs',
        language: 'bash',
        code: `docker logs api
docker logs --since 10m api
docker logs -f api`,
      },
      {
        type: 'warning',
        text: 'Avoid logging secrets, tokens, passwords, full credit card numbers, or personal data that your organization does not allow in logs.',
      },
      { type: 'h2', text: 'Health checks' },
      {
        type: 'code',
        title: 'Dockerfile healthcheck',
        language: 'dockerfile',
        code: `FROM node:22-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \\
  CMD node healthcheck.js

CMD ["node", "server.js"]`,
      },
      {
        type: 'code',
        title: 'Compose healthcheck',
        language: 'yaml',
        code: `services:
  api:
    image: my-api:1.0
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s`,
      },
      { type: 'h2', text: 'Basic container metrics' },
      {
        type: 'code',
        title: 'Local metrics commands',
        language: 'bash',
        code: `docker stats
docker system df
docker inspect api --format '{{json .State.Health}}'`,
      },
      {
        type: 'p',
        text: 'In production, use a metrics stack such as Prometheus, Grafana, Datadog, New Relic, CloudWatch, Azure Monitor, Google Cloud Monitoring, or another team standard.',
      },
      { type: 'h2', text: 'Expose application metrics' },
      {
        type: 'code',
        title: 'Prometheus-style metrics',
        language: 'text',
        code: `# HELP http_requests_total Total HTTP requests.
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/health",status="200"} 1284

# HELP http_request_duration_seconds Request duration.
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{route="/api/orders",le="0.1"} 95`,
      },
      { type: 'h2', text: 'Add request IDs' },
      {
        type: 'p',
        text: 'A request ID connects logs across services. Generate one at the edge if the client does not send it, pass it downstream, and include it in every log line.',
      },
      {
        type: 'code',
        title: 'Header convention',
        language: 'text',
        code: `Incoming request:
X-Request-Id: req_01HZX9F7

API log:
request_id=req_01HZX9F7 path=/api/orders status=200 duration_ms=42

Worker log:
request_id=req_01HZX9F7 job=send_receipt status=complete`,
      },
      { type: 'h2', text: 'Operational dashboard starter' },
      {
        type: 'ul',
        items: [
          'Request rate by route and status code.',
          'Error rate and top error messages.',
          'Latency percentiles such as p50, p95, and p99.',
          'Container CPU, memory, restarts, and health status.',
          'Database connection usage and query latency.',
          'Queue depth, job age, and worker failures.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Write logs to stdout and stderr so the platform can collect them.',
          'Use structured logs with request IDs.',
          'Add health checks that test real dependencies carefully.',
          'Track metrics that reveal user impact, not only machine usage.',
          'Move logs, metrics, and traces outside disposable containers.',
        ],
      },
    ],
  },
  {
    slug: 'docker-project-web',
    title: 'Mini Project: Web App + Postgres + Nginx',
    description:
      'Build a followable production-style web stack with an app container, Postgres database, and Nginx reverse proxy.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 59,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This mini project builds a classic three-service stack: a Node web app, a Postgres database, and Nginx as the public reverse proxy.',
      },
      {
        type: 'p',
        text: 'You will create a small app, containerize it, connect it to Postgres, and send browser traffic through Nginx.',
      },
      { type: 'h2', text: 'Step 1: Create the project structure' },
      {
        type: 'code',
        title: 'File structure',
        language: 'text',
        code: `web-postgres-nginx/
  app/
    Dockerfile
    package.json
    server.js
  nginx/
    default.conf
  compose.yaml
  .env.example
  .dockerignore`,
      },
      { type: 'h2', text: 'Step 2: Create the web app' },
      {
        type: 'code',
        title: 'app/package.json',
        language: 'json',
        code: `{
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "latest",
    "pg": "latest"
  }
}`,
      },
      {
        type: 'code',
        title: 'app/server.js',
        language: 'text',
        code: `const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/health', async (req, res) => {
  await pool.query('select 1');
  res.json({ ok: true });
});

app.get('/', async (req, res) => {
  await pool.query(\`
    create table if not exists visits (
      id serial primary key,
      created_at timestamptz not null default now()
    )
  \`);
  await pool.query('insert into visits default values');
  const result = await pool.query('select count(*)::int as count from visits');
  res.send(\`<h1>Hello from Docker</h1><p>Visits: \${result.rows[0].count}</p>\`);
});

app.listen(port, () => {
  console.log(\`web app listening on port \${port}\`);
});`,
      },
      { type: 'h2', text: 'Step 3: Add the app Dockerfile' },
      {
        type: 'code',
        title: 'app/Dockerfile',
        language: 'dockerfile',
        code: `FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

USER node
EXPOSE 3000
CMD ["npm", "start"]`,
      },
      { type: 'h2', text: 'Step 4: Configure Nginx' },
      {
        type: 'code',
        title: 'nginx/default.conf',
        language: 'text',
        code: `server {
  listen 80;

  location / {
    proxy_pass http://app:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}`,
      },
      { type: 'h2', text: 'Step 5: Create Compose services' },
      {
        type: 'code',
        title: 'compose.yaml',
        language: 'yaml',
        code: `services:
  nginx:
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      app:
        condition: service_healthy
    networks:
      - public
      - private

  app:
    build: ./app
    environment:
      PORT: 3000
      DATABASE_URL: postgres://app:app-password@db:5432/app
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - private

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app-password
      POSTGRES_DB: app
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - private

volumes:
  postgres-data:

networks:
  public:
  private:
    internal: true`,
      },
      { type: 'h2', text: 'Step 6: Add .dockerignore and environment example' },
      {
        type: 'code',
        title: '.dockerignore',
        language: 'text',
        code: `node_modules
.git
.env
*.log`,
      },
      {
        type: 'code',
        title: '.env.example',
        language: 'text',
        code: `POSTGRES_USER=app
POSTGRES_PASSWORD=change-me
POSTGRES_DB=app`,
      },
      { type: 'h2', text: 'Step 7: Run the stack' },
      {
        type: 'code',
        title: 'Start and test',
        language: 'bash',
        code: `docker compose up --build -d
docker compose ps
curl http://localhost:8080
docker compose logs app`,
      },
      { type: 'h2', text: 'Step 8: Practice backup and restore' },
      {
        type: 'code',
        title: 'Dump Postgres data',
        language: 'bash',
        code: `mkdir -p backups
docker compose exec -T db pg_dump -U app -d app > backups/app.sql`,
      },
      {
        type: 'code',
        title: 'Stop and remove when finished',
        language: 'bash',
        code: `docker compose down
# Add -v only when you intentionally want to delete database data.
docker compose down -v`,
      },
      {
        type: 'keypoints',
        items: [
          'Nginx is the only service published to the host.',
          'The app and database communicate through the private Docker network.',
          'Postgres data persists in a named volume.',
          'Healthchecks make startup order more reliable.',
          'The same architecture can grow into staging or production with registry images and real secrets.',
        ],
      },
    ],
  },
  {
    slug: 'docker-project-api',
    title: 'Mini Project: API + Worker + Redis',
    description:
      'Build an API that queues background jobs to Redis and a worker that processes them in a separate container.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 60,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'Many production systems split fast user-facing requests from slower background work. This project uses an API container, a worker container, and Redis as a queue.',
      },
      { type: 'h2', text: 'Step 1: Create the project structure' },
      {
        type: 'code',
        title: 'File structure',
        language: 'text',
        code: `api-worker-redis/
  api/
    Dockerfile
    package.json
    server.js
  worker/
    Dockerfile
    package.json
    worker.js
  compose.yaml
  .dockerignore`,
      },
      { type: 'h2', text: 'Step 2: Build the API service' },
      {
        type: 'code',
        title: 'api/package.json',
        language: 'json',
        code: `{
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "latest",
    "ioredis": "latest"
  }
}`,
      },
      {
        type: 'code',
        title: 'api/server.js',
        language: 'text',
        code: `const express = require('express');
const Redis = require('ioredis');
const crypto = require('crypto');

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
const port = process.env.PORT || 8080;

app.use(express.json());

app.get('/health', async (req, res) => {
  await redis.ping();
  res.json({ ok: true });
});

app.post('/jobs', async (req, res) => {
  const job = {
    id: crypto.randomUUID(),
    type: 'send-email',
    payload: req.body,
    createdAt: new Date().toISOString(),
  };

  await redis.lpush('jobs', JSON.stringify(job));
  res.status(202).json({ queued: true, jobId: job.id });
});

app.get('/jobs/queued', async (req, res) => {
  const count = await redis.llen('jobs');
  res.json({ queued: count });
});

app.listen(port, () => {
  console.log(\`api listening on port \${port}\`);
});`,
      },
      {
        type: 'code',
        title: 'api/Dockerfile',
        language: 'dockerfile',
        code: `FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev
COPY . .

USER node
EXPOSE 8080
CMD ["npm", "start"]`,
      },
      { type: 'h2', text: 'Step 3: Build the worker service' },
      {
        type: 'code',
        title: 'worker/package.json',
        language: 'json',
        code: `{
  "scripts": {
    "start": "node worker.js"
  },
  "dependencies": {
    "ioredis": "latest"
  }
}`,
      },
      {
        type: 'code',
        title: 'worker/worker.js',
        language: 'text',
        code: `const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

async function processJob(job) {
  console.log(JSON.stringify({ level: 'info', message: 'processing job', jobId: job.id }));
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(JSON.stringify({ level: 'info', message: 'job complete', jobId: job.id }));
}

async function main() {
  console.log('worker started');

  while (true) {
    const result = await redis.brpop('jobs', 0);
    const rawJob = result[1];
    const job = JSON.parse(rawJob);

    try {
      await processJob(job);
    } catch (error) {
      console.error(JSON.stringify({ level: 'error', message: error.message, jobId: job.id }));
      await redis.lpush('jobs:failed', rawJob);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});`,
      },
      {
        type: 'code',
        title: 'worker/Dockerfile',
        language: 'dockerfile',
        code: `FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev
COPY . .

USER node
CMD ["npm", "start"]`,
      },
      { type: 'h2', text: 'Step 4: Wire services with Compose' },
      {
        type: 'code',
        title: 'compose.yaml',
        language: 'yaml',
        code: `services:
  api:
    build: ./api
    ports:
      - "8080:8080"
    environment:
      PORT: 8080
      REDIS_URL: redis://redis:6379
    depends_on:
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://localhost:8080/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
      interval: 10s
      timeout: 5s
      retries: 5

  worker:
    build: ./worker
    environment:
      REDIS_URL: redis://redis:6379
    depends_on:
      redis:
        condition: service_healthy
    deploy:
      replicas: 1

  redis:
    image: redis:7-alpine
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  redis-data:`,
      },
      { type: 'h2', text: 'Step 5: Run and test the system' },
      {
        type: 'code',
        title: 'Start services',
        language: 'bash',
        code: `docker compose up --build -d
docker compose ps`,
      },
      {
        type: 'code',
        title: 'Queue jobs',
        language: 'bash',
        code: `curl -X POST http://localhost:8080/jobs \\
  -H "Content-Type: application/json" \\
  -d '{"email":"learner@example.com","template":"welcome"}'

curl http://localhost:8080/jobs/queued
docker compose logs -f worker`,
      },
      { type: 'h2', text: 'Step 6: Scale workers' },
      {
        type: 'code',
        title: 'Run more workers',
        language: 'bash',
        code: `docker compose up -d --scale worker=3
docker compose ps
docker compose logs worker`,
      },
      {
        type: 'note',
        text: 'The worker code must be safe to run in multiple replicas. Real jobs should be idempotent so retries or duplicate processing do not corrupt data.',
      },
      { type: 'h2', text: 'Step 7: Add a simple backup' },
      {
        type: 'code',
        title: 'Backup Redis append-only file volume',
        language: 'bash',
        code: `mkdir -p backups
docker run --rm \\
  -v api-worker-redis_redis-data:/data:ro \\
  -v "$PWD/backups:/backup" \\
  alpine \\
  tar czf /backup/redis-data.tar.gz -C /data .`,
      },
      {
        type: 'keypoints',
        items: [
          'API containers stay responsive by queueing slow work.',
          'Worker containers can be scaled independently.',
          'Redis is private to the Compose network and persists data in a volume.',
          'Background jobs need retry, failure, and idempotency design in real production systems.',
        ],
      },
    ],
  },
  {
    slug: 'docker-project-fullstack',
    title: 'Mini Project: Next.js/Flask + DB Stack',
    description:
      'Build a full-stack Docker project with a frontend, Flask API, database, and reverse proxy.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 61,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This capstone shows a realistic full-stack layout: Next.js frontend, Flask API, Postgres database, and Nginx as the single public entry point.',
      },
      { type: 'h2', text: 'Step 1: Create the project structure' },
      {
        type: 'code',
        title: 'File structure',
        language: 'text',
        code: `fullstack-docker/
  frontend/
    Dockerfile
    package.json
    next.config.js
    pages/
      index.js
  api/
    Dockerfile
    requirements.txt
    app.py
  nginx/
    default.conf
  compose.yaml
  .dockerignore`,
      },
      { type: 'h2', text: 'Step 2: Create the Flask API' },
      {
        type: 'code',
        title: 'api/requirements.txt',
        language: 'text',
        code: `flask
gunicorn
psycopg[binary]`,
      },
      {
        type: 'code',
        title: 'api/app.py',
        language: 'text',
        code: `import os
import psycopg
from flask import Flask, jsonify

app = Flask(__name__)

def get_connection():
    return psycopg.connect(os.environ["DATABASE_URL"])

@app.get("/health")
def health():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("select 1")
    return jsonify({"ok": True})

@app.get("/api/messages")
def messages():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                create table if not exists messages (
                    id serial primary key,
                    body text not null
                )
            """)
            cur.execute("insert into messages (body) values (%s)", ("Hello from Flask",))
            cur.execute("select id, body from messages order by id desc limit 5")
            rows = cur.fetchall()
            conn.commit()

    return jsonify([{"id": row[0], "body": row[1]} for row in rows])`,
      },
      {
        type: 'code',
        title: 'api/Dockerfile',
        language: 'dockerfile',
        code: `FROM python:3.12-slim
WORKDIR /app

RUN useradd --system --home /app app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=app:app . .

USER app
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]`,
      },
      { type: 'h2', text: 'Step 3: Create the Next.js frontend' },
      {
        type: 'code',
        title: 'frontend/package.json',
        language: 'json',
        code: `{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  }
}`,
      },
      {
        type: 'code',
        title: 'frontend/pages/index.js',
        language: 'text',
        code: `export async function getServerSideProps() {
  const response = await fetch('http://api:5000/api/messages');
  const messages = await response.json();
  return { props: { messages } };
}

export default function Home({ messages }) {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 32 }}>
      <h1>Full-stack Docker</h1>
      <p>Next.js talks to Flask over the private Docker network.</p>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.body}</li>
        ))}
      </ul>
    </main>
  );
}`,
      },
      {
        type: 'code',
        title: 'frontend/next.config.js',
        language: 'text',
        code: `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

module.exports = nextConfig;`,
      },
      {
        type: 'code',
        title: 'frontend/Dockerfile',
        language: 'dockerfile',
        code: `FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        type: 'warning',
        text: 'If your minimal demo does not include a frontend/public directory, create an empty one or remove that COPY line from the Dockerfile.',
      },
      { type: 'h2', text: 'Step 4: Configure Nginx as the edge' },
      {
        type: 'code',
        title: 'nginx/default.conf',
        language: 'text',
        code: `server {
  listen 80;

  location / {
    proxy_pass http://frontend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /api/ {
    proxy_pass http://api:5000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}`,
      },
      { type: 'h2', text: 'Step 5: Compose the full stack' },
      {
        type: 'code',
        title: 'compose.yaml',
        language: 'yaml',
        code: `services:
  nginx:
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      frontend:
        condition: service_started
      api:
        condition: service_healthy
    networks:
      - public
      - private

  frontend:
    build: ./frontend
    depends_on:
      api:
        condition: service_healthy
    networks:
      - private

  api:
    build: ./api
    environment:
      DATABASE_URL: postgresql://app:app-password@db:5432/app
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:5000/health')"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - private

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app-password
      POSTGRES_DB: app
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - private

volumes:
  postgres-data:

networks:
  public:
  private:
    internal: true`,
      },
      { type: 'h2', text: 'Step 6: Run and inspect' },
      {
        type: 'code',
        title: 'Build and run',
        language: 'bash',
        code: `docker compose up --build -d
docker compose ps
curl http://localhost:8080
curl http://localhost:8080/api/messages`,
      },
      {
        type: 'code',
        title: 'Troubleshoot',
        language: 'bash',
        code: `docker compose logs nginx
docker compose logs frontend
docker compose logs api
docker compose exec db psql -U app -d app -c "select count(*) from messages;"`,
      },
      { type: 'h2', text: 'Step 7: Production upgrades' },
      {
        type: 'ul',
        items: [
          'Move database credentials to a secret manager or protected environment file.',
          'Publish frontend and API images to a registry instead of building on the server.',
          'Add TLS termination at Nginx or a cloud load balancer.',
          'Add backups for the Postgres volume.',
          'Add logging, metrics, and alerting for all services.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Nginx provides one public entry point for the browser.',
          'Next.js and Flask communicate on a private Docker network.',
          'Postgres is stateful and requires a persistent volume and backup plan.',
          'Multi-stage frontend builds keep runtime images smaller.',
          'This pattern resembles many real full-stack deployments.',
        ],
      },
    ],
  },
  {
    slug: 'docker-common-mistakes',
    title: 'Common Docker Mistakes (and Fixes)',
    description:
      'Recognize common Docker problems quickly and fix them with practical production-ready habits.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 62,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Most Docker problems are not mysterious. They usually come from image size, build context, permissions, networking assumptions, missing persistence, or mixing development habits into production.',
      },
      { type: 'h2', text: 'Mistake 1: Copying everything into the image' },
      {
        type: 'code',
        title: 'Bad Dockerfile',
        language: 'dockerfile',
        code: `FROM node:22
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]`,
      },
      {
        type: 'code',
        title: 'Better Dockerfile',
        language: 'dockerfile',
        code: `FROM node:22-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
CMD ["npm", "start"]`,
      },
      {
        type: 'p',
        text: 'Copy dependency manifests first so Docker can cache dependency installation. Add .dockerignore so secrets, node_modules, logs, and Git history do not enter the build context.',
      },
      { type: 'h2', text: 'Mistake 2: Using localhost between containers' },
      {
        type: 'p',
        text: 'Inside a container, localhost means that same container. To reach another Compose service, use the service name.',
      },
      {
        type: 'code',
        title: 'Wrong and right URLs',
        language: 'text',
        code: `Wrong from api container:
postgres://app:pass@localhost:5432/app

Right from api container:
postgres://app:pass@db:5432/app`,
      },
      { type: 'h2', text: 'Mistake 3: Forgetting persistent data' },
      {
        type: 'code',
        title: 'Database with a named volume',
        language: 'yaml',
        code: `services:
  db:
    image: postgres:16
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:`,
      },
      {
        type: 'warning',
        text: 'docker compose down -v deletes named volumes for the project. Use it only when you intentionally want to remove data.',
      },
      { type: 'h2', text: 'Mistake 4: Shipping dev images to production' },
      {
        type: 'ul',
        items: [
          'Development images often include hot reload tools, source bind mounts, debug ports, and dev dependencies.',
          'Production images should be immutable, smaller, non-root, and configured by environment.',
          'Use separate Compose overrides for development instead of putting dev behavior in the base compose.yaml.',
        ],
      },
      { type: 'h2', text: 'Mistake 5: Running everything as root' },
      {
        type: 'code',
        title: 'Add a non-root user',
        language: 'dockerfile',
        code: `RUN groupadd --system app && useradd --system --gid app --home /app app
COPY --chown=app:app . .
USER app`,
      },
      { type: 'h2', text: 'Mistake 6: Ignoring image tags' },
      {
        type: 'p',
        text: 'If every deployment uses latest, you cannot easily answer what is running or roll back safely. Tag images with commit SHA, version, or release number.',
      },
      {
        type: 'code',
        title: 'Useful tags',
        language: 'bash',
        code: `docker build -t ghcr.io/acme/api:1.4.2 .
docker build -t ghcr.io/acme/api:$(git rev-parse --short=12 HEAD) .`,
      },
      { type: 'h2', text: 'Mistake 7: Not reading logs correctly' },
      {
        type: 'code',
        title: 'Useful troubleshooting commands',
        language: 'bash',
        code: `docker ps -a
docker logs api
docker inspect api
docker compose ps
docker compose logs -f api
docker compose exec api sh`,
      },
      {
        type: 'note',
        text: 'Use docker compose exec for running commands inside an already running service container. Use docker compose run for one-off containers.',
      },
      { type: 'h2', text: 'Mistake 8: Huge images' },
      {
        type: 'ul',
        items: [
          'Use slim runtime images when possible.',
          'Use multi-stage builds for compiled languages and frontend builds.',
          'Remove package manager caches in the same layer where they are created.',
          'Avoid installing build tools into runtime images.',
        ],
      },
      { type: 'h2', text: 'Quick fixes checklist' },
      {
        type: 'keypoints',
        items: [
          'Add .dockerignore to every project.',
          'Use service names instead of localhost between containers.',
          'Persist important data with named volumes and backup plans.',
          'Keep development overrides separate from production configuration.',
          'Run as non-root and drop unnecessary privileges.',
          'Use meaningful immutable tags.',
          'Read logs before guessing.',
        ],
      },
    ],
  },
  {
    slug: 'docker-tools-ecosystem',
    title: 'Docker Ecosystem & Tools',
    description:
      'Know the wider container tooling ecosystem and when each tool helps in real workflows.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 63,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Docker is part of a larger container ecosystem. Knowing the tool categories helps you choose the right tool without chasing every new name.',
      },
      { type: 'h2', text: 'Core Docker tools' },
      {
        type: 'table',
        headers: ['Tool', 'Purpose'],
        rows: [
          ['Docker Engine', 'Builds and runs containers on a host.'],
          ['Docker CLI', 'Command-line interface for images, containers, networks, volumes, and more.'],
          ['Docker Desktop', 'Developer environment for macOS, Windows, and Linux.'],
          ['Docker Compose', 'Defines and runs multi-container applications.'],
          ['Docker Buildx', 'Advanced builds, cache, multi-platform images, and BuildKit features.'],
          ['Docker Scout', 'Image analysis, vulnerability insights, and base image recommendations.'],
        ],
      },
      { type: 'h2', text: 'Standards you will hear about' },
      {
        type: 'ul',
        items: [
          'OCI image: the standard format used by Docker and many other container platforms.',
          'OCI runtime: the standard for running containers, commonly implemented by runc.',
          'Registry: a server that stores and distributes images.',
          'SBOM: a software bill of materials describing what is inside an artifact.',
        ],
      },
      { type: 'h2', text: 'Registries' },
      {
        type: 'table',
        headers: ['Registry', 'Common use'],
        rows: [
          ['Docker Hub', 'Public images and many official images.'],
          ['GitHub Container Registry', 'Images attached to GitHub organizations and repos.'],
          ['Amazon ECR', 'AWS-native image registry.'],
          ['Google Artifact Registry', 'Google Cloud registry for containers and packages.'],
          ['Azure Container Registry', 'Azure-native image registry.'],
          ['Harbor', 'Self-hosted enterprise registry.'],
        ],
      },
      { type: 'h2', text: 'Local development helpers' },
      {
        type: 'ul',
        items: [
          'Dev Containers define a reproducible editor and development environment.',
          'Testcontainers starts real dependencies for automated tests.',
          'Colima, Rancher Desktop, and Podman Desktop can provide alternative local container environments.',
          'Tilt and Skaffold help teams develop against Kubernetes-like environments.',
        ],
      },
      { type: 'h2', text: 'Security and supply chain tools' },
      {
        type: 'table',
        headers: ['Category', 'Examples'],
        rows: [
          ['Scanning', 'Trivy, Grype, Docker Scout, Snyk'],
          ['SBOM generation', 'Syft, Docker build SBOM features'],
          ['Signing', 'Cosign, Notation'],
          ['Policy', 'Open Policy Agent, Kyverno, Conftest'],
          ['Secrets', 'Vault, cloud secret managers, SOPS'],
        ],
      },
      { type: 'h2', text: 'Orchestration options' },
      {
        type: 'ul',
        items: [
          'Docker Compose: local and single-host multi-container apps.',
          'Docker Swarm: Docker-native cluster orchestration.',
          'Kubernetes: widely adopted orchestration platform with a large ecosystem.',
          'Cloud app platforms: Render, Fly.io, Railway, Heroku-style platforms, ECS, Cloud Run, Azure Container Apps.',
          'Nomad: general-purpose scheduler often used with Consul and Vault.',
        ],
      },
      { type: 'h2', text: 'How to choose tools' },
      {
        type: 'ol',
        items: [
          'Start with Dockerfile, Compose, registry, and CI pipeline basics.',
          'Add scanning before production release.',
          'Add observability before real users depend on the system.',
          'Choose orchestration based on team skill, uptime needs, and operational budget.',
          'Prefer managed services for databases and queues when reliability matters more than learning operations.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Docker skills transfer because OCI images are widely supported.',
          'Buildx, Compose, scanning, registries, and CI are the most immediately useful additions.',
          'Do not adopt orchestration complexity before your app needs it.',
          'Choose boring, team-supported tools for production.',
        ],
      },
    ],
  },
  {
    slug: 'docker-portfolio',
    title: 'Docker in Your Portfolio',
    description:
      'Show Docker skills in portfolio projects with clear architecture, reproducible setup, and production awareness.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 64,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A Docker portfolio project should prove more than “I wrote a Dockerfile.” It should show that you can make an app easy to run, explain the architecture, and understand production tradeoffs.',
      },
      { type: 'h2', text: 'What a strong Docker portfolio includes' },
      {
        type: 'ul',
        items: [
          'A clean Dockerfile with sensible layers, non-root runtime, and minimal image size.',
          'A compose.yaml that starts the full app with one command.',
          'A README with setup, commands, environment variables, and troubleshooting notes.',
          'At least one persistent service such as Postgres, Redis, or object storage emulator.',
          'Health checks and clear logs.',
          'A short section describing production changes you would make.',
        ],
      },
      { type: 'h2', text: 'Portfolio README template' },
      {
        type: 'code',
        title: 'README sections',
        language: 'text',
        code: `# Project Name

## What it does
Short explanation of the app and users.

## Architecture
- web: Next.js frontend
- api: Flask API
- db: Postgres
- nginx: reverse proxy

## Run locally
docker compose up --build

## Environment variables
Copy .env.example to .env and change values.

## Useful commands
docker compose logs -f api
docker compose exec db psql -U app -d app

## Production notes
- Use registry images instead of building on the server.
- Use managed secrets.
- Add TLS, backups, monitoring, and image scanning.`,
      },
      { type: 'h2', text: 'Add an architecture diagram' },
      {
        type: 'code',
        title: 'Simple text diagram',
        language: 'text',
        code: `User Browser
  |
  v
Nginx :8080
  |
  +--> Frontend container
  |
  +--> API container
          |
          +--> Postgres volume
          +--> Redis queue`,
      },
      { type: 'h2', text: 'Demonstrate real commands' },
      {
        type: 'code',
        title: 'Portfolio command block',
        language: 'bash',
        code: `docker compose up --build -d
docker compose ps
curl http://localhost:8080/health
docker compose logs --tail=50 api
docker compose down`,
      },
      { type: 'h2', text: 'Good project ideas' },
      {
        type: 'ul',
        items: [
          'Task tracker with API, worker, Postgres, and Redis.',
          'Blog or CMS with Nginx, app server, database, and backups.',
          'Data pipeline with scheduler, worker, database, and object storage emulator.',
          'Realtime chat app with WebSocket service, Redis pub/sub, and reverse proxy.',
          'ML inference API with a model volume and container health checks.',
        ],
      },
      { type: 'h2', text: 'What employers notice' },
      {
        type: 'table',
        headers: ['Signal', 'Why it helps'],
        rows: [
          ['One-command setup', 'Shows empathy for reviewers and teammates.'],
          ['Clear service boundaries', 'Shows architecture thinking.'],
          ['Non-root containers', 'Shows security awareness.'],
          ['Backups and health checks', 'Shows production thinking.'],
          ['CI build and scan', 'Shows shipping discipline.'],
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Make the project easy to run and easy to understand.',
          'Explain why each service exists.',
          'Document production gaps honestly.',
          'Show commands, logs, health checks, and backup thinking.',
        ],
      },
    ],
  },
  {
    slug: 'docker-next-steps',
    title: 'What to Learn After Docker',
    description:
      'Choose your next learning path after Docker: CI/CD, cloud deployment, Kubernetes, security, or platform engineering.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 65,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'After Docker, you can run applications consistently. The next step is learning how teams build, secure, deploy, observe, and operate those applications at scale.',
      },
      { type: 'h2', text: 'Path 1: CI/CD and release engineering' },
      {
        type: 'ul',
        items: [
          'GitHub Actions, GitLab CI, CircleCI, or another CI system.',
          'Buildx caching and multi-platform builds.',
          'Image tags, digests, release promotion, and rollback.',
          'Automated tests, smoke tests, scanning, and deployment approvals.',
        ],
      },
      { type: 'h2', text: 'Path 2: Cloud container deployment' },
      {
        type: 'ul',
        items: [
          'AWS ECS, AWS App Runner, Google Cloud Run, Azure Container Apps, Fly.io, Render, Railway, or similar platforms.',
          'Managed databases, managed Redis, object storage, load balancers, and TLS.',
          'Environment variables and secret managers.',
          'Basic networking, domains, and HTTPS.',
        ],
      },
      { type: 'h2', text: 'Path 3: Kubernetes' },
      {
        type: 'ol',
        items: [
          'Pods, Deployments, Services, ConfigMaps, and Secrets.',
          'Ingress, TLS, resource requests, resource limits, and probes.',
          'Helm or Kustomize for packaging manifests.',
          'RBAC, network policies, and cluster observability.',
          'GitOps with Argo CD or Flux when you are ready.',
        ],
      },
      { type: 'h2', text: 'Path 4: Security and supply chain' },
      {
        type: 'ul',
        items: [
          'Image scanning and vulnerability triage.',
          'SBOM generation and artifact signing.',
          'Least privilege runtime configuration.',
          'Secret management and rotation.',
          'Policy-as-code for deployment rules.',
        ],
      },
      { type: 'h2', text: 'Path 5: Observability and operations' },
      {
        type: 'ul',
        items: [
          'Structured logging and log aggregation.',
          'Metrics with Prometheus-style thinking.',
          'Dashboards and alerting based on user impact.',
          'Distributed tracing for multi-service systems.',
          'Incident response, runbooks, and postmortems.',
        ],
      },
      { type: 'h2', text: 'A 30-day learning plan' },
      {
        type: 'table',
        headers: ['Week', 'Focus', 'Deliverable'],
        rows: [
          ['1', 'CI/CD', 'Build, test, scan, and push an image from CI.'],
          ['2', 'Cloud deploy', 'Deploy the image to a managed container platform with HTTPS.'],
          ['3', 'Observability', 'Add logs, health checks, metrics, and a small dashboard.'],
          ['4', 'Orchestration intro', 'Deploy a stateless app to local Kubernetes or a learning cluster.'],
        ],
      },
      { type: 'h2', text: 'Final Docker checklist' },
      {
        type: 'keypoints',
        items: [
          'You can explain images, containers, Dockerfiles, volumes, networks, and Compose.',
          'You can build small, secure images with non-root users.',
          'You can run multi-service projects with private networks and persistent data.',
          'You can scan, tag, push, and deploy images from CI.',
          'You understand when to move from Compose to an orchestrator.',
          'You can talk about backups, observability, and production tradeoffs.',
        ],
      },
      {
        type: 'try',
        text: 'Choose one capstone project from this tutorial. Add CI image builds, a scan step, a README architecture diagram, and a short production-readiness section.',
      },
    ],
  },
];
