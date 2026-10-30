import type { NextFunction, Request, Response } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

// Hlavička, kterou cizí web nemůže přidat bez CORS preflightu (ten je povolen jen pro naše originy).
export const CSRF_HEADER = 'x-sp-csrf';

// Ochrana proti CSRF pro metody měnící stav. Doplňuje cookie SameSite=Lax:
// 1) pokud je přítomna hlavička Origin, musí patřit k povoleným originům,
// 2) požadavek musí nést vlastní hlavičku. Klienti bez Origin (mobilní aplikace) projdou jen s ní.
export function csrfMiddleware(allowedOrigins: string[]) {
  const allowed = new Set(allowedOrigins);
  return (req: Request, res: Response, next: NextFunction): void => {
    if (SAFE_METHODS.has(req.method)) return next();

    const origin = req.headers.origin;
    if (origin !== undefined && !allowed.has(origin)) {
      res.status(403).json({ message: 'forbidden' });
      return;
    }
    if (req.headers[CSRF_HEADER] !== '1') {
      res.status(403).json({ message: 'forbidden' });
      return;
    }
    next();
  };
}
