import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPalettes,
  insertPalette,
  updatePaletteName,
  deletePalette as deletePaletteApi,
} from '../lib/supabasePalettes';
import { queryClient, palettesQueryKey } from '../lib/queryClient';
import type { SavedPalette } from '../types/guidedPalette';

/** Hook para listar paletas del usuario con cache y refetch. */
export function usePalettesQuery(userId: string | undefined) {
  return useQuery({
    queryKey: palettesQueryKey(userId ?? ''),
    queryFn: () => fetchPalettes(userId!),
    enabled: !!userId,
  });
}

/** Mutations para paletas: insertar, actualizar nombre, eliminar. Invalidan la lista al completar. */
export function usePaletteMutations(userId: string | undefined) {
  const qc = useQueryClient();

  const invalidatePalettes = () => {
    if (userId) qc.invalidateQueries({ queryKey: palettesQueryKey(userId) });
  };

  const insert = useMutation({
    mutationFn: (palette: SavedPalette) => insertPalette(userId!, palette),
    onSuccess: () => invalidatePalettes(),
  });

  const updateName = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updatePaletteName(userId!, id, name),
    onSuccess: () => invalidatePalettes(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deletePaletteApi(userId!, id),
    onSuccess: () => invalidatePalettes(),
  });

  return { insert, updateName, remove };
}

/** Helper para invalidar paletas desde fuera de un componente (ej. tras guardar en useGuidedPalette). */
export function invalidatePalettes(userId: string) {
  queryClient.invalidateQueries({ queryKey: palettesQueryKey(userId) });
}
