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

const PHOTO_GRAIN_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='nm'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nm)'/%3E%3C/svg%3E";

/** Hojas sueltas del hero: posición y tamaño (%, rotación deg). */
const HERO_LEAVES: { top: string; left: string; w: number; h: number; rot: number }[] = [
  { top: '8%', left: '14%', w: 8, h: 14, rot: -22 },
  { top: '20%', left: '74%', w: 7, h: 12, rot: 38 },
  { top: '10%', left: '56%', w: 6, h: 11, rot: -45 },
  { top: '44%', left: '6%', w: 7, h: 13, rot: 15 },
  { top: '36%', left: '80%', w: 6, h: 10, rot: -32 },
  { top: '54%', left: '24%', w: 7, h: 12, rot: 52 },
  { top: '16%', left: '40%', w: 5, h: 9, rot: -18 },
  { top: '60%', left: '66%', w: 6, h: 11, rot: 25 },
];

/** Líneas del letterhead (Stationery): top % y ancho %. */
const LETTERHEAD_LINES: { top: string; width: string }[] = [
  { top: '24%', width: '50%' }, { top: '32%', width: '62%' }, { top: '40%', width: '55%' },
  { top: '48%', width: '58%' }, { top: '56%', width: '52%' },
];

const LOYALTY_FILLED_STAMPS = 6;

const MOCKUP_GRID_ITEMS = [
  { name: 'Ceramic Mug', desc: 'In-house ceramic with debossed logo, saucer pairing', type: 'ceramic' as const },
  { name: 'Stationery', desc: 'Letterhead, envelope, wax seal on textured stock', type: 'stationery' as const },
  { name: 'Apron', desc: 'Dark linen apron, embroidered logo, barista-fit', type: 'apron' as const },
  { name: 'Loyalty Card', desc: 'Stamp card on recycled kraft with foil details', type: 'loyalty' as const },
];

const SPECS_CARDS = [
  { title: 'Materials', items: ['Recycled kraft 350gsm', 'Organic cotton linen', 'FSC-certified stock', 'Soy-based inks only'] },
  { title: 'Finishes', items: ['Gold foil stamping', 'Blind deboss logo', 'Soft-touch laminate', 'Wax seal — Aureate'] },
  { title: 'Dimensions', items: ['Card 90 × 55 mm', 'Bag 120 × 200 mm', 'Cup 12 oz / 350 ml', 'Apron 72 × 85 cm'] },
];

/** Posiciones de las esquinas decorativas (top/left/right/bottom en px). */
const CORNER_POSITIONS = [
  { pos: 'tl' as const, top: 1.5, left: 2 },
  { pos: 'tr' as const, top: 1.5, right: 2 },
  { pos: 'bl' as const, bottom: 5, left: 2 },
  { pos: 'br' as const, bottom: 5, right: 2 },
];

const LOYALTY_TOTAL_STAMPS = 8;

/** Paleta destructuring (c1..c6) para subcomponentes. */
type Colors = { c1: string; c2: string; c3: string; c4: string; c5: string; c6: string };

function CornerDecorations({ c6, px, py }: { c6: string; px: (p: number) => number; py: (p: number) => number }) {
  return (
    <>
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
    </>
  );
}

