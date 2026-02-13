// Base de datos de asociaciones Color-Concepto
// Cada color tiene un valor HSL base y puede asociarse a múltiples conceptos

export interface ColorAssociation {
  id: string;
  name: string;
  hsl: { h: number; s: number; l: number };
  hex: string;
  concepts: string[];
}

export interface ConceptCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  concepts: Concept[];
}

export interface Concept {
  id: string;
  name: string;
  description: string;
}

// Categorías de conceptos
export const conceptCategories: ConceptCategory[] = [
  {
    id: 'emotional',
    name: 'Emocionales',
    icon: '💝',
    description: 'Estados emocionales y sentimientos',
    concepts: [
      { id: 'joy', name: 'Alegría', description: 'Felicidad, optimismo, diversión' },
      { id: 'calm', name: 'Calma', description: 'Paz, serenidad, tranquilidad' },
      { id: 'passion', name: 'Pasión', description: 'Amor intenso, deseo, fervor' },
      { id: 'melancholy', name: 'Melancolía', description: 'Nostalgia, tristeza suave' },
      { id: 'excitement', name: 'Emoción', description: 'Entusiasmo, expectación' },
      { id: 'comfort', name: 'Confort', description: 'Comodidad, calidez hogareña' },
      { id: 'hope', name: 'Esperanza', description: 'Optimismo hacia el futuro' },
      { id: 'mystery', name: 'Misterio', description: 'Intriga, lo desconocido' },
    ]
  },
  {
    id: 'cognitive',
    name: 'Cognitivas',
    icon: '🧠',
    description: 'Estados mentales y procesos de pensamiento',
    concepts: [
      { id: 'focus', name: 'Concentración', description: 'Enfoque, atención plena' },
      { id: 'creativity', name: 'Creatividad', description: 'Imaginación, innovación' },
      { id: 'clarity', name: 'Claridad', description: 'Lucidez, comprensión' },
      { id: 'wisdom', name: 'Sabiduría', description: 'Conocimiento profundo' },
      { id: 'curiosity', name: 'Curiosidad', description: 'Exploración, descubrimiento' },
      { id: 'intuition', name: 'Intuición', description: 'Percepción instintiva' },
      { id: 'logic', name: 'Lógica', description: 'Razón, análisis' },
      { id: 'dream', name: 'Ensueño', description: 'Fantasía, imaginación' },
    ]
  },
  {
    id: 'social',
    name: 'Sociales',
    icon: '👥',
    description: 'Relaciones y dinámicas sociales',
    concepts: [
      { id: 'trust', name: 'Confianza', description: 'Fiabilidad, seguridad' },
      { id: 'authority', name: 'Autoridad', description: 'Liderazgo, poder' },
      { id: 'friendship', name: 'Amistad', description: 'Conexión, camaradería' },
      { id: 'rebellion', name: 'Rebeldía', description: 'Inconformismo, ruptura' },
      { id: 'unity', name: 'Unidad', description: 'Comunidad, pertenencia' },
      { id: 'independence', name: 'Independencia', description: 'Autonomía, libertad' },
      { id: 'empathy', name: 'Empatía', description: 'Comprensión, conexión' },
      { id: 'prestige', name: 'Prestigio', description: 'Estatus, reconocimiento' },
    ]
  },
  {
    id: 'aspirational',
    name: 'Aspiracionales',
    icon: '⭐',
    description: 'Metas, valores y aspiraciones',
    concepts: [
      { id: 'luxury', name: 'Lujo', description: 'Exclusividad, refinamiento' },
      { id: 'success', name: 'Éxito', description: 'Logro, victoria' },
      { id: 'growth', name: 'Crecimiento', description: 'Evolución, desarrollo' },
      { id: 'innovation', name: 'Innovación', description: 'Vanguardia, futuro' },
      { id: 'sustainability', name: 'Sostenibilidad', description: 'Ecología, respeto' },
      { id: 'authenticity', name: 'Autenticidad', description: 'Genuino, real' },
      { id: 'adventure', name: 'Aventura', description: 'Exploración, riesgo' },
      { id: 'balance', name: 'Equilibrio', description: 'Armonía, estabilidad' },
    ]
  },
  {
    id: 'sensorial',
    name: 'Sensoriales',
    icon: '✨',
    description: 'Experiencias sensoriales y físicas',
    concepts: [
      { id: 'warmth', name: 'Calidez', description: 'Temperatura cálida, acogedor' },
      { id: 'freshness', name: 'Frescura', description: 'Frío agradable, limpio' },
      { id: 'softness', name: 'Suavidad', description: 'Textura delicada, gentil' },
      { id: 'energy', name: 'Energía', description: 'Vitalidad, dinamismo' },
      { id: 'sweetness', name: 'Dulzura', description: 'Sabor dulce, delicado' },
      { id: 'intensity', name: 'Intensidad', description: 'Fuerza, potencia' },
      { id: 'lightness', name: 'Ligereza', description: 'Liviano, etéreo' },
      { id: 'depth', name: 'Profundidad', description: 'Denso, sustancial' },
    ]
  },
  {
    id: 'symbolic',
    name: 'Simbólicas',
    icon: '🔮',
    description: 'Símbolos, arquetipos y significados culturales',
    concepts: [
      { id: 'nature', name: 'Naturaleza', description: 'Orgánico, vida natural' },
      { id: 'technology', name: 'Tecnología', description: 'Digital, futurista' },
      { id: 'royalty', name: 'Realeza', description: 'Nobleza, majestuosidad' },
      { id: 'spirituality', name: 'Espiritualidad', description: 'Trascendencia, sagrado' },
      { id: 'purity', name: 'Pureza', description: 'Inocencia, limpieza' },
      { id: 'danger', name: 'Peligro', description: 'Alerta, advertencia' },
      { id: 'earth', name: 'Tierra', description: 'Terrenal, orgánico' },
      { id: 'cosmos', name: 'Cosmos', description: 'Universo, infinito' },
    ]
  },
  {
    id: 'temporal',
    name: 'Temporales',
    icon: '⏳',
    description: 'Épocas, estaciones y momentos',
    concepts: [
      { id: 'spring', name: 'Primavera', description: 'Renacimiento, florecimiento' },
      { id: 'summer', name: 'Verano', description: 'Plenitud, vitalidad' },
      { id: 'autumn', name: 'Otoño', description: 'Madurez, transformación' },
      { id: 'winter', name: 'Invierno', description: 'Introspección, quietud' },
      { id: 'dawn', name: 'Amanecer', description: 'Comienzo, despertar' },
      { id: 'dusk', name: 'Atardecer', description: 'Cierre, reflexión' },
      { id: 'vintage', name: 'Vintage', description: 'Retro, nostálgico' },
      { id: 'futuristic', name: 'Futurista', description: 'Vanguardia, mañana' },
    ]
  },
  {
    id: 'aesthetic',
    name: 'Estéticas',
    icon: '🎨',
    description: 'Estilos visuales y movimientos artísticos',
    concepts: [
      { id: 'minimalist', name: 'Minimalista', description: 'Simplicidad, esencial' },
      { id: 'maximalist', name: 'Maximalista', description: 'Abundancia, expresivo' },
      { id: 'organic', name: 'Orgánico', description: 'Fluido, natural' },
      { id: 'geometric', name: 'Geométrico', description: 'Estructurado, preciso' },
      { id: 'romantic', name: 'Romántico', description: 'Delicado, emotivo' },
      { id: 'industrial', name: 'Industrial', description: 'Raw, urbano' },
      { id: 'bohemian', name: 'Bohemio', description: 'Libre, ecléctico' },
      { id: 'nordic', name: 'Nórdico', description: 'Funcional, hygge' },
    ]
  }
];

