import { useMemo } from 'react';
import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

function buildGearPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  teeth: number
): string {
  const points: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 0.35) / teeth) * Math.PI * 2 - Math.PI / 2;
    const a3 = ((i + 0.65) / teeth) * Math.PI * 2 - Math.PI / 2;
    const a4 = ((i + 1) / teeth) * Math.PI * 2 - Math.PI / 2;

    const p1 = `${cx + innerR * Math.cos(a1)},${cy + innerR * Math.sin(a1)}`;
    const p2 = `${cx + outerR * Math.cos(a2)},${cy + outerR * Math.sin(a2)}`;
    const p3 = `${cx + outerR * Math.cos(a3)},${cy + outerR * Math.sin(a3)}`;
    const p4 = `${cx + innerR * Math.cos(a4)},${cy + innerR * Math.sin(a4)}`;

    points.push(`${i === 0 ? 'M' : 'L'}${p1} L${p2} L${p3} L${p4}`);
  }
  return points.join(' ') + ' Z';
}

/**
 * GearTool — Engranaje. Ingeniero / Mecánico.
 * Vigésima tercera variante de herramienta. Colores personalizables según el eje.
 */
export function GearTool({
  colorLeft = '#64748b',
  colorRight = '#1e40af',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('gear');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  const gearPath = useMemo(
    () => buildGearPath(40, 100, 44, 34, 12),
    []
  );

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="42%" r="38%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="100" rx="48" ry="52" fill={`url(#${gradId})`} />

      {/* Engranaje */}
      <path d={gearPath} fill={color} opacity="0.38" />
      <path d={gearPath} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />
      <path d={gearPath} fill="none" stroke="white" strokeWidth="0.5" strokeLinejoin="round" opacity="0.25" />

      {/* Eje central */}
      <circle cx="40" cy="100" r="14" fill="black" opacity="0.35" />
      <circle cx="40" cy="100" r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <circle cx="40" cy="100" r="14" fill="none" stroke="white" strokeWidth="0.5" opacity="0.22" />

      {/* Agujero central */}
      <circle cx="40" cy="100" r="6" fill={color} opacity="0.45" />
      <circle cx="40" cy="100" r="6" fill="none" stroke="white" strokeWidth="0.4" opacity="0.3" />
      <circle cx="40" cy="100" r="2.5" fill="white" opacity="0.4" />

      {/* Radios */}
      <path d="M40,86 L40,64" stroke={color} strokeWidth="1" opacity="0.3" />
      <path d="M54,100 L68,100" stroke={color} strokeWidth="1" opacity="0.3" />
      <path d="M40,114 L40,136" stroke={color} strokeWidth="1" opacity="0.3" />
      <path d="M26,100 L12,100" stroke={color} strokeWidth="1" opacity="0.3" />

      {/* Reflejo */}
      <circle cx="30" cy="82" r="3.5" fill="white" opacity="0.1" />
    </svg>
  );
}
