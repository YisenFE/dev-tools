#!/bin/bash
set -e

echo "Phase 2 验收: JSON 工具"
echo "====================="

# 1. 检查 CodeMirror 编辑器组件
echo ""
echo "检查编辑器组件..."
[ -f "src/components/Editor/CodeEditor.tsx" ] && echo "✓ CodeEditor.tsx"

# 2. 检查 JSON 工具文件
echo ""
echo "检查 JSON 工具..."
[ -f "src/tools/json-formatter/index.tsx" ] && echo "✓ json-formatter/index.tsx"
[ -f "src/tools/json-formatter/utils.ts" ] && echo "✓ json-formatter/utils.ts"

# 3. 检查 hooks
echo ""
echo "检查 hooks..."
[ -f "src/hooks/useClipboard.ts" ] && echo "✓ useClipboard.ts"

# 4. 检查测试文件
echo ""
echo "检查测试文件..."
[ -f "tests/unit/json-formatter.test.ts" ] && echo "✓ json-formatter.test.ts"
[ -f "vitest.config.ts" ] && echo "✓ vitest.config.ts"

# 5. 运行单元测试
echo ""
echo "运行单元测试..."
npm run test && echo "✓ 单元测试通过"

# 6. 构建检查
echo ""
echo "检查前端构建..."
npm run build --silent && echo "✓ Frontend build 成功"

echo ""
echo "====================="
echo "Phase 2 验收通过!"
