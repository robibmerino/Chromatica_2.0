import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import ButtonParticles from '../ButtonParticles';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import type { ArchetypeAxisConfig, ArchetypeAxisState } from './archetypeAxesTypes';
import type { ArchetypeOption } from './archetypeAxesTypes';
import { CREATURE_COMPONENT_ID } from './archetypeCardComponents/creatures/constants';
import { SILHOUETTE_COMPONENT_ID } from './archetypeCardComponents/silhouettes/constants';
import { getCardComponent } from './archetypeCardComponents/registry';
import { blendHex } from '../../utils/colorUtils';
import { parseArchetypeLabel, getBaseOptions } from './archetypeAxesUtils';
import { getCreatureMetadata, CREATURE_LABELS } from './archetypeCardComponents/creatures';
import {
  getSilhouetteMetadata,
  SILHOUETTE_LABELS,
} from './archetypeCardComponents/silhouettes';
import { getBackgroundMetadata } from './archetypeCardComponents/backgrounds';
import { getFamiliarMetadata } from './archetypeCardComponents/familiares';
import { getHerramientaMetadata } from './archetypeCardComponents/herramientas';
import { getInspiracionMetadata } from './archetypeCardComponents/inspiracion';
import { ATMOSPHERE_COMPONENT_ID, getAtmosphereMetadata } from './archetypeCardComponents/atmospheres';
import { FAMILIAR_COMPONENT_ID } from './archetypeCardComponents/familiares/constants';
import { HERRAMIENTAS_COMPONENT_ID } from './archetypeCardComponents/herramientas/constants';
import { INSPIRACION_COMPONENT_ID } from './archetypeCardComponents/inspiracion/constants';
import { ESTILO_COMPONENT_ID, getEstiloMetadata } from './archetypeCardComponents/estilos';
import type { QuienCharacterId } from './QuienTinderCards/types';

const FONT_SANS = "'Plus Jakarta Sans', sans-serif";

const INPUT_BASE_CLASS =
  'w-full rounded-lg border border-gray-600 bg-gray-800/80 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500';

function getVariantDisplayInfo(
  config: ArchetypeAxisConfig,
  selectedVersionId: string,
  selectedOpt: ArchetypeOption | undefined,
  colorLeft: string,
  colorRight: string
) {
  const accentLeft = selectedOpt?.defaultColorLeft ?? colorLeft;
  const accentRight = selectedOpt?.defaultColorRight ?? colorRight;
  const sectionLabel = config.customOptionLabel ?? config.label ?? 'Variante';

  if (config.componentId === CREATURE_COMPONENT_ID) {
    const creatureId = Number(selectedVersionId) as QuienCharacterId;
    const meta = Number.isFinite(creatureId) ? getCreatureMetadata(creatureId) : undefined;
    return {
      name: meta?.name ?? CREATURE_LABELS[creatureId] ?? '',
      description: meta?.description,
      sectionLabel,
      accentLeft,
      accentRight,
    };
  }
  if (config.componentId === SILHOUETTE_COMPONENT_ID) {
    const silhouetteId = Number(selectedVersionId);
    const meta = Number.isFinite(silhouetteId)
      ? getSilhouetteMetadata(silhouetteId as Parameters<typeof getSilhouetteMetadata>[0])
      : undefined;
    const labels = SILHOUETTE_LABELS as Record<number, string>;
    return {
      name: meta?.name ?? labels[silhouetteId] ?? '',
      description: meta?.characteristics?.join(', '),
      sectionLabel,
      accentLeft,
      accentRight,
    };
  }
  if (config.componentId === 'background') {
    const meta = getBackgroundMetadata(selectedVersionId);
    return {
      name: meta?.name ?? selectedOpt?.label ?? sectionLabel,
      description: meta?.description,
      sectionLabel,
      accentLeft,
      accentRight,
    };
  }
  if (config.componentId === FAMILIAR_COMPONENT_ID) {
    const meta = getFamiliarMetadata(selectedVersionId);
    return {
      name: meta?.name ?? selectedOpt?.label ?? sectionLabel,
      description: meta?.description,
      sectionLabel,
      accentLeft,
      accentRight,
    };
  }
  if (config.componentId === HERRAMIENTAS_COMPONENT_ID) {
    const meta = getHerramientaMetadata(selectedVersionId);
    return {
      name: meta?.name ?? selectedOpt?.label ?? sectionLabel,
      description: meta?.description,
      sectionLabel,
      accentLeft,
      accentRight,
    };
  }
  if (config.componentId === INSPIRACION_COMPONENT_ID) {
    const meta = getInspiracionMetadata(selectedVersionId);
    return {
      name: meta?.name ?? selectedOpt?.label ?? sectionLabel,
      description: meta?.description,
      sectionLabel,
      accentLeft,
      accentRight,
    };
  }
  if (config.componentId === ATMOSPHERE_COMPONENT_ID) {
    const meta = getAtmosphereMetadata(selectedVersionId);
    return {
      name: meta?.name ?? selectedOpt?.label ?? sectionLabel,
      description: meta?.description,
      sectionLabel,
      accentLeft,
      accentRight,
    };
  }
  if (config.componentId === ESTILO_COMPONENT_ID) {
    const estiloId = parseInt(selectedVersionId, 10);
    const meta = Number.isFinite(estiloId) ? getEstiloMetadata(estiloId) : undefined;
    return {
      name: meta?.name ?? selectedOpt?.label ?? sectionLabel,
      description: meta?.description,
      sectionLabel,
      accentLeft,
      accentRight,
    };
  }
  return {
    name: selectedOpt?.label ?? sectionLabel,
    description: undefined as string | undefined,
    sectionLabel,
    accentLeft,
    accentRight,
  };
}

