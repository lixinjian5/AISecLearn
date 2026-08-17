import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { auth } from '../services/api'
import AITutor from '../pages/AITutor/AITutor'
import Dashboard from '../pages/Dashboard/Dashboard'
import Courses from '../pages/Courses/Courses'
import Profile from '../pages/Profile/Profile'
import Practice from '../pages/Practice/Practice'
import CodeAnalysis from '../pages/CodeAnalysis/CodeAnalysis'
import LearningProgress from '../pages/LearningProgress/LearningProgress'
import WrongQuestions from '../pages/WrongQuestions/WrongQuestions'
import CourseDetail from '../pages/CourseDetail/CourseDetail'
import SecurityLab from '../pages/SecurityLab/SecurityLab'
import Login from '../pages/Login/Login'
import Questions from '../pages/Questions/Questions'
import LogAnalysis from '../pages/LogAnalysis/LogAnalysis'
import Admin from '../pages/Admin/Admin'
import LabDetail from '../pages/LabDetail/LabDetail'

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

// 路由守卫：未登录跳转登录页
function ProtectedRoute() {
  if (!auth.isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  return <MainLayout />
}

// 管理员路由：非 admin 跳转首页
function AdminRoute() {
  if (auth.getUser()?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  return <Admin />
}

export default function AppRouter() {
  return (
    <Routes>
      {/* 登录/注册 — 独立布局，无 Sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />

      {/* 主应用 — 带 Sidebar + Header 的布局，需登录 */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-tutor" element={<AITutor />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/wrong-questions" element={<WrongQuestions />} />
        <Route path="/security-lab" element={<SecurityLab />} />
        <Route path="/security-lab/:id" element={<LabDetail />} />
        <Route path="/code-analysis" element={<CodeAnalysis />} />
        <Route path="/log-analysis" element={<LogAnalysis />} />
        <Route path="/learning-progress" element={<LearningProgress />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminRoute />} />
      </Route>

      {/* 根路径重定向到首页 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
