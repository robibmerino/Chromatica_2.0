import React from 'react';
import type { RoomSceneProps } from '../types';
import { RoomSceneEstudio } from './EstudioScene';
import { RoomSceneCafeteria } from './CafeteriaScene';
import { RoomSceneOficina } from './OficinaScene';
import { RoomSceneStand } from './StandScene';
import { RoomSceneFachada } from './FachadaScene';

export { RoomSceneEstudio } from './EstudioScene';
export const COMPACT_SCENE_MAP: Record<string, React.ComponentType<RoomSceneProps>> = {
  estudio: RoomSceneEstudio,
  cafeteria: RoomSceneCafeteria,
  oficina: RoomSceneOficina,
  stand: RoomSceneStand,
  fachada: RoomSceneFachada,
};
