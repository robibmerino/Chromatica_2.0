/**
 * Cliente de investigaci?n UPV: identificador an?nimo y consentimiento sociodemogr?fico.
 * Guarda en localStorage y, si hay tabla research_demographics en Supabase, sincroniza
 * sociodemogr?ficas de usuarios registrados (por user_id).
 */

import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_ANONYMOUS_ID = 'chromatica_research_anonymous_id';
const STORAGE_CONSENT = 'chromatica_research_consent';
const STORAGE_CONSENT_DECLINED = 'chromatica_research_declined';
const STORAGE_DEMOGRAPHICS = 'chromatica_research_demographics';

function generateAnonymousId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Obtiene o crea el identificador an?nimo (persistido en localStorage). */
export function getAnonymousId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(STORAGE_ANONYMOUS_ID);
  if (!id) {
    id = generateAnonymousId();
    localStorage.setItem(STORAGE_ANONYMOUS_ID, id);
  }
  return id;
}

/**
 * Indica si el usuario ha dado consentimiento.
 * Cuentas existentes con consentimiento (por userId o legacy '1') no ven el gate.
 *
 * @param userId - Si se pasa, se comprueba consentimiento de ese usuario (permite varios accounts en el mismo navegador).
 *                 stored === '1' (legacy) cuenta como consentido para cualquier usuario.
 *                 Sin userId se comprueba solo el valor antiguo '1'.
 */
export function hasConsent(userId?: string): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(STORAGE_CONSENT);
  if (userId) return stored === userId || stored === '1';
  return stored === '1';
}

/**
 * Marca consentimiento y guarda sociodemogr?ficos.
 * @param userId - Si se pasa, el consentimiento queda asociado a ese usuario (recomendado para OAuth/multi-cuenta).
 */
export async function giveConsent(
  demographics?: {
    age_range?: string;
    gender?: string;
    is_upv_student?: boolean;
    design_career?: string;
  },
  userId?: string
): Promise<{ error: Error | null }> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_CONSENT, userId ?? '1');
    if (demographics && Object.keys(demographics).some((k) => demographics[k as keyof typeof demographics] != null)) {
      try {
        localStorage.setItem(STORAGE_DEMOGRAPHICS, JSON.stringify(demographics));
      } catch {
        /* ignore */
      }
    }
  }
  return { error: null };
}

/**
 * Indica si este usuario ha rechazado participar (por userId para multi-cuenta).
 * Solo se considera rechazo para ese user id (stored === userId), as? las cuentas
 * existentes que ya rechazaron no vuelven a ver el gate.
 */
export function hasDeclined(userId?: string): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(STORAGE_CONSENT_DECLINED);
  if (userId) return stored === userId;
  return stored === '1';
}

/** Marca que este usuario ha rechazado (guardar por userId para no bloquear otras cuentas). */
export function setDeclined(userId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_CONSENT_DECLINED, userId);
  }
}

/** Revoca consentimiento (local). */
export async function revokeConsent(userId?: string): Promise<void> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_CONSENT);
    if (userId && stored !== userId) return;
    localStorage.removeItem(STORAGE_CONSENT);
  }
}

/** Tipo de payload para creaciones (por si se reutiliza en la futura tabla de sociodemogr?ficas). */
export type ResearchCreationPayload = Record<string, unknown>;

/** Demogr?ficos guardados en localStorage (para cuando exista tabla de recolecci?n en Supabase). */
export function getStoredDemographics(): {
  age_range?: string;
  gender?: string;
  design_career?: string;
  is_upv_student?: boolean;
} | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_DEMOGRAPHICS);
    if (!raw) return null;
    return JSON.parse(raw) as ReturnType<typeof getStoredDemographics>;
  } catch {
    return null;
  }
}

/** Sincroniza sociodemogr?ficas a Supabase (tabla research_demographics). Solo si est? configurado y hay datos. */
export async function syncDemographicsToSupabase(
  userId: string,
  demographics: ReturnType<typeof getStoredDemographics>
): Promise<void> {
  if (!isSupabaseConfigured() || !supabase || !demographics) return;
  await supabase.from('research_demographics').upsert(
    {
      user_id: userId,
      age_range: demographics.age_range ?? null,
      gender: demographics.gender ?? null,
      design_career: demographics.design_career ?? null,
      is_upv_student: demographics.is_upv_student ?? null,
      consented_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
}

export const researchClient = {
  getAnonymousId,
  hasConsent,
  hasDeclined,
  giveConsent,
  setDeclined,
  revokeConsent,
  getStoredDemographics,
  syncDemographicsToSupabase,
  isConfigured: isSupabaseConfigured,
};