function SpecCard({ title, items, c }: { title: string; items: string[]; c: Colors }) {
  const { c1, c2, c3, c4, c5 } = c;
  return (
    <div className="rounded-lg overflow-hidden relative" style={{ background: c1, padding: '12px 14px' }}>
      <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none" style={{ background: `linear-gradient(180deg, ${c4}10, transparent)` }} />
      <div style={{ ...FONT_SERIF, fontSize: 13, color: c5, letterSpacing: '0.04em', marginBottom: 8, position: 'relative', zIndex: 1 }}>{title}</div>
      <div className="w-full h-px mb-2 relative z-[1]" style={{ background: `linear-gradient(90deg, ${c2}44, transparent)` }} />
      <div className="flex flex-col gap-1 relative z-[1]">
        {items.map((text, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="rounded-full flex-shrink-0" style={{ width: 4, height: 4, background: c2, opacity: 0.4 }} />
            <span style={{ ...FONT_MONO, fontSize: 9, color: c3, opacity: 0.8 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PosterFooter({ c }: { c: Colors }) {
  const { c1, c4, c5 } = c;
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[100] flex items-center justify-center" style={{ height: '3.5%', background: c1 }}>
      <div className="flex items-center gap-1.5">
        <div className="rounded-full" style={{ width: 4, height: 4, background: c4 }} />
        <span className="font-serif text-xs tracking-[0.35em] lowercase" style={{ ...FONT_SERIF, color: c5 }}>aura</span>
        <div className="rounded-full" style={{ width: 4, height: 4, background: c4 }} />
      </div>
    </div>
  );
}

function CeramicCell({ c }: { c: Colors }) {
  const { c1, c3, c5 } = c;
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c3}, ${c1})` }} />
      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: `linear-gradient(180deg, transparent, ${c1})` }} />
      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 rounded-full" style={{ width: '68%', height: '8%', background: `linear-gradient(180deg, ${c3}, ${c1})`, border: `1px solid ${c1}` }} />
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 rounded-b" style={{ width: '52%', height: '48%', background: `linear-gradient(170deg, ${c5}, ${c3})`, borderRadius: '3px 3px 8px 8px' }}>
        <span className="absolute top-[30%] left-1/2 -translate-x-1/2" style={{ ...AURA_LOWERCASE, fontSize: 9, letterSpacing: '0.25em', color: c1, opacity: 0.6 }}>aura</span>
        <div className="absolute -right-[8%] top-[25%] w-[16%] h-[35%] border-2 border-r-0 rounded-r-full" style={{ borderColor: c3 }} />
      </div>
      <div className="absolute rounded-full" style={{ bottom: '14%', left: '15%', width: '70%', height: '6%', background: c1, filter: 'blur(4px)', opacity: 0.1 }} />
    </>
  );
}

function StationeryCell({ c }: { c: Colors }) {
  const { c1, c2, c3, c4, c5, c6 } = c;
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(150deg, ${c4}, ${c1})` }} />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(88deg, transparent, transparent 10px, ${c2} 10px, ${c2} 11px)` }} />
      <div className="absolute rounded-sm" style={{ top: '8%', left: '12%', width: '55%', height: '65%', background: c5, transform: 'rotate(-2deg)' }}>
        <span className="absolute top-[10%] left-[12%]" style={{ ...AURA_LOWERCASE, fontSize: 7, letterSpacing: '0.3em', color: c1, opacity: 0.6 }}>aura</span>
        {LETTERHEAD_LINES.map((line, i) => (
          <div key={i} className="absolute left-[12%] h-px" style={{ top: line.top, width: line.width, background: c6, opacity: 0.2 }} />
        ))}
      </div>
      <div className="absolute rounded-sm overflow-hidden" style={{ bottom: '10%', right: '8%', width: '60%', height: '42%', background: c3, transform: 'rotate(3deg)' }}>
        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: c2, opacity: 0.1 }} />
        <div className="absolute rounded-full" style={{ top: '26%', left: '50%', width: 12, height: 12, transform: 'translateX(-50%)', background: c2, opacity: 0.4 }} />
        <span className="absolute bottom-[18%] left-1/2 -translate-x-1/2" style={{ ...AURA_LOWERCASE, fontSize: 7, letterSpacing: '0.25em', color: c1, opacity: 0.4 }}>aura</span>
      </div>
    </>
  );
}

function ApronCell({ c }: { c: Colors }) {
  const { c1, c3, c4, c5, c6 } = c;
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(170deg, ${c3}, ${c1})` }} />
      <div className="absolute overflow-visible" style={{ top: '12%', left: '20%', right: '20%', bottom: '18%' }}>
        <div className="absolute left-[8%] bottom-full w-px origin-bottom" style={{ height: '14%', background: c6, opacity: 0.5, transform: 'rotate(-22deg)' }} />
        <div className="absolute right-[8%] bottom-full w-px origin-bottom" style={{ height: '14%', background: c6, opacity: 0.5, transform: 'rotate(22deg)' }} />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-[18%] border-b-2 rounded-b-full" style={{ height: '6%', borderColor: c6, opacity: 0.4 }} />
        <div className="absolute inset-0 flex flex-col items-center overflow-hidden" style={{ background: `linear-gradient(175deg, ${c1}, ${c4})`, borderRadius: '6px 6px 12px 12px', paddingTop: '12%', paddingLeft: '6%', paddingRight: '6%', paddingBottom: '22%' }}>
          <LogoIcon width={20} height={22} borderWidth={1.5} cupColor={c5} leafColor={c5} opacity={0.65} />
          <span style={{ ...AURA_LOWERCASE, fontSize: 8, letterSpacing: '0.2em', color: c5, opacity: 0.65, marginTop: 2 }}>aura</span>
          <span style={{ ...FONT_CURSIVE, fontSize: 6, color: c5, opacity: 0.65, marginTop: 1 }}>rooted in nature</span>
          <div className="absolute left-1/2 -translate-x-1/2 border-2 rounded-b rounded-t-sm" style={{ bottom: '14%', width: '54%', height: '24%', borderColor: c5, opacity: 0.38 }} />
        </div>
        <div className="absolute top-[46%] -left-[5%] w-[8%] h-0.5 origin-right" style={{ background: c6, opacity: 0.45, transform: 'rotate(8deg)' }} />
        <div className="absolute top-[46%] -right-[5%] w-[8%] h-0.5 origin-left" style={{ background: c6, opacity: 0.45, transform: 'rotate(-8deg)' }} />
      </div>
    </>
  );
}

