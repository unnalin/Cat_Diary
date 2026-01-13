import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CatState } from '../types';

interface CatStateControllerProps {
  currentState: CatState;
  onStateChange: (state: CatState) => void;
  language: 'en' | 'zh';
}

const STATE_CONFIGS = {
  en: [
    { state: CatState.IDLE, emoji: '😺', label: 'Idle' },
    { state: CatState.LOVED, emoji: '😻', label: 'Happy' },
    { state: CatState.SAD, emoji: '😿', label: 'Sad' },
    { state: CatState.ANGRY, emoji: '😾', label: 'Angry' },
    { state: CatState.SURPRISED, emoji: '🙀', label: 'Surprised' },
    { state: CatState.WALKING, emoji: '🐾', label: 'Walking' }
  ],
  zh: [
    { state: CatState.IDLE, emoji: '😺', label: '默认' },
    { state: CatState.LOVED, emoji: '😻', label: '开心' },
    { state: CatState.SAD, emoji: '😿', label: '伤心' },
    { state: CatState.ANGRY, emoji: '😾', label: '生气' },
    { state: CatState.SURPRISED, emoji: '🙀', label: '惊讶' },
    { state: CatState.WALKING, emoji: '🐾', label: '走动' }
  ]
};

export const CatStateController: React.FC<CatStateControllerProps> = ({
  currentState,
  onStateChange,
  language
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const states = STATE_CONFIGS[language];

  return (
    <>
      {/* Floating Yarn Ball Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center border-4 border-white"
        style={{ background: '#b7a384' }}
        animate={{
          rotate: isOpen ? 180 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <motion.span
          className="text-3xl"
          animate={{
            scale: isOpen ? 0 : 1,
            rotate: isOpen ? 180 : 0,
          }}
        >
          🧶
        </motion.span>
        <motion.span
          className="text-3xl absolute"
          animate={{
            scale: isOpen ? 1 : 0,
            rotate: isOpen ? 0 : -180,
          }}
        >
          ✕
        </motion.span>
      </motion.button>

      {/* Expandable State Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0, x: 100, y: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0, x: 100, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-28 right-8 z-40"
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl px-6 py-5 shadow-2xl border-4" style={{ borderColor: '#b7a384' }}>
              {/* Title */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  {language === 'en' ? 'Cat Mood Control' : '猫咪心情控制'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'en' ? 'Tap to change mood' : '点击改变心情'}
                </p>
              </div>

              {/* State Grid */}
              <div className="grid grid-cols-3 gap-3">
                {states.map(({ state, emoji, label }) => (
                  <motion.button
                    key={state}
                    onClick={() => {
                      onStateChange(state);
                      setIsOpen(false);
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative flex flex-col items-center justify-center
                      w-20 h-20 rounded-2xl transition-all
                      ${currentState === state
                        ? 'shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                    style={currentState === state ? { background: '#b7a384' } : undefined}
                  >
                    <span className="text-3xl mb-1">{emoji}</span>
                    <span className={`
                      text-[10px] font-bold
                      ${currentState === state ? 'text-white' : 'text-gray-600'}
                    `}>
                      {label}
                    </span>
                    {currentState === state && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                        style={{ background: '#8b7355' }}
                      >
                        <span className="text-white text-xs">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Current State Display */}
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  {language === 'en' ? 'Current:' : '当前：'}
                  <span className="ml-2 font-bold text-gray-800">
                    {states.find(s => s.state === currentState)?.label}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
