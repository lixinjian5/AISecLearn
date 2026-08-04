import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Particles from '../../components/react-bits/Particles'
import SpecularButton from '../../components/react-bits/SpecularButton'
import BorderGlow from '../../components/react-bits/BorderGlow'
import GradientText from '../../components/react-bits/GradientText'
import ShinyText from '../../components/react-bits/ShinyText'
import FadeContent from '../../components/react-bits/FadeContent'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a12] relative overflow-hidden">
      {/* Particles 背景 */}
      <div className="absolute inset-0 opacity-[0.25]">
        <Particles
          particleColors={['#6366f1', '#06b6d4', '#8b5cf6']}
          particleCount={200}
          particleSpread={12}
          speed={0.06}
          particleBaseSize={100}
          sizeRandomness={0.8}
          cameraDistance={20}
        />
      </div>

      {/* 背景渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-transparent pointer-events-none" />

      {/* 登录卡片 */}
      <FadeContent blur={true} duration={800}>
        <div className="relative z-10 w-[420px]">
          <BorderGlow
            className="!rounded-3xl"
            backgroundColor="#111827"
            borderRadius={24}
            glowColor="99 102 241"
            glowIntensity={0.6}
            glowRadius={35}
          >
            <div className="p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-cyber-500 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <GradientText colors={['#6366f1', '#06b6d4', '#8b5cf6']} animationSpeed={5} className="text-xl font-bold">
                  AISecLearn
                </GradientText>
                <ShinyText
                  text="AI 网络安全学习平台"
                  speed={3}
                  className="text-xs mt-2 block"
                  color="#6b7280"
                  shineColor="#a5b4fc"
                />
              </div>

              {/* 切换标签 */}
              <div className="flex bg-gray-900/60 rounded-xl p-1 mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isLogin ? 'bg-primary-600/30 text-primary-400' : 'text-gray-600 hover:text-gray-400'}`}
                >
                  登录
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isLogin ? 'bg-primary-600/30 text-primary-400' : 'text-gray-600 hover:text-gray-400'}`}
                >
                  注册
                </button>
              </div>

              {/* 表单 */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">用户名</label>
                    <input
                      type="text"
                      placeholder="请输入用户名"
                      className="w-full bg-gray-900/60 border border-gray-800/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 outline-none focus:border-primary-500/50 transition-colors"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">邮箱</label>
                  <input
                    type="email"
                    placeholder="请输入邮箱"
                    className="w-full bg-gray-900/60 border border-gray-800/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 outline-none focus:border-primary-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">密码</label>
                  <input
                    type="password"
                    placeholder="请输入密码"
                    className="w-full bg-gray-900/60 border border-gray-800/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 outline-none focus:border-primary-500/50 transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <SpecularButton
                    size="md"
                    radius={14}
                    lineColor="#818cf8"
                    baseColor="#3730a3"
                    textColor="#e0e7ff"
                    intensity={1}
                    shineSize={12}
                    thickness={1}
                    speed={0.3}
                    autoAnimate={true}
                    onClick={handleSubmit}
                  >
                    {isLogin ? '登录' : '注册'}
                  </SpecularButton>
                </div>
              </form>

              <p className="text-center text-xs text-gray-600 mt-6">
                {isLogin ? '还没有账号？' : '已有账号？'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-400 hover:text-primary-300 ml-1 transition-colors"
                >
                  {isLogin ? '立即注册' : '去登录'}
                </button>
              </p>
            </div>
          </BorderGlow>
        </div>
      </FadeContent>
    </div>
  )
}
