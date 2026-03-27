import { useId, useMemo, type SVGProps } from 'react';

const R = 60;
const cx = 100;
const cy = 100;
const cr = 25.5;
const h = (R * Math.sqrt(3)) / 2;

const T: [number, number] = [cx, cy - R];
const UR: [number, number] = [cx + h, cy - R / 2];
const LR: [number, number] = [cx + h, cy + R / 2];
const Bo: [number, number] = [cx, cy + R];
const LL: [number, number] = [cx - h, cy + R / 2];
const UL: [number, number] = [cx - h, cy - R / 2];
const O: [number, number] = [cx, cy];

const pt = (p: [number, number]) => p.join(',');
const poly = (...ps: [number, number][]) => ps.map(pt).join(' ');

const SP = 3.8;
const SWH = 0.85;
const SWE = 1.8;

function hatchAlignedToEdge(
  edgeA: [number, number],
  edgeB: [number, number],
  spacing: number,
): Array<{ x1: string; y1: string; x2: string; y2: string }> {
  const dx = edgeB[0] - edgeA[0];
  const dy = edgeB[1] - edgeA[1];
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;

  let px = -uy;
  let py = ux;
  const mx = (edgeA[0] + edgeB[0]) / 2;
  const my = (edgeA[1] + edgeB[1]) / 2;
  if (px * (O[0] - mx) + py * (O[1] - my) < 0) {
    px = -px;
    py = -py;
  }

  const depth = (O[0] - edgeA[0]) * px + (O[1] - edgeA[1]) * py;
  const reach = 300;
  const lines: Array<{ x1: string; y1: string; x2: string; y2: string }> = [];

  for (let d = 0; d <= depth; d += spacing) {
    const bx = edgeA[0] + d * px;
    const by = edgeA[1] + d * py;
    lines.push({
      x1: (bx + reach * ux).toFixed(2),
      y1: (by + reach * uy).toFixed(2),
      x2: (bx - reach * ux).toFixed(2),
      y2: (by - reach * uy).toFixed(2),
    });
  }
  return lines;
}

function hatchAngle(angleDeg: number, spacing: number): Array<{ x1: string; y1: string; x2: string; y2: string }> {
  const rad = (angleDeg * Math.PI) / 180;
  const ux = Math.cos(rad);
  const uy = Math.sin(rad);
  const px = -uy;
  const py = ux;
  const reach = 300;
  const lines: Array<{ x1: string; y1: string; x2: string; y2: string }> = [];

  for (let d = -150; d <= 150; d += spacing) {
    const bx = cx + d * px;
    const by = cy + d * py;
    lines.push({
      x1: (bx + reach * ux).toFixed(2),
      y1: (by + reach * uy).toFixed(2),
      x2: (bx - reach * ux).toFixed(2),
      y2: (by - reach * uy).toFixed(2),
    });
  }
  return lines;
}

export type ChromaticaLogoMarkProps = SVGProps<SVGSVGElement> & {
  /** Grosor relativo del trazo de rayado y contorno (1 = diseño original). */
  strokeScale?: number;
};

export function ChromaticaLogoMark({ strokeScale = 1, className, ...svgProps }: ChromaticaLogoMarkProps) {
  const rawId = useId();
  const sid = rawId.replace(/:/g, '');
  const cm = `chromatica-logo-cm-${sid}`;
  const ct1 = `chromatica-logo-ct1-${sid}`;
  const ct2 = `chromatica-logo-ct2-${sid}`;
  const ct4 = `chromatica-logo-ct4-${sid}`;
  const ct5 = `chromatica-logo-ct5-${sid}`;
  const ct6 = `chromatica-logo-ct6-${sid}`;
  const cc = `chromatica-logo-cc-${sid}`;

  const swH = SWH * strokeScale;
  const swE = SWE * strokeScale;

  const hatchLines = useMemo(
    () => ({
      t1: hatchAngle(90, SP),
      t2: hatchAlignedToEdge(T, UR, SP),
      t4: hatchAlignedToEdge(LR, Bo, SP),
      t5: hatchAngle(90, SP),
      t6: hatchAngle(45, SP),
    }),
    [],
  );

  const renderHatch = (key: keyof typeof hatchLines, clip: string) => (
    <g key={key} clipPath={`url(#${clip})`}>
      {hatchLines[key].map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
      ))}
    </g>
  );

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      focusable="false"
      {...svgProps}
    >
      <defs>
        <mask id={cm}>
          <rect width="200" height="200" fill="white" />
          <circle cx={cx} cy={cy} r={cr} fill="black" />
        </mask>

        <clipPath id={ct1}>
          <polygon points={poly(UL, O, T)} />
        </clipPath>
        <clipPath id={ct2}>
          <polygon points={poly(T, O, UR)} />
        </clipPath>
        <clipPath id={ct4}>
          <polygon points={poly(LR, O, Bo)} />
        </clipPath>
        <clipPath id={ct5}>
          <polygon points={poly(Bo, O, LL)} />
        </clipPath>
        <clipPath id={ct6}>
          <polygon points={poly(LL, O, UL)} />
        </clipPath>

        <clipPath id={cc}>
          <polygon points={poly(UL, T, UR, [cx + 3, cy], LR, Bo, LL)} />
        </clipPath>
      </defs>

      <g mask={`url(#${cm})`} stroke="white" strokeWidth={swH} fill="none">
        {renderHatch('t1', ct1)}
        {renderHatch('t2', ct2)}
        {renderHatch('t4', ct4)}
        {renderHatch('t5', ct5)}
        {renderHatch('t6', ct6)}
      </g>

      <g
        mask={`url(#${cm})`}
        stroke="white"
        strokeWidth={swE}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points={`${pt(UL)} ${pt(T)} ${pt(UR)}`} />
        <polyline points={`${pt(LR)} ${pt(Bo)} ${pt(LL)} ${pt(UL)}`} />
        <line x1={UR[0]} y1={UR[1]} x2={O[0]} y2={O[1]} />
        <line x1={LR[0]} y1={LR[1]} x2={O[0]} y2={O[1]} />
        <line x1={O[0]} y1={O[1]} x2={T[0]} y2={T[1]} />
        <line x1={O[0]} y1={O[1]} x2={UL[0]} y2={UL[1]} />
        <line x1={O[0]} y1={O[1]} x2={LL[0]} y2={LL[1]} />
        <line x1={O[0]} y1={O[1]} x2={Bo[0]} y2={Bo[1]} />
      </g>

      <circle cx={cx} cy={cy} r={cr} fill="none" stroke="white" strokeWidth={swE} clipPath={`url(#${cc})`} />
    </svg>
  );
}
