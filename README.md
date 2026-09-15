# AISecLearn

> AI-powered cybersecurity learning platform for students.

[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com)
[![UI](https://img.shields.io/badge/UI-React%20Bits%20%2B%20Tailwind-6366f1)](https://reactbits.dev)
<img width="2880" height="1920" alt="image" src="https://github.com/user-attachments/assets/a0f9f6f8-0db9-4ea8-90fb-e7ceb1cddf37" />

## 📖 项目简介

AISecLearn 是一个面向高校学生的 **AI + 网络安全学习平台**，将 AI 学习助手、网络安全课程、在线题库、代码安全分析、日志分析、安全实验靶场等功能整合为一体。

**在线演示**：`http://101.245.77.19`

## 🎯 核心功能

| 功能 | 说明 | 状态 |
| --- | --- | --- |
| 🤖 **AI 网络安全导师** | 朋友型 AI 导师，多轮对话、按进度教学 | ✅ |
| 📚 **课程学习中心** | 12 门安全课程，课程详情 + 学习大纲 | ✅ |
| 📝 **在线练习 & AI 批改** | 15 道安全题，AI 逐题批改并给出解析 | ✅ |
| 📒 **错题本** | 答错自动记录，正误对比回顾 | ✅ |
| ❓ **题库浏览** | 按分类浏览全部题目 | ✅ |
| 🎯 **安全靶场** | SQL 注入等实验（模拟环境） | ✅ |
| 🔍 **AI 代码安全分析** | 粘贴代码 → AI 检测漏洞 + 修复建议 | ✅ |
| 📊 **AI 日志分析** | 规则引擎 + AI 双层威胁检测 | ✅ |
| 📈 **学习数据追踪** | 真实答题数据、分类正确率、周趋势 | ✅ |
| 👤 **用户系统** | 注册 / 登录 / JWT 认证 | ✅ |
| 👑 **后台管理** | 用户管理、平台统计（仅管理员） | ✅ |
| 📚 **RAG 知识库** | 向量检索增强问答 | 🚧 规划中 |

## 🛠️ 技术栈

| 层级 | 技术 |
| --- | --- |
| **前端** | React 18 · Vite · Tailwind CSS 3 · React Router v6 · **React Bits**（18+ 动画组件） |
| **后端** | Python · FastAPI · SQLAlchemy ORM · JWT（python-jose） |
| **数据库** | SQLite（开发） / MySQL（生产，`schema.sql`） |
| **AI** | DeepSeek API · Prompt Engineering |
| **部署** | Ubuntu · Nginx · systemd |

## 🔒 安全设计

本项目在设计上考虑了实际部署的安全问题：

| 设计 | 说明 |
| --- | --- |
| **API Key 不下发前端** | AI 请求统一走后端代理 `/api/ai/chat`，DeepSeek Key 只存服务器环境变量，浏览器抓包拿不到 |
| **JWT 认证** | 所有受保护接口校验 `Authorization: Bearer <token>` |
| **密码哈希** | bcrypt 加盐哈希，绝不存明文 |
| **进度数据用户隔离** | 学习记录按 JWT 用户 ID 隔离，互不可见 |
| **后台权限控制** | `/api/admin/*` 校验 `role == admin`，非管理员返回 403 |
| **SQL 注入防护** | 全程使用 SQLAlchemy ORM 参数化查询 |
| **题库防作弊** | 练习模式接口不返回正确答案，仅题库浏览模式（`include_answer=true`）返回 |

## 📁 项目结构

```
AISecLearn/
├── src/                      # 前端源码
│   ├── components/
│   │   ├── layout/           # Sidebar / Header
│   │   └── react-bits/       # React Bits 组件（18+）
│   ├── pages/                # 16 个页面
│   ├── layouts/              # MainLayout
│   ├── router/               # 路由 + 守卫
│   ├── services/             # api.js（后端接口）/ aiService.js（AI 代理）
│   ├── hooks/                # useChat
│   └── utils/                # Prompt / 日志规则
├── backend/                  # 后端（FastAPI）
│   ├── main.py               # API 入口
│   ├── models.py             # ORM 模型（User/Question/Course/LearningRecord）
│   ├── database.py           # 数据库配置
│   ├── auth.py               # JWT + 密码哈希
│   ├── seed_data.py          # 数据导入
│   ├── make_admin.py         # 设置管理员脚本
│   ├── schema.sql            # MySQL 建表脚本
│   └── data/                 # 数据文件
├── security/                 # 安全模块（知识库 + 检测规则）
│   ├── knowledge_base/       # 15 类漏洞知识库
│   ├── code_analysis/rules/  # 17 条代码检测规则
│   └── lab/                  # 靶场设计
├── docs/                     # 设计文档
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Python 3.10+

### 前端

```bash
npm install
npm run dev
# 访问 http://localhost:5173
```

### 后端

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 配置 DeepSeek API Key（PowerShell）
$env:DEEPSEEK_API_KEY="sk-你的key"

python main.py
# 访问 http://localhost:8000/docs 查看 API 文档
```

### 设置管理员

```bash
cd backend
python make_admin.py <用户名>
```

## 🚢 生产部署

```bash
# 1. 前端构建
npm run build        # 生成 dist/

# 2. 上传 dist/ 到服务器，Nginx 托管
# 3. 后端用 systemd 管理，设置环境变量 DEEPSEEK_API_KEY
# 4. Nginx 配置：/ → 静态文件，/api → 反代到 127.0.0.1:8000
```

## 📋 开发规范

- **主分支**：`main` — 稳定版本
- **开发分支**：`dev/frontend` · `dev/backend` · `dev/security`
- **提交信息**：中文描述，简洁明了

## 👥 团队

| 成员 | 专业 | 负责 |
| --- | --- | --- |
| 李欣键 | 人工智能 | React 前端 · AI 功能 · UI/UX · React Bits · 部署 |
| 邓倬言 | 电子与计算机工程 | FastAPI 后端 · 数据库 · API 开发 |
| 刘梓欣 | 网络安全 | 安全靶场 · 代码分析 · 日志分析 · 漏洞知识库 |

## 📄 许可证

MIT License
