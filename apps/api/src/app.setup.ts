import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { CSRF_HEADER, csrfMiddleware } from './common/csrf.middleware';
import type { AppConfig } from './config/app-config';

// Společné nastavení pro ostrý běh i testy, aby se testovalo to, co skutečně poběží.
export function configureApp(app: NestExpressApplication, cfg: AppConfig): void {
  app.set('trust proxy', cfg.trustProxy);
  app.use(helmet());
  app.enableCors({
    origin: cfg.corsOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['content-type', CSRF_HEADER],
  });
  // Odpovědi s identitou a relací se nesmí ukládat do sdílených ani prohlížečových cache; health také ne,
  // aby monitoring nedostával zastaralou odpověď.
  app.use(['/api/auth', '/api/health'], (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  app.use(cookieParser());
  app.use(csrfMiddleware(cfg.corsOrigins));
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
}
