# insTools 开发计划 & 项目约定

> 此文件随 Git 版本管理，任何变更请同时更新此文档。

---

## 一、里程碑

```
Phase 1 ████████░░░░░░░░░░  40%  src/ 结构调整 + 内联脚本拆分
Phase 2 ░░░░░░░░░░░░░░░░░░   0%  Cloudflare Workers API
Phase 3 ░░░░░░░░░░░░░░░░░░   0%  Cloudflare Pages 配置
Phase 4 ░░░░░░░░░░░░░░░░░░   0%  StorageAdapter 抽象层 + 前端对接
Phase 5 ░░░░░░░░░░░░░░░░░░   0%  部署 Cloudflare
```

---

## 二、项目约定（Conventions）

### 2.1 目录结构约定

```
insTools/
├── docs/          ← GitHub Pages 发布目录（纯静态，不动）
├── src/           ← Cloudflare Pages 源代码
│   ├── pages/     ← HTML 页面
│   ├── js/
│   │   ├── apps/  ← 页面业务逻辑（从 HTML 拆分出的独立 JS）
│   │   ├── *.js   ← 共享库（shared/analysis/schedule/header 等）
│   └── css/
├── workers/       ← Cloudflare Workers API
├── PLAN.md        ← 本文件：开发计划 + 约定
├── README.md      ← 项目说明
└── ARCHITECTURE-PLAN.md  ← 架构设计文档
```

### 2.2 页面结构约定

每个 HTML 页面遵循以下加载顺序：

```html
<link rel="stylesheet" href="../css/style.css" />

<script src="../js/shared.js"></script>
<script src="../js/shared_indexdb.js"></script>
<script src="../js/analysis.js"></script>     <!-- 如需要 -->
<script src="../js/schedule.js"></script>      <!-- 如需要 -->
<script src="../js/header.js"></script>

<!-- 页面内容 -->
<div class="container">...</div>
<div class="toast-container" id="toastContainer"></div>

<!-- 页面业务逻辑（从 HTML 拆出的独立文件） -->
<script src="../js/apps/xxx.js"></script>
```

### 2.3 JS 模块约定

| 文件 | 职责 | 不可依赖 |
|------|------|---------|
| `shared.js` | 数据层、工具函数 | 无 |
| `shared_indexdb.js` | IndexedDB 存储扩展 | `shared.js` |
| `analysis.js` | 统计计算（纯函数） | `shared.js` |
| `schedule.js` | 赛程模块 | `shared.js` |
| `header.js` | 导航组件（自动注入） | `shared.js` + `shared_indexdb.js` |
| `apps/*.js` | 页面业务逻辑 | 以上所有 |

### 2.4 命名约定

- `Shared` — 全局数据层对象
- `Analysis` — 全局统计对象
- `Schedule` — 全局赛程对象
- `*App` — 页面业务逻辑（`StatsApp` / `TrainingApp` / `TasksApp` / `AdminApp`）
- `*Adapter` — 存储适配器（见章节三）

---

## 三、存储抽象层约定（StorageAdapter）

> **计划实施阶段**：Phase 4
> **目标**：统一数据访问接口，支持可插拔存储后端

### 3.1 适配器接口

所有存储后端必须实现以下方法：

```javascript
class StorageAdapter {
    async connect(config)     // 初始化连接
    async disconnect()        // 断开连接
    async get(key)            // 读取数据，不存在返回 null
    async set(key, value)     // 写入数据
    async delete(key)         // 删除数据
    async list(prefix)        // 列出匹配前缀的键
    isAvailable()             // 返回当前是否可用
    getStatus()               // 返回状态信息（用于 UI 显示）
}
```

### 3.2 内置适配器

| 适配器 | 说明 | 存储引擎 | 状态 |
|--------|------|---------|:----:|
| `LocalStorageAdapter` | 浏览器 localStorage | 本地 | ⏳ 待提取 |
| `IndexedDBAdapter` | 浏览器 IndexedDB (STS_DB) | 本地 | ⏳ 待提取 |
| `CloudflareAdapter` | Cloudflare Workers + D1 | 云端 | ⏳ 待实现 |
| `CustomAPIAdapter` | 用户自定义 HTTP API | 云端 | ⏳ 待实现 |

### 3.3 如何添加一个新的存储后端

1. 创建一个类继承 `StorageAdapter`
2. 实现所有接口方法
3. 在 `DataStore` 中注册，或用户通过 `DataStore.use('custom', { adapter: MyAdapter })` 传入

**示例：添加 Firebase 后端**

