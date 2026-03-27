import { useState, useEffect, useId, type SVGProps } from 'react';
import {
  CHROMATICA_BRAND_COLOR_COUNT,
  colorAtPhase,
} from '../lib/chromaticaBrandColors';

export type ChromaticaSymbolLogoProps = Omit<
  SVGProps<SVGSVGElement>,
  'width' | 'height' | 'viewBox' | 'xmlns'
> & {
  /** Tamaño en px (ancho y alto del SVG). */
  size?: number;
  animated?: boolean;
  /** Ciclos de color por segundo (ignorado si `phase` está controlado desde fuera). */
  speed?: number;
  /**
   * Fase compartida con otros elementos (p. ej. texto). Si se pasa, desactiva el RAF interno.
   */
  phase?: number;
};

/**
 * Logo geométrico tipo “C” con caras de color. Opcionalmente anima el desplazamiento_cromático.
 */
export function ChromaticaSymbolLogo({
  size = 200,
  animated = false,
  speed = 0.3,
  phase: controlledPhase,
  className,
  'aria-hidden': ariaHidden,
  ...svgRest
}: ChromaticaSymbolLogoProps) {
  const R = 60;
  const cx = 100;
  const cy = 100;
  const cr = 25;
  const h = (R * Math.sqrt(3)) / 2;

  const T = `${cx},${cy - R}`;
  const UR = `${cx + h},${cy - R / 2}`;
  const LR = `${cx + h},${cy + R / 2}`;
  const Bo = `${cx},${cy + R}`;
  const LL = `${cx - h},${cy + R / 2}`;
  const UL = `${cx - h},${cy - R / 2}`;
  const O = `${cx},${cy}`;

  const [internalPhase, setInternalPhase] = useState(0);
  const maskId = `chromatica-symbol-mask-${useId().replace(/:/g, '')}`;

  const isControlled = controlledPhase !== undefined;
  const phase = isControlled ? controlledPhase! : internalPhase;

  useEffect(() => {
    if (isControlled) return;
    if (!animated) {
      setInternalPhase(0);
      return;
    }

    let raf = 0;
    let last = performance.now();
    const tick = (ts: number) => {
      const dt = (ts - last) / 1000;
      last = ts;
      setInternalPhase((p) => (p + speed * dt) % CHROMATICA_BRAND_COLOR_COUNT);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animated, speed, isControlled]);

  const c = {
    T1: colorAtPhase(phase, 0),
    T2: colorAtPhase(phase, 1),
    T4: colorAtPhase(phase, 2),
    T5: colorAtPhase(phase, 3),
    T6: colorAtPhase(phase, 4),
  };

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block' }}
      aria-hidden={ariaHidden ?? true}
      focusable="false"
      {...svgRest}
    >
      <defs>
        <mask id={maskId}>
          <rect width="200" height="200" fill="white" />
          <circle cx={cx} cy={cy} r={cr} fill="black" />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        <polygon points={`${UL} ${O} ${T}`} fill={c.T1} />
        <polygon points={`${LL} ${O} ${UL}`} fill={c.T6} />
        <polygon points={`${T} ${O} ${UR}`} fill={c.T2} />
        <polygon points={`${LR} ${O} ${Bo}`} fill={c.T4} />
        <polygon points={`${Bo} ${O} ${LL}`} fill={c.T5} />
      </g>
    </svg>
  );
}
