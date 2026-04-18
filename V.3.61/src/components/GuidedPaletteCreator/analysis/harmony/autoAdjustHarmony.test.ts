import { describe, expect, it } from 'vitest';
import { computeAutoAdjustedHarmonyHexes } from './autoAdjustHarmony';
import { evaluateChromaticHarmony } from './harmonyAnalysis';

const roleMap = (hexes: Record<string, string>) =>
  Object.fromEntries(Object.entries(hexes).map(([role, hex]) => [role, { hex, label: role }])) as Record<
    string,
    { hex: string; label: string }
  >;

describe('computeAutoAdjustedHarmonyHexes', () => {
  it('no empeora la puntuación de armonía', () => {
    const map = roleMap({
      P: '#ff0000',
      S: '#00ff80',
      A: '#0055ff',
      A2: '#ffcc00',
    });
    const before = evaluateChromaticHarmony(map).score;
    const updates = computeAutoAdjustedHarmonyHexes(map);
    const afterMap = { ...map };
    for (const [role, hex] of Object.entries(updates)) {
      afterMap[role] = { hex, label: role };
    }
    const after = evaluateChromaticHarmony(afterMap).score;
    expect(after).toBeGreaterThanOrEqual(before);
  });

  it('propone cambios en un caso claramente desordenado', () => {
    const map = roleMap({
      P: '#ff0000',
      S: '#00ff80',
      A: '#0055ff',
      A2: '#ffcc00',
    });
    const updates = computeAutoAdjustedHarmonyHexes(map);
    expect(Object.keys(updates).length).toBeGreaterThan(0);
  });
});
