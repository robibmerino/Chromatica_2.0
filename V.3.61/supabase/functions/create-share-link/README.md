# create-share-link

Edge Function que crea un token de compartir para una paleta del usuario y devuelve la URL pública.

- **Método**: POST
- **Auth**: Bearer (sesión del usuario)
- **Body**: `{ "paletteId": "uuid-o-id-de-paleta" }`
- **Respuesta**: `{ "url": "https://...?share=TOKEN", "token": "...", "expiresAt": "..." }` (el token expira en 30 días)

Despliegue: `supabase functions deploy create-share-link` (o desde el dashboard). No requiere secretos adicionales; usa SUPABASE_URL y SUPABASE_ANON_KEY para verificar la sesión.
