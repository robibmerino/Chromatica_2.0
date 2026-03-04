import type { PosterPalette } from '../types';
import {
  POSTER_BASE_WIDTH,
  POSTER_HEIGHT,
  POSTER_SCALE,
  COLLAGE_CLIP_1,
  COLLAGE_CLIP_2,
  COLLAGE_CLIP_3,
  COLLAGE_CLIP_5,
  COLLAGE_GRAIN_URL,
  COLLAGE_GRAIN2_URL,
} from '../constants';

export function PosterCollage({ posterColors: c }: { posterColors: PosterPalette }) {
  const c1 = c.primary;
  const c2 = c.accent;
  const c3 = c.secondary;
  const c4 = c.text;
  const c5 = c.background;
  const c6 = c.muted;
  const tapeStyle = { background: 'rgba(230,220,180,0.45)', borderTop: '1px solid rgba(200,190,150,0.3)', borderBottom: '1px solid rgba(200,190,150,0.3)' } as const;
  return (
    <div className="flex items-center justify-center w-full h-full min-h-0">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div className="relative overflow-hidden shadow-2xl rounded" style={{ width: POSTER_BASE_WIDTH, height: POSTER_HEIGHT, background: c5 }}>
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100, opacity: 0.55, mixBlendMode: 'multiply', backgroundImage: `url("${COLLAGE_GRAIN_URL}")`, backgroundSize: '150px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 101, opacity: 0.12, mixBlendMode: 'overlay', backgroundImage: `url("${COLLAGE_GRAIN2_URL}")`, backgroundSize: '200px' }} />
          <div className="absolute" style={{ top: '-3%', left: '-5%', width: '65%', height: '42%', background: c4, transform: 'rotate(-1.5deg)', zIndex: 1, clipPath: COLLAGE_CLIP_1 }} />
          <div className="absolute" style={{ bottom: '12%', right: '-4%', width: '70%', height: '28%', background: c1, transform: 'rotate(2deg)', zIndex: 3, clipPath: COLLAGE_CLIP_2 }} />
          <div className="absolute" style={{ top: '35%', right: '-3%', width: '45%', height: '25%', background: c3, transform: 'rotate(-3deg)', zIndex: 2, clipPath: COLLAGE_CLIP_3 }} />
          <div className="absolute" style={{ top: '30%', left: '-2%', width: '55%', height: '8%', background: c2, transform: 'rotate(1deg)', zIndex: 4 }} />
          <div className="absolute" style={{ top: '60%', left: '5%', width: '30%', height: '15%', background: c6, transform: 'rotate(-4deg)', zIndex: 2, clipPath: COLLAGE_CLIP_5 }} />
          <div className="absolute" style={{ top: '2%', left: '3%', zIndex: 10, fontFamily: "'Bebas Neue', sans-serif", fontSize: 140, lineHeight: 0.82, color: c5, textTransform: 'uppercase', letterSpacing: '-0.02em', transform: 'rotate(-1.5deg)' }}>WILD</div>
          <div className="absolute" style={{ top: '18%', left: '10%', zIndex: 12, fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 72, color: c2, transform: 'rotate(-5deg)', lineHeight: 0.9 }}>& free</div>
          <div className="absolute" style={{ top: '26%', left: '-1%', zIndex: 15, fontFamily: "'Abril Fatface', serif", fontSize: 120, lineHeight: 0.85, color: c4, textTransform: 'uppercase', letterSpacing: '-0.02em', transform: 'rotate(1deg)' }}>CHROM</div>
          <div className="absolute" style={{ top: '37%', left: '50%', zIndex: 14, fontFamily: "'Zilla Slab', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 42, color: c5, background: c4, padding: '2px 14px', transform: 'rotate(3deg)' }}>of</div>
          <div className="absolute" style={{ top: '37%', right: '5%', zIndex: 13, fontFamily: "'Rock Salt', cursive", fontSize: 38, color: c2, transform: 'rotate(-6deg)' }}>the</div>
          <div className="absolute" style={{ top: '58%', left: '2%', zIndex: 13, fontFamily: "'Permanent Marker', cursive", fontSize: 92, color: c5, lineHeight: 0.8, transform: 'rotate(-4deg)' }}>CRE</div>
          <div className="absolute" style={{ top: '68%', left: '15%', zIndex: 11, fontFamily: "'Bebas Neue', sans-serif", fontSize: 98, color: c4, lineHeight: 0.8, letterSpacing: '0.05em', transform: 'rotate(-1deg)' }}>ATIVE</div>
          <div className="absolute" style={{ bottom: '16%', right: '-1%', zIndex: 16, fontFamily: "'Abril Fatface', serif", fontSize: 155, lineHeight: 0.78, color: c5, textTransform: 'uppercase', letterSpacing: '-0.03em', transform: 'rotate(2deg)' }}>ATICA</div>
          <div className="absolute" style={{ bottom: '12%', right: '15%', zIndex: 17, fontFamily: "'Caveat', cursive", fontWeight: 400, fontSize: 68, color: c2, transform: 'rotate(4deg)' }}>follow</div>
          <div className="absolute" style={{ bottom: '-5%', left: '5%', zIndex: 18, fontFamily: "'Bebas Neue', sans-serif", fontSize: 168, lineHeight: 0.75, color: c4, textTransform: 'uppercase', letterSpacing: '-0.02em', transform: 'rotate(-1deg)', opacity: 0.85 }}>RULES</div>
          <div className="absolute" style={{ top: '42%', left: '35%', zIndex: 5, fontFamily: "'Abril Fatface', serif", fontSize: 200, color: c1, opacity: 0.12, lineHeight: 1, transform: 'rotate(15deg)' }}>*</div>
          <div className="absolute" style={{ top: '37%', left: '-1%', width: '52%', height: 10, zIndex: 16, transform: 'rotate(1deg)', background: `repeating-linear-gradient(90deg, transparent 0, transparent 2px, ${c1} 2px, ${c1} 4px)`, maskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10'%3E%3Cpath d='M0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5' fill='none' stroke='black' stroke-width='4'/%3E%3C/svg%3E\")", WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10'%3E%3Cpath d='M0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5' fill='none' stroke='black' stroke-width='4'/%3E%3C/svg%3E\")", maskSize: '32px 100%', WebkitMaskSize: '32px 100%' }} />
          <div className="absolute" style={{ top: '25%', right: '8%', width: 100, height: 100, border: `3px solid ${c1}`, borderRadius: '52% 48% 45% 55% / 50% 55% 45% 50%', transform: 'rotate(10deg)', zIndex: 6, opacity: 0.35 }} />
          <div className="absolute" style={{ top: '55%', right: '20%', zIndex: 14, fontFamily: "'Caveat', cursive", fontSize: 58, color: c6, transform: 'rotate(-30deg)' }}>→</div>
          <div className="absolute" style={{ top: '72%', left: '10%', width: '50%', height: 4, zIndex: 19, background: c4, transform: 'rotate(-2deg)', borderRadius: 2, opacity: 0.7 }} />
          <div className="absolute" style={{ top: '83%', left: '55%', width: 80, height: 2, background: c4, zIndex: 19, transform: 'rotate(8deg)', opacity: 0.4, borderRadius: 1 }} />
          <div className="absolute" style={{ top: '48%', left: '48%', width: 32, height: 32, background: c4, borderRadius: '60% 40% 55% 45% / 45% 60% 40% 55%', opacity: 0.15, zIndex: 5, transform: 'rotate(30deg)' }} />
          <div className="absolute" style={{ top: '8%', left: '52%', width: 110, height: 26, zIndex: 20, transform: 'rotate(25deg)', ...tapeStyle }} />
          <div className="absolute" style={{ bottom: '32%', left: '2%', width: 110, height: 26, zIndex: 20, transform: 'rotate(-8deg)', ...tapeStyle }} />
          <div className="absolute flex items-center justify-center" style={{ bottom: '6%', right: '6%', width: 72, height: 72, border: `3px solid ${c1}`, borderRadius: '50%', zIndex: 19, transform: 'rotate(-15deg)', opacity: 0.5 }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, color: c1, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Original</span>
          </div>
        </div>
      </div>
    </div>
  );
}
