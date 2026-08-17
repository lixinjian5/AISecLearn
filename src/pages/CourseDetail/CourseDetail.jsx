import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import Magnet from '../../components/react-bits/Magnet'
import { api } from '../../services/api'

const diffColors = {
  '入门': 'bg-emerald-500/20 text-emerald-400',
  '进阶': 'bg-amber-500/20 text-amber-400',
  '高级': 'bg-red-500/20 text-red-400',
}

export default function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)

  useEffect(() => {
    api.getCourse(Number(id))
      .then(setCourse)
      .catch(() => setCourse(null))
  }, [id])

  if (!course) {
    return (
      <div className="p-6 flex items-center justify-center h-full text-gray-500">
        <p className="text-sm">课程加载中...</p>
      </div>
    )
  }

  const completed = Math.round(course.lessons * course.progress / 100) || 0

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑 + 标题 */}
      <FadeContent blur={true} duration={500}>
        <Link to="/courses" className="text-xs text-gray-600 hover:text-gray-400 transition-colors mb-2 inline-block">
          ← 返回课程列表
        </Link>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-3xl">{course.icon}</span>
          <div>
            <GradientText colors={['#6366f1', '#06b6d4', '#8b5cf6']} animationSpeed={6} className="text-xl font-bold">
              {course.title}
            </GradientText>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${diffColors[course.difficulty]}`}>{course.difficulty}</span>
              <span className="text-xs text-gray-600">{course.category}</span>
            </div>
          </div>
        </div>
      </FadeContent>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧：课程信息 + 章节列表 */}
        <div className="col-span-2 space-y-6">
          {/* 课程简介 */}
          <FadeContent blur={true} duration={400} delay={100}>
            <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(99,102,241,0.10)">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">📖 课程简介</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{course.desc}</p>
            </SpotlightCard>
          </FadeContent>

          {/* 章节列表（课程大纲） */}
          <FadeContent blur={true} duration={400} delay={200}>
            <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(99,102,241,0.10)">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">📚 课程大纲（{course.lessons} 节）</h3>
              <div className="space-y-1">
                {Array.from({ length: course.lessons }).map((_, i) => {
                  const done = i < completed
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                        done ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-white/[0.02] border border-gray-800/20 hover:border-gray-700/40 cursor-pointer'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-600'
                      }`}>
                        {done ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <span className="text-xs font-medium">{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${done ? 'text-gray-500' : 'text-gray-300'}`}>第 {i + 1} 节：{course.title}</p>
                      </div>
                      <span className="text-xs text-gray-600 shrink-0">约 30 分钟</span>
                    </div>
                  )
                })}
              </div>
            </SpotlightCard>
          </FadeContent>
        </div>

        {/* 右侧：进度 + 操作 */}
        <div className="space-y-4">
          {/* 学习进度 */}
          <FadeContent blur={true} duration={400} delay={300}>
            <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(6,182,212,0.10)">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">📊 学习进度</h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-white">{course.progress}</span>
                <span className="text-sm text-gray-500">%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-800 overflow-hidden mb-4">
                <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyber-500" style={{ width: `${course.progress}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="p-2 rounded-lg bg-gray-900/40">
                  <p className="text-gray-500">已完成</p>
                  <p className="text-white font-semibold">{completed} 节</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-900/40">
                  <p className="text-gray-500">剩余</p>
                  <p className="text-white font-semibold">{course.lessons - completed} 节</p>
                </div>
              </div>
            </SpotlightCard>
          </FadeContent>

          {/* 操作按钮 */}
          <FadeContent blur={true} duration={400} delay={400}>
            <Magnet padding={60} magnetStrength={15}>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-cyber-600 text-white text-sm font-medium hover:from-primary-500 hover:to-cyber-500 transition-all shadow-lg shadow-primary-500/25">
                {course.progress > 0 ? '继续学习 →' : '开始学习 →'}
              </button>
            </Magnet>
          </FadeContent>
        </div>
      </div>
    </div>
  )
}
