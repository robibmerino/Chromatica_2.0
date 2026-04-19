import type { PosterPalette } from '../types';
import {
  POSTER_BASE_WIDTH,
  POSTER_HEIGHT,
  POSTER_SCALE,
  BRANDING_GRAIN_URL,
  BRANDING_KRAFT_URL,
} from '../constants';
import { FONT_SANS, FONT_SERIF, FONT_CURSIVE, FONT_MONO, AURA_LOWERCASE } from './brandingFonts';

const PHOTO_GRAIN_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='nd'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nd)'/%3E%3C/svg%3E";

const CORNER_POSITIONS = [
  { pos: 'tl' as const, top: 1.5, left: 2 },
  { pos: 'tr' as const, top: 1.5, right: 2 },
  { pos: 'bl' as const, bottom: 5, left: 2 },
  { pos: 'br' as const, bottom: 5, right: 2 },
];

const SPACE_GRID_ITEMS = [
  { name: 'Façade', desc: 'Dark brick, brass signage, green awning, terracotta pots', type: 'facade' as const },
  { name: 'Wayfinding', desc: 'Brass directional signs, backlit logo, room numbers', type: 'wayfinding' as const },
  { name: 'Materials', desc: 'Walnut, poured concrete, handmade tile, aged brass', type: 'materials' as const },
  { name: 'Floor Plan', desc: 'Open layout, brew bar, lounge seating, natural flow', type: 'floorplan' as const },
];

const SPATIAL_SPECS_CARDS = [
  { title: 'Atmosphere', items: ['Warm 2700K lighting', 'Living plants throughout', 'Acoustic wood panels', 'Natural daylight priority'] },
  { title: 'Furniture', items: ['Solid walnut tabletops', 'Brass stool frames', 'Linen upholstery seats', 'Handmade ceramic cups'] },
  { title: 'Signage', items: ['Backlit brass lettering', 'Chalkboard menu wall', 'Engraved room numbers', 'Green canvas awning'] },
];

const WAYFINDING_DIRECTIONS: { arrow: string; label: string }[] = [
  { arrow: '→', label: 'Brew Bar' },
  { arrow: '→', label: 'Lounge' },
  { arrow: '←', label: 'Restroom' },
];

interface Props {
  posterColors: PosterPalette;
  sceneOnly?: boolean;
}

