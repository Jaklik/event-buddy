import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ZodPipe } from '../common/zod.pipe';
import { AuthEventsService } from './auth-events.service';
import { type LoginInput, type RegisterInput, loginSchema, registerSchema } from './auth.dto';
import { AuthService } from './auth.service';
import { type AuthedRequest, sessionMeta } from './auth.types';
import { SessionCookie } from './session-cookie.service';
import { ForceRotate, SessionGuard } from './session.guard';
import { SessionService } from './session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly sessions: SessionService,
    private readonly cookie: SessionCookie,
    private readonly events: AuthEventsService,
  ) {}

  // Neutrální odpověď: nelze z ní poznat, zda e-mail už existoval. Přihlášení je samostatný krok.
  @Post('register')
  @HttpCode(202)
  async register(@Body(new ZodPipe(registerSchema)) body: RegisterInput, @Req() req: Request) {
    await this.auth.register(body, sessionMeta(req));
    return { status: 'accepted' };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body(new ZodPipe(loginSchema)) body: LoginInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Rotace relace po přihlášení: případná dosavadní relace z tohoto prohlížeče se zneplatní.
    const previous = this.cookie.read(req);
    const result = await this.auth.login(body, sessionMeta(req));
    if (previous) await this.sessions.revokeByToken(previous, 'replaced_on_login');
    this.cookie.set(res, result.token, result.expiresAt);
    return { user: publicUser(result.user) };
  }

  @Post('refresh')
  @HttpCode(204)
  @UseGuards(SessionGuard)
  @ForceRotate()
  refresh(): void {
    // Rotaci a nastavení cookie provádí guard.
  }

  // Idempotentní: bez platné relace jen smaže cookie.
  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const token = this.cookie.read(req);
    if (token) {
      const revoked = await this.sessions.revokeByToken(token, 'logout');
      if (revoked) await this.events.record('logout', sessionMeta(req), revoked.userId);
    }
    this.cookie.clear(res);
  }

  @Post('logout-others')
  @HttpCode(204)
  @UseGuards(SessionGuard)
  async logoutOthers(@Req() req: AuthedRequest): Promise<void> {
    await this.sessions.revokeOthers(req.auth.user.id, req.auth.sessionId, 'logout_others');
    await this.events.record('logout_others', sessionMeta(req), req.auth.user.id);
  }

  @Get('me')
  @UseGuards(SessionGuard)
  me(@Req() req: AuthedRequest) {
    return { user: publicUser(req.auth.user) };
  }
}

function publicUser(user: { id: string; email: string; emailVerifiedAt: Date | null }) {
  return { id: user.id, email: user.email, emailVerified: user.emailVerifiedAt !== null };
}
