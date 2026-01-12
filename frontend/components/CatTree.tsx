import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const CatTree: React.FC = () => {
  const [swing, setSwing] = useState(false);

  const handlePoke = () => {
    setSwing(true);
    setTimeout(() => setSwing(false), 2500);
  };

  return (
    <div className="relative w-[180px] h-[500px] flex items-end justify-center select-none">
      <svg width="200" height="500" viewBox="0 0 200 500" className="overflow-visible">
        <defs>
          {/* Simple Wood Texture Filter */}
          <filter id="wood-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.5 0.1" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0.5 0 0 0 0  0.3 0 0 0 0  0.1 0 0 0 0  0 0 0 0.4 0" in="noise" result="coloredNoise" />
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
            <feBlend mode="overlay" in="composite" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Group everything and move down/center */}
        <g transform="translate(20, 20)">
            
            {/* Base */}
            <path 
                d="M 20,450 L 140,450 L 150,470 L 10,470 Z" 
                fill="#8D6E63" 
                stroke="#5D4037" 
                strokeWidth="2" 
                filter="url(#wood-noise)"
            />
            
            {/* Main Post - Extended height to top */}
            <rect 
                x="65" y="20" 
                width="30" height="430" 
                fill="#A1887F" 
                stroke="#5D4037" 
                strokeWidth="2"
                filter="url(#wood-noise)"
            />

            {/* Sisal Rope Wrapping (Scratcher part) */}
            <g>
                {[...Array(20)].map((_, i) => (
                    <path 
                        key={i} 
                        d={`M 65,${300 + i * 6} L 95,${302 + i * 6}`} 
                        stroke="#E0C39E" 
                        strokeWidth="5" 
                        strokeLinecap="round"
                    />
                ))}
            </g>

            {/* Top Platform Arm extending right - Moved to top (y=20) */}
            <rect 
                x="65" y="20" 
                width="100" height="15" 
                rx="2"
                fill="#8D6E63" 
                stroke="#5D4037" 
                strokeWidth="2"
                filter="url(#wood-noise)"
            />

            {/* Swinging Toy Assembly - Positioned at arm tip */}
            <g transform="translate(155, 35)">
                <motion.g 
                    animate={swing ? { rotate: [0, 25, -20, 15, -10, 5, 0] } : { rotate: 0 }}
                    transition={{ duration: 2.5, ease: "easeInOut", times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1] }}
                    style={{ originX: 0.5, originY: 0 }}
                >
                    {/* String starting from 0,0 (relative to group pivot) */}
                    <line x1="0" y1="0" x2="0" y2="100" stroke="#DDDDDD" strokeWidth="2" />
                    
                    {/* Fluffy White Ball */}
                    <g 
                        onClick={handlePoke} 
                        className="cursor-pointer hover:scale-110 transition-transform"
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    >
                        <circle cx="0" cy="115" r="15" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="1" />
                        
                        {/* Simple texture details for the ball */}
                        <path d="M -5,110 Q 0,105 5,110" stroke="#EEE" fill="none" strokeLinecap="round" />
                        <path d="M -8,115 Q 0,118 8,115" stroke="#EEE" fill="none" strokeLinecap="round" />
                        <path d="M -4,120 Q 0,125 4,120" stroke="#EEE" fill="none" strokeLinecap="round" />
                    </g>
                </motion.g>
            </g>
        </g>
      </svg>
    </div>
  );
};