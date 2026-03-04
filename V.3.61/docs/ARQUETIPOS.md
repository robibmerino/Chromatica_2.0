# Explora Arquetipos — Guía para IA

Documento de referencia para entender y modificar la sección Explora Arquetipos (Quién, Qué, Cómo).

---

## 1. Flujo general

1. **Vista principal**: Tres tarjetas (Quién, Qué, Cómo). Cada una tiene paleta individual y paleta general combinada.
2. **Al pulsar una tarjeta**: Se abre el flujo Tinder (fase 1) — deslizar tarjetas para Match/SuperMatch.
3. **Tras hacer match**: Botón "Ver mis Match" → fase 2 (ajustes).
4. **Fase 2**: Tres columnas — Match/SuperMatch (izq), vista previa + paleta (centro), ejes arquetipo (der).
5. **Usar paleta**: Configurar al menos un eje para activar la paleta; "Usar paleta" guarda en la columna.

---

## 2. Intercambio Quién↔Qué (crítico)

| Botón UI | contentColumnKey | Contenido real |
|----------|------------------|----------------|
| **Quién** | `que` | Siluetas (herramientas) |
| **Qué** | `quien` | Criaturas (esencia) |
| **Cómo** | `como` | Estilos |

- `getContentColumnKey(buttonKey)` realiza el intercambio.
- Para ejes: `columnKey 'que'` = Herramientas (axis-2-herramientas), `columnKey 'quien'` = Esencia (axis-2), `columnKey 'como'` = Inspiración (axis-2-inspiracion).

---

## 3. Órdenes de ejes por columna

| contentColumnKey | Orden (getFallbackAxisOrder) |
|------------------|------------------------------|
| `quien` | axis-3 (criaturas), background, axis-2 (Esencia), axis-4 |
| `que` | axis-3-silhouette, background, axis-2-herramientas, axis-4 |
| `como` | axis-3-estilo, background, axis-2-inspiracion, axis-4 |

Usar siempre `getFallbackAxisOrder(columnKey)` en lugar de ternarios repetidos.

---

## 4. Archivos clave

| Archivo | Responsabilidad |
|---------|-----------------|
| `ArchetypesCreator.tsx` | Estado global, ColumnTinderPhase, paleta combinada |
| `archetypeAxesConfig.ts` | Config ejes, getFallbackAxisOrder, getEffective*Id |
| `archetypePaletteUtils.ts` | blendColorsVibrant, combineColumnPalettes, modos |
| `ArchetypeAxesColumn.tsx` | Sliders, reordenación, CustomAxisModal |
| `ColumnSummaryModal.tsx` | Resumen antes de editar |
| `TinderCardPreview.tsx` | Render de tarjeta con componentes (fondo, criatura/silueta/estilo) |

---

## 5. Tipos importantes

- `ColumnFlowState`: phase, matchedCards, axesByCard, axisOrderByCard, deckResetKey, phase2StateBeforeReset.
- `ArchetypeAxisState`: axisId, selectedOptionIndex, sliderValue, colorLeft/Right, hasBeenConfigured.
- `CombineMode`: 'balanced' | 'quien-first' | 'que-first' | 'como-first'.

---

## 6. Dónde tocar para…

- **Añadir nuevo eje**: `archetypeAxesConfig.ts` → ARCHETYPE_AXES_CONFIG, DEFAULT_AXIS_ORDER_*.
- **Cambiar lógica de mezcla de paletas**: `archetypePaletteUtils.ts`.
- **Modificar flujo Tinder/fase 2**: `ArchetypesCreator.tsx` → ColumnTinderPhase.
- **Añadir criatura/silueta/estilo**: `QuienTinderCards/`, `QuienSilhouettes/`, `ComoEstilos/` + registry correspondiente.
