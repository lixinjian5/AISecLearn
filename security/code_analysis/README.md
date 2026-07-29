# 代码安全分析规则

## 说明

此目录包含代码安全分析的检测规则。每条规则定义了一种安全漏洞的检测模式，供 AI 自动分析用户提交的代码时使用。

## 规则格式

每条规则包含：

```yaml
rule:
  id: "R001"
  name: "SQL注入检测"
  severity: "critical"       # critical / high / medium / low
  language: ["python", "php", "java", "javascript"]
  description: "检测..."
  pattern:                   # 检测模式
    - type: "regex" | "ast" | "keyword"
      value: "..."
  suggestion: "修复建议..."
```

## 规则列表

| 编号 | 名称 | 严重程度 | 适用语言 |
|------|------|----------|----------|
| R001 | SQL 注入检测 - 字符串拼接 | 🔴 Critical | Python, PHP, Java, JS |
| R002 | SQL 注入检测 - 未使用参数化查询 | 🔴 Critical | Python, PHP, Java |
| R003 | XSS 检测 - 未转义输出 | 🔴 Critical | PHP, Java, JS |
| R004 | 命令注入检测 | 🔴 Critical | Python, PHP, Java, JS |
| R005 | 文件包含漏洞检测 | 🟠 High | PHP |
| R006 | 不安全的反序列化 | 🟠 High | PHP, Java, Python |
| R007 | eval 危险函数调用 | 🟠 High | Python, PHP, JS |
| R008 | 文件上传 - 缺乏类型验证 | 🟠 High | Python, PHP, Java |
| R009 | 路径遍历检测 | 🟡 Medium | Python, PHP, Java |
| R010 | 硬编码密码/密钥 | 🟡 Medium | 所有语言 |
| R011 | CSRF Token 缺失 | 🟡 Medium | Python, PHP, Java |
| R012 | 危险函数 - exec/system | 🟠 High | Python, PHP, JS |
| R013 | 敏感信息泄露 - 错误信息暴露 | 🟡 Medium | Python, PHP |
| R014 | XXE 检测 - XML 外部实体 | 🟠 High | PHP, Java, Python |
| R015 | SSRF 检测 - 用户控制的 URL 请求 | 🟠 High | Python, PHP, Java |
| R016 | 越权检测 - 用户可控 ID | 🟡 Medium | Python, PHP, Java |
