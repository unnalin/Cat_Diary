import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, CatAppearance, CatPersonality, CatSkin } from '../types';
import { PageBackground } from '../types';

interface RegistrationData {
  nickname: string;
  email: string;
  hobby: string;
}

interface RegistrationInterfaceProps {
  onComplete: (data: RegistrationData, appearance: CatAppearance) => void;
  language: Language;
  onLanguageChange: () => void;
}

const TRANSLATIONS = {
  en: {
    title: "Create Your Personal Nero",
    subtitle: "Let's get to know each other...",
    nickname: "Your Nickname",
    email: "Your Email",
    hobby: "Your Favorite Hobby",
    personality: "Nero's Personality",
    eyeColor: "Eye Color",
    collarColor: "Collar Color",
    bellColor: "Bell Color",
    begin: "Begin Your Journey",
    personalities: {
      aloof: "Aloof",
      chatty: "Chatty",
      gentle: "Gentle",
      tsundere: "Tsundere"
    }
  },
  zh: {
    title: "打造专属于你的 Nero",
    subtitle: "让我们互相了解一下...",
    nickname: "你的昵称",
    email: "你的邮箱",
    hobby: "你最喜欢的爱好",
    personality: "Nero 的性格",
    eyeColor: "眼睛颜色",
    collarColor: "项圈颜色",
    bellColor: "铃铛颜色",
    begin: "开始你的旅程",
    personalities: {
      aloof: "高冷",
      chatty: "话痨",
      gentle: "温柔",
      tsundere: "傲娇"
    }
  }
};

const EYE_COLORS = [
  { name: 'Forest Green', value: '#235D3A' },
  { name: 'Ocean Blue', value: '#1E40AF' },
  { name: 'Amber', value: '#D97706' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Red', value: '#DC2626' }
];

const COLLAR_COLORS = [
  { name: 'Forest Green', value: '#235D3A' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Black', value: '#000000' }
];

const BELL_COLORS = [
  { name: 'Gold', value: '#FFD700' },
  { name: 'Silver', value: '#C0C0C0' },
  { name: 'Bronze', value: '#CD7F32' },
  { name: 'Rose Gold', value: '#B76E79' }
];

export const RegistrationInterface: React.FC<RegistrationInterfaceProps> = ({
  onComplete,
  language,
  onLanguageChange
}) => {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [hobby, setHobby] = useState('');
  const [personality, setPersonality] = useState<CatPersonality>('gentle');
  const [eyeColor, setEyeColor] = useState('#235D3A');
  const [collarColor, setCollarColor] = useState('#235D3A');
  const [bellColor, setBellColor] = useState('#FFD700');

  const t = TRANSLATIONS[language];

  const handleSubmit = () => {
    const registrationData: RegistrationData = {
      nickname,
      email,
      hobby
    };

    const appearance: CatAppearance = {
      skin: CatSkin.BLACK,
      eyeColor,
      collarColor,
      bellColor,
      personality
    };

    onComplete(registrationData, appearance);
  };

  const canProceedStep1 = nickname.length >= 2;
  const canProceedStep2 = email.length >= 3 && hobby.length >= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-stone-200 via-neutral-100 to-amber-50">
      {/* Language Toggle Button */}
      <motion.button
        onClick={onLanguageChange}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-6 right-6 z-50 bg-white/80 backdrop-blur shadow-md rounded-full px-4 py-2 flex items-center gap-2 border border-stone-300 text-stone-700 hover:text-stone-900 transition-colors font-bold"
      >
        <span>{language === 'en' ? '中文' : 'EN'}</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-stone-50/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-2 border-stone-300"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl mb-4"
          >
            🐱
          </motion.div>
          <h1 className="text-3xl font-bold text-stone-700 mb-2">{t.title}</h1>
          <p className="text-stone-600 text-sm">{t.subtitle}</p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-12 rounded-full transition-colors ${
                s === step ? 'bg-stone-500' : s < step ? 'bg-stone-400' : 'bg-stone-300'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    {t.nickname}
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border-2 border-stone-300 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent"
                    placeholder="..."
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="w-full py-3 bg-stone-600 hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-md"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: More Info */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border-2 border-stone-300 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent"
                    placeholder="..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    {t.hobby}
                  </label>
                  <input
                    type="text"
                    value={hobby}
                    onChange={(e) => setHobby(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border-2 border-stone-300 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent"
                    placeholder="..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 bg-stone-300 hover:bg-stone-400 text-stone-800 font-semibold rounded-lg transition-colors shadow-md"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className="flex-1 py-3 bg-stone-600 hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-md"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Customization */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Personality */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {t.personality}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['aloof', 'chatty', 'gentle', 'tsundere'] as CatPersonality[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPersonality(p)}
                      className={`py-2 px-4 rounded-lg font-medium transition-colors shadow-md ${
                        personality === p
                          ? 'bg-stone-600 text-white'
                          : 'bg-white/90 text-stone-700 hover:bg-stone-100 border-2 border-stone-300'
                      }`}
                    >
                      {t.personalities[p]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eye Color */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {t.eyeColor}
                </label>
                <div className="flex gap-2">
                  {EYE_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setEyeColor(color.value)}
                      className={`w-10 h-10 rounded-full border-2 transition-all shadow-md ${
                        eyeColor === color.value ? 'border-stone-700 scale-110 ring-2 ring-stone-400' : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Collar Color */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {t.collarColor}
                </label>
                <div className="flex gap-2">
                  {COLLAR_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setCollarColor(color.value)}
                      className={`w-10 h-10 rounded-full border-2 transition-all shadow-md ${
                        collarColor === color.value ? 'border-stone-700 scale-110 ring-2 ring-stone-400' : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Bell Color */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {t.bellColor}
                </label>
                <div className="flex gap-2">
                  {BELL_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBellColor(color.value)}
                      className={`w-10 h-10 rounded-full border-2 transition-all shadow-md ${
                        bellColor === color.value ? 'border-stone-700 scale-110 ring-2 ring-stone-400' : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-stone-300 hover:bg-stone-400 text-stone-800 font-semibold rounded-lg transition-colors shadow-md"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-gradient-to-r from-stone-600 to-neutral-700 hover:from-stone-700 hover:to-neutral-800 text-white font-semibold rounded-lg transition-colors shadow-md"
                >
                  {t.begin}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
