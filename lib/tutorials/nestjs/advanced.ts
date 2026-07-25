import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'nest-architecture',
    title: 'Structuring Larger Nest Apps',
    description:
      'Learn how to organize a NestJS codebase so features, modules, providers, and shared utilities stay understandable as the app grows.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 49,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Small NestJS apps can survive with a few modules and controllers. Larger apps need stronger boundaries. Good structure helps you answer simple questions quickly: where does this feature live, who owns this rule, where is data saved, and what can import what?',
      },
      {
        type: 'p',
        text: 'Nest already gives you modules, controllers, providers, dependency injection, pipes, guards, and interceptors. Advanced architecture is about using those tools consistently instead of creating one large application module that knows everything.',
      },
      { type: 'h2', text: 'Start with feature modules' },
      {
        type: 'code',
        language: 'text',
        title: 'Feature-first NestJS layout',
        code: `src/
  main.ts
  app.module.ts
  config/
    env.validation.ts
  common/
    filters/
    guards/
    interceptors/
    pipes/
  database/
    database.module.ts
    prisma.service.ts
  modules/
    users/
      users.module.ts
      users.controller.ts
      users.service.ts
      dto/
      entities/
    orders/
      orders.module.ts
      orders.controller.ts
      orders.service.ts
      dto/
      entities/
    billing/
      billing.module.ts
      billing.service.ts
      billing.gateway.ts`,
      },
      {
        type: 'p',
        text: 'Feature folders keep the code that changes together close together. A user change usually touches the users controller, DTOs, service, and tests. Those files should be nearby.',
      },
      { type: 'h2', text: 'Know the job of each Nest building block' },
      {
        type: 'table',
        headers: ['Building block', 'Owns', 'Avoid putting here'],
        rows: [
          ['Module', 'Provider wiring, imports, exports, feature boundary', 'Business workflows'],
          ['Controller', 'HTTP route shape, request DTOs, status codes', 'Database queries and transactions'],
          ['Provider or service', 'Use cases, business rules, orchestration', 'Raw Express response logic'],
          ['Repository or data service', 'Persistence details', 'Authorization decisions'],
          ['Guard', 'Authentication and authorization decisions', 'Response formatting'],
          ['Interceptor', 'Cross-cutting behavior around calls', 'Core feature rules'],
          ['Pipe', 'Validation and transformation', 'Database writes'],
        ],
      },
      { type: 'h2', text: 'Keep modules explicit' },
      {
        type: 'code',
        language: 'typescript',
        title: 'users.module.ts',
        code: `import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}`,
      },
      {
        type: 'p',
        text: 'Only export providers that other modules truly need. If every provider is exported, the module boundary becomes meaningless. Imports should tell a reader which features depend on which other features.',
      },
      { type: 'h2', text: 'Prefer one-way dependencies' },
      {
        type: 'ul',
        items: [
          'AppModule imports feature modules.',
          'Feature modules can import shared infrastructure modules such as ConfigModule, DatabaseModule, or CacheModule.',
          'A feature can import another feature only when it needs a public provider from that feature.',
          'Avoid circular imports. If two features need each other, extract a smaller shared service or publish an event.',
          'Keep common utilities boring. CommonModule should not become a hidden application core.',
        ],
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'app.module.ts',
        code: `import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    OrdersModule,
  ],
})
export class AppModule {}`,
      },
      { type: 'h2', text: 'Use public APIs between modules' },
      {
        type: 'p',
        text: 'A module should not reach into another module folder and import private files just because TypeScript allows it. Treat exported providers as the public API of that feature. This makes refactoring safer.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'orders.service.ts using a public users provider',
        code: `import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(private readonly usersService: UsersService) {}

  async createOrder(userId: string, productId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: crypto.randomUUID(),
      userId,
      productId,
      status: 'pending',
    };
  }
}`,
      },
      { type: 'h2', text: 'Architecture checklist' },
      {
        type: 'ul',
        items: [
          'Can a new developer find a feature by folder name?',
          'Can each controller be understood without reading database code?',
          'Are DTOs used at the HTTP boundary?',
          'Are module exports intentional and small?',
          'Are cross-cutting tools in common or infrastructure folders?',
          'Are environment variables read through ConfigModule instead of directly across the app?',
          'Can services be tested without opening an HTTP server?',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Large NestJS apps scale best around feature modules with explicit imports and exports.',
          'Controllers describe transport. Services own workflows. Infrastructure modules hide external systems.',
          'Avoid circular dependencies by extracting shared services or using events.',
        ],
      },
    ],
  },
  {
    slug: 'nest-clean-architecture',
    title: 'Clean Architecture Patterns in Nest',
    description:
      'Apply clean architecture ideas in NestJS with use cases, ports, adapters, and dependency injection tokens.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 50,
    minutes: 19,
    content: [
      {
        type: 'p',
        text: 'Clean architecture separates business rules from frameworks and databases. In NestJS, this means your most important application logic should not depend directly on HTTP decorators, ORM models, or message broker clients.',
      },
      {
        type: 'p',
        text: 'You do not need a complicated folder tree for every project. Use clean architecture when the domain is valuable, rules change often, or multiple transports need to reuse the same behavior.',
      },
      { type: 'h2', text: 'The practical layers' },
      {
        type: 'table',
        headers: ['Layer', 'Example in Nest', 'Depends on'],
        rows: [
          ['Domain', 'Entity, value object, domain policy', 'Nothing Nest-specific'],
          ['Application', 'Use case class, command handler', 'Domain and ports'],
          ['Infrastructure', 'Prisma repository, email adapter, queue adapter', 'External tools'],
          ['Interface', 'Controller, resolver, message handler', 'Application layer'],
        ],
      },
      {
        type: 'code',
        language: 'text',
        title: 'Clean module structure',
        code: `src/modules/accounts/
  domain/
    account.entity.ts
    email.vo.ts
  application/
    ports/
      accounts.repository.ts
      password-hasher.ts
    use-cases/
      register-account.use-case.ts
  infrastructure/
    prisma-accounts.repository.ts
    bcrypt-password-hasher.ts
  interface/
    accounts.controller.ts
    dto/
      register-account.dto.ts
  accounts.module.ts`,
      },
      { type: 'h2', text: 'Domain code should be plain TypeScript' },
      {
        type: 'code',
        language: 'typescript',
        title: 'domain/account.entity.ts',
        code: `export type AccountRole = 'user' | 'admin';

export class Account {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: AccountRole,
  ) {}

  canManageUsers() {
    return this.role === 'admin';
  }
}`,
      },
      {
        type: 'p',
        text: 'This entity does not import NestJS. That makes it simple to test and safe to reuse from HTTP, GraphQL, jobs, or message handlers.',
      },
      { type: 'h2', text: 'Use ports for external dependencies' },
      {
        type: 'code',
        language: 'typescript',
        title: 'application/ports/accounts.repository.ts',
        code: `import { Account } from '../../domain/account.entity';

export const ACCOUNTS_REPOSITORY = Symbol('ACCOUNTS_REPOSITORY');

export interface AccountsRepository {
  findByEmail(email: string): Promise<Account | null>;
  save(account: Account): Promise<Account>;
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'application/ports/password-hasher.ts',
        code: `export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

export interface PasswordHasher {
  hash(password: string): Promise<string>;
}`,
      },
      { type: 'h2', text: 'Write use cases around application behavior' },
      {
        type: 'code',
        language: 'typescript',
        title: 'application/use-cases/register-account.use-case.ts',
        code: `import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Account } from '../../domain/account.entity';
import {
  ACCOUNTS_REPOSITORY,
  AccountsRepository,
} from '../ports/accounts.repository';
import { PASSWORD_HASHER, PasswordHasher } from '../ports/password-hasher';

type RegisterAccountInput = {
  email: string;
  password: string;
};

@Injectable()
export class RegisterAccountUseCase {
  constructor(
    @Inject(ACCOUNTS_REPOSITORY)
    private readonly accountsRepository: AccountsRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterAccountInput) {
    const existing = await this.accountsRepository.findByEmail(input.email);

    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const account = new Account(crypto.randomUUID(), input.email, passwordHash, 'user');

    return this.accountsRepository.save(account);
  }
}`,
      },
      { type: 'h2', text: 'Bind interfaces to adapters in the module' },
      {
        type: 'code',
        language: 'typescript',
        title: 'accounts.module.ts',
        code: `import { Module } from '@nestjs/common';
import { ACCOUNTS_REPOSITORY } from './application/ports/accounts.repository';
import { PASSWORD_HASHER } from './application/ports/password-hasher';
import { RegisterAccountUseCase } from './application/use-cases/register-account.use-case';
import { BcryptPasswordHasher } from './infrastructure/bcrypt-password-hasher';
import { PrismaAccountsRepository } from './infrastructure/prisma-accounts.repository';
import { AccountsController } from './interface/accounts.controller';

@Module({
  controllers: [AccountsController],
  providers: [
    RegisterAccountUseCase,
    {
      provide: ACCOUNTS_REPOSITORY,
      useClass: PrismaAccountsRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
  ],
})
export class AccountsModule {}`,
      },
      { type: 'h2', text: 'Controllers become thin adapters' },
      {
        type: 'code',
        language: 'typescript',
        title: 'interface/accounts.controller.ts',
        code: `import { Body, Controller, Post } from '@nestjs/common';
import { RegisterAccountUseCase } from '../application/use-cases/register-account.use-case';
import { RegisterAccountDto } from './dto/register-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly registerAccount: RegisterAccountUseCase) {}

  @Post()
  register(@Body() dto: RegisterAccountDto) {
    return this.registerAccount.execute(dto);
  }
}`,
      },
      {
        type: 'warning',
        text: 'Do not create layers just to look advanced. If a module has one simple CRUD table and no business rules, a controller plus service may be enough. Clean architecture pays off when domain behavior matters.',
      },
      { type: 'h2', text: 'Testing becomes easier' },
      {
        type: 'p',
        text: 'Because the use case depends on ports, a unit test can pass fake repositories and fake hashers. The test does not need a database, HTTP server, or real password library.',
      },
      {
        type: 'keypoints',
        items: [
          'Clean architecture keeps domain and application rules independent from Nest-specific interface details.',
          'Use injection tokens when TypeScript interfaces need runtime DI bindings.',
          'Controllers, resolvers, and message handlers should adapt input and call use cases.',
        ],
      },
    ],
  },
  {
    slug: 'nest-cqrs',
    title: 'CQRS Intro',
    description:
      'Understand commands, queries, handlers, events, and when the NestJS CQRS module is worth using.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 51,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'CQRS means Command Query Responsibility Segregation. A command changes state. A query reads state. The idea is simple: separate write behavior from read behavior so each side can be designed clearly.',
      },
      {
        type: 'p',
        text: 'In NestJS, CQRS is often implemented with the @nestjs/cqrs package. It provides command buses, query buses, event buses, and handler decorators. Use it when workflows are becoming large or when events are part of the design.',
      },
      { type: 'h2', text: 'When CQRS helps' },
      {
        type: 'ul',
        items: [
          'A write operation has many business steps.',
          'Reads need a different shape than writes.',
          'You want explicit command and query classes for tracing and testing.',
          'Domain events trigger side effects such as email, audit logs, or projections.',
          'Different teams own different parts of the workflow.',
        ],
      },
      {
        type: 'warning',
        text: 'CQRS adds ceremony. For simple CRUD modules, a service method is often clearer than a command class, handler class, and bus call.',
      },
      { type: 'h2', text: 'Install and register CQRS' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install CQRS package',
        code: `npm install @nestjs/cqrs`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'orders.module.ts',
        code: `import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateOrderHandler } from './commands/create-order.handler';
import { GetOrderHandler } from './queries/get-order.handler';
import { OrderCreatedHandler } from './events/order-created.handler';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';

const commandHandlers = [CreateOrderHandler];
const queryHandlers = [GetOrderHandler];
const eventHandlers = [OrderCreatedHandler];

@Module({
  imports: [CqrsModule],
  controllers: [OrdersController],
  providers: [
    OrdersRepository,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
  ],
})
export class OrdersModule {}`,
      },
      { type: 'h2', text: 'Create a command and command handler' },
      {
        type: 'code',
        language: 'typescript',
        title: 'commands/create-order.command.ts',
        code: `export class CreateOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly productId: string,
  ) {}
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'commands/create-order.handler.ts',
        code: `import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrdersRepository } from '../orders.repository';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateOrderCommand) {
    const order = await this.ordersRepository.create({
      userId: command.userId,
      productId: command.productId,
      status: 'pending',
    });

    this.eventBus.publish(new OrderCreatedEvent(order.id, order.userId));

    return order;
  }
}`,
      },
      { type: 'h2', text: 'Create a query and query handler' },
      {
        type: 'code',
        language: 'typescript',
        title: 'queries/get-order.query.ts',
        code: `export class GetOrderQuery {
  constructor(public readonly orderId: string) {}
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'queries/get-order.handler.ts',
        code: `import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderQuery } from './get-order.query';
