import React from 'react';
import { motion } from 'framer-motion';
import { PageBackground } from '../types';

interface BackgroundSelectorProps {
  currentBackground: PageBackground;
  onSelect: (bg: PageBackground) => void;
  label: string;
}

export const BACKGROUND_PRESETS: PageBackground[] = [
  {
    id: 'neutral',
    name: '默认 / Default',
    gradient: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
    patternType: 'none',
    patternColor: 'transparent'
  },
  {
    id: 'beige',
    name: '米色 / Beige',
    gradient: 'linear-gradient(135deg, #f5f5dc 0%, #ede8d0 100%)',
    patternType: 'leaf',
    patternColor: 'rgba(210, 180, 140, 0.15)'
  },
  {
    id: 'warm-gray',
    name: '暖灰 / Warm Gray',
    gradient: 'linear-gradient(135deg, #ebe6dc 0%, #e0dcd2 100%)',
    patternType: 'paw',
    patternColor: 'rgba(180, 170, 160, 0.12)'
  },
  {
    id: 'soft-pink',
    name: '淡粉 / Soft Pink',
    gradient: 'linear-gradient(135deg, #f3e9e9 0%, #ead8d8 100%)',
    patternType: 'sakura',
    patternColor: 'rgba(220, 180, 180, 0.15)'
  },
  {
    id: 'dusty-rose',
    name: '藕粉 / Dusty Rose',
    gradient: 'linear-gradient(135deg, #e9dcd7 0%, #dfd0ca 100%)',
    patternType: 'heart',
    patternColor: 'rgba(200, 170, 165, 0.12)'
  },
  {
    id: 'pale-blue',
    name: '浅蓝 / Pale Blue',
    gradient: 'linear-gradient(135deg, #e1e9eb 0%, #d5dfe2 100%)',
    patternType: 'star',
    patternColor: 'rgba(160, 180, 190, 0.15)'
  },
  {
    id: 'sakura-pink',
    name: '樱花粉 / Cherry Blossom',
    gradient: 'linear-gradient(135deg, #FFA5AB 0%, #FCF6A8 100%)',
    patternType: 'sakura',
    patternColor: 'rgba(255, 182, 193, 0.3)'
  },
  {
    id: 'mint-leaf',
    name: '薄荷绿 / Mint Leaf',
    gradient: 'linear-gradient(135deg, #A8E063 0%, #56AB2F 100%)',
    patternType: 'leaf',
    patternColor: 'rgba(144, 238, 144, 0.25)'
  },
  {
    id: 'lavender-star',
    name: '薰衣草 / Lavender',
    gradient: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)',
    patternType: 'star',
    patternColor: 'rgba(230, 230, 250, 0.4)'
  }
];

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentBackground,
  onSelect,
  label
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-colors hover:border-indigo-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-700 font-medium">{label}</span>
      </div>

      {/* Background Grid */}
      <div className="grid grid-cols-2 gap-2">
        {BACKGROUND_PRESETS.map((bg) => (
          <motion.button
            key={bg.id}
            onClick={() => onSelect(bg)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative h-20 rounded-lg overflow-hidden border-2 transition-all
              ${currentBackground.id === bg.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'}
            `}
            style={{ background: bg.gradient }}
          >
            {/* Pattern Preview */}
            <div className="absolute inset-0 flex items-center justify-center">
              <PatternPreview type={bg.patternType} color={bg.patternColor} />
            </div>

            {/* Name Label */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-2 py-1">
              <p className="text-white text-[10px] font-medium text-center truncate">
                {bg.name.split(' / ')[1]}
              </p>
            </div>

            {/* Selected Indicator */}
            {currentBackground.id === bg.id && (
              <motion.div
                layoutId="bg-indicator"
                className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <span className="text-indigo-500 text-xs">✓</span>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Pattern Preview Component
const PatternPreview: React.FC<{ type: PageBackground['patternType']; color: string }> = ({ type, color }) => {
  if (type === 'none') return null;

  const patterns = {
    sakura: (
      <svg width="30" height="30" viewBox="0 0 30 30">
        <path d="M15 8 L17 13 L22 13 L18 16 L20 22 L15 18 L10 22 L12 16 L8 13 L13 13 Z" fill={color} />
        <circle cx="15" cy="15" r="2" fill={color} />
      </svg>
    ),
    leaf: (
      <svg width="30" height="30" viewBox="0 0 30 30">
        <path d="M10 20 Q15 10 20 5 Q18 15 10 20 Z M15 12 L10 20" stroke={color} strokeWidth="1.5" fill={color} opacity="0.7" />
      </svg>
    ),
    star: (
      <svg width="30" height="30" viewBox="0 0 30 30">
        <path d="M15 5 L17 12 L24 12 L18.5 16.5 L21 24 L15 19 L9 24 L11.5 16.5 L6 12 L13 12 Z" fill={color} />
      </svg>
    ),
    heart: (
      <svg width="30" height="30" viewBox="0 0 30 30">
        <path d="M15 25 C15 25 5 18 5 11 C5 7 8 5 11 5 C13 5 15 7 15 7 C15 7 17 5 19 5 C22 5 25 7 25 11 C25 18 15 25 15 25 Z" fill={color} />
      </svg>
    ),
    paw: (
      <svg width="30" height="30" viewBox="0 0 30 30">
        <ellipse cx="15" cy="18" rx="6" ry="7" fill={color} />
        <circle cx="10" cy="10" r="3" fill={color} />
        <circle cx="15" cy="8" r="3" fill={color} />
        <circle cx="20" cy="10" r="3" fill={color} />
        <circle cx="12" cy="13" r="2.5" fill={color} />
      </svg>
    )
  };

  return patterns[type];
};
