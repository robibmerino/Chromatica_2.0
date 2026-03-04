import type { ReactNode } from 'react';
import type { PosterPalette } from '../types';
import {
  POSTER_BASE_WIDTH,
  POSTER_HEIGHT,
  POSTER_SCALE,
  BRANDING_GRAIN_URL,
  BRANDING_KRAFT_URL,
} from '../constants';
import { FONT_SANS, FONT_SERIF, FONT_CURSIVE, FONT_MONO, AURA_LOWERCASE } from './brandingFonts';
import { LogoIcon } from './LogoIcon';

const PHOTO_GRAIN_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='ng'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23ng)'/%3E%3C/svg%3E";

const CORNERS = [
  { pos: 'tl' as const, top: 1.5, left: 2 },
  { pos: 'tr' as const, top: 1.5, right: 2 },
  { pos: 'bl' as const, bottom: 5, left: 2 },
  { pos: 'br' as const, bottom: 5, right: 2 },
];

const GRID_ITEMS = [
  { name: 'Business Card', desc: 'Gold foil on 350gsm cotton, blind deboss', type: 'card' as const },
  { name: 'Envelope', desc: 'C5 format, flap seal, recycled stock', type: 'env' as const },
  { name: 'Wax Seal', desc: 'Custom brass stamp, botanical wax blend', type: 'seal' as const },
  { name: 'Folder', desc: 'Presentation folder with elastic closure', type: 'folder' as const },
] as const;

const DIMENSION_ROWS = [
  { label: 'Card', value: '90 × 55 mm' },
  { label: 'Envelope', value: 'C5 — 162 × 229 mm' },
  { label: 'Letterhead', value: 'A4 — 210 × 297 mm' },
  { label: 'Folder', value: 'A4 + 5mm spine' },
];

const PAPER_STOCK_ITEMS = [
  { name: 'Natural White', detail: 'Cotton Wove', weight: '350gsm', bgKey: 'c5' as const },
  { name: 'Warm Ivory', detail: 'Recycled Laid', weight: '120gsm', bgKey: 'c3' as const },
  { name: 'Kraft Natural', detail: 'FSC Uncoated', weight: '280gsm', bgKey: 'c6' as const },
  { name: 'Forest Deep', detail: 'Dyed Through', weight: '300gsm', bgKey: 'c1' as const },
] as const;

const SECTION_TOP = { closeUp: 44.2, technicalSpecs: 72.2 } as const;

interface Props {
  posterColors: PosterPalette;
}

type Colors = { c1: string; c2: string; c3: string; c4: string; c5: string; c6: string };

/** Panel de Technical Specs (Dimensions o Paper & Stock). */
function SpecsPanel({
  title,
  children,
  gradientReversed,
  c,
}: {
  title: string;
  children: ReactNode;
  gradientReversed?: boolean;
  c: Colors;
}) {
  const { c1, c2, c4, c5 } = c;
  return (
    <div className="rounded-lg overflow-hidden relative" style={{ background: c1, padding: '10px 14px' }}>
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: gradientReversed ? `linear-gradient(90deg, ${c4}, ${c2})` : `linear-gradient(90deg, ${c2}, ${c4})`, opacity: 0.5 }} />
      <div className="absolute top-[3px] left-0 right-0 h-1/2" style={{ background: `linear-gradient(180deg, ${c4}, transparent)`, opacity: 0.05 }} />
      <div style={{ ...FONT_SERIF, fontSize: 13, color: c5, letterSpacing: '0.04em', marginBottom: 8, position: 'relative', zIndex: 1 }}>{title}</div>
      {children}
    </div>
  );
}

