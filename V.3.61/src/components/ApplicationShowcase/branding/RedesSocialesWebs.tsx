import React from 'react';
import type { PosterPalette } from '../types';
import {
  POSTER_BASE_WIDTH,
  POSTER_HEIGHT,
  POSTER_SCALE,
  BRANDING_GRAIN_URL,
  BRANDING_KRAFT_URL,
} from '../constants';
import { FONT_SANS, FONT_SERIF, FONT_CURSIVE, FONT_MONO, AURA_LOWERCASE } from './brandingFonts';

const PHOTO_GRAIN_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='nd'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nd)'/%3E%3C/svg%3E";

const CORNER_POSITIONS = [
  { pos: 'tl' as const, top: 1.5, left: 2 },
  { pos: 'tr' as const, top: 1.5, right: 2 },
  { pos: 'bl' as const, bottom: 5, left: 2 },
  { pos: 'br' as const, bottom: 5, right: 2 },
];

const DIGITAL_GRID_ITEMS = [
  { name: 'Instagram', desc: 'Feed curated, warm tones, latte art focus', type: 'instagram' as const },
  { name: 'Stories', desc: 'Promo, seasonal drops, swipe-to-shop CTA', type: 'stories' as const },
  { name: 'Newsletter', desc: 'Weekly brew letter, editorial tone, minimal layout', type: 'newsletter' as const },
  { name: 'Digital Menu', desc: 'QR-linked menu, dark UI, signature drinks', type: 'menu' as const },
];

const DIGITAL_SPECS_CARDS = [
  { title: 'Platforms', items: ['Responsive web (Next.js)', 'Instagram & Stories', 'Email (Mailchimp)', 'QR Digital Menu'] },
  { title: 'UI Principles', items: ['Generous whitespace', 'Serif headlines only', 'Dark/light mode pair', 'Organic micro-animations'] },
  { title: 'Content Tone', items: ['Warm, conversational', 'Lowercase preference', 'Storytelling captions', 'Nature-rooted language'] },
];

/** QR 5×5: true = filled. */
const MENU_QR_PATTERN = [
  [true, true, true, false, true],
  [true, false, false, true, false],
  [true, false, true, false, true],
  [false, true, false, true, true],
  [true, true, true, false, true],
];

/** Colores de marco/chrome de dispositivos (grises neutros). */
const DEVICE_BG = '#1a1a1a';
const DEVICE_BORDER = '#333';
const DEVICE_CHROME = '#444';
const LAPTOP_BG = '#111';
const LAPTOP_BORDER = '#333';
const LAPTOP_BASE_GRADIENT = 'linear-gradient(180deg, #3a3a3a, #2a2a2a)';

/** Secciones del menú digital (evita repetición en el JSX). */
const MENU_SECTIONS = [
  { title: 'espresso', items: [{ name: 'Americano', price: '3.50' }, { name: 'Cortado', price: '4.00' }, { name: 'Flat White', price: '4.50' }] },
  { title: 'signature', items: [{ name: 'Aura Blend', price: '5.00' }, { name: 'Oat Honey Latte', price: '5.50' }] },
] as const;

interface Props {
  posterColors: PosterPalette;
}

