import React from 'react';
import type { PosterPalette } from '../types';
import {
  POSTER_BASE_WIDTH,
  POSTER_HEIGHT,
  POSTER_SCALE,
  BRANDING_GRAIN_URL,
  BRANDING_KRAFT_URL,
} from '../constants';
import { FONT_SANS, FONT_SERIF, FONT_CURSIVE, FONT_MONO, AURA_LOWERCASE } from './brandingFonts';

/** Colores de paleta usados por MiniBru y patrones */
type PaletteSlice = { c2: string; cA2: string; c4: string; c5: string; cText: string; textAlpha: number };

type PoseConfig = { mouth: 'smile' | 'open' | 'wink'; eyes: 'open' | 'closed'; love: boolean; label: string };

/** Mini versión del mascota Bru: hero (sin boca, ojos abiertos) o pose (con boca/ojos/label) */
function MiniBru({
  colors,
  variant,
  pose,
  wrapperClassName = '',
  wrapperStyle = {},
}: {
  colors: PaletteSlice;
  variant: 'hero' | 'pose';
  pose?: PoseConfig;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
}) {
  const { c2, cA2, c4, c5, cText, textAlpha } = colors;
  const recede = variant === 'hero';
  const lineTop = variant === 'hero' ? '22%' : '20%';
  const eyesLeftRight = variant === 'hero' ? '25%' : '28%';
  const eyesTop = variant === 'hero' ? '32%' : '33%';
  const eyeSize = variant === 'hero' ? '14%' : '11%';

  return (
    <div className={wrapperClassName} style={wrapperStyle}>
      <div className="relative w-full h-full" style={{ aspectRatio: 0.72 }}>
        <div className="absolute inset-0 rounded-[48%]" style={{ background: c2, opacity: 0.85 }} />
        <div className="absolute inset-0 rounded-[48%]" style={{ background: `linear-gradient(135deg, ${cA2} 0%, ${cA2} 22%, transparent 52%)` }} />
        {recede && <div className="absolute inset-0 rounded-[48%]" style={{ background: c4, opacity: 0.25, pointerEvents: 'none' }} />}
        <div className="absolute top-[4%] left-[16%] w-[12%] h-[48%]" style={{ background: `${c5}30`, borderRadius: '50% / 36%' }} />
        <div className="absolute left-1/2 w-px h-[50%] -translate-x-1/2" style={{ top: lineTop, background: cText, opacity: 0.35 * textAlpha }} />
        {(!pose || pose.eyes === 'open') && (
          <>
            <div className="absolute aspect-square rounded-full" style={{ top: eyesTop, left: eyesLeftRight, width: eyeSize, background: cText, opacity: textAlpha }}>
              <div className="absolute rounded-full" style={{ width: '30%', height: '30%', right: '8%', top: '8%', background: c5 }} />
            </div>
            <div className="absolute aspect-square rounded-full" style={{ top: eyesTop, right: eyesLeftRight, width: eyeSize, background: cText, opacity: textAlpha }}>
              <div className="absolute rounded-full" style={{ width: '30%', height: '30%', right: '8%', top: '8%', background: c5 }} />
            </div>
          </>
        )}
        {pose?.eyes === 'closed' && (
          <>
            <div className="absolute top-[35%] left-[26%] w-[11%] h-[1.5px] -rotate-5 rounded-px" style={{ background: cText, opacity: 0.4 * textAlpha }} />
            <div className="absolute top-[35%] right-[26%] w-[11%] h-[1.5px] rotate-5 rounded-px" style={{ background: cText, opacity: 0.4 * textAlpha }} />
          </>
        )}
        <div className="absolute top-[42%] left-[14%] w-[14%] aspect-[1.4] rounded-full" style={{ background: c5, opacity: 0.4 }} />
        <div className="absolute top-[42%] right-[14%] w-[14%] aspect-[1.4] rounded-full" style={{ background: c5, opacity: 0.4 }} />
        {pose?.mouth === 'smile' && <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-[18%] h-[8%] border-b border-[1.5px] rounded-b-[50%]" style={{ borderColor: cText, opacity: textAlpha }} />}
        {pose?.mouth === 'open' && <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-[12%] h-[10%] rounded-full" style={{ background: cText, opacity: 0.25 * textAlpha }} />}
        {pose?.mouth === 'wink' && pose.eyes !== 'closed' && <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-[14%] h-[6%] border-b border-[1.5px] rounded-b-[40%]" style={{ borderColor: cText, opacity: 0.35 * textAlpha }} />}
        {pose?.love && <span className="absolute top-[10%] right-[8%] text-[10px] opacity-30" style={{ color: c2 }}>♥</span>}
      </div>
    </div>
  );
}

/** Patrón Foliage: hojas/forma orgánica */
function PatternFoliage({ c4, c5, labelStyle }: { c4: string; c5: string; labelStyle: React.CSSProperties }) {
  return (
    <div className="rounded relative overflow-hidden" style={{ background: c4, opacity: 0.98 }}>
      <div className="absolute inset-[8%] flex flex-wrap items-center justify-center gap-1 p-0.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="border-2 rounded-[50%_2px_50%_2px]" style={{ width: 8, height: 11, borderColor: c5, opacity: 0.62, transform: i % 2 === 0 ? 'rotate(-12deg)' : 'rotate(10deg) scaleX(-1)' }} />
        ))}
      </div>
      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2" style={labelStyle}>Foliage</span>
    </div>
  );
}

