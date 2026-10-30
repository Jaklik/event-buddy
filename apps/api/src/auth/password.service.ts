import { Inject, Injectable } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';
import { APP_CONFIG, type AppConfig } from '../config/app-config';

// Argon2id (výchozí algoritmus knihovny) s parametry z konfigurace.
@Injectable()
export class PasswordService {
  private readonly options: { memoryCost: number; timeCost: number; parallelism: number };
  private dummyHash?: Promise<string>;

  constructor(@Inject(APP_CONFIG) cfg: AppConfig) {
    this.options = { ...cfg.argon2 };
  }

  hash(password: string): Promise<string> {
    return hash(password, this.options);
  }

  async verify(passwordHash: string, password: string): Promise<boolean> {
    try {
      return await verify(passwordHash, password);
    } catch {
      // Poškozený hash nesmí shodit požadavek ani prozradit stav účtu.
      return false;
    }
  }

  // Ověření proti nepoužitelnému hashi. Vyrovnává dobu odpovědi u neexistujícího nebo zamčeného účtu.
  async verifyDummy(password: string): Promise<void> {
    this.dummyHash ??= this.hash('timing-equalisation-only');
    await this.verify(await this.dummyHash, password);
  }
}
