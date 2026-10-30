import { createHash } from 'node:crypto';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  BASE_TIME,
  DAY,
  HOUR,
  MIN,
  PASSWORD,
  type TestApp,
  cookieValue,
  createTestApp,
  get,
  login,
  post,
  registerAndLogin,
  registerUser,
  resetDb,
  setCookieLine,
} from './helpers';

const EMAIL = 'jana@example.cz';
let t: TestApp;

beforeAll(async () => {
  t = await createTestApp();
});
afterAll(() => t.close());
beforeEach(async () => {
  await resetDb(t.prisma);
  t.clock.set(BASE_TIME);
});

describe('registrace', () => {
  it('vrací neutrální 202 a uloží uživatele s hashem Argon2id', async () => {
    const res = await post(t, '/auth/register', { email: 'Jana@Example.cz', password: PASSWORD });
    expect(res.status).toBe(202);
    expect(res.body).toEqual({ status: 'accepted' });

    const user = await t.prisma.user.findUniqueOrThrow({ where: { email: EMAIL }, include: { identities: true } });
    expect(user.emailVerifiedAt).toBeNull();
    expect(user.identities).toHaveLength(1);
    expect(user.identities[0].passwordHash).toMatch(/^\$argon2id\$/);
    expect(user.identities[0].passwordHash).not.toContain(PASSWORD);
  });

  it('opakovaná registrace stejného e-mailu (i v jiné velikosti písmen) odpoví stejně a nic nezmění', async () => {
    const first = await post(t, '/auth/register', { email: EMAIL, password: PASSWORD });
    const again = await post(t, '/auth/register', { email: EMAIL.toUpperCase(), password: 'another-long-password' });
    expect(again.status).toBe(first.status);
    expect(again.body).toEqual(first.body);
    expect(await t.prisma.user.count()).toBe(1);

    // Původní heslo zůstává platné, útočník ho opakovanou registrací nepřepíše.
    expect((await login(t, EMAIL, PASSWORD)).res.status).toBe(200);
    expect((await login(t, EMAIL, 'another-long-password')).res.status).toBe(401);
    expect(await t.prisma.authEvent.count({ where: { type: 'register_duplicate' } })).toBe(1);
  });
});

