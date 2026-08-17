import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import Magnet from '../../components/react-bits/Magnet'
import MagicBento from '../../components/react-bits/MagicBento'
import { api } from '../../services/api'

const diffColors = {
  '入门': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  '进阶': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  '高级': 'bg-red-500/20 text-red-400 border-red-500/30',
}

const categories = [
  { key: 'all', label: '全部' },
  { key: 'web', label: 'Web 安全' },
  { key: 'system', label: '系统安全' },
  { key: 'dev', label: '安全开发' },
]

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    api.getCourses().then(setCourses).catch(() => setCourses([]))
  }, [])

  const filtered = activeCategory === 'all' ? courses : courses.filter(c => c.category === activeCategory)

  return (
    <div className="p-6 space-y-6">
      <FadeContent blur={true} duration={500}>
        <GradientText colors={['#6366f1', '#06b6d4', '#8b5cf6']} animationSpeed={6} className="text-2xl font-bold">
          学习中心
        </GradientText>
        <p className="text-sm text-gray-500 mt-1">选择课程，开启你的网络安全学习之旅</p>
      </FadeContent>

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

      {/* React Bits MagicBento — 聚光灯 + 粒子 + 边框光 + 倾斜 + 磁吸 */}
      <MagicBento
        items={filtered.map(c => ({ ...c, label: c.difficulty, bg: '#111827' }))}
        enableStars={true}
        enableSpotlight={true}
        enableBorderGlow={true}
        enableTilt={true}
        enableMagnetism={true}
        clickEffect={true}
        spotlightRadius={400}
        particleCount={10}
        glowColor="99, 102, 241"
        renderCard={(course) => (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{course.icon}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${diffColors[course.difficulty]}`}>
                {course.difficulty}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-white mb-2">{course.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{course.desc}</p>

            <div className="space-y-1.5 mt-auto">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">进度</span>
                <span className="text-gray-400">{course.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyber-500" style={{ width: `${course.progress}%` }} />
              </div>
            </div>

            <Link to={`/course/${course.id}`} className="block w-full mt-4 py-2 rounded-xl bg-white/[0.03] border border-gray-800/40 text-xs text-center text-gray-400 hover:text-white hover:border-primary-500/40 hover:bg-primary-600/10 transition-all">
              {course.progress > 0 ? '继续学习 →' : '开始学习 →'}
            </Link>
          </div>
        )}
      />
    </div>
  )
}
