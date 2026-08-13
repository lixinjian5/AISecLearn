// ============================================================
// 日志分析规则引擎 — 本地实时检测（不依赖 AI）
// 在 AI 深度分析之前，先用规则快速扫描可疑行为
// ============================================================

/**
 * 解析单行日志，提取 IP、方法、路径、状态码
 * 格式：IP - - [时间] "METHOD path HTTP/1.1" status size
 */
function parseLine(line) {
  const match = line.match(/^(\S+)\s+.*?"(\w+)\s+(\S+).*?"\s+(\d{3})/)
  if (!match) return null
  return {
    ip: match[1],
    method: match[2],
    path: match[3],
    status: parseInt(match[4]),
  }
}

/**
 * 检测规则列表
 * 每条规则返回 { type, ip, evidence, severity } 或 null
 */
const rules = [
  {
    name: 'SQL 注入',
    test: (entry) => {
      const p = entry.path.toLowerCase()
      if (p.includes("'") && (p.includes('or') || p.includes('union') || p.includes('select') || p.includes('--'))) {
        return { type: 'SQL 注入', ip: entry.ip, evidence: entry.path, severity: '🔴 Critical' }
      }
      return null
    },
  },
  {
    name: 'XSS 攻击',
    test: (entry) => {
      const p = entry.path.toLowerCase()
      if (p.includes('<script') || p.includes('alert(') || p.includes('onerror=')) {
        return { type: 'XSS 攻击', ip: entry.ip, evidence: entry.path, severity: '🟠 High' }
      }
      return null
    },
  },
  {
    name: '敏感文件扫描',
    test: (entry) => {
      const p = entry.path.toLowerCase()
      if (p.includes('.env') || p.includes('.git') || p.includes('wp-admin') || p.includes('phpmyadmin') || p.includes('backup')) {
        return { type: '敏感文件扫描', ip: entry.ip, evidence: entry.path, severity: '🟡 Medium' }
      }
      return null
    },
  },
]

/**
 * 检测暴力破解：同一 IP 短时间内多次 401
 */
function detectBruteForce(entries) {
  const attempts = {}
  entries.forEach(e => {
    if (e && e.status === 401) {
      attempts[e.ip] = (attempts[e.ip] || 0) + 1
    }
  })
  const results = []
  Object.entries(attempts).forEach(([ip, count]) => {
    if (count >= 5) {
      results.push({ type: '暴力破解', ip, evidence: `${count} 次连续登录失败`, severity: '🟠 High' })
    }
  })
  return results
}

/**
 * 分析日志，返回检测结果
 * @param {string} logText 原始日志文本
 * @returns {{ threats: Array, summary: string }}
 */
export function analyzeLog(logText) {
  const lines = logText.split('\n').filter(l => l.trim())
  const entries = lines.map(parseLine).filter(Boolean)

  const threats = []
  const seen = new Set()

  // 单行规则
  entries.forEach(entry => {
    rules.forEach(rule => {
      const result = rule.test(entry)
      if (result && !seen.has(`${result.type}-${result.ip}`)) {
        seen.add(`${result.type}-${result.ip}`)
        threats.push(result)
      }
    })
  })

  // 暴力破解
  detectBruteForce(entries).forEach(t => {
    if (!seen.has(`${t.type}-${t.ip}`)) {
      seen.add(`${t.type}-${t.ip}`)
      threats.push(t)
    }
  })

  const summary = threats.length > 0
    ? `发现 ${threats.length} 类可疑行为，涉及 ${seen.size} 个来源`
    : '未发现明显威胁'

  return { threats, summary }
}
