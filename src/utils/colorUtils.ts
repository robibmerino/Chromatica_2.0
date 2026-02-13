import { Color, HarmonyType } from '../types/palette';

export const generateId = (): string => Math.random().toString(36).substring(2, 9);

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
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
};

export const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
};

export const hslToHex = (h: number, s: number, l: number): string => {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
};

export const createColor = (hex: string, locked = false): Color => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return {
    id: generateId(),
    hex: hex.toUpperCase(),
    rgb,
    hsl,
    locked,
  };
};

export const randomHex = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

export const generateRandomColor = (): Color => createColor(randomHex());

export const getLuminance = (r: number, g: number, b: number): number => {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const getContrastRatio = (color1: Color, color2: Color): number => {
  const l1 = getLuminance(color1.rgb.r, color1.rgb.g, color1.rgb.b);
  const l2 = getLuminance(color2.rgb.r, color2.rgb.g, color2.rgb.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

export const getTextColor = (bgColor: Color): string => {
  const luminance = getLuminance(bgColor.rgb.r, bgColor.rgb.g, bgColor.rgb.b);
  return luminance > 0.179 ? '#000000' : '#FFFFFF';
};

export const generateHarmony = (baseColor: Color, type: HarmonyType, count: number = 5): Color[] => {
  const { h, s, l } = baseColor.hsl;
  const colors: Color[] = [{ ...baseColor }];

  switch (type) {
    case 'complementary':
      colors.push(createColor(hslToHex((h + 180) % 360, s, l)));
      // Fill remaining with variations
      for (let i = colors.length; i < count; i++) {
        const variation = i % 2 === 0 ? 15 : -15;
        colors.push(createColor(hslToHex((h + variation * i) % 360, s, Math.max(20, Math.min(80, l + (i * 10 - 20))))));
      }
      break;
    case 'analogous':
      for (let i = 1; i < count; i++) {
        const angle = (i * 30) - (Math.floor(count / 2) * 30);
        colors.push(createColor(hslToHex((h + angle + 360) % 360, s, l)));
      }
      break;
    case 'triadic':
      colors.push(createColor(hslToHex((h + 120) % 360, s, l)));
      colors.push(createColor(hslToHex((h + 240) % 360, s, l)));
      for (let i = colors.length; i < count; i++) {
        colors.push(createColor(hslToHex((h + (i * 60)) % 360, Math.max(20, s - 20), Math.max(30, Math.min(70, l + (i * 10 - 20))))));
      }
      break;
    case 'split-complementary':
      colors.push(createColor(hslToHex((h + 150) % 360, s, l)));
      colors.push(createColor(hslToHex((h + 210) % 360, s, l)));
      for (let i = colors.length; i < count; i++) {
        colors.push(createColor(hslToHex((h + (i * 30)) % 360, s, Math.max(30, Math.min(70, l + (i * 15 - 30))))));
      }
      break;
    case 'tetradic':
      colors.push(createColor(hslToHex((h + 90) % 360, s, l)));
      colors.push(createColor(hslToHex((h + 180) % 360, s, l)));
      colors.push(createColor(hslToHex((h + 270) % 360, s, l)));
      for (let i = colors.length; i < count; i++) {
        colors.push(createColor(hslToHex((h + (i * 45)) % 360, Math.max(20, s - 10), Math.max(30, Math.min(70, l + 10)))));
      }
      break;
    case 'monochromatic':
      for (let i = 1; i < count; i++) {
        const newL = Math.max(10, Math.min(90, l + (i - Math.floor(count / 2)) * 15));
        const newS = Math.max(10, Math.min(100, s + (i % 2 === 0 ? 10 : -10)));
        colors.push(createColor(hslToHex(h, newS, newL)));
      }
      break;
  }

  return colors.slice(0, count);
};

export const generateGradientPalette = (color1: Color, color2: Color, steps: number): Color[] => {
  const colors: Color[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const r = Math.round(color1.rgb.r + (color2.rgb.r - color1.rgb.r) * t);
    const g = Math.round(color1.rgb.g + (color2.rgb.g - color1.rgb.g) * t);
    const b = Math.round(color1.rgb.b + (color2.rgb.b - color1.rgb.b) * t);
    colors.push(createColor(rgbToHex(r, g, b)));
  }
  return colors;
};

export const adjustColor = (color: Color, adjustment: { h?: number; s?: number; l?: number }): Color => {
  let { h, s, l } = color.hsl;
  if (adjustment.h !== undefined) h = (adjustment.h + 360) % 360;
  if (adjustment.s !== undefined) s = Math.max(0, Math.min(100, adjustment.s));
  if (adjustment.l !== undefined) l = Math.max(0, Math.min(100, adjustment.l));
  return createColor(hslToHex(h, s, l), color.locked);
};

export const getColorName = (hex: string): string => {
  const { h, s, l } = hexToHsl(hex);
  
  if (l < 15) return 'Negro';
  if (l > 85 && s < 10) return 'Blanco';
  if (s < 10) return l < 50 ? 'Gris oscuro' : 'Gris claro';
  
  const hueNames: { [key: number]: string } = {
    0: 'Rojo',
    30: 'Naranja',
    60: 'Amarillo',
    90: 'Lima',
    120: 'Verde',
    150: 'Turquesa',
    180: 'Cian',
    210: 'Azul cielo',
    240: 'Azul',
    270: 'Violeta',
    300: 'Magenta',
    330: 'Rosa',
  };
  
  const hueKey = Math.round(h / 30) * 30 % 360;
  let name = hueNames[hueKey] || 'Color';
  
  if (l < 30) name = name + ' oscuro';
  else if (l > 70) name = name + ' claro';
  
  if (s < 40) name = name + ' apagado';
  else if (s > 80) name = name + ' vibrante';
  
  return name;
};

export const calculatePaletteMetrics = (colors: Color[]) => {
  if (colors.length < 2) return null;

  // Calculate average saturation
  const avgSaturation = colors.reduce((sum, c) => sum + c.hsl.s, 0) / colors.length;
  
  // Calculate average lightness
  const avgLightness = colors.reduce((sum, c) => sum + c.hsl.l, 0) / colors.length;
  
  // Calculate hue diversity
  const hues = colors.map(c => c.hsl.h);
  const hueRange = Math.max(...hues) - Math.min(...hues);
  
  // Calculate contrast scores
  let minContrast = Infinity;
  let maxContrast = 0;
  let contrastSum = 0;
  let contrastCount = 0;
  
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const contrast = getContrastRatio(colors[i], colors[j]);
      minContrast = Math.min(minContrast, contrast);
      maxContrast = Math.max(maxContrast, contrast);
      contrastSum += contrast;
      contrastCount++;
    }
  }
  
  const avgContrast = contrastSum / contrastCount;
  
  // Accessibility check (WCAG AA requires 4.5:1 for normal text)
  const accessibilityScore = maxContrast >= 4.5 ? 'AA' : maxContrast >= 3 ? 'AA Large' : 'Bajo';

  return {
    avgSaturation: Math.round(avgSaturation),
    avgLightness: Math.round(avgLightness),
    hueRange: Math.round(hueRange),
    minContrast: minContrast.toFixed(2),
    maxContrast: maxContrast.toFixed(2),
    avgContrast: avgContrast.toFixed(2),
    accessibilityScore,
    colorCount: colors.length,
  };
};
