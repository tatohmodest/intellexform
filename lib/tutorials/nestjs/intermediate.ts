import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'nest-guards',
    title: 'Guards',
    description:
      'Use NestJS guards to decide whether a request can reach a route handler, with authentication and authorization examples.',
    level: 'intermediate',
    section: 'Request Pipeline',
    order: 26,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Guards run after middleware and before interceptors, pipes, and the route handler. Their job is to answer one question: may this request continue?',
      },
      {
        type: 'p',
        text: 'A guard implements CanActivate and returns true, false, a Promise<boolean>, or an Observable<boolean>. Returning false causes Nest to throw ForbiddenException by default.',
      },
      { type: 'h2', text: 'Create a guard' },
      {
        type: 'code',
        language: 'typescript',
        title: 'API key guard',
        code: `import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.header('x-api-key');
    const expectedKey = this.config.get<string>('INTERNAL_API_KEY');

    if (!expectedKey || apiKey !== expectedKey) {
      throw new UnauthorizedException('Valid API key required');
    }

    return true;
  }
}`,
      },
      {
        type: 'p',
        text: 'This guard reads the request, checks a value from environment-backed configuration, and throws a specific exception when access is denied.',
      },
      { type: 'h2', text: 'Apply a guard' },
      {
        type: 'code',
        language: 'typescript',
        title: 'UseGuards on a controller method',
        code: `import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';

@Controller('reports')
export class ReportsController {
  @Get('internal')
  @UseGuards(ApiKeyGuard)
  findInternalReports() {
    return [{ id: 1, name: 'Daily revenue' }];
  }
}`,
      },
      {
        type: 'table',
        headers: ['Scope', 'How to apply', 'When to use'],
        rows: [
          ['Method', '@UseGuards(AuthGuard)', 'Only one route needs protection'],
          ['Controller', '@UseGuards(AuthGuard)', 'Every route in a controller shares a rule'],
          ['Global', 'app.useGlobalGuards(...)', 'A policy should run across the app'],
        ],
      },
      {
        type: 'note',
        text: 'Guards are the right place for access decisions. Validation belongs in pipes, logging and response shaping belong in interceptors, and raw request preprocessing belongs in middleware.',
      },
      {
        type: 'tip',
        text: 'Use dependency injection inside guards. That keeps database lookups, config access, and permission services testable.',
      },
      {
        type: 'try',
        text: 'Create a VerifiedEmailGuard that allows only requests where request.user.emailVerified is true. Apply it to a route that updates billing settings.',
      },
      {
        type: 'keypoints',
        items: [
          'Guards decide whether a request can continue to the handler.',
          'A guard implements CanActivate and can be synchronous or asynchronous.',
          'Use @UseGuards at method or controller scope, or register guards globally.',
          'Keep authorization logic in guards or services called by guards.',
        ],
      },
    ],
  },
  {
    slug: 'nest-interceptors',
    title: 'Interceptors',
    description:
      'Wrap request handling with interceptors for response mapping, timing, caching hooks, and cross-cutting behavior.',
    level: 'intermediate',
    section: 'Request Pipeline',
    order: 27,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Interceptors sit around the route handler. They can run code before the handler, transform the response after the handler, catch errors, or switch the returned stream.',
      },
      {
        type: 'p',
        text: 'The most common interceptor uses are response envelopes, request timing, cache integration, file handling, and serialization.',
      },
      { type: 'h2', text: 'Measure request time' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Logging interceptor',
        code: `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - startedAt;
        console.log(request.method, request.url, elapsed + 'ms');
      }),
    );
  }
}`,
      },
      { type: 'h2', text: 'Shape successful responses' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Response envelope interceptor',
        code: `import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

type ApiResponse<T> = {
  data: T;
  meta: {
    path: string;
  };
};

@Injectable()
export class ResponseEnvelopeInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => ({
        data,
        meta: {
          path: request.url,
        },
      })),
    );
  }
}`,
      },
      {
        type: 'p',
        text: 'Interceptors receive an ExecutionContext and a CallHandler. Calling next.handle() continues to the handler and returns an RxJS Observable of the handler result.',
      },
      {
        type: 'note',
        text: 'Interceptors do not run for middleware responses that end the request early. They wrap Nest route handlers, not every possible Express or Fastify response.',
      },
      {
        type: 'tip',
        text: 'Keep interceptors generic. If an interceptor knows too much about one entity or one controller, the behavior may belong in a service or the controller itself.',
      },
      {
        type: 'try',
        text: 'Build an interceptor that adds a requestId field to every successful JSON response. Read the id from request.headers["x-request-id"] or generate one in middleware first.',
      },
      {
        type: 'keypoints',
        items: [
          'Interceptors wrap route execution before and after the handler.',
          'Use RxJS operators such as map, tap, and catchError inside interceptors.',
          'Common uses include response mapping, logging, timing, and serialization.',
          'Register interceptors with @UseInterceptors or app.useGlobalInterceptors.',
        ],
      },
    ],
  },
  {
    slug: 'nest-middleware',
    title: 'Middleware in Nest',
    description:
      'Use Nest middleware for request preprocessing, request IDs, raw logging, and compatibility with Express-style middleware.',
    level: 'intermediate',
    section: 'Request Pipeline',
    order: 28,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Middleware runs before guards, interceptors, pipes, and controllers. It receives the raw request and response objects from the underlying HTTP adapter.',
      },
      {
        type: 'p',
        text: 'Use middleware for low-level request work: parsing cookies, adding a request ID, lightweight request logging, or plugging in existing Express middleware.',
      },
      { type: 'h2', text: 'Write class middleware' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Request ID middleware',
        code: `import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const requestId = request.header('x-request-id') ?? randomUUID();

    request.headers['x-request-id'] = requestId;
    response.setHeader('x-request-id', requestId);

    next();
  }
}`,
      },
      { type: 'h2', text: 'Apply middleware in a module' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Consumer configuration',
        code: `import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestIdMiddleware } from './request-id.middleware';
import { OrdersController } from './orders.controller';

@Module({
  controllers: [OrdersController],
})
export class OrdersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware)
      .forRoutes(OrdersController);
  }
}`,
      },
      {
        type: 'table',
        headers: ['Tool', 'Best for'],
        rows: [
          ['Middleware', 'Raw request preprocessing before Nest route features'],
          ['Guard', 'Allowing or denying access'],
          ['Pipe', 'Validation and transformation of input values'],
          ['Interceptor', 'Wrapping handler execution and responses'],
          ['Exception filter', 'Formatting thrown errors'],
        ],
      },
      {
        type: 'note',
        text: 'Middleware cannot access route metadata created by decorators as easily as guards and interceptors can. If you need decorator-driven behavior, choose a guard or interceptor.',
      },
      {
        type: 'tip',
        text: 'Call next() exactly once unless you intentionally end the response. Forgetting next() leaves the request hanging.',
      },
      {
        type: 'try',
        text: 'Add middleware that logs method, URL, and request ID for every route under /api. Then exclude /health so health checks stay quiet.',
      },
      {
        type: 'keypoints',
        items: [
          'Middleware runs early in the HTTP request pipeline.',
          'It is useful for request IDs, cookies, raw logging, and third-party middleware.',
          'Configure class middleware from a module that implements NestModule.',
          'Use guards, pipes, and interceptors when you need Nest metadata or route-specific behavior.',
        ],
      },
    ],
  },
  {
    slug: 'nest-custom-decorators',
    title: 'Custom Decorators',
    description:
      'Create custom parameter and metadata decorators to make controllers expressive without hiding business logic.',
    level: 'intermediate',
    section: 'Request Pipeline',
    order: 29,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Nest uses decorators heavily, and you can create your own. Custom decorators reduce repeated request plumbing and attach metadata that guards, interceptors, or pipes can read.',
      },
      {
        type: 'p',
        text: 'Use parameter decorators for values from the request. Use metadata decorators for policy information such as roles, permissions, cache settings, or public routes.',
      },
      { type: 'h2', text: 'Create a parameter decorator' },
      {
        type: 'code',
        language: 'typescript',
        title: 'CurrentUser decorator',
        code: `import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AuthenticatedUser = {
  id: string;
  email: string;
  roles: string[];
};

export const CurrentUser = createParamDecorator(
  (field: keyof AuthenticatedUser | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;

    return field && user ? user[field] : user;
  },
);`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Use the decorator in a controller',
        code: `import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';

@Controller('me')
export class MeController {
  @Get()
  getProfile(@CurrentUser('id') userId: string) {
    return { userId };
  }
}`,
      },
      { type: 'h2', text: 'Create metadata for guards' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Public route decorator',
        code: `import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);`,
      },
      {
        type: 'p',
        text: 'A global auth guard can read this metadata with Reflector and skip authentication for login, signup, and health routes.',
      },
      {
        type: 'note',
        text: 'Decorators should describe request or policy concerns. Avoid putting database calls or business rules directly inside decorator factories.',
      },
      {
        type: 'tip',
        text: 'Name custom decorators by what controller authors need to express: @CurrentUser, @Roles, @Public, and @Serialize are clear examples.',
      },
      {
        type: 'try',
        text: 'Create a @Permissions decorator that accepts strings such as "invoice:read" and "invoice:update". Store them as metadata for a permissions guard.',
      },
      {
        type: 'keypoints',
        items: [
          'Parameter decorators extract values from the current request context.',
          'Metadata decorators attach information that guards or interceptors can read.',
          'Use Reflector to read custom metadata at runtime.',
          'Keep decorators small and expressive.',
        ],
      },
    ],
  },
  {
    slug: 'nest-auth-overview',
    title: 'Auth Strategies Overview',
    description:
      'Understand authentication and authorization choices in NestJS before implementing JWT, sessions, Passport, and role checks.',
    level: 'intermediate',
    section: 'Auth',
    order: 30,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Authentication proves who a client is. Authorization decides what that authenticated identity may do. NestJS usually models these concerns with strategies, guards, decorators, and services.',
      },
      {
        type: 'p',
        text: 'A good auth design starts with the client type, trust boundary, token lifetime, revocation needs, and whether the app is browser-based, mobile, server-to-server, or all three.',
      },
      {
        type: 'table',
        headers: ['Approach', 'Common use', 'Notes'],
        rows: [
          ['JWT access token', 'APIs and mobile clients', 'Stateless, short-lived, easy to send as Bearer token'],
          ['Refresh token', 'Longer sessions', 'Store securely and rotate when possible'],
          ['Cookie session', 'Traditional browser apps', 'Requires CSRF planning and session storage'],
          ['API key', 'Internal services or integrations', 'Simple but must be scoped and rotated'],
          ['OAuth/OIDC', 'Login with identity provider', 'Use provider libraries and validate issuer/audience'],
        ],
      },
      { type: 'h2', text: 'A practical Nest auth shape' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Auth module boundaries',
        code: `import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'Request flow',
        code: `POST /auth/login
  -> validate credentials
  -> sign short-lived access token
  -> return token to client

GET /profile
  -> JwtAuthGuard verifies token
  -> request.user is attached
  -> controller handles the request`,
      },
      {
        type: 'note',
        text: 'Never hardcode secrets in source code. Read signing secrets, token lifetimes, cookie settings, and OAuth credentials from environment-backed configuration.',
      },
      {
        type: 'tip',
        text: 'Separate identity lookup from token signing. UsersService can find users, while AuthService can validate credentials and issue tokens.',
      },
      {
        type: 'try',
        text: 'Draw the auth flow for your app. Include login, access token verification, token refresh, logout, and what happens when a user is disabled.',
      },
      {
        type: 'keypoints',
        items: [
          'Authentication identifies the user; authorization checks permissions.',
          'Nest auth usually combines services, strategies, guards, and decorators.',
          'JWT is common for APIs, but sessions, API keys, and OAuth are valid options.',
          'Secrets and token settings must come from environment configuration.',
        ],
      },
    ],
  },
  {
    slug: 'nest-jwt-auth',
    title: 'JWT Authentication',
    description:
      'Implement environment-configured JWT authentication in NestJS with login, token signing, and a route guard.',
    level: 'intermediate',
    section: 'Auth',
    order: 31,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'JWT authentication is popular for Nest APIs because the server can verify a signed token without loading a server-side session for every request.',
      },
      {
        type: 'p',
        text: 'A safe JWT setup uses a strong environment-provided secret or private key, short access token lifetimes, HTTPS, and careful handling of refresh tokens.',
      },
      { type: 'h2', text: 'Configure JwtModule from environment' },
      {
        type: 'code',
        language: 'typescript',
        title: 'JWT module registration',
        code: `import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
        },
      }),
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}`,
      },
      { type: 'h2', text: 'Sign a token after validating credentials' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Auth service login',
        code: `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}`,
      },
      { type: 'h2', text: 'Verify Bearer tokens in a guard' },
      {
        type: 'code',
        language: 'typescript',
        title: 'JWT auth guard without Passport',
        code: `import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Bearer token required');
    }

    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractBearerToken(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    const [type, token] = authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}`,
      },
      {
        type: 'note',
        text: 'Do not put passwords, password hashes, access tokens, or private personal data into JWT payloads. Payloads are signed, not encrypted.',
      },
      {
        type: 'tip',
        text: 'Use a short access-token lifetime and design refresh-token storage deliberately. Browser apps often use secure, httpOnly cookies for refresh tokens.',
      },
      {
        type: 'try',
        text: 'Add a /profile route protected by JwtAuthGuard that returns the authenticated user id and email from request.user.',
      },
      {
        type: 'keypoints',
        items: [
          'JWTs are useful for stateless API authentication.',
          'Read JWT secrets and expirations from environment-backed config.',
          'Validate credentials before signing a token.',
          'Bearer token guards verify the token and attach claims to the request.',
        ],
      },
    ],
  },
  {
    slug: 'nest-passport',
    title: 'Passport Integration',
    description:
      'Integrate Passport strategies with NestJS for reusable local, JWT, and OAuth authentication flows.',
    level: 'intermediate',
    section: 'Auth',
    order: 32,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Passport is a mature authentication middleware ecosystem. Nest wraps Passport with @nestjs/passport so strategies become injectable classes and guards become easy to apply.',
      },
      {
        type: 'p',
        text: 'A Passport strategy validates one kind of credential. A Passport auth guard runs that strategy for a route and places the validated result on request.user.',
      },
      { type: 'h2', text: 'Create a local strategy' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Username and password strategy',
        code: `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Use AuthGuard with login',
        code: `import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Request() request: { user: { id: string; email: string } }) {
    return this.authService.issueTokens(request.user);
  }
}`,
      },
      { type: 'h2', text: 'Create a JWT strategy' },
      {
        type: 'code',
        language: 'typescript',
        title: 'JWT Passport strategy',
        code: `import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: { sub: string; email: string; roles: string[] }) {
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}`,
      },
      {
        type: 'note',
        text: 'Passport is optional. For simple JWT APIs, a custom guard may be enough. Passport shines when you need multiple strategies such as local login, JWT, GitHub, Google, or SAML.',
      },
      {
        type: 'tip',
        text: 'Name strategies consistently. The string passed to AuthGuard("jwt") or AuthGuard("local") must match the strategy name Passport registered.',
      },
      {
        type: 'try',
        text: 'Create a JwtAuthGuard class that extends AuthGuard("jwt"), then use @UseGuards(JwtAuthGuard) instead of repeating AuthGuard("jwt") in controllers.',
      },
      {
        type: 'keypoints',
        items: [
          'Passport strategies validate credentials and return a user object.',
          '@nestjs/passport adapts Passport into Nest providers and guards.',
          'AuthGuard("local") is common for login; AuthGuard("jwt") is common for protected API routes.',
          'Secrets used by strategies must come from configuration, not source code.',
        ],
      },
    ],
  },
  {
    slug: 'nest-roles-permissions',
    title: 'Roles & Permissions',
    description:
      'Build role and permission authorization in NestJS with metadata decorators, Reflector, and guards.',
    level: 'intermediate',
    section: 'Auth',
    order: 33,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'After authentication, most applications need authorization. Roles group broad capabilities such as admin or editor. Permissions describe finer actions such as article:publish.',
      },
      {
        type: 'p',
        text: 'Nest authorization often uses decorators to declare requirements and guards to compare those requirements with the authenticated user.',
      },
      { type: 'h2', text: 'Create decorators for route requirements' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Roles and permissions metadata',
        code: `import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);`,
      },
      { type: 'h2', text: 'Check metadata inside a guard' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Roles guard',
        code: `import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './authz.decorators';

type RequestUser = {
  id: string;
  roles: string[];
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as RequestUser | undefined;

    return requiredRoles.some((role) => user?.roles.includes(role));
  }
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Protect a route',
        code: `import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './authz.decorators';
import { RolesGuard } from './roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  @Delete(':id')
  @Roles('admin')
  removeUser(@Param('id') id: string) {
    return { deleted: id };
  }
}`,
      },
      {
        type: 'note',
        text: 'Role checks are easy to start with, but permissions are often better for large systems because they describe actions more precisely.',
      },
      {
        type: 'tip',
        text: 'Keep authorization decisions close to business rules when ownership matters. A guard can verify the user is authenticated, then a service can check whether the user owns the specific record.',
      },
      {
        type: 'try',
        text: 'Extend the guard to support @Permissions("post:update"). Then protect an endpoint so admins or users with that permission can update a post.',
      },
      {
        type: 'keypoints',
        items: [
          'Roles are broad groups; permissions are specific capabilities.',
          'Decorators declare authorization requirements as metadata.',
          'Guards read metadata with Reflector and compare it with request.user.',
          'Record ownership checks often belong in services because they need data access.',
        ],
      },
    ],
  },
  {
    slug: 'nest-typeorm',
    title: 'TypeORM with Nest',
    description:
      'Connect NestJS to relational databases with TypeORM entities, repositories, configuration, and service patterns.',
    level: 'intermediate',
    section: 'Data',
    order: 34,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'TypeORM is a decorator-based ORM that maps TypeScript classes to relational tables. Nest integrates it with TypeOrmModule, repositories, and dependency injection.',
      },
      {
        type: 'p',
        text: 'Choose TypeORM when its entity and repository style fits your team. Prisma is also a strong option in Nest, and choosing one should depend on schema workflow, query style, and operational needs.',
      },
      { type: 'h2', text: 'Configure TypeORM with environment variables' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Database module configuration',
        code: `import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        entities: [User],
        synchronize: false,
        migrationsRun: false,
        ssl: config.get('DATABASE_SSL') === 'true',
      }),
    }),
  ],
})
export class DatabaseModule {}`,
      },
      { type: 'h2', text: 'Create an entity and repository service' },
      {
        type: 'code',
        language: 'typescript',
        title: 'User entity',
        code: `import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Repository injection',
        code: `import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneOrFail(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}`,
      },
      {
        type: 'note',
        text: 'Keep synchronize disabled outside throwaway local experiments. Use migrations for database changes that must be repeatable and reviewable.',
      },
      {
        type: 'tip',
        text: 'Use repositories in services rather than controllers. Controllers should translate HTTP requests; services should own data access and business decisions.',
      },
      {
        type: 'try',
        text: 'Create a Post entity with id, title, body, authorId, createdAt, and updatedAt. Register TypeOrmModule.forFeature([Post]) in a PostsModule.',
      },
      {
        type: 'keypoints',
        items: [
          'TypeORM maps classes to relational database tables.',
          'Nest injects repositories with @InjectRepository.',
          'Read DATABASE_URL and database options from environment-backed config.',
          'Use migrations instead of synchronize for real environments.',
        ],
      },
    ],
  },
  {
    slug: 'nest-prisma',
    title: 'Prisma with Nest',
    description:
      'Use Prisma as a type-safe database client in NestJS with a PrismaService, schema models, and clean service methods.',
    level: 'intermediate',
    section: 'Data',
    order: 35,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Prisma is a type-safe database toolkit that generates a client from a schema file. In Nest, it is commonly wrapped in a PrismaService and injected into feature services.',
      },
      {
        type: 'p',
        text: 'Prisma and TypeORM are both valid choices. Prisma emphasizes generated types and explicit queries, while TypeORM emphasizes decorated entity classes and repositories.',
      },
      { type: 'h2', text: 'Define a Prisma model' },
      {
        type: 'code',
        language: 'text',
        title: 'schema.prisma',
        code: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  posts        Post[]
}

