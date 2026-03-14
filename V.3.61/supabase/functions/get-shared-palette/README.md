# get-shared-palette

Edge Function que devuelve una paleta compartida por token (lectura anónima).

- **Método**: GET
- **Auth**: ninguna
- **Query**: `?token=TOKEN`
- **Respuesta**: `{ "palette": { "id", "name", "colors", "createdAt" } }` o 404 si el token no existe o ha expirado

Despliegue: `supabase functions deploy get-shared-palette`. Usa SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para leer la tabla `palette_share_tokens` y `palettes`.
