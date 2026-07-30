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

| 文件                | 定位          | 内容                                        |
| ------------------- | ------------- | ------------------------------------------- |
| `ROADMAP.md`      | 🎯 主动计划   | 各阶段进度和待办任务（接下来要做什么）      |
| `CURRENT.md`      | 🔥 当前推进   | 正在进行的任务和阻塞项（现在在做什么）      |
| `ISSUES.md`       | 🐛 被动发现   | 推进中发现的 Bug 和改进建议（需要修什么）   |
| `CHANGELOG.md`    | ✅ 历史记录   | 已完成的功能变更（做过什么）                |
| `CONVENTIONS.md`  | 📐 规范约定   | 目录结构、命名规则、模块依赖（怎么写代码）  |
| `ARCHITECTURE.md` | 🏗️ 架构设计 | StorageAdapter 等核心设计（为什么这么设计） |
| `DECISIONS.md`    | 📝 决策留档   | 重要决策及其理由（为什么选这个）            |

---

## 🚀 项目部署

### GitHub Pages

github pages部署处于过渡期，项目具体内容基本不在提供更新计划！

项目前端文件位于 `docs/` 目录，已配置为 GitHub Pages 发布目录。

**访问地址**：`https://BK-Y.github.io/ins_training_tool/`

如果要独立部署，参考github pages部署策略进行。

### Cloudflare Pages + Workers + D1

详见 `docs-dev/ROADMAP.md`。

#### 自动化部署（GitHub Actions）

项目提供自动化部署方案： 每次向 `main` 分支推送代码时，GitHub Actions 自动触发部署到 Cloudflare Pages。

工作流文件：`.github/workflows/deploy.yml`

**首次部署前准备**

