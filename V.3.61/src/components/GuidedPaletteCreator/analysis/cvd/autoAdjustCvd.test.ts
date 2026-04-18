import { describe, expect, it } from 'vitest';
import { evaluateCvdGlobalScore } from './cvdAnalysis';
import { computeAutoAdjustedCvdHexes } from './autoAdjustCvd';

const roleMap = (hexes: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(hexes).map(([role, hex]) => [role, { hex, label: role }])
  ) as Record<string, { hex: string; label: string }>;

describe('computeAutoAdjustedCvdHexes', () => {
  it('sube la nota CVD global cuando todos los roles comparten el mismo hex', () => {
    const map = roleMap({
      P: '#ff0000',
      S: '#ff0000',
      A: '#ff0000',
      A2: '#ff0000',
      F: '#ff0000',
    });
    const before = evaluateCvdGlobalScore(map);
    const updates = computeAutoAdjustedCvdHexes(map);
    expect(Object.keys(updates).length).toBeGreaterThan(0);

    const afterMap = { ...map };
    for (const [role, hex] of Object.entries(updates)) {
      afterMap[role] = { hex, label: role };
    }
    const after = evaluateCvdGlobalScore(afterMap);
    expect(after).toBeGreaterThan(before);
  });

  it('no empeora la nota global respecto al estado inicial', () => {
    const map = roleMap({
      P: '#22c55e',
      S: '#16a34a',
      A: '#15803d',
      A2: '#4ade80',
      F: '#f0fdf4',
    });
    const before = evaluateCvdGlobalScore(map);
    const updates = computeAutoAdjustedCvdHexes(map);
    const afterMap = { ...map };
    for (const [role, hex] of Object.entries(updates)) {
      afterMap[role] = { hex, label: role };
    }
    const after = evaluateCvdGlobalScore(afterMap);
    expect(after).toBeGreaterThanOrEqual(before);
  });
});