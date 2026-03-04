import { memo } from 'react';
import type { PosterPalette } from '../types';
import {
  POSTER_BASE_WIDTH,
  POSTER_HEIGHT,
  POSTER_SCALE,
  BRANDING_GRAIN_URL,
  BRANDING_KRAFT_URL,
} from '../constants';
import { FONT_SANS, FONT_SERIF, FONT_CURSIVE, FONT_MONO, AURA_LOWERCASE } from './brandingFonts';

const CORNERS = [
  { pos: 'tl' as const, top: 1.5, left: 2 },
  { pos: 'tr' as const, top: 1.5, right: 2 },
  { pos: 'bl' as const, bottom: 5, left: 2 },
  { pos: 'br' as const, bottom: 5, right: 2 },
];

const HERO_PANELS = [
  { id: 'botanical', label: 'Botanical Contour' },
  { id: 'topo', label: 'Terrain Contour' },
  { id: 'geo', label: 'Hex Bean Grid' },
] as const;

const TILE_ITEMS = [
  { name: 'Flow Lines', code: 'PT-01', bg: 'c1' as const },
  { name: 'Seed Scatter', code: 'PT-02', bg: 'c3' as const },
  { name: 'Radial Bloom', code: 'PT-03', bg: 'c4' as const },
  { name: 'Origin Range', code: 'PT-05', bg: 'deep' as const },
  { name: 'Woven Linen', code: 'PT-04', bg: 'c3' as const },
  { name: 'Seal Repeat', code: 'PT-06', bg: 'c4' as const },
] as const;

const APPLY_ITEMS = [
  { label: 'Coffee Bag' },
  { label: 'Tissue Paper' },
  { label: 'Cup Sleeve' },
  { label: 'Hang Tag' },
] as const;

/** Posiciones verticales (%) de las secciones */
const LAYOUT = {
  heroTop: 14,
  heroHeight: 14,
  libraryTop: 32.5,
  contextTop: 69.5,
  dividerTops: [32, 57.5] as const,
} as const;

/** Código de tile → id del pattern (para fill url) */
const TILE_PATTERN_IDS: Record<string, string> = {
  'PT-01': 'pat-tile-flow',
  'PT-02': 'pat-tile-seeds',
  'PT-03': 'pat-tile-bloom',
  'PT-04': 'pat-tile-woven',
  'PT-05': 'pat-tile-mountain',
  'PT-06': 'pat-tile-stamps',
};

/** Path SVG que replica la hoja del logo: 50% 2px 50% 2px, con picos (superior der. e inferior izq.) bien marcados, no redondeados. Centrado en 0,0. */
const LOGO_LEAF_PATH =
  'M 0 -10 L 7 -10 L 7 0 A 7 10 0 0 1 0 10 L -7 10 L -7 0 A 7 10 0 0 1 0 -10 Z';

/** Celdas del patrón Botanical: una hoja por celda, centrada, sin cortes ni superposiciones. pattern 60×80, grid 3×3. */
const BOTANICAL_LEAF_CELLS: { cx: number; cy: number; rot: number }[] = [
  { cx: 10, cy: 14, rot: 0 },
  { cx: 30, cy: 14, rot: -8 },
  { cx: 50, cy: 14, rot: 6 },
  { cx: 10, cy: 40, rot: 10 },
  { cx: 30, cy: 40, rot: -5 },
  { cx: 50, cy: 40, rot: 8 },
  { cx: 10, cy: 66, rot: -6 },
  { cx: 30, cy: 66, rot: 4 },
  { cx: 50, cy: 66, rot: -10 },
];

interface Props {
  posterColors: PosterPalette;
}

