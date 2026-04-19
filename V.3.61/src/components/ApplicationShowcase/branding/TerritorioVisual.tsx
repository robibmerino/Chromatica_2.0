import type { PosterPalette } from '../types';
import {
  POSTER_BASE_WIDTH,
  POSTER_HEIGHT,
  POSTER_SCALE,
  BRANDING_GRAIN_URL,
  BRANDING_KRAFT_URL,
} from '../constants';
import { FONT_SANS, FONT_SERIF, FONT_CURSIVE, FONT_MONO, AURA_LOWERCASE } from './brandingFonts';

interface Props {
  posterColors: PosterPalette;
  sceneOnly?: boolean;
}

export function TerritorioVisual({ posterColors, sceneOnly }: Props) {
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
  /** Lámina completa (tipografía, paleta, patrón, aplicaciones). Solo se ocultan banner, pie y texturas con `sceneOnly`. */
  const posterChrome = !sceneOnly;

  const patternBarHeight = 64;

  const patternStrip = (
    <>
      <div className="font-mono uppercase tracking-[0.3em] mb-2" style={{ ...FONT_MONO, fontSize: 10, color: c6 }}>
        Brand Pattern
      </div>
      <div className="w-full rounded-lg overflow-hidden relative flex-shrink-0" style={{ height: patternBarHeight, background: c1 }}>
        <div
          className="absolute flex flex-col justify-start"
          style={{
            top: -8,
            left: -50,
            width: 'calc(100% + 100px)',
            height: 120,
            marginLeft: 18,
          }}
        >
          {Array.from({ length: 6 }, (_, rowIndex) => (
            <div key={rowIndex} className="flex flex-shrink-0 items-center gap-0" style={{ height: 28, transform: rowIndex % 2 === 1 ? 'translateX(18px)' : undefined }}>
              {Array.from({ length: 32 }, (_, colIndex) => (
                <div key={colIndex} className="flex items-center justify-center flex-shrink-0" style={{ width: 22, height: 28 }}>
                  <div
                    className="rounded-[50%_2px_50%_2px]"
                    style={{
                      width: 14,
                      height: 20,
                      border: `3px solid ${c4}`,
                      opacity: 0.7,
                      transform: colIndex % 2 === 1 ? 'scaleX(-1) rotate(-8deg)' : 'rotate(-8deg)',
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const applicationsGrid = (
    <>
      <div className="font-mono uppercase tracking-[0.3em] mb-3" style={{ ...FONT_MONO, fontSize: 10, color: c6 }}>
        Applications
      </div>
      <div className="grid grid-cols-4 gap-4 w-full min-h-0">
        <div className="flex flex-col gap-2 items-center min-h-0">
          <div className="w-full rounded-lg overflow-hidden flex items-center justify-center min-h-[100px]" style={{ aspectRatio: 0.7, background: c3 }}>
            <div className="flex flex-col items-center w-[38%] h-[65%]">
              <div className="w-[110%] h-[10%] rounded-t" style={{ background: c1 }} />
              <div className="w-full flex-1 border border-t-0 rounded-b flex flex-col items-center justify-center relative" style={{ background: c5, borderColor: c1 }}>
                <div className="absolute top-[30%] left-0 right-0 h-[30%]" style={{ background: c2, opacity: 0.25 }} />
                <span className="font-serif tracking-widest lowercase z-[1]" style={{ ...AURA_LOWERCASE, fontSize: 11, color: c1 }}>
                  aura
                </span>
              </div>
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-center" style={{ ...FONT_MONO, color: c6 }}>Takeaway Cup</span>
        </div>
        <div className="flex flex-col gap-2 items-center min-h-0">
          <div className="w-full rounded-lg overflow-hidden flex flex-col items-center justify-center gap-1.5 relative min-h-[100px]" style={{ aspectRatio: 0.7, background: c1 }}>
            <div className="absolute top-0 left-0 right-0 h-[12%]" style={{ background: c4, opacity: 0.4 }} />
            <div className="flex flex-col items-center justify-center gap-1 rounded p-1.5" style={{ width: '58%', aspectRatio: 1, border: `2px solid ${c2}` }}>
              <span className="font-serif tracking-widest lowercase" style={{ ...AURA_LOWERCASE, fontSize: 13, color: c5 }}>
                aura
              </span>
              <div className="w-[40%] h-px" style={{ background: c5, opacity: 0.8 }} />
              <span className="font-cursive" style={{ ...FONT_CURSIVE, fontSize: 11, color: c5 }}>
                single origin
              </span>
            </div>
            <span className="font-mono tracking-wider" style={{ ...FONT_MONO, fontSize: 10, color: c5 }}>
              250g
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-center" style={{ ...FONT_MONO, color: c6 }}>Coffee Bag</span>
        </div>
        <div className="flex flex-col gap-2 items-center min-h-0">
          <div className="w-full rounded-lg overflow-hidden flex flex-col items-center justify-center gap-2.5 p-3 min-h-[100px]" style={{ aspectRatio: 0.7, background: c4 }}>
            <span className="font-cursive font-medium text-center" style={{ ...FONT_CURSIVE, fontSize: 18, color: c5 }}>
              your journey
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2" style={{ borderColor: i < 5 ? c2 : c5, opacity: i < 5 ? 0.7 : 0.5, background: i < 5 ? c2 : 'transparent' }} />
              ))}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-50" style={{ ...FONT_MONO, color: c3 }}>
              Loyalty Card
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-center" style={{ ...FONT_MONO, color: c6 }}>Stamp Card</span>
        </div>
        <div className="flex flex-col gap-2 items-center min-h-0">
          <div className="w-full rounded-lg overflow-hidden flex items-center justify-center relative min-h-[100px]" style={{ aspectRatio: 0.7, background: c3 }}>
            <div className="relative flex flex-col items-center w-[50%] h-[60%]" style={{ opacity: 0.55 }}>
              <div className="w-[30%] h-[12%] rounded-b-[50%]" style={{ borderBottom: `2px solid ${c1}`, borderLeft: `2px solid ${c1}`, borderRight: `2px solid ${c1}` }} />
              <div className="w-full flex-1 rounded-b flex items-center justify-center mt-[-2px]" style={{ borderLeft: `2px solid ${c1}`, borderRight: `2px solid ${c1}`, borderBottom: `2px solid ${c1}` }}>
                <span className="font-serif tracking-widest lowercase" style={{ ...AURA_LOWERCASE, fontSize: 13, color: c1 }}>
                  aura
                </span>
              </div>
              <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[50%] h-[18%] rounded-b" style={{ border: `2px solid ${c1}`, borderTopWidth: 2.5 }} />
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-center" style={{ ...FONT_MONO, color: c6 }}>Apron</span>
        </div>
      </div>
    </>
  );

  const typographyAndPalette = (
    <div className="grid w-full" style={{ gridTemplateColumns: '1fr 1px 1.15fr', gap: 24 }}>
      <div>
        <div className="font-mono uppercase tracking-[0.3em] mb-3" style={{ ...FONT_MONO, fontSize: 10, color: c6 }}>Typography</div>
        <div className="flex items-baseline mb-2" style={{ gap: 12 }}>
          <div className="flex-shrink-0" style={{ width: 58 }}>
            <span className="font-serif leading-none" style={{ ...FONT_SERIF, fontSize: 48, color: c1 }}>Aa</span>
          </div>
          <div className="flex flex-col min-w-0" style={{ marginLeft: 4 }}>
            <span className="font-mono tracking-wide" style={{ ...FONT_MONO, fontSize: 11, color: c1 }}>Libre Baskerville</span>
            <span className="font-mono tracking-wide" style={{ ...FONT_MONO, fontSize: 9, color: c6 }}>Regular — Primary</span>
          </div>
        </div>
        <div className="flex items-baseline mb-2" style={{ gap: 12 }}>
          <div className="flex-shrink-0" style={{ width: 58 }}>
            <span className="leading-none" style={{ ...FONT_CURSIVE, fontWeight: 500, fontSize: 40, color: c4 }}>Aa</span>
          </div>
          <div className="flex flex-col min-w-0" style={{ marginLeft: 4 }}>
            <span className="font-mono" style={{ ...FONT_MONO, fontSize: 11, color: c4 }}>Caveat</span>
            <span className="font-mono" style={{ ...FONT_MONO, fontSize: 9, color: c6 }}>Handwritten — Accent</span>
          </div>
        </div>
        <div className="flex items-baseline mb-3" style={{ gap: 12 }}>
          <div className="flex-shrink-0" style={{ width: 58 }}>
            <span className="leading-none font-light" style={{ ...FONT_SANS, fontSize: 34, color: c.textLight }}>Aa</span>
          </div>
          <div className="flex flex-col min-w-0" style={{ marginLeft: 4 }}>
            <span className="font-mono" style={{ ...FONT_MONO, fontSize: 11, color: c.textLight }}>Plus Jakarta Sans</span>
            <span className="font-mono" style={{ ...FONT_MONO, fontSize: 9, color: c6 }}>Light — Body</span>
          </div>
        </div>
        <div style={{ ...FONT_CURSIVE, fontSize: 16, color: c4, opacity: 0.6 }}>brewed with intention</div>
      </div>
      <div style={{ background: `linear-gradient(to bottom, ${c3}, transparent)` }} />
      <div>
        <div className="font-mono uppercase tracking-[0.3em] mb-3" style={{ ...FONT_MONO, fontSize: 10, color: c6 }}>Color Palette</div>
        <div className="grid grid-cols-3 gap-2">
          {[c1, c2, c3, c4, c5, c6].map((bg, i) => {
            const fg = [c1, c4, c6].includes(bg) ? c5 : c1;
            return (
              <div key={i} className="aspect-square rounded-md flex flex-col justify-end items-center p-1.5 pb-1" style={{ background: bg, border: bg === c5 ? `1px solid ${c3}` : undefined }}>
                <span className="font-mono text-[9px] font-semibold tracking-wide opacity-90 whitespace-nowrap text-center" style={{ ...FONT_MONO, color: fg }}>{bg}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

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
            </>
          )}
          {posterChrome && (
            <>
              <div className="absolute top-0 left-0 right-0 z-[1]" style={{ height: '25%', background: c1 }}>
                <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${c2}, ${c4}, ${c2})`, opacity: 0.5 }} />
              </div>
              <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: '25%', zIndex: 3, opacity: 0.03, backgroundImage: `radial-gradient(circle at 20% 30%, ${c4} 1px, transparent 1px), radial-gradient(circle at 60% 70%, ${c4} 1px, transparent 1px), radial-gradient(circle at 80% 20%, ${c4} 1px, transparent 1px), radial-gradient(circle at 40% 80%, ${c4} 1px, transparent 1px)`, backgroundSize: '60px 60px, 45px 45px, 55px 55px, 50px 50px' }} />
              {['tl', 'tr', 'bl', 'br'].map((pos) => (
                <div key={pos} className="absolute w-5 h-5 opacity-[0.12]" style={{ zIndex: 60, width: px(3.2), height: px(3.2), ...(pos === 'tl' ? { top: py(1.5), left: px(2) } : pos === 'tr' ? { top: py(1.5), right: px(2) } : pos === 'bl' ? { bottom: py(5.5), left: px(2) } : { bottom: py(5.5), right: px(2) }) }}>
                  <div className="absolute top-0 left-0 w-full h-px" style={{ background: c6 }} />
                  <div className="absolute top-0 left-0 w-px h-full" style={{ background: c6 }} />
                </div>
              ))}
              <div className="absolute left-1/2 -translate-x-1/2 z-[50] flex flex-col items-center justify-center" style={{ width: '100%', top: '-1%' }}>
                <div className="relative flex flex-col items-center" style={{ width: 130, aspectRatio: 1 }}>
                  <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[52%] h-[38%] rounded-b-[40%]" style={{ borderLeft: `4px solid ${c5}`, borderRight: `4px solid ${c5}`, borderBottom: `4px solid ${c5}`, opacity: 0.72 }} />
                  <div className="absolute left-1/2 -translate-x-1/2 w-[28%] rounded-full" style={{ bottom: '13%', height: 4, background: c5, opacity: 0.72 }} />
                  <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -rotate-[8deg] w-[28%] h-[38%] border rounded-[50%_2px_50%_2px]" style={{ borderColor: c4, borderWidth: 4 }} />
                </div>
                <div className="w-full flex flex-col items-center" style={{ marginTop: -12 }}>
                  <div className="font-serif lowercase leading-none text-center" style={{ ...AURA_LOWERCASE, color: c5, fontSize: 52, letterSpacing: '0.26em', marginLeft: 10 }}>aura</div>
                  <div className="font-cursive text-center" style={{ ...FONT_CURSIVE, color: c5, fontSize: 18, letterSpacing: '0.12em', marginTop: -2 }}>slow brew coffe</div>
                </div>
              </div>
              <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[260px] aspect-square z-[5] opacity-[0.025] pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border" style={{ borderColor: c3 }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68%] h-[68%] rounded-full border" style={{ borderColor: c3 }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36%] h-[36%] rounded-full border" style={{ borderColor: c3 }} />
                <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2" style={{ background: c3 }} />
                <div className="absolute left-1/2 top-0 w-px h-full -translate-x-1/2" style={{ background: c3 }} />
              </div>
              <div className="absolute z-[62] h-0.5 rounded-full" style={{ top: '24.8%', left: '5%', width: 40, background: c4 }} />
            </>
          )}
          {posterChrome && (
          <div className="absolute grid z-[60]" style={{ top: '27%', left: '5%', right: '5%' }}>
            {typographyAndPalette}
          </div>
          )}
          {sceneOnly ? (
            <div className="absolute z-[60] flex flex-col items-stretch gap-4" style={{ top: py(3), bottom: py(3), left: px(5), right: px(5) }}>
              {typographyAndPalette}
              {patternStrip}
              {applicationsGrid}
            </div>
          ) : (
            <>
              <div className="absolute z-[60]" style={{ top: '54%', left: px(5), right: px(5) }}>
                {patternStrip}
              </div>
              <div className="absolute z-[60]" style={{ top: '68%', left: px(5), right: px(5) }}>
                {applicationsGrid}
              </div>
            </>
          )}
          {posterChrome && (
          <>
          <div className="absolute bottom-[2%] right-[-4%] z-[4] font-serif leading-[0.65] opacity-25 pointer-events-none select-none lowercase" style={{ ...FONT_SERIF, fontSize: 180, color: c3 }}>a</div>
          <div className="absolute bottom-0 left-0 right-0 z-[100] flex items-center justify-center" style={{ height: '4%', background: c1 }}>
            <div className="flex items-center gap-2">
              <div className="rounded-full" style={{ width: 4, height: 4, background: c3 }} />
              <span className="font-serif text-[12px] tracking-[0.35em] lowercase" style={{ ...FONT_SERIF, color: c3, textIndent: '0.35em' }}>aura</span>
              <div className="rounded-full" style={{ width: 4, height: 4, background: c3 }} />
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
