import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiaryEntry, DiaryTheme, Mood } from '../types';

export const DIARY_THEMES: DiaryTheme[] = [
  {
    id: 'classic-black',
    name: 'Classic Noir',
    color: '#1a1a1a',
    pattern: 'radial-gradient(circle at 50% 50%, #2a2a2a 1px, transparent 1px) 0 0 / 20px 20px',
    textColor: '#ffffff',
    paperColor: '#f3f4f6',
    paperPattern: 'linear-gradient(#e5e7eb 1px, transparent 1px) 0 0 / 100% 24px', // Lined paper
    accentColor: '#111827'
  },
  {
    id: 'midnight-blue',
    name: 'Midnight',
    color: '#1e3a8a',
    pattern: 'linear-gradient(45deg, #172554 25%, transparent 25%, transparent 75%, #172554 75%, #172554), linear-gradient(45deg, #172554 25%, transparent 25%, transparent 75%, #172554 75%, #172554)',
    textColor: '#bfdbfe',
    paperColor: '#eff6ff',
    paperPattern: 'radial-gradient(#dbeafe 1px, transparent 1px) 0 0 / 10px 10px', // Dotted
    accentColor: '#1e40af'
  },
  {
    id: 'sakura-pink',
    name: 'Sakura',
    color: '#fbcfe8',
    pattern: 'radial-gradient(circle, #f472b6 10%, transparent 10%) 0 0 / 15px 15px',
    textColor: '#831843',
    paperColor: '#fff1f2',
    paperPattern: 'radial-gradient(circle, #fecdd3 2px, transparent 2px) 0 0 / 20px 20px', // Pink dots
    accentColor: '#be185d'
  },
  {
    id: 'kraft-paper',
    name: 'Kraft',
    color: '#d4a373',
    pattern: 'repeating-linear-gradient(45deg, #cc9563, #cc9563 10px, #d4a373 10px, #d4a373 20px)',
    textColor: '#431407',
    paperColor: '#fef3c7',
    paperPattern: 'repeating-linear-gradient(0deg, transparent, transparent 23px, #e7e5e4 24px)', // Wide ruled
    accentColor: '#78350f'
  },
  {
    id: 'vintage-beige',
    name: 'Vintage Linen',
    color: '#eaddcf',
    pattern: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #d6c4b0 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #d6c4b0 20px)',
    textColor: '#5c4d3c',
    paperColor: '#fdfbf7',
    paperPattern: 'linear-gradient(to right, #f5f5f4 1px, transparent 1px) 0 0 / 40px 40px, linear-gradient(to bottom, #f5f5f4 1px, transparent 1px) 0 0 / 40px 40px', // Grid
    accentColor: '#57534e'
  },
  {
    id: 'botanical-green',
    name: 'Forest',
    color: '#3a5a40',
    pattern: 'radial-gradient(circle at 0% 0%, #dad7cd 2px, transparent 2px) 0 0 / 12px 12px, radial-gradient(circle at 50% 50%, #dad7cd 2px, transparent 2px) 0 0 / 12px 12px',
    textColor: '#dad7cd',
    paperColor: '#f0fdf4',
    paperPattern: 'linear-gradient(0deg, transparent 23px, #bbf7d0 24px) 0 0 / 100% 24px', // Green lines - Fixed syntax
    accentColor: '#166534'
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Blaze',
    color: '#ea580c', // Orange-600
    pattern: 'repeating-radial-gradient(circle at 0 0, transparent 0, #c2410c 10px), repeating-linear-gradient(#ea580c, #ea580c)',
    textColor: '#fff7ed',
    paperColor: '#fff7ed', // Orange-50
    paperPattern: 'radial-gradient(circle, #fed7aa 1px, transparent 1px) 0 0 / 15px 15px', // Orange dots
    accentColor: '#c2410c' // Orange-700
  }
];

const MOOD_EMOJIS: Record<Mood, string> = {
  happy: '😺',
  sad: '😿',
  calm: '😌',
  excited: '😻',
  tired: '😴',
  angry: '😾',
  confused: '🙀',
  neutral: '😐'
};

interface DiaryBookProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  entries: DiaryEntry[];
  activeThemeId: string;
  onThemeChange: (id: string) => void;
  onDeleteEntry: (id: string) => void;
  text: {
    title: string;
    coverStyle: string;
    recentVibe: string;
    quote: string;
    entriesTitle: string;
    total: string;
    noMemories: string;
    chatToEntry: string;
    label: string;
    deleteConfirm: string;
  };
  moodText: Record<Mood, string>;
}