// Base de datos de colores con sus asociaciones conceptuales
export const colorDatabase: ColorAssociation[] = [
  // ROJOS
  { id: 'crimson', name: 'Carmesí', hsl: { h: 348, s: 83, l: 47 }, hex: '#DC143C', 
    concepts: ['passion', 'danger', 'intensity', 'rebellion', 'energy'] },
  { id: 'coral', name: 'Coral', hsl: { h: 16, s: 100, l: 66 }, hex: '#FF7F50', 
    concepts: ['joy', 'warmth', 'friendship', 'summer', 'sweetness'] },
  { id: 'rose', name: 'Rosa', hsl: { h: 350, s: 100, l: 88 }, hex: '#FFE4E1', 
    concepts: ['softness', 'romantic', 'purity', 'comfort', 'empathy'] },
  { id: 'burgundy', name: 'Borgoña', hsl: { h: 345, s: 80, l: 25 }, hex: '#800020', 
    concepts: ['luxury', 'royalty', 'depth', 'wisdom', 'autumn'] },
  { id: 'salmon', name: 'Salmón', hsl: { h: 6, s: 93, l: 71 }, hex: '#FA8072', 
    concepts: ['warmth', 'comfort', 'organic', 'spring', 'sweetness'] },
  { id: 'scarlet', name: 'Escarlata', hsl: { h: 4, s: 100, l: 50 }, hex: '#FF2400', 
    concepts: ['passion', 'excitement', 'danger', 'energy', 'intensity'] },
  { id: 'ruby', name: 'Rubí', hsl: { h: 337, s: 90, l: 41 }, hex: '#9B111E', 
    concepts: ['luxury', 'passion', 'prestige', 'depth', 'royalty'] },
  
  // NARANJAS
  { id: 'tangerine', name: 'Mandarina', hsl: { h: 28, s: 100, l: 55 }, hex: '#FF9966', 
    concepts: ['joy', 'energy', 'creativity', 'summer', 'excitement'] },
  { id: 'peach', name: 'Melocotón', hsl: { h: 28, s: 100, l: 86 }, hex: '#FFDAB9', 
    concepts: ['softness', 'warmth', 'comfort', 'sweetness', 'romantic'] },
  { id: 'amber', name: 'Ámbar', hsl: { h: 45, s: 100, l: 51 }, hex: '#FFBF00', 
    concepts: ['warmth', 'autumn', 'earth', 'vintage', 'wisdom'] },
  { id: 'rust', name: 'Óxido', hsl: { h: 20, s: 75, l: 35 }, hex: '#B7410E', 
    concepts: ['earth', 'autumn', 'vintage', 'authenticity', 'industrial'] },
  { id: 'terracotta', name: 'Terracota', hsl: { h: 16, s: 65, l: 50 }, hex: '#E2725B', 
    concepts: ['earth', 'warmth', 'organic', 'authenticity', 'bohemian'] },
  { id: 'apricot', name: 'Albaricoque', hsl: { h: 24, s: 100, l: 75 }, hex: '#FBCEB1', 
    concepts: ['softness', 'sweetness', 'spring', 'comfort', 'lightness'] },
  
  // AMARILLOS
  { id: 'gold', name: 'Dorado', hsl: { h: 51, s: 100, l: 50 }, hex: '#FFD700', 
    concepts: ['luxury', 'success', 'prestige', 'warmth', 'royalty'] },
  { id: 'lemon', name: 'Limón', hsl: { h: 54, s: 100, l: 67 }, hex: '#FFF44F', 
    concepts: ['joy', 'energy', 'freshness', 'spring', 'clarity'] },
  { id: 'cream', name: 'Crema', hsl: { h: 39, s: 77, l: 90 }, hex: '#FFFDD0', 
    concepts: ['purity', 'softness', 'calm', 'comfort', 'minimalist'] },
  { id: 'mustard', name: 'Mostaza', hsl: { h: 46, s: 80, l: 45 }, hex: '#FFDB58', 
    concepts: ['vintage', 'warmth', 'autumn', 'bohemian', 'earth'] },
  { id: 'honey', name: 'Miel', hsl: { h: 40, s: 90, l: 55 }, hex: '#EB9605', 
    concepts: ['warmth', 'sweetness', 'comfort', 'organic', 'nature'] },
  { id: 'canary', name: 'Canario', hsl: { h: 56, s: 100, l: 65 }, hex: '#FFEF00', 
    concepts: ['joy', 'energy', 'excitement', 'summer', 'lightness'] },
  
  // VERDES
  { id: 'emerald', name: 'Esmeralda', hsl: { h: 140, s: 70, l: 40 }, hex: '#50C878', 
    concepts: ['nature', 'growth', 'luxury', 'hope', 'balance'] },
  { id: 'mint', name: 'Menta', hsl: { h: 150, s: 50, l: 80 }, hex: '#98FF98', 
    concepts: ['freshness', 'calm', 'spring', 'lightness', 'purity'] },
  { id: 'forest', name: 'Bosque', hsl: { h: 120, s: 60, l: 25 }, hex: '#228B22', 
    concepts: ['nature', 'depth', 'sustainability', 'earth', 'wisdom'] },
  { id: 'sage', name: 'Salvia', hsl: { h: 135, s: 25, l: 55 }, hex: '#9DC183', 
    concepts: ['calm', 'nature', 'organic', 'nordic', 'balance'] },
  { id: 'olive', name: 'Oliva', hsl: { h: 60, s: 40, l: 35 }, hex: '#808000', 
    concepts: ['earth', 'nature', 'vintage', 'authenticity', 'autumn'] },
  { id: 'lime', name: 'Lima', hsl: { h: 75, s: 100, l: 50 }, hex: '#32CD32', 
    concepts: ['energy', 'freshness', 'spring', 'excitement', 'innovation'] },
  { id: 'teal', name: 'Teal', hsl: { h: 180, s: 100, l: 25 }, hex: '#008080', 
    concepts: ['sophistication', 'calm', 'balance', 'technology', 'clarity'] },
  { id: 'jade', name: 'Jade', hsl: { h: 158, s: 55, l: 45 }, hex: '#00A86B', 
    concepts: ['nature', 'luxury', 'spirituality', 'balance', 'wisdom'] },
  
  // AZULES
  { id: 'navy', name: 'Marino', hsl: { h: 220, s: 80, l: 25 }, hex: '#000080', 
    concepts: ['authority', 'trust', 'depth', 'logic', 'prestige'] },
  { id: 'sky', name: 'Cielo', hsl: { h: 200, s: 80, l: 75 }, hex: '#87CEEB', 
    concepts: ['calm', 'freshness', 'hope', 'lightness', 'clarity'] },
  { id: 'cobalt', name: 'Cobalto', hsl: { h: 215, s: 100, l: 45 }, hex: '#0047AB', 
    concepts: ['trust', 'focus', 'technology', 'authority', 'intensity'] },
  { id: 'azure', name: 'Azur', hsl: { h: 210, s: 100, l: 60 }, hex: '#007FFF', 
    concepts: ['clarity', 'technology', 'innovation', 'freshness', 'trust'] },
  { id: 'powder', name: 'Polvo', hsl: { h: 200, s: 60, l: 90 }, hex: '#B0E0E6', 
    concepts: ['softness', 'calm', 'purity', 'winter', 'lightness'] },
  { id: 'cerulean', name: 'Cerúleo', hsl: { h: 193, s: 90, l: 55 }, hex: '#007BA7', 
    concepts: ['calm', 'clarity', 'focus', 'nature', 'summer'] },
  { id: 'denim', name: 'Denim', hsl: { h: 215, s: 50, l: 45 }, hex: '#1560BD', 
    concepts: ['trust', 'authenticity', 'casual', 'friendship', 'independence'] },
  { id: 'electric', name: 'Eléctrico', hsl: { h: 210, s: 100, l: 50 }, hex: '#007BFF', 
    concepts: ['technology', 'innovation', 'energy', 'futuristic', 'excitement'] },
  
  // PÚRPURAS/VIOLETAS
  { id: 'lavender', name: 'Lavanda', hsl: { h: 270, s: 50, l: 80 }, hex: '#E6E6FA', 
    concepts: ['calm', 'softness', 'spirituality', 'romantic', 'spring'] },
  { id: 'violet', name: 'Violeta', hsl: { h: 270, s: 80, l: 50 }, hex: '#8B00FF', 
    concepts: ['creativity', 'spirituality', 'mystery', 'intuition', 'royalty'] },
  { id: 'plum', name: 'Ciruela', hsl: { h: 300, s: 45, l: 35 }, hex: '#8E4585', 
    concepts: ['luxury', 'mystery', 'depth', 'autumn', 'sophistication'] },
  { id: 'mauve', name: 'Malva', hsl: { h: 280, s: 30, l: 65 }, hex: '#E0B0FF', 
    concepts: ['softness', 'romantic', 'vintage', 'calm', 'dream'] },
  { id: 'orchid', name: 'Orquídea', hsl: { h: 302, s: 60, l: 65 }, hex: '#DA70D6', 
    concepts: ['luxury', 'creativity', 'exotic', 'romantic', 'spring'] },
  { id: 'grape', name: 'Uva', hsl: { h: 280, s: 60, l: 40 }, hex: '#6F2DA8', 
    concepts: ['royalty', 'mystery', 'depth', 'spirituality', 'luxury'] },
  { id: 'amethyst', name: 'Amatista', hsl: { h: 270, s: 50, l: 60 }, hex: '#9966CC', 
    concepts: ['spirituality', 'intuition', 'calm', 'wisdom', 'mystery'] },
  
  // ROSAS/MAGENTAS
  { id: 'magenta', name: 'Magenta', hsl: { h: 300, s: 100, l: 50 }, hex: '#FF00FF', 
    concepts: ['creativity', 'rebellion', 'energy', 'maximalist', 'excitement'] },
  { id: 'fuchsia', name: 'Fucsia', hsl: { h: 320, s: 100, l: 50 }, hex: '#FF00FF', 
    concepts: ['energy', 'excitement', 'creativity', 'rebellion', 'maximalist'] },
  { id: 'blush', name: 'Rubor', hsl: { h: 350, s: 50, l: 85 }, hex: '#DE5D83', 
    concepts: ['softness', 'romantic', 'sweetness', 'warmth', 'comfort'] },
  { id: 'hotpink', name: 'Rosa intenso', hsl: { h: 330, s: 100, l: 60 }, hex: '#FF69B4', 
    concepts: ['energy', 'joy', 'excitement', 'friendship', 'maximalist'] },
  { id: 'dustypink', name: 'Rosa polvo', hsl: { h: 350, s: 30, l: 70 }, hex: '#D4A5A5', 
    concepts: ['softness', 'vintage', 'romantic', 'calm', 'nordic'] },
  { id: 'raspberry', name: 'Frambuesa', hsl: { h: 340, s: 85, l: 45 }, hex: '#E30B5C', 
    concepts: ['passion', 'energy', 'sweetness', 'intensity', 'excitement'] },
  
  // MARRONES
  { id: 'chocolate', name: 'Chocolate', hsl: { h: 25, s: 75, l: 25 }, hex: '#7B3F00', 
    concepts: ['warmth', 'comfort', 'earth', 'sweetness', 'depth'] },
  { id: 'coffee', name: 'Café', hsl: { h: 30, s: 50, l: 30 }, hex: '#6F4E37', 
    concepts: ['warmth', 'comfort', 'authenticity', 'earth', 'focus'] },
  { id: 'tan', name: 'Canela', hsl: { h: 34, s: 44, l: 69 }, hex: '#D2B48C', 
    concepts: ['earth', 'organic', 'warmth', 'comfort', 'minimalist'] },
  { id: 'beige', name: 'Beige', hsl: { h: 34, s: 37, l: 85 }, hex: '#F5F5DC', 
    concepts: ['calm', 'minimalist', 'purity', 'organic', 'nordic'] },
  { id: 'sienna', name: 'Siena', hsl: { h: 19, s: 56, l: 40 }, hex: '#A0522D', 
    concepts: ['earth', 'autumn', 'warmth', 'authenticity', 'vintage'] },
  { id: 'caramel', name: 'Caramelo', hsl: { h: 30, s: 70, l: 50 }, hex: '#FFD59A', 
    concepts: ['sweetness', 'warmth', 'comfort', 'autumn', 'organic'] },
  
  // NEUTROS
  { id: 'charcoal', name: 'Carbón', hsl: { h: 0, s: 0, l: 20 }, hex: '#36454F', 
    concepts: ['authority', 'depth', 'industrial', 'minimalist', 'sophistication'] },
  { id: 'slate', name: 'Pizarra', hsl: { h: 210, s: 15, l: 45 }, hex: '#708090', 
    concepts: ['calm', 'logic', 'industrial', 'technology', 'balance'] },
  { id: 'silver', name: 'Plata', hsl: { h: 0, s: 0, l: 75 }, hex: '#C0C0C0', 
    concepts: ['technology', 'futuristic', 'minimalist', 'clarity', 'prestige'] },
  { id: 'pearl', name: 'Perla', hsl: { h: 0, s: 0, l: 95 }, hex: '#F0EAD6', 
    concepts: ['purity', 'luxury', 'softness', 'minimalist', 'lightness'] },
  { id: 'graphite', name: 'Grafito', hsl: { h: 0, s: 0, l: 30 }, hex: '#383838', 
    concepts: ['industrial', 'authority', 'depth', 'technology', 'geometric'] },
  { id: 'ivory', name: 'Marfil', hsl: { h: 60, s: 56, l: 91 }, hex: '#FFFFF0', 
    concepts: ['purity', 'softness', 'luxury', 'calm', 'vintage'] },
  { id: 'snow', name: 'Nieve', hsl: { h: 0, s: 0, l: 98 }, hex: '#FFFAFA', 
    concepts: ['purity', 'winter', 'minimalist', 'clarity', 'lightness'] },
  { id: 'midnight', name: 'Medianoche', hsl: { h: 240, s: 60, l: 15 }, hex: '#191970', 
    concepts: ['mystery', 'depth', 'cosmos', 'spirituality', 'dusk'] },
  
  // ESPECIALES/NEÓN
  { id: 'neongreen', name: 'Verde neón', hsl: { h: 120, s: 100, l: 50 }, hex: '#39FF14', 
    concepts: ['energy', 'technology', 'futuristic', 'rebellion', 'excitement'] },
  { id: 'neonpink', name: 'Rosa neón', hsl: { h: 320, s: 100, l: 55 }, hex: '#FF6EC7', 
    concepts: ['energy', 'excitement', 'futuristic', 'rebellion', 'maximalist'] },
  { id: 'cyan', name: 'Cian', hsl: { h: 180, s: 100, l: 50 }, hex: '#00FFFF', 
    concepts: ['technology', 'futuristic', 'freshness', 'innovation', 'clarity'] },
  { id: 'turquoise', name: 'Turquesa', hsl: { h: 174, s: 72, l: 56 }, hex: '#40E0D0', 
    concepts: ['freshness', 'summer', 'calm', 'nature', 'adventure'] },
  { id: 'aquamarine', name: 'Aguamarina', hsl: { h: 160, s: 50, l: 75 }, hex: '#7FFFD4', 
    concepts: ['freshness', 'calm', 'nature', 'lightness', 'spring'] },
];

