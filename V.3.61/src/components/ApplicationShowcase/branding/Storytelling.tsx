/**
 * Storytelling poster — Aura brand: Hero, Six Moments, Five Senses, Emotional Arc, Quote.
 * Uses poster palette (primary, accent, surface, etc.) for all visuals and text.
 */
import { memo, useMemo } from 'react';
import type { PosterPalette } from '../types';
import {
  POSTER_BASE_WIDTH,
  POSTER_HEIGHT,
  POSTER_SCALE,
  BRANDING_GRAIN_URL,
  BRANDING_KRAFT_URL,
} from '../constants';
import { FONT_SANS, FONT_SERIF, FONT_CURSIVE, FONT_MONO, AURA_LOWERCASE } from './brandingFonts';

const px = (p: number) => (p / 100) * POSTER_BASE_WIDTH;
const py = (p: number) => (p / 100) * POSTER_HEIGHT;

const SECTION_MARGIN = { left: px(5), right: px(5) };

const CORNERS = [
  { pos: 'tl' as const, top: 1.5, left: 2 },
  { pos: 'tr' as const, top: 1.5, right: 2 },
  { pos: 'bl' as const, bottom: 5, left: 2 },
  { pos: 'br' as const, bottom: 5, right: 2 },
];

const LAYOUT = {
  headerHeight: 8,
  heroTop: 12.5,
  heroHeight: 16,
  storyTop: 29,
  sensesTop: 69,
  emoTop: 50,
  quoteTop: 89,
  dividerTops: [28, 45, 68, 89] as const,
  footerHeight: 3.5,
} as const;

const VIGNETTES = [
  { num: '01', title: 'the seed', sub: 'hand-picked at dawn' },
  { num: '02', title: 'the roast', sub: 'slow fire, deep character' },
  { num: '03', title: 'the pour', sub: 'patience becomes flavor' },
  { num: '04', title: 'the moment', sub: 'warmth between palms' },
  { num: '05', title: 'the bond', sub: 'stories shared slowly' },
  { num: '06', title: 'the stillness', sub: 'rain, pages, silence' },
] as const;

const SENSES = [
  { id: 'aroma', label: 'aroma', sub: 'earthy, warm' },
  { id: 'touch', label: 'touch', sub: 'ceramic heat' },
  { id: 'sound', label: 'sound', sub: 'the quiet drip' },
  { id: 'taste', label: 'taste', sub: 'origin notes' },
  { id: 'sight', label: 'sight', sub: 'latte art bloom' },
] as const;

interface Props {
  posterColors: PosterPalette;
  sceneOnly?: boolean;
}

