import { useState } from 'react'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import Magnet from '../../components/react-bits/Magnet'
import Masonry from '../../components/react-bits/Masonry'

const courses = [
  { id: 1, title: 'Web 安全基础', category: 'web', difficulty: '入门', progress: 45, desc: '了解OWASP Top 10，掌握Web安全核心概念与常见漏洞类型', icon: '🌐' },
  { id: 2, title: 'SQL 注入深度实战', category: 'web', difficulty: '进阶', progress: 68, desc: '从原理到实战，掌握数字型、字符型、盲注、报错注入等技巧，含Pikachu靶场练习', icon: '💉' },
  { id: 3, title: 'XSS 跨站脚本攻击', category: 'web', difficulty: '进阶', progress: 42, desc: '反射型、存储型、DOM型XSS全解析', icon: '⚠️' },
  { id: 4, title: 'CSRF 攻击与防御', category: 'web', difficulty: '入门', progress: 15, desc: '理解跨站请求伪造原理与Token防御机制', icon: '🛡️' },
  { id: 5, title: '文件上传漏洞', category: 'web', difficulty: '高级', progress: 8, desc: '前端绕过、后缀绕过、内容类型绕过、条件竞争，从入门到精通', icon: '📤' },
  { id: 6, title: '命令执行与代码注入', category: 'system', difficulty: '高级', progress: 0, desc: 'OS命令注入、代码注入、反序列化漏洞的检测与利用', icon: '💻' },
  { id: 7, title: 'Python 安全编程', category: 'dev', difficulty: '进阶', progress: 30, desc: 'Python中常见安全陷阱与防御性编程最佳实践', icon: '🐍' },
  { id: 8, title: 'Linux 安全基础', category: 'system', difficulty: '入门', progress: 55, desc: 'Linux权限管理、防火墙配置、日志审计与安全加固', icon: '🐧' },
  { id: 9, title: '网络攻防实战', category: 'system', difficulty: '高级', progress: 12, desc: '端口扫描、流量分析、中间人攻击原理与防御策略', icon: '🔍' },
  { id: 10, title: '密码学基础', category: 'dev', difficulty: '进阶', progress: 0, desc: '对称/非对称加密、哈希算法、数字签名、证书体系', icon: '🔐' },
  { id: 11, title: '认证与授权安全', category: 'web', difficulty: '进阶', progress: 20, desc: 'JWT攻击、OAuth漏洞利用、Session固定与劫持防御', icon: '🔑' },
  { id: 12, title: '日志分析与应急响应', category: 'system', difficulty: '高级', progress: 0, desc: '攻击溯源、日志分析技巧、应急响应完整流程与工具使用', icon: '📋' },
]

const categories = [
  { key: 'all', label: '全部' },
  { key: 'web', label: 'Web 安全' },
  { key: 'system', label: '系统安全' },
  { key: 'dev', label: '安全开发' },
]

const diffColors = {
  '入门': 'bg-emerald-500/20 text-emerald-400',
  '进阶': 'bg-amber-500/20 text-amber-400',
  '高级': 'bg-red-500/20 text-red-400',
}

export default function Courses() {
  const [activeCategory, setActiveCategory] = useState('all')
  const filtered = activeCategory === 'all' ? courses : courses.filter(c => c.category === activeCategory)

  return (
    <div className="p-6 space-y-6">
      <FadeContent blur={true} duration={500}>
        <GradientText colors={['#6366f1', '#06b6d4', '#8b5cf6']} animationSpeed={6} className="text-2xl font-bold">
          学习中心
        </GradientText>
        <p className="text-sm text-gray-500 mt-1">选择课程，开启你的网络安全学习之旅</p>
      </FadeContent>

      {/* 分类筛选 — Magnet 磁吸按钮 */}
      <FadeContent blur={true} duration={400} delay={100}>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <Magnet key={cat.key} padding={40} magnetStrength={20}>
              <button
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? 'bg-primary-600/30 text-primary-400 border border-primary-500/40'
                    : 'bg-gray-900/60 text-gray-400 border border-gray-800/40 hover:border-gray-700/50'
                }`}
              >
                {cat.label}
              </button>
            </Magnet>
          ))}
        </div>
      </FadeContent>

      {/* React Bits Masonry 瀑布流 */}
      <Masonry
        gap={16}
        stagger={0.04}
        blurToFocus={true}
      >
        {filtered.map(course => (
          <SpotlightCard
            key={course.id}
            className="!rounded-2xl !p-5 !bg-gray-900/60 !border-gray-800/30"
            spotlightColor="rgba(99, 102, 241, 0.12)"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{course.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">{course.title}</h3>
                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-1 ${diffColors[course.difficulty]}`}>
                  {course.difficulty}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-4">{course.desc}</p>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">学习进度</span>
                <span className="text-gray-400">{course.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            <button className="w-full mt-4 py-2 rounded-xl bg-white/[0.03] border border-gray-800/40 text-xs text-gray-400 hover:text-white hover:border-primary-500/40 hover:bg-primary-600/10 transition-all">
              {course.progress > 0 ? '继续学习 →' : '开始学习 →'}
            </button>
          </SpotlightCard>
        ))}
      </Masonry>
    </div>
  )
}
