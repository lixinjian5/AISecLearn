// ============================================================
// AI Service — 大模型调用抽象层
//
// 安全设计：前端不持有任何 API Key
// 所有 AI 请求走后端代理 /api/ai/chat（后端持 Key 调 DeepSeek）
// 前端只带 JWT，Key 永不进入浏览器
// ============================================================

/**
 * 调用 AI 模型（经后端代理）
 * @param {Array} messages - 对话历史 [{role, content}, ...]
 * @param {Object} options - 可选参数
 * @returns {Promise<string>} AI 回复文本
 */
export async function callAI(messages, options = {}) {
  const token = localStorage.getItem('token')

  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `AI 请求失败 (${response.status})`)
  }

  const data = await response.json()
  return data.content
}

/**
 * 流式调用 AI 模型（预留，后续实现打字机效果）
 */
export async function callAIStream(messages, onChunk, options = {}) {
  const text = await callAI(messages, options)
  onChunk(text)
  return text
}
