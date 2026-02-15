import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PosterVariant } from '../types/palette';
import { buildColorPaletteFromHarmony } from '../types/palette';
import { getContrastColor } from '../utils/colorUtils';
import type { SupportPaletteRole } from './GuidedPaletteCreator/hooks/useGuidedPalette';

interface PosterExamplesProps {
  colors: string[];
  compact?: boolean;
  /** 'preview-first': póster en marco arriba, selector de estilos debajo integrado (para Armonía de color) */
  layout?: 'default' | 'preview-first';
  /** Overrides de paleta de apoyo por variante (desde Refinar); si se pasan, la vista previa los aplica. */
  supportOverridesByVariant?: Record<PosterVariant, Partial<Record<SupportPaletteRole, string>>>;
}

type PosterStyle = 'poster' | 'branding' | 'arquitectura';

const POSTER_STYLES: { id: PosterStyle; name: string; icon: string }[] = [
  { id: 'poster', name: 'Poster', icon: '■' },
  { id: 'branding', name: 'Branding', icon: '◯' },
  { id: 'arquitectura', name: 'Arquitectura', icon: '◇' },
];

/** Aplica overrides de paleta de apoyo al objeto colors de una ColorPalette (solo claves que existan). */
function applySupportOverrides<T extends Record<string, string>>(
  col: T,
  overrides?: Partial<Record<string, string>>
): T {
  if (!overrides || Object.keys(overrides).length === 0) return col;
  return { ...col, ...overrides } as T;
}

