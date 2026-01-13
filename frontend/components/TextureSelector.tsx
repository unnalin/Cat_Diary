import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundTexture } from '../types';

interface TextureSelectorProps {
  currentTexture: BackgroundTexture;
  onSelect: (texture: BackgroundTexture) => void;
  label: string;
}

const TEXTURE_OPTIONS: { id: BackgroundTexture; name: string; preview: React.ReactNode }[] = [
  {
    id: 'none',
    name: '无 / None',
    preview: (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
    )
  },
  {
    id: 'dots',
    name: '点点 / Dots',
    preview: (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" style={{
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.15) 1.5px, transparent 1.5px)',
        backgroundSize: '12px 12px'
      }} />
    )
  },
  {
    id: 'paws',
    name: '猫爪 / Paws',
    preview: (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-2xl opacity-40">🐾</span>
      </div>
    )
  },
  {
    id: 'lines',
    name: '线条 / Lines',
    preview: (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.08) 10px, rgba(0,0,0,0.08) 11px)',
      }} />
    )
  },
  {
    id: 'grid',
    name: '网格 / Grid',
    preview: (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)',
        backgroundSize: '15px 15px'
      }} />
    )
  }
];

export const TextureSelector: React.FC<TextureSelectorProps> = ({
  currentTexture,
  onSelect,
  label
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-colors hover:border-indigo-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-700 font-medium">{label}</span>
      </div>

      {/* Texture Grid */}
      <div className="grid grid-cols-3 gap-2">
        {TEXTURE_OPTIONS.map((texture) => (
          <motion.button
            key={texture.id}
            onClick={() => onSelect(texture.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative h-16 rounded-lg overflow-hidden border-2 transition-all
              ${currentTexture === texture.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'}
            `}
          >
            {/* Texture Preview */}
            <div className="absolute inset-0">
              {texture.preview}
            </div>

            {/* Name Label */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-1 py-0.5">
              <p className="text-white text-[9px] font-medium text-center truncate">
                {texture.name.split(' / ')[1] || texture.name.split(' / ')[0]}
              </p>
            </div>

            {/* Selected Indicator */}
            {currentTexture === texture.id && (
              <motion.div
                layoutId="texture-indicator"
                className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <span className="text-indigo-500 text-[10px]">✓</span>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