// Función para obtener colores por conceptos seleccionados
export function getColorsByConcepts(conceptIds: string[], count: number = 5): ColorAssociation[] {
  if (conceptIds.length === 0) return [];
  
  // Calcular puntuación para cada color basada en cuántos conceptos coinciden
  const scoredColors = colorDatabase.map(color => {
    const matchingConcepts = color.concepts.filter(c => conceptIds.includes(c));
    return {
      ...color,
      score: matchingConcepts.length,
      matchingConcepts
    };
  });
  
  // Filtrar colores que tienen al menos una coincidencia
  const matchingColors = scoredColors.filter(c => c.score > 0);
  
  // Ordenar por puntuación descendente
  matchingColors.sort((a, b) => b.score - a.score);
  
  // Seleccionar colores asegurando variedad cromática
  const selected: typeof matchingColors = [];
  const usedHueRanges: number[] = [];
  
  for (const color of matchingColors) {
    if (selected.length >= count) break;
    
    // Verificar que el tono no esté demasiado cerca de uno ya seleccionado
    const hueRange = Math.floor(color.hsl.h / 30); // Dividir en 12 rangos
    const isTooSimilar = usedHueRanges.some(range => 
      Math.abs(range - hueRange) <= 1 || Math.abs(range - hueRange) >= 11
    );
    
    if (!isTooSimilar || selected.length < Math.min(3, count)) {
      selected.push(color);
      usedHueRanges.push(hueRange);
    }
  }
  
  // Si no tenemos suficientes, añadir más aunque sean similares
  if (selected.length < count) {
    for (const color of matchingColors) {
      if (selected.length >= count) break;
      if (!selected.includes(color)) {
        selected.push(color);
      }
    }
  }
  
  return selected.slice(0, count);
}

