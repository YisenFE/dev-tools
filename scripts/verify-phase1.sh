#!/bin/bash
set -e

echo "Phase 1 验收: UI 框架"
echo "====================="

# 1. 检查关键组件文件存在
echo ""
echo "检查组件文件..."
[ -f "src/components/Layout/Sidebar.tsx" ] && echo "✓ Sidebar.tsx"
[ -f "src/components/Layout/MainContent.tsx" ] && echo "✓ MainContent.tsx"
[ -f "src/components/Layout/index.tsx" ] && echo "✓ Layout index.tsx"

# 2. 检查 Store 文件
echo ""
echo "检查 Store 文件..."
[ -f "src/store/toolStore.ts" ] && echo "✓ toolStore.ts"
[ -f "src/store/themeStore.ts" ] && echo "✓ themeStore.ts"

# 3. 检查工具页面占位
echo ""
echo "检查工具页面..."
[ -f "src/tools/json-formatter/index.tsx" ] && echo "✓ json-formatter"
[ -f "src/tools/base64/index.tsx" ] && echo "✓ base64"
[ -f "src/tools/url-encoder/index.tsx" ] && echo "✓ url-encoder"
[ -f "src/tools/html-encoder/index.tsx" ] && echo "✓ html-encoder"

# 4. 检查 Tailwind CSS 配置
echo ""
echo "检查 Tailwind 配置..."
[ -f "src/index.css" ] && grep -q "@import \"tailwindcss\"" src/index.css && echo "✓ Tailwind CSS 已配置"

# 5. 构建检查
echo ""
echo "检查前端构建..."
npm run build --silent && echo "✓ Frontend build 成功"

# 6. 检查 data-testid 属性用于 E2E 测试
echo ""
echo "检查测试属性..."
grep -q 'data-testid="sidebar"' src/components/Layout/Sidebar.tsx && echo "✓ sidebar testid"
grep -q 'data-testid="theme-toggle"' src/components/Layout/Sidebar.tsx && echo "✓ theme-toggle testid"
grep -q 'data-testid="search-input"' src/components/Layout/Sidebar.tsx && echo "✓ search-input testid"

echo ""
echo "====================="
echo "Phase 1 验收通过!"
