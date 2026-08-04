import { useState } from 'react'
import { Link } from 'react-router-dom'
import GradientText from '../../components/react-bits/GradientText'
import FadeContent from '../../components/react-bits/FadeContent'
import SpotlightCard from '../../components/react-bits/SpotlightCard'
import Magnet from '../../components/react-bits/Magnet'

const questions = [
  {id:1,category:'SQL注入',difficulty:'入门',question:'SQL 注入产生的根本原因是什么？',answer:'B. 用户输入被直接拼接到 SQL 语句中',options:['A. 数据库版本太低','B. 用户输入被直接拼接到 SQL 语句中','C. 服务器带宽不足','D. 使用了 MySQL 数据库'],code:null},
  {id:2,category:'SQL注入',difficulty:'进阶',question:'以下哪种方式可有效防御 SQL 注入？',answer:'B. 使用参数化查询',options:['A. 对用户输入做 HTML 转义','B. 使用参数化查询（Prepared Statement）','C. 给数据库设置复杂密码','D. 关闭数据库错误回显'],code:null},
  {id:3,category:'SQL注入',difficulty:'进阶',question:"攻击者输入 admin' OR '1'='1 进行登录绕过，这是？",answer:'B. 永真条件绕过',options:['A. 联合查询','B. 永真条件绕过','C. 时间盲注','D. 堆叠查询'],code:null},
  {id:4,category:'SQL注入',difficulty:'实战',question:'以下 Python 代码存在什么问题？',answer:'B. SQL 注入',options:['A. 没有问题','B. SQL 注入——username 被拼接进 SQL','C. 连接未关闭','D. 缺少异常处理'],code:"username = request.GET['username']\nquery = \"SELECT * FROM users WHERE username = '\" + username + \"'\"\ncursor.execute(query)"},
  {id:5,category:'XSS',difficulty:'入门',question:'XSS 的全称是什么？',answer:'A. Cross-Site Scripting',options:['A. Cross-Site Scripting','B. Cross-Server Security','C. XML Secure Script','D. eXtreme Security System'],code:null},
  {id:6,category:'XSS',difficulty:'进阶',question:'存储型 XSS 和反射型 XSS 的区别？',answer:'B. 存储型保存在服务器，反射型仅在 URL',options:['A. 存储型需要数据库','B. 存储型保存在服务器，反射型仅在 URL','C. 存储型只影响管理员','D. 没有区别'],code:null},
  {id:7,category:'XSS',difficulty:'进阶',question:'以下哪种方式不能有效防御 XSS？',answer:'D. 仅在前端做输入校验',options:['A. HTML 实体转义','B. HttpOnly Cookie','C. 使用 WAF','D. 仅在前端做输入校验'],code:null},
  {id:8,category:'XSS',difficulty:'实战',question:'这段 JS 代码存在什么问题？',answer:'B. DOM 型 XSS',options:['A. 没有问题','B. DOM 型 XSS——直接插入 innerHTML','C. 内存泄露','D. 跨域问题'],code:"var name = location.hash.substring(1);\ndocument.getElementById('welcome').innerHTML = '欢迎，' + name;"},
  {id:9,category:'CSRF',difficulty:'入门',question:'CSRF 攻击的原理是什么？',answer:'B. 利用已登录身份伪造请求',options:['A. 直接入侵服务器','B. 利用已登录身份伪造请求','C. 窃取密码','D. 篡改数据库'],code:null},
  {id:10,category:'CSRF',difficulty:'进阶',question:'以下哪种方式不能防御 CSRF？',answer:'D. 使用 HTTPS',options:['A. CSRF Token','B. Referer 验证','C. SameSite Cookie','D. 使用 HTTPS'],code:null},
  {id:11,category:'文件上传',difficulty:'进阶',question:'白名单和黑名单验证的区别？',answer:'A. 白名单只允许指定类型',options:['A. 白名单只允许指定类型','B. 黑名单只允许指定类型','C. 完全一样','D. 白名单是前端验证'],code:null},
  {id:12,category:'命令执行',difficulty:'进阶',question:'以下哪段 Python 更安全？',answer:'B. subprocess.run(["ping", user_input])',options:['A. os.system("ping "+input)','B. subprocess.run(["ping",input])','C. os.popen("ping "+input)','D. 都不安全'],code:null},
  {id:13,category:'密码学',difficulty:'入门',question:'存储密码最安全的方式？',answer:'C. 加盐 + bcrypt',options:['A. 明文','B. MD5','C. 加盐 + bcrypt','D. Base64'],code:null},
  {id:14,category:'认证安全',difficulty:'进阶',question:'JWT Token 存哪里最安全？',answer:'B. HttpOnly Cookie',options:['A. localStorage','B. HttpOnly Cookie','C. URL 参数','D. SessionStorage'],code:null},
  {id:15,category:'网络安全',difficulty:'进阶',question:'HTTPS 比 HTTP 增加了什么？',answer:'B. 加密+身份验证+完整性',options:['A. 数据压缩','B. 加密+身份验证+完整性','C. 更快','D. 防 SQL 注入'],code:null},
]

const cats = ['全部','SQL注入','XSS','CSRF','文件上传','命令执行','密码学','认证安全','网络安全']
const diffColors = {'入门':'bg-emerald-500/20 text-emerald-400','进阶':'bg-amber-500/20 text-amber-400','实战':'bg-red-500/20 text-red-400'}

export default function Questions() {
  const [activeCat, setActiveCat] = useState('全部')
  const [showAnswer, setShowAnswer] = useState({})
  const filtered = activeCat === '全部' ? questions : questions.filter(q => q.category === activeCat)

  return (
    <div className="p-6 space-y-6">
      <FadeContent blur={true} duration={500}>
        <GradientText colors={['#6366f1','#06b6d4','#8b5cf6']} animationSpeed={6} className="text-2xl font-bold">
          题库
        </GradientText>
        <p className="text-sm text-gray-500 mt-1">浏览全部题目，点击查看答案</p>
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
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${diffColors[q.difficulty]}`}>{q.difficulty}</span>
                <span className="text-[10px] text-gray-600 ml-auto">#{q.id}</span>
              </div>
              <p className="text-sm text-white mb-2">{q.question}</p>
              {q.code && <pre className="text-xs bg-gray-950/80 text-gray-300 p-3 rounded-xl mb-3 border border-gray-800/40 font-mono overflow-x-auto">{q.code}</pre>}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {q.options.map((o,j) => (
                  <span key={j} className="text-[11px] px-2 py-1 rounded-lg bg-gray-900/60 text-gray-500 border border-gray-800/30">{o}</span>
                ))}
              </div>
              <button onClick={() => setShowAnswer(prev=>({...prev,[q.id]:!prev[q.id]}))}
                className="text-xs text-gray-600 hover:text-primary-400 transition-colors"
              >
                {showAnswer[q.id] ? `✅ ${q.answer}` : '点击查看答案'}
              </button>
              {showAnswer[q.id] && (
                <div className="mt-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400">
                  <Link to="/practice" className="hover:underline">去练习中心做题 →</Link>
                </div>
              )}
            </SpotlightCard>
          </FadeContent>
        ))}
      </div>
    </div>
  )
}
