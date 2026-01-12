# Nero's Mood Diary - Interactive Cat Journal

A delightful interactive mood diary where you chat with Nero, a witty AI cat, and save your daily reflections.
* Currently, only the web version for computers is supported.

## Features

- 🐱 Chat with Nero - an AI-powered cat with personality
- 📖 Save conversations as diary entries
- 🎨 Customize cat appearance (eyes, collar, bell colors)
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
