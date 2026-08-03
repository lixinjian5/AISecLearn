import { useState } from 'react'
import { getWrongQuestions, removeWrongQuestion, clearWrongQuestions } from '../../utils/wrongQuestions'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import Counter from '../../components/react-bits/Counter'

const diffTag = (d) => {
  if (d === '入门') return 'bg-emerald-500/20 text-emerald-400'
  if (d === '进阶') return 'bg-amber-500/20 text-amber-400'
  return 'bg-red-500/20 text-red-400'
}

export default function WrongQuestions() {
  const [list, setList] = useState(getWrongQuestions)
  const [expanded, setExpanded] = useState(null)

  const handleRemove = (id) => {
    removeWrongQuestion(id)
    setList(getWrongQuestions)
  }

  const handleClear = () => {
    clearWrongQuestions()
    setList([])
  }

  // 分类统计
  const catStats = {}
  list.forEach(q => {
    catStats[q.category] = (catStats[q.category] || 0) + 1
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <FadeContent blur={true} duration={500}>
          <GradientText colors={['#6366f1', '#06b6d4', '#8b5cf6']} animationSpeed={6} className="text-2xl font-bold">
            错题本
          </GradientText>
          <p className="text-sm text-gray-500 mt-1">回顾错题，查漏补缺</p>
        </FadeContent>

        {list.length > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20 transition-colors"
          >
            清空全部
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <FadeContent blur={true} duration={500}>
          <SpotlightCard className="!rounded-2xl !p-10 !bg-gray-900/60 !border-gray-800/30 flex flex-col items-center" spotlightColor="rgba(99,102,241,0.06)">
            <span className="text-4xl mb-4">🎉</span>
            <p className="text-gray-400 text-sm">错题本空空如也</p>
            <p className="text-gray-600 text-xs mt-1">去练习中心做题吧，答错的会自动出现在这里</p>
          </SpotlightCard>
        </FadeContent>
      ) : (
        <>
          {/* 统计概览 */}
          <FadeContent blur={true} duration={400}>
            <div className="grid grid-cols-4 gap-3">
              <SpotlightCard className="!rounded-xl !p-4 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(239,68,68,0.08)">
                <p className="text-xs text-gray-500 mb-1">错题总数</p>
                <Counter value={list.length} fontSize={24} padding={2} gap={4} textColor="#fff" fontWeight="700" gradientHeight={0} />
              </SpotlightCard>
              {Object.entries(catStats).slice(0, 3).map(([cat, count]) => (
                <SpotlightCard key={cat} className="!rounded-xl !p-4 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(239,68,68,0.06)">
                  <p className="text-xs text-gray-500 mb-1">{cat}</p>
                  <Counter value={count} fontSize={24} padding={2} gap={4} textColor="#fff" fontWeight="700" gradientHeight={0} />
                  <span className="text-[10px] text-gray-600">道</span>
                </SpotlightCard>
              ))}
            </div>
          </FadeContent>

          {/* 错题列表 */}
          <div className="space-y-3">
            {list.map((q, i) => (
              <FadeContent key={q.id} blur={true} duration={400} delay={i * 60}>
                <SpotlightCard className="!rounded-2xl !p-5 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(239,68,68,0.06)">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">{q.category}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${diffTag(q.difficulty)}`}>{q.difficulty}</span>
                      <span className="text-[10px] text-gray-600">{q.time}</span>
                    </div>
                    <button
                      onClick={() => handleRemove(q.id)}
                      className="text-xs text-gray-600 hover:text-red-400 transition-colors"
                    >
                      移除
                    </button>
                  </div>

                  <p className="text-sm text-white mb-3">{q.question}</p>

                  {q.code && (
                    <pre className="text-xs bg-gray-950/80 text-gray-300 p-3 rounded-xl mb-3 border border-gray-800/40 font-mono">{q.code}</pre>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <p className="text-[10px] text-red-400 mb-1">你的答案</p>
                      <p className="text-sm text-red-300">{q.options[q.userAnswer]}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-[10px] text-emerald-400 mb-1">正确答案</p>
                      <p className="text-sm text-emerald-300">{q.options[q.answer]}</p>
                    </div>
                  </div>

                  {expanded === q.id && (
                    <div className="text-xs text-gray-500 leading-relaxed p-3 rounded-xl bg-gray-900/40">
                      去练习中心重新做这道题，AI 会给你详细解析。
                    </div>
                  )}
                </SpotlightCard>
              </FadeContent>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
