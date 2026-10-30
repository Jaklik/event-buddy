import { z } from 'zod';

const email = z.string().trim().toLowerCase().email().max(254);

// Délka hesla je shora omezená, aby se hašování nedalo zneužít k zahlcení serveru.
export const registerSchema = z
  .object({ email, password: z.string().min(10).max(128) })
  .strict();

// Při přihlášení se politika hesel neprozrazuje, jen horní limit.
export const loginSchema = z
  .object({ email, password: z.string().min(1).max(128) })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
