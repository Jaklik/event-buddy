import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { PasswordService } from '../src/auth/password.service';
import {
  ALLOWED_ORIGIN,
  BASE_TIME,
  MIN,
  PASSWORD,
  type TestApp,
  cookieValue,
  createTestApp,
  get,
  login,
  post,
  rawPost,
  registerAndLogin,
  registerUser,
  resetDb,
  setCookieLine,
} from './helpers';

const EMAIL = 'jana@example.cz';
const EVIL_ORIGIN = 'https://evil.example';

let t: TestApp;
beforeAll(async () => {
  t = await createTestApp();
});
afterAll(() => t.close());
beforeEach(async () => {
  await resetDb(t.prisma);
  t.clock.set(BASE_TIME);
});
afterEach(() => vi.restoreAllMocks());

describe('podvržené a neplatné tokeny', () => {
  it('žádný podvržený token neprojde a databáze zůstane celá', async () => {
    const valid = await registerAndLogin(t, EMAIL);
    const forged: Record<string, string> = {
      'náhodný 256bitový token': 'A'.repeat(43),
      'platný token se změněným posledním znakem': valid.slice(0, -1) + (valid.endsWith('A') ? 'B' : 'A'),
      'zkrácený platný token': valid.slice(0, 42),
      'prodloužený platný token': `${valid}A`,
      'platný token malými písmeny': valid.toLowerCase(),
      'SQL injection (uvozovka)': `' OR '1'='1`,
      'SQL injection (zrušení tabulky)': `'; DROP TABLE "Session"; --`,
      'JWT s alg none': 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxIiwiYWRtaW4iOnRydWV9.',
      'path traversal': '../../etc/passwd',
      'nulový bajt': 'abc%00def',
      'jen mezery': '   ',
      'velmi dlouhá hodnota (10 kB)': 'A'.repeat(10_000),
    };

    for (const [name, value] of Object.entries(forged)) {
      const res = await get(t, '/auth/me', value);
      expect(res.status, name).toBe(401);
      expect(res.body, name).toEqual({ message: 'unauthenticated' });
    }

    expect(await t.prisma.session.count()).toBe(1);
    expect((await get(t, '/auth/me', valid)).status).toBe(200);
  });

  it('token přijímá jen z cookie, ne z hlavičky ani z URL', async () => {
    const valid = await registerAndLogin(t, EMAIL);
    expect((await get(t, '/auth/me', undefined, { Authorization: `Bearer ${valid}` })).status).toBe(401);
    expect((await get(t, '/auth/me', undefined, { 'X-Session-Token': valid })).status).toBe(401);
    expect((await get(t, `/auth/me?${t.cfg.cookie.name}=${valid}`)).status).toBe(401);
  });

  it('token jiného uživatele nedává přístup k cizím datům', async () => {
    const a = await registerAndLogin(t, EMAIL);
    const b = await registerAndLogin(t, 'petr@example.cz');
    const meA = (await get(t, '/auth/me', a)).body.user;
    const meB = (await get(t, '/auth/me', b)).body.user;
    expect(meA.email).toBe(EMAIL);
    expect(meB.email).toBe('petr@example.cz');
    expect(meA.id).not.toBe(meB.id);
  });

  it('zrušená relace nejde oživit starým tokenem ani po čase', async () => {
    const cookie = await registerAndLogin(t, EMAIL);
    await post(t, '/auth/logout', undefined, cookie);
    t.clock.advance(5 * MIN);
    expect((await get(t, '/auth/me', cookie)).status).toBe(401);
    expect((await post(t, '/auth/refresh', undefined, cookie)).status).toBe(401);
  });
});

