// ============================================================
// API 请求工具 — 前端访问后端的统一入口
// 相对路径 /api：开发时由 Vite 代理，部署后由 Nginx 代理
// ============================================================

const BASE_URL = ''

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const token = localStorage.getItem('token')

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    ...options,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.detail || `请求失败 (${response.status})`)
  }

  return response.json()
}

// ============ Token 管理 ============

export const auth = {
  // 保存登录信息
  saveToken(token, user) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },
  // 读取当前用户
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('user'))
    } catch { return null }
  },
  // 是否已登录
  isLoggedIn() {
    return !!localStorage.getItem('token')
  },
  // 退出登录
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

export const api = {
  // ============ 认证 ============
  register: (username, email, password) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),
  login: (username, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  getMe: () => request('/api/auth/me'),

  // ============ 题库 ============
  getQuestions: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/api/questions${query ? '?' + query : ''}`)
  },  getCategories: () => request('/api/questions/categories'),
  checkAnswer: (questionId, answer) =>
    request(`/api/questions/${questionId}/check`, {
      method: 'POST',
      body: JSON.stringify({ answer }),
    }),

  // ============ 课程 ============
  getCourses: () => request('/api/courses'),
  getCourse: (id) => request(`/api/courses/${id}`),

  // ============ 学习进度 ============
  getProgress: () => request('/api/progress'),
  getProgressWeekly: () => request('/api/progress/weekly'),
  getProgressHistory: (limit = 50) => request(`/api/progress/history?limit=${limit}`),

  // ============ 后台管理（仅 admin） ============
  getAdminUsers: () => request('/api/admin/users'),
  getAdminStats: () => request('/api/admin/stats'),

  // ============ 健康检查 ============
  health: () => request('/api/health'),
}
