import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import Counter from '../../components/react-bits/Counter'

const weeklyData = [
  { day: '一', hours: 1.5, questions: 12 },
  { day: '二', hours: 2.0, questions: 18 },
  { day: '三', hours: 0.8, questions: 6 },
  { day: '四', hours: 2.5, questions: 22 },
  { day: '五', hours: 1.2, questions: 10 },
  { day: '六', hours: 3.0, questions: 28 },
  { day: '日', hours: 2.2, questions: 20 },
]

const accuracyByCategory = [
  { category: 'SQL注入', accuracy: 78, color: '#6366f1' },
  { category: 'XSS', accuracy: 65, color: '#06b6d4' },
  { category: 'CSRF', accuracy: 82, color: '#8b5cf6' },
  { category: '文件上传', accuracy: 45, color: '#f59e0b' },
  { category: '命令执行', accuracy: 58, color: '#ef4444' },
  { category: '密码学', accuracy: 90, color: '#22c55e' },
]

const courseList = [
  { name: 'SQL 注入基础', progress: 68, time: '12小时' },
  { name: 'XSS 跨站脚本', progress: 42, time: '8小时' },
  { name: 'CSRF 攻击与防御', progress: 15, time: '3小时' },
  { name: 'Python 安全编程', progress: 30, time: '6小时' },
  { name: 'Linux 安全基础', progress: 55, time: '4小时' },
]

export default function LearningProgress() {
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
          { label: '完成题目', value: 126, suffix: ' 道', icon: '✅', color: 'rgba(6,182,212,0.15)' },
          { label: '正确率', value: 72, suffix: '%', icon: '🎯', color: 'rgba(34,211,238,0.15)' },
          { label: '错题数量', value: 35, suffix: ' 道', icon: '📝', color: 'rgba(239,68,68,0.10)' },
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
            <h3 className="text-sm font-semibold text-gray-300 mb-4">📈 本周学习时长</h3>
            <div className="h-48 flex items-end justify-between gap-3 px-2">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-gray-500">{d.hours}h</span>
                  <div className="w-full flex flex-col justify-end gap-1" style={{ height: '160px' }}>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary-500/70 to-cyber-400/40 transition-all"
                      style={{ height: `${(d.hours / 3) * 100}%` }}
                    />
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-amber-600/50 to-amber-400/20"
                      style={{ height: `${(d.questions / 28) * 50}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-600">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 justify-center">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-primary-500/70 to-cyber-400/40" /> 学习时长
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-amber-600/50 to-amber-400/20" /> 做题数
              </div>
            </div>
          </SpotlightCard>
        </FadeContent>

        {/* 分类正确率 */}
        <FadeContent blur={true} duration={500} delay={300}>
          <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(6,182,212,0.08)">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">🎯 分类正确率</h3>
            <div className="space-y-3">
              {accuracyByCategory.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{item.category}</span>
                    <span className="text-gray-500">{item.accuracy}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.accuracy}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </FadeContent>
      </div>

      {/* 课程完成情况 */}
      <FadeContent blur={true} duration={500} delay={400}>
        <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(139,92,246,0.08)">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">📚 课程完成情况</h3>
          <div className="space-y-3">
            {courseList.map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-gray-800/20">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300">{c.name}</p>
                  <p className="text-xs text-gray-600">{c.time}</p>
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
          </div>
        </SpotlightCard>
      </FadeContent>
    </div>
  )
}
