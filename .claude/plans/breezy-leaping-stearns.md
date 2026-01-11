# DevTools - macOS 开发者工具集应用

## 项目概述
构建一个类似 DevUtils 的 macOS 开发者工具集应用，使用 Tauri + React 技术栈，追求高性能和低内存占用。

---

## 上下文管理策略

### 每个 Phase 结束时必须执行：
1. **Git Commit** - 提交当前阶段所有代码
   ```bash
   git add -A && git commit -m "Phase X: 描述"
   ```

2. **更新计划进度** - 在本文件的"当前进度"表格中标记完成

3. **更新 CLAUDE.md** - 记录项目当前状态（见下方模板）

### CLAUDE.md 模板
```markdown
# DevTools

## 项目状态
- 当前阶段: Phase X
- 最后更新: YYYY-MM-DD

## 快速启动
npm install
npm run tauri dev

## 已完成功能
- [x] 功能1
- [x] 功能2

## 下一步
- [ ] 待完成任务

## 关键决策记录
- 使用 CodeMirror 6 而非 Monaco (体积考虑)
- ...
```

### 新对话恢复上下文
新对话开始时，Claude 会自动读取：
1. `CLAUDE.md` - 项目状态概览
2. `.claude/plans/*.md` - 详细计划
3. `git log` - 提交历史

这样即使 context 用尽，新对话也能快速恢复进度。

---

## 技术栈
- **前端**: React 18 + TypeScript + Vite
- **后端**: Tauri 2.x (Rust)
- **UI**: Tailwind CSS + Radix UI
- **编辑器**: CodeMirror 6
- **状态**: Zustand
- **测试**: Vitest (单元) + Playwright (E2E)

---

## Phase 0: 项目骨架
**目标**: 能启动的 Tauri 应用空壳

### 任务
- [ ] 使用 `npm create tauri-app` 初始化项目
- [ ] 验证 `npm run tauri dev` 能正常启动

### 交付物
- 可启动的空白窗口

### 自动化验收
```bash
# scripts/verify-phase0.sh
#!/bin/bash
set -e

echo "Phase 0 验收: 项目骨架"

# 1. 检查关键文件存在
[ -f "package.json" ] && echo "✓ package.json"
[ -f "src-tauri/Cargo.toml" ] && echo "✓ Cargo.toml"
[ -f "src-tauri/tauri.conf.json" ] && echo "✓ tauri.conf.json"

# 2. 依赖安装检查
npm ci --silent && echo "✓ npm install"

# 3. TypeScript 编译检查
npm run build 2>/dev/null && echo "✓ Frontend build"

# 4. Rust 编译检查
cd src-tauri && cargo check 2>/dev/null && echo "✓ Rust check"

echo "Phase 0 验收通过!"
```

---

## Phase 1: 基础 UI 框架
**目标**: 完整的应用布局和导航

### 任务
- [ ] 配置 Tailwind CSS
- [ ] 创建侧边栏组件 (工具列表 + 搜索框)
- [ ] 创建主内容区布局
- [ ] 实现路由 (react-router)
- [ ] 创建空的工具页面占位
- [ ] 实现深色/浅色主题切换

### 项目结构
```
src/
├── components/
│   └── Layout/
│       ├── Sidebar.tsx
│       ├── MainContent.tsx
│       └── index.tsx
├── tools/
│   └── json-formatter/
│       └── index.tsx (占位)
├── App.tsx
└── main.tsx
```

### 交付物
- 完整的双栏布局
- 可点击的工具导航
- 主题切换功能

### 自动化验收
```typescript
// tests/e2e/phase1.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test.describe('Phase 1: UI 框架', () => {
  test('侧边栏显示工具列表', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="tool-item"]')).toHaveCount.greaterThan(0);
  });

  test('点击工具切换主内容区', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="tool-json"]');
    await expect(page).toHaveURL(/.*json/);
    await expect(page.locator('[data-testid="main-content"]')).toContainText('JSON');
  });

  test('主题切换生效', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');

    // 默认浅色
    await expect(html).not.toHaveClass(/dark/);

    // 切换到深色
    await page.click('[data-testid="theme-toggle"]');
    await expect(html).toHaveClass(/dark/);
  });
});
```

```bash
# scripts/verify-phase1.sh
npm run test:e2e -- tests/e2e/phase1.spec.ts
```

---

## Phase 2: 编辑器组件 + JSON 工具
**目标**: 第一个完整可用的工具

### 任务
- [ ] 集成 CodeMirror 6 编辑器
- [ ] 创建通用 CodeEditor 组件
- [ ] 实现 JSON 格式化功能
- [ ] 实现 JSON 压缩功能
- [ ] 实现语法校验和错误提示
- [ ] 添加复制到剪贴板功能

