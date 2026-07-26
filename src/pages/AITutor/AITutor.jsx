import SpotlightCard from '../../components/react-bits/SpotlightCard'
import GradientText from '../../components/react-bits/GradientText'
import Magnet from '../../components/react-bits/Magnet'
import FadeContent from '../../components/react-bits/FadeContent'
import Counter from '../../components/react-bits/Counter'

export default function AITutor() {
  return (
    <div className="flex h-full gap-0 -m-6">
      {/* ===== 左栏：导师信息 — SpotlightCard ===== */}
      <aside className="w-[260px] shrink-0 border-r border-gray-800/40 p-4 flex flex-col gap-4">
        <SpotlightCard className="!rounded-2xl !p-5 !bg-gray-900/80 !border-gray-800/40" spotlightColor="rgba(99, 102, 241, 0.20)">
          {/* 头像 + 状态 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-cyber-500 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <GradientText
              colors={['#6366f1', '#06b6d4', '#8b5cf6']}
              animationSpeed={4}
              className="text-lg font-semibold"
            >
              AI Cyber Tutor
            </GradientText>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-green-500/30" />
              <span className="text-xs text-gray-400">在线</span>
            </div>
          </div>
        </SpotlightCard>

        {/* 当前课程 + 进度 */}
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

        {/* 学习统计 — Counter 数字动画 */}
        <div className="space-y-3 pt-3 border-t border-gray-800/40">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">今日学习</span>
            <span className="text-white font-medium">
              <Counter value={45} fontSize={16} padding={0} gap={2} textColor="#fff" gradientFrom="#111827" gradientTo="transparent" />
              <span className="text-xs text-gray-500 ml-0.5">分钟</span>
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">连续天数</span>
            <span className="text-white font-medium">
              <Counter value={7} fontSize={16} padding={0} gap={2} textColor="#fff" gradientFrom="#111827" gradientTo="transparent" />
              <span className="text-xs text-gray-500 ml-0.5">天</span>
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">完成题目</span>
            <span className="text-white font-medium">
              <Counter value={126} fontSize={16} padding={0} gap={2} textColor="#fff" gradientFrom="#111827" gradientTo="transparent" />
              <span className="text-xs text-gray-500 ml-0.5">道</span>
            </span>
          </div>
        </div>
      </aside>

      {/* ===== 中栏：聊天区 ===== */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI 欢迎消息 — FadeContent 入场动画 */}
          <FadeContent blur={true} duration={800} initialOpacity={0}>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyber-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <div className="max-w-[70%]">
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-800/60 text-gray-200 text-sm leading-relaxed">
                  你好！我是 AI Cyber Tutor，你的网络安全学习伙伴。
                  <br />
                  你之前学了 <span className="text-primary-400 font-medium">SQL 注入基础</span>，其中
                  <span className="text-amber-400 font-medium">布尔盲注</span> 部分掌握得还不够扎实。
                  <br /><br />
                  今天想巩固一下，还是继续学新内容？
                </div>
                <p className="text-xs text-gray-600 mt-1 ml-1">刚刚</p>
              </div>
            </div>
          </FadeContent>
        </div>

        {/* 输入框 — Magnet 吸附按钮 */}
        <div className="p-4 border-t border-gray-800/40">
          <div className="flex items-center gap-3 bg-gray-900/60 border border-gray-700/50 rounded-xl px-4 py-3 focus-within:border-primary-500/50 transition-colors">
            <input
              type="text"
              placeholder="输入你的问题..."
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
            />
            <Magnet padding={50} magnetStrength={10}>
              <button className="p-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </Magnet>
          </div>
        </div>
      </main>

      {/* ===== 右栏：学习上下文 — SpotlightCard ===== */}
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
