import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';

interface FakeErrorPageProps {
  onComplete: () => void;
  language: Language;
}

const TRANSLATIONS = {
  en: {
    title: 'Connection Error',
    errorCode: 'NS_ERROR_NET_RESET',
    message: 'The connection to the server was reset while the page was loading.',
    details: 'The site could be temporarily unavailable or too busy. Try again in a few moments.',
    reinitializing: 'Re-initializing connection...',
    loading: 'Loading',
    tryAgain: 'Try Again'
  },
  zh: {
    title: '连接错误',
    errorCode: 'NS_ERROR_NET_RESET',
    message: '加载页面时与服务器的连接被重置。',
    details: '该网站可能暂时不可用或太忙。请稍后重试。',
    reinitializing: '正在重新初始化连接...',
    loading: '加载中',
    tryAgain: '重试'
  }
};

export const FakeErrorPage: React.FC<FakeErrorPageProps> = ({
  onComplete,
  language
}) => {
  const [progress, setProgress] = useState(0);
  const [showRetry, setShowRetry] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const t = TRANSLATIONS[language];

  useEffect(() => {
    // Show retry button after 1.5 seconds
    const retryTimer = setTimeout(() => {
      setShowRetry(true);
    }, 1500);

    // Start progress after 3 seconds
    const progressTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Complete after progress reaches 100%
            setTimeout(() => onComplete(), 300);
            return 100;
          }
          // Faster increment for ~0.5s total duration
          return prev + Math.random() * 80 + 40;
        });
      }, 50);

      return () => clearInterval(interval);
    }, 3000);

    return () => {
      clearTimeout(retryTimer);
      clearTimeout(progressTimer);
    };
  }, [startTime, onComplete]);

  const handleRetry = () => {
    // Reset progress and restart timers
    setProgress(0);
    setShowRetry(false);
    setStartTime(Date.now());
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0c0c0d] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto px-8 text-center"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-8"
        >
          <svg
            className="w-24 h-24 mx-auto text-[#0060df]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </motion.div>

        {/* Error Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-light text-white mb-4"
        >
          {t.title}
        </motion.h1>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-block bg-[#38383d] text-[#0060df] px-4 py-1 rounded text-sm font-mono mb-6"
        >
          {t.errorCode}
        </motion.div>

        {/* Error Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#b1b1b3] text-lg mb-4"
        >
          {t.message}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[#8f8f9d] text-sm mb-8"
        >
          {t.details}
        </motion.p>

        {/* Try Again Button */}
        {showRetry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <button
              onClick={handleRetry}
              className="bg-[#0060df] hover:bg-[#0250bb] text-white px-8 py-3 rounded font-semibold transition-colors"
            >
              {t.tryAgain}
            </button>
          </motion.div>
        )}

        {/* Loading Progress */}
        {progress > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              {/* Spinning loader */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-[#0060df] border-t-transparent rounded-full"
              />
              <p className="text-[#b1b1b3] text-sm">
                {t.reinitializing}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto bg-[#38383d] rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-[#0060df]"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Progress Percentage */}
            <p className="text-[#8f8f9d] text-xs mt-2">
              {Math.round(progress)}%
            </p>
          </motion.div>
        )}

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-8 border-t border-[#38383d]"
        >
          <p className="text-[#8f8f9d] text-xs">
            {language === 'en'
              ? 'If the problem persists, please contact the site administrator.'
              : '如果问题仍然存在，请联系网站管理员。'}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
