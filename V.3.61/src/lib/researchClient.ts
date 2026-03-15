/**
 * Cliente de investigaci?n UPV: identificador an?nimo y consentimiento sociodemogr?fico.
 * Guarda en localStorage por usuario (multi-cuenta mismo navegador) y sincroniza
 * a la tabla research_demographics en Supabase.
 */

import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_ANONYMOUS_ID = 'chromatica_research_anonymous_id';
const STORAGE_CONSENT = 'chromatica_research_consent';
const STORAGE_CONSENT_DECLINED = 'chromatica_research_declined';
const STORAGE_DEMOGRAPHICS = 'chromatica_research_demographics';

export type StoredDemographics = {
  age_range?: string;
  gender?: string;
  design_career?: string;
  is_upv_student?: boolean;
};

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

function getConsentMap(): Record<string, true> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_CONSENT);
    if (!raw) return {};
    if (raw === '1') return {};
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) return parsed as Record<string, true>;
    return {};
  } catch {
    const raw = localStorage.getItem(STORAGE_CONSENT);
    if (raw && raw !== '1' && /^[0-9a-f-]{36}$/i.test(raw)) return { [raw]: true };
    return {};
  }
}

/**
 * Indica si este usuario ha dado consentimiento.
 * Soporta multi-cuenta: consent por userId. Legacy: stored === '1' o un solo UUID (ese usuario).
 */
export function hasConsent(userId?: string): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(STORAGE_CONSENT);
  if (stored === '1') return true;
  if (userId && stored === userId) return true;
  if (userId) return getConsentMap()[userId] === true;
  return false;
}

/**
 * Marca consentimiento y guarda sociodemogr?ficos para este userId.
 * Consent y demographics se guardan por usuario (varias cuentas en el mismo navegador).
 */
export async function giveConsent(
  demographics?: StoredDemographics,
  userId?: string
): Promise<{ error: Error | null }> {
  if (typeof window !== 'undefined') {
    const consentMap = getConsentMap();
    if (userId) {
      consentMap[userId] = true;
      try {
        localStorage.setItem(STORAGE_CONSENT, JSON.stringify(consentMap));
      } catch {
        /* ignore */
      }
    } else {
      localStorage.setItem(STORAGE_CONSENT, '1');
    }
    if (demographics && Object.keys(demographics).some((k) => demographics[k as keyof StoredDemographics] != null)) {
      try {
        const raw = localStorage.getItem(STORAGE_DEMOGRAPHICS);
        let map: Record<string, StoredDemographics> = {};
        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
            const hasUserIdKeys = Object.keys(parsed).some((k) => /^[0-9a-f-]{36}$/i.test(k));
            if (hasUserIdKeys) map = parsed as Record<string, StoredDemographics>;
            else map = { __legacy: parsed as StoredDemographics };
          }
        }
        if (userId) {
          map[userId] = demographics;
        } else if (map.__legacy) {
          map.__legacy = demographics;
        } else {
          map = { __legacy: demographics };
        }
        localStorage.setItem(STORAGE_DEMOGRAPHICS, JSON.stringify(map));
      } catch {
        /* ignore */
      }
    }
  }
  return { error: null };
}

function getDeclinedMap(): Record<string, true> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_CONSENT_DECLINED);
    if (!raw) return {};
    if (raw === '1') return {};
    const parsed = JSON.parse(raw) as unknown;
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? (parsed as Record<string, true>) : {};
  } catch {
    const raw = localStorage.getItem(STORAGE_CONSENT_DECLINED);
    return raw && raw !== '1' ? {} : {};
  }
}

/** Indica si este usuario ha rechazado. Multi-cuenta: declined por userId. Legacy: stored === userId. */
export function hasDeclined(userId?: string): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(STORAGE_CONSENT_DECLINED);
  if (stored === '1') return true;
  if (userId && stored === userId) return true;
  if (userId) return getDeclinedMap()[userId] === true;
  return false;
}

/** Marca que este usuario ha rechazado (multi-cuenta). */
export function setDeclined(userId: string): void {
  if (typeof window !== 'undefined') {
    const map = getDeclinedMap();
    map[userId] = true;
    try {
      localStorage.setItem(STORAGE_CONSENT_DECLINED, JSON.stringify(map));
    } catch {
      localStorage.setItem(STORAGE_CONSENT_DECLINED, userId);
    }
  }
}

/** Quita el rechazo de este usuario (al dar consentimiento). */
export function clearDeclined(userId: string): void {
  if (typeof window === 'undefined') return;
  const map = getDeclinedMap();
  delete map[userId];
  if (Object.keys(map).length === 0) {
    localStorage.removeItem(STORAGE_CONSENT_DECLINED);
  } else {
    try {
      localStorage.setItem(STORAGE_CONSENT_DECLINED, JSON.stringify(map));
    } catch {
      /* ignore */
    }
  }
}

/** Revoca consentimiento (local) para este usuario. */
export async function revokeConsent(userId?: string): Promise<void> {
  if (typeof window !== 'undefined') {
    if (userId) {
      const map = getConsentMap();
      delete map[userId];
      if (Object.keys(map).length === 0) localStorage.removeItem(STORAGE_CONSENT);
      else localStorage.setItem(STORAGE_CONSENT, JSON.stringify(map));
    } else {
      localStorage.removeItem(STORAGE_CONSENT);
    }
  }
}

/** Tipo de payload para creaciones. */
export type ResearchCreationPayload = Record<string, unknown>;

/**
 * Demogr?ficos guardados para un usuario.
 * @param userId - Si se pasa, devuelve los de ese usuario (multi-cuenta). Sin userId, devuelve legacy blob si existe.
 */
export function getStoredDemographics(userId?: string): StoredDemographics | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_DEMOGRAPHICS);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
    const map = parsed as Record<string, StoredDemographics>;
    if (userId && map[userId]) return map[userId];
    if (map.__legacy) return map.__legacy;
    if (userId) return null;
    const firstKey = Object.keys(map).find((k) => map[k] && typeof (map[k] as StoredDemographics).age_range !== 'undefined');
    return firstKey ? map[firstKey] ?? null : null;
  } catch {
    return null;
  }
}

/** Sincroniza sociodemogr?ficas a Supabase (tabla research_demographics). */
export async function syncDemographicsToSupabase(
  userId: string,
  demographics: StoredDemographics | null
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
  clearDeclined,
  revokeConsent,
  getStoredDemographics,
  syncDemographicsToSupabase,
  isConfigured: isSupabaseConfigured,
};
