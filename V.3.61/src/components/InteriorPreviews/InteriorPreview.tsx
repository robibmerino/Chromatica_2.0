import type { InteriorPreviewProps } from './types';
import { VARIANT_HEADERS, MATERIAL_LABELS, COMPACT_VARIANTS, SCENE_ASPECT_RATIO } from './constants';
import { COMPACT_SCENE_MAP, RoomSceneEstudio } from './scenes';

export default function InteriorPreview({ palette, variant, sceneOnly }: InteriorPreviewProps) {
  const { primary, secondary, accent, background, surface, muted } = palette;
  const header = VARIANT_HEADERS[variant] ?? VARIANT_HEADERS.estudio;
  const specs = header.specs ?? VARIANT_HEADERS.estudio.specs!;
  const isCompactLayout = (COMPACT_VARIANTS as readonly string[]).includes(variant);
  const materialItems = MATERIAL_LABELS[variant] ?? MATERIAL_LABELS.estudio;
  const sceneAspectRatio = SCENE_ASPECT_RATIO[variant] ?? '556/380';

  if (isCompactLayout) {
    const CompactScene = COMPACT_SCENE_MAP[variant];
    if (sceneOnly) {
      return (
        <div
          style={{
            width: 620,
            maxWidth: '100%',
            background: 'transparent',
            borderRadius: 0,
            overflow: 'visible',
            position: 'relative',
            fontFamily: "'Space Grotesk', sans-serif",
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ width: '100%', aspectRatio: sceneAspectRatio }}>
            {CompactScene && (
              <CompactScene
                primary={primary}
                secondary={secondary}
                accent={accent}
                surface={surface}
                muted={muted}
                background={background}
                fillContainer
              />
            )}
          </div>
        </div>
      );
    }
    return (
      <div
        className="shadow-2xl"
        style={{
          width: 620,
          maxWidth: '100%',
          background: background,
          borderRadius: 0,
          overflow: 'hidden',
          position: 'relative',
          fontFamily: "'Space Grotesk', sans-serif",
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '6px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, minHeight: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {header.subtitle ? (
              <div style={{ fontSize: 9, letterSpacing: 2, color: muted, textTransform: 'uppercase', fontWeight: 500, lineHeight: 1 }}>{header.subtitle}</div>
            ) : null}
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: primary, fontWeight: 700, marginTop: header.subtitle ? 2 : 0, lineHeight: 1, display: 'block' }}>
              {header.title}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[primary, secondary, accent].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
          </div>
        </div>

        <div style={{ padding: '0 20px 12px', flexShrink: 0 }}>
          <div style={{ width: '100%', aspectRatio: sceneAspectRatio }}>
            {CompactScene && <CompactScene primary={primary} secondary={secondary} accent={accent} surface={surface} muted={muted} background={background} fillContainer />}
          </div>
        </div>

        <div style={{ padding: '0 20px 10px', flexShrink: 0 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: muted, textTransform: 'uppercase', fontWeight: 500, marginBottom: 6, lineHeight: 1 }}>
            Material Palette
          </div>
          <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 6, minWidth: 0 }}>
            {[
              { color: primary, ...materialItems[0] },
              { color: secondary, ...materialItems[1] },
              { color: accent, ...materialItems[2] },
              { color: surface, ...materialItems[3] },
              { color: muted, ...materialItems[4] },
            ].map((m, i) => (
              <div key={i} style={{ flex: m.flex, minWidth: 48, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <div style={{
                  width: '100%',
                  height: 28,
                  borderRadius: 6,
                  background: m.color,
                  border: m.color === background ? `1px solid ${muted}` : 'none',
                  flexShrink: 0,
                }} />
                <div style={{ fontSize: 8, color: muted, textAlign: 'center', letterSpacing: 0.5, lineHeight: 1 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 20px 10px', display: 'flex', gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: muted, textTransform: 'uppercase', fontWeight: 500, marginBottom: 6, lineHeight: 1 }}>Textures</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {variant === 'fachada' ? (
                <>
                  <div style={{ flex: 1, height: 32, borderRadius: 6, overflow: 'hidden', position: 'relative', background: secondary }}>
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                      {Array.from({ length: 3 }).map((_, row) =>
                        Array.from({ length: 8 }).map((_, col) => (
                          <rect key={`fb-${row}-${col}`} x={col * 20 + (row % 2 === 0 ? 0 : 10)} y={row * 12} width="18" height="10" fill={primary} opacity="0.2" rx="1" />
                        ))
                      )}
                    </svg>
                  </div>
                  <div style={{ flex: 1, height: 32, borderRadius: 6, overflow: 'hidden', position: 'relative', background: muted }}>
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                      {Array.from({ length: 9 }).map((_, i) => (
                        <line key={`fm-${i}`} x1="0" y1={i * 4} x2="100%" y2={i * 4} stroke={surface} strokeWidth="0.5" opacity="0.4" />
                      ))}
                    </svg>
                  </div>
                  <div style={{ flex: 1, height: 32, borderRadius: 6, overflow: 'hidden', position: 'relative', background: surface, opacity: 0.5 }}>
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                      <line x1="0" y1="100%" x2="100%" y2="0" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
                    </svg>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ flex: 1, height: 32, borderRadius: 6, overflow: 'hidden', position: 'relative', background: primary, opacity: 0.9 }}>
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <line key={`vl${i}`} x1={i * 8} y1="0" x2={i * 8} y2="32" stroke={background} strokeWidth="0.5" opacity="0.2" />
                      ))}
                      {Array.from({ length: 6 }).map((_, i) => (
                        <line key={`hl${i}`} x1="0" y1={i * 6} x2="100" y2={i * 6} stroke={background} strokeWidth="0.5" opacity="0.15" />
                      ))}
                    </svg>
                  </div>
                  <div style={{ flex: 1, height: 32, borderRadius: 6, overflow: 'hidden', position: 'relative', background: secondary, opacity: 0.8 }}>
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <path key={`wg${i}`} d={`M 0 ${i * 6 + 2} Q 25 ${i * 6 + (i % 2 === 0 ? 4 : -1)} 100 ${i * 6 + 2}`} stroke={background} strokeWidth="0.6" fill="none" opacity="0.2" />
                      ))}
                    </svg>
                  </div>
                  <div style={{
                    flex: 1, height: 32, borderRadius: 6, overflow: 'hidden', position: 'relative',
                    background: variant === 'stand' ? `linear-gradient(135deg, ${accent}15, ${primary}10, ${surface})` : surface,
                  }}>
                    {variant !== 'stand' && (
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }} viewBox="0 0 100 55">
                      {variant === 'cafeteria' ? (
                        Array.from({ length: 4 }).map((_, row) =>
                          Array.from({ length: 4 }).map((_, col) => (
                            <rect
                              key={`tile${row}-${col}`}
                              x={col * 24 + 2}
                              y={row * 14 + 2}
                              width="20"
                              height="10"
                              rx="1"
                              fill={muted}
                              opacity={0.15 + (row + col) % 3 * 0.05}
                            />
                          ))
                        )
                      ) : (
                        <>
                          <path d="M 5 8 Q 20 18 40 12 Q 60 4 95 16" stroke={muted} strokeWidth="0.6" fill="none" opacity="0.25" />
                          <path d="M 0 22 Q 15 28 75 24" stroke={muted} strokeWidth="0.5" fill="none" opacity="0.15" />
                        </>
                      )}
                    </svg>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: muted, textTransform: 'uppercase', fontWeight: 500, marginBottom: 6, lineHeight: 1 }}>Specifications</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {specs.map((spec, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 28, padding: '0 8px', borderRadius: 4, background: surface, boxSizing: 'border-box' }}>
                  <span style={{ fontSize: 10, color: muted, lineHeight: 1, display: 'flex', alignItems: 'center' }}>{spec.label}</span>
                  <span style={{ fontSize: 10, color: primary, fontWeight: 600, lineHeight: 1, display: 'flex', alignItems: 'center' }}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const OriginalSceneComponent = COMPACT_SCENE_MAP[variant] ?? RoomSceneEstudio;
  const originalSceneProps = { primary, secondary, accent, surface, muted, background };
  return (
    <div
      style={{
        width: 620,
        minHeight: 826,
        maxWidth: '100%',
        background: background,
        borderRadius: 0,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <div style={{ padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: muted, textTransform: 'uppercase', fontWeight: 500 }}>{header.subtitle}</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: primary, fontWeight: 700, marginTop: 2 }}>
            {header.title}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[primary, secondary, accent].map((c, i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: c }} />
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 32px', position: 'relative' }}>
        <OriginalSceneComponent {...originalSceneProps} />
      </div>

      <div style={{ padding: '0 32px 20px' }}>
        <div style={{ fontSize: 10, letterSpacing: 2.5, color: muted, textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>
          Material Palette
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { color: primary, label: 'Upholstery', flex: 2 },
            { color: secondary, label: 'Wood', flex: 1.5 },
            { color: accent, label: 'Accents', flex: 1.5 },
            { color: surface, label: 'Walls', flex: 1 },
            { color: muted, label: 'Stone', flex: 1 },
          ].map((m, i) => (
            <div key={i} style={{ flex: m.flex, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{
                height: 48,
                borderRadius: 8,
                background: m.color,
                border: m.color === background ? `1px solid ${muted}` : 'none',
              }} />
              <div style={{ fontSize: 8, color: muted, textAlign: 'center', letterSpacing: 0.5 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 32px 20px', display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: 2.5, color: muted, textTransform: 'uppercase', fontWeight: 500, marginBottom: 10 }}>
            Textures
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1, height: 52, borderRadius: 8, overflow: 'hidden', position: 'relative', background: primary, opacity: 0.9 }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                {Array.from({ length: 15 }).map((_, i) => (
                  <line key={`vl${i}`} x1={i * 6} y1="0" x2={i * 6} y2="52" stroke={background} strokeWidth="0.5" opacity="0.2" />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line key={`hl${i}`} x1="0" y1={i * 6} x2="100" y2={i * 6} stroke={background} strokeWidth="0.5" opacity="0.15" />
                ))}
              </svg>
            </div>
            <div style={{ flex: 1, height: 52, borderRadius: 8, overflow: 'hidden', position: 'relative', background: secondary, opacity: 0.8 }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <path key={`wg${i}`} d={`M 0 ${i * 7 + 2} Q 30 ${i * 7 + (i % 2 === 0 ? 5 : -1)} 100 ${i * 7 + 3}`} stroke={background} strokeWidth="0.7" fill="none" opacity="0.2" />
                ))}
              </svg>
            </div>
            <div style={{ flex: 1, height: 52, borderRadius: 8, overflow: 'hidden', position: 'relative', background: surface }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path d="M 5 10 Q 20 25 40 15 Q 60 5 80 20 Q 90 28 100 22" stroke={muted} strokeWidth="0.8" fill="none" opacity="0.3" />
                <path d="M 0 30 Q 15 40 35 32 Q 55 24 75 38 Q 90 45 100 40" stroke={muted} strokeWidth="0.6" fill="none" opacity="0.2" />
                <path d="M 10 45 Q 30 50 50 42 Q 70 35 100 48" stroke={muted} strokeWidth="0.5" fill="none" opacity="0.15" />
              </svg>
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: 2.5, color: muted, textTransform: 'uppercase', fontWeight: 500, marginBottom: 10 }}>
            Specifications
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {specs.map((spec, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderRadius: 6, background: surface }}>
                <span style={{ fontSize: 9, color: muted }}>{spec.label}</span>
                <span style={{ fontSize: 9, color: primary, fontWeight: 600 }}>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 32px', borderTop: `1px solid ${muted}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="1" y="1" width="4" height="4" rx="0.5" fill={background} opacity="0.9" />
              <rect x="5" y="5" width="4" height="4" rx="0.5" fill={accent} opacity="0.8" />
            </svg>
          </div>
          <span style={{ fontSize: 11, color: primary, fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>Espacio Interior</span>
        </div>
        <span style={{ fontSize: 8, color: muted, letterSpacing: 1 }}>CONCEPT PROPOSAL</span>
      </div>
    </div>
  );
}
