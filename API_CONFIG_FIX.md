# 🔧 API配置问题解决方案

## 问题描述

网站出现"意外错误"是因为前端尝试连接API但找不到API服务器。

## 原因分析

前端代码（[App.tsx:444](frontend/App.tsx#L444)）配置了API端点：
```typescript
baseURL: window.location.origin + '/api/v1'
```

这意味着它会向 `http://localhost:3000/api/v1` 发送请求，但是：
- ❌ 没有本地API服务器运行
- ❌ 没有配置Vite代理

## 解决方案

### 方案1：配置Cloudflare Workers代理（推荐）

**步骤1：更新vite.config.ts**

我已经在 [vite.config.ts](frontend/vite.config.ts) 中添加了代理配置，但你需要**替换Cloudflare Workers URL**：

```typescript
proxy: {
  '/api': {
    target: 'https://your-cloudflare-worker-url.workers.dev',  // ⬅️ 改成你的URL
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

**步骤2：获取Cloudflare Workers URL**

1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages
3. 找到你的AI代理Worker
4. 复制Worker URL（格式：`https://xxx.workers.dev`）

**步骤3：更新配置并重启**

```bash
cd frontend
# 修改 vite.config.ts 中的 target 为你的Worker URL
npm run dev
```

### 方案2：创建本地API代理服务器

如果你没有部署Cloudflare Worker，或者想本地开发，需要创建一个本地代理服务器。

**创建 `backend/server.js`：**

```javascript
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// 代理到你的AI API
app.all('/v1/*', async (req, res) => {
  try {
    const response = await fetch(`https://api.siliconflow.cn${req.path}`, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8787, () => {
  console.log('API proxy running on http://localhost:8787');
});
```

然后更新 `vite.config.ts`：

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8787',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

### 方案3：临时禁用AI功能（快速测试）

如果你只想测试UI而不需要AI对话功能，可以修改App.tsx让AI调用失败时有更好的降级处理。

## 推荐步骤

1. ✅ 确认你的Cloudflare Worker URL
2. ✅ 更新 `vite.config.ts` 中的 `target`
3. ✅ 重启开发服务器 `npm run dev`
4. ✅ 刷新浏览器

## 验证是否成功

打开浏览器控制台（F12），如果看到：
- ✅ 没有 404 或网络错误
- ✅ AI对话可以正常工作

说明配置成功！

## 常见问题

### Q: 我不知道Cloudflare Worker URL
**A:** 检查你之前的部署记录，或者在Cloudflare Dashboard中查看Workers列表

### Q: 我没有部署Cloudflare Worker
**A:** 使用方案2创建本地API服务器，或者参考Cloudflare Workers部署文档

### Q: 还是报错
**A:** 检查：
1. Cloudflare Worker是否正常运行
2. API密钥是否正确配置
3. 浏览器控制台的具体错误信息

---

**更新日期**: 2026-01-16
**状态**: ⚠️ 需要配置Cloudflare Workers URL