### 项目结构
```
src/
├── components/
│   └── Editor/
│       └── CodeEditor.tsx
├── tools/
│   └── json-formatter/
│       ├── index.tsx
│       └── utils.ts
└── hooks/
    └── useClipboard.ts
```

### 交付物
- 可复用的代码编辑器组件
- 完整的 JSON 格式化工具

### 自动化验收
```typescript
// tests/unit/json-formatter.test.ts (Vitest)
import { describe, it, expect } from 'vitest';
import { formatJson, minifyJson, validateJson } from '@/tools/json-formatter/utils';

describe('JSON Formatter', () => {
  const validJson = '{"name":"test","value":123}';
  const invalidJson = '{name: invalid}';

  it('格式化 JSON', () => {
    const result = formatJson(validJson);
    expect(result).toContain('\n');
    expect(result).toContain('  '); // 缩进
  });

  it('压缩 JSON', () => {
    const formatted = formatJson(validJson);
    const minified = minifyJson(formatted);
    expect(minified).not.toContain('\n');
    expect(minified).not.toContain('  ');
  });

  it('校验有效 JSON', () => {
    const result = validateJson(validJson);
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('校验无效 JSON 返回错误', () => {
    const result = validateJson(invalidJson);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
```

```typescript
// tests/e2e/phase2.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test.describe('Phase 2: JSON 工具', () => {
  test('JSON 格式化流程', async ({ page }) => {
    await page.goto('/json');

    // 输入 JSON
    const input = '{"a":1,"b":2}';
    await page.locator('[data-testid="input-editor"]').fill(input);

    // 点击格式化
    await page.click('[data-testid="btn-format"]');

    // 验证输出包含缩进
    const output = await page.locator('[data-testid="output-editor"]').textContent();
    expect(output).toContain('\n');
  });

  test('无效 JSON 显示错误', async ({ page }) => {
    await page.goto('/json');
    await page.locator('[data-testid="input-editor"]').fill('{invalid}');
    await page.click('[data-testid="btn-format"]');
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('复制功能', async ({ page }) => {
    await page.goto('/json');
    await page.locator('[data-testid="input-editor"]').fill('{"a":1}');
    await page.click('[data-testid="btn-format"]');
    await page.click('[data-testid="btn-copy"]');
    await expect(page.locator('[data-testid="copy-success"]')).toBeVisible();
  });
});
```

```bash
# scripts/verify-phase2.sh
npm run test -- tests/unit/json-formatter.test.ts
npm run test:e2e -- tests/e2e/phase2.spec.ts
```

---

## Phase 3: 扩展工具集
**目标**: 补充编解码工具

### 3.1 Base64 编解码
- [ ] 文本 Base64 编码/解码
- [ ] 自动检测输入类型

### 3.2 URL 编解码
- [ ] URL 编码/解码
- [ ] URL 参数解析展示

### 3.3 HTML 编解码
- [ ] HTML 实体编码/解码

### 3.4 XML 格式化 (可选)
- [ ] XML 格式化/压缩

### 交付物
- 4 个额外的工具

### 自动化验收
```typescript
// tests/unit/encoders.test.ts (Vitest)
import { describe, it, expect } from 'vitest';
import { encodeBase64, decodeBase64 } from '@/tools/base64/utils';
import { encodeUrl, decodeUrl, parseUrlParams } from '@/tools/url-encoder/utils';
import { encodeHtml, decodeHtml } from '@/tools/html-encoder/utils';

describe('Base64', () => {
  it('编码和解码互逆', () => {
    const text = 'Hello, 世界!';
    expect(decodeBase64(encodeBase64(text))).toBe(text);
  });

  it('自动检测 Base64 输入', () => {
    const encoded = 'SGVsbG8=';
    expect(decodeBase64(encoded)).toBe('Hello');
  });
});

describe('URL Encoder', () => {
  it('编码特殊字符', () => {
    expect(encodeUrl('hello world')).toBe('hello%20world');
    expect(encodeUrl('a=1&b=2')).toContain('%');
  });

  it('解析 URL 参数', () => {
    const params = parseUrlParams('?name=test&value=123');
    expect(params).toEqual({ name: 'test', value: '123' });
  });
});

describe('HTML Encoder', () => {
  it('编码 HTML 实体', () => {
    expect(encodeHtml('<div>')).toBe('&lt;div&gt;');
    expect(encodeHtml('"quotes"')).toBe('&quot;quotes&quot;');
  });

  it('解码 HTML 实体', () => {
    expect(decodeHtml('&lt;div&gt;')).toBe('<div>');
  });
});
```

