# Desplegar Edge Functions (compartir paleta)

Solo tienes que hacer **tú** los pasos que dicen **"TÚ"**. El resto ya está preparado.

---

## Paso 1 (TÚ): Abrir la terminal en la carpeta del proyecto

**Importante:** usa una terminal **nueva** (donde NO esté corriendo `npm run dev`). En Cursor: **Terminal → Nueva terminal** (o el botón + del panel de la terminal).

1. En esa terminal nueva, escribe **exactamente** (con el guion en `OneDrive - UPV`):
   ```bash
   cd "c:\Users\robi2\OneDrive - UPV\Escritorio\Chromatica\V.3.61"
   ```
   Pulsa **Enter**.

2. Luego escribe y pulsa **Enter**:
   ```bash
   npx supabase --version
   ```
3. **Espera 20–30 segundos** la primera vez (npx descarga la CLI). Al final debe salir un número, por ejemplo: `2.78.1`.
4. **Dime qué sale.** Si sale un número de versión, seguimos. Si sale error o no sale nada tras esperar, dímelo.

---

## Paso 2 (TÚ): Iniciar sesión en Supabase

- En la **misma** terminal, escribe:
  ```bash
  npx supabase login
  ```
- Se abrirá el navegador para que inicies sesión en Supabase (o te dará un enlace que debes abrir).
- Cuando hayas iniciado sesión, vuelve a la terminal.
- **Dime si terminó bien** (suele decir "Logged in" o similar).

---

## Paso 3 (TÚ): Conseguir el "Reference ID" de tu proyecto

- Entra en [app.supabase.com](https://app.supabase.com) y abre **tu proyecto**.
- En el menú de la izquierda: **Project Settings** (icono de engranaje).
- En **General** verás **Reference ID** (una cadena de letras/números, por ejemplo `xyzabc123def`).
- **Cópialo** (o escríbelo en un sitio; lo usarás en el siguiente paso).

---

## Paso 4 (TÚ): Enlazar este proyecto con tu proyecto Supabase

- En la **misma** terminal (carpeta V.3.61), escribe **sustituyendo** `TU_REFERENCE_ID` por el Reference ID que copiaste:
  ```bash
  npx supabase link --project-ref TU_REFERENCE_ID
  ```
- Si te pide **database password**, usa la contraseña de la base de datos que pusiste al crear el proyecto en Supabase.
- **Dime si salió bien** (suele decir "Linked" o que el proyecto está enlazado).

---

## Paso 5 (TÚ): Desplegar las dos funciones

- En la **misma** terminal, escribe:
  ```bash
  npm run supabase:deploy-share
  ```
- Deberían desplegarse las funciones `create-share-link` y `get-shared-palette`.
- **Dime qué sale** (si ves "Deployed function ..." para las dos, está listo).

---

## Abrir enlaces compartidos (RPC, sin Edge Function)

Para que al abrir un enlace `?share=TOKEN` se cargue la paleta compartida, la app usa la **función RPC** `get_shared_palette` en la base de datos (no la Edge Function). Así se evita el gateway que exigía auth.

- Asegúrate de haber ejecutado el SQL en **`docs/supabase-realtime-storage-share.sql`** (incluye la función `get_shared_palette` y los `grant execute` a `anon` y `authenticated`).
- Si ya habías ejecutado ese script antes, en Supabase → **SQL Editor** ejecuta solo el bloque desde `create or replace function public.get_shared_palette` hasta `grant execute ... to authenticated;`.

---

## Listo

En Supabase → **Edge Functions** puedes seguir teniendo las dos funciones (opcional). En la app: **Compartir enlace** crea el link insertando en BD, y **abrir el link** lee la paleta con la RPC `get_shared_palette`.
