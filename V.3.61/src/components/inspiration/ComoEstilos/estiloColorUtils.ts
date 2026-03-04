/**
 * Utilidades de color para estilos Cómo.
 * Reexporta darkenHex/lightenHex de colorUtils con nombres cortos.
 */
import { darkenHex, lightenHex } from '../../../utils/colorUtils';

/** Oscurece un color hex restando amount a cada canal RGB. */
export const darken = darkenHex;

/** Aclara un color hex sumando amount a cada canal RGB. */
export const lighten = lightenHex;