import { OrdersRepository } from '../orders.repository';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  execute(query: GetOrderQuery) {
    return this.ordersRepository.findById(query.orderId);
  }
}`,
      },
      { type: 'h2', text: 'Use buses from a controller' },
      {
        type: 'code',
        language: 'typescript',
        title: 'orders.controller.ts',
        code: `import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from './commands/create-order.command';
import { GetOrderQuery } from './queries/get-order.query';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body() body: { userId: string; productId: string }) {
    return this.commandBus.execute(
      new CreateOrderCommand(body.userId, body.productId),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetOrderQuery(id));
  }
}`,
      },
      { type: 'h2', text: 'Handle events for side effects' },
      {
        type: 'code',
        language: 'typescript',
        title: 'events/order-created.handler.ts',
        code: `import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderCreatedEvent } from './order-created.event';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedHandler implements IEventHandler<OrderCreatedEvent> {
  handle(event: OrderCreatedEvent) {
    console.log('Order created', {
      orderId: event.orderId,
      userId: event.userId,
    });
  }
}`,
      },
      {
        type: 'tip',
        text: 'Keep event handlers idempotent. If a handler sends an email or writes a projection, design it so retries do not create duplicate side effects.',
      },
      {
        type: 'keypoints',
        items: [
          'Commands change state; queries read state.',
          'CQRS makes workflows explicit but adds files and indirection.',
          'Use events for side effects that should happen after a successful command.',
        ],
      },
    ],
  },
  {
    slug: 'nest-events',
    title: 'Event-driven Patterns',
    description:
      'Use events inside NestJS apps and understand the difference between local events, domain events, integration events, and reliable delivery.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 52,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Event-driven design means one part of the app announces that something happened, and other parts react. This helps reduce direct coupling between modules. For example, OrdersModule can publish OrderCreated, while NotificationsModule decides how to notify the user.',
      },
      {
        type: 'p',
        text: 'Events are powerful, but they can hide behavior if overused. Use them for facts that already happened, not as a replacement for clear service calls when one module directly needs an answer.',
      },
      { type: 'h2', text: 'Event types you should know' },
      {
        type: 'table',
        headers: ['Type', 'Scope', 'Example'],
        rows: [
          ['Local application event', 'Inside one Nest process', 'user.registered handled by an email service'],
          ['Domain event', 'Represents a business fact', 'OrderPaid, SubscriptionCancelled'],
          ['Integration event', 'Shared with other systems', 'billing.invoice.created sent to Kafka'],
          ['Outbox event', 'Stored in database before publishing', 'Reliable delivery after a transaction'],
        ],
      },
      { type: 'h2', text: 'Local events with EventEmitter2' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install local event package',
        code: `npm install @nestjs/event-emitter`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'app.module.ts',
        code: `import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrdersModule } from './modules/orders/orders.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    OrdersModule,
    NotificationsModule,
  ],
})
export class AppModule {}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'orders.service.ts',
        code: `import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

type OrderCreatedPayload = {
  orderId: string;
  userId: string;
};

@Injectable()
export class OrdersService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async create(userId: string) {
    const order = {
      id: crypto.randomUUID(),
      userId,
      status: 'pending',
    };

    this.eventEmitter.emit('order.created', {
      orderId: order.id,
      userId: order.userId,
    } satisfies OrderCreatedPayload);

    return order;
  }
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'notifications.listener.ts',
        code: `import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

type OrderCreatedPayload = {
  orderId: string;
  userId: string;
};

