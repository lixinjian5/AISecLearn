// ============================================================
// AI Service — 大模型调用抽象层
//
// 当前 MVP 阶段：前端直调 DeepSeek API
// 后续接入后端时，只需修改此文件，业务代码无需变动
// ============================================================

const API_URL = 'https://api.deepseek.com/v1/chat/completions'

/**
 * 调用 AI 模型
 * @param {Array} messages - 对话历史 [{role, content}, ...]
 * @param {Object} options - 可选参数
 * @returns {Promise<string>} AI 回复文本
 */
export async function callAI(messages, options = {}) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY

  if (!apiKey || apiKey === 'sk-你的key填这里') {
    throw new Error('请先在 .env 文件中配置 VITE_DEEPSEEK_API_KEY')
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model || 'deepseek-chat',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
      stream: false,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `API 请求失败 (${response.status})`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

/**
 * 流式调用 AI 模型（预留，后续实现打字机效果）
 */
export async function callAIStream(messages, onChunk, options = {}) {
  // TODO: 后续实现 SSE 流式
  const text = await callAI(messages, options)
  onChunk(text)
  return text
}
