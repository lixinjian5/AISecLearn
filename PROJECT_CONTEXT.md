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

1. **AI 安全导师** — 智能问答、自适应教学
2. **课程学习中心** — Web 安全、网络攻防、代码审计
3. **在线练习 & AI 批改** — 自动出题、智能批改、错题记录
4. **安全靶场** — SQL 注入、XSS、文件上传、认证绕过等实战实验
5. **AI 代码安全分析** — 提交代码获得漏洞检测与修复建议
6. **AI 日志分析** — 服务器日志智能分析，识别攻击行为
7. **学习数据追踪** — 学习时间、正确率、能力雷达图、进度趋势
8. **用户系统** — 注册/登录、个人中心、学习等级

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
| **前端** | React 18 · Vite · Tailwind CSS v3.4 · React Router v6 · React Bits |
| **后端** | Python · FastAPI（待开发） |
| **数据库** | MySQL · Redis（待开发） |
| **AI** | DeepSeek API · Prompt Engineering · RAG（待开发） |
| **部署** | Linux · Docker · Nginx（待开发） |

---

## 📁 当前项目结构

```
D:\project1\aianquan\
├── README.md
├── PROJECT_CONTEXT.md          ← 你正在看的文件
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
└── src/
    ├── main.jsx                ← React 入口
    ├── App.jsx
    ├── index.css               ← Tailwind 入口 + 全局样式
    ├── router/
    │   └── index.jsx           ← 16 条路由
    ├── layouts/
    │   └── MainLayout.jsx      ← Sidebar + Header + 内容区
    ├── components/
    │   └── layout/
    │       ├── Sidebar.jsx     ← Logo、导航、用户信息
    │       └── Header.jsx      ← 页面标题、日期、通知
    ├── pages/                  ← 空，各页面待开发
    ├── hooks/                  ← 空
    ├── utils/                  ← 空
    └── assets/                 ← 空
```

---

## 🌿 Git 分支

| 分支 | 用途 | 状态 |
| --- | --- | --- |
| `main` | 稳定版本，PR 合并，已设保护 | ✅ |
| `dev/frontend` | 李欣键 — 前端 + AI | ✅ 当前 |
| `dev/backend` | 邓倬言 — 后端 | ✅ |
| `dev/security` | 刘梓欣 — 安全 | ✅ |

**规则**：禁止直接 push 到 main，所有代码通过 Pull Request 合并。

---

## 📋 开发进度

### ✅ 已完成

| 日期 | 内容 |
| --- | --- |
| 2026-07-25 | Vite + React 项目创建 |
| 2026-07-25 | Tailwind CSS v3 配置（primary + cyber 色系） |
| 2026-07-25 | React Router v6 配置，16 条路由 |
| 2026-07-25 | MainLayout 布局：Sidebar + Header + 内容区 |
| 2026-07-25 | Sidebar：Logo、9 导航项、用户底栏 |
| 2026-07-25 | Header：动态标题、日期、通知铃铛、头像 |
| 2026-07-25 | Git 初始化 + GitHub 仓库创建 |
| 2026-07-25 | 4 分支创建（main / dev/frontend / dev/backend / dev/security）|
| 2026-07-25 | 23 个 Issues 创建（frontend×6 / backend×6 / security×6 / ai×5）|
| 2026-07-25 | README.md 完整（项目介绍、技术栈、团队分工）|

### 🔜 下一步（MVP 策略）

**开发方式**：vibe coding（AI 写大部分代码，我们审+改）

**MVP 核心模块**（按优先级）：
1. **AI 导师页面** — 三栏布局 + DeepSeek API 对话 + 朋友型 Prompt
2. **Dashboard** — 统计卡片、欢迎区
3. **题库 + 练习 + 错题** — 选择题、AI 批改
4. **课程列表** — 课程卡片
5. **部署** — 华为云服务器上线

**MVP 砍掉**：注册/登录、靶场、日志分析、后台管理（以后再加）

**原则**：没做好的页面保留入口，显示"正在开发中"

---

## 📝 开发日志

### 2026-07-25

**完成**：项目地基 + 布局框架 + GitHub 团队仓库

**修改文件**：15 个文件，3343 行代码

**关键决策**：
- 前端选 React 而非 Vue3（React Bits 组件库生态更好）
- Tailwind v3 而非 v4（v3 教程多，React Bits 官方兼容）
- 分支保护：main 必须通过 PR 合并

**当前状态**：布局完成，16 页面占位，准备开发 Dashboard

**下一步**：阶段 3 — Dashboard 首页
