import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import type { Request } from 'express';
import { AuthModule } from './auth/auth.module';
import { APP_CONFIG, type AppConfig } from './config/app-config';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

const AUTH_ATTEMPT_PATHS = ['/api/auth/login', '/api/auth/register'];

// Modulární monolit: každá doména (identity, catalogue, planner, ...) bude vlastní Nest modul.
@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    // Globální limit na IP a přísnější limit na přihlášení a registraci. Úložiště je v paměti procesu,
    // což stačí pro jednu instanci API; pro více instancí je potřeba sdílené úložiště.
    ThrottlerModule.forRootAsync({
      inject: [APP_CONFIG],
      useFactory: (cfg: AppConfig) => ({
        throttlers: [
          { name: 'global', ttl: 60_000, limit: cfg.rateLimit.globalPerMin },
          {
            name: 'auth',
            ttl: 60_000,
            limit: cfg.rateLimit.authPerMin,
            skipIf: (ctx) => {
              const req = ctx.switchToHttp().getRequest<Request>();
              return !AUTH_ATTEMPT_PATHS.includes(req.path);
            },
          },
        ],
      }),
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