function PatronesInner({ posterColors }: Props) {
  const c = posterColors;
  const c1 = c.primary;
  const c2 = c.accent;
  const c3 = c.surface;
  const c4 = c.secondary;
  const c5 = c.background;
  const c6 = c.muted;
  const cA2 = c.accent2 ?? c2; // Acento 2 paleta de apoyo (mayor contraste)
  const w = POSTER_BASE_WIDTH;
  const h = POSTER_HEIGHT;
  const px = (p: number) => (p / 100) * w;
  const py = (p: number) => (p / 100) * h;

  /** Color de fondo por clave de tile (solo paleta; "deep" → primary). */
  const tileBg = (bg: string): string =>
    ({ deep: c1, c1, c3, c4, c5 }[bg] ?? c6);

  const heroLabelStyle = { ...FONT_MONO, fontSize: 6, letterSpacing: '0.15em', textTransform: 'uppercase' as const, opacity: 0.6 };
  const mockupCaptionStyle = { ...FONT_MONO, fontSize: 6.5, color: c6, opacity: 0.5, letterSpacing: '0.08em' as const };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-0" role="img" aria-label="Sistema de patrones Aura: biblioteca de patrones, construcción y uso, aplicaciones">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div className="relative overflow-hidden shadow-2xl rounded" style={{ width: w, height: h, background: c5, ...FONT_SANS }}>
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 300, opacity: 0.18, mixBlendMode: 'multiply', backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '128px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.03, backgroundImage: `url("${BRANDING_KRAFT_URL}")`, backgroundSize: '200px' }} />
          {LAYOUT.dividerTops.map((top) => (
            <div key={top} className="absolute left-[5%] right-[5%] h-px pointer-events-none" style={{ top: `${top}%`, background: `linear-gradient(90deg, transparent, ${c3} 20%, ${c3} 80%, transparent)`, opacity: 0.15, zIndex: 3 }} />
          ))}

          {/* Cabecera — mismo formato que Ilustraciones / Papeleria: barra 8% + logo aura */}
          <div className="absolute top-0 left-0 right-0 z-[1]" style={{ height: '8%', background: c1 }}>
            <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: `linear-gradient(90deg, ${c2}, ${c4}, ${c2})`, opacity: 0.5 }} />
          </div>

          {/* Esquinas */}
          {CORNERS.map(({ pos, ...pct }) => {
            const place: Record<string, number> = {};
            if ('top' in pct && pct.top != null) place.top = py(pct.top);
            if ('bottom' in pct && pct.bottom != null) place.bottom = py(pct.bottom);
            if ('left' in pct && pct.left != null) place.left = px(pct.left);
            if ('right' in pct && pct.right != null) place.right = px(pct.right);
            return (
              <div key={pos} className="absolute z-[60] opacity-[0.12]" style={{ width: 14, height: 14, ...place }}>
                <div className="absolute top-0 left-0 w-full h-px" style={{ background: c6 }} />
                <div className="absolute top-0 left-0 w-px h-full" style={{ background: c6 }} />
              </div>
            );
          })}

          {/* Logo aura — mismo que Ilustraciones */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[50] flex items-center justify-center" style={{ top: 0, height: '8%', width: '100%' }}>
            <div className="flex flex-row items-center gap-4" style={{ transform: 'translate(-18px, 0) scale(1.1)', transformOrigin: 'center center' }}>
              <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 52, height: 52, transform: 'translate(22px, -6px)' }}>
                <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[52%] h-[38%] rounded-b-[40%]" style={{ borderLeft: `3px solid ${c5}`, borderRight: `3px solid ${c5}`, borderBottom: `3px solid ${c5}`, opacity: 0.72 }} />
                <div className="absolute left-1/2 -translate-x-1/2 w-[28%] rounded-full" style={{ bottom: '13%', height: 3, background: c5, opacity: 0.72 }} />
                <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -rotate-[8deg] w-[28%] h-[38%] border rounded-[50%_2px_50%_2px]" style={{ borderColor: c4, borderWidth: 3 }} />
              </div>
              <div className="flex flex-col items-start justify-center">
                <div className="font-serif lowercase leading-none" style={{ ...AURA_LOWERCASE, color: c5, fontSize: 18, letterSpacing: '0.2em' }}>aura</div>
                <div className="font-cursive" style={{ ...FONT_CURSIVE, color: c5, fontSize: 9, letterSpacing: '0.1em', marginTop: -1, opacity: 0.9 }}>slow brew coffee</div>
              </div>
            </div>
          </div>

          {/* Hero — 3 pattern panels */}
          <div className="absolute z-[20] rounded-lg overflow-hidden grid grid-cols-3 gap-0" style={{ top: py(LAYOUT.heroTop), left: px(5), right: px(5), height: py(LAYOUT.heroHeight) }}>
            <div className="relative overflow-hidden rounded-l-lg" style={{ background: c1 }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id="pat-botanical" x="0" y="0" width="60" height="80" patternUnits="userSpaceOnUse">
                    {BOTANICAL_LEAF_CELLS.map(({ cx, cy, rot }, i) => (
                      <path
                        key={i}
                        d={LOGO_LEAF_PATH}
                        fill="none"
                        stroke={c5}
                        strokeWidth="0.95"
                        opacity="0.52"
                        transform={`translate(${cx},${cy}) scale(0.9) rotate(${rot})`}
                      />
                    ))}
                  </pattern>
                </defs>
                <rect width="200" height="300" fill="url(#pat-botanical)" />
              </svg>
              <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, transparent 70%, ${c1}99)`, opacity: 0.4 }} />
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 z-[5]">
                <div className="rounded-full flex-shrink-0" style={{ width: 4, height: 4, background: c2, opacity: 0.6 }} />
                <span style={{ ...heroLabelStyle, color: c5 }}>{HERO_PANELS[0].label}</span>
              </div>
            </div>
            <div className="relative overflow-hidden" style={{ background: c3 }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id="pat-topo" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M0 50 Q25 30 50 50 Q75 70 100 50" fill="none" stroke={c1} strokeWidth="1.1" opacity="0.52" />
                    <path d="M0 40 Q25 20 50 40 Q75 60 100 40" fill="none" stroke={c1} strokeWidth="1" opacity="0.44" />
                    <path d="M0 60 Q25 40 50 60 Q75 80 100 60" fill="none" stroke={c1} strokeWidth="1" opacity="0.46" />
                    <path d="M0 30 Q25 10 50 30 Q75 50 100 30" fill="none" stroke={c6} strokeWidth="0.85" opacity="0.38" />
                    <path d="M0 70 Q25 50 50 70 Q75 90 100 70" fill="none" stroke={c6} strokeWidth="0.85" opacity="0.38" />
                    <circle cx="50" cy="50" r="8" fill="none" stroke={c2} strokeWidth="0.85" opacity="0.44" />
                    <circle cx="50" cy="50" r="4" fill="none" stroke={c2} strokeWidth="0.75" opacity="0.5" />
                    <circle cx="50" cy="50" r="1.5" fill={c2} opacity="0.42" />
                    <line x1="60" y1="50" x2="68" y2="50" stroke={c1} strokeWidth="0.7" opacity="0.38" />
                  </pattern>
                </defs>
                <rect width="200" height="300" fill="url(#pat-topo)" />
              </svg>
              <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, transparent 70%, ${c3}b3)`, opacity: 0.45 }} />
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 z-[5]">
                <div className="rounded-full flex-shrink-0" style={{ width: 4, height: 4, background: c2, opacity: 0.6 }} />
                <span style={{ ...heroLabelStyle, color: c1 }}>{HERO_PANELS[1].label}</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-r-lg" style={{ background: c4 }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id="pat-geo" x="0" y="0" width="40" height="50" patternUnits="userSpaceOnUse">
                    <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="none" stroke={c5} strokeWidth="1.1" opacity="0.78" />
                    <ellipse cx="20" cy="20" rx="5.5" ry="7" fill="none" stroke={c5} strokeWidth="1.25" opacity="0.85" />
                    <path d="M20 14.5 C21 17 21 23 20 26" fill="none" stroke={c5} strokeWidth="0.8" opacity="0.68" />
                    <circle cx="20" cy="2" r="0.8" fill={c5} opacity="0.65" />
                    <circle cx="4" cy="11" r="0.8" fill={c5} opacity="0.55" />
                    <circle cx="36" cy="11" r="0.8" fill={c5} opacity="0.55" />
                    <line x1="4" y1="40" x2="20" y2="48" stroke={c5} strokeWidth="0.7" opacity="0.56" />
                    <line x1="36" y1="40" x2="20" y2="48" stroke={c5} strokeWidth="0.7" opacity="0.56" />
                  </pattern>
                </defs>
                <rect width="200" height="300" fill="url(#pat-geo)" />
              </svg>
              <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, transparent 70%, ${c4}b3)`, opacity: 0.45 }} />
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 z-[5]">
                <div className="rounded-full flex-shrink-0" style={{ width: 4, height: 4, background: c2, opacity: 0.6 }} />
                <span style={{ ...heroLabelStyle, color: c5 }}>{HERO_PANELS[2].label}</span>
              </div>
            </div>
          </div>

          {/* Pattern Library — 6 tiles */}
          <div className="absolute z-[20]" style={{ top: py(LAYOUT.libraryTop), left: px(5), right: px(5) }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={{ ...FONT_MONO, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: c6 }}>Pattern Library</span>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '1fr 1fr' }}>
              {TILE_ITEMS.map((tile) => (
                <div key={tile.code} className="flex flex-col gap-1">
                  <div className="rounded overflow-hidden relative" style={{ aspectRatio: '3/2', background: tileBg(tile.bg) }}>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice">
                      <defs>
                        {tile.code === 'PT-01' && (
                          <pattern id="pat-tile-flow" x="0" y="0" width="30" height="20" patternUnits="userSpaceOnUse">
                            <path d="M0 10 Q7.5 4 15 10 Q22.5 16 30 10" fill="none" stroke={cA2} strokeWidth="1.2" opacity="0.82" />
                            <path d="M0 5 Q7.5 -1 15 5 Q22.5 11 30 5" fill="none" stroke={c5} strokeWidth="0.8" opacity="0.45" />
                            <path d="M0 15 Q7.5 9 15 15 Q22.5 21 30 15" fill="none" stroke={c5} strokeWidth="0.8" opacity="0.4" />
                            <circle cx="15" cy="10" r="0.6" fill={cA2} opacity="0.7" />
                          </pattern>
                        )}
                        {tile.code === 'PT-02' && (
                          <pattern id="pat-tile-seeds" x="0" y="0" width="35" height="35" patternUnits="userSpaceOnUse">
                            <ellipse cx="10" cy="10" rx="3" ry="4" fill="none" stroke={c1} strokeWidth="1" opacity="0.58" transform="rotate(-20,10,10)" />
                            <line x1="10" y1="7" x2="10" y2="13" stroke={c1} strokeWidth="0.6" opacity="0.42" transform="rotate(-20,10,10)" />
                            <ellipse cx="25" cy="22" rx="2.5" ry="3.5" fill="none" stroke={c6} strokeWidth="0.85" opacity="0.5" transform="rotate(15,25,22)" />
                            <line x1="25" y1="19.5" x2="25" y2="24.5" stroke={c6} strokeWidth="0.6" opacity="0.4" transform="rotate(15,25,22)" />
                            <circle cx="18" cy="30" r="0.6" fill={c4} opacity="0.42" />
                            <circle cx="30" cy="8" r="0.4" fill={c2} opacity="0.42" />
                            <circle cx="5" cy="28" r="0.5" fill={c2} opacity="0.38" />
                          </pattern>
                        )}
                        {tile.code === 'PT-03' && (
                          <pattern id="pat-tile-bloom" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="12" fill="none" stroke={cA2} strokeWidth="0.9" opacity="0.72" />
                            <circle cx="20" cy="20" r="7" fill="none" stroke={cA2} strokeWidth="1.1" opacity="0.78" />
                            <circle cx="20" cy="20" r="2.5" fill="none" stroke={c5} strokeWidth="1.15" opacity="0.72" />
                            <circle cx="20" cy="20" r="0.8" fill={cA2} opacity="0.74" />
                            <ellipse cx="20" cy="11" rx="2" ry="4" fill="none" stroke={c5} strokeWidth="0.75" opacity="0.62" />
                            <ellipse cx="28.5" cy="16" rx="2" ry="4" fill="none" stroke={c5} strokeWidth="0.75" opacity="0.62" transform="rotate(72,20,20)" />
                            <ellipse cx="26" cy="26" rx="2" ry="4" fill="none" stroke={c5} strokeWidth="0.75" opacity="0.62" transform="rotate(144,20,20)" />
                            <ellipse cx="14" cy="26" rx="2" ry="4" fill="none" stroke={c5} strokeWidth="0.75" opacity="0.62" transform="rotate(216,20,20)" />
                            <ellipse cx="11.5" cy="16" rx="2" ry="4" fill="none" stroke={c5} strokeWidth="0.75" opacity="0.62" transform="rotate(288,20,20)" />
                          </pattern>
                        )}
                        {tile.code === 'PT-04' && (
                          <pattern id="pat-tile-woven" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="5" x2="20" y2="5" stroke={c1} strokeWidth="1" opacity="0.5" />
                            <line x1="0" y1="15" x2="20" y2="15" stroke={c1} strokeWidth="1" opacity="0.5" />
                            <line x1="5" y1="0" x2="5" y2="20" stroke={c6} strokeWidth="0.85" opacity="0.42" />
                            <line x1="15" y1="0" x2="15" y2="20" stroke={c6} strokeWidth="0.85" opacity="0.42" />
                            <rect x="3" y="3" width="4" height="4" rx="1" fill="none" stroke={c2} strokeWidth="0.75" opacity="0.46" />
                            <rect x="13" y="13" width="4" height="4" rx="1" fill="none" stroke={c2} strokeWidth="0.75" opacity="0.46" />
                            <circle cx="5" cy="5" r="0.5" fill={c2} opacity="0.4" />
                            <circle cx="15" cy="15" r="0.5" fill={c2} opacity="0.4" />
                          </pattern>
                        )}
                        {tile.code === 'PT-05' && (
                          <pattern id="pat-tile-mountain" x="0" y="0" width="60" height="40" patternUnits="userSpaceOnUse">
                            <path d="M0 35 L15 15 L30 30 L45 10 L60 35" fill="none" stroke={c5} strokeWidth="1.2" opacity="0.62" />
                            <path d="M0 38 L20 22 L35 32 L50 18 L60 38" fill="none" stroke={c5} strokeWidth="0.8" opacity="0.44" />
                            <circle cx="50" cy="8" r="3" fill="none" stroke={cA2} strokeWidth="0.9" opacity="0.7" />
                            <circle cx="50" cy="8" r="1" fill={cA2} opacity="0.6" />
                            <line x1="50" y1="3" x2="50" y2="1" stroke={cA2} strokeWidth="0.6" opacity="0.6" />
                            <line x1="55" y1="8" x2="57" y2="8" stroke={cA2} strokeWidth="0.6" opacity="0.6" />
                            <line x1="45" y1="8" x2="43" y2="8" stroke={cA2} strokeWidth="0.6" opacity="0.6" />
                          </pattern>
                        )}
                        {tile.code === 'PT-06' && (
                          <pattern id="pat-tile-stamps" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="10" fill="none" stroke={c5} strokeWidth="1.35" opacity="0.55" />
                            <circle cx="20" cy="20" r="7" fill="none" stroke={c5} strokeWidth="1" opacity="0.48" />
                            <text x="20" y="23" textAnchor="middle" fontFamily="serif" fontSize="10" fill={c5} opacity="0.52" letterSpacing="0.1">a</text>
                            <line x1="0" y1="0" x2="4" y2="0" stroke={c5} strokeWidth="0.75" opacity="0.38" />
                            <line x1="0" y1="0" x2="0" y2="4" stroke={c5} strokeWidth="0.75" opacity="0.38" />
                            <circle cx="0" cy="0" r="0.5" fill={c5} opacity="0.35" />
                          </pattern>
                        )}
                      </defs>
                      <rect width="120" height="120" fill={`url(#${TILE_PATTERN_IDS[tile.code] ?? 'pat-tile-stamps'})`} />
                    </svg>
                    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.08, mixBlendMode: 'overlay', backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '80px' }} />
                  </div>
                  <div className="flex items-baseline justify-between gap-1">
                    <span style={{ ...FONT_SERIF, fontStyle: 'italic', fontSize: 9, color: c1, letterSpacing: '0.04em' }}>{tile.name}</span>
                    <span style={{ ...FONT_MONO, fontSize: 6, color: c6, opacity: 0.4, letterSpacing: '0.1em' }}>{tile.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern in Context — 4 mockups */}
          <div className="absolute z-[20]" style={{ top: py(LAYOUT.contextTop), left: px(5), right: px(5) }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={{ ...FONT_MONO, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: c6 }}>Pattern in Context</span>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {/* Coffee Bag */}
              <div className="flex flex-col gap-1">
                <div className="rounded overflow-hidden relative" style={{ aspectRatio: 0.8, background: c1 }}>
                  <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c1}ee, ${c1})` }} />
                  <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%,-50%)', width: '45%', height: '70%', borderRadius: 3, overflow: 'hidden', boxShadow: '2px 3px 10px rgba(0,0,0,.25)' }}>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 60 100">
                      <defs>
                        <pattern id="apply-bagpat" x="0" y="0" width="15" height="20" patternUnits="userSpaceOnUse">
                          <path d="M7.5 2 Q10 8 7.5 15 Q5 8 7.5 2Z" fill="none" stroke={c4} strokeWidth="1.1" opacity="0.7" />
                          <ellipse cx="3" cy="17" rx="2" ry="2.5" fill="none" stroke={c2} strokeWidth="0.85" opacity="0.55" />
                        </pattern>
                      </defs>
                      <rect width="60" height="100" fill={c3} />
                      <rect width="60" height="100" fill="url(#apply-bagpat)" />
                    </svg>
                    <div className="absolute rounded-sm flex items-center justify-center" style={{ top: '25%', left: '15%', right: '15%', bottom: '30%', background: c5, opacity: 0.85 }}>
                      <span style={{ ...FONT_SERIF, fontSize: 6, letterSpacing: '0.2em', textTransform: 'lowercase', color: c1, opacity: 0.6 }}>aura</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.06, backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '60px' }} />
                </div>
                <span style={mockupCaptionStyle}>{APPLY_ITEMS[0].label}</span>
              </div>
              {/* Tissue Paper */}
              <div className="flex flex-col gap-1">
                <div className="rounded overflow-hidden relative" style={{ aspectRatio: 0.8, background: c3 }}>
                  <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c3}, ${c3}dd)` }} />
                  <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%,-50%) rotate(-8deg)', width: '65%', height: '60%', borderRadius: 2, overflow: 'hidden', boxShadow: '1px 2px 8px rgba(0,0,0,.08)' }}>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 70">
                      <defs>
                        <pattern id="apply-tisspat" x="0" y="0" width="20" height="25" patternUnits="userSpaceOnUse">
                          <circle cx="10" cy="12" r="6" fill="none" stroke={c1} strokeWidth="0.9" opacity="0.5" />
                          <circle cx="10" cy="12" r="3" fill="none" stroke={c2} strokeWidth="0.9" opacity="0.58" />
                          <circle cx="10" cy="12" r="0.8" fill={c2} opacity="0.48" />
                        </pattern>
                      </defs>
                      <rect width="80" height="70" fill={c5} />
                      <rect width="80" height="70" fill="url(#apply-tisspat)" />
                    </svg>
                    <div className="absolute top-0 left-0 w-full" style={{ height: '30%', background: 'linear-gradient(180deg, rgba(255,255,255,.2), transparent)' }} />
                    <div className="absolute top-0 right-0" style={{ width: '30%', height: '25%', background: c3, clipPath: 'polygon(100% 0, 0 0, 100% 100%)', opacity: 0.5 }} />
                  </div>
                  <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.06, backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '60px' }} />
                </div>
                <span style={mockupCaptionStyle}>{APPLY_ITEMS[1].label}</span>
              </div>
              {/* Cup Sleeve */}
              <div className="flex flex-col gap-1">
                <div className="rounded overflow-hidden relative" style={{ aspectRatio: 0.8, background: c1 }}>
                  <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c1}dd, ${c1})` }} />
                  <div className="absolute bottom-[10%] left-1/2" style={{ transform: 'translateX(-50%)', width: '40%', height: '68%' }}>
                    <div className="absolute -top-[4%] -left-[5%] -right-[5%]" style={{ height: '10%', background: c6, borderRadius: '3px 3px 1px 1px', opacity: 0.9 }} />
                    <div className="absolute inset-0 rounded-b overflow-hidden" style={{ background: c5, borderRadius: '2px 2px 5px 5px' }}>
                      <div className="absolute left-0 right-0" style={{ top: '20%', height: '35%' }}>
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 50 25">
                          <defs>
                            <pattern id="apply-sleevepat" x="0" y="0" width="10" height="12.5" patternUnits="userSpaceOnUse">
                              <path d="M5 1 Q7 4 5 8 Q3 4 5 1Z" fill="none" stroke={c4} strokeWidth="0.95" opacity="0.72" />
                              <circle cx="2" cy="10" r="0.8" fill={c2} opacity="0.5" />
                            </pattern>
                          </defs>
                          <rect width="50" height="25" fill={c1} />
                          <rect width="50" height="25" fill="url(#apply-sleevepat)" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute -bottom-[6%] left-[10%] w-[80%] h-[8%] rounded-full" style={{ background: c1, filter: 'blur(4px)', opacity: 0.2 }} />
                  </div>
                  <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.06, backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '60px' }} />
                </div>
                <span style={mockupCaptionStyle}>{APPLY_ITEMS[2].label}</span>
              </div>
              {/* Hang Tag */}
              <div className="flex flex-col gap-1">
                <div className="rounded overflow-hidden relative" style={{ aspectRatio: 0.8, background: c3 }}>
                  <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c3}, ${c3}ee)` }} />
                  <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%,-50%) rotate(5deg)', width: '55%', height: '65%', borderRadius: 3, overflow: 'hidden', boxShadow: '1px 2px 8px rgba(0,0,0,.1)' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-[12%]" style={{ background: c6, opacity: 0.2 }} />
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 60 80">
                      <defs>
                        <pattern id="apply-tagpat" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <polygon points="10,1 18,5.5 18,14.5 10,19 2,14.5 2,5.5" fill="none" stroke={c5} strokeWidth="0.9" opacity="0.62" />
                          <ellipse cx="10" cy="10" rx="3" ry="3.5" fill="none" stroke={c5} strokeWidth="1" opacity="0.68" />
                          <path d="M10 7.5 C10.5 9 10.5 11 10 12.5" fill="none" stroke={c5} strokeWidth="0.6" opacity="0.48" />
                        </pattern>
                      </defs>
                      <rect width="60" height="80" fill={c1} />
                      <rect width="60" height="80" fill="url(#apply-tagpat)" />
                    </svg>
                    <div className="absolute top-[8%] left-1/2 -translate-x-1/2 rounded-full border" style={{ width: 8, height: 8, borderColor: c5, opacity: 0.25 }} />
                    <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[70%] text-center">
                      <span style={{ ...FONT_SERIF, fontSize: 6, letterSpacing: '0.2em', textTransform: 'lowercase', color: c5, opacity: 0.7 }}>aura</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.06, backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '60px' }} />
                </div>
                <span style={mockupCaptionStyle}>{APPLY_ITEMS[3].label}</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[2%] right-[-4%] z-[4] pointer-events-none select-none lowercase" style={{ ...FONT_SERIF, fontSize: 140, color: c3, lineHeight: 0.65, opacity: 0.12 }}>a</div>

          {/* Footer — mismo formato que Ilustraciones / Papeleria */}
          <div className="absolute bottom-0 left-0 right-0 z-[100] flex items-center justify-center" style={{ height: '3.5%', background: c1 }}>
            <div className="flex items-center gap-1.5">
              <div className="rounded-full" style={{ width: 4, height: 4, background: c4 }} />
              <span className="font-serif text-xs tracking-[0.35em] lowercase" style={{ ...FONT_SERIF, color: c5 }}>aura</span>
              <div className="rounded-full" style={{ width: 4, height: 4, background: c4 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Patrones = memo(PatronesInner);
