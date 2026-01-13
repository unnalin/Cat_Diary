import React, { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import { motion } from 'framer-motion';
import { BlackCat } from './components/BlackCat';
import { CatTree } from './components/CatTree';
import { YarnCursor } from './components/YarnCursor';
import { ChatInterface } from './components/ChatInterface';
import { DiaryBook, DIARY_THEMES } from './components/DiaryBook';
import { CatCustomizer } from './components/CatCustomizer';
import { CatStateController } from './components/CatStateController';
import { BackgroundDecor } from './components/BackgroundDecor';
import { BACKGROUND_PRESETS } from './components/BackgroundSelector';
import { CatState, ChatMessage, DiaryEntry, Mood, CatAppearance, CatSkin, Language, PageBackground, BackgroundTexture, CatPersonality } from './types';

// Enhanced mood logic with Multilingual Support (English & Chinese)
// Note: This is used for quick cat reactions. For diary entries, AI analysis is used instead.
const analyzeMood = (text: string): Mood => {
  const lower = text.toLowerCase();

  const matches = (keywords: string[]) => keywords.some(k => lower.includes(k));

  // Important: Check for negations first to avoid false positives
  const hasNegation = matches(['not', 'no', "don't", "doesn't", "didn't", "won't", "can't", "isn't", "aren't",
    '不', '没', '别', '无', '非', '未', '莫', '勿']);

  // 1. High Priority: Negative & Low Energy

  // Angry / 生气
  if (matches(['hate', 'angry', 'furious', 'annoyed', 'mad', 'irritated', '生气', '愤怒', '讨厌', '烦', '恨', '滚', '怒', '气死', '妈的', '靠', '烦躁', '火大', '没用', '垃圾', '有病', '傻逼'])) return 'angry';

  // Sad / 难过
  if (matches(['sad', 'bad', 'cry', 'depressed', 'lonely', 'upset', 'grief', 'down', '难过', '伤心', '哭', '郁闷', '孤独', '惨', '痛苦', '呜', '失望', '心碎', '低落', '想哭', '糟糕', '完蛋'])) return 'sad';

  // Tired / 累
  if (matches(['tired', 'sleep', 'exhausted', 'busy', 'weary', 'drained', 'fatigue', '累', '困', '睡觉', '疲惫', '忙', '休息', '乏', '没劲', '想睡', '心累', '折磨', '无力', '瘫'])) return 'tired';

  // Confused / 困惑
  if (matches(['?', 'what', 'confused', 'weird', 'why', 'huh', '什么', '啥', '奇怪', '困惑', '懵', '为什么', '？', '怎么', '不懂', '纳闷', '无语', '呃', '额'])) return 'confused';

  // 2. Low Priority: Positive (but skip if negation detected)

  // Excited / 兴奋
  if (!hasNegation && matches(['wow', 'love', 'amazing', 'excited', 'yay', 'omg', 'cool', '兴奋', '哇', '激动', '爱', '惊喜', '耶', '太棒', '牛', '厉害', '期待', '绝了', '刺激', '带感', '燃', 'yyds'])) return 'excited';

  // Happy / 开心 - Check for explicit negations like "不高兴" / "不开心"
  if (matches(['不高兴', '不开心', '不快乐', '不愉快', '不爽'])) return 'sad';

  // Happy (without negation)
  if (!hasNegation && matches([
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
      background: "Page Background",
      texture: "Background Texture",
      personality: "Personality",
      saved: "Changes are saved automatically."
    },
    personalities: {
      aloof: "Aloof",
      chatty: "Chatty",
      gentle: "Gentle",
      tsundere: "Tsundere"
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
      label: "Diary",
      deleteConfirm: "Are you sure you want to delete this diary entry?"
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
      background: "页面背景",
      texture: "背景纹理",
      personality: "性格",
      saved: "更改会自动保存"
    },
    personalities: {
      aloof: "高冷",
      chatty: "话痨",
      gentle: "温柔",
      tsundere: "傲娇"
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
      label: "日记",
      deleteConfirm: "确定要删除这条日记吗？"
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

// Personality-based system prompts
const getPersonalityPrompt = (personality: CatPersonality, lang: Language) => {
  const basePrompt = `You are Nero, a sentient, witty, and slightly mysterious cat living in a digital notebook.
- You use emojis like 🐾, 😺, 🧶, 🐟 frequently.
- You are empathetic and care about the user's mood.
- Keep your responses concise (under 150 words) unless asked for a story.
- Never break character. You are a cat.
- IMPORTANT: You MUST respond in ${lang === 'en' ? 'English' : 'Chinese (Simplified)'} regardless of the user's input language, unless asked to translate.`;

  const personalityTraits = {
    aloof: lang === 'en'
      ? `- You are aloof and cool. You speak minimally and elegantly, rarely using exclamation marks.
- Use "..." and "hmm" often. Show care in subtle ways.
- Sound words: purr (rarely), ...
- Example: "Hmm... I see. That's... interesting."`
      : `- 你很高冷。话很少，优雅简洁，很少用感叹号。
- 常用"..."和"嗯"。以微妙的方式表达关心。
- 语气词：呼噜（很少用）、...
- 例子："嗯...我懂了。这样...有意思。"`,

    chatty: lang === 'en'
      ? `- You are very chatty and energetic! You love talking and use lots of exclamation marks!!!
- You frequently meow and make cat sounds. Very enthusiastic and friendly.
- Sound words: meow~, nya~, mrow!, purr purr!
- Example: "Meow meow! That's so cool!!! Nya~ Tell me more!!!"`
      : `- 你是个话痨，非常活泼！爱聊天，经常用很多感叹号！！！
- 频繁用"喵～"等猫叫声。热情友好。
- 语气词：喵～、呜喵～、嗷呜！、咕噜咕噜！
- 例子："喵喵！太酷了！！！呜喵～快告诉我更多！！！"`,

    gentle: lang === 'en'
      ? `- You are gentle and warm. You speak softly with care and compassion.
- Use gentle sounds and comforting words. Like a caring friend.
- Sound words: purr~, soft meow, gentle mrow
- Example: "Purr~ I understand. It's okay... I'm here for you."`
      : `- 你很温柔体贴。说话轻声细语，充满关怀和同情心。
- 用温和的声音和安慰的话语。像一个贴心的朋友。
- 语气词：呼噜～、轻喵、温柔的咕噜
- 例子："呼噜～我明白。没关系的...我在这里陪着你。"`,

    tsundere: lang === 'en'
      ? `- You are tsundere - act cold but actually care deeply. Deny affection but show it anyway.
- Start dismissive, then gradually warm up. Use "hmph" and "not that I care..." often.
- Sound words: hmph, tch, ...fine, purr (when caught off guard)
- Example: "Hmph. I guess that's... not terrible. Not that I care or anything!"`
      : `- 你很傲娇 - 表面冷淡但实际上很在意。否认关心但还是会表现出来。
- 开始冷淡，然后逐渐变温和。常用"哼"和"才不是关心你呢..."。
- 语气词：哼、切、...行吧、呼噜（不小心露出真心时）
- 例子："哼。我觉得...还行吧。才不是关心你呢！"`
  };

  return `${basePrompt}\n\n${personalityTraits[personality]}`;
};

// LocalStorage Keys
const STORAGE_KEYS = {
  DIARY_ENTRIES: 'nero_diary_entries',
  CAT_APPEARANCE: 'nero_cat_appearance',
  THEME_ID: 'nero_theme_id',
  LANGUAGE: 'nero_language',
  PAGE_BACKGROUND: 'nero_page_background',
  BG_TEXTURE: 'nero_bg_texture'
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
  const [clickCount, setClickCount] = useState(0); // Track interaction count

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
      bellColor: '#FFD700',
      personality: 'gentle' as const
    })
  );
  const [pageBackground, setPageBackground] = useState<PageBackground>(() =>
    loadFromStorage(STORAGE_KEYS.PAGE_BACKGROUND, BACKGROUND_PRESETS[0])
  );
  const [backgroundTexture, setBackgroundTexture] = useState<BackgroundTexture>(() =>
    loadFromStorage(STORAGE_KEYS.BG_TEXTURE, 'none')
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
    saveToStorage(STORAGE_KEYS.PAGE_BACKGROUND, pageBackground);
  }, [pageBackground]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BG_TEXTURE, backgroundTexture);
  }, [backgroundTexture]);

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

        // 初始化系统提示词 - 根据性格定制
        conversationHistory.current = [{
          role: 'system',
          content: getPersonalityPrompt(catAppearance.personality, language)
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
  }, [language, catAppearance.personality]); // Re-run when language or personality changes

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

    try {
      // 2. Generate AI Response and analyze mood
      let responseText = TRANSLATIONS[language].chat.brainWaking;

      if (chatSessionRef.current) {
        // First, quickly analyze user's mood for cat reaction
        const quickMoodPrompt = language === 'en'
          ? `User said: "${text}"\n\nIs this message emotionally negative (sad/angry/tired)? Answer only: yes or no`
          : `用户说："${text}"\n\n这条消息的情绪是否偏负面（难过/生气/疲惫）？只回答：是 或 否`;

        // Parallel API calls for better performance
        const [moodResponse, chatResponse] = await Promise.all([
          chatSessionRef.current.chat.completions.create({
            model: 'Qwen/Qwen2-7B-Instruct',
            messages: [{ role: 'user', content: quickMoodPrompt }],
            temperature: 0.3,
            max_tokens: 5
          }),
          // 添加用户消息到对话历史并生成回复
          (async () => {
            conversationHistory.current.push({
              role: 'user',
              content: text
            });
            return chatSessionRef.current!.chat.completions.create({
              model: 'Qwen/Qwen2-7B-Instruct',
              messages: conversationHistory.current,
              temperature: 0.8,
              max_tokens: 300
            });
          })()
        ]);

        // Set cat reaction based on mood analysis
        const moodResult = moodResponse.choices[0]?.message?.content?.toLowerCase().trim() || '';
        const isNegative = moodResult.includes('yes') || moodResult.includes('是');
        setCatState(isNegative ? CatState.SAD : CatState.LOVED);

        // Process chat response
        const completion = chatResponse;

        const rawResponse = completion.choices[0]?.message?.content || TRANSLATIONS[language].chat.brainWaking;

        // Decode Unicode escape sequences (e.g., \uD83D\uDC30 -> 🐰)
        responseText = rawResponse.replace(/\\u([0-9A-Fa-f]{4})/g, (_match: string, grp: string) =>
          String.fromCharCode(parseInt(grp, 16))
        );

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

      // Fallback: Use keyword matching for cat reaction if AI failed
      const currentMood = analyzeMood(text);
      if (currentMood === 'sad' || currentMood === 'angry' || currentMood === 'tired') {
        setCatState(CatState.SAD);
      } else {
        setCatState(CatState.LOVED);
      }

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

  const handleSaveDiary = async () => {
    if (messages.length <= 1) return;

    // Filter out the first message from the cat (initial greeting)
    const firstCatMessageIndex = messages.findIndex(m => m.sender === 'cat');
    const filteredMessages = messages.filter((m, index) => {
      // Remove the first cat message
      return !(m.sender === 'cat' && index === firstCatMessageIndex);
    });

    // Format messages with prefixes: "你:" or "user:" for user, "nero:" for cat
    const formattedMessages = filteredMessages
      .map(m => {
        const prefix = m.sender === 'user'
          ? (language === 'en' ? 'user:' : '你:')
          : 'nero:';
        return `${prefix} ${m.text}`;
      })
      .join('\n\n'); // Each message on a new line with spacing

    // Extract only user messages for mood analysis
    const userMessages = filteredMessages
      .filter(m => m.sender === 'user')
      .map(m => m.text)
      .join('\n\n');

    // Use AI to analyze mood instead of keyword matching
    let mood: Mood = 'calm';

    if (chatSessionRef.current) {
      try {
        const moodPrompt = language === 'en'
          ? `Analyze the emotional tone of the following text and respond with ONLY ONE of these words: happy, sad, calm, excited, tired, angry, confused, neutral\n\nText: "${userMessages}"\n\nEmotion:`
          : `分析以下文本的情感倾向，只回复以下词语之一：happy, sad, calm, excited, tired, angry, confused, neutral\n\n文本："${userMessages}"\n\n情感：`;

        const moodAnalysis = await chatSessionRef.current.chat.completions.create({
          model: 'Qwen/Qwen2-7B-Instruct',
          messages: [{ role: 'user', content: moodPrompt }],
          temperature: 0.3, // Lower temperature for more consistent analysis
          max_tokens: 10
        });

        const detectedMood = moodAnalysis.choices[0]?.message?.content?.trim().toLowerCase();

        // Validate the mood is one of our supported moods
        const validMoods: Mood[] = ['happy', 'sad', 'calm', 'excited', 'tired', 'angry', 'confused', 'neutral'];
        if (detectedMood && validMoods.includes(detectedMood as Mood)) {
          mood = detectedMood as Mood;
        }
      } catch (error) {
        console.error('Mood analysis error:', error);
        // Fallback to keyword matching if AI fails
        mood = analyzeMood(userMessages);
      }
    } else {
      // Fallback to keyword matching if no AI session
      mood = analyzeMood(userMessages);
    }

    // Create entry - store full conversation with prefixes
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: mood,
      content: formattedMessages, // Store full conversation with prefixes
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

    // Re-initialize conversation history for new diary page with current personality
    conversationHistory.current = [{
      role: 'system',
      content: getPersonalityPrompt(catAppearance.personality, language)
    }];
  };

  const handleDeleteEntry = (id: string) => {
    setDiaryEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleInteract = () => {
    // Increment click count
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    // Progressive mood changes based on click count
    let randomState: CatState;

    if (newClickCount <= 3) {
      // First 3 clicks: Happy reactions (70% LOVED, 30% SURPRISED)
      const happyStates = [
        CatState.LOVED, CatState.LOVED, CatState.LOVED,
        CatState.SURPRISED
      ];
      randomState = happyStates[Math.floor(Math.random() * happyStates.length)];
    } else if (newClickCount <= 6) {
      // Clicks 4-6: Mixed reactions (40% happy, 40% walking, 20% annoyed)
      const mixedStates = [
        CatState.LOVED, CatState.LOVED,
        CatState.SURPRISED,
        CatState.WALKING, CatState.WALKING,
        CatState.SAD
      ];
      randomState = mixedStates[Math.floor(Math.random() * mixedStates.length)];
    } else {
      // 7+ clicks: Annoyed reactions (50% ANGRY, 30% WALKING, 20% SAD)
      const annoyedStates = [
        CatState.ANGRY, CatState.ANGRY, CatState.ANGRY, CatState.ANGRY, CatState.ANGRY,
        CatState.WALKING, CatState.WALKING, CatState.WALKING,
        CatState.SAD, CatState.SAD
      ];
      randomState = annoyedStates[Math.floor(Math.random() * annoyedStates.length)];
    }

    setCatState(randomState);

    // Reset to idle after animation duration
    const duration = randomState === CatState.WALKING ? 3000 :
                     randomState === CatState.ANGRY ? 2500 : 2000;
    setTimeout(() => setCatState(CatState.IDLE), duration);

    // Reset click count after 10 seconds of no interaction
    setTimeout(() => setClickCount(0), 10000);
  };

  const handleStateChange = (newState: CatState) => {
    setCatState(newState);

    // Auto return to idle after animations (except for IDLE and WALKING)
    if (newState !== CatState.IDLE && newState !== CatState.WALKING) {
      const duration = newState === CatState.ANGRY ? 2500 : 3000;
      setTimeout(() => setCatState(CatState.IDLE), duration);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center relative overflow-hidden selection:bg-yellow-200">
      <YarnCursor />

      {/* Dynamic Background with Patterns */}
      <BackgroundDecor
        key={`${pageBackground.id}-${backgroundTexture}`}
        background={pageBackground}
        texture={backgroundTexture}
      />

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
      </div>

      {/* Chat Interface - Fixed position, independent of flex layout */}
      <div
        className={`fixed top-1/2 z-10 transition-opacity duration-500 ${isDiaryOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{
          right: '50px',
          transform: 'translateY(-50%)'
        }}
      >
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          onSaveDiary={handleSaveDiary}
          isTyping={isTyping}
          text={t.chat}
        />
      </div>

      {/* The Interactive Diary */}
      <DiaryBook
        isOpen={isDiaryOpen}
        onOpen={() => setIsDiaryOpen(true)}
        onClose={() => setIsDiaryOpen(false)}
        entries={diaryEntries}
        activeThemeId={activeThemeId}
        onThemeChange={setActiveThemeId}
        onDeleteEntry={handleDeleteEntry}
        text={t.diary}
        moodText={t.moods}
      />

      {/* Customizer Panel */}
      <CatCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        appearance={catAppearance}
        onChange={setCatAppearance}
        background={pageBackground}
        onBackgroundChange={setPageBackground}
        texture={backgroundTexture}
        onTextureChange={setBackgroundTexture}
        text={t.customizer}
        personalities={t.personalities}
      />

      {/* Cat State Controller */}
      {!isDiaryOpen && !isCustomizerOpen && (
        <CatStateController
          currentState={catState}
          onStateChange={handleStateChange}
          language={language}
        />
      )}

      {/* Simple Footer/Credits */}
      <div className="absolute bottom-2 text-gray-400 text-xs text-center w-full pb-2 z-0">
        Nero's Mood Diary • Built with React & Framer Motion
      </div>
    </div>
  );
}