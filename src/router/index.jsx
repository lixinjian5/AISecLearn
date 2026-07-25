import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

// 暂时先做空壳页面，后续逐个实现
function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-sm">页面开发中...</p>
      </div>
    </div>
  )
}

export default function AppRouter() {
  return (
    <Routes>
      {/* 登录/注册 — 独立布局，无 Sidebar */}
      <Route path="/login" element={<PlaceholderPage title="登录" />} />
      <Route path="/register" element={<PlaceholderPage title="注册" />} />

      {/* 主应用 — 带 Sidebar + Header 的布局 */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
        <Route path="/ai-tutor" element={<PlaceholderPage title="AI 导师" />} />
        <Route path="/courses" element={<PlaceholderPage title="学习中心" />} />
        <Route path="/course/:id" element={<PlaceholderPage title="课程详情" />} />
        <Route path="/practice" element={<PlaceholderPage title="练习中心" />} />
        <Route path="/questions" element={<PlaceholderPage title="题库" />} />
        <Route path="/wrong-questions" element={<PlaceholderPage title="错题本" />} />
        <Route path="/security-lab" element={<PlaceholderPage title="安全靶场" />} />
        <Route path="/code-analysis" element={<PlaceholderPage title="AI 代码分析" />} />
        <Route path="/log-analysis" element={<PlaceholderPage title="AI 日志分析" />} />
        <Route path="/learning-progress" element={<PlaceholderPage title="学习记录" />} />
        <Route path="/profile" element={<PlaceholderPage title="个人中心" />} />
        <Route path="/admin" element={<PlaceholderPage title="后台管理" />} />
      </Route>

      {/* 根路径重定向到首页 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
