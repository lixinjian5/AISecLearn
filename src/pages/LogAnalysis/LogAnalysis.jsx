import { useState } from 'react'
import { callAI } from '../../services/aiService'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import Magnet from '../../components/react-bits/Magnet'
import BorderGlow from '../../components/react-bits/BorderGlow'

const DEMO_LOG = `192.168.1.100 - - [25/Jul/2026:14:23:01 +0800] "GET / HTTP/1.1" 200 512
192.168.1.100 - - [25/Jul/2026:14:23:02 +0800] "GET /login HTTP/1.1" 200 340
192.168.1.100 - - [25/Jul/2026:14:23:05 +0800] "POST /login HTTP/1.1" 302 150
10.0.0.55 - - [25/Jul/2026:14:23:10 +0800] "GET /admin HTTP/1.1" 403 200
10.0.0.55 - - [25/Jul/2026:14:23:10 +0800] "GET /admin/login HTTP/1.1" 200 300
10.0.0.55 - - [25/Jul/2026:14:23:11 +0800] "POST /admin/login HTTP/1.1" 401 180
10.0.0.55 - - [25/Jul/2026:14:23:11 +0800] "POST /admin/login HTTP/1.1" 401 180
10.0.0.55 - - [25/Jul/2026:14:23:12 +0800] "POST /admin/login HTTP/1.1" 401 180
10.0.0.55 - - [25/Jul/2026:14:23:12 +0800] "POST /admin/login HTTP/1.1" 401 180
10.0.0.55 - - [25/Jul/2026:14:23:13 +0800] "POST /admin/login HTTP/1.1" 401 180
10.0.0.55 - - [25/Jul/2026:14:23:13 +0800] "POST /admin/login HTTP/1.1" 401 180
10.0.0.55 - - [25/Jul/2026:14:23:14 +0800] "POST /admin/login HTTP/1.1" 200 280
45.33.32.156 - - [25/Jul/2026:14:25:00 +0800] "GET /?id=1' OR '1'='1 HTTP/1.1" 200 800
45.33.32.156 - - [25/Jul/2026:14:25:01 +0800] "GET /?id=1 UNION SELECT 1,2,3-- HTTP/1.1" 200 850
45.33.32.156 - - [25/Jul/2026:14:25:02 +0800] "GET /wp-admin HTTP/1.1" 404 400
45.33.32.156 - - [25/Jul/2026:14:25:03 +0800] "GET /.env HTTP/1.1" 404 350
45.33.32.156 - - [25/Jul/2026:14:25:04 +0800] "GET /api/users HTTP/1.1" 403 280`

export default function LogAnalysis() {
  const [log, setLog] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const handleAnalyze = async () => {
    if (!log.trim()) return
    setAnalyzing(true)
    setResult(null)
    try {
      const reply = await callAI([{ role: 'user', content: `你是一位安全运维专家。分析以下服务器日志，识别可疑行为。

${log}

请用中文回复：

## 📊 日志概览
总结日志中的主要活动

## 🚨 发现的威胁
每条威胁包含：
- **威胁类型**：SQL注入 / 暴力破解 / 敏感文件扫描 / 权限绕过等
- **来源 IP**
- **证据**：引用具体日志行
- **风险等级**：🔴Critical 🟠High 🟡Medium

## ✅ 安全建议
简短给出防护建议

如果未发现威胁也请明确说明。` }], { temperature: 0.3, maxTokens: 1200 })
      setResult(reply)
    } catch (err) {
      setResult('分析失败：' + err.message)
    }
    setAnalyzing(false)
  }

  return (
    <div className="p-6 space-y-6">
      <FadeContent blur={true} duration={500}>
        <GradientText colors={['#6366f1','#06b6d4','#8b5cf6']} animationSpeed={6} className="text-2xl font-bold">
          AI 日志分析
        </GradientText>
        <p className="text-sm text-gray-500 mt-1">粘贴服务器日志，AI 自动检测攻击行为与异常活动</p>
      </FadeContent>

      <div className="grid grid-cols-2 gap-6">
        <FadeContent blur={true} duration={500} delay={100}>
          <div className="space-y-4">
            <button onClick={() => setLog(DEMO_LOG)} className="px-3 py-2 rounded-xl bg-gray-900/60 border border-gray-800/40 text-xs text-gray-400 hover:text-gray-300 transition-colors">
              加载示例日志（含 SQL注入 + 暴力破解 + 扫描）
            </button>
            <textarea value={log} onChange={e => setLog(e.target.value)}
              placeholder="在此粘贴 Apache/Nginx 服务器日志..."
              className="w-full h-[420px] bg-gray-950/90 border border-gray-800/40 rounded-2xl p-5 text-sm text-gray-300 font-mono resize-none outline-none focus:border-primary-500/50 placeholder-gray-700"
              spellCheck={false}
            />
            <Magnet padding={60} magnetStrength={15}>
              <button onClick={handleAnalyze} disabled={analyzing || !log.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-cyber-600 text-white font-medium hover:from-primary-500 hover:to-cyber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
              >
                {analyzing ? '⏳ AI 正在分析...' : '🔍 开始分析'}
              </button>
            </Magnet>
          </div>
        </FadeContent>

        <FadeContent blur={true} duration={500} delay={200}>
          {result ? (
            <BorderGlow className="!rounded-2xl" backgroundColor="#111827" borderRadius={16} glowColor="99 102 241" glowIntensity={0.6} glowRadius={25} colors={['#6366f1','#8b5cf6','#06b6d4']}>
              <div className="p-6 h-[480px] overflow-y-auto">
                <h3 className="text-sm font-semibold text-white mb-4">📋 分析结果</h3>
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{result}</div>
              </div>
            </BorderGlow>
          ) : (
            <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30 h-[480px] flex items-center justify-center" spotlightColor="rgba(99,102,241,0.08)">
              <div className="text-center text-gray-600">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-sm">粘贴日志后点击"开始分析"</p>
                <p className="text-xs mt-1 opacity-60">AI 将检测暴力破解、SQL 注入、敏感文件扫描等威胁</p>
              </div>
            </SpotlightCard>
          )}
        </FadeContent>
      </div>
    </div>
  )
}