// Función para generar variaciones armónicas de un conjunto de colores
export function generateHarmoniousPalette(baseColors: ColorAssociation[], count: number): { h: number; s: number; l: number }[] {
  if (baseColors.length === 0) return [];
  
  const palette: { h: number; s: number; l: number }[] = [];
  
  // Añadir los colores base
  for (let i = 0; i < Math.min(baseColors.length, count); i++) {
    palette.push({ ...baseColors[i].hsl });
  }
  
  // Si necesitamos más colores, crear variaciones
  while (palette.length < count) {
    const baseColor = baseColors[palette.length % baseColors.length];
    const variation = palette.length % 3;
    
    let newColor: { h: number; s: number; l: number };
    
    switch (variation) {
      case 0: // Más claro
        newColor = {
          h: baseColor.hsl.h,
          s: Math.max(20, baseColor.hsl.s - 20),
          l: Math.min(90, baseColor.hsl.l + 20)
        };
        break;
      case 1: // Más oscuro
        newColor = {
          h: baseColor.hsl.h,
          s: Math.min(100, baseColor.hsl.s + 10),
          l: Math.max(20, baseColor.hsl.l - 20)
        };
        break;
      default: // Tono complementario
        newColor = {
          h: (baseColor.hsl.h + 30) % 360,
          s: baseColor.hsl.s,
          l: baseColor.hsl.l
        };
    }
    
    palette.push(newColor);
  }
  
  return palette.slice(0, count);
}

