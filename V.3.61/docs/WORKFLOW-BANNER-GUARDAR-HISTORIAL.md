# Workflow: Banner Guardar, Adelante/Atrás y Candado

Objetivo: unificar la parte derecha del banner en Refinar, Aplicar y Análisis con: **Guardar paleta** | **Adelante/Atrás** | **Candado** | **Avanzar**, y que el historial sea por **acciones** (no por estados) con reglas de candado por sección.

---

## Grupos de trabajo (verificar cada uno antes de seguir)

### Grupo 1 – UI del banner (sin lógica nueva)
- **SectionBanner**: Añadir botón "Guardar paleta", botón candado (anclar/desanclar), orden fijo: Guardar | Undo/Redo | Candado | Avanzar.
- Por defecto mostrar **solo un botón** junto a "Avanzar" (ej. "Más opciones" ⋯) que al clic expande y muestra Guardar, Adelante/Atrás, Candado.
- **RefinementPhase**, **ApplicationPhase**, **AnalysisPhase**: Pasar las nuevas props (onSavePalette, lockPinned, onLockToggle). En Análisis añadir undo/redo (ya existen en el hook; solo falta pasarlos al banner).
- **Verificación**: En Refinar, Aplicar y Análisis se ve el botón ⋯; al expandir aparecen Guardar paleta, Deshacer, Rehacer, Candado y Avanzar.

### Grupo 2 – Guardar paleta
- Si no hay sesión: al pulsar "Guardar paleta" abrir inicio/crear sesión (`onOpenAuth`). Si hay sesión, guardar la paleta actual (nombre opcional o pedirlo en modal).
- **Verificación**: Sin sesión → abre login/registro; con sesión → guarda.

### Grupo 3 – Candado (estado por sección)
- Estado: qué secciones están "ancladas" (Refinar, Aplicar, Análisis). Persistir en el estado del flujo (ej. en `useGuidedPalette` o en el estado de `flowPaletteState`).
- Solo UI: el botón candado alterna anclado/desanclado para la sección actual.
- **Verificación**: Al pulsar candado en cada sección se ve el cambio de estado (cerrado/abierto).

### Grupo 4 – Historial por acciones (base)
- Definir tipos de acción (ej. `adjustSaturation`, `reorder`, `updateColor`, etc.) y estructura del historial como lista de acciones con `sectionId` (refinement | application | analysis).
- Implementar aplicar/invertir una acción sobre la paleta actual.
- Por ahora solo en una sección (ej. Refinar): undo/redo aplican/revierten la última acción.
- **Verificación**: En Refinar, deshacer/rehacer revierte o reaplica la última acción correctamente.

### Grupo 5 – Historial multi-sección + candado
- Historial unificado Refinar–Aplicar–Análisis con `sectionId` por acción.
- Reglas: en sección anclada, adelante/atrás solo afectan acciones de esa sección; desde otras secciones, se saltan las acciones de secciones ancladas.
- **Verificación**: Escenarios con candado en una sección y adelante/atrás desde otra.

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
