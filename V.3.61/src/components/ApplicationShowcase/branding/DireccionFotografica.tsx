import type { PosterPalette } from '../types';
import {
  POSTER_BASE_WIDTH,
  POSTER_HEIGHT,
  POSTER_SCALE,
  BRANDING_GRAIN_URL,
  BRANDING_KRAFT_URL,
} from '../constants';
import { FONT_SANS, FONT_SERIF, FONT_CURSIVE, FONT_MONO, AURA_LOWERCASE } from './brandingFonts';

/** Grano overlay para fotos (id distinto al del poster para evitar conflictos en SVG). */
const PHOTO_GRAIN_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)'/%3E%3C/svg%3E";

/** Items del grid de 4 fotos (Portrait, Detail, Mood, Texture). */
const PHOTO_GRID_ITEMS = [
  { name: 'Portrait', desc: 'Natural light, soft tones, authentic moments', type: 'portrait' as const },
  { name: 'Detail', desc: 'Close-up craft, latte art, handmade process', type: 'detail' as const },
  { name: 'Mood', desc: 'Warm interiors, golden hour, slow living', type: 'mood' as const },
  { name: 'Texture', desc: 'Raw materials, beans, organic surfaces', type: 'texture' as const },
];

/** Posiciones y rotación de los granos en el panel Texture. */
const TEXTURE_BEANS: { left: number; top: number; w: number; h: number; rot: number }[] = [
  { left: 5, top: 6, w: 9, h: 13, rot: -25 },
  { left: 18, top: 12, w: 8, h: 12, rot: 40 },
  { left: 32, top: 8, w: 10, h: 14, rot: -55 },
  { left: 48, top: 14, w: 9, h: 13, rot: 15 },
  { left: 62, top: 6, w: 8, h: 11, rot: -40 },
  { left: 78, top: 10, w: 9, h: 12, rot: 65 },
  { left: 88, top: 18, w: 8, h: 12, rot: -20 },
  { left: 8, top: 28, w: 9, h: 13, rot: 70 },
  { left: 22, top: 32, w: 10, h: 14, rot: -15 },
  { left: 38, top: 26, w: 8, h: 12, rot: 50 },
  { left: 55, top: 30, w: 9, h: 13, rot: -35 },
  { left: 72, top: 28, w: 8, h: 11, rot: 25 },
  { left: 85, top: 34, w: 9, h: 12, rot: -50 },
  { left: 12, top: 48, w: 8, h: 12, rot: -30 },
  { left: 28, top: 52, w: 10, h: 14, rot: 45 },
  { left: 45, top: 50, w: 9, h: 13, rot: -60 },
  { left: 65, top: 48, w: 8, h: 11, rot: 20 },
  { left: 80, top: 54, w: 9, h: 12, rot: -45 },
  { left: 15, top: 68, w: 9, h: 13, rot: 35 },
  { left: 42, top: 72, w: 8, h: 12, rot: -25 },
  { left: 68, top: 70, w: 10, h: 14, rot: 55 },
];

interface Props {
  posterColors: PosterPalette;
}

