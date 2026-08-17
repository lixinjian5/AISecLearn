import { useState, useEffect } from 'react'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import Counter from '../../components/react-bits/Counter'
import { api } from '../../services/api'

const roleColors = {
  'admin': 'bg-primary-600/20 text-primary-400',
  'student': 'bg-gray-700/30 text-gray-400',
}

export default function Admin() {
  const [stats, setStats] = useState({ users: 0, questions: 0, courses: 0, learning_records: 0 })
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.getAdminStats().then(setStats).catch(() => {})
    api.getAdminUsers().then(setUsers).catch(() => {})
  }, [])

  const statCards = [
    { label: '注册用户', value: stats.users, suffix: ' 人', icon: '👥', color: 'rgba(99,102,241,0.15)' },
    { label: '课程总数', value: stats.courses, suffix: ' 门', icon: '📚', color: 'rgba(6,182,212,0.15)' },
    { label: '题目总数', value: stats.questions, suffix: ' 道', icon: '📝', color: 'rgba(34,211,238,0.15)' },
    { label: '答题记录', value: stats.learning_records, suffix: ' 条', icon: '📊', color: 'rgba(139,92,246,0.15)' },
  ]

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
        {statCards.map((s, i) => (
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
            <h3 className="text-sm font-semibold text-gray-300">👥 用户管理（{users.length}）</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-600 border-b border-gray-800/40">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">用户</th>
                  <th className="pb-3 font-medium">角色</th>
                  <th className="pb-3 font-medium">等级</th>
                  <th className="pb-3 font-medium text-right">注册时间</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-800/20 last:border-0">
                    <td className="py-3 text-gray-600">{u.id}</td>
                    <td className="py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
                        {(u.username || '?')[0].toUpperCase()}
                      </div>
                      <span className="text-gray-300">{u.username}</span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${roleColors[u.role] || 'bg-gray-700/30 text-gray-400'}`}>
                        {u.role === 'admin' ? '管理员' : '学员'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">Lv.{u.level}</td>
                    <td className="py-3 text-right text-gray-600 text-xs">
                      {u.created_at ? u.created_at.slice(0, 10) : '-'}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-600 text-sm">暂无用户数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SpotlightCard>
      </FadeContent>
    </div>
  )
}
