#!/bin/bash

# 🚀 Firebase 外卖系统快速启动脚本

echo "🍜 中华美食外卖系统 - Firebase集成版"
echo "======================================"

# 检查环境变量文件
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件"
    echo "📋 请先复制环境变量示例文件："
    echo "   cp .env.example .env"
    echo "🔧 然后编辑 .env 文件，填入你的Firebase配置信息"
    echo ""
    echo "📖 Firebase配置获取方法："
    echo "   1. 访问 https://console.firebase.google.com/"
    echo "   2. 创建新项目或选择现有项目"
    echo "   3. 启用 Firestore Database"
    echo "   4. 在项目设置中获取网络应用配置"
    echo "   5. 将配置值填入 .env 文件"
    exit 1
fi

echo "✅ 发现 .env 配置文件"

# 检查 Node.js 版本
echo "🔍 检查 Node.js 版本..."
if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js，请先安装 Node.js"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js 版本: $NODE_VERSION"

# 检查 npm 
if ! command -v npm &> /dev/null; then
    echo "❌ 未安装 npm，请先安装 npm"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm 版本: $NPM_VERSION"

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已存在，跳过安装"
fi

# 检查 Firebase 配置
echo ""
echo "🔧 检查 Firebase 配置..."
if grep -q "your-firebase-api-key" .env; then
    echo "⚠️  检测到默认配置值，请确保已填入真实的Firebase配置"
    echo "📖 如需帮助，请查看 README-Firebase.md 文件"
fi

# 启动应用
echo ""
echo "🚀 启动应用..."
echo "📱 应用将在 http://localhost:3000 运行"
echo "🛑 按 Ctrl+C 停止应用"
echo ""

# 启动开发服务器
npm start