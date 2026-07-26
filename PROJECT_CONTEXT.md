# PROJECT_CONTEXT.md — AISecLearn 项目长期记忆

> 每次开始本项目开发前，第一步读取此文件。

---

## 👤 我是谁

| | |
| --- | --- |
| **姓名** | 李欣键 |
| **学校** | 西南民族大学 |
| **专业** | 人工智能 |
| **年级** | 大二下 |
| **目标** | 暑期 AI 应用开发实习生 |
| **方向** | AI应用开发 / Python开发 / AIGC开发 |

### 已掌握

- Python：if、for、函数、list、dict、JSON、requests、文件读写
- 能调用 DeepSeek API、写简单 Prompt、用 Streamlit 开发
- 数据库：SELECT、WHERE、ORDER BY、GROUP BY、JOIN
- Git：基础版本管理
- 接触过：RAG、Agent、LangChain 概念

### 当前不足（注意教我）

- 后端开发经验少（FastAPI、RESTful API 设计）
- 数据库设计经验不足（表关系、ORM）
- 工程经验不足（Docker、Linux、Nginx、部署）
- AI 工程经验不足（RAG 完整流程、向量数据库、Embedding、Agent 架构）

---

## 📦 项目概况

| | |
| --- | --- |
| **项目名称** | AISecLearn |
| **定位** | AI + 网络安全学习平台 |
| **目标** | 不是简单聊天机器人，而是可以展示给面试官的完整项目 |
| **GitHub** | https://github.com/lixinjian5/AISecLearn |

### 核心功能规划

1. **AI 安全导师** — 智能问答、自适应教学（✅ 已实现）
2. **课程学习中心** — Web 安全、网络攻防、代码审计
3. **在线练习 & AI 批改** — 自动出题、智能批改、错题记录
4. **安全靶场** — SQL 注入、XSS、文件上传、认证绕过
5. **AI 代码安全分析** — 提交代码获得漏洞检测与修复建议
6. **AI 日志分析** — 服务器日志智能分析
7. **学习数据追踪** — Dashboard 看板（✅ 已实现）
8. **用户系统** — 注册/登录、个人中心

---

## 👥 团队

| 成员 | 专业 | 负责 | GitHub |
| --- | --- | --- | --- |
| 李欣键 | 人工智能 | React 前端 · AI 功能 · UI/UX | @lixinjian5 |
| 邓倬言 | 电子与计算机工程 | FastAPI 后端 · MySQL · Redis · API | @dengzhuoyan |
| 刘梓欣 | 网络安全 | 安全靶场 · 代码分析 · 日志分析 · 漏洞知识库 | — |

---

## 🛠️ 技术栈（已确定）

| 层级 | 技术 |
| --- | --- |
| **前端** | React 18 · Vite · Tailwind CSS v3.4 · React Router v6 · React Bits（12 组件） |
| **后端** | Python · FastAPI（待开发） |
| **数据库** | MySQL · Redis（待开发） |
| **AI** | DeepSeek API · Prompt Engineering |
| **部署** | Linux · Docker · Nginx（待开发） |
| **依赖** | framer-motion · gsap · ogl |

---

## 📁 当前项目结构

```
D:\project1\aianquan\
├── PROJECT_CONTEXT.md
├── README.md
├── .env.example
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── docs/
│   └── api-architecture.md       ← 多模式 API 架构设计
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── router/index.jsx           ← 16 条路由
    ├── layouts/MainLayout.jsx
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.jsx        ← Particles + Threads + Magnet + ClickBurst
    │   │   └── Header.jsx         ← ShinyText + 渐变光条
    │   └── react-bits/            ← 12 个 React Bits 组件
    ├── pages/
    │   ├── AITutor/AITutor.jsx    ← AI 导师（✅）
    │   └── Dashboard/Dashboard.jsx← 首页看板（✅）
    ├── services/aiService.js      ← AI 调用抽象层
    ├── hooks/useChat.js           ← 聊天状态管理
    ├── utils/aiTutorPrompt.js     ← 朋友型导师 Prompt
    └── assets/
```

---

## 🌿 Git 分支

| 分支 | 用途 | 状态 |
| --- | --- | --- |
| `main` | 稳定版本，PR 合并，已设保护 | ✅ |
| `dev/frontend` | 李欣键 — 前端 + AI | ✅ 当前 |
| `dev/backend` | 邓倬言 — 后端 | ✅ |
| `dev/security` | 刘梓欣 — 安全 | ✅ |

---

## 📋 开发进度

### ✅ 已完成

| 日期 | 内容 |
| --- | --- |
| 2026-07-25 | Vite + React + Tailwind + React Router 项目创建 |
| 2026-07-25 | MainLayout 布局（Sidebar + Header） + 16 路由 |
| 2026-07-25 | Git + GitHub 仓库 + 4 分支 + 23 Issues |
| 2026-07-25 | **12 个 React Bits 组件集成** |
| 2026-07-25 | **AI 导师页面**：三栏布局 + DeepSeek API + 朋友型 Prompt |
| 2026-07-25 | **Dashboard 首页**：9 组件集成（欢迎区+统计+AI助手+趋势+错题） |
| 2026-07-25 | **UI 升级**：Sidebar 双层特效 + Header 光泽标题 |
| 2026-07-25 | 多模式 API 架构文档 |
| 2026-07-25 | 三份团队手册（桌面） |

### 🔜 下一步

1. **课程列表页面** — 课程卡片
2. **题库 + 练习页面** — 选择题、AI 批改
3. **代码安全分析页面** — 上传代码 → AI 分析
4. **部署** — 服务器上线

---

## 📝 开发日志

### 2026-07-25

**完成内容**：
- 项目地基：Vite + React + Tailwind + React Router
- 布局框架：Sidebar + Header + MainLayout
- GitHub 仓库：4 分支、23 Issues、团队手册
- React Bits：12 个组件全部转入项目（Particles、Threads、SpotlightCard、GradientText、Counter、Magnet、ShinyText、FadeContent、BorderGlow、TiltedCard、ClickBurst、SpecularButton）
- AI 导师页面：三栏布局，接入 DeepSeek API，朋友型 System Prompt，抽象层 aiService.js
- Dashboard：欢迎区 + 4 统计卡片（Counter） + 继续学习 + AI 助手（BorderGlow） + 趋势图 + 错题列表
- UI 氛围：Sidebar Particles + Threads 双层特效；Header ShinyText + 渐变光条；导航 Magnet + ClickBurst
- 架构文档：AI 多模式调用方案（免费/自定义Key/管理员）
- 桌面三份手册：前端（李欣键）、后端（邓倬言）、安全（刘梓欣）

**修改文件**：26 个文件，2258 行新增代码

**关键决策**：
- React 而非 Vue3（React Bits 生态）
- Tailwind v3 而非 v4（稳定 + 官方兼容）
- AI 调用走抽象层（后续切后端只改 aiService.js）
- MVP 策略：核心 3-4 功能做精，其余写"正在开发中"

**当前状态**：AI 导师可对话、Dashboard 可用、其余占位

**下一步**：课程列表 + 题库练习