export function DireccionFotografica({ posterColors }: Props) {
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

  return (
    <div className="flex items-center justify-center w-full h-full min-h-0">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div className="relative overflow-hidden shadow-2xl rounded" style={{ width: w, height: h, background: c5, ...FONT_SANS }}>
          {/* Texturas globales */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 300, opacity: 0.22, mixBlendMode: 'multiply', backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '128px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.03, backgroundImage: `url("${BRANDING_KRAFT_URL}")`, backgroundSize: '200px' }} />

          {/* Header bar */}
          <div className="absolute top-0 left-0 right-0 z-[1]" style={{ height: '8%', background: c1 }}>
            <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: `linear-gradient(90deg, ${c2}, ${c4}, ${c2})`, opacity: 0.5 }} />
          </div>

          {/* Esquinas */}
          {[
            { pos: 'tl', top: py(1.5), left: px(2) },
            { pos: 'tr', top: py(1.5), right: px(2) },
            { pos: 'bl', bottom: py(5), left: px(2) },
            { pos: 'br', bottom: py(5), right: px(2) },
          ].map(({ pos, ...place }) => (
            <div key={pos} className="absolute z-[60] opacity-[0.12]" style={{ width: 14, height: 14, ...place }}>
              <div className="absolute top-0 left-0 w-full h-px" style={{ background: c6 }} />
              <div className="absolute top-0 left-0 w-px h-full" style={{ background: c6 }} />
            </div>
          ))}

          {/* Logo aura (mismo que Territorio visual: gráfico + texto, reordenado horizontal) */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[50] flex items-center justify-center" style={{ top: 0, height: '8%', width: '100%' }}>
            <div className="flex flex-row items-center gap-4" style={{ transform: 'translate(-18px, 0) scale(1.1)', transformOrigin: 'center center' }}>
              {/* Gráfico: taza + hoja (ligeramente arriba y a la derecha para alinear con el texto) */}
              <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 52, height: 52, transform: 'translate(22px, -6px)' }}>
                <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[52%] h-[38%] rounded-b-[40%]" style={{ borderLeft: `3px solid ${c5}`, borderRight: `3px solid ${c5}`, borderBottom: `3px solid ${c5}`, opacity: 0.72 }} />
                <div className="absolute left-1/2 -translate-x-1/2 w-[28%] rounded-full" style={{ bottom: '13%', height: 3, background: c5, opacity: 0.72 }} />
                <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -rotate-[8deg] w-[28%] h-[38%] border rounded-[50%_2px_50%_2px]" style={{ borderColor: c4, borderWidth: 3 }} />
              </div>
              {/* Texto: aura + slow brew coffe */}
              <div className="flex flex-col items-start justify-center">
                <div className="font-serif lowercase leading-none" style={{ ...AURA_LOWERCASE, color: c5, fontSize: 18, letterSpacing: '0.2em' }}>aura</div>
                <div className="font-cursive" style={{ ...FONT_CURSIVE, color: c5, fontSize: 9, letterSpacing: '0.1em', marginTop: -1, opacity: 0.9 }}>slow brew coffe</div>
              </div>
            </div>
          </div>

          {/* Hero photo */}
          <div className="absolute z-[20] rounded overflow-hidden" style={{ top: py(11.5), left: px(5), right: px(5), height: py(25) }}>
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c4}22 0%, ${c3}44 40%, ${c2}33 70%, ${c1}88 100%)` }} />
            <div className="absolute left-0 right-0" style={{ top: '58%', height: 1, background: c2, opacity: 0.3 }} />
            <div className="absolute bottom-0 left-0 right-0" style={{ height: '45%', background: c1, clipPath: 'polygon(0% 60%,8% 45%,18% 55%,28% 30%,38% 42%,48% 20%,58% 35%,68% 15%,78% 38%,88% 28%,100% 50%,100% 100%,0% 100%)' }} />
            <div className="absolute rounded-full" style={{ top: '22%', left: '25%', width: '12%', aspectRatio: 1, background: c2, opacity: 0.2, filter: 'blur(1px)' }} />
            <div className="absolute" style={{ top: '60%', left: '20%', right: '20%', height: '15%', background: `linear-gradient(180deg, ${c2}15, transparent)` }} />
            {/* Rama decorativa */}
            <div className="absolute" style={{ top: '15%', right: '12%', width: '35%', height: '50%' }}>
              <div className="absolute top-0 left-1/2 w-px h-full" style={{ background: c4, opacity: 0.25, transform: 'rotate(15deg)', transformOrigin: 'top center' }} />
              {[{ t: 20, l: 58, r: -25 }, { t: 35, l: 28, r: 25 }, { t: 50, l: 58, r: -25 }, { t: 65, l: 28, r: 25 }].map((leaf, i) => (
                <div key={i} className="absolute border rounded-[50%_2px_50%_2px]" style={{ top: `${leaf.t}%`, left: `${leaf.l}%`, width: '18%', height: '14%', borderColor: c4, opacity: 0.15, transform: `rotate(${leaf.r}deg)` }} />
              ))}
            </div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)' }} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: `url("${PHOTO_GRAIN_URL}")`, backgroundSize: '80px' }} />
            <div className="absolute border rounded-sm" style={{ top: '15%', left: '18%', width: '30%', height: '55%', borderColor: c5, opacity: 0.12 }} />
            <div className="absolute flex items-center gap-1.5" style={{ bottom: 8, left: 10 }}>
              <div className="rounded-full" style={{ width: 5, height: 5, background: c2, opacity: 0.6 }} />
              <span style={{ ...FONT_MONO, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: c5, opacity: 0.7 }}>Hero — Landscape & Origin</span>
            </div>
            <div className="absolute" style={{ top: 8, right: 10, ...FONT_MONO, fontSize: 9, color: c5, opacity: 0.4 }}>01</div>
          </div>

          {/* Photo grid — 4 fotos */}
          <div className="absolute z-[20] grid gap-2" style={{ top: py(38), left: px(5), right: px(5), gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {PHOTO_GRID_ITEMS.map((item) => (
              <div key={item.type} className="flex flex-col gap-1">
                <div className="w-full rounded-sm overflow-hidden relative" style={{ aspectRatio: 0.78, background: item.type === 'portrait' ? c3 : item.type === 'detail' || item.type === 'mood' ? c1 : c3 }}>
                  {item.type === 'portrait' && (
                    <>
                      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c3}, ${c2}22)` }} />
                      {/* Óvalo de luz en esquina superior izquierda (brillo tipo ventana) */}
                      <div className="absolute rounded-full pointer-events-none" style={{ top: '-8%', left: '-12%', width: '55%', height: '50%', background: `radial-gradient(ellipse 70% 60% at 40% 40%, ${c5}CC, ${c5}40 50%, transparent 75%)` }} />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ width: '55%', height: '85%' }}>
                        <div className="rounded-full" style={{ width: '32%', aspectRatio: 1, background: c1, opacity: 0.75 }} />
                        <div style={{ width: '12%', height: '6%', background: c1, opacity: 0.7 }} />
                        {/* Cuerpo: forma campana / U invertida, lados más rectos */}
                        <div className="flex-1 w-full relative" style={{ background: c1, opacity: 0.65, clipPath: 'polygon(8% 0%, 92% 0%, 100% 6%, 100% 100%, 0% 100%, 0% 6%)', borderBottomLeftRadius: '40%', borderBottomRightRadius: '40%' }}>
                          {/* Ventana/bolsillo en el costado derecho a mitad del torso: degradado más claro a la izquierda, fundido a la derecha */}
                          <div className="absolute rounded-sm overflow-hidden" style={{ top: '28%', right: '8%', width: '22%', height: '28%' }}>
                            <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${c5}99 0%, ${c3}66 35%, ${c2}22 70%, transparent 100%)` }} />
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 bottom-0 w-[38%]" style={{ background: `linear-gradient(270deg, ${c2}15, transparent)` }} />
                    </>
                  )}
                  {item.type === 'detail' && (
                    <>
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border" style={{ width: '82%', aspectRatio: 1, borderColor: c2, opacity: 0.15 }} />
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2" style={{ width: '70%', aspectRatio: 1, borderColor: c2, opacity: 0.5 }} />
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: '58%', aspectRatio: 1, background: `radial-gradient(circle, ${c6}44 0%, ${c2}33 50%, ${c1} 100%)` }} />
                      <div className="absolute left-1/2 top-[46%] -translate-x-1/2 rounded-full" style={{ width: '22%', height: '18%', background: c3, opacity: 0.25, transform: 'rotate(-10deg)' }} />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px" style={{ height: '80%', background: c3, opacity: 0.3 }} />
                    </>
                  )}
                  {item.type === 'mood' && (
                    <>
                      {/* Fondo más oscuro para mayor contraste con líneas y ventana */}
                      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c4}55 50%, ${c1}99 100%)` }} />
                      {/* Línea horizontal = superficie / mesa (más contraste) */}
                      <div className="absolute left-0 right-0 h-px" style={{ bottom: '22%', background: c3, opacity: 0.5 }} />
                      {/* Top-left: lámparas colgantes — tallo desde el borde superior del panel hasta el círculo */}
                      <div className="absolute" style={{ top: 0, left: '10%', width: '14%', height: '28%' }}>
                        <div className="absolute left-1/2 -translate-x-1/2 w-px" style={{ top: 0, height: '100%', background: c3, opacity: 0.48 }} />
                        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 rounded-full border" style={{ width: '70%', aspectRatio: 1, borderColor: c3, borderWidth: 1.5, opacity: 0.5 }} />
                      </div>
                      <div className="absolute" style={{ top: 0, left: '22%', width: '14%', height: '32%' }}>
                        <div className="absolute left-1/2 -translate-x-1/2 w-px" style={{ top: 0, height: '100%', background: c3, opacity: 0.48 }} />
                        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 rounded-full border" style={{ width: '60%', aspectRatio: 1, borderColor: c3, borderWidth: 1.5, opacity: 0.5 }} />
                      </div>
                      {/* Ventana: marco con brillo muy visible (más contraste) */}
                      <div className="absolute rounded-sm overflow-hidden border" style={{ top: '8%', right: '10%', width: '32%', height: '48%', borderColor: c3, borderWidth: 1.5, opacity: 0.5 }}>
                        <div className="absolute inset-0 rounded-sm" style={{ background: `linear-gradient(180deg, ${c5}E6 0%, ${c5}99 20%, ${c3}55 45%, ${c3}22 70%, transparent 100%)` }} />
                      </div>
                      <div className="absolute w-px" style={{ top: '8%', bottom: '44%', left: '74%', background: c3, opacity: 0.4 }} />
                      <div className="absolute h-px" style={{ top: '32%', left: '58%', right: '10%', background: c3, opacity: 0.4 }} />
                      {/* Bottom-left: taza (U) sobre la mesa */}
                      <div className="absolute border border-t-0 rounded-b" style={{ bottom: '22%', left: '18%', width: '14%', height: '12%', borderColor: c3, borderWidth: 1.5, opacity: 0.5, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }} />
                      {/* Bottom-right: jarrón sobre la mesa */}
                      <div className="absolute border rounded-b" style={{ bottom: '22%', right: '18%', width: '8%', height: '18%', borderColor: c3, borderWidth: 1.5, opacity: 0.48, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }} />
                    </>
                  )}
                  {item.type === 'texture' && (
                    <>
                      <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${c6}44, ${c2}33, ${c1}22)` }} />
                      {TEXTURE_BEANS.map((b, i) => (
                        <div key={i} className="absolute rounded-full" style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.w}%`, height: `${b.h}%`, background: c1, opacity: 0.14 + (i % 5) * 0.03, transform: `rotate(${b.rot}deg)` }}>
                          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-px" style={{ height: '60%', background: c3, opacity: 0.3, borderRadius: 1 }} />
                        </div>
                      ))}
                      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `repeating-linear-gradient(0deg, ${c1} 0px, ${c1} 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, ${c1} 0px, ${c1} 1px, transparent 1px, transparent 4px)` }} />
                    </>
                  )}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: `url("${PHOTO_GRAIN_URL}")`, backgroundSize: '80px' }} />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.25) 100%)' }} />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="rounded-full flex-shrink-0 border-[1.5px]" style={{ width: 5, height: 5, borderColor: c2, opacity: 0.5 }} />
                  <span style={{ ...FONT_SERIF, fontStyle: 'italic', fontSize: 12, color: c1, letterSpacing: '0.05em' }}>{item.name}</span>
                </div>
                <div style={{ ...FONT_MONO, fontSize: 9, color: c6, opacity: 0.6, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Style Direction — 3 tarjetas */}
          <div className="absolute z-[60]" style={{ top: py(67), left: px(5), right: px(5) }}>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={{ ...FONT_MONO, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: c6 }}>Style Direction</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {[
                { title: 'Lighting', icon: 'light', items: ['Golden hour warmth', 'Soft directional light', 'Window-lit naturals', 'Avoid harsh flash'] },
                { title: 'Color Mood', icon: 'color', items: ['Earthy, warm palette', 'Desaturated greens', 'Caramel highlights', 'Rich deep shadows'] },
                { title: 'Composition', icon: 'comp', items: ['Rule of thirds', 'Generous neg. space', 'Depth & layering', 'Off-center focal point'] },
              ].map((card) => (
                <div key={card.title} className="rounded-lg overflow-hidden relative" style={{ background: c1, padding: '12px 14px' }}>
                  <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none" style={{ background: `linear-gradient(180deg, ${c4}10, transparent)` }} />
                  <div className="flex items-center gap-2 mb-2 relative z-[1]">
                    {card.icon === 'light' && <div className="rounded-full flex-shrink-0" style={{ width: 24, height: 24, background: `radial-gradient(circle at 35% 35%, ${c2}, ${c2}44)`, opacity: 0.5 }} />}
                    {card.icon === 'color' && (
                      <div className="flex gap-0.5 h-6 items-stretch flex-shrink-0">
                        {[c1, c2, c4, c3, c6].map((bg, i) => <div key={i} className="w-1 rounded-sm" style={{ background: bg, opacity: 0.6 }} />)}
                      </div>
                    )}
                    {card.icon === 'comp' && (
                      <div className="relative flex-shrink-0 border rounded" style={{ width: 24, height: 24, borderColor: c5, opacity: 0.25 }}>
                        <div className="absolute top-0 bottom-0 left-1/3 w-px" style={{ background: c5 }} />
                        <div className="absolute top-0 bottom-0 left-2/3 w-px" style={{ background: c5 }} />
                        <div className="absolute left-0 right-0 top-1/3 h-px" style={{ background: c5 }} />
                        <div className="absolute left-0 right-0 top-2/3 h-px" style={{ background: c5 }} />
                        <div className="absolute rounded-full" style={{ top: '28%', left: '28%', width: 5, height: 5, background: c2, opacity: 0.8 }} />
                      </div>
                    )}
                    <span style={{ ...FONT_SERIF, fontSize: 13, color: c5, letterSpacing: '0.04em' }}>{card.title}</span>
                  </div>
                  <div className="w-full h-px mb-2 relative z-[1]" style={{ background: `linear-gradient(90deg, ${c2}44, transparent)` }} />
                  <div className="flex flex-col gap-1 relative z-[1]">
                    {card.items.map((text, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="rounded-full flex-shrink-0" style={{ width: 4, height: 4, background: c2, opacity: i === 3 && card.icon === 'light' ? 0.7 : 0.4 }} />
                        <span style={{ ...FONT_MONO, fontSize: 9, color: c3, opacity: 0.7, letterSpacing: '0.03em' }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row — product photo + notes */}
          <div className="absolute z-[20] grid gap-3 items-start" style={{ top: py(87), left: px(5), right: px(5), gridTemplateColumns: '38% 1fr' }}>
            <div className="rounded-sm overflow-hidden relative" style={{ height: 58, background: c1 }}>
              <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c4}33, ${c1})` }} />
              <div className="absolute left-0 right-0 bottom-[25%] h-px" style={{ background: c2, opacity: 0.12 }} />
              <div className="absolute left-0 right-0 bottom-0 h-[25%]" style={{ background: `linear-gradient(180deg, transparent, ${c1})` }} />
              <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ bottom: '28%', width: '40%', height: '55%' }}>
                <div className="w-full flex-1 flex flex-col items-center justify-center gap-0.5 relative rounded-b" style={{ background: `linear-gradient(170deg, ${c3}cc, ${c3}88)`, borderRadius: '0 0 3px 3px' }}>
                  <div className="absolute top-0 left-0 right-0 h-[12%] rounded-t" style={{ background: c6, opacity: 0.2 }} />
                  <span style={{ ...AURA_LOWERCASE, fontSize: 9, letterSpacing: '0.25em', color: c1, zIndex: 1 }}>aura</span>
                  <div className="w-[30%] h-px" style={{ background: c1, opacity: 0.15 }} />
                  <span style={{ ...FONT_CURSIVE, fontSize: 7, color: c4, opacity: 0.7 }}>single origin</span>
                </div>
              </div>
              <div className="absolute flex items-center gap-1" style={{ bottom: 4, left: 6 }}>
                <div className="rounded-full" style={{ width: 4, height: 4, background: c2, opacity: 0.5 }} />
                <span style={{ ...FONT_MONO, fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', color: c5, opacity: 0.6 }}>Product Shot</span>
              </div>
              <div className="absolute" style={{ top: 4, right: 6, ...FONT_MONO, fontSize: 7, color: c5, opacity: 0.3 }}>06</div>
            </div>
            <div className="flex flex-col gap-1">
              <span style={{ ...FONT_MONO, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: c6 }}>Direction Notes</span>
              <span style={{ ...FONT_MONO, fontSize: 8, color: c6, opacity: 0.6, lineHeight: 1.6 }}>All imagery should evoke warmth, authenticity and the ritual of slow coffee. Prioritize natural textures and human connection over polished studio aesthetics.</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span style={{ ...FONT_CURSIVE, fontSize: 12, color: c4, opacity: 0.5 }}>rooted in nature</span>
                <div className="flex-1 h-px" style={{ background: c3 }} />
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute bottom-[2%] right-[-4%] z-[4] font-serif leading-[0.65] opacity-[0.18] pointer-events-none select-none lowercase" style={{ ...FONT_SERIF, fontSize: 160, color: c3 }}>a</div>

          {/* Footer */}
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
