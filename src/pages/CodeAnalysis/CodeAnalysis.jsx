import { useState } from 'react'
import { callAI } from '../../services/aiService'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import Magnet from '../../components/react-bits/Magnet'
import BorderGlow from '../../components/react-bits/BorderGlow'

const LANGUAGES = ['Python', 'Java', 'PHP', 'JavaScript', 'Go', 'C']

const DEMO_CODE = {
  Python: `# 用户登录接口
username = request.GET['username']
password = request.GET['password']

query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'"
cursor.execute(query)

result = cursor.fetchone()
if result:
    os.system("echo " + username + " >> login.log")
    return "欢迎，" + username`,
  Java: `String username = request.getParameter("username");
String query = "SELECT * FROM users WHERE username = '" + username + "'";
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery(query);`,
  PHP: `$username = $_GET['username'];
$query = "SELECT * FROM users WHERE username = '$username'";
$result = mysqli_query($conn, $query);
echo "<div>欢迎, " . $_GET['name'] . "</div>";`,
}

export default function CodeAnalysis() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('Python')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const handleAnalyze = async () => {
    if (!code.trim()) return
    setAnalyzing(true)
    setResult(null)

    try {
      const prompt = `你是一位资深代码安全审计专家。请分析以下 ${language} 代码的安全问题。

代码：
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

请按以下格式回复（用中文）：

## 风险等级
（Critical / High / Medium / Low）

## 发现的漏洞
每条漏洞请包含：
- **漏洞类型**：SQL注入 / XSS / 命令注入 / 路径穿越等
- **位置**：第几行
- **风险说明**：为什么这是漏洞
- **修复建议**：给出安全的代码示例

## 总结
一句话总结代码的安全状况。

如果代码没有安全问题，也请明确说明"未发现明显安全漏洞"。

回复要专业、准确，不要猜测不确定的内容。`

      const reply = await callAI([{ role: 'user', content: prompt }], { temperature: 0.3, maxTokens: 1500 })
      setResult(reply)
    } catch (err) {
      setResult('分析失败：' + err.message)
    }
    setAnalyzing(false)
  }

  const loadDemo = () => setCode(DEMO_CODE[language] || DEMO_CODE.Python)

  return (
    <div className="p-6 space-y-6">
      <FadeContent blur={true} duration={500}>
        <GradientText colors={['#6366f1', '#06b6d4', '#8b5cf6']} animationSpeed={6} className="text-2xl font-bold">
          AI 代码安全分析
        </GradientText>
        <p className="text-sm text-gray-500 mt-1">上传或粘贴代码，AI 自动检测安全漏洞并给出修复建议</p>
      </FadeContent>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：代码输入 */}
        <FadeContent blur={true} duration={500} delay={100}>
          <div className="space-y-4">
            {/* 语言选择 + Demo */}
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-gray-900/60 border border-gray-800/40 rounded-xl px-3 py-2 text-sm text-gray-300 outline-none focus:border-primary-500/50"
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <button
                onClick={loadDemo}
                className="px-3 py-2 rounded-xl bg-gray-900/60 border border-gray-800/40 text-xs text-gray-400 hover:text-gray-300 transition-colors"
              >
                加载示例代码
              </button>
            </div>

            {/* 代码编辑器 */}
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder={`在此粘贴 ${language} 代码...`}
              className="w-full h-[420px] bg-gray-950/90 border border-gray-800/40 rounded-2xl p-5 text-sm text-gray-300 font-mono resize-none outline-none focus:border-primary-500/50 placeholder-gray-700"
              spellCheck={false}
            />

            {/* 分析按钮 */}
            <Magnet padding={60} magnetStrength={15}>
              <button
                onClick={handleAnalyze}
                disabled={analyzing || !code.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-cyber-600 text-white font-medium hover:from-primary-500 hover:to-cyber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
              >
                {analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    AI 正在分析...
                  </span>
                ) : '🔍 开始分析'}
              </button>
            </Magnet>
          </div>
        </FadeContent>

        {/* 右侧：分析结果 */}
        <FadeContent blur={true} duration={500} delay={200}>
          {result ? (
            <BorderGlow
              className="!rounded-2xl"
              backgroundColor="#111827"
              borderRadius={16}
              glowColor="99 102 241"
              glowIntensity={0.6}
              glowRadius={25}
              colors={['#6366f1', '#8b5cf6', '#06b6d4']}
            >
              <div className="p-6 h-[480px] overflow-y-auto">
                <h3 className="text-sm font-semibold text-white mb-4">📋 分析结果</h3>
                <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
              </div>
            </BorderGlow>
          ) : (
            <SpotlightCard className="!rounded-2xl !p-6 !bg-gray-900/60 !border-gray-800/30 h-[480px] flex items-center justify-center" spotlightColor="rgba(99, 102, 241, 0.08)">
              <div className="text-center text-gray-600">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
                <p className="text-sm">粘贴代码后点击"开始分析"</p>
                <p className="text-xs mt-1 opacity-60">AI 将检测 SQL注入、XSS、命令注入等安全问题</p>
              </div>
            </SpotlightCard>
          )}
        </FadeContent>
      </div>
    </div>
  )
}
