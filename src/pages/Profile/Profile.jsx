import Lanyard from '../../components/react-bits/Lanyard'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import Counter from '../../components/react-bits/Counter'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import { auth } from '../../services/api'

export default function Profile() {
  const user = auth.getUser()
  const username = user?.username || '未登录'
  return (
    <div className="flex h-full -m-6">
      {/* 左侧：3D Lanyard 工牌 */}
      <div className="w-[55%] relative bg-[#0a0a12]">
        <Lanyard position={[0, 0, 22]} gravity={[0, -30, 0]} fov={18} />
      </div>

      {/* 右侧：个人信息面板 */}
      <div className="w-[45%] overflow-y-auto p-8 space-y-6">
        <FadeContent blur={true} duration={500}>
          <div>
            <GradientText colors={['#6366f1', '#06b6d4', '#8b5cf6']} animationSpeed={5} className="text-xl font-bold">
              个人中心
            </GradientText>
          </div>
        </FadeContent>

        {/* 用户信息 */}
        <FadeContent blur={true} duration={400} delay={100}>
          <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(99, 102, 241, 0.12)">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-cyber-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/20">
                L
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{username}</h2>
                <p className="text-sm text-gray-500">AISecLearn 注册用户</p>
                <p className="text-xs text-primary-400 mt-1">{user?.role === 'admin' ? '管理员' : '安全学员'}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              热爱 AI 与网络安全，正在通过 AISecLearn 系统学习 Web 安全知识。
              目标是成为一名 AI 安全工程师。
            </p>
          </SpotlightCard>
        </FadeContent>

        {/* 学习统计 */}
        <FadeContent blur={true} duration={400} delay={200}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3">学习统计</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '累计学习', value: 32, suffix: ' 小时', icon: '⏱️' },
              { label: '完成课程', value: 8, suffix: ' 门', icon: '📚' },
              { label: '完成题目', value: 126, suffix: ' 道', icon: '✅' },
              { label: '连续学习', value: 7, suffix: ' 天', icon: '🔥' },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-900/60 border border-gray-800/30">
                <span className="text-lg mb-2 block">{s.icon}</span>
                <div className="flex items-baseline gap-1">
                  <Counter value={s.value} fontSize={22} padding={0} gap={3} textColor="#fff" fontWeight="700" gradientHeight={0} />
                  <span className="text-xs text-gray-500">{s.suffix}</span>
                </div>
                <p className="text-[10px] text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </FadeContent>

        {/* 成就 */}
        <FadeContent blur={true} duration={400} delay={300}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3">成就徽章</h3>
          <div className="flex gap-3 flex-wrap">
            {[
              { emoji: '🌟', name: '初出茅庐', desc: '完成第一节课程' },
              { emoji: '🔥', name: '持之以恒', desc: '连续学习7天' },
              { emoji: '💯', name: '满分达人', desc: '一次练习全对' },
              { emoji: '🎯', name: '百题斩', desc: '完成100道题目' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800/30">
                <span className="text-xl">{a.emoji}</span>
                <div>
                  <p className="text-xs font-medium text-white">{a.name}</p>
                  <p className="text-[10px] text-gray-600">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeContent>
      </div>
    </div>
  )
}