function LoyaltyCell({ c }: { c: Colors }) {
  const { c1, c2, c3, c4, c5 } = c;
  return (
    <>
      <div className="absolute inset-0" style={{ background: `linear-gradient(140deg, ${c4}, ${c1})` }} />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(88deg, transparent, transparent 10px, ${c2} 10px, ${c2} 11px)` }} />
      <div className="absolute rounded" style={{ top: '14%', left: '14%', right: '10%', bottom: '12%', background: c3, zIndex: -1, transform: 'rotate(4deg)' }} />
      <div className="absolute rounded flex flex-col items-center justify-center gap-1 p-2" style={{ top: '12%', left: '12%', right: '12%', bottom: '15%', background: c4, transform: 'rotate(-2deg)' }}>
        <span style={{ ...AURA_LOWERCASE, fontSize: 10, letterSpacing: '0.2em', color: c5 }}>aura</span>
        <span style={{ ...FONT_CURSIVE, fontSize: 11, color: c2, opacity: 0.7 }}>your journey</span>
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: LOYALTY_TOTAL_STAMPS }, (_, i) => i + 1).map((i) => {
            const filled = i <= LOYALTY_FILLED_STAMPS;
            return (
              <div key={i} className="rounded-full border-[1.5px] flex items-center justify-center relative" style={{ width: 14, height: 14, borderColor: filled ? c2 : c5, opacity: filled ? 0.6 : 0.4, background: filled ? c2 : 'transparent' }}>
                {filled && <span className="absolute text-[9px] font-bold leading-none" style={{ color: c5, transform: 'scale(0.85)', marginBottom: 1 }}>✓</span>}
              </div>
            );
          })}
        </div>
        <span style={{ ...FONT_MONO, fontSize: 6, letterSpacing: '0.2em', textTransform: 'uppercase', color: c3, opacity: 0.35 }}>8th coffee free</span>
      </div>
    </>
  );
}

function HeroSection({
  c,
  px,
  py,
}: {
  c: Colors;
  px: (p: number) => number;
  py: (p: number) => number;
}) {
  const { c1, c2, c3, c4, c5, c6 } = c;
  return (
    <div className="absolute z-[20] rounded overflow-hidden" style={{ top: py(12.5), left: px(5), right: px(5), height: py(30), background: c1 }}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c1}, ${c4} 40%, ${c4} 100%)` }} />
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `repeating-linear-gradient(85deg, transparent, transparent 12px, ${c2} 12px, ${c2} 13px)` }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.1]" style={{ backgroundImage: `repeating-linear-gradient(82deg, transparent 0px, transparent 18px, ${c5} 18px, ${c5} 19px)`, zIndex: 1 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {HERO_LEAVES.map((leaf, i) => (
          <div key={i} className="absolute border rounded-[50%_2px_50%_2px]" style={{ top: leaf.top, left: leaf.left, width: `${leaf.w}%`, height: `${leaf.h}%`, borderColor: c5, borderWidth: 1.5, opacity: 0.22, transform: `rotate(${leaf.rot}deg)` }} />
        ))}
      </div>
      <div className="absolute rounded-full flex items-center justify-center pointer-events-none" style={{ top: '15%', right: '28%', width: 32, height: 32, background: c5, opacity: 0.45, zIndex: 2, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
        <div className="rounded-full border" style={{ width: '65%', aspectRatio: 1, borderColor: c5, opacity: 0.35 }} />
      </div>
      {/* Vaso take-away */}
      <div className="absolute flex flex-col items-center" style={{ bottom: '8%', left: '8%', width: '18%', height: '72%', zIndex: 5 }}>
        <div className="w-[110%] h-[8%] rounded-t" style={{ background: '#3a3a3a', borderRadius: '3px 3px 1px 1px' }} />
        <div className="w-full flex-1 relative rounded-b overflow-hidden" style={{ borderRadius: '0 0 4px 4px' }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(175deg, ${c5}, ${c3})` }} />
          <div className="absolute top-[25%] left-0 right-0 h-[32%] flex items-center justify-center" style={{ background: c1 }}>
            <span style={{ ...AURA_LOWERCASE, fontSize: 10, letterSpacing: '0.3em', color: c5, opacity: 0.78, zIndex: 1 }}>aura</span>
            <div className="absolute border rounded-[50%_2px_50%_2px]" style={{ left: '68%', top: '38%', transform: 'translateY(-50%) rotate(-8deg)', width: 14, height: 18, borderColor: c5, opacity: 0.18, borderWidth: 1.5 }} />
          </div>
          <div className="absolute top-[5%] left-[8%] w-[15%] h-[60%] rounded" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08), transparent)', transform: 'skewX(-3deg)' }} />
        </div>
        <div className="w-[85%] h-[2%] rounded-b" style={{ background: c6, opacity: 0.15 }} />
        <div className="absolute rounded-full" style={{ bottom: '-6%', left: '5%', width: '90%', height: '10%', background: c1, filter: 'blur(5px)', opacity: 0.2 }} />
      </div>
      {/* Bolsa café */}
      <div className="absolute flex flex-col items-center" style={{ bottom: '5%', left: '32%', width: '22%', height: '78%', zIndex: 4 }}>
        <div className="w-full flex-1 relative rounded-b overflow-hidden" style={{ borderRadius: '3px 3px 4px 4px' }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(170deg, ${c3}, ${c1})` }} />
          <div className="absolute top-0 left-0 right-0 h-[10%]" style={{ background: c6, opacity: 0.15 }} />
          <div className="absolute top-[22%] left-[12%] right-[12%] bottom-[25%] rounded" style={{ background: c2, opacity: 0.22, border: `1.5px solid ${c2}` }} />
          <div className="absolute top-[22%] left-[12%] right-[12%] bottom-[25%] rounded flex flex-col items-center justify-center gap-0 p-1">
            <LogoIcon width={38} height={40} borderWidth={2.5} cupColor={c5} leafColor={c5} opacity={0.65} />
            <span style={{ ...AURA_LOWERCASE, fontSize: 10, letterSpacing: '0.25em', color: c5, marginTop: -4, opacity: 0.65 }}>aura</span>
            <div className="w-[40%] h-px" style={{ background: c1, opacity: 0.15 }} />
            <span style={{ ...FONT_CURSIVE, fontSize: 8, color: c5, opacity: 0.65 }}>single origin</span>
          </div>
          <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2" style={{ ...FONT_MONO, fontSize: 7, color: c5, opacity: 0.65, letterSpacing: '0.15em' }}>250g</div>
        </div>
        <div className="absolute rounded-full" style={{ bottom: '-5%', left: '5%', width: '90%', height: '8%', background: c1, filter: 'blur(6px)', opacity: 0.2 }} />
      </div>
      {/* Tarjeta visita */}
      <div className="absolute" style={{ bottom: '10%', right: '6%', width: '28%', height: '40%', zIndex: 6, transform: 'rotate(-5deg)' }}>
        <div className="absolute inset-0 rounded" style={{ background: c3, zIndex: -1, transform: 'rotate(6deg)', border: `1px solid ${c3}` }} />
        <div className="w-full h-full rounded flex flex-col items-center justify-center gap-0 relative" style={{ background: c1 }}>
          <LogoIcon width={38} height={40} borderWidth={2.5} cupColor={c5} leafColor={c4} opacity={0.65} />
          <span style={{ ...AURA_LOWERCASE, fontSize: 10, letterSpacing: '0.35em', color: c5, opacity: 0.65, marginTop: -4 }}>aura</span>
          <span style={{ ...FONT_CURSIVE, fontSize: 8, color: c5, opacity: 0.65 }}>rooted in nature</span>
          <div className="absolute bottom-[8%] left-[10%] right-[10%] flex flex-col gap-0.5">
            <div className="h-px w-[70%]" style={{ background: c4, opacity: 0.12 }} />
            <div className="h-px w-[50%]" style={{ background: c4, opacity: 0.12 }} />
          </div>
        </div>
        <div className="absolute rounded-full" style={{ bottom: '-8%', left: '10%', width: '80%', height: '12%', background: c1, filter: 'blur(5px)', opacity: 0.15 }} />
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: `url("${PHOTO_GRAIN_URL}")`, backgroundSize: '80px' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 35% 50%, transparent 30%, rgba(0,0,0,0.35) 100%)' }} />
    </div>
  );
}