@Injectable()
export class NotificationsListener {
  @OnEvent('order.created')
  handleOrderCreated(event: OrderCreatedPayload) {
    console.log('Send order notification', event);
  }
}`,
      },
      { type: 'h2', text: 'Use events after state is saved' },
      {
        type: 'p',
        text: 'Publish events after the important state change succeeds. If you emit OrderCreated before the order is committed, a listener might send an email for an order that never exists.',
      },
      { type: 'h2', text: 'Reliable events need an outbox' },
      {
        type: 'p',
        text: 'Local event emitters are not durable. If the process crashes after saving an order but before publishing to a broker, another service may never learn about the order. The outbox pattern fixes this by writing business data and pending events in the same database transaction.',
      },
      {
        type: 'code',
        language: 'text',
        title: 'Outbox flow',
        code: `1. Start database transaction.
2. Save the order.
3. Save an outbox row: type = order.created, payload = JSON.
4. Commit the transaction.
5. A background worker reads unsent outbox rows.
6. Worker publishes to the broker.
7. Worker marks the outbox row as sent.`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'outbox-event.type.ts',
        code: `export type OutboxEvent = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: Date;
  publishedAt: Date | null;
};`,
      },
      { type: 'h2', text: 'Subscriber rules' },
      {
        type: 'ul',
        items: [
          'Make handlers idempotent so retrying the same event is safe.',
          'Log enough context to debug event flow later.',
          'Avoid hidden ordering assumptions unless the transport guarantees ordering.',
          'Validate integration event payloads just like HTTP request bodies.',
          'Keep event names stable because other modules or services may depend on them.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Events reduce direct coupling by announcing facts that already happened.',
          'Local events are useful inside one process but are not durable.',
          'For cross-service reliability, combine database transactions with an outbox worker.',
        ],
      },
    ],
  },
  {
    slug: 'nest-microservices',
    title: 'Microservices Intro',
    description:
      'Learn the NestJS microservices model, transports, message patterns, clients, contracts, and deployment tradeoffs.',
    level: 'advanced',
    section: 'Distributed Nest',
    order: 53,
    minutes: 19,
    content: [
      {
        type: 'p',
        text: 'A microservice is an independently deployable application that owns a specific capability. NestJS can build HTTP APIs, message consumers, and RPC-style services using the same module and provider concepts.',
      },
      {
        type: 'p',
        text: 'Microservices are not automatically better than a modular monolith. They add network failures, deployment coordination, observability needs, and data consistency challenges. Choose them when independent scaling, ownership, or integration boundaries justify the cost.',
      },
      { type: 'h2', text: 'Common Nest microservice transports' },
      {
        type: 'table',
        headers: ['Transport', 'Use when', 'Notes'],
        rows: [
          ['TCP', 'Learning, simple internal RPC', 'Easy locally, not a full broker'],
          ['Redis', 'Lightweight pub/sub or request-response', 'Simple but not always durable'],
          ['RabbitMQ', 'Work queues and durable messages', 'Good for jobs and routing'],
          ['Kafka', 'High-throughput event streams', 'Great for logs and integration events'],
          ['NATS', 'Fast service messaging', 'Useful for cloud-native systems'],
          ['gRPC', 'Typed RPC between services', 'Requires protobuf contracts'],
        ],
      },
      { type: 'h2', text: 'Create a microservice entry point' },
      {
        type: 'code',
        language: 'typescript',
        title: 'main.ts for a TCP microservice',
        code: `import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3001,
    },
  });

  await app.listen();
}

bootstrap();`,
      },
      { type: 'h2', text: 'Handle messages with patterns' },
      {
        type: 'code',
        language: 'typescript',
        title: 'math.controller.ts',
        code: `import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MathController {
  @MessagePattern({ cmd: 'sum' })
  sum(@Payload() numbers: number[]) {
    return numbers.reduce((total, value) => total + value, 0);
  }
}`,
      },
      { type: 'h2', text: 'Call a microservice with ClientProxy' },
      {
        type: 'code',
        language: 'typescript',
        title: 'gateway.module.ts',
        code: `import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [GatewayController],
})
export class GatewayModule {}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'gateway.controller.ts',
        code: `import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Controller('math')
export class GatewayController {
  constructor(@Inject('MATH_SERVICE') private readonly mathClient: ClientProxy) {}

  @Post('sum')
  async sum(@Body() body: { numbers: number[] }) {
    return firstValueFrom(
      this.mathClient.send({ cmd: 'sum' }, body.numbers).pipe(timeout(2000)),
    );
  }
}`,
      },
      { type: 'h2', text: 'Message contracts matter' },
      {
        type: 'p',
        text: 'A message pattern is an API contract. Treat it with the same care as an HTTP endpoint. Document the pattern name, payload shape, response shape, error behavior, and versioning strategy.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'shared contract type',
        code: `export type SumNumbersRequest = {
  numbers: number[];
};

export type SumNumbersResponse = {
  result: number;
};`,
      },
      { type: 'h2', text: 'Distributed system essentials' },
      {
        type: 'ul',
        items: [
          'Set timeouts for every remote call.',
          'Use retries only when the operation is safe to retry.',
          'Attach correlation IDs to logs and messages.',
          'Validate incoming message payloads.',
          'Design for partial failure because another service may be down.',
          'Avoid sharing one database between independent services unless the boundary is not real.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Nest microservices reuse modules and providers but replace HTTP routes with message patterns.',
          'Transport choice affects reliability, durability, ordering, and operations.',
          'Microservices require strong contracts, timeouts, logs, and failure handling.',
        ],
      },
    ],
  },
  {
    slug: 'nest-hybrid-apps',
    title: 'Hybrid HTTP + Microservice Apps',
    description:
      'Run HTTP routes and microservice listeners in one NestJS process while keeping lifecycle, health, and boundaries clear.',
    level: 'advanced',
    section: 'Distributed Nest',
    order: 54,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'A hybrid Nest app serves HTTP traffic and listens for microservice messages from the same process. This is useful when one deployable unit needs a REST API and background message handlers.',
      },
      {
        type: 'p',
        text: 'Hybrid apps are common during migration. A team may start with one Nest app, add queue consumers or TCP handlers, and later split heavy workloads into separate services if needed.',
      },
      { type: 'h2', text: 'Create a hybrid bootstrap' },
      {
        type: 'code',
        language: 'typescript',
        title: 'main.ts',
        code: `import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3001,
    },
  });

  app.enableShutdownHooks();

  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();`,
      },
      { type: 'h2', text: 'Put HTTP and message handlers in clear modules' },
      {
        type: 'code',
        language: 'text',
        title: 'Hybrid layout',
        code: `src/modules/orders/
  orders.module.ts
  orders.service.ts
  http/
    orders.controller.ts
    dto/
  messaging/
    orders.messages.controller.ts
    contracts/
      reserve-stock.message.ts`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'messaging/orders.messages.controller.ts',
        code: `import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from '../orders.service';

@Controller()
export class OrdersMessagesController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'reserve-stock' })
  reserveStock(@Payload() payload: { orderId: string }) {
    return this.ordersService.reserveStock(payload.orderId);
  }
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'http/orders.controller.ts',
        code: `import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from '../orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() body: { userId: string; productId: string }) {
    return this.ordersService.create(body.userId, body.productId);
  }
}`,
      },
      { type: 'h2', text: 'Share services, not transport details' },
      {
        type: 'p',
        text: 'Both controllers call OrdersService. The service should not care whether the request came from HTTP or TCP. This keeps business behavior reusable and makes tests easier.',
      },
      { type: 'h2', text: 'Health checks for hybrid apps' },
      {
        type: 'p',
        text: 'An HTTP health route only proves the HTTP server is alive. In a hybrid app, also check database connectivity, broker connectivity, and whether message consumers are ready before accepting traffic.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'health.controller.ts',
        code: `import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('ready')
  ready() {
    return {
      status: 'ok',
      checks: {
        http: 'up',
        microservice: 'started',
      },
    };
  }
}`,
      },
      { type: 'h2', text: 'Production rules for hybrid apps' },
      {
        type: 'ul',
        items: [
          'Start microservices before listening for HTTP if HTTP requests depend on them.',
          'Enable shutdown hooks so Kubernetes and process managers can stop the app safely.',
          'Track separate metrics for HTTP requests and message handling.',
          'Use separate queues or consumer groups for workloads with different scaling needs.',
          'Consider splitting into separate deployables when one workload needs very different CPU, memory, or release cadence.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Hybrid apps combine HTTP and microservice listeners in one Nest process.',
          'Keep transport adapters separate but reuse service-level business logic.',
          'Health, metrics, shutdown, and scaling need special attention.',
        ],
      },
    ],
  },
  {
    slug: 'nest-websockets',
    title: 'WebSockets / Gateways',
    description:
      'Build realtime features with NestJS gateways, Socket.IO events, rooms, authentication, and scaling considerations.',
    level: 'advanced',
    section: 'Distributed Nest',
    order: 55,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'WebSockets keep a connection open so the server can push data to clients instantly. NestJS wraps WebSocket behavior in gateways, which feel similar to controllers but handle socket events instead of HTTP requests.',
      },
      {
        type: 'p',
        text: 'Use WebSockets for chat, notifications, collaboration, dashboards, multiplayer features, and live status updates. Do not use them for normal CRUD when HTTP is simpler.',
      },
      { type: 'h2', text: 'Install Socket.IO support' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install gateway dependencies',
        code: `npm install @nestjs/websockets @nestjs/platform-socket.io socket.io`,
      },
      { type: 'h2', text: 'Create a basic gateway' },
      {
        type: 'code',
        language: 'typescript',
        title: 'notifications.gateway.ts',
        code: `import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Socket connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Socket disconnected', client.id);
  }

  @SubscribeMessage('notifications.join')
  joinUserRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { userId: string },
  ) {
    client.join('user:' + body.userId);
    return { ok: true };
  }

  notifyUser(userId: string, message: string) {
    this.server.to('user:' + userId).emit('notifications.new', { message });
  }
}`,
      },
      { type: 'h2', text: 'Register the gateway in a module' },
      {
        type: 'code',
        language: 'typescript',
        title: 'notifications.module.ts',
        code: `import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}`,
      },
      { type: 'h2', text: 'Call the gateway from a service' },
      {
        type: 'code',
        language: 'typescript',
        title: 'notifications.service.ts',
        code: `import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly gateway: NotificationsGateway) {}

  sendOrderUpdate(userId: string, orderId: string) {
    this.gateway.notifyUser(userId, 'Order ' + orderId + ' was updated');
  }
}`,
      },
      { type: 'h2', text: 'Authenticate sockets during connection' },
      {
        type: 'p',
        text: 'A WebSocket connection does not automatically reuse HTTP guards. Validate a token during connection or inside a custom WebSocket guard. Store only safe user data on the socket.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Simple token check in handleConnection',
        code: `handleConnection(client: Socket) {
  const token = client.handshake.auth.token;

  if (!token || token !== 'demo-token') {
    client.disconnect(true);
    return;
  }

  client.data.user = {
    id: 'user-123',
  };
}`,
      },
      { type: 'h2', text: 'Rooms are your friend' },
      {
        type: 'ul',
        items: [
          'Use one room per user for private notifications.',
          'Use one room per team or project for collaboration.',
          'Use one room per document for live editing.',
          'Leave rooms when permissions change or when the socket disconnects.',
        ],
      },
      { type: 'h2', text: 'Scaling WebSockets' },
      {
        type: 'p',
        text: 'If one process handles all sockets, emitting to a room is simple. With multiple Node processes or multiple containers, clients are spread across instances. Use a shared adapter such as the Socket.IO Redis adapter so events can reach sockets connected to other instances.',
      },
      {
        type: 'code',
        language: 'text',
        title: 'Scaling idea',
        code: `Client A connects to instance 1.
