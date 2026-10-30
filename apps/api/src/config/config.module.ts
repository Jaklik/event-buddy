import { Global, Module } from '@nestjs/common';
import { Clock, SystemClock } from '../common/clock';
import { APP_CONFIG, loadAppConfig } from './app-config';
import { env } from './env';

@Global()
@Module({
  providers: [
    { provide: APP_CONFIG, useFactory: () => loadAppConfig(env) },
    { provide: Clock, useClass: SystemClock },
  ],
  exports: [APP_CONFIG, Clock],
})
export class ConfigModule {}
