import React from 'react';

export interface InteriorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  muted: string;
}

interface Props {
  palette: InteriorPalette;
  variant: string;
}

/** Mapa de variante → título principal y subtítulo para el header */
const VARIANT_HEADERS: Record<string, { subtitle: string; title: string; specs?: { label: string; value: string }[] }> = {
  estudio: {
    subtitle: '',
    title: 'Interior Design',
    specs: [
      { label: 'Room', value: '4.2 × 5.8 m' },
      { label: 'Style', value: 'Contemporary' },
      { label: 'Light', value: 'Natural + Ambient' },
    ],
  },
  cafeteria: {
    subtitle: '',
    title: 'Cafetería',
    specs: [
      { label: 'Area', value: '6.5 × 8.2 m' },
      { label: 'Style', value: 'Industrial Warm' },
      { label: 'Ambience', value: 'Cozy + Warm' },
    ],
  },
  oficina: {
    subtitle: '',
    title: 'Oficina',
    specs: [
      { label: 'Area', value: '85 m²' },
      { label: 'Style', value: 'Modern Minimal' },
      { label: 'Lighting', value: 'Pendant + Natural' },
    ],
  },
  stand: {
    subtitle: '',
    title: 'Stand corporativo',
    specs: [
      { label: 'Stand', value: '6m × 4m' },
      { label: 'Type', value: 'Island' },
      { label: 'Lighting', value: 'LED Track' },
    ],
  },
  fachada: {
    subtitle: '',
    title: 'Fachada corporativa',
    specs: [
      { label: 'Frontage', value: '12m' },
      { label: 'Style', value: 'Contemporary' },
      { label: 'Lighting', value: 'Warm LED' },
    ],
  },
};

/** Etiquetas del Material Palette por variante (mismo orden: primary, secondary, accent, surface, muted). */
const MATERIAL_LABELS: Record<string, { label: string; flex: number }[]> = {
  estudio: [
    { label: 'Upholstery', flex: 2 },
    { label: 'Wood', flex: 1.5 },
    { label: 'Accents', flex: 1.5 },
    { label: 'Walls', flex: 1 },
    { label: 'Stone', flex: 1 },
  ],
  cafeteria: [
    { label: 'Seating', flex: 2 },
    { label: 'Counter', flex: 1.5 },
    { label: 'Accents', flex: 1.5 },
    { label: 'Walls', flex: 1 },
    { label: 'Floor', flex: 1 },
  ],
  oficina: [
    { label: 'Furniture', flex: 2 },
    { label: 'Wood', flex: 1.5 },
    { label: 'Accents', flex: 1.5 },
    { label: 'Walls', flex: 1 },
    { label: 'Floor', flex: 1 },
  ],
  stand: [
    { label: 'Structure', flex: 2 },
    { label: 'Materials', flex: 1.5 },
    { label: 'Highlights', flex: 1.5 },
    { label: 'Panels', flex: 1 },
    { label: 'Details', flex: 1 },
  ],
  fachada: [
    { label: 'Frame', flex: 2 },
    { label: 'Stone', flex: 1.5 },
    { label: 'Accents', flex: 1.5 },
    { label: 'Glass', flex: 1 },
    { label: 'Facade', flex: 1 },
  ],
};

/** Variantes que usan el layout compacto (header + escena + Material Palette + Textures + Specs, sin footer). */
const COMPACT_VARIANTS = ['estudio', 'cafeteria', 'oficina', 'stand', 'fachada'] as const;

/** Aspect ratio del contenedor de la escena por variante (compact layout). */
const SCENE_ASPECT_RATIO: Record<string, string> = {
  estudio: '556/380',
  cafeteria: '556/380',
  oficina: '572/400',
  stand: '580/450',
  fachada: '560/420',
};

