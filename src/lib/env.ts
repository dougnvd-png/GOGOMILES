import { z } from 'zod';

const optionalText = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().optional(),
);

const envSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: optionalText,
  CLERK_SECRET_KEY: optionalText,
  DATABASE_URL: optionalText.refine(
    (value) => value === undefined || /^postgres(ql)?:\/\//.test(value),
    'deve começar com postgresql://',
  ),
  RESEND_API_KEY: optionalText,
  EMAIL_FROM: optionalText,
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
});

if (!parsed.success) {
  const names = parsed.error.issues
    .map((issue) => `${issue.path.join('.')} ${issue.message}`)
    .join('; ');
  throw new Error(`Confira o arquivo .env.local: ${names}`);
}

export const env = parsed.data;

export const isAuthConfigured = () =>
  Boolean(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && env.CLERK_SECRET_KEY);

export const isDatabaseConfigured = () => Boolean(env.DATABASE_URL);

export const isEmailConfigured = () => Boolean(env.RESEND_API_KEY);

export const isDemoMode = () => !isAuthConfigured() && !isDatabaseConfigured();
