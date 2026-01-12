#!/bin/bash
set -e

echo "Phase 4 验收: 增强体验"
echo "========================"

# 1. 检查新增文件
echo ""
echo "检查新增文件..."
[ -f "src/hooks/useGlobalShortcut.ts" ] && echo "✓ useGlobalShortcut.ts"
[ -f "src/hooks/useAutoClipboard.ts" ] && echo "✓ useAutoClipboard.ts"
[ -f "playwright.config.ts" ] && echo "✓ playwright.config.ts"
[ -f "tests/e2e/phase4.spec.ts" ] && echo "✓ tests/e2e/phase4.spec.ts"

# 2. 检查 Tauri 插件配置
echo ""
echo "检查 Tauri 插件配置..."
grep -q "tauri-plugin-global-shortcut" src-tauri/Cargo.toml && echo "✓ global-shortcut 插件已配置"
grep -q "tauri-plugin-clipboard-manager" src-tauri/Cargo.toml && echo "✓ clipboard-manager 插件已配置"

# 3. 运行单元测试
echo ""
echo "运行单元测试..."
npm run test && echo "✓ 单元测试通过"

# 4. 构建检查
echo ""
echo "检查前端构建..."
npm run build --silent && echo "✓ Frontend build 成功"

# 5. 运行 E2E 测试
echo ""
echo "运行 E2E 测试..."
npm run test:e2e && echo "✓ E2E 测试通过"

echo ""
echo "========================"
echo "Phase 4 验收通过!"
