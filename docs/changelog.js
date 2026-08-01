// =================================================================
//  Changelog — 修订记录（功能层）
//  记录本系统的版本修订历史（新的在前）
//  布局依赖 header.js；加载顺序：shared.js → shared_indexdb.js → header.js → changelog.js
// =================================================================
if (!window.ChangelogApp) {
const ChangelogApp = {
    CHANGES: [
        { date: '2026-08-01', tag: '修复', type: 'fix', title: '集训成绩录入后主内容不自动刷新', desc: '关闭成绩录入弹窗后即时刷新主内容，成绩/排名无需手动刷新页面' },
        { date: '2026-08-01', tag: '优化', type: 'refactor', title: '拆分新增班级 / 新增学员卡片', desc: '避免同一行输入框与按钮混淆，各卡片职责单一' },
        { date: '2026-08-01', tag: '新增', type: 'feat', title: '学员视图切换（按班级 / 按学员）', desc: '按学员视图平铺展示「学员 | 所属班级」，可点击班级快速改班' },
        { date: '2026-08-01', tag: '重构', type: 'refactor', title: '班级管理 + 学员管理合并为教务管理', desc: '单页展示，学员按班级分组折叠，含空班与「待分班」虚拟分组，班级可直接删除' },
        { date: '2026-08-01', tag: '新增', type: 'feat', title: '数据迁移页', desc: '数据备份 / 跨设备同步（localStorage 导出/导入）统一入口' },
        { date: '2026-08-01', tag: '新增', type: 'feat', title: '开发者工具页', desc: '存储引擎切换 + STS_DB 数据库管理独立成页，移出数据迁移页' },
        { date: '2026-08-01', tag: '优化', type: 'refactor', title: '集训详情「编辑学员」更名「设置」', desc: '按钮实为集训参数配置，标题更名避免误导' },
        { date: '2026-08-01', tag: '优化', type: 'refactor', title: '主站右上角改为「开放工具」', desc: '移除 MAKEX 外链，保留 Inspire 入口' },
        { date: '2026-08-01', tag: '优化', type: 'refactor', title: '移除 header 开发提示与统计条', desc: '精简头部，保留常驻数据存储提示' },
    ],

    init() {
        this.render();
    },

    escapeHtml(str) { return Shared.escapeHtml(str); },

    render() {
        const container = document.getElementById('changelogList');
        if (!container) return;
        const typeColor = { feat: '#dbeafe', fix: '#fee2e2', refactor: '#fef3c7' };
        const typeText = { feat: '#1d4ed8', fix: '#b91c1c', refactor: '#92400e' };
        const items = this.CHANGES.map((c) => {
            const bg = typeColor[c.type] || 'var(--gray-100)';
            const color = typeText[c.type] || 'var(--gray-600)';
            return `<div class="changelog-item">
                <span class="changelog-date">${this.escapeHtml(c.date)}</span>
                <span class="changelog-tag" style="background:${bg};color:${color};">${this.escapeHtml(c.tag)}</span>
                <div class="changelog-body">
                    <div class="changelog-title">${this.escapeHtml(c.title)}</div>
                    <div class="changelog-desc">${this.escapeHtml(c.desc)}</div>
                </div>
            </div>`;
        }).join('');
        container.innerHTML = `<div class="changelog">${items}</div>`;
    },
};

window.ChangelogApp = ChangelogApp;
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.ChangelogApp.init());
} else {
    window.ChangelogApp.init();
}
