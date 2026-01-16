import React from 'react';
import { motion } from 'framer-motion';
import { GameStage } from '../hooks/useGameState';
import { Language } from '../types';

interface GameStatsUIProps {
  syncRate: number;
  energy: number;
  stage: GameStage;
  language: Language;
}

const TRANSLATIONS = {
  en: {
    syncRate: "Soul Link Progress",
    energy: "Energy",
    stages: {
      ESTABLISHMENT: "Establishing connection...",
      DISTURBANCE: "Connection successful, reading emotional frequency...",
      DISTORTION: "WARNING: Link overload, syncing deep data...",
      POSSESSION: "Sync complete. Rewriting reality..."
    }
  },
  zh: {
    syncRate: "灵魂链接进度",
    energy: "能量值",
    stages: {
      ESTABLISHMENT: "正在建立基础链接...",
      DISTURBANCE: "链接成功，正在读取情感频率...",
      DISTORTION: "警告: 链接过载，正在同步底层数据...",
      POSSESSION: "同步完成。正在重写现实..."
    }
  }
};

export const GameStatsUI: React.FC<GameStatsUIProps> = ({
  syncRate,
  energy,
  stage,
  language
}) => {
  const t = TRANSLATIONS[language];

  // Determine stage text color
  const getStageColor = () => {
    switch (stage) {
      case GameStage.ESTABLISHMENT:
        return 'text-green-600';
      case GameStage.DISTURBANCE:
        return 'text-yellow-600';
      case GameStage.DISTORTION:
        return 'text-orange-600';
      case GameStage.POSSESSION:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Determine progress bar color
  const getSyncBarColor = () => {
    if (syncRate >= 86) return 'from-red-500 to-red-700';
    if (syncRate >= 51) return 'from-orange-500 to-red-500';
    if (syncRate >= 26) return 'from-yellow-500 to-orange-500';
    return 'from-green-400 to-blue-500';
  };

  const getEnergyBarColor = () => {
    if (energy <= 20) return 'from-red-500 to-red-600';
    if (energy <= 50) return 'from-yellow-500 to-orange-500';
    return 'from-green-400 to-green-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-24 right-6 z-40 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 w-72 border-2 border-stone-300"
    >
      {/* Stage Indicator */}
      <div className="mb-4 text-center">
        <p className={`text-sm font-bold ${getStageColor()} transition-colors`}>
          {t.stages[stage]}
        </p>
      </div>

      {/* Sync Rate Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-stone-700">{t.syncRate}</span>
          <span className="text-xs text-stone-600">{Math.round(syncRate)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-stone-300">
          <motion.div
            className={`h-full bg-gradient-to-r ${getSyncBarColor()}`}
            animate={{
              width: `${Math.min(syncRate, 100)}%`
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
        </div>
      </div>

      {/* Energy Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-stone-700">{t.energy}</span>
          <span className="text-xs text-stone-600">{Math.round(energy)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-stone-300">
          <motion.div
            className={`h-full bg-gradient-to-r ${getEnergyBarColor()}`}
            animate={{
              width: `${Math.min(energy, 100)}%`
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
        </div>
      </div>

      {/* Low Energy Warning */}
      {energy <= 20 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-red-600 font-semibold text-center"
        >
          {language === 'en' ? 'Energy too low! Write a diary to recharge.' : '能量过低！写日记来充能。'}
        </motion.p>
      )}
    </motion.div>
  );
};
