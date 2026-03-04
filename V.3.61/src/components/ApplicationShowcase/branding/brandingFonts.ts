import type React from 'react';

/**
 * Tipografía compartida del branding "aura" (Mockup, Dirección fotográfica, Territorio visual).
 * Usar spread en style: { ...FONT_SERIF, color, fontSize, ... }
 */
export const FONT_SANS: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

export const FONT_SERIF: React.CSSProperties = {
  fontFamily: "'Libre Baskerville', serif",
};

export const FONT_CURSIVE: React.CSSProperties = {
  fontFamily: "'Caveat', cursive",
};

export const FONT_MONO: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
};

/** Serif + lowercase para la marca "aura". */
export const AURA_LOWERCASE: React.CSSProperties = {
  ...FONT_SERIF,
  textTransform: 'lowercase',
};
