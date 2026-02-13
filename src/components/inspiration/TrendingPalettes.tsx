import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendingPalettesProps {
  colorCount: number;
  onColorCountChange: (count: number) => void;
  onSelectPalette: (colors: string[]) => void;
  onBack: () => void;
}

interface CuratedPalette {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
  category: string;
  inspiration?: string;
}

// Función para calcular distancia entre colores
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function colorDistance(hex1: string, hex2: string): number {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2)
  );
}

// Base de datos extensa de paletas en tendencia
const CURATED_PALETTES: CuratedPalette[] = [
  // NUEVAS TENDENCIAS 2025-2026
  { id: 'new1', name: 'Calma Natural 2026', colors: ['#A8B8A5', '#6F7E6C', '#D9CDBF', '#A38A75', '#F3EDE4', '#5A6B58'], tags: ['wellness', 'lifestyle', 'naturales', 'bienestar', 'minimalismo cálido'], category: 'Tendencia 2026', inspiration: 'Marcas naturales y bienestar' },
  { id: 'new2', name: 'Nostalgia 2016 (2026)', colors: ['#F7C9D3', '#A7BCE2', '#D7CFF3', '#CBEED9', '#E7E7EF', '#FFB5C5'], tags: ['aesthetic', 'retro-moderno', 'suavidad', 'serenidad', 'tendencia cíclica'], category: 'Tendencia 2026', inspiration: 'Versión moderna del 2016' },
  { id: 'new3', name: 'Futuro Suave 2026', colors: ['#2E4A67', '#CDE5F7', '#D9D3F1', '#A7B0BF', '#F7F9FC', '#1A3550'], tags: ['tech', 'corporativo', 'moderno', 'innovación', 'tecnología amigable'], category: 'Tendencia 2026', inspiration: 'Tech y portadas modernas' },
  { id: 'new4', name: 'Editorial Warm', colors: ['#C57A58', '#E7D7C9', '#8C5A3C', '#C1B7AB', '#FAF5EF', '#6B4530'], tags: ['branding premium', 'elegancia', 'eventos', 'storytelling', 'sofisticación'], category: 'Tendencia 2026', inspiration: 'Diseño editorial premium' },
  { id: 'new5', name: 'Vibrante Moderno 2026', colors: ['#4C7EFF', '#FF4EB8', '#F7D93D', '#9D4CF0', '#1E1E1E', '#00D4AA'], tags: ['redes sociales', 'marketing', 'juvenil', 'energía', 'posters'], category: 'Tendencia 2026', inspiration: 'Contenido digital vibrante' },
  { id: 'new6', name: 'Soft Academia 2026', colors: ['#5A4638', '#E8DCC5', '#A4866F', '#C8C1B6', '#F5F1EA', '#3D2E25'], tags: ['estudio', 'clásico', 'calidez', 'nostálgico', 'intelectual'], category: 'Tendencia 2026', inspiration: 'Estética académica suave' },
  { id: 'new7', name: 'Retro Minimal 90s', colors: ['#456A8A', '#F4E6B1', '#C75C5C', '#6A8C6D', '#FAF3E6', '#2A4560'], tags: ['nostalgia', 'minimalismo retro', 'diseño gráfico', 'vintage', '90s'], category: 'Tendencia 2026', inspiration: 'Nostalgia años 90' },
  { id: 'new8', name: 'Impulso Biofílico', colors: ['#005A61', '#7AA57B', '#003A44', '#B1C84D', '#E8F5E9', '#004850'], tags: ['biofilia', 'naturaleza', 'oasis', 'revitalizante', 'WGSN'], category: 'Tendencia 2026', inspiration: 'WGSN & RAL - Conexión natural' },
  { id: 'new9', name: 'Neoneutrales Modernos', colors: ['#D6D1CA', '#B4A992', '#8E8C78', '#F4E8B7', '#FAFAF8', '#6B6960'], tags: ['off-white', 'atemporal', 'profundidad', 'elegancia sutil', 'acogedor'], category: 'Tendencia 2026', inspiration: 'Neutrales con profundidad' },
  { id: 'new10', name: 'Refugio Terrenal', colors: ['#D9CDBF', '#C1B7AB', '#4F5D4C', '#A0522D', '#4B3621', '#E8DDD0'], tags: ['slow fashion', 'autenticidad', 'artesanía', 'sustentable', 'minimalismo elevado'], category: 'Tendencia 2026', inspiration: 'Productos sustentables' },
  { id: 'new11', name: 'Figital', colors: ['#D1A7FF', '#CDE5F7', '#0047AB', '#CCFF00', '#1A1A2E', '#FF6B9D'], tags: ['metaverso', 'innovación', 'optimismo', 'alto impacto', 'interactivo'], category: 'Tendencia 2026', inspiration: 'Fusión físico + digital' },
  { id: 'new12', name: 'Cálida Vitalidad', colors: ['#C9A78F', '#D4A622', '#FFD345', '#E8D5C4', '#8B6F47', '#FFF8E7'], tags: ['confort', 'energía solar', 'optimismo', 'vitalidad', 'hogar'], category: 'Tendencia 2026', inspiration: 'Tendencias 2025/26 - Dulux/WGSN' },
  { id: 'new13', name: 'Frescura Serena', colors: ['#D6C5C9', '#F2E8A5', '#A9C2D1', '#98A7D3', '#F8F6F2', '#7B8BA8'], tags: ['frescura', 'tranquilidad', 'atmósfera moderna', 'iluminación', 'suavidad'], category: 'Tendencia 2026', inspiration: 'Sweet Embrace Dulux' },

  // TENDENCIAS 2024
  { id: 't1', name: 'Peach Fuzz', colors: ['#FFBE98', '#FF9B7D', '#E8D5B7', '#F5E6D3', '#8B7355', '#4A3728'], tags: ['2024', 'pantone', 'cálido'], category: 'Tendencia 2024', inspiration: 'Color del año Pantone 2024' },
  { id: 't2', name: 'Digital Lavender', colors: ['#E6E6FA', '#9B8AA5', '#6B5B7A', '#DCD0FF', '#F0E6FF', '#4A3D5C'], tags: ['2024', 'digital', 'suave'], category: 'Tendencia 2024', inspiration: 'Bienestar digital y calma' },
  { id: 't3', name: 'Sundial', colors: ['#F4A460', '#FFD700', '#DAA520', '#8B4513', '#FFF8DC', '#2F1810'], tags: ['2024', 'dorado', 'optimista'], category: 'Tendencia 2024', inspiration: 'Optimismo y calidez' },
  { id: 't4', name: 'Apricot Crush', colors: ['#FB9062', '#FFCBA4', '#E85D04', '#FAE0C8', '#9C4A1A', '#FFF5EB'], tags: ['2024', 'energético', 'fresco'], category: 'Tendencia 2024', inspiration: 'Energía vibrante y frescura' },
  { id: 't5', name: 'Quiet Luxury', colors: ['#8B8378', '#A9A9A9', '#D3D3D3', '#F5F5DC', '#696969', '#3C3C3C'], tags: ['2024', 'lujo', 'minimal'], category: 'Tendencia 2024', inspiration: 'Minimalismo sofisticado' },
  
  // CLÁSICOS DEL DISEÑO
  { id: 'c1', name: 'Bauhaus Primary', colors: ['#DD0000', '#1E40AF', '#FACC15', '#1A1A1A', '#FFFFFF', '#E5E5E5'], tags: ['bauhaus', 'primarios', 'icónico'], category: 'Clásicos', inspiration: 'Escuela Bauhaus 1919' },
  { id: 'c2', name: 'Swiss Design', colors: ['#FF0000', '#000000', '#FFFFFF', '#333333', '#666666', '#F5F5F5'], tags: ['suizo', 'tipográfico', 'limpio'], category: 'Clásicos', inspiration: 'Diseño gráfico suizo' },
  { id: 'c3', name: 'Mondrian', colors: ['#DD0100', '#FAC901', '#225095', '#FFFFFF', '#000000', '#F5F5F5'], tags: ['arte', 'geométrico', 'bold'], category: 'Clásicos', inspiration: 'Piet Mondrian' },
  { id: 'c4', name: 'Art Deco Gold', colors: ['#D4AF37', '#1C1C1C', '#2C2C2C', '#F5F5DC', '#8B7355', '#FFFFF0'], tags: ['art deco', 'elegante', 'dorado'], category: 'Clásicos', inspiration: 'Era Art Deco 1920s' },
  { id: 'c5', name: 'Memphis Milano', colors: ['#FF69B4', '#00CED1', '#FFFF00', '#FF6347', '#9370DB', '#000000'], tags: ['memphis', '80s', 'pop'], category: 'Clásicos', inspiration: 'Movimiento Memphis 1980s' },

  // TECH & STARTUPS
  { id: 'tech1', name: 'Stripe', colors: ['#635BFF', '#00D4FF', '#0A2540', '#425466', '#F6F9FC', '#FFFFFF'], tags: ['fintech', 'moderno', 'profesional'], category: 'Tech', inspiration: 'Stripe payments' },
  { id: 'tech2', name: 'Linear', colors: ['#5E6AD2', '#8B5CF6', '#0F0F10', '#1A1A1A', '#F7F8F9', '#9BA1A6'], tags: ['saas', 'oscuro', 'minimalista'], category: 'Tech', inspiration: 'Linear app' },
  { id: 'tech3', name: 'Vercel', colors: ['#000000', '#FFFFFF', '#888888', '#111111', '#FAFAFA', '#666666'], tags: ['dev', 'monocromo', 'elegante'], category: 'Tech', inspiration: 'Vercel platform' },
  { id: 'tech4', name: 'Figma', colors: ['#F24E1E', '#FF7262', '#A259FF', '#1ABCFE', '#0ACF83', '#FFFFFF'], tags: ['diseño', 'colorido', 'creativo'], category: 'Tech', inspiration: 'Figma design' },
  { id: 'tech5', name: 'Notion', colors: ['#000000', '#FFFFFF', '#37352F', '#9B9A97', '#E16259', '#0F7B6C'], tags: ['productividad', 'limpio', 'neutral'], category: 'Tech', inspiration: 'Notion workspace' },
  { id: 'tech6', name: 'Discord', colors: ['#5865F2', '#57F287', '#FEE75C', '#EB459E', '#ED4245', '#23272A'], tags: ['gaming', 'vibrante', 'juvenil'], category: 'Tech', inspiration: 'Discord community' },
  { id: 'tech7', name: 'Spotify', colors: ['#1DB954', '#191414', '#FFFFFF', '#282828', '#B3B3B3', '#535353'], tags: ['música', 'verde', 'oscuro'], category: 'Tech', inspiration: 'Spotify music' },
  { id: 'tech8', name: 'Slack', colors: ['#4A154B', '#36C5F0', '#2EB67D', '#ECB22E', '#E01E5A', '#FFFFFF'], tags: ['trabajo', 'comunicación', 'amigable'], category: 'Tech', inspiration: 'Slack messaging' },

  // NATURALEZA & ECO
  { id: 'eco1', name: 'Forest Dawn', colors: ['#2D5A27', '#4A7C47', '#8FB573', '#D4E6C3', '#F5F9F2', '#1A3518'], tags: ['bosque', 'natural', 'sereno'], category: 'Naturaleza', inspiration: 'Bosques al amanecer' },
  { id: 'eco2', name: 'Ocean Deep', colors: ['#006994', '#40A4C5', '#89CFF0', '#E0F4FF', '#003B57', '#001F2E'], tags: ['océano', 'profundo', 'fresco'], category: 'Naturaleza', inspiration: 'Profundidades marinas' },
  { id: 'eco3', name: 'Desert Sand', colors: ['#D2B48C', '#C19A6B', '#8B7355', '#F5DEB3', '#A0785A', '#5C4033'], tags: ['desierto', 'tierra', 'cálido'], category: 'Naturaleza', inspiration: 'Dunas del desierto' },
  { id: 'eco4', name: 'Aurora Borealis', colors: ['#00FF7F', '#7B68EE', '#4169E1', '#001F3F', '#98FB98', '#9400D3'], tags: ['aurora', 'mágico', 'nocturno'], category: 'Naturaleza', inspiration: 'Auroras boreales' },
  { id: 'eco5', name: 'Tropical Paradise', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1', '#FFEAA7', '#2C3E50'], tags: ['tropical', 'vibrante', 'verano'], category: 'Naturaleza', inspiration: 'Islas tropicales' },
  { id: 'eco6', name: 'Cherry Blossom', colors: ['#FFB7C5', '#FF69B4', '#FFC0CB', '#FFFFFF', '#3B2F2F', '#FFE4E9'], tags: ['japón', 'primavera', 'delicado'], category: 'Naturaleza', inspiration: 'Sakura japonés' },

  // MINIMALISMO
  { id: 'min1', name: 'Warm Neutrals', colors: ['#FAF7F2', '#E8E4DE', '#C9C5BF', '#9A958F', '#5C5856', '#2C2A28'], tags: ['neutro', 'cálido', 'elegante'], category: 'Minimalismo', inspiration: 'Interiorismo escandinavo' },
  { id: 'min2', name: 'Cool Grays', colors: ['#F8FAFC', '#E2E8F0', '#94A3B8', '#64748B', '#334155', '#0F172A'], tags: ['gris', 'frío', 'tech'], category: 'Minimalismo', inspiration: 'UI moderna' },
  { id: 'min3', name: 'Paper & Ink', colors: ['#FFFEF9', '#F5F3EB', '#000000', '#333333', '#888888', '#DDDDDD'], tags: ['editorial', 'limpio', 'tipográfico'], category: 'Minimalismo', inspiration: 'Diseño editorial' },
  { id: 'min4', name: 'Japandi', colors: ['#D4C4B5', '#A69080', '#6B5B4C', '#E8E4DE', '#3C3633', '#F5F2ED'], tags: ['japonés', 'escandinavo', 'zen'], category: 'Minimalismo', inspiration: 'Fusión Japón-Escandinavia' },
  { id: 'min5', name: 'Soft Touch', colors: ['#FDF6F0', '#F5E6E0', '#E5D4CE', '#C4B5AE', '#8B7D76', '#4A4340'], tags: ['suave', 'orgánico', 'cálido'], category: 'Minimalismo', inspiration: 'Cosméticos naturales' },

  // BOLD & VIBRANTE
  { id: 'bold1', name: 'Electric Pop', colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0080', '#00FF80', '#0080FF'], tags: ['neón', 'electrónico', 'fiesta'], category: 'Bold', inspiration: 'Cultura club y rave' },
  { id: 'bold2', name: 'Sunset Gradient', colors: ['#FF6B6B', '#FF8E53', '#FFCF56', '#FF9A76', '#FED766', '#FF4757'], tags: ['atardecer', 'gradiente', 'cálido'], category: 'Bold', inspiration: 'Atardeceres de verano' },
  { id: 'bold3', name: 'Cyberpunk', colors: ['#FF00A0', '#00FFFF', '#1A0A2E', '#39FF14', '#FF073A', '#7B00FF'], tags: ['cyber', 'neón', 'futurista'], category: 'Bold', inspiration: 'Estética cyberpunk' },
  { id: 'bold4', name: 'Retro Wave', colors: ['#FF6AD5', '#C774E8', '#AD8CFF', '#8795E8', '#94D0FF', '#2B1055'], tags: ['retro', '80s', 'synthwave'], category: 'Bold', inspiration: 'Synthwave 80s' },
  { id: 'bold5', name: 'Candy Shop', colors: ['#FF69B4', '#FFB6C1', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C'], tags: ['dulce', 'pastel', 'alegre'], category: 'Bold', inspiration: 'Tienda de dulces' },

  // LUJO & PREMIUM
  { id: 'lux1', name: 'Black Gold', colors: ['#000000', '#D4AF37', '#1C1C1C', '#C9B037', '#F5F5DC', '#333333'], tags: ['lujo', 'oro', 'elegante'], category: 'Lujo', inspiration: 'Marcas de lujo' },
  { id: 'lux2', name: 'Royal Navy', colors: ['#1B2838', '#2C3E50', '#D4AF37', '#FFFFFF', '#8B7355', '#0D1B2A'], tags: ['náutico', 'premium', 'clásico'], category: 'Lujo', inspiration: 'Yates y náutica de lujo' },
  { id: 'lux3', name: 'Rose Gold', colors: ['#B76E79', '#E8C4C4', '#2C2C2C', '#FFFFFF', '#D4A574', '#1A1A1A'], tags: ['rosa', 'oro', 'femenino'], category: 'Lujo', inspiration: 'Joyería moderna' },
  { id: 'lux4', name: 'Champagne', colors: ['#F7E7CE', '#D4AF37', '#8B7355', '#FFFFF0', '#C9B037', '#3C3C3C'], tags: ['champagne', 'celebración', 'dorado'], category: 'Lujo', inspiration: 'Celebraciones de gala' },
  { id: 'lux5', name: 'Marble & Copper', colors: ['#F5F5F5', '#2C2C2C', '#B87333', '#E5E5E5', '#8B4513', '#FFFFFF'], tags: ['mármol', 'cobre', 'arquitectura'], category: 'Lujo', inspiration: 'Interiorismo de lujo' },

  // COMIDA & BEBIDA
  { id: 'food1', name: 'Coffee Shop', colors: ['#6F4E37', '#D2B48C', '#F5DEB3', '#8B4513', '#FFFFF0', '#3C2415'], tags: ['café', 'acogedor', 'cálido'], category: 'Food & Drink', inspiration: 'Cafeterías artesanales' },
  { id: 'food2', name: 'Fresh Juice', colors: ['#FF6B35', '#76C043', '#FFCC00', '#FF4444', '#F5F5DC', '#2C5234'], tags: ['zumo', 'fresco', 'saludable'], category: 'Food & Drink', inspiration: 'Zumos naturales' },
  { id: 'food3', name: 'Wine & Dine', colors: ['#722F37', '#4A0E0E', '#D4AF37', '#F5F5DC', '#2C1810', '#E8D5B7'], tags: ['vino', 'gourmet', 'elegante'], category: 'Food & Drink', inspiration: 'Restaurantes gourmet' },
  { id: 'food4', name: 'Matcha Green', colors: ['#7AB55C', '#B8D4A0', '#4A5D23', '#E8F5E0', '#2E4A1C', '#F5FFEE'], tags: ['matcha', 'japonés', 'wellness'], category: 'Food & Drink', inspiration: 'Cultura del té matcha' },

  // MODA
  { id: 'fash1', name: 'Parisian Chic', colors: ['#1A1A2E', '#EAEAEA', '#B76E79', '#FFFFFF', '#333333', '#D4A574'], tags: ['parís', 'elegante', 'clásico'], category: 'Moda', inspiration: 'Moda parisina' },
  { id: 'fash2', name: 'Streetwear', colors: ['#000000', '#FFFFFF', '#FF4500', '#808080', '#FFD700', '#1A1A1A'], tags: ['urban', 'street', 'bold'], category: 'Moda', inspiration: 'Street style' },
  { id: 'fash3', name: 'Bohemian', colors: ['#C19A6B', '#8B4513', '#DEB887', '#F5DEB3', '#654321', '#FFF8DC'], tags: ['boho', 'terroso', 'artesanal'], category: 'Moda', inspiration: 'Estilo bohemio' },
  { id: 'fash4', name: 'Scandinavian', colors: ['#F5F5F5', '#D3D3D3', '#A9A9A9', '#696969', '#FFFFFF', '#E5E5E5'], tags: ['escandinavo', 'clean', 'minimal'], category: 'Moda', inspiration: 'Moda nórdica' },

  // ESTACIONES
  { id: 'seas1', name: 'Spring Bloom', colors: ['#FFB7C5', '#98FB98', '#87CEEB', '#FFFACD', '#DDA0DD', '#F0FFF0'], tags: ['primavera', 'flores', 'fresco'], category: 'Estaciones', inspiration: 'Primavera floreciente' },
  { id: 'seas2', name: 'Summer Heat', colors: ['#FF6B6B', '#FFE66D', '#4ECDC4', '#FF8C42', '#F7FFF7', '#2C3E50'], tags: ['verano', 'playa', 'tropical'], category: 'Estaciones', inspiration: 'Verano en la playa' },
  { id: 'seas3', name: 'Autumn Harvest', colors: ['#D2691E', '#B8860B', '#8B4513', '#CD853F', '#F4A460', '#2F1810'], tags: ['otoño', 'cosecha', 'cálido'], category: 'Estaciones', inspiration: 'Otoño y cosecha' },
  { id: 'seas4', name: 'Winter Frost', colors: ['#E0FFFF', '#B0E0E6', '#4682B4', '#1E3A5F', '#FFFFFF', '#708090'], tags: ['invierno', 'frío', 'cristalino'], category: 'Estaciones', inspiration: 'Invierno helado' },

  // WELLNESS & SALUD
  { id: 'well1', name: 'Spa Retreat', colors: ['#E8F5E9', '#A5D6A7', '#66BB6A', '#F5F5DC', '#81C784', '#2E7D32'], tags: ['spa', 'relajante', 'natural'], category: 'Wellness', inspiration: 'Retiro de spa' },
  { id: 'well2', name: 'Yoga Studio', colors: ['#E1BEE7', '#CE93D8', '#AB47BC', '#F3E5F5', '#7B1FA2', '#4A148C'], tags: ['yoga', 'espiritual', 'calma'], category: 'Wellness', inspiration: 'Estudio de yoga' },
  { id: 'well3', name: 'Ocean Therapy', colors: ['#80DEEA', '#4DD0E1', '#00BCD4', '#E0F7FA', '#006064', '#B2EBF2'], tags: ['océano', 'terapia', 'fresco'], category: 'Wellness', inspiration: 'Terapia marina' },
  
  // GAMING
  { id: 'game1', name: 'Neon Arcade', colors: ['#FF00FF', '#00FF00', '#0000FF', '#FFFF00', '#000000', '#FF0000'], tags: ['arcade', 'neón', 'retro'], category: 'Gaming', inspiration: 'Arcades de los 80s' },
  { id: 'game2', name: 'E-Sports', colors: ['#00D4FF', '#FF0080', '#1A1A2E', '#0F0F1E', '#FFFFFF', '#7B00FF'], tags: ['esports', 'competitivo', 'tech'], category: 'Gaming', inspiration: 'Competiciones e-sports' },
  { id: 'game3', name: 'Fantasy RPG', colors: ['#8B4513', '#FFD700', '#4A0E4E', '#228B22', '#DC143C', '#1C1C1C'], tags: ['fantasía', 'medieval', 'épico'], category: 'Gaming', inspiration: 'Juegos de rol' },

  // CORPORATIVO
  { id: 'corp1', name: 'Corporate Blue', colors: ['#003366', '#0066CC', '#6699CC', '#FFFFFF', '#E6F0FF', '#001A33'], tags: ['corporativo', 'confianza', 'profesional'], category: 'Corporativo', inspiration: 'Banca y finanzas' },
  { id: 'corp2', name: 'Law Firm', colors: ['#1A1A2E', '#2C3E50', '#8B7355', '#F5F5DC', '#D4AF37', '#0D1B2A'], tags: ['legal', 'serio', 'tradicional'], category: 'Corporativo', inspiration: 'Bufetes de abogados' },
  { id: 'corp3', name: 'Consulting', colors: ['#2C3E50', '#3498DB', '#ECF0F1', '#1ABC9C', '#FFFFFF', '#34495E'], tags: ['consultoría', 'moderno', 'profesional'], category: 'Corporativo', inspiration: 'Consultoras' },
];

// Categorías disponibles
const CATEGORIES = [
  'Todos',
  'Tendencia 2026',
  'Tendencia 2024',
  'Clásicos',
  'Tech',
  'Naturaleza',
  'Minimalismo',
  'Bold',
  'Lujo',
  'Food & Drink',
  'Moda',
  'Estaciones',
  'Wellness',
  'Gaming',
  'Corporativo',
];

type ViewMode = 'palette' | 'poster';

export function TrendingPalettes({
  colorCount,
  onColorCountChange,
  onSelectPalette,
  onBack,
}: TrendingPalettesProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('poster');
  const [selectedPalette, setSelectedPalette] = useState<CuratedPalette | null>(null);
  const [posterStyle, setPosterStyle] = useState(0);
  const [colorSearchActive, setColorSearchActive] = useState(false);
  const [searchColor, setSearchColor] = useState('#6366f1');

  // Filtrar paletas
  const filteredPalettes = useMemo(() => {
    let palettes = CURATED_PALETTES.filter((palette) => {
      const matchesCategory = selectedCategory === 'Todos' || palette.category === selectedCategory;
      const matchesSearch =
        searchTerm === '' ||
        palette.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        palette.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        palette.inspiration?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Si hay búsqueda por color activa, ordenar por proximidad al color
    if (colorSearchActive) {
      palettes = palettes
        .map((palette) => {
          const minDistance = Math.min(
            ...palette.colors.map((c) => colorDistance(c, searchColor))
          );
          return { ...palette, colorDistance: minDistance };
        })
        .sort((a, b) => a.colorDistance - b.colorDistance)
        .filter((p) => p.colorDistance < 150); // Filtrar solo colores cercanos
    }

    return palettes;
  }, [selectedCategory, searchTerm, colorSearchActive, searchColor]);

  // Adaptar paleta al número de colores
  const adaptPalette = (colors: string[], count: number): string[] => {
    if (colors.length === count) return colors;
    if (colors.length > count) return colors.slice(0, count);
    const result = [...colors];
    while (result.length < count) {
      const idx = result.length % colors.length;
      result.push(colors[idx]);
    }
    return result;
  };

  // Estilos de póster - Bold primero
  const posterStyles = [
    { id: 'bold', name: 'Bold' },
    { id: 'artistic', name: 'Artístico' },
    { id: 'elegant', name: 'Elegante' },
    { id: 'magazine', name: 'Magazine' },
  ];

  // Renderizar póster según estilo
  const renderPoster = (colors: string[], name: string, style: number) => {
    const adaptedColors = adaptPalette(colors, colorCount);

    switch (style) {
      case 0: // Bold
        return (
          <div className="w-full aspect-[3/4] rounded-lg overflow-hidden relative" style={{ backgroundColor: adaptedColors[adaptedColors.length - 1] || '#1a1a1a' }}>
            <div className="absolute inset-0 flex flex-col">
              {adaptedColors.slice(0, -1).map((c, i) => (
                <div 
                  key={i} 
                  className="flex-1 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: c }}
                >
                  {i === 0 && (
                    <div className="text-center z-10">
                      <div 
                        className="text-2xl font-black uppercase tracking-tight"
                        style={{ 
                          color: adaptedColors[adaptedColors.length - 1],
                          textShadow: '3px 3px 0 rgba(0,0,0,0.2)'
                        }}
                      >
                        {name.split(' ')[0]}
                      </div>
                      <div 
                        className="text-xs font-bold uppercase tracking-[0.4em] mt-1"
                        style={{ color: adaptedColors[adaptedColors.length - 1] }}
                      >
                        {name.split(' ').slice(1).join(' ') || 'Palette'}
                      </div>
                    </div>
                  )}
                  {/* Formas decorativas */}
                  {i === 1 && (
                    <div 
                      className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-50"
                      style={{ backgroundColor: adaptedColors[0] }}
                    />
                  )}
                </div>
              ))}
            </div>
            {/* Línea de acento */}
            <div 
              className="absolute bottom-4 left-4 right-4 h-1 rounded-full"
              style={{ backgroundColor: adaptedColors[0] }}
            />
          </div>
        );

      case 1: // Artístico (nuevo, reemplaza Exhibición)
        return (
          <div className="w-full aspect-[3/4] rounded-lg overflow-hidden relative" style={{ backgroundColor: '#0a0a0a' }}>
            {/* Formas abstractas */}
            <div 
              className="absolute top-4 left-4 w-20 h-20 rounded-full blur-xl opacity-60"
              style={{ backgroundColor: adaptedColors[0] }}
            />
            <div 
              className="absolute top-12 right-6 w-16 h-16 rounded-full blur-lg opacity-70"
              style={{ backgroundColor: adaptedColors[1] || adaptedColors[0] }}
            />
            <div 
              className="absolute bottom-20 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full blur-2xl opacity-50"
              style={{ backgroundColor: adaptedColors[2] || adaptedColors[0] }}
            />
            {/* Líneas diagonales */}
            <div className="absolute inset-0">
              {adaptedColors.map((c, i) => (
                <div 
                  key={i}
                  className="absolute h-[2px] origin-left"
                  style={{ 
                    backgroundColor: c,
                    width: '150%',
                    top: `${20 + i * 18}%`,
                    left: '-10%',
                    transform: `rotate(${-15 + i * 5}deg)`,
                    opacity: 0.8
                  }}
                />
              ))}
            </div>
            {/* Texto */}
            <div className="absolute bottom-6 left-4 right-4">
              <div 
                className="text-lg font-bold mb-2"
                style={{ color: adaptedColors[0] }}
              >
                {name}
              </div>
              <div className="flex gap-2">
                {adaptedColors.map((c, i) => (
                  <div 
                    key={i} 
                    className="w-4 h-4 rounded-full ring-1 ring-white/20"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            {/* Círculo de acento */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2"
              style={{ borderColor: adaptedColors[0] }}
            >
              <div 
                className="absolute inset-2 rounded-full"
                style={{ backgroundColor: adaptedColors[1] || adaptedColors[0] }}
              />
            </div>
          </div>
        );

      case 2: // Elegante (mejorado del Minimal)
        return (
          <div className="w-full aspect-[3/4] rounded-lg overflow-hidden relative" style={{ backgroundColor: '#FAFAF8' }}>
            {/* Borde elegante */}
            <div className="absolute inset-3 border border-gray-200 rounded-lg" />
            <div className="absolute inset-5 border border-gray-100 rounded" />
            
            {/* Header minimal */}
            <div className="absolute top-8 left-8 right-8">
              <div className="text-[10px] text-gray-400 tracking-[0.4em] uppercase mb-1">Collection</div>
              <div 
                className="text-sm font-light tracking-wide"
                style={{ color: adaptedColors[0] }}
              >
                {name}
              </div>
            </div>

            {/* Paleta central */}
            <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2">
              <div className="flex gap-3 mb-6">
                {adaptedColors.map((c, i) => (
                  <div key={i} className="flex-1">
                    <div 
                      className="aspect-square rounded shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  </div>
                ))}
              </div>
              <div className="h-px bg-gray-200" />
            </div>

            {/* Footer con códigos */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex justify-between items-end">
                {adaptedColors.slice(0, 3).map((c, i) => (
                  <div key={i} className="text-center">
                    <div 
                      className="w-2 h-2 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: c }}
                    />
                    <div className="text-[8px] font-mono text-gray-400">
                      {c.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <div className="text-[8px] text-gray-300 tracking-widest">
                  {adaptedColors.length} COLORS
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Magazine
        return (
          <div className="w-full aspect-[3/4] rounded-lg overflow-hidden relative bg-white">
            {/* Header gradient */}
            <div 
              className="absolute top-0 left-0 right-0 h-1/2"
              style={{ background: `linear-gradient(135deg, ${adaptedColors[0]}, ${adaptedColors[1] || adaptedColors[0]})` }}
            />
            {/* Círculo decorativo */}
            <div 
              className="absolute top-1/4 right-4 w-20 h-20 rounded-full opacity-30"
              style={{ backgroundColor: adaptedColors[2] || '#fff' }}
            />
            {/* Card info */}
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: adaptedColors[0] }}
                  />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">Trend</div>
                    <div className="text-sm font-bold text-gray-900">{name}</div>
                  </div>
                </div>
                <div className="flex gap-1 mt-3">
                  {adaptedColors.map((c, i) => (
                    <div key={i} className="flex-1 h-8 first:rounded-l-lg last:rounded-r-lg shadow-inner" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Volver</span>
        </button>
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>🔥</span> Paletas en Tendencia
        </h2>
        <div className="w-20" />
      </div>

      {/* Controls */}
      <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar paletas, estilos, inspiraciones..."
              className="w-full bg-gray-700/50 text-white px-4 py-2.5 pl-10 rounded-xl border border-gray-600/50 focus:border-purple-500/50 outline-none text-sm"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          </div>

          {/* Color search */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setColorSearchActive(!colorSearchActive)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                colorSearchActive
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
              }`}
            >
              <span>🎨</span>
              <span>Por color</span>
            </button>
            {colorSearchActive && (
              <div className="flex items-center gap-2 bg-gray-700/50 rounded-xl p-2">
                <input
                  type="color"
                  value={searchColor}
                  onChange={(e) => setSearchColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={searchColor.toUpperCase()}
                  onChange={(e) => setSearchColor(e.target.value)}
                  className="w-20 bg-transparent text-white text-sm font-mono outline-none"
                />
              </div>
            )}
          </div>

          {/* Color count */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">Colores:</span>
            <div className="flex gap-1">
              {[3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => onColorCountChange(num)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    colorCount === num
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* View mode */}
          <div className="flex items-center gap-2 bg-gray-700/50 rounded-xl p-1">
            <button
              onClick={() => setViewMode('palette')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'palette'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🎨</span> Paleta
              </span>
            </button>
            <button
              onClick={() => setViewMode('poster')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'poster'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🖼️</span> Aplicada
              </span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Poster style selector (only in poster mode) */}
        {viewMode === 'poster' && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700/50">
            <span className="text-gray-500 text-sm self-center">Estilo:</span>
            {posterStyles.map((style, idx) => (
              <button
                key={style.id}
                onClick={() => setPosterStyle(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  posterStyle === idx
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                    : 'bg-gray-700/30 text-gray-400 hover:bg-gray-600/50'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-gray-500 text-sm">
        {filteredPalettes.length} paletas encontradas
        {colorSearchActive && (
          <span className="ml-2 text-purple-400">
            · Ordenadas por proximidad a {searchColor.toUpperCase()}
          </span>
        )}
      </div>

      {/* Palettes grid */}
      <div className={`grid gap-4 ${viewMode === 'palette' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
        {filteredPalettes.map((palette) => {
          const adaptedColors = adaptPalette(palette.colors, colorCount);

          return (
            <motion.button
              key={palette.id}
              onClick={() => setSelectedPalette(palette)}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all group text-left"
            >
              {viewMode === 'palette' ? (
                <>
                  {/* Palette bar */}
                  <div className="h-20 flex">
                    {adaptedColors.map((color, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <h3 className="text-white text-sm font-medium truncate">{palette.name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{palette.inspiration}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {palette.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Poster view */}
                  <div className="p-3">
                    {renderPoster(palette.colors, palette.name, posterStyle)}
                  </div>
                  {/* Info */}
                  <div className="px-3 pb-3">
                    <h3 className="text-white text-sm font-medium truncate">{palette.name}</h3>
                    <p className="text-gray-500 text-xs truncate">{palette.category}</p>
                  </div>
                </>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredPalettes.length === 0 && (
        <div className="text-center py-16">
          <span className="text-4xl block mb-4">🔍</span>
          <p className="text-gray-400">No se encontraron paletas</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Todos');
              setColorSearchActive(false);
            }}
            className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Selected palette modal */}
      <AnimatePresence>
        {selectedPalette && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPalette(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full border border-gray-700"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedPalette.name}</h3>
                  <p className="text-gray-400 mt-1">{selectedPalette.inspiration}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full">
                      {selectedPalette.category}
                    </span>
                    {selectedPalette.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 bg-gray-700/50 text-gray-400 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPalette(null)}
                  className="text-gray-500 hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Palette preview */}
              <div className="h-24 rounded-xl overflow-hidden flex mb-6 shadow-lg">
                {adaptPalette(selectedPalette.colors, colorCount).map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 flex items-end justify-center pb-2"
                    style={{ backgroundColor: color }}
                  >
                    <span
                      className="text-xs font-mono px-2 py-1 rounded bg-black/30"
                      style={{ color: '#fff' }}
                    >
                      {color.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Poster examples */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {posterStyles.map((style, idx) => (
                  <div key={style.id} className="text-center">
                    <div className="text-gray-500 text-xs mb-2">{style.name}</div>
                    <div className="transform scale-75 origin-top">
                      {renderPoster(selectedPalette.colors, selectedPalette.name, idx)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Color count selector */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-700/30 rounded-xl">
                <span className="text-gray-300">Número de colores:</span>
                <div className="flex gap-2">
                  {[3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => onColorCountChange(num)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        colorCount === num
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={() => {
                  onSelectPalette(adaptPalette(selectedPalette.colors, colorCount));
                  setSelectedPalette(null);
                }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <span>Usar esta paleta</span>
                <span>→</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TrendingPalettes;
