#!/bin/bash
set -e

echo "Phase 5 验收: 发布准备"
echo "========================"

# 1. 检查 README
echo ""
echo "检查文档..."
[ -f "README.md" ] && echo "✓ README.md"

# 2. 检查 Tauri 配置
echo ""
echo "检查 Tauri 配置..."
grep -q '"productName": "DevTools"' src-tauri/tauri.conf.json && echo "✓ 应用名称: DevTools"
grep -q '"version": "0.1.0"' src-tauri/tauri.conf.json && echo "✓ 版本: 0.1.0"

# 3. 运行单元测试
echo ""
echo "运行单元测试..."
npm run test && echo "✓ 单元测试通过"

# 4. 构建检查
echo ""
echo "检查前端构建..."
npm run build --silent && echo "✓ Frontend build 成功"

# 5. 检查 .app 是否存在 (如果已构建)
echo ""
echo "检查应用包..."
APP_PATH="src-tauri/target/release/bundle/macos/DevTools.app"
if [ -d "$APP_PATH" ]; then
    SIZE=$(du -sh "$APP_PATH" | cut -f1)
    echo "✓ DevTools.app 存在 ($SIZE)"
else
    echo "! DevTools.app 未构建 (运行 npm run tauri build 构建)"
fi

echo ""
echo "========================"
echo "Phase 5 验收通过!"
echo ""
echo "构建完整应用: npm run tauri build"
echo "应用位置: src-tauri/target/release/bundle/macos/DevTools.app"