// Paletas prediseñadas con contexto visual
export interface CuratedPalette {
  id: string;
  name: string;
  description: string;
  tags: string[];
  colors: { h: number; s: number; l: number }[];
  imageUrl?: string;
  category: 'popular' | 'seasonal' | 'industry' | 'mood' | 'artistic';
}

export const curatedPalettes: CuratedPalette[] = [
  // POPULAR
  {
    id: 'sunset-vibes',
    name: 'Atardecer Vibrante',
    description: 'Cálidos tonos de puesta de sol que evocan serenidad y calidez',
    tags: ['cálido', 'atardecer', 'romántico', 'verano'],
    colors: [
      { h: 20, s: 90, l: 55 },
      { h: 35, s: 95, l: 60 },
      { h: 50, s: 90, l: 65 },
      { h: 340, s: 75, l: 50 },
      { h: 280, s: 40, l: 35 }
    ],
    category: 'popular'
  },
  {
    id: 'ocean-breeze',
    name: 'Brisa Marina',
    description: 'Tonos frescos del océano que transmiten calma y claridad',
    tags: ['fresco', 'océano', 'calma', 'verano'],
    colors: [
      { h: 195, s: 80, l: 45 },
      { h: 185, s: 70, l: 60 },
      { h: 175, s: 55, l: 75 },
      { h: 200, s: 30, l: 90 },
      { h: 210, s: 85, l: 35 }
    ],
    category: 'popular'
  },
  {
    id: 'nordic-calm',
    name: 'Calma Nórdica',
    description: 'Minimalismo escandinavo con tonos suaves y acogedores',
    tags: ['minimalista', 'nórdico', 'suave', 'acogedor'],
    colors: [
      { h: 30, s: 20, l: 92 },
      { h: 35, s: 25, l: 80 },
      { h: 150, s: 15, l: 70 },
      { h: 200, s: 20, l: 60 },
      { h: 0, s: 0, l: 25 }
    ],
    category: 'popular'
  },
  {
    id: 'tropical-paradise',
    name: 'Paraíso Tropical',
    description: 'Colores vibrantes inspirados en la selva tropical',
    tags: ['tropical', 'vibrante', 'naturaleza', 'verano'],
    colors: [
      { h: 150, s: 85, l: 40 },
      { h: 170, s: 75, l: 50 },
      { h: 45, s: 95, l: 55 },
      { h: 25, s: 90, l: 60 },
      { h: 330, s: 80, l: 55 }
    ],
    category: 'popular'
  },
  
  // SEASONAL
  {
    id: 'spring-bloom',
    name: 'Floración Primaveral',
    description: 'Tonos frescos y florales que celebran el renacimiento',
    tags: ['primavera', 'floral', 'fresco', 'romántico'],
    colors: [
      { h: 340, s: 70, l: 80 },
      { h: 320, s: 60, l: 75 },
      { h: 90, s: 50, l: 70 },
      { h: 55, s: 80, l: 75 },
      { h: 180, s: 40, l: 85 }
    ],
    category: 'seasonal'
  },
  {
    id: 'autumn-harvest',
    name: 'Cosecha Otoñal',
    description: 'Ricos tonos terrosos de la temporada de cosecha',
    tags: ['otoño', 'terroso', 'cálido', 'acogedor'],
    colors: [
      { h: 25, s: 80, l: 45 },
      { h: 35, s: 85, l: 55 },
      { h: 50, s: 75, l: 50 },
      { h: 15, s: 70, l: 35 },
      { h: 45, s: 40, l: 25 }
    ],
    category: 'seasonal'
  },
  {
    id: 'winter-frost',
    name: 'Escarcha Invernal',
    description: 'Tonos fríos y cristalinos del invierno',
    tags: ['invierno', 'frío', 'elegante', 'sereno'],
    colors: [
      { h: 210, s: 30, l: 90 },
      { h: 200, s: 50, l: 75 },
      { h: 220, s: 40, l: 50 },
      { h: 230, s: 60, l: 35 },
      { h: 0, s: 0, l: 95 }
    ],
    category: 'seasonal'
  },
  {
    id: 'summer-festival',
    name: 'Festival de Verano',
    description: 'Explosión de color para días soleados',
    tags: ['verano', 'vibrante', 'alegre', 'energético'],
    colors: [
      { h: 45, s: 100, l: 55 },
      { h: 15, s: 95, l: 55 },
      { h: 175, s: 70, l: 45 },
      { h: 320, s: 85, l: 55 },
      { h: 260, s: 70, l: 60 }
    ],
    category: 'seasonal'
  },
  
  // INDUSTRY
  {
    id: 'tech-startup',
    name: 'Tech Startup',
    description: 'Moderno y profesional para empresas tecnológicas',
    tags: ['tecnología', 'moderno', 'profesional', 'innovador'],
    colors: [
      { h: 220, s: 90, l: 55 },
      { h: 175, s: 80, l: 45 },
      { h: 260, s: 70, l: 60 },
      { h: 0, s: 0, l: 15 },
      { h: 0, s: 0, l: 95 }
    ],
    category: 'industry'
  },
  {
    id: 'organic-natural',
    name: 'Orgánico Natural',
    description: 'Perfecto para marcas eco-friendly y naturales',
    tags: ['orgánico', 'natural', 'sostenible', 'salud'],
    colors: [
      { h: 90, s: 45, l: 45 },
      { h: 35, s: 50, l: 70 },
      { h: 25, s: 40, l: 35 },
      { h: 150, s: 30, l: 80 },
      { h: 45, s: 35, l: 90 }
    ],
    category: 'industry'
  },
  {
    id: 'luxury-brand',
    name: 'Marca de Lujo',
    description: 'Elegancia y sofisticación para marcas premium',
    tags: ['lujo', 'elegante', 'premium', 'sofisticado'],
    colors: [
      { h: 45, s: 80, l: 45 },
      { h: 0, s: 0, l: 10 },
      { h: 280, s: 50, l: 25 },
      { h: 0, s: 0, l: 98 },
      { h: 30, s: 30, l: 70 }
    ],
    category: 'industry'
  },
  {
    id: 'healthcare',
    name: 'Salud y Bienestar',
    description: 'Transmite confianza y cuidado profesional',
    tags: ['salud', 'confianza', 'limpio', 'profesional'],
    colors: [
      { h: 195, s: 70, l: 50 },
      { h: 170, s: 50, l: 60 },
      { h: 210, s: 60, l: 40 },
      { h: 0, s: 0, l: 97 },
      { h: 150, s: 40, l: 85 }
    ],
    category: 'industry'
  },
  
  // MOOD
  {
    id: 'zen-meditation',
    name: 'Zen Meditación',
    description: 'Paz interior y mindfulness',
    tags: ['zen', 'meditación', 'paz', 'espiritual'],
    colors: [
      { h: 30, s: 15, l: 85 },
      { h: 150, s: 25, l: 70 },
      { h: 200, s: 20, l: 80 },
      { h: 45, s: 30, l: 75 },
      { h: 0, s: 5, l: 40 }
    ],
    category: 'mood'
  },
  {
    id: 'energetic-bold',
    name: 'Energía Audaz',
    description: 'Dinamismo y acción para proyectos atrevidos',
    tags: ['energético', 'audaz', 'dinámico', 'atrevido'],
    colors: [
      { h: 355, s: 90, l: 50 },
      { h: 35, s: 95, l: 55 },
      { h: 280, s: 80, l: 50 },
      { h: 175, s: 85, l: 40 },
      { h: 55, s: 100, l: 50 }
    ],
    category: 'mood'
  },
  {
    id: 'romantic-dreamy',
    name: 'Romántico Soñador',
    description: 'Suave y etéreo para proyectos delicados',
    tags: ['romántico', 'suave', 'soñador', 'delicado'],
    colors: [
      { h: 340, s: 50, l: 85 },
      { h: 280, s: 40, l: 80 },
      { h: 200, s: 45, l: 85 },
      { h: 30, s: 50, l: 90 },
      { h: 350, s: 60, l: 75 }
    ],
    category: 'mood'
  },
  {
    id: 'mysterious-dark',
    name: 'Misterio Oscuro',
    description: 'Intriga y profundidad para proyectos dramáticos',
    tags: ['misterioso', 'oscuro', 'dramático', 'profundo'],
    colors: [
      { h: 260, s: 50, l: 20 },
      { h: 340, s: 60, l: 30 },
      { h: 220, s: 70, l: 25 },
      { h: 180, s: 40, l: 35 },
      { h: 0, s: 0, l: 10 }
    ],
    category: 'mood'
  },
  
  // ARTISTIC
  {
    id: 'impressionist',
    name: 'Impresionista',
    description: 'Inspirado en Monet y los impresionistas franceses',
    tags: ['arte', 'impresionista', 'clásico', 'suave'],
    colors: [
      { h: 210, s: 45, l: 70 },
      { h: 45, s: 60, l: 75 },
      { h: 120, s: 35, l: 60 },
      { h: 340, s: 40, l: 75 },
      { h: 270, s: 35, l: 70 }
    ],
    category: 'artistic'
  },
  {
    id: 'pop-art',
    name: 'Pop Art',
    description: 'Colores vibrantes al estilo Warhol',
    tags: ['arte', 'pop', 'vibrante', 'retro'],
    colors: [
      { h: 355, s: 95, l: 50 },
      { h: 55, s: 100, l: 55 },
      { h: 195, s: 100, l: 50 },
      { h: 300, s: 90, l: 50 },
      { h: 120, s: 85, l: 45 }
    ],
    category: 'artistic'
  },
  {
    id: 'bauhaus',
    name: 'Bauhaus',
    description: 'Colores primarios del movimiento Bauhaus',
    tags: ['arte', 'bauhaus', 'geométrico', 'moderno'],
    colors: [
      { h: 355, s: 85, l: 50 },
      { h: 55, s: 90, l: 55 },
      { h: 215, s: 85, l: 45 },
      { h: 0, s: 0, l: 10 },
      { h: 0, s: 0, l: 95 }
    ],
    category: 'artistic'
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    description: 'Estética retro-futurista de los 80s/90s',
    tags: ['retro', 'vaporwave', 'neón', 'nostálgico'],
    colors: [
      { h: 280, s: 80, l: 60 },
      { h: 320, s: 85, l: 65 },
      { h: 180, s: 90, l: 50 },
      { h: 55, s: 100, l: 70 },
      { h: 220, s: 60, l: 35 }
    ],
    category: 'artistic'
  }
];
