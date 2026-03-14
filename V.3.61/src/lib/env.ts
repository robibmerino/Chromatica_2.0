import { z } from 'zod';

/**
 * Esquema de variables de entorno (Vite expone solo las que empiezan por VITE_).
 * Supabase es opcional: si faltan URL o key, la app funciona sin cuenta/paletas en nube.
 */
const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
});

const raw = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

const parsed = envSchema.safeParse(raw);

export type Env = z.infer<typeof envSchema>;

/** Variables de entorno validadas. Si no pasan validación, se usan valores por defecto seguros. */
export const env: Env = parsed.success
  ? parsed.data
  : {
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: '',
    };

/** Para uso en desarrollo: avisar si se esperaba Supabase y faltan variables. */
export function getSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = (env.VITE_SUPABASE_URL ?? '').trim();
  const anonKey = (env.VITE_SUPABASE_ANON_KEY ?? '').trim();
  if (url && anonKey) return { url, anonKey };
  return null;
}
