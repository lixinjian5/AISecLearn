import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import Magnet from '../../components/react-bits/Magnet'

const labs = {
  'sql-injection': {
    title: 'SQL 注入实验', icon: '💉', difficulty: '入门',
    desc: '目标是一个有漏洞的登录页面。尝试用 SQL 注入绕过登录验证，以管理员身份进入系统。',
    objectives: [
      '理解 SQL 注入的产生原因',
      '构造绕过登录的注入语句',
      '掌握参数化查询防御方法',
    ],
    hints: [
      "提示1：用户名输入 admin' -- 试试",
      "提示2：观察 SQL 语句是如何拼接的",
      "提示3：-- 是 SQL 注释符，可以注释掉后面的密码验证",
    ],
  },
  'xss': {
    title: 'XSS 攻防挑战', icon: '⚠️', difficulty: '进阶',
    desc: '目标是一个留言板。尝试注入恶意脚本，让其他用户浏览时执行你的代码。',
    objectives: [
      '理解反射型 XSS 原理',
      '构造 script 标签注入',
      '掌握 HTML 实体转义防御',
    ],
    hints: [
      "提示1：在留言框输入 <script>alert(1)</script>",
      "提示2：观察留言如何被输出到页面",
    ],
  },
  'csrf': {
    title: 'CSRF 攻击实验', icon: '🛡️', difficulty: '入门',
    desc: '目标是一个银行转账页面。尝试构造恶意请求，利用受害者的登录态完成转账。',
    objectives: [
      '理解 CSRF 攻击原理',
      '构造恶意请求',
      '掌握 CSRF Token 防御',
    ],
    hints: [
      "提示1：CSRF 利用的是浏览器自动携带 Cookie",
      "提示2：伪造一个转账请求的链接",
    ],
  },
  'file-upload': {
    title: '文件上传绕过', icon: '📤', difficulty: '进阶',
    desc: '目标是一个文件上传功能。尝试绕过上传限制，上传一个恶意脚本。',
    objectives: [
      '理解文件上传漏洞',
      '绕过前端验证',
      '掌握白名单验证防御',
    ],
    hints: [
      "提示1：先尝试上传 .php 文件看有什么反应",
      "提示2：试试改后缀名绕过",
    ],
  },
}

const defaultLab = {
  title: '实验环境', icon: '🧪', difficulty: '入门',
  desc: '实验环境准备中...',
  objectives: ['待补充'],
  hints: ['待补充'],
}