export function AplicacionEspacio({ posterColors, sceneOnly }: Props) {
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
  /** Banner, pie, texturas y marco; «Spatial Guidelines» y bloques inferiores solo en lámina completa. */
  const posterChrome = !sceneOnly;

  return (
    <div className="flex items-center justify-center w-full h-full min-h-0">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div
          className={posterChrome ? 'relative overflow-hidden shadow-2xl rounded' : 'relative overflow-hidden'}
          style={{ width: w, height: h, background: posterChrome ? c5 : 'transparent', ...FONT_SANS }}
        >
          {posterChrome && (
            <>
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 300, opacity: 0.22, mixBlendMode: 'multiply', backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '128px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.03, backgroundImage: `url("${BRANDING_KRAFT_URL}")`, backgroundSize: '200px' }} />

          {/* Header bar */}
          <div className="absolute top-0 left-0 right-0 z-[1]" style={{ height: '8%', background: c1 }}>
            <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: `linear-gradient(90deg, ${c2}, ${c4}, ${c2})`, opacity: 0.5 }} />
          </div>

          {/* Corners */}
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
          </>
          )}

          {/* Hero — Interior perspective */}
          <div
            className="absolute z-[20] rounded overflow-hidden"
            style={{
              top: posterChrome ? py(12.5) : py(4),
              left: px(5),
              right: px(5),
              height: py(30),
              background: c1,
            }}
          >
            <div className="absolute inset-0" style={{ background: `linear-gradient(170deg, ${c1}, ${c4})` }} />
            {/* Back wall */}
            <div className="absolute top-0 left-0 right-0" style={{ height: '68%', background: c3, opacity: 0.18 }} />
            <div className="absolute top-0 left-0 right-0 opacity-[0.05]" style={{ height: '68%', backgroundImage: `repeating-linear-gradient(0deg, ${c1}, ${c1} 1px, transparent 1px, transparent 8px)` }} />
            {/* Floor */}
            <div className="absolute bottom-0 left-0 right-0" style={{ height: '32%', background: `linear-gradient(180deg, ${c6}, ${c1})` }}>
              <div className="absolute inset-0 opacity-[0.11]" style={{ backgroundImage: `repeating-linear-gradient(95deg, transparent 0, transparent 20px, ${c5} 20px, ${c5} 22px)` }} />
              <div className="absolute top-0 left-[20%] right-[20%]" style={{ height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.05), transparent)' }} />
            </div>
            {/* Window left */}
            <div className="absolute rounded-t overflow-hidden" style={{ top: '5%', left: '3%', width: '22%', height: '58%', border: `2px solid ${c6}`, opacity: 0.88 }}>
              <div className="absolute inset-[2px] rounded-t" style={{ background: `linear-gradient(180deg, ${c4}44, ${c4}28)`, opacity: 0.42 }} />
              <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2" style={{ background: c6, opacity: 0.72, width: 1.5 }} />
              <div className="absolute left-0 right-0 top-[45%] h-px" style={{ background: c6, opacity: 0.72, height: 1.5 }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.14), transparent 60%)' }} />
            </div>
            {/* Light beam */}
            <div className="absolute pointer-events-none" style={{ top: '5%', left: '5%', width: '35%', height: '90%', background: 'linear-gradient(160deg, rgba(255,255,255,0.13), transparent 55%)', transform: 'skewX(-12deg)' }} />
            {/* Menu board */}
            <div className="absolute rounded border overflow-hidden flex flex-col items-center justify-center gap-0.5" style={{ top: '8%', left: '35%', width: '18%', height: '22%', background: c1, borderColor: c4, opacity: 0.78, padding: 4 }}>
              <span style={{ ...AURA_LOWERCASE, fontSize: 16, letterSpacing: '0.25em', color: c5, opacity: 0.92 }}>aura</span>
              {[1, 2, 3, 4].map((i) => <div key={i} className="w-[60%]" style={{ height: 0.5, background: c3, opacity: 0.38 }} />)}
            </div>
            {/* Shelves + items */}
            <div className="absolute right-[10%]" style={{ top: '15%', width: '20%', height: 1.5, background: c6, opacity: 0.52, borderRadius: 1 }} />
            <div className="absolute right-[10%]" style={{ top: '28%', width: '20%', height: 1.5, background: c6, opacity: 0.52, borderRadius: 1 }} />
            <div className="absolute rounded-sm" style={{ top: '8%', right: '11%', width: '4%', height: '6%', background: c3, opacity: 0.58 }} />
            <div className="absolute rounded-sm" style={{ top: '8%', right: '16%', width: '3.5%', height: '5.5%', background: c3, opacity: 0.52 }} />
            <div className="absolute rounded-sm" style={{ top: '8%', right: '21%', width: '4%', height: '6%', background: c3, opacity: 0.58 }} />
            <div className="absolute rounded-t" style={{ top: '21%', right: '12%', width: '3%', height: '6%', background: c4, opacity: 0.48, borderRadius: '50% 50% 2px 2px' }} />
            <div className="absolute rounded-t" style={{ top: '21%', right: '17%', width: '3.5%', height: '6%', background: c4, opacity: 0.44, borderRadius: '50% 50% 2px 2px' }} />
            <div className="absolute rounded-sm" style={{ top: '20%', right: '22%', width: '4%', height: '7%', background: c3, opacity: 0.52 }} />
            {/* Counter / bar */}
            <div className="absolute" style={{ bottom: '15%', left: '28%', right: '8%', height: '22%' }}>
              <div className="absolute bottom-0 left-0 right-0 rounded-t" style={{ height: '100%', background: `linear-gradient(180deg, ${c4}99, ${c1})` }} />
              <div className="absolute -top-[0%] left-[-2%] right-[-2%] rounded" style={{ height: '5%', background: `linear-gradient(180deg, ${c6}, ${c1})` }} />
              <div className="absolute rounded" style={{ top: '15%', left: '5%', right: '5%', bottom: '8%', border: `1px solid ${c4}`, opacity: 0.24 }} />
              <span className="absolute top-[35%] left-1/2 -translate-x-1/2" style={{ ...AURA_LOWERCASE, fontSize: 18, letterSpacing: '0.3em', color: c5, opacity: 0.58 }}>aura</span>
            </div>
            {/* Espresso machine */}
            <div className="absolute flex flex-col items-center" style={{ bottom: '37%', right: '12%', width: '10%', height: '18%' }}>
              <div className="w-[120%] rounded-t" style={{ height: '20%', background: `linear-gradient(180deg, ${c3}40, ${c1})` }} />
              <div className="w-full flex-1 rounded-b relative" style={{ background: `linear-gradient(180deg, ${c6}, ${c1})` }}>
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 rounded-full border" style={{ width: '30%', aspectRatio: 1, borderColor: c5, opacity: 0.52 }} />
                <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 rounded" style={{ width: '15%', height: '15%', background: c1 }} />
              </div>
            </div>
            {/* Bar cup */}
            <div className="absolute flex flex-col items-center" style={{ bottom: '37%', left: '38%', width: '6%', height: '10%' }}>
              <div className="w-full flex-1 rounded-b relative" style={{ background: `linear-gradient(170deg, ${c5}, ${c3})` }}>
                <div className="absolute top-[20%] -right-[30%] w-[30%] h-[45%] border border-l-0 rounded-r-full" style={{ borderColor: c3, borderWidth: 1.5 }} />
              </div>
              <div className="w-[130%] rounded-full" style={{ height: '10%', background: c3, opacity: 0.78 }} />
            </div>
            {/* Pendants + glow */}
            <div className="absolute flex flex-col items-center" style={{ top: 0, left: '32%' }}>
              <div style={{ width: 1, height: 14, background: c6, opacity: 0.42 }} />
              <div className="rounded-b-full border-b-2 border-x-2 border-t-0" style={{ width: 14, height: 8, borderColor: c5, opacity: 0.42 }} />
              <div className="absolute rounded-full pointer-events-none" style={{ top: 22, left: '50%', width: 28, height: 28, transform: 'translate(-50%, 0)', background: `radial-gradient(circle, ${c5}20, transparent 70%)` }} />
            </div>
            <div className="absolute flex flex-col items-center" style={{ top: 0, left: '52%' }}>
              <div style={{ width: 1, height: 12, background: c6, opacity: 0.42 }} />
              <div className="rounded-b-full border-b-2 border-x-2 border-t-0" style={{ width: 16, height: 9, borderColor: c5, opacity: 0.42 }} />
              <div className="absolute rounded-full pointer-events-none" style={{ top: 20, left: '50%', width: 32, height: 32, transform: 'translate(-50%, 0)', background: `radial-gradient(circle, ${c5}22, transparent 70%)` }} />
            </div>
            {/* Stools */}
            <div className="absolute flex flex-col items-center" style={{ bottom: '8%', left: '32%' }}>
              <div className="rounded-full" style={{ width: 10, height: 4, background: c6, opacity: 0.35 }} />
              <div style={{ width: 1, height: 12, background: c6, opacity: 0.28 }} />
            </div>
            <div className="absolute flex flex-col items-center" style={{ bottom: '8%', left: '42%' }}>
              <div className="rounded-full" style={{ width: 10, height: 4, background: c6, opacity: 0.35 }} />
              <div style={{ width: 1, height: 12, background: c6, opacity: 0.28 }} />
            </div>
            {/* Plant */}
            <div className="absolute" style={{ bottom: '32%', left: '26%' }}>
              <div className="rounded-b" style={{ width: 8, height: 10, background: c6, opacity: 0.4, borderRadius: '2px 2px 3px 3px' }} />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="border rounded-[50%_2px_50%_2px]" style={{ width: 8, height: 10, borderColor: c4, opacity: 0.3, transform: 'rotate(-15deg)' }} />
                <div className="border rounded-[50%_2px_50%_2px]" style={{ width: 6, height: 8, borderColor: c4, opacity: 0.28, transform: 'rotate(20deg)', marginTop: -3, marginLeft: 2 }} />
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: `url("${PHOTO_GRAIN_URL}")`, backgroundSize: '80px' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 40% 45%, transparent 30%, rgba(0,0,0,0.35) 100%)' }} />
            <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 z-10">
              <div className="rounded-full" style={{ width: 5, height: 5, background: c5, opacity: 0.6 }} />
              <span style={{ ...FONT_MONO, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: c5, opacity: 0.7 }}>Interior — Counter View</span>
            </div>
          </div>

          {/* Grid 4 — spatial details (también en Solo escena) */}
          <div
            className="absolute z-[20] grid gap-2"
            style={{ top: posterChrome ? py(44.5) : py(35.5), left: px(5), right: px(5), gridTemplateColumns: 'repeat(4, 1fr)' }}
          >
            {SPACE_GRID_ITEMS.map((item) => (
              <div key={item.type} className="flex flex-col gap-1">
                <div className="w-full rounded overflow-hidden relative" style={{ aspectRatio: 0.78 }}>
                  {item.type === 'facade' && (
                    <div className="absolute inset-0 rounded" style={{ background: c3 }}>
                      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c4}33, ${c3} 35%, ${c3} 100%)` }} />
                      <div className="absolute top-0 left-0 right-0" style={{ height: '30%', background: `linear-gradient(180deg, ${c4}55, ${c3} 100%)`, opacity: 0.6 }} />
                      <div className="absolute top-[18%] left-[10%] right-[10%] bottom-0 rounded-t" style={{ background: c1 }}>
                        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 6px, ${c5} 6px, ${c5} 7px), repeating-linear-gradient(90deg, transparent, transparent 12px, ${c5} 12px, ${c5} 13px)` }} />
                        {(['left', 'right'] as const).map((side) => (
                          <div key={side} className={`absolute top-[10%] w-[18%] h-[22%] rounded-sm border ${side === 'left' ? 'left-[12%]' : 'right-[12%]'}`} style={{ borderColor: c5, opacity: 0.5, background: `linear-gradient(180deg, ${c4}22, transparent)` }} />
                        ))}
                        <div className="absolute top-[48%] left-[15%] right-[15%] rounded-t flex items-center justify-center" style={{ height: '12%', background: c4, opacity: 0.72 }}>
                          <span style={{ ...FONT_CURSIVE, fontSize: 6, color: c5, opacity: 0.9 }}>coffee house</span>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 rounded-t relative z-[1]" style={{ top: '65%', width: '22%', height: '35%', background: `${c2}cc`, border: `1.5px solid ${c6}` }}>
                          <div className="absolute top-[50%] right-[12%] -translate-y-1/2 rounded-sm" style={{ width: 2, height: '12%', background: c5, opacity: 0.55 }} />
                        </div>
                        <div className="absolute top-[36%] left-1/2 -translate-x-1/2 flex flex-col items-center z-[2]">
                          <span style={{ ...AURA_LOWERCASE, fontSize: 13, letterSpacing: '0.35em', color: c5, textShadow: `0 0 8px ${c5}40` }}>aura</span>
                        </div>
                      </div>
                      <div className="absolute bottom-[3%] left-[18%] flex flex-col items-center z-[2]">
                        <div className="rounded-t-sm rounded-b" style={{ width: 7, height: 5, background: c6, opacity: 0.5, border: `0.5px solid ${c4}40` }} />
                        <div className="w-2 h-1.5 rounded-full -mt-0.5" style={{ background: c4, opacity: 0.35 }} />
                      </div>
                      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.12) 100%)' }} />
                    </div>
                  )}
                  {item.type === 'wayfinding' && (
                    <div className="absolute inset-0 rounded" style={{ background: `linear-gradient(160deg, ${c1}, ${c4})` }}>
                      <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: `repeating-linear-gradient(0deg, ${c3}, ${c3} 1.5px, transparent 1.5px, transparent 10px)` }} />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[65%] pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${c5}20, transparent 65%)` }} />
                      <div className="absolute top-0 left-[8%] right-[8%] rounded-b-xl z-[1]" style={{ height: '30%', background: `${c4}22`, borderBottom: `1px solid ${c5}20` }} />
                      <div className="absolute top-[6%] left-[8%] right-[8%] flex flex-col items-center justify-center gap-1 py-2 z-[2]" style={{ height: '28%' }}>
                        <span style={{ ...AURA_LOWERCASE, fontSize: 20, letterSpacing: '0.28em', color: c5, opacity: 0.92, textShadow: `0 0 10px ${c5}50, 0 0 4px ${c5}30` }}>aura</span>
                        <div className="w-[45%] h-[2px]" style={{ background: c5, opacity: 0.5 }} />
                        <span className="-mt-0.5" style={{ ...FONT_CURSIVE, fontSize: 10, color: c5, opacity: 0.78 }}>rooted in nature</span>
                      </div>
                      <div className="absolute top-[38%] bottom-[28%] left-[8%] right-[38%] flex flex-col justify-center gap-2 z-[2]">
                        {WAYFINDING_DIRECTIONS.map(({ arrow, label }) => (
                          <div key={label} className="flex items-center gap-2">
                            <span style={{ ...FONT_MONO, fontSize: 10, color: c5, opacity: 0.9, letterSpacing: '0.08em' }}>{arrow}</span>
                            <span style={{ ...FONT_MONO, fontSize: 8, color: c5, opacity: 0.9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="absolute bottom-[4%] right-[10%] w-11 h-11 rounded-full border-2 flex items-center justify-center z-[2]" style={{ borderColor: c5, opacity: 0.6, boxShadow: `0 0 12px ${c5}40` }}>
                        <span style={{ ...FONT_MONO, fontSize: 9, color: c5, opacity: 0.95 }}>01</span>
                      </div>
                      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(0,0,0,0.3) 100%)' }} />
                    </div>
                  )}
                  {item.type === 'materials' && (
                    <div className="absolute inset-0 rounded" style={{ background: c5 }}>
                      <div className="absolute inset-[6%] grid gap-1" style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
                        <div className="rounded relative overflow-hidden flex flex-col justify-end p-1" style={{ background: `linear-gradient(160deg, ${c6}, ${c1})` }}>
                          <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: `repeating-linear-gradient(175deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 6px)` }} />
                          <span style={{ ...FONT_MONO, fontSize: 5, letterSpacing: '0.1em', textTransform: 'uppercase', color: c5 }}>Walnut</span>
                        </div>
                        <div className="rounded relative overflow-hidden flex flex-col justify-end p-1" style={{ background: c6 }}>
                          <span style={{ ...FONT_MONO, fontSize: 5, letterSpacing: '0.1em', textTransform: 'uppercase', color: c5 }}>Concrete</span>
                        </div>
                        <div className="rounded relative overflow-hidden flex flex-col justify-end p-1" style={{ background: c3 }}>
                          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `linear-gradient(90deg, ${c1} 1px, transparent 1px), linear-gradient(0deg, ${c1} 1px, transparent 1px)`, backgroundSize: '8px 8px' }} />
                          <span style={{ ...FONT_MONO, fontSize: 5, letterSpacing: '0.1em', textTransform: 'uppercase', color: c1 }}>Ceramic</span>
                        </div>
                        <div className="rounded relative overflow-hidden flex flex-col justify-end p-1" style={{ background: `linear-gradient(145deg, ${c2}, ${c4})` }}>
                          <span style={{ ...FONT_MONO, fontSize: 5, letterSpacing: '0.1em', textTransform: 'uppercase', color: c1 }}>Brass</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {item.type === 'floorplan' && (
                    <div className="absolute inset-0 rounded" style={{ background: c5 }}>
                      <div className="absolute inset-[6%] opacity-[0.12]" style={{ backgroundImage: `linear-gradient(90deg, ${c1} 1px, transparent 1px), linear-gradient(0deg, ${c1} 1px, transparent 1px)`, backgroundSize: '10% 10%' }} />
                      <div className="absolute inset-[8%]">
                        <div className="absolute top-0 left-0 right-0" style={{ height: 3, background: c1 }} />
                        <div className="absolute bottom-0 left-0 right-0" style={{ height: 3, background: c1 }} />
                        <div className="absolute top-0 left-0 bottom-0" style={{ width: 3, background: c1 }} />
                        <div className="absolute top-0 right-0 bottom-0" style={{ width: 3, background: c1 }} />
                        <div className="absolute top-[45%] left-0" style={{ width: '55%', height: 2, background: c1 }} />
                        <div className="absolute top-[45%] left-[55%]" style={{ height: '55%', width: 2, background: c1 }} />
                        <div className="absolute rounded" style={{ top: '14%', left: '36%', right: '8%', height: '8%', background: c2, opacity: 0.28 }} />
                        <div className="absolute rounded-full border-2" style={{ top: '55%', left: '12%', width: 14, height: 14, borderColor: c1, opacity: 0.5 }} />
                        <div className="absolute rounded-full" style={{ top: '52%', left: '8%', width: 4, height: 4, background: c1, opacity: 0.45 }} />
                        <div className="absolute rounded-full" style={{ top: '52%', left: '22%', width: 4, height: 4, background: c1, opacity: 0.45 }} />
                        <span style={{ ...FONT_MONO, fontSize: 7, color: c1, opacity: 0.85, letterSpacing: '0.1em', textTransform: 'uppercase', position: 'absolute', top: '26%', left: '18%' }}>Brew Bar</span>
                        <span style={{ ...FONT_MONO, fontSize: 7, color: c1, opacity: 0.85, letterSpacing: '0.1em', textTransform: 'uppercase', position: 'absolute', top: '68%', left: '14%' }}>Lounge</span>
                      </div>
                      <div className="absolute top-[5%] right-[5%] flex flex-col items-center" style={{ opacity: 0.55 }}>
                        <span style={{ ...FONT_MONO, fontSize: 5, color: c1, fontWeight: 500 }}>N</span>
                        <div className="w-px mt-0.5" style={{ height: 8, background: c1 }} />
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

          {/* Spatial Guidelines — solo lámina completa */}
          {posterChrome && (
          <div className="absolute z-[60]" style={{ top: py(78), left: px(5), right: px(5) }}>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={{ ...FONT_MONO, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: c6 }}>Spatial Guidelines</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {SPATIAL_SPECS_CARDS.map((card) => (
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
          )}

          {posterChrome && (
          <>
          <div className="absolute bottom-[2%] right-[-4%] z-[4] font-serif leading-[0.65] opacity-[0.18] pointer-events-none select-none lowercase" style={{ ...FONT_SERIF, fontSize: 160, color: c3 }}>a</div>

          {/* Footer */}
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
