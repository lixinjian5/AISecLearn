# AISecLearn — Security Module

本目录包含 AISecLearn 项目的安全模块内容。

## 目录结构

```
security/
├── README.md                    ← 本文件
├── knowledge_base/              ← 漏洞知识库
│   ├── sql_injection.md         ← SQL 注入
│   ├── xss.md                   ← XSS 跨站脚本
│   ├── csrf.md                  ← CSRF 跨站请求伪造
│   ├── rce.md                   ← 远程命令/代码执行
│   ├── file_inclusion.md        ← 文件包含漏洞
│   ├── unsafe_file_upload.md    ← 不安全文件上传
│   ├── unsafe_file_download.md  ← 不安全文件下载
│   ├── over_permission.md       ← 越权漏洞
│   ├── directory_traversal.md   ← 目录遍历
│   ├── sensitive_info_leak.md   ← 敏感信息泄露
│   ├── deserialization.md       ← 反序列化漏洞
│   ├── xxe.md                   ← XXE 外部实体注入
│   ├── ssrf.md                  ← SSRF 服务端请求伪造
│   ├── url_redirect.md          ← 不安全的 URL 重定向
│   └── brute_force.md           ← 暴力破解
├── code_analysis/               ← 代码安全分析规则
│   ├── README.md                ← 规则索引
│   └── rules/
│       ├── R001_sql_injection.md
│       ├── R002_no_param_query.md
│       ├── R003_xss.md
│       ├── R004_command_injection.md
│       └── R005_R017_other.md
└── lab/                         ← 靶场实验（由你设计）
```

## 知识库覆盖的漏洞类型

总计 15 类漏洞，涵盖了 Pikachu 靶场中出现的所有漏洞类型。

## 代码分析规则

总计 17 条检测规则，覆盖常见 Web 安全漏洞的检测模式。
