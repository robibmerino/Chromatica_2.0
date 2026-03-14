/**
 * Edge Function: get-shared-palette
 * Devuelve la paleta pública asociada a un token de compartir (lectura anónima).
 * GET ?token=xxx
 */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('token')?.trim();
  if (!token) {
    return Response.json({ error: 'token query parameter is required' }, { status: 400 });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: row, error: tokenError } = await admin
    .from('palette_share_tokens')
    .select('palette_id, expires_at')
    .eq('token', token)
    .single();

  if (tokenError || !row) {
    return Response.json({ error: 'Link not found or expired' }, { status: 404 });
  }
  if (row.expires_at && new Date(row.expires_at) < new Date()) {
    return Response.json({ error: 'Link expired' }, { status: 404 });
  }

  const { data: palette, error: paletteError } = await admin
    .from('palettes')
    .select('id, name, colors, created_at')
    .eq('id', row.palette_id)
    .single();

  if (paletteError || !palette) {
    return Response.json({ error: 'Palette not found' }, { status: 404 });
  }

  const payload = {
    id: palette.id,
    name: palette.name,
    colors: Array.isArray(palette.colors) ? palette.colors : [],
    createdAt: palette.created_at,
  };

  return Response.json({ palette: payload }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
});