const VariantOptionButton = memo(function VariantOptionButton({
  opt,
  config,
  isSelected,
  onSelect,
  matchType,
}: {
  opt: ArchetypeOption;
  config: ArchetypeAxisConfig;
  isSelected: boolean;
  onSelect: (versionId: string) => void;
  matchType?: 'supermatch' | 'match';
}) {
  const [isHovered, setIsHovered] = useState(false);
  const axisLabel = opt.axisLabel ?? opt.label;
  const [l, r] = parseArchetypeLabel(axisLabel);
  const VariantComponent = getCardComponent(config.componentId, opt.versionId);
  const isBackground = config.componentId === 'background';
  const isCreature = config.componentId === CREATURE_COMPONENT_ID;
  const isSuperMatch = matchType === 'supermatch';
  return (
    <button
      type="button"
      onClick={() => onSelect(opt.versionId)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all overflow-hidden',
        isSelected
          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-200'
          : isSuperMatch
            ? 'border-amber-500/60 bg-amber-500/10 text-amber-200/90 hover:border-amber-500/80 hover:bg-amber-500/15'
            : 'border-gray-600/50 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
      )}
    >
      {isSuperMatch && <ButtonParticles isHovered={isHovered} color="#f59e0b" count={20} intensity="medium" />}
      <div
        className={cn(
          'w-full rounded-lg overflow-hidden shrink-0 flex items-center justify-center relative',
          isBackground && 'aspect-[3/4] min-h-[64px]',
          isCreature && 'aspect-[3/4] min-h-[80px]',
          !isBackground && !isCreature && 'aspect-square min-h-[56px]'
        )}
      >
        {VariantComponent ? (
          <VariantComponent
            versionId={opt.versionId}
            colorLeft={opt.defaultColorLeft ?? config.colorLeft}
            colorRight={opt.defaultColorRight ?? config.colorRight}
            sliderValue={opt.defaultSliderValue ?? 50}
            defaultColorLeft={opt.defaultColorLeft}
            blendedColor={blendHex(
              opt.defaultColorLeft ?? config.colorLeft,
              opt.defaultColorRight ?? config.colorRight,
              (opt.defaultSliderValue ?? 50) / 100
            )}
            className="w-full h-full object-cover"
            hideLabel
          />
        ) : (
          <div
            className="w-full h-full rounded"
            style={{
              background: `linear-gradient(135deg, ${opt.defaultColorLeft ?? config.colorLeft}, ${opt.defaultColorRight ?? config.colorRight})`,
            }}
          />
        )}
      </div>
      <div
        className="flex items-center gap-2 w-full justify-center px-1.5 py-1 rounded-md bg-gray-800/40 border border-gray-700/40"
        title={`${l} — ${r}`}
      >
        <span className="text-[10px] text-gray-400 truncate max-w-[5.5rem] tracking-wide min-w-0">
          {l}
        </span>
        <span className="shrink-0 w-px h-3 bg-gray-600/60 rounded-full" aria-hidden />
        <span className="text-[10px] text-gray-400 truncate max-w-[5.5rem] tracking-wide min-w-0">
          {r}
        </span>
      </div>
    </button>
  );
});

