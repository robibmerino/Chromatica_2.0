# Workflow: Añadir una criatura

Guía para incorporar una nueva criatura al flujo de inspiración (Quién / eje Identidad).

## Resumen rápido

1. Crear el componente SVG en `QuienTinderCards/characters/`.
2. Registrar en `characterRegistry.tsx` y `characters/index.ts`.
3. Añadir metadata en `creatureMetadata.ts`.
4. Usar `useCreatureAxisPalette` y `getCreatureMetadata` en el componente.

---

## 1. Crear el componente

- Ubicación: `src/components/inspiration/QuienTinderCards/characters/<Nombre>.tsx`
- Usa `CharacterFrame` para el contenedor.
- Usa `useUniqueSvgIds` para IDs de gradientes/filtros en el SVG.
- Define una paleta base (objeto con colores hex).

## 2. Registrar el personaje

- **characterRegistry.tsx**: Añadir `[characterId]: NombreDelComponente` en el mapa.
- **characters/index.ts**: Exportar el componente y añadirlo al array de exportación si aplica.

## 3. Metadata en creatureMetadata.ts

Fuente única de verdad para nombre, subtítulo, etiquetas y eje:

```ts
// En CREATURE_METADATA
[characterId]: {
  name: 'Nombre Mostrado',
  description: 'Breve descripción para el modal de personalización',
  subtitle: 'Arquetipo',        // ej. "Mística"
  labelVariant: 'cyan',         // emerald | violet | rose | amber | sky | slate | cyan | fuchsia
  axis: {
    axisLabel: 'Extremo Izq.–Extremo Der.',
    defaultColorLeft: '#9822c3',
    defaultColorRight: '#926e2f',
    defaultSliderValue: 0,      // 0 = izq, 100 = der
  },
},
```

## 4. Usar en el componente

```tsx
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

const CREATURE_ID = 1 as const;  // tu characterId

const c = useCreatureAxisPalette(CREATURE_ID, TU_PALETA_BASE, axisColorParams);
const meta = getCreatureMetadata(CREATURE_ID);

return (
  <CharacterFrame
    title={meta?.name ?? 'Fallback'}
    subtitle={meta?.subtitle ?? '—'}
    variant={meta?.labelVariant ?? 'slate'}
    ...
  >
    {/* SVG usando c.coreLight, c.coreMid, etc. */}
  </CharacterFrame>
);
```

## Derivaciones automáticas

A partir de `CREATURE_METADATA` se derivan:

- `CREATURE_LABELS` (nombre en modal)
- `CREATURE_SUBTITLES` (arquetipo)
- `CREATURE_LABEL_VARIANTS` (color de pill)
- `CREATURE_AXIS_CONFIG` (eje Identidad)
- `CREATURE_DEFAULT_COLORS` (colores del slider)

No hace falta configurarlos manualmente en `creatures/index.ts`.

## Criaturas sin eje

Si la criatura no tiene eje propio, basta con registrarla en `characterRegistry` y `characters/index.ts`. Usará valores por defecto genéricos. Puedes añadir metadata mínima (solo `name`, `subtitle`, `labelVariant`) sin `axis` para personalizar etiquetas.
