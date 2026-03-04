/**
 * Utilidad para generar atributos transform de personajes.
 * Unifica el patrón scale centrado + translate vertical en un solo helper.
 */

const DEFAULT_CX = 100;
const DEFAULT_CY = 160;

export interface CharacterTransformOpts {
  /** Escala (1 = sin cambio) */
  scale?: number;
  /** Desplazamiento vertical en px (negativo = subir) */
  translateY?: number;
  /** Centro X para scale (default 100) */
  centerX?: number;
  /** Centro Y para scale (default 160) */
  centerY?: number;
}

/**
 * Genera el atributo transform para un personaje.
 * Si scale=1 y translateY=0, devuelve null (no hace falta wrapper).
 */
export function getCharacterTransform(opts: CharacterTransformOpts = {}): string | null {
  const {
    scale = 1,
    translateY = 0,
    centerX = DEFAULT_CX,
    centerY = DEFAULT_CY,
  } = opts;

  if (scale === 1 && translateY === 0) return null;

  const parts: string[] = [];

  if (scale !== 1) {
    parts.push(
      `translate(${centerX}, ${centerY}) scale(${scale}) translate(-${centerX}, -${centerY})`
    );
  }
  if (translateY !== 0) {
    parts.push(`translate(0, ${translateY})`);
  }

  return parts.join(' ');
}
