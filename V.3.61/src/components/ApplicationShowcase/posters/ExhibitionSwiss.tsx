import type { PosterPalette } from '../types';
import {
  POSTER_BASE_WIDTH,
  POSTER_HEIGHT,
  POSTER_SCALE,
  POSTER_REF_HEIGHT,
} from '../constants';

export function PosterExhibitionSwiss({ posterColors: c }: { posterColors: PosterPalette }) {
  const k = POSTER_HEIGHT / POSTER_REF_HEIGHT;
  return (
    <div className="flex items-center justify-center w-full h-full min-h-0">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div
          className="relative overflow-hidden shadow-2xl"
          style={{ width: POSTER_BASE_WIDTH, height: POSTER_HEIGHT, backgroundColor: c.background, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <line key={`v${i}`} x1={i * (POSTER_BASE_WIDTH / 6)} y1={0} x2={i * (POSTER_BASE_WIDTH / 6)} y2={POSTER_HEIGHT} stroke={c.text} strokeWidth={1} />
            ))}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <line key={`h${i}`} x1={0} y1={i * (POSTER_HEIGHT / 8)} x2={POSTER_BASE_WIDTH} y2={i * (POSTER_HEIGHT / 8)} stroke={c.text} strokeWidth={1} />
            ))}
          </svg>
          <div className="absolute top-0 left-0 right-0" style={{ height: 8, backgroundColor: c.accent }} />
          <div className="absolute" style={{ top: 28 * k, left: 36, right: 36 }}>
            <div className="flex justify-between items-start">
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: c.muted }}>International</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: c.muted }}>Design Exhibition</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: c.accent, textAlign: 'right' }}>2026</div>
            </div>
          </div>
          <div
            className="absolute"
            style={{ top: 80 * k, right: -60, width: 320, height: 320, borderRadius: '50%', backgroundColor: c.primary, opacity: 0.12 }}
          />
          <div className="absolute" style={{ top: 100 * k, left: 36, right: 36 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 220, fontWeight: 900, lineHeight: 0.85, color: c.primary, letterSpacing: '-0.04em' }}>Ty</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 220, fontWeight: 900, lineHeight: 0.85, color: c.primary, letterSpacing: '-0.04em', marginTop: -10 }}>po</div>
          </div>
          <div className="absolute" style={{ top: 420 * k, left: 0, right: 0, height: 56 * k, backgroundColor: c.accent }}>
            <div className="flex items-center h-full" style={{ paddingLeft: 36, paddingRight: 36 }}>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: c.background }}>The Art of Visual Typography</span>
            </div>
          </div>
          <div
            className="absolute"
            style={{ top: 496 * k, left: 36, width: 260, height: 180 * k, backgroundColor: c.secondary, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, color: c.background, fontFamily: "'Playfair Display', serif" }}>Form</div>
              <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, color: c.background, fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>& Function</div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: c.background, opacity: 0.7 }}>Exhibition Hall A — B</div>
          </div>
          <div className="absolute" style={{ top: 496 * k, left: 316, right: 36 }}>
            <svg width="268" height="100" viewBox="0 0 268 100">
              {Array.from({ length: 5 }).map((_, row) =>
                Array.from({ length: 7 }).map((_, col) => {
                  const isActive = (row + col) % 3 === 0 || (row * col) % 4 === 1;
                  return (
                    <rect
                      key={`sq${row}${col}`}
                      x={col * 38 + 2}
                      y={row * 20 + 2}
                      width={16}
                      height={16}
                      fill={isActive ? c.primary : c.surface}
                      opacity={isActive ? 0.8 : 0.4}
                    />
                  );
                })
              )}
            </svg>
            <div className="flex gap-6" style={{ marginTop: 20 }}>
              {[
                { value: '47', label: 'Artists', color: c.primary },
                { value: '12', label: 'Countries', color: c.accent },
                { value: '03', label: 'Weeks', color: c.secondary },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: c.muted, marginTop: 4 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="absolute"
            style={{ bottom: 0, left: 0, right: 0, height: 130 * k, backgroundColor: c.primary, padding: '0 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div>
              <div className="flex items-baseline gap-3">
                <span style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, color: c.background, fontFamily: "'Playfair Display', serif" }}>14</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: c.accent, letterSpacing: '0.05em' }}>—</span>
                <span style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, color: c.background, fontFamily: "'Playfair Display', serif" }}>31</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: c.background, opacity: 0.6, marginTop: 4 }}>March 2026</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.background, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Museum of</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.background, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Chormatica</div>
              <div style={{ fontSize: 10, fontWeight: 500, color: c.accent, marginTop: 6, letterSpacing: '0.05em' }}>Zürich, Switzerland</div>
            </div>
            <div className="absolute" style={{ bottom: 20 * k, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, backgroundColor: c.accent, borderRadius: '50%' }} />
          </div>
          <div className="absolute" style={{ top: 420 * k, left: 10, transformOrigin: 'left top', transform: 'rotate(-90deg) translateX(-100%)' }}>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: c.muted, opacity: 0.5 }}>Neuroarchitecture Lab UPV</span>
          </div>
          <svg className="absolute pointer-events-none" style={{ top: 80 * k, left: 0 }} width={POSTER_BASE_WIDTH} height={350 * k}>
            <line x1={500} y1={0} x2={620} y2={120 * k} stroke={c.accent} strokeWidth={2} opacity={0.3} />
            <line x1={510} y1={0} x2={620} y2={110 * k} stroke={c.accent} strokeWidth={1} opacity={0.15} />
          </svg>
          <div className="absolute" style={{ top: 88 * k, left: 420, width: 24, height: 24, borderRadius: '50%', border: `3px solid ${c.accent}` }} />
          <svg className="absolute pointer-events-none" style={{ top: 640 * k, left: 36 }} width={260} height={40}>
            {Array.from({ length: 20 }).map((_, i) => (
              <circle key={`dot${i}`} cx={i * 13 + 4} cy={20} r={2} fill={c.muted} opacity={0.3} />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