export default function LabDetail() {
  const { id } = useParams()
  const lab = labs[id] || defaultLab
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginResult, setLoginResult] = useState('')
  const [hintIndex, setHintIndex] = useState(0)
  const [flag, setFlag] = useState('')
  const [flagResult, setFlagResult] = useState('')

  // 模拟登录（检测 SQL 注入）
  const handleLogin = () => {
    const isInjection = username.includes("'") || username.toLowerCase().includes('or')
    if (isInjection) {
      setLoginResult('✅ 注入成功！你以管理员身份登录了系统。\n\n[执行的 SQL]\nSELECT * FROM users WHERE username = \'' + username + '\' AND password = \'' + password + '\'\n\n[漏洞原因] 用户输入被直接拼接进 SQL 语句，没有参数化。')
    } else if (username === 'admin' && password === 'admin123') {
      setLoginResult('✅ 登录成功（这是预设的弱口令，不是注入）')
    } else {
      setLoginResult('❌ 登录失败，用户名或密码错误。\n\n提示：试试用 SQL 注入绕过验证。')
    }
  }

  const handleSubmitFlag = () => {
    if (flag === 'flag{sql_injection_bypass}') {
      setFlagResult('🎉 通关！Flag 正确！')
    } else {
      setFlagResult('❌ Flag 错误，继续尝试')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 头部 */}
      <FadeContent blur={true} duration={500}>
        <Link to="/security-lab" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">← 返回靶场</Link>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-3xl">{lab.icon}</span>
          <div>
            <GradientText colors={['#06b6d4','#6366f1','#8b5cf6']} animationSpeed={5} className="text-xl font-bold">
              {lab.title}
            </GradientText>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 ml-2">{lab.difficulty}</span>
          </div>
        </div>
      </FadeContent>

      <div className="grid grid-cols-2 gap-6">
        {/* 左侧：任务说明 */}
        <div className="space-y-4">
          <FadeContent blur={true} duration={400} delay={100}>
            <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(6,182,212,0.08)">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">📋 任务描述</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{lab.desc}</p>
              <h4 className="text-xs font-semibold text-gray-500 mb-2">学习目标</h4>
              <ul className="space-y-2 mb-4">
                {lab.objectives.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4 mt-0.5 text-cyber-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                    </svg>
                    {o}
                  </li>
                ))}
              </ul>
              <button onClick={() => setHintIndex(i => Math.min(i + 1, lab.hints.length - 1))}
                className="text-xs text-gray-600 hover:text-cyber-400 transition-colors">
                💡 查看提示（{hintIndex}/{lab.hints.length}）
              </button>
              {hintIndex > 0 && (
                <div className="mt-2 space-y-1">
                  {lab.hints.slice(0, hintIndex).map((h, i) => (
                    <p key={i} className="text-xs text-amber-400/80">{h}</p>
                  ))}
                </div>
              )}
            </SpotlightCard>
          </FadeContent>

          {/* Flag 提交 */}
          <FadeContent blur={true} duration={400} delay={200}>
            <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(139,92,246,0.08)">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">🏁 提交 Flag</h3>
              <div className="flex gap-2">
                <input value={flag} onChange={e => setFlag(e.target.value)}
                  placeholder="flag{...}" className="flex-1 bg-gray-950/80 border border-gray-800/40 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-primary-500/50" />
                <Magnet padding={30} magnetStrength={15}>
                  <button onClick={handleSubmitFlag} className="px-4 py-2.5 rounded-xl bg-primary-600/30 text-primary-400 border border-primary-500/30 text-sm hover:bg-primary-600/50 transition-colors">提交</button>
                </Magnet>
              </div>
              {flagResult && <p className="text-sm mt-3 text-gray-300">{flagResult}</p>}
            </SpotlightCard>
          </FadeContent>
        </div>

        {/* 右侧：模拟实验环境 */}
        <FadeContent blur={true} duration={400} delay={300}>
          <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(6,182,212,0.08)">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">🖥️ 实验环境（模拟）</h3>
            {/* 模拟浏览器窗口 */}
            <div className="rounded-xl border border-gray-800/40 overflow-hidden">
              <div className="flex items-center gap-1.5 bg-gray-800/60 px-3 py-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 text-[10px] text-gray-500 font-mono">http://target-lab.local/login</span>
              </div>
              <div className="p-6 bg-gray-950/60">
                <p className="text-xs text-gray-500 mb-4 text-center">🔒 管理员登录</p>
                <div className="space-y-3 max-w-[280px] mx-auto">
                  <input value={username} onChange={e => setUsername(e.target.value)}
                    placeholder="用户名" className="w-full bg-gray-900/60 border border-gray-800/40 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary-500/50 font-mono" />
                  <input value={password} onChange={e => setPassword(e.target.value)}
                    type="password" placeholder="密码" className="w-full bg-gray-900/60 border border-gray-800/40 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary-500/50 font-mono" />
                  <button onClick={handleLogin} className="w-full py-2 rounded-lg bg-primary-600/30 text-primary-400 border border-primary-500/30 text-sm hover:bg-primary-600/50 transition-colors">
                    登录
                  </button>
                </div>
              </div>
            </div>

            {/* 结果 */}
            {loginResult && (
              <div className="mt-4 p-4 rounded-xl bg-gray-950/60 border border-gray-800/40 font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                {loginResult}
              </div>
            )}
          </SpotlightCard>
        </FadeContent>
      </div>
    </div>
  )
}