Client B connects to instance 2.
Instance 1 emits to room project:42.
Redis adapter broadcasts the event to instance 2.
Both clients receive the event.`,
      },
      {
        type: 'keypoints',
        items: [
          'Gateways are Nest providers for realtime socket events.',
          'Use rooms to target users, teams, projects, or documents.',
          'Production WebSockets need authentication, rate limits, observability, and a multi-instance adapter.',
        ],
      },
    ],
  },
  {
    slug: 'nest-graphql-intro',
    title: 'GraphQL with Nest (Intro)',
    description:
      'Learn the NestJS GraphQL basics: code-first schemas, resolvers, object types, inputs, auth, and avoiding N+1 queries.',
    level: 'advanced',
    section: 'Distributed Nest',
    order: 56,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'GraphQL lets clients ask for exactly the fields they need through a typed schema. NestJS supports GraphQL with decorators that feel similar to controllers, DTOs, and providers.',
      },
      {
        type: 'p',
        text: 'GraphQL is useful for frontend-heavy products, mobile clients, dashboards, and APIs where clients need flexible nested data. REST is still often simpler for public resources, file uploads, webhooks, and simple CRUD.',
      },
      { type: 'h2', text: 'Install GraphQL support' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install packages',
        code: `npm install @nestjs/graphql @nestjs/apollo @apollo/server graphql`,
      },
      { type: 'h2', text: 'Register GraphQLModule' },
      {
        type: 'code',
        language: 'typescript',
        title: 'app.module.ts',
        code: `import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}`,
      },
      { type: 'h2', text: 'Define object types and inputs' },
      {
        type: 'code',
        language: 'typescript',
        title: 'user.model.ts',
        code: `import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  displayName: string;
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'create-user.input.ts',
        code: `import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(2)
  displayName: string;
}`,
      },
      { type: 'h2', text: 'Create a resolver' },
      {
        type: 'code',
        language: 'typescript',
        title: 'users.resolver.ts',
        code: `import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UserModel } from './user.model';
import { UsersService } from './users.service';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserModel])
  users() {
    return this.usersService.findAll();
  }

  @Query(() => UserModel, { nullable: true })
  user(@Args('id') id: string) {
    return this.usersService.findById(id);
  }

  @Mutation(() => UserModel)
  createUser(@Args('input') input: CreateUserInput) {
    return this.usersService.create(input);
  }
}`,
      },
      { type: 'h2', text: 'Example GraphQL operations' },
      {
        type: 'code',
        language: 'text',
        title: 'Query users',
        code: `query {
  users {
    id
    email
    displayName
  }
}`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'Create a user',
        code: `mutation {
  createUser(input: { email: "ada@example.com", displayName: "Ada" }) {
    id
    email
  }
}`,
      },
      { type: 'h2', text: 'Auth works differently in GraphQL' },
      {
        type: 'p',
        text: 'GraphQL requests usually hit one HTTP endpoint. Guards can still be used, but you often need to read the request from the GraphQL execution context instead of the normal HTTP context.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'GraphQL guard context idea',
        code: `import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req;
  }
}`,
      },
      { type: 'h2', text: 'Avoid N+1 queries' },
      {
        type: 'p',
        text: 'Nested GraphQL fields can accidentally run one database query per parent row. Use batching tools such as DataLoader or service methods that fetch related data in groups.',
      },
      {
        type: 'tip',
        text: 'Start simple: build the schema, resolver, and service first. Add batching when you introduce nested fields that load related records.',
      },
      {
        type: 'keypoints',
        items: [
          'Nest GraphQL can generate schemas from TypeScript decorators.',
          'Resolvers are the GraphQL equivalent of controllers.',
          'Production GraphQL needs auth context, validation, query limits, and N+1 protection.',
        ],
      },
    ],
  },
  {
    slug: 'nest-performance',
    title: 'Performance & Scalability Mindset',
    description:
      'Build a practical performance mindset for NestJS apps: measure first, optimize bottlenecks, and scale safely.',
    level: 'advanced',
    section: 'Production',
    order: 57,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Performance work starts with evidence. A slow NestJS app might be slow because of database queries, missing indexes, large JSON responses, synchronous CPU work, chatty microservice calls, or memory leaks. Guessing wastes time.',
      },
      {
        type: 'p',
        text: 'The goal is not to make every line clever. The goal is to keep response times predictable under real traffic while preserving code that the team can maintain.',
      },
      { type: 'h2', text: 'Measure before changing code' },
      {
        type: 'ul',
        items: [
          'Track p50, p95, and p99 latency, not only average latency.',
          'Log slow requests with route, user, query time, and correlation ID.',
          'Measure database query count and duration.',
          'Run load tests against realistic endpoints.',
          'Watch memory and event loop delay during tests.',
        ],
      },
      { type: 'h2', text: 'Fastify adapter can help HTTP throughput' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install Fastify adapter',
        code: `npm install @nestjs/platform-fastify`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'main.ts with Fastify',
        code: `import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.listen(3000, '0.0.0.0');
}

bootstrap();`,
      },
      {
        type: 'note',
        text: 'Do not switch adapters blindly. Test your middleware, file uploads, platform-specific code, and error handling before changing an existing production app.',
      },
      { type: 'h2', text: 'Use validation carefully' },
      {
        type: 'p',
        text: 'Global validation is important, but transformation and deep validation have cost. Keep DTOs focused, avoid accepting huge unbounded payloads, and set body size limits at the platform or proxy layer.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Balanced ValidationPipe',
        code: `import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);`,
      },
      { type: 'h2', text: 'Database wins are often biggest' },
      {
        type: 'ul',
        items: [
          'Add indexes for common filters and joins.',
          'Paginate list endpoints.',
          'Select only fields you need.',
          'Avoid N+1 queries in REST, GraphQL, and message handlers.',
          'Use transactions for correctness, not as a default wrapper around every operation.',
          'Cache stable reads when database load is the bottleneck.',
        ],
      },
      { type: 'h2', text: 'Move slow work out of requests' },
      {
        type: 'p',
        text: 'Email sending, image processing, PDF generation, exports, webhook retries, and heavy reports should usually run in queues. The HTTP request can enqueue work and return a job ID.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Queue-shaped controller idea',
        code: `@Post('exports')
async requestExport(@Body() body: { userId: string }) {
  const job = await this.exportsQueue.add('create-export', {
    userId: body.userId,
  });

  return {
    jobId: job.id,
    status: 'queued',
  };
}`,
      },
      { type: 'h2', text: 'Scale horizontally when the app is stateless' },
      {
        type: 'p',
        text: 'Multiple containers can serve traffic when user session state, uploads, scheduled work, and WebSocket presence are not stored only in process memory. Move shared state to databases, caches, object storage, queues, or socket adapters.',
      },
      {
        type: 'keypoints',
        items: [
          'Measure latency, database time, memory, and event loop behavior before optimizing.',
          'Database design and background jobs often matter more than micro-optimizing Nest code.',
          'Horizontal scaling works best when application instances are stateless.',
        ],
      },
    ],
  },
  {
    slug: 'nest-security',
    title: 'Nest Security Essentials',
    description:
      'Harden a NestJS app with validation, authentication, authorization, secure headers, rate limits, password handling, and secret management.',
    level: 'advanced',
    section: 'Production',
    order: 58,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Security is not one feature. It is a set of habits applied at every boundary: HTTP input, authentication, authorization, database access, logs, configuration, dependencies, and deployment.',
      },
      {
        type: 'p',
        text: 'Nest gives you strong tools for guards, pipes, interceptors, and modules. Use them consistently so security behavior is visible and repeatable.',
      },
      { type: 'h2', text: 'Validate and strip unknown input' },
      {
        type: 'code',
        language: 'typescript',
        title: 'main.ts validation',
        code: `import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'create-user.dto.ts',
        code: `import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}`,
      },
      { type: 'h2', text: 'Set secure headers and CORS intentionally' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install helmet',
        code: `npm install helmet`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'main.ts security basics',
        code: `import helmet from 'helmet';

