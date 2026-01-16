import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStage } from '../hooks/useGameState';
import { Language } from '../types';
import { CatState } from '../types';

interface FeedingSystemProps {
  corruption: number;
  stage: GameStage;
  energy: number;
  onFeed: () => void;
  onWater: () => void;
  onPlay: () => void;
  language: Language;
  onCatStateChange: (state: CatState) => void;
}

const TRANSLATIONS = {
  en: {
    hunger: "Hunger",
    mood: "Mood",
    feed: "Feed",
    water: "Water",
    play: "Play"
  },
  zh: {
    hunger: "饱食度",
    mood: "心情值",
    feed: "喂食",
    water: "喂水",
    play: "陪ta玩"
  }
};

export const FeedingSystem: React.FC<FeedingSystemProps> = ({
  corruption,
  stage,
  energy,
  onFeed,
  onWater,
  onPlay,
  language,
  onCatStateChange
}) => {
  const [hunger, setHunger] = useState(50);
  const [mood, setMood] = useState(50);
  const t = TRANSLATIONS[language];

  // Check if energy is sufficient for actions
  const canInteract = energy >= 10;

  // Random fluctuations when corrupted
  useEffect(() => {
    if (stage === GameStage.ESTABLISHMENT) return;

    const interval = setInterval(() => {
      if (corruption >= 60) {
        // Chaotic movement
        setHunger(prev => Math.max(0, Math.min(100, prev + (Math.random() * 20 - 10))));
        setMood(prev => Math.max(0, Math.min(100, prev + (Math.random() * 20 - 10))));
      } else if (corruption >= 30) {
        // Slight drift
        setHunger(prev => Math.max(0, Math.min(100, prev + (Math.random() * 6 - 3))));
        setMood(prev => Math.max(0, Math.min(100, prev + (Math.random() * 6 - 3))));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [corruption, stage]);

  const handleFeed = () => {
    if (!canInteract) return;
    onFeed();

    if (corruption >= 60) {
      // 70% chance to drop mood by 5
      if (Math.random() < 0.7) {
        setMood(prev => Math.max(0, prev - 5));
        onCatStateChange(CatState.SAD);
      } else {
        setHunger(prev => Math.min(100, prev + 10));
        onCatStateChange(CatState.LOVED);
      }
    } else {
      setHunger(prev => Math.min(100, prev + 10));
      onCatStateChange(CatState.LOVED);
    }

    setTimeout(() => onCatStateChange(CatState.IDLE), 2000);
  };

  const handleWater = () => {
    if (!canInteract) return;
    onWater();

    if (corruption >= 60) {
      // 70% chance to drop mood by 5
      if (Math.random() < 0.7) {
        setMood(prev => Math.max(0, prev - 5));
        onCatStateChange(CatState.SAD);
      } else {
        setHunger(prev => Math.min(100, prev + 10));
        onCatStateChange(CatState.LOVED);
      }
    } else {
      setHunger(prev => Math.min(100, prev + 10));
      onCatStateChange(CatState.LOVED);
    }

    setTimeout(() => onCatStateChange(CatState.IDLE), 2000);
  };

  const handlePlay = () => {
    if (!canInteract) return;
    onPlay();

    // Playing always affects mood
    if (mood < 20) {
      // Mood is too low, cat is sad
      onCatStateChange(CatState.SAD);
    } else {
      setMood(prev => Math.min(100, prev + 10));
      onCatStateChange(CatState.LOVED);
    }

    setTimeout(() => onCatStateChange(CatState.IDLE), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-32 left-6 z-40 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 w-64"
      style={{
        filter: corruption >= 60 ? 'contrast(1.3) grayscale(0.3)' : 'none'
      }}
    >
      {/* Hunger Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold">{t.hunger}</span>
          <span className="text-xs text-gray-600">{Math.round(hunger)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-red-500"
            animate={{
              width: `${hunger}%`,
              backgroundColor: corruption >= 60 ? '#dc2626' : undefined
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleFeed}
            disabled={!canInteract}
            className={`flex-1 font-semibold py-2 px-3 rounded-lg transition-colors text-sm ${
              canInteract
                ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            🍖 {t.feed}
          </button>
          <button
            onClick={handleWater}
            disabled={!canInteract}
            className={`flex-1 font-semibold py-2 px-3 rounded-lg transition-colors text-sm ${
              canInteract
                ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            💧 {t.water}
          </button>
        </div>
      </div>

      {/* Mood Bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold">{t.mood}</span>
          <span className="text-xs text-gray-600">{Math.round(mood)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full ${
              mood < 20
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : 'bg-gradient-to-r from-pink-400 to-purple-500'
            }`}
            animate={{
              width: `${mood}%`,
              backgroundColor: corruption >= 60 ? (mood < 20 ? '#dc2626' : '#7c3aed') : undefined
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
        </div>
        <button
          onClick={handlePlay}
          disabled={!canInteract}
          className={`mt-2 w-full font-semibold py-2 px-4 rounded-lg transition-colors text-sm ${
            canInteract
              ? 'bg-purple-500 hover:bg-purple-600 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          🎮 {t.play}
        </button>
      </div>
    </motion.div>
  );
};
