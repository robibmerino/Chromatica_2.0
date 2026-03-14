import { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import {
  FAMILIAR_ANIMATION,
  FAMILIAR_COMPONENT_ID,
  FAMILIAR_SIZE,
  FAMILIAR_TOP_PCT,
} from './archetypeCardComponents/familiares/constants';
import {
  HERRAMIENTAS_ANIMATION,
  HERRAMIENTAS_COMPONENT_ID,
  HERRAMIENTAS_SIZE,
  HERRAMIENTAS_TOP_PCT,
} from './archetypeCardComponents/herramientas/constants';
import {
  INSPIRACION_ANIMATION,
  INSPIRACION_COMPONENT_ID,
  INSPIRACION_HEIGHT,
  INSPIRACION_TOP_PCT,
  INSPIRACION_WIDTH,
} from './archetypeCardComponents/inspiracion/constants';
import {
  CREATURE_LABELS,
  CREATURE_SUBTITLES,
  CREATURE_LABEL_VARIANTS,
} from './archetypeCardComponents/creatures';
import type { ArchetypeAxisState } from './archetypeAxesTypes';
import {
  DEFAULT_AXIS_ORDER,
  getComponentStateFromAxes,
  getEffectiveCharacterId,
  getEffectiveSilhouetteId,
  getEffectiveEstiloId,
  AXIS_CONFIG_BY_ID,
  AXIS_BACKGROUND_ID,
} from './archetypeAxesConfig';
import { CREATURE_COMPONENT_ID } from './archetypeCardComponents/creatures/constants';
import { SILHOUETTE_COMPONENT_ID } from './archetypeCardComponents/silhouettes/constants';
import { ESTILO_COMPONENT_ID } from './archetypeCardComponents/estilos/constants';
import { ATMOSPHERE_COMPONENT_ID } from './archetypeCardComponents/atmospheres';
import { getCardComponent } from './archetypeCardComponents/registry';
import { CharacterSlot } from './QuienTinderCards';
import { CharacterLabelBelowCard } from './QuienTinderCards/CharacterLabel';
import type { QuienTinderCardData } from './QuienTinderCards';
import { SilhouetteSlot } from './QuienSilhouettes';
import { EstiloSlot } from './ComoEstilos';
import {
  SILHOUETTE_LABELS,
  SILHOUETTE_SUBTITLES,
  SILHOUETTE_LABEL_VARIANTS,
} from './QuienSilhouettes';
import {
  ESTILO_LABELS,
  ESTILO_SUBTITLES,
  ESTILO_LABEL_VARIANTS,
  ESTILO_DEFAULT_COLORS,
  ESTILO_AXIS_CONFIG,
} from './ComoEstilos';
import type { QuienSilhouetteCardData } from './QuienSilhouettes';
import type { ComoEstiloCardData, ComoEstiloId } from './ComoEstilos';
import { blendHex, getContrastBackgroundColor } from '../../utils/colorUtils';
import { QuienTinderErrorBoundary } from './QuienTinderErrorBoundary';

const CARD_PREVIEW_MAX_WIDTH = 288;

interface TinderCardPreviewProps {
  /** Tarjeta seleccionada (contiene characterId para Quién) */
  card: { id: string; [key: string]: unknown };
  /** Estado de ejes para esta tarjeta */
  axesState: ArchetypeAxisState[];
  /** Orden de ejes (por defecto DEFAULT_AXIS_ORDER) */
  axisOrder?: string[];
  /** Columna actual (quien, que, como) */
  columnKey: 'quien' | 'que' | 'como';
  /** Clase extra para el contenedor */
  className?: string;
  /** true = ocupa todo el contenedor (Fase 1 swipe); false = max-width fijo (Fase 2) */
  fullSize?: boolean;
  /** Oculta las etiquetas (Fase 1: se renderizan en SwipeDeck debajo de la pila) */
  hideLabels?: boolean;
  /** Oculta el fondo de la tarjeta (Fase 2: sin fondo predeterminado al entrar) */
  hideBackground?: boolean;
  /** Si true: usa fondo Fase 1 (Firmamento) salvo que axis-background tenga hasBeenConfigured */
  useDefaultBackgroundUnlessConfigured?: boolean;
  /** Modo avatar: cuando 'detail', el detalle (Familiar/Herramienta/Inspiración) se muestra grande y centrado en lugar de la figura */
  centerLayer?: 'figure' | 'detail';
}

/**
 * Vista previa de la tarjeta Tinder con componentes editables (fondo, etc.) aplicados.
 * Usa axesState para determinar qué variante de cada componente mostrar.
 */
export function TinderCardPreview({
  card,
  axesState,
  axisOrder = DEFAULT_AXIS_ORDER,
  columnKey,
  className = '',
  fullSize = false,
  hideLabels = false,
  hideBackground = false,
  useDefaultBackgroundUnlessConfigured = false,
  centerLayer = 'figure',
}: TinderCardPreviewProps) {
  const isQuien = columnKey === 'quien' && 'characterId' in card;
  const isQue = columnKey === 'que' && 'silhouetteId' in card;
  const isComo = columnKey === 'como' && 'estiloId' in card;
  // Usar axisOrder del padre (incl. axis-2-herramientas en Quién). No sobrescribir con DEFAULT_AXIS_ORDER_QUE.
  const effectiveAxisOrder = axisOrder;

  const backgroundAxisState = useMemo(() => {
    const bgConfigured =
      useDefaultBackgroundUnlessConfigured &&
      axesState.some((s) => s.axisId === AXIS_BACKGROUND_ID && s.hasBeenConfigured === true);
    const effectiveAxesForBg = useDefaultBackgroundUnlessConfigured && !bgConfigured ? [] : axesState;
    return getComponentStateFromAxes('background', effectiveAxesForBg, axisOrder);
  }, [axesState, axisOrder, useDefaultBackgroundUnlessConfigured]);
  const familiarAxisState = useMemo(
    () => getComponentStateFromAxes(FAMILIAR_COMPONENT_ID, axesState, effectiveAxisOrder),
    [axesState, effectiveAxisOrder]
  );
  const herramientaAxisState = useMemo(
    () => getComponentStateFromAxes(HERRAMIENTAS_COMPONENT_ID, axesState, effectiveAxisOrder),
    [axesState, effectiveAxisOrder]
  );
  const inspiracionAxisState = useMemo(
    () => getComponentStateFromAxes(INSPIRACION_COMPONENT_ID, axesState, effectiveAxisOrder),
    [axesState, effectiveAxisOrder]
  );
  const creatureAxisState = useMemo(
    () => getComponentStateFromAxes(CREATURE_COMPONENT_ID, axesState, axisOrder),
    [axesState, axisOrder]
  );
  const silhouetteAxisState = useMemo(
    () => getComponentStateFromAxes(SILHOUETTE_COMPONENT_ID, axesState, effectiveAxisOrder),
    [axesState, effectiveAxisOrder]
  );
  const estiloAxisState = useMemo(
    () => getComponentStateFromAxes(ESTILO_COMPONENT_ID, axesState, effectiveAxisOrder),
    [axesState, effectiveAxisOrder]
  );
  const atmosphereAxisState = useMemo(
    () => getComponentStateFromAxes(ATMOSPHERE_COMPONENT_ID, axesState, axisOrder),
    [axesState, axisOrder]
  );

  const BackgroundComponent = useMemo(
    () => getCardComponent('background', backgroundAxisState.versionId),
    [backgroundAxisState.versionId]
  );
  const FamiliarComponent = useMemo(
    () => getCardComponent(FAMILIAR_COMPONENT_ID, familiarAxisState.versionId),
    [familiarAxisState.versionId]
  );
  const HerramientaComponent = useMemo(
    () => getCardComponent(HERRAMIENTAS_COMPONENT_ID, herramientaAxisState.versionId),
    [herramientaAxisState.versionId]
  );
  const InspiracionComponent = useMemo(
    () => getCardComponent(INSPIRACION_COMPONENT_ID, inspiracionAxisState.versionId),
    [inspiracionAxisState.versionId]
  );
  const AtmosphereComponent = useMemo(
    () => getCardComponent(ATMOSPHERE_COMPONENT_ID, atmosphereAxisState.versionId),
    [atmosphereAxisState.versionId]
  );

  const effectiveSilhouetteId = isQue
    ? getEffectiveSilhouetteId(card as unknown as QuienSilhouetteCardData, axesState, effectiveAxisOrder)
    : null;
  const effectiveEstiloId = isComo
    ? getEffectiveEstiloId(card as unknown as ComoEstiloCardData, axesState, effectiveAxisOrder)
    : null;
  const { familiarAxisConfigured, herramientaAxisConfigured, inspiracionAxisConfigured, creatureAxisConfigured, silhouetteAxisConfigured, estiloAxisConfigured, atmosphereAxisConfigured } = useMemo(() => {
    let familiar = false;
    let herramienta = false;
    let inspiracion = false;
    let creature = false;
    let silhouette = false;
    let estilo = false;
    let atmosphere = false;
    for (const s of axesState) {
      if (s.hasBeenConfigured !== true) continue;
      const componentId = AXIS_CONFIG_BY_ID.get(s.axisId)?.componentId;
      if (componentId === FAMILIAR_COMPONENT_ID) familiar = true;
      else if (componentId === HERRAMIENTAS_COMPONENT_ID) herramienta = true;
      else if (componentId === INSPIRACION_COMPONENT_ID) inspiracion = true;
      else if (componentId === CREATURE_COMPONENT_ID) creature = true;
      else if (componentId === SILHOUETTE_COMPONENT_ID) silhouette = true;
      else if (componentId === ESTILO_COMPONENT_ID) estilo = true;
      else if (componentId === ATMOSPHERE_COMPONENT_ID) atmosphere = true;
    }
    return {
      familiarAxisConfigured: familiar,
      herramientaAxisConfigured: herramienta,
      inspiracionAxisConfigured: inspiracion,
      creatureAxisConfigured: creature,
      silhouetteAxisConfigured: silhouette,
      estiloAxisConfigured: estilo,
      atmosphereAxisConfigured: atmosphere,
    };
  }, [axesState]);

  const showFamiliar =
    FamiliarComponent &&
    familiarAxisState.versionId !== 'default' &&
    familiarAxisConfigured;
  const showHerramienta =
    HerramientaComponent &&
    herramientaAxisState.versionId !== 'default' &&
    herramientaAxisConfigured;
  const showInspiracion =
    InspiracionComponent &&
    inspiracionAxisState.versionId !== 'default' &&
    inspiracionAxisConfigured;

  const showAtmosphere = AtmosphereComponent && atmosphereAxisConfigured;

  const effectiveCharacterId = isQuien
    ? getEffectiveCharacterId(card as unknown as QuienTinderCardData, axesState, axisOrder)
    : null;

  const cardOnly = hideLabels;

  return (
    <div
      className={cn(
        'flex flex-col items-center',
        cardOnly && 'w-full h-full',
        fullSize && !cardOnly && 'w-full h-full absolute inset-0',
        className
      )}
    >
      <div
        className={cn(
          'relative rounded-2xl overflow-hidden border border-gray-600/50',
          fullSize ? 'flex-1 min-h-0 w-full' : 'w-full aspect-[3/4] shadow-2xl shrink-0'
        )}
        style={fullSize ? undefined : { maxWidth: CARD_PREVIEW_MAX_WIDTH }}
      >
        {/* Capa de fondo (componente editable por eje 1); omitir si hideBackground */}
        {!hideBackground &&
          (BackgroundComponent ? (
            <BackgroundComponent
              versionId={backgroundAxisState.versionId}
              blendedColor={backgroundAxisState.blendedColor}
              colorLeft={backgroundAxisState.colorLeft}
              colorRight={backgroundAxisState.colorRight}
              sliderValue={backgroundAxisState.sliderValue}
              defaultColorLeft={backgroundAxisState.defaultColorLeft}
              className="rounded-2xl"
            />
          ) : (
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900"
              aria-hidden
            />
          ))}

      {/* Modo avatar: detalle grande y centrado */}
      {centerLayer === 'detail' && (showFamiliar || showHerramienta || showInspiracion) && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-[70%] h-[70%] flex items-center justify-center min-w-0 min-h-0">
            {showFamiliar && (
              <FamiliarComponent
                versionId={familiarAxisState.versionId}
                blendedColor={familiarAxisState.blendedColor}
                colorLeft={familiarAxisState.colorLeft}
                colorRight={familiarAxisState.colorRight}
                sliderValue={familiarAxisState.sliderValue}
                defaultColorLeft={familiarAxisState.defaultColorLeft}
                className="w-full h-full"
              />
            )}
            {showHerramienta && !showFamiliar && (
              <HerramientaComponent
                versionId={herramientaAxisState.versionId}
                blendedColor={herramientaAxisState.blendedColor}
                colorLeft={herramientaAxisState.colorLeft}
                colorRight={herramientaAxisState.colorRight}
                sliderValue={herramientaAxisState.sliderValue}
                defaultColorLeft={herramientaAxisState.defaultColorLeft}
                className="w-full h-full"
              />
            )}
            {showInspiracion && !showFamiliar && !showHerramienta && (
              <div
                className="w-full h-full rounded-2xl p-2 flex items-center justify-center overflow-hidden"
                style={{
                  background: getContrastBackgroundColor(inspiracionAxisState.blendedColor, 0.7),
                  border: `1px solid ${inspiracionAxisState.blendedColor}40`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                }}
              >
                <InspiracionComponent
                  versionId={inspiracionAxisState.versionId}
                  blendedColor={inspiracionAxisState.blendedColor}
                  colorLeft={inspiracionAxisState.colorLeft}
                  colorRight={inspiracionAxisState.colorRight}
                  sliderValue={inspiracionAxisState.sliderValue}
                  defaultColorLeft={inspiracionAxisState.defaultColorLeft}
                  className="w-full h-full min-w-0 min-h-0"
                />
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Esencia/Familiar (Qué) o Herramienta (Quién) o Inspiración (Cómo) — overlay superior derecha (solo si no centerLayer detail) */}
      {centerLayer !== 'detail' && showFamiliar && (
        <motion.div
          className="absolute right-3 pointer-events-none"
          style={{
            top: `${FAMILIAR_TOP_PCT}%`,
            width: FAMILIAR_SIZE,
            height: FAMILIAR_SIZE,
          }}
          animate={{ y: FAMILIAR_ANIMATION.y, rotate: FAMILIAR_ANIMATION.rotate }}
          transition={{
            duration: FAMILIAR_ANIMATION.duration,
            repeat: Infinity,
            ease: FAMILIAR_ANIMATION.ease,
          }}
        >
          <FamiliarComponent
            versionId={familiarAxisState.versionId}
            blendedColor={familiarAxisState.blendedColor}
            colorLeft={familiarAxisState.colorLeft}
            colorRight={familiarAxisState.colorRight}
            sliderValue={familiarAxisState.sliderValue}
            defaultColorLeft={familiarAxisState.defaultColorLeft}
            className="w-full h-full"
          />
        </motion.div>
      )}
      {centerLayer !== 'detail' && showInspiracion && (
        <motion.div
          className="absolute right-3 pointer-events-none z-10"
          style={{
            top: `${INSPIRACION_TOP_PCT}%`,
            width: INSPIRACION_WIDTH,
            height: INSPIRACION_HEIGHT,
          }}
          animate={{ y: INSPIRACION_ANIMATION.y }}
          transition={{
            duration: INSPIRACION_ANIMATION.duration,
            repeat: Infinity,
            ease: INSPIRACION_ANIMATION.ease,
          }}
        >
          <div
            className="w-full h-full rounded-2xl p-2 flex items-center justify-center overflow-hidden"
            style={{
              background: getContrastBackgroundColor(inspiracionAxisState.blendedColor, 0.7),
              border: `1px solid ${inspiracionAxisState.blendedColor}40`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
            }}
          >
            <InspiracionComponent
              versionId={inspiracionAxisState.versionId}
              blendedColor={inspiracionAxisState.blendedColor}
              colorLeft={inspiracionAxisState.colorLeft}
              colorRight={inspiracionAxisState.colorRight}
              sliderValue={inspiracionAxisState.sliderValue}
              defaultColorLeft={inspiracionAxisState.defaultColorLeft}
              className="w-full h-full min-w-0 min-h-0"
            />
          </div>
        </motion.div>
      )}
      {centerLayer !== 'detail' && showHerramienta && (
        <motion.div
          className="absolute right-3 pointer-events-none"
          style={{
            top: `${HERRAMIENTAS_TOP_PCT}%`,
            width: HERRAMIENTAS_SIZE,
            height: HERRAMIENTAS_SIZE,
          }}
          animate={{ y: HERRAMIENTAS_ANIMATION.y, rotate: HERRAMIENTAS_ANIMATION.rotate }}
          transition={{
            duration: HERRAMIENTAS_ANIMATION.duration,
            repeat: Infinity,
            ease: HERRAMIENTAS_ANIMATION.ease,
          }}
        >
          <HerramientaComponent
            versionId={herramientaAxisState.versionId}
            blendedColor={herramientaAxisState.blendedColor}
            colorLeft={herramientaAxisState.colorLeft}
            colorRight={herramientaAxisState.colorRight}
            sliderValue={herramientaAxisState.sliderValue}
            defaultColorLeft={herramientaAxisState.defaultColorLeft}
            className="w-full h-full"
          />
        </motion.div>
      )}

      {/* Contenido: personaje (Quién) o silueta (Qué) según columna (oculto cuando centerLayer detail) */}
      {centerLayer === 'figure' && (
      <div className="absolute inset-0 flex flex-col">
        {isQuien ? (
          <QuienTinderErrorBoundary fallback={<p className="text-gray-500 text-sm p-4">Error al cargar</p>}>
            <CharacterSlot
              characterId={
                (effectiveCharacterId ?? (card as unknown as QuienTinderCardData).characterId) as QuienTinderCardData['characterId']
              }
              color={creatureAxisConfigured ? creatureAxisState.blendedColor : undefined}
              axisColorParams={
                creatureAxisConfigured && creatureAxisState.defaultColorLeft != null
                  ? {
                      colorLeft: creatureAxisState.colorLeft,
                      colorRight: creatureAxisState.colorRight,
                      defaultColorLeft: creatureAxisState.defaultColorLeft,
                      sliderValue: creatureAxisState.sliderValue,
                    }
                  : undefined
              }
              className="flex-1 min-h-0 w-full"
              hideLabel
            />
          </QuienTinderErrorBoundary>
        ) : isQue ? (
          <QuienTinderErrorBoundary fallback={<p className="text-gray-500 text-sm p-4">Error al cargar</p>}>
            <SilhouetteSlot
              silhouetteId={
                (effectiveSilhouetteId ?? (card as unknown as QuienSilhouetteCardData).silhouetteId) as QuienSilhouetteCardData['silhouetteId']
              }
              color={silhouetteAxisConfigured ? silhouetteAxisState.blendedColor : undefined}
              className="flex-1 min-h-0 w-full"
              hideLabel
            />
          </QuienTinderErrorBoundary>
        ) : isComo ? (
          <QuienTinderErrorBoundary fallback={<p className="text-gray-500 text-sm p-4">Error al cargar</p>}>
            <EstiloSlot
              estiloId={
                (effectiveEstiloId ?? (card as unknown as ComoEstiloCardData).estiloId) as ComoEstiloCardData['estiloId']
              }
              color={
                estiloAxisConfigured
                  ? estiloAxisState.blendedColor
                  : (() => {
                      const eid = (effectiveEstiloId ?? (card as unknown as ComoEstiloCardData).estiloId) as ComoEstiloId | string;
                      if (eid != null && eid in ESTILO_DEFAULT_COLORS) {
                        const { left, right } = ESTILO_DEFAULT_COLORS[eid as ComoEstiloId];
                        const cfg = ESTILO_AXIS_CONFIG[eid as ComoEstiloId];
                        const slider = cfg?.defaultSliderValue ?? 0;
                        return blendHex(left, right, slider / 100);
                      }
                      return undefined;
                    })()
              }
              className="flex-1 min-h-0 w-full"
              hideLabel
            />
          </QuienTinderErrorBoundary>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-gray-500 text-sm">Tarjeta #{card.id}</p>
          </div>
        )}
      </div>
      )}

      {/* Atmósfera: capa de partículas en primer plano */}
      {showAtmosphere && AtmosphereComponent && (
        <AtmosphereComponent
          versionId={atmosphereAxisState.versionId}
          blendedColor={atmosphereAxisState.blendedColor}
          colorLeft={atmosphereAxisState.colorLeft}
          colorRight={atmosphereAxisState.colorRight}
          sliderValue={atmosphereAxisState.sliderValue}
          defaultColorLeft={atmosphereAxisState.defaultColorLeft}
          className="absolute inset-0"
        />
      )}
      </div>

      {/* Etiquetas bajo la tarjeta (Quién: criaturas; Qué: siluetas) */}
      {!hideLabels &&
        isQuien &&
        effectiveCharacterId != null &&
        effectiveCharacterId in CREATURE_LABELS && (
          <CharacterLabelBelowCard
            title={CREATURE_LABELS[effectiveCharacterId as keyof typeof CREATURE_LABELS]}
            subtitle={CREATURE_SUBTITLES[effectiveCharacterId as keyof typeof CREATURE_SUBTITLES]}
            variant={CREATURE_LABEL_VARIANTS[effectiveCharacterId as keyof typeof CREATURE_LABEL_VARIANTS]}
          />
        )}
      {!hideLabels &&
        isQue &&
        effectiveSilhouetteId != null &&
        effectiveSilhouetteId in SILHOUETTE_LABELS && (
          <CharacterLabelBelowCard
            title={SILHOUETTE_LABELS[effectiveSilhouetteId]}
            subtitle={SILHOUETTE_SUBTITLES[effectiveSilhouetteId]}
            variant={SILHOUETTE_LABEL_VARIANTS[effectiveSilhouetteId]}
          />
        )}
      {!hideLabels &&
        isComo &&
        effectiveEstiloId != null &&
        effectiveEstiloId in ESTILO_LABELS && (
          <CharacterLabelBelowCard
            title={ESTILO_LABELS[effectiveEstiloId as keyof typeof ESTILO_LABELS]}
            subtitle={ESTILO_SUBTITLES[effectiveEstiloId as keyof typeof ESTILO_SUBTITLES]}
            variant={ESTILO_LABEL_VARIANTS[effectiveEstiloId as keyof typeof ESTILO_LABEL_VARIANTS]}
          />
        )}
    </div>
  );
}
