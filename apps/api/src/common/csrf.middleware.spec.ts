import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { csrfMiddleware } from './csrf.middleware';

const run = (method: string, headers: Record<string, string>) => {
  const mw = csrfMiddleware(['https://app.example.cz', 'http://localhost:3000']);
  const status = vi.fn().mockReturnThis();
  const json = vi.fn();
  const next = vi.fn() as unknown as NextFunction;
  mw({ method, headers } as unknown as Request, { status, json } as unknown as Response, next);
  return { status, next };
};

describe('csrfMiddleware', () => {
  it.each(['GET', 'HEAD', 'OPTIONS'])('%s projde bez kontroly', (method) => {
    const { next } = run(method, { origin: 'https://evil.example' });
    expect(next).toHaveBeenCalled();
  });

  it.each(['POST', 'PUT', 'PATCH', 'DELETE'])('%s bez vlastní hlavičky je zamítnuto', (method) => {
    const { status, next } = run(method, { origin: 'https://app.example.cz' });
    expect(status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('povolený Origin s hlavičkou projde', () => {
    const { next } = run('POST', { origin: 'https://app.example.cz', 'x-sp-csrf': '1' });
    expect(next).toHaveBeenCalled();
  });

  it('cizí Origin je zamítnut, i když má hlavičku', () => {
    const { status, next } = run('POST', { origin: 'https://evil.example', 'x-sp-csrf': '1' });
    expect(status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('Origin "null" (sandbox, přesměrování) je zamítnut', () => {
    const { status } = run('POST', { origin: 'null', 'x-sp-csrf': '1' });
    expect(status).toHaveBeenCalledWith(403);
  });

  it('Origin se musí shodovat přesně, ne jen prefixem nebo příponou', () => {
    for (const origin of ['https://app.example.cz.evil.example', 'https://evilapp.example.cz', 'http://app.example.cz']) {
      const { status } = run('POST', { origin, 'x-sp-csrf': '1' });
      expect(status).toHaveBeenCalledWith(403);
    }
  });

  it('klient bez Origin (mobilní aplikace) projde jen s vlastní hlavičkou', () => {
    expect(run('POST', { 'x-sp-csrf': '1' }).next).toHaveBeenCalled();
    expect(run('POST', {}).status).toHaveBeenCalledWith(403);
  });

  it('hlavička s jinou hodnotou než 1 neplatí', () => {
    expect(run('POST', { 'x-sp-csrf': 'true' }).status).toHaveBeenCalledWith(403);
    expect(run('POST', { 'x-sp-csrf': '' }).status).toHaveBeenCalledWith(403);
  });
});
