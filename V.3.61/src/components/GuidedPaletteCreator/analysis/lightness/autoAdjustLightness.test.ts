import { describe, expect, it } from 'vitest';
import { evaluateLightnessBalance } from './lightnessBalanceAnalysis';
import { computeAutoAdjustedLightnessHexes } from './autoAdjustLightness';

const roleMap = (hexes: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(hexes).map(([role, hex]) => [role, { hex, label: role }])
  ) as Record<string, { hex: string; label: string }>;

describe('computeAutoAdjustedLightnessHexes', () => {
  it('amplía el rango L* cuando los roles principales están muy agrupados', () => {
    const map = roleMap({
      P: '#6b7280',
      S: '#64748b',
      A: '#71717a',
      A2: '#78716c',
      F: '#52525b',
    });
    const before = evaluateLightnessBalance(map).score;
    const updates = computeAutoAdjustedLightnessHexes(map);
    expect(Object.keys(updates).length).toBeGreaterThan(0);

    const afterMap = { ...map };
    for (const [role, hex] of Object.entries(updates)) {
      afterMap[role] = { hex, label: role };
    }
    const after = evaluateLightnessBalance(afterMap).score;
    expect(after).toBeGreaterThanOrEqual(before);
  });

  it('no devuelve cambios si solo hay un rol', () => {
    const map = roleMap({ P: '#3b82f6' });
    expect(computeAutoAdjustedLightnessHexes(map)).toEqual({});
  });
});