model Post {
  id        String   @id @default(uuid())
  title     String
  body      String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`,
      },
      { type: 'h2', text: 'Create a PrismaService' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Prisma service lifecycle',
        code: `import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Use Prisma in a feature service',
        code: `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  create(authorId: string, title: string, body: string) {
    return this.prisma.post.create({
      data: {
        authorId,
        title,
        body,
      },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}`,
      },
      {
        type: 'note',
        text: 'Prisma reads DATABASE_URL from the environment in schema.prisma. Keep that value out of source control and provide it through deployment secrets.',
      },
      {
        type: 'tip',
        text: 'Expose PrismaService from a PrismaModule so feature modules can import it instead of constructing PrismaClient themselves.',
      },
      {
        type: 'try',
        text: 'Add a Comment model related to Post and User. Generate the Prisma client, then write a CommentsService method that creates a comment for a post.',
      },
      {
        type: 'keypoints',
        items: [
          'Prisma generates a typed client from schema.prisma.',
          'A PrismaService integrates PrismaClient with the Nest lifecycle.',
          'Feature services should inject PrismaService and keep controllers thin.',
          'TypeORM and Prisma are options; choose based on team workflow and project needs.',
        ],
      },
    ],
  },
  {
    slug: 'nest-mongodb',
    title: 'MongoDB / Mongoose with Nest',
    description:
      'Connect NestJS to MongoDB with Mongoose schemas, models, DTOs, and service methods.',
    level: 'intermediate',
    section: 'Data',
    order: 36,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'MongoDB stores flexible documents instead of rows. Nest integrates with Mongoose through @nestjs/mongoose, giving you schemas, models, and dependency injection.',
      },
      {
        type: 'p',
        text: 'MongoDB works well for document-shaped data, event payloads, catalogs, and cases where embedded subdocuments reduce joins. It still needs schema discipline in application code.',
      },
      { type: 'h2', text: 'Connect with MongooseModule' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Mongo connection from config',
        code: `import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
  ],
})
export class DatabaseModule {}`,
      },
      { type: 'h2', text: 'Define a schema' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Article schema',
        code: `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true, index: true })
  authorId: string;

  @Prop({ default: [] })
  tags: string[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Inject a Mongoose model',
        code: `import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './article.schema';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
  ) {}

  create(data: { title: string; body: string; authorId: string }) {
    return this.articleModel.create(data);
  }

  async findOne(id: string) {
    const article = await this.articleModel.findById(id).lean().exec();

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }
}`,
      },
      {
        type: 'note',
        text: 'MongoDB does not remove the need for validation. Use DTOs and ValidationPipe for incoming requests, then use schema constraints and indexes for storage guarantees.',
      },
      {
        type: 'tip',
        text: 'Use lean() for read-only Mongoose queries when you do not need document methods. It returns plain objects and can reduce overhead.',
      },
      {
        type: 'try',
        text: 'Create a ProductsModule with a Product schema that includes name, price, stock, and categories. Add indexes for fields you search often.',
      },
      {
        type: 'keypoints',
        items: [
          'Nest integrates MongoDB through @nestjs/mongoose.',
          'Schemas describe document shape and indexes.',
          'Inject Mongoose models into services with @InjectModel.',
          'Use DTO validation even when the database is schemaless.',
        ],
      },
    ],
  },
  {
    slug: 'nest-migrations',
    title: 'Migrations Mindset',
    description:
      'Treat database schema changes as versioned, reviewed, reversible operations instead of one-off edits.',
    level: 'intermediate',
    section: 'Data',
    order: 37,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Migrations are scripts that move a database schema from one version to another. They make schema changes reviewable, repeatable, and safe to run across environments.',
      },
      {
        type: 'p',
        text: 'Whether you use TypeORM, Prisma, Knex, or another tool, the mindset is the same: write small changes, review generated SQL, and plan for existing production data.',
      },
      {
        type: 'table',
        headers: ['Change', 'Risk', 'Safer approach'],
        rows: [
          ['Add nullable column', 'Low', 'Deploy column first, write later, require later if needed'],
          ['Rename column', 'Medium', 'Add new column, backfill, read both, remove old column later'],
          ['Drop column', 'High', 'Stop using it first, verify, then drop in a later release'],
          ['Add unique index', 'Medium', 'Clean duplicates before applying the constraint'],
        ],
      },
      { type: 'h2', text: 'TypeORM migration example' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Add a published_at column',
        code: `import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPublishedAtToPosts1710000000000 implements MigrationInterface {
  name = 'AddPublishedAtToPosts1710000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE posts ADD COLUMN published_at TIMESTAMP NULL',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE posts DROP COLUMN published_at');
  }
}`,
      },
      { type: 'h2', text: 'Prisma migration workflow' },
      {
        type: 'code',
        language: 'bash',
        title: 'Create and apply a Prisma migration',
        code: `npx prisma migrate dev --name add-post-published-at
