# Convenciones UI — Fase Análisis

Este documento define cómo añadir o modificar subanálisis en `GuidedPaletteCreator/analysis` manteniendo coherencia visual, técnica y de copy.

## Objetivo

Cada subanálisis debe compartir:

- La misma jerarquía visual (header, score card, bloques de contenido).
- El mismo patrón de navegación izquierda y aside derecho.
- Criterios de puntuación transparentes y verificables.
- Diagnósticos y consejos con formato homogéneo.

## Componentes base reutilizables

Usar estos componentes antes de crear variantes ad hoc:

- `AnalysisMainHeader`
  - Encabezado de columna central: icono + título + badge + botón opcional `Auto-ajustar`.
- `AnalysisScoreCard`
  - Tarjeta principal de puntuación: título, valor, descripción, detalle y bloque extra opcional.
- `AnalysisSectionBlock`
  - Estructura estándar de sección: título + contenido.
- `AnalysisDiagnosticList`
  - Lista de diagnósticos con estados `good | warning | bad`.
- `AnalysisQuickTipCard`
  - Bloque de consejo rápido (estilo verde compartido).

Regla: si un bloque encaja con un componente base, no duplicar markup.

## Estructura recomendada de columna central

Orden sugerido para cada subanálisis:

1. `AnalysisMainHeader`
2. `AnalysisScoreCard`
3. Selector/visual principal del subanálisis (si aplica)
4. Bloques técnicos en `AnalysisSectionBlock`
5. Diagnóstico (`AnalysisDiagnosticList`)
6. Consejo (`AnalysisQuickTipCard`)

## Puntuación y semántica de score

- La tarjeta de score debe incluir siempre:
  - `title` (qué se mide),
  - `score` (0–100 o `—`),
  - `description` (calidad: excelente/buena/etc.),
  - `detail` (cómo se calcula).
- Evitar notas infladas:
  - Si existe un modo “crítico” (p. ej. conflicto severo), aplicar penalización explícita o techo.
  - Preferir agregaciones robustas (p. ej. peor caso por par) cuando proceda.

## Columna izquierda (accesibilidad global)

Cuando se añada un nuevo subanálisis:

- Añadir entrada en `AnalysisContrastLeftAside`.
- Añadir `AnalysisAspectId` y `AnalysisTypeId` correspondientes.
- Conectar en `AnalysisPhase`:
  - mapeo `analysisType ↔ analysisAspect`,
  - score y tono lateral,
  - inclusión en `headlineScore`.

## Aside derecho

Mantener orden de paneles:

1. ¿Qué es…?
2. ¿Por qué importa?
3. Consejo rápido
4. Referencias

Para variantes de información adicional (p. ej. tipos CVD), integrarlas sin romper ese orden base.

## Copy y tono

- Idioma: español.
- Explicar el cálculo con una frase corta y verificable.
- Evitar afirmaciones ambiguas del tipo “mágico” sin explicar umbral o criterio.
- Usar terminología consistente entre:
  - tarjeta de score,
  - aside (¿Qué es…?),
  - tests.

## Pruebas mínimas por subanálisis

Crear/actualizar tests en `analysis/<subanalysis>/<...>.test.ts`:

- Rango y estabilidad de score (0–100).
- Caso “bueno” vs “malo” esperado.
- Reglas de cap/penalización si existen.
- Caso borde (sin swatches o inputs degenerados).

Comando recomendado:

- `npm run test -- --run src/components/GuidedPaletteCreator/analysis`

## Checklist de integración (rápido)

- [ ] `AnalysisTypeId` / `AnalysisAspectId` añadidos.
- [ ] Entrada lateral en `AnalysisContrastLeftAside`.
- [ ] Main column conectada en `AnalysisPhase`.
- [ ] Right aside conectado en `AnalysisPhase`.
- [ ] Score integrado en `headlineScore`.
- [ ] Header y score card usan componentes base.
- [ ] Diagnóstico y tip usan componentes base (si aplica).
- [ ] Referencias y copy revisados.
- [ ] Tests del subanálisis en verde.