describe('přihlášení', () => {
  it('nastaví cookie HttpOnly, SameSite=Lax, Path=/ s expirací na konci absolutní doby života', async () => {
    await registerUser(t, EMAIL);
    const { res, cookie } = await login(t, EMAIL);

    expect(res.status).toBe(200);
    expect(res.body.user).toEqual({ id: expect.any(String), email: EMAIL, emailVerified: false });
    expect(JSON.stringify(res.body)).not.toMatch(/password|hash/i);

    const line = setCookieLine(t, res)!;
    expect(line).toMatch(/HttpOnly/i);
    expect(line).toMatch(/SameSite=Lax/i);
    expect(line).toMatch(/Path=\//);
    expect(line).not.toMatch(/Domain=/i);
    expect(cookie).toMatch(/^[A-Za-z0-9_-]{43}$/);

    const expires = /Expires=([^;]+)/i.exec(line)![1];
    expect(new Date(expires).getTime()).toBe(BASE_TIME.getTime() + 30 * DAY);
  });

  it('do DB ukládá jen hash tokenu, nikdy token samotný', async () => {
    await registerUser(t, EMAIL);
    const { cookie } = await login(t, EMAIL);
    const rows = await t.prisma.sessionToken.findMany();
    expect(rows).toHaveLength(1);
    expect(rows[0].tokenHash).toBe(createHash('sha256').update(cookie!).digest('hex'));
    expect(rows[0].tokenHash).not.toBe(cookie);
  });

  it('špatné heslo a neexistující e-mail jsou k nerozeznání', async () => {
    await registerUser(t, EMAIL);
    const wrongPassword = await login(t, EMAIL, 'definitely-wrong-password');
    const unknownEmail = await login(t, 'nikdo@example.cz', 'definitely-wrong-password');

    expect(wrongPassword.res.status).toBe(401);
    expect(unknownEmail.res.status).toBe(401);
    expect(wrongPassword.res.body).toEqual(unknownEmail.res.body);
    expect(wrongPassword.res.body).toEqual({ message: 'invalid_credentials' });
    expect(wrongPassword.cookie).toBeUndefined();
    expect(unknownEmail.cookie).toBeUndefined();
  });

  it('e-mail se při přihlášení normalizuje (velikost písmen, okolní mezery)', async () => {
    await registerUser(t, EMAIL);
    expect((await login(t, `  ${EMAIL.toUpperCase()}  `)).res.status).toBe(200);
  });

  it('nová relace nahradí relaci z cookie, kterou prohlížeč poslal (ochrana proti fixaci relace)', async () => {
    const old = await registerAndLogin(t, EMAIL);
    const { cookie: fresh } = await login(t, EMAIL, PASSWORD, old);

    expect(fresh).not.toBe(old);
    expect((await get(t, '/auth/me', old)).status).toBe(401);
    expect((await get(t, '/auth/me', fresh)).status).toBe(200);
  });

  it('pozastavený účet se nepřihlásí a jeho relace přestane platit', async () => {
    const cookie = await registerAndLogin(t, EMAIL);
    await t.prisma.user.update({ where: { email: EMAIL }, data: { status: 'SUSPENDED' } });

    expect((await get(t, '/auth/me', cookie)).status).toBe(401);
    expect((await login(t, EMAIL)).res.status).toBe(401);
  });
});

describe('zamčení účtu po neúspěšných pokusech', () => {
  const wrong = () => login(t, EMAIL, 'definitely-wrong-password');

  it('zamkne po 5 pokusech, zamčený účet odmítne i správné heslo a po uplynutí doby se odemkne', async () => {
    await registerUser(t, EMAIL);
    for (let i = 0; i < 5; i++) expect((await wrong()).res.status).toBe(401);

    const locked = await login(t, EMAIL, PASSWORD);
    expect(locked.res.status).toBe(401);
    expect(locked.res.body.message).toBe('invalid_credentials'); // zamčení se neprozrazuje

    t.clock.advance(15 * MIN - 1);
    expect((await login(t, EMAIL, PASSWORD)).res.status).toBe(401);
    t.clock.advance(2);
    expect((await login(t, EMAIL, PASSWORD)).res.status).toBe(200);
  });

  it('úspěšné přihlášení vynuluje počítadlo', async () => {
    await registerUser(t, EMAIL);
    for (let i = 0; i < 4; i++) await wrong();
    expect((await login(t, EMAIL)).res.status).toBe(200);
    for (let i = 0; i < 4; i++) await wrong();
    expect((await login(t, EMAIL)).res.status).toBe(200); // 4 + 4 selhání by dohromady zamklo, takhle ne
  });

  it('po odemčení má účet znovu plný počet pokusů', async () => {
    await registerUser(t, EMAIL);
    for (let i = 0; i < 5; i++) await wrong();
    t.clock.advance(15 * MIN + 1);
    for (let i = 0; i < 4; i++) await wrong();
    expect((await login(t, EMAIL)).res.status).toBe(200);
  });
});

describe('ověření relace a refresh tokenu', () => {
  it('me vyžaduje cookie', async () => {
    const res = await get(t, '/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('unauthenticated');
  });

  it('refresh vydá nový token, starý přežije jen krátký odklad a pak je to detekováno jako krádež', async () => {
    const original = await registerAndLogin(t, EMAIL);

    const refreshed = await post(t, '/auth/refresh', undefined, original);
    expect(refreshed.status).toBe(204);
    const rotated = cookieValue(t, refreshed)!;
    expect(rotated).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(rotated).not.toBe(original);
    expect((await get(t, '/auth/me', rotated)).status).toBe(200);

    // Starý token v době odkladu: souběžné požadavky téhož prohlížeče nesmí spadnout.
    t.clock.advance(30_000);
    expect((await get(t, '/auth/me', original)).status).toBe(200);

    // Po odkladu je použití starého tokenu krádež: zruší se celá relace včetně nového tokenu.
    t.clock.advance(1);
    const replay = await get(t, '/auth/me', original);
    expect(replay.status).toBe(401);
    expect(cookieValue(t, replay)).toBe(''); // cookie se maže
    expect((await get(t, '/auth/me', rotated)).status).toBe(401);

    const session = await t.prisma.session.findFirstOrThrow();
    expect(session.revokedReason).toBe('reuse_detected');
    expect(await t.prisma.authEvent.count({ where: { type: 'session_reuse_detected' } })).toBe(1);
  });

  it('refresh bez platné relace je 401 a nic nenastaví', async () => {
    expect((await post(t, '/auth/refresh')).status).toBe(401);
    const res = await post(t, '/auth/refresh', undefined, 'A'.repeat(43));
    expect(res.status).toBe(401);
    expect(cookieValue(t, res)).toBe('');
  });

  it('řetěz refreshů funguje opakovaně a vždy platí jen nejnovější token', async () => {
    let current = await registerAndLogin(t, EMAIL);
    const seen = [current];
    for (let i = 0; i < 5; i++) {
      t.clock.advance(2 * MIN);
      const res = await post(t, '/auth/refresh', undefined, current);
      expect(res.status).toBe(204);
      current = cookieValue(t, res)!;
      seen.push(current);
    }
    expect(new Set(seen).size).toBe(seen.length);
    expect((await get(t, '/auth/me', current)).status).toBe(200);
  });

  it('token se sám rotuje, až když je starý alespoň 15 minut', async () => {
    const original = await registerAndLogin(t, EMAIL);

    t.clock.advance(15 * MIN - 1);
    const early = await get(t, '/auth/me', original);
    expect(early.status).toBe(200);
    expect(cookieValue(t, early)).toBeUndefined();

    t.clock.advance(1);
    const due = await get(t, '/auth/me', original);
    expect(due.status).toBe(200);
    const rotated = cookieValue(t, due)!;
    expect(rotated).not.toBe(original);
    expect((await get(t, '/auth/me', rotated)).status).toBe(200);
  });

  it('souběžné požadavky se stejným tokenem při rotaci uspějí a rotace proběhne právě jednou', async () => {
    const original = await registerAndLogin(t, EMAIL);
    t.clock.advance(20 * MIN);

    const results = await Promise.all(Array.from({ length: 8 }, () => get(t, '/auth/me', original)));
    expect(results.map((r) => r.status)).toEqual(Array(8).fill(200));

    const rotatedCookies = results.map((r) => cookieValue(t, r)).filter((c) => c !== undefined);
    expect(rotatedCookies).toHaveLength(1);

    const tokens = await t.prisma.sessionToken.findMany();
    expect(tokens).toHaveLength(2);
    expect(tokens.filter((tok) => tok.supersededAt === null)).toHaveLength(1);
  });

  it('nahrazené tokeny starší než 24 hodin se při rotaci mažou', async () => {
    let current = await registerAndLogin(t, EMAIL);
    for (let i = 0; i < 3; i++) {
      t.clock.advance(2 * MIN);
      current = cookieValue(t, await post(t, '/auth/refresh', undefined, current))!;
    }
    expect(await t.prisma.sessionToken.count()).toBe(4);

    t.clock.advance(25 * HOUR);
    await post(t, '/auth/refresh', undefined, current);
    expect(await t.prisma.sessionToken.count()).toBe(2);
  });
});

describe('expirace relace', () => {
  it('relace vyprší po 14 dnech nečinnosti a cookie se smaže', async () => {
    const cookie = await registerAndLogin(t, EMAIL);

    t.clock.advance(14 * DAY - 1);
    const alive = await get(t, '/auth/me', cookie);
    expect(alive.status).toBe(200);
    const current = cookieValue(t, alive) ?? cookie;

    t.clock.advance(14 * DAY);
    const expired = await get(t, '/auth/me', current);
    expect(expired.status).toBe(401);
    expect(cookieValue(t, expired)).toBe('');

    const session = await t.prisma.session.findFirstOrThrow();
    expect(session.revokedReason).toBe('idle_expired');
    expect(await t.prisma.authEvent.count({ where: { type: 'session_idle_expired' } })).toBe(1);
  });

  it('aktivní relace přesto skončí po 30 dnech (absolutní limit)', async () => {
    let cookie = await registerAndLogin(t, EMAIL);

    for (let day = 10; day < 30; day += 10) {
      t.clock.advance(10 * DAY);
      const res = await get(t, '/auth/me', cookie);
      expect(res.status).toBe(200);
      cookie = cookieValue(t, res) ?? cookie;
    }

    t.clock.advance(10 * DAY);
    expect((await get(t, '/auth/me', cookie)).status).toBe(401);
    expect((await t.prisma.session.findFirstOrThrow()).revokedReason).toBe('absolute_expired');
  });

  it('nečinnost se posouvá aktivitou, ale nikdy za absolutní limit', async () => {
    let cookie = await registerAndLogin(t, EMAIL);
    for (const days of [10, 10, 9]) {
      t.clock.advance(days * DAY);
      const res = await get(t, '/auth/me', cookie);
      expect(res.status).toBe(200);
      cookie = cookieValue(t, res) ?? cookie;
    }

    // Den 29: nečinnost by končila až dnem 43, ale relace je omezená dnem 30.
    const session = await t.prisma.session.findFirstOrThrow();
    expect(session.idleExpiresAt.getTime()).toBe(session.absoluteExpiresAt.getTime());
  });

  it('vypršená relace nejde obnovit refreshem', async () => {
    const cookie = await registerAndLogin(t, EMAIL);
    t.clock.advance(14 * DAY);
    expect((await post(t, '/auth/refresh', undefined, cookie)).status).toBe(401);
  });
});

describe('odhlášení', () => {
  it('logout zneplatní relaci a smaže cookie; je idempotentní', async () => {
    const cookie = await registerAndLogin(t, EMAIL);

    const res = await post(t, '/auth/logout', undefined, cookie);
    expect(res.status).toBe(204);
    expect(cookieValue(t, res)).toBe('');
    expect((await get(t, '/auth/me', cookie)).status).toBe(401);

    expect((await post(t, '/auth/logout', undefined, cookie)).status).toBe(204);
    expect((await post(t, '/auth/logout')).status).toBe(204);
    expect((await post(t, '/auth/logout', undefined, 'X'.repeat(43))).status).toBe(204);
  });

  it('logout zneplatní i token, který byl mezitím rotován', async () => {
    const original = await registerAndLogin(t, EMAIL);
    const rotated = cookieValue(t, await post(t, '/auth/refresh', undefined, original))!;

    await post(t, '/auth/logout', undefined, original);
    expect((await get(t, '/auth/me', rotated)).status).toBe(401);
  });

  it('logout-others zruší ostatní relace a ponechá aktuální', async () => {
    await registerUser(t, EMAIL);
    const a = (await login(t, EMAIL)).cookie!;
    const b = (await login(t, EMAIL)).cookie!;
    const c = (await login(t, EMAIL)).cookie!;

    expect((await post(t, '/auth/logout-others', undefined, a)).status).toBe(204);
    expect((await get(t, '/auth/me', a)).status).toBe(200);
    expect((await get(t, '/auth/me', b)).status).toBe(401);
    expect((await get(t, '/auth/me', c)).status).toBe(401);
  });

  it('logout-others se netýká relací jiného uživatele', async () => {
    const mine = await registerAndLogin(t, EMAIL);
    const other = await registerAndLogin(t, 'petr@example.cz');

    await post(t, '/auth/logout-others', undefined, mine);
    expect((await get(t, '/auth/me', other)).status).toBe(200);
  });
});

describe('health', () => {
  it('kontroluje databázi', async () => {
    const res = await get(t, '/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
