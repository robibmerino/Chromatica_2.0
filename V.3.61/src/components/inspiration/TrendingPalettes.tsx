import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hexToRgb } from '../../utils/colorUtils';
import { SectionBanner, SECTION_ICON_ACCENTS } from '../GuidedPaletteCreator/SectionBanner';

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

const TRENDING_ICON = (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M13.5 3.5C13.5 3.5 15 6 15 8.5C15 9.88071 13.8807 11 12.5 11C11.1193 11 10 9.88071 10 8.5C10 7 10.5 5.5 10.5 5.5C7 7 5 10.5 5 13.5C5 17.0899 7.91015 20 11.5 20C15.0899 20 18 17.0899 18 13.5C18 8.5 13.5 3.5 13.5 3.5Z"
      fill="currentColor"
    />
  </svg>
);

const SEARCH_ICON = (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <circle
      cx="11"
      cy="11"
      r="6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.5 15.5L19 19"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const COLOR_SWATCH_ICON = (
  <svg
    className="w-3.5 h-3.5"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <defs>
      <linearGradient id="swatch-gradient" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#4C7EFF" />
        <stop offset="0.5" stopColor="#FF4EB8" />
        <stop offset="1" stopColor="#F7D93D" />
      </linearGradient>
    </defs>
    <rect
      x="2"
      y="3"
      width="13"
      height="11"
      rx="3"
      ry="3"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="url(#swatch-gradient)"
    />
    <circle cx="13.5" cy="13.5" r="2.2" stroke="currentColor" strokeWidth="1.2" fill="#0f172a" />
  </svg>
);

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
  const [searchColor, setSearchColor] = useState('#46903c');
  const [categoryFilterActive, setCategoryFilterActive] = useState(false);

  // Filtrar paletas
  const filteredPalettes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    let palettes = CURATED_PALETTES.filter((palette) => {
      const matchesCategory =
        selectedCategory === 'Todos' || palette.category === selectedCategory;

      if (normalizedSearch === '') {
        return matchesCategory;
      }

      const nameMatches = palette.name.toLowerCase().includes(normalizedSearch);
      const tagMatches = palette.tags.some((tag) =>
        tag.toLowerCase().includes(normalizedSearch)
      );
      const inspirationMatches = palette.inspiration
        ?.toLowerCase()
        .includes(normalizedSearch);

      return matchesCategory && (nameMatches || tagMatches || inspirationMatches);
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

  // Estilos de póster - índice ligado al switch de renderPoster
  const posterStyles = [
    { id: 'bold', name: 'Bold' },       // 0
    { id: 'artistic', name: 'Artístico' }, // 1
    { id: 'elegant', name: 'Magazine' },   // 2
    { id: 'magazine', name: 'Pantone' },   // 3
  ];

  // Orden visual de los estilos en la UI (Bold, Magazine, Elegante, Artístico)
  const posterStyleOrder = [0, 3, 2, 1] as const;

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

      case 1: // Artístico
        return (
          <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-slate-950 relative">
            <div className="absolute inset-3 rounded-2xl bg-slate-900 border border-slate-800/80 overflow-hidden">
              {/* Composición geométrica */}
              <div className="absolute inset-0">
                {/* Bloque diagonal principal */}
                <div
                  className="absolute -left-10 top-6 w-40 h-24 rotate-[-18deg]"
                  style={{ backgroundColor: adaptedColors[0] }}
                />
                {/* Rectángulo superior */}
                <div
                  className="absolute right-0 top-3 w-16 h-10 rounded-l-2xl"
                  style={{ backgroundColor: adaptedColors[1] || adaptedColors[0] }}
                />
                {/* Círculo central */}
                <div
                  className="absolute left-7 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2"
                  style={{ borderColor: adaptedColors[3] || adaptedColors[0] }}
                >
                  <div
                    className="m-2 rounded-full"
                    style={{ backgroundColor: adaptedColors[4] || adaptedColors[1] || adaptedColors[0] }}
                  />
                </div>
                {/* Banda inferior de bloques (responde al número de colores) */}
                <div className="absolute left-0 right-0 bottom-16 flex gap-1 px-6">
                  {adaptedColors.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1 h-3 rounded-md"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                {/* Líneas finas horizontales */}
                {[0, 1, 2].map((row) => (
                  <div
                    key={row}
                    className="absolute left-3 right-3 h-px"
                    style={{
                      backgroundColor: adaptedColors[row + 1] || adaptedColors[0],
                      top: `${24 + row * 10}%`,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>

              {/* Franja inferior para texto (asegura contraste y alineación) */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/95 via-slate-950/85 to-transparent" />

              {/* Nombre de la paleta con tipografía más artística */}
              <div className="absolute left-4 bottom-3 right-4 flex items-end justify-between">
                <div
                  className="text-[10px] font-semibold italic tracking-[0.22em] uppercase break-words leading-tight max-w-[70%]"
                  style={{ color: '#e5e7eb' }}
                >
                  {name}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[7px] uppercase tracking-[0.3em] text-slate-500">
                    Art Print
                  </span>
                  <div className="flex gap-1">
                    {adaptedColors.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full border border-slate-800"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Elegante
        return (
          <div
            className="w-full aspect-[3/4] rounded-lg overflow-hidden relative"
            style={{ backgroundColor: adaptedColors[adaptedColors.length - 1] || '#e5e7eb' }}
          >
            <div className="absolute inset-4 rounded-2xl bg-white/95 shadow-[0_18px_35px_rgba(15,23,42,0.32)] overflow-hidden flex flex-col">
              <div className="flex-1 flex">
                {/* Faja lateral */}
                <div
                  className="w-8 flex flex-col items-center justify-between py-3"
                  style={{ backgroundColor: adaptedColors[0] || '#111827' }}
                >
                  <div className="flex flex-col gap-1">
                    {adaptedColors.slice(0, 3).map((c, i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="text-[8px] tracking-[0.3em] text-white/70 rotate-180 [writing-mode:vertical-rl]">
                    ELEGANT
                  </div>
                </div>

                {/* Contenido principal */}
                <div className="flex-1 px-3 py-3 flex flex-col justify-between">
                  <div>
                    <div className="text-[9px] text-gray-400 tracking-[0.35em] uppercase mb-1.5">
                      Collection
                    </div>
                    <div
                      className="text-[11px] font-medium leading-snug line-clamp-2 break-words h-[32px]"
                      style={{ color: adaptedColors[0] }}
                    >
                      {name}
                    </div>
                  </div>

                  <div className="mt-3 space-y-3">
                    {/* Banda de color */}
                    <div className="h-8 rounded-xl overflow-hidden flex bg-gray-100">
                      {adaptedColors.map((c, i) => (
                        <div
                          key={i}
                          className="flex-1"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    {/* Chips individuales */}
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                      {adaptedColors.slice(0, 3).map((c, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-gray-200"
                            style={{ backgroundColor: c }}
                          />
                          <span className="text-[7px] font-mono text-gray-400">
                            {c.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-gray-200 flex items-center justify-between">
                <span className="text-[9px] text-gray-400 uppercase tracking-[0.25em]">
                  {adaptedColors.length} Colores
                </span>
                <span className="text-[9px] text-gray-500 font-mono">
                  {adaptedColors[0]?.toUpperCase()}
                </span>
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
    <div className="w-full h-full flex flex-col min-h-0 gap-4">
      <SectionBanner
        onBack={onBack}
        title="Paletas en Tendencia"
        subtitle="Explora paletas curadas por estilo, sector y tendencia."
        icon={TRENDING_ICON}
        iconBoxClassName={SECTION_ICON_ACCENTS.orange}
      />

      {/* Layout sin scroll global: izquierda fija, derecha con scroll propio */}
      <div className="flex-1 min-h-0 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 min-h-0 items-start h-[calc(var(--app-vh)-180px)]">
          {/* Columna izquierda: filtros y configuraciones */}
          <aside className="w-full md:w-80 lg:w-96 shrink-0 self-start flex flex-col gap-3">
            {/* Panel principal de control */}
            <div className="bg-gray-900/70 rounded-2xl p-4 md:p-5 border border-gray-800/80 shadow-sm flex flex-col gap-5">
              {/* Buscador */}
              <div className="space-y-2">
                <span className="text-[11px] text-gray-400 uppercase tracking-[0.18em]">
                  Buscar paletas
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {SEARCH_ICON}
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nombre, tags o inspiración…"
                    className="w-full bg-gray-800/80 text-sm text-gray-50 placeholder:text-gray-500 rounded-xl pl-9 pr-3 py-2.5 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Búsqueda por color (progresiva) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-gray-400 uppercase tracking-[0.18em]">
                    Busqueda por Color
                  </span>
                  <button
                    type="button"
                    onClick={() => setColorSearchActive(!colorSearchActive)}
                    className="inline-flex items-center justify-end gap-2 text-[11px] text-gray-300"
                  >
                    <span
                      className={`inline-flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
                        colorSearchActive ? 'bg-indigo-500/70' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
                          colorSearchActive ? 'translate-x-3.5 bg-indigo-100' : ''
                        }`}
                      />
                    </span>
                    <span>{colorSearchActive ? 'Activo' : 'Filtrar'}</span>
                  </button>
                </div>
                {colorSearchActive && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-8 h-8 rounded-lg border border-gray-700 bg-gray-900/80 overflow-hidden shadow-sm">
                      <input
                        type="color"
                        value={searchColor}
                        onChange={(e) => setSearchColor(e.target.value)}
                        className="w-full h-full cursor-pointer border-0 bg-transparent p-0"
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-100">
                      {searchColor.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Búsqueda por categoría (progresiva) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-gray-400 uppercase tracking-[0.18em]">
                    Busqueda por categoria
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilterActive(!categoryFilterActive);
                      if (categoryFilterActive) {
                        setSelectedCategory('Todos');
                      }
                    }}
                    className="inline-flex items-center justify-end gap-2 text-[11px] text-gray-300"
                  >
                    <span
                      className={`inline-flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
                        categoryFilterActive ? 'bg-indigo-500/70' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
                          categoryFilterActive ? 'translate-x-3.5 bg-indigo-100' : ''
                        }`}
                      />
                    </span>
                    <span>{categoryFilterActive ? 'Activo' : 'Filtrar'}</span>
                  </button>
                </div>

                {categoryFilterActive && (
                  <div className="pt-1 grid grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`h-9 rounded-lg text-[11px] font-medium px-1.5 flex items-center justify-center text-center transition-all ${
                          selectedCategory === cat
                            ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/40'
                            : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/70'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Panel de ajustes de presentación + estilo aplicado */}
            <div className="bg-gray-900/70 rounded-2xl p-4 md:p-5 border border-gray-800/80 shadow-sm flex flex-col gap-4">
              {/* Ajustes de presentación */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Número de colores */}
                  <div className="space-y-2">
                    <span className="text-[11px] text-gray-400 uppercase tracking-[0.18em]">
                      Número de colores
                    </span>
                    <div className="inline-flex rounded-xl bg-gray-800/80 p-1 gap-1">
                      {[3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => onColorCountChange(num)}
                          className={`w-9 h-8 rounded-lg text-[13px] font-medium transition-all ${
                            colorCount === num
                              ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/40'
                              : 'text-gray-300 hover:bg-gray-700/70'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Modo de vista */}
                  <div className="space-y-2">
                    <span className="text-[11px] text-gray-400 uppercase tracking-[0.18em]">
                      Modo de vista
                    </span>
                    <div className="inline-flex w-full rounded-xl bg-gray-800/80 p-1">
                      <button
                        onClick={() => setViewMode('palette')}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          viewMode === 'palette'
                            ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/40'
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        Paleta
                      </button>
                      <button
                        onClick={() => setViewMode('poster')}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          viewMode === 'poster'
                            ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/40'
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        Aplicada
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estilo aplicado */}
              {viewMode === 'poster' && (
                <div className="space-y-2">
                  <span className="text-[11px] text-gray-400 uppercase tracking-[0.18em]">
                    Estilo aplicado
                  </span>
                  <div className="mt-1 grid grid-cols-4 gap-2">
                    {posterStyleOrder.map((styleIndex) => {
                      const style = posterStyles[styleIndex];
                      return (
                        <button
                          key={style.id}
                          onClick={() => setPosterStyle(styleIndex)}
                          className={`h-9 w-full rounded-lg text-[11px] font-medium flex items-center justify-center text-center transition-all ${
                            posterStyle === styleIndex
                              ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/40'
                              : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/70'
                          }`}
                        >
                          {style.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Columna derecha: resultados y grid (con scroll propio) */}
          <section className="flex-1 min-w-0 flex flex-col min-h-0">
            <div className="bg-gray-900/70 rounded-2xl border border-gray-800/80 shadow-sm px-4 py-3 md:px-5 md:py-4 flex flex-col gap-3 min-h-0">
              <div className="text-gray-500 text-sm flex items-center justify-between">
                <span>
                  {filteredPalettes.length} paletas encontradas
                  {colorSearchActive && (
                    <span className="ml-2 text-purple-400">
                      · Ordenadas por proximidad a {searchColor.toUpperCase()}
                    </span>
                  )}
                </span>
              </div>

              <div className="inspiration-scroll-area overflow-y-auto pr-4 pb-4 max-h-[66vh]">
                <div
                  className={`grid gap-4 ${
                    viewMode === 'palette'
                      ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  }`}
                >
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
                              <h3 className="text-white text-sm font-medium truncate">
                                {palette.name}
                              </h3>
                              <p className="text-gray-500 text-xs mt-0.5 truncate">
                                {palette.inspiration}
                              </p>
                            <div className="flex flex-nowrap gap-1 mt-2 overflow-hidden">
                                {palette.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                  className="text-[10px] px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded-full whitespace-nowrap max-w-[96px] overflow-hidden text-ellipsis"
                                  >
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
                              <h3 className="text-white text-sm font-medium truncate">
                                {palette.name}
                              </h3>
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
              </div>
            </div>
          </section>
        </div>
      </div>

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
                    <span className="text-xs px-3 py-1 bg-indigo-600/30 text-indigo-200 rounded-full">
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
                {posterStyleOrder.map((styleIndex) => {
                  const style = posterStyles[styleIndex];
                  return (
                    <div key={style.id} className="text-center">
                      <div className="text-gray-500 text-xs mb-2">{style.name}</div>
                      <div className="transform scale-75 origin-top">
                        {renderPoster(selectedPalette.colors, selectedPalette.name, styleIndex)}
                      </div>
                    </div>
                  );
                })}
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
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
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
