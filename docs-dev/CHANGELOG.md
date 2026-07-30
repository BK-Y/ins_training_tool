# 变更日志 — insTools

> 所有显著的功能变更、修复、改进记录于此。

---

## 2026-07-30

### 新增
- `PLAN.md` — 项目综合管理文档（后拆分为 `docs-dev/` 目录 + `AGENTS.md`）
- `src/` 目录 — Cloudflare Pages 源代码结构
  - `src/pages/` — 6 个 HTML 页面，路径引用更新为 `../js/`、`../css/`
  - `src/js/apps/` — 从 HTML 拆出的 4 个独立业务逻辑文件
  - `src/js/` — 共享库（shared / analysis / schedule / header）
  - `src/css/style.css`
  - `src/tools/db-manager.html`
- `docs/` 目录 — GitHub Pages 发布目录，所有前端文件移入
- `README.md` — 增加目录结构和部署说明
- `AGENTS.md` — 项目级 AI 代理指令
- `docs-dev/` 目录 — 开发者文档集

### 变更
- `index.html` → 改为真正的首页（内容为成绩统计，取消跳转）
- `stats.html` → 改为跳转到 `index.html`（兼容旧链接）
- `header.js` → 导航链接指向 `index.html`
- `ARCHITECTURE-PLAN.md` → 内容合并到 `docs-dev/ARCHITECTURE.md`，旧文件删除

### 修复
- `header.js` 中 `tools/db-manager.html` 路径从 `tools/` 修正为 `../tools/`
