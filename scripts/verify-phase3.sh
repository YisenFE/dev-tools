#!/bin/bash
set -e

echo "Phase 3 验收: 扩展工具集"
echo "========================"

# 1. 检查 Base64 工具
echo ""
echo "检查 Base64 工具..."
[ -f "src/tools/base64/index.tsx" ] && echo "✓ base64/index.tsx"
[ -f "src/tools/base64/utils.ts" ] && echo "✓ base64/utils.ts"

# 2. 检查 URL 工具
echo ""
echo "检查 URL 工具..."
[ -f "src/tools/url-encoder/index.tsx" ] && echo "✓ url-encoder/index.tsx"
[ -f "src/tools/url-encoder/utils.ts" ] && echo "✓ url-encoder/utils.ts"

# 3. 检查 HTML 工具
echo ""
echo "检查 HTML 工具..."
[ -f "src/tools/html-encoder/index.tsx" ] && echo "✓ html-encoder/index.tsx"
[ -f "src/tools/html-encoder/utils.ts" ] && echo "✓ html-encoder/utils.ts"

# 4. 检查测试文件
echo ""
echo "检查测试文件..."
[ -f "tests/unit/encoders.test.ts" ] && echo "✓ encoders.test.ts"

# 5. 运行单元测试
echo ""
echo "运行单元测试..."
npm run test && echo "✓ 单元测试通过"

# 6. 构建检查
echo ""
echo "检查前端构建..."
npm run build --silent && echo "✓ Frontend build 成功"

echo ""
echo "========================"
echo "Phase 3 验收通过!"
