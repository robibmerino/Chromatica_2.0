/**
 * Allowlist para la sección "Análisis investigación" (export Excel).
 * Solo los emails listados pueden ver y usar esa vista.
 */

const ADMIN_EMAILS_ENV = import.meta.env.VITE_RESEARCH_ADMIN_EMAILS as string | undefined;

/** Lista de emails permitidos (separados por coma en env). Por defecto solo robi20leoc@gmail.com. */
function getAdminEmails(): string[] {
  if (!ADMIN_EMAILS_ENV || typeof ADMIN_EMAILS_ENV !== 'string') {
    return ['robi20leoc@gmail.com'];
  }
  return ADMIN_EMAILS_ENV.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
}

let cached: string[] | null = null;

export function getResearchAdminEmails(): string[] {
  if (cached === null) cached = getAdminEmails();
  return cached;
}

export function isResearchAdmin(userEmail: string | undefined): boolean {
  if (!userEmail) return false;
  return getResearchAdminEmails().includes(userEmail.trim().toLowerCase());
}
