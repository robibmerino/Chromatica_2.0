import { describe, expect, it } from 'vitest';
import { evaluateLightnessBalance, grayHexFromLstar } from './lightnessBalanceAnalysis';

const roleMap = (hexes: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(hexes).map(([role, hex]) => [role, { hex, label: role }]),
  ) as Record<string, { hex: string; label: string }>;

describe('evaluateLightnessBalance', () => {
  it('devuelve puntuación 0–100 y contadores de zona', () => {
    const r = evaluateLightnessBalance(
      roleMap({
        P: '#6366f1',
        S: '#8b5cf6',
        A: '#ec4899',
        A2: '#f97316',
        F: '#faf5ff',
        T: '#1e1b4b',
      }),
    );
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
    // P, S, A, A2, F, T (Ts y Sf excluidos del análisis; aquí no hay Ts/Sf)
    expect(r.swatches.length).toBe(6);
    expect(r.darkCount + r.midCount + r.lightCount).toBe(6);
    expect(r.zonesPresent).toBeGreaterThanOrEqual(1);
  });

  it('grayHexFromLstar produce hex válido', () => {
    const g = grayHexFromLstar(50);
    expect(g).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('penaliza más los ΔL* muy pequeños entre roles P/S/A/A2 que entre apoyos', () => {
    const crowdedMain = evaluateLightnessBalance(
      roleMap({
        P: '#5c5cf0',
        S: '#6066f1',
        A: '#646cf2',
        A2: '#6a72f3',
        F: '#f8fafc',
        T: '#020617',
      }),
    );
    const spacedMain = evaluateLightnessBalance(
      roleMap({
        P: '#1e1b4b',
        S: '#6366f1',
        A: '#ec4899',
        A2: '#f97316',
        F: '#f8fafc',
        T: '#020617',
      }),
    );
    expect(crowdedMain.score).toBeLessThan(spacedMain.score);
  });

  it('excluye Ts y Sf aunque estén en el mapa', () => {
    const r = evaluateLightnessBalance(
      roleMap({
        P: '#6366f1',
        S: '#8b5cf6',
        A: '#ec4899',
        A2: '#f97316',
        F: '#faf5ff',
        T: '#1e1b4b',
        Ts: '#64748b',
        Sf: '#e2e8f0',
      }),
    );
    const keys = r.swatches.map((s) => s.key).sort().join(',');
    expect(keys).toContain('T');
    expect(keys).not.toContain('Ts');
    expect(keys).not.toContain('Sf');
  });
});
