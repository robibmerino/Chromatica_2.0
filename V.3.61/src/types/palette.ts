export interface Color {
  id: string;
  hex: string;
  hsl: { h: number; s: number; l: number };
  rgb: { r: number; g: number; b: number };
  name?: string;
  locked: boolean;
}

export interface Palette {
  id: string;
  name: string;
  colors: Color[];
  createdAt: Date;
}

export type HarmonyType = 
  | 'complementary' 
  | 'analogous' 
  | 'triadic' 
  | 'split-complementary' 
  | 'tetradic' 
  | 'monochromatic';

export type GenerationMode = 
  | 'random' 
  | 'harmony' 
  | 'image' 
  | 'gradient';

/** Paleta con roles semánticos para póster (ej. vista previa de aplicación). */
export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: {
    primario: string;
    secondario: string;
    acento: string;
    /** Acento 2 (apagado en leyenda) */
    apagado: string;
    fondo: string;
    sobrefondo: string;
    /** Texto principal */
    texto: string;
    /** Texto secundario (antes texto fino) */
    'texto fino': string;
    /** Gris para líneas separadoras */
    línea: string;
    /** Desde color 5: principal 2 y fondos derivados */
    primario2?: string;
    fondo2?: string;
    sobrefondo2?: string;
    /** Desde color 6 */
    secondario2?: string;
    /** Desde color 7 */
    acento3?: string;
    /** Desde color 8 */
    acento4?: string;
  };
}

export type PosterVariant = 'claro' | 'oscuro';

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 50 };
  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Versión muy clara del color (para fondo/sobrefondo en poster claro). Conserva algo de saturación para que se note el tinte. */
function lightenFromPrimario(hex: string, lightness: number): string {
  const { h, s } = hexToHsl(hex);
  return hslToHex(h, Math.max(5, s - 8), lightness);
}

/** Versión muy oscura del color (para fondo/sobrefondo en poster oscuro). */
function darkenFromPrimario(hex: string, lightness: number): string {
  const { h, s } = hexToHsl(hex);
  return hslToHex(h, Math.min(100, s + 10), lightness);
}

/** Valores predeterminados: texto, texto fino y gris de líneas. fondo/sobrefondo se derivan del primario. */
export const POSTER_DEFAULTS: Record<PosterVariant, { texto: string; 'texto fino': string; línea: string }> = {
  claro: {
    texto: '#1a1a1a',
    'texto fino': '#6B6B6B',
    línea: '#5a5a5a',
  },
  oscuro: {
    texto: '#f5f5f5',
    'texto fino': '#a0a0b0',
    línea: '#808090',
  },
};

/** Construye ColorPalette. Con 2 colores: secundario/acento/acento2 = col[1]. Con 3: acento2 = acento. Con 5+: primario2, fondo2, sobrefondo2. Con 6+: secondario2. Con 7+: acento3. Con 8+: acento4. */
export function buildColorPaletteFromHarmony(
  colors: string[],
  variant: PosterVariant,
  id = 'harmony',
  name = 'Paleta',
  description = ''
): ColorPalette {
  const def = POSTER_DEFAULTS[variant];
  const primario = colors[0] ?? '#6366f1';
  const secondario = colors.length >= 2 ? (colors[1] ?? primario) : primario;
  const acento = colors.length >= 3 ? (colors[2] ?? secondario) : secondario;
  const apagado =
    colors.length >= 4 ? (colors[3] ?? acento) : acento;
  const fondo =
    variant === 'claro'
      ? lightenFromPrimario(primario, 92)
      : darkenFromPrimario(primario, 10);
  const sobrefondo =
    variant === 'claro'
      ? lightenFromPrimario(primario, 86)
      : darkenFromPrimario(primario, 16);

  const result: ColorPalette['colors'] = {
    primario,
    secondario,
    acento,
    apagado,
    fondo,
    sobrefondo,
    texto: def.texto,
    'texto fino': def['texto fino'],
    línea: def.línea,
  };

  if (colors.length >= 5) {
    const primario2 = colors[4];
    result.primario2 = primario2;
    result.fondo2 =
      variant === 'claro'
        ? lightenFromPrimario(primario2, 92)
        : darkenFromPrimario(primario2, 10);
    result.sobrefondo2 =
      variant === 'claro'
        ? lightenFromPrimario(primario2, 86)
        : darkenFromPrimario(primario2, 16);
  }
  if (colors.length >= 6) result.secondario2 = colors[5];
  if (colors.length >= 7) result.acento3 = colors[6];
  if (colors.length >= 8) result.acento4 = colors[7];

  return { id, name, description, colors: result };
}