```bash
# scripts/verify-phase3.sh
npm run test -- tests/unit/encoders.test.ts
```

---

## Phase 4: 增强体验
**目标**: 提升易用性

### 任务
- [ ] 全局快捷键 `Cmd+Shift+D` 唤起窗口
- [ ] 剪贴板自动检测并填充
- [ ] 工具搜索功能
- [ ] 快捷键提示

### 交付物
- 随时可唤起的效率工具

### 自动化验收
```typescript
// tests/e2e/phase4.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test.describe('Phase 4: 增强体验', () => {
  test('工具搜索功能', async ({ page }) => {
    await page.goto('/');

    // 搜索 "json"
    await page.locator('[data-testid="search-input"]').fill('json');

    // 只显示匹配的工具
    const tools = page.locator('[data-testid="tool-item"]');
    await expect(tools).toHaveCount(1);
    await expect(tools.first()).toContainText('JSON');
  });

  test('剪贴板自动填充', async ({ page, context }) => {
    // 模拟剪贴板内容
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.evaluate(() => navigator.clipboard.writeText('{"test":1}'));

    await page.goto('/json');

    // 应自动填充
    await expect(page.locator('[data-testid="input-editor"]')).toContainText('{"test":1}');
  });
});
```

```bash
# scripts/verify-phase4.sh
# 全局快捷键需要手动测试或使用 AppleScript
npm run test:e2e -- tests/e2e/phase4.spec.ts

# 可选: AppleScript 测试全局快捷键
osascript -e 'tell application "System Events" to keystroke "d" using {command down, shift down}'
```

---

## Phase 5: 发布准备
**目标**: 生产就绪

### 任务
- [ ] 应用图标设计
- [ ] 构建 DMG 安装包
- [ ] 代码签名 (可选)
- [ ] README 文档
- [ ] GitHub Release

### 交付物
- 可分发的 .dmg 文件
- 开源仓库就绪

### 自动化验收
```bash
# scripts/verify-phase5.sh
#!/bin/bash
set -e

echo "Phase 5 验收: 发布准备"

# 1. 构建生产版本
npm run tauri build && echo "✓ Build success"

# 2. 检查产物存在
DMG_PATH="src-tauri/target/release/bundle/dmg/*.dmg"
[ -f $DMG_PATH ] && echo "✓ DMG exists"

# 3. 检查 DMG 大小 (应小于 20MB)
SIZE=$(stat -f%z $DMG_PATH)
[ $SIZE -lt 20000000 ] && echo "✓ DMG size < 20MB ($SIZE bytes)"

# 4. 检查 README
[ -f "README.md" ] && echo "✓ README.md exists"

# 5. 验证应用可打开 (macOS)
MOUNT=$(hdiutil attach $DMG_PATH -nobrowse | tail -1 | awk '{print $3}')
[ -d "$MOUNT/DevTools.app" ] && echo "✓ App bundle valid"
hdiutil detach $MOUNT -quiet

echo "Phase 5 验收通过!"
```

---

## CI/CD 集成

```yaml
# .github/workflows/verify.yml
name: Phase Verification

on: [push, pull_request]

jobs:
  verify:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Build check
        run: npm run tauri build
```

---

## 验收命令汇总

```bash
# 运行所有单元测试
npm run test

# 运行所有 E2E 测试
npm run test:e2e

# 运行特定阶段验收
./scripts/verify-phase0.sh
./scripts/verify-phase1.sh
./scripts/verify-phase2.sh
./scripts/verify-phase3.sh
./scripts/verify-phase4.sh
./scripts/verify-phase5.sh

# 运行完整验收
./scripts/verify-all.sh
```

---

## 当前进度

| Phase | 状态 | 验收 |
|-------|------|------|
| Phase 0 | ✅ 完成 | `./scripts/verify-phase0.sh` |
| Phase 1 | ✅ 完成 | `./scripts/verify-phase1.sh` |
| Phase 2 | ✅ 完成 | `./scripts/verify-phase2.sh` |
| Phase 3 | 未开始 | `npm run test -- encoders` |
| Phase 4 | 未开始 | `npm run test:e2e -- phase4` |
| Phase 5 | 未开始 | `./scripts/verify-phase5.sh` |

---

## 关键文件清单
- `src-tauri/tauri.conf.json` - Tauri 配置
- `src/App.tsx` - 主应用入口
- `src/components/Layout/Sidebar.tsx` - 侧边栏
- `src/components/Editor/CodeEditor.tsx` - 代码编辑器
- `src/tools/json-formatter/index.tsx` - JSON 工具
- `tests/unit/` - 单元测试
- `tests/e2e/` - E2E 测试
- `scripts/verify-*.sh` - 阶段验收脚本
