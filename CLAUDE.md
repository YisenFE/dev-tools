# DevTools

macOS 开发者工具集应用，类似 DevUtils。

## 项目状态
- 当前阶段: Phase 0 (未开始)
- 最后更新: 2026-01-11

## 技术栈
- Tauri 2.x + React 18 + TypeScript + Vite
- UI: Tailwind CSS + Radix UI
- 编辑器: CodeMirror 6
- 测试: Vitest + Playwright

## 快速启动
```bash
npm install
npm run tauri dev
```

## 阶段进度

| Phase | 说明 | 状态 |
|-------|------|------|
| 0 | 项目骨架 | 未开始 |
| 1 | UI 框架 | 未开始 |
| 2 | JSON 工具 | 未开始 |
| 3 | 扩展工具 | 未开始 |
| 4 | 增强体验 | 未开始 |
| 5 | 发布准备 | 未开始 |

## 已完成功能
(暂无)

## 下一步
- [ ] 执行 Phase 0: 使用 `npm create tauri-app` 初始化项目

## 关键决策
- 使用 Tauri 而非 Electron (内存占用更小)
- 使用 CodeMirror 6 而非 Monaco (包体积更小)
- 全局快捷键 `Cmd+Shift+D` 唤起

## 计划文件
详细实现计划见: `.claude/plans/breezy-leaping-stearns.md`
