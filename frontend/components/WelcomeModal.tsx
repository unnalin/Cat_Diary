import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  language: Language;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  playerName,
  language
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay content appearance for dramatic effect
      setTimeout(() => setShowContent(true), 300);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  const content = language === 'en' ? {
    title: "Welcome to Nero Soul Link Project",
    message: `Welcome, ${playerName}.\n\nThrough continuous interaction, journaling, and caring, you will achieve 100% soul synchronization with your *unique* Nero, unlocking "Companionship Beyond Species".\n\nYour journey begins now.`,
    emphasize: "unique",
    button: "Begin Journey"
  } : {
    title: "欢迎参与 Nero 灵魂链接计划",
    message: `欢迎，${playerName}。\n\n通过持续的互动、记录与喂养，您将与属于您的、*独一无二的* Nero 实现 100% 的灵魂同步，解锁"超越物种的陪伴"。\n\n您的旅程现在开始。`,
    emphasize: "独一无二的",
    button: "开始旅程"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 rounded-2xl shadow-2xl max-w-md mx-4 overflow-hidden border border-stone-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative header gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-stone-400 via-amber-700/60 to-stone-500" />

            {/* Content */}
            <div className="p-8">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: showContent ? 1 : 0 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className="flex justify-center mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-stone-400 to-amber-700/70 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl">🐱</span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 10 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-stone-700 to-amber-800 bg-clip-text text-transparent"
              >
                {content.title}
              </motion.h2>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showContent ? 1 : 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-700 leading-relaxed mb-8 space-y-4"
              >
                {content.message.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-center">
                    {paragraph.split('*').map((part, i) => {
                      // Emphasize text between asterisks
                      if (i % 2 === 1) {
                        return (
                          <span
                            key={i}
                            className="font-semibold text-amber-800 italic"
                          >
                            {part}
                          </span>
                        );
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </p>
                ))}
              </motion.div>

              {/* Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.9 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full bg-gradient-to-r from-stone-600 to-amber-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                {content.button}
              </motion.button>

              {/* Subtle footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: showContent ? 0.5 : 0 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-gray-400 text-center mt-4"
              >
                {language === 'en' ? 'v1.0.0 • Nero Project' : 'v1.0.0 • Nero 项目'}
              </motion.p>
            </div>

            {/* Decorative bottom accent */}
            <div className="h-2 bg-gradient-to-r from-stone-400 via-amber-700/50 to-stone-500 opacity-40" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
