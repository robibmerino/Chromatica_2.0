import { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useResearch } from '../contexts/ResearchContext';
import { isSupabaseConfigured } from '../lib/supabase';
import ChromaticaLogo from './ChromaticaLogo';
import { LabIntroAsidePanel } from './LabIntroAsidePanel';
import { ParticleBackground } from './ParticleBackground';

const inputClass =
  'w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

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

interface AuthPageProps {
  onBack: () => void;
  /** Tras login o registro correctos; si no se pasa, se usa `onBack`. */
  onSuccess?: () => void;
  /** Tras «Comenzar»: panel del laboratorio a la izquierda (pantallas grandes) y acceso sin cuenta. */
  labEntryAside?: {
    onContinueWithoutAuth: () => void;
  };
  /** Etiqueta del botón superior izquierdo (p. ej. «Inicio» en el primer acceso). */
  backLabel?: string;
}

export function AuthPage({ onBack, onSuccess, labEntryAside, backLabel = 'Volver' }: AuthPageProps) {
  const { signIn, signUp, signInWithOAuth, resetPasswordForEmail, error, clearError } = useAuth();
  const { acceptConsent } = useResearch();
  const [isRegister, setIsRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [researchParticipate, setResearchParticipate] = useState(false);
  const [researchAge, setResearchAge] = useState('');
  const [researchGender, setResearchGender] = useState('');
  const [researchDesignCareer, setResearchDesignCareer] = useState('');
  const [researchIsUpvStudent, setResearchIsUpvStudent] = useState<boolean | null>(null);
  const [researchSaveError, setResearchSaveError] = useState(false);
  const [researchSaveErrorMessage, setResearchSaveErrorMessage] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);

  const handleOAuth = useCallback(
    async (provider: 'google' | 'github') => {
      clearError();
      setOauthLoading(provider);
      const { error: err } = await signInWithOAuth(provider);
      setOauthLoading(null);
      if (!err) (onSuccess ?? onBack)();
    },
    [signInWithOAuth, clearError, onBack, onSuccess]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim() || !password) return;
      setSubmitting(true);
      clearError();
      const fn = isRegister ? signUp : signIn;
      const { error: err } = await fn(email.trim(), password);
      setResearchSaveError(false);
      setResearchSaveErrorMessage(null);
      if (!err && isRegister && researchParticipate && isSupabaseConfigured()) {
        const { error: consentErr } = await acceptConsent({
          age_range: researchAge || undefined,
          gender: researchGender || undefined,
          design_career: researchDesignCareer || undefined,
          is_upv_student: researchIsUpvStudent ?? undefined,
        });
        if (consentErr) {
          setResearchSaveError(true);
          setResearchSaveErrorMessage(consentErr.message);
          setSubmitting(false);
          return;
        }
      }
      setSubmitting(false);
      if (!err) (onSuccess ?? onBack)();
    },
    [email, password, isRegister, signUp, signIn, clearError, onBack, onSuccess, researchParticipate, researchAge, researchGender, researchDesignCareer, researchIsUpvStudent, acceptConsent]
  );

  const handleForgotSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setSubmitting(true);
      clearError();
      setResetSent(false);
      const { error: err } = await resetPasswordForEmail(email.trim());
      setSubmitting(false);
      if (!err) setResetSent(true);
    },
    [email, resetPasswordForEmail, clearError]
  );

  const formsInner = showForgotPassword ? (
            <>
              <h1 className="text-2xl font-semibold text-white mb-1">Restablecer contraseña</h1>
              <p className="text-gray-400 text-sm mb-6">
                Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.
              </p>
              {resetSent ? (
                <div className="space-y-4">
                  <p className="text-sm text-green-400 bg-green-900/20 rounded-lg px-3 py-2">
                    Si existe una cuenta con ese email, recibirás un enlace para restablecer la contraseña. Revisa la bandeja de entrada y la carpeta de spam.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(false); setResetSent(false); clearError(); }}
                    className="w-full text-sm text-gray-400 hover:text-indigo-400 transition-colors py-2"
                  >
                    Volver a iniciar sesión
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  {error && (
                    <p className="text-sm text-red-400 bg-red-900/20 rounded-lg px-3 py-2">
                      {error.toLowerCase().includes('rate limit')
                        ? 'Demasiados intentos. Espera unos minutos antes de volver a solicitar el enlace.'
                        : error}
                    </p>
                  )}
                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className={inputClass}
                      placeholder="tu@email.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? '...' : 'Enviar enlace'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(false); clearError(); }}
                    className="w-full text-sm text-gray-400 hover:text-indigo-400 transition-colors py-2"
                  >
                    Volver a iniciar sesión
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
          <h1 className="text-2xl font-semibold text-white mb-1">
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            {isRegister
              ? 'Regístrate para guardar tus paletas en la nube.'
              : 'Entra con tu cuenta para ver y sincronizar tus paletas.'}
          </p>

          {isSupabaseConfigured() && (!isRegister || !researchParticipate) && (
            <div className="mb-6 space-y-3">
              <p className="text-xs text-gray-500 text-center">o continúa con</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  disabled={!!oauthLoading}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {oauthLoading === 'google' ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth('github')}
                  disabled={!!oauthLoading}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {oauthLoading === 'github' ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.329-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
            )}
            {researchSaveError && (
              <div className="text-sm text-amber-400 bg-amber-900/20 rounded-lg px-3 py-2 space-y-1">
                <p>
                  Cuenta creada correctamente, pero no se pudieron guardar los datos de investigación.
                </p>
                {researchSaveErrorMessage && (
                  <p className="text-amber-300/90 font-mono text-xs break-all">
                    Error: {researchSaveErrorMessage}
                  </p>
                )}
              </div>
            )}
            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={inputClass}
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-gray-300 mb-1">
                Contraseña
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                minLength={6}
                className={inputClass}
                placeholder="••••••••"
              />
              {isRegister ? (
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              ) : (
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(true); clearError(); }}
                  className="text-xs text-gray-400 hover:text-indigo-400 transition-colors mt-1"
                >
                  Olvidé mi contraseña
                </button>
              )}
            </div>

            {isRegister && isSupabaseConfigured() && (
              <div className="rounded-lg border border-gray-600 bg-gray-800/50 p-4 space-y-3">
                <h3 className="text-sm font-medium text-gray-200">
                  ¿Colaboras con la investigación?
                </h3>
                <p className="text-xs text-gray-400">
                  El Laboratorio de Neuroarquitectura UPV, usa datos anónimos de Chromatica para estudios
                  sobre elección de color. No se guardan nombres ni correos; solo uso de la herramienta y
                  los siguientes datos sociodemográficos.
                </p>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={researchParticipate}
                    onChange={(e) => setResearchParticipate(e.target.checked)}
                    className="mt-0.5 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500"
                    required={isRegister && isSupabaseConfigured()}
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
            )}

            <button
              type="submit"
              disabled={
                submitting ||
                (isRegister && isSupabaseConfigured() && !researchParticipate) ||
                (isRegister &&
                  isSupabaseConfigured() &&
                  researchParticipate &&
                  (!researchAge.trim() || !researchGender.trim() || !researchDesignCareer.trim()))
              }
              className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '...' : isRegister ? 'Registrarme' : 'Entrar'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister((v) => !v);
                clearError();
              }}
              className="w-full text-sm text-gray-400 hover:text-indigo-400 transition-colors py-2"
            >
              {isRegister ? 'Ya tengo cuenta, iniciar sesión' : 'Crear cuenta nueva'}
            </button>
          </form>
            </>
          );

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative">
      <ParticleBackground particleCount={120} showOrbs opacityScale={0.85} />
      <header className="relative z-10 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-md sticky top-0">
        <div className="max-w-4xl mx-auto pl-2 pr-4 py-5 grid grid-cols-3 items-center">
          <div className="flex justify-start -ml-1">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {backLabel}
            </button>
          </div>
          <div className="flex justify-center">
            <ChromaticaLogo size="xl" showSubtitle />
          </div>
          <div className="flex justify-end" aria-hidden />
        </div>
      </header>

      <main
        className={
          labEntryAside
            ? 'relative z-10 flex-1 flex items-start justify-center p-6 py-8 lg:items-center lg:py-10'
            : 'relative z-10 flex-1 flex items-center justify-center p-6'
        }
      >
        {labEntryAside ? (
          <div className="w-full max-w-5xl mx-auto">
            <div className="overflow-hidden rounded-2xl border border-gray-700/60 bg-gray-950/70 shadow-2xl shadow-black/40 backdrop-blur-md">
              <div className="grid grid-cols-1 divide-y divide-gray-700/50 lg:grid-cols-2 lg:divide-x lg:divide-y-0 lg:items-stretch">
                <aside className="order-2 flex min-h-[20rem] flex-col justify-center px-5 py-7 sm:px-7 sm:py-9 lg:order-1 lg:min-h-[24rem]">
                  <LabIntroAsidePanel
                    variant="split"
                    onContinueWithoutAuth={labEntryAside.onContinueWithoutAuth}
                  />
                </aside>
                <div className="order-1 flex min-h-[20rem] flex-col justify-center px-5 py-7 sm:px-7 sm:py-9 lg:order-2 lg:min-h-[24rem]">
                  <div className="mx-auto w-full max-w-sm">{formsInner}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm mx-auto">
            {formsInner}
          </div>
        )}
      </main>
    </div>
  );
}
