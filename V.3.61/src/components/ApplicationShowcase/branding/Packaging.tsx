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

const LAYOUT = {
  headerHeight: 8,
  heroTop: 12.5,
  heroHeight: 30,
  anatomyTop: 46,
  unboxTop: 73.2,
  dividerTops: [40, 56.5, 73.5, 80.5] as const,
} as const;

const SPECS_FORMATS = [
  { name: 'Bag — 250g', detail: '120 × 200 × 70mm' },
  { name: 'Bag — 1kg', detail: '160 × 270 × 90mm' },
  { name: 'Tin — 200g', detail: 'Ø 95 × 130mm' },
  { name: 'Sub Box', detail: '250 × 180 × 100mm' },
];

const SPECS_MATERIALS = [
  { name: 'Kraft + PLA liner', detail: 'Compostable barrier' },
  { name: 'Tinplate matte', detail: 'Reusable, food-safe' },
  { name: 'FSC corrugated', detail: 'E-flute, soy inks' },
];

const UNBOX_STEPS = [
  { num: '01', label: 'Sealed & Ribboned' },
  { num: '02', label: 'Lid Reveal' },
  { num: '03', label: 'Contents & Extras' },
  { num: '04', label: 'Brew Moment' },
] as const;

/** Path SVG de la hoja del logo (rounded 50% 2px 50% 2px). Centrado en 0,0. */
const LOGO_LEAF_PATH =
  'M 0 -10 L 7 -10 L 7 0 A 7 10 0 0 1 0 10 L -7 10 L -7 0 A 7 10 0 0 1 0 -10 Z';

interface Props {
  posterColors: PosterPalette;
  sceneOnly?: boolean;
}

