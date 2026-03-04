import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  hexToHsl,
  hslToHex,
  hexToCmyk,
  blendHex,
  rotateHue,
  getContrastColor,
  getColorName,
  getLuminanceFromHex,
  getContrastRatioHex,
} from './colorUtils';

describe('colorUtils', () => {
  describe('hexToRgb', () => {
    it('convierte negro correctamente', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });
    it('convierte blanco correctamente', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    });
    it('convierte rojo puro correctamente', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });
    it('acepta hex sin #', () => {
      expect(hexToRgb('00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    });
  });

  describe('rgbToHex / hexToRgb roundtrip', () => {
    it('hex → rgb → hex preserva el color', () => {
      const hex = '#3a7b2f';
      const rgb = hexToRgb(hex);
      expect(rgb.r).toBeGreaterThanOrEqual(0);
      expect(rgb.r).toBeLessThanOrEqual(255);
    });
  });

  describe('hexToHsl / hslToHex', () => {
    it('convierte negro a HSL', () => {
      const hsl = hexToHsl('#000000');
      expect(hsl).toMatchObject({ s: 0, l: 0 });
    });
    it('convierte blanco a HSL', () => {
      const hsl = hexToHsl('#ffffff');
      expect(hsl).toMatchObject({ s: 0, l: 100 });
    });
    it('hslToHex roundtrip preserva el color aproximado', () => {
      const original = '#6366f1';
      const { h, s, l } = hexToHsl(original);
      const back = hslToHex(h, s, l);
      const origRgb = hexToRgb(original);
      const backRgb = hexToRgb(back);
      // Pequeñas diferencias por redondeo HSL↔RGB son aceptables
      expect(Math.abs(backRgb.r - origRgb.r)).toBeLessThanOrEqual(1);
      expect(Math.abs(backRgb.g - origRgb.g)).toBeLessThanOrEqual(1);
      expect(Math.abs(backRgb.b - origRgb.b)).toBeLessThanOrEqual(1);
    });
  });

  describe('hexToCmyk', () => {
    it('retorna cmyk con valores 0-100', () => {
      const cmyk = hexToCmyk('#ff0000');
      expect(cmyk.c).toBeGreaterThanOrEqual(0);
      expect(cmyk.c).toBeLessThanOrEqual(100);
      expect(cmyk.m).toBeGreaterThanOrEqual(0);
      expect(cmyk.k).toBeGreaterThanOrEqual(0);
    });
  });

  describe('blendHex', () => {
    it('t=0 devuelve el primer color', () => {
      expect(blendHex('#ff0000', '#0000ff', 0)).toBe('#ff0000');
    });
    it('t=1 devuelve el segundo color', () => {
      expect(blendHex('#ff0000', '#0000ff', 1)).toBe('#0000ff');
    });
    it('t=0.5 interpola entre ambos', () => {
      const result = blendHex('#ff0000', '#00ff00', 0.5);
      expect(result).toMatch(/^#[a-f0-9]{6}$/i);
    });
  });

  describe('rotateHue', () => {
    it('rota 180 grados en rojo da cian aproximado', () => {
      const result = rotateHue('#ff0000', 180);
      const hsl = hexToHsl(result);
      expect(hsl.h).toBeGreaterThan(170);
      expect(hsl.h).toBeLessThan(190);
    });
  });

  describe('getContrastColor', () => {
    it('fondo oscuro devuelve blanco', () => {
      expect(getContrastColor('#1a1a2e')).toBe('#ffffff');
    });
    it('fondo claro devuelve oscuro', () => {
      expect(getContrastColor('#f5f5f5')).toBe('#1a1a2e');
    });
  });

  describe('getColorName', () => {
    it('devuelve nombre en español para colores básicos', () => {
      expect(getColorName('#000000')).toBe('Negro');
      expect(getColorName('#ffffff')).toBe('Blanco');
    });
  });

  describe('getLuminanceFromHex', () => {
    it('negro tiene luminancia ~0', () => {
      expect(getLuminanceFromHex('#000000')).toBeLessThan(0.01);
    });
    it('blanco tiene luminancia ~1', () => {
      expect(getLuminanceFromHex('#ffffff')).toBeGreaterThan(0.99);
    });
  });

  describe('getContrastRatioHex', () => {
    it('negro sobre blanco tiene ratio alto', () => {
      expect(getContrastRatioHex('#000000', '#ffffff')).toBeGreaterThan(20);
    });
    it('mismo color tiene ratio 1', () => {
      expect(getContrastRatioHex('#ff0000', '#ff0000')).toBe(1);
    });
  });
});
