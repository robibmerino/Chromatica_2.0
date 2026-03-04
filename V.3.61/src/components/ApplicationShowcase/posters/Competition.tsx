import React from 'react';
import type { PosterPalette } from '../types';
import {
  POSTER_BASE_WIDTH,
  POSTER_HEIGHT,
  POSTER_SCALE,
  COMPETITION_GRAIN_URL,
  COMPETITION_PAPER_URL,
} from '../constants';

export function PosterCompetition({ posterColors: c }: { posterColors: PosterPalette }) {
  const c1 = c.text;
  const c2 = c.primary;
  const c3 = c.accent;
  const c4 = c.surface;
  const c5 = c.background;
  const c6 = c.muted;
  const footerItems: { label: string; value: string; highlight?: boolean }[] = [
    { label: 'Deadline', value: '15.09.2025', highlight: true },
    { label: 'Prize', value: '€ 25.000' },
    { label: 'Category', value: 'Open' },
    { label: 'Registration', value: 'chromatica.upv', highlight: true },
  ];
  return (
    <div className="flex items-center justify-center w-full h-full min-h-0">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div className="relative overflow-hidden shadow-2xl" style={{ width: POSTER_BASE_WIDTH, height: POSTER_HEIGHT, background: c5, fontFamily: "'DM Sans', sans-serif" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 200, opacity: 0.3, mixBlendMode: 'multiply', backgroundImage: `url("${COMPETITION_GRAIN_URL}")`, backgroundSize: '128px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, opacity: 0.04, backgroundImage: `url("${COMPETITION_PAPER_URL}")`, backgroundSize: '256px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.06, backgroundImage: `linear-gradient(90deg, ${c1} 1px, transparent 1px), linear-gradient(0deg, ${c1} 1px, transparent 1px)`, backgroundSize: '8.33% 5%' }} />
          <div className="absolute top-0 bottom-0 left-[4%] w-px pointer-events-none" style={{ zIndex: 3, opacity: 0.08, background: `linear-gradient(to bottom, ${c1}, ${c6} 7%, ${c6} 94.5%, ${c1})` }} />
          <div className="absolute top-0 bottom-0 right-[4%] w-px pointer-events-none" style={{ zIndex: 3, opacity: 0.08, background: `linear-gradient(to bottom, ${c1}, ${c6} 7%, ${c6} 94.5%, ${c1})` }} />
          <div className="absolute top-0 left-0 right-0" style={{ height: '7%', background: c1, zIndex: 15 }}>
            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: c2 }} />
          </div>
          <div className="absolute" style={{ top: '0.5%', right: '5%', zIndex: 20, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 52, color: c5, lineHeight: 1, opacity: 0.15 }}>XII</div>
          <div className="absolute" style={{ top: '1.5%', left: '5%', zIndex: 20, fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: c3 }}>International Architecture Competition</div>
          <div className="absolute" style={{ top: '4%', left: '5%', zIndex: 20, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', color: c5, textTransform: 'uppercase' }}>Open Call — 2025 / 2026</div>
          <div className="absolute" style={{ top: '10%', left: '5%', right: '5%', zIndex: 30 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 18, color: c6, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>Rethinking</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 82, lineHeight: 0.88, color: c1, textTransform: 'uppercase', letterSpacing: '-0.04em' }}>HABI</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 95, lineHeight: 0.82, color: 'transparent', textTransform: 'uppercase', letterSpacing: '-0.03em', WebkitTextStroke: `1.5px ${c1}` }}>TAT</div>
            <div className="flex items-baseline gap-3" style={{ marginTop: 0 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 52, color: c2, lineHeight: 1 }}>&</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 78, lineHeight: 0.88, color: c1, textTransform: 'uppercase', letterSpacing: '-0.04em' }}>FORM</span>
            </div>
          </div>
          <div className="absolute" style={{ top: '43%', left: '5%', maxWidth: '50%', zIndex: 30 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 20, color: c1, lineHeight: 1.25 }}>Designing spaces where <em style={{ color: c2, fontStyle: 'italic' }}>structure</em><br />meets the human <em style={{ color: c2, fontStyle: 'italic' }}>experience</em></div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 8, color: c6, lineHeight: 1.6, marginTop: 6, letterSpacing: '0.02em', maxWidth: '95%' }}>An open call for visionary proposals that challenge the boundaries between built form, landscape and the collective memory of place.</div>
          </div>
          <div className="absolute" style={{ top: '60%', left: '8%', width: '52%', height: '24%', zIndex: 12, border: `1px solid ${c6}`, opacity: 0.8 }}>
            <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: c1 }} />
            <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: c1 }} />
            <div className="absolute top-0 right-0 w-[3px] h-[70%]" style={{ background: c1 }} />
            <div className="absolute bottom-0 left-0 w-[60%] h-[3px]" style={{ background: c1 }} />
            <div className="absolute bottom-0 right-0 w-[25%] h-[3px]" style={{ background: c1 }} />
            <div className="absolute top-[30%] left-[35%] w-[3px] h-[45%]" style={{ background: c1 }} />
            <div className="absolute top-[30%] left-[35%] w-[30%] h-[3px]" style={{ background: c1 }} />
            <div className="absolute top-[65%] left-0 w-[35%] h-[2px]" style={{ background: c1 }} />
            <div className="absolute top-[65%] left-[35%] w-[2px] h-[35%]" style={{ background: c1 }} />
            <div className="absolute top-[65%] left-[57%] w-[18%] h-[12%] border-[1.5px] rounded-t-full opacity-60" style={{ borderColor: c6, borderBottom: 'none' }} />
            <div className="absolute top-[63%] right-[2%] w-[22%] aspect-square border border-dashed rounded-full opacity-35 overflow-hidden" style={{ borderColor: c6, clipPath: 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)' }} />
            {[0, 1, 2, 3, 4].map((i) => <div key={i} className="absolute left-0 w-full border-b opacity-50" style={{ bottom: `${i * 20}%`, height: '20%', borderColor: c6 }} />)}
            {[[28, 18], [28, 52], [55, 18], [55, 72]].map(([t, l], i) => <div key={i} className="absolute w-1.5 aspect-square rounded-sm" style={{ top: `${t}%`, left: `${l}%`, background: c1 }} />)}
            <div className="absolute -bottom-[10%] left-0" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7, letterSpacing: '0.2em', color: c6, textTransform: 'uppercase' }}>Plan — Level 00</div>
            <div className="absolute -bottom-[10%] right-0" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7, color: c6 }}>1 : 200</div>
          </div>
          <div className="absolute" style={{ top: '56%', right: '3%', width: '35%', aspectRatio: '1.618 / 1', zIndex: 8, opacity: 0.1 }}>
            <div className="absolute inset-0 border" style={{ borderColor: c1 }} />
            <div className="absolute top-0 right-0 w-[61.8%] h-full border border-l-0" style={{ borderColor: c1 }} />
            <div className="absolute bottom-0 right-0 w-[61.8%] h-[61.8%] border border-t-0 border-l-0" style={{ borderColor: c1 }} />
            <div className="absolute bottom-0 left-0 w-[38.2%] h-[61.8%] border border-t-0" style={{ borderColor: c1 }} />
            <div className="absolute top-0 left-0 w-[76.4%] aspect-square border rounded-full overflow-hidden" style={{ borderColor: c2, clipPath: 'polygon(38.2% 0, 100% 0, 100% 100%, 38.2% 100%)' }} />
          </div>
          <div className="absolute" style={{ top: '62%', right: '5%', width: '30%', height: '18%', zIndex: 14, opacity: 0.7 }}>
            <div className="absolute -top-[14%] left-0" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7, letterSpacing: '0.15em', color: c6, textTransform: 'uppercase' }}>South Elevation</div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: c1 }} />
            <div className="absolute bottom-0.5 left-[10%] w-[80%] h-[55%] border-[1.5px] border-b-0" style={{ borderColor: c1 }} />
            <div className="absolute border-[1.5px] border-b-0" style={{ bottom: 'calc(2px + 55%)', left: '5%', width: '90%', height: '25%', borderColor: c1, clipPath: 'polygon(0 100%, 10% 0, 90% 0, 100% 100%)' }} />
            {[18, 42, 66].map((left, i) => <div key={i} className="absolute border bottom-[15%] w-[15%] h-[30%] opacity-30" style={{ left: `${left}%`, borderColor: c6, background: c3 }} />)}
          </div>
          <div className="absolute flex items-center justify-center" style={{ top: '18%', right: '16%', width: 72, height: 72, zIndex: 22, opacity: 0.12 }}>
            <div className="absolute inset-0 rounded-full border-[1.5px]" style={{ borderColor: c1 }} />
            <div className="absolute inset-[18%] rounded-full border" style={{ borderColor: c1 }} />
            {[0, 45, 90, 135].map((rot, i) => <div key={i} className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2" style={{ background: c1, transform: `translateX(-50%) rotate(${rot}deg)` }} />)}
            <span style={{ position: 'relative', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 14, color: c1 }}>FA</span>
          </div>
          <div className="absolute flex items-center gap-1" style={{ top: '6%', left: '5%', zIndex: 10 }}>
            <div className="w-px h-2" style={{ background: c6, opacity: 0.5 }} />
            <div className="h-px" style={{ width: 70, background: c6, opacity: 0.5 }} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: c6, padding: '0 4px', whiteSpace: 'nowrap' }}>12.400</span>
            <div className="h-px" style={{ width: 70, background: c6, opacity: 0.5 }} />
            <div className="w-px h-2" style={{ background: c6, opacity: 0.5 }} />
          </div>
          <div className="absolute flex items-center gap-1 flex-row-reverse" style={{ bottom: '11%', right: '5%', zIndex: 10 }}>
            <div className="w-px h-2" style={{ background: c6, opacity: 0.5 }} />
            <div className="h-px" style={{ width: 90, background: c6, opacity: 0.5 }} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: c6, padding: '0 4px', whiteSpace: 'nowrap' }}>8.250</span>
            <div className="h-px" style={{ width: 90, background: c6, opacity: 0.5 }} />
            <div className="w-px h-2" style={{ background: c6, opacity: 0.5 }} />
          </div>
          <div className="absolute flex flex-col items-center gap-1" style={{ right: '3%', top: '24%', zIndex: 10 }}>
            <div className="w-2 h-px" style={{ background: c6, opacity: 0.5 }} />
            <div className="w-px" style={{ height: 70, background: c6, opacity: 0.5 }} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: c6, writingMode: 'vertical-rl', transform: 'rotate(180deg)', padding: '4px 0', whiteSpace: 'nowrap' }}>±0.00</span>
          </div>
          <div className="absolute w-3 aspect-square opacity-25" style={{ top: '59%', left: '6%', zIndex: 10 }}>
            <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2" style={{ background: c1 }} />
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: c1 }} />
          </div>
          <div className="absolute w-3 aspect-square opacity-25" style={{ top: '86%', right: '38%', zIndex: 10 }}>
            <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2" style={{ background: c1 }} />
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: c1 }} />
          </div>
          {[['58%', '27%', 'A'], ['58%', '50%', 'B'], ['82%', '14%', '1']].map(([t, l, label], i) => (
            <div key={i} className="absolute flex items-center justify-center rounded-full border-[1.5px]" style={{ top: t, left: l, width: 26, height: 26, borderColor: c1, zIndex: 20 } as React.CSSProperties}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, color: c1 }}>{label}</span>
            </div>
          ))}
          <div className="absolute flex flex-col items-center" style={{ top: '18%', right: '6%', zIndex: 25, width: 36, opacity: 0.5 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 11, color: c1 }}>N</span>
            <div className="relative w-px mt-0.5" style={{ height: 22, background: c1 }} />
            <div className="w-4 aspect-square rounded-full border mt-0.5" style={{ borderColor: c1 }} />
          </div>
          <div className="absolute opacity-[0.08]" style={{ top: '66%', left: '12%', width: '15%', height: '8%', zIndex: 11, background: `repeating-linear-gradient(45deg, ${c1}, ${c1} 1px, transparent 1px, transparent 5px)` }} />
          <div className="absolute opacity-[0.06]" style={{ top: '71%', left: '30%', width: '12%', height: '6%', zIndex: 11, backgroundImage: `linear-gradient(90deg, ${c1} 1px, transparent 1px), linear-gradient(0deg, ${c1} 1px, transparent 1px)`, backgroundSize: '6px 4px' }} />
          <div className="absolute flex items-center gap-2" style={{ bottom: '8%', left: '5%', zIndex: 42, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 300, fontSize: 9, color: c1, letterSpacing: '0.1em' }}>
            <div className="w-1.5 aspect-square rounded-full" style={{ background: c2 }} />
            <span>41°53&apos;24.8&quot;N 12°29&apos;32.5&quot;E</span>
          </div>
          <div className="absolute left-0 right-0 h-0.5" style={{ bottom: '5.5%', background: c2, zIndex: 40 }} />
          <div className="absolute bottom-0 left-0 right-0 grid items-center" style={{ height: '5.5%', background: c1, zIndex: 35, gridTemplateColumns: '1fr 1px 1fr 1px 1fr 1px 1fr', padding: '0 5%' }}>
            {footerItems.flatMap((item, i) => [
              ...(i > 0 ? [<div key={`sep-${i}`} className="h-1/2" style={{ background: c4 }} />] : []),
              <div key={item.label} className="flex flex-col px-3">
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 6, letterSpacing: '0.25em', textTransform: 'uppercase', color: c6, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: 11, color: item.highlight ? c2 : c5, letterSpacing: '0.05em' }}>{item.value}</div>
              </div>,
            ])}
          </div>
          <div className="absolute pointer-events-none select-none whitespace-nowrap" style={{ top: '64%', left: '50%', transform: 'translate(-50%, -50%) rotate(-35deg)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 140, color: c1, opacity: 0.025, textTransform: 'uppercase', letterSpacing: '-0.04em', zIndex: 5 }}>HABITAT</div>
        </div>
      </div>
    </div>
  );
}
