import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { useAxisRotatedPalette } from '../useAxisRotatedPalette';
import type { CardComponentProps } from '../types';

/** Componente base para variantes placeholder con forma geométrica distintiva. */
const PLACEHOLDER_PALETTE = {
  fill: '#6366f1',
  stroke: '#818cf8',
  glow: '#a5b4fc',
} as const;

export type HerramientaShape = 'circle' | 'square' | 'hexagon' | 'triangle' | 'diamond' | 'star' | 'cross' | 'ring' | 'dot';

interface HerramientaPlaceholderProps extends CardComponentProps {
  /** Forma SVG para distinguir variantes */
  shape: HerramientaShape;
}

export function HerramientaPlaceholder({
  colorLeft = '#3b82f6',
  colorRight = '#f97316',
  sliderValue = 0,
  defaultColorLeft = '#3b82f6',
  className = '',
  shape = 'circle',
}: HerramientaPlaceholderProps) {
  const svgId = useUniqueSvgIds(`herramienta-${shape}`);
  const gradId = svgId('grad');
  const glowId = svgId('glow');

  const c = useAxisRotatedPalette(PLACEHOLDER_PALETTE, {
    colorLeft,
    colorRight,
    defaultColorLeft,
    sliderValue,
  });

  const renderShape = () => {
    const cx = 40;
    const cy = 40;
    const r = 28;
    switch (shape) {
      case 'circle':
        return <circle cx={cx} cy={cy} r={r} fill={`url(#${gradId})`} stroke={c.stroke} strokeWidth="1.5" opacity="0.9" />;
      case 'square':
        return <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} rx={6} fill={`url(#${gradId})`} stroke={c.stroke} strokeWidth="1.5" opacity="0.9" />;
      case 'hexagon':
        return (
          <path
            d={`M${cx} ${cy - r} L${cx + r * 0.866} ${cy - r * 0.5} L${cx + r * 0.866} ${cy + r * 0.5} L${cx} ${cy + r} L${cx - r * 0.866} ${cy + r * 0.5} L${cx - r * 0.866} ${cy - r * 0.5} Z`}
            fill={`url(#${gradId})`}
            stroke={c.stroke}
            strokeWidth="1.5"
            opacity="0.9"
          />
        );
      case 'triangle':
        return <polygon points={`${cx},${cy - r} ${cx + r},${cy + r} ${cx - r},${cy + r}`} fill={`url(#${gradId})`} stroke={c.stroke} strokeWidth="1.5" opacity="0.9" />;
      case 'diamond':
        return <polygon points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`} fill={`url(#${gradId})`} stroke={c.stroke} strokeWidth="1.5" opacity="0.9" />;
      case 'star': {
        const pts: string[] = [];
        for (let i = 0; i < 10; i++) {
          const rad = (i * 36 - 90) * (Math.PI / 180);
          const rr = i % 2 === 0 ? r : r * 0.4;
          pts.push(`${cx + Math.cos(rad) * rr},${cy + Math.sin(rad) * rr}`);
        }
        return (
          <polygon
            points={pts.join(' ')}
            fill={`url(#${gradId})`}
            stroke={c.stroke}
            strokeWidth="1.5"
            opacity="0.9"
          />
        );
      }
      case 'cross':
        return (
          <g>
            <rect x={cx - 8} y={cy - r} width={16} height={r * 2} fill={`url(#${gradId})`} opacity="0.9" />
            <rect x={cx - r} y={cy - 8} width={r * 2} height={16} fill={`url(#${gradId})`} opacity="0.9" />
            <rect x={cx - 8} y={cy - r} width={16} height={r * 2} stroke={c.stroke} strokeWidth="1.5" fill="none" />
            <rect x={cx - r} y={cy - 8} width={r * 2} height={16} stroke={c.stroke} strokeWidth="1.5" fill="none" />
          </g>
        );
      case 'ring':
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={c.fill} strokeWidth="8" opacity="0.6" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={c.stroke} strokeWidth="1.5" opacity="0.9" />
          </g>
        );
      case 'dot':
        return <circle cx={cx} cy={cy} r={r * 0.6} fill={`url(#${gradId})`} stroke={c.stroke} strokeWidth="1.5" opacity="0.9" />;
      default:
        return <circle cx={cx} cy={cy} r={r} fill={`url(#${gradId})`} stroke={c.stroke} strokeWidth="1.5" opacity="0.9" />;
    }
  };

  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" className={className}>
      <defs>
        <radialGradient id={gradId} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={c.glow} stopOpacity="0.95" />
          <stop offset="60%" stopColor={c.fill} stopOpacity="0.8" />
          <stop offset="100%" stopColor={c.stroke} stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.glow} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c.fill} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="40" rx="35" ry="35" fill={`url(#${glowId})`} />
      {renderShape()}
    </svg>
  );
}
