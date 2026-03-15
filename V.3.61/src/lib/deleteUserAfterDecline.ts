/**
 * Llama a la Edge Function delete-user-after-decline para eliminar la cuenta
 * del usuario actual en Supabase. Así, al pulsar "No iniciar sesión" en el gate
 * de investigación, la cuenta no se mantiene y la próxima vez que entre con OAuth
 * volverá a ver el gate.
 *
 * Envía la anon key en Authorization (para que la puerta de Supabase acepte la petición)
 * y el JWT del usuario en el body, para evitar 401 Invalid JWT del gateway.
 */

export async function deleteUserAfterDecline(
  supabaseUrl: string,
  anonKey: string,
  accessToken: string
): Promise<{ error: string | null }> {
  const base = supabaseUrl.replace(/\/$/, '');
  const url = `${base}/functions/v1/delete-user-after-decline`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ access_token: accessToken }),
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try {
      const j = JSON.parse(text) as { error?: string };
      if (j?.error) msg = j.error;
    } catch {
      /* use text as is */
    }
    return { error: msg || `Error ${res.status}` };
  }
  return { error: null };
}
