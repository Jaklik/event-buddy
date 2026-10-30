import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { APP_CONFIG, type AppConfig } from '../config/app-config';
import { assertRestrictedRole } from './role-guard';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(APP_CONFIG) private readonly cfg: AppConfig) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    if (this.cfg.nodeEnv === 'production') await assertRestrictedRole(this);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
