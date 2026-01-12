import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const YarnCursor: React.FC = () => {
  // Increased stiffness significantly to reduce lag/floatiness ("losing the mouse")
  // Damping adjusted to prevent oscillation while keeping it snappy
  const mouseX = useSpring(0, { stiffness: 1500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 1500, damping: 100 });
  
  // Track visibility to hide cursor when it leaves the window
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Direct mapping to client coordinates without offset logic in state
      // We handle visual offset in the render to align the "finger"
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ 
        x: mouseX, 
        y: mouseY,
        opacity: isVisible ? 1 : 0
      }}
    >
      {/* 
        Updated Paw Shape:
        Offset is adjusted so the "Index" toe (top leftish) is the click point.
      */}
      <div className="-translate-x-[12px] -translate-y-[10px]">
        <svg 
          width="45" 
          height="45" 
          viewBox="0 0 50 50" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          style={{ filter: "drop-shadow(2px 3px 4px rgba(0,0,0,0.2))" }}
        >
          {/* Rotated to mimic a natural hand position */}
          <g transform="rotate(-15 25 25)">
            
            {/* 
               Main Pad (The Palm) 
               Rotated 180 degrees around center.
               Added translate(-2, -5) to move it visually +2 (Right) and +5 (Down) 
               because the rotation inverts the axes.
            */}
            <g transform="rotate(180 25 24) translate(-2, -5)">
                <path 
                    d="M 18,30 C 12,25 12,18 18,18 C 22,18 25,22 25,22 C 25,22 28,18 32,18 C 38,18 38,25 32,30 C 28,34 22,34 18,30 Z" 
                    fill="white" 
                    stroke="#111827" 
                    strokeWidth="2"
                />
                <path 
                    d="M 20,28 C 16,25 16,21 19,20 C 21,20 25,24 25,24 C 25,24 29,20 31,20 C 34,21 34,25 30,28 C 27,31 23,31 20,28 Z" 
                    fill="#F472B6" 
                    opacity="0.9"
                />
            </g>

            {/* Toe 1 (Little Toe - Left) */}
            <ellipse cx="11" cy="20" rx="5" ry="6.5" transform="rotate(-30 11 20)" fill="white" stroke="#111827" strokeWidth="2" />
            <ellipse cx="11" cy="20" rx="2.5" ry="3.5" transform="rotate(-30 11 20)" fill="#F472B6" />

            {/* Toe 2 (Ring Toe) */}
            <ellipse cx="20" cy="11" rx="5.5" ry="7" transform="rotate(-10 20 11)" fill="white" stroke="#111827" strokeWidth="2" />
            <ellipse cx="20" cy="11" rx="3" ry="4" transform="rotate(-10 20 11)" fill="#F472B6" />

            {/* Toe 3 (Middle Toe - The Pointer) - This aligns near 0,0 locally */}
            <ellipse cx="32" cy="10" rx="5.5" ry="7" transform="rotate(10 32 10)" fill="white" stroke="#111827" strokeWidth="2" />
            <ellipse cx="32" cy="10" rx="3" ry="4" transform="rotate(10 32 10)" fill="#F472B6" />

            {/* Toe 4 (Index/Thumb - Right) */}
            <ellipse cx="41" cy="18" rx="5" ry="6.5" transform="rotate(30 41 18)" fill="white" stroke="#111827" strokeWidth="2" />
            <ellipse cx="41" cy="18" rx="2.5" ry="3.5" transform="rotate(30 41 18)" fill="#F472B6" />
          </g>
        </svg>
      </div>
    </motion.div>
  );
};