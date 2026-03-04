import type { PosterPalette } from '../types';
import {
  POSTER_BASE_WIDTH,
  POSTER_HEIGHT,
  POSTER_SCALE,
  POSTER_REF_HEIGHT,
} from '../constants';

export function PosterFestivalGig({ posterColors: c }: { posterColors: PosterPalette }) {
  const k = POSTER_HEIGHT / POSTER_REF_HEIGHT;
  const ins = 14 * k;
  const rayCx = 310;
  const rayCy = 360;
  const rayLen = 500;
  const curvedTextStyle = { fontFamily: "'Playfair Display', serif", fontSize: 82, fontWeight: 900, letterSpacing: '0.08em' as const };
  const eyeIcon = (
    <svg width={22} height={14} viewBox="0 0 22 14">
      <ellipse cx={11} cy={7} rx={10} ry={6} fill="none" stroke={c.primary} strokeWidth={1.5} opacity={0.4} />
      <circle cx={11} cy={7} r={3} fill={c.accent} opacity={0.6} />
      <circle cx={11} cy={7} r={1} fill={c.primary} opacity={0.5} />
    </svg>
  );
  const waveStrokes = [c.primary, c.accent, c.secondary, c.primary, c.accent] as const;
  return (
    <div className="flex items-center justify-center w-full h-full min-h-0">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div
          className="relative overflow-hidden shadow-2xl"
          style={{ width: POSTER_BASE_WIDTH, height: POSTER_HEIGHT, backgroundColor: c.background, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <div className="absolute inset-0" style={{ border: `6px solid ${c.primary}` }} />
          <div className="absolute" style={{ top: ins, left: ins, right: ins, bottom: ins, border: `2px solid ${c.accent}`, borderRadius: 8 }} />
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 620 826">
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const rad = (angle * Math.PI) / 180;
              const x2 = rayCx + Math.cos(rad) * rayLen;
              const y2 = rayCy + Math.sin(rad) * rayLen;
              return (
                <line
                  key={`ray${i}`}
                  x1={rayCx}
                  y1={rayCy}
                  x2={x2}
                  y2={y2}
                  stroke={i % 2 === 0 ? c.primary : c.secondary}
                  strokeWidth={i % 3 === 0 ? 30 : 18}
                  opacity={i % 2 === 0 ? 0.08 : 0.05}
                />
              );
            })}
          </svg>
          <svg className="absolute pointer-events-none" style={{ bottom: 80 * k, left: 0 }} width={620} height={400 * k} viewBox="0 0 620 400">
            {[180, 220, 260, 300, 340].map((ry, i) => (
              <ellipse
                key={`wave${i}`}
                cx={310}
                cy={400}
                rx={280 - i * 10}
                ry={ry}
                fill="none"
                stroke={waveStrokes[i]}
                strokeWidth={3 - i * 0.4}
                opacity={0.15 + i * 0.03}
              />
            ))}
          </svg>
          <svg className="absolute pointer-events-none" style={{ top: 260 * k, left: 210 }} width={200} height={200} viewBox="0 0 200 200">
            <polygon
              points={Array.from({ length: 24 })
                .map((_, i) => {
                  const angle = (i * 360) / 24 - 90;
                  const rad = (angle * Math.PI) / 180;
                  const r = i % 2 === 0 ? 95 : 50;
                  return `${100 + Math.cos(rad) * r},${100 + Math.sin(rad) * r}`;
                })
                .join(' ')}
              fill={c.accent}
              opacity={0.85}
            />
            <circle cx={100} cy={100} r={38} fill={c.background} />
            <circle cx={100} cy={100} r={30} fill={c.accent} opacity={0.3} />
            <circle cx={100} cy={100} r={18} fill={c.background} />
            <circle cx={100} cy={100} r={6} fill={c.primary} />
          </svg>
          <svg className="absolute pointer-events-none" style={{ top: 60 * k, left: 0 }} width={620} height={200} viewBox="0 0 620 200">
            <defs>
              <path id="arcTopGig" d="M 60,180 Q 310,20 560,180" />
            </defs>
            <text fill={c.primary} style={curvedTextStyle}>
              <textPath href="#arcTopGig" startOffset="50%" textAnchor="middle">CHROM</textPath>
            </text>
          </svg>
          <svg className="absolute pointer-events-none" style={{ top: 380 * k, left: 0 }} width={620} height={200} viewBox="0 0 620 200">
            <defs>
              <path id="arcBottomGig" d="M 80,30 Q 310,190 540,30" />
            </defs>
            <text fill={c.primary} style={curvedTextStyle}>
              <textPath href="#arcBottomGig" startOffset="50%" textAnchor="middle">ATICA</textPath>
            </text>
          </svg>
          <div className="absolute w-full text-center" style={{ top: 505 * k, fontFamily: "'Playfair Display', serif", fontSize: 72, fontWeight: 900, letterSpacing: '0.2em', color: c.primary }}>FESTIVAL</div>
          {[
            { top: 30 * k, left: 32 },
            { top: 30 * k, right: 32 },
            { bottom: 165 * k, left: 32 },
            { bottom: 165 * k, right: 32 },
          ].map((pos, i) => (
            <svg key={`star${i}`} className="absolute" style={pos} width={28} height={28} viewBox="0 0 28 28">
              <polygon points="14,0 17,11 28,14 17,17 14,28 11,17 0,14 11,11" fill={c.accent} opacity={0.7} />
            </svg>
          ))}
          <div className="absolute w-full text-center" style={{ top: 590 * k }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', color: c.primary, lineHeight: 2.2 }}>
              THE MIDNIGHT ECHO <span style={{ color: c.accent, fontSize: 10 }}>★</span> CRYSTAL VORTEX <span style={{ color: c.accent, fontSize: 10 }}>★</span> NEON DRIFT
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: c.secondary, lineHeight: 2.2 }}>
              AURORA PULSE <span style={{ color: c.accent, fontSize: 8 }}>★</span> SILVER GHOST <span style={{ color: c.accent, fontSize: 8 }}>★</span> DREAMWAVE COLLECTIVE
            </div>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', color: c.muted, lineHeight: 2.2 }}>
              VELVET HAZE • STARFIELD • ECHO CHAMBER • MIDNIGHT SUN • LUNAR TIDE
            </div>
          </div>
          <div
            className="absolute"
            style={{ top: 680 * k, left: 30, right: 30, height: 32 * k, backgroundColor: c.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}
          >
            {['★ LIVE MUSIC', '★ ARTS', '★ VIBES', '★'].map((text, i) => (
              <span key={i} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: i % 2 === 0 ? c.accent : c.background }}>{text}</span>
            ))}
          </div>
          <div className="absolute w-full text-center" style={{ top: 716 * k }}>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '0.15em', color: c.primary, fontFamily: "'Playfair Display', serif" }}>AUGUST 15 — 17, 2026</div>
            <div className="flex items-center justify-center gap-3" style={{ marginTop: 8 }}>
              <svg width={16} height={10} viewBox="0 0 16 10">
                <polygon points="0,5 5,0 10,5 5,10" fill={c.accent} opacity={0.6} />
                <polygon points="6,5 11,0 16,5 11,10" fill={c.accent} opacity={0.3} />
              </svg>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', color: c.secondary, textTransform: 'uppercase' }}>Red Rocks Amphitheatre</span>
              <svg width={16} height={10} viewBox="0 0 16 10">
                <polygon points="6,5 11,0 16,5 11,10" fill={c.accent} opacity={0.6} />
                <polygon points="0,5 5,0 10,5 5,10" fill={c.accent} opacity={0.3} />
              </svg>
            </div>
          </div>
          <svg className="absolute pointer-events-none" style={{ bottom: 42 * k, left: 30 }} width={560} height={16} viewBox="0 0 560 16">
            <polyline
              points={Array.from({ length: 41 }).map((_, i) => `${i * 14},${i % 2 === 0 ? 2 : 14}`).join(' ')}
              fill="none"
              stroke={c.accent}
              strokeWidth={2}
              opacity={0.4}
            />
          </svg>
          <div className="absolute w-full flex justify-center items-center gap-4" style={{ bottom: 26 * k }}>
            {eyeIcon}
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', color: c.primary, textTransform: 'uppercase' }}>Get Your Tickets</span>
            {eyeIcon}
          </div>
        </div>
      </div>
    </div>
  );
}
