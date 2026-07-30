# MakeX Inspire 成绩统计系统 (STS)

> **S**tudent **T**racking **S**ystem — MakeX Inspire 赛事成绩统计与管理平台。

---

## 📁 目录说明

```
insTools/
├── docs/          前端静态文件（GitHub Pages 过渡方案）
├── src/           Cloudflare Pages 源代码（正式部署目标）
├── docs-dev/      开发者文档（进度、约定、架构、决策）
├── workers/       Cloudflare Workers API（开发中）
├── AGENTS.md      AI 代理指令（自动加载）
└── _headers       Cloudflare Pages 配置
    _routes.json
```

### `docs/` — 前期过渡方案

`docs/` 是 GitHub Pages 发布目录，作为 Cloudflare 迁移完成前的临时静态部署方案。
迁移验证通过后，将完全切换到 Cloudflare Pages，`docs/` 可停用或保留为备用。

### `src/` — Cloudflare Pages 源代码

正式部署目标，完整项目结构位于此目录：

```
src/
├── pages/         HTML 页面（index.html 为首页）
├── js/
│   ├── apps/      页面业务逻辑（stats / training / tasks / admin）
│   ├── shared.js  通用数据层
│   ├── header.js  导航组件
│   └── ...
├── css/           全局样式
└── tools/         开发者工具
```

### `docs-dev/` — 开发者文档

项目开发进度和规范均记录在此目录，每次会话前读取对应文件了解当前状态。

| 文件 | 内容 |
|------|------|
| `ROADMAP.md` | 路线图 — 各阶段进度和待办任务 |
| `CHANGELOG.md` | 变更日志 — 已完成的功能记录 |
| `ISSUES.md` | 已知问题 — Bug 和改进建议 |
| `CONVENTIONS.md` | 项目约定 — 目录结构、命名规则、模块依赖 |
| `ARCHITECTURE.md` | 架构设计 — StorageAdapter 等核心设计 |
| `DECISIONS.md` | 决策记录 — 重要决策及其理由 |

---

## 🚀 部署计划

### 当前：GitHub Pages（过渡期）

项目前端文件位于 `docs/` 目录，已配置为 GitHub Pages 发布目录。

**访问地址**：`https://BK-Y.github.io/ins_training_tool/`

> 启用方式：Settings → Pages → Source: **Deploy from branch** → `main` → `/docs`

### 目标：Cloudflare Pages + Workers + D1

详见 `docs-dev/ROADMAP.md`。

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
