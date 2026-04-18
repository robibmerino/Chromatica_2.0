import { describe, expect, it } from 'vitest';
import { ciede2000FromHex, ciede2000FromLabs, hexToLabD65, labToHexD65 } from './ciede2000';

describe('ciede2000FromHex', () => {
  it('negro vs blanco produce ΔE₀₀ alto (~100)', () => {
    const d = ciede2000FromHex('#000000', '#ffffff');
    expect(d).toBeGreaterThan(95);
    expect(d).toBeLessThanOrEqual(100.5);
  });

  it('mismo color da 0', () => {
    expect(ciede2000FromHex('#3b82f6', '#3b82f6')).toBe(0);
  });

  it('round-trip Lab aproximado desde hex', () => {
    const lab = hexToLabD65('#6366f1');
    const back = labToHexD65(lab.L, lab.a, lab.b);
    expect(ciede2000FromHex('#6366f1', back)).toBeLessThan(1.5);
  });
});

/** Par de referencia de Sharma et al. (notas CIEDE2000, caso publicado frecuentemente). */
describe('ciede2000FromLabs (referencia Sharma)', () => {
  it('coincide con ΔE₀₀ ~2,0425 para el par de prueba estándar', () => {
    const lab1 = { L: 50, a: 2.6772, b: -79.7755 };
    const lab2 = { L: 50, a: 0, b: -82.7485 };
    expect(ciede2000FromLabs(lab1, lab2)).toBeCloseTo(2.0425, 2);
  });
});
