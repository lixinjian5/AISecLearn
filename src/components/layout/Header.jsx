import { useLocation } from 'react-router-dom'
import ShinyText from '../react-bits/ShinyText'

const pageTitles = {
  '/dashboard':        '首页',
  '/ai-tutor':         'AI 导师',
  '/courses':          '学习中心',
  '/practice':         '练习中心',
  '/questions':        '题库',
  '/wrong-questions':  '错题本',
  '/security-lab':     '安全靶场',
  '/code-analysis':    'AI 代码安全分析',
  '/log-analysis':     'AI 日志分析',
  '/learning-progress':'学习记录',
  '/profile':          '个人中心',
  '/admin':            '后台管理',
  '/':                 '首页',
}

export default function Header() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'AISecLearn'

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-800/30 bg-gray-900/50 backdrop-blur-md relative">
      {/* React Bits ShinyText — 页面标题光泽流动 */}
      <div>
        <ShinyText
          text={title}
          speed={3}
          className="text-lg font-semibold"
          color="#9ca3af"
          shineColor="#ffffff"
          spread={100}
        />
        <p className="text-xs text-gray-600 mt-0.5">
          {new Date().toLocaleDateString('zh-CN', { 
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
          })}
        </p>
      </div>

      {/* 右侧 */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyber-500 ring-2 ring-gray-900" />
        </button>

        <button className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary-500/20">
            L
          </div>
        </button>
      </div>
    </header>
  )
}
