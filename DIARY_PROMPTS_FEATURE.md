# 📝 随机日记提示词功能 / Randomized Diary Prompts Feature

## 功能概述 / Overview

为了增加游戏的趣味性和多样性，Nero 现在会使用不同的提示词来鼓励玩家写日记，而不是每次都说同样的话。

To enhance gameplay variety and engagement, Nero now uses different prompts to encourage diary writing instead of saying the same thing every time.

## 实现细节 / Implementation Details

### 提示词库 / Prompt Pool

每种语言有 6 个不同的提示词可供随机选择：

Each language has 6 different prompts that are randomly selected:

#### 英文 / English
1. "Prrr... Hi there! I'm Nero. How are you feeling today? 🐾"
2. "What happened today? Tell me everything~ 😺"
3. "Any good things happen recently? I'm all ears! 👂"
4. "Tell me about your favorite book... I'm curious! 📚"
5. "What's your favorite food? Share with me! 🍽️"
6. "Tell me about yourself~ I want to know you better 🐱"

#### 中文 / Chinese
1. "呼噜... 嗨！我是 Nero。你今天感觉怎么样？🐾"
2. "今天发生了什么事？告诉我吧~ 😺"
3. "最近有没有什么好事发生？我很好奇！👂"
4. "说说你最喜欢的一本书吧...我想听！📚"
5. "说说你喜欢的食物吧！分享给我~ 🍽️"
6. "和我讲讲你自己吧~ 我想更了解你 🐱"

### 触发时机 / When Prompts Are Used

随机提示词会在以下两个场景出现：

Random prompts appear in these two scenarios:

1. **初始加载 / Initial Load**
   - 玩家第一次打开应用时
   - When the player first opens the application

2. **保存日记后 / After Saving Diary**
   - 每次保存日记后，开始新的对话时
   - Each time a diary is saved and a new conversation begins

### 代码实现 / Code Implementation

#### 1. 提示词数组定义 / Prompt Array Definition

```typescript
const DIARY_PROMPTS = {
  en: [
    "Prrr... Hi there! I'm Nero. How are you feeling today? 🐾",
    "What happened today? Tell me everything~ 😺",
    "Any good things happen recently? I'm all ears! 👂",
    "Tell me about your favorite book... I'm curious! 📚",
    "What's your favorite food? Share with me! 🍽️",
    "Tell me about yourself~ I want to know you better 🐱"
  ],
  zh: [
    "呼噜... 嗨！我是 Nero。你今天感觉怎么样？🐾",
    "今天发生了什么事？告诉我吧~ 😺",
    "最近有没有什么好事发生？我很好奇！👂",
    "说说你最喜欢的一本书吧...我想听！📚",
    "说说你喜欢的食物吧！分享给我~ 🍽️",
    "和我讲讲你自己吧~ 我想更了解你 🐱"
  ]
};
```

#### 2. 随机选择函数 / Random Selection Function

```typescript
const getRandomDiaryPrompt = (language: Language): string => {
  const prompts = DIARY_PROMPTS[language];
  return prompts[Math.floor(Math.random() * prompts.length)];
};
```

#### 3. 使用场景 / Usage Scenarios

**初始消息 / Initial Message** ([App.tsx:464](frontend/App.tsx#L464))
```typescript
if (messages.length === 0) {
  setTimeout(() => {
    setMessages([{
      id: 'init-1',
      sender: 'cat',
      text: getRandomDiaryPrompt(language),
      timestamp: Date.now()
    }]);
  }, 1000);
}
```

**保存日记后 / After Saving Diary** ([App.tsx:654](frontend/App.tsx#L654))
```typescript
setMessages([{
  id: Date.now().toString(),
  sender: 'cat',
  text: getRandomDiaryPrompt(language),
  timestamp: Date.now()
}]);
```

## 用户体验改进 / UX Improvements

### 之前 / Before
- �� Nero 每次都说同样的话："呼噜... 嗨！我是 Nero。你今天感觉怎么样？🐾"
- ❌ 缺乏新鲜感和互动感
- ❌ Nero always said the same thing: "Prrr... Hi there! I'm Nero. How are you feeling today? 🐾"
- ❌ Lacked freshness and engagement

### 之后 / After
- ✅ 每次加载或保存日记后，Nero 会说不同的话
- ✅ 6 种不同的提示词增加了对话的丰富性
- ✅ 提示词涵盖不同话题（今天的事、爱好、食物、书籍等）
- ✅ 更自然的对话体验
- ✅ Nero says different things each time after loading or saving a diary
- ✅ 6 different prompts add variety to conversations
- ✅ Prompts cover different topics (today's events, hobbies, food, books, etc.)
- ✅ More natural conversation experience

## 扩展建议 / Future Enhancements

如果想进一步增强这个功能，可以考虑：

For further enhancements, consider:

1. **根据游戏阶段调整提示词 / Stage-Based Prompts**
   - ESTABLISHMENT: 温和友好的提示词
   - DISTURBANCE/DISTORTION: 加入微妙的不安感
   - POSSESSION: 更加占有欲强的提示词

2. **基于时间的提示词 / Time-Based Prompts**
   - 早上："早安！今天有什么计划吗？"
   - 晚上："今天过得怎么样？"

3. **避免重复 / Avoid Repetition**
   - 记录最近使用的提示词
   - 确保连续几次不会出现相同的提示

4. **更多提示词 / More Prompts**
   - 增加提示词数量（10-15 个）
   - 根据用户反馈添加更多有趣的话题

## 测试建议 / Testing Recommendations

测试时应验证：

When testing, verify:

- ✅ 初始加载时提示词是随机的
- ✅ 保存日记后提示词会改变
- ✅ 中英文切换时提示词语言正确
- ✅ 所有 6 个提示词都能正常显示
- ✅ Initial load prompts are randomized
- ✅ Prompts change after saving diary
- ✅ Prompt language is correct when switching between EN/ZH
- ✅ All 6 prompts display correctly

## 相关文件 / Related Files

- [frontend/App.tsx](frontend/App.tsx) - 主要实现文件
- Main implementation file

---

**更新日期 / Last Updated**: 2026-01-16
**版本 / Version**: 1.0.0
