import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ExportCreatorResults } from './ExportCreatorResults';

// Ejes de términos opuestos para modo comparativa
interface AxisPair {
  id: string;
  left: { term: string; colors: string[] };
  right: { term: string; colors: string[] };
}

const AXIS_PAIRS: AxisPair[] = [
  { id: 'calm-energy', left: { term: 'Calma', colors: ['#87CEEB', '#B0E0E6', '#E0FFFF', '#98D8C8'] }, right: { term: 'Energía', colors: ['#FF4500', '#FF6347', '#FFD700', '#FF1493'] } },
  { id: 'minimal-maximal', left: { term: 'Minimalista', colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E'] }, right: { term: 'Maximalista', colors: ['#FF0080', '#7928CA', '#0070F3', '#50E3C2'] } },
  { id: 'bold-shy', left: { term: 'Atrevido', colors: ['#FF0000', '#FF4500', '#DC143C', '#8B0000'] }, right: { term: 'Tímido', colors: ['#E6E6FA', '#D8BFD8', '#FFEFD5', '#FFF0F5'] } },
  { id: 'modern-traditional', left: { term: 'Moderno', colors: ['#2D3436', '#00CEC9', '#0984E3', '#6C5CE7'] }, right: { term: 'Tradicional', colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887'] } },
  { id: 'warm-cold', left: { term: 'Cálido', colors: ['#FF6B35', '#FF8C42', '#FFB347', '#F4A460'] }, right: { term: 'Frío', colors: ['#00CED1', '#40E0D0', '#7FFFD4', '#B0E0E6'] } },
  { id: 'light-dark', left: { term: 'Luminoso', colors: ['#FFFFFF', '#FFFACD', '#FAFAD2', '#F0E68C'] }, right: { term: 'Oscuro', colors: ['#0D0D0D', '#1A1A2E', '#2C3E50', '#1A252F'] } },
  { id: 'playful-serious', left: { term: 'Juguetón', colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'] }, right: { term: 'Serio', colors: ['#2C3E50', '#34495E', '#1A252F', '#2E4053'] } },
  { id: 'organic-geometric', left: { term: 'Orgánico', colors: ['#8BC34A', '#689F38', '#558B2F', '#DCEDC8'] }, right: { term: 'Geométrico', colors: ['#3F51B5', '#5C6BC0', '#303F9F', '#7986CB'] } },
  { id: 'vintage-futuristic', left: { term: 'Vintage', colors: ['#D4A574', '#E8D5B7', '#967259', '#C9B896'] }, right: { term: 'Futurista', colors: ['#00F5FF', '#BF00FF', '#39FF14', '#1A1A2E'] } },
  { id: 'feminine-masculine', left: { term: 'Femenino', colors: ['#FF69B4', '#FFB6C1', '#DDA0DD', '#FFC0CB'] }, right: { term: 'Masculino', colors: ['#2C3E50', '#34495E', '#1A252F', '#3498DB'] } },
  { id: 'natural-artificial', left: { term: 'Natural', colors: ['#228B22', '#8B4513', '#DAA520', '#90EE90'] }, right: { term: 'Artificial', colors: ['#9D00FF', '#00FF00', '#FF0080', '#00FFFF'] } },
  { id: 'elegant-casual', left: { term: 'Elegante', colors: ['#2C2C2C', '#C9A227', '#D4AF37', '#1A1A2E'] }, right: { term: 'Casual', colors: ['#87CEEB', '#98FB98', '#FFDAB9', '#FFB6C1'] } },
  { id: 'loud-quiet', left: { term: 'Ruidoso', colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF4500'] }, right: { term: 'Silencioso', colors: ['#F5F5DC', '#FAEBD7', '#FFF8DC', '#FFFAF0'] } },
  { id: 'complex-simple', left: { term: 'Complejo', colors: ['#6A5ACD', '#7B68EE', '#9370DB', '#BA55D3'] }, right: { term: 'Simple', colors: ['#FFFFFF', '#F5F5F5', '#000000', '#808080'] } },
  { id: 'romantic-practical', left: { term: 'Romántico', colors: ['#FF69B4', '#FFB6C1', '#FFC0CB', '#DB7093'] }, right: { term: 'Práctico', colors: ['#4A5568', '#718096', '#A0AEC0', '#CBD5E0'] } },
  { id: 'dreamy-realistic', left: { term: 'Soñador', colors: ['#E6E6FA', '#B0C4DE', '#87CEEB', '#DDA0DD'] }, right: { term: 'Realista', colors: ['#696969', '#808080', '#A9A9A9', '#8B4513'] } },
  { id: 'festive-solemn', left: { term: 'Festivo', colors: ['#FF0000', '#00FF00', '#FFD700', '#FF69B4'] }, right: { term: 'Solemne', colors: ['#2C3E50', '#4B0082', '#800020', '#1A1A2E'] } },
  { id: 'urban-rural', left: { term: 'Urbano', colors: ['#4A4A4A', '#808080', '#A9A9A9', '#2C3E50'] }, right: { term: 'Rural', colors: ['#228B22', '#8B4513', '#DAA520', '#90EE90'] } },
  { id: 'tech-artisan', left: { term: 'Tecnológico', colors: ['#0066FF', '#00D4FF', '#7C3AED', '#1E293B'] }, right: { term: 'Artesanal', colors: ['#C19A6B', '#8B4513', '#CD853F', '#DDA0DD'] } },
  { id: 'youthful-mature', left: { term: 'Juvenil', colors: ['#FF6B9D', '#C44DFF', '#00D4FF', '#FFE66D'] }, right: { term: 'Maduro', colors: ['#8B7355', '#A0522D', '#DEB887', '#BC8F8F'] } },
  { id: 'mysterious-transparent', left: { term: 'Misterioso', colors: ['#4B0082', '#663399', '#8B008B', '#1A1A2E'] }, right: { term: 'Transparente', colors: ['#FFFFFF', '#F0FFFF', '#E0FFFF', '#FAFAFA'] } },
  { id: 'dynamic-static', left: { term: 'Dinámico', colors: ['#FF5722', '#FF9800', '#FFEB3B', '#E91E63'] }, right: { term: 'Estático', colors: ['#757575', '#9E9E9E', '#BDBDBD', '#E0E0E0'] } },
  { id: 'sweet-bitter', left: { term: 'Dulce', colors: ['#FFB6C1', '#FFD1DC', '#FFDAB9', '#FFF0F5'] }, right: { term: 'Amargo', colors: ['#8B4513', '#6B4423', '#4A3728', '#3D2914'] } },
  { id: 'ethereal-grounded', left: { term: 'Etéreo', colors: ['#E6E6FA', '#F0E6FF', '#E8D5E8', '#D8BFD8'] }, right: { term: 'Terrenal', colors: ['#8B4513', '#A0522D', '#6B4423', '#CD853F'] } },
];

interface ArchetypesCreatorProps {
  onCreatePalette: (colors: string[]) => void;
  onBack: () => void;
  colorCount: number;
  onColorCountChange: (count: number) => void;
}

interface Concept {
  name: string;
  colors: string[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  concepts: Concept[];
}

interface SelectedConcept {
  category: string;
  concept: string;
  color: string;
  isCustom?: boolean;
}

interface ActiveAxis {
  id: string;
  value: number; // -2, -1, 0, 1, 2 (5 niveles)
}

const CATEGORIES: Category[] = [
  {
    id: 'emotional',
    name: 'Emocionales',
    icon: '💝',
    concepts: [
      { name: 'Alegría', colors: ['#FFD700', '#FFA500', '#FFEC8B', '#F0E68C', '#FFB347', '#FFDAB9'] },
      { name: 'Calma', colors: ['#87CEEB', '#B0E0E6', '#ADD8E6', '#E0FFFF', '#AFEEEE', '#98D8C8'] },
      { name: 'Pasión', colors: ['#DC143C', '#FF4500', '#B22222', '#FF6347', '#CD5C5C', '#E74C3C'] },
      { name: 'Melancolía', colors: ['#4A5568', '#718096', '#6B7280', '#9CA3AF', '#8B9DC3', '#7F8C8D'] },
      { name: 'Esperanza', colors: ['#90EE90', '#98FB98', '#00FA9A', '#7CFC00', '#ADFF2F', '#32CD32'] },
      { name: 'Misterio', colors: ['#4B0082', '#663399', '#8B008B', '#9932CC', '#6A0DAD', '#7B68EE'] },
      { name: 'Amor', colors: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB', '#DB7093', '#E91E63'] },
      { name: 'Serenidad', colors: ['#E6E6FA', '#D8BFD8', '#DDA0DD', '#EE82EE', '#F0E6FF', '#E8D5E8'] },
      { name: 'Emoción', colors: ['#FF6B6B', '#FF8E53', '#FEC89A', '#FFD93D', '#6BCB77', '#4D96FF'] },
      { name: 'Nostalgia', colors: ['#D4A574', '#C19A6B', '#DEB887', '#F5DEB3', '#D2B48C', '#BC8F8F'] },
      { name: 'Euforia', colors: ['#FF00FF', '#FF1493', '#00FFFF', '#FFFF00', '#FF6600', '#7FFF00'] },
      { name: 'Tristeza', colors: ['#5D6D7E', '#7F8C8D', '#95A5A6', '#BDC3C7', '#85929E', '#AEB6BF'] },
    ]
  },
  {
    id: 'styles',
    name: 'Estilos',
    icon: '🎨',
    concepts: [
      { name: 'Moderno', colors: ['#2D3436', '#00CEC9', '#0984E3', '#6C5CE7', '#FDCB6E', '#E17055'] },
      { name: 'Tradicional', colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#D2691E', '#B8860B'] },
      { name: 'Juvenil', colors: ['#FF6B9D', '#C44DFF', '#00D4FF', '#FFE66D', '#4ECDC4', '#FF6B6B'] },
      { name: 'Minimalista', colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E', '#212121', '#000000'] },
      { name: 'Maximalista', colors: ['#FF0080', '#7928CA', '#0070F3', '#50E3C2', '#F5A623', '#FF4081'] },
      { name: 'Vintage', colors: ['#D4A574', '#E8D5B7', '#967259', '#C9B896', '#8B7355', '#F5E6D3'] },
      { name: 'Retro', colors: ['#FF6F61', '#FFB347', '#87CEEB', '#DDA0DD', '#98D8C8', '#F0E68C'] },
      { name: 'Futurista', colors: ['#00F5FF', '#BF00FF', '#39FF14', '#FF073A', '#0D0D0D', '#1A1A2E'] },
      { name: 'Bohemio', colors: ['#C19A6B', '#8B4513', '#CD853F', '#DDA0DD', '#98D8C8', '#F4A460'] },
      { name: 'Industrial', colors: ['#4A4A4A', '#6B6B6B', '#8B8B8B', '#A9A9A9', '#C0C0C0', '#D3D3D3'] },
      { name: 'Escandinavo', colors: ['#FFFFFF', '#F5F5DC', '#E8DCC4', '#C4B8A5', '#A69F98', '#6B5B4F'] },
      { name: 'Art Deco', colors: ['#D4AF37', '#000000', '#1A1A2E', '#C9A227', '#8B7355', '#2C3E50'] },
    ]
  },
  {
    id: 'personality',
    name: 'Personalidad',
    icon: '🎭',
    concepts: [
      { name: 'Atrevido', colors: ['#FF0000', '#FF4500', '#FF6347', '#DC143C', '#B22222', '#8B0000'] },
      { name: 'Tímido', colors: ['#E6E6FA', '#D8BFD8', '#DDA0DD', '#FFEFD5', '#FFF0F5', '#F0FFF0'] },
      { name: 'Alocado', colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF6600', '#7FFF00', '#FF1493'] },
      { name: 'Serio', colors: ['#2C3E50', '#34495E', '#1A252F', '#2E4053', '#283747', '#212F3C'] },
      { name: 'Juguetón', colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'] },
      { name: 'Elegante', colors: ['#2C2C2C', '#C9A227', '#8B7355', '#D4AF37', '#1A1A2E', '#4A4A4A'] },
      { name: 'Rebelde', colors: ['#FF0000', '#000000', '#FFFFFF', '#FFD700', '#DC143C', '#1A1A1A'] },
      { name: 'Soñador', colors: ['#E6E6FA', '#B0C4DE', '#87CEEB', '#DDA0DD', '#FFB6C1', '#F0E6FF'] },
      { name: 'Aventurero', colors: ['#228B22', '#8B4513', '#DAA520', '#2E8B57', '#D2691E', '#6B8E23'] },
      { name: 'Enigmático', colors: ['#1A1A2E', '#16213E', '#0F3460', '#533483', '#4A0E4E', '#2C003E'] },
      { name: 'Chill', colors: ['#A8E6CF', '#DCEDC1', '#FFD3B6', '#FFAAA5', '#FF8B94', '#B5EAD7'] },
      { name: 'Enérgico', colors: ['#FF5722', '#FF9800', '#FFEB3B', '#4CAF50', '#03A9F4', '#E91E63'] },
    ]
  },
  {
    id: 'contexts',
    name: 'Contextos',
    icon: '🏠',
    concepts: [
      { name: 'Casero', colors: ['#DEB887', '#F5DEB3', '#FAEBD7', '#FFE4C4', '#FFDAB9', '#EEE8DC'] },
      { name: 'Urbano', colors: ['#4A4A4A', '#808080', '#A9A9A9', '#C0C0C0', '#2C3E50', '#7F8C8D'] },
      { name: 'Rural', colors: ['#228B22', '#8B4513', '#DAA520', '#90EE90', '#DEB887', '#6B8E23'] },
      { name: 'Playero', colors: ['#00CED1', '#FFD700', '#FF6347', '#87CEEB', '#FFA07A', '#20B2AA'] },
      { name: 'Montañés', colors: ['#4A6741', '#8B7355', '#6B8E23', '#808080', '#A9A9A9', '#2E8B57'] },
      { name: 'Nocturno', colors: ['#0D1B2A', '#1B263B', '#415A77', '#778DA9', '#1A1A2E', '#16213E'] },
      { name: 'Diurno', colors: ['#87CEEB', '#FFD700', '#90EE90', '#FAFAD2', '#FFFACD', '#F0E68C'] },
      { name: 'Cósmico', colors: ['#0D0D0D', '#1A1A2E', '#7B68EE', '#9370DB', '#E6E6FA', '#4B0082'] },
      { name: 'Submarino', colors: ['#006994', '#40E0D0', '#00CED1', '#20B2AA', '#5F9EA0', '#008B8B'] },
      { name: 'Bosque', colors: ['#228B22', '#006400', '#2E8B57', '#3CB371', '#8B4513', '#556B2F'] },
      { name: 'Desierto', colors: ['#EDC9AF', '#C19A6B', '#D2B48C', '#DEB887', '#F4A460', '#CD853F'] },
      { name: 'Polar', colors: ['#FFFFFF', '#F0FFFF', '#E0FFFF', '#B0E0E6', '#ADD8E6', '#87CEEB'] },
    ]
  },
  {
    id: 'industries',
    name: 'Industrias',
    icon: '💼',
    concepts: [
      { name: 'Tecnología', colors: ['#0066FF', '#00D4FF', '#7C3AED', '#10B981', '#1E293B', '#3B82F6'] },
      { name: 'Orgánico', colors: ['#8BC34A', '#689F38', '#558B2F', '#33691E', '#DCEDC8', '#AED581'] },
      { name: 'Ecológico', colors: ['#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9', '#2E7D32', '#1B5E20'] },
      { name: 'Gamer', colors: ['#9D00FF', '#00FF00', '#FF0080', '#00FFFF', '#FF4500', '#1A1A2E'] },
      { name: 'Corporativo', colors: ['#003366', '#004080', '#0059B3', '#0073E6', '#FFFFFF', '#1A365D'] },
      { name: 'Salud', colors: ['#00BCD4', '#4DD0E1', '#80DEEA', '#E0F7FA', '#26A69A', '#00897B'] },
      { name: 'Moda', colors: ['#000000', '#FFFFFF', '#E91E63', '#9C27B0', '#FF5722', '#795548'] },
      { name: 'Alimentación', colors: ['#FF5722', '#FF9800', '#FFC107', '#8BC34A', '#4CAF50', '#795548'] },
      { name: 'Finanzas', colors: ['#1A365D', '#2D3748', '#4A5568', '#10B981', '#059669', '#047857'] },
      { name: 'Educación', colors: ['#3F51B5', '#5C6BC0', '#7986CB', '#9FA8DA', '#FF9800', '#FFC107'] },
      { name: 'Deportes', colors: ['#F44336', '#FF9800', '#FFEB3B', '#4CAF50', '#2196F3', '#212121'] },
      { name: 'Lujo', colors: ['#D4AF37', '#B8860B', '#1A1A1A', '#2C2C2C', '#C9A227', '#FFD700'] },
    ]
  },
  {
    id: 'cultural',
    name: 'Culturales',
    icon: '🌍',
    concepts: [
      { name: 'Asiático', colors: ['#C41E3A', '#FFD700', '#000000', '#FF4500', '#8B0000', '#228B22'] },
      { name: 'Nórdico', colors: ['#FFFFFF', '#E8E8E8', '#87CEEB', '#4682B4', '#2F4F4F', '#708090'] },
      { name: 'Africano', colors: ['#CD853F', '#D2691E', '#8B4513', '#228B22', '#FFD700', '#FF4500'] },
      { name: 'Latino', colors: ['#FF6347', '#FFD700', '#00CED1', '#FF1493', '#32CD32', '#FF4500'] },
      { name: 'Árabe', colors: ['#C19A6B', '#DAA520', '#800020', '#006400', '#4169E1', '#FFD700'] },
      { name: 'Griego', colors: ['#0066CC', '#FFFFFF', '#87CEEB', '#FFD700', '#F5F5DC', '#4169E1'] },
      { name: 'Japonés', colors: ['#BC002D', '#FFFFFF', '#000000', '#FFB7C5', '#2E8B57', '#D4AF37'] },
      { name: 'Indio', colors: ['#FF6600', '#FFD700', '#8B0000', '#228B22', '#4169E1', '#FF1493'] },
      { name: 'Mexicano', colors: ['#006341', '#CE1126', '#FFD700', '#FF6347', '#00CED1', '#8B4513'] },
      { name: 'Marroquí', colors: ['#C19A6B', '#1E90FF', '#FFD700', '#CD853F', '#8B4513', '#006400'] },
      { name: 'Mediterráneo', colors: ['#0066CC', '#FFFFFF', '#FFD700', '#228B22', '#FF6347', '#87CEEB'] },
      { name: 'Tropical', colors: ['#FF6347', '#FFD700', '#00CED1', '#FF1493', '#32CD32', '#FF4500'] },
    ]
  },
  {
    id: 'sensations',
    name: 'Sensaciones',
    icon: '✨',
    concepts: [
      { name: 'Cálido', colors: ['#FF6B35', '#FF8C42', '#FFB347', '#FFC75F', '#FFE066', '#F4A460'] },
      { name: 'Fresco', colors: ['#00CED1', '#40E0D0', '#7FFFD4', '#98D8C8', '#AFEEEE', '#B0E0E6'] },
      { name: 'Suave', colors: ['#FFE4E1', '#FFF0F5', '#F0FFF0', '#F0FFFF', '#FFF5EE', '#FAEBD7'] },
      { name: 'Áspero', colors: ['#8B4513', '#A0522D', '#6B4423', '#5D3A1A', '#8B7355', '#6B5B4F'] },
      { name: 'Ligero', colors: ['#FFFAFA', '#F8F8FF', '#F0FFFF', '#FFEFD5', '#FFF8DC', '#FFFAF0'] },
      { name: 'Pesado', colors: ['#2C3E50', '#1A252F', '#0D1B2A', '#2E4053', '#283747', '#212F3C'] },
      { name: 'Dulce', colors: ['#FFB6C1', '#FFD1DC', '#FFDAB9', '#FFE4B5', '#FFFACD', '#FFF0F5'] },
      { name: 'Picante', colors: ['#FF4500', '#FF6347', '#DC143C', '#B22222', '#8B0000', '#FF0000'] },
      { name: 'Relajado', colors: ['#98D8C8', '#A8E6CF', '#B5EAD7', '#C7ECEE', '#DFE6E9', '#E8F6F3'] },
      { name: 'Intenso', colors: ['#8B0000', '#4B0082', '#191970', '#006400', '#8B4513', '#2F4F4F'] },
      { name: 'Refrescante', colors: ['#00FFFF', '#7FFFD4', '#40E0D0', '#48D1CC', '#00CED1', '#20B2AA'] },
      { name: 'Acogedor', colors: ['#DEB887', '#D2B48C', '#C19A6B', '#BDB76B', '#F5DEB3', '#FAEBD7'] },
    ]
  },
  {
    id: 'nature',
    name: 'Naturaleza',
    icon: '🌿',
    concepts: [
      { name: 'Floral', colors: ['#FF69B4', '#FFB6C1', '#DDA0DD', '#EE82EE', '#FF1493', '#DB7093'] },
      { name: 'Terroso', colors: ['#8B4513', '#A0522D', '#6B4423', '#CD853F', '#D2691E', '#8B7355'] },
      { name: 'Acuático', colors: ['#006994', '#0077B6', '#00B4D8', '#48CAE4', '#90E0EF', '#CAF0F8'] },
      { name: 'Tropical', colors: ['#FF6B35', '#00CED1', '#FFD700', '#FF1493', '#32CD32', '#FF4500'] },
      { name: 'Ártico', colors: ['#FFFFFF', '#E0FFFF', '#B0E0E6', '#87CEEB', '#ADD8E6', '#F0FFFF'] },
      { name: 'Volcánico', colors: ['#FF4500', '#8B0000', '#2F4F4F', '#696969', '#A9A9A9', '#DC143C'] },
      { name: 'Celestial', colors: ['#191970', '#000080', '#4169E1', '#6495ED', '#87CEEB', '#B0E0E6'] },
      { name: 'Mineral', colors: ['#708090', '#778899', '#B0C4DE', '#C0C0C0', '#A9A9A9', '#D3D3D3'] },
      { name: 'Otoñal', colors: ['#D2691E', '#CD853F', '#DEB887', '#F4A460', '#D2B48C', '#8B4513'] },
      { name: 'Primaveral', colors: ['#98FB98', '#90EE90', '#00FA9A', '#FFB6C1', '#FFDAB9', '#E6E6FA'] },
      { name: 'Veraniego', colors: ['#FFD700', '#FF6347', '#00CED1', '#32CD32', '#FF4500', '#87CEEB'] },
      { name: 'Invernal', colors: ['#FFFFFF', '#B0E0E6', '#ADD8E6', '#708090', '#4682B4', '#191970'] },
    ]
  },
  {
    id: 'atmospheres',
    name: 'Atmósferas',
    icon: '🌙',
    concepts: [
      { name: 'Romántico', colors: ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FFE4E1', '#DB7093', '#C71585'] },
      { name: 'Dramático', colors: ['#8B0000', '#4B0082', '#2F4F4F', '#1A1A2E', '#800000', '#191970'] },
      { name: 'Pacífico', colors: ['#87CEEB', '#98D8C8', '#B0E0E6', '#E0FFFF', '#F0FFFF', '#AFEEEE'] },
      { name: 'Festivo', colors: ['#FF0000', '#00FF00', '#FFD700', '#FF69B4', '#00FFFF', '#FF4500'] },
      { name: 'Solemne', colors: ['#2C3E50', '#34495E', '#4B0082', '#800020', '#1A1A2E', '#2F4F4F'] },
      { name: 'Caprichoso', colors: ['#FF69B4', '#DDA0DD', '#E6E6FA', '#FFB6C1', '#87CEEB', '#98FB98'] },
      { name: 'Oscuro', colors: ['#0D0D0D', '#1A1A1A', '#2C2C2C', '#3D3D3D', '#1A1A2E', '#0D1B2A'] },
      { name: 'Brillante', colors: ['#FFFF00', '#FFD700', '#FFA500', '#FFFFFF', '#FFFACD', '#FAFAD2'] },
      { name: 'Místico', colors: ['#4B0082', '#8B008B', '#9400D3', '#9932CC', '#BA55D3', '#DA70D6'] },
      { name: 'Zen', colors: ['#98D8C8', '#A8E6CF', '#C4E0C4', '#E8F5E9', '#F5F5DC', '#FAEBD7'] },
      { name: 'Épico', colors: ['#FFD700', '#8B0000', '#1A1A2E', '#4B0082', '#C9A227', '#2F4F4F'] },
      { name: 'Íntimo', colors: ['#DEB887', '#F5DEB3', '#FFE4C4', '#FFDAB9', '#FFC0CB', '#FFE4E1'] },
    ]
  },
  {
    id: 'abstract',
    name: 'Abstractos',
    icon: '🔮',
    concepts: [
      { name: 'Libertad', colors: ['#87CEEB', '#00CED1', '#20B2AA', '#48D1CC', '#40E0D0', '#00FFFF'] },
      { name: 'Poder', colors: ['#8B0000', '#4B0082', '#2F4F4F', '#191970', '#800000', '#000080'] },
      { name: 'Sabiduría', colors: ['#4B0082', '#6A5ACD', '#7B68EE', '#9370DB', '#8A2BE2', '#9932CC'] },
      { name: 'Caos', colors: ['#FF0000', '#FF00FF', '#00FFFF', '#FFFF00', '#00FF00', '#FF4500'] },
      { name: 'Armonía', colors: ['#98D8C8', '#A8E6CF', '#DCEDC1', '#FFD3B6', '#FFAAA5', '#FF8B94'] },
      { name: 'Tiempo', colors: ['#C9A227', '#B8860B', '#D4AF37', '#DAA520', '#8B7355', '#6B5B4F'] },
      { name: 'Infinito', colors: ['#191970', '#000080', '#4169E1', '#0000CD', '#00008B', '#000033'] },
      { name: 'Simplicidad', colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575'] },
      { name: 'Complejidad', colors: ['#6A5ACD', '#7B68EE', '#9370DB', '#BA55D3', '#DA70D6', '#EE82EE'] },
      { name: 'Innovación', colors: ['#00D4FF', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#0066FF'] },
      { name: 'Tradición', colors: ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#DEB887', '#F5DEB3'] },
      { name: 'Futuro', colors: ['#00F5FF', '#BF00FF', '#39FF14', '#FF073A', '#7B68EE', '#00FFFF'] },
    ]
  },
  {
    id: 'audiences',
    name: 'Audiencias',
    icon: '👥',
    concepts: [
      { name: 'Infantil', colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF8B94', '#A8E6CF'] },
      { name: 'Adolescente', colors: ['#FF6B9D', '#C44DFF', '#00D4FF', '#FFE66D', '#4ECDC4', '#FF6B6B'] },
      { name: 'Adulto', colors: ['#2C3E50', '#3498DB', '#E74C3C', '#27AE60', '#8E44AD', '#F39C12'] },
      { name: 'Senior', colors: ['#8B7355', '#A0522D', '#DEB887', '#D2B48C', '#BC8F8F', '#C0C0C0'] },
      { name: 'Familiar', colors: ['#3498DB', '#E74C3C', '#F1C40F', '#2ECC71', '#9B59B6', '#1ABC9C'] },
      { name: 'Profesional', colors: ['#1A365D', '#2D3748', '#4A5568', '#718096', '#A0AEC0', '#E2E8F0'] },
      { name: 'Creativo', colors: ['#FF6B6B', '#C44DFF', '#00D4FF', '#FFE66D', '#4ECDC4', '#FF8B94'] },
      { name: 'Deportivo', colors: ['#FF5722', '#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#00BCD4'] },
      { name: 'Femenino', colors: ['#FF69B4', '#FFB6C1', '#DDA0DD', '#E6E6FA', '#FFC0CB', '#FF1493'] },
      { name: 'Masculino', colors: ['#2C3E50', '#34495E', '#1A252F', '#4A5568', '#718096', '#3498DB'] },
      { name: 'Unisex', colors: ['#9B59B6', '#3498DB', '#1ABC9C', '#F39C12', '#E74C3C', '#2ECC71'] },
      { name: 'Premium', colors: ['#D4AF37', '#1A1A1A', '#2C2C2C', '#C9A227', '#B8860B', '#FFD700'] },
    ]
  }
];

const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
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

const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

// Concepto seleccionado para modo comparativa (con porcentaje)
interface ComparativeSelection {
  axisId: string;
  term: string;
  percentage: number; // 50 o 100
  color: string;
  isLeft: boolean;
}

export const ArchetypesCreator: React.FC<ArchetypesCreatorProps> = ({
  onCreatePalette,
  onBack,
  colorCount,
  onColorCountChange,
}) => {
  // Estados SEPARADOS para Tinder y Comparativa
  const [tinderSelectedConcepts, setTinderSelectedConcepts] = useState<SelectedConcept[]>([]);
  const [comparativeSelections, setComparativeSelections] = useState<ComparativeSelection[]>([]);
  
  // Alias para mantener compatibilidad con código existente (Tinder)
  const selectedConcepts = tinderSelectedConcepts;
  const setSelectedConcepts = setTinderSelectedConcepts;
  const [discardedCategories, setDiscardedCategories] = useState<Set<string>>(new Set());
  const [discardedConcepts, setDiscardedConcepts] = useState<Set<string>>(new Set());
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customColor, setCustomColor] = useState('#6366F1');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [editingConcept, setEditingConcept] = useState<string | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [saturationAdjust, setSaturationAdjust] = useState(0);
  const [lightnessAdjust, setLightnessAdjust] = useState(0);
  
  // Estado para modo comparativa
  const [mode, setMode] = useState<'tinder' | 'comparative'>('tinder');
  const [activeAxes, setActiveAxes] = useState<ActiveAxis[]>([]);
  const [discardedAxes, setDiscardedAxes] = useState<Set<string>>(new Set());
  const [currentAxisIndex, setCurrentAxisIndex] = useState(0);
  
  // Estado para crear eje personalizado
  const [showCustomAxisModal, setShowCustomAxisModal] = useState(false);
  const [customAxisLeft, setCustomAxisLeft] = useState<{ term: string; color: string; isNew: boolean }>({ term: '', color: '#6366F1', isNew: true });
  const [customAxisRight, setCustomAxisRight] = useState<{ term: string; color: string; isNew: boolean }>({ term: '', color: '#F59E0B', isNew: true });
  const [customAxes, setCustomAxes] = useState<AxisPair[]>([]);
  
  // Ejes disponibles (no descartados y no activos) - incluye ejes personalizados
  const allAxisPairs = useMemo(() => [...AXIS_PAIRS, ...customAxes], [customAxes]);
  const availableAxes = allAxisPairs.filter(
    axis => !discardedAxes.has(axis.id) && !activeAxes.some(a => a.id === axis.id)
  );
  
  // Función para crear eje personalizado
  const handleCreateCustomAxis = () => {
    if (!customAxisLeft.term || !customAxisRight.term) return;
    
    const newAxis: AxisPair = {
      id: `custom-${Date.now()}`,
      left: { 
        term: customAxisLeft.term, 
        colors: [customAxisLeft.color, adjustColor(customAxisLeft.color, 20), adjustColor(customAxisLeft.color, -20), adjustColor(customAxisLeft.color, 40)] 
      },
      right: { 
        term: customAxisRight.term, 
        colors: [customAxisRight.color, adjustColor(customAxisRight.color, 20), adjustColor(customAxisRight.color, -20), adjustColor(customAxisRight.color, 40)] 
      }
    };
    
    setCustomAxes([...customAxes, newAxis]);
    setActiveAxes([...activeAxes, { id: newAxis.id, value: 0 }]);
    setShowCustomAxisModal(false);
    setCustomAxisLeft({ term: '', color: '#6366F1', isNew: true });
    setCustomAxisRight({ term: '', color: '#F59E0B', isNew: true });
  };
  
  // Ajustar color (más claro o más oscuro)
  const adjustColor = (hex: string, amount: number): string => {
    const hsl = hexToHSL(hex);
    return hslToHex(hsl.h, hsl.s, Math.max(10, Math.min(90, hsl.l + amount)));
  };
  
  // Obtener todos los conceptos para el selector
  const allConcepts = CATEGORIES.flatMap(cat => 
    cat.concepts.map(c => ({ 
      category: cat.name, 
      categoryId: cat.id,
      name: c.name, 
      colors: c.colors 
    }))
  );
  
  // Añadir un eje
  const addAxis = () => {
    if (availableAxes.length > 0) {
      const nextAxis = availableAxes[currentAxisIndex % availableAxes.length];
      setActiveAxes([...activeAxes, { id: nextAxis.id, value: 0 }]);
      setCurrentAxisIndex(currentAxisIndex + 1);
    }
  };
  
  // Actualizar valor de un eje y actualizar selecciones comparativas
  const updateAxisValue = (axisId: string, value: number) => {
    setActiveAxes(activeAxes.map(a => a.id === axisId ? { ...a, value } : a));
    
    // Actualizar selecciones comparativas
    const axisPair = allAxisPairs.find(a => a.id === axisId);
    if (axisPair) {
      setComparativeSelections(prev => {
        // Eliminar selección anterior de este eje
        const filtered = prev.filter(s => s.axisId !== axisId);
        
        if (value === 0) return filtered; // Neutro, no añadir
        
        const isLeft = value < 0;
        const percentage = Math.abs(value) === 2 ? 100 : 50;
        const term = isLeft ? axisPair.left.term : axisPair.right.term;
        const colors = isLeft ? axisPair.left.colors : axisPair.right.colors;
        
        return [...filtered, {
          axisId,
          term,
          percentage,
          color: colors[0],
          isLeft
        }];
      });
    }
  };
  
  // Eliminar un eje (lo descarta)
  const removeAxis = (axisId: string) => {
    setActiveAxes(activeAxes.filter(a => a.id !== axisId));
    setDiscardedAxes(new Set([...discardedAxes, axisId]));
  };
  
  // Resetear ejes descartados
  const resetDiscardedAxes = () => {
    setDiscardedAxes(new Set());
  };
  
  // Generar paleta basada en ejes
  const generatePaletteFromAxes = useMemo(() => {
    if (activeAxes.length === 0) return [];
    
    const colors: string[] = [];
    
    activeAxes.forEach(axis => {
      const axisPair = allAxisPairs.find(a => a.id === axis.id);
      if (!axisPair) return;
      
      // -2 = 100% izquierda, 0 = mezcla, +2 = 100% derecha
      const leftWeight = (2 - axis.value) / 4; // 1 a 0
      const rightWeight = (2 + axis.value) / 4; // 0 a 1
      
      // Seleccionar colores según peso
      if (leftWeight > 0.5) {
        colors.push(axisPair.left.colors[Math.floor(Math.random() * axisPair.left.colors.length)]);
      } else if (rightWeight > 0.5) {
        colors.push(axisPair.right.colors[Math.floor(Math.random() * axisPair.right.colors.length)]);
      } else {
        // Mezclar
        const leftColor = axisPair.left.colors[0];
        const rightColor = axisPair.right.colors[0];
        const leftHSL = hexToHSL(leftColor);
        const rightHSL = hexToHSL(rightColor);
        const mixedH = (leftHSL.h * leftWeight + rightHSL.h * rightWeight);
        const mixedS = (leftHSL.s * leftWeight + rightHSL.s * rightWeight);
        const mixedL = (leftHSL.l * leftWeight + rightHSL.l * rightWeight);
        colors.push(hslToHex(mixedH, mixedS, mixedL));
      }
    });
    
    // Ajustar al número de colores deseado
    const finalColors: string[] = [];
    for (let i = 0; i < colorCount; i++) {
      if (i < colors.length) {
        const hsl = hexToHSL(colors[i]);
        finalColors.push(hslToHex(
          hsl.h,
          Math.max(0, Math.min(100, hsl.s + saturationAdjust)),
          Math.max(5, Math.min(95, hsl.l + lightnessAdjust))
        ));
      } else {
        // Generar variación
        const baseColor = colors[i % colors.length];
        const hsl = hexToHSL(baseColor);
        finalColors.push(hslToHex(
          (hsl.h + (30 * (i + 1))) % 360,
          Math.max(0, Math.min(100, hsl.s + saturationAdjust)),
          Math.max(5, Math.min(95, hsl.l + lightnessAdjust + (i * 5 - 10)))
        ));
      }
    }
    
    return finalColors;
  }, [activeAxes, colorCount, saturationAdjust, lightnessAdjust, allAxisPairs]);

  const availableCategories = CATEGORIES.filter(cat => !discardedCategories.has(cat.id));

  const currentCategory = availableCategories[currentCardIndex % availableCategories.length];

  const handleSelectConcept = (category: string, concept: string, color: string) => {
    const key = `${category}-${concept}`;
    const existing = selectedConcepts.find(c => c.category === category && c.concept === concept);
    
    if (existing) {
      setSelectedConcepts(selectedConcepts.filter(c => !(c.category === category && c.concept === concept)));
    } else {
      setSelectedConcepts([...selectedConcepts, { category, concept, color }]);
    }
    setDiscardedConcepts(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handleDiscardConcept = (category: string, concept: string) => {
    const key = `${category}-${concept}`;
    setDiscardedConcepts(prev => new Set([...prev, key]));
    setSelectedConcepts(selectedConcepts.filter(c => !(c.category === category && c.concept === concept)));
  };

  const handleUpdateConceptColor = (category: string, concept: string, newColor: string) => {
    setSelectedConcepts(selectedConcepts.map(c => 
      c.category === category && c.concept === concept 
        ? { ...c, color: newColor }
        : c
    ));
    setEditingConcept(null);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    if (direction === 'left' && currentCategory) {
      setDiscardedCategories(prev => new Set([...prev, currentCategory.id]));
    }
    
    setTimeout(() => {
      setSwipeDirection(null);
      if (availableCategories.length > 1) {
        setCurrentCardIndex((currentCardIndex + 1) % (availableCategories.length - (direction === 'left' ? 1 : 0)));
      }
    }, 300);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      handleSwipe('right');
    } else if (info.offset.x < -100) {
      handleSwipe('left');
    }
  };

  const handleAddCustom = () => {
    if (customName.trim()) {
      setSelectedConcepts([...selectedConcepts, {
        category: 'custom',
        concept: customName.trim(),
        color: customColor,
        isCustom: true
      }]);
      setCustomName('');
      setCustomColor('#6366F1');
      setShowCustomForm(false);
    }
  };

  const handleReorderConcepts = (fromIndex: number, toIndex: number) => {
    const newConcepts = [...selectedConcepts];
    const [moved] = newConcepts.splice(fromIndex, 1);
    newConcepts.splice(toIndex, 0, moved);
    setSelectedConcepts(newConcepts);
  };

  const generatedPalettes = useMemo(() => {
    if (selectedConcepts.length === 0) return [];
    
    const allColors = selectedConcepts.map(c => c.color);
    
    const applyAdjustments = (color: string): string => {
      if (saturationAdjust === 0 && lightnessAdjust === 0) return color;
      const hsl = hexToHSL(color);
      return hslToHex(
        hsl.h,
        Math.max(0, Math.min(100, hsl.s + saturationAdjust)),
        Math.max(5, Math.min(95, hsl.l + lightnessAdjust))
      );
    };
    
    const generateVariation = (seed: number): string[] => {
      const colors: string[] = [];
      const shuffled = [...allColors].sort(() => Math.random() - 0.5 + seed * 0.1);
      
      for (let i = 0; i < colorCount; i++) {
        if (i < shuffled.length) {
          colors.push(applyAdjustments(shuffled[i]));
        } else {
          const baseColor = shuffled[i % shuffled.length];
          const hsl = hexToHSL(baseColor);
          const variation = hslToHex(
            (hsl.h + (30 * (i - shuffled.length + 1))) % 360,
            Math.max(20, Math.min(100, hsl.s + saturationAdjust + (seed * 10 - 15))),
            Math.max(20, Math.min(80, hsl.l + lightnessAdjust + (seed * 5 - 10)))
          );
          colors.push(variation);
        }
      }
      
      return colors.slice(0, colorCount);
    };

    return [
      generateVariation(0),
      generateVariation(1),
      generateVariation(2)
    ];
  }, [selectedConcepts, colorCount, saturationAdjust, lightnessAdjust]);

  const restoreCategory = (categoryId: string) => {
    setDiscardedCategories(prev => {
      const next = new Set(prev);
      next.delete(categoryId);
      return next;
    });
    const idx = CATEGORIES.findIndex(c => c.id === categoryId);
    if (idx >= 0) {
      setCurrentCardIndex(availableCategories.length);
    }
  };

  return (
    <div className="h-full flex">
      {/* Columna izquierda - Tarjetas estilo Tinder o Comparativa */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Header con selector de modo */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              🎭 Explora Arquetipos
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {mode === 'tinder' 
                ? 'Desliza o selecciona conceptos que representen tu paleta'
                : 'Define el espectro de tu paleta con ejes opuestos'
              }
            </p>
          </div>
          
          {/* Selector de modo */}
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setMode('tinder')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  mode === 'tinder'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🎴 Tinder
              </button>
              <button
                onClick={() => setMode('comparative')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  mode === 'comparative'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ⚖️ Comparativa
              </button>
            </div>
            
            {mode === 'tinder' && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Ver todas
              </button>
            )}
          </div>
        </div>

        {/* Modal de todas las categorías */}
        <AnimatePresence>
          {showAllCategories && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAllCategories(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Todas las categorías</h3>
                  <button
                    onClick={() => setShowAllCategories(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-all"
                  >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {CATEGORIES.map(category => {
                    const isDiscarded = discardedCategories.has(category.id);
                    return (
                      <div key={category.id} className={`p-4 rounded-xl border ${isDiscarded ? 'bg-gray-800/30 border-gray-700/30' : 'bg-gray-800/50 border-gray-700/50'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{category.icon}</span>
                            <span className={`font-semibold ${isDiscarded ? 'text-gray-500 line-through' : 'text-white'}`}>
                              {category.name}
                            </span>
                            {isDiscarded && (
                              <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">Descartada</span>
                            )}
                          </div>
                          {isDiscarded && (
                            <button
                              onClick={() => restoreCategory(category.id)}
                              className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                            >
                              Restaurar
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {category.concepts.map(concept => {
                            const key = `${category.id}-${concept.name}`;
                            const isSelected = selectedConcepts.some(c => c.category === category.id && c.concept === concept.name);
                            const isConceptDiscarded = discardedConcepts.has(key);
                            
                            return (
                              <button
                                key={concept.name}
                                onClick={() => !isConceptDiscarded && handleSelectConcept(category.id, concept.name, concept.colors[0])}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
                                  isConceptDiscarded 
                                    ? 'bg-gray-700/30 text-gray-600 line-through cursor-not-allowed'
                                    : isSelected 
                                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                                }`}
                              >
                                <span 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: concept.colors[0] }}
                                />
                                {concept.name}
                                {isSelected && <span>✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Área de tarjetas - Modo Tinder */}
        {mode === 'tinder' && (
        <>
        <div className="flex-1 relative flex items-center justify-center">
          {availableCategories.length === 0 ? (
            <div className="text-center text-gray-400">
              <p className="text-lg mb-4">Has revisado todas las categorías</p>
              <button
                onClick={() => {
                  setDiscardedCategories(new Set());
                  setCurrentCardIndex(0);
                }}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white transition-all"
              >
                Reiniciar categorías
              </button>
            </div>
          ) : currentCategory && (
            <div className="relative w-full max-w-lg h-[500px]">
              {/* Tarjetas de fondo */}
              {availableCategories.slice(currentCardIndex + 1, currentCardIndex + 3).map((cat, idx) => (
                <div
                  key={cat.id}
                  className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50"
                  style={{
                    transform: `scale(${1 - (idx + 1) * 0.05}) translateY(${(idx + 1) * 10}px)`,
                    zIndex: -idx - 1,
                    opacity: 1 - (idx + 1) * 0.3
                  }}
                />
              ))}
              
              {/* Tarjeta principal */}
              <motion.div
                key={currentCategory.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                animate={{
                  x: swipeDirection === 'left' ? -500 : swipeDirection === 'right' ? 500 : 0,
                  rotate: swipeDirection === 'left' ? -20 : swipeDirection === 'right' ? 20 : 0,
                  opacity: swipeDirection ? 0 : 1
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl cursor-grab active:cursor-grabbing overflow-hidden"
              >
                {/* Indicadores de swipe */}
                <div className="absolute inset-x-0 top-4 flex justify-between px-4 pointer-events-none">
                  <div className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 font-semibold opacity-0 transition-opacity" style={{ opacity: swipeDirection === 'left' ? 1 : 0 }}>
                    DESCARTAR
                  </div>
                  <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 font-semibold opacity-0 transition-opacity" style={{ opacity: swipeDirection === 'right' ? 1 : 0 }}>
                    SIGUIENTE
                  </div>
                </div>

                {/* Header de la tarjeta */}
                <div className="p-5 border-b border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{currentCategory.icon}</span>
                      <div>
                        <h4 className="text-xl font-bold text-white">{currentCategory.name}</h4>
                        <p className="text-sm text-gray-400">
                          {currentCategory.concepts.filter(c => !discardedConcepts.has(`${currentCategory.id}-${c.name}`)).length} conceptos disponibles
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {currentCardIndex + 1} / {availableCategories.length}
                    </div>
                  </div>
                </div>

                {/* Conceptos */}
                <div className="p-4 space-y-2 overflow-y-auto max-h-[340px]">
                  {currentCategory.concepts.map(concept => {
                    const key = `${currentCategory.id}-${concept.name}`;
                    const isSelected = selectedConcepts.some(c => c.category === currentCategory.id && c.concept === concept.name);
                    const isDiscarded = discardedConcepts.has(key);
                    
                    if (isDiscarded) return null;
                    
                    return (
                      <div
                        key={concept.name}
                        className={`p-3 rounded-xl border transition-all ${
                          isSelected 
                            ? 'bg-purple-500/20 border-purple-500/50'
                            : 'bg-gray-800/50 border-gray-700/30 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`font-medium ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                              {concept.name}
                            </span>
                            {isSelected && (
                              <span className="text-purple-400 text-sm">✓ Seleccionado</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Opciones de color */}
                            <div className="flex gap-1">
                              {concept.colors.slice(0, 6).map((color, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSelectConcept(currentCategory.id, concept.name, color)}
                                  className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                                    isSelected && selectedConcepts.find(c => c.concept === concept.name)?.color === color
                                      ? 'border-white scale-110'
                                      : 'border-transparent hover:border-gray-400'
                                  }`}
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                              <label className="w-6 h-6 rounded-full border-2 border-dashed border-gray-600 hover:border-gray-400 cursor-pointer flex items-center justify-center transition-all hover:scale-110">
                                <span className="text-gray-500 text-xs">+</span>
                                <input
                                  type="color"
                                  className="sr-only"
                                  onChange={(e) => handleSelectConcept(currentCategory.id, concept.name, e.target.value)}
                                />
                              </label>
                            </div>
                            {/* Botón tachar */}
                            <button
                              onClick={() => handleDiscardConcept(currentCategory.id, concept.name)}
                              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Descartar concepto"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Botones de acción con indicadores de swipe */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
                  {/* Indicador animado de swipe */}
                  <div className="flex justify-center mb-3">
                    <motion.div
                      animate={{ x: [-10, 10, -10] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="flex items-center gap-2 text-gray-500 text-xs"
                    >
                      <span>← Descartar</span>
                      <span className="text-gray-600">|</span>
                      <span>Desliza</span>
                      <span className="text-gray-600">|</span>
                      <span>Siguiente →</span>
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleSwipe('left')}
                      className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-all flex items-center justify-center"
                      title="Descartar categoría"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleSwipe('right')}
                      className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 transition-all flex items-center justify-center"
                      title="Siguiente categoría"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Indicador de categorías descartadas */}
        {discardedCategories.size > 0 && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {discardedCategories.size} categoría(s) descartada(s)
              </span>
              <button
                onClick={() => {
                  setDiscardedCategories(new Set());
                  setCurrentCardIndex(0);
                }}
                className="text-sm text-purple-400 hover:text-purple-300 transition-all"
              >
                Restaurar todas
              </button>
            </div>
          </div>
        )}
        </>
        )}

        {/* Área de ejes - Modo Comparativa */}
        {mode === 'comparative' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Explicación */}
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl border border-purple-500/30">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚖️</span>
                <div>
                  <h4 className="font-semibold text-white mb-1">Define tu espectro de color</h4>
                  <p className="text-sm text-gray-400">
                    Posiciona cada eje según tus preferencias. Los extremos opuestos generan paletas con personalidades distintas.
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de ejes activos */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {activeAxes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚖️</div>
                  <p className="text-gray-400 mb-4">Añade tu primer eje para empezar</p>
                  <button
                    onClick={addAxis}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-medium transition-all"
                  >
                    + Añadir eje
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {activeAxes.map((axis, index) => {
                    const axisPair = allAxisPairs.find(a => a.id === axis.id);
                    if (!axisPair) return null;
                    
                    return (
                      <motion.div
                        key={axis.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
                      >
                        {/* Header del eje */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-500">Eje {index + 1}</span>
                          <button
                            onClick={() => removeAxis(axis.id)}
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Eliminar eje (no volverá a aparecer)"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Términos opuestos */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1">
                              {axisPair.left.colors.slice(0, 3).map((c, i) => (
                                <div 
                                  key={i}
                                  className="w-4 h-4 rounded-full border border-gray-900"
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </div>
                            <span className={`font-medium ${axis.value < 0 ? 'text-white' : 'text-gray-400'}`}>
                              {axisPair.left.term}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${axis.value > 0 ? 'text-white' : 'text-gray-400'}`}>
                              {axisPair.right.term}
                            </span>
                            <div className="flex -space-x-1">
                              {axisPair.right.colors.slice(0, 3).map((c, i) => (
                                <div 
                                  key={i}
                                  className="w-4 h-4 rounded-full border border-gray-900"
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Escala de 5 esferas */}
                        <div className="flex items-center justify-center gap-3">
                          {[-2, -1, 0, 1, 2].map((val) => {
                            const isSelected = axis.value === val;
                            const leftColor = axisPair.left.colors[0];
                            const rightColor = axisPair.right.colors[0];
                            
                            // Interpolar color según posición
                            let sphereColor = '#6B7280'; // neutral
                            if (val < 0) {
                              sphereColor = leftColor;
                            } else if (val > 0) {
                              sphereColor = rightColor;
                            }
                            
                            return (
                              <button
                                key={val}
                                onClick={() => updateAxisValue(axis.id, val)}
                                className={`relative transition-all duration-200 ${
                                  isSelected ? 'scale-125' : 'hover:scale-110'
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                                    isSelected 
                                      ? 'border-white shadow-lg' 
                                      : 'border-gray-600 hover:border-gray-400'
                                  }`}
                                  style={{ 
                                    backgroundColor: isSelected ? sphereColor : 'transparent',
                                    opacity: isSelected ? 1 : 0.5
                                  }}
                                />
                                {isSelected && (
                                  <motion.div
                                    layoutId={`indicator-${axis.id}`}
                                    className="absolute inset-0 rounded-full border-2 border-white"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Etiquetas de posición */}
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>100%</span>
                          <span>50%</span>
                          <span>Neutro</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Botón añadir más ejes - SIEMPRE VISIBLE DEBAJO DEL ÚLTIMO EJE */}
            {activeAxes.length > 0 && (
              <motion.div
                layout
                className="mt-2 space-y-2"
              >
                {availableAxes.length > 0 && (
                  <button
                    onClick={addAxis}
                    className="w-full p-4 border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-xl text-gray-400 hover:text-purple-400 transition-all flex items-center justify-center gap-2 bg-gray-800/30 hover:bg-gray-800/50"
                  >
                    <span className="text-2xl">+</span>
                    <span className="font-medium">Añadir otro eje</span>
                    <span className="text-sm text-gray-500">({availableAxes.length} disponibles)</span>
                  </button>
                )}
                <button
                  onClick={() => setShowCustomAxisModal(true)}
                  className="w-full p-3 border border-purple-500/50 hover:border-purple-500 rounded-xl text-purple-400 hover:text-purple-300 transition-all flex items-center justify-center gap-2 bg-purple-500/10 hover:bg-purple-500/20"
                >
                  <span>✦</span>
                  <span className="font-medium">Crear eje personalizado</span>
                </button>
              </motion.div>
            )}

            {/* Indicador de ejes descartados */}
            {discardedAxes.size > 0 && (
              <div className="mt-4 p-3 bg-gray-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {discardedAxes.size} eje(s) descartado(s)
                  </span>
                  <button
                    onClick={resetDiscardedAxes}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-all"
                  >
                    Restaurar todos
                  </button>
                </div>
              </div>
            )}

            {/* Modal para crear eje personalizado */}
            <AnimatePresence>
              {showCustomAxisModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setShowCustomAxisModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        ✦ Crear eje personalizado
                      </h3>
                      <button
                        onClick={() => setShowCustomAxisModal(false)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-all"
                      >
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-6">
                      Define dos conceptos opuestos para crear un nuevo eje de comparación.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Extremo Izquierda */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-white flex items-center gap-2">
                          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                          Extremo Izquierda
                        </h4>
                        
                        {/* Selector de concepto existente */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Seleccionar concepto existente</label>
                          <select
                            value={customAxisLeft.isNew ? '' : customAxisLeft.term}
                            onChange={(e) => {
                              if (e.target.value) {
                                const concept = allConcepts.find(c => c.name === e.target.value);
                                if (concept) {
                                  setCustomAxisLeft({ term: concept.name, color: concept.colors[0], isNew: false });
                                }
                              }
                            }}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
                          >
                            <option value="">-- Seleccionar --</option>
                            {CATEGORIES.map(cat => (
                              <optgroup key={cat.id} label={`${cat.icon} ${cat.name}`}>
                                {cat.concepts.map(c => (
                                  <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                        
                        <div className="text-center text-gray-500 text-sm">— o —</div>
                        
                        {/* Crear nuevo */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Crear concepto nuevo</label>
                          <input
                            type="text"
                            value={customAxisLeft.isNew ? customAxisLeft.term : ''}
                            onChange={(e) => setCustomAxisLeft({ term: e.target.value, color: customAxisLeft.color, isNew: true })}
                            placeholder="Ej: Tranquilo"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                        
                        {/* Color */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Color asociado</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={customAxisLeft.color}
                              onChange={(e) => setCustomAxisLeft({ ...customAxisLeft, color: e.target.value })}
                              className="w-12 h-10 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={customAxisLeft.color}
                              onChange={(e) => setCustomAxisLeft({ ...customAxisLeft, color: e.target.value })}
                              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-mono"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Extremo Derecha */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-white flex items-center gap-2">
                          <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                          Extremo Derecha
                        </h4>
                        
                        {/* Selector de concepto existente */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Seleccionar concepto existente</label>
                          <select
                            value={customAxisRight.isNew ? '' : customAxisRight.term}
                            onChange={(e) => {
                              if (e.target.value) {
                                const concept = allConcepts.find(c => c.name === e.target.value);
                                if (concept) {
                                  setCustomAxisRight({ term: concept.name, color: concept.colors[0], isNew: false });
                                }
                              }
                            }}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
                          >
                            <option value="">-- Seleccionar --</option>
                            {CATEGORIES.map(cat => (
                              <optgroup key={cat.id} label={`${cat.icon} ${cat.name}`}>
                                {cat.concepts.map(c => (
                                  <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                        
                        <div className="text-center text-gray-500 text-sm">— o —</div>
                        
                        {/* Crear nuevo */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Crear concepto nuevo</label>
                          <input
                            type="text"
                            value={customAxisRight.isNew ? customAxisRight.term : ''}
                            onChange={(e) => setCustomAxisRight({ term: e.target.value, color: customAxisRight.color, isNew: true })}
                            placeholder="Ej: Enérgico"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                        
                        {/* Color */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Color asociado</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={customAxisRight.color}
                              onChange={(e) => setCustomAxisRight({ ...customAxisRight, color: e.target.value })}
                              className="w-12 h-10 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={customAxisRight.color}
                              onChange={(e) => setCustomAxisRight({ ...customAxisRight, color: e.target.value })}
                              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preview del eje */}
                    {customAxisLeft.term && customAxisRight.term && (
                      <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-3">Vista previa del eje:</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: customAxisLeft.color }}></div>
                            <span className="font-medium text-white">{customAxisLeft.term}</span>
                          </div>
                          <div className="flex-1 mx-4 h-2 bg-gray-700 rounded-full relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-4 h-4 bg-gray-600 rounded-full border-2 border-gray-500"></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{customAxisRight.term}</span>
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: customAxisRight.color }}></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botones */}
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => setShowCustomAxisModal(false)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleCreateCustomAxis}
                        disabled={!customAxisLeft.term || !customAxisRight.term}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg text-white font-medium transition-all"
                      >
                        Crear eje
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vista previa de paleta generada */}
            {generatePaletteFromAxes.length > 0 && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">Paleta resultante</span>
                  <button
                    onClick={() => onCreatePalette(generatePaletteFromAxes)}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-all"
                  >
                    Usar esta →
                  </button>
                </div>
                <div className="flex gap-1 h-12 rounded-lg overflow-hidden">
                  {generatePaletteFromAxes.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 flex items-end justify-center pb-1"
                      style={{ backgroundColor: color }}
                    >
                      <span className="text-[10px] font-mono text-white/70 drop-shadow">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Columna derecha - Panel fijo */}
      <div className="w-96 border-l border-gray-700/50 bg-gray-900/50 flex flex-col">
        {/* Crear arquetipo personalizado */}
        <div className="p-4 border-b border-gray-700/50">
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="w-full p-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 hover:from-purple-900/60 hover:to-indigo-900/60 border border-purple-500/30 rounded-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✦</span>
                <div className="text-left">
                  <div className="font-semibold text-white">Crear arquetipo</div>
                  <div className="text-sm text-gray-400">Añade tu propio concepto</div>
                </div>
              </div>
              <motion.span
                animate={{ rotate: showCustomForm ? 180 : 0 }}
                className="text-purple-400"
              >
                ▼
              </motion.span>
            </div>
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
                    placeholder="Nombre del concepto..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center gap-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="flex-1 bg-transparent text-white font-mono text-sm focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleAddCustom}
                      disabled={!customName.trim()}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl text-white font-medium transition-all"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tu paleta (conceptos seleccionados o ejes comparativos) */}
        <div className="flex-1 flex flex-col min-h-0 p-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white flex items-center gap-2">
              🎨 Tu paleta
              <span className="text-sm font-normal text-gray-400">
                ({mode === 'tinder' ? selectedConcepts.length : comparativeSelections.length} {mode === 'tinder' ? 'conceptos' : 'atributos'})
              </span>
            </h4>
            <div className="flex items-center gap-2">
              {(mode === 'tinder' ? selectedConcepts.length > 0 : comparativeSelections.length > 0) && (
                <ExportCreatorResults
                  type={mode === 'tinder' ? 'archetypes-tinder' : 'archetypes-comparative'}
                  paletteName="Arquetipos"
                  selectedItems={mode === 'tinder' 
                    ? selectedConcepts.map(c => ({
                        category: CATEGORIES.find(cat => cat.id === c.category)?.name || c.category,
                        concept: c.concept,
                        color: c.color,
                        isCustom: c.isCustom
                      }))
                    : comparativeSelections.map(s => ({
                        category: s.percentage === 100 ? '100%' : '50%',
                        concept: s.term,
                        color: s.color,
                        isCustom: false
                      }))
                  }
                  axes={activeAxes.map(axis => {
                    const pair = allAxisPairs.find(a => a.id === axis.id);
                    return {
                      id: axis.id,
                      value: axis.value,
                      leftTerm: pair?.left.term || '',
                      rightTerm: pair?.right.term || '',
                      leftColors: pair?.left.colors || [],
                      rightColors: pair?.right.colors || []
                    };
                  })}
                  suggestedPalettes={mode === 'tinder' ? generatedPalettes : [generatePaletteFromAxes]}
                  colorCount={colorCount}
                />
              )}
              {(mode === 'tinder' ? selectedConcepts.length > 0 : comparativeSelections.length > 0) && (
                <button
                  onClick={() => mode === 'tinder' ? setSelectedConcepts([]) : setComparativeSelections([])}
                  className="text-xs text-gray-500 hover:text-red-400 transition-all"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
          
          {/* Consejo */}
          <div className="mb-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-xs text-amber-300/80">
              💡 {mode === 'tinder' 
                ? 'Elige los 3 conceptos más representativos para mejores resultados'
                : 'Ajusta los ejes para definir los atributos de tu paleta'}
            </p>
          </div>

          {/* Lista de conceptos/atributos con scroll */}
          <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
            {/* MODO COMPARATIVA */}
            {mode === 'comparative' && (
              comparativeSelections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">⚖️</div>
                  <p className="text-sm">Ajusta los ejes para generar atributos</p>
                </div>
              ) : (
                comparativeSelections.map((selection, index) => {
                  const axisPair = allAxisPairs.find(a => a.id === selection.axisId);
                  const colors = selection.isLeft ? axisPair?.left.colors : axisPair?.right.colors;
                  
                  // Función para reordenar atributos comparativos
                  const handleReorderComparative = (fromIdx: number, toIdx: number) => {
                    const newSelections = [...comparativeSelections];
                    const [moved] = newSelections.splice(fromIdx, 1);
                    newSelections.splice(toIdx, 0, moved);
                    setComparativeSelections(newSelections);
                    
                    // También reordenar los ejes activos
                    const newAxes = [...activeAxes];
                    const axisFrom = newAxes.findIndex(a => a.id === moved.axisId);
                    if (axisFrom >= 0) {
                      const [movedAxis] = newAxes.splice(axisFrom, 1);
                      newAxes.splice(toIdx, 0, movedAxis);
                      setActiveAxes(newAxes);
                    }
                  };
                  
                  return (
                    <motion.div
                      key={selection.axisId}
                      layout
                      className="group p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {/* Botones reordenar */}
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => index > 0 && handleReorderComparative(index, index - 1)}
                            disabled={index === 0}
                            className="p-0.5 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => index < comparativeSelections.length - 1 && handleReorderComparative(index, index + 1)}
                            disabled={index === comparativeSelections.length - 1}
                            className="p-0.5 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            ▼
                          </button>
                        </div>
                        
                        {/* Color (clickable para editar) */}
                        <div className="relative">
                          <button
                            onClick={() => setEditingConcept(editingConcept === selection.axisId ? null : selection.axisId)}
                            className="w-8 h-8 rounded-lg border-2 border-white/20 hover:border-white/50 transition-all"
                            style={{ backgroundColor: selection.color }}
                          />
                          
                          {/* Dropdown de edición de color - MEJORADO */}
                          <AnimatePresence>
                            {editingConcept === selection.axisId && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute left-0 top-full mt-2 p-3 bg-gray-800 rounded-xl border border-gray-700 shadow-xl z-50 w-56"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-400 font-medium">Opciones de color</p>
                                    <button
                                      onClick={() => setEditingConcept(null)}
                                      className="text-gray-500 hover:text-white text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-6 gap-1">
                                    {colors?.map((color, idx) => (
                                      <button
                                        key={idx}
                                        onClick={() => {
                                          setComparativeSelections(prev => prev.map(s => 
                                            s.axisId === selection.axisId ? { ...s, color } : s
                                          ));
                                        }}
                                        className={`w-7 h-7 rounded-md border-2 transition-all ${
                                          selection.color === color ? 'border-white scale-110' : 'border-transparent hover:border-gray-400'
                                        }`}
                                        style={{ backgroundColor: color }}
                                      />
                                    ))}
                                  </div>
                                  <div className="flex gap-2 pt-2 border-t border-gray-700">
                                    <input
                                      type="color"
                                      value={selection.color}
                                      onChange={(e) => {
                                        setComparativeSelections(prev => prev.map(s => 
                                          s.axisId === selection.axisId ? { ...s, color: e.target.value } : s
                                        ));
                                      }}
                                      className="w-10 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                      type="text"
                                      value={selection.color}
                                      onChange={(e) => {
                                        if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                                          setComparativeSelections(prev => prev.map(s => 
                                            s.axisId === selection.axisId ? { ...s, color: e.target.value } : s
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
                          </AnimatePresence>
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate flex items-center gap-2">
                            {selection.term}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              selection.percentage === 100 
                                ? 'bg-purple-500/30 text-purple-300' 
                                : 'bg-gray-600/30 text-gray-400'
                            }`}>
                              {selection.percentage}%
                            </span>
                          </div>
                        </div>
                        
                        {/* Eliminar */}
                        <button
                          onClick={() => {
                            // Resetear el eje a neutro
                            setActiveAxes(prev => prev.map(a => 
                              a.id === selection.axisId ? { ...a, value: 0 } : a
                            ));
                            setComparativeSelections(prev => prev.filter(s => s.axisId !== selection.axisId));
                          }}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )
            )}
            
            {/* MODO TINDER */}
            {mode === 'tinder' && selectedConcepts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎭</div>
                <p className="text-sm">Selecciona conceptos de las tarjetas</p>
              </div>
            )}
            {mode === 'tinder' && selectedConcepts.length > 0 && (
              selectedConcepts.map((concept, index) => (
                <motion.div
                  key={`${concept.category}-${concept.concept}`}
                  layout
                  className="group p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {/* Drag handle y posición */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => index > 0 && handleReorderConcepts(index, index - 1)}
                        disabled={index === 0}
                        className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => index < selectedConcepts.length - 1 && handleReorderConcepts(index, index + 1)}
                        disabled={index === selectedConcepts.length - 1}
                        className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ▼
                      </button>
                    </div>
                    
                    {/* Color (clickable para editar) */}
                    <div className="relative">
                      <button
                        onClick={() => setEditingConcept(editingConcept === `${concept.category}-${concept.concept}` ? null : `${concept.category}-${concept.concept}`)}
                        className="w-8 h-8 rounded-lg border-2 border-white/20 hover:border-white/50 transition-all"
                        style={{ backgroundColor: concept.color }}
                      />
                      
                      {/* Dropdown de edición de color - MEJORADO */}
                          <AnimatePresence>
                            {editingConcept === `${concept.category}-${concept.concept}` && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute left-10 top-0 p-3 bg-gray-800 rounded-xl border border-gray-700 shadow-xl z-50 w-56"
                                style={{ 
                                  transform: 'translateX(10px)',
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-400 font-medium">Opciones de color</p>
                                    <button
                                      onClick={() => setEditingConcept(null)}
                                      className="text-gray-500 hover:text-white text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-6 gap-1">
                                    {CATEGORIES.find(c => c.id === concept.category)?.concepts
                                      .find(con => con.name === concept.concept)?.colors.map((color, idx) => (
                                        <button
                                          key={idx}
                                          onClick={() => {
                                            handleUpdateConceptColor(concept.category, concept.concept, color);
                                          }}
                                          className={`w-7 h-7 rounded-md border-2 transition-all ${
                                            concept.color === color ? 'border-white scale-110' : 'border-transparent hover:border-gray-400'
                                          }`}
                                          style={{ backgroundColor: color }}
                                        />
                                      ))}
                                  </div>
                                  <div className="flex gap-2 pt-2 border-t border-gray-700">
                                    <input
                                      type="color"
                                      value={concept.color}
                                      onChange={(e) => {
                                        setSelectedConcepts(prev => prev.map(c => 
                                          c.category === concept.category && c.concept === concept.concept 
                                            ? { ...c, color: e.target.value }
                                            : c
                                        ));
                                      }}
                                      className="w-10 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                      type="text"
                                      value={concept.color}
                                      onChange={(e) => {
                                        if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                                          setSelectedConcepts(prev => prev.map(c => 
                                            c.category === concept.category && c.concept === concept.concept 
                                              ? { ...c, color: e.target.value }
                                              : c
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
                          </AnimatePresence>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">
                        {concept.concept}
                        {concept.isCustom && <span className="text-purple-400 text-xs ml-1">✦</span>}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {concept.isCustom ? 'Personalizado' : CATEGORIES.find(c => c.id === concept.category)?.name}
                      </div>
                    </div>
                    
                    {/* Eliminar */}
                    <button
                      onClick={() => setSelectedConcepts(selectedConcepts.filter((_, i) => i !== index))}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Selector de número de colores - Botones */}
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Colores en la paleta</span>
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

        {/* Paletas generadas - SEPARADAS POR MODO */}
        <div className="p-4 space-y-3">
          <h4 className="font-semibold text-white flex items-center gap-2">
            ✨ Paletas sugeridas
          </h4>
          
          {mode === 'comparative' ? (
            // Modo Comparativa: mostrar paleta de ejes
            generatePaletteFromAxes.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm">
                Añade ejes y ajusta valores para generar paletas
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => onCreatePalette(generatePaletteFromAxes)}
                  className="w-full p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Paleta resultante</span>
                    <span className="text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-all">
                      Usar esta →
                    </span>
                  </div>
                  <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                    {generatePaletteFromAxes.map((color, colorIdx) => (
                      <div
                        key={colorIdx}
                        className="flex-1"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
                {/* Variaciones de la paleta comparativa */}
                {[1, 2].map(variation => {
                  const varPalette = generatePaletteFromAxes.map((color) => {
                    const hsl = hexToHSL(color);
                    return hslToHex(
                      (hsl.h + variation * 10) % 360,
                      Math.max(20, Math.min(100, hsl.s + variation * 5 - 5)),
                      Math.max(20, Math.min(80, hsl.l + variation * 3 - 3))
                    );
                  });
                  return (
                    <button
                      key={variation}
                      onClick={() => onCreatePalette(varPalette)}
                      className="w-full p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Variación {variation}</span>
                        <span className="text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-all">
                          Usar esta →
                        </span>
                      </div>
                      <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                        {varPalette.map((color, colorIdx) => (
                          <div
                            key={colorIdx}
                            className="flex-1"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            // Modo Tinder: paletas originales
            generatedPalettes.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm">
                Selecciona conceptos para generar paletas
              </div>
            ) : (
              generatedPalettes.map((palette, idx) => (
                <button
                  key={idx}
                  onClick={() => onCreatePalette(palette)}
                  className="w-full p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Variación {idx + 1}</span>
                    <span className="text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-all">
                      Usar esta →
                    </span>
                  </div>
                  <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                    {palette.map((color, colorIdx) => (
                      <div
                        key={colorIdx}
                        className="flex-1"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))
            )
          )}
        </div>

        {/* Botón principal */}
        <div className="p-4 border-t border-gray-700/50">
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition-all"
            >
              ← Volver
            </button>
            <button
              onClick={() => generatedPalettes[0] && onCreatePalette(generatedPalettes[0])}
              disabled={generatedPalettes.length === 0}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 rounded-xl text-white font-semibold transition-all"
            >
              Usar esta paleta →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
