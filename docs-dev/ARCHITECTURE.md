# 架构设计 — insTools

> 核心架构决策和设计文档。

---

## 存储抽象层（StorageAdapter）

### 设计目标

统一数据访问接口，支持可插拔存储后端。应用层通过统一接口访问数据，不关心底层是 localStorage 还是云端 API。

### 存储方案演进

| 阶段 | 本地存储 | 云端存储 | 说明 |
|------|---------|---------|------|
| 当前 | **localStorage** ⏳ 过渡方案 | — | 前期快速实现，容量有限（5MB），同步读写 |
| 短期 | **IndexedDB (STS_DB)** ✅ 目标 | — | 容量大（>50MB），支持异步/事务/索引 |
| 中期 | IndexedDB | Cloudflare Workers + D1 | 双模：未登录用 IDB，登录后走 API |
| 长期 | IndexedDB | 可切换（CF / 自定义 API） | StorageAdapter 多后端 |

> **localStorage 仅作为前期过渡方案。** 后续本地存储将全面转向 IndexedDB（STS_DB），利用其更大容量、异步 API 和索引查询能力。`LocalStorageAdapter` 仅用于兼容旧数据迁移。\n\n### 适配器接口

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

### 内置适配器

| 适配器 | 说明 | 存储引擎 | 状态 |
|--------|------|---------|:----:|
| `LocalStorageAdapter` | 浏览器 localStorage | 本地 | ⏳ 待提取 |
| `IndexedDBAdapter` | 浏览器 IndexedDB (STS_DB) | 本地 | ⏳ 待提取 |
| `CloudflareAdapter` | Cloudflare Workers + D1 | 云端 | ⏳ 待实现 |
| `CustomAPIAdapter` | 用户自定义 HTTP API | 云端 | ⏳ 待实现 |

### 如何添加新后端

1. 创建一个类继承 `StorageAdapter`
2. 实现所有接口方法
3. 通过 `DataStore.use('custom', { adapter: MyAdapter })` 注册

**示例：**

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
    // ...
}

DataStore.use('custom', { adapter: FirebaseAdapter, collection: 'my-data' });
```

### 用户配置方式

| UI 选项 | 对应适配器 | 需要配置 |
|---------|-----------|---------|
| 📦 localStorage | `LocalStorageAdapter` | 无 |
| 🗄️ IndexedDB (STS_DB) | `IndexedDBAdapter` | 无 |
| ☁️ Cloudflare | `CloudflareAdapter` | 无需 |
| 🔗 自定义 API | `CustomAPIAdapter` | API 地址 + 令牌 |