app.use(helmet());
app.enableCors({
  origin: ['https://app.example.com'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
});`,
      },
      {
        type: 'warning',
        text: 'Do not use origin: true or wildcard CORS with credentials in production unless you understand the risk. CORS is a browser boundary, not a full authorization system.',
      },
      { type: 'h2', text: 'Add rate limiting' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install throttler',
        code: `npm install @nestjs/throttler`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'app.module.ts',
        code: `import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}`,
      },
      { type: 'h2', text: 'Hash passwords correctly' },
      {
        type: 'ul',
        items: [
          'Never store plain-text passwords.',
          'Use a password hashing algorithm such as argon2 or bcrypt.',
          'Use unique salts, which modern password libraries handle for you.',
          'Never log passwords, reset tokens, or JWTs.',
          'Require password length and protect login routes with rate limits.',
        ],
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'password.service.ts',
        code: `import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  hash(password: string) {
    return argon2.hash(password);
  }

  verify(hash: string, password: string) {
    return argon2.verify(hash, password);
  }
}`,
      },
      { type: 'h2', text: 'Use guards for authorization' },
      {
        type: 'code',
        language: 'typescript',
        title: 'roles.guard.ts',
        code: `import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}`,
      },
      { type: 'h2', text: 'Production security checklist' },
      {
        type: 'ul',
        items: [
          'Read secrets from a secret manager or environment, never from committed files.',
          'Rotate JWT secrets and API keys when leaked.',
          'Use HTTPS at the edge and secure cookies when cookies carry auth state.',
          'Sanitize logs so secrets and personal data are not printed.',
          'Keep dependencies updated and scan images.',
          'Use least-privilege database users and cloud credentials.',
          'Return safe error messages to clients and detailed errors only to logs.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Validation, guards, headers, CORS, rate limits, and safe secrets are baseline production security.',
          'Authentication proves identity; authorization decides what that identity may do.',
          'Security belongs at every boundary, not only in an auth module.',
        ],
      },
    ],
  },
  {
    slug: 'nest-docker',
    title: 'Dockerizing NestJS',
    description:
      'Package a NestJS application for production with a multi-stage Dockerfile, .dockerignore, environment variables, and Docker Compose.',
    level: 'advanced',
    section: 'Production',
    order: 59,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Docker packages your NestJS app with the Node runtime and dependencies it needs. A good production image is repeatable, small enough, runs as a non-root user, and starts the compiled JavaScript output.',
      },
      {
        type: 'p',
        text: 'The most common mistake is copying a development setup into production: source TypeScript, dev dependencies, node_modules from the host machine, and no clear environment configuration.',
      },
      { type: 'h2', text: 'Add a .dockerignore file' },
      {
        type: 'code',
        language: 'text',
        title: '.dockerignore',
        code: `node_modules
dist
coverage
.git
.env
npm-debug.log
Dockerfile
docker-compose.yml`,
      },
      { type: 'h2', text: 'Use a multi-stage Dockerfile' },
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
RUN npm prune --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nestjs && adduser -S nestjs -G nestjs

COPY --from=build --chown=nestjs:nestjs /app/dist ./dist
COPY --from=build --chown=nestjs:nestjs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nestjs /app/package*.json ./

USER nestjs
EXPOSE 3000
CMD ["node", "dist/main.js"]`,
      },
      { type: 'h2', text: 'Build and run the image' },
      {
        type: 'code',
        language: 'bash',
        title: 'Docker commands',
        code: `docker build -t nest-api .
docker run --rm -p 3000:3000 --env NODE_ENV=production nest-api`,
      },
      { type: 'h2', text: 'Read configuration from environment variables' },
      {
        type: 'code',
        language: 'typescript',
        title: 'main.ts reads PORT',
        code: `const port = Number(process.env.PORT ?? 3000);
await app.listen(port, '0.0.0.0');`,
      },
      {
        type: 'warning',
        text: 'Do not bake secrets into Docker images. Pass secrets at runtime through your platform, secret manager, or environment configuration.',
      },
      { type: 'h2', text: 'Use Docker Compose for local dependencies' },
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
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgres://postgres:postgres@postgres:5432/nest_app
    depends_on:
      - postgres

  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: nest_app
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:`,
      },
      { type: 'h2', text: 'Container production checklist' },
      {
        type: 'ul',
        items: [
          'Compile TypeScript during build, not at container startup.',
          'Install only production dependencies in the final image.',
          'Run as a non-root user.',
          'Listen on 0.0.0.0 inside containers.',
          'Expose health endpoints for orchestration.',
          'Use environment variables for runtime configuration.',
          'Pin major runtime versions and rebuild images when security fixes ship.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'A production Docker image should run compiled JavaScript with production dependencies.',
          '.dockerignore keeps images smaller and avoids copying secrets.',
          'Compose is helpful for local infrastructure, while production platforms should manage secrets and health checks.',
        ],
      },
    ],
  },
  {
    slug: 'nest-observability',
    title: 'Health Checks, Metrics & Tracing Mindset',
    description:
      'Understand production observability for NestJS: health checks, structured logs, metrics, traces, dashboards, and alerts.',
    level: 'advanced',
    section: 'Production',
    order: 60,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Observability helps you understand what your app is doing in production. It answers questions such as: is the app healthy, why is this request slow, which dependency is failing, and how many users are affected?',
      },
      {
        type: 'p',
        text: 'Three common pillars are logs, metrics, and traces. Health checks tell platforms whether to route traffic to the app. Alerts tell humans when action is needed.',
      },
      { type: 'h2', text: 'Add health checks with Terminus' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install health checks',
        code: `npm install @nestjs/terminus`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'health.controller.ts',
        code: `import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Get('live')
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.http.pingCheck('docs', 'https://docs.nestjs.com'),
    ]);
  }
}`,
      },
      {
        type: 'p',
        text: 'Liveness asks whether the process should be restarted. Readiness asks whether the instance should receive traffic. Keep liveness simple so a temporary database outage does not restart every pod at once.',
      },
      { type: 'h2', text: 'Use structured logs' },
      {
        type: 'p',
        text: 'Structured logs are machine-readable records. They should include time, level, message, route, request ID, user ID when safe, and error details. Avoid dumping entire request bodies.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'request-id.middleware.ts',
        code: `import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    req.requestId = req.headers['x-request-id'] ?? randomUUID();
    res.setHeader('x-request-id', req.requestId);
    next();
  }
}`,
      },
      { type: 'h2', text: 'Track useful metrics' },
      {
        type: 'table',
        headers: ['Metric', 'Why it matters'],
        rows: [
          ['HTTP request count', 'Shows traffic volume by route and status'],
          ['HTTP latency histogram', 'Shows p95 and p99 response time'],
          ['Error count', 'Shows failures by route or dependency'],
          ['Database query duration', 'Finds slow persistence calls'],
          ['Queue depth', 'Shows background work backlog'],
          ['Event loop delay', 'Shows CPU blocking in Node'],
        ],
      },
      {
        type: 'code',
        language: 'text',
        title: 'Prometheus-style metric names',
        code: `http_requests_total