export default function InteriorPreview({ palette, variant }: Props) {
  const { primary, secondary, accent, background, surface, muted } = palette;
  const header = VARIANT_HEADERS[variant] ?? VARIANT_HEADERS.estudio;
  const specs = header.specs ?? VARIANT_HEADERS.estudio.specs!;
  const isCompactLayout = (COMPACT_VARIANTS as readonly string[]).includes(variant);
  const materialItems = MATERIAL_LABELS[variant] ?? MATERIAL_LABELS.estudio;
  const sceneAspectRatio = SCENE_ASPECT_RATIO[variant] ?? '556/380';

  // Layout compacto (Estudio, Cafetería, Oficina, Stand, Fachada): mismo template, sin scroll
  if (isCompactLayout) {
    const CompactScene = COMPACT_SCENE_MAP[variant];
    return (
      <div
        style={{
          width: 620,
          maxWidth: '100%',
          background: background,
          borderRadius: 18,
          overflow: 'hidden',
          position: 'relative',
          fontFamily: "'Space Grotesk', sans-serif",
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header compacto - altura fija para evitar desplazamiento al exportar */}
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

        {/* Escena del espacio: altura fijada por aspect-ratio (stand 580/450, oficina 572/400, resto 556/380) */}
        <div style={{ padding: '0 20px 12px', flexShrink: 0 }}>
          <div style={{ width: '100%', aspectRatio: sceneAspectRatio }}>
            {CompactScene && <CompactScene primary={primary} secondary={secondary} accent={accent} surface={surface} muted={muted} background={background} fillContainer />}
          </div>
        </div>

        {/* Material Palette - minWidth en cada columna para que no desaparezcan al exportar */}
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

        {/* Textures + Specs */}
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

  // Layout original (fallback para variantes no compactas)
  const OriginalSceneComponent = COMPACT_SCENE_MAP[variant] ?? RoomSceneEstudio;
  const originalSceneProps = { primary, secondary, accent, surface, muted, background };
  return (
    <div
      style={{
        width: 620,
        minHeight: 826,
        maxWidth: '100%',
        background: background,
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Header */}
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

      {/* Room Scene - variant-specific SVG (sin fillContainer) */}
      <div style={{ padding: '20px 32px', position: 'relative' }}>
        <OriginalSceneComponent {...originalSceneProps} />
      </div>

      {/* Material Palette Section */}
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

      {/* Mood & Specs */}
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

      {/* Footer */}
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

interface RoomColors {
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  muted: string;
  background: string;
}

function RoomSceneEstudio({ primary, secondary, accent, surface, muted, background, fillContainer }: RoomColors & { fillContainer?: boolean }) {
  const svgContent = (
    <>
      <rect x="0" y="0" width="556" height="260" fill={surface} />
      <rect x="0" y="252" width="556" height="8" fill={muted} opacity="0.5" />
      <rect x="0" y="260" width="556" height="120" fill={muted} opacity="0.3" />
      {Array.from({ length: 20 }).map((_, i) =>
        Array.from({ length: 5 }).map((_, j) => (
          <rect key={`f${i}-${j}`} x={i * 30} y={260 + j * 24} width="28" height="11" fill={j % 2 === 0 ? muted : surface} opacity={j % 2 === 0 ? 0.15 : 0.2} />
        ))
      )}
      <ellipse cx="278" cy="340" rx="200" ry="18" fill={primary} opacity="0.06" />
      <rect x="40" y="40" width="90" height="120" rx="4" fill={background} stroke={muted} strokeWidth="2" opacity="0.8" />
      <circle cx="85" cy="85" r="28" fill={accent} opacity="0.7" />
      <rect x="55" y="95" width="40" height="40" rx="2" fill={primary} opacity="0.5" />
      <line x1="60" y1="70" x2="110" y2="130" stroke={secondary} strokeWidth="3" opacity="0.6" />
      <circle cx="100" cy="110" r="15" fill={secondary} opacity="0.4" />
      <rect x="430" y="50" width="80" height="80" rx="4" fill={background} stroke={muted} strokeWidth="2" opacity="0.8" />
      <circle cx="470" cy="90" r="25" fill={primary} opacity="0.5" />
      <rect x="455" y="75" width="30" height="30" fill={accent} opacity="0.4" transform="rotate(15, 470, 90)" />
      <line x1="340" y1="0" x2="340" y2="50" stroke={muted} strokeWidth="1.5" />
      <path d="M 320 50 Q 330 45 340 50 Q 350 45 360 50 L 355 75 Q 340 80 325 75 Z" fill={accent} opacity="0.85" />
      <ellipse cx="340" cy="100" rx="50" ry="30" fill={accent} opacity="0.06" />
      <ellipse cx="340" cy="90" rx="30" ry="18" fill={accent} opacity="0.08" />
      <rect x="180" y="60" width="130" height="6" rx="2" fill={secondary} opacity="0.7" />
      <rect x="185" y="28" width="12" height="32" rx="1" fill={primary} opacity="0.8" />
      <rect x="199" y="34" width="10" height="26" rx="1" fill={accent} opacity="0.7" />
      <rect x="211" y="30" width="14" height="30" rx="1" fill={secondary} opacity="0.6" />
      <rect x="227" y="36" width="9" height="24" rx="1" fill={muted} opacity="0.5" />
      <rect x="238" y="32" width="11" height="28" rx="1" fill={primary} opacity="0.5" />
      <rect x="270" y="48" width="10" height="12" rx="2" fill={muted} opacity="0.6" />
      <circle cx="275" cy="44" r="10" fill={accent} opacity="0.5" />
      <circle cx="280" cy="40" r="7" fill={secondary} opacity="0.4" />
      <rect x="58" y="180" width="4" height="80" rx="2" fill={muted} opacity="0.6" />
      <rect x="48" y="254" width="24" height="6" rx="3" fill={muted} opacity="0.5" />
      <ellipse cx="60" cy="175" rx="18" ry="22" fill={surface} stroke={secondary} strokeWidth="1.5" opacity="0.8" />
      <ellipse cx="60" cy="200" rx="30" ry="20" fill={accent} opacity="0.04" />
      <rect x="140" y="215" width="260" height="50" rx="10" fill={primary} />
      <rect x="145" y="185" width="250" height="38" rx="10" fill={primary} opacity="0.85" />
      <rect x="155" y="220" width="230" height="15" rx="6" fill={background} opacity="0.15" />
      <rect x="138" y="195" width="22" height="70" rx="10" fill={primary} opacity="0.9" />
      <rect x="380" y="195" width="22" height="70" rx="10" fill={primary} opacity="0.9" />
      <rect x="160" y="265" width="6" height="12" rx="2" fill={secondary} opacity="0.7" />
      <rect x="374" y="265" width="6" height="12" rx="2" fill={secondary} opacity="0.7" />
      <rect x="170" y="195" width="60" height="28" rx="8" fill={accent} opacity="0.75" />
      <rect x="310" y="195" width="55" height="28" rx="8" fill={secondary} opacity="0.6" />
      <rect x="245" y="198" width="50" height="24" rx="7" fill={accent} opacity="0.4" />
      <rect x="210" y="295" width="140" height="8" rx="4" fill={secondary} opacity="0.8" />
      <rect x="225" y="303" width="4" height="18" rx="1" fill={secondary} opacity="0.6" />
      <rect x="331" y="303" width="4" height="18" rx="1" fill={secondary} opacity="0.6" />
      <rect x="230" y="284" width="35" height="11" rx="2" fill={muted} opacity="0.5" />
      <circle cx="300" cy="289" r="8" fill={accent} opacity="0.5" />
      <rect x="295" y="281" width="10" height="3" rx="1" fill={accent} opacity="0.3" />
      <rect x="440" y="245" width="50" height="6" rx="3" fill={secondary} opacity="0.7" />
      <rect x="462" y="251" width="6" height="25" rx="2" fill={secondary} opacity="0.5" />
      <rect x="452" y="228" width="14" height="17" rx="4" fill={muted} opacity="0.6" />
      <circle cx="459" cy="220" r="14" fill={accent} opacity="0.5" />
      <circle cx="465" cy="215" r="10" fill={secondary} opacity="0.35" />
      <circle cx="453" cy="218" r="8" fill={accent} opacity="0.3" />
      <rect x="160" y="318" width="230" height="45" rx="6" fill={primary} opacity="0.12" />
      <rect x="170" y="323" width="210" height="35" rx="4" fill="none" stroke={primary} strokeWidth="1" opacity="0.15" />
      {Array.from({ length: 7 }).map((_, i) => (
        <circle key={`rug${i}`} cx={195 + i * 28} cy={340} r="3" fill={accent} opacity="0.15" />
      ))}
    </>
  );
  if (fillContainer) {
    return (
      <svg viewBox="0 0 556 380" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', display: 'block' }}>
        {svgContent}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 556 380" width="556" height="380" style={{ borderRadius: 12, overflow: 'hidden' }}>
      {svgContent}
    </svg>
  );
}

/** Constantes de layout de la escena Cafetería (viewBox 556×380, suelo en y=260) */
const CAFE = {
  floorY: 260,
  /** Opacidad de las patas de las sillas (marrón/gris) */
  chairLegOpacity: 0.14,
  /** Taburetes: centros X, dimensiones y posiciones fijas (escala anisotrópica 1.25H × 1.75V) */
  stoolCenters: [402, 452, 502] as const,
  stoolSeatW: 38,
  stoolSeatH: 11,
  stoolSeatY: 245,
  stoolLegW: 6,
  stoolLegH: 67,
  stoolLegY: 256,
  stoolBaseY: 316,
  stoolBaseH: 7,
  stoolFootY: 309,
  stoolFootH: 5,
  /** Mesa central y sillas: centros y geometría */
  tableCx: 200,
  chairs: [
    { seatX: 121, backX: 124, seatY: 275, backY: 244, seatW: 48, seatH: 11, backW: 41, backH: 32, legY: 286, legH: 32, legW: 5, leftLegX: 134, rightLegX: 151 },
    { seatX: 231, backX: 234, seatY: 275, backY: 244, seatW: 48, seatH: 11, backW: 41, backH: 32, legY: 286, legH: 32, legW: 5, leftLegX: 244, rightLegX: 261 },
  ] as const,
};

function RoomSceneCafeteria({ primary, secondary, accent, surface, muted, background, fillContainer }: RoomColors & { fillContainer?: boolean }) {
  const { floorY, chairLegOpacity, stoolCenters, stoolSeatW, stoolSeatH, stoolSeatY, stoolLegW, stoolLegH, stoolLegY, stoolBaseY, stoolBaseH, stoolFootY, stoolFootH, tableCx, chairs } = CAFE;
  const halfSeatW = stoolSeatW / 2;
  const halfLegW = stoolLegW / 2;
  const stoolBaseHalfW = 14.5;
  const stoolFootW = 23;

  const svgContent = (
    <>
      {/* Pared y zócalo */}
      <rect x="0" y="0" width="556" height={floorY} fill={surface} />
      <rect x="0" y="155" width="556" height="105" fill={muted} opacity="0.2" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`wl${i}`} x1={i * 48 + 24} y1="155" x2={i * 48 + 24} y2={floorY} stroke={muted} strokeWidth="1" opacity="0.15" />
      ))}
      <rect x="0" y="152" width="556" height="4" fill={secondary} opacity="0.25" />
      {/* Suelo y baldosas */}
      <rect x="0" y={floorY} width="556" height="120" fill={muted} opacity="0.2" />
      {Array.from({ length: 14 }).map((_, i) =>
        Array.from({ length: 4 }).map((_, j) => (
          <rect key={`ft${i}-${j}`} x={i * 42} y={floorY + j * 30} width="40" height="28" fill={(i + j) % 2 === 0 ? muted : surface} opacity={(i + j) % 2 === 0 ? 0.12 : 0.15} rx="1" />
        ))
      )}
      {/* Ventana izquierda */}
      <rect x="20" y="20" width="120" height="130" rx="4" fill={background} opacity="0.6" />
      <line x1="80" y1="20" x2="80" y2="150" stroke={muted} strokeWidth="2" opacity="0.3" />
      <line x1="20" y1="85" x2="140" y2="85" stroke={muted} strokeWidth="2" opacity="0.3" />
      <rect x="20" y="20" width="120" height="130" rx="4" fill="none" stroke={secondary} strokeWidth="2.5" opacity="0.4" />
      <polygon points="140,150 200,260 20,260 20,150" fill={accent} opacity="0.03" />
      {/* Pizarra / menú */}
      <rect x="200" y="18" width="155" height="100" rx="5" fill={primary} opacity="0.9" />
      <rect x="206" y="24" width="143" height="88" rx="3" fill="none" stroke={background} strokeWidth="1" opacity="0.2" />
      <rect x="220" y="36" width="60" height="5" rx="2" fill={accent} opacity="0.8" />
      <rect x="220" y="50" width="110" height="3" rx="1" fill={background} opacity="0.3" />
      <rect x="220" y="58" width="95" height="3" rx="1" fill={background} opacity="0.25" />
      <rect x="220" y="66" width="105" height="3" rx="1" fill={background} opacity="0.3" />
      <rect x="220" y="74" width="85" height="3" rx="1" fill={background} opacity="0.2" />
      <rect x="220" y="86" width="50" height="5" rx="2" fill={accent} opacity="0.6" />
      <rect x="220" y="96" width="100" height="3" rx="1" fill={background} opacity="0.25" />
      <polygon points="340,22 355,30 340,38" fill={accent} opacity="0.7" />
      {/* Estantería trasera */}
      <rect x="380" y="50" width="155" height="6" rx="2" fill={secondary} opacity="0.7" />
      <rect x="380" y="100" width="155" height="6" rx="2" fill={secondary} opacity="0.7" />
      <rect x="390" y="20" width="12" height="30" rx="3" fill={primary} opacity="0.6" />
      <rect x="406" y="15" width="10" height="35" rx="3" fill={accent} opacity="0.5" />
      <rect x="420" y="22" width="11" height="28" rx="3" fill={secondary} opacity="0.5" />
      <rect x="435" y="18" width="9" height="32" rx="3" fill={muted} opacity="0.4" />
      <rect x="460" y="38" width="10" height="12" rx="2" fill={background} opacity="0.7" />
      <rect x="474" y="38" width="10" height="12" rx="2" fill={background} opacity="0.7" />
      <rect x="488" y="38" width="10" height="12" rx="2" fill={background} opacity="0.7" />
      <rect x="388" y="72" width="14" height="28" rx="3" fill={accent} opacity="0.4" />
      <rect x="406" y="75" width="12" height="25" rx="3" fill={primary} opacity="0.5" />
      <rect x="422" y="70" width="10" height="30" rx="3" fill={secondary} opacity="0.4" />
      <rect x="470" y="85" width="12" height="15" rx="3" fill={muted} opacity="0.5" />
      <circle cx="476" cy="80" r="10" fill={accent} opacity="0.5" />
      <circle cx="480" cy="76" r="7" fill={secondary} opacity="0.35" />
      {/* Barra / mostrador */}
      <rect x="360" y="155" width="196" height="10" rx="3" fill={secondary} opacity="0.85" />
      <rect x="365" y="165" width="186" height="95" rx="0" fill={secondary} opacity="0.35" />
      <rect x="370" y="175" width="50" height="75" rx="3" fill={secondary} opacity="0.15" />
      <rect x="425" y="175" width="50" height="75" rx="3" fill={secondary} opacity="0.15" />
      <rect x="480" y="175" width="50" height="75" rx="3" fill={secondary} opacity="0.15" />
      {/* Máquina espresso */}
      <rect x="410" y="115" width="55" height="40" rx="4" fill={primary} opacity="0.8" />
      <rect x="415" y="120" width="20" height="20" rx="2" fill={muted} opacity="0.3" />
      <rect x="440" y="122" width="18" height="12" rx="2" fill={accent} opacity="0.5" />
      <rect x="418" y="142" width="6" height="13" rx="1" fill={muted} opacity="0.4" />
      <rect x="428" y="142" width="6" height="13" rx="1" fill={muted} opacity="0.4" />
      <path d="M 421 115 Q 424 108 421 102" stroke={muted} strokeWidth="1" fill="none" opacity="0.2" />
      <path d="M 431 115 Q 434 106 431 100" stroke={muted} strokeWidth="1" fill="none" opacity="0.15" />
      {/* Tarros y caja */}
      <rect x="480" y="130" width="18" height="25" rx="4" fill={background} opacity="0.5" />
      <rect x="480" y="130" width="18" height="25" rx="4" fill="none" stroke={muted} strokeWidth="1" opacity="0.3" />
      <ellipse cx="489" cy="143" rx="6" ry="5" fill={accent} opacity="0.3" />
      <rect x="505" y="133" width="16" height="22" rx="4" fill={background} opacity="0.5" />
      <rect x="505" y="133" width="16" height="22" rx="4" fill="none" stroke={muted} strokeWidth="1" opacity="0.3" />
      <ellipse cx="513" cy="145" rx="5" ry="4" fill={secondary} opacity="0.3" />
      <rect x="375" y="125" width="28" height="30" rx="3" fill={primary} opacity="0.6" />
      <rect x="379" y="129" width="20" height="12" rx="2" fill={accent} opacity="0.3" />
      <rect x="379" y="145" width="20" height="6" rx="1" fill={muted} opacity="0.3" />
      {/* Taburetes de barra */}
      {stoolCenters.map((cx, i) => (
        <g key={`stool${i}`}>
          <rect x={cx - halfSeatW} y={stoolSeatY} width={stoolSeatW} height={stoolSeatH} rx="10" fill={primary} opacity="0.85" />
          <rect x={cx - halfLegW} y={stoolLegY} width={stoolLegW} height={stoolLegH} rx="1" fill={muted} opacity="0.5" />
          <rect x={cx - stoolBaseHalfW} y={stoolBaseY} width={29} height={stoolBaseH} rx="1.5" fill={muted} opacity="0.4" />
          <rect x={cx - stoolFootW / 2} y={stoolFootY} width={stoolFootW} height={stoolFootH} rx="1" fill={muted} opacity="0.25" />
        </g>
      ))}
      {/* Mesa central */}
      <ellipse cx={tableCx} cy="305" rx="86" ry="23" fill={secondary} opacity="0.7" />
      <rect x={tableCx - 5} y="286" width="10" height="67" rx="2" fill={secondary} opacity="0.5" />
      <ellipse cx={tableCx} cy="349" rx="29" ry="9" fill={secondary} opacity="0.3" />
      <circle cx="185" cy="308" r="13" fill={background} opacity="0.6" />
      <circle cx="185" cy="308" r="8" fill={accent} opacity="0.3" />
      <rect x="198" y="300" width="35" height="18" rx="2" fill={muted} opacity="0.4" />
      {/* Sillas (data-driven, patas equidistantes del centro del asiento) */}
      {chairs.map((c, i) => (
        <g key={`chair${i}`}>
          <rect x={c.seatX} y={c.seatY} width={c.seatW} height={c.seatH} rx="8" fill={primary} opacity="0.7" />
          <rect x={c.backX} y={c.backY} width={c.backW} height={c.backH} rx="4" fill={primary} opacity="0.5" />
          <rect x={c.leftLegX} y={c.legY} width={c.legW} height={c.legH} rx="1" fill={muted} opacity={chairLegOpacity} />
          <rect x={c.rightLegX} y={c.legY} width={c.legW} height={c.legH} rx="1" fill={muted} opacity={chairLegOpacity} />
        </g>
      ))}
      {/* Lámparas colgantes */}
      {[180, 320].map((x, i) => (
        <g key={`lamp${i}`}>
          <line x1={x} y1="0" x2={x} y2="35" stroke={muted} strokeWidth="1.2" />
          <path d={`M ${x - 16} 35 Q ${x - 8} 32 ${x} 35 Q ${x + 8} 32 ${x + 16} 35 L ${x + 14} 55 Q ${x} 60 ${x - 14} 55 Z`} fill={accent} opacity="0.75" />
          <ellipse cx={x} cy="75" rx="30" ry="18" fill={accent} opacity="0.05" />
          <ellipse cx={x} cy="68" rx="18" ry="10" fill={accent} opacity="0.07" />
        </g>
      ))}
      {/* Planta decorativa */}
      <rect x="32" y="215" width="16" height="55" rx="5" fill={muted} opacity="0.5" />
      <circle cx="40" cy="207" r="18" fill={accent} opacity="0.45" />
      <circle cx="48" cy="200" r="14" fill={secondary} opacity="0.35" />
      <circle cx="34" cy="203" r="10" fill={accent} opacity="0.3" />
      <circle cx="44" cy="193" r="8" fill={accent} opacity="0.25" />
    </>
  );
  if (fillContainer) {
    return (
      <svg viewBox="0 0 556 380" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', display: 'block' }}>
        {svgContent}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 556 380" width="556" height="380" style={{ borderRadius: 12, overflow: 'hidden' }}>
      {svgContent}
    </svg>
  );
}

/** Constantes de layout escena Oficina (viewBox 572×400, suelo en y=290) */
const OFFICE = {
  floorY: 290,
  /** Opacidad del trazo de marcos (pizarra, cuadro pared, marquito mesa) */
  frameStrokeOpacity: 0.4,
  /** Zona reuniones: centro mesa, sillas estilo Cafetería */
  meetingTableCx: 460,
  meetingChairs: [
    { seatX: 388, backX: 390, seatY: 258, backY: 232, seatW: 38, seatH: 10, backW: 34, backH: 26, legY: 268, legH: 22, legW: 5, leftLegX: 398, rightLegX: 411 },
    { seatX: 493, backX: 495, seatY: 258, backY: 232, seatW: 38, seatH: 10, backW: 34, backH: 26, legY: 268, legH: 22, legW: 5, leftLegX: 503, rightLegX: 516 },
  ] as const,
  chairLegOpacity: 0.14,
};

/** Escena Oficina: viewBox 572×400 (referencia OfficePreview) */
function RoomSceneOficina({ primary, secondary, accent, surface, muted, background, fillContainer }: RoomColors & { fillContainer?: boolean }) {
  const { floorY, frameStrokeOpacity, meetingTableCx, meetingChairs, chairLegOpacity } = OFFICE;
  const svgContent = (
    <>
      <rect width="572" height="400" fill={surface} />
      <rect x="0" y="0" width="572" height="8" fill={primary} opacity={0.15} />
      <rect x="0" y={floorY} width="572" height="110" fill={muted} opacity={0.35} />
      {[0, 80, 160, 240, 320, 400, 480].map((x, i) => (
        <rect key={i} x={x} y={floorY} width="1" height="110" fill={primary} opacity={0.06} />
      ))}
      <rect x="0" y={floorY} width="572" height="1.5" fill={primary} opacity={0.1} />
      {/* Ventana */}
      <rect x="30" y="30" width="160" height="180" rx="3" fill={background} />
      <rect x="30" y="30" width="160" height="180" rx="3" stroke={primary} strokeWidth="3" fill="none" />
      <line x1="110" y1="30" x2="110" y2="210" stroke={primary} strokeWidth="2" />
      <line x1="30" y1="120" x2="190" y2="120" stroke={primary} strokeWidth="2" />
      <rect x="32" y="32" width="77" height="87" fill={accent} opacity={0.08} />
      <rect x="112" y="32" width="77" height="87" fill={accent} opacity={0.05} />
      {[40, 52, 64, 76].map((y, i) => (
        <line key={i} x1="34" y1={y} x2="108" y2={y} stroke={muted} strokeWidth="1" opacity={0.3} />
      ))}
      <rect x="25" y="208" width="170" height="6" rx="1" fill={primary} opacity={0.2} />
      {/* Pizarra / whiteboard */}
      <rect x="230" y="35" width="150" height="100" rx="3" fill={background} />
      <rect x="230" y="35" width="150" height="100" rx="3" stroke={muted} strokeWidth="2" strokeOpacity={frameStrokeOpacity} fill="none" />
      <rect x="242" y="48" width="28" height="28" rx="2" fill={accent} opacity={0.7} />
      <rect x="275" y="48" width="28" height="28" rx="2" fill={primary} opacity={0.3} />
      <rect x="308" y="48" width="28" height="28" rx="2" fill={secondary} opacity={0.5} />
      <rect x="341" y="48" width="28" height="28" rx="2" fill={accent} opacity={0.4} />
      {[85, 93, 101, 109, 117].map((y, i) => (
        <line key={i} x1="242" y1={y} x2={320 - i * 8} y2={y} stroke={muted} strokeWidth="1.5" opacity={0.4} />
      ))}
      <rect x="250" y="135" width="110" height="4" rx="1" fill={primary} opacity={0.15} />
      <rect x="260" y="133" width="3" height="8" rx="1" fill={accent} />
      <rect x="268" y="133" width="3" height="8" rx="1" fill={primary} />
      <rect x="276" y="133" width="3" height="8" rx="1" fill={secondary} />
      {/* Reloj */}
      <circle cx="440" cy="65" r="25" fill={background} stroke={primary} strokeWidth="2" />
      <circle cx="440" cy="65" r="2" fill={primary} />
      <line x1="440" y1="65" x2="440" y2="48" stroke={primary} strokeWidth="2" strokeLinecap="round" />
      <line x1="440" y1="65" x2="453" y2="60" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 440 + Math.sin(rad) * 21;
        const y1 = 65 - Math.cos(rad) * 21;
        const x2 = 440 + Math.sin(rad) * 23;
        const y2 = 65 - Math.cos(rad) * 23;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={primary} strokeWidth="1.5" />;
      })}
      {/* Estantería derecha */}
      <rect x="410" y="120" width="130" height="5" rx="1" fill={secondary} />
      <rect x="415" y="97" width="10" height="23" rx="1" fill={primary} />
      <rect x="427" y="101" width="8" height="19" rx="1" fill={accent} />
      <rect x="437" y="99" width="10" height="21" rx="1" fill={secondary} />
      <rect x="449" y="103" width="7" height="17" rx="1" fill={primary} opacity={0.5} />
      <rect x="458" y="100" width="9" height="20" rx="1" fill={accent} opacity={0.6} />
      <rect x="500" y="110" width="12" height="10" rx="2" fill={secondary} opacity={0.7} />
      <circle cx="506" cy="105" r="8" fill={accent} opacity={0.5} />
      <circle cx="502" cy="102" r="5" fill={primary} opacity={0.25} />
      <rect x="410" y="170" width="130" height="5" rx="1" fill={secondary} />
      <rect x="420" y="152" width="14" height="18" rx="2" fill={primary} opacity={0.15} />
      <rect x="438" y="148" width="12" height="22" rx="1" fill={accent} opacity={0.4} />
      <circle cx="470" cy="160" r="8" fill={secondary} opacity={0.4} />
      <rect x="490" y="155" width="20" height="15" rx="2" fill={primary} opacity={0.2} />
      {/* Mesa principal */}
      <rect x="40" y="240" width="280" height="12" rx="2" fill={secondary} />
      <rect x="45" y="252" width="270" height="50" rx="2" fill={secondary} opacity={0.7} />
      <rect x="50" y="252" width="6" height="48" fill={secondary} opacity={0.9} />
      <rect x="308" y="252" width="6" height="48" fill={secondary} opacity={0.9} />
      <rect x="120" y="285" width="100" height="4" rx="1" fill={primary} opacity={0.1} />
      {/* Monitor */}
      <rect x="100" y="180" width="120" height="58" rx="4" fill={primary} />
      <rect x="104" y="184" width="112" height="46" rx="2" fill={background} />
      <rect x="110" y="190" width="40" height="4" rx="1" fill={primary} opacity={0.3} />
      <rect x="110" y="198" width="60" height="3" rx="1" fill={muted} opacity={0.4} />
      <rect x="110" y="205" width="50" height="3" rx="1" fill={muted} opacity={0.3} />
      <rect x="110" y="215" width="30" height="8" rx="2" fill={accent} opacity={0.5} />
      <rect x="175" y="190" width="35" height="30" rx="2" fill={primary} opacity={0.1} />
      <rect x="148" y="238" width="24" height="4" rx="1" fill={primary} opacity={0.8} />
      <rect x="155" y="234" width="10" height="6" fill={primary} opacity={0.6} />
      {/* Teclado y ratón */}
      <rect x="120" y="245" width="70" height="8" rx="2" fill={primary} opacity={0.2} />
      <ellipse cx="210" cy="248" rx="10" ry="6" fill={primary} opacity={0.2} />
      {/* Taza y vapor */}
      <rect x="245" y="232" width="14" height="12" rx="2" fill={accent} />
      <path d="M259 235 Q265 235 265 241 Q265 247 259 247" stroke={accent} strokeWidth="2" fill="none" />
      <path d="M249 230 Q251 225 249 220" stroke={accent} strokeWidth="1" opacity={0.3} fill="none" />
      <path d="M254 229 Q256 224 254 219" stroke={accent} strokeWidth="1" opacity={0.3} fill="none" />
      {/* Cuaderno y boli */}
      <rect x="60" y="242" width="40" height="6" rx="1" fill={accent} opacity={0.4} transform="rotate(-5 80 245)" />
      <rect x="75" y="240" width="2" height="14" rx="1" fill={primary} opacity={0.3} transform="rotate(15 76 247)" />
      {/* Silla oficina */}
      <ellipse cx="180" cy="310" rx="35" ry="8" fill={primary} />
      <rect x="156" y="270" width="48" height="40" rx="8" fill={primary} />
      <rect x="160" y="274" width="40" height="32" rx="6" fill={primary} opacity={0.7} />
      <rect x="163" y="260" width="34" height="14" rx="6" fill={primary} />
      <rect x="177" y="316" width="6" height="20" fill={primary} opacity={0.5} />
      <ellipse cx="180" cy="340" rx="28" ry="5" fill={primary} opacity={0.3} />
      <circle cx="155" cy="342" r="4" fill={primary} opacity={0.4} />
      <circle cx="205" cy="342" r="4" fill={primary} opacity={0.4} />
      <circle cx="180" cy="345" r="4" fill={primary} opacity={0.4} />
      {/* Zona reuniones: mesa redonda y sillas (estilo Cafetería) */}
      <ellipse cx={meetingTableCx} cy="280" rx="55" ry="14" fill={secondary} />
      <rect x={meetingTableCx - 4} y={floorY} width="8" height="45" fill={secondary} opacity={0.7} />
      <ellipse cx={meetingTableCx} cy="338" rx="20" ry="5" fill={secondary} opacity={0.4} />
      {meetingChairs.map((c, i) => (
        <g key={`meetingChair${i}`}>
          <rect x={c.seatX} y={c.seatY} width={c.seatW} height={c.seatH} rx="8" fill={primary} opacity={0.7} />
          <rect x={c.backX} y={c.backY} width={c.backW} height={c.backH} rx="4" fill={primary} opacity={0.5} />
          <rect x={c.leftLegX} y={c.legY} width={c.legW} height={c.legH} rx="1" fill={muted} opacity={chairLegOpacity} />
          <rect x={c.rightLegX} y={c.legY} width={c.legW} height={c.legH} rx="1" fill={muted} opacity={chairLegOpacity} />
        </g>
      ))}
      <rect x="440" y="272" width="18" height="12" rx="2" fill={background} stroke={muted} strokeWidth="1" strokeOpacity={frameStrokeOpacity} />
      <rect x="462" y="274" width="12" height="8" rx="1" fill={accent} opacity={0.6} />
      <circle cx="485" cy="278" r="4" fill={primary} opacity={0.3} />
      {/* Planta suelo */}
      <path d="M20 360 L14 395 L46 395 L40 360 Z" fill={secondary} opacity={0.8} />
      <ellipse cx="30" cy="395" rx="20" ry="4" fill={secondary} opacity={0.5} />
      <ellipse cx="30" cy="340" rx="18" ry="22" fill={accent} opacity={0.5} />
      <ellipse cx="22" cy="335" rx="12" ry="18" fill={primary} opacity={0.2} />
      <ellipse cx="38" cy="332" rx="10" ry="16" fill={accent} opacity={0.35} />
      <line x1="30" y1="360" x2="30" y2="342" stroke={accent} strokeWidth="2" opacity={0.4} />
      {/* Lámparas colgantes */}
      <line x1="150" y1="0" x2="150" y2="25" stroke={primary} strokeWidth="1.5" opacity={0.3} />
      <path d="M135 25 Q135 40 150 40 Q165 40 165 25 Z" fill={accent} opacity={0.6} />
      <circle cx="150" cy="35" r="20" fill={accent} opacity={0.06} />
      <line x1="460" y1="0" x2="460" y2="30" stroke={primary} strokeWidth="1.5" opacity={0.3} />
      <path d="M445 30 Q445 45 460 45 Q475 45 475 30 Z" fill={accent} opacity={0.6} />
      <circle cx="460" cy="40" r="20" fill={accent} opacity={0.06} />
      {/* Alfombra zona reuniones */}
      <ellipse cx="460" cy="350" rx="70" ry="20" fill={accent} opacity={0.1} />
      <ellipse cx="460" cy="350" rx="60" ry="16" fill={accent} opacity={0.08} />
      {/* Cuadro pared */}
      <rect x="250" y="150" width="40" height="50" rx="2" fill={background} stroke={muted} strokeWidth="1.5" strokeOpacity={frameStrokeOpacity} />
      <rect x="255" y="155" width="30" height="24" rx="1" fill={primary} opacity={0.15} />
      <circle cx="270" cy="167" r="8" fill={accent} opacity={0.3} />
      <rect x="255" y="183" width="30" height="3" rx="1" fill={muted} opacity={0.3} />
      <rect x="260" y="189" width="20" height="2" rx="1" fill={muted} opacity={0.2} />
    </>
  );
  if (fillContainer) {
    return (
      <svg viewBox="0 0 572 400" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', display: 'block' }}>
        {svgContent}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 572 400" width="572" height="400" style={{ borderRadius: 12, overflow: 'hidden' }}>
      {svgContent}
    </svg>
  );
}

/** Escena Stand corporativo: contenido 580×520; viewBox recortado 0 40 580 450 (sin hueco superior, menos suelo) */
function RoomSceneStand({ primary, secondary, accent, surface, muted, background, fillContainer }: RoomColors & { fillContainer?: boolean }) {
  const svgContent = (
    <>
      <defs>
        <pattern id="standFloor" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill={surface} />
          <rect x="0" y="0" width="20" height="20" fill={muted} opacity="0.15" />
          <rect x="20" y="20" width="20" height="20" fill={muted} opacity="0.15" />
        </pattern>
        <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.15" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="spotlight1" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="spotlight2" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.08" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Suelo */}
      <rect x="30" y="400" width="520" height="110" rx="4" fill="url(#standFloor)" />
      <line x1="30" y1="400" x2="550" y2="400" stroke={muted} strokeWidth="1.5" opacity="0.3" />
      {/* Pared fondo */}
      <rect x="60" y="60" width="460" height="340" rx="3" fill={surface} />
      <rect x="60" y="60" width="150" height="340" fill={primary} opacity="0.08" />
      <rect x="60" y="60" width="6" height="340" fill={primary} />
      <rect x="514" y="60" width="6" height="340" fill={primary} />
      {/* Viga header */}
      <rect x="45" y="40" width="490" height="28" rx="2" fill={primary} />
      <text x="290" y="59" textAnchor="middle" fill={background} fontSize="14" fontWeight="700" letterSpacing="6" fontFamily="'Playfair Display', serif">AURA STUDIO</text>
      {/* Pilares */}
      <rect x="50" y="40" width="16" height="365" rx="2" fill={secondary} />
      <rect x="50" y="40" width="16" height="365" rx="2" fill="#000" opacity="0.1" />
      <rect x="514" y="40" width="16" height="365" rx="2" fill={secondary} />
      <rect x="514" y="40" width="16" height="365" rx="2" fill="#000" opacity="0.1" />
      {/* Pantalla grande */}
      <rect x="190" y="85" width="200" height="130" rx="4" fill={primary} />
      <rect x="195" y="90" width="190" height="120" rx="2" fill={background} />
      <rect x="195" y="90" width="190" height="120" rx="2" fill={primary} opacity="0.05" />
      <ellipse cx="290" cy="150" rx="120" ry="80" fill="url(#screenGlow)" />
      <rect x="260" y="110" width="24" height="24" rx="3" fill={primary} opacity="0.9" />
      <circle cx="292" cy="122" r="10" fill={accent} opacity="0.8" />
      <rect x="296" y="116" width="8" height="4" rx="1" fill={secondary} />
      <text x="290" y="155" textAnchor="middle" fill={primary} fontSize="11" fontWeight="700" fontFamily="'Playfair Display', serif" letterSpacing="3">AURA</text>
      <rect x="255" y="162" width="70" height="2" rx="1" fill={accent} opacity="0.6" />
      <rect x="248" y="170" width="84" height="3" rx="1" fill={muted} opacity="0.3" />
      <rect x="256" y="178" width="68" height="3" rx="1" fill={muted} opacity="0.2" />
      <rect x="283" y="215" width="14" height="12" fill={secondary} opacity="0.5" />
      {/* Banner izquierdo */}
      <rect x="82" y="100" width="75" height="200" rx="2" fill={background} stroke={muted} strokeWidth="1" />
      <rect x="82" y="100" width="75" height="45" fill={accent} rx="2" />
      <text x="119" y="127" textAnchor="middle" fill={background} fontSize="8" fontWeight="700" letterSpacing="2">INNOVATE</text>
      <circle cx="110" cy="175" r="18" fill={primary} opacity="0.12" />
      <circle cx="125" cy="185" r="12" fill={accent} opacity="0.15" />
      <rect x="95" y="210" width="50" height="2" rx="1" fill={primary} opacity="0.3" />
      <rect x="100" y="218" width="40" height="2" rx="1" fill={muted} opacity="0.25" />
      <rect x="103" y="226" width="34" height="2" rx="1" fill={muted} opacity="0.2" />
      <circle cx="119" cy="260" r="8" fill={accent} opacity="0.15" />
      <circle cx="119" cy="260" r="4" fill={accent} opacity="0.3" />
      <rect x="105" y="300" width="28" height="4" rx="1" fill={secondary} opacity="0.4" />
      <rect x="117" y="296" width="4" height="8" fill={secondary} opacity="0.3" />
      {/* Estantería derecha */}
      <rect x="420" y="100" width="85" height="200" rx="2" fill={surface} stroke={muted} strokeWidth="1" />
      <line x1="420" y1="160" x2="505" y2="160" stroke={muted} strokeWidth="1" />
      <line x1="420" y1="220" x2="505" y2="220" stroke={muted} strokeWidth="1" />
      <rect x="428" y="115" width="18" height="38" rx="2" fill={primary} opacity="0.7" />
      <rect x="450" y="120" width="18" height="33" rx="2" fill={accent} opacity="0.6" />
      <rect x="472" y="112" width="18" height="41" rx="2" fill={secondary} opacity="0.7" />
      <rect x="494" y="118" width="8" height="35" rx="1" fill={primary} opacity="0.4" />
      <rect x="428" y="170" width="22" height="16" rx="3" fill={accent} opacity="0.5" />
      <rect x="456" y="168" width="22" height="18" rx="3" fill={primary} opacity="0.5" />
      <circle cx="496" cy="180" r="9" fill={secondary} opacity="0.4" />
      <rect x="428" y="232" width="65" height="20" rx="2" fill={primary} opacity="0.1" />
      <rect x="432" y="236" width="30" height="3" rx="1" fill={primary} opacity="0.3" />
      <rect x="432" y="242" width="20" height="2" rx="1" fill={muted} opacity="0.3" />
      <rect x="475" y="230" width="22" height="28" rx="1" fill={accent} opacity="0.2" />
      <rect x="477" y="232" width="18" height="24" rx="1" fill={background} stroke={accent} strokeWidth="0.5" />
      {/* Focos */}
      <rect x="100" y="48" width="380" height="5" rx="2" fill={secondary} opacity="0.4" />
      {[160, 290, 420].map((x, i) => (
        <g key={i}>
          <rect x={x - 8} y="48" width="16" height="10" rx="2" fill={secondary} opacity="0.6" />
          <polygon points={`${x - 6},58 ${x + 6},58 ${x + 3},65 ${x - 3},65`} fill={secondary} opacity="0.5" />
          <polygon points={`${x - 4},65 ${x + 4},65 ${x + 40},400 ${x - 40},400`} fill="url(#spotlight1)" />
        </g>
      ))}
      {/* Mostrador recepción */}
      <rect x="175" y="340" width="230" height="65" rx="4" fill={primary} />
      <rect x="170" y="335" width="240" height="10" rx="3" fill={secondary} />
      <rect x="170" y="335" width="240" height="10" rx="3" fill="#fff" opacity="0.15" />
      <rect x="185" y="352" width="65" height="42" rx="2" fill={background} opacity="0.1" />
      <rect x="260" y="352" width="65" height="42" rx="2" fill={background} opacity="0.1" />
      <rect x="335" y="352" width="60" height="42" rx="2" fill={background} opacity="0.1" />
      <rect x="272" y="360" width="14" height="14" rx="2" fill={background} opacity="0.3" />
      <circle cx="293" cy="367" r="5" fill={accent} opacity="0.5" />
      <rect x="185" y="348" width="210" height="2" rx="1" fill={accent} opacity="0.5" />
      {/* Objetos sobre mostrador */}
      <rect x="195" y="318" width="35" height="22" rx="3" fill={primary} opacity="0.8" />
      <rect x="198" y="321" width="29" height="16" rx="1" fill={background} opacity="0.9" />
      <rect x="201" y="324" width="15" height="2" rx="1" fill={primary} opacity="0.3" />
      <rect x="201" y="328" width="20" height="2" rx="1" fill={accent} opacity="0.3" />
      <rect x="260" y="322" width="24" height="16" rx="1" fill={surface} stroke={muted} strokeWidth="0.5" />
      <rect x="263" y="310" width="18" height="16" rx="1" fill={accent} opacity="0.2" />
      <rect x="265" y="312" width="14" height="12" rx="1" fill={background} stroke={accent} strokeWidth="0.5" />
      <rect x="310" y="325" width="30" height="12" rx="2" fill={surface} stroke={muted} strokeWidth="0.5" />
      <rect x="314" y="320" width="22" height="8" rx="1" fill={background} stroke={primary} strokeWidth="0.5" opacity="0.7" />
      <rect x="365" y="322" width="14" height="16" rx="2" fill={secondary} opacity="0.5" />
      <circle cx="372" cy="316" r="9" fill={accent} opacity="0.3" />
      <circle cx="369" cy="313" r="7" fill={primary} opacity="0.2" />
      <line x1="372" y1="322" x2="372" y2="315" stroke={accent} strokeWidth="1.5" opacity="0.4" />
      {/* Mesa alta + taburetes */}
      <rect x="20" y="350" width="100" height="7" rx="3" fill={secondary} />
      <rect x="20" y="350" width="100" height="7" rx="3" fill="#fff" opacity="0.12" />
      <rect x="63" y="357" width="14" height="40" rx="2" fill={secondary} opacity="0.6" />
      <ellipse cx="70" cy="400" rx="28" ry="5" fill={secondary} opacity="0.3" />
      <rect x="30" y="336" width="24" height="16" rx="2" fill={background} stroke={muted} strokeWidth="0.8" />
      <rect x="34" y="340" width="16" height="3" rx="1" fill={primary} opacity="0.3" />
      <rect x="34" y="345" width="12" height="2" rx="1" fill={accent} opacity="0.3" />
      <circle cx="92" cy="343" r="8" fill={accent} opacity="0.15" />
      <circle cx="92" cy="343" r="5" fill={accent} opacity="0.3" />
      <rect x="22" y="385" width="36" height="6" rx="12" fill={primary} opacity="0.75" />
      <rect x="30" y="391" width="5" height="16" fill={secondary} opacity="0.5" />
      <rect x="45" y="391" width="5" height="16" fill={secondary} opacity="0.5" />
      <rect x="26" y="405" width="28" height="3" rx="1" fill={secondary} opacity="0.3" />
      <rect x="82" y="385" width="36" height="6" rx="12" fill={primary} opacity="0.75" />
      <rect x="90" y="391" width="5" height="16" fill={secondary} opacity="0.5" />
      <rect x="105" y="391" width="5" height="16" fill={secondary} opacity="0.5" />
      <rect x="86" y="405" width="28" height="3" rx="1" fill={secondary} opacity="0.3" />
      {/* Planta decorativa */}
      <rect x="520" y="370" width="30" height="32" rx="3" fill={secondary} opacity="0.5" />
      <rect x="518" y="367" width="34" height="6" rx="2" fill={secondary} opacity="0.6" />
      <ellipse cx="535" cy="350" rx="18" ry="22" fill={accent} opacity="0.25" />
      <ellipse cx="528" cy="345" rx="14" ry="18" fill={primary} opacity="0.15" />
      <ellipse cx="542" cy="342" rx="12" ry="20" fill={accent} opacity="0.2" />
      <line x1="535" y1="367" x2="535" y2="340" stroke={accent} strokeWidth="2" opacity="0.3" />
      <line x1="535" y1="360" x2="525" y2="342" stroke={accent} strokeWidth="1.5" opacity="0.2" />
      <line x1="535" y1="355" x2="545" y2="338" stroke={primary} strokeWidth="1.5" opacity="0.15" />
      {/* Alfombra marca */}
      <rect x="200" y="415" width="180" height="60" rx="3" fill={primary} opacity="0.08" />
      <rect x="200" y="415" width="180" height="60" rx="3" stroke={primary} strokeWidth="1" opacity="0.15" fill="none" />
      <rect x="270" y="432" width="16" height="16" rx="2" fill={primary} opacity="0.15" />
      <circle cx="293" cy="440" r="7" fill={accent} opacity="0.12" />
      <text x="290" y="462" textAnchor="middle" fill={primary} opacity="0.2" fontSize="8" fontWeight="600" letterSpacing="3">AURA</text>
      {/* Banner colgante */}
      <rect x="475" y="70" width="3" height="25" fill={muted} opacity="0.3" />
      <rect x="460" y="95" width="35" height="55" rx="2" fill={accent} opacity="0.15" />
      <rect x="460" y="95" width="35" height="55" rx="2" stroke={accent} strokeWidth="1" fill="none" opacity="0.3" />
      <text x="477" y="118" textAnchor="middle" fill={accent} fontSize="6" fontWeight="700" letterSpacing="1" opacity="0.5">NEW</text>
      <text x="477" y="130" textAnchor="middle" fill={accent} fontSize="5" letterSpacing="1" opacity="0.4">2025</text>
      {/* Cable */}
      <path d="M 170 405 Q 150 420, 120 415" stroke={muted} strokeWidth="1" fill="none" opacity="0.15" />
    </>
  );
  if (fillContainer) {
    return (
      <svg viewBox="0 40 580 450" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', display: 'block' }}>
        {svgContent}
      </svg>
    );
  }
  return (
    <svg viewBox="0 40 580 450" width="580" height="450" style={{ borderRadius: 12, overflow: 'hidden' }}>
      {svgContent}
    </svg>
  );
}

/** Escena Fachada corporativa: viewBox 0 50 560 420 (recorte para caber en plantilla; ventana ampliada). */
function RoomSceneFachada({ primary, secondary, accent, surface, muted, background, fillContainer }: RoomColors & { fillContainer?: boolean }) {
  const svgContent = (
    <>
      <defs>
        <linearGradient id="facade-sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={secondary} stopOpacity="0.15" />
          <stop offset="100%" stopColor={surface} stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="facade-glass-ref" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>
        <pattern id="facade-awning-stripe" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="6" height="12" fill={primary} />
          <rect x="6" width="6" height="12" fill={accent} />
        </pattern>
        <clipPath id="facade-lower-clip">
          <rect x="80" y="270" width="400" height="230" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="560" height="580" fill="url(#facade-sky-grad)" rx="8" />
      <rect x="0" y="80" width="60" height="420" fill={muted} opacity="0.3" />
      <rect x="60" y="120" width="40" height="380" fill={muted} opacity="0.2" />
      <rect x="460" y="60" width="50" height="440" fill={muted} opacity="0.25" />
      <rect x="510" y="100" width="50" height="400" fill={muted} opacity="0.2" />
      <rect x="80" y="80" width="400" height="420" fill={surface} stroke={muted} strokeWidth="1" />
      <rect x="80" y="80" width="400" height="12" fill={primary} />
      <rect x="76" y="74" width="408" height="10" fill={secondary} rx="2" />
      <rect x="80" y="84" width="400" height="3" fill={secondary} opacity="0.4" />
      {[0, 1, 2].map((i) => {
        const wx = 120 + i * 130;
        return (
          <g key={`win-${i}`}>
            <rect x={wx} y="110" width="80" height="110" fill={primary} opacity="0.85" rx="2" />
            <rect x={wx + 4} y="114" width="72" height="102" fill={background} opacity="0.6" rx="1" />
            <rect x={wx + 4} y="114" width="72" height="102" fill="url(#facade-glass-ref)" rx="1" />
            <rect x={wx + 38} y="114" width="2" height="102" fill={primary} opacity="0.6" />
            <rect x={wx + 4} y="160" width="72" height="2" fill={primary} opacity="0.6" />
            <rect x={wx - 4} y="220" width="88" height="6" fill={secondary} rx="1" />
            <rect x={wx + 6} y="116" width="14" height="96" fill={accent} opacity="0.12" rx="1" />
            <rect x={wx + 58} y="116" width="12" height="96" fill={accent} opacity="0.1" rx="1" />
          </g>
        );
      })}
      <rect x="80" y="240" width="400" height="30" fill={primary} />
      <rect x="80" y="245" width="400" height="20" fill={secondary} opacity="0.3" />
      {Array.from({ length: 16 }).map((_, i) => (
        <circle key={`frieze-dot-${i}`} cx={105 + i * 24} cy="255" r="3" fill={accent} opacity="0.5" />
      ))}
      <rect x="80" y="270" width="400" height="230" fill={background} />
      <g clipPath="url(#facade-lower-clip)">
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 10 }).map((_, col) => (
            <rect key={`stone-${row}-${col}`} x={82 + col * 40 + (row % 2 === 0 ? 0 : 20)} y={272 + row * 32} width="38" height="30" fill="none" stroke={muted} strokeWidth="0.5" opacity="0.3" rx="1" />
          ))
        )}
      </g>
      <rect x="190" y="278" width="180" height="44" fill={primary} rx="4" />
      <rect x="186" y="274" width="188" height="52" fill="none" stroke={accent} strokeWidth="1.5" rx="6" opacity="0.4" />
      <rect x="205" y="288" width="16" height="16" rx="2" fill={accent} />
      <circle cx="227" cy="296" r="6" fill={secondary} opacity="0.8" />
      <text x="240" y="306" fontSize="20" fontWeight="700" fontFamily="'Playfair Display', serif" fill={background}>AURA</text>
      <text x="308" y="306" fontSize="20" fontWeight="300" fontFamily="'Space Grotesk', sans-serif" fill={accent}>.</text>
      <rect x="220" y="270" width="4" height="10" fill={secondary} rx="1" />
      <rect x="336" y="270" width="4" height="10" fill={secondary} rx="1" />
      <g>
        <rect x="95" y="338" width="195" height="145" fill={primary} rx="3" />
        <rect x="100" y="343" width="185" height="135" fill={surface} opacity="0.4" rx="2" />
        <rect x="100" y="343" width="185" height="135" fill="url(#facade-glass-ref)" rx="2" />
        <rect x="102" y="345" width="181" height="60" fill={primary} opacity="0.15" />
        <rect x="140" y="410" width="60" height="8" fill={secondary} rx="2" />
        <rect x="152" y="380" width="36" height="30" fill={accent} rx="4" opacity="0.9" />
        <rect x="155" y="395" width="30" height="3" fill={background} rx="1" opacity="0.6" />
        <rect x="220" y="355" width="50" height="65" fill={primary} rx="2" opacity="0.7" />
        <circle cx="245" cy="378" r="12" fill={accent} opacity="0.5" />
        <rect x="230" y="398" width="30" height="3" fill={surface} rx="1" opacity="0.5" />
        <rect x="233" y="405" width="24" height="2" fill={surface} rx="1" opacity="0.3" />
        <rect x="110" y="420" width="80" height="3" fill={secondary} opacity="0.6" />
        <rect x="115" y="408" width="12" height="12" fill={primary} rx="1" opacity="0.5" />
        <rect x="132" y="410" width="10" height="10" fill={accent} rx="5" opacity="0.4" />
        <rect x="148" y="406" width="8" height="14" fill={secondary} rx="1" opacity="0.5" />
        <rect x="162" y="409" width="12" height="11" fill={primary} rx="2" opacity="0.4" />
        <ellipse cx="170" cy="348" rx="40" ry="5" fill={accent} opacity="0.08" />
        <text x="115" y="472" fontSize="7" fontFamily="'Space Grotesk', sans-serif" fill={primary} opacity="0.4" letterSpacing="2">FLAGSHIP STORE</text>
      </g>
      <g>
        <rect x="308" y="338" width="80" height="145" fill={primary} rx="3" />
        <rect x="313" y="343" width="34" height="135" fill={secondary} rx="2" />
        <rect x="349" y="343" width="34" height="135" fill={secondary} rx="2" />
        <rect x="316" y="348" width="28" height="90" fill={surface} opacity="0.35" rx="1" />
        <rect x="352" y="348" width="28" height="90" fill={surface} opacity="0.35" rx="1" />
        <rect x="316" y="348" width="28" height="90" fill="url(#facade-glass-ref)" rx="1" />
        <rect x="352" y="348" width="28" height="90" fill="url(#facade-glass-ref)" rx="1" />
        <rect x="340" y="405" width="3" height="24" fill={accent} rx="1.5" />
        <rect x="353" y="405" width="3" height="24" fill={accent} rx="1.5" />
        <rect x="313" y="338" width="70" height="2" fill={accent} opacity="0.6" />
        <text x="348" y="365" fontSize="10" fontWeight="700" fontFamily="'Playfair Display', serif" fill={accent} textAnchor="middle" opacity="0.7">42</text>
      </g>
      <g>
        <rect x="405" y="338" width="60" height="100" fill={primary} rx="3" />
        <rect x="410" y="343" width="50" height="90" fill={surface} opacity="0.35" rx="2" />
        <rect x="410" y="343" width="50" height="90" fill="url(#facade-glass-ref)" rx="2" />
        <rect x="434" y="343" width="2" height="90" fill={primary} opacity="0.5" />
        <rect x="415" y="380" width="16" height="20" fill={accent} opacity="0.15" rx="2" />
        <rect x="440" y="370" width="14" height="30" fill={primary} opacity="0.12" rx="2" />
        <rect x="402" y="438" width="66" height="5" fill={secondary} rx="1" />
        <rect x="408" y="430" width="54" height="10" fill={primary} opacity="0.7" rx="2" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={`flower-r-${i}`} cx={418 + i * 13} cy="425" r="5" fill={accent} opacity={0.5 + i * 0.1} />
        ))}
        {[0, 1, 2].map((i) => (
          <rect key={`stem-r-${i}`} x={423 + i * 13} y="425" width="1.5" height="7" fill={secondary} opacity="0.5" />
        ))}
      </g>
      <g>
        <polygon points="298,330 398,330 404,354 292,354" fill="url(#facade-awning-stripe)" opacity="0.85" />
        <rect x="292" y="328" width="112" height="4" fill={primary} rx="1" />
        <polygon points="298,354 398,354 395,360 301,360" fill={primary} opacity="0.08" />
        {Array.from({ length: 7 }).map((_, i) => (
          <circle key={`scallop-${i}`} cx={300 + i * 15} cy="354" r="4" fill="url(#facade-awning-stripe)" opacity="0.85" />
        ))}
      </g>
      {[145, 420].map((lx, i) => (
        <g key={`sconce-${i}`}>
          <rect x={lx - 2} y="325" width="4" height="8" fill={secondary} rx="1" />
          <polygon points={`${lx - 8},333 ${lx + 8},333 ${lx + 6},345 ${lx - 6},345`} fill={accent} opacity="0.85" />
          <ellipse cx={lx} cy="360" rx="25" ry="30" fill={accent} opacity="0.05" />
          <circle cx={lx} cy="340" r="2" fill={background} opacity="0.9" />
        </g>
      ))}
      <rect x="0" y="488" width="560" height="92" fill={muted} opacity="0.4" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={`tile-${i}`} x={i * 56} y="488" width="55" height="91" fill="none" stroke={surface} strokeWidth="0.5" opacity="0.3" />
      ))}
      <rect x="0" y="486" width="560" height="4" fill={secondary} opacity="0.5" />
      <rect x="296" y="478" width="104" height="12" fill={secondary} rx="2" />
      <rect x="300" y="483" width="96" height="6" fill={surface} opacity="0.3" rx="1" />
      <g>
        <rect x="95" y="468" width="40" height="22" fill={secondary} rx="3" />
        <rect x="97" y="465" width="36" height="5" fill={secondary} rx="2" />
        <ellipse cx="108" cy="458" rx="14" ry="10" fill={accent} opacity="0.6" />
        <ellipse cx="120" cy="455" rx="10" ry="8" fill={accent} opacity="0.45" />
        <ellipse cx="114" cy="450" rx="8" ry="6" fill={primary} opacity="0.3" />
        <rect x="112" y="458" width="2" height="8" fill={secondary} opacity="0.5" />
      </g>
      <g>
        <rect x="410" y="468" width="40" height="22" fill={secondary} rx="3" />
        <rect x="412" y="465" width="36" height="5" fill={secondary} rx="2" />
        <ellipse cx="423" cy="458" rx="12" ry="9" fill={accent} opacity="0.55" />
        <ellipse cx="435" cy="455" rx="10" ry="8" fill={accent} opacity="0.5" />
        <ellipse cx="430" cy="450" rx="8" ry="7" fill={primary} opacity="0.3" />
        <rect x="428" y="458" width="2" height="8" fill={secondary} opacity="0.5" />
      </g>
      <g>
        <polygon points="492,490 510,490 514,540 488,540" fill={primary} opacity="0.8" />
        <rect x="493" y="498" width="16" height="30" fill={surface} rx="1" opacity="0.6" />
        <text x="501" y="511" fontSize="5" fontWeight="700" fontFamily="'Space Grotesk', sans-serif" fill={primary} textAnchor="middle">OPEN</text>
        <rect x="496" y="518" width="10" height="1.5" fill={accent} rx="0.5" opacity="0.6" />
        <rect x="497" y="522" width="8" height="1" fill={primary} rx="0.5" opacity="0.3" />
      </g>
      <g>
        <rect x="86" y="270" width="3" height="200" fill={secondary} rx="1" />
        <rect x="84" y="275" width="14" height="4" fill={secondary} rx="1" />
        <rect x="90" y="280" width="28" height="50" fill={accent} rx="2" />
        <rect x="97" y="288" width="14" height="14" fill={background} opacity="0.3" rx="7" />
        <rect x="100" y="310" width="8" height="1.5" fill={background} rx="0.5" opacity="0.4" />
        <rect x="98" y="315" width="12" height="1.5" fill={background} rx="0.5" opacity="0.3" />
        <path d="M118,280 Q122,295 118,310 Q114,320 118,330" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.3" />
      </g>
      <rect x="458" y="290" width="18" height="24" fill={primary} rx="2" />
      <text x="467" y="307" fontSize="12" fontWeight="700" fontFamily="'Playfair Display', serif" fill={background} textAnchor="middle">42</text>
      <g>
        <rect x="392" y="440" width="42" height="20" fill={background} stroke={muted} strokeWidth="0.5" rx="2" />
        <circle cx="400" cy="450" r="3" fill={accent} opacity="0.8" />
        <text x="408" y="453" fontSize="6" fontWeight="600" fontFamily="'Space Grotesk', sans-serif" fill={primary}>OPEN</text>
      </g>
      <rect x="476" y="88" width="4" height="398" fill={muted} opacity="0.4" rx="2" />
      <rect x="474" y="230" width="8" height="6" fill={muted} opacity="0.3" rx="1" />
      <rect x="474" y="400" width="8" height="6" fill={muted} opacity="0.3" rx="1" />
      <rect x="460" y="350" width="12" height="16" fill={muted} opacity="0.3" rx="1" />
      <g opacity="0.35">
        <circle cx="160" cy="530" r="14" fill="none" stroke={primary} strokeWidth="2" />
        <circle cx="194" cy="530" r="14" fill="none" stroke={primary} strokeWidth="2" />
        <line x1="160" y1="530" x2="175" y2="514" stroke={primary} strokeWidth="2" />
        <line x1="175" y1="514" x2="194" y2="530" stroke={primary} strokeWidth="2" />
        <line x1="175" y1="514" x2="185" y2="510" stroke={primary} strokeWidth="2" />
        <line x1="185" y1="510" x2="194" y2="530" stroke={primary} strokeWidth="1.5" />
        <line x1="185" y1="510" x2="190" y2="505" stroke={primary} strokeWidth="2" />
        <line x1="186" y1="506" x2="194" y2="508" stroke={primary} strokeWidth="1.5" />
        <rect x="172" y="511" width="8" height="3" fill={primary} rx="1.5" />
      </g>
    </>
  );
  const viewBox = '0 50 560 420';
  const commonProps = { viewBox, style: { borderRadius: 12, overflow: 'hidden' as const } };
  if (fillContainer) {
    return (
      <svg {...commonProps} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', display: 'block' }}>
        {svgContent}
      </svg>
    );
  }
  return (
    <svg {...commonProps} width="560" height="420">
      {svgContent}
    </svg>
  );
}

type RoomSceneProps = RoomColors & { fillContainer?: boolean };
const COMPACT_SCENE_MAP: Record<string, React.ComponentType<RoomSceneProps>> = {
  estudio: RoomSceneEstudio,
  cafeteria: RoomSceneCafeteria,
  oficina: RoomSceneOficina,
  stand: RoomSceneStand,
  fachada: RoomSceneFachada,
};
