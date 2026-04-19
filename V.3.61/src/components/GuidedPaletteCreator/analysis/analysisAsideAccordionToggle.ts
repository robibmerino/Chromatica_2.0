/**
 * Acordeón: si `key` ya estaba abierto, solo lo cierra; si no, abre `key` y cierra el resto.
 */
export function toggleExclusivePanel<K extends string>(
  key: K,
  prev: Record<K, boolean>,
  allKeys: readonly K[]
): Record<K, boolean> {
  if (prev[key]) {
    return { ...prev, [key]: false };
  }
  const next = {} as Record<K, boolean>;
  for (const k of allKeys) {
    next[k] = false;
  }
  next[key] = true;
  return next;
}
