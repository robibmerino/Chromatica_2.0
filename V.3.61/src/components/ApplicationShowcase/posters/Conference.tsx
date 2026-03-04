import type { PosterPalette } from '../types';
import {
  POSTER_BASE_WIDTH,
  POSTER_HEIGHT,
  POSTER_SCALE,
  CONFERENCE_QR_FILL_INDICES,
} from '../constants';

export function PosterConference({ posterColors: c }: { posterColors: PosterPalette }) {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-0">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div
          className="relative overflow-hidden shadow-2xl"
          style={{
            width: POSTER_BASE_WIDTH,
            height: POSTER_HEIGHT,
            backgroundColor: c.background,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-15" style={{ backgroundColor: c.accent }} />
            <div className="absolute bottom-32 -left-8 h-40 w-40 rounded-full opacity-10" style={{ backgroundColor: c.secondary }} />
            <div className="absolute top-0 right-48 h-full w-px opacity-10" style={{ backgroundColor: c.text }} />
            <div className="absolute top-1/3 left-0 h-px w-full opacity-5" style={{ backgroundColor: c.text }} />
            <div className="absolute top-2/3 left-0 h-px w-full opacity-5" style={{ backgroundColor: c.text }} />
            <svg className="absolute inset-0 h-full w-full opacity-[0.03]">
              <pattern id="poster-dots-full" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill={c.text} />
              </pattern>
              <rect width="100%" height="100%" fill="url(#poster-dots-full)" />
            </svg>
          </div>
          <div className="relative flex h-full flex-col justify-between p-10">
            <div>
              <div className="mb-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: c.accent }} />
                  <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: c.textLight, fontFamily: "'Space Grotesk', sans-serif" }}>Design Conference</span>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: c.textLight, fontFamily: "'Space Grotesk', sans-serif" }}>2026</span>
              </div>
              <div className="mb-8">
                <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.4em]" style={{ color: c.accent, fontFamily: "'Space Grotesk', sans-serif" }}>International</div>
                <h1 className="mb-2 text-7xl font-black leading-[0.85] tracking-tight" style={{ color: c.text, fontFamily: "'Playfair Display', serif" }}>Creative</h1>
                <h1 className="mb-2 text-7xl font-black italic leading-[0.85] tracking-tight" style={{ color: c.accent, fontFamily: "'Playfair Display', serif" }}>Chormatica</h1>
                <h1 className="text-7xl font-black leading-[0.85] tracking-tight" style={{ color: c.text, fontFamily: "'Playfair Display', serif" }}>Summit</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-16" style={{ backgroundColor: c.accent }} />
                <p className="max-w-xs text-xs font-light leading-relaxed" style={{ color: c.textLight }}>Where art, technology, and design converge to shape the future of creative expression.</p>
              </div>
            </div>
            <div className="my-8 grid grid-cols-3 gap-3">
              {[
                { number: '01', label: 'Keynotes', detail: '12 Speakers' },
                { number: '02', label: 'Workshops', detail: '24 Sessions' },
                { number: '03', label: 'Exhibits', detail: '48 Artists' },
              ].map((item) => (
                <div key={item.number} className="rounded-lg p-4" style={{ backgroundColor: c.surface }}>
                  <div className="mb-2 text-2xl font-bold" style={{ color: c.accent, fontFamily: "'Space Grotesk', sans-serif" }}>{item.number}</div>
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: c.text }}>{item.label}</div>
                  <div className="text-[9px] font-medium" style={{ color: c.textLight }}>{item.detail}</div>
                </div>
              ))}
            </div>
            <div className="relative my-4">
              <div className="flex items-center justify-between rounded-xl p-6" style={{ backgroundColor: c.primary }}>
                <div>
                  <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.3em]" style={{ color: c.accent }}>Mark your calendar</div>
                  <div className="text-3xl font-bold tracking-tight" style={{ color: c.background, fontFamily: "'Space Grotesk', sans-serif" }}>OCT 15–18</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.3em]" style={{ color: c.accent }}>Location</div>
                  <div className="text-sm font-medium" style={{ color: c.background }}>Valencia, Spain</div>
                </div>
                <div className="absolute right-20 bottom-0 h-20 w-20 translate-y-1/2 rounded-full opacity-20" style={{ backgroundColor: c.accent }} />
              </div>
            </div>
            <div className="mt-auto">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[c.accent, c.secondary, c.primary, c.muted].map((color, i) => (
                    <div
                      key={i}
                      className="relative flex h-8 w-8 items-center justify-center rounded-full text-[8px] font-bold"
                      style={{ backgroundColor: color, color: c.background, boxShadow: `0 0 0 2px ${c.background}` }}
                    >
                      {['RB', 'SI', 'MP', '+8'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: c.text }}>Featured Speakers</div>
                  <div className="text-[8px]" style={{ color: c.textLight }}>Laboratory leaders from around the globe</div>
                </div>
              </div>
              <div className="flex items-end justify-between border-t pt-5" style={{ borderColor: c.muted }}>
                <div>
                  <div className="mb-1 text-[22px] font-bold tracking-tight" style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}>CV/26</div>
                  <div className="text-[8px] font-medium uppercase tracking-[0.3em]" style={{ color: c.textLight }}>Neuroarchitecture.lab.upv</div>
                </div>
                <div className="grid grid-cols-4 gap-[2px]">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-[1px]"
                      style={{
                        backgroundColor: CONFERENCE_QR_FILL_INDICES.includes(i) ? c.text : c.muted,
                        opacity: CONFERENCE_QR_FILL_INDICES.includes(i) ? 0.6 : 0.2,
                      }}
                    />
                  ))}
                </div>
                <div className="flex h-10 items-center rounded-full px-5 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ backgroundColor: c.accent, color: c.primary }}>Register Now</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
