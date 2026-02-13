import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ExportCreatorResults } from './ExportCreatorResults';

interface ShapesCreatorProps {
  onComplete: (colors: string[]) => void;
  onBack: () => void;
  colorCount: number;
  onColorCountChange: (count: number) => void;
}

interface Shape {
  id: string;
  name: string;
  category: string;
  svg: React.ReactNode;
  colors: string[];
  energy: 'calm' | 'balanced' | 'dynamic';
  weight: 'light' | 'medium' | 'heavy';
}

interface SelectedShape {
  shape: Shape;
  color: string;
  customName?: string;
}

type SelectionMode = 'tinder' | 'compare';
type CompareAction = 'keep' | 'discard';

// SVG Shapes - Abstract, geometric, patterns inspired by Bouba-Kiki effect
const createShapes = (): Shape[] => [
  // Suaves / Bouba (formas redondeadas, orgánicas)
  {
    id: 'blob-1',
    name: 'Nube suave',
    category: 'Orgánicas',
    energy: 'calm',
    weight: 'light',
    colors: ['#E8D5B7', '#F5E6D3', '#D4A574', '#C4956A', '#A67B5B', '#8B6914'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M100,20 C140,20 170,50 175,90 C180,130 160,170 120,180 C80,190 40,170 25,130 C10,90 30,50 60,30 C75,20 85,20 100,20" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'blob-2',
    name: 'Onda marina',
    category: 'Orgánicas',
    energy: 'calm',
    weight: 'medium',
    colors: ['#7EC8E3', '#5DADE2', '#3498DB', '#2E86AB', '#1A5276', '#154360'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M20,100 Q50,60 100,80 T180,100 Q180,150 140,170 Q100,190 60,170 Q20,150 20,100" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'blob-3',
    name: 'Gota',
    category: 'Orgánicas',
    energy: 'calm',
    weight: 'light',
    colors: ['#A8E6CF', '#88D8B0', '#6BCB77', '#4ECDC4', '#45B7AA', '#2D9596'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M100,30 C100,30 150,80 150,120 C150,160 130,180 100,180 C70,180 50,160 50,120 C50,80 100,30 100,30" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'blob-4',
    name: 'Fluido',
    category: 'Orgánicas',
    energy: 'calm',
    weight: 'medium',
    colors: ['#DDA0DD', '#DA70D6', '#BA55D3', '#9932CC', '#8B008B', '#4B0082'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M40,100 Q40,40 100,40 Q160,40 160,100 Q160,140 130,160 Q100,180 70,160 Q40,140 40,100" fill="currentColor"/>
        <circle cx="80" cy="80" r="15" fill="currentColor" opacity="0.5"/>
      </svg>
    )
  },
  {
    id: 'blob-5',
    name: 'Ameba',
    category: 'Orgánicas',
    energy: 'calm',
    weight: 'light',
    colors: ['#FFEAA7', '#FDCB6E', '#F9BF3B', '#F39C12', '#E67E22', '#D35400'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M100,25 C130,25 155,40 165,65 C175,90 175,115 165,140 C155,165 130,180 100,180 C70,180 45,165 35,140 C25,115 30,85 45,60 C60,35 80,25 100,25" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'cloud-1',
    name: 'Nube doble',
    category: 'Orgánicas',
    energy: 'calm',
    weight: 'light',
    colors: ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#6C757D'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <ellipse cx="70" cy="110" rx="50" ry="40" fill="currentColor"/>
        <ellipse cx="130" cy="100" rx="55" ry="45" fill="currentColor"/>
        <ellipse cx="100" cy="130" rx="60" ry="35" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'wave-soft',
    name: 'Ondulación',
    category: 'Orgánicas',
    energy: 'calm',
    weight: 'light',
    colors: ['#E6F3FF', '#B3D9FF', '#80BFFF', '#4DA6FF', '#1A8CFF', '#0066CC'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M0,120 Q50,80 100,120 T200,120 L200,200 L0,200 Z" fill="currentColor" opacity="0.3"/>
        <path d="M0,140 Q50,100 100,140 T200,140 L200,200 L0,200 Z" fill="currentColor" opacity="0.5"/>
        <path d="M0,160 Q50,120 100,160 T200,160 L200,200 L0,200 Z" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'petal',
    name: 'Pétalo',
    category: 'Orgánicas',
    energy: 'calm',
    weight: 'light',
    colors: ['#FFB6C1', '#FF69B4', '#FF1493', '#DB7093', '#C71585', '#8B0A50'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M100,20 Q150,60 150,100 Q150,160 100,180 Q50,160 50,100 Q50,60 100,20" fill="currentColor"/>
      </svg>
    )
  },

  // Kiki / Angulares (formas puntiagudas, geométricas, dinámicas)
  {
    id: 'spike-1',
    name: 'Explosión',
    category: 'Angulares',
    energy: 'dynamic',
    weight: 'heavy',
    colors: ['#FF6B6B', '#EE5A5A', '#E74C3C', '#C0392B', '#922B21', '#641E16'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="100,10 120,70 180,50 140,100 190,130 130,130 150,190 100,140 50,190 70,130 10,130 60,100 20,50 80,70" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'spike-2',
    name: 'Rayo',
    category: 'Angulares',
    energy: 'dynamic',
    weight: 'heavy',
    colors: ['#FFD93D', '#FFC300', '#F4D03F', '#F1C40F', '#D4AC0D', '#B7950B'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="120,10 80,90 130,90 60,190 100,100 50,100" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'spike-3',
    name: 'Cristal',
    category: 'Angulares',
    energy: 'dynamic',
    weight: 'medium',
    colors: ['#A8DADC', '#81C3D7', '#5DADE2', '#3498DB', '#2874A6', '#1B4F72'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="100,20 140,60 160,120 130,180 70,180 40,120 60,60" fill="currentColor"/>
        <polygon points="100,40 130,70 145,120 120,165 80,165 55,120 70,70" fill="currentColor" opacity="0.5"/>
      </svg>
    )
  },
  {
    id: 'zigzag',
    name: 'Zigzag',
    category: 'Angulares',
    energy: 'dynamic',
    weight: 'medium',
    colors: ['#FF9F43', '#FFA502', '#FF7F50', '#FF6348', '#EE5A24', '#D63031'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M20,100 L50,40 L80,100 L110,40 L140,100 L170,40 L180,60 L150,120 L120,60 L90,120 L60,60 L30,120 Z" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'arrow-burst',
    name: 'Ráfaga',
    category: 'Angulares',
    energy: 'dynamic',
    weight: 'heavy',
    colors: ['#00CEC9', '#00B894', '#00A085', '#009688', '#00796B', '#004D40'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="100,30 110,80 150,50 120,90 170,100 120,110 150,150 110,120 100,170 90,120 50,150 80,110 30,100 80,90 50,50 90,80" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'shards',
    name: 'Fragmentos',
    category: 'Angulares',
    energy: 'dynamic',
    weight: 'heavy',
    colors: ['#2C3E50', '#34495E', '#5D6D7E', '#85929E', '#ABB2B9', '#D5D8DC'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="100,20 130,50 120,100" fill="currentColor"/>
        <polygon points="140,60 180,90 150,120" fill="currentColor" opacity="0.8"/>
        <polygon points="130,110 170,160 110,140" fill="currentColor" opacity="0.6"/>
        <polygon points="70,130 100,180 50,160" fill="currentColor" opacity="0.7"/>
        <polygon points="40,80 70,60 60,120" fill="currentColor" opacity="0.9"/>
        <polygon points="60,40 90,70 50,70" fill="currentColor" opacity="0.5"/>
      </svg>
    )
  },

  // Geométricas puras
  {
    id: 'triangle',
    name: 'Triángulo',
    category: 'Geométricas',
    energy: 'balanced',
    weight: 'medium',
    colors: ['#9B59B6', '#8E44AD', '#7D3C98', '#6C3483', '#5B2C6F', '#4A235A'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="100,30 170,160 30,160" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'hexagon',
    name: 'Hexágono',
    category: 'Geométricas',
    energy: 'balanced',
    weight: 'medium',
    colors: ['#1ABC9C', '#16A085', '#148F77', '#117A65', '#0E6655', '#0B5345'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="100,20 170,55 170,125 100,160 30,125 30,55" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'octagon',
    name: 'Octágono',
    category: 'Geométricas',
    energy: 'balanced',
    weight: 'medium',
    colors: ['#E74C3C', '#CB4335', '#B03A2E', '#943126', '#78281F', '#641E16'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="70,30 130,30 170,70 170,130 130,170 70,170 30,130 30,70" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'diamond',
    name: 'Rombo',
    category: 'Geométricas',
    energy: 'balanced',
    weight: 'medium',
    colors: ['#3498DB', '#2E86C1', '#2874A6', '#21618C', '#1B4F72', '#154360'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="100,20 180,100 100,180 20,100" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'star-6',
    name: 'Estrella 6',
    category: 'Geométricas',
    energy: 'dynamic',
    weight: 'medium',
    colors: ['#F39C12', '#E67E22', '#D35400', '#CA6F1E', '#BA4A00', '#A04000'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="100,20 115,75 170,55 135,100 170,145 115,125 100,180 85,125 30,145 65,100 30,55 85,75" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'cross',
    name: 'Cruz',
    category: 'Geométricas',
    energy: 'balanced',
    weight: 'heavy',
    colors: ['#27AE60', '#229954', '#1E8449', '#196F3D', '#145A32', '#0E6251'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M80,30 L120,30 L120,80 L170,80 L170,120 L120,120 L120,170 L80,170 L80,120 L30,120 L30,80 L80,80 Z" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'pentagon',
    name: 'Pentágono',
    category: 'Geométricas',
    energy: 'balanced',
    weight: 'medium',
    colors: ['#8E44AD', '#7D3C98', '#6C3483', '#5B2C6F', '#4A235A', '#3A1A4A'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="100,25 175,75 150,160 50,160 25,75" fill="currentColor"/>
      </svg>
    )
  },

  // Patrones y texturas
  {
    id: 'dots-grid',
    name: 'Puntos',
    category: 'Patrones',
    energy: 'calm',
    weight: 'light',
    colors: ['#2ECC71', '#27AE60', '#229954', '#1E8449', '#196F3D', '#145A32'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {[0,1,2,3,4].map(row => 
          [0,1,2,3,4].map(col => (
            <circle key={`${row}-${col}`} cx={30 + col * 35} cy={30 + row * 35} r={12} fill="currentColor" opacity={0.5 + (row + col) * 0.05}/>
          ))
        )}
      </svg>
    )
  },
  {
    id: 'lines-diagonal',
    name: 'Líneas diagonales',
    category: 'Patrones',
    energy: 'dynamic',
    weight: 'light',
    colors: ['#2C3E50', '#34495E', '#5D6D7E', '#7F8C8D', '#95A5A6', '#BDC3C7'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {[0,1,2,3,4,5,6].map(i => (
          <line key={i} x1={0} y1={i * 30} x2={i * 30 + 60} y2={0} stroke="currentColor" strokeWidth="8" opacity={0.7}/>
        ))}
        {[0,1,2,3,4,5,6].map(i => (
          <line key={`b-${i}`} x1={i * 30} y1={200} x2={200} y2={i * 30} stroke="currentColor" strokeWidth="8" opacity={0.7}/>
        ))}
      </svg>
    )
  },
  {
    id: 'waves-pattern',
    name: 'Ondas',
    category: 'Patrones',
    energy: 'calm',
    weight: 'medium',
    colors: ['#0077B6', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF', '#CAF0F8'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {[0,1,2,3,4].map(i => (
          <path key={i} d={`M0,${40 + i * 30} Q50,${20 + i * 30} 100,${40 + i * 30} T200,${40 + i * 30}`} fill="none" stroke="currentColor" strokeWidth="10" opacity={0.5 + i * 0.1}/>
        ))}
      </svg>
    )
  },
  {
    id: 'checkerboard',
    name: 'Ajedrez',
    category: 'Patrones',
    energy: 'balanced',
    weight: 'heavy',
    colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#533483', '#2B2D42'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {[0,1,2,3,4].map(row => 
          [0,1,2,3,4].map(col => (
            (row + col) % 2 === 0 && <rect key={`${row}-${col}`} x={col * 40} y={row * 40} width="40" height="40" fill="currentColor"/>
          ))
        )}
      </svg>
    )
  },
  {
    id: 'concentric',
    name: 'Concéntrico',
    category: 'Patrones',
    energy: 'calm',
    weight: 'medium',
    colors: ['#FF6F61', '#FF8A65', '#FFAB91', '#FFCCBC', '#FFE0B2', '#FFF3E0'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {[80, 60, 40, 20].map((r, i) => (
          <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeWidth="12" opacity={0.4 + i * 0.15}/>
        ))}
      </svg>
    )
  },
  {
    id: 'triangles-pattern',
    name: 'Triángulos',
    category: 'Patrones',
    energy: 'dynamic',
    weight: 'medium',
    colors: ['#6C5CE7', '#A29BFE', '#74B9FF', '#0984E3', '#00CEC9', '#00B894'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="0,0 40,0 20,35" fill="currentColor" opacity="0.8"/>
        <polygon points="40,0 80,0 60,35" fill="currentColor" opacity="0.6"/>
        <polygon points="80,0 120,0 100,35" fill="currentColor" opacity="0.8"/>
        <polygon points="120,0 160,0 140,35" fill="currentColor" opacity="0.6"/>
        <polygon points="160,0 200,0 180,35" fill="currentColor" opacity="0.8"/>
        <polygon points="20,35 60,35 40,70" fill="currentColor" opacity="0.5"/>
        <polygon points="60,35 100,35 80,70" fill="currentColor" opacity="0.7"/>
        <polygon points="100,35 140,35 120,70" fill="currentColor" opacity="0.5"/>
        <polygon points="140,35 180,35 160,70" fill="currentColor" opacity="0.7"/>
        <polygon points="0,70 40,70 20,105" fill="currentColor" opacity="0.8"/>
        <polygon points="40,70 80,70 60,105" fill="currentColor" opacity="0.6"/>
        <polygon points="80,70 120,70 100,105" fill="currentColor" opacity="0.8"/>
        <polygon points="120,70 160,70 140,105" fill="currentColor" opacity="0.6"/>
        <polygon points="160,70 200,70 180,105" fill="currentColor" opacity="0.8"/>
      </svg>
    )
  },
  {
    id: 'hexagon-pattern',
    name: 'Panal',
    category: 'Patrones',
    energy: 'balanced',
    weight: 'medium',
    colors: ['#F4D03F', '#F5B041', '#EB984E', '#DC7633', '#CA6F1E', '#BA4A00'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="50,30 80,15 110,30 110,60 80,75 50,60" fill="currentColor" opacity="0.8"/>
        <polygon points="110,30 140,15 170,30 170,60 140,75 110,60" fill="currentColor" opacity="0.6"/>
        <polygon points="20,75 50,60 80,75 80,105 50,120 20,105" fill="currentColor" opacity="0.7"/>
        <polygon points="80,75 110,60 140,75 140,105 110,120 80,105" fill="currentColor" opacity="0.9"/>
        <polygon points="140,75 170,60 200,75 200,105 170,120 140,105" fill="currentColor" opacity="0.5"/>
        <polygon points="50,120 80,105 110,120 110,150 80,165 50,150" fill="currentColor" opacity="0.8"/>
        <polygon points="110,120 140,105 170,120 170,150 140,165 110,150" fill="currentColor" opacity="0.6"/>
      </svg>
    )
  },

  // Complejas / Abstractas
  {
    id: 'spiral',
    name: 'Espiral',
    category: 'Complejas',
    energy: 'dynamic',
    weight: 'medium',
    colors: ['#8E44AD', '#9B59B6', '#AF7AC5', '#BB8FCE', '#D2B4DE', '#E8DAEF'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M100,100 C100,80 120,60 140,60 C170,60 180,90 180,110 C180,150 140,170 110,170 C70,170 40,140 40,100 C40,50 90,20 130,20" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'infinity',
    name: 'Infinito',
    category: 'Complejas',
    energy: 'calm',
    weight: 'medium',
    colors: ['#5C6BC0', '#7986CB', '#9FA8DA', '#C5CAE9', '#E8EAF6', '#3F51B5'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M100,100 C70,70 30,70 30,100 C30,130 70,130 100,100 C130,70 170,70 170,100 C170,130 130,130 100,100" fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'flower',
    name: 'Flor abstracta',
    category: 'Complejas',
    energy: 'calm',
    weight: 'medium',
    colors: ['#FF69B4', '#FF85C0', '#FFA0CC', '#FFBBDD', '#FFD6E8', '#FFF0F5'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <ellipse cx="100" cy="60" rx="25" ry="40" fill="currentColor"/>
        <ellipse cx="140" cy="80" rx="25" ry="40" fill="currentColor" transform="rotate(60 140 80)"/>
        <ellipse cx="140" cy="120" rx="25" ry="40" fill="currentColor" transform="rotate(120 140 120)"/>
        <ellipse cx="100" cy="140" rx="25" ry="40" fill="currentColor" transform="rotate(180 100 140)"/>
        <ellipse cx="60" cy="120" rx="25" ry="40" fill="currentColor" transform="rotate(240 60 120)"/>
        <ellipse cx="60" cy="80" rx="25" ry="40" fill="currentColor" transform="rotate(300 60 80)"/>
        <circle cx="100" cy="100" r="20" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'vortex',
    name: 'Vórtice',
    category: 'Complejas',
    energy: 'dynamic',
    weight: 'heavy',
    colors: ['#1A1A2E', '#4A4E69', '#9A8C98', '#C9ADA7', '#F2E9E4', '#22223B'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M100,40 Q140,60 150,100 Q140,140 100,160 Q60,140 50,100 Q60,60 100,40" fill="currentColor" opacity="0.3"/>
        <path d="M100,55 Q130,70 140,100 Q130,130 100,145 Q70,130 60,100 Q70,70 100,55" fill="currentColor" opacity="0.5"/>
        <path d="M100,70 Q120,80 130,100 Q120,120 100,130 Q80,120 70,100 Q80,80 100,70" fill="currentColor" opacity="0.7"/>
        <circle cx="100" cy="100" r="20" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'molecule',
    name: 'Molécula',
    category: 'Complejas',
    energy: 'balanced',
    weight: 'light',
    colors: ['#00BCD4', '#26C6DA', '#4DD0E1', '#80DEEA', '#B2EBF2', '#E0F7FA'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="25" fill="currentColor"/>
        <circle cx="50" cy="60" r="18" fill="currentColor" opacity="0.8"/>
        <circle cx="150" cy="60" r="18" fill="currentColor" opacity="0.8"/>
        <circle cx="50" cy="140" r="18" fill="currentColor" opacity="0.8"/>
        <circle cx="150" cy="140" r="18" fill="currentColor" opacity="0.8"/>
        <line x1="100" y1="100" x2="50" y2="60" stroke="currentColor" strokeWidth="6"/>
        <line x1="100" y1="100" x2="150" y2="60" stroke="currentColor" strokeWidth="6"/>
        <line x1="100" y1="100" x2="50" y2="140" stroke="currentColor" strokeWidth="6"/>
        <line x1="100" y1="100" x2="150" y2="140" stroke="currentColor" strokeWidth="6"/>
      </svg>
    )
  },
  {
    id: 'knot',
    name: 'Nudo',
    category: 'Complejas',
    energy: 'balanced',
    weight: 'medium',
    colors: ['#795548', '#8D6E63', '#A1887F', '#BCAAA4', '#D7CCC8', '#EFEBE9'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M60,80 C60,40 140,40 140,80 C140,110 100,110 100,140 C100,170 160,170 160,140" fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round"/>
        <path d="M140,120 C140,160 60,160 60,120 C60,90 100,90 100,60 C100,30 40,30 40,60" fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round" opacity="0.6"/>
      </svg>
    )
  },
  {
    id: 'burst',
    name: 'Estallido',
    category: 'Complejas',
    energy: 'dynamic',
    weight: 'heavy',
    colors: ['#FF5722', '#FF7043', '#FF8A65', '#FFAB91', '#FFCCBC', '#FBE9E7'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const length = i % 2 === 0 ? 70 : 50;
          return (
            <line
              key={angle}
              x1="100"
              y1="100"
              x2={100 + Math.cos(rad) * length}
              y2={100 + Math.sin(rad) * length}
              stroke="currentColor"
              strokeWidth={i % 2 === 0 ? 12 : 8}
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="100" cy="100" r="20" fill="currentColor"/>
      </svg>
    )
  },

  // Fluidas / Líquidas
  {
    id: 'liquid-1',
    name: 'Líquido',
    category: 'Fluidas',
    energy: 'calm',
    weight: 'medium',
    colors: ['#667EEA', '#764BA2', '#6B8DD6', '#8E37D7', '#A855F7', '#C084FC'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M30,100 C30,50 60,30 100,30 C150,30 170,70 170,100 C170,140 150,160 120,170 C80,180 50,160 40,130 C35,115 30,110 30,100" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'splash',
    name: 'Salpicadura',
    category: 'Fluidas',
    energy: 'dynamic',
    weight: 'medium',
    colors: ['#00D2D3', '#54A0FF', '#5F27CD', '#341F97', '#2E86DE', '#0ABDE3'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <ellipse cx="100" cy="120" rx="60" ry="40" fill="currentColor"/>
        <ellipse cx="50" cy="90" rx="20" ry="25" fill="currentColor"/>
        <ellipse cx="150" cy="85" rx="22" ry="28" fill="currentColor"/>
        <circle cx="70" cy="50" r="12" fill="currentColor"/>
        <circle cx="130" cy="45" r="15" fill="currentColor"/>
        <circle cx="100" cy="60" r="10" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'droplets',
    name: 'Gotas',
    category: 'Fluidas',
    energy: 'calm',
    weight: 'light',
    colors: ['#74B9FF', '#A29BFE', '#DFE6E9', '#81ECEC', '#55EFC4', '#00CEC9'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M60,50 C60,50 80,30 80,50 C80,65 60,70 60,50" fill="currentColor"/>
        <path d="M100,80 C100,80 130,50 130,85 C130,110 100,120 100,80" fill="currentColor"/>
        <path d="M50,120 C50,120 70,100 70,125 C70,145 50,150 50,120" fill="currentColor" opacity="0.8"/>
        <path d="M140,110 C140,110 160,90 160,115 C160,135 140,140 140,110" fill="currentColor" opacity="0.7"/>
        <path d="M90,150 C90,150 105,135 105,152 C105,165 90,168 90,150" fill="currentColor" opacity="0.6"/>
      </svg>
    )
  },
  {
    id: 'smoke',
    name: 'Humo',
    category: 'Fluidas',
    energy: 'calm',
    weight: 'light',
    colors: ['#636E72', '#B2BEC3', '#DFE6E9', '#74B9FF', '#A29BFE', '#6C5CE7'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <ellipse cx="100" cy="150" rx="40" ry="20" fill="currentColor" opacity="0.3"/>
        <ellipse cx="90" cy="120" rx="35" ry="25" fill="currentColor" opacity="0.4"/>
        <ellipse cx="110" cy="90" rx="30" ry="25" fill="currentColor" opacity="0.5"/>
        <ellipse cx="95" cy="60" rx="25" ry="20" fill="currentColor" opacity="0.6"/>
        <ellipse cx="105" cy="35" rx="18" ry="15" fill="currentColor" opacity="0.7"/>
      </svg>
    )
  },

  // Retro / Jungle Speed inspired
  {
    id: 'jungle-1',
    name: 'Totem A',
    category: 'Totémicas',
    energy: 'dynamic',
    weight: 'heavy',
    colors: ['#E74C3C', '#F39C12', '#27AE60', '#3498DB', '#9B59B6', '#1ABC9C'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="100,20 130,50 130,90 100,110 70,90 70,50" fill="currentColor"/>
        <polygon points="100,110 140,130 140,170 100,190 60,170 60,130" fill="currentColor" opacity="0.7"/>
        <circle cx="100" cy="65" r="15" fill="currentColor" opacity="0.5"/>
      </svg>
    )
  },
  {
    id: 'jungle-2',
    name: 'Totem B',
    category: 'Totémicas',
    energy: 'balanced',
    weight: 'medium',
    colors: ['#2ECC71', '#1ABC9C', '#16A085', '#27AE60', '#229954', '#1E8449'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M100,30 L130,60 L130,100 L150,130 L130,160 L100,180 L70,160 L50,130 L70,100 L70,60 Z" fill="currentColor"/>
        <circle cx="100" cy="80" r="12" fill="currentColor" opacity="0.5"/>
        <circle cx="100" cy="130" r="12" fill="currentColor" opacity="0.5"/>
      </svg>
    )
  },
  {
    id: 'jungle-3',
    name: 'Totem C',
    category: 'Totémicas',
    energy: 'dynamic',
    weight: 'heavy',
    colors: ['#F1C40F', '#F39C12', '#E67E22', '#D35400', '#E74C3C', '#C0392B'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="100,20 150,60 170,120 140,170 60,170 30,120 50,60" fill="currentColor"/>
        <polygon points="100,50 130,75 140,110 120,145 80,145 60,110 70,75" fill="currentColor" opacity="0.4"/>
      </svg>
    )
  },
  {
    id: 'jungle-4',
    name: 'Totem D',
    category: 'Totémicas',
    energy: 'balanced',
    weight: 'medium',
    colors: ['#3498DB', '#2980B9', '#1F618D', '#154360', '#5DADE2', '#85C1E9'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <ellipse cx="100" cy="50" rx="40" ry="30" fill="currentColor"/>
        <rect x="70" y="50" width="60" height="80" fill="currentColor"/>
        <ellipse cx="100" cy="150" rx="50" ry="30" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'jungle-5',
    name: 'Totem E',
    category: 'Totémicas',
    energy: 'dynamic',
    weight: 'heavy',
    colors: ['#9B59B6', '#8E44AD', '#7D3C98', '#6C3483', '#5B2C6F', '#4A235A'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M100,20 L140,40 L160,80 L160,120 L140,160 L100,180 L60,160 L40,120 L40,80 L60,40 Z" fill="currentColor"/>
        <path d="M100,40 L125,55 L140,85 L140,115 L125,145 L100,160 L75,145 L60,115 L60,85 L75,55 Z" fill="currentColor" opacity="0.5"/>
        <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.3"/>
      </svg>
    )
  },
  {
    id: 'jungle-6',
    name: 'Totem F',
    category: 'Totémicas',
    energy: 'calm',
    weight: 'light',
    colors: ['#1ABC9C', '#48C9B0', '#76D7C4', '#A3E4D7', '#D1F2EB', '#E8F8F5'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M60,100 Q60,40 100,40 Q140,40 140,100 Q140,160 100,160 Q60,160 60,100" fill="currentColor"/>
        <path d="M75,100 Q75,55 100,55 Q125,55 125,100 Q125,145 100,145 Q75,145 75,100" fill="currentColor" opacity="0.5"/>
      </svg>
    )
  },

  // Más formas abstractas
  {
    id: 'abstract-1',
    name: 'Forma A',
    category: 'Abstractas',
    energy: 'balanced',
    weight: 'medium',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M40,80 Q70,30 100,50 T160,80 Q180,120 150,150 T80,160 Q30,140 40,80" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'abstract-2',
    name: 'Forma B',
    category: 'Abstractas',
    energy: 'dynamic',
    weight: 'heavy',
    colors: ['#2D3436', '#636E72', '#B2BEC3', '#DFE6E9', '#00B894', '#00CEC9'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="40,100 70,40 130,40 160,100 130,160 70,160" fill="currentColor"/>
        <polygon points="100,60 130,80 130,120 100,140 70,120 70,80" fill="currentColor" opacity="0.5"/>
      </svg>
    )
  },
  {
    id: 'abstract-3',
    name: 'Forma C',
    category: 'Abstractas',
    energy: 'calm',
    weight: 'light',
    colors: ['#FFEAA7', '#FDCB6E', '#F8B500', '#F39C12', '#E67E22', '#D35400'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="80" cy="80" r="50" fill="currentColor"/>
        <circle cx="120" cy="120" r="50" fill="currentColor" opacity="0.6"/>
      </svg>
    )
  },
  {
    id: 'abstract-4',
    name: 'Forma D',
    category: 'Abstractas',
    energy: 'dynamic',
    weight: 'medium',
    colors: ['#6C5CE7', '#A29BFE', '#74B9FF', '#0984E3', '#00CEC9', '#00B894'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M30,150 L50,50 L100,80 L150,30 L170,130 L120,160 L80,120 Z" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'abstract-5',
    name: 'Forma E',
    category: 'Abstractas',
    energy: 'balanced',
    weight: 'medium',
    colors: ['#E17055', '#FDCB6E', '#00B894', '#0984E3', '#6C5CE7', '#E84393'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="40" y="60" width="50" height="80" rx="10" fill="currentColor"/>
        <rect x="110" y="40" width="50" height="100" rx="10" fill="currentColor" opacity="0.7"/>
        <rect x="75" y="100" width="50" height="60" rx="10" fill="currentColor" opacity="0.5"/>
      </svg>
    )
  },
  {
    id: 'abstract-6',
    name: 'Forma F',
    category: 'Abstractas',
    energy: 'dynamic',
    weight: 'heavy',
    colors: ['#2C3E50', '#E74C3C', '#ECF0F1', '#3498DB', '#2ECC71', '#9B59B6'],
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="100,30 180,100 140,180 60,180 20,100" fill="currentColor"/>
        <polygon points="100,50 155,100 130,160 70,160 45,100" fill="currentColor" opacity="0.4"/>
      </svg>
    )
  }
];

const categories = [
  { id: 'all', name: 'Todas', icon: '✦' },
  { id: 'Orgánicas', name: 'Orgánicas', icon: '🫧', description: 'Suaves y fluidas' },
  { id: 'Angulares', name: 'Angulares', icon: '⚡', description: 'Puntiagudas y dinámicas' },
  { id: 'Geométricas', name: 'Geométricas', icon: '⬡', description: 'Puras y equilibradas' },
  { id: 'Patrones', name: 'Patrones', icon: '▦', description: 'Repetitivas y rítmicas' },
  { id: 'Complejas', name: 'Complejas', icon: '✳', description: 'Intrincadas y detalladas' },
  { id: 'Fluidas', name: 'Fluidas', icon: '💧', description: 'Líquidas y etéreas' },
  { id: 'Totémicas', name: 'Totémicas', icon: '🗿', description: 'Simbólicas y ancestrales' },
  { id: 'Abstractas', name: 'Abstractas', icon: '◈', description: 'Libres y expresivas' }
];

export const ShapesCreator: React.FC<ShapesCreatorProps> = ({
  onComplete,
  onBack,
  colorCount,
  onColorCountChange
}) => {
  const allShapes = useMemo(() => createShapes(), []);
  
  // Modo de selección: tinder o comparativa (declarar primero)
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('tinder');
  
  // Estados SEPARADOS para Tinder y Comparativa
  const [tinderSelectedShapes, setTinderSelectedShapes] = useState<SelectedShape[]>([]);
  const [compareSelectedShapes, setCompareSelectedShapes] = useState<SelectedShape[]>([]);
  
  // Alias dinámico según el modo
  const selectedShapes = selectionMode === 'tinder' ? tinderSelectedShapes : compareSelectedShapes;
  const setSelectedShapes = selectionMode === 'tinder' ? setTinderSelectedShapes : setCompareSelectedShapes;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [discardedIds, setDiscardedIds] = useState<Set<string>>(new Set());
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showAllShapes, setShowAllShapes] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingShapeIndex, setEditingShapeIndex] = useState<number | null>(null);
  const [editingNameIndex, setEditingNameIndex] = useState<number | null>(null);
  const [tempName, setTempName] = useState('');
  const [customName, setCustomName] = useState('');
  const [customColor, setCustomColor] = useState('#6366F1');
  const [showCustomForm, setShowCustomForm] = useState(false);
  
  // selectionMode ya declarado arriba
  const [compareCount, setCompareCount] = useState(3);
  const [compareAction, setCompareAction] = useState<CompareAction>('keep');
  const [compareShapes, setCompareShapes] = useState<Shape[]>([]);
  const [saturationAdjust, setSaturationAdjust] = useState(0);
  const [lightnessAdjust, setLightnessAdjust] = useState(0);

  // Filter shapes by category and not discarded
  const filteredShapes = useMemo(() => {
    return allShapes.filter(s => {
      if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
      return !discardedIds.has(s.id);
    });
  }, [allShapes, selectedCategory, discardedIds]);

  const currentShape = filteredShapes[currentIndex % filteredShapes.length];

  // Generar formas para modo comparativa
  useEffect(() => {
    if (selectionMode === 'compare' && filteredShapes.length >= compareCount) {
      const shuffled = [...filteredShapes].sort(() => Math.random() - 0.5);
      setCompareShapes(shuffled.slice(0, compareCount));
    }
  }, [selectionMode, compareCount, filteredShapes]);

  const refreshCompareShapes = () => {
    if (filteredShapes.length >= compareCount) {
      const shuffled = [...filteredShapes].sort(() => Math.random() - 0.5);
      setCompareShapes(shuffled.slice(0, compareCount));
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (direction === 'left' && currentShape) {
        // Descartar
        setDiscardedIds(prev => new Set([...prev, currentShape.id]));
      } else if (direction === 'right' && currentShape) {
        // Aceptar - añadir a Tu paleta automáticamente
        const alreadySelected = selectedShapes.find(s => s.shape.id === currentShape.id);
        if (!alreadySelected) {
          setSelectedShapes(prev => [...prev, { shape: currentShape, color: currentShape.colors[0] }]);
        }
      }
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 200);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      handleSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };

  const selectColor = (shape: Shape, color: string) => {
    const exists = selectedShapes.find(s => s.shape.id === shape.id);
    if (exists) {
      setSelectedShapes(prev => prev.map(s => 
        s.shape.id === shape.id ? { ...s, color } : s
      ));
    } else {
      setSelectedShapes(prev => [...prev, { shape, color }]);
    }
  };

  const removeShape = (shapeId: string) => {
    setSelectedShapes(prev => prev.filter(s => s.shape.id !== shapeId));
  };

  // Función removida - la edición de color se hace inline ahora

  const updateShapeName = (index: number, name: string) => {
    setSelectedShapes(prev => prev.map((s, i) => 
      i === index ? { ...s, customName: name || undefined } : s
    ));
    setEditingNameIndex(null);
    setTempName('');
  };

  const startEditingName = (index: number) => {
    const shape = selectedShapes[index];
    setTempName(shape.customName || shape.shape.name);
    setEditingNameIndex(index);
  };

  const moveShape = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === selectedShapes.length - 1)) return;
    
    const newShapes = [...selectedShapes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newShapes[index], newShapes[targetIndex]] = [newShapes[targetIndex], newShapes[index]];
    setSelectedShapes(newShapes);
  };

  const restoreAll = () => {
    setDiscardedIds(new Set());
    setCurrentIndex(0);
  };

  // Handle compare mode selection
  const handleCompareSelect = (shape: Shape, selectedColor?: string) => {
    if (compareAction === 'keep') {
      // Mantener esta, descartar las demás
      const toDiscard = compareShapes.filter(s => s.id !== shape.id).map(s => s.id);
      setDiscardedIds(prev => new Set([...prev, ...toDiscard]));
      
      // Añadir la forma seleccionada a "Tu paleta" automáticamente
      const colorToUse = selectedColor || shape.colors[0];
      const alreadySelected = compareSelectedShapes.find(s => s.shape.id === shape.id);
      if (!alreadySelected) {
        setCompareSelectedShapes(prev => [...prev, { shape, color: colorToUse }]);
      }
    } else {
      // Descartar esta - NO añadir a paleta
      setDiscardedIds(prev => new Set([...prev, shape.id]));
    }
    refreshCompareShapes();
  };

  const applyAdjustments = (color: string) => {
    if (saturationAdjust === 0 && lightnessAdjust === 0) return color;
    const hsl = hexToHsl(color);
    return hslToHex(
      hsl.h,
      Math.max(0, Math.min(100, hsl.s + saturationAdjust)),
      Math.max(5, Math.min(95, hsl.l + lightnessAdjust))
    );
  };

  const generatePalettes = () => {
    const baseColors = selectedShapes.slice(0, colorCount).map(s => applyAdjustments(s.color));
    while (baseColors.length < colorCount) {
      const randomShape = allShapes[Math.floor(Math.random() * allShapes.length)];
      baseColors.push(applyAdjustments(randomShape.colors[0]));
    }
    return [
      baseColors,
      baseColors.map((c) => {
        const hsl = hexToHsl(c);
        return hslToHex((hsl.h + 10) % 360, hsl.s, hsl.l);
      }),
      baseColors.map((c) => {
        const hsl = hexToHsl(c);
        return hslToHex(hsl.h, Math.min(100, hsl.s + 10), hsl.l);
      })
    ];
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const suggestedPalettes = useMemo(() => generatePalettes(), [selectedShapes, colorCount, saturationAdjust, lightnessAdjust]);

  const addCustomShape = () => {
    if (!customName.trim()) return;
    const customShape: Shape = {
      id: `custom-${Date.now()}`,
      name: customName,
      category: 'Abstractas',
      energy: 'balanced',
      weight: 'medium',
      colors: [customColor],
      svg: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="60" fill="currentColor"/>
          <text x="100" y="108" textAnchor="middle" fontSize="24" fill="white">✦</text>
        </svg>
      )
    };
    setSelectedShapes(prev => [...prev, { shape: customShape, color: customColor }]);
    setCustomName('');
    setShowCustomForm(false);
  };

  return (
    <div className="h-full flex gap-6">
      {/* Left Column - Cards */}
      <div className="flex-1 flex flex-col">
        {/* Mode selector */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => setSelectionMode('tinder')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectionMode === 'tinder'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎴 Tinder
            </button>
            <button
              onClick={() => setSelectionMode('compare')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectionMode === 'compare'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ⚖️ Comparativa
            </button>
          </div>

          {selectionMode === 'compare' && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Mostrar:</span>
              <div className="flex gap-1">
                {[2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setCompareCount(n)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      compareCount === n
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="h-6 w-px bg-gray-700" />
              <span className="text-sm text-gray-400">Acción:</span>
              <div className="flex bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setCompareAction('keep')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    compareAction === 'keep'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ✓ Mantener 1
                </button>
                <button
                  onClick={() => setCompareAction('discard')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    compareAction === 'discard'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ✗ Descartar 1
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Panel de estadísticas destacado */}
        <div className="mb-4 p-3 bg-gradient-to-r from-gray-800/80 to-gray-800/40 rounded-xl border border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <span className="text-xl">◈</span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Formas disponibles</p>
                <p className="text-xl font-bold text-white">{filteredShapes.length}</p>
              </div>
            </div>
            
            {discardedIds.size > 0 && (
              <>
                <div className="h-8 w-px bg-gray-700" />
                <div>
                  <p className="text-xs text-gray-400">Descartadas</p>
                  <p className="text-xl font-bold text-red-400">{discardedIds.size}</p>
                </div>
              </>
            )}
            
            <div className="h-8 w-px bg-gray-700" />
            <div>
              <p className="text-xs text-gray-400">Seleccionadas</p>
              <p className="text-xl font-bold text-green-400">{selectedShapes.length}</p>
            </div>
          </div>
          
          {discardedIds.size > 0 && (
            <button
              onClick={restoreAll}
              className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>↩</span> Restaurar todas
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentIndex(0);
                  if (selectionMode === 'compare') refreshCompareShapes();
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Card area */}
        <div className="flex-1 relative flex items-center justify-center min-h-[400px]">
          {filteredShapes.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-400 mb-4">No hay más formas en esta categoría</p>
              <button
                onClick={restoreAll}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
              >
                Restaurar todas
              </button>
            </div>
          ) : selectionMode === 'tinder' ? (
            // Modo Tinder
            <>
              {/* Background cards */}
              {[2, 1].map(offset => {
                const shape = filteredShapes[(currentIndex + offset) % filteredShapes.length];
                if (!shape) return null;
                return (
                  <div
                    key={offset}
                    className="absolute w-full max-w-sm aspect-[3/4] bg-gray-800/50 rounded-2xl border border-gray-700/50"
                    style={{
                      transform: `scale(${1 - offset * 0.05}) translateY(${offset * 10}px)`,
                      zIndex: -offset
                    }}
                  />
                );
              })}

              {/* Active card */}
              {currentShape && (
                <motion.div
                  key={currentShape.id + currentIndex}
                  className="w-full max-w-sm aspect-[3/4] bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden cursor-grab active:cursor-grabbing relative"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  animate={{
                    x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0,
                    opacity: swipeDirection ? 0 : 1,
                    rotate: swipeDirection === 'left' ? -15 : swipeDirection === 'right' ? 15 : 0
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Swipe indicators */}
                  <motion.div
                    className="absolute top-4 left-4 px-4 py-2 bg-red-500/90 text-white font-bold rounded-lg z-10"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: swipeDirection === 'left' ? 1 : 0, scale: 1 }}
                  >
                    DESCARTAR
                  </motion.div>
                  <motion.div
                    className="absolute top-4 right-4 px-4 py-2 bg-green-500/90 text-white font-bold rounded-lg z-10"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: swipeDirection === 'right' ? 1 : 0, scale: 1 }}
                  >
                    SIGUIENTE
                  </motion.div>

                  {/* Card content */}
                  <div className="h-full flex flex-col p-4">
                    {/* Header */}
                    <div className="text-center mb-3">
                      <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                        {currentShape.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2">{currentShape.name}</h3>
                      <div className="flex gap-2 justify-center mt-1">
                        <span className="text-xs text-gray-400">
                          {currentShape.energy === 'calm' ? '😌 Calma' : currentShape.energy === 'balanced' ? '⚖️ Equilibrio' : '⚡ Dinamismo'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {currentShape.weight === 'light' ? '🪶 Ligero' : currentShape.weight === 'medium' ? '◐ Medio' : '◉ Pesado'}
                        </span>
                      </div>
                    </div>

                    {/* Shape preview */}
                    <div className="flex-1 flex items-center justify-center p-4">
                      <div 
                        className="w-40 h-40 transition-colors"
                        style={{ color: currentShape.colors[0] }}
                      >
                        {currentShape.svg}
                      </div>
                    </div>

                    {/* Color options */}
                    <div className="mt-auto">
                      <p className="text-xs text-gray-400 text-center mb-2">Elige un color para añadir:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {currentShape.colors.map((color, i) => {
                          const isSelected = selectedShapes.some(
                            s => s.shape.id === currentShape.id && s.color === color
                          );
                          return (
                            <button
                              key={i}
                              onClick={() => selectColor(currentShape, color)}
                              className={`w-10 h-10 rounded-lg transition-all border-2 ${
                                isSelected 
                                  ? 'border-white scale-110 ring-2 ring-purple-500' 
                                  : 'border-transparent hover:scale-105'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          );
                        })}
                        <label className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors border-2 border-dashed border-gray-500">
                          <span className="text-lg">+</span>
                          <input
                            type="color"
                            className="sr-only"
                            onChange={(e) => selectColor(currentShape, e.target.value)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            // Modo Comparativa
            <div className="w-full">
              {/* Formas seleccionadas (arriba de las opciones) */}
              {selectedShapes.length > 0 && (
                <div className="mb-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-2">Formas seleccionadas ({selectedShapes.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedShapes.map((item, idx) => (
                      <div 
                        key={item.shape.id + idx}
                        className="flex items-center gap-2 px-2 py-1 bg-gray-700/50 rounded-lg group"
                      >
                        <div className="w-5 h-5" style={{ color: item.color }}>
                          {item.shape.svg}
                        </div>
                        <span 
                          className="text-xs text-white cursor-pointer hover:text-purple-300"
                          onClick={() => startEditingName(idx)}
                          title="Click para editar nombre"
                        >
                          {item.customName || item.shape.name}
                        </span>
                        <button
                          onClick={() => removeShape(item.shape.id)}
                          className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-center mb-4">
                <p className="text-gray-400">
                  {compareAction === 'keep' 
                    ? '👆 Selecciona la forma que quieres MANTENER (las demás se descartarán)'
                    : '👇 Selecciona la forma que quieres DESCARTAR (las demás se mantendrán)'}
                </p>
              </div>
              
              {/* Mensaje cuando no hay suficientes formas */}
              {filteredShapes.length < compareCount && filteredShapes.length > 0 && (
                <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                  <p className="text-amber-300 text-sm">
                    Solo quedan {filteredShapes.length} formas disponibles
                  </p>
                </div>
              )}
              
              {/* Mensaje cuando no quedan formas */}
              {filteredShapes.length === 0 && (
                <div className="mb-4 p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-gray-400 mb-2">¡Has revisado todas las formas!</p>
                  <button
                    onClick={restoreAll}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
                  >
                    Restaurar todas
                  </button>
                </div>
              )}
              
              <div className={`grid gap-4 ${
                compareCount === 2 ? 'grid-cols-2 max-w-2xl' :
                compareCount === 3 ? 'grid-cols-3 max-w-3xl' :
                compareCount === 4 ? 'grid-cols-4 max-w-4xl' :
                'grid-cols-5 max-w-5xl'
              } mx-auto`}>
                {/* Slots de formas */}
                {Array.from({ length: compareCount }).map((_, slotIndex) => {
                  const shape = compareShapes[slotIndex];
                  
                  // Si no hay forma para este slot, mostrar slot vacío
                  if (!shape) {
                    return (
                      <div
                        key={`empty-${slotIndex}`}
                        className="bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700/50 p-4 flex flex-col items-center justify-center min-h-[200px]"
                      >
                        <div className="text-gray-600 text-4xl mb-2">◌</div>
                        <p className="text-gray-500 text-xs text-center">
                          No hay más formas
                        </p>
                      </div>
                    );
                  }
                  
                  return (
                  <motion.div
                    key={shape.id}
                    className="bg-gray-800 rounded-xl border border-gray-700 p-4 cursor-pointer hover:border-purple-500 transition-all group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center mb-2">
                      <span className="text-xs text-purple-400">{shape.category}</span>
                      <h4 className="text-sm font-semibold text-white">{shape.name}</h4>
                    </div>
                    <div 
                      className="w-20 h-20 mx-auto mb-3"
                      style={{ color: shape.colors[0] }}
                    >
                      {shape.svg}
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center mb-3">
                      {shape.colors.slice(0, 4).map((color, i) => {
                        const isSelected = compareSelectedShapes.some(
                          s => s.shape.id === shape.id && s.color === color
                        );
                        return (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              // En modo keep, al seleccionar un color se mantiene la forma
                              if (compareAction === 'keep') {
                                handleCompareSelect(shape, color);
                              } else {
                                selectColor(shape, color);
                              }
                            }}
                            className={`w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform ${
                              isSelected ? 'border-white ring-2 ring-purple-500' : 'border-white/20'
                            }`}
                            style={{ backgroundColor: color }}
                            title={compareAction === 'keep' ? 'Mantener con este color' : 'Seleccionar color'}
                          />
                        );
                      })}
                    </div>
                    <button
                      onClick={() => handleCompareSelect(shape)}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                        compareAction === 'keep'
                          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/40 group-hover:bg-green-600 group-hover:text-white'
                          : 'bg-red-600/20 text-red-400 hover:bg-red-600/40 group-hover:bg-red-600 group-hover:text-white'
                      }`}
                    >
                      {compareAction === 'keep' ? '✓ Mantener' : '✗ Descartar'}
                    </button>
                  </motion.div>
                );
                })}
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={refreshCompareShapes}
                  className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
                >
                  🔄 Otras formas
                </button>
                <button
                  onClick={() => setShowAllShapes(true)}
                  className="px-4 py-2 bg-purple-600/30 text-purple-300 rounded-lg hover:bg-purple-600/50 transition-colors"
                >
                  Ver todas ({allShapes.length})
                </button>
              </div>
              
              {/* Aviso cuando quedan pocas formas */}
              {filteredShapes.length < compareCount && (
                <div className="text-center mt-3 text-sm">
                  <span className="text-amber-400">
                    ⚠️ Solo quedan {filteredShapes.length} formas disponibles
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation buttons (solo en modo Tinder) */}
        {selectionMode === 'tinder' && (
          <>
            {/* Indicador animado de swipe */}
            <div className="flex justify-center mb-2 mt-4">
              <motion.div
                animate={{ x: [-10, 10, -10] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-2 text-gray-500 text-xs"
              >
                <span>← Descartar</span>
                <span className="text-gray-600">|</span>
                <span>Desliza</span>
                <span className="text-gray-600">|</span>
                <span>Añadir →</span>
              </motion.div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleSwipe('left')}
                className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors text-2xl"
                title="Descartar forma"
              >
                ✗
              </button>
              <button
                onClick={() => setShowAllShapes(true)}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-full hover:bg-gray-600/50 transition-colors text-sm"
              >
                Ver todas ({allShapes.length})
              </button>
              <button
                onClick={() => handleSwipe('right')}
                className="w-14 h-14 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/30 transition-colors text-2xl"
                title="Añadir a paleta"
              >
                ✓
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right Column - Fixed Panel */}
      <div className="w-80 flex flex-col gap-4">
        {/* Custom shape */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/30 rounded-xl border border-purple-500/30 p-4">
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="w-full flex items-center gap-3 text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/30 flex items-center justify-center text-purple-300">
              ✦
            </div>
            <div>
              <h3 className="font-semibold text-white">Crear forma personalizada</h3>
              <p className="text-xs text-gray-400">Añade tu propio concepto</p>
            </div>
            <motion.span
              className="ml-auto text-gray-400"
              animate={{ rotate: showCustomForm ? 180 : 0 }}
            >
              ▼
            </motion.span>
          </button>
          
          <AnimatePresence>
            {showCustomForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Nombre de la forma"
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm"
                  />
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm font-mono"
                    />
                  </div>
                  <button
                    onClick={addCustomShape}
                    disabled={!customName.trim()}
                    className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Añadir forma
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected shapes */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">
              Tu paleta ({selectedShapes.length} formas)
            </h3>
            <div className="flex items-center gap-2">
              {selectedShapes.length > 0 && (
                <ExportCreatorResults
                  type="shapes-tinder"
                  paletteName="Formas"
                  selectedItems={selectedShapes.map(s => ({
                    id: s.shape.id,
                    name: s.shape.name,
                    customName: s.customName,
                    color: s.color,
                    category: s.shape.category,
                    svg: s.shape.svg
                  }))}
                  suggestedPalettes={suggestedPalettes}
                  colorCount={colorCount}
                />
              )}
              {selectedShapes.length > 0 && (
                <button
                  onClick={() => setSelectedShapes([])}
                  className="text-xs text-gray-400 hover:text-red-400"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            💡 Haz doble clic en el nombre para personalizarlo
          </p>

          <div className="flex-1 overflow-y-auto max-h-[250px] space-y-2">
            {selectedShapes.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                Desliza las tarjetas y selecciona colores
              </p>
            ) : (
              selectedShapes.map((item, index) => (
                <div key={item.shape.id + index} className="flex items-center gap-2 p-2 bg-gray-700/30 rounded-lg group">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveShape(index, 'up')}
                      disabled={index === 0}
                      className="text-gray-500 hover:text-white disabled:opacity-30 text-xs"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveShape(index, 'down')}
                      disabled={index === selectedShapes.length - 1}
                      className="text-gray-500 hover:text-white disabled:opacity-30 text-xs"
                    >
                      ▼
                    </button>
                  </div>
                  
                  <div 
                    className="w-8 h-8 flex-shrink-0"
                    style={{ color: item.color }}
                  >
                    {item.shape.svg}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {editingNameIndex === index ? (
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={() => updateShapeName(index, tempName)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') updateShapeName(index, tempName);
                          if (e.key === 'Escape') setEditingNameIndex(null);
                        }}
                        className="w-full px-2 py-1 bg-gray-800 border border-purple-500 rounded text-sm text-white"
                        autoFocus
                      />
                    ) : (
                      <p 
                        className="text-sm text-white truncate cursor-pointer hover:text-purple-300"
                        onDoubleClick={() => startEditingName(index)}
                        title="Doble clic para editar nombre"
                      >
                        {item.customName || item.shape.name}
                        {item.customName && <span className="text-purple-400 ml-1">✎</span>}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setEditingShapeIndex(editingShapeIndex === index ? null : index)}
                      className="w-6 h-6 rounded-full flex-shrink-0 border-2 border-white/30 hover:border-white transition-colors"
                      style={{ backgroundColor: item.color }}
                    />
                    
                    {editingShapeIndex === index && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-full mr-2 top-0 z-50 bg-gray-800 border border-gray-700 rounded-xl p-3 shadow-xl w-56"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400 font-medium">Opciones de color</p>
                            <button
                              onClick={() => setEditingShapeIndex(null)}
                              className="text-gray-500 hover:text-white text-xs"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="grid grid-cols-6 gap-1">
                            {item.shape.colors.map((color, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  setSelectedShapes(prev => prev.map((s, idx) => 
                                    idx === index ? { ...s, color } : s
                                  ));
                                }}
                                className={`w-7 h-7 rounded-md border-2 transition-all ${
                                  item.color === color ? 'border-white scale-110' : 'border-transparent hover:border-gray-400'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="flex gap-2 pt-2 border-t border-gray-700">
                            <input
                              type="color"
                              value={item.color}
                              onChange={(e) => {
                                setSelectedShapes(prev => prev.map((s, idx) => 
                                  idx === index ? { ...s, color: e.target.value } : s
                                ));
                              }}
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={item.color}
                              onChange={(e) => {
                                if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                                  setSelectedShapes(prev => prev.map((s, idx) => 
                                    idx === index ? { ...s, color: e.target.value } : s
                                  ));
                                }
                              }}
                              className="flex-1 px-2 py-1 bg-gray-700 rounded text-xs font-mono text-white"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <button
                    onClick={() => removeShape(item.shape.id)}
                    className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Color count - Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Colores en paleta</span>
            </div>
            <div className="flex gap-1">
              {[3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => onColorCountChange(num)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    colorCount === num
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            
            {/* Saturation & Lightness sliders */}
            <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-3">
              <div>
                <label className="text-xs text-gray-400 flex justify-between mb-1">
                  <span>Saturación</span>
                  <span>{saturationAdjust > 0 ? '+' : ''}{saturationAdjust}%</span>
                </label>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  value={saturationAdjust}
                  onChange={(e) => setSaturationAdjust(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(270, 0%, 50%),
                      hsl(270, 50%, 50%),
                      hsl(270, 100%, 50%))`
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 flex justify-between mb-1">
                  <span>Luminosidad</span>
                  <span>{lightnessAdjust > 0 ? '+' : ''}{lightnessAdjust}%</span>
                </label>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={lightnessAdjust}
                  onChange={(e) => setLightnessAdjust(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(270, 70%, 15%),
                      hsl(270, 70%, 50%),
                      hsl(270, 70%, 85%))`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Suggested palettes */}
        {selectedShapes.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <h3 className="font-semibold text-white mb-3">Paletas sugeridas</h3>
            <div className="space-y-2">
              {suggestedPalettes.map((palette, i) => (
                <button
                  key={i}
                  onClick={() => onComplete(palette)}
                  className="w-full flex gap-0.5 h-10 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
                >
                  {palette.map((color, j) => (
                    <div key={j} className="flex-1 h-full" style={{ backgroundColor: color }} />
                  ))}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-colors font-medium"
          >
            ← Volver
          </button>
          <button
            onClick={() => {
              const colors = selectedShapes.slice(0, colorCount).map(s => s.color);
              while (colors.length < colorCount) {
                colors.push(allShapes[Math.floor(Math.random() * allShapes.length)].colors[0]);
              }
              onComplete(colors);
            }}
            disabled={selectedShapes.length === 0}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            Usar paleta →
          </button>
        </div>
      </div>

      {/* Modal - All shapes */}
      <AnimatePresence>
        {showAllShapes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAllShapes(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Todas las formas</h3>
                <button
                  onClick={() => setShowAllShapes(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 border-b border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                  {allShapes
                    .filter(s => selectedCategory === 'all' || s.category === selectedCategory)
                    .map((shape) => {
                      const isDiscarded = discardedIds.has(shape.id);
                      const selected = selectedShapes.find(s => s.shape.id === shape.id);
                      
                      return (
                        <div
                          key={shape.id}
                          className={`relative p-3 rounded-xl border transition-all ${
                            isDiscarded 
                              ? 'bg-gray-800/30 border-gray-700/30 opacity-50' 
                              : selected
                                ? 'bg-purple-900/30 border-purple-500/50'
                                : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
                          }`}
                        >
                          {isDiscarded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-red-400 text-3xl rotate-12">✗</span>
                            </div>
                          )}
                          
                          <div 
                            className="w-12 h-12 mx-auto mb-2"
                            style={{ color: selected?.color || shape.colors[0] }}
                          >
                            {shape.svg}
                          </div>
                          <p className="text-xs text-center text-gray-400 truncate">{shape.name}</p>
                          
                          <div className="flex gap-1 mt-2 justify-center flex-wrap">
                            {shape.colors.slice(0, 4).map((color, i) => (
                              <button
                                key={i}
                                onClick={() => selectColor(shape, color)}
                                className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>

                          {isDiscarded && (
                            <button
                              onClick={() => setDiscardedIds(prev => {
                                const next = new Set(prev);
                                next.delete(shape.id);
                                return next;
                              })}
                              className="absolute top-1 right-1 text-xs text-purple-400 hover:text-purple-300"
                            >
                              ↩
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShapesCreator;