/** Contexto para ordenar criaturas en el modal de Identidad: preselected, SuperMatch/Match, Mismatch. */
export interface CreatureOrderContext {
  preselectedCharacterId: number | null;
  superMatchIds: number[];
  matchIds: number[];
  mismatchIds: number[];
}

/** Contexto para ordenar siluetas en el modal de Identidad. */
export interface SilhouetteOrderContext {
  preselectedSilhouetteId: number | null;
  superMatchIds: number[];
  matchIds: number[];
  mismatchIds: number[];
}

/** Contexto para ordenar estilos en el modal de Estilo (Cómo). */
export interface EstiloOrderContext {
  preselectedEstiloId: number | null;
  superMatchIds: number[];
  matchIds: number[];
  mismatchIds: number[];
}

interface CustomAxisModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ArchetypeAxisConfig;
  state: ArchetypeAxisState;
  onSave: (updates: Partial<ArchetypeAxisState>) => void;
  creatureOrderContext?: CreatureOrderContext;
  silhouetteOrderContext?: SilhouetteOrderContext;
  estiloOrderContext?: EstiloOrderContext;
  preselectedCreatureVersionId?: string;
  preselectedSilhouetteVersionId?: string;
  preselectedEstiloVersionId?: string;
}

export type CreatureSection = 'preselected' | 'match-supermatch' | 'mismatch';

type CreatureOptionWithType = { opt: ArchetypeOption; matchType?: 'supermatch' | 'match' };

function groupCreatureOptions(
  baseOptions: ArchetypeOption[],
  ctx: CreatureOrderContext
): { section: CreatureSection; options: CreatureOptionWithType[] }[] {
  const preselected = baseOptions.filter(
    (o) =>
      o.versionId !== 'custom' &&
      ctx.preselectedCharacterId != null &&
      Number(o.versionId) === ctx.preselectedCharacterId
  );
  const superMatch = baseOptions.filter(
    (o) =>
      o.versionId !== 'custom' &&
      ctx.superMatchIds.includes(Number(o.versionId)) &&
      Number(o.versionId) !== ctx.preselectedCharacterId
  );
  const match = baseOptions.filter(
    (o) =>
      o.versionId !== 'custom' &&
      ctx.matchIds.includes(Number(o.versionId)) &&
      Number(o.versionId) !== ctx.preselectedCharacterId
  );
  const mismatch = baseOptions.filter(
    (o) =>
      o.versionId !== 'custom' &&
      !preselected.includes(o) &&
      !superMatch.includes(o) &&
      !match.includes(o)
  );
  const sections: { section: CreatureSection; options: CreatureOptionWithType[] }[] = [];
  if (preselected.length)
    sections.push({ section: 'preselected', options: preselected.map((opt) => ({ opt })) });
  if (superMatch.length || match.length) {
    const combined = [
      ...superMatch.map((opt) => ({ opt, matchType: 'supermatch' as const })),
      ...match.map((opt) => ({ opt, matchType: 'match' as const })),
    ];
    sections.push({ section: 'match-supermatch', options: combined });
  }
  if (mismatch.length)
    sections.push({ section: 'mismatch', options: mismatch.map((opt) => ({ opt })) });
  return sections;
}

function groupSilhouetteOptions(
  baseOptions: ArchetypeOption[],
  ctx: SilhouetteOrderContext
): { section: CreatureSection; options: CreatureOptionWithType[] }[] {
  const preselected = baseOptions.filter(
    (o) =>
      o.versionId !== 'custom' &&
      ctx.preselectedSilhouetteId != null &&
      Number(o.versionId) === ctx.preselectedSilhouetteId
  );
  const superMatch = baseOptions.filter(
    (o) =>
      o.versionId !== 'custom' &&
      ctx.superMatchIds.includes(Number(o.versionId)) &&
      Number(o.versionId) !== ctx.preselectedSilhouetteId
  );
  const match = baseOptions.filter(
    (o) =>
      o.versionId !== 'custom' &&
      ctx.matchIds.includes(Number(o.versionId)) &&
      Number(o.versionId) !== ctx.preselectedSilhouetteId
  );
  const mismatch = baseOptions.filter(
    (o) =>
      o.versionId !== 'custom' &&
      !preselected.includes(o) &&
      !superMatch.includes(o) &&
      !match.includes(o)
  );
  const sections: { section: CreatureSection; options: CreatureOptionWithType[] }[] = [];
  if (preselected.length)
    sections.push({ section: 'preselected', options: preselected.map((opt) => ({ opt })) });
  if (superMatch.length || match.length) {
    const combined = [
      ...superMatch.map((opt) => ({ opt, matchType: 'supermatch' as const })),
      ...match.map((opt) => ({ opt, matchType: 'match' as const })),
    ];
    sections.push({ section: 'match-supermatch', options: combined });
  }
  if (mismatch.length)
    sections.push({ section: 'mismatch', options: mismatch.map((opt) => ({ opt })) });
  return sections;
}