export function Papeleria({ posterColors }: Props) {
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
  const colors: Colors = { c1, c2, c3, c4, c5, c6 };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-0">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div className="relative overflow-hidden shadow-2xl rounded" style={{ width: w, height: h, background: c5, ...FONT_SANS }}>
          {/* Texturas */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 300, opacity: 0.18, mixBlendMode: 'multiply', backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '128px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.03, backgroundImage: `url("${BRANDING_KRAFT_URL}")`, backgroundSize: '200px' }} />

          {/* Líneas decorativas */}
          <div className="absolute left-[5%] right-[5%] h-px pointer-events-none" style={{ top: '40%', background: `linear-gradient(90deg, transparent, ${c3} 20%, ${c3} 80%, transparent)`, opacity: 0.15, zIndex: 3 }} />
          <div className="absolute left-[5%] right-[5%] h-px pointer-events-none" style={{ top: '62.5%', background: `linear-gradient(90deg, transparent, ${c3} 20%, ${c3} 80%, transparent)`, opacity: 0.15, zIndex: 3 }} />
          <div className="absolute left-[5%] right-[5%] h-px pointer-events-none" style={{ top: '77.5%', background: `linear-gradient(90deg, transparent, ${c3} 20%, ${c3} 80%, transparent)`, opacity: 0.15, zIndex: 3 }} />

          {/* Cabecera — mismo formato que Ilustraciones: barra + logo aura */}
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
                <div className="font-cursive" style={{ ...FONT_CURSIVE, color: c5, fontSize: 9, letterSpacing: '0.1em', marginTop: -1, opacity: 0.9 }}>slow brew coffe</div>
              </div>
            </div>
          </div>

          {/* Hero — escena papelería */}
          <div className="absolute z-[20] rounded overflow-hidden" style={{ top: py(12.5), left: px(5), right: px(5), height: py(30), background: c1 }}>
            <div className="absolute inset-0" style={{ background: `linear-gradient(155deg, ${c1} 0%, ${c1} 35%, ${c1} 100%)` }} />
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `repeating-linear-gradient(85deg, transparent, transparent 12px, ${c2} 12px, ${c2} 13px)` }} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.1]" style={{ backgroundImage: `repeating-linear-gradient(82deg, transparent 0px, transparent 18px, ${c5} 18px, ${c5} 19px)`, zIndex: 1 }} />

            {/* Planta decorativa */}
            <div className="absolute top-[-2%] left-[62%] w-[18%] h-[35%] z-[2]">
              <div className="absolute bottom-0 left-1/2 w-[1.5px] h-[60%] -translate-x-1/2" style={{ background: c4, opacity: 0.35, transform: 'rotate(-3deg)', transformOrigin: 'bottom center' }} />
              <div className="absolute border-2 rounded-[50%_2px_50%_2px]" style={{ top: '5%', left: '55%', width: '28%', height: '18%', borderColor: c4, opacity: 0.28, transform: 'rotate(-30deg)' }} />
              <div className="absolute border-2 rounded-[50%_2px_50%_2px]" style={{ top: '20%', left: '22%', width: '25%', height: '16%', borderColor: c4, opacity: 0.28, transform: 'rotate(20deg)' }} />
              <div className="absolute border-2 rounded-[50%_2px_50%_2px]" style={{ top: '35%', left: '58%', width: '22%', height: '14%', borderColor: c4, opacity: 0.28, transform: 'rotate(-18deg)' }} />
            </div>

            {/* Papel carta */}
            <div className="absolute bottom-[-4%] left-[3%] w-[94%] h-[8%] rounded-full z-[2]" style={{ background: c1, filter: 'blur(8px)', opacity: 0.2 }} />
            <div className="absolute top-[6%] left-[5%] w-[32%] h-[82%] rounded-sm z-[3] shadow-lg" style={{ background: c5, transform: 'rotate(-2deg)', boxShadow: '2px 4px 16px rgba(0,0,0,0.25)' }}>
              <div className="absolute inset-0 p-[10%] flex flex-col">
                <div className="flex items-center gap-0.5 mb-[6%]">
                  <div style={{ transform: 'translateY(-2px)' }}>
                    <LogoIcon width={24} height={28} borderWidth={2} cupColor={c1} leafColor={c4} opacity={0.6} />
                  </div>
                  <span style={{ ...AURA_LOWERCASE, fontSize: 10, letterSpacing: '0.3em', color: c1, opacity: 0.6, marginLeft: -2 }}>aura</span>
                </div>
                <div className="w-[35%] h-px mb-[5%]" style={{ background: c2, opacity: 0.2 }} />
                {[90, 75, 85, 60, 80, 70, 50].map((width, i) => (
                  <div key={i} className="h-px rounded-px mb-1" style={{ width: `${width}%`, background: c6, opacity: 0.08 }} />
                ))}
                <div className="mt-auto flex flex-col gap-0.5">
                  <div className="h-px" style={{ width: '60%', background: c4, opacity: 0.1 }} />
                  <div className="h-px" style={{ width: '45%', background: c4, opacity: 0.1 }} />
                  <div className="h-px" style={{ width: '35%', background: c4, opacity: 0.1 }} />
                </div>
              </div>
              <div className="absolute bottom-[12%] right-[8%] w-8 h-12 border rounded-[50%_2px_50%_2px] opacity-[0.04]" style={{ borderColor: c4, transform: 'rotate(-15deg)' }} />
            </div>

            {/* Sobre */}
            <div className="absolute bottom-[-5%] left-[5%] w-[90%] h-[8%] rounded-full z-[2]" style={{ background: c1, filter: 'blur(6px)', opacity: 0.18 }} />
            <div className="absolute bottom-[4%] left-[28%] w-[34%] h-[48%] z-[4]" style={{ transform: 'rotate(3deg)' }}>
              <div className="w-full h-full rounded-sm relative overflow-hidden shadow-md" style={{ background: c3, boxShadow: '2px 3px 14px rgba(0,0,0,0.2)' }}>
                <div className="absolute top-0 left-0 right-0 h-[38%]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: `linear-gradient(180deg, ${c3}, ${c3})`, opacity: 0.6 }} />
                <div className="absolute top-0 left-0 right-0 h-[38%]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', border: `1px solid ${c6}`, opacity: 0.08 }} />
                <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full z-[2]" style={{ background: `radial-gradient(circle, ${c2}, ${c2})`, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                  <div className="absolute inset-[20%] rounded-full border" style={{ borderColor: c1, opacity: 0.2 }} />
                </div>
                <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-5 h-5 flex items-center justify-center z-[2]">
                  <span style={{ ...FONT_SERIF, fontSize: 7, color: c1, opacity: 0.3, textTransform: 'lowercase' }}>a</span>
                </div>
                <div className="absolute top-[8%] right-[8%] w-5 rounded border" style={{ aspectRatio: 0.85, borderColor: c2, opacity: 0.35 }} />
                <div className="absolute bottom-[20%] left-[15%] flex flex-col gap-0.5">
                  {[30, 22, 26].map((w, i) => <div key={i} className="h-px rounded-px" style={{ width: w, background: c2, opacity: 0.35 }} />)}
                </div>
                <span className="absolute bottom-[10%] right-[10%]" style={{ ...AURA_LOWERCASE, fontSize: 11, letterSpacing: '0.2em', color: c2, opacity: 0.65 }}>aura</span>
              </div>
            </div>

            {/* Tarjetas de visita */}
            <div className="absolute bottom-[8%] right-[5%] w-[28%] z-[6]" style={{ transform: 'rotate(-6deg)' }}>
              <div className="absolute bottom-[8%] right-[4%] w-full rounded-sm z-[1] shadow-sm" style={{ aspectRatio: 1.7, background: c3, transform: 'rotate(8deg)', boxShadow: '1px 2px 8px rgba(0,0,0,0.12)' }}>
                <div className="absolute inset-[6%] opacity-[0.06]" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${c1}, ${c1} 1px, transparent 1px, transparent 5px)` }} />
              </div>
              <div className="relative w-full rounded-sm z-[2] overflow-hidden shadow-md flex flex-col items-center justify-center gap-0.5" style={{ aspectRatio: 1.7, background: c1, boxShadow: '2px 3px 12px rgba(0,0,0,0.25)' }}>
                <div className="absolute top-0 left-0 right-0 h-1/2" style={{ background: `linear-gradient(180deg, ${c4}, transparent)`, opacity: 0.06 }} />
                <LogoIcon width={20} height={24} borderWidth={1.5} cupColor={c5} leafColor={c5} opacity={0.72} />
                <span style={{ ...AURA_LOWERCASE, fontSize: 8, letterSpacing: '0.3em', color: c5, opacity: 0.75, zIndex: 1, marginTop: -4 }}>aura</span>
                <span style={{ ...FONT_CURSIVE, fontSize: 6, color: c5, opacity: 0.5, zIndex: 1 }}>slow brew coffee</span>
                <div className="absolute bottom-[12%] left-[12%] right-[12%] flex flex-col gap-0.5">
                  <div className="h-0.5" style={{ background: c2, opacity: 0.1 }} />
                  <div className="h-0.5 w-[70%]" style={{ background: c2, opacity: 0.1 }} />
                  <div className="h-0.5 w-[50%]" style={{ background: c2, opacity: 0.1 }} />
                </div>
              </div>
              <div className="absolute bottom-[-6%] left-[8%] w-[84%] h-[10%] rounded-full z-0" style={{ background: c1, filter: 'blur(5px)', opacity: 0.15 }} />
            </div>

            {/* Bolígrafo */}
            <div className="absolute top-[15%] right-[8%] w-[3%] h-[55%] z-[7]" style={{ transform: 'rotate(18deg)' }}>
              <div className="w-full h-[80%] rounded-t-sm relative" style={{ background: `linear-gradient(90deg, ${c4}, ${c1}, ${c4})` }}>
                <div className="absolute top-[2%] right-[-60%] w-[50%] h-[18%] rounded-r-sm" style={{ background: c2, opacity: 0.3 }} />
                <div className="absolute top-[5%] left-[15%] w-[20%] h-[60%] rounded-px" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08), transparent)' }} />
              </div>
              <div className="w-full h-[3%]" style={{ background: c2, opacity: 0.3 }} />
              <div className="w-[60%] h-[15%] mx-auto" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: `linear-gradient(180deg, ${c6}, ${c6})`, opacity: 0.4 }} />
            </div>

            {/* Sello suelto */}
            <div className="absolute top-[18%] left-[42%] w-6 h-6 rounded-full z-[8] flex items-center justify-center" style={{ background: `radial-gradient(circle at 40% 40%, ${c2}, ${c2})`, boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>
              <div className="absolute inset-[22%] rounded-full border" style={{ borderColor: c5, opacity: 0.55 }} />
              <span className="relative z-[1]" style={{ ...FONT_SERIF, fontSize: 8, color: c5, opacity: 0.65, textTransform: 'lowercase' }}>a</span>
            </div>

            {/* Clips */}
            <div className="absolute top-[10%] left-[34%] w-2 h-4 border-[1.5px] rounded z-[9]" style={{ borderColor: c2, opacity: 0.15, transform: 'rotate(15deg)' }} />
            <div className="absolute bottom-[12%] right-[38%] w-2 h-4 border-[1.5px] rounded z-[9]" style={{ borderColor: c2, opacity: 0.15, transform: 'rotate(-22deg)' }} />

            <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: `url("${PHOTO_GRAIN_URL}")`, backgroundSize: '80px' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 45%, transparent 25%, rgba(0,0,0,0.35) 100%)' }} />
            <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 z-10">
              <div className="rounded-full w-1.5 h-1.5" style={{ background: c2, opacity: 0.6 }} />
              <span style={{ ...FONT_MONO, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: c5, opacity: 0.7 }}>Hero — Stationery Suite</span>
            </div>
          </div>

          {/* Grid detalle — 4 items */}
          <div className="absolute z-[20]" style={{ top: py(SECTION_TOP.closeUp), left: px(5), right: px(5) }}>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={{ ...FONT_MONO, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: c6 }}>Close-up Details</span>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {GRID_ITEMS.map((item) => (
                <div key={item.type} className="flex flex-col gap-1">
                  <div className="w-full rounded overflow-hidden relative" style={{ aspectRatio: 0.8, background: item.type === 'card' ? c3 : item.type === 'seal' ? c3 : c1 }}>
                    {item.type === 'card' && (
                      <>
                        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c3}, ${c3})` }} />
                        <div className="absolute bottom-0 left-0 right-0 h-1/4" style={{ background: `linear-gradient(180deg, transparent, ${c3})`, opacity: 0.5 }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded overflow-hidden shadow-md flex flex-col items-center justify-center gap-0.5 shrink-0 py-[10%] px-[6%]" style={{ width: '68%', aspectRatio: 1.7, background: c1, transform: 'rotate(-3deg)', boxShadow: '2px 3px 10px rgba(0,0,0,0.2)' }}>
                            <div className="absolute top-0 left-0 right-0 h-1/2" style={{ background: `linear-gradient(180deg, ${c4}, transparent)`, opacity: 0.05 }} />
                            <LogoIcon width={14} height={17} borderWidth={1} cupColor={c5} leafColor={c5} opacity={0.72} />
                            <span style={{ ...AURA_LOWERCASE, fontSize: 6, letterSpacing: '0.25em', color: c5, opacity: 0.75, zIndex: 1, marginTop: -2 }}>aura</span>
                            <span style={{ ...FONT_CURSIVE, fontSize: 4.5, color: c5, opacity: 0.5, zIndex: 1 }}>slow brew coffee</span>
                            <div className="absolute bottom-0 right-0 w-1/4 h-1/4" style={{ background: `linear-gradient(135deg, transparent 50%, ${c2} 50%)`, opacity: 0.06 }} />
                          </div>
                        </div>
                        <div className="absolute bottom-[18%] left-[18%] w-[64%] h-[8%] rounded-full" style={{ background: c1, filter: 'blur(4px)', opacity: 0.1 }} />
                      </>
                    )}
                    {item.type === 'env' && (
                      <>
                        <div className="absolute inset-0" style={{ background: `linear-gradient(155deg, ${c1}, ${c1})` }} />
                        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(87deg, transparent, transparent 10px, ${c2} 10px, ${c2} 11px)` }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded overflow-hidden shadow-md relative shrink-0 py-[8%] px-[5%]" style={{ width: '76%', aspectRatio: 1.45, background: c3, transform: 'rotate(2deg)', boxShadow: '2px 3px 12px rgba(0,0,0,0.25)' }}>
                            <div className="absolute top-0 left-0 right-0 h-[35%]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: c3, opacity: 0.6 }} />
                            <div className="absolute top-[24%] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-[1]" style={{ background: c2, opacity: 0.5, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                            <div className="absolute bottom-[22%] left-[12%] flex flex-col gap-0.5">
                              {[22, 16, 19].map((wd, i) => <div key={i} className="h-px rounded-px" style={{ width: wd, background: c6, opacity: 0.1 }} />)}
                            </div>
                            <span className="absolute bottom-[12%] right-[10%]" style={{ ...AURA_LOWERCASE, fontSize: 9, letterSpacing: '0.2em', color: c2, opacity: 0.7 }}>aura</span>
                            <div className="absolute top-[-8%] left-[8%] right-[8%] h-[20%] rounded-t-sm" style={{ background: c5, opacity: 0.4 }} />
                          </div>
                        </div>
                      </>
                    )}
                    {item.type === 'seal' && (
                      <>
                        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c3}, ${c3})` }} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          {[1, 2].map((i) => (
                            <div key={i} className="relative shrink-0 w-[3.25rem] h-[3.25rem] rounded-full flex items-center justify-center" style={{ background: `radial-gradient(circle at 38% 38%, ${c2}, ${c2}, ${c2})`, boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.15)' }}>
                              <div className="absolute inset-[8%] rounded-full border" style={{ borderColor: c5, opacity: 0.5 }} />
                              <div className="absolute inset-[18%] rounded-full border-[1.5px]" style={{ borderColor: c5, opacity: 0.4 }} />
                              {i === 1 ? (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[8deg] w-[26%] h-[34%] border-[1.5px] rounded-[50%_2px_50%_2px]" style={{ borderColor: c5, opacity: 0.6 }} />
                              ) : (
                                <span className="absolute inset-0 flex items-center justify-center" style={{ ...FONT_SERIF, fontSize: 16, color: c5, opacity: 0.6, textTransform: 'lowercase' }}>a</span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-4 rounded-full -z-[1]" style={{ background: c1, filter: 'blur(6px)', opacity: 0.1 }} />
                        <div className="absolute top-[38%] left-[15%] right-[15%] h-[24%] rounded-sm -z-[1]" style={{ background: c5, opacity: 0.3, transform: 'rotate(-3deg)' }} />
                      </>
                    )}
                    {item.type === 'folder' && (
                      <>
                        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c1}, ${c1} 50%, ${c1})` }} />
                        <div className="absolute inset-0 flex items-center justify-center p-[4%]">
                          <div className="rounded overflow-hidden shadow-md relative shrink-0" style={{ width: '76%', aspectRatio: 0.75, background: c3, transform: 'rotate(-3deg)', boxShadow: '2px 3px 12px rgba(0,0,0,0.25)' }}>
                            <div className="absolute top-[-6%] right-[15%] w-[30%] h-[10%] rounded-t" style={{ background: c3 }} />
                            <div className="absolute top-[15%] left-[12%] right-[12%] h-[35%] border-[1.5px] rounded flex flex-col items-center justify-center gap-0.5" style={{ borderColor: c1, opacity: 0.08 }}>
                              <span style={{ ...AURA_LOWERCASE, fontSize: 8, letterSpacing: '0.25em', color: c1, opacity: 0.4 }}>aura</span>
                              <div className="w-[35%] h-px" style={{ background: c1, opacity: 0.1 }} />
                              <span style={{ ...FONT_CURSIVE, fontSize: 6, color: c4, opacity: 0.3 }}>brand guidelines</span>
                            </div>
                            <div className="absolute top-[-3%] left-[8%] w-[40%] h-[5%] rounded-sm" style={{ background: c5, transform: 'rotate(-1deg)', opacity: 0.5 }} />
                            <div className="absolute top-[-5%] left-[20%] w-[35%] h-[4%] rounded-sm" style={{ background: c5, transform: 'rotate(1deg)', opacity: 0.35 }} />
                            <div className="absolute top-[55%] left-0 right-0 h-0.5" style={{ background: c2, opacity: 0.12 }} />
                          </div>
                        </div>
                        <div className="absolute bottom-[8%] left-[18%] w-[64%] h-[8%] rounded-full" style={{ background: c1, filter: 'blur(5px)', opacity: 0.15 }} />
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full border-[1.5px] shrink-0" style={{ borderColor: c2, opacity: 0.4 }} />
                    <span style={{ ...FONT_SERIF, fontStyle: 'italic', fontSize: 10, color: c1, letterSpacing: '0.04em' }}>{item.name}</span>
                  </div>
                  <div style={{ ...FONT_MONO, fontSize: 7, color: c6, opacity: 0.55, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Specs técnicas */}
          <div className="absolute z-[20]" style={{ top: py(SECTION_TOP.technicalSpecs), left: px(5), right: px(5) }}>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={{ ...FONT_MONO, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: c6 }}>Technical Specs</span>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <SpecsPanel title="Dimensions" c={colors}>
                <div className="flex flex-col gap-1 relative z-[1]" style={{ ...FONT_MONO, fontSize: 8, color: c5, opacity: 0.92 }}>
                  {DIMENSION_ROWS.map((row, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full" style={{ background: c5, opacity: 0.6 }} />
                      <span style={{ color: c5, minWidth: 52 }}>{row.label}</span>
                      <span>{row.value}</span>
                    </div>
                  ))}
                </div>
              </SpecsPanel>
              <SpecsPanel title="Paper & Stock" gradientReversed c={colors}>
                <div className="flex flex-col gap-1.5 relative z-[1]">
                  {PAPER_STOCK_ITEMS.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-9 h-5 rounded shrink-0 shadow-sm" style={{ background: colors[s.bgKey] }} />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span style={{ ...FONT_SERIF, fontSize: 9, color: c5, opacity: 0.92 }}>{s.name}</span>
                        <span style={{ ...FONT_MONO, fontSize: 7, color: c5, opacity: 0.85 }}>{s.detail}</span>
                      </div>
                      <span style={{ ...FONT_MONO, fontSize: 7, color: c5, opacity: 0.85 }}>{s.weight}</span>
                    </div>
                  ))}
                </div>
              </SpecsPanel>
            </div>
          </div>

          {/* Watermark */}
          <div className="absolute bottom-[2%] right-[-4%] z-[4] pointer-events-none select-none lowercase" style={{ ...FONT_SERIF, fontSize: 160, color: c3, lineHeight: 0.65, opacity: 0.12 }}>a</div>

          {/* Footer — mismo formato que Ilustraciones */}
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