describe('CSRF a CORS', () => {
  it('změna stavu bez vlastní hlavičky je zamítnuta a nic se neprovede', async () => {
    await registerUser(t, EMAIL);

    const res = await rawPost(t, '/auth/login').send({ email: EMAIL, password: PASSWORD });
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: 'forbidden' });
    expect(setCookieLine(t, res)).toBeUndefined();
    expect(await t.prisma.session.count()).toBe(0);
  });

  it('cross-site HTML formulář (urlencoded) je zamítnut', async () => {
    const res = await rawPost(t, '/auth/login')
      .set('Origin', EVIL_ORIGIN)
      .type('form')
      .send({ email: EMAIL, password: PASSWORD });
    expect(res.status).toBe(403);
  });

  it('cizí Origin a Origin "null" jsou zamítnuty i s vlastní hlavičkou', async () => {
    await registerUser(t, EMAIL);
    for (const origin of [EVIL_ORIGIN, 'null', `${ALLOWED_ORIGIN}.evil.example`, 'http://localhost:3001']) {
      const res = await post(t, '/auth/login', { email: EMAIL, password: PASSWORD }, undefined, { Origin: origin });
      expect(res.status, origin).toBe(403);
    }
    expect(await t.prisma.session.count()).toBe(0);
  });

  it('povolený Origin s hlavičkou projde', async () => {
    await registerUser(t, EMAIL);
    const res = await post(t, '/auth/login', { email: EMAIL, password: PASSWORD }, undefined, { Origin: ALLOWED_ORIGIN });
    expect(res.status).toBe(200);
  });

  it('logout, refresh i logout-others vyžadují ochranu CSRF', async () => {
    const cookie = await registerAndLogin(t, EMAIL);
    for (const path of ['/auth/logout', '/auth/refresh', '/auth/logout-others']) {
      const res = await rawPost(t, path).set('Cookie', `${t.cfg.cookie.name}=${cookie}`);
      expect(res.status, path).toBe(403);
    }
    expect((await get(t, '/auth/me', cookie)).status).toBe(200);
  });

  it('cizí web nedostane povolení číst odpověď (CORS)', async () => {
    const cookie = await registerAndLogin(t, EMAIL);
    const read = await get(t, '/auth/me', cookie, { Origin: EVIL_ORIGIN });
    expect(read.headers['access-control-allow-origin']).toBeUndefined();

    const preflight = await request(t.app.getHttpServer())
      .options('/api/auth/login')
      .set('Origin', EVIL_ORIGIN)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type,x-sp-csrf');
    // Rozhoduje chybějící Allow-Origin: bez něj prohlížeč odpověď cizímu webu nevydá.
    expect(preflight.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('náš web dostane povolení s cookie a vlastní hlavičkou', async () => {
    const preflight = await request(t.app.getHttpServer())
      .options('/api/auth/login')
      .set('Origin', ALLOWED_ORIGIN)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type,x-sp-csrf');
    expect(preflight.headers['access-control-allow-origin']).toBe(ALLOWED_ORIGIN);
    expect(preflight.headers['access-control-allow-credentials']).toBe('true');
    expect(preflight.headers['access-control-allow-headers']).toMatch(/x-sp-csrf/i);
  });
});

describe('hlavičky odpovědí', () => {
  it('helmet: bezpečnostní hlavičky jsou nastavené a server neprozrazuje technologii', async () => {
    const res = await get(t, '/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['strict-transport-security']).toBeDefined();
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['x-frame-options']).toBeDefined();
    expect(res.headers['referrer-policy']).toBeDefined();
  });

  it('odpovědi identity se nesmí ukládat do cache', async () => {
    const { res, cookie } = await login(t, EMAIL).then(async () => {
      await registerUser(t, EMAIL);
      return login(t, EMAIL);
    });
    expect(res.headers['cache-control']).toBe('no-store');
    expect((await get(t, '/auth/me', cookie)).headers['cache-control']).toBe('no-store');
    expect((await get(t, '/auth/me')).headers['cache-control']).toBe('no-store'); // i chybová odpověď
    expect((await get(t, '/health')).headers['cache-control']).toBe('no-store');
  });
});

describe('validace vstupu', () => {
  const valid = { email: 'a@example.cz', password: PASSWORD };

  it('registrace nepřijme nadbytečná pole (mass assignment)', async () => {
    for (const extra of [{ role: 'admin' }, { isAdmin: true }, { status: 'ACTIVE' }, { emailVerifiedAt: '2026-01-01' }, { id: 'x' }]) {
      const res = await post(t, '/auth/register', { ...valid, ...extra });
      expect(res.status, JSON.stringify(extra)).toBe(400);
    }
    expect(await t.prisma.user.count()).toBe(0);
  });

  it('prototype pollution přes __proto__ je zamítnuta a nic neovlivní', async () => {
    const res = await post(t, '/auth/register', undefined, undefined, { 'Content-Type': 'application/json' }).send(
      '{"__proto__":{"admin":true},"email":"a@example.cz","password":"correct horse battery staple"}',
    );
    expect(res.status).toBe(400);
    expect(({} as Record<string, unknown>).admin).toBeUndefined();
  });

  it('hranice délky hesla: 9 znaků ne, 10 a 128 ano, 129 ne', async () => {
    expect((await post(t, '/auth/register', { ...valid, password: 'a'.repeat(9) })).status).toBe(400);
    expect((await post(t, '/auth/register', { email: 'x1@example.cz', password: 'a'.repeat(10) })).status).toBe(202);
    expect((await post(t, '/auth/register', { email: 'x2@example.cz', password: 'a'.repeat(128) })).status).toBe(202);
    expect((await post(t, '/auth/register', { email: 'x3@example.cz', password: 'a'.repeat(129) })).status).toBe(400);
    expect((await post(t, '/auth/login', { email: 'x3@example.cz', password: 'a'.repeat(129) })).status).toBe(400);
  });

  it('špatné typy a tvary vstupu jsou 400, ne 500', async () => {
    const bodies: unknown[] = [
      {},
      { email: valid.email },
      { password: PASSWORD },
      { email: ['a@example.cz'], password: PASSWORD },
      { email: { $ne: null }, password: PASSWORD },
      { email: valid.email, password: { $ne: null } },
      { email: valid.email, password: [PASSWORD] },
      { email: 123, password: PASSWORD },
      { email: null, password: null },
      { email: 'not-an-email', password: PASSWORD },
      { email: `${'a'.repeat(250)}@example.cz`, password: PASSWORD },
      { email: '', password: PASSWORD },
    ];
    for (const body of bodies) {
      for (const path of ['/auth/register', '/auth/login']) {
        const res = await post(t, path, body);
        expect(res.status, `${path} ${JSON.stringify(body)}`).toBe(400);
      }
    }
  });

  it('poškozený JSON a špatný Content-Type jsou 400 bez úniku interních detailů', async () => {
    const broken = await post(t, '/auth/login', undefined, undefined, { 'Content-Type': 'application/json' }).send('{"email":');
    expect(broken.status).toBe(400);
    expect(JSON.stringify(broken.body)).not.toMatch(/node_modules|at .*\(|SyntaxError|prisma/i);

    const text = await post(t, '/auth/login', undefined, undefined, { 'Content-Type': 'text/plain' }).send(JSON.stringify(valid));
    expect(text.status).toBe(400);
  });

  it('příliš velké tělo požadavku je odmítnuto', async () => {
    const res = await post(t, '/auth/login', { email: valid.email, password: 'a'.repeat(200_000) });
    expect(res.status).toBe(413);
  });

  it('SQL injection ve vstupech se bere jako běžný text a tabulky zůstanou', async () => {
    const sqlPassword = `' OR 1=1; DROP TABLE "User"; --`;
    const sqlEmail = `admin'--@example.cz`;

    expect((await post(t, '/auth/register', { email: `' OR '1'='1`, password: PASSWORD })).status).toBe(400);
    const reg = await post(t, '/auth/register', { email: sqlEmail, password: sqlPassword });
    expect([202, 400]).toContain(reg.status);
    if (reg.status === 202) {
      expect((await t.prisma.user.findUniqueOrThrow({ where: { email: sqlEmail } })).email).toBe(sqlEmail);
      expect((await login(t, sqlEmail, sqlPassword)).res.status).toBe(200);
    }

    const password = await post(t, '/auth/register', { email: 'jana@example.cz', password: sqlPassword });
    expect(password.status).toBe(202);
    expect((await login(t, 'jana@example.cz', sqlPassword)).res.status).toBe(200);
    expect(await t.prisma.user.count()).toBeGreaterThanOrEqual(1);
  });
});

describe('výčet účtů (enumeration)', () => {
  // Datum a počítadla rate limitu se mezi dvěma požadavky liší vždy, nejsou to informace o účtu.
  const strip = (res: request.Response) => {
    const headers = Object.fromEntries(
      Object.entries(res.headers).filter(([name]) => name !== 'date' && !name.startsWith('x-ratelimit-')),
    );
    return { status: res.status, body: res.body, headers };
  };

  it('přihlášení: odpověď pro existující a neexistující účet je shodná včetně hlaviček', async () => {
    await registerUser(t, EMAIL);
    const known = await login(t, EMAIL, 'definitely-wrong-password');
    const unknown = await login(t, 'nikdo@example.cz', 'definitely-wrong-password');
    expect(strip(known.res)).toEqual(strip(unknown.res));
  });

  it('registrace: odpověď pro nový i existující e-mail je shodná včetně hlaviček', async () => {
    const fresh = await post(t, '/auth/register', { email: EMAIL, password: PASSWORD });
    const duplicate = await post(t, '/auth/register', { email: EMAIL, password: PASSWORD });
    expect(strip(fresh)).toEqual(strip(duplicate));
    expect(setCookieLine(t, fresh)).toBeUndefined();
    expect(setCookieLine(t, duplicate)).toBeUndefined();
  });

  it('doba odpovědi se vyrovnává: neexistující i zamčený účet projdou ověřením proti falešnému hashi', async () => {
    const dummy = vi.spyOn(PasswordService.prototype, 'verifyDummy');
    await registerUser(t, EMAIL);

    await login(t, 'nikdo@example.cz', 'definitely-wrong-password');
    expect(dummy).toHaveBeenCalledTimes(1);

    await login(t, EMAIL, 'definitely-wrong-password'); // existující účet: skutečné ověření
    await login(t, EMAIL, PASSWORD);
    expect(dummy).toHaveBeenCalledTimes(1);

    for (let i = 0; i < 5; i++) await login(t, EMAIL, 'definitely-wrong-password');
    dummy.mockClear();
    await login(t, EMAIL, PASSWORD); // zamčený účet
    expect(dummy).toHaveBeenCalledTimes(1);
  });

  it('registrace hašuje heslo i pro už existující e-mail', async () => {
    await registerUser(t, EMAIL);
    const hash = vi.spyOn(PasswordService.prototype, 'hash');
    await post(t, '/auth/register', { email: EMAIL, password: PASSWORD });
    expect(hash).toHaveBeenCalledTimes(1);
  });
});

describe('uložená data a audit', () => {
  it('v DB není ani token, ani heslo v čitelné podobě', async () => {
    const cookie = await registerAndLogin(t, EMAIL);
    await post(t, '/auth/refresh', undefined, cookie);
    await post(t, '/auth/logout', undefined, cookie);
    await login(t, EMAIL, 'definitely-wrong-password');

    const dump = JSON.stringify({
      users: await t.prisma.user.findMany(),
      identities: await t.prisma.authIdentity.findMany(),
      sessions: await t.prisma.session.findMany(),
      tokens: await t.prisma.sessionToken.findMany(),
      events: await t.prisma.authEvent.findMany(),
    });
    expect(dump).not.toContain(cookie);
    expect(dump).not.toContain(PASSWORD);
    expect(dump).not.toContain('definitely-wrong-password');
  });

  it('bezpečnostní události se zapisují: registrace, přihlášení, selhání, odhlášení', async () => {
    const cookie = await registerAndLogin(t, EMAIL);
    await login(t, EMAIL, 'definitely-wrong-password');
    await post(t, '/auth/logout', undefined, cookie);

    const types = (await t.prisma.authEvent.findMany({ orderBy: { createdAt: 'asc' } })).map((e) => e.type);
    expect(types).toEqual(expect.arrayContaining(['register_success', 'login_success', 'login_failure', 'logout']));
  });

  it('User-Agent se ukládá zkrácený na 255 znaků', async () => {
    await registerUser(t, EMAIL);
    await post(t, '/auth/login', { email: EMAIL, password: PASSWORD }, undefined, { 'User-Agent': 'A'.repeat(5000) });
    expect((await t.prisma.session.findFirstOrThrow()).userAgent).toHaveLength(255);
  });

  it('chybové odpovědi neobsahují stopu zásobníku', async () => {
    const res = await get(t, '/neexistuje');
    expect(res.status).toBe(404);
    expect(JSON.stringify(res.body)).not.toMatch(/node_modules|stack|prisma/i);
  });
});

describe('fixace relace', () => {
  it('útočníkem zvolená hodnota cookie se po přihlášení neuplatní', async () => {
    await registerUser(t, EMAIL);
    const fixed = 'F'.repeat(43);
    const { res, cookie } = await login(t, EMAIL, PASSWORD, fixed);

    expect(res.status).toBe(200);
    expect(cookie).not.toBe(fixed);
    expect((await get(t, '/auth/me', fixed)).status).toBe(401);
    expect((await get(t, '/auth/me', cookie)).status).toBe(200);
  });
});

describe('cookie s příznakem Secure (produkční nastavení)', () => {
  let secure: TestApp;
  beforeAll(async () => {
    secure = await createTestApp({ cookie: { secure: true, name: '__Host-sp_session' } });
  });
  afterAll(() => secure.close());

  it('má prefix __Host-, Secure, HttpOnly, SameSite=Lax a bez Domain', async () => {
    await resetDb(secure.prisma);
    await registerUser(secure, EMAIL);
    const { res } = await login(secure, EMAIL);
    const line = setCookieLine(secure, res)!;
    expect(line).toMatch(/^__Host-sp_session=/);
    expect(line).toMatch(/; Secure/i);
    expect(line).toMatch(/HttpOnly/i);
    expect(line).toMatch(/SameSite=Lax/i);
    expect(line).toMatch(/Path=\//);
    expect(line).not.toMatch(/Domain=/i);
  });

  it('smazání cookie při odhlášení používá stejné atributy', async () => {
    await resetDb(secure.prisma);
    const cookie = await registerAndLogin(secure, EMAIL);
    const res = await post(secure, '/auth/logout', undefined, cookie);
    const line = setCookieLine(secure, res)!;
    expect(cookieValue(secure, res)).toBe('');
    expect(line).toMatch(/; Secure/i);
    expect(line).toMatch(/Path=\//);
  });
});

describe('omezení počtu požadavků', () => {
  it('přihlášení: po 3 pokusech za minutu přijde 429, i se správným heslem', async () => {
    const limited = await createTestApp({ rateLimit: { authPerMin: 3 } });
    try {
      await resetDb(limited.prisma);
      await registerUser(limited, EMAIL);
      for (let i = 0; i < 2; i++) expect((await login(limited, EMAIL, 'definitely-wrong-password')).res.status).toBe(401);
      expect((await login(limited, EMAIL, 'definitely-wrong-password')).res.status).toBe(401);

      const blocked = await login(limited, EMAIL, PASSWORD);
      expect(blocked.res.status).toBe(429);
      expect(blocked.cookie).toBeUndefined();
      // U pojmenovaných limitů má hlavička příponu (retry-after-auth).
      expect(Object.keys(blocked.res.headers).some((h) => h.startsWith('retry-after'))).toBe(true);
      expect((await get(limited, '/health')).status).toBe(200); // ostatní routy nejsou dotčené
    } finally {
      await limited.close();
    }
  });

  it('registrace má vlastní limit', async () => {
    const limited = await createTestApp({ rateLimit: { authPerMin: 3 } });
    try {
      await resetDb(limited.prisma);
      for (let i = 0; i < 3; i++) {
        expect((await post(limited, '/auth/register', { email: `u${i}@example.cz`, password: PASSWORD })).status).toBe(202);
      }
      expect((await post(limited, '/auth/register', { email: 'u9@example.cz', password: PASSWORD })).status).toBe(429);
    } finally {
      await limited.close();
    }
  });

  it('podvržená hlavička X-Forwarded-For limit neobejde, pokud proxy není důvěryhodná', async () => {
    const limited = await createTestApp({ rateLimit: { authPerMin: 3 }, trustProxy: 0 });
    try {
      await resetDb(limited.prisma);
      const statuses: number[] = [];
      for (let i = 0; i < 6; i++) {
        const res = await post(limited, '/auth/login', { email: EMAIL, password: PASSWORD }, undefined, {
          'X-Forwarded-For': `203.0.113.${i + 1}`,
        });
        statuses.push(res.status);
      }
      expect(statuses.slice(3)).toEqual([429, 429, 429]);
    } finally {
      await limited.close();
    }
  });

  it('za důvěryhodnou proxy se limit počítá podle skutečné IP klienta', async () => {
    const limited = await createTestApp({ rateLimit: { authPerMin: 3 }, trustProxy: 1 });
    try {
      await resetDb(limited.prisma);
      const statuses: number[] = [];
      for (let i = 0; i < 6; i++) {
        const res = await post(limited, '/auth/login', { email: EMAIL, password: PASSWORD }, undefined, {
          'X-Forwarded-For': `203.0.113.${i + 1}`,
        });
        statuses.push(res.status);
      }
      expect(statuses).not.toContain(429); // každá IP má vlastní počítadlo
    } finally {
      await limited.close();
    }
  });

  it('globální limit chrání všechny routy', async () => {
    const limited = await createTestApp({ rateLimit: { globalPerMin: 5 } });
    try {
      const statuses: number[] = [];
      for (let i = 0; i < 7; i++) statuses.push((await get(limited, '/health')).status);
      expect(statuses).toEqual([200, 200, 200, 200, 200, 429, 429]);
    } finally {
      await limited.close();
    }
  });
});