1. **创建 Cloudflare API Token**

   - 登录 Cloudflare Dashboard → [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - 创建 Token → 选择 **Cloudflare Pages** 模板
   - 权限：`Cloudflare Pages:Edit`
   - 复制生成的 token
2. **添加到 GitHub Secrets**

   - 仓库 Settings → Secrets and variables → Actions
   - 新建 Repository secret
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: 粘贴上一步的 token
3. **在 Cloudflare 创建 Pages 项目（可选）**

   - 如果尚未创建，首次部署时 wrangler 会自动创建
   - 项目名称需与 `wrangler.toml` 中的 `name` 一致：`ins-tools`

**部署状态查看**

```
GitHub 仓库 → Actions 标签页 → 点击最新运行 → 查看部署日志
部署成功后访问 https://ins-tools.pages.dev/
```

**回滚**

- GitHub Actions → 选择之前的成功运行 → **Re-run job**
- 或 Cloudflare Dashboard → Pages → `ins-tools` → **Deployments** → 选择版本部署

#### 部署状态查看

```
GitHub 仓库 → Actions 标签页
  ↓
点击最新 workflow 运行
  ↓
查看部署日志
  ↓
成功后访问 https://ins-tools.pages.dev/
```

#### 回滚

如需回滚到上一版本：

- GitHub Actions → 选择之前的成功运行 → **Re-run job**
- 或 Cloudflare Dashboard → Pages → `ins-tools` → **Deployments** → 选择版本部署

---

#### ⚙️ Cloudflare Pages 配置说明

项目根目录包含三个 Cloudflare Pages 配置文件，仅 Cloudflare 读取，不影响 GitHub Pages。

##### `_headers` — HTTP 响应头

```txt
/src/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

| 参数                                | 作用                                   | 修改影响                                       |
| ----------------------------------- | -------------------------------------- | ---------------------------------------------- |
| `X-Content-Type-Options: nosniff` | 防止 MIME 类型嗅探攻击                 | 基本安全配置，建议保留                         |
| `X-Frame-Options: DENY`           | 禁止页面被嵌入 iframe（防点击劫持）    | 如需在 iframe 中嵌入展示页，改为`SAMEORIGIN` |
| `Referrer-Policy`                 | 控制 HTTP Referer 头的发送范围         | 隐私相关，一般无需修改                         |
| `Permissions-Policy`              | 限制浏览器 API 权限（摄像头/麦克风等） | 根据需求调整                                   |

##### `_routes.json` — 路由规则

```json
{ "version": 1, "include": ["/*"], "exclude": [] }
```

| 参数                | 说明                  | 修改场景                                                    |
| ------------------- | --------------------- | ----------------------------------------------------------- |
| `include: ["/*"]` | 所有请求由 Pages 处理 | 默认配置                                                    |
| `exclude: []`     | 排除的路径            | Workers 上线后，将`/api/*` 加入 `exclude` 并指向 Worker |

后期加入 Workers API 后，配置会变为：

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/api/*"]
}
```

然后在 Cloudflare Dashboard 中创建 Workers 路由 `/api/*` → 你的 Worker。

##### `wrangler.toml` — 构建配置

```toml
name = "ins-tools"
compatibility_date = "2026-07-30"
pages_build_output_dir = "src"
```

| 参数                       | 说明                      | 修改场景                            |
| -------------------------- | ------------------------- | ----------------------------------- |
| `name`                   | Cloudflare Pages 项目名称 | 在 Dashboard 创建项目时需保持一致   |
| `compatibility_date`     | Workers 运行时兼容性日期  | 更新 SDK 时同步更新                 |
| `pages_build_output_dir` | 部署的目录路径            | 如需部署整个仓库根目录，改为`"."` |

##### 规划中：Cloudflare Pages + Workers + D1

正在逐步迁移到 Cloudflare 架构，以实现：

- **Cloudflare Pages** — 托管前端静态文件
- **Cloudflare Workers** — REST API 后端（认证、CRUD、数据同步）
- **Cloudflare D1** — SQLite 数据库（用户、班级、学员、任务、成绩等）
- **JWT 认证** — 多角色权限管理（admin / coach / student）

详见 [`ARCHITECTURE-PLAN.md`](ARCHITECTURE-PLAN.md)。

---

## 📊 项目约定

### 基本概念

每条**记录**（模拟赛/正赛）包含多个**任务**，每个任务可进行多**轮**比赛。
每轮比赛中，每名学员获得一个**得分**和一个**用时**。

### 排名规则
#### 第一条：最终成绩

**最终成绩 = 各任务最佳成绩之和**

得分和用时分别独立计算：

- **最终得分** = 所有任务最佳得分之和
- **最终用时** = 所有任务最佳用时之和（仅记录最佳成绩对应的用时）

#### 第二条：最佳成绩确定

同一任务在不同轮次中：

| 比较顺序            | 规则                         | 示例                |
| ------------------- | ---------------------------- | ------------------- |
| ① 先比得分         | **得分越高，成绩越好** | 90分 > 85分         |
| ② 得分相同时比用时 | **用时越短，成绩越好** | 90分/10s > 90分/12s |

即：同一任务有多轮成绩时，取得分最高的那一轮；若得分相同，取用时最短的那一轮。

#### 第三条：最终排名

所有学员按最终成绩排序：

| 比较顺序                    | 规则                           | 示例                  |
| --------------------------- | ------------------------------ | --------------------- |
| ① 先比最终得分             | **得分越高，排名越靠前** | 总分180 > 总分170     |
| ② 最终得分相同时比最终用时 | **用时越短，排名越靠前** | 180分/25s > 180分/28s |

#### 示例

集训「第一期」有任务 A（2轮）和任务 B（1轮）：

| 学员 | 任务A 第1轮        | 任务A 第2轮        | 任务A 最佳 | 任务B              | 最终得分      | 最终用时      | 排名 |
| ---- | ------------------ | ------------------ | ---------- | ------------------ | ------------- | ------------- | :--: |
| 张三 | 85分/12s           | **90分/10s** | 90分/10s   | **88分/15s** | **178** | **25s** | 🥇 1 |
| 李四 | **92分/11s** | 88分/13s           | 92分/11s   | **80分/14s** | **172** | **25s** | 🥈 2 |
| 王五 | **70分/16s** | 75分/15s           | 75分/15s   | **90分/13s** | **165** | **28s** | 🥉 3 |

> 张三任务A最佳取第2轮（90分 > 85分），任务B 88分，总分178，排名第1。
> 李四任务A最佳取第1轮（92分），总分172，排名第2。
> 王五任务A最佳取第2轮（75分 > 70分），总分165，排名第3。

---

## 🏗️ 架构与数据库

详见 `docs-dev/ARCHITECTURE.md`（StorageAdapter 设计、IndexedDB 存储结构等）。

---

*系统版本: 2026-07-30*
