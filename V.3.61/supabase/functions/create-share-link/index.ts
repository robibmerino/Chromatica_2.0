/**
 * Edge Function: create-share-link
 * Crea un token de compartir para una paleta del usuario y devuelve la URL pública.
 * Requiere autenticación; la paleta debe pertenecer al usuario.
 */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Apikey',
};

/** Extrae el user id (sub) del payload del JWT. El token viene de Supabase Auth. */
function getUserIdFromJwt(jwt: string): string | null {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return null;
    let payload = parts[1];
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    payload += '='.repeat((4 - (payload.length % 4)) % 4);
    const decoded = atob(payload);
    const obj = JSON.parse(decoded) as { sub?: string };
    const sub = obj.sub;
    return typeof sub === 'string' && sub.length > 0 ? sub : null;
  } catch {
    return null;
  }
}

function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  for (let i = 0; i < 12; i++) s += chars[bytes[i] % chars.length];
  return s;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  let body: { paletteId?: string; accessToken?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400, headers: corsHeaders });
  }
  const jwt = (body?.accessToken ?? req.headers.get('Authorization')?.replace('Bearer ', '')).trim();
  if (!jwt) {
    return Response.json({ error: 'Falta accessToken en el body o Authorization' }, { status: 401, headers: corsHeaders });
  }
  const userId = getUserIdFromJwt(jwt);
  if (!userId) {
    return Response.json({ error: 'Token inválido o no se pudo leer (formato JWT)' }, { status: 401, headers: corsHeaders });
  }
  const paletteId = body?.paletteId?.trim();
  if (!paletteId) {
    return Response.json({ error: 'paletteId is required' }, { status: 400, headers: corsHeaders });
  }
  const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: palette, error: paletteError } = await client
    .from('palettes')
    .select('id')
    .eq('id', paletteId)
    .eq('user_id', userId)
    .single();
  if (paletteError || !palette) {
    return Response.json({ error: 'Palette not found or access denied' }, { status: 404, headers: corsHeaders });
  }

  const shareToken = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { error: insertError } = await client.from('palette_share_tokens').insert({
    token: shareToken,
    palette_id: paletteId,
    user_id: userId,
    expires_at: expiresAt.toISOString(),
  });
  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500, headers: corsHeaders });
  }

  const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/$/, '') || '';
  const base = origin || 'https://chromatica.example.com';
  const url = `${base}?share=${shareToken}`;

  return Response.json({ url, token: shareToken, expiresAt: expiresAt.toISOString() }, {
    headers: corsHeaders,
  });
});
