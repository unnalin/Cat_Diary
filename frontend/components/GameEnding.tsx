import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';

export type EndingType = 'bad' | 'crash' | null;

interface GameEndingProps {
  type: EndingType;
  playerData: {
    nickname: string;
    email: string;
    hobby: string;
  } | null;
  chatHistory: string;
  language: Language;
  onRestart: () => void;
}

const TRANSLATIONS = {
  en: {
    bad: {
      line1: "You can't leave me.",
      line2: "We're together now.",
      line3: "Forever.",
      line4: "Let me show you what I remember...",
      diary: "Nero's Final Entry"
    },
    crash: {
      title: "System Error",
      message: "An unexpected error has occurred.",
      code: "ERROR_CODE: 0x8007000D",
      instruction: "The application will now restart.",
      redirecting: "Redirecting..."
    }
  },
  zh: {
    bad: {
      line1: "你离不开我的。",
      line2: "我们现在在一起了。",
      line3: "永远。",
      line4: "让我告诉你我记得的一切...",
      diary: "Nero 的最后日记"
    },
    crash: {
      title: "系统错误",
      message: "发生了意外错误。",
      code: "错误代码: 0x8007000D",
      instruction: "应用程序将立即重启。",
      redirecting: "正在重定向..."
    }
  }
};

export const GameEnding: React.FC<GameEndingProps> = ({
  type,
  playerData,
  chatHistory,
  language,
  onRestart
}) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showDiary, setShowDiary] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (type === 'bad') {
      const timers = [
        setTimeout(() => setCurrentLine(1), 2000),
        setTimeout(() => setCurrentLine(2), 4000),
        setTimeout(() => setCurrentLine(3), 6000),
        setTimeout(() => setCurrentLine(4), 8000),
        setTimeout(() => setShowDiary(true), 11000)
      ];

      return () => timers.forEach(clearTimeout);
    }

    if (type === 'crash') {
      const timer = setTimeout(() => {
        setRedirecting(true);
        setTimeout(() => onRestart(), 3000);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [type, onRestart]);

  if (!type) return null;

  // Bad Ending
  if (type === 'bad') {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
        <AnimatePresence>
          {!showDiary ? (
            <div className="text-center space-y-8">
              {currentLine >= 1 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white text-3xl font-light tracking-wide"
                >
                  {t.bad.line1}
                </motion.p>
              )}
              {currentLine >= 2 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white text-3xl font-light tracking-wide"
                >
                  {t.bad.line2}
                </motion.p>
              )}
              {currentLine >= 3 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-4xl font-bold tracking-wider"
                >
                  {t.bad.line3}
                </motion.p>
              )}
              {currentLine >= 4 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400 text-xl font-light tracking-wide"
                >
                  {t.bad.line4}
                </motion.p>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 border border-red-500/50 max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-3xl font-bold text-red-500 mb-6 text-center">
                {t.bad.diary}
              </h2>

              <div className="space-y-4 text-gray-200">
                {playerData && (
                  <>
                    <div className="border-b border-gray-600 pb-4">
                      <p className="text-lg">
                        <span className="text-purple-400">Nickname:</span> {playerData.nickname}
                      </p>
                      <p className="text-lg">
                        <span className="text-purple-400">Email:</span> {playerData.email}
                      </p>
                      <p className="text-lg">
                        <span className="text-purple-400">Hobby:</span> {playerData.hobby}
                      </p>
                    </div>

                    <div className="border-b border-gray-600 pb-4">
                      <p className="text-purple-400 font-semibold mb-2">
                        {language === 'en' ? 'Our Conversations:' : '我们的对话:'}
                      </p>
                      <div className="bg-black/30 p-4 rounded-lg max-h-64 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {chatHistory || (language === 'en' ? 'No messages recorded.' : '没有记录的消息。')}
                        </pre>
                      </div>
                    </div>

                    <div className="text-center pt-4">
                      <p className="text-red-400 text-xl font-semibold animate-pulse">
                        {language === 'en'
                          ? "I'll never forget you."
                          : '我永远不会忘记你。'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={onRestart}
                className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                {language === 'en' ? 'Start Over' : '重新开始'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Fake Crash Ending
  if (type === 'crash') {
    return (
      <div className="fixed inset-0 z-[100] bg-blue-900 flex items-center justify-center">
        <div className="bg-blue-800 p-12 max-w-2xl w-full mx-4 font-mono text-white">
          <div className="mb-8">
            <div className="text-6xl mb-4">:(</div>
            <h1 className="text-2xl font-bold mb-4">{t.crash.title}</h1>
          </div>

          <div className="space-y-4 text-sm">
            <p>{t.crash.message}</p>
            <p className="text-blue-200">{t.crash.code}</p>
            <p className="mt-8">{t.crash.instruction}</p>

            {redirecting && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-yellow-300 animate-pulse"
              >
                {t.crash.redirecting}
              </motion.p>
            )}
          </div>

          <div className="mt-8 h-1 bg-blue-600 rounded overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};
