// ============================================================
// API 请求工具 — 前端访问后端的统一入口
// 相对路径 /api：开发时由 Vite 代理，部署后由 Nginx 代理
// ============================================================

const BASE_URL = ''

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`请求失败 (${response.status})`)
  }

  return response.json()
}

export const api = {
  // 题库
  getQuestions: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/api/questions${query ? '?' + query : ''}`)
  },
  getCategories: () => request('/api/questions/categories'),
  checkAnswer: (questionId, answer) =>
    request(`/api/questions/${questionId}/check`, {
      method: 'POST',
      body: JSON.stringify({ answer }),
    }),

  // 课程
  getCourses: () => request('/api/courses'),
  getCourse: (id) => request(`/api/courses/${id}`),

  // 学习进度
  getProgress: () => request('/api/progress'),
  getProgressHistory: (limit = 50) => request(`/api/progress/history?limit=${limit}`),

  // 健康检查
  health: () => request('/api/health'),
}