function StorytellingInner({ posterColors, sceneOnly }: Props) {
  const c = posterColors;
  const c1 = c.primary;
  const c2 = c.accent;
  const cA2 = c.accent2 ?? c2; // Acento 2 para mejor contraste en caption del Hero
  const c3 = c.surface;
  const c4 = c.secondary;
  const c5 = c.background;
  const c6 = c.muted;

  const secHeaderStyle = useMemo(() => ({ ...FONT_MONO, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: c6, opacity: 0.92 }), [c6]);
  const grainStyle = useMemo(() => ({ backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '80px' as const }), []);

  const vignetteBackgrounds = useMemo(
    () => [
      `linear-gradient(170deg, ${c1} 0%, ${c4} 35%, ${c4} 65%, ${c1} 100%)`,
      `linear-gradient(170deg, ${c5}E6 0%, ${c5}B3 35%, ${c5}B3 65%, ${c5}E6 100%)`,
      `linear-gradient(170deg, ${c5}E6 0%, ${c5}B3 35%, ${c5}B3 65%, ${c5}E6 100%)`,
      `linear-gradient(170deg, ${c1} 0%, ${c1} 35%, ${c4} 65%, ${c1} 100%)`,
      `linear-gradient(170deg, ${c5}E6 0%, ${c5}B3 35%, ${c5}B3 65%, ${c5}E6 100%)`,
      `linear-gradient(170deg, ${c1} 0%, ${c1} 35%, ${c4} 65%, ${c1} 100%)`,
    ],
    [c1, c4, c5]
  );
  /** Banner, pie, texturas de hoja, líneas divisorias, marca de agua y bloque de cita junto al pie (manifesto). */
  const posterChrome = !sceneOnly;
  const sceneTop = (pct: number) => py(posterChrome ? pct : pct - LAYOUT.headerHeight);

  return (
    <div className="flex items-center justify-center w-full h-full min-h-0" role="img" aria-label="Brand Storytelling — Aura">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div
          className={posterChrome ? 'relative overflow-hidden shadow-2xl rounded' : 'relative overflow-hidden'}
          style={{ width: POSTER_BASE_WIDTH, height: POSTER_HEIGHT, background: posterChrome ? c5 : 'transparent', ...FONT_SANS }}
        >
          {posterChrome && (
            <>
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 300, opacity: 0.18, mixBlendMode: 'multiply', backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '128px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.03, backgroundImage: `url("${BRANDING_KRAFT_URL}")`, backgroundSize: '200px' }} />
          {LAYOUT.dividerTops.map((top) => (
            <div key={top} className="absolute left-[5%] right-[5%] h-px pointer-events-none" style={{ top: `${top}%`, background: `linear-gradient(90deg, transparent, ${c3} 20%, ${c3} 80%, transparent)`, opacity: 0.28, zIndex: 3 }} />
          ))}

          {/* Cabecera — mismo formato que Ilustraciones / Packaging / Papeleria */}
          <div className="absolute top-0 left-0 right-0 z-[1]" style={{ height: `${LAYOUT.headerHeight}%`, background: c1 }}>
            <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: `linear-gradient(90deg, ${cA2}, ${c4}, ${cA2})`, opacity: 0.5 }} />
          </div>
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

          {/* Corners */}
          {CORNERS.map(({ pos, ...pct }) => {
            const place: Record<string, number> = {};
            if ('top' in pct && pct.top != null) place.top = py(pct.top);
            if ('bottom' in pct && pct.bottom != null) place.bottom = py(pct.bottom);
            if ('left' in pct && pct.left != null) place.left = px(pct.left);
            if ('right' in pct && pct.right != null) place.right = px(pct.right);
            return (
              <div key={pos} className="absolute z-[60] opacity-[0.22]" style={{ width: 14, height: 14, ...place }}>
                <div className="absolute top-0 left-0 w-full h-px" style={{ background: c6 }} />
                <div className="absolute top-0 left-0 w-px h-full" style={{ background: c6 }} />
              </div>
            );
          })}
          </>
          )}

          {/* Hero — Dawn at the farm (referencia: cielo, sol, montañas, colinas, niebla, árboles, pájaros) */}
          <div
            className="absolute z-[20] rounded-md overflow-hidden"
            style={{
              top: sceneTop(LAYOUT.heroTop),
              ...SECTION_MARGIN,
              height: py(LAYOUT.heroHeight),
            }}
          >
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c1} 0%, ${c1} 25%, ${c4} 50%, ${c4} 60%, ${cA2} 75%, ${c5} 92%, ${cA2} 100%)` }} />
            {/* Montañas — triángulos más grandes y visibles (c1 para contraste con cielo) */}
            <div className="absolute bottom-[18%] left-0 w-0 h-0 pointer-events-none" style={{ borderLeft: '110px solid transparent', borderRight: '110px solid transparent', borderBottom: `72px solid ${c1}`, opacity: 0.82 }} />
            <div className="absolute bottom-[18%] left-[18%] w-0 h-0 pointer-events-none" style={{ borderLeft: '90px solid transparent', borderRight: '90px solid transparent', borderBottom: '56px solid ' + c1, opacity: 0.7 }} />
            <div className="absolute bottom-[18%] right-0 w-0 h-0 pointer-events-none" style={{ borderLeft: '120px solid transparent', borderRight: '120px solid transparent', borderBottom: '68px solid ' + c1, opacity: 0.78 }} />
            {/* Sol + anillo — más grande, a la derecha, más visible */}
            <div className="absolute bottom-[18%] left-[44%] w-20 h-20 rounded-full pointer-events-none" style={{ border: `2px solid ${cA2}`, opacity: 0.3 }} />
            <div className="absolute bottom-[18%] left-[46%] w-16 h-16 rounded-full" style={{ background: `radial-gradient(circle at 50% 50%, ${c5}, ${cA2})`, opacity: 0.62, boxShadow: `0 0 52px ${cA2}55, 0 0 28px ${cA2}45` }} />
            <div className="absolute bottom-[15%] left-0 right-0 h-[20%] pointer-events-none" style={{ background: `linear-gradient(180deg, transparent, ${cA2}08)` }} />
            <div className="absolute bottom-[12%] left-0 right-0 h-[12%] pointer-events-none" style={{ background: `linear-gradient(180deg, transparent, ${c4})`, opacity: 0.22 }} />
            {/* Colinas café */}
            <div className="absolute bottom-[8%] left-[-5%] right-[-5%] h-[14%] rounded-t-[100%] pointer-events-none" style={{ background: c1, opacity: 0.35 }} />
            <div className="absolute bottom-[10%] left-0 right-0 h-[10%] rounded-t-[100%] pointer-events-none" style={{ background: c4, opacity: 0.22 }} />
            {/* Filas plantas */}
            <div className="absolute bottom-[10%] left-0 right-0 h-px pointer-events-none" style={{ background: `repeating-linear-gradient(90deg, ${c4}, ${c4} 2px, transparent 2px, transparent 6px)`, opacity: 0.12 }} />
            <div className="absolute bottom-[14%] left-0 right-0 h-px pointer-events-none" style={{ background: `repeating-linear-gradient(90deg, ${c4}, ${c4} 1px, transparent 1px, transparent 5px)`, opacity: 0.1 }} />
            {/* Suelo */}
            <div className="absolute bottom-0 left-0 right-0 h-[10%]" style={{ background: `linear-gradient(180deg, ${c4}, ${c1})` }} />
            {/* Niebla */}
            <div className="absolute bottom-[12%] left-[10%] w-[28%] h-[8%] rounded-full pointer-events-none" style={{ background: c5, opacity: 0.02, filter: 'blur(6px)' }} />
            <div className="absolute bottom-[16%] right-[15%] w-[22%] h-[6%] rounded-full pointer-events-none" style={{ background: c5, opacity: 0.015, filter: 'blur(5px)' }} />
            {/* Árboles silueta */}
            <div className="absolute bottom-[10%] left-[5%] flex flex-col items-center pointer-events-none">
              <div className="rounded-full" style={{ width: 12, height: 14, background: c1, opacity: 0.24 }} />
              <div className="w-0.5 mt-0.5" style={{ height: 6, background: c1, opacity: 0.2 }} />
            </div>
            <div className="absolute bottom-[10%] right-[8%] flex flex-col items-center pointer-events-none">
              <div className="rounded-full" style={{ width: 10, height: 12, background: c1, opacity: 0.24 }} />
              <div className="w-0.5 mt-0.5" style={{ height: 5, background: c1, opacity: 0.2 }} />
            </div>
            {/* Pájaros */}
            <div className="absolute top-[12%] left-[25%] pointer-events-none opacity-[0.16]">
              <svg viewBox="0 0 14 6" className="w-3 h-1.5"><path d="M0 4 Q3 0 7 3 Q11 0 14 4" fill="none" stroke={c5} strokeWidth="0.6" /></svg>
            </div>
            <div className="absolute top-[8%] left-[32%] pointer-events-none opacity-[0.14]">
              <svg viewBox="0 0 10 5" className="w-2.5 h-1"><path d="M0 3 Q2.5 0 5 2.5 Q7.5 0 10 3" fill="none" stroke={c5} strokeWidth="0.5" /></svg>
            </div>
            {/* Caption derecha — where it begins / the first light (más grande) */}
            <div className="absolute bottom-[18%] right-[6%] z-[5] text-right">
              <div style={{ ...FONT_SERIF, fontSize: 30, color: c5, letterSpacing: '0.12em', textTransform: 'lowercase', lineHeight: 0.9, opacity: 0.95 }}>
                where it<br /><em style={{ fontStyle: 'italic', color: cA2, opacity: 1 }}>begins</em>
              </div>
              <div style={{ ...FONT_CURSIVE, fontSize: 18, color: cA2, opacity: 0.95 }}>the first light</div>
            </div>
            <div className="absolute bottom-1 left-2 flex items-center gap-1 z-[10]">
              <div className="w-1 h-1 rounded-full" style={{ background: cA2, opacity: 0.65 }} />
              <span style={{ ...FONT_MONO, fontSize: 6, letterSpacing: '0.12em', textTransform: 'uppercase', color: c5, opacity: 0.7 }}>Chapter I — The Origin</span>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay" style={grainStyle} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 35% 70%, transparent 30%, ${c1}59 100%)` }} />
          </div>

          {/* Storyboard — 6 vignettes con ilustraciones por momento */}
          <div className="absolute z-[20]" style={{ top: sceneTop(LAYOUT.storyTop), ...SECTION_MARGIN }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={secHeaderStyle}>The Journey — Six Moments</span>
            </div>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
              {VIGNETTES.map((v, i) => (
                <div key={v.num} className="rounded-lg overflow-hidden relative" style={{ aspectRatio: 0.58, background: vignetteBackgrounds[i], boxShadow: `0 3px 12px ${c1}20` }}>
                  {/* Ilustración por viñeta — Six Moments Single Row reference */}
                  {i === 0 && (
                    <>
                      <svg className="absolute top-0 left-[10%] w-[80%] h-[45%] z-[1]" style={{ opacity: 0.16 }} viewBox="0 0 100 60" preserveAspectRatio="none">
                        <polygon points="40,0 0,60 20,60" fill={c5} /><polygon points="50,0 25,60 45,60" fill={c5} /><polygon points="60,0 50,60 70,60" fill={c5} /><polygon points="70,0 75,60 95,60" fill={c5} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center z-[2]" style={{ padding: '15% 10% 30% 10%' }}>
                        <svg className="w-full h-full" viewBox="0 0 80 120" style={{ overflow: 'visible' }}>
                          <path d="M-5 30 Q15 28 30 32 Q45 36 60 33 Q70 31 85 34" fill="none" stroke={c1} strokeWidth="2.2" opacity="0.62" strokeLinecap="round" />
                          <g transform="translate(18,18) rotate(-25)">
                            <ellipse cx="0" cy="0" rx="14" ry="6.5" fill={c1} opacity="0.35" />
                            <ellipse cx="0" cy="0" rx="14" ry="6.5" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.48" />
                            <line x1="-12" y1="0" x2="12" y2="0" stroke={c1} strokeWidth="0.4" opacity="0.35" />
                            <line x1="-6" y1="-3" x2="-4" y2="0" stroke={c1} strokeWidth="0.3" opacity="0.26" /><line x1="0" y1="-4" x2="1" y2="0" stroke={c1} strokeWidth="0.3" opacity="0.26" /><line x1="6" y1="-3" x2="5" y2="0" stroke={c1} strokeWidth="0.3" opacity="0.26" />
                            <line x1="-6" y1="3" x2="-4" y2="0" stroke={c1} strokeWidth="0.3" opacity="0.26" /><line x1="0" y1="4" x2="1" y2="0" stroke={c1} strokeWidth="0.3" opacity="0.26" /><line x1="6" y1="3" x2="5" y2="0" stroke={c1} strokeWidth="0.3" opacity="0.26" />
                          </g>
                          <g transform="translate(52,24) rotate(20)">
                            <ellipse cx="0" cy="0" rx="13" ry="6" fill={c1} opacity="0.32" />
                            <ellipse cx="0" cy="0" rx="13" ry="6" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.42" />
                            <line x1="-11" y1="0" x2="11" y2="0" stroke={c1} strokeWidth="0.4" opacity="0.32" />
                            <line x1="-5" y1="-2.5" x2="-3" y2="0" stroke={c1} strokeWidth="0.3" opacity="0.22" /><line x1="3" y1="-3" x2="2" y2="0" stroke={c1} strokeWidth="0.3" opacity="0.22" />
                            <line x1="-5" y1="2.5" x2="-3" y2="0" stroke={c1} strokeWidth="0.3" opacity="0.22" /><line x1="3" y1="3" x2="2" y2="0" stroke={c1} strokeWidth="0.3" opacity="0.22" />
                          </g>
                          <g transform="translate(38,42) rotate(15)">
                            <ellipse cx="0" cy="0" rx="11" ry="5" fill={c1} opacity="0.28" />
                            <line x1="-9" y1="0" x2="9" y2="0" stroke={c1} strokeWidth="0.3" opacity="0.28" />
                          </g>
                          <g transform="translate(30,42)">
                            <line x1="0" y1="-6" x2="2" y2="-12" stroke={c4} strokeWidth="1.2" opacity="0.55" />
                            <ellipse cx="0" cy="0" rx="7" ry="8.5" fill={cA2} opacity="0.62" />
                            <ellipse cx="0" cy="0" rx="7" ry="8.5" fill="none" stroke={c6} strokeWidth="0.5" opacity="0.35" />
                            <ellipse cx="-2" cy="-2" rx="2.5" ry="3.5" fill={cA2} opacity="0.28" />
                            <line x1="0" y1="-6" x2="0" y2="6" stroke={c6} strokeWidth="0.4" opacity="0.28" />
                          </g>
                          <g transform="translate(48,40)">
                            <line x1="0" y1="-5" x2="-1" y2="-11" stroke={c4} strokeWidth="1" opacity="0.5" />
                            <ellipse cx="0" cy="0" rx="6.5" ry="8" fill={cA2} opacity="0.55" />
                            <ellipse cx="0" cy="0" rx="6.5" ry="8" fill="none" stroke={c6} strokeWidth="0.4" opacity="0.32" />
                            <ellipse cx="-1.5" cy="-1.5" rx="2" ry="3" fill={cA2} opacity="0.22" />
                            <line x1="0" y1="-5.5" x2="0" y2="5.5" stroke={c6} strokeWidth="0.3" opacity="0.22" />
                          </g>
                          <g transform="translate(38,54)">
                            <line x1="0" y1="-5" x2="1" y2="-10" stroke={c4} strokeWidth="0.8" opacity="0.42" />
                            <ellipse cx="0" cy="0" rx="5" ry="6" fill={c4} opacity="0.42" />
                            <ellipse cx="0" cy="0" rx="5" ry="6" fill="none" stroke={c4} strokeWidth="0.3" opacity="0.28" />
                          </g>
                          <g opacity="0.28">
                            <path d="M15 72 Q10 80 12 90 Q14 98 25 102 Q40 106 55 102 Q66 98 68 90 Q70 82 65 72" fill="none" stroke={c3} strokeWidth="2" strokeLinecap="round" />
                            <path d="M15 72 Q12 64 14 58 Q16 52 20 54 Q24 56 23 64 L22 72" fill="none" stroke={c3} strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M23 68 Q22 58 24 52 Q26 46 30 48 Q34 50 32 58 L30 68" fill="none" stroke={c3} strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M32 66 Q32 56 34 50 Q36 44 40 46 Q44 48 42 56 L40 66" fill="none" stroke={c3} strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M42 67 Q42 58 44 52 Q46 46 50 48 Q54 50 52 58 L50 67" fill="none" stroke={c3} strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M65 72 Q68 66 70 60 Q72 54 68 52 Q64 50 62 56 Q60 62 60 70" fill="none" stroke={c3} strokeWidth="1.5" strokeLinecap="round" />
                          </g>
                          <circle cx="12" cy="15" r="1" fill={c5} opacity="0.14" /><circle cx="68" cy="12" r="0.8" fill={cA2} opacity="0.12" /><circle cx="72" cy="55" r="1.2" fill={c5} opacity="0.11" /><circle cx="8" cy="65" r="0.7" fill={cA2} opacity="0.1" /><circle cx="55" cy="8" r="0.9" fill={c5} opacity="0.12" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 40%, transparent 35%, ${c1}4D 100%)` }} />
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <div className="absolute bottom-0 left-0 right-0 h-[45%] z-[1]" style={{ background: `radial-gradient(ellipse at 50% 100%, ${c1}48, transparent 70%)` }} />
                      <div className="absolute inset-0 flex items-center justify-center z-[2]" style={{ padding: '15% 10% 30% 10%' }}>
                        <svg className="w-full h-full" viewBox="0 0 80 120" style={{ overflow: 'visible' }}>
                          <path d="M25 25 Q26 18 30 14 Q34 10 30 4 Q28 1 30 -3" fill="none" stroke={c6} strokeWidth="0.8" opacity="0.28" strokeLinecap="round" />
                          <path d="M40 22 Q38 16 42 12 Q46 8 42 2 Q40 -1 42 -5" fill="none" stroke={c6} strokeWidth="0.7" opacity="0.24" strokeLinecap="round" />
                          <path d="M55 25 Q53 19 57 15 Q61 11 57 5 Q55 2 57 -2" fill="none" stroke={c6} strokeWidth="0.6" opacity="0.2" strokeLinecap="round" />
                          <rect x="8" y="30" width="64" height="38" rx="5" fill="none" stroke={c1} strokeWidth="1.8" opacity="0.65" />
                          <line x1="12" y1="32" x2="12" y2="66" stroke={c1} strokeWidth="0.3" opacity="0.35" />
                          <line x1="68" y1="32" x2="68" y2="66" stroke={c1} strokeWidth="0.3" opacity="0.35" />
                          <circle cx="40" cy="49" r="12" fill="none" stroke={c1} strokeWidth="1.4" opacity="0.6" />
                          <circle cx="40" cy="49" r="8" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.46" />
                          <g opacity="0.38">
                            <ellipse cx="35" cy="46" rx="3.5" ry="2.5" fill={c6} transform="rotate(20 35 46)" />
                            <line x1="35" y1="44" x2="35" y2="48" stroke={c6} strokeWidth="0.4" />
                            <ellipse cx="44" cy="52" rx="3" ry="2.2" fill={c6} transform="rotate(-15 44 52)" />
                            <line x1="44" y1="50.2" x2="44" y2="53.8" stroke={c6} strokeWidth="0.4" />
                            <ellipse cx="38" cy="54" rx="2.8" ry="2" fill={c6} transform="rotate(35 38 54)" />
                            <ellipse cx="46" cy="46" rx="2.5" ry="1.8" fill={c6} transform="rotate(-25 46 46)" />
                            <ellipse cx="40" cy="42" rx="2" ry="1.5" fill={c6} transform="rotate(10 40 42)" />
                          </g>
                          <line x1="72" y1="49" x2="82" y2="49" stroke={c1} strokeWidth="1.8" opacity="0.6" strokeLinecap="round" />
                          <circle cx="82" cy="49" r="2.5" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.52" />
                          <line x1="18" y1="68" x2="15" y2="78" stroke={c1} strokeWidth="1.2" opacity="0.52" strokeLinecap="round" />
                          <line x1="62" y1="68" x2="65" y2="78" stroke={c1} strokeWidth="1.2" opacity="0.52" strokeLinecap="round" />
                          <line x1="13" y1="78" x2="19" y2="78" stroke={c1} strokeWidth="1" opacity="0.44" />
                          <line x1="63" y1="78" x2="69" y2="78" stroke={c1} strokeWidth="1" opacity="0.44" />
                          <g opacity="0.5">
                            <path d="M18 85 Q20 78 24 76 Q28 74 26 68" fill="none" stroke={c1} strokeWidth="1" strokeLinecap="round" />
                            <path d="M28 85 Q30 79 33 77 Q36 75 34 70" fill="none" stroke={c1} strokeWidth="0.9" strokeLinecap="round" />
                            <path d="M38 85 Q40 77 43 75 Q46 73 44 67" fill="none" stroke={c1} strokeWidth="1.1" strokeLinecap="round" />
                            <path d="M48 85 Q50 79 53 77 Q56 75 54 69" fill="none" stroke={c1} strokeWidth="0.9" strokeLinecap="round" />
                            <path d="M58 85 Q60 78 62 76 Q64 74 62 70" fill="none" stroke={c1} strokeWidth="0.8" strokeLinecap="round" />
                          </g>
                          <circle cx="22" cy="70" r="1.2" fill={c1} opacity="0.48" /><circle cx="50" cy="66" r="0.9" fill={c1} opacity="0.44" /><circle cx="35" cy="64" r="1" fill={c1} opacity="0.42" />
                          <g transform="translate(2,28)">
                            <rect x="0" y="0" width="4" height="28" rx="2" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.52" />
                            <rect x="0.8" y="10" width="2.4" height="17" rx="1.2" fill={c1} opacity="0.48" />
                            <circle cx="2" cy="31" r="3" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.48" />
                            <circle cx="2" cy="31" r="1.8" fill={c1} opacity="0.54" />
                          </g>
                          <g opacity="0.38">
                            <ellipse cx="12" cy="95" rx="3" ry="2" fill="none" stroke={c1} strokeWidth="0.5" transform="rotate(25 12 95)" />
                            <line x1="12" y1="93.5" x2="12" y2="96.5" stroke={c1} strokeWidth="0.3" />
                            <ellipse cx="68" cy="92" rx="2.5" ry="1.8" fill="none" stroke={c1} strokeWidth="0.4" transform="rotate(-30 68 92)" />
                            <line x1="68" y1="90.6" x2="68" y2="93.4" stroke={c1} strokeWidth="0.3" />
                          </g>
                        </svg>
                      </div>
                      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 25%, ${c1}59 100%)` }} />
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <div className="absolute top-0 left-[10%] w-[30%] h-[55%] z-[1]" style={{ background: `linear-gradient(180deg, ${cA2}08, transparent)`, clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0 100%)' }} />
                      <div className="absolute inset-0 flex items-center justify-center z-[2]" style={{ padding: '15% 10% 30% 10%' }}>
                        <svg className="w-full h-full" viewBox="0 0 80 120" style={{ overflow: 'visible' }}>
                          <g>
                            <ellipse cx="58" cy="18" rx="18" ry="12" fill="none" stroke={c4} strokeWidth="1.5" opacity="0.5" />
                            <path d="M44 10 Q58 5 72 10" fill="none" stroke={c4} strokeWidth="1.2" opacity="0.42" strokeLinecap="round" />
                            <line x1="58" y1="5" x2="58" y2="8" stroke={c4} strokeWidth="1" opacity="0.36" strokeLinecap="round" />
                            <circle cx="58" cy="4" r="1.5" fill="none" stroke={c4} strokeWidth="0.8" opacity="0.32" />
                            <path d="M40 18 Q30 16 22 12 Q16 8 12 4 Q8 0 5 -2" fill="none" stroke={c4} strokeWidth="1.8" opacity="0.5" strokeLinecap="round" />
                            <path d="M72 10 Q80 12 80 18 Q80 24 72 26" fill="none" stroke={c4} strokeWidth="1.3" opacity="0.4" strokeLinecap="round" />
                          </g>
                          <line x1="6" y1="2" x2="8" y2="42" stroke={c4} strokeWidth="1.2" opacity="0.32" />
                          <line x1="8" y1="42" x2="9" y2="48" stroke={c4} strokeWidth="0.8" opacity="0.22" strokeDasharray="1.5,2" />
                          <circle cx="9" cy="51" r="1.2" fill={c4} opacity="0.2" /><circle cx="9.5" cy="55" r="0.8" fill={c4} opacity="0.16" />
                          <g transform="translate(40,58)">
                            <path d="M-28 -8 L-22 18 Q0 24 22 18 L28 -8" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.42" />
                            <ellipse cx="0" cy="-8" rx="28" ry="4.5" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.36" />
                            <path d="M-22 -4 Q-18 0 -16 6 Q-14 12 -12 16" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.2" />
                            <path d="M-10 -6 Q-8 0 -6 8 Q-4 14 -3 18" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.18" />
                            <path d="M4 -7 Q5 0 6 8 Q7 14 8 18" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.2" />
                            <path d="M16 -5 Q15 2 14 10 Q13 16 12 19" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.18" />
                            <ellipse cx="0" cy="0" rx="16" ry="3" fill={c4} opacity="0.16" />
                            <circle cx="0" cy="20" r="2" fill={c6} opacity="0.22" />
                            <line x1="0" y1="22" x2="0" y2="28" stroke={c6} strokeWidth="0.6" opacity="0.2" />
                            <circle cx="0" cy="30" r="1" fill={c6} opacity="0.16" />
                          </g>
                          <g transform="translate(40,96)">
                            <path d="M-22 -6 L-18 10 Q0 16 18 10 L22 -6" fill="none" stroke={c6} strokeWidth="1.2" opacity="0.35" />
                            <path d="M-18 4 Q0 8 18 4 L18 10 Q0 16 -18 10 Z" fill={c6} opacity="0.16" />
                            <path d="M22 -4 Q30 -2 30 4 Q30 10 22 12" fill="none" stroke={c6} strokeWidth="1" opacity="0.28" strokeLinecap="round" />
                            <line x1="-20" y1="12" x2="20" y2="12" stroke={c6} strokeWidth="0.6" opacity="0.2" />
                          </g>
                          <circle cx="8" cy="44" r="3" fill="none" stroke={c4} strokeWidth="0.3" opacity="0.06" />
                          <circle cx="8" cy="44" r="6" fill="none" stroke={c4} strokeWidth="0.2" opacity="0.04" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: `radial-gradient(ellipse at 40% 45%, transparent 35%, ${c1}1A 100%)` }} />
                    </>
                  )}
                  {i === 3 && (
                    <>
                      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-[20%] w-[80%] aspect-square rounded-full z-[1]" style={{ background: `radial-gradient(circle, ${cA2}18, transparent 55%)` }} />
                      <div className="absolute inset-0 flex items-center justify-center z-[2]" style={{ padding: '15% 10% 30% 10%' }}>
                        <svg className="w-full h-full" viewBox="0 0 80 120" style={{ overflow: 'visible' }}>
                          <path d="M28 32 Q30 24 34 20 Q38 16 34 8 Q32 4 34 -2" fill="none" stroke={c4} strokeWidth="0.8" opacity="0.28" strokeLinecap="round" />
                          <path d="M38 30 Q36 23 40 18 Q44 13 40 6 Q38 2 40 -4" fill="none" stroke={c4} strokeWidth="0.7" opacity="0.24" strokeLinecap="round" />
                          <path d="M48 32 Q46 25 50 20 Q54 15 50 8 Q48 4 50 -1" fill="none" stroke={c4} strokeWidth="0.6" opacity="0.2" strokeLinecap="round" />
                          <g transform="translate(40,52)">
                            <path d="M-20 -12 L-16 16 Q0 22 16 16 L20 -12" fill="none" stroke={c5} strokeWidth="1.8" opacity="0.5" />
                            <ellipse cx="0" cy="-12" rx="20" ry="4" fill="none" stroke={c5} strokeWidth="1.4" opacity="0.44" />
                            <ellipse cx="0" cy="-8" rx="16" ry="3" fill={c6} opacity="0.36" />
                            <g opacity="0.38">
                              <line x1="0" y1="-12" x2="0" y2="-3" stroke={c3} strokeWidth="0.5" />
                              <path d="M0 -11 Q-5 -10 -8 -8 Q-5 -9 0 -10" fill={c3} />
                              <path d="M0 -11 Q5 -10 8 -8 Q5 -9 0 -10" fill={c3} />
                              <path d="M0 -9 Q-6 -8 -10 -6 Q-6 -7 0 -8" fill={c3} />
                              <path d="M0 -9 Q6 -8 10 -6 Q6 -7 0 -8" fill={c3} />
                              <path d="M0 -7 Q-5 -6 -7 -4 Q-5 -5 0 -6" fill={c3} />
                              <path d="M0 -7 Q5 -6 7 -4 Q5 -5 0 -6" fill={c3} />
                              <circle cx="0" cy="-3" r="1.5" fill={c3} />
                            </g>
                            <text x="0" y="6" textAnchor="middle" fontFamily="Libre Baskerville, serif" fontSize="4.5" fill={cA2} opacity="0.38" letterSpacing="0.12em">aura</text>
                            <path d="M16 -8 Q26 -6 26 2 Q26 10 16 12" fill="none" stroke={c5} strokeWidth="1.3" opacity="0.38" strokeLinecap="round" />
                            <ellipse cx="0" cy="18" rx="24" ry="3.5" fill="none" stroke={c5} strokeWidth="0.8" opacity="0.24" />
                          </g>
                          <g opacity="0.22">
                            <path d="M5 48 Q2 42 4 36 Q6 30 12 28 Q18 26 22 32 Q24 36 24 42 L22 52 Q14 56 6 52 Z" fill="none" stroke={c3} strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M12 28 L10 22" fill="none" stroke={c3} strokeWidth="1" strokeLinecap="round" />
                            <path d="M16 27 L15 20" fill="none" stroke={c3} strokeWidth="1" strokeLinecap="round" />
                            <path d="M75 48 Q78 42 76 36 Q74 30 68 28 Q62 26 58 32 Q56 36 56 42 L58 52 Q66 56 74 52 Z" fill="none" stroke={c3} strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M68 28 L70 22" fill="none" stroke={c3} strokeWidth="1" strokeLinecap="round" />
                            <path d="M64 27 L65 20" fill="none" stroke={c3} strokeWidth="1" strokeLinecap="round" />
                          </g>
                          <ellipse cx="40" cy="74" rx="22" ry="2.5" fill={c1} opacity="0.08" style={{ filter: 'url(#blur-moment)' }} />
                          <defs><filter id="blur-moment"><feGaussianBlur stdDeviation="2" /></filter></defs>
                        </svg>
                      </div>
                      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 22%, ${c1}66 100%)` }} />
                    </>
                  )}
                  {i === 4 && (
                    <>
                      <div className="absolute top-0 left-[5%] w-[25%] h-[50%] z-[1]" style={{ background: `linear-gradient(180deg, ${cA2}12, transparent)`, clipPath: 'polygon(15% 0, 85% 0, 110% 100%, -10% 100%)' }} />
                      <div className="absolute inset-0 flex items-center justify-center z-[2]" style={{ padding: '15% 10% 30% 10%' }}>
                        <svg className="w-full h-full" viewBox="0 0 80 120" style={{ overflow: 'visible' }}>
                          <g opacity="0.32">
                            <rect x="2" y="2" width="28" height="36" rx="1" fill="none" stroke={c6} strokeWidth="1" />
                            <line x1="16" y1="2" x2="16" y2="38" stroke={c6} strokeWidth="0.5" />
                            <line x1="2" y1="20" x2="30" y2="20" stroke={c6} strokeWidth="0.5" />
                            <rect x="3" y="3" width="12.5" height="16.5" fill={cA2} opacity="0.35" />
                            <rect x="16.5" y="3" width="13" height="16.5" fill={cA2} opacity="0.28" />
                          </g>
                          <g transform="translate(70,8)" opacity="0.32">
                            <line x1="0" y1="30" x2="0" y2="12" stroke={c4} strokeWidth="1" strokeLinecap="round" />
                            <ellipse cx="-4" cy="10" rx="5" ry="2.5" fill={c4} transform="rotate(-25 -4 10)" />
                            <ellipse cx="5" cy="6" rx="5.5" ry="2.5" fill={c4} transform="rotate(20 5 6)" />
                            <ellipse cx="-2" cy="3" rx="4" ry="2" fill={c4} transform="rotate(-15 -2 3)" />
                            <rect x="-3" y="28" width="6" height="4" rx="1" fill={c6} />
                          </g>
                          <line x1="0" y1="62" x2="80" y2="62" stroke={c6} strokeWidth="1" opacity="0.24" />
                          <rect x="0" y="62" width="80" height="58" fill={c6} opacity="0.08" />
                          <g transform="translate(24,56)">
                            <ellipse cx="0" cy="14" rx="16" ry="2.5" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.26" />
                            <path d="M-12 -6 L-10 10 Q0 14 10 10 L12 -6" fill="none" stroke={c1} strokeWidth="1.4" opacity="0.48" />
                            <ellipse cx="0" cy="-6" rx="12" ry="3" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" />
                            <ellipse cx="0" cy="-3" rx="9" ry="2" fill={c6} opacity="0.3" />
                            <path d="M10 -3 Q16 -1 16 4 Q16 9 10 11" fill="none" stroke={c1} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
                            <path d="M-3 -10 Q-2 -14 0 -16 Q2 -18 1 -22" fill="none" stroke={c6} strokeWidth="0.4" opacity="0.22" strokeLinecap="round" />
                            <path d="M4 -10 Q5 -14 3 -17" fill="none" stroke={c6} strokeWidth="0.3" opacity="0.18" strokeLinecap="round" />
                          </g>
                          <g transform="translate(58,52) rotate(-4)">
                            <ellipse cx="0" cy="14" rx="13" ry="2" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.22" />
                            <path d="M-10 -5 L-8 9 Q0 13 8 9 L10 -5" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.4" />
                            <ellipse cx="0" cy="-5" rx="10" ry="2.5" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.34" />
                            <ellipse cx="0" cy="-2.5" rx="7" ry="1.5" fill={c4} opacity="0.22" />
                            <path d="M-10 -2 Q-15 0 -15 4 Q-15 8 -10 10" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.26" strokeLinecap="round" />
                          </g>
                          <g opacity="0.24">
                            <line x1="36" y1="72" x2="48" y2="68" stroke={c6} strokeWidth="0.8" strokeLinecap="round" />
                            <ellipse cx="49" cy="67.5" rx="2.5" ry="1.5" fill="none" stroke={c6} strokeWidth="0.5" />
                          </g>
                          <g opacity="0.2">
                            <rect x="40" y="74" width="5" height="4" rx="0.5" fill="none" stroke={c6} strokeWidth="0.6" />
                            <rect x="43" y="72" width="5" height="4" rx="0.5" fill="none" stroke={c6} strokeWidth="0.5" />
                          </g>
                          <rect x="8" y="75" width="12" height="8" rx="1" fill="none" stroke={c6} strokeWidth="0.4" opacity="0.14" />
                          <line x1="8" y1="77" x2="20" y2="77" stroke={c6} strokeWidth="0.2" opacity="0.1" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: `radial-gradient(ellipse at 45% 55%, transparent 35%, ${c1}1A 100%)` }} />
                    </>
                  )}
                  {i === 5 && (
                    <>
                      <div className="absolute top-[4%] right-[4%] w-[38%] h-[45%] z-[1]" style={{ background: `radial-gradient(ellipse at 50% 50%, ${c4}42, transparent 65%)` }} />
                      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[28%] aspect-square rounded-full z-[1]" style={{ background: `radial-gradient(circle, ${cA2}52, transparent 55%)` }} />
                      <div className="absolute inset-0 flex items-center justify-center z-[2]" style={{ padding: '15% 10% 30% 10%' }}>
                        <svg className="w-full h-full" viewBox="0 0 80 120" style={{ overflow: 'visible' }}>
                          <g>
                            <rect x="44" y="4" width="32" height="42" rx="1.5" fill="none" stroke={c4} strokeWidth="1.2" opacity="0.52" />
                            <line x1="60" y1="4" x2="60" y2="46" stroke={c4} strokeWidth="0.5" opacity="0.4" />
                            <line x1="44" y1="25" x2="76" y2="25" stroke={c4} strokeWidth="0.5" opacity="0.4" />
                            <circle cx="68" cy="14" r="3.5" fill={c4} opacity="0.28" />
                            <g opacity="0.38">
                              <line x1="48" y1="6" x2="48" y2="12" stroke={c4} strokeWidth="0.5" />
                              <line x1="54" y1="14" x2="54" y2="19" stroke={c4} strokeWidth="0.4" />
                              <line x1="66" y1="8" x2="66" y2="14" stroke={c4} strokeWidth="0.5" />
                              <line x1="72" y1="18" x2="72" y2="22" stroke={c4} strokeWidth="0.35" />
                              <line x1="50" y1="28" x2="50" y2="34" stroke={c4} strokeWidth="0.5" />
                              <line x1="56" y1="34" x2="56" y2="39" stroke={c4} strokeWidth="0.4" />
                              <line x1="64" y1="30" x2="64" y2="36" stroke={c4} strokeWidth="0.45" />
                              <line x1="74" y1="38" x2="74" y2="42" stroke={c4} strokeWidth="0.35" />
                            </g>
                            <path d="M52 6 Q51 14 53 20" fill="none" stroke={c4} strokeWidth="0.15" opacity="0.26" />
                            <path d="M70 10 Q69 18 71 24" fill="none" stroke={c4} strokeWidth="0.15" opacity="0.26" />
                          </g>
                          <line x1="0" y1="72" x2="80" y2="72" stroke={c6} strokeWidth="0.6" opacity="0.32" />
                          <rect x="0" y="72" width="80" height="48" fill={c6} opacity="0.12" />
                          <g transform="translate(40,52)">
                            <circle cx="0" cy="-8" r="8" fill={cA2} opacity="0.22" />
                            <path d="M0 -14 Q3 -10 3 -6 Q3 -2 0 0 Q-3 -2 -3 -6 Q-3 -10 0 -14Z" fill={cA2} opacity="0.62" />
                            <path d="M0 -12 Q1.5 -9 1.5 -6 Q1.5 -3 0 -1 Q-1.5 -3 -1.5 -6 Q-1.5 -9 0 -12Z" fill={c5} opacity="0.38" />
                            <line x1="0" y1="0" x2="0" y2="3" stroke={c6} strokeWidth="0.6" opacity="0.55" />
                            <rect x="-3" y="3" width="6" height="16" rx="1" fill={c3} opacity="0.42" />
                            <path d="M-3 6 Q-4 8 -3.5 10" fill="none" stroke={c3} strokeWidth="0.3" opacity="0.28" />
                            <ellipse cx="0" cy="19" rx="5" ry="1.5" fill="none" stroke={cA2} strokeWidth="0.5" opacity="0.38" />
                          </g>
                          <g transform="translate(16,68) rotate(-10)">
                            <path d="M-10 -8 L-8 8 Q0 12 8 8 L10 -8" fill="none" stroke={c5} strokeWidth="1.3" opacity="0.6" />
                            <ellipse cx="0" cy="-8" rx="10" ry="2.5" fill="none" stroke={c5} strokeWidth="1" opacity="0.52" />
                            <ellipse cx="0" cy="6" rx="5" ry="1" fill={c6} opacity="0.36" />
                            <ellipse cx="0" cy="-4" rx="6" ry="1.5" fill="none" stroke={c6} strokeWidth="0.3" opacity="0.26" />
                            <path d="M10 -5 Q15 -3 15 2 Q15 7 10 9" fill="none" stroke={c5} strokeWidth="1" opacity="0.44" strokeLinecap="round" />
                          </g>
                          <ellipse cx="16" cy="82" rx="8" ry="1.5" fill="none" stroke={c6} strokeWidth="0.3" opacity="0.24" />
                          <g transform="translate(62,76) rotate(6)">
                            <rect x="-14" y="-10" width="28" height="20" rx="1" fill={c4} opacity="0.5" />
                            <rect x="-14" y="-10" width="3" height="20" rx="0.5" fill={c4} opacity="0.6" />
                            <line x1="-8" y1="-5" x2="8" y2="-5" stroke={c5} strokeWidth="0.5" opacity="0.32" />
                            <line x1="-8" y1="-2" x2="4" y2="-2" stroke={c5} strokeWidth="0.4" opacity="0.26" />
                            <line x1="-8" y1="1" x2="6" y2="1" stroke={c5} strokeWidth="0.4" opacity="0.26" />
                            <rect x="-11" y="10" width="25" height="2" rx="0.5" fill={c5} opacity="0.26" />
                            <line x1="6" y1="-10" x2="4" y2="-15" stroke={cA2} strokeWidth="0.6" opacity="0.42" />
                            <path d="M3 -15 L4 -15 L3.5 -13 Z" fill={cA2} opacity="0.38" />
                          </g>
                          <g transform="translate(32,82)" opacity="0.34">
                            <circle cx="-4" cy="0" r="4" fill="none" stroke={c5} strokeWidth="0.6" />
                            <circle cx="6" cy="0" r="4" fill="none" stroke={c5} strokeWidth="0.6" />
                            <line x1="0" y1="0" x2="2" y2="0" stroke={c5} strokeWidth="0.4" />
                            <line x1="-8" y1="-1" x2="-12" y2="-2" stroke={c5} strokeWidth="0.4" />
                            <line x1="10" y1="-1" x2="14" y2="-2" stroke={c5} strokeWidth="0.4" />
                          </g>
                        </svg>
                      </div>
                      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: `radial-gradient(ellipse at 45% 40%, transparent 25%, ${c1}45 100%)` }} />
                    </>
                  )}
                  <span className="absolute top-[5%] left-[6%] z-[3]" style={{ ...FONT_SERIF, fontSize: 18, color: c5, opacity: 0.62, lineHeight: 0.8 }}>{v.num}</span>
                  <div className="absolute bottom-0 left-0 right-0 z-[10] px-1.5" style={{ paddingTop: 'clamp(14px, 2.4vw, 22px)', paddingBottom: 'clamp(5px, .7vw, 8px)', background: i === 2 || i === 4 ? `linear-gradient(180deg, transparent 0%, ${c1}1F 35%, ${c1}47 100%)` : `linear-gradient(180deg, transparent 0%, ${c1}73 35%, ${c1}A6 100%)` }}>
                    <div style={{ width: 'clamp(12px, 1.5vw, 17px)', height: 1.25, background: cA2, opacity: 0.78, borderRadius: 1, marginBottom: 'clamp(2px, .35vw, 4px)' }} />
                    <div style={{ ...FONT_SERIF, fontSize: 'clamp(6.5px, .95vw, 10px)', color: c5, opacity: 0.95, letterSpacing: '0.05em', textTransform: 'lowercase', lineHeight: 1.15, marginBottom: 1 }}>{v.title}</div>
                    <div style={{ ...FONT_CURSIVE, fontSize: 'clamp(6px, .8vw, 8.5px)', color: cA2, opacity: 0.88, lineHeight: 1.2 }}>{v.sub}</div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={grainStyle} />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 50%, transparent 25%, ${c1}40 100%)` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Sensory Journey — 5 senses con icono por sentido */}
          <div className="absolute z-[20]" style={{ top: sceneTop(LAYOUT.sensesTop), ...SECTION_MARGIN }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={secHeaderStyle}>The Five Senses</span>
            </div>
            <div className="flex gap-1.5">
              {SENSES.map((s) => (
                <div key={s.id} className="flex-1 rounded overflow-hidden relative" style={{ aspectRatio: 0.85, background: c3 }}>
                  <div className="absolute inset-0" style={{ background: `linear-gradient(170deg, ${c3}, ${c3})` }} />
                  {/* Ilustración por sentido — referencia Five Senses */}
                  {s.id === 'aroma' && (
                    <>
                      <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-[70%] aspect-square rounded-full z-[1]" style={{ background: `radial-gradient(circle, ${c2}32, transparent 55%)` }} />
                      <div className="absolute inset-0 flex items-center justify-center z-[2]" style={{ padding: '12% 8% 28% 8%' }}>
                        <svg className="w-full h-full" viewBox="0 0 80 130" style={{ overflow: 'visible' }}>
                          <path d="M22 65 Q24 56 28 50 Q32 44 28 36 Q24 28 28 20 Q32 12 28 4" fill="none" stroke={c2} strokeWidth="1" opacity={0.48} strokeLinecap="round" />
                          <path d="M38 62 Q36 54 40 48 Q44 42 40 34 Q36 26 40 18 Q44 10 40 2" fill="none" stroke={c2} strokeWidth="1.2" opacity={0.52} strokeLinecap="round" />
                          <path d="M54 65 Q52 57 56 51 Q60 45 56 37 Q52 29 56 21 Q60 13 56 6" fill="none" stroke={c2} strokeWidth="0.9" opacity={0.42} strokeLinecap="round" />
                          <path d="M14 68 Q16 60 18 54 Q20 48 16 42 Q12 36 16 28" fill="none" stroke={c2} strokeWidth="0.6" opacity={0.32} strokeLinecap="round" />
                          <path d="M62 68 Q60 61 64 55 Q68 49 64 43 Q60 37 64 30" fill="none" stroke={c2} strokeWidth="0.6" opacity={0.32} strokeLinecap="round" />
                          <circle cx="18" cy="22" r="1.5" fill={c2} opacity={0.3} /><circle cx="48" cy="15" r="1" fill={c2} opacity={0.26} /><circle cx="60" cy="28" r="1.8" fill={c2} opacity={0.28} /><circle cx="32" cy="8" r="1.2" fill={c2} opacity={0.22} /><circle cx="10" cy="38" r="1" fill={c2} opacity={0.2} /><circle cx="68" cy="18" r="0.8" fill={c2} opacity={0.18} />
                          <path d="M26 28 Q30 26 34 28" fill="none" stroke={c2} strokeWidth="0.4" opacity={0.22} />
                          <path d="M44 22 Q48 20 52 22" fill="none" stroke={c2} strokeWidth="0.4" opacity={0.2} />
                          <path d="M20 14 Q24 12 28 14" fill="none" stroke={c2} strokeWidth="0.3" opacity={0.16} />
                          <g transform="translate(40,82)">
                            <path d="M-16 -10 L-13 12 Q0 17 13 12 L16 -10" fill="none" stroke={c2} strokeWidth="1.6" opacity={0.55} />
                            <ellipse cx="0" cy="-10" rx="16" ry="3.5" fill="none" stroke={c2} strokeWidth="1.2" opacity={0.48} />
                            <ellipse cx="0" cy="-7" rx="12" ry="2.5" fill={c2} opacity={0.38} />
                            <path d="M13 -6 Q20 -4 20 2 Q20 8 13 10" fill="none" stroke={c2} strokeWidth="1.2" opacity={0.4} strokeLinecap="round" />
                            <ellipse cx="0" cy="14" rx="20" ry="3" fill="none" stroke={c2} strokeWidth="0.8" opacity={0.34} />
                          </g>
                          <g transform="translate(40,0)" opacity={0.22}>
                            <path d="M-4 10 Q-6 6 -4 2 Q-2 -2 0 -4 Q2 -2 4 2 Q6 6 4 10" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" />
                            <circle cx="-2" cy="8" r="1" fill="none" stroke={c2} strokeWidth="0.6" /><circle cx="2" cy="8" r="1" fill="none" stroke={c2} strokeWidth="0.6" />
                          </g>
                        </svg>
                      </div>
                      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 60%, transparent 30%, rgba(0,0,0,.08) 100%)' }} />
                    </>
                  )}
                  {s.id === 'touch' && (
                    <>
                      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-[40%] w-[85%] aspect-square rounded-full z-[1]" style={{ background: `radial-gradient(circle, ${c2}28, transparent 50%)` }} />
                      <div className="absolute inset-0 flex items-center justify-center z-[2]" style={{ padding: '12% 8% 28% 8%', transform: 'translateY(16%)' }}>
                        <svg className="w-full h-full" viewBox="0 0 80 130" style={{ overflow: 'visible' }}>
                          <circle cx="40" cy="58" r="35" fill="none" stroke={c2} strokeWidth="0.4" opacity={0.14} />
                          <circle cx="40" cy="58" r="28" fill="none" stroke={c2} strokeWidth="0.5" opacity={0.18} />
                          <circle cx="40" cy="58" r="21" fill="none" stroke={c2} strokeWidth="0.6" opacity={0.22} />
                          <circle cx="40" cy="58" r="14" fill="none" stroke={c2} strokeWidth="0.8" opacity={0.28} />
                          <g opacity={0.48}>
                            <path d="M8 52 Q4 44 6 36 Q8 28 16 24 Q22 22 26 28 Q28 32 28 38 L26 50 Q20 58 10 56 Z" fill="none" stroke={c2} strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M16 24 Q14 16 16 12 Q18 8 22 10 Q24 12 24 18 L24 26" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M22 22 Q22 14 24 10 Q26 6 29 8 Q31 10 30 16 L28 24" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M26 24 Q28 16 30 12 Q32 8 35 10 Q37 12 36 18 L34 26" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M8 52 Q4 48 2 42 Q0 36 4 34 Q8 32 10 38 Q12 44 10 50" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M18 30 Q22 28 26 30" fill="none" stroke={c2} strokeWidth="0.4" opacity={0.6} />
                          </g>
                          <g opacity={0.42}>
                            <path d="M72 52 Q76 44 74 36 Q72 28 64 24 Q58 22 54 28 Q52 32 52 38 L54 50 Q60 58 70 56 Z" fill="none" stroke={c2} strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M64 24 Q66 16 64 12 Q62 8 58 10 Q56 12 56 18 L56 26" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M58 22 Q58 14 56 10 Q54 6 51 8 Q49 10 50 16 L52 24" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M54 24 Q52 16 50 12 Q48 8 45 10 Q43 12 44 18 L46 26" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M72 52 Q76 48 78 42 Q80 36 76 34 Q72 32 70 38 Q68 44 70 50" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M62 30 Q58 28 54 30" fill="none" stroke={c2} strokeWidth="0.4" opacity={0.6} />
                          </g>
                          <g transform="translate(40,44)">
                            <path d="M-12 -8 L-10 14 Q0 18 10 14 L12 -8" fill="none" stroke={c2} strokeWidth="1.5" opacity={0.52} />
                            <ellipse cx="0" cy="-8" rx="12" ry="3" fill="none" stroke={c2} strokeWidth="1.2" opacity={0.44} />
                            <ellipse cx="0" cy="-5" rx="8" ry="2" fill={c2} opacity={0.34} />
                            <path d="M-2 -12 Q-1 -16 0 -18" fill="none" stroke={c2} strokeWidth="0.4" opacity={0.28} strokeLinecap="round" />
                            <path d="M3 -12 Q4 -16 3 -19" fill="none" stroke={c2} strokeWidth="0.3" opacity={0.22} strokeLinecap="round" />
                          </g>
                          <g opacity={0.2}>
                            <circle cx="36" cy="40" r="0.5" fill={c2} /><circle cx="42" cy="42" r="0.4" fill={c2} /><circle cx="38" cy="48" r="0.6" fill={c2} /><circle cx="44" cy="46" r="0.3" fill={c2} />
                          </g>
                        </svg>
                      </div>
                      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 48%, transparent 25%, rgba(0,0,0,.06) 100%)' }} />
                    </>
                  )}
                  {s.id === 'sound' && (
                    <>
                      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-[30%] w-[60%] aspect-square rounded-full z-[1]" style={{ background: `radial-gradient(circle, ${c2}28, transparent 55%)` }} />
                      <div className="absolute inset-0 flex items-center justify-center z-[2]" style={{ padding: '12% 8% 28% 8%' }}>
                        <svg className="w-full h-full" viewBox="0 0 80 130" style={{ overflow: 'visible' }}>
                          <circle cx="40" cy="35" r="8" fill="none" stroke={c2} strokeWidth="0.6" opacity={0.36} />
                          <circle cx="40" cy="35" r="15" fill="none" stroke={c2} strokeWidth="0.5" opacity={0.3} />
                          <circle cx="40" cy="35" r="22" fill="none" stroke={c2} strokeWidth="0.4" opacity={0.24} />
                          <circle cx="40" cy="35" r="30" fill="none" stroke={c2} strokeWidth="0.3" opacity={0.18} />
                          <circle cx="40" cy="35" r="38" fill="none" stroke={c2} strokeWidth="0.25" opacity={0.12} />
                          <g transform="translate(32,8)">
                            <path d="M20 6 Q14 4 10 2 Q6 0 4 -2" fill="none" stroke={c2} strokeWidth="1.2" opacity={0.46} strokeLinecap="round" />
                            <ellipse cx="24" cy="8" rx="8" ry="5" fill="none" stroke={c2} strokeWidth="0.8" opacity={0.3} />
                          </g>
                          <g>
                            <path d="M38 14 Q37 12 38 10 Q39 12 38 14Z" fill={c2} opacity={0.48} />
                            <path d="M40 22 Q39 20 40 18 Q41 20 40 22Z" fill={c2} opacity={0.4} />
                            <path d="M39 30 Q38 28 39 26 Q40 28 39 30Z" fill={c2} opacity={0.34} />
                          </g>
                          <g transform="translate(40,38)">
                            <ellipse cx="0" cy="0" rx="4" ry="1.5" fill="none" stroke={c2} strokeWidth="0.6" opacity={0.4} />
                            <ellipse cx="0" cy="0" rx="8" ry="3" fill="none" stroke={c2} strokeWidth="0.4" opacity={0.3} />
                            <ellipse cx="0" cy="0" rx="12" ry="4.5" fill="none" stroke={c2} strokeWidth="0.3" opacity={0.22} />
                            <circle cx="-3" cy="-2" r="0.8" fill={c2} opacity={0.32} /><circle cx="4" cy="-1.5" r="0.6" fill={c2} opacity={0.28} />
                          </g>
                          <g transform="translate(40,60)">
                            <path d="M-18 -6 L-14 14 Q0 18 14 14 L18 -6" fill="none" stroke={c2} strokeWidth="1" opacity={0.36} />
                            <ellipse cx="0" cy="-6" rx="18" ry="3.5" fill="none" stroke={c2} strokeWidth="0.8" opacity={0.3} />
                            <ellipse cx="0" cy="-2" rx="12" ry="2" fill={c2} opacity={0.24} />
                          </g>
                          <g opacity={0.28}>
                            <circle cx="12" cy="48" r="1.5" fill={c2} /><line x1="13.5" y1="48" x2="13.5" y2="40" stroke={c2} strokeWidth="0.5" />
                            <circle cx="22" cy="44" r="1.5" fill={c2} /><line x1="23.5" y1="44" x2="23.5" y2="36" stroke={c2} strokeWidth="0.5" />
                            <path d="M13.5 40 Q18 38 23.5 36" fill="none" stroke={c2} strokeWidth="0.5" />
                            <circle cx="58" cy="50" r="1.5" fill={c2} /><line x1="59.5" y1="50" x2="59.5" y2="42" stroke={c2} strokeWidth="0.5" />
                            <circle cx="68" cy="46" r="1.5" fill={c2} /><line x1="69.5" y1="46" x2="69.5" y2="38" stroke={c2} strokeWidth="0.5" />
                            <path d="M59.5 42 Q64 40 69.5 38" fill="none" stroke={c2} strokeWidth="0.5" />
                          </g>
                          <g transform="translate(40,95)" opacity={0.32}>
                            {[[-28,6],[-22,12],[-16,20],[-10,28],[-4,20],[2,32],[8,24],[14,16],[20,10],[26,6]].map(([x, ht], k) => (
                              <rect key={k} x={x} y={-ht} width="2.5" height={ht} rx="0.5" fill={c2} />
                            ))}
                          </g>
                          <g transform="translate(8,20)" opacity={0.22}>
                            <path d="M8 0 Q14 -2 16 4 Q18 10 14 16 Q10 20 8 18 Q6 16 8 14 Q10 12 10 8 Q10 4 8 2 Z" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" />
                            <path d="M10 8 Q8 10 8 14" fill="none" stroke={c2} strokeWidth="0.8" />
                          </g>
                        </svg>
                      </div>
                      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 28%, rgba(0,0,0,.06) 100%)' }} />
                    </>
                  )}
                  {s.id === 'taste' && (
                    <>
                      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-[30%] w-[70%] aspect-square rounded-full z-[1]" style={{ background: `radial-gradient(circle, ${c2}32, transparent 50%)` }} />
                      <div className="absolute inset-0 flex items-center justify-center z-[2]" style={{ padding: '12% 8% 28% 8%' }}>
                        <svg className="w-full h-full" viewBox="0 0 80 130" style={{ overflow: 'visible' }}>
                          <g transform="translate(40,38)">
                            <circle cx="0" cy="0" r="28" fill="none" stroke={c2} strokeWidth="0.5" opacity={0.28} />
                            <circle cx="0" cy="0" r="22" fill="none" stroke={c2} strokeWidth="0.4" opacity={0.24} />
                            <circle cx="0" cy="0" r="16" fill="none" stroke={c2} strokeWidth="0.3" opacity={0.2} />
                            <line x1="0" y1="-28" x2="0" y2="-16" stroke={c2} strokeWidth="0.3" opacity={0.2} />
                            <line x1="24" y1="-14" x2="14" y2="-8" stroke={c2} strokeWidth="0.3" opacity={0.2} />
                            <line x1="24" y1="14" x2="14" y2="8" stroke={c2} strokeWidth="0.3" opacity={0.2} />
                            <line x1="0" y1="28" x2="0" y2="16" stroke={c2} strokeWidth="0.3" opacity={0.2} />
                            <line x1="-24" y1="14" x2="-14" y2="8" stroke={c2} strokeWidth="0.3" opacity={0.2} />
                            <line x1="-24" y1="-14" x2="-14" y2="-8" stroke={c2} strokeWidth="0.3" opacity={0.2} />
                            <circle cx="0" cy="-24" r="2.5" fill={c2} opacity={0.36} /><circle cx="21" cy="-12" r="2" fill={c2} opacity={0.3} /><circle cx="21" cy="12" r="2.5" fill={c2} opacity={0.36} />
                            <circle cx="0" cy="24" r="2" fill={c2} opacity={0.3} /><circle cx="-21" cy="12" r="2.5" fill={c2} opacity={0.3} /><circle cx="-21" cy="-12" r="2" fill={c2} opacity={0.26} />
                            <path d="M0 -6 Q4 0 0 6 Q-4 0 0 -6Z" fill={c2} opacity={0.4} />
                          </g>
                          <g transform="translate(40,85)" opacity={0.26}>
                            <path d="M-10 0 Q-12 -8 -8 -14 Q-4 -18 0 -20 Q4 -18 8 -14 Q12 -8 10 0 Q6 8 0 10 Q-6 8 -10 0Z" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" />
                            <circle cx="0" cy="-14" r="2" fill="none" stroke={c2} strokeWidth="0.4" /><circle cx="-6" cy="-4" r="2" fill="none" stroke={c2} strokeWidth="0.4" /><circle cx="6" cy="-4" r="2" fill="none" stroke={c2} strokeWidth="0.4" /><circle cx="0" cy="4" r="2.5" fill="none" stroke={c2} strokeWidth="0.4" />
                          </g>
                          <g transform="translate(14,90)" opacity={0.3}>
                            <ellipse cx="0" cy="0" rx="5" ry="6" fill={c2} />
                            <line x1="0" y1="-6" x2="1" y2="-10" stroke={c2} strokeWidth="0.6" />
                            <ellipse cx="4" cy="-10" rx="3.5" ry="1.8" fill={c2} transform="rotate(-15 4 -10)" />
                          </g>
                          <g transform="translate(62,88)" opacity={0.26}>
                            <ellipse cx="0" cy="0" rx="4" ry="6" fill={c2} transform="rotate(15)" />
                            <line x1="0" y1="-4" x2="0" y2="4" stroke={c2} strokeWidth="0.4" />
                          </g>
                          <path d="M14 85 Q20 70 30 55" fill="none" stroke={c2} strokeWidth="0.3" opacity={0.2} strokeDasharray="2,3" />
                          <path d="M62 84 Q58 70 50 55" fill="none" stroke={c2} strokeWidth="0.3" opacity={0.2} strokeDasharray="2,3" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,.05) 100%)' }} />
                    </>
                  )}
                  {s.id === 'sight' && (
                    <>
                      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-[25%] w-[65%] aspect-square rounded-full z-[1]" style={{ background: `radial-gradient(circle, ${c2}22, transparent 50%)` }} />
                      <div className="absolute inset-0 flex items-center justify-center z-[2]" style={{ padding: '12% 8% 28% 8%' }}>
                        <svg className="w-full h-full" viewBox="0 0 80 130" style={{ overflow: 'visible' }}>
                          <g transform="translate(40,28)">
                            <path d="M-28 0 Q-14 -14 0 -16 Q14 -14 28 0" fill="none" stroke={c2} strokeWidth="1.5" opacity={0.5} strokeLinecap="round" />
                            <path d="M-28 0 Q-14 10 0 12 Q14 10 28 0" fill="none" stroke={c2} strokeWidth="1.2" opacity={0.44} strokeLinecap="round" />
                            <g opacity={0.38}>
                              <line x1="-22" y1="-4" x2="-24" y2="-8" stroke={c2} strokeWidth="0.6" strokeLinecap="round" />
                              <line x1="-16" y1="-9" x2="-18" y2="-14" stroke={c2} strokeWidth="0.6" strokeLinecap="round" />
                              <line x1="-8" y1="-13" x2="-9" y2="-18" stroke={c2} strokeWidth="0.6" strokeLinecap="round" />
                              <line x1="0" y1="-16" x2="0" y2="-20" stroke={c2} strokeWidth="0.6" strokeLinecap="round" />
                              <line x1="8" y1="-13" x2="9" y2="-18" stroke={c2} strokeWidth="0.6" strokeLinecap="round" />
                              <line x1="16" y1="-9" x2="18" y2="-14" stroke={c2} strokeWidth="0.6" strokeLinecap="round" />
                              <line x1="22" y1="-4" x2="24" y2="-8" stroke={c2} strokeWidth="0.6" strokeLinecap="round" />
                            </g>
                            <circle cx="0" cy="0" r="10" fill="none" stroke={c2} strokeWidth="1.2" opacity={0.44} />
                            <circle cx="0" cy="0" r="7" fill="none" stroke={c2} strokeWidth="0.5" opacity={0.36} />
                            <g opacity={0.24}>
                              <line x1="0" y1="-10" x2="0" y2="-4" stroke={c2} strokeWidth="0.4" />
                              <line x1="7" y1="-7" x2="3" y2="-3" stroke={c2} strokeWidth="0.4" />
                              <line x1="10" y1="0" x2="4" y2="0" stroke={c2} strokeWidth="0.4" />
                              <line x1="7" y1="7" x2="3" y2="3" stroke={c2} strokeWidth="0.4" />
                              <line x1="0" y1="10" x2="0" y2="4" stroke={c2} strokeWidth="0.4" />
                              <line x1="-7" y1="7" x2="-3" y2="3" stroke={c2} strokeWidth="0.4" />
                              <line x1="-10" y1="0" x2="-4" y2="0" stroke={c2} strokeWidth="0.4" />
                              <line x1="-7" y1="-7" x2="-3" y2="-3" stroke={c2} strokeWidth="0.4" />
                            </g>
                            <circle cx="0" cy="0" r="4" fill={c2} opacity={0.4} />
                            <circle cx="-2" cy="-2" r="1.5" fill={c2} opacity={0.32} />
                            <circle cx="2" cy="1" r="0.8" fill={c2} opacity={0.22} />
                          </g>
                          <g transform="translate(40,72)">
                            <circle cx="0" cy="0" r="22" fill="none" stroke={c2} strokeWidth="1.5" opacity={0.44} />
                            <circle cx="0" cy="0" r="18" fill={c2} opacity={0.28} />
                            <g opacity={0.46}>
                              <line x1="0" y1="-14" x2="0" y2="8" stroke={c2} strokeWidth="0.6" />
                              <path d="M0 -12 Q-6 -10 -10 -8" fill="none" stroke={c2} strokeWidth="0.6" strokeLinecap="round" />
                              <path d="M0 -12 Q6 -10 10 -8" fill="none" stroke={c2} strokeWidth="0.6" strokeLinecap="round" />
                              <path d="M0 -8 Q-7 -6 -12 -4" fill="none" stroke={c2} strokeWidth="0.5" strokeLinecap="round" />
                              <path d="M0 -8 Q7 -6 12 -4" fill="none" stroke={c2} strokeWidth="0.5" strokeLinecap="round" />
                              <path d="M0 -4 Q-6 -2 -10 0" fill="none" stroke={c2} strokeWidth="0.5" strokeLinecap="round" />
                              <path d="M0 -4 Q6 -2 10 0" fill="none" stroke={c2} strokeWidth="0.5" strokeLinecap="round" />
                              <path d="M0 0 Q-5 2 -8 4" fill="none" stroke={c2} strokeWidth="0.4" strokeLinecap="round" />
                              <path d="M0 0 Q5 2 8 4" fill="none" stroke={c2} strokeWidth="0.4" strokeLinecap="round" />
                              <circle cx="0" cy="8" r="2" fill={c2} opacity={0.6} />
                            </g>
                            <path d="M22 -4 Q28 -2 28 4 Q28 10 22 12" fill="none" stroke={c2} strokeWidth="1" opacity={0.3} strokeLinecap="round" />
                          </g>
                          <path d="M40 42 L40 50" fill="none" stroke={c2} strokeWidth="0.4" opacity={0.2} strokeDasharray="1.5,2" />
                          <ellipse cx="40" cy="98" rx="26" ry="3.5" fill="none" stroke={c2} strokeWidth="0.6" opacity={0.24} />
                        </svg>
                      </div>
                      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,.04) 100%)' }} />
                    </>
                  )}
                  <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 z-[10] text-center whitespace-nowrap">
                    <div style={{ ...FONT_SERIF, fontSize: 'clamp(6.5px, .95vw, 10px)', color: c1, letterSpacing: '0.08em', textTransform: 'lowercase', opacity: 0.96, lineHeight: 1.15 }}>{s.label}</div>
                    <div style={{ ...FONT_CURSIVE, fontSize: 'clamp(6px, .8vw, 8.5px)', color: c1, opacity: 0.82, lineHeight: 1.2 }}>{s.sub}</div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={grainStyle} />
                </div>
              ))}
            </div>
          </div>

          {/* Emotional Map — 2 cards */}
          <div className="absolute z-[20]" style={{ top: sceneTop(LAYOUT.emoTop), ...SECTION_MARGIN }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={secHeaderStyle}>Emotional Arc</span>
            </div>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="rounded-md overflow-hidden relative flex flex-col items-center text-center gap-0.5 p-3" style={{ background: c1 }}>
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${cA2}, ${c4})`, opacity: 0.62 }} />
                <div className="w-full flex-1 min-h-0 relative z-[1]" style={{ aspectRatio: 3.4 }}>
                  <svg viewBox="0 0 200 60" className="w-full h-full">
                    <path d="M0 50 Q20 48 40 42 Q60 35 80 28 Q100 20 120 15 Q140 10 160 12 Q180 14 200 18" fill="none" stroke={cA2} strokeWidth="1.2" opacity="0.72" />
                    <path d="M0 50 Q20 48 40 42 Q60 35 80 28 Q100 20 120 15 Q140 10 160 12 Q180 14 200 18 L200 60 L0 60Z" fill={cA2} fillOpacity="0.2" />
                    <circle cx="40" cy="42" r="2.5" fill={cA2} opacity="0.52" />
                    <circle cx="120" cy="15" r="2.5" fill={cA2} opacity="0.52" />
                    <circle cx="200" cy="18" r="2.5" fill={cA2} opacity="0.52" />
                    <text x="40" y="55" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="9" fill={cA2} opacity="0.82">curiosity</text>
                    <text x="120" y="10" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="9" fill={cA2} opacity="0.82">wonder</text>
                    <text x="185" y="28" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="9" fill={cA2} opacity="0.82">calm</text>
                  </svg>
                </div>
                <div style={{ ...FONT_SERIF, fontSize: 11, color: c5, letterSpacing: '0.06em', textTransform: 'lowercase', position: 'relative', zIndex: 1 }}>the rising arc</div>
                <div style={{ ...FONT_CURSIVE, fontSize: 9.5, color: cA2, opacity: 0.72, position: 'relative', zIndex: 1 }}>from curiosity to calm</div>
              </div>
              <div className="rounded-md overflow-hidden relative flex flex-col items-center text-center gap-0.5 p-3" style={{ background: c1 }}>
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${c4}, ${cA2})`, opacity: 0.62 }} />
                <div className="w-full flex-1 min-h-0 relative z-[1]" style={{ aspectRatio: 3.4 }}>
                  <svg viewBox="0 0 200 60" className="w-full h-full">
                    <circle cx="50" cy="30" r="18" fill="none" stroke={c4} strokeWidth="0.5" opacity="0.5" />
                    <circle cx="50" cy="30" r="10" fill="none" stroke={cA2} strokeWidth="0.8" opacity="0.6" />
                    <circle cx="50" cy="30" r="3" fill={cA2} opacity="0.54" />
                    <circle cx="130" cy="30" r="22" fill="none" stroke={c4} strokeWidth="0.5" opacity="0.44" />
                    <circle cx="130" cy="30" r="14" fill="none" stroke={cA2} strokeWidth="0.8" opacity="0.54" />
                    <circle cx="130" cy="30" r="6" fill={cA2} opacity="0.5" />
                    <line x1="68" y1="30" x2="108" y2="30" stroke={cA2} strokeWidth="0.4" opacity="0.38" strokeDasharray="2,3" />
                    <text x="50" y="56" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="10.5" fill={c4} opacity="0.92">self</text>
                    <text x="130" y="56" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="10.5" fill={c4} opacity="0.92">community</text>
                    <text x="90" y="25" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="6.5" fill={cA2} opacity="0.72">slow bridge</text>
                  </svg>
                </div>
                <div style={{ ...FONT_SERIF, fontSize: 11, color: c5, letterSpacing: '0.06em', textTransform: 'lowercase', position: 'relative', zIndex: 1 }}>connection map</div>
                <div style={{ ...FONT_CURSIVE, fontSize: 9.5, color: cA2, opacity: 0.72, position: 'relative', zIndex: 1 }}>from me to we</div>
              </div>
            </div>
          </div>

          {posterChrome && (
          <>
          {/* Quote — solo con cromo de póster (Solo escena lo oculta junto al pie) */}
          <div className="absolute z-[20]" style={{ top: py(LAYOUT.quoteTop), ...SECTION_MARGIN }}>
            <div className="rounded-md overflow-hidden flex items-center gap-3 p-4 relative" style={{ background: c1 }}>
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${cA2}, ${c4})`, opacity: 0.4 }} />
              <div className="absolute top-0.5 left-0 right-0 h-1/2 pointer-events-none" style={{ background: `linear-gradient(180deg, ${c4}, transparent)`, opacity: 0.04 }} />
              <span className="flex-shrink-0 relative z-[1]" style={{ ...FONT_SERIF, fontSize: 42, color: cA2, opacity: 0.16, lineHeight: 0.6 }}>&quot;</span>
              <div className="relative z-[1] flex-1 min-w-0">
                <div style={{ ...FONT_SERIF, fontStyle: 'italic', fontSize: 11, color: c5, opacity: 0.88, lineHeight: 1.5, letterSpacing: '0.02em', marginBottom: 4 }}>
                  Every cup tells the story of a seed that waited, a hand that cared, a fire that transformed, and a moment that asked you — just for once — to slow down.
                </div>
                <div style={{ ...FONT_CURSIVE, fontSize: 10, color: cA2, opacity: 0.55 }}>— the aura manifesto</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-[2%] right-[-4%] z-[4] pointer-events-none select-none lowercase" style={{ ...FONT_SERIF, fontSize: 140, color: c3, lineHeight: 0.65, opacity: 0.1 }}>a</div>

          {/* Footer — mismo formato que Ilustraciones / Packaging / Papeleria */}
          <div className="absolute bottom-0 left-0 right-0 z-[100] flex items-center justify-center" style={{ height: `${LAYOUT.footerHeight}%`, background: c1 }}>
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

export const Storytelling = memo(StorytellingInner);
