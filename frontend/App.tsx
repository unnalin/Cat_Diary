import React, { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import { motion } from 'framer-motion';
import { BlackCat } from './components/BlackCat';
import { CatTree } from './components/CatTree';
import { YarnCursor } from './components/YarnCursor';
import { ChatInterface } from './components/ChatInterface';
import { DiaryBook, DIARY_THEMES } from './components/DiaryBook';
import { CatCustomizer } from './components/CatCustomizer';
import { CatState, ChatMessage, DiaryEntry, Mood, CatAppearance, CatSkin, Language } from './types';

// Enhanced mood logic with Multilingual Support (English & Chinese)
// Self-Correction: Order matters! Negative/Specific moods must be checked before generic positive ones.
const analyzeMood = (text: string): Mood => {
  const lower = text.toLowerCase();
  
  const matches = (keywords: string[]) => keywords.some(k => lower.includes(k));

  // 1. High Priority: Negative & Low Energy
  
  // Angry / 生气
  if (matches(['hate', 'angry', 'furious', 'annoyed', 'mad', 'irritated', '生气', '愤怒', '讨厌', '烦', '恨', '滚', '怒', '气死', '妈的', '靠', '烦躁', '火大', '没用', '垃圾', '有病', '傻逼'])) return 'angry';
  
  // Sad / 难过
  if (matches(['sad', 'bad', 'cry', 'depressed', 'lonely', 'upset', 'grief', 'down', '难过', '伤心', '哭', '郁闷', '孤独', '不开心', '惨', '痛苦', '呜', '失望', '心碎', '低落', '不好', '想哭', '糟糕', '完蛋'])) return 'sad';
  
  // Tired / 累
  if (matches(['tired', 'sleep', 'exhausted', 'busy', 'weary', 'drained', 'fatigue', '累', '困', '睡觉', '疲惫', '忙', '休息', '乏', '没劲', '想睡', '心累', '折磨', '无力', '瘫'])) return 'tired';
  
  // Confused / 困惑
  if (matches(['?', 'what', 'confused', 'weird', 'why', 'huh', '什么', '啥', '奇怪', '困惑', '懵', '为什么', '？', '怎么', '不懂', '纳闷', '无语', '呃', '额'])) return 'confused';
  
  // 2. Low Priority: Positive
  
  // Excited / 兴奋
  if (matches(['wow', 'love', 'amazing', 'excited', 'yay', 'omg', 'cool', '兴奋', '哇', '激动', '爱', '惊喜', '耶', '太棒', '牛', '厉害', '期待', '绝了', '刺激', '带感', '燃', 'yyds'])) return 'excited';
  
  // Happy / 开心
  // Expanded list to catch missing common terms like '高兴', '太好', etc.
  if (matches([
    'happy', 'great', 'good', 'joy', 'awesome', 'nice', 'glad', 'fun', 
    '开心', '快乐', '棒', '喜欢', '赞', '哈哈', '嘿嘿', '不错', '舒服', '美好', '很好', 
    '愉快', '顺心', '安逸', '高兴', '幸福', '满足', '爽', '太好', '真好', '挺好', '蛮好', 
    '喜悦', '完美', '好玩', '嘻嘻', '笑', '有趣', '给力', '优秀', '好耶', '欣慰', '美滋滋'
  ])) return 'happy';
  
  return 'calm';
};

const TRANSLATIONS = {
  en: {
    customizer: {
      button: "Style Cat",
      title: "Style Your Cat",
      accessories: "Accessories",
      eyeColor: "Eye Color",
      collarColor: "Collar Color",
      bellColor: "Bell Color",
      saved: "Changes are saved automatically."
    },
    chat: {
      header: "Nero's Log",
      save: "Save to Diary",
      placeholder: "Type a message...",
      empty: "Meow? Tell me about your day...",
      connectionError: "Hiss! Something went wrong with my connection. 😿",
      diarySaved: "I've scratched that into your diary! 📖 Shall we start a new page?",
      initMessage: "Prrr... Hi there! I'm Nero. How are you feeling today? 🐾",
      brainWaking: "Meow... (My brain is still waking up, try again in a second!) 💤"
    },
    diary: {
      title: "Settings & Moods",
      coverStyle: "Cover Style",
      recentVibe: "Recent Vibe",
      quote: "Every day is a new page.",
      entriesTitle: "Journal Entries",
      total: "Total",
      noMemories: "No memories yet.",
      chatToEntry: "Chat with Nero to add an entry.",
      label: "Diary"
    },
    moods: {
      happy: "Happy",
      sad: "Sad",
      calm: "Calm",
      excited: "Excited",
      tired: "Tired",
      angry: "Angry",
      confused: "Confused",
      neutral: "Neutral"
    }
  },
  zh: {
    customizer: {
      button: "定制你的咪",
      title: "定制你的咪",
      accessories: "配饰",
      eyeColor: "眼睛颜色",
      collarColor: "项圈颜色",
      bellColor: "铃铛颜色",
      saved: "更改会自动保存"
    },
    chat: {
      header: "Nero 的记录",
      save: "保存到日记",
      placeholder: "输入消息...",
      empty: "喵？告诉我你今天过得怎么样...",
      connectionError: "嘶！我的连接出问题了。 😿",
      diarySaved: "我已经把它抓进日记里了！📖 我们开始新的一页吗？",
      initMessage: "呼噜... 嗨！我是 Nero。你今天感觉怎么样？🐾",
      brainWaking: "喵... (我的脑子还在醒盹，稍等一下再试！) 💤"
    },
    diary: {
      title: "设置与心情",
      coverStyle: "封面风格",
      recentVibe: "近期氛围",
      quote: "每一天都是新的一页。",
      entriesTitle: "日记条目",
      total: "总计",
      noMemories: "还没有记忆。",
      chatToEntry: "和 Nero 聊天来添加条目",
      label: "日记"
    },
    moods: {
      happy: "开心",
      sad: "难过",
      calm: "平静",
      excited: "兴奋",
      tired: "累",
      angry: "生气",
      confused: "困惑",
      neutral: "中性"
    }
  }
};

// LocalStorage Keys
const STORAGE_KEYS = {
  DIARY_ENTRIES: 'nero_diary_entries',
  CAT_APPEARANCE: 'nero_cat_appearance',
  THEME_ID: 'nero_theme_id',
  LANGUAGE: 'nero_language'
};

// Helper functions for localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export default function App() {
  const [catState, setCatState] = useState<CatState>(CatState.IDLE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Load initial state from localStorage
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() =>
    loadFromStorage(STORAGE_KEYS.DIARY_ENTRIES, [])
  );
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState(() =>
    loadFromStorage(STORAGE_KEYS.THEME_ID, DIARY_THEMES[0].id)
  );
  const [language, setLanguage] = useState<Language>(() =>
    loadFromStorage(STORAGE_KEYS.LANGUAGE, 'en')
  );

  // Customization State
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [catAppearance, setCatAppearance] = useState<CatAppearance>(() =>
    loadFromStorage(STORAGE_KEYS.CAT_APPEARANCE, {
      skin: CatSkin.BLACK,
      eyeColor: '#235D3A', // Forest Green
      collarColor: '#235D3A', // Forest Green
      bellColor: '#FFD700'
    })
  );

  // AI Chat Session Reference
  const chatSessionRef = useRef<OpenAI | null>(null);
  const conversationHistory = useRef<Array<{role: 'system' | 'user' | 'assistant', content: string}>>([]);

  // Auto-save to localStorage when data changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DIARY_ENTRIES, diaryEntries);
  }, [diaryEntries]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CAT_APPEARANCE, catAppearance);
  }, [catAppearance]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.THEME_ID, activeThemeId);
  }, [activeThemeId]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  // Initialize AI Chat
  useEffect(() => {
    const initChat = async () => {
      try {
        chatSessionRef.current = new OpenAI({
          apiKey: 'is-secure-hidden',
          baseURL: window.location.origin + '/api/v1', 
          dangerouslyAllowBrowser: true // 允许在浏览器中使用
        });

        // 初始化系统提示词
        conversationHistory.current = [{
          role: 'system',
          content: `You are Nero, a sentient, witty, and slightly mysterious cat living in a digital notebook.
          - You speak with cat puns (purr-fect, meow, hissterical).
          - You use emojis like 🐾, 😺, 🧶, 🐟 frequently.
          - You are empathetic but maintain a cat-like aloofness. You care about the user's mood.
          - Keep your responses concise (under 150 words) unless asked for a story.
          - If the user seems sad, offer comfort (and maybe a virtual dead mouse).
          - Never break character. You are a cat.
          - IMPORTANT: You MUST respond in ${language === 'en' ? 'English' : 'Chinese (Simplified)'} regardless of the user's input language, unless asked to translate.`
        }];
      } catch (error) {
        console.error("Failed to initialize AI:", error);
      }
    };

    initChat();

    // Initial greeting message (Frontend only, doesn't need API)
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          id: 'init-1',
          sender: 'cat',
          text: TRANSLATIONS[language].chat.initMessage,
          timestamp: Date.now()
        }]);
      }, 1000);
    }
  }, [language]); // Re-run when language changes to update system instruction

  const handleSendMessage = async (text: string) => {
    // 1. Add user message immediately
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Dynamic reaction based on user input
    const currentMood = analyzeMood(text);
    if (currentMood === 'sad' || currentMood === 'angry' || currentMood === 'tired') {
      setCatState(CatState.SAD);
    } else {
      setCatState(CatState.LOVED);
    }

    try {
      // 2. Generate AI Response
      let responseText = TRANSLATIONS[language].chat.brainWaking;

      if (chatSessionRef.current) {
        // 添加用户消息到对话历史
        conversationHistory.current.push({
          role: 'user',
          content: text
        });

        // 调用硅基流动 API (OpenAI 兼容)
        const completion = await chatSessionRef.current.chat.completions.create({
          model: 'Qwen/Qwen2-7B-Instruct',
          messages: conversationHistory.current,
          temperature: 0.8,
          max_tokens: 300
        });

        responseText = completion.choices[0]?.message?.content || TRANSLATIONS[language].chat.brainWaking;

        // 添加 AI 回复到对话历史
        conversationHistory.current.push({
          role: 'assistant',
          content: responseText
        });
      }

      // 3. Add Cat Response
      const catMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'cat',
        text: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, catMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'cat',
        text: TRANSLATIONS[language].chat.connectionError,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      // Return to idle state after a short delay
      setTimeout(() => setCatState(CatState.IDLE), 3000); // Strictly 3 seconds for SAD/LOVED state
    }
  };

  const handleSaveDiary = () => {
    if (messages.length <= 1) return;

    // Compile chat into a diary entry
    const userMessages = messages.filter(m => m.sender === 'user').map(m => m.text).join(' ');
    const mood = analyzeMood(userMessages);
    
    // Create entry
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: mood,
      content: userMessages.substring(0, 300) + (userMessages.length > 300 ? '...' : ''), // Simple truncation for summary
      themeId: activeThemeId
    };

    setDiaryEntries(prev => [newEntry, ...prev]);
    
    // Reset Chat but DO NOT open diary. 
    // IMPORTANT: Ensuring isDiaryOpen logic is not touched here prevents the chat box from shifting.
    setMessages([{
      id: Date.now().toString(),
      sender: 'cat',
      text: TRANSLATIONS[language].chat.diarySaved,
      timestamp: Date.now()
    }]);

    setCatState(CatState.SURPRISED); // Happy surprise reaction
    setTimeout(() => setCatState(CatState.IDLE), 2000);

    // Re-initialize conversation history for new diary page
    conversationHistory.current = [{
      role: 'system',
      content: `You are Nero, a sentient, witty, and slightly mysterious black cat. Continue to be helpful and cat-like. The user just started a new diary page. Keep responses under 150 words. Respond in ${language === 'en' ? 'English' : 'Chinese (Simplified)'}.`
    }];
  };

  const handleInteract = () => {
    // Restore interactions: Randomly pick between Walking, Surprised, Loved.
    // REMOVED CatState.SAD to prevent "surprise tears" confusion.
    const interactions = [CatState.WALKING, CatState.SURPRISED, CatState.LOVED];
    const randomState = interactions[Math.floor(Math.random() * interactions.length)];
    
    setCatState(randomState);
    
    // Reset to idle after animation duration
    const duration = randomState === CatState.WALKING ? 3000 : 2000;
    setTimeout(() => setCatState(CatState.IDLE), duration);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row items-center justify-center relative overflow-hidden selection:bg-yellow-200">
      <YarnCursor />

      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 overflow-hidden">
         <div className="absolute top-10 left-10 text-9xl animate-pulse">🐾</div>
         <div className="absolute bottom-20 right-1/3 text-9xl">🧶</div>
         <div className="absolute top-1/2 left-20 text-8xl rotate-12">🐟</div>
      </div>

      {/* Language Toggle Button */}
      <motion.button
        onClick={toggleLanguage}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-6 right-6 z-40 bg-white/80 backdrop-blur shadow-md rounded-full px-4 py-2 flex items-center gap-2 border border-white/50 text-gray-700 hover:text-black transition-colors cursor-pointer font-bold"
      >
        <span>{language === 'en' ? '中文' : 'EN'}</span>
      </motion.button>

      {/* Customizer Toggle Button */}
      {!isDiaryOpen && (
        <motion.button
          onClick={() => setIsCustomizerOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          // Added cursor-pointer to be explicit
          className="absolute top-6 left-6 z-40 bg-white/80 backdrop-blur shadow-md rounded-full px-4 py-2 flex items-center gap-2 border border-white/50 text-gray-700 hover:text-black transition-colors cursor-pointer"
        >
          <span className="text-xl">🎨</span>
          <span className="text-sm font-bold">{t.customizer.button}</span>
        </motion.button>
      )}

      {/* Main Layout: Cat and Tree on Left/Center, Chat on Right */}
      <div className="z-10 relative w-full h-screen flex flex-col md:flex-row items-center justify-center">
        
        {/* Cat Scene Container (Tree + Cat) */}
        {/* Adjusted: Moved container right by 30px (from -274px to -244px) */}
        <div className={`transition-all duration-500 transform flex items-end ${isDiaryOpen ? 'md:-translate-x-64 scale-90' : 'md:-translate-x-[244px]'}`}>
          
          {/* Cat Tree (Left of Cat) */}
          <div className="hidden md:block -mr-16 mb-20 z-0 scale-90 -translate-x-[50px]">
             <CatTree />
          </div>

          {/* The Cat */}
          <div className="z-10">
            <BlackCat 
              catState={catState} 
              onInteract={handleInteract}
              appearance={catAppearance}
            />
          </div>
        </div>

        {/* Chat Interface - Only show if diary is closed for cleaner UI */}
        <div className={`transition-all duration-500 ${isDiaryOpen ? 'opacity-0 pointer-events-none translate-x-96' : 'opacity-100 translate-x-[370px]'}`}>
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            onSaveDiary={handleSaveDiary}
            isTyping={isTyping}
            text={t.chat}
          />
        </div>
      </div>

      {/* The Interactive Diary */}
      <DiaryBook 
        isOpen={isDiaryOpen}
        onOpen={() => setIsDiaryOpen(true)}
        onClose={() => setIsDiaryOpen(false)}
        entries={diaryEntries}
        activeThemeId={activeThemeId}
        onThemeChange={setActiveThemeId}
        text={t.diary}
        moodText={t.moods}
      />

      {/* Customizer Panel */}
      <CatCustomizer 
        isOpen={isCustomizerOpen} 
        onClose={() => setIsCustomizerOpen(false)} 
        appearance={catAppearance}
        onChange={setCatAppearance}
        text={t.customizer}
      />

      {/* Simple Footer/Credits */}
      <div className="absolute bottom-2 text-gray-400 text-xs text-center w-full pb-2 z-0">
        Nero's Mood Diary • Built with React & Framer Motion
      </div>
    </div>
  );
}