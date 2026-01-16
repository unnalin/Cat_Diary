import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStage } from '../hooks/useGameState';

interface GlitchEffectsProps {
  corruption: number;
  stage: GameStage;
  children: React.ReactNode;
}

export const GlitchEffects: React.FC<GlitchEffectsProps> = ({
  corruption,
  stage,
  children
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Random glitch trigger
  useEffect(() => {
    if (stage === GameStage.ESTABLISHMENT) return;

    const glitchInterval = setInterval(() => {
      const chance = corruption / 100; // Higher corruption = more frequent glitches
      if (Math.random() < chance * 0.3) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, [corruption, stage]);

  // Screen shake effect for POSSESSION stage
  useEffect(() => {
    if (stage !== GameStage.POSSESSION) return;

    const shakeInterval = setInterval(() => {
      if (Math.random() < 0.4) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
      }
    }, 4000);

    return () => clearInterval(shakeInterval);
  }, [stage]);

  // Random screen flash
  useEffect(() => {
    if (corruption < 60) return;

    const flashInterval = setInterval(() => {
      if (Math.random() < 0.15) {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 100);
      }
    }, 5000);

    return () => clearInterval(flashInterval);
  }, [corruption]);

  // Get filter based on corruption level
  const getFilter = () => {
    if (corruption < 30) return 'none';
    if (corruption < 60) return 'contrast(1.1) brightness(0.98)';
    if (corruption < 90) return 'contrast(1.5) grayscale(0.5)';
    return 'contrast(2) grayscale(0.8) brightness(0.8)';
  };

  return (
    <div
      className="relative w-full h-full"
      style={{
        filter: getFilter(),
        transition: 'filter 0.5s ease'
      }}
    >
      {/* Main content with shake animation */}
      <motion.div
        animate={{
          x: isGlitching ? [0, -2, 2, -2, 0] : isShaking ? [0, -4, 4, -4, 4, -4, 0] : 0,
          y: isGlitching ? [0, 1, -1, 1, 0] : isShaking ? [0, 2, -2, 2, -2, 2, 0] : 0
        }}
        transition={{ duration: isShaking ? 0.3 : 0.2 }}
      >
        {children}
      </motion.div>

      {/* Flash overlay */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white pointer-events-none z-50"
          />
        )}
      </AnimatePresence>

      {/* Scanline effect for high corruption */}
      {corruption >= 70 && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.05) 2px, rgba(0, 0, 0, 0.05) 4px)',
            animation: 'scanline 8s linear infinite',
            opacity: stage === GameStage.POSSESSION ? 0.8 : 0.4
          }}
        />
      )}

      {/* Vignette effect - intensifies in POSSESSION stage */}
      {corruption >= 50 && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: stage === GameStage.POSSESSION
              ? 'radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.6) 100%)'
              : 'radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.3) 100%)',
            opacity: Math.min((corruption - 50) / 50, stage === GameStage.POSSESSION ? 1 : 0.7)
          }}
        />
      )}

      {/* Red overlay for POSSESSION stage */}
      {stage === GameStage.POSSESSION && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: 'radial-gradient(circle, transparent 50%, rgba(139, 0, 0, 0.2) 100%)',
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
      )}

      <style>{`
        @keyframes scanline {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10px);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(2px, -2px); }
          75% { transform: translate(-2px, -2px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};