npx prisma migrate deploy`,
      },
      {
        type: 'note',
        text: 'Generated migrations are code. Read them before merge, especially when data may be dropped, rewritten, or locked during a large table operation.',
      },
      {
        type: 'tip',
        text: 'Prefer expand-and-contract releases for risky changes: add the new structure, deploy code that uses it, backfill data, then remove the old structure later.',
      },
      {
        type: 'try',
        text: 'Plan a migration that changes users.name into users.first_name and users.last_name. Write the release steps without losing existing data.',
      },
      {
        type: 'keypoints',
        items: [
          'Migrations version database schema changes.',
          'Review generated SQL and consider existing data.',
          'Disable automatic synchronize in real environments.',
          'Use staged releases for renames, drops, and large data changes.',
        ],
      },
    ],
  },
  {
    slug: 'nest-relations',
    title: 'Relations & Nested Resources',
    description:
      'Model relational data and nested API routes in NestJS without mixing routing concerns into persistence code.',
    level: 'intermediate',
    section: 'Data',
    order: 38,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Many APIs expose relationships: users have posts, orders have items, and teams have members. Nest controllers can model nested resources while services handle data access.',
      },
      {
        type: 'p',
        text: 'Nested routes are useful when the parent resource matters for authorization or filtering. They should not force your database schema to mirror every URL shape.',
      },
      { type: 'h2', text: 'Create nested routes' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Posts under users',
        code: `import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('users/:userId/posts')
