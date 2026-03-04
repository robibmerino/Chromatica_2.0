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

const FORMAT_ITEMS = [
  { name: 'Magazine Spread', desc: 'Full-bleed, word-as-image, bean dissolve' },
  { name: 'Street Poster', desc: 'Typographic disruption, product hero' },
  { name: 'IG Story Ad', desc: 'Cup-as-letter, product hero, swipe CTA' },
] as const;

const FORMAT_ASPECTS = [0.7, 0.58, 0.56] as const;

const SPEC_CARDS = [
  { title: 'Print', items: ["Billboard 14'×48'", 'Bus Shelter CLP', 'Magazine A3 spread', 'Poster A1 / A0'] },
  { title: 'Digital', items: ['Story 1080×1920', 'Feed 1080×1350', 'Banner 728×90', 'Video 16:9 / 15s'] },
  { title: 'Production', items: ['CMYK + PMS 874', 'Backlit translucent', 'Soy inks, FSC', 'sRGB digital'] },
] as const;

interface Props {
  posterColors: PosterPalette;
}

function PublicidadInner({ posterColors }: Props) {
  const c = posterColors;
  const c1 = c.primary;
  const c2 = c.accent;
  const c3 = c.surface;
  const c4 = c.secondary;
  const c5 = c.background;
  const c6 = c.muted;
  const cA2 = c.accent2 ?? c2;
  const textColor = c.text;
  const w = POSTER_BASE_WIDTH;
  const h = POSTER_HEIGHT;
  const px = (p: number) => (p / 100) * w;
  const py = (p: number) => (p / 100) * h;
  const formatCardHeight = py(29);
  const fadeOverlayStyle = { background: `linear-gradient(180deg, ${textColor} 0%, ${textColor}99 18%, ${textColor}4d 55%, transparent 100%)` };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-0" role="img" aria-label="Mockup de campaña publicitaria Aura: billboard nocturno, formatos Magazine Spread, Street Poster e IG Story, y especificaciones de campaña">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div className="relative overflow-hidden shadow-2xl rounded" style={{ width: w, height: h, background: c5, ...FONT_SANS }}>
          {/* Texturas */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 300, opacity: 0.18, mixBlendMode: 'multiply', backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '128px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.03, backgroundImage: `url("${BRANDING_KRAFT_URL}")`, backgroundSize: '200px' }} />

          {/* Líneas decorativas */}
          {[36, 52.5, 75.5, 87.5].map((top) => (
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

          {/* Hero — Billboard */}
          <div className="absolute z-[20] rounded overflow-hidden" style={{ top: py(12), left: px(5), right: px(5), height: py(26), background: c1 }}>
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c1} 0%, ${c4} 30%, ${c1} 60%, ${c1} 100%)`, opacity: 0.92 }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c1}cc 0%, ${c1}99 40%, ${c1}88 100%)` }} />
            {/* Plano de fondo: color Texto desde el borde superior, degradando a 100% transparencia en la línea de suelo */}
            <div
              className="absolute left-0 right-0 z-0"
              style={{
                top: 0,
                height: '88%',
                opacity: 0.78,
                background: `linear-gradient(180deg, ${textColor} 0%, ${textColor} 18%, ${textColor}e6 40%, ${textColor}99 60%, ${textColor}4d 80%, transparent 100%)`,
              }}
            />
            {/* Plano color Texto dentro del hero: desde la línea de los edificios hasta el borde inferior de la imagen */}
            <div className="absolute left-0 right-0 bottom-0 z-[1]" style={{ top: '88%', background: textColor, opacity: 0.68 }} />
            {/* Estrellas — c3 (claros) para contrastar con cielo oscuro */}
            {[
              { t: 4, l: 18, s: 2 }, { t: 9, l: 40, s: 1.5 }, { t: 6, l: 65, s: 2.5 }, { t: 13, l: 80, s: 1.5 }, { t: 3, l: 50, s: 1.5 }, { t: 15, l: 28, s: 2 },
              { t: 5, l: 8, s: 1 }, { t: 11, l: 25, s: 1.5 }, { t: 7, l: 55, s: 1 }, { t: 2, l: 72, s: 2 }, { t: 14, l: 5, s: 1.5 }, { t: 10, l: 90, s: 1 }, { t: 8, l: 35, s: 2 }, { t: 12, l: 58, s: 1 }, { t: 4.5, l: 48, s: 1 }, { t: 16, l: 15, s: 1.5 }, { t: 6.5, l: 82, s: 1 },
            ].map((star, i) => (
              <div key={i} className="absolute rounded-full" style={{ top: `${star.t}%`, left: `${star.l}%`, width: star.s, height: star.s, background: c3, opacity: star.s >= 2 ? 0.5 : 0.45 }} />
            ))}
            <div className="absolute top-[6%] right-[11%] rounded-full" style={{ width: 32, height: 32, background: `radial-gradient(circle at 35% 35%, ${c3}, ${c6})`, opacity: 0.3 }} />
            {/* Skyline — más altura (50%) y edificios más altos para que no se vean aplastados */}
            <div className="absolute bottom-[12%] left-0 right-0" style={{ height: '50%' }}>
              <div className="absolute bottom-0 left-0 w-[9%] h-[88%]" style={{ background: c6, opacity: 0.85 }}>
                <div className="absolute top-[10%] left-[20%] w-[14%] h-[4%] rounded-sm" style={{ background: c2, opacity: 0.75 }} />
                <div className="absolute top-[22%] left-[55%] w-[14%] h-[4%] rounded-sm" style={{ background: c2, opacity: 0.75 }} />
                <div className="absolute top-[34%] left-[20%] w-[14%] h-[4%] rounded-sm" style={{ background: c2, opacity: 0.75 }} />
              </div>
              <div className="absolute bottom-0 left-[8%] w-[5%] h-[68%]" style={{ background: c6, opacity: 0.75 }} />
              <div className="absolute bottom-0 left-[12%] w-[6%] h-[92%]" style={{ background: c6, opacity: 0.9 }}>
                <div className="absolute top-[8%] left-[20%] w-[12%] h-[3.5%] rounded-sm" style={{ background: c3, opacity: 0.7 }} />
                <div className="absolute top-[16%] left-[55%] w-[12%] h-[3.5%] rounded-sm" style={{ background: c3, opacity: 0.7 }} />
                <div className="absolute top-[24%] left-[20%] w-[12%] h-[3.5%] rounded-sm" style={{ background: c3, opacity: 0.7 }} />
              </div>
              <div className="absolute bottom-0 right-0 w-[10%] h-[96%]" style={{ background: c6, opacity: 0.9 }}>
                <div className="absolute top-[6%] left-[18%] w-[10%] h-[3%] rounded-sm" style={{ background: c3, opacity: 0.7 }} />
                <div className="absolute top-[14%] left-[60%] w-[10%] h-[3%] rounded-sm" style={{ background: c3, opacity: 0.7 }} />
                <div className="absolute top-[22%] left-[18%] w-[10%] h-[3%] rounded-sm" style={{ background: c3, opacity: 0.7 }} />
              </div>
              <div className="absolute bottom-0 right-[9%] w-[5%] h-[72%]" style={{ background: c6, opacity: 0.75 }} />
              <div className="absolute bottom-0 right-[13%] w-[4%] h-[58%]" style={{ background: c6, opacity: 0.65 }} />
              {/* Capa superior: duplicado de edificios en color acento con bastante transparencia */}
              <div className="absolute bottom-0 left-0 w-[9%] h-[88%] pointer-events-none" style={{ background: c2, opacity: 0.14 }} />
              <div className="absolute bottom-0 left-[8%] w-[5%] h-[68%] pointer-events-none" style={{ background: c2, opacity: 0.14 }} />
              <div className="absolute bottom-0 left-[12%] w-[6%] h-[92%] pointer-events-none" style={{ background: c2, opacity: 0.14 }} />
              <div className="absolute bottom-0 right-0 w-[10%] h-[96%] pointer-events-none" style={{ background: c2, opacity: 0.14 }} />
              <div className="absolute bottom-0 right-[9%] w-[5%] h-[72%] pointer-events-none" style={{ background: c2, opacity: 0.14 }} />
              <div className="absolute bottom-0 right-[13%] w-[4%] h-[58%] pointer-events-none" style={{ background: c2, opacity: 0.14 }} />
              {/* Plano de color Texto de la paleta por debajo de la línea donde apoyan los edificios */}
              <div className="absolute bottom-0 left-0 right-0 h-[16%]" style={{ background: textColor }} />
            </div>
            {/* Árboles — c6 para silueta oscura (alineados al nuevo skyline) */}
            <div className="absolute bottom-[12%] left-[3%]">
              <div className="rounded-full" style={{ width: 14, height: 16, background: c6, opacity: 0.85 }} />
              <div className="mx-auto mt-0.5 rounded-sm" style={{ width: 2, height: 6, background: c6, opacity: 0.85 }} />
            </div>
            <div className="absolute bottom-[12%] right-[18%]">
              <div className="rounded-full" style={{ width: 12, height: 14, background: c6, opacity: 0.85 }} />
              <div className="mx-auto mt-0.5 rounded-sm" style={{ width: 2, height: 5, background: c6, opacity: 0.85 }} />
            </div>
            {/* Reflejo calle húmedo */}
            <div className="absolute bottom-[1%] left-[20%] w-[48%] h-2 rounded-sm opacity-50 pointer-events-none" style={{ background: `linear-gradient(180deg, ${c2}18, transparent)`, filter: 'blur(2px)' }} />
            {/* Billboard: barra superior + postes */}
            <div className="absolute bottom-[9%] left-[16%] w-[56%] z-[5]">
              <div className="absolute bottom-full left-[3%] right-[3%] h-1.5 rounded-t-sm" style={{ background: c6, opacity: 0.4 }} />
              <div className="absolute bottom-full left-[12%] w-2 h-1.5 rounded-t" style={{ background: c2, opacity: 0.3 }} />
              <div className="absolute bottom-full left-[44%] w-2 h-1.5 rounded-t" style={{ background: c2, opacity: 0.3 }} />
              <div className="absolute bottom-full right-[12%] w-2 h-1.5 rounded-t" style={{ background: c2, opacity: 0.3 }} />
              <div className="relative w-full rounded overflow-hidden" style={{ aspectRatio: 2.1, background: c1, boxShadow: `0 4px 30px ${c6}80`, border: `2px solid ${c6}` }}>
                <div className="absolute inset-0" style={{ background: `linear-gradient(155deg, ${c1} 0%, ${c1} 50%, ${c4} 100%)` }} />
                {/* Haces de luz en cono — opacidad 25% → 0%, llegan bastante más abajo */}
                <div className="absolute top-0 left-[12%] w-[18%] h-[92%] -translate-x-1/2 pointer-events-none z-0" style={{ clipPath: 'polygon(50% 0, 0 100%, 100% 100%)', background: `linear-gradient(180deg, ${c5}40, transparent)`, filter: 'blur(2px)' }} />
                <div className="absolute top-0 left-[44%] w-[22%] h-[95%] -translate-x-1/2 pointer-events-none z-0" style={{ clipPath: 'polygon(50% 0, 0 100%, 100% 100%)', background: `linear-gradient(180deg, ${c5}40, transparent)`, filter: 'blur(2px)' }} />
                <div className="absolute top-0 left-[88%] w-[18%] h-[92%] -translate-x-1/2 pointer-events-none z-0" style={{ clipPath: 'polygon(50% 0, 0 100%, 100% 100%)', background: `linear-gradient(180deg, ${c5}40, transparent)`, filter: 'blur(2px)' }} />
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `repeating-linear-gradient(85deg, transparent, transparent 12px, ${c2} 12px, ${c2} 13px)` }} />
                <div className="absolute inset-0 pointer-events-none opacity-[0.1]" style={{ backgroundImage: `repeating-linear-gradient(82deg, transparent 0px, transparent 18px, ${c5} 18px, ${c5} 19px)`, zIndex: 1 }} />
                {/* Segunda "a" y "a" principal — tamaño reducido, un poco más abajo */}
                <span className="absolute left-[48%] -translate-x-1/2 -translate-y-1/2" style={{ top: '52%', ...FONT_SERIF, fontSize: 72, color: c2, opacity: 0.12, textTransform: 'lowercase', lineHeight: 0.75 }}>a</span>
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: '54%', ...FONT_SERIF, fontSize: 72, color: c5, opacity: 0.2, textTransform: 'lowercase', lineHeight: 0.75 }}>a</span>
                <div className="absolute top-[45%] left-[40%] -translate-x-1/2 -translate-y-1/2 w-[65%] aspect-square rounded-full" style={{ background: `radial-gradient(circle, ${c2}35, transparent 50%)` }} />
                {/* Hojas y granos — bordes c3/c5 para contrastar con fondo c1/c4 */}
                <div className="absolute top-[4%] left-[1%] w-3 h-4 opacity-[0.35] pointer-events-none" style={{ border: `1px solid ${c3}`, borderRadius: '50% 2px 50% 2px', transform: 'rotate(-22deg)' }} />
                <div className="absolute top-[18%] left-[30%] w-2.5 h-3 opacity-[0.3] pointer-events-none" style={{ border: `1px solid ${c3}`, borderRadius: '50% 2px 50% 2px', transform: 'rotate(25deg)' }} />
                <div className="absolute top-[15%] left-[20%] w-2 h-2.5 rounded-full opacity-[0.35] pointer-events-none" style={{ border: `1px solid ${c5}`, transform: 'rotate(20deg)' }} />
                <div className="absolute bottom-[25%] left-[32%] w-1.5 h-2 rounded-full opacity-[0.3] pointer-events-none" style={{ border: `1px solid ${c5}`, transform: 'rotate(-30deg)' }} />
                <div className="absolute top-[35%] left-[15%] w-1 h-1.5 rounded-full opacity-[0.28] pointer-events-none" style={{ border: `1px solid ${c5}`, transform: 'rotate(45deg)' }} />
                {/* Cup — sin vapor; forma más de taza (menos cuadrada) */}
                <div className="absolute bottom-[-4%] left-[5%] w-[35%] z-[4]">
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-[130%] h-2 rounded-full opacity-60" style={{ background: c6, filter: 'blur(4px)' }} />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-1.5 rounded-full" style={{ background: `linear-gradient(180deg, ${c3}, ${c6})`, opacity: 0.45 }} />
                  <div className="w-full relative overflow-hidden" style={{ aspectRatio: 0.92, background: `linear-gradient(170deg, ${c5}, ${c3})`, borderRadius: '14px 14px 20px 20px' }}>
                    <div className="absolute top-0 left-0 right-0 h-[5.5%]" style={{ background: `linear-gradient(180deg, ${c5}, ${c3})`, borderRadius: '12px 12px 0 0' }} />
                    <div className="absolute top-[1%] left-[8%] right-[8%] h-[13%] rounded-full" style={{ background: c6, opacity: 0.5 }} />
                    <div className="absolute top-[3.5%] left-[12%] right-[12%] h-[8%] rounded-full" style={{ background: `radial-gradient(ellipse at 45% 40%, ${c2}, ${c6})`, opacity: 0.6 }} />
                    <div className="absolute top-[4%] left-1/2 -translate-x-1/2 w-[40%] aspect-square pointer-events-none">
                      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-px h-[55%]" style={{ background: c5, opacity: 0.35 }} />
                      <div className="absolute top-[5%] left-[12%] w-[30%] h-[38%] border rounded-[50%_2px_50%_2px]" style={{ borderColor: `${c5}66`, transform: 'rotate(-20deg)' }} />
                      <div className="absolute top-[5%] right-[12%] w-[30%] h-[38%] border rounded-[50%_2px_50%_2px]" style={{ borderColor: `${c5}66`, transform: 'rotate(20deg)' }} />
                    </div>
                    <div className="absolute top-[28%] left-0 right-0 h-[24%] flex items-center justify-center" style={{ background: c1 }}>
                      <span style={{ ...AURA_LOWERCASE, fontSize: 11, letterSpacing: '0.3em', color: c5, opacity: 0.82 }}>aura</span>
                    </div>
                    <div className="absolute top-[6%] left-[6%] w-[10%] h-[42%] rounded-sm pointer-events-none" style={{ background: `linear-gradient(180deg, ${c5}40, transparent)`, transform: 'skewX(-2deg)' }} />
                  </div>
                </div>
                {/* Typo slow brew — más grande, más abajo y un poco más a la izquierda */}
                <div className="absolute z-[5] flex flex-col items-end" style={{ top: '18%', right: '8%' }}>
                  <span style={{ ...FONT_SERIF, fontSize: 48, color: c5, letterSpacing: '0.18em', textTransform: 'lowercase', opacity: 0.85, lineHeight: 0.82 }}>slow</span>
                  <span style={{ ...FONT_CURSIVE, fontSize: 58, color: cA2, lineHeight: 0.7, opacity: 0.78 }}>brew</span>
                  <span style={{ ...FONT_MONO, fontSize: 12, letterSpacing: '0.6em', textTransform: 'uppercase', color: c5, opacity: 0.85, marginTop: 4 }}>coffee</span>
                </div>
              </div>
              <div className="absolute top-full left-[8%] right-[8%] h-3 rounded-full -translate-y-1/2 opacity-[0.04]" style={{ background: `linear-gradient(180deg, ${c5}, transparent)`, filter: 'blur(3px)' }} />
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[22%] flex justify-between">
                <div className="w-1 h-5 rounded-b" style={{ background: c6, opacity: 0.3 }} />
                <div className="w-1 h-5 rounded-b" style={{ background: c6, opacity: 0.3 }} />
              </div>
            </div>
            {/* Siluetas — c3 (claros) sobre calle oscura c6 para que se vean */}
            <div className="absolute bottom-[0.5%] left-[6%] z-[6] opacity-[0.2]">
              <div className="rounded-full w-2 h-2" style={{ background: c3 }} />
              <div className="w-2.5 h-4 rounded-t mt-0.5" style={{ background: c3 }} />
            </div>
            <div className="absolute bottom-[0.5%] left-[12%] z-[6] opacity-[0.2]">
              <div className="rounded-full w-1.5 h-1.5" style={{ background: c3 }} />
              <div className="w-2 h-3 rounded-t mt-0.5" style={{ background: c3 }} />
            </div>
            <div className="absolute bottom-[0.5%] right-[5%] z-[6] opacity-[0.2]">
              <div className="relative w-6 h-2 rounded-sm" style={{ background: c3 }}>
                <div className="absolute bottom-full left-[18%] right-[18%] h-[50%] rounded-t-sm" style={{ background: c3, opacity: 0.9 }} />
                <div className="absolute -bottom-0.5 left-[12%] w-1 h-1 rounded-full" style={{ background: c3, opacity: 0.9 }} />
                <div className="absolute -bottom-0.5 right-[12%] w-1 h-1 rounded-full" style={{ background: c3, opacity: 0.9 }} />
                <div className="absolute top-[30%] right-0 w-1 h-1 rounded-full" style={{ background: c2, opacity: 0.4 }} />
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 44% 36%, transparent 20%, ${c1}99 100%)` }} />
            <div className="absolute bottom-1 left-2 flex items-center gap-1 z-10">
              <div className="rounded-full w-1.5 h-1.5" style={{ background: c2, opacity: 0.5 }} />
              <span style={{ ...FONT_MONO, fontSize: 6, letterSpacing: '0.12em', textTransform: 'uppercase', color: c5, opacity: 0.4 }}>Billboard — Night Urban</span>
            </div>
          </div>

          {/* Format grid — 3 columns: contraste, riqueza y legibilidad */}
          <div className="absolute z-[20]" style={{ top: py(40), left: px(5), right: px(5) }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div style={{ width: 22, height: 2.5, background: c4, borderRadius: 1 }} />
              <span style={{ ...FONT_MONO, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: c6, opacity: 0.92 }}>Campaign Formats</span>
            </div>
            <div className="flex items-end justify-center gap-3" style={{ gap: 12 }}>
              {FORMAT_ITEMS.map((item, i) => (
                <div key={item.name} className="flex flex-col gap-1.5">
                  <div
                    className="rounded overflow-hidden relative shrink-0"
                    style={{
                      width: formatCardHeight * FORMAT_ASPECTS[i],
                      height: formatCardHeight,
                      background: i === 0 ? c3 : c1,
                      border: `1px solid ${c6}50`,
                      boxShadow: `0 2px 8px ${c6}25`,
                    }}
                  >
                    <div className="absolute inset-0" style={{ background: i === 0 ? `linear-gradient(160deg, ${c3} 0%, ${c5}22 100%)` : i === 1 ? `linear-gradient(175deg, ${c1} 0%, ${c1} 35%, ${c4}18 100%)` : `linear-gradient(180deg, ${c1} 0%, ${c1} 40%, ${c4}28 100%)` }} />
                    {i !== 0 && <div className="absolute inset-0 pointer-events-none" style={fadeOverlayStyle} />}
                    {/* Format 1 — Magazine: doble "sip.", granos, taza, página */}
                    {i === 0 && (
                      <>
                        <div className="absolute inset-[6%] rounded-sm overflow-hidden" style={{ background: c5, boxShadow: `1px 2px 8px ${c6}30` }}>
                          <div className="absolute inset-0" style={{ background: `linear-gradient(170deg, ${c1} 0%, ${c1} 45%, ${c4}15 100%)` }} />
                          <div className="absolute inset-0 pointer-events-none" style={fadeOverlayStyle} />
                          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ ...FONT_SERIF, fontSize: 78, color: c5, letterSpacing: '0.12em', textTransform: 'lowercase', opacity: 0.14, lineHeight: 0.8 }}>sip.</span>
                          <span className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ ...FONT_CURSIVE, fontSize: 56, color: cA2, opacity: 0.78 }}>sip.</span>
                          <div className="absolute top-[28%] right-[20%] w-1.5 h-2 rounded-full border pointer-events-none" style={{ borderColor: c2, opacity: 0.2, transform: 'rotate(15deg)' }} />
                          <div className="absolute top-[32%] right-[14%] w-1 h-1.5 rounded-full border pointer-events-none" style={{ borderColor: c2, opacity: 0.15, transform: 'rotate(-20deg)' }} />
                          <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[32%]" style={{ aspectRatio: 0.85 }}>
                            <div className="absolute bottom-0 inset-x-0 rounded-b-sm" style={{ height: '92%', background: `linear-gradient(175deg, ${c5}, ${c3})`, borderRadius: '2px 2px 6px 6px', border: `1px solid ${c6}30` }} />
                            <div className="absolute top-0 left-0 right-0 h-[12%] rounded-t-sm" style={{ background: c1 }} />
                            <div className="absolute top-[30%] left-0 right-0 h-[22%] flex items-center justify-center" style={{ background: c1 }}>
                              <span style={{ ...AURA_LOWERCASE, fontSize: 10, letterSpacing: '0.2em', color: c5, opacity: 0.9 }}>aura</span>
                            </div>
                          </div>
                          <div className="absolute top-0 left-1/2 w-px h-full" style={{ background: c6, opacity: 0.06 }} />
                        </div>
                      </>
                    )}
                    {/* Format 2 — Street Poster: "slow" apilado + "brew" + taza + logo */}
                    {i === 1 && (
                      <>
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0 pointer-events-none">
                          <span style={{ ...FONT_SERIF, fontSize: 42, letterSpacing: '0.2em', textTransform: 'lowercase', color: c5, opacity: 0.06, lineHeight: 0.85 }}>slow</span>
                          <span style={{ ...FONT_SERIF, fontSize: 42, letterSpacing: '0.2em', textTransform: 'lowercase', color: c5, opacity: 0.12, lineHeight: 0.85 }}>slow</span>
                          <span style={{ ...FONT_SERIF, fontSize: 42, letterSpacing: '0.2em', textTransform: 'lowercase', color: c5, opacity: 0.22, lineHeight: 0.85 }}>slow</span>
                          <span style={{ ...FONT_CURSIVE, fontSize: 64, color: cA2, opacity: 0.78, lineHeight: 0.75 }}>brew</span>
                          <span style={{ ...FONT_SERIF, fontSize: 42, letterSpacing: '0.2em', textTransform: 'lowercase', color: c5, opacity: 0.1, lineHeight: 0.85 }}>slow</span>
                          <span style={{ ...FONT_SERIF, fontSize: 42, letterSpacing: '0.2em', textTransform: 'lowercase', color: c5, opacity: 0.06, lineHeight: 0.85 }}>slow</span>
                        </div>
                        <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[28%]" style={{ aspectRatio: 0.8 }}>
                          <div className="absolute inset-0 rounded-b-sm" style={{ background: `linear-gradient(175deg, ${c5}, ${c3})`, borderRadius: '2px 2px 5px 5px', boxShadow: `0 3px 10px ${c6}40`, border: `1px solid ${c6}25` }} />
                          <div className="absolute top-[28%] left-0 right-0 h-[24%] flex items-center justify-center" style={{ background: c1 }}>
                            <span style={{ ...AURA_LOWERCASE, fontSize: 9, letterSpacing: '0.15em', color: c5, opacity: 0.88 }}>aura</span>
                          </div>
                        </div>
                      </>
                    )}
                    {/* Format 3 — IG Story: barras UI, your/m(o)rning/ritual, granos, bolsa, CTA */}
                    {i === 2 && (
                      <>
                        <div className="absolute top-0 left-0 right-0 flex gap-0.5 px-1 pt-1 z-[2]" style={{ paddingTop: 4 }}>
                          <div className="flex-1 h-0.5 rounded-full" style={{ background: c5, opacity: 0.2 }} />
                          <div className="flex-1 h-0.5 rounded-full" style={{ background: c5, opacity: 0.08 }} />
                          <div className="flex-1 h-0.5 rounded-full" style={{ background: c5, opacity: 0.08 }} />
                        </div>
                        <div className="absolute top-[6%] left-0 right-0 flex flex-col items-center text-center gap-0 z-[2]">
                          <span style={{ ...FONT_CURSIVE, fontSize: 64, color: cA2, opacity: 0.78, lineHeight: 0.75 }}>your</span>
                          <div className="flex items-baseline justify-center gap-0.5">
                            <span style={{ ...FONT_SERIF, fontSize: 19, color: c5, letterSpacing: '0.06em', textTransform: 'lowercase', opacity: 0.9 }}>m</span>
                            <div className="relative w-4 h-4 rounded-b flex-shrink-0 overflow-hidden" style={{ background: `linear-gradient(175deg, ${c5}, ${c3})`, borderRadius: '1px 1px 4px 4px', border: `1px solid ${c6}50`, boxShadow: `0 1px 4px ${c6}30` }}>
                              <div className="absolute top-[26%] left-0 right-0 h-[22%] flex items-center justify-center" style={{ background: c1 }}>
                                <span style={{ ...AURA_LOWERCASE, fontSize: 3.5, letterSpacing: '0.1em', color: c2, opacity: 0.7 }}>a</span>
                              </div>
                            </div>
                            <span style={{ ...FONT_SERIF, fontSize: 19, color: c5, letterSpacing: '0.06em', textTransform: 'lowercase', opacity: 0.9 }}>rning</span>
                          </div>
                          <span style={{ ...FONT_CURSIVE, fontSize: 24, color: cA2, opacity: 0.78, lineHeight: 0.75 }}>ritual</span>
                        </div>
                        <div className="absolute top-[18%] left-[10%] w-1 h-1.5 rounded-full border pointer-events-none" style={{ borderColor: c2, opacity: 0.12, transform: 'rotate(20deg)' }} />
                        <div className="absolute bottom-[38%] right-[8%] w-1.5 h-2 rounded-full border pointer-events-none" style={{ borderColor: c2, opacity: 0.1, transform: 'rotate(-25deg)' }} />
                        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[38%] z-[2]" style={{ aspectRatio: 0.5 }}>
                          <div className="absolute inset-0 rounded-sm" style={{ background: `linear-gradient(175deg, ${c3}, ${c5}99)`, border: `1px solid ${c6}35`, boxShadow: `2px 3px 8px ${c6}35` }} />
                          <div className="absolute top-0 left-0 right-0 h-[14%] rounded-t-sm" style={{ background: c6, opacity: 0.12 }} />
                          <div className="absolute top-[18%] left-[8%] right-[8%] bottom-[12%] rounded border flex flex-col items-center justify-center gap-0.5" style={{ borderColor: `${c1}60` }}>
                            <span style={{ ...AURA_LOWERCASE, fontSize: 9, letterSpacing: '0.2em', color: c1 }}>aura</span>
                            <div className="w-2 h-px" style={{ background: c1, opacity: 0.2 }} />
                            <span style={{ ...FONT_CURSIVE, fontSize: 7, color: c6, opacity: 0.88 }}>single origin</span>
                          </div>
                        </div>
                        <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 z-[2]">
                          <span style={{ ...AURA_LOWERCASE, fontSize: 7, letterSpacing: '0.25em', color: c2, opacity: 0.25 }}>aura</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c4, opacity: 0.7 }} />
                    <span style={{ ...FONT_SERIF, fontStyle: 'italic', fontSize: 9, color: c1, letterSpacing: '0.04em' }}>{item.name}</span>
                  </div>
                  <div style={{ ...FONT_MONO, fontSize: 6.5, color: c6, opacity: 0.78, lineHeight: 1.45 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Specs — 3 cards */}
          <div className="absolute z-[20]" style={{ top: py(79), left: px(5), right: px(5) }}>
            <div className="flex items-center gap-2 mb-1">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={{ ...FONT_MONO, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: c6 }}>Campaign Specs</span>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {SPEC_CARDS.map((spec) => (
                <div key={spec.title} className="rounded-lg overflow-hidden relative" style={{ background: c1, padding: '10px 14px' }}>
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${c2}, ${c4})`, opacity: 0.5 }} />
                  <div style={{ ...FONT_SERIF, fontSize: 13, color: c5, letterSpacing: '0.04em', marginBottom: 8, position: 'relative', zIndex: 1 }}>{spec.title}</div>
                  <div className="flex flex-col gap-0.5 relative z-[1]">
                    {spec.items.map((v, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full shrink-0" style={{ background: c5, opacity: 0.6 }} />
                        <span style={{ ...FONT_MONO, fontSize: 8, color: c5, opacity: 0.92 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Watermark */}
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

export const Publicidad = memo(PublicidadInner);
