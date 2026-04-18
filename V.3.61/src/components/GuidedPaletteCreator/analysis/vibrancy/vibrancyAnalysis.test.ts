import { describe, expect, it } from 'vitest';
import { computeAutoAdjustedVibrancyHexes } from './autoAdjustVibrancyHarmony';
import { colorfulnessMetric, evaluateVibrancy } from './vibrancyAnalysis';

describe('colorfulnessMetric', () => {
  it('da M mayor con colores más dispersos en rg/yb', () => {
    const low = colorfulnessMetric(['#808080', '#828282', '#848484']);
    const high = colorfulnessMetric(['#ec4899', '#a78bfa', '#fbbf24', '#475569', '#f1f5f9']);
    expect(high).toBeGreaterThan(low);
  });
});

describe('accentFocus (A/A2 vs P/S)', () => {
  it('sube la alineación cuando A/A2 superan a P y S en croma y no hay vibrantes fuera de acento', () => {
    const good = evaluateVibrancy({
      P: { hex: '#334155', label: 'P' },
      S: { hex: '#475569', label: 'S' },
      A: { hex: '#ec4899', label: 'A' },
      A2: { hex: '#fbbf24', label: 'A2' },
      F: { hex: '#f8fafc', label: 'F' },
    });
    const bad = evaluateVibrancy({
      P: { hex: '#dc2626', label: 'P' },
      S: { hex: '#2563eb', label: 'S' },
      A: { hex: '#94a3b8', label: 'A' },
      A2: { hex: '#cbd5e1', label: 'A2' },
      F: { hex: '#f8fafc', label: 'F' },
    });
    expect(good.accentFocus.alignmentScore).toBeGreaterThan(bad.accentFocus.alignmentScore);
    expect(good.accentFocus.vibrantOffFocusRoles.length).toBe(0);
    expect(good.accentFocus.accentsDominateBothBases).toBe(true);
    expect(bad.accentFocus.vibrantOffFocusRoles).toContain('P');
    expect(bad.accentFocus.accentsDominateBothBases).toBe(false);
  });

  it('no permite nota excelente si algún acento no supera a P y a S en croma', () => {
    const capped = evaluateVibrancy({
      P: { hex: '#475569', label: 'P' },
      S: { hex: '#64748b', label: 'S' },
      A: { hex: '#ec4899', label: 'A' },
      A2: { hex: '#cbd5e1', label: 'A2' },
      F: { hex: '#f1f5f9', label: 'F' },
    });
    expect(capped.accentFocus.accentsDominateBothBases).toBe(false);
    expect(capped.score).toBeLessThanOrEqual(89);
    if (capped.scoreBeforeAccentCap >= 89) {
      expect(capped.score).toBe(89);
    }
  });

  it('si un acento no supera ni P ni S (fallo crítico), la nota queda capada en 69', () => {
    const critical = evaluateVibrancy({
      P: { hex: '#ec4899', label: 'P' },
      S: { hex: '#fbbf24', label: 'S' },
      A: { hex: '#94a3b8', label: 'A' },
      A2: { hex: '#cbd5e1', label: 'A2' },
      F: { hex: '#f8fafc', label: 'F' },
    });
    expect(critical.accentFocus.accentVersusBases.some((row) => !row.beatsP && !row.beatsS)).toBe(true);
    expect(critical.score).toBeLessThanOrEqual(69);
  });
});

describe('evaluateVibrancy', () => {
  it('distribución de clases suma 100% sobre cinco roles', () => {
    const r = evaluateVibrancy({
      P: { hex: '#ec4899', label: 'P' },
      S: { hex: '#a78bfa', label: 'S' },
      A: { hex: '#fbbf24', label: 'A' },
      A2: { hex: '#475569', label: 'A2' },
      F: { hex: '#f1f5f9', label: 'F' },
    });
    expect(r.swatches.length).toBe(5);
    expect(r.mutedPct + r.mediumPct + r.vibrantPct).toBeCloseTo(100, 1);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });
});

describe('computeAutoAdjustedVibrancyHexes', () => {
  function applyUpdates(
    map: Record<string, { hex: string; label: string }>,
    updates: Record<string, string>
  ): Record<string, { hex: string; label: string }> {
    return {
      P: { ...map.P, hex: updates.P ?? map.P.hex },
      S: { ...map.S, hex: updates.S ?? map.S.hex },
      A: { ...map.A, hex: updates.A ?? map.A.hex },
      A2: { ...map.A2, hex: updates.A2 ?? map.A2.hex },
      F: { ...map.F, hex: updates.F ?? map.F.hex },
    };
  }

  it('no empeora la puntuación en el mapa de referencia', () => {
    const map = {
      P: { hex: '#ec4899', label: 'P' },
      S: { hex: '#a78bfa', label: 'S' },
      A: { hex: '#fbbf24', label: 'A' },
      A2: { hex: '#475569', label: 'A2' },
      F: { hex: '#f1f5f9', label: 'F' },
    };
    const before = evaluateVibrancy(map).score;
    const updates = computeAutoAdjustedVibrancyHexes(map);
    const after = evaluateVibrancy(applyUpdates(map, updates)).score;
    expect(after).toBeGreaterThanOrEqual(before);
    expect(Object.keys(updates).every((k) => ['P', 'S', 'A', 'A2', 'F'].includes(k))).toBe(true);
  });

  it('mejora nota o foco A/A2 cuando A2 queda por debajo de P y S en croma', () => {
    const map = {
      P: { hex: '#475569', label: 'P' },
      S: { hex: '#64748b', label: 'S' },
      A: { hex: '#ec4899', label: 'A' },
      A2: { hex: '#cbd5e1', label: 'A2' },
      F: { hex: '#f8fafc', label: 'F' },
    };
    const beforeEv = evaluateVibrancy(map);
    const updates = computeAutoAdjustedVibrancyHexes(map);
    const afterEv = evaluateVibrancy(applyUpdates(map, updates));
    expect(afterEv.score).toBeGreaterThanOrEqual(beforeEv.score);
    const improvedFocus =
      afterEv.score > beforeEv.score ||
      afterEv.accentFocus.alignmentScore > beforeEv.accentFocus.alignmentScore ||
      (afterEv.accentFocus.accentsDominateBothBases && !beforeEv.accentFocus.accentsDominateBothBases);
    expect(improvedFocus).toBe(true);
  });
});
