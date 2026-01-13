import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageBackground, BackgroundTexture } from '../types';

interface BackgroundDecorProps {
  background: PageBackground;
  texture: BackgroundTexture;
}

export const BackgroundDecor: React.FC<BackgroundDecorProps> = ({ background, texture }) => {
  // Generate random positions for patterns
  const patterns = useMemo(() => {
    const count = 20;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      scale: 0.6 + Math.random() * 0.7,
      delay: Math.random() * 10,
      duration: 20 + Math.random() * 15
    }));
  }, [background.id]);

  const renderPattern = (type: PageBackground['patternType'], color: string, size: number = 40) => {
    const patterns = {
      sakura: (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <g opacity="0.8">
            <path d="M20 12 L22 18 L28 18 L23 22 L25 28 L20 24 L15 28 L17 22 L12 18 L18 18 Z" fill={color} />
            <circle cx="20" cy="20" r="3" fill={color} />
          </g>
        </svg>
      ),
      leaf: (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <g opacity="0.7">
            <path d="M12 28 Q20 15 28 8 Q25 20 12 28 Z" fill={color} />
            <path d="M20 16 L12 28" stroke={color} strokeWidth="1.5" fill="none" />
          </g>
        </svg>
      ),
      star: (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <path d="M20 8 L22.5 17 L32 17 L24.5 23 L27 32 L20 26 L13 32 L15.5 23 L8 17 L17.5 17 Z" fill={color} opacity="0.7" />
        </svg>
      ),
      heart: (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <path d="M20 32 C20 32 8 24 8 15 C8 10 12 7 16 7 C18 7 20 9 20 9 C20 9 22 7 24 7 C28 7 32 10 32 15 C32 24 20 32 20 32 Z" fill={color} opacity="0.6" />
        </svg>
      ),
      paw: (
        <svg width={size} height={size} viewBox="0 0 40 40">
          <g opacity="0.7">
            <ellipse cx="20" cy="24" rx="8" ry="9" fill={color} />
            <circle cx="13" cy="13" r="4" fill={color} />
            <circle cx="20" cy="11" r="4" fill={color} />
            <circle cx="27" cy="13" r="4" fill={color} />
            <circle cx="16" cy="17" r="3" fill={color} />
          </g>
        </svg>
      ),
      none: null
    };

    return patterns[type];
  };

  const getCombinedBackground = useMemo(() => {
    switch (texture) {
      case 'dots':
        return `radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px), ${background.gradient}`;
      case 'lines':
        return `repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(0,0,0,0.05) 12px, rgba(0,0,0,0.05) 13px), ${background.gradient}`;
      case 'grid':
        return `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px), ${background.gradient}`;
      case 'paws':
      case 'none':
      default:
        return background.gradient;
    }
  }, [texture, background.gradient]);

  const backgroundSize = useMemo(() => {
    switch (texture) {
      case 'dots':
        return '15px 15px, auto';
      case 'grid':
        return '20px 20px, 20px 20px, auto';
      default:
        return undefined;
    }
  }, [texture]);

  // Generate paw pattern positions for 'paws' texture
  const pawPatterns = useMemo(() => {
    if (texture !== 'paws') return [];
    // 使用固定的预设位置，避免重叠
    const positions = [
      { x: 10, y: 15 },
      { x: 75, y: 10 },
      { x: 25, y: 45 },
      { x: 85, y: 40 },
      { x: 15, y: 70 },
      { x: 60, y: 65 },
      { x: 45, y: 25 },
      { x: 50, y: 85 }
    ];
    return positions.map((pos, i) => ({
      id: i,
      x: pos.x,
      y: pos.y,
      rotation: Math.random() * 360,
      scale: 1.5 + Math.random() * 0.6 // 1.5-2.1倍大小
    }));
  }, [texture]);

  if (background.patternType === 'none') {
    return (
      <>
        <div
          className="fixed inset-0 -z-10 transition-all duration-1000"
          style={{
            background: getCombinedBackground,
            ...(backgroundSize && { backgroundSize })
          }}
        />
        {/* Paw texture overlay */}
        {texture === 'paws' && (
          <div className="fixed inset-0 -z-[9] pointer-events-none overflow-hidden opacity-[0.08]">
            {pawPatterns.map((paw) => (
              <div
                key={paw.id}
                className="absolute text-4xl"
                style={{
                  left: `${paw.x}%`,
                  top: `${paw.y}%`,
                  transform: `rotate(${paw.rotation}deg) scale(${paw.scale})`
                }}
              >
                🐾
              </div>
            ))}
          </div>
        )}
        {/* Original emoji decorations for neutral background */}
        {background.id === 'neutral' && texture === 'none' && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 overflow-hidden">
            <div className="absolute top-10 left-10 text-9xl animate-pulse">🐾</div>
            <div className="absolute bottom-20 right-1/3 text-9xl">🧶</div>
            <div className="absolute top-1/2 left-20 text-8xl rotate-12">🐟</div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Gradient Background with Texture */}
      <div
        className="fixed inset-0 -z-10 transition-all duration-1000"
        style={{
          background: getCombinedBackground,
          ...(backgroundSize && { backgroundSize })
        }}
      />

      {/* Paw texture overlay */}
      {texture === 'paws' && (
        <div className="fixed inset-0 -z-[9] pointer-events-none overflow-hidden opacity-[0.08]">
          {pawPatterns.map((paw) => (
            <div
              key={paw.id}
              className="absolute text-4xl"
              style={{
                left: `${paw.x}%`,
                top: `${paw.y}%`,
                transform: `rotate(${paw.rotation}deg) scale(${paw.scale})`
              }}
            >
              🐾
            </div>
          ))}
        </div>
      )}

      {/* Floating Patterns */}
      <div className="fixed inset-0 -z-[5] overflow-hidden pointer-events-none">
        {patterns.map((pattern) => (
          <motion.div
            key={pattern.id}
            className="absolute"
            style={{
              left: `${pattern.x}%`,
              top: `${pattern.y}%`,
            }}
            initial={{
              rotate: pattern.rotation,
              scale: pattern.scale,
              opacity: 0.5
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [pattern.rotation, pattern.rotation + 15, pattern.rotation],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: pattern.duration,
              repeat: Infinity,
              delay: pattern.delay,
              ease: "easeInOut"
            }}
          >
            {renderPattern(background.patternType, background.patternColor, 35 + pattern.scale * 25)}
          </motion.div>
        ))}
      </div>
    </>
  );
};
