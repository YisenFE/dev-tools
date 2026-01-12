# DevTools

macOS 开发者工具集应用，类似 DevUtils。

## 项目状态
- 当前阶段: Phase 4 (已完成)
- 最后更新: 2026-01-12

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
| 3 | 扩展工具 | ✅ 完成 |
| 4 | 增强体验 | ✅ 完成 |
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
- [x] Vitest 单元测试 (46 个测试通过)
- [x] Base64 编解码工具
- [x] URL 编解码工具
- [x] HTML 编解码工具
- [x] 全局快捷键 Cmd+Shift+D 唤起窗口
- [x] 剪贴板内容自动检测
- [x] 各工具 Paste 按钮支持
- [x] 快捷键提示 UI
- [x] Playwright E2E 测试 (9 个测试通过)

## 下一步 (Phase 5)
- [ ] 应用图标设计
- [ ] 构建 DMG 安装包
- [ ] 代码签名 (可选)
- [ ] README 文档
- [ ] GitHub Release

## 关键决策
- 使用 Tauri 而非 Electron (内存占用更小)
- 使用 CodeMirror 6 而非 Monaco (包体积更小)
- 全局快捷键 `Cmd+Shift+D` 唤起

## 计划文件
详细实现计划见: `.claude/plans/breezy-leaping-stearns.md`

---

## 开发流程规范 (新会话必读)

### 1. 开始新会话时
1. 读取本文件了解项目状态
2. 读取 `.claude/plans/breezy-leaping-stearns.md` 了解详细计划
3. 运行 `git log --oneline -5` 了解最近提交
4. 确认当前阶段，继续未完成的工作

### 2. 每个 Phase 的工作流程
```
1. 创建 TodoWrite 任务列表
2. 实现功能代码
3. 编写单元测试 (tests/unit/)
4. 运行验收脚本 (scripts/verify-phaseX.sh)
5. 更新计划进度表
6. 更新本文件 (CLAUDE.md)
7. Git commit
```

### 3. 验收标准
- 每个 Phase 必须有对应的验收脚本 `scripts/verify-phaseX.sh`
- 单元测试必须全部通过 (`npm run test`)
- 构建必须成功 (`npm run build`)
- E2E 测试在 Phase 4 统一添加 (Playwright)

### 4. Git 提交规范
```
Phase X: 简短描述

- 具体变更1
- 具体变更2
- ...

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### 5. 上下文管理
- 每个 Phase 结束时必须 commit，防止工作丢失
- 如果 context 接近用尽，优先完成当前 Phase 并 commit
- 新会话可通过本文件快速恢复上下文

### 6. 测试命令
```bash
npm run test              # 运行所有单元测试
npm run test:e2e          # 运行 E2E 测试
npm run build             # 构建检查
./scripts/verify-phase0.sh  # Phase 0 验收
./scripts/verify-phase1.sh  # Phase 1 验收
./scripts/verify-phase2.sh  # Phase 2 验收
./scripts/verify-phase3.sh  # Phase 3 验收
./scripts/verify-phase4.sh  # Phase 4 验收
```

### 7. 文件结构约定
```
src/
├── components/          # 通用组件
│   ├── Layout/          # 布局组件
│   └── Editor/          # 编辑器组件
├── tools/               # 工具模块 (每个工具一个目录)
│   └── [tool-name]/
│       ├── index.tsx    # 页面组件
│       └── utils.ts     # 工具函数
├── hooks/               # 自定义 hooks
└── store/               # Zustand store
tests/
├── unit/                # 单元测试
└── e2e/                 # E2E 测试 (Playwright)
scripts/
└── verify-phaseX.sh     # 阶段验收脚本
```
