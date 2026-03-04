import { useMemo } from 'react';
import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { cn } from '../../../../utils/cn';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';
import { CARD_VIEWBOX_W, CARD_VIEWBOX_H } from './constants';

const DEFAULT_LEFT = '#3b82f6';
const DEFAULT_RIGHT = '#06b6d4';

const W = CARD_VIEWBOX_W;
const H = CARD_VIEWBOX_H;
const CX = W / 2;
const CY = H / 2;

const LATTICE_COLORS = ['#3b82f6', '#60a5fa', '#38bdf8', '#0ea5e9', '#06b6d4'] as const;

/**
 * Tejido Universal — malla deformada por ondas desde el centro.
 * Eje Orden–Exploración. Menor visibilidad en el centro, más en los extremos.
 */
export function Background7({
  className = '',
  colorLeft = DEFAULT_LEFT,
  colorRight = DEFAULT_RIGHT,
  sliderValue = 0,
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('lattice');
  const t = (sliderValue ?? 0) / 100;
  const axisBlend = blendHex(colorLeft ?? DEFAULT_LEFT, colorRight ?? DEFAULT_RIGHT, t);

  const hLines = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const y = (i / 17) * H;
      const distFromCenter = Math.abs(y - CY) / CY;
      const wavePhase = (y / H) * Math.PI * 3;
      const baseCurve = distFromCenter * 32;
      const waveCurve = Math.sin(wavePhase) * 12;
      const curve = baseCurve + waveCurve;
      const edgeFactor = 0.4 + distFromCenter * 0.95;
      const op = 0.1 + edgeFactor * 0.32;
      const color = blendHex(LATTICE_COLORS[i % LATTICE_COLORS.length], axisBlend, 0.45);
      return { y, curve, op, color };
    });
  }, [axisBlend]);

  const vLines = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const x = (i / 11) * W;
      const distFromCenter = Math.abs(x - CX) / CX;
      const wavePhase = (x / W) * Math.PI * 2.5;
      const baseCurve = distFromCenter * 22;
      const waveCurve = Math.sin(wavePhase) * 10;
      const curve = baseCurve + waveCurve;
      const edgeFactor = 0.4 + distFromCenter * 0.9;
      const op = 0.1 + edgeFactor * 0.3;
      const color = blendHex(LATTICE_COLORS[(i + 2) % LATTICE_COLORS.length], axisBlend, 0.45);
      return { x, curve, op, color };
    });
  }, [axisBlend]);

  const nodes = useMemo(() => {
    const result: { x: number; y: number; r: number; op: number; color: string }[] = [];
    const edgeHi = [0, 1, 2, 15, 16, 17];
    const edgeVi = [0, 1, 2, 9, 10, 11];
    edgeHi.forEach((hi) => {
      edgeVi.forEach((vi) => {
        const hl = hLines[hi];
        const vl = vLines[vi];
        if (hl && vl) {
          const distFromCenter = Math.hypot(vl.x - CX, hl.y - CY) / Math.hypot(CX, CY);
          const edgeFactor = 0.4 + distFromCenter * 0.8;
          result.push({
            x: vl.x,
            y: hl.y,
            r: 0.6 + distFromCenter * 0.4,
            op: 0.18 + edgeFactor * 0.35,
            color: blendHex(LATTICE_COLORS[(hi + vi) % LATTICE_COLORS.length], axisBlend, 0.45),
          });
        }
      });
    });
    return result;
  }, [hLines, vLines, axisBlend]);

  const interiorDots = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => {
      const hi = 3 + (i % 12);
      const vi = 3 + Math.floor(i / 12) % 6;
      if (hi >= hLines.length || vi >= vLines.length) return null;
      const hl = hLines[hi];
      const vl = vLines[vi];
      const distFromCenter = Math.hypot(vl.x - CX, hl.y - CY) / Math.hypot(CX, CY);
      if (distFromCenter < 0.3) return null;
      const edgeFactor = 0.35 + distFromCenter * 0.95;
      return {
        x: vl.x,
        y: hl.y,
        r: 0.3 + edgeFactor * 0.2,
        op: 0.1 + edgeFactor * 0.25,
        color: blendHex(LATTICE_COLORS[i % LATTICE_COLORS.length], axisBlend, 0.5),
      };
    }).filter(Boolean) as { x: number; y: number; r: number; op: number; color: string }[];
  }, [hLines, vLines, axisBlend]);

  const baseId = svgId('bg');
  const fadeId = svgId('fade');
  const maskGradId = svgId('mask-grad');
  const maskId = svgId('mask');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      className={cn('absolute inset-0', className)}
    >
      <defs>
        <linearGradient id={baseId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#080a14" />
          <stop offset="50%" stopColor="#0a0c18" />
          <stop offset="100%" stopColor="#06080f" />
        </linearGradient>
        <radialGradient id={fadeId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#080a14" stopOpacity="0.98" />
          <stop offset="40%" stopColor="#080a14" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#080a14" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#080a14" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={maskGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="black" stopOpacity="0.98" />
          <stop offset="35%" stopColor="black" stopOpacity="0.6" />
          <stop offset="65%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </radialGradient>
        <mask id={maskId}>
          <rect x="0" y="0" width={W} height={H} fill={`url(#${maskGradId})`} />
        </mask>
      </defs>

      <rect width={W} height={H} fill={`url(#${baseId})`} />

      <g mask={`url(#${maskId})`}>
        {hLines.map((l, i) => {
          const d = `M 0 ${l.y} Q ${CX} ${l.y + (l.y < CY ? -l.curve : l.curve)} ${W} ${l.y}`;
          return (
            <path
              key={`h${i}`}
              d={d}
              fill="none"
              stroke={l.color}
              strokeWidth="0.42"
              opacity={l.op}
            />
          );
        })}

        {vLines.map((l, i) => {
          const d = `M ${l.x} 0 Q ${l.x + (l.x < CX ? -l.curve : l.curve)} ${CY} ${l.x} ${H}`;
          return (
            <path
              key={`v${i}`}
              d={d}
              fill="none"
              stroke={l.color}
              strokeWidth="0.42"
              opacity={l.op}
            />
          );
        })}

        {nodes.map((n, i) => (
          <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity={n.op} />
        ))}

        {interiorDots.map((d, i) => (
          <circle key={`d${i}`} cx={d.x} cy={d.y} r={d.r} fill={d.color} opacity={d.op} />
        ))}
      </g>

      <rect width={W} height={H} fill={`url(#${fadeId})`} />
    </svg>
  );
}
