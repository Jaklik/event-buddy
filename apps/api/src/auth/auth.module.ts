import { Module } from '@nestjs/common';
import { AuthEventsService } from './auth-events.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { SessionCookie } from './session-cookie.service';
import { SessionGuard } from './session.guard';
import { SessionService } from './session.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthEventsService, PasswordService, SessionCookie, SessionGuard, SessionService],
  exports: [SessionGuard, SessionService, SessionCookie],
})
export class AuthModule {}