export function RedesSocialesWebs({ posterColors }: Props) {
  const c = posterColors;
  const c1 = c.primary;
  const c2 = c.accent;
  const c3 = c.surface;
  const c4 = c.secondary;
  const c5 = c.background;
  const c6 = c.muted;
  const w = POSTER_BASE_WIDTH;
  const h = POSTER_HEIGHT;
  const px = (p: number) => (p / 100) * w;
  const py = (p: number) => (p / 100) * h;

  return (
    <div className="flex items-center justify-center w-full h-full min-h-0">
      <div style={{ transform: `scale(${POSTER_SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
        <div className="relative overflow-hidden shadow-2xl rounded" style={{ width: w, height: h, background: c5, ...FONT_SANS }}>
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 300, opacity: 0.22, mixBlendMode: 'multiply', backgroundImage: `url("${BRANDING_GRAIN_URL}")`, backgroundSize: '128px' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.03, backgroundImage: `url("${BRANDING_KRAFT_URL}")`, backgroundSize: '200px' }} />

          {/* Header bar (mismo que Dirección fotográfica y Mockup) */}
          <div className="absolute top-0 left-0 right-0 z-[1]" style={{ height: '8%', background: c1 }}>
            <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: `linear-gradient(90deg, ${c2}, ${c4}, ${c2})`, opacity: 0.5 }} />
          </div>

          {/* Corners */}
          {CORNER_POSITIONS.map(({ pos, ...pct }) => {
            const place: Record<string, number> = {};
            if ('top' in pct && pct.top != null) place.top = py(pct.top);
            if ('bottom' in pct && pct.bottom != null) place.bottom = py(pct.bottom);
            if ('left' in pct && pct.left != null) place.left = px(pct.left);
            if ('right' in pct && pct.right != null) place.right = px(pct.right);
            return (
              <div key={pos} className="absolute z-[60] opacity-[0.12]" style={{ width: 14, height: 14, ...place }}>
                <div className="absolute top-0 left-0 w-full h-px" style={{ background: c6 }} />
                <div className="absolute top-0 left-0 w-px h-full" style={{ background: c6 }} />
              </div>
            );
          })}

          {/* Logo aura (mismo que Dirección fotográfica y Mockup: gráfico + texto) */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[50] flex items-center justify-center" style={{ top: 0, height: '8%', width: '100%' }}>
            <div className="flex flex-row items-center gap-4" style={{ transform: 'translate(-18px, 0) scale(1.1)', transformOrigin: 'center center' }}>
              <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 52, height: 52, transform: 'translate(22px, -6px)' }}>
                <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[52%] h-[38%] rounded-b-[40%]" style={{ borderLeft: `3px solid ${c5}`, borderRight: `3px solid ${c5}`, borderBottom: `3px solid ${c5}`, opacity: 0.72 }} />
                <div className="absolute left-1/2 -translate-x-1/2 w-[28%] rounded-full" style={{ bottom: '13%', height: 3, background: c5, opacity: 0.72 }} />
                <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -rotate-[8deg] w-[28%] h-[38%] border rounded-[50%_2px_50%_2px]" style={{ borderColor: c4, borderWidth: 3 }} />
              </div>
              <div className="flex flex-col items-start justify-center">
                <div className="font-serif lowercase leading-none" style={{ ...AURA_LOWERCASE, color: c5, fontSize: 18, letterSpacing: '0.2em' }}>aura</div>
                <div className="font-cursive" style={{ ...FONT_CURSIVE, color: c5, fontSize: 9, letterSpacing: '0.1em', marginTop: -1, opacity: 0.9 }}>slow brew coffe</div>
              </div>
            </div>
          </div>

          {/* Hero — Laptop + plant + mug */}
          <div className="absolute z-[20] rounded overflow-hidden" style={{ top: py(12.5), left: px(5), right: px(5), height: py(28), background: c1 }}>
            <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c1}, ${c4})` }} />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(88deg, transparent, transparent 14px, ${c2} 14px, ${c2} 15px)` }} />
            {/* Plant */}
            <div className="absolute -top-[3%] left-[3%] w-[15%] h-[40%] z-[2] pointer-events-none">
              <div className="absolute bottom-0 left-1/2 w-[1.5px] h-[70%] origin-bottom" style={{ background: c4, opacity: 0.2, transform: 'translateX(-50%) rotate(5deg)' }} />
              <div className="absolute border rounded-[50%_3px_50%_3px]" style={{ top: '8%', left: '55%', width: '35%', height: '20%', borderColor: c4, opacity: 0.15, transform: 'rotate(-28deg)', borderWidth: 1.5 }} />
              <div className="absolute border rounded-[50%_3px_50%_3px]" style={{ top: '25%', left: '18%', width: '30%', height: '18%', borderColor: c4, opacity: 0.15, transform: 'rotate(22deg)', borderWidth: 1.5 }} />
              <div className="absolute border rounded-[50%_3px_50%_3px]" style={{ top: '40%', left: '52%', width: '28%', height: '16%', borderColor: c4, opacity: 0.15, transform: 'rotate(-18deg)', borderWidth: 1.5 }} />
            </div>
            {/* Mug — símbolo del logo en color principal (c1) */}
            <div className="absolute bottom-[10%] right-[5%] w-[10%] h-[28%] z-[3] flex flex-col items-center justify-center">
              <div className="w-full flex-1 rounded relative flex items-center justify-center" style={{ background: `linear-gradient(170deg, ${c5}, ${c3})`, borderRadius: '2px 2px 4px 4px' }}>
                <div className="absolute top-[20%] -right-[22%] w-[22%] h-[40%] border-2 border-l-0 rounded-r-full" style={{ borderColor: c3 }} />
                <div className="relative flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 35, height: 35, opacity: 0.72, border: `1.75px solid ${c1}`, transform: 'translateY(3px)' }}>
                  <div className="relative flex items-center justify-center" style={{ width: 32, height: 32 }}>
                    <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[52%] h-[38%] rounded-b-[40%]" style={{ borderLeft: `1.75px solid ${c1}`, borderRight: `1.75px solid ${c1}`, borderBottom: `1.75px solid ${c1}` }} />
                    <div className="absolute left-1/2 -translate-x-1/2 w-[28%] rounded-full" style={{ bottom: '13%', height: 1.75, background: c1 }} />
                    <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -rotate-[8deg] w-[28%] h-[38%] border rounded-[50%_2px_50%_2px]" style={{ borderColor: c1, borderWidth: 1.75 }} />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-[8%] left-[5%] w-[90%] h-[10%] rounded-full" style={{ background: c1, filter: 'blur(3px)', opacity: 0.15 }} />
            </div>
            {/* Laptop */}
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[78%] h-[80%] flex flex-col items-center">
              <div className="w-full flex-1 rounded-t relative overflow-hidden flex flex-col" style={{ background: LAPTOP_BG, borderRadius: '4px 4px 0 0', border: `2px solid ${LAPTOP_BORDER}` }}>
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full z-[5]" style={{ background: '#222', border: `1px solid ${LAPTOP_BORDER}` }} />
                <div className="absolute top-2 left-0 right-0 bottom-0 overflow-hidden flex flex-col">
                  {/* Web nav */}
                  <div className="flex items-center px-1.5 gap-1 border-b" style={{ height: 18, background: c1, borderColor: c4 }}>
                    <span style={{ ...AURA_LOWERCASE, fontSize: 7, letterSpacing: '0.25em', color: c5 }}>aura</span>
                    <div className="ml-auto flex gap-1">
                      {[1, 2, 3, 4].map((i) => <div key={i} className="w-4 h-px" style={{ background: c3, opacity: 0.3 }} />)}
                    </div>
                  </div>
                  {/* Web hero */}
                  <div className="flex-1 flex items-center p-2 gap-1" style={{ background: `linear-gradient(160deg, ${c1}, ${c4})` }}>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span style={{ ...FONT_CURSIVE, fontSize: 6, color: c2, opacity: 0.7 }}>rooted in nature</span>
                      <span style={{ ...FONT_SERIF, fontSize: 11, color: c5, lineHeight: 1.2, letterSpacing: '0.04em', textTransform: 'lowercase' }}>slow brew,<br />pure soul</span>
                      <span style={{ ...FONT_MONO, fontSize: 4, color: c3, opacity: 0.5, letterSpacing: '0.1em' }}>Organic coffee house — est. 2024</span>
                      <div className="mt-1 flex items-center justify-center rounded" style={{ width: 42, height: 12, background: c2 }}>
                        <span style={{ ...FONT_MONO, fontSize: 4, color: c5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Explore</span>
                      </div>
                    </div>
                    <div className="w-[38%] h-[85%] rounded relative overflow-hidden" style={{ background: `linear-gradient(150deg, ${c3}22, ${c2}15)` }}>
                      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[40%] h-[55%] flex flex-col items-center">
                        <div className="w-[110%] h-[10%] rounded-t" style={{ background: DEVICE_CHROME }} />
                        <div className="w-full flex-1 rounded-b relative flex items-center justify-center" style={{ background: `linear-gradient(175deg, ${c5}, ${c3})` }}>
                          <div className="absolute top-[30%] left-0 right-0 h-[28%]" style={{ background: c1, opacity: 0.8 }} />
                          <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" style={{ width: 20, height: 20, opacity: 0.62 }}>
                            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[52%] h-[38%] rounded-b-[40%]" style={{ borderLeft: `2.5px solid ${c5}`, borderRight: `2.5px solid ${c5}`, borderBottom: `2.5px solid ${c5}` }} />
                            <div className="absolute left-1/2 -translate-x-1/2 w-[28%] rounded-full" style={{ bottom: '13%', height: 2.5, background: c5 }} />
                            <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -rotate-[8deg] w-[28%] h-[38%] border rounded-[50%_2px_50%_2px]" style={{ borderColor: c4, borderWidth: 2.5 }} />
                          </div>
                        </div>
                      </div>
                      <div className="absolute border rounded-[50%_2px_50%_2px]" style={{ top: '8%', left: '5%', width: '22%', height: '28%', borderColor: c4, opacity: 0.15, transform: 'rotate(-20deg)', borderWidth: 1 }} />
                      <div className="absolute border rounded-[50%_2px_50%_2px]" style={{ bottom: '5%', right: '5%', width: '20%', height: '25%', borderColor: c4, opacity: 0.15, transform: 'rotate(15deg)', borderWidth: 1 }} />
                    </div>
                  </div>
                  {/* Web cards row */}
                  <div className="flex gap-0.5 p-0.5 items-stretch" style={{ height: 22, background: c5 }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 rounded flex flex-col items-center justify-center gap-px" style={{ background: c3 }}>
                        <div className="w-1.5 h-1.5 rounded-full border" style={{ borderColor: c4, opacity: 0.3 }} />
                        <div className="w-[60%] h-px" style={{ background: c6, opacity: 0.15 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-[110%] h-1.5 rounded-b" style={{ background: LAPTOP_BASE_GRADIENT }} />
              <div className="absolute -bottom-[5%] left-[10%] w-[80%] h-[8%] rounded-full" style={{ background: c1, filter: 'blur(6px)', opacity: 0.3 }} />
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: `url("${PHOTO_GRAIN_URL}")`, backgroundSize: '80px' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0,0,0,0.3) 100%)' }} />
            <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 z-10">
              <div className="rounded-full" style={{ width: 5, height: 5, background: c2, opacity: 0.6 }} />
              <span style={{ ...FONT_MONO, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: c5, opacity: 0.7 }}>Website — Desktop</span>
            </div>
          </div>

          {/* Grid 4 digital */}
          <div className="absolute z-[20] grid gap-2" style={{ top: py(42.5), left: px(5), right: px(5), gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {DIGITAL_GRID_ITEMS.map((item) => (
              <div key={item.type} className="flex flex-col gap-1">
                <div className="w-full rounded overflow-hidden relative" style={{ aspectRatio: 0.56 }}>
                  {item.type === 'instagram' && (
                    <div className="absolute inset-0 rounded flex flex-col overflow-hidden" style={{ background: DEVICE_BG, border: `2px solid ${DEVICE_BORDER}` }}>
                      <div className="flex-shrink-0 left-1/2 w-[35%] h-2 rounded-b self-center -mb-px relative z-[5]" style={{ background: DEVICE_BG }} />
                      <div className="flex-1 min-h-0 flex flex-col mx-px mb-px" style={{ background: c5 }}>
                        <div className="flex items-center px-1.5 py-0.5 border-b flex-shrink-0" style={{ height: 16, borderColor: c3 }}>
                          <span style={{ ...AURA_LOWERCASE, fontSize: 6, letterSpacing: '0.2em', color: c1 }}>aura</span>
                          <div className="ml-auto flex gap-0.5">
                            <div className="w-1.5 h-1.5 rounded border" style={{ borderColor: c6, opacity: 0.25 }} />
                            <div className="w-1.5 h-1.5 rounded border" style={{ borderColor: c6, opacity: 0.25 }} />
                          </div>
                        </div>
                        <div className="flex gap-0.5 p-0.5 items-center flex-shrink-0" style={{ height: 20 }}>
                          {[1, 2, 3].map((i) => <div key={i} className="w-4 h-4 rounded-full border flex-shrink-0" style={{ borderColor: c2, background: c3, borderWidth: 1.5 }} />)}
                          <div className="w-4 h-4 rounded-full border border-dashed flex-shrink-0" style={{ borderColor: c6, opacity: 0.3, background: c5 }} />
                        </div>
                        <div className="flex-1 min-h-0 flex flex-col">
                          <div className="flex-1 min-h-0 relative" style={{ background: c1 }}>
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2" style={{ width: '75%', aspectRatio: 1, borderColor: c2, opacity: 0.5 }} />
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: '62%', aspectRatio: 1, background: `radial-gradient(circle, ${c4}44, ${c2}33, ${c1})` }} />
                            {/* Hoja del logo en color de apoyo (c5), bajo grosor de línea */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-[50%_2px_50%_2px]" style={{ width: '22%', height: '30%', borderColor: c5, borderWidth: 1.5, transform: 'rotate(-8deg)', opacity: 0.58 }} />
                            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.35) 100%)' }} />
                          </div>
                          <div className="flex items-center gap-0.5 px-1 py-0.5 flex-shrink-0" style={{ height: 12 }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: c2, opacity: 0.5 }} />
                            <div className="w-1.5 h-1.5 rounded-full border" style={{ borderColor: c6, opacity: 0.2 }} />
                            <div className="w-1.5 h-1.5 rounded-full border" style={{ borderColor: c6, opacity: 0.2 }} />
                          </div>
                          <div className="px-1 pb-0.5 flex flex-col gap-px flex-shrink-0">
                            <span style={{ ...FONT_MONO, fontSize: 3.5, color: c1, fontWeight: 500, letterSpacing: '0.05em' }}>aura.coffee</span>
                            <span style={{ ...FONT_SANS, fontSize: 3, color: c6, opacity: 0.6, lineHeight: 1.4 }}>Every cup tells a story ☕</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 left-1/2 w-[25%] h-0.5 rounded-full self-center mb-0.5" style={{ background: DEVICE_CHROME }} />
                    </div>
                  )}
                  {item.type === 'stories' && (
                    <div className="absolute inset-0 rounded" style={{ background: DEVICE_BG, border: `2px solid ${DEVICE_BORDER}` }}>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-2 rounded-b z-[5]" style={{ background: DEVICE_BG }} />
                      <div className="absolute top-0 left-0 right-0 mt-2 mx-px bottom-0 flex flex-col" style={{ background: `linear-gradient(170deg, ${c1}, ${c4})` }}>
                        <div className="flex gap-0.5 px-1 pt-1">
                          <div className="flex-1 h-0.5 rounded-full" style={{ background: c5, opacity: 0.7 }} />
                          <div className="flex-1 h-0.5 rounded-full" style={{ background: c5, opacity: 0.7 }} />
                          <div className="flex-1 h-0.5 rounded-full" style={{ background: c3, opacity: 0.2 }} />
                        </div>
                        <div className="flex items-center gap-0.5 px-1 py-0.5">
                          <div className="w-3 h-3 rounded-full" style={{ background: c4, border: `1px solid ${c5}`, opacity: 0.5 }} />
                          <span style={{ ...FONT_MONO, fontSize: 4, color: c5, opacity: 0.7, letterSpacing: '0.08em' }}>aura.coffee</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center gap-1 p-2">
                          <span style={{ ...FONT_CURSIVE, fontSize: 7, color: c5, opacity: 0.7 }}>this weekend</span>
                          <span style={{ ...FONT_SERIF, fontSize: 11, color: c5, textAlign: 'center', lineHeight: 1.2, letterSpacing: '0.05em', textTransform: 'lowercase' }}>seasonal<br />harvest blend</span>
                          <div className="w-[30%] h-px" style={{ background: c5, opacity: 0.3 }} />
                          <span style={{ ...FONT_MONO, fontSize: 4, color: c3, opacity: 0.5, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Single origin · Ethiopia</span>
                          <div className="mt-0.5 px-2 py-0.5 border rounded" style={{ borderColor: c5, opacity: 0.6 }}>
                            <span style={{ ...FONT_MONO, fontSize: 3.5, color: c5, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Shop now</span>
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-px opacity-30">
                          <div className="w-2 h-1 border-l border-b" style={{ borderColor: c3, transform: 'rotate(-45deg)' }} />
                          <span style={{ ...FONT_MONO, fontSize: 3, color: c3, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Swipe up</span>
                        </div>
                        <div className="absolute border rounded-[50%_2px_50%_2px]" style={{ top: '25%', left: '5%', width: '15%', height: '18%', borderColor: c4, opacity: 0.08, transform: 'rotate(-25deg)', borderWidth: 1 }} />
                        <div className="absolute border rounded-[50%_2px_50%_2px]" style={{ bottom: '20%', right: '5%', width: '12%', height: '15%', borderColor: c4, opacity: 0.08, transform: 'rotate(20deg)', borderWidth: 1 }} />
                      </div>
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-[25%] h-0.5 rounded-full" style={{ background: DEVICE_CHROME }} />
                    </div>
                  )}
                  {item.type === 'newsletter' && (
                    <div className="absolute inset-0 rounded overflow-hidden" style={{ background: c3 }}>
                      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${c3}, ${c4}99)` }} />
                      <div className="absolute top-[6%] left-[8%] right-[8%] bottom-[8%] rounded border flex flex-col" style={{ background: c5, borderColor: c3 }}>
                        <div className="flex items-center gap-0.5 px-1 py-0.5" style={{ height: 12, background: c3 }}>
                          <div className="w-1 h-1 rounded-full" style={{ background: c2 }} />
                          <div className="w-1 h-1 rounded-full" style={{ background: c4 }} />
                          <div className="w-1 h-1 rounded-full" style={{ background: c4 }} />
                        </div>
                        <div className="flex-1 p-1.5 flex flex-col items-center gap-0.5">
                          <span style={{ ...AURA_LOWERCASE, fontSize: 8, letterSpacing: '0.3em', color: c1 }}>aura</span>
                          <div className="w-[25%] h-px" style={{ background: c2, opacity: 0.3 }} />
                          <span style={{ ...FONT_SERIF, fontSize: 6, color: c1, textAlign: 'center', lineHeight: 1.3, textTransform: 'lowercase', letterSpacing: '0.04em' }}>your weekly<br />brew letter</span>
                          <div className="w-[80%] h-px" style={{ background: c6, opacity: 0.1 }} />
                          <div className="w-[55%] h-px" style={{ background: c6, opacity: 0.1 }} />
                          <div className="w-[80%] h-px" style={{ background: c6, opacity: 0.1 }} />
                          <div className="w-[80%] aspect-[2/1] rounded relative overflow-hidden mt-0.5" style={{ background: `linear-gradient(140deg, ${c1}, ${c4})` }}>
                            <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[25%] h-[50%]">
                              <div className="w-full h-full rounded-b relative" style={{ background: `linear-gradient(170deg, ${c5}, ${c3})` }}>
                                <div className="absolute top-[28%] left-0 right-0 h-[30%]" style={{ background: c1 }} />
                              </div>
                            </div>
                            <div className="absolute border rounded-[50%_2px_50%_2px]" style={{ top: '10%', left: '8%', width: '18%', height: '24%', borderColor: c4, opacity: 0.12, transform: 'rotate(-20deg)', borderWidth: 1 }} />
                            <div className="absolute bottom-[8%] right-[8%] w-[15%] h-[20%] border rounded-[50%_2px_50%_2px]" style={{ borderColor: c4, opacity: 0.12, transform: 'rotate(15deg)', borderWidth: 1 }} />
                            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.3) 100%)' }} />
                          </div>
                          <div className="flex items-center justify-center rounded mt-px" style={{ width: 42, height: 10, background: c2 }}>
                            <span style={{ ...FONT_MONO, fontSize: 3.5, color: c1, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Read more</span>
                          </div>
                          <div className="w-[40%] h-px mt-auto" style={{ background: c6, opacity: 0.12 }} />
                          <span style={{ ...FONT_MONO, fontSize: 2.5, color: c6, opacity: 0.35, letterSpacing: '0.1em' }}>Unsubscribe · Privacy</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: `url("${PHOTO_GRAIN_URL}")`, backgroundSize: '80px' }} />
                    </div>
                  )}
                  {item.type === 'menu' && (
                    <div className="absolute inset-0 rounded" style={{ background: DEVICE_BG, border: `2px solid ${DEVICE_BORDER}` }}>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-2 rounded-b z-[5]" style={{ background: DEVICE_BG }} />
                      <div className="absolute top-0 left-0 right-0 mt-2 mx-px bottom-0 flex flex-col overflow-hidden" style={{ background: c1 }}>
                        <div className="p-1.5 pb-0.5 flex flex-col items-center gap-px border-b" style={{ borderColor: c4 }}>
                          <span style={{ ...AURA_LOWERCASE, fontSize: 10, letterSpacing: '0.25em', color: c5 }}>aura</span>
                          <span style={{ ...FONT_CURSIVE, fontSize: 6, color: c5, opacity: 0.6 }}>our menu</span>
                        </div>
                        {MENU_SECTIONS.map((section, sectionIdx) => (
                          <React.Fragment key={section.title}>
                            {sectionIdx > 0 && (
                              <div className="h-px mx-1 my-px" style={{ background: `linear-gradient(90deg, transparent, ${c5}33, transparent)` }} />
                            )}
                            <div className="p-0.5 px-1">
                              <span style={{ ...FONT_SERIF, fontStyle: 'italic', fontSize: 6, color: c5, letterSpacing: sectionIdx === 0 ? '0.08em' : undefined }}>{section.title}</span>
                              {section.items.map((row, rowIdx) => (
                                <div
                                  key={row.name}
                                  className={`flex justify-between items-baseline py-px ${rowIdx < section.items.length - 1 ? 'border-b border-dotted' : ''}`}
                                  style={{ borderColor: c5, opacity: 0.2 }}
                                >
                                  <span style={{ ...FONT_MONO, fontSize: 5, color: c5, opacity: 0.8 }}>{row.name}</span>
                                  <span style={{ ...FONT_MONO, fontSize: 5, color: c5, opacity: 0.6 }}>{row.price}</span>
                                </div>
                              ))}
                            </div>
                          </React.Fragment>
                        ))}
                        <div className="p-0.5 flex flex-col items-center gap-0.5">
                          <div className="w-8 h-8 border rounded relative overflow-hidden" style={{ borderColor: c5, opacity: 0.5 }}>
                            <div className="absolute inset-[12%] grid gap-px" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(5, 1fr)' }}>
                              {MENU_QR_PATTERN.flat().map((filled, i) => (
                                <div key={i} style={{ background: filled ? c5 : 'transparent' }} />
                              ))}
                            </div>
                          </div>
                          <span style={{ ...FONT_MONO, fontSize: 3, color: c5, opacity: 0.35, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scan to order</span>
                        </div>
                      </div>
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-[25%] h-0.5 rounded-full" style={{ background: DEVICE_CHROME }} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5" style={{ marginTop: 6 }}>
                  <div className="rounded-full flex-shrink-0 border-[1.5px]" style={{ width: 5, height: 5, borderColor: c2, opacity: 0.5 }} />
                  <span style={{ ...FONT_SERIF, fontStyle: 'italic', fontSize: 11, color: c1, letterSpacing: '0.05em' }}>{item.name}</span>
                </div>
                <div style={{ ...FONT_MONO, fontSize: 8, color: c6, opacity: 0.6, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Specs */}
          <div className="absolute z-[60]" style={{ top: py(79), left: px(5), right: px(5) }}>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 20, height: 2, background: c4, borderRadius: 1 }} />
              <span style={{ ...FONT_MONO, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: c6 }}>Digital Specs</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {DIGITAL_SPECS_CARDS.map((card) => (
                <div key={card.title} className="rounded-lg overflow-hidden relative" style={{ background: c1, padding: '10px 12px' }}>
                  <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none" style={{ background: `linear-gradient(180deg, ${c4}10, transparent)` }} />
                  <div style={{ ...FONT_SERIF, fontSize: 12, color: c5, letterSpacing: '0.04em', marginBottom: 6, position: 'relative', zIndex: 1 }}>{card.title}</div>
                  <div className="w-full h-px mb-1.5 relative z-[1]" style={{ background: `linear-gradient(90deg, ${c2}44, transparent)` }} />
                  <div className="flex flex-col gap-0.5 relative z-[1]">
                    {card.items.map((text, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="rounded-full flex-shrink-0" style={{ width: 3, height: 3, background: c2, opacity: 0.4 }} />
                        <span style={{ ...FONT_MONO, fontSize: 8, color: c3, opacity: 0.8 }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-[2%] right-[-4%] z-[4] font-serif leading-[0.65] opacity-[0.18] pointer-events-none select-none lowercase" style={{ ...FONT_SERIF, fontSize: 160, color: c3 }}>a</div>

          {/* Footer (mismo que Dirección fotográfica y Mockup) */}
          <div className="absolute bottom-0 left-0 right-0 z-[100] flex items-center justify-center" style={{ height: '3.5%', background: c1 }}>
            <div className="flex items-center gap-1.5">
              <div className="rounded-full" style={{ width: 4, height: 4, background: c4 }} />
              <span className="font-serif text-xs tracking-[0.35em] lowercase" style={{ ...FONT_SERIF, color: c5 }}>aura</span>
              <div className="rounded-full" style={{ width: 4, height: 4, background: c4 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
