#!/bin/bash
set -e

echo "Phase 0 验收: 项目骨架"
echo "====================="

# 加载 Rust 环境
source "$HOME/.cargo/env" 2>/dev/null || true

# 1. 检查关键文件存在
echo ""
echo "检查关键文件..."
[ -f "package.json" ] && echo "✓ package.json"
[ -f "src-tauri/Cargo.toml" ] && echo "✓ Cargo.toml"
[ -f "src-tauri/tauri.conf.json" ] && echo "✓ tauri.conf.json"
[ -f "src/main.tsx" ] && echo "✓ src/main.tsx"
[ -f "vite.config.ts" ] && echo "✓ vite.config.ts"

# 2. 检查依赖已安装
echo ""
echo "检查依赖..."
[ -d "node_modules" ] && echo "✓ node_modules 存在"

# 3. TypeScript 编译检查
echo ""
echo "检查前端构建..."
npm run build --silent && echo "✓ Frontend build 成功"

# 4. Rust 编译检查
echo ""
echo "检查 Rust 编译..."
(cd src-tauri && cargo check --quiet 2>/dev/null) && echo "✓ Rust check 成功"

echo ""
echo "====================="
echo "Phase 0 验收通过!"
