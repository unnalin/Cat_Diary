import { useState, useEffect, useCallback } from 'react';

// Corruption stages
export enum CorruptionStage {
  NORMAL = 'NORMAL',         // 0-30
  SUSPICIOUS = 'SUSPICIOUS', // 31-60
  AGGRESSIVE = 'AGGRESSIVE', // 61-90
  ENDING = 'ENDING'          // >90
}

export interface CorruptionState {
  value: number;
  stage: CorruptionStage;
  pendingMessage: string | null;
}

const STORAGE_KEY = 'nero_corruption';
const PENDING_MESSAGE_KEY = 'nero_pending_message';

// Get corruption stage based on value
const getCorruptionStage = (value: number): CorruptionStage => {
  if (value <= 30) return CorruptionStage.NORMAL;
  if (value <= 60) return CorruptionStage.SUSPICIOUS;
  if (value <= 90) return CorruptionStage.AGGRESSIVE;
  return CorruptionStage.ENDING;
};

export const useCorruption = () => {
  const [corruption, setCorruption] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [pendingMessage, setPendingMessage] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(PENDING_MESSAGE_KEY);
      if (stored) {
        localStorage.removeItem(PENDING_MESSAGE_KEY);
        return stored;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Save corruption to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, corruption.toString());
    } catch (error) {
      console.error('Failed to save corruption:', error);
    }
  }, [corruption]);

  // Increment corruption by a given amount
  const addCorruption = useCallback((amount: number) => {
    setCorruption(prev => Math.min(100, prev + amount));
  }, []);

  // Decrease corruption by a given amount (for feeding/watering)
  const reduceCorruption = useCallback((amount: number) => {
    setCorruption(prev => Math.max(0, prev - amount));
  }, []);

  // Set a pending message
  const setPending = useCallback((message: string) => {
    try {
      localStorage.setItem(PENDING_MESSAGE_KEY, message);
      setPendingMessage(message);
    } catch (error) {
      console.error('Failed to set pending message:', error);
    }
  }, []);

  // Clear pending message
  const clearPendingMessage = useCallback(() => {
    setPendingMessage(null);
  }, []);

  const stage = getCorruptionStage(corruption);

  return {
    corruption,
    stage,
    pendingMessage,
    addCorruption,
    reduceCorruption,
    setPending,
    clearPendingMessage
  };
};