http_request_duration_seconds
database_query_duration_seconds
queue_jobs_waiting
nodejs_eventloop_lag_seconds`,
      },
      { type: 'h2', text: 'Use traces for request journeys' },
      {
        type: 'p',
        text: 'Tracing connects work across services. A trace can show one user request through API gateway, auth service, orders service, database, and queue publisher. OpenTelemetry is the common standard for traces.',
      },
      {
        type: 'code',
        language: 'text',
        title: 'Trace shape',
        code: `Trace: POST /orders
  Span: AuthGuard.validateToken
  Span: OrdersController.create
  Span: OrdersService.createOrder
  Span: PostgreSQL INSERT orders
  Span: RabbitMQ publish order.created`,
      },
      { type: 'h2', text: 'Alert on symptoms first' },
      {
        type: 'ul',
        items: [
          'High error rate for user-facing routes.',
          'High p95 or p99 latency.',
          'Readiness failures across many instances.',
          'Queue backlog growing for too long.',
          'Database connection pool exhaustion.',
          'Disk, memory, or CPU near limits.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Health checks, logs, metrics, and traces answer different production questions.',
          'Readiness should include dependencies needed to serve traffic; liveness should stay simple.',
          'Good observability starts with consistent request IDs, structured logs, and latency metrics.',
        ],
      },
    ],
  },
  {
    slug: 'nest-project-api',
    title: 'Mini Project: Production-style REST API',
    description:
      'Build a small but production-minded Tasks REST API with modules, DTOs, validation, service boundaries, and a clear folder structure.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 61,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project builds a production-style REST API shell for tasks. It uses a feature module, DTOs, validation, controller routes, a service layer, and a simple in-memory repository so you can focus on structure before adding a real database.',
      },
      {
        type: 'p',
        text: 'The code is intentionally small, but the shape matches real NestJS applications: HTTP details live in controllers and DTOs, business behavior lives in services, and persistence can be replaced later.',
      },
      { type: 'h2', text: 'Step 1: Create the project and dependencies' },
      {
        type: 'code',
        language: 'bash',
        title: 'Create a Nest project',
        code: `npm install -g @nestjs/cli
