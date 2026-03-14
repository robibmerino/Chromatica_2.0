import { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { getFallbackAxisOrder, getContentColumnKey, AXIS_CONFIG_BY_ID, type AxisOrderColumnKey } from '../inspiration/archetypeAxesConfig';
import { COLUMN_BUTTON_CONFIG } from '../GuidedPaletteCreator/config/archetypeColumnButtonConfig';
import { getCardComponent } from '../inspiration/archetypeCardComponents/registry';
import { CREATURE_COMPONENT_ID } from '../inspiration/archetypeCardComponents/creatures/constants';
import { getBaseOptions } from '../inspiration/archetypeAxesUtils';
import { blendHex } from '../../utils/colorUtils';
import { cn } from '../../utils/cn';
import type { ArchetypeAxisConfig, ArchetypeOption } from '../inspiration/archetypeAxesTypes';

export type AvatarArchetypeColumn = AxisOrderColumnKey;

/** Por cada axisId, el índice de opción seleccionada (en archetypeOptions). */
export type AvatarAxisSelections = Record<string, number>;

/** Textos del modal de avatar (sin jerga Quién/Qué/Cómo). Cada clave es el botón; el contenido visual es distinto. */
const AVATAR_STEP1_COPY: Record<
  AvatarArchetypeColumn,
  { title: string; description: string }
> = {
  quien: {
    title: '¿Quién eres?',
    description: 'Siluetas y herramientas que te representan',
  },
  que: {
    title: '¿Qué eres?',
    description: 'Criaturas y símbolos de tu naturaleza',
  },
  como: {
    title: '¿Cómo eres?',
    description: 'Estilos e inspiraciones que definen tu mirada',
  },
};

/** Etiquetas cortas por eje en el paso 2 (más amigables que los ids técnicos). */
const AVATAR_AXIS_LABELS: Record<string, string> = {
  'axis-background': 'Fondo',
  'axis-3': 'Figura',
  'axis-3-silhouette': 'Figura',
  'axis-3-estilo': 'Estilo',
  'axis-2': 'Detalle',
  'axis-2-herramientas': 'Detalle',
  'axis-2-inspiracion': 'Inspiración',
  'axis-4': 'Atmósfera',
};

/** Tarjeta solo gráfica (sin texto de ejes): muestra el componente visual de la opción. */
const GraphicOptionCard = memo(function GraphicOptionCard({
  opt,
  config,
  isSelected,
  onSelect,
}: {
  opt: ArchetypeOption;
  config: ArchetypeAxisConfig;
  isSelected: boolean;
  onSelect: (optionIndex: number) => void;
}) {
  const VariantComponent = getCardComponent(config.componentId, opt.versionId);
  const isBackground = config.componentId === 'background';
  const isCreature = config.componentId === CREATURE_COMPONENT_ID;
  const isIdentity =
    config.componentId === CREATURE_COMPONENT_ID ||
    config.componentId === 'silhouette' ||
    config.componentId === 'estilo';
  const optionIndex = config.archetypeOptions.findIndex((o) => o.versionId === opt.versionId);

  return (
    <button
      type="button"
      onClick={() => onSelect(optionIndex >= 0 ? optionIndex : 0)}
      className={cn(
        'relative rounded-xl border-2 transition-all overflow-hidden flex items-center justify-center',
        isSelected ? 'border-violet-500 ring-2 ring-violet-500/40' : 'border-gray-600/50 hover:border-gray-500 bg-gray-800/50'
      )}
    >
      <div
        className={cn(
          'w-full h-full flex items-center justify-center min-h-[56px]',
          isBackground && 'aspect-[3/4] min-h-[64px]',
          isIdentity && 'aspect-[3/4] min-h-[72px]',
          !isBackground && !isIdentity && 'aspect-square'
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
    </button>
  );
});

interface AvatarPersonalizationModalProps {
  open: boolean;
  onClose: () => void;
  initialColumn: AvatarArchetypeColumn | null;
  initialSelections: AvatarAxisSelections;
  onSave: (column: AvatarArchetypeColumn, selections: AvatarAxisSelections) => void | Promise<void>;
  saving?: boolean;
}

export function AvatarPersonalizationModal({
  open,
  onClose,
  initialColumn,
  initialSelections,
  onSave,
  saving = false,
}: AvatarPersonalizationModalProps) {
  const [column, setColumn] = useState<AvatarArchetypeColumn | null>(initialColumn);
  const [selections, setSelections] = useState<AvatarAxisSelections>(() => {
    if (initialColumn) {
      const order = getFallbackAxisOrder(initialColumn);
      const next: AvatarAxisSelections = {};
      const identityId = order[0];
      const detailId = order[2];
      order.forEach((axisId) => {
        next[axisId] = initialSelections[axisId] ?? 0;
      });
      if (identityId && detailId && (next[identityId] ?? 0) >= 0 && (next[detailId] ?? 0) >= 0) {
        next[detailId] = -1;
      }
      return next;
    }
    return { ...initialSelections };
  });

  const axisOrder = useMemo(() => (column ? getFallbackAxisOrder(column) : []), [column]);
  const axisConfigs = useMemo(
    () => axisOrder.map((id) => AXIS_CONFIG_BY_ID.get(id)).filter(Boolean) as ArchetypeAxisConfig[],
    [axisOrder]
  );

  const handleSelectColumn = (buttonKey: AvatarArchetypeColumn) => {
    const contentKey = getContentColumnKey(buttonKey);
    setColumn(contentKey);
    const order = getFallbackAxisOrder(contentKey);
    const next: AvatarAxisSelections = {};
    const identityId = order[0];
    const detailId = order[2];
    order.forEach((axisId) => {
      next[axisId] = selections[axisId] ?? 0;
    });
    if (identityId && detailId && (next[identityId] ?? 0) >= 0 && (next[detailId] ?? 0) >= 0) {
      next[detailId] = -1;
    }
    setSelections(next);
  };

  const handleBack = () => setColumn(null);

  const handleSave = () => {
    if (column) void onSave(column, selections);
  };

  const handleOptionSelect = (axisId: string, optionIndex: number) => {
    setSelections((prev) => ({ ...prev, [axisId]: optionIndex }));
  };

  /** Ejes de identidad y detalle (índices 0 y 2 en axisOrder). -1 = no mostrar. */
  const identityAxisId = axisOrder[0] ?? null;
  const detailAxisId = axisOrder[2] ?? null;
  const identityConfig = identityAxisId ? AXIS_CONFIG_BY_ID.get(identityAxisId) : null;
  const detailConfig = detailAxisId ? AXIS_CONFIG_BY_ID.get(detailAxisId) : null;

  const combinedOptions = useMemo(() => {
    if (!identityConfig || !detailConfig) return [];
    const identityOpts = getBaseOptions(identityConfig.archetypeOptions).map((opt, i) => ({
      opt,
      config: identityConfig,
      axisId: identityAxisId!,
      optionIndexInAxis: identityConfig.archetypeOptions.findIndex((o) => o.versionId === opt.versionId),
    }));
    const detailOpts = getBaseOptions(detailConfig.archetypeOptions).map((opt) => ({
      opt,
      config: detailConfig,
      axisId: detailAxisId!,
      optionIndexInAxis: detailConfig.archetypeOptions.findIndex((o) => o.versionId === opt.versionId),
    }));
    return [...identityOpts, ...detailOpts].filter((x) => x.optionIndexInAxis >= 0);
  }, [identityConfig, detailConfig, identityAxisId, detailAxisId]);

  const handleCombinedSelect = (axisId: string, optionIndex: number) => {
    setSelections((prev) => {
      const next = { ...prev };
      next[axisId] = optionIndex;
      next[axisId === identityAxisId ? detailAxisId! : identityAxisId!] = -1;
      return next;
    });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="rounded-2xl border border-gray-600/60 bg-gray-900 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          <div className="relative flex items-center justify-between px-5 py-4 border-b border-gray-700/50 shrink-0">
            {column ? (
              <button
                type="button"
                onClick={handleBack}
                className="relative z-10 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
            ) : (
              <span className="relative z-10 w-10" aria-hidden />
            )}
            <h2 className="absolute left-0 right-0 text-center text-lg font-semibold text-white pointer-events-none">
              {column ? 'Componer tu avatar' : 'Personaliza tu Avatar'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="relative z-10 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {!column ? (
              <>
                <p className="text-sm text-gray-400/90 mb-5 text-center">
                  Elige bando
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['quien', 'que', 'como'] as const).map((key) => {
                    const config = COLUMN_BUTTON_CONFIG[key];
                    const copy = AVATAR_STEP1_COPY[key];
                    const fillBg =
                      key === 'quien'
                        ? 'bg-gradient-to-br from-amber-800/35 to-orange-800/28'
                        : key === 'que'
                          ? 'bg-gradient-to-br from-blue-800/35 to-cyan-800/28'
                          : 'bg-gradient-to-br from-violet-800/35 to-purple-800/28';
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectColumn(key)}
                        className={cn(
                          'group rounded-xl border-2 p-5 flex flex-col items-center justify-center text-center transition-all duration-200',
                          config.borderColor,
                          fillBg,
                          'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                        )}
                      >
                        <div
                          className={cn(
                            'w-14 h-14 rounded-xl flex items-center justify-center mb-3 [&_svg]:w-10 [&_svg]:h-10 [&_svg]:transition-transform [&_svg]:duration-200 group-hover:[&_svg]:scale-110',
                            config.iconBg
                          )}
                        >
                          {config.icon}
                        </div>
                        <p className={cn('font-semibold', config.textColor)}>{copy.title}</p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{copy.description}</p>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-400/90 mb-4 text-center">
                  Personaliza tus variantes (elige una opción por bloque)
                </p>
                {/* Figura o Detalle (o Estilo o Inspiración en Cómo): un solo selector, solo una opción activa */}
                {identityAxisId && detailAxisId && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">
                      {column === 'como' ? 'Estilo o Inspiración' : 'Figura o Detalle'}
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {combinedOptions.map((item) => {
                        const isSelected =
                          selections[item.axisId] === item.optionIndexInAxis &&
                          selections[item.axisId === identityAxisId ? detailAxisId : identityAxisId] === -1;
                        return (
                          <GraphicOptionCard
                            key={`${item.axisId}-${item.opt.versionId}`}
                            opt={item.opt}
                            config={item.config}
                            isSelected={isSelected}
                            onSelect={() => handleCombinedSelect(item.axisId, item.optionIndexInAxis)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Fondo y Atmósfera: selectores independientes */}
                {axisConfigs
                  .filter((config) => config.id === 'axis-background' || config.id === 'axis-4')
                  .map((config) => {
                    const baseOptions = getBaseOptions(config.archetypeOptions);
                    const selectedIndex = selections[config.id] ?? 0;
                    const sectionLabel = AVATAR_AXIS_LABELS[config.id] ?? config.label;
                    return (
                      <div key={config.id}>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">{sectionLabel}</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                          {baseOptions.map((opt) => {
                            const idx = config.archetypeOptions.findIndex((o) => o.versionId === opt.versionId);
                            const isSelected = idx >= 0 && selectedIndex === idx;
                            return (
                              <GraphicOptionCard
                                key={opt.versionId}
                                opt={opt}
                                config={config}
                                isSelected={isSelected}
                                onSelect={(i) => handleOptionSelect(config.id, i)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
          </div>

          <div className="flex gap-3 px-5 py-4 border-t border-gray-700/50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!column || saving}
              className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium transition-colors"
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