/** Patrón Beans: óvalos tipo grano */
function PatternBeans({ c4, c5, labelStyle }: { c4: string; c5: string; labelStyle: React.CSSProperties }) {
  return (
    <div className="rounded relative overflow-hidden" style={{ background: c4, opacity: 0.92 }}>
      <div className="absolute inset-[5%] grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', alignContent: 'center', justifyItems: 'center' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="relative rounded-[50%] border-2" style={{ width: '75%', aspectRatio: '0.7', borderColor: c5, opacity: 0.58, transform: `rotate(${i % 2 === 0 ? -15 : 12}deg)` }}>
            <div className="absolute top-[28%] left-1/2 w-px h-[45%] -translate-x-1/2" style={{ background: c5, opacity: 0.58 }} />
          </div>
        ))}
      </div>
      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2" style={labelStyle}>Beans</span>
    </div>
  );
}

/** Patrón Geometric: rombos en 2 filas con offset */
function PatternGeometric({ c1, c5, labelStyle }: { c1: string; c5: string; labelStyle: React.CSSProperties }) {
  return (
    <div className="rounded relative overflow-hidden" style={{ background: c1 }}>
      <div className="absolute inset-0">
        {GEOMETRIC_ROW_LEFT_PCTS.flatMap((rowLefts, rowIndex) =>
          rowLefts.map((leftPct, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="absolute border-2 rotate-45"
              style={{
                width: GEOMETRIC_DIAMOND_SIZE,
                height: GEOMETRIC_DIAMOND_SIZE,
                left: `${leftPct}%`,
                top: rowIndex === 0 ? '22%' : '62%',
                marginLeft: -GEOMETRIC_DIAMOND_SIZE / 2,
                marginTop: -GEOMETRIC_DIAMOND_SIZE / 2,
                borderColor: c5,
                opacity: 0.52,
              }}
            />
          ))
        )}
      </div>
      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2" style={labelStyle}>Geometric</span>
    </div>
  );
}

/** Patrón Waves: líneas horizontales */
function PatternWaves({ c1, c5, labelStyle }: { c1: string; c5: string; labelStyle: React.CSSProperties }) {
  return (
    <div className="rounded relative overflow-hidden" style={{ background: c1 }}>
      {WAVES_TOP_PERCENTS.map((top) => (
        <div key={top} className="absolute left-0 right-0 h-px rounded-full" style={{ top: `${top}%`, background: c5, opacity: 0.48 }} />
      ))}
      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2" style={labelStyle}>Waves</span>
    </div>
  );
}

const PHOTO_GRAIN_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='nd'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nd)'/%3E%3C/svg%3E";

