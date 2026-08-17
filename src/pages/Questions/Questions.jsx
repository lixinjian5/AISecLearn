import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import Magnet from '../../components/react-bits/Magnet'
import { api } from '../../services/api'

const cats = ['全部','SQL注入','XSS','CSRF','文件上传','命令执行','密码学','认证安全','网络安全']
const diffColors = {'入门':'bg-emerald-500/20 text-emerald-400','进阶':'bg-amber-500/20 text-amber-400','实战':'bg-red-500/20 text-red-400'}

export default function Questions() {
  const [questions, setQuestions] = useState([])
  const [activeCat, setActiveCat] = useState('全部')
  const [showAnswer, setShowAnswer] = useState({})

  useEffect(() => {
    api.getQuestions({ page_size: 100, include_answer: true })
      .then(res => setQuestions(res.data || []))
      .catch(() => setQuestions([]))
  }, [])

  const filtered = activeCat === '全部' ? questions : questions.filter(q => q.category === activeCat)

  return (
    <div className="p-6 space-y-6">
      <FadeContent blur={true} duration={500}>
        <GradientText colors={['#6366f1','#06b6d4','#8b5cf6']} animationSpeed={6} className="text-2xl font-bold">
          题库
        </GradientText>
        <p className="text-sm text-gray-500 mt-1">浏览全部题目（共 {questions.length} 道），点击查看答案</p>
      </FadeContent>

      {/* 分类 */}
      <FadeContent blur={true} duration={400} delay={100}>
        <div className="flex gap-2 flex-wrap">
          {cats.map(cat => (
            <Magnet key={cat} padding={30} magnetStrength={20}>
              <button onClick={() => setActiveCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${activeCat===cat?'bg-primary-600/30 text-primary-400 border border-primary-500/40':'bg-gray-900/60 text-gray-400 border border-gray-800/40 hover:border-gray-700/50'}`}
              >{cat}</button>
            </Magnet>
          ))}
        </div>
      </FadeContent>

      {/* 题目列表 */}
      <div className="space-y-3">
        {filtered.map((q,i) => (
          <FadeContent key={q.id} blur={true} duration={400} delay={i*40}>
            <SpotlightCard className="!rounded-2xl !p-5 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(99,102,241,0.08)">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-600/20 text-primary-400">{q.category}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${diffColors[q.difficulty] || 'bg-gray-700/40 text-gray-400'}`}>{q.difficulty}</span>
                <span className="text-[10px] text-gray-600 ml-auto">#{q.id}</span>
              </div>
              <p className="text-sm text-white mb-2">{q.question}</p>
              {q.code && <pre className="text-xs bg-gray-950/80 text-gray-300 p-3 rounded-xl mb-3 border border-gray-800/40 font-mono overflow-x-auto">{q.code}</pre>}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {(q.options || []).map((o,j) => (
                  <span key={j} className="text-[11px] px-2 py-1 rounded-lg bg-gray-900/60 text-gray-500 border border-gray-800/30">{o}</span>
                ))}
              </div>
              <button onClick={() => setShowAnswer(prev=>({...prev,[q.id]:!prev[q.id]}))}
                className="text-xs text-gray-600 hover:text-primary-400 transition-colors"
              >
                {showAnswer[q.id] ? `✅ 答案：${q.options?.[q.answer] || '未知'}` : '点击查看答案'}
              </button>
              {showAnswer[q.id] && (
                <div className="mt-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400">
                  <Link to="/practice" className="hover:underline">去练习中心做题 →</Link>
                </div>
              )}
            </SpotlightCard>
          </FadeContent>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-sm text-gray-600">暂无题目</div>
        )}
      </div>
    </div>
  )
}
