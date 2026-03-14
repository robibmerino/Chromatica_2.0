/**
 * Cliente de investigación UPV: identificador anónimo y consentimiento sociodemográfico.
 * Guarda en localStorage y, si hay tabla research_demographics en Supabase, sincroniza
 * sociodemográficas de usuarios registrados (por user_id).
 */

import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_ANONYMOUS_ID = 'chromatica_research_anonymous_id';
const STORAGE_CONSENT = 'chromatica_research_consent';
const STORAGE_DEMOGRAPHICS = 'chromatica_research_demographics';

function generateAnonymousId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Obtiene o crea el identificador anónimo (persistido en localStorage). */
export function getAnonymousId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(STORAGE_ANONYMOUS_ID);
  if (!id) {
    id = generateAnonymousId();
    localStorage.setItem(STORAGE_ANONYMOUS_ID, id);
  }
  return id;
}

/** Indica si el usuario ha dado consentimiento (guardado en localStorage tras aceptar). */
export function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_CONSENT) === '1';
}

/** Marca consentimiento y guarda sociodemográficos en localStorage. SyncDemographics los envía a research_demographics al iniciar sesión. */
export async function giveConsent(demographics?: {
  age_range?: string;
  gender?: string;
  is_upv_student?: boolean;
  design_career?: string;
}): Promise<{ error: Error | null }> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_CONSENT, '1');
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

/** Revoca consentimiento (local). */
export async function revokeConsent(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_CONSENT);
  }
}

/** Tipo de payload para creaciones (por si se reutiliza en la futura tabla de sociodemográficas). */
export type ResearchCreationPayload = Record<string, unknown>;

/** Demográficos guardados en localStorage (para cuando exista tabla de recolección en Supabase). */
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

/** Sincroniza sociodemográficas a Supabase (tabla research_demographics). Solo si está configurado y hay datos. */
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
  giveConsent,
  revokeConsent,
  getStoredDemographics,
  syncDemographicsToSupabase,
  isConfigured: isSupabaseConfigured,
};
