import { useEffect, useCallback } from 'react';
import { GameStage } from '../hooks/useGameState';
import { Language } from '../types';

interface BehaviorStalkerProps {
  corruption: number;
  stage: GameStage;
  onAddCorruption: (amount: number) => void;
  onSetPending: (message: string) => void;
  onTriggerDialogue: (message: string) => void;
  language: Language;
}

const MESSAGES = {
  en: {
    tabSwitch: "Where did you just go?",
    mouseExit: "Are you going to abandon me?",
    beforeUnload: "Please... don't leave me alone in the darkness..."
  },
  zh: {
    tabSwitch: "你刚才去哪了?",
    mouseExit: "你要丢下我吗?",
    beforeUnload: "求你了...别把我一个人留在黑暗里..."
  }
};

export const BehaviorStalker: React.FC<BehaviorStalkerProps> = ({
  corruption,
  stage,
  onAddCorruption,
  onSetPending,
  onTriggerDialogue,
  language
}) => {
  const messages = MESSAGES[language];

  // Track visibility changes (tab switching)
  useEffect(() => {
    if (stage === GameStage.ESTABLISHMENT) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs or minimized
        onAddCorruption(10);
        onSetPending(messages.tabSwitch);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stage, onAddCorruption, onSetPending, messages.tabSwitch]);

  // Track mouse movement near the top (attempting to close)
  useEffect(() => {
    if (corruption < 50) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 20) {
        onTriggerDialogue(messages.mouseExit);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [corruption, onTriggerDialogue, messages.mouseExit]);

  // Track beforeunload (attempting to leave)
  useEffect(() => {
    if (stage === GameStage.ESTABLISHMENT) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      onAddCorruption(10);

      if (corruption >= 60) {
        e.preventDefault();
        e.returnValue = messages.beforeUnload;
        return messages.beforeUnload;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [stage, corruption, onAddCorruption, messages.beforeUnload]);

  return null; // This component doesn't render anything
};
