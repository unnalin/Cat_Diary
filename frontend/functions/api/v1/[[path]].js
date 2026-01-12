// functions/api/v1/[[path]].js

export async function onRequest(context) {
  const { request, env } = context;
  
  // 1. 获取原始请求的 URL
  const url = new URL(request.url);
  
  // 2. 将请求转发到 SiliconFlow 的真实地址
  // 例如前端请求 /api/v1/chat/completions -> 转发到 siliconflow 的对应接口
  const targetUrl = `https://api.siliconflow.cn/v1${url.pathname.replace('/api/v1', '')}`;

  // 3. 从 Cloudflare 环境变量获取 Key
  const API_KEY = env.SILICONFLOW_API_KEY;

  // 4. 复制原始请求的 Header，但注入真实的 Authorization
  const newHeaders = new Headers(request.headers);
  newHeaders.set("Authorization", `Bearer ${API_KEY}`);

  // 5. 发起转发请求
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: newHeaders,
    body: request.body,
    redirect: 'follow'
  });

  const response = await fetch(modifiedRequest);

  // 6. 将响应原样返回给前端（支持流式输出）
  return new Response(response.body, response);
}