function groupEstiloOptions(
  baseOptions: ArchetypeOption[],
  ctx: EstiloOrderContext
): { section: CreatureSection; options: CreatureOptionWithType[] }[] {
  const preselected = baseOptions.filter(
    (o) =>
      o.versionId !== 'custom' &&
      ctx.preselectedEstiloId != null &&
      Number(o.versionId) === ctx.preselectedEstiloId
  );
  const superMatch = baseOptions.filter(
    (o) =>
      o.versionId !== 'custom' &&
      ctx.superMatchIds.includes(Number(o.versionId)) &&
      Number(o.versionId) !== ctx.preselectedEstiloId
  );
  const match = baseOptions.filter(
    (o) =>
      o.versionId !== 'custom' &&
      ctx.matchIds.includes(Number(o.versionId)) &&
      Number(o.versionId) !== ctx.preselectedEstiloId
  );
  const mismatch = baseOptions.filter(
    (o) =>
      o.versionId !== 'custom' &&
      !preselected.includes(o) &&
      !superMatch.includes(o) &&
      !match.includes(o)
  );
  const sections: { section: CreatureSection; options: CreatureOptionWithType[] }[] = [];
  if (preselected.length)
    sections.push({ section: 'preselected', options: preselected.map((opt) => ({ opt })) });
  if (superMatch.length || match.length) {
    const combined = [
      ...superMatch.map((opt) => ({ opt, matchType: 'supermatch' as const })),
      ...match.map((opt) => ({ opt, matchType: 'match' as const })),
    ];
    sections.push({ section: 'match-supermatch', options: combined });
  }
  if (mismatch.length)
    sections.push({ section: 'mismatch', options: mismatch.map((opt) => ({ opt })) });
  return sections;
}