export const DiaryBook: React.FC<DiaryBookProps> = ({
  isOpen,
  onClose,
  onOpen,
  entries,
  activeThemeId,
  onThemeChange,
  onDeleteEntry,
  text,
  moodText
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const theme = DIARY_THEMES.find(t => t.id === activeThemeId) || DIARY_THEMES[0];

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Define moods to display in stats
  const displayMoods: Mood[] = ['happy', 'sad', 'calm', 'excited', 'tired', 'angry', 'confused'];

  // Helper function to get first 2 lines of content
  const getPreview = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.slice(0, 2).join('\n');
  };

  const hasMoreLines = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.length > 2;
  };

  return (
    <>
      {/* Closed Book Trigger (Bottom Left) */}
      {!isOpen && (
        <motion.div
          className="absolute bottom-8 left-8 z-40 cursor-pointer group"
          onClick={onOpen}
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          whileHover={{ scale: 1.05, rotate: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div 
            className="w-24 h-32 rounded-r-md rounded-l-sm shadow-2xl flex flex-col items-center justify-center relative border-l-4 border-white/20"
            style={{ 
              background: `${theme.pattern} ${theme.color}`
            }}
          >
             <div className="absolute inset-y-0 left-2 w-1 bg-black/20 blur-sm"></div>
             
             {/* Decorative lines instead of box/icon */}
             <div className="w-full px-4 space-y-2 opacity-30">
                <div className="h-0.5 bg-white/50 w-full rounded-full"></div>
                <div className="h-0.5 bg-white/50 w-2/3 rounded-full mx-auto"></div>
                <div className="h-0.5 bg-white/50 w-full rounded-full"></div>
             </div>

             <span className="text-[10px] mt-8 font-bold uppercase tracking-wider bg-black/50 text-white px-2 py-0.5 rounded shadow-lg backdrop-blur-sm">
               {text.label}
             </span>
          </div>
        </motion.div>
      )}

      {/* Open Book Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
          >
            <div className="relative w-full max-w-4xl aspect-[3/2] flex items-center justify-center perspective-[1000px]">
              
              {/* The Book Container */}
              <motion.div
                initial={{ rotateX: 20, scale: 0.8 }}
                animate={{ rotateX: 0, scale: 1 }}
                exit={{ rotateX: 20, scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full h-full flex shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-md overflow-hidden transition-all duration-500"
              >
                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 z-50 w-8 h-8 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center transition-colors"
                  style={{ color: theme.accentColor }}
                >
                  ✕
                </motion.button>

                {/* Left Page (Theme Settings & Stats) */}
                <div 
                  className="w-1/2 p-8 border-r border-black/5 relative flex flex-col transition-colors duration-500"
                  style={{ 
                    background: `${theme.paperPattern} ${theme.paperColor}`
                  }}
                >
                  <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />
                  
                  <h2 
                    className="text-2xl font-bold mb-6 font-serif italic border-b-2 pb-2 transition-colors duration-500"
                    style={{ color: theme.accentColor, borderColor: theme.accentColor + '40' }} // 40 is hex opacity
                  >
                    {text.title}
                  </h2>

                  <div className="mb-6">
                    <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-3" style={{ color: theme.accentColor }}>{text.coverStyle}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {DIARY_THEMES.map((t) => (
                        <motion.button
                          key={t.id}
                          onClick={() => onThemeChange(t.id)}
                          whileHover={{ scale: 1.15, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-8 h-8 rounded-full border-2 shadow-sm transition-all ${activeThemeId === t.id ? 'scale-110 ring-2 ring-offset-2' : 'border-transparent'}`}
                          style={{
                            background: `${t.pattern} ${t.color}`,
                            borderColor: activeThemeId === t.id ? theme.accentColor : 'transparent',
                            '--tw-ring-color': theme.accentColor
                          } as React.CSSProperties}
                          title={t.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
                    <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-3" style={{ color: theme.accentColor }}>{text.recentVibe}</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {displayMoods.map(m => (
                            <motion.div
                              key={m}
                              whileHover={{ scale: 1.05, y: -1 }}
                              className="bg-white/50 backdrop-blur-sm rounded p-2 text-xs flex justify-between items-center shadow-sm transition-shadow hover:shadow-md"
                              style={{ color: theme.accentColor }}
                            >
                                <span className="capitalize flex items-center gap-1">
                                  <span>{MOOD_EMOJIS[m]}</span>
                                  {moodText[m]}
                                </span>
                                <span className="font-bold">{entries.filter(e => e.mood === m).length}</span>
                            </motion.div>
                        ))}
                    </div>
                  </div>
                  
                  <div className="text-xs opacity-50 text-center mt-4 font-serif italic" style={{ color: theme.accentColor }}>
                    "{text.quote}"
                  </div>
                </div>

                {/* Right Page (Entries) */}
                <div 
                  className="w-1/2 p-8 relative flex flex-col overflow-hidden transition-colors duration-500"
                  style={{ 
                    background: `${theme.paperPattern} ${theme.paperColor}`
                  }}
                >
                   <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
                   
                   <h2 
                     className="text-2xl font-bold mb-6 font-serif flex justify-between items-center transition-colors duration-500"
                     style={{ color: theme.accentColor }}
                   >
                     <span>{text.entriesTitle}</span>
                     <span 
                       className="text-xs font-sans font-normal px-2 py-1 rounded-full bg-black/5"
                     >
                       {entries.length} {text.total}
                     </span>
                   </h2>

                   <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-black/10">
                      {sortedEntries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full italic text-center opacity-40" style={{ color: theme.accentColor }}>
                          <div className="w-12 h-1 mb-4 rounded-full bg-current"></div>
                          <p>{text.noMemories}</p>
                          <p className="text-xs mt-2">{text.chatToEntry}</p>
                        </div>
                      ) : (
                        sortedEntries.map((entry, index) => {
                          // Get the theme for this specific entry
                          const entryTheme = DIARY_THEMES.find(t => t.id === entry.themeId) || DIARY_THEMES[0];
                          return (
                            <motion.div
                              key={entry.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                              whileHover={{ scale: 1.02, x: 4 }}
                              className="group cursor-pointer hover:bg-black/5 rounded-lg p-2 -m-2 transition-colors"
                              onClick={() => setSelectedEntry(entry)}
                            >
                               <div className="flex justify-between items-baseline mb-1">
                                  <span className="font-bold text-sm flex items-center gap-2 text-gray-700">
                                     <motion.span
                                       className="text-lg"
                                       whileHover={{ scale: 1.3, rotate: 10 }}
                                       transition={{ type: "spring", stiffness: 400 }}
                                     >
                                       {MOOD_EMOJIS[entry.mood]}
                                     </motion.span>
                                     {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                  </span>
                               </div>
                               <p
                                 className="text-sm font-serif leading-relaxed border-l-2 pl-3 whitespace-pre-line text-gray-700"
                                 style={{
                                   borderColor: entryTheme.accentColor + '40' // Adding hex opacity for lighter border
                                 }}
                               >
                                 {getPreview(entry.content)}
                               </p>
                               {hasMoreLines(entry.content) && (
                                 <motion.span
                                   initial={{ opacity: 0.6 }}
                                   whileHover={{ opacity: 1, x: 3 }}
                                   className="text-xs italic mt-1 block pl-3 group-hover:opacity-100 transition-opacity text-gray-600"
                                 >
                                   Click to read more...
                                 </motion.span>
                               )}
                               <div className="w-full h-px bg-black/5 mt-4"></div>
                            </motion.div>
                          );
                        })
                      )}
                   </div>
                </div>

              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diary Entry Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (() => {
          // Get the theme for the selected entry
          const selectedTheme = DIARY_THEMES.find(t => t.id === selectedEntry.themeId) || DIARY_THEMES[0];
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              onClick={() => setSelectedEntry(null)}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  background: `${selectedTheme.paperPattern} ${selectedTheme.paperColor}`
                }}
              >
                {/* Header - Fixed at top */}
                <div className="flex-shrink-0 px-8 pt-6 pb-4 border-b-2" style={{ borderColor: selectedTheme.accentColor + '20' }}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <motion.span
                        className="text-4xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        {MOOD_EMOJIS[selectedEntry.mood]}
                      </motion.span>
                      <div>
                        <h3 className="text-xl font-bold font-serif mb-1 text-gray-800">
                          {new Date(selectedEntry.date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        <p className="text-xs opacity-60 text-gray-600">
                          {moodText[selectedEntry.mood]}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => {
                          if (window.confirm(text.deleteConfirm)) {
                            onDeleteEntry(selectedEntry.id);
                            setSelectedEntry(null);
                          }
                        }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0 text-red-600"
                        title="Delete"
                      >
                        🗑️
                      </motion.button>
                      <motion.button
                        onClick={() => setSelectedEntry(null)}
                        whileHover={{ scale: 1.15, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors flex-shrink-0 text-gray-700"
                      >
                        ✕
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Content - Scrollable diary pages */}
                <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-black/10">
                  <div className="min-h-full space-y-4">
                    {selectedEntry.content.split('\n\n').map((paragraph, idx) => {
                      // Check if this line has a speaker prefix (你:, user:, nero:)
                      const hasSpeakerPrefix = /^(你:|user:|nero:)\s/.test(paragraph);

                      return (
                        <p
                          key={idx}
                          className="text-base font-serif leading-loose whitespace-pre-wrap break-words text-gray-700"
                          style={{
                            paddingLeft: hasSpeakerPrefix ? '0' : '2em',
                            wordBreak: 'break-word'
                          }}
                        >
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom decoration */}
                <div className="flex-shrink-0 h-1 opacity-20" style={{ background: selectedTheme.accentColor }}></div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
};