nest new production-rest-api
cd production-rest-api
npm install class-validator class-transformer`,
      },
      { type: 'h2', text: 'Step 2: Create the folder structure' },
      {
        type: 'code',
        language: 'text',
        title: 'Project structure',
        code: `src/
  main.ts
  app.module.ts
  common/
    filters/
      http-exception.filter.ts
  modules/
    tasks/
      dto/
        create-task.dto.ts
        update-task.dto.ts
      entities/
        task.entity.ts
      tasks.controller.ts
      tasks.module.ts
      tasks.repository.ts
      tasks.service.ts`,
      },
      { type: 'h2', text: 'Step 3: Enable global validation and API prefix' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/main.ts',
        code: `import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
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
      { type: 'h2', text: 'Step 4: Define the task entity' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/tasks/entities/task.entity.ts',
        code: `export type TaskStatus = 'todo' | 'in_progress' | 'done';

export class Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}`,
      },
      { type: 'h2', text: 'Step 5: Create DTOs' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/tasks/dto/create-task.dto.ts',
        code: `import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/tasks/dto/update-task.dto.ts',
        code: `import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsIn(['todo', 'in_progress', 'done'])
  status?: TaskStatus;
}`,
      },
      { type: 'h2', text: 'Step 6: Add a repository boundary' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/tasks/tasks.repository.ts',
        code: `import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksRepository {
  private readonly tasks = new Map<string, Task>();

  findAll() {
    return [...this.tasks.values()];
  }

  findById(id: string) {
    return this.tasks.get(id) ?? null;
  }

  save(task: Task) {
    this.tasks.set(task.id, task);
    return task;
  }

  delete(id: string) {
    return this.tasks.delete(id);
  }
}`,
      },
      { type: 'h2', text: 'Step 7: Add business behavior in the service' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/tasks/tasks.service.ts',
        code: `import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  findAll() {
    return this.tasksRepository.findAll();
  }

  findOne(id: string) {
    const task = this.tasksRepository.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  create(dto: CreateTaskDto) {
    const now = new Date();
    const task: Task = {
      id: crypto.randomUUID(),
      title: dto.title,
      description: dto.description,
      status: 'todo',
      createdAt: now,
      updatedAt: now,
    };

    return this.tasksRepository.save(task);
  }

  update(id: string, dto: UpdateTaskDto) {
    const task = this.findOne(id);

    const updated: Task = {
      ...task,
      ...dto,
      updatedAt: new Date(),
    };

    return this.tasksRepository.save(updated);
  }

  remove(id: string) {
    this.findOne(id);
    this.tasksRepository.delete(id);
  }
}`,
      },
      { type: 'h2', text: 'Step 8: Create REST routes' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/tasks/tasks.controller.ts',
        code: `import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
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
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    this.tasksService.remove(id);
  }
}`,
      },
      { type: 'h2', text: 'Step 9: Wire the module' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/tasks/tasks.module.ts',
        code: `import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
})
export class TasksModule {}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/app.module.ts',
        code: `import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [TasksModule],
})
export class AppModule {}`,
      },
      { type: 'h2', text: 'Step 10: Try the API' },
      {
        type: 'code',
        language: 'bash',
        title: 'Run and test',
        code: `npm run start:dev
curl -X POST http://localhost:3000/api/v1/tasks \\
  -H "content-type: application/json" \\
  -d '{"title":"Ship tutorial","description":"Finish the advanced NestJS project"}'
curl http://localhost:3000/api/v1/tasks`,
      },
      {
        type: 'tip',
        text: 'Next production upgrades: replace the in-memory repository with Prisma or TypeORM, add pagination, add OpenAPI docs, add tests, add request logging, and add Docker.',
      },
      {
        type: 'keypoints',
        items: [
          'A production-style REST module separates DTOs, controller routes, service behavior, and persistence.',
          'Global validation protects the API boundary.',
          'A repository boundary makes it easier to replace in-memory storage with a real database later.',
        ],
      },
    ],
  },
  {
    slug: 'nest-project-auth',
    title: 'Mini Project: Auth Module (JWT + roles)',
    description:
      'Build a focused NestJS auth module with password hashing, JWT login, current user decorators, and role-based guards.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 62,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project builds a practical authentication shell. It uses in-memory users so the auth flow is easy to follow, but the module boundaries match a real app that could later use PostgreSQL, MongoDB, Prisma, or TypeORM.',
      },
      {
        type: 'p',
        text: 'The module supports registration, login, JWT validation, a current user decorator, and role checks. This is a foundation, not a complete identity platform.',
      },
      { type: 'h2', text: 'Step 1: Install packages' },
      {
        type: 'code',
        language: 'bash',
        title: 'Auth dependencies',
        code: `npm install @nestjs/jwt @nestjs/passport passport passport-jwt argon2
npm install -D @types/passport-jwt`,
      },
      { type: 'h2', text: 'Step 2: Create the folder structure' },
      {
        type: 'code',
        language: 'text',
        title: 'Auth module structure',
        code: `src/modules/auth/
  decorators/
    current-user.decorator.ts
    roles.decorator.ts
  dto/
    login.dto.ts
    register.dto.ts
  guards/
    jwt-auth.guard.ts
    roles.guard.ts
  strategies/
    jwt.strategy.ts
  auth.controller.ts
  auth.module.ts
  auth.service.ts
src/modules/users/
  user.entity.ts
  users.module.ts
  users.service.ts`,
      },
      { type: 'h2', text: 'Step 3: Create a user model and users service' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/users/user.entity.ts',
        code: `export type UserRole = 'user' | 'admin';

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  roles: UserRole[];
};`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/users/users.service.ts',
        code: `import { Injectable } from '@nestjs/common';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users = new Map<string, User>();

  findByEmail(email: string) {
    return [...this.users.values()].find((user) => user.email === email) ?? null;
  }

  findById(id: string) {
    return this.users.get(id) ?? null;
  }

  create(email: string, passwordHash: string, roles: UserRole[] = ['user']) {
    const user: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash,
      roles,
    };

    this.users.set(user.id, user);
    return user;
  }
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/users/users.module.ts',
        code: `import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}`,
      },
      { type: 'h2', text: 'Step 4: Create auth DTOs' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/dto/register.dto.ts',
        code: `import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/dto/login.dto.ts',
        code: `import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}`,
      },
      { type: 'h2', text: 'Step 5: Build AuthService' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/auth.service.ts',
        code: `import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = this.usersService.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await argon2.hash(dto.password);
    const user = this.usersService.create(dto.email, passwordHash);

    return this.signToken(user.id, user.email, user.roles);
  }

  async login(dto: LoginDto) {
    const user = this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user.id, user.email, user.roles);
  }

  private signToken(userId: string, email: string, roles: string[]) {
    const accessToken = this.jwtService.sign({
      sub: userId,
      email,
      roles,
    });

    return { accessToken };
  }
}`,
      },
      { type: 'h2', text: 'Step 6: Add JWT strategy and guard' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/strategies/jwt.strategy.ts',
        code: `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'dev-secret',
    });
  }

  validate(payload: { sub: string }) {
    const user = this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
  }
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/guards/jwt-auth.guard.ts',
        code: `import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}`,
      },
      { type: 'h2', text: 'Step 7: Add roles decorators and guard' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/decorators/roles.decorator.ts',
        code: `import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/guards/roles.guard.ts',
        code: `import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/decorators/current-user.decorator.ts',
        code: `import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);`,
      },
      { type: 'h2', text: 'Step 8: Create controller and module' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/auth.controller.ts',
        code: `import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: unknown) {
    return user;
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  adminOnly() {
    return { ok: true };
  }
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/auth/auth.module.ts',
        code: `import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}`,
      },
      { type: 'h2', text: 'Step 9: Try registration and me route' },
      {
        type: 'code',
        language: 'bash',
        title: 'Manual test',
        code: `curl -X POST http://localhost:3000/auth/register \\
  -H "content-type: application/json" \\
  -d '{"email":"ada@example.com","password":"supersecret"}'

curl http://localhost:3000/auth/me \\
  -H "authorization: Bearer YOUR_TOKEN_HERE"`,
      },
      {
        type: 'warning',
        text: 'Production auth needs refresh tokens, token rotation, email verification, password reset, audit logs, brute-force protection, and real persistence. Keep JWT secrets out of source code.',
      },
      {
        type: 'keypoints',
        items: [
          'AuthModule should own login, registration, strategies, and guards.',
          'JWT validation belongs in a strategy; route protection belongs in guards.',
          'Roles are authorization, not authentication.',
        ],
      },
    ],
  },
  {
    slug: 'nest-project-realtime',
    title: 'Mini Project: Realtime Notifications Shell',
    description:
      'Build a realtime notifications foundation with an HTTP endpoint, a service, a WebSocket gateway, rooms, and a simple browser client.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 63,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project builds a realtime notifications shell. An HTTP endpoint creates a notification, the service stores it, and the gateway pushes it to the connected user room.',
      },
      {
        type: 'p',
        text: 'The project is intentionally a shell so you can adapt it to order updates, chat messages, admin alerts, deployment status, or collaborative documents.',
      },
      { type: 'h2', text: 'Step 1: Install WebSocket dependencies' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install packages',
        code: `npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
npm install -D @types/node`,
      },
      { type: 'h2', text: 'Step 2: Create the folder structure' },
      {
        type: 'code',
        language: 'text',
        title: 'Notifications structure',
        code: `src/modules/notifications/
  dto/
    create-notification.dto.ts
  notification.entity.ts
  notifications.controller.ts
  notifications.gateway.ts
  notifications.module.ts
  notifications.service.ts
public/
  notifications-client.html`,
      },
      { type: 'h2', text: 'Step 3: Define the notification model and DTO' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/notifications/notification.entity.ts',
        code: `export type Notification = {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
};`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/notifications/dto/create-notification.dto.ts',
        code: `import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(240)
  message: string;
}`,
      },
      { type: 'h2', text: 'Step 4: Build the gateway' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/notifications/notifications.gateway.ts',
        code: `import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification } from './notification.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('notifications.join')
  join(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { userId: string },
  ) {
    client.join(this.userRoom(body.userId));
    return { joined: body.userId };
  }

  sendToUser(userId: string, notification: Notification) {
    this.server
      .to(this.userRoom(userId))
      .emit('notifications.created', notification);
  }

  private userRoom(userId: string) {
    return 'user:' + userId;
  }
}`,
      },
      {
        type: 'warning',
        text: 'The wildcard CORS setting is for local learning only. In production, restrict origins and authenticate socket connections before joining user rooms.',
      },
      { type: 'h2', text: 'Step 5: Create the service' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/notifications/notifications.service.ts',
        code: `import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './notification.entity';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly notifications = new Map<string, Notification[]>();

  constructor(private readonly gateway: NotificationsGateway) {}

  create(dto: CreateNotificationDto) {
    const notification: Notification = {
      id: crypto.randomUUID(),
      userId: dto.userId,
      message: dto.message,
      read: false,
      createdAt: new Date(),
    };

    const current = this.notifications.get(dto.userId) ?? [];
    this.notifications.set(dto.userId, [notification, ...current]);

    this.gateway.sendToUser(dto.userId, notification);

    return notification;
  }

  findForUser(userId: string) {
    return this.notifications.get(userId) ?? [];
  }
}`,
      },
      { type: 'h2', text: 'Step 6: Add HTTP routes' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/notifications/notifications.controller.ts',
        code: `import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Get('users/:userId')
  findForUser(@Param('userId') userId: string) {
    return this.notificationsService.findForUser(userId);
  }
}`,
      },
      { type: 'h2', text: 'Step 7: Wire the module' },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/modules/notifications/notifications.module.ts',
        code: `import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsGateway, NotificationsService],
})
export class NotificationsModule {}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'src/app.module.ts',
        code: `import { Module } from '@nestjs/common';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
})
export class AppModule {}`,
      },
      { type: 'h2', text: 'Step 8: Add a tiny browser client' },
      {
        type: 'code',
        language: 'text',
        title: 'public/notifications-client.html',
        code: `<!doctype html>
<html>
  <body>
    <h1>Notifications</h1>
    <ul id="messages"></ul>

    <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
    <script>
      const userId = 'user-123';
      const socket = io('http://localhost:3000');
      const messages = document.getElementById('messages');

      socket.emit('notifications.join', { userId });

      socket.on('notifications.created', (notification) => {
        const item = document.createElement('li');
        item.textContent = notification.message;
        messages.prepend(item);
      });
    </script>
  </body>
</html>`,
      },
      { type: 'h2', text: 'Step 9: Send a notification' },
      {
        type: 'code',
        language: 'bash',
        title: 'Manual test',
        code: `npm run start:dev