export function CustomAxisModal({
  isOpen,
  onClose,
  config,
  state,
  onSave,
  creatureOrderContext,
  silhouetteOrderContext,
  estiloOrderContext,
  preselectedCreatureVersionId,
  preselectedSilhouetteVersionId,
  preselectedEstiloVersionId,
}: CustomAxisModalProps) {
  const baseOptions = getBaseOptions(config.archetypeOptions);
  const isCreatureAxis = config.componentId === CREATURE_COMPONENT_ID;
  const isSilhouetteAxis = config.componentId === SILHOUETTE_COMPONENT_ID;
  const isEstiloAxis = config.componentId === ESTILO_COMPONENT_ID;
  const creatureSections = useMemo(
    () =>
      isCreatureAxis && creatureOrderContext
        ? groupCreatureOptions(baseOptions, creatureOrderContext)
        : null,
    [isCreatureAxis, creatureOrderContext, baseOptions]
  );
  const silhouetteSections = useMemo(
    () =>
      isSilhouetteAxis && silhouetteOrderContext
        ? groupSilhouetteOptions(baseOptions, silhouetteOrderContext)
        : null,
    [isSilhouetteAxis, silhouetteOrderContext, baseOptions]
  );
  const estiloSections = useMemo(
    () =>
      isEstiloAxis && estiloOrderContext
        ? groupEstiloOptions(baseOptions, estiloOrderContext)
        : null,
    [isEstiloAxis, estiloOrderContext, baseOptions]
  );
  const groupedSections = creatureSections ?? silhouetteSections ?? estiloSections;
  const targetVersionId = useMemo(() => {
    if (isCreatureAxis && preselectedCreatureVersionId) {
      return baseOptions.some((o) => o.versionId === preselectedCreatureVersionId)
        ? preselectedCreatureVersionId
        : state.customVersionId;
    }
    if (isSilhouetteAxis && preselectedSilhouetteVersionId) {
      return baseOptions.some((o) => o.versionId === preselectedSilhouetteVersionId)
        ? preselectedSilhouetteVersionId
        : state.customVersionId;
    }
    if (isEstiloAxis && preselectedEstiloVersionId) {
      return baseOptions.some((o) => o.versionId === preselectedEstiloVersionId)
        ? preselectedEstiloVersionId
        : state.customVersionId;
    }
    return state.customVersionId;
  }, [
    isCreatureAxis,
    isSilhouetteAxis,
    isEstiloAxis,
    preselectedCreatureVersionId,
    preselectedSilhouetteVersionId,
    preselectedEstiloVersionId,
    state.customVersionId,
    baseOptions,
  ]);
  const currentBase =
    baseOptions.find((o) => o.versionId === targetVersionId) ?? baseOptions[0];

  const [selectedVersionId, setSelectedVersionId] = useState(currentBase?.versionId ?? '');
  const [labelLeft, setLabelLeft] = useState(state.customLabelLeft ?? '');
  const [labelRight, setLabelRight] = useState(state.customLabelRight ?? '');
  const [colorLeft, setColorLeft] = useState(
    state.colorLeft ?? currentBase?.defaultColorLeft ?? config.colorLeft
  );
  const [colorRight, setColorRight] = useState(
    state.colorRight ?? currentBase?.defaultColorRight ?? config.colorRight
  );

  useEffect(() => {
    if (!isOpen) return;
    const opts = getBaseOptions(config.archetypeOptions);
    const base = opts.find((o) => o.versionId === targetVersionId) ?? opts[0];
    setSelectedVersionId(base?.versionId ?? '');
    const baseAxisLabel = base?.axisLabel ?? base?.label ?? '';
    setLabelLeft(state.customLabelLeft ?? parseArchetypeLabel(baseAxisLabel)[0] ?? '');
    setLabelRight(state.customLabelRight ?? parseArchetypeLabel(baseAxisLabel)[1] ?? '');
    setColorLeft(state.colorLeft ?? base?.defaultColorLeft ?? config.colorLeft);
    setColorRight(state.colorRight ?? base?.defaultColorRight ?? config.colorRight);
  }, [
    isOpen,
    targetVersionId,
    config.archetypeOptions,
    state.customLabelLeft,
    state.customLabelRight,
    state.colorLeft,
    state.colorRight,
    config.colorLeft,
    config.colorRight,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleSave = useCallback(() => {
    const selectedOpt = baseOptions.find((o) => o.versionId === selectedVersionId);
    const defaultSlider = selectedOpt?.defaultSliderValue;
    onSave({
      customVersionId: selectedVersionId,
      customLabelLeft: labelLeft.trim() || undefined,
      customLabelRight: labelRight.trim() || undefined,
      colorLeft,
      colorRight,
      ...(defaultSlider !== undefined && { sliderValue: defaultSlider }),
      hasBeenConfigured: true,
    });
    onClose();
  }, [selectedVersionId, labelLeft, labelRight, colorLeft, colorRight, baseOptions, onSave, onClose]);

  const handleVariantSelect = useCallback((versionId: string) => {
    setSelectedVersionId(versionId);
    const opt = baseOptions.find((o) => o.versionId === versionId);
    if (opt) {
      const axisLabel = opt.axisLabel ?? opt.label;
      const [l, r] = parseArchetypeLabel(axisLabel);
      setLabelLeft(l);
      setLabelRight(r);
      setColorLeft(opt.defaultColorLeft ?? config.colorLeft);
      setColorRight(opt.defaultColorRight ?? config.colorRight);
    }
  }, [baseOptions, config]);

  if (!isOpen) return null;

  const customLabel = config.customOptionLabel ?? 'Mi propio eje';
  const SECTION_LABEL = 'block text-xs font-medium text-gray-400 uppercase tracking-wider';

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-axis-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-5xl max-h-[85vh] flex flex-col rounded-2xl border border-gray-600/60 bg-gray-900 shadow-2xl shadow-black/40 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700/80 bg-gray-800/50">
          <h2 id="custom-axis-title" className="text-lg font-semibold text-gray-100">
            {customLabel}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Elige una variante base y personaliza arquetipos y colores
          </p>
        </div>

        {/* Content: horizontal layout */}
        <div className="flex flex-1 min-h-0 flex-col sm:flex-row overflow-hidden">
          {/* Izquierda: opciones seleccionables (variantes) */}
          <div className="flex-1 min-w-0 p-6 border-b sm:border-b-0 sm:border-r border-gray-700/60 overflow-y-auto">
            <label className={cn(SECTION_LABEL, 'mb-3')}>Variante de contenido</label>
            {groupedSections ? (
              <div className="space-y-5">
                {groupedSections.map(({ section, options }) => (
                  <div key={section}>
                    <p
                      className={cn(
                        'text-xs font-medium mb-2',
                        section === 'preselected' && 'text-indigo-400',
                        section === 'mismatch' && 'text-gray-500'
                      )}
                    >
                      {section === 'preselected' && 'Preseleccionada'}
                      {section === 'match-supermatch' && (
                        <>
                          <span className="text-amber-400">SuperMatch</span>
                          <span className="text-gray-500 mx-1">/</span>
                          <span className="text-teal-400">Match</span>
                        </>
                      )}
                      {section === 'mismatch' && 'Mismatch'}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {options.map(({ opt, matchType }) => (
                        <VariantOptionButton
                          key={opt.versionId}
                          opt={opt}
                          config={config}
                          isSelected={opt.versionId === selectedVersionId}
                          onSelect={handleVariantSelect}
                          matchType={matchType}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {baseOptions.map((opt) => (
                  <VariantOptionButton
                    key={opt.versionId}
                    opt={opt}
                    config={config}
                    isSelected={opt.versionId === selectedVersionId}
                    onSelect={handleVariantSelect}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Derecha: configuraciones y personalizaciones */}
          <div className="flex-1 min-w-0 p-6 space-y-6 overflow-y-auto">
            {/* Nombre y descripción (todos los ejes) */}
            {(() => {
              const selectedOpt = baseOptions.find((o) => o.versionId === selectedVersionId);
              const display = getVariantDisplayInfo(
                config,
                selectedVersionId,
                selectedOpt,
                colorLeft,
                colorRight
              );
              return (
                <div
                  className="relative overflow-hidden rounded-xl p-5 pb-5 mb-1"
                  style={{
                    background: `linear-gradient(135deg, ${display.accentLeft}08 0%, transparent 50%, ${display.accentRight}06 100%)`,
                    borderLeft: `3px solid ${display.accentLeft}`,
                    boxShadow: `inset 0 1px 0 0 ${display.accentLeft}20`,
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 blur-2xl"
                    style={{ background: display.accentLeft }}
                  />
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500 mb-2">
                    {display.sectionLabel}
                  </p>
                  <h3 className="text-2xl font-semibold text-white tracking-tight" style={{ fontFamily: FONT_SANS }}>
                    {display.name || '—'}
                  </h3>
                  {display.description ? (
                    <p className="mt-2.5 text-sm text-gray-400/90 leading-relaxed max-w-md" style={{ fontFamily: FONT_SANS }}>
                      «{display.description}»
                    </p>
                  ) : (
                    <p className="mt-2.5 text-sm text-gray-500/80 italic leading-relaxed max-w-md" style={{ fontFamily: FONT_SANS }}>
                      Descripción pendiente
                    </p>
                  )}
                </div>
              );
            })()}
            {/* Arquetipos y colores */}
            <div className="space-y-4 mt-2">
              <label className={SECTION_LABEL}>Personalizar arquetipos</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Extremo izquierdo</label>
                  <input
                    type="text"
                    value={labelLeft}
                    onChange={(e) => setLabelLeft(e.target.value)}
                    placeholder="Arquetipo izquierdo"
                    className={INPUT_BASE_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 text-right">Extremo derecho</label>
                  <input
                    type="text"
                    value={labelRight}
                    onChange={(e) => setLabelRight(e.target.value)}
                    placeholder="Arquetipo derecho"
                    className={cn(INPUT_BASE_CLASS, 'text-right')}
                  />
                </div>
              </div>

              <label className={cn(SECTION_LABEL, 'block pt-2')}>Personalizar colores</label>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex flex-col items-center gap-2">
                  <input
                    type="color"
                    value={colorLeft}
                    onChange={(e) => setColorLeft(e.target.value)}
                    className="w-12 h-12 rounded-xl border-2 border-gray-500/50 cursor-pointer bg-transparent"
                    title="Color izquierdo"
                  />
                  <span className="text-xs text-gray-500 truncate max-w-[6rem]" title={colorLeft}>
                    {colorLeft}
                  </span>
                </div>
                <div
                  className="flex-1 h-8 rounded-lg border border-gray-600/50"
                  style={{
                    background: `linear-gradient(to right, ${colorLeft}, ${colorRight})`,
                  }}
                />
                <div className="flex flex-col items-center gap-2">
                  <input
                    type="color"
                    value={colorRight}
                    onChange={(e) => setColorRight(e.target.value)}
                    className="w-12 h-12 rounded-xl border-2 border-gray-500/50 cursor-pointer bg-transparent"
                    title="Color derecho"
                  />
                  <span className="text-xs text-gray-500 truncate max-w-[6rem]" title={colorRight}>
                    {colorRight}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700/80 bg-gray-800/30 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
