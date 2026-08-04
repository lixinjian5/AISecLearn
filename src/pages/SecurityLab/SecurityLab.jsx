import { Link } from 'react-router-dom'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import BorderGlow from '../../components/react-bits/BorderGlow'
import Magnet from '../../components/react-bits/Magnet'
import Threads from '../../components/react-bits/Threads'

const labs = [
  { id: 'sql-injection', title: 'SQL 注入实验', category: 'Web 安全', difficulty: '入门', time: '30分钟', status: 'available', icon: '💉', desc: '从数字型到时间盲注，6个关卡逐步深入，在真实数据库环境中练习 SQL 注入技巧' },
  { id: 'xss', title: 'XSS 攻防挑战', category: 'Web 安全', difficulty: '进阶', time: '45分钟', status: 'available', icon: '⚠️', desc: '反射型、存储型、DOM型 XSS——在模拟留言板中完成注入挑战' },
  { id: 'csrf', title: 'CSRF 攻击实验', category: 'Web 安全', difficulty: '入门', time: '25分钟', status: 'available', icon: '🛡️', desc: '在银行转账场景中体验 CSRF 攻击，亲手构造恶意请求' },
  { id: 'file-upload', title: '文件上传绕过', category: 'Web 安全', difficulty: '进阶', time: '40分钟', status: 'available', icon: '📤', desc: '前端验证、后缀绕过、MIME 绕过——逐层突破上传限制' },
  { id: 'command-injection', title: '命令注入实验', category: '系统安全', difficulty: '高级', time: '50分钟', status: 'coming', icon: '💻', desc: '在模拟服务器上尝试 OS 命令注入，获取系统控制权' },
  { id: 'auth-bypass', title: '认证绕过', category: 'Web 安全', difficulty: '高级', time: '35分钟', status: 'coming', icon: '🔑', desc: '弱口令、Session 劫持、JWT 攻击——多种认证绕过手法实战' },
]

const diffColors = {
  '入门': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  '进阶': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  '高级': 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function SecurityLab() {
  return (
    <div className="relative -m-6">
      {/* Threads 背景 — 网络线条，科技感 */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <Threads color={[0.3, 0.6, 1.0]} amplitude={1.5} distance={0.2} />
      </div>

      <div className="relative p-6 space-y-6">
        {/* 标题 */}
        <FadeContent blur={true} duration={500}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-500/20 to-primary-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <GradientText colors={['#06b6d4', '#6366f1', '#8b5cf6']} animationSpeed={5} className="text-2xl font-bold">
                安全靶场
              </GradientText>
              <p className="text-sm text-gray-500 mt-1">在真实环境中锻炼你的安全技能</p>
            </div>
          </div>
        </FadeContent>

        {/* 状态栏 */}
        <FadeContent blur={true} duration={400} delay={100}>
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 可用实验 {labs.filter(l => l.status === 'available').length}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> 即将上线 {labs.filter(l => l.status === 'coming').length}
            </span>
          </div>
        </FadeContent>

        {/* 实验卡片网格 */}
        <div className="grid grid-cols-2 gap-4">
          {labs.map((lab, i) => (
            <FadeContent key={lab.id} blur={true} duration={500} delay={i * 80}>
              <BorderGlow
                className="!rounded-2xl"
                backgroundColor="#111827"
                borderRadius={16}
                glowColor={lab.status === 'available' ? '6 182 212' : '245 158 11'}
                glowIntensity={0.5}
                glowRadius={25}
                animated={i < 2}
              >
                <div className="p-5">
                  {/* 头部 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lab.icon}</span>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{lab.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${diffColors[lab.difficulty]}`}>
                            {lab.difficulty}
                          </span>
                          <span className="text-[10px] text-gray-600">⏱ {lab.time}</span>
                        </div>
                      </div>
                    </div>

                    {lab.status === 'available' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        可用
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        即将上线
                      </span>
                    )}
                  </div>

                  {/* 描述 */}
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{lab.desc}</p>

                  {/* 操作 */}
                  <div className="flex items-center gap-3">
                    {lab.status === 'available' ? (
                      <Magnet padding={40} magnetStrength={15}>
                        <Link
                          to={`/security-lab/${lab.id}`}
                          className="px-4 py-2 rounded-xl bg-cyber-600/20 text-cyber-400 border border-cyber-500/30 text-xs font-medium hover:bg-cyber-600/30 transition-all"
                        >
                          进入实验 →
                        </Link>
                      </Magnet>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl bg-gray-800/50 text-gray-600 border border-gray-800/40 text-xs font-medium cursor-not-allowed"
                      >
                        即将上线
                      </button>
                    )}
                    <Link to="/ai-tutor" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                      先学知识
                    </Link>
                  </div>
                </div>
              </BorderGlow>
            </FadeContent>
          ))}
        </div>
      </div>
    </div>
  )
}
