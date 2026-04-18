import { Globe, Instagram, Linkedin } from 'lucide-react';

const LAB_LINKS = [
  {
    href: 'https://www.instagram.com/neuroarquitectura_upv/',
    label: 'Instagram',
    Icon: Instagram,
  },
  {
    href: 'https://www.linkedin.com/company/laboratorio-de-neuroarquitectura-de-la-upv/posts/?feedView=all',
    label: 'LinkedIn',
    Icon: Linkedin,
  },
  {
    href: 'https://humantech.upv.es/neuroarquitectura-lab/',
    label: 'Web del lab',
    Icon: Globe,
  },
] as const;

const linkButtonClass =
  'inline-flex flex-1 min-w-0 flex-col items-center justify-center gap-1 rounded-lg border border-gray-600/80 bg-gray-900/50 px-2 py-2.5 text-[11px] font-medium text-gray-300 transition-colors hover:border-gray-500 hover:bg-gray-800/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]';

export interface LabIntroAsidePanelProps {
  onContinueWithoutAuth: () => void;
  /**
   * `split`: mitad izquierda de la ventana unificada (ancho completo de la columna, bloque más equilibrado).
   * `standalone`: columna estrecha si se reutiliza fuera del layout 50/50.
   */
  variant?: 'split' | 'standalone';
}

/**
 * Texto de contexto del Laboratorio de Neuroarquitectura (UPV) para mostrar junto al formulario de acceso.
 */
export function LabIntroAsidePanel({
  onContinueWithoutAuth,
  variant = 'split',
}: LabIntroAsidePanelProps) {
  const isSplit = variant === 'split';

  const innerCardClass = isSplit
    ? 'rounded-xl border border-gray-700/50 bg-gray-900/40 p-5 sm:p-6 space-y-5 w-full'
    : 'rounded-2xl border border-gray-700/60 bg-gray-900/40 backdrop-blur-sm p-6 sm:p-7 space-y-6 w-full';

  const rootClass = isSplit
    ? 'flex w-full flex-col justify-center gap-5 min-h-0'
    : 'space-y-6 w-full max-w-[min(100%,24rem)] mx-auto lg:mx-0';

  return (
    <div className={rootClass}>
      <div className={innerCardClass}>
        <div className="flex flex-col gap-3">
          <img
            src="/neuroarquitectura-logo-horizontal.png"
            alt="Laboratorio de Neuroarquitectura de la UPV"
            className="w-full h-auto max-h-24 object-contain object-left opacity-90 sm:max-h-28"
            draggable={false}
          />
        </div>

        <div className="space-y-3 text-[14px] sm:text-[15px] leading-relaxed text-gray-300">
          <p>
            Chromatica forma parte de las aplicaciones del{' '}
            <strong className="text-gray-100 font-medium">Laboratorio de Neuroarquitectura</strong> de la
            Universidad Politécnica de Valencia (UPV). El laboratorio trabaja la relación entre entorno,
            percepción y diseño desde una perspectiva de investigación abierta.
          </p>
          <p>
            <strong className="text-gray-100 font-medium">Chromatica</strong> es una herramienta para
            explorar y construir paletas de color en ese marco: sirve para avanzar en estudios sobre color,
            creatividad y experiencia de uso, no como un servicio comercial.
          </p>
        </div>
      </div>

      <nav
        className="flex w-full flex-wrap items-stretch justify-center gap-2 sm:gap-2.5"
        aria-label="Enlaces del Laboratorio de Neuroarquitectura"
      >
        {LAB_LINKS.map(({ href, label, Icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkButtonClass}
          >
            <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
            <span className="truncate text-center leading-tight">{label}</span>
          </a>
        ))}
      </nav>

      <button
        type="button"
        onClick={onContinueWithoutAuth}
        className="w-full shrink-0 rounded-xl border border-gray-600 bg-gray-900/50 px-5 py-3 text-sm font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-800/80"
      >
        Continuar sin iniciar sesión
      </button>
    </div>
  );
}
