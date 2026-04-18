import { describe, expect, it } from 'vitest';
import { hslToHex } from '../../../../utils/colorUtils';
import { evaluateChromaticHarmony } from './harmonyAnalysis';

const roleMap = (hexes: Record<string, string>) =>
  Object.fromEntries(Object.entries(hexes).map(([role, hex]) => [role, { hex, label: role }])) as Record<
    string,
    { hex: string; label: string }
  >;

describe('evaluateChromaticHarmony', () => {
  it('devuelve score dentro de 0..100 y patrón dominante', () => {
    const analysis = evaluateChromaticHarmony(
      roleMap({
        P: '#6366f1',
        S: '#8b5cf6',
        A: '#ec4899',
        A2: '#f97316',
      })
    );
    expect(analysis.score).toBeGreaterThanOrEqual(0);
    expect(analysis.score).toBeLessThanOrEqual(100);
    expect(analysis.patternScores.length).toBe(8);
    expect(analysis.bestPattern).not.toBeNull();
  });

  it('penaliza tonos dispersos frente a un set análogo', () => {
    const analogous = evaluateChromaticHarmony(
      roleMap({
        P: '#ff0066',
        S: '#ff3355',
        A: '#ff6644',
        A2: '#ff8844',
      })
    );
    const scattered = evaluateChromaticHarmony(
      roleMap({
        P: '#ff0000',
        S: '#00ff80',
        A: '#0055ff',
        A2: '#ffcc00',
      })
    );
    expect(analogous.score).toBeGreaterThanOrEqual(scattered.score);
  });

  it('cuatro tonos separados 30° obtienen análogo al 100 %', () => {
    const h = (deg: number) => hslToHex(deg, 88, 52);
    const analysis = evaluateChromaticHarmony(
      roleMap({
        P: h(227),
        S: h(257),
        A: h(287),
        A2: h(317),
      })
    );
    const analogous = analysis.patternScores.find((p) => p.id === 'analogous');
    expect(analogous?.score).toBe(100);
  });
});
