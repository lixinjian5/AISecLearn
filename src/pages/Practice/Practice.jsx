import { useState, useEffect } from 'react'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import Magnet from '../../components/react-bits/Magnet'
import ClickBurst from '../../components/react-bits/ClickBurst'
import { callAI } from '../../services/aiService'
import { addWrongQuestion } from '../../utils/wrongQuestions'
import { api } from '../../services/api'

// 从知识库提取的题目（后端不可用时作为兜底）
const FALLBACK_QUESTIONS = [
  {
    id: 1, category: 'SQL注入', difficulty: '入门',
    question: 'SQL 注入产生的根本原因是什么？',
    options: ['A. 数据库版本太低', 'B. 用户输入被直接拼接到 SQL 语句中', 'C. 服务器带宽不足', 'D. 使用了 MySQL 数据库'],
    answer: 1,
    code: null,
  },
  {
    id: 2, category: 'SQL注入', difficulty: '进阶',
    question: '以下哪种方式可有效防御 SQL 注入？',
    options: ['A. 对用户输入做 HTML 转义', 'B. 使用参数化查询（Prepared Statement）', 'C. 给数据库设置复杂密码', 'D. 关闭数据库错误回显'],
    answer: 1,
    code: null,
  },
  {
    id: 3, category: 'SQL注入', difficulty: '进阶',
    question: '攻击者输入 admin\' OR \'1\'=\'1 进行登录绕过，这利用了 SQL 注入的什么特性？',
    options: ['A. 联合查询', 'B. 永真条件绕过', 'C. 时间盲注', 'D. 堆叠查询'],
    answer: 1,
    code: null,
  },
  {
    id: 4, category: 'SQL注入', difficulty: '实战',
    question: '以下 Python 代码存在什么问题？',
    options: [
      'A. 没有问题，代码是安全的',
      'B. SQL 注入——username 被字符串拼接进 SQL',
      'C. 数据库连接没有关闭',
      'D. 缺少 try-except 异常处理'
    ],
    answer: 1,
    code: `username = request.GET['username']
query = "SELECT * FROM users WHERE username = '" + username + "'"
cursor.execute(query)`,
  },
  {
    id: 5, category: 'XSS', difficulty: '入门',
    question: 'XSS 攻击中，"XSS" 的全称是什么？',
    options: ['A. Cross-Site Scripting', 'B. Cross-Server Security', 'C. XML Secure Script', 'D. eXtreme Security System'],
    answer: 0,
    code: null,
  },
  {
    id: 6, category: 'XSS', difficulty: '进阶',
    question: '存储型 XSS 和反射型 XSS 的核心区别是什么？',
    options: [
      'A. 存储型需要数据库，反射型不需要',
      'B. 存储型恶意代码保存在服务器，反射型仅在 URL 中',
      'C. 存储型只影响管理员，反射型影响所有用户',
      'D. 两者没有区别'
    ],
    answer: 1,
    code: null,
  },
  {
    id: 7, category: 'XSS', difficulty: '进阶',
    question: '以下哪种方式不能有效防御 XSS？',
    options: ['A. HTML 实体转义', 'B. 设置 HttpOnly Cookie', 'C. 使用 WAF', 'D. 仅在前端做输入校验'],
    answer: 3,
    code: null,
  },
  {
    id: 8, category: 'XSS', difficulty: '实战',
    question: '这段 JavaScript 代码存在什么安全问题？',
    options: [
      'A. 没有问题',
      'B. DOM 型 XSS——用户输入直接插入 innerHTML',
      'C. 内存泄露',
      'D. 跨域问题'
    ],
    answer: 1,
    code: `var name = location.hash.substring(1);
document.getElementById('welcome').innerHTML = "欢迎，" + name;`,
  },
  {
    id: 9, category: 'CSRF', difficulty: '入门',
    question: 'CSRF 攻击的原理是什么？',
    options: [
      'A. 直接入侵服务器',
      'B. 利用用户已登录的身份，伪造用户发起恶意请求',
      'C. 窃取用户密码',
      'D. 篡改数据库数据'
    ],
    answer: 1,
    code: null,
  },
  {
    id: 10, category: 'CSRF', difficulty: '进阶',
    question: '以下哪种方式无法有效防御 CSRF？',
    options: ['A. CSRF Token', 'B. 验证 Referer 头', 'C. 设置 SameSite Cookie', 'D. 使用 HTTPS'],
    answer: 3,
    code: null,
  },
  {
    id: 11, category: '文件上传', difficulty: '进阶',
    question: '文件上传漏洞中，白名单验证和黑名单验证的区别是什么？',
    options: [
      'A. 白名单只允许指定类型，黑名单禁止指定类型',
      'B. 白名单禁止指定类型，黑名单只允许指定类型',
      'C. 两者完全一样',
      'D. 白名单是前端验证，黑名单是后端验证'
    ],
    answer: 0,
    code: null,
  },
  {
    id: 12, category: '命令执行', difficulty: '进阶',
    question: '以下哪段 Python 代码更安全？',
    options: [
      'A. os.system("ping " + user_input)',
      'B. subprocess.run(["ping", user_input])',
      'C. os.popen("ping " + user_input)',
      'D. 以上都不安全'
    ],
    answer: 1,
    code: null,
  },
  {
    id: 13, category: '密码学', difficulty: '入门',
    question: '存储用户密码时，以下哪种做法最安全？',
    options: [
      'A. 明文存储',
      'B. MD5 哈希存储',
      'C. 加盐 + bcrypt 哈希存储',
      'D. Base64 编码存储'
    ],
    answer: 2,
    code: null,
  },
  {
    id: 14, category: '认证安全', difficulty: '进阶',
    question: 'JWT Token 应该存储在哪里最安全？',
    options: [
      'A. localStorage',
      'B. HttpOnly Cookie',
      'C. URL 参数中',
      'D. SessionStorage'
    ],
    answer: 1,
    code: null,
  },
  {
    id: 15, category: '网络安全', difficulty: '进阶',
    question: 'HTTPS 相比 HTTP 主要增加了什么保护？',
    options: [
      'A. 数据压缩',
      'B. 加密传输 + 身份验证 + 数据完整性',
      'C. 访问速度更快',
      'D. 防止 SQL 注入'
    ],
    answer: 1,
    code: null,
  },
]

