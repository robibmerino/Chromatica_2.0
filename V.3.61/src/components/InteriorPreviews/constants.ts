/** Mapa de variante → título principal y subtítulo para el header */
export const VARIANT_HEADERS: Record<string, { subtitle: string; title: string; specs?: { label: string; value: string }[] }> = {
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
export const MATERIAL_LABELS: Record<string, { label: string; flex: number }[]> = {
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
export const COMPACT_VARIANTS = ['estudio', 'cafeteria', 'oficina', 'stand', 'fachada'] as const;

/** Aspect ratio del contenedor de la escena por variante (compact layout). */
export const SCENE_ASPECT_RATIO: Record<string, string> = {
  // Misma relación de aspecto para todas las variantes: la tarjeta compacta mantiene
  // altura uniforme al cambiar plantilla (la escena escala dentro con `meet`).
  estudio: '580/450',
  cafeteria: '580/450',
  oficina: '580/450',
  stand: '580/450',
  fachada: '580/450',
};
