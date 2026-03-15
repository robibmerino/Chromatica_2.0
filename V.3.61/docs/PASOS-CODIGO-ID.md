# Pasos para activar Código ID en Análisis de datos

El código de la app y de la Edge Function ya está listo. Solo tienes que hacer **dos cosas** en tu proyecto Supabase (no se pueden automatizar desde aquí).

---

## 1. Ejecutar el SQL en Supabase (obligatorio)

1. Entra en [Supabase](https://supabase.com) → tu proyecto.
2. Abre **SQL Editor** (menú izquierdo).
3. Crea una nueva query y **pega todo** el contenido del archivo:
   - `docs/supabase-research-participant-codes.sql`
4. Pulsa **Run** (o Ctrl+Enter).
5. Comprueba que no haya errores en rojo. Deberían crearse:
   - La tabla `research_participant_codes`
   - La función `ensure_participant_codes`

Si ya tenías la tabla o la función, el script usa `create or replace` / `drop policy if exists`, así que puedes volver a ejecutarlo sin problema.

---

## 2. Desplegar la Edge Function (obligatorio)

La función `export-research-demographics` debe estar desplegada para que devuelva el campo `code`. Desde la raíz del proyecto (carpeta donde está `package.json`):

```bash
npm run supabase:deploy-export-demographics
```

(O, si sueles desplegar con Supabase CLI enlazado a tu proyecto:  
`npx supabase functions deploy export-research-demographics`.)

Necesitas tener **Supabase CLI** instalado y, si aplica, haber hecho `supabase login` y enlazar el proyecto. Si nunca has desplegado funciones, en la [doc de Supabase](https://supabase.com/docs/guides/functions) tienes el flujo completo.

---

## 3. Comprobar en la app

1. Despliega o ejecuta la app (Vercel o `npm run dev`).
2. Entra como admin en **Análisis de datos** → **Sociodemográficas**.
3. Pulsa **Previsualizar**.
4. Deberías ver la columna **Código ID** (1, 2, 3, …) y el checkbox **Mostrar User ID en tabla**.
5. Al **Descargar Excel**, deben aparecer siempre las columnas **Código ID** y **User ID**.

Si algo falla, revisa la consola del navegador y, en Supabase, los logs de la función `export-research-demographics`.