const cats = ['全部', 'SQL注入', 'XSS', 'CSRF', '文件上传', '命令执行', '密码学', '认证安全', '网络安全']

export default function Practice() {
  const [questions, setQuestions] = useState(FALLBACK_QUESTIONS)
  const [loading, setLoading] = useState(true)
  const [activeCat, setActiveCat] = useState('全部')
  const [selected, setSelected] = useState({})    // { questionId: optionIndex }
  const [submitted, setSubmitted] = useState({})   // { questionId: true }
  const [grading, setGrading] = useState({})        // { questionId: true }
  const [feedbacks, setFeedbacks] = useState({})    // { questionId: 'AI feedback text' }

  // 从后端拉取题目
  useEffect(() => {
    api.getQuestions({ page_size: 100 })
      .then(res => {
        const data = res.data || res
        if (Array.isArray(data) && data.length > 0) {
          // 后端返回的题目没有 answer 字段（为了防作弊），需要补充
          // 这里用本地 fallback 的 answer 作为判题依据
          const merged = data.map(q => ({
            ...q,
            answer: FALLBACK_QUESTIONS.find(f => f.id === q.id)?.answer ?? 0,
          }))
          setQuestions(merged)
        }
      })
      .catch(() => {
        // 后端没启动，用本地数据
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCat === '全部' ? questions : questions.filter(q => q.category === activeCat)

  // 提交单题 → AI 批改
  const handleSubmit = async (q) => {
    if (selected[q.id] === undefined) return
    const isCorrect = selected[q.id] === q.answer
    if (!isCorrect) addWrongQuestion(q, selected[q.id])
    setSubmitted(prev => ({ ...prev, [q.id]: true }))
    setGrading(prev => ({ ...prev, [q.id]: true }))

    try {
      const prompt = `你是一位网络安全老师。请批改学生的答案。

题目：${q.question}
${q.code ? '\\n代码：\\n' + q.code : ''}
选项：
${q.options.join('\\n')}

正确答案：${q.options[q.answer]}
学生答案：${q.options[selected[q.id]]}
结果：${isCorrect ? '回答正确 ✅' : '回答错误 ❌'}

请用中文简要解释：
1. ${isCorrect ? '为什么这个答案是正确的' : '为什么学生的答案是错的，正确答案为什么是对的'}
2. 一个关键知识点提醒

回复控制在 3-5 句话，友好简洁。`

      const reply = await callAI([{ role: 'user', content: prompt }], { temperature: 0.5, maxTokens: 400 })
      setFeedbacks(prev => ({ ...prev, [q.id]: reply }))
    } catch {
      const fb = isCorrect
        ? '✅ 回答正确！继续加油。'
        : `❌ 回答错误。正确答案是 ${q.options[q.answer]}。请仔细复习相关知识点。`
      setFeedbacks(prev => ({ ...prev, [q.id]: fb }))
    }
    setGrading(prev => ({ ...prev, [q.id]: false }))
  }

  return (
    <div className="p-6 space-y-6">
      <FadeContent blur={true} duration={500}>
        <GradientText colors={['#6366f1', '#06b6d4', '#8b5cf6']} animationSpeed={6} className="text-2xl font-bold">
          练习中心
        </GradientText>
        <p className="text-sm text-gray-500 mt-1">巩固知识，AI 智能批改每道题</p>
      </FadeContent>

      {/* 分类 */}
      <FadeContent blur={true} duration={400} delay={100}>
        <div className="flex gap-2 flex-wrap">
          {cats.map(cat => (
            <Magnet key={cat} padding={30} magnetStrength={20}>
              <button
                onClick={() => setActiveCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeCat === cat ? 'bg-primary-600/30 text-primary-400 border border-primary-500/40' : 'bg-gray-900/60 text-gray-400 border border-gray-800/40 hover:border-gray-700/50'
                }`}
              >
                {cat}
              </button>
            </Magnet>
          ))}
        </div>
      </FadeContent>

      {/* 题目列表 */}
      <div className="space-y-4">
        {filtered.map((q, i) => (
          <FadeContent key={q.id} blur={true} duration={400} delay={i * 50}>
            <SpotlightCard className="!rounded-2xl !p-5 !bg-gray-900/60 !border-gray-800/30" spotlightColor="rgba(99, 102, 241, 0.10)">
              {/* 题目标题 */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-600/20 text-primary-400 border border-primary-500/30">{q.category}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  q.difficulty === '入门' ? 'bg-emerald-500/20 text-emerald-400' : q.difficulty === '进阶' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                }`}>{q.difficulty}</span>
              </div>

              <p className="text-sm text-white mb-3">{q.id}. {q.question}</p>

              {/* 代码块 */}
              {q.code && (
                <pre className="text-xs bg-gray-950/80 text-gray-300 p-4 rounded-xl mb-4 overflow-x-auto border border-gray-800/40 font-mono">
                  {q.code}
                </pre>
              )}

              {/* 选项 */}
              <div className="space-y-2 mb-4">
                {q.options.map((opt, j) => {
                  const isSelected = selected[q.id] === j
                  const isSubmitted = submitted[q.id]
                  const isCorrectAnswer = q.answer === j
                  let optStyle = 'bg-gray-900/60 border-gray-800/40 hover:border-gray-700/50'
                  if (isSubmitted) {
                    if (isCorrectAnswer) optStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    else if (isSelected && !isCorrectAnswer) optStyle = 'bg-red-500/10 border-red-500/40 text-red-400'
                  } else if (isSelected) {
                    optStyle = 'bg-primary-600/20 border-primary-500/40 text-primary-400'
                  }
                  return (
                    <button
                      key={j}
                      onClick={() => !submitted[q.id] && setSelected(prev => ({ ...prev, [q.id]: j }))}
                      disabled={isSubmitted}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${optStyle} ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>

              {/* 提交按钮 */}
              {!submitted[q.id] ? (
                <ClickBurst>
                  <button
                    onClick={() => handleSubmit(q)}
                    disabled={selected[q.id] === undefined}
                    className="px-5 py-2 rounded-xl bg-primary-600/30 text-primary-400 border border-primary-500/40 text-sm font-medium hover:bg-primary-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    提交答案
                  </button>
                </ClickBurst>
              ) : (
                <div className="rounded-xl bg-gray-900/60 border border-gray-800/30 p-4">
                  {grading[q.id] ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      AI 正在批改...
                    </div>
                  ) : (
                    <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{feedbacks[q.id]}</div>
                  )}
                </div>
              )}
            </SpotlightCard>
          </FadeContent>
        ))}
      </div>
    </div>
  )
}
