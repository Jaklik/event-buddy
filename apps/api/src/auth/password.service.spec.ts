import { describe, expect, it } from 'vitest';
import type { AppConfig } from '../config/app-config';
import { PasswordService } from './password.service';

const cfg = { argon2: { memoryCost: 8, timeCost: 1, parallelism: 1 } } as AppConfig;
const service = new PasswordService(cfg);

describe('PasswordService', () => {
  it('vytváří hash Argon2id s parametry z konfigurace', async () => {
    const hash = await service.hash('correct horse battery staple');
    expect(hash).toMatch(/^\$argon2id\$v=19\$m=8,t=1,p=1\$/);
  });

  it('hash neobsahuje heslo a pro stejné heslo je pokaždé jiný (sůl)', async () => {
    const a = await service.hash('correct horse battery staple');
    const b = await service.hash('correct horse battery staple');
    expect(a).not.toContain('correct horse');
    expect(a).not.toBe(b);
  });

  it('ověří správné heslo a odmítne špatné', async () => {
    const hash = await service.hash('s3cret-passphrase');
    await expect(service.verify(hash, 's3cret-passphrase')).resolves.toBe(true);
    await expect(service.verify(hash, 's3cret-passphrasE')).resolves.toBe(false);
    await expect(service.verify(hash, '')).resolves.toBe(false);
  });

  it('poškozený nebo cizí hash vrací false a nevyhazuje chybu', async () => {
    await expect(service.verify('not-a-hash', 'x')).resolves.toBe(false);
    await expect(service.verify('', 'x')).resolves.toBe(false);
    await expect(service.verify('$argon2id$v=19$m=8,t=1,p=1$bad$bad', 'x')).resolves.toBe(false);
  });

  it('verifyDummy doběhne bez chyby', async () => {
    await expect(service.verifyDummy('cokoliv')).resolves.toBeUndefined();
  });
});
