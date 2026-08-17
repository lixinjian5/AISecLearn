import { useState, useEffect } from 'react'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import Counter from '../../components/react-bits/Counter'
import { api } from '../../services/api'

export default function LearningProgress() {
  const [progress, setProgress] = useState({ total_answered: 0, correct: 0, wrong: 0, accuracy: 0, by_category: {} })
  const [weekly, setWeekly] = useState([])
  const [courses, setCourses] = useState([])

  useEffect(() => {
    api.getProgress().then(setProgress).catch(() => {})
    api.getProgressWeekly().then(setWeekly).catch(() => {})
    api.getCourses().then(setCourses).catch(() => {})
  }, [])

  return (
    <div className="p-6 space-y-6">
      <FadeContent blur={true} duration={500}>
        <GradientText colors={['#6366f1', '#06b6d4', '#8b5cf6']} animationSpeed={6} className="text-2xl font-bold">
          学习记录
        </GradientText>
        <p className="text-sm text-gray-500 mt-1">追踪你的学习轨迹，看见每一点进步</p>
      </FadeContent>

      {/* 核心统计 */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '累计学习', value: 32, suffix: ' 小时', icon: '⏱️', color: 'rgba(99,102,241,0.15)' },
          { label: '完成题目', value: progress.total_answered, suffix: ' 道', icon: '✅', color: 'rgba(6,182,212,0.15)' },
          { label: '正确率', value: progress.accuracy, suffix: '%', icon: '🎯', color: 'rgba(34,211,238,0.15)' },
          { label: '错题数量', value: progress.wrong, suffix: ' 道', icon: '📝', color: 'rgba(239,68,68,0.10)' },
        ].map((s, i) => (
          <FadeContent key={i} blur={true} duration={400} delay={i * 80}>
            <SpotlightCard className="!rounded-2xl !p-5 !bg-gray-900/60 !border-gray-800/30" spotlightColor={s.color}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-gray-500">{s.label}</span>
                <span className="text-lg">{s.icon}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <Counter value={s.value} fontSize={28} padding={2} gap={5} textColor="#fff" fontWeight="700" gradientHeight={0} />
                <span className="text-sm text-gray-400">{s.suffix}</span>
              </div>
            </SpotlightCard>
          </FadeContent>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 每周学习趋势 */}
        <FadeContent blur={true} duration={500} delay={200}>
          <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(99,102,241,0.08)">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">📈 本周答题趋势</h3>
            <div className="h-48 flex items-end justify-between gap-3 px-2">
              {weekly.length > 0 ? weekly.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-gray-500">{d.answered}题</span>
                  <div className="w-full flex flex-col justify-end gap-1" style={{ height: '160px' }}>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary-500/70 to-cyber-400/40 transition-all"
                      style={{ height: `${Math.min(100, d.answered * 30)}%` }}
                    />
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-emerald-600/60 to-emerald-400/30"
                      style={{ height: `${Math.min(100, d.correct * 30)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-600">{['日','一','二','三','四','五','六'][i]}</span>
                </div>
              )) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">暂无本周数据</div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-4 justify-center">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-primary-500/70 to-cyber-400/40" /> 答题数
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-emerald-600/60 to-emerald-400/30" /> 答对数
              </div>
            </div>
          </SpotlightCard>
        </FadeContent>

        {/* 分类正确率 */}
        <FadeContent blur={true} duration={500} delay={300}>
          <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(6,182,212,0.08)">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">🎯 分类正确率</h3>
            <div className="space-y-3">
              {Object.keys(progress.by_category || {}).length > 0 ? (
                Object.entries(progress.by_category).map(([cat, data], i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">{cat}</span>
                      <span className="text-gray-500">{data.accuracy}%（{data.correct}/{data.total}）</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${data.accuracy}%`, backgroundColor: ['#6366f1','#06b6d4','#8b5cf6','#f59e0b','#ef4444','#22c55e'][i % 6] }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-600 text-center py-4">暂无做题数据</p>
              )}
            </div>
          </SpotlightCard>
        </FadeContent>
      </div>

      {/* 课程完成情况 */}
      <FadeContent blur={true} duration={500} delay={400}>
        <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(139,92,246,0.08)">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">📚 课程完成情况</h3>
          <div className="space-y-3">
            {courses.slice(0, 5).map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-gray-800/20">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300">{c.title}</p>
                  <p className="text-xs text-gray-600">{c.lessons} 节课</p>
                </div>
                <div className="w-32 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyber-500"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{c.progress}%</span>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <p className="text-xs text-gray-600 text-center py-4">暂无课程数据</p>
            )}
          </div>
        </SpotlightCard>
      </FadeContent>
    </div>
  )
}