/** Layout: posición en % del póster para la fila de 4 tarjetas y para Illustration Guidelines */
const ILLUST_GRID_TOP_PCT = 45;
const ILLUST_GUIDELINES_TOP_PCT = 78;

/** Path SVG reutilizado para icono hoja (Icon Set y Sticker Sheet) */
const LEAF_SVG_PATH = 'M12 3C7 8 5 12 5 15.5 5 18.5 7.5 21 12 21s7-2.5 7-5.5C19 12 17 8 12 3z';

/** Posiciones verticales (%) de las líneas del patrón Waves */
const WAVES_TOP_PERCENTS = [10, 18, 26, 34, 42, 50, 58, 66, 74, 82];

/** Centros horizontales (%) de los rombos del patrón Geometric: fila 0 y fila 1 (offset media celda) */
const GEOMETRIC_ROW_LEFT_PCTS: [number[], number[]] = [
  [14, 32, 50, 68, 86],
  [23, 41, 59, 77, 95],
];

const GEOMETRIC_DIAMOND_SIZE = 8;

const CORNER_POSITIONS = [
  { pos: 'tl' as const, top: 1.5, left: 2 },
  { pos: 'tr' as const, top: 1.5, right: 2 },
  { pos: 'bl' as const, bottom: 5, left: 2 },
  { pos: 'br' as const, bottom: 5, right: 2 },
];

const ILLUST_GRID_ITEMS = [
  { name: 'Icon Set', desc: '12 custom line icons, 1.5px stroke, brand palette', type: 'icons' as const },
  { name: 'Mascot Poses', desc: 'Expressive character system, 4 core emotions', type: 'poses' as const },
  { name: 'Patterns', desc: '4 seamless patterns: foliage, beans, geo, waves', type: 'patterns' as const },
  { name: 'Sticker Sheet', desc: 'Badges, labels, stamps for print & digital use', type: 'stickers' as const },
];

const ILLUST_SPECS_CARDS = [
  { title: 'Mascot', items: ['"Bru" — anthropomorphic bean', 'Leaf hat as signature', '4 core emotion poses', 'Always holds a cup prop'] },
  { title: 'Icon System', items: ['1.5px consistent stroke', 'Rounded endpoints', '24×24 base grid', 'Duo-tone palette only'] },
  { title: 'Patterns', items: ['Seamless tile repeat', 'Max 15% opacity on dark', 'Foliage as primary pattern', 'Geo for premium contexts'] },
];

const MASCOT_POSES = [
  { label: 'Happy', mouth: 'smile' as const, eyes: 'open' as const, love: false },
  { label: 'Excited', mouth: 'open' as const, eyes: 'open' as const, love: false },
  { label: 'Chill', mouth: 'wink' as const, eyes: 'closed' as const, love: false },
  { label: 'Love', mouth: 'smile' as const, eyes: 'open' as const, love: true },
];

/** 12 iconos línea (stroke) para Icon Set: café, sol, reloj, hoja, bolsa, gota, wifi, flecha, corazón, nota, estrella, luna */
const ICON_SET_SVG: { viewBox: string; paths: string[] }[] = [
  { viewBox: '0 0 24 24', paths: ['M5 8h10v8c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V8z', 'M15 8c2 0 3 1.5 3 3v1', 'M6 10h8'] }, // café (taza + vapor)
  { viewBox: '0 0 24 24', paths: ['M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0', 'M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M6.22 19.78l-1.42 1.42M19.78 6.22l-1.42 1.42'] }, // sol
  { viewBox: '0 0 24 24', paths: ['M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', 'M12 6v6l4 2'] }, // reloj
  { viewBox: '0 0 24 24', paths: [LEAF_SVG_PATH] }, // hoja
  { viewBox: '0 0 24 24', paths: ['M4 6h16v12H4V6z', 'M4 6l2-4h12l2 4', 'M8 10h8v6H8z'] }, // bolsa
  { viewBox: '0 0 24 24', paths: ['M12 2.5C9.5 7 7 11 7 14c0 2.8 2.2 5 5 5s5-2.2 5-5c0-3-2.5-7-5-11.5z'] }, // gota
  { viewBox: '0 0 24 24', paths: ['M12 19.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0', 'M4 14Q12 6 20 14', 'M7 14Q12 9 17 14', 'M10 14Q12 12 14 14'] }, // wifi (punto + arcos)
  { viewBox: '0 0 24 24', paths: ['M12 19V5M5 12l7-7 7 7'] }, // flecha arriba
  { viewBox: '0 0 24 24', paths: ['M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'] }, // corazón
  { viewBox: '0 0 24 24', paths: ['M9 18V5l12-2v13', 'M9 9l12-2', 'M6 21v-8l6 4 6-4v8'] }, // nota musical
  { viewBox: '0 0 24 24', paths: ['M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7L2 9.4h7.6L12 2z'] }, // estrella
  { viewBox: '0 0 24 24', paths: ['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'] }, // luna
];

