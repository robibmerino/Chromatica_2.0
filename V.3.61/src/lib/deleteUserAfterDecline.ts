/**
 * Llama a la Edge Function delete-user-after-decline para eliminar la cuenta
 * del usuario actual en Supabase. Así, al pulsar "No iniciar sesión" en el gate
 * de investigación, la cuenta no se mantiene y la próxima vez que entre con OAuth
 * volverá a ver el gate.
 */

export async function deleteUserAfterDecline(
  supabaseUrl: string,
  accessToken: string
): Promise<{ error: string | null }> {
  const base = supabaseUrl.replace(/\/$/, '');
  const url = `${base}/functions/v1/delete-user-after-decline`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
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
