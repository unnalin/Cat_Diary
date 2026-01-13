# Nero's Mood Diary - Interactive Cat Journal

[English](#english) | [中文](#中文)

---

## English

A delightful interactive mood diary where you chat with Nero, a witty AI cat, and save your daily reflections.
* Currently, only the web version for computers is supported.

## Features

- 🐱 Chat with Nero - an AI-powered cat with personality
- 📖 Save conversations as diary entries
- 🎨 Customize cat appearance (eyes, collar, bell colors)
- 🎨 9 beautiful page backgrounds (neutral, beige, warm-gray, soft-pink, dusty-rose, pale-blue, sakura-pink, mint-leaf, lavender-star)
- 🖼️ 5 background textures (none, dots, paws, lines, grid)
- ✨ Animated floating patterns (sakura, leaf, star, heart, paw) on colorful backgrounds
- 😺 Cat mood control panel - change Nero's emotions instantly
- 🌍 Bilingual support (English & Chinese)
- 🎭 Multiple diary themes
- 💾 All data stored locally in your browser

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Framer Motion (animations)
- OpenAI-compatible API (SiliconFlow)
- LocalStorage for data persistence

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open <http://localhost:3000> in your browser

## Deploy to Cloudflare Pages

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to Cloudflare Pages

3. Set environment variable in Cloudflare Pages dashboard:

   ```env
   SILICONFLOW_API_KEY = your-api-key-here
   ```

4. The Cloudflare Functions proxy in `functions/api/v1/[[path]].js` will handle API requests securely

## Architecture

- **Frontend**: Pure static React app (no API keys exposed)
- **Backend**: Cloudflare Functions proxy for AI API calls
- **Storage**: Browser localStorage (no database needed)
- **AI**: SiliconFlow API (Qwen/Qwen2-7B-Instruct model)

## Security

- API keys are stored securely in Cloudflare environment variables
- Frontend uses a proxy endpoint to avoid exposing credentials
- Each user's data is isolated in their own browser storage

## Roadmap

- 🚀 **Next:** Optimize diary storage and management system
- 📱 Mobile responsive design
- 🎯 More cat emotions and interactions
- 🌈 Additional customization options

---

## 中文

Nero 的心情日记 - 一个与聪明的 AI 猫咪 Nero 聊天并保存每日心情的互动日记应用。
* 目前仅支持电脑端网页版本。

## 功能特性

- 🐱 与 Nero 聊天 - 一只有个性的 AI 猫咪
- 📖 将对话保存为日记条目
- 🎨 自定义猫咪外观（眼睛、项圈、铃铛颜色）
- 🎨 9 种精美页面背景（默认、米色、暖灰、淡粉、藕粉、浅蓝、樱花粉、薄荷绿、薰衣草）
- 🖼️ 5 种背景纹理（无、点点、猫爪、线条、网格）
- ✨ 彩色背景上的动画浮动印花（樱花、树叶、星星、爱心、猫爪）
- 😺 猫咪心情控制面板 - 即时改变 Nero 的情绪
- 🌍 双语支持（中文和英文）
- 🎭 多种日记主题
- 💾 所有数据存储在浏览器本地

## 技术栈

- React 19 + TypeScript
- Vite 6
- Framer Motion（动画）
- OpenAI 兼容 API（SiliconFlow）
- LocalStorage 数据持久化

## 本地运行

**前置要求：** Node.js

1. 安装依赖：

   ```bash
   npm install
   ```

2. 运行开发服务器：

   ```bash
   npm run dev
   ```

3. 在浏览器中打开 <http://localhost:3000>

## 部署到 Cloudflare Pages

1. 构建项目：

   ```bash
   npm run build
   ```

2. 将 `dist/` 文件夹部署到 Cloudflare Pages

3. 在 Cloudflare Pages 控制台设置环境变量：

   ```env
   SILICONFLOW_API_KEY = your-api-key-here
   ```

4. `functions/api/v1/[[path]].js` 中的 Cloudflare Functions 代理将安全处理 API 请求

## 架构

- **前端**：纯静态 React 应用（不暴露 API 密钥）
- **后端**：Cloudflare Functions 代理 AI API 调用
- **存储**：浏览器 localStorage（无需数据库）
- **AI**：SiliconFlow API（Qwen/Qwen2-7B-Instruct 模型）

## 安全性

- API 密钥安全存储在 Cloudflare 环境变量中
- 前端使用代理端点避免暴露凭证
- 每个用户的数据隔离在各自的浏览器存储中

## 开发路线

- 🚀 **下一步：** 优化日记存储和管理系统
- 📱 移动端响应式设计
- 🎯 更多猫咪情绪和互动
- 🌈 更多自定义选项