interface Props {
  posterColors: PosterPalette;
}

export function Ilustraciones({ posterColors }: Props) {
  const c = posterColors;
  const c1 = c.primary;
  const c2 = c.accent;
  const cA2 = c.accent2 ?? c2;
  const c3 = c.surface;
  const c4 = c.secondary;
  const c5 = c.background;
  const c6 = c.muted;
  const cText = c.text;
  const textAlpha = 0.58;
  const w = POSTER_BASE_WIDTH;
  const h = POSTER_HEIGHT;
  const px = (p: number) => (p / 100) * w;
  const py = (p: number) => (p / 100) * h;

  /** Estilo común para las etiquetas de los 4 patrones (Foliage, Beans, Geometric, Waves) */
  const patternLabelStyle = { ...FONT_MONO, fontSize: 5, color: c5, opacity: 0.95, letterSpacing: '0.1em', textTransform: 'uppercase' as const };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-0">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div className="relative overflow-hidden shadow-2xl rounded" style={{ width: w, height: h, background: c5, ...FONT_SANS }}>
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 300, opacity: 0.22, mixBlendMode: 'multiply', backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '128px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.03, backgroundImage: `url("${BRANDING_KRAFT_URL}")`, backgroundSize: '200px' }} />

          <div className="absolute top-0 left-0 right-0 z-[1]" style={{ height: '8%', background: c1 }}>
            <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: `linear-gradient(90deg, ${c2}, ${c4}, ${c2})`, opacity: 0.5 }} />
          </div>

          {CORNER_POSITIONS.map(({ pos, ...pct }) => {
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

          {/* Logo aura */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[50] flex items-center justify-center" style={{ top: 0, height: '8%', width: '100%' }}>
            <div className="flex flex-row items-center gap-4" style={{ transform: 'translate(-18px, 0) scale(1.1)', transformOrigin: 'center center' }}>
              <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 52, height: 52, transform: 'translate(22px, -6px)' }}>
                <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[52%] h-[38%] rounded-b-[40%]" style={{ borderLeft: `3px solid ${c5}`, borderRight: `3px solid ${c5}`, borderBottom: `3px solid ${c5}`, opacity: 0.72 }} />
                <div className="absolute left-1/2 -translate-x-1/2 w-[28%] rounded-full" style={{ bottom: '13%', height: 3, background: c5, opacity: 0.72 }} />
                <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -rotate-[8deg] w-[28%] h-[38%] border rounded-[50%_2px_50%_2px]" style={{ borderColor: c4, borderWidth: 3 }} />
              </div>
              <div className="flex flex-col items-start justify-center">
                <div className="font-serif lowercase leading-none" style={{ ...AURA_LOWERCASE, color: c5, fontSize: 18, letterSpacing: '0.2em' }}>aura</div>
                <div className="font-cursive" style={{ ...FONT_CURSIVE, color: c5, fontSize: 9, letterSpacing: '0.1em', marginTop: -1, opacity: 0.9 }}>slow brew coffe</div>
              </div>
            </div>
          </div>

          {/* Hero — Mascot "Bru" scene: cielo = sobrefondo (c3), suelos = secundario (c4) */}
          <div className="absolute z-[20] rounded overflow-hidden" style={{ top: py(12.5), left: px(5), right: px(5), height: py(30), background: c3 }}>
            <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c3} 0%, ${c3} 42%, ${c4} 72%, ${c4} 100%)` }} />
            <div className="absolute bottom-0 left-0 right-0" style={{ height: '25%', background: c4, opacity: 0.85, clipPath: 'ellipse(70% 60% at 50% 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0" style={{ height: '18%', background: c2, opacity: 0.6, clipPath: 'ellipse(55% 55% at 60% 100%)' }} />
            {/* Óvalos (nubes) — formas elípticas más alargadas, con transparencia */}
            {[
              { top: '7%', left: '12%', width: '26%', height: '8%' },
              { top: '4%', right: '18%', width: '20%', height: '7%' },
              { top: '14%', right: '5%', width: '16%', height: '6%' },
              { top: '20%', left: '22%', width: '18%', height: '6%' },
              { top: '10%', left: '42%', width: '16%', height: '5%' },
              { top: '5%', left: '28%', width: '20%', height: '7%' },
              { top: '16%', right: '10%', width: '15%', height: '5%' },
            ].map((s, i) => (
              <div key={i} className="absolute rounded-full" style={{ ...s, background: i % 2 === 0 ? c4 : c5, opacity: i % 2 === 0 ? 0.22 : 0.18 }} />
            ))}
            {/* Hojas — doble tamaño y grosor */}
            {[
              { top: '10%', left: '4%', w: '10%', h: '14%', rot: -25 },
              { top: '7%', right: '4%', w: '9%', h: '13%', rot: 20 },
              { bottom: '28%', left: '7%', w: '7%', h: '10%', rot: -10 },
              { bottom: '32%', right: '8%', w: '8%', h: '11%', rot: 15 },
              { top: '17%', right: '16%', w: '7%', h: '10%', rot: -15 },
              { top: '19%', left: '12%', w: '8%', h: '12%', rot: -8 },
              { top: '24%', right: '6%', w: '7%', h: '10%', rot: 22 },
            ].map((s, i) => (
              <div key={i} className="absolute border-2" style={{ width: s.w, height: s.h, borderColor: c4, borderRadius: '50% 4px 50% 4px', opacity: 0.48, transform: `rotate(${s.rot}deg)`, ...(s.top ? { top: s.top } : {}), ...(s.bottom ? { bottom: s.bottom } : {}), ...(s.left ? { left: s.left } : {}), ...(s.right ? { right: s.right } : {}) }} />
            ))}
            {/* Destellos (+) — más grandes para que se distingan */}
            {[
              { top: '11%', left: '27%', size: '2.2%' },
              { top: '19%', right: '24%', size: '1.9%' },
              { top: '34%', left: '16%', size: '1.6%' },
              { top: '7%', right: '34%', size: '1.8%' },
              { top: '27%', left: '6%', size: '1.5%' },
            ].map((s, i) => (
              <div key={i} className="absolute" style={{ top: s.top, left: s.left, right: s.right, width: s.size, height: s.size }}>
                <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2" style={{ background: c2, opacity: 0.55 }} />
                <div className="absolute top-0 left-1/2 w-px h-full -translate-x-1/2" style={{ background: c2, opacity: 0.55 }} />
              </div>
            ))}
            {/* Mini beans — reutilizan MiniBru con variant="hero" */}
            <MiniBru
              colors={{ c2, cA2, c4, c5, cText, textAlpha }}
              variant="hero"
              wrapperClassName="absolute"
              wrapperStyle={{ bottom: '22%', left: '12%', width: '8%', aspectRatio: 0.72, transform: 'rotate(-10deg)', zIndex: 2 }}
            />
            <MiniBru
              colors={{ c2, cA2, c4, c5, cText, textAlpha }}
              variant="hero"
              wrapperClassName="absolute"
              wrapperStyle={{ bottom: '20%', right: '15%', width: '7%', aspectRatio: 0.72, transform: 'rotate(8deg)', zIndex: 2 }}
            />
            {/* Mascot shadow */}
            <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 rounded-full" style={{ width: '32%', height: '4%', background: c1, filter: 'blur(4px)', opacity: 0.2 }} />
            {/* Mascot Bru — base acento (c2); capa superior: acento 2 (cA2) en degradado sup.-izq. con transparencia creciente */}
            <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ width: '28%', aspectRatio: 0.72, zIndex: 5 }}>
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-[48%]" style={{ background: c2 }} />
                <div className="absolute inset-0 rounded-[48%]" style={{ background: `linear-gradient(135deg, ${cA2} 0%, ${cA2} 28%, transparent 58%)` }} />
                <div className="absolute inset-0 rounded-[48%]" style={{ background: `linear-gradient(315deg, ${c5} 0%, ${c5} 18%, transparent 58%)`, opacity: 0.72 }} />
                <div className="absolute top-[4%] left-[16%] w-[12%] h-[48%]" style={{ background: `${c5}30`, borderRadius: '50% / 36%' }} />
                <div className="absolute top-[18%] left-1/2 w-0.5 h-[55%] -translate-x-1/2 rounded-px" style={{ background: cText, opacity: 0.6 * textAlpha }} />
                <div className="absolute top-[-12%] left-[52%] w-[28%] h-[25%] border-2 rounded-[50%_3px_50%_3px] -rotate-30" style={{ borderColor: c4, background: c4, opacity: 0.65 }} />
                <div className="absolute top-[-14%] left-[42%] w-[22%] h-[20%] border-2 rounded-[50%_3px_50%_3px] -rotate-12" style={{ borderColor: c4, background: c4, opacity: 0.5 }} />
                <div className="absolute top-[32%] left-[26%] w-[12%] aspect-square rounded-full" style={{ background: cText, opacity: textAlpha }}>
                  <div className="absolute rounded-full" style={{ width: '36%', height: '36%', right: '10%', top: '10%', background: c5 }} />
                </div>
                <div className="absolute top-[32%] right-[26%] w-[12%] aspect-square rounded-full" style={{ background: cText, opacity: textAlpha }}>
                  <div className="absolute rounded-full" style={{ width: '36%', height: '36%', right: '10%', top: '10%', background: c5 }} />
                </div>
                <div className="absolute top-[42%] left-[14%] w-[14%] aspect-[1.4] rounded-full" style={{ background: c5, opacity: 0.4 }} />
                <div className="absolute top-[42%] right-[14%] w-[14%] aspect-[1.4] rounded-full" style={{ background: c5, opacity: 0.4 }} />
                <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-[22%] h-[10%] border-b-2 rounded-b-[50%]" style={{ borderColor: cText, opacity: textAlpha }} />
                <div className="absolute top-[45%] -left-[18%] w-[20%] h-0.5 rounded-px -rotate-15" style={{ background: cText, opacity: 0.5 * textAlpha }} />
                <div className="absolute top-[45%] -right-[18%] w-[20%] h-0.5 rounded-px rotate-15" style={{ background: cText, opacity: 0.5 * textAlpha }} />
                <div className="absolute top-[38%] -right-[30%] w-[16%] h-[18%] rotate-[8deg] flex flex-col items-center">
                  <div className="w-full flex-1 rounded-sm relative overflow-hidden" style={{ background: c5, borderRadius: '1px 1px 3px 3px' }}>
                    <div className="absolute top-[25%] left-0 right-0 h-[35%]" style={{ background: cText, opacity: 0.6 * textAlpha }} />
                    <div className="absolute top-[15%] right-[8%] w-[20%] h-[25%] rounded-sm" style={{ background: c5, opacity: 0.7, boxShadow: 'inset 0 0 2px rgba(255,255,255,0.4)' }} />
                  </div>
                </div>
                <div className="absolute -bottom-[12%] left-[32%] w-0.5 h-[14%] -rotate-[8deg] rounded-px" style={{ background: cText, opacity: 0.5 * textAlpha }} />
                <div className="absolute -bottom-[12%] right-[32%] w-0.5 h-[14%] rotate-[8deg] rounded-px" style={{ background: cText, opacity: 0.5 * textAlpha }} />
                <div className="absolute -bottom-[15%] left-[27%] w-2 h-0.5 rounded-sm" style={{ background: cText, opacity: 0.45 * textAlpha }} />
                <div className="absolute -bottom-[15%] right-[27%] w-2 h-0.5 rounded-sm" style={{ background: cText, opacity: 0.45 * textAlpha }} />
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: `url("${PHOTO_GRAIN_URL}")`, backgroundSize: '80px' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 55%, transparent 30%, ${c1}99 100%)` }} />
            <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 z-10">
              <div className="rounded-full" style={{ width: 5, height: 5, background: c2 }} />
              <span style={{ ...FONT_MONO, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                <span style={{ color: c3 }}>Mascot</span>
                <span style={{ color: c5, opacity: 0.9 }}> — &quot;Bru&quot; the Bean</span>
              </span>
            </div>
          </div>

          {/* Grid 4 */}
          <div className="absolute z-[20] grid gap-2" style={{ top: py(ILLUST_GRID_TOP_PCT), left: px(5), right: px(5), gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {ILLUST_GRID_ITEMS.map((item) => (
              <div key={item.type} className="flex flex-col gap-1">
                <div className="w-full rounded overflow-hidden relative" style={{ aspectRatio: 0.85 }}>
                  {item.type === 'icons' && (
                    <div className="absolute inset-0 rounded" style={{ background: c5 }}>
                      <div className="absolute inset-[8%] grid gap-1" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', alignContent: 'center', justifyItems: 'center' }}>
                        {ICON_SET_SVG.map((icon, i) => {
                          const iconColor = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c4;
                          const strokeOpacity = i % 3 === 1 ? 0.6 : 0.55;
                          return (
                            <div key={i} className="w-[70%] aspect-square flex items-center justify-center" style={{ color: iconColor, opacity: strokeOpacity }}>
                              <svg viewBox={icon.viewBox} className="w-full h-full shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                {icon.paths.map((d, j) => (
                                  <path key={j} d={d} />
                                ))}
                              </svg>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {item.type === 'poses' && (
                    <div className="absolute inset-0 rounded" style={{ background: `linear-gradient(160deg, ${c3}, ${c5})` }}>
                      <div className="absolute inset-[5%] grid gap-1" style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
                        {MASCOT_POSES.map((pose) => (
                          <div key={pose.label} className="relative rounded flex items-center justify-center" style={{ background: c5, border: `1px solid ${c3}` }}>
                            <MiniBru
                              colors={{ c2, cA2, c4, c5, cText, textAlpha }}
                              variant="pose"
                              pose={{ mouth: pose.mouth, eyes: pose.eyes, love: pose.love, label: pose.label }}
                              wrapperClassName="relative"
                              wrapperStyle={{ width: '50%', aspectRatio: 0.72 }}
                            />
                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2" style={{ ...FONT_MONO, fontSize: 5, color: cText, opacity: 0.75 * textAlpha, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{pose.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.type === 'patterns' && (
                    <div className="absolute inset-0 rounded" style={{ background: c1 }}>
                      <div className="absolute inset-[5%] grid gap-1" style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
                        <PatternFoliage c4={c4} c5={c5} labelStyle={patternLabelStyle} />
                        <PatternBeans c4={c4} c5={c5} labelStyle={patternLabelStyle} />
                        <PatternGeometric c1={c1} c5={c5} labelStyle={patternLabelStyle} />
                        <PatternWaves c1={c1} c5={c5} labelStyle={patternLabelStyle} />
                      </div>
                    </div>
                  )}
                  {item.type === 'stickers' && (
                    <div className="absolute inset-0 rounded" style={{ background: c5 }}>
                      <div className="absolute inset-[6%] grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', alignContent: 'center', justifyItems: 'center' }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: c1 }}>
                          <span style={{ ...AURA_LOWERCASE, fontSize: 6, color: c2 }}>aura</span>
                        </div>
                        <div className="w-9 h-9 rounded-full border-2 flex flex-col items-center justify-center relative" style={{ borderColor: c2 }}>
                          <div className="absolute inset-[15%] rounded-full border" style={{ borderColor: c2, opacity: 0.4 }} />
                          <span style={{ ...FONT_MONO, fontSize: 4, color: c2 }}>100%</span>
                          <span style={{ ...FONT_MONO, fontSize: 3, color: c6 }}>organic</span>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: c2 }}>
                          <span style={{ ...FONT_MONO, fontSize: 5, color: c1 }}>NEW</span>
                        </div>
                        <div className="px-1.5 py-0.5 rounded border flex items-center justify-center" style={{ borderColor: c4 }}>
                          <span style={{ ...FONT_MONO, fontSize: 4, color: c4 }}>ORGANIC</span>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: c4 }}>
                          <span style={{ fontSize: 10, color: c5 }}>☕</span>
                        </div>
                        <div className="px-1.5 py-0.5 rounded border flex items-center justify-center" style={{ borderColor: c2 }}>
                          <span style={{ ...FONT_MONO, fontSize: 4, color: c2 }}>SLOW</span>
                        </div>
                        <div className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: c1 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
                            <path d={LEAF_SVG_PATH} />
                          </svg>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: c1 }}>
                          <span style={{ ...FONT_MONO, fontSize: 5, color: c5 }}>BREW</span>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 flex flex-col items-center justify-center relative" style={{ borderColor: c2 }}>
                          <div className="absolute inset-[15%] rounded-full border" style={{ borderColor: c2, opacity: 0.4 }} />
                          <span style={{ ...AURA_LOWERCASE, fontSize: 4, color: c2 }}>est.</span>
                          <span style={{ ...FONT_MONO, fontSize: 3, color: c6 }}>2024</span>
                        </div>
                        <div className="px-2 py-0.5 rounded border flex items-center justify-center" style={{ borderColor: c1 }}>
                          <span style={{ ...AURA_LOWERCASE, fontSize: 4, color: c1 }}>rooted</span>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: c2 }}>
                          <span style={{ fontSize: 10, color: c1 }}>♥</span>
                        </div>
                        <div className="px-2 py-0.5 rounded border flex items-center justify-center" style={{ borderColor: c4 }}>
                          <span style={{ ...AURA_LOWERCASE, fontSize: 4, color: c4 }}>nature</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5" style={{ marginTop: 6 }}>
                  <div className="rounded-full flex-shrink-0 border-[1.5px]" style={{ width: 5, height: 5, borderColor: c2, opacity: 0.5 }} />
                  <span style={{ ...FONT_SERIF, fontStyle: 'italic', fontSize: 11, color: c1, letterSpacing: '0.05em' }}>{item.name}</span>
                </div>
                <div style={{ ...FONT_MONO, fontSize: 8, color: c6, opacity: 0.6, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="absolute z-[60]" style={{ top: py(ILLUST_GUIDELINES_TOP_PCT), left: px(5), right: px(5) }}>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={{ ...FONT_MONO, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: c6 }}>Illustration Guidelines</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {ILLUST_SPECS_CARDS.map((card) => (
                <div key={card.title} className="rounded-lg overflow-hidden relative" style={{ background: c1, padding: '10px 12px' }}>
                  <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none" style={{ background: `linear-gradient(180deg, ${c4}10, transparent)` }} />
                  <div style={{ ...FONT_SERIF, fontSize: 12, color: c5, letterSpacing: '0.04em', marginBottom: 6, position: 'relative', zIndex: 1 }}>{card.title}</div>
                  <div className="w-full h-px mb-1.5 relative z-[1]" style={{ background: `linear-gradient(90deg, ${c2}44, transparent)` }} />
                  <div className="flex flex-col gap-0.5 relative z-[1]">
                    {card.items.map((text, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="rounded-full flex-shrink-0" style={{ width: 3, height: 3, background: c2, opacity: 0.4 }} />
                        <span style={{ ...FONT_MONO, fontSize: 8, color: c3, opacity: 0.8 }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-[2%] right-[-4%] z-[4] font-serif leading-[0.65] opacity-[0.18] pointer-events-none select-none lowercase" style={{ ...FONT_SERIF, fontSize: 160, color: c3 }}>a</div>

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
