import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import Counter from '../../components/react-bits/Counter'

const stats = [
  { label: '注册用户', value: 128, suffix: ' 人', icon: '👥', color: 'rgba(99,102,241,0.15)' },
  { label: '课程总数', value: 12, suffix: ' 门', icon: '📚', color: 'rgba(6,182,212,0.15)' },
  { label: '题目总数', value: 15, suffix: ' 道', icon: '📝', color: 'rgba(34,211,238,0.15)' },
  { label: '今日活跃', value: 36, suffix: ' 人', icon: '🔥', color: 'rgba(139,92,246,0.15)' },
]

const users = [
  { id: 1, name: '李欣键', role: '管理员', level: 'Lv.12', questions: 126, accuracy: '72%', status: '在线' },
  { id: 2, name: '邓倬言', role: '开发者', level: 'Lv.8', questions: 64, accuracy: '68%', status: '离线' },
  { id: 3, name: '测试用户A', role: '学员', level: 'Lv.5', questions: 30, accuracy: '55%', status: '在线' },
  { id: 4, name: '测试用户B', role: '学员', level: 'Lv.3', questions: 12, accuracy: '48%', status: '离线' },
  { id: 5, name: '测试用户C', role: '学员', level: 'Lv.1', questions: 3, accuracy: '33%', status: '离线' },
]

const roleColors = {
  '管理员': 'bg-primary-600/20 text-primary-400',
  '开发者': 'bg-cyber-500/20 text-cyber-400',
  '学员': 'bg-gray-700/30 text-gray-400',
}

export default function Admin() {
  return (
    <div className="p-6 space-y-6">
      <FadeContent blur={true} duration={500}>
        <GradientText colors={['#6366f1','#06b6d4','#8b5cf6']} animationSpeed={6} className="text-2xl font-bold">
          后台管理
        </GradientText>
        <p className="text-sm text-gray-500 mt-1">平台运营数据与用户管理</p>
      </FadeContent>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <FadeContent key={i} blur={true} duration={400} delay={i*80}>
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

      {/* 用户管理 */}
      <FadeContent blur={true} duration={500} delay={300}>
        <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(99,102,241,0.08)">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300">👥 用户管理</h3>
            <button className="px-3 py-1.5 rounded-xl bg-primary-600/20 text-primary-400 border border-primary-500/30 text-xs hover:bg-primary-600/30 transition-colors">
              + 添加用户
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-600 border-b border-gray-800/40">
                  <th className="pb-3 font-medium">用户</th>
                  <th className="pb-3 font-medium">角色</th>
                  <th className="pb-3 font-medium">等级</th>
                  <th className="pb-3 font-medium text-right">做题数</th>
                  <th className="pb-3 font-medium text-right">正确率</th>
                  <th className="pb-3 font-medium text-right">状态</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-800/20 last:border-0">
                    <td className="py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
                        {u.name[0]}
                      </div>
                      <span className="text-gray-300">{u.name}</span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${roleColors[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="py-3 text-gray-400">{u.level}</td>
                    <td className="py-3 text-right text-gray-400">{u.questions}</td>
                    <td className="py-3 text-right text-gray-400">{u.accuracy}</td>
                    <td className="py-3 text-right">
                      <span className="flex items-center justify-end gap-1.5 text-xs">
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === '在线' ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                        <span className="text-gray-500">{u.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpotlightCard>
      </FadeContent>
    </div>
  )
}
