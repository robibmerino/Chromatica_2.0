import { describe, expect, it } from 'vitest';
import { computeAutoAdjustedTemperatureHexes } from './autoAdjustTemperatureHarmony';
import {
  classifyTemperature,
  evaluateTemperatureHarmony,
  warmCoolFromHex,
} from './temperatureHarmonyAnalysis';

describe('warmCoolFromHex', () => {
  it('clasifica naranja intenso como cálido', () => {
    const wc = warmCoolFromHex('#f97316');
    expect(classifyTemperature(wc)).toBe('warm');
  });
});

describe('evaluateTemperatureHarmony', () => {
  it('devuelve puntuación y distribución para mapa mínimo', () => {
    const r = evaluateTemperatureHarmony({
      P: { hex: '#f97316', label: 'P' },
      S: { hex: '#fbbf24', label: 'S' },
      A: { hex: '#ec4899', label: 'A' },
      A2: { hex: '#6366f1', label: 'A2' },
      F: { hex: '#fef3c7', label: 'F' },
    });
    expect(r.swatches.length).toBe(5);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
    expect(r.warmPct + r.coolPct + r.neutralPct).toBeCloseTo(100, 1);
  });
});

describe('computeAutoAdjustedTemperatureHexes', () => {
  it('no empeora la puntuación en el mapa de referencia', () => {
    const map = {
      P: { hex: '#f97316', label: 'P' },
      S: { hex: '#fbbf24', label: 'S' },
      A: { hex: '#ec4899', label: 'A' },
      A2: { hex: '#6366f1', label: 'A2' },
      F: { hex: '#fef3c7', label: 'F' },
    };
    const before = evaluateTemperatureHarmony(map).score;
    const updates = computeAutoAdjustedTemperatureHexes(map);
    const afterMap = {
      P: { ...map.P, hex: updates.P ?? map.P.hex },
      S: { ...map.S, hex: updates.S ?? map.S.hex },
      A: { ...map.A, hex: updates.A ?? map.A.hex },
      A2: { ...map.A2, hex: updates.A2 ?? map.A2.hex },
      F: { ...map.F, hex: updates.F ?? map.F.hex },
    };
    const after = evaluateTemperatureHarmony(afterMap).score;
    expect(after).toBeGreaterThanOrEqual(before);
    expect(Object.keys(updates).every((k) => ['P', 'S', 'A', 'A2', 'F'].includes(k))).toBe(true);
  });
});
