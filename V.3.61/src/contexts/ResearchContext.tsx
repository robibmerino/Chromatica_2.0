import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { researchClient, hasConsent, hasDeclined, giveConsent, setDeclined, clearDeclined, revokeConsent } from '../lib/researchClient';

interface ResearchContextValue {
  consentGiven: boolean;
  consentDeclined: boolean;
  isConfigured: boolean;
  acceptConsent: (demographics?: { age_range?: string; gender?: string; is_upv_student?: boolean; design_career?: string }, userId?: string) => Promise<{ error: Error | null }>;
  declineConsent: () => void;
  revokeConsent: () => Promise<void>;
}

const ResearchContext = createContext<ResearchContextValue | null>(null);

export function ResearchProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? '';

  const [consentGiven, setConsentGiven] = useState(() => hasConsent(userId));
  const [consentDeclined, setConsentDeclined] = useState(() => hasDeclined(userId));

  useEffect(() => {
    setConsentGiven(hasConsent(userId));
    setConsentDeclined(hasDeclined(userId));
  }, [userId]);

  const acceptConsent = useCallback(
    async (
      demographics?: { age_range?: string; gender?: string; is_upv_student?: boolean; design_career?: string },
      consentUserId?: string
    ) => {
      const uid = consentUserId ?? userId;
      const { error } = await giveConsent(demographics, uid || undefined);
      setConsentGiven(true);
      if (uid && typeof window !== 'undefined') {
        clearDeclined(uid);
      }
      return { error };
    },
    [userId]
  );

  const declineConsent = useCallback(() => {
    if (userId) {
      setDeclined(userId);
    } else if (typeof window !== 'undefined') {
      localStorage.setItem('chromatica_research_declined', '1');
    }
    setConsentDeclined(true);
  }, [userId]);

  const revokeConsentCallback = useCallback(async () => {
    await revokeConsent(userId || undefined);
    setConsentGiven(false);
  }, [userId]);

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
