import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import { APP_CONFIG, type AppConfig } from './config/app-config';
import { env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const cfg = app.get<AppConfig>(APP_CONFIG);
  configureApp(app, cfg);
  await app.listen(env.PORT, '0.0.0.0');

  // Souhrn konfigurace bez secrets: loguje se jen to, co nepatří do tajných hodnot.
  const logger = new Logger('Config');
  logger.log(
    `prostředí=${cfg.nodeEnv} cookie.secure=${cfg.cookie.secure} trustProxy=${cfg.trustProxy} cors=${cfg.corsOrigins.join(',')}`,
  );
  if (cfg.nodeEnv === 'production' && !cfg.cookie.secure) {
    logger.warn('Cookie relace nemá příznak Secure. Je to přípustné jen za SSH tunelem, nikdy na veřejném HTTP.');
  }
}

bootstrap();