const PosterExamples: React.FC<PosterExamplesProps> = ({
  colors,
  compact = false,
  layout = 'default',
  supportOverridesByVariant,
}) => {
  const [activeStyle, setActiveStyle] = useState<PosterStyle>('poster');
  const [posterVariant, setPosterVariant] = useState<PosterVariant>('claro');
  const [brandingVariant, setBrandingVariant] = useState<PosterVariant>('claro');
  const [arquitecturaVariant, setArquitecturaVariant] = useState<PosterVariant>('claro');
  const [hoveredLegendItem, setHoveredLegendItem] = useState<{ label: string; color: string; initial: string } | null>(null);

  useEffect(() => {
    if (activeStyle !== 'poster' && activeStyle !== 'branding' && activeStyle !== 'arquitectura') setHoveredLegendItem(null);
  }, [activeStyle]);

  /** Paleta para Branding: mismo sistema que Poster; surface = sobrefondo2 cuando 5+ colores (un solo slot = sobrefondo 2); getters At para 50%. */
  const getBrandingPalette = (variant: PosterVariant) => {
    const palette = buildColorPaletteFromHarmony(colors, variant);
    const col = applySupportOverrides(palette.colors, supportOverridesByVariant?.[variant]);
    const hasP2 = !!col.primario2;
    return {
      background: col.fondo,
      surface: hasP2 ? (col.sobrefondo2 ?? col.sobrefondo) : col.sobrefondo,
      primary: col.primario,
      primaryAt: (i: number) => (i % 2 === 0 ? col.primario : (col.primario2 ?? col.primario)),
      secondaryAt: (i: number) => (i % 2 === 0 ? col.secondario : (col.secondario2 ?? col.secondario)),
      accentAt: (i: number, total: number) =>
        total === 1 ? col.acento : (i % 2 === 0 ? col.acento : (col.acento3 ?? col.acento)),
      accent2At: (i: number, total: number) =>
        total === 1 ? col.apagado : (i % 2 === 0 ? col.apagado : (col.acento4 ?? col.apagado)),
      accent: col.acento,
      secondary: col.secondario,
      text: col.texto,
      textLight: col['texto fino'],
      muted: col.línea,
    };
  };

  /** Branding: formato inspirado en brand sheet (hero, patrones, paleta, logo system, mockup). Leyenda igual que Poster. */
  const renderBrandingPoster = (variant: PosterVariant) => {
    const c = getBrandingPalette(variant);
    const patternId = `branding-diag-${variant}`;
    return (
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          backgroundColor: c.background,
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {/* Franja acento izquierda */}
        <div
          className="absolute top-0 left-0 h-full w-[3px]"
          style={{ backgroundColor: c.accentAt(0, 18) }}
        />

        <div className="relative flex h-full flex-col pl-[3px]">
          {/* SECTION 1 — Hero + wordmark (35%) */}
          <div
            className="relative overflow-hidden"
            style={{ backgroundColor: c.primaryAt(0), height: '35%' }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 170,
                height: 170,
                right: -48,
                top: -42,
                backgroundColor: c.secondaryAt(0),
                opacity: 0.35,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 98,
                height: 98,
                right: 18,
                top: 10,
                backgroundColor: c.accentAt(1, 18),
                opacity: 0.18,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 33,
                height: 33,
                right: 60,
                top: 40,
                backgroundColor: c.accentAt(2, 18),
                opacity: 0.6,
              }}
            />
            <div
              className="absolute"
              style={{
                width: 66,
                height: 1.5,
                left: 20,
                top: '55%',
                backgroundColor: c.accentAt(3, 18),
                opacity: 0.4,
              }}
            />
            <svg className="absolute" style={{ left: 14, top: 10, opacity: 0.1 }} width="48" height="48">
              {Array.from({ length: 5 }).map((_, row) =>
                Array.from({ length: 5 }).map((_, col) => (
                  <circle
                    key={`bg-${row}-${col}`}
                    cx={col * 11 + 3}
                    cy={row * 11 + 3}
                    r="1.5"
                    fill={c.background}
                  />
                ))
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="text-[28px] sm:text-[32px] font-black tracking-tight leading-none"
                style={{
                  color: c.background,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Chromatica<span style={{ color: c.accentAt(4, 18) }}>.</span>
              </div>
            </div>
          </div>

          {/* SECTION 2 — Patrones */}
          <div className="px-3 pl-4 pt-2">
            <div className="grid grid-cols-3 gap-1.5">
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ backgroundColor: c.surface, aspectRatio: '1 / 1' }}
              >
                <svg className="absolute inset-0 h-full w-full">
                  {Array.from({ length: 6 }).map((_, row) =>
                    Array.from({ length: 6 }).map((_, col) => (
                      <circle
                        key={`p1-${row}-${col}`}
                        cx={col * 8 + 4}
                        cy={row * 8 + 4}
                        r={row % 2 === col % 2 ? 1.6 : 0.8}
                        fill={c.primaryAt(1)}
                        opacity={row % 2 === col % 2 ? 0.4 : 0.12}
                      />
                    ))
                  )}
                </svg>
              </div>
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ backgroundColor: c.primaryAt(2), aspectRatio: '1 / 1' }}
              >
                <svg className="absolute inset-0 h-full w-full">
                  <defs>
                    <pattern
                      id={patternId}
                      x="0"
                      y="0"
                      width="8"
                      height="8"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      <line x1="0" y1="0" x2="0" y2="8" stroke={c.accentAt(5, 18)} strokeWidth="0.8" opacity="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#${patternId})`} />
                </svg>
                <div
                  className="absolute rounded-full"
                  style={{
                    width: 28,
                    height: 28,
                    right: 6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: c.accentAt(6, 18),
                    opacity: 0.2,
                  }}
                />
              </div>
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ backgroundColor: c.surface, aspectRatio: '1 / 1' }}
              >
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMinYMax meet">
                  {[15, 27, 38, 50].map((r, i) => (
                    <circle
                      key={`arc-${i}`}
                      cx="0"
                      cy="100%"
                      r={r}
                      fill="none"
                      stroke={c.primaryAt(3)}
                      strokeWidth="0.8"
                      opacity={0.1 + i * 0.05}
                    />
                  ))}
                  {[
                    { x: 50, y: 6 },
                    { x: 60, y: 16 },
                    { x: 50, y: 26 },
                  ].map((pos, i) => (
                    <rect
                      key={`sq-${i}`}
                      x={pos.x}
                      y={pos.y}
                      width="5"
                      height="5"
                      rx="1"
                      fill={c.accentAt(7 + i, 18)}
                      opacity={0.2 + i * 0.15}
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* SECTION 3 — Paleta de color */}
          <div className="px-3 pl-4 pt-2">
            <div className="flex gap-1">
              {[
                { color: c.primaryAt(4), label: c.primary },
                { color: c.secondaryAt(1), label: c.secondary },
                { color: c.accentAt(9, 18), label: c.accent },
                { color: c.background, label: c.background, border: true },
                { color: c.surface, label: c.surface, border: true },
              ].map(({ color, label, border }, i) => (
                <div key={i} className="flex-1 min-w-0">
                  <div
                    className="rounded-md relative overflow-hidden"
                    style={{
                      backgroundColor: color,
                      aspectRatio: '1.5 / 1',
                      ...(border ? { boxShadow: `inset 0 0 0 1px ${c.muted}` } : {}),
                    }}
                  />
                  <div
                    className="mt-0.5 truncate text-[5px] font-mono font-semibold"
                    style={{ color: c.text }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4 — Logo system */}
          <div className="px-3 pl-4 pt-2">
            <div className="grid grid-cols-4 gap-1">
              <div
                className="relative overflow-hidden rounded-lg flex items-center justify-center"
                style={{ backgroundColor: c.surface, aspectRatio: '1 / 1' }}
              >
                <div className="relative">
                  <div
                    className="h-8 w-8 rounded-xl"
                    style={{ backgroundColor: c.primaryAt(5), opacity: 0.12 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: c.primaryAt(6) }}
                    />
                  </div>
                  <div
                    className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded"
                    style={{ backgroundColor: c.accentAt(10, 18) }}
                  />
                </div>
              </div>
              <div
                className="rounded-lg flex items-center justify-center"
                style={{ backgroundColor: c.primaryAt(7), aspectRatio: '1 / 1' }}
              >
                <div
                  className="text-[10px] font-black tracking-tight leading-none"
                  style={{ color: c.background, fontFamily: "'Playfair Display', serif" }}
                >
                  Ch<span style={{ color: c.accentAt(11, 18) }}>.</span>
                </div>
              </div>
              <div
                className="rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: c.background,
                  aspectRatio: '1 / 1',
                  boxShadow: `inset 0 0 0 1px ${c.muted}`,
                }}
              >
                <div
                  className="text-[10px] font-black tracking-tight leading-none"
                  style={{ color: c.text, fontFamily: "'Playfair Display', serif" }}
                >
                  Ch<span style={{ color: c.accentAt(12, 18) }}>.</span>
                </div>
              </div>
              <div
                className="rounded-lg flex items-center justify-center"
                style={{ backgroundColor: c.accentAt(13, 18), aspectRatio: '1 / 1' }}
              >
                <div
                  className="text-[10px] font-black tracking-tight leading-none"
                  style={{ color: c.primaryAt(8), fontFamily: "'Playfair Display', serif" }}
                >
                  Ch<span style={{ color: c.background, opacity: 0.7 }}>.</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5 — Mockup tarjeta */}
          <div className="px-3 pl-4 pt-2 pb-3 flex-1 min-h-0 flex flex-col">
            <div className="grid grid-cols-2 gap-1.5 flex-1 min-h-0">
              <div
                className="relative overflow-hidden rounded-xl"
                style={{ backgroundColor: c.primaryAt(9) }}
              >
                <div
                  className="absolute rounded-full"
                  style={{
                    width: 32,
                    height: 32,
                    right: -8,
                    bottom: -8,
                    backgroundColor: c.accentAt(14, 18),
                    opacity: 0.2,
                  }}
                />
                <div className="relative flex h-full flex-col justify-between p-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="flex h-4 w-4 items-center justify-center rounded-md"
                      style={{ backgroundColor: c.accentAt(15, 18), opacity: 0.85 }}
                    >
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.primaryAt(10) }} />
                    </div>
                    <span
                      className="text-[8px] font-black tracking-tight"
                      style={{ color: c.background, fontFamily: "'Playfair Display', serif" }}
                    >
                      Ch<span style={{ color: c.accentAt(16, 18) }}>.</span>
                    </span>
                  </div>
                  <div className="text-[6px] font-semibold" style={{ color: c.background, opacity: 0.9 }}>
                    chromatica.design
                  </div>
                </div>
              </div>
              <div
                className="relative overflow-hidden rounded-xl"
                style={{ backgroundColor: c.surface, boxShadow: `inset 0 0 0 1px ${c.muted}` }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: c.accentAt(17, 18) }}
                />
                <div className="relative flex h-full flex-col items-center justify-center p-2">
                  <div className="relative">
                    <div
                      className="h-9 w-9 rounded-xl"
                      style={{ backgroundColor: c.primaryAt(11), opacity: 0.08 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: c.primaryAt(12), opacity: 0.6 }}
                      />
                    </div>
                    <div
                      className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded"
                      style={{ backgroundColor: c.accentAt(17, 18), opacity: 0.6 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /** Paleta para el póster: con 5+ colores, surface = sobrefondo2 (un solo slot); primaryAt/secondaryAt/accentAt/accent2At reparten 50% cuando hay variantes; si solo hay un uso de acento/acento2 se usa el base. */
  const getPosterPalette = () => {
    const palette = buildColorPaletteFromHarmony(colors, posterVariant);
    const col = applySupportOverrides(palette.colors, supportOverridesByVariant?.[posterVariant]);
    const hasP2 = !!col.primario2;
    return {
      background: col.fondo,
      surface: hasP2 ? (col.sobrefondo2 ?? col.sobrefondo) : col.sobrefondo,
      text: col.texto,
      textLight: col['texto fino'],
      line: col.línea,
      yearColor: col.apagado,
      primaryAt: (i: number) => (i % 2 === 0 ? col.primario : (col.primario2 ?? col.primario)),
      secondaryAt: (i: number) => (i % 2 === 0 ? col.secondario : (col.secondario2 ?? col.secondario)),
      accentAt: (i: number, total: number) =>
        total === 1 ? col.acento : (i % 2 === 0 ? col.acento : (col.acento3 ?? col.acento)),
      accent2At: (i: number, total: number) =>
        total === 1 ? col.apagado : (i % 2 === 0 ? col.apagado : (col.acento4 ?? col.apagado)),
    };
  };

  const renderPosterMini = () => {
    const c = getPosterPalette();
    return (
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          backgroundColor: c.background,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Background decoration: círculo con secondario, más intensidad para diferenciar del fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-[0.18]"
            style={{ backgroundColor: c.secondaryAt(0) }}
          />
          <div
            className="absolute top-0 left-0 h-full w-[3px]"
            style={{ backgroundColor: c.secondaryAt(1) }}
          />
          <div
            className="absolute top-1/2 left-0 h-px w-full opacity-5"
            style={{ backgroundColor: c.text }}
          />
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between p-4 pl-5 sm:p-6 sm:pl-8">
          {/* Top — Category tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: c.secondaryAt(2) }}
              />
              <span
                className="text-[8px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: c.textLight, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                BRANDING UPV
              </span>
            </div>
            <span
              className="text-[8px] font-bold uppercase tracking-[0.1em]"
              style={{ color: c.yearColor, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              2026
            </span>
          </div>

          {/* Title block: acento solo en "CHROMATICA" */}
          <div className="my-auto">
            <div className="mb-3 sm:mb-4">
              <h1
                className="text-2xl sm:text-3xl font-black leading-[0.9] tracking-tight"
                style={{ color: c.text, fontFamily: "'Playfair Display', serif" }}
              >
                Creative
              </h1>
              <h1
                className="text-2xl sm:text-3xl font-black italic leading-[0.9] tracking-tight"
                style={{ color: c.accentAt(0, 2), fontFamily: "'Playfair Display', serif" }}
              >
                Chromatica
              </h1>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <div
                className="mt-1.5 h-[2px] w-8 flex-shrink-0"
                style={{ backgroundColor: c.secondaryAt(3) }}
              />
              <p
                className="max-w-[180px] text-[9px] sm:text-[10px] font-semibold leading-relaxed"
                style={{ color: c.textLight }}
              >
                Herramientas de color y paletas para tu diseño.
              </p>
            </div>
          </div>

          {/* Info block */}
          <div>
            <div
              className="mb-3 sm:mb-4 flex items-center justify-between rounded-lg px-3 py-2.5 sm:px-4 sm:py-3"
              style={{ backgroundColor: c.surface }}
            >
              <div>
                <div
                  className="text-[7px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: c.textLight }}
                >
                  Date
                </div>
                <div
                  className="mt-0.5 text-sm sm:text-base font-extrabold tracking-tight"
                  style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  OCT 15–18
                </div>
              </div>
              <div
                className="h-6 w-px flex-shrink-0"
                style={{ backgroundColor: c.line }}
              />
              <div className="text-right">
                <div
                  className="text-[7px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: c.textLight }}
                >
                  Location
                </div>
                <div
                  className="mt-0.5 text-[10px] sm:text-xs font-semibold"
                  style={{ color: c.text }}
                >
                  UPV
                </div>
              </div>
            </div>
            <div
              className="flex items-center justify-between border-t pt-2.5 sm:pt-3"
              style={{ borderColor: c.line }}
            >
              <div>
                <div
                  className="text-xs sm:text-sm font-bold tracking-tight"
                  style={{ color: c.text, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  BRD/26
                </div>
                <div
                  className="text-[6px] sm:text-[7px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: c.textLight }}
                >
                  chromatica.design
                </div>
              </div>
              <div
                className="flex h-6 sm:h-7 items-center rounded-full px-3 text-[7px] font-bold uppercase tracking-[0.1em]"
                style={{ backgroundColor: c.accentAt(1, 2), color: getContrastColor(c.accentAt(1, 2)) }}
              >
                Register
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /** Paleta para Arquitectura: mismo sistema que Poster/Branding; surface = sobrefondo2 cuando 5+; getters At para 50%. */
  const getArquitecturaPalette = (variant: PosterVariant) => {
    const palette = buildColorPaletteFromHarmony(colors, variant);
    const col = applySupportOverrides(palette.colors, supportOverridesByVariant?.[variant]);
    const hasP2 = !!col.primario2;
    return {
      background: col.fondo,
      surface: hasP2 ? (col.sobrefondo2 ?? col.sobrefondo) : col.sobrefondo,
      primaryAt: (i: number) => (i % 2 === 0 ? col.primario : (col.primario2 ?? col.primario)),
      secondaryAt: (i: number) => (i % 2 === 0 ? col.secondario : (col.secondario2 ?? col.secondario)),
      accentAt: (i: number, total: number) =>
        total === 1 ? col.acento : (i % 2 === 0 ? col.acento : (col.acento3 ?? col.acento)),
      accent2At: (i: number, total: number) =>
        total === 1 ? col.apagado : (i % 2 === 0 ? col.apagado : (col.acento4 ?? col.apagado)),
      primary: col.primario,
      secondary: col.secondario,
      accent: col.acento,
      text: col.texto,
      textLight: col['texto fino'],
      muted: col.línea,
    };
  };

  /** Arquitectura: escena interior (referencia InteriorMiniPreview) con paleta claro/oscuro. Índices: primary 0-12, secondary 0-14, accent 0-14. */
  const renderArquitecturaPoster = (variant: PosterVariant) => {
    const c = getArquitecturaPalette(variant);
    const { background, surface, muted } = c;
    const totalAccent = 15;
    return (
      <div
        className="w-full h-full flex flex-col overflow-hidden rounded-lg"
        style={{
          background,
          fontFamily: "'Space Grotesk', sans-serif",
          borderLeft: `3px solid ${c.accentAt(0, totalAccent)}`,
        }}
      >
        {/* Room scene */}
        <div className="flex-1 min-h-0 flex flex-col p-2 pb-1">
          <div className="flex-1 min-h-0 relative" style={{ aspectRatio: '376/260' }}>
            <svg viewBox="0 0 376 260" className="w-full h-full" style={{ display: 'block', borderRadius: 6, overflow: 'hidden' }}>
              <rect x="0" y="0" width="376" height="180" fill={surface} />
              <rect x="0" y="174" width="376" height="6" fill={muted} opacity="0.4" />
              <rect x="0" y="180" width="376" height="80" fill={muted} opacity="0.25" />
              {Array.from({ length: 14 }).map((_, i) =>
                Array.from({ length: 4 }).map((_, j) => (
                  <rect key={`f${i}-${j}`} x={i * 28} y={180 + j * 20} width="26" height="9" fill={j % 2 === 0 ? muted : surface} opacity={j % 2 === 0 ? 0.12 : 0.15} />
                ))
              )}
              <ellipse cx="188" cy="238" rx="140" ry="12" fill={c.primaryAt(0)} opacity="0.06" />
              {/* Wall art left */}
              <rect x="28" y="28" width="64" height="85" rx="3" fill={background} stroke={muted} strokeWidth="1.5" opacity="0.8" />
              <circle cx="60" cy="58" r="20" fill={c.accentAt(1, totalAccent)} opacity="0.7" />
              <rect x="42" y="68" width="28" height="28" rx="2" fill={c.primaryAt(1)} opacity="0.5" />
              <line x1="45" y1="48" x2="78" y2="92" stroke={c.secondaryAt(0)} strokeWidth="2" opacity="0.5" />
              <circle cx="72" cy="80" r="10" fill={c.secondaryAt(1)} opacity="0.4" />
              {/* Wall art right */}
              <rect x="295" y="35" width="55" height="55" rx="3" fill={background} stroke={muted} strokeWidth="1.5" opacity="0.8" />
              <circle cx="322" cy="62" r="18" fill={c.primaryAt(2)} opacity="0.5" />
              <rect x="312" y="52" width="20" height="20" fill={c.accentAt(2, totalAccent)} opacity="0.4" transform="rotate(15, 322, 62)" />
              {/* Pendant lamp */}
              <line x1="230" y1="0" x2="230" y2="34" stroke={muted} strokeWidth="1.2" />
              <path d="M 216 34 Q 223 30 230 34 Q 237 30 244 34 L 241 52 Q 230 56 219 52 Z" fill={c.accentAt(3, totalAccent)} opacity="0.85" />
              <ellipse cx="230" cy="68" rx="35" ry="18" fill={c.accentAt(4, totalAccent)} opacity="0.06" />
              {/* Shelf */}
              <rect x="125" y="42" width="90" height="4" rx="1.5" fill={c.secondaryAt(2)} opacity="0.7" />
              <rect x="129" y="20" width="9" height="22" rx="1" fill={c.primaryAt(3)} opacity="0.8" />
              <rect x="140" y="24" width="7" height="18" rx="1" fill={c.accentAt(5, totalAccent)} opacity="0.7" />
              <rect x="149" y="22" width="10" height="20" rx="1" fill={c.secondaryAt(3)} opacity="0.6" />
              <rect x="161" y="26" width="7" height="16" rx="1" fill={muted} opacity="0.5" />
              <rect x="170" y="23" width="8" height="19" rx="1" fill={c.primaryAt(4)} opacity="0.5" />
              <rect x="190" y="33" width="7" height="9" rx="2" fill={muted} opacity="0.6" />
              <circle cx="193" cy="30" r="7" fill={c.accentAt(6, totalAccent)} opacity="0.5" />
              {/* Floor lamp */}
              <rect x="40" y="125" width="3" height="55" rx="1.5" fill={muted} opacity="0.6" />
              <rect x="33" y="175" width="17" height="4" rx="2" fill={muted} opacity="0.5" />
              <ellipse cx="41" cy="121" rx="13" ry="16" fill={surface} stroke={c.secondaryAt(4)} strokeWidth="1" opacity="0.8" />
              {/* Sofa */}
              <rect x="95" y="150" width="180" height="35" rx="7" fill={c.primaryAt(5)} />
              <rect x="99" y="128" width="172" height="28" rx="7" fill={c.primaryAt(6)} opacity="0.85" />
              <rect x="107" y="153" width="160" height="10" rx="4" fill={background} opacity="0.15" />
              <rect x="93" y="135" width="16" height="50" rx="7" fill={c.primaryAt(7)} opacity="0.9" />
              <rect x="261" y="135" width="16" height="50" rx="7" fill={c.primaryAt(8)} opacity="0.9" />
              <rect x="109" y="134" width="42" height="20" rx="6" fill={c.accentAt(7, totalAccent)} opacity="0.75" />
              <rect x="215" y="134" width="38" height="20" rx="6" fill={c.secondaryAt(5)} opacity="0.6" />
              <rect x="163" y="136" width="36" height="17" rx="5" fill={c.accentAt(8, totalAccent)} opacity="0.4" />
              <rect x="110" y="185" width="4" height="8" rx="1.5" fill={c.secondaryAt(6)} opacity="0.6" />
              <rect x="256" y="185" width="4" height="8" rx="1.5" fill={c.secondaryAt(7)} opacity="0.6" />
              {/* Coffee table */}
              <rect x="145" y="205" width="95" height="6" rx="3" fill={c.secondaryAt(8)} opacity="0.8" />
              <rect x="156" y="211" width="3" height="13" rx="1" fill={c.secondaryAt(9)} opacity="0.5" />
              <rect x="226" y="211" width="3" height="13" rx="1" fill={c.secondaryAt(10)} opacity="0.5" />
              <rect x="160" y="196" width="24" height="9" rx="1.5" fill={muted} opacity="0.5" />
              <circle cx="210" cy="200" r="6" fill={c.accentAt(9, totalAccent)} opacity="0.5" />
              {/* Side table */}
              <rect x="302" y="170" width="35" height="4" rx="2" fill={c.secondaryAt(11)} opacity="0.7" />
              <rect x="317" y="174" width="4" height="18" rx="1.5" fill={c.secondaryAt(12)} opacity="0.5" />
              <rect x="310" y="156" width="10" height="14" rx="3" fill={muted} opacity="0.6" />
              <circle cx="315" cy="150" r="10" fill={c.accentAt(10, totalAccent)} opacity="0.5" />
              <circle cx="320" cy="146" r="7" fill={c.secondaryAt(13)} opacity="0.35" />
              {/* Rug */}
              <rect x="110" y="222" width="160" height="30" rx="4" fill={c.primaryAt(9)} opacity="0.1" />
              <rect x="118" y="226" width="144" height="22" rx="3" fill="none" stroke={c.primaryAt(10)} strokeWidth="0.8" opacity="0.12" />
              {Array.from({ length: 5 }).map((_, i) => (
                <circle key={`rug${i}`} cx={135 + i * 24} cy={237} r="2.5" fill={c.accentAt(11 + i, totalAccent)} opacity="0.12" />
              ))}
            </svg>
          </div>
        </div>

        {/* Material palette */}
        <div className="px-2 pb-1.5">
          <div className="flex gap-1">
            {[
              { color: c.primaryAt(11), flex: 2 },
              { color: c.secondaryAt(14), flex: 1.5 },
              { color: c.accentAt(14, totalAccent), flex: 1.5 },
              { color: surface, flex: 1 },
              { color: muted, flex: 1 },
            ].map((m, i) => (
              <div key={i} style={{ flex: m.flex }}>
                <div
                  className="rounded-md"
                  style={{
                    height: 22,
                    background: m.color,
                    border: m.color === background ? `1px solid ${muted}` : 'none',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Textures */}
        <div className="px-2 pb-1.5 flex gap-1">
          <div className="flex-1 rounded-md overflow-hidden relative" style={{ height: 26, background: c.primaryAt(12) }}>
            <svg className="absolute inset-0 w-full h-full">
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={`vl${i}`} x1={i * 5} y1="0" x2={i * 5} y2="40" stroke={background} strokeWidth="0.4" opacity="0.2" />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={`hl${i}`} x1="0" y1={i * 5} x2="140" y2={i * 5} stroke={background} strokeWidth="0.4" opacity="0.15" />
              ))}
            </svg>
          </div>
          <div className="flex-1 rounded-md overflow-hidden relative" style={{ height: 26, background: c.secondaryAt(14), opacity: 0.85 }}>
            <svg className="absolute inset-0 w-full h-full">
              {Array.from({ length: 7 }).map((_, i) => (
                <path key={`wg${i}`} d={`M 0 ${i * 6 + 2} Q 35 ${i * 6 + (i % 2 === 0 ? 5 : -1)} 140 ${i * 6 + 3}`} stroke={background} strokeWidth="0.6" fill="none" opacity="0.2" />
              ))}
            </svg>
          </div>
          <div className="flex-1 rounded-md overflow-hidden relative" style={{ height: 26, background: surface }}>
            <svg className="absolute inset-0 w-full h-full">
              <path d="M 5 8 Q 20 20 40 12 Q 60 4 80 16 Q 100 24 140 18" stroke={muted} strokeWidth="0.7" fill="none" opacity="0.3" />
              <path d="M 0 24 Q 15 32 35 26 Q 55 20 80 30 Q 110 36 140 32" stroke={muted} strokeWidth="0.5" fill="none" opacity="0.2" />
            </svg>
          </div>
        </div>

        {/* Specs */}
        <div className="px-2 pb-2 flex gap-1">
          {[
            { label: '4.2 × 5.8 m' },
            { label: 'Contemporary' },
            { label: 'Natural Light' },
          ].map((spec, i) => (
            <div
              key={i}
              className="flex-1 rounded-md text-center font-semibold"
              style={{
                padding: '4px 0',
                background: surface,
                fontSize: 6,
                color: c.primaryAt(12),
                letterSpacing: 0.3,
              }}
            >
              {spec.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPoster = () => {
    switch (activeStyle) {
      case 'branding': return renderBrandingPoster(brandingVariant);
      case 'poster': return renderPosterMini();
      case 'arquitectura': return renderArquitecturaPoster(arquitecturaVariant);
      default: return renderBrandingPoster(brandingVariant);
    }
  };

  const posterSizeClass =
    layout === 'preview-first' ? 'w-64 h-96' : compact ? 'w-40 h-56' : 'w-48 h-64';

  const posterEl = (
    <div className="flex justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStyle === 'poster' ? `poster-${posterVariant}` : activeStyle === 'branding' ? `branding-${brandingVariant}` : activeStyle === 'arquitectura' ? `arquitectura-${arquitecturaVariant}` : activeStyle}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={`${posterSizeClass} rounded-lg overflow-hidden shadow-xl`}
          style={{
            boxShadow: layout === 'preview-first' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {renderPoster()}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const styleSelector = (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {POSTER_STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => setActiveStyle(style.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            layout === 'preview-first'
              ? activeStyle === style.id
                ? 'bg-gray-600 text-white border border-gray-500'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300 border border-transparent'
              : activeStyle === style.id
                ? 'bg-white text-gray-900 shadow-md'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <span className="text-sm">{style.icon}</span>
          {style.name}
        </button>
      ))}
    </div>
  );

  const descriptionEl = (
    <p className="text-center text-xs text-white/50">
      {activeStyle === 'branding' && '✨ Branding con variante claro u oscuro'}
      {activeStyle === 'poster' && 'Póster tipo evento / summit'}
      {activeStyle === 'arquitectura' && '◇ Arquitectura con variante claro u oscuro'}
    </p>
  );

  /** Leyenda en dos filas: paleta principal (P, S, A, A2, P2, S2, A3, A4) y paleta de apoyo (F, Sf, T, Ts, F2, Sf2). Al hover, burbuja central; cada fila tiene un encabezado interactivo. */
  const legendRows = useMemo((): { main: { label: string; initial: string; color: string }[]; support: { label: string; initial: string; color: string }[] } => {
    if (layout !== 'preview-first') return { main: [], support: [] };
    if (activeStyle !== 'poster' && activeStyle !== 'branding' && activeStyle !== 'arquitectura') return { main: [], support: [] };
    const variant =
      activeStyle === 'poster' ? posterVariant : activeStyle === 'branding' ? brandingVariant : arquitecturaVariant;
    const palette = buildColorPaletteFromHarmony(colors, variant);
    const col = applySupportOverrides(palette.colors, supportOverridesByVariant?.[variant]);
    const main: { label: string; initial: string; color: string }[] = [
      { label: 'Principal', initial: 'P', color: col.primario },
      { label: 'Secundario', initial: 'S', color: col.secondario },
      { label: 'Acento', initial: 'A', color: col.acento },
    ];
    // Con 3 colores, Acento 2 = Acento; no mostrarlo en la leyenda para no duplicar
    if (colors.length >= 4) main.push({ label: 'Acento 2', initial: 'A2', color: col.apagado });
    if (col.primario2) main.push({ label: 'Principal 2', initial: 'P2', color: col.primario2 });
    if (col.secondario2) main.push({ label: 'Secundario 2', initial: 'S2', color: col.secondario2 });
    if (col.acento3) main.push({ label: 'Acento 3', initial: 'A3', color: col.acento3 });
    if (col.acento4) main.push({ label: 'Acento 4', initial: 'A4', color: col.acento4 });
    const support: { label: string; initial: string; color: string }[] = [
      { label: 'Fondo', initial: 'F', color: col.fondo },
      { label: 'Sobrefondo', initial: 'Sf', color: col.sobrefondo },
      { label: 'Texto principal', initial: 'T', color: col.texto },
      { label: 'Texto secundario', initial: 'Ts', color: col['texto fino'] },
    ];
    if (col.fondo2) support.push({ label: 'Fondo 2', initial: 'F2', color: col.fondo2 });
    if (col.sobrefondo2) support.push({ label: 'Sobrefondo 2', initial: 'Sf2', color: col.sobrefondo2 });
    return { main, support };
  }, [colors, posterVariant, brandingVariant, arquitecturaVariant, activeStyle, layout, supportOverridesByVariant]);

  const ROW_HEADER_MAIN = { label: 'Paleta principal', initial: 'P', color: '#4b5563' };
  const ROW_HEADER_SUPPORT = { label: 'Paleta de apoyo', initial: 'A', color: '#6b7280' };

  const colorLegend = (activeStyle === 'poster' || activeStyle === 'branding' || activeStyle === 'arquitectura') && layout === 'preview-first' && (legendRows.main.length > 0 || legendRows.support.length > 0) && (
    <div className="flex flex-col gap-1.5 pb-0.5">
      {/* Fila 1: Paleta principal */}
      <div className="flex flex-nowrap justify-center items-center gap-2 min-w-0 overflow-x-auto">
        <div
          className="shrink-0 cursor-default flex items-center justify-center rounded-lg border border-gray-500/50 px-2 py-1"
          onMouseEnter={() => setHoveredLegendItem(ROW_HEADER_MAIN)}
          onMouseLeave={() => setHoveredLegendItem(null)}
          title={ROW_HEADER_MAIN.label}
        >
          <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
            {ROW_HEADER_MAIN.label}
          </span>
        </div>
        {legendRows.main.map(({ label, initial, color }) => (
          <div
            key={label}
            className="shrink-0 cursor-default flex items-center justify-center"
            onMouseEnter={() => setHoveredLegendItem({ label, color, initial })}
            onMouseLeave={() => setHoveredLegendItem(null)}
            title={label}
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase select-none"
              style={{
                backgroundColor: color,
                color: getContrastColor(color),
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}
            >
              {initial}
            </div>
          </div>
        ))}
      </div>
      {/* Fila 2: Paleta de apoyo */}
      <div className="flex flex-nowrap justify-center items-center gap-2 min-w-0 overflow-x-auto">
        <div
          className="shrink-0 cursor-default flex items-center justify-center rounded-lg border border-gray-500/50 px-2 py-1"
          onMouseEnter={() => setHoveredLegendItem(ROW_HEADER_SUPPORT)}
          onMouseLeave={() => setHoveredLegendItem(null)}
          title={ROW_HEADER_SUPPORT.label}
        >
          <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">
            {ROW_HEADER_SUPPORT.label}
          </span>
        </div>
        {legendRows.support.map(({ label, initial, color }) => (
          <div
            key={label}
            className="shrink-0 cursor-default flex items-center justify-center"
            onMouseEnter={() => setHoveredLegendItem({ label, color, initial })}
            onMouseLeave={() => setHoveredLegendItem(null)}
            title={label}
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase select-none"
              style={{
                backgroundColor: color,
                color: getContrastColor(color),
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}
            >
              {initial}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const posterVariantButtons = activeStyle === 'poster' && (
    <div className="flex justify-center gap-2">
      <button
        type="button"
        onClick={() => setPosterVariant('oscuro')}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          posterVariant === 'oscuro'
            ? 'bg-gray-600 text-white border border-gray-500'
            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300 border border-transparent'
        }`}
      >
        Poster oscuro
      </button>
      <button
        type="button"
        onClick={() => setPosterVariant('claro')}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          posterVariant === 'claro'
            ? 'bg-gray-600 text-white border border-gray-500'
            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300 border border-transparent'
        }`}
      >
        Poster claro
      </button>
    </div>
  );

  const brandingVariantButtons = activeStyle === 'branding' && (
    <div className="flex justify-center gap-2">
      <button
        type="button"
        onClick={() => setBrandingVariant('oscuro')}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          brandingVariant === 'oscuro'
            ? 'bg-gray-600 text-white border border-gray-500'
            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300 border border-transparent'
        }`}
      >
        Branding oscuro
      </button>
      <button
        type="button"
        onClick={() => setBrandingVariant('claro')}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          brandingVariant === 'claro'
            ? 'bg-gray-600 text-white border border-gray-500'
            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300 border border-transparent'
        }`}
      >
        Branding claro
      </button>
    </div>
  );

  const arquitecturaVariantButtons = activeStyle === 'arquitectura' && (
    <div className="flex justify-center gap-2">
      <button
        type="button"
        onClick={() => setArquitecturaVariant('oscuro')}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          arquitecturaVariant === 'oscuro'
            ? 'bg-gray-600 text-white border border-gray-500'
            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300 border border-transparent'
        }`}
      >
        Arquitectura oscuro
      </button>
      <button
        type="button"
        onClick={() => setArquitecturaVariant('claro')}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          arquitecturaVariant === 'claro'
            ? 'bg-gray-600 text-white border border-gray-500'
            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-gray-300 border border-transparent'
        }`}
      >
        Arquitectura claro
      </button>
    </div>
  );

  if (layout === 'preview-first') {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-gray-600/50 bg-gray-900/40 p-4 flex flex-col items-center min-h-0 flex-1 relative">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Vista previa</span>
          <div className="relative w-full flex justify-center flex-1 min-h-[200px]">
            {posterEl}
            {/* Burbuja central al hover en leyenda (Poster, Branding o Arquitectura) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <AnimatePresence>
                {(activeStyle === 'poster' || activeStyle === 'branding' || activeStyle === 'arquitectura') && hoveredLegendItem && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <motion.div
                      layout
                      className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold uppercase shadow-lg ring-2 ring-white/20"
                      style={{
                        backgroundColor: hoveredLegendItem.color,
                        color: getContrastColor(hoveredLegendItem.color),
                      }}
                    >
                      {hoveredLegendItem.initial}
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${
                        (activeStyle === 'poster' ? posterVariant : activeStyle === 'branding' ? brandingVariant : arquitecturaVariant) === 'claro'
                          ? 'text-gray-700'
                          : 'text-gray-300'
                      }`}
                    >
                      {hoveredLegendItem.label}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {colorLegend}
        {posterVariantButtons}
        {brandingVariantButtons}
        {arquitecturaVariantButtons}
        <div className="flex flex-col gap-2">
          {styleSelector}
        </div>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'space-y-3' : 'space-y-4'}`}>
      {styleSelector}
      {posterEl}
      {descriptionEl}
    </div>
  );
};

export default PosterExamples;
