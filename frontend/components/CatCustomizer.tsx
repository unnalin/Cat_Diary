import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CatAppearance } from '../types';

interface CatCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  appearance: CatAppearance;
  onChange: (newAppearance: CatAppearance) => void;
  text: {
    button: string;
    title: string;
    accessories: string;
    eyeColor: string;
    collarColor: string;
    bellColor: string;
    saved: string;
  };
}

// Preset colors: Red, Orange, Yellow, Green, Cyan, Blue, Purple, Black, White, Gray
const PRESET_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#235D3A', // Forest Green (The requested default)
  '#22C55E', // Bright Green
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#A855F7', // Purple
  '#151515', // Black
  '#FFFFFF', // White
  '#6B7280', // Gray
];

export const CatCustomizer: React.FC<CatCustomizerProps> = ({ isOpen, onClose, appearance, onChange, text }) => {
  const updateColor = (key: keyof CatAppearance, value: string) => {
    onChange({ ...appearance, [key]: value });
  };

  const renderColorSection = (label: string, property: keyof CatAppearance) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-colors hover:border-indigo-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-700 font-medium">{label}</span>
        <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm ring-1 ring-gray-200">
          <input 
            type="color" 
            value={appearance[property]}
            onChange={(e) => updateColor(property, e.target.value)}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] cursor-pointer border-none p-0"
          />
        </div>
      </div>
      
      {/* Preset Palette */}
      <div className="flex flex-wrap gap-2 justify-between">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => updateColor(property, color)}
            className={`w-6 h-6 rounded-full border border-black/10 shadow-sm transition-transform hover:scale-110 active:scale-95 ${appearance[property] === color ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-80 bg-white/90 backdrop-blur-xl shadow-2xl z-50 p-6 border-l border-white/50 flex flex-col cursor-default"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{text.title}</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-thin">
            <section className="space-y-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{text.accessories}</h3>
              
              {renderColorSection(text.eyeColor, 'eyeColor')}
              {renderColorSection(text.collarColor, 'collarColor')}
              {renderColorSection(text.bellColor, 'bellColor')}
            </section>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400">
              {text.saved}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};