# 项目约定 — insTools

> 所有开发者应遵守的代码结构和命名规范。

---

## 目录结构

```
insTools/
├── docs/          ← GitHub Pages 发布目录（纯静态，不动）
├── src/           ← Cloudflare Pages 源代码
│   ├── pages/     ← HTML 页面
│   ├── js/
│   │   ├── apps/  ← 页面业务逻辑（从 HTML 拆分出的独立 JS）
│   │   ├── *.js   ← 共享库
│   └── css/
├── workers/       ← Cloudflare Workers API
├── plans/         ← 项目计划文件
├── AGENTS.md      ← AI 代理指令（自动加载）
├── README.md      ← 项目说明
└── .github/
    └── copilot-instructions.md  ← VS Code Copilot 指令（可选）
```

## 页面结构

每个 HTML 页面遵循以下加载顺序：

```html
<link rel="stylesheet" href="../css/style.css" />

<script src="../js/shared.js"></script>
<script src="../js/shared_indexdb.js"></script>
<script src="../js/header.js"></script>

<!-- 页面内容 -->
<div class="container">...</div>
<div class="toast-container" id="toastContainer"></div>

<!-- 页面业务逻辑 -->
<script src="../js/apps/xxx.js"></script>
```

## JS 模块职责

| 文件 | 职责 | 依赖 |
|------|------|------|
| `shared.js` | 数据层、工具函数 | 无 |
| `shared_indexdb.js` | IndexedDB 存储扩展 | `shared.js` |
| `analysis.js` | 统计计算（纯函数） | `shared.js` |
| `schedule.js` | 赛程模块 | `shared.js` |
| `header.js` | 导航组件（自动注入） | `shared.js` + `shared_indexdb.js` |
| `apps/*.js` | 页面业务逻辑 | 以上所有 |

## 命名规则

| 模式 | 示例 | 说明 |
|------|------|------|
| `Shared` | `Shared.loadData()` | 全局数据层 |
| `Analysis` | `Analysis.calcRankings()` | 统计计算，纯函数 |
| `Schedule` | `Schedule.loadOrder()` | 赛程管理 |
| `*App` | `StatsApp` / `TrainingApp` | 页面业务逻辑 |
| `*Adapter` | `LocalStorageAdapter` | 存储适配器 |
