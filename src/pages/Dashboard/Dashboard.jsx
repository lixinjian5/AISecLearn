import SpotlightCard from '../../components/react-bits/SpotlightCard'
import GradientText from '../../components/react-bits/GradientText'
import ShinyText from '../../components/react-bits/ShinyText'
import Counter from '../../components/react-bits/Counter'
import Magnet from '../../components/react-bits/Magnet'
import ClickBurst from '../../components/react-bits/ClickBurst'
import BorderGlow from '../../components/react-bits/BorderGlow'
import FadeContent from '../../components/react-bits/FadeContent'
import Lanyard from '../../components/react-bits/Lanyard'

export default function Dashboard() {
  return (
    <div className="relative">
      {/* 右上角 3D 工牌挂件 */}
      <div className="absolute inset-0 z-20" style={{ pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}>
          <Lanyard position={[5, 3, 20]} gravity={[0, -25, 0]} fov={18} />
        </div>
      </div>

      <div className="space-y-8 p-6">
        {/* ===== 欢迎区 ===== */}
        <FadeContent blur={true} duration={600}>
          <div>
            <GradientText colors={['#6366f1', '#06b6d4', '#8b5cf6']} animationSpeed={5} className="text-2xl font-bold">
              欢迎回来，李欣键 👋
            </GradientText>
            <ShinyText text="今天继续学习网络安全吧" speed={3} className="text-sm mt-2 block" color="#6b7280" shineColor="#a5b4fc" spread={80} />
          </div>
        </FadeContent>

        {/* ===== 统计卡片 ===== */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: '今日学习进度', value: 68, suffix: '%', icon: '📊', color: 'rgba(99, 102, 241, 0.15)' },
            { label: '连续学习', value: 7, suffix: ' 天', icon: '🔥', color: 'rgba(6, 182, 212, 0.15)' },
            { label: '累计学习', value: 32, suffix: ' 小时', icon: '⏱️', color: 'rgba(139, 92, 246, 0.15)' },
            { label: '完成题目', value: 126, suffix: ' 道', icon: '✅', color: 'rgba(34, 211, 238, 0.15)' },
          ].map((stat, i) => (
            <FadeContent key={i} blur={true} duration={500} delay={i * 80}>
              <SpotlightCard className="!rounded-2xl !p-5 !bg-gray-900/60 !border-gray-800/30" spotlightColor={stat.color}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-gray-500">{stat.label}</span>
                  <span className="text-lg">{stat.icon}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <Counter value={stat.value} fontSize={32} padding={4} gap={6} textColor="#fff" fontWeight="800" gradientHeight={0} />
                  <span className="text-sm text-gray-400">{stat.suffix}</span>
                </div>
              </SpotlightCard>
            </FadeContent>
          ))}
        </div>

        {/* ===== 继续学习 + AI 助手 ===== */}
        <div className="grid grid-cols-2 gap-4">
          <FadeContent blur={true} duration={600} delay={400}>
            <div className="rounded-2xl bg-gray-900/60 border border-gray-800/30 p-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">📚 继续学习</h3>
              <div className="space-y-3">
                {[
                  { name: 'SQL 注入基础', progress: 68, color: 'from-primary-500 to-cyber-500' },
                  { name: 'XSS 跨站脚本', progress: 42, color: 'from-amber-500 to-orange-500' },
                  { name: 'CSRF 攻击与防御', progress: 15, color: 'from-emerald-500 to-teal-500' },
                ].map((course, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-gray-800/20 hover:border-gray-700/40 cursor-pointer transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 truncate">{course.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${course.color} transition-all`} style={{ width: `${course.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 w-8 text-right">{course.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeContent>

          <FadeContent blur={true} duration={600} delay={600}>
            <BorderGlow className="!rounded-2xl" backgroundColor="#111827" borderRadius={16} glowColor="99 102 241" glowIntensity={0.8} glowRadius={30} colors={['#6366f1', '#8b5cf6', '#06b6d4']}>
              <div className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-cyber-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">AI 学习助手</h3>
                  <p className="text-sm text-gray-500 mt-1">不知道今天学什么？让 AI 为你制定学习计划</p>
                </div>
                <ClickBurst>
                  <Magnet padding={60} magnetStrength={20}>
                    <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-cyber-600 text-white text-sm font-medium hover:from-primary-500 hover:to-cyber-500 transition-all shadow-lg shadow-primary-500/25">
                      开始学习 →
                    </button>
                  </Magnet>
                </ClickBurst>
              </div>
            </BorderGlow>
          </FadeContent>
        </div>

        {/* ===== 底部：学习趋势 + 最近错题 ===== */}
        <div className="grid grid-cols-2 gap-4">
          <FadeContent blur={true} duration={600} delay={800}>
            <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(99, 102, 241, 0.10)">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">📈 学习趋势</h3>
              <div className="h-40 flex items-end justify-between gap-2 px-2">
                {[35, 42, 28, 55, 48, 62, 68].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full rounded-t-md bg-gradient-to-t from-primary-600/60 to-cyber-500/40" style={{ height: `${h}%` }} />
                    <span className="text-[10px] text-gray-600">{['一','二','三','四','五','六','日'][i]}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </FadeContent>

          <FadeContent blur={true} duration={600} delay={1000}>
            <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(239, 68, 68, 0.08)">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">📝 最近错题</h3>
              <div className="space-y-2">
                {[
                  { q: '布尔盲注的判断依据是什么？', cat: 'SQL注入', time: '昨天' },
                  { q: 'XSS 中 DOM 型和反射型的区别？', cat: 'XSS', time: '2天前' },
                  { q: 'CSRF Token 应该放在哪里？', cat: 'CSRF', time: '3天前' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-gray-800/20 hover:border-gray-700/40 cursor-pointer transition-colors">
                    <span className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 text-xs shrink-0">✕</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 truncate">{item.q}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{item.cat} · {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </FadeContent>
        </div>
      </div>
    </div>
  )
}
