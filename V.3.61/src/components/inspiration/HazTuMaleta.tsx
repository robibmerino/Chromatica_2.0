import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
  type JSX,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AQUARIUM_BUTTON_CONFIG } from '../GuidedPaletteCreator/config/archetypeShapeButtonConfig';
import { COLOR_COUNT_MAX } from '../GuidedPaletteCreator/config/refinementConstants';
import { SectionBanner, SECTION_ICON_ACCENTS } from '../GuidedPaletteCreator/SectionBanner';
import { hexToHsl, hslToHex } from '../../utils/colorUtils';

// ── Config ────────────────────────────────────────────────────────────────────
const MAX_ITEMS = 5;
const SUITCASE_W = 580;
const SUITCASE_H = 340;
const LEFT_COLUMN_BASE_WIDTH = SUITCASE_W + 44;
const MIN_LEFT_COLUMN_SCALE = 0.62;
/** La maleta se separa del carril de herramientas con flex+gap; sin desplazamiento extra. */
const LEFT_COLUMN_SHIFT = 0;
const LEFT_TOOLS_CARD_WIDTH = 200;
const LEFT_COLUMN_INNER_GAP = 10;
/** Espacio reservado en la columna (tarjeta + separación) para el cálculo de escala. */
const LEFT_TOOLS_RAIL = LEFT_TOOLS_CARD_WIDTH + LEFT_COLUMN_INNER_GAP;
/** Margen de seguridad para evitar corte inferior por redondeos/zoom del navegador. */
const LEFT_COLUMN_SAFE_SCALE = 0.975;
/** El carril se adapta al alto disponible; el panel abierto hace scroll interno. */

/** Tapa de la caja cerrada: beteado y relieve (solo estado `placed.length === 0`). */
const CLOSED_TOOLS_LID_WOOD: CSSProperties = {
  position: 'relative',
  borderRadius: 10,
  backgroundColor: '#25160e',
  backgroundImage: [
    'repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 3px, transparent 3px, transparent 6px, rgba(255,215,175,0.06) 6px, rgba(255,215,175,0.06) 7px, transparent 7px, transparent 11px)',
    'repeating-linear-gradient(88deg, rgba(0,0,0,0) 0 22px, rgba(40,24,16,0.25) 22px 24px, rgba(0,0,0,0) 24px 58px, rgba(15,10,6,0.2) 58px 60px, rgba(0,0,0,0) 60px 88px)',
    'repeating-linear-gradient(91deg, transparent, transparent 3px, rgba(90,55,32,0.1) 3px 4px, transparent 4px 7px, rgba(0,0,0,0.06) 7px 8px, transparent 8px 14px)',
    'linear-gradient(180deg, #3d2a1a 0%, #2a1a10 35%, #1a1008 100%)',
  ].join(', '),
  boxShadow:
    'inset 0 1px 0 rgba(255,230,200,0.10), inset 0 -2px 10px rgba(0,0,0,0.4), 0 1px 0 rgba(0,0,0,0.25)',
  border: '1px solid rgba(80, 52, 35, 0.7)',
};

/** Rótulo «COLOR Y ETIQUETAS» vertical, efecto grabado. */
const CLOSED_CARVED_LABEL: CSSProperties = {
  display: 'block',
  position: 'relative',
  zIndex: 1,
  writingMode: 'vertical-rl',
  textOrientation: 'upright',
  fontFamily: "'Georgia','Times New Roman',serif",
  fontSize: 16,
  fontWeight: 900,
  letterSpacing: '0.24em',
  lineHeight: 1.2,
  userSelect: 'none',
  color: '#0f0a08',
  textTransform: 'uppercase',
  WebkitFontSmoothing: 'antialiased',
  textShadow:
    '0 1.5px 0 rgba(72, 48, 30, 0.5), 0 2.5px 2px rgba(0,0,0,0.5), 0 -1.5px 1.5px rgba(0,0,0,0.6), 1.2px 0 0 rgba(0,0,0,0.25), -1.2px 0 0 rgba(255,235,210,0.05), 0.5px 0.5px 0 rgba(0,0,0,0.35)',
  transform: 'translateZ(0)',
};

/** Nota de ayuda (maleta vacía): apariencia de papel vintage dentro del interior. */
const EMPTY_SUITCASE_NOTE_PAPER: CSSProperties = {
  maxWidth: 300,
  width: '100%',
  padding: '20px 22px 24px',
  position: 'relative',
  textAlign: 'left',
  color: '#2a1c12',
  backgroundColor: '#e0d0b0',
  backgroundImage: [
    'repeating-linear-gradient(0deg, transparent, transparent 21px, rgba(74, 50, 36, 0.1) 21px, rgba(74, 50, 36, 0.1) 22px)',
    'linear-gradient(95deg, rgba(255, 252, 240, 0.35) 0%, transparent 42%, rgba(120, 90, 50, 0.06) 100%)',
    'radial-gradient(ellipse 90% 55% at 18% 12%, rgba(255, 245, 220, 0.5) 0%, transparent 55%)',
  ].join(', '),
  border: '1px solid rgba(60, 42, 28, 0.35)',
  borderRadius: 2,
  boxShadow: [
    '0 1px 0 rgba(0,0,0,0.18)',
    '0 10px 28px rgba(0,0,0,0.5)',
    'inset 0 0 0 1px rgba(255,255,255,0.22)',
    'inset 0 2px 0 rgba(255,255,255,0.12)',
  ].join(', '),
  transform: 'rotate(-1.25deg)',
  fontFamily: "'Courier New', Courier, 'Liberation Mono', ui-monospace, monospace",
  fontSize: 12.4,
  fontWeight: 500,
  lineHeight: 1.72,
  letterSpacing: '0.04em',
};

const EMPTY_SUITCASE_NOTE_HEADING: CSSProperties = {
  fontFamily: "'Georgia', 'Times New Roman', serif",
  fontSize: 10.8,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  textAlign: 'center',
  color: '#4a3120',
  marginBottom: 12,
  paddingBottom: 9,
  borderBottom: '1px dashed rgba(50, 36, 24, 0.45)',
  textShadow: '0 1px 0 rgba(255, 248, 230, 0.35)',
};

/** Cápsula y tipografía compartidas: avisos centrales (pincel activo, regla de color duplicada). */
const MALETA_CENTER_TOAST_INNER: CSSProperties = {
  maxWidth: 'min(22rem, calc(100vw - 2rem))',
  padding: '14px 20px',
  textAlign: 'center',
  fontSize: 15,
  lineHeight: 1.45,
  fontWeight: 400,
  color: '#FEF3C7',
  fontFamily: 'system-ui, sans-serif',
  background: 'linear-gradient(165deg, rgba(15, 23, 42, 0.96) 0%, rgba(8, 14, 28, 0.98) 100%)',
  border: '1px solid rgba(251, 191, 36, 0.38)',
  borderRadius: 14,
  boxShadow: `
    0 8px 36px rgba(0,0,0,0.55),
    0 0 0 1px rgba(0,0,0,0.25) inset,
    0 0 28px rgba(251, 191, 36, 0.12)
  `,
};

const WHEEL_DISPLAY_SIZE = 74;
const WHEEL_CANVAS_SIZE = 220;
const WHEEL_RADIUS = WHEEL_DISPLAY_SIZE / 2 - 2;

// ── Color palettes for quick pick ─────────────────────────────────────────────
const QUICK_COLORS = [
  '#EF4444','#F97316','#EAB308','#22C55E','#06B6D4',
  '#3B82F6','#8B5CF6','#EC4899','#14B8A6','#F59E0B',
  '#64748B','#1E293B','#FAFAFA','#BE123C','#065F46',
  '#7C3AED','#0369A1','#92400E','#BE185D','#166534',
];

// ── Objects ───────────────────────────────────────────────────────────────────
const OBJECTS = [
  { id:'camera',     name:'Cámara',              defaultSize:160 },
  { id:'libro',      name:'Libro',               defaultSize:150 },
  { id:'vino',       name:'Botella de vino',     defaultSize:210 },
  { id:'zapatillas', name:'Zapatillas',           defaultSize:195 },
  { id:'piruleta',   name:'Piruleta gigante',    defaultSize:200 },
  { id:'peluche',    name:'Peluche',             defaultSize:185 },
  { id:'cuchillo',   name:'Cuchillo',            defaultSize:220 },
  { id:'botella',    name:'Mensaje en botella',  defaultSize:200 },
  { id:'pasaporte',  name:'Pasaporte',           defaultSize:145 },
  { id:'gafas',      name:'Gafas de sol',        defaultSize:170 },
  { id:'mapa',       name:'Mapa',                defaultSize:175 },
  { id:'paraguas',   name:'Paraguas',            defaultSize:195 },
];

type ShelfObjectDef = (typeof OBJECTS)[number];
type ObjectItemId = ShelfObjectDef['id'];

/**
 * Caja aproximada del dibujo en el viewBox 48×48 (no del cuadrado SVG entero).
 * Así el arrastre encaja la tinta con los bordes de la maleta; objetos estrechos (p. ej. botella)
 * pueden acercarse más a los lados que el círculo de radio size/2.
 */
const OBJECT_SVG_BOUNDS: Record<ObjectItemId, { l: number; r: number; t: number; b: number }> = {
  camera: { l: 2, r: 46, t: 6, b: 44 },
  libro: { l: 7, r: 38, t: 4, b: 44 },
  vino: { l: 14, r: 34, t: 2, b: 46 },
  zapatillas: { l: 5, r: 46, t: 10, b: 44 },
  piruleta: { l: 8, r: 40, t: 4, b: 47 },
  peluche: { l: 1, r: 47, t: 2, b: 48 },
  cuchillo: { l: 14, r: 32, t: 4, b: 45 },
  botella: { l: 14, r: 34, t: 1, b: 47 },
  pasaporte: { l: 8, r: 38, t: 5, b: 45 },
  gafas: { l: 2, r: 46, t: 6, b: 42 },
  mapa: { l: 4, r: 46, t: 4, b: 44 },
  paraguas: { l: 4, r: 44, t: 4, b: 48 },
};

