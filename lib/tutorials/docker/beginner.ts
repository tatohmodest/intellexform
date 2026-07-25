import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-docker',
    title: 'What is Docker?',
    description: 'Learn what Docker is, why developers use it, and how containers make apps easier to run.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 10,
    content: [
      { type: 'p', text: 'Docker is a platform for building, shipping, and running applications in containers. A container packages an app with the files, libraries, and settings it needs so it can run in a predictable way on different machines.' },
      { type: 'p', text: 'Beginners often meet Docker when a project says, "Run this command and the whole app starts." Instead of installing every database, language runtime, and tool directly on your computer, Docker can run them in isolated containers.' },
      { type: 'h2', text: 'The problem Docker solves' },
      { type: 'p', text: 'Without containers, an app may work on one laptop but fail on another because versions or settings are different. Docker helps teams describe the app environment as code so everyone can start from the same setup.' },
      {
        type: 'table',
        headers: ['Before Docker', 'With Docker'],
        rows: [
          ['Install many tools manually', 'Run packaged containers'],
          ['Different versions on each machine', 'Use the same image everywhere'],
          ['Harder onboarding for new developers', 'Start with a few commands'],
          ['Messy local cleanup', 'Remove containers and images when done']
        ]
      },
      { type: 'h2', text: 'A simple Docker command' },
      { type: 'p', text: 'The docker command talks to Docker Engine. This example asks Docker to run a tiny test image named hello-world.' },
      {
        type: 'code',
        title: 'Run a test container',
        language: 'bash',
        code: `docker run hello-world`
      },
      {
        type: 'code',
        title: 'Common Docker objects',
        language: 'text',
        code: `Image      A template used to create containers
Container  A running or stopped instance of an image
Volume     Persistent storage managed by Docker
Network    A private connection space for containers`
      },
      { type: 'h2', text: 'Where Docker is used' },
      { type: 'ul', items: ['Local development environments', 'Running databases and queues for practice projects', 'Continuous integration test jobs', 'Packaging web apps and APIs', 'Learning DevOps and deployment workflows'] },
      { type: 'note', text: 'Docker does not replace learning your programming language or database. It gives you a reliable way to run those tools and your applications.' },
      { type: 'try', text: 'Look at a project you have used before. List the services it might need, such as a web app, database, cache, or background worker. Those are good candidates for containers.' },
      { type: 'keypoints', items: ['Docker runs applications in containers.', 'A container packages an app with the runtime files it needs.', 'Docker helps reduce "works on my machine" problems.', 'Images, containers, volumes, and networks are core Docker ideas.'] }
    ]
  },
  {
    slug: 'docker-vs-vm',
    title: 'Containers vs Virtual Machines',
    description: 'Understand the difference between Docker containers and virtual machines in beginner-friendly terms.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 10,
    content: [
      { type: 'p', text: 'Containers and virtual machines both isolate software, but they do it differently. A virtual machine includes a full guest operating system, while a container shares the host operating system kernel and isolates the application process.' },
      { type: 'p', text: 'This is why containers usually start faster and use fewer resources than virtual machines. They are designed for packaging and running applications, not for pretending to be an entire computer.' },
      { type: 'h2', text: 'Virtual machines' },
      { type: 'p', text: 'A virtual machine runs on a hypervisor. It has virtual hardware, a full operating system, and then your app. VMs are powerful when you need strong isolation or a different operating system environment.' },
      {
        type: 'code',
        title: 'VM mental model',
        language: 'text',
        code: `Hardware
Host operating system
Hypervisor
Guest operating system
Application dependencies
Your application`
      },
      { type: 'h2', text: 'Containers' },
      { type: 'p', text: 'A container packages your application and dependencies. It runs as an isolated process on the host through Docker Engine. Containers do not boot a full guest operating system for each app.' },
      {
        type: 'code',
        title: 'Container mental model',
        language: 'text',
        code: `Hardware
Host operating system kernel
Docker Engine
Container filesystem and process
Your application`
      },
      {
        type: 'table',
        headers: ['Feature', 'Container', 'Virtual machine'],
        rows: [
          ['Startup', 'Usually seconds or less', 'Usually slower'],
          ['Size', 'Often MBs to hundreds of MBs', 'Often GBs'],
          ['Operating system', 'Shares host kernel', 'Includes guest OS'],
          ['Best for', 'Apps and services', 'Full OS isolation']
        ]
      },
      { type: 'h2', text: 'A quick comparison command' },
      {
        type: 'code',
        title: 'Start a short-lived container',
        language: 'bash',
        code: `docker run --rm alpine echo "This container started, printed, and exited."`
      },
      { type: 'tip', text: 'Docker Desktop may use a lightweight Linux VM behind the scenes on macOS and Windows. Your containers still behave like containers; Docker Desktop manages the VM for you.' },
      { type: 'try', text: 'Explain the difference to a friend using this sentence: "A VM is like a whole computer; a container is like an isolated app process with its files."' },
      { type: 'keypoints', items: ['Virtual machines include a guest operating system.', 'Containers share the host kernel and isolate app processes.', 'Containers are usually smaller and faster to start.', 'Docker Desktop hides some platform details on macOS and Windows.'] }
    ]
  },
  {
    slug: 'docker-install',
    title: 'Install Docker Desktop / Engine',
    description: 'Install Docker on your computer and verify that the modern Docker CLI and Compose V2 are available.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 12,
    content: [
      { type: 'p', text: 'To use Docker, you need Docker Engine. Many beginners install Docker Desktop because it includes Docker Engine, the Docker CLI, Compose V2, a dashboard, and helpful local development features.' },
      { type: 'p', text: 'On Linux servers, developers often install Docker Engine directly. On macOS and Windows, Docker Desktop is the standard beginner-friendly option.' },
      { type: 'h2', text: 'Choose the right installation' },
      {
        type: 'table',
        headers: ['Platform', 'Common choice'],
        rows: [
          ['Windows', 'Docker Desktop with WSL 2 backend'],
          ['macOS', 'Docker Desktop for Apple silicon or Intel chip'],
          ['Linux desktop', 'Docker Desktop or Docker Engine'],
          ['Linux server', 'Docker Engine from Docker docs or distro packages']
        ]
      },
      { type: 'h2', text: 'Check Docker Engine' },
      { type: 'p', text: 'After installation, open a new terminal. The version command should show both client and server information when Docker is running.' },
      {
        type: 'code',
        title: 'Check Docker version',
        language: 'bash',
        code: `docker version`
      },
      {
        type: 'code',
        title: 'Short version check',
        language: 'bash',
        code: `docker --version`
      },
      { type: 'h2', text: 'Check Docker Compose V2' },
      { type: 'p', text: 'Modern Compose is used as a Docker CLI subcommand: docker compose. This tutorial uses Docker Compose V2, not the older docker-compose command.' },
      {
        type: 'code',
        title: 'Check Compose V2',
        language: 'bash',
        code: `docker compose version`
      },
      { type: 'h2', text: 'A useful information command' },
      {
        type: 'code',
        title: 'Show Docker system info',
        language: 'bash',
        code: `docker info`
      },
      { type: 'note', text: 'If Docker Desktop is installed but commands fail, make sure Docker Desktop is open and fully started before running terminal commands.' },
      { type: 'tip', text: 'On Linux, you may need to add your user to the docker group or use sudo depending on how Docker Engine was installed. Follow the official Docker documentation for your distribution.' },
      { type: 'try', text: 'Install Docker, restart your terminal, and run docker --version plus docker compose version. Save the output in a notes file for troubleshooting later.' },
      { type: 'keypoints', items: ['Docker Desktop is the easiest install path for many beginners.', 'Docker Engine is the service that builds and runs containers.', 'Use docker compose for modern Compose V2.', 'Verify installation from a new terminal window.'] }
    ]
  },
  {
    slug: 'docker-hello',
    title: 'Your First Container (hello-world)',
    description: 'Run the hello-world image and understand what Docker does behind the scenes.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 9,
    content: [
      { type: 'p', text: 'The hello-world image is a tiny Docker image made for testing your installation. It prints a message that confirms Docker can download an image, create a container, run it, and show output.' },
      { type: 'h2', text: 'Run hello-world' },
      {
        type: 'code',
        title: 'First Docker run',
        language: 'bash',
        code: `docker run hello-world`
      },
      { type: 'p', text: 'If Docker cannot find the image locally, it pulls the image from Docker Hub. Then it creates a new container from that image and runs the container command.' },
      { type: 'h2', text: 'What happened?' },
      {
        type: 'ol',
        items: [
          'The Docker CLI sent your request to Docker Engine.',
          'Docker checked whether the hello-world image existed locally.',
          'Docker pulled the image because it was missing.',
          'Docker created a container from the image.',
          'The container printed a message and exited.'
        ]
      },
      {
        type: 'code',
        title: 'See containers that already exited',
        language: 'bash',
        code: `docker ps -a`
      },
      {
        type: 'code',
        title: 'Example status',
        language: 'text',
        code: `CONTAINER ID   IMAGE         COMMAND    STATUS
abc123def456   hello-world   "/hello"   Exited (0)`
      },
      { type: 'h2', text: 'Run another small image' },
      {
        type: 'code',
        title: 'Run Alpine Linux and print text',
        language: 'bash',
        code: `docker run --rm alpine echo "Hello from Alpine"`
      },
      { type: 'note', text: 'The --rm flag removes the container after it exits. It is useful for quick tests that do not need to keep container history.' },
      { type: 'try', text: 'Run docker run hello-world twice. Notice that the second run is usually faster because Docker already has the image locally.' },
      { type: 'keypoints', items: ['docker run creates and starts a container from an image.', 'Docker pulls missing images automatically by default.', 'A container can run briefly and then exit successfully.', 'docker ps -a shows stopped containers too.'] }
    ]
  },
  {
    slug: 'docker-architecture',
    title: 'Docker Architecture (Client, Daemon, Images)',
    description: 'Learn the main parts of Docker: CLI client, daemon, registries, images, and containers.',
    level: 'beginner',
    section: 'Getting Started',
    order: 5,
    minutes: 11,
    content: [
      { type: 'p', text: 'Docker has several parts that work together. You type commands in the Docker client, the Docker daemon does the work, images provide templates, and containers run from those images.' },
      { type: 'h2', text: 'The main pieces' },
      {
        type: 'table',
        headers: ['Piece', 'What it does'],
        rows: [
          ['Docker CLI', 'The docker command you type in the terminal'],
          ['Docker daemon', 'The background service that builds, pulls, and runs containers'],
          ['Image', 'A read-only package used to create containers'],
          ['Container', 'A runnable instance of an image'],
          ['Registry', 'A place to store and download images, such as Docker Hub']
        ]
      },
      { type: 'h2', text: 'Client and daemon' },
      { type: 'p', text: 'When you run a command, the Docker CLI sends an API request to the Docker daemon. The daemon may create containers, build images, manage networks, or contact registries.' },
      {
        type: 'code',
        title: 'Client asks the daemon for info',
        language: 'bash',
        code: `docker info`
      },
      {
        type: 'code',
        title: 'Architecture flow',
        language: 'text',
        code: `You type: docker run nginx
        |
        v
Docker CLI sends request
        |
        v
Docker daemon pulls image if needed
        |
        v
Docker daemon creates and starts container`
      },
      { type: 'h2', text: 'Images, layers, and containers' },
      { type: 'p', text: 'Images are built in layers. When a container starts, Docker adds a writable container layer on top. This design makes images reusable and efficient.' },
      {
        type: 'code',
        title: 'List local images',
        language: 'bash',
        code: `docker images`
      },
      { type: 'tip', text: 'If Docker commands say they cannot connect to the daemon, Docker Engine is not running or your user does not have permission to talk to it.' },
      { type: 'try', text: 'Run docker info and find the Server Version line. Then run docker images and notice which images are already on your machine.' },
      { type: 'keypoints', items: ['The Docker CLI is the command-line client.', 'The Docker daemon performs container and image work.', 'Registries store images for download and sharing.', 'Containers are created from images.'] }
    ]
  },
  {
    slug: 'docker-images',
    title: 'Images Explained',
    description: 'Understand Docker images, tags, layers, and how images become containers.',
    level: 'beginner',
    section: 'Images & Containers',
    order: 6,
    minutes: 11,
    content: [
      { type: 'p', text: 'A Docker image is a packaged template for creating containers. It contains a filesystem, default command, metadata, and the files needed by an application or tool.' },
      { type: 'p', text: 'Images are read-only. When you run an image, Docker creates a container with a writable layer so the running process can create or change files without modifying the original image.' },
      { type: 'h2', text: 'Image names and tags' },
      { type: 'p', text: 'Images commonly use the format name:tag. The tag points to a version or variant. For example, nginx:alpine means the nginx image with the alpine tag.' },
      {
        type: 'code',
        title: 'Pull specific images',
        language: 'bash',
        code: `docker pull nginx:alpine
docker pull python:3.12-slim`
      },
      {
        type: 'code',
        title: 'List images',
        language: 'bash',
        code: `docker image ls`
      },
      {
        type: 'table',
        headers: ['Image reference', 'Meaning'],
        rows: [
          ['nginx', 'The nginx image using the default latest tag'],
          ['nginx:alpine', 'The nginx image using an Alpine Linux based variant'],
          ['python:3.12-slim', 'Python 3.12 with a smaller Debian-based filesystem'],
          ['postgres:16', 'PostgreSQL major version 16 image']
        ]
      },
      { type: 'h2', text: 'Layers' },
      { type: 'p', text: 'Images are made of layers. Layers let Docker reuse downloaded or built pieces. If two images share layers, Docker does not need to store everything twice.' },
      {
        type: 'code',
        title: 'Inspect image metadata',
        language: 'bash',
        code: `docker image inspect nginx:alpine`
      },
      { type: 'note', text: 'The latest tag is not always the safest choice for real projects because it can change over time. Pin important projects to a specific version when possible.' },
      { type: 'try', text: 'Pull nginx:alpine and python:3.12-slim. Run docker image ls and compare their sizes.' },
      { type: 'keypoints', items: ['Images are read-only templates for containers.', 'Tags identify versions or variants of images.', 'Docker images are built from reusable layers.', 'A container adds a writable layer on top of an image.'] }
    ]
  },
  {
    slug: 'docker-containers',
    title: 'Containers Explained',
    description: 'Learn what containers are, how they start and stop, and why containers can be temporary.',
    level: 'beginner',
    section: 'Images & Containers',
    order: 7,
    minutes: 10,
    content: [
      { type: 'p', text: 'A container is a running or stopped instance of an image. If an image is like a recipe, a container is the actual meal made from that recipe.' },
      { type: 'p', text: 'Containers have their own filesystem, process list, network view, and environment variables. They are isolated from your host and from other containers, but they still use the host machine resources.' },
      { type: 'h2', text: 'Run a short-lived container' },
      {
        type: 'code',
        title: 'Print and exit',
        language: 'bash',
        code: `docker run --name friendly-alpine alpine echo "Containers can be short-lived."`
      },
      { type: 'p', text: 'This container runs a command and exits. It does not stay running because the command finished.' },
      {
        type: 'code',
        title: 'See stopped containers',
        language: 'bash',
        code: `docker ps -a`
      },
      { type: 'h2', text: 'Run a long-running container' },
      { type: 'p', text: 'Web servers and databases stay running because their main process keeps running.' },
      {
        type: 'code',
        title: 'Run Nginx in the background',
        language: 'bash',
        code: `docker run -d --name web-demo nginx:alpine`
      },
      {
        type: 'code',
        title: 'See running containers',
        language: 'bash',
        code: `docker ps`
      },
      { type: 'h2', text: 'Container lifecycle' },
      { type: 'ul', items: ['Created: Docker has made the container but it is not running yet', 'Running: the container main process is active', 'Exited: the main process stopped', 'Paused: processes are temporarily frozen', 'Removed: Docker deleted the container record and writable layer'] },
      { type: 'tip', text: 'Containers are meant to be replaceable. Store important data in volumes or external services instead of relying on a container writable layer.' },
      { type: 'try', text: 'Run the Alpine example, then run the Nginx example. Use docker ps and docker ps -a to compare running and stopped containers.' },
      { type: 'keypoints', items: ['Containers are instances of images.', 'Short commands exit when the command finishes.', 'Services stay running while their main process runs.', 'Important data should live outside disposable containers.'] }
    ]
  },
  {
    slug: 'docker-run',
    title: 'docker run Essentials',
    description: 'Learn the most important docker run options for names, detached mode, cleanup, ports, and environment variables.',
    level: 'beginner',
    section: 'Images & Containers',
    order: 8,
    minutes: 13,
    content: [
      { type: 'p', text: 'docker run is one of the most important Docker commands. It creates a new container from an image and starts it. Many options customize how the container runs.' },
      { type: 'h2', text: 'The basic shape' },
      {
        type: 'code',
        title: 'docker run pattern',
        language: 'bash',
        code: `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`
      },
      { type: 'p', text: 'Options come before the image name. The optional command after the image replaces the default command defined by the image.' },
      { type: 'h2', text: 'Common run options' },
      {
        type: 'table',
        headers: ['Option', 'Meaning'],
        rows: [
          ['--name', 'Give the container a friendly name'],
          ['-d', 'Run in detached mode in the background'],
          ['--rm', 'Remove the container automatically after it exits'],
          ['-p', 'Publish a container port to the host'],
          ['-e', 'Set an environment variable'],
          ['-it', 'Interactive terminal mode']
        ]
      },
      {
        type: 'code',
        title: 'Run and remove after exit',
        language: 'bash',
        code: `docker run --rm alpine date`
      },
      {
        type: 'code',
        title: 'Run a named web server',
        language: 'bash',
        code: `docker run -d --name beginner-nginx -p 8080:80 nginx:alpine`
      },
      { type: 'h2', text: 'Interactive containers' },
      { type: 'p', text: 'Use -it when you want a terminal inside a container. This is helpful for learning, debugging, or running tools without installing them on your host.' },
      {
        type: 'code',
        title: 'Open a shell in Alpine',
        language: 'bash',
        code: `docker run --rm -it alpine sh`
      },
      { type: 'h2', text: 'Environment variables' },
      {
        type: 'code',
        title: 'Set an environment variable',
        language: 'bash',
        code: `docker run --rm -e APP_ENV=development alpine sh -c 'echo "Mode: $APP_ENV"'`
      },
      { type: 'note', text: 'A container name must be unique while that container exists. If you reuse a name, remove or rename the old container first.' },
      { type: 'try', text: 'Start nginx with -d, --name, and -p 8080:80. Open http://localhost:8080, then stop and remove the container in the next lesson.' },
      { type: 'keypoints', items: ['docker run creates and starts a new container.', 'Use --name for readable container names.', 'Use -d for background services and --rm for temporary tasks.', 'Use -p and -e to configure networking and environment variables.'] }
    ]
  },
  {
    slug: 'docker-ps-logs',
    title: 'ps, logs, exec & inspect',
    description: 'Use everyday commands to view containers, read logs, run commands inside containers, and inspect metadata.',
    level: 'beginner',
    section: 'Images & Containers',
    order: 9,
    minutes: 12,
    content: [
      { type: 'p', text: 'After containers are running, you need ways to observe and debug them. Docker provides commands to list containers, read logs, execute commands inside containers, and inspect detailed metadata.' },
      { type: 'h2', text: 'List containers with ps' },
      {
        type: 'code',
        title: 'Running containers only',
        language: 'bash',
        code: `docker ps`
      },
      {
        type: 'code',
        title: 'All containers',
        language: 'bash',
        code: `docker ps -a`
      },
      { type: 'h2', text: 'Read logs' },
      { type: 'p', text: 'Logs show output written by the container main process. For web apps, this is often request logs and startup messages.' },
      {
        type: 'code',
        title: 'Start a logging container',
        language: 'bash',
        code: `docker run -d --name log-demo nginx:alpine
docker logs log-demo`
      },
      {
        type: 'code',
        title: 'Follow logs live',
        language: 'bash',
        code: `docker logs -f log-demo`
      },
      { type: 'h2', text: 'Run commands inside a container' },
      { type: 'p', text: 'docker exec runs a command in an already running container. This is useful for checking files, environment variables, or installed tools.' },
      {
        type: 'code',
        title: 'Open a shell inside Nginx',
        language: 'bash',
        code: `docker exec -it log-demo sh`
      },
      { type: 'h2', text: 'Inspect details' },
      {
        type: 'code',
        title: 'Inspect a container',
        language: 'bash',
        code: `docker inspect log-demo`
      },
      {
        type: 'code',
        title: 'Format one inspect value',
        language: 'bash',
        code: `docker inspect --format '{{.State.Status}}' log-demo`
      },
      { type: 'tip', text: 'Use container names in beginner practice. Names are easier to remember than container IDs.' },
      { type: 'try', text: 'Start an nginx container named log-demo, view docker ps, read docker logs log-demo, and use docker exec -it log-demo sh to look around.' },
      { type: 'keypoints', items: ['docker ps lists containers.', 'docker logs reads output from a container.', 'docker exec runs a command inside a running container.', 'docker inspect shows detailed JSON metadata.'] }
    ]
  },
  {
    slug: 'docker-stop-rm',
    title: 'Start, Stop, Restart & Remove',
    description: 'Manage the container lifecycle with start, stop, restart, rm, and cleanup commands.',
    level: 'beginner',
    section: 'Images & Containers',
    order: 10,
    minutes: 10,
    content: [
      { type: 'p', text: 'Containers can be started, stopped, restarted, and removed. These commands help you keep your Docker environment clean while practicing.' },
      { type: 'h2', text: 'Start a practice container' },
      {
        type: 'code',
        title: 'Run Nginx for lifecycle practice',
        language: 'bash',
        code: `docker run -d --name lifecycle-web -p 8081:80 nginx:alpine`
      },
      { type: 'h2', text: 'Stop and start' },
      {
        type: 'code',
        title: 'Stop, start, and restart',
        language: 'bash',
        code: `docker stop lifecycle-web
docker start lifecycle-web
docker restart lifecycle-web`
      },
      { type: 'p', text: 'docker stop asks the main process to shut down gracefully. If a process does not stop in time, Docker can force it to stop.' },
      { type: 'h2', text: 'Remove containers' },
      {
        type: 'code',
        title: 'Stop and remove a container',
        language: 'bash',
        code: `docker stop lifecycle-web
docker rm lifecycle-web`
      },
      {
        type: 'code',
        title: 'Force remove a running container',
        language: 'bash',
        code: `docker rm -f lifecycle-web`
      },
      { type: 'h2', text: 'Clean up stopped containers' },
      {
        type: 'code',
        title: 'Remove all stopped containers',
        language: 'bash',
        code: `docker container prune`
      },
      {
        type: 'table',
        headers: ['Command', 'Use it when'],
        rows: [
          ['docker stop', 'You want to stop a running container'],
          ['docker start', 'You want to start an existing stopped container'],
          ['docker restart', 'You want to stop and start in one command'],
          ['docker rm', 'You want to delete a stopped container'],
          ['docker rm -f', 'You want to force remove a running container']
        ]
      },
      { type: 'warning', text: 'Removing a container deletes its writable container layer. Data in named volumes is not deleted by docker rm, but data stored only inside the container can be lost.' },
      { type: 'tip', text: 'Use docker ps -a before cleanup so you can see exactly which stopped containers still exist.' },
      { type: 'try', text: 'Create lifecycle-web, stop it, start it again, restart it, and finally remove it. Use docker ps -a after each step.' },
      { type: 'keypoints', items: ['Stopped containers still exist until removed.', 'docker start reuses an existing container; docker run creates a new one.', 'docker rm deletes a container.', 'docker container prune removes stopped containers after confirmation.'] }
    ]
  },
  {
    slug: 'docker-hub',
    title: 'Docker Hub & Pulling Images',
    description: 'Learn how Docker Hub works, how to pull images, and how to choose safer image tags.',
    level: 'beginner',
    section: 'Images & Containers',
    order: 11,
    minutes: 11,
    content: [
      { type: 'p', text: 'Docker Hub is a public registry where many official and community Docker images are stored. When you run an image that is not on your machine, Docker often pulls it from Docker Hub automatically.' },
      { type: 'h2', text: 'Pull an image' },
      {
        type: 'code',
        title: 'Download an image without running it',
        language: 'bash',
        code: `docker pull redis:7-alpine`
      },
      {
        type: 'code',
        title: 'Run the pulled image',
        language: 'bash',
        code: `docker run --rm redis:7-alpine redis-server --version`
      },
      { type: 'h2', text: 'Official images' },
      { type: 'p', text: 'Official images are maintained with Docker and upstream project guidance. Examples include nginx, postgres, redis, node, python, and ubuntu.' },
      {
        type: 'table',
        headers: ['Image', 'Common beginner use'],
        rows: [
          ['nginx', 'Serve static files or test web server containers'],
          ['postgres', 'Run a local PostgreSQL database'],
          ['redis', 'Run a cache or queue-like service for development'],
          ['node', 'Run JavaScript and Node.js apps'],
          ['python', 'Run Python scripts and web apps']
        ]
      },
      { type: 'h2', text: 'Search from the terminal' },
      {
        type: 'code',
        title: 'Search Docker Hub',
        language: 'bash',
        code: `docker search nginx`
      },
      { type: 'p', text: 'The Docker Hub website is usually better for reading documentation, tags, examples, and environment variable requirements.' },
      { type: 'h2', text: 'Remove images you no longer need' },
      {
        type: 'code',
        title: 'Remove an image',
        language: 'bash',
        code: `docker image rm redis:7-alpine`
      },
      { type: 'tip', text: 'Read the image documentation before running databases or tools. Many official images require environment variables or volumes for real use.' },
      { type: 'try', text: 'Visit Docker Hub in a browser and search for the official postgres image. Find the environment variable used to set the initial password.' },
      { type: 'keypoints', items: ['Docker Hub is a popular public image registry.', 'docker pull downloads an image without running it.', 'Official images are good beginner choices.', 'Use specific tags instead of relying on latest for important work.'] }
    ]
  },
  {
    slug: 'dockerfile-intro',
    title: 'Dockerfile Intro',
    description: 'Create your first Dockerfile and understand how Docker builds a custom image.',
    level: 'beginner',
    section: 'Building Images',
    order: 12,
    minutes: 12,
    content: [
      { type: 'p', text: 'A Dockerfile is a text file with instructions for building a Docker image. It describes the base image, files to copy, commands to run, and the default command for containers created from the image.' },
      { type: 'p', text: 'You use Dockerfiles when you want to package your own application instead of only running images created by other people.' },
      { type: 'h2', text: 'A tiny static website image' },
      {
        type: 'code',
        title: 'index.html',
        language: 'text',
        code: `<h1>Hello from my Docker image</h1>
<p>This page is served by Nginx.</p>`
      },
      {
        type: 'code',
        title: 'Dockerfile',
        language: 'dockerfile',
        code: `FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html`
      },
      { type: 'h2', text: 'Build and run it' },
      {
        type: 'code',
        title: 'Build the image',
        language: 'bash',
        code: `docker build -t my-static-site .`
      },
      {
        type: 'code',
        title: 'Run the image',
        language: 'bash',
        code: `docker run --rm -p 8080:80 my-static-site`
      },
      { type: 'p', text: 'The dot at the end of docker build means "use the current folder as the build context." Docker sends that folder to the builder so COPY instructions can use files from it.' },
      { type: 'h2', text: 'Dockerfile naming' },
      { type: 'p', text: 'The file is normally named Dockerfile with no extension. Docker looks for that name by default when you run docker build.' },
      { type: 'note', text: 'Dockerfile instructions are usually written in uppercase by convention, such as FROM and COPY.' },
      { type: 'try', text: 'Create a folder with index.html and Dockerfile. Build my-static-site, run it on port 8080, and open http://localhost:8080.' },
      { type: 'keypoints', items: ['A Dockerfile describes how to build an image.', 'FROM chooses the base image.', 'COPY places files into the image.', 'docker build uses a build context, often the current folder.'] }
    ]
  },
  {
    slug: 'dockerfile-instructions',
    title: 'FROM, RUN, COPY, CMD, ENTRYPOINT',
    description: 'Learn the beginner Dockerfile instructions you will see in most real projects.',
    level: 'beginner',
    section: 'Building Images',
    order: 13,
    minutes: 13,
    content: [
      { type: 'p', text: 'Dockerfiles are built from instructions. Each instruction changes image metadata, adds files, or creates a new layer. Beginners should become comfortable with FROM, RUN, COPY, CMD, and ENTRYPOINT first.' },
      { type: 'h2', text: 'Core instructions' },
      {
        type: 'table',
        headers: ['Instruction', 'Purpose'],
        rows: [
          ['FROM', 'Choose the base image'],
          ['RUN', 'Run a command while building the image'],
          ['COPY', 'Copy files from your build context into the image'],
          ['CMD', 'Provide the default command for containers'],
          ['ENTRYPOINT', 'Configure the main executable for containers']
        ]
      },
      { type: 'h2', text: 'A simple Python image' },
      {
        type: 'code',
        title: 'app.py',
        language: 'text',
        code: `print("Hello from a Python container")`
      },
      {
        type: 'code',
        title: 'Dockerfile with CMD',
        language: 'dockerfile',
        code: `FROM python:3.12-slim
WORKDIR /app
COPY app.py .
CMD ["python", "app.py"]`
      },
      {
        type: 'code',
        title: 'Build and run',
        language: 'bash',
        code: `docker build -t python-hello .
docker run --rm python-hello`
      },
      { type: 'h2', text: 'RUN happens at build time' },
      { type: 'p', text: 'RUN is used to install packages or prepare files while building the image. CMD runs later, when a container starts.' },
      {
        type: 'code',
        title: 'RUN example',
        language: 'dockerfile',
        code: `FROM alpine:3.20
RUN apk add --no-cache curl
CMD ["curl", "--version"]`
      },
      { type: 'h2', text: 'CMD and ENTRYPOINT' },
      { type: 'p', text: 'CMD is easy for beginners because users can replace it by adding a command after the image name. ENTRYPOINT is useful when the image should behave like a specific executable.' },
      {
        type: 'code',
        title: 'ENTRYPOINT example',
        language: 'dockerfile',
        code: `FROM alpine:3.20
ENTRYPOINT ["echo"]
CMD ["Hello from ENTRYPOINT"]`
      },
      { type: 'tip', text: 'Prefer the JSON-array form for CMD and ENTRYPOINT, such as ["node", "server.js"]. It avoids surprises from shell parsing.' },
      { type: 'try', text: 'Build the Python example. Then run docker run --rm python-hello python --version to override the CMD.' },
      { type: 'keypoints', items: ['FROM starts a Dockerfile from a base image.', 'RUN executes during image build.', 'COPY adds files from the build context.', 'CMD and ENTRYPOINT affect what runs when a container starts.'] }
    ]
  },
  {
    slug: 'docker-build',
    title: 'docker build & Tags',
    description: 'Build Docker images, tag them clearly, and understand the build context.',
    level: 'beginner',
    section: 'Building Images',
    order: 14,
    minutes: 12,
    content: [
      { type: 'p', text: 'docker build reads a Dockerfile and creates an image. Tags give that image a readable name and version so you can run it later without using an image ID.' },
      { type: 'h2', text: 'Build with a tag' },
      {
        type: 'code',
        title: 'Build command',
        language: 'bash',
        code: `docker build -t my-app:1.0 .`
      },
      { type: 'p', text: 'The -t option tags the image. The dot is the build context. Docker can only COPY files that are inside the build context.' },
      {
        type: 'code',
        title: 'List your image',
        language: 'bash',
        code: `docker image ls my-app`
      },
      { type: 'h2', text: 'Tag an existing image' },
      {
        type: 'code',
        title: 'Add another tag',
        language: 'bash',
        code: `docker tag my-app:1.0 my-app:latest`
      },
      {
        type: 'code',
        title: 'Run by tag',
        language: 'bash',
        code: `docker run --rm my-app:1.0`
      },
      { type: 'h2', text: 'Build output and cache' },
      { type: 'p', text: 'Docker uses build cache to avoid repeating unchanged steps. If your Dockerfile and copied files have not changed, a later build can reuse previous layers.' },
      {
        type: 'code',
        title: 'Build without cache',
        language: 'bash',
        code: `docker build --no-cache -t my-app:no-cache .`
      },
      {
        type: 'table',
        headers: ['Part', 'Example', 'Meaning'],
        rows: [
          ['Repository', 'my-app', 'The image name'],
          ['Tag', '1.0', 'The version or variant'],
          ['Context', '.', 'Folder sent to the builder'],
          ['Dockerfile', 'Dockerfile', 'Default build instructions file']
        ]
      },
      { type: 'note', text: 'A tag is a label, not a permanent guarantee. You can move a tag to a different image by tagging or rebuilding.' },
      { type: 'try', text: 'Build an image as my-app:1.0, tag it as my-app:latest, and compare the image IDs with docker image ls.' },
      { type: 'keypoints', items: ['docker build creates an image from a Dockerfile.', '-t gives an image a readable name and tag.', 'The build context controls which files Docker can copy.', 'Docker build cache speeds up repeated builds.'] }
    ]
  },
  {
    slug: 'docker-ignore',
    title: '.dockerignore',
    description: 'Use .dockerignore to keep builds smaller, faster, and safer.',
    level: 'beginner',
    section: 'Building Images',
    order: 15,
    minutes: 10,
    content: [
      { type: 'p', text: '.dockerignore tells Docker which files to leave out of the build context. It works like .gitignore, but for Docker builds.' },
      { type: 'p', text: 'Ignoring unnecessary files makes builds faster and helps avoid copying secrets, local dependencies, caches, and large folders into the build context.' },
      { type: 'h2', text: 'A common .dockerignore' },
      {
        type: 'code',
        title: '.dockerignore',
        language: 'text',
        code: `node_modules
npm-debug.log
.git
.env
.next
dist
coverage`
      },
      { type: 'h2', text: 'Why it matters' },
      {
        type: 'table',
        headers: ['Ignored item', 'Reason'],
        rows: [
          ['node_modules', 'Usually installed inside the image for the container platform'],
          ['.git', 'Repository history is large and not needed to run the app'],
          ['.env', 'May contain secrets that should not be baked into images'],
          ['coverage', 'Test output is not needed at runtime'],
          ['dist or build output', 'Often regenerated during the image build']
        ]
      },
      { type: 'h2', text: 'Example Node Dockerfile' },
      {
        type: 'code',
        title: 'Dockerfile',
        language: 'dockerfile',
        code: `FROM node:22-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
CMD ["npm", "start"]`
      },
      {
        type: 'code',
        title: 'Build with ignored files',
        language: 'bash',
        code: `docker build -t ignored-demo .`
      },
      { type: 'p', text: 'With the .dockerignore file, Docker does not send ignored files to the builder. That also means COPY . . will not copy ignored files.' },
      { type: 'warning', text: 'Do not rely on .dockerignore as your only secret protection. Avoid putting secrets in project folders when possible, and never bake secrets into images.' },
      { type: 'tip', text: 'Create .dockerignore near the beginning of a project so large folders are excluded before your first image build.' },
      { type: 'try', text: 'Create a .dockerignore file in a practice project. Add a large temporary folder, build once, and notice that Docker no longer sends that folder in the context.' },
      { type: 'keypoints', items: ['.dockerignore excludes files from the Docker build context.', 'Smaller contexts can make builds faster.', 'Ignoring secrets reduces accidental exposure risk.', 'COPY cannot copy files that .dockerignore excludes.'] }
    ]
  },
  {
    slug: 'docker-ports',
    title: 'Port Mapping (-p)',
    description: 'Publish container ports so you can access web servers and APIs from your host computer.',
    level: 'beginner',
    section: 'Networking & Data',
    order: 16,
    minutes: 11,
    content: [
      { type: 'p', text: 'Containers have their own network space. A web server inside a container can listen on port 80, but your browser cannot reach it from the host unless Docker publishes that port.' },
      { type: 'h2', text: 'Host port and container port' },
      { type: 'p', text: 'The -p option maps a host port to a container port. The common pattern is hostPort:containerPort.' },
      {
        type: 'code',
        title: 'Run Nginx on host port 8080',
        language: 'bash',
        code: `docker run --rm -d --name ports-demo -p 8080:80 nginx:alpine`
      },
      {
        type: 'code',
        title: 'Open in a browser or curl',
        language: 'bash',
        code: `curl http://localhost:8080`
      },
      {
        type: 'table',
        headers: ['Mapping', 'Meaning'],
        rows: [
          ['-p 8080:80', 'Host port 8080 forwards to container port 80'],
          ['-p 3000:3000', 'Host port 3000 forwards to container port 3000'],
          ['-p 127.0.0.1:8080:80', 'Bind only to localhost on the host'],
          ['-P', 'Publish exposed ports to random host ports']
        ]
      },
      { type: 'h2', text: 'Check published ports' },
      {
        type: 'code',
        title: 'View port mappings',
        language: 'bash',
        code: `docker ps
docker port ports-demo`
      },
      { type: 'h2', text: 'Avoid port conflicts' },
      { type: 'p', text: 'Only one process can use a host port at a time. If port 8080 is busy, map to another host port such as 8081.' },
      {
        type: 'code',
        title: 'Use a different host port',
        language: 'bash',
        code: `docker run --rm -d --name ports-demo-2 -p 8081:80 nginx:alpine`
      },
      { type: 'tip', text: 'The container port is chosen by the app inside the image. The host port is your choice as long as it is available.' },
      { type: 'try', text: 'Run two Nginx containers at the same time: one mapped to 8080:80 and another to 8081:80. Open both URLs.' },
      { type: 'keypoints', items: ['-p publishes container ports to the host.', 'The format is hostPort:containerPort.', 'Host ports must be available.', 'docker port shows published port mappings.'] }
    ]
  },
  {
    slug: 'docker-volumes',
    title: 'Volumes Basics',
    description: 'Learn how Docker volumes persist data after containers are removed.',
    level: 'beginner',
    section: 'Networking & Data',
    order: 17,
    minutes: 12,
    content: [
      { type: 'p', text: 'Containers are disposable, but many apps need data to survive container replacement. Docker volumes provide persistent storage managed by Docker.' },
      { type: 'p', text: 'Volumes are commonly used for databases, uploaded files in development, and other data that should not disappear when a container is removed.' },
      { type: 'h2', text: 'Create and use a named volume' },
      {
        type: 'code',
        title: 'Create a volume',
        language: 'bash',
        code: `docker volume create notes-data`
      },
      {
        type: 'code',
        title: 'Write data into a volume',
        language: 'bash',
        code: `docker run --rm -v notes-data:/data alpine sh -c 'echo "Remember volumes" > /data/note.txt'`
      },
      {
        type: 'code',
        title: 'Read data from the same volume',
        language: 'bash',
        code: `docker run --rm -v notes-data:/data alpine cat /data/note.txt`
      },
      { type: 'h2', text: 'Volume syntax' },
      {
        type: 'table',
        headers: ['Example', 'Meaning'],
        rows: [
          ['-v notes-data:/data', 'Mount named volume notes-data at /data in the container'],
          ['--mount source=notes-data,target=/data', 'Longer modern syntax for the same idea'],
          ['/data', 'The path inside the container where the volume appears']
        ]
      },
      { type: 'h2', text: 'Inspect and remove volumes' },
      {
        type: 'code',
        title: 'Manage volumes',
        language: 'bash',
        code: `docker volume ls
docker volume inspect notes-data
docker volume rm notes-data`
      },
      { type: 'warning', text: 'Removing a volume deletes the data inside that volume. Be careful with database volumes.' },
      { type: 'note', text: 'Named volumes are stored in Docker-managed locations. You usually inspect and manage them with Docker commands instead of editing their files directly.' },
      { type: 'try', text: 'Create notes-data, write a file from one container, then read it from another. Remove both containers and confirm the volume data still exists.' },
      { type: 'keypoints', items: ['Volumes persist data outside a container writable layer.', 'Named volumes are managed by Docker.', 'Use -v volumeName:containerPath to mount a volume.', 'Deleting a container does not delete named volumes by default.'] }
    ]
  },
  {
    slug: 'docker-bind-mounts',
    title: 'Bind Mounts',
    description: 'Mount a host folder into a container for local development and live file editing.',
    level: 'beginner',
    section: 'Networking & Data',
    order: 18,
    minutes: 12,
    content: [
      { type: 'p', text: 'A bind mount connects a file or folder from your host computer into a container. Unlike a named volume, the source path is a real location on your machine that you choose.' },
      { type: 'p', text: 'Bind mounts are popular in development because you can edit code on your host and let the container see those changes.' },
      { type: 'h2', text: 'Serve a local folder with Nginx' },
      {
        type: 'code',
        title: 'Create a local website folder',
        language: 'bash',
        code: `mkdir site
echo "<h1>Hello from a bind mount</h1>" > site/index.html`
      },
      {
        type: 'code',
        title: 'Mount the folder into Nginx',
        language: 'bash',
        code: `docker run --rm -d --name bind-demo \\
  -p 8080:80 \\
  -v "$PWD/site:/usr/share/nginx/html:ro" \\
  nginx:alpine`
      },
      { type: 'p', text: 'The :ro suffix makes the mount read-only inside the container. That is a good default when the container only needs to read files.' },
      { type: 'h2', text: 'Bind mount vs volume' },
      {
        type: 'table',
        headers: ['Feature', 'Bind mount', 'Named volume'],
        rows: [
          ['Source', 'A host path you choose', 'Managed by Docker'],
          ['Best for', 'Editing local source files', 'Persistent app or database data'],
          ['Portability', 'Depends on host path', 'Easier to reuse across containers'],
          ['Beginner risk', 'Can overwrite host files if writable', 'Can hide data if mounted over a non-empty path']
        ]
      },
      { type: 'h2', text: 'Use --mount syntax' },
      {
        type: 'code',
        title: 'Bind mount with --mount',
        language: 'bash',
        code: `docker run --rm -d --name bind-demo-2 \\
  -p 8081:80 \\
  --mount type=bind,source="$PWD/site",target=/usr/share/nginx/html,readonly \\
  nginx:alpine`
      },
      { type: 'warning', text: 'A writable bind mount lets a container change host files. Only mount folders you understand, especially when using images from other people.' },
      { type: 'tip', text: 'For examples that only serve static files, add :ro or readonly so the container cannot edit your local project files.' },
      { type: 'try', text: 'Edit site/index.html on your host while the Nginx container is running. Refresh the browser and confirm the page changes.' },
      { type: 'keypoints', items: ['Bind mounts connect host paths to container paths.', 'They are useful for local development and live editing.', 'Named volumes are usually better for persistent service data.', 'Read-only bind mounts reduce accidental file changes.'] }
    ]
  },
  {
    slug: 'docker-networks-intro',
    title: 'Networks Intro',
    description: 'Understand Docker networks and how containers communicate by name on user-defined networks.',
    level: 'beginner',
    section: 'Networking & Data',
    order: 19,
    minutes: 13,
    content: [
      { type: 'p', text: 'Docker networks let containers communicate. By default, containers can reach the internet, but container-to-container communication is easiest on a user-defined bridge network.' },
      { type: 'p', text: 'On a user-defined network, containers can resolve each other by container name. This is important for apps that need to talk to databases, caches, or other services.' },
      { type: 'h2', text: 'Create a network' },
      {
        type: 'code',
        title: 'User-defined bridge network',
        language: 'bash',
        code: `docker network create app-net`
      },
      { type: 'h2', text: 'Run two containers on it' },
      {
        type: 'code',
        title: 'Start an Nginx container',
        language: 'bash',
        code: `docker run -d --name network-web --network app-net nginx:alpine`
      },
      {
        type: 'code',
        title: 'Call it by name from another container',
        language: 'bash',
        code: `docker run --rm --network app-net alpine wget -qO- http://network-web`
      },
      { type: 'h2', text: 'Inspect a network' },
      {
        type: 'code',
        title: 'View network details',
        language: 'bash',
        code: `docker network ls
docker network inspect app-net`
      },
      {
        type: 'table',
        headers: ['Network type', 'Beginner meaning'],
        rows: [
          ['bridge', 'Default local network style for containers on one Docker host'],
          ['host', 'Container shares the host network namespace on Linux'],
          ['none', 'Container has no network access'],
          ['user-defined bridge', 'Recommended local network for multi-container practice']
        ]
      },
      { type: 'h2', text: 'Ports and networks are different' },
      { type: 'p', text: 'A Docker network lets containers talk to each other. Port publishing lets your host computer talk to a container. You often use both in real projects.' },
      { type: 'note', text: 'Docker Compose creates a user-defined network for your project automatically, which is one reason Compose is pleasant for multi-service apps.' },
      { type: 'try', text: 'Create app-net, run network-web on it, and fetch the page from a temporary Alpine container using the name network-web.' },
      { type: 'keypoints', items: ['Docker networks connect containers.', 'User-defined bridge networks support container-name DNS.', 'Port publishing is for host-to-container access.', 'Compose creates a project network automatically.'] }
    ]
  },
  {
    slug: 'docker-env',
    title: 'Environment Variables',
    description: 'Configure containers with environment variables and env files.',
    level: 'beginner',
    section: 'Networking & Data',
    order: 20,
    minutes: 11,
    content: [
      { type: 'p', text: 'Environment variables are key-value settings available to a process. Containers often use them for configuration such as app mode, database host, ports, usernames, and feature flags.' },
      { type: 'h2', text: 'Set variables with -e' },
      {
        type: 'code',
        title: 'Pass one variable',
        language: 'bash',
        code: `docker run --rm -e APP_NAME=Intellex alpine sh -c 'echo "App: $APP_NAME"'`
      },
      {
        type: 'code',
        title: 'Pass multiple variables',
        language: 'bash',
        code: `docker run --rm \\
  -e APP_ENV=development \\
  -e LOG_LEVEL=debug \\
  alpine sh -c 'echo "$APP_ENV / $LOG_LEVEL"'`
      },
      { type: 'h2', text: 'Use an env file' },
      {
        type: 'code',
        title: '.env',
        language: 'text',
        code: `APP_ENV=development
LOG_LEVEL=debug
PORT=3000`
      },
      {
        type: 'code',
        title: 'Load variables from a file',
        language: 'bash',
        code: `docker run --rm --env-file .env alpine env`
      },
      { type: 'h2', text: 'Environment variables in real images' },
      { type: 'p', text: 'Many official images use environment variables for first-time setup. For example, the Postgres image can use POSTGRES_PASSWORD when creating the initial database user.' },
      {
        type: 'code',
        title: 'Run Postgres for local practice',
        language: 'bash',
        code: `docker run -d --name env-postgres \\
  -e POSTGRES_PASSWORD=secret \\
  -p 5432:5432 \\
  postgres:16`
      },
      {
        type: 'table',
        headers: ['Use', 'Example variable'],
        rows: [
          ['App mode', 'APP_ENV=development'],
          ['Logging', 'LOG_LEVEL=debug'],
          ['Database host', 'DATABASE_HOST=db'],
          ['Database password', 'POSTGRES_PASSWORD=secret']
        ]
      },
      { type: 'warning', text: 'Environment variables are convenient but not a complete secrets solution. They can appear in shell history, process inspection, Compose files, or logs if handled carelessly.' },
      { type: 'note', text: 'Environment variable names are usually uppercase with underscores, such as APP_ENV or DATABASE_HOST.' },
      { type: 'try', text: 'Create a .env file with APP_ENV and LOG_LEVEL. Run Alpine with --env-file .env and find your variables in the output.' },
      { type: 'keypoints', items: ['Environment variables configure container processes.', 'Use -e to pass individual variables.', 'Use --env-file to load variables from a file.', 'Check image documentation for supported variables.'] }
    ]
  },
  {
    slug: 'docker-compose-intro',
    title: 'Docker Compose Intro',
    description: 'Learn why Docker Compose is useful for apps with one or more services.',
    level: 'beginner',
    section: 'Compose Basics',
    order: 21,
    minutes: 11,
    content: [
      { type: 'p', text: 'Docker Compose helps you define and run containers using a YAML file. Instead of typing long docker run commands, you describe your services once and start them with docker compose up.' },
      { type: 'p', text: 'Compose is especially useful when an app needs multiple containers, such as a web app plus a database.' },
      { type: 'h2', text: 'Modern Compose command' },
      {
        type: 'code',
        title: 'Check Compose V2',
        language: 'bash',
        code: `docker compose version`
      },
      { type: 'p', text: 'This tutorial uses docker compose with a space. The older docker-compose command with a hyphen belongs to Compose V1 and should not be used for new beginner learning.' },
      { type: 'h2', text: 'From docker run to Compose' },
      {
        type: 'code',
        title: 'Long docker run command',
        language: 'bash',
        code: `docker run -d --name web -p 8080:80 nginx:alpine`
      },
      {
        type: 'code',
        title: 'compose.yaml',
        language: 'yaml',
        code: `services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"`
      },
      {
        type: 'code',
        title: 'Start the Compose project',
        language: 'bash',
        code: `docker compose up -d`
      },
      { type: 'h2', text: 'What Compose manages' },
      { type: 'ul', items: ['Services: container definitions for parts of your app', 'Networks: project networks so services can communicate by name', 'Volumes: persistent storage declared in the Compose file', 'Environment: settings passed to containers', 'Builds: custom images built from Dockerfiles'] },
      { type: 'note', text: 'Compose is not only for production. It is one of the best tools for local development because it makes the full app environment repeatable.' },
      { type: 'try', text: 'Create the small compose.yaml shown above, run docker compose up -d, open http://localhost:8080, then run docker compose down.' },
      { type: 'keypoints', items: ['Docker Compose uses YAML to define services.', 'Use docker compose for Compose V2.', 'Compose reduces long docker run commands.', 'Compose is great for local multi-container apps.'] }
    ]
  },
  {
    slug: 'docker-compose-file',
    title: 'compose.yaml Basics',
    description: 'Understand the common parts of a Compose file: services, image, build, ports, environment, volumes, and networks.',
    level: 'beginner',
    section: 'Compose Basics',
    order: 22,
    minutes: 13,
    content: [
      { type: 'p', text: 'A Compose file is usually named compose.yaml. It describes the services in your app and the options Docker should use when creating containers for those services.' },
      { type: 'h2', text: 'A beginner Compose file' },
      {
        type: 'code',
        title: 'compose.yaml',
        language: 'yaml',
        code: `services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./site:/usr/share/nginx/html:ro`
      },
      { type: 'p', text: 'This file defines one service named web. It uses the nginx:alpine image, maps host port 8080 to container port 80, and mounts a local site folder into Nginx.' },
      { type: 'h2', text: 'Common service keys' },
      {
        type: 'table',
        headers: ['Key', 'What it means'],
        rows: [
          ['image', 'Use an existing image from a registry or local machine'],
          ['build', 'Build an image from a Dockerfile'],
          ['ports', 'Publish container ports to the host'],
          ['environment', 'Set environment variables'],
          ['volumes', 'Mount named volumes or host paths'],
          ['depends_on', 'Start another service first']
        ]
      },
      { type: 'h2', text: 'Using build instead of image' },
      {
        type: 'code',
        title: 'compose.yaml with build',
        language: 'yaml',
        code: `services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development`
      },
      { type: 'h2', text: 'Top-level volumes' },
      {
        type: 'code',
        title: 'Named volume in Compose',
        language: 'yaml',
        code: `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:`
      },
      { type: 'tip', text: 'YAML indentation matters. Use spaces, keep indentation consistent, and let your editor highlight YAML files.' },
      { type: 'try', text: 'Write a compose.yaml with one web service using nginx:alpine. Add ports and a read-only bind mount for local HTML files.' },
      { type: 'keypoints', items: ['compose.yaml defines services and their options.', 'image uses an existing image; build creates one from a Dockerfile.', 'ports, environment, and volumes are common service keys.', 'Top-level volumes declare named volumes for services to use.'] }
    ]
  },
  {
    slug: 'docker-compose-up',
    title: 'up, down, ps & logs',
    description: 'Use core Docker Compose commands to start, stop, inspect, and debug a Compose project.',
    level: 'beginner',
    section: 'Compose Basics',
    order: 23,
    minutes: 11,
    content: [
      { type: 'p', text: 'Once you have a compose.yaml file, the most common commands are docker compose up, down, ps, and logs. These commands operate on the Compose project in the current folder.' },
      { type: 'h2', text: 'Start services' },
      {
        type: 'code',
        title: 'Start in the foreground',
        language: 'bash',
        code: `docker compose up`
      },
      {
        type: 'code',
        title: 'Start in the background',
        language: 'bash',
        code: `docker compose up -d`
      },
      { type: 'p', text: 'Foreground mode shows logs directly and stops when you press Ctrl+C. Detached mode runs services in the background.' },
      { type: 'h2', text: 'Check status and logs' },
      {
        type: 'code',
        title: 'View Compose containers',
        language: 'bash',
        code: `docker compose ps`
      },
      {
        type: 'code',
        title: 'Read logs',
        language: 'bash',
        code: `docker compose logs
docker compose logs -f web`
      },
      { type: 'h2', text: 'Stop and remove' },
      {
        type: 'code',
        title: 'Stop and remove project containers and network',
        language: 'bash',
        code: `docker compose down`
      },
      {
        type: 'code',
        title: 'Also remove named volumes declared by the project',
        language: 'bash',
        code: `docker compose down -v`
      },
      {
        type: 'table',
        headers: ['Command', 'Meaning'],
        rows: [
          ['docker compose up', 'Create and start services'],
          ['docker compose up -d', 'Start services in the background'],
          ['docker compose ps', 'List containers in this Compose project'],
          ['docker compose logs', 'Show service logs'],
          ['docker compose down', 'Stop and remove project containers and default network']
        ]
      },
      { type: 'warning', text: 'docker compose down -v removes project named volumes. Do not use -v if you want to keep database data.' },
      { type: 'tip', text: 'Run docker compose ps before docker compose down if you want to confirm which project containers are active.' },
      { type: 'try', text: 'Start a one-service Compose project with docker compose up -d. Check docker compose ps, read logs, and stop it with docker compose down.' },
      { type: 'keypoints', items: ['docker compose up starts the services in compose.yaml.', '-d runs services in detached mode.', 'docker compose ps and logs help you inspect the project.', 'docker compose down removes project containers and networks.'] }
    ]
  },
  {
    slug: 'docker-compose-services',
    title: 'Multi-service Compose',
    description: 'Run an app and database together with Docker Compose service names, networks, and volumes.',
    level: 'beginner',
    section: 'Compose Basics',
    order: 24,
    minutes: 14,
    content: [
      { type: 'p', text: 'A real application often needs more than one container. Docker Compose lets you describe all services in one file so they share a project network and can communicate by service name.' },
      { type: 'h2', text: 'App plus database example' },
      {
        type: 'code',
        title: 'compose.yaml',
        language: 'yaml',
        code: `services:
  app:
    image: node:22-alpine
    working_dir: /app
    command: sh -c "npm install && node server.js"
    ports:
      - "3000:3000"
    volumes:
      - ./app:/app
    environment:
      DATABASE_HOST: db
      DATABASE_USER: postgres
      DATABASE_PASSWORD: secret
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:`
      },
      { type: 'p', text: 'The app service can connect to the database using the hostname db because db is the Compose service name. Compose creates the network automatically.' },
      { type: 'h2', text: 'Start and inspect the stack' },
      {
        type: 'code',
        title: 'Run the services',
        language: 'bash',
        code: `docker compose up -d
docker compose ps
docker compose logs -f app`
      },
      { type: 'h2', text: 'Service names are DNS names' },
      {
        type: 'code',
        title: 'Test service-name networking',
        language: 'bash',
        code: `docker compose exec app sh
# Inside the app container, the hostname "db" points to the database service.`
      },
      {
        type: 'table',
        headers: ['Compose feature', 'Why it helps'],
        rows: [
          ['Service names', 'Containers can connect using names like db or redis'],
          ['depends_on', 'Starts dependency containers before the dependent service'],
          ['Named volumes', 'Keep database files after containers are recreated'],
          ['Project network', 'Connects services without manual docker network commands']
        ]
      },
      { type: 'note', text: 'depends_on controls startup order, but it does not guarantee the database is ready for queries. Real apps often include retries or health checks.' },
      { type: 'try', text: 'Read the Compose file and identify which settings belong to the app service, which belong to the db service, and which are top-level project resources.' },
      { type: 'keypoints', items: ['Compose is ideal for multi-service local apps.', 'Services can communicate by service name.', 'Named volumes preserve database data.', 'depends_on is helpful but does not replace app-level connection retries.'] }
    ]
  },
  {
    slug: 'docker-first-app',
    title: 'Mini Project: Node/Python App in Docker',
    description: 'Build and run a tiny web app in Docker, then use Compose to manage it like a real project.',
    level: 'beginner',
    section: 'Putting It Together',
    order: 25,
    minutes: 15,
    content: [
      { type: 'p', text: 'This mini project brings together images, containers, Dockerfiles, ports, environment variables, bind mounts, and Compose. You can choose the Node.js version or the Python version.' },
      { type: 'h2', text: 'Option A: Node.js app' },
      {
        type: 'code',
        title: 'server.js',
        language: 'text',
        code: `const http = require("http");

const port = process.env.PORT || 3000;
const message = process.env.MESSAGE || "Hello from Docker";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message, path: req.url }));
});

server.listen(port, () => {
  console.log(\`Server listening on port \${port}\`);
});`
      },
      {
        type: 'code',
        title: 'Dockerfile for Node',
        language: 'dockerfile',
        code: `FROM node:22-alpine
WORKDIR /app
COPY server.js .
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]`
      },
      { type: 'h2', text: 'Option B: Python app' },
      {
        type: 'code',
        title: 'app.py',
        language: 'text',
        code: `import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = int(os.environ.get("PORT", "3000"))
MESSAGE = os.environ.get("MESSAGE", "Hello from Docker")

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = json.dumps({"message": MESSAGE, "path": self.path}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

HTTPServer(("0.0.0.0", PORT), Handler).serve_forever()`
      },
      {
        type: 'code',
        title: 'Dockerfile for Python',
        language: 'dockerfile',
        code: `FROM python:3.12-slim
WORKDIR /app
COPY app.py .
ENV PORT=3000
EXPOSE 3000
CMD ["python", "app.py"]`
      },
      { type: 'h2', text: 'Build and run without Compose' },
      {
        type: 'code',
        title: 'Build and run your chosen app',
        language: 'bash',
        code: `docker build -t beginner-web-app .
docker run --rm -p 3000:3000 -e MESSAGE="Hello Intellex" beginner-web-app`
      },
      { type: 'h2', text: 'Run the same app with Compose' },
      {
        type: 'code',
        title: 'compose.yaml',
        language: 'yaml',
        code: `services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      MESSAGE: "Hello from Compose"`
      },
      {
        type: 'code',
        title: 'Compose commands',
        language: 'bash',
        code: `docker compose up --build
# In another terminal:
curl http://localhost:3000
docker compose down`
      },
      { type: 'h2', text: 'Project checklist' },
      { type: 'ul', items: ['Dockerfile builds a custom image', 'Container listens on port 3000', 'Host maps port 3000 to container port 3000', 'MESSAGE environment variable changes output', 'Compose starts the same app from compose.yaml'] },
      { type: 'tip', text: 'Use Ctrl+C to stop docker compose up when it is running in the foreground. Then run docker compose down to remove the project container and network.' },
      { type: 'try', text: 'Complete either the Node.js or Python version. Change MESSAGE in compose.yaml, restart with docker compose up --build, and confirm the JSON response changes.' },
      { type: 'keypoints', items: ['A Dockerfile packages your own app as an image.', 'Port mapping makes the app reachable from your host.', 'Environment variables configure app behavior.', 'Compose records the run configuration in a reusable file.'] }
    ]
  }
];
