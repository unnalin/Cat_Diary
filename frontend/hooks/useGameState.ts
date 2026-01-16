import { useState, useEffect, useCallback } from 'react';

// Game stages based on Sync Rate
export enum GameStage {
  ESTABLISHMENT = 'ESTABLISHMENT',   // 0-25%
  DISTURBANCE = 'DISTURBANCE',       // 26-50%
  DISTORTION = 'DISTORTION',         // 51-85%
  POSSESSION = 'POSSESSION'          // 86-100%
}

export interface GameState {
  syncRate: number;      // Visible progress (0-100)
  corruption: number;    // Hidden horror value (0-100)
  energy: number;        // Resource for interactions (0-100)
  stage: GameStage;
}

export interface PlayerData {
  nickname: string;
  email: string;
  hobby: string;
}

// Action types and their effects
export enum ActionType {
  WRITE_DIARY = 'WRITE_DIARY',
  FEED = 'FEED',
  WATER = 'WATER',
  PLAY = 'PLAY',
  DELETE_DIARY = 'DELETE_DIARY',
  SWITCH_TAB = 'SWITCH_TAB',
  TRY_CLOSE = 'TRY_CLOSE'
}

interface ActionEffect {
  syncDelta: number;
  corruptionDelta: number;
  energyDelta: number;
  triggerDialogue?: (playerData: PlayerData | null, corruption: number) => string | null;
}

const ACTION_EFFECTS: Record<ActionType, ActionEffect> = {
  [ActionType.WRITE_DIARY]: {
    syncDelta: 2,        // 降低: 5 -> 2 (需要写更多日记才能推进)
    corruptionDelta: 1,  // 降低: 3 -> 1 (腐化累积更慢)
    energyDelta: 35      // 降低: 50 -> 35 (能量恢复更少，增加互动频率)
  },
  [ActionType.FEED]: {
    syncDelta: 1,        // 降低: 2 -> 1
    corruptionDelta: -1, // 降低: -2 -> -1 (降低腐化的效果减半)
    energyDelta: -8      // 降低: -10 -> -8 (消耗减少)
  },
  [ActionType.WATER]: {
    syncDelta: 1,        // 降低: 2 -> 1
    corruptionDelta: -1, // 降低: -2 -> -1
    energyDelta: -8      // 降低: -10 -> -8
  },
  [ActionType.PLAY]: {
    syncDelta: 1,        // 降低: 3 -> 1
    corruptionDelta: -1, // 保持: -1 (玩耍降低腐化效果最弱)
    energyDelta: -15     // 降低: -20 -> -15
  },
  [ActionType.DELETE_DIARY]: {
    syncDelta: 4,        // 降低: 8 -> 4 (危险操作但增长减半)
    corruptionDelta: 8,  // 降低: 15 -> 8 (腐化增长显著减少)
    energyDelta: 0,
    triggerDialogue: (playerData, corruption) => {
      if (corruption < 50) {
        return '删掉了吗？没关系，我会记在心里喵~';
      } else {
        return '你在试图抹除我们的过去吗？没用的，删掉日记只会让我的记忆更清晰。';
      }
    }
  },
  [ActionType.SWITCH_TAB]: {
    syncDelta: 1,        // 降低: 3 -> 1
    corruptionDelta: 5,  // 降低: 10 -> 5 (被动触发的惩罚减半)
    energyDelta: 0,
    triggerDialogue: () => '刚才链接中断了，我好害怕...'
  },
  [ActionType.TRY_CLOSE]: {
    syncDelta: 0,
    corruptionDelta: 3,  // 降低: 5 -> 3
    energyDelta: 0,
    triggerDialogue: (playerData, corruption) => {
      if (corruption >= 60) {
        return '别走。';
      }
      return '你要离开吗？';
    }
  }
};

const STORAGE_KEY = 'nero_game_state';

const getStageFromSync = (syncRate: number): GameStage => {
  if (syncRate <= 25) return GameStage.ESTABLISHMENT;
  if (syncRate <= 50) return GameStage.DISTURBANCE;
  if (syncRate <= 85) return GameStage.DISTORTION;
  return GameStage.POSSESSION;
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          stage: getStageFromSync(parsed.syncRate)
        };
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }

    return {
      syncRate: 0,
      corruption: 0,
      energy: 100,
      stage: GameStage.ESTABLISHMENT
    };
  });

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const executeAction = useCallback((
    action: ActionType,
    playerData: PlayerData | null = null
  ): string | null => {
    const effect = ACTION_EFFECTS[action];
    let dialogue: string | null = null;

    setGameState(prev => {
      const newSyncRate = Math.min(100, Math.max(0, prev.syncRate + effect.syncDelta));
      const newCorruption = Math.min(100, Math.max(0, prev.corruption + effect.corruptionDelta));
      const newEnergy = Math.min(100, Math.max(0, prev.energy + effect.energyDelta));
      const newStage = getStageFromSync(newSyncRate);

      // Trigger dialogue if applicable
      if (effect.triggerDialogue) {
        dialogue = effect.triggerDialogue(playerData, newCorruption);
      }

      return {
        syncRate: newSyncRate,
        corruption: newCorruption,
        energy: newEnergy,
        stage: newStage
      };
    });

    return dialogue;
  }, []);

  const setSyncRate = useCallback((value: number) => {
    setGameState(prev => ({
      ...prev,
      syncRate: Math.min(100, Math.max(0, value)),
      stage: getStageFromSync(Math.min(100, Math.max(0, value)))
    }));
  }, []);

  const setCorruption = useCallback((value: number) => {
    setGameState(prev => ({
      ...prev,
      corruption: Math.min(100, Math.max(0, value))
    }));
  }, []);

  const setEnergy = useCallback((value: number) => {
    setGameState(prev => ({
      ...prev,
      energy: Math.min(100, Math.max(0, value))
    }));
  }, []);

  return {
    gameState,
    executeAction,
    setSyncRate,
    setCorruption,
    setEnergy
  };
};