/** Coords como `transform: rotate(deg)` en el ícono (viewBox, origen en 24,24). */
function viewBoxPointAfterCSSRotate(x: number, y: number, deg: number): { x: number; y: number } {
  const d = ((deg % 360) + 360) % 360;
  if (d === 0) return { x, y };
  const rad = (d * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const x0 = x - 24;
  const y0 = y - 24;
  return { x: c * x0 - s * y0 + 24, y: s * x0 + c * y0 + 24 };
}

/** Caja l,r,t,b en 0–48 al rotar la caja de la tinta (AABB de las 4 esquinas en viewBox). */
function effectiveObjectBoundsInViewBox(
  objId: ObjectItemId,
  rotationDeg: number
): { l: number; r: number; t: number; b: number } {
  const base = OBJECT_SVG_BOUNDS[objId];
  if (!base) {
    return { l: 0, r: 48, t: 0, b: 48 };
  }
  const d = ((rotationDeg % 360) + 360) % 360;
  if (d === 0) return { ...base };
  const corners: [number, number][] = [
    [base.l, base.t],
    [base.r, base.t],
    [base.r, base.b],
    [base.l, base.b],
  ];
  const rr = corners.map(([x, y]) => viewBoxPointAfterCSSRotate(x, y, d));
  return {
    l: Math.min(...rr.map((p) => p.x)),
    r: Math.max(...rr.map((p) => p.x)),
    t: Math.min(...rr.map((p) => p.y)),
    b: Math.max(...rr.map((p) => p.y)),
  };
}

function clampPlacedItemPosition(
  objId: ObjectItemId,
  size: number,
  x: number,
  y: number,
  W: number,
  H: number,
  rotationDeg: number = 0
): { x: number; y: number } {
  if (!OBJECT_SVG_BOUNDS[objId]) {
    const h = size * 0.5;
    return { x: Math.min(Math.max(x, h), W - h), y: Math.min(Math.max(y, h), H - h) };
  }
  const b = effectiveObjectBoundsInViewBox(objId, rotationDeg);
  const s = size;
  const xMin = s * (0.5 - b.l / 48);
  const xMax = W - s * (b.r / 48 - 0.5);
  const yMin = s * (0.5 - b.t / 48);
  const yMax = H - s * (b.b / 48 - 0.5);
  if (xMin > xMax || yMin > yMax) {
    const h = s * 0.5;
    return { x: Math.min(Math.max(x, h), W - h), y: Math.min(Math.max(y, h), H - h) };
  }
  return {
    x: Math.min(Math.max(x, xMin), xMax),
    y: Math.min(Math.max(y, yMin), yMax),
  };
}

/** Anclaje de rótulos al borde de la tinta (mismas coords 0–48 que OBJECT_SVG_BOUNDS), coords locales al cuadrado size×size. */
function tagAnchorForObject(
  objId: ObjectItemId,
  size: number
): { hintCenterX: number; baseY: number; rightX: number } {
  const box = OBJECT_SVG_BOUNDS[objId];
  if (!box) {
    return { hintCenterX: size * 0.5, baseY: size, rightX: size };
  }
  return {
    hintCenterX: (size * (box.l + box.r)) / 96,
    baseY: (size * box.b) / 48,
    rightX: (size * box.r) / 48,
  };
}

export interface PlacedItem {
  id: number;
  objId: ObjectItemId;
  name: string;
  size: number;
  /** Grados; puede ser 90, 180, 360, 450… (misma orientación real que `deg % 360`, pero se acumula para que la animación nunca gire en sentido inverso al “dar la vuelta completa”). */
  rotation: number;
  color: string | null;
  tag: string | null;
  tagSourceIdx?: number | null;
  archetype?: { label: string } | null;
}

export interface HazTuMaletaSavedState {
  placed: PlacedItem[];
  pos: Record<number, { x: number; y: number }>;
  closed: boolean;
}

export interface HazTuMaletaProps {
  colorCount: number;
  onColorCountChange: (count: number) => void;
  onComplete: (colors: string[], savedState?: HazTuMaletaSavedState) => void;
  onBack: (savedState?: HazTuMaletaSavedState) => void;
  initialState?: HazTuMaletaSavedState | null;
  onStateChange?: (state: HazTuMaletaSavedState) => void;
  onGeneratedPaletteChange?: (hexColors: string[]) => void;
}

type ShelfDragState = { obj: ShelfObjectDef; mx: number; my: number };
type ReposDragState = { id: number; ox: number; oy: number };

function fitPaletteToColorCount(hexes: string[], count: number): string[] {
  const n = Math.max(1, Math.min(COLOR_COUNT_MAX, count));
  if (hexes.length === 0) return Array.from({ length: n }, () => '#64748B');
  if (hexes.length >= n) return hexes.slice(0, n);
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(hexes[i % hexes.length]);
  return out;
}

const OBJECT_ICON_BASE: Record<ObjectItemId, string> = {
  camera:     '#2A2A2A',
  libro:      '#7C3AED',
  vino:       '#7F1D1D',
  zapatillas: '#F97316',
  piruleta:   '#EC4899',
  peluche:    '#D97706',
  cuchillo:   '#475569',
  botella:    '#0C4A6E',
  pasaporte:  '#1E3A5F',
  gafas:      '#1E1B4B',
  mapa:       '#78350F',
  paraguas:   '#6D28D9',
};

function colorsEqualForPaint(a: string, b: string): boolean {
  const s = (x: string) => x.trim().toLowerCase();
  let u = s(a);
  let v = s(b);
  if (u[0] !== '#') u = `#${u}`;
  if (v[0] !== '#') v = `#${v}`;
  if (u.length === 4) u = `#${u[1]}${u[1]}${u[2]}${u[2]}${u[3]}${u[3]}`;
  if (v.length === 4) v = `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  return u === v;
}

function normalizeTagLabel(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function tagLabelsEqual(a: string, b: string): boolean {
  return normalizeTagLabel(a) === normalizeTagLabel(b);
}

const OBJECT_ICON_ACCENT: Record<ObjectItemId, string> = {
  camera:     '#4A6FA5',
  libro:      '#C4B5FD',
  vino:       '#FECACA',
  zapatillas: '#FED7AA',
  piruleta:   '#FBCFE8',
  peluche:    '#FDE68A',
  cuchillo:   '#CBD5E1',
  botella:    '#7DD3FC',
  pasaporte:  '#93C5FD',
  gafas:      '#A5B4FC',
  mapa:       '#FCD34D',
  paraguas:   '#DDD6FE',
};

const PAINT_WIPE_MS = 2550;
const PAINT_WIPE_SEGMENTS = 40;

/**
 * Ease-out marcadísimo: (1−u) elevado a p alto; los últimos ~15–20% de tiempo
 * mueven poco progreso en `t` y la bajada de la mancha se ve casi a cámara lenta.
 */
function mapPaintWipeEasing(rawT: number): number {
  if (rawT >= 1) return 1;
  if (rawT <= 0) return 0;
  const p = 4.85;
  return 1 - Math.pow(1 - rawT, p);
}

/**
 * Máscara del brochazo: el color nuevo se ve encima; la frontera con el antiguo baja
 * a ritmo distinto en cada `x` (más “fajas” y baches que una sola línea uniforme).
 * `t` ∈ [0,1] = progreso global (ease en el caller).
 */
function wavyTopToBottomWipeClipPath(t: number): string {
  if (t >= 0.999) return 'inset(100% 0 0 0)'; // capa del color anterior: nada
  if (t <= 0) return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
  const wiggleRise = Math.min(1, t / 0.16);
  const u = (x: number) => x / 100;
  /** Cada `x` avanza a un ritmo distinto: “manchas”, bandas y tiras finas desalineadas. */
  const columnProgress = (x: number) => {
    const xu = u(x);
    const raw =
      0.72 +
      0.18 * Math.sin(2.15 * xu * 2 * Math.PI - 0.1 * t * 3) +
      0.1 * Math.sin(6.6 * xu * 2 * Math.PI + 0.6) +
      0.09 * Math.sin(11.2 * xu * 2 * Math.PI + 1.0 + 0.15 * t * 5) +
      0.07 * Math.sin(19 * xu * 2 * Math.PI + 0.4) +
      0.12 * (0.5 + 0.5 * Math.sin(4.1 * t + 2.7 * xu) * Math.sin(8.8 * xu * 2 * Math.PI + 1.5));
    return Math.min(1.22, Math.max(0.4, raw));
  };
  /** Borde irregular: muchas frecuencias (no es una sola ola ordenada) + fase que se mueve con `t`. */
  const wobble = (x: number) => {
    const xu = u(x);
    return (
      2.6 * Math.sin(xu * Math.PI * 3.6 + 0.4 + 0.2 * t) +
      1.25 * Math.sin(xu * Math.PI * 8.2 + 0.9) +
      0.9 * Math.sin(xu * Math.PI * 13.8 + 1.4) +
      0.55 * Math.sin(xu * Math.PI * 21 + 1.9) +
      0.4 * Math.sin(xu * Math.PI * 29.5 + 0.1) +
      0.65 * Math.sin(5.8 * xu * 2 * Math.PI + 0.3 + t * 1.4 * Math.PI)
    );
  };
  const wobbleAmp = 1.22 - 0.2 * t;
  /**
   * Sube más tarde que t²: no “compite” con el ease-out del crono (al final `t` ya va lento) y
   * no acelera el cierre mientras la mancha aún baja; solo al acercarse a 1 asegura bajar a pie.
   */
  const toUniform = Math.min(1, Math.pow(t, 3.95));
  const wobbleFade = 1 - Math.min(1, Math.pow(t, 2.1));
  const pts: string[] = [];
  for (let i = 0; i <= PAINT_WIPE_SEGMENTS; i++) {
    const x = (i / PAINT_WIPE_SEGMENTS) * 100;
    const col = columnProgress(x);
    const m = col * (1 - toUniform) + 1 * toUniform;
    const yCore = t * 100 * m;
    const w = wobble(x);
    const wPart =
      w * wiggleRise * wobbleAmp * wobbleFade + 0.12 * w * (1 - wiggleRise) * wobbleFade;
    const y = Math.min(100, Math.max(0, yCore + wPart));
    pts.push(`${x.toFixed(2)}% ${y.toFixed(3)}%`);
  }
  return `polygon(${pts.join(', ')}, 100% 100%, 0% 100%)`;
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function ObjectIcon({
  id,
  color,
  accent,
  size,
}: {
  id: ObjectItemId;
  color?: string | null;
  accent?: string | null;
  size?: number;
}) {
  const c = color   || OBJECT_ICON_BASE[id];
  const a = accent  || OBJECT_ICON_ACCENT[id];
  const d = `rgba(0,0,0,0.28)`;
  const w = `rgba(255,255,255,0.20)`;
  const s = size || 48;
  const icons: Record<ObjectItemId, JSX.Element> = {

    camera: <>
      {/* grip — textured left side */}
      <rect x="2" y="18" width="10" height="26" rx="5" fill={c}/>
      <rect x="3" y="20" width="2.5" height="4" rx="1" fill={d}/>
      <rect x="3" y="26" width="2.5" height="4" rx="1" fill={d}/>
      <rect x="3" y="32" width="2.5" height="4" rx="1" fill={d}/>
      <rect x="3" y="38" width="2.5" height="4" rx="1" fill={d}/>
      {/* body */}
      <rect x="2" y="18" width="44" height="26" rx="6" fill={c}/>
      {/* top edge highlight */}
      <rect x="3" y="18" width="43" height="3" rx="3" fill={w} opacity=".4"/>
      {/* pentaprism hump */}
      <rect x="14" y="8" width="20" height="12" rx="4" fill={c}/>
      <rect x="14" y="8" width="20" height="3" rx="3" fill={w} opacity=".3"/>
      {/* flash unit */}
      <rect x="4" y="9" width="9" height="7" rx="2" fill={c}/>
      <rect x="4" y="9" width="9" height="3" rx="2" fill="rgba(255,220,80,0.5)"/>
      <rect x="5" y="10" width="7" height="2" rx="1" fill="rgba(255,245,180,0.7)"/>
      {/* shutter button */}
      <ellipse cx="38" cy="13" rx="5" ry="3.5" fill={d} opacity=".5"/>
      <ellipse cx="38" cy="12" rx="4.5" ry="3" fill="#C8C8C8"/>
      <ellipse cx="37" cy="11" rx="2" ry="1.2" fill="white" opacity=".5"/>
      {/* mode dial */}
      <ellipse cx="28" cy="10" rx="5" ry="4" fill={d}/>
      <ellipse cx="28" cy="9.5" rx="4.5" ry="3.5" fill="#444"/>
      <line x1="28" y1="6" x2="28" y2="8" stroke="#aaa" strokeWidth="1" strokeLinecap="round"/>
      <line x1="31" y1="7" x2="30" y2="8.8" stroke="#aaa" strokeWidth=".8" strokeLinecap="round"/>
      <line x1="25" y1="7" x2="26" y2="8.8" stroke="#aaa" strokeWidth=".8" strokeLinecap="round"/>
      {/* viewfinder */}
      <rect x="36" y="19" width="8" height="6" rx="2" fill="rgba(10,10,30,0.8)"/>
      <rect x="37" y="20" width="4" height="3" rx="1" fill={a} opacity=".35"/>
      {/* lens mount ring outer */}
      <circle cx="19" cy="32" r="13" fill={d}/>
      <circle cx="19" cy="32" r="12" fill="#222" opacity=".9"/>
      {/* lens barrel rings */}
      <circle cx="19" cy="32" r="10" fill="#1a1a1a"/>
      <circle cx="19" cy="32" r="10" fill="none" stroke="#444" strokeWidth="1"/>
      <circle cx="19" cy="32" r="7.5" fill="#111"/>
      <circle cx="19" cy="32" r="7.5" fill="none" stroke="#333" strokeWidth=".8"/>
      {/* lens glass */}
      <circle cx="19" cy="32" r="6" fill={a} opacity=".18"/>
      <circle cx="19" cy="32" r="5" fill={a} opacity=".25"/>
      {/* lens reflections */}
      <ellipse cx="15.5" cy="27.5" rx="3" ry="1.8" fill="white" opacity=".2" transform="rotate(-35 15.5 27.5)"/>
      <circle cx="14.5" cy="27" r="1.2" fill="white" opacity=".4"/>
      <ellipse cx="22" cy="35.5" rx="2" ry="1.2" fill={a} opacity=".3" transform="rotate(20 22 35.5)"/>
      {/* ring text dots */}
      {[0,45,90,135,180,225,270,315].map((deg,i)=>{
        const r2=11, rad=deg*Math.PI/180;
        return <circle key={i} cx={19+r2*Math.cos(rad)} cy={32+r2*Math.sin(rad)} r=".6" fill="#555"/>;
      })}
      {/* status LED */}
      <circle cx="44" cy="22" r="1.8" fill="#34D399" opacity=".9"/>
      <circle cx="44" cy="22" r=".9" fill="white" opacity=".6"/>
      {/* brand text area */}
      <rect x="26" y="38" width="16" height="4" rx="1" fill={d} opacity=".3"/>
    </>,

    libro: <>
      {/* shadow */}
      <rect x="8" y="5" width="30" height="40" rx="4" fill={d} opacity=".5"/>
      {/* spine */}
      <rect x="7" y="4" width="8" height="40" rx="3" fill={c} opacity=".7"/>
      {/* cover */}
      <rect x="7" y="4" width="30" height="40" rx="3" fill={c}/>
      {/* spine shadow */}
      <rect x="7" y="4" width="8" height="40" rx="3" fill={d} opacity=".3"/>
      {/* pages edge right */}
      <rect x="35" y="6" width="3" height="36" rx="1" fill={w} opacity=".5"/>
      <rect x="36" y="6" width="1" height="36" rx=".5" fill={w} opacity=".4"/>
      {/* top page lines */}
      <rect x="17" y="13" width="14" height="2" rx="1" fill={w} opacity=".5"/>
      <rect x="17" y="18" width="14" height="2" rx="1" fill={w} opacity=".5"/>
      <rect x="17" y="23" width="10" height="2" rx="1" fill={w} opacity=".5"/>
      <rect x="17" y="28" width="14" height="2" rx="1" fill={w} opacity=".5"/>
      <rect x="17" y="33" width="8"  height="2" rx="1" fill={w} opacity=".5"/>
      {/* bookmark */}
      <path d="M31 4 L35 4 L35 16 L33 14 L31 16 Z" fill="#EF4444" opacity=".8"/>
      {/* cover emboss line */}
      <rect x="14" y="7" width="20" height="1" rx=".5" fill={w} opacity=".3"/>
    </>,

    vino: <>
      {/* capsule / foil */}
      <rect x="19" y="3" width="10" height="5" rx="2" fill={d} opacity=".6"/>
      <rect x="18" y="5" width="12" height="7" rx="2" fill={a}/>
      {/* neck */}
      <rect x="20" y="11" width="8" height="12" rx="2" fill={c}/>
      {/* shoulder + body */}
      <path d="M15 22 Q14 19 20 18 L28 18 Q34 19 33 22 L33 43 Q33 46 30 46 L18 46 Q15 46 15 43 Z" fill={c}/>
      {/* glass shine left */}
      <path d="M17 24 Q16 30 17 38" stroke={w} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".5"/>
      {/* label */}
      <rect x="16" y="28" width="16" height="11" rx="2" fill={w} opacity=".22"/>
      <rect x="17" y="30" width="14" height="1.5" rx=".7" fill={w} opacity=".5"/>
      <rect x="18" y="33" width="12" height="1"   rx=".5" fill={w} opacity=".4"/>
      <rect x="18" y="35" width="10" height="1"   rx=".5" fill={w} opacity=".4"/>
      {/* bottom punt */}
      <ellipse cx="24" cy="43" rx="7" ry="2" fill={d} opacity=".4"/>
      {/* cork */}
      <rect x="21" y="3" width="6" height="4" rx="1.5" fill="#D97706"/>
      <rect x="21" y="3" width="6" height="1.5" rx="1" fill="#F59E0B"/>
    </>,

    zapatillas: <>
      {/* sole */}
      <path d="M5 38 Q5 44 12 44 L42 44 Q46 44 46 40 L46 37 Q42 35 28 35 L5 38Z" fill={d} opacity=".7"/>
      <path d="M5 37 Q5 43 12 43 L42 43 Q46 43 46 39 L46 36 Q42 34 28 34 L5 37Z" fill={c} opacity=".6"/>
      {/* upper */}
      <path d="M5 36 L5 22 Q5 14 12 14 L22 14 L26 10 L36 10 L38 14 L42 16 Q46 18 46 24 L46 36 Z" fill={c}/>
      {/* toe cap */}
      <path d="M5 36 L5 26 Q5 18 11 18 L18 18 Q12 22 10 28 L8 36Z" fill={d} opacity=".2"/>
      {/* tongue */}
      <path d="M22 14 L26 10 L30 10 L32 14 L28 18 L24 18 Z" fill={c} opacity=".85"/>
      <path d="M25 10 L27 10 L29 14 L27 17 L25 17 L23 14Z" fill={w} opacity=".2"/>
      {/* laces */}
      <path d="M22 20 Q28 18 34 20" stroke={w} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".8"/>
      <path d="M22 23 Q28 21 34 23" stroke={w} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".6"/>
      <path d="M23 26 Q28 24 33 26" stroke={w} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".4"/>
      {/* heel tab */}
      <rect x="42" y="16" width="4" height="12" rx="2" fill={a} opacity=".6"/>
      {/* swoosh */}
      <path d="M10 30 Q20 24 34 28" stroke={a} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".7"/>
    </>,

    piruleta: <>
      {/* stick */}
      <rect x="22" y="30" width="4" height="17" rx="2" fill={c} opacity=".6"/>
      {/* candy head outer */}
      <circle cx="24" cy="20" r="17" fill={d} opacity=".3"/>
      <circle cx="24" cy="20" r="16" fill={c}/>
      {/* swirl segments */}
      <path d="M24 4 A16 16 0 0 1 40 20" fill={a} opacity=".5"/>
      <path d="M40 20 A16 16 0 0 1 24 36" fill={d} opacity=".15"/>
      <path d="M24 36 A16 16 0 0 1 8 20"  fill={a} opacity=".35"/>
      <path d="M8 20 A16 16 0 0 1 24 4"   fill={d} opacity=".1"/>
      {/* inner swirl */}
      <path d="M24 10 A10 10 0 0 1 34 20" fill={a} opacity=".4"/>
      <path d="M34 20 A10 10 0 0 1 24 30" fill={d} opacity=".12"/>
      <path d="M24 30 A10 10 0 0 1 14 20" fill={a} opacity=".3"/>
      {/* centre dot */}
      <circle cx="24" cy="20" r="4" fill={c}/>
      <circle cx="24" cy="20" r="2" fill={w} opacity=".4"/>
      {/* shine */}
      <ellipse cx="17" cy="13" rx="4" ry="2.5" fill={w} opacity=".35" transform="rotate(-40 17 13)"/>
      <circle  cx="15" cy="12" r="1.5" fill="white" opacity=".45"/>
      {/* stick wrapper twist */}
      <rect x="21.5" y="32" width="5" height="2" rx="1" fill={a} opacity=".5"/>
      <rect x="21.5" y="36" width="5" height="2" rx="1" fill={a} opacity=".4"/>
      <rect x="21.5" y="40" width="5" height="2" rx="1" fill={a} opacity=".3"/>
    </>,

    peluche: <>
      {/* === OREJAS === */}
      {/* ear shadows */}
      <circle cx="9"  cy="10" r="8"   fill={d} opacity=".3"/>
      <circle cx="39" cy="10" r="8"   fill={d} opacity=".3"/>
      {/* ear outer */}
      <circle cx="9"  cy="10" r="7.5" fill={c}/>
      <circle cx="39" cy="10" r="7.5" fill={c}/>
      {/* ear inner */}
      <circle cx="9"  cy="10" r="4"   fill={a} opacity=".55"/>
      <circle cx="39" cy="10" r="4"   fill={a} opacity=".55"/>
      {/* ear stitch */}
      <circle cx="9"  cy="10" r="6.5" fill="none" stroke={d} strokeWidth=".6" strokeDasharray="2 2" opacity=".3"/>
      <circle cx="39" cy="10" r="6.5" fill="none" stroke={d} strokeWidth=".6" strokeDasharray="2 2" opacity=".3"/>

      {/* === CABEZA === */}
      <circle cx="24" cy="20" r="15.5" fill={d} opacity=".2" transform="translate(1,1)"/>
      <circle cx="24" cy="20" r="15"   fill={c}/>
      {/* head sheen top-left */}
      <ellipse cx="17" cy="13" rx="5" ry="3.5" fill={w} opacity=".22" transform="rotate(-30 17 13)"/>
      {/* head stitch */}
      <circle cx="24" cy="20" r="13.5" fill="none" stroke={d} strokeWidth=".7" strokeDasharray="2.5 2.5" opacity=".25"/>

      {/* === MEJILLAS === */}
      <ellipse cx="13" cy="23" rx="4.5" ry="2.8" fill="rgba(220,100,80,0.22)" transform="rotate(-10 13 23)"/>
      <ellipse cx="35" cy="23" rx="4.5" ry="2.8" fill="rgba(220,100,80,0.22)" transform="rotate(10 35 23)"/>

      {/* === OJOS === */}
      {/* left eye */}
      <ellipse cx="18" cy="18" rx="3" ry="3.2" fill="rgba(26,10,0,0.85)"/>
      <circle  cx="16.8" cy="16.5" r="1.1" fill="white" opacity=".75"/>
      <circle  cx="19.5" cy="19.5" r=".6"  fill="white" opacity=".3"/>
      {/* right eye */}
      <ellipse cx="30" cy="18" rx="3" ry="3.2" fill="rgba(26,10,0,0.85)"/>
      <circle  cx="28.8" cy="16.5" r="1.1" fill="white" opacity=".75"/>
      <circle  cx="31.5" cy="19.5" r=".6"  fill="white" opacity=".3"/>

      {/* === HOCICO === */}
      <ellipse cx="24" cy="27" rx="7.5" ry="5.5" fill={a} opacity=".45"/>
      <ellipse cx="24" cy="27" rx="6.5" ry="4.5" fill={a} opacity=".3"/>
      {/* nose */}
      <ellipse cx="24" cy="23.5" rx="3.5" ry="2.2" fill="rgba(40,15,10,0.85)"/>
      <ellipse cx="22.8" cy="22.8" rx="1.2" ry=".8" fill="white" opacity=".35"/>
      {/* mouth — center line + curve */}
      <line x1="24" y1="25" x2="24" y2="27.5" stroke="rgba(100,45,15,0.45)" strokeWidth="1" strokeLinecap="round"/>
      <path d="M20 27.5 Q24 31 28 27.5" fill="none" stroke="rgba(100,45,15,0.45)" strokeWidth="1.2" strokeLinecap="round"/>

      {/* === BRAZOS === */}
      {/* left arm */}
      <rect x="2" y="31" width="8" height="14" rx="4" fill={c} transform="rotate(18 6 31)"/>
      <ellipse cx="5" cy="45" rx="5" ry="3.5" fill={c} opacity=".8"/>
      {/* right arm */}
      <rect x="38" y="31" width="8" height="14" rx="4" fill={c} transform="rotate(-18 42 31)"/>
      <ellipse cx="43" cy="45" rx="5" ry="3.5" fill={c} opacity=".8"/>

      {/* === CUERPO === */}
      <ellipse cx="24" cy="41" rx="13.5" ry="10"  fill={d} opacity=".2" transform="translate(1,1)"/>
      <ellipse cx="24" cy="40" rx="13.5" ry="10.5" fill={c}/>
      {/* body stitch */}
      <ellipse cx="24" cy="40" rx="12" ry="9" fill="none" stroke={d} strokeWidth=".7" strokeDasharray="2.5 2.5" opacity=".25"/>

      {/* === BARRIGA === */}
      <ellipse cx="24" cy="40" rx="7.5" ry="6.5" fill={a} opacity=".4"/>
      {/* belly seam stitches */}
      {[34,37,40,43].map((y,i)=>(
        <rect key={i} x="23.2" y={y} width="1.6" height="2" rx=".8" fill={d} opacity=".3"/>
      ))}

      {/* === PIERNAS (peek at bottom) === */}
      <ellipse cx="17" cy="48" rx="6"   ry="4" fill={c} opacity=".7"/>
      <ellipse cx="17" cy="48" rx="3.5" ry="2" fill={a} opacity=".4"/>
      <ellipse cx="31" cy="48" rx="6"   ry="4" fill={c} opacity=".7"/>
      <ellipse cx="31" cy="48" rx="3.5" ry="2" fill={a} opacity=".4"/>
    </>,

    cuchillo: <>
      {/* handle shadow */}
      <rect x="16" y="33" width="16" height="14" rx="4" fill={d} opacity=".4"/>
      {/* handle */}
      <rect x="15" y="32" width="16" height="13" rx="4" fill={a} opacity=".85"/>
      {/* handle rivets */}
      <circle cx="19" cy="36" r="1.8" fill={d} opacity=".5"/>
      <circle cx="24" cy="36" r="1.8" fill={d} opacity=".5"/>
      <circle cx="29" cy="36" r="1.8" fill={d} opacity=".5"/>
      {/* handle grain lines */}
      <rect x="16" y="38" width="14" height=".8" rx=".4" fill={d} opacity=".3"/>
      <rect x="16" y="40" width="14" height=".8" rx=".4" fill={d} opacity=".3"/>
      <rect x="16" y="42" width="14" height=".8" rx=".4" fill={d} opacity=".3"/>
      {/* bolster / guard */}
      <rect x="14" y="29" width="20" height="5" rx="1" fill={c} opacity=".5"/>
      {/* blade */}
      <path d="M22 4 L28 4 L31 29 L17 29 Z" fill={c}/>
      {/* blade bevel */}
      <path d="M24 5 L26.5 5 L29 29 L24 29 Z" fill={w} opacity=".2"/>
      {/* blade edge highlight */}
      <path d="M26 6 L29.5 29" stroke={w} strokeWidth="1" fill="none" opacity=".35" strokeLinecap="round"/>
      {/* blade tip glint */}
      <ellipse cx="24.5" cy="7" rx="2" ry="1" fill={w} opacity=".4" transform="rotate(-5 24 7)"/>
    </>,

    botella: <>
      {/* === CORCHO === */}
      <rect x="20" y="1" width="8" height="7" rx="1.5" fill="#C8924A"/>
      {/* cork grain lines */}
      <rect x="21" y="3"  width="6" height=".8" rx=".4" fill="rgba(0,0,0,0.18)"/>
      <rect x="21" y="5"  width="6" height=".8" rx=".4" fill="rgba(0,0,0,0.14)"/>
      <rect x="22" y="3" width="2" height="4" rx="1" fill="rgba(255,255,255,0.15)"/>

      {/* === CUELLO === */}
      <rect x="21" y="7" width="6" height="9" rx="1" fill={c} opacity=".85"/>
      {/* neck left reflection */}
      <rect x="22" y="8" width="1.5" height="7" rx=".7" fill="rgba(255,255,255,0.25)"/>

      {/* === HOMBROS === */}
      <path d="M14 16 Q14 14 21 14 L27 14 Q34 14 34 16 L34 20 L14 20 Z" fill={c}/>

      {/* === CUERPO === */}
      <rect x="14" y="19" width="20" height="24" fill={c}/>
      {/* left reflection — long */}
      <rect x="16" y="21" width="2.5" height="18" rx="1.2" fill="rgba(255,255,255,0.28)"/>
      {/* secondary small reflection */}
      <rect x="20" y="23" width="1" height="10" rx=".5" fill="rgba(255,255,255,0.13)"/>

      {/* === BASE === */}
      <path d="M14 43 L14 45 Q14 47 24 47 Q34 47 34 45 L34 43 Z" fill={c} opacity=".9"/>
      {/* punt indentation */}
      <ellipse cx="24" cy="46" rx="5" ry="1.2" fill={d} opacity=".4"/>

      {/* === SCROLL inside — slightly rotated === */}
      {/* scroll shadow */}
      <rect x="18.5" y="23.5" width="13" height="17" rx="2" fill={d} opacity=".15" transform="rotate(8 24 32)"/>
      {/* scroll body — cream parchment */}
      <rect x="18" y="22" width="13" height="17" rx="2"
        fill="#FEF3C7" transform="rotate(8 24 32)"/>
      {/* scroll top rolled edge */}
      <rect x="18" y="22" width="13" height="3.5" rx="1.5"
        fill="#D4B870" transform="rotate(8 24 32)"/>
      <rect x="19" y="22.5" width="11" height="1.5" rx=".7"
        fill="rgba(255,255,255,0.35)" transform="rotate(8 24 32)"/>
      {/* scroll bottom rolled edge */}
      <rect x="18" y="35.5" width="13" height="3.5" rx="1.5"
        fill="#D4B870" transform="rotate(8 24 32)"/>
      <rect x="19" y="36.5" width="11" height="1.5" rx=".7"
        fill="rgba(255,255,255,0.25)" transform="rotate(8 24 32)"/>
      {/* text lines on scroll */}
      {[26, 28, 30, 32, 34].map((y,i) => (
        <rect key={i} x="20" y={y} width={i%2===0?10:8} height="1"
          rx=".5" fill="rgba(100,60,10,0.35)"
          transform="rotate(8 24 32)"/>
      ))}
      {/* string / twine around middle */}
      <rect x="17.5" y="30.5" width="14" height="1.5" rx=".7"
        fill="#B8860B" opacity=".8" transform="rotate(8 24 32)"/>
      <rect x="17.5" y="30.5" width="14" height=".5" rx=".3"
        fill="rgba(255,255,255,0.3)" transform="rotate(8 24 32)"/>
    </>,

    pasaporte: <>
      {/* shadow */}
      <rect x="9" y="6" width="30" height="38" rx="4" fill={d} opacity=".4"/>
      {/* cover */}
      <rect x="8" y="5" width="30" height="38" rx="4" fill={c}/>
      {/* spine */}
      <rect x="8" y="5" width="6" height="38" rx="3" fill={d} opacity=".3"/>
      {/* cover embossed frame */}
      <rect x="12" y="9" width="22" height="18" rx="2" fill="none" stroke={w} strokeWidth=".8" opacity=".4"/>
      {/* emblem circle */}
      <circle cx="23" cy="18" r="7" fill="none" stroke={w} strokeWidth="1" opacity=".5"/>
      <circle cx="23" cy="18" r="4" fill={w} opacity=".15"/>
      {/* emblem lines (eagle/crest suggestion) */}
      <path d="M19 18 L23 14 L27 18" stroke={w} strokeWidth="1" fill="none" opacity=".5"/>
      <path d="M20 18 L23 22 L26 18" stroke={w} strokeWidth="1" fill="none" opacity=".4"/>
      {/* country text lines */}
      <rect x="15" y="27" width="16" height="1.5" rx=".7" fill={w} opacity=".4"/>
      <rect x="17" y="30" width="12" height="1.5" rx=".7" fill={w} opacity=".3"/>
      {/* page edge */}
      <rect x="36" y="7" width="3" height="34" rx="1.5" fill={w} opacity=".35"/>
      {/* bottom data strip */}
      <rect x="12" y="37" width="20" height="1.2" rx=".6" fill={w} opacity=".35"/>
      <rect x="12" y="39" width="20" height="1.2" rx=".6" fill={w} opacity=".25"/>
    </>,

    gafas: <>
      {/* left arm */}
      <path d="M3 20 L3 28 Q3 30 5 30 L8 30" stroke={c} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* right arm */}
      <path d="M45 20 L45 28 Q45 30 43 30 L40 30" stroke={c} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* left lens frame */}
      <circle cx="15" cy="24" r="10.5" fill="none" stroke={c} strokeWidth="4"/>
      {/* right lens frame */}
      <circle cx="33" cy="24" r="10.5" fill="none" stroke={c} strokeWidth="4"/>
      {/* bridge */}
      <path d="M24.5 24 L23.5 24" stroke={c} strokeWidth="4" strokeLinecap="round"/>
      {/* left lens tint */}
      <circle cx="15" cy="24" r="8" fill={c} opacity=".35"/>
      {/* right lens tint */}
      <circle cx="33" cy="24" r="8" fill={c} opacity=".35"/>
      {/* left lens reflection */}
      <ellipse cx="11" cy="19" rx="3.5" ry="2" fill={w} opacity=".45" transform="rotate(-30 11 19)"/>
      <circle cx="10" cy="18" r="1.2" fill="white" opacity=".5"/>
      {/* right lens reflection */}
      <ellipse cx="29" cy="19" rx="3.5" ry="2" fill={w} opacity=".35" transform="rotate(-30 29 19)"/>
      {/* nose pad dots */}
      <circle cx="22" cy="26" r="1" fill={c} opacity=".6"/>
      <circle cx="26" cy="26" r="1" fill={c} opacity=".6"/>
    </>,

    mapa: <>
      {/* map shadow */}
      <path d="M5 9 L19 4 L33 10 L45 5 L45 42 L31 47 L17 41 L5 46 Z" fill={d} opacity=".3" transform="translate(1,1)"/>
      {/* map panels */}
      <path d="M5 9 L19 4 L19 41 L5 46 Z" fill={c}/>
      <path d="M19 4 L33 10 L33 47 L19 41 Z" fill={c} opacity=".85"/>
      <path d="M33 10 L45 5 L45 42 L33 47 Z" fill={c} opacity=".7"/>
      {/* fold lines */}
      <line x1="19" y1="4" x2="19" y2="41" stroke={d} strokeWidth="1" opacity=".5"/>
      <line x1="33" y1="10" x2="33" y2="47" stroke={d} strokeWidth="1" opacity=".5"/>
      <line x1="5" y1="27" x2="45" y2="27" stroke={d} strokeWidth=".8" strokeDasharray="3 3" opacity=".3"/>
      {/* route */}
      <path d="M9 38 Q14 30 20 26 Q28 22 34 28 Q40 32 43 26" stroke={a} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="4 2"/>
      {/* location pin */}
      <circle cx="20" cy="26" r="3.5" fill={a}/>
      <circle cx="20" cy="26" r="1.5" fill={w} opacity=".7"/>
      {/* destination pin */}
      <path d="M43 26 L43 19 Q43 15 40 15 Q37 15 37 19 Q37 23 40 26 Q41.5 27.5 43 26Z" fill={a}/>
      <circle cx="40" cy="19" r="1.5" fill={w} opacity=".6"/>
    </>,

    paraguas: <>
      {/* canopy shadow */}
      <path d="M5 28 Q5 6 24 6 Q43 6 43 28 Z" fill={d} opacity=".25" transform="translate(1,2)"/>
      {/* canopy panels */}
      <path d="M5 28 Q5 6 24 6 Q43 6 43 28 Z" fill={c}/>
      {/* panel dividers */}
      {[14,20,24,28,34].map((x,i)=>(
        <line key={i} x1={x} y1={6+(i===2?0:2)} x2={5+i*9.5} y2={28} stroke={d} strokeWidth="1" opacity=".3"/>
      ))}
      {/* panel shading alternating */}
      <path d="M5 28 Q5 6 14 6 L14 28Z" fill={d} opacity=".12"/>
      <path d="M24 6 Q33 6 43 28 L33 28Z" fill={d} opacity=".08"/>
      {/* canopy rim */}
      <path d="M5 28 Q5 6 24 6 Q43 6 43 28" fill="none" stroke={d} strokeWidth="1" opacity=".4"/>
      {/* scalloped edge */}
      {[0,1,2,3,4,5].map(i=>(
        <path key={i} d={`M${5+i*6.4} 28 Q${8.2+i*6.4} 32 ${11.4+i*6.4} 28`} fill={a} opacity=".5" stroke="none"/>
      ))}
      {/* shaft */}
      <rect x="22.5" y="28" width="3" height="16" rx="1.5" fill={c} opacity=".8"/>
      {/* ferrule top */}
      <circle cx="24" cy="7" r="2" fill={d} opacity=".5"/>
      {/* handle */}
      <path d="M22.5 44 Q22.5 50 17 50 Q12 50 12 46" stroke={c} strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      {/* handle tip */}
      <circle cx="12" cy="46" r="2.5" fill={c} opacity=".7"/>
      {/* canopy shine */}
      <ellipse cx="17" cy="14" rx="4" ry="2.5" fill={w} opacity=".25" transform="rotate(-20 17 14)"/>
    </>,

  };
  return (
    <svg viewBox="0 0 48 48" width={s} height={s} style={{ display:'block', overflow:'visible' }}>
      {icons[id]}
    </svg>
  );
}

// ── Paint Can Station (lúdico, lateral) ──────────────────────────────────────
interface PaintCanStationProps {
  color: string;
  brushMode: boolean;
  onColorChange: (color: string) => void;
  onBrushModeChange: Dispatch<SetStateAction<boolean>>;
  onTagDragStart?: (tag: string, x: number, y: number, idx: number) => void;
  tagDraggingIdx?: number | null;
  usedTagIdxs?: number[];
  /** Aviso al intentar poner en dos tiras el mismo texto (centrado, mismo estilo que el aviso de color). */
  onTagLabelCollision?: () => void;
}

function PaintCanStation({
  color,
  brushMode,
  onColorChange,
  onBrushModeChange,
  onTagDragStart,
  tagDraggingIdx = null,
  usedTagIdxs = [],
  onTagLabelCollision,
}: PaintCanStationProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [hsl, setHsl] = useState(() => hexToHsl(color));
  const wheelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fxTimersRef = useRef<number[]>([]);
  const fxIdRef = useRef(1);
  const [wheelCursor, setWheelCursor] = useState({ x: WHEEL_DISPLAY_SIZE / 2, y: WHEEL_DISPLAY_SIZE / 2 });
  const [wheelDragging, setWheelDragging] = useState(false);
  const [confirmPulse, setConfirmPulse] = useState(false);
  const [canHovered, setCanHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; size: number; tx: number; ty: number }>>([]);
  const [vintageTags, setVintageTags] = useState<string[]>(() =>
    Array.from({ length: 5 }, (_, i) => `Texto ${i + 1}`)
  );
  const [editingTagIdx, setEditingTagIdx] = useState<number | null>(null);
  const [editingTagDraft, setEditingTagDraft] = useState('');
  const editTagInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setHsl(hexToHsl(color));
  }, [color]);

  const applyHslColor = (next: { h: number; s: number; l: number }) => {
    setHsl(next);
    onColorChange(hslToHex(next.h, next.s, next.l));
  };

  const setChannel = (channel: 'h' | 's' | 'l', value: number) => {
    const next = { ...hsl, [channel]: value };
    applyHslColor(next);
  };

  const colorLabel = useMemo(() => {
    if (hsl.s < 12) return hsl.l < 20 ? 'negro carbón' : hsl.l > 82 ? 'blanco humo' : 'gris nube';
    const names = ['rojo', 'naranja', 'amarillo', 'verde', 'cian', 'azul', 'violeta', 'magenta'];
    return names[Math.floor((hsl.h % 360) / 45)];
  }, [hsl.h, hsl.s, hsl.l]);

  useEffect(() => {
    const radius = WHEEL_RADIUS;
    const angle = (hsl.h * Math.PI) / 180;
    const dist = (hsl.s / 100) * radius;
    setWheelCursor({
      x: WHEEL_DISPLAY_SIZE / 2 + Math.cos(angle) * dist,
      y: WHEEL_DISPLAY_SIZE / 2 + Math.sin(angle) * dist,
    });
  }, [hsl.h, hsl.s]);

  useEffect(() => {
    if (!panelOpen) return;
    const canvas = wheelCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cx = WHEEL_CANVAS_SIZE / 2;
    const cy = WHEEL_CANVAS_SIZE / 2;
    const radius = WHEEL_CANVAS_SIZE / 2 - 2;
    const image = ctx.createImageData(WHEEL_CANVAS_SIZE, WHEEL_CANVAS_SIZE);
    const data = image.data;
    for (let y = 0; y < WHEEL_CANVAS_SIZE; y += 1) {
      for (let x = 0; x < WHEEL_CANVAS_SIZE; x += 1) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const idx = (y * WHEEL_CANVAS_SIZE + x) * 4;
        if (dist > radius) {
          data[idx + 3] = 0;
          continue;
        }
        const hue = (((Math.atan2(dy, dx) * 180) / Math.PI) + 360) % 360;
        const sat = Math.min((dist / radius) * 100, 100);
        const satNorm = sat / 100;
        const centerBoost = Math.max(0, 1 - satNorm);
        // Refuerza el "núcleo blanco" visual sin alterar la lógica de picking.
        const displayLightness = Math.round(
          Math.min(100, hsl.l + (100 - hsl.l) * Math.pow(centerBoost, 1.35))
        );
        const hex = hslToHex(Math.round(hue), Math.round(sat), displayLightness);
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);
  }, [panelOpen, hsl.l]);

  const pickColorFromWheel = (clientX: number, clientY: number) => {
    const wheel = wheelCanvasRef.current;
    if (!wheel) return;
    const rect = wheel.getBoundingClientRect();
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    const cx = WHEEL_DISPLAY_SIZE / 2;
    const cy = WHEEL_DISPLAY_SIZE / 2;
    const radius = WHEEL_RADIUS;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > radius) {
      x = cx + (dx / dist) * radius;
      y = cy + (dy / dist) * radius;
    }

    const hue = Math.round((((Math.atan2(y - cy, x - cx) * 180) / Math.PI) + 360) % 360);
    const saturation = Math.round((Math.min(Math.sqrt((x - cx) ** 2 + (y - cy) ** 2), radius) / radius) * 100);
    const next = { h: hue, s: saturation, l: hsl.l };
    applyHslColor(next);
    setWheelCursor({ x, y });
  };

  useEffect(() => {
    if (!wheelDragging) return;
    const stop = () => setWheelDragging(false);
    window.addEventListener('pointerup', stop);
    return () => window.removeEventListener('pointerup', stop);
  }, [wheelDragging]);

  useEffect(() => () => {
    fxTimersRef.current.forEach((id) => window.clearTimeout(id));
  }, []);

  const spawnParticles = () => {
    const nextParticles = Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2;
      const dist = 20 + Math.random() * 32;
      return {
        id: fxIdRef.current++,
        size: 4 + Math.random() * 6,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
      };
    });
    setParticles(nextParticles);
    const clearTimer = window.setTimeout(() => setParticles([]), 850);
    fxTimersRef.current.push(clearTimer);
  };

  const startEditTag = (idx: number) => {
    setEditingTagIdx(idx);
    setEditingTagDraft(vintageTags[idx] ?? `Texto ${idx + 1}`);
  };

  const commitEditTag = () => {
    if (editingTagIdx == null) return;
    const defaultForSlot = `Texto ${(editingTagIdx ?? 0) + 1}`;
    const nextValue = editingTagDraft.trim() || defaultForSlot;
    const collides = vintageTags.some(
      (t, j) => j !== editingTagIdx && tagLabelsEqual(t, nextValue)
    );
    if (collides) {
      onTagLabelCollision?.();
      setTimeout(() => editTagInputRef.current?.focus(), 0);
      return;
    }
    setVintageTags((prev) => prev.map((t, i) => (i === editingTagIdx ? nextValue : t)));
    setEditingTagIdx(null);
    setEditingTagDraft('');
  };

  const cancelEditTag = () => {
    setEditingTagIdx(null);
    setEditingTagDraft('');
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: LEFT_TOOLS_CARD_WIDTH, margin: '0 auto', zIndex: 1, pointerEvents: 'auto' }}>
      <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="paint-can-shadow" />
        <div style={{ width: 74, height: 24, border: '4px solid #A8A8A8', borderBottom: 'none', borderRadius: '24px 24px 0 0', marginBottom: -3, zIndex: 3 }} />
        <div style={{ width: 142, height: 15, borderRadius: '6px 6px 2px 2px', background: 'linear-gradient(180deg,#d6d6d6 0%,#aaaaaa 45%,#7f7f7f 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', zIndex: 3 }} />
        <div
          role="button"
          tabIndex={0}
          onMouseEnter={() => setCanHovered(true)}
          onMouseLeave={() => setCanHovered(false)}
          onClick={() => {
            if (brushMode) return;
            setPanelOpen((v) => !v);
          }}
          onKeyDown={(e) => {
            if (brushMode) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setPanelOpen((v) => !v);
            }
          }}
          style={{
            marginTop: -1,
            width: 132,
            height: 186,
            border: 'none',
            borderRadius: '5px 5px 12px 12px',
            background: 'linear-gradient(90deg,rgba(0,0,0,0.24) 0%,rgba(255,255,255,0.14) 20%,rgba(255,255,255,0.04) 50%,rgba(0,0,0,0.15) 80%,rgba(0,0,0,0.3) 100%)',
            boxShadow: brushMode || panelOpen ? `0 0 22px ${color}AA, inset -6px 0 16px rgba(0,0,0,0.2)` : '4px 0 12px rgba(0,0,0,0.5), inset -8px 0 20px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            cursor: brushMode ? 'default' : 'pointer',
            position: 'relative',
            animation: 'paintCanFloat 4s ease-in-out infinite',
            outline: 'none',
          }}
        >
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '44%', background: color, boxShadow: `0 -4px 18px ${color}AA`, transition: 'background-color .25s' }}>
            <div style={{ position: 'absolute', top: -8, left: 0, right: 0, height: 16, background: color, borderRadius: '50%', filter: 'brightness(1.15)' }} />
          </div>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9 }}>
            {particles.map((particle) => (
              <div
                key={particle.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '58%',
                  width: particle.size,
                  height: particle.size,
                  borderRadius: '50%',
                  background: color,
                  boxShadow: `0 0 6px ${color}AA`,
                  ['--tx' as string]: `${particle.tx}px`,
                  ['--ty' as string]: `${particle.ty}px`,
                  animation: 'paintParticleFly 0.82s ease-out forwards',
                }}
              />
            ))}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (panelOpen) return;
              if (!brushMode) setPanelOpen(true);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            style={{
              position: 'absolute',
              top: 26,
              left: 10,
              right: 10,
              height: 142,
              background: '#fff',
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 5,
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.08)',
              padding: '7px 7px 9px',
              overflow: panelOpen ? 'visible' : 'hidden',
            }}
          >
            {!panelOpen ? (
              <>
                <div style={{ fontSize: 9, letterSpacing: 1.8, fontWeight: 900, color: '#374151' }}>CHROMA</div>
                <div style={{ position: 'relative', width: 38, height: 38 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: color, border: '2px solid rgba(0,0,0,0.14)' }} />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: 'rgba(15,23,42,0.26)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.35)',
                      opacity: canHovered ? 1 : 0,
                      transform: canHovered ? 'scale(1)' : 'scale(0.82)',
                      transition: 'opacity .18s ease, transform .18s ease',
                      pointerEvents: 'none',
                    }}
                  >
                    <svg viewBox="0 0 24 24" width={19} height={19} fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3c4.97 0 9 3.58 9 8 0 2.02-1.17 3.88-3.1 5.29-.9.66-1.86.96-2.79.96h-1.22c-.74 0-1.34.6-1.34 1.34 0 .3.1.58.27.8l.36.45c.2.26.31.58.31.91 0 .86-.69 1.55-1.55 1.55-5.25 0-9.5-4.25-9.5-9.5 0-5.42 4.58-9.8 10.56-9.8Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                      <circle cx="7.8" cy="10.2" r="1.1" fill="white"/>
                      <circle cx="11" cy="8.4" r="1.1" fill="white"/>
                      <circle cx="14.7" cy="8.8" r="1.1" fill="white"/>
                    </svg>
                  </div>
                </div>
                <div style={{ fontSize: 9, fontStyle: 'italic', color: '#6B7280' }}>{colorLabel}</div>
                <div style={{ fontSize: 8.5, padding: '2px 5px', borderRadius: 4, background: '#f1f5f9', color: '#475569', fontFamily: 'monospace' }}>{color.toUpperCase()}</div>
              </>
            ) : (
              <>
                <div style={{ position: 'relative', width: WHEEL_DISPLAY_SIZE, height: WHEEL_DISPLAY_SIZE, marginTop: 0 }}>
                  <canvas
                    ref={wheelCanvasRef}
                    width={WHEEL_CANVAS_SIZE}
                    height={WHEEL_CANVAS_SIZE}
                    style={{
                      width: WHEEL_DISPLAY_SIZE,
                      height: WHEEL_DISPLAY_SIZE,
                      borderRadius: '50%',
                      cursor: 'crosshair',
                      filter: 'brightness(1.08) saturate(1.12)',
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setWheelDragging(true);
                      e.currentTarget.setPointerCapture?.(e.pointerId);
                      pickColorFromWheel(e.clientX, e.clientY);
                    }}
                    onPointerMove={(e) => {
                      if (!wheelDragging) return;
                      e.stopPropagation();
                      pickColorFromWheel(e.clientX, e.clientY);
                    }}
                    onPointerUp={(e) => {
                      e.stopPropagation();
                      setWheelDragging(false);
                      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
                        e.currentTarget.releasePointerCapture?.(e.pointerId);
                      }
                    }}
                    onPointerLeave={() => setWheelDragging(false)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background:
                        'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 12%, rgba(255,255,255,0.34) 24%, rgba(255,255,255,0.12) 34%, rgba(255,255,255,0) 52%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: 14,
                      height: 14,
                      transform: 'translate(-50%, -50%)',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.88) 55%, rgba(255,255,255,0) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: wheelCursor.x,
                      top: wheelCursor.y,
                      width: 10,
                      height: 10,
                      transform: 'translate(-50%, -50%)',
                      border: '2px solid #fff',
                      borderRadius: '50%',
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.55)',
                      pointerEvents: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: -2,
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.95)',
                      boxShadow: '0 3px 9px rgba(15,23,42,0.35), inset 0 1px 2px rgba(255,255,255,0.7)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 9, paddingBottom: 14 }}>
                  <input
                    type="range"
                    className="paint-slider"
                    min={0}
                    max={100}
                    value={hsl.l}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setChannel('l', Number(e.target.value))}
                    style={{ width: '100%', background: `linear-gradient(90deg, hsl(${hsl.h}, ${hsl.s}%, 0%), hsl(${hsl.h}, ${hsl.s}%, 50%), hsl(${hsl.h}, ${hsl.s}%, 100%))` }}
                  />
                  <input
                    type="range"
                    className="paint-slider"
                    min={0}
                    max={100}
                    value={hsl.s}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setChannel('s', Number(e.target.value))}
                    style={{ width: '100%', background: `linear-gradient(90deg, hsl(${hsl.h}, 0%, ${hsl.l}%), hsl(${hsl.h}, 100%, ${hsl.l}%))` }}
                  />
                </div>
                <button
                  type="button"
                  className={`check-confirm-btn${confirmPulse ? ' pulse' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmPulse(true);
                    const closeTimer = window.setTimeout(() => {
                      setConfirmPulse(false);
                      setPanelOpen(false);
                    }, 220);
                    const particlesTimer = window.setTimeout(() => {
                      spawnParticles();
                    }, 460);
                    fxTimersRef.current.push(particlesTimer);
                    fxTimersRef.current.push(closeTimer);
                  }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: -12,
                    transform: 'translateX(-50%)',
                    width: 26,
                    height: 26,
                    border: `1px solid ${color}88`,
                    borderRadius: '50%',
                    fontSize: 13,
                    fontWeight: 900,
                    color: color,
                    background: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #F8FAFC 42%, #E2E8F0 100%)',
                    cursor: 'pointer',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 5px 14px rgba(15,23,42,0.28), inset 0 1px 2px rgba(255,255,255,0.95), 0 0 0 1px ${color}22`,
                  }}
                  aria-label="Confirmar color"
                >
                  ✓
                </button>
              </>
            )}
          </div>
        </div>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setPanelOpen(false);
              onBrushModeChange((v) => !v);
            }}
            style={{
              border: brushMode ? `1px solid ${color}99` : '1px solid rgba(217,119,6,0.45)',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 10.5,
              fontWeight: 700,
              fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
              color: '#fff',
              background: brushMode
                ? `linear-gradient(135deg, ${color}, #7C2D12)`
                : 'linear-gradient(135deg, rgba(180,83,9,0.95), rgba(120,53,15,0.95))',
              cursor: 'pointer',
              boxShadow: brushMode
                ? `0 0 0 1px ${color}33 inset, 0 5px 14px ${color}55`
                : '0 4px 12px rgba(120,53,15,0.38), inset 0 1px 0 rgba(255,255,255,0.18)',
              transition: 'all .18s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              letterSpacing: 0.2,
            }}
            aria-pressed={brushMode}
          >
            <span style={{ fontSize: 11, lineHeight: 1 }}>🖌</span>
            <span>Pincel</span>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: brushMode ? '#FDE68A' : 'rgba(255,255,255,0.35)',
                boxShadow: brushMode ? '0 0 8px rgba(253,230,138,0.8)' : 'none',
              }}
            />
          </button>
        </div>
        <div
          style={{
            width: '100%',
            marginTop: 10,
            borderTop: '1px solid rgba(100, 68, 42, 0.42)',
          }}
        />
        <div style={{ marginTop: 6, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, transform: 'translateY(2px)' }}>
            {vintageTags.map((tagText, idx) => {
              const isUsed = usedTagIdxs.includes(idx);
              return (
              <div
                key={idx}
                className={`vintage-tag-container${tagDraggingIdx === idx ? ' dragging' : ''}`}
                onMouseDown={(e) => {
                  if (editingTagIdx === idx || e.button !== 0 || isUsed) return;
                  e.preventDefault();
                  e.stopPropagation();
                  onTagDragStart?.(tagText, e.clientX, e.clientY, idx);
                }}
                title={isUsed ? 'Etiqueta ya usada' : 'Arrastra la etiqueta al objeto'}
                style={{
                  position: 'relative',
                  width: 150,
                  height: 50,
                  filter: isUsed ? 'grayscale(0.6) opacity(0.68)' : 'drop-shadow(2px 2px 6px rgba(0,0,0,0.25))',
                  transform: 'rotate(5deg)',
                  cursor: isUsed ? 'not-allowed' : editingTagIdx === idx ? 'text' : 'grab',
                }}
              >
                <div className="vintage-tag-sway" style={{ position: 'relative', width: '100%', height: '100%', transformOrigin: '18% 50%' }}>
                <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 56, height: 38 }}>
                  <div style={{ position: 'absolute', left: 4, top: 2, width: 45, height: 16, borderBottom: '3px solid #C49563', borderRadius: '0 0 60% 60%', boxShadow: 'inset 0 -1px 0 rgba(212,165,116,0.8)' }} />
                  <div style={{ position: 'absolute', left: 4, bottom: 2, width: 45, height: 16, borderTop: '3px solid #C49563', borderRadius: '60% 60% 0 0', boxShadow: 'inset 0 1px 0 rgba(212,165,116,0.8)' }} />
                  <div style={{ position: 'absolute', left: 42, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #D4A574 0%, #B88A5E 50%, #8B6F47 100%)', boxShadow: 'inset -1px -1px 2px rgba(0,0,0,0.35), inset 1px 1px 2px rgba(255,255,255,0.35), 0 1px 3px rgba(0,0,0,0.28)' }} />
                </div>
                <div className="vintage-tag-face" onClick={(e) => { e.stopPropagation(); if (!isUsed) startEditTag(idx); }} style={{
                  position: 'absolute',
                  left: 44,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 102,
                  height: 40,
                  background: 'linear-gradient(135deg, #F9F6F0 0%, #F0EBE0 100%)',
                  clipPath: 'polygon(0 20%, 0 80%, 12px 100%, 100% 100%, 100% 0, 12px 0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(139,69,19,0.15)',
                  overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(139,69,19,0.02) 2px,rgba(139,69,19,0.02) 4px),repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(139,69,19,0.02) 2px,rgba(139,69,19,0.02) 4px)', opacity: 0.5, pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(139,69,19,0.05) 0%, transparent 20%),radial-gradient(circle at 80% 70%, rgba(139,69,19,0.08) 0%, transparent 25%)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%', background: '#E8E0D0', border: '1px solid #C4B5A0', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.45)' }} />
                  {editingTagIdx === idx ? (
                    <input
                      ref={editingTagIdx === idx ? editTagInputRef : undefined}
                      autoFocus
                      value={editingTagDraft}
                      onChange={(e) => setEditingTagDraft(e.target.value)}
                      onBlur={commitEditTag}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          commitEditTag();
                        }
                        if (e.key === 'Escape') {
                          e.preventDefault();
                          cancelEditTag();
                        }
                      }}
                      style={{
                        position: 'relative',
                        zIndex: 3,
                        width: 68,
                        height: 24,
                        borderRadius: 6,
                        border: '1px solid rgba(139,69,19,0.32)',
                        background: 'rgba(255,255,255,0.82)',
                        color: '#5A4A3A',
                        fontSize: 16,
                        textAlign: 'center',
                        outline: 'none',
                        fontFamily: '"Brush Script MT", "Segoe Script", cursive',
                      }}
                    />
                  ) : (
                    <>
                      <div className="vintage-tag-text" style={{ position: 'relative', zIndex: 1, fontSize: 20, color: '#5A4A3A', transform: 'rotate(-3deg)', textShadow: '1px 1px 0 rgba(255,255,255,0.5)', fontFamily: '"Brush Script MT", "Segoe Script", cursive' }}>
                        {tagText}
                      </div>
                      <div className="vintage-tag-edit-hint" aria-hidden>
                        <svg viewBox="0 0 24 24" width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 20h4.2l9.9-9.9a1.5 1.5 0 0 0 0-2.1l-2.1-2.1a1.5 1.5 0 0 0-2.1 0L4 15.8V20Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                          <path d="m12.8 7.2 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </div>
                      {isUsed && (
                        <div
                          style={{
                            position: 'absolute',
                            right: 7,
                            top: 6,
                            zIndex: 2,
                            fontSize: 8,
                            lineHeight: 1,
                            letterSpacing: 0.4,
                            textTransform: 'uppercase',
                            color: '#7C6A54',
                            background: 'rgba(255,255,255,0.68)',
                            border: '1px solid rgba(124,106,84,0.28)',
                            borderRadius: 999,
                            padding: '2px 5px',
                          }}
                        >
                          usada
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Animation CSS ─────────────────────────────────────────────────────────────
const ANIM_CSS = `
  .paint-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 7px;
    border-radius: 999px;
    outline: none;
    border: 1px solid rgba(255,255,255,0.22);
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.45);
  }
  .paint-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
    border: 1.5px solid rgba(255,255,255,0.8);
    box-shadow: 0 0 0 1px rgba(59,130,246,0.35), 0 2px 4px rgba(0,0,0,0.55);
    cursor: pointer;
  }
  .paint-slider::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
    border: 1.5px solid rgba(255,255,255,0.8);
    box-shadow: 0 0 0 1px rgba(59,130,246,0.35), 0 2px 4px rgba(0,0,0,0.55);
    cursor: pointer;
  }
  .check-confirm-btn.pulse {
    animation: checkConfirmPulse 0.18s ease-out;
  }
  .vintage-tag-container:hover .vintage-tag-sway {
    animation: vintageTagSway 3s ease-in-out infinite;
  }
  .vintage-tag-face {
    position: relative;
  }
  .vintage-tag-text {
    transition: opacity .18s ease, transform .18s ease;
  }
  .vintage-tag-edit-hint {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.84);
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5A4A3A;
    background: rgba(90,74,58,0.14);
    border: 1px solid rgba(90,74,58,0.35);
    opacity: 0;
    transition: opacity .18s ease, transform .18s ease;
    pointer-events: none;
    z-index: 2;
  }
  .vintage-tag-container:hover .vintage-tag-text {
    opacity: 0;
    transform: rotate(-3deg) scale(0.95);
  }
  .vintage-tag-container:hover .vintage-tag-edit-hint {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  .vintage-tag-container.dragging .vintage-tag-text {
    opacity: 1;
    transform: rotate(-3deg) scale(1);
  }
  .vintage-tag-container.dragging .vintage-tag-edit-hint {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.84);
  }
  @keyframes checkConfirmPulse {
    0%   { transform: translateX(-50%) scale(1); }
    55%  { transform: translateX(-50%) scale(1.16); }
    100% { transform: translateX(-50%) scale(1); }
  }
  @keyframes vintageTagSway {
    0%, 100% { transform: rotate(-0.8deg); }
    50%      { transform: rotate(1.4deg); }
  }
  .paint-can-shadow {
    width: 104px;
    height: 14px;
    background: radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 74%);
    position: absolute;
    bottom: 84px;
    left: 50%;
    transform: translateX(-50%);
    animation: paintCanShadowPulse 4s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes paintCanFloat {
    0%,100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
  @keyframes paintCanShadowPulse {
    0%,100% { transform: translateX(-50%) scaleX(0.92); opacity: 0.52; }
    50% { transform: translateX(-50%) scaleX(1.08); opacity: 0.3; }
  }
  @keyframes paintParticleFly {
    0%   { transform: translate(0, 0) scale(1); opacity: 1; }
    100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
  }
  @keyframes interiorFold {
    0%   { transform: scaleY(1); opacity: 1; transform-origin: top center; }
    100% { transform: scaleY(0); opacity: 0; transform-origin: top center; }
  }
  @keyframes lidDown {
    0%   { transform: perspective(600px) rotateX(-90deg); opacity: 0; }
    60%  { transform: perspective(600px) rotateX(8deg); opacity: 1; }
    80%  { transform: perspective(600px) rotateX(-3deg); }
    100% { transform: perspective(600px) rotateX(0deg); }
  }
  /* Solo scale: el translate(-50%,-50%) vive en el contenedor, no en el nodo animado */
  @keyframes claspSnap {
    0%,70% { transform: scaleX(1); }
    80%    { transform: scaleX(1.15); }
    100%   { transform: scaleX(1); }
  }
  @keyframes lidUp {
    0%   { transform: perspective(600px) rotateX(0deg); opacity: 1; }
    40%  { transform: perspective(600px) rotateX(12deg); opacity: 1; }
    100% { transform: perspective(600px) rotateX(-90deg); opacity: 0; }
  }
  @keyframes interiorUnfold {
    0%   { transform: scaleY(0); opacity: 0; transform-origin: top center; }
    40%  { transform: scaleY(1.04); opacity: 1; transform-origin: top center; }
    70%  { transform: scaleY(0.98); opacity: 1; transform-origin: top center; }
    100% { transform: scaleY(1); opacity: 1; transform-origin: top center; }
  }
  @keyframes bubbleFadeOut {
    0%   { opacity: 1; }
    100% { opacity: 0; transform: translate(-50%,-50%) scale(0.5); }
  }
  /* Solo opacidad: el transform lo controla rAF (evita choque con animación) */
  @keyframes bubbleFadeIn {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes dockFloatIn {
    0%   { opacity: 0; transform: translateY(8px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes dockGlowPulse {
    0%, 100% { opacity: 0.45; transform: scale(1); }
    50%      { opacity: 0.8; transform: scale(1.08); }
  }
  @keyframes hazMaletaPaintRuleToast {
    0%   { opacity: 0; transform: translateY(12px) scale(0.96); }
    11%  { opacity: 1; transform: translateY(0) scale(1); }
    78%  { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-8px) scale(0.99); }
  }
  .haz-maleta-paint-rule-toast {
    animation: hazMaletaPaintRuleToast 2.6s cubic-bezier(0.33, 0.9, 0.35, 1) forwards;
  }
  @media (prefers-reduced-motion: reduce) {
    .haz-maleta-paint-rule-toast {
      animation-duration: 0.4s;
    }
  }
`;

// Pesos fijos (misma ref en todo render) para no reiniciar el efecto rAF por un array literal nuevo
const ORGANIC_BUB_WT: readonly [number, number, number] = [0.55, 0.3, 0.15];

// ── Organic Bubble — rAF + summed incommensurable sinusoids ──────────────────
// Each axis is driven by 3 sine waves at irrational frequency ratios.
// This guarantees the path never repeats in any perceivable timeframe.
interface OrganicBubbleProps {
  color: string;
  label: string;
  size: number;
  startX: number;
  startY: number;
  rangeX: number;
  rangeY: number;
  maxX: number;
  maxY: number;
  /** Clave estable (p. ej. id del ítem) para frecuencias; no el texto, que puede cambiar al editar */
  motionKey: number;
  delay?: number;
}

/** Leída en rAF: evita re-lanzar el efecto (y resetear t) al re-render del padre */
type OrganicMotionGeom = {
  startX: number;
  startY: number;
  rangeX: number;
  rangeY: number;
  maxX: number;
  maxY: number;
  size: number;
  delay: number;
  motionKey: number;
  drx: number;
  dry: number;
  fx: [number, number, number];
  fy: [number, number, number];
  px: [number, number, number];
  py: [number, number, number];
};

function OrganicBubble({
  color,
  label,
  size,
  startX,
  startY,
  rangeX,
  rangeY,
  maxX,
  maxY,
  motionKey,
  delay = 0,
}: OrganicBubbleProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const startT = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);
  const mounted = useRef(false);
  // Unique ID per instance — prevents SVG gradient ID collisions when same label appears twice
  const uid = useRef(`b${Math.random().toString(36).slice(2,8)}`).current;

  // Semilla de movimiento según el ítem (estable) + offset por key para múltiples instancias
  const { fx, fy, px, py, drx, dry } = useMemo(() => {
    const seed = (motionKey * 2654435761) >>> 0;
    return {
      fx: [
        0.00031 + (seed % 7) * 0.000041,
        0.00053 + (seed % 11) * 0.000029,
        0.00079 + (seed % 13) * 0.000019,
      ],
      fy: [
        0.00041 + (seed % 5) * 0.000037,
        0.00067 + (seed % 9) * 0.000023,
        0.00097 + (seed % 17) * 0.000013,
      ],
      px: [((seed * 17) % 628) / 100, ((seed * 23) % 628) / 100, ((seed * 31) % 628) / 100],
      py: [((seed * 41) % 628) / 100, ((seed * 13) % 628) / 100, ((seed * 27) % 628) / 100],
      drx: ((seed * 3) % 628) / 100,
      dry: ((seed * 5) % 628) / 100,
    };
  }, [motionKey]);

  const geomRef = useRef<OrganicMotionGeom | null>(null);
  geomRef.current = {
    startX,
    startY,
    rangeX,
    rangeY,
    maxX,
    maxY,
    size,
    delay,
    motionKey,
    drx,
    dry,
    fx: [fx[0]!, fx[1]!, fx[2]!],
    fy: [fy[0]!, fy[1]!, fy[2]!],
    px: [px[0]!, px[1]!, px[2]!],
    py: [py[0]!, py[1]!, py[2]!],
  };

  // Solo 1x al montar: posición incial; no deps (no pisar al re-render con geometría que ya lleva rAF vía ref)
  useLayoutEffect(() => {
    const el = ref.current;
    const g = geomRef.current;
    if (!el || !g) return;
    const half = g.size / 2;
    const cx = Math.min(Math.max(g.startX, half), g.maxX - half);
    const cy = Math.min(Math.max(g.startY, half), g.maxY - half);
    el.style.left = `${cx}px`;
    el.style.top = `${cy}px`;
    el.style.transform = 'translate(-50%,-50%) scale(1)';
  }, []);

  useEffect(() => {
    mounted.current = true;
    startT.current = null;
    const tick = (ts: number) => {
      if (!mounted.current) return;
      const g = geomRef.current;
      if (!g) {
        rafId.current = requestAnimationFrame(tick);
        return;
      }
      const delayMs = g.delay * 1000;
      if (startT.current === null) startT.current = ts - delayMs;
      const t = ts - startT.current;
      const driftX = 0.1 * Math.sin(0.00012 * t + g.drx) + 0.06 * Math.sin(0.00027 * t + g.drx * 1.3);
      const driftY = 0.1 * Math.sin(0.00011 * t + g.dry) + 0.06 * Math.sin(0.00025 * t + g.dry * 1.2);
      let ex = ORGANIC_BUB_WT.reduce((s, w, i) => s + w * Math.sin(g.fx[i]! * t + g.px[i]!), 0) + driftX;
      let ey = ORGANIC_BUB_WT.reduce((s, w, i) => s + w * Math.sin(g.fy[i]! * t + g.py[i]!), 0) + driftY;
      ex = Math.max(-1, Math.min(1, ex));
      ey = Math.max(-1, Math.min(1, ey));
      const scl = 1 + 0.04 * Math.sin(0.00023 * t + g.motionKey * 0.2);
      const el = ref.current;
      if (el) {
        const half = g.size / 2;
        const rawX = g.startX + ex * g.rangeX;
        const rawY = g.startY + ey * g.rangeY;
        const cx = Math.min(Math.max(rawX, half), g.maxX - half);
        const cy = Math.min(Math.max(rawY, half), g.maxY - half);
        el.style.left = `${cx}px`;
        el.style.top = `${cy}px`;
        el.style.transform = `translate(-50%,-50%) scale(${scl})`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => {
      mounted.current = false;
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };
  }, [motionKey]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        /* left, top, transform: solo vía ref + rAF (no pisar con re-renders) */
        width: size,
        height: size,
        borderRadius: '50%',
        animation: `bubbleFadeIn 0.5s ease-out ${delay}s both`,
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:'block', overflow:'visible' }}>
        <defs>
          {/* Radial fill — dark centre, colour rim */}
          <radialGradient id={`bg-${uid}`} cx="42%" cy="38%" r="58%">
            <stop offset="0%"   stopColor={color} stopOpacity="0.04"/>
            <stop offset="60%"  stopColor={color} stopOpacity="0.12"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.38"/>
          </radialGradient>
          {/* Specular highlight — top-left bright flare */}
          <radialGradient id={`hi-${uid}`} cx="35%" cy="28%" r="38%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.72"/>
            <stop offset="45%"  stopColor="white" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          {/* Bottom-right secondary reflection */}
          <radialGradient id={`lo-${uid}`} cx="72%" cy="76%" r="28%">
            <stop offset="0%"   stopColor={color} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </radialGradient>
          {/* Rim glow filter — softer, wider spread */}
          <filter id={`rim-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="blur"/>
          </filter>
          {/* Extra wide soft glow */}
          <filter id={`glow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="14" result="blur"/>
          </filter>
        </defs>

        {/* Wide soft ambient glow */}
        <circle cx={size/2} cy={size/2} r={size/2 + 2}
          fill={color} fillOpacity="0.10"
          filter={`url(#glow-${uid})`}/>
        {/* Tighter inner halo */}
        <circle cx={size/2} cy={size/2} r={size/2 + 1}
          fill={color} fillOpacity="0.18"
          filter={`url(#rim-${uid})`}/>

        {/* Base sphere fill */}
        <circle cx={size/2} cy={size/2} r={size/2 - 1}
          fill={`url(#bg-${uid})`}/>

        {/* Rim — coloured glowing border */}
        <circle cx={size/2} cy={size/2} r={size/2 - 2}
          fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.55"/>

        {/* Inner rim highlight — brighter top arc */}
        <circle cx={size/2} cy={size/2} r={size/2 - 3.5}
          fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.18"
          strokeDasharray={`${size * 0.9} ${size * 10}`}
          strokeDashoffset={`-${size * 0.05}`}/>

        {/* Main specular highlight */}
        <ellipse cx={size*0.38} cy={size*0.30} rx={size*0.20} ry={size*0.13}
          fill={`url(#hi-${uid})`} transform={`rotate(-30 ${size*0.38} ${size*0.30})`}/>

        {/* Tiny bright specular dot */}
        <circle cx={size*0.33} cy={size*0.26} r={size*0.042}
          fill="white" fillOpacity="0.85"/>

        {/* Secondary reflection bottom-right */}
        <ellipse cx={size*0.68} cy={size*0.74} rx={size*0.09} ry={size*0.06}
          fill={`url(#lo-${uid})`} transform={`rotate(20 ${size*0.68} ${size*0.74})`}/>

        {/* Label text */}
        <text
          x={size/2} y={size/2 - 3}
          textAnchor="middle" dominantBaseline="middle"
          fill={color}
          fontSize={size > 98 ? 13 : 11}
          fontWeight="700"
          fontFamily="system-ui,sans-serif"
          letterSpacing="-0.3"
          fillOpacity="0.95"
        >{label}</text>

        {/* Tiny dot below text */}
        <circle cx={size/2} cy={size/2 + (size > 98 ? 13 : 11)}
          r="2.5" fill={color} fillOpacity="0.5"/>
      </svg>
    </div>
  );
}

const SHELF_PAGE_SIZE = 5;

interface SuitcaseShelfProps {
  placedIds: Set<ObjectItemId>;
  placedLength: number;
  setShelfDrag: Dispatch<SetStateAction<ShelfDragState | null>>;
}

function SuitcaseShelf({ placedIds, placedLength, setShelfDrag }: SuitcaseShelfProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(OBJECTS.length / SHELF_PAGE_SIZE);
  const visible = OBJECTS.slice(page * SHELF_PAGE_SIZE, (page + 1) * SHELF_PAGE_SIZE);

  return (
    <div style={{ width: '100%', maxWidth: SUITCASE_W + 44, position: 'relative' }}>
      {page > 0 && (
        <button
          type="button"
          onClick={() => setPage((p) => p - 1)}
          style={{
            position: 'absolute',
            left: -20,
            top: '50%',
            transform: 'translateY(-60%)',
            zIndex: 10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#5C3A1E,#3D2010)',
            border: '2px solid #7C4A28',
            color: '#D97706',
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
          }}
        >
          ‹
        </button>
      )}

      {page < totalPages - 1 && (
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          style={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-60%)',
            zIndex: 10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#5C3A1E,#3D2010)',
            border: '2px solid #7C4A28',
            color: '#D97706',
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
          }}
        >
          ›
        </button>
      )}

      <div
        style={{
          background: 'linear-gradient(180deg,#0A0F1C 0%,#0D1525 70%,#111D30 100%)',
          borderRadius: '10px 10px 0 0',
          border: '2px solid #3D2010',
          borderBottom: 'none',
          padding: '18px 28px 0',
          minHeight: 130,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.8)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06 }}>
          {[20, 40, 60, 80].map((p) => (
            <div
              key={p}
              style={{
                position: 'absolute',
                left: `${p}%`,
                top: 0,
                bottom: 0,
                width: 1,
                background: 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>

        {visible.map((obj) => {
          const inCase = placedIds.has(obj.id);
          const full = placedLength >= MAX_ITEMS;
          const disabled = inCase || full;
          return (
            <div
              key={obj.id}
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                flex: 1,
                opacity: disabled ? 0.18 : 1,
                cursor: disabled ? 'default' : 'grab',
                transition: 'opacity .2s, transform .15s, filter .15s',
                filter: disabled ? 'grayscale(1)' : 'drop-shadow(0 -4px 14px rgba(255,255,255,0.06))',
                paddingBottom: 0,
              }}
              onMouseDown={
                disabled
                  ? undefined
                  : (e) => {
                      e.preventDefault();
                      setShelfDrag({ obj, mx: e.clientX, my: e.clientY });
                    }
              }
              onMouseEnter={(e) => {
                if (!disabled) e.currentTarget.style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ filter: `drop-shadow(0 10px 16px rgba(0,0,0,0.8))` }}>
                <ObjectIcon id={obj.id} size={obj.defaultSize * 0.5} />
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          background: 'linear-gradient(180deg,#8B5E3C 0%,#6B4423 35%,#4A2E14 100%)',
          height: 22,
          borderRadius: '2px 2px 0 0',
          border: '2px solid #9C6B45',
          borderBottom: 'none',
          borderTop: '3px solid #C4885A',
          boxShadow: '0 6px 0 #1a0e05, 0 -2px 8px rgba(255,255,255,0.06) inset',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {[15, 35, 55, 75, 90].map((p) => (
          <div
            key={p}
            style={{
              position: 'absolute',
              left: `${p}%`,
              top: 0,
              bottom: 0,
              width: 1,
              background: 'rgba(0,0,0,0.2)',
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 8 }}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => setPage(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setPage(i);
            }}
            style={{
              width: i === page ? 18 : 6,
              height: 6,
              borderRadius: 3,
              background: i === page ? '#D97706' : 'rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'all .2s',
            }}
          />
        ))}
      </div>

      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: 24,
            left: i === 0 ? 8 : 'auto',
            right: i === 1 ? 8 : 'auto',
            width: 18,
            height: 22,
            background: 'linear-gradient(180deg,#5C3A1E,#3D2010)',
            clipPath: 'polygon(0 0,100% 0,100% 60%,50% 100%,0 60%)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
          }}
        />
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function HazTuMaleta({
  colorCount,
  onColorCountChange: _onColorCountChange,
  onComplete,
  onBack,
  initialState = null,
  onStateChange,
  onGeneratedPaletteChange,
}: HazTuMaletaProps) {
  const initialPlaced = (initialState?.placed ?? []).map((item) => ({
    ...item,
    tag: item.tag ?? item.archetype?.label ?? null,
    tagSourceIdx: item.tagSourceIdx ?? null,
    rotation: item.rotation ?? 0,
  }));
  const nextIdStart = initialPlaced.length ? Math.max(...initialPlaced.map((x) => x.id)) + 1 : 1;
  const nextIdRef = useRef(nextIdStart);

  const [placed, setPlaced] = useState<PlacedItem[]>(initialPlaced);
  const [pos, setPos] = useState<Record<number, { x: number; y: number }>>(() => initialState?.pos ?? {});
  const [hov, setHov] = useState<number | null>(null);
  const [paintColor, setPaintColor] = useState(QUICK_COLORS[4]);
  const [brushMode, setBrushMode] = useState(false);
  const [brushCursor, setBrushCursor] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });
  const [closed, setClosed] = useState(() => initialState?.closed ?? false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [shelfDrag, setShelfDrag] = useState<ShelfDragState | null>(null);
  const [reposDrag, setReposDrag] = useState<ReposDragState | null>(null);
  const [tagDrag, setTagDrag] = useState<{ text: string; x: number; y: number; idx: number } | null>(null);
  const [usedTagIdxs, setUsedTagIdxs] = useState<number[]>(
    () =>
      initialPlaced
        .map((item) => item.tagSourceIdx)
        .filter((idx): idx is number => typeof idx === 'number')
  );
  const [tagBadgeHoverId, setTagBadgeHoverId] = useState<number | null>(null);
  const [paintRuleMsg, setPaintRuleMsg] = useState<string | null>(null);
  /** Sube en cada aviso de color duplicado para remontar el nodo y reiniciar la animación. */
  const [paintRuleToastId, setPaintRuleToastId] = useState(0);
  /** Pincel orgánico: capa anterior (from) con máscara ondulada; debajo, color nuevo (to). */
  const [paintWipe, setPaintWipe] = useState<Record<number, { from: string; to: string; t: number }>>({});
  const paintWipeRafRef = useRef<number | null>(null);
  const paintWipeIdRef = useRef<number | null>(null);
  const caseRef = useRef<HTMLDivElement | null>(null);
  const leftColumnViewportRef = useRef<HTMLDivElement | null>(null);
  const leftColumnContentRef = useRef<HTMLDivElement | null>(null);
  const [leftColumnScale, setLeftColumnScale] = useState(1);

  const showRuleToast = useCallback((message: string) => {
    setPaintRuleToastId((k) => k + 1);
    setPaintRuleMsg(message);
  }, []);

  const prefersReducedMotion = useReducedMotion() === true;

  /** Transiciones del panel de herramientas (caja abierta/cerrada); duraciones acortadas si el usuario pide menos movimiento. */
  const leftToolsCrateMotion = useMemo(() => {
    const r = prefersReducedMotion;
    return {
      closedExit: { duration: r ? 0.08 : 0.26 },
      closedEnter: r
        ? { duration: 0.1 }
        : { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
      openExit: {
        duration: r ? 0.08 : 0.3,
        ease: [0.4, 0, 1, 1] as const,
      },
      openEnter: r
        ? { duration: 0.1 }
        : { duration: 0.48, ease: [0.16, 1, 0.3, 1] as const },
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (placed.length === 0) setBrushMode(false);
  }, [placed.length]);

  const handleClose = () => {
    if (closed) {
      setIsOpening(true);
      setTimeout(() => { setClosed(false); }, 420);
      setTimeout(() => { setIsOpening(false); }, 920);
    } else {
      setIsClosing(true);
      setTimeout(() => { setClosed(true); setIsClosing(false); }, 560);
    }
  };

  useEffect(() => {
    const el = leftColumnViewportRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const updateScale = () => {
      const viewportWidth = el.clientWidth;
      const viewportHeight = el.clientHeight;
      const contentEl = leftColumnContentRef.current;
      if (viewportWidth <= 0 || viewportHeight <= 0) return;
      if (!contentEl) return;

      const contentWidth = contentEl.offsetWidth || LEFT_COLUMN_BASE_WIDTH;
      const contentHeight = contentEl.offsetHeight || 1;

      const availW = Math.max(0, viewportWidth - LEFT_TOOLS_RAIL);
      const widthScale = availW / LEFT_COLUMN_BASE_WIDTH;
      const heightScale = viewportHeight / contentHeight;
      const contentWidthScale = availW / contentWidth;
      const nextScale = Math.max(MIN_LEFT_COLUMN_SCALE, Math.min(1, widthScale, heightScale));
      const fittedScale = Math.max(MIN_LEFT_COLUMN_SCALE, Math.min(nextScale, contentWidthScale));
      const finalScale = Math.max(MIN_LEFT_COLUMN_SCALE, Math.min(1, fittedScale * LEFT_COLUMN_SAFE_SCALE));
      setLeftColumnScale((prev) => (Math.abs(prev - finalScale) < 0.01 ? prev : finalScale));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (paintWipeRafRef.current != null) cancelAnimationFrame(paintWipeRafRef.current);
    },
    []
  );

  // ── Shelf drag: pick up object from shelf ──────────────────────────────────
  useEffect(() => {
    if (!shelfDrag) return;
    const onMove = (e: MouseEvent) =>
      setShelfDrag((s) => (s ? { ...s, mx: e.clientX, my: e.clientY } : null));
    const onUp = (e: MouseEvent) => {
      if (caseRef.current && placed.length < MAX_ITEMS) {
        const r = caseRef.current.getBoundingClientRect();
        const scale = Math.max(leftColumnScale, 0.001);
        const localWidth = r.width / scale;
        const localHeight = r.height / scale;
        if (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom
        ) {
          const obj = shelfDrag.obj;
          const rawX = (e.clientX - r.left) / scale;
          const rawY = (e.clientY - r.top) / scale;
          const { x: cx, y: cy } = clampPlacedItemPosition(
            obj.id,
            obj.defaultSize,
            rawX,
            rawY,
            localWidth,
            localHeight
          );
          const id = nextIdRef.current++;
          setPos((p) => ({ ...p, [id]: { x: cx, y: cy } }));
          setPlaced((prev) => [
            ...prev,
            {
              id,
              objId: obj.id,
              name: obj.name,
              size: obj.defaultSize,
              rotation: 0,
              color: null,
              tag: null,
              tagSourceIdx: null,
            },
          ]);
        }
      }
      setShelfDrag(null);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [shelfDrag, placed.length, leftColumnScale]);

  // ── Reposition drag: move placed item ──────────────────────────────────────
  useEffect(() => {
    if (!reposDrag) return;
    const onMove = (e: MouseEvent) => {
      if (!caseRef.current) return;
      const r = caseRef.current.getBoundingClientRect();
      const scale = Math.max(leftColumnScale, 0.001);
      const localWidth = r.width / scale;
      const localHeight = r.height / scale;
      const item = placed.find((p) => p.id === reposDrag.id);
      if (!item) return;
      const rawX = (e.clientX - r.left - reposDrag.ox) / scale;
      const rawY = (e.clientY - r.top - reposDrag.oy) / scale;
      const { x, y } = clampPlacedItemPosition(
        item.objId,
        item.size,
        rawX,
        rawY,
        localWidth,
        localHeight,
        item.rotation ?? 0
      );
      setPos((p) => ({
        ...p,
        [reposDrag.id]: { x, y },
      }));
    };
    const onUp = () => setReposDrag(null);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [reposDrag, placed, leftColumnScale]);

  const removeItem = (id: number) => {
    if (paintWipeRafRef.current != null && paintWipeIdRef.current === id) {
      cancelAnimationFrame(paintWipeRafRef.current);
      paintWipeRafRef.current = null;
      paintWipeIdRef.current = null;
    }
    setPaintWipe((prev) => {
      if (!(id in prev)) return prev;
      const n = { ...prev };
      delete n[id];
      return n;
    });
    const removed = placed.find((p) => p.id === id);
    setPlaced((prev) => prev.filter((p) => p.id !== id));
    setPos((p) => {
      const n = { ...p };
      delete n[id];
      return n;
    });
    if (removed?.tagSourceIdx != null) {
      setUsedTagIdxs((prev) => prev.filter((idx) => idx !== removed.tagSourceIdx));
    }
    setTagBadgeHoverId((curr) => (curr === id ? null : curr));
  };

  const runPaintWipe = (id: number, from: string, to: string) => {
    if (paintWipeRafRef.current != null) {
      cancelAnimationFrame(paintWipeRafRef.current);
      paintWipeRafRef.current = null;
      const prevAnim = paintWipeIdRef.current;
      if (prevAnim != null) {
        setPaintWipe((m) => {
          if (!(prevAnim in m)) return m;
          const n = { ...m };
          delete n[prevAnim];
          return n;
        });
      }
    }
    paintWipeIdRef.current = id;
    const t0 = performance.now();
    setPaintWipe((prev) => ({ ...prev, [id]: { from, to, t: 0 } }));
    const tick = (now: number) => {
      const rawT = Math.min(1, (now - t0) / PAINT_WIPE_MS);
      const t = mapPaintWipeEasing(rawT);
      setPaintWipe((p) => ({ ...p, [id]: { from, to, t } }));
      if (rawT < 1) {
        paintWipeRafRef.current = requestAnimationFrame(tick);
      } else {
        setPaintWipe((p) => {
          if (!(id in p)) return p;
          const n = { ...p };
          delete n[id];
          return n;
        });
        paintWipeRafRef.current = null;
        paintWipeIdRef.current = null;
      }
    };
    paintWipeRafRef.current = requestAnimationFrame(tick);
  };

  const applyItemColor = (id: number, color: string): 'applied' | 'noop' | 'blocked' => {
    const item = placed.find((p) => p.id === id);
    if (!item) return 'noop';
    const from = item.color || OBJECT_ICON_BASE[item.objId];
    if (colorsEqualForPaint(from, color)) return 'noop';
    const otherUsesColor = placed.some(
      (p) => p.id !== id && p.color != null && colorsEqualForPaint(p.color, color)
    );
    if (otherUsesColor) {
      showRuleToast('Ese color ya lo usa otro objeto. Elige otro tono.');
      return 'blocked';
    }
    setPlaced((prev) => prev.map((p) => (p.id === id ? { ...p, color } : p)));
    runPaintWipe(id, from, color);
    return 'applied';
  };

  const cycleItemRotation = (id: number) => {
    const item = placed.find((p) => p.id === id);
    if (!item) return;
    // +90 acumulado, sin % 360: con 270→0 el navegador anima “hacia atrás”; 270→360 sigue +90 en el mismo sentido.
    const nextR = (item.rotation ?? 0) + 90;
    setPlaced((prev) => prev.map((p) => (p.id === id ? { ...p, rotation: nextR } : p)));
    const box = caseRef.current?.getBoundingClientRect();
    if (box) {
      const sc = Math.max(leftColumnScale, 0.001);
      setPos((p) => {
        const cur = p[id] ?? { x: SUITCASE_W / 2, y: SUITCASE_H / 2 };
        const { x, y } = clampPlacedItemPosition(
          item.objId,
          item.size,
          cur.x,
          cur.y,
          box.width / sc,
          box.height / sc,
          nextR
        );
        return { ...p, [id]: { x, y } };
      });
    }
  };

  const applyItemTag = useCallback(
    (id: number, tag: string, sourceIdx: number | null = null) => {
      const cleaned = tag.trim();
      if (!cleaned) return;
      const duplicateOnOther = placed.some(
        (p) => p.id !== id && p.tag != null && tagLabelsEqual(p.tag, cleaned)
      );
      if (duplicateOnOther) {
        showRuleToast('Ese texto de etiqueta ya lo usa otro objeto. Elige otra frase.');
        return;
      }
      let replacedTagIdx: number | null = null;
      setPlaced((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          replacedTagIdx = p.tagSourceIdx ?? null;
          return { ...p, tag: cleaned, tagSourceIdx: sourceIdx };
        })
      );
      if (sourceIdx != null) {
        setUsedTagIdxs((prev) => {
          let next = prev;
          if (replacedTagIdx != null && replacedTagIdx !== sourceIdx) {
            next = next.filter((idx) => idx !== replacedTagIdx);
          }
          if (!next.includes(sourceIdx)) next = [...next, sourceIdx];
          return next;
        });
      }
    },
    [placed, showRuleToast]
  );

  const removeItemTag = (id: number) => {
    let removedTagSourceIdx: number | null = null;
    setPlaced((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        removedTagSourceIdx = p.tagSourceIdx ?? null;
        return { ...p, tag: null, tagSourceIdx: null };
      })
    );
    if (removedTagSourceIdx != null) {
      setUsedTagIdxs((prev) => prev.filter((idx) => idx !== removedTagSourceIdx));
    }
    setTagBadgeHoverId((curr) => (curr === id ? null : curr));
  };

  useEffect(() => {
    if (!tagDrag) return;
    const onMove = (e: MouseEvent) => {
      setTagDrag((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
    };
    const onUp = () => {
      if (hov != null) applyItemTag(hov, tagDrag.text, tagDrag.idx);
      setTagDrag(null);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [tagDrag, hov, applyItemTag]);

  const palette = placed.filter(
    (p): p is PlacedItem & { color: string } => p.color !== null
  );
  const placedIds = new Set<ObjectItemId>(placed.map((p) => p.objId));

  const savedSnapshot = useMemo<HazTuMaletaSavedState>(
    () => ({ placed, pos, closed }),
    [placed, pos, closed]
  );

  useEffect(() => {
    onStateChange?.(savedSnapshot);
  }, [savedSnapshot, onStateChange]);

  const previewHexes = useMemo(
    () => fitPaletteToColorCount(
      palette.map((p) => p.color),
      colorCount
    ),
    [palette, colorCount]
  );
  const paintColorShades = useMemo(() => {
    const { h, s, l } = hexToHsl(paintColor);
    return {
      dark1: hslToHex(h, s, Math.max(l - 22, 10)),
      dark2: hslToHex(h, s, Math.max(l - 28, 8)),
    };
  }, [paintColor]);

  useEffect(() => {
    if (palette.length === 0) return;
    onGeneratedPaletteChange?.(previewHexes);
  }, [palette.length, previewHexes, onGeneratedPaletteChange]);

  useEffect(() => {
    if (!brushMode) {
      setBrushCursor((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const onMove = (e: MouseEvent) => {
      setBrushCursor({ x: e.clientX, y: e.clientY, visible: true });
    };
    const onOut = () => {
      setBrushCursor((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onOut);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onOut);
    };
  }, [brushMode]);

  const handleUsePalette = () => {
    if (palette.length === 0) return;
    onComplete(previewHexes, savedSnapshot);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <style>{ANIM_CSS}</style>
      <div className="shrink-0 px-4 pt-4">
        <SectionBanner
          onBack={() => onBack(savedSnapshot)}
          title="Maleta del viajero"
          subtitle="Define la personalidad de tu viajero y los objetos que llevaría en su maleta"
          icon={AQUARIUM_BUTTON_CONFIG.icon}
          iconBoxClassName={SECTION_ICON_ACCENTS.amber}
          primaryLabel="Usar paleta →"
          onPrimaryClick={handleUsePalette}
          primaryDisabled={palette.length === 0}
        />
      </div>

      <div className="flex-1 min-h-0 px-4 pb-2 pt-3">
        <div
          className="h-full max-w-6xl mx-auto rounded-2xl border border-gray-700/60 overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, #0F172A 0%, #080E1A 60%, #060A14 100%)',
            color: '#E2E8F0',
            fontFamily: "'Georgia','Times New Roman',serif",
            cursor: brushMode ? 'none' : shelfDrag || reposDrag || tagDrag ? 'grabbing' : 'default',
            userSelect: 'none',
          }}
        >
          <div className="h-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(170px,200px)] gap-4 p-4 overflow-hidden">

        {/* ── Suitcase + Shelf column ──────────────────────────────────────── */}
        <div
          ref={leftColumnViewportRef}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: LEFT_COLUMN_INNER_GAP,
            minHeight: 0,
            overflow: 'hidden',
            paddingRight: 2,
          }}
        >
        <div
          style={{
            flex: '0 0 auto',
            width: LEFT_TOOLS_CARD_WIDTH,
            maxWidth: LEFT_TOOLS_CARD_WIDTH,
            position: 'relative',
            backgroundColor: '#24160E',
            backgroundImage: `
              radial-gradient(ellipse 130% 70% at 50% 0%, rgba(201, 165, 116, 0.14) 0%, transparent 45%),
              linear-gradient(168deg, rgba(52, 36, 24, 0.95) 0%, rgba(32, 22, 15, 0.98) 48%, rgba(24, 14, 10, 1) 100%),
              repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 2px)
            `,
            border: '2px solid #4A2E1A',
            borderRadius: 16,
            boxShadow: `
              0 0 0 1px #6B4530,
              0 0 0 2px #120A08,
              0 10px 32px rgba(0,0,0,0.55),
              inset 0 1px 0 rgba(201, 165, 116, 0.12),
              inset 0 -1px 0 rgba(0,0,0,0.35)
            `,
            alignSelf: 'flex-start',
            overflow: 'hidden',
            height: '100%',
            minHeight: 0,
            maxHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
          <AnimatePresence mode="wait" initial={false}>
            {placed.length === 0 ? (
              <motion.div
                key="tools-crate-closed"
                role="img"
                aria-label="Color y etiquetas, panel cerrado hasta añadir un objeto a la maleta"
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.98,
                  y: -4,
                  transition: leftToolsCrateMotion.closedExit,
                }}
                transition={leftToolsCrateMotion.closedEnter}
                style={{
                  flex: '1 1 auto',
                  minHeight: 0,
                  height: '100%',
                  width: '100%',
                  maxHeight: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 6px',
                  boxSizing: 'border-box',
                  ...CLOSED_TOOLS_LID_WOOD,
                }}
              >
                <span style={CLOSED_CARVED_LABEL}>
                  COLOR Y ETIQUETAS
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="tools-crate-open"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: 8,
                  scale: 0.99,
                  transition: leftToolsCrateMotion.openExit,
                }}
                transition={leftToolsCrateMotion.openEnter}
                className="inspiration-scroll-area"
                style={{
                  flex: '1 1 auto',
                  minHeight: 0,
                  height: '100%',
                  width: '100%',
                  maxHeight: '100%',
                  boxSizing: 'border-box',
                  padding: '14px 11px 18px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                <div
                  style={{
                    fontSize: 9.5,
                    color: '#C9A77A',
                    letterSpacing: '.16em',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontFamily: "'Georgia','Times New Roman',serif",
                    marginBottom: 0,
                    paddingBottom: 9,
                    textAlign: 'center',
                    textShadow: '0 1px 2px rgba(0,0,0,0.65)',
                    borderBottom: '1px dotted rgba(139, 94, 60, 0.45)',
                  }}
                >
                  · Color y etiquetas ·
                </div>
                <PaintCanStation
                  color={paintColor}
                  brushMode={brushMode}
                  onColorChange={setPaintColor}
                  onBrushModeChange={setBrushMode}
                  onTagDragStart={(text, x, y, idx) => setTagDrag({ text, x, y, idx })}
                  tagDraggingIdx={tagDrag?.idx ?? null}
                  usedTagIdxs={usedTagIdxs}
                  onTagLabelCollision={() =>
                    showRuleToast('No puedes repetir el mismo texto en dos etiquetas. Elige otra frase.')
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
        <div
          ref={leftColumnContentRef}
          style={{
            flex: '0 1 auto',
            minWidth: 0,
            width: LEFT_COLUMN_BASE_WIDTH,
            transform: `translateX(${LEFT_COLUMN_SHIFT}px) scale(${leftColumnScale})`,
            transformOrigin: 'top center',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            gap:44,
          }}
        >

          {/* ── Shelf ── */}
          <SuitcaseShelf placedIds={placedIds} placedLength={placed.length} setShelfDrag={setShelfDrag} />

          {/* ── Suitcase ── */}
          <div style={{
            background:'linear-gradient(155deg,#2D1B0E,#3D2514 40%,#2A1608)',
            borderRadius:24, padding:'0 22px 22px',
            border:'3.5px solid #5C3A1E',
            boxShadow:'0 0 0 1px #8B5E3C22, 0 28px 72px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
            width:'100%', maxWidth: SUITCASE_W + 44,
            position:'relative',
          }}>
            {/* Handle */}
            <div style={{ display:'flex', justifyContent:'center', marginBottom:6 }}>
              <div style={{ width:72, height:20, border:'4.5px solid #7C4C28', borderBottom:'none',
                borderRadius:'16px 16px 0 0', position:'relative', top:5 }}/>
            </div>

            {/* Clasps + counter */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <div style={{ display:'flex', gap:5, justifyContent:'flex-start' }}>
                {[0,1].map(i=><div key={i} style={{ width:14, height:9, background:'#D97706', borderRadius:3,
                  boxShadow:'0 1px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)' }}/>)}
              </div>
              <div style={{ display:'flex', gap:6, alignItems:'center', fontFamily:'system-ui,sans-serif', justifySelf:'center' }}>
                {Array.from({length:MAX_ITEMS}).map((_,i) => (
                  <div key={i} style={{
                    width:10, height:10, borderRadius:'50%',
                    background: i < placed.length ? (palette[i]?.color||'#94A3B8') : 'rgba(255,255,255,0.08)',
                    border: `2px solid ${i < placed.length ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: i < placed.length ? `0 0 8px ${palette[i]?.color||'transparent'}88` : 'none',
                    transition:'all .3s',
                  }}/>
                ))}
                <span style={{ fontSize:10.5, color:'#92400E', fontWeight:700, marginLeft:2 }}>
                  {placed.length}/{MAX_ITEMS}
                </span>
              </div>
              <div style={{ display:'flex', gap:6, alignItems:'center', justifyContent:'flex-end' }}>
                {[0,1].map(i=><div key={i} style={{ width:14, height:9, background:'#D97706', borderRadius:3,
                  boxShadow:'0 1px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)' }}/>)}
              </div>
            </div>

            {/* ── Interior open ── */}
            {!closed && (
              <div ref={caseRef} style={{
                position:'relative', overflow:'hidden',
                width:'100%', height:SUITCASE_H,
                background:'linear-gradient(150deg,#12192A 0%,#0E1520 100%)',
                borderRadius:14,
                border:'2px solid rgba(0,0,0,0.6)',
                boxShadow:'inset 0 3px 14px rgba(0,0,0,0.7)',
                animation: isClosing ? 'interiorFold 0.55s ease-in forwards'
                         : isOpening ? 'interiorUnfold 0.5s cubic-bezier(.22,.68,0,1.2) forwards'
                         : 'none',
              }}>
                <svg style={{ position:'absolute', inset:0, opacity:.04, pointerEvents:'none' }} width="100%" height="100%">
                  <defs><pattern id="hatch" patternUnits="userSpaceOnUse" width="12" height="12">
                    <line x1="0" y1="12" x2="12" y2="0" stroke="white" strokeWidth=".5"/>
                  </pattern></defs>
                  <rect width="100%" height="100%" fill="url(#hatch)"/>
                </svg>

                {/* Empty state / drop hint */}
                {placed.length === 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      padding: '16px 22px',
                    }}
                  >
                    <div
                      style={EMPTY_SUITCASE_NOTE_PAPER}
                      role="region"
                      aria-label="Cómo llenar la maleta"
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: 0,
                          height: 0,
                          borderStyle: 'solid',
                          borderWidth: '0 0 20px 20px',
                          borderColor: 'transparent transparent rgba(40, 28, 18, 0.2) rgba(40, 28, 18, 0.2)',
                          borderRadius: '0 0 0 1px',
                          pointerEvents: 'none',
                        }}
                        aria-hidden
                      />
                      <div style={EMPTY_SUITCASE_NOTE_HEADING}>
                        Cómo llenar la maleta
                      </div>
                      <ol
                        style={{
                          margin: 0,
                          padding: '0 0 0 0',
                          listStyle: 'none',
                          color: '#241810',
                        }}
                      >
                        {(
                          [
                            'Arrastra un objeto desde el estante',
                            'Píntalo con el pincel',
                            'Ponle una etiqueta',
                          ] as const
                        ).map((line, i) => (
                          <li
                            key={line}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1.3em 1fr',
                              gap: 6,
                              marginBottom: i < 2 ? 4 : 0,
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 700,
                                color: '#4a2e1a',
                                textAlign: 'right',
                                fontVariantNumeric: 'tabular-nums',
                              }}
                            >
                              {i + 1}.
                            </span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {/* Drop highlight when dragging from shelf */}
                {shelfDrag && (() => {
                  const r = caseRef.current?.getBoundingClientRect();
                  const inside = r && shelfDrag.mx >= r.left && shelfDrag.mx <= r.right
                               && shelfDrag.my >= r.top  && shelfDrag.my <= r.bottom;
                  return inside ? (
                    <div style={{ position:'absolute', inset:0, borderRadius:14,
                      border:'2px dashed rgba(255,255,255,0.2)', pointerEvents:'none',
                      background:'rgba(255,255,255,0.03)' }}/>
                  ) : null;
                })()}

                {/* Placed items */}
                {placed.map(p => {
                  const isH = hov === p.id;
                  const isDrag = reposDrag?.id === p.id;
                  const position = pos[p.id] || { x: SUITCASE_W/2, y: SUITCASE_H/2 };
                  const wipe = paintWipe[p.id];
                  const displayPaint = wipe?.to ?? p.color;
                  const itemColor = displayPaint || '#94A3B8';
                  const wipeClip = wipe ? wavyTopToBottomWipeClipPath(wipe.t) : undefined;
                  const tagA = tagAnchorForObject(p.objId, p.size);
                  const rot = p.rotation ?? 0;
                  return (
                    <div key={p.id}
                      style={{
                        position:'absolute', left: position.x, top: position.y,
                        transform:'translate(-50%, -50%)',
                        width: p.size,
                        height: p.size,
                        zIndex: isDrag ? 20 : isH ? 10 : 1,
                        cursor: brushMode ? 'none' : isDrag ? 'grabbing' : 'grab',
                        transition: isDrag ? 'none' : 'filter .15s',
                        filter: isH && !isDrag
                          ? `drop-shadow(0 0 18px ${itemColor}99)`
                          : displayPaint
                            ? `drop-shadow(0 4px 12px rgba(0,0,0,0.6))`
                            : `drop-shadow(0 4px 12px rgba(0,0,0,0.6)) grayscale(1)`,
                      }}
                      onMouseEnter={() => setHov(p.id)}
                      onMouseLeave={() => setHov(null)}
                      onMouseDown={e => {
                        if (brushMode) {
                          e.preventDefault();
                          e.stopPropagation();
                          const r = applyItemColor(p.id, paintColor);
                          if (r !== 'blocked') setBrushMode(false);
                          return;
                        }
                        e.preventDefault();
                        const el = e.currentTarget, r = el.getBoundingClientRect();
                        setReposDrag({ id: p.id, ox: e.clientX-(r.left+r.width/2), oy: e.clientY-(r.top+r.height/2) });
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          transform: `rotate(${rot}deg)`,
                          transformOrigin: '50% 50%',
                          transition: isDrag ? 'none' : 'transform 0.2s ease',
                        }}
                      >
                        {wipe && wipeClip ? (
                          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <ObjectIcon
                              id={p.objId}
                              color={wipe.to}
                              accent={`${wipe.to}55`}
                              size={p.size}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '100%',
                                height: '100%',
                                clipPath: wipeClip,
                                WebkitClipPath: wipeClip,
                                willChange: 'clip-path',
                                pointerEvents: 'none',
                                transform: 'translateZ(0)',
                              }}
                            >
                              <ObjectIcon
                                id={p.objId}
                                color={wipe.from}
                                accent={`${wipe.from}55`}
                                size={p.size}
                              />
                            </div>
                          </div>
                        ) : (
                          <ObjectIcon
                            id={p.objId}
                            color={p.color || null}
                            accent={p.color ? `${p.color}55` : undefined}
                            size={p.size}
                          />
                        )}

                        {/* No-tag badge: centrado en la base visual del icono, no en el cuadrado entero */}
                        {!p.tag && (
                          <div
                            style={{
                              position: 'absolute',
                              left: tagA.hintCenterX,
                              top: tagA.baseY + 3,
                              transform: 'translateX(-50%)',
                              fontSize: 8.5,
                              color: '#64748B',
                              fontFamily: 'system-ui,sans-serif',
                              background: 'rgba(0,0,0,0.6)',
                              padding: '2px 7px',
                              borderRadius: 10,
                              whiteSpace: 'nowrap',
                              pointerEvents: 'none',
                              fontWeight: 600,
                            }}
                          >
                            Píntame y/o etiqueta
                          </div>
                        )}
                        {p.tag && (
                          <div
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              setTagBadgeHoverId(p.id);
                            }}
                            onMouseLeave={(e) => {
                              e.stopPropagation();
                              setTagBadgeHoverId((curr) => (curr === p.id ? null : curr));
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeItemTag(p.id);
                            }}
                            title="Quitar etiqueta"
                            style={{
                              position: 'absolute',
                              left: tagA.rightX,
                              top: tagA.baseY + 2,
                              width: 58,
                              height: 24,
                              pointerEvents: 'auto',
                              zIndex: 32,
                              filter:
                                tagBadgeHoverId === p.id
                                  ? `drop-shadow(0 0 8px ${(p.color || '#FDE68A')}AA) drop-shadow(1px 1px 3px rgba(0,0,0,0.35))`
                                  : 'drop-shadow(1px 1px 3px rgba(0,0,0,0.35))',
                              transform:
                                tagBadgeHoverId === p.id
                                  ? 'translateX(-100%) scale(1.06) rotate(-1deg)'
                                  : 'translateX(-100%)',
                              transformOrigin: '100% 0',
                              transition: 'filter .15s ease, transform .15s ease',
                              cursor: 'pointer',
                            }}
                          >
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(135deg,#F9F6F0 0%,#F0EBE0 100%)',
                                clipPath: 'polygon(0 18%, 0 82%, 8px 100%, 100% 100%, 100% 0, 8px 0)',
                                border: '1px solid rgba(139,69,19,0.22)',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow:
                                  tagBadgeHoverId === p.id
                                    ? 'inset 0 0 0 1px rgba(250,204,21,0.42)'
                                    : 'none',
                              }}
                            >
                              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(139,69,19,0.02) 2px,rgba(139,69,19,0.02) 4px)', opacity: 0.45 }} />
                              <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#E8E0D0', border: '1px solid #C4B5A0' }} />
                              <div
                                style={{
                                  position: 'relative',
                                  zIndex: 1,
                                  maxWidth: 46,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  color: '#5A4A3A',
                                  fontSize: 11,
                                  lineHeight: 1,
                                  transform: 'rotate(-2deg)',
                                  fontFamily: '"Brush Script MT", "Segoe Script", cursive',
                                  textShadow: '1px 1px 0 rgba(255,255,255,0.45)',
                                }}
                              >
                                {p.tag}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Hover: girar (fijo en pantalla) + eliminar */}
                      {isH && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 2,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            zIndex: 30,
                            pointerEvents: 'auto',
                          }}
                        >
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              cycleItemRotation(p.id);
                            }}
                            title="Girar 90°"
                            aria-label="Girar objeto 90 grados"
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              border: '2px solid rgba(255,255,255,0.3)',
                              background: 'linear-gradient(145deg, #2563EB, #1D4ED8)',
                              color: '#E0E7FF',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                              lineHeight: 1,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.45)',
                              padding: 0,
                            }}
                          >↻</button>
                          <div
                            role="button"
                            tabIndex={0}
                            onMouseDown={(e) => { e.stopPropagation(); removeItem(p.id); }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                removeItem(p.id);
                              }
                            }}
                            title="Quitar de la maleta"
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              background: 'rgba(239,68,68,0.95)',
                              border: '2px solid rgba(255,255,255,0.28)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 11,
                              color: 'white',
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                            }}
                          >✕</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Interior closed ── */}
            {closed && (
              <div style={{
                width:'100%', height:SUITCASE_H, borderRadius:14, overflow:'hidden',
                position:'relative',
                animation: isOpening
                  ? 'lidUp 0.45s cubic-bezier(.4,0,.6,1) forwards'
                  : 'lidDown 0.5s cubic-bezier(.22,.68,0,1.2) forwards',
                background:'linear-gradient(165deg,#3B2010 0%,#2D1B0E 40%,#3A1E0A 70%,#2A1608 100%)',
                border:'2px solid #5C3A1E',
                boxShadow:'0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}>
                <svg style={{ position:'absolute', inset:0, opacity:.06, pointerEvents:'none' }} width="100%" height="100%">
                  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
                  <rect width="100%" height="100%" filter="url(#grain)"/>
                </svg>

                {/* Seam */}
                <div style={{ position:'absolute', left:0, right:0, top:'50%',
                  transform:'translateY(-50%)', height:8,
                  background:'linear-gradient(90deg,transparent 0%,rgba(0,0,0,0.55) 12%,rgba(0,0,0,0.55) 88%,transparent 100%)',
                  filter:'blur(2px)', boxShadow:'0 2px 8px rgba(0,0,0,0.4), 0 -1px 4px rgba(0,0,0,0.3)' }}/>
                <div style={{ position:'absolute', left:'5%', right:'5%', top:'50%',
                  transform:'translateY(3px)', height:1, opacity:.18,
                  background:'repeating-linear-gradient(90deg,#8B5E3C 0px,#8B5E3C 7px,transparent 7px,transparent 13px)' }}/>

                {/* Corner reinforcements */}
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    position:'absolute',
                    top: i<2?8:'auto', bottom: i>=2?8:'auto',
                    left: i%2===0?8:'auto', right: i%2===1?8:'auto',
                    width:22, height:22, borderRadius:4,
                    background:'linear-gradient(135deg,#8B5E3C,#6B4423)',
                    border:'1px solid #A0784A',
                    boxShadow:'0 2px 6px rgba(0,0,0,0.5)',
                  }}/>
                ))}

                {/* Clasps on seam: centrado en calc(50%±d) (simétrico); animación en hijo para no pisar translate */}
                {[
                  { k: 'L', x: 'calc(50% - 20%)' as const },
                  { k: 'R', x: 'calc(50% + 20%)' as const },
                ].map(({ k, x }) => (
                  <div
                    key={k}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: '50%',
                      width: 28,
                      height: 16,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: 28,
                        height: 16,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg,#D97706,#B45309)',
                        border: '1px solid #F59E0B',
                        boxShadow: '0 0 12px rgba(217,119,6,0.4), 0 2px 6px rgba(0,0,0,0.6)',
                        transformOrigin: '50% 50%',
                        animation: 'claspSnap 0.5s ease-out 0.35s both',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: '3px 6px',
                          borderRadius: 2,
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Brand */}
                <div style={{ position:'absolute', top:'50%', left:'50%',
                  transform:'translate(-50%, -68px)',
                  width:56, height:32, borderRadius:8,
                  background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.06)',
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ fontSize:9, color:'rgba(160,120,74,0.7)', fontFamily:'Georgia,serif',
                    fontWeight:700, letterSpacing:'.15em' }}>CHROMATICA</div>
                </div>

                {/* Bubbles */}
                <div style={{ position:'absolute', inset:0, overflow:'hidden', clipPath:'inset(0 round 14px)' }}>
                {(() => {
                  const starts = [
                    {x:0.22,y:0.30},{x:0.65,y:0.25},{x:0.72,y:0.68},{x:0.30,y:0.70},{x:0.50,y:0.50},
                  ];
                  return palette.map((p, i) => {
                    const size = 78 + (i%3)*22;
                    const st   = starts[i] || {x:0.5,y:0.5};
                    const W = SUITCASE_W - 20, H = SUITCASE_H;
                    const half = size/2;
                    const sx = st.x*W, sy = st.y*H;
                    const rangeX = Math.max(Math.min(sx-half, W-half-sx)*0.92, 10);
                    const rangeY = Math.max(Math.min(sy-half, H-half-sy)*0.92, 10);
                    return (
                      <OrganicBubble key={p.id} color={p.color} label={p.tag || 'Sin etiqueta'}
                        motionKey={p.id} size={size} startX={sx} startY={sy}
                        rangeX={rangeX} rangeY={rangeY} maxX={W} maxY={H}
                        delay={i*0.1}/>
                    );
                  });
                })()}
                </div>
              </div>
            )}

            {placed.length > 0 && !isClosing && (
              <button
                type="button"
                onClick={handleClose}
                title={closed ? 'Abrir maleta' : 'Cerrar maleta'}
                aria-label={closed ? 'Abrir maleta' : 'Cerrar maleta'}
                style={{
                  position:'absolute',
                  left:'50%',
                  bottom:6,
                  transform:'translateX(-50%)',
                  zIndex:40,
                  width:44,
                  height:44,
                  borderRadius:'50%',
                  cursor:'pointer',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  transition:'all .2s',
                  background: closed ? 'linear-gradient(135deg, rgba(146,64,14,0.78), rgba(120,53,15,0.72))' : 'linear-gradient(135deg,#92400E,#78350F)',
                  color: closed ? '#E2E8F0' : '#FDE68A',
                  boxShadow: closed ? 'none' : '0 4px 18px rgba(146,64,14,0.4)',
                  border:`1px solid ${closed?'rgba(255,255,255,0.22)':'rgba(251,191,36,0.25)'}`,
                }}
              >
                <span style={{ fontSize:20, lineHeight:1 }}>{closed ? '🔓' : '🔒'}</span>
              </button>
            )}
          </div>

        </div>
        </div>

        {brushMode && brushCursor.visible && (
          <div
            style={{
              position: 'fixed',
              left: brushCursor.x,
              top: brushCursor.y,
              transform: 'translate(-21px, -84px) rotate(-30deg)',
              transformOrigin: '21px 84px',
              pointerEvents: 'none',
              zIndex: 120,
              filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))',
            }}
          >
            <svg viewBox="0 0 50 120" width={42} height={90} xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="0" width="10" height="70" rx="3" fill="url(#handleGradBrush)" />
              <rect x="18" y="65" width="14" height="14" rx="2" fill="url(#metalGradBrush)" />
              <ellipse cx="25" cy="95" rx="10" ry="18" fill="url(#bristlesGradBrush)" />
              <ellipse cx="25" cy="112" rx="5" ry="7" fill="url(#tipGradBrush)" />
              <rect x="22" y="5" width="3" height="55" rx="1.5" fill="rgba(255,255,255,0.25)" />
              <defs>
                <linearGradient id="handleGradBrush" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8B4513" />
                  <stop offset="40%" stopColor="#CD853F" />
                  <stop offset="100%" stopColor="#6B3410" />
                </linearGradient>
                <linearGradient id="metalGradBrush" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#888" />
                  <stop offset="50%" stopColor="#ddd" />
                  <stop offset="100%" stopColor="#888" />
                </linearGradient>
                <linearGradient id="bristlesGradBrush" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={paintColor} />
                  <stop offset="100%" stopColor={paintColorShades.dark1} />
                </linearGradient>
                <linearGradient id="tipGradBrush" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={paintColor} />
                  <stop offset="100%" stopColor={paintColorShades.dark2} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
        {tagDrag && (
          <div
            style={{
              position: 'fixed',
              // Desplazamiento mínimo para que el cursor no tape el texto pero quede junto a él
              left: tagDrag.x + 2,
              top: tagDrag.y + 2,
              width: 116,
              height: 34,
              pointerEvents: 'none',
              zIndex: 125,
              filter: 'drop-shadow(1px 2px 4px rgba(0,0,0,0.32))',
            }}
          >
            <div style={{ position: 'absolute', left: -1, top: 7, width: 22, height: 20 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 16, height: 8, borderBottom: '2px solid #C49563', borderRadius: '0 0 60% 60%' }} />
              <div style={{ position: 'absolute', left: 0, bottom: 0, width: 16, height: 8, borderTop: '2px solid #C49563', borderRadius: '60% 60% 0 0' }} />
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 5, height: 5, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #D4A574 0%, #B88A5E 55%, #8B6F47 100%)' }} />
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                left: 15,
                width: 98,
                background: 'linear-gradient(135deg,#F9F6F0 0%,#F0EBE0 100%)',
                clipPath: 'polygon(0 20%, 0 80%, 8px 100%, 100% 100%, 100% 0, 8px 0)',
                border: '1px solid rgba(139,69,19,0.2)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(139,69,19,0.02) 2px,rgba(139,69,19,0.02) 4px)', opacity: 0.45 }} />
              <div style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', width: 5, height: 5, borderRadius: '50%', background: '#E8E0D0', border: '1px solid #C4B5A0' }} />
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  maxWidth: 72,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: '#5A4A3A',
                  fontSize: 17,
                  lineHeight: 1,
                  fontFamily: "'Brush Script MT','Segoe Script',cursive",
                  textShadow: '1px 1px 0 rgba(255,255,255,0.45)',
                  transform: 'rotate(-3deg)',
                }}
              >
                {tagDrag.text}
              </div>
            </div>
          </div>
        )}

        {/* ── Palette panel ────────────────────────────────────────────────── */}
        <div style={{ width:'100%', maxWidth:200, justifySelf:'end', display:'flex', flexDirection:'column', gap:12, minHeight:0, overflowY:'auto' }}>
          <div style={{
            background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:18, padding:16,
          }}>
            <div style={{ fontSize:9, color:'#475569', letterSpacing:'.12em', fontWeight:700,
              textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:14 }}>
              Paleta generada
            </div>
            {palette.length === 0
              ? <div style={{ fontSize:11.5, color:'#1E293B', fontFamily:'system-ui,sans-serif',
                  textAlign:'center', padding:'20px 0', lineHeight:1.7 }}>
                  Configura los objetos dentro de la maleta para ver la paleta
                </div>
              : <>
                  <div style={{ display:'flex', gap:2, height:28, borderRadius:8, overflow:'hidden',
                    border:'1px solid rgba(255,255,255,0.08)', marginBottom:14 }}>
                    {palette.map(p => (
                      <div key={p.id} style={{ flex:1, background:p.color, transition:'flex .4s' }} title={p.tag || 'Sin etiqueta'}/>
                    ))}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {palette.map(p => (
                      <div key={p.id} style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{
                          width:36, height:36, borderRadius:10, background:p.color, flexShrink:0,
                          border:'2px solid rgba(255,255,255,0.12)', boxShadow:`0 0 12px ${p.color}55`,
                          cursor:'pointer',
                        }} onClick={() => {
                          setPaintColor(p.color);
                          setBrushMode(true);
                        }}/>
                        <div style={{ minWidth:0 }}>
                          <div style={{ fontSize:11.5, fontWeight:700, color:'#CBD5E1', fontFamily:'system-ui,sans-serif' }}>{p.tag || 'Sin etiqueta'}</div>
                          <div style={{ fontSize:9, color:'#475569', fontFamily:'monospace', marginTop:1 }}>{p.color}</div>
                          <div style={{ fontSize:9.5, color:'#334155', fontFamily:'system-ui,sans-serif' }}>{p.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {palette.length > 0 && (
                    <div style={{ marginTop:14, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize:9, color:'#334155', fontFamily:'system-ui,sans-serif', marginBottom:7 }}>Acentos sugeridos</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                        {palette.map(p => (
                          <div key={p.id} style={{ width:22, height:22, borderRadius:6,
                            background:`${p.color}33`, border:`1.5px solid ${p.color}66` }}/>
                        ))}
                      </div>
                    </div>
                  )}
                </>
            }
          </div>

          {palette.length > 0 && (
            <div style={{
              background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)',
              borderRadius:18, padding:16,
            }}>
              <div style={{ fontSize:9, color:'#475569', letterSpacing:'.12em', fontWeight:700,
                textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:10 }}>
                Etiquetas activas
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {palette.map(p => {
                  return (
                    <div key={p.id} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:p.color,
                        flexShrink:0, marginTop:3, boxShadow:`0 0 7px ${p.color}` }}/>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:'#CBD5E1', fontFamily:'system-ui,sans-serif' }}>{p.tag || 'Sin etiqueta'}</div>
                        <div style={{ fontSize:10, color:'#334155', fontFamily:'system-ui,sans-serif', lineHeight:1.5, marginTop:1 }}>{p.name}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      </div>

      {/* ── Floating drag ghost from shelf ── */}
      {shelfDrag && (() => {
        const obj = shelfDrag.obj;
        const s = obj.defaultSize * 0.55;
        return (
          <div style={{
            position:'fixed', left: shelfDrag.mx - s/2, top: shelfDrag.my - s/2,
            pointerEvents:'none', zIndex:9999,
            filter:`drop-shadow(0 8px 24px rgba(0,0,0,0.7))`,
            opacity:.9,
          }}>
            <ObjectIcon id={obj.id} size={s}/>
          </div>
        );
      })()}

      <AnimatePresence>
        {brushMode && (
          <motion.div
            key="brush-mode-hint"
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.97, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.1 }
                : { duration: 0.3, ease: [0.33, 0.9, 0.35, 1] }
            }
          >
            <div style={MALETA_CENTER_TOAST_INNER}>
              Pincel activo: pinta objetos
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {paintRuleMsg && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
          aria-live="polite"
        >
          <div
            key={paintRuleToastId}
            className="haz-maleta-paint-rule-toast"
            role="status"
            onAnimationEnd={() => {
              setPaintRuleMsg(null);
            }}
            style={MALETA_CENTER_TOAST_INNER}
          >
            {paintRuleMsg}
          </div>
        </div>
      )}

    </div>
  );
}

export default HazTuMaleta;
