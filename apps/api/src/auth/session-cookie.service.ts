import { Inject, Injectable } from '@nestjs/common';
import type { CookieOptions, Request, Response } from 'express';
import { APP_CONFIG, type AppConfig } from '../config/app-config';

// Token je 43 znaků; delší hodnota je zjevně podvrh a nemá smysl ji hašovat.
const MAX_TOKEN_LENGTH = 128;

@Injectable()
export class SessionCookie {
  constructor(@Inject(APP_CONFIG) private readonly cfg: AppConfig) {}

  read(req: Request): string | undefined {
    const value: unknown = req.cookies?.[this.cfg.cookie.name];
    return typeof value === 'string' && value.length > 0 && value.length <= MAX_TOKEN_LENGTH ? value : undefined;
  }

  set(res: Response, token: string, expires: Date): void {
    res.cookie(this.cfg.cookie.name, token, { ...this.base(), expires });
  }

  clear(res: Response): void {
    res.clearCookie(this.cfg.cookie.name, this.base());
  }

  private base(): CookieOptions {
    return { httpOnly: true, secure: this.cfg.cookie.secure, sameSite: 'lax', path: '/' };
  }
}