interface Props {
  posterColors: PosterPalette;
}

export function Mockup({ posterColors }: Props) {
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
          {/* Fondos: grano + kraft */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 300, opacity: 0.22, mixBlendMode: 'multiply', backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '128px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.03, backgroundImage: `url("${BRANDING_KRAFT_URL}")`, backgroundSize: '200px' }} />

          {/* Header + logo */}
          <div className="absolute top-0 left-0 right-0 z-[1]" style={{ height: '8%', background: c1 }}>
            <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: `linear-gradient(90deg, ${c2}, ${c4}, ${c2})`, opacity: 0.5 }} />
          </div>

          <CornerDecorations c6={c6} px={px} py={py} />

          {/* Logo aura (mismo que Dirección fotográfica: gráfico + texto) */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[50] flex items-center justify-center" style={{ top: 0, height: '8%', width: '100%' }}>
            <div className="flex flex-row items-center gap-4" style={{ transform: 'translate(-18px, 0) scale(1.1)', transformOrigin: 'center center' }}>
              <div style={{ transform: 'translate(22px, -6px)' }}>
                <LogoIcon width={52} height={52} borderWidth={3} cupColor={c5} leafColor={c4} opacity={0.72} />
              </div>
              <div className="flex flex-col items-start justify-center">
                <div className="font-serif lowercase leading-none" style={{ ...AURA_LOWERCASE, color: c5, fontSize: 18, letterSpacing: '0.2em' }}>aura</div>
                <div className="font-cursive" style={{ ...FONT_CURSIVE, color: c5, fontSize: 9, letterSpacing: '0.1em', marginTop: -1, opacity: 0.9 }}>slow brew coffe</div>
              </div>
            </div>
          </div>

          <HeroSection c={colors} px={px} py={py} />

          {/* Grid 4 mockups */}
          <div className="absolute z-[20] grid gap-2" style={{ top: py(44.5), left: px(5), right: px(5), gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {MOCKUP_GRID_ITEMS.map((item) => (
              <div key={item.type} className="flex flex-col gap-1">
                <div className="w-full rounded overflow-hidden relative" style={{ aspectRatio: 0.78, background: item.type === 'ceramic' || item.type === 'apron' ? c3 : c1 }}>
                  {item.type === 'ceramic' && <CeramicCell c={colors} />}
                  {item.type === 'stationery' && <StationeryCell c={colors} />}
                  {item.type === 'apron' && <ApronCell c={colors} />}
                  {item.type === 'loyalty' && <LoyaltyCell c={colors} />}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: `url("${PHOTO_GRAIN_URL}")`, backgroundSize: '80px' }} />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.2) 100%)' }} />
                </div>
                <div className="flex items-center gap-1.5" style={{ marginTop: 6 }}>
                  <div className="rounded-full flex-shrink-0 border-[1.5px]" style={{ width: 5, height: 5, borderColor: c2, opacity: 0.5 }} />
                  <span style={{ ...FONT_SERIF, fontStyle: 'italic', fontSize: 12, color: c1, letterSpacing: '0.05em' }}>{item.name}</span>
                </div>
                <div style={{ ...FONT_MONO, fontSize: 9, color: c6, opacity: 0.6, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Specs */}
          <div className="absolute z-[60]" style={{ top: py(76), left: px(5), right: px(5) }}>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={{ ...FONT_MONO, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: c6 }}>Production Specs</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {SPECS_CARDS.map((card) => (
                <SpecCard key={card.title} title={card.title} items={card.items} c={colors} />
              ))}
            </div>
          </div>

          <div className="absolute bottom-[2%] right-[-4%] z-[4] font-serif leading-[0.65] opacity-[0.18] pointer-events-none select-none lowercase" style={{ ...FONT_SERIF, fontSize: 160, color: c3 }}>a</div>

          <PosterFooter c={colors} />
        </div>
      </div>
    </div>
  );
}