function PackagingInner({ posterColors, sceneOnly }: Props) {
  const c = posterColors;
  const c1 = c.primary;
  const c2 = c.accent;
  const c3 = c.surface;
  const c4 = c.secondary;
  const c5 = c.background;
  const c6 = c.muted;
  const w = POSTER_BASE_WIDTH;
  const h = POSTER_HEIGHT;
  const px = (p: number) => (p / 100) * w;
  const py = (p: number) => (p / 100) * h;
  /** Solo banner, pie, texturas de hoja y marco; el resto del arte se muestra en Solo escena. */
  const posterChrome = !sceneOnly;

  const secHeaderStyle = { ...FONT_MONO, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: c6 };
  const heroLabelStyle = { ...FONT_MONO, fontSize: 6, letterSpacing: '0.15em', textTransform: 'uppercase' as const, opacity: 0.7 };
  const unboxLabelStyle = { ...FONT_MONO, fontSize: 6.5, color: c1, opacity: 0.75, letterSpacing: '0.1em' as const };
  const unboxStepNumStyle = (darkBg: boolean) => ({ ...FONT_SERIF, fontSize: 14, color: darkBg ? c5 : c2, opacity: darkBg ? 0.4 : 0.38 });
  const grainOverlay = { backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '80px' as const };
  const svgCalloutLeft = { fontFamily: 'DM Mono, monospace', fontSize: 6.5, fill: c1, opacity: 0.75, letterSpacing: '0.08em', textAnchor: 'end' as const };
  const svgCalloutRight = { fontFamily: 'DM Mono, monospace', fontSize: 6.5, fill: c1, opacity: 0.75, letterSpacing: '0.08em', textAnchor: 'start' as const };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-0" role="img" aria-label="Packaging & Labels — Aura">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div
          className={posterChrome ? 'relative overflow-hidden shadow-2xl rounded' : 'relative overflow-hidden'}
          style={{ width: w, height: h, background: posterChrome ? c5 : 'transparent', ...FONT_SANS }}
        >
          {posterChrome && (
            <>
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 300, opacity: 0.18, mixBlendMode: 'multiply', backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '128px' }} />
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.03, backgroundImage: `url("${BRANDING_KRAFT_URL}")`, backgroundSize: '200px' }} />
              {LAYOUT.dividerTops.map((top) => (
                <div key={top} className="absolute left-[5%] right-[5%] h-px pointer-events-none" style={{ top: `${top}%`, background: `linear-gradient(90deg, transparent, ${c3} 20%, ${c3} 80%, transparent)`, opacity: 0.15, zIndex: 3 }} />
              ))}
            </>
          )}

          {/* Cabecera — mismo formato que Ilustraciones / Papeleria */}
          {posterChrome && (
          <>
          <div className="absolute top-0 left-0 right-0 z-[1]" style={{ height: `${LAYOUT.headerHeight}%`, background: c1 }}>
            <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: `linear-gradient(90deg, ${c2}, ${c4}, ${c2})`, opacity: 0.5 }} />
          </div>

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
          <div className="absolute left-1/2 -translate-x-1/2 z-[50] flex items-center justify-center" style={{ top: 0, height: `${LAYOUT.headerHeight}%`, width: '100%' }}>
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
          </>
          )}

          {/* Hero — Packaging scene */}
          <div
            className="absolute z-[20] rounded-lg overflow-hidden"
            style={{
              top: posterChrome ? py(LAYOUT.heroTop) : py(4),
              left: px(5),
              right: px(5),
              height: py(LAYOUT.heroHeight),
              background: c1,
            }}
          >
            <div className="absolute inset-0" style={{ background: `linear-gradient(155deg, ${c1} 0%, ${c4} 28%, ${c4} 55%, ${c1} 100%)` }} />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(87deg, transparent, transparent 14px, ${c2} 14px, ${c2} 15px)` }} />
            {/* Orbes de luz suaves para dar profundidad */}
            <div className="absolute top-0 left-0 w-[70%] h-[60%] pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 70% at 20% 30%, ${c4} 0%, transparent 55%)`, opacity: 0.18 }} />
            <div className="absolute bottom-0 right-0 w-[55%] h-[50%] pointer-events-none" style={{ background: `radial-gradient(ellipse 70% 60% at 85% 75%, ${c2} 0%, transparent 50%)`, opacity: 0.08 }} />
            {/* Luz central suave — ilumina el centro en lugar de oscurecer bordes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] pointer-events-none" style={{ background: `radial-gradient(ellipse 55% 45% at 50% 55%, ${c5} 0%, transparent 65%)`, opacity: 0.22 }} />
            {/* Patrón geométrico sutil: grid de puntos (color fondo paleta de apoyo c5) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.35]"
              style={{
                backgroundImage: `radial-gradient(circle at center, ${c5} 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />

            {/* Coffee bag */}
            <div className="absolute rounded overflow-hidden" style={{ bottom: '8%', left: '6%', width: '28%', height: '82%', zIndex: 5 }}>
              <div className="absolute -bottom-[5%] left-[5%] w-[90%] h-[8%] rounded-full pointer-events-none" style={{ background: c1, filter: 'blur(7px)', opacity: 0.2 }} />
              <div className="absolute inset-0 rounded-b overflow-hidden" style={{ background: `linear-gradient(175deg, ${c3} 0%, ${c3}dd 100%)`, boxShadow: '3px 5px 18px rgba(0,0,0,.25)' }}>
                <div className="absolute top-0 left-0 right-0 h-[8%]" style={{ background: c6, opacity: 0.12 }} />
                <div className="absolute top-[6%] left-0 right-0 h-[4%] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.04), transparent)' }} />
                <div className="absolute top-[14%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ background: c6, opacity: 0.15 }} />
                <div className="absolute top-[22%] left-[10%] right-[10%] bottom-[18%] border rounded flex flex-col items-center justify-center gap-1 p-[6%]" style={{ borderColor: c1, borderWidth: 1.5 }}>
                  <svg viewBox="-8 -12 16 24" className="w-5 h-6 flex-shrink-0" style={{ transform: 'rotate(-8deg)' }}>
                    <path d={LOGO_LEAF_PATH} fill="none" stroke={c2} strokeWidth="1.2" opacity="0.6" />
                  </svg>
                  <span style={{ ...FONT_SERIF, fontSize: 11, letterSpacing: '0.3em', textTransform: 'lowercase', color: c1 }}>aura</span>
                  <div className="w-[40%] h-px" style={{ background: c1, opacity: 0.12 }} />
                  <span style={{ ...FONT_CURSIVE, fontSize: 8, color: c4, opacity: 0.7 }}>single origin</span>
                  <span style={{ ...FONT_MONO, fontSize: 6, letterSpacing: '0.2em', textTransform: 'uppercase', color: c6, opacity: 0.6, marginTop: 3 }}>Ethiopia · Yirgacheffe</span>
                </div>
                <span className="absolute bottom-[6%] left-1/2 -translate-x-1/2" style={{ ...FONT_MONO, fontSize: 7, color: c6, letterSpacing: '0.15em' }}>250g</span>
                <div className="absolute top-[10%] left-[6%] w-[12%] h-[55%] rounded-sm pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,.06), transparent)' }} />
                <div className="absolute top-[8%] right-0 w-[6%] h-[74%] rounded-r pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,0,0,.06))' }} />
              </div>
            </div>

            {/* Tin — círculos mantenidos; textos y anillos en c5 (fondo paleta) para contraste */}
            <div className="absolute rounded overflow-hidden" style={{ bottom: '10%', left: '38%', width: '20%', height: '58%', zIndex: 4 }}>
              <div className="absolute -bottom-[5%] left-[5%] w-[90%] h-[8%] rounded-full pointer-events-none" style={{ background: c1, filter: 'blur(6px)', opacity: 0.18 }} />
              <div className="absolute inset-0 rounded overflow-hidden" style={{ background: `linear-gradient(175deg, ${c1}, ${c1}ee)`, boxShadow: '3px 4px 16px rgba(0,0,0,.25)' }}>
                <div className="absolute -top-[1%] -left-[3%] -right-[3%] h-[6%] rounded-t" style={{ background: `linear-gradient(180deg, ${c4}, ${c1})`, boxShadow: '0 1px 3px rgba(0,0,0,.15)' }} />
                <div className="absolute top-[5%] left-0 right-0 h-[2%]" style={{ background: c5, opacity: 0.12 }} />
                <div className="absolute top-[14%] left-[8%] right-[8%] bottom-[16%] flex flex-col items-center justify-center gap-0.5">
                  <div className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: c5, opacity: 0.35 }}>
                    <div className="w-[55%] h-[55%] rounded-full border" style={{ borderColor: c5, opacity: 0.45 }} />
                  </div>
                  <span style={{ ...FONT_SERIF, fontSize: 9, letterSpacing: '0.25em', textTransform: 'lowercase', color: c5 }}>aura</span>
                  <span style={{ ...FONT_CURSIVE, fontSize: 7, color: c5, opacity: 0.85 }}>house blend</span>
                  <span style={{ ...FONT_MONO, fontSize: 5, letterSpacing: '0.2em', textTransform: 'uppercase', color: c5, opacity: 0.7 }}>Ground · 200g</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[8%] rounded-b" style={{ background: c5, opacity: 0.12 }} />
                <div className="absolute top-[8%] left-[8%] w-[15%] h-[50%] rounded-sm pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,.05), transparent)' }} />
                <div className="absolute top-[10%] right-[12%] w-px h-[40%] pointer-events-none" style={{ background: 'rgba(255,255,255,.03)' }} />
              </div>
            </div>

            {/* Subscription box */}
            <div className="absolute rounded overflow-hidden" style={{ bottom: '6%', right: '4%', width: '32%', height: '70%', zIndex: 3, transform: 'rotate(2deg)' }}>
              <div className="absolute -bottom-[4%] left-[5%] w-[90%] h-[7%] rounded-full pointer-events-none" style={{ background: c1, filter: 'blur(8px)', opacity: 0.2 }} />
              <div className="absolute inset-0 rounded overflow-hidden" style={{ background: `linear-gradient(170deg, ${c3}, ${c3}dd)`, boxShadow: '4px 5px 20px rgba(0,0,0,.25)' }}>
                <div className="absolute top-0 left-0 right-0 h-[18%] rounded-t" style={{ background: `linear-gradient(180deg, ${c3}ee, ${c3})`, borderBottom: '1px solid rgba(0,0,0,.04)' }} />
                <div className="absolute top-0 left-0 right-0 h-[50%] rounded-t pointer-events-none" style={{ background: `linear-gradient(180deg, ${c3}, ${c3}dd)`, opacity: 0.5 }} />
                <div className="absolute top-[18%] left-0 right-0 h-[5%] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.06), transparent)' }} />
                <div className="absolute top-[12%] left-[8%] right-[8%] h-[10%] overflow-hidden pointer-events-none">
                  <div className="absolute bottom-0 left-0 right-0 w-full h-[200%] rounded-b-[50%]" style={{ background: c5, opacity: 0.3 }} />
                </div>
                <div className="absolute top-[16%] left-1/2 -translate-x-1/2 w-[2%] h-[55%] pointer-events-none z-[2]" style={{ background: c2, opacity: 0.1 }} />
                <div className="absolute top-[14%] left-[42%] w-[10%] h-[5%] border rounded-full pointer-events-none" style={{ borderColor: c2, opacity: 0.08, transform: 'rotate(-20deg)' }} />
                <div className="absolute top-[14%] right-[42%] w-[10%] h-[5%] border rounded-full pointer-events-none" style={{ borderColor: c2, opacity: 0.08, transform: 'rotate(20deg)' }} />
                <div className="absolute top-[25%] left-[12%] right-[12%] h-[45%] border rounded flex flex-col items-center justify-center gap-0.5 p-[5%]" style={{ borderColor: c1, borderWidth: 1.5 }}>
                  <svg viewBox="-8 -12 16 24" className="w-6 h-7 flex-shrink-0" style={{ transform: 'rotate(-8deg)' }}>
                    <path d={LOGO_LEAF_PATH} fill="none" stroke={c4} strokeWidth="1.2" opacity="0.5" />
                  </svg>
                  <span style={{ ...FONT_SERIF, fontSize: 10, letterSpacing: '0.25em', textTransform: 'lowercase', color: c1 }}>aura</span>
                  <div className="w-[35%] h-px" style={{ background: c1, opacity: 0.1 }} />
                  <span style={{ ...FONT_CURSIVE, fontSize: 8, color: c4, opacity: 0.65 }}>monthly ritual</span>
                  <span style={{ ...FONT_MONO, fontSize: 5, letterSpacing: '0.25em', textTransform: 'uppercase', color: c6, opacity: 0.6 }}>Subscription Box</span>
                </div>
                <div className="absolute top-[76%] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full pointer-events-none" style={{ background: c2, opacity: 0.2, boxShadow: '0 1px 3px rgba(0,0,0,.1)' }}>
                  <div className="absolute inset-[22%] rounded-full border pointer-events-none" style={{ borderColor: c1, opacity: 0.15 }} />
                </div>
              </div>
            </div>
            {/* Scattered beans + dried leaf — subidos con el resto */}
            <div className="absolute pointer-events-none" style={{ top: '70%', left: '55%', zIndex: 2 }}>
              <div className="w-2 h-2.5 border rounded-full" style={{ borderColor: c2, opacity: 0.08, transform: 'rotate(20deg)' }} />
            </div>
            <div className="absolute pointer-events-none" style={{ top: '77%', left: '62%', zIndex: 2 }}>
              <div className="w-1.5 h-2 border rounded-full" style={{ borderColor: c2, opacity: 0.08, transform: 'rotate(-30deg)' }} />
            </div>
            <div className="absolute pointer-events-none" style={{ top: '65%', left: '58%', zIndex: 2 }}>
              <div className="w-1 h-1.5 border rounded-full" style={{ borderColor: c2, opacity: 0.08, transform: 'rotate(45deg)' }} />
            </div>
            <div className="absolute top-[6%] right-[32%] w-3 h-5 border rounded-[50%_2px_50%_2px] pointer-events-none" style={{ borderColor: c4, opacity: 0.08, transform: 'rotate(-40deg)', zIndex: 8 }} />

            <div className="absolute bottom-2 left-2 flex items-center gap-1 z-[10]">
              <div className="rounded-full w-1.5 h-1.5" style={{ background: c2, opacity: 0.6 }} />
              <span style={{ ...heroLabelStyle, color: c5 }}>Hero — Packaging Suite</span>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '80px' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 35% 45% at 35% 45%, transparent 25%, rgba(0,0,0,.2) 100%)' }} />
          </div>

          {/* Anatomy + Specs + Unboxing (sin cabecera en Solo escena: subimos un poco los bloques) */}
          <>
          <div
            className="absolute z-[20]"
            style={{ top: posterChrome ? py(LAYOUT.anatomyTop) : py(36.5), left: px(5), right: px(5) }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={secHeaderStyle}>Packaging Anatomy</span>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: '1.3fr 1fr' }}>
              <div className="rounded-lg overflow-hidden relative" style={{ background: c3, padding: 12, aspectRatio: 1.55 }}>
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${c4}, ${c2})`, opacity: 0.5 }} />
                <div className="absolute top-0.5 left-0 right-0 h-1/2 pointer-events-none" style={{ background: `linear-gradient(180deg, ${c1}, transparent)`, opacity: 0.06 }} />
                <span style={{ ...FONT_SERIF, fontSize: 11, color: c1, letterSpacing: '0.04em', marginBottom: 6, display: 'block', position: 'relative', zIndex: 1 }}>Exploded View — Coffee Bag</span>
                <svg viewBox="0 0 280 180" className="w-full h-full min-h-[100px]">
                  <rect x="100" y="20" width="80" height="140" rx="3" fill="none" stroke={c1} strokeWidth="1" opacity="0.5" />
                  <rect x="100" y="20" width="80" height="12" rx="2" fill={c1} fillOpacity="0.08" stroke={c1} strokeWidth="0.8" opacity="0.55" />
                  <circle cx="140" cy="42" r="4" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.5" />
                  <rect x="112" y="55" width="56" height="70" rx="2" fill={c4} fillOpacity="0.1" stroke={c1} strokeWidth="1" opacity="0.55" />
                  <g transform="translate(140, 72) scale(0.5) rotate(-8)">
                    <path d={LOGO_LEAF_PATH} fill="none" stroke={c1} strokeWidth="1.8" opacity="0.55" />
                  </g>
                  <text x="140" y="88" textAnchor="middle" fontFamily="Libre Baskerville, serif" fontSize="8.5" fill={c1} opacity="0.75" letterSpacing="0.2em">aura</text>
                  <line x1="128" y1="93" x2="152" y2="93" stroke={c1} strokeWidth="0.5" opacity="0.4" />
                  <text x="140" y="102" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="7" fill={c4} opacity="0.65">single origin</text>
                  <text x="140" y="150" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="6" fill={c1} opacity="0.55" letterSpacing="0.15em">250g</text>
                  <line x1="100" y1="26" x2="40" y2="18" stroke={c1} strokeWidth="0.5" opacity="0.45" strokeDasharray="2,2" />
                  <text x="38" y="16" {...svgCalloutLeft}>FOLD SEAL</text>
                  <line x1="144" y1="42" x2="220" y2="30" stroke={c1} strokeWidth="0.5" opacity="0.45" strokeDasharray="2,2" />
                  <text x="222" y="28" {...svgCalloutRight}>DEGASSING</text>
                  <text x="222" y="35" {...svgCalloutRight}>VALVE</text>
                  <line x1="168" y1="90" x2="230" y2="75" stroke={c1} strokeWidth="0.5" opacity="0.45" strokeDasharray="2,2" />
                  <text x="222" y="73" {...svgCalloutRight}>MAIN LABEL</text>
                  <text x="222" y="80" {...svgCalloutRight}>LETTERPRESS</text>
                  <line x1="180" y1="90" x2="240" y2="110" stroke={c1} strokeWidth="0.5" opacity="0.45" strokeDasharray="2,2" />
                  <text x="222" y="108" {...svgCalloutRight}>SIDE GUSSET</text>
                  <text x="222" y="115" {...svgCalloutRight}>KRAFT LINED</text>
                  <line x1="100" y1="140" x2="35" y2="155" stroke={c1} strokeWidth="0.5" opacity="0.45" strokeDasharray="2,2" />
                  <text x="38" y="153" {...svgCalloutLeft}>ZIP-LOCK</text>
                  <text x="38" y="160" {...svgCalloutLeft}>RESEAL</text>
                  <line x1="112" y1="70" x2="30" y2="60" stroke={c1} strokeWidth="0.5" opacity="0.45" strokeDasharray="2,2" />
                  <text x="38" y="58" {...svgCalloutLeft}>BEAN ICON</text>
                  <text x="38" y="65" {...svgCalloutLeft}>FOIL STAMP</text>
                  <circle cx="100" cy="26" r="2" fill={c1} opacity="0.5" />
                  <circle cx="144" cy="42" r="2" fill={c1} opacity="0.5" />
                  <circle cx="168" cy="90" r="2" fill={c1} opacity="0.5" />
                  <circle cx="180" cy="90" r="2" fill={c1} opacity="0.5" />
                  <circle cx="100" cy="140" r="2" fill={c1} opacity="0.5" />
                  <circle cx="112" cy="70" r="2" fill={c1} opacity="0.5" />
                </svg>
              </div>
              <div className="rounded-lg overflow-hidden flex flex-col relative" style={{ background: c3, padding: 12, aspectRatio: 1.55 }}>
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${c4}, ${c2})`, opacity: 0.4 }} />
                <span style={{ ...FONT_SERIF, fontSize: 11, color: c1, letterSpacing: '0.04em', marginBottom: 8 }}>Specifications</span>
                <div className="grid gap-3 flex-1" style={{ gridTemplateColumns: '1fr 1fr', alignContent: 'start' }}>
                  <div>
                    <div style={{ ...FONT_MONO, fontSize: 6, letterSpacing: '0.3em', textTransform: 'uppercase', color: c6, opacity: 0.5, marginBottom: 4 }}>Formats</div>
                    <div className="flex flex-col gap-1">
                      {SPECS_FORMATS.map((row, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: c4, opacity: 0.12 }} />
                          <div className="flex flex-col min-w-0">
                            <span style={{ ...FONT_SERIF, fontSize: 7.5, color: c1, letterSpacing: '0.03em' }}>{row.name}</span>
                            <span style={{ ...FONT_MONO, fontSize: 6, color: c6, opacity: 0.45 }}>{row.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ ...FONT_MONO, fontSize: 6, letterSpacing: '0.3em', textTransform: 'uppercase', color: c6, opacity: 0.5, marginBottom: 4 }}>Materials</div>
                    <div className="flex flex-col gap-1">
                      {SPECS_MATERIALS.map((row, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: c1, opacity: 0.15 }} />
                          <div className="flex flex-col min-w-0">
                            <span style={{ ...FONT_SERIF, fontSize: 7.5, color: c1, letterSpacing: '0.03em' }}>{row.name}</span>
                            <span style={{ ...FONT_MONO, fontSize: 6, color: c6, opacity: 0.45 }}>{row.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="absolute z-[20]"
            style={{ top: posterChrome ? py(LAYOUT.unboxTop) : py(63), left: px(5), right: px(5) }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={secHeaderStyle}>Unboxing Experience</span>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {UNBOX_STEPS.map((step, i) => {
                const darkBg = i % 2 === 1;
                return (
                  <div key={step.num} className="flex flex-col gap-0.5">
                    <div className="rounded-lg overflow-hidden relative" style={{ aspectRatio: 0.9, background: darkBg ? c1 : c3 }}>
                      {darkBg && <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c1}ee, ${c1})` }} />}
                      <span className="absolute top-[6%] left-[8%] z-[2]" style={unboxStepNumStyle(darkBg)}>{step.num}</span>
                      {i === 0 && (
                        <>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[55%] rounded border" style={{ borderColor: c6, borderWidth: 1.5, opacity: 0.65 }} />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-0.5" style={{ background: c2, opacity: 0.28 }} />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-[65%]" style={{ background: c2, opacity: 0.28 }} />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: c2, opacity: 0.35 }} />
                        </>
                      )}
                      {i === 1 && (
                        <>
                          <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[58%] h-[45%] rounded" style={{ background: c3, opacity: 0.45 }} />
                          <div className="absolute bottom-[55%] left-1/2 -translate-x-1/2 w-[62%] h-[15%] rounded-t" style={{ background: c3, opacity: 0.35 }} />
                          <div className="absolute bottom-[50%] left-1/2 -translate-x-1/2 w-[50%] h-[12%] rounded-t-[50%]" style={{ background: c5, opacity: 0.35 }} />
                        </>
                      )}
                      {i === 2 && (
                        <>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[55%] rounded border" style={{ background: c5, borderColor: c6, opacity: 0.55 }} />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20%] h-[15%] rounded-sm" style={{ background: c1, opacity: 0.25 }} />
                          <div className="absolute bottom-[22%] right-[18%] w-[25%] rounded-sm" style={{ aspectRatio: 1.6, background: c1, opacity: 0.3, transform: 'rotate(5deg)' }} />
                          <div className="absolute top-[25%] left-[18%] w-[15%] rounded-full border" style={{ aspectRatio: 1, borderColor: c4, opacity: 0.28 }} />
                        </>
                      )}
                      {i === 3 && (
                        <>
                          <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[50%] aspect-square rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${c2}, transparent 70%)`, opacity: 0.12 }} />
                          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[30%] h-[35%] rounded-b" style={{ background: c5, borderRadius: '2px 2px 6px 6px', opacity: 0.35 }} />
                          <div className="absolute bottom-[25%] right-[28%] w-[10%] h-[18%] border border-l-0 rounded-r-full" style={{ borderColor: c5, opacity: 0.28 }} />
                          <div className="absolute bottom-[55%] left-1/2 -translate-x-1/2 flex gap-0.5">
                            <div className="w-px rounded-full" style={{ height: 8, background: c5, opacity: 0.2 }} />
                            <div className="w-px rounded-full" style={{ height: 12, background: c5, opacity: 0.2 }} />
                            <div className="w-px rounded-full" style={{ height: 7, background: c5, opacity: 0.2 }} />
                          </div>
                        </>
                      )}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={grainOverlay} />
                    </div>
                    <span style={unboxLabelStyle}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          </>

          {posterChrome && (
          <>
          <div className="absolute bottom-[2%] right-[-4%] z-[4] pointer-events-none select-none lowercase" style={{ ...FONT_SERIF, fontSize: 140, color: c3, lineHeight: 0.65, opacity: 0.12 }}>a</div>

          {/* Footer — mismo formato que Ilustraciones / Papeleria */}
          <div className="absolute bottom-0 left-0 right-0 z-[100] flex items-center justify-center" style={{ height: '3.5%', background: c1 }}>
            <div className="flex items-center gap-1.5">
              <div className="rounded-full" style={{ width: 4, height: 4, background: c4 }} />
              <span className="font-serif text-xs tracking-[0.35em] lowercase" style={{ ...FONT_SERIF, color: c5 }}>aura</span>
              <div className="rounded-full" style={{ width: 4, height: 4, background: c4 }} />
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}

export const Packaging = memo(PackagingInner);
