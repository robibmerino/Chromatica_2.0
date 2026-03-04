import type { ComponentType } from 'react';
import type { QuienCharacterId, QuienCharacterProps } from './types';
import { Threnn, Vacio, Raices, Crepusculo, Voltaje, Espejo, Orbitas, Ondas, Cuerdas, Pangea, ADN, Voronoi, Eco, Tormenta, Mandala, Infinito, Relampago, Eclipse, Rosa, Vortice, Aurea, Fractal, Ciclos, Burbujas, Escarcha, Prisma, Cristales, Rueda, Complejidad, Topografia } from './characters';

type CharacterComponent = ComponentType<QuienCharacterProps>;

/**
 * Registro de personajes. Las criaturas se irán sustituyendo por nuevas.
 * Para añadir una: crear characters/NombreCriatura.tsx y registrarla aquí.
 */
const REGISTRY: Partial<Record<QuienCharacterId, CharacterComponent>> = {
  1: Threnn,
  2: Vacio,
  3: Raices,
  4: Crepusculo,
  5: Voltaje,
  6: Espejo,
  7: Orbitas,
  8: Ondas,
  9: Cuerdas,
  10: Pangea,
  11: ADN,
  12: Voronoi,
  13: Eco,
  14: Tormenta,
  15: Mandala,
  16: Infinito,
  17: Relampago,
  18: Eclipse,
  19: Rosa,
  20: Vortice,
  21: Aurea,
  22: Fractal,
  23: Ciclos,
  24: Burbujas,
  25: Escarcha,
  26: Prisma,
  27: Cristales,
  28: Rueda,
  29: Complejidad,
  30: Topografia,
};

export function getCharacterComponent(id: QuienCharacterId): CharacterComponent | null {
  return REGISTRY[id] ?? null;
}

/** IDs de personajes (1-30). */
export const QUIEN_CHARACTER_IDS: readonly QuienCharacterId[] = (
  Array.from({ length: 30 }, (_, i) => i + 1) as QuienCharacterId[]
);
