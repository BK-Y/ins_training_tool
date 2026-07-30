# MakeX Inspire 成绩统计系统 (STS)

> **S**tudent **T**racking **S**ystem — MakeX Inspire 赛事成绩统计与管理平台。

---

## 📁 项目结构

```
insTools/
├── docs/                          # ← 前端静态文件（GitHub Pages 发布目录）
│   ├── index.html                 #   入口页（自动跳转到 stats.html）
│   ├── stats.html                 #   成绩统计（主页面）
│   ├── training.html              #   集训管理
│   ├── tasks.html                 #   任务管理
│   ├── admin.html                 #   教务管理（班级 + 学员）
│   ├── display.html               #   成绩展示（大屏模式）
│   ├── shared.js                  #   通用数据层 & 工具函数
│   ├── shared_indexdb.js          #   IndexedDB 存储层
│   ├── analysis.js                #   统计分析函数
│   ├── schedule.js                #   赛程模块
│   ├── header.js                  #   导航栏 & 侧边栏组件
│   ├── style.css                  #   全局样式
│   ├── apps/                      #   页面业务逻辑（从 HTML 中拆分）
│   │   ├── stats.js
│   │   ├── training.js
│   │   ├── tasks.js
│   │   └── admin.js
│   └── tools/
│       └── db-manager.html        #   STS_DB 开发者工具
├── workers/                       # Cloudflare Workers API（开发中）
├── _headers                       # Cloudflare Pages 安全/缓存头配置
├── _routes.json                   # Cloudflare Pages 路由规则
├── wrangler.toml                  # Cloudflare 部署配置
├── AGENTS.md                     # AI 代理项目指令（自动加载）
├── plans/                        # 项目计划、约定、决策记录
└── README.md
```

---

## 🚀 部署方式

### 当前：GitHub Pages（静态前端）

项目前端文件位于 `docs/` 目录，已配置为 GitHub Pages 发布目录。

**访问地址**：`https://BK-Y.github.io/ins_training_tool/`

> 如需在自己的仓库启用，进入 Settings → Pages → Source: **Deploy from branch** → `main` → `/docs`

### 规划中：Cloudflare Pages + Workers + D1

正在逐步迁移到 Cloudflare 架构，以实现：
- **Cloudflare Pages** — 托管前端静态文件
- **Cloudflare Workers** — REST API 后端（认证、CRUD、数据同步）
- **Cloudflare D1** — SQLite 数据库（用户、班级、学员、任务、成绩等）
- **JWT 认证** — 多角色权限管理（admin / coach / student）

详见 [`ARCHITECTURE-PLAN.md`](ARCHITECTURE-PLAN.md)。

---

## 📊 排名规则

### 基本概念

每条**记录**（模拟赛/正赛）包含多个**任务**，每个任务可进行多**轮**比赛。
每轮比赛中，每名学员获得一个**得分**和一个**用时**。

### 第一条：最终成绩

**最终成绩 = 各任务最佳成绩之和**

得分和用时分别独立计算：

- **最终得分** = 所有任务最佳得分之和
- **最终用时** = 所有任务最佳用时之和（仅记录最佳成绩对应的用时）

### 第二条：最佳成绩确定

同一任务在不同轮次中：

| 比较顺序 | 规则 | 示例 |
|---------|------|------|
| ① 先比得分 | **得分越高，成绩越好** | 90分 > 85分 |
| ② 得分相同时比用时 | **用时越短，成绩越好** | 90分/10s > 90分/12s |

即：同一任务有多轮成绩时，取得分最高的那一轮；若得分相同，取用时最短的那一轮。

### 第三条：最终排名

所有学员按最终成绩排序：

| 比较顺序 | 规则 | 示例 |
|---------|------|------|
| ① 先比最终得分 | **得分越高，排名越靠前** | 总分180 > 总分170 |
| ② 最终得分相同时比最终用时 | **用时越短，排名越靠前** | 180分/25s > 180分/28s |

### 示例

集训「第一期」有任务 A（2轮）和任务 B（1轮）：

| 学员 | 任务A 第1轮 | 任务A 第2轮 | 任务A 最佳 | 任务B | 最终得分 | 最终用时 | 排名 |
|------|-----------|-----------|-----------|------|---------|---------|:----:|
| 张三 | 85分/12s | **90分/10s** | 90分/10s | **88分/15s** | **178** | **25s** | 🥇 1 |
| 李四 | **92分/11s** | 88分/13s | 92分/11s | **80分/14s** | **172** | **25s** | 🥈 2 |
| 王五 | **70分/16s** | 75分/15s | 75分/15s | **90分/13s** | **165** | **28s** | 🥉 3 |

> 张三任务A最佳取第2轮（90分 > 85分），任务B 88分，总分178，排名第1。
> 李四任务A最佳取第1轮（92分），总分172，排名第2。
> 王五任务A最佳取第2轮（75分 > 70分），总分165，排名第3。

---

## 🗄️ STS_DB 数据库结构

IndexedDB 数据库 `STS_DB` 包含以下表：

| 表名 | 主键 | 索引 | 状态 |
|------|------|------|------|
| `classes` | `id` | — | ✅ 已就绪 |
| `students` | `id` | — | ✅ 已就绪 |
| `enrollments` | `id` | `by_student`, `by_class`, `by_status` | ✅ 已就绪 |

### 存储层次

| 层 | 引擎 | 键名 | 数据范围 |
|----|------|------|---------|
| 主存储 | localStorage | `makexScoreData` | 全部数据（始终保留） |
| 持久存储 | IndexedDB | `STS_DB` | students + classes + enrollments（可选切换） |
| 文件备份 | JSON 下载 | `makex_backup_*.json` | 全部数据（用户手动导出） |

---

*系统版本: 2026-07-30*
