import { useState, useRef, useEffect } from 'react'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import GradientText from '../../components/react-bits/GradientText'
import Magnet from '../../components/react-bits/Magnet'
import FadeContent from '../../components/react-bits/FadeContent'
import Counter from '../../components/react-bits/Counter'
import { useChat } from '../../hooks/useChat'

export default function AITutor() {
  const { messages, isLoading, sendMessage } = useChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full gap-0">
      {/* ===== 左栏：导师信息 ===== */}
      <aside className="w-[260px] shrink-0 border-r border-gray-800/40 p-4 flex flex-col gap-4">
        <SpotlightCard className="!rounded-2xl !p-5 !bg-gray-900/80 !border-gray-800/40" spotlightColor="rgba(99, 102, 241, 0.20)">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-cyber-500 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <GradientText colors={['#6366f1', '#06b6d4', '#8b5cf6']} animationSpeed={4} className="text-lg font-semibold">
              AI Cyber Tutor
            </GradientText>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ring-2 ${isLoading ? 'bg-amber-500 ring-amber-500/30' : 'bg-green-500 ring-green-500/30'}`} />
              <span className="text-xs text-gray-400">{isLoading ? '回复中...' : '在线'}</span>
            </div>
          </div>
        </SpotlightCard>

        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800/40">
            <p className="text-xs text-gray-500 mb-1">当前课程</p>
            <p className="text-sm font-medium text-white">SQL 注入基础</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">学习进度</span>
              <span className="text-primary-400 font-medium">62%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
              <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-primary-500 to-cyber-500" />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-gray-800/40">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">今日学习</span>
            <span className="text-white font-medium">
              <Counter value={45} fontSize={16} padding={0} gap={2} textColor="#fff" gradientFrom="#111827" gradientTo="transparent" /> <span className="text-xs text-gray-500">分钟</span>
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">连续天数</span>
            <span className="text-white font-medium">
              <Counter value={7} fontSize={16} padding={0} gap={2} textColor="#fff" gradientFrom="#111827" gradientTo="transparent" /> <span className="text-xs text-gray-500">天</span>
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">完成题目</span>
            <span className="text-white font-medium">
              <Counter value={126} fontSize={16} padding={0} gap={2} textColor="#fff" gradientFrom="#111827" gradientTo="transparent" /> <span className="text-xs text-gray-500">道</span>
            </span>
          </div>
        </div>
      </aside>

      {/* ===== 中栏：聊天区 ===== */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 没有消息时显示欢迎语 */}
          {messages.length === 0 && (
            <FadeContent blur={true} duration={800} initialOpacity={0}>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyber-500 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <div className="max-w-[70%]">
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-800/60 text-gray-200 text-sm leading-relaxed">
                    你好！我是 AI Cyber Tutor，你的网络安全学习伙伴 👋
                    <br /><br />
                    我可以帮你：
                    <br />• 讲解 SQL 注入、XSS、CSRF 等安全概念
                    <br />• 分析代码中的安全漏洞
                    <br />• 出题测试你的安全知识
                    <br />• 推荐学习路线
                    <br /><br />
                    想从哪开始？
                  </div>
                </div>
              </div>
            </FadeContent>
          )}

          {/* 聊天消息列表 */}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* 头像 */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-gray-700'
                  : 'bg-gradient-to-br from-primary-500 to-cyber-500'
              }`}>
                {msg.role === 'user' ? (
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                )}
              </div>

              {/* 消息气泡 */}
              <div className="max-w-[70%]">
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-primary-600/30 text-gray-200 rounded-tr-sm'
                    : msg.isError
                      ? 'bg-red-900/30 text-red-300 rounded-tl-sm'
                      : 'bg-gray-800/60 text-gray-200 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* 加载中 */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyber-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-800/60">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 输入框 */}
        <div className="p-4 border-t border-gray-800/40">
          <div className="flex items-center gap-3 bg-gray-900/60 border border-gray-700/50 rounded-xl px-4 py-3 focus-within:border-primary-500/50 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? 'AI 正在回复...' : '输入你的问题...'}
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none disabled:opacity-50"
            />
            <Magnet padding={50} magnetStrength={10}>
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </Magnet>
          </div>
        </div>
      </main>

      {/* ===== 右栏：学习上下文 ===== */}
      <aside className="w-[260px] shrink-0 border-l border-gray-800/40 p-4 space-y-4">
        <SpotlightCard className="!rounded-2xl !p-4 !bg-gray-900/80 !border-gray-800/40" spotlightColor="rgba(6, 182, 212, 0.15)">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3">当前知识点</h3>
          <p className="text-sm font-medium text-white">SQL Injection</p>
          <p className="text-xs text-gray-500 mt-1">结构化查询语言注入攻击</p>
        </SpotlightCard>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3">学习目标</h3>
          <ul className="space-y-2">
            {['理解 SQL 注入原理', '掌握参数化查询防御', '完成注入实验练习'].map((goal, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 mt-0.5 text-cyber-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                </svg>
                {goal}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3">相关题目</h3>
          <div className="space-y-2">
            {[
              { q: 'SQL 注入的原理', d: '基础' },
              { q: '参数化查询的作用', d: '进阶' },
              { q: '联合查询注入实操', d: '实战' },
            ].map((item, i) => (
              <SpotlightCard key={i} className="!rounded-xl !p-3 !bg-gray-900/60 !border-gray-800/40" spotlightColor="rgba(139, 92, 246, 0.12)">
                <p className="text-sm text-gray-300">{item.q}</p>
                <p className="text-xs text-gray-600 mt-1">{item.d}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
