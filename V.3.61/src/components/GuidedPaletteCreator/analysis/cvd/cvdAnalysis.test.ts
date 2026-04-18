import { describe, expect, it } from 'vitest';
import { hexToRgb } from '../../../../utils/colorUtils';
import {
  detectCvdConflicts,
  evaluateCvdGlobalScore,
  simulateCvdHex,
} from './cvdAnalysis';

const roleMap = (hexes: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(hexes).map(([role, hex]) => [role, { hex, label: role }])
  ) as Record<string, { hex: string; label: string }>;

describe('simulateCvdHex', () => {
  it('protanopia de #ff0000 devuelve un hex determinista de 7 caracteres', () => {
    const out = simulateCvdHex('#ff0000', 'protanopia');
    expect(out).toMatch(/^#[0-9a-f]{6}$/i);
    expect(out.toLowerCase()).toBe('#6d5f00');
  });

  it('achromatopsia produce RGB con R=G=B', () => {
    const { r, g, b } = hexToRgb(simulateCvdHex('#ff0000', 'achromatopsia'));
    expect(r).toBe(g);
    expect(g).toBe(b);
  });
});

describe('evaluateCvdGlobalScore', () => {
  it('devuelve un entero entre 0 y 100', () => {
    const s = evaluateCvdGlobalScore(
      roleMap({
        P: '#ef4444',
        S: '#22c55e',
        A: '#fbbf24',
        A2: '#3b82f6',
        F: '#f1f5f9',
      })
    );
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(100);
  });

  it('colores muy similares bajan la puntuación', () => {
    const diverse = evaluateCvdGlobalScore(
      roleMap({
        P: '#1e293b',
        S: '#334155',
        A: '#ec4899',
        A2: '#fbbf24',
        F: '#f8fafc',
      })
    );
    const similar = evaluateCvdGlobalScore(
      roleMap({
        P: '#22c55e',
        S: '#16a34a',
        A: '#15803d',
        A2: '#4ade80',
        F: '#f0fdf4',
      })
    );
    expect(diverse).toBeGreaterThanOrEqual(similar);
  });

  it('la nota global usa peor caso por par: todos los roles iguales dan 0 %', () => {
    const s = evaluateCvdGlobalScore(
      roleMap({
        P: '#ff0000',
        S: '#ff0000',
        A: '#ff0000',
        A2: '#ff0000',
        F: '#ff0000',
      })
    );
    expect(s).toBe(0);
  });
});

describe('detectCvdConflicts', () => {
  it('lista pares con ΔE simulado bajo umbral cuando los simulados casi coinciden', () => {
    const conflicts = detectCvdConflicts(
      roleMap({
        P: '#ff0000',
        S: '#ff0000',
        A: '#ff0000',
        A2: '#ff0000',
        F: '#ff0000',
      }),
      'deuteranopia'
    );
    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts[0].deltaE).toBeLessThan(1);
  });
});
