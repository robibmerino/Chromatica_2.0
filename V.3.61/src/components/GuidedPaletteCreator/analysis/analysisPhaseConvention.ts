/**
 * Convenciones de UI de la fase Análisis (columna central, aside derecho).
 *
 * Columna central
 * - Encabezado: una fila `flex items-center justify-between` (icono + título + badge
 *   a la izquierda; botón de acción a la derecha). Sin párrafo introductorio bajo esa fila
 *   (la puntuación contextual va en la columna izquierda).
 * - Acción principal de ajuste automático: mismo rótulo en todos los tipos de análisis.
 *
 * Columna izquierda
 * - Puntuación global = promedio de los subanálisis (WCAG texto + póster + temperatura + vibración + CVD); botones para alternar vista.
 *
 * Aside derecho (debajo de «Tu paleta»)
 * - Orden recomendado para nuevos análisis:
 *   1) Primera pregunta «¿Qué es …?» (título distinto por tipo de análisis).
 *   2) «¿Por qué importa?»
 *   3) «Consejo rápido»
 *   4) «Referencias»
 */

export const ANALYSIS_CENTRAL_HEADER = {
  titleTextContrast: 'Contraste WCAG',
  titlePosterTriAnalysis: 'Póster: ΔE₀₀ + luminancia + L*',
  titleTemperatureHarmony: 'Armonía de temperatura',
  titleVibrancyHarmony: 'Saturación y vibración',
  titleCvdSimulation: 'Simulación de daltonismo (CVD)',
  primaryActionAutoAdjust: 'Auto-ajustar',
} as const;

/** Títulos de bloques dentro de la columna central (debajo del encabezado). */
export const ANALYSIS_CENTRAL_SECTION = {
  textEvaluatedCombos: 'Combinaciones evaluadas',
  textRatioExplorer: 'Explorador de ratios',
  perceptualPosterPairsTitle: 'Pares del mockup',
  perceptualPosterPairsSubtitle:
    'Cuatro pares evaluados: cada uno debe cumplir a la vez ΔE₀₀ ≥ 5, ratio Y (W3C/sRGB) ≥ 2 y |ΔL*| ≥ 6',
  perceptualPosterInformativeHint:
    'Las filas de referencia muestran las mismas métricas pero no entran en la puntuación ni en el auto-ajuste.',
  posterEvaluatedPairsTitle: 'Evaluación (cuenta en la nota)',
  posterInformativePairsTitle: 'Solo referencia (no computa)',
  posterDimensionSummaryCaption: 'Resumen por dimensión solo sobre pares evaluados (global = promedio de las tres)',
} as const;

/** Columna izquierda: leyendas compartidas con el resto de la fase cuando aplica. */
export const ANALYSIS_LEFT_ASIDE = {
  globalScoreCaption: 'Puntuación global',
  /** Subtítulo bajo la nota grande: promedio de contraste texto + modo póster. */
  globalScoreCombinedHint:
    'Promedio: WCAG texto + póster (ΔE+Y+L*) + temperatura + vibración + simulación CVD',
  navButtonTemperatureMode: 'Temperatura cálido / frío',
  navButtonTemperatureHint: 'Ou et al. · balance térmico',
  navButtonVibrancyMode: 'Saturación y vibración',
  navButtonVibrancyHint: 'LCh croma + colorfulness (Hasler & Süsstrunk)',
  navButtonCvdMode: 'Daltonismo (CVD)',
  navButtonCvdHint: 'Viénot–Brettel–Mollon (1999) · ΔE en simulado',
  accessibilityHeading: 'Accesibilidad',
  /** Misma etiqueta corta en modo interfaz (navegación, chip de puntuación, `analysisType` científico). */
  shortLabelPerceptualMode: 'Póster · ΔE+Y+L*',
  navButtonTextMode: 'Contraste WCAG (texto)',
  navButtonPerceptualHint: 'CIE ΔE₀₀ + luminancia W3C + L* CIELAB',
} as const;

/** Etiquetas legibles del estado global `analysisType` (p. ej. pestañas o persistencia). */
export const ANALYSIS_GLOBAL_MODE_LABEL = {
  basicMode: 'Contraste texto (WCAG)',
  temperatureMode: 'Temperatura (warm / cool)',
  vibrancyMode: 'Vibración / saturación',
  cvdMode: 'Simulación CVD',
} as const;

export const ANALYSIS_RIGHT_ASIDE = {
  /** Bloque de desplegables (nombre, prevalencia, descripción) por tipo CVD simulado. */
  cvdTypeInfoSectionCaption: 'Información por tipo de visión',
  firstPanelTitle: {
    textContrastRatio: '¿Qué es el ratio de contraste?',
    posterTriAnalysis: '¿Qué mide el análisis del póster?',
    temperatureHarmony: '¿Qué mide la temperatura de color?',
    vibrancyHarmony: '¿Qué mide la saturación y vibración?',
    cvdSimulation: '¿Qué es la simulación de daltonismo aquí?',
  },
  whyItMatters: '¿Por qué importa?',
  quickTip: 'Consejo rápido',
  references: 'Referencias',
} as const;
