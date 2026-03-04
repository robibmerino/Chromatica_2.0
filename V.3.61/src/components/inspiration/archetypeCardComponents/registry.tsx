import type React from 'react';
import type { CardComponentProps, CardComponentVariant } from './types';
import { BACKGROUND_VARIANTS } from './backgrounds';
import { FAMILIAR_COMPONENT_ID } from './familiares/constants';
import { FAMILIAR_VARIANTS } from './familiares';
import { HERRAMIENTAS_COMPONENT_ID } from './herramientas/constants';
import { HERRAMIENTAS_VARIANTS } from './herramientas';
import { CREATURE_COMPONENT_ID } from './creatures/constants';
import { CREATURE_VARIANTS } from './creatures';
import { SILHOUETTE_COMPONENT_ID } from './silhouettes/constants';
import { SILHOUETTE_VARIANTS } from './silhouettes';
import { ESTILO_COMPONENT_ID } from './estilos/constants';
import { ESTILO_VARIANTS } from './estilos';
import { ATMOSPHERE_COMPONENT_ID, ATMOSPHERE_VARIANTS } from './atmospheres';
import { INSPIRACION_COMPONENT_ID } from './inspiracion/constants';
import { INSPIRACION_VARIANTS } from './inspiracion';

type ComponentId =
  | 'background'
  | typeof FAMILIAR_COMPONENT_ID
  | typeof HERRAMIENTAS_COMPONENT_ID
  | typeof CREATURE_COMPONENT_ID
  | typeof SILHOUETTE_COMPONENT_ID
  | typeof ESTILO_COMPONENT_ID
  | typeof ATMOSPHERE_COMPONENT_ID
  | typeof INSPIRACION_COMPONENT_ID
  | string;

/** Mapa componentId -> mapa versionId -> componente */
const REGISTRY: Partial<Record<ComponentId, Record<string, CardComponentVariant>>> = {
  background: BACKGROUND_VARIANTS,
  [FAMILIAR_COMPONENT_ID]: FAMILIAR_VARIANTS,
  [HERRAMIENTAS_COMPONENT_ID]: HERRAMIENTAS_VARIANTS,
  [CREATURE_COMPONENT_ID]: CREATURE_VARIANTS,
  [SILHOUETTE_COMPONENT_ID]: SILHOUETTE_VARIANTS,
  [ESTILO_COMPONENT_ID]: ESTILO_VARIANTS,
  [ATMOSPHERE_COMPONENT_ID]: ATMOSPHERE_VARIANTS,
  [INSPIRACION_COMPONENT_ID]: INSPIRACION_VARIANTS,
};

/**
 * Obtiene el componente para una variante. Si no existe, devuelve null.
 * Uso: renderCardComponent('background', 'default', { versionId: 'default' })
 */
export function getCardComponent(
  componentId: ComponentId,
  versionId: string
): React.FC<CardComponentProps> | null {
  const variants = REGISTRY[componentId];
  if (!variants) return null;
  return variants[versionId] ?? variants['default'] ?? null;
}

/**
 * Registra una nueva variante para un componente.
 * Útil para añadir fondos u otros componentes dinámicamente.
 */
export function registerCardComponent(
  componentId: ComponentId,
  versionId: string,
  component: CardComponentVariant
): void {
  if (!REGISTRY[componentId]) {
    REGISTRY[componentId] = {};
  }
  REGISTRY[componentId]![versionId] = component;
}