```javascript
class FirebaseAdapter extends StorageAdapter {
    async connect(config) {
        this.db = firebase.firestore();
        this.collection = config.collection || 'makex';
    }
    async get(key) {
        const doc = await this.db.collection(this.collection).doc(key).get();
        return doc.exists ? doc.data() : null;
    }
    async set(key, value) {
        await this.db.collection(this.collection).doc(key).set(value);
    }
    async delete(key) {
        await this.db.collection(this.collection).doc(key).delete();
    }
    // ...
}

// 使用
DataStore.use('custom', { adapter: FirebaseAdapter, collection: 'my-data' });
```

### 3.4 用户配置方式

用户在教务管理页面可选择数据源：

| UI 选项 | 对应适配器 | 需要配置 |
|---------|-----------|---------|
| 📦 localStorage | `LocalStorageAdapter` | 无 |
| 🗄️ IndexedDB (STS_DB) | `IndexedDBAdapter` | 无 |
| ☁️ Cloudflare | `CloudflareAdapter` | 无需（自动使用当前域名） |
| 🔗 自定义 API | `CustomAPIAdapter` | API 地址 + 令牌（可选） |

---

## 四、阶段详情

### Phase 1 ✅ 已完成

- [x] 创建 `docs/` 目录，前端文件移入
- [x] 创建 `src/` 目录，Cloudflare 项目结构
- [x] 内联脚本拆分为 `apps/*.js`
- [x] `index.html` 改为首页（取代 stats.html 的跳转）
- [x] 更新 `README.md`

### Phase 2 ⏳ 待开始

- [ ] 创建 `workers/` 目录结构
- [ ] 实现 D1 Schema（11 张表）
- [ ] JWT 认证（登录/登出/验证）
- [ ] CRUD Routes（students/groups/tasks/trainings/scores）
- [ ] 权限校验（admin / coach / student）
- [ ] `wrangler dev` 本地测试

### Phase 3 ⏳ 待开始

- [ ] 根目录添加 `_headers`（安全头、CORS）
- [ ] 根目录添加 `_routes.json`（路由规则）
- [ ] 根目录添加 `wrangler.toml`（Pages 配置）

### Phase 4 ⏳ 待开始 — 存储抽象层

- [ ] 定义 `StorageAdapter` 抽象类（在 `src/js/adapters/` 下）
- [ ] 提取 `LocalStorageAdapter`（从 `shared.js`）
- [ ] 提取 `IndexedDBAdapter`（从 `shared_indexdb.js`）
- [ ] 实现 `CloudflareAdapter`
- [ ] 实现 `CustomAPIAdapter`
- [ ] admin.html 增加数据源选择 UI
- [ ] 登录 UI（JWT 令牌管理）

### Phase 5 ⏳ 待开始

- [ ] Cloudflare Dashboard 创建 Pages 项目
- [ ] 连接 GitHub 仓库
- [ ] 创建 D1 数据库，执行 `schema.sql`
- [ ] 部署 Workers
- [ ] 端到端验证
- [ ] README 更新入口

---

## 五、决策记录

| 日期 | 决策 | 理由 |
|------|------|------|
| 2026-07-30 | 前端文件放入 `docs/`，GitHub Pages 从 `/docs` 发布 | 保持 GitHub Pages 可用性，逐步迁移到 Cloudflare |
| 2026-07-30 | `index.html` 作为首页，取代 stats.html 跳转 | 更符合直觉，`/` 直接显示内容 |
| 2026-07-30 | 存储抽象层采用 StorageAdapter 模式，Phase 4 实施 | 需要等 Workers API 就绪后统一做 |
| 2026-07-30 | Cloudflare 部署采用 Git 集成方式 | Dashboard 连接 GitHub 自动部署，无需 wrangler CLI |

---

## 六、验证清单

### 每次提交前检查

```
[ ] src/pages/*.html 在浏览器打开无 404
[ ] Console 无 JS 错误
[ ] 功能操作正常（增删改查）
[ ] docs/ 版本仍然可用（GitHub Pages）
```

### Phase 2 验证

```
[ ] wrangler dev 启动无错误
[ ] POST /api/auth/login 返回 token
[ ] GET /api/students 返回列表（需认证）
[ ] POST /api/students 创建成功
[ ] D1 数据持久化（重启后数据仍在）
```

### Phase 5 验证

```
[ ] Pages 域名可访问
[ ] 登录 → 数据同步 → 登出 全流程
[ ] GitHub Pages 仍然可用（纯本地模式）
[ ] display 大屏模式正常
[ ] CSV 导出正常
```