export class UserPostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findForUser(@Param('userId') userId: string) {
    return this.postsService.findForUser(userId);
  }

  @Post()
  createForUser(
    @Param('userId') userId: string,
    @Body() body: { title: string; content: string },
  ) {
    return this.postsService.createForUser(userId, body);
  }
}`,
      },
      { type: 'h2', text: 'Load relations deliberately' },
      {
        type: 'code',
        language: 'typescript',
        title: 'TypeORM relation query',
        code: `findPostWithAuthor(id: string) {
  return this.postsRepository.findOne({
    where: { id },
    relations: {
      author: true,
    },
  });
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Prisma relation query',
        code: `findPostWithAuthor(id: string) {
  return this.prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
    },
  });
}`,
      },
      {
        type: 'note',
        text: 'Avoid loading every relation by default. Large object graphs can leak data and create slow queries.',
      },
      {
        type: 'tip',
        text: 'Use nested routes when the URL communicates ownership or context. For direct lookup, /posts/:id is often simpler than /users/:userId/posts/:postId.',
      },
      {
        type: 'try',
        text: 'Design routes for teams and members. Include routes to list members for a team, add a member, remove a member, and fetch a member directly.',
      },
      {
        type: 'keypoints',
        items: [
          'Nested resources express parent context in URLs.',
          'Services should enforce parent-child relationships before writing data.',
          'Load database relations deliberately with include or relation options.',
          'Do not expose unnecessary related data by default.',
        ],
      },
    ],
  },
  {
    slug: 'nest-file-uploads',
    title: 'File Uploads',
    description:
      'Handle file uploads in NestJS with Multer interceptors, validation, storage decisions, and safe response design.',
    level: 'intermediate',
    section: 'App Features',
    order: 39,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Nest file uploads usually use Multer through FileInterceptor or FilesInterceptor. The interceptor parses multipart/form-data and makes uploaded files available to the route handler.',
      },
      {
        type: 'p',
        text: 'Production upload design must consider size limits, file type validation, virus scanning for risky files, private storage, and whether files are stored locally or in object storage.',
      },
      { type: 'h2', text: 'Upload a single file' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Avatar upload endpoint',
        code: `import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('me')
export class AvatarController {
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }
}`,
      },
      { type: 'h2', text: 'Configure Multer options' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Disk storage for local development',
        code: `import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (request, file, callback) => {
          const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
          callback(null, Date.now() + '-' + safeName);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
  ],
})
export class UploadsModule {}`,
      },
      {
        type: 'note',
        text: 'Local disk uploads are convenient for development but fragile for horizontally scaled deployments. Production apps commonly store files in object storage such as S3-compatible buckets.',
      },
      {
        type: 'tip',
        text: 'Store file metadata in your database and file bytes in storage. Return a stable file id or signed URL instead of exposing internal paths.',
      },
      {
        type: 'try',
        text: 'Add an endpoint that accepts up to three PDF files, rejects oversized files, and returns metadata for each accepted upload.',
      },
      {
        type: 'keypoints',
        items: [
          'FileInterceptor parses multipart uploads for one file field.',
          'Validate upload size and type before trusting files.',
          'Use object storage for production file bytes.',
          'Keep database records for ownership, metadata, and access control.',
        ],
      },
    ],
  },
  {
    slug: 'nest-caching',
    title: 'Caching Module',
    description:
      'Use caching in NestJS to reduce repeated work while keeping correctness, invalidation, and TTLs in mind.',
    level: 'intermediate',
    section: 'App Features',
    order: 40,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Caching stores expensive or frequently requested results for reuse. In Nest, you can use CacheModule, cache-manager stores, interceptors, or explicit service-level caching.',
      },
      {
        type: 'p',
        text: 'Cache only data where short staleness is acceptable or where you have a clear invalidation plan. Incorrect cached data is often worse than a slow uncached response.',
      },
      { type: 'h2', text: 'Register CacheModule' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Basic cache setup',
        code: `import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('CACHE_TTL_SECONDS', 60),
        max: config.get<number>('CACHE_MAX_ITEMS', 1000),
      }),
    }),
  ],
})
export class AppModule {}`,
      },
      { type: 'h2', text: 'Cache inside a service' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Explicit cache get and set',
        code: `import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async getFeaturedProducts() {
    const cacheKey = 'products:featured';
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const products = await this.loadFeaturedProductsFromDatabase();
    await this.cache.set(cacheKey, products, 60);

    return products;
  }

  private loadFeaturedProductsFromDatabase() {
    return Promise.resolve([{ id: 'p1', name: 'Keyboard' }]);
  }
}`,
      },
      {
        type: 'note',
        text: 'TTL units can differ by cache-manager version and store. Confirm the version your project uses and write one small test around expiration-sensitive code.',
      },
      {
        type: 'tip',
        text: 'Design cache keys with namespacing, such as products:featured or user:123:settings. This makes invalidation and debugging easier.',
      },
      {
        type: 'try',
        text: 'Cache a public categories list for five minutes. Then add an admin update method that deletes the categories cache key after a change.',
      },
      {
        type: 'keypoints',
        items: [
          'Caching reduces repeated database calls or expensive computations.',
          'Use TTLs and invalidation rules deliberately.',
          'Service-level caching is explicit and easy to test.',
          'Cache keys should be stable, namespaced, and safe to share.',
        ],
      },
    ],
  },
  {
    slug: 'nest-queues',
    title: 'Queues (Bull) Intro',
    description:
      'Move slow or retryable work out of request handlers with Bull queues, processors, and background jobs.',
    level: 'intermediate',
    section: 'App Features',
    order: 41,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Queues let an API accept work quickly and process it in the background. Common jobs include sending email, resizing images, exporting reports, and calling unreliable third-party APIs.',
      },
      {
        type: 'p',
        text: 'Bull uses Redis for queue storage. Nest integrates Bull with modules, injected queues, and processor classes.',
      },
      { type: 'h2', text: 'Register Bull with Redis configuration' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Queue module setup',
        code: `import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
})
export class EmailQueueModule {}`,
      },
      { type: 'h2', text: 'Add and process jobs' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Producer service',
        code: `import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async sendWelcomeEmail(userId: string, email: string) {
    await this.emailQueue.add(
      'welcome',
      { userId, email },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
      },
    );
  }
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Processor',
        code: `import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('email')
export class EmailProcessor {
  @Process('welcome')
  async handleWelcome(job: Job<{ userId: string; email: string }>) {
    const { userId, email } = job.data;

    console.log('Sending welcome email to', email, 'for user', userId);
  }
}`,
      },
      {
        type: 'note',
        text: 'A queued job may run more than once if a worker crashes after doing work but before acknowledging completion. Design processors to be idempotent when possible.',
      },
      {
        type: 'tip',
        text: 'Put only the data needed to process the job in the payload. For large payloads, store data elsewhere and pass an id.',
      },
      {
        type: 'try',
        text: 'Create a report queue. Add a job when a user requests an export, then write a processor that marks the report as processing and later complete.',
      },
      {
        type: 'keypoints',
        items: [
          'Queues move slow work out of HTTP request handlers.',
          'Bull uses Redis and supports retries, backoff, and processors.',
          'Producers add jobs; processors perform jobs.',
          'Job handlers should tolerate retries and duplicate execution.',
        ],
      },
    ],
  },
  {
    slug: 'nest-scheduling',
    title: 'Task Scheduling',
    description:
      'Run recurring or delayed application tasks with Nest schedule decorators and safe operational patterns.',
    level: 'intermediate',
    section: 'App Features',
    order: 42,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Scheduling lets your application run work at a time or interval: cleanup old records, send reminders, refresh external data, or publish daily summaries.',
      },
      {
        type: 'p',
        text: 'Nest provides @nestjs/schedule with cron, interval, and timeout decorators. Use it for modest scheduled work and consider dedicated workers for heavy jobs.',
      },
      { type: 'h2', text: 'Enable scheduling' },
      {
        type: 'code',
        language: 'typescript',
        title: 'ScheduleModule setup',
        code: `import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupTasks } from './cleanup.tasks';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CleanupTasks],
})
export class TasksModule {}`,
      },
      { type: 'h2', text: 'Run a cron task' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Daily cleanup',
        code: `import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CleanupTasks {
  private readonly logger = new Logger(CleanupTasks.name);

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deleteExpiredSessions() {
    this.logger.log('Deleting expired sessions');
    await Promise.resolve();
  }
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Interval task',
        code: `import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class MetricsTasks {
  @Interval(30000)
  collectRuntimeMetrics() {
    console.log('Collecting metrics every 30 seconds');
  }
}`,
      },
      {
        type: 'note',
        text: 'If you run multiple app instances, each instance may run the same scheduled task. Use a distributed lock, leader election, or a separate worker process when duplication is unsafe.',
      },
      {
        type: 'tip',
        text: 'Keep scheduled methods short. Delegate real work to injectable services so you can test the logic without waiting for a clock.',
      },
      {
        type: 'try',
        text: 'Create a scheduled task that archives completed notifications older than 30 days. Make the cutoff date easy to test by passing it to a service method.',
      },
      {
        type: 'keypoints',
        items: [
          'ScheduleModule enables cron, interval, and timeout decorators.',
          'Scheduled jobs are useful for cleanup, reminders, and periodic syncs.',
          'Multiple app instances can duplicate scheduled work.',
          'Delegate work from tasks to services for testability.',
        ],
      },
    ],
  },
  {
    slug: 'nest-testing-unit',
    title: 'Unit Testing',
    description:
      'Test Nest services, guards, and controllers in isolation with TestingModule, mocks, and focused assertions.',
    level: 'intermediate',
    section: 'Quality',
    order: 43,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Unit tests verify a small piece of behavior without starting the whole application. In Nest, that usually means testing a service with mocked dependencies or a guard with a mocked execution context.',
      },
      {
        type: 'p',
        text: 'Nest TestingModule lets you create a miniature dependency injection container for the class under test.',
      },
      { type: 'h2', text: 'Test a service with mocked dependencies' },
      {
        type: 'code',
        language: 'typescript',
        title: 'UsersService unit test',
        code: `import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  const usersRepository = {
    findOne: jest.fn(),
  };

  let service: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USERS_REPOSITORY',
          useValue: usersRepository,
        },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
    jest.clearAllMocks();
  });

  it('returns a user by id', async () => {
    usersRepository.findOne.mockResolvedValue({ id: 'u1', email: 'a@example.com' });

    await expect(service.findOneOrFail('u1')).resolves.toEqual({
      id: 'u1',
      email: 'a@example.com',
    });
  });

  it('throws when the user is missing', async () => {
    usersRepository.findOne.mockResolvedValue(null);

    await expect(service.findOneOrFail('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});`,
      },
      { type: 'h2', text: 'Test a guard decision' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Minimal guard context mock',
        code: `const createHttpContext = (request: unknown) =>
  ({
    switchToHttp: () => ({
      getRequest: () => request,
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  }) as any;`,
      },
      {
        type: 'note',
        text: 'Unit tests should not need a real database, Redis, HTTP server, or external API. Replace those dependencies with fakes or mocks.',
      },
      {
        type: 'tip',
        text: 'Test behavior, not private implementation details. A refactor should not break tests if the public behavior stays the same.',
      },
      {
        type: 'try',
        text: 'Write unit tests for a RolesGuard. Cover no required roles, matching role, missing user, and non-matching role.',
      },
      {
        type: 'keypoints',
        items: [
          'Unit tests focus on small pieces of behavior.',
          'TestingModule creates a small Nest DI container for tests.',
          'Mock database and network dependencies in unit tests.',
          'Assert outcomes such as returned values, thrown exceptions, and collaborator calls.',
        ],
      },
    ],
  },
  {
    slug: 'nest-testing-e2e',
    title: 'E2E Testing',
    description:
      'Test complete Nest HTTP flows with a real application instance, Supertest, validation, guards, and database setup.',
    level: 'intermediate',
    section: 'Quality',
    order: 44,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'End-to-end tests start a Nest application and call it like a client. They verify routing, validation, guards, interceptors, controllers, and providers working together.',
      },
      {
        type: 'p',
        text: 'E2E tests are slower than unit tests but catch integration mistakes. Use them for important flows such as signup, login, checkout, and permissions.',
      },
      { type: 'h2', text: 'Create an E2E test app' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Supertest with Nest',
        code: `import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects invalid signup payloads', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'not-an-email' })
      .expect(400);
  });
});`,
      },
      { type: 'h2', text: 'Override providers for stable tests' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Override an email sender',
        code: `const emailSender = {
  sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
};

const moduleRef = await Test.createTestingModule({
  imports: [AppModule],
})
  .overrideProvider('EMAIL_SENDER')
  .useValue(emailSender)
  .compile();`,
      },
      {
        type: 'p',
        text: 'For database-backed E2E tests, use a dedicated test database, transactions, or containerized databases. Reset state between tests so one test does not depend on another.',
      },
      {
        type: 'note',
        text: 'Do not run E2E tests against production or shared staging data. Use explicit test environment variables and fail fast when DATABASE_URL points to an unsafe location.',
      },
      {
        type: 'tip',
        text: 'Keep E2E assertions client-focused: status code, response body, headers, and observable side effects. Avoid reaching into private service state.',
      },
      {
        type: 'try',
        text: 'Write an E2E test that signs up a user, logs in, receives an access token, and calls a protected /me endpoint with Authorization: Bearer token.',
      },
      {
        type: 'keypoints',
        items: [
          'E2E tests start a Nest application and call HTTP endpoints.',
          'They verify multiple layers working together.',
          'Use provider overrides for external services such as email or payments.',
          'Use isolated test data and safe test environment variables.',
        ],
      },
    ],
  },
  {
    slug: 'nest-openapi',
    title: 'OpenAPI / Swagger Docs',
    description:
      'Generate useful OpenAPI documentation for NestJS APIs with SwaggerModule, DTO decorators, tags, and auth metadata.',
    level: 'intermediate',
    section: 'Quality',
    order: 45,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'OpenAPI describes your HTTP API in a machine-readable format. Nest can generate an OpenAPI document from controllers, DTOs, and decorators using @nestjs/swagger.',
      },
      {
        type: 'p',
        text: 'Good docs are more than a generated page. They describe request bodies, responses, authentication, errors, and examples clients can trust.',
      },
      { type: 'h2', text: 'Set up SwaggerModule' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Swagger bootstrap configuration',
        code: `import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Acme API')
    .setDescription('API for Acme customers and admins')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}

bootstrap();`,
      },
      { type: 'h2', text: 'Decorate DTOs and routes' },
      {
        type: 'code',
        language: 'typescript',
        title: 'DTO and controller docs',
        code: `import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

class CreateUserDto {
  @ApiProperty({ example: 'ada@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 12, example: 'correct horse battery' })
  @MinLength(12)
  password: string;
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @Post()
  @ApiCreatedResponse({ description: 'User was created' })
  create(@Body() dto: CreateUserDto) {
    return { id: 'u1', email: dto.email };
  }
}`,
      },
      {
        type: 'note',
        text: 'Generated docs can be wrong when DTOs, response shapes, or auth decorators are missing. Treat the OpenAPI document as a contract and review it.',
      },
      {
        type: 'tip',
        text: 'Expose Swagger UI in development and protected internal environments. Be careful about exposing admin-only routes publicly.',
      },
      {
        type: 'try',
        text: 'Add OpenAPI docs to a posts controller. Include tags, request DTO examples, 201 response docs, 400 validation docs, and bearer auth.',
      },
      {
        type: 'keypoints',
        items: [
          'OpenAPI documents your HTTP API for humans and tools.',
          '@nestjs/swagger can generate docs from controllers and DTOs.',
          'Use ApiProperty, ApiTags, response decorators, and auth decorators.',
          'Review generated docs for accuracy before clients rely on them.',
        ],
      },
    ],
  },
  {
    slug: 'nest-logging',
    title: 'Logging',
    description:
      'Add useful NestJS logs with Logger, request context, error details, and production-friendly practices.',
    level: 'intermediate',
    section: 'Quality',
    order: 46,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Logs help you understand what the application did and why. In Nest, the built-in Logger is a good starting point for application events, errors, and lifecycle messages.',
      },
      {
        type: 'p',
        text: 'Useful logs include context, stable event names, request IDs, and enough detail to debug without exposing secrets or personal data.',
      },
      { type: 'h2', text: 'Use Logger in a service' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Service logging',
        code: `import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  async capturePayment(orderId: string, amountCents: number) {
    this.logger.log({
      event: 'payment.capture.started',
      orderId,
      amountCents,
    });

    try {
      await Promise.resolve();
      this.logger.log({ event: 'payment.capture.succeeded', orderId });
    } catch (error) {
      this.logger.error(
        { event: 'payment.capture.failed', orderId },
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}`,
      },
      { type: 'h2', text: 'Configure log levels' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Bootstrap logger levels',
        code: `import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  await app.listen(process.env.PORT ?? 3000);
  Logger.log('Application started', 'Bootstrap');
}

bootstrap();`,
      },
      {
        type: 'note',
        text: 'Never log passwords, tokens, API keys, full payment data, or unnecessary personal data. Logs often live longer and travel farther than application databases.',
      },
      {
        type: 'tip',
        text: 'Add a request ID in middleware and include it in request logs. It makes one user request traceable across services and background jobs.',
      },
      {
        type: 'try',
        text: 'Add structured logs to a signup flow: signup.started, signup.created_user, signup.sent_email, and signup.failed. Include requestId and userId when available.',
      },
      {
        type: 'keypoints',
        items: [
          'Logs should explain important application behavior.',
          'Use Logger with meaningful context names.',
          'Include request IDs and stable event names for debugging.',
          'Protect secrets and sensitive data from log output.',
        ],
      },
    ],
  },
  {
    slug: 'nest-versioning',
    title: 'API Versioning',
    description:
      'Version NestJS APIs with URI, header, or media-type strategies while keeping compatibility promises clear.',
    level: 'intermediate',
    section: 'Delivery',
    order: 47,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'API versioning lets clients move at different speeds when your API changes. Nest supports URI, header, media type, and custom versioning strategies.',
      },
      {
        type: 'p',
        text: 'Version only when the contract changes in a breaking way. Adding optional fields or new endpoints usually does not require a new version.',
      },
      { type: 'h2', text: 'Enable URI versioning' },
      {
        type: 'code',
        language: 'typescript',
        title: 'main.ts',
        code: `import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(3000);
}

bootstrap();`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Versioned controller routes',
        code: `import { Controller, Get, Version } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get()
  @Version('1')
  findV1() {
    return [{ id: 'p1', name: 'Keyboard' }];
  }

  @Get()
  @Version('2')
  findV2() {
    return {
      data: [{ id: 'p1', name: 'Keyboard' }],
      meta: { version: 2 },
    };
  }
}`,
      },
      {
        type: 'table',
        headers: ['Strategy', 'Example', 'Tradeoff'],
        rows: [
          ['URI', '/v1/products', 'Easy to see and cache'],
          ['Header', 'X-API-Version: 1', 'Cleaner URLs but less visible'],
          ['Media type', 'Accept: application/vnd.acme.v1+json', 'Precise but more complex'],
        ],
      },
      {
        type: 'note',
        text: 'Versioning does not replace deprecation communication. Tell clients what changed, when old versions retire, and how to migrate.',
      },
      {
        type: 'tip',
        text: 'Keep old versions stable. Route v1 and v2 to separate DTOs or adapter methods when response shapes diverge.',
      },
      {
        type: 'try',
        text: 'Create v1 and v2 responses for GET /orders. In v2, wrap data in an envelope with meta while keeping v1 unchanged.',
      },
      {
        type: 'keypoints',
        items: [
          'API versioning protects clients from breaking changes.',
          'Nest supports URI, header, media type, and custom versioning.',
          'Do not create a new version for every additive change.',
          'Document deprecation timelines and migration steps.',
        ],
      },
    ],
  },
  {
    slug: 'nest-deploy',
    title: 'Deploying NestJS Apps',
    description:
      'Prepare NestJS applications for production with builds, environment variables, health checks, migrations, and process management.',
    level: 'intermediate',
    section: 'Delivery',
    order: 48,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Deploying a NestJS app means more than running npm start. You need a production build, environment variables, database migrations, health checks, logging, and a reliable process model.',
      },
      {
        type: 'p',
        text: 'The exact platform can be a VM, container service, Kubernetes, serverless container, or PaaS. The same fundamentals apply across platforms.',
      },
      { type: 'h2', text: 'Build and start for production' },
      {
        type: 'code',
        language: 'json',
        title: 'package.json scripts',
        code: `{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:prod": "node dist/main.js",
    "test": "jest",
    "migration:deploy": "prisma migrate deploy"
  }
}`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Typical release commands',
        code: `npm ci
npm run build
npm run migration:deploy
npm run start:prod`,
      },
      { type: 'h2', text: 'Read runtime configuration from environment' },
      {
        type: 'code',
        language: 'typescript',
        title: 'Port and shutdown hooks',
        code: `import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();`,
      },
      {
        type: 'code',
        language: 'typescript',
        title: 'Health check controller',
        code: `import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }
}`,
      },
      {
        type: 'table',
        headers: ['Concern', 'Production checklist'],
        rows: [
          ['Secrets', 'Provide through platform secret storage, not source code'],
          ['Database', 'Run migrations before serving new code when required'],
          ['Health checks', 'Expose a lightweight endpoint for load balancers'],
          ['Logs', 'Write to stdout or a structured log collector'],
          ['Shutdown', 'Enable graceful shutdown for SIGTERM'],
        ],
      },
      {
        type: 'note',
        text: 'Do not commit .env files containing real secrets. Use sample files such as .env.example to document required variables without values.',
      },
      {
        type: 'tip',
        text: 'Make deployments repeatable. A new environment should be able to install dependencies, build, migrate, and start from documented commands.',
      },
      {
        type: 'try',
        text: 'Write a deployment checklist for your Nest app with build command, required environment variables, migration command, health check path, and rollback plan.',
      },
      {
        type: 'keypoints',
        items: [
          'Production deployments need builds, config, migrations, logs, and health checks.',
          'Read secrets and runtime settings from environment variables.',
          'Run schema migrations deliberately during release.',
          'Enable graceful shutdown and expose health endpoints for orchestration.',
        ],
      },
    ],
  },
];
