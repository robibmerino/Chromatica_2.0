# Workflow: Banner Guardar, Adelante/Atrás y Candado

Objetivo: unificar la parte derecha del banner en Refinar, Aplicar y Análisis con: **Guardar paleta** | **Adelante/Atrás** | **Candado** | **Avanzar**, y que el historial sea por **acciones** (no por estados) con reglas de candado por sección.

---

## TODO general — 6 bloques de trabajo

| # | Bloque | Estado | Descripción breve |
|---|--------|--------|-------------------|
| **1** | UI del banner | ✅ Hecho | Orden Guardar \| Adelante/Atrás \| Candado \| Avanzar; botón ⋯ que expande; icono guardar (Save); estilo naranja en guardar. |
| **2** | Guardar paleta | ✅ Hecho | Sin sesión → auth; con sesión → modal (nombre, sección, versión); etiquetas en Mis paletas. |
| **3** | Candado (estado) | ✅ Hecho | Candado persistido en FlowPaletteState; al cambiar de fase o volver al menú y reentrar se conserva. |
| **4** | Historial por acciones | ✅ Hecho (base) | Historial = lista de acciones con sectionId; tipo snapshot (prev/next); apply/invert; undo/redo por acción; persistido en flujo. |
| **5** | Historial multi-sección + candado | ✅ Hecho | getPreviousNavigableIndex/getNextNavigableIndex según candado; en anclada solo acciones de esa sección; desde no anclada se saltan acciones de secciones ancladas; canUndo/canRedo. |
| **6** | Ajustes y edge cases | 🔲 Pendiente | Restaurar, notificaciones, nombres, etc. |

**Contexto recordatorio**: Adelante/atrás debe revertir *acciones* sobre la paleta (ej. “bajar saturación del color 1”, “intercambiar posiciones 1 y 2”), no snapshots de la paleta. Con candado: las acciones de esa sección no se deshacen desde otras, y dentro de una sección anclada solo se deshacen acciones de esa sección.

---

## Grupos de trabajo (detalle)

### Grupo 1 – UI del banner (sin lógica nueva) ✅
- **SectionBanner**: Botón "Guardar paleta" con **icono Save** (disquete, reconocible), botón candado, orden: Guardar | Undo/Redo | Candado | Avanzar.
- Por defecto mostrar **solo un botón** (⋯ "Más opciones") junto a Avanzar; al clic expande y muestra Guardar, Adelante/Atrás, Candado.
- **RefinementPhase**, **ApplicationPhase**, **AnalysisPhase**: Pasar las nuevas props (onSavePalette, lockPinned, onLockToggle). En Análisis añadir undo/redo (ya existen en el hook; solo falta pasarlos al banner).
- **Verificación**: En Refinar, Aplicar y Análisis se ve el botón ⋯; al expandir aparecen Guardar paleta, Deshacer, Rehacer, Candado y Avanzar.

### Grupo 2 – Guardar paleta ✅
- Sin sesión → al pulsar Guardar se abre auth. Con sesión → modal con nombre (sugerido + editable), sección y versión; mensaje "La paleta guardada podrá verse en tu perfil"; etiquetas en Mis paletas (Refinar/Aplicar/Análisis + V2, V3…).
- **Verificación**: Sin sesión → abre login/registro; con sesión → guarda y se ven etiquetas en el perfil.

### Grupo 3 – Candado (estado por sección) ✅
- Estado en `FlowPaletteState.sectionLocked`; se guarda con `saveFlowPaletteState` y se restaura al volver al flujo. Hook expone `sectionLocked` y `toggleSectionLock`.
- **Verificación**: Anclar en Refinar, ir a Aplicar, volver a Refinar → el candado sigue cerrado. Volver al menú de inspiración y reentrar en el mismo flujo → el candado conservado.

### Grupo 4 – Historial por acciones (base) ✅
- `paletteHistoryActions.ts`: tipos `PaletteHistoryAction` (por ahora solo `snapshot` con sectionId, prev, next), `applyAction`, `getInverseAction`, `createSnapshotAction`.
- Hook: `actionHistory` y `actionHistoryIndex`; `saveToHistory` crea acción snapshot; undo/redo aplican inversa o acción. Persistido en `FlowPaletteState` (actionHistory, actionHistoryIndex); migración desde history/historyIndex al restaurar.
- **Verificación**: En Refinar (o Aplicar/Análisis), deshacer/rehacer revierte o reaplica correctamente; al volver al menú y reentrar el historial se restaura.

### Grupo 5 – Historial multi-sección + candado ✅
- `getPreviousNavigableIndex` / `getNextNavigableIndex`: si la sección actual está anclada, solo se consideran acciones de esa sección; si no, se saltan las acciones de secciones ancladas. Posición -1 (inicial) navegable solo si la sección actual no está anclada.
- Undo/redo saltan al anterior/siguiente índice navegable y aplican `getStateAtPosition`. `canUndo`/`canRedo` para deshabilitar botones.
- **Verificación**: Anclar Refinar, hacer cambios en Refinar y en Aplicar; desde Aplicar, deshacer debe saltar solo acciones de Aplicar. Desde Refinar (anclada), deshacer solo acciones de Refinar.

### Grupo 6 – Ajustes y edge cases
- Restaurar, notificaciones, nombre de paleta al guardar desde banner, etc.

---

## Orden de elementos en la parte derecha del banner

1. **Guardar paleta**
2. **Paso atrás** (deshacer)
3. **Paso adelante** (rehacer)
4. **Candado** (anclar/desanclar sección)
5. **Avanzar a la siguiente sección** (ej. "Mejorar paleta →", "Guardar / Exportar →")

Por defecto solo se muestra **un botón** junto al de avanzar (expandible para mostrar 1–4).
