import { describe, expect, it } from 'vitest';
import { type PolicyConfig, type PolicySession, type PolicyToken, evaluateSession } from './session.policy';

const MIN = 60_000;
const t0 = new Date('2026-01-01T12:00:00.000Z');
const at = (ms: number) => new Date(t0.getTime() + ms);

const cfg: PolicyConfig = { rotateMs: 15 * MIN, graceMs: 30_000 };

const session = (over: Partial<PolicySession> = {}): PolicySession => ({
  revokedAt: null,
  idleExpiresAt: at(60 * MIN),
  absoluteExpiresAt: at(24 * 60 * MIN),
  ...over,
});
const current = (over: Partial<PolicyToken> = {}): PolicyToken => ({ createdAt: t0, supersededAt: null, ...over });

describe('evaluateSession: platnost', () => {
  it('čerstvý token je platný a nerotuje', () => {
    expect(evaluateSession(session(), current(), at(MIN), cfg)).toEqual({
      kind: 'valid',
      rotate: false,
      viaSuperseded: false,
    });
  });

  it('zneplatněná relace je neplatná, i když časy ještě nevypršely', () => {
    const s = session({ revokedAt: at(1) });
    expect(evaluateSession(s, current(), at(MIN), cfg)).toEqual({ kind: 'invalid', reason: 'revoked' });
  });

  it('vyprší při nečinnosti přesně v okamžiku idleExpiresAt', () => {
    expect(evaluateSession(session(), current(), at(60 * MIN - 1), cfg).kind).toBe('valid');
    expect(evaluateSession(session(), current(), at(60 * MIN), cfg)).toEqual({
      kind: 'invalid',
      reason: 'idle_expired',
    });
  });

  it('vyprší absolutně, i když by nečinnost ještě nevypršela', () => {
    const s = session({ idleExpiresAt: at(48 * 60 * MIN) });
    expect(evaluateSession(s, current(), at(24 * 60 * MIN), cfg)).toEqual({
      kind: 'invalid',
      reason: 'absolute_expired',
    });
  });

  it('absolutní expirace má přednost před nečinností', () => {
    const s = session({ idleExpiresAt: at(MIN), absoluteExpiresAt: at(MIN) });
    expect(evaluateSession(s, current(), at(2 * MIN), cfg)).toEqual({
      kind: 'invalid',
      reason: 'absolute_expired',
    });
  });
});

describe('evaluateSession: rotace', () => {
  it('rotuje, jakmile je token starý alespoň rotateMs', () => {
    expect(evaluateSession(session(), current(), at(15 * MIN - 1), cfg)).toMatchObject({ rotate: false });
    expect(evaluateSession(session(), current(), at(15 * MIN), cfg)).toMatchObject({ rotate: true });
  });

  it('forceRotate vynutí rotaci i u čerstvého tokenu', () => {
    expect(evaluateSession(session(), current(), at(1), cfg, { forceRotate: true })).toMatchObject({
      kind: 'valid',
      rotate: true,
    });
  });

  it('forceRotate nepomůže vypršené ani zneplatněné relaci', () => {
    const expired = session({ idleExpiresAt: at(MIN) });
    expect(evaluateSession(expired, current(), at(2 * MIN), cfg, { forceRotate: true }).kind).toBe('invalid');
    const revoked = session({ revokedAt: at(1) });
    expect(evaluateSession(revoked, current(), at(2), cfg, { forceRotate: true }).kind).toBe('invalid');
  });
});

describe('evaluateSession: nahrazený token', () => {
  const superseded = current({ supersededAt: at(10 * MIN) });

  it('v době odkladu projde bez další rotace', () => {
    expect(evaluateSession(session(), superseded, at(10 * MIN + 30_000), cfg)).toEqual({
      kind: 'valid',
      rotate: false,
      viaSuperseded: true,
    });
  });

  it('po uplynutí odkladu je to opakované použití', () => {
    expect(evaluateSession(session(), superseded, at(10 * MIN + 30_001), cfg)).toEqual({ kind: 'reuse' });
  });

  it('s odkladem 0 je každé použití nahrazeného tokenu opakované', () => {
    expect(evaluateSession(session(), superseded, at(10 * MIN + 1), { ...cfg, graceMs: 0 })).toEqual({
      kind: 'reuse',
    });
  });

  it('forceRotate neobejde detekci opakovaného použití', () => {
    expect(evaluateSession(session(), superseded, at(11 * MIN), cfg, { forceRotate: true })).toEqual({
      kind: 'reuse',
    });
  });

  it('nahrazený token vypršené relace hlásí vypršení, ne krádež', () => {
    const s = session({ idleExpiresAt: at(11 * MIN) });
    expect(evaluateSession(s, superseded, at(12 * MIN), cfg)).toEqual({ kind: 'invalid', reason: 'idle_expired' });
  });
});
