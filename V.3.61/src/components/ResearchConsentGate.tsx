import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useResearch } from '../contexts/ResearchContext';
import { getSupabaseConfig } from '../lib/env';
import { deleteUserAfterDecline } from '../lib/deleteUserAfterDecline';
import ChromaticaLogo from './ChromaticaLogo';
import { ParticleBackground } from './ParticleBackground';

const AGE_RANGES = [
  { value: '', label: 'Seleccionar edad' },
  { value: '18-25', label: '18-25' },
  { value: '26-35', label: '26-35' },
  { value: '36-45', label: '36-45' },
  { value: '46-55', label: '46-55' },
  { value: '55+', label: '55 o más' },
];

const GENDERS = [
  { value: '', label: 'Seleccionar' },
  { value: 'female', label: 'Mujer' },
  { value: 'male', label: 'Hombre' },
  { value: 'non_binary', label: 'No binario' },
  { value: 'other', label: 'Otro' },
];

const DESIGN_CAREERS = [
  { value: '', label: 'Seleccionar área' },
  { value: 'graphic_design', label: 'Diseño gráfico' },
  { value: 'product_design', label: 'Diseño de producto' },
  { value: 'interior_design', label: 'Diseño de interiores' },
  { value: 'fashion_design', label: 'Diseño de moda' },
  { value: 'ux_ui', label: 'Diseño UX/UI' },
  { value: 'architecture', label: 'Arquitectura' },
  { value: 'fine_arts', label: 'Bellas artes' },
  { value: 'communication', label: 'Comunicación / Audiovisual' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other_design', label: 'Otra (diseño)' },
  { value: 'other', label: 'Otra (no diseño)' },
];

/**
 * Pantalla que obliga a aceptar o declinar la investigación al entrar por OAuth (sin cuenta previa).
 * SyncDemographics enviará los datos a research_demographics cuando haya sesión.
 */
export function ResearchConsentGate() {
  const { session, signOut } = useAuth();
  const { acceptConsent, declineConsent } = useResearch();
  const [researchParticipate, setResearchParticipate] = useState(false);
  const [researchAge, setResearchAge] = useState('');
  const [researchGender, setResearchGender] = useState('');
  const [researchDesignCareer, setResearchDesignCareer] = useState('');
  const [researchIsUpvStudent, setResearchIsUpvStudent] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDecline = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    const config = getSupabaseConfig();
    if (config?.url && session?.access_token) {
      const { error: err } = await deleteUserAfterDecline(config.url, session.access_token);
      if (err) {
        setError(err);
        setSubmitting(false);
        return;
      }
    }
    declineConsent();
    await signOut();
    setSubmitting(false);
  }, [session?.access_token, declineConsent, signOut]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!researchParticipate) return;
      setSubmitting(true);
      setError(null);
      const { error: err } = await acceptConsent({
        age_range: researchAge || undefined,
        gender: researchGender || undefined,
        design_career: researchDesignCareer || undefined,
        is_upv_student: researchIsUpvStudent ?? undefined,
      });
      setSubmitting(false);
      if (err) setError(err.message);
    },
    [researchParticipate, researchAge, researchGender, researchDesignCareer, researchIsUpvStudent, acceptConsent]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative">
      <ParticleBackground particleCount={120} showOrbs opacityScale={0.85} />
      <header className="relative z-10 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-md sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-5 flex justify-center">
          <ChromaticaLogo size="xl" showSubtitle />
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-xl font-semibold text-white mb-1">Colaboración con la investigación</h1>
          <p className="text-gray-400 text-sm mb-6">
            La Universidad Politécnica de Valencia (UPV), Laboratorio de Neuroarquitectura,
            usa datos anónimos de Chromatica para estudios sobre diseño e innovación docente.
            No se guardan nombres ni correos; solo uso de la herramienta y, si quieres, datos
            opcionales para análisis sociodemográfico.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="rounded-lg border border-gray-600 bg-gray-800/50 p-4 space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={researchParticipate}
                  onChange={(e) => setResearchParticipate(e.target.checked)}
                  className="mt-0.5 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-300">
                  Acepto participar en la investigación
                </span>
              </label>
              {researchParticipate && (
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 pt-1">
                  <select
                    value={researchAge}
                    onChange={(e) => setResearchAge(e.target.value)}
                    className="rounded-lg bg-gray-800 border border-gray-600 text-white text-xs px-2 py-1.5"
                    aria-label="Rango de edad"
                    required
                  >
                    {AGE_RANGES.map((opt) => (
                      <option key={opt.value || 'age'} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={researchGender}
                    onChange={(e) => setResearchGender(e.target.value)}
                    className="rounded-lg bg-gray-800 border border-gray-600 text-white text-xs px-2 py-1.5"
                    aria-label="Género"
                    required
                  >
                    {GENDERS.map((opt) => (
                      <option key={opt.value || 'g'} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={researchDesignCareer}
                    onChange={(e) => setResearchDesignCareer(e.target.value)}
                    className="rounded-lg bg-gray-800 border border-gray-600 text-white text-xs px-2 py-1.5 xs:col-span-2"
                    aria-label="Carrera o profesión relacionada con el diseño"
                    required
                  >
                    {DESIGN_CAREERS.map((opt) => (
                      <option key={opt.value || 'career'} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-xs text-gray-400 xs:col-span-2">
                    <input
                      type="checkbox"
                      checked={researchIsUpvStudent === true}
                      onChange={(e) => setResearchIsUpvStudent(e.target.checked ? true : null)}
                      className="rounded border-gray-600 bg-gray-700 text-indigo-500"
                    />
                    Estudiante UPV
                  </label>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={
                  submitting ||
                  !researchParticipate ||
                  (researchParticipate &&
                    (!researchAge.trim() || !researchGender.trim() || !researchDesignCareer.trim()))
                }
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '...' : 'Aceptar y continuar'}
              </button>
              <button
                type="button"
                onClick={handleDecline}
                disabled={submitting}
                className="w-full py-2.5 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 transition-colors text-sm"
              >
                No iniciar sesión
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
