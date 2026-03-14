import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { researchClient, hasConsent, giveConsent, revokeConsent } from '../lib/researchClient';

const STORAGE_CONSENT_DECLINED = 'chromatica_research_declined';

interface ResearchContextValue {
  consentGiven: boolean;
  consentDeclined: boolean;
  isConfigured: boolean;
  acceptConsent: (demographics?: { age_range?: string; gender?: string; is_upv_student?: boolean; design_career?: string }) => Promise<{ error: Error | null }>;
  declineConsent: () => void;
  revokeConsent: () => Promise<void>;
}

const ResearchContext = createContext<ResearchContextValue | null>(null);

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [consentGiven, setConsentGiven] = useState(hasConsent());
  const [consentDeclined, setConsentDeclined] = useState(
    typeof window !== 'undefined' && localStorage.getItem(STORAGE_CONSENT_DECLINED) === '1'
  );

  const acceptConsent = useCallback(
    async (demographics?: { age_range?: string; gender?: string; is_upv_student?: boolean; design_career?: string }) => {
      const { error } = await giveConsent(demographics);
      setConsentGiven(true);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_CONSENT_DECLINED);
      }
      return { error };
    },
    []
  );

  const declineConsent = useCallback(() => {
    setConsentDeclined(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CONSENT_DECLINED, '1');
    }
  }, []);

  const revokeConsentCallback = useCallback(async () => {
    await revokeConsent();
    setConsentGiven(false);
  }, []);

  const value: ResearchContextValue = {
    consentGiven,
    consentDeclined,
    isConfigured: researchClient.isConfigured(),
    acceptConsent,
    declineConsent,
    revokeConsent: revokeConsentCallback,
  };

  return (
    <ResearchContext.Provider value={value}>{children}</ResearchContext.Provider>
  );
}

export function useResearch(): ResearchContextValue {
  const ctx = useContext(ResearchContext);
  if (!ctx) throw new Error('useResearch debe usarse dentro de ResearchProvider');
  return ctx;
}
