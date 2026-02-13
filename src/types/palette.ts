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
