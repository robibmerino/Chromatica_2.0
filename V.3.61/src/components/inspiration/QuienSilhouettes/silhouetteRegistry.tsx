import type { ComponentType } from 'react';
import type { QuienSilhouetteId, QuienSilhouetteProps } from './types';
import { Contemplativo, Ancla, Archivista, Cartografo, Conductor, Duelista, Bailarin, Eco, Peregrino, Velado, Herald, Sentinel, Wanderer, Weaver, Witness, Twin, Vessel, Sculptor, Dreamer } from './silhouettes';

type SilhouetteComponent = ComponentType<QuienSilhouetteProps>;

/**
 * Registro de siluetas. Para añadir una: crear silhouettes/Nombre.tsx y registrarla aquí.
 */
const REGISTRY: Partial<Record<QuienSilhouetteId, SilhouetteComponent>> = {
  1: Contemplativo,
  2: Ancla,
  3: Archivista,
  4: Cartografo,
  5: Conductor,
  6: Duelista,
  7: Bailarin,
  8: Eco,
  9: Peregrino,
  10: Velado,
  11: Herald,
  12: Sentinel,
  13: Wanderer,
  14: Weaver,
  15: Witness,
  16: Twin,
  17: Vessel,
  18: Sculptor,
  19: Dreamer,
};

export function getSilhouetteComponent(id: QuienSilhouetteId): SilhouetteComponent | null {
  return REGISTRY[id] ?? null;
}
