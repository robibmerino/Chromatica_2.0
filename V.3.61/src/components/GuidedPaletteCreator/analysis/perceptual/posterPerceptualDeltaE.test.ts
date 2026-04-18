import { describe, expect, it } from 'vitest';
import { evaluatePosterPerceptualDeltaE, posterTripleSatisfied } from './posterPerceptualDeltaE';

const fakeMap = (hexes: Record<string, string>) =>
  Object.fromEntries(Object.entries(hexes).map(([k, hex]) => [k, { hex, label: k }]));

describe('posterTripleSatisfied', () => {
  it('pass equivale a las tres banderas en evaluatePosterPerceptualDeltaE', () => {
    const m = evaluatePosterPerceptualDeltaE(
      fakeMap({ P: '#f3f4f6', S: '#94a3b8', A: '#f97316', A2: '#c4b5fd', F: '#000', T: '#333', Ts: '#666', Sf: '#eee' })
    );
    for (const r of m.filter((x) => !x.informativeOnly)) {
      const fg = r.row.fgRole;
      const bg = r.row.bgRole;
      const rowMap = fakeMap({
        P: '#f3f4f6',
        S: '#94a3b8',
        A: '#f97316',
        A2: '#c4b5fd',
        F: '#000',
        T: '#333',
        Ts: '#666',
        Sf: '#eee',
      });
      const fHex = rowMap[fg]?.hex;
      const bHex = rowMap[bg]?.hex;
      if (fHex && bHex) {
        expect(r.pass).toBe(posterTripleSatisfied(fHex, bHex));
      }
    }
  });
});

describe('evaluatePosterPerceptualDeltaE', () => {
  it('marca fallo si falta luminancia o L* aunque ΔE sea alto', () => {
    const map = fakeMap({
      P: '#d4d4d8',
      S: '#d1cfd0',
      A: '#d6d2cf',
      A2: '#cfc9c4',
      F: '#111',
      T: '#222',
      Ts: '#444',
      Sf: '#f5f5f5',
    });
    const rows = evaluatePosterPerceptualDeltaE(map);
    expect(rows.some((r) => !r.pass && !r.informativeOnly)).toBe(true);
  });
});