curl -X POST http://localhost:3000/notifications \\
  -H "content-type: application/json" \\
  -d '{"userId":"user-123","message":"Your report is ready"}'`,
      },
      { type: 'h2', text: 'Production upgrades' },
      {
        type: 'ul',
        items: [
          'Authenticate sockets with JWT or secure cookies.',
          'Check permissions before joining user, team, or project rooms.',
          'Store notifications in a database.',
          'Use a Redis adapter when running multiple app instances.',
          'Add delivery status and read receipts only if the product needs them.',
          'Rate limit noisy event sources.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Realtime features usually combine HTTP writes, service behavior, and gateway pushes.',
          'Rooms let you target a user or group of users.',
          'Production realtime systems need authentication, persistence, and multi-instance broadcasting.',
        ],
      },
    ],
  },
  {
    slug: 'nest-common-mistakes',
    title: 'Common NestJS Mistakes (and Fixes)',
    description:
      'Review common mistakes in advanced NestJS applications and learn practical fixes that improve maintainability and production safety.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 64,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Most NestJS mistakes are not syntax problems. They are boundary problems: too much logic in controllers, hidden dependencies, global modules everywhere, missing validation, or production assumptions that work only on one laptop.',
      },
      { type: 'h2', text: 'Mistake 1: Controllers doing everything' },
      {
        type: 'p',
        text: 'Controllers should adapt transport input to application behavior. If a controller validates permissions, builds queries, sends emails, starts transactions, and formats every response by hand, it becomes hard to test and reuse.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Better controller shape',
        code: `@Post()
create(@Body() dto: CreateOrderDto, @CurrentUser() user: CurrentUserDto) {
  return this.ordersService.create(user.id, dto);
}`,
      },
      { type: 'h2', text: 'Mistake 2: Missing global validation' },
      {
        type: 'p',
        text: 'DTO decorators do nothing unless validation is enabled. Without validation, clients can send unexpected fields and wrong types into your services.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Enable validation',
        code: `app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);`,
      },
      { type: 'h2', text: 'Mistake 3: Making every module global' },
      {
        type: 'p',
        text: 'Global modules are convenient, but too many global providers make dependencies invisible. Prefer explicit imports. Reserve global modules for true infrastructure such as configuration.',
      },
      { type: 'h2', text: 'Mistake 4: Circular dependencies' },
      {
        type: 'p',
        text: 'forwardRef can solve some wiring problems, but it should not be the first design choice. If UsersService and OrdersService both need each other, consider extracting a smaller service or publishing an event.',
      },
      {
        type: 'table',
        headers: ['Problem', 'Common symptom', 'Better fix'],
        rows: [
          ['Controller owns business rules', 'Large controller methods', 'Move workflow to a service or use case'],
          ['No validation pipe', 'DTOs do not reject bad input', 'Enable global ValidationPipe'],
          ['Too many global modules', 'Imports do not show dependencies', 'Use explicit module imports'],
          ['Circular services', 'forwardRef everywhere', 'Extract shared behavior or publish events'],
          ['No timeouts for remote calls', 'Requests hang under dependency failure', 'Use timeouts and retries carefully'],
          ['In-memory state in production', 'State disappears or differs per instance', 'Use external stores for shared state'],
        ],
      },
      { type: 'h2', text: 'Mistake 5: Ignoring runtime configuration' },
      {
        type: 'p',
        text: 'Reading process.env across many files makes configuration hard to validate. Use ConfigModule, validate required values at startup, and fail fast when configuration is invalid.',
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'ConfigModule example',
        code: `ConfigModule.forRoot({
  isGlobal: true,
  validationOptions: {
    abortEarly: false,
  },
});`,
      },
      { type: 'h2', text: 'Mistake 6: Treating microservices like local function calls' },
      {
        type: 'p',
        text: 'Network calls fail. They time out, retry, duplicate, and return partial data. Every microservice call needs a contract, timeout, logging, and clear error behavior.',
      },
      { type: 'h2', text: 'Mistake 7: Testing only the happy path' },
      {
        type: 'ul',
        items: [
          'Test validation failure for DTOs.',
          'Test authorization denial for protected routes.',
          'Test not-found behavior.',
          'Test service behavior with fake repositories.',
          'Test important integration flows with a real Nest testing module.',
        ],
      },
      { type: 'h2', text: 'Mistake 8: Logging secrets or noisy objects' },
      {
        type: 'p',
        text: 'Logs are production data. Never log passwords, JWTs, reset tokens, complete authorization headers, or sensitive personal data. Log identifiers and context instead.',
      },
      {
        type: 'keypoints',
        items: [
          'Most NestJS mistakes come from unclear boundaries and invisible dependencies.',
          'Validation, explicit modules, service-level logic, and safe configuration prevent many production bugs.',
          'Distributed features need timeouts, idempotency, and observability from the beginning.',
        ],
      },
    ],
  },
  {
    slug: 'nest-next-steps',
    title: 'Ecosystem & What to Learn After NestJS',
    description:
      'Plan your next learning path after advanced NestJS: databases, testing, queues, GraphQL, DevOps, observability, and system design.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 65,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'After learning advanced NestJS, the next step is not memorizing more decorators. The next step is becoming stronger at the systems NestJS connects: databases, queues, auth, observability, deployment, and architecture tradeoffs.',
      },
      { type: 'h2', text: 'Core ecosystem map' },
      {
        type: 'table',
        headers: ['Area', 'What to learn', 'Common tools'],
        rows: [
          ['Databases', 'Schema design, indexes, migrations, transactions', 'Prisma, TypeORM, PostgreSQL, MongoDB'],
          ['Authentication', 'JWT, sessions, OAuth, refresh tokens, RBAC', 'Passport, @nestjs/jwt, OAuth providers'],
          ['API docs', 'OpenAPI contracts and client communication', '@nestjs/swagger'],
          ['Queues', 'Background jobs, retries, delayed work', 'BullMQ, Redis, RabbitMQ'],
          ['Events', 'Outbox, idempotency, consumers', 'Kafka, RabbitMQ, NATS'],
          ['GraphQL', 'Resolvers, schema design, N+1 batching', '@nestjs/graphql, DataLoader'],
          ['Testing', 'Unit, integration, e2e, test containers', 'Jest, Supertest, Testcontainers'],
          ['Deployment', 'Images, health checks, scaling', 'Docker, Kubernetes, serverless platforms'],
          ['Observability', 'Logs, metrics, traces, alerts', 'OpenTelemetry, Prometheus, Grafana'],
        ],
      },
      { type: 'h2', text: 'Recommended learning path' },
      {
        type: 'ol',
        items: [
          'Build one complete REST API with authentication, database persistence, validation, docs, tests, and Docker.',
          'Add background jobs for email, exports, or webhook retries.',
          'Add observability: request IDs, structured logs, metrics, health checks, and basic tracing.',
          'Build one realtime feature with a gateway and a Redis adapter.',
          'Build one event-driven flow with an outbox table and a worker.',
          'Only then split a module into a separate microservice so you can feel the tradeoffs.',
        ],
      },
      { type: 'h2', text: 'Projects that prove advanced skill' },
      {
        type: 'ul',
        items: [
          'A multi-tenant SaaS API with roles and audit logs.',
          'An order system with payments, inventory reservation, and outbox events.',
          'A realtime collaboration board with rooms and permissions.',
          'A reporting system with queued exports and progress notifications.',
          'A GraphQL dashboard API with DataLoader and authorization.',
          'A production template with Docker, health checks, Swagger, tests, and CI.',
        ],
      },
      { type: 'h2', text: 'Read production code critically' },
      {
        type: 'p',
        text: 'When you read a NestJS codebase, ask: where are the module boundaries, how is input validated, where are transactions handled, how are permissions enforced, how are failures logged, and how would this behave with two app instances?',
      },
      { type: 'h2', text: 'The senior NestJS mindset' },
      {
        type: 'ul',
        items: [
          'Prefer boring, explicit modules over clever hidden wiring.',
          'Keep business behavior testable without HTTP.',
          'Treat external calls as unreliable.',
          'Design data ownership before splitting services.',
          'Add observability before the first major incident.',
          'Use framework features to clarify intent, not to show off.',
        ],
      },
      {
        type: 'tip',
        text: 'A strong NestJS developer is also a strong backend developer. Keep practicing TypeScript, SQL, security, testing, Linux basics, networking, and cloud deployment.',
      },
      {
        type: 'keypoints',
        items: [
          'Advanced NestJS skill is mostly architecture, production thinking, and system integration.',
          'Build complete projects that include auth, data, tests, jobs, realtime, and deployment.',
          'Learn the ecosystem in the order your product needs it.',
        ],
      },
    ],
  },
];
