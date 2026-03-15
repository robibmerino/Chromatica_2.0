# Análisis estadístico de sociodemográficas (Chromatica)

Variables disponibles en `research_demographics`:

| Variable           | Tipo        | Valores / Notas |
|--------------------|-------------|------------------|
| `age_range`        | Categórica ordinal | 18-25, 26-35, 36-45, 46-55, 55+ |
| `gender`           | Categórica nominal | Mujer, Hombre, No binario, Otro |
| `design_career`    | Categórica nominal | Diseño gráfico, UX/UI, Arquitectura, etc. |
| `is_upv_student`   | Dicotómica  | Sí / No |
| `consented_at`     | Fecha/hora  | Para tendencia temporal si N es alto |

---

## 1. Análisis univariados (por variable)

- **Edad**: Distribución de frecuencias con **orden fijo** (18-25 → 55+). n y % por rango. Gráfico de barras horizontal.
- **Género**: Frecuencias y porcentajes. Gráfico de barras.
- **Área diseño**: Frecuencias y %; orden por frecuencia descendente o alfabético. Gráfico de barras.
- **Estudiante UPV**: n y % Sí / No. Gráfico de barras o resumen numérico.

Útil para: descripción de la muestra en metodología, comprobar representatividad.

---

## 2. Resumen de la muestra

- **N total** de participantes.
- Tabla “Características de la muestra”: por cada variable, filas con categoría, n y % (porcentaje sobre respuestas válidas si hay missing).
- Permite copiar/pegar en informes o artículos.

---

## 3. Análisis bivariados (cruces)

- **Género × Área diseño**: tabla cruzada (y opcionalmente heatmap). ¿Hay áreas con más presencia de un género?
- **Edad × Área diseño**: ¿distribución de edad por área?
- **Estudiante UPV × Área diseño**: ¿proporción de estudiantes UPV por área?
- **Género × Edad**: pirámide o tabla cruzada.

Útil para: análisis exploratorio, hipótesis sobre subgrupos, posibles variables de control.

---

## 4. Orden y buenas prácticas

- **Edad**: siempre orden lógico 18-25, 26-35, 36-45, 46-55, 55+ (no solo por frecuencia).
- **Porcentajes**: indicar base (N total o N con dato) para interpretación.
- **Missing**: tratar “Sin indicar” / vacío de forma explícita en tablas (n y %).

---

## 5. Implementación en la app

En la pestaña **Análisis de datos** → sección Sociodemográficas → panel “Análisis estadístico”:

- **Pestañas o selector**: Resumen | Edad | Género | Área | Estudiante UPV | Cruces.
- Cada pestaña: tabla de frecuencias (n, %) + gráfico de barras (salvo Resumen y Cruces).
- Cruces: selector de cruce (ej. Género × Área) → tabla cruzada 2D con conteos (y opcional % por fila/columna).
