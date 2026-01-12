import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, Variants, AnimatePresence } from 'framer-motion';
import { CatState, CatAppearance, CatSkin } from '../types';

interface BlackCatProps {
  catState: CatState;
  onInteract: () => void;
  appearance: CatAppearance;
}

const HAPPY_EMOJIS = ['^w^', '>///<', 'UwU', '❤️', '✨', '😻', '🐾', '///', '♪'];
const SAD_EMOJIS = ['😿', '💧', '💔', '🌧️', '...'];

export const BlackCat: React.FC<BlackCatProps> = ({ catState, onInteract, appearance }) => {
  const mouseX = useSpring(0, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 20 });
  
  // Calculate dynamic colors based on skin
  const getSkinPalette = (skin: CatSkin) => {
    switch (skin) {
      case CatSkin.GRAY:
        return { body: '#6B7280', point: '#4B5563', stripe: 'transparent' };
      case CatSkin.ORANGE_TABBY:
        return { body: '#F97316', point: '#EA580C', stripe: '#C2410C' };
      case CatSkin.COW:
        return { body: '#FFFFFF', point: '#111827', stripe: 'transparent' };
      case CatSkin.SIAMESE:
        return { body: '#EFE4D0', point: '#3E2723', stripe: 'transparent' }; // Cream body, Dark Brown points
      case CatSkin.BLACK:
      default:
        return { body: '#151515', point: '#151515', stripe: 'transparent' };
    }
  };

  const palette = getSkinPalette(appearance.skin);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPct = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const yPct = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      mouseX.set(xPct);
      mouseY.set(yPct);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const headRotate = useTransform(mouseX, [-1, 1], [-20, 20]);
  const headTilt = useTransform(mouseY, [-1, 1], [-10, 10]);

  // Animation Variants
  const containerVariants: Variants = {
    [CatState.IDLE]: { y: 0 },
    [CatState.WALKING]: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 0.6, ease: "easeInOut" } },
    [CatState.SURPRISED]: { y: -60, transition: { type: "spring", stiffness: 400, damping: 12 } },
    [CatState.LOVED]: { y: 0, scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 15 } },
    [CatState.SAD]: { y: 20, scale: 0.95, transition: { duration: 0.8, ease: "easeInOut" } }
  };

  const bodyShapeVariants: Variants = {
    [CatState.IDLE]: { scaleY: 1, scaleX: 1 },
    [CatState.WALKING]: { scaleY: 1, scaleX: 1 },
    [CatState.SURPRISED]: { scaleY: 1.15, scaleX: 0.9, transition: { type: "spring", stiffness: 400 } },
    [CatState.LOVED]: { scaleY: 0.98, scaleX: 1.02 },
    [CatState.SAD]: { scaleY: 0.95, scaleX: 1.05 } // Hunkered down
  };

  const headPivotVariants: Variants = {
    [CatState.IDLE]: { y: 0, x: 0, rotate: 0 },
    [CatState.WALKING]: { rotate: [2, -2], y: [0, 2, 0], transition: { repeat: Infinity, repeatType: "mirror", duration: 0.6 } },
    [CatState.SURPRISED]: { y: -20, rotate: 0 },
    [CatState.LOVED]: { rotate: [2, -2], transition: { repeat: Infinity, repeatType: "mirror", duration: 2, ease: "easeInOut" } },
    [CatState.SAD]: { y: 15, rotate: 10, transition: { duration: 1 } } // Head down
  };

  const tailVariants: Variants = {
    [CatState.IDLE]: { rotate: [-5, 5], transition: { repeat: Infinity, repeatType: "mirror", duration: 3, ease: "easeInOut" } },
    [CatState.WALKING]: { rotate: [-20, 20], transition: { repeat: Infinity, repeatType: "mirror", duration: 0.5, ease: "linear" } },
    [CatState.SURPRISED]: { rotate: 0, scale: 1.4, pathLength: 0.9, transition: { type: "spring", stiffness: 300 } },
    [CatState.LOVED]: { rotate: [-10, 10], transition: { repeat: Infinity, repeatType: "mirror", duration: 1.5 } },
    [CatState.SAD]: { rotate: 0, pathLength: 0.8, transition: { duration: 1 } } // Tail still/droopy
  };

  const eyeVariants: Variants = {
    [CatState.IDLE]: { scaleY: [1, 0.1, 1], transition: { times: [0.9, 0.95, 1], repeat: Infinity, duration: 4.5 } },
    [CatState.SURPRISED]: { scaleY: 1, scale: 1.25 },
    [CatState.LOVED]: { scaleY: 0.2, scaleX: 1.1 },
    [CatState.WALKING]: { scaleY: 1 },
    [CatState.SAD]: { scaleY: 0.1, scaleX: 1.1, rotate: -5 } // Closed sad eyes
  };

  const blushVariants: Variants = {
    [CatState.IDLE]: { opacity: 0 },
    [CatState.WALKING]: { opacity: 0 },
    [CatState.SURPRISED]: { opacity: 0 },
    [CatState.LOVED]: { opacity: 0.5, scale: 1.2 },
    [CatState.SAD]: { opacity: 0.2, fill: "#A5B4FC" } // Blue-ish gloom
  };

  const [speechEmoji, setSpeechEmoji] = useState('!');
  
  useEffect(() => {
    if (catState === CatState.SURPRISED || catState === CatState.LOVED) {
      setSpeechEmoji(HAPPY_EMOJIS[Math.floor(Math.random() * HAPPY_EMOJIS.length)]);
    } else if (catState === CatState.SAD) {
      setSpeechEmoji(SAD_EMOJIS[Math.floor(Math.random() * SAD_EMOJIS.length)]);
    }
  }, [catState]);

  // Determine fill colors based on skin logic (Siamese is special)
  const bodyFill = palette.body;
  const limbFill = appearance.skin === CatSkin.SIAMESE ? palette.point : palette.body;
  const tailFill = appearance.skin === CatSkin.SIAMESE ? palette.point : palette.body;
  const earFill = appearance.skin === CatSkin.SIAMESE ? palette.point : palette.body;

  // -- PATTERN HELPERS --
  const renderStripes = (part: 'body' | 'head') => {
    if (appearance.skin !== CatSkin.ORANGE_TABBY) return null;
    if (part === 'body') {
      return (
        <g stroke={palette.stripe} strokeWidth="8" strokeLinecap="round" opacity="0.6">
          <path d="M 180,290 L 200,310" />
          <path d="M 170,320 L 190,340" />
          <path d="M 330,280 L 310,300" />
          <path d="M 340,310 L 320,330" />
          <path d="M 250,380 L 280,380" />
        </g>
      );
    }
    return (
      <g stroke={palette.stripe} strokeWidth="4" strokeLinecap="round" opacity="0.8">
        <path d="M -15,-55 L 15,-55" />
        <path d="M -20,-65 L 20,-65" />
        <path d="M -10,-45 L 10,-45" />
      </g>
    );
  };

  const renderCowSpots = () => {
    if (appearance.skin !== CatSkin.COW) return null;
    return (
      <g fill={palette.point}>
        <path d="M 180,290 Q 220,320 200,360 Q 160,340 180,290 Z" opacity="0.9" />
        <path d="M 320,350 Q 350,380 340,320 Q 300,300 320,350 Z" opacity="0.9" />
      </g>
    );
  };
  
  const renderCowFace = () => {
    if (appearance.skin !== CatSkin.COW) return null;
     return (
       <g fill={palette.point}>
          <path d="M -60,-60 Q -40,-20 -80,-30 Z" opacity="0.9" />
          <path d="M 50,-80 Q 80,-60 60,-40 Z" opacity="0.9" />
       </g>
     )
  }

  const renderSiameseMask = () => {
    if (appearance.skin !== CatSkin.SIAMESE) return null;
    return (
      <motion.ellipse 
        cx="0" cy="-45" rx="30" ry="25" 
        fill={palette.point} 
        filter="url(#soft-blur)"
        opacity="0.8"
      />
    );
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence>
        {(catState === CatState.SURPRISED || catState === CatState.LOVED || catState === CatState.SAD) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 50 }}
            exit={{ opacity: 0, scale: 0, x: 50 }}
            className="absolute z-30 bg-white border-[3px] border-black rounded-[2rem] px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -mt-72 -mr-32"
          >
             <span className="text-5xl select-none font-bold text-black">{speechEmoji}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.svg
        viewBox="0 0 500 500"
        className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] overflow-visible"
        onClick={onInteract}
      >
        <defs>
          <filter id="manga-texture">
             <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
             <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" in="noise" result="coloredNoise" />
             <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
             <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
          </filter>
          <filter id="soft-blur">
             <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <motion.g 
          id="cat-whole" 
          animate={catState}
          variants={containerVariants}
          style={{ originX: 0.5, originY: 1 }}
        >
          {/* Legs Back */}
          <g id="legs-back">
             <motion.path d="M 280,340 L 280,410" stroke={limbFill} strokeWidth="24" strokeLinecap="round" variants={{ idle: { rotate: 0 }, loved: { rotate: 0 }, sad: {rotate:0}, walking: { rotate: [20, -20], transition: {repeat: Infinity, duration: 0.6, repeatType:"mirror"} } }} style={{originY:0}} />
             <motion.path d="M 330,330 L 330,400" stroke={limbFill} strokeWidth="24" strokeLinecap="round" variants={{ idle: { rotate: 0 }, loved: { rotate: 0 }, sad: {rotate:0}, walking: { rotate: [-20, 20], transition: {repeat: Infinity, duration: 0.6, repeatType:"mirror"} } }} style={{originY:0}} />
          </g>

          {/* Tail */}
          <motion.path 
            id="tail" 
            d="M 360,340 Q 400,310 420,350 T 460,320" 
            stroke={tailFill} 
            strokeWidth="20" 
            fill="none" 
            strokeLinecap="round" 
            style={{ originX: 0, originY: 0.5 }} 
            variants={tailVariants} 
          />
          {appearance.skin === CatSkin.ORANGE_TABBY && (
             <motion.path 
              d="M 380,325 L 385,335 M 400,330 L 405,340 M 430,335 L 435,325" 
              stroke={palette.stripe} 
              strokeWidth="6" 
              fill="none" 
              strokeLinecap="round" 
              variants={tailVariants}
              style={{ originX: -3, originY: 1 }} 
             />
          )}

          {/* Body Group */}
          <g id="body-group">
             <motion.path 
               id="body-shape"
               d="M 170,280 C 150,280 130,350 150,380 C 160,400 350,400 360,370 C 370,340 370,280 340,270 C 280,250 200,260 170,280 Z"
               fill={bodyFill}
               filter="url(#manga-texture)"
               style={{ originY: 1 }}
               variants={bodyShapeVariants}
             />
             
             {/* Dynamic Patterns on Body */}
             <motion.g variants={bodyShapeVariants} style={{ originY: 1 }} filter="url(#manga-texture)">
                {renderStripes('body')}
                {renderCowSpots()}
             </motion.g>

             {/* Legs Front */}
             <g id="legs-front">
               <motion.path d="M 220,350 L 220,410" stroke={limbFill} strokeWidth="24" strokeLinecap="round" variants={{ idle: { rotate: 0 }, loved: { rotate: 0 }, sad: {rotate:0}, walking: { rotate: [-15, 15], transition: {repeat: Infinity, duration: 0.6, repeatType:"mirror"} } }} style={{originY:0}} />
               <motion.path d="M 180,350 L 180,410" stroke={limbFill} strokeWidth="24" strokeLinecap="round" variants={{ idle: { rotate: 0 }, loved: { rotate: 0 }, sad: {rotate:0}, walking: { rotate: [15, -15], transition: { repeat: Infinity, duration: 0.6, repeatType:"mirror"} } }} style={{originY:0}} />
             </g>

             {/* Head Assembly */}
             <g transform="translate(200, 290)">
                <motion.g variants={headPivotVariants}>
                   <motion.g style={{ rotate: headRotate, y: headTilt }}>
                      
                      {/* Collar */}
                      <g id="collar-assembly">
                         <path d="M -50,0 Q 0,18 50,0" stroke={appearance.collarColor} strokeWidth="10" strokeLinecap="round" fill="none" />
                         <g transform="translate(0, 10)">
                            <path d="M 0,0 L -20,-12 L -20,12 Z" fill={appearance.collarColor} />
                            <path d="M 0,0 L 22,-12 L 22,12 Z" fill={appearance.collarColor} />
                            <circle r="6" fill={appearance.collarColor} />
                            <motion.g animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                               <circle cy="14" r="8" fill={appearance.bellColor} stroke={appearance.bellColor} strokeWidth="1.5" />
                            </motion.g>
                         </g>
                      </g>

                      <g id="head-visuals" filter="url(#manga-texture)">
                        {/* Ears */}
                        <motion.path d="M -75,-65 Q -95,-195 -25,-95 Z" fill={earFill} animate={catState === CatState.SAD ? { rotate: -10, y: 10 } : { rotate: 0 }} />
                        <motion.path d="M 75,-65 Q 95,-195 25,-95 Z" fill={earFill} animate={catState === CatState.SAD ? { rotate: 10, y: 10 } : { rotate: 0 }} />
                        
                        {/* Face */}
                        <ellipse cx="0" cy="-60" rx="82" ry="70" fill={bodyFill} />
                        
                        {/* Patterns on Head */}
                        {renderStripes('head')}
                        {renderCowFace()}
                        {renderSiameseMask()}

                        {/* Cheeks */}
                        <motion.ellipse cx="-45" cy="-25" rx="12" ry="6" fill="#FFB6C1" variants={blushVariants} filter="url(#soft-blur)" />
                        <motion.ellipse cx="45" cy="-25" rx="12" ry="6" fill="#FFB6C1" variants={blushVariants} filter="url(#soft-blur)" />
                        
                        {/* Whiskers */}
                        <g stroke={appearance.skin === CatSkin.BLACK ? "#444" : "#222"} strokeWidth="2.5" opacity="0.4">
                          <path d="M -75,-40 L -110,-45" />
                          <path d="M -65,-25 L -110,-20" />
                          <path d="M 75,-40 L 110,-45" />
                          <path d="M 65,-25 L 110,-20" />
                        </g>

                        {/* Eyes */}
                        <g transform="translate(0, -45)">
                           <g transform="translate(-42, 0)">
                             <motion.g variants={eyeVariants}>
                                <circle r="23" fill={appearance.eyeColor} />
                                <circle r="13" fill="#000000" />
                                <circle r="4" cx="5" cy="-5" fill="#FFFFFF" opacity="0.6" />
                             </motion.g>
                             {/* Tears (Left) */}
                             <AnimatePresence>
                               {catState === CatState.SAD && (
                                 <motion.g 
                                   key="left-tear"
                                   initial={{ opacity: 0, y: 0 }} 
                                   animate={{ 
                                     opacity: 1, 
                                     y: 40,
                                     transition: { duration: 1.5, repeat: Infinity, ease: "easeIn" }
                                   }} 
                                   exit={{ 
                                     opacity: 0,
                                     transition: { duration: 0.5 } 
                                   }} 
                                 >
                                    <circle r="5" fill="#60A5FA" opacity="0.8" />
                                 </motion.g>
                               )}
                             </AnimatePresence>
                           </g>
                           <g transform="translate(42, 0)">
                             <motion.g variants={eyeVariants}>
                                <circle r="23" fill={appearance.eyeColor} />
                                <circle r="13" fill="#000000" />
                                <circle r="4" cx="5" cy="-5" fill="#FFFFFF" opacity="0.6" />
                             </motion.g>
                             {/* Tears (Right) */}
                             <AnimatePresence>
                               {catState === CatState.SAD && (
                                 <motion.g 
                                   key="right-tear"
                                   initial={{ opacity: 0, y: 0 }} 
                                   animate={{ 
                                     opacity: 1, 
                                     y: 40,
                                     transition: { duration: 1.5, repeat: Infinity, ease: "easeIn", delay: 0.5 }
                                   }} 
                                   exit={{ 
                                     opacity: 0,
                                     transition: { duration: 0.5 }
                                   }} 
                                 >
                                    <circle r="5" fill="#60A5FA" opacity="0.8" />
                                 </motion.g>
                               )}
                             </AnimatePresence>
                           </g>
                        </g>
                      </g>
                   </motion.g>
                </motion.g>
             </g>
          </g>
        </motion.g>
      </motion.svg>
    </div>
  );
};