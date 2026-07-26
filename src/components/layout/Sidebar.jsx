import { useLocation, useNavigate } from 'react-router-dom'
import Particles from '../react-bits/Particles'
import Magnet from '../react-bits/Magnet'
import ClickBurst from '../react-bits/ClickBurst'
import SpecularButton from '../react-bits/SpecularButton'
// 导航项配置
const mainNavItems = [
  { to: '/dashboard',       label: '首页',       icon: HomeIcon },
  { to: '/ai-tutor',        label: 'AI 导师',    icon: AIIcon },
  { to: '/courses',         label: '学习中心',   icon: BookIcon },
  { to: '/practice',        label: '练习中心',   icon: TargetIcon },
  { to: '/security-lab',    label: '安全靶场',   icon: ShieldIcon },
]

const analysisNavItems = [
  { to: '/code-analysis',   label: '代码分析',   icon: CodeIcon },
  { to: '/log-analysis',    label: '日志分析',   icon: FileIcon },
]

const recordNavItems = [
  { to: '/learning-progress', label: '学习记录', icon: ChartIcon },
  { to: '/wrong-questions',   label: '错题本',   icon: NoteIcon },
]

const bottomNavItems = [
  { to: '/profile',  label: '用户中心', icon: UserIcon },
]

function NavItem({ to, label, icon: Icon }) {
  const navigate = useNavigate()
  return (
    <ClickBurst className="w-full">
      <Magnet padding={80} magnetStrength={30} wrapperClassName="w-full">
        <SpecularButton
          as="div"
          size="sm"
          radius={10}
          lineColor="#818cf8"
          baseColor="#1e1b4b"
          textColor="#c7d2fe"
          intensity={0.8}
          shineSize={15}
          thickness={1}
          speed={0.2}
          autoAnimate={true}
          onClick={() => navigate(to)}
          className="w-full !justify-start !px-4 !py-2.5 !text-sm !font-medium"
        >
          <Icon className="w-5 h-5 shrink-0" />
          <span className="ml-3">{label}</span>
        </SpecularButton>
      </Magnet>
    </ClickBurst>
  )
}

function NavGroup({ label }) {
  return (
    <p className="px-4 pt-5 pb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
      {label}
    </p>
  )
}

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-[260px] shrink-0 flex flex-col border-r border-gray-800/30 bg-gray-900/60 backdrop-blur-xl relative overflow-hidden">
      {/* React Bits Particles — 粒子背景 */}
      <div className="absolute inset-0 opacity-[0.25] pointer-events-none">
        <Particles
          particleColors={['#6366f1', '#06b6d4', '#8b5cf6']}
          particleCount={120}
          particleSpread={8}
          speed={0.05}
          particleBaseSize={80}
          sizeRandomness={0.8}
          cameraDistance={18}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-transparent to-gray-900/90 pointer-events-none" />

      {/* 内容区 — 在 WebGL 背景之上 */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-800/30">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyber-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <ShieldIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">AISec</span>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-cyber-400 bg-clip-text text-transparent">Learn</span>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
          <div className="space-y-0.5 px-3">
            {mainNavItems.map(item => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>

          <NavGroup label="AI 安全分析" />
          <div className="space-y-0.5 px-3">
            {analysisNavItems.map(item => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>

          <NavGroup label="学习记录" />
          <div className="space-y-0.5 px-3">
            {recordNavItems.map(item => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        </nav>

        {/* 底部 */}
        <div className="border-t border-gray-800/30 px-3 py-3 space-y-0.5">
          {bottomNavItems.map(item => (
            <NavItem key={item.to} {...item} />
          ))}

          <div className="flex items-center gap-3 px-4 py-2.5 mt-1 rounded-lg bg-white/[0.03]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary-500/20">
              L
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-300 truncate">李欣键</p>
              <p className="text-xs text-gray-500">Lv.12 · 安全学徒</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

// -------- SVG 图标 --------
function HomeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}
function AIIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}
function BookIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}
function TargetIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5zm0 4.125a4.125 4.125 0 110 8.25 4.125 4.125 0 010-8.25zm0 2.625a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
    </svg>
  )
}
function ShieldIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}
function CodeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  )
}
function FileIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}
function ChartIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}
function NoteIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}
function UserIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}
