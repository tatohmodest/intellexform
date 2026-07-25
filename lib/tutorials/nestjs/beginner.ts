import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-nestjs',
    title: 'What is NestJS?',
    description: 'Learn what NestJS is, what problems it solves, and how it helps you build organized Node.js backends.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 10,
    content: [
      { type: 'p', text: 'NestJS is a backend framework for Node.js. It helps you build APIs and server applications with a clear structure, TypeScript, dependency injection, and familiar web concepts such as controllers, services, modules, middleware, pipes, and guards.' },
      { type: 'p', text: 'If Express is a small toolbox, NestJS is a workshop with labeled drawers. You still use Node.js, HTTP, and often Express under the hood, but Nest gives your app a consistent architecture as it grows.' },
      { type: 'h2', text: 'NestJS in simple words' },
      { type: 'p', text: 'A NestJS app is made from modules. Modules group controllers and providers. Controllers receive HTTP requests. Providers, often called services, contain reusable business logic.' },
      {
        type: 'table',
        headers: ['Part', 'Beginner meaning'],
        rows: [
          ['Module', 'A folder-like feature boundary for related code'],
          ['Controller', 'Receives requests such as GET /users'],
          ['Service', 'Runs app logic such as finding users or creating tasks'],
          ['Dependency injection', 'Nest gives classes the objects they need'],
        ],
      },
      { type: 'h2', text: 'A tiny NestJS controller' },
      {
        type: 'code',
        title: 'app.controller.ts',
        language: 'typescript',
        code: `import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHome() {
    return 'Hello from NestJS';
  }
}`,
      },
      { type: 'p', text: 'The @Controller decorator marks a class as a controller. The @Get decorator tells Nest that getHome should run for an HTTP GET request.' },
      { type: 'h2', text: 'A tiny NestJS module' },
      {
        type: 'code',
        title: 'app.module.ts',
        language: 'typescript',
        code: `import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
})
export class AppModule {}`,
      },
      { type: 'p', text: 'The module registers the controller so Nest can discover it. In larger apps, each feature usually gets its own module.' },
      { type: 'h2', text: 'Where NestJS fits' },
      { type: 'ul', items: ['REST APIs for web and mobile apps', 'Backend services for dashboards and admin tools', 'Authentication and authorization servers', 'Microservices and message-based systems', 'Server-rendered or API-only applications'] },
      { type: 'note', text: 'NestJS is not a database, hosting platform, or programming language. It is a Node.js framework, and TypeScript is the language most Nest projects use.' },
      { type: 'try', text: 'Describe a small app you want to build. Identify one controller it might need and one service that could hold the business logic.' },
      { type: 'keypoints', items: ['NestJS is a structured Node.js backend framework.', 'Controllers handle requests and services hold reusable logic.', 'Modules organize related application pieces.', 'NestJS teaches architecture early, which helps projects stay maintainable.'] },
    ],
  },
  {
    slug: 'nest-vs-express',
    title: 'NestJS vs Express (When to Choose)',
    description: 'Compare NestJS and Express so you can choose the right tool for small scripts, APIs, teams, and long-term apps.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 10,
    content: [
      { type: 'p', text: 'Express is a minimal web framework for Node.js. NestJS is a higher-level framework that can run on top of Express by default. That means Nest often uses Express internally, but gives you more structure and application patterns.' },
      { type: 'p', text: 'Neither framework is always better. Express is flexible and small. NestJS is organized and opinionated. The right choice depends on project size, team needs, and how much architecture you want from day one.' },
      { type: 'h2', text: 'A simple Express route' },
      {
        type: 'code',
        title: 'server.ts',
        language: 'typescript',
        code: `import express from 'express';

const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello from Express');
});

app.listen(3000);`,
      },
      { type: 'h2', text: 'The same idea in NestJS' },
      {
        type: 'code',
        title: 'hello.controller.ts',
        language: 'typescript',
        code: `import { Controller, Get } from '@nestjs/common';

@Controller('hello')
export class HelloController {
  @Get()
  sayHello() {
    return 'Hello from NestJS';
  }
}`,
      },
      { type: 'p', text: 'Express puts the route and handler directly in one place. Nest puts the route inside a controller class, then connects that class through a module.' },
      { type: 'h2', text: 'Comparison table' },
      {
        type: 'table',
        headers: ['Need', 'Express', 'NestJS'],
        rows: [
          ['Very small server', 'Excellent', 'Can feel larger than needed'],
          ['Clear project architecture', 'You design it yourself', 'Built in with modules and DI'],
          ['TypeScript-first workflow', 'Possible with setup', 'Default style'],
          ['Large team consistency', 'Requires conventions', 'Strong conventions included'],
          ['Learning backend fundamentals', 'Shows the raw pieces', 'Shows real app organization'],
        ],
      },
      { type: 'h2', text: 'When to choose NestJS' },
      { type: 'ul', items: ['You expect the app to grow beyond a few routes.', 'You want TypeScript, testing, validation, config, and modules to feel consistent.', 'Multiple developers will work on the backend.', 'You like Angular-style decorators and dependency injection.', 'You want a framework that encourages separation of concerns.'] },
      { type: 'h2', text: 'When Express may be enough' },
      { type: 'ul', items: ['You are building a tiny webhook receiver or quick prototype.', 'You want full control over every pattern.', 'You are learning raw HTTP handling in Node.js.', 'Your team already has an established Express architecture.'] },
      { type: 'tip', text: 'A common path is to learn basic Express concepts, then use NestJS when you want structure. But you can also start with NestJS and learn HTTP concepts through controllers.' },
      { type: 'try', text: 'Pick one project idea: a small webhook, a blog API, or a team task app. Decide whether Express or NestJS fits better and explain your reason in one sentence.' },
      { type: 'keypoints', items: ['Express is minimal and flexible.', 'NestJS is structured and TypeScript-first.', 'NestJS commonly uses Express internally, so the tools are related.', 'Choose NestJS when maintainability and consistency matter.'] },
    ],
  },
  {
    slug: 'nest-typescript-inside',
    title: 'Learn NestJS Without a Separate TypeScript Course',
    description: 'See how this tutorial teaches TypeScript exactly when NestJS needs it, using realistic backend examples.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 11,
    content: [
      { type: 'p', text: 'You do not need to finish a separate TypeScript course before learning NestJS. NestJS uses TypeScript heavily, but the important TypeScript ideas appear naturally while you build controllers, services, DTOs, modules, and tests.' },
      { type: 'p', text: 'This tutorial teaches TypeScript inside NestJS. When a controller returns data, you learn return types. When a request body arrives, you learn DTO classes. When a service is injected, you learn constructor types. The language supports the framework instead of becoming a separate subject.' },
      { type: 'h2', text: 'TypeScript appears where Nest uses it' },
      {
        type: 'table',
        headers: ['TypeScript idea', 'Where you learn it in NestJS'],
        rows: [
          ['Types', 'When function parameters and return values need shape'],
          ['Classes', 'When writing controllers, services, modules, and DTOs'],
          ['Decorators', 'When using @Controller, @Get, @Injectable, and @Module'],
          ['Interfaces', 'When describing object shapes used inside the app'],
          ['Access modifiers', 'When injecting services with private readonly'],
        ],
      },
      { type: 'h2', text: 'Example: types in a service method' },
      {
        type: 'code',
        title: 'tasks.service.ts',
        language: 'typescript',
        code: `type Task = {
  id: number;
  title: string;
  done: boolean;
};

export class TasksService {
  private tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }
}`,
      },
      { type: 'p', text: 'You only need a few TypeScript ideas to understand this code: Task describes an object shape, Task[] means an array of tasks, and findAll returns that array.' },
      { type: 'h2', text: 'Example: a DTO class for request data' },
      {
        type: 'code',
        title: 'create-task.dto.ts',
        language: 'typescript',
        code: `export class CreateTaskDto {
  title: string;
  description?: string;
}`,
      },
      { type: 'p', text: 'The question mark in description? means the property is optional. You learn it because real APIs often accept some required fields and some optional fields.' },
      { type: 'h2', text: 'Example: injection uses constructor types' },
      {
        type: 'code',
        title: 'tasks.controller.ts',
        language: 'typescript',
        code: `import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }
}`,
      },
      { type: 'p', text: 'The constructor tells Nest that this controller needs a TasksService. TypeScript tells your editor what methods are available on tasksService.' },
      { type: 'note', text: 'Decorators such as @Controller and @Get are TypeScript features used by NestJS to attach metadata to classes and methods. You do not need to master decorator theory before using them.' },
      { type: 'tip', text: 'When TypeScript feels confusing, ask: what shape does this value have, and where is it used? That question solves many beginner errors.' },
      { type: 'try', text: 'Create a Product type with id, name, price, and inStock. Then write a findAll method signature that returns Product[].' },
      { type: 'keypoints', items: ['A separate TypeScript course is not required before NestJS.', 'TypeScript is learned as controllers, services, DTOs, and modules need it.', 'Classes and decorators are central to NestJS code.', 'Types make backend code easier to read, refactor, and validate.'] },
    ],
  },
  {
    slug: 'nest-setup',
    title: 'Install Nest CLI & Create a Project',
    description: 'Install the Nest CLI, create your first project, run it locally, and understand the starter commands.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 12,
    content: [
      { type: 'p', text: 'The easiest way to start a NestJS project is the official Nest CLI. It creates a working TypeScript project with scripts, configuration, a starter module, a controller, a service, and test files.' },
      { type: 'h2', text: 'Check Node.js first' },
      { type: 'p', text: 'Use a modern Node.js LTS version. NestJS v10 and v11 friendly projects work best with current Node versions and current package managers.' },
      {
        type: 'code',
        title: 'Check your tools',
        language: 'bash',
        code: `node --version
npm --version`,
      },
      { type: 'h2', text: 'Install or run the Nest CLI' },
      {
        type: 'code',
        title: 'Install globally',
        language: 'bash',
        code: `npm install -g @nestjs/cli
nest --version`,
      },
      { type: 'p', text: 'If you prefer not to install global packages, you can use npx to run the CLI when creating a project.' },
      {
        type: 'code',
        title: 'Create with npx',
        language: 'bash',
        code: `npx @nestjs/cli new my-nest-api`,
      },
      { type: 'h2', text: 'Create and run the app' },
      {
        type: 'code',
        title: 'Create a project and start development',
        language: 'bash',
        code: `nest new my-nest-api
cd my-nest-api
npm run start:dev`,
      },
      { type: 'p', text: 'The dev command starts the app and watches for file changes. By default, the starter app listens on http://localhost:3000.' },
      { type: 'h2', text: 'The first response' },
      {
        type: 'code',
        title: 'app.controller.ts',
        language: 'typescript',
        code: `import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}`,
      },
      {
        type: 'code',
        title: 'Open the starter route',
        language: 'bash',
        code: `curl http://localhost:3000`,
      },
      { type: 'note', text: 'The generated project may ask which package manager to use. npm is fine for this tutorial, but pnpm and yarn also work if your team uses them.' },
      { type: 'tip', text: 'Use npm run start:dev while learning. It restarts the server when you save changes, which makes experimentation faster.' },
      { type: 'try', text: 'Create a new NestJS project, start it, and change the starter response from Hello World! to your own message.' },
      { type: 'keypoints', items: ['The Nest CLI creates a ready-to-run project.', 'Use a modern Node.js version before starting.', 'npm run start:dev runs the app in watch mode.', 'The starter project already demonstrates a controller calling a service.'] },
    ],
  },
  {
    slug: 'nest-project-structure',
    title: 'Project Structure Explained',
    description: 'Understand the important files and folders in a new NestJS project before you start editing.',
    level: 'beginner',
    section: 'Getting Started',
    order: 5,
    minutes: 11,
    content: [
      { type: 'p', text: 'A new NestJS project includes more files than a tiny Express app because it is ready for TypeScript, testing, building, formatting, and organized application code. Beginners should focus first on the src folder and package scripts.' },
      { type: 'h2', text: 'The main files' },
      {
        type: 'code',
        title: 'Typical starter structure',
        language: 'text',
        code: `my-nest-api/
  src/
    app.controller.ts
    app.module.ts
    app.service.ts
    main.ts
  test/
  package.json
  tsconfig.json
  nest-cli.json`,
      },
      {
        type: 'table',
        headers: ['File or folder', 'Purpose'],
        rows: [
          ['src/main.ts', 'Starts the Nest application'],
          ['src/app.module.ts', 'Root module that connects app pieces'],
          ['src/app.controller.ts', 'Starter HTTP controller'],
          ['src/app.service.ts', 'Starter provider for reusable logic'],
          ['package.json', 'Scripts and dependencies'],
          ['tsconfig.json', 'TypeScript compiler settings'],
        ],
      },
      { type: 'h2', text: 'The bootstrap file' },
      {
        type: 'code',
        title: 'src/main.ts',
        language: 'typescript',
        code: `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();`,
      },
      { type: 'p', text: 'main.ts creates the app from AppModule. The root module is the starting point Nest uses to discover controllers and providers.' },
      { type: 'h2', text: 'The root module' },
      {
        type: 'code',
        title: 'src/app.module.ts',
        language: 'typescript',
        code: `import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}`,
      },
      { type: 'h2', text: 'Scripts you will use often' },
      {
        type: 'code',
        title: 'package.json scripts',
        language: 'json',
        code: `{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "build": "nest build",
    "test": "jest"
  }
}`,
      },
      { type: 'note', text: 'The test folder usually contains end-to-end tests. The src folder contains application source code.' },
      { type: 'tip', text: 'When adding a feature, create a folder under src for it, such as src/tasks. Put its module, controller, service, and DTOs there.' },
      { type: 'try', text: 'Open a fresh NestJS project and find main.ts, app.module.ts, app.controller.ts, and app.service.ts. Explain the job of each file in plain words.' },
      { type: 'keypoints', items: ['src/main.ts bootstraps the application.', 'AppModule is the root module Nest starts from.', 'Controllers and providers are registered in modules.', 'package.json scripts run common development tasks.'] },
    ],
  },
  {
    slug: 'nest-ts-basics',
    title: 'TypeScript Basics Inside Nest (types, classes, decorators preview)',
    description: 'Learn the TypeScript essentials you will use constantly in NestJS: types, arrays, classes, constructors, and decorators.',
    level: 'beginner',
    section: 'Foundations',
    order: 6,
    minutes: 15,
    content: [
      { type: 'p', text: 'NestJS code is TypeScript code. You do not need every advanced TypeScript feature at the beginning, but you do need a practical set of basics: typed variables, object shapes, arrays, classes, constructors, and decorators.' },
      { type: 'h2', text: 'Basic types and arrays' },
      {
        type: 'code',
        title: 'Simple TypeScript values',
        language: 'typescript',
        code: `const title: string = 'Learn NestJS';
const minutes: number = 12;
const published: boolean = true;

const tags: string[] = ['node', 'nestjs', 'api'];`,
      },
      { type: 'p', text: 'The type after the colon describes what kind of value is allowed. string[] means an array where every item should be a string.' },
      { type: 'h2', text: 'Object shapes with type aliases' },
      {
        type: 'code',
        title: 'A Task type',
        language: 'typescript',
        code: `type Task = {
  id: number;
  title: string;
  completed: boolean;
  notes?: string;
};

const task: Task = {
  id: 1,
  title: 'Create a controller',
  completed: false,
};`,
      },
      { type: 'p', text: 'notes? is optional. TypeScript will allow a task without notes but still require id, title, and completed.' },
      { type: 'h2', text: 'Classes in NestJS' },
      {
        type: 'code',
        title: 'A service class',
        language: 'typescript',
        code: `export class TasksService {
  private tasks: Task[] = [];

  addTask(title: string): Task {
    const task = {
      id: Date.now(),
      title,
      completed: false,
    };

    this.tasks.push(task);
    return task;
  }
}`,
      },
      { type: 'p', text: 'A class is a blueprint for objects. In NestJS, controllers, services, modules, guards, filters, and pipes are usually classes.' },
      { type: 'h2', text: 'Decorators preview' },
      {
        type: 'code',
        title: 'Decorators on a controller',
        language: 'typescript',
        code: `import { Controller, Get } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  findAll() {
    return [];
  }
}`,
      },
      { type: 'p', text: '@Controller and @Get are decorators. They attach metadata that Nest reads at runtime. You use them to describe what a class or method means to the framework.' },
      { type: 'h2', text: 'Constructor shorthand' },
      {
        type: 'code',
        title: 'A common NestJS constructor',
        language: 'typescript',
        code: `constructor(private readonly tasksService: TasksService) {}`,
      },
      { type: 'p', text: 'This shorthand creates a private property and assigns it automatically. readonly means the property reference should not be reassigned after construction.' },
      { type: 'note', text: 'TypeScript types mostly disappear when the app runs. They help during development, while decorators can leave metadata Nest uses at runtime.' },
      { type: 'try', text: 'Write a User type with id, email, displayName, and optional bio. Then write a class with a private users: User[] property.' },
      { type: 'keypoints', items: ['Type annotations describe allowed values.', 'Classes are the main building block in NestJS.', 'Optional properties use a question mark.', 'Decorators describe classes and methods to NestJS.', 'Constructor shorthand is common for dependency injection.'] },
    ],
  },
  {
    slug: 'nest-modules',
    title: 'Modules',
    description: 'Learn how NestJS modules organize controllers, providers, imports, and exports.',
    level: 'beginner',
    section: 'Foundations',
    order: 7,
    minutes: 12,
    content: [
      { type: 'p', text: 'Modules are the organizing units of a NestJS app. Every Nest app has at least one module: the root AppModule. As your app grows, each feature usually gets its own module.' },
      { type: 'h2', text: 'What a module contains' },
      {
        type: 'code',
        title: 'tasks.module.ts',
        language: 'typescript',
        code: `import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}`,
      },
      { type: 'p', text: 'The module tells Nest that TasksController and TasksService belong together. Nest uses this metadata to create and connect the classes.' },
      {
        type: 'table',
        headers: ['Module property', 'What it means'],
        rows: [
          ['imports', 'Other modules this module needs'],
          ['controllers', 'HTTP controllers owned by this module'],
          ['providers', 'Services and other injectable classes available here'],
          ['exports', 'Providers this module shares with importing modules'],
        ],
      },
      { type: 'h2', text: 'Connect a feature module to AppModule' },
      {
        type: 'code',
        title: 'app.module.ts',
        language: 'typescript',
        code: `import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule],
})
export class AppModule {}`,
      },
      { type: 'p', text: 'Importing TasksModule into AppModule makes the tasks feature part of the application.' },
      { type: 'h2', text: 'Generate a module with the CLI' },
      {
        type: 'code',
        title: 'Nest CLI command',
        language: 'bash',
        code: `nest generate module tasks`,
      },
      { type: 'h2', text: 'How to think about modules' },
      { type: 'ul', items: ['A module is not usually one file forever; it represents a feature area.', 'Feature modules keep related code close together.', 'Shared modules can provide utilities used by multiple features.', 'Modules make dependencies visible instead of hidden.'] },
      { type: 'note', text: 'Do not put every controller and service in AppModule forever. That works for a tiny demo but becomes hard to maintain.' },
      { type: 'try', text: 'Create a list of modules for a simple shopping API: products, carts, orders, and users. Decide which controllers and services might live inside each module.' },
      { type: 'keypoints', items: ['A NestJS app is organized with modules.', 'AppModule is the root module.', 'Feature modules group related controllers and providers.', 'imports and exports control how modules share functionality.'] },
    ],
  },
  {
    slug: 'nest-controllers',
    title: 'Controllers',
    description: 'Learn how controllers define HTTP routes and call services to produce responses.',
    level: 'beginner',
    section: 'Foundations',
    order: 8,
    minutes: 12,
    content: [
      { type: 'p', text: 'Controllers are responsible for receiving incoming requests and returning responses. In REST APIs, controllers usually define routes such as GET /tasks, POST /tasks, and GET /tasks/:id.' },
      { type: 'h2', text: 'Create a controller' },
      {
        type: 'code',
        title: 'tasks.controller.ts',
        language: 'typescript',
        code: `import { Controller, Get } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  findAll() {
    return ['Learn NestJS', 'Build an API'];
  }
}`,
      },
      { type: 'p', text: '@Controller("tasks") gives every route in the class a /tasks prefix. @Get() handles GET /tasks.' },
      { type: 'h2', text: 'Register the controller' },
      {
        type: 'code',
        title: 'tasks.module.ts',
        language: 'typescript',
        code: `import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';

@Module({
  controllers: [TasksController],
})
export class TasksModule {}`,
      },
      { type: 'h2', text: 'Controllers should stay thin' },
      { type: 'p', text: 'A controller should not contain most of your business logic. It should read request data, call a service, and return the result. This keeps route code easy to read and test.' },
      {
        type: 'code',
        title: 'Controller calling a service',
        language: 'typescript',
        code: `import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }
}`,
      },
      { type: 'h2', text: 'Common route decorators' },
      {
        type: 'table',
        headers: ['Decorator', 'HTTP route'],
        rows: [
          ['@Get()', 'GET requests'],
          ['@Post()', 'POST requests'],
          ['@Patch()', 'PATCH requests'],
          ['@Put()', 'PUT requests'],
          ['@Delete()', 'DELETE requests'],
        ],
      },
      { type: 'tip', text: 'Name controller methods after what they do, such as findAll, findOne, create, update, and remove. These names are easy to scan in REST APIs.' },
      { type: 'try', text: 'Write a BooksController with @Controller("books") and a findAll method that returns an array of two book titles.' },
      { type: 'keypoints', items: ['Controllers receive HTTP requests.', 'Class-level @Controller sets a route prefix.', 'Method decorators such as @Get define route handlers.', 'Controllers should delegate business logic to services.'] },
    ],
  },
  {
    slug: 'nest-providers',
    title: 'Providers & Services',
    description: 'Understand providers, services, @Injectable, and where application logic belongs.',
    level: 'beginner',
    section: 'Foundations',
    order: 9,
    minutes: 12,
    content: [
      { type: 'p', text: 'Providers are classes that Nest can create and inject into other classes. The most common provider is a service. Services usually hold business logic, data access logic, or reusable operations.' },
      { type: 'h2', text: 'Create a service' },
      {
        type: 'code',
        title: 'tasks.service.ts',
        language: 'typescript',
        code: `import { Injectable } from '@nestjs/common';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    { id: 1, title: 'Learn providers', completed: false },
  ];

  findAll(): Task[] {
    return this.tasks;
  }
}`,
      },
      { type: 'p', text: '@Injectable marks the class as available for Nest dependency injection. It is a clear signal that this class can be managed by Nest.' },
      { type: 'h2', text: 'Register the provider' },
      {
        type: 'code',
        title: 'tasks.module.ts',
        language: 'typescript',
        code: `import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}`,
      },
      { type: 'h2', text: 'Use the service from a controller' },
      {
        type: 'code',
        title: 'tasks.controller.ts',
        language: 'typescript',
        code: `import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }
}`,
      },
      { type: 'h2', text: 'What belongs in a service' },
      { type: 'ul', items: ['Finding and transforming data', 'Calling repositories, APIs, queues, or email services', 'Enforcing business rules', 'Coordinating work across smaller helpers', 'Keeping controllers focused on HTTP concerns'] },
      { type: 'note', text: 'A service is not automatically a database model. It can use a database later, but beginners can start with in-memory arrays while learning the Nest structure.' },
      { type: 'try', text: 'Move an array of books from a controller into a BooksService. Then make the controller call booksService.findAll().' },
      { type: 'keypoints', items: ['Providers are classes managed by Nest.', 'Services are the most common provider type.', '@Injectable marks a class for dependency injection.', 'Register services in a module providers array.', 'Controllers should call services for business logic.'] },
    ],
  },
  {
    slug: 'nest-dependency-injection',
    title: 'Dependency Injection',
    description: 'Learn how NestJS gives classes the dependencies they need and why that makes code easier to test and maintain.',
    level: 'beginner',
    section: 'Foundations',
    order: 10,
    minutes: 13,
    content: [
      { type: 'p', text: 'Dependency injection means a class receives the objects it needs instead of creating them manually. In NestJS, controllers receive services, services can receive other services, and modules define what is available.' },
      { type: 'h2', text: 'Without dependency injection' },
      {
        type: 'code',
        title: 'Manual creation',
        language: 'typescript',
        code: `export class TasksController {
  private tasksService = new TasksService();

  findAll() {
    return this.tasksService.findAll();
  }
}`,
      },
      { type: 'p', text: 'This tightly couples the controller to a specific service creation step. Testing and replacing the service becomes harder.' },
      { type: 'h2', text: 'With Nest dependency injection' },
      {
        type: 'code',
        title: 'Injected service',
        language: 'typescript',
        code: `import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }
}`,
      },
      { type: 'p', text: 'Nest reads the constructor type, creates TasksService from the module providers list, and passes it into the controller.' },
      { type: 'h2', text: 'The module is the container boundary' },
      {
        type: 'code',
        title: 'tasks.module.ts',
        language: 'typescript',
        code: `@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}`,
      },
      { type: 'h2', text: 'Inject one service into another' },
      {
        type: 'code',
        title: 'notifications.service.ts',
        language: 'typescript',
        code: `import { Injectable } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly tasksService: TasksService) {}

  getReminderCount() {
    return this.tasksService.findAll().length;
  }
}`,
      },
      { type: 'h2', text: 'Why DI matters' },
      { type: 'ul', items: ['Classes are easier to test with fake dependencies.', 'Services can be reused across controllers.', 'Object creation stays consistent and centralized.', 'Dependencies are visible in constructors.', 'Your app can grow without route files creating everything manually.'] },
      { type: 'tip', text: 'If Nest says it cannot resolve dependencies, check that the dependency is listed in providers and that modules import/export it correctly.' },
      { type: 'try', text: 'Create a UsersController that receives UsersService in its constructor. Then register both classes in UsersModule.' },
      { type: 'keypoints', items: ['Dependency injection gives classes what they need.', 'Nest uses constructor types and module providers to wire dependencies.', 'Do not manually new up services in controllers.', 'DI improves testing, reuse, and maintainability.'] },
    ],
  },
  {
    slug: 'nest-routing',
    title: 'Routing & HTTP Methods',
    description: 'Build routes with @Get, @Post, @Patch, @Delete, path prefixes, and REST-style naming.',
    level: 'beginner',
    section: 'Building APIs',
    order: 11,
    minutes: 12,
    content: [
      { type: 'p', text: 'Routing connects an HTTP request to the controller method that should handle it. In NestJS, route paths come from a controller prefix plus method decorators.' },
      { type: 'h2', text: 'Controller prefix plus method path' },
      {
        type: 'code',
        title: 'tasks.controller.ts',
        language: 'typescript',
        code: `import { Controller, Get } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  findAll() {
    return 'GET /tasks';
  }

  @Get('archived')
  findArchived() {
    return 'GET /tasks/archived';
  }
}`,
      },
      { type: 'p', text: '@Controller("tasks") and @Get("archived") combine to create GET /tasks/archived.' },
      { type: 'h2', text: 'Common HTTP methods' },
      {
        type: 'code',
        title: 'REST-style methods',
        language: 'typescript',
        code: `import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  findAll() {
    return [];
  }

  @Post()
  create(@Body() body: { title: string }) {
    return body;
  }

  @Patch(':id')
  update() {
    return 'update one task';
  }

  @Delete(':id')
  remove() {
    return 'delete one task';
  }
}`,
      },
      {
        type: 'table',
        headers: ['HTTP method', 'Common use', 'Example route'],
        rows: [
          ['GET', 'Read data', 'GET /tasks'],
          ['POST', 'Create data', 'POST /tasks'],
          ['PATCH', 'Partially update data', 'PATCH /tasks/1'],
          ['PUT', 'Replace data', 'PUT /tasks/1'],
          ['DELETE', 'Remove data', 'DELETE /tasks/1'],
        ],
      },
      { type: 'h2', text: 'Use route names that describe resources' },
      { type: 'p', text: 'REST routes usually use nouns, not verbs. Prefer GET /tasks over GET /getTasks, because the HTTP method already describes the action.' },
      {
        type: 'code',
        title: 'Resource-style routes',
        language: 'text',
        code: `GET    /tasks
GET    /tasks/1
POST   /tasks
PATCH  /tasks/1
DELETE /tasks/1`,
      },
      { type: 'note', text: 'NestJS route decorators are imported from @nestjs/common. If a decorator is not found, check the import line first.' },
      { type: 'try', text: 'Design routes for a notes API. Include routes for listing notes, reading one note, creating a note, updating a note, and deleting a note.' },
      { type: 'keypoints', items: ['Routes are built from controller prefixes and method decorators.', '@Get, @Post, @Patch, @Put, and @Delete map to HTTP methods.', 'REST routes usually use resource nouns.', 'Method names are for code readability; decorators define the public route.'] },
    ],
  },
  {
    slug: 'nest-params-query',
    title: 'Params, Query & Headers',
    description: 'Read route parameters, query strings, and request headers in NestJS controllers.',
    level: 'beginner',
    section: 'Building APIs',
    order: 12,
    minutes: 12,
    content: [
      { type: 'p', text: 'APIs receive information in several places. Route params identify a resource, query strings filter or sort lists, and headers carry metadata such as authorization tokens, content type, or client information.' },
      { type: 'h2', text: 'Read route params' },
      {
        type: 'code',
        title: 'Route params',
        language: 'typescript',
        code: `import { Controller, Get, Param } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, message: 'One task' };
  }
}`,
      },
      { type: 'p', text: 'The :id part declares a route parameter. @Param("id") reads the value from the URL. It arrives as a string, even if it looks like a number.' },
      { type: 'h2', text: 'Read query strings' },
      {
        type: 'code',
        title: 'Query values',
        language: 'typescript',
        code: `import { Controller, Get, Query } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
  ) {
    return { status, limit };
  }
}`,
      },
      {
        type: 'code',
        title: 'Example request',
        language: 'text',
        code: `GET /tasks?status=open&limit=10`,
      },
      { type: 'h2', text: 'Read headers' },
      {
        type: 'code',
        title: 'Headers',
        language: 'typescript',
        code: `import { Controller, Get, Headers } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  @Get()
  getProfile(@Headers('authorization') authorization?: string) {
    return {
      hasToken: Boolean(authorization),
    };
  }
}`,
      },
      { type: 'h2', text: 'When to use each place' },
      {
        type: 'table',
        headers: ['Request part', 'Best for', 'Example'],
        rows: [
          ['Params', 'Identifying one resource', '/tasks/42'],
          ['Query', 'Filtering, searching, sorting, pagination', '/tasks?status=open'],
          ['Headers', 'Metadata and credentials', 'Authorization: Bearer token'],
          ['Body', 'Data for create or update operations', '{"title":"Study"}'],
        ],
      },
      { type: 'tip', text: 'Convert params and query values before using them as numbers. Later lessons use pipes to transform and validate values safely.' },
      { type: 'try', text: 'Write a route GET /products/:id/reviews?limit=5 that reads id from params and limit from query.' },
      { type: 'keypoints', items: ['Params come from named path segments such as :id.', 'Query values come after the question mark in the URL.', 'Headers carry request metadata.', 'Params and query values arrive as strings unless transformed.'] },
    ],
  },
  {
    slug: 'nest-body-dto',
    title: 'Request Body & DTOs',
    description: 'Use @Body and DTO classes to describe request data for create and update routes.',
    level: 'beginner',
    section: 'Building APIs',
    order: 13,
    minutes: 13,
    content: [
      { type: 'p', text: 'When a client creates or updates data, it usually sends a request body. In NestJS, @Body reads that data. A DTO, or Data Transfer Object, describes the expected shape of the data.' },
      { type: 'h2', text: 'Read a request body' },
      {
        type: 'code',
        title: 'tasks.controller.ts',
        language: 'typescript',
        code: `import { Body, Controller, Post } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Post()
  create(@Body() body: { title: string }) {
    return {
      message: 'Task created',
      task: body,
    };
  }
}`,
      },
      { type: 'p', text: 'This works, but inline object types become messy as request bodies grow. DTO classes are cleaner and can be used by validation libraries.' },
      { type: 'h2', text: 'Create a DTO class' },
      {
        type: 'code',
        title: 'dto/create-task.dto.ts',
        language: 'typescript',
        code: `export class CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string;
}`,
      },
      { type: 'p', text: 'The class describes what the client may send. title is required by the TypeScript shape, while description and dueDate are optional.' },
      { type: 'h2', text: 'Use the DTO in a controller' },
      {
        type: 'code',
        title: 'tasks.controller.ts',
        language: 'typescript',
        code: `import { Body, Controller, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return createTaskDto;
  }
}`,
      },
      { type: 'h2', text: 'Send JSON to the route' },
      {
        type: 'code',
        title: 'Example request body',
        language: 'json',
        code: `{
  "title": "Practice DTOs",
  "description": "Use a class for request data"
}`,
      },
      { type: 'h2', text: 'DTO naming pattern' },
      { type: 'ul', items: ['CreateTaskDto for creating a task', 'UpdateTaskDto for updating a task', 'FilterTasksDto for query filters', 'Use DTO names that describe the request purpose, not the database table only'] },
      { type: 'note', text: 'A DTO is not the same as a database entity. A DTO describes data crossing an API boundary. A database entity describes stored data.' },
      { type: 'try', text: 'Write a CreateBookDto with title, author, publishedYear, and optional summary. Use it in a POST /books controller method.' },
      { type: 'keypoints', items: ['@Body reads JSON request data.', 'DTO classes describe request shapes.', 'DTOs make controllers cleaner and prepare for validation.', 'Use separate DTOs for different actions when the shapes differ.'] },
    ],
  },
  {
    slug: 'nest-validation',
    title: 'Validation with class-validator',
    description: 'Validate DTOs with class-validator decorators and NestJS ValidationPipe.',
    level: 'beginner',
    section: 'Building APIs',
    order: 14,
    minutes: 15,
    content: [
      { type: 'p', text: 'Validation checks incoming data before your business logic uses it. In NestJS, a common beginner-friendly setup uses class-validator decorators on DTO classes and ValidationPipe to run those checks.' },
      { type: 'h2', text: 'Install validation packages' },
      {
        type: 'code',
        title: 'Install dependencies',
        language: 'bash',
        code: `npm install class-validator class-transformer`,
      },
      { type: 'h2', text: 'Add validation decorators to a DTO' },
      {
        type: 'code',
        title: 'dto/create-task.dto.ts',
        language: 'typescript',
        code: `import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}`,
      },
      { type: 'p', text: 'These decorators describe runtime validation rules. TypeScript types help your editor, but validation decorators check real incoming data from clients.' },
      { type: 'h2', text: 'Enable validation globally' },
      {
        type: 'code',
        title: 'main.ts',
        language: 'typescript',
        code: `import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();`,
      },
      { type: 'h2', text: 'What the options mean' },
      {
        type: 'table',
        headers: ['Option', 'Meaning'],
        rows: [
          ['whitelist', 'Remove properties without decorators'],
          ['forbidNonWhitelisted', 'Reject unknown properties instead of silently removing them'],
          ['transform', 'Convert payloads into DTO class instances and support type transforms'],
        ],
      },
      { type: 'h2', text: 'Example invalid request' },
      {
        type: 'code',
        title: 'Too-short title',
        language: 'json',
        code: `{
  "title": "Hi",
  "extra": "not allowed"
}`,
      },
      { type: 'p', text: 'With the pipe enabled, Nest returns a 400 Bad Request response before the controller logic continues.' },
      { type: 'note', text: 'TypeScript alone does not validate user input at runtime. API clients can send anything, so runtime validation is essential.' },
      { type: 'try', text: 'Add validation to CreateBookDto: title must be a string with at least 2 characters, author must be a string, and publishedYear should be optional.' },
      { type: 'keypoints', items: ['class-validator adds runtime validation rules to DTO classes.', 'ValidationPipe runs validation before controller logic.', 'whitelist and forbidNonWhitelisted protect your API shape.', 'Invalid requests should fail early with a clear 400 response.'] },
    ],
  },
  {
    slug: 'nest-pipes',
    title: 'Pipes',
    description: 'Learn how pipes transform and validate incoming request values in NestJS.',
    level: 'beginner',
    section: 'Building APIs',
    order: 15,
    minutes: 12,
    content: [
      { type: 'p', text: 'Pipes run before controller method logic. They can transform incoming values, validate them, or reject bad input. ValidationPipe is the most famous pipe, but Nest also includes smaller built-in pipes.' },
      { type: 'h2', text: 'Transform a route param to a number' },
      {
        type: 'code',
        title: 'ParseIntPipe',
        language: 'typescript',
        code: `import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return { id, type: typeof id };
  }
}`,
      },
      { type: 'p', text: 'Without ParseIntPipe, id would be a string. With the pipe, "42" becomes the number 42. If the value cannot become a number, Nest returns a 400 error.' },
      { type: 'h2', text: 'Use ValidationPipe for DTOs' },
      {
        type: 'code',
        title: 'Controller-level validation',
        language: 'typescript',
        code: `import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createTaskDto: CreateTaskDto) {
    return createTaskDto;
  }
}`,
      },
      { type: 'h2', text: 'Common built-in pipes' },
      {
        type: 'table',
        headers: ['Pipe', 'Use'],
        rows: [
          ['ParseIntPipe', 'Convert and validate numbers'],
          ['ParseBoolPipe', 'Convert and validate booleans'],
          ['ParseArrayPipe', 'Validate arrays'],
          ['ParseUUIDPipe', 'Validate UUID strings'],
          ['DefaultValuePipe', 'Provide a default when a value is missing'],
          ['ValidationPipe', 'Validate DTO classes'],
        ],
      },
      { type: 'h2', text: 'Provide a query default' },
      {
        type: 'code',
        title: 'DefaultValuePipe with ParseIntPipe',
        language: 'typescript',
        code: `import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return { limit };
  }
}`,
      },
      { type: 'tip', text: 'Use pipes at the parameter level for small transformations and globally for validation rules you want across the whole app.' },
      { type: 'try', text: 'Add ParseIntPipe to a GET /products/:id route. Test with /products/123 and /products/abc to see the success and error cases.' },
      { type: 'keypoints', items: ['Pipes run before controller method logic.', 'Pipes can transform, validate, or reject values.', 'ParseIntPipe is useful for numeric route params.', 'ValidationPipe is commonly enabled globally for DTO validation.'] },
    ],
  },
  {
    slug: 'nest-status-codes',
    title: 'Status Codes & Responses',
    description: 'Return useful HTTP status codes, response bodies, and headers in beginner-friendly NestJS controllers.',
    level: 'beginner',
    section: 'Building APIs',
    order: 16,
    minutes: 12,
    content: [
      { type: 'p', text: 'HTTP responses contain a status code and usually a body. NestJS chooses sensible defaults, but you can customize status codes when an endpoint needs a different response.' },
      { type: 'h2', text: 'Default NestJS response behavior' },
      {
        type: 'table',
        headers: ['Controller action', 'Default status'],
        rows: [
          ['GET returns data', '200 OK'],
          ['POST creates data', '201 Created'],
          ['PATCH updates data', '200 OK'],
          ['DELETE removes data', '200 OK unless customized'],
          ['Validation fails', '400 Bad Request'],
        ],
      },
      {
        type: 'code',
        title: 'Default responses',
        language: 'typescript',
        code: `import { Controller, Get, Post } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  findAll() {
    return [];
  }

  @Post()
  create() {
    return { id: 1, title: 'New task' };
  }
}`,
      },
      { type: 'h2', text: 'Set a status code' },
      {
        type: 'code',
        title: 'HttpCode decorator',
        language: 'typescript',
        code: `import { Controller, Delete, HttpCode, Param } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return;
  }
}`,
      },
      { type: 'p', text: '204 No Content means the request succeeded and there is no response body. It is common for delete operations.' },
      { type: 'h2', text: 'Add a response header' },
      {
        type: 'code',
        title: 'Header decorator',
        language: 'typescript',
        code: `import { Controller, Get, Header } from '@nestjs/common';

@Controller('reports')
export class ReportsController {
  @Get('summary')
  @Header('Cache-Control', 'no-store')
  getSummary() {
    return { total: 3 };
  }
}`,
      },
      { type: 'h2', text: 'Response body shape' },
      { type: 'p', text: 'For beginner APIs, return plain objects and arrays. Nest serializes them as JSON. Try to keep response shapes predictable, especially for errors and list endpoints.' },
      {
        type: 'code',
        title: 'Predictable list response',
        language: 'typescript',
        code: `return {
  data: tasks,
  count: tasks.length,
};`,
      },
      { type: 'note', text: 'Nest lets you inject the raw response object with @Res, but beginners should usually avoid it. Returning values directly keeps Nest features like interceptors and testing simpler.' },
      { type: 'try', text: 'Update a DELETE route to return 204 with @HttpCode(204). Then decide what status code a successful POST route should return.' },
      { type: 'keypoints', items: ['Responses include status codes and often JSON bodies.', 'Nest provides useful default status codes.', '@HttpCode changes the status for a route.', 'Return plain objects and arrays for simple JSON APIs.', 'Use 204 when a successful response has no body.'] },
    ],
  },
  {
    slug: 'nest-exception-filters',
    title: 'Exception Filters Basics',
    description: 'Use built-in HTTP exceptions and understand how exception filters shape error responses.',
    level: 'beginner',
    section: 'Building APIs',
    order: 17,
    minutes: 13,
    content: [
      { type: 'p', text: 'Errors are part of every API. NestJS provides built-in HTTP exceptions such as NotFoundException and BadRequestException. When you throw one, Nest turns it into a proper HTTP error response.' },
      { type: 'h2', text: 'Throw a built-in exception' },
      {
        type: 'code',
        title: 'tasks.service.ts',
        language: 'typescript',
        code: `import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks = [{ id: 1, title: 'Learn errors' }];

  findOne(id: number) {
    const task = this.tasks.find((item) => item.id === id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}`,
      },
      { type: 'p', text: 'If the task does not exist, Nest sends a 404 response. The controller does not need to manually set the status code.' },
      { type: 'h2', text: 'Common HTTP exceptions' },
      {
        type: 'table',
        headers: ['Exception', 'Status', 'Use'],
        rows: [
          ['BadRequestException', '400', 'Invalid input or impossible request'],
          ['UnauthorizedException', '401', 'Missing or invalid login credentials'],
          ['ForbiddenException', '403', 'Logged in but not allowed'],
          ['NotFoundException', '404', 'Resource does not exist'],
          ['ConflictException', '409', 'Duplicate or conflicting state'],
        ],
      },
      { type: 'h2', text: 'Controller stays clean' },
      {
        type: 'code',
        title: 'tasks.controller.ts',
        language: 'typescript',
        code: `import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }
}`,
      },
      { type: 'h2', text: 'What exception filters do' },
      { type: 'p', text: 'An exception filter catches thrown exceptions and controls the final error response. Nest has a default exception filter, so beginners can use built-in exceptions immediately. Custom filters are useful when you need a company-wide error shape or special logging.' },
      {
        type: 'code',
        title: 'Example error response',
        language: 'json',
        code: `{
  "message": "Task not found",
  "error": "Not Found",
  "statusCode": 404
}`,
      },
      { type: 'note', text: 'Do not return error objects as successful responses. Throw exceptions so HTTP status codes correctly communicate success or failure.' },
      { type: 'try', text: 'Add NotFoundException to a findOne method for books. If no book matches the id, throw a 404 instead of returning null.' },
      { type: 'keypoints', items: ['Nest has built-in HTTP exception classes.', 'Throwing NotFoundException creates a 404 response.', 'Exception filters control how thrown errors become HTTP responses.', 'Use exceptions instead of successful responses that contain error messages.'] },
    ],
  },
  {
    slug: 'nest-config-env',
    title: 'Config & Environment Variables',
    description: 'Load environment variables with @nestjs/config and use ConfigService safely in your app.',
    level: 'beginner',
    section: 'App Basics',
    order: 18,
    minutes: 14,
    content: [
      { type: 'p', text: 'Applications need configuration: port numbers, database URLs, API keys, feature flags, and environment names. Environment variables let each deployment provide different values without changing source code.' },
      { type: 'h2', text: 'Install the config package' },
      {
        type: 'code',
        title: 'Install @nestjs/config',
        language: 'bash',
        code: `npm install @nestjs/config`,
      },
      { type: 'h2', text: 'Create a .env file' },
      {
        type: 'code',
        title: '.env',
        language: 'text',
        code: `PORT=3000
APP_NAME=Tasks API
DATABASE_URL=postgres://user:password@localhost:5432/tasks`,
      },
      { type: 'p', text: 'A .env file is useful for local development. Real production secrets should be set through your hosting platform or secret manager.' },
      { type: 'h2', text: 'Register ConfigModule' },
      {
        type: 'code',
        title: 'app.module.ts',
        language: 'typescript',
        code: `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}`,
      },
      { type: 'h2', text: 'Use ConfigService' },
      {
        type: 'code',
        title: 'app.service.ts',
        language: 'typescript',
        code: `import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getInfo() {
    return {
      name: this.configService.get<string>('APP_NAME', 'Nest API'),
      environment: this.configService.get<string>('NODE_ENV', 'development'),
    };
  }
}`,
      },
      { type: 'h2', text: 'Use the port in main.ts' },
      {
        type: 'code',
        title: 'main.ts',
        language: 'typescript',
        code: `import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);
}

bootstrap();`,
      },
      { type: 'warning', text: 'Do not commit real secrets to git. Keep .env files out of the repository when they contain passwords, tokens, or private URLs.' },
      { type: 'try', text: 'Add APP_NAME to a local .env file, read it with ConfigService, and return it from a GET /health route.' },
      { type: 'keypoints', items: ['Environment variables configure apps without changing source code.', '@nestjs/config provides ConfigModule and ConfigService.', 'isGlobal: true makes ConfigService available across modules.', 'Keep real secrets out of committed source files.'] },
    ],
  },
  {
    slug: 'nest-global-modules',
    title: 'Global Modules & Shared Modules',
    description: 'Understand shared modules, global modules, exports, and when to make utilities available across a NestJS app.',
    level: 'beginner',
    section: 'App Basics',
    order: 19,
    minutes: 12,
    content: [
      { type: 'p', text: 'As apps grow, some providers are used in many places: configuration, logging, date helpers, mail clients, or database connections. NestJS shares providers through module exports and imports. Global modules are available everywhere, but should be used carefully.' },
      { type: 'h2', text: 'Create a shared module' },
      {
        type: 'code',
        title: 'logger.service.ts',
        language: 'typescript',
        code: `import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  log(message: string) {
    console.log(message);
  }
}`,
      },
      {
        type: 'code',
        title: 'shared.module.ts',
        language: 'typescript',
        code: `import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class SharedModule {}`,
      },
      { type: 'p', text: 'exports makes LoggerService available to modules that import SharedModule.' },
      { type: 'h2', text: 'Import the shared module where needed' },
      {
        type: 'code',
        title: 'tasks.module.ts',
        language: 'typescript',
        code: `import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [SharedModule],
  providers: [TasksService],
})
export class TasksModule {}`,
      },
      { type: 'h2', text: 'Make a module global' },
      {
        type: 'code',
        title: 'shared.module.ts',
        language: 'typescript',
        code: `import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class SharedModule {}`,
      },
      { type: 'p', text: 'A global module only needs to be imported once, usually in AppModule. Its exported providers become available throughout the app.' },
      {
        type: 'table',
        headers: ['Approach', 'Best for'],
        rows: [
          ['Shared module with imports', 'Most reusable utilities'],
          ['Global module', 'Truly app-wide infrastructure such as config or logging'],
          ['Direct provider in feature module', 'Feature-specific logic only used there'],
        ],
      },
      { type: 'tip', text: 'Prefer explicit imports until repetition becomes noisy. Global modules are convenient, but too many globals can hide where dependencies come from.' },
      { type: 'try', text: 'Create a DateService in a SharedModule, export it, and import SharedModule into another feature module.' },
      { type: 'keypoints', items: ['Modules share providers by exporting and importing them.', 'Shared modules collect reusable app utilities.', '@Global makes exported providers available across the app.', 'Use global modules sparingly for true infrastructure concerns.'] },
    ],
  },
  {
    slug: 'nest-lifecycle',
    title: 'Lifecycle Events',
    description: 'Learn the basic NestJS lifecycle hooks used during startup, shutdown, and module initialization.',
    level: 'beginner',
    section: 'App Basics',
    order: 20,
    minutes: 12,
    content: [
      { type: 'p', text: 'Lifecycle events let your classes run code at important moments, such as when a module initializes or when the app shuts down. Beginners do not need every hook, but knowing the common ones helps when connecting databases, queues, and background workers.' },
      { type: 'h2', text: 'Module initialization' },
      {
        type: 'code',
        title: 'tasks.service.ts',
        language: 'typescript',
        code: `import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class TasksService implements OnModuleInit {
  onModuleInit() {
    console.log('TasksService is ready');
  }
}`,
      },
      { type: 'p', text: 'onModuleInit runs after Nest has initialized the module that owns the provider.' },
      { type: 'h2', text: 'Application bootstrap' },
      {
        type: 'code',
        title: 'app.service.ts',
        language: 'typescript',
        code: `import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    console.log('Application has bootstrapped');
  }
}`,
      },
      { type: 'h2', text: 'Shutdown hooks' },
      {
        type: 'code',
        title: 'main.ts',
        language: 'typescript',
        code: `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3000);
}

bootstrap();`,
      },
      {
        type: 'code',
        title: 'database.service.ts',
        language: 'typescript',
        code: `import { Injectable, OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  onApplicationShutdown(signal?: string) {
    console.log('Close database connection', signal);
  }
}`,
      },
      { type: 'h2', text: 'Common lifecycle hooks' },
      {
        type: 'table',
        headers: ['Hook', 'When it runs'],
        rows: [
          ['onModuleInit', 'After a module is initialized'],
          ['onApplicationBootstrap', 'After the app fully bootstraps'],
          ['onModuleDestroy', 'When a module is being destroyed'],
          ['onApplicationShutdown', 'During app shutdown when hooks are enabled'],
        ],
      },
      { type: 'note', text: 'Avoid putting normal request logic in lifecycle hooks. Use them for setup, warmup, connection management, and cleanup.' },
      { type: 'try', text: 'Add OnModuleInit to a service and log a message. Restart the dev server and observe when the message appears.' },
      { type: 'keypoints', items: ['Lifecycle hooks run during startup and shutdown phases.', 'onModuleInit is useful for provider setup.', 'enableShutdownHooks allows shutdown cleanup hooks to run.', 'Use lifecycle hooks for infrastructure concerns, not regular request handling.'] },
    ],
  },
  {
    slug: 'nest-devtools',
    title: 'Debugging & Nest Dev Workflow',
    description: 'Use watch mode, logs, curl, debugger habits, and common troubleshooting steps while building NestJS apps.',
    level: 'beginner',
    section: 'App Basics',
    order: 21,
    minutes: 13,
    content: [
      { type: 'p', text: 'A good development workflow makes learning NestJS much easier. You need a running dev server, a way to send requests, useful logs, and a few troubleshooting habits for dependency injection and routing errors.' },
      { type: 'h2', text: 'Run in watch mode' },
      {
        type: 'code',
        title: 'Start the dev server',
        language: 'bash',
        code: `npm run start:dev`,
      },
      { type: 'p', text: 'Watch mode rebuilds and restarts the app when you save files. Keep the terminal visible so you can read startup errors and request logs.' },
      { type: 'h2', text: 'Send requests from the terminal' },
      {
        type: 'code',
        title: 'curl examples',
        language: 'bash',
        code: `curl http://localhost:3000/tasks
curl -X POST http://localhost:3000/tasks \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Debug workflow"}'`,
      },
      { type: 'h2', text: 'Use Nest Logger' },
      {
        type: 'code',
        title: 'tasks.service.ts',
        language: 'typescript',
        code: `import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  findAll() {
    this.logger.log('Finding all tasks');
    return [];
  }
}`,
      },
      { type: 'h2', text: 'Common beginner errors' },
      {
        type: 'table',
        headers: ['Error clue', 'Likely fix'],
        rows: [
          ['Cannot resolve dependencies', 'Register provider or import/export the correct module'],
          ['404 for a route', 'Check controller prefix, method path, and module registration'],
          ['Decorator is undefined', 'Check imports from @nestjs/common'],
          ['Validation does not run', 'Enable ValidationPipe and add validation decorators'],
          ['Port already in use', 'Stop the other server or change PORT'],
        ],
      },
      { type: 'h2', text: 'Debug with a Node inspector script' },
      {
        type: 'code',
        title: 'package.json script',
        language: 'json',
        code: `{
  "scripts": {
    "start:debug": "nest start --debug --watch"
  }
}`,
      },
      { type: 'tip', text: 'When a route does not work, verify three things in order: controller decorator path, method decorator path, and module registration.' },
      { type: 'try', text: 'Create a route, call it with curl, add a Logger message inside the service, and confirm the log appears when the request runs.' },
      { type: 'keypoints', items: ['Use start:dev for fast feedback.', 'curl or an API client helps test routes directly.', 'Nest Logger gives structured class-based logs.', 'Most beginner routing and DI errors come from missing decorators, providers, or module imports.'] },
    ],
  },
  {
    slug: 'nest-rest-crud',
    title: 'CRUD REST Pattern',
    description: 'Learn the common create, read, update, delete pattern used by many NestJS REST APIs.',
    level: 'beginner',
    section: 'Practice',
    order: 22,
    minutes: 15,
    content: [
      { type: 'p', text: 'CRUD stands for Create, Read, Update, and Delete. Many beginner REST APIs are built around CRUD routes for resources such as tasks, notes, products, users, and orders.' },
      { type: 'h2', text: 'CRUD routes for tasks' },
      {
        type: 'table',
        headers: ['Action', 'HTTP route', 'Controller method'],
        rows: [
          ['List all tasks', 'GET /tasks', 'findAll'],
          ['Read one task', 'GET /tasks/:id', 'findOne'],
          ['Create a task', 'POST /tasks', 'create'],
          ['Update a task', 'PATCH /tasks/:id', 'update'],
          ['Delete a task', 'DELETE /tasks/:id', 'remove'],
        ],
      },
      { type: 'h2', text: 'DTOs for create and update' },
      {
        type: 'code',
        title: 'dto/create-task.dto.ts',
        language: 'typescript',
        code: `import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}`,
      },
      {
        type: 'code',
        title: 'dto/update-task.dto.ts',
        language: 'typescript',
        code: `import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}`,
      },
      { type: 'h2', text: 'Service with in-memory data' },
      {
        type: 'code',
        title: 'tasks.service.ts',
        language: 'typescript',
        code: `import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

type Task = {
  id: number;
  title: string;
  description?: string;
};

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private nextId = 1;

  findAll() {
    return this.tasks;
  }

  findOne(id: number) {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  create(createTaskDto: CreateTaskDto) {
    const task = { id: this.nextId++, ...createTaskDto };
    this.tasks.push(task);
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = this.findOne(id);
    Object.assign(task, updateTaskDto);
    return task;
  }

  remove(id: number) {
    const task = this.findOne(id);
    this.tasks = this.tasks.filter((item) => item.id !== task.id);
  }
}`,
      },
      { type: 'h2', text: 'Controller routes' },
      {
        type: 'code',
        title: 'tasks.controller.ts',
        language: 'typescript',
        code: `import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.tasksService.remove(id);
  }
}`,
      },
      { type: 'note', text: 'In-memory arrays reset when the server restarts. That is fine for learning the CRUD pattern before adding a real database.' },
      { type: 'try', text: 'Build the same CRUD route set for notes. Use title and body fields, and throw NotFoundException when a note id does not exist.' },
      { type: 'keypoints', items: ['CRUD maps common data actions to REST routes.', 'DTOs describe create and update request bodies.', 'Services hold the data logic and not-found checks.', 'Controllers map HTTP routes to service methods.', 'Use ParseIntPipe for numeric ids and 204 for empty delete responses.'] },
    ],
  },
  {
    slug: 'nest-feature-modules',
    title: 'Feature Modules in Practice',
    description: 'Organize a real feature folder with module, controller, service, DTOs, and clean imports.',
    level: 'beginner',
    section: 'Practice',
    order: 23,
    minutes: 13,
    content: [
      { type: 'p', text: 'A feature module keeps related files together. Instead of scattering tasks code across the app, you place the tasks module, controller, service, and DTOs in one feature folder.' },
      { type: 'h2', text: 'A feature folder layout' },
      {
        type: 'code',
        title: 'src/tasks folder',
        language: 'text',
        code: `src/
  tasks/
    dto/
      create-task.dto.ts
      update-task.dto.ts
    tasks.controller.ts
    tasks.module.ts
    tasks.service.ts
  app.module.ts
  main.ts`,
      },
      { type: 'h2', text: 'Generate feature files' },
      {
        type: 'code',
        title: 'Nest CLI commands',
        language: 'bash',
        code: `nest generate module tasks
nest generate controller tasks
nest generate service tasks`,
      },
      { type: 'p', text: 'The CLI updates the closest module automatically in many cases. Still, always check the generated module to make sure the controller and service are registered where you expect.' },
      { type: 'h2', text: 'Feature module wiring' },
      {
        type: 'code',
        title: 'tasks.module.ts',
        language: 'typescript',
        code: `import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}`,
      },
      { type: 'h2', text: 'Import the feature once' },
      {
        type: 'code',
        title: 'app.module.ts',
        language: 'typescript',
        code: `import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule],
})
export class AppModule {}`,
      },
      { type: 'h2', text: 'When features need each other' },
      { type: 'p', text: 'If OrdersService needs ProductsService, ProductsModule should export ProductsService and OrdersModule should import ProductsModule. This keeps dependencies explicit.' },
      {
        type: 'code',
        title: 'products.module.ts',
        language: 'typescript',
        code: `@Module({
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}`,
      },
      {
        type: 'code',
        title: 'orders.module.ts',
        language: 'typescript',
        code: `@Module({
  imports: [ProductsModule],
  providers: [OrdersService],
})
export class OrdersModule {}`,
      },
      { type: 'tip', text: 'Feature folders should be boring and predictable. New teammates should know where the controller, service, module, and DTOs are without searching.' },
      { type: 'try', text: 'Design the folder structure for a blog API with posts and comments features. Decide which DTOs each feature needs.' },
      { type: 'keypoints', items: ['Feature modules group related NestJS files.', 'Use the CLI to generate modules, controllers, and services quickly.', 'Import feature modules into AppModule or another parent module.', 'Export providers only when another module needs them.', 'Predictable folders make apps easier to grow.'] },
    ],
  },
  {
    slug: 'nest-error-patterns',
    title: 'Practical Error Patterns',
    description: 'Handle common beginner API error cases with clear exceptions, validation, and consistent service logic.',
    level: 'beginner',
    section: 'Practice',
    order: 24,
    minutes: 13,
    content: [
      { type: 'p', text: 'Good APIs fail clearly. Clients should know when data is missing, invalid, duplicated, or forbidden. NestJS helps by giving you exception classes and validation tools that map naturally to HTTP status codes.' },
      { type: 'h2', text: 'Not found pattern' },
      {
        type: 'code',
        title: 'find task or throw',
        language: 'typescript',
        code: `import { NotFoundException } from '@nestjs/common';

findOne(id: number) {
  const task = this.tasks.find((item) => item.id === id);

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  return task;
}`,
      },
      { type: 'p', text: 'Do not return undefined for missing resources. Throwing a 404 communicates the problem with the correct HTTP status.' },
      { type: 'h2', text: 'Conflict pattern' },
      {
        type: 'code',
        title: 'duplicate title check',
        language: 'typescript',
        code: `import { ConflictException } from '@nestjs/common';

create(createTaskDto: CreateTaskDto) {
  const existing = this.tasks.find(
    (task) => task.title === createTaskDto.title,
  );

  if (existing) {
    throw new ConflictException('A task with this title already exists');
  }

  const task = { id: this.nextId++, ...createTaskDto };
  this.tasks.push(task);
  return task;
}`,
      },
      { type: 'h2', text: 'Bad request pattern' },
      {
        type: 'code',
        title: 'business rule error',
        language: 'typescript',
        code: `import { BadRequestException } from '@nestjs/common';

completeTask(id: number) {
  const task = this.findOne(id);

  if (task.completed) {
    throw new BadRequestException('Task is already completed');
  }

  task.completed = true;
  return task;
}`,
      },
      { type: 'h2', text: 'Validation handles shape errors' },
      {
        type: 'code',
        title: 'DTO validation',
        language: 'typescript',
        code: `import { IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  title: string;
}`,
      },
      {
        type: 'table',
        headers: ['Problem', 'Recommended response'],
        rows: [
          ['Bad JSON body shape', '400 Bad Request through validation'],
          ['Resource does not exist', '404 Not Found'],
          ['Duplicate unique value', '409 Conflict'],
          ['Not logged in', '401 Unauthorized'],
          ['Logged in but blocked', '403 Forbidden'],
        ],
      },
      { type: 'note', text: 'Keep error checks close to the service logic that understands the business rule. Controllers should not become long collections of if statements.' },
      { type: 'try', text: 'Add a duplicate email check to a UsersService create method and throw ConflictException when the email already exists.' },
      { type: 'keypoints', items: ['Use specific exceptions for common API failures.', 'Validation handles request shape errors before service logic.', 'NotFoundException is better than returning undefined.', 'ConflictException fits duplicate or state conflict errors.', 'Keep business rule checks in services.'] },
    ],
  },
  {
    slug: 'nest-mini-api',
    title: 'Mini Project: Tasks API',
    description: 'Put beginner NestJS concepts together by building a small validated Tasks API.',
    level: 'beginner',
    section: 'Putting It Together',
    order: 25,
    minutes: 15,
    content: [
      { type: 'p', text: 'This mini project combines the beginner pieces: a feature module, controller, service, DTOs, validation, pipes, exceptions, and REST routes. The API stores tasks in memory so you can focus on NestJS structure before adding a database.' },
      { type: 'h2', text: 'Project goal' },
      { type: 'ul', items: ['GET /tasks lists tasks.', 'GET /tasks/:id reads one task.', 'POST /tasks creates a task from a validated body.', 'PATCH /tasks/:id updates a task.', 'DELETE /tasks/:id removes a task with 204 No Content.'] },
      { type: 'h2', text: 'Create the feature' },
      {
        type: 'code',
        title: 'Generate files',
        language: 'bash',
        code: `nest generate module tasks
nest generate controller tasks
nest generate service tasks
npm install class-validator class-transformer`,
      },
      { type: 'h2', text: 'Enable validation' },
      {
        type: 'code',
        title: 'main.ts',
        language: 'typescript',
        code: `import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();`,
      },
      { type: 'h2', text: 'Add DTOs' },
      {
        type: 'code',
        title: 'tasks/dto/create-task.dto.ts',
        language: 'typescript',
        code: `import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}`,
      },
      {
        type: 'code',
        title: 'tasks/dto/update-task.dto.ts',
        language: 'typescript',
        code: `import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}`,
      },
      { type: 'h2', text: 'Build the service' },
      {
        type: 'code',
        title: 'tasks/tasks.service.ts',
        language: 'typescript',
        code: `import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
};

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private nextId = 1;

  findAll() {
    return this.tasks;
  }

  findOne(id: number) {
    const task = this.tasks.find((item) => item.id === id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  create(createTaskDto: CreateTaskDto) {
    const task: Task = {
      id: this.nextId++,
      completed: false,
      ...createTaskDto,
    };

    this.tasks.push(task);
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = this.findOne(id);
    Object.assign(task, updateTaskDto);
    return task;
  }

  remove(id: number) {
    const task = this.findOne(id);
    this.tasks = this.tasks.filter((item) => item.id !== task.id);
  }
}`,
      },
      { type: 'h2', text: 'Build the controller' },
      {
        type: 'code',
        title: 'tasks/tasks.controller.ts',
        language: 'typescript',
        code: `import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.tasksService.remove(id);
  }
}`,
      },
      { type: 'h2', text: 'Test the API' },
      {
        type: 'code',
        title: 'curl requests',
        language: 'bash',
        code: `curl http://localhost:3000/tasks
curl -X POST http://localhost:3000/tasks \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Finish NestJS beginner project"}'
curl http://localhost:3000/tasks/1
curl -X PATCH http://localhost:3000/tasks/1 \\
  -H "Content-Type: application/json" \\
  -d '{"completed":true}'
curl -X DELETE http://localhost:3000/tasks/1`,
      },
      { type: 'tip', text: 'After this mini project works, the next natural step is replacing the in-memory array with a database while keeping the controller and DTO pattern mostly the same.' },
      { type: 'try', text: 'Extend the mini project with GET /tasks?completed=true. Read the query value, convert it to a boolean, and return only matching tasks.' },
      { type: 'keypoints', items: ['The mini project combines modules, controllers, services, DTOs, validation, pipes, and exceptions.', 'In-memory data is useful for learning but not persistent.', 'ValidationPipe protects all DTO-based routes.', 'A clean service/controller split makes it easier to add a database later.', 'You now have the foundation for larger NestJS APIs.'] },
    ],
  },
];
