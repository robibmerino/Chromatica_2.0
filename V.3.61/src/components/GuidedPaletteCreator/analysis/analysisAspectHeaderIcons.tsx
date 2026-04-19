import type { ReactNode, SVGProps } from 'react';

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor' as const,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

type IconProps = Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'children'> & {
  /** Aside: `w-4 h-4`; cabecera central: `w-5 h-5`. */
  className?: string;
};

function IconRoot({ className = 'w-4 h-4', children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke} {...rest}>
      {children}
    </svg>
  );
}

/** Contraste: círculo + eje (todo trazo, sin semicírculo relleno). */
export function AnalysisAspectIconContrast(props: IconProps) {
  return (
    <IconRoot {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="5" x2="12" y2="19" />
    </IconRoot>
  );
}

/** Proximidad / póster: marco + tres columnas (misma lectura en aside y centro). */
export function AnalysisAspectIconProximity(props: IconProps) {
  return (
    <IconRoot {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <line x1="9" y1="4" x2="9" y2="20" />
      <line x1="15" y1="4" x2="15" y2="20" />
    </IconRoot>
  );
}

/** Temperatura: termómetro de contorno (misma silueta que la versión previa). */
export function AnalysisAspectIconTemperature(props: IconProps) {
  return (
    <IconRoot {...props}>
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </IconRoot>
  );
}

/** Luminosidad: núcleo + ocho rayos cortos (misma densidad visual que el círculo 9). */
export function AnalysisAspectIconLightness(props: IconProps) {
  return (
    <IconRoot {...props}>
      <circle cx="12" cy="12" r="3.5" />
      <line x1="12" y1="2.5" x2="12" y2="5.5" />
      <line x1="12" y1="18.5" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="5.5" y2="12" />
      <line x1="18.5" y1="12" x2="21.5" y2="12" />
      <line x1="5.5" y1="5.5" x2="7.5" y2="7.5" />
      <line x1="16.5" y1="16.5" x2="18.5" y2="18.5" />
      <line x1="18.5" y1="5.5" x2="16.5" y2="7.5" />
      <line x1="7.5" y1="16.5" x2="5.5" y2="18.5" />
    </IconRoot>
  );
}

/** Focus (vibración): tres barras de altura distinta, solo trazo (sin “rayo” macizo). */
export function AnalysisAspectIconFocus(props: IconProps) {
  return (
    <IconRoot {...props}>
      <line x1="7" y1="18" x2="7" y2="11" />
      <line x1="12" y1="18" x2="12" y2="6" />
      <line x1="17" y1="18" x2="17" y2="14" />
    </IconRoot>
  );
}

/** Daltonismo: ojo de contorno, proporciones alineadas con el círculo 9. */
export function AnalysisAspectIconCvd(props: IconProps) {
  return (
    <IconRoot {...props}>
      <path d="M2 12s4.5-7 10-7 10 7 10 7-4.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="2.5" />
    </IconRoot>
  );
}

/** Armonía: esfera + ecuador + meridiano elíptico (globo ligero). */
export function AnalysisAspectIconHarmony(props: IconProps) {
  return (
    <IconRoot {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c3.2 2.5 5 5.8 5 9s-1.8 6.5-5 9c-3.2-2.5-5-5.8-5-9s1.8-6.5 5-9z" />
    </IconRoot>
  );
}
