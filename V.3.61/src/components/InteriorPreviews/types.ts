export interface InteriorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  muted: string;
}

export interface InteriorPreviewProps {
  palette: InteriorPalette;
  variant: string;
  /** Solo en layout compacto: muestra únicamente la ilustración de la escena (sin cabecera, paleta ni fichas). */
  sceneOnly?: boolean;
}

export interface RoomColors {
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  muted: string;
  background: string;
}

export type RoomSceneProps = RoomColors & { fillContainer?: boolean };
