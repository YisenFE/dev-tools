# DevTools

macOS 开发者工具集应用，类似 DevUtils。

## 项目状态
- 当前阶段: Phase 2 (已完成)
- 最后更新: 2026-01-11

## 技术栈
- Tauri 2.x + React 18 + TypeScript + Vite
- UI: Tailwind CSS
- 编辑器: CodeMirror 6
- 状态: Zustand
- 测试: Vitest + Playwright

## 快速启动
```bash
npm install
source "$HOME/.cargo/env"  # 加载 Rust 环境
npm run tauri dev
```

## 阶段进度

| Phase | 说明 | 状态 |
|-------|------|------|
| 0 | 项目骨架 | ✅ 完成 |
| 1 | UI 框架 | ✅ 完成 |
| 2 | JSON 工具 | ✅ 完成 |
| 3 | 扩展工具 | 未开始 |
| 4 | 增强体验 | 未开始 |
| 5 | 发布准备 | 未开始 |

## 已完成功能
- [x] Tauri + React + TypeScript 项目初始化
- [x] Tailwind CSS 配置
- [x] 侧边栏布局 (工具列表 + 搜索框)
- [x] 主内容区布局
- [x] React Router 路由
- [x] 深色/浅色/系统主题切换
- [x] 工具页面占位
- [x] CodeMirror 6 编辑器组件
- [x] JSON 格式化/压缩/校验/排序功能
- [x] 复制到剪贴板功能
- [x] Vitest 单元测试 (15 个测试通过)

## 下一步 (Phase 3)
- [ ] Base64 编解码工具
- [ ] URL 编解码工具
- [ ] HTML 编解码工具
- [ ] XML 格式化工具 (可选)

## 关键决策
- 使用 Tauri 而非 Electron (内存占用更小)
- 使用 CodeMirror 6 而非 Monaco (包体积更小)
- 全局快捷键 `Cmd+Shift+D` 唤起

## 计划文件
详细实现计划见: `.claude/plans/breezy-leaping-stearns.md`
