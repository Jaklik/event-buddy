import { createHash, randomBytes } from 'node:crypto';

// Neprůhledný token: 256 bitů z CSPRNG. V DB se ukládá jen SHA-256 hash, takže únik DB tokeny neprozradí.
export function generateToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
