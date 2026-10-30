import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { Clock } from '../src/common/clock';
import { APP_CONFIG, type AppConfig, loadAppConfig } from '../src/config/app-config';
import { env } from '../src/config/env';
import { PrismaService } from '../src/prisma/prisma.service';

export const BASE_TIME = new Date('2026-03-01T10:00:00.000Z');
export const PASSWORD = 'correct horse battery staple';
export const ALLOWED_ORIGIN = 'http://localhost:3000';

// Ovladatelný čas: expirace a rotace se testují posunem hodin, ne čekáním.
export class FakeClock extends Clock {
  private current = BASE_TIME;

  now(): Date {
    return new Date(this.current);
  }

  set(date: Date): void {
    this.current = new Date(date);
  }

  advance(ms: number): void {
    this.current = new Date(this.current.getTime() + ms);
  }
}

export interface ConfigOverrides {
  trustProxy?: number;
  cookie?: Partial<AppConfig['cookie']>;
  session?: Partial<AppConfig['session']>;
  login?: Partial<AppConfig['login']>;
  rateLimit?: Partial<AppConfig['rateLimit']>;
}

export interface TestApp {
  app: NestExpressApplication;
  clock: FakeClock;
  cfg: AppConfig;
  prisma: PrismaService;
  close(): Promise<void>;
}

export async function createTestApp(overrides: ConfigOverrides = {}): Promise<TestApp> {
  const base = loadAppConfig(env);
  const cfg: AppConfig = {
    ...base,
    trustProxy: overrides.trustProxy ?? base.trustProxy,
    cookie: { ...base.cookie, ...overrides.cookie },
    session: { ...base.session, ...overrides.session },
    login: { ...base.login, ...overrides.login },
    // Limity jsou ve výchozím stavu vysoké, aby nerušily ostatní testy; testy limitů si je nastaví samy.
    rateLimit: { globalPerMin: 100_000, authPerMin: 100_000, ...overrides.rateLimit },
  };
  const clock = new FakeClock();

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(APP_CONFIG)
    .useValue(cfg)
    .overrideProvider(Clock)
    .useValue(clock)
    .compile();

  const app = moduleRef.createNestApplication<NestExpressApplication>();
  configureApp(app, cfg);
  await app.init();

  return { app, clock, cfg, prisma: app.get(PrismaService), close: () => app.close() };
}

export async function resetDb(prisma: PrismaService): Promise<void> {
  await prisma.$executeRawUnsafe(
    'TRUNCATE "AuthEvent", "SessionToken", "Session", "AuthIdentity", "User" RESTART IDENTITY CASCADE',
  );
}

type Req = request.Test;

const withCookie = (t: TestApp, r: Req, cookie?: string): Req =>
  cookie === undefined ? r : r.set('Cookie', `${t.cfg.cookie.name}=${cookie}`);

// Vlastní hlavička CSRF je přidaná vždy; testy, které ji mají vynechat, používají rawPost.
export function post(t: TestApp, path: string, body?: unknown, cookie?: string, headers: Record<string, string> = {}): Req {
  const r = withCookie(t, request(t.app.getHttpServer()).post(`/api${path}`).set('x-sp-csrf', '1').set(headers), cookie);
  return body === undefined ? r : r.send(body as object);
}

export function rawPost(t: TestApp, path: string): Req {
  return request(t.app.getHttpServer()).post(`/api${path}`);
}

export function get(t: TestApp, path: string, cookie?: string, headers: Record<string, string> = {}): Req {
  return withCookie(t, request(t.app.getHttpServer()).get(`/api${path}`).set(headers), cookie);
}

export function setCookieLines(res: request.Response): string[] {
  const raw = res.headers['set-cookie'] as unknown;
  return Array.isArray(raw) ? (raw as string[]) : [];
}

// Celý řádek Set-Cookie pro dané jméno cookie, pokud ho odpověď obsahuje.
export function setCookieLine(t: TestApp, res: request.Response): string | undefined {
  return setCookieLines(res).find((l) => l.startsWith(`${t.cfg.cookie.name}=`));
}

// Hodnota cookie: undefined = odpověď cookie nenastavuje, prázdný řetězec = cookie se maže.
export function cookieValue(t: TestApp, res: request.Response): string | undefined {
  const line = setCookieLine(t, res);
  return line === undefined ? undefined : line.slice(t.cfg.cookie.name.length + 1).split(';')[0];
}

export async function registerUser(t: TestApp, email: string, password = PASSWORD): Promise<void> {
  const res = await post(t, '/auth/register', { email, password });
  if (res.status !== 202) throw new Error(`register selhal: ${res.status}`);
}

export async function login(t: TestApp, email: string, password = PASSWORD, cookie?: string) {
  const res = await post(t, '/auth/login', { email, password }, cookie);
  return { res, cookie: cookieValue(t, res) };
}

export async function registerAndLogin(t: TestApp, email: string, password = PASSWORD): Promise<string> {
  await registerUser(t, email, password);
  const { res, cookie } = await login(t, email, password);
  if (res.status !== 200 || !cookie) throw new Error(`login selhal: ${res.status}`);
  return cookie;
}

export const MIN = 60_000;
export const HOUR = 60 * MIN;
export const DAY = 24 * HOUR;
