import { describe, expect, it } from 'vitest';
import { generateToken, hashToken } from './token';

describe('generateToken', () => {
  it('vrací 256 bitů v base64url (43 znaků)', () => {
    expect(generateToken()).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it('nevrací dvakrát stejnou hodnotu', () => {
    const tokens = new Set(Array.from({ length: 1000 }, () => generateToken()));
    expect(tokens.size).toBe(1000);
  });
});

describe('hashToken', () => {
  it('je deterministický SHA-256 v hex zápisu', () => {
    expect(hashToken('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(hashToken('abc')).toBe(hashToken('abc'));
  });

  it('nevrací původní token a různé tokeny mají různý hash', () => {
    const a = generateToken();
    const b = generateToken();
    expect(hashToken(a)).not.toContain(a);
    expect(hashToken(a)).not.toBe(hashToken(b));
  });
});
