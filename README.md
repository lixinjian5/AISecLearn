# AISecLearn

> AI-powered cybersecurity learning platform for students.

## 📖 项目简介

AISecLearn 是一个面向高校学生的 **AI + 网络安全学习平台**，将 AI 学习助手、网络安全课程、在线题库、代码安全分析、日志分析、安全实验靶场等功能整合为一体，打造沉浸式网络安全学习体验。

## 🎯 核心功能

- 🤖 **AI 网络安全导师** — 智能问答、个性化学习路径、自适应教学
- 📚 **课程学习中心** — Web 安全、网络攻防、代码审计等系统课程
- 📝 **在线练习 & AI 批改** — 自动出题、智能批改、错题记录
- 🎯 **安全靶场** — SQL 注入、XSS、文件上传、认证绕过等实战实验
- 🔍 **AI 代码安全分析** — 提交代码即可获得漏洞检测与修复建议
- 📊 **AI 日志分析** — 服务器日志智能分析，识别攻击行为
- 📈 **学习数据追踪** — 学习时间、正确率、能力雷达图、进度趋势

## 🛠️ 技术栈

| 层级 | 技术 |
| --- | --- |
| **前端** | React 18 · Vite · Tailwind CSS 3 · React Router v6 · React Bits |
| **后端** | Python · FastAPI · MySQL · Redis |
| **AI** | LLM API · Prompt Engineering · RAG |
| **安全** | Web Security · Vulnerability Analysis · Log Analysis |
| **部署** | Linux · Docker · Nginx |

## 👥 团队分工

| 成员 | 专业 | 负责 |
| --- | --- | --- |
| 李欣键 | 人工智能 | React 前端 · AI 功能 · UI/UX · React Bits |
| （计算机专业） | 计算机科学 | FastAPI 后端 · MySQL 数据库 · Redis · API 开发 |
| （网络安全专业） | 网络安全 | 安全实验靶场 · 代码分析 · 日志分析 · 漏洞知识库 |

## 📁 项目结构（规划）

```
AISecLearn/
├── frontend/                # React 前端项目
│   ├── src/
│   │   ├── components/      # 通用组件
│   │   ├── pages/           # 页面组件
│   │   ├── layouts/         # 布局组件
│   │   ├── router/          # 路由配置
│   │   ├── hooks/           # 自定义 Hooks
│   │   └── utils/           # 工具函数
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/                 # FastAPI 后端项目（待搭建）
├── security/                # 安全模块（待搭建）
├── ai/                      # AI 模型 & Prompt（待搭建）
├── docs/                    # 项目文档
└── README.md
```

## 🚀 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

访问 `http://localhost:5173`

### 后端（待实现）

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📋 开发规范

- **主分支**：`main` — 稳定版本，通过 PR 合并
- **开发分支**：`dev/frontend` · `dev/backend` · `dev/security`
- **功能分支**：`feature/xxx`
- **提交信息**：中文描述，简洁明了
- **代码审查**：所有合并需经过 PR + Review

## 📄 许可证

MIT License
