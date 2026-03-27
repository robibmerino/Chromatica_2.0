import { useState, useEffect, useId, type SVGProps } from 'react';

/** Colores de marca en orden de cara (sentido horario). */
const BRAND_COLORS = [
  '#2BB0C8',
  '#E8AE1E',
  '#CE3B7F',
  '#7B40A8',
  '#1A8FAA',
] as const;

function lerpColor(hexA: string, hexB: string, t: number): string {
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(hexA);
  const [r2, g2, b2] = parse(hexB);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

function colorAtPhase(phase: number, faceOffset: number): string {
  const N = BRAND_COLORS.length;
  const pos = ((((phase + faceOffset) % N) + N) % N);
  const i = Math.floor(pos);
  const t = pos - i;
  return lerpColor(BRAND_COLORS[i]!, BRAND_COLORS[(i + 1) % N]!, t);
}

export type ChromaticaSymbolLogoProps = Omit<
  SVGProps<SVGSVGElement>,
  'width' | 'height' | 'viewBox' | 'xmlns'
> & {
  /** Tamaño en px (ancho y alto del SVG). */
  size?: number;
  animated?: boolean;
  /** Ciclos de color por segundo. */
  speed?: number;
};

/**
 * Logo geométrico tipo “C” con caras de color. Opcionalmente anima el desplazamiento cromático.
 */
export function ChromaticaSymbolLogo({
  size = 200,
  animated = false,
  speed = 0.3,
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

  const [phase, setPhase] = useState(0);
  const maskId = `chromatica-symbol-mask-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    if (!animated) {
      setPhase(0);
      return;
    }

    let raf = 0;
    let last = performance.now();
    const tick = (ts: number) => {
      const dt = (ts - last) / 1000;
      last = ts;
      setPhase((p) => (p + speed * dt) % BRAND_COLORS.length);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animated, speed]);

